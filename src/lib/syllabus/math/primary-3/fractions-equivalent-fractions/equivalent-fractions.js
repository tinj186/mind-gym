import { foundationLogic } from './equivalent-fractions/foundation.js';
import { standardLogic } from './equivalent-fractions/standard.js';
import { advancedLogic } from './equivalent-fractions/advanced.js';
import { getRandomNames, getRandomDivisibleFoods } from '../../../../utils/variable-bank.js';

export const p3EquivalentFractionsBlueprint = {
  id: 'p3-equivalent-fractions-1',
  title: 'Equivalent Fractions',
  strand: 'Number and Algebra',
  visualType: 'DYNAMIC',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery & Visual Concept',
      steps: 1,
      maxNumber: 12,
      logicDescription: "Finding equivalent fractions by multiplying the numerator and denominator by 2 or 3. High reliance on visual equivalence."
    },
    standard: {
      name: 'Simplest Form & Direct Application',
      steps: 1,
      maxNumber: 12,
      logicDescription: "Introducing division to find the simplest form of a fraction, and applying equivalent fractions without visual aids."
    },
    advanced: {
      name: 'Multi-Step Equivalence & Word Problems',
      steps: 2,
      maxNumber: 24,
      logicDescription: "Combining multiple fraction concepts like subtraction and simplification, finding double missing variables, and reverse operations. Deductive Scaffolding is mandatory for structured questions."
    }
  },

  variants: {
    'foundation_visual_missing_numerator': 'Visual Equivalence (Missing Numerator)',
    'foundation_visual_missing_denominator': 'Visual Equivalence (Missing Denominator)',
    'foundation_times_2_rule': 'The "Times 2" Rule',
    'foundation_times_3_rule': 'The "Times 3" Rule',
    'foundation_identifying_match': 'Identifying the Match (Notation)',

    'standard_simplest_form_2': 'Finding the Simplest Form (Divide by 2)',
    'standard_simplest_form_3_4': 'Finding the Simplest Form (Divide by 3 or 4)',
    'standard_scaling_reverse': 'Scaling to a Specific Denominator (Reverse)',
    'standard_true_false': 'True/False Equivalence Verification',
    'standard_simplest_missing_step': 'Simplest Form (Missing Step)',

    'advanced_remaining_simplify': 'Calculate Remaining Fraction, then Simplify',
    'advanced_equivalence_chain': 'Equivalence Chain (Double Missing Variables)',
    'advanced_who_is_correct': '"Who is Correct?" (Proving Equivalence)',
    'advanced_reverse_simplest': 'Reversing the Simplest Form (Finding the Original)',
    'advanced_find_total_parts': 'Find the Total Parts (Unknown Denominator from Context)',
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 3';
    const topic = 'Fractions - Equivalent Fractions';
    const subtopic = 'Equivalent Fractions';
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';

    const zodType = type === 'Short Question' ? 'SHORT_QUESTION' : type.toUpperCase();
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const getFormatInstructions = (visualEngineStr, inputRequirementStr) => {
      const inputReq = inputRequirementStr || JSON.stringify({ inputType: "STANDARD_TEXT" });
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
    "questionText": ["string (Line 1)", "string (Line 2)"] (Array of strings for the full question text. Break into multiple lines if needed.),
    "options": ["string", "string", "string", "string"] (ONLY if MCQ, otherwise empty array),
    "defectMap": { "distractor1": "Error category", "distractor2": "Error category" } (ONLY if MCQ, otherwise empty object),
    "hint": "string (Pedagogical hint)",
    "solutionSteps": "string (step-by-step model solution. You MUST separate steps using the exact characters \\\\n inside the string. Formatted strictly as a numbered list 1. ..., 2. ..., 3. ...)",
    "finalAnswer": "string (The exact final answer)"
  },
  "visualEngine": ${visualEngineStr},
  "inputRequirement": ${inputReq}
}
CRITICAL INSTRUCTION: DO NOT generate your own visualEngine. You MUST output EXACTLY the visualEngine and inputRequirement values provided in the schema above.`;
    };

    const name = getRandomNames(1)[0];
    const context = { name: name, pronoun: "they", pronounCaps: "They" };
    const selectedContextItem = getRandomDivisibleFoods(1)[0];

    const isMCQWordProblem = isMCQ ? Math.random() > 0.5 : false;
    const getQText = (structText, shortText) => {
      if (isStructure) return structText;
      if (isShort) return shortText;
      if (isMCQ) return isMCQWordProblem ? structText : shortText;
      return shortText;
    };

    if (difficulty === 'Foundation') {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, null, null, level, topic, getFormatInstructions, context, selectedContextItem, getQText);
    }

    if (difficulty === 'Standard') {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, null, null, level, topic, getFormatInstructions, context, selectedContextItem, getQText);
    }

    if (difficulty === 'Advanced') {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, null, null, level, topic, getFormatInstructions, context, selectedContextItem, getQText);
    }

    throw new Error(`Difficulty level not implemented: ${difficulty}`);
  }
};
