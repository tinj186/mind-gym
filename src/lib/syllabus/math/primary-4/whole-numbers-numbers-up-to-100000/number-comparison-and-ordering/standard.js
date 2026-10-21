export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions) {
  let numbers = [];
  let askType = ""; // "smallest" or "greatest"
  let promptInstruction = "";
  let finalAnswer = "";
  let options = [];
  let defectMap = {};

  if (!activeVariant || activeVariant === 'standard_default' || activeVariant === 'default') {
    const defaultVariants = [
      'standard_order_asc_diff_ten_thousands',
      'standard_order_desc_diff_ten_thousands',
      'standard_order_asc_same_ten_thousands',
      'standard_order_desc_same_ten_thousands',
      'standard_order_mixed_digits'
    ];
    activeVariant = defaultVariants[Math.floor(Math.random() * defaultVariants.length)];
  }

  if (activeVariant.includes("asc")) {
    askType = "smallest";
  } else if (activeVariant.includes("desc")) {
    askType = "greatest";
  } else {
    askType = Math.random() < 0.5 ? "smallest" : "greatest";
  }

  if (activeVariant === "standard_order_asc_diff_ten_thousands" || activeVariant === "standard_order_desc_diff_ten_thousands") {
    let tenThousands = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5).slice(0, 4);
    for (let i = 0; i < 4; i++) {
      let th = Math.floor(Math.random() * 10);
      let h = Math.floor(Math.random() * 10);
      let t = Math.floor(Math.random() * 10);
      let o = Math.floor(Math.random() * 10);
      numbers.push(tenThousands[i] * 10000 + th * 1000 + h * 100 + t * 10 + o);
    }
  } else if (activeVariant === "standard_order_asc_same_ten_thousands" || activeVariant === "standard_order_desc_same_ten_thousands") {
    let tth = Math.floor(Math.random() * 9) + 1;
    let thousands = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5).slice(0, 4);
    for (let i = 0; i < 4; i++) {
      let h = Math.floor(Math.random() * 10);
      let t = Math.floor(Math.random() * 10);
      let o = Math.floor(Math.random() * 10);
      numbers.push(tth * 10000 + thousands[i] * 1000 + h * 100 + t * 10 + o);
    }
  } else {
    // standard_order_mixed_digits: 2 four-digit and 2 five-digit numbers
    while (numbers.length < 2) {
      let n = Math.floor(Math.random() * 9000) + 1000;
      if (!numbers.includes(n)) numbers.push(n);
    }
    while (numbers.length < 4) {
      let n = Math.floor(Math.random() * 80000) + 10000;
      if (!numbers.includes(n)) numbers.push(n);
    }
  }

  const sortedNumbers = [...numbers].sort((a, b) => askType === "smallest" ? a - b : b - a);
  finalAnswer = sortedNumbers.join(", ");

  const presentedNumbers = [...numbers].sort(() => Math.random() - 0.5);
  const visualEngineStr = `{\n    "componentToRender": "NUMBER_CARDS",\n    "componentData": {\n      "items": ["${presentedNumbers[0]}", "${presentedNumbers[1]}", "${presentedNumbers[2]}", "${presentedNumbers[3]}"]\n    }\n  }`;

  promptInstruction = `- Question stem: "Arrange the numbers in order. Begin with the ${askType}."\\n- The numbers are: ${presentedNumbers.join(', ')}.\\n- The finalAnswer must be strictly "${finalAnswer}".`;

  if (isMCQ) {
    const reverseOrder = [...numbers].sort((a, b) => askType === "smallest" ? b - a : a - b).join(", ");
    const swappedFirstTwo = [...sortedNumbers];
    [swappedFirstTwo[0], swappedFirstTwo[1]] = [swappedFirstTwo[1], swappedFirstTwo[0]];
    const d2 = swappedFirstTwo.join(", ");
    const swappedLastTwo = [...sortedNumbers];
    [swappedLastTwo[2], swappedLastTwo[3]] = [swappedLastTwo[3], swappedLastTwo[2]];
    const d3 = swappedLastTwo.join(", ");

    options = [finalAnswer, reverseOrder, d2, d3].sort(() => Math.random() - 0.5);
    defectMap = {
      [reverseOrder]: askType === "smallest" ? "REVERSE_ORDER_GREATEST" : "REVERSE_ORDER_SMALLEST",
      [d2]: "PARTIAL_SORT_ERROR"
    };
  }

  const inputRequirementStr = isStructure ? `{\n    "inputType": "MULTI_STEP_INPUT"\n  }` : null;
  const mcqInstruction = isMCQ ? `- Generate EXACTLY 4 options: ${JSON.stringify(options)}.\\n- Set defectMap to: ${JSON.stringify(defectMap)}.` : "";

  const aiPrompt = `You are an expert Singapore Primary 4 Math educator.
Generate a standard-level question for Singapore Primary 4 students.
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
