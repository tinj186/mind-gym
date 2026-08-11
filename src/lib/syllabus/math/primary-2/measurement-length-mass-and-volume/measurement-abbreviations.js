import { getRandomNames, getRandomLengthItems } from '@/lib/utils/variable-bank';
import { foundationLogic } from './measurement-abbreviations/foundation';
import { standardLogic } from './measurement-abbreviations/standard';
import { advancedLogic } from './measurement-abbreviations/advanced';

export const p2MeasurementAbbreviationsBlueprint = {
  title: 'Measurement Abbreviations',
  variants: {
    'foundation_word_to_abbreviation': 'Convert full word to abbreviation',
    'foundation_abbreviation_to_word': 'Convert abbreviation to full word',
    'foundation_identify_measurement_type': 'Identify physical property of abbreviation',
    
    'standard_appropriate_length_unit': 'Choose appropriate length unit',
    'standard_appropriate_mass_unit': 'Choose appropriate mass unit',
    'standard_appropriate_volume_unit': 'Choose appropriate volume unit',
    
    'advanced_best_estimate_length': 'Estimate appropriate length',
    'advanced_best_estimate_mass': 'Estimate appropriate mass',
    'advanced_best_estimate_volume': 'Estimate appropriate volume'
  },
  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 2';
    const topic = 'Measurement - Length, Mass and Volume'; 
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';
    
    const zodType = type === 'Short Question' ? 'SHORT_QUESTION' : type.toUpperCase();
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    
    const getQText = (structureText, shortText) => {
      if (isStructure) return structureText;
      return shortText || structureText;
    };
    
    const getFormatInstructions = (visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`, inputRequirementStr = null) => `OUTPUT FORMAT (Return ONLY valid JSON matching this schema, with NO markdown formatting, NO \`\`\`json blocks, and NO trailing characters/braces):
{
  "meta": {
    "level": "${level}",
    "topic": "${topic}",
    "subtopic": "Measurement Abbreviations",
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
    const context = { name: getRandomNames(1), setting: "the store" };
    const selectedContextItem = getRandomLengthItems();

    if (isStructure) {
      throw new Error('Structured questions are not supported for Measurement Abbreviations. Please use MCQ or Short Question.');
    }

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
