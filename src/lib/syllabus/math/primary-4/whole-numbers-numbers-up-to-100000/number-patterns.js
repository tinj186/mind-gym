import { foundationLogic } from './number-patterns/foundation.js';
import { standardLogic } from './number-patterns/standard.js';
import { advancedLogic } from './number-patterns/advanced.js';

export const p4NumberPatternsBlueprint = {
  id: 'p4-number-patterns',
  title: 'Number Patterns',
  strand: 'Number and Algebra',
  visualType: 'NUMBER_PATTERN',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      logicDescription: 'patterns in number sequences'
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      logicDescription: 'patterns in number sequences'
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 2,
      logicDescription: 'patterns in number sequences'
    }
  },

  variants: {
    foundation_adjacent_term_deduction: 'Find a missing term at the start, middle, or end of a linear sequence with constant intervals.',
    foundation_boundary_crossing_deduction: 'Deduce the missing number in a sequence crossing place-value boundaries on a number line.',
    foundation_deducing_unknown_rule: 'Determine the unknown addition or subtraction rule from a given complete sequence.',
    foundation_incorrect_anomaly: 'Identify the incorrect number in a sequence where one term breaks the pattern rule.',
    foundation_two_step_extension: 'Find the term that is two positions away from the given numbers in a sequence (e.g. 5th number or 1st number).',

    //    standard_pattern_crossing: 'Complete number sequences crossing place-value boundaries (thousands, ten-thousands, or approaching 100 000).',
    //    standard_non_adjacent_gap_deduction: 'Deduce the interval and find missing terms across non-adjacent gaps on a number line.',
    //    standard_alternating_rule: 'Identify and apply alternating two-step operations (+A, -B) in a number pattern.',
    //    standard_table_input_output: 'Determine the constant rule and calculate missing input or output values in a function table.',
    //    standard_growing_shrinking_interval: 'Analyze sequences with increasing or decreasing interval step sizes (difference of differences).',
    standard_equation_sequence_hybrid: 'Solve for the sum or difference of two missing terms (A and B) in a number pattern.',

    advanced_alternating_add_sub: 'Two-step alternating rule with addition and subtraction.',
    advanced_alternating_add_add: 'Two-step alternating rule with two different additions.',
    advanced_growing_jumps: 'Number sequence with increasing jump increments.',
    advanced_large_jumps: 'Sequences with non-standard step sizes (e.g. 1250, 2500, 5000).',
    advanced_two_missing_terms: 'Find sum of two missing terms (A + B) in a sequence.'
  },

  variantVarieties: {
    foundation_adjacent_term_deduction: [
      'missing_middle',
      'missing_start',
      'missing_end',
      'step_10',
      'step_100',
      'step_1000',
      'step_10000',
      'step_500_2000',
      'ascending',
      'descending'
    ],
    foundation_boundary_crossing_deduction: [
      'cross_ten_thousands',
      'cross_thousands',
      'cross_hundreds'
    ],
    foundation_deducing_unknown_rule: [
      'rule_addition',
      'rule_subtraction'
    ],
    foundation_incorrect_anomaly: [
      'anomaly_middle',
      'anomaly_end'
    ],
    foundation_two_step_extension: [
      'extend_end_ascending',
      'extend_end_descending',
      'extend_start_ascending',
      'extend_start_descending'
    ],
    standard_pattern_crossing: [
      'add_cross_thousands',
      'subtract_cross_thousands',
      'add_cross_ten_thousands',
      'subtract_cross_ten_thousands',
      'reach_100000'
    ],
    standard_non_adjacent_gap_deduction: [
      'two_gap_find_inside',
      'two_gap_find_outside',
      'three_gap_find_inside'
    ],
    standard_alternating_rule: [
      'alternating_add_sub',
      'alternating_sub_add',
      'alternating_add_add',
      'alternating_sub_sub',
      'missing_rule_a',
      'missing_rule_b',
      'missing_end_term',
      'missing_middle_term'
    ],
    standard_table_input_output: [
      'find_output',
      'find_input',
      'rule_addition',
      'rule_subtraction'
    ],
    standard_growing_shrinking_interval: [
      'growing_intervals',
      'shrinking_intervals',
      'missing_end',
      'missing_middle',
      'missing_start'
    ],
    standard_equation_sequence_hybrid: [
      'find_difference',
      'find_sum',
      'random_positions',
      'descending_sequence'
    ]
  },

  generate: function (difficulty, activeVariant, type, options = { }) {
    const level = 'Primary 4';
    const topic = 'Whole Numbers - Numbers up to 100 000';
    const subtopic = 'Number Patterns';
    const safeType = String(type || 'short question').toLowerCase();
    const isMCQ = safeType === 'mcq';
    const isShort = safeType === 'short question';
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

    // Support legacy foundation variant aliases for backward compatibility
    const legacyFoundationMap = {
      foundation_count_on_back: null,
      foundation_add_10: 'add_10',
      foundation_subtract_10: 'subtract_10',
      foundation_add_100: 'add_100',
      foundation_subtract_100: 'subtract_100',
      foundation_add_1000: 'add_1000',
      foundation_subtract_1000: 'subtract_1000',
      foundation_add_10000: 'add_10000',
      foundation_subtract_10000: 'subtract_10000'
    };

    if (resolvedVariant in legacyFoundationMap) {
      explicitVariety = explicitVariety || legacyFoundationMap[resolvedVariant];
      resolvedVariant = 'foundation_adjacent_term_deduction';
    }

    // Support legacy standard variant aliases for backward compatibility
    const legacyStandardMap = {
      standard_add_cross_thousands: { variant: 'standard_pattern_crossing', variety: 'add_cross_thousands' },
      standard_subtract_cross_thousands: { variant: 'standard_pattern_crossing', variety: 'subtract_cross_thousands' },
      standard_add_cross_ten_thousands: { variant: 'standard_pattern_crossing', variety: 'add_cross_ten_thousands' },
      standard_subtract_cross_ten_thousands: { variant: 'standard_pattern_crossing', variety: 'subtract_cross_ten_thousands' },
      standard_reach_100000: { variant: 'standard_pattern_crossing', variety: 'reach_100000' },
      standard_boundary_crossing: { variant: 'standard_pattern_crossing', variety: null },
      standard_non_adjacent_gap: { variant: 'standard_non_adjacent_gap_deduction', variety: null },
      standard_missing_middle: { variant: 'standard_non_adjacent_gap_deduction', variety: null },
      standard_alternating_sequence_rule: { variant: 'standard_alternating_rule', variety: null },
      standard_input_output_offset: { variant: 'standard_table_input_output', variety: null },
      standard_table_pattern: { variant: 'standard_table_input_output', variety: null },
      standard_growing_interval: { variant: 'standard_growing_shrinking_interval', variety: null },
      standard_difference_of_differences: { variant: 'standard_growing_shrinking_interval', variety: null },
      standard_equation_hybrid: { variant: 'standard_equation_sequence_hybrid', variety: null }
    };

    if (resolvedVariant in legacyStandardMap) {
      const mapping = legacyStandardMap[resolvedVariant];
      explicitVariety = explicitVariety || mapping.variety;
      resolvedVariant = mapping.variant;
    }

    const getFormatInstructions = (visualEngineStr = '{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }', inputRequirementStr = null, variantOverride = null) => `CRITICAL INSTRUCTION: You MUST use the EXACT "visualEngine" and "inputRequirement" JSON objects provided in the template below.
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
