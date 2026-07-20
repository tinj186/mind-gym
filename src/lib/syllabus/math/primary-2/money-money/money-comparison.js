import { generateFoundation } from './money-comparison/foundation';
import { generateStandard } from './money-comparison/standard';
import { generateAdvanced } from './money-comparison/advanced';

export const moneyComparisonBlueprint = {
  id: 'Primary 2-Money - Money-Money Comparison',
  tierConstraints: {
    foundation: {
      name: 'Comparing Simple Amounts',
      steps: 1,
      maxNumber: 100,
      logicDescription: "Comparing amounts up to $100. Identifying cheaper/more expensive items, true/false comparisons, and basic affordability."
    },
    standard: {
      name: 'Comparing Large Amounts',
      steps: 2,
      maxNumber: 1000,
      logicDescription: "Comparing worded amounts, ordering items by price, calculating price differences, and checking affordability for multiple items."
    },
    advanced: {
      name: 'Multi-Step Comparison',
      steps: 3,
      maxNumber: 1000,
      logicDescription: "Multi-step logic: comparing totals of multiple purchases, checking post-spending balances, and exact affordability differences."
    }
  },

  variants: {
    // Foundation Tier (5 variants)
    foundation_compare_two_amounts: "Compare two numeric amounts (which is greater/smaller).",
    foundation_cheaper_expensive: "Which item is cheaper/more expensive from a list of two items.",
    foundation_true_false_comparison: "True or false statement evaluating if $X is greater than $Y.",
    foundation_order_three_simple: "Order 3 items from cheapest to most expensive (simple amounts).",
    foundation_affordability_single: "Given $X, determine which of the two items you can afford.",

    // Standard Tier (5 variants)
    standard_compare_worded: "Compare two worded amounts (e.g., twenty dollars vs fifteen dollars).",
    standard_order_three_large: "Order 3 to 4 items from most expensive to cheapest (large amounts).",
    standard_who_has_more_difference: "Person A has $X, Person B has $Y. Who has more, and how much more?",
    standard_affordability_multiple: "Identify which item out of 3 you can afford with a given amount.",
    standard_price_difference: "Price difference between two items (how much more does Item A cost than Item B?).",

    // Advanced Tier (5 variants)
    advanced_compare_purchases: "Person A buys 2 items. Person B buys 1 item. Who spent more and by how much?",
    advanced_compare_sums: "Find the difference in cost between buying (Item A + Item B) vs (Item C).",
    advanced_post_spending_comparison: "Person A has $X, Person B has $Y. Person A spends $Z. Who has more money now?",
    advanced_affordability_combo: "A set of 3 items. I have $X. Which 2 items can I afford together?",
    advanced_multi_step_affordability: "I want to buy 3 items. I have $X. Do I have enough, and what is the exact difference (shortfall or leftover)?"
  },

  generate: (difficulty = 'foundation', variant = 'foundation_compare_two_amounts', type = 'MCQ') => {
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

    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = finalDifficulty.charAt(0).toUpperCase() + finalDifficulty.slice(1);
    const level = 'Primary 2';
    const topic = 'Money - Money';
    const subtopic = 'Money Comparison';

    const hintProtocol = `\nCRITICAL HINT PROTOCOL: You MUST provide a conceptual "hint" field in your JSON. Focus on comparing values and calculating differences.`;

    let formatInstructions = isMCQ
      ? `Format as MCQ. Include an "options" array with 4 choices. "finalAnswer" must exactly match one of the options.${hintProtocol}`
      : `Format as Short Answer. The "options" field in your JSON should be null.${hintProtocol}`;

    // Dispatch to tier files
    if (finalDifficulty.toLowerCase() === 'foundation' || activeVariant.startsWith('foundation_')) {
      return generateFoundation(activeVariant, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions);
    } else if (finalDifficulty.toLowerCase() === 'advanced' || activeVariant.startsWith('advanced_')) {
      return generateAdvanced(activeVariant, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions);
    } else {
      return generateStandard(activeVariant, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions);
    }
  }
};
