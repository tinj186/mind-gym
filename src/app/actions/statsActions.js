"use server";
import { prisma } from "@/lib/db";

/**
 * Aggregates student mastery and activity data for the Neural Performance Dashboard.
 */
export async function getStudentProfileForStats(studentId) {
  return await prisma.studentProfile.findUnique({
    where: { id: studentId },
    select: { id: true, name: true, externalId: true, primaryLevel: true }
  });
}
export async function getStudentStatsAction(studentId) {
  // 1. Fetch Mastery Data
  const mastery = await prisma.studentMastery.findMany({
    where: { studentId },
    orderBy: { topicId: 'asc' }
  });

  // 2. Fetch Recent Activity
  const recentLogs = await prisma.attemptLog.findMany({
    where: { studentId },
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { question: true }
  });

  // 3. Calculate Aggregates
  const totalReps = mastery.reduce((sum, m) => sum + m.totalReps, 0);

  let avgStrength = 0;
  const trainedMastery = mastery.filter(m => (m.synapseStrength || 0) > 0);

  if (trainedMastery.length > 0) {
    avgStrength = Math.round(
      trainedMastery.reduce((acc, m) => acc + (m.synapseStrength || 0), 0) / trainedMastery.length
    );
  } else {
    // TRUE FALLBACK: historical accuracy from the raw logs
    const totalAttemptLogs = await prisma.attemptLog.count({ where: { studentId } });
    if (totalAttemptLogs > 0) {
      const correctReps = await prisma.attemptLog.count({
        where: { studentId, isCorrect: true }
      });
      avgStrength = Math.round((correctReps / totalAttemptLogs) * 100);
    }
  }

  // Fetch student profile for name and other details
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    select: { id: true, name: true, externalId: true, primaryLevel: true }
  });

  // Fetch or mock exam results
  let examResults = [];
  try {
    examResults = await prisma.mockExamResult.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' } // Fetch most recent exams
    });
  } catch (e) {
    console.error("Failed to fetch exam results:", e);
    examResults = [];
  }

  return {
    mastery,
    recentLogs,
    summary: { totalReps, avgStrength },
    studentProfile,
    examResults
  };
}