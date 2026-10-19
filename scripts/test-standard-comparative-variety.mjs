import { p3GraphAxisScalesBlueprint } from '../src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/graph-axis-scales.js';

console.log('Testing standard_comparative_differences_mixed_alignments variety...');

const types = ['structured', 'mcq', 'short question'];

for (let i = 1; i <= 35; i++) {
  const type = types[i % 3];
  const res = p3GraphAxisScalesBlueprint.generate('standard', 'standard_comparative_differences_mixed_alignments', type);
  
  if (!res || !res.aiPrompt) {
    throw new Error(`Failed to generate aiPrompt on iteration ${i}`);
  }

  // Ensure it does not overdescribe halfway marks or lines in questionText
  if (res.aiPrompt.includes('stops halfway') || res.aiPrompt.includes('lands on the')) {
    throw new Error(`Iteration ${i} overdescribes bar positions in questionText!`);
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
    // Must include working equation step
    if (!res.aiPrompt.includes('Write the working equation')) {
      throw new Error(`Structured question missing 'Write the working equation' step on iteration ${i}`);
    }
  }
}

console.log('✅ 35/35 randomized generations passed all assertions without overdescribing!');

// Let's print out 8 samples showing the clean un-spoonfed questions and steps
console.log('\n--- SAMPLE GENERATIONS ---');
for (let i = 1; i <= 8; i++) {
  const res = p3GraphAxisScalesBlueprint.generate('standard', 'standard_comparative_differences_mixed_alignments', 'structured');
  
  const qMatch = res.aiPrompt.match(/CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string[^\n]*\n"([^"]+)"/);
  const jsonStart = res.aiPrompt.indexOf('{');
  const jsonEnd = res.aiPrompt.lastIndexOf('}');
  if (jsonStart !== -1 && jsonEnd !== -1) {
    try {
      const parsed = JSON.parse(res.aiPrompt.slice(jsonStart, jsonEnd + 1));
      console.log(`\n[Sample ${i}]`);
      console.log('Question:', qMatch ? qMatch[1] : 'N/A');
      console.log('Scale Step:', parsed.visualEngine?.componentData?.scaleStep);
      console.log('Bars:', parsed.visualEngine?.componentData?.data.map(d => `${d.category}: ${d.value}`).join(', '));
      if (parsed.inputRequirement && parsed.inputRequirement.steps) {
        console.log('Steps:');
        parsed.inputRequirement.steps.forEach(s => console.log(`  - ${s.label} -> [${s.expectedAnswer}] (Accepted: ${s.acceptedAnswers?.length || 0})`));
      }
    } catch (e) {
      console.log('Could not parse schema JSON:', e.message);
    }
  }
}
