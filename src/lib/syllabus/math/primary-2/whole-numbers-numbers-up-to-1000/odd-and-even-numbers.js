import { foundationLogic } from './odd-and-even-numbers/foundation';
import { standardLogic } from './odd-and-even-numbers/standard';
import { advancedLogic } from './odd-and-even-numbers/advanced';

export const oddAndEvenNumbersBlueprint = {
  id: 'p2-odd-even-numbers',
  title: 'Odd and Even Numbers',
  strand: 'Number and Algebra',
  visualType: 'NUMBER_CARDS',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 1000,
      logicDescription: "Identify if a given 2-digit or 3-digit number is odd or even."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 1,
      maxNumber: 1000,
      logicDescription: "Select the odd or even number from a list of options."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 2,
      maxNumber: 1000,
      logicDescription: "Find the next odd or even number in a sequence or after a given number."
    }
  },

  variants: {
    foundation_identify_odd_2_digit: "Identify if a 2-digit number is odd.",
    foundation_identify_even_2_digit: "Identify if a 2-digit number is even.",
    foundation_identify_odd_3_digit: "Identify if a 3-digit number is odd.",
    foundation_identify_even_3_digit: "Identify if a 3-digit number is even.",
    foundation_random_odd_even: "Identify if a random 2-digit or 3-digit number is odd or even.",

    standard_select_odd_from_2_digits: "Select the odd number from a list of 2-digit numbers.",
    standard_select_even_from_2_digits: "Select the even number from a list of 2-digit numbers.",
    standard_select_odd_from_3_digits: "Select the odd number from a list of 3-digit numbers.",
    standard_select_even_from_3_digits: "Select the even number from a list of 3-digit numbers.",
    standard_random_select_odd_even: "Select an odd/even number from a list of mixed 2/3-digit numbers.",

    advanced_next_odd_even_after: "Find the next odd/even number after a given number.",
    advanced_greatest_odd_even_formed: "Find the greatest odd/even number formed from 3 given digits.",
    advanced_smallest_odd_even_formed: "Find the smallest odd/even number formed from 3 given digits.",
    advanced_sum_of_next_two: "Find the sum of the next two odd/even numbers after a given number.",
    advanced_nth_odd_even_after: "Find the 3rd or 4th odd/even number after a given number."
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 2';
    const topic = 'Whole Numbers - Numbers up to 1000';
    const subtopic = 'Odd and Even Numbers';
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';

    const zodType = type;
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    
    const context = { name: "Student", setting: "class" };
    const selectedContextItem = "numbers";
    
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
