import { GoogleGenerativeAI } from "@google/generative-ai";
import { getBestModel, refreshModelPriority } from "@/lib/ai-config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Centralized AI utility for generating conceptual hints and pedagogical assistance.
 * 
 * @param {string} prompt - The specialized pedagogical instructions for Gemini.
 * @returns {Promise<string>} The generated text content.
 */
export async function generateAIHint(prompt) {
  // Sync with the Engine Room's verified priority list
  await refreshModelPriority();
  const modelId = getBestModel();

  const model = genAI.getGenerativeModel(
    { model: modelId, generationConfig: { temperature: 0.1 } },
    { apiVersion: 'v1beta' } // Explicitly match v1beta to align with the Performance Module
  );

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error(`Gemini AI [${modelId}]: Failed to generate hint content:`, error);
    return ""; // Return empty string to signal failure to the caller
  }
}