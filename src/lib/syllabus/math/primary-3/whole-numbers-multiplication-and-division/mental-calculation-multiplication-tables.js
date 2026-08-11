import { foundationLogic } from './mental-calculation-multiplication-tables/foundation';
import { standardLogic } from './mental-calculation-multiplication-tables/standard';
import { advancedLogic } from './mental-calculation-multiplication-tables/advanced';
import { getRandomContext } from '@/lib/utils/localization';

export const p3MentalCalculationMultiplicationTablesBlueprint = {
  id: 'p3-mental-calculation-multiplication-tables',
  title: 'Mental Calculation (Multiplication/Division)',
  strand: 'Number and Algebra',
  visualType: 'DYNAMIC',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 100,
      logicDescription: "Instant retrieval of times tables, understanding fact families, and basic place value shifting."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 1,
      maxNumber: 1000,
      logicDescription: "Breaking down slightly larger numbers mentally using the distributive property."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 2,
      maxNumber: 1000,
      logicDescription: "Chained operations and mental balancing equations."
    }
  },

  variants: {
    'foundation_direct_fact_retrieval': 'Direct Fact Retrieval (Multiplication)',
    'foundation_fact_family_link': 'Fact Family Link (Division via Multiplication)',
    'foundation_multiplying_multiples_10': 'Multiplying Multiples of 10 and 100',
    'foundation_dividing_multiples_10': 'Dividing Multiples of 10 and 100',
    'foundation_direct_fact_retrieval_division': 'Direct Fact Retrieval (Division)',

    'standard_mental_splitting_addition': 'Mental Splitting (Addition/Distributive)',
    'standard_mental_compensation': 'Mental Compensation (Subtraction)',
    'standard_splitting_for_division': 'Splitting for Division',
    'standard_halving_and_doubling': 'Halving and Doubling Strategy',
    'standard_extrapolating_hundreds': 'Extrapolating to Hundreds (Reverse Division)',

    'advanced_chained_ops_multiply_add': 'Chained Operations (Multiply then Add)',
    'advanced_chained_ops_divide_subtract': 'Chained Operations (Divide then Subtract)',
    'advanced_equivalent_expressions': 'Equivalent Expressions (Mental Balancing)',
    'advanced_mental_scaling': 'Mental Scaling (Divide then Multiply)',
    'advanced_mental_reversal': 'The Mental Reversal (Reverse Chaining)',
  },
  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 3';
    const topic = 'Whole Numbers - Multiplication and Division';
    const subtopic = 'Mental Calculation (Multiplication/Division)';
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';

    if (isStructure) {
      throw new Error('Structured questions are not supported for Mental Calculation. Please use MCQ or Short Question.');
    }

    // Zod formatting strings
    const zodType = type === 'Short Question' ? 'SHORT_QUESTION' : type.toUpperCase();
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    // Helper to switch text based on type
    const getQText = (structureText, shortText) => {
      if (isStructure) return structureText;
      return shortText || structureText;
    };

    // Default system instructions segment
    const getFormatInstructions = (visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: { hideVisual: true } }), inputRequirementStr = null) => `OUTPUT FORMAT (Return ONLY valid JSON matching this schema, with NO markdown formatting, NO \`\`\`json blocks, and NO trailing characters/braces):
{
  "meta": {
    "level": "${level}",
    "topic": "${topic}",
    "subtopic": "${subtopic}",
    "type": "${zodType}",
    "difficulty": "${zodDiff}"
  },
  "content": {
    "questionText": ["string (Line 1)", "string (Line 2)"] (Array of strings for the full question text. Break into multiple lines if needed.),
    "options": ["string", "string", "string", "string"] (ONLY if MCQ, otherwise empty array),
    "defectMap": { "distractor1": "Error category", "distractor2": "Error category" } (ONLY if MCQ, otherwise empty object),
    "hint": "string (Pedagogical hint)",
    "solutionSteps": "string (step-by-step model solution. You MUST separate steps using the exact characters \\\\n inside the string. Formatted strictly as a numbered list 1. ..., 2. ..., 3. ...)",
    "finalAnswer": "string (The exact final answer)"
  },
  "visualEngine": ${visualEngineStr}${inputRequirementStr ? `,\n  "inputRequirement": ${inputRequirementStr}` : ''}
}
CRITICAL INSTRUCTION: DO NOT generate your own visualEngine. You MUST output EXACTLY the visualEngine and inputRequirement values provided in the schema above.`;

    const context = getRandomContext();
    const selectedContextItem = context.items[Math.floor(Math.random() * context.items.length)].item;

    const diffKey = difficulty.toLowerCase();

    if (diffKey === 'foundation') {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText);
    } else if (diffKey === 'standard') {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText);
    } else if (diffKey === 'advanced') {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText);
    }

    throw new Error(`Unknown difficulty ${difficulty}`);
  }
};
