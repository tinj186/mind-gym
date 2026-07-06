import { foundationLogic } from './multiplication-division/foundation.js';
import { standardLogic } from './multiplication-division/standard.js';
import { advancedLogic } from './multiplication-division/advanced.js';
import { emojiObjects } from '@/lib/utils/variable-bank';
import { getRandomContext } from '@/lib/utils/localization';

export const multiplicationWithin40Blueprint = {
  id: 'p1-multiplication-within-40',
  title: 'Multiplication within 40',
  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 20,
      logicDescription: "Basic multiplication within 40."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      maxNumber: 40,
      logicDescription: "Multiplication word problems within 40."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 3,
      maxNumber: 40,
      logicDescription: "Multi-step logic involving multiplication followed by addition/subtraction."
    }
  },
  variants: {
    foundation_multiplication: "Basic multiplication (equal groups) within 40.",
    foundation_recognize_equal_groups: "Determine if groups have an equal number of items.",
    foundation_count_equal_groups: "Count the number of equal groups and items per group.",
    foundation_repeated_addition: "Write the repeated addition equation for equal groups.",
    foundation_grouping_interactive: "Interactive: Drag and drop items to form equal groups.",

    standard_comparison_times_as_many: "Solve 'times as many' word problems within 40.",
    standard_skip_count_total: "Use skip counting by 2, 5, or 10 to find a total.",
    standard_unit_price_calc: "Calculate the total cost of multiple identical items.",
    standard_attribute_multiplication: "Count total attributes (e.g., wheels on 5 cars).",

    advanced_multi_step_mult_add: "Multi-step: Multiply groups then add more.",
    advanced_multi_step_mult_sub: "Multi-step: Multiply groups then subtract.",
    advanced_logic_wheels_legs: "Logic puzzle: Counting total wheels or legs across groups.",
    advanced_two_entities_total: "Multi-step: Total of two grouped quantities.",
    advanced_two_entities_diff: "Multi-step: Difference of two grouped quantities.",
    advanced_money_mult_change: "Money: Buy multiple items and find change.",
    advanced_balance_mult_add: "Multi-step: Equate a grouped quantity with another by finding difference.",
    advanced_attribute_tf_matrix: "Logic puzzle: Evaluate multiple True/False statements about the total attributes (e.g., legs/wheels) of mixed entities."
  },
  generate: (difficulty = 'foundation', variant = 'foundation_multiplication', type = 'MCQ') => {
    const safeType = String(type).toLowerCase();
    const isShort = safeType.includes('short');
    const isStructure = safeType.includes('structure') || safeType.includes('structured');
    const isMCQ = safeType.includes('mcq');

    const level = 'Primary 1';
    const topic = 'Whole Numbers - Multiplication and Division';

    const zodType = type;
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

    if (safeDiff === 'foundation') return foundationLogic(variant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, false, false);
    if (safeDiff === 'standard') return standardLogic(variant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, false, false);
    if (safeDiff === 'advanced') return advancedLogic(variant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, false, false);

    return foundationLogic(variant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, false, false);
  }
};
