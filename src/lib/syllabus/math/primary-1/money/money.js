/**
 * Blueprint for Primary 1: Money
 * FOCUS: Counting money, note exchanges, and simple item transaction values.
 */
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
    foundation_counting_coins: "Counting basic Singapore coin combinations (10¢, 20¢, 50¢, $1).",
    foundation_identifying_notes: "Identifying and counting small note denominations ($2, $5, $10).",
    
    standard_value_exchange: "Exchanging denominations (e.g., how many 20¢ coins make $1).",

    advanced_transaction_change: "Multi-step shopping stories calculating total cost and change."
  },

  generate(difficulty = 'foundation', variant = '', type = 'SHORT_QUESTION') {
    // Ensure activeVariant is a string and handle object-type variants or nulls from UI
    let activeVariant = typeof variant === 'object' ? (variant?.id || '') : (variant || '').toString();

    // Defaulting Logic: If variant is empty, the generic "Money" name, or missing tier prefixes,
    // route to a safe default based on difficulty to avoid unhandled Error throws.
    if (!activeVariant || activeVariant === 'Money' || !/^(foundation|standard|advanced)_/.test(activeVariant)) {
      if (difficulty?.toLowerCase() === 'standard') activeVariant = 'standard_value_exchange';
      else if (difficulty?.toLowerCase() === 'advanced') activeVariant = 'advanced_transaction_change';
      else activeVariant = 'foundation_counting_coins';
    }

    // Normalize type labels from UI (e.g., "Short Question" -> "SHORT_QUESTION")
    const normType = type?.toUpperCase()?.replace(/\s/g, '_') || 'SHORT_QUESTION';
    const isMCQ = normType === 'MCQ' || normType === 'MCQ_BUTTONS';
    const isShort = normType === 'SHORT_QUESTION';
    const isStructure = normType === 'STRUCTURED';

    const zodType = normType;
    const zodDiff = (difficulty || 'foundation').toUpperCase();
    const level = "Primary 1";
    const topic = "Money";

    // Dynamic routing to the variant modules matching our architecture layout
    if (activeVariant.startsWith('foundation_')) {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic);
    }
    if (activeVariant.startsWith('standard_')) {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic);
    }
    if (activeVariant.startsWith('advanced_')) {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic);
    }

    throw new Error(`Variant '${activeVariant}' logic pathway not found inside Money module.`);
  }
};