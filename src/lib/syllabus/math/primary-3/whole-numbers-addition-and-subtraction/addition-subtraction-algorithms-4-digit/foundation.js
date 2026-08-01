export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  if (activeVariant === "foundation_random") {
    const options = [
      "foundation_add_4_digit_no_renaming",
      "foundation_sub_4_digit_no_renaming",
      "foundation_add_3_digit_renaming",
      "foundation_sub_3_digit_renaming",
      "foundation_algo_add_4_digit_3_digit_no_renaming",
      "foundation_algo_add_4_digit_2_digit_no_renaming",
      "foundation_algo_sub_3_digit_from_4_digit_no_renaming",
      "foundation_algo_sub_2_digit_from_4_digit_no_renaming",
      "foundation_algo_add_4_digit_multiples_of_100"
    ];
    activeVariant = options[Math.floor(Math.random() * options.length)];
  }

  let num1 = 0;
  let num2 = 0;
  let finalAnswer = "";
  let isAdd = activeVariant.includes("_add_");

  if (activeVariant === "foundation_add_4_digit_no_renaming") {
    let th1 = Math.floor(Math.random() * 8) + 1; 
    let th2 = Math.floor(Math.random() * (9 - th1)) + 1;
    let h1 = Math.floor(Math.random() * 10);
    let h2 = Math.floor(Math.random() * (10 - h1));
    let t1 = Math.floor(Math.random() * 10);
    let t2 = Math.floor(Math.random() * (10 - t1));
    let o1 = Math.floor(Math.random() * 10);
    let o2 = Math.floor(Math.random() * (10 - o1));
    num1 = th1 * 1000 + h1 * 100 + t1 * 10 + o1;
    num2 = th2 * 1000 + h2 * 100 + t2 * 10 + o2;
    finalAnswer = (num1 + num2).toString();
  } else if (activeVariant === "foundation_sub_4_digit_no_renaming") {
    let th1 = Math.floor(Math.random() * 8) + 2; 
    let th2 = Math.floor(Math.random() * (th1 - 1)) + 1;
    let h1 = Math.floor(Math.random() * 10);
    let h2 = Math.floor(Math.random() * (h1 + 1));
    let t1 = Math.floor(Math.random() * 10);
    let t2 = Math.floor(Math.random() * (t1 + 1));
    let o1 = Math.floor(Math.random() * 10);
    let o2 = Math.floor(Math.random() * (o1 + 1));
    num1 = th1 * 1000 + h1 * 100 + t1 * 10 + o1;
    num2 = th2 * 1000 + h2 * 100 + t2 * 10 + o2;
    finalAnswer = (num1 - num2).toString();
  } else if (activeVariant === "foundation_add_3_digit_renaming") {
    let h1 = Math.floor(Math.random() * 8) + 1;
    let h2 = Math.floor(Math.random() * (9 - h1)) + 1;
    let t1 = Math.floor(Math.random() * 9) + 1; // 1-9
    let t2 = Math.floor(Math.random() * (10 - (10 - t1))) + (10 - t1); // forces tens sum >= 10
    let o1 = Math.floor(Math.random() * 10);
    let o2 = Math.floor(Math.random() * 10);
    num1 = h1 * 100 + t1 * 10 + o1;
    num2 = h2 * 100 + t2 * 10 + o2;
    finalAnswer = (num1 + num2).toString();
  } else if (activeVariant === "foundation_sub_3_digit_renaming") {
    let h1 = Math.floor(Math.random() * 7) + 3; // 3-9
    let h2 = Math.floor(Math.random() * (h1 - 2)) + 1; // ensures h1 > h2 + 1
    let t1 = Math.floor(Math.random() * 8); // 0-7
    let t2 = Math.floor(Math.random() * (9 - t1)) + t1 + 1; // forces t2 > t1
    let o1 = Math.floor(Math.random() * 10);
    let o2 = Math.floor(Math.random() * 10); 
    num1 = h1 * 100 + t1 * 10 + o1;
    num2 = h2 * 100 + t2 * 10 + o2;
    finalAnswer = (num1 - num2).toString();
  } else if (activeVariant === "foundation_algo_add_4_digit_3_digit_no_renaming") {
    let th1 = Math.floor(Math.random() * 9) + 1;
    let h1 = Math.floor(Math.random() * 10);
    let h2 = Math.floor(Math.random() * (10 - h1)); 
    let t1 = Math.floor(Math.random() * 10);
    let t2 = Math.floor(Math.random() * (10 - t1)); 
    let o1 = Math.floor(Math.random() * 10);
    let o2 = Math.floor(Math.random() * (10 - o1)); 
    num1 = th1 * 1000 + h1 * 100 + t1 * 10 + o1;
    num2 = h2 * 100 + t2 * 10 + o2;
    finalAnswer = (num1 + num2).toString();
  } else if (activeVariant === "foundation_algo_add_4_digit_2_digit_no_renaming") {
    let th1 = Math.floor(Math.random() * 9) + 1;
    let h1 = Math.floor(Math.random() * 10);
    let t1 = Math.floor(Math.random() * 10);
    let t2 = Math.floor(Math.random() * (10 - t1)); 
    let o1 = Math.floor(Math.random() * 10);
    let o2 = Math.floor(Math.random() * (10 - o1));
    num1 = th1 * 1000 + h1 * 100 + t1 * 10 + o1;
    num2 = t2 * 10 + o2;
    finalAnswer = (num1 + num2).toString();
  } else if (activeVariant === "foundation_algo_sub_3_digit_from_4_digit_no_renaming") {
    let th1 = Math.floor(Math.random() * 9) + 1;
    let h1 = Math.floor(Math.random() * 9) + 1; 
    let h2 = Math.floor(Math.random() * h1) + 1; 
    let t1 = Math.floor(Math.random() * 10);
    let t2 = Math.floor(Math.random() * (t1 + 1)); 
    let o1 = Math.floor(Math.random() * 10);
    let o2 = Math.floor(Math.random() * (o1 + 1));
    num1 = th1 * 1000 + h1 * 100 + t1 * 10 + o1;
    num2 = h2 * 100 + t2 * 10 + o2;
    finalAnswer = (num1 - num2).toString();
  } else if (activeVariant === "foundation_algo_sub_2_digit_from_4_digit_no_renaming") {
    let th1 = Math.floor(Math.random() * 9) + 1;
    let h1 = Math.floor(Math.random() * 10);
    let t1 = Math.floor(Math.random() * 9) + 1; 
    let t2 = Math.floor(Math.random() * t1) + 1; 
    let o1 = Math.floor(Math.random() * 10);
    let o2 = Math.floor(Math.random() * (o1 + 1)); 
    num1 = th1 * 1000 + h1 * 100 + t1 * 10 + o1;
    num2 = t2 * 10 + o2;
    finalAnswer = (num1 - num2).toString();
  } else if (activeVariant === "foundation_algo_add_4_digit_multiples_of_100") {
    let th1 = Math.floor(Math.random() * 9) + 1;
    let h1 = Math.floor(Math.random() * 10);
    let t1 = Math.floor(Math.random() * 10);
    let o1 = Math.floor(Math.random() * 10);
    num1 = th1 * 1000 + h1 * 100 + t1 * 10 + o1;
    
    // multiple of 100 up to 900
    let h2 = Math.floor(Math.random() * 9) + 1;
    if (h1 + h2 >= 10) {
      h2 = 9 - h1; // clamp it
      if (h2 === 0) h2 = 1;
    }
    num2 = h2 * 100;
    finalAnswer = (num1 + num2).toString();
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
    inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Write out the equation", "expectedAnswer": "${equationStr}" },\n      { "label": "Calculate the final answer", "expectedAnswer": "${finalAnswer}" }\n    ]\n  }`;
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
- You MUST use the exact string "${finalAnswer}" as the \`finalAnswer\`.
- You MUST explicitly generate a \`solutionSteps\` and a \`hint\`.
- For \`solutionSteps\`, provide EXACTLY TWO steps:
  1. "Setting up the vertical algorithm:" followed by this exact HTML: \n${step1HTML}
  2. "Solving with renaming/regrouping:" followed by this exact HTML: \n${step2HTML}
  CRITICAL: DO NOT modify the HTML strings. Use them EXACTLY as provided above!
  separate steps using the exact characters \\n inside the string.for line breaks inside the JSON string.
- If MCQ, provide 4 options including the correct answer and 3 reasonable distractors. Ensure the correct option matches "${finalAnswer}".
- Do NOT modify the \`visualEngine\` or \`inputRequirement\` JSON blocks provided in the template. Use them EXACTLY as shown.
- Return ONLY valid JSON. Do not append extra closing braces.

${getFormatInstructions(visualEngineStr, inputRequirementStr)}`;

  return {
    aiPrompt: aiPrompt
  };
}
