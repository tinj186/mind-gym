import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { SYLLABUS_DATA, getSyllabusRows } from '@/lib/syllabus';
import { blueprintRegistry } from '@/lib/syllabus/index';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const heuristic = searchParams.get('heuristic');
  const level = searchParams.get('level');
  const topic = searchParams.get('topic');
  const subtopic = searchParams.get('subtopic');
  const type = searchParams.get('type');
  const difficulty = searchParams.get('difficulty');
  const approved = searchParams.get('approved') === 'true';

  let where = {};
  let takeAmount = undefined;
  if (id) {
    where = { id: { equals: id, mode: 'insensitive' } };
  } else {
    if (heuristic) {
      where = { heuristic: heuristic };
      takeAmount = 50; // Match the limit from the Server Component to prevent DB overload
      
      // Smart Egress Protection
      if (!level && !topic && !subtopic) {
        const syllabusRows = getSyllabusRows();
        for (const row of syllabusRows) {
          const blueprintId = `${row.level}-${row.topic}-${row.subtopic}`;
          const blueprint = blueprintRegistry[blueprintId];
          if (blueprint && blueprint.variants && blueprint.variants[heuristic]) {
            where.level = row.level;
            where.topic = row.topic;
            if (row.subtopic) where.subtopic = row.subtopic;
            break;
          }
        }
      }
    } else {
      where = { isApproved: approved };
    }

    if (level) where.level = level;
    if (topic) where.topic = topic;
    if (subtopic) where.subtopic = subtopic;
    if (type) where.type = type;
    if (difficulty) where.difficulty = difficulty;
  }

  try {
    const questions = await prisma.questionBank.findMany({ 
      where,
      take: takeAmount, // Limit results if searching by heuristic
      orderBy: { createdAt: 'desc' }, // Ensure newest generations appear at the top
      include: {
        attempts: {
          select: { isCorrect: true }
        }
      }
    });
    
    // Ensure MCQ options are always strings to prevent UI crashes (opt.includes is not a function)
    const sanitized = questions.map(q => {
      const attemptsCount = q.attempts?.length || 0;
      const correctCount = q.attempts?.filter(a => a.isCorrect).length || 0;
      const successRate = attemptsCount > 0 ? Math.round((correctCount / attemptsCount) * 100) : 0;
      
      let variantDescription = null;
      if (q.heuristic) {
        const blueprintId = `${q.level}-${q.topic}-${q.subtopic}`;
        const blueprint = blueprintRegistry[blueprintId];
        if (blueprint && blueprint.variants && blueprint.variants[q.heuristic]) {
          variantDescription = blueprint.variants[q.heuristic];
        }
      }

      const { attempts, ...rest } = q;
      return {
        ...rest,
        stats: { attemptsCount, successRate, variantDescription },
        options: Array.isArray(q.options) ? q.options.map(opt => (opt === null || opt === undefined) ? "" : String(opt)) : (q.type === 'MCQ' ? [] : null)
      };
    });

    return NextResponse.json(sanitized);
  } catch (error) {
    console.error("❌ Failed to fetch questions:", error);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const level = searchParams.get('level');
  const topic = searchParams.get('topic');
  const subtopic = searchParams.get('subtopic');
  const type = searchParams.get('type');
  const difficulty = searchParams.get('difficulty');
  const approved = searchParams.get('approved') === 'true';

  const where = { 
    isApproved: approved,
    isArchived: false 
  };
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