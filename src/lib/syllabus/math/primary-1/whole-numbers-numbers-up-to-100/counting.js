import { getRandomContext } from '@/lib/utils/localization';
import { numberToWords } from '@/lib/utils/math-helpers';
import { foundationLogic } from './counting/foundation';
import { standardLogic } from './counting/standard';
import { advancedLogic } from './counting/advanced';

/**
 * Blueprint for Primary 1: Counting to 100
 * ENGINE: Generates AI prompt constraints, leaving creative generation to the LLM.
 * ARCHITECTURE: Route strictly controls variation via the 'variant' argument.
 */

export const countingBlueprint = {
  id: 'p1-counting',
  title: 'Counting to 100',
  strand: 'Number and Algebra',
  visualType: 'DYNAMIC',

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
      logicDescription: "Counting on and counting back from a specific number."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 3,
      maxNumber: 100,
      logicDescription: "Advanced skip counting with offsets."
    }
  },

  // 2. STRICT VARIANTS (Controlled by Route)
  variants: {
    foundation_grouping: "Visual counting using groups of 10s and 1s.",
    foundation_visual_word_conversion: "Visual counting translated directly into English word format (e.g., counting 8 items and answering 'eight').",
    foundation_scattered: "Count a small random set of objects up to 20 without any grouping.",
    foundation_skip_count_visual: "Visually count items grouped evenly into sets of 2, 5, or 10.",
    foundation_count_on_visual: "Given one fully packed box of 10 and some loose items, count the total up to 20.",

    standard_count_on: "Counting on from a specific number to find a total.",
    standard_count_back: "Counting backward from a specific number.",
    standard_skip_count_forward_2s: "Skip counting forward strictly by 2s.",
    standard_skip_count_forward_5s: "Skip counting forward strictly by 5s.",
    standard_skip_count_forward_10s: "Skip counting forward strictly by 10s.",
    standard_skip_count_backward_2s: "Skip counting backward strictly by 2s.",
    standard_skip_count_backward_5s: "Skip counting backward strictly by 5s.",
    standard_skip_count_backward_10s: "Skip counting backward strictly by 10s.",
    standard_missing_sequence: "Fill in a missing number in a basic forward or backward sequence counting by 1s.",
    standard_before_after: "Identify the number that comes just before or just after a specific number.",

    advanced_skip_counting_offset: "Counting by 2s, 5s, or 10s starting from a non-standard offset (e.g. counting by 10s from 3).",
    advanced_skip_count_backward_offset: "Skip counting backward by 2s, 5s, or 10s from a non-standard offset.",
    advanced_missing_sequence_multiple: "Fill in two missing numbers in a sequence with a non-standard offset.",
    advanced_mixed_skip_counting: "Count forward by 10s then by 1s (e.g. 42, 52, 62, 63, 64).",
    advanced_complex_before_after: "Multi-step before/after logic (e.g., What is 5 more than the number just before 40?).",
    advanced_nth_term_skip_counting: "Find the Nth number when skip counting (e.g., Start at 12 and count by 5s. What is the 4th number you say?).",
    advanced_number_line_jumps: "A story of multiple different jumps on a number line (e.g., Frog jumps forward 10, backward 2).",
    advanced_hundreds_chart_logic: "Mental math mimicking a hundreds chart (e.g., What number is 2 rows down and 1 column right from 45?).",
    advanced_odd_even_sequence: "Skip counting specifically highlighting next consecutive odd or even numbers.",
    advanced_count_on_tens_ones: "Given a starting number, count on X tens and Y ones (e.g., Start at 34, count on 2 tens and 4 ones)."
  },

  // 3. GENERATION ENGINE
  generate: (difficulty = 'foundation', variant = 'foundation_grouping', type = 'MCQ') => {
    // --- 🛡️ SELF-HEALING PARAMETER POSITION ADAPTER ---
    const safeType = String(type).toLowerCase();
    const isShort = safeType.includes('short');
    const isStructure = safeType.includes('structure') || safeType.includes('structured');
    const isMCQ = safeType.includes('mcq');

    let finalDifficulty = difficulty;
    let finalVariant = variant;

    if (typeof difficulty === 'string' && difficulty.includes('_')) {
      finalVariant = difficulty;
      finalDifficulty = variant || 'standard';
    }

    let activeVariant = finalVariant;
    if (!countingBlueprint.variants[finalVariant]) {
      const validVariants = Object.keys(countingBlueprint.variants).filter(k => k.startsWith(finalDifficulty.toLowerCase()));
      if (validVariants.length > 0) {
        activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
      } else {
        activeVariant = 'foundation_grouping';
      }
    }

    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = finalDifficulty.charAt(0).toUpperCase() + finalDifficulty.slice(1);
    const level = 'Primary 1';
    const topic = 'Whole Numbers - Numbers up to 100';

    const getQText = (words, equation) => isShort ? equation : words;

    const levelNum = parseInt(level.replace('Primary ', ''));
    const tier = levelNum <= 2 ? 'LOWER_BLOCK' : (levelNum <= 4 ? 'MIDDLE_BLOCK' : 'UPPER_BLOCK');
    const context = getRandomContext('GENERAL', tier);

    // Use the variable bank extraction logic (compatible with ordinals refactor)
    const itemData = context.items[Math.floor(Math.random() * context.items.length)];
    const selectedContextItem = typeof itemData === 'object' ? (itemData.item || itemData.singular || itemData.name?.singular || (typeof itemData.name === 'string' ? itemData.name : null) || itemData.text || itemData.name?.text || itemData.val || String(itemData)) : itemData;

    const funIcons = ['⚽', '🏀', '⭐', '🚗', '🍎', '🥕', '🍪', '🍬', '🎈', '🧸', '🥟', '🍢', '🍡'];
    const selectedIcon = context.icon || funIcons[Math.floor(Math.random() * funIcons.length)];

    const hintProtocol = `\nCRITICAL HINT PROTOCOL: You MUST provide a "hint" field.
Forbidden: "The answer is 8," "Try 4+4."
Required: Ask a guiding question or point to a visual cue.
Example: "Try counting on from the bigger number. What comes after 7?" or "How many are in just one of the groups?"`;

    const visualProtocol = finalDifficulty === 'foundation'
      ? `\nSTRICT VISUAL PROTOCOL: For any layout rendering "componentData" icons, elements, or emojis, you MUST use the emoji: "${selectedIcon}". Do not select or substitute any other emoji.`
      : '';

    let formatInstructions = isMCQ
      ? `Format as MCQ. Include an "options" array with 4 choices. "finalAnswer" must exactly match one of the options.${hintProtocol}${visualProtocol}`
      : `Format as Short Answer. The "options" field in your JSON should be null. ${hintProtocol}${visualProtocol}`;

    // Counting questions should NEVER use equations in their solution/working.
    formatInstructions += `\nCRITICAL PEDAGOGICAL RULE: This is a pure counting question. DO NOT use ANY mathematical equations (e.g., 5+5+5=15) or repeated addition in your 'solutionSteps' or working. Describe the counting process purely in words (e.g. 'Count by 5s: 5, 10, 15').`;

    if (activeVariant.startsWith('foundation_')) {
      return foundationLogic(activeVariant, finalDifficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon);
    }

    if (activeVariant.startsWith('standard_')) {
      return standardLogic(activeVariant, finalDifficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText);
    }

    if (activeVariant.startsWith('advanced_')) {
      return advancedLogic(activeVariant, finalDifficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon);
    }

    throw new Error(`Variant '${variant}' (mapped to '${activeVariant}') not valid for difficulty '${difficulty}'`);
  }
};