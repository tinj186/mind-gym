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

  if (activeVariant === 'standard_add_tens_renaming') {
    const h1 = Math.floor(Math.random() * 8) + 1; // 1 to 8
    const t1 = Math.floor(Math.random() * 5) + 5; // 5 to 9
    const o1 = Math.floor(Math.random() * 10);
    const minTens = 10 - t1;
    const t2 = Math.floor(Math.random() * (9 - minTens + 1)) + minTens; // minTens to 9
    
    const num1 = h1 * 100 + t1 * 10 + o1;
    const num2 = t2 * 10;
    const sum = num1 + num2;

    answer = String(sum);
    askText = `Mentally calculate: ${num1} + ${num2}`;
    
    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Mentally add the tens: ${t1 * 10} + ${num2}", "expectedAnswer": "${t1 * 10 + num2}" },\n      { "label": "Add the hundreds and ones back to find the total", "expectedAnswer": "${sum}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'standard_sub_tens_renaming') {
    const h1 = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const t1 = Math.floor(Math.random() * 5); // 0 to 4
    const o1 = Math.floor(Math.random() * 10);
    const t2 = Math.floor(Math.random() * (9 - t1)) + t1 + 1; // t1+1 to 9
    
    const num1 = h1 * 100 + t1 * 10 + o1;
    const num2 = t2 * 10;
    const diff = num1 - num2;

    answer = String(diff);
    askText = `Mentally calculate: ${num1} - ${num2}`;
    
    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Mentally subtract the tens: ${num1 - o1} - ${num2}", "expectedAnswer": "${num1 - o1 - num2}" },\n      { "label": "Add the ones back to find the total", "expectedAnswer": "${diff}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'standard_add_ones_renaming') {
    const h1 = Math.floor(Math.random() * 9) + 1;
    const t1 = Math.floor(Math.random() * 9); // 0 to 8
    const o1 = Math.floor(Math.random() * 5) + 5; // 5 to 9
    const minOnes = 10 - o1;
    const o2 = Math.floor(Math.random() * (9 - minOnes + 1)) + minOnes; // minOnes to 9
    
    const num1 = h1 * 100 + t1 * 10 + o1;
    const num2 = o2;
    const sum = num1 + num2;

    answer = String(sum);
    askText = `Mentally calculate: ${num1} + ${num2}`;

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Mentally add the ones: ${o1} + ${o2}", "expectedAnswer": "${o1 + o2}" },\n      { "label": "Add the hundreds and tens back to find the total", "expectedAnswer": "${sum}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'standard_sub_ones_renaming') {
    const h1 = Math.floor(Math.random() * 9) + 1;
    const t1 = Math.floor(Math.random() * 9) + 1; // 1 to 9
    const o1 = Math.floor(Math.random() * 5); // 0 to 4
    const o2 = Math.floor(Math.random() * (9 - o1)) + o1 + 1; // o1+1 to 9
    
    const num1 = h1 * 100 + t1 * 10 + o1;
    const num2 = o2;
    const diff = num1 - num2;

    answer = String(diff);
    askText = `Mentally calculate: ${num1} - ${num2}`;

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Mentally subtract from the tens: ${t1 * 10 + o1} - ${num2}", "expectedAnswer": "${t1 * 10 + o1 - num2}" },\n      { "label": "What is the final total?", "expectedAnswer": "${diff}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'standard_add_compensation') {
    const num1 = Math.floor(Math.random() * 800) + 100;
    const is98 = Math.random() > 0.5;
    const num2 = is98 ? 98 : 99;
    const sum = num1 + num2;

    answer = String(sum);
    askText = `Mentally calculate: ${num1} + ${num2}`;

    if (isStructure) {
      const comp = is98 ? 2 : 1;
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Mentally add 100 first: ${num1} + 100", "expectedAnswer": "${num1 + 100}" },\n      { "label": "Then subtract ${comp} to find the final total", "expectedAnswer": "${sum}" }\n    ]\n  }`;
    }
  }

  let aiPrompt = `You are an expert Primary 2 math generator.
Generate a question for the subtopic: Mental Calculation.
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
- The question stem must clearly ask "${askText}".
- The finalAnswer must be EXACTLY: "${answer}".
- If MCQ, provide 4 options including the correct answer and 3 reasonable distractors. Ensure the correct option matches "${answer}".
- Do not use vertical algorithms for mental calculation. Keep the equation horizontal.
- For the model solution, explain the mental math strategy. DO NOT subtract/add piecewise in random chunks (e.g., do not split 80 into 5 and 75). Instead, manipulate hundreds, tens, and ones directly.
- The solution steps MUST explicitly mirror the logical steps provided in the MULTI_STEP_INPUT (if applicable).

${getFormatInstructions(visualEngineStr, inputRequirementStr)}`;

  return {
    aiPrompt: aiPrompt,
    metadata: {
      difficulty: 'standard',
      steps: isStructure ? 2 : 1,
      maxNumber: 1000,
      logicDescription: "Mental calculation with renaming or compensation."
    }
  };
};
