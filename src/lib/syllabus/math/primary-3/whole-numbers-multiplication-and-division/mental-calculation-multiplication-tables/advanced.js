export const advancedLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) => {
  let questionText = "";
  let options = [];
  let defectMap = {};
  let hint = "";
  let solutionSteps = [];
  let answer = "";
  let inputRequirementStr = null;
  let visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: { hideVisual: true } });
  let customConstraints = "";

  if (activeVariant === 'advanced_mental_balance_equations') {
    // a * b = c * d
    const pairs = [
      {a: 6, b: 6, c: 4, d: 9, prod: 36},
      {a: 6, b: 8, c: 4, d: 12, prod: 48},
      {a: 8, b: 9, c: 6, d: 12, prod: 72},
      {a: 9, b: 4, c: 6, d: 6, prod: 36},
      {a: 6, b: 12, c: 8, d: 9, prod: 72}
    ];
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    const missingVar = ["a", "b", "c", "d"][Math.floor(Math.random() * 4)];
    
    let leftSide = "";
    let rightSide = "";
    let missingValue = 0;

    if (missingVar === "a") {
      missingValue = pair.a; leftSide = `[?] x ${pair.b}`; rightSide = `${pair.c} x ${pair.d}`;
    } else if (missingVar === "b") {
      missingValue = pair.b; leftSide = `${pair.a} x [?]`; rightSide = `${pair.c} x ${pair.d}`;
    } else if (missingVar === "c") {
      missingValue = pair.c; leftSide = `${pair.a} x ${pair.b}`; rightSide = `[?] x ${pair.d}`;
    } else {
      missingValue = pair.d; leftSide = `${pair.a} x ${pair.b}`; rightSide = `${pair.c} x [?]`;
    }

    answer = `${missingValue}`;
    
    questionText = getQText(
      `Calculate mentally and balance the equation:\n\n${leftSide} = ${rightSide}\n\nWhat is the missing number?`,
      `Calculate mentally: ${leftSide} = ${rightSide}. What is the missing number?`
    );
    hint = `First, find the total value of the complete side of the equation. Both sides must have the same total.`;
    solutionSteps = [
      `Using mental calculation:`,
      `First, work out the complete side:`,
      `${missingVar === "a" || missingVar === "b" ? `${pair.c} x ${pair.d}` : `${pair.a} x ${pair.b}`} = ${pair.prod}`,
      `Both sides must be equal to ${pair.prod}.`,
      `Think: what number multiplies to give ${pair.prod}?`,
      `The missing number is ${missingValue}.`
    ];
    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "${missingValue}", "${Math.max(1, missingValue - 1)}", "${missingValue + 1}", "${missingValue + 2}"
      2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
    `;

    if (isStructure) {
      inputRequirementStr = JSON.stringify({ inputType: "STANDARD_TEXT" });
    }
  }
  else if (activeVariant === 'advanced_mental_doubling_halving') {
    const isDoubling = Math.random() > 0.5;
    
    if (isDoubling) {
      const baseA = [3, 4][Math.floor(Math.random() * 2)];
      const baseB = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
      const baseProd = baseA * baseB;
      const doubleA = baseA * 2;
      const finalProd = doubleA * baseB;

      answer = `${finalProd}`;
      questionText = getQText(
        `Use mental calculation to solve this:\n\nIf ${baseA} x ${baseB} = ${baseProd}, then what is ${doubleA} x ${baseB}?`,
        `Mental calculation: If ${baseA} x ${baseB} = ${baseProd}, what is ${doubleA} x ${baseB}?`
      );
      hint = `Look at the numbers. ${doubleA} is double of ${baseA}. So the answer must be double of ${baseProd}.`;
      solutionSteps = [
        `Using mental calculation:`,
        `Notice that ${doubleA} is double of ${baseA}.`,
        `Since the number of groups is doubled, the total is also doubled.`,
        `${baseProd} + ${baseProd} = ${finalProd} (or ${baseProd} x 2 = ${finalProd})`,
        `${doubleA} x ${baseB} = ${finalProd}`
      ];
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${finalProd}", "${baseProd + baseB}", "${finalProd - baseB}", "${baseProd + doubleA}"
        2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
      `;
    } else {
      // Halving
      const doubleA = [6, 8][Math.floor(Math.random() * 2)];
      const baseB = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
      const doubleProd = doubleA * baseB;
      const baseA = doubleA / 2;
      const finalProd = baseA * baseB;

      answer = `${finalProd}`;
      questionText = getQText(
        `Use mental calculation to solve this:\n\nIf ${doubleA} x ${baseB} = ${doubleProd}, then what is ${baseA} x ${baseB}?`,
        `Mental calculation: If ${doubleA} x ${baseB} = ${doubleProd}, what is ${baseA} x ${baseB}?`
      );
      hint = `Look at the numbers. ${baseA} is half of ${doubleA}. So the answer must be half of ${doubleProd}.`;
      solutionSteps = [
        `Using mental calculation:`,
        `Notice that ${baseA} is half of ${doubleA}.`,
        `Since the number of groups is halved, the total is also halved.`,
        `Half of ${doubleProd} is ${finalProd}.`,
        `${baseA} x ${baseB} = ${finalProd}`
      ];
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${finalProd}", "${doubleProd - baseB}", "${finalProd + baseB}", "${doubleProd / 2 + baseB}"
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
