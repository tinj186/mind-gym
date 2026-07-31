import { foundationLogic } from './number-comparison-and-ordering/foundation';
import { standardLogic } from './number-comparison-and-ordering/standard';
import { advancedLogic } from './number-comparison-and-ordering/advanced';

export const p3NumberComparisonAndOrderingBlueprint = {
  id: 'p3-number-comparison-ordering',
  title: 'Number Comparison and Ordering',
  strand: 'Number and Algebra',
  visualType: 'NUMBER_CARDS',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 10000,
      logicDescription: "Compare two numbers and state which is greater or smaller."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      maxNumber: 10000,
      logicDescription: "Compare and arrange up to four numbers in order."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 3,
      maxNumber: 10000,
      logicDescription: "Determine the greatest or smallest number that can be formed using 4 given digits."
    }
  },

  variants: {
    foundation_compare_greater_thousands: "Compare two 4-digit numbers (different thousands). Find greater.",
    foundation_compare_smaller_thousands: "Compare two 4-digit numbers (different thousands). Find smaller.",
    foundation_compare_greater_hundreds: "Compare two 4-digit numbers (same thousands). Find greater.",
    foundation_compare_smaller_hundreds: "Compare two 4-digit numbers (same thousands). Find smaller.",
    foundation_compare_tens: "Compare two 4-digit numbers (same thousands and hundreds). Find greater or smaller.",

    standard_order_asc_diff_thousands: "Arrange 4 numbers (different thousands) in order, starting with the smallest.",
    standard_order_desc_diff_thousands: "Arrange 4 numbers (different thousands) in order, starting with the greatest.",
    standard_order_asc_same_thousands: "Arrange 4 numbers (same thousands) in order, starting with the smallest.",
    standard_order_desc_same_thousands: "Arrange 4 numbers (same thousands) in order, starting with the greatest.",
    standard_order_mixed_digits: "Arrange 4 numbers (mix of 3-digit and 4-digit) in order.",

    advanced_form_greatest_4_digit: "Form the greatest 4-digit number using the given cards.",
    advanced_form_smallest_4_digit: "Form the smallest 4-digit number using the given cards.",
    advanced_form_greatest_even: "Form the greatest 4-digit even number using the given cards.",
    advanced_form_smallest_odd: "Form the smallest 4-digit odd number using the given cards.",
    advanced_form_greatest_odd: "Form the greatest 4-digit odd number using the given cards.",
    advanced_form_smallest_even: "Form the smallest 4-digit even number using the given cards.",
    advanced_form_greatest_less_than_x: "Form the greatest 4-digit number less than a specific value.",
    advanced_form_smallest_greater_than_x: "Form the smallest 4-digit number greater than a specific value.",
    advanced_form_greatest_even_less_than_x: "Form the greatest 4-digit even number less than a specific value.",
    advanced_form_smallest_odd_greater_than_x: "Form the smallest 4-digit odd number greater than a specific value."
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 3';
    const topic = 'Whole Numbers - Numbers up to 10 000';
    const subtopic = 'Number Comparison and Ordering';
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';

    if (isStructure) {
      throw new Error('Structured questions are not supported for Number Comparison and Ordering. Please use MCQ or Short Question.');
    }

    const zodType = type;
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const context = { name: "Student", setting: "class" };
    const selectedContextItem = "cards";
    const getFormatInstructions = (visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`) => `OUTPUT FORMAT (Return ONLY valid JSON matching this schema. Do NOT include markdown blocks or extra trailing braces):
{
  "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
  "content": {
    "questionText": "string - the actual question stem",
    "options": ${isMCQ ? '["option 1", "option 2", "option 3", "option 4"]' : 'null'},
    "defectMap": ${isMCQ ? '{"wrong_option_1": "CARELESS_CALCULATION", "wrong_option_2": "CONCEPTUAL_ERROR"}' : 'null'},
    "hint": "string - a conceptual hint",
    "finalAnswer": "string - strictly follow the finalAnswer instruction from STRICT CONSTRAINTS",
    "solutionSteps": "string - step-by-step mathematical explanation. Separate steps using the exact characters \\n inside the string"
  },
  "visualEngine": ${visualEngineStr},
  "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
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
