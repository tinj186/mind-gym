/**
 * Blueprint for Primary 1: Measurement - Length - Line Segment Drawing
 */
import { getRandomContext } from '@/lib/utils/localization';
import { foundationLogic } from './line-segment-drawing/foundation';
import { standardLogic } from './line-segment-drawing/standard';
import { advancedLogic } from './line-segment-drawing/advanced';

export const lineSegmentDrawingBlueprint = {
  id: 'p1-line-segment-drawing',
  title: 'Line Segment Drawing',
  strand: 'Measurement and Geometry',
  visualType: 'DYNAMIC',

  difficultyLevels: {
    foundation: {
      name: 'Identifying Line Segments',
      steps: 1,
      logicDescription: "Identifying a line segment of a specific length in cm."
    },
    standard: {
      name: 'Drawing Line Segments',
      steps: 1,
      logicDescription: "Determining the correct line segment that measures X cm on a grid."
    },
    advanced: {
      name: 'Complex Line Operations',
      steps: 2,
      logicDescription: "Multi-step line drawing and measurement problems involving relative lengths and parts."
    }
  },

  variants: {
    foundation_identify_line: "Identifying which line segment has a specific length in cm.",
    foundation_find_longest: "Identify the longest line segment among a set of 3 lines.",
    foundation_find_shortest: "Identify the shortest line segment among a set of 3 lines.",
    foundation_true_false_length: "Evaluate a True/False statement about the length of a specific line segment.",
    foundation_find_same_length: "Identify which two line segments have the exact same length.",

    standard_line_drawing: "Determining the correct end point to draw a line segment of X cm.",
    standard_calculate_start_point: "Given the length and the end mark, calculate the starting mark.",
    standard_calculate_length_from_marks: "Given a misaligned line starting at mark X and ending at mark Y, calculate its total length.",
    standard_draw_longer_line: "Two-step logic to calculate the end point of a longer line segment.",
    standard_draw_shorter_line: "Two-step logic to calculate the end point of a shorter line segment.",

    advanced_combined_length_misaligned: "Calculate the total length of two separate misaligned lines.",
    advanced_missing_part_length: "A whole length is given, and one misaligned part is drawn. Calculate the remaining part.",
    advanced_draw_equal_parts: "A misaligned line is cut into two equal pieces. Find the length of one piece.",
    advanced_draw_three_lines: "Complex multi-step relative length logic involving three entities.",
    advanced_find_longest_misaligned: "Compare two misaligned lines and find the difference in length."
  },

  generate: (difficulty = 'foundation', variant = 'foundation_identify_line', type = 'MCQ') => {
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
    if (!lineSegmentDrawingBlueprint.variants[finalVariant]) {
      const validVariants = Object.keys(lineSegmentDrawingBlueprint.variants).filter(k => k.startsWith(finalDifficulty));
      if (validVariants.length > 0) {
        activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
      } else {
        activeVariant = 'foundation_identify_line';
      }
    }

    const config = lineSegmentDrawingBlueprint.difficultyLevels[finalDifficulty] || lineSegmentDrawingBlueprint.difficultyLevels.foundation;
    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = finalDifficulty.charAt(0).toUpperCase() + finalDifficulty.slice(1);
    const level = 'Primary 1';
    const topic = 'Measurement - Length';
    const subtopic = 'Line Segment Drawing';

    const getQText = (words, equation) => isShort ? equation : words;
    const levelNum = parseInt(level.replace('Primary ', ''));
    const tier = levelNum <= 2 ? 'LOWER_BLOCK' : (levelNum <= 4 ? 'MIDDLE_BLOCK' : 'UPPER_BLOCK');
    const context = getRandomContext('GENERAL', tier);

    const strictInstruction = `\nCRITICAL INSTRUCTION: You MUST use the EXACT strings provided in the template below for questionText, hint, and solutionSteps. DO NOT rephrase them!`;

    let formatInstructions = isMCQ
      ? `Format as MCQ. Include an "options" array with 4 choices. "finalAnswer" must exactly match one of the options.${strictInstruction}`
      : `Format as Short Answer. The "options" field in your JSON should be null.${strictInstruction}`;

    if (activeVariant.startsWith('foundation_')) {
      return foundationLogic.generate(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText);
    }

    if (activeVariant.startsWith('standard_')) {
      return standardLogic.generate(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText);
    }

    if (activeVariant.startsWith('advanced_')) {
      return advancedLogic.generate(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText);
    }

    return foundationLogic.generate(activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText);
  }
};
