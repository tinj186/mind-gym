import { p3BarGraphInterpretationBlueprint } from '../src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/bar-graph-interpretation.js';

console.log('Testing variety in foundation_threshold_filtering across 30 runs...');

const thresholdsSeen = new Set();
const conditionsSeen = new Set();
const scaleStepsSeen = new Set();
const qualifyingCountsSeen = new Set();

for (let i = 0; i < 30; i++) {
  const type = i % 3 === 0 ? 'structured' : i % 3 === 1 ? 'mcq' : 'short question';
  const res = p3BarGraphInterpretationBlueprint.generate('foundation', 'foundation_threshold_filtering', type);
  const prompt = res.aiPrompt;

  if (prompt.includes('undefined') || prompt.includes('NaN')) {
    console.error(`FAILED: Found undefined or NaN in run ${i}`);
    process.exit(1);
  }

  // Extract threshold
  const tMatch = prompt.match(/(?:more than|fewer than)\s+(\d+)/);
  if (tMatch) thresholdsSeen.add(Number(tMatch[1]));

  // Extract condition
  if (prompt.includes('more than')) conditionsSeen.add('more than');
  if (prompt.includes('fewer than')) conditionsSeen.add('fewer than');

  // Extract scaleStep
  const sMatch = prompt.match(/"scaleStep":\s*(\d+)/);
  if (sMatch) scaleStepsSeen.add(Number(sMatch[1]));

  // Check 2 vs 3 items in structured
  if (type === 'structured') {
    if (prompt.includes('List the values of the categories with') && prompt.match(/\+\s*\d+\s*\+\s*\d+/)) {
      qualifyingCountsSeen.add(3);
    } else {
      qualifyingCountsSeen.add(2);
    }
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
console.log('Thresholds seen:', Array.from(thresholdsSeen));
console.log('Conditions seen:', Array.from(conditionsSeen));
console.log('Qualifying counts seen:', Array.from(qualifyingCountsSeen));

if (thresholdsSeen.size < 3) {
  console.error('FAILED: Insufficient threshold diversity!');
  process.exit(1);
}

if (scaleStepsSeen.size < 2) {
  console.error('FAILED: Insufficient scale step diversity!');
  process.exit(1);
}

console.log('✓ All 30 runs of foundation_threshold_filtering passed cleanly with rich diversity!');
