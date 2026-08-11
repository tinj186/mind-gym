import { foundationLogic } from './number-comparison-and-ordering/foundation';
import { standardLogic } from './number-comparison-and-ordering/standard';
import { advancedLogic } from './number-comparison-and-ordering/advanced';

export const numberComparisonAndOrderingBlueprint = {
  id: 'p2-number-comparison-ordering',
  title: 'Number Comparison and Ordering',
  strand: 'Number and Algebra',
  visualType: 'NUMBER_CARDS',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 1000,
      logicDescription: "Compare two numbers and state which is greater or smaller."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      maxNumber: 1000,
      logicDescription: "Compare and arrange up to four numbers in order."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 3,
      maxNumber: 1000,
      logicDescription: "Determine the greatest or smallest number that can be formed using 3 given digits."
    }
  },

  variants: {
    foundation_compare_greater_hundreds: "Compare two 3-digit numbers (different hundreds). Find greater.",
    foundation_compare_smaller_hundreds: "Compare two 3-digit numbers (different hundreds). Find smaller.",
    foundation_compare_greater_tens: "Compare two 3-digit numbers (same hundreds). Find greater.",
    foundation_compare_smaller_tens: "Compare two 3-digit numbers (same hundreds). Find smaller.",
    foundation_compare_ones: "Compare two 3-digit numbers (same hundreds and tens). Find greater or smaller.",

    standard_order_asc_diff_hundreds: "Arrange 4 numbers (different hundreds) in order, starting with the smallest.",
    standard_order_desc_diff_hundreds: "Arrange 4 numbers (different hundreds) in order, starting with the greatest.",
    standard_order_asc_same_hundreds: "Arrange 4 numbers (same hundreds) in order, starting with the smallest.",
    standard_order_desc_same_hundreds: "Arrange 4 numbers (same hundreds) in order, starting with the greatest.",
    standard_order_mixed_digits: "Arrange 4 numbers (mix of 2-digit and 3-digit) in order.",

    advanced_form_greatest_3_digit: "Form the greatest 3-digit number using the given cards.",
    advanced_form_smallest_3_digit: "Form the smallest 3-digit number using the given cards.",
    advanced_form_greatest_even: "Form the greatest 3-digit even number using the given cards.",
    advanced_form_smallest_odd: "Form the smallest 3-digit odd number using the given cards.",
    advanced_form_greatest_odd: "Form the greatest 3-digit odd number using the given cards.",
    advanced_form_smallest_even: "Form the smallest 3-digit even number using the given cards.",
    advanced_form_greatest_less_than_x: "Form the greatest 3-digit number less than a specific value.",
    advanced_form_smallest_greater_than_x: "Form the smallest 3-digit number greater than a specific value.",
    advanced_form_greatest_even_less_than_x: "Form the greatest 3-digit even number less than a specific value.",
    advanced_form_smallest_odd_greater_than_x: "Form the smallest 3-digit odd number greater than a specific value."
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 2';
    const topic = 'Whole Numbers - Numbers up to 1000';
    const subtopic = 'Number Comparison and Ordering';
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';

    const zodType = type === 'Short Question' ? 'SHORT_QUESTION' : type.toUpperCase();
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const context = { name: "Student", setting: "class" };
    const selectedContextItem = "cards";
    const getFormatInstructions = (visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`) => `OUTPUT FORMAT (Return ONLY valid JSON matching this schema):
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
  "visualEngine": ${visualEngineStr}
}`;

    // Dummy helper to switch text based on type
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
