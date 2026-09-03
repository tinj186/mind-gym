import { foundationLogic } from './compound-unit-measurement/foundation.js';
import { standardLogic } from './compound-unit-measurement/standard.js';
import { advancedLogic } from './compound-unit-measurement/advanced.js';

export const p3CompoundUnitMeasurementBlueprint = {
  id: 'p3-measurement-length-mass-and-volume-compound-unit-measurement',
  blueprint: 'Compound Unit Measurement',
  variants: {
    'foundation_mass_dial_reading': 'Mass Dial Reading (Past 1 kg)',
    'foundation_volume_beaker_reading': 'Volume Beaker Reading (Past 1 ℓ)',
    'foundation_zero_trap_conversion': 'The Zero Trap Conversion (Compound to Single)',
    'foundation_map_distance_extraction': 'Map Distance (Compound Unit Extraction)',
    'foundation_fractional_benchmark': 'Fractional Benchmark Recognition (Half/Quarter)',
    'standard_pure_addition': 'Pure Addition (No Regrouping)',
    'standard_pure_subtraction': 'Pure Subtraction (No Regrouping)',
    'standard_reaching_next_whole': 'Reaching the Next Whole Unit (Shortfall)',
    'standard_subtracting_from_whole': 'Subtracting from a Whole Unit (Remaining)',
    'standard_direct_comparison': 'Direct Comparison (How much more/less)',
    'advanced_addition_regrouping': 'Addition with Regrouping (Convert First Strategy)',
    'advanced_subtraction_regrouping': 'Subtraction with Regrouping (Borrowing Strategy)',
    'advanced_three_part_total': 'The 3-Part Total (Add Twice)',
    'advanced_two_step_comparison': 'The 2-Step Comparison (Find Item B, then Total)',
    'advanced_remaining_multiple_uses': 'Remaining After Multiple Uses (Subtract Twice)'
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 3';
    const topic = 'Measurement and Geometry';
    const subtopic = 'Length, Mass and Volume';
    const safeType = String(type).toLowerCase();
    const isMCQ = safeType === 'mcq';
    const isShort = safeType === 'short question';
    const isStructure = safeType === 'structured';

    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const getFormatInstructions = (visualEngineStr, inputRequirementStr) => {
      const inputReq = inputRequirementStr || JSON.stringify({ inputType: isMCQ ? "MCQ_BUTTONS" : "STANDARD_TEXT" });
      const optionsStr = isMCQ ? `["string", "string", "string", "string"]` : `[]`;
      const defectMapStr = isMCQ ? `{ "distractor1": "Error category", "distractor2": "Error category" }` : `{}`;

      return `OUTPUT FORMAT (Return ONLY valid JSON matching this schema, with NO markdown formatting, NO \`\`\`json blocks, and NO trailing characters/braces):
{
  "meta": {
    "level": "${level}",
    "topic": "${topic}",
    "subtopic": "${subtopic}",
    "type": "${zodType}",
    "difficulty": "${zodDiff}"
  },
  "content": {
    "questionText": "string",
    "finalAnswer": "string",
    "solutionSteps": ["string", "string"],
    "hint": "string",
    "options": ${optionsStr}
  },
  "visualEngine": ${visualEngineStr},
  "inputRequirement": ${inputReq},
  "defectMap": ${defectMapStr}
}`;
    };

    if (difficulty.toLowerCase() === 'foundation') {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions);
    }

    if (difficulty.toLowerCase() === 'standard') {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions);
    }

    if (difficulty.toLowerCase() === 'advanced') {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions);
    }

    throw new Error(`Difficulty level logic not implemented for: ${difficulty}`);
  }
};
