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

// Extract modelPriorityList directly from ai-config.js
const aiConfigContent = fs.readFileSync('src/lib/ai-config.js', 'utf8');
const listMatch = aiConfigContent.match(/export let modelPriorityList = (\[[\s\S]*?\]);/);
const modelPriorityList = eval(listMatch[1]);

const genAI = new GoogleGenerativeAI(apiKey);

console.log("=== Testing Performance Route with Updated modelPriorityList ===");
console.log("Configured Models from ai-config.js:", modelPriorityList);

const results = [];

for (const modelId of modelPriorityList) {
  const start = performance.now();
  try {
    const model = genAI.getGenerativeModel({ model: modelId }, { apiVersion: 'v1beta' });
    await Promise.race([
      model.generateContent('1+1='),
      new Promise((_, reject) => setTimeout(() => reject(new Error("TIMEOUT")), 15000))
    ]);
    const end = performance.now();
    results.push({
      modelId,
      latency: Math.round(end - start),
      status: 'online'
    });
  } catch (error) {
    results.push({
      modelId,
      latency: 99999,
      status: 'offline'
    });
  }
}

results.sort((a, b) => a.latency - b.latency);

const onlineModels = results.filter(r => r.status === 'online');
const enrichedResults = results.map(r => {
  if (r.status !== 'online') return { ...r, role: 'UNRANKED' };
  const rank = onlineModels.findIndex(m => m.modelId === r.modelId);
  return {
    ...r,
    role: rank === 0 ? 'PRIMARY' : 'BACKUP'
  };
});

console.log("\n=== Benchmarked & Ranked Results for Admin Dashboard ===");
console.table(enrichedResults);
