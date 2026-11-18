import { foundationLogic } from './common-multiples/foundation.js';
import { standardLogic } from './common-multiples/standard.js';
import { advancedLogic } from './common-multiples/advanced.js';

export const p4CommonMultiplesBlueprint = {
  id: 'p4-common-multiples',
  title: 'Common Multiples',
  strand: 'Number and Algebra',
  visualType: 'VENN_DIAGRAM_VISUALIZER',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 2,
      logicDescription: 'listing multiples of 1-digit numbers, finding intersections, and identifying the lowest common multiple (LCM)'
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 3,
      logicDescription: 'applying common multiples to equalized totals, bounded ranges, remainders, shortfalls, and square tiling'
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 4,
      logicDescription: 'solving group scaling, time synchronization, reverse LCM, constant deficits, and multi-constraint puzzles'
    }
  },

  variants: {
    // Foundation (Listing, Intersection & LCM Identification)
    foundation_direct_venn_lcm: 'The Direct Venn Intersection (Finding the LCM): List multiples of two 1-digit numbers and find the lowest common multiple (LCM).',
    foundation_true_false_common_multiple: 'The True/False Validation Check: Prove whether Z is a common multiple of X and Y.',
    foundation_nth_common_multiple: 'The N-th Common Multiple Extrapolation: Find the 2nd, 3rd, or 4th common multiple from the LCM.',
    foundation_number_line_frog_jumps: 'The Number Line Synchronization (Frog Jumps): Find the first tick mark where two skip-counting frogs land together.',
    foundation_bounded_common_multiple_limit: 'The Bounded Common Multiple (Under a Limit): Find the largest common multiple of X and Y smaller than a limit.',

    // Standard (Group Equating, Bounded Ranges & Shortfalls)
    standard_equating_two_groups: 'Equating Two Group Sizes (Equal Totals): Find the smallest equal total or number of packs in Box A.',
    standard_strict_bounded_range: 'Common Multiple in a Strict Bounded Range: Find a common multiple of X and Y strictly between two bounds.',
    standard_common_multiple_constant_remainder: 'The Common Multiple + Constant Remainder: Find the smallest total leaving the same remainder R when divided by X and Y.',
    standard_target_shortfall_common_multiple: 'The Target Shortfall to a Common Multiple: Find how many more items are needed to reach the next common multiple.',
    standard_smallest_square_tiling: 'The Smallest Square (Tiling / Geometry): Place X cm by Y cm cards side-by-side to form the smallest square.',

    // Advanced (Heuristics, Offsets, and Algebraic-Style Synthesis)
    advanced_group_scaling_equal_totals: 'Group Scaling from Equal Totals: Use LCM unit sets and total box count to find total items.',
    advanced_time_synchronization_bus: 'Time Synchronization (The Bus Schedule): Find the next time two buses leave together.',
    advanced_missing_divisor_reverse_lcm: 'The Missing Divisor (Reverse LCM): Find all 1-digit numbers Y that pair with X to give a target LCM.',
    advanced_dual_condition_constant_deficit: 'The Dual-Condition Remainder (Constant Deficit): Find the smallest total that is short of 1 (or D) for both X and Y.',
    advanced_mystery_number_multi_constraint: 'The Mystery Number (Max/Min Multi-Constraint): Common multiple of X and Y with a remainder and size constraint.'
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 4';
    const topic = 'Whole Numbers - Factors and Multiples';
    const subtopic = 'Common Multiples';
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
