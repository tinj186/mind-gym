import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { modelPriorityList, refreshModelPriority } from '@/lib/ai-config';

export const dynamic = 'force-dynamic';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function GET() {
  const results = [];

  // We run benchmarks sequentially to get accurate per-model latency
  for (const modelId of modelPriorityList) {
    const start = performance.now();
    try {
      const model = genAI.getGenerativeModel({ model: modelId }, { apiVersion: 'v1beta' });
      
      // Send a minimal prompt to measure raw response latency
      await Promise.race([
        model.generateContent('1+1='),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("TIMEOUT")), 15000)
        )
      ]);

      const end = performance.now();
      results.push({
        modelId,
        latency: Math.round(end - start),
        status: 'online'
      });
    } catch (error) {
      console.error(`❌ Benchmark failed for ${modelId}:`, error.message);
      results.push({
        modelId,
        latency: 99999, // Offline models sorted to the end
        status: 'offline'
      });
    }
  }

  // Sort by latency (ascending)
  results.sort((a, b) => a.latency - b.latency);

  try {
    const priorityList = results.filter(r => r.status === 'online').map(r => r.modelId);
    if (priorityList.length > 0) {
      await prisma.systemConfig.upsert({
        where: { key: 'MODEL_PRIORITY' },
        update: { value: priorityList },
        create: { key: 'MODEL_PRIORITY', value: priorityList }
      });
      await refreshModelPriority();
    }
  } catch (dbErr) {
    console.error("❌ Failed to save model priority:", dbErr.message);
  }

  return NextResponse.json(results);
}