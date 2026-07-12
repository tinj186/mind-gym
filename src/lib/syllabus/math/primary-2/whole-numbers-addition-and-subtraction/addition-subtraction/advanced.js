export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  // ==========================================
  // ADVANCED LEVEL
  // ==========================================
  const variants = [
    'advanced_multi_step_add_sub',
    'advanced_missing_digit_add',
    'advanced_missing_digit_sub',
    'advanced_working_backwards',
    'advanced_balance_equations',
    'advanced_algo_missing_digit_add',
    'advanced_algo_missing_digit_sub',
    'advanced_algo_add_three_3_digit_numbers',
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

  // Math generation logic
  if (activeVariant === 'advanced_multi_step_add_sub') {
    // 2-step word problem: A has X, B has Y more than A. How much do they have altogether?
    const num1 = Math.floor(Math.random() * 200) + 150; // 150 to 349
    const num2 = Math.floor(Math.random() * 100) + 50;  // 50 to 149
    const bHas = num1 + num2;
    const total = num1 + bHas;
    answer = String(total);
    
    askText = `${context.name} has ${num1} ${selectedContextItem}. His friend has ${num2} more ${selectedContextItem} than him. How many ${selectedContextItem} do they have altogether?`;
    
    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Find out how many his friend has", "expectedAnswer": "${bHas}" },\n      { "label": "Calculate the total number of ${selectedContextItem}", "expectedAnswer": "${answer}" }\n    ]\n  }`;
    }
  } 
  else if (activeVariant === 'advanced_missing_digit_add') {
    // Missing digit in 3-digit addition (e.g. 34? + 125 = 472)
    const h1 = Math.floor(Math.random() * 5) + 1;
    const t1 = Math.floor(Math.random() * 8) + 1;
    const o1 = Math.floor(Math.random() * 5) + 5;
    
    const h2 = Math.floor(Math.random() * 3) + 1;
    const t2 = Math.floor(Math.random() * 4) + 1;
    const o2 = Math.floor(Math.random() * 4) + 5; // renaming ones
    
    const num1 = h1 * 100 + t1 * 10 + o1;
    const num2 = h2 * 100 + t2 * 10 + o2;
    const sum = num1 + num2;
    
    // Hide tens digit of num1
    const maskedNum1 = `${h1}?${o1}`;
    answer = String(t1);
    
    askText = `Find the missing digit in the box (represented by ?): ${maskedNum1} + ${num2} = ${sum}`;
    
    if (isShort) {
      visualEngineStr = `{\n    "componentToRender": "VERTICAL_ALGORITHM",\n    "componentData": { "items": ["${maskedNum1}", "+", "${num2}", "=", "${sum}"] }\n  }`;
    }
    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Write out the full first number", "expectedAnswer": "${num1}" },\n      { "label": "What is the missing digit?", "expectedAnswer": "${answer}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'advanced_missing_digit_sub') {
    // Missing digit in 3-digit subtraction (e.g. 5?1 - 176 = 345)
    const h1 = Math.floor(Math.random() * 4) + 5;
    const t1 = Math.floor(Math.random() * 4) + 1;
    const o1 = Math.floor(Math.random() * 4) + 1;
    
    const h2 = Math.floor(Math.random() * 3) + 1;
    const t2 = Math.floor(Math.random() * 4) + 5; // renaming tens
    const o2 = Math.floor(Math.random() * 4) + 5; // renaming ones
    
    const num1 = h1 * 100 + t1 * 10 + o1;
    const num2 = h2 * 100 + t2 * 10 + o2;
    const diff = num1 - num2;
    
    // Hide tens digit of num1
    const maskedNum1 = `${h1}?${o1}`;
    answer = String(t1);
    
    askText = `Find the missing digit in the box (represented by ?): ${maskedNum1} - ${num2} = ${diff}`;
    
    if (isShort) {
      visualEngineStr = `{\n    "componentToRender": "VERTICAL_ALGORITHM",\n    "componentData": { "items": ["${maskedNum1}", "-", "${num2}", "=", "${diff}"] }\n  }`;
    }
    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Write out the full first number", "expectedAnswer": "${num1}" },\n      { "label": "What is the missing digit?", "expectedAnswer": "${answer}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'advanced_working_backwards') {
    // Start unknown: I had some money, spent X, received Y, now I have Z.
    const startNum = Math.floor(Math.random() * 300) + 200; // 200 to 499
    const spentNum = Math.floor(Math.random() * 150) + 50;  // 50 to 199
    const receivedNum = Math.floor(Math.random() * 100) + 50; // 50 to 149
    const finalNum = startNum - spentNum + receivedNum;
    answer = String(startNum);
    
    askText = `${context.name} had some ${selectedContextItem}. He gave away ${spentNum} of them and then bought ${receivedNum} more. In the end, he had ${finalNum} ${selectedContextItem}. How many ${selectedContextItem} did he have at first?`;
    
    if (isStructure) {
      const step1Ans = finalNum - receivedNum; // before buying
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "How many did he have before buying more?", "expectedAnswer": "${step1Ans}" },\n      { "label": "How many did he have at first?", "expectedAnswer": "${answer}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'advanced_balance_equations') {
    // Balance equations: A + B = C + ?
    const a = Math.floor(Math.random() * 200) + 100;
    const b = Math.floor(Math.random() * 200) + 100;
    const sum = a + b;
    const c = Math.floor(Math.random() * (sum - 50)) + 50;
    const unknown = sum - c;
    answer = String(unknown);
    
    askText = `Find the missing number to make the equation correct: ${a} + ${b} = ${c} + ?`;
    
    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Find the total on the left side of the equation", "expectedAnswer": "${sum}" },\n      { "label": "Find the missing number", "expectedAnswer": "${answer}" }\n    ]\n  }`;
    }
  }
  let customConstraints = "";

  if (activeVariant === 'advanced_multi_step_add_sub') {
    // ... we don't have this one active
  }
  
  if (activeVariant === 'advanced_algo_missing_digit_add') {
    const h1 = Math.floor(Math.random() * 5) + 1;
    const t1 = Math.floor(Math.random() * 8) + 1;
    const o1 = Math.floor(Math.random() * 5) + 5;
    const h2 = Math.floor(Math.random() * 3) + 1;
    const t2 = Math.floor(Math.random() * 4) + 1;
    const o2 = Math.floor(Math.random() * 4) + 5; 
    const num1 = h1 * 100 + t1 * 10 + o1;
    const num2 = h2 * 100 + t2 * 10 + o2;
    const sum = num1 + num2;
    const maskedNum1 = `${h1}?${o1}`;
    answer = String(t1);
    askText = `Find the missing digit in the addition algorithm.`;
    visualEngineStr = `{\n    "componentToRender": "VERTICAL_ALGORITHM",\n    "componentData": { "items": ["${maskedNum1}", "+", "${num2}", "${sum}"] }\n  }`;
    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Look at the ones column. Form an equation to find the total.", "expectedAnswer": "${o1} + ${o2} = ${o1 + o2}" },\n      { "label": "Look at the tens column. Form an equation to find the missing digit.", "expectedAnswer": "1 + ${answer} + ${t2} = ${t1 + t2 + 1}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'advanced_algo_missing_digit_sub') {
    const h1 = Math.floor(Math.random() * 4) + 5;
    const t1 = Math.floor(Math.random() * 4) + 1;
    const o1 = Math.floor(Math.random() * 4) + 1;
    const h2 = Math.floor(Math.random() * 3) + 1;
    const t2 = Math.floor(Math.random() * 4) + 5;
    const o2 = Math.floor(Math.random() * 4) + 5;
    const num1 = h1 * 100 + t1 * 10 + o1;
    const num2 = h2 * 100 + t2 * 10 + o2;
    const diff = num1 - num2;
    const maskedNum1 = `${h1}?${o1}`;
    answer = String(t1);
    askText = `Find the missing digit in the subtraction algorithm.`;
    visualEngineStr = `{\n    "componentToRender": "VERTICAL_ALGORITHM",\n    "componentData": { "items": ["${maskedNum1}", "-", "${num2}", "${diff}"] }\n  }`;
    if (isStructure) {
      const diffOnes = diff % 10;
      const diffTens = Math.floor(diff / 10) % 10;
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Look at the ones column. Form an equation to find the ones digit of the answer.", "expectedAnswer": "1${o1} - ${o2} = ${diffOnes}" },\n      { "label": "Look at the tens column. Form an equation to find the missing digit.", "expectedAnswer": "${answer} - 1 - ${t2} = ${diffTens}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'advanced_algo_add_three_3_digit_numbers') {
    const num1 = Math.floor(Math.random() * 200) + 100;
    const num2 = Math.floor(Math.random() * 200) + 100;
    const num3 = Math.floor(Math.random() * 200) + 100;
    const sum = num1 + num2 + num3;
    answer = String(sum);
    askText = `What is ${num1} + ${num2} + ${num3}?`;
    visualEngineStr = `{\n    "componentToRender": "VERTICAL_ALGORITHM",\n    "componentData": { "items": ["${num1}", "${num2}", "+", "${num3}"] }\n  }`;
    
    customConstraints = `- In the model solution, solve the addition COLUMN by COLUMN (ones column, then tens, then hundreds). Do NOT say "Add the first two numbers, then add the third". Follow the vertical stack exactly.`;
    
    if (isStructure) {
      const o1 = num1 % 10;
      const t1 = Math.floor(num1 / 10) % 10;
      const h1 = Math.floor(num1 / 100);
      const o2 = num2 % 10;
      const t2 = Math.floor(num2 / 10) % 10;
      const h2 = Math.floor(num2 / 100);
      const o3 = num3 % 10;
      const t3 = Math.floor(num3 / 10) % 10;
      const h3 = Math.floor(num3 / 100);
      
      const sumOnes = o1 + o2 + o3;
      const carryOnes = Math.floor(sumOnes / 10);
      const sumTens = t1 + t2 + t3 + carryOnes;
      const carryTens = Math.floor(sumTens / 10);
      const sumHundreds = h1 + h2 + h3 + carryTens;
      
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
      stepsStr += `      { "label": "What is the final answer?", "expectedAnswer": "${sum}" }\n    ]`;
      
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": ${stepsStr}\n  }`;
    }
  }
  else if (activeVariant === 'advanced_algo_missing_two_digits_add') {
    const h1 = Math.floor(Math.random() * 5) + 1;
    const t1 = Math.floor(Math.random() * 8) + 1;
    const o1 = Math.floor(Math.random() * 5) + 5;
    const h2 = Math.floor(Math.random() * 3) + 1;
    const t2 = Math.floor(Math.random() * 4) + 1;
    const o2 = Math.floor(Math.random() * 4) + 5; 
    const num1 = h1 * 100 + t1 * 10 + o1;
    const num2 = h2 * 100 + t2 * 10 + o2;
    const sum = num1 + num2;
    const maskedNum1 = `${h1}?${o1}`;
    const maskedNum2 = `${h2}${t2}?`;
    answer = `${t1}, ${o2}`;
    askText = `Find the two missing digits in the addition algorithm. (Format: tens digit of first number, ones digit of second number)`;
    visualEngineStr = `{\n    "componentToRender": "VERTICAL_ALGORITHM",\n    "componentData": { "items": ["${maskedNum1}", "+", "${maskedNum2}", "${sum}"] }\n  }`;
    if (isStructure) {
      const sumOnes = (o1 + o2) % 10;
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Look at the ones column. Form an equation to find the missing digit.", "expectedAnswer": "${o1} + ${o2} = 1${sumOnes}" },\n      { "label": "Look at the tens column. Form an equation to find the missing digit.", "expectedAnswer": "1 + ${t1} + ${t2} = ${t1 + t2 + 1}" },\n      { "label": "What are the two missing digits?", "expectedAnswer": "${answer}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'advanced_algo_missing_two_digits_sub') {
    const h1 = Math.floor(Math.random() * 4) + 5;
    const t1 = Math.floor(Math.random() * 4) + 1;
    const o1 = Math.floor(Math.random() * 4) + 1;
    const h2 = Math.floor(Math.random() * 3) + 1;
    const t2 = Math.floor(Math.random() * 4) + 5;
    const o2 = Math.floor(Math.random() * 4) + 5;
    const num1 = h1 * 100 + t1 * 10 + o1;
    const num2 = h2 * 100 + t2 * 10 + o2;
    const diff = num1 - num2;
    const maskedNum1 = `${h1}?${o1}`;
    const maskedNum2 = `${h2}${t2}?`;
    answer = `${t1}, ${o2}`;
    askText = `Find the two missing digits in the subtraction algorithm. (Format: tens digit of first number, ones digit of second number)`;
    visualEngineStr = `{\n    "componentToRender": "VERTICAL_ALGORITHM",\n    "componentData": { "items": ["${maskedNum1}", "-", "${maskedNum2}", "${diff}"] }\n  }`;
    if (isStructure) {
      const diffTens = Math.floor(diff / 10) % 10;
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Look at the ones column. Form an equation to find the missing digit.", "expectedAnswer": "1${o1} - ${o2} = ${(10 + o1) - o2}" },\n      { "label": "Look at the tens column. Form an equation to find the missing digit.", "expectedAnswer": "${t1} - 1 - ${t2} = ${diffTens}" },\n      { "label": "What are the two missing digits?", "expectedAnswer": "${answer}" }\n    ]\n  }`;
    }
  }

  let aiPrompt = `You are an expert Primary 2 math generator.
Generate a question for the subtopic: Addition and Subtraction.
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
- The question stem must clearly ask "${askText}".
- The finalAnswer must be EXACTLY: "${answer}".
- If MCQ, provide 4 options including the correct answer and 3 reasonable distractors. Ensure the correct option matches "${answer}".
${customConstraints ? customConstraints : ""}

${getFormatInstructions(visualEngineStr, inputRequirementStr)}`;

  return {
    aiPrompt: aiPrompt,
    metadata: {
      difficulty: 'advanced',
      steps: isStructure ? 2 : 1,
      maxNumber: 1000,
      logicDescription: "Multi-step word problems or missing digits in addition/subtraction."
    }
  };
}
