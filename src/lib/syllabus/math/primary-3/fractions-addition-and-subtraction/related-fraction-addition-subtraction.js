import { foundationLogic } from './related-fraction-addition-subtraction/foundation.js';
import { standardLogic } from './related-fraction-addition-subtraction/standard.js';
import { advancedLogic } from './related-fraction-addition-subtraction/advanced.js';

export const p3RelatedFractionAdditionSubtractionBlueprint = {
  id: 'p3-fractions-related-fraction-addition-subtraction',
  blueprint: 'Related Fraction Addition & Subtraction',
  variants: {
    'foundation_visual_addition': 'Visual Addition (Stacked Equivalence)',
    'foundation_visual_subtraction': 'Visual Subtraction (Cross-Out Method)',
    'foundation_convert_first': 'The "Convert First" Scaffold',
    'foundation_error_analysis': 'Identify the Incorrect Step (Error Analysis)',
    'foundation_match_equation': 'Match the Equivalent Equation',
    'standard_algorithmic_addition': 'Pure Algorithmic Addition (with Simplification)',
    'standard_algorithmic_subtraction': 'Pure Algorithmic Subtraction (with Simplification)',
    'standard_missing_addend': 'The Missing Addend (Algebraic Thinking)',
    'standard_missing_subtrahend': 'The Missing Subtrahend',
    'standard_compare_sum_to_1': 'Compare the Sum to 1 Whole',
    'advanced_rest_of_whole': 'The "Rest of the Whole" (1 - (A + B))',
    'advanced_how_much_more': 'How Much More? (Difference Context)',
    'advanced_multi_operation': 'Multi-Operation (Add then Subtract)',
    'advanced_reverse_logic': 'Deduce the Starting Amount (Reverse Logic)',
    'advanced_unrelated_denominator': 'The Unrelated Denominator Trap'
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 3';
    const topic = 'Fractions - Addition & Subtraction';
    const subtopic = 'Related Fraction Addition & Subtraction';
    const safeType = String(type).toLowerCase();
    const isMCQ = safeType === 'mcq';
    const isShort = safeType === 'short question';
    const isStructure = safeType === 'structured';

    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const getFormatInstructions = (visualEngineStr, inputRequirementStr) => {
      const inputReq = inputRequirementStr || JSON.stringify({ inputType: isMCQ ? "MCQ_BUTTONS" : "STANDARD_TEXT" });
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
  "visualEngine": ${visualEngineStr},
  "content": {
    "questionText": "string (the question to the student)",
    "options": ${optionsStr},
    "defectMap": ${defectMapStr},
    "hint": "string (helpful scaffold for student)",
    "finalAnswer": "string (MUST exactly match correct option or expected input)",
    "solutionSteps": ["string", "string"]
  },
  "inputRequirement": ${inputReq}
}`;
    };

    if (difficulty.toLowerCase() === 'foundation') {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions);
    }
    if (difficulty.toLowerCase() === 'standard') {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions);
    }
    if (difficulty.toLowerCase() === 'advanced') {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions);
    }

    throw new Error(`Unsupported difficulty: ${difficulty}`);
  }
};
