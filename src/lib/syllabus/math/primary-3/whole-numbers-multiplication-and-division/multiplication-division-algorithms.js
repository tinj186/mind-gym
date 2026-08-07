import { foundationLogic } from './multiplication-division-algorithms/foundation';
// import { standardLogic } from './multiplication-division-algorithms/standard';
// import { advancedLogic } from './multiplication-division-algorithms/advanced';
import { getRandomNames, getRandomCountableItems } from '@/lib/utils/variable-bank';

export const p3MultiplicationDivisionAlgorithmsBlueprint = {
  id: 'p3-multiplication-division-algorithms',
  title: 'Multiplication & Division Algorithms',
  strand: 'Number and Algebra',
  visualType: 'DYNAMIC',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 1000,
      logicDescription: "Direct algorithmic execution (2-digit or 3-digit by 1-digit) without complex renaming or remainders."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 1,
      maxNumber: 10000,
      logicDescription: "Standard 3-digit and 4-digit multiplication/division algorithms with renaming."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 2,
      maxNumber: 10000,
      logicDescription: "Missing digits in multiplication/division algorithms or multi-step word problems."
    }
  },

  variants: {
    foundation_direct_multiplication: "Direct Multiplication (No Renaming)",
    foundation_direct_division: "Direct Division (Exact, No Remainder)",
    foundation_single_step_renaming_mult: "Single-Step Renaming (Multiplication)",
    foundation_missing_factor: "Finding the Missing Factor (Basic Inverse)",
    foundation_zero_in_ones: "Zero in the Ones Place (Multiplication)"
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 3';
    const topic = 'Whole Numbers - Multiplication and Division';
    const subtopic = 'Multiplication & Division Algorithms';

    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';

    const zodType = type === 'Short Question' ? 'SHORT_QUESTION' : type.toUpperCase();
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const contextName = getRandomNames(1);
    const contextItemObj = getRandomCountableItems(1);
    const context = { name: contextName, setting: "the store" };
    const selectedContextItem = contextItemObj.item;

    const getFormatInstructions = (visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: { hideVisual: true } }), inputRequirementStr = null) => `OUTPUT FORMAT (Return ONLY valid JSON matching this schema, with NO markdown formatting, NO \`\`\`json blocks, and NO trailing characters/braces):
{
  "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
  "content": {
    "questionText": "string - the actual question stem",
    "options": ${isMCQ ? '["option 1", "option 2", "option 3", "option 4"]' : 'null'},
    "defectMap": ${isMCQ ? '{"wrong_option_1": "CARELESS_CALCULATION", "wrong_option_2": "CONCEPTUAL_ERROR"}' : 'null'},
    "hint": "string - a conceptual hint",
    "solutionSteps": "string - step-by-step mathematical explanation formatted strictly as a numbered list (1. ..., 2. ..., 3. ...) with explicit \\n characters between steps",
    "finalAnswer": "string - the exact final answer string"
  },
  "visualEngine": ${visualEngineStr}${inputRequirementStr ? `,\n  "inputRequirement": ${inputRequirementStr}` : ''}
}`;

    let aiPrompt = `
You are an expert mathematics educator creating content for Primary 3 students.

Topic: ${topic}
Difficulty: ${difficulty}
Variant: ${activeVariant}

Your task is to generate a JSON response following this strict schema.
`;

    if (difficulty.toLowerCase() === 'foundation') {
      const {
        askText,
        questionStemConstraint,
        customConstraints,
        solutionStepsConstraint,
        visualEngineStr,
        inputRequirementStr,
        answer
      } = foundationLogic(difficulty, activeVariant, type, context, selectedContextItem, getFormatInstructions);

      aiPrompt += `
${getFormatInstructions(visualEngineStr, inputRequirementStr)}

CRITICAL INSTRUCTIONS:
${questionStemConstraint}
- The final answer MUST exactly match: "${answer}".
${solutionStepsConstraint ? solutionStepsConstraint : ''}
${customConstraints ? customConstraints : ''}
`;
    } else {
      throw new Error("Variant logic not implemented for this difficulty yet.");
    }

    return { aiPrompt };
  }
};
