import { foundationLogic } from './measurement-comparison/foundation';
import { standardLogic } from './measurement-comparison/standard';
import { advancedLogic } from './measurement-comparison/advanced';

export const p2MeasurementComparisonBlueprint = {
  title: 'Measurement Comparison',
  variants: {
    'foundation_compare_two_lengths': 'Compare two lengths (longer/shorter)',
    'foundation_compare_two_masses': 'Compare two masses (heavier/lighter)',
    'foundation_compare_two_volumes': 'Compare two volumes (more/less)',
    'foundation_identify_longest_shortest': 'Identify longest/shortest from 3 lengths',
    'foundation_identify_heaviest_lightest': 'Identify heaviest/lightest from 3 masses',
    
    'standard_difference_lengths': 'Find the difference between two lengths',
    'standard_difference_masses': 'Find the difference between two masses',
    'standard_difference_volumes': 'Find the difference between two volumes',
    'standard_order_lengths': 'Order 3 lengths',
    'standard_order_masses': 'Order 3 masses',
    
    'advanced_relative_length': 'Find absolute length from relative comparison',
    'advanced_relative_mass': 'Find absolute mass from relative comparison',
    'advanced_relative_volume': 'Find absolute volume from relative comparison',
    'advanced_total_from_relative_length': 'Find total length from relative comparison',
    'advanced_total_from_relative_mass': 'Find total mass from relative comparison',
    'advanced_total_from_relative_volume': 'Find total volume from relative comparison'
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
    "subtopic": "Measurement Comparison",
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

    if (difficulty.toLowerCase() === 'foundation') {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, getQText);
    } else if (difficulty.toLowerCase() === 'standard') {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, getQText);
    } else if (difficulty.toLowerCase() === 'advanced') {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, getQText);
    }
    
    throw new Error(`Unknown difficulty ${difficulty}`);
  }
};
