import { foundationLogic } from './addition-subtraction-algorithms-4-digit/foundation';
import { standardLogic } from './addition-subtraction-algorithms-4-digit/standard';
import { advancedLogic } from './addition-subtraction-algorithms-4-digit/advanced';
import { getRandomNames, getRandomCountableItems } from '@/lib/utils/variable-bank';

export const p3AdditionSubtractionAlgorithms4DigitBlueprint = {
  id: 'p3-addition-subtraction-algorithms-4-digit',
  title: 'Addition/Subtraction Algorithms (4-Digit)',
  strand: 'Number and Algebra',
  visualType: 'DYNAMIC',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 10000,
      logicDescription: "Add or subtract numbers up to 4 digits without renaming, or 3-digit numbers with renaming."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 1,
      maxNumber: 10000,
      logicDescription: "Add or subtract 4-digit numbers with renaming."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 2,
      maxNumber: 10000,
      logicDescription: "Missing digits in 4-digit addition/subtraction algorithms."
    }
  },

  variants: {
    foundation_add_4_digit_no_renaming: "Add two 4-digit numbers without renaming.",
    foundation_sub_4_digit_no_renaming: "Subtract two 4-digit numbers without renaming.",
    foundation_add_3_digit_renaming: "Add two 3-digit numbers with renaming.",
    foundation_sub_3_digit_renaming: "Subtract two 3-digit numbers with renaming.",
    foundation_algo_add_4_digit_3_digit_no_renaming: "Vertical addition of a 4-digit and 3-digit number without renaming.",
    foundation_algo_add_4_digit_2_digit_no_renaming: "Vertical addition of a 4-digit and 2-digit number without renaming.",
    foundation_algo_sub_3_digit_from_4_digit_no_renaming: "Vertical subtraction of a 3-digit from a 4-digit number without renaming.",
    foundation_algo_sub_2_digit_from_4_digit_no_renaming: "Vertical subtraction of a 2-digit from a 4-digit number without renaming.",
    foundation_algo_add_4_digit_multiples_of_100: "Vertical addition of a 4-digit number and multiples of 100.",
    foundation_random: "Randomly select a foundation addition/subtraction variant.",

    // Standard Level Variants (Add/Sub 4-digit numbers with renaming)
    standard_add_4_digit_1_renaming: "Add two 4-digit numbers with exactly 1 renaming.",
    standard_add_4_digit_2_renaming: "Add two 4-digit numbers with exactly 2 renamings.",
    standard_sub_4_digit_1_renaming: "Subtract two 4-digit numbers with exactly 1 renaming.",
    standard_sub_4_digit_2_renaming: "Subtract two 4-digit numbers with exactly 2 renamings.",
    standard_sub_4_digit_across_zeros: "Subtract a 4-digit number from a multiple of 1000 (renaming across zeros).",
    standard_algo_add_4_digit_3_digit_renaming: "Vertical addition of a 4-digit and 3-digit number with renaming.",
    standard_algo_add_4_digit_2_digit_renaming: "Vertical addition of a 4-digit and 2-digit number with renaming.",
    standard_algo_sub_3_digit_from_4_digit_renaming: "Vertical subtraction of a 3-digit from a 4-digit number with renaming.",
    standard_algo_sub_2_digit_from_4_digit_renaming: "Vertical subtraction of a 2-digit from a 4-digit number with renaming.",
    standard_algo_add_4_digit_4_digit_renaming: "Vertical addition of two 4-digit numbers with renaming.",

    // Advanced Level Variants
    advanced_algo_missing_digit_add: "Vertical addition of 4-digit numbers with missing digits.",
    advanced_algo_missing_digit_sub: "Vertical subtraction of 4-digit numbers with missing digits.",
    advanced_word_add_three_4_digit_numbers: "Word problem involving the addition of three 4-digit numbers.",
    advanced_word_add_sub_4_digit_numbers: "Word problem involving addition of two 4-digit numbers and subtraction from a third.",
    advanced_algo_missing_two_digits_add: "Vertical addition of 4-digit numbers with 2 missing digits.",
    advanced_algo_missing_two_digits_sub: "Vertical subtraction of 4-digit numbers with 2 missing digits.",
    advanced_word_part_whole: "Part-Whole bar model word problems for addition or finding missing parts.",
    advanced_word_comparison: "Comparison bar model word problems using more than/less than terminology."
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 3';
    const topic = 'Whole Numbers - Addition and Subtraction';
    const subtopic = 'Addition/Subtraction Algorithms (4-Digit)';
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';

    const zodType = type === 'Short Question' ? 'SHORT_QUESTION' : type.toUpperCase();
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const contextName = getRandomNames(1);
    const contextItem = getRandomCountableItems(1).item;

    const context = { name: contextName, setting: "the store" };
    const selectedContextItem = contextItem;

    const getFormatInstructions = (visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`, inputRequirementStr = null) => `OUTPUT FORMAT (Return ONLY valid JSON matching this schema):
{
  "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
  "content": {
    "questionText": "string - the actual question stem",
    "options": ${isMCQ ? '["option 1", "option 2", "option 3", "option 4"]' : 'null'},
    "defectMap": ${isMCQ ? '{"wrong_option_1": "CARELESS_CALCULATION", "wrong_option_2": "CONCEPTUAL_ERROR"}' : 'null'},
    "hint": "string - a conceptual hint",
    "solutionSteps": "string - step-by-step mathematical explanation formatted strictly as a numbered list (1. ..., 2. ..., 3. ...) with explicit \\n characters between steps",
    "finalAnswer": "string - the exact final answer string"
  },
  "visualEngine": ${visualEngineStr}${inputRequirementStr ? `,\n  "inputRequirement": ${inputRequirementStr}` : ''}
}`;

    const getQText = (structureText, shortText) => {
      if (isStructure) return structureText;
      return shortText || structureText;
    };

    if (difficulty.toLowerCase() === 'foundation') {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText);
    } else if (difficulty.toLowerCase() === 'standard') {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText);
    } else if (difficulty.toLowerCase() === 'advanced') {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText);
    }

    throw new Error(`Unknown difficulty ${difficulty}`);
  }
};
