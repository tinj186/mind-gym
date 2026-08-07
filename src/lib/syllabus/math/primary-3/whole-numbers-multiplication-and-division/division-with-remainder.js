import { foundationLogic } from './division-with-remainder/foundation';
import { standardLogic } from './division-with-remainder/standard';
import { advancedLogic } from './division-with-remainder/advanced';
import { getRandomNames, getPackingAndShoppingItems } from '@/lib/utils/variable-bank';

export const p3DivisionWithRemainderBlueprint = {
  id: 'p3-division-with-remainder',
  title: 'Division with Remainder',
  strand: 'Number and Algebra',
  visualType: 'DYNAMIC',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 100,
      logicDescription: "Pure notation, visual grouping concepts, and single-step retrieval."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 1,
      maxNumber: 1000,
      logicDescription: "Real-world scenarios extracting either quotients or remainders, and testing boundaries."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 2,
      maxNumber: 1000,
      logicDescription: "Multi-step heuristics including pattern sequences, value vs quantity dual outputs, and boundary operations."
    }
  },

  variants: {
    foundation_pure_notation: "Direct mechanical calculation without word problem context.",
    foundation_identifying_remainder: "Isolates the concept of the leftover.",
    foundation_maximum_full_groups: "Focuses only on the quotient in a grouping scenario, ignoring the remainder.",
    foundation_reverse_calculation: "Constructing the total dividend from the divisor, quotient, and remainder.",
    foundation_remainder_rule: "Tests the conceptual rule that a remainder must always be smaller than the divisor.",

    // Standard Level
    standard_extracting_remainder: "A real-world division scenario where the student must explicitly isolate and report the remainder.",
    standard_reverse_calculation: "Tests the relationship between multiplication, addition, and division.",
    standard_extracting_quotient: "A real-world division scenario where the remainder must be entirely discarded.",
    standard_money_leftover: "Calculating leftover change using division logic.",
    standard_smallest_divisor: "Given a specific remainder, determine the smallest possible boundary constraint of the divisor.",

    // Advanced Level
    advanced_rounding_up_quotient: "The remainder forces a real-world constraint where the quotient must be increased by 1 to accommodate all items.",
    advanced_divisor_minus_remainder: "The student must find the difference between the divisor and the remainder to complete the next full set.",
    advanced_multi_step_strand: "The student must perform addition or subtraction to determine the true dividend before executing the division operation.",
    advanced_pattern_sequence: "Using division to find the exact position of an item within a repeating loop based on the remainder.",
    advanced_dual_output: "Converting a large currency note into multiple purchases, requiring the student to return both the quantity of items bought and the exact change left over."
  },

  generate: function (difficulty, activeVariant, type) {

    const level = 'Primary 3';
    const topic = 'Whole Numbers - Multiplication and Division';
    const subtopic = 'Division with Remainder';

    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';

    const zodType = type === 'Short Question' ? 'SHORT_QUESTION' : type.toUpperCase();
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const contextName = getRandomNames(1);
    const contextItemObj = getPackingAndShoppingItems(1);
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
  "visualEngine": ${visualEngineStr},
  "inputRequirement": ${inputRequirementStr || 'null'}
}
CRITICAL INSTRUCTION: DO NOT generate your own visualEngine or inputRequirement. You MUST output EXACTLY the visualEngine and inputRequirement values provided in the schema above.`;

    const getQText = (structureText, shortText) => {
      if (isStructure) return structureText;
      return shortText || structureText;
    };

    if (difficulty.toLowerCase() === 'foundation') {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText);
    }

    if (difficulty.toLowerCase() === 'standard') {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText);
    }

    if (difficulty.toLowerCase() === 'advanced') {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText);
    }

    throw new Error(`Difficulty ${difficulty} not yet implemented for this blueprint.`);
  }
};
