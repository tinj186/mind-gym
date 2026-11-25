import { foundationLogic } from './multiplication-algorithms-advanced/foundation.js';
import { standardLogic } from './multiplication-algorithms-advanced/standard.js';
import { advancedLogic } from './multiplication-algorithms-advanced/advanced.js';

export const p4MultiplicationAlgorithmsAdvancedBlueprint = {
  id: 'p4-multiplication-algorithms-advanced',
  title: 'Multiplication Algorithms (Advanced)',
  strand: 'Number and Algebra',
  visualType: 'VERTICAL_ALGORITHM_GRID',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 2,
      logicDescription: 'executing 4-digit x 1-digit and 3-digit x 2-digit algorithms, partial products, and zero shifts'
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 3,
      logicDescription: 'diagnosing place-value errors, deducing missing digits, and applying multi-rate models'
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 4,
      logicDescription: 'solving reverse 3-by-2 cryptarithms, product optimization, wrong-multiplier, and Before-After heuristics'
    }
  },

  variants: {
    // Foundation (Algorithm Mechanics & Direct Scaling)
    foundation_partial_products_area_model: 'Partial Products & Area Model Decomposition: Break 3-by-2 or 4-by-1 into place-value partial products.',
    foundation_place_value_zero_shift: 'Place-Value Zero-Shift Multiplication: Multiply a 3-digit number by a multiple of 10 (20 to 90).',
    foundation_regrouping_across_zeros: 'Regrouping Across Zeros (4-Digit x 1-Digit): Multiply 4-digit numbers with internal zeros.',
    foundation_distributive_property_splitting: 'Distributive Property Splitting: Simplify 3-by-2 multiplication via additive splitting or compensation.',
    foundation_direct_multi_digit_scaling: 'Direct Multi-Digit Scaling (Part-Whole): Single-rate 4-by-1 or 3-by-2 scaling plus add/subtract.',

    // Standard (Error Analysis, Missing Digits & Multi-Rate Models)
    standard_flawed_algorithm_diagnosis: 'The Flawed Algorithm (Place-Value Error Diagnosis): Diagnose missing zero placeholder or dropped carry-over.',
    standard_missing_digit_cryptarithm: 'Missing Digit Cryptarithm (4-Digit x 1-Digit): Deduce missing digits in vertical multiplication.',
    standard_two_rate_combined_totals_diff: 'Two-Rate Combined Totals & Differences: Compare or combine two multi-digit rates.',
    standard_multiplicative_comparison_offset: 'Multiplicative Comparison with Offset: N times as many plus/minus an offset.',
    standard_estimation_vs_exact_product: 'Estimation vs. Exact Product Analysis: Round to nearest 10/100, compute exact product, and find difference.',

    // Advanced (Reverse Algorithms, Optimization & Heuristics)
    advanced_reverse_3by2_deduction: '3-Digit x 2-Digit Missing Digit Deduction: Work backward from partial products to find missing multiplier digits.',
    advanced_digit_card_product_optimization: 'Digit Card Product Optimization: Arrange 5 digit cards into 3-digit x 2-digit for greatest/smallest product.',
    advanced_wrong_multiplier_correction: 'The "Wrong Multiplier" Correction Heuristic: Find difference or correct answer using X * (A - B).',
    advanced_before_after_inventory_transfer: 'Before & After Inventory Transfer (Multi-Digit Scaling): Transfer cartons between warehouses and find item difference.',
    advanced_target_shortfall_multi_tiered: 'Target Shortfall with Multi-Tiered Scaling: Compare two multi-digit batches against a target up to 100,000.'
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 4';
    const topic = 'Whole Numbers - Four Operations';
    const subtopic = 'Multiplication Algorithms (Advanced)';
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
