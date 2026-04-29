import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getBestModel, modelCooldowns, COOLDOWN_MS, refreshModelPriority, modelPriorityList } from '@/lib/ai-config';
import { SYLLABUS_DATA } from '@/lib/syllabus';
import { getGeneratedQuestion, blueprintRegistry } from '@/lib/syllabus/index.js';

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

  instructions.push(`TONE AND VOCABULARY:
    - CRITICAL: You are writing for a primary school student. Use simple, natural language.
    - NEVER use technical jargon like "BASE_TEN_BLOCKS" or "VISUAL_TYPE" in the question text.
    - If the finalAnswer is an equation, format it strictly as "A + B = C" or "C - B = A".`);

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
      "finalAnswer": "string or JSON object"
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
    console.error("Failed to parse AI JSON. Raw text:", text);
    throw new Error("AI returned invalid JSON format.");
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
    return parsed.map(opt => (opt === null || opt === undefined) ? "" : String(opt));
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
    console.log("API RECEIVED -> Level:", level, "Topic:", topic, "Subtopic:", subtopic, "Type:", type, "Difficulty:", difficulty, "Variant:", variant);

    let parsedQuestions = [];

    // --- PATH 1: HYBRID GENERATION (Blueprint Logic + AI Creativity) ---
    const count = Math.min(quantity || 1, 10); // Local generation is cheap, allowing more
    // Robust matching logic to find the blueprint by subtopic title
    const blueprintMeta = Object.values(blueprintRegistry).find(bp => bp.title === subtopic) || blueprintRegistry[`${level}-${topic}-${subtopic}`];
    const blueprintResult = getGeneratedQuestion(level, topic, subtopic, difficulty, variant, type);

    if (blueprintResult && blueprintResult.aiPrompt) {
      for (let i = 0; i < count; i++) {
        
        // --- DYNAMIC VARIANT RANDOMIZATION ---
        // If frontend sent a legacy/generic variant (e.g., 'visual_line'), 
        // randomly pick a strict variant matching the requested difficulty.
        let loopVariant = variant;
        if (blueprintMeta && blueprintMeta.variants && !blueprintMeta.variants.hasOwnProperty(variant)) {
            const matchingVariants = Object.keys(blueprintMeta.variants).filter(k => k.startsWith(difficulty));
            if (matchingVariants.length > 0) {
                loopVariant = matchingVariants[Math.floor(Math.random() * matchingVariants.length)];
            }
        }
        
        const stepResult = getGeneratedQuestion(level, topic, subtopic, difficulty, loopVariant, type);
        
        let result;
        let retries = 2;
        while (retries >= 0) {
          const currentModelId = getBestModel();
          const model = genAI.getGenerativeModel({ 
            model: currentModelId,
            generationConfig: { responseMimeType: "application/json", temperature: 0.8 } 
          });
          try {
            result = await model.generateContent(stepResult.aiPrompt);
            break; 
          } catch (error) {
            if (retries === 0) throw error;
            modelCooldowns[currentModelId] = Date.now() + COOLDOWN_MS;
            retries--;
            await new Promise(r => setTimeout(r, 1000));
          }
        }

        if (result) {
          const rawAiData = parseAiResponse(result.response.text());
          
          // AI sometimes wraps a requested single object in an array; handle both
          const aiData = Array.isArray(rawAiData) ? rawAiData[0] : rawAiData;

          // Extract items from either root or modelData to package into the JSON column
          const itemsToSave = Array.isArray(aiData.visualItems) ? aiData.visualItems : (Array.isArray(aiData.modelData?.items) ? aiData.modelData.items : []);

          parsedQuestions.push({
            question: aiData.question,
            solution: aiData.solution,
            finalAnswer: String(aiData.finalAnswer),
            options: parseAiOptions(aiData.options),
            subject: "Math",
            level, gradeLevel, topic, subtopic: subtopic || "", type, difficulty,
            heuristic: heuristic || "Standard",
            strand: strand || blueprintMeta?.strand || "Number and Algebra",
            isApproved: false,
            
            // UNIVERSAL PIPELINE FIX (Hybrid Path):
            // We must spread aiData.modelData to preserve layout properties like 'groups'
            // while ensuring the system-defined 'type' and 'items' are correctly nested.
            modelData: {
              ...(aiData.modelData || {}),
              type: blueprintMeta?.visualType || aiData.modelData?.type || "NONE",
              items: stepResult.visualItems && stepResult.visualItems.length === 0 ? [] : itemsToSave,
              hideVisual: !!stepResult.metadata?.hideVisual || !!aiData.modelData?.hideVisual
            }
          });
        }
        // Small stagger for safety
        if (count > 1) await new Promise(r => setTimeout(r, 800));
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
        const difficultyVariants = availableVariants.filter(v => v.startsWith(difficulty));
        
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
        Creative Freedom: Choose a theme and emojis that are contextually relevant to the Topic (${topic}) and Subtopic (${subtopic}).
        Requirement: You MUST return a visualItems array of 5-8 emojis that match your theme. These emojis must correspond exactly to the items mentioned in your question text.

        Output ONLY a valid JSON object: { question, options, solution, finalAnswer, visualItems }. Do not output an array or metadata.`;
        
        let result;
        let retries = 3;
        while (retries > 0) {
          // Select model INSIDE the retry loop to allow rotation if one is busy
          const currentModelId = getBestModel();
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
              modelCooldowns[currentModelId] = Date.now() + COOLDOWN_MS;
              retries--;
              await new Promise(r => setTimeout(r, 1500));
            } else throw error;
          }
        }

        const rawQData = parseAiResponse(result.response.text());
        // Handle both single objects and arrays from AI response
        const qData = Array.isArray(rawQData) ? rawQData[0] : rawQData;
        
        // Destructure to separate AI's creative items from the database fields
        const { visualItems: aiVisualItems, ...cleanQData } = qData;

        parsedQuestions.push({
          question: cleanQData.question,
          solution: cleanQData.solution,
          finalAnswer: typeof cleanQData.finalAnswer === 'object' ? JSON.stringify(cleanQData.finalAnswer) : String(cleanQData.finalAnswer || ""),
          options: parseAiOptions(cleanQData.options),
          subject: "Math",
          level, gradeLevel, topic, subtopic, type, difficulty,
          heuristic: heuristic || "Standard",
          // Task 2: Dynamic Metadata Injection
          strand: strand || blueprint.strand || "Number and Algebra",
          isApproved: false,
          modelData: { 
            type: blueprint.visualType, 
            items: aiVisualItems || ["❓", "❓", "❓", "❓", "❓", "❓"]
          }
        });
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
          
          parsedQuestions = (Array.isArray(rawQuestions) ? rawQuestions : []).map(q => {
            // Extract visual properties to prevent them from crashing Prisma's root schema
            const { visualItems, modelData, ...cleanQ } = q; 
            
            return {
              ...cleanQ,
              subject: "Math",
              level, gradeLevel, topic, subtopic, type, difficulty,
              heuristic: heuristic || "Standard",
              strand: strand || "Number and Algebra",
              isApproved: false,
              finalAnswer: typeof cleanQ.finalAnswer === 'object' ? JSON.stringify(cleanQ.finalAnswer) : String(cleanQ.finalAnswer),
              options: parseAiOptions(q.options),
              
              // UNIVERSAL PIPELINE FIX: 
              // Package all visual arrays and the component type into modelData JSON
              modelData: {
                ...(modelData || {}),
                type: bpMeta?.visualType || q.visualType || null,
                items: Array.isArray(visualItems) ? visualItems : []
              }
            };
          });
          break;
        } catch (err) {
          modelCooldowns[selectedModelId] = Date.now() + COOLDOWN_MS;
          attempts++;
          lastError = err;
        }
      }
      if (parsedQuestions.length === 0 && lastError) throw lastError;
    }
    }

    if (parsedQuestions.length > 0) {
      await prisma.questionBank.createMany({ data: parsedQuestions });
      return NextResponse.json({ success: true, count: parsedQuestions.length });
    }
    
    throw new Error("No questions generated.");
  } catch (error) {
    console.error("❌ Generation failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}