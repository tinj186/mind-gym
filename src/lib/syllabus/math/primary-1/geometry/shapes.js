/**
 * Coordinator for 2D Shapes syllabus.
 * PATH: src/lib/syllabus/math/primary-1/geometry/shapes.js
 */
import { getRandomContext } from '@/lib/utils/localization';
import { foundationLogic } from './shapes/foundation';
import { standardLogic } from './shapes/standard';
import { advancedLogic } from './shapes/advanced';

export const shapesBlueprint = {
  id: 'p1-geometry-shapes',
  title: '2D Shapes',
  strand: 'Geometry',
  visualType: 'DYNAMIC',

  difficultyLevels: {
    foundation: {
      name: 'Identifying & Classifying',
      steps: 1,
      logicDescription: "Recognizing basic shapes and grouping them by attributes."
    },
    standard: {
      name: 'Composite Shapes & Patterns',
      steps: 2,
      logicDescription: "Counting shapes in complex drawings and completing simple patterns."
    },
    advanced: {
      name: 'Complex Patterns & Attribute Logic',
      steps: 3,
      logicDescription: "Patterns with multiple attributes and multi-step attribute deduction."
    }
  },

  variants: {
    foundation_identify_shape: "Identifying single shapes in various orientations.",
    foundation_classify_attribute: "Classifying shapes by color, shape, or size.",
    foundation_count_sides: "Counting the number of straight sides on basic shapes (up to 4 sides) to reinforce structural differences.",
    foundation_size_comparison: "Identifying or comparing identical shape structures across distinct sizing metrics (e.g., finding the smallest square in a cluster).",
    foundation_match_real_object: "Matching abstract 2D geometric shapes to illustrations or photos of everyday real-world items (e.g., a clock face matching a circle, or a door matching a rectangle).",

    standard_count_composite: "Counting individual shapes within a composite drawing.",
    standard_pattern_next: "Identifying the next shape in a single-attribute pattern.",
    standard_pattern_missing_middle: "Finding the missing shape hidden in the middle of a repeating single-attribute pattern sequence.",
    standard_compose_shapes: "Identifying the new larger shape formed by physically joining two identical basic shapes together.",
    standard_decompose_shape: "Identifying the smaller shapes created when a larger shape is cut exactly in half.",
    standard_most_frequent_shape: "Analyzing a composite drawing to determine which shape is used the most or the least.",
    standard_shape_riddles: "Solving a simple text riddle based on a shape's basic properties (sides).",
    standard_pattern_mistake: "Identifying the single shape that breaks a repeating pattern rule.",
    standard_find_all_target_shape: "Scanning a mixed grid of shapes and counting all instances of a specific target shape, ignoring size or rotation.",
    standard_match_composite_parts: "Matching a composite drawing to the exact decomposed inventory list of individual shapes used to build it.",

    advanced_pattern_two_attributes: "Identifying the next item in a two-attribute pattern.",
    advanced_attribute_logic: "Identifying shapes that satisfy multiple attribute constraints.",
    advanced_pattern_three_attributes: "Extrapolating the next item in a complex pattern where shape, color, and size change simultaneously.",
    advanced_pattern_retrograde_logic: "Deducing a missing sequence item at the start or middle of an advanced shape pattern array using reverse logical analysis.",
    advanced_shape_exclusion_riddles: "Identifying a unique shape from a mixed array using intersecting negative or exclusion logic property rules.",
    advanced_embedded_counting: "Counting identical geometric sub-shapes overlapping or nested inside larger multi-layered shapes.",
    advanced_composite_deconstruct_inventory: "Decomposing a complex generative drawing into a complete multi-shape inventory list with accurate counts.",
    advanced_attribute_matrix_intersection: "Identifying shapes that satisfy intersecting row and column attribute constraints simultaneously.",
    advanced_orientation_invariance: "Recognizing and validating base shape categories when items undergo severe rotation steps.",
    advanced_conservation_of_shapes: "Solving problems assessing shape identity permanence and total part count preservation after spatial re-arrangements.",
  },

  generate: (difficulty = 'foundation', variant = 'foundation_identify_shape', type = 'MCQ') => {
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
    if (!shapesBlueprint.variants[finalVariant]) {
      const validVariants = Object.keys(shapesBlueprint.variants).filter(k => k.startsWith(finalDifficulty));
      if (validVariants.length > 0) {
        activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
      } else {
        activeVariant = 'foundation_identify_shape'; 
      }
    }

    const config = shapesBlueprint.difficultyLevels[finalDifficulty] || shapesBlueprint.difficultyLevels.foundation;
    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = finalDifficulty.charAt(0).toUpperCase() + finalDifficulty.slice(1);
    const level = 'Primary 1';
    const topic = 'Geometry';

    const getQText = (words, equation) => isShort ? equation : words;
    const levelNum = parseInt(level.replace('Primary ', ''));
    const tier = levelNum <= 2 ? 'LOWER_BLOCK' : (levelNum <= 4 ? 'MIDDLE_BLOCK' : 'UPPER_BLOCK');
    const context = getRandomContext('GENERAL', tier);

    const hintProtocol = `\nCRITICAL HINT PROTOCOL: You MUST provide a conceptual "hint" field in your JSON. Focus on identifying properties of shapes like corners and sides.`;

    let formatInstructions = isMCQ 
      ? `Format as MCQ. Include an "options" array with 4 choices. "finalAnswer" must exactly match one of the options.${hintProtocol}` 
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