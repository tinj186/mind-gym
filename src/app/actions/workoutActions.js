"use server";

import { prisma } from "@/lib/db";
import { calculateSynapseStrength } from "@/lib/intelligence/synapse";
import { revalidatePath } from "next/cache";

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

    await prisma.studentMastery.upsert({
      where: { studentId_topicId_subTopicId: { studentId, topicId: data.topicId, subTopicId } },
      update: { 
        synapseStrength: newStrength,
        fluencyMetrics: metrics 
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
        totalReps: data.total 
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