import { foundationLogic } from './place-values-hundreds/foundation';
import { standardLogic } from './place-values-hundreds/standard';
import { advancedLogic } from './place-values-hundreds/advanced';

export const placeValuesHundredsBlueprint = {
  id: 'p2-place-values-hundreds',
  title: 'Place Values (Hundreds)',
  strand: 'Number and Algebra',
  visualType: 'DYNAMIC',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 1000,
      logicDescription: "Identify hundreds, tens, and ones visually or in notation."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      maxNumber: 1000,
      logicDescription: "Identify the value of a specific digit in a 3-digit number."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 2,
      maxNumber: 1000,
      logicDescription: "Decompose a 3-digit number (e.g., 345 = 3 hundreds, 4 tens, 5 ones)."
    }
  },

  variants: {
    foundation_visual: "Look at the blocks. What number do they show?",
    foundation_blocks_needed: "How many blocks are needed to show the number?",
    foundation_identify_place: "Identify the digit in a specific place value.",
    foundation_build_from_parts: "Find the total from hundreds, tens, and ones.",
    foundation_expanded_form_addition: "Find the total of expanded form addition.",

    standard_digit_value: "What is the value of the digit X in Y?",
    standard_digit_with_value: "Identify the digit with a specific value.",
    standard_expanded_form_missing: "Find the missing part of expanded form.",
    standard_greatest_value_digit: "Which digit has the greatest value?",
    standard_mystery_number_values: "Build a number from jumbled values.",

    advanced_decomposition: "Decompose the number into hundreds, tens, and ones.",
    advanced_regrouping: "Regroup tens and ones to form a 3-digit number.",
    advanced_value_riddles: "Solve place value word riddles.",
    advanced_difference_between_values: "Find sum/difference between digit values.",
    advanced_forming_numbers: "Form numbers with specific conditions using given digits."
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 2';
    const topic = 'Whole Numbers - Numbers up to 1000';
    const subtopic = 'Place Values (Hundreds)';
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';

    const zodType = type === 'Short Question' ? 'SHORT_QUESTION' : type.toUpperCase();
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const context = { name: "Student", setting: "class" };
    const selectedContextItem = "blocks";
    const getFormatInstructions = (visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`) => `OUTPUT FORMAT (Return ONLY valid JSON matching this schema):
{
  "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
  "content": {
    "questionText": "string - the actual question stem",
    "options": ${isMCQ ? '["option 1", "option 2", "option 3", "option 4"]' : 'null'},
    "defectMap": ${isMCQ ? '{"wrong_option_1": "CARELESS_CALCULATION", "wrong_option_2": "CONCEPTUAL_ERROR"}' : 'null'},
    "hint": "string - a conceptual hint",
    "finalAnswer": "string - just the numeral",
    "solutionSteps": "string - step-by-step mathematical explanation formatted strictly as a numbered list with explicit \\n characters between steps"
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
