import { foundationLogic } from './time-duration-calculation/foundation.js';
import { standardLogic } from './time-duration-calculation/standard.js';
import { advancedLogic } from './time-duration-calculation/advanced.js';

export const p3TimeDurationCalculationBlueprint = {
  id: 'p3-measurement-time-time-duration-calculation',
  blueprint: 'Time Duration Calculation',
  variants: {
    'foundation_find_finishing_pure': 'Find Finishing Time (Pure Minutes)',
    'foundation_find_starting_pure': 'Find Starting Time (Pure Minutes)',
    'foundation_find_duration_same_hour': 'Find Duration (Same Hour)',
    'foundation_finishing_compound_no_cross': 'Find Finishing Time (Hours and Minutes, No Crossing)',
    'foundation_combine_two_durations': 'Combine Two Durations (Pure Minutes)',

    'standard_crossing_hour_a_b_c': 'Duration Calculation (Crossing the Hour)',
    'standard_total_duration_exceed_1h': 'Total Duration (Minutes Exceeding 1 Hour)',
    'standard_finishing_compound_cross': 'Find Finishing Time (Hours and Minutes, Crossing Hour)',
    'standard_timetable_duration_extraction': 'Timetable Duration Extraction',
    'standard_schedule_wait_time': 'Schedule Gap / Wait Time Analysis',

    'advanced_crossing_ampm_a_b_c': 'Duration Calculation (Crossing a.m./p.m. Boundaries)',
    'advanced_comparing_durations_diff': 'Comparing Durations (Constant Difference)',
    'advanced_total_deduction_hidden_break': 'Total Duration Deduction (Hidden Break)',
    'advanced_schedule_total_combined_time': 'Total Combined Time from Schedule',
    'advanced_chained_events_with_travel': 'Chained Events with Travel Time',
    'advanced_timetable_duration_comparison': 'Duration Comparison from Timetable'
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
