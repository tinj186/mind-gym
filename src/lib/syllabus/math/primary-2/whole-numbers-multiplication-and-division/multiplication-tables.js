import { foundationLogic } from './multiplication-tables/foundation';
import { standardLogic } from './multiplication-tables/standard';
import { advancedLogic } from './multiplication-tables/advanced';
import { getRandomNames, getRandomCountableItems } from '@/lib/utils/variable-bank';

export const multiplicationTablesBlueprint = {
  id: 'p2-multiplication-tables',
  title: 'Multiplication Tables (2-5, 10)',
  strand: 'Number and Algebra',
  visualType: 'DYNAMIC',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 100,
      logicDescription: "Basic concepts of multiplication: groups of, repeated addition, arrays, and direct facts."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 1,
      maxNumber: 100,
      logicDescription: "Finding missing factors and solving 1-step word problems involving equal groups or rate."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 2,
      maxNumber: 1000,
      logicDescription: "2-step word problems, distributive property, balancing equations, and comparing products."
    }
  },

  variants: {
    foundation_groups_of: "Identify total items in equal groups (e.g., 3 groups of 5).",
    foundation_repeated_addition: "Translate repeated addition to multiplication.",
    foundation_arrays: "Find total using a conceptual array format.",
    foundation_direct_multiply_2_5_10: "Direct multiplication facts for 2, 5, and 10.",
    foundation_direct_multiply_3_4: "Direct multiplication facts for 3 and 4.",
    foundation_skip_counting: "Find the missing number in a skip counting sequence.",

    standard_missing_factor_2_5_10: "Find the missing factor for tables 2, 5, 10.",
    standard_missing_factor_3_4: "Find the missing factor for tables 3, 4.",
    standard_word_problem_grouping: "1-step word problem finding total objects in groups.",
    standard_word_problem_rate: "1-step word problem finding total cost or amount (rate).",
    standard_commutativity: "Use commutative property (e.g., 4 x 3 = 3 x ?).",
    standard_true_false_equation: "Identify if a given multiplication equation is true or false.",

    advanced_2_step_word_problem: "2-step word problem involving multiplication and addition/subtraction.",
    advanced_comparing_products: "Compare two multiplication expressions to find the larger/smaller product.",
    advanced_distributive: "Break down a larger multiplication fact (e.g., 6 x 4 = (5 x 4) + (1 x 4)).",
    advanced_balance_equations: "Balance multiplication equations (e.g., 2 x 10 = 4 x ?).",
    advanced_word_problem_difference: "Find the difference between two multiplied groups."
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 2';
    const topic = 'Whole Numbers - Multiplication and Division';
    const subtopic = 'Multiplication Tables (2-5, 10)';
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';

    const zodType = type === 'Short Question' ? 'SHORT_QUESTION' : type.toUpperCase();
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const contextName = getRandomNames(1);
    const contextItemObj = getRandomCountableItems(1); 
    const context = { name: contextName, setting: "the store" };
    const selectedContextItem = contextItemObj.item;

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
