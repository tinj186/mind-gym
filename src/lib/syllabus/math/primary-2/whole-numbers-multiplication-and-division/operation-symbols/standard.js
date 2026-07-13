export const standardLogic = function (
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

  if (activeVariant === 'standard_symbol_from_word_problem') {
    const isMultiply = Math.random() > 0.5;
    const a = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
    const b = Math.floor(Math.random() * 5) + 2;
    const total = a * b;

    if (isMultiply) {
      askText = getQText(
        `${context.name} has ${a} bags. There are ${b} ${selectedContextItem} in each bag. ${context.name} wants to find the total number of ${selectedContextItem}. ${isMCQ ? 'Which equation is correct?' : 'Write the equation to find the total.'}`,
        isMCQ ? `${a} bags of ${b}. Total? Pick the equation.` : `There are ${a} bags. Each bag has ${b} ${selectedContextItem}. Write the equation to find the total.`
      );
      answer = `${a} x ${b} = ${total}`;
      
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${a} x ${b} = ${total}", "${total} ÷ ${a} = ${b}", "${a} + ${b} = ${a + b}", "${total} - ${b} = ${a}"
        2. Set defectMap as: { "${total} ÷ ${a} = ${b}": "CONFUSED_OPERATION", "${a} + ${b} = ${a + b}": "CONFUSED_OPERATION", "${total} - ${b} = ${a}": "CONFUSED_OPERATION" }
        3. Solution should explain that 'bags of' means grouping, which requires multiplication.
      `;
    } else {
      askText = getQText(
        `${context.name} has ${total} ${selectedContextItem}. ${context.name} puts them equally into ${a} bags. ${isMCQ ? 'Which equation shows how to find the number of ' + selectedContextItem + ' in each bag?' : 'Write the equation to find the number of ' + selectedContextItem + ' in each bag.'}`,
        isMCQ ? `${total} items shared into ${a} bags. Pick the equation.` : `${total} items shared into ${a} bags. Write the equation to find the number in each bag.`
      );
      answer = `${total} ÷ ${a} = ${b}`;
      
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${total} ÷ ${a} = ${b}", "${a} x ${b} = ${total}", "${total} + ${a} = ${total + a}", "${total} - ${a} = ${total - a}"
        2. Set defectMap as: { "${a} x ${b} = ${total}": "CONFUSED_OPERATION", "${total} + ${a} = ${total + a}": "CONFUSED_OPERATION", "${total} - ${a} = ${total - a}": "CONFUSED_OPERATION" }
        3. Solution should explain that 'puts them equally' means sharing, which requires division.
      `;
    }

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Do we need to multiply or divide?", "expectedAnswer": "${isMultiply ? 'multiply' : 'divide'}" },\n      { "label": "Write the correct equation", "expectedAnswer": "${answer}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'standard_balance_missing_symbol') {
    const leftIsMultiply = Math.random() > 0.5;
    let isMultiply = Math.random() > 0.5; // Right side operation
    
    // To keep it strictly within P2 bounds (max multiplier/quotient = 10),
    // we pick a valid target first. For multiplication to be interesting (not x1),
    // we pick from numbers with P2 factors.
    const validTargets = [4, 6, 8, 9, 10];
    const target = validTargets[Math.floor(Math.random() * validTargets.length)];
    
    const getFactors = (t) => {
      if (t === 4) return [2, 2];
      if (t === 6) return Math.random() > 0.5 ? [2, 3] : [3, 2];
      if (t === 8) return Math.random() > 0.5 ? [2, 4] : [4, 2];
      if (t === 9) return [3, 3];
      if (t === 10) return Math.random() > 0.5 ? [2, 5] : [5, 2];
      return [t, 1];
    };

    let leftPart1, leftPart2, leftOp;
    if (leftIsMultiply) {
      const factors = getFactors(target);
      leftPart1 = factors[0];
      leftPart2 = factors[1];
      leftOp = 'x';
    } else {
      leftPart2 = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
      leftPart1 = target * leftPart2;
      leftOp = '÷';
    }

    const generateRightSide = (useMultiply) => {
      let r1, r2;
      if (useMultiply) {
        const factors = getFactors(target);
        r1 = factors[0];
        r2 = factors[1];
      } else {
        r2 = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
        r1 = target * r2;
      }
      return { r1, r2, ans: useMultiply ? 'x' : '÷' };
    };

    let rightSide = generateRightSide(isMultiply);
    
    // Prevent exactly identical equations on both sides
    while (rightSide.r1 === leftPart1 && rightSide.r2 === leftPart2 && rightSide.ans === leftOp) {
      // If it's a perfect square (e.g. 4=2x2 or 9=3x3) and both sides are multiplication,
      // it's impossible to find a different multiplication factor pair. Force division.
      if (rightSide.ans === 'x' && leftOp === 'x' && leftPart1 === leftPart2) {
        isMultiply = false;
      }
      rightSide = generateRightSide(isMultiply);
    }
    
    const rightPart1 = rightSide.r1;
    const rightPart2 = rightSide.r2;
    answer = rightSide.ans;

    askText = `Find the missing symbol to make the equation true: ${leftPart1} ${leftOp} ${leftPart2} = ${rightPart1} [?] ${rightPart2}`;

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "What is the value of ${leftPart1} ${leftOp} ${leftPart2}?", "expectedAnswer": "${target}" },\n      { "label": "What symbol makes ${rightPart1} and ${rightPart2} equal ${target}?", "expectedAnswer": "${answer}" }\n    ]\n  }`;
    }

    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "x", "÷", "+", "-"
      2. Set defectMap for the incorrect symbols to "CONFUSED_OPERATION".
      3. Solution should evaluate the left side first, then test symbols on the right side to balance it.
    `;
  }
  else if (activeVariant === 'standard_equals_meaning') {
    const isTrue = Math.random() > 0.5;
    const isMultiply = Math.random() > 0.5;
    const a = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
    const b = Math.floor(Math.random() * 5) + 2;
    
    let leftStr, rightStr, correctValue;
    
    if (isMultiply) {
      correctValue = a * b;
      leftStr = `${a} x ${b}`;
    } else {
      correctValue = b;
      leftStr = `${a * b} ÷ ${a}`;
    }

    if (isTrue) {
      rightStr = `${correctValue}`;
      answer = "True";
    } else {
      rightStr = `${correctValue + (Math.random() > 0.5 ? 1 : -1)}`;
      answer = "False";
    }

    askText = `Is this equation true or false?\n${leftStr} = ${rightStr}`;

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "What is the value of ${leftStr}?", "expectedAnswer": "${correctValue}" },\n      { "label": "Therefore, is the equation True or False?", "expectedAnswer": "${answer}" }\n    ]\n  }`;
    }

    customConstraints = `
      1. Provide exactly these 2 options in MCQ: "True", "False"
      2. Set defectMap for the incorrect option to "CONCEPTUAL_ERROR".
      3. Solution should explicitly evaluate the expression and compare it to the number on the right side of the '=' sign.
    `;
  }

  const aiPrompt = `
    You are an expert Math curriculum designer for Primary 2 students.
    Generate a ${type} question based on this variant: ${activeVariant}.

    Question parameters:
    - askText: ${askText}
    - answer: ${answer}

    ${customConstraints}

    ${getFormatInstructions(visualEngineStr, inputRequirementStr)}
  `;

  return { aiPrompt };
};
