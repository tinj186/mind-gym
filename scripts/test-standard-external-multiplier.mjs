import { p3BarGraphInterpretationBlueprint } from '../src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/bar-graph-interpretation.js';

console.log('Testing standard_external_multiplier across 100 runs...');

const scaleStepsSeen = new Set();
const themesSeen = new Set();
const subTypesSeen = new Set();
const orientationsSeen = new Set();

for (let i = 0; i < 100; i++) {
  const type = i % 3 === 0 ? 'structured' : i % 3 === 1 ? 'mcq' : 'short question';
  const res = p3BarGraphInterpretationBlueprint.generate('standard', 'standard_external_multiplier', type);
  const prompt = res.aiPrompt;

  if (prompt.includes('undefined') || prompt.includes('NaN')) {
    console.error(`FAILED: Found undefined or NaN in run ${i}`);
    process.exit(1);
  }

  // Scale step
  const sMatch = prompt.match(/"scaleStep":\s*(\d+)/);
  if (sMatch) scaleStepsSeen.add(Number(sMatch[1]));

  // Orientation
  const oMatch = prompt.match(/"orientation":\s*"([^"]+)"/);
  if (oMatch) orientationsSeen.add(oMatch[1]);

  // Theme
  const tMatch = prompt.match(/"title":\s*"([^"]+)"/);
  if (tMatch) themesSeen.add(tMatch[1]);

  // Sub-types detection
  if (prompt.includes('missing')) {
    if (prompt.includes('combined total of')) {
      subTypesSeen.add('sub9_reverse_missing_pair_total');
    } else {
      subTypesSeen.add('sub8_reverse_missing_single');
    }
  } else if (prompt.includes('Which category has')) {
    subTypesSeen.add('sub7_reverse_category_deduction');
  } else if (prompt.includes('how many') && (prompt.includes('are packed in each') || prompt.includes('are in each'))) {
    subTypesSeen.add('sub6_reverse_items_per_container');
  } else if (prompt.includes('combined than')) {
    subTypesSeen.add('sub5_pair_vs_single');
  } else if (prompt.includes('how many more') || prompt.includes('how many fewer')) {
    subTypesSeen.add('sub4_difference_items');
  } else if (prompt.includes('grand total') || prompt.includes('across all 4 categories')) {
    subTypesSeen.add('sub3_grand_total');
  } else if (prompt.includes('combined')) {
    subTypesSeen.add('sub2_combined_sum');
  } else {
    subTypesSeen.add('sub1_single_category_forward');
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
console.log('Orientations seen:', Array.from(orientationsSeen));
console.log('Themes count seen:', themesSeen.size, Array.from(themesSeen));
console.log('Sub-types seen (' + subTypesSeen.size + '/9):', Array.from(subTypesSeen));

if (scaleStepsSeen.size < 4) {
  console.error('FAILED: Insufficient scale diversity! Expected 4, got', scaleStepsSeen.size);
  process.exit(1);
}

if (subTypesSeen.size < 9) {
  console.error('FAILED: Not all 9 sub-types observed! Got', subTypesSeen.size);
  process.exit(1);
}

if (themesSeen.size < 10) {
  console.error('FAILED: Insufficient theme diversity! Expected >= 10, got', themesSeen.size);
  process.exit(1);
}

console.log('ALL 100 RUNS PASSED WITH FULL DIVERSITY!');
