import { getRandomNames, getRandomLengthItems } from '@/lib/utils/variable-bank';
// import { getFormatInstructions } from '@/lib/intelligence/generation-utils';
import { foundationLogic } from './measurement/foundation';
import { standardLogic } from './measurement/standard';
import { advancedLogic } from './measurement/advanced';

export const measurementBlueprint = {
  title: 'Measurement (Length, Mass, Volume)',
  variants: {
    'foundation_appropriate_unit': 'Choose appropriate unit for measurement',
    'foundation_reading_ruler': 'Read measurement from ruler starting at 0',
    'foundation_reading_mass_scale': 'Read measurement from a mass scale',
    'foundation_reading_volume_beaker': 'Read measurement from a volume beaker',
    'foundation_estimate_measurement': 'Estimate the measurement of an object',
    
    'standard_reading_ruler_offset': 'Read measurement from ruler not starting at 0',
    'standard_compare_two_lengths': 'Compare two lengths',
    'standard_compare_two_masses': 'Compare two masses',
    'standard_compare_two_volumes': 'Compare two volumes',
    'standard_total_mass': 'Find total mass of two items',
    
    'advanced_difference_length': 'Find difference in lengths',
    'advanced_find_start_point_ruler': 'Find start point on a ruler given end and length',
    'advanced_balance_scale_mass': 'Find missing mass on a balance scale',
    'advanced_combined_volume_beakers': 'Find total combined volume',
    'advanced_mass_change': 'Find remaining mass after some is used'
  },
  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 2';
    const topic = 'Measurement - Length, Mass and Volume'; 
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';
    
    const zodType = type;
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    
    const getQText = (structureText, shortText) => {
      if (isStructure) return structureText;
      return shortText || structureText;
    };
    
    // The mandatory format instructions for the Generation Engine schema
    const getFormatInstructions = (visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`, inputRequirementStr = null) => `OUTPUT FORMAT (Return ONLY valid JSON matching this schema, with NO markdown formatting, NO \`\`\`json blocks, and NO trailing characters/braces):
{
  "meta": {
    "level": "${level}",
    "topic": "${topic}",
    "subtopic": "${topic}",
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

    // Universal Engine localization
    const context = { name: getRandomNames(1)[0], setting: "the store" };
    const selectedContextItem = getRandomLengthItems();

    if (difficulty.toLowerCase() === 'foundation') {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText);
    } else if (difficulty.toLowerCase() === 'standard') {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText);
    } else if (difficulty.toLowerCase() === 'advanced') {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText);
    }
    
    throw new Error(`Unknown difficulty ${difficulty}`);
  }
};
