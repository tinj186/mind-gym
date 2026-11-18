import { foundationLogic } from './factors-and-multiples/foundation.js';
import { standardLogic } from './factors-and-multiples/standard.js';
import { advancedLogic } from './factors-and-multiples/advanced.js';

export const p4FactorsAndMultiplesBlueprint = {
  id: 'p4-factors-and-multiples',
  title: 'Factors and Multiples',
  strand: 'Number and Algebra',
  visualType: 'FACTOR_TREE',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      logicDescription: 'factors, multiples and their relationship'
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      logicDescription: 'factors, multiples and their relationship'
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 2,
      logicDescription: 'factors, multiples and their relationship'
    }
  },

  variants: {
    // Foundation (Direct Identification & Pairing)
    foundation_rainbow_pairing: 'Given a target number and one factor, find the missing complementary factor in the factor pair.',
    foundation_multiple_skip_counter: 'Find the N-th multiple of a number or verify multiple relationships.',
    foundation_boundary_constraints_all_factors: 'List all factors of a specific number and count how many factors it has altogether.',
    foundation_relationship_true_false: 'Deduce and disambiguate the vocabulary and relationship between factor and multiple.',
    foundation_digit_card_multiples: 'Form a 2-digit multiple from given digit cards under divisibility constraints.',

    // Standard (Common Traits & Bounded Logic)
    standard_common_factor_venn: 'Find common factors and the highest common factor (HCF) between two numbers.',
    standard_bounded_multiple_finder: 'Find a multiple of a given number that lies strictly between two boundary numbers.',
    standard_common_multiple_sequence: 'Find the 1st, 2nd, or N-th common multiple of two single-digit numbers.',
    standard_geometry_area_factors: 'Determine possible dimensions (length and breadth) of a rectangle given its area and constraints.',
    standard_exclusion_packing: 'Determine all possible equal-packing arrangements excluding 1 and the total number itself.',

    // Advanced (Heuristics, Remainder Logic & Dual Conditions)
    advanced_mystery_number_dual_constraints: 'Deduce an unknown number satisfying intersecting factor, multiple, and boundary conditions.',
    advanced_synchronization_periodic_intervals: 'Solve periodic interval synchronization and meeting-time problems using lowest common multiple (LCM).',
    advanced_factor_sum_difference: 'Deduce the factor pair of a number from their sum or difference.',
    advanced_grouping_with_leftovers: 'Find the smallest unknown total given group sizes and a common remainder.',
    advanced_hcf_grid_square_tiling: 'Determine the largest square tile size to cut or tile a rectangle without leftovers using highest common factor (HCF).'
  },

  generate: function (difficulty, activeVariant, type, options = {}) {
    const level = 'Primary 4';
    const topic = 'Whole Numbers - Factors and Multiples';
    const subtopic = 'Factors and Multiples';
    const safeType = String(type || 'short question').toLowerCase();
    const isMCQ = safeType.includes('mcq') || safeType.includes('choice');
    const isShort = safeType.includes('short');
    const isStructure = !isMCQ && !isShort;

    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    let resolvedVariant = activeVariant;
    let explicitVariety = null;

    if (typeof activeVariant === 'object' && activeVariant !== null) {
      explicitVariety = activeVariant.variety || activeVariant.subType;
      resolvedVariant = activeVariant.variant || activeVariant.activeVariant;
    } else if (options && options.variety) {
      explicitVariety = options.variety;
    }

    if (typeof resolvedVariant === 'string' && resolvedVariant.includes(':')) {
      const parts = resolvedVariant.split(':');
      resolvedVariant = parts[0];
      explicitVariety = parts[1];
    }

    const getFormatInstructions = (visualEngineStr = '{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }', inputRequirementStr = null, variantOverride = null, acceptedAnswers = null) => `CRITICAL INSTRUCTION: You MUST use the EXACT "visualEngine" and "inputRequirement" JSON objects provided in the template below.
OUTPUT FORMAT (Return ONLY valid JSON matching this schema, with NO markdown formatting and NO trailing characters):
{
  "meta": {
    "level": "${level}",
    "topic": "${topic}",
    "subtopic": "${subtopic}",
    "difficulty": "${zodDiff}",
    "type": "${zodType}",
    "variant": "${variantOverride || resolvedVariant || 'default'}"
  },
  "visualEngine": ${visualEngineStr},
  "inputRequirement": ${inputRequirementStr || `{ "inputType": "${isMCQ ? 'MCQ_BUTTONS' : isShort ? 'STANDARD_TEXT' : 'MULTI_STEP_INPUT'}" }`},
  "content": {
    "questionText": "string (the exact question stem)",
    "options": ${isMCQ ? '["Option A", "Option B", "Option C", "Option D"]' : 'null'},
    "defectMap": ${isMCQ ? '{"wrong_option_1": "CARELESS_CALCULATION"}' : '{}'},
    "finalAnswer": "string (the final correct answer)",
    "acceptedAnswers": ${acceptedAnswers && Array.isArray(acceptedAnswers) && acceptedAnswers.length > 0 ? JSON.stringify(acceptedAnswers) : '[]'},
    "solutionSteps": "string (step-by-step logic, separate steps using \\\\n)",
    "hint": "string (a helpful conceptual clue)"
  }
}`;

    const diff = String(difficulty || 'foundation').toLowerCase();
    if (diff === 'foundation') {
      return foundationLogic(resolvedVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, explicitVariety);
    } else if (diff === 'standard') {
      return standardLogic(resolvedVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, explicitVariety);
    } else if (diff === 'advanced') {
      return advancedLogic(resolvedVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, explicitVariety);
    }

    throw new Error(`Unsupported difficulty '${difficulty}' for ${subtopic}`);
  }
};
