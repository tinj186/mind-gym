export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  if (activeVariant === "foundation_random") {
    const options = [
      "foundation_add_3_digit_no_renaming",
      "foundation_sub_3_digit_no_renaming",
      "foundation_add_2_digit_renaming",
      "foundation_sub_2_digit_renaming",
      "foundation_algo_add_3_digit_2_digit_no_renaming",
      "foundation_algo_add_3_digit_1_digit_no_renaming",
      "foundation_algo_sub_2_digit_from_3_digit_no_renaming",
      "foundation_algo_sub_1_digit_from_3_digit_no_renaming",
      "foundation_algo_add_3_digit_multiples_of_10"
    ];
    activeVariant = options[Math.floor(Math.random() * options.length)];
  }

  let num1 = 0;
  let num2 = 0;
  let finalAnswer = "";
  let isAdd = activeVariant.includes("_add_");

  if (activeVariant === "foundation_add_3_digit_no_renaming") {
    let h1 = Math.floor(Math.random() * 8) + 1; 
    let h2 = Math.floor(Math.random() * (9 - h1)) + 1;
    let t1 = Math.floor(Math.random() * 10);
    let t2 = Math.floor(Math.random() * (10 - t1));
    let o1 = Math.floor(Math.random() * 10);
    let o2 = Math.floor(Math.random() * (10 - o1));
    num1 = h1 * 100 + t1 * 10 + o1;
    num2 = h2 * 100 + t2 * 10 + o2;
    finalAnswer = (num1 + num2).toString();
  } else if (activeVariant === "foundation_sub_3_digit_no_renaming") {
    let h1 = Math.floor(Math.random() * 8) + 2; 
    let h2 = Math.floor(Math.random() * (h1 - 1)) + 1;
    let t1 = Math.floor(Math.random() * 10);
    let t2 = Math.floor(Math.random() * (t1 + 1));
    let o1 = Math.floor(Math.random() * 10);
    let o2 = Math.floor(Math.random() * (o1 + 1));
    num1 = h1 * 100 + t1 * 10 + o1;
    num2 = h2 * 100 + t2 * 10 + o2;
    finalAnswer = (num1 - num2).toString();
  } else if (activeVariant === "foundation_add_2_digit_renaming") {
    let t1 = Math.floor(Math.random() * 8) + 1;
    let t2 = Math.floor(Math.random() * (9 - t1)) + 1;
    let o1 = Math.floor(Math.random() * 9) + 1; // 1-9
    let o2 = Math.floor(Math.random() * (10 - (10 - o1))) + (10 - o1); // forces sum >= 10
    num1 = t1 * 10 + o1;
    num2 = t2 * 10 + o2;
    finalAnswer = (num1 + num2).toString();
  } else if (activeVariant === "foundation_sub_2_digit_renaming") {
    let t1 = Math.floor(Math.random() * 7) + 3; // 3-9
    let t2 = Math.floor(Math.random() * (t1 - 2)) + 1; // ensures t1 > t2 + 1
    let o1 = Math.floor(Math.random() * 8); // 0-7
    let o2 = Math.floor(Math.random() * (9 - o1)) + o1 + 1; // forces o2 > o1
    num1 = t1 * 10 + o1;
    num2 = t2 * 10 + o2;
    finalAnswer = (num1 - num2).toString();
  } else if (activeVariant === "foundation_algo_add_3_digit_2_digit_no_renaming") {
    let h1 = Math.floor(Math.random() * 9) + 1;
    let t1 = Math.floor(Math.random() * 10);
    let t2 = Math.floor(Math.random() * (10 - t1)); // ensures t1 + t2 < 10
    let o1 = Math.floor(Math.random() * 10);
    let o2 = Math.floor(Math.random() * (10 - o1)); // ensures o1 + o2 < 10
    num1 = h1 * 100 + t1 * 10 + o1;
    num2 = t2 * 10 + o2;
    finalAnswer = (num1 + num2).toString();
  } else if (activeVariant === "foundation_algo_add_3_digit_1_digit_no_renaming") {
    let h1 = Math.floor(Math.random() * 9) + 1;
    let t1 = Math.floor(Math.random() * 10);
    let o1 = Math.floor(Math.random() * 9); // 0-8
    let o2 = Math.floor(Math.random() * (10 - o1 - 1)) + 1; // ensures o1 + o2 < 10, o2 is 1-9
    num1 = h1 * 100 + t1 * 10 + o1;
    num2 = o2;
    finalAnswer = (num1 + num2).toString();
  } else if (activeVariant === "foundation_algo_sub_2_digit_from_3_digit_no_renaming") {
    let h1 = Math.floor(Math.random() * 9) + 1;
    let t1 = Math.floor(Math.random() * 9) + 1; // 1-9
    let t2 = Math.floor(Math.random() * t1) + 1; // 1 to t1
    let o1 = Math.floor(Math.random() * 10);
    let o2 = Math.floor(Math.random() * (o1 + 1)); // 0 to o1
    num1 = h1 * 100 + t1 * 10 + o1;
    num2 = t2 * 10 + o2;
    finalAnswer = (num1 - num2).toString();
  } else if (activeVariant === "foundation_algo_sub_1_digit_from_3_digit_no_renaming") {
    let h1 = Math.floor(Math.random() * 9) + 1;
    let t1 = Math.floor(Math.random() * 10);
    let o1 = Math.floor(Math.random() * 9) + 1; // 1-9
    let o2 = Math.floor(Math.random() * o1) + 1; // 1 to o1
    num1 = h1 * 100 + t1 * 10 + o1;
    num2 = o2;
    finalAnswer = (num1 - num2).toString();
  } else if (activeVariant === "foundation_algo_add_3_digit_multiples_of_10") {
    let h1 = Math.floor(Math.random() * 9) + 1;
    let t1 = Math.floor(Math.random() * 10);
    let o1 = Math.floor(Math.random() * 10);
    num1 = h1 * 100 + t1 * 10 + o1;
    
    // multiple of 10 up to 90
    let t2 = Math.floor(Math.random() * 9) + 1;
    // ensure no renaming for tens if we want to stick strictly to no renaming, but syllabus says "or 2-digit numbers with renaming". Let's do no renaming to be safe for foundation multiples.
    if (t1 + t2 >= 10) {
      t2 = 9 - t1; // clamp it
      if (t2 === 0) t2 = 1;
    }
    num2 = t2 * 10;
    finalAnswer = (num1 + num2).toString();
  }

  let askText = '';
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;

  if (isStructure) {
    // Worded question for Structured
    askText = isAdd 
      ? `${context.name} has ${num1} ${selectedContextItem}. His friend gives him ${num2} more. How many ${selectedContextItem} does he have altogether?`
      : `${context.name} has ${num1} ${selectedContextItem}. He gives away ${num2} ${selectedContextItem}. How many ${selectedContextItem} does he have left?`;
    
    // Inject a multi-step input requirement where step 1 is the equation, and step 2 is the final answer
    const equationStr = isAdd ? `${num1}+${num2}` : `${num1}-${num2}`;
    inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Write out the equation", "expectedAnswer": "${equationStr}" },\n      { "label": "Calculate the final answer", "expectedAnswer": "${finalAnswer}" }\n    ]\n  }`;
  } else {
    // Direct equation for Short Question / MCQ
    askText = isAdd ? `What is ${num1} + ${num2}?` : `What is ${num1} - ${num2}?`;
    
    // Inject the vertical algorithm visual for Short Questions and explicit algorithm variants to give them a distinct UI
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
- The finalAnswer must be EXACTLY: "${finalAnswer}".
- If MCQ, provide 4 options including the correct answer and 3 reasonable distractors. Ensure the correct option matches "${finalAnswer}".

${getFormatInstructions(visualEngineStr, inputRequirementStr)}`;

  return {
    aiPrompt: aiPrompt
  };
}
