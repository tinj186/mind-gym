'use server';

import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';

export async function gradeAction(prevState, formData) {
  const questionId = formData.get('questionId');
  const studentAnswer = formData.get('answer')?.toString() || '';

   console.log(`[SERVER ACTION] Grading QID: ${questionId}`);
  console.log(`[SERVER ACTION] Received Answer: "${studentAnswer}"`);

  if (!questionId || !studentAnswer) {
    console.log('[SERVER ACTION] Aborted: Missing ID or Answer');
    return { error: "Please enter an answer." };
  }

  // 1. Fetch the actual answer
  const question = await prisma.questionBank.findUnique({
    where: { id: questionId }
  });

  if (!question) {
    console.log(`[SERVER ACTION] Error: Question ${questionId} not found`);
    return { error: "Question configuration error." };
  }

  // 2. Precision Check
  const isCorrect = 
    question.finalAnswer.trim().toLowerCase() === studentAnswer.trim().toLowerCase();
    console.log(`[SERVER ACTION] Match: ${isCorrect}`);


  // 3. Log the Attempt
  await prisma.attemptLog.create({
    data: {
      questionId,
      studentAnswer,
      isCorrect,
      timeSpentSecs: 0, // Satisfies the required schema field
    }
  });

  if (isCorrect) {
    // Server-side redirect
    redirect('/train/summary');
  } else {
   return { error: "Incorrect. Check the model and try again!", lastAnswer: studentAnswer };
  }
}