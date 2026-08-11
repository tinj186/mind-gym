import { foundationLogic } from './multiplication-tables-6-9/foundation';
import { standardLogic } from './multiplication-tables-6-9/standard';
import { advancedLogic } from './multiplication-tables-6-9/advanced';
import { getRandomNames, getRandomCountableItems } from '@/lib/utils/variable-bank';

export const p3MultiplicationTables69Blueprint = {
  id: 'p3-multiplication-tables-6-9',
  title: 'Multiplication Tables (6-9)',
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
    foundation_groups_of: "Identify total items in equal groups (e.g., 3 groups of 6).",
    foundation_repeated_addition: "Translate repeated addition to multiplication.",
    foundation_arrays: "Find total using a conceptual array format.",
    foundation_direct_multiply_6_9: "Direct multiplication facts for 6, 7, 8, and 9.",
    foundation_skip_counting_6_9: "Find the missing number in a skip counting sequence.",

    standard_missing_factor_6_9: "Find the missing factor for tables 6, 7, 8, 9.",
    standard_word_problem_grouping: "1-step word problem finding total objects in groups.",
    standard_word_problem_rate: "1-step word problem finding total cost or amount (rate).",
    standard_commutativity: "Use commutative property (e.g., 8 x 6 = 6 x ?).",
    standard_true_false_equation: "Identify if a given multiplication equation is true or false.",

    advanced_2_step_word_problem: "2-step word problem involving multiplication and addition/subtraction.",
    advanced_comparing_products: "Compare two multiplication expressions to find the larger/smaller product.",
    advanced_distributive: "Break down a larger multiplication fact (e.g., 8 x 6 = (5 x 6) + (3 x 6)).",
    advanced_balance_equations: "Balance multiplication equations (e.g., 2 x 12 = 4 x ?).",
    advanced_word_problem_difference: "Find the difference between two multiplied groups."
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 3';
    const topic = 'Whole Numbers - Multiplication and Division';
    const subtopic = 'Multiplication Tables (6-9)';
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';

    const zodType = type === 'Short Question' ? 'SHORT_QUESTION' : type.toUpperCase();
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const contextName = getRandomNames(1);
    const contextItemObj = getRandomCountableItems(1);
    const context = { name: contextName, setting: "the store" };
    const selectedContextItem = contextItemObj.item;

    const getFormatInstructions = (visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: { hideVisual: true } }), inputRequirementStr = null) => `OUTPUT FORMAT (Return ONLY valid JSON matching this schema, with NO markdown formatting, NO \`\`\`json blocks, and NO trailing characters/braces):
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
