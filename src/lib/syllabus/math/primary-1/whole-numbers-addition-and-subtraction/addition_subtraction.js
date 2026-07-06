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
    foundation_add_word_problem_20: "Solve a 1-step addition word problem within 20.",
    foundation_sub_word_problem_20: "Solve a 1-step subtraction word problem within 20.",
    foundation_add_three_single_digits: "Add three 1-digit numbers with sum up to 20.",

    standard_sub_100_no_regroup: "Subtract two 2-digit numbers within 100 without regrouping.",
    standard_comparison_more_basic: "Solve 'How many more' problems within 40 (no regrouping).",
    standard_comparison_fewer_basic: "Solve 'How many fewer' problems within 40 (no regrouping).",
    standard_two_step_subtraction_no_regroup: "Solve a 2-step subtraction word problem within 100 (no regrouping).",
    standard_add_sub_mixed_no_regroup: "Solve a 2-step word problem involving both addition and subtraction within 100 (no regrouping).",

    advanced_sub_regrouping: "Subtract two numbers within 100 with regrouping.",
    advanced_comparative_more: "Solve 'more than' problems (e.g., What is X more than Y?).",
    advanced_comparative_less: "Solve 'less than' problems (e.g., What is X less than Y?).",
    advanced_cross_ordinal_queue: "Solve problems involving positions in a queue (ordinal logic).",
    advanced_working_backwards: "Find the starting amount using the 'working backwards' heuristic.",
    advanced_two_step_total: "Solve 2-step word problems involving a comparison and a total sum."
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
    const checkIsStrictWordProblem = (v) => v.includes('word_problem') || v.includes('ordinal');
    const checkIsAllowedForStructuredOrMCQ = (v) => checkIsStrictWordProblem(v) || v.includes('regroup') || v.includes('missing_addend') || v.includes('number_bond') || v.includes('add_20') || v.includes('sub_20') || v.includes('missing_subtrahend') || v.includes('balance_equations') || v.includes('working_backwards') || v.includes('two_step_total') || v.includes('shape_substitution') || v.includes('missing_digit_regrouping') || v.includes('visual_cross_out') || v.includes('fact_family_cards') || v.includes('equation_equivalence') || v.includes('add_three_numbers') || v.includes('comparison') || v.includes('comparative');

    const isStrictWordProblem = checkIsStrictWordProblem(activeVariant);
    const supportsEquation = !isStrictWordProblem;
    const violatesShort = isShort && !supportsEquation;
    const isAllowedForStructuredOrMCQ = checkIsAllowedForStructuredOrMCQ(activeVariant);
    const violatesStructuredOrMCQ = (isStructure || isMCQ) && !isAllowedForStructuredOrMCQ;

    if (!additionSubtractionBlueprint.variants[variant] || violatesShort || violatesStructuredOrMCQ) {
      const safeDiff = String(difficulty).toLowerCase();
      let validVariants = Object.keys(additionSubtractionBlueprint.variants).filter(k => k.startsWith(safeDiff));

      if (isShort) {
        validVariants = validVariants.filter(k => !checkIsStrictWordProblem(k));
      } else if (isStructure || isMCQ) {
        validVariants = validVariants.filter(k => checkIsAllowedForStructuredOrMCQ(k));
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
      // Prevent duplication
      if (story === equation) return story;

      // RULE 1: If it's a 3-Type syllabus (has Structured questions)
      if (supportsStructured) {
        if (zodType === 'SHORT_QUESTION') return equation; // Simplified, no backstory
        return story; // For STRUCTURED and MCQ, use the story template
      }

      // RULE 2: If it's a 2-Type syllabus (Short & MCQ only)
      if (zodType === 'SHORT_QUESTION') {
        return equation; // Brief description or equation
      }
      return story; // MCQ
    };

    const formatInstructions = isShort ? 'CRITICAL: NEVER ask the student to "show working" or "write working" in the question text.' : '';
    const levelNum = parseInt(level.replace('Primary ', ''));
    const tier = levelNum <= 2 ? 'LOWER_BLOCK' : (levelNum <= 4 ? 'MIDDLE_BLOCK' : 'UPPER_BLOCK');
    const context = getRandomContext('GENERAL', tier);
    const itemData = context?.selectedItem || context.items[Math.floor(Math.random() * context.items.length)] || { name: 'item', icon: '⭐' };

    // Robust extraction to prevent [object Object]
    const displayName = (typeof itemData === 'object' && itemData !== null)
      ? (itemData.singular || itemData.item || itemData.name?.singular || itemData.name || 'item')
      : typeof itemData === 'string'
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