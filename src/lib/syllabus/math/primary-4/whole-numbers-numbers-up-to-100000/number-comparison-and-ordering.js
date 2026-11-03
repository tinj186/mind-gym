import { foundationLogic } from './number-comparison-and-ordering/foundation.js';
import { standardLogic } from './number-comparison-and-ordering/standard.js';
import { advancedLogic } from './number-comparison-and-ordering/advanced.js';

export const p4NumberComparisonAndOrderingBlueprint = {
  id: 'p4-number-comparison-and-ordering',
  title: 'Number Comparison and Ordering',
  strand: 'Number and Algebra',
  visualType: 'DYNAMIC',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      logicDescription: 'comparing and ordering numbers'
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      logicDescription: 'comparing and ordering numbers'
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 2,
      logicDescription: 'comparing and ordering numbers'
    }
  },

  variants: {
    foundation_compare_two_numbers: 'Compare two numbers up to 5 digits to determine which is greater or smaller (comparing ten thousands, thousands, hundreds, or tens).',
    foundation_difference_deduction: 'Deduce the difference or missing 5-digit quantity using comparative bar models.',
    foundation_number_line_reading: 'Determine the missing 5-digit number on a number line with fixed intervals.',
    foundation_place_value_step_shifts: 'Determine a number that is thousands, hundreds, or tens more or less than a 5-digit base.',
    foundation_extreme_sorting_digit_cards: 'Form the greatest or smallest 5-digit number using 5 given digit cards.',
    foundation_three_entity_extrema: 'Compare three 5-digit quantities to find extrema and calculate differences.',

    standard_order_numbers: 'Arrange 4 numbers up to 5 digits in ascending or descending order (varieties: different ten thousands, same ten thousands, or mixed 4-digit and 5-digit numbers).',
    standard_total_difference_base: 'Find the unknown base quantity using the combined total and difference of two entities.',
    standard_missing_interval_deduction: 'Deduce the missing value on a number line by calculating the unknown interval step size.',
    standard_target_shortfall_comparison: 'Calculate the shortfall needed to reach a target amount or find an unknown quantity from the shortfall.',
    standard_condition_digit_difference: 'Form two 5-digit numbers under specific conditions (even/odd) using 5 digit cards and calculate their difference.',
    standard_chain_comparison_three_entities: 'Determine an unknown quantity or total across three entities using comparative relations.',

    //    advanced_form_numbers: 'Form 5-digit numbers using 5 given digit cards under specific conditions (greatest/smallest, even/odd, or boundary constraints).',
    //    advanced_equalizing_transfer: 'Calculate the transfer amount needed to equalize two quantities, or find original amounts from equalized states.',
    //    advanced_three_entity_grand_total: 'Determine unknown base quantities among three entities using comparative relations and a grand total.',
    //    advanced_shifting_difference_transfer: 'Calculate the new difference and determine who has more after an inequality-flipping transfer.',
    advanced_overlapping_target_deduction: 'Deduce the overlapping intersection when the sum of two categories exceeds the overall total.',
    //    advanced_two_tiered_difference: 'Compare two entities directly using their differences relative to a common baseline without knowing the baseline value.'
  },

  variantVarieties: {
    standard_order_numbers: [
      'asc_diff_ten_thousands',
      'desc_diff_ten_thousands',
      'asc_same_ten_thousands',
      'desc_same_ten_thousands',
      'mixed_digits'
    ],
    advanced_form_numbers: [
      'greatest_5_digit',
      'smallest_5_digit',
      'greatest_even',
      'smallest_odd',
      'greatest_less_than_x',
      'smallest_greater_than_x'
    ],
    advanced_equalizing_transfer: [
      'find_transfer_from_initial',
      'find_initial_from_equalized',
      'find_initial_from_total_and_transfer',
      'find_difference_from_transfer',
      'find_other_initial_from_one_initial'
    ],
    advanced_three_entity_grand_total: [
      'find_smallest_base',
      'find_middle_entity',
      'find_largest_entity',
      'find_combined_entities',
      'find_difference_entities',
      'multiples_divide_four',
      'multiples_divide_five',
      'equal_units_divide_two'
    ],
    advanced_shifting_difference_transfer: [
      'flip_transfer_difference'
    ],
    advanced_overlapping_target_deduction: [
      'find_both_overlap',
      'find_group_a_only',
      'find_group_b_only'
    ],
    advanced_two_tiered_difference: [
      'compare_a_and_c_both_more',
      'compare_a_and_c_more_and_less',
      'combined_excess_over_twice_base'
    ]
  },

  generate: function (difficulty, activeVariant, type, options = { }) {
    const level = 'Primary 4';
    const topic = 'Whole Numbers - Numbers up to 100 000';
    const subtopic = 'Number Comparison and Ordering';
    const safeType = String(type || 'short question').toLowerCase();
    const isMCQ = safeType === 'mcq';
    const isShort = safeType === 'short question';
    const isStructure = !isMCQ && !isShort;

    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    let resolvedVariant = activeVariant;
    let explicitVariety = null;

    if (typeof activeVariant === 'object' && activeVariant !== null) {
      explicitVariety = activeVariant.variety || activeVariant.subType;
      resolvedVariant = activeVariant.variant || activeVariant.activeVariant;
    } else if (options && options.variety) {
      explicitVariety = options.variety;
    }

    if (typeof resolvedVariant === 'string' && resolvedVariant.includes(':')) {
      const parts = resolvedVariant.split(':');
      resolvedVariant = parts[0];
      explicitVariety = parts[1];
    }

    const getFormatInstructions = (visualEngineStr = '{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }', inputRequirementStr = null, variantOverride = null) => `CRITICAL INSTRUCTION: You MUST use the EXACT "visualEngine" and "inputRequirement" JSON objects provided in the template below.
OUTPUT FORMAT (Return ONLY valid JSON matching this schema, with NO markdown formatting and NO trailing characters):
{
  "meta": {
    "level": "${level}",
    "topic": "${topic}",
    "subtopic": "${subtopic}",
    "difficulty": "${zodDiff}",
    "type": "${zodType}",
    "variant": "${variantOverride || resolvedVariant || 'default'}"
  },
  "visualEngine": ${visualEngineStr},
  "inputRequirement": ${inputRequirementStr || `{ "inputType": "${isMCQ ? 'MCQ_BUTTONS' : isShort ? 'STANDARD_TEXT' : 'MULTI_STEP_INPUT'}" }`},
  "content": {
    "questionText": "string (the exact question stem)",
    "options": ${isMCQ ? '["Option A", "Option B", "Option C", "Option D"]' : 'null'},
    "defectMap": ${isMCQ ? '{"wrong_option_1": "CARELESS_CALCULATION"}' : '{}'},
    "finalAnswer": "string (the final correct answer)",
    "solutionSteps": "string (step-by-step logic, separate steps using \\\\n)",
    "hint": "string (a helpful conceptual clue)"
  }
}`;

    const diff = String(difficulty || 'foundation').toLowerCase();
    if (diff === 'foundation') {
      return foundationLogic(resolvedVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions);
    } else if (diff === 'standard') {
      return standardLogic(resolvedVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, explicitVariety);
    } else if (diff === 'advanced') {
      return advancedLogic(resolvedVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, explicitVariety);
    }

    throw new Error(`Unsupported difficulty '${difficulty}' for ${subtopic}`);
  }
};
