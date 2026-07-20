import { getRandomNames, CONTEXT_TIERS } from '@/lib/utils/variable-bank';
import { foundationLogic } from './foundation';
import { standardLogic } from './standard';
import { advancedLogic } from './advanced';

export const likeFractionAdditionSubtractionBlueprint = {
  id: 'primary-2-fractions-addition-and-subtraction-like-fraction-addition-subtraction',
  variants: {
    // Foundation
    'foundation_add_like_visual': 'Add two like fractions given a visual representation.',
    'foundation_add_like_visual_word': 'Word problem with visual representation of addition.',
    'foundation_sub_like_visual': 'Subtract a like fraction given a visual representation.',
    'foundation_sub_from_whole_visual': 'Subtract a like fraction from 1 whole given a visual representation.',
    'foundation_find_missing_part_visual': 'Identify the fraction needed to make 1 whole using visual representation.',
    // Standard
    'standard_add_like_numeric': 'Simple numeric equation for adding like fractions.',
    'standard_sub_like_numeric': 'Simple numeric equation for subtracting like fractions.',
    'standard_sub_from_whole': 'Simple numeric equation for subtracting a fraction from 1 whole.',
    'standard_add_three_fractions': 'Add three like fractions together.',
    'standard_add_to_make_whole': 'Identify the sum of like fractions that make 1 whole.',
    // Advanced
    'advanced_missing_numerator_add': 'Fraction addition equation with a missing numerator.',
    'advanced_missing_numerator_sub': 'Fraction subtraction equation with a missing numerator.',
    'advanced_missing_numerator_three_parts': 'Identify missing numerator when 3 fractions add up to 1 whole.',
    'advanced_identify_incorrect_equation': 'Identify the incorrect fraction equation among 3 options.',
    'advanced_multi_step_word_problem': '2-step story problem for fractions.'
  },
  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 2';
    const topic = 'Fractions - Addition and Subtraction';
    const subtopic = 'Like Fraction Addition/Subtraction';
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';

    const zodType = type;
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const getQText = (structureText, shortText) => {
      if (isStructure) return structureText;
      return shortText || structureText;
    };

    const getFormatInstructions = (visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`, inputRequirementStr = null, acceptedAnswersStr = null) => `OUTPUT FORMAT (Return ONLY valid JSON matching this schema, with NO markdown formatting, NO \`\`\`json blocks, and NO trailing characters/braces):
{
  "meta": {
    "level": "${level}",
    "topic": "${topic}",
    "subtopic": "${subtopic}",
    "type": "${zodType}",
    "difficulty": "${zodDiff}"
  },
  "content": {
    "questionText": ["string (Line 1)", "string (Line 2)"] (Array of strings for the full question text. Break into multiple lines if needed.),
    "options": ["string", "string", "string", "string"] (ONLY if MCQ, otherwise empty array),
    "defectMap": { "distractor1": "Error category", "distractor2": "Error category" } (ONLY if MCQ, otherwise empty object),
    "hint": "string (Pedagogical hint)",
    "solutionSteps": "string (step-by-step model solution. You MUST separate steps using the exact characters \\\\n inside the string. Formatted strictly as a numbered list 1. ..., 2. ..., 3. ...)",
    "finalAnswer": "string (The exact final answer)"${acceptedAnswersStr ? `,\n    "acceptedAnswers": ${acceptedAnswersStr}` : ''}
  },
  "visualEngine": ${visualEngineStr}${inputRequirementStr ? `,\n  "inputRequirement": ${inputRequirementStr}` : ''}
}`;

    const context = { name: getRandomNames(1), setting: "school" };

    const pool = CONTEXT_TIERS.LOWER_BLOCK.GENERAL;
    const selectedObj = pool[Math.floor(Math.random() * pool.length)];

    let result = null;

    try {
      const normalizedDiff = difficulty.toLowerCase();
      if (normalizedDiff === 'foundation') {
        result = foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedObj, getQText);
      } else if (normalizedDiff === 'standard') {
        result = standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedObj, getQText);
      } else if (normalizedDiff === 'advanced') {
        result = advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedObj, getQText);
      } else {
        throw new Error(`Unhandled difficulty: ${difficulty}`);
      }
    } catch (e) {
      console.error('Error generating logic variant:', e);
      throw e;
    }

    return result;
  }
};
