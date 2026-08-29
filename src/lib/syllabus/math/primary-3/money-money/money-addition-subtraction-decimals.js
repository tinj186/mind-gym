import { foundationLogic } from './money-addition-subtraction-decimals/foundation.js';
import { standardLogic } from './money-addition-subtraction-decimals/standard.js';
import { advancedLogic } from './money-addition-subtraction-decimals/advanced.js';

export const p3MoneyAdditionSubtractionDecimalsBlueprint = {
  id: 'p3-money-money-addition-subtraction-decimals',
  blueprint: 'Money Addition & Subtraction (Decimals)',
  variants: {
    'foundation_pure_addition': 'Pure Addition (No Regrouping Across Dollars)',
    'foundation_pure_subtraction': 'Pure Subtraction (No Regrouping Across Dollars)',
    'foundation_make_whole_dollar': 'Making the Next Whole Dollar',
    'foundation_change_from_10': 'Change from a $10 Note',
    'foundation_visual_receipt': 'Visual Receipt/Menu Addition',
    'standard_addition_regrouping': 'Addition with Regrouping (Cents to Dollars)',
    'standard_subtraction_regrouping': 'Subtraction with Regrouping (Dollars to Cents)',
    'standard_two_step_addition': 'Two-Step Addition (3 Items)',
    'standard_reverse_subtraction': 'Finding the Original Amount (Reverse Subtraction)',
    'standard_comparison': 'Comparison (How much more/less)',
    'advanced_add_find_change': 'Add, Then Find Change (3-Step Logic)',
    'advanced_insufficient_funds': 'Insufficient Funds (The Shortfall)',
    'advanced_total_of_two': 'The "Total of Two People" (Comparison into Addition)',
    'advanced_unitary_pricing': 'Unitary Pricing (Multiplication via Repeated Addition)',
    'advanced_deduction_from_total': 'Deduction from Total (Missing Item)'
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 3';
    const topic = 'Money';
    const subtopic = 'Money Addition & Subtraction (Decimals)';
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
  "content": {
    "questionText": "string (the question to the student)",
    "options": ${optionsStr},
    "defectMap": ${defectMapStr},
    "hint": "string (helpful scaffold for student)",
    "finalAnswer": "string (MUST exactly match correct option or expected input)",
    "solutionSteps": ["string", "string"]
  },
  "visualEngine": ${visualEngineStr || `{"componentToRender": "NONE", "componentData": {"hideVisual": true}}`},
  "inputRequirement": ${inputReq}
}`;
    };

    if (activeVariant.startsWith('foundation_')) {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions);
    } else if (activeVariant.startsWith('standard_')) {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions);
    } else if (activeVariant.startsWith('advanced_')) {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions);
    } else {
      throw new Error(`Difficulty '${difficulty}' logic not implemented for ${this.id}`);
    }
  }
};
