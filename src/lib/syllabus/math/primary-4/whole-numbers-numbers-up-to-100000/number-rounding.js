import { foundationLogic } from './number-rounding/foundation.js';
import { standardLogic } from './number-rounding/standard.js';
import { advancedLogic } from './number-rounding/advanced.js';

export const p4NumberRoundingBlueprint = {
  id: 'p4-number-rounding',
  title: 'Number Rounding',
  strand: 'Number and Algebra',
  visualType: 'NONE',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      logicDescription: 'rounding numbers to the nearest 10, 100 or 1000'
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      logicDescription: 'rounding numbers to the nearest 10, 100 or 1000'
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 2,
      logicDescription: 'rounding numbers to the nearest 10, 100 or 1000'
    }
  },

  variants: {
    foundation_round_nearest_10: 'Round 4-digit or 5-digit number to the nearest ten.',
    //    foundation_round_nearest_100: 'Round 4-digit or 5-digit number to the nearest hundred.',
    //    foundation_round_nearest_1000: 'Round 4-digit or 5-digit number to the nearest thousand.',
    //    foundation_midpoint_rule: 'Apply the halfway rule (5, 50, 500) rounding up.',
    //    foundation_identify_rounding_digit: 'Identify the decision digit used to round up or down.',

    standard_cascade_nine: 'Rounding causing cascading carry-overs across 9s.',
    standard_which_numbers_round_to: 'Identify which number falls within a target rounding range.',
    standard_find_smallest_largest_bound: 'Find the smallest or greatest whole number that rounds to a given value.',
    standard_estimation_sum_difference: 'Estimate sum or difference by rounding each number first.',
    standard_round_same_number_multiple_ways: 'Round the same number to multiple place values and compare.',

    advanced_dual_rounding_mystery: 'Find mystery number satisfying two simultaneous rounding conditions.',
    advanced_difference_between_bounds: 'Find difference between maximum and minimum bounds of rounded numbers.',
    advanced_digits_card_rounding: 'Form greatest or smallest number from digit cards satisfying rounding target.',
    advanced_bounds_difference_optimization: 'Optimization of maximum difference using upper and lower bounds.',
    advanced_interval_count: 'Count the total number of whole numbers in a rounding interval.'
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 4';
    const topic = 'Whole Numbers - Numbers up to 100 000';
    const subtopic = 'Number Rounding';
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
