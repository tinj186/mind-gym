import { p3BarGraphInterpretationBlueprint } from '../src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/bar-graph-interpretation.js';

console.log('Testing variety in foundation_finding_difference across 40 runs...');

const subTypesSeen = new Set();

for (let i = 0; i < 40; i++) {
  const type = i % 3 === 0 ? 'structured' : i % 3 === 1 ? 'mcq' : 'short question';
  const res = p3BarGraphInterpretationBlueprint.generate('foundation', 'foundation_finding_difference', type);
  const prompt = res.aiPrompt;

  if (prompt.includes('undefined') || prompt.includes('NaN')) {
    console.error(`FAILED: Found undefined or NaN in run ${i}`);
    process.exit(1);
  }

  if (prompt.includes('the 2nd most') || prompt.includes('the 3rd most') || prompt.includes('the fewest')) {
    subTypesSeen.add('ranked_ordinal');
  } else if (prompt.includes('more') && prompt.includes('missing')) {
    subTypesSeen.add('find_a_missing');
  } else if (prompt.includes('fewer') && prompt.includes('missing')) {
    subTypesSeen.add('find_b_missing');
  } else if (prompt.includes('Which category has exactly')) {
    subTypesSeen.add('reverse_category_deduction');
  } else {
    subTypesSeen.add('specific_pair_difference');
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

console.log('Sub-types generated during 40 runs:', Array.from(subTypesSeen));
console.log('✓ All 40 runs of foundation_finding_difference passed cleanly!');
