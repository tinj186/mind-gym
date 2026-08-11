export const foundationLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) => {
  let questionText = "";
  let hint = "";
  let solutionSteps = [];
  let answer = "";
  let inputRequirementStr = null;
  let visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: { hideVisual: true } });
  let customConstraints = "";

  if (activeVariant === 'foundation_direct_fact_retrieval') {
    const a = Math.floor(Math.random() * 9) + 2; // 2 to 10
    const b = Math.floor(Math.random() * 9) + 2;
    const total = a * b;
    
    const formatType = Math.floor(Math.random() * 3); // 0: a x b = ?, 1: a x ? = c, 2: ? x b = c
    
    if (formatType === 0) {
      answer = `${total}`;
      questionText = getQText(
        `Calculate mentally:\n${a} x ${b} = ?`,
        `Calculate mentally: ${a} x ${b} = ?`
      );
      hint = `Think of your multiplication tables. What is ${a} groups of ${b}?`;
      solutionSteps = [
        `Using mental calculation:`,
        `${a} x ${b} = ${total}`
      ];
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${total}", "${Math.max(1, total - a)}", "${total + a}", "${Math.max(1, total - b)}"
        2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
      `;
    } else if (formatType === 1) {
      answer = `${b}`;
      questionText = getQText(
        `Calculate mentally:\n${a} x [?] = ${total}`,
        `Calculate mentally: ${a} x [ ] = ${total}`
      );
      hint = `Think of your multiplication tables. ${a} multiplied by what gives ${total}?`;
      solutionSteps = [
        `Using mental calculation:`,
        `${total} ÷ ${a} = ${b}`
      ];
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${b}", "${Math.max(1, b - 1)}", "${b + 1}", "${total}"
        2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
      `;
    } else {
      answer = `${a}`;
      questionText = getQText(
        `Calculate mentally:\n[?] x ${b} = ${total}`,
        `Calculate mentally: [ ] x ${b} = ${total}`
      );
      hint = `Think of your multiplication tables. What multiplied by ${b} gives ${total}?`;
      solutionSteps = [
        `Using mental calculation:`,
        `${total} ÷ ${b} = ${a}`
      ];
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${a}", "${Math.max(1, a - 1)}", "${a + 1}", "${total}"
        2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
      `;
    }
  }
  else if (activeVariant === 'foundation_fact_family_link') {
    const a = Math.floor(Math.random() * 9) + 2;
    const b = Math.floor(Math.random() * 9) + 2;
    const total = a * b;
    
    const isDivFirst = Math.random() > 0.5;

    if (isDivFirst) {
      answer = `${total}`;
      questionText = getQText(
        `Calculate mentally:\nIf ${total} ÷ ${a} = ${b}, then ${a} x ${b} = ?`,
        `Calculate mentally: If ${total} ÷ ${a} = ${b}, then ${a} x ${b} = ?`
      );
      hint = `Use the related division fact from the same fact family to solve the multiplication.`;
      solutionSteps = [
        `Using fact families:`,
        `Since ${total} ÷ ${a} = ${b},`,
        `${a} x ${b} = ${total}`
      ];
      if (isMCQ) {
        customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${a} x ${b} = ${total}", "${total} ÷ ${b} = ${a}", "${total} - ${a} = ${total - a}", "${total} + ${a} = ${total + a}"
        2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
        `;
        answer = `${a} x ${b} = ${total}`;
      }
    } else {
      answer = `${b}`;
      questionText = getQText(
        `Calculate mentally:\nIf ${a} x ${b} = ${total}, then ${total} ÷ ${a} = ?`,
        `Calculate mentally: If ${a} x ${b} = ${total}, then ${total} ÷ ${a} = ?`
      );
      hint = `Use the related multiplication fact from the same fact family to solve the division.`;
      solutionSteps = [
        `Using fact families:`,
        `Since ${a} x ${b} = ${total},`,
        `${total} ÷ ${a} = ${b}`
      ];
      if (isMCQ) {
        customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${a} x ${b} = ${total}", "${total} + ${a} = ${total + a}", "${total} - ${a} = ${total - a}", "${total} ÷ ${b} = ${a}"
        2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
        `;
        answer = `${a} x ${b} = ${total}`;
      }
    }
    
    visualEngineStr = JSON.stringify({
      componentToRender: "FACT_TRIANGLE",
      componentData: {
        product: String(total),
        factors: [String(a), String(b)]
      }
    });
  }
  else if (activeVariant === 'foundation_multiplying_multiples_10') {
    const a = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const bBase = Math.floor(Math.random() * 8) + 2; // 2 to 9
    
    const isHundreds = Math.random() > 0.5;
    const multiplier = isHundreds ? 100 : 10;
    const word = isHundreds ? 'hundreds' : 'tens';
    
    const b = bBase * multiplier;
    const total = a * b;
    answer = `${total}`;
    
    questionText = getQText(
      `Calculate mentally:\n${a} x ${b} = ?`,
      `Calculate mentally: ${a} x ${b} = ?`
    );
    hint = `Think of ${b} as ${bBase} ${word}. Multiply ${a} by ${bBase}, then add ${isHundreds ? 'two zeros' : 'a zero'}.`;
    solutionSteps = [
      `Think: ${a} x ${bBase} ${word}`,
      `${a} x ${bBase} = ${a * bBase}`,
      `${a * bBase} ${word} = ${total}`
    ];
    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "${total}", "${total * 10}", "${Math.max(1, total / 10)}", "${(a * bBase) + multiplier}"
      2. Set defectMap for incorrect options to "CARELESS_CALCULATION".
    `;
  }
  else if (activeVariant === 'foundation_dividing_multiples_10') {
    const divisor = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const quotientBase = Math.floor(Math.random() * 8) + 2; // 2 to 9
    
    const isHundreds = Math.random() > 0.5;
    const multiplier = isHundreds ? 100 : 10;
    const word = isHundreds ? 'hundreds' : 'tens';
    
    const quotient = quotientBase * multiplier;
    const dividend = divisor * quotient;
    answer = `${quotient}`;
    
    questionText = getQText(
      `Calculate mentally:\n${dividend} ÷ ${divisor} = ?`,
      `Calculate mentally: ${dividend} ÷ ${divisor} = ?`
    );
    hint = `Think of ${dividend} as ${dividend / multiplier} ${word}. Divide ${dividend / multiplier} by ${divisor}, then add ${isHundreds ? 'two zeros' : 'a zero'}.`;
    solutionSteps = [
      `Think: ${dividend / multiplier} ${word} ÷ ${divisor}`,
      `${dividend / multiplier} ÷ ${divisor} = ${quotientBase}`,
      `${quotientBase} ${word} = ${quotient}`
    ];
    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "${quotient}", "${quotientBase}", "${quotient * 10}", "${Math.max(multiplier, quotient - multiplier)}"
      2. Set defectMap for incorrect options to "CARELESS_CALCULATION".
    `;
  }
  else if (activeVariant === 'foundation_direct_fact_retrieval_division') {
    const a = Math.floor(Math.random() * 9) + 2; // 2 to 10
    const b = Math.floor(Math.random() * 9) + 2;
    const total = a * b;
    
    const formatType = Math.floor(Math.random() * 3); // 0: total ÷ a = ?, 1: total ÷ ? = b, 2: ? ÷ a = b
    
    if (formatType === 0) {
      answer = `${b}`;
      questionText = getQText(
        `Calculate mentally:\n${total} ÷ ${a} = ?`,
        `Calculate mentally: ${total} ÷ ${a} = ?`
      );
      hint = `Think of your multiplication tables. What multiplied by ${a} gives ${total}?`;
      solutionSteps = [
        `Using mental calculation:`,
        `${total} ÷ ${a} = ${b}`
      ];
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${b}", "${Math.max(1, b - 1)}", "${b + 1}", "${total}"
        2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
      `;
    } else if (formatType === 1) {
      answer = `${a}`;
      questionText = getQText(
        `Calculate mentally:\n${total} ÷ [?] = ${b}`,
        `Calculate mentally: ${total} ÷ [ ] = ${b}`
      );
      hint = `Think of your multiplication tables. ${total} divided by what gives ${b}?`;
      solutionSteps = [
        `Using mental calculation:`,
        `${total} ÷ ${b} = ${a}`
      ];
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${a}", "${Math.max(1, a - 1)}", "${a + 1}", "${total}"
        2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
      `;
    } else {
      answer = `${total}`;
      questionText = getQText(
        `Calculate mentally:\n[?] ÷ ${a} = ${b}`,
        `Calculate mentally: [ ] ÷ ${a} = ${b}`
      );
      hint = `Think of your multiplication tables. What number divided by ${a} gives ${b}? Multiply ${a} by ${b}.`;
      solutionSteps = [
        `Using mental calculation:`,
        `${a} x ${b} = ${total}`
      ];
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${total}", "${Math.max(1, total - a)}", "${total + a}", "${a + b}"
        2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
      `;
    }
    
    visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: { hideVisual: true } });
  }
  else {
    throw new Error("Variant logic not implemented for foundation: " + activeVariant);
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
