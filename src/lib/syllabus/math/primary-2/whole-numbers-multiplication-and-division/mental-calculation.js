import { foundationLogic } from './mental-calculation/foundation';
import { standardLogic } from './mental-calculation/standard';
import { advancedLogic } from './mental-calculation/advanced';
import { getRandomContext } from '@/lib/utils/localization';

export const mentalCalculationBlueprint = {
  title: 'Mental Calculation (Multiplication/Division)',
  variants: {
    'foundation_mental_multiply_2_3': 'Mental multiplication by 2 or 3.',
    'foundation_mental_divide_2_3': 'Mental division by 2 or 3.',
    'foundation_mental_multiply_4_5_10': 'Mental multiplication by 4, 5, or 10.',
    'foundation_mental_divide_4_5_10': 'Mental division by 4, 5, or 10.',

    'standard_mental_multiply_mixed': 'Random mental multiplication by 2, 3, 4, 5, 10.',
    'standard_mental_divide_mixed': 'Random mental division by 2, 3, 4, 5, 10.',
    'standard_mental_missing_factor': 'Find the missing factor.',
    'standard_mental_missing_dividend': 'Find the missing dividend.',

    // removed advanced_mental_two_step_operations as it is not suitable for P2
    'advanced_mental_balance_equations': 'Balance equations.',
    'advanced_mental_doubling_halving': 'Use associative/distributive strategies mentally.',
  },
  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 2';
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
