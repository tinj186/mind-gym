export const standardLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) => {
  let questionText = "";
  let hint = "";
  let solutionSteps = [];
  let answer = "";
  let inputRequirementStr = null;
  let visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: { hideVisual: true } });
  let customConstraints = "";

  if (activeVariant === 'standard_mental_splitting_addition') {
    const a = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const ones = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const b = 10 + ones; // 12 to 19
    const total = a * b;
    answer = `${total}`;
    
    questionText = getQText(
      `Calculate mentally:\n${a} x ${b} = ?\n(Note: ${b} has been split for easier calculation)`,
      `Calculate mentally (${b} has been split for easier calculation): ${a} x ${b} = ?`
    );
    hint = `Split ${b} into 10 and ${ones}. Multiply each part by ${a} and add the results.`;
    solutionSteps = [
      `Using the distributive property:`,
      `${a} x ${b} = (${a} x 10) + (${a} x ${ones})`,
      `${a * 10} + ${a * ones} = ${total}`
    ];
    
    if (isMCQ) {
      customConstraints = `
      1. Provide exactly these 4 options in MCQ: "${a * 10} + ${a * ones}", "${a * 10} + ${b}", "${a} + ${a * 10}", "${total + a}"
      2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
      `;
      answer = `${a * 10} + ${a * ones}`;
    } else {
      customConstraints = `
      1. Provide exactly these 4 options in MCQ: "${total}", "${total + a}", "${total - a}", "${a * 10 + ones}"
      2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
      `;
    }
    
    visualEngineStr = JSON.stringify({
      componentToRender: "NUMBER_BOND",
      componentData: {
        whole: String(b),
        parts: ["10", String(ones)]
      }
    });
  }
  else if (activeVariant === 'standard_mental_compensation') {
    const a = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const bBase = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const b = (bBase * 10) - 1; // 19, 29, 39...
    const total = a * b;
    answer = `${total}`;
    
    questionText = getQText(
      `Calculate mentally:\n${a} x ${b} = ?\n(Hint: think of ${b} as ${b + 1} - 1 for easier calculation)`,
      `Calculate mentally (Hint: think of ${b} as ${b + 1} - 1 for easier calculation): ${a} x ${b} = ?`
    );
    hint = `Think of ${b} as ${b + 1} - 1. Multiply ${a} by ${b + 1}, then subtract ${a}.`;
    solutionSteps = [
      `Using compensation:`,
      `${a} x ${b} = (${a} x ${b + 1}) - ${a}`,
      `${a * (b + 1)} - ${a} = ${total}`
    ];
    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "${total}", "${a * (b + 1)}", "${total - a}", "${total + a}"
      2. Set defectMap for incorrect options to "CARELESS_CALCULATION".
    `;
  }
  else if (activeVariant === 'standard_splitting_for_division') {
    const divisor = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const onesQuotient = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const onesDividend = divisor * onesQuotient;
    const tensDividend = divisor * 10;
    const dividend = tensDividend + onesDividend;
    const quotient = 10 + onesQuotient;
    answer = `${quotient}`;
    
    questionText = getQText(
      `Calculate mentally:\n${dividend} ÷ ${divisor} = ?\n(Note: ${dividend} has been split for easier calculation)`,
      `Calculate mentally (${dividend} has been split for easier calculation): ${dividend} ÷ ${divisor} = ?`
    );
    hint = `Split ${dividend} into numbers that are easy to divide by ${divisor}, like ${tensDividend} and ${onesDividend}.`;
    solutionSteps = [
      `Using mental splitting:`,
      `${dividend} ÷ ${divisor} = (${tensDividend} ÷ ${divisor}) + (${onesDividend} ÷ ${divisor})`,
      `10 + ${onesQuotient} = ${quotient}`
    ];
    
    if (isMCQ) {
      customConstraints = `
      1. Provide exactly these 4 options in MCQ: "10 + ${onesQuotient}", "${tensDividend} + ${onesDividend}", "${quotient * 10} + ${onesQuotient}", "10 + ${divisor}"
      2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
      `;
      answer = `10 + ${onesQuotient}`;
    } else {
      customConstraints = `
      1. Provide exactly these 4 options in MCQ: "${quotient}", "${quotient - 1}", "${quotient + 1}", "${10 * onesQuotient}"
      2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
      `;
    }
    
    visualEngineStr = JSON.stringify({
      componentToRender: "NUMBER_BOND",
      componentData: {
        whole: String(dividend),
        parts: [String(tensDividend), String(onesDividend)]
      }
    });
  }
  else if (activeVariant === 'standard_halving_and_doubling') {
    const isMultiply = Math.random() > 0.5;
    const a = Math.floor(Math.random() * 12) + 12; // 12 to 23
    
    if (isMultiply) {
      const total = a * 4;
      answer = `${total}`;
      
      questionText = getQText(
        `Calculate mentally:\n${a} x 4 = ?\n(Hint: double the number twice)`,
        `Calculate mentally (Hint: double the number twice): ${a} x 4 = ?`
      );
      hint = `To multiply by 4 mentally, you can double the number twice.`;
      solutionSteps = [
        `Double ${a} is ${a * 2}.`,
        `Double ${a * 2} is ${total}.`,
        `${a} x 4 = ${total}`
      ];
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${total}", "${a * 2}", "${total + 4}", "${total - 4}"
        2. Set defectMap for incorrect options to "CARELESS_CALCULATION".
      `;
    } else {
      // Must be divisible by 4
      const quotient = Math.floor(Math.random() * 12) + 12;
      const dividend = quotient * 4;
      answer = `${quotient}`;
      
      questionText = getQText(
        `Calculate mentally:\n${dividend} ÷ 4 = ?\n(Hint: halve the number twice)`,
        `Calculate mentally (Hint: halve the number twice): ${dividend} ÷ 4 = ?`
      );
      hint = `To divide by 4 mentally, you can halve the number twice.`;
      solutionSteps = [
        `Halve ${dividend} is ${dividend / 2}.`,
        `Halve ${dividend / 2} is ${quotient}.`,
        `${dividend} ÷ 4 = ${quotient}`
      ];
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${quotient}", "${dividend / 2}", "${quotient + 2}", "${quotient - 2}"
        2. Set defectMap for incorrect options to "CARELESS_CALCULATION".
      `;
    }
  }
  else if (activeVariant === 'standard_extrapolating_hundreds') {
    const divisor = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const quotientBase = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const quotient = quotientBase * 10;
    const dividend = divisor * quotient;
    answer = `${dividend}`;
    
    questionText = getQText(
      `Calculate mentally:\n[?] ÷ ${divisor} = ${quotient}\n(Hint: use multiplication to find the missing number)`,
      `Calculate mentally (Hint: use multiplication to find the missing number): [ ] ÷ ${divisor} = ${quotient}`
    );
    hint = `Think of the inverse operation. Multiply ${quotient} by ${divisor}.`;
    solutionSteps = [
      `Using multiplication to find the dividend:`,
      `${divisor} x ${quotientBase} = ${divisor * quotientBase}`,
      `So, ${divisor} x ${quotientBase} tens = ${dividend}`
    ];
    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "${dividend}", "${divisor * quotientBase}", "${dividend * 10}", "${dividend + 10}"
      2. Set defectMap for incorrect options to "CARELESS_CALCULATION".
    `;
  }
  else {
    throw new Error("Variant logic not implemented for standard: " + activeVariant);
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
