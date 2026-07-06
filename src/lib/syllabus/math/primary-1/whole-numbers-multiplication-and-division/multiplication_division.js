/**
 * Blueprint for Primary 1: Multiplication and Division
 * FOCUS: Concepts of Equal Groups, Sharing, and Grouping.
 */
import { emojiObjects } from '@/lib/utils/variable-bank';
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
    foundation_grouping_interactive: "Interactive: Group items into sets of a specific size.",
    foundation_sharing_interactive: "Interactive: Share items equally into a given number of groups.",
    foundation_recognize_equal_groups: "Identify which picture shows equal groups.",
    foundation_count_equal_groups: "Count the number of equal groups and items in each group.",
    foundation_repeated_addition: "Match a picture of equal groups to a repeated addition sentence.",

    standard_array_rows_cols: "Find the total items in an array (rows and columns).",
    standard_sharing_missing_each: "Find how many in each group (Sharing).",
    standard_grouping_missing_groups: "Find the number of groups (Grouping).",
    standard_array_equations: "Select the multiplication equation that matches the given array.",
    standard_identify_division_sentence: "Match a picture of sharing/grouping to the correct division sentence.",

    advanced_grouping_need_more: "Multi-step: Grouping and finding how many more needed.",
    advanced_multi_step_sharing_add: "Multi-step: Share items equally, then one person receives more.",
    advanced_logic_wheels_legs: "Logic Puzzle: Count total attributes (e.g., wheels/legs) across different groups.",
    advanced_two_entities_total: "Multi-step: Find the total of two different grouped quantities.",
    advanced_two_entities_diff: "Multi-step: Find the difference between two grouped quantities."
  },

  generate: (difficulty = 'foundation', variant = 'foundation_grouping_interactive', type = 'MCQ') => {
    let safeType = String(type).toLowerCase();
    let isShort = safeType.includes('short');
    let isStructure = safeType.includes('structure') || safeType.includes('structured');
    let isMCQ = safeType.includes('mcq');

    let activeVariant = variant;
    const isMissing = !multiplicationDivisionBlueprint.variants[activeVariant];
    
    const forceMCQVariants = ['foundation_recognize_equal_groups', 'foundation_count_equal_groups', 'foundation_repeated_addition'];
    
    const violatesShort = isShort && activeVariant && (activeVariant.includes('word_problem') || activeVariant.includes('interactive') || forceMCQVariants.includes(activeVariant) || (activeVariant.includes('logic') && !activeVariant.includes('advanced')));
    const violatesStructure = isStructure && activeVariant && (!activeVariant.includes('word_problem') && !activeVariant.includes('logic') && !activeVariant.includes('interactive') && !activeVariant.includes('standard') && !activeVariant.includes('advanced'));

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
          k.includes('standard') || k.includes('advanced')
        );
      }

      activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)] || 'foundation_grouping_interactive';
    }

    // STRICT TYPE OVERRIDES: Prevent UI from forcing wrong types for visual/interactive variants
    if (activeVariant.includes('interactive')) {
      isStructure = true;
      isShort = false;
      isMCQ = false;
    } else if (forceMCQVariants.includes(activeVariant)) {
      isMCQ = true;
      isShort = false;
      isStructure = false;
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
    const supportsStructured = Object.keys(multiplicationDivisionBlueprint.variants).some(v => v.includes('advanced'));

    const getQText = (story, equation, type) => {
      if (story === equation) return story;
      
      if (supportsStructured) {
        if (type === 'SHORT_QUESTION') return equation;
        return story; // MCQ and Structured
      }
      return type === 'SHORT_QUESTION' ? equation : story;
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

    // FIX: Pull directly from the 50+ item variable bank
    const itemData = emojiObjects[Math.floor(Math.random() * emojiObjects.length)];
    context.selectedItem = itemData; // Inject for logic files to use

    const cleanItemLabel = typeof itemData === 'string'
      ? itemData
      : (itemData.item || itemData.name?.singular || itemData.name || 'item');

    if (String(cleanItemLabel).includes('[object')) console.warn("⚠️ [Blueprint: Mult/Div] Context item extraction failed for:", itemData);

    // Dynamic visual item selection
    const selectedIcon = itemData?.icon || '⭐';

    // Visuals are extremely helpful for Primary 1 students, so we always show them across all question types
    const hideVisual = false;

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