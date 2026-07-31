import { foundationLogic } from './number-patterns/foundation';
import { standardLogic } from './number-patterns/standard';
import { advancedLogic } from './number-patterns/advanced';

export const p3NumberPatternsBlueprint = {
  id: 'p3-number-patterns',
  title: 'Number Patterns',
  strand: 'Number and Algebra',
  visualType: 'NUMBER_PATTERN',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 10000,
      logicDescription: "Identify missing number in a sequence jumping by 10s or 100s."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      maxNumber: 10000,
      logicDescription: "Identify missing numbers in a sequence with crossing boundaries."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 3,
      maxNumber: 10000,
      logicDescription: "Find a missing term in a multi-step alternating pattern."
    }
  },

  variants: {
    foundation_add_10: "Missing number in an ascending +10 sequence (random position).",
    foundation_subtract_10: "Missing number in a descending -10 sequence (random position).",
    foundation_add_100: "Missing number in an ascending +100 sequence (random position).",
    foundation_subtract_100: "Missing number in a descending -100 sequence (random position).",
    foundation_random_10_or_100: "Missing number in a random sequence (+/-10 or +/-100) (random position).",

    standard_add_10_cross_hundreds: "Missing number in an ascending +10 sequence crossing a hundreds boundary.",
    standard_subtract_10_cross_hundreds: "Missing number in a descending -10 sequence crossing a hundreds boundary.",
    standard_add_small_cross_hundreds: "Missing number in an ascending small jump (+2, +3, +4, +5) crossing a hundreds boundary.",
    standard_subtract_small_cross_hundreds: "Missing number in a descending small jump (-2, -3, -4, -5) crossing a hundreds boundary.",
    standard_random_cross_hundreds: "Missing number in a random sequence crossing a hundreds boundary.",

    advanced_alternating_add_sub: "Missing number in an alternating pattern (e.g. +10, -5).",
    advanced_alternating_add_add: "Missing number in an alternating pattern (e.g. +2, +5).",
    advanced_alternating_sub_sub: "Missing number in an alternating pattern (e.g. -10, -2).",
    advanced_increasing_jumps: "Missing number in a growing jump pattern (e.g. +2, +4, +6, +8).",
    advanced_large_jumps: "Missing number in a sequence with large arbitrary jumps (+200, +300, etc.).",
    advanced_multiples_of_10: "Missing number in a sequence jumping by 20, 30, 40, or 50.",
    advanced_quarters: "Missing number in a sequence jumping by 25 or 75."
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 3';
    const topic = 'Whole Numbers - Numbers up to 10 000';
    const subtopic = 'Number Patterns';
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';

    if (isStructure) {
      throw new Error('Structured questions are not supported for Number Patterns. Please use MCQ or Short Question.');
    }

    const zodType = type;
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
