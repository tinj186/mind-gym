import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
let apiKey = '';
for (const line of envContent.split('\n')) {
  if (line.startsWith('GEMINI_API_KEY=')) {
    apiKey = line.split('=')[1].trim().replace(/^['"]|['"]$/g, '');
    break;
  }
}

if (!apiKey) {
  console.error("No GEMINI_API_KEY found");
  process.exit(1);
}

try {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  const data = await res.json();
  if (data.models) {
    console.log("=== Available Models on Gemini API ===");
    const generateModels = data.models
      .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'))
      .map(m => ({
        name: m.name.replace('models/', ''),
        displayName: m.displayName
      }));
    console.log(JSON.stringify(generateModels, null, 2));
  } else {
    console.log("Response:", data);
  }
} catch (err) {
  console.error("Error fetching models:", err);
}
