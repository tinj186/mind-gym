export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions) {
  let step = 0;
  let missingIndex = Math.floor(Math.random() * 5); // 0 to 4
  let start = 0;
  let promptInstruction = "";
  let finalAnswer = "";
  let options = [];
  let defectMap = {};

  if (!activeVariant || activeVariant === 'standard_default' || activeVariant === 'default') {
    const defaultVariants = [
      'standard_add_cross_thousands',
      'standard_subtract_cross_thousands',
      'standard_add_cross_ten_thousands',
      'standard_subtract_cross_ten_thousands',
      'standard_reach_100000'
    ];
    activeVariant = defaultVariants[Math.floor(Math.random() * defaultVariants.length)];
  }

  if (activeVariant === 'standard_add_cross_thousands') {
    // e.g. steps: 20, 25, 50, 100 crossing thousands
    const stepOptions = [20, 25, 50, 100];
    step = stepOptions[Math.floor(Math.random() * stepOptions.length)];
    const tth = Math.floor(Math.random() * 8) + 1; // 1 to 8
    const th = Math.floor(Math.random() * 9); // 0 to 8
    // start slightly below the next thousand: e.g. th*1000 + 1000 - (2 * step)
    const baseThousand = (tth * 10000) + ((th + 1) * 1000);
    // start at baseThousand - 2 * step (so pattern indices 0, 1 are before, 2, 3, 4 are after baseThousand)
    start = baseThousand - (2 * step);
  } else if (activeVariant === 'standard_subtract_cross_thousands') {
    const stepOptions = [-20, -25, -50, -100];
    step = stepOptions[Math.floor(Math.random() * stepOptions.length)];
    const tth = Math.floor(Math.random() * 8) + 1;
    const th = Math.floor(Math.random() * 8) + 1; // 1 to 9
    const baseThousand = (tth * 10000) + (th * 1000);
    start = baseThousand + (2 * Math.abs(step));
  } else if (activeVariant === 'standard_add_cross_ten_thousands') {
    // e.g. steps: 100, 200, 500, 1000 crossing ten-thousands
    const stepOptions = [100, 200, 500, 1000];
    step = stepOptions[Math.floor(Math.random() * stepOptions.length)];
    const tth = Math.floor(Math.random() * 8) + 1; // 1 to 8
    const baseTenThousand = (tth + 1) * 10000;
    start = baseTenThousand - (2 * step);
  } else if (activeVariant === 'standard_subtract_cross_ten_thousands') {
    const stepOptions = [-100, -200, -500, -1000];
    step = stepOptions[Math.floor(Math.random() * stepOptions.length)];
    const tth = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const baseTenThousand = tth * 10000;
    start = baseTenThousand + (2 * Math.abs(step));
  } else {
    // standard_reach_100000 (approaching 100,000)
    const stepOptions = [500, 1000, 2000];
    step = stepOptions[Math.floor(Math.random() * stepOptions.length)];
    start = 100000 - (4 * step);
  }

  const pattern = [];
  for (let i = 0; i < 5; i++) {
    pattern.push(start + (i * step));
  }

  const correctNum = pattern[missingIndex];
  finalAnswer = correctNum.toString();

  const displayPattern = [...pattern];
  displayPattern[missingIndex] = "?";

  const visualEngineStr = `{\n    "componentToRender": "NUMBER_PATTERN",\n    "componentData": {\n      "items": ["${displayPattern[0]}", "${displayPattern[1]}", "${displayPattern[2]}", "${displayPattern[3]}", "${displayPattern[4]}"]\n    }\n  }`;

  promptInstruction = `- Question stem: "Find the missing number in the number pattern: ${displayPattern.join(', ')}."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

  if (isMCQ) {
    const d1 = (correctNum + step).toString();
    const d2 = (correctNum - step).toString();
    const d3 = (correctNum + (Math.abs(step) >= 1000 ? 100 : Math.abs(step) >= 100 ? 10 : 5)).toString();
    const set = new Set([finalAnswer, d1, d2, d3]);
    while (set.size < 4) {
      set.add((correctNum + Math.floor(Math.random() * 5 + 1) * 50).toString());
    }
    options = Array.from(set).sort(() => Math.random() - 0.5);
    defectMap = {
      [d1]: "OFF_BY_ONE_STEP",
      [d2]: "OFF_BY_ONE_STEP"
    };
  }

  const inputRequirementStr = isStructure ? `{\n    "inputType": "MULTI_STEP_INPUT"\n  }` : null;
  const mcqInstruction = isMCQ ? `- Generate EXACTLY 4 options: ${JSON.stringify(options)}.\\n- Set defectMap to: ${JSON.stringify(defectMap)}.` : "";

  const aiPrompt = `You are an expert Singapore Primary 4 Math educator.
Generate a standard-level question for Singapore Primary 4 students.
Topic: Whole Numbers - Numbers up to 100 000
Subtopic: Number Patterns
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
