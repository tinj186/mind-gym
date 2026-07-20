/**
 * Blueprint for Primary 2: Money Counting (Dollars/Cents)
 * FOCUS: Counting larger sums, working with decimals, simple transactions up to $1000.
 */
import { getRandomContext } from '@/lib/utils/localization';
import { foundationLogic } from './money/foundation';
import { standardLogic } from './money/standard';
import { advancedLogic } from './money/advanced';

export const moneyBlueprint = {
  id: 'p2-money-money',
  title: 'Money',
  strand: 'Measurement and Geometry',
  visualType: 'DYNAMIC',

  difficultyLevels: {
    foundation: {
      name: 'Counting Dollars and Cents',
      steps: 1,
      maxNumber: 100,
      logicDescription: "Counting rendered mixed coins and notes, outputting in decimal notation up to $100."
    },
    standard: {
      name: 'Simple Transactions',
      steps: 2,
      maxNumber: 1000,
      logicDescription: "Adding two items or finding change within $1000. Deducing equations from word problems."
    },
    advanced: {
      name: 'Multi-Step Deducing',
      steps: 3,
      maxNumber: 1000,
      logicDescription: "Multi-step logic: total cost plus change, identifying missing prices from a total."
    }
  },

  variants: {
    // Foundation Tier (5 variants)
    foundation_counting_coins_notes: "Count a mixed combination of notes and coins, expressing the answer as $XX.XX.",
    foundation_identifying_target_amount: "Identify if a rendered set of money matches a given target price (e.g., $45.20).",
    foundation_comparing_two_sets: "Compare two rendered amounts to see which is greater or smaller.",
    foundation_missing_value_equation: "Find the missing value (addition or subtraction) between small amounts of money.",
    foundation_equivalent_exchange: "Identify how many of a smaller denomination (e.g. 50¢) makes up a larger one (e.g. $5).",

    // Standard Tier (5 variants)
    standard_money_exchange_large: "Exchange large notes (e.g., how many $50 notes make $500?).",
    standard_calculating_total_cost: "Calculate the total cost of two items (e.g., $12.50 + $4.20).",
    standard_finding_change: "Calculate change when paying with a $10, $50 or $100 note.",
    standard_affordability_shortfall: "Find how much more money is needed to buy an item given a set of rendered money.",
    standard_adding_three_items: "Calculate the total cost of three items within $100.",

    // Advanced Tier (5 variants)
    advanced_multi_step_shopping: "Buy 2 items, calculate total cost, and calculate change received from a large note.",
    advanced_savings_target: "Person A wants to buy an item for $120. They have $45. How much more do they need?",
    advanced_deduce_missing_price: "Bought Item A and B, paid with $100, got $15 change. If A is $35.50, what is B?",
    advanced_equal_sharing: "Two people share the cost of an item equally. How much does each pay?",
    advanced_reverse_change: "After buying an item, Person A has exactly 3 notes left that total $60. Deducing the change received."
  },

  generate: (difficulty = 'foundation', variant = 'foundation_counting_coins_notes', type = 'MCQ') => {
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
        activeVariant = 'foundation_counting_coins_notes';
      }
    }

    const config = moneyBlueprint.difficultyLevels[finalDifficulty] || moneyBlueprint.difficultyLevels.foundation;
    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = finalDifficulty.charAt(0).toUpperCase() + finalDifficulty.slice(1);
    const level = 'Primary 2';
    const topic = 'Money - Money';
    const subtopic = 'Money Counting (Dollars/Cents)';

    const getQText = (words, equation) => {
      if (isStructure) return words;
      return equation || words;
    };
    
    const context = getRandomContext('SHOPPING', 'LOWER_BLOCK');

    const hintProtocol = `\nCRITICAL HINT PROTOCOL: You MUST provide a conceptual "hint" field in your JSON. Focus on reading and writing money using decimal notation ($XX.XX).`;

    let formatInstructions = isMCQ
      ? `Format as MCQ. Include an "options" array with 4 choices. "finalAnswer" must exactly match one of the options.${hintProtocol}`
      : `Format as Short Answer. The "options" field in your JSON should be null.${hintProtocol}`;

    if (activeVariant.startsWith('foundation_')) {
      return foundationLogic(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText);
    }

    if (activeVariant.startsWith('standard_')) {
      return standardLogic(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText);
    }

    if (activeVariant.startsWith('advanced_')) {
      return advancedLogic(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText);
    }

    throw new Error(`Variant '${finalVariant}' not valid.`);
  }
};
