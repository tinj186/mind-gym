import { foundationLogic } from './compound-unit-conversion/foundation.js';
import { standardLogic } from './compound-unit-conversion/standard.js';
import { advancedLogic } from './compound-unit-conversion/advanced.js';

export const p3CompoundUnitConversionBlueprint = {
  id: 'p3-measurement-length-mass-and-volume-compound-unit-conversion',
  blueprint: 'Compound Unit Conversion',
  variants: {
    'foundation_mass_dial_reading': 'Mass Dial Reading (Smaller to Compound)',
    'foundation_volume_beaker_reading': 'Beaker Reading (Compound to Smaller)',
    'foundation_zero_placeholder_trap': 'The "Zero Placeholder" Trap (Length)',
    'foundation_m_cm_boundary': 'The m/cm Boundary (Base 100)',
    'foundation_fractional_benchmark': 'Fractional Benchmark Conversions',
    'standard_convert_to_compare': 'Convert to Compare',
    'standard_add_and_convert': 'Add and Convert (Finding the Total)',
    'standard_subtract_from_compound': 'Subtract from Compound (Finding the Remainder)',
    'standard_missing_part': 'The Missing Part (Reverse Conversion)',
    'standard_reaching_target': 'Reaching the Target (Shortfall)',
    'advanced_three_part_total': 'The 3-Part Total (Mixed Formatting)',
    'advanced_threshold_check': 'The Threshold Check (Convert, Sum, Deduce)',
    'advanced_two_step_comparison': '2-Step Comparison (Find B, then Total)',
    'advanced_cutting_ribbon': 'Cutting a Ribbon (Subtract Twice)',
    'advanced_hidden_base': 'The "Hidden Base" Conversion'
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
    "questionText": "string (the main problem statement)",
    "options": ${optionsStr},
    "finalAnswer": "string (exact answer matching the logic)",
    "defectMap": ${defectMapStr},
    "solutionSteps": "string (detailed step-by-step model solution, use exact string characters \\n to separate steps)",
    "hint": "string (pedagogical scaffolding)"
  },
  "visualEngine": ${visualEngineStr},
  "inputRequirement": ${inputReq}
}`;
    };

    const diffLower = difficulty.toLowerCase();

    if (diffLower === 'foundation') {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions);
    }

    if (diffLower === 'standard') {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions);
    }

    if (diffLower === 'advanced') {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions);
    }

    throw new Error(`Unsupported difficulty: ${difficulty}`);
  }
};
