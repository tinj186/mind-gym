import { foundationLogic } from './approximation-symbol/foundation.js';
import { standardLogic } from './approximation-symbol/standard.js';
import { advancedLogic } from './approximation-symbol/advanced.js';

export const p4ApproximationSymbolBlueprint = {
  id: 'p4-approximation-symbol',
  title: 'Approximation Symbol (≈)',
  strand: 'Number and Algebra',
  visualType: 'NONE',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      logicDescription: 'use of ≈'
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      logicDescription: 'use of ≈'
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 2,
      logicDescription: 'use of ≈'
    }
  },

  variants: {
    foundation_symbol_meaning: 'Understand the mathematical definition of the ≈ symbol.',
    foundation_choose_correct_symbol: 'Choose between = and ≈ for direct numerical statements.',
    foundation_complete_approx_statement: 'Complete an approximation statement for a given rounding unit.',
    foundation_identify_rounding_place_from_approx: 'Identify which place value a number was rounded to from an approximation statement.',
    foundation_true_false_statement: 'Distinguish between mathematically true and false approximation sentences.',

    standard_correct_symbol_choice_multi: 'Determine whether = or ≈ belongs in multi-term arithmetic expressions.',
    standard_approx_degree_identification: 'Analyze multi-digit numbers that round to the same value across multiple place values.',
    standard_find_original_from_approx: 'Identify possible original numbers given an approximation statement.',
    standard_error_analysis: 'Diagnose and correct student mistakes involving the = and ≈ symbols.',
    standard_estimation_chain: 'Complete formal multi-step estimation calculation chains.',

    advanced_symbol_chain_conventions: 'Evaluate strict Singapore MOE symbol conventions across estimation sentences.',
    advanced_dual_statement_validity: 'Determine the mathematical truth value of simultaneous approximation claims.',
    advanced_range_of_approx_expression: 'Calculate maximum possible differences from approximate values.',
    advanced_approx_inequality_heuristic: 'Find mystery numbers satisfying simultaneous approximation constraints.',
    advanced_estimation_sanity_check: 'Perform multi-item estimation checks to verify calculation reasonableness.'
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 4';
    const topic = 'Whole Numbers - Numbers up to 100 000';
    const subtopic = 'Approximation Symbol (≈)';
    const safeType = String(type || 'short question').toLowerCase();
    const isMCQ = safeType === 'mcq';
    const isShort = safeType === 'short question';
    const isStructure = !isMCQ && !isShort;

    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const getFormatInstructions = (visualEngineStr = '{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }', inputRequirementStr = null) => `CRITICAL INSTRUCTION: You MUST use the EXACT "visualEngine" and "inputRequirement" JSON objects provided in the template below.
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
    "solutionSteps": "string (step-by-step logic, separate steps using \\\\n)",
    "hint": "string (a helpful conceptual clue)"
  }
}`;

    const diff = String(difficulty || 'foundation').toLowerCase();
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
