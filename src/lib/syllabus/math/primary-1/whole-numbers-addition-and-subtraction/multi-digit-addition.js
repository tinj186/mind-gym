import { foundationLogic } from './multi-digit-addition/foundation';
import { standardLogic } from './multi-digit-addition/standard';
import { advancedLogic } from './multi-digit-addition/advanced';

export const multiDigitAdditionBlueprint = {
  id: 'p1-multi-digit-addition',

  // 1. DIFFICULTY TIERS
  difficulty: {
    foundation: {
      name: 'Multi-Digit Addition (Foundation)',
      steps: 1,
      maxNumber: 100,
      logicDescription: "Addition without regrouping (without carrying over), focusing on place value concepts.",
      logic: 'No Regrouping'
    },
    standard: {
      name: 'Multi-Digit Addition (Standard)',
      steps: 1,
      maxNumber: 100,
      logicDescription: "Addition WITH regrouping (carrying over tens), focusing on correct place value alignment and addition.",
      logic: 'With Regrouping'
    },
    advanced: {
      name: 'Multi-Digit Addition (Advanced)',
      steps: 2,
      maxNumber: 100,
      logicDescription: "Multi-step addition logic, missing digit puzzles, and optimization problems.",
      logic: 'Multi-Step Logic'
    }
  },

  // 2. STRICT VARIANTS
  variants: {
    // Foundation
    foundation_add_tens: "Add multiples of 10 (e.g. 40 + 30).",
    foundation_add_one_digit_no_regroup: "Add a 1-digit number to a 2-digit number without regrouping.",
    foundation_add_two_digit_no_regroup: "Add two 2-digit numbers without regrouping.",
    foundation_add_tens_and_ones_decomposition: "Add decomposed tens and ones (e.g., 'Add 3 tens and 4 ones to 20').",
    foundation_add_word_problem_no_regroup: "Solve a simple 1-step word problem without regrouping.",
    
    // Standard
    standard_add_one_digit_with_regroup: "Add a 1-digit number to a 2-digit number WITH regrouping.",
    standard_add_two_digit_with_regroup: "Add two 2-digit numbers WITH regrouping.",
    standard_add_three_numbers: "Add three numbers (e.g. 12 + 8 + 35) with regrouping.",
    standard_add_word_problem_with_regroup: "Solve a 1-step word problem requiring regrouping.",
    standard_add_tens_and_ones_regrouping_concept: "Test concept of regrouping (e.g., 'What is 4 tens and 15 ones?').",
    
    // Advanced
    advanced_add_two_step_word_problem: "Solve a 2-step word problem requiring two consecutive additions.",
    advanced_missing_digit_addition: "Find the missing digit in a multi-digit addition equation.",
    advanced_find_greatest_sum: "Identify which two numbers give the greatest sum without necessarily calculating all.",
    advanced_balance_multi_digit_equation: "Balance an equation requiring regrouping (e.g. 45 + 18 = 20 + ?).",
    advanced_consecutive_addition_pattern: "Identify and apply a constant addition pattern (e.g. skip counting by 12)."
  },

  // 3. GENERATION ENGINE
  generate: (difficulty = 'foundation', variant = 'foundation_add_two_digit_no_regroup', type = 'MCQ') => {
    const safeType = String(type).toLowerCase();
    const isShort = safeType.includes('short');
    const isStructure = safeType.includes('structure') || safeType.includes('structured');
    const isMCQ = safeType.includes('mcq');
    let activeVariant = variant;

    // 1. Ensure the variant exists (Fallback only if invalid)
    if (!multiDigitAdditionBlueprint.variants[variant]) {
      const safeDiff = String(difficulty).toLowerCase();
      let validVariants = Object.keys(multiDigitAdditionBlueprint.variants).filter(k => k.startsWith(safeDiff));
      if (validVariants.length > 0) {
        activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
      } else {
        activeVariant = 'foundation_add_two_digit_no_regroup';
      }
    }

    // Prepare Zod Schema Meta
    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    const level = "Primary 1";
    const topic = "Whole Numbers: Addition and Subtraction";

    // Reusable Formatting Instructions for AI Output
    const formatInstructions = `
    INSTRUCTIONS:
    - Generate a math problem exactly matching the provided 'questionText'.
    - Output MUST be valid JSON.
    - If isMCQ is true, provide 4 options in 'options' array.
    - If isShort or isStructure, 'options' must be null.
    - Include a 'defectMap' (for MCQs only) mapping each wrong option to an error category (e.g., CONCEPTUAL_ERROR, CARELESS_CALCULATION).
    `;

    // Helper: Safely handle question formatting
    const getQText = (rawText, shortText) => {
      if (isShort) return shortText;
      return rawText;
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

    throw new Error(`Variant '${variant}' not valid for difficulty '${difficulty}' in Multi-Digit Addition`);
  }
};
