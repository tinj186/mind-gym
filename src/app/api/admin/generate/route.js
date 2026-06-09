import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getBestModel, modelCooldowns, COOLDOWN_MS, refreshModelPriority, modelPriorityList, getDynamicDelays } from '@/lib/ai-config';
import { SYLLABUS_DATA } from '@/lib/syllabus';
import { getGeneratedQuestion, blueprintRegistry } from '@/lib/syllabus/index.js';
import { 
  getSyllabusPrompt, 
  getBaseSystemInstructions, 
  parseAiResponse, 
  processAiQuestion 
} from '@/lib/intelligence/generation-utils';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const AI_TIMEOUT_MS = 25000;

export async function POST(request) {
  try {
    await refreshModelPriority();
    const body = await request.json();
    const { quantity, metadata, variant = 'visual_line' } = body;
    const { level, topic, subtopic, type, difficulty, heuristic, strand } = metadata || {};
    const subject = metadata?.subject || 'Math';
    const gradeLevel = level === 'Primary 1' ? 'P1' : level;

    const baseSystemInstructions = getBaseSystemInstructions(level);

    let parsedQuestions = [];

    const count = Math.min(quantity || 1, 10);
    const safeDifficulty = String(difficulty || "foundation").toLowerCase();
    const safeSubtopic = String(subtopic || "").trim().toLowerCase();
    const blueprintId = `${level}-${topic}-${subtopic}`;
    const blueprintMeta = blueprintRegistry[blueprintId] || Object.values(blueprintRegistry).find(bp => String(bp.title).toLowerCase() === safeSubtopic);

    let blueprintResult = null;
    if (blueprintMeta && typeof blueprintMeta.generate === 'function') {
      try {
        blueprintResult = blueprintMeta.generate(safeDifficulty, variant, type);
      } catch (e) {
        console.warn("Blueprint valid check failed:", e);
      }
    }

    if (blueprintResult && blueprintResult.aiPrompt) {
      // --- PATH 1: HYBRID GENERATION (Blueprint Logic + AI Creativity) ---
      for (let i = 0; i < count; i++) {
        let loopVariant = variant;
        const isGeneric = variant === 'visual_line' || !variant;
        const isValidForTier = blueprintMeta?.variants?.hasOwnProperty(variant) && variant.startsWith(safeDifficulty);

        if (!isValidForTier || isGeneric) {
          const matchingVariants = Object.keys(blueprintMeta.variants || {}).filter(k => k.startsWith(safeDifficulty));
          if (matchingVariants.length > 0) {
            loopVariant = matchingVariants[Math.floor(Math.random() * matchingVariants.length)];
          }
        }

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
            result = await model.generateContent(baseSystemInstructions + "\n" + stepResult.aiPrompt);
            break;
          } catch (error) {
            if ((error.status === 503 || error.status === 429) && retries > 1) {
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
            const context = { level, topic, subtopic, heuristic: loopVariant, difficulty, gradeLevel, type, strand, blueprintMeta, stepResult };
            parsedQuestions.push(processAiQuestion(q, context));
          }
        }
        if (count > 1) {
          const { stagger } = await getDynamicDelays(currentModelId);
          await new Promise(r => setTimeout(r, stagger));
        }
      }
    } else {
      const blueprint = Object.values(blueprintRegistry).find(bp => bp.title === subtopic) || blueprintRegistry[`${level}-${topic}-${subtopic}`];
      if (blueprint) {
        // --- PATH 3: LEGACY AI PATHS (For non-migrated topics) ---
        for (let i = 0; i < count; i++) {
          let availableVariants = Object.keys(blueprint.variants || {});
          const difficultyVariants = availableVariants.filter(v => v.startsWith(safeDifficulty));
          if (difficultyVariants.length > 0) availableVariants = difficultyVariants;
          
          const selectedVariantKey = availableVariants[Math.floor(Math.random() * availableVariants.length)];
          const variantDescription = blueprint.variants[selectedVariantKey] || "Standard variation";
          const formatInstruction = type === 'MCQ'
            ? "Format as MCQ. Include an 'options' array with 4 choices. 'finalAnswer' must exactly match one option."
            : "Format as Short Answer. Do not include options.";

          const microPrompt = `Generate 1 Primary 1 Math question. Topic: ${topic}, Subtopic: ${subtopic}. 
        Rule to follow strictly: ${variantDescription}. ${formatInstruction}        
        Output ONLY a valid JSON object: { question, options, solution, finalAnswer, visualItems, modelData, hint, context }. The "hint" field is MANDATORY and must contain conceptual scaffolding. Do not output an array or metadata.`;

          let result;
          let retries = 3;
          let currentModelId;
          while (retries > 0) {
            currentModelId = getBestModel();
            const model = genAI.getGenerativeModel({
              model: currentModelId,
              generationConfig: { responseMimeType: "application/json", temperature: 0.8, maxOutputTokens: 2048 }
            }, { apiVersion: 'v1beta' });

            try {
              result = await model.generateContent(baseSystemInstructions + "\n" + microPrompt);
              break;
            } catch (error) {
              if ((error.status === 503 || error.status === 429) && retries > 1) {
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
            const context = { level, topic, subtopic, heuristic, difficulty, gradeLevel, type, strand, blueprintMeta: blueprint };
            parsedQuestions.push(processAiQuestion(q, context));
          }
          await new Promise(r => setTimeout(r, 1500));
        }
      } else {
        // --- PATH 2: BULK GENERATION FALLBACK (For Legacy Subtopics) ---
        const levelData = SYLLABUS_DATA[level] || [];
        const topicEntry = levelData.find(t => String(t.topic).toLowerCase() === String(topic).toLowerCase());
        const blueprintData = topicEntry?.subtopics?.find(s => s.name === subtopic);
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
              const context = { level, topic, subtopic, heuristic, difficulty, gradeLevel, type, strand, blueprintMeta: bpMeta };
              parsedQuestions.push(processAiQuestion(q, context));
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
      const finalData = parsedQuestions.filter(q => q !== null);
      await prisma.questionBank.createMany({ data: finalData });
      return NextResponse.json({ success: true, count: finalData.length });
    }

    throw new Error("No questions generated.");
  } catch (error) {
    console.error("❌ Generation failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}