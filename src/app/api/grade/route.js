import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { normalizeAnswer } from '@/lib/math';
import { MATH_SAFE_REGEX } from '@/lib/constants';

export async function POST(req) {
  try {
    const { questionId, studentAnswer } = await req.json();

    if (typeof studentAnswer !== 'string' || !MATH_SAFE_REGEX.test(studentAnswer)) {
      console.error(`[SECURITY] Blocked malicious input attempt: "${studentAnswer}"`);
      return NextResponse.json({ error: "Invalid input format" }, { status: 400 });
    }

    console.log(`[API ROUTE] Grading attempt: QID=${questionId}, Answer="${studentAnswer}"`);

    // 1. Fetch the actual answer from the vault
    const question = await prisma.questionBank.findUnique({
      where: { id: questionId }
    });

    if (!question) {
      console.error(`[API ROUTE] Question ${questionId} not found in DB`);
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // 2. Precision Check with Safety
    const expected = normalizeAnswer(question.finalAnswer);
    const actual = normalizeAnswer(studentAnswer);

    // If normalization fails or returns NaN, treat as incorrect rather than crashing
    if (actual === null || isNaN(actual)) {
      return NextResponse.json({ isCorrect: false, hint: "Invalid math format." });
    }

    const isCorrect = expected === actual;

    // 3. Log the Attempt (The "Workout Log")
    await prisma.attemptLog.create({
      data: {
        questionId,
        studentAnswer,
        isCorrect,
        timeSpentSecs: 0, // Satisfies the required schema field
        // defectCode: isCorrect ? null : "CALCULATION_ERROR"
      }
    });

    console.log(`[API ROUTE] Result: ${isCorrect ? 'CORRECT' : 'WRONG'}`);

    return NextResponse.json({ 
      isCorrect,
      hint: isCorrect ? null : "Check your mixed number conversion steps." 
    });
  } catch (error) {
    console.error("[API ROUTE] Internal Error:", error);
    return NextResponse.json({ error: "Failed to process grade" }, { status: 500 });
  }
}
