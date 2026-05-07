import { prisma } from '@/lib/db';

export let modelPriorityList = [
  "gemini-3.1-flash-lite-preview", // 🟢 Fastest & highly intelligent (Newest)
  "gemini-2.5-flash",              // 🟡 Excellent reasoning, very stable
  "gemini-2.5-pro"                 // 🔴 Powerhouse for complex logic (Fallback)
];

export const modelCooldowns = {};

export const COOLDOWN_MS = 60000;

/**
 * Refreshes the model priority list from the database.
 */
export async function refreshModelPriority() {
  try {
    const config = await prisma.systemConfig.findUnique({ where: { key: 'MODEL_PRIORITY' } });
    if (config && Array.isArray(config.value)) {
      modelPriorityList = config.value;
    }
  } catch (err) {
    console.error("❌ Failed to refresh model priority:", err);
  }
}

/**
 * Helper to select the most appropriate available model based on health.
 */
export function getBestModel() {
  const now = Date.now();
  for (const modelId of modelPriorityList) {
    if (!modelCooldowns[modelId] || now > modelCooldowns[modelId]) {
      return modelId;
    }
  }
  return modelPriorityList[0]; // Fallback to primary if everything is in cooldown
}

/**
 * Calculates dynamic delays based on the model's historical latency.
 * Retrieves metrics from the database and scales wait times accordingly.
 * @param {string} modelId - The ID of the model to check.
 */
export async function getDynamicDelays(modelId) {
  const LATENCY_TARGET = 600;
  const DEFAULT_STAGGER = 800;

  try {

    const latestMetric = await prisma.aiMetric.findFirst({
      where: { modelId },
      orderBy: { createdAt: 'desc' }
    });

    if (!latestMetric || !latestMetric.latency) {
      return { stagger: DEFAULT_STAGGER, cooldown: 30000 };
    }

    // Apply the Scaling Formula
    const ratio = latestMetric.latency / LATENCY_TARGET;
    return {
      stagger: Math.min(Math.max(DEFAULT_STAGGER * ratio, 500), 5000),
      cooldown: Math.min(Math.max(30000 * ratio, 30000), 120000)
    };
  } catch (err) {
    console.error(`⚠️ Database error in getDynamicDelays:`, err);
    return { stagger: DEFAULT_STAGGER, cooldown: 30000 }; // Safety Fallback
  }
}