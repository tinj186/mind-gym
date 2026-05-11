/**
 * Blueprint for Primary 1: Comparing and Ordering
 * ENGINE: Generates AI prompt constraints, strictly pre-calculating math logic.
 * ARCHITECTURE: Pre-calculates sort orders and distractors to prevent AI hallucinations.
 */

import { getRandomContext } from '@/lib/utils/localization';
import { foundationLogic } from './comparing-ordering/foundation';
import { standardLogic } from './comparing-ordering/standard';
import { advancedLogic } from './comparing-ordering/advanced';

export const comparingOrderingBlueprint = {
  id: 'p1-comparing-ordering',
  title: 'Comparing and Ordering',
  strand: 'Number and Algebra', 
  visualType: 'DYNAMIC', // Null avoids triggering untested UI components

  // 1. OVERARCHING CONDITIONS
  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 100,
      logicDescription: "Direct comparison of 2 numbers or identifying the greatest/smallest in a set of 3."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      maxNumber: 100,
      logicDescription: "Ordering sets of 4 numbers ascending/descending, and bounded comparisons."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 3,
      maxNumber: 100,
      logicDescription: "Comparing complex regrouped expressions and forming greatest/smallest numbers from digits."
    }
  },

  // 2. STRICT VARIANTS
  variants: {
    foundation_compare_two: "Identify the greater or smaller of two 2-digit numbers.",
    foundation_greatest_three: "Identify the greatest number from a set of 3.",
    foundation_smallest_three: "Identify the smallest number from a set of 3.",
    foundation_next_number: "Identify the number that comes just after a given number.",
    foundation_before_number: "Identify the number that comes just before a given number.", // Kept as is

    standard_ordering_asc: "Order 4 numbers from smallest to greatest.", // Renamed
    standard_ordering_desc: "Order 4 numbers from greatest to smallest.", // Renamed
    standard_between_bounds: "Identify a number that falls between two given bounds.", // Renamed
    standard_clue_comparison: "Solve a simple word problem comparing 3 quantities.", // Renamed
    standard_missing_seq_asc: "Identify a missing number in a +1 ascending sequence.",
    standard_missing_seq_desc: "Identify a missing number in a -1 descending sequence.",
    standard_greatest_four: "Identify the greatest number from a set of 4.",
    standard_smallest_four: "Identify the smallest number from a set of 4.",
    standard_ten_more_compare: "Compare '10 more than X' with another number.",
    standard_ten_less_compare: "Compare '10 less than X' with another number.",

    advanced_greatest_from_digits: "Form the greatest 2-digit number using given digits.", // Renamed
    advanced_relative_logic: "Deduce the order of 3 amounts based on relative 'more than/less than' clues.",
    advanced_sequence_skip_counting: "Identify a missing number in a skip-counting pattern (by 2s, 5s, or 10s).",
    advanced_smallest_from_digits: "Form the smallest 2-digit number from given digits that is greater than a specific value.", // Renamed
    advanced_swapped_digits_difference: "Find the difference between a number and the number formed by swapping its digits.",
    advanced_logic_puzzle_order: "Order 3 characters based on relative abstract clues (e.g., A is less than B).",
    advanced_mystery_number_clues: "Deduce a mystery number using bounds and the sum of its digits.",
    advanced_extreme_inequality: "Identify the greatest number that is smaller than a complex regrouped expression.",
    advanced_net_value_comparison: "Determine the final value after a number undergoes a series of regrouped 'more than' and 'less than' changes (e.g., Start with 4 tens, add 15 ones, then take away 1 ten)."
  },

  // 3. GENERATION ENGINE
  generate: (difficulty = 'foundation', variant = 'foundation_compare_two', type = 'MCQ') => {
    
    const safeType = String(type).toLowerCase();
    const isShort = safeType.includes('short');
    const isStructure = safeType.includes('structure') || safeType.includes('structured');
    const isMCQ = safeType.includes('mcq');
    let activeVariant = variant;

    // 1. Variant Filtering based on Type
    const violatesShort = isShort && activeVariant && (activeVariant.includes('word') || activeVariant.includes('clue') || activeVariant.includes('logic'));
    const violatesStructure = isStructure && activeVariant && (!activeVariant.includes('word') && !activeVariant.includes('clue') && !activeVariant.includes('logic'));

    if (!comparingOrderingBlueprint.variants[variant] || violatesShort || violatesStructure) {
      const safeDiff = String(difficulty).toLowerCase();
      let validVariants = Object.keys(comparingOrderingBlueprint.variants).filter(k => k.startsWith(safeDiff));
      
      if (isShort) {
        // Short questions: ONLY notation-based comparisons
        validVariants = validVariants.filter(k => !k.includes('word') && !k.includes('clue') && !k.includes('logic'));
      } else if (isStructure) {
        // Structured: ONLY stories/logic puzzles
        validVariants = validVariants.filter(k => k.includes('word') || k.includes('clue') || k.includes('logic'));
      }

      if (validVariants.length > 0) {
        activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
      } else {
        activeVariant = 'foundation_compare_two'; 
      }
    }
    // Prepare Zod Schema Meta
    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    const level = 'Primary 1';
    const topic = 'Whole Numbers';

    // Helper to dynamically strip English words for short questions
    const getQText = (words, equation) => isShort ? equation : words;

    let formatInstructions = '';
    // Only provide creative instructions for structured word problems
    if (isStructure) {
      formatInstructions = `CRITICAL: For the "questionText" string, write a clear localized word problem.`;
    }

    // Localization Context (defined once, used in structured prompts)
    const levelNum = parseInt(level.replace('Primary ', ''));
    const tier = levelNum <= 2 ? 'LOWER_BLOCK' : (levelNum <= 4 ? 'MIDDLE_BLOCK' : 'UPPER_BLOCK');
    const context = getRandomContext('GENERAL', tier); // Comparing and Ordering can use general items
    const selectedContextItem = context.items[Math.floor(Math.random() * context.items.length)];
    // Dynamic visual item selection for diagrams (concrete objects) - not directly used in current logic, but good to pass
    const funIcons = ['⚽', '🏀', '⭐', '🚗', '🍎', '🥕', '🍪', '🍬', '🎈', '🧸', '🥟', '🍢', '🍡'];
    const selectedIcon = funIcons[Math.floor(Math.random() * funIcons.length)];
    
    // Enable visuals for all question types in Comparing and Ordering to ensure consistent rendering between MCQ and Short Questions
    const hideVisual = false; 

    if (activeVariant.startsWith('foundation_')) {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, hideVisual); // formatInstructions will be empty string for non-word problems
    }

    if (activeVariant.startsWith('standard_')) {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, hideVisual); // formatInstructions will be empty string for non-word problems, or creative for word problems
    }

    if (activeVariant.startsWith('advanced_')) {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, hideVisual); // formatInstructions will be empty string for non-word problems, or creative for word problems
    }

    throw new Error(`Variant '${variant}' not valid for difficulty '${difficulty}'`);
  }
};