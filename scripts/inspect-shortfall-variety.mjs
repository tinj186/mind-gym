import { p3GraphAxisScalesBlueprint } from '../src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/graph-axis-scales.js';

console.log('--- SAMPLING 10 VARIANT 15 (TARGET SHORTFALL & BAR HEIGHT) QUESTIONS ---');

for (let i = 1; i <= 10; i++) {
  const type = i % 3 === 0 ? 'mcq' : (i % 3 === 1 ? 'structured' : 'short question');
  const res = p3GraphAxisScalesBlueprint.generate('advanced', 'advanced_target_shortfall_bar_height_prediction', type);
  const prompt = res.aiPrompt;

  const qMatch = prompt.match(/CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string[^\n]*\n"([^"]+)"/);
  const faMatch = prompt.match(/EXACT FINAL ANSWER:\n"([^"]+)"/);
  const missingMatch = prompt.match(/"missingBar":\s*"([^"]+)"/);
  
  console.log(`\n[Sample ${i}] (${type.toUpperCase()}) | Missing Bar: ${missingMatch ? missingMatch[1] : 'N/A'}`);
  if (qMatch) console.log(`Question: ${qMatch[1]}`);
  if (faMatch) console.log(`Final Answer: ${faMatch[1]}`);

  if (type === 'structured') {
    const inputReqMatch = prompt.match(/"inputType":\s*"MULTI_STEP_INPUT",\s*"steps":\s*(\[\s*\{[\s\S]*?\}\s*\])\s*\}/);
    if (inputReqMatch) {
      try {
        const steps = JSON.parse(inputReqMatch[1]);
        steps.forEach((s, idx) => {
          console.log(`  Step ${idx + 1}: ${s.label} -> Expected: "${s.expectedAnswer}"`);
        });
      } catch (e) {
        console.log('  Steps parsed error:', e.message);
      }
    }
  } else if (type === 'mcq') {
    const optMatch = prompt.match(/Generate EXACTLY 4 options in "content\.options":\n- "([^"]+)"\n- "([^"]+)"\n- "([^"]+)"\n- "([^"]+)"/);
    if (optMatch) {
      console.log(`  Options: ${optMatch[1]}, ${optMatch[2]}, ${optMatch[3]}, ${optMatch[4]}`);
    }
  }
}
