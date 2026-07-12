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

  if (activeVariant === 'advanced_missing_addend_mentally') {
    const num1 = Math.floor(Math.random() * 500) + 100;
    const isHundreds = Math.random() < 0.33;
    const isTens = !isHundreds && Math.random() < 0.5;
    let answerNum = 0;
    if (isHundreds) {
      answerNum = (Math.floor(Math.random() * 3) + 1) * 100; // 100 to 300
    } else if (isTens) {
      answerNum = (Math.floor(Math.random() * 9) + 1) * 10; // 10 to 90
    } else {
      answerNum = Math.floor(Math.random() * 9) + 1; // 1 to 9
    }
    const sum = num1 + answerNum;

    answer = String(answerNum);
    askText = `Mentally find the missing number: ${num1} + ? = ${sum}`;
    
    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Mentally rearrange the equation to subtraction: ${sum} - ${num1} = ?", "expectedAnswer": "${answerNum}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'advanced_missing_subtrahend_mentally') {
    const num1 = Math.floor(Math.random() * 500) + 400;
    const isHundreds = Math.random() < 0.33;
    const isTens = !isHundreds && Math.random() < 0.5;
    let answerNum = 0;
    if (isHundreds) {
      answerNum = (Math.floor(Math.random() * 3) + 1) * 100; // 100 to 300
    } else if (isTens) {
      answerNum = (Math.floor(Math.random() * 9) + 1) * 10; // 10 to 90
    } else {
      answerNum = Math.floor(Math.random() * 9) + 1; // 1 to 9
    }
    const diff = num1 - answerNum;

    answer = String(answerNum);
    askText = `Mentally find the missing number: ${num1} - ? = ${diff}`;
    
    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Mentally rearrange the equation to subtraction: ${num1} - ${diff} = ?", "expectedAnswer": "${answerNum}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'advanced_sub_compensation') {
    const num1 = Math.floor(Math.random() * 800) + 200;
    const is98 = Math.random() > 0.5;
    const num2 = is98 ? 98 : 99;
    const diff = num1 - num2;

    answer = String(diff);
    askText = `Mentally calculate: ${num1} - ${num2}`;

    if (isStructure) {
      const comp = is98 ? 2 : 1;
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Mentally subtract 100 first: ${num1} - 100", "expectedAnswer": "${num1 - 100}" },\n      { "label": "Then add ${comp} back to find the final total", "expectedAnswer": "${diff}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'advanced_add_two_multiples') {
    const num1 = Math.floor(Math.random() * 700) + 100;
    const mult1 = (Math.floor(Math.random() * 4) + 1) * 10;
    const mult2 = (Math.floor(Math.random() * 4) + 1) * 10;
    const sum = num1 + mult1 + mult2;

    answer = String(sum);
    askText = `Mentally calculate: ${num1} + ${mult1} + ${mult2}`;

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Mentally add the two tens first: ${mult1} + ${mult2}", "expectedAnswer": "${mult1 + mult2}" },\n      { "label": "Then add the total to ${num1}", "expectedAnswer": "${sum}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'advanced_sub_two_multiples') {
    const num1 = Math.floor(Math.random() * 700) + 200;
    const mult1 = (Math.floor(Math.random() * 4) + 1) * 10;
    const mult2 = (Math.floor(Math.random() * 4) + 1) * 10;
    const diff = num1 - mult1 - mult2;

    answer = String(diff);
    askText = `Mentally calculate: ${num1} - ${mult1} - ${mult2}`;

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Mentally combine the two tens being subtracted: ${mult1} + ${mult2}", "expectedAnswer": "${mult1 + mult2}" },\n      { "label": "Then subtract the total from ${num1}", "expectedAnswer": "${diff}" }\n    ]\n  }`;
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
      difficulty: 'advanced',
      steps: isStructure ? 2 : 1,
      maxNumber: 1000,
      logicDescription: "Multi-step mental math or missing addends/subtrahends."
    }
  };
};
