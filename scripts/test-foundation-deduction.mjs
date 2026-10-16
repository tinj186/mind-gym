import { p3BarGraphInterpretationBlueprint } from '../src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/bar-graph-interpretation.js';

console.log('Testing variety in foundation_reverse_category_deduction across 40 runs...');

const relationsSeen = new Set();
const scaleStepsSeen = new Set();
const themesSeen = new Set();

for (let i = 0; i < 40; i++) {
  const type = i % 3 === 0 ? 'structured' : i % 3 === 1 ? 'mcq' : 'short question';
  const res = p3BarGraphInterpretationBlueprint.generate('foundation', 'foundation_reverse_category_deduction', type);
  const prompt = res.aiPrompt;

  if (prompt.includes('undefined') || prompt.includes('NaN')) {
    console.error(`FAILED: Found undefined or NaN in run ${i}`);
    process.exit(1);
  }

  // Relations
  if (prompt.includes('twice as many') || prompt.includes('2 times')) relationsSeen.add('twice/double');
  if (prompt.includes('3 times as many')) relationsSeen.add('3_times');
  if (prompt.includes('4 times as many')) relationsSeen.add('4_times');
  if (prompt.includes('half as many')) relationsSeen.add('half');
  if (prompt.includes('more')) relationsSeen.add('more_than');
  if (prompt.includes('fewer')) relationsSeen.add('fewer_than');

  // Scale step
  const sMatch = prompt.match(/"scaleStep":\s*(\d+)/);
  if (sMatch) scaleStepsSeen.add(Number(sMatch[1]));

  // Theme
  const tMatch = prompt.match(/"title":\s*"([^"]+)"/);
  if (tMatch) themesSeen.add(tMatch[1]);

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

console.log('Relations seen:', Array.from(relationsSeen));
console.log('Scale steps seen:', Array.from(scaleStepsSeen));
console.log('Themes seen count:', themesSeen.size);

if (relationsSeen.size < 4) {
  console.error('FAILED: Insufficient relation diversity!');
  process.exit(1);
}

console.log('✓ All 40 runs of foundation_reverse_category_deduction passed with outstanding variety!');
