import { foundationLogic } from './measurement-km-ml/foundation.js';
import { standardLogic } from './measurement-km-ml/standard.js';
import { advancedLogic } from './measurement-km-ml/advanced.js';

export const p3MeasurementKmMlBlueprint = {
  id: 'p3-measurement-length-mass-and-volume-km-ml',
  blueprint: 'Length, Mass & Volume (km, ml)',
  variants: {
    'foundation_direct_beaker_reading': 'Direct Beaker Reading (On the Tick)',
    'foundation_advanced_beaker_reading': 'Advanced Beaker Reading (Between the Ticks)',
    'foundation_map_path_distance': 'Map Path Distance (Direct Reading)',
    'foundation_unit_appropriateness': 'Unit Appropriateness (km vs. m / ml vs. l)',
    'foundation_visual_volume_comparison': 'Visual Volume Comparison (Two Beakers)',
    'standard_beaker_to_compound_conversion': 'Beaker Reading to Compound Conversion',
    'standard_map_distance_addition': 'Map Distance Addition (Multi-segment Path)',
    'standard_volume_deduction': 'Volume Deduction (Poured Out)',
    'standard_distance_to_target': 'Distance to Target (Finding the Difference)',
    'standard_equal_groupings': 'Equal Groupings (Single Item Volume)',
    'advanced_subdivided_map': 'The Subdivided Map (Intermediate Stops)',
    'advanced_hidden_beaker': 'The Hidden Beaker (Total Volume Deduction)',
    'advanced_round_trip_journey': 'The Round Trip Journey',
    'advanced_combining_volumes': 'Combining Volumes (Target Threshold Check)',
    'advanced_constant_difference': 'The Constant Difference (Comparison)'
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
    ${isMCQ ? `"options": ${optionsStr},\n    "defectMap": ${defectMapStr},` : ''}
    "solutionSteps": ["string", "string"],
    "hint": "string"
  },
  "visualEngine": ${visualEngineStr || "null"},
  "inputRequirement": ${inputReq}
}`;
    };

    if (difficulty.toLowerCase() === 'foundation') {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions);
    } else if (difficulty.toLowerCase() === 'standard') {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions);
    } else if (difficulty.toLowerCase() === 'advanced') {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions);
    }

    throw new Error(`Difficulty level ${difficulty} is not implemented for this blueprint.`);
  }
};
