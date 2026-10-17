import { p3GraphAxisScalesBlueprint } from '../src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/graph-axis-scales.js';

console.log('Testing foundation_grid_block_multiplication variety...');

const types = ['structured', 'mcq', 'short question'];

for (let i = 1; i <= 15; i++) {
  const type = types[i % 3];
  const res = p3GraphAxisScalesBlueprint.generate('foundation', 'foundation_grid_block_multiplication', type);
  
  if (!res || !res.aiPrompt) {
    throw new Error(`Failed to generate aiPrompt on iteration ${i}`);
  }

  // Verify showScaleNumbers: false
  if (!res.aiPrompt.includes('"showScaleNumbers":false') && !res.aiPrompt.includes('"showScaleNumbers": false')) {
    throw new Error(`Iteration ${i}: Missing "showScaleNumbers": false in visualEngine`);
  }

  // Verify that the prompt gives the grid block value
  if (!res.aiPrompt.toLowerCase().includes('each grid block represents')) {
    throw new Error(`Iteration ${i}: Question prompt does not give grid block value`);
  }
}

console.log('✅ 15/15 randomized generations passed basic assertions!');

// Let's generate 5 structured samples and print their details
console.log('\n--- SAMPLE GENERATIONS ---');
for (let i = 1; i <= 5; i++) {
  const res = p3GraphAxisScalesBlueprint.generate('foundation', 'foundation_grid_block_multiplication', 'structured');
  
  // Extract questionText
  const qMatch = res.aiPrompt.match(/CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string[^\n]*\n"([^"]+)"/);
  // Extract visualEngine componentData
  const vMatch = res.aiPrompt.match(/"visualEngine":\s*(\{[^}]+\}[^}]+\})/);
  // Extract steps
  const stepsMatch = res.aiPrompt.match(/"steps":\s*(\[[^\]]+\])/);

  console.log(`\n[Sample ${i}]`);
  if (qMatch) console.log('Question:', qMatch[1]);
  if (stepsMatch) {
    try {
      const steps = JSON.parse(stepsMatch[1]);
      console.log('Steps:');
      steps.forEach(s => console.log(`  - ${s.label} [Expected: ${s.expectedAnswer}] (Accepted: ${s.acceptedAnswers?.length || 0})`));
    } catch (e) {
      console.log('Raw steps match:', stepsMatch[1]);
    }
  }
}
