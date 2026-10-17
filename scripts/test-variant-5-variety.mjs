import { p3GraphAxisScalesBlueprint } from '../src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/graph-axis-scales.js';

console.log('Testing foundation_combining_multiple_bars variety...');

const types = ['structured', 'mcq', 'short question'];

for (let i = 1; i <= 25; i++) {
  const type = types[i % 3];
  const res = p3GraphAxisScalesBlueprint.generate('foundation', 'foundation_combining_multiple_bars', type);
  
  if (!res || !res.aiPrompt) {
    throw new Error(`Failed to generate aiPrompt on iteration ${i}`);
  }

  // Extract JSON template block
  const jsonMatch = res.aiPrompt.match(/\{[\s\S]*"meta":\s*\{[\s\S]*"variant":\s*"([^"]+)"[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`Failed to match JSON template for iteration ${i}`);
  }

  // Check MCQ requirements
  if (type === 'mcq') {
    const optMatch = res.aiPrompt.match(/Generate EXACTLY 4 options in "content\.options":/);
    if (!optMatch) {
      throw new Error(`MCQ missing 4 exact options prompt on iteration ${i}`);
    }
  }

  // Check Structured requirements
  if (type === 'structured') {
    if (!res.aiPrompt.includes('"inputType": "MULTI_STEP_INPUT"') && !res.aiPrompt.includes('"inputType":"MULTI_STEP_INPUT"')) {
      throw new Error(`Structured question missing MULTI_STEP_INPUT on iteration ${i}`);
    }
  }
}

console.log('✅ 25/25 randomized generations passed basic assertions!');

// Let's print out 6 samples showing the different varieties
console.log('\n--- SAMPLE GENERATIONS ---');
for (let i = 1; i <= 6; i++) {
  const res = p3GraphAxisScalesBlueprint.generate('foundation', 'foundation_combining_multiple_bars', 'structured');
  
  const qMatch = res.aiPrompt.match(/CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string[^\n]*\n"([^"]+)"/);
  const stepsMatch = res.aiPrompt.match(/"steps":\s*(\[[^\]]+\])/);
  const isBlankAxis = res.aiPrompt.includes('"showScaleNumbers":false') || res.aiPrompt.includes('"showScaleNumbers": false');
  const hasMissingBar = res.aiPrompt.includes('"missingBar":');

  console.log(`\n[Sample ${i}] (Type: ${hasMissingBar ? 'MISSING BAR' : isBlankAxis ? 'BLANK AXIS (Reverse Scale)' : 'FORWARD ADDITION'})`);
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
