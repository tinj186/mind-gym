import { getRandomContext } from '@/lib/utils/localization';
import { emojiObjects } from '@/lib/utils/variable-bank';
import { foundationLogic } from './set-comparison/foundation';
import { standardLogic } from './set-comparison/standard';
import { advancedLogic } from './set-comparison/advanced';

export const setComparisonBlueprint = {
  id: 'p1-set-comparison',

  // 1. DIFFICULTY LEVELS (Database Defaults)
  levels: {
    foundation: {
      name: 'Direct Visual Comparison',
      steps: 1,
      maxNumber: 100,
      logicDescription: "Identify more/less/equal directly from two visual sets.",
      logic: 'Direct Visual Comparison'
    },
    standard: {
      name: 'Multi-step Logic',
      steps: 2,
      maxNumber: 100,
      logicDescription: "Deduce relationships with slightly indirect visual presentation.",
      logic: 'Intermediate Visual Deductions'
    },
    advanced: {
      name: 'Complex Reasoning',
      steps: 3,
      maxNumber: 100,
      logicDescription: "Solve visual puzzles or missing elements.",
      logic: 'Visual Puzzle Deduction'
    }
  },

  // 2. STRICT VARIANTS
  variants: {
    // Foundation
    foundation_identify_set_more: "Given two visual sets, identify the set that has more.",
    foundation_identify_set_fewer: "Given two visual sets, identify the set that has fewer.",
    foundation_true_false_more: "True/False: Set A has more items than Set B.",
    foundation_true_false_fewer: "True/False: Set A has fewer items than Set B.",
    foundation_compare_equal_sets: "Given two visual sets, determine if they have the same number of items.",

    // Standard
    standard_how_many_more_seta: "Set A has how many more items than Set B?",
    standard_how_many_fewer_setb: "Set B has how many fewer items than Set A?",
    standard_how_many_more_random: "How many more items does the larger set have than the smaller set?",
    standard_difference_value: "What is the difference in the number of items between Set A and Set B?",
    standard_add_to_equalize: "How many items must be added to Set [Smaller] to make it equal to Set [Larger]?",
    standard_remove_to_equalize: "How many items must be removed from Set [Larger] to make it equal to Set [Smaller]?",
    standard_transfer_to_equalize: "How many items must be moved from Set [Larger] to Set [Smaller] so they have the same number?",
    standard_combine_total: "How many items are there altogether in Set A and Set B?",
    standard_compare_sum_to_value: "True/False: The total number of items in Set A and Set B is greater than [X].",
    standard_compare_diff_to_value: "True/False: The difference between Set A and Set B is exactly [Y].",

    // Advanced
    advanced_relative_third_set_more: "Set C (not shown) has [X] more items than Set A. How many items are in Set C?",
    advanced_relative_third_set_fewer: "Set C (not shown) has [X] fewer items than Set B. How many items are in Set C?",
    advanced_relative_third_set_combined: "Set C (not shown) has exactly the same number of items as Set A and Set B combined. How many items are in Set C?",
    advanced_relative_third_set_difference: "Set C (not shown) has a number of items equal to the difference between Set A and Set B. How many items are in Set C?",
    advanced_multiple_transfer: "If I move [X] items from Set A to Set B, and then [Y] items from Set B back to Set A, which set will have more?",
    advanced_ratio_concept: "If I double the number of items in Set [Smaller], will it be more than Set [Larger]?",
    advanced_equalize_both_target: "How many items must be added to Set A and Set B respectively so that they both have exactly [Target] items? (Format: A, B)",
    advanced_reverse_transfer_a: "The picture shows the sets AFTER [X] items were moved from Set A to Set B. How many items did Set A originally have?",
    advanced_reverse_transfer_b: "The picture shows the sets AFTER [X] items were moved from Set A to Set B. How many items did Set B originally have?",
    advanced_true_false_inequality: "True or False: The number of items in Set A is greater than Set B, but less than [Set B + offset]."
  },

  // 3. GENERATION ENGINE
  generate: (difficulty = 'foundation', variant = 'foundation_identify_set_more', type = 'MCQ') => {

    const safeType = String(type).toLowerCase();
    const isShort = safeType.includes('short');
    const isStructure = safeType.includes('structure') || safeType.includes('structured');
    const isMCQ = safeType.includes('mcq');
    let activeVariant = variant;

    // 1. Ensure the variant exists (Fallback only if invalid)
    if (!setComparisonBlueprint.variants[variant]) {
      const safeDiff = String(difficulty).toLowerCase();
      let validVariants = Object.keys(setComparisonBlueprint.variants).filter(k => k.startsWith(safeDiff));
      if (validVariants.length > 0) {
        activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
      } else {
        activeVariant = 'foundation_identify_set_more';
      }
    }

    // Prepare Zod Schema Meta
    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    const level = 'Primary 1';
    const topic = 'Whole Numbers - Numbers up to 100';

    // Set Context
    const { name: contextName, setting } = getRandomContext();
    const context = `${contextName} at the ${setting}`;
    const randomEmojiObj = emojiObjects[Math.floor(Math.random() * emojiObjects.length)];
    const selectedContextItem = { item: randomEmojiObj.name, icon: randomEmojiObj.icon };
    const selectedIcon = selectedContextItem.icon;

    // Output formatting protocol
    const formatInstructions = `
      FORMAT PROTOCOL:
      - 'options' must be an array of EXACTLY strings if MCQ, or null otherwise.
      - 'finalAnswer' must match EXACTLY one of the options (if MCQ).
      - 'defectMap' (only for MCQ) maps wrong options to either "CARELESS_CALCULATION" or "CONCEPTUAL_ERROR".
      - 'hint' must guide the student without giving away the answer directly.
      - 'solutionSteps' must clearly explain how to get the answer.
    `;

    // Dynamic Q Text Helper
    const getQText = (raw, short) => {
      if (isShort) return short;
      if (isStructure) return `Solve this:\\n${raw}`;
      return raw;
    };

    // Route to logic engines
    if (activeVariant.startsWith('foundation')) {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon);
    }
    if (activeVariant.startsWith('standard')) {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon);
    }
    if (activeVariant.startsWith('advanced')) {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon);
    }

    throw new Error(`Variant '${variant}' not valid for difficulty '${difficulty}' in Set Comparison`);
  }
};
