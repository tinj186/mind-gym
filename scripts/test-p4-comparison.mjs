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

// 3. All 6 Advanced Variants & Varieties
const allAdvancedVariants = [
  'advanced_form_numbers',
  'advanced_equalizing_transfer',
  'advanced_three_entity_grand_total',
  'advanced_shifting_difference_transfer',
  'advanced_overlapping_target_deduction',
  'advanced_two_tiered_difference'
];

for (const variant of allAdvancedVariants) {
  for (const type of types) {
    for (let i = 0; i < 5; i++) {
      try {
        const res = p4NumberComparisonAndOrderingBlueprint.generate('advanced', variant, type);
        const prompt = res.aiPrompt;

        const finalAnswerMatch = prompt.match(/The finalAnswer must be strictly "([^"]+)"/);
        if (!finalAnswerMatch) {
          console.error(`[Advanced][${variant}][${type}] Failed to find finalAnswer!`);
          errors++;
          continue;
        }
        const finalAnswer = finalAnswerMatch[1];

        if (type === 'MCQ') {
          const optionsMatch = prompt.match(/- Generate EXACTLY 4 options: (\[[^\]]+\])/);
          if (!optionsMatch) {
            console.error(`[Advanced][${variant}][${type}] Missing options in prompt!`);
            errors++;
            continue;
          }
          const options = JSON.parse(optionsMatch[1]);
          if (options.length !== 4) {
            console.error(`[Advanced][${variant}][${type}] Options length != 4:`, options);
            errors++;
          }
          if (new Set(options).size !== 4) {
            console.error(`[Advanced][${variant}][${type}] Duplicate options:`, options);
            errors++;
          }
          if (!options.includes(finalAnswer)) {
            console.error(`[Advanced][${variant}][${type}] finalAnswer "${finalAnswer}" not in options:`, options);
            errors++;
          }

          // Check defectMap
          const defectMapMatch = prompt.match(/- Set defectMap to: (\{[^\}]+\})/);
          if (!defectMapMatch) {
            console.error(`[Advanced][${variant}][${type}] Missing defectMap in prompt!`);
            errors++;
          } else {
            const defectMap = JSON.parse(defectMapMatch[1]);
            for (const opt of options) {
              if (opt !== finalAnswer && !defectMap[opt]) {
                console.error(`[Advanced][${variant}][${type}] Distractor "${opt}" not in defectMap:`, defectMap);
                errors++;
              }
            }
          }
        } else if (type === 'Structured') {
          if (!prompt.includes('"inputType": "MULTI_STEP_INPUT"')) {
            console.error(`[Advanced][${variant}][${type}] Missing MULTI_STEP_INPUT in prompt!`);
            errors++;
          }
          if (!prompt.includes('"steps"')) {
            console.error(`[Advanced][${variant}][${type}] Missing structured steps in prompt!`);
            errors++;
          }
        }

        // Check visual engine is valid
        if (!prompt.includes('"visualEngine"')) {
          console.error(`[Advanced][${variant}][${type}] Missing visualEngine!`);
          errors++;
        }
      } catch (err) {
        console.error(`[Advanced][${variant}][${type}] Error thrown:`, err);
        errors++;
      }
    }
  }
}

// 4. Test explicit varieties across Advanced variants
const varietyTests = [
  { variant: 'advanced_form_numbers', variety: 'greatest_5_digit' },
  { variant: 'advanced_form_numbers', variety: 'smallest_5_digit' },
  { variant: 'advanced_form_numbers', variety: 'greatest_even' },
  { variant: 'advanced_form_numbers', variety: 'smallest_odd' },
  { variant: 'advanced_form_numbers', variety: 'greatest_less_than_x' },
  { variant: 'advanced_form_numbers', variety: 'smallest_greater_than_x' },
  { variant: 'advanced_equalizing_transfer', variety: 'find_transfer_from_initial' },
  { variant: 'advanced_equalizing_transfer', variety: 'find_initial_from_equalized' },
  { variant: 'advanced_three_entity_grand_total', variety: 'find_smallest_base' },
  { variant: 'advanced_three_entity_grand_total', variety: 'find_middle_entity' },
  { variant: 'advanced_three_entity_grand_total', variety: 'find_largest_entity' },
  { variant: 'advanced_overlapping_target_deduction', variety: 'find_both_overlap' },
  { variant: 'advanced_overlapping_target_deduction', variety: 'find_group_a_only' },
  { variant: 'advanced_overlapping_target_deduction', variety: 'find_group_b_only' },
  { variant: 'advanced_two_tiered_difference', variety: 'compare_a_and_c_both_more' },
  { variant: 'advanced_two_tiered_difference', variety: 'compare_a_and_c_more_and_less' },
  { variant: 'advanced_two_tiered_difference', variety: 'combined_excess_over_twice_base' }
];

for (const { variant, variety } of varietyTests) {
  for (const type of types) {
    try {
      const res = p4NumberComparisonAndOrderingBlueprint.generate('advanced', {
        variant: variant,
        variety: variety
      }, type);
      const prompt = res.aiPrompt;

      if (!prompt.includes(variant)) {
        console.error(`[Advanced][${variant}:${variety}][${type}] Failed to route to ${variant}!`);
        errors++;
      }
      if (type === 'MCQ' && !prompt.includes('- Generate EXACTLY 4 options:')) {
        console.error(`[Advanced][${variant}:${variety}][${type}] Missing 4 options instruction!`);
        errors++;
      }
      if (type === 'Structured' && !prompt.includes('"inputType": "MULTI_STEP_INPUT"')) {
        console.error(`[Advanced][${variant}:${variety}][${type}] Missing MULTI_STEP_INPUT in prompt!`);
        errors++;
      }
    } catch (err) {
      console.error(`[Advanced][${variant}:${variety}][${type}] Error thrown:`, err);
      errors++;
    }
  }
}

// 5. Test legacy aliases and variety invocations
const legacyInvocations = [
  'standard_order_asc_diff_ten_thousands',
  'standard_order_desc_diff_ten_thousands',
  'standard_order_asc_same_ten_thousands',
  'standard_order_desc_same_ten_thousands',
  'standard_order_mixed_digits',
  'standard_order_numbers:asc_diff_ten_thousands',
  'asc_diff_ten_thousands',
  'variety_3',
  'advanced_form_greatest_5_digit',
  'advanced_form_smallest_5_digit',
  'advanced_form_greatest_even',
  'advanced_form_smallest_odd',
  'advanced_form_greatest_less_than_x',
  'advanced_form_smallest_greater_than_x',
  'advanced_form_numbers:greatest_even',
  'advanced_equalizing_transfer:find_transfer_from_initial',
  'advanced_three_entity_grand_total:find_smallest_base'
];

for (const alias of legacyInvocations) {
  for (const type of types) {
    try {
      const isAdv = alias.startsWith('advanced');
      const res = p4NumberComparisonAndOrderingBlueprint.generate(isAdv ? 'advanced' : 'standard', alias, type);
      const expected = isAdv
        ? (alias.includes('equalizing') ? 'advanced_equalizing_transfer' : (alias.includes('three_entity') ? 'advanced_three_entity_grand_total' : 'advanced_form_numbers'))
        : 'standard_order_numbers';
      if (!res.aiPrompt.includes(expected)) {
        console.error(`[Alias][${alias}] Failed to route to ${expected}!`);
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
  console.log('SUCCESS: All P4 Number Comparison Foundation, Standard & Advanced tests passed!');
} else {
  process.exit(1);
}

