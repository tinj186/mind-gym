import { foundationLogic } from './place-values-ten-thousands/foundation.js';
import { standardLogic } from './place-values-ten-thousands/standard.js';
import { advancedLogic } from './place-values-ten-thousands/advanced.js';

export const p4PlaceValuesTenThousandsBlueprint = {
  id: 'p4-place-values-ten-thousands',
  title: 'Place Values (Ten Thousands)',
  strand: 'Number and Algebra',
  visualType: 'PLACE_VALUE_DISCS',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      logicDescription: 'number notation, representations and place values (ten thousands, thousands, hundreds, tens, ones)'
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      logicDescription: 'number notation, representations and place values (ten thousands, thousands, hundreds, tens, ones)'
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 2,
      logicDescription: 'number notation, representations and place values (ten thousands, thousands, hundreds, tens, ones)'
    }
  },

  variants: {
    foundation_visual: 'Look at the place value chart. Identify the 5-digit number shown.',
    foundation_identify_place: 'Identify which digit is in a specific place value (ten thousands to ones).',
    foundation_build_from_parts: 'Find the total number from given ten thousands, thousands, hundreds, tens, and ones.',
    foundation_expanded_form_addition: 'Calculate the total of an expanded form addition up to 100 000.',
    foundation_place_value_representation: 'Identify how many ten thousands a specific digit represents.',

    standard_digit_value: 'Identify the value of a specific digit in a 5-digit number.',
    standard_digit_with_value: 'Identify which digit has a given value in a 5-digit number.',
    standard_expanded_form_missing: 'Find the missing number in a 5-digit expanded form equation.',
    standard_greatest_value_digit: 'Compare the values of digits across different place values and numbers.',
    standard_mystery_number_values: 'Solve a 5-digit mystery number from jumbled place value clues.',

    advanced_decomposition: 'Decompose or reconstruct numbers from non-standard place value groupings.',
    advanced_regrouping: 'Regroup tens, hundreds, and thousands into a 5-digit number.',
    advanced_value_riddles: 'Solve multi-step place value riddles using relational clues and digit sums.',
    advanced_difference_between_values: 'Find the difference between the values of two digits in a 5-digit number.',
    advanced_forming_numbers: 'Form the smallest or greatest 5-digit even/odd number with constraints using given digits.'
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 4';
    const topic = 'Whole Numbers - Numbers up to 100 000';
    const subtopic = 'Place Values (Ten Thousands)';
    const safeType = String(type || 'short question').toLowerCase();
    const isMCQ = safeType === 'mcq';
    const isShort = safeType === 'short question';
    const isStructure = !isMCQ && !isShort;

    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const getFormatInstructions = (visualEngineStr = '{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }', inputRequirementStr = null) => `CRITICAL INSTRUCTION: You MUST use the EXACT "visualEngine" and "inputRequirement" JSON objects provided in the template below.
OUTPUT FORMAT (Return ONLY valid JSON matching this schema, with NO markdown formatting and NO trailing characters):
{
  "meta": {
    "level": "${level}",
    "topic": "${topic}",
    "subtopic": "${subtopic}",
    "difficulty": "${zodDiff}",
    "type": "${zodType}",
    "variant": "${activeVariant || 'default'}"
  },
  "visualEngine": ${visualEngineStr},
  "inputRequirement": ${inputRequirementStr || `{ "inputType": "${isMCQ ? 'MCQ_BUTTONS' : isShort ? 'STANDARD_TEXT' : 'MULTI_STEP_INPUT'}" }`},
  "content": {
    "questionText": "string (the exact question stem)",
    "options": ${isMCQ ? '["Option A", "Option B", "Option C", "Option D"]' : 'null'},
    "defectMap": ${isMCQ ? '{"wrong_option_1": "CARELESS_CALCULATION"}' : '{}'},
    "finalAnswer": "string (the final correct answer)",
    "solutionSteps": "string (step-by-step logic, separate steps using \\\\n)",
    "hint": "string (a helpful conceptual clue)"
  }
}`;

    const diff = String(difficulty || 'foundation').toLowerCase();
    if (diff === 'foundation') {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions);
    } else if (diff === 'standard') {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions);
    } else if (diff === 'advanced') {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions);
    }

    throw new Error(`Unsupported difficulty '${difficulty}' for ${subtopic}`);
  }
};
