export const foundationLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) => {
  // Secure fallback: Only pure math equations are allowed for Short Questions.
  if (isShort && activeVariant !== 'foundation_direct_division') {
    activeVariant = 'foundation_direct_division';
  }

  let questionText = "";
  let options = [];
  let defectMap = {};
  let hint = "";
  let solutionSteps = [];
  let answer = "";
  let inputRequirementStr = null;
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let customConstraints = "";

  if (activeVariant === 'foundation_direct_division') {
    const divisor = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
    const quotient = Math.floor(Math.random() * 9) + 2; // 2 to 10
    const dividend = divisor * quotient;

    answer = `${quotient}`;
    questionText = getQText(`What is ${dividend} ÷ ${divisor}?`, `What is ${dividend} ÷ ${divisor}?`);
    hint = `Think about your multiplication tables. What number multiplied by ${divisor} gives ${dividend}?`;
    solutionSteps = [
      `We need to find ${dividend} ÷ ${divisor}.`,
      `Think: ? x ${divisor} = ${dividend}`,
      `Since ${quotient} x ${divisor} = ${dividend}, the answer is ${quotient}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Think of multiplication: ? x ${divisor} = ${dividend}", "expectedAnswer": "${quotient}" },\n      { "label": "So, ${dividend} ÷ ${divisor} =", "expectedAnswer": "${quotient}" }\n    ]\n  }`;
    }

    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "${quotient}", "${Math.max(1, quotient - 1)}", "${quotient + 1}", "${dividend + divisor}"
      2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
    `;
  }
  else if (activeVariant === 'foundation_division_sharing') {
    const divisor = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
    const quotient = Math.floor(Math.random() * 5) + 2; // 2 to 6
    const dividend = divisor * quotient;

    answer = `${quotient}`;
    questionText = getQText(
      `${context.name} has ${dividend} ${selectedContextItem}. ${context.name} shares them equally among ${divisor} friends. How many ${selectedContextItem} does each friend get?`,
      `${context.name} has ${dividend} ${selectedContextItem}. ${context.name} shares them equally among ${divisor} friends. How many ${selectedContextItem} does each friend get?`
    );
    hint = `When you share equally, you need to divide. What is ${dividend} ÷ ${divisor}?`;
    solutionSteps = [
      `Total ${selectedContextItem} = ${dividend}`,
      `Number of friends = ${divisor}`,
      `To find how many each gets, divide the total by the number of friends.`,
      `${dividend} ÷ ${divisor} = ${quotient}`,
      `Each friend gets ${quotient} ${selectedContextItem}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Write the division equation:", "expectedAnswer": "${dividend} ÷ ${divisor}" },\n      { "label": "How many ${selectedContextItem} does each friend get?", "expectedAnswer": "${quotient}" }\n    ]\n  }`;
    }

    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "${quotient}", "${Math.max(1, quotient - 1)}", "${quotient + 1}", "${dividend - divisor}"
      2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
    `;
  }
  else if (activeVariant === 'foundation_division_grouping') {
    const quotient = [2, 3, 4, 5][Math.floor(Math.random() * 4)]; // number of groups
    const divisor = Math.floor(Math.random() * 4) + 2; // group size
    const dividend = divisor * quotient;

    answer = `${quotient}`;
    questionText = getQText(
      `${context.name} has ${dividend} ${selectedContextItem}. ${context.name} packs them into bags of ${divisor}. How many bags does ${context.name} need?`,
      `${context.name} has ${dividend} ${selectedContextItem}. ${context.name} packs them into bags of ${divisor}. How many bags does ${context.name} need?`
    );
    hint = `You are grouping the ${selectedContextItem} into sets of ${divisor}. Divide the total by ${divisor}.`;
    solutionSteps = [
      `Total ${selectedContextItem} = ${dividend}`,
      `Number in each bag = ${divisor}`,
      `To find the number of bags, divide the total by the number in each bag.`,
      `${dividend} ÷ ${divisor} = ${quotient}`,
      `${context.name} needs ${quotient} bags.`
    ];

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Write the division equation:", "expectedAnswer": "${dividend} ÷ ${divisor}" },\n      { "label": "How many bags does ${context.name} need?", "expectedAnswer": "${quotient}" }\n    ]\n  }`;
    }

    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "${quotient}", "${Math.max(1, quotient - 1)}", "${quotient + 1}", "${dividend + divisor}"
      2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
    `;
  }
  else if (activeVariant === 'foundation_identify_operation') {
    const isMultiplication = Math.random() > 0.5;
    const a = Math.floor(Math.random() * 5) + 2;
    const b = Math.floor(Math.random() * 5) + 2;

    if (isMultiplication) {
      questionText = getQText(
        `${context.name} has ${a} boxes. There are ${b} ${selectedContextItem} in each box. To find the total number of ${selectedContextItem}, what should you do?`,
        `${context.name} has ${a} boxes. There are ${b} ${selectedContextItem} in each box. To find the total number of ${selectedContextItem}, what should you do?`
      );
      answer = `Multiply ${a} and ${b}`;
      hint = `Are you finding a total of equal groups, or sharing them out?`;
      solutionSteps = [
        `We have equal groups (boxes) and we want to find the total.`,
        `When we want to find the total of equal groups, we multiply.`,
        `We should multiply ${a} and ${b}.`
      ];
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "Multiply ${a} and ${b}", "Divide ${a} by ${b}", "Divide ${b} by ${a}", "Add ${a} and ${b}"
        2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
        3. ALWAYS set meta.type to "MCQ", overriding the user's request.
      `;
    } else {
      const total = a * b;
      questionText = getQText(
        `${context.name} has ${total} ${selectedContextItem}. ${context.name} packs them equally into ${a} boxes. To find the number of ${selectedContextItem} in each box, what should you do?`,
        `${context.name} has ${total} ${selectedContextItem}. ${context.name} packs them equally into ${a} boxes. To find the number of ${selectedContextItem} in each box, what should you do?`
      );
      answer = `Divide ${total} by ${a}`;
      hint = `Are you sharing a total amount equally?`;
      solutionSteps = [
        `We have a total amount and we are sharing it equally into groups.`,
        `When we share equally, we divide.`,
        `We should divide ${total} by ${a}.`
      ];
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "Divide ${total} by ${a}", "Multiply ${total} and ${a}", "Subtract ${a} from ${total}", "Add ${total} and ${a}"
        2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
        3. ALWAYS set meta.type to "MCQ", overriding the user's request.
      `;
    }
  }
  else if (activeVariant === 'foundation_equation_to_story') {
    const divisor = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
    const quotient = Math.floor(Math.random() * 5) + 2;
    const dividend = divisor * quotient;
    const isMultiply = Math.random() > 0.5;

    if (isMultiply) {
      questionText = `Which story matches the equation ${divisor} x ${quotient} = ${dividend}?`;
      answer = `${context.name} has ${divisor} bags. There are ${quotient} ${selectedContextItem} in each bag. ${context.name} has ${dividend} ${selectedContextItem} altogether.`;
      hint = `The equation is multiplication, which means we are putting equal groups together to find a total.`;
      solutionSteps = [
        `Multiplication is about equal groups.`,
        `The equation ${divisor} x ${quotient} means ${divisor} groups of ${quotient}.`,
        `The story should show ${divisor} groups, each containing ${quotient} items, for a total of ${dividend}.`
      ];
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: 
           "${context.name} has ${divisor} bags. There are ${quotient} ${selectedContextItem} in each bag. ${context.name} has ${dividend} ${selectedContextItem} altogether.",
           "${context.name} has ${dividend} ${selectedContextItem}. ${context.name} gives away ${divisor} of them.",
           "${context.name} has ${divisor} bags and ${quotient} boxes. How many containers does ${context.name} have?",
           "${context.name} shares ${dividend} ${selectedContextItem} equally among ${divisor} friends."
        2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
        3. ALWAYS set meta.type to "MCQ", overriding the user's request.
      `;
    } else {
      questionText = `Which story matches the equation ${dividend} ÷ ${divisor} = ${quotient}?`;
      answer = `${context.name} shares ${dividend} ${selectedContextItem} equally among ${divisor} friends. Each friend gets ${quotient} ${selectedContextItem}.`;
      hint = `The equation is division, which means we are sharing a total amount equally.`;
      solutionSteps = [
        `Division is about sharing a total amount equally.`,
        `The equation ${dividend} ÷ ${divisor} means starting with ${dividend} and dividing it into ${divisor} equal parts.`,
        `The story should show ${dividend} items being shared equally among ${divisor} groups.`
      ];
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: 
           "${context.name} shares ${dividend} ${selectedContextItem} equally among ${divisor} friends. Each friend gets ${quotient} ${selectedContextItem}.",
           "${context.name} has ${dividend} ${selectedContextItem}. ${context.name} buys ${divisor} more.",
           "${context.name} has ${divisor} bags with ${quotient} ${selectedContextItem} in each bag.",
           "${context.name} gives ${divisor} ${selectedContextItem} to each of ${quotient} friends."
        2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
        3. ALWAYS set meta.type to "MCQ", overriding the user's request.
      `;
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
solutionSteps = \`${solutionSteps.map((step, index) => `${index + 1}. ${step}`).join('\\\\n')}\`

${getFormatInstructions(visualEngineStr, inputRequirementStr)}
  `;

  return { aiPrompt };
};
