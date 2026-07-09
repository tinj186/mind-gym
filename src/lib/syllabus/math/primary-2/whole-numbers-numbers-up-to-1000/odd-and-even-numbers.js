import { foundationLogic } from './odd-and-even-numbers/foundation';
import { standardLogic } from './odd-and-even-numbers/standard';
import { advancedLogic } from './odd-and-even-numbers/advanced';

export const oddAndEvenNumbersBlueprint = {
  id: 'p2-odd-even-numbers',
  title: 'Odd and Even Numbers',
  strand: 'Number and Algebra',
  visualType: 'NONE',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 1000,
      logicDescription: "Identify if a given 2-digit or 3-digit number is odd or even."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 1,
      maxNumber: 1000,
      logicDescription: "Select the odd or even number from a list of options."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 2,
      maxNumber: 1000,
      logicDescription: "Find the next odd or even number in a sequence or after a given number."
    }
  },

  variants: {
    foundation_identify: "Is the number odd or even?",
    standard_select_from_list: "Which of these numbers is odd/even?",
    advanced_next_odd_even: "What is the next odd/even number after X?"
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 2';
    const topic = 'Whole Numbers - Numbers up to 1000';
    const subtopic = 'Odd and Even Numbers';
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
