import { foundationLogic } from './mental-calculation/foundation';
import { standardLogic } from './mental-calculation/standard';
import { advancedLogic } from './mental-calculation/advanced';
import { getRandomNames, getRandomLengthItems } from '@/lib/utils/variable-bank';

export const mentalCalculationBlueprint = {
  id: 'p2-mental-calculation',
  title: 'Mental Calculation (3-Digit)',
  strand: 'Number and Algebra',
  visualType: 'DYNAMIC',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 1000,
      logicDescription: "Mentally add or subtract ones, tens, or hundreds from a 3-digit number without renaming."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 1,
      maxNumber: 1000,
      logicDescription: "Mentally add or subtract with renaming, or use compensation strategies (e.g., +/- 98 or 99)."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 2,
      maxNumber: 1000,
      logicDescription: "Find missing parts in mental calculations or perform multi-step mental math."
    }
  },

  variants: {
    foundation_add_hundreds_mentally: "Mentally add multiples of 100 to a 3-digit number.",
    foundation_sub_hundreds_mentally: "Mentally subtract multiples of 100 from a 3-digit number.",
    foundation_add_tens_mentally: "Mentally add multiples of 10 to a 3-digit number (no renaming).",
    foundation_sub_tens_mentally: "Mentally subtract multiples of 10 from a 3-digit number (no renaming).",
    foundation_add_ones_mentally: "Mentally add a 1-digit number to a 3-digit number (no renaming).",

    standard_add_tens_renaming: "Mentally add multiples of 10 to a 3-digit number (with renaming).",
    standard_sub_tens_renaming: "Mentally subtract multiples of 10 from a 3-digit number (with renaming).",
    standard_add_ones_renaming: "Mentally add a 1-digit number to a 3-digit number (with renaming).",
    standard_sub_ones_renaming: "Mentally subtract a 1-digit number from a 3-digit number (with renaming).",
    standard_add_compensation: "Mentally add 98 or 99 using compensation.",

    advanced_missing_addend_mentally: "Find the missing addend in a mental calculation.",
    advanced_missing_subtrahend_mentally: "Find the missing subtrahend in a mental calculation.",
    advanced_sub_compensation: "Mentally subtract 98 or 99 using compensation.",
    advanced_add_two_multiples: "Mentally add two multiples of 10 to a 3-digit number.",
    advanced_sub_two_multiples: "Mentally subtract two multiples of 10 from a 3-digit number."
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 2';
    const topic = 'Whole Numbers - Addition and Subtraction';
    const subtopic = 'Mental Calculation (3-Digit)';
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';

    const zodType = type === 'Short Question' ? 'SHORT_QUESTION' : type.toUpperCase();
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const contextName = getRandomNames(1);
    const contextItem = getRandomLengthItems(1);
    const context = { name: contextName, setting: "the library" };
    const selectedContextItem = contextItem;

    const getFormatInstructions = (visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`, inputRequirementStr = null) => `OUTPUT FORMAT (Return ONLY valid JSON matching this schema, with NO markdown formatting, NO \`\`\`json blocks, and NO trailing characters/braces):
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
