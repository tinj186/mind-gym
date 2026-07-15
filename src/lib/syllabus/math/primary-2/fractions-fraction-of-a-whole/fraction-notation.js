import { foundationLogic } from './fraction-notation/foundation';
import { standardLogic } from './fraction-notation/standard';
import { advancedLogic } from './fraction-notation/advanced';
import { getRandomNames, CONTEXT_TIERS } from '@/lib/utils/variable-bank';

export const fractionNotationBlueprint = {
  title: 'Fraction Notation',
  variants: {
    // Foundation
    'foundation_num_to_word': 'Match numeric fraction to word form.',
    'foundation_word_to_num': 'Match word form to numeric fraction.',
    'foundation_fraction_meaning': 'Identify the meaning of a fraction (e.g. 1 out of 4 equal parts).',
    'foundation_parts_to_fraction': 'Translate "X out of Y equal parts" to a numeric fraction.',
    'foundation_identify_unit_fraction': 'Identify a fraction with 1 as the numerator (unit fraction).',

    // Standard
    'standard_construct_from_desc': 'Construct a fraction given its numerator and denominator in words.',
    'standard_identify_components': 'Identify the numerator or denominator directly from a word form.',
    'standard_match_visual_to_word': 'Match a visual shape directly to its word form.',
    'standard_spelling_fractions': 'Spell out the fraction correctly.',
    'standard_word_problem_notation': 'Word problem where the final answer must be identified in word form.',

    // Advanced
    'advanced_identify_incorrect_notation': 'Identify the incorrect word notation for a given fraction.',
    'advanced_convert_wholes_to_words': 'Identify which word fraction represents a whole.',
    'advanced_word_problem_fraction_left': 'Word problem calculating the remaining fraction in word form.',
    'advanced_compare_word_fractions': 'Compare two fractions presented in word form.',
    'advanced_complex_construction': 'Construct a fraction from a complex description involving numerator and denominator.'
  },
  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 2';
    const topic = 'Fractions - Fraction of a Whole';
    const subtopic = 'Fraction Notation';
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
    const pluralItem = selectedObj.item;
    let singularItem = pluralItem;
    if (pluralItem.endsWith('ies')) singularItem = pluralItem.replace(/ies$/, 'y');
    else if (pluralItem.endsWith('s')) singularItem = pluralItem.replace(/s$/, '');

    const selectedContextItem = { plural: pluralItem, singular: singularItem };

    const diffKey = difficulty.toLowerCase();

    if (diffKey === 'foundation') {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText);
    } else if (diffKey === 'standard') {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText);
    } else if (diffKey === 'advanced') {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText);
    }

    throw new Error(`Unknown difficulty ${difficulty}`);
  }
};
