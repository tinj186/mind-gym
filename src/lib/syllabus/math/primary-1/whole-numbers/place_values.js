/**
 * Blueprint for Primary 1: Place Values (Tens and Ones)
 * ENGINE: Generates AI prompt constraints, strictly pre-calculating math logic.
 * ARCHITECTURE: Pre-calculates distractors to prevent AI hallucinations.
 */
import { getRandomContext } from '@/lib/utils/localization';
import { foundationLogic } from './place-values/foundation';
import { standardLogic } from './place-values/standard';
import { advancedLogic } from './place-values/advanced';

export const placeValuesBlueprint = {
  id: 'p1-place-values',
  title: 'Place Value (Tens/Ones)',
  strand: 'Number and Algebra',
  visualType: null, // Null avoids triggering untested UI components

  // 1. OVERARCHING CONDITIONS
  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 100,
      logicDescription: "Direct identification of tens, ones, and digit values."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      maxNumber: 100,
      logicDescription: "Simple regrouping and partitioned equations (e.g., 45 = 40 + 5)."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 3,
      maxNumber: 100,
      logicDescription: "Complex regrouping and multi-clue digit puzzles."
    }
  },

  // 2. STRICT VARIANTS
  variants: {
    foundation_identify: "Identify how many tens and ones are in a given number.",
    foundation_value: "Identify the actual value of a specific digit.",
    foundation_compose: "Compose a 2-digit number from given tens and ones.",
    foundation_decompose_tens: "Identify the number of tens in a multiple of 10.",
    foundation_digit_position: "Identify which digit is in the tens or ones place.",

    standard_partition: "Find the missing part in a base-10 equation (e.g., 34 = 30 + ?).",
   standard_basic_regrouping: "Regroup excess ones into tens (e.g., 2 tens 14 ones).",
    standard_partition_tens: "Find the missing tens part in a base-10 equation (e.g., 45 = ? + 5).",
    standard_word_problem_groups: "Solve a word problem involving items grouped in tens and loose ones.",
    standard_compare_place_value: "Compare two numbers described in tens and ones to find the greater/smaller.",
    standard_add_tens_concept: "Add a specific number of tens to a 2-digit number.",
    standard_subtract_tens_concept: "Subtract a specific number of tens from a 2-digit number.",
    standard_digit_clue: "Identify a number based on simple relative clues for its digits.",
    standard_expanded_form: "Identify the correct expanded form of a 2-digit number.",
    standard_equivalent_ones: "Convert a multiple of ten entirely into ones (e.g., 5 tens = 50 ones).",

    advanced_extreme_regrouping: "Find missing tens when given an extreme amount of ones.",
    advanced_digit_clues: "Logic puzzle based on the sum and difference of the digits.",
    advanced_mystery_number_bounds: "Find a mystery number given a range and a relationship between its digits.",
    advanced_digit_swap: "Find the original number if swapping its tens and ones gives a specific result.",
    advanced_balance_equation: "Find the missing ones/tens to balance a place value equation.",
    advanced_consecutive_digits: "Identify a number based on consecutive digits and their sum.",
    advanced_same_digits: "Identify a number where both digits are the same, given a specific range limit.",
    advanced_value_deduction: "Find a number given the actual value of its tens digit and the sum of its digits.",
    advanced_missing_regrouped_tens: "Determine how many tens are needed to reach a target after regrouping ones.",
    advanced_extreme_ones_comparison: "Compare a standard 2-digit number with a number expressed entirely in ones."
  },

  // 3. GENERATION ENGINE
  generate: (difficulty = 'foundation', variant = 'foundation_identify', type = 'MCQ') => {
    
    const safeType = String(type).toLowerCase();
    const isShort = safeType.includes('short');
    const isStructure = safeType.includes('structure') || safeType.includes('structured');
    const isMCQ = safeType.includes('mcq');

    let activeVariant = variant;
    if (!placeValuesBlueprint.variants[variant]) {
      const validVariants = Object.keys(placeValuesBlueprint.variants).filter(k => k.startsWith(difficulty));
      if (validVariants.length > 0) {
        activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
      } else {
        activeVariant = 'foundation_identify'; 
      }
    }

    const config = placeValuesBlueprint.difficultyLevels[difficulty] || placeValuesBlueprint.difficultyLevels.foundation;
    const zodType = isMCQ ? 'MCQ' : isStructure ? 'STRUCTURED' : 'SHORT_QUESTION';
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    const level = 'Primary 1';
    const topic = 'Whole Numbers';

    const getQText = (words, equation) => isShort ? equation : words;
    const levelNum = parseInt(level.replace('Primary ', ''));
    const tier = levelNum <= 2 ? 'LOWER_BLOCK' : (levelNum <= 4 ? 'MIDDLE_BLOCK' : 'UPPER_BLOCK');
    const context = getRandomContext('GENERAL', tier);

    let formatInstructions = isMCQ 
      ? `Format as MCQ. Include an "options" array with 4 choices. "finalAnswer" must exactly match one of the options.` 
      : isStructure
        ? `Format as Structured Question. The "options" field in your JSON should be null. CRITICAL: For the "questionText" string, write a clear localized word problem.`
        : `Format as Short Answer. The "options" field in your JSON should be null.`;

    if (activeVariant.startsWith('foundation_')) {
      return foundationLogic(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
    }

    if (activeVariant.startsWith('standard_')) {
      return standardLogic(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
    }

    if (activeVariant.startsWith('advanced_')) {
      return advancedLogic(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
    }


    throw new Error(`Variant '${variant}' (mapped to '${activeVariant}') not valid for difficulty '${difficulty}'`);
  }
};