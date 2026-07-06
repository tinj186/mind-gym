import { foundationLogic } from './mental-calculation-addition-subtraction/foundation.js';
import { standardLogic } from './mental-calculation-addition-subtraction/standard.js';
import { advancedLogic } from './mental-calculation-addition-subtraction/advanced.js';

export const mentalCalculationAdditionSubtractionBlueprint = {
  id: 'p1-mental-calculation-addition-subtraction',
  difficultyLevels: {
    foundation: {
      name: 'Mental Math Basics',
      steps: 1,
      logicDescription: "Adding and subtracting basic numbers mentally."
    },
    standard: {
      name: 'Mental Math Mastery',
      steps: 2,
      logicDescription: "Mental calculation involving multiples of 10 and regrouping strategies."
    },
    advanced: {
      name: 'Mental Math Puzzles',
      steps: 3,
      logicDescription: "Mental calculation word problems or multi-step logic."
    }
  },
  variants: {
    foundation_mental_add_within_10: "Mental addition of two 1-digit numbers within 10.",
    foundation_mental_add_within_20: "Mental addition of two 1-digit numbers within 20.",
    foundation_mental_sub_within_10: "Mental subtraction within 10.",
    foundation_mental_sub_within_20: "Mental subtraction within 20 (no regrouping).",
    foundation_mental_add_tens: "Mental addition of two multiples of 10.",
    
    standard_mental_add_2digit_1digit_regroup: "Mental addition of a 2-digit and 1-digit number with regrouping.",
    standard_mental_sub_2digit_1digit_regroup: "Mental subtraction of a 1-digit from a 2-digit number with regrouping.",
    standard_mental_add_2digit_tens: "Mental addition of a 2-digit number and a multiple of 10.",
    standard_mental_sub_2digit_tens: "Mental subtraction of a multiple of 10 from a 2-digit number.",
    standard_mental_add_near_tens: "Mental addition using near tens compensation (e.g., +9).",
    
    advanced_mental_sub_near_tens: "Mental subtraction using compensation (e.g., -9 is -10 + 1).",
    advanced_mental_add_3_numbers: "Mentally adding three 1-digit numbers by finding a pair that makes 10.",
    advanced_mental_missing_addend: "Mental missing addend (e.g., 15 + ? = 22).",
    advanced_mental_missing_subtrahend: "Mental missing subtrahend (e.g., 24 - ? = 16).",
    advanced_mental_word_problem: "Simple mental math word problem requiring one step."
  },
  generate: (difficulty = 'foundation', variant = 'foundation_mental_add_within_10', type = 'MCQ') => {
    const safeType = String(type).toLowerCase();
    const isShort = safeType.includes('short');
    const isStructure = safeType.includes('structure') || safeType.includes('structured');
    const isMCQ = safeType.includes('mcq');

    const level = 'Primary 1';
    const topic = 'Whole Numbers - Addition and Subtraction';

    const zodType = type;
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const getQText = (structureText, shortText) => {
      if (isStructure) return structureText;
      return shortText || structureText;
    };

    const formatInstructions = "OUTPUT FORMAT (Return ONLY valid JSON matching this schema):";
    const safeDiff = String(difficulty).toLowerCase();

    if (safeDiff === 'foundation') return foundationLogic(variant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, getQText);
    if (safeDiff === 'standard') return standardLogic(variant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, getQText);
    if (safeDiff === 'advanced') return advancedLogic(variant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, getQText);

    return foundationLogic(variant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, getQText);
  }
};
