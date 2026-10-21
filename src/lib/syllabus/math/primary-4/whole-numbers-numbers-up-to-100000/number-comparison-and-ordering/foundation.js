export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions) {
  let num1 = 0;
  let num2 = 0;
  let askType = ""; // "greater" or "smaller"
  let promptInstruction = "";
  let finalAnswer = "";
  let options = [];
  let defectMap = {};

  if (!activeVariant || activeVariant === 'foundation_default' || activeVariant === 'default') {
    const defaultVariants = [
      'foundation_compare_greater_ten_thousands',
      'foundation_compare_smaller_ten_thousands',
      'foundation_compare_greater_thousands',
      'foundation_compare_smaller_thousands',
      'foundation_compare_hundreds_tens'
    ];
    activeVariant = defaultVariants[Math.floor(Math.random() * defaultVariants.length)];
  }

  if (activeVariant === 'foundation_compare_greater_ten_thousands') {
    const tth1 = Math.floor(Math.random() * 9) + 1;
    let tth2 = Math.floor(Math.random() * 9) + 1;
    while (tth2 === tth1) tth2 = Math.floor(Math.random() * 9) + 1;
    num1 = tth1 * 10000 + Math.floor(Math.random() * 10000);
    num2 = tth2 * 10000 + Math.floor(Math.random() * 10000);
    askType = "greater";
  } else if (activeVariant === 'foundation_compare_smaller_ten_thousands') {
    const tth1 = Math.floor(Math.random() * 9) + 1;
    let tth2 = Math.floor(Math.random() * 9) + 1;
    while (tth2 === tth1) tth2 = Math.floor(Math.random() * 9) + 1;
    num1 = tth1 * 10000 + Math.floor(Math.random() * 10000);
    num2 = tth2 * 10000 + Math.floor(Math.random() * 10000);
    askType = "smaller";
  } else if (activeVariant === 'foundation_compare_greater_thousands') {
    const tth = Math.floor(Math.random() * 9) + 1;
    const th1 = Math.floor(Math.random() * 10);
    let th2 = Math.floor(Math.random() * 10);
    while (th2 === th1) th2 = Math.floor(Math.random() * 10);
    num1 = tth * 10000 + th1 * 1000 + Math.floor(Math.random() * 1000);
    num2 = tth * 10000 + th2 * 1000 + Math.floor(Math.random() * 1000);
    askType = "greater";
  } else if (activeVariant === 'foundation_compare_smaller_thousands') {
    const tth = Math.floor(Math.random() * 9) + 1;
    const th1 = Math.floor(Math.random() * 10);
    let th2 = Math.floor(Math.random() * 10);
    while (th2 === th1) th2 = Math.floor(Math.random() * 10);
    num1 = tth * 10000 + th1 * 1000 + Math.floor(Math.random() * 1000);
    num2 = tth * 10000 + th2 * 1000 + Math.floor(Math.random() * 1000);
    askType = "smaller";
  } else {
    // foundation_compare_hundreds_tens
    const tth = Math.floor(Math.random() * 9) + 1;
    const th = Math.floor(Math.random() * 10);
    const h1 = Math.floor(Math.random() * 10);
    let h2 = Math.floor(Math.random() * 10);
    while (h2 === h1) h2 = Math.floor(Math.random() * 10);
    num1 = tth * 10000 + th * 1000 + h1 * 100 + Math.floor(Math.random() * 100);
    num2 = tth * 10000 + th * 1000 + h2 * 100 + Math.floor(Math.random() * 100);
    askType = Math.random() < 0.5 ? "greater" : "smaller";
  }

  const presentedNumbers = Math.random() < 0.5 ? [num1, num2] : [num2, num1];
  const finalNum = askType === "greater" ? Math.max(num1, num2) : Math.min(num1, num2);
  const otherNum = askType === "greater" ? Math.min(num1, num2) : Math.max(num1, num2);
  finalAnswer = finalNum.toString();

  const visualEngineStr = `{\n    "componentToRender": "NUMBER_CARDS",\n    "componentData": {\n      "items": ["${presentedNumbers[0]}", "${presentedNumbers[1]}"]\n    }\n  }`;

  promptInstruction = `- Question stem: "Which number is ${askType}, ${presentedNumbers[0]} or ${presentedNumbers[1]}?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

  if (isMCQ) {
    const d1 = otherNum.toString();
    const d2 = (finalNum + 100).toString();
    const d3 = (finalNum - 100).toString();
    options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
    defectMap = {
      [d1]: askType === "greater" ? "OPPOSITE_CONDITION_SMALLER" : "OPPOSITE_CONDITION_GREATER"
    };
  }

  const inputRequirementStr = isStructure ? `{\n    "inputType": "MULTI_STEP_INPUT"\n  }` : null;
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
3. Provide step-by-step solution steps separated by \\n and an encouraging conceptual hint.
4. Forbid using "STORY:" or any instructional prefix in the output.

${getFormatInstructions(visualEngineStr, inputRequirementStr)}`;

  return { aiPrompt };
}
