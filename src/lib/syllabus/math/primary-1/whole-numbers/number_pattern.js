/**
 * Blueprint for Primary 1: Number Patterns
 * ENGINE: Generates AI prompt constraints, strictly pre-calculating math logic.
 * ARCHITECTURE: Pre-calculates sequences and distractors to prevent AI hallucinations.
 */
import { getRandomContext } from '@/lib/utils/localization';
import { foundationLogic } from './number-patterns/foundation';
import { standardLogic } from './number-patterns/standard';
import { advancedLogic } from './number-patterns/advanced';

export const numberPatternBlueprint = {
  id: 'p1-number-pattern',
  title: 'Number Patterns',
  strand: 'Number and Algebra',
  visualType: 'NUMBER_PATTERN',

  // 1. OVERARCHING CONDITIONS
  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 100,
      logicDescription: "Find the next number in simple +1 or -1 sequences."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      maxNumber: 100,
      logicDescription: "Find missing middle numbers in +2, -2, +5, and +10 sequences."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 3,
      maxNumber: 100,
      logicDescription: "Find the starting number (working backwards) in skip-counting patterns."
    }
  },

  // 2. STRICT VARIANTS
  variants: {
    //    foundation_forward_1: "Find the next number in a +1 pattern.",
    //    foundation_backward_1: "Find the next number in a -1 pattern.",
    foundation_missing_middle_1: "Find the missing middle number in a +1 pattern.",
    foundation_missing_middle_back_1: "Find the missing middle number in a -1 pattern.",
    foundation_missing_start_1: "Find the missing starting number in a +1 pattern.",

    'standard_missing_start+': "Find the missing starting number in a +X pattern. x can be 2 - 10",
    'standard_missing_start-': "Find the missing starting number in a -X pattern. x can be 2 - 10",
    'standard_missing_second+': "Find the missing second number in a +X pattern. x can be 2 - 10",
    'standard_missing_second-': "Find the missing second number in a -X pattern. x can be 2 - 10",
    'standard_missing_middle+': "Find the missing middle number in a +X pattern. x can be 2 - 10",
    'standard_missing_middle-': "Find the missing middle number in a -X pattern. x can be 2 - 10",
    'standard_missing_fourth+': "Find the missing fourth number in a +X pattern. x can be 2 - 10",
    'standard_missing_fourth-': "Find the missing fourth number in a -X pattern. x can be 2 - 10",
    'standard_missing_last+': "Find the missing last number in a +X pattern. x can be 2 - 10",
    'standard_missing_last-': "Find the missing last number in a -X pattern. x can be 2 - 10",

    advanced_growing_pattern: "Identify the next number in a growing pattern (+1, +2, +3...).",
    advanced_interleaved_series: "Identify the missing number in two alternating interleaved patterns.",
    advanced_shrinking_pattern: "Identify the next number in a shrinking pattern (-1, -2, -3...).",
    advanced_double_digit_step: "Identify the missing number in a pattern with double-digit steps (+11 or +12).",
    advanced_big_jump_alternating: "Identify the missing number in an alternating pattern with large jumps (+20, -5).",
    advanced_alt_plus_minus: "Find a missing number in a two-step alternating pattern (+3, -1).",
    advanced_alt_plus_plus: "Find a missing middle number in a dual-jump alternating pattern (+10, +2).",
    advanced_alt_missing_start: "Work backwards to find the first number in an alternating pattern (+5, -2).",
    advanced_alternating_rule: "Identify the missing number in an alternating (e.g., +5, -2) pattern."
  },

  // 3. GENERATION ENGINE
  generate: (difficulty = 'foundation', variant = 'foundation_forward_1', type = 'MCQ') => {

    // --- BULLETPROOF AUTO-RANDOMIZER ---
    const safeType = String(type).toLowerCase();
    const isShort = safeType.includes('short');
    const isStructure = safeType.includes('structure') || safeType.includes('structured');
    const isMCQ = safeType.includes('mcq');

    let activeVariant = variant;
    // 1. Variant Filtering based on Type
    const violatesShort = isShort && activeVariant && (activeVariant.includes('word_problem') || activeVariant.includes('interactive'));
    const violatesStructure = isStructure && activeVariant && (activeVariant.includes('word_problem') || activeVariant.includes('interactive')); // Number patterns typically don't have structured word problems

    if (!numberPatternBlueprint.variants[variant] || violatesShort || violatesStructure) {
      const safeDiff = String(difficulty).toLowerCase();
      let validVariants = Object.keys(numberPatternBlueprint.variants).filter(k => k.startsWith(safeDiff));

      if (isShort) {
        validVariants = validVariants.filter(k => !k.includes('word_problem') && !k.includes('interactive')); // Exclude word problems/interactive for short
      } else if (isStructure) {
        validVariants = validVariants.filter(k => k.includes('word_problem') || k.includes('interactive')); // Include only word problems/interactive for structured
      }

      if (validVariants.length > 0) {
        activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
      } else {
        activeVariant = 'foundation_forward_1'; // Fallback
      }
    }

    // Prepare Zod Schema Meta
    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    const level = 'Primary 1';
    const topic = 'Whole Numbers';

    // Helper to dynamically strip English words for short questions
    const getQText = (words, equation) => isShort ? equation : words;

    const hintProtocol = `\nCRITICAL HINT PROTOCOL: You MUST provide a "hint" field in your JSON.
    Forbidden: "The answer is 12."
    Required: Ask a guiding question.
    Example: "Look at the difference between the first two numbers." or "Are the numbers getting bigger or smaller?"`;

    let formatInstructions = isMCQ
      ? `Format as MCQ. Include an "options" array with 4 choices. "finalAnswer" must exactly match one of the options.${hintProtocol}`
      : `Format as Short Answer. The "options" field in your JSON should be null.${hintProtocol}`;

    const context = getRandomContext('GENERAL'); // Not heavily used in number patterns, but passed for consistency
    const selectedContextItem = context.items[Math.floor(Math.random() * context.items.length)];
    const selectedIcon = '🔢'; // Generic icon for number patterns

    if (activeVariant.startsWith('foundation_')) {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon);
    }

    if (activeVariant.startsWith('standard_')) {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon);
    }

    if (activeVariant.startsWith('advanced_')) {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon);
    }

    throw new Error(`Variant '${variant}' not valid for difficulty '${difficulty}'`);
  }
};