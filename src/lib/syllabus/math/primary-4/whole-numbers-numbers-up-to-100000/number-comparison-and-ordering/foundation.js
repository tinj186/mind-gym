export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions) {
  let promptInstruction = "";
  let finalAnswer = "";
  let options = [];
  let defectMap = {};

  // Normalize variant key and support legacy variant aliases
  const knownVariants = [
    'foundation_compare_two_numbers',
    'foundation_compare_greater_ten_thousands',
    'foundation_compare_smaller_ten_thousands',
    'foundation_compare_greater_thousands',
    'foundation_compare_smaller_thousands',
    'foundation_compare_hundreds_tens'
  ];
  if (!activeVariant || activeVariant === 'foundation_default' || activeVariant === 'default' || knownVariants.includes(activeVariant)) {
    activeVariant = 'foundation_compare_two_numbers';
  }

  // 1. Select place-value comparison category (Variety across 5 depth levels)
  const categoryChoice = Math.floor(Math.random() * 5);
  let num1 = 0;
  let num2 = 0;
  let diffPlaceName = "";
  let stepExplanation = "";

  if (categoryChoice === 0) {
    // Category 0: Different ten thousands digits
    diffPlaceName = "ten thousands";
    const tth1 = Math.floor(Math.random() * 9) + 1;
    let tth2 = Math.floor(Math.random() * 9) + 1;
    while (tth2 === tth1) tth2 = Math.floor(Math.random() * 9) + 1;
    num1 = tth1 * 10000 + Math.floor(Math.random() * 10000);
    num2 = tth2 * 10000 + Math.floor(Math.random() * 10000);
    const maxTth = Math.max(tth1, tth2);
    const minTth = Math.min(tth1, tth2);
    stepExplanation = `Compare the ten thousands digits: ${maxTth} ten thousands is greater than ${minTth} ten thousands.`;
  } else if (categoryChoice === 1) {
    // Category 1: Same ten thousands, different thousands digits
    diffPlaceName = "thousands";
    const tth = Math.floor(Math.random() * 9) + 1;
    const th1 = Math.floor(Math.random() * 10);
    let th2 = Math.floor(Math.random() * 10);
    while (th2 === th1) th2 = Math.floor(Math.random() * 10);
    num1 = tth * 10000 + th1 * 1000 + Math.floor(Math.random() * 1000);
    num2 = tth * 10000 + th2 * 1000 + Math.floor(Math.random() * 1000);
    const maxTh = Math.max(th1, th2);
    const minTh = Math.min(th1, th2);
    stepExplanation = `Both numbers have the same ten thousands digit (${tth}). Compare the thousands digits: ${maxTh} thousands is greater than ${minTh} thousands.`;
  } else if (categoryChoice === 2) {
    // Category 2: Same ten thousands and thousands, different hundreds digits
    diffPlaceName = "hundreds";
    const tth = Math.floor(Math.random() * 9) + 1;
    const th = Math.floor(Math.random() * 10);
    const h1 = Math.floor(Math.random() * 10);
    let h2 = Math.floor(Math.random() * 10);
    while (h2 === h1) h2 = Math.floor(Math.random() * 10);
    num1 = tth * 10000 + th * 1000 + h1 * 100 + Math.floor(Math.random() * 100);
    num2 = tth * 10000 + th * 1000 + h2 * 100 + Math.floor(Math.random() * 100);
    const maxH = Math.max(h1, h2);
    const minH = Math.min(h1, h2);
    stepExplanation = `Both numbers have the same ten thousands (${tth}) and thousands (${th}) digits. Compare the hundreds digits: ${maxH} hundreds is greater than ${minH} hundreds.`;
  } else if (categoryChoice === 3) {
    // Category 3: Same digits up to hundreds, different tens digits
    diffPlaceName = "tens";
    const tth = Math.floor(Math.random() * 9) + 1;
    const th = Math.floor(Math.random() * 10);
    const h = Math.floor(Math.random() * 10);
    const t1 = Math.floor(Math.random() * 10);
    let t2 = Math.floor(Math.random() * 10);
    while (t2 === t1) t2 = Math.floor(Math.random() * 10);
    const o1 = Math.floor(Math.random() * 10);
    const o2 = Math.floor(Math.random() * 10);
    num1 = tth * 10000 + th * 1000 + h * 100 + t1 * 10 + o1;
    num2 = tth * 10000 + th * 1000 + h * 100 + t2 * 10 + o2;
    const maxT = Math.max(t1, t2);
    const minT = Math.min(t1, t2);
    stepExplanation = `Both numbers have identical digits in the ten thousands, thousands, and hundreds places. Compare the tens digits: ${maxT} tens is greater than ${minT} tens.`;
  } else {
    // Category 4: Different number of digits (5-digit vs 4-digit)
    diffPlaceName = "ten thousands";
    num1 = Math.floor(Math.random() * 90000) + 10000; // 5-digit number
    num2 = Math.floor(Math.random() * 9000) + 1000;   // 4-digit number
    stepExplanation = `Compare the number of digits: ${Math.max(num1, num2)} is a 5-digit number, while ${Math.min(num1, num2)} is a 4-digit number. A 5-digit number is always greater than a 4-digit number.`;
  }

  const askType = Math.random() < 0.5 ? "greater" : "smaller";
  const isGreater = askType === "greater";
  const presentedNumbers = Math.random() < 0.5 ? [num1, num2] : [num2, num1];
  const greaterNum = Math.max(num1, num2);
  const smallerNum = Math.min(num1, num2);
  const targetNum = isGreater ? greaterNum : smallerNum;
  const otherNum = isGreater ? smallerNum : greaterNum;

  const visualEngineStr = `{\n    "componentToRender": "NUMBER_CARDS",\n    "componentData": {\n      "items": ["${presentedNumbers[0]}", "${presentedNumbers[1]}"]\n    }\n  }`;

  let inputRequirementStr = null;

  if (isMCQ) {
    const mcqSubtype = Math.floor(Math.random() * 3);
    if (mcqSubtype === 0) {
      // Subtype 0: Statement evaluation
      const correctStmt = `${greaterNum} is greater than ${smallerNum}`;
      const wrongStmt1 = `${smallerNum} is greater than ${greaterNum}`;
      const wrongStmt2 = `${greaterNum} is smaller than ${smallerNum}`;
      const wrongStmt3 = `${presentedNumbers[0]} is equal to ${presentedNumbers[1]}`;

      finalAnswer = correctStmt;
      options = [correctStmt, wrongStmt1, wrongStmt2, wrongStmt3].sort(() => Math.random() - 0.5);
      defectMap = {
        [wrongStmt1]: "OPPOSITE_CONDITION_GREATER",
        [wrongStmt2]: "OPPOSITE_CONDITION_SMALLER",
        [wrongStmt3]: "CONSTANT_VIOLATION"
      };
      promptInstruction = `- Question stem: "Look at the two numbers: ${presentedNumbers[0]} and ${presentedNumbers[1]}. Which statement is correct?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;
    } else if (mcqSubtype === 1) {
      // Subtype 1: Symbol sentence
      const symbolAnswer = presentedNumbers[0] > presentedNumbers[1] ? ">" : "<";
      const wrongSymbol = presentedNumbers[0] > presentedNumbers[1] ? "<" : ">";
      finalAnswer = symbolAnswer;
      options = [">", "<", "=", "None of the above"];
      defectMap = {
        [wrongSymbol]: "REVERSED_INEQUALITY",
        "=": "CONSTANT_VIOLATION",
        "None of the above": "MISREAD_QUESTION"
      };
      promptInstruction = `- Question stem: "Which symbol correctly completes the number sentence?\\n${presentedNumbers[0]} [ ? ] ${presentedNumbers[1]}"\\n- The finalAnswer must be strictly "${finalAnswer}".`;
    } else {
      // Subtype 2: Direct number selection
      finalAnswer = targetNum.toString();
      const d1 = otherNum.toString();
      const d2 = "Both numbers are equal";
      const d3 = "Cannot be determined";
      options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: isGreater ? "OPPOSITE_CONDITION_SMALLER" : "OPPOSITE_CONDITION_GREATER",
        [d2]: "CONSTANT_VIOLATION",
        [d3]: "MISREAD_QUESTION"
      };
      promptInstruction = `- Question stem: "Which number is ${askType}, ${presentedNumbers[0]} or ${presentedNumbers[1]}?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;
    }
  } else if (isStructure) {
    finalAnswer = targetNum.toString();
    inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      {\n        "label": "Which place value has different digits that determine which number is greater? (ten thousands, thousands, hundreds, tens, ones)",\n        "expectedAnswer": "${diffPlaceName}"\n      },\n      {\n        "label": "Which number is ${askType}?",\n        "expectedAnswer": "${finalAnswer}"\n      }\n    ]\n  }`;
    promptInstruction = `- Question stem: "Compare the two numbers: ${presentedNumbers[0]} and ${presentedNumbers[1]}. Which number is ${askType}?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;
  } else {
    // Short question
    const shortSubtype = Math.floor(Math.random() * 2);
    if (shortSubtype === 0) {
      finalAnswer = targetNum.toString();
      promptInstruction = `- Question stem: "Which number is ${askType}, ${presentedNumbers[0]} or ${presentedNumbers[1]}?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;
    } else {
      finalAnswer = presentedNumbers[0] > presentedNumbers[1] ? ">" : "<";
      promptInstruction = `- Question stem: "Write > or < in the blank to make the statement true:\\n${presentedNumbers[0]} _____ ${presentedNumbers[1]}"\\n- The finalAnswer must be strictly "${finalAnswer}".`;
    }
  }

  const mcqInstruction = isMCQ ? `- Generate EXACTLY 4 options: ${JSON.stringify(options)}.\\n- Set defectMap to: ${JSON.stringify(defectMap)}.` : "";

  const aiPrompt = `You are an expert Singapore Primary 4 Math educator.
Generate a foundation-level question for Singapore Primary 4 students.
Topic: Whole Numbers - Numbers up to 100 000
Subtopic: Number Comparison and Ordering
Difficulty: ${zodDiff}
Type: ${zodType}

CRITICAL INSTRUCTIONS:
1. ${promptInstruction}
2. The finalAnswer must be strictly "${finalAnswer}".
${mcqInstruction}
3. Solution explanation guide:
   Step 1: Compare ${presentedNumbers[0]} and ${presentedNumbers[1]} from left to right starting from the highest place value.
   Step 2: ${stepExplanation}
   Step 3: Conclude that ${greaterNum} > ${smallerNum}, so the ${askType} number is ${targetNum}.
   (Separate solution steps using \\n).
4. Hint: "Compare the digits starting from the highest place value (the leftmost digit). The first digit from the left that is different tells you which number is greater or smaller!"
5. Forbid using "STORY:" or any instructional prefix in the output.

${getFormatInstructions(visualEngineStr, inputRequirementStr)}`;

  return { aiPrompt };
}
