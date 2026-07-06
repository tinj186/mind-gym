/**
 * Blueprint for Primary 1: Length Comparison (cm)
 */
import { getRandomContext } from '@/lib/utils/localization';
import { foundationLogic } from './length-comparison-cm/foundation';
import { standardLogic } from './length-comparison-cm/standard';
import { advancedLogic } from './length-comparison-cm/advanced';

export const lengthComparisonCmBlueprint = {
  id: 'p1-length-comparison-cm',
  title: 'Length Comparison (cm)',
  strand: 'Measurement and Geometry',
  visualType: 'DYNAMIC',

  difficultyLevels: {
    foundation: {
      name: 'Basic Comparison',
      steps: 1,
      logicDescription: "Comparing two items and identifying equal lengths."
    },
    standard: {
      name: 'Ordering and Transitive Logic',
      steps: 2,
      logicDescription: "Evaluating relative lengths of multiple objects and ordering them."
    },
    advanced: {
      name: 'Indirect Comparison Logic',
      steps: 3,
      logicDescription: "Solving multi-step logic problems to compare objects."
    }
  },

  variants: {
    foundation_compare_two: "Comparing exactly two objects to identify which is longer or shorter.",
    foundation_find_same: "Identifying which two objects out of three have the exact same length.",
    foundation_true_false: "Evaluating a True/False statement about the relative lengths of two objects.",
    
    standard_baseline_comparison: "Comparing 3 distinct objects aligned horizontally to find the longest/shortest.",
    standard_find_shortest: "Identifying the shortest object among 3 items aligned horizontally.",
    standard_vertical_baseline: "Comparing height vectors of objects standing on a common ground baseline.",
    standard_ordering_ascending: "Ordering 3 items from shortest to longest.",
    standard_ordering_descending: "Ordering 3 items from longest to shortest.",
    standard_transitive_logic: "Deducing the longest or shortest item using transitive word logic.",
    standard_as_long_as: "Identifying objects with equal lengths among a set.",
    
    advanced_indirect_comparison: "Using transitive logic to compare and order three or more objects based on text clues.",
    advanced_excess_comparison: "Calculating exactly how many more or fewer cm an object requires to match a target reference length."
  },

  generate: (difficulty = 'foundation', variant = 'foundation_compare_two', type = 'MCQ') => {
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
    if (!lengthComparisonCmBlueprint.variants[finalVariant]) {
      const validVariants = Object.keys(lengthComparisonCmBlueprint.variants).filter(k => k.startsWith(finalDifficulty));
      if (validVariants.length > 0) {
        activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
      } else {
        activeVariant = 'foundation_compare_two';
      }
    }

    const config = lengthComparisonCmBlueprint.difficultyLevels[finalDifficulty] || lengthComparisonCmBlueprint.difficultyLevels.foundation;
    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = finalDifficulty.charAt(0).toUpperCase() + finalDifficulty.slice(1);
    const level = 'Primary 1';
    const topic = 'Measurement - Length';
    const subtopic = 'Length Comparison (cm)';

    const getQText = (words, equation) => isShort ? equation : words;
    const levelNum = parseInt(level.replace('Primary ', ''));
    const tier = levelNum <= 2 ? 'LOWER_BLOCK' : (levelNum <= 4 ? 'MIDDLE_BLOCK' : 'UPPER_BLOCK');
    const context = getRandomContext('GENERAL', tier);

    const hintProtocol = `\nCRITICAL HINT PROTOCOL: You MUST provide a conceptual "hint" field in your JSON. Focus on comparing lengths.`;

    let formatInstructions = isMCQ
      ? `Format as MCQ. Include an "options" array with 4 choices. "finalAnswer" must exactly match one of the options.${hintProtocol}`
      : isStructure
        ? `Format as Structured Multi-step. The "options" field should be null. You MUST fill in the "expectedAnswer" values in the "inputRequirement.steps" array.${hintProtocol}`
        : `Format as Short Answer. The "options" field in your JSON should be null.${hintProtocol}`;

    if (activeVariant.startsWith('foundation_')) {
      return foundationLogic.generate(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText);
    }

    if (activeVariant.startsWith('standard_')) {
      return standardLogic.generate(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText);
    }

    if (activeVariant.startsWith('advanced_')) {
      return advancedLogic.generate(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText);
    }

    throw new Error(`Variant '${finalVariant}' not valid.`);
  }
};
