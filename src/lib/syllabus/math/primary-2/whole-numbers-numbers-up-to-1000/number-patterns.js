import { foundationLogic } from './number-patterns/foundation';
import { standardLogic } from './number-patterns/standard';
import { advancedLogic } from './number-patterns/advanced';

export const numberPatternsBlueprint = {
  id: 'p2-number-patterns',
  title: 'Number Patterns',
  strand: 'Number and Algebra',
  visualType: 'NUMBER_PATTERN',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 1000,
      logicDescription: "Identify missing number in a sequence jumping by 10s or 100s."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      maxNumber: 1000,
      logicDescription: "Identify missing numbers in a sequence with crossing boundaries."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 3,
      maxNumber: 1000,
      logicDescription: "Find a missing term in a multi-step alternating pattern."
    }
  },

  variants: {
    foundation_simple_jump: "Missing number in simple +10 or +100 pattern.",
    standard_cross_boundary: "Missing number in pattern that crosses 100s boundary.",
    advanced_alternating: "Missing number in an alternating pattern (+10, -5)."
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 2';
    const topic = 'Whole Numbers - Numbers up to 1000';
    const subtopic = 'Number Patterns';
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';

    const zodType = type;
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    
    const context = { name: "Student", setting: "class" };
    const selectedContextItem = "numbers";
    const formatInstructions = "OUTPUT FORMAT (Return ONLY valid JSON matching this schema):";
    
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
