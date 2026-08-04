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
  let visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: { hideVisual: true } });
  let inputRequirementStr = null;

  const variants = [
    'foundation_add_ones_mentally',
    'foundation_sub_ones_mentally',
    'foundation_add_tens_mentally',
    'foundation_sub_tens_mentally',
    'foundation_add_2_digit_no_renaming',
    'foundation_sub_2_digit_no_renaming'
  ];

  if (activeVariant === 'foundation_random' || !variants.includes(activeVariant)) {
    activeVariant = variants[Math.floor(Math.random() * variants.length)];
  }

  if (activeVariant === 'foundation_add_ones_mentally') {
    const t1 = Math.floor(Math.random() * 8) + 1; // 1 to 9 tens (10 to 90)
    const o1 = Math.floor(Math.random() * 8); // 0 to 7 ones
    const o2 = Math.floor(Math.random() * (9 - o1)) + 1; // max o1+o2 = 9
    
    const num1 = t1 * 10 + o1;
    const num2 = o2;
    const sum = num1 + num2;

    answer = String(sum);
    askText = `Mentally calculate: ${num1} + ${num2}`;
    
    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Mentally add the ones: ${o1} + ${num2}", "expectedAnswer": "${o1 + num2}" },\n      { "label": "Add the tens back to find the total", "expectedAnswer": "${sum}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'foundation_sub_ones_mentally') {
    const t1 = Math.floor(Math.random() * 8) + 1; // 1 to 9 tens (10 to 90)
    const o1 = Math.floor(Math.random() * 8) + 1; // 1 to 8 ones
    const o2 = Math.floor(Math.random() * o1) + 1; // 1 to o1
    
    const num1 = t1 * 10 + o1;
    const num2 = o2;
    const diff = num1 - num2;

    answer = String(diff);
    askText = `Mentally calculate: ${num1} - ${num2}`;
    
    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Mentally subtract the ones: ${o1} - ${num2}", "expectedAnswer": "${o1 - num2}" },\n      { "label": "Add the tens back to find the final answer", "expectedAnswer": "${diff}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'foundation_add_tens_mentally') {
    const t1 = Math.floor(Math.random() * 8) + 1; // 1 to 8
    const o1 = Math.floor(Math.random() * 9) + 1; // 1 to 9
    const maxT2 = 9 - t1;
    const t2 = Math.floor(Math.random() * maxT2) + 1;
    
    const num1 = t1 * 10 + o1;
    const num2 = t2 * 10;
    const sum = num1 + num2;

    answer = String(sum);
    askText = `Mentally calculate: ${num1} + ${num2}`;
    
    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Mentally add the tens: ${t1 * 10} + ${num2}", "expectedAnswer": "${t1 * 10 + num2}" },\n      { "label": "Add the ones back to find the total", "expectedAnswer": "${sum}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'foundation_sub_tens_mentally') {
    const t1 = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const o1 = Math.floor(Math.random() * 9) + 1;
    const t2 = Math.floor(Math.random() * (t1 - 1)) + 1; // 1 to t1-1
    
    const num1 = t1 * 10 + o1;
    const num2 = t2 * 10;
    const diff = num1 - num2;

    answer = String(diff);
    askText = `Mentally calculate: ${num1} - ${num2}`;
    
    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Mentally subtract the tens: ${t1 * 10} - ${num2}", "expectedAnswer": "${t1 * 10 - num2}" },\n      { "label": "Add the ones back to find the total", "expectedAnswer": "${diff}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'foundation_add_2_digit_no_renaming') {
    const t1 = Math.floor(Math.random() * 8) + 1;
    const t2 = Math.floor(Math.random() * (9 - t1)) + 1;
    const o1 = Math.floor(Math.random() * 8) + 1;
    const o2 = Math.floor(Math.random() * (9 - o1)) + 1;
    
    const num1 = t1 * 10 + o1;
    const num2 = t2 * 10 + o2;
    const sum = num1 + num2;

    answer = String(sum);
    askText = `Mentally calculate: ${num1} + ${num2}`;

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Mentally add the tens: ${t1 * 10} + ${t2 * 10}", "expectedAnswer": "${(t1 + t2) * 10}" },\n      { "label": "Mentally add the ones: ${o1} + ${o2}", "expectedAnswer": "${o1 + o2}" },\n      { "label": "Add them together for the total", "expectedAnswer": "${sum}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'foundation_sub_2_digit_no_renaming') {
    const t1 = Math.floor(Math.random() * 8) + 2; 
    const t2 = Math.floor(Math.random() * (t1 - 1)) + 1; 
    const o1 = Math.floor(Math.random() * 8) + 2; 
    const o2 = Math.floor(Math.random() * (o1 - 1)) + 1; 
    
    const num1 = t1 * 10 + o1;
    const num2 = t2 * 10 + o2;
    const diff = num1 - num2;

    answer = String(diff);
    askText = `Mentally calculate: ${num1} - ${num2}`;

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Mentally subtract the tens: ${t1 * 10} - ${t2 * 10}", "expectedAnswer": "${(t1 - t2) * 10}" },\n      { "label": "Mentally subtract the ones: ${o1} - ${o2}", "expectedAnswer": "${o1 - o2}" },\n      { "label": "Add the results together to find the final difference", "expectedAnswer": "${diff}" }\n    ]\n  }`;
    }
  }

  let aiPrompt = `You are an expert Primary 3 math generator.
Generate a question for the subtopic: Mental Calculation (2-Digit).
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
- The question stem must clearly ask "${askText}".
- The finalAnswer must be EXACTLY: "${answer}".
- If MCQ, provide 4 options including the correct answer and 3 reasonable distractors. Ensure the correct option matches "${answer}".
- Do not use vertical algorithms for mental calculation. Keep the equation horizontal.
- For the model solution, explain the mental math strategy (breaking numbers into tens and ones).
- The solution steps MUST explicitly mirror the logical steps provided in the MULTI_STEP_INPUT (if applicable).
- separate steps using the exact characters \\n inside the string.
- Return ONLY valid JSON. Do not append extra closing braces.

${getFormatInstructions(visualEngineStr, inputRequirementStr)}`;

  return {
    aiPrompt: aiPrompt,
    metadata: {
      difficulty: 'foundation',
      steps: isStructure ? (activeVariant.includes('tens') ? 2 : 3) : 1,
      maxNumber: 100,
      logicDescription: "Mental calculation of 2-digit numbers without renaming."
    }
  };
};
