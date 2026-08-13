import { foundationLogic } from './fractions-in-simplest-form/foundation.js';
import { getRandomNames, getRandomDivisibleFoods } from '../../../../utils/variable-bank.js';

export const p3FractionsInSimplestFormBlueprint = {
  id: 'p3-fractions-in-simplest-form',
  title: 'Fractions in Simplest Form',
  strand: 'Number and Algebra',
  visualType: 'DYNAMIC',

  difficultyLevels: {
    foundation: {
      name: 'Basic Simplification & Visual Proof',
      steps: 1,
      maxNumber: 8,
      logicDescription: "Introducing simplification via the 2, 3, and 4 times tables. High reliance on visual models to prove that a fraction cut into fewer pieces is still the same size. Denominators capped at 8."
    },
    standard: {
      name: 'Standard Practice',
      steps: 1,
      maxNumber: 12,
      logicDescription: "Standard simplification."
    },
    advanced: {
      name: 'Advanced Practice',
      steps: 2,
      maxNumber: 24,
      logicDescription: "Advanced simplification."
    }
  },

  variants: {
    'foundation_visual_simplification': 'Visual Simplification (Divide by 2, 3, or 4)',
    'foundation_divide_by_x': 'The "Divide by X" Direct Prompt',
    'foundation_true_false': 'Identifying the Simplest Form (True/False)',
    'foundation_match': 'The Simplest Form Match',
    'foundation_evaluate_simplification': 'Evaluate the Simplification'
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 3';
    const topic = 'Fractions - Equivalent Fractions';
    const subtopic = 'Fractions in Simplest Form';
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

    let result;
    const normalizedDifficulty = difficulty.toLowerCase();
    if (normalizedDifficulty === 'foundation') {
      result = foundationLogic.generate(difficulty, activeVariant, type, context, selectedContextItem, getQText);
    } else {
      throw new Error(`Difficulty ${difficulty} not implemented yet`);
    }

    const aiPrompt = `
You are an expert primary school math teacher.
Generate a ${difficulty} difficulty ${type} question for the variant "${this.variants[activeVariant]}".

CRITICAL INSTRUCTIONS:
1. Use exactly this text for the question: "${result.askText}"
2. Use exactly this text for the hint: "${result.hint}"
3. Use exactly this text for the finalAnswer: "${result.answer}"
4. Use exactly these solution steps, separated by \\n: "${result.solutionSteps.join('\\n')}"
${result.customConstraints ? '\nCUSTOM CONSTRAINTS:\n' + result.customConstraints : ''}

${getFormatInstructions(result.visualEngineStr, result.inputRequirementStr)}
    `.trim();

    return { aiPrompt };
  }
};
