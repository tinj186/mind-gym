import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { normalizeAnswer } from '@/lib/math';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getBestModel, modelCooldowns, COOLDOWN_MS, refreshModelPriority } from '@/lib/ai-config';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const AI_TIMEOUT_MS = 15000;

export async function POST(req) {
  try {
    await refreshModelPriority();
    const { questionId, studentAnswer, modelDescription, timeSpentSecs } = await req.json();

    const question = await prisma.questionBank.findUnique({
      where: { id: questionId }
    });

    if (!question) return NextResponse.json({ error: "Question not found" }, { status: 404 });

    // Tier 1: Local Grader
    const isCorrect = normalizeAnswer(studentAnswer) === normalizeAnswer(question.finalAnswer);

    // Tier 2/3: AI Logic Grader
    let isLogicCorrect = isCorrect;
    let hint = "";

    if (!isCorrect || question.type === 'Structured') {
      const selectedModelId = getBestModel();
      try {
        const model = genAI.getGenerativeModel({ model: selectedModelId }, { apiVersion: 'v1beta' });
        const prompt = `Grade this math answer. Question: ${question.question}. Correct Answer: ${question.finalAnswer}. Student Answer: ${studentAnswer}. Bar Model Logic: ${modelDescription}. 
        Return JSON: { "isLogicCorrect": boolean, "hint": "string", "explanation": "string" }`;

        const aiResult = await Promise.race([
          model.generateContent(prompt),
          new Promise((_, reject) => setTimeout(() => reject(new Error("AI_TIMEOUT")), AI_TIMEOUT_MS))
        ]);

        const result = JSON.parse(aiResult.response.text().match(/\{[\s\S]*\}/)[0]);
        isLogicCorrect = result.isLogicCorrect;
        hint = result.hint;
      } catch (err) {
        console.warn("AI Grading failed, falling back to Tier 1");
      }
    }

    await prisma.attemptLog.create({
      data: {
        questionId,
        studentAnswer,
        isCorrect,
        isLogicCorrect,
        modelDescription,
        timeSpentSecs,
        gradingTier: isCorrect ? 1 : 2
      }
    });

    return NextResponse.json({
      isCorrect,
      isLogicCorrect,
      hint,
      solution: question.solution,
      correctAnswer: question.finalAnswer
    });
  } catch (error) {
    console.error("❌ Grading failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
