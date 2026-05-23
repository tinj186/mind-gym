/**
 * Blueprint for Primary 1: Measurement - Length
 * FOCUS: Non-standard unit estimation, baseline comparison matrices, and logical length differences.
 * PATH: src/lib/syllabus/math/primary-1/measurement/length.js
 */
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
      name: 'Non-Standard Unit Counting & Basic Comparison',
      steps: 1,
      logicDescription: "Counting units, comparing two items, and identifying equal lengths."
    },
    standard: {
      name: 'Direct Baseline Comparison',
      steps: 2,
      logicDescription: "Evaluating relative lengths (longest, shortest) of multiple objects."
    },
    advanced: {
      name: 'Indirect Logic & Operational Differences',
      steps: 3,
      logicDescription: "Solving multi-step word problems involving positional arithmetic differences."
    }
  },

  variants: {
    // Expanded Foundation Tier
    foundation_unit_counting: "Counting item length using lined-up identical unit objects.",
    foundation_compare_two: "Comparing exactly two objects to identify which is longer or shorter.",
    foundation_find_same: "Identifying which two objects out of three have the exact same length.",
    foundation_identify_by_length: "Finding which specific object matches a given unit length.",
    foundation_true_false: "Evaluating a True/False statement about the relative lengths of two objects.",
    
    // Standard & Advanced
//    standard_baseline_comparison: "Comparing 3 distinct objects aligned horizontally to find the longest/shortest.",
//    standard_find_shortest: "Identifying the shortest object among 3 items aligned horizontally.",
//    standard_vertical_baseline: "Comparing height vectors of objects standing on a common ground baseline.",
//    standard_ordering_ascending: "Ordering 3 items from shortest to longest.",
//    standard_ordering_descending: "Ordering 3 items from longest to shortest.",
//    standard_transitive_logic: "Deducing the longest or shortest item using transitive word logic (A > B, B > C).",
    standard_baseline_error_check: "Detecting errors in length comparison when objects do not share a common baseline.",
    standard_as_long_as: "Identifying objects with equal lengths among a set.",
    standard_unit_difference_mcq: "Calculating the arithmetic difference in non-standard units between two items.",
//    standard_mid_grid_alignment: "Calculating length for an object not starting at the grid baseline.",
   
    advanced_indirect_difference: "Calculating missing length dimensions by adding or subtracting non-standard object units."
  }
};

/**
 * Orchestrator for Length Generation
 * Attached to the blueprint for the global generator to find.
 */
lengthBlueprint.generate = function(difficulty, variant, type) {
  let activeVariant = variant || '';
  
  // 🛡️ THE FIX: Extract all valid variants registered in this blueprint
  const validVariants = Object.keys(lengthBlueprint.variants);
  
  // 🛡️ THE FIX: If the frontend sends an empty variant, or a legacy variant 
  // (like 'visual_line' from another topic), gracefully overwrite it!
  if (!activeVariant || !validVariants.includes(activeVariant)) {
    if (difficulty?.toLowerCase() === 'standard') {
      activeVariant = 'standard_baseline_comparison';
    } else if (difficulty?.toLowerCase() === 'advanced') {
      activeVariant = 'advanced_indirect_difference';
    } else {
      activeVariant = 'foundation_unit_counting';
    }
  }

  const normType = type?.toUpperCase()?.replace(/\s/g, '_') || 'SHORT_QUESTION';
  const isMCQ = normType === 'MCQ' || normType === 'MCQ_BUTTONS';
  const isShort = normType === 'SHORT_QUESTION';
  const isStructure = normType === 'STRUCTURED';

  const zodType = normType;
  const zodDiff = (difficulty || 'foundation').toUpperCase();
  const level = "Primary 1";
  const topic = "Measurement";

  if (activeVariant.startsWith('foundation_')) {
    return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic);
  }
  if (activeVariant.startsWith('standard_')) {
    return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic);
  }
  if (activeVariant.startsWith('advanced_')) {
    return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic);
  }

  // This fallback error will theoretically never be hit now, but remains for safety
  throw new Error(`Variant '${activeVariant}' not supported inside Length engine.`);
};