import { foundationLogic } from './24-hour-clock/foundation.js';
import { standardLogic } from './24-hour-clock/standard.js';
import { advancedLogic } from './24-hour-clock/advanced.js';

export const p324HourClockBlueprint = {
  id: 'p3-measurement-time-24-hour-clock',
  blueprint: '24-hour clock',
  variants: {
    'foundation_direct_conversion_am': 'Direct Conversion (a.m. ↔ 24-Hour Clock)',
    'foundation_direct_conversion_pm': 'Direct Conversion (p.m. ↔ 24-Hour Clock)',
    'foundation_thresholds_noon_midnight': 'The 12-Hour Thresholds (Noon and Midnight)',
    'foundation_simple_timeline_same_hour': 'Simple Timeline (Start+Duration=End) within the Same Hour',
    'foundation_comparing_24h_times': 'Comparing 24-Hour Times',

    'standard_timeline_crossing_hour': 'Timeline Crossing the Next/Previous Hour',
    'standard_mixed_format_timeline': 'Mixed Format Timeline',
    'standard_timeline_hours_minutes': 'Timeline with Hours and Minutes',
    'standard_sequential_events': 'Sequential Events (Start+Event1+Event2=End)',
    'standard_constant_difference': 'Constant Difference Timeline (Person A vs. Person B)',

    'advanced_timeline_crossing_noon': 'Timeline Crossing Noon (11xx to 13xx)',
    'advanced_timeline_crossing_midnight': 'Timeline Crossing Midnight (23xx to 01xx)',
    'advanced_offset_delayed_timeline': 'The Offset / Delayed Timeline',
    'advanced_hidden_break_deduction': 'Hidden Break (Deduction from Total Elapsed Time)',
    'advanced_overlapping_events': 'Overlapping Events'
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

      return `CRITICAL INSTRUCTION: You MUST use the EXACT "visualEngine" and "inputRequirement" JSON objects provided in the template below. DO NOT hallucinate, change, or rewrite the structure, labels, expected answers, or accepted answers inside "inputRequirement".
OUTPUT FORMAT (Return ONLY valid JSON matching this schema, with NO markdown formatting, NO \`\`\`json blocks, and NO trailing characters/braces):
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
    "solutionSteps": "string (separate steps using the exact characters \\\\n inside the string)"
  },
  "visualEngine": ${visualEngineStr},
  "inputRequirement": ${inputReq}
}`;
    };

    const safeDifficulty = String(difficulty).toLowerCase();
    if (safeDifficulty === 'foundation') return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions);
    if (safeDifficulty === 'standard') return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions);
    if (safeDifficulty === 'advanced') return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions);
  }
};
