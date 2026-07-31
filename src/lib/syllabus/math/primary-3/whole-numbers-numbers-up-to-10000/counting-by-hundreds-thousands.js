import { getRandomContext } from '@/lib/utils/localization';

import { foundationLogic } from './counting-by-hundreds-thousands/foundation';
import { standardLogic } from './counting-by-hundreds-thousands/standard';
import { advancedLogic } from './counting-by-hundreds-thousands/advanced';

export const p3CountingByHundredsThousandsBlueprint = {
  id: 'p3-counting-hundreds-thousands',
  title: 'Counting by Hundreds/Thousands',
  strand: 'Number and Algebra',
  visualType: 'NONE', // Can be NONE or NUMBER_PATTERN

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 10000,
      logicDescription: "Counting on and back by 100s and 1000s without crossing boundaries."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      maxNumber: 10000,
      logicDescription: "Counting on and back by 100s and 1000s crossing thousands boundaries."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 3,
      maxNumber: 10000,
      logicDescription: "Mixed counting by 100s and 1000s in word problems."
    }
  },

  variants: {
    foundation_count_on_100: "Count on by multiples of 100.",
    foundation_count_on_1000: "Count on by multiples of 1000.",
    foundation_count_back_100: "Count back by multiples of 100.",
    foundation_count_back_1000: "Count back by multiples of 1000.",
    standard_count_on_multiple_100_cross: "Count on by multiples of 100 crossing a boundary.",
    standard_count_back_multiple_100_cross: "Count back by multiples of 100 crossing a boundary.",
    standard_mixed_1000_and_100: "Mixed counting by multiples of 1000s and 100s in two steps.",

    advanced_word_problem: "Word problem involving counting money or items in 100s and 1000s.",
    advanced_word_problem_count_back: "Word problem involving counting back by 100s or 1000s.",
    advanced_two_step_word_problem: "Two-step word problem involving both 100s and 1000s.",
    advanced_finding_initial_amount: "Reverse word problem (finding the initial amount).",
    advanced_daily_saving_pattern: "Word problem involving repeated addition over a few days.",
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 3';
    const topic = 'Whole Numbers - Numbers up to 10 000';
    const subtopic = 'Counting by Hundreds/Thousands';
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';

    const zodType = type;
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const context = getRandomContext('general', 'LOWER_BLOCK');
    const selectedContextItem = "items";
    let inputRequirementStr;
    const difficultyObj = {
      foundation: { steps: 1 },
      standard: { steps: 2 },
      advanced: { steps: 3 }
    };

    const variantSteps = {
      foundation_count_on_100: 1,
      foundation_count_on_1000: 1,
      foundation_count_back_100: 1,
      foundation_count_back_1000: 1,
      standard_count_on_multiple_100_cross: 1,
      standard_count_back_multiple_100_cross: 1,
      standard_mixed_1000_and_100: 2,
      advanced_word_problem: 2,
      advanced_word_problem_count_back: 2,
      advanced_two_step_word_problem: 3,
      advanced_finding_initial_amount: 2,
      advanced_daily_saving_pattern: 2,
    };

    const expectedSteps = variantSteps[activeVariant] || difficultyObj[difficulty.toLowerCase()].steps;

    if (isStructure) {
      const stepObjects = [];
      for (let i = 1; i <= expectedSteps; i++) {
        stepObjects.push(`{ "label": "Step ${i}", "expectedAnswer": "string - the equation for step ${i}" }`);
      }
      stepObjects.push(`{ "label": "What is the final answer?", "expectedAnswer": "string - JUST the numeral, absolutely no equations" }`);

      inputRequirementStr = `{
      "inputType": "MULTI_STEP_INPUT",
      "steps": [
        ${stepObjects.join(',\n        ')}
      ]
    }`;
    } else {
      inputRequirementStr = `{ "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }`;
    }

    let formatInstructions = `OUTPUT FORMAT (Return ONLY valid JSON matching this schema):
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
  "inputRequirement": ${inputRequirementStr}
}`;

    const isWordProblem = isStructure || (isMCQ && Math.random() > 0.5);

    if (isWordProblem) {
      const charName = context.name || 'someone';
      const item = (context.items && context.items.length > 0) ? context.items[0].item : 'items';
      const setting = context.setting || 'a familiar place';
      formatInstructions += `\n\nCRITICAL REQUIREMENT: You MUST wrap the problem in an engaging real-world story or word problem featuring ${charName} and ${item} at ${setting}. Inject a strong local Singaporean flavour into the story context. Be highly creative with the scenario. Do not ask a direct calculation, and DO NOT use generic or repetitive stories like "A local library" or "A factory".`;
    } else {
      formatInstructions += `\n\nCRITICAL REQUIREMENT: This is a direct calculation question. Do not wrap it in a word problem. Just ask for the mathematical answer directly (e.g. "What is 100 more than 1234?").`;
    }

    if (isStructure) {
      formatInstructions += `\n\nCRITICAL REQUIREMENT FOR MULTI_STEP_INPUT: You MUST provide exactly ${expectedSteps} working steps in the steps array, plus the final answer step. Adjust your math logic (e.g., use multiplication instead of repeated addition) to fit exactly ${expectedSteps} working steps. Do not compress or expand the number of steps.`;
    }

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
