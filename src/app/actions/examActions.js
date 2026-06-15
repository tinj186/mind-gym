"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveMockExamAction(studentId, scoreSummary, flattenedQuestions, answersLog) {
  try {
    // Group questions by Topic to save topic-level MockExamResult records.
    const topicStats = {};

    flattenedQuestions.forEach((q) => {
      const topic = q.topic;
      const topicId = q.topicId || q.topic;
      
      if (!topicStats[topic]) {
        topicStats[topic] = {
          topicId: topicId,
          topic: topic,
          mcq: { correct: 0, total: 0 },
          short: { correct: 0, total: 0 },
          structured: { correct: 0, total: 0 },
          totalCorrect: 0,
          totalQuestions: 0,
        };
      }

      const isCorrect = answersLog.find(log => log.questionId === q.id)?.actualCorrect || false;
      const type = q.type?.toUpperCase() || '';

      let section = 'mcq';
      if (type.includes('SHORT')) section = 'short';
      if (type.includes('STRUCTURED') || type.includes('LONG')) section = 'structured';

      topicStats[topic][section].total += 1;
      topicStats[topic].totalQuestions += 1;

      if (isCorrect) {
        topicStats[topic][section].correct += 1;
        topicStats[topic].totalCorrect += 1;
      }
    });

    // Save a MockExamResult for each Topic
    for (const [topic, stats] of Object.entries(topicStats)) {
      if (stats.totalQuestions === 0) continue;

      const accuracy = Math.round((stats.totalCorrect / stats.totalQuestions) * 100);
      
      const sectionBreakdown = {
        mcq: stats.mcq.total > 0 ? Math.round((stats.mcq.correct / stats.mcq.total) * 100) : 0,
        short: stats.short.total > 0 ? Math.round((stats.short.correct / stats.short.total) * 100) : 0,
        structured: stats.structured.total > 0 ? Math.round((stats.structured.correct / stats.structured.total) * 100) : 0,
      };

      await prisma.mockExamResult.create({
        data: {
          studentId,
          topicId: stats.topicId,
          topic: stats.topic,
          accuracy,
          sectionBreakdown,
          speedAnalysis: {},
          errorPatterns: []
        }
      });
    }

    revalidatePath("/parent/math");
    return { success: true };
  } catch (error) {
    console.error("Failed to save Mock Exam:", error);
    return { success: false, error: error.message };
  }
}
