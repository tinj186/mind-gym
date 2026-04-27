import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get the total number of approved questions
    const totalQuestions = await prisma.questionBank.count({
      where: { isApproved: true }
    });

    if (totalQuestions === 0) return NextResponse.json({ error: "No questions available" }, { status: 404 });

    // Pick a random index and fetch that question
    const skip = Math.floor(Math.random() * totalQuestions);
    const question = await prisma.questionBank.findFirst({
      where: { isApproved: true },
      skip: skip
    });

    return NextResponse.json(question);
  } catch (error) {
    console.error("API Error fetching question:", error);
    return NextResponse.json({ error: "Failed to fetch question" }, { status: 500 });
  }
}