import { foundationLogic } from './2d-figure-formation/foundation';
import { standardLogic } from './2d-figure-formation/standard';
import { advancedLogic } from './2d-figure-formation/advanced';

export const _2dFigureFormationBlueprint = {
  id: 'p1-2d-figure-formation',
  title: '2D Figure Formation',
  strand: 'Geometry',
  visualType: 'DYNAMIC',

  difficultyLevels: {
    foundation: {
      name: 'Forming & Decomposing Shapes',
      steps: 1,
      logicDescription: "Composing and decomposing figures using rectangles, squares, triangles, half circles, and quarter circles."
    },
    standard: {
      name: 'Complex Formation & Embedded Pieces',
      steps: 2,
      logicDescription: "Multi-step figure formation, counting embedded shapes, and solving formation riddles."
    },
    advanced: {
      name: 'Spatial Logic & Substitution',
      steps: 3,
      logicDescription: "Working backwards to find missing pieces, substitution equivalencies, and maximizing tiled shapes."
    }
  },

  variants: {
    foundation_compose_two_shapes: "Visualizing the composition of two identical shapes.",
    foundation_decompose_in_half: "Mentally cutting a shape perfectly in half to discover the sub-shapes.",
    foundation_count_pieces_to_form: "Determining the quantitative relationships between fractional pieces and whole shapes.",
    foundation_complete_the_figure: "Identifying the missing puzzle piece required to complete a base figure.",
    foundation_impossible_formation: "Testing spatial logic by presenting statements about formations and determining if they are true or false.",

    standard_compose_three_shapes: "Visualizing the composition of three or more basic shapes.",
    standard_decompose_complex_figure: "Breaking down a composite real-world or abstract drawing into its constituent basic shapes.",
    standard_count_embedded_pieces: "Determining how many smaller pieces fit into a larger bounding shape.",
    standard_figure_formation_riddle: "Solving a multi-step word riddle about forming shapes.",
    standard_identify_extra_piece: "Identifying the distractor shape that is NOT needed to form a target figure.",

    advanced_find_missing_pieces: "Working backwards to identify missing pieces to complete a given figure.",
    advanced_generative_decomposition: "AI-generated complex figure decomposition with specific constraints on curved/straight subsets.",
    advanced_evaluate_formation_statements: "Reading a complex scenario describing a figure and identifying the false statement.",
    advanced_substitution_riddle: "Equivalence and substitution between fractional shapes.",
    advanced_maximum_shapes_in_boundary: "Determining the maximum number of a small shape that can fit inside a larger shape boundary."
  },

  generate: (difficulty = 'foundation', variant, type) => {
    const safeDiff = String(difficulty).toLowerCase();
    if (safeDiff === 'foundation') return foundationLogic.generate(variant, type);
    if (safeDiff === 'standard') return standardLogic.generate(variant, type);
    if (safeDiff === 'advanced') return advancedLogic.generate(variant, type);
    return foundationLogic.generate(variant, type);
  }
};
