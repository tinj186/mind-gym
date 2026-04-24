import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const level = searchParams.get('level');
  const topic = searchParams.get('topic');
  const subtopic = searchParams.get('subtopic');
  const type = searchParams.get('type');
  const difficulty = searchParams.get('difficulty');
  const approved = searchParams.get('approved') === 'true';

  const where = { isApproved: approved };
  if (level) where.level = level;
  if (topic) where.topic = topic;
  if (subtopic) where.subtopic = subtopic;
  if (type) where.type = type;
  if (difficulty) where.difficulty = difficulty;

  try {
    const result = await prisma.questionBank.deleteMany({ where });
    return NextResponse.json({ success: true, count: result.count });
  } catch (error) {
    console.error("❌ Failed to bulk delete questions:", error);
    return NextResponse.json({ error: "Failed to delete questions" }, { status: 500 });
  }
}