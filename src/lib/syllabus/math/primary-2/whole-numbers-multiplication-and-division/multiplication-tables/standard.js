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

  if (activeVariant === 'standard_missing_factor_2_5_10') {
    const table = [2, 5, 10][Math.floor(Math.random() * 3)];
    const missing = Math.floor(Math.random() * 10) + 1; // 1 to 10
    const total = table * missing;
    
    const isFirstMissing = Math.random() > 0.5;
    
    answer = String(missing);

    if (isFirstMissing) {
      askText = getQText(
        `${context.name} has some boxes. There are ${table} ${selectedContextItem} in each box. ${context.name} has ${total} ${selectedContextItem} altogether. How many boxes does ${context.name} have?`,
        `? boxes of ${table}. Total is ${total}. How many boxes?`
      );
      if (isStructure) {
        inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Write the multiplication equation with a question mark (e.g., ? x B = C)", "expectedAnswer": "? x ${table} = ${total}" },\n      { "label": "What is the missing number of boxes?", "expectedAnswer": "${missing}" }\n    ]\n  }`;
      }
    } else {
      askText = getQText(
        `${context.name} has ${table} boxes. There are an equal number of ${selectedContextItem} in each box. ${context.name} has ${total} ${selectedContextItem} altogether. How many ${selectedContextItem} are in each box?`,
        `${table} boxes with equal amount. Total is ${total}. How many per box?`
      );
      if (isStructure) {
        inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Write the multiplication equation with a question mark (e.g., A x ? = C)", "expectedAnswer": "${table} x ? = ${total}" },\n      { "label": "What is the missing number of items per box?", "expectedAnswer": "${missing}" }\n    ]\n  }`;
      }
    }
  }
  else if (activeVariant === 'standard_missing_factor_3_4') {
    const table = [3, 4][Math.floor(Math.random() * 2)];
    const missing = Math.floor(Math.random() * 10) + 1; // 1 to 10
    const total = table * missing;
    
    const isFirstMissing = Math.random() > 0.5;
    
    answer = String(missing);

    if (isFirstMissing) {
      askText = getQText(
        `${context.name} has some boxes. There are ${table} ${selectedContextItem} in each box. ${context.name} has ${total} ${selectedContextItem} altogether. How many boxes does ${context.name} have?`,
        `? boxes of ${table}. Total is ${total}. How many boxes?`
      );
      if (isStructure) {
        inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Write the multiplication equation with a question mark (e.g., ? x B = C)", "expectedAnswer": "? x ${table} = ${total}" },\n      { "label": "What is the missing number of boxes?", "expectedAnswer": "${missing}" }\n    ]\n  }`;
      }
    } else {
      askText = getQText(
        `${context.name} has ${table} boxes. There are an equal number of ${selectedContextItem} in each box. ${context.name} has ${total} ${selectedContextItem} altogether. How many ${selectedContextItem} are in each box?`,
        `${table} boxes with equal amount. Total is ${total}. How many per box?`
      );
      if (isStructure) {
        inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Write the multiplication equation with a question mark (e.g., A x ? = C)", "expectedAnswer": "${table} x ? = ${total}" },\n      { "label": "What is the missing number of items per box?", "expectedAnswer": "${missing}" }\n    ]\n  }`;
      }
    }
  }
  else if (activeVariant === 'standard_word_problem_grouping') {
    const groups = Math.floor(Math.random() * 9) + 2; // 2 to 10
    const itemsPerGroup = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
    const total = groups * itemsPerGroup;

    answer = String(total);
    askText = getQText(
      `${context.name} has ${groups} bags. There are ${itemsPerGroup} ${selectedContextItem} in each bag. How many ${selectedContextItem} does ${context.name} have altogether?`,
      `${groups} bags of ${itemsPerGroup}. How many in total?`
    );

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Write the multiplication equation to find the total", "expectedAnswer": "${groups} x ${itemsPerGroup} = ${total}" },\n      { "label": "What is the total number of ${selectedContextItem}?", "expectedAnswer": "${total}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'standard_word_problem_rate') {
    const rate = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
    const quantity = Math.floor(Math.random() * 9) + 2; // 2 to 10
    const total = rate * quantity;

    answer = "$" + total;
    askText = getQText(
      `Each sticker costs $${rate}. ${context.name} buys ${quantity} stickers. How much does ${context.name} pay altogether?`,
      `${quantity} stickers at $${rate} each. Total cost?`
    );

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Write the multiplication equation to find the total cost", "expectedAnswer": "${quantity} x ${rate} = ${total}" },\n      { "label": "What is the total cost?", "expectedAnswer": "$${total}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'standard_commutativity') {
    const num1 = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
    const num2 = Math.floor(Math.random() * 9) + 2; // 2 to 10
    const total = num1 * num2;

    answer = String(num2);
    askText = `Find the missing number: ${num1} x ${num2} = ? x ${num1}`;

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "What is the product of the complete side (${num1} x ${num2})?", "expectedAnswer": "${total}" },\n      { "label": "The other side must also equal ${total}. What number times ${num1} equals ${total}?", "expectedAnswer": "${num2}" }\n    ]\n  }`;
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
      difficulty: 'standard',
      steps: isStructure ? 2 : 1,
      maxNumber: 100,
      logicDescription: "Finding missing factors and solving 1-step word problems involving equal groups or rate."
    }
  };
};
