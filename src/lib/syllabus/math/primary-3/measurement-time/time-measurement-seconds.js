import { foundationLogic } from './time-measurement-seconds/foundation.js';
import { standardLogic } from './time-measurement-seconds/standard.js';
import { advancedLogic } from './time-measurement-seconds/advanced.js';

export const p3TimeMeasurementSecondsBlueprint = {
  id: 'p3-measurement-time-time-measurement-seconds',
  blueprint: 'Time Measurement (Seconds)',
  variants: {
    'foundation_pure_conversion': 'Pure Conversion (Minutes to Seconds)',
    'foundation_compound_to_pure': 'Compound Time to Pure Seconds (1 min + s)',
    'foundation_add_within_60': 'Adding Durations Within 60 Seconds',
    'foundation_compare_within_60': 'Comparing Durations Within 60 Seconds',
    'foundation_shortfall_to_1min': 'Shortfall to Complete 1 Minute',
    'standard_decompose_pure': 'Decomposing Pure Seconds to Compound Units (<120 s)',
    'standard_add_compound_pure': 'Adding Compound Time and Pure Seconds (Without Overflow)',
    'standard_compound_to_pure_2min': 'Compound Time to Pure Seconds (2 min+ Boundary)',
    'standard_addition_cross_60': 'Addition Crossing the 60-Second Threshold (Pure Seconds Output)',
    'standard_comparison_seconds': 'Comparison Word Problem with Seconds',
    'advanced_add_pure_convert': 'Add Pure Seconds, Then Convert to Compound Units',
    'advanced_compare_mixed_formats': 'Comparison of Mixed Formats (Convert, Then Subtract)',
    'advanced_three_part_total': '3-Part Total (Sequential Addition Across Legs)',
    'advanced_target_limit_deduction': 'Deduction from a Target Time Limit',
    'advanced_constant_diff_convert': 'Constant Difference to Find Person B, Then Convert'
  },
  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 3';
    const topic = 'Measurement and Geometry';
    const subtopic = 'Time';
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
    "options": ${optionsStr},
    "defectMap": ${defectMapStr},
    "hint": "string",
    "finalAnswer": "string",
    "solutionSteps": "string"
  },
  "visualEngine": ${visualEngineStr},
  "inputRequirement": ${inputReq}
}`;
    };

    const safeDiff = difficulty.toLowerCase();

    if (safeDiff === 'foundation') {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions);
    } else if (safeDiff === 'standard') {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions);
    } else if (safeDiff === 'advanced') {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions);
    }

    throw new Error(`Unknown difficulty: ${difficulty}`);
  }
};
