export const standardLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) => {
  let questionText = "";
  let options = [];
  let defectMap = {};
  let hint = "";
  let solutionSteps = [];
  let answer = "";
  let inputRequirementStr = null;
  let visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: { hideVisual: true } });
  let customConstraints = "";

  if (activeVariant === 'standard_mental_multiply_mixed') {
    const a = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
    const b = Math.floor(Math.random() * 9) + 2;
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
  else if (activeVariant === 'standard_mental_divide_mixed') {
    const divisor = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
    const quotient = Math.floor(Math.random() * 9) + 2;
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
  else if (activeVariant === 'standard_mental_missing_factor') {
    const a = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
    const b = Math.floor(Math.random() * 9) + 2;
    const total = a * b;
    const missingFirst = Math.random() > 0.5;

    answer = missingFirst ? `${a}` : `${b}`;
    
    if (missingFirst) {
      questionText = getQText(
        `Calculate mentally:\n\n[?] x ${b} = ${total}\n\nWhat is the missing number?`,
        `Calculate mentally: [?] x ${b} = ${total}. What is the missing number?`
      );
      hint = `What number multiplied by ${b} gives ${total}? You can also think of it as ${total} ÷ ${b}.`;
      solutionSteps = [
        `Using mental calculation:`,
        `Think: [?] x ${b} = ${total}`,
        `This is the same as finding ${total} ÷ ${b}.`,
        `${total} ÷ ${b} = ${a}`,
        `The missing number is ${a}.`
      ];
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${a}", "${Math.max(1, a - 1)}", "${a + 1}", "${Math.max(1, b - 1)}"
        2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
      `;
    } else {
      questionText = getQText(
        `Calculate mentally:\n\n${a} x [?] = ${total}\n\nWhat is the missing number?`,
        `Calculate mentally: ${a} x [?] = ${total}. What is the missing number?`
      );
      hint = `What number multiplied by ${a} gives ${total}? You can also think of it as ${total} ÷ ${a}.`;
      solutionSteps = [
        `Using mental calculation:`,
        `Think: ${a} x [?] = ${total}`,
        `This is the same as finding ${total} ÷ ${a}.`,
        `${total} ÷ ${a} = ${b}`,
        `The missing number is ${b}.`
      ];
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${b}", "${Math.max(1, b - 1)}", "${b + 1}", "${a + 1}"
        2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
      `;
    }

    if (isStructure) {
      inputRequirementStr = JSON.stringify({ inputType: "STANDARD_TEXT" });
    }
  }
  else if (activeVariant === 'standard_mental_missing_dividend') {
    const divisor = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
    const quotient = Math.floor(Math.random() * 9) + 2;
    const dividend = divisor * quotient;
    const missingDividend = Math.random() > 0.5;

    if (missingDividend) {
      answer = `${dividend}`;
      questionText = getQText(
        `Calculate mentally:\n\n[?] ÷ ${divisor} = ${quotient}\n\nWhat is the missing number?`,
        `Calculate mentally: [?] ÷ ${divisor} = ${quotient}. What is the missing number?`
      );
      hint = `To find the starting number (dividend), multiply the quotient and the divisor. What is ${quotient} x ${divisor}?`;
      solutionSteps = [
        `Using mental calculation:`,
        `To undo the division, we multiply.`,
        `[?] = ${quotient} x ${divisor}`,
        `[?] = ${dividend}`
      ];
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${dividend}", "${Math.max(1, dividend - divisor)}", "${dividend + divisor}", "${quotient}"
        2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
      `;
    } else {
      answer = `${divisor}`;
      questionText = getQText(
        `Calculate mentally:\n\n${dividend} ÷ [?] = ${quotient}\n\nWhat is the missing number?`,
        `Calculate mentally: ${dividend} ÷ [?] = ${quotient}. What is the missing number?`
      );
      hint = `Think of the division fact: ${dividend} divided by what number gives ${quotient}?`;
      solutionSteps = [
        `Using mental calculation:`,
        `Think: ${dividend} ÷ [?] = ${quotient}`,
        `This is the same as finding ${dividend} ÷ ${quotient}.`,
        `${dividend} ÷ ${quotient} = ${divisor}`
      ];
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${divisor}", "${Math.max(1, divisor - 1)}", "${divisor + 1}", "${quotient + 1}"
        2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
      `;
    }

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
