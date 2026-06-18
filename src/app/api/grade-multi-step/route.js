import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getBestModel } from '@/lib/ai-config';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const AI_TIMEOUT_MS = 10000;

export async function POST(req) {
  try {
    const { studentAnswers, expectedSteps, questionText } = await req.json();

    const selectedModelId = getBestModel();
    const model = genAI.getGenerativeModel({ 
      model: selectedModelId,
      generationConfig: { temperature: 0, responseMimeType: "application/json" }
    }, { apiVersion: 'v1beta' });
    
    const prompt = `You are a strict math grader for Primary 1.
Question: ${questionText}
Expected Steps: ${JSON.stringify(expectedSteps)}
Student Answers: ${JSON.stringify(studentAnswers)}

Evaluate if the student's answers are mathematically valid and arrive at the correct final answer.
It is OK if the student chose a different valid associative order for addition/subtraction (e.g. adding different numbers first) as long as it logically solves the problem.
It is OK if they format spaces differently.
It is NOT OK if they use incorrect numbers or the final answer is wrong.

Return ONLY a JSON object: { "isCorrect": true/false }`;

    const aiResult = await Promise.race([
      model.generateContent(prompt),
      new Promise((_, reject) => setTimeout(() => reject(new Error("AI_TIMEOUT")), AI_TIMEOUT_MS))
    ]);

    const result = JSON.parse(aiResult.response.text().match(/\{[\s\S]*\}/)[0]);
    return NextResponse.json({ isCorrect: result.isCorrect });
  } catch (error) {
    console.error("Multi-step grading failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
