import fs from 'fs';
import { GoogleGenerativeAI } from "@google/generative-ai";

const envContent = fs.readFileSync('.env.local', 'utf8');
let apiKey = '';
for (const line of envContent.split('\n')) {
  if (line.startsWith('GEMINI_API_KEY=')) {
    apiKey = line.split('=')[1].trim().replace(/^['"]|['"]$/g, '');
    break;
  }
}

const genAI = new GoogleGenerativeAI(apiKey);

const candidates = [
  "gemini-flash-lite-latest",
  "gemini-flash-latest",
  "gemini-3.8-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-3.1-pro-preview",
  "gemini-4-argon",
  "gemini-pro-latest"
];

console.log("Testing candidate models for latency and availability...");

for (const modelId of candidates) {
  const start = performance.now();
  try {
    const model = genAI.getGenerativeModel({ model: modelId }, { apiVersion: 'v1beta' });
    const res = await Promise.race([
      model.generateContent('1+1='),
      new Promise((_, reject) => setTimeout(() => reject(new Error("TIMEOUT")), 10000))
    ]);
    const end = performance.now();
    const text = res.response.text();
    console.log(`✅ ${modelId}: ${Math.round(end - start)}ms (Output: "${text.trim().slice(0, 20)}")`);
  } catch (err) {
    console.log(`❌ ${modelId}: FAILED (${err.message})`);
  }
}

