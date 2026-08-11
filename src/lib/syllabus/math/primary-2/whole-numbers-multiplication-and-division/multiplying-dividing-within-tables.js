import { foundationLogic } from './multiplying-dividing-within-tables/foundation';
import { standardLogic } from './multiplying-dividing-within-tables/standard';
import { advancedLogic } from './multiplying-dividing-within-tables/advanced';
import { getRandomContext } from '@/lib/utils/localization';

export const multiplyingDividingWithinTablesBlueprint = {
  title: 'Multiplying and Dividing within the Multiplication Tables',
  variants: {
    'foundation_direct_division': 'Direct division facts within the tables.',
    'foundation_division_sharing': '1-step word problem focusing on sharing equally.',
    'foundation_division_grouping': '1-step word problem focusing on grouping.',
    'foundation_identify_operation': 'Identify whether to multiply or divide based on context.',
    'foundation_equation_to_story': 'Match a simple equation to the correct story or context.',

    'standard_mixed_word_problem': 'Randomized 1-step word problem that tests comprehension of multiply vs divide.',
    'standard_missing_dividend_divisor': 'Direct equations finding the missing dividend or divisor.',
    'standard_multiplication_addition_word_problem': '2-step word problem: multiplication followed by addition/subtraction.',
    'standard_division_addition_word_problem': '2-step word problem: division followed by addition/subtraction.',
    'standard_compare_statements': 'Compare statements with multiplication and division.',

    'advanced_unitary_method': '2-step word problem: find value of 1, then find value of many.',
    'advanced_two_step_multiply_divide': '2-step word problem involving multiplication and division in sequence.',
    'advanced_compare_operations': 'Evaluate and compare two expressions mixing multiplication and division.',
    'advanced_consecutive_multi_step': 'Multi-step logic across 3 related entities.',
    'advanced_part_whole_multi_step': 'Multi-step distribution logic (sharing a remainder).',
  },
  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 2';
    const topic = 'Whole Numbers - Multiplication and Division';
    const subtopic = 'Multiplication/Division (Tables)';
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';

    const zodType = type === 'Short Question' ? 'SHORT_QUESTION' : type.toUpperCase();
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const getQText = (structureText, shortText) => {
      if (isStructure) return structureText;
      return shortText || structureText;
    };

    // The mandatory format instructions for the Generation Engine schema
    const getFormatInstructions = (visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`, inputRequirementStr = null) => `OUTPUT FORMAT (Return ONLY valid JSON matching this schema, with NO markdown formatting, NO \`\`\`json blocks, and NO trailing characters/braces):
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
}`;

    const context = getRandomContext('general');
    const selectedContextItem = context.items[0].item;

    const normDiff = difficulty.toLowerCase();

    if (normDiff === 'foundation') {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText);
    } else if (normDiff === 'standard') {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText);
    } else if (normDiff === 'advanced') {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText);
    }

    throw new Error(`Unknown difficulty ${difficulty}`);
  }
};
