import { foundationLogic } from './factor-determination/foundation.js';
import { standardLogic } from './factor-determination/standard.js';
import { advancedLogic } from './factor-determination/advanced.js';

export const p4FactorDeterminationBlueprint = {
  id: 'p4-factor-determination',
  title: 'Factor Determination',
  strand: 'Number and Algebra',
  visualType: 'DYNAMIC',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      logicDescription: 'determining if a 1-digit number is a factor of a given number within 100'
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      logicDescription: 'determining if a 1-digit number is a factor of a given number within 100'
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 2,
      logicDescription: 'determining if a 1-digit number is a factor of a given number within 100'
    }
  },

  variants: {
    // Foundation (Direct Divisibility Proofs & Grouping)
    foundation_divisibility_proof: 'Directly testing if a 1-digit number is a factor of a number within 100 with division working and True/False proof.',
    foundation_perfect_grid: 'Determining if a quantity can form a perfect rectangular array or leaves an incomplete row to determine factors.',
    foundation_missing_partner: 'Finding the complementary partner factor in a factor pair given a target and one factor.',
    foundation_outlier_factor: 'Identifying which 1-digit number is not a factor of a target number within 100.',
    foundation_multiple_reversal_proof: 'Testing if a quantity can be formed from exact bundles using divisibility proof to determine factor status.',

    // Standard (Application, Adjustment & Dual Conditions)
    standard_valid_container_condition: 'Packing items into containers to determine full bags and leftovers with division with remainder.',
    standard_add_subtract_adjustment: 'Determining how many items to take away to make a 1-digit number an exact factor.',
    standard_area_geometry_factors: 'Finding the largest 1-digit factor to determine possible rectangle dimensions from its area.',
    standard_dual_factor_condition: 'Finding a number within a range that has two specific 1-digit factors simultaneously.',
    standard_unknown_divisor_odd_quotient: 'Finding a 1-digit factor that yields an odd quotient when dividing the target number.',

    // Advanced (Heuristics, Shortfalls, and Multi-Variable Deduction)
    advanced_shortfall_adjustment: 'Calculating the shortfall amount needed to add so items can be grouped with zero leftovers.',
    advanced_common_factor_elimination: 'Finding a common 1-digit factor of two numbers satisfying threshold conditions.',
    advanced_digit_clue_deduction: 'Deducing a 2-digit number having a specific 1-digit factor based on digit sum clues.',
    advanced_shared_remainder: 'Finding a number within a boundary that leaves the same non-zero remainder when divided by two different 1-digit factors.',
    advanced_max_min_multiplier_boundary: 'Deducing the largest 2-digit number having exactly specified 1-digit factors by boundary testing.',
    advanced_factor_rainbow_cutting: 'Finding the smallest or greatest number of equal pieces that can be cut from a length using factor rainbow pairs.'
  },

  generate: function (difficulty, activeVariant, type, options = { }) {
    const level = 'Primary 4';
    const topic = 'Whole Numbers - Factors and Multiples';
    const subtopic = 'Factor Determination';
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

    const getFormatInstructions = (
      visualEngineStr = '{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }',
      inputRequirementStr = null,
      variantOverride = null,
      acceptedAnswers = null,
      askText = null,
      optionsArr = null,
      defectMapObj = null,
      finalAnswerVal = null
    ) => `CRITICAL INSTRUCTION: You MUST use the EXACT "visualEngine" and "inputRequirement" JSON objects provided in the template below.
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
    "questionText": ${askText ? JSON.stringify(askText) : '"string (the exact question stem)"'},
    "options": ${optionsArr && Array.isArray(optionsArr) ? JSON.stringify(optionsArr) : (isMCQ ? '["Option A", "Option B", "Option C", "Option D"]' : 'null')},
    "defectMap": ${defectMapObj ? JSON.stringify(defectMapObj) : (isMCQ ? '{"wrong_option_1": "CARELESS_CALCULATION"}' : '{}')},
    "finalAnswer": ${finalAnswerVal ? JSON.stringify(finalAnswerVal) : '"string (the final correct answer)"'},
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
