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