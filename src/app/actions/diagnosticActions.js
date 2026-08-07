"use server";

import { prisma } from '@/lib/db';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function runBackgroundDiagnostic(studentId, topicId, topicTotalReps) {
  try {
    // 1. Fetch recent failed attempts across the ENTIRE topic
    const recentFailures = await prisma.attemptLog.findMany({
      where: {
        studentId,
        isCorrect: false,
        question: {
          topic: topicId
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        question: true
      }
    });

    // 2. We need at least a few data points to make a good diagnostic
    if (recentFailures.length < 3) {
      return { success: false, reason: 'insufficient_data' };
    }

    // 3. Format the data for the LLM
    const promptData = recentFailures.map((log, i) => `
Attempt ${i + 1}:
Question: ${log.question.question}
Expected Answer: ${log.question.finalAnswer}
Student Answer: ${log.studentAnswer || 'No Answer Submitted'}
`).join('\n');

    const systemPrompt = `You are an expert Math Tutor AI diagnosing a student's cognitive bottlenecks.
You will be given a list of a student's recent incorrect attempts across various subtopics within the Math topic: ${topicId}.
Your goal is to identify the underlying mechanical, conceptual, or procedural pattern behind their errors across the entire topic.

Analyze the questions, expected answers, and the student's actual answers. 
Provide a concise, 2-sentence diagnostic hypothesis on WHY they are getting these wrong.
For example: "The student fundamentally struggles with bridging concepts across tens. They are also consistently failing to read the word problems accurately."
Do NOT include any greetings, fluff, or advice on how to fix it. ONLY output the diagnostic hypothesis.

Here is the student's error data:
${promptData}`;

    // 4. Call Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let diagnosticText = "Pattern recognition failing. Form repair required.";
    
    if (process.env.GEMINI_API_KEY) {
      const result = await model.generateContent(systemPrompt);
      diagnosticText = result.response.text().trim();
    } else {
      diagnosticText = "AI Diagnostics Offline: Missing GEMINI_API_KEY. Please add your key to enable auto-diagnostics.";
    }

    // 5. Update ALL StudentMastery records for this topic
    const masteryRecords = await prisma.studentMastery.findMany({ where: { studentId, topicId } });
    
    for (const m of masteryRecords) {
      const currentDefectLog = typeof m.defectLog === 'object' && m.defectLog !== null ? m.defectLog : {};
      await prisma.studentMastery.update({
        where: { id: m.id },
        data: {
          defectLog: {
            ...currentDefectLog,
            topicDiagnostic: diagnosticText,
            lastTopicDiagnosticReps: topicTotalReps
          }
        }
      });
    }

    return { success: true };

  } catch (error) {
    console.error("Failed to run background diagnostic:", error);
    return { success: false, error: error.message };
  }
}
