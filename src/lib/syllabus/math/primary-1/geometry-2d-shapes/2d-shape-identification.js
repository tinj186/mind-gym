import { foundationLogic } from './2d-shape-identification/foundation';
import { standardLogic } from './2d-shape-identification/standard';
import { advancedLogic } from './2d-shape-identification/advanced';

export const _2dShapeIdentificationBlueprint = {
  id: 'p1-2d-shape-identification',
  title: '2D Shape Identification',
  strand: 'Geometry',
  visualType: 'DYNAMIC',

  difficultyLevels: {
    foundation: {
      name: 'Identifying & Classifying',
      steps: 1,
      logicDescription: "Recognizing basic shapes and grouping them by attributes."
    },
    standard: {
      name: 'Scanning & Riddles',
      steps: 2,
      logicDescription: "Scanning grids, reasoning through riddles, comparing quantities, and exclusion logic."
    },
    advanced: {
      name: 'Multi-Attribute Logic',
      steps: 3,
      logicDescription: "Multi-attribute constraint satisfaction, exclusionary riddles, orientation invariance, and complex deconstruction."
    }
  },

  variants: {
    foundation_identify_shape: "Identifying single shapes in various orientations.",
    foundation_classify_attribute: "Classifying shapes by color, shape, or size.",
    foundation_count_sides: "Counting the number of straight sides on basic shapes.",
    foundation_size_comparison: "Identifying or comparing identical shape structures across distinct sizing metrics.",
    foundation_match_real_object: "Matching abstract 2D geometric shapes to everyday real-world items.",

    standard_find_all_target_shape: "Scanning a mixed grid of shapes and counting all instances of a specific target shape.",
    standard_shape_riddles: "Solving a simple text riddle based on a shape's basic properties (sides/corners).",
    standard_most_frequent_shape: "Using AI to generate a custom composite drawing and identifying which shape was used the most or least.",
    standard_compare_shape_counts: "Comparing the quantities of two specific shapes in a grid.",
    standard_identify_by_exclusion: "Scanning a grid of shapes to identify which shape is missing from a predefined set.",

    advanced_attribute_logic: "Identifying a specific shape from a group that satisfies multiple conditions simultaneously.",
    advanced_shape_exclusion_riddles: "Deductive reasoning using exclusionary properties to identify a unique shape from a mixed array.",
    advanced_orientation_invariance: "Recognizing and validating base shapes when they undergo severe, non-standard rotations.",
    advanced_composite_deconstruct_inventory: "The AI generates a complex drawing, and the student must provide the exact inventory count of all shapes used.",
    advanced_attribute_matrix_intersection: "Identifying the specific item that satisfies a combined rule from a 2x2 grid of shapes."
  },

  generate: (difficulty = 'foundation', variant, type) => {
    const safeDiff = String(difficulty).toLowerCase();
    if (safeDiff === 'foundation') return foundationLogic.generate(variant, type);
    if (safeDiff === 'standard') return standardLogic.generate(variant, type);
    if (safeDiff === 'advanced') return advancedLogic.generate(variant, type);
    return foundationLogic.generate(variant, type);
  }
};
