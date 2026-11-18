import { foundationLogic } from './multiple-determination/foundation.js';
import { standardLogic } from './multiple-determination/standard.js';
import { advancedLogic } from './multiple-determination/advanced.js';

export const p4MultipleDeterminationBlueprint = {
  id: 'p4-multiple-determination',
  title: 'Multiple Determination',
  strand: 'Number and Algebra',
  visualType: 'NUMBER_LINE_ADVANCED',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 2,
      logicDescription: 'executing up to 4-digit by 1-digit division to verify remainder 0 and basic grouping'
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 3,
      logicDescription: 'using remainder logic to adjust numbers up or down, bound multiples, and solve repeating cycles'
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 4,
      logicDescription: 'synthesizing multiples with remainders, proportional transfers, and calculated area/sum checks'
    }
  },

  variants: {
    // Foundation (Direct Divisibility & Grouping Verification)
    foundation_direct_proof: 'The Direct Proof (True/False & Remainder Check): Test if a 2-to-4-digit number is a multiple of a 1-digit number.',
    foundation_grouping_context: 'The Grouping Context (Leftovers Check): Pack Y items into boxes of X and verify leftovers.',
    foundation_extrapolating_skip_count: 'Extrapolating the Skip-Count: Start at 0 and skip-count by X to test landing on Y.',
    foundation_outlier_selection: 'The Outlier Selection: Identify which 3-digit number is (or is not) a multiple of X.',
    foundation_nearest_extrapolated_multiple: 'The Nearest Extrapolated Multiple: Find the N-th multiple (e.g. 400th) of X.',

    // Standard (Adjustments, Boundaries, and Cyclical Patterns)
    standard_adjusting_up_shortfall: 'Adjusting to Nearest Multiple (Add Shortfall / Subtract Remainder): Find the smallest number to add to or subtract from Y to make a multiple of X.',
    standard_bounded_multiple_finder: 'The Bounded Multiple Finder: Find a multiple of X strictly between A and B.',
    standard_repeating_cycle_heuristic: 'The Repeating Cycle Heuristic (N-th Term): Find the N-th item in a repeating cycle using remainders.',
    standard_condition_based_digit_cards: 'Condition-Based Digit Cards: Form the largest/smallest 3-to-4-digit multiple of 2, 5, or 10.',
    standard_dual_grouping_test: 'The Dual Grouping Test (Which is the Multiple?): Test two 1-digit group sizes to find which divides Y evenly with no leftovers.',

    // Advanced (Dual Conditions, Hidden Multiples, and Proportional Logic)
    advanced_shared_remainder_dual_constraint: 'Shared Remainder with a Dual Constraint: Number between A and B leaving remainder R when divided by X and multiple of Y.',
    advanced_multiplicative_difference_transfer: 'The Multiplicative Difference (Before & After Check): Transfer items and test if A is a multiple of B.',
    advanced_target_leftover_deduction: 'The Target Leftover Deduction: Reconstruct initial total from full groups and remainder.',
    advanced_divisibility_calculated_area: 'Divisibility of a Calculated Area/Quantity: Check if Xm square mats tile a rectangular room without cutting.',
    advanced_unknown_multiplier_shift: 'The Unknown Multiplier Shift: Given sum of two multiples of X and one value, find which multiple the other is.'
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 4';
    const topic = 'Whole Numbers - Factors and Multiples';
    const subtopic = 'Multiple Determination';
    const safeType = String(type || 'short question').toLowerCase();
    const isMCQ = safeType === 'mcq';
    const isShort = safeType === 'short question' || safeType === 'short_question';
    const isStructure = !isMCQ && !isShort;

    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const diff = String(difficulty || 'foundation').toLowerCase();
    const zodDiff = diff.charAt(0).toUpperCase() + diff.slice(1);

    const getFormatInstructions = (
      visualEngineStr = '{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }',
      inputRequirementStr = null,
      acceptedAnswers = null
    ) => `CRITICAL INSTRUCTION: You MUST use the EXACT "visualEngine" and "inputRequirement" JSON objects provided in the template below.
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
    "acceptedAnswers": ${acceptedAnswers && Array.isArray(acceptedAnswers) && acceptedAnswers.length > 0 ? JSON.stringify(acceptedAnswers) : '[]'},
    "solutionSteps": "string (step-by-step logic, separate steps using \\\\n)",
    "hint": "string (a helpful conceptual clue)"
  }
}`;

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
