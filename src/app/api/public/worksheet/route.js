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

    // Fetch from the question bank by specific types to create the 5-3-1 mix
    const mcqs = await prisma.questionBank.findMany({
      where: { ...whereClause, type: 'MCQ' },
      take: 30, // Fetch pool to shuffle
    });

    const shortQs = await prisma.questionBank.findMany({
      where: { ...whereClause, type: 'SHORT_QUESTION' },
      take: 20, 
    });

    const structuredQs = await prisma.questionBank.findMany({
      where: { ...whereClause, type: 'STRUCTURED' },
      take: 10, 
    });

    const shuffle = (arr) => arr.sort(() => 0.5 - Math.random());

    const selectedMCQs = shuffle(mcqs).slice(0, 5);
    const selectedShort = shuffle(shortQs).slice(0, 3);
    const selectedStructured = shuffle(structuredQs).slice(0, 1);

    const selectedQuestions = [...selectedMCQs, ...selectedShort, ...selectedStructured];

    if (selectedQuestions.length === 0) {
      return NextResponse.json({ 
        error: "No questions found for these criteria. Try a different topic or level!" 
      }, { status: 404 });
    }

    return NextResponse.json({ questions: selectedQuestions }, { status: 200 });

  } catch (error) {
    console.error("Error generating free worksheet:", error);
    return NextResponse.json({ error: "Failed to generate worksheet" }, { status: 500 });
  }
}
