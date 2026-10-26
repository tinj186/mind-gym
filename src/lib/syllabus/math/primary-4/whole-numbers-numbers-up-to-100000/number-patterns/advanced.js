export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, explicitVariety = null) {
  let promptInstruction = "";
  let finalAnswer = "";
  let options = [];
  let defectMap = {};
  let displayPattern = [];

  if (!activeVariant || activeVariant === 'advanced_default' || activeVariant === 'default') {
    const defaultVariants = [
      'advanced_alternating_add_sub',
      'advanced_alternating_add_add',
      'advanced_growing_jumps',
      'advanced_large_jumps',
      'advanced_two_missing_terms'
    ];
    activeVariant = defaultVariants[Math.floor(Math.random() * defaultVariants.length)];
  }

  if (activeVariant === 'advanced_alternating_add_sub') {
    const step1Options = [500, 1000, 1500, 2000];
    const step2Options = [-200, -400, -500, -1000];
    const s1 = step1Options[Math.floor(Math.random() * step1Options.length)];
    const s2 = step2Options[Math.floor(Math.random() * step2Options.length)];
    let current = Math.floor(Math.random() * 40 + 20) * 1000; // 20 000 to 60 000
    const pattern = [];
    for (let i = 0; i < 6; i++) {
      pattern.push(current);
      current += (i % 2 === 0 ? s1 : s2);
    }
    const missingIndex = Math.floor(Math.random() * 6);
    const correctNum = pattern[missingIndex];
    finalAnswer = correctNum.toString();

    displayPattern = pattern.map((num, idx) => (idx === missingIndex ? "?" : num.toString()));
    promptInstruction = `- Question stem: "Find the missing number in the number pattern: ${displayPattern.join(', ')}."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const d1 = (correctNum + Math.abs(s1)).toString();
      const d2 = (correctNum - Math.abs(s2)).toString();
      const d3 = (correctNum + 100).toString();
      const set = new Set([finalAnswer, d1, d2, d3]);
      while (set.size < 4) {
        set.add((correctNum + Math.floor(Math.random() * 5 + 1) * 200).toString());
      }
      options = Array.from(set).sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: "WRONG_ALTERNATING_STEP",
        [d2]: "WRONG_ALTERNATING_STEP"
      };
    }
  } else if (activeVariant === 'advanced_alternating_add_add') {
    const s1 = [500, 1000, 1500][Math.floor(Math.random() * 3)];
    const s2 = [1000, 2000, 3000][Math.floor(Math.random() * 3)];
    let current = Math.floor(Math.random() * 30 + 10) * 1000;
    const pattern = [];
    for (let i = 0; i < 6; i++) {
      pattern.push(current);
      current += (i % 2 === 0 ? s1 : s2);
    }
    const missingIndex = Math.floor(Math.random() * 6);
    const correctNum = pattern[missingIndex];
    finalAnswer = correctNum.toString();

    displayPattern = pattern.map((num, idx) => (idx === missingIndex ? "?" : num.toString()));
    promptInstruction = `- Question stem: "Find the missing number in the number pattern: ${displayPattern.join(', ')}."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const d1 = (correctNum + s1).toString();
      const d2 = (correctNum + s2).toString();
      const d3 = (correctNum - s1).toString();
      const set = new Set([finalAnswer, d1, d2, d3]);
      while (set.size < 4) {
        set.add((correctNum + Math.floor(Math.random() * 5 + 1) * 250).toString());
      }
      options = Array.from(set).sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: "USED_WRONG_STEP",
        [d2]: "USED_WRONG_STEP"
      };
    }
  } else if (activeVariant === 'advanced_growing_jumps') {
    const baseStep = [200, 500, 1000][Math.floor(Math.random() * 3)];
    let current = Math.floor(Math.random() * 30 + 10) * 1000;
    const pattern = [];
    for (let i = 0; i < 5; i++) {
      pattern.push(current);
      current += baseStep * (i + 1);
    }
    const missingIndex = Math.floor(Math.random() * 5);
    const correctNum = pattern[missingIndex];
    finalAnswer = correctNum.toString();

    displayPattern = pattern.map((num, idx) => (idx === missingIndex ? "?" : num.toString()));
    promptInstruction = `- Question stem: "Find the missing number in the number pattern: ${displayPattern.join(', ')}."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const d1 = (correctNum + baseStep).toString();
      const d2 = (correctNum - baseStep).toString();
      const d3 = (correctNum + (baseStep * 2)).toString();
      const set = new Set([finalAnswer, d1, d2, d3]);
      while (set.size < 4) {
        set.add((correctNum + Math.floor(Math.random() * 4 + 1) * 300).toString());
      }
      options = Array.from(set).sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: "CONSTANT_STEP_ASSUMPTION",
        [d2]: "CONSTANT_STEP_ASSUMPTION"
      };
    }
  } else if (activeVariant === 'advanced_large_jumps') {
    const jumpOptions = [1250, 1500, 2500, 3500, 5000];
    const jump = jumpOptions[Math.floor(Math.random() * jumpOptions.length)];
    const sign = Math.random() < 0.5 ? 1 : -1;
    const step = jump * sign;
    let start = sign === 1 ? Math.floor(Math.random() * 30 + 10) * 1000 : Math.floor(Math.random() * 30 + 60) * 1000;
    const pattern = [];
    for (let i = 0; i < 5; i++) {
      pattern.push(start + (i * step));
    }
    const missingIndex = Math.floor(Math.random() * 5);
    const correctNum = pattern[missingIndex];
    finalAnswer = correctNum.toString();

    displayPattern = pattern.map((num, idx) => (idx === missingIndex ? "?" : num.toString()));
    promptInstruction = `- Question stem: "Find the missing number in the number pattern: ${displayPattern.join(', ')}."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const d1 = (correctNum + step).toString();
      const d2 = (correctNum - step).toString();
      const d3 = (correctNum + 1000).toString();
      const set = new Set([finalAnswer, d1, d2, d3]);
      while (set.size < 4) {
        set.add((correctNum + Math.floor(Math.random() * 5 + 1) * 500).toString());
      }
      options = Array.from(set).sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: "OFF_BY_ONE_STEP",
        [d2]: "OFF_BY_ONE_STEP"
      };
    }
  } else {
    // advanced_two_missing_terms: Pattern has A at index 1, B at index 4, asks for A + B
    const stepOptions = [500, 1000, 1500, 2000, 2500, 3000];
    const step = stepOptions[Math.floor(Math.random() * stepOptions.length)];
    const start = Math.floor(Math.random() * 30 + 10) * 1000;
    const term0 = start;
    const termA = start + step;
    const term2 = start + (2 * step);
    const term3 = start + (3 * step);
    const termB = start + (4 * step);
    const term5 = start + (5 * step);

    const sumAB = termA + termB;
    finalAnswer = sumAB.toString();

    displayPattern = [
      term0.toString(),
      "A",
      term2.toString(),
      term3.toString(),
      "B",
      term5.toString()
    ];

    promptInstruction = `- Question stem: "In the number pattern below, find the value of A + B.\\n${displayPattern.join(', ')}"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const d1 = (sumAB + step).toString();
      const d2 = (sumAB - step).toString();
      const d3 = (termB - termA).toString();
      const set = new Set([finalAnswer, d1, d2, d3]);
      while (set.size < 4) {
        set.add((sumAB + Math.floor(Math.random() * 5 + 1) * 1000).toString());
      }
      options = Array.from(set).sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: "OFF_BY_ONE_STEP",
        [d2]: "OFF_BY_ONE_STEP",
        [d3]: "SUBTRACTED_INSTEAD_OF_ADDED"
      };
    }
  }

  const itemsJson = displayPattern.map(item => `"${item}"`).join(', ');
  const visualEngineStr = `{\n    "componentToRender": "NUMBER_PATTERN",\n    "componentData": {\n      "items": [${itemsJson}]\n    }\n  }`;

  const inputRequirementStr = isStructure ? `{\n    "inputType": "MULTI_STEP_INPUT"\n  }` : null;
  const mcqInstruction = isMCQ ? `- Generate EXACTLY 4 options: ${JSON.stringify(options)}.\\n- Set defectMap to: ${JSON.stringify(defectMap)}.` : "";

  const aiPrompt = `You are an expert Singapore Primary 4 Math educator.
Generate an advanced-level question for Singapore Primary 4 students.
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
