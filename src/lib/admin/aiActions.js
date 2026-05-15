"use server";

import { prisma } from '@/lib/db';
import { modelPriorityList, modelCooldowns, refreshModelPriority } from '@/lib/ai-config';

/**
 * Returns the current state of the AI Model Relay.
 */
export async function getAIStatusAction() {
  // Transform model ID strings into objects with latency data for the dashboard
  const enrichedList = await Promise.all(modelPriorityList.map(async (modelOrId) => {
    const modelId = typeof modelOrId === 'object' ? modelOrId.id : modelOrId;
    const metric = await prisma.aiMetric?.findFirst({
      where: { modelId: modelId },
      orderBy: { createdAt: 'desc' },
      select: { latency: true }
    });
    return { id: modelId, latency: metric?.latency || (typeof modelOrId === 'object' ? modelOrId.latency : 0) };
  }));

  return {
    priorityList: enrichedList,
    cooldowns: Object.entries(modelCooldowns).map(([id, time]) => ({
      id,
      isCooling: time > Date.now(),
      remaining: Math.max(0, Math.ceil((time - Date.now()) / 1000))
    }))
  };
}

/**
 * Re-tests latencies and rebuilds the priority list.
 */
export async function triggerModelRefreshAction() {
  await refreshModelPriority();
  return { success: true };
}