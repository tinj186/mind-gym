/**
 * Blueprint for Primary 1: Measurement - Length (cm)
 */
import { getRandomContext } from '@/lib/utils/localization';
import { foundationLogic } from './length/foundation';
import { standardLogic } from './length/standard';
import { advancedLogic } from './length/advanced';

export const lengthBlueprint = {
  id: 'p1-measurement-length',
  title: 'Length',
  strand: 'Measurement and Geometry',
  visualType: 'DYNAMIC',

  difficultyLevels: {
    foundation: {
      name: 'Reading a cm Ruler',
      steps: 1,
      logicDescription: "Reading single item lengths in cm."
    },
    standard: {
      name: 'Measurement Differences in cm',
      steps: 2,
      logicDescription: "Calculating differences and measuring misaligned objects in cm."
    },
    advanced: {
      name: 'Multi-Step Length Word Problems',
      steps: 3,
      logicDescription: "Solving multi-step word problems involving positional arithmetic differences in cm."
    }
  },

  variants: {
    foundation_unit_counting: "Measuring item length in cm.",
    foundation_identify_by_length: "Finding which specific object matches a given cm length.",
    foundation_true_false_length: "Evaluating a true or false statement about an object's length.",
    foundation_longer_than_target: "Identifying which object is longer than a specified length.",
    foundation_shorter_than_target: "Identifying which object is shorter than a specified length.",
    
    standard_baseline_error_check: "Detecting errors in length measurement when objects do not share a common baseline.",
    standard_unit_difference_mcq: "Calculating the arithmetic difference in cm between two items.",
    standard_mid_grid_alignment: "Calculating length for an object not starting at the zero mark.",
    standard_baseline_comparison: "Identifying the longest object among three objects measured in cm.",
    standard_ordering_ascending: "Ordering three objects from shortest to longest based on their lengths in cm.",
    
    advanced_indirect_difference: "Calculating missing length dimensions by adding or subtracting cm.",
    advanced_misaligned_start: "Determining the true length of an object when it does not align with the zero baseline.",
    advanced_combined_total: "Calculating the total combined length of two or more objects in cm.",
    advanced_overlap_deduction: "Solving word problems where two objects overlap and calculating the net length.",
    advanced_multi_step_word_problems: "Solving two-step story problems involving cutting or extending object lengths.",
    advanced_part_whole_missing: "Finding the length of a missing segment when provided with the total structural length.",
    advanced_perimeter_units: "Counting cm units around a multi-sided basic shape grid."
  },

  generate: (difficulty = 'foundation', variant = 'foundation_unit_counting', type = 'MCQ') => {
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
    if (!lengthBlueprint.variants[finalVariant]) {
      const validVariants = Object.keys(lengthBlueprint.variants).filter(k => k.startsWith(finalDifficulty));
      if (validVariants.length > 0) {
        activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
      } else {
        activeVariant = 'foundation_unit_counting';
      }
    }

    const config = lengthBlueprint.difficultyLevels[finalDifficulty] || lengthBlueprint.difficultyLevels.foundation;
    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = finalDifficulty.charAt(0).toUpperCase() + finalDifficulty.slice(1);
    const level = 'Primary 1';
    const topic = 'Measurement - Length';
    const subtopic = 'Length Measurement (cm)';

    const getQText = (words, equation) => isShort ? equation : words;
    const levelNum = parseInt(level.replace('Primary ', ''));
    const tier = levelNum <= 2 ? 'LOWER_BLOCK' : (levelNum <= 4 ? 'MIDDLE_BLOCK' : 'UPPER_BLOCK');
    const context = getRandomContext('GENERAL', tier);

    const hintProtocol = `\nCRITICAL HINT PROTOCOL: You MUST provide a conceptual "hint" field in your JSON. Focus on cm measurement.`;

    let formatInstructions = isMCQ
      ? `Format as MCQ. Include an "options" array with 4 choices. "finalAnswer" must exactly match one of the options.${hintProtocol}`
      : isStructure
        ? `Format as Structured Multi-step. The "options" field should be null. You MUST fill in the "expectedAnswer" values in the "inputRequirement.steps" array with the specific item lengths and final answer. CRITICAL: The "expectedAnswer" of the final step MUST EXACTLY match the "finalAnswer" string (including units if present)!${hintProtocol}`
        : `Format as Short Answer. The "options" field in your JSON should be null.${hintProtocol}`;

    if (activeVariant.startsWith('foundation_')) {
      return foundationLogic(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
    }

    if (activeVariant.startsWith('standard_')) {
      return standardLogic(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
    }

    if (activeVariant.startsWith('advanced_')) {
      return advancedLogic(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
    }

    throw new Error(`Variant '${finalVariant}' not valid.`);
  }
};
