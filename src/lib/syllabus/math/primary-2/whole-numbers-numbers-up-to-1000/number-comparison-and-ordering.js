import { foundationLogic } from './number-comparison-and-ordering/foundation';
import { standardLogic } from './number-comparison-and-ordering/standard';
import { advancedLogic } from './number-comparison-and-ordering/advanced';

export const numberComparisonAndOrderingBlueprint = {
  id: 'p2-number-comparison-ordering',
  title: 'Number Comparison and Ordering',
  strand: 'Number and Algebra',
  visualType: 'NUMBER_CARDS',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 1000,
      logicDescription: "Compare two numbers and state which is greater or smaller."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      maxNumber: 1000,
      logicDescription: "Compare and arrange up to four numbers in order."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 3,
      maxNumber: 1000,
      logicDescription: "Determine the greatest or smallest number that can be formed using 3 given digits."
    }
  },

  variants: {
    foundation_compare: "Which number is greater/smaller?",
    standard_order: "Arrange the numbers in order, starting with the smallest/greatest.",
    advanced_form_digits: "Form the greatest/smallest 3-digit number using the given cards."
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 2';
    const topic = 'Whole Numbers - Numbers up to 1000';
    const subtopic = 'Number Comparison and Ordering';
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';

    const zodType = type;
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    
    const context = { name: "Student", setting: "class" };
    const selectedContextItem = "cards";
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
