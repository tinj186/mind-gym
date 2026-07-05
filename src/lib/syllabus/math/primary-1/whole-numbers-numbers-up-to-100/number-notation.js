import { getRandomContext } from '@/lib/utils/localization';
import { foundationLogic } from './number-notation/foundation';
import { standardLogic } from './number-notation/standard';
import { advancedLogic } from './number-notation/advanced';

export const numberNotationBlueprint = {
  id: 'p1-number-notation',

  // 1. DIFFICULTY LEVELS (Database Defaults)
  levels: {
    foundation: {
      name: 'Direct Application',
      steps: 1,
      maxNumber: 100,
      logicDescription: "Direct translation between numerals and words up to 100.",
      logic: 'Direct Numeral/Word Translation'
    },
    standard: {
      name: 'Multi-step Logic',
      steps: 2,
      maxNumber: 100,
      logicDescription: "Multi-step logic bridging notation with place value and basic number sense.",
      logic: 'Place Value synthesis, +/-1 bound logic, visual grouping'
    },
    advanced: {
      name: 'Complex Reasoning',
      steps: 3,
      maxNumber: 100,
      logicDescription: "Multi-step reasoning and puzzle-based notation.",
      logic: 'Puzzle deduction, sequence bounds, or math expressions to word'
    }
  },

  // 2. STRICT VARIANTS
  variants: {
    // Foundation
    foundation_numeral_to_word: "Direct translation of a numeral to its word form.",
    foundation_word_to_numeral: "Direct translation of a word to its numeral form.",
    foundation_fill_blank_word: "Provide a partial word and ask the student to complete it.",
    foundation_identify_correct_word: "Identify the correctly spelled word for a given numeral.",
    foundation_identify_correct_numeral: "Identify the correct numeral for a given word.",

    // Standard
    standard_match_multiple_pairs_correct: "Given multiple numeral-word equations, identify the ONLY correct pair.",
    standard_match_multiple_pairs_incorrect: "Given multiple numeral-word equations, identify the ONLY incorrect pair.",
    standard_place_value_to_word: "Bridge Place Value with Notation (e.g. Write 5 tens 2 ones in words).",
    standard_word_to_place_value: "Identify a digit in a specific place value given a word.",
    standard_word_value_identification: "Identify a word based on a digit property (e.g. 0 in ones place).",
    standard_number_clue_to_word: "Simple +1/-1 logic to word (e.g. one more than 49).",
    standard_number_clue_to_numeral: "Simple +1/-1 logic from word (e.g. one less than 'eighty').",
    standard_spell_greatest_two_digit: "Conceptual knowledge to word (e.g. greatest 2-digit number).",
    standard_spell_smallest_two_digit: "Conceptual knowledge to word (e.g. smallest 2-digit number).",
    standard_count_between_words: "Write the number that comes exactly between two words in numerals.",

    // Advanced
    advanced_riddle_two_clues_to_word: "Deduce a number from 2 clues (e.g. tens digit is 4, ones is 2 more).",
    advanced_riddle_sum_of_digits: "Deduce a number using digit sums.",
    advanced_regrouping_place_value: "Translate un-grouped place values (e.g. 3 tens and 14 ones).",
    advanced_number_pattern_next_word: "Find the next number in a sequence and spell it.",
    advanced_arithmetic_sum_to_word: "Combine addition with notation.",
    advanced_arithmetic_diff_to_word: "Combine subtraction with notation.",
    advanced_compare_spelling_greater: "Evaluate two words and spell the greater one.",
    advanced_compare_spelling_smaller: "Evaluate two words and spell the smaller one.",
    advanced_spell_between_bounds: "Deduce a number from inequality bounds.",
    advanced_reverse_digits_to_word: "Manipulate digits before spelling."
  },

  // 3. GENERATION ENGINE
  generate: (difficulty = 'foundation', variant = 'foundation_numeral_to_word', type = 'MCQ') => {

    const safeType = String(type).toLowerCase();
    const isShort = safeType.includes('short');
    const isStructure = safeType.includes('structure') || safeType.includes('structured');
    const isMCQ = safeType.includes('mcq');
    let activeVariant = variant;

    // 1. Ensure the variant exists (Fallback only if invalid)
    if (!numberNotationBlueprint.variants[variant]) {
      const safeDiff = String(difficulty).toLowerCase();
      let validVariants = Object.keys(numberNotationBlueprint.variants).filter(k => k.startsWith(safeDiff));
      if (validVariants.length > 0) {
        activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
      } else {
        activeVariant = 'foundation_numeral_to_word';
      }
    }

    // Prepare Zod Schema Meta
    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    const level = 'Primary 1';
    const topic = 'Whole Numbers - Numbers up to 100';

    // Helper to dynamically strip English words for short questions
    const getQText = (words, equation) => (isShort) ? equation : words;

    // All notation questions are notation variants, they do not use word problems
    const isNotationVariant = true;

    const hintProtocol = `\nCRITICAL HINT PROTOCOL: You MUST provide a conceptual "hint" field in your JSON.
Forbidden: "The answer is forty-five."
Required: Focus on spelling rules or place value chunks.
Example: "Break it down: 40 is 'forty' and 5 is 'five'."`;

    let formatInstructions = isMCQ
      ? `Format as MCQ. Include an "options" array with 4 choices. "finalAnswer" must exactly match one of the options.${hintProtocol}`
      : `Format as Short Answer. The "options" field in your JSON should be null. CRITICAL: NEVER ask the student to "show working" or "write working" in the question text.${hintProtocol}`;

    const context = getRandomContext('GENERAL', 'LOWER_BLOCK');
    const selectedContextItem = context.items[Math.floor(Math.random() * context.items.length)];
    const selectedIcon = '✏️';

    if (activeVariant.startsWith('foundation_')) {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, isNotationVariant);
    }

    if (activeVariant.startsWith('standard')) {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, isNotationVariant);
    }
    if (activeVariant.startsWith('advanced')) {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, isNotationVariant);
    }

    throw new Error(`Variant '${variant}' not valid for difficulty '${difficulty}' in Number Notation`);
  }
};
