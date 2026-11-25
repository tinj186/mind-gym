import { foundationLogic } from './fraction-of-a-set/foundation.js';
import { standardLogic } from './fraction-of-a-set/standard.js';
import { advancedLogic } from './fraction-of-a-set/advanced.js';

export const p4FractionOfASetBlueprint = {
  id: 'p4-fraction-of-a-set',
  title: 'Fraction of a Set',
  strand: 'Number and Algebra',
  visualType: 'GRID_ARRAY_VISUALIZER',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 2,
      logicDescription: 'direct set calculation using unitary method and expressing parts of a set in simplest form'
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 3,
      logicDescription: 'multi-category sets, part-to-whole unitary deductions, and fractional comparisons'
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 4,
      logicDescription: 'mixed discrete-fraction remainders, equalizing transfers, reverse additive, and shared numerators'
    }
  },

  variants: {
    // Foundation (Direct Set Calculation & Expressing Fractions)
    foundation_direct_set_calculation: 'Direct Set Calculation (Variable Unknowns): Find Part, Total, or Fraction in simplest form.',
    foundation_complementary_fraction: 'The Complementary Fraction Deduction: Find the remaining part of a set.',
    foundation_remainder_simplest_fraction: 'Remainder to Simplest Fraction: Find the fraction of remaining good items in simplest form.',
    foundation_multiplier_translation: 'Multiplier Translation (Algebraic Bridge): Translate A/B of N into A × ?.',
    foundation_fractional_equivalence_sets: 'Fractional Equivalence in Sets: Equate 1/A of N1 to 1/B of an unknown number.',

    // Standard (Multi-Category Sets, Differences & Unitary Deductions)
    standard_finding_whole_from_part: 'Finding the Whole from a Part (Unitary Method): Deduce total from a given fractional part.',
    standard_difference_between_parts: 'Difference between Fractional Parts: Compare two complementary parts of a set.',
    standard_multi_category_sets: 'Multi-Category Sets (Same Denominator): Find the remaining category in a 3-part set.',
    standard_subtractive_deduction: 'Subtractive Deduction (Unknown Total): Deduce the sold part from the remaining items.',
    standard_fractional_comparative: 'Fractional Comparative ("A is a fraction of B"): Compare two entities using unit bars.',

    // Advanced (Mixed Variables, Transfers & Reverse Additive Logic)
    advanced_mixed_variable_spending: 'Mixed Variable Spending (Fraction + Discrete Remainder): Find original total from fraction and dollar remainder.',
    advanced_equalizing_transfers: 'Equalizing Transfers (Internal Movement): Find how many items to transfer so both have equal amounts.',
    advanced_reverse_additive: 'Reverse Additive (Starting Quantity Deduction): Deduce original total from sold quantity and remaining fraction.',
    advanced_shared_numerator: 'The Shared Numerator (Equating Parts of Two Sets): Equate 1/A of Set A to 1/B of Set B.',
    advanced_two_tiered_difference: 'The Two-Tiered Difference Check: Apply different denominators to the same total and compare parts.'
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 4';
    const topic = 'Fractions - Fraction of a Set';
    const subtopic = 'Fraction of a Set';
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
