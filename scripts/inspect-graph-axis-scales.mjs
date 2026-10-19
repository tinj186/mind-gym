import { p3GraphAxisScalesBlueprint } from '../src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/graph-axis-scales.js';

const sampleVariants = [
  'foundation_scale_step_identification',
  'foundation_reading_graph_total',
  'foundation_reverse_total_scale_deduction',
  'foundation_grid_block_multiplication',
  'foundation_scale_verification_difference'
];

for (const variant of sampleVariants) {
  let diff = 'foundation';
  if (variant.startsWith('standard_')) diff = 'standard';
  if (variant.startsWith('advanced_')) diff = 'advanced';

  console.log(`\n======================================================`);
  console.log(`VARIANT: ${variant} [${diff.toUpperCase()}]`);
  console.log(`======================================================`);

  for (const type of ['structured', 'mcq']) {
    console.log(`\n--- TYPE: ${type.toUpperCase()} ---`);
    const res = p3GraphAxisScalesBlueprint.generate(diff, variant, type);
    const prompt = res.aiPrompt;

    const askMatch = prompt.match(/CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string[^\n]*\n"([^"]+)"/);
    if (askMatch) console.log('QUESTION:\n', askMatch[1]);

    const ansMatch = prompt.match(/EXACT FINAL ANSWER:\s*"([^"]+)"/);
    if (ansMatch) console.log('FINAL ANSWER:', ansMatch[1]);

    const reqMatch = prompt.match(/"inputRequirement":\s*(\{[^\n]+\})/);
    if (reqMatch) console.log('INPUT REQUIREMENT:\n', JSON.stringify(JSON.parse(reqMatch[1]), null, 2));

    const visualMatch = prompt.match(/"visualEngine":\s*(\{[^\n]+\})/);
    if (visualMatch) console.log('VISUAL ENGINE:\n', JSON.stringify(JSON.parse(visualMatch[1]), null, 2));
  }
}
