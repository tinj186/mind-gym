import { foundationLogic } from './multiplication-symbol-x/foundation.js';
import { standardLogic } from './multiplication-symbol-x/standard.js';
import { advancedLogic } from './multiplication-symbol-x/advanced.js';
import { emojiObjects } from '@/lib/utils/variable-bank';
import { getRandomContext } from '@/lib/utils/localization';

export const multiplicationSymbolXBlueprint = {
  id: 'p1-multiplication-symbol-x',
  title: "Multiplication Symbol 'x'",
  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      logicDescription: "Basic introduction to the multiplication symbol and repeated addition."
    },
    standard: {
      name: 'Symbol Mastery',
      steps: 1,
      logicDescription: "Transition from repeated addition to multiplication syntax."
    },
    advanced: {
      name: 'Logic & Application',
      steps: 2,
      logicDescription: "Multi-step logic puzzles and algebraic balancing involving multiplication."
    }
  },
  variants: {
    foundation_repeated_addition_to_mult: "Convert repeated addition to a multiplication expression.",
    foundation_groups_of_to_mult: "Convert 'groups of' text to a multiplication expression.",
    foundation_mult_to_repeated_addition: "Convert a multiplication expression into repeated addition.",
    foundation_mult_equation_match: "Match a picture of equal groups to the correct multiplication expression.",
    foundation_identify_mult_symbol: "Identify the correct mathematical operation symbol ('x').",

    standard_repeated_addition_convert: "Convert repeated addition to a multiplication equation.",
    standard_multiplication_syntax_audit: "Vocabulary audit: Identify which expression does NOT represent the total number of items shown.",
    standard_word_problem_to_equation: "Translate a word problem directly into a multiplication sentence.",
    standard_missing_factor_addition: "Fill in the blank to link repeated addition to multiplication (e.g. 4+4+4 = [ ] x 4).",

    advanced_multi_step_mult_add: "Multi-step logic: Multiplication followed by addition.",
    advanced_multi_step_mult_sub: "Multi-step logic: Multiplication followed by subtraction.",
    advanced_balance_mult_add: "Balance equation: Find the missing value to balance a multiplication and addition equation.",
    advanced_two_entities_total: "Compare two grouped entities and find the total sum.",
    advanced_two_entities_diff: "Compare two grouped entities and find the difference."
  },
  generate: (difficulty = 'standard', variant = 'standard_word_problem_to_equation', type = 'MCQ') => {
    const safeType = String(type).toLowerCase();
    const isShort = safeType.includes('short');
    const isStructure = safeType.includes('structure') || safeType.includes('structured');
    const isMCQ = safeType.includes('mcq');

    const level = 'Primary 1';
    const topic = 'Whole Numbers - Multiplication and Division';

    const zodType = type === 'Short Question' ? 'SHORT_QUESTION' : type.toUpperCase();
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const getQText = (structureText, shortText) => {
      if (isStructure) return structureText;
      return shortText || structureText;
    };

    const formatInstructions = "OUTPUT FORMAT (Return ONLY valid JSON matching this schema):";
    const safeDiff = String(difficulty).toLowerCase();
    const levelNum = parseInt(level.replace('Primary ', ''));
    const tier = levelNum <= 2 ? 'LOWER_BLOCK' : (levelNum <= 4 ? 'MIDDLE_BLOCK' : 'UPPER_BLOCK');
    const context = getRandomContext('GENERAL', tier);
    const selectedContextItem = emojiObjects[Math.floor(Math.random() * emojiObjects.length)];
    context.selectedItem = selectedContextItem; // Inject for logic files to use
    const selectedIcon = selectedContextItem?.icon || "🍎";

    if (safeDiff === 'foundation') return foundationLogic(variant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, getQText, context, selectedContextItem);
    if (safeDiff === 'standard') return standardLogic(variant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, false, false);
    if (safeDiff === 'advanced') return advancedLogic(variant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, false, false);

    return standardLogic(variant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, false, false);
  }
};
