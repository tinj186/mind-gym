"use server";

import { prisma } from "@/lib/db";
import { calculateSynapseStrength } from "./synapse";
import { revalidatePath } from "next/cache";

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
      update: { synapseStrength: newStrength, totalReps: { increment: data.total } },
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

  revalidatePath("/gym/math");
  return {
    averageGrowth: totalGrowth.toFixed(1),
    rankUps
  };
}