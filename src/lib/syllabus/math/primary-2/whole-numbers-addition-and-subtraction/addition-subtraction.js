import { foundationLogic } from './addition-subtraction/foundation';
import { standardLogic } from './addition-subtraction/standard';
import { advancedLogic } from './addition-subtraction/advanced';
import { getRandomNames, getRandomLengthItems } from '@/lib/utils/variable-bank';

export const additionSubtractionBlueprint = {
  id: 'p2-addition-subtraction',
  title: 'Addition and Subtraction',
  strand: 'Number and Algebra',
  visualType: 'DYNAMIC',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 1000,
      logicDescription: "Add or subtract numbers up to 3 digits without renaming, or 2-digit numbers with renaming."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 1,
      maxNumber: 1000,
      logicDescription: "Add or subtract 3-digit numbers with renaming."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 2,
      maxNumber: 1000,
      logicDescription: "Multi-step word problems or missing digits in addition/subtraction."
    }
  },

  variants: {
    foundation_add_3_digit_no_renaming: "Add two 3-digit numbers without renaming.",
    foundation_sub_3_digit_no_renaming: "Subtract two 3-digit numbers without renaming.",
    foundation_add_2_digit_renaming: "Add two 2-digit numbers with renaming.",
    foundation_sub_2_digit_renaming: "Subtract two 2-digit numbers with renaming.",
    foundation_algo_add_3_digit_2_digit_no_renaming: "Vertical addition of a 3-digit and 2-digit number without renaming.",
    foundation_algo_add_3_digit_1_digit_no_renaming: "Vertical addition of a 3-digit and 1-digit number without renaming.",
    foundation_algo_sub_2_digit_from_3_digit_no_renaming: "Vertical subtraction of a 2-digit from a 3-digit number without renaming.",
    foundation_algo_sub_1_digit_from_3_digit_no_renaming: "Vertical subtraction of a 1-digit from a 3-digit number without renaming.",
    foundation_algo_add_3_digit_multiples_of_10: "Vertical addition of a 3-digit number and multiples of 10.",
    foundation_random: "Randomly select a foundation addition/subtraction variant.",

    // Standard Level Variants (Add/Sub 3-digit numbers with renaming)
    standard_add_3_digit_1_renaming: "Add two 3-digit numbers with exactly 1 renaming (ones or tens).",
    standard_add_3_digit_2_renaming: "Add two 3-digit numbers with exactly 2 renamings (ones and tens).",
    standard_sub_3_digit_1_renaming: "Subtract two 3-digit numbers with exactly 1 renaming (tens or hundreds).",
    standard_sub_3_digit_2_renaming: "Subtract two 3-digit numbers with exactly 2 renamings.",
    standard_sub_3_digit_across_zeros: "Subtract a 3-digit number from a multiple of 100 (renaming across zeros).",
    standard_algo_add_3_digit_2_digit_renaming: "Vertical addition of a 3-digit and 2-digit number with renaming.",
    standard_algo_add_3_digit_1_digit_renaming: "Vertical addition of a 3-digit and 1-digit number with renaming.",
    standard_algo_sub_2_digit_from_3_digit_renaming: "Vertical subtraction of a 2-digit from a 3-digit number with renaming.",
    standard_algo_sub_1_digit_from_3_digit_renaming: "Vertical subtraction of a 1-digit from a 3-digit number with renaming.",
    standard_algo_add_3_digit_3_digit_renaming: "Vertical addition of two 3-digit numbers with renaming.",
    //    standard_random: "Randomly select a standard addition/subtraction variant.",

    // Advanced Level Variants
    //    advanced_multi_step_add_sub: "2-step word problems involving addition and subtraction.",
    //    advanced_missing_digit_add: "Missing digit in a 3-digit addition equation.",
    //    advanced_missing_digit_sub: "Missing digit in a 3-digit subtraction equation.",
    //    advanced_working_backwards: "Working backwards (start unknown).",
    //    advanced_balance_equations: "Balance equations (e.g., A + B = C + ?).",
    advanced_algo_missing_digit_add: "Vertical addition of 3-digit numbers with missing digits.",
    advanced_algo_missing_digit_sub: "Vertical subtraction of 3-digit numbers with missing digits.",
    advanced_algo_add_three_3_digit_numbers: "Vertical addition of three 3-digit numbers.",
    advanced_algo_missing_two_digits_add: "Vertical addition of 3-digit numbers with 2 missing digits.",
    advanced_algo_missing_two_digits_sub: "Vertical subtraction of 3-digit numbers with 2 missing digits.",
    //    advanced_random: "Randomly select an advanced addition/subtraction variant."
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 2';
    const topic = 'Whole Numbers - Addition and Subtraction';
    const subtopic = 'Addition/Subtraction Algorithms (3-Digit)';
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';

    const zodType = type;
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    // Dynamically inject names and items from the centralized variable bank
    // to prevent the LLM from hallucinating or reusing names.
    const contextName = getRandomNames(1);
    const contextItem = getRandomLengthItems(1); // Fallback item if no context is provided

    const context = { name: contextName, setting: "the library" };
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
