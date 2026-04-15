import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Normalizes math strings: removes LaTeX commands, braces, and all whitespace
const normalize = (val) => {
  if (!val) return '';
  return val.toLowerCase()
    .replace(/\\frac\s*\{(\d+)\}\s*\{(\d+)\}/g, '$1/$2') // \frac {1} {4} -> 1/4
    .replace(/\\frac\s*(\d)(\d)/g, '$1/$2')             // \frac 14 -> 1/4
    .replace(/[\\{}\s]/g, '');                     // remove \, {, }, and spaces
};

export async function POST(req) {
  try {
    const { questionId, studentAnswer } = await req.json();

    console.log(`[API ROUTE] Grading attempt: QID=${questionId}, Answer="${studentAnswer}"`);

    // 1. Fetch the actual answer from the vault
    const question = await prisma.questionBank.findUnique({
      where: { id: questionId }
    });

    if (!question) {
      console.error(`[API ROUTE] Question ${questionId} not found in DB`);
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // 2. Precision Check
    const isCorrect = normalize(question.finalAnswer) === normalize(studentAnswer);

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
