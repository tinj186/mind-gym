import { foundationLogic } from './measuring-time/foundation';
import { standardLogic } from './measuring-time/standard';
import { advancedLogic } from './measuring-time/advanced';

export const measuringTimeBlueprint = {
  title: 'measuring time in hours and minutes',
  variants: {
    'foundation_estimate_activity_duration': 'Match a familiar daily activity to its most realistic duration using multiples of hours or 30 minutes.',
    'foundation_duration_timeline_counting': 'Determine the total duration by counting provided 1-hour or 30-minute jumps on a visual timeline or number line.',
    'foundation_time_multiple_hours_later': 'Identify the time a specific number of whole hours before or after a given time.',
    'foundation_time_multiple_half_hours_later': 'Identify the time multiple 30-minute intervals earlier or later.',
    'foundation_duration_visual_clock_counting': 'Count the number of 1-hour or 30-minute intervals between two visual clock faces to find the total duration.',
    'standard_calculate_hour_duration': 'Randomly solve for either the start time, end time, or duration using whole-hour intervals (the a + b = c structure).',
    'standard_calculate_half_hour_duration': 'Randomly solve for either the start time, end time, or duration using 30-minute intervals (the a + b = c structure).',
    'standard_compare_two_durations': 'Compare two simple activities to identify which one took a longer or shorter amount of time (comparing hours to hours, or hours to minutes).',
    'standard_timetable_duration_extraction': 'Calculate the duration of an event (in hours or half-hours) by extracting the start and end times from a provided schedule.',
    'standard_total_sequential_duration': 'Calculate the total combined duration of two consecutive activities using whole hours or half-hours.',
    'advanced_schedule_mixed_duration': 'Randomly solve for the start time, end time, or duration using mixed units (hours and 30-minute intervals).',
    'advanced_multi_break_gap_analysis': 'Calculate the total combined break time within a schedule by extracting the end times of activities and start times of subsequent activities across two separate gaps.',
    'advanced_duration_across_noon': 'Calculate a whole-hour or half-hour duration that crosses the 12:00 mark, forcing chronological counting and a.m./p.m. awareness.',
    'advanced_duration_relative_comparison': 'Calculate the duration of an event based on a relative clue tied to another event.',
    'advanced_chained_events_with_gap': 'Determine the final end time of a sequence involving an activity, a specific gap or travel time, and a second activity.'
  },
  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 2';
    const topic = 'Topic';
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';

    const zodType = type;
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const getQText = (structureText, shortText) => {
      if (isStructure) return structureText;
      if (isMCQ && difficulty.toLowerCase() === 'advanced') return structureText;
      return shortText || structureText;
    };

    const getFormatInstructions = (visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`, inputRequirementStr = null) => `OUTPUT FORMAT (Return ONLY valid JSON matching this schema, with NO markdown formatting, NO \`\`\`json blocks, and NO trailing characters/braces):
{
  "meta": {
    "level": "${level}",
    "topic": "${topic}",
    "subtopic": "measuring time in hours and minutes",
    "type": "${zodType}",
    "difficulty": "${zodDiff}"
  },
  "content": {
    "questionText": ["string (Line 1)", "string (Line 2)"] (Array of strings for the full question text. Break into multiple lines if needed.),
    "options": ["string", "string", "string", "string"] (ONLY if MCQ, otherwise empty array),
    "defectMap": { "distractor1": "Error category", "distractor2": "Error category" } (ONLY if MCQ, otherwise empty object),
    "hint": "string (Pedagogical hint)",
    "solutionSteps": ["string (Step 1)", "string (Step 2)"] (Array of strings for the step-by-step model solution. Break down the logic into distinct steps.),
    "finalAnswer": "string (The exact final answer)"
  },
  "visualEngine": ${visualEngineStr},
  "inputRequirement": ${inputRequirementStr || `{"inputType": "TEXT_INPUT"}`}
}`;

    if (difficulty.toLowerCase() === 'foundation') {
      return foundationLogic(activeVariant, isMCQ, isShort, isStructure, getQText, getFormatInstructions);
    } else if (difficulty.toLowerCase() === 'standard') {
      return standardLogic(activeVariant, isMCQ, isShort, isStructure, getQText, getFormatInstructions);
    } else if (difficulty.toLowerCase() === 'advanced') {
      return advancedLogic(activeVariant, isMCQ, isShort, isStructure, getQText, getFormatInstructions);
    }
  }
};
