import { foundationLogic } from './operation-symbols/foundation';
import { standardLogic } from './operation-symbols/standard';
import { advancedLogic } from './operation-symbols/advanced';
import { getRandomNames, getRandomLengthItems } from '@/lib/utils/variable-bank';

export const operationSymbolsBlueprint = {
  title: 'Operation Symbols (x, ÷, =)', // Must match subtopic exactly if dynamic
  
  difficulties: {
    foundation: {
      name: 'Conceptual Basics',
      steps: 1,
      maxNumber: 100,
      logicDescription: "Identify basic definitions of 'x' (groups) and '÷' (sharing)."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 1,
      maxNumber: 100,
      logicDescription: "Determine missing symbols in equations and word problems."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 2,
      maxNumber: 100,
      logicDescription: "Balance complex equations with two missing symbols or inequalities."
    }
  },

  variants: {
    foundation_identify_multiply: "Match 'groups of' language to the 'x' symbol.",
    foundation_identify_divide: "Match 'sharing equally' language to the '÷' symbol.",
    foundation_missing_symbol_direct: "Fill in the missing symbol (x or ÷) in a basic equation.",

    standard_symbol_from_word_problem: "Identify the correct equation (with symbol) for a 1-step word problem.",
    standard_balance_missing_symbol: "Find the missing symbol on one side of a balanced equation.",
    standard_equals_meaning: "Determine if an equation is true or false based on the '=' sign.",

    advanced_two_missing_symbols: "Provide an equation with two missing symbols that must balance.",
    advanced_symbol_inequality: "Use < or > alongside operation symbols to balance an equation.",
    advanced_inverse_operations: "Write an equation using the inverse operation."
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 2';
    const topic = 'Whole Numbers - Multiplication and Division';
    const subtopic = 'Operation Symbols (x, ÷, =)';
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';
    
    const zodType = type;
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    
    const contextName = getRandomNames(1);
    const contextItem = getRandomLengthItems(1); 
    const context = { name: contextName, setting: "the store" };
    const selectedContextItem = contextItem;

    const getQText = (structureText, shortText) => {
      if (isStructure) return structureText;
      return shortText || structureText;
    };
    
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
    "questionText": "string (The full question text)",
    "options": ["string", "string", "string", "string"] (ONLY if MCQ, otherwise empty array),
    "defectMap": { "distractor1": "Error category", "distractor2": "Error category" } (ONLY if MCQ, otherwise empty object),
    "hint": "string (Pedagogical hint)",
    "solutionSteps": "string (Step-by-step model solution. ALWAYS format each step dynamically without relying on the UI to number it, e.g. 1. step one.\\n2. step two.\\n3. step three.)",
    "finalAnswer": "string (The exact final answer)"
  },
  "visualEngine": ${visualEngineStr}${inputRequirementStr ? `,\n  "inputRequirement": ${inputRequirementStr}` : ''}
}`;

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
