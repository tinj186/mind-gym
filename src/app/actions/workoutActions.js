"use server";

import { prisma } from "@/lib/db";
import { calculateSynapseStrength } from "@/lib/intelligence/synapse";
import { revalidatePath } from "next/cache";
import { runBackgroundDiagnostic } from "./diagnosticActions";

/**
 * Real-Time Saving: Logs an individual attempt and increments the rep count.
 */
export async function saveAttemptAction(studentId, result) {
  return await prisma.$transaction([
    prisma.attemptLog.create({
      data: {
        studentId,
        questionId: result.questionId,
        isCorrect: result.isCorrect,
        attempts: result.attempts,
        assistedCorrect: result.assistedCorrect || false,
        timeSpentSecs: result.timeSpent || 0,
        gradingTier: 1
      }
    }),
    prisma.studentMastery.upsert({
      where: { 
        studentId_topicId_subTopicId: { 
          studentId, 
          topicId: result.topicId, 
          subTopicId: result.subTopicId || "" 
        } 
      },
      update: { 
        totalReps: { increment: 1 } 
      },
      create: { 
        studentId, topicId: result.topicId, subTopicId: result.subTopicId || "",
        topic: result.topicId, subtopic: result.subTopicId || "",
        level: result.level, subject: result.subject, totalReps: 1, synapseStrength: 0
      }
    })
  ]);
}

/**
 * Updates synapse strength for each sub-topic in the set and checks thresholds.
 */
