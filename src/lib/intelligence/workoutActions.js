"use server";

import { prisma } from "@/lib/db";
import { calculateSynapseStrength } from "./synapse";
import { revalidatePath } from "next/cache";

/**
 * Real-Time Saving: Logs an individual attempt and increments the rep count.
 * This ensures 'Total Reps' increases immediately without affecting 'Synapse Strength'.
 */
export async function saveAttemptAction(studentId, result) {
  // 1. Log the attempt detail
  await prisma.attemptLog.create({
    data: {
      studentId,
      questionId: result.questionId,
      isCorrect: result.isCorrect,
      attempts: result.attempts,
      assistedCorrect: result.assistedCorrect || false,
      timeSpentSecs: result.timeSpent || 0,
      gradingTier: 1
    }
  });

  // 2. Increment Total Reps for the subtopic
  await prisma.studentMastery.upsert({
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
  });
}

/**
 * Updates synapse strength for each sub-topic in the set and checks thresholds.
 */
export async function finalizeWorkoutAction(studentId, results) {
  const rankUps = [];
  let totalGrowth = 0;

  // Group results by subtopic
  const subTopicResults = results.reduce((acc, curr) => {
    // Defensive: Normalize "undefined" string or missing IDs
    const sid = curr.subTopicId === "undefined" || !curr.subTopicId ? "" : curr.subTopicId;
    
    if (!acc[sid]) acc[sid] = { 
      weightedScore: 0, 
      total: 0, 
      topicId: curr.topicId,
      level: curr.level,
      subject: curr.subject
    };
    acc[sid].total++;
    
    // Mastery Weighting: 1.0 for 1st attempt, 0.5 for 2nd attempt success, 0.0 for fail
    if (curr.isCorrect) acc[sid].weightedScore += 1.0;
    else if (curr.actualCorrect) acc[sid].weightedScore += 0.5;

    return acc;
  }, {});

  for (const [subTopicId, data] of Object.entries(subTopicResults)) {
    const currentScore = (data.weightedScore / data.total) * 100;
    const mastery = await prisma.studentMastery.findUnique({
      where: { studentId_topicId_subTopicId: { studentId, topicId: data.topicId, subTopicId } }
    });

    const oldStrength = mastery?.synapseStrength || 0;
    const newStrength = calculateSynapseStrength(currentScore, oldStrength);
    
    totalGrowth += (newStrength - oldStrength);

    // Threshold detection for Rank Up animation
    if (oldStrength < 70 && newStrength >= 70) rankUps.push(subTopicId);
    if (oldStrength < 85 && newStrength >= 85) rankUps.push(subTopicId);

    await prisma.studentMastery.upsert({
      where: { studentId_topicId_subTopicId: { studentId, topicId: data.topicId, subTopicId } },
      update: { synapseStrength: newStrength }, // Reps are already incremented via saveAttemptAction
      create: { 
        studentId, 
        topicId: data.topicId, 
        subTopicId, 
        topic: data.topicId, // Fills the mandatory legacy 'topic' field
        subtopic: subTopicId, // Fills the legacy 'subtopic' field
        level: data.level || "Primary 1",
        subject: data.subject || "Math",
        synapseStrength: newStrength, 
        totalReps: data.total 
      }
    });
  }

  revalidatePath("/gym");
  return {
    averageGrowth: totalGrowth.toFixed(1),
    rankUps
  };
}

/**
 * Updates the persistent session state for a student.
 * Set payload to null to clear the session lock.
 *
 * @param {string} studentId - The ID of the student.
 * @param {Object | null} payload - The workout progress to save, or null to clear.
 * @param {number} payload.currentIndex - The current question index.
 * @param {Array} payload.answersLog - The log of answers for the current session.
 */
export async function updateWorkoutProgressAction(studentId, payload) {
  // If payload is provided, we merge it into the existing JSON field
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