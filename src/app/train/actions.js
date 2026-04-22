'use server';

import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { normalizeAnswer } from '@/lib/math';

export async function gradeAction(prevState, formData) {
  const questionId = formData.get('questionId');
  const studentAnswer = formData.get('answer')?.toString() || '';

  // Zero-Trust Validation: Reject any input containing shell-active characters
  const safeRegex = /^[0-9a-zA-Z\s\/\-\+\(\)\.\{\}\[\]\^\\]+$/;
  if (!safeRegex.test(studentAnswer)) {
    console.error(`[SECURITY] Server Action blocked malicious input: "${studentAnswer}"`);
    return { error: "Security validation failed: Invalid characters detected." };
  }

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
    normalizeAnswer(question.finalAnswer) === normalizeAnswer(studentAnswer);
    console.log(`[SERVER ACTION] Match: ${isCorrect}`);


  // 3. Log the Attempt
  await prisma.attemptLog.create({
    data: {
      questionId,
      studentAnswer,
      isCorrect,
       gradingTier: 1, // Default to Tier 1 for non-AI checks
      isLogicCorrect: isCorrect, // For Tier 1, logic follows accuracy
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