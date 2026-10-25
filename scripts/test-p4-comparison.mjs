import { p4NumberComparisonAndOrderingBlueprint } from '../src/lib/syllabus/math/primary-4/whole-numbers-numbers-up-to-100000/number-comparison-and-ordering.js';

console.log('--- Testing P4 Number Comparison Blueprint (Foundation & Standard Consolidated Variants) ---');

let errors = 0;

const types = ['MCQ', 'Short Question', 'Structured'];

// 1. Test Foundation Variants
const foundationVariants = [
  'foundation_compare_two_numbers',
  'foundation_difference_deduction',
  'foundation_number_line_reading',
  'foundation_place_value_step_shifts',
  'foundation_extreme_sorting_digit_cards',
  'foundation_three_entity_extrema',
  // Test legacy aliases
  'foundation_compare_greater_ten_thousands',
  'foundation_compare_smaller_ten_thousands',
  'foundation_compare_greater_thousands',
  'foundation_compare_smaller_thousands',
  'foundation_compare_hundreds_tens'
];

for (const variant of foundationVariants) {
  for (const type of types) {
    for (let i = 0; i < 5; i++) {
      try {
        const res = p4NumberComparisonAndOrderingBlueprint.generate('foundation', variant, type);
        const prompt = res.aiPrompt;

        const finalAnswerMatch = prompt.match(/The finalAnswer must be strictly "([^"]+)"/);
        if (!finalAnswerMatch) {
          console.error(`[Foundation][${variant}][${type}] Failed to find finalAnswer in prompt!`);
          errors++;
          continue;
        }
        const finalAnswer = finalAnswerMatch[1];

        if (type === 'MCQ') {
          const optionsMatch = prompt.match(/- Generate EXACTLY 4 options: (\[[^\]]+\])/);
          if (!optionsMatch) {
            console.error(`[Foundation][${variant}][${type}] Missing options in prompt!`);
            errors++;
            continue;
          }
          const options = JSON.parse(optionsMatch[1]);
          if (!options || options.length !== 4) {
            console.error(`[Foundation][${variant}][${type}] Options length != 4:`, options);
            errors++;
          }
          if (new Set(options).size !== 4) {
            console.error(`[Foundation][${variant}][${type}] Duplicate options:`, options);
            errors++;
          }
          if (!options.includes(finalAnswer)) {
            console.error(`[Foundation][${variant}][${type}] finalAnswer "${finalAnswer}" not in options:`, options);
            errors++;
          }
        } else if (type === 'Structured') {
          if (!prompt.includes('"inputType": "MULTI_STEP_INPUT"') && !prompt.includes('"inputType":"MULTI_STEP_INPUT"')) {
            console.error(`[Foundation][${variant}][${type}] Missing MULTI_STEP_INPUT!`);
            errors++;
          }
        }
      } catch (err) {
        console.error(`[Foundation][${variant}][${type}] Error thrown:`, err);
        errors++;
      }
    }
  }
}

