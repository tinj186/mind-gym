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
  const avgStrength = mastery.length > 0 
    ? (mastery.reduce((sum, m) => sum + m.synapseStrength, 0) / mastery.length).toFixed(1)
    : 0;

  // Fetch student profile for name and other details
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    select: { id: true, name: true, externalId: true, primaryLevel: true }
  });

  return {
    mastery,
    recentLogs,
    summary: { totalReps, avgStrength },
    studentProfile // Include student profile data
  };
}