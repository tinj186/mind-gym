import { foundationLogic } from './division-algorithms-advanced/foundation.js';
import { standardLogic } from './division-algorithms-advanced/standard.js';
import { advancedLogic } from './division-algorithms-advanced/advanced.js';

export const p4DivisionAlgorithmsAdvancedBlueprint = {
  id: 'p4-division-algorithms-advanced',
  title: 'Division Algorithms (Advanced)',
  strand: 'Number and Algebra',
  visualType: 'LONG_DIVISION_GRID',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 2,
      logicDescription: 'executing 4-digit ÷ 1-digit division, maintaining quotient zero discipline, and connecting division to its inverse'
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 3,
      logicDescription: 'diagnosing algorithmic flaws, interpreting remainders in context, and applying 4-digit ÷ 1-digit division to bar models'
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 4,
      logicDescription: 'digit-card quotient optimization, wrong-divisor recovery, maximum remainder constraints, and multi-rate comparisons'
    }
  },

  variants: {
    // Foundation (Algorithm Mechanics, Quotient Zeros & Direct Sharing)
    foundation_partial_quotient_area_model: 'Direct 4-Digit Division Algorithm: Divide a 4-digit number by a 1-digit divisor using long division.',
    foundation_internal_zero_trap: 'The Internal Zero Trap (Quotient with Zeros): Divide 4-digit numbers where quotient has internal 0 placeholders.',
    foundation_quotient_remainder_relationship: 'Quotient & Remainder Relationship (D = d x Q + R): Find the missing variable among Dividend, Divisor, Quotient, and Remainder.',
    foundation_direct_equal_sharing: 'Direct Equal Sharing with Leftovers: Share a 4-digit quantity equally and apply quotient or remainder in step 2.',
    foundation_estimation_vs_exact_quotient: 'Estimation vs. Exact Quotient: Round dividend to a compatible multiple, compute exact quotient, and find difference.',

    // Standard (Error Analysis, Remainder Interpretation & Multi-Step Models)
    standard_flawed_division_diagnosis: 'The Flawed Division Algorithm (Error Diagnosis): Diagnose dropped quotient zeros or wrong remainders.',
    standard_contextual_remainder_interpretation: 'Contextual Remainder Interpretation (Round Up vs. Round Down): Interpret remainders in packing/transport contexts.',
    standard_missing_digit_long_division: 'Missing Digit Long Division Cryptarithm: Deduce missing digits in 4-digit ÷ 1-digit long division.',
    standard_total_difference_to_unit: 'Total & Difference to Unit Value (Comparison Model): Remove differences and divide 4-digit total by 1-digit.',
    standard_equalizing_redistribution: 'Equalizing Redistribution (Before & After): Pool 3 or 4 quantities and share equally, finding share or net change.',

    // Advanced (Heuristics, Optimization & Reverse Multi-Step Division)
    advanced_maximizing_minimizing_quotient: 'Maximizing/Minimizing the Quotient (Digit Cards): Arrange 5 digit cards into 4-digit ÷ 1-digit for greatest/smallest quotient.',
    advanced_wrong_divisor_correction: 'The "Wrong Divisor" Correction Heuristic: Recover original 4-digit dividend from wrong divisor and find correct Q & R.',
    advanced_multi_step_repacking_revenue: 'Multi-Step Repacking & Leftover Revenue: Remove damaged batch, pack into cartons, and calculate revenue.',
    advanced_dual_rate_unit_comparison: 'Dual-Rate Unit Comparison: Divide two 4-digit totals by 1-digit pack counts and compare unit values.',
    advanced_maximum_remainder_constraint: 'Maximum Remainder Constraint (Reverse Deduction): Reconstruct 4-digit dividend from quotient, divisor, and max/min remainder.'
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 4';
    const topic = 'Whole Numbers - Four Operations';
    const subtopic = 'Division Algorithms (Advanced)';
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
