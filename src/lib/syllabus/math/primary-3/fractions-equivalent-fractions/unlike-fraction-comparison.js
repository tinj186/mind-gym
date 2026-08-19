import { foundationLogic } from './unlike-fraction-comparison/foundation';
import { standardLogic } from './unlike-fraction-comparison/standard';
import { advancedLogic } from './unlike-fraction-comparison/advanced';

export const p3UnlikeFractionComparisonBlueprint = {
  title: 'unlike fraction comparison',

  description: {
    foundation: {
      name: 'Foundation Practice',
      steps: 1,
      maxNumber: 10,
      logicDescription: "Basic visual comparison rules (same numerator, benchmark to 1/2)."
    },
    standard: {
      name: 'Standard Practice',
      steps: 2,
      maxNumber: 12,
      logicDescription: "Algorithmic comparison by scaling fractions to a common denominator mentally."
    },
    advanced: {
      name: 'Advanced Practice',
      steps: 3,
      maxNumber: 12,
      logicDescription: "Applying comparison rules to complex word problems, deductive reasoning, and contextual logic."
    }
  },

  variants: {
    'foundation_visual_comparison_same_numerator': 'Visual Comparison (Same Numerator)',
    'foundation_visual_comparison_related_denominators': 'Visual Comparison (Related Denominators)',
    'foundation_benchmark_half': 'The Benchmark of 1/2 (Visual Sorting)',
    'foundation_ordering_same_numerator': 'Ordering 3 Fractions (Visual Scaffold, Same Numerator)',
    'foundation_visual_equivalence_true_false': 'True/False Visual Equivalence',

    'standard_convert_compare': 'Convert to Compare (Find the Larger/Smaller)',
    'standard_missing_sign': 'The Missing Phrase (Greater / Smaller / Equal)',
    'standard_ordering_ascending': 'Ordering 3 Related Fractions (Ascending)',
    'standard_ordering_descending': 'Ordering 3 Related Fractions (Descending)',
    'standard_odd_one_out': 'Identify the Odd One Out (Magnitude)',

    'advanced_remaining_comparison': 'The Remaining Fraction Comparison (Inversion)',
    'advanced_missing_numerator': 'Deduce the Missing Numerator',
    'advanced_missing_denominator': 'Deduce the Missing Denominator',
    'advanced_benchmark_no_conversion': 'Benchmark Logic Without Conversion',
    'advanced_closest_to_one': 'Ordering from Context (The "Closest to 1" Rule)'
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 3';
    const topic = 'Fractions - Equivalent Fractions';
    const subtopic = 'Unlike Fraction Comparison';
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
    "questionText": ["string", "string"] (Array of strings for the full question text. Break into multiple lines if needed.),
    "options": ["string", "string", "string", "string"] (ONLY if MCQ, otherwise empty array),
    "defectMap": { "distractor1": "Error category", "distractor2": "Error category" } (ONLY if MCQ, otherwise empty object),
    "hint": "string (Pedagogical hint)",
    "solutionSteps": ["string", "string"] (Array of strings for the step-by-step model solution. Use EXACTLY the characters \\\\n for any newlines inside strings if needed.),
    "finalAnswer": "string (The exact final answer)"
  },
  "visualEngine": ${visualEngineStr},
  "inputRequirement": ${inputReq}
}`;
    };

    if (difficulty.toLowerCase() === 'foundation') {
      return foundationLogic(
        activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff,
        level, topic, getFormatInstructions
      );
    } else if (difficulty.toLowerCase() === 'standard') {
      return standardLogic(
        activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff,
        level, topic, getFormatInstructions
      );
    } else if (difficulty.toLowerCase() === 'advanced') {
      return advancedLogic(
        activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff,
        level, topic, getFormatInstructions
      );
    } else {
      throw new Error(`Difficulty ${difficulty} not implemented for unlike fraction comparison.`);
    }
  }
};
