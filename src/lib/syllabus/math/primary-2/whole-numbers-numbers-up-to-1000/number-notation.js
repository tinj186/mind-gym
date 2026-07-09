import { foundationLogic } from './number-notation/foundation';
import { standardLogic } from './number-notation/standard';
import { advancedLogic } from './number-notation/advanced';

export const numberNotationBlueprint = {
  id: 'p2-number-notation',
  title: 'Number Notation',
  strand: 'Number and Algebra',
  visualType: 'NONE',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 1000,
      logicDescription: "Convert simple numbers to words."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 1,
      maxNumber: 1000,
      logicDescription: "Convert words to numbers."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 1,
      maxNumber: 1000,
      logicDescription: "Identify incorrect notation."
    }
  },

  variants: {
    foundation_to_words: "Write numeral in words.",
    standard_to_numeral: "Write words in numerals.",
    advanced_identify_error: "Find the error in number notation."
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 2';
    const topic = 'Whole Numbers - Numbers up to 1000';
    const subtopic = 'Number Notation';
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
