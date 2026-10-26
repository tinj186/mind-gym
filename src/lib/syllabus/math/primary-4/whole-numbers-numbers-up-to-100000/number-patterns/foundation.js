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

export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, explicitVariety = null) {
  let promptInstruction = "";
  let finalAnswer = "";
  let options = [];
  let defectMap = {};
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let ruleDesc = "";
  let hint = "";

  const allFoundationVariants = [
    'foundation_count_on_back',
    'foundation_adjacent_term_deduction',
    'foundation_boundary_crossing_deduction',
    'foundation_deducing_unknown_rule',
    'foundation_incorrect_anomaly',
    'foundation_two_step_extension'
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

  let resolvedVariant = activeVariant;
  let chosenVariety = explicitVariety;

  if (legacyMap[resolvedVariant]) {
    chosenVariety = legacyMap[resolvedVariant];
    resolvedVariant = 'foundation_count_on_back';
  } else if (!resolvedVariant || resolvedVariant === 'default' || resolvedVariant === 'foundation_default') {
    resolvedVariant = allFoundationVariants[Math.floor(Math.random() * allFoundationVariants.length)];
  }

  // --------------------------------------------------------------------------
  // VARIANT 1: foundation_count_on_back
  // --------------------------------------------------------------------------
  if (resolvedVariant === 'foundation_count_on_back') {
    const VARIETIES = [
      'add_10', 'subtract_10',
      'add_100', 'subtract_100',
      'add_1000', 'subtract_1000',
      'add_10000', 'subtract_10000'
    ];

    if (!chosenVariety || !VARIETIES.includes(chosenVariety)) {
      chosenVariety = VARIETIES[Math.floor(Math.random() * VARIETIES.length)];
    }

    let step = 0;
    let start = 0;

    if (chosenVariety === 'add_10') {
      step = 10;
      const tth = Math.floor(Math.random() * 8) + 1;
      const th = Math.floor(Math.random() * 10);
      const h = Math.floor(Math.random() * 10);
      const t = Math.floor(Math.random() * 5);
      const o = Math.floor(Math.random() * 10);
      start = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;
      ruleDesc = "adding 10 to each number (+10)";
    } else if (chosenVariety === 'subtract_10') {
      step = -10;
      const tth = Math.floor(Math.random() * 8) + 1;
      const th = Math.floor(Math.random() * 10);
      const h = Math.floor(Math.random() * 10);
      const t = Math.floor(Math.random() * 5) + 4;
      const o = Math.floor(Math.random() * 10);
      start = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;
      ruleDesc = "subtracting 10 from each number (-10)";
    } else if (chosenVariety === 'add_100') {
      step = 100;
      const tth = Math.floor(Math.random() * 8) + 1;
      const th = Math.floor(Math.random() * 10);
      const h = Math.floor(Math.random() * 5);
      const t = Math.floor(Math.random() * 10);
      const o = Math.floor(Math.random() * 10);
      start = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;
      ruleDesc = "adding 100 to each number (+100)";
    } else if (chosenVariety === 'subtract_100') {
      step = -100;
      const tth = Math.floor(Math.random() * 8) + 1;
      const th = Math.floor(Math.random() * 10);
      const h = Math.floor(Math.random() * 5) + 4;
      const t = Math.floor(Math.random() * 10);
      const o = Math.floor(Math.random() * 10);
      start = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;
      ruleDesc = "subtracting 100 from each number (-100)";
    } else if (chosenVariety === 'add_1000') {
      step = 1000;
      const tth = Math.floor(Math.random() * 8) + 1;
      const th = Math.floor(Math.random() * 5);
      const h = Math.floor(Math.random() * 10);
      const t = Math.floor(Math.random() * 10);
      const o = Math.floor(Math.random() * 10);
      start = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;
      ruleDesc = "adding 1000 to each number (+1000)";
    } else if (chosenVariety === 'subtract_1000') {
      step = -1000;
      const tth = Math.floor(Math.random() * 8) + 1;
      const th = Math.floor(Math.random() * 5) + 4;
      const h = Math.floor(Math.random() * 10);
      const t = Math.floor(Math.random() * 10);
      const o = Math.floor(Math.random() * 10);
      start = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;
      ruleDesc = "subtracting 1000 from each number (-1000)";
    } else if (chosenVariety === 'add_10000') {
      step = 10000;
      const tth = Math.floor(Math.random() * 5) + 1;
      const th = Math.floor(Math.random() * 10);
      const h = Math.floor(Math.random() * 10);
      const t = Math.floor(Math.random() * 10);
      const o = Math.floor(Math.random() * 10);
      start = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;
      ruleDesc = "adding 10 000 to each number (+10 000)";
    } else {
      step = -10000;
      const tth = Math.floor(Math.random() * 4) + 6;
      const th = Math.floor(Math.random() * 10);
      const h = Math.floor(Math.random() * 10);
      const t = Math.floor(Math.random() * 10);
      const o = Math.floor(Math.random() * 10);
      start = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;
      ruleDesc = "subtracting 10 000 from each number (-10 000)";
    }

    const missingIndex = Math.floor(Math.random() * 5);
    const pattern = [];
    for (let i = 0; i < 5; i++) {
      pattern.push(start + (i * step));
    }

    const correctNum = pattern[missingIndex];
    finalAnswer = correctNum.toString();

    const displayPattern = [...pattern];
    displayPattern[missingIndex] = "?";

    visualEngineStr = JSON.stringify({
      componentToRender: "NUMBER_SEQUENCE_BLOCKS",
      componentData: {
        nodes: displayPattern.map(x => x.toString()),
        arrowLabels: ["", "", "", ""],
        orientation: "horizontal"
      }
    }, null, 2);

    promptInstruction = `- Question stem: "Find the missing number in the number pattern: ${displayPattern.join(', ')}."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const mcqRes = buildMcqOptions(finalAnswer, [
        { val: (correctNum + step).toString(), defect: 'OFF_BY_ONE_STEP' },
        { val: (correctNum - step).toString(), defect: 'OFF_BY_ONE_STEP' },
        { val: (correctNum + (2 * step)).toString(), defect: 'WRONG_INTERVAL_COUNT' },
        { val: (correctNum + (Math.abs(step) === 10 ? 100 : Math.abs(step) === 100 ? 1000 : 100)).toString(), defect: 'WRONG_PLACE_VALUE' }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          {
            label: "Identify the pattern rule (e.g., '+10' or '-100'):",
            expectedAnswer: `${step > 0 ? '+' : ''}${step}`,
            acceptedAnswers: [`${step > 0 ? '+' : ''}${step}`, `${step > 0 ? '+ ' : '- '}${Math.abs(step)}`]
          },
          {
            label: "Find the missing number in the pattern:",
            expectedAnswer: finalAnswer
          }
        ]
      }, null, 2);
    }

    hint = `Look at the difference between adjacent numbers. The rule is ${ruleDesc}.`;

  // --------------------------------------------------------------------------
  // VARIANT 2: foundation_adjacent_term_deduction (The Direct Adjacent Term Deduction)
  // --------------------------------------------------------------------------
  } else if (resolvedVariant === 'foundation_adjacent_term_deduction') {
    const intervals = [10, 100, 500, 1000, 2000];
    const d = intervals[Math.floor(Math.random() * intervals.length)];
    let isAscending = Math.random() < 0.5;
    if (chosenVariety === 'ascending') isAscending = true;
    if (chosenVariety === 'descending') isAscending = false;

    const step = isAscending ? d : -d;

    let missingIndex = Math.floor(Math.random() * 5);
    if (chosenVariety === 'missing_start') missingIndex = 0;
    else if (chosenVariety === 'missing_end') missingIndex = 4;
    else if (chosenVariety === 'missing_middle') missingIndex = Math.floor(Math.random() * 3) + 1;

    let start = 0;
    if (isAscending) {
      start = (Math.floor(Math.random() * 50) + 15) * 1000 + (Math.floor(Math.random() * 10) * 100);
    } else {
      start = (Math.floor(Math.random() * 50) + 40) * 1000 + (Math.floor(Math.random() * 10) * 100);
    }

    const pattern = [];
    for (let i = 0; i < 5; i++) {
      pattern.push(start + (i * step));
    }

    const correctNum = pattern[missingIndex];
    finalAnswer = correctNum.toString();

    const displayNodes = pattern.map((val, idx) => idx === missingIndex ? "?" : val.toString());

    visualEngineStr = JSON.stringify({
      componentToRender: "NUMBER_SEQUENCE_BLOCKS",
      componentData: {
        nodes: displayNodes,
        arrowLabels: ["", "", "", ""],
        orientation: "horizontal"
      }
    }, null, 2);

    promptInstruction = `- Question stem: "Find the missing number in the number sequence: ${displayNodes.join(', ')}."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    // Find two adjacent known numbers
    let pairIdx1 = 0;
    let pairIdx2 = 1;
    if (missingIndex === 0) {
      pairIdx1 = 1; pairIdx2 = 2;
    } else if (missingIndex === 1) {
      pairIdx1 = 2; pairIdx2 = 3;
    } else {
      pairIdx1 = 0; pairIdx2 = 1;
    }

    const highVal = Math.max(pattern[pairIdx1], pattern[pairIdx2]);
    const lowVal = Math.min(pattern[pairIdx1], pattern[pairIdx2]);

    let step2Equation = "";
    if (missingIndex > 0) {
      const prevNum = pattern[missingIndex - 1];
      step2Equation = isAscending
        ? `${prevNum} + ${d} = ${correctNum}`
        : `${prevNum} - ${d} = ${correctNum}`;
    } else {
      const nextNum = pattern[1];
      step2Equation = isAscending
        ? `${nextNum} - ${d} = ${correctNum}`
        : `${nextNum} + ${d} = ${correctNum}`;
    }

    if (isMCQ) {
      const mcqRes = buildMcqOptions(finalAnswer, [
        { val: (correctNum + step).toString(), defect: 'OFF_BY_ONE_STEP' },
        { val: (correctNum - step).toString(), defect: 'OFF_BY_ONE_STEP' },
        { val: (correctNum + (2 * step)).toString(), defect: 'WRONG_INTERVAL_COUNT' },
        { val: (correctNum + (d === 10 ? 100 : 10)).toString(), defect: 'WRONG_PLACE_VALUE' }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          {
            label: "Write the working equation to find the pattern rule (difference between two given numbers):",
            expectedAnswer: `${highVal} - ${lowVal} = ${d}`,
            acceptedAnswers: [`${highVal} - ${lowVal} = ${d}`, `${highVal}-${lowVal}=${d}`]
          },
          {
            label: "Write the working equation to find the missing number:",
            expectedAnswer: step2Equation,
            acceptedAnswers: [step2Equation, step2Equation.replace(/\s+/g, '')]
          }
        ]
      }, null, 2);
    }

    ruleDesc = isAscending ? `adding ${d}` : `subtracting ${d}`;
    hint = `Find the constant difference between two adjacent numbers in the sequence (${highVal} - ${lowVal} = ${d}). Then apply this rule to find the missing term.`;

  // --------------------------------------------------------------------------
  // VARIANT 3: foundation_boundary_crossing_deduction
  // --------------------------------------------------------------------------
  } else if (resolvedVariant === 'foundation_boundary_crossing_deduction') {
    let boundary = 30000;
    let d = 100;

    if (chosenVariety === 'cross_ten_thousands') {
      const boundaryOptions = [20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000];
      boundary = boundaryOptions[Math.floor(Math.random() * boundaryOptions.length)];
      d = [100, 500, 1000][Math.floor(Math.random() * 3)];
    } else if (chosenVariety === 'cross_thousands') {
      const k = Math.floor(Math.random() * 70) + 15;
      boundary = k * 1000;
      d = [50, 100, 200][Math.floor(Math.random() * 3)];
    } else if (chosenVariety === 'cross_hundreds') {
      const k = Math.floor(Math.random() * 700) + 150;
      boundary = k * 100;
      d = [10, 20, 25][Math.floor(Math.random() * 3)];
    } else {
      const boundaryOptions = [20000, 30000, 40000, 50000, 60000];
      boundary = boundaryOptions[Math.floor(Math.random() * boundaryOptions.length)];
      d = [100, 500, 1000][Math.floor(Math.random() * 3)];
    }

    const isAscending = Math.random() < 0.5;
    const step = isAscending ? d : -d;
    const missingIndex = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3 (near the boundary)

    const pattern = [];
    const start = isAscending ? boundary - (2 * d) : boundary + (2 * d);
    for (let i = 0; i < 5; i++) {
      pattern.push(start + (i * step));
    }

    const correctNum = pattern[missingIndex];
    finalAnswer = correctNum.toString();

    visualEngineStr = JSON.stringify({
      componentToRender: "NUMBER_LINE_ADVANCED",
      componentData: {
        min: Math.min(pattern[0], pattern[4]),
        max: Math.max(pattern[0], pattern[4]),
        numIntervals: 4,
        labeledPoints: pattern.map((val, idx) => ({
          index: idx,
          value: val,
          label: idx === missingIndex ? "?" : val.toLocaleString()
        })),
        targetPoint: missingIndex,
        markedLabel: "?"
      }
    }, null, 2);

    promptInstruction = `- Question stem: "Find the missing number on the number line: ${pattern.map((x, i) => i === missingIndex ? '?' : x).join(', ')}."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    const knownIdx1 = missingIndex === 1 ? 2 : 0;
    const knownIdx2 = missingIndex === 1 ? 3 : 1;
    const highVal = Math.max(pattern[knownIdx1], pattern[knownIdx2]);
    const lowVal = Math.min(pattern[knownIdx1], pattern[knownIdx2]);

    const prevNum = pattern[missingIndex - 1];
    const step2Equation = isAscending
      ? `${prevNum} + ${d} = ${correctNum}`
      : `${prevNum} - ${d} = ${correctNum}`;

    if (isMCQ) {
      const mcqRes = buildMcqOptions(finalAnswer, [
        { val: (correctNum + step).toString(), defect: 'OFF_BY_ONE_STEP' },
        { val: (correctNum - step).toString(), defect: 'OFF_BY_ONE_STEP' },
        { val: (correctNum + (d * 10)).toString(), defect: 'WRONG_PLACE_VALUE' },
        { val: (correctNum - (d * 10)).toString(), defect: 'WRONG_PLACE_VALUE' }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          {
            label: "Write the working equation to find the pattern rule:",
            expectedAnswer: `${highVal} - ${lowVal} = ${d}`,
            acceptedAnswers: [`${highVal} - ${lowVal} = ${d}`, `${highVal}-${lowVal}=${d}`]
          },
          {
            label: "Write the working equation to find the missing number:",
            expectedAnswer: step2Equation,
            acceptedAnswers: [step2Equation, step2Equation.replace(/\s+/g, '')]
          }
        ]
      }, null, 2);
    }

    ruleDesc = `crossing boundary ${boundary} by intervals of ${d}`;
    hint = `Notice the place-value change across the boundary. Check the difference between two known tick marks (${highVal} - ${lowVal} = ${d}) and step to find the target.`;

  // --------------------------------------------------------------------------
  // VARIANT 4: foundation_deducing_unknown_rule (Arrow Labels)
  // --------------------------------------------------------------------------
  } else if (resolvedVariant === 'foundation_deducing_unknown_rule') {
    const intervals = [20, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000];
    const d = intervals[Math.floor(Math.random() * intervals.length)];
    let isAddition = Math.random() < 0.5;
    if (chosenVariety === 'rule_addition') isAddition = true;
    if (chosenVariety === 'rule_subtraction') isAddition = false;

    const step = isAddition ? d : -d;
    let start = 0;
    if (isAddition) {
      start = (Math.floor(Math.random() * 40) + 20) * 1000;
    } else {
      start = (Math.floor(Math.random() * 40) + 50) * 1000;
    }

    const pattern = [];
    for (let i = 0; i < 5; i++) {
      pattern.push(start + (i * step));
    }

    finalAnswer = isAddition ? `+ ${d}` : `- ${d}`;
    const sign = isAddition ? '+' : '-';

    visualEngineStr = JSON.stringify({
      componentToRender: "NUMBER_SEQUENCE_BLOCKS",
      componentData: {
        nodes: pattern.map(x => x.toString()),
        arrowLabels: ["?", "?", "?", "?"],
        orientation: "horizontal"
      }
    }, null, 2);

    promptInstruction = `- Question stem: "Look at the number sequence: ${pattern.join(', ')}. What is the rule of this pattern?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    const highVal = Math.max(pattern[0], pattern[1]);
    const lowVal = Math.min(pattern[0], pattern[1]);

    if (isMCQ) {
      const oppositeAns = isAddition ? `- ${d}` : `+ ${d}`;
      const wrongD1 = d >= 1000 ? d / 10 : d * 2;
      const wrongD2 = d >= 500 ? d / 5 : d * 10;
      const mcqRes = buildMcqOptions(finalAnswer, [
        { val: oppositeAns, defect: 'REVERSED_OPERATION' },
        { val: `${sign} ${wrongD1}`, defect: 'WRONG_INTERVAL_VALUE' },
        { val: `${sign === '+' ? '-' : '+'} ${wrongD2}`, defect: 'WRONG_INTERVAL_VALUE' }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          {
            label: "Write the working equation to find the rule between the numbers:",
            expectedAnswer: `${highVal} - ${lowVal} = ${d}`,
            acceptedAnswers: [`${highVal} - ${lowVal} = ${d}`, `${highVal}-${lowVal}=${d}`]
          },
          {
            label: "Final Answer (State the pattern rule, e.g., '+ 2500' or '- 2500'):",
            expectedAnswer: finalAnswer,
            acceptedAnswers: [
              finalAnswer,
              finalAnswer.replace(' ', ''),
              `${sign}${d.toLocaleString()}`,
              `${sign} ${d.toLocaleString()}`,
              `${isAddition ? 'add' : 'subtract'} ${d}`,
              `${isAddition ? 'Add' : 'Subtract'} ${d}`
            ]
          }
        ]
      }, null, 2);
    }

    ruleDesc = `${isAddition ? 'adding' : 'subtracting'} ${d}`;
    hint = `Compare adjacent numbers. Are they increasing or decreasing? By how much?`;

  // --------------------------------------------------------------------------
  // VARIANT 5: foundation_incorrect_anomaly
  // --------------------------------------------------------------------------
  } else if (resolvedVariant === 'foundation_incorrect_anomaly') {
    const intervals = [50, 100, 200, 500, 1000, 2000, 3000];
    const d = intervals[Math.floor(Math.random() * intervals.length)];
    const isAscending = Math.random() < 0.5;
    const step = isAscending ? d : -d;

    let start = 0;
    if (isAscending) {
      start = (Math.floor(Math.random() * 40) + 20) * 1000;
    } else {
      start = (Math.floor(Math.random() * 40) + 50) * 1000;
    }

    const pattern = [];
    for (let i = 0; i < 5; i++) {
      pattern.push(start + (i * step));
    }

    let anomalyIdx = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
    if (chosenVariety === 'anomaly_end') anomalyIdx = 4;
    else if (chosenVariety === 'anomaly_middle') anomalyIdx = Math.floor(Math.random() * 3) + 1;

    // Create a distinct anomaly value
    const anomalyOffset = d >= 200 ? Math.floor(d / 2) : 50;
    const anomalyVal = pattern[anomalyIdx] + (Math.random() < 0.5 ? anomalyOffset : -anomalyOffset);

    const displaySequence = pattern.map((val, idx) => idx === anomalyIdx ? anomalyVal : val);
    finalAnswer = anomalyVal.toString();

    visualEngineStr = JSON.stringify({
      componentToRender: "NUMBER_SEQUENCE_BLOCKS",
      componentData: {
        nodes: displaySequence.map(x => x.toString()),
        arrowLabels: ["", "", "", ""],
        orientation: "horizontal"
      }
    }, null, 2);

    promptInstruction = `- Question stem: "In the number pattern below, one number is incorrect. Identify the incorrect number: ${displaySequence.join(', ')}."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    const checkIdx1 = anomalyIdx === 1 ? 2 : 0;
    const checkIdx2 = anomalyIdx === 1 ? 3 : 1;
    const highVal = Math.max(pattern[checkIdx1], pattern[checkIdx2]);
    const lowVal = Math.min(pattern[checkIdx1], pattern[checkIdx2]);

    if (isMCQ) {
      const candidates = displaySequence
        .filter(val => val !== anomalyVal)
        .slice(0, 3)
        .map(val => ({ val: val.toString(), defect: 'CORRECT_SEQUENCE_TERM' }));

      const mcqRes = buildMcqOptions(finalAnswer, candidates);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          {
            label: "Write the working equation to find the correct pattern rule:",
            expectedAnswer: `${highVal} - ${lowVal} = ${d}`,
            acceptedAnswers: [`${highVal} - ${lowVal} = ${d}`, `${highVal}-${lowVal}=${d}`]
          },
          {
            label: "Identify the incorrect number in the sequence:",
            expectedAnswer: finalAnswer
          }
        ]
      }, null, 2);
    }

    ruleDesc = `a constant step of ${d}`;
    hint = `Check the difference between the first few numbers to find the correct rule (${highVal} - ${lowVal} = ${d}). Then test each term to find which one does not follow it.`;

  // --------------------------------------------------------------------------
  // VARIANT 6: foundation_two_step_extension
  // --------------------------------------------------------------------------
  } else {
    const intervals = [50, 100, 200, 500, 1000, 2000, 3000];
    const d = intervals[Math.floor(Math.random() * intervals.length)];
    let isAscending = Math.random() < 0.5;
    if (chosenVariety === 'extend_ascending') isAscending = true;
    if (chosenVariety === 'extend_descending') isAscending = false;

    const step = isAscending ? d : -d;
    let start = 0;
    if (isAscending) {
      start = (Math.floor(Math.random() * 40) + 15) * 1000;
    } else {
      start = (Math.floor(Math.random() * 40) + 50) * 1000;
    }

    const pattern = [];
    for (let i = 0; i < 5; i++) {
      pattern.push(start + (i * step));
    }

    // Terms 0, 1, 2 are given. Terms 3 and 4 are missing: [n0, n1, n2, "?", "?"]
    finalAnswer = pattern[4].toString(); // The 5th term!

    const displayNodes = [pattern[0].toString(), pattern[1].toString(), pattern[2].toString(), "?", "?"];

    visualEngineStr = JSON.stringify({
      componentToRender: "NUMBER_SEQUENCE_BLOCKS",
      componentData: {
        nodes: displayNodes,
        arrowLabels: ["", "", "", ""],
        orientation: "horizontal",
        showIndices: true
      }
    }, null, 2);

    promptInstruction = `- Question stem: "Find the 5th number in the number pattern: ${pattern[0]}, ${pattern[1]}, ${pattern[2]}, ?, ?."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    const highVal = Math.max(pattern[0], pattern[1]);
    const lowVal = Math.min(pattern[0], pattern[1]);
    const sign = isAscending ? '+' : '-';
    const step2Equation = `${pattern[2]} ${sign} ${d} ${sign} ${d} = ${pattern[4]}`;

    if (isMCQ) {
      const mcqRes = buildMcqOptions(finalAnswer, [
        { val: pattern[3].toString(), defect: 'FOUND_4TH_TERM_INSTEAD_OF_5TH' },
        { val: (pattern[4] + step).toString(), defect: 'FOUND_6TH_TERM' },
        { val: pattern[2].toString(), defect: 'RETURNED_LAST_GIVEN_TERM' }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          {
            label: "Write the working equation to find the pattern rule:",
            expectedAnswer: `${highVal} - ${lowVal} = ${d}`,
            acceptedAnswers: [`${highVal} - ${lowVal} = ${d}`, `${highVal}-${lowVal}=${d}`]
          },
          {
            label: "Write the working equation to find the final missing number:",
            expectedAnswer: step2Equation,
            acceptedAnswers: [
              step2Equation,
              step2Equation.replace(/\s+/g, ''),
              `${pattern[2]} ${sign} ${2 * d} = ${pattern[4]}`,
              `${pattern[3]} ${sign} ${d} = ${pattern[4]}`
            ]
          }
        ]
      }, null, 2);
    }

    ruleDesc = `${isAscending ? 'adding' : 'subtracting'} ${d}`;
    hint = `Find the rule between the first 3 numbers (${highVal} - ${lowVal} = ${d}). Remember that the 5th term is TWO steps away from the 3rd term (${pattern[2]}).`;
  }

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

${getFormatInstructions(visualEngineStr, inputRequirementStr, resolvedVariant)}`;

  return { aiPrompt };
}
