import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const questionId = searchParams.get('id');
    let question;

    if (questionId) {
      // If an ID is provided, fetch that specific question
      question = await prisma.questionBank.findUnique({
        where: { id: questionId, isApproved: true } // Ensure it's approved
      });
    } else {
      // Otherwise, fetch a random approved question
      const totalQuestions = await prisma.questionBank.count({
        where: { isApproved: true }
      });

      if (totalQuestions === 0) return NextResponse.json({ error: "No questions available" }, { status: 404 });

      const skip = Math.floor(Math.random() * totalQuestions);
      question = await prisma.questionBank.findFirst({
        where: { isApproved: true },
        skip: skip
      });
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error("API Error fetching question:", error);
    return NextResponse.json({ error: "Failed to fetch question" }, { status: 500 });
  }
}