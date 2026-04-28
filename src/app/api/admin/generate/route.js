import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getBestModel, modelCooldowns, COOLDOWN_MS, refreshModelPriority, modelPriorityList } from '@/lib/ai-config';
import { SYLLABUS_DATA } from '@/lib/syllabus';
import { getSubtopicBlueprint } from '@/lib/syllabus/index.js';

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

export async function POST(request) {
  try {
    await refreshModelPriority();
    const body = await request.json();
    const { quantity, metadata } = body;
    const { level, topic, subtopic, type, difficulty, heuristic, strand } = metadata || {};
    const subject = metadata?.subject || 'Math';
    const gradeLevel = level === 'Primary 1' ? 'P1' : level;

    const blueprint = getSubtopicBlueprint(subject, level, topic, subtopic);
    let parsedQuestions = [];

    if (blueprint) {
      // --- PATH 1: MICRO-GENERATION LOOP (For Verified Blueprints) ---
      const count = Math.min(quantity || 1, 3);
      for (let i = 0; i < count; i++) {
        // Task 1: Universal Difficulty Filtering
        let availableVariants = blueprint.variants;
        const difficultyVariants = blueprint.variants.filter(v => v.difficulty === difficulty);
        if (difficultyVariants.length > 0) {
          availableVariants = difficultyVariants;
        }
        const variant = availableVariants[Math.floor(Math.random() * availableVariants.length)];

        const formatInstruction = type === 'MCQ' 
          ? "Format as MCQ. Include an 'options' array with 4 choices. 'finalAnswer' must exactly match one option."
          : "Format as Short Answer. Do not include options.";

        const microPrompt = `Generate 1 Primary 1 Math question. Topic: ${topic}, Subtopic: ${subtopic}. 
        Rule to follow strictly: ${variant.rule}. ${formatInstruction}        
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

        const qData = JSON.parse(result.response.text());
        
        // Destructure to separate AI's creative items from the database fields
        const { visualItems, ...cleanQData } = qData;

        parsedQuestions.push({
          ...cleanQData,
          subject: "Math",
          level, gradeLevel, topic, subtopic, type, difficulty,
          heuristic: heuristic || "Standard",
          // Task 2: Dynamic Metadata Injection
          strand: strand || blueprint.strand || "Number and Algebra",
          isApproved: false,
          finalAnswer: typeof cleanQData.finalAnswer === 'object' ? JSON.stringify(cleanQData.finalAnswer) : String(cleanQData.finalAnswer),          
          modelData: { 
            type: blueprint.visualType, 
            items: visualItems || ["❓", "❓", "❓", "❓", "❓", "❓"]
          }
        });
        await new Promise(r => setTimeout(r, 1500));
      }
    } else {
      // --- PATH 2: BULK GENERATION FALLBACK (For Legacy Subtopics) ---
      const levelData = SYLLABUS_DATA[level] || [];
      const topicEntry = levelData.find(t => t.topic === topic);
      const blueprintData = topicEntry?.subtopics.find(s => s.name === subtopic);

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
          const rawQuestions = JSON.parse(aiResponseText);
          
          parsedQuestions = rawQuestions.map(q => {
            const { visualItems, ...cleanQ } = q;
            return {
              ...cleanQ,
              subject: "Math",
              level, gradeLevel, topic, subtopic, type, difficulty,
              heuristic: heuristic || "Standard",
              strand: strand || "Number and Algebra",
              isApproved: false,
              finalAnswer: typeof cleanQ.finalAnswer === 'object' ? JSON.stringify(cleanQ.finalAnswer) : String(cleanQ.finalAnswer)
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