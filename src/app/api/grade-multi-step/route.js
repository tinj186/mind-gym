import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getBestModel } from '@/lib/ai-config';
import { buildMultiStepGradingPrompt } from '@/lib/grading/multiStepGrader';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const AI_TIMEOUT_MS = 10000;

export async function POST(req) {
  try {
    const { studentAnswers, expectedSteps, questionText, level, finalAnswer } = await req.json();

    const selectedModelId = getBestModel();
    const model = genAI.getGenerativeModel({ 
      model: selectedModelId,
      generationConfig: { temperature: 0, responseMimeType: "application/json" }
    }, { apiVersion: 'v1beta' });
    
    const prompt = buildMultiStepGradingPrompt({
      level: level || 'Primary 4',
      questionText,
      expectedSteps,
      studentAnswers,
      finalAnswer
    });

    const aiResult = await Promise.race([
      model.generateContent(prompt),
      new Promise((_, reject) => setTimeout(() => reject(new Error("AI_TIMEOUT")), AI_TIMEOUT_MS))
    ]);

    const result = JSON.parse(aiResult.response.text().match(/\{[\s\S]*\}/)[0]);
    return NextResponse.json({ isCorrect: result.isCorrect, reason: result.reason });
  } catch (error) {
    console.error("Multi-step grading failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
