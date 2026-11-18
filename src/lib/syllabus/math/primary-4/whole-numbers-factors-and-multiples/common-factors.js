import { foundationLogic } from './common-factors/foundation.js';
import { standardLogic } from './common-factors/standard.js';
import { advancedLogic } from './common-factors/advanced.js';

export const p4CommonFactorsBlueprint = {
  id: 'p4-common-factors',
  title: 'Common Factors',
  strand: 'Number and Algebra',
  visualType: 'VENN_DIAGRAM_VISUALIZER',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 2,
      logicDescription: 'systematically listing factors for two numbers <= 100 and identifying common factors'
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 3,
      logicDescription: 'applying common factors to equal grouping, tile cutting, and shared-clue deduction'
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 4,
      logicDescription: 'adjusting remainders before finding the highest common factor (HCF) and solving multi-step geometric or algebraic problems'
    }
  },

  variants: {
    // Foundation (Direct Intersection & Listing)
    foundation_direct_venn_intersection: 'The Direct Venn Intersection: Find all common factors (or count/missing common factor) of two numbers.',
    foundation_gcf_direct: 'The Highest Common Factor (HCF) Direct: Find the highest common factor (HCF) of two numbers between 12 and 100.',
    foundation_true_false_proof: 'True/False Common Factor Proof: Determine whether N is a common factor of X and Y.',
    foundation_bounded_common_factor: 'The Bounded Common Factor: Find a common factor of X and Y matching a condition (e.g. odd/even or range).',
    foundation_shared_factor_pairing: 'The Shared Factor Pairing: Given common factor N of X and Y, find its partner factors for each.',

    // Standard (Word Problems, Equal Grouping & Geometry)
    standard_two_item_equal_packing: 'Two-Item Equal Packing (Identical Goodie Bags): Find possible or greatest number of identical bags.',
    standard_max_group_vs_contents: 'Maximum Group Size vs Contents per Group: Find the highest common factor (HCF) for bags, then items per bag.',
    standard_grid_tile_cutting: 'The Grid / Tile Cutting (Geometry): Cut an X by Y rectangle into identical squares with no leftover.',
    standard_deduction_shared_clue: 'Deduction from a Shared Clue: Common factor of X and Y that is also a multiple of M.',
    standard_failed_grouping: 'The Failed Grouping (Not a Common Factor): Prove why group size N fails to divide X or Y equally.',

    // Advanced (Heuristics, Remainders & Multi-Step Logic)
    advanced_uniform_leftover: 'Common Factor with a Uniform Leftover: Subtract uniform remainder R from X and Y, then find the highest common factor (HCF).',
    advanced_different_leftovers: 'Common Factor with Different Leftovers: Subtract R1 and R2 from X and Y, then find the highest common factor (HCF).',
    advanced_largest_tile_perimeter_area: 'Perimeter/Area of the Largest Square Tile: Find the largest square tile side (HCF), then perimeter or area.',
    advanced_number_of_cuts: 'The Number of Cuts (Linear Grouping): Cut ribbons of X and Y into longest equal pieces, find total cuts.',
    advanced_mystery_numbers_gcf_sum: 'The Mystery Numbers from Highest Common Factor (HCF) and Sum: Deduce two different 2-digit numbers given their HCF and sum.'
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 4';
    const topic = 'Whole Numbers - Factors and Multiples';
    const subtopic = 'Common Factors';
    const safeType = String(type || 'short question').toLowerCase();
    const isMCQ = safeType === 'mcq';
    const isShort = safeType === 'short question' || safeType === 'short_question';
    const isStructure = !isMCQ && !isShort;

    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const diff = String(difficulty || 'foundation').toLowerCase();
    const zodDiff = diff.charAt(0).toUpperCase() + diff.slice(1);

    const getFormatInstructions = (
      visualEngineStr = '{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }',
      inputRequirementStr = null,
      acceptedAnswers = null
    ) => `CRITICAL INSTRUCTION: You MUST use the EXACT "visualEngine" and "inputRequirement" JSON objects provided in the template below.
OUTPUT FORMAT (Return ONLY valid JSON matching this schema, with NO markdown formatting and NO trailing characters):
{
  "meta": {
    "level": "${level}",
    "topic": "${topic}",
    "subtopic": "${subtopic}",
    "difficulty": "${zodDiff}",
    "type": "${zodType}",
    "variant": "${activeVariant || 'default'}"
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

    if (diff === 'foundation') {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions);
    } else if (diff === 'standard') {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions);
    } else if (diff === 'advanced') {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions);
    }

    throw new Error(`Unsupported difficulty '${difficulty}' for ${subtopic}`);
  }
};
