/**
 * Coordinator for Picture Graphs syllabus.
 * PATH: src/lib/syllabus/math/primary-1/data-representation/picture-graphs.js
 */
import { getRandomContext } from '@/lib/utils/localization';
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

    advanced_multi_step_problem: "Solving multi-step problems involving picture graph data.",
    advanced_predict_next_category: "Predicting the next category based on a pattern in a picture graph.",
    advanced_create_graph_from_data: "Choosing the correct picture graph representation for given data.",
    advanced_missing_data_point: "Finding a missing data point in a picture graph given the total.",
    advanced_clue_deduction_riddle: "Deducing categories and counts from intersecting logical text riddles using 1-to-1 graph constraints.",
    advanced_total_graph_redistribution: "Calculating item transfers needed between rows to make data sets completely equal.",
    advanced_comparative_sum_groups: "Evaluating multi-step additive relationships comparing combinations of multiple visual categories.",
    advanced_data_entry_mistake: "Spotting a structural counting error by checking a visual chart row against a short story text descriptor.",
    advanced_backwards_tracking_total: "Calculating a hidden row value by subtracting all known visible item points from an explicit total.",
    advanced_hypothetical_sharing: "Tracking secondary graph values after items are removed or given away through an active scenario.",
  },

  generate: (difficulty = 'foundation', variant = 'foundation_read_single_category', type = 'MCQ') => {
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
    if (!pictureGraphsBlueprint.variants[finalVariant]) {
      const validVariants = Object.keys(pictureGraphsBlueprint.variants).filter(k => k.startsWith(finalDifficulty));
      if (validVariants.length > 0) {
        activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
      } else {
        activeVariant = 'foundation_read_single_category'; 
      }
    }

    const config = pictureGraphsBlueprint.difficultyLevels[finalDifficulty] || pictureGraphsBlueprint.difficultyLevels.foundation;
    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = finalDifficulty.charAt(0).toUpperCase() + finalDifficulty.slice(1);
    const level = 'Primary 1';
    const topic = 'Data Representation';

    const getQText = (words, equation) => isShort ? equation : words;
    const levelNum = parseInt(level.replace('Primary ', ''));
    const tier = levelNum <= 2 ? 'LOWER_BLOCK' : (levelNum <= 4 ? 'MIDDLE_BLOCK' : 'UPPER_BLOCK');
    const context = getRandomContext('GENERAL', tier);

    const hintProtocol = `\nCRITICAL HINT PROTOCOL: You MUST provide a conceptual "hint" field in your JSON. Focus on how to read the picture graph correctly.`;

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