import { getRandomContext } from '@/lib/utils/localization';
import { numberToWords } from '@/lib/utils/math-helpers'; // Import from new helper file
import { foundationLogic } from './counting/foundation'; // Import the new foundationLogic function
import { standardLogic } from './counting/standard'; // Import the new standardLogic function
import { advancedLogic } from './counting/advanced'; // Import the new advancedLogic function

/**
 * Blueprint for Primary 1: Counting to 100
 * Blueprint for Primary 1: Numbers to 100 (Counting, Comparing, Patterns)
 * ENGINE: Generates AI prompt constraints, leaving creative generation to the LLM.
 * ARCHITECTURE: Route strictly controls variation via the 'variant' argument.
 */

export const countingBlueprint = {
  id: 'p1-counting',
  title: 'Counting to 100',
  strand: 'Number and Algebra', // Retain strand as it's a core curriculum identifier
  visualType: 'COUNTING_OBJECTS',
  
  // 1. OVERARCHING CONDITIONS (Logical Constraints)
  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 100,
      logicDescription: "Direct counting and grouping tens/ones."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      maxNumber: 100,
      logicDescription: "Counting on and identifying place value digits."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 3,
      maxNumber: 100,
      logicDescription: "Place value regrouping and multi-condition number clues."
    }
  },

  // 2. STRICT VARIANTS (Controlled by Route)
  variants: {
    foundation_grouping: "Visual counting using groups of 10s and 1s.",
    foundation_sequence: "Simple forward or backward number sequence.",

    standard_count_on: "Counting on from a specific number to find a total.",
    standard_tens_ones: "Identifying the number of tens and ones in a 2-digit number.",
    standard_count_back: "Counting backward from a specific number.",
    standard_10_more: "Finding 1 to 10 more than a given 2-digit number.",
    standard_10_less: "Finding 1 to 10 less than a given 2-digit number.",
    standard_compose_base_10: "Composing a number from given tens and ones.",
    standard_decompose_tens: "Finding the missing tens digit when ones are given.",
    standard_decompose_ones: "Finding the missing ones digit when tens are given.",
    standard_word_to_numeral: "Converting a number word into a numeral.",
    standard_numeral_to_word: "Converting a numeral into a number word.",

    advanced_regrouping: "Place value trick questions (e.g., 2 tens and 15 ones).",
    advanced_clues: "Mental logic puzzle to identify a mystery number.",
    advanced_extreme_regrouping: "Place value puzzle with heavily unbalanced tens and ones.",
    advanced_digit_sum: "Number puzzle based on a specific tens digit and the sum of its digits.",
    advanced_digit_difference: "Number puzzle based on the difference between tens and ones digits.",
    advanced_comparison_puzzle: "Mystery number bound by greater than / smaller than conditions.",
    advanced_word_problem_10s_1s: "Real-world word problem requiring grouping tens and excess ones.",
    advanced_value_of_digit: "Identifying the actual value of a specific digit in a 2-digit number.",
    advanced_sequence_logic: "Mental math involving multiple skip-count jumps from a starting number.",
    advanced_two_step_sequence: "Finding a missing number deeper into a skip-counting sequence."
  },

  // 3. GENERATION ENGINE
  generate: (difficulty = 'foundation', variant = 'foundation_grouping', type = 'MCQ') => {
    
    // --- LEGACY ADAPTER & AUTO-RANDOMIZER ---
    const safeType = String(type).toLowerCase();
    const isShort = safeType.includes('short');
    const isStructure = safeType.includes('structure') || safeType.includes('structured');
    const isMCQ = safeType.includes('mcq');
    let activeVariant = variant;
    if (!countingBlueprint.variants[variant]) {
      const validVariants = Object.keys(countingBlueprint.variants).filter(k => k.startsWith(difficulty));
      if (validVariants.length > 0) {
        activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
      } else {
        activeVariant = 'foundation_grouping'; 
      }
    }
    // ----------------------------------------

    // Prepare Zod Schema Meta
    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    const level = 'Primary 1';
    const topic = 'Whole Numbers';

    // Helper to dynamically strip English words for short questions
    const getQText = (words, equation) => isShort ? equation : words;

    let formatInstructions = '';
    // Localization Context (defined once, used in structured prompts)
    const levelNum = parseInt(level.replace('Primary ', ''));
    const tier = levelNum <= 2 ? 'LOWER_BLOCK' : (levelNum <= 4 ? 'MIDDLE_BLOCK' : 'UPPER_BLOCK');
    const context = getRandomContext('GENERAL', tier); // Counting typically uses general items
    const itemData = context.items[Math.floor(Math.random() * context.items.length)];

    // ROBUST EXTRACTION: Handle nested objects (e.g. { name: { singular: '...' } }) or direct keys
    const selectedContextItem = typeof itemData === 'object' 
      ? (itemData.item || itemData.singular || itemData.name?.singular || (typeof itemData.name === 'string' ? itemData.name : null) || itemData.text || itemData.name?.text || itemData.val || String(itemData)) 
      : itemData;

    if (String(selectedContextItem).includes('[object')) console.warn("⚠️ [Blueprint] Context item extraction failed for:", itemData);

    // Dynamic visual item selection for diagrams (concrete objects)
    const funIcons = ['⚽', '🏀', '⭐', '🚗', '🍎', '🥕', '🍪', '🍬', '🎈', '🧸', '🥟', '🍢', '🍡'];
    const selectedIcon = itemData?.icon || funIcons[Math.floor(Math.random() * funIcons.length)];


    const hintProtocol = `\nCRITICAL HINT PROTOCOL: You MUST provide a "hint" field.
Forbidden: "The answer is 8," "Try 4+4."
Required: Ask a guiding question or point to a visual cue.
Example: "Try counting on from the bigger number. What comes after 7?" or "How many are in just one of the groups?"`;

    const visualProtocol = `\nSTRICT VISUAL PROTOCOL: For the "visualItems" array and any "modelData" icons, you MUST use the emoji: "${selectedIcon}". Do not pick any other emoji.`;

    if (isMCQ) {
      formatInstructions = `Format as MCQ. Include an "options" array with 4 choices. "finalAnswer" must exactly match one of the options.${hintProtocol}${visualProtocol}`;
    } else if (isShort) {
      formatInstructions = `Format as Short Answer. The "options" field in your JSON should be null.${hintProtocol}${visualProtocol}`;
    } else {
      formatInstructions = `Format as Structured Question. The "options" field in your JSON should be null. CRITICAL: For the "questionText" string, write a clear localized word problem.${hintProtocol}${visualProtocol}`;
    }
    
    // ==========================================
    // FOUNDATION LEVEL
    // ==========================================

    if (activeVariant.startsWith('foundation_')) {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon);
    }

    if (activeVariant.startsWith('standard_')) {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon);
    }

    if (activeVariant.startsWith('advanced_')) {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon);
    }

    throw new Error(`Variant '${variant}' (mapped to '${activeVariant}') not valid for difficulty '${difficulty}'`);
  }
};