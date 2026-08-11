import { foundationLogic } from './number-notation/foundation';
import { standardLogic } from './number-notation/standard';
import { advancedLogic } from './number-notation/advanced';

export const p3NumberNotationBlueprint = {
  id: 'p3-number-notation',
  title: 'Number Notation',
  strand: 'Number and Algebra',
  visualType: 'NONE',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 10000,
      logicDescription: "Convert simple numbers to words."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 1,
      maxNumber: 10000,
      logicDescription: "Convert words to numbers."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 1,
      maxNumber: 10000,
      logicDescription: "Identify incorrect notation."
    }
  },

  variants: {
    foundation_to_words: "Write numeral in words.",
    foundation_to_words_hundreds: "Write 3-digit numeral in words.",
    foundation_to_words_thousands: "Write exact thousands numeral in words.",
    foundation_to_words_thousands_hundreds: "Write 4-digit numeral ending in zero in words.",
    foundation_to_words_thousands_tens: "Write 4-digit numeral with zero hundreds in words.",

    standard_to_numeral_hundreds: "Write 3-digit words in numerals.",
    standard_to_numeral_thousands: "Write exact thousands words in numerals.",
    standard_to_numeral_thousands_hundreds: "Write 4-digit words ending in zero in numerals.",
    standard_to_numeral_thousands_tens: "Write 4-digit words with zero hundreds in numerals.",
    standard_to_numeral_general: "Write general 4-digit words in numerals.",

    advanced_identify_error: "Find the error in number notation.",
    advanced_mixed_place_values_to_words: "Convert mixed place values to words.",
    advanced_mystery_number_to_words: "Solve a mystery number and write in words.",
    advanced_largest_even_to_words: "Write the largest 4-digit even number in words.",
    advanced_smallest_odd_to_words: "Write the smallest 4-digit odd number in words.",
    advanced_largest_odd_to_words: "Write the largest 4-digit odd number in words."
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 3';
    const topic = 'Whole Numbers - Numbers up to 10 000';
    const subtopic = 'Number Notation';
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';

    if (isStructure) {
      throw new Error('Structured questions are not supported for Number Notation. Please use MCQ or Short Question.');
    }

    const zodType = type === 'Short Question' ? 'SHORT_QUESTION' : type.toUpperCase();
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const context = { name: "Student", setting: "class" };
    const selectedContextItem = "numbers";
    const getFormatInstructions = (visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`) => `OUTPUT FORMAT (Return ONLY valid JSON matching this schema. Do NOT include markdown blocks or extra trailing braces):
{
  "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
  "content": {
    "questionText": "string - the actual question stem",
    "options": ${isMCQ ? '["option 1", "option 2", "option 3", "option 4"]' : 'null'},
    "defectMap": ${isMCQ ? '{"wrong_option_1": "CARELESS_CALCULATION", "wrong_option_2": "CONCEPTUAL_ERROR"}' : 'null'},
    "hint": "string - a conceptual hint",
    "finalAnswer": "string - strictly follow the finalAnswer instruction from STRICT CONSTRAINTS",
    "solutionSteps": "string - step-by-step explanation. Separate steps using the exact characters \\n inside the string"
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
