import { foundationLogic } from './addition-subtraction/foundation';
import { standardLogic } from './addition-subtraction/standard';
import { advancedLogic } from './addition-subtraction/advanced';

export const additionSubtractionBlueprint = {
  id: 'p2-addition-subtraction',
  title: 'Addition and Subtraction',
  strand: 'Number and Algebra',
  visualType: 'NONE',

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
    foundation_random: "Randomly select a foundation addition/subtraction variant."
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 2';
    const topic = 'Whole Numbers - Addition and Subtraction';
    const subtopic = 'Addition and Subtraction';
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';
    
    const zodType = type;
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    
    const context = { name: "Ahmad", setting: "the library" };
    const selectedContextItem = "books";
    
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
