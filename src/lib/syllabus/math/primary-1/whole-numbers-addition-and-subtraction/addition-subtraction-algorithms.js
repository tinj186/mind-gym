import { foundationLogic } from './addition-subtraction-algorithms/foundation.js';
import { standardLogic } from './addition-subtraction-algorithms/standard.js';
import { advancedLogic } from './addition-subtraction-algorithms/advanced.js';

export const additionSubtractionAlgorithmsBlueprint = {
  id: 'p1-addition-subtraction-algorithms',
  difficultyLevels: {
    foundation: {
      name: 'Algorithm Basics',
      steps: 1,
      logicDescription: "Adding and subtracting using algorithms without regrouping."
    },
    standard: {
      name: 'Algorithm Mastery',
      steps: 2,
      logicDescription: "Adding and subtracting using algorithms with regrouping."
    },
    advanced: {
      name: 'Algorithm Puzzles',
      steps: 3,
      logicDescription: "Finding missing digits in algorithms."
    }
  },
  variants: {
    foundation_algo_add_2digit_1digit_no_regroup: "Vertical addition of a 2-digit and 1-digit number without regrouping.",
    foundation_algo_add_2digit_2digit_no_regroup: "Vertical addition of two 2-digit numbers without regrouping.",
    foundation_algo_sub_2digit_1digit_no_regroup: "Vertical subtraction of a 1-digit from a 2-digit number without regrouping.",
    foundation_algo_sub_2digit_2digit_no_regroup: "Vertical subtraction of two 2-digit numbers without regrouping.",
    foundation_algo_add_tens: "Vertical addition of two tens numbers.",
    
    standard_algo_add_2digit_1digit_regroup: "Vertical addition of a 2-digit and 1-digit number with regrouping.",
    standard_algo_add_2digit_2digit_regroup: "Vertical addition of two 2-digit numbers with regrouping.",
    standard_algo_sub_2digit_1digit_regroup: "Vertical subtraction of a 1-digit from a 2-digit number with regrouping.",
    standard_algo_sub_2digit_2digit_regroup: "Vertical subtraction of two 2-digit numbers with regrouping.",
    standard_algo_sub_from_tens: "Vertical subtraction of a 2-digit number from a multiple of 10.",
    
    advanced_algo_missing_addend_digit: "Vertical addition with a missing digit in one of the addends.",
    advanced_algo_missing_sum_digit: "Vertical addition with a missing digit in the sum.",
    advanced_algo_missing_minuend_digit: "Vertical subtraction with a missing digit in the minuend.",
    advanced_algo_missing_subtrahend_digit: "Vertical subtraction with a missing digit in the subtrahend.",
    advanced_algo_missing_mixed: "Vertical addition or subtraction with multiple missing digits."
  },
  generate: (difficulty = 'foundation', variant = 'foundation_algo_add_2digit_1digit_no_regroup', type = 'MCQ') => {
    const safeType = String(type).toLowerCase();
    const isShort = safeType.includes('short');
    const isStructure = safeType.includes('structure') || safeType.includes('structured');
    const isMCQ = safeType.includes('mcq');

    const level = 'Primary 1';
    const topic = 'Whole Numbers - Addition and Subtraction';

    const zodType = type === 'Short Question' ? 'SHORT_QUESTION' : type.toUpperCase();
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
