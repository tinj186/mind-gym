function buildMcqOptions(finalAnswer, candidateDistractors) {
  const options = [finalAnswer];
  const defectMap = {};

  for (const item of candidateDistractors) {
    const valStr = String(item.val);
    if (valStr !== finalAnswer && !options.includes(valStr)) {
      options.push(valStr);
      defectMap[valStr] = item.defect || 'CARELESS_CALCULATION';
      if (options.length === 4) break;
    }
  }

  let counter = 1;
  const numAnswer = parseInt(finalAnswer, 10);
  while (options.length < 4) {
    const fallback = isNaN(numAnswer)
      ? `${finalAnswer} (Option ${counter})`
      : (numAnswer + (counter * 100)).toString();
    if (!options.includes(fallback)) {
      options.push(fallback);
      defectMap[fallback] = 'CARELESS_CALCULATION';
    }
    counter++;
  }

  return {
    options: options.sort(() => Math.random() - 0.5),
    defectMap
  };
}

export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, explicitVariety = null) {
  let step = 0;
  let start = 0;
  let promptInstruction = "";
  let finalAnswer = "";
  let options = [];
  let defectMap = {};
  let ruleDesc = "";
  let boundaryDesc = "";

  const standardVarieties = [
    'add_cross_thousands',
    'subtract_cross_thousands',
    'add_cross_ten_thousands',
    'subtract_cross_ten_thousands',
    'reach_100000'
  ];

  let chosenVariety = explicitVariety;
  if (!chosenVariety || !standardVarieties.includes(chosenVariety)) {
    if (typeof activeVariant === 'string' && standardVarieties.includes(activeVariant)) {
      chosenVariety = activeVariant;
    } else {
      chosenVariety = standardVarieties[Math.floor(Math.random() * standardVarieties.length)];
    }
  }

  if (chosenVariety === 'add_cross_thousands') {
    // e.g. steps: 20, 25, 50, 100, 200, 250 crossing thousands
    const stepOptions = [20, 25, 50, 100, 200, 250];
    step = stepOptions[Math.floor(Math.random() * stepOptions.length)];
    const tth = Math.floor(Math.random() * 8) + 1; // 1 to 8
    const th = Math.floor(Math.random() * 9); // 0 to 8
    const baseThousand = (tth * 10000) + ((th + 1) * 1000);
    start = baseThousand - (2 * step);
    ruleDesc = `adding ${step}`;
    boundaryDesc = `crossing the ${baseThousand.toLocaleString()} thousands boundary`;
  } else if (chosenVariety === 'subtract_cross_thousands') {
    const stepOptions = [20, 25, 50, 100, 200, 250];
    const d = stepOptions[Math.floor(Math.random() * stepOptions.length)];
    step = -d;
    const tth = Math.floor(Math.random() * 8) + 1;
    const th = Math.floor(Math.random() * 8) + 1; // 1 to 9
    const baseThousand = (tth * 10000) + (th * 1000);
    start = baseThousand + (2 * d);
    ruleDesc = `subtracting ${d}`;
    boundaryDesc = `counting back crossing the ${baseThousand.toLocaleString()} thousands boundary`;
  } else if (chosenVariety === 'add_cross_ten_thousands') {
    // e.g. steps: 100, 200, 250, 500, 1000 crossing ten-thousands
    const stepOptions = [100, 200, 250, 500, 1000];
    step = stepOptions[Math.floor(Math.random() * stepOptions.length)];
    const tth = Math.floor(Math.random() * 8) + 1; // 1 to 8
    const baseTenThousand = (tth + 1) * 10000;
    start = baseTenThousand - (2 * step);
    ruleDesc = `adding ${step}`;
    boundaryDesc = `crossing the ${baseTenThousand.toLocaleString()} ten-thousands boundary`;
  } else if (chosenVariety === 'subtract_cross_ten_thousands') {
    const stepOptions = [100, 200, 250, 500, 1000];
    const d = stepOptions[Math.floor(Math.random() * stepOptions.length)];
    step = -d;
    const tth = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const baseTenThousand = tth * 10000;
    start = baseTenThousand + (2 * d);
    ruleDesc = `subtracting ${d}`;
    boundaryDesc = `counting back crossing the ${baseTenThousand.toLocaleString()} ten-thousands boundary`;
  } else {
    // reach_100000 (approaching and reaching 100,000)
    const stepOptions = [500, 1000, 2000, 2500];
    step = stepOptions[Math.floor(Math.random() * stepOptions.length)];
    start = 100000 - (4 * step);
    ruleDesc = `adding ${step}`;
    boundaryDesc = `approaching and reaching 100 000`;
  }

  const pattern = [];
  for (let i = 0; i < 5; i++) {
    pattern.push(start + (i * step));
  }

  const missingIndex = Math.floor(Math.random() * 5); // 0 to 4
  const correctNum = pattern[missingIndex];
  finalAnswer = correctNum.toString();

  const displayNodes = pattern.map((val, idx) => idx === missingIndex ? "?" : val.toString());

  const visualEngineStr = JSON.stringify({
    componentToRender: "NUMBER_SEQUENCE_BLOCKS",
    componentData: {
      nodes: displayNodes,
      orientation: "horizontal"
    }
  }, null, 2);

  promptInstruction = `- Question stem: "Find the missing number in the number pattern: ${displayNodes.join(', ')}."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

  // Find two adjacent known numbers
  let pair1 = 0;
  let pair2 = 1;
  if (missingIndex === 0) {
    pair1 = 1; pair2 = 2;
  } else if (missingIndex === 1) {
    pair1 = 2; pair2 = 3;
  } else {
    pair1 = 0; pair2 = 1;
  }

  const highVal = Math.max(pattern[pair1], pattern[pair2]);
  const lowVal = Math.min(pattern[pair1], pattern[pair2]);
  const absStep = Math.abs(step);

  if (isMCQ) {
    const wrong1 = (correctNum + step).toString();
    const wrong2 = (correctNum - step).toString();
    const regroupOffset = absStep >= 500 ? 1000 : 100;
    const wrong3 = (step > 0 ? correctNum - regroupOffset : correctNum + regroupOffset).toString();

    const mcqRes = buildMcqOptions(finalAnswer, [
      { val: wrong1, defect: step > 0 ? 'OFF_BY_ONE_STEP_FORWARD' : 'OFF_BY_ONE_STEP_BACKWARD' },
      { val: wrong2, defect: step > 0 ? 'OFF_BY_ONE_STEP_BACKWARD' : 'OFF_BY_ONE_STEP_FORWARD' },
      { val: wrong3, defect: 'BOUNDARY_REGROUPING_ERROR' }
    ]);
    options = mcqRes.options;
    defectMap = mcqRes.defectMap;
  }

  let inputRequirementStr = null;
  if (isStructure) {
    let workingEq = "";
    if (missingIndex === 0) {
      workingEq = `${pattern[1]} ${step > 0 ? '-' : '+'} ${absStep} = ${correctNum}`;
    } else {
      workingEq = `${pattern[missingIndex - 1]} ${step > 0 ? '+' : '-'} ${absStep} = ${correctNum}`;
    }

    inputRequirementStr = JSON.stringify({
      inputType: "MULTI_STEP_INPUT",
      steps: [
        {
          label: "Write the working equation to find the pattern rule:",
          expectedAnswer: `${highVal} - ${lowVal} = ${absStep}`,
          acceptedAnswers: [`${highVal} - ${lowVal} = ${absStep}`, `${highVal}-${lowVal}=${absStep}`]
        },
        {
          label: "Write the working equation to find the missing number:",
          expectedAnswer: workingEq,
          acceptedAnswers: [workingEq, workingEq.replace(/\s+/g, '')]
        }
      ]
    }, null, 2);
  }

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
3. Provide step-by-step solution steps separated by \\n and an encouraging conceptual hint explaining how to handle ${boundaryDesc} with a rule of ${ruleDesc}.
4. Forbid using "STORY:" or any instructional prefix in the output.
5. In visualEngine, do NOT provide or output interval numbers on the arrows (do NOT provide overlapping details that spoil the step size). Keep arrows plain.

${getFormatInstructions(visualEngineStr, inputRequirementStr, 'standard_pattern_crossing')}`;

  return { aiPrompt };
}
