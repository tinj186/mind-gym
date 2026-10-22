import { foundationLogic } from './number-notation/foundation.js';
import { standardLogic } from './number-notation/standard.js';
import { advancedLogic } from './number-notation/advanced.js';

export const p4NumberNotationBlueprint = {
  id: 'p4-number-notation',
  title: 'Number Notation',
  strand: 'Number and Algebra',
  visualType: 'NONE',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      logicDescription: 'reading and writing numbers in numerals and in words'
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      logicDescription: 'reading and writing numbers in numerals and in words'
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 2,
      logicDescription: 'reading and writing numbers in numerals and in words'
    }
  },

  variants: {
    foundation_to_words_exact_thousands: 'Convert exact ten thousands between numerals and words (e.g. 40 000 <-> forty thousand).',
    foundation_to_words_thousands_hundreds: 'Convert 5-digit numbers ending in hundreds between numerals and words (e.g. 35 400 <-> thirty-five thousand, four hundred).',
    foundation_to_words_zero_hundreds: 'Convert 5-digit numbers with zero hundreds between numerals and words (e.g. 42 035 <-> forty-two thousand and thirty-five).',
    foundation_to_words_zero_tens_hundreds: 'Convert 5-digit numbers with zero hundreds and tens between numerals and words (e.g. 80 009 <-> eighty thousand and nine).',
    foundation_to_words_general: 'Convert general 5-digit numbers between numerals and words (e.g. 58 327 <-> fifty-eight thousand, three hundred and twenty-seven).',

    standard_expanded_form_to_words: 'Convert expanded notation with missing place values into words.',
    standard_thousands_units_grouping_to_words: 'Convert thousands and units grouping statements into words or numerals.',
    standard_more_less_notation: 'Determine 100 or 1000 more/less than a given number in words or numerals.',
    standard_simple_computation_to_words: 'Compute a sum or difference of place value parts and express the result in words.',
    standard_word_notation_discrimination: 'Identify the exact written word form among common place value misconception distractors.',

    advanced_identify_spelling_error: 'Spot incorrect spelling or notation in 5-digit number words.',
    advanced_mixed_place_values_to_words: 'Convert non-standard mixed place values to words.',
    advanced_mystery_number_to_words: 'Solve a 5-digit mystery riddle and write the result in words.',
    advanced_forming_numbers_to_words: 'Form the greatest or smallest 5-digit odd/even number and write in words.',
    advanced_numeral_to_words_with_condition: 'Calculate a conditioned 5-digit number and express the result in words.'
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 4';
    const topic = 'Whole Numbers - Numbers up to 100 000';
    const subtopic = 'Number Notation';
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
