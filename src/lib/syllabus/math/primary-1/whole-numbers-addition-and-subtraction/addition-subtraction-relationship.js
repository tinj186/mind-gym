import { foundationLogic } from './addition-subtraction-relationship/foundation';
import { standardLogic } from './addition-subtraction-relationship/standard';
import { advancedLogic } from './addition-subtraction-relationship/advanced';

export const additionSubtractionRelationshipBlueprint = {
  id: 'p1-addition-subtraction-relationship',

  // 1. DIFFICULTY LEVELS
  levels: {
    foundation: {
      name: 'Fact Families (Foundation)',
      steps: 1,
      maxNumber: 20,
      logicDescription: "Understand commutative addition and inverse addition/subtraction facts.",
      logic: 'Direct Inverse Operations'
    },
    standard: {
      name: 'Fact Families (Standard)',
      steps: 2,
      maxNumber: 40,
      logicDescription: "Use fact families for 2-step deductions, start-unknown word problems, and basic balancing.",
      logic: '2-Step Inverse Operations'
    },
    advanced: {
      name: 'Fact Families (Advanced)',
      steps: 3,
      maxNumber: 100,
      logicDescription: "Multi-step logic puzzles and algebra-style deductions using addition and subtraction relationships.",
      logic: '3-Step Deductive Reasoning'
    }
  },

  // 2. STRICT VARIANTS
  variants: {
    // Foundation
    foundation_commutative_addition: "Commutative addition: a + b = c -> b + a = ?",
    foundation_addition_to_subtraction: "Inverse relationship: a + b = c -> c - a = ?",
    foundation_subtraction_to_addition: "Inverse relationship: c - b = a -> a + b = ?",
    foundation_identify_fact_family: "Identify a valid related equation from 3 numbers.",
    foundation_missing_family_member: "Identify the 4th missing related equation.",
    
    // Standard
    standard_missing_part_family: "Use inverse operation to find a missing part in an equation.",
    standard_inverse_word_problem: "Solve a start-unknown word problem using inverse operations.",
    standard_identify_wrong_family_member: "Identify the incorrect equation among 4 related equations.",
    standard_balance_with_inverse: "Find the missing number to balance an equation (e.g. 25 - 5 = 10 + ?).",
    standard_related_subtraction_to_subtraction: "Use one subtraction fact to solve a related subtraction fact.",
    
    // Advanced
    advanced_chained_inverse: "Solve a missing number in a 2-step equation chain using inverse operations.",
    advanced_two_step_start_unknown_word_problem: "Solve a 2-step word problem where the starting amount is unknown.",
    advanced_find_missing_in_multi_part_whole: "Find a missing part when given a whole and 2 other parts (e.g. 20+30+?=90).",
    advanced_balance_multi_term: "Balance an equation with 3 terms on one side (e.g. 100 - 20 = 40 + 15 + ?).",
    advanced_related_equations_puzzle: "Solve an algebraic shape puzzle using inverse relationships."
  },

  // 3. GENERATION ENGINE
  generate: (difficulty = 'foundation', variant = 'foundation_commutative_addition', type = 'MCQ') => {
    const safeType = String(type).toLowerCase();
    const isShort = safeType.includes('short');
    const isStructure = safeType.includes('structure') || safeType.includes('structured');
    const isMCQ = safeType.includes('mcq');
    let activeVariant = variant;

    // 1. Ensure the variant exists (Fallback only if invalid)
    if (!additionSubtractionRelationshipBlueprint.variants[variant]) {
      const safeDiff = String(difficulty).toLowerCase();
      let validVariants = Object.keys(additionSubtractionRelationshipBlueprint.variants).filter(k => k.startsWith(safeDiff));
      if (validVariants.length > 0) {
        activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
      } else {
        activeVariant = 'foundation_commutative_addition';
      }
    }

    // Force short questions to use simpler variants instead of typing full equations
    if (isShort && (activeVariant === 'foundation_identify_fact_family' || activeVariant === 'foundation_missing_family_member')) {
      activeVariant = 'foundation_addition_to_subtraction';
    }
    
    if (isShort && activeVariant === 'standard_identify_wrong_family_member') {
      activeVariant = 'standard_missing_part_family';
    }

    // Prepare Zod Schema Meta
    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    const level = "Primary 1";
    const topic = "Addition and Subtraction Relationship";

    const formatInstructions = isMCQ 
      ? "Return EXACTLY 4 options. ONE correct, THREE distractors." 
      : isShort 
        ? "Return EXACTLY 1 correct final answer." 
        : "Return EXACTLY 1 correct final answer and step-by-step solutions.";

    const getQText = (raw, short) => isShort ? short : raw;

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

    throw new Error(`Variant '${variant}' not valid for difficulty '${difficulty}' in Addition Subtraction Relationship`);
  }
};
