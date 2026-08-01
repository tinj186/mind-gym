export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  const variants = [
    'advanced_algo_missing_digit_add',
    'advanced_algo_missing_digit_sub',
    'advanced_algo_add_three_4_digit_numbers',
    'advanced_algo_missing_two_digits_add',
    'advanced_algo_missing_two_digits_sub'
  ];

  if (activeVariant === 'advanced_random' || !variants.includes(activeVariant)) {
    activeVariant = variants[Math.floor(Math.random() * variants.length)];
  }

  let answer;
  let askText = '';
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let customConstraints = "";
  const isAdd = activeVariant.includes('_add_');

  if (activeVariant === 'advanced_algo_missing_digit_add') {
    const th1 = Math.floor(Math.random() * 5) + 1;
    const h1 = Math.floor(Math.random() * 5) + 1;
    const t1 = Math.floor(Math.random() * 8) + 1;
    const o1 = Math.floor(Math.random() * 5) + 5;
    const th2 = Math.floor(Math.random() * 3) + 1;
    const h2 = Math.floor(Math.random() * 3) + 1;
    const t2 = Math.floor(Math.random() * 4) + 1;
    const o2 = Math.floor(Math.random() * 4) + 5; 
    const num1 = th1 * 1000 + h1 * 100 + t1 * 10 + o1;
    const num2 = th2 * 1000 + h2 * 100 + t2 * 10 + o2;
    const sum = num1 + num2;
    const maskedNum1 = `${th1}${h1}?${o1}`;
    answer = String(t1);
    askText = `Find the missing digit in the addition algorithm.`;
    visualEngineStr = `{\n    "componentToRender": "VERTICAL_ALGORITHM",\n    "componentData": { "items": ["${maskedNum1}", "+", "${num2}", "${sum}"] }\n  }`;
    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Look at the ones column. Form an equation to find the total.", "expectedAnswer": "${o1} + ${o2} = ${o1 + o2}" },\n      { "label": "Look at the tens column. Form an equation to find the missing digit.", "expectedAnswer": "1 + ${answer} + ${t2} = ${t1 + t2 + 1}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'advanced_algo_missing_digit_sub') {
    const th1 = Math.floor(Math.random() * 4) + 5;
    const h1 = Math.floor(Math.random() * 4) + 5;
    const t1 = Math.floor(Math.random() * 4) + 1;
    const o1 = Math.floor(Math.random() * 4) + 1;
    const th2 = Math.floor(Math.random() * 3) + 1;
    const h2 = Math.floor(Math.random() * 3) + 1;
    const t2 = Math.floor(Math.random() * 4) + 5;
    const o2 = Math.floor(Math.random() * 4) + 5;
    const num1 = th1 * 1000 + h1 * 100 + t1 * 10 + o1;
    const num2 = th2 * 1000 + h2 * 100 + t2 * 10 + o2;
    const diff = num1 - num2;
    const maskedNum1 = `${th1}${h1}?${o1}`;
    answer = String(t1);
    askText = `Find the missing digit in the subtraction algorithm.`;
    visualEngineStr = `{\n    "componentToRender": "VERTICAL_ALGORITHM",\n    "componentData": { "items": ["${maskedNum1}", "-", "${num2}", "${diff}"] }\n  }`;
    if (isStructure) {
      const diffOnes = diff % 10;
      const diffTens = Math.floor(diff / 10) % 10;
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Look at the ones column. Form an equation to find the ones digit of the answer.", "expectedAnswer": "1${o1} - ${o2} = ${diffOnes}" },\n      { "label": "Look at the tens column. Form an equation to find the missing digit.", "expectedAnswer": "${answer} - 1 - ${t2} = ${diffTens}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'advanced_algo_add_three_4_digit_numbers') {
    const num1 = Math.floor(Math.random() * 2000) + 1000;
    const num2 = Math.floor(Math.random() * 2000) + 1000;
    const num3 = Math.floor(Math.random() * 2000) + 1000;
    const sum = num1 + num2 + num3;
    answer = String(sum);
    askText = `What is ${num1} + ${num2} + ${num3}?`;
    visualEngineStr = `{\n    "componentToRender": "VERTICAL_ALGORITHM",\n    "componentData": { "items": ["${num1}", "${num2}", "+", "${num3}"] }\n  }`;
    
    customConstraints = `- In the model solution, solve the addition COLUMN by COLUMN (ones column, then tens, then hundreds, then thousands). Do NOT say "Add the first two numbers, then add the third". Follow the vertical stack exactly.`;
    
    if (isStructure) {
      const o1 = num1 % 10;
      const t1 = Math.floor(num1 / 10) % 10;
      const h1 = Math.floor(num1 / 100) % 10;
      const th1 = Math.floor(num1 / 1000);
      const o2 = num2 % 10;
      const t2 = Math.floor(num2 / 10) % 10;
      const h2 = Math.floor(num2 / 100) % 10;
      const th2 = Math.floor(num2 / 1000);
      const o3 = num3 % 10;
      const t3 = Math.floor(num3 / 10) % 10;
      const h3 = Math.floor(num3 / 100) % 10;
      const th3 = Math.floor(num3 / 1000);
      
      const sumOnes = o1 + o2 + o3;
      const carryOnes = Math.floor(sumOnes / 10);
      const sumTens = t1 + t2 + t3 + carryOnes;
      const carryTens = Math.floor(sumTens / 10);
      const sumHundreds = h1 + h2 + h3 + carryTens;
      const carryHundreds = Math.floor(sumHundreds / 10);
      const sumThousands = th1 + th2 + th3 + carryHundreds;
      
      let stepsStr = `[\n      { "label": "Look at the ones column. Form an equation to find the total.", "expectedAnswer": "${o1} + ${o2} + ${o3} = ${sumOnes}" },\n`;
      if (carryOnes > 0) {
        stepsStr += `      { "label": "Look at the tens column. Remember the carry! Form an equation to find the total.", "expectedAnswer": "${carryOnes} + ${t1} + ${t2} + ${t3} = ${sumTens}" },\n`;
      } else {
        stepsStr += `      { "label": "Look at the tens column. Form an equation to find the total.", "expectedAnswer": "${t1} + ${t2} + ${t3} = ${sumTens}" },\n`;
      }
      if (carryTens > 0) {
        stepsStr += `      { "label": "Look at the hundreds column. Remember the carry! Form an equation to find the total.", "expectedAnswer": "${carryTens} + ${h1} + ${h2} + ${h3} = ${sumHundreds}" },\n`;
      } else {
        stepsStr += `      { "label": "Look at the hundreds column. Form an equation to find the total.", "expectedAnswer": "${h1} + ${h2} + ${h3} = ${sumHundreds}" },\n`;
      }
      if (carryHundreds > 0) {
        stepsStr += `      { "label": "Look at the thousands column. Remember the carry! Form an equation to find the total.", "expectedAnswer": "${carryHundreds} + ${th1} + ${th2} + ${th3} = ${sumThousands}" },\n`;
      } else {
        stepsStr += `      { "label": "Look at the thousands column. Form an equation to find the total.", "expectedAnswer": "${th1} + ${th2} + ${th3} = ${sumThousands}" },\n`;
      }
      stepsStr += `      { "label": "What is the final answer?", "expectedAnswer": "${sum}" }\n    ]`;
      
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": ${stepsStr}\n  }`;
    }
  }
  else if (activeVariant === 'advanced_algo_missing_two_digits_add') {
    const th1 = Math.floor(Math.random() * 5) + 1;
    const h1 = Math.floor(Math.random() * 5) + 1;
    const t1 = Math.floor(Math.random() * 8) + 1;
    const o1 = Math.floor(Math.random() * 5) + 5;
    const th2 = Math.floor(Math.random() * 3) + 1;
    const h2 = Math.floor(Math.random() * 3) + 1;
    const t2 = Math.floor(Math.random() * 4) + 1;
    const o2 = Math.floor(Math.random() * 4) + 5; 
    const num1 = th1 * 1000 + h1 * 100 + t1 * 10 + o1;
    const num2 = th2 * 1000 + h2 * 100 + t2 * 10 + o2;
    const sum = num1 + num2;
    const maskedNum1 = `${th1}${h1}?${o1}`;
    const maskedNum2 = `${th2}${h2}${t2}?`;
    answer = `${t1}, ${o2}`;
    askText = `Find the two missing digits in the addition algorithm. (Format: tens digit of first number, ones digit of second number)`;
    visualEngineStr = `{\n    "componentToRender": "VERTICAL_ALGORITHM",\n    "componentData": { "items": ["${maskedNum1}", "+", "${maskedNum2}", "${sum}"] }\n  }`;
    if (isStructure) {
      const sumOnes = (o1 + o2) % 10;
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Look at the ones column. Form an equation to find the missing digit.", "expectedAnswer": "${o1} + ${o2} = 1${sumOnes}" },\n      { "label": "Look at the tens column. Form an equation to find the missing digit.", "expectedAnswer": "1 + ${t1} + ${t2} = ${t1 + t2 + 1}" },\n      { "label": "What are the two missing digits?", "expectedAnswer": "${answer}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'advanced_algo_missing_two_digits_sub') {
    const th1 = Math.floor(Math.random() * 4) + 5;
    const h1 = Math.floor(Math.random() * 4) + 5;
    const t1 = Math.floor(Math.random() * 4) + 1;
    const o1 = Math.floor(Math.random() * 4) + 1;
    const th2 = Math.floor(Math.random() * 3) + 1;
    const h2 = Math.floor(Math.random() * 3) + 1;
    const t2 = Math.floor(Math.random() * 4) + 5;
    const o2 = Math.floor(Math.random() * 4) + 5;
    const num1 = th1 * 1000 + h1 * 100 + t1 * 10 + o1;
    const num2 = th2 * 1000 + h2 * 100 + t2 * 10 + o2;
    const diff = num1 - num2;
    const maskedNum1 = `${th1}${h1}?${o1}`;
    const maskedNum2 = `${th2}${h2}${t2}?`;
    answer = `${t1}, ${o2}`;
    askText = `Find the two missing digits in the subtraction algorithm. (Format: tens digit of first number, ones digit of second number)`;
    visualEngineStr = `{\n    "componentToRender": "VERTICAL_ALGORITHM",\n    "componentData": { "items": ["${maskedNum1}", "-", "${maskedNum2}", "${diff}"] }\n  }`;
    if (isStructure) {
      const diffTens = Math.floor(diff / 10) % 10;
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Look at the ones column. Form an equation to find the missing digit.", "expectedAnswer": "1${o1} - ${o2} = ${(10 + o1) - o2}" },\n      { "label": "Look at the tens column. Form an equation to find the missing digit.", "expectedAnswer": "${t1} - 1 - ${t2} = ${diffTens}" },\n      { "label": "What are the two missing digits?", "expectedAnswer": "${answer}" }\n    ]\n  }`;
    }
  }

  const { generateAlgorithmTables } = require('@/lib/utils/math-html-utils');
  const [step1HTML, step2HTML] = generateAlgorithmTables(num1, num2, isAdd);

  let aiPrompt = `You are an expert Primary 3 math generator.
Generate a question for the subtopic: Addition/Subtraction Algorithms (4-Digit).
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
- You MUST use the exact string "${askText}" as the \`questionText\`.
- You MUST use the exact string "${answer}" as the \`finalAnswer\`.
- You MUST explicitly generate a \`solutionSteps\` and a \`hint\`.
- For \`solutionSteps\`, provide EXACTLY TWO steps:
  1. "Setting up the vertical algorithm:" followed by this exact HTML: \n${step1HTML}
  2. "Solving with renaming/regrouping:" followed by this exact HTML: \n${step2HTML}
  CRITICAL: DO NOT modify the HTML strings. Use them EXACTLY as provided above!
  separate steps using the exact characters \\n inside the string.for line breaks inside the JSON string.
- If MCQ, provide 4 options including the correct answer and 3 reasonable distractors. Ensure the correct option matches "${answer}".
- Do NOT modify the \`visualEngine\` or \`inputRequirement\` JSON blocks provided in the template. Use them EXACTLY as shown.
- Return ONLY valid JSON. Do not append extra closing braces.
${customConstraints ? customConstraints : ""}

${getFormatInstructions(visualEngineStr, inputRequirementStr)}`;

  return {
    aiPrompt: aiPrompt,
    metadata: {
      difficulty: 'advanced',
      steps: isStructure ? 2 : 1,
      maxNumber: 10000,
      logicDescription: "Missing digits in 4-digit addition/subtraction algorithms."
    }
  };
}
