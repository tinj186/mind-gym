import { p3GraphAxisScalesBlueprint } from '../src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/graph-axis-scales.js';

const variants = Object.keys(p3GraphAxisScalesBlueprint.variants);
const types = ['structured', 'mcq', 'short question'];

console.log(`Testing all ${variants.length} variants across 3 question types...`);

let passed = 0;
let failed = 0;

for (const variant of variants) {
  let difficulty = 'foundation';
  if (variant.startsWith('standard_')) difficulty = 'standard';
  if (variant.startsWith('advanced_')) difficulty = 'advanced';

  for (const type of types) {
    try {
      const res = p3GraphAxisScalesBlueprint.generate(difficulty, variant, type);
      if (!res || !res.aiPrompt) {
        throw new Error(`Missing aiPrompt for ${variant} (${type})`);
      }

      const prompt = res.aiPrompt;

      // Extract JSON template block
      const jsonMatch = prompt.match(/\{[\s\S]*"meta":\s*\{[\s\S]*"variant":\s*"([^"]+)"[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error(`Failed to match JSON template for ${variant} (${type})`);
      }

      // Check MCQ requirements
      if (type === 'mcq') {
        const optMatch = prompt.match(/Generate EXACTLY 4 options in "content\.options":/);
        if (!optMatch) {
          throw new Error(`MCQ missing 4 exact options prompt for ${variant}`);
        }
      }

      // Check Structured requirements
      if (type === 'structured') {
        if (!prompt.includes('"inputType": "MULTI_STEP_INPUT"') && !prompt.includes('"inputType":"MULTI_STEP_INPUT"')) {
          throw new Error(`Structured question missing MULTI_STEP_INPUT for ${variant}`);
        }
      }

      // Check blank axis variants
      if ([
        'standard_deductive_axis_labeling',
        'advanced_missing_scale_value_difference_deduction',
        'advanced_blank_axis_financial_application',
        'advanced_missing_scale_missing_bar',
        'advanced_axis_deduction_stated_differences'
      ].includes(variant)) {
        if (!prompt.includes('"showScaleNumbers": false') && !prompt.includes('"showScaleNumbers":false')) {
          throw new Error(`Variant ${variant} must set showScaleNumbers: false`);
        }
      }

      passed++;
    } catch (err) {
      console.error(`❌ FAILED ${variant} [${type}]:`, err.message);
      failed++;
    }
  }
}

console.log(`\nTest Results: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('✅ ALL 15 VARIANTS PASSED PERFECTLY!');
}