export async function finalizeWorkoutAction(studentId, results) {
  const rankUps = [];
  let totalGrowth = 0;

  const subTopicResults = results.reduce((acc, curr) => {
    const sid = curr.subTopicId === "undefined" || !curr.subTopicId ? "" : curr.subTopicId;
    
    if (!acc[sid]) acc[sid] = { 
      weightedScore: 0, 
      total: 0, 
      topicId: curr.topicId,
      level: curr.level,
      subject: curr.subject,
      attempts: []
    };
    acc[sid].total++;
    
    if (curr.isCorrect) acc[sid].weightedScore += 1.0;
    else if (curr.actualCorrect) acc[sid].weightedScore += 0.5;

    acc[sid].attempts.push({
      isCorrect: curr.isCorrect,
      timeSpentSecs: curr.timeSpent || 0
    });

    return acc;
  }, {});

  for (const [subTopicId, data] of Object.entries(subTopicResults)) {
    const mastery = await prisma.studentMastery.findUnique({
      where: { studentId_topicId_subTopicId: { studentId, topicId: data.topicId, subTopicId } }
    });

    const oldStrength = mastery?.synapseStrength || 0;

    // Fetch up to the last 10 attempts for this subtopic to compute fluency
    const recentLogs = await prisma.attemptLog.findMany({
      where: {
        studentId,
        question: {
          topic: data.topicId,
          subtopic: subTopicId || null
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        isCorrect: true,
        timeSpentSecs: true
      }
    });

    // Fallback: If no logs found (e.g. database reset edge cases), use the current workout data
    const attemptsToEvaluate = recentLogs.length > 0 ? recentLogs : data.attempts;

    const { score: newStrength, metrics } = calculateSynapseStrength(attemptsToEvaluate, oldStrength);
    
    totalGrowth += (newStrength - oldStrength);

    if (oldStrength < 70 && newStrength >= 70) rankUps.push(subTopicId);
    if (oldStrength < 85 && newStrength >= 85) rankUps.push(subTopicId);

    const currentTotalReps = (mastery?.totalReps || 0) + data.total;

    const updatedMastery = await prisma.studentMastery.upsert({
      where: { studentId_topicId_subTopicId: { studentId, topicId: data.topicId, subTopicId } },
      update: { 
        synapseStrength: newStrength,
        fluencyMetrics: metrics,
        totalReps: { increment: data.total }
      },
      create: { 
        studentId, 
        topicId: data.topicId, 
        subTopicId, 
        topic: data.topicId, 
        subtopic: subTopicId, 
        level: data.level || "Primary 1",
        subject: data.subject || "Math",
        synapseStrength: newStrength, 
        fluencyMetrics: metrics,
        totalReps: currentTotalReps 
      }
    });
  }

  // Topic-Level Background Diagnostic Trigger
  const uniqueTopics = [...new Set(Object.values(subTopicResults).map(d => d.topicId))];
  
  for (const topicId of uniqueTopics) {
    const topicMasteryRows = await prisma.studentMastery.findMany({
      where: { studentId, topicId }
    });
    
    if (!topicMasteryRows.length) continue;

    const topicTotalReps = topicMasteryRows.reduce((sum, m) => sum + m.totalReps, 0);
    const validRows = topicMasteryRows.filter(m => (m.synapseStrength || 0) > 0);
    const topicAvgStrength = validRows.length > 0 
      ? Math.round(validRows.reduce((sum, m) => sum + (m.synapseStrength || 0), 0) / validRows.length)
      : 0;

    const defectLog = typeof topicMasteryRows[0].defectLog === 'object' && topicMasteryRows[0].defectLog !== null ? topicMasteryRows[0].defectLog : {};
    const lastTopicDiagnosticReps = defectLog.lastTopicDiagnosticReps || 0;
    const repsSinceLast = topicTotalReps - lastTopicDiagnosticReps;

    if (repsSinceLast >= 10 && topicAvgStrength < 50) {
      runBackgroundDiagnostic(studentId, topicId, topicTotalReps).catch(console.error);
    }
  }

  // --- STREAK TRACKING LOGIC ---
  const profile = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    select: { currentStreak: true, longestStreak: true, lastPracticeDate: true }
  });

  if (profile) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastDate = profile.lastPracticeDate ? new Date(profile.lastPracticeDate) : null;
    if (lastDate) lastDate.setHours(0, 0, 0, 0);

    let newStreak = profile.currentStreak || 0;
    let newLongest = profile.longestStreak || 0;

    if (!lastDate) {
      newStreak = 1;
    } else {
      const msPerDay = 1000 * 60 * 60 * 24;
      // Use UTC dates to avoid daylight saving time edge cases
      const utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
      const utcLast = Date.UTC(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
      const daysDiff = Math.floor((utcToday - utcLast) / msPerDay);

      if (daysDiff === 1) {
        newStreak += 1;
      } else if (daysDiff > 1) {
        newStreak = 1;
      }
      // If daysDiff === 0, it means they already practiced today, keep the same streak.
    }

    if (newStreak > newLongest) {
      newLongest = newStreak;
    }

    await prisma.studentProfile.update({
      where: { id: studentId },
      data: {
        lastPracticeDate: new Date(),
        currentStreak: newStreak,
        longestStreak: newLongest
      }
    });
  }

  revalidatePath("/math");
  return {
    averageGrowth: totalGrowth.toFixed(1),
    rankUps
  };
}

/**
 * Updates the persistent session state for a student.
 */
export async function updateWorkoutProgressAction(studentId, payload) {
  if (payload !== null) {
    const profile = await prisma.studentProfile.findUnique({ where: { id: studentId } });
    const current = profile?.activeWorkout || {};
    await prisma.studentProfile.update({
      where: { id: studentId },
      data: {
        activeWorkout: {
          ...current,
          currentIndex: payload.currentIndex,
          answersLog: payload.answersLog
        }
      }
    });
  } else {
    await prisma.studentProfile.update({
      where: { id: studentId },
      data: { activeWorkout: null }
    });
  }
}

/**
 * Toggles the isArchived status of a question in the QuestionBank.
 */
export async function toggleArchiveQuestionAction(questionId, currentStatus) {
  try {
    await prisma.questionBank.update({
      where: { id: questionId },
      data: { isArchived: !currentStatus }
    });
    
    revalidatePath('/admin/questions');
    revalidatePath('/admin/questions/review');
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to toggle archive state in QuestionBank:', error);
    return { success: false, error: error.message };
  }
}