import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getBestModel, modelCooldowns, COOLDOWN_MS, refreshModelPriority, modelPriorityList, getDynamicDelays } from '@/lib/ai-config';
import { SYLLABUS_DATA } from '@/lib/syllabus';
import { getGeneratedQuestion, blueprintRegistry } from '@/lib/syllabus/index.js';
import { UniversalQuestionSchema } from './questionSchema';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const AI_TIMEOUT_MS = 25000;

/**
 * Builds a specialized prompt for the AI based on Singapore MOE Syllabus constraints.
 */
function getSyllabusPrompt(quantity, level, strand, topic, subtopic, heuristic, difficulty, type, blueprintData) {
  const instructions = [];
  instructions.push(`DIFFICULTY TIERS (Singapore MOE Style):
    - Foundation: Basic mastery. Direct computation, single-step logic.
    - Standard: Grade level expectation. Multi-step word problems.
    - Advanced: Complex logic, high-order heuristics, or non-routine integration.`);

  if (blueprintData) {
    instructions.push(`MANDATORY BLUEPRINT: ${blueprintData.blueprint}`);
    instructions.push(`MANDATORY VOCABULARY: Use these words: ${blueprintData.vocabulary.join(', ')}`);
    instructions.push(`VISUAL STRATEGY: Ensure modelData uses ${blueprintData.visualType} logic.`);
  }

  return `Output ONLY raw, valid JSON array. Do NOT include conversational text.
    Generate ${quantity} new math questions for ${level} based on:
    - Topic: ${topic}
    - Sub-topic: ${subtopic}
    - Difficulty: ${difficulty}
    - Type: ${type}

    Logical Integrity:
    - Zero-Correction Policy: Finalize all logic internally before starting the JSON block.
    - Ordinal Guardrail: If items are removed, the target item MUST remain in the list.
    - Division Guardrail: Ensure total items are perfectly divisible by group size.

    Output Format (JSON array of objects):
    {
      "question": "string",
      "options": ${type === 'MCQ' ? '["A: ...", "B: ...", "C: ...", "D: ..."]' : 'null'},
      "visualItems": "array of 5-8 emojis",
      "modelData": object,
      "solution": "step-by-step mathematical explanation with each step on a new line",
      "finalAnswer": "string or JSON object",
      "hint": "MANDATORY: Provide a conceptual scaffolding hint (do NOT include the answer or specific numbers)",
      "context": {
        "item": "string name",
        "icon": "string emoji"
      }
    }`.trim();
}

/**
 * Robustly extracts and parses JSON from AI response text, handling markdown blocks.
 */
function parseAiResponse(text) {
  try {
    // Look for content between ```json and ``` blocks first
    const jsonBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    let jsonText = jsonBlockMatch ? jsonBlockMatch[1] : text;    
   // Find the outer-most JSON delimiters to handle conversational noise and multiple structures    
   const firstBrace = jsonText.indexOf('{');
   const firstBracket = jsonText.indexOf('[');
   const lastBrace = jsonText.lastIndexOf('}');       
   const lastBracket = jsonText.lastIndexOf(']');
    let start = -1;
    let end = -1;

    // Determine if we are parsing an array or an object based on which comes first
    if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
      start = firstBracket;
      end = lastBracket;
    } else if (firstBrace !== -1) {
      start = firstBrace;
      end = lastBrace;
    }

    if (start !== -1 && end !== -1) {
      jsonText = jsonText.substring(start, end + 1);
    }
    if (!jsonText) throw new Error("Empty JSON block");

    return JSON.parse(jsonText);
  } catch (e) {
    console.error("Failed to parse AI JSON. Error:", e.message, "Raw text:", text);
    throw new Error(`AI returned invalid JSON format: ${e.message}`);
  }
}

/**
 * Safely parses the 'options' field from AI response, handling stringified JSON or "null" strings.
 * @param {*} optionsData The raw options data from the AI response.
 * @returns {Array|null} Parsed options array or null.
 */
function parseAiOptions(optionsData) {
  let parsed = optionsData;
  if (typeof optionsData === 'string') {
    try {
      parsed = JSON.parse(optionsData);
    } catch (e) {
      return null; // Fallback if parsing fails (e.g., "null" string or invalid JSON string)
    }
  }
  
  if (Array.isArray(parsed)) {
    return parsed.map(opt => {
      if (opt === null || opt === undefined) return "";
      if (typeof opt === 'object' && opt !== null) {
        // Handle cases where AI returns {"text": "...", "label": "A"}
        return opt.text || opt.value || opt.label || JSON.stringify(opt);
      }
      return String(opt);
    });
  }
  return null;
}

export async function POST(request) {
  try {
    await refreshModelPriority();
    const body = await request.json();
    const { quantity, metadata, variant = 'visual_line' } = body;
    const { level, topic, subtopic, type, difficulty, heuristic, strand } = metadata || {};
    const subject = metadata?.subject || 'Math';
    const gradeLevel = level === 'Primary 1' ? 'P1' : level;

    const safeMapToSchema = (q) => {
      // Determine if we are processing raw AI output (Nested) or pre-flattened push object
      const isRawAI = !!(q.meta || q.content || q.visualEngine);
      
      let prismaModelData = q.modelData || null;

      // TRANSFORM: Map visualEngine to modelData, respecting blueprint-level overrides
      if (isRawAI && q.visualEngine) {
        prismaModelData = {
          type: q.visualEngine.componentToRender,
          ...q.visualEngine.componentData,
          // AUDIT FIX: Prefer q.modelData.hideVisual (the blueprint decision) over AI defaults
          hideVisual: q.modelData?.hideVisual ?? q.visualEngine.componentData?.hideVisual ?? (q.visualEngine.componentToRender === 'NONE')
        };
      }

      const getStr = (val) => typeof val === 'object' ? JSON.stringify(val) : String(val || "");

      return {
        subject: q.subject || q.meta?.subject || subject || 'Math',
        strand: q.strand || q.meta?.strand || strand || 'Number and Algebra',
        level: q.level || q.meta?.level || level || 'Primary 1',
        gradeLevel: q.gradeLevel || q.meta?.gradeLevel || gradeLevel || 'P1',
        heuristic: q.heuristic || q.meta?.heuristic || heuristic || 'Standard',
        topic: q.topic || q.meta?.topic || topic || 'Whole Numbers',
        subtopic: q.subtopic || q.meta?.subtopic || subtopic || '',
        type: q.type || q.meta?.type || type || 'Short Question',
        difficulty: q.difficulty || q.meta?.difficulty || difficulty || 'Foundation',
        question: getStr(q.content?.questionText || q.questionText || q.question || 'Missing question text'),
        options: q.content?.options || q.options || null,
        modelData: prismaModelData ? JSON.parse(JSON.stringify(prismaModelData)) : null,
        // AUDIT FIX: Ensure visualItems (emojis) are mapped even if nested inside modelData
        visualItems: q.visualItems || prismaModelData?.items || null,
        hint: q.content?.hint || q.hint || q.conceptualHint || q.content?.conceptualHint || null,
        solution: getStr(q.content?.solutionSteps || q.solutionSteps || q.solution || 'Missing solution steps'),
        finalAnswer: String(q.content?.finalAnswer ?? q.finalAnswer ?? ''),
        isApproved: false
      };
    };

    let parsedQuestions = [];

    // --- PATH 1: HYBRID GENERATION (Blueprint Logic + AI Creativity) ---
    const count = Math.min(quantity || 1, 10); 
    
    const safeDifficulty = String(difficulty || "foundation").toLowerCase();
    // Bulletproof case-insensitive matching to guarantee the blueprint is found
    const safeSubtopic = String(subtopic || "").trim().toLowerCase();
    const blueprintId = `${level}-${topic}-${subtopic}`;
    const blueprintMeta = blueprintRegistry[blueprintId] || Object.values(blueprintRegistry).find(bp => String(bp.title).toLowerCase() === safeSubtopic);

    let blueprintResult = null;
    if (blueprintMeta && typeof blueprintMeta.generate === 'function') {
        try {
            // Test generation to confirm the blueprint is valid
            blueprintResult = blueprintMeta.generate(safeDifficulty, variant, type);
        } catch (e) {
            console.warn("Blueprint valid check failed:", e);
        }
    }

    if (blueprintResult && blueprintResult.aiPrompt) {
      for (let i = 0; i < count; i++) {
        
        // --- DYNAMIC VARIANT RANDOMIZATION ---
        let loopVariant = variant;
        // The engine (not the AI) must select the variant logic. 
        // We re-roll if the variant is generic ('visual_line'), missing from the blueprint, or belongs to a different difficulty tier.
        const isGeneric = variant === 'visual_line' || !variant;
        const isValidForTier = blueprintMeta?.variants?.hasOwnProperty(variant) && variant.startsWith(safeDifficulty);

        if (!isValidForTier || isGeneric) {
            const matchingVariants = Object.keys(blueprintMeta.variants || {}).filter(k => k.startsWith(safeDifficulty));
            if (matchingVariants.length > 0) {
                loopVariant = matchingVariants[Math.floor(Math.random() * matchingVariants.length)];
            }
        }
        
        // Call the blueprint directly with the chosen variant
        const stepResult = blueprintMeta.generate(safeDifficulty, loopVariant, type);
        
        let result;
        let retries = 3;
        let currentModelId;
        while (retries > 0) {
          currentModelId = getBestModel();
          const model = genAI.getGenerativeModel({ 
            model: currentModelId,
            generationConfig: { responseMimeType: "application/json", temperature: 0.1, maxOutputTokens: 4096 } 
          }, { apiVersion: 'v1beta' });
          try {
            result = await model.generateContent(stepResult.aiPrompt);
            break; 
          } catch (error) {
            // Handle 503 (Busy) or 429 (Rate Limit) by rotating models
            if ((error.status === 503 || error.status === 429) && retries > 1) {
              console.warn(`⚠️ Model ${currentModelId} busy. Cooling down and rotating...`);
              const { cooldown } = await getDynamicDelays(currentModelId);
              modelCooldowns[currentModelId] = Date.now() + cooldown;
              retries--;
              await new Promise(r => setTimeout(r, 1500));
            } else throw error;
          }
        }

        if (result) {
          const aiResponse = parseAiResponse(result.response.text());
          const aiBatch = Array.isArray(aiResponse) ? aiResponse : [aiResponse];

          for (const q of aiBatch) {
            try {
              // THE NEW ENGINE: Try strict Zod validation first
              const validatedData = UniversalQuestionSchema.parse(q);
              parsedQuestions.push({
                level, topic, subtopic: subtopic || "", heuristic: heuristic || null, 
                difficulty, gradeLevel, subject: "Math",
                type: validatedData.meta.type === 'SHORT_QUESTION' ? 'Short Question' : 
                      validatedData.meta.type === 'STRUCTURED' ? 'Structured' : 
                      validatedData.meta.type,
                strand: strand || blueprintMeta?.strand || "Number and Algebra",
                isApproved: false,
                finalAnswer: validatedData.content.finalAnswer,
                options: validatedData.content.options || [],
                modelData: {
                  ...validatedData.visualEngine.componentData,
                  type: validatedData.visualEngine.componentToRender,
                  hideVisual: validatedData.visualEngine.componentData?.hideVisual !== undefined 
                    ? validatedData.visualEngine.componentData.hideVisual 
                    : validatedData.visualEngine.componentToRender === 'NONE',
                  inputRequirement: validatedData.inputRequirement.inputType,
                  finalAnswer: validatedData.content.finalAnswer,
                  items: validatedData.visualEngine.componentData?.items || []
                },
                question: validatedData.content.questionText,
                solution: validatedData.content.solutionSteps,
                hint: q.content?.hint || q.hint || q.conceptualHint || q.content?.conceptualHint || null
              });
            } catch (zodError) {
              // Pull out AI-specific keys to prevent Prisma Unknown Argument errors
              const { visualItems, modelData, questionText, solutionSteps, ...cleanQ } = q; 

              const prismaModelData = {
                ...(modelData || {}),
                type: blueprintMeta?.visualType === 'DYNAMIC' ? (modelData?.type || "NONE") : (blueprintMeta?.visualType || modelData?.type || "NONE"),
                items: (Array.isArray(visualItems) && visualItems.length > 0) ? visualItems : (modelData?.items || []),
                hideVisual: !!stepResult.metadata?.hideVisual || !!modelData?.hideVisual,
              };
              // Clean up modelData if properties are undefined
              if (prismaModelData.type === undefined) delete prismaModelData.type;
              if (prismaModelData.items === undefined) delete prismaModelData.items;
              if (prismaModelData.hideVisual === undefined) delete prismaModelData.hideVisual;

              parsedQuestions.push({
                ...cleanQ,
                level,
                topic,
                subtopic: subtopic || "",
                heuristic: heuristic || null, 
                difficulty,
                gradeLevel,
                subject: "Math",
                type: type === 'MCQ' ? 'MCQ' : (type.toLowerCase().includes('short') ? 'Short Question' : 'Structured'),
                strand: strand || blueprintMeta?.strand || "Number and Algebra",
                isApproved: false,
                finalAnswer: typeof q.finalAnswer === 'object' ? JSON.stringify(q.finalAnswer) : String(q.finalAnswer || ""),
                options: parseAiOptions(q.options),
                modelData: prismaModelData,
                question: typeof (cleanQ.question || questionText || q.question) === 'object' ? JSON.stringify(cleanQ.question || questionText || q.question) : String(cleanQ.question || questionText || q.question || "Problem data missing"),
                solution: typeof (cleanQ.solution || solutionSteps || q.solution) === 'object' ? JSON.stringify(cleanQ.solution || solutionSteps || q.solution) : String(cleanQ.solution || solutionSteps || q.solution || "No solution provided"),
                hint: q.content?.hint || q.hint || q.conceptualHint || q.content?.conceptualHint || null
              });
            }
          }
        }
        // Small stagger for safety
        if (count > 1) {
          const { stagger } = await getDynamicDelays(currentModelId);
          await new Promise(r => setTimeout(r, stagger));
        }
      }
    } else {
      // --- PATH 2 & 3: LEGACY AI PATHS (For non-migrated topics) ---
     // Robust matching logic to find the blueprint by subtopic title
     const blueprint = Object.values(blueprintRegistry).find(bp => bp.title === subtopic) || blueprintRegistry[`${level}-${topic}-${subtopic}`];
     if (blueprint) {

       for (let i = 0; i < count; i++) {
        // Fix: Variants in current blueprints (counting.js, ordinals.js) are Objects, not Arrays.
        // We convert to entries or filter keys to avoid the .filter() crash.
        let availableVariants = Object.keys(blueprint.variants || {});
        const difficultyVariants = availableVariants.filter(v => v.startsWith(safeDifficulty));
        
        if (difficultyVariants.length > 0) {
          availableVariants = difficultyVariants;
        }
        const selectedVariantKey = availableVariants[Math.floor(Math.random() * availableVariants.length)];
        const variantDescription = blueprint.variants[selectedVariantKey] || "Standard variation";

        const formatInstruction = type === 'MCQ' 
          ? "Format as MCQ. Include an 'options' array with 4 choices. 'finalAnswer' must exactly match one option."
          : "Format as Short Answer. Do not include options.";

        const microPrompt = `Generate 1 Primary 1 Math question. Topic: ${topic}, Subtopic: ${subtopic}. 
        Rule to follow strictly: ${variantDescription}. ${formatInstruction}        
        Context Restriction: Use item "${selectedContextItem}" and emoji "${selectedIcon}".
        Requirement: You MUST return a visualItems array where every element is the emoji "${selectedIcon}". 
        Consistency: Ensure the question text mentions "${selectedContextItem}".

        Output ONLY a valid JSON object: { question, options, solution, finalAnswer, visualItems, modelData, hint, context }. The "hint" field is MANDATORY and must contain conceptual scaffolding. Do not output an array or metadata.`;
        
        let result;
        let retries = 3;
        let currentModelId;
        while (retries > 0) {
          // Select model INSIDE the retry loop to allow rotation if one is busy
          currentModelId = getBestModel();
          const model = genAI.getGenerativeModel({ 
            model: currentModelId,
            // Increased temperature to 0.8 for creative variety in question selection
            generationConfig: { responseMimeType: "application/json", temperature: 0.8, maxOutputTokens: 2048 } 
          }, { apiVersion: 'v1beta' });

          try {
            result = await model.generateContent(microPrompt);
            break; 
          } catch (error) {
            // Handle 503 (Busy) or 429 (Rate Limit) by rotating models
            if ((error.status === 503 || error.status === 429) && retries > 1) {
              console.warn(`⚠️ Model ${currentModelId} busy. Cooling down and rotating...`);
              const { cooldown } = await getDynamicDelays(currentModelId);
              modelCooldowns[currentModelId] = Date.now() + cooldown;
              retries--;
              await new Promise(r => setTimeout(r, 1500));
            } else throw error;
          }
        }

        const rawQData = parseAiResponse(result.response.text());
        const aiDataBatch = Array.isArray(rawQData) ? rawQData : [rawQData];

        for (const q of aiDataBatch) {
          try {
            const validatedData = UniversalQuestionSchema.parse(q);
            parsedQuestions.push({
              level, topic, subtopic, heuristic: heuristic || null, difficulty, gradeLevel, subject: "Math",
              type: validatedData.meta.type === 'SHORT_QUESTION' ? 'Short Question' : 
                    validatedData.meta.type === 'STRUCTURED' ? 'Structured' : 
                    validatedData.meta.type,
              strand: strand || blueprint.strand || "Number and Algebra",
              isApproved: false,
              finalAnswer: validatedData.content.finalAnswer,
              options: validatedData.content.options || [],
              modelData: {
                ...validatedData.visualEngine.componentData,
                type: validatedData.visualEngine.componentToRender,
                hideVisual: validatedData.visualEngine.componentData?.hideVisual !== undefined 
                  ? validatedData.visualEngine.componentData.hideVisual 
                  : validatedData.visualEngine.componentToRender === 'NONE',
                inputRequirement: validatedData.inputRequirement.inputType,
                finalAnswer: validatedData.content.finalAnswer,
                items: validatedData.visualEngine.componentData?.items || []
              },
              question: validatedData.content.questionText,
                solution: validatedData.content.solutionSteps,
                hint: q.content?.hint || q.hint || q.conceptualHint || q.content?.conceptualHint || null
            });
          } catch (zodError) {
            // Pull out AI-specific keys to prevent Prisma Unknown Argument errors
            const { visualItems, modelData, questionText, solutionSteps, ...cleanQ } = q; 

            const prismaModelData = { 
              ...(modelData || {}),
              type: blueprint.visualType === 'DYNAMIC' ? (modelData?.type || "NONE") : blueprint.visualType,
              items: (Array.isArray(visualItems) && visualItems.length > 0) ? visualItems : (modelData?.items || []),
              hideVisual: !!modelData?.hideVisual, // No stepResult.metadata here
            };
            // Clean up modelData if properties are undefined
            if (prismaModelData.type === undefined) delete prismaModelData.type;
            if (prismaModelData.items === undefined) delete prismaModelData.items;
            if (prismaModelData.hideVisual === undefined) delete prismaModelData.hideVisual;

            parsedQuestions.push({
              ...cleanQ,
              level,
              topic,
              subtopic: subtopic || "",
              heuristic: heuristic || "Standard", 
              difficulty, gradeLevel, subject: "Math",
              type: type === 'MCQ' ? 'MCQ' : (type.toLowerCase().includes('short') ? 'Short Question' : 'Structured'),
              strand: strand || blueprint.strand || "Number and Algebra",
              isApproved: false,
              finalAnswer: typeof q.finalAnswer === 'object' ? JSON.stringify(q.finalAnswer) : String(q.finalAnswer || ""),
              options: parseAiOptions(q.options),
              modelData: prismaModelData,
              question: typeof (cleanQ.question || questionText || q.question) === 'object' ? JSON.stringify(cleanQ.question || questionText || q.question) : String(cleanQ.question || questionText || q.question || "Problem data missing"),
              solution: typeof (cleanQ.solution || solutionSteps || q.solution) === 'object' ? JSON.stringify(cleanQ.solution || solutionSteps || q.solution) : String(cleanQ.solution || solutionSteps || q.solution || "No solution provided"),
              hint: q.content?.hint || q.hint || q.conceptualHint || q.content?.conceptualHint || null
            });
          }
        }
        await new Promise(r => setTimeout(r, 1500));
      }
    } else {
      // --- PATH 2: BULK GENERATION FALLBACK (For Legacy Subtopics) ---
      const levelData = SYLLABUS_DATA[level] || [];
      const topicEntry = levelData.find(t => String(t.topic).toLowerCase() === String(topic).toLowerCase());
      const blueprintData = topicEntry?.subtopics?.find(s => s.name === subtopic);
      // Find the blueprint by matching the title to the subtopic
      const bpMeta = Object.values(blueprintRegistry).find(bp => bp.title === subtopic) || blueprintData;

      const systemPrompt = getSyllabusPrompt(Math.min(quantity, 3), level, strand || "Number and Algebra", topic, subtopic, heuristic, difficulty, type, blueprintData);
      let attempts = 0;
      const maxAttempts = modelPriorityList.length;
      let lastError = null;

      while (attempts < maxAttempts) {
        const selectedModelId = getBestModel();
        try {
          const model = genAI.getGenerativeModel({ 
            model: selectedModelId,
            // Standardized temperature across both paths for consistent variety
            generationConfig: { responseMimeType: "application/json", temperature: 0.8, maxOutputTokens: 2048 }
          }, { apiVersion: 'v1beta' });
          
          const aiResult = await Promise.race([
            model.generateContent(systemPrompt),
            new Promise((_, reject) => setTimeout(() => reject(new Error("AI_TIMEOUT")), AI_TIMEOUT_MS))
          ]);

          const aiResponseText = aiResult.response.text();
          const rawData = parseAiResponse(aiResponseText);
          const rawQuestions = Array.isArray(rawData) ? rawData : [rawData];
          
          for (const q of rawQuestions) {
            try {
              const validatedData = UniversalQuestionSchema.parse(q);
              parsedQuestions.push({
                level, topic, subtopic: subtopic || "", heuristic: heuristic || null, 
                difficulty, gradeLevel, subject: "Math",
                type: validatedData.meta.type === 'SHORT_QUESTION' ? 'Short Question' : 
                      validatedData.meta.type === 'STRUCTURED' ? 'Structured' : 
                      validatedData.meta.type,
                strand: strand || bpMeta?.strand || "Number and Algebra",
                isApproved: false,
                finalAnswer: validatedData.content.finalAnswer,
                options: validatedData.content.options || [],
                modelData: {
                  ...validatedData.visualEngine.componentData,
                  type: validatedData.visualEngine.componentToRender,
                  hideVisual: validatedData.visualEngine.componentData?.hideVisual !== undefined 
                    ? validatedData.visualEngine.componentData.hideVisual 
                    : validatedData.visualEngine.componentToRender === 'NONE',
                  inputRequirement: validatedData.inputRequirement.inputType,
                  items: validatedData.visualEngine.componentData?.items || []
                },
                question: validatedData.content.questionText,
                solution: validatedData.content.solutionSteps,
                hint: q.content?.hint || q.hint || q.conceptualHint || q.content?.conceptualHint || null
              });
            } catch (zodError) {
              // Pull out AI-specific keys to prevent Prisma Unknown Argument errors
              const { visualItems, modelData, questionText, solutionSteps, ...cleanQ } = q; 

              const prismaModelData = {
                ...(modelData || {}),
                type: bpMeta?.visualType === 'DYNAMIC' ? (modelData?.type || null) : (bpMeta?.visualType || modelData?.type || null),
                items: (Array.isArray(visualItems) && visualItems.length > 0) ? visualItems : (modelData?.items || []),
                hideVisual: !!modelData?.hideVisual, // No stepResult.metadata here
              };
              // Clean up modelData if properties are undefined
              if (prismaModelData.type === undefined) delete prismaModelData.type;
              if (prismaModelData.items === undefined) delete prismaModelData.items;
              if (prismaModelData.hideVisual === undefined) delete prismaModelData.hideVisual;

              parsedQuestions.push({
                ...cleanQ,
                level, topic, subtopic: subtopic || "", heuristic: heuristic || null, 
                difficulty, gradeLevel, subject: "Math",
                type: type === 'MCQ' ? 'MCQ' : (type.toLowerCase().includes('short') ? 'Short Question' : 'Structured'),
                strand: strand || bpMeta?.strand || "Number and Algebra",
                isApproved: false,
                finalAnswer: typeof q.finalAnswer === 'object' ? JSON.stringify(q.finalAnswer) : String(q.finalAnswer),
                options: parseAiOptions(q.options),
                modelData: prismaModelData,
                question: typeof (cleanQ.question || questionText || q.question) === 'object' ? JSON.stringify(cleanQ.question || questionText || q.question) : String(cleanQ.question || questionText || q.question || "Problem data missing"),
                solution: typeof (cleanQ.solution || solutionSteps || q.solution) === 'object' ? JSON.stringify(cleanQ.solution || solutionSteps || q.solution) : String(cleanQ.solution || solutionSteps || q.solution || "No solution provided"),
                hint: q.content?.hint || q.hint || q.conceptualHint || q.content?.conceptualHint || null
              });
            }
          }
          if (parsedQuestions.length > 0) break;
          break;
        } catch (err) {
          const { cooldown } = await getDynamicDelays(selectedModelId);
          modelCooldowns[selectedModelId] = Date.now() + cooldown;
          attempts++;
          lastError = err;
        }
      }
      if (parsedQuestions.length === 0 && lastError) throw lastError;
    }
    }

    if (parsedQuestions.length > 0) {
      // 1. Map all questions (New or Old style) to the flat Schema
      const finalData = parsedQuestions
        .filter(q => q !== null) // Safety filter
        .map(safeMapToSchema);

      // 2. Perform a SINGLE database insertion
      await prisma.questionBank.createMany({ data: finalData });

      // 3. Return the success response
      return NextResponse.json({ 
        success: true, 
        count: finalData.length 
      });
    }
    
    throw new Error("No questions generated.");
  } catch (error) {
    console.error("❌ Generation failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}