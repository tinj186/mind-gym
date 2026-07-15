import { foundationLogic } from './fraction-comparison-up-to-denominator-12/foundation';
import { standardLogic } from './fraction-comparison-up-to-denominator-12/standard';
import { advancedLogic } from './fraction-comparison-up-to-denominator-12/advanced';
import { getRandomNames, CONTEXT_TIERS } from '@/lib/utils/variable-bank';

export const fractionComparisonBlueprint = {
  title: 'Fraction Comparison (Up to Denominator 12)',
  variants: {
    // Foundation
    'foundation_compare_like_fractions_visual': 'Compare two like fractions with visuals.',
    'foundation_compare_unit_fractions_visual': 'Compare two unit fractions with visuals.',
    'foundation_identify_greatest_like_visual': 'Identify the greatest of 3 like fractions with visuals.',
    'foundation_identify_smallest_unit_visual': 'Identify the smallest of 3 unit fractions with visuals.',
    'foundation_word_problem_visual': 'Word problem comparing 2 like or unit fractions with visuals.',

    // Standard
    'standard_compare_like_fractions': 'Compare two like fractions without visual cues.',
    'standard_compare_unit_fractions': 'Compare two unit fractions without visual cues.',
    'standard_order_like_fractions': 'Order 3 like fractions (e.g., smallest to greatest).',
    'standard_order_unit_fractions': 'Order 3 unit fractions.',
    'standard_word_problem_compare': 'Word problem asking to compare two fractions (no visuals).',

    // Advanced
    // Advanced
    'advanced_compare_missing_numerator': 'Given a comparison inequality, identify the possible missing numerator.',
    'advanced_compare_missing_denominator': 'Given a comparison inequality, identify the possible missing denominator.',
    'advanced_word_problem_compare_order': 'Word problem ordering 3 friends\' fractions to find greatest or smallest.',
    'advanced_order_missing_numerator': 'Identify a missing numerator to keep 3 fractions in order.',
    'advanced_identify_incorrect_comparison': 'Identify the incorrect comparison statement among three options.'
  },
  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 2';
    const topic = 'Fractions - Fraction of a Whole';
    const subtopic = 'Fraction Comparison (Up to Denominator 12)';
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';

    const zodType = type;
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
    "finalAnswer": "string (The exact final answer)"
  },
  "visualEngine": ${visualEngineStr}${inputRequirementStr ? `,\n  "inputRequirement": ${inputRequirementStr}` : ''}
}`;

    const context = { name: getRandomNames(1), setting: "school" };

    const pool = CONTEXT_TIERS.LOWER_BLOCK.GENERAL;
    const selectedObj = pool[Math.floor(Math.random() * pool.length)];

    let result = null;

    if (difficulty.toLowerCase() === 'foundation') {
      result = foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedObj, getQText);
    } else if (difficulty.toLowerCase() === 'standard') {
      result = standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedObj, getQText);
    } else if (difficulty.toLowerCase() === 'advanced') {
      result = advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedObj, getQText);
    }

    if (!result) {
      throw new Error(`Variant logic not found for ${activeVariant}`);
    }

    return result;
  }
};
