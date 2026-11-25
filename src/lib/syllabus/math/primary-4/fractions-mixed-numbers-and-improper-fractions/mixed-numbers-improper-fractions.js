import { foundationLogic } from './mixed-numbers-improper-fractions/foundation.js';
import { standardLogic } from './mixed-numbers-improper-fractions/standard.js';
import { advancedLogic } from './mixed-numbers-improper-fractions/advanced.js';

export const p4MixedNumbersImproperFractionsBlueprint = {
  id: 'p4-mixed-numbers-improper-fractions',
  title: 'Mixed Numbers/Improper Fractions',
  strand: 'Number and Algebra',
  visualType: 'FRACTION_PIZZA_VISUALIZER',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 2,
      logicDescription: 'translating between visual models, mixed numbers, and improper fractions'
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 3,
      logicDescription: 'applying division-to-fraction relationships, cross-format comparisons, and decompositions'
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 4,
      logicDescription: 'solving matching-denominator cryptarithms, extreme bounds, fractional shifts, and unit-matching problems'
    }
  },

  variants: {
    // Foundation (Visual Identification & Direct Conversions)
    foundation_visual_translation: 'Visual Translation (Pizzas & Bars): Express shaded shapes as a mixed number or improper fraction.',
    foundation_direct_conversion_equation: 'The Direct Conversion Equation (Missing Variable): Find the missing numerator, whole number, or remainder.',
    foundation_unit_deduction: 'The Unit Deduction ("How Many Parts?"): Count total fractional units (e.g., sixths) in a mixed number.',
    foundation_number_line_placement: 'Number Line Placement: Read a marked fractional position as a mixed number or improper fraction.',
    foundation_whole_number_equivalence: 'Whole Number Equivalence: Express a whole number W as an improper fraction with denominator D.',

    // Standard (Division Contexts, Comparisons & Decompositions)
    standard_division_equal_sharing: 'The Division Context (Equal Sharing): Share X items equally among Y groups and express as a mixed number.',
    standard_cross_format_comparison: 'Cross-Format Comparison (Greater/Smaller): Compare an improper fraction and a mixed number.',
    standard_additive_decomposition: 'The Additive Decomposition (Missing Fractional Part): Decompose a mixed/improper fraction by borrowing wholes.',
    standard_assembly_disassembly_word: 'The Assembly/Disassembly Word Problem: Cut wholes into parts, subtract sold parts, express leftover as mixed number.',
    standard_quotients_remainders_mapping: 'The Quotients & Remainders Mapping: Map X ÷ Y = Q R R to mixed number components.',

    // Advanced (Cryptarithms, Offsets, Extreme Values & Bar Model Synthesis)
    advanced_dual_unknown_cryptarithm: 'The Dual Unknown Cryptarithm (Matching Denominators): Deduce missing denominator and whole number from remainder.',
    advanced_extreme_bounded_fraction: 'Extreme Bounded Fraction (Max/Min Numerator): Find largest/smallest improper fraction under/above a whole boundary.',
    advanced_fractional_shift_before_after: 'The Fractional Shift (Before/After Additive Offset): Find fractional change between improper and mixed amounts.',
    advanced_shared_common_remainder_capacity: 'The Shared Common Remainder (Group Capacity): Find what fraction of the last container is filled.',
    advanced_unit_matching_comparative_scaling: 'The Unit-Matching Word Problem (Comparative Scaling): Combine mixed and improper lengths and count unit pieces.'
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 4';
    const topic = 'Fractions - Mixed Numbers and Improper Fractions';
    const subtopic = 'Mixed Numbers/Improper Fractions';
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
