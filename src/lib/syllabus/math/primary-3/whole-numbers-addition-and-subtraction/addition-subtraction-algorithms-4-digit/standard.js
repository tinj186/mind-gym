export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  const variants = [
    'standard_add_4_digit_1_renaming',
    'standard_add_4_digit_2_renaming',
    'standard_sub_4_digit_1_renaming',
    'standard_sub_4_digit_2_renaming',
    'standard_sub_4_digit_across_zeros',
    'standard_algo_add_4_digit_3_digit_renaming',
    'standard_algo_add_4_digit_2_digit_renaming',
    'standard_algo_sub_3_digit_from_4_digit_renaming',
    'standard_algo_sub_2_digit_from_4_digit_renaming',
    'standard_algo_add_4_digit_4_digit_renaming'
  ];

  if (activeVariant === 'standard_random' || !variants.includes(activeVariant)) {
    activeVariant = variants[Math.floor(Math.random() * variants.length)];
  }

  let num1, num2, answer;
  let isAdd = activeVariant.includes('_add_');

  if (activeVariant === 'standard_add_4_digit_1_renaming') {
    const renameOnes = Math.random() > 0.5;
    const th1 = Math.floor(Math.random() * 5) + 1;
    const th2 = Math.floor(Math.random() * 3) + 1;
    const h1 = Math.floor(Math.random() * 4) + 1;
    const h2 = Math.floor(Math.random() * 4) + 1; // no renaming hundreds
    
    let t1, t2, o1, o2;
    if (renameOnes) {
      t1 = Math.floor(Math.random() * 4) + 1;
      t2 = Math.floor(Math.random() * 4) + 1; 
      o1 = Math.floor(Math.random() * 5) + 5;
      o2 = Math.floor(Math.random() * 5) + 5; // renaming ones
    } else {
      t1 = Math.floor(Math.random() * 5) + 5;
      t2 = Math.floor(Math.random() * 5) + 5; // renaming tens
      o1 = Math.floor(Math.random() * 4) + 1;
      o2 = Math.floor(Math.random() * 4) + 1; 
    }
    num1 = th1 * 1000 + h1 * 100 + t1 * 10 + o1;
    num2 = th2 * 1000 + h2 * 100 + t2 * 10 + o2;
    answer = String(num1 + num2);
  } 
  else if (activeVariant === 'standard_add_4_digit_2_renaming') {
    const th1 = Math.floor(Math.random() * 4) + 1;
    const th2 = Math.floor(Math.random() * 4) + 1;
    const h1 = Math.floor(Math.random() * 4) + 1;
    const h2 = Math.floor(Math.random() * 4) + 1; 
    const t1 = Math.floor(Math.random() * 5) + 5;
    const t2 = Math.floor(Math.random() * 5) + 5; // renaming tens
    const o1 = Math.floor(Math.random() * 5) + 5;
    const o2 = Math.floor(Math.random() * 5) + 5; // renaming ones
    num1 = th1 * 1000 + h1 * 100 + t1 * 10 + o1;
    num2 = th2 * 1000 + h2 * 100 + t2 * 10 + o2;
    answer = String(num1 + num2);
  }
  else if (activeVariant === 'standard_sub_4_digit_1_renaming') {
    const renameOnes = Math.random() > 0.5;
    const th1 = Math.floor(Math.random() * 5) + 5; 
    const th2 = Math.floor(Math.random() * 3) + 1; 
    const h1 = Math.floor(Math.random() * 5) + 5; 
    const h2 = Math.floor(Math.random() * 3) + 1; 
    
    let t1, t2, o1, o2;
    if (renameOnes) {
      t1 = Math.floor(Math.random() * 4) + 5; 
      t2 = Math.floor(Math.random() * 3) + 1; 
      o1 = Math.floor(Math.random() * 4) + 1; 
      o2 = Math.floor(Math.random() * 4) + 5; // rename ones
    } else {
      t1 = Math.floor(Math.random() * 4) + 1; 
      t2 = Math.floor(Math.random() * 4) + 5; // rename tens
      o1 = Math.floor(Math.random() * 4) + 5; 
      o2 = Math.floor(Math.random() * 3) + 1; 
    }
    num1 = th1 * 1000 + h1 * 100 + t1 * 10 + o1;
    num2 = th2 * 1000 + h2 * 100 + t2 * 10 + o2;
    answer = String(num1 - num2);
  }
  else if (activeVariant === 'standard_sub_4_digit_2_renaming') {
    const th1 = Math.floor(Math.random() * 4) + 5; 
    const th2 = Math.floor(Math.random() * 3) + 1; 
    const h1 = Math.floor(Math.random() * 5) + 5; 
    const h2 = Math.floor(Math.random() * 3) + 1; 
    const t1 = Math.floor(Math.random() * 4) + 1; 
    const t2 = Math.floor(Math.random() * 4) + 5; // rename tens
    const o1 = Math.floor(Math.random() * 4) + 1; 
    const o2 = Math.floor(Math.random() * 4) + 5; // rename ones
    
    num1 = th1 * 1000 + h1 * 100 + t1 * 10 + o1;
    num2 = th2 * 1000 + h2 * 100 + t2 * 10 + o2;
    answer = String(num1 - num2);
  }
  else if (activeVariant === 'standard_sub_4_digit_across_zeros') {
    const th1 = Math.floor(Math.random() * 5) + 4; 
    num1 = th1 * 1000;
    
    const th2 = Math.floor(Math.random() * (th1 - 2)) + 1; 
    const h2 = Math.floor(Math.random() * 8) + 1; 
    const t2 = Math.floor(Math.random() * 8) + 1; 
    const o2 = Math.floor(Math.random() * 8) + 1; 
    
    num2 = th2 * 1000 + h2 * 100 + t2 * 10 + o2;
    answer = String(num1 - num2);
  }
  else if (activeVariant === 'standard_algo_add_4_digit_3_digit_renaming') {
    const th1 = Math.floor(Math.random() * 8) + 1; 
    const h1 = Math.floor(Math.random() * 5) + 5;
    const h2 = Math.floor(Math.random() * 5) + 5; // h1+h2 >= 10
    const t1 = Math.floor(Math.random() * 9);
    const t2 = Math.floor(Math.random() * (10 - t1 - 1)) + 1; 
    const o1 = Math.floor(Math.random() * 9);
    const o2 = Math.floor(Math.random() * (10 - o1 - 1)) + 1; 
    num1 = th1 * 1000 + h1 * 100 + t1 * 10 + o1;
    num2 = h2 * 100 + t2 * 10 + o2;
    answer = String(num1 + num2);
  }
  else if (activeVariant === 'standard_algo_add_4_digit_2_digit_renaming') {
    const th1 = Math.floor(Math.random() * 8) + 1;
    const h1 = Math.floor(Math.random() * 8) + 1;
    const t1 = Math.floor(Math.random() * 5) + 5;
    const t2 = Math.floor(Math.random() * 5) + 5; // t1+t2 >= 10
    const o1 = Math.floor(Math.random() * 5) + 5;
    const o2 = Math.floor(Math.random() * 5) + 5; // o1+o2 >= 10
    num1 = th1 * 1000 + h1 * 100 + t1 * 10 + o1;
    num2 = t2 * 10 + o2;
    answer = String(num1 + num2);
  }
  else if (activeVariant === 'standard_algo_sub_3_digit_from_4_digit_renaming') {
    const th1 = Math.floor(Math.random() * 8) + 1;
    const h1 = Math.floor(Math.random() * 4) + 1; 
    const h2 = Math.floor(Math.random() * 4) + 5; // h1 < h2, rename hundreds
    const t1 = Math.floor(Math.random() * 5) + 5;
    const t2 = Math.floor(Math.random() * 4) + 1; 
    const o1 = Math.floor(Math.random() * 5) + 5;
    const o2 = Math.floor(Math.random() * 4) + 1; 
    num1 = th1 * 1000 + h1 * 100 + t1 * 10 + o1;
    num2 = h2 * 100 + t2 * 10 + o2;
    answer = String(num1 - num2);
  }
  else if (activeVariant === 'standard_algo_sub_2_digit_from_4_digit_renaming') {
    const th1 = Math.floor(Math.random() * 8) + 1;
    const h1 = Math.floor(Math.random() * 8) + 1;
    const t1 = Math.floor(Math.random() * 4) + 1; 
    const t2 = Math.floor(Math.random() * 4) + 5; // t1 < t2, rename tens
    const o1 = Math.floor(Math.random() * 4) + 1;
    const o2 = Math.floor(Math.random() * 4) + 5; // o1 < o2, rename ones
    num1 = th1 * 1000 + h1 * 100 + t1 * 10 + o1;
    num2 = t2 * 10 + o2;
    answer = String(num1 - num2);
  }
  else if (activeVariant === 'standard_algo_add_4_digit_4_digit_renaming') {
    const renameOnes = Math.random() > 0.5;
    const th1 = Math.floor(Math.random() * 4) + 1;
    const th2 = Math.floor(Math.random() * 4) + 1;
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
    num1 = th1 * 1000 + h1 * 100 + t1 * 10 + o1;
    num2 = th2 * 1000 + h2 * 100 + t2 * 10 + o2;
    answer = String(num1 + num2);
  }

  let askText = '';
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;

  // 50% chance for MCQ to be a word problem as well
  const useWordProblem = isStructure || (isMCQ && Math.random() > 0.5);

  if (useWordProblem) {
    askText = isAdd 
      ? `${context.name} has ${num1} ${selectedContextItem}. His friend gives him ${num2} more. How many ${selectedContextItem} does he have altogether?`
      : `${context.name} has ${num1} ${selectedContextItem}. He gives away ${num2} ${selectedContextItem}. How many ${selectedContextItem} does he have left?`;
  } else {
    askText = isAdd ? `What is ${num1} + ${num2}?` : `What is ${num1} - ${num2}?`;
  }

  if (isStructure) {
    const equationStr = isAdd ? `${num1}+${num2}` : `${num1}-${num2}`;
    inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Write out the equation", "expectedAnswer": "${equationStr}" },\n      { "label": "Calculate the final answer", "expectedAnswer": "${answer}" }\n    ]\n  }`;
  } else {
    if (isShort || activeVariant.includes("algo")) {
      visualEngineStr = `{\n    "componentToRender": "VERTICAL_ALGORITHM",\n    "componentData": { "items": ["${num1}", "${isAdd ? '+' : '-'}", "${num2}"] }\n  }`;
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

${getFormatInstructions(visualEngineStr, inputRequirementStr)}`;

  return {
    aiPrompt: aiPrompt,
    metadata: {
      difficulty: 'standard',
      steps: isStructure ? 2 : 1,
      maxNumber: 10000,
      logicDescription: "Add or subtract 4-digit numbers with renaming."
    }
  };
}
