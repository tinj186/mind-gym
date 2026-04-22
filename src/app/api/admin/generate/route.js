import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getBestModel, modelCooldowns, COOLDOWN_MS, refreshModelPriority } from '@/lib/ai-config';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const AI_TIMEOUT_MS = 25000;

/**
 * Builds a specialized prompt for the AI based on Singapore MOE Syllabus constraints.
 */
function getSyllabusPrompt(quantity, level, topic, subtopic, heuristic, difficulty, type) {
  const instructions = [];
  if (level?.includes('1') || level?.includes('2')) {
    instructions.push("Pedagogy: Use concrete objects (toys, sweets, fruits) and keep all numbers < 30.");
  }
  if (heuristic === 'PART_WHOLE') {
    instructions.push("Modeling: Ensure the problem allows for a clear 'Total' and at least two distinct 'Parts'.");
  } else if (heuristic === 'COMPARISON') {
    instructions.push("Modeling: Create a scenario where one entity must have 'more' or 'fewer' than another to facilitate comparison bars.");
  }

  if (type === 'Short Question') {
    instructions.push("Constraint: Do not use names or stories. Provide a pure mathematical equation.");
  } else if (type === 'MCQ') {
    instructions.push("Format: Provide 4 options labeled A, B, C, D. Ensure distractors are common mathematical errors.");
  } else if (type === 'Structured') {
    instructions.push("Complexity: Generate a multi-step word problem requiring an advanced Bar Model decomposition.");
  }

  return `
    You are a Singapore MOE Mathematics specialist. 
    Generate ${quantity} new math questions based on the following metadata.

    Context:
    - Level: ${level}
    - Topic: ${topic}
    - Sub-topic: ${subtopic || 'N/A'}
    - Difficulty: ${difficulty}
    - Type: ${type}
    - Heuristic: ${heuristic}

    Expert Instructions:
    ${instructions.join('\n    ')}

    Output Format:
    Return ONLY a JSON array of objects matching this schema:
    {
      "subject": "Math",
      "level": "${level}",
      "gradeLevel": "P${level?.match(/\d/)?.[0] || '?'}",
      "heuristic": "${heuristic}",
      "topic": "${topic}",
      "subtopic": "${subtopic || ''}",
      "type": "${type}",
      "difficulty": "${difficulty}",
      "question": "string",
      "options": ["A: ...", "B: ...", "C: ...", "D: ..."], 
      "solution": "string (pedagogical explanation of solution logic)",
      "finalAnswer": "string",
      "isApproved": false
    }
  `.trim();
}

export async function POST(req) {
  try {
    await refreshModelPriority();
    const body = await req.json();
    const { quantity, metadata } = body;
    const { level, topic, subtopic, type, difficulty } = metadata || {};
    const heuristic = metadata?.heuristic || topic;

    const systemPrompt = getSyllabusPrompt(quantity, level, topic, subtopic, heuristic, difficulty, type);
    let attempts = 0;
    const maxAttempts = 2;
    let lastError = null;

    while (attempts < maxAttempts) {
      const selectedModelId = getBestModel();
      try {
        const model = genAI.getGenerativeModel({ model: selectedModelId }, { apiVersion: 'v1beta' });
        const aiResult = await Promise.race([
          model.generateContent(systemPrompt),
          new Promise((_, reject) => setTimeout(() => reject(new Error("AI_TIMEOUT")), AI_TIMEOUT_MS))
        ]);

        const aiResponseText = aiResult.response.text();
        const jsonMatch = aiResponseText.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error("INVALID_JSON_FORMAT");
        const parsedQuestions = JSON.parse(jsonMatch[0]);

        await prisma.questionBank.createMany({ data: parsedQuestions });
        return NextResponse.json({ success: true, count: parsedQuestions.length });
      } catch (err) {
        attempts++;
        lastError = err;
        modelCooldowns[selectedModelId] = Date.now() + COOLDOWN_MS;
      }
    }
    throw lastError;
  } catch (error) {
    console.error("❌ Generation failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}