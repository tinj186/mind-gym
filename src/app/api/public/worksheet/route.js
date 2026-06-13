import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req) {
  try {
    const body = await req.json();
    const { level, topic, subtopic, type, limit = 5 } = body;

    if (!level || !topic) {
      return NextResponse.json({ error: "Level and Topic are required" }, { status: 400 });
    }

    // Build the query
    const whereClause = {
      level,
      topic,
    };

    if (subtopic) whereClause.subtopic = subtopic;
    if (type) whereClause.type = type;

    // Fetch from the question bank
    // Note: Since Prisma doesn't have native ORDER BY RAND(), we'll fetch a larger pool and shuffle
    const questions = await prisma.questionBank.findMany({
      where: whereClause,
      take: 50, // Fetch up to 50
    });

    if (questions.length === 0) {
      return NextResponse.json({ 
        error: "No questions found for these criteria. Try a different topic or level!" 
      }, { status: 404 });
    }

    // Shuffle and pick 'limit' questions
    const shuffled = questions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, Math.min(limit, questions.length));

    return NextResponse.json({ questions: selectedQuestions }, { status: 200 });

  } catch (error) {
    console.error("Error generating free worksheet:", error);
    return NextResponse.json({ error: "Failed to generate worksheet" }, { status: 500 });
  }
}
