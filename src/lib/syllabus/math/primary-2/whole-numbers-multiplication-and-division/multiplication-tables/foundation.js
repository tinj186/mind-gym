export const foundationLogic = function (
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

  if (activeVariant === 'foundation_groups_of') {
    const groups = Math.floor(Math.random() * 9) + 2; // 2 to 10
    const itemsPerGroup = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
    const total = groups * itemsPerGroup;

    answer = String(total);
    askText = getQText(
      `What is ${groups} groups of ${itemsPerGroup}?`, 
      `What is ${groups} groups of ${itemsPerGroup}?`
    );
    
    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Write this as a multiplication equation (e.g., A x B)", "expectedAnswer": "${groups} x ${itemsPerGroup}" },\n      { "label": "What is the total?", "expectedAnswer": "${total}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'foundation_repeated_addition') {
    const num = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
    const count = Math.floor(Math.random() * 5) + 3; // 3 to 7 times
    const total = num * count;
    
    const addArr = Array(count).fill(num);
    const addString = addArr.join(' + ');

    answer = `${count} x ${num}`;
    askText = getQText(
      `Write the addition equation as a multiplication equation: ${addString}`,
      `Rewrite as multiplication: ${addString}`
    );
    
    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "How many groups of ${num} are there?", "expectedAnswer": "${count}" },\n      { "label": "Write the multiplication equation (Groups x Items)", "expectedAnswer": "${answer}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'foundation_arrays') {
    const rows = Math.floor(Math.random() * 9) + 2; // 2 to 10
    const cols = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
    const total = rows * cols;

    answer = String(total);
    askText = getQText(
      `An array has ${rows} rows and ${cols} columns of items. How many items are there in total?`,
      `How many items are in a ${rows} by ${cols} array?`
    );
    visualEngineStr = `{\n    "componentToRender": "ICON_GRID",\n    "componentData": { "totalItems": ${total}, "cols": ${cols}, "icon": "⭐" }\n  }`;

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Write the multiplication equation (Rows x Columns)", "expectedAnswer": "${rows} x ${cols}" },\n      { "label": "What is the total?", "expectedAnswer": "${total}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'foundation_direct_multiply_2_5_10') {
    const num = [2, 5, 10][Math.floor(Math.random() * 3)];
    const multiplier = Math.floor(Math.random() * 10) + 1; // 1 to 10
    const total = num * multiplier;

    const isFlipped = Math.random() > 0.5;
    const equation = isFlipped ? `${num} x ${multiplier}` : `${multiplier} x ${num}`;
    const groups = isFlipped ? num : multiplier;
    const items = isFlipped ? multiplier : num;

    answer = String(total);
    askText = getQText(`What is ${equation}?`, `${equation} = ?`);

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Based on ${equation}, how many groups are there?", "expectedAnswer": "${groups}" },\n      { "label": "How many items are in each group?", "expectedAnswer": "${items}" },\n      { "label": "What is the total product?", "expectedAnswer": "${total}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'foundation_direct_multiply_3_4') {
    const num = [3, 4][Math.floor(Math.random() * 2)];
    const multiplier = Math.floor(Math.random() * 10) + 1; // 1 to 10
    const total = num * multiplier;

    const isFlipped = Math.random() > 0.5;
    const equation = isFlipped ? `${num} x ${multiplier}` : `${multiplier} x ${num}`;
    const groups = isFlipped ? num : multiplier;
    const items = isFlipped ? multiplier : num;

    answer = String(total);
    askText = getQText(`What is ${equation}?`, `${equation} = ?`);

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Based on ${equation}, how many groups are there?", "expectedAnswer": "${groups}" },\n      { "label": "How many items are in each group?", "expectedAnswer": "${items}" },\n      { "label": "What is the total product?", "expectedAnswer": "${total}" }\n    ]\n  }`;
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
      difficulty: 'foundation',
      steps: isStructure ? 2 : 1,
      maxNumber: 100,
      logicDescription: "Basic concepts of multiplication: groups of, repeated addition, arrays, and direct facts."
    }
  };
};
