/**
 * Coordinator for 2D Shapes syllabus.
 * PATH: src/lib/syllabus/math/primary-1/geometry/shapes.js
 */
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
  }
};

export default function shapesSyllabusEntry(variant, difficulty, type) {
  let activeVariant = variant || '';
  const validVariants = Object.keys(shapesBlueprint.variants);

  if (!activeVariant || !validVariants.includes(activeVariant)) {
    activeVariant = difficulty?.toLowerCase() === 'standard' ? 'standard_count_composite' :
      difficulty?.toLowerCase() === 'advanced' ? 'advanced_pattern_two_attributes' :
        'foundation_identify_shape';
  }

  const zodDiff = (difficulty || 'foundation').toUpperCase();

  if (activeVariant.startsWith('foundation_')) return foundationLogic(activeVariant, difficulty, type, false, false, false, type, zodDiff, "Primary 1", "Geometry");
  if (activeVariant.startsWith('standard_')) return standardLogic(activeVariant, difficulty, type, false, false, false, type, zodDiff, "Primary 1", "Geometry");
  if (activeVariant.startsWith('advanced_')) return advancedLogic(activeVariant, difficulty, type, false, false, false, type, zodDiff, "Primary 1", "Geometry");

  throw new Error(`Variant '${activeVariant}' not supported inside Shapes engine.`);
}

shapesBlueprint.generate = (difficulty, variant, type) => shapesSyllabusEntry(variant, difficulty, type);