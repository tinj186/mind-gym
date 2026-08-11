import { foundationLogic } from './time/foundation';
import { standardLogic } from './time/standard';
import { advancedLogic } from './time/advanced';

export const timeBlueprint = {
  title: 'time', // Must match subtopic exactly if dynamic
  variants: {
    'foundation_read_time_exact_hour': 'Read time to the exact hour (minute 0).',
    'foundation_read_time_half_hour': 'Read time to the half-hour (minute 30).',
    'foundation_am_pm_morning': 'Identify a.m. or p.m. for morning activities.',
    'foundation_am_pm_night': 'Identify a.m. or p.m. for night activities.',
    'foundation_time_duration_later': 'Find the time X hours later (exact hours, simple).',

    'standard_read_time_5_mins': 'Read time to 5-minute intervals.',
    'standard_time_duration': 'Find the time X hours later or earlier.',
    'standard_time_half_hour': 'Find the time half an hour later or earlier.',
    'standard_minute_hand_conversion': 'Convert between minute hand position (1-12) and minutes.',
    'standard_identify_wrong_hand': 'Identify which clock hand is drawn incorrectly.',

    'advanced_time_pattern_5_mins': 'Identify the next time in a 5-minute interval pattern.',
    'advanced_swapped_hands': 'Identify the time if the minute and hour hands were swapped.',
    'advanced_identify_wrong_hand_subtle': 'Identify subtle errors in the hour hand position.',
    'advanced_faulty_clock_correction': 'Calculate actual time from a fast or slow clock.',
    'advanced_chained_duration': 'Calculate end times for chained activities.'
  },
  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 2';
    // Dummy topic/subtopic for now, will be overridden dynamically by engine
    const topic = 'Topic'; 
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';
    
    // Zod formatting strings
    const zodType = type === 'Short Question' ? 'SHORT_QUESTION' : type.toUpperCase();
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    
    // Helper to switch text based on type
    const getQText = (structureText, shortText) => {
      if (isStructure) return structureText;
      return shortText || structureText;
    };
    
    // JSON Schema format instructions
    const getFormatInstructions = (visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`, inputRequirementStr = null) => `OUTPUT FORMAT (Return ONLY valid JSON matching this schema, with NO markdown formatting, NO \`\`\`json blocks, and NO trailing characters/braces):
{
  "meta": {
    "level": "${level}",
    "topic": "${topic}",
    "subtopic": "time",
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
  "visualEngine": ${visualEngineStr}${inputRequirementStr ? `,\n  "inputRequirement": ${inputRequirementStr}` : ''}
}`;
    
    // Dummy context (will be replaced by Universal Engine localization)
    const context = { name: "Ahmad", setting: "the library" };
    const selectedContextItem = "books";

    const normalizedDiff = difficulty.toLowerCase();
    
    if (normalizedDiff === 'foundation') {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText);
    } else if (normalizedDiff === 'standard') {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText);
    } else if (normalizedDiff === 'advanced') {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText);
    }
    
    throw new Error(`Unknown difficulty ${difficulty}`);
  }
};
