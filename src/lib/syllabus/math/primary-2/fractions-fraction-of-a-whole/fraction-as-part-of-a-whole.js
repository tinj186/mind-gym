import { foundationLogic } from './fraction-as-part-of-a-whole/foundation';
import { standardLogic } from './fraction-as-part-of-a-whole/standard';
import { advancedLogic } from './fraction-as-part-of-a-whole/advanced';
import { getRandomNames, CONTEXT_TIERS } from '@/lib/utils/variable-bank';

export const fractionAsPartBlueprint = {
  title: 'Fraction as Part of a Whole',
  variants: {
    'foundation_identify_fraction_shaded': 'Identify fraction from a shaded visual.',
    'foundation_identify_fraction_unshaded': 'Identify fraction from an unshaded visual.',
    'foundation_identify_shaded_parts': 'Count the number of shaded parts in a whole.',
    'foundation_identify_unshaded_parts': 'Count the number of unshaded parts in a whole.',
    'foundation_identify_total_parts': 'Count the total number of equal parts in a whole.',

    'standard_fraction_word_problem_shaded': 'Contextual problem asking for shaded fraction.',
    'standard_fraction_word_problem_unshaded': 'Contextual problem asking for unshaded fraction.',
    'standard_identify_fraction_of_whole': 'Identify what fraction one object is of a whole set (story context).',
    'standard_missing_numerator': 'Find the missing numerator to make a whole.',
    'standard_missing_denominator': 'Find the missing denominator for a given shaded fraction.',

    'advanced_find_remaining_fraction': 'Word problem: Find the remaining fraction after some parts are removed.',
    'advanced_combine_fractions_to_whole': 'Word problem: How many more parts needed to make a whole?',
    'advanced_fraction_properties_parts_in_whole': 'Identify how many parts (e.g., halves, quarters) make a whole.',
    'advanced_identify_whole_as_fraction': 'Express 1 whole as a fraction for a given denominator.',
    'advanced_visual_missing_parts_to_whole': 'Use a visual to find how many more shaded parts make a whole.'
  },
  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 2';
    const topic = 'Fractions - Fraction of a Whole';
    const subtopic = 'Fraction as Part of a Whole';
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

    // Default system instructions segment
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

    // Use variable bank for randomized names and items
    const context = { name: getRandomNames(1), setting: "the library" };
    
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
