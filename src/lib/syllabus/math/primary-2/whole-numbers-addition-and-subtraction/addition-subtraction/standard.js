export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  // ==========================================
  // STANDARD LEVEL
  // ==========================================
  const variants = [
    'standard_add_3_digit_1_renaming',
    'standard_add_3_digit_2_renaming',
    'standard_sub_3_digit_1_renaming',
    'standard_sub_3_digit_2_renaming',
    'standard_sub_3_digit_across_zeros',
    'standard_algo_add_3_digit_2_digit_renaming',
    'standard_algo_add_3_digit_1_digit_renaming',
    'standard_algo_sub_2_digit_from_3_digit_renaming',
    'standard_algo_sub_1_digit_from_3_digit_renaming',
    'standard_algo_add_3_digit_3_digit_renaming'
  ];

  if (activeVariant === 'standard_random' || !variants.includes(activeVariant)) {
    activeVariant = variants[Math.floor(Math.random() * variants.length)];
  }

  let num1, num2, answer;
  let isAdd = activeVariant.includes('_add_');

  // Math generation logic
  if (activeVariant === 'standard_add_3_digit_1_renaming') {
    // 3-digit addition, exactly 1 renaming (either ones->tens OR tens->hundreds)
    const renameOnes = Math.random() > 0.5;
    const h1 = Math.floor(Math.random() * 5) + 1;
    const h2 = Math.floor(Math.random() * 3) + 1;
    
    let t1, t2, o1, o2;
    if (renameOnes) {
      t1 = Math.floor(Math.random() * 4) + 1;
      t2 = Math.floor(Math.random() * 4) + 1; // t1+t2 < 9, no renaming
      o1 = Math.floor(Math.random() * 5) + 5;
      o2 = Math.floor(Math.random() * 5) + 5; // o1+o2 >= 10, renaming ones
    } else {
      t1 = Math.floor(Math.random() * 5) + 5;
      t2 = Math.floor(Math.random() * 5) + 5; // t1+t2 >= 10, renaming tens
      o1 = Math.floor(Math.random() * 4) + 1;
      o2 = Math.floor(Math.random() * 4) + 1; // o1+o2 < 9, no renaming
    }
    num1 = h1 * 100 + t1 * 10 + o1;
    num2 = h2 * 100 + t2 * 10 + o2;
    answer = String(num1 + num2);
  } 
  else if (activeVariant === 'standard_add_3_digit_2_renaming') {
    // 3-digit addition, exactly 2 renamings (ones->tens AND tens->hundreds)
    const h1 = Math.floor(Math.random() * 4) + 1;
    const h2 = Math.floor(Math.random() * 4) + 1; // h1+h2 < 9
    const t1 = Math.floor(Math.random() * 5) + 5;
    const t2 = Math.floor(Math.random() * 5) + 5; // t1+t2 >= 10
    const o1 = Math.floor(Math.random() * 5) + 5;
    const o2 = Math.floor(Math.random() * 5) + 5; // o1+o2 >= 10
    num1 = h1 * 100 + t1 * 10 + o1;
    num2 = h2 * 100 + t2 * 10 + o2;
    answer = String(num1 + num2);
  }
  else if (activeVariant === 'standard_sub_3_digit_1_renaming') {
    // 3-digit subtraction, exactly 1 renaming (tens->ones OR hundreds->tens)
    const renameOnes = Math.random() > 0.5;
    const h1 = Math.floor(Math.random() * 5) + 5; // 5-9
    const h2 = Math.floor(Math.random() * 3) + 1; // 1-3
    
    let t1, t2, o1, o2;
    if (renameOnes) {
      t1 = Math.floor(Math.random() * 4) + 5; // 5-8
      t2 = Math.floor(Math.random() * 3) + 1; // t1 > t2 (no renaming)
      o1 = Math.floor(Math.random() * 4) + 1; // 1-4
      o2 = Math.floor(Math.random() * 4) + 5; // 5-8 (o1 < o2, rename ones)
    } else {
      t1 = Math.floor(Math.random() * 4) + 1; // 1-4
      t2 = Math.floor(Math.random() * 4) + 5; // 5-8 (t1 < t2, rename tens)
      o1 = Math.floor(Math.random() * 4) + 5; // 5-8
      o2 = Math.floor(Math.random() * 3) + 1; // o1 > o2 (no renaming)
    }
    num1 = h1 * 100 + t1 * 10 + o1;
    num2 = h2 * 100 + t2 * 10 + o2;
    answer = String(num1 - num2);
  }
  else if (activeVariant === 'standard_sub_3_digit_2_renaming') {
    // 3-digit subtraction, exactly 2 renamings
    const h1 = Math.floor(Math.random() * 4) + 5; // 5-8
    const h2 = Math.floor(Math.random() * 3) + 1; // 1-3
    const t1 = Math.floor(Math.random() * 4) + 1; // 1-4
    const t2 = Math.floor(Math.random() * 4) + 5; // 5-8 (t1 < t2)
    const o1 = Math.floor(Math.random() * 4) + 1; // 1-4
    const o2 = Math.floor(Math.random() * 4) + 5; // 5-8 (o1 < o2)
    
    num1 = h1 * 100 + t1 * 10 + o1;
    num2 = h2 * 100 + t2 * 10 + o2;
    answer = String(num1 - num2);
  }
  else if (activeVariant === 'standard_sub_3_digit_across_zeros') {
    // Subtract from multiple of 100
    const h1 = Math.floor(Math.random() * 5) + 4; // 4-8
    num1 = h1 * 100;
    
    const h2 = Math.floor(Math.random() * (h1 - 2)) + 1; // Ensure h2 < h1
    const t2 = Math.floor(Math.random() * 8) + 1; // 1-8
    const o2 = Math.floor(Math.random() * 8) + 1; // 1-8
    
    num2 = h2 * 100 + t2 * 10 + o2;
    answer = String(num1 - num2);
  }
  else if (activeVariant === 'standard_algo_add_3_digit_2_digit_renaming') {
    const h1 = Math.floor(Math.random() * 8) + 1; // 1-8
    const t1 = Math.floor(Math.random() * 5) + 5;
    const t2 = Math.floor(Math.random() * 5) + 5; // t1+t2 >= 10
    const o1 = Math.floor(Math.random() * 9);
    const o2 = Math.floor(Math.random() * (10 - o1 - 1)) + 1; // no renaming ones
    num1 = h1 * 100 + t1 * 10 + o1;
    num2 = t2 * 10 + o2;
    answer = String(num1 + num2);
  }
  else if (activeVariant === 'standard_algo_add_3_digit_1_digit_renaming') {
    const h1 = Math.floor(Math.random() * 8) + 1;
    const t1 = Math.floor(Math.random() * 9); // 0-8
    const o1 = Math.floor(Math.random() * 5) + 5;
    const o2 = Math.floor(Math.random() * 5) + 5; // o1+o2 >= 10
    num1 = h1 * 100 + t1 * 10 + o1;
    num2 = o2;
    answer = String(num1 + num2);
  }
  else if (activeVariant === 'standard_algo_sub_2_digit_from_3_digit_renaming') {
    const h1 = Math.floor(Math.random() * 8) + 1;
    const t1 = Math.floor(Math.random() * 4) + 1; // 1-4
    const t2 = Math.floor(Math.random() * 4) + 5; // 5-8, t1 < t2, rename tens
    const o1 = Math.floor(Math.random() * 5) + 5;
    const o2 = Math.floor(Math.random() * 4) + 1; // o1 > o2, no renaming ones
    num1 = h1 * 100 + t1 * 10 + o1;
    num2 = t2 * 10 + o2;
    answer = String(num1 - num2);
  }
  else if (activeVariant === 'standard_algo_sub_1_digit_from_3_digit_renaming') {
    const h1 = Math.floor(Math.random() * 8) + 1;
    const t1 = Math.floor(Math.random() * 8) + 1; // 1-8
    const o1 = Math.floor(Math.random() * 4) + 1;
    const o2 = Math.floor(Math.random() * 4) + 5; // o1 < o2, rename ones
    num1 = h1 * 100 + t1 * 10 + o1;
    num2 = o2;
    answer = String(num1 - num2);
  }
  else if (activeVariant === 'standard_algo_add_3_digit_3_digit_renaming') {
    const renameOnes = Math.random() > 0.5;
    const h1 = Math.floor(Math.random() * 4) + 1;
    const h2 = Math.floor(Math.random() * 4) + 1;
    let t1, t2, o1, o2;
    if (renameOnes) {
      t1 = Math.floor(Math.random() * 4) + 1;
      t2 = Math.floor(Math.random() * 4) + 1;
      o1 = Math.floor(Math.random() * 5) + 5;
      o2 = Math.floor(Math.random() * 5) + 5;
    } else {
      t1 = Math.floor(Math.random() * 5) + 5;
      t2 = Math.floor(Math.random() * 5) + 5;
      o1 = Math.floor(Math.random() * 4) + 1;
      o2 = Math.floor(Math.random() * 4) + 1;
    }
    num1 = h1 * 100 + t1 * 10 + o1;
    num2 = h2 * 100 + t2 * 10 + o2;
    answer = String(num1 + num2);
  }

  // Set up Visual Engine and Inputs
  let askText = '';
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;

  if (isStructure) {
    // Worded question for Structured
    askText = isAdd 
      ? `${context.name} has ${num1} ${selectedContextItem}. His friend gives him ${num2} more. How many ${selectedContextItem} does he have altogether?`
      : `${context.name} has ${num1} ${selectedContextItem}. He gives away ${num2} ${selectedContextItem}. How many ${selectedContextItem} does he have left?`;
    
    const equationStr = isAdd ? `${num1}+${num2}` : `${num1}-${num2}`;
    inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Write out the equation", "expectedAnswer": "${equationStr}" },\n      { "label": "Calculate the final answer", "expectedAnswer": "${answer}" }\n    ]\n  }`;
  } else {
    // Direct equation for Short Question / MCQ
    askText = isAdd ? `What is ${num1} + ${num2}?` : `What is ${num1} - ${num2}?`;
    
    if (isShort || activeVariant.includes("algo")) {
      visualEngineStr = `{\n    "componentToRender": "VERTICAL_ALGORITHM",\n    "componentData": { "items": ["${num1}", "${isAdd ? '+' : '-'}", "${num2}"] }\n  }`;
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

${getFormatInstructions(visualEngineStr, inputRequirementStr)}`;

  return {
    aiPrompt: aiPrompt,
    metadata: {
      difficulty: 'standard',
      steps: isStructure ? 2 : 1,
      maxNumber: 1000,
      logicDescription: "Add or subtract 3-digit numbers with renaming."
    }
  };
}
