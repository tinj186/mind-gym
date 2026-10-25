import { p4NumberComparisonAndOrderingBlueprint } from '../src/lib/syllabus/math/primary-4/whole-numbers-numbers-up-to-100000/number-comparison-and-ordering.js';

console.log('--- Testing P4 Number Comparison Blueprint (All Foundation & Standard Variants) ---');

let errors = 0;
const types = ['MCQ', 'Short Question', 'Structured'];

// 1. Foundation Variants
const foundationVariants = [
  'foundation_compare_two_numbers',
  'foundation_difference_deduction',
  'foundation_number_line_reading',
  'foundation_place_value_step_shifts',
  'foundation_extreme_sorting_digit_cards',
  'foundation_three_entity_extrema'
];

for (const variant of foundationVariants) {
  for (const type of types) {
    for (let i = 0; i < 3; i++) {
      try {
        const res = p4NumberComparisonAndOrderingBlueprint.generate('foundation', variant, type);
        const prompt = res.aiPrompt;

        const finalAnswerMatch = prompt.match(/The finalAnswer must be strictly "([^"]+)"/);
        if (!finalAnswerMatch) {
          console.error(`[Foundation][${variant}][${type}] Failed to find finalAnswer!`);
          errors++;
          continue;
        }

        if (type === 'MCQ') {
          const optionsMatch = prompt.match(/- Generate EXACTLY 4 options: (\[[^\]]+\])/);
          if (!optionsMatch) {
            console.error(`[Foundation][${variant}][${type}] Missing options!`);
            errors++;
            continue;
          }
          const options = JSON.parse(optionsMatch[1]);
          if (options.length !== 4 || new Set(options).size !== 4) {
            console.error(`[Foundation][${variant}][${type}] Invalid options:`, options);
            errors++;
          }
        } else if (type === 'Structured') {
          if (!prompt.includes('"inputType": "MULTI_STEP_INPUT"')) {
            console.error(`[Foundation][${variant}][${type}] Missing MULTI_STEP_INPUT!`);
            errors++;
          }
        }
      } catch (err) {
        console.error(`[Foundation][${variant}][${type}] Error:`, err);
        errors++;
      }
    }
  }
}

// 2. All 6 Standard Variants
const standardVariants = [
  'standard_order_numbers',
  'standard_total_difference_base',
  'standard_missing_interval_deduction',
  'standard_target_shortfall_comparison',
  'standard_condition_digit_difference',
  'standard_chain_comparison_three_entities'
];

for (const variant of standardVariants) {
  for (const type of types) {
    for (let i = 0; i < 5; i++) {
      try {
        const res = p4NumberComparisonAndOrderingBlueprint.generate('standard', variant, type);
        const prompt = res.aiPrompt;

        const finalAnswerMatch = prompt.match(/The finalAnswer must be strictly "([^"]+)"/);
        if (!finalAnswerMatch) {
          console.error(`[Standard][${variant}][${type}] Failed to find finalAnswer!`);
          errors++;
          continue;
        }
        const finalAnswer = finalAnswerMatch[1];

        if (type === 'MCQ') {
          const optionsMatch = prompt.match(/- Generate EXACTLY 4 options: (\[[^\]]+\])/);
          if (!optionsMatch) {
            console.error(`[Standard][${variant}][${type}] Missing options in prompt!`);
            errors++;
            continue;
          }
          const options = JSON.parse(optionsMatch[1]);
          if (options.length !== 4) {
            console.error(`[Standard][${variant}][${type}] Options length != 4:`, options);
            errors++;
          }
          if (new Set(options).size !== 4) {
            console.error(`[Standard][${variant}][${type}] Duplicate options:`, options);
            errors++;
          }
          if (!options.includes(finalAnswer)) {
            console.error(`[Standard][${variant}][${type}] finalAnswer "${finalAnswer}" not in options:`, options);
            errors++;
          }

          // Check defectMap
          const defectMapMatch = prompt.match(/- Set defectMap to: (\{[^\}]+\})/);
          if (!defectMapMatch) {
            console.error(`[Standard][${variant}][${type}] Missing defectMap in prompt!`);
            errors++;
          } else {
            const defectMap = JSON.parse(defectMapMatch[1]);
            for (const opt of options) {
              if (opt !== finalAnswer && !defectMap[opt]) {
                console.error(`[Standard][${variant}][${type}] Distractor "${opt}" not in defectMap:`, defectMap);
                errors++;
              }
            }
          }
        } else if (type === 'Structured') {
          if (!prompt.includes('"inputType": "MULTI_STEP_INPUT"')) {
            console.error(`[Standard][${variant}][${type}] Missing MULTI_STEP_INPUT in prompt!`);
            errors++;
          }
          if (!prompt.includes('"steps"')) {
            console.error(`[Standard][${variant}][${type}] Missing structured steps in prompt!`);
            errors++;
          }
        }

        // Check visual engine is valid
        if (!prompt.includes('"visualEngine"')) {
          console.error(`[Standard][${variant}][${type}] Missing visualEngine!`);
          errors++;
        }
      } catch (err) {
        console.error(`[Standard][${variant}][${type}] Error thrown:`, err);
        errors++;
      }
    }
  }
}

// 3. Test legacy aliases and variety invocations
const legacyInvocations = [
  'standard_order_asc_diff_ten_thousands',
  'standard_order_desc_diff_ten_thousands',
  'standard_order_asc_same_ten_thousands',
  'standard_order_desc_same_ten_thousands',
  'standard_order_mixed_digits',
  'standard_order_numbers:asc_diff_ten_thousands',
  'asc_diff_ten_thousands',
  'variety_3'
];

for (const alias of legacyInvocations) {
  for (const type of types) {
    try {
      const res = p4NumberComparisonAndOrderingBlueprint.generate('standard', alias, type);
      if (!res.aiPrompt.includes('standard_order_numbers')) {
        console.error(`[Alias][${alias}] Failed to route to standard_order_numbers!`);
        errors++;
      }
    } catch (err) {
      console.error(`[Alias][${alias}] Error thrown:`, err);
      errors++;
    }
  }
}

console.log(`\nTests completed with ${errors} errors.`);
if (errors === 0) {
  console.log('SUCCESS: All P4 Number Comparison Foundation & Standard tests passed!');
} else {
  process.exit(1);
}
