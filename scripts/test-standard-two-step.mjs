import { p3BarGraphInterpretationBlueprint } from '../src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/bar-graph-interpretation.js';

console.log('Testing standard_two_step_comparison across 50 runs...');

const scaleStepsSeen = new Set();
const themesSeen = new Set();
const subTypesSeen = new Set();

for (let i = 0; i < 50; i++) {
  const type = i % 3 === 0 ? 'structured' : i % 3 === 1 ? 'mcq' : 'short question';
  const res = p3BarGraphInterpretationBlueprint.generate('standard', 'standard_two_step_comparison', type);
  const prompt = res.aiPrompt;

  if (prompt.includes('undefined') || prompt.includes('NaN')) {
    console.error(`FAILED: Found undefined or NaN in run ${i}`);
    process.exit(1);
  }

  // Scale step
  const sMatch = prompt.match(/"scaleStep":\s*(\d+)/);
  if (sMatch) scaleStepsSeen.add(Number(sMatch[1]));

  // Theme
  const tMatch = prompt.match(/"title":\s*"([^"]+)"/);
  if (tMatch) themesSeen.add(tMatch[1]);

  // Sub-types detection
  if (prompt.includes('difference between the two groups')) {
    subTypesSeen.add('pair_vs_pair');
  } else if (prompt.includes('minus') || prompt.includes('calculate the difference between')) {
    subTypesSeen.add('diff_vs_third');
  } else if (prompt.includes('missing')) {
    if (prompt.includes('Combined Total - Difference')) subTypesSeen.add('reverse_missing_c');
    else subTypesSeen.add('reverse_missing_a');
  } else if (prompt.includes('fewer')) {
    subTypesSeen.add('fewer_than');
  } else {
    subTypesSeen.add('more_than');
  }

  // Verify MCQ Option A
  if (type === 'mcq') {
    const matchFinal = prompt.match(/EXACT FINAL ANSWER:\s*"([^"]+)"/);
    const matchOptA = prompt.match(/- "([^"]+)"/);
    if (matchFinal && matchOptA && matchOptA[1] !== matchFinal[1]) {
      console.error(`Option A mismatch in run ${i}: ${matchOptA[1]} vs ${matchFinal[1]}`);
      process.exit(1);
    }
  }
}

console.log('Scale steps seen:', Array.from(scaleStepsSeen));
console.log('Themes count seen:', themesSeen.size);
console.log('Sub-types seen:', Array.from(subTypesSeen));

if (scaleStepsSeen.size < 3) {
  console.error('FAILED: Insufficient scale diversity!');
  process.exit(1);
}

if (themesSeen.size < 5) {
  console.error('FAILED: Insufficient theme diversity!');
  process.exit(1);
}

console.log('✓ All 50 runs of standard_two_step_comparison passed with outstanding variety!');
