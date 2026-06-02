/**
 * Blueprint for Primary 1: Ordinal Numbers
 * ENGINE: Generates AI prompt constraints, leaving creative generation to the LLM.
 * ARCHITECTURE: Route strictly controls variation via the 'variant' argument.
 */

import { getRandomContext } from '@/lib/utils/localization';
import { foundationLogic } from './ordinals/foundation';
import { standardLogic } from './ordinals/standard';
import { advancedLogic } from './ordinals/advanced';

export const ordinalsBlueprint = {
  id: 'p1-ordinals',
  title: 'Ordinal Numbers',
  strand: 'Number and Algebra',
  visualType: 'DYNAMIC',

  // 1. OVERARCHING CONDITIONS (Logical Constraints)
  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxItems: 5,
      requiresStateChange: false,
      directionalLogic: "fixed",
      integration: null
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      maxItems: 10,
      requiresStateChange: true,
      directionalLogic: "variable",
      integration: "internal"
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 3,
      maxItems: 12,
      requiresStateChange: true,
      directionalLogic: "relative",
      integration: ["Addition", "Subtraction", "Comparison"]
    }
  },

  // 2. STRICT VARIANTS (Controlled by Route)
  variants: {
    foundation_direct: "Direct identification based on a row of icons.",
    foundation_item_to_position: "Identify the ordinal position of a specific item.",
    foundation_position_to_item: "Identify the item located at a specific ordinal position.",
    foundation_next_position: "Identify the ordinal position immediately after a given position.",
    foundation_last_position: "Identify the ordinal position of the last item in a queue.",

    standard_reverse: "Multi-step reverse mapping (Front to Back).",
    standard_change: "State change where an item leaves the queue.",
    standard_from_the_right: "Identifying the position of an item when counting from the right.",
    standard_join_front: "State change: finding a new position after an item joins at any position in front of or at the target's position.",
    standard_leave_front: "State change: finding a new position after an item at any position in front of the target leaves.",
    standard_relative_ahead: "Finding a position a specific number of steps ahead of another.",
    standard_relative_behind: "Finding a position a specific number of steps behind another.",
    standard_between_positions: "Identifying the exact position between two given positions.",
    standard_find_total: "Calculating the total items based on an item's position from the front and back.",
    standard_swap_positions: "State change: identifying a position after two items swap places.",

    advanced_container: "Targeted container addition (e.g., apples in bags).",
    advanced_comparison: "Mental comparison between two positions (no visual).",
    advanced_bidirectional_total: "Finding total items when given an item's position from both the left and the right.",
    advanced_multiple_leaves: "State change: Finding a new position after multiple people ahead leave the queue.",
    advanced_shift_position: "State change: Finding a new position after moving a specific number of places forward.",
    advanced_gap_calculation: "Logic puzzle: Calculating how many items are between two given ordinal positions.",
    advanced_overtake_race: "Dynamic scenario: Finding a new position after overtaking runners in a race.",
    advanced_ordinal_clues: "Logic puzzle: Deducing a position from a chain of 'just behind' or 'just ahead' clues.",
    advanced_net_queue_change: "Complex state change: People join AND leave the front of the queue.",
    advanced_relative_target: "Finding how many positions an item needs to move up to reach a target ordinal position."
  },

  // 3. GENERATION ENGINE
  generate: (difficulty = 'foundation', variant = 'foundation_direct', type = 'MCQ') => {
    
    // --- 🛡️ SELF-HEALING PARAMETER POSITION ADAPTER ---
    const safeType = String(type).toLowerCase();
    const isShort = safeType.includes('short');
    const isStructure = safeType.includes('structure') || safeType.includes('structured');
    const isMCQ = safeType.includes('mcq');

    let finalDifficulty = difficulty;
    let finalVariant = variant;

    // Auto-detect and swap if variant string was passed into the first parameter position
    if (typeof difficulty === 'string' && difficulty.includes('_')) {
      finalVariant = difficulty;
      finalDifficulty = variant || 'standard';
    }

    let activeVariant = finalVariant;
    if (!ordinalsBlueprint.variants[finalVariant]) {
      const validVariants = Object.keys(ordinalsBlueprint.variants).filter(k => k.startsWith(finalDifficulty));
      if (validVariants.length > 0) {
        activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
      } else {
        activeVariant = 'foundation_direct'; 
      }
    }
    // --------------------------------------------------

    const config = ordinalsBlueprint.difficultyLevels[finalDifficulty] || ordinalsBlueprint.difficultyLevels.foundation;
    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = finalDifficulty.charAt(0).toUpperCase() + finalDifficulty.slice(1);
    const level = 'Primary 1';
    const topic = 'Whole Numbers';

    const getQText = (words, equation) => isShort ? equation : words;
    const levelNum = parseInt(level.replace('Primary ', ''));
    const tier = levelNum <= 2 ? 'LOWER_BLOCK' : (levelNum <= 4 ? 'MIDDLE_BLOCK' : 'UPPER_BLOCK');
    const context = getRandomContext('GENERAL', tier);

    const hintProtocol = `\nCRITICAL HINT PROTOCOL: You MUST provide a conceptual "hint" field in your JSON.
    Focus on counting from the correct direction (left or right) without giving the answer.`;

    const visualProtocol = activeVariant === 'advanced_container'
      ? `\nSTRICT VISUAL PROTOCOL: This variant REQUIRES a visual. You MUST provide the "visualEngine" block with "componentToRender": "ORDINAL_LINE".`
      : '';

    let formatInstructions = isMCQ 
      ? `Format as MCQ. Include an "options" array with 4 choices. "finalAnswer" must exactly match one of the options.${hintProtocol}${visualProtocol}` 
      : `Format as Short Answer. The "options" field in your JSON should be null.${hintProtocol}${visualProtocol}`;

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
