import { foundationLogic } from './figure-copying-grids/foundation';
import standardLogic from './figure-copying-grids/standard';
import { advancedLogic } from './figure-copying-grids/advanced';

export const figureCopyingGridsBlueprint = {
  id: 'p1-figure-copying-grids',
  title: 'Figure Copying on Grids',
  strand: 'Geometry',
  visualType: 'DYNAMIC',

  difficultyLevels: {
    foundation: {
      name: 'Basic Grids & Lines',
      steps: 1,
      logicDescription: "Counting grid units, visual discrimination of copies, and drawing basic lines and shapes."
    },
    standard: {
      name: 'Diagonal & Composite Shapes',
      steps: 1,
      logicDescription: "Drawing diagonal lines, triangles, and composite shapes like a house."
    },
    advanced: {
      name: 'Transformations & Patterns',
      steps: 1,
      logicDescription: "Applying symmetry, scaling, translation, and pattern extension to grid drawings."
    }
  },

  variants: {
    foundation_count_grid_units: "Counting the length of a line in grid units.",
    foundation_identify_correct_copy: "Identifying the correct copy of a shape from a set of distractors.",
    foundation_copy_simple_line: "Copying a simple straight line onto the interactive grid.",
    foundation_copy_basic_shape: "Copying a basic square or rectangle onto the interactive grid.",
    foundation_complete_the_shape: "Drawing the missing lines to complete a partially drawn shape.",

    standard_diagonal_line: "Copy a single diagonal line on a grid.",
    standard_triangle_copy: "Copy a basic triangle on a grid.",
    standard_composite_shape: "Copy a composite shape (e.g. house or boat) on a grid.",
    standard_complete_composite: "Complete the missing half of a composite shape.",
    standard_identify_incorrect_copy: "MCQ: Identify which of the 4 grids shows an incorrect copy of the shape.",

    advanced_symmetric_copy: "Draw the missing symmetric half of a shape.",
    advanced_scaled_copy: "Draw a copy of the shape that is twice as big.",
    advanced_translation_copy: "Draw a copy of the shape shifted by N squares.",
    advanced_pattern_extension: "Complete a repeating geometric pattern.",
    advanced_rotated_copy_mcq: "MCQ: Identify the correctly rotated version of the shape."
  },

  generate: (difficulty = 'foundation', variant, type) => {
    const safeDiff = String(difficulty).toLowerCase();
    if (safeDiff === 'foundation') return foundationLogic.generate(variant, type);
    if (safeDiff === 'standard') return standardLogic.generate(variant, type);
    if (safeDiff === 'advanced') return advancedLogic.generate(variant, type);

    return foundationLogic.generate(variant, type);
  }
};
