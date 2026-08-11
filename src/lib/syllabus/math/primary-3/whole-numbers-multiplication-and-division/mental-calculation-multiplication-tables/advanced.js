export const advancedLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) => {
  let questionText = "";
  let hint = "";
  let solutionSteps = [];
  let answer = "";
  let inputRequirementStr = null;
  let visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: { hideVisual: true } });
  let customConstraints = "";

  if (activeVariant === 'advanced_chained_ops_multiply_add') {
    const a = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const b = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const c = Math.floor(Math.random() * 30) + 11; // 11 to 40
    const prod = a * b;
    const total = prod + c;
    answer = `${total}`;
    
    questionText = getQText(
      `Write a short word problem. ${context.name} buys ${a} packs of ${selectedContextItem}. Each pack has ${b} ${selectedContextItem}. ${context.pronounCaps} also has ${c} extra ${selectedContextItem}. Ask how many ${selectedContextItem} ${context.name} has altogether.`,
      `Write a short word problem. ${context.name} has ${a} packs of ${b} ${selectedContextItem} plus ${c} extra. Ask for the total.`
    );
    hint = `First find the product of ${a} and ${b}, then add ${c} to the result.`;
    solutionSteps = [
      `${a} x ${b} = ${prod}`,
      `${prod} + ${c} = ${total}`
    ];
    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "${total}", "${prod}", "${(a + b) * c}", "${total + 10}"
      2. Set defectMap for incorrect options to "CARELESS_CALCULATION".
    `;
  }
  else if (activeVariant === 'advanced_chained_ops_divide_subtract') {
    const divisor = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const quotientBase = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const quotient = quotientBase * 10;
    const dividend = divisor * quotient;
    const sub = Math.floor(Math.random() * 10) + 5; // 5 to 14 (guaranteed < 20)
    const total = quotient - sub;
    answer = `${total}`;
    
    questionText = getQText(
      `Write a short word problem. ${context.name} has ${dividend} ${selectedContextItem} packed equally into ${divisor} boxes. ${context.pronounCaps} takes out ${sub} ${selectedContextItem} from one box. Ask how many ${selectedContextItem} are left in that box.`,
      `Write a short word problem. Divide ${dividend} ${selectedContextItem} into ${divisor} boxes, then take ${sub} out of one box. Ask how many are left in it.`
    );
    hint = `First find the quotient of ${dividend} ÷ ${divisor}, then subtract ${sub} from the result.`;
    solutionSteps = [
      `${dividend} ÷ ${divisor} = ${quotient}`,
      `${quotient} - ${sub} = ${total}`
    ];
    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "${total}", "${quotient}", "${quotient + sub}", "${total - 10}"
      2. Set defectMap for incorrect options to "CARELESS_CALCULATION".
    `;
  }
  else if (activeVariant === 'advanced_equivalent_expressions') {
    // We want a * b = c * d
    // E.g. 4 * 9 = 36 -> 6 * 6
    const pairs = [
      [[4, 9], [6, 6]],
      [[3, 8], [4, 6]],
      [[2, 9], [3, 6]],
      [[2, 6], [3, 4]],
      [[4, 8], [2, 16]], // maybe not > 10, let's stick to simple ones
      [[5, 8], [4, 10]],
      [[6, 8], [4, 12]],
      [[9, 8], [6, 12]]
    ];
    const pairSet = pairs[Math.floor(Math.random() * pairs.length)];
    const isFirstMissing = Math.random() > 0.5;
    
    let a, b, c, d;
    if (Math.random() > 0.5) {
      [a, b] = pairSet[0];
      [c, d] = pairSet[1];
    } else {
      [a, b] = pairSet[1];
      [c, d] = pairSet[0];
    }
    
    const missingFirst = Math.random() > 0.5; // missing from first expression?
    
    if (missingFirst) {
      // ? * b = c * d
      answer = `${a}`;
      questionText = getQText(
        `Write a short word problem. ${context.name} has some boxes with ${b} ${selectedContextItem} in each box. A friend has ${c} boxes with ${d} ${selectedContextItem} in each box. They both have the same total number of ${selectedContextItem}. Ask how many boxes ${context.name} has.`,
        `Write a short word problem. If an unknown number of groups of ${b} gives the same total as ${c} groups of ${d}, ask for the unknown number.`
      );
      hint = `First calculate the side with both numbers, then find what multiplies by ${b} to give that same total.`;
      solutionSteps = [
        `${c} x ${d} = ${c * d}`,
        `[?] x ${b} = ${c * d}`,
        `${c * d} ÷ ${b} = ${a}`,
        `The missing number is ${a}.`
      ];
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${a}", "${c * d}", "${b + c + d}", "${Math.max(1, a - 1)}"
        2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
      `;
    } else {
      // a * b = c * ?
      answer = `${d}`;
      questionText = getQText(
        `Write a short word problem. ${context.name} has ${a} boxes with ${b} ${selectedContextItem} in each box. A friend has ${c} boxes with some ${selectedContextItem} in each box. They both have the same total number of ${selectedContextItem}. Ask how many ${selectedContextItem} are in each of the friend's boxes.`,
        `Write a short word problem. If ${a} groups of ${b} give the same total as ${c} groups of an unknown number, ask for the unknown number.`
      );
      hint = `First calculate the side with both numbers, then find what multiplies by ${c} to give that same total.`;
      solutionSteps = [
        `${a} x ${b} = ${a * b}`,
        `${c} x [?] = ${a * b}`,
        `${a * b} ÷ ${c} = ${d}`,
        `The missing number is ${d}.`
      ];
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${d}", "${a * b}", "${a + b + c}", "${Math.max(1, d - 1)}"
        2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
      `;
    }
  }
  else if (activeVariant === 'advanced_mental_scaling') {
    const divisor = Math.floor(Math.random() * 5) + 4; // 4 to 8
    const quotientBase = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const quotient = quotientBase * 10;
    const dividend = divisor * quotient;
    const mult = Math.floor(Math.random() * 4) + 2; // 2 to 5
    const total = quotient * mult;
    answer = `${total}`;
    
    questionText = getQText(
      `Write a short word problem. A shop packs ${dividend} ${selectedContextItem} equally into ${divisor} bags. ${context.name} buys ${mult} of these bags. Ask how many ${selectedContextItem} ${context.name} buys in total.`,
      `Write a short word problem. There are ${dividend} ${selectedContextItem} distributed equally in ${divisor} bags. Ask for the total number of ${selectedContextItem} in ${mult} bags.`
    );
    hint = `First divide ${dividend} by ${divisor}, then multiply that result by ${mult}.`;
    solutionSteps = [
      `${dividend} ÷ ${divisor} = ${quotient}`,
      `${quotient} x ${mult} = ${total}`
    ];
    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "${total}", "${quotient}", "${dividend * mult}", "${total + 10}"
      2. Set defectMap for incorrect options to "CARELESS_CALCULATION".
    `;
  }
  else if (activeVariant === 'advanced_mental_reversal') {
    const divisor = Math.floor(Math.random() * 6) + 3; // 3 to 8
    const quotientBase = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const quotient = quotientBase * 10;
    const dividend = divisor * quotient;
    answer = `${dividend}`;
    
    questionText = getQText(
      `Write a short word problem. ${context.name} shares some ${selectedContextItem} equally among ${divisor} children. Each child receives ${quotient} ${selectedContextItem}. Ask how many ${selectedContextItem} ${context.name} had at first.`,
      `Write a short word problem. Share an unknown amount of ${selectedContextItem} equally among ${divisor}, so each gets ${quotient}. Ask for the original unknown amount.`
    );
    hint = `Use the inverse operation. What is ${quotient} multiplied by ${divisor}?`;
    solutionSteps = [
      `To find the mystery number, multiply the quotient by the divisor.`,
      `${quotient} x ${divisor} = ${dividend}`,
      `The mystery number is ${dividend}.`
    ];
    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "${dividend}", "${quotient / 10}", "${dividend * 10}", "${dividend + divisor}"
      2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
    `;
  }
  else {
    throw new Error("Variant logic not implemented for advanced: " + activeVariant);
  }

  const aiPrompt = `
CRITICAL INSTRUCTION: You MUST use the EXACT strings provided below for hint, finalAnswer, and solutionSteps. DO NOT rephrase them!
CRITICAL INSTRUCTION: For questionText, use the instruction provided in askText to generate a creative word problem. The generated questionText MUST start with the exact phrase "Calculate mentally: ". Do NOT output the instruction itself.
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
