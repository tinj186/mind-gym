export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions) {
  let step = 0;
  let missingIndex = Math.floor(Math.random() * 5); // 0 to 4
  let start = 0;
  let promptInstruction = "";
  let finalAnswer = "";
  let options = [];
  let defectMap = {};

  if (!activeVariant || activeVariant === 'foundation_default' || activeVariant === 'default') {
    const defaultVariants = [
      'foundation_add_10',
      'foundation_subtract_10',
      'foundation_add_100',
      'foundation_subtract_100',
      'foundation_add_1000',
      'foundation_subtract_1000',
      'foundation_add_10000',
      'foundation_subtract_10000'
    ];
    activeVariant = defaultVariants[Math.floor(Math.random() * defaultVariants.length)];
  }

  if (activeVariant === 'foundation_add_10') {
    step = 10;
    const tth = Math.floor(Math.random() * 8) + 1; // 1 to 8
    const th = Math.floor(Math.random() * 10);
    const h = Math.floor(Math.random() * 10);
    const t = Math.floor(Math.random() * 5); // 0 to 4 (so +40 won't cross hundreds)
    const o = Math.floor(Math.random() * 10);
    start = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;
  } else if (activeVariant === 'foundation_subtract_10') {
    step = -10;
    const tth = Math.floor(Math.random() * 8) + 1;
    const th = Math.floor(Math.random() * 10);
    const h = Math.floor(Math.random() * 10);
    const t = Math.floor(Math.random() * 5) + 4; // 4 to 8 (so -40 won't cross hundreds)
    const o = Math.floor(Math.random() * 10);
    start = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;
  } else if (activeVariant === 'foundation_add_100') {
    step = 100;
    const tth = Math.floor(Math.random() * 8) + 1;
    const th = Math.floor(Math.random() * 10);
    const h = Math.floor(Math.random() * 5); // 0 to 4
    const t = Math.floor(Math.random() * 10);
    const o = Math.floor(Math.random() * 10);
    start = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;
  } else if (activeVariant === 'foundation_subtract_100') {
    step = -100;
    const tth = Math.floor(Math.random() * 8) + 1;
    const th = Math.floor(Math.random() * 10);
    const h = Math.floor(Math.random() * 5) + 4; // 4 to 8
    const t = Math.floor(Math.random() * 10);
    const o = Math.floor(Math.random() * 10);
    start = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;
  } else if (activeVariant === 'foundation_add_1000') {
    step = 1000;
    const tth = Math.floor(Math.random() * 8) + 1;
    const th = Math.floor(Math.random() * 5); // 0 to 4
    const h = Math.floor(Math.random() * 10);
    const t = Math.floor(Math.random() * 10);
    const o = Math.floor(Math.random() * 10);
    start = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;
  } else if (activeVariant === 'foundation_subtract_1000') {
    step = -1000;
    const tth = Math.floor(Math.random() * 8) + 1;
    const th = Math.floor(Math.random() * 5) + 4; // 4 to 8
    const h = Math.floor(Math.random() * 10);
    const t = Math.floor(Math.random() * 10);
    const o = Math.floor(Math.random() * 10);
    start = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;
  } else if (activeVariant === 'foundation_add_10000') {
    step = 10000;
    const tth = Math.floor(Math.random() * 5) + 1; // 1 to 5
    const th = Math.floor(Math.random() * 10);
    const h = Math.floor(Math.random() * 10);
    const t = Math.floor(Math.random() * 10);
    const o = Math.floor(Math.random() * 10);
    start = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;
  } else {
    // foundation_subtract_10000
    step = -10000;
    const tth = Math.floor(Math.random() * 4) + 6; // 6 to 9
    const th = Math.floor(Math.random() * 10);
    const h = Math.floor(Math.random() * 10);
    const t = Math.floor(Math.random() * 10);
    const o = Math.floor(Math.random() * 10);
    start = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;
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
    const d3 = (correctNum + (Math.abs(step) >= 1000 ? 100 : 10)).toString();
    const set = new Set([finalAnswer, d1, d2, d3]);
    while (set.size < 4) {
      set.add((correctNum + Math.floor(Math.random() * 5 + 1) * 100).toString());
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
Generate a foundation-level question for Singapore Primary 4 students.
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
