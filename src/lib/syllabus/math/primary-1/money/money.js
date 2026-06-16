/**
 * Blueprint for Primary 1: Money
 * FOCUS: Counting money, note exchanges, and simple item transaction values.
 */
import { getRandomContext } from '@/lib/utils/localization';
import { foundationLogic } from './money/foundation';
import { standardLogic } from './money/standard';
import { advancedLogic } from './money/advanced';

export const moneyBlueprint = {
  id: 'p1-money-money',
  title: 'Money',
  strand: 'Measurement and Geometry',
  visualType: 'DYNAMIC', 

  difficultyLevels: {
    foundation: {
      name: 'Basic Identification & Counting',
      steps: 1,
      maxNumber: 20,
      logicDescription: "Identifying denominations and counting coin/note values within $20."
    },
    standard: {
      name: 'Exchanging & Simple Shopping',
      steps: 2,
      maxNumber: 50,
      logicDescription: "Simple amount combinations, comparisons, and finding change within $50."
    },
    advanced: {
      name: 'Multi-Step Financial Logic',
      steps: 3,
      maxNumber: 100,
      logicDescription: "Multi-step word problems involving transactions and savings additions within $100."
    }
  },

  variants: {
    // Foundation Tier
    foundation_counting_coins: "Counting basic Singapore coin combinations (10¢, 20¢, 50¢, $1).",
    foundation_identifying_notes: "Identifying and counting small note denominations ($2, $5, $10).",
    foundation_mixed_counting: "Counting mixed combinations of small notes and coins up to $20.",
    foundation_comparing_values: "Comparing a rendered set of coins/notes against a target price value within $20.",
    foundation_matching_exact_amount: "Identifying or matching a specific total value from a rendered set of currency assets up to $20.",
    
    // Standard Tier
    standard_value_exchange: "Exchanging denominations (e.g., how many 20¢ coins make $1).",
    standard_two_item_total: "Calculating the total combined cost of purchasing two different items within a $50 budget.",
    standard_calculating_change: "Determining the correct change received when paying with a single note ($5, $10, or $50) for an item.",
    standard_affordability_check: "Evaluating whether a rendered collection of notes and coins is sufficient to buy an item with a specific price tag.",
    standard_shortfall_needed: "Calculating the exact additional amount of money required to buy an item when current money falls short.",
    standard_price_comparison: "Comparing the prices of different items to determine which costs the most or the least.",
    standard_amount_difference: "Finding how much more money one person has than another based on two distinct sets of currency.",
    standard_equivalent_sets: "Identifying an alternative combination of coins/notes that yields the exact same total value as a rendered set.",
    standard_reverse_price_lookup: "Deducing the original cost of a purchased item by subtracting the received change from the note used to pay.",
    standard_multi_item_change: "A two-step problem calculating the combined cost of two items and finding the remaining change from a fixed starting note.",

    // Advanced Tier
    advanced_transaction_change: "Multi-step shopping stories calculating total cost and change.",
    advanced_savings_and_spending: "Tracking money values across sequential savings additions and spending reductions over multiple steps.",
    advanced_pooled_affordability: "Two characters pooling distinct sets of money to purchase a shared item, calculating the resulting change or shortfall.",
    advanced_missing_price_deduction: "Deducing the unknown price of a second item given the starting note, change received, and the known price of the first item.",
    advanced_max_combination_budget: "Determining the maximum quantity of items or specific item pairings possible within a fixed budget boundary.",
    advanced_comparative_remaining: "Comparing the remaining money balances of two different characters after they execute separate transactions.",
    advanced_savings_target_shortfall: "Calculating the remaining gap and specific note counts required to reach a target savings goal for a high-value item.",
    advanced_exact_combination_matching: "Identifying which specific items from a menu can be purchased together to exactly exhaust a rendered sum of money.",
    advanced_reverse_allowance_tracking: "Working backward from a final remaining balance to find an initial amount before multi-step allowances and expenses occurred.",
    advanced_multi_item_gift_sharing: "Calculating total cost for buying items for multiple people and checking the change from a high-denomination note."
  },

  generate: (difficulty = 'foundation', variant = 'foundation_counting_coins', type = 'MCQ') => {
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
    if (!moneyBlueprint.variants[finalVariant]) {
      const validVariants = Object.keys(moneyBlueprint.variants).filter(k => k.startsWith(finalDifficulty));
      if (validVariants.length > 0) {
        activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
      } else {
        activeVariant = 'foundation_counting_coins'; 
      }
    }

    const config = moneyBlueprint.difficultyLevels[finalDifficulty] || moneyBlueprint.difficultyLevels.foundation;
    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = finalDifficulty.charAt(0).toUpperCase() + finalDifficulty.slice(1);
    const level = 'Primary 1';
    const topic = 'Money';

    const getQText = (words, equation) => isShort ? equation : words;
    const levelNum = parseInt(level.replace('Primary ', ''));
    const tier = levelNum <= 2 ? 'LOWER_BLOCK' : (levelNum <= 4 ? 'MIDDLE_BLOCK' : 'UPPER_BLOCK');
    const context = getRandomContext('SHOPPING', tier);

    const hintProtocol = `\nCRITICAL HINT PROTOCOL: You MUST provide a conceptual "hint" field in your JSON. Focus on counting currency correctly.`;

    let formatInstructions = isMCQ 
      ? `Format as MCQ. Include an "options" array with 4 choices. "finalAnswer" must exactly match one of the options.${hintProtocol}` 
      : `Format as Short Answer. The "options" field in your JSON should be null.${hintProtocol}`;

    if (activeVariant.startsWith('foundation_')) {
      return foundationLogic(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
    }

    if (activeVariant.startsWith('standard_')) {
      return standardLogic(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
    }

    if (activeVariant.startsWith('advanced_')) {
      return advancedLogic(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
    }

    throw new Error(`Variant '${finalVariant}' not valid.`);
  }
};