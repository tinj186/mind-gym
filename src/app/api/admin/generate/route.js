import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { GenerationEngine } from '@/lib/intelligence/generation-engine';
import { refreshModelPriority } from '@/lib/ai-config';

export async function POST(request) {
  try {
    console.log("Forcing hot reload for generate route");
    await refreshModelPriority();
    const body = await request.json();
    const { quantity, metadata, variant = 'visual_line' } = body;
    const { level, topic, subtopic, type, difficulty, heuristic, strand } = metadata || {};

    const engine = new GenerationEngine();
    
    const parsedQuestions = await engine.generateQuestions({
      quantity,
      level,
      topic,
      subtopic,
      type,
      difficulty,
      heuristic,
      strand,
      variant
    });

    if (parsedQuestions.length > 0) {
      const finalData = parsedQuestions.filter(q => q !== null);
      await prisma.questionBank.createMany({ data: finalData });
      return NextResponse.json({ success: true, count: finalData.length });
    }

    throw new Error("No questions generated.");
  } catch (error) {
    console.error("❌ Generation failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}