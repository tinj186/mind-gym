/**
 * Blueprint for Primary 1: Multiplication and Division
 * FOCUS: Concepts of Equal Groups, Sharing, and Grouping.
 */
import { getRandomContext } from '@/lib/utils/localization';
import { foundationLogic } from './multiplication-division/foundation';
import { standardLogic } from './multiplication-division/standard';
import { advancedLogic } from './multiplication-division/advanced';

export const multiplicationDivisionBlueprint = {
  id: 'p1-multiplication-division',
  title: 'Multiplication and Division',
  strand: 'Number and Algebra',
  visualType: 'DYNAMIC',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 20,
      logicDescription: "Concepts of equal groups and sharing within 20."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      maxNumber: 40,
      logicDescription: "Multiplication and grouping word problems within 40."
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
    foundation_division: "Basic division (sharing/grouping) within 20.",
    foundation_grouping_interactive: "Interactive: Group items into sets of a specific size.",
    foundation_sharing_interactive: "Interactive: Share items equally into a given number of groups.",

    standard_repeated_addition_convert: "Convert repeated addition to a multiplication equation.",
    standard_array_rows_cols: "Find the total items in an array (rows and columns).",
    standard_comparison_times_as_many: "Solve 'times as many' word problems within 40.",
    standard_skip_count_total: "Use skip counting by 2, 5, or 10 to find a total.",
    standard_unit_price_calc: "Calculate the total cost of multiple identical items.",
    standard_sharing_missing_each: "Find how many in each group (Sharing).",
    standard_grouping_missing_groups: "Find the number of groups (Grouping).",
    standard_inverse_fact_families: "Solve division using a related multiplication fact.",
    standard_even_odd_sharing: "Identify if a number can be shared equally (Even/Odd logic).",
    standard_attribute_multiplication: "Count total attributes (e.g., wheels on 5 cars).",

    advanced_multi_step_mult_add: "Multi-step: Multiply groups then add more.",
    advanced_multi_step_mult_sub: "Multi-step: Multiply groups then subtract.",
    advanced_logic_wheels_legs: "Logic puzzle: Counting total wheels or legs across groups.",
    advanced_multi_step_sharing_add: "Multi-step: Share equally then receive more.",
    advanced_grouping_need_more: "Multi-step: Grouping and finding how many more needed.",
    advanced_two_entities_total: "Multi-step: Total of two grouped quantities.",
    advanced_two_entities_diff: "Multi-step: Difference of two grouped quantities.",
    advanced_money_mult_change: "Money: Buy multiple items and find change.",
    advanced_money_group_buy: "Money: Find how many items can be bought with a sum.",
    advanced_balance_mult_add: "Multi-step: Equate a grouped quantity with another by finding difference."
  },

  generate: (difficulty = 'foundation', variant = 'foundation_mult_eqn', type = 'MCQ') => {
    const safeType = String(type).toLowerCase();
    const isShort = safeType.includes('short');
    const isStructure = safeType.includes('structure') || safeType.includes('structured');
    const isMCQ = safeType.includes('mcq');

    let activeVariant = variant;
    const isMissing = !multiplicationDivisionBlueprint.variants[activeVariant];
    const violatesShort = isShort && activeVariant && (activeVariant.includes('word_problem') || activeVariant.includes('interactive') || (activeVariant.includes('logic') && !activeVariant.includes('advanced')));
    const violatesStructure = isStructure && activeVariant && (!activeVariant.includes('word_problem') && !activeVariant.includes('logic') && !activeVariant.includes('interactive') && !activeVariant.includes('standard') && !activeVariant.includes('advanced') && !activeVariant.includes('multiplication') && !activeVariant.includes('division'));

    if (isMissing || violatesShort || violatesStructure) {
      const safeDiff = String(difficulty).toLowerCase();
      let validVariants = Object.keys(multiplicationDivisionBlueprint.variants).filter(k => k.startsWith(safeDiff));

      // 2. APPLY SPECIFIC RULES BASED ON QUESTION TYPE
      if (isShort) {
        // Short questions: ONLY pure mathematical equations (exclude stories and interactive tools)
        validVariants = validVariants.filter(k =>
          (!k.includes('word_problem') && !k.includes('interactive') && !(k.includes('logic') && !k.includes('advanced'))) ||
          k.includes('multiplication') || k.includes('division')
        );
      } else if (isStructure) {
        // Structured questions: ONLY word problems OR interactive tools
        validVariants = validVariants.filter(k =>
          k.includes('word_problem') ||
          k.includes('logic') ||
          k.includes('interactive') ||
          k.includes('multiplication') || k.includes('division') ||
          k.includes('standard') || k.includes('advanced')
        );
      }

      activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)] || 'foundation_multiplication';
    }

    let formatInstructions = isMCQ
      ? `Format as MCQ. Include an "options" array with 4 choices. "finalAnswer" must exactly match one of the options.`
      : isShort
        ? `Format as Short Answer. The "options" field in your JSON should be null. CRITICAL: For the "questionText" string, output ONLY the mathematical equation using 'x' or '÷' (e.g., "4 x 5 = ?"). Do not use any English words. TOPIC: Multiplication/Division only. NO addition/subtraction.`
        : `Format as Structured Question. The "options" field in your JSON should be null. CRITICAL: For the "questionText" string, write a clear localized word problem. CREATIVE INSTRUCTIONS: Generate a Singapore-themed word problem. Use varied local names, settings (e.g., community club, school, or home), and strictly use the specific items provided in the prompt logic.`;

    // Map to Zod enums
    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    const level = 'Primary 1';
    const topic = 'Whole Numbers';

    // Determine if this topic supports Structured Questions (3-Type Protocol)
    const supportsStructured = Object.keys(multiplicationDivisionBlueprint.variants).some(v => v.includes('advanced'));

    const getQText = (story, equation, type) => {
      if (supportsStructured) {
        if (type === 'SHORT_QUESTION') return equation; // Equation only for 3-Type Short
        if (type === 'STRUCTURED') return story; // Descriptive for Structured
        return `${story} ${equation}`; // Combined for MCQ
      }
      // 2-Type Protocol
      return type === 'SHORT_QUESTION' ? (story || equation) : `${story} ${equation}`;
    };

    const getOptions = (ans) => {
      const a = parseInt(ans);
      let d1 = a + 2, d2 = a + 5, d3 = Math.max(0, a - 5);
      if (d1 === a) d1 += 1;
      if (d2 === a || d2 === d1) d2 = a + 10;
      if (d3 === a || d3 === d1 || d3 === d2) d3 = a + 15;
      return JSON.stringify([String(a), String(d1), String(d2), String(d3)].sort(() => Math.random() - 0.5));
    };

    const levelNum = parseInt(level.replace('Primary ', ''));
    const tier = levelNum <= 2 ? 'LOWER_BLOCK' : (levelNum <= 4 ? 'MIDDLE_BLOCK' : 'UPPER_BLOCK');
    const context = getRandomContext('GENERAL', tier);

    // Fix: Properly randomize the item from the context items array if selectedItem is not available
    const itemData = context?.selectedItem || (context.items && context.items.length > 0 ? context.items[Math.floor(Math.random() * context.items.length)] : null) || { item: 'item', icon: '⭐' };
    const cleanItemLabel = typeof itemData === 'string'
      ? itemData
      : (itemData.item || itemData.name?.singular || itemData.name || 'item');

    if (String(cleanItemLabel).includes('[object')) console.warn("⚠️ [Blueprint: Mult/Div] Context item extraction failed for:", itemData);

    // Dynamic visual item selection
    const funIcons = ['⚽', '🏀', '⭐', '🚗', '🥟', '🍢', '🍡', '🍎'];
    const selectedIcon = itemData?.icon || funIcons[Math.floor(Math.random() * funIcons.length)];

    // Visuals are hidden for text-only questions (Structured and MCQ) unless they use interactive tools
    const hideVisual = !isShort && !activeVariant.includes('interactive');

    if (activeVariant.startsWith('foundation_')) {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, cleanItemLabel, getQText, selectedIcon, hideVisual, supportsStructured);
    }

    if (activeVariant.startsWith('standard_')) {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, cleanItemLabel, getQText, selectedIcon, hideVisual, supportsStructured);
    }

    if (activeVariant.startsWith('advanced_')) {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, cleanItemLabel, getQText, selectedIcon, hideVisual, supportsStructured);
    }

    throw new Error(`Variant '${activeVariant}' logic block not implemented.`);
  }
};