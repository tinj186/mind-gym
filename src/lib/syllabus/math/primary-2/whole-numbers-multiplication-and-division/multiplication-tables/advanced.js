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

  if (activeVariant === 'advanced_2_step_word_problem') {
    const table = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
    const groups = Math.floor(Math.random() * 5) + 3; // 3 to 7
    const product = table * groups;
    
    const isAdding = Math.random() > 0.5;
    let extra = Math.floor(Math.random() * 20) + 5;
    
    // Prevent negative numbers for subtraction in P2
    if (!isAdding && extra >= product) {
      extra = Math.floor(Math.random() * (product - 1)) + 1;
    }
    
    const finalTotal = isAdding ? product + extra : product - extra;

    answer = String(finalTotal);
    
    if (isAdding) {
      askText = getQText(
        `${context.name} has ${groups} boxes of ${selectedContextItem}. There are ${table} ${selectedContextItem} in each box. Then, a friend gives ${context.name} ${extra} more ${selectedContextItem}. How many ${selectedContextItem} does ${context.name} have altogether?`,
        `${groups} boxes of ${table}. Got ${extra} more. Total?`
      );
      if (isStructure) {
        inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "How many ${selectedContextItem} are in the boxes?", "expectedAnswer": "${product}" },\n      { "label": "How many ${selectedContextItem} does ${context.name} have altogether?", "expectedAnswer": "${finalTotal}" }\n    ]\n  }`;
      }
    } else {
      askText = getQText(
        `${context.name} has ${groups} boxes of ${selectedContextItem}. There are ${table} ${selectedContextItem} in each box. ${context.name} gives away ${extra} ${selectedContextItem}. How many ${selectedContextItem} does ${context.name} have left?`,
        `${groups} boxes of ${table}. Gave away ${extra}. Left?`
      );
      if (isStructure) {
        inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "How many ${selectedContextItem} are in the boxes?", "expectedAnswer": "${product}" },\n      { "label": "How many ${selectedContextItem} does ${context.name} have left?", "expectedAnswer": "${finalTotal}" }\n    ]\n  }`;
      }
    }
  }
  else if (activeVariant === 'advanced_comparing_products') {
    const table1 = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
    const multiplier1 = Math.floor(Math.random() * 6) + 4; // 4 to 9
    const prod1 = table1 * multiplier1;

    let table2, multiplier2, prod2;
    do {
      table2 = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
      multiplier2 = Math.floor(Math.random() * 6) + 4;
      prod2 = table2 * multiplier2;
    } while (prod1 === prod2);

    const askLarger = Math.random() > 0.5;
    const targetProd = askLarger ? Math.max(prod1, prod2) : Math.min(prod1, prod2);
    
    answer = String(targetProd);
    const comparison = askLarger ? "larger" : "smaller";
    askText = `Which is ${comparison}: ${table1} x ${multiplier1} or ${table2} x ${multiplier2}? Give the value of the ${comparison} product.`;

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "What is ${table1} x ${multiplier1}?", "expectedAnswer": "${prod1}" },\n      { "label": "What is ${table2} x ${multiplier2}?", "expectedAnswer": "${prod2}" },\n      { "label": "What is the value of the ${comparison} product?", "expectedAnswer": "${targetProd}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'advanced_distributive') {
    const table = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
    const multiplier = Math.floor(Math.random() * 4) + 6; // 6 to 9
    const part1 = Math.floor(Math.random() * (multiplier - 2)) + 1; // 1 to multiplier-1
    const part2 = multiplier - part1;

    const totalProd = multiplier * table;
    const part1Prod = part1 * table;
    const remainingProd = totalProd - part1Prod;

    answer = String(part2);
    askText = `Fill in the missing number: ${multiplier} groups of ${table} = ${part1} groups of ${table} and ? groups of ${table}`;

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "What is the total value of the left side (${multiplier} groups of ${table})?", "expectedAnswer": "${totalProd}" },\n      { "label": "What is the value of the ${part1} groups we already have?", "expectedAnswer": "${part1Prod}" },\n      { "label": "How much more value is needed to reach ${totalProd}?", "expectedAnswer": "${remainingProd}" },\n      { "label": "How many groups of ${table} make ${remainingProd}?", "expectedAnswer": "${part2}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'advanced_balance_equations') {
    // Generate valid balanced multiplication: A x B = C x D
    // Valid sets for P2: e.g. 2x10 = 4x5, 2x6 = 3x4, 5x6 = 3x10
    const validPairs = [
      {a: 2, b: 10, c: 4, d: 5},
      {a: 2, b: 6, c: 3, d: 4},
      {a: 5, b: 6, c: 3, d: 10},
      {a: 4, b: 10, c: 5, d: 8},
      {a: 2, b: 8, c: 4, d: 4}
    ];
    const pair = validPairs[Math.floor(Math.random() * validPairs.length)];
    
    const isLeftMissing = Math.random() > 0.5;
    const missingValue = isLeftMissing ? pair.b : pair.d;
    
    if (isLeftMissing) {
      askText = `Find the missing number: ${pair.a} x ? = ${pair.c} x ${pair.d}`;
    } else {
      askText = `Find the missing number: ${pair.a} x ${pair.b} = ${pair.c} x ?`;
    }

    answer = String(missingValue);

    if (isStructure) {
      const knownProd = pair.a * pair.b;
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "What is the product on the complete side of the equation?", "expectedAnswer": "${knownProd}" },\n      { "label": "What is the missing number to make both sides equal?", "expectedAnswer": "${missingValue}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'advanced_word_problem_difference') {
    const table = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
    const groups1 = Math.floor(Math.random() * 5) + 5; // 5 to 9
    const groups2 = Math.floor(Math.random() * 3) + 1; // 1 to 3
    
    const total1 = table * groups1;
    const total2 = table * groups2;
    const difference = total1 - total2;

    answer = String(difference);
    askText = getQText(
      `Ahmad has ${groups1} packets of cards. Raju has ${groups2} packets of cards. Each packet contains ${table} cards. How many more cards does Ahmad have than Raju?`,
      `Ahmad has ${groups1} packets, Raju has ${groups2} packets. Each has ${table} cards. Difference in cards?`
    );

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "How many cards does Ahmad have?", "expectedAnswer": "${total1}" },\n      { "label": "How many cards does Raju have?", "expectedAnswer": "${total2}" },\n      { "label": "How many more cards does Ahmad have?", "expectedAnswer": "${difference}" }\n    ]\n  }`;
    }
  }

  let aiPrompt = `You are an expert Primary 2 math generator.
Generate a question for the subtopic: Multiplication Tables (2-5, 10).
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
- The question stem must clearly ask "${askText}".
- The finalAnswer must be EXACTLY: "${answer}".
- If MCQ, provide 4 options including the correct answer and 3 reasonable distractors. Ensure the correct option matches "${answer}".
- The solution steps MUST explicitly mirror the logical steps provided in the MULTI_STEP_INPUT (if applicable).
${customConstraints}

${getFormatInstructions(visualEngineStr, inputRequirementStr)}`;

  return {
    aiPrompt: aiPrompt,
    metadata: {
      difficulty: 'advanced',
      steps: isStructure ? 2 : 1,
      maxNumber: 100,
      logicDescription: "2-step word problems, distributive property, balancing equations, and comparing products."
    }
  };
};
