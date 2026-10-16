import { p3BarGraphInterpretationBlueprint } from '../src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/bar-graph-interpretation.js';

console.log('Testing standard_halfway_computations across 50 runs...');

const scaleStepsSeen = new Set();
const themesSeen = new Set();
const subTypesSeen = new Set();

for (let i = 0; i < 50; i++) {
  const type = i % 3 === 0 ? 'structured' : i % 3 === 1 ? 'mcq' : 'short question';
  const res = p3BarGraphInterpretationBlueprint.generate('standard', 'standard_halfway_computations', type);
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
  if (prompt.includes('grand total') || prompt.includes('across all 4 categories')) {
    if (prompt.includes('missing')) subTypesSeen.add('missing_grand_total');
    else subTypesSeen.add('grand_total');
  } else if (prompt.includes('combined total of') && prompt.includes('missing')) {
    subTypesSeen.add('missing_pair_total');
  } else if (prompt.includes('how many more') || prompt.includes('Difference:')) {
    subTypesSeen.add('difference');
  } else if (prompt.includes('3 visible') || prompt.includes('values of') && (prompt.match(/,/g) || []).length >= 2) {
    subTypesSeen.add('total_3');
  } else {
    subTypesSeen.add('total_2');
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

console.log('✓ All 50 runs of standard_halfway_computations passed with outstanding variety!');
