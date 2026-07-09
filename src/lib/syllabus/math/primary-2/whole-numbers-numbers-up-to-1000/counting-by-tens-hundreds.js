import { getRandomContext } from '@/lib/utils/localization';

import { foundationLogic } from './counting-by-tens-hundreds/foundation';
import { standardLogic } from './counting-by-tens-hundreds/standard';
import { advancedLogic } from './counting-by-tens-hundreds/advanced';

export const countingByTensHundredsBlueprint = {
  id: 'p2-counting-tens-hundreds',
  title: 'Counting by Tens/Hundreds',
  strand: 'Number and Algebra',
  visualType: 'NONE', // Can be NONE or NUMBER_PATTERN

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 1000,
      logicDescription: "Counting on and back by 10s and 100s without crossing boundaries."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      maxNumber: 1000,
      logicDescription: "Counting on and back by 10s and 100s crossing hundreds boundaries."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 3,
      maxNumber: 1000,
      logicDescription: "Mixed counting by 10s and 100s in word problems."
    }
  },

  variants: {
    foundation_count_on_10: "Count on by 10s.",
    foundation_count_on_100: "Count on by 100s.",
    foundation_count_back_10: "Count back by 10s.",
    foundation_count_back_100: "Count back by 100s.",
    foundation_count_multiple_10_100: "Count on by multiples of 10s or 100s.",

    standard_cross_boundary: "Count back by 10s crossing a hundred boundary.",
    standard_count_on_10_cross_boundary: "Count on by 10s crossing a hundred boundary.",
    standard_count_on_multiple_10_cross: "Count on by multiples of 10 crossing a boundary.",
    standard_count_back_multiple_10_cross: "Count back by multiples of 10 crossing a boundary.",
    standard_mixed_100_and_10: "Mixed counting by 100s and 10s in two steps.",

    advanced_word_problem: "Word problem involving counting money or items in 10s and 100s.",
    advanced_word_problem_count_back: "Word problem involving counting back by 10s or 100s.",
    advanced_two_step_word_problem: "Two-step word problem involving both 10s and 100s.",
    advanced_finding_initial_amount: "Reverse word problem (finding the initial amount).",
    advanced_daily_saving_pattern: "Word problem involving repeated addition over a few days.",
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 2';
    const topic = 'Whole Numbers - Numbers up to 1000';
    const subtopic = 'Counting by Tens/Hundreds';
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';

    const zodType = type;
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const context = getRandomContext('general', 'LOWER_BLOCK');
    const selectedContextItem = "items";
    const formatInstructions = `OUTPUT FORMAT (Return ONLY valid JSON matching this schema):
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
  "visualEngine": {
    "componentToRender": "NONE",
    "componentData": {}
  },
  "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
}`;

    // Dummy helper to switch text based on type
    const getQText = (structureText, shortText) => {
      if (isStructure) return structureText;
      return shortText || structureText;
    };

    if (difficulty.toLowerCase() === 'foundation') {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText);
    } else if (difficulty.toLowerCase() === 'standard') {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText);
    } else if (difficulty.toLowerCase() === 'advanced') {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText);
    }

    throw new Error(`Unknown difficulty ${difficulty}`);
  }
};
