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
    //    foundation_compare_two_numbers: 'Compare two numbers up to 5 digits to determine which is greater or smaller (comparing ten thousands, thousands, hundreds, or tens).',
    //    foundation_difference_deduction: 'Deduce the difference or missing 5-digit quantity using comparative bar models.',
    foundation_number_line_reading: 'Determine the missing 5-digit number on a number line with fixed intervals.',
    //    foundation_place_value_step_shifts: 'Determine a number that is thousands, hundreds, or tens more or less than a 5-digit base.',
    //    foundation_extreme_sorting_digit_cards: 'Form the greatest or smallest 5-digit number using 5 given digit cards.',
    //    foundation_three_entity_extrema: 'Compare three 5-digit quantities to find extrema and calculate differences.',

    standard_order_asc_diff_ten_thousands: 'Arrange 4 numbers (different ten thousands) in ascending order.',
    standard_order_desc_diff_ten_thousands: 'Arrange 4 numbers (different ten thousands) in descending order.',
    standard_order_asc_same_ten_thousands: 'Arrange 4 numbers (same ten thousands) in ascending order.',
    standard_order_desc_same_ten_thousands: 'Arrange 4 numbers (same ten thousands) in descending order.',
    standard_order_mixed_digits: 'Arrange 4 numbers containing a mixture of 4-digit and 5-digit numbers.',

    advanced_form_greatest_5_digit: 'Form the greatest 5-digit number using 5 given cards.',
    advanced_form_smallest_5_digit: 'Form the smallest 5-digit number using 5 given cards.',
    advanced_form_greatest_even: 'Form the greatest 5-digit even number using 5 given cards.',
    advanced_form_smallest_odd: 'Form the smallest 5-digit odd number using 5 given cards.',
    advanced_form_greatest_less_than_x: 'Form the greatest 5-digit number less than a specific boundary.',
    advanced_form_smallest_greater_than_x: 'Form the smallest 5-digit number greater than a specific boundary.'
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 4';
    const topic = 'Whole Numbers - Numbers up to 100 000';
    const subtopic = 'Number Comparison and Ordering';
    const safeType = String(type || 'short question').toLowerCase();
    const isMCQ = safeType === 'mcq';
    const isShort = safeType === 'short question';
    const isStructure = !isMCQ && !isShort;

    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const getFormatInstructions = (visualEngineStr = '{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }', inputRequirementStr = null) => `CRITICAL INSTRUCTION: You MUST use the EXACT "visualEngine" and "inputRequirement" JSON objects provided in the template below.
OUTPUT FORMAT (Return ONLY valid JSON matching this schema, with NO markdown formatting and NO trailing characters):
{
  "meta": {
    "level": "${level}",
    "topic": "${topic}",
    "subtopic": "${subtopic}",
    "difficulty": "${zodDiff}",
    "type": "${zodType}",
    "variant": "${activeVariant || 'default'}"
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
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions);
    } else if (diff === 'standard') {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions);
    } else if (diff === 'advanced') {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions);
    }

    throw new Error(`Unsupported difficulty '${difficulty}' for ${subtopic}`);
  }
};
