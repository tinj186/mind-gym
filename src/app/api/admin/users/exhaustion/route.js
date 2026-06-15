import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return false;
  
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  return user?.role === 'ADMIN';
}

export async function GET(req) {
  try {
    if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');
    const level = searchParams.get('level');

    if (!studentId || !level) {
      return NextResponse.json({ error: "Missing studentId or level" }, { status: 400 });
    }

    // 1. Get total questions available per subtopic for this level
    const vaultStatsRaw = await prisma.questionBank.groupBy({
      by: ['subtopic'],
      where: { level: level },
      _count: { id: true }
    });

    const vaultTotals = {};
    vaultStatsRaw.forEach(stat => {
      const st = stat.subtopic || 'Uncategorized';
      vaultTotals[st] = (vaultTotals[st] || 0) + stat._count.id;
    });

    // 2. Get distinct questions attempted by this student, joined with QuestionBank to get subtopic
    // Since prisma doesn't support grouping by joined relation fields in a single query easily, 
    // we fetch the attempted question IDs and then fetch their subtopics.
    const attemptedIdsRaw = await prisma.attemptLog.findMany({
      where: { studentId: studentId },
      select: { questionId: true },
      distinct: ['questionId']
    });

    const questionIds = attemptedIdsRaw.map(log => log.questionId);

    const attemptedQuestionsRaw = await prisma.questionBank.findMany({
      where: { id: { in: questionIds } },
      select: { id: true, subtopic: true }
    });

    const attemptedTotals = {};
    attemptedQuestionsRaw.forEach(q => {
      const st = q.subtopic || 'Uncategorized';
      attemptedTotals[st] = (attemptedTotals[st] || 0) + 1;
    });

    // 3. Combine into exhaustion breakdown
    const breakdown = Object.keys(vaultTotals).map(subtopic => {
      const total = vaultTotals[subtopic];
      const attempted = attemptedTotals[subtopic] || 0;
      const percentage = total > 0 ? Math.min(100, Math.round((attempted / total) * 100)) : 0;
      
      return {
        subtopic,
        total,
        attempted,
        percentage
      };
    }).sort((a, b) => b.percentage - a.percentage);

    return NextResponse.json({ breakdown }, { status: 200 });

  } catch (error) {
    console.error("Failed to fetch subtopic exhaustion:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
