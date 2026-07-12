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

  if (activeVariant === 'foundation_add_hundreds_mentally') {
    const num1 = Math.floor(Math.random() * 800) + 100; // 100 to 899
    // Max multiple of 100 we can add without exceeding 999
    const maxAdd = Math.floor((999 - num1) / 100);
    const num2 = maxAdd > 0 ? (Math.floor(Math.random() * maxAdd) + 1) * 100 : 100;
    
    // Safety check
    const finalNum1 = num1 + num2 > 999 ? 999 - num2 : num1;
    const sum = finalNum1 + num2;

    answer = String(sum);
    askText = `Mentally calculate: ${finalNum1} + ${num2}`;
    
    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Mentally add the hundreds: ${Math.floor(finalNum1/100)*100} + ${num2}", "expectedAnswer": "${Math.floor(finalNum1/100)*100 + num2}" },\n      { "label": "Add the tens and ones back to find the total", "expectedAnswer": "${sum}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'foundation_sub_hundreds_mentally') {
    const num1 = Math.floor(Math.random() * 800) + 200; // 200 to 999
    const maxSub = Math.floor(num1 / 100);
    const num2 = maxSub > 1 ? (Math.floor(Math.random() * (maxSub - 1)) + 1) * 100 : 100;
    const diff = num1 - num2;

    answer = String(diff);
    askText = `Mentally calculate: ${num1} - ${num2}`;
    
    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Mentally subtract the hundreds: ${Math.floor(num1/100)*100} - ${num2}", "expectedAnswer": "${Math.floor(num1/100)*100 - num2}" },\n      { "label": "Add the tens and ones back to find the total", "expectedAnswer": "${diff}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'foundation_add_tens_mentally') {
    // No renaming in tens or ones
    const h1 = Math.floor(Math.random() * 9) + 1;
    const t1 = Math.floor(Math.random() * 8); // 0 to 7
    const o1 = Math.floor(Math.random() * 10);
    const maxTens = 9 - t1;
    const t2 = Math.floor(Math.random() * (maxTens - 1)) + 1; // 1 to maxTens
    
    const num1 = h1 * 100 + t1 * 10 + o1;
    const num2 = t2 * 10;
    const sum = num1 + num2;

    answer = String(sum);
    askText = `Mentally calculate: ${num1} + ${num2}`;

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Mentally add the tens: ${t1 * 10} + ${num2}", "expectedAnswer": "${t1 * 10 + num2}" },\n      { "label": "What is the final total?", "expectedAnswer": "${sum}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'foundation_sub_tens_mentally') {
    // No renaming
    const h1 = Math.floor(Math.random() * 9) + 1;
    const t1 = Math.floor(Math.random() * 9) + 1; // 1 to 9
    const o1 = Math.floor(Math.random() * 10);
    const t2 = Math.floor(Math.random() * t1) + 1; // 1 to t1
    
    const num1 = h1 * 100 + t1 * 10 + o1;
    const num2 = t2 * 10;
    const diff = num1 - num2;

    answer = String(diff);
    askText = `Mentally calculate: ${num1} - ${num2}`;

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Mentally subtract the tens: ${t1 * 10} - ${num2}", "expectedAnswer": "${t1 * 10 - num2}" },\n      { "label": "What is the final total?", "expectedAnswer": "${diff}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'foundation_add_ones_mentally') {
    // No renaming
    const h1 = Math.floor(Math.random() * 9) + 1;
    const t1 = Math.floor(Math.random() * 10);
    const o1 = Math.floor(Math.random() * 8); // 0 to 7
    const maxOnes = 9 - o1;
    const o2 = Math.floor(Math.random() * maxOnes) + 1; // 1 to maxOnes
    
    const num1 = h1 * 100 + t1 * 10 + o1;
    const num2 = o2;
    const sum = num1 + num2;

    answer = String(sum);
    askText = `Mentally calculate: ${num1} + ${num2}`;

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Mentally add the ones: ${o1} + ${o2}", "expectedAnswer": "${o1 + o2}" },\n      { "label": "What is the final total?", "expectedAnswer": "${sum}" }\n    ]\n  }`;
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
      difficulty: 'foundation',
      steps: isStructure ? 2 : 1,
      maxNumber: 1000,
      logicDescription: "Add or subtract without renaming."
    }
  };
};
