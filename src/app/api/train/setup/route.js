import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * Backend Guard for Difficulty Routing.
 * Checks synapseStrength thresholds before allowing a training session.
 */
export async function POST(request) {
  try {
    const { studentId, topicId, subTopicId, difficulty } = await request.json();

    if (!studentId || !topicId || !subTopicId || !difficulty) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const mastery = await prisma.studentMastery.findUnique({
      where: {
        studentId_topicId_subTopicId: { studentId, topicId, subTopicId: subTopicId || "" }
      }
    });

    const strength = mastery?.synapseStrength || 0;

    // Threshold Guardrails
    if (difficulty === 'Standard' && strength < 70) {
      return NextResponse.json({ error: "Conditioning Required: 70% Synapse Strength needed for Standard." }, { status: 403 });
    }

    if (difficulty === 'Advanced' && strength < 85) {
      return NextResponse.json({ error: "Conditioning Required: 85% Synapse Strength needed for Advanced." }, { status: 403 });
    }

    return NextResponse.json({ success: true, strength });
  } catch (error) {
    console.error("Eligibility check failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
