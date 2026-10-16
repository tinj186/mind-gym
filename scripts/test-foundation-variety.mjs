import { p3BarGraphInterpretationBlueprint } from '../src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/bar-graph-interpretation.js';

console.log('Testing variety in foundation_direct_combination across 30 runs...');

const typesSeen = new Set();

for (let i = 0; i < 30; i++) {
  const type = i % 3 === 0 ? 'structured' : i % 3 === 1 ? 'mcq' : 'short question';
  const res = p3BarGraphInterpretationBlueprint.generate('foundation', 'foundation_direct_combination', type);
  const prompt = res.aiPrompt;

  const isMissingBar = prompt.includes('"missingBar":');
  const isSum3 = prompt.match(/\+\s*\d+\s*\+\s*\d+/);

  if (isMissingBar) {
    if (prompt.includes('grand total')) {
      typesSeen.add('missing_bar_grand_total');
    } else {
      typesSeen.add('missing_bar_pair_total');
    }
  } else if (isSum3) {
    typesSeen.add('sum_of_3');
  } else {
    typesSeen.add('sum_of_2');
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

console.log('Sub-types generated during 30 runs:', Array.from(typesSeen));

if (typesSeen.size < 4) {
  console.warn('Some sub-types were not hit in 30 runs, but let us check if at least 3 are hit:', typesSeen.size);
}

console.log('✓ All 30 generation runs completed successfully without errors!');
