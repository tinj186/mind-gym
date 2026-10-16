import { p3BarGraphInterpretationBlueprint } from '../src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/bar-graph-interpretation.js';

console.log('Verifying MCQ Option A matches finalAnswer for all 15 variants...');

const variants = Object.keys(p3BarGraphInterpretationBlueprint.variants);

for (const variant of variants) {
  const diff = variant.split('_')[0];
  const res = p3BarGraphInterpretationBlueprint.generate(diff, variant, 'mcq');
  const prompt = res.aiPrompt;

  // Extract finalAnswer from EXACT FINAL ANSWER or schema template
  const matchFinal = prompt.match(/EXACT FINAL ANSWER:\s*"([^"]+)"/) || prompt.match(/"finalAnswer":\s*"([^"]+)"/);
  const matchOptA = prompt.match(/- "([^"]+)"/);

  if (!matchFinal || !matchOptA) {
    console.error(`FAILED to parse finalAnswer or Option A for ${variant}`);
    process.exit(1);
  }

  const finalAnswer = matchFinal[1];
  const optA = matchOptA[1];

  if (optA !== finalAnswer) {
    console.error(`MISMATCH for ${variant}: Option A is "${optA}", but finalAnswer is "${finalAnswer}"`);
    process.exit(1);
  }
  console.log(`✓ ${variant}: Option A "${optA}" matches finalAnswer "${finalAnswer}"`);
}

console.log('\n🎉 ALL 15 VARIANTS GUARANTEE OPTION A IS THE CORRECT ANSWER!');
