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
  let visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: { hideVisual: true } });
  let inputRequirementStr = null;

  const variants = [
    'standard_add_ones_renaming',
    'standard_sub_ones_renaming',
    'standard_add_2_digit_renaming',
    'standard_sub_2_digit_renaming'
  ];

  if (activeVariant === 'standard_random' || !variants.includes(activeVariant)) {
    activeVariant = variants[Math.floor(Math.random() * variants.length)];
  }

  if (activeVariant === 'standard_add_ones_renaming') {
    const t1 = Math.floor(Math.random() * 8) + 1; // 1 to 8 tens
    const o1 = Math.floor(Math.random() * 5) + 5; // 5 to 9
    const minO2 = 10 - o1;
    const o2 = Math.floor(Math.random() * (9 - minO2 + 1)) + minO2; // minO2 to 9
    
    const num1 = t1 * 10 + o1;
    const num2 = o2;
    const sum = num1 + num2;

    answer = String(sum);
    askText = `Mentally calculate: ${num1} + ${num2}`;
    
    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Mentally add the ones: ${o1} + ${num2}", "expectedAnswer": "${o1 + num2}" },\n      { "label": "Add the tens back to find the total", "expectedAnswer": "${sum}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'standard_sub_ones_renaming') {
    const t1 = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const o1 = Math.floor(Math.random() * 5); // 0 to 4
    const o2 = Math.floor(Math.random() * (9 - o1)) + o1 + 1; // o1+1 to 9
    
    const num1 = t1 * 10 + o1;
    const num2 = o2;
    const diff = num1 - num2;

    answer = String(diff);
    askText = `Mentally calculate: ${num1} - ${num2}`;
    
    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Mentally subtract from the tens: ${t1 * 10} - ${num2}", "expectedAnswer": "${t1 * 10 - num2}" },\n      { "label": "Add the remaining ones back", "expectedAnswer": "${diff}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'standard_add_2_digit_renaming') {
    const t1 = Math.floor(Math.random() * 7) + 1;
    const t2 = Math.floor(Math.random() * (8 - t1)) + 1; // ensures sum of tens < 9 so final is < 100
    const o1 = Math.floor(Math.random() * 5) + 5; // 5 to 9
    const minO2 = 10 - o1;
    const o2 = Math.floor(Math.random() * (9 - minO2 + 1)) + minO2; // minO2 to 9
    
    const num1 = t1 * 10 + o1;
    const num2 = t2 * 10 + o2;
    const sum = num1 + num2;

    answer = String(sum);
    askText = `Mentally calculate: ${num1} + ${num2}`;
    
    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Mentally add the tens: ${num1} + ${t2 * 10}", "expectedAnswer": "${num1 + t2 * 10}" },\n      { "label": "Then add the ones: ${num1 + t2 * 10} + ${o2}", "expectedAnswer": "${sum}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'standard_sub_2_digit_renaming') {
    const t1 = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const o1 = Math.floor(Math.random() * 5); // 0 to 4
    const t2 = Math.floor(Math.random() * (t1 - 1)) + 1; // 1 to t1-1
    const o2 = Math.floor(Math.random() * (9 - o1)) + o1 + 1; // o1+1 to 9
    
    const num1 = t1 * 10 + o1;
    const num2 = t2 * 10 + o2;
    const diff = num1 - num2;
    
    // Compensation strategy: round num2 up to the nearest 10
    const roundedNum2 = (t2 + 1) * 10;
    const comp = roundedNum2 - num2;

    answer = String(diff);
    askText = `Mentally calculate: ${num1} - ${num2}`;
    
    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Round ${num2} up to the closest 10 and subtract: ${num1} - ${roundedNum2}", "expectedAnswer": "${num1 - roundedNum2}" },\n      { "label": "Add back the ${comp} that you over-subtracted", "expectedAnswer": "${diff}" }\n    ]\n  }`;
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
- For the model solution, explain the mental math strategy (e.g., adding tens then ones).
- The solution steps MUST explicitly mirror the logical steps provided in the MULTI_STEP_INPUT (if applicable).
- separate steps using the exact characters \\n inside the string.
- Return ONLY valid JSON. Do not append extra closing braces.

${getFormatInstructions(visualEngineStr, inputRequirementStr)}`;

  return {
    aiPrompt: aiPrompt,
    metadata: {
      difficulty: 'standard',
      steps: isStructure ? 2 : 1,
      maxNumber: 100,
      logicDescription: "Mental calculation of 2-digit numbers with renaming or compensation."
    }
  };
};
