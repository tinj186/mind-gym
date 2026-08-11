import { foundationLogic } from './mental-calculation-2-digit-add-sub/foundation';
import { standardLogic } from './mental-calculation-2-digit-add-sub/standard';
import { advancedLogic } from './mental-calculation-2-digit-add-sub/advanced';
import { getRandomNames, getRandomCountableItems } from '@/lib/utils/variable-bank';

export const p3MentalCalculation2DigitAddSubBlueprint = {
  id: 'p3-mental-calculation-2-digit-add-sub',
  title: 'Mental Calculation (2-Digit)',
  strand: 'Number and Algebra',
  visualType: 'DYNAMIC',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 100,
      logicDescription: "Mentally add or subtract multiples of 10, or two 2-digit numbers without renaming."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 1,
      maxNumber: 100,
      logicDescription: "Mentally add or subtract two 2-digit numbers with renaming, or use compensation strategies."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 2,
      maxNumber: 100,
      logicDescription: "Find missing parts in 2-digit mental calculations or perform subtraction with compensation."
    }
  },

  variants: {
    // Foundation
    foundation_add_ones_mentally: "Mentally add a 1-digit number to a 2-digit number without renaming.",
    foundation_sub_ones_mentally: "Mentally subtract a 1-digit number from a 2-digit number without renaming.",
    foundation_add_tens_mentally: "Mentally add multiples of 10 to a 2-digit number.",
    foundation_sub_tens_mentally: "Mentally subtract multiples of 10 from a 2-digit number.",
    foundation_add_2_digit_no_renaming: "Mentally add two 2-digit numbers without renaming.",
    foundation_sub_2_digit_no_renaming: "Mentally subtract two 2-digit numbers without renaming.",

    // Standard
    standard_add_ones_renaming: "Mentally add a 1-digit number to a 2-digit number with renaming.",
    standard_sub_ones_renaming: "Mentally subtract a 1-digit number from a 2-digit number with renaming.",
    standard_add_2_digit_renaming: "Mentally add two 2-digit numbers with renaming.",
    standard_sub_2_digit_renaming: "Mentally subtract two 2-digit numbers with renaming.",

    // Advanced
    advanced_missing_addend_mentally: "Find the missing addend in a 2-digit mental calculation.",
    advanced_missing_subtrahend_mentally: "Find the missing subtrahend in a 2-digit mental calculation.",
    advanced_missing_minuend_mentally: "Find the missing minuend in a 2-digit mental calculation.",
    advanced_sub_compensation: "Mentally subtract numbers ending in 8 or 9 using compensation.",
    advanced_make_ten_strategy: "Mentally add three numbers by making a multiple of 10 first."
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 3';
    const topic = 'Whole Numbers - Addition and Subtraction';
    const subtopic = 'Mental Calculation (2-Digit)';
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';

    const zodType = type === 'Short Question' ? 'SHORT_QUESTION' : type.toUpperCase();
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const contextName = getRandomNames(1);
    const contextItem = getRandomCountableItems(1).item;
    const context = { name: contextName, setting: "the store" };
    const selectedContextItem = contextItem;

    const getFormatInstructions = (visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: { hideVisual: true } }), inputRequirementStr = null) => `OUTPUT FORMAT (Return ONLY a single, perfectly formed JSON object matching this schema. Stop generating immediately after closing the outermost object. NO markdown formatting, NO \`\`\`json blocks, NO trailing brackets or braces):
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
}
CRITICAL INSTRUCTION: DO NOT generate your own visualEngine. You MUST output EXACTLY the visualEngine and inputRequirement values provided in the schema above.`;

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
