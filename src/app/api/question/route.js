import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Fetch the first approved question. 
    const question = await prisma.questionBank.findFirst({
      where: { isApproved: true },
      orderBy: { createdAt: 'asc' }
    });

    if (!question) return NextResponse.json({ error: "No questions available" }, { status: 404 });
    return NextResponse.json(question);
  } catch (error) {
    console.error("API Error fetching question:", error);
    return NextResponse.json({ error: "Failed to fetch question" }, { status: 500 });
  }
}