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
export async function getStudentStatsAction(studentId, levelFilter = 'Overall') {
  // 1. Fetch Mastery Data
  const masteryWhere = { studentId };
  if (levelFilter && levelFilter !== 'Overall') {
    masteryWhere.level = { equals: levelFilter, mode: 'insensitive' };
  }
  const mastery = await prisma.studentMastery.findMany({
    where: masteryWhere,
    orderBy: { topicId: 'asc' }
  });

  // 2. Fetch Recent Activity
  const recentLogsWhere = { studentId };
  if (levelFilter && levelFilter !== 'Overall') {
    recentLogsWhere.question = {
      level: { equals: levelFilter, mode: 'insensitive' }
    };
  }
  const recentLogs = await prisma.attemptLog.findMany({
    where: recentLogsWhere,
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
    const totalAttemptLogs = await prisma.attemptLog.count({ where: recentLogsWhere });
    if (totalAttemptLogs > 0) {
      const correctReps = await prisma.attemptLog.count({
        where: { ...recentLogsWhere, isCorrect: true }
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
    const rawExamResults = await prisma.mockExamResult.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' } // Fetch most recent exams
    });

    // Aggregate exam results by topic
    const aggregatedExamResultsMap = new Map();
    for (const exam of rawExamResults) {
      if (!aggregatedExamResultsMap.has(exam.topic)) {
        aggregatedExamResultsMap.set(exam.topic, {
          ...exam,
          totalAccuracy: exam.accuracy,
          count: 1
        });
      } else {
        const existing = aggregatedExamResultsMap.get(exam.topic);
        existing.totalAccuracy += exam.accuracy;
        existing.count += 1;
        // The first encountered exam is the latest, so we keep its metadata (like speedAnalysis)
      }
    }

    examResults = Array.from(aggregatedExamResultsMap.values()).map(exam => {
      const avgAccuracy = Math.round(exam.totalAccuracy / exam.count);
      const { totalAccuracy, count, ...rest } = exam;
      return { ...rest, accuracy: avgAccuracy };
    });

    // If a specific level is selected, filter examResults to only include topics present in the filtered mastery data
    if (levelFilter && levelFilter !== 'Overall') {
      const allowedTopics = new Set(mastery.map(m => m.topic));
      examResults = examResults.filter(exam => allowedTopics.has(exam.topic));
    }
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