export const advancedLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) => {
  let questionText = "";
  let options = [];
  let defectMap = {};
  let hint = "";
  let solutionSteps = [];
  let answer = "";
  let inputRequirementStr = null;
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let customConstraints = "";

  if (activeVariant === 'advanced_unitary_method') {
    const unitPrice = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
    const qty1 = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
    const cost1 = unitPrice * qty1;
    let qty2 = Math.floor(Math.random() * 5) + 2;
    while (qty2 === qty1) {
      qty2 = Math.floor(Math.random() * 5) + 2;
    }
    const cost2 = unitPrice * qty2;

    answer = `${cost2}`;
    questionText = getQText(
      `${qty1} ${selectedContextItem} cost $${cost1} in total. How much do ${qty2} ${selectedContextItem} cost?`,
      `${qty1} ${selectedContextItem} cost $${cost1} in total. How much do ${qty2} ${selectedContextItem} cost?`
    );
    hint = `First, find the cost of 1 ${selectedContextItem} by dividing. Then multiply to find the cost of ${qty2}.`;
    solutionSteps = [
      `Cost of ${qty1} ${selectedContextItem} = $${cost1}`,
      `Cost of 1 ${selectedContextItem} = $${cost1} ÷ ${qty1} = $${unitPrice}`,
      `Cost of ${qty2} ${selectedContextItem} = $${unitPrice} x ${qty2} = $${cost2}`
    ];
    
    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Cost of 1 ${selectedContextItem} ($):", "expectedAnswer": "${unitPrice}" },\n      { "label": "Cost of ${qty2} ${selectedContextItem} ($):", "expectedAnswer": "${cost2}" }\n    ]\n  }`;
    }

    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "${cost2}", "${unitPrice}", "${cost1 + qty2}", "${Math.max(1, cost2 - unitPrice)}"
      2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
    `;
  }
  else if (activeVariant === 'advanced_two_step_multiply_divide') {
    let bags = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
    let perBag = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
    
    // Prevent infinite loop when total only has one factor in the pool that equals bags (e.g. 9 and 25)
    if (bags === perBag && (bags === 3 || bags === 5)) {
      perBag = 2; // change to a different factor
    }
    
    const total = bags * perBag;
    
    let friends = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
    while (total % friends !== 0 || friends === bags) {
      friends = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
    }
    const perFriend = total / friends;

    answer = `${perFriend}`;
    questionText = getQText(
      `${context.name} has ${bags} bags of ${selectedContextItem}. There are ${perBag} ${selectedContextItem} in each bag. ${context.name} shares all the ${selectedContextItem} equally with ${friends} friends. How many ${selectedContextItem} does each friend get?`,
      `${context.name} has ${bags} bags of ${selectedContextItem}. There are ${perBag} in each bag. ${context.name} shares them equally with ${friends} friends. How many does each friend get?`
    );
    hint = `First, find the total number of ${selectedContextItem} by multiplying. Then share them equally by dividing.`;
    solutionSteps = [
      `Total number of ${selectedContextItem} = ${bags} x ${perBag} = ${total}`,
      `Number of friends = ${friends}`,
      `Number of ${selectedContextItem} each friend gets = ${total} ÷ ${friends} = ${perFriend}`
    ];
    
    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Total number of ${selectedContextItem}:", "expectedAnswer": "${total}" },\n      { "label": "Number each friend gets:", "expectedAnswer": "${perFriend}" }\n    ]\n  }`;
    }

    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "${perFriend}", "${total}", "${Math.max(1, perFriend - 1)}", "${perFriend + 1}"
      2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
    `;
  }
  else if (activeVariant === 'advanced_compare_operations') {
    const a = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
    const b = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
    const p1 = a * b;

    const div = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
    const q = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
    const p2 = div * q;
    
    let answerText = "";
    if (p1 > q) {
      answerText = `${a} x ${b}`;
    } else if (q > p1) {
      answerText = `${p2} ÷ ${div}`;
    } else {
      // If equal, force a change to make one greater
      answerText = `${a} x ${b}`;
    }

    // Recalculate just in case we forced a change
    const isLeftGreater = (a * b) > (p2 / div);

    answer = isLeftGreater ? `${a} x ${b}` : `${p2} ÷ ${div}`;
    
    questionText = getQText(
      `Which is greater?\n\n${a} x ${b}\nOR\n${p2} ÷ ${div}`,
      `Which is greater? ${a} x ${b} OR ${p2} ÷ ${div}`
    );
    hint = `Work out the value of each side first, then compare them.`;
    solutionSteps = [
      `Value of left side: ${a} x ${b} = ${a * b}`,
      `Value of right side: ${p2} ÷ ${div} = ${p2 / div}`,
      `Since ${a * b} ${isLeftGreater ? '>' : '<'} ${p2 / div}, the greater expression is ${answer}.`
    ];
    
    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Value of ${a} x ${b}:", "expectedAnswer": "${a * b}" },\n      { "label": "Value of ${p2} ÷ ${div}:", "expectedAnswer": "${p2 / div}" },\n      { "label": "Which is greater? (Type the expression):", "expectedAnswer": "${answer}" }\n    ]\n  }`;
    }

    customConstraints = `
      1. Provide exactly these 2 options in MCQ: "${a} x ${b}", "${p2} ÷ ${div}"
      2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
      3. ALWAYS set meta.type to "MCQ", overriding the user's request.
    `;
  }
  else if (activeVariant === 'advanced_consecutive_multi_step') {
    // A has N. B has 2 times A. C has half of B.
    const aVal = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
    const bMult = [2, 3, 4][Math.floor(Math.random() * 3)];
    const bVal = aVal * bMult;
    
    const cDiv = [2, 3, 4][Math.floor(Math.random() * 3)];
    // Ensure B is divisible by C
    const adjustedBMult = bMult * cDiv; 
    const finalBVal = aVal * adjustedBMult;
    const cVal = finalBVal / cDiv;

    answer = `${cVal}`;
    questionText = getQText(
      `Person A has ${aVal} ${selectedContextItem}. Person B has ${adjustedBMult} times as many ${selectedContextItem} as Person A. Person C has some ${selectedContextItem}, and when Person B's amount is divided by ${cDiv}, it equals Person C's amount. How many ${selectedContextItem} does Person C have?`,
      `A has ${aVal} items. B has ${adjustedBMult} times as many as A. C's amount is B's amount divided by ${cDiv}. How many does C have?`
    );
    hint = `First find B's amount by multiplying. Then find C's amount by dividing.`;
    solutionSteps = [
      `Person A's amount = ${aVal}`,
      `Person B's amount = ${aVal} x ${adjustedBMult} = ${finalBVal}`,
      `Person C's amount = Person B's amount ÷ ${cDiv}`,
      `Person C's amount = ${finalBVal} ÷ ${cDiv} = ${cVal}`
    ];
    
    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Amount Person B has:", "expectedAnswer": "${finalBVal}" },\n      { "label": "Amount Person C has:", "expectedAnswer": "${cVal}" }\n    ]\n  }`;
    }

    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "${cVal}", "${finalBVal}", "${aVal + adjustedBMult}", "${Math.max(1, cVal - 1)}"
      2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
    `;
  }
  else if (activeVariant === 'advanced_part_whole_multi_step') {
    const total = [20, 30, 40, 50][Math.floor(Math.random() * 4)];
    const boyA = Math.floor(Math.random() * 10) + 5; // 5 to 14
    const remainder = total - boyA;
    
    // We want the remainder to be divisible by 2 or 3 or 4 or 5
    let friends = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
    let adjustedBoyA = boyA;
    while ((total - adjustedBoyA) % friends !== 0) {
      adjustedBoyA++;
    }
    const finalRemainder = total - adjustedBoyA;
    const eachGets = finalRemainder / friends;

    answer = `${eachGets}`;
    questionText = getQText(
      `There are ${total} ${selectedContextItem} in a basket. ${context.name} takes ${adjustedBoyA} ${selectedContextItem}. The rest of the ${selectedContextItem} are shared equally among ${friends} children. How many ${selectedContextItem} does each child get?`,
      `Total items = ${total}. Someone takes ${adjustedBoyA}. The rest are shared equally among ${friends} children. How many does each get?`
    );
    hint = `First, subtract to find the remaining items. Then, divide to share them equally.`;
    solutionSteps = [
      `Total ${selectedContextItem} = ${total}`,
      `${selectedContextItem} remaining after ${context.name} takes some = ${total} - ${adjustedBoyA} = ${finalRemainder}`,
      `Number of children sharing the rest = ${friends}`,
      `Number of ${selectedContextItem} each child gets = ${finalRemainder} ÷ ${friends} = ${eachGets}`
    ];
    
    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Number of ${selectedContextItem} remaining:", "expectedAnswer": "${finalRemainder}" },\n      { "label": "Number each child gets:", "expectedAnswer": "${eachGets}" }\n    ]\n  }`;
    }

    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "${eachGets}", "${finalRemainder}", "${Math.max(1, eachGets - 1)}", "${Math.floor(total / friends)}"
      2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
    `;
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
solutionSteps = \`${solutionSteps.map((step, index) => `${index + 1}. ${step}`).join('\\\\n')}\`

${getFormatInstructions(visualEngineStr, inputRequirementStr)}
  `;

  return { aiPrompt };
};
