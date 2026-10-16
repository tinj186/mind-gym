import { p3BarGraphInterpretationBlueprint } from '../src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/bar-graph-interpretation.js';

console.log('Testing standard_subgroup_part_whole across 100 runs...');

const scaleStepsSeen = new Set();
const themesSeen = new Set();
const subTypesSeen = new Set();
const orientationsSeen = new Set();

for (let i = 0; i < 100; i++) {
  const type = i % 3 === 0 ? 'structured' : i % 3 === 1 ? 'mcq' : 'short question';
  const res = p3BarGraphInterpretationBlueprint.generate('standard', 'standard_subgroup_part_whole', type);
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
    if (prompt.includes('more') && prompt.includes('than in')) {
      subTypesSeen.add('sub7_missing_comparison');
    } else {
      subTypesSeen.add('sub6_missing_known_subgroups');
    }
  } else if (prompt.includes('twice as many')) {
    subTypesSeen.add('sub5_internal_ratio');
  } else if (prompt.includes('half') || prompt.includes('one-quarter')) {
    subTypesSeen.add('sub4_fractional');
  } else if (prompt.includes('combined')) {
    subTypesSeen.add('sub3_combined_subgroups');
  } else if (prompt.includes('than in') || prompt.includes('than')) {
    subTypesSeen.add('sub2_cross_category_comparison');
  } else {
    subTypesSeen.add('sub1_single_deduction');
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
console.log('Sub-types seen (' + subTypesSeen.size + '/7):', Array.from(subTypesSeen));

if (scaleStepsSeen.size < 4) {
  console.error('FAILED: Insufficient scale diversity! Expected 4, got', scaleStepsSeen.size);
  process.exit(1);
}

if (subTypesSeen.size < 7) {
  console.error('FAILED: Not all 7 sub-types observed! Got', subTypesSeen.size);
  process.exit(1);
}

if (themesSeen.size < 8) {
  console.error('FAILED: Insufficient theme diversity! Expected >= 8, got', themesSeen.size);
  process.exit(1);
}

console.log('ALL 100 RUNS PASSED WITH FULL DIVERSITY!');
