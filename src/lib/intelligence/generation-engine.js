import { GoogleGenerativeAI } from "@google/generative-ai";
import { getBestModel, modelCooldowns, getDynamicDelays } from '@/lib/ai-config';
import { getBaseSystemInstructions, parseAiResponse, processAiQuestion, getSyllabusPrompt } from '@/lib/intelligence/generation-utils';
import { getLevelStrategy } from '@/lib/intelligence/level-strategies';
import { SYLLABUS_DATA } from '@/lib/syllabus';
import { blueprintRegistry } from '@/lib/syllabus/index.js';
import { prisma } from '@/lib/db';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const AI_TIMEOUT_MS = 25000;

export class GenerationEngine {
  async generateQuestions({ quantity, level, topic, subtopic, type, difficulty, heuristic, strand, variant }) {
    const count = Math.min(quantity || 1, 10);
    const safeDifficulty = String(difficulty || "foundation").toLowerCase();
    const safeSubtopic = String(subtopic || "").trim().toLowerCase();
    
    // 1. Get Level Specific Strategy
    const levelStrategy = getLevelStrategy(level, type);
    let baseSystemInstructions = getBaseSystemInstructions(level) + "\n\nLEVEL CONSTRAINTS:\n" + levelStrategy + "\n\nCRITICAL RULE FOR MULTI_STEP_INPUT: If asked to inject an array of steps, you MUST formulate the mathematical equations (e.g., '17 - 6 = 11'). Step labels should be like 'Working' or 'Equation' (e.g. expectedAnswer: '17-6=11') and 'Final Answer' (e.g. expectedAnswer: '11'). Break down complex problems into multiple working steps. ALWAYS output a valid JSON array of objects!";
    const isVisualTask = safeSubtopic.includes('shape') || safeSubtopic.includes('pattern') || (safeSubtopic === 'time' && (safeDifficulty === 'foundation' || safeDifficulty === 'standard'));
    if (type === 'Structured') {
      if (isVisualTask) {
        baseSystemInstructions += " IMPORTANT: DO NOT ask the student to 'show your working' in the question text because this is a simple visual observation task.";
      } else {
        baseSystemInstructions += " IMPORTANT: You MUST also append a clear instruction to the 'question' text asking the student to provide their working (e.g., 'How many altogether? Show your working and the final answer.').";
      }
    }

    // 2. Resolve Blueprint
    const blueprintId = `${level}-${topic}-${subtopic}`;
    const blueprintMeta = blueprintRegistry[blueprintId] || Object.values(blueprintRegistry).find(bp => String(bp.title).toLowerCase() === safeSubtopic);

    let parsedQuestions = [];

    // Attempt to use hybrid blueprint generator
    if (blueprintMeta && typeof blueprintMeta.generate === 'function') {
      parsedQuestions = await this.generateWithHybridBlueprint({ 
        count, variant, safeDifficulty, type, blueprintMeta, baseSystemInstructions, 
        context: { level, topic, subtopic, heuristic, difficulty, gradeLevel: level === 'Primary 1' ? 'P1' : level, type, strand }
      });
    } else {
      // Fallback to bulk legacy generation
      parsedQuestions = await this.generateWithLegacyPrompt({ 
        count, level, strand, topic, subtopic, heuristic, difficulty, type, blueprintMeta 
      });
    }

    return parsedQuestions;
  }

  async generateWithHybridBlueprint({ count, variant, safeDifficulty, type, blueprintMeta, baseSystemInstructions, context }) {
    let parsedQuestions = [];
    
    // Stateful LRU setup
    const blueprintId = `${context.level}-${context.topic}-${context.subtopic}`;
    const usageKey = `variant_usage_${blueprintId.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
    let usageTracker = {};
    
    try {
      const configRecord = await prisma.systemConfig.findUnique({ where: { key: usageKey } });
      if (configRecord && configRecord.value) {
        usageTracker = configRecord.value;
      }
    } catch (e) {
      console.warn("Could not fetch variant usage tracker from SystemConfig", e);
    }

    
    for (let i = 0; i < count; i++) {
      let loopVariant = variant || 'visual_line';
      const isValidForTier = blueprintMeta?.variants?.hasOwnProperty(loopVariant) && loopVariant.startsWith(safeDifficulty);

      if (!isValidForTier || loopVariant === 'visual_line') {
        const matchingVariants = Object.keys(blueprintMeta.variants || {}).filter(k => k.startsWith(safeDifficulty));
        if (matchingVariants.length > 0) {
          // Stateful LRU Selection: sort by lowest usage count
          matchingVariants.sort((a, b) => (usageTracker[a] || 0) - (usageTracker[b] || 0));
          loopVariant = matchingVariants[0];
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
          const aiResponse = parseAiResponse(result.response.text());
          result.parsedResponse = aiResponse;
          break;
        } catch (error) {
          if (retries > 1) {
            const { cooldown } = await getDynamicDelays(currentModelId);
            modelCooldowns[currentModelId] = Date.now() + cooldown;
            retries--;
            await new Promise(r => setTimeout(r, 1500));
          } else throw error;
        }
      }

      if (result && result.parsedResponse) {
        const aiResponse = result.parsedResponse;
        const aiBatch = Array.isArray(aiResponse) ? aiResponse : [aiResponse];

        for (const q of aiBatch) {
          parsedQuestions.push(processAiQuestion(q, { ...context, blueprintMeta, stepResult, heuristic: loopVariant }));
        }
        
        // Successfully generated, increment usage count
        usageTracker[loopVariant] = (usageTracker[loopVariant] || 0) + 1;
      }
      
      if (count > 1) {
        const { stagger } = await getDynamicDelays(currentModelId);
        await new Promise(r => setTimeout(r, stagger));
      }
    }

    // Persist usage tracking
    try {
      await prisma.systemConfig.upsert({
        where: { key: usageKey },
        update: { value: usageTracker },
        create: { key: usageKey, value: usageTracker }
      });
    } catch (e) {
      console.warn("Could not save variant usage tracker to SystemConfig", e);
    }

    return parsedQuestions;
  }

  async generateWithLegacyPrompt({ count, level, strand, topic, subtopic, heuristic, difficulty, type, blueprintMeta }) {
    let parsedQuestions = [];
    const levelData = SYLLABUS_DATA[level] || [];
    const topicEntry = levelData.find(t => String(t.topic).toLowerCase() === String(topic).toLowerCase());
    const blueprintData = topicEntry?.subtopics?.find(s => s.name === subtopic);
    
    // Mix in the level strategies into the prompt generator
    const levelStrategy = getLevelStrategy(level, type);
    const systemPrompt = getSyllabusPrompt(count, level, strand || "Number and Algebra", topic, subtopic, heuristic, difficulty, type, blueprintData) + "\n\nADDITIONAL RULES:\n" + levelStrategy;
    
    let attempts = 0;
    const maxAttempts = 3;
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
          const context = { level, topic, subtopic, heuristic, difficulty, gradeLevel: level === 'Primary 1' ? 'P1' : level, type, strand, blueprintMeta: blueprintData };
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
    return parsedQuestions;
  }
}
