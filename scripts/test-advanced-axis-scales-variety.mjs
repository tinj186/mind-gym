import { p3GraphAxisScalesBlueprint } from '../src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/graph-axis-scales.js';

const advancedVariants = [
  'advanced_missing_scale_value_difference_deduction',
  'advanced_scale_translation_block_projection',
  'advanced_blank_axis_financial_application',
  'advanced_equalizing_transfer_grid_block_shift',
  'advanced_target_shortfall_bar_height_prediction'
];

const types = ['structured', 'mcq', 'short question'];

console.log('Testing 5 Advanced Variants with 30 iterations each...');

let totalTests = 0;
let passedTests = 0;

for (const variant of advancedVariants) {
  for (const type of types) {
    for (let i = 0; i < 30; i++) {
      totalTests++;
      try {
        const res = p3GraphAxisScalesBlueprint.generate('advanced', variant, type);
        const prompt = res.aiPrompt;

        // Verify JSON template
        const jsonMatch = prompt.match(/\{[\s\S]*"meta":\s*\{[\s\S]*"variant":\s*"([^"]+)"[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Missing JSON template');

        // Check MCQ
        if (type === 'mcq') {
          const optMatch = prompt.match(/Generate EXACTLY 4 options in "content\.options":\n- "([^"]+)"\n- "([^"]+)"\n- "([^"]+)"\n- "([^"]+)"/);
          if (!optMatch) throw new Error('MCQ does not have exactly 4 precalculated options');
          const options = [optMatch[1], optMatch[2], optMatch[3], optMatch[4]];
          const uniqueOptions = new Set(options);
          if (uniqueOptions.size !== 4) throw new Error(`MCQ options not unique: ${JSON.stringify(options)}`);
          
          const faMatch = prompt.match(/EXACT FINAL ANSWER:\n"([^"]+)"/);
          if (!faMatch) throw new Error('Missing exact final answer');
          const finalAnswer = faMatch[1];
          if (!options.includes(finalAnswer)) {
            throw new Error(`finalAnswer "${finalAnswer}" not found in options: ${JSON.stringify(options)}`);
          }
        }

        // Check Structured
        if (type === 'structured') {
          if (!prompt.includes('"inputType": "MULTI_STEP_INPUT"') && !prompt.includes('"inputType":"MULTI_STEP_INPUT"')) {
            throw new Error('Structured question missing MULTI_STEP_INPUT');
          }
        }

        // Specific Variant Checks
        if (variant === 'advanced_missing_scale_value_difference_deduction' || variant === 'advanced_blank_axis_financial_application') {
          if (!prompt.includes('"showScaleNumbers": false') && !prompt.includes('"showScaleNumbers":false')) {
            throw new Error(`Variant ${variant} must have showScaleNumbers: false`);
          }
        }

        if (variant === 'advanced_target_shortfall_bar_height_prediction') {
          if (!prompt.includes('"missingBar":')) {
            throw new Error('Variant 15 must specify missingBar');
          }
        }

        passedTests++;
      } catch (err) {
        console.error(`❌ FAILED on ${variant} [${type}] iter ${i}:`, err.message);
      }
    }
  }
}

console.log(`\nAdvanced Variety Test Results: ${passedTests} / ${totalTests} passed.`);

if (passedTests === totalTests) {
  console.log('🎉 ALL ADVANCED LEVEL VARIANTS PASSED 450 ITERATIONS TEST SUITE PERFECTLY!');
} else {
  process.exit(1);
}
