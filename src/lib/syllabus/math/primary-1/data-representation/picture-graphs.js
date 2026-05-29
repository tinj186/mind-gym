/**
 * Coordinator for Picture Graphs syllabus.
 * PATH: src/lib/syllabus/math/primary-1/data-representation/picture-graphs.js
 */
import { foundationLogic } from './picture-graphs/foundation';
import { standardLogic } from './picture-graphs/standard';
import { advancedLogic } from './picture-graphs/advanced';

export const pictureGraphsBlueprint = {
  id: 'p1-data-representation-picture-graphs',
  title: 'Picture Graphs',
  strand: 'Data Representation',
  visualType: 'DYNAMIC',

  difficultyLevels: {
    foundation: {
      name: 'Reading & Comparing Simple Graphs',
      steps: 1,
      logicDescription: "Reading counts for single categories and comparing two categories on a 1-to-1 scale."
    },
    standard: {
      name: 'Analyzing & Interpreting Keys',
      steps: 2,
      logicDescription: "Analyzing all categories, finding differences, and interpreting graph keys."
    },
    advanced: {
      name: 'Multi-step Problems & Predictions',
      steps: 3,
      logicDescription: "Solving multi-step problems, predicting patterns, and working with missing data."
    }
  },

  variants: {
    foundation_read_single_category: "Reading the count for a single category on a picture graph.",
    foundation_compare_two_categories: "Comparing counts of two categories (more/less) on a picture graph.",
    foundation_total_two_categories: "Finding the total count of two categories on a picture graph.",
    foundation_most_least_category: "Scanning the graph layout to directly identify the category with the absolute most or least items.",
    foundation_zero_value_category: "Identifying a completely empty data row representing a value count of zero.",
    foundation_category_match_text: "Matching visual emoji rows directly to simple target number truth statements.",

    standard_read_all_categories: "Reading counts for all categories on a picture graph.",
    standard_most_least_frequent: "Identifying the most or least frequent category on a picture graph.",
    standard_difference_two_categories: "Finding the difference between two categories on a picture graph.",
    standard_combine_two_groups_vs_third: "Comparing the combined sum of two specific categories against a third category count value.",
    standard_fewer_than_threshold: "Identifying how many distinct categories fall below or above a specific target numeric threshold.",
    standard_rank_three_categories: "Ordering three distinct categories sequentially from most to least or least to most.",
    standard_equal_value_groups: "Identifying which two categories share an identical, equal quantity of item tokens.",
    standard_add_item_prediction: "Predicting a category's new total value after an incremental data point item is introduced into the graph dataset.",

//   advanced_multi_step_problem: "Solving multi-step problems involving picture graph data.",
//    advanced_predict_next_category: "Predicting the next category based on a pattern in a picture graph.",
    advanced_create_graph_from_data: "Choosing the correct picture graph representation for given data.",
    advanced_missing_data_point: "Finding a missing data point in a picture graph given the total."
  }
};

export default function pictureGraphsSyllabusEntry(variant, difficulty, type) {
  let activeVariant = variant || '';
  const validVariants = Object.keys(pictureGraphsBlueprint.variants);

  if (!activeVariant || !validVariants.includes(activeVariant)) {
    activeVariant = difficulty?.toLowerCase() === 'standard' ? 'standard_read_all_categories' :
                    difficulty?.toLowerCase() === 'advanced' ? 'advanced_multi_step_problem' :
                    'foundation_read_single_category';
  }

  const zodDiff = (difficulty || 'foundation').toUpperCase();
  const isMCQ = type === 'MCQ' || type === 'MCQ_BUTTONS';
  const isShort = type === 'SHORT_QUESTION';
  const isStructure = type === 'STRUCTURED';
  const level = "Primary 1";
  const topic = "Data Representation";

  if (activeVariant.startsWith('foundation_')) return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, type, zodDiff, level, topic);
  if (activeVariant.startsWith('standard_')) return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, type, zodDiff, level, topic);
  if (activeVariant.startsWith('advanced_')) return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, type, zodDiff, level, topic);

  throw new Error(`Variant '${activeVariant}' not supported inside Picture Graphs engine.`);
}

pictureGraphsBlueprint.generate = (difficulty, variant, type) => pictureGraphsSyllabusEntry(variant, difficulty, type);