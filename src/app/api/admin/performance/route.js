import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODEL_POOL = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-1.5-pro",
  "gemini-3.1-flash-lite-preview"
];

export async function GET() {
  try {
    // Ping all models concurrently to measure real-world latency
    const results = await Promise.allSettled(
      MODEL_POOL.map(async (id) => {
        const start = Date.now();
        const model = genAI.getGenerativeModel({ model: id });
        // Low-token ping to verify availability
        await model.generateContent("ping");
        return { modelId: id, latency: Date.now() - start, status: 'online' };
      })
    );

    // Process all results (including failures)
    const allModels = results.map((res, idx) => {
      if (res.status === 'fulfilled') return res.value;
      return { modelId: MODEL_POOL[idx], latency: 99999, status: 'offline' };
    });

    // Sort all models by speed (fastest first)
    const sortedModels = allModels.sort((a, b) => a.latency - b.latency);

    // Designate the top 3 healthy models as the active selection
    const winners = sortedModels.filter(m => m.status === 'online').slice(0, 3).map(m => m.modelId);

    const finalPayload = sortedModels.map(m => ({
      ...m,
      role: winners.indexOf(m.modelId) === 0 
        ? 'PRIMARY' 
        : winners.includes(m.modelId) ? 'FALLBACK' : 'UNRANKED'
    }));

    return NextResponse.json(finalPayload);
  } catch (error) {
    console.error("❌ Performance Module Error:", error);
    return NextResponse.json({ error: "Speed test failed" }, { status: 500 });
  }
}