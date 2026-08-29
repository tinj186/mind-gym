import { foundationLogic } from './equivalent-fraction-writing/foundation.js';
import { standardLogic } from './equivalent-fraction-writing/standard.js';
import { advancedLogic } from './equivalent-fraction-writing/advanced.js';

export const p3EquivalentFractionWritingBlueprint = {
  id: 'p3-fractions-equivalent-fraction-writing',
  blueprint: 'Equivalent Fraction Writing (Using Multiplication)',
  variants: {
    'foundation_visual_forward_numerator': 'Visual Forward Scaling (Missing Numerator)',
    'foundation_visual_forward_denominator': 'Visual Forward Scaling (Missing Denominator)',
    'foundation_arrow_diagram_multiply': 'The "Times X" Direct Prompt (Arrow Diagram)',
    'foundation_subdivided_bar': 'Subdivided Bar Model (Find the Equation)',
    'foundation_true_false_missing_match': 'True/False Missing Variable Match',

    'standard_forward_numerator': 'Forward Scaling (Missing Numerator)',
    'standard_forward_denominator': 'Forward Scaling (Missing Denominator)',
    'standard_reverse_numerator': 'Reverse Scaling / Simplification (Missing Numerator)',
    'standard_reverse_denominator': 'Reverse Scaling / Simplification (Missing Denominator)',
    'standard_multiplier_check': 'The Multiplier Checkpoint',

    'advanced_sum_of_variables': 'The "Sum of A + B" Strategy (Double Missing Variables)',
    'advanced_contextual_forward': 'Contextual Forward Scaling (Missing Numerator)',
    'advanced_contextual_reverse': 'Contextual Reverse Deduction (Missing Denominator)',
    'advanced_add_first_then_scale': 'Add First, Then Find Equivalent',
    'advanced_impossible_conversion': 'Identify the Impossible Conversion (Denominator Limit)'
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 3';
    const topic = 'Fractions - Equivalent Fractions';
    const subtopic = 'Equivalent Fraction Writing';
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';

    const zodType = type === 'Short Question' ? 'SHORT_QUESTION' : type.toUpperCase();
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const getFormatInstructions = (visualEngineStr, inputRequirementStr) => {
      const inputReq = inputRequirementStr || JSON.stringify({ inputType: "STANDARD_TEXT" });
      const optionsStr = isMCQ ? `["string", "string", "string", "string"]` : `[]`;
      const defectMapStr = isMCQ ? `{ "distractor1": "Error category", "distractor2": "Error category" }` : `{}`;

      return `OUTPUT FORMAT (Return ONLY valid JSON matching this schema, with NO markdown formatting, NO \`\`\`json blocks, and NO trailing characters/braces):
{
  "meta": {
    "level": "${level}",
    "topic": "${topic}",
    "subtopic": "${subtopic}",
    "type": "${zodType}",
    "difficulty": "${zodDiff}"
  },
  "content": {
    "questionText": ["string", "string"] (Array of strings for the full question text. Break into multiple lines if needed.),
    "options": ${optionsStr},
    "defectMap": ${defectMapStr},
    "hint": "string (Pedagogical hint)",
    "solutionSteps": ["string", "string"] (Array of strings for the step-by-step model solution. Use EXACTLY the characters \\\\n for any newlines inside strings if needed.),
    "finalAnswer": "string (The exact final answer)"
  },
  "visualEngine": ${visualEngineStr},
  "inputRequirement": ${inputReq}
}`;
    };

    if (difficulty.toLowerCase() === 'foundation') {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions);
    }
    if (difficulty.toLowerCase() === 'standard') {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions);
    }
    if (difficulty.toLowerCase() === 'advanced') {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions);
    }

    throw new Error(`Variant not implemented for difficulty: ${difficulty}`);
  }
};
