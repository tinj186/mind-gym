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

    //    advanced_greatest_from_digits: "Form the greatest 2-digit number using given digits.", // Renamed
    //    advanced_relative_logic: "Deduce the order of 3 amounts based on relative 'more than/less than' clues.",
    advanced_sequence_skip_counting: "Identify a missing number in a skip-counting pattern (by 2s, 5s, or 10s).",
    advanced_smallest_from_digits: "Form the smallest 2-digit number from given digits that is greater than a specific value.", // Renamed
    //    advanced_swapped_digits_difference: "Find the difference between a number and the number formed by swapping its digits.",
    //    advanced_logic_puzzle_order: "Order 3 characters based on relative abstract clues (e.g., A is less than B).",
    //    advanced_mystery_number_clues: "Deduce a mystery number using bounds and the sum of its digits.",
    //    advanced_extreme_inequality: "Identify the greatest number that is smaller than a complex regrouped expression.",
    //    advanced_net_value_comparison: "Determine the final value after a number undergoes a series of regrouped 'more than' and 'less than' changes (e.g., Start with 4 tens, add 15 ones, then take away 1 ten)."
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

    // Logic: Identify if this is a notation-only variant (no word problems/stories)
    const isNotationVariant = !activeVariant.includes('word') && !activeVariant.includes('clue') && !activeVariant.includes('logic');

    // Helper to dynamically strip English words for short questions
    const getQText = (words, equation) => (isShort || (isMCQ && isNotationVariant)) ? equation : words;

    // Localization Context (defined once, used in structured prompts)
    const levelNum = parseInt(level.replace('Primary ', ''));
    const tier = levelNum <= 2 ? 'LOWER_BLOCK' : (levelNum <= 4 ? 'MIDDLE_BLOCK' : 'UPPER_BLOCK');
    const context = getRandomContext('GENERAL', tier);
    const itemData = context.items[Math.floor(Math.random() * context.items.length)];

    // ROBUST EXTRACTION: Handle nested objects or direct singular/plural keys
    const selectedContextItem = typeof itemData === 'object'
      ? (itemData.item || itemData.singular || itemData.name?.singular || (typeof itemData.name === 'string' ? itemData.name : null) || itemData.text || itemData.name?.text || itemData.val || String(itemData))
      : itemData;

    if (String(selectedContextItem).includes('[object')) console.warn("⚠️ [Blueprint: Comparing] Context item extraction failed for:", itemData);

    const funIcons = ['⚽', '🏀', '⭐', '🚗', '🍎', '🥕', '🍪', '🍬', '🎈', '🧸', '🥟', '🍢', '🍡'];
    const selectedIcon = itemData?.icon || funIcons[Math.floor(Math.random() * funIcons.length)];

    let formatInstructions = '';
    const hintProtocol = `\nCRITICAL HINT PROTOCOL: You MUST provide a conceptual "hint" field.
Forbidden: "Choose 15," "It's the smallest one."
Required: Point to place value or relative clues.
Example: "Compare the tens place first. Which number has more tens?" or "If A is more than B, who is standing closer to the front?"`;

    const visualProtocol = `\nSTRICT VISUAL PROTOCOL: For the "visualItems" array and any "COMPARE_OBJECTS" icons, you MUST use the emoji: "${selectedIcon || '⭐'}". Do not pick any other emoji. DO NOT use emojis inside "NUMBER_CARDS" items.`;

    // Only provide creative instructions for actual stories/logic puzzles
    if (isStructure || (isMCQ && !isNotationVariant)) {
      formatInstructions = `CRITICAL: For the "questionText" string, write a clear localized word problem.${hintProtocol}${visualProtocol}`;
    } else {
      formatInstructions = `${hintProtocol}`;
    }

    // Pass calculated hideVisual to sub-modules
    // We hide visuals for notation questions in Short/MCQ modes because text is explicit
    const hideVisual = isNotationVariant && (isShort || isMCQ);

    if (activeVariant.startsWith('foundation_')) {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, hideVisual);
    }

    if (activeVariant.startsWith('standard_')) {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, hideVisual);
    }

    if (activeVariant.startsWith('advanced_')) {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, hideVisual);
    }

    throw new Error(`Variant '${variant}' not valid for difficulty '${difficulty}'`);
  }
};