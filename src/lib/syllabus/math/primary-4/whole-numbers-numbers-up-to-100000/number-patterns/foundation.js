export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, explicitVariety = null) {
  let promptInstruction = "";
  let finalAnswer = "";
  let options = [];
  let defectMap = {};

  const VARIETIES = [
    'add_10',
    'subtract_10',
    'add_100',
    'subtract_100',
    'add_1000',
    'subtract_1000',
    'add_10000',
    'subtract_10000'
  ];

  const legacyMap = {
    foundation_add_10: 'add_10',
    foundation_subtract_10: 'subtract_10',
    foundation_add_100: 'add_100',
    foundation_subtract_100: 'subtract_100',
    foundation_add_1000: 'add_1000',
    foundation_subtract_1000: 'subtract_1000',
    foundation_add_10000: 'add_10000',
    foundation_subtract_10000: 'subtract_10000'
  };

  let chosenVariety = explicitVariety;
  if (!chosenVariety && activeVariant) {
    if (legacyMap[activeVariant]) {
      chosenVariety = legacyMap[activeVariant];
    } else if (VARIETIES.includes(activeVariant)) {
      chosenVariety = activeVariant;
    }
  }

  if (!chosenVariety || !VARIETIES.includes(chosenVariety)) {
    chosenVariety = VARIETIES[Math.floor(Math.random() * VARIETIES.length)];
  }

  let step = 0;
  let start = 0;
  let ruleDesc = "";

  if (chosenVariety === 'add_10') {
    step = 10;
    const tth = Math.floor(Math.random() * 8) + 1; // 1 to 8
    const th = Math.floor(Math.random() * 10);
    const h = Math.floor(Math.random() * 10);
    const t = Math.floor(Math.random() * 5); // 0 to 4 (so +40 won't cross hundreds)
    const o = Math.floor(Math.random() * 10);
    start = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;
    ruleDesc = "adding 10 to each number (+10)";
  } else if (chosenVariety === 'subtract_10') {
    step = -10;
    const tth = Math.floor(Math.random() * 8) + 1;
    const th = Math.floor(Math.random() * 10);
    const h = Math.floor(Math.random() * 10);
    const t = Math.floor(Math.random() * 5) + 4; // 4 to 8 (so -40 won't cross hundreds)
    const o = Math.floor(Math.random() * 10);
    start = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;
    ruleDesc = "subtracting 10 from each number (-10)";
  } else if (chosenVariety === 'add_100') {
    step = 100;
    const tth = Math.floor(Math.random() * 8) + 1;
    const th = Math.floor(Math.random() * 10);
    const h = Math.floor(Math.random() * 5); // 0 to 4
    const t = Math.floor(Math.random() * 10);
    const o = Math.floor(Math.random() * 10);
    start = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;
    ruleDesc = "adding 100 to each number (+100)";
  } else if (chosenVariety === 'subtract_100') {
    step = -100;
    const tth = Math.floor(Math.random() * 8) + 1;
    const th = Math.floor(Math.random() * 10);
    const h = Math.floor(Math.random() * 5) + 4; // 4 to 8
    const t = Math.floor(Math.random() * 10);
    const o = Math.floor(Math.random() * 10);
    start = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;
    ruleDesc = "subtracting 100 from each number (-100)";
  } else if (chosenVariety === 'add_1000') {
    step = 1000;
    const tth = Math.floor(Math.random() * 8) + 1;
    const th = Math.floor(Math.random() * 5); // 0 to 4
    const h = Math.floor(Math.random() * 10);
    const t = Math.floor(Math.random() * 10);
    const o = Math.floor(Math.random() * 10);
    start = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;
    ruleDesc = "adding 1000 to each number (+1000)";
  } else if (chosenVariety === 'subtract_1000') {
    step = -1000;
    const tth = Math.floor(Math.random() * 8) + 1;
    const th = Math.floor(Math.random() * 5) + 4; // 4 to 8
    const h = Math.floor(Math.random() * 10);
    const t = Math.floor(Math.random() * 10);
    const o = Math.floor(Math.random() * 10);
    start = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;
    ruleDesc = "subtracting 1000 from each number (-1000)";
  } else if (chosenVariety === 'add_10000') {
    step = 10000;
    const tth = Math.floor(Math.random() * 5) + 1; // 1 to 5
    const th = Math.floor(Math.random() * 10);
    const h = Math.floor(Math.random() * 10);
    const t = Math.floor(Math.random() * 10);
    const o = Math.floor(Math.random() * 10);
    start = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;
    ruleDesc = "adding 10 000 to each number (+10 000)";
  } else {
    // subtract_10000
    step = -10000;
    const tth = Math.floor(Math.random() * 4) + 6; // 6 to 9
    const th = Math.floor(Math.random() * 10);
    const h = Math.floor(Math.random() * 10);
    const t = Math.floor(Math.random() * 10);
    const o = Math.floor(Math.random() * 10);
    start = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;
    ruleDesc = "subtracting 10 000 from each number (-10 000)";
  }

  const missingIndex = Math.floor(Math.random() * 5); // 0 to 4
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
    const distractors = [
      { val: correctNum + step, code: 'OFF_BY_ONE_STEP' },
      { val: correctNum - step, code: 'OFF_BY_ONE_STEP' },
      { val: correctNum + (2 * step), code: 'WRONG_INTERVAL_COUNT' },
      { val: correctNum - (2 * step), code: 'WRONG_INTERVAL_COUNT' },
      { val: correctNum + (Math.abs(step) === 10 ? 100 : Math.abs(step) === 100 ? 1000 : 100), code: 'WRONG_PLACE_VALUE' },
      { val: correctNum - (Math.abs(step) === 10 ? 100 : Math.abs(step) === 100 ? 1000 : 100), code: 'WRONG_PLACE_VALUE' }
    ];

    const distractorSet = new Set();
    defectMap = {};

    for (const d of distractors) {
      if (d.val > 0 && d.val !== correctNum && !distractorSet.has(d.val.toString())) {
        const valStr = d.val.toString();
        distractorSet.add(valStr);
        defectMap[valStr] = d.code;
        if (distractorSet.size === 3) break;
      }
    }

    let delta = 1;
    while (distractorSet.size < 3) {
      const fallbackVal = correctNum + (delta * (Math.abs(step) || 10));
      const valStr = fallbackVal.toString();
      if (fallbackVal > 0 && fallbackVal !== correctNum && !distractorSet.has(valStr)) {
        distractorSet.add(valStr);
        defectMap[valStr] = 'CARELESS_CALCULATION';
      }
      delta = delta > 0 ? -delta : -delta + 1;
    }

    const allOptions = [finalAnswer, ...Array.from(distractorSet)];
    options = allOptions.sort(() => Math.random() - 0.5);
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
3. Provide step-by-step solution steps separated by \\n and an encouraging conceptual hint explaining the pattern rule of ${ruleDesc}.
4. Forbid using "STORY:" or any instructional prefix in the output.

${getFormatInstructions(visualEngineStr, inputRequirementStr)}`;

  return { aiPrompt };
}
