import { foundationLogic } from './multiplication-division-tables/foundation';
import { standardLogic } from './multiplication-division-tables/standard';
import { advancedLogic } from './multiplication-division-tables/advanced';
import { getRandomNames, getRandomCountableItems } from '@/lib/utils/variable-bank';

export const p3MultiplicationDivisionTablesBlueprint = {
  id: 'p3-multiplication-division-tables',
  title: 'Multiplication and Division Tables',
  strand: 'Number and Algebra',
  visualType: 'DYNAMIC',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 100,
      logicDescription: "Visual translation, pure mathematical notation, and single-step retrieval."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 1,
      maxNumber: 1000,
      logicDescription: "Single-step word problems, scaling language, and fact families."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 2,
      maxNumber: 1000,
      logicDescription: "Multi-step heuristics, identifying hidden units, values vs quantity, and two-part comparisons."
    }
  },

  variants: {
    foundation_direct_grouping: "Converts a visual grouping concept into the correct mathematical equation (e.g., 4 groups of 7).",
    foundation_missing_factor: "Pure mathematical notation to test times-table fluency (e.g., ___ x 8 = 48 or 54 ÷ ___ = 6).",
    foundation_basic_sharing: "A direct division scenario (e.g., sharing 36 items equally among 9 people).",
    foundation_array_model: "Rows and columns context (e.g., arranging chairs in 6 rows of 7).",
    foundation_equation_equivalence: "Testing commutative properties (e.g., Which gives same answer as 8 x 4?).",
    standard_single_step_multiplication: "Purchasing multiples of an item (e.g., buying 7 plates of chicken rice at $6 each).",
    standard_packaging_division: "Packing a total amount into containers (e.g., packing 56 curry puffs into boxes of 8).",
    standard_fact_families: "If 9 x 8 = 72, what is 72 ÷ 8?",
    standard_scaling_quantities: "Using times as many comparative language.",
    standard_remainder_trap: "Identifies if a number can be divided equally without remainders based on times tables.",
    advanced_multiply_then_add_subtract: "Multiply to find total, then add or subtract (e.g., buys 4 packs of 8 stickers, gives 5 away).",
    advanced_add_subtract_then_divide: "Add or subtract to find total items, then pack equally into groups.",
    advanced_missing_multiplier_model: "Two-step model prep (e.g., 3 times as many, total 32, find 1 unit).",
    advanced_value_vs_quantity: "Differentiation between quantity of coins/notes and their monetary value.",
    advanced_two_part_comparison: "Find one part via division, then find total sum of both parts."
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 3';
    const topic = 'Whole Numbers - Multiplication and Division';
    const subtopic = 'Multiplication and Division Tables';

    // We enforce isMCQ and isShort where needed, but here we set base flags based on 'type'.
    // The individual logic can override structure if needed.
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';

    const zodType = type;
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

    throw new Error(`Difficulty ${difficulty} not yet implemented for this blueprint.`);
  }
};
