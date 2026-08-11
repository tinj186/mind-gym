import { foundationLogic } from './time-conversion/foundation';
import { standardLogic } from './time-conversion/standard';
import { advancedLogic } from './time-conversion/advanced';

export const timeConversionBlueprint = {
  title: 'time conversion',
  variants: {
    'foundation_convert_hours_bidirectional': 'Randomly convert between whole hours and minutes, or minutes back to whole hours, using multiples (e.g., 2 hours = 120 minutes, or 180 minutes = 3 hours).',
    'foundation_convert_half_hours_bidirectional': 'Randomly convert between multiples of half-hours and minutes, or vice versa (e.g., half an hour = 30 minutes, 3 half-hours = 90 minutes, or 60 minutes = 2 half-hours).',
    'foundation_identify_equivalents': 'Identify equal durations from a set of options (e.g., matching a card that says "1 hour" to a card that says "60 minutes").',
    'foundation_true_false_conversions': 'Evaluate a simple equivalence statement as true or false to test unit recognition (e.g., "True or False: 2 hours is the same amount of time as 60 minutes.").',
    'foundation_sort_mixed_units': 'Arrange three simple duration values from shortest to longest, using a mix of hour and minute formatting (e.g., order these from shortest to longest: 120 minutes, half an hour, 1 hour).',
    'standard_recurring_event_conversion': 'Calculate the total minutes for a recurring daily activity given in whole hours (e.g., "Siti reads for 1 hour each day for 3 days. How many total minutes did she read?").',
    'standard_combined_activities_conversion': 'Calculate the total minutes of two distinct activities presented in mixed whole-hour and half-hour terms (e.g., "A bus ride takes 1 hour and walking takes half an hour. How many minutes is the entire journey?").',
    'standard_schedule_duration_comparison': 'Extract an activity\'s duration from a provided schedule and compare it to an hour or half-hour threshold to answer a word problem (e.g., "Look at the timetable. Is the Science lesson longer or shorter than 1 hour?").',
    'standard_minutes_to_complete_hour': 'Calculate the remaining minutes needed to complete a full hour or multiple hours from a given starting duration (e.g., "John wants to play for 1 hour. He has played for 30 minutes. How many more minutes can he play?").',
    'standard_four_operations_substitution': 'Solve a word problem by converting an hour or half-hour anchor into minutes to perform a randomized arithmetic operation: addition, subtraction, multiplication, or division (e.g., "A 1-hour class is split equally into 2 parts. How many minutes is each part?").',
    'advanced_remainder_minutes_from_hour': 'Solve a 2-step word problem where a 1-hour anchor must be converted to 60 minutes before subtracting a smaller minute value to find the remainder (e.g., "A 1-hour lesson includes a 15-minute spelling test. The rest of the time is for reading. How many minutes is the reading time?").',
    'advanced_accumulate_minutes_to_hours': 'Calculate the total duration of multiple recurring activities given in 30-minute blocks using repeated addition, then convert the final sum back into whole hours (e.g., "John plays a game for 30 minutes on Saturday and 30 minutes on Sunday. How many whole hours did he play altogether?").',
    'advanced_comparative_word_problem': 'Solve a 2-step comparison problem that forces a unit conversion before subtraction can occur (e.g., "Siti painted for 1 hour. Ali painted for 45 minutes. How many MORE minutes did Siti paint than Ali?").',
    'advanced_timeline_unit_substitution': 'Determine the final end time of two sequential events where the durations are given in different unit formats that require mental substitution to advance the timeline (e.g., "A concert starts at 2:00 p.m. The first part lasts 60 minutes. The second part lasts half an hour. What time does the concert end?").',
    'advanced_schedule_gap_conversion': 'Calculate the duration of a break between two scheduled events using chronological counting, but the final answer must be outputted in a converted unit (e.g., the schedule shows math ending at 10:00 a.m. and recess ending at 10:30 a.m., but the question asks "How many minutes was recess?").'
  },
  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 2';
    const topic = 'Topic';
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';

    const zodType = type === 'Short Question' ? 'SHORT_QUESTION' : type.toUpperCase();
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const getQText = (structureText, shortText) => {
      if (isStructure || (isMCQ && difficulty.toLowerCase() === 'advanced')) return structureText;
      return shortText || structureText;
    };

    const getFormatInstructions = (visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`, inputRequirementStr = null) => `OUTPUT FORMAT (Return ONLY valid JSON matching this schema, with NO markdown formatting, NO \`\`\`json blocks, and NO trailing characters/braces):
{
  "meta": {
    "level": "${level}",
    "topic": "${topic}",
    "subtopic": "time conversion",
    "type": "${zodType}",
    "difficulty": "${zodDiff}"
  },
  "content": {
    "questionText": ["string (Line 1)", "string (Line 2)"] (Array of strings for the full question text. Break into multiple lines if needed.),
    "options": ["string", "string", "string", "string"] (ONLY if MCQ, otherwise empty array),
    "defectMap": { "distractor1": "Error category", "distractor2": "Error category" } (ONLY if MCQ, otherwise empty object),
    "hint": "string (Pedagogical hint)",
    "solutionSteps": ["string (Step 1)", "string (Step 2)"] (Array of strings for the step-by-step model solution. Break down the logic into distinct steps. separate steps using the exact characters \\\\n inside the string),
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
