export const foundationLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) => {
  let questionText = "";
  let options = [];
  let defectMap = {};
  let hint = "";
  let solutionSteps = [];
  let answer = "";
  let inputRequirementStr = null;
  let visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: { hideVisual: true } });
  let customConstraints = "";

  if (activeVariant === 'foundation_mental_multiply_6_9') {
    const a = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
    const b = Math.floor(Math.random() * 9) + 2; // 2 to 10
    const total = a * b;
    answer = `${total}`;
    
    questionText = getQText(
      `Calculate mentally:\n\nWhat is ${a} x ${b}?`,
      `Calculate mentally: What is ${a} x ${b}?`
    );
    hint = `Think of your multiplication tables. What is ${a} groups of ${b}?`;
    solutionSteps = [
      `Using mental calculation:`,
      `${a} x ${b} = ${total}`
    ];
    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "${total}", "${Math.max(1, total - a)}", "${total + a}", "${total + b}"
      2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
    `;

    if (isStructure) {
      inputRequirementStr = JSON.stringify({ inputType: "STANDARD_TEXT" });
    }
  }
  else if (activeVariant === 'foundation_mental_divide_6_9') {
    const divisor = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
    const quotient = Math.floor(Math.random() * 9) + 2; // 2 to 10
    const dividend = divisor * quotient;
    answer = `${quotient}`;
    
    questionText = getQText(
      `Calculate mentally:\n\nWhat is ${dividend} ÷ ${divisor}?`,
      `Calculate mentally: What is ${dividend} ÷ ${divisor}?`
    );
    hint = `Think of your multiplication tables. What number multiplied by ${divisor} gives ${dividend}?`;
    solutionSteps = [
      `Using mental calculation:`,
      `Since ${divisor} x ${quotient} = ${dividend},`,
      `${dividend} ÷ ${divisor} = ${quotient}`
    ];
    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "${quotient}", "${Math.max(1, quotient - 1)}", "${quotient + 1}", "${quotient * 2}"
      2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
    `;

    if (isStructure) {
      inputRequirementStr = JSON.stringify({ inputType: "STANDARD_TEXT" });
    }
  }

  const aiPrompt = `
CRITICAL INSTRUCTION: You MUST use the EXACT strings provided below for questionText, hint, finalAnswer, and solutionSteps. DO NOT rephrase them!
CRITICAL INSTRUCTION: \`solutionSteps\` MUST be a single string formatted with \\n, NOT an array of objects. 
CRITICAL INSTRUCTION: You MUST include the exact \`inputRequirement\` block shown in the schema below in your final JSON output.
${customConstraints}

GENERATE:
askText = \`${questionText}\`
finalAnswer = \`${answer}\`
hint = \`${hint}\`
solutionSteps = \`${solutionSteps.map((step, index) => `${index + 1}. ${step}`).join('\\n')}\`

${getFormatInstructions(visualEngineStr, inputRequirementStr)}
  `;

  return { aiPrompt };
};
