import { foundationLogic } from './multiplication-division/foundation.js';
import { standardLogic } from './multiplication-division/standard.js';
import { advancedLogic } from './multiplication-division/advanced.js';
import { emojiObjects } from '@/lib/utils/variable-bank';
import { getRandomContext } from '@/lib/utils/localization';

export const divisionWithin20Blueprint = {
  id: 'p1-division-within-20',
  title: 'Division within 20',
  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 20,
      logicDescription: "Basic division within 20."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      maxNumber: 20,
      logicDescription: "Division word problems within 20."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 3,
      maxNumber: 20,
      logicDescription: "Multi-step logic involving division."
    }
  },
  variants: {
    foundation_division: "Basic division (sharing/grouping) within 20.",
    foundation_sharing_interactive: "Interactive: Drag and drop items to share equally among groups.",
    foundation_grouping_interactive: "Interactive: Drag and drop items to form equal groups of a specific size.",
    foundation_repeated_subtraction: "Write the repeated subtraction equation for equal groups.",
    foundation_division_equation: "Match a visual of equal groups to the correct division equation.",
    
    standard_inverse_fact_families: "Solve division using a related multiplication fact.",
    standard_identify_division_sentence: "Identify the division sentence for a given story.",
    standard_sharing_missing_each: "Word problem: Share a total equally among groups.",
    standard_grouping_missing_groups: "Word problem: Group a total into groups of a specific size.",
    standard_division_word_problem_to_equation: "Match a division word problem to its equation.",
    
    advanced_multi_step_sharing_add: "Multi-step: Share equally then receive more.",
    advanced_money_group_buy: "Money: Find how many items can be bought with a sum.",
    advanced_grouping_need_more: "Multi-step: Try to group items but need a few more.",
    advanced_multi_step_sharing_sub: "Multi-step: Share equally then give some away.",
    advanced_money_share_change: "Money: Share money equally, then buy an item and find change."
  },
  generate: (difficulty = 'foundation', variant = 'foundation_division', type = 'MCQ') => {
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

    if (safeDiff === 'foundation') return foundationLogic(variant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, false, false);
    if (safeDiff === 'standard') return standardLogic(variant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, false, false);
    if (safeDiff === 'advanced') return advancedLogic(variant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, false, false);

    return foundationLogic(variant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, false, false);
  }
};