// 2. Test Standard Consolidated Variant & All Variety Calling Mechanisms
const standardInvocations = [
  // A. Canonical unified variant
  { desc: 'unified standard_order_numbers', call: (t) => p4NumberComparisonAndOrderingBlueprint.generate('standard', 'standard_order_numbers', t) },
  
  // B. Legacy variant names
  { desc: 'legacy standard_order_asc_diff_ten_thousands', call: (t) => p4NumberComparisonAndOrderingBlueprint.generate('standard', 'standard_order_asc_diff_ten_thousands', t) },
  { desc: 'legacy standard_order_desc_diff_ten_thousands', call: (t) => p4NumberComparisonAndOrderingBlueprint.generate('standard', 'standard_order_desc_diff_ten_thousands', t) },
  { desc: 'legacy standard_order_asc_same_ten_thousands', call: (t) => p4NumberComparisonAndOrderingBlueprint.generate('standard', 'standard_order_asc_same_ten_thousands', t) },
  { desc: 'legacy standard_order_desc_same_ten_thousands', call: (t) => p4NumberComparisonAndOrderingBlueprint.generate('standard', 'standard_order_desc_same_ten_thousands', t) },
  { desc: 'legacy standard_order_mixed_digits', call: (t) => p4NumberComparisonAndOrderingBlueprint.generate('standard', 'standard_order_mixed_digits', t) },

  // C. Colon-separated variety syntax
  { desc: 'colon syntax standard_order_numbers:asc_diff_ten_thousands', call: (t) => p4NumberComparisonAndOrderingBlueprint.generate('standard', 'standard_order_numbers:asc_diff_ten_thousands', t) },
  { desc: 'colon syntax standard_order_numbers:desc_same_ten_thousands', call: (t) => p4NumberComparisonAndOrderingBlueprint.generate('standard', 'standard_order_numbers:desc_same_ten_thousands', t) },
  { desc: 'colon syntax standard_order_numbers:mixed_digits', call: (t) => p4NumberComparisonAndOrderingBlueprint.generate('standard', 'standard_order_numbers:mixed_digits', t) },

  // D. Options object syntax
  { desc: 'options object variety', call: (t) => p4NumberComparisonAndOrderingBlueprint.generate('standard', 'standard_order_numbers', t, { variety: 'asc_same_ten_thousands' }) },

  // E. Object variant parameter syntax
  { desc: 'object variant param', call: (t) => p4NumberComparisonAndOrderingBlueprint.generate('standard', { variant: 'standard_order_numbers', variety: 'desc_diff_ten_thousands' }, t) },

  // F. Direct variety keys
  { desc: 'direct variety key asc_diff_ten_thousands', call: (t) => p4NumberComparisonAndOrderingBlueprint.generate('standard', 'asc_diff_ten_thousands', t) },
  { desc: 'direct variety key mixed_digits', call: (t) => p4NumberComparisonAndOrderingBlueprint.generate('standard', 'mixed_digits', t) },

  // G. Index variety syntax
  { desc: 'variety index variety_1', call: (t) => p4NumberComparisonAndOrderingBlueprint.generate('standard', 'variety_1', t) },
  { desc: 'variety index variety_4', call: (t) => p4NumberComparisonAndOrderingBlueprint.generate('standard', 'variety_4', t) }
];

for (const testCase of standardInvocations) {
  for (const type of types) {
    for (let i = 0; i < 5; i++) {
      try {
        const res = testCase.call(type);
        const prompt = res.aiPrompt;

        const finalAnswerMatch = prompt.match(/The finalAnswer must be strictly "([^"]+)"/);
        if (!finalAnswerMatch) {
          console.error(`[Standard][${testCase.desc}][${type}] Failed to find finalAnswer in prompt!`);
          errors++;
          continue;
        }
        const finalAnswer = finalAnswerMatch[1];

        // Verify visual engine
        if (!prompt.includes('"componentToRender": "NUMBER_CARDS"')) {
          console.error(`[Standard][${testCase.desc}][${type}] Missing NUMBER_CARDS visual engine!`);
          errors++;
        }

        if (type === 'MCQ') {
          const optionsMatch = prompt.match(/- Generate EXACTLY 4 options: (\[[^\]]+\])/);
          if (!optionsMatch) {
            console.error(`[Standard][${testCase.desc}][${type}] Missing options in prompt!`);
            errors++;
            continue;
          }
          const options = JSON.parse(optionsMatch[1]);
          if (!options || options.length !== 4) {
            console.error(`[Standard][${testCase.desc}][${type}] Options length != 4:`, options);
            errors++;
          }
          if (new Set(options).size !== 4) {
            console.error(`[Standard][${testCase.desc}][${type}] Duplicate options:`, options);
            errors++;
          }
          if (!options.includes(finalAnswer)) {
            console.error(`[Standard][${testCase.desc}][${type}] finalAnswer "${finalAnswer}" not in options:`, options);
            errors++;
          }
        } else if (type === 'Structured') {
          if (!prompt.includes('"inputType": "MULTI_STEP_INPUT"')) {
            console.error(`[Standard][${testCase.desc}][${type}] Missing MULTI_STEP_INPUT in prompt!`);
            errors++;
          }
          if (!prompt.includes('"steps"')) {
            console.error(`[Standard][${testCase.desc}][${type}] Missing structured steps in prompt!`);
            errors++;
          }
        }
      } catch (err) {
        console.error(`[Standard][${testCase.desc}][${type}] Error thrown:`, err);
        errors++;
      }
    }
  }
}

console.log(`\nAll tests completed with ${errors} errors.`);
if (errors === 0) {
  console.log('SUCCESS: All P4 number comparison Foundation and Standard tests passed!');
} else {
  process.exit(1);
}
