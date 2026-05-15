/**
 * Blueprint for Primary 1: Addition and Subtraction
 * ENGINE: Generates AI prompt constraints, strictly pre-calculating math logic.
 * ARCHITECTURE: Pre-calculates numbers and distractors to prevent AI hallucinations.
 */
import { getRandomContext } from '@/lib/utils/localization';
import { foundationLogic } from './addition-subtraction/foundation';
import { standardLogic } from './addition-subtraction/standard';
import { advancedLogic } from './addition-subtraction/advanced';

export const additionSubtractionBlueprint = {
  id: 'p1-addition-subtraction',
  title: 'Addition and Subtraction',
  strand: 'Number and Algebra',
  visualType: 'DYNAMIC', // Visual type is determined by the sub-modules

  // 1. OVERARCHING CONDITIONS
  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 20,
      logicDescription: "Addition and subtraction within 20, missing addends, and number bonds."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      maxNumber: 100,
      logicDescription: "Addition and subtraction within 100 without regrouping, and basic word problems."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 3,
      maxNumber: 100,
      logicDescription: "Addition and subtraction within 100 with regrouping, comparative problems, and ordinal queue logic."
    }
  },

  // 2. STRICT VARIANTS
  variants: {
    foundation_add_20: "Add two numbers within 20.",
    foundation_sub_20: "Subtract two numbers within 20.",
    foundation_missing_addend: "Find the missing addend in an equation within 20.",
    foundation_number_bond_logic: "Find the missing part in a number bond within 20.",

    standard_add_100_no_regroup: "Add two 2-digit numbers within 100 without regrouping.",
    standard_sub_100_no_regroup: "Subtract two 2-digit numbers within 100 without regrouping.",
    standard_add_three_numbers: "Add three 1-digit numbers with sums up to 20.",
    standard_missing_addend_100: "Find the missing addend in a 2-digit equation (no regrouping).",
    standard_missing_subtrahend_100: "Find the missing subtrahend in a 2-digit equation (no regrouping).",
    standard_related_fact_families: "Use addition facts to solve related subtraction problems.",
    standard_comparison_more_basic: "Solve 'How many more' problems within 40 (no regrouping).",
    standard_comparison_fewer_basic: "Solve 'How many fewer' problems within 40 (no regrouping).",
    standard_number_bond_multiples_10: "Complete a number bond within 100 (e.g., 85 = 50 + ?).",

    advanced_add_regrouping: "Add two numbers within 100 with regrouping.",
    advanced_sub_regrouping: "Subtract two numbers within 100 with regrouping.",
    advanced_comparative_more: "Solve 'more than' problems (e.g., What is X more than Y?).",
    advanced_comparative_less: "Solve 'less than' problems (e.g., What is X less than Y?).",
    advanced_cross_ordinal_queue: "Solve problems involving positions in a queue (ordinal logic).",
    advanced_balance_equations: "Find the missing number to balance an equation (e.g., 12 + 5 = 10 + ?).",
    advanced_working_backwards: "Find the starting amount using the 'working backwards' heuristic.",
    advanced_two_step_total: "Solve 2-step word problems involving a comparison and a total sum.",
    advanced_shape_substitution: "Find the value of a symbol using simultaneous logic (e.g., A + A = 10).",
    advanced_missing_digit_regrouping: "Find a missing digit in a 2-digit addition equation requiring regrouping."
  },

  // 3. GENERATION ENGINE
  generate: (difficulty = 'foundation', variant = 'foundation_add_20', type = 'MCQ') => {
    const safeType = String(type).toLowerCase();
    const isShort = safeType.includes('short');
    const isStructure = safeType.includes('structure') || safeType.includes('structured');
    const isMCQ = safeType.includes('mcq');

    let activeVariant = variant;

    // 1. Variant Filtering based on Type
    // Short questions are equations, Structured/MCQ are word problems
    const isStrictWordProblem = activeVariant.includes('word_problem') || activeVariant.includes('comparative') || activeVariant.includes('ordinal') || activeVariant.includes('comparison');
    const supportsEquation = !isStrictWordProblem; // add_20, missing_addend, number_bond, etc. all support equations
    const violatesShort = isShort && !supportsEquation;
    const isAllowedForStructuredOrMCQ = isStrictWordProblem || activeVariant.includes('regrouping') || activeVariant.includes('missing_addend') || activeVariant.includes('number_bond') || activeVariant.includes('add_20') || activeVariant.includes('sub_20') || activeVariant.includes('missing_subtrahend') || activeVariant.includes('balance_equations') || activeVariant.includes('working_backwards') || activeVariant.includes('two_step_total') || activeVariant.includes('shape_substitution') || activeVariant.includes('missing_digit_regrouping');
    const violatesStructuredOrMCQ = (isStructure || isMCQ) && !isAllowedForStructuredOrMCQ;

    if (!additionSubtractionBlueprint.variants[variant] || violatesShort || violatesStructuredOrMCQ) {
      const safeDiff = String(difficulty).toLowerCase();
      let validVariants = Object.keys(additionSubtractionBlueprint.variants).filter(k => k.startsWith(safeDiff));

      if (isShort) {
        validVariants = validVariants.filter(k => !k.includes('word_problem') && !k.includes('comparative') && !k.includes('ordinal') && !k.includes('comparison'));
      } else if (isStructure || isMCQ) {
        validVariants = validVariants.filter(k => isAllowedForStructuredOrMCQ); // Filter based on the new comprehensive allowance list
      }

      if (validVariants.length > 0) {
        activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
      } else {
        activeVariant = 'foundation_add_20'; // Fallback
      }
    }

    // Prepare Zod Schema Meta
    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    const level = 'Primary 1';
    const topic = 'Whole Numbers';

    // UNIVERSAL ENGINE: Question Type Constitution
    const supportsStructured = Object.keys(additionSubtractionBlueprint.variants).some(v => v.includes('advanced'));

    const getQText = (story, equation) => {
      // RULE 1: If it's a 3-Type syllabus (has Structured questions)
      if (supportsStructured) {
        if (zodType === 'SHORT_QUESTION') return equation; // Simplified, no backstory
        if (zodType === 'STRUCTURED') return story; // Complex descriptive
        return `${story} ${equation}`; // MCQ: Combination
      }

      // RULE 2: If it's a 2-Type syllabus (Short & MCQ only)
      if (zodType === 'SHORT_QUESTION') {
        return story || equation; // Brief description or equation
      }
      return `${story} ${equation}`; // MCQ
    };

    const formatInstructions = ''; // Creative instructions are handled within the aiPrompt of sub-modules
    const levelNum = parseInt(level.replace('Primary ', ''));
    const tier = levelNum <= 2 ? 'LOWER_BLOCK' : (levelNum <= 4 ? 'MIDDLE_BLOCK' : 'UPPER_BLOCK');
    const context = getRandomContext('GENERAL', tier);
    const itemData = context?.selectedItem || context.items[Math.floor(Math.random() * context.items.length)] || { name: 'item', icon: '⭐' };

    // Robust extraction to prevent [object Object]
    const displayName = typeof itemData === 'string' 
      ? itemData 
      : (itemData.singular || itemData.name || 'item');

    const selectedIcon = itemData?.icon || '⭐';

    const hideVisual = false; // Visuals are controlled by sub-modules based on isShortQ

    if (activeVariant.startsWith('foundation_')) {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, displayName, getQText, selectedIcon, hideVisual);
    }

    if (activeVariant.startsWith('standard_')) {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, displayName, getQText, selectedIcon, hideVisual);
    }

    if (activeVariant.startsWith('advanced_')) {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, displayName, getQText, selectedIcon, hideVisual);
    }

    throw new Error(`Variant '${variant}' not valid for difficulty '${difficulty}'`);
  }
};