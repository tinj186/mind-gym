import { foundationLogic } from './addition-and-subtraction-concepts/foundation';
import { standardLogic } from './addition-and-subtraction-concepts/standard';
import { advancedLogic } from './addition-and-subtraction-concepts/advanced';

export const additionAndSubtractionConceptsBlueprint = {
  id: 'p1-addition-and-subtraction-concepts',

  // 1. DIFFICULTY LEVELS
  levels: {
    foundation: {
      name: 'Number Bonds',
      steps: 1,
      maxNumber: 20,
      logicDescription: "Find missing parts or wholes in basic number bonds.",
      logic: 'Direct Part-Whole Recognition'
    },
    standard: {
      name: 'Conceptual Equations',
      steps: 2,
      maxNumber: 20,
      logicDescription: "Relate visual models to standard equations.",
      logic: 'Equation Translation'
    },
    advanced: {
      name: 'Applied Concepts',
      steps: 3,
      maxNumber: 20,
      logicDescription: "Multi-step reasoning with addition/subtraction concepts.",
      logic: 'Multi-Step Deduction'
    }
  },

  // 2. STRICT VARIANTS
  variants: {
    // Foundation
    foundation_find_missing_whole: "Given two parts in a number bond, find the missing whole.",
    foundation_find_missing_part: "Given a whole and one part, find the missing part.",
    foundation_addition_equation: "Choose the correct addition equation for a complete number bond.",
    foundation_subtraction_equation: "Choose the correct subtraction equation for a complete number bond.",
    foundation_true_false_bond: "True or False: The given number bond is correct.",

    // Standard
    standard_subtraction_take_away: "Which subtraction equation matches the picture? (CrossOutGroup)",
    standard_addition_combine_sets: "Which addition equation shows the total number of items? (TwoSetComparison)",
    standard_missing_addend: "Find the missing number in the addition equation.",
    standard_missing_subtrahend: "Find the missing number in the subtraction equation.",
    standard_fact_family: "Given an addition/subtraction fact, choose a related fact.",

    // Advanced
    advanced_balance_equation: "Find the missing number to balance the equation.",
    advanced_multi_step_calculation: "Calculate: X + Y - Z = ?",
    advanced_reverse_subtraction_word: "Reverse subtraction word problem.",
    advanced_true_false_balance: "True or False: X + Y = A - B",
    advanced_chained_number_bond: "Chained parts to find the final whole."
  },

  // 3. GENERATION ENGINE
  generate: (difficulty = 'foundation', variant = 'foundation_find_missing_whole', type = 'MCQ') => {
    const safeType = String(type).toLowerCase();
    const isShort = safeType.includes('short');
    const isStructure = safeType.includes('structure') || safeType.includes('structured');
    const isMCQ = safeType.includes('mcq');
    let activeVariant = variant;

    // 1. Ensure the variant exists (Fallback only if invalid)
    if (!additionAndSubtractionConceptsBlueprint.variants[variant]) {
      const safeDiff = String(difficulty).toLowerCase();
      let validVariants = Object.keys(additionAndSubtractionConceptsBlueprint.variants).filter(k => k.startsWith(safeDiff));
      if (validVariants.length > 0) {
        activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
      } else {
        activeVariant = 'foundation_find_missing_whole';
      }
    }

    // Prepare Zod Schema Meta
    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    const level = 'Primary 1';
    const topic = 'Whole Numbers - Addition and Subtraction';

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
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, getQText);
    }
    if (activeVariant.startsWith('standard')) {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, getQText);
    }
    if (activeVariant.startsWith('advanced')) {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, getQText);
    }

    throw new Error(`Variant '${variant}' not valid for difficulty '${difficulty}' in Addition and Subtraction Concepts`);
  }
};
