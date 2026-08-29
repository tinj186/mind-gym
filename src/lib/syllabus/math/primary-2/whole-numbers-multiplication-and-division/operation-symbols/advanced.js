export const advancedLogic = function (
  activeVariant,
  difficulty,
  type,
  isMCQ,
  isShort,
  isStructure,
  zodType,
  zodDiff,
  levelName,
  topic,
  getFormatInstructions,
  context,
  selectedContextItem,
  getQText
) {
  let askText = '';
  let answer = '';
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let customConstraints = "";

  if (activeVariant === 'advanced_two_missing_symbols') {
    const a = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
    const b = Math.floor(Math.random() * 5) + 2;
    const prod = a * b;
    const c = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
    const finalVal = prod / c; // We need this to be an integer.
    
    // Let's ensure it's a clean integer for P2.
    // So we pick a, c first. Then make sure b is a multiple of c if a isn't, etc.
    // Easier: Pick `finalVal` and `c`, so `prod` = `finalVal` * `c`. Then find `a` and `b`.
    
    let fVal, divisor, product, factor1, factor2;
    do {
      fVal = Math.floor(Math.random() * 5) + 2;
      divisor = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
      product = fVal * divisor;
      factor1 = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
      factor2 = product / factor1;
    } while (product % factor1 !== 0 || factor2 > 10 || factor2 < 2);

    answer = "x, ÷";
    askText = `Fill in the missing symbols in order to make the equation true: ${factor1} [?] ${factor2} [?] ${divisor} = ${fVal}`;

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "What symbol goes in the first box to get ${product}?", "expectedAnswer": "x" },\n      { "label": "What is ${factor1} x ${factor2}?", "expectedAnswer": "${product}" },\n      { "label": "What symbol goes in the second box so that ${product} [?] ${divisor} = ${fVal}?", "expectedAnswer": "÷" }\n    ]\n  }`;
    }

    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "x, ÷", "÷, x", "+, -", "-, +"
      2. Set defectMap for incorrect options to "CONFUSED_OPERATION".
      3. Solution should evaluate left-to-right.
    `;
  }
  else if (activeVariant === 'advanced_symbol_inequality') {
    const isMultiply = Math.random() > 0.5; // This determines the CORRECT answer

    let leftVal, rightA, rightB, rightAnsSymbol, ineqSymbol;
    let a, b;
    
    // We need to find a combination where only ONE symbol makes the inequality true.
    // Since rightA * rightB is always > rightA / rightB:
    // If the answer is 'x', we use '<' and need: rightA / rightB <= leftVal < rightA * rightB
    // If the answer is '÷', we use '>' and need: rightA / rightB < leftVal <= rightA * rightB
    
    let validFound = false;
    while (!validFound) {
      // 1. Generate right side
      if (isMultiply) {
        do {
          rightA = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
          rightB = Math.floor(Math.random() * 5) + 2;
        } while (rightA % rightB !== 0);
        rightAnsSymbol = "x";
      } else {
        rightB = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
        const tempAnsVal = Math.floor(Math.random() * 5) + 2;
        rightA = tempAnsVal * rightB;
        rightAnsSymbol = "÷";
      }

      // 2. Generate left side (a * b)
      a = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
      b = Math.floor(Math.random() * 5) + 2;
      leftVal = a * b;

      // 3. Test all 4 symbols to ensure exactly one is correct
      const testSymbols = [
        { sym: 'x', val: rightA * rightB },
        { sym: '÷', val: rightA / rightB },
        { sym: '+', val: rightA + rightB },
        { sym: '-', val: rightA - rightB }
      ];

      if (isMultiply) {
        // For 'x', we use '<'. We want leftVal < value to be true ONLY for 'x'.
        let onlyXWorks = true;
        for (const t of testSymbols) {
          if (t.sym === 'x') {
            if (!(leftVal < t.val)) onlyXWorks = false;
          } else {
            if (leftVal < t.val) onlyXWorks = false;
          }
        }
        if (onlyXWorks) {
          ineqSymbol = "is smaller than";
          validFound = true;
        }
      } else {
        // For '÷', we use '>'. We want leftVal > value to be true ONLY for '÷'.
        let onlyDivWorks = true;
        for (const t of testSymbols) {
          if (t.sym === '÷') {
            if (!(leftVal > t.val)) onlyDivWorks = false;
          } else {
            if (leftVal > t.val) onlyDivWorks = false;
          }
        }
        if (onlyDivWorks) {
          ineqSymbol = "is greater than";
          validFound = true;
        }
      }
    }

    answer = rightAnsSymbol;
    askText = `Which symbol makes this true? ${a} x ${b} ${ineqSymbol} ${rightA} [?] ${rightB}`;

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "What is ${a} x ${b}?", "expectedAnswer": "${leftVal}" },\n      { "label": "If we use 'x', what is ${rightA} x ${rightB}?", "expectedAnswer": "${rightA * rightB}" },\n      { "label": "If we use '÷', what is ${rightA} ÷ ${rightB}?", "expectedAnswer": "${rightA / rightB}" },\n      { "label": "Which symbol makes ${leftVal} ${ineqSymbol} the right side?", "expectedAnswer": "${answer}" }\n    ]\n  }`;
    }

    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "x", "÷", "+", "-"
      2. Set defectMap for incorrect options to "CONFUSED_OPERATION".
      3. Solution should evaluate the left side, then test both 'x' and '÷' on the right side to see which one satisfies the inequality.
    `;
  }
  else if (activeVariant === 'advanced_inverse_operations') {
    const isMultiplyToDivide = Math.random() > 0.5;
    const a = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
    const b = Math.floor(Math.random() * 5) + 2;
    const total = a * b;

    if (isMultiplyToDivide) {
      // Give them a multiplication equation, ask for the related division
      askText = getQText(
        `If we know that ${a} x ${b} = ${total}, which equation shows how to find the number of groups if there are ${total} items shared into groups of ${b}?`,
        `${a} x ${b} = ${total}. What is the division equation for sharing ${total} by ${b}?`
      );
      answer = `${total} ÷ ${b} = ${a}`;
      
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${total} ÷ ${b} = ${a}", "${total} x ${b} = ${a}", "${total} - ${b} = ${a}", "${total} ÷ ${a} = ${b}"
        2. Set defectMap as: { "${total} x ${b} = ${a}": "CONFUSED_OPERATION", "${total} - ${b} = ${a}": "CONFUSED_OPERATION", "${total} ÷ ${a} = ${b}": "CARELESS_CALCULATION" }
      `;
      if (isStructure) {
        inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Does sharing into groups use multiplication or division?", "expectedAnswer": "division" },\n      { "label": "Write the division equation", "expectedAnswer": "${answer}" }\n    ]\n  }`;
      }
    } else {
      // Give them a division equation, ask for the related multiplication
      askText = getQText(
        `If we know that ${total} ÷ ${a} = ${b}, which equation shows how to find the total number of items if there are ${a} groups of ${b}?`,
        `${total} ÷ ${a} = ${b}. What is the multiplication equation for ${a} groups of ${b}?`
      );
      answer = `${a} x ${b} = ${total}`;
      
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${a} x ${b} = ${total}", "${total} x ${b} = ${a}", "${a} + ${b} = ${total}", "${total} ÷ ${b} = ${a}"
        2. Set defectMap as: { "${total} x ${b} = ${a}": "CONCEPTUAL_ERROR", "${a} + ${b} = ${total}": "CONFUSED_OPERATION", "${total} ÷ ${b} = ${a}": "CARELESS_CALCULATION" }
      `;
      if (isStructure) {
        inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Does finding the total of equal groups use multiplication or division?", "expectedAnswer": "multiplication" },\n      { "label": "Write the multiplication equation", "expectedAnswer": "${answer}" }\n    ]\n  }`;
      }
    }
  }

  const aiPrompt = `
    You are an expert Math curriculum designer for Primary 2 students.
    Generate a ${type} question based on this variant: ${activeVariant}.

    Question parameters:
    - askText: ${askText}
    - answer: ${answer}

    ${customConstraints}

    CRITICAL INSTRUCTION: For 'questionText', you MUST use the exact string provided in 'askText'. DO NOT paraphrase or shorten it.
    CRITICAL INSTRUCTION: For 'finalAnswer', you MUST use the exact string provided in 'answer'.

    ${getFormatInstructions(visualEngineStr, inputRequirementStr)}
  `;

  return { aiPrompt };
};
