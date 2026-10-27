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
  let promptInstruction = "";
  let finalAnswer = "";
  let options = [];
  let defectMap = {};
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let ruleDesc = "";
  let hint = "";

  const allStandardVariants = [
    'standard_pattern_crossing',
    'standard_non_adjacent_gap_deduction',
    'standard_alternating_rule',
    'standard_table_input_output',
    'standard_growing_shrinking_interval',
    'standard_equation_sequence_hybrid'
  ];

  let resolvedVariant = activeVariant;
  if (!resolvedVariant || resolvedVariant === 'standard_default' || resolvedVariant === 'default') {
    resolvedVariant = allStandardVariants[Math.floor(Math.random() * allStandardVariants.length)];
  }

  const varietyStr = typeof explicitVariety === 'string' ? explicitVariety : '';

  // ==========================================================================
  // VARIANT 1: standard_non_adjacent_gap_deduction (The Missing Middle)
  // ==========================================================================
  if (resolvedVariant === 'standard_non_adjacent_gap_deduction') {
    const stepOptions = [500, 1000, 1500, 2000, 2500, 3000, 5000];
    const d = stepOptions[Math.floor(Math.random() * stepOptions.length)];
    const t1 = (Math.floor(Math.random() * 25) + 15) * 1000; // 15 000 to 39 000

    let chosenVariety = varietyStr;
    if (!['two_gap_find_inside', 'two_gap_find_outside', 'three_gap_find_inside'].includes(chosenVariety)) {
      chosenVariety = ['three_gap_find_inside', 'two_gap_find_inside', 'two_gap_find_outside'][Math.floor(Math.random() * 3)];
    }

    let gapCount = 3;
    let knownHigh = 0;
    let knownLow = t1;
    let targetVal = 0;
    let targetIdx = 1;
    let numIntervals = 3;
    let labeledPoints = [];

    if (chosenVariety === 'three_gap_find_inside') {
      gapCount = 3;
      numIntervals = 3;
      const t4 = t1 + (3 * d);
      knownHigh = t4;
      targetIdx = Math.random() < 0.5 ? 1 : 2;
      targetVal = t1 + (targetIdx * d);
      finalAnswer = targetVal.toString();

      labeledPoints = [
        { index: 0, value: t1, label: t1.toLocaleString() },
        { index: 1, value: t1 + d, label: targetIdx === 1 ? "?" : "" },
        { index: 2, value: t1 + (2 * d), label: targetIdx === 2 ? "?" : "" },
        { index: 3, value: t4, label: t4.toLocaleString() }
      ];
    } else if (chosenVariety === 'two_gap_find_inside') {
      gapCount = 2;
      numIntervals = 2;
      const t3 = t1 + (2 * d);
      knownHigh = t3;
      targetIdx = 1;
      targetVal = t1 + d;
      finalAnswer = targetVal.toString();

      labeledPoints = [
        { index: 0, value: t1, label: t1.toLocaleString() },
        { index: 1, value: t1 + d, label: "?" },
        { index: 2, value: t3, label: t3.toLocaleString() }
      ];
    } else {
      // two_gap_find_outside: T1 and T3 are known, find T4
      gapCount = 2;
      numIntervals = 3;
      const t3 = t1 + (2 * d);
      const t4 = t1 + (3 * d);
      knownHigh = t3;
      targetIdx = 3;
      targetVal = t4;
      finalAnswer = targetVal.toString();

      labeledPoints = [
        { index: 0, value: t1, label: t1.toLocaleString() },
        { index: 1, value: t1 + d, label: "" },
        { index: 2, value: t3, label: t3.toLocaleString() },
        { index: 3, value: t4, label: "?" }
      ];
    }

    const totalDiff = knownHigh - knownLow;

    visualEngineStr = JSON.stringify({
      componentToRender: "NUMBER_LINE_ADVANCED",
      componentData: {
        min: t1,
        max: t1 + (numIntervals * d),
        numIntervals,
        labeledPoints,
        targetPoint: targetIdx,
        markedLabel: "?"
      }
    }, null, 2);

    promptInstruction = `- Question stem: "On the number line below, the interval between ${knownLow.toLocaleString()} and ${knownHigh.toLocaleString()} is divided into ${gapCount} equal gaps. Find the value marked with a question mark (?)."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    let step3Equation = "";
    if (chosenVariety === 'two_gap_find_outside') {
      step3Equation = `${knownHigh} + ${d} = ${targetVal}`;
    } else if (targetIdx === 1) {
      step3Equation = `${knownLow} + ${d} = ${targetVal}`;
    } else {
      step3Equation = `${knownLow} + ${2 * d} = ${targetVal}`;
    }

    if (isMCQ) {
      const mcqRes = buildMcqOptions(finalAnswer, [
        { val: totalDiff.toString(), defect: 'FAILED_TO_DIVIDE_BY_GAPS' },
        { val: (targetVal + d).toString(), defect: 'OFF_BY_ONE_INTERVAL' },
        { val: (knownLow + Math.round(totalDiff / (gapCount === 2 ? 3 : 2))).toString(), defect: 'DIVIDED_BY_WRONG_NUMBER_OF_GAPS' }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          {
            label: "Write the working equation to find the total difference between the known numbers:",
            expectedAnswer: `${knownHigh} - ${knownLow} = ${totalDiff}`,
            acceptedAnswers: [`${knownHigh} - ${knownLow} = ${totalDiff}`, `${knownHigh}-${knownLow}=${totalDiff}`]
          },
          {
            label: `Write the working equation to find the value of 1 interval gap (${gapCount} jumps):`,
            expectedAnswer: `${totalDiff} / ${gapCount} = ${d}`,
            acceptedAnswers: [
              `${totalDiff} / ${gapCount} = ${d}`,
              `${totalDiff}/${gapCount}=${d}`,
              `${totalDiff} ÷ ${gapCount} = ${d}`,
              `${totalDiff}÷${gapCount}=${d}`
            ]
          },
          {
            label: "Write the working equation to find the missing number:",
            expectedAnswer: step3Equation,
            acceptedAnswers: [
              step3Equation,
              step3Equation.replace(/\s+/g, ''),
              `${knownLow} + ${targetIdx * d} = ${targetVal}`,
              `${knownLow}+${targetIdx * d}=${targetVal}`
            ]
          }
        ]
      }, null, 2);
    }

    ruleDesc = `an interval gap of ${d} across ${gapCount} equal jumps`;
    hint = `First, find the total difference between the two known numbers (${knownHigh} - ${knownLow} = ${totalDiff}). Next, divide by the ${gapCount} equal jumps to get 1 jump (${totalDiff} ÷ ${gapCount} = ${d}). Then add to find the missing point.`;

  // ==========================================================================
  // VARIANT 2: standard_alternating_rule (+A, -B)
  // ==========================================================================
  } else if (resolvedVariant === 'standard_alternating_rule') {
    let chosenVariety = varietyStr;

    let opVariety = 'alternating_add_sub';
    let missingPosMode = 'random'; // 'random', 'rule_a', 'rule_b', 'end', 'middle'

    if (chosenVariety.includes('sub_add')) opVariety = 'alternating_sub_add';
    else if (chosenVariety.includes('add_add')) opVariety = 'alternating_add_add';
    else if (chosenVariety.includes('sub_sub')) opVariety = 'alternating_sub_sub';
    else if (chosenVariety.includes('add_sub')) opVariety = 'alternating_add_sub';
    else {
      opVariety = ['alternating_add_sub', 'alternating_sub_add', 'alternating_add_add', 'alternating_sub_sub'][Math.floor(Math.random() * 4)];
    }

    if (chosenVariety.includes('rule_a')) missingPosMode = 'rule_a';
    else if (chosenVariety.includes('rule_b')) missingPosMode = 'rule_b';
    else if (chosenVariety.includes('end')) missingPosMode = 'end';
    else if (chosenVariety.includes('middle')) missingPosMode = 'middle';

    let a = 1500;
    let b = 500;
    let op1Sign = '+';
    let op2Sign = '-';
    let op1Val = 1500;
    let op2Val = 500;
    let startVal = 50000;

    if (opVariety === 'alternating_add_sub') {
      const aOptions = [1000, 1500, 2000, 2500, 3000];
      const bOptions = [300, 500, 600, 800, 1000];
      a = aOptions[Math.floor(Math.random() * aOptions.length)];
      b = bOptions[Math.floor(Math.random() * bOptions.length)];
      op1Sign = '+';
      op2Sign = '-';
      op1Val = a;
      op2Val = b;
      startVal = (Math.floor(Math.random() * 30) + 20) * 1000;
    } else if (opVariety === 'alternating_sub_add') {
      const aOptions = [1000, 1500, 2000, 2500];
      const bOptions = [300, 500, 800, 1000];
      a = aOptions[Math.floor(Math.random() * aOptions.length)];
      b = bOptions[Math.floor(Math.random() * bOptions.length)];
      op1Sign = '-';
      op2Sign = '+';
      op1Val = a;
      op2Val = b;
      startVal = (Math.floor(Math.random() * 30) + 40) * 1000;
    } else if (opVariety === 'alternating_add_add') {
      a = [500, 1000, 1500][Math.floor(Math.random() * 3)];
      b = [2000, 2500, 3000][Math.floor(Math.random() * 3)];
      op1Sign = '+';
      op2Sign = '+';
      op1Val = a;
      op2Val = b;
      startVal = (Math.floor(Math.random() * 20) + 15) * 1000;
    } else {
      // alternating_sub_sub
      a = [1000, 2000, 3000][Math.floor(Math.random() * 3)];
      b = [500, 1000, 1500][Math.floor(Math.random() * 3)];
      op1Sign = '-';
      op2Sign = '-';
      op1Val = a;
      op2Val = b;
      startVal = (Math.floor(Math.random() * 25) + 60) * 1000;
    }

    const pattern = [];
    let curr = startVal;
    for (let i = 0; i < 6; i++) {
      pattern.push(curr);
      curr += (i % 2 === 0 ? (op1Sign === '+' ? op1Val : -op1Val) : (op2Sign === '+' ? op2Val : -op2Val));
    }

    // Determine missingIndex dynamically across positions (2, 3, 4, 5)
    let missingIndex = 4;
    if (missingPosMode === 'end') {
      missingIndex = 5;
    } else if (missingPosMode === 'middle') {
      missingIndex = Math.random() < 0.5 ? 2 : 3;
    } else if (missingPosMode === 'rule_a') {
      missingIndex = Math.random() < 0.5 ? 3 : 5; // index 3 (jump 2 is rule A) or index 5 (jump 4 is rule A)
    } else if (missingPosMode === 'rule_b') {
      missingIndex = Math.random() < 0.5 ? 2 : 4; // index 2 (jump 1 is rule B) or index 4 (jump 3 is rule B)
    } else {
      // Truly random across 2, 3, 4, 5
      missingIndex = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
    }

    const correctNum = pattern[missingIndex];
    finalAnswer = correctNum.toString();

    const displayNodes = pattern.map((val, idx) => idx === missingIndex ? "?" : val.toString());

    visualEngineStr = JSON.stringify({
      componentToRender: "NUMBER_SEQUENCE_BLOCKS",
      componentData: {
        nodes: displayNodes,
        orientation: "horizontal"
      }
    }, null, 2);

    promptInstruction = `- Question stem: "Find the missing number in the alternating number pattern: ${displayNodes.join(', ')}."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    let pairA1 = 0, pairA2 = 1;
    let pairB1 = 1, pairB2 = 2;
    if (missingIndex === 2) {
      pairB1 = 4; pairB2 = 5;
    }

    const highA = Math.max(pattern[pairA1], pattern[pairA2]);
    const lowA = Math.min(pattern[pairA1], pattern[pairA2]);
    const highB = Math.max(pattern[pairB1], pattern[pairB2]);
    const lowB = Math.min(pattern[pairB1], pattern[pairB2]);

    const leadingJump = missingIndex - 1;
    const isTargetOnRuleA = leadingJump % 2 === 0;
    const appliedSign = isTargetOnRuleA ? op1Sign : op2Sign;
    const appliedVal = isTargetOnRuleA ? op1Val : op2Val;
    const prevNum = pattern[missingIndex - 1];
    const step3Equation = `${prevNum} ${appliedSign} ${appliedVal} = ${correctNum}`;

    if (isMCQ) {
      const wrongRuleSign = isTargetOnRuleA ? op2Sign : op1Sign;
      const wrongRuleVal = isTargetOnRuleA ? op2Val : op1Val;
      const wrongRuleNum = wrongRuleSign === '+' ? prevNum + wrongRuleVal : prevNum - wrongRuleVal;
      const reverseRuleNum = appliedSign === '+' ? prevNum - appliedVal : prevNum + appliedVal;

      const mcqRes = buildMcqOptions(finalAnswer, [
        { val: wrongRuleNum.toString(), defect: 'APPLIED_WRONG_ALTERNATING_RULE' },
        { val: reverseRuleNum.toString(), defect: 'REVERSED_OPERATION_SIGN' },
        { val: pattern[missingIndex - 1].toString(), defect: 'RETURNED_PREVIOUS_TERM' }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          {
            label: "Write the working equation to find the first alternating rule:",
            expectedAnswer: `${highA} - ${lowA} = ${op1Val}`,
            acceptedAnswers: [`${highA} - ${lowA} = ${op1Val}`, `${highA}-${lowA}=${op1Val}`]
          },
          {
            label: "Write the working equation to find the second alternating rule:",
            expectedAnswer: `${highB} - ${lowB} = ${op2Val}`,
            acceptedAnswers: [`${highB} - ${lowB} = ${op2Val}`, `${highB}-${lowB}=${op2Val}`]
          },
          {
            label: "Write the working equation to find the missing number:",
            expectedAnswer: step3Equation,
            acceptedAnswers: [step3Equation, step3Equation.replace(/\s+/g, '')]
          }
        ]
      }, null, 2);
    }

    ruleDesc = `alternating ${op1Sign}${op1Val} and ${op2Sign}${op2Val}`;
    hint = `Compare adjacent pairs: from 1st to 2nd number is ${op1Sign}${op1Val}, then from 2nd to 3rd number is ${op2Sign}${op2Val}. Follow this alternating two-step pattern to find the missing number.`;

  // ==========================================================================
  // VARIANT 3: standard_table_input_output (Table Pattern)
  // ==========================================================================
  } else if (resolvedVariant === 'standard_table_input_output') {
    let chosenVariety = varietyStr;
    let targetType = 'find_output';
    if (chosenVariety.includes('find_input') || chosenVariety.includes('input')) {
      targetType = 'find_input';
    } else if (chosenVariety.includes('find_output') || chosenVariety.includes('output')) {
      targetType = 'find_output';
    } else {
      targetType = Math.random() < 0.5 ? 'find_input' : 'find_output';
    }

    let isAdd = Math.random() < 0.5;
    if (chosenVariety.includes('addition') || chosenVariety.includes('add')) {
      isAdd = true;
    } else if (chosenVariety.includes('subtraction') || chosenVariety.includes('subtract') || chosenVariety.includes('sub')) {
      isAdd = false;
    }

    const offsets = [1500, 2400, 3500, 5000, 6000, 8000, 12000, 15000, 20000, 25000, 30000];
    const offset = offsets[Math.floor(Math.random() * offsets.length)];

    let baseInputs = [];
    if (isAdd) {
      // Output = Input + offset
      // Constraints: Input >= 2000, Output <= 100000 => Input <= 100000 - offset
      const maxAllowed = 100000 - offset;
      const startMin = 3000;
      const startMax = Math.max(startMin, maxAllowed - 30000);
      const start = Math.floor(Math.random() * ((startMax - startMin) / 1000)) * 1000 + startMin;
      const gap1 = (Math.floor(Math.random() * 4) + 4) * 1000; // 4000 - 7000
      const gap2 = (Math.floor(Math.random() * 4) + 4) * 1000;
      const gap3 = (Math.floor(Math.random() * 4) + 4) * 1000;
      baseInputs = [
        start,
        start + gap1,
        start + gap1 + gap2,
        start + gap1 + gap2 + gap3
      ];
      if (baseInputs[3] > maxAllowed) {
        const excess = baseInputs[3] - maxAllowed;
        baseInputs = baseInputs.map(val => val - excess);
      }
    } else {
      // Output = Input - offset
      // Constraints: Output >= 2000 => Input >= offset + 2000; Input <= 100000
      const minAllowed = offset + 2000;
      const start = minAllowed + (Math.floor(Math.random() * 5) + 1) * 1000; // offset + 3000 to 7000
      const gap1 = (Math.floor(Math.random() * 4) + 5) * 1000; // 5000 - 8000
      const gap2 = (Math.floor(Math.random() * 4) + 5) * 1000;
      const gap3 = (Math.floor(Math.random() * 4) + 5) * 1000;
      baseInputs = [
        start,
        start + gap1,
        start + gap1 + gap2,
        start + gap1 + gap2 + gap3
      ];
      if (baseInputs[3] > 100000) {
        const excess = baseInputs[3] - 100000;
        baseInputs = baseInputs.map(val => val - excess);
      }
    }

    const rows = baseInputs.map(inp => {
      const out = isAdd ? inp + offset : inp - offset;
      return [inp.toString(), out.toString()];
    });

    // Dynamically choose target row across rows (1, 2, or 3) so row 0 is always a complete sample
    const targetRowIdx = Math.floor(Math.random() * 3) + 1;
    const targetInput = rows[targetRowIdx][0];
    const targetOutput = rows[targetRowIdx][1];

    if (targetType === 'find_input') {
      rows[targetRowIdx][0] = "?";
      finalAnswer = targetInput;
    } else {
      rows[targetRowIdx][1] = "?";
      finalAnswer = targetOutput;
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "TABLE_PATTERN_VISUALIZER",
      componentData: {
        title: "Number Machine",
        headers: ["Machine Input", "Machine Output"],
        rows
      }
    }, null, 2);

    const targetLabel = targetType === 'find_input' ? 'Input' : 'Output';
    promptInstruction = `- Question stem: "The table below shows the inputs and outputs of a number machine. Find the missing ${targetLabel} value marked with a question mark (?)."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    // Row 0 is guaranteed complete
    const sampleInp = Number(rows[0][0]);
    const sampleOut = Number(rows[0][1]);
    const sampleHigh = Math.max(sampleInp, sampleOut);
    const sampleLow = Math.min(sampleInp, sampleOut);

    let step2Equation = "";
    if (targetType === 'find_input') {
      step2Equation = isAdd
        ? `${targetOutput} - ${offset} = ${targetInput}`
        : `${targetOutput} + ${offset} = ${targetInput}`;
    } else {
      step2Equation = isAdd
        ? `${targetInput} + ${offset} = ${targetOutput}`
        : `${targetInput} - ${offset} = ${targetOutput}`;
    }

    if (isMCQ) {
      const oppositeAns = targetType === 'find_input'
        ? (isAdd ? Number(targetOutput) + offset : Number(targetOutput) - offset)
        : (isAdd ? Number(targetInput) - offset : Number(targetInput) + offset);

      let safeOpposite = oppositeAns;
      if (safeOpposite <= 0 || safeOpposite > 100000) {
        safeOpposite = isAdd ? Number(finalAnswer) - 2000 : Number(finalAnswer) + 2000;
      }

      const carelessAns = Number(finalAnswer) + 1000 <= 100000
        ? Number(finalAnswer) + 1000
        : Number(finalAnswer) - 1000;

      const mcqRes = buildMcqOptions(finalAnswer, [
        { val: offset.toString(), defect: 'CONFUSED_RULE_WITH_ANSWER' },
        { val: safeOpposite.toString(), defect: 'INVERTED_MACHINE_OPERATION' },
        { val: carelessAns.toString(), defect: 'CARELESS_CALCULATION' }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          {
            label: "Write the working equation to find the machine's rule using a completed row:",
            expectedAnswer: `${sampleHigh} - ${sampleLow} = ${offset}`,
            acceptedAnswers: [`${sampleHigh} - ${sampleLow} = ${offset}`, `${sampleHigh}-${sampleLow}=${offset}`]
          },
          {
            label: `Write the working equation to find the missing ${targetLabel}:`,
            expectedAnswer: step2Equation,
            acceptedAnswers: [step2Equation, step2Equation.replace(/\s+/g, '')]
          }
        ]
      }, null, 2);
    }

    ruleDesc = isAdd ? `adding ${offset} to the Input` : `subtracting ${offset} from the Input`;
    hint = `Compare the completed Input and Output pairs in the table (${sampleHigh} - ${sampleLow} = ${offset}). Apply this constant relationship (${ruleDesc}) to find the missing ${targetLabel}.`;

  // ==========================================================================
  // VARIANT 4: standard_growing_shrinking_interval (Difference of Differences)
  // ==========================================================================
  } else if (resolvedVariant === 'standard_growing_shrinking_interval') {
    let chosenVariety = varietyStr;
    let isGrowing = true;
    if (chosenVariety.includes('shrinking')) {
      isGrowing = false;
    } else if (chosenVariety.includes('growing')) {
      isGrowing = true;
    } else {
      isGrowing = Math.random() < 0.5;
    }

    let missingPosMode = 'random';
    if (chosenVariety.includes('missing_start') || chosenVariety.includes('start')) {
      missingPosMode = 'start';
    } else if (chosenVariety.includes('missing_end') || chosenVariety.includes('end')) {
      missingPosMode = 'end';
    } else if (chosenVariety.includes('missing_middle') || chosenVariety.includes('middle')) {
      missingPosMode = 'middle';
    }

    const rateOptions = [100, 200, 250, 500, 1000];
    const k = rateOptions[Math.floor(Math.random() * rateOptions.length)];

    let intervals = [];
    if (isGrowing) {
      intervals = [k, 2 * k, 3 * k, 4 * k];
    } else {
      intervals = [4 * k, 3 * k, 2 * k, k];
    }

    // Keep numbers comfortably within [1000, 100000]
    const totalGrowth = intervals.reduce((a, b) => a + b, 0);
    const maxStart = 100000 - totalGrowth - 5000;
    const startVal = (Math.floor(Math.random() * Math.max(1, (maxStart - 10000) / 1000))) * 1000 + 10000;

    const pattern = [startVal];
    for (let i = 0; i < 4; i++) {
      pattern.push(pattern[i] + intervals[i]);
    }

    // Determine missingIndex dynamically across positions [0, 1, 2, 3, 4]
    let missingIndex = 4;
    if (missingPosMode === 'end') {
      missingIndex = 4;
    } else if (missingPosMode === 'start') {
      missingIndex = 0;
    } else if (missingPosMode === 'middle') {
      missingIndex = [1, 2, 3][Math.floor(Math.random() * 3)];
    } else {
      missingIndex = [0, 1, 2, 3, 4][Math.floor(Math.random() * 5)];
    }

    const correctNum = pattern[missingIndex];
    finalAnswer = correctNum.toString();

    const displayNodes = pattern.map((num, idx) => idx === missingIndex ? "?" : num.toString());

    visualEngineStr = JSON.stringify({
      componentToRender: "NUMBER_SEQUENCE_BLOCKS",
      componentData: {
        nodes: displayNodes,
        orientation: "horizontal"
      }
    }, null, 2);

    promptInstruction = `- Question stem: "Find the missing number in the number pattern: ${displayNodes.join(', ')}."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    let step1Expected = "";
    let step1Accepted = [];
    let step2Expected = "";
    let step3Expected = "";
    let step3Accepted = [];
    let distractors = [];

    if (missingIndex === 4) {
      // Missing End: N0, N1, N2, N3, ?
      step1Expected = `${pattern[1]} - ${pattern[0]} = ${intervals[0]}, ${pattern[2]} - ${pattern[1]} = ${intervals[1]}`;
      step1Accepted = [
        step1Expected,
        `${pattern[1]}-${pattern[0]}=${intervals[0]}, ${pattern[2]}-${pattern[1]}=${intervals[1]}`,
        `${pattern[1]}-${pattern[0]}=${intervals[0]},${pattern[2]}-${pattern[1]}=${intervals[1]}`
      ];
      step2Expected = intervals[3].toString();
      step3Expected = `${pattern[3]} + ${intervals[3]} = ${pattern[4]}`;
      step3Accepted = [step3Expected, step3Expected.replace(/\s+/g, '')];

      distractors = [
        { val: (pattern[3] + intervals[2]).toString(), defect: 'CONSTANT_INTERVAL_MISCONCEPTION' },
        { val: (pattern[3] + k).toString(), defect: 'ADDED_RATE_INCORRECTLY' },
        { val: (pattern[4] + k).toString(), defect: 'WRONG_INTERVAL_INCREMENT' }
      ];
      hint = `Calculate the differences between consecutive terms: ${pattern[1]} - ${pattern[0]} = ${intervals[0]}, ${pattern[2]} - ${pattern[1]} = ${intervals[1]}. Notice how the jump size changes by ${k} each time, so the next jump will be +${intervals[3]}.`;

    } else if (missingIndex === 3) {
      // Missing Term 4: N0, N1, N2, ?, N4
      step1Expected = `${pattern[1]} - ${pattern[0]} = ${intervals[0]}, ${pattern[2]} - ${pattern[1]} = ${intervals[1]}`;
      step1Accepted = [
        step1Expected,
        `${pattern[1]}-${pattern[0]}=${intervals[0]}, ${pattern[2]}-${pattern[1]}=${intervals[1]}`,
        `${pattern[1]}-${pattern[0]}=${intervals[0]},${pattern[2]}-${pattern[1]}=${intervals[1]}`
      ];
      step2Expected = intervals[2].toString();
      step3Expected = `${pattern[2]} + ${intervals[2]} = ${pattern[3]}`;
      step3Accepted = [
        step3Expected,
        step3Expected.replace(/\s+/g, ''),
        `${pattern[4]} - ${intervals[3]} = ${pattern[3]}`,
        `${pattern[4]}-${intervals[3]}=${pattern[3]}`
      ];

      distractors = [
        { val: (pattern[2] + intervals[1]).toString(), defect: 'CONSTANT_INTERVAL_MISCONCEPTION' },
        { val: (pattern[2] + k).toString(), defect: 'ADDED_RATE_INCORRECTLY' },
        { val: (pattern[3] + k).toString(), defect: 'WRONG_INTERVAL_INCREMENT' }
      ];
      hint = `Calculate the differences between the first three terms: ${pattern[1]} - ${pattern[0]} = ${intervals[0]}, ${pattern[2]} - ${pattern[1]} = ${intervals[1]}. The jump size changes by ${k} each time, so the jump to the missing number is +${intervals[2]}.`;

    } else if (missingIndex === 2) {
      // Missing Term 3: N0, N1, ?, N3, N4
      step1Expected = `${pattern[1]} - ${pattern[0]} = ${intervals[0]}, ${pattern[4]} - ${pattern[3]} = ${intervals[3]}`;
      step1Accepted = [
        step1Expected,
        `${pattern[1]}-${pattern[0]}=${intervals[0]}, ${pattern[4]}-${pattern[3]}=${intervals[3]}`,
        `${pattern[1]}-${pattern[0]}=${intervals[0]},${pattern[4]}-${pattern[3]}=${intervals[3]}`
      ];
      step2Expected = intervals[1].toString();
      step3Expected = `${pattern[1]} + ${intervals[1]} = ${pattern[2]}`;
      step3Accepted = [
        step3Expected,
        step3Expected.replace(/\s+/g, ''),
        `${pattern[3]} - ${intervals[2]} = ${pattern[2]}`,
        `${pattern[3]}-${intervals[2]}=${pattern[2]}`
      ];

      distractors = [
        { val: (pattern[1] + intervals[0]).toString(), defect: 'CONSTANT_INTERVAL_MISCONCEPTION' },
        { val: (pattern[1] + k).toString(), defect: 'ADDED_RATE_INCORRECTLY' },
        { val: (pattern[2] + k).toString(), defect: 'WRONG_INTERVAL_INCREMENT' }
      ];
      hint = `Compare the differences at the ends: ${pattern[1]} - ${pattern[0]} = ${intervals[0]} and ${pattern[4]} - ${pattern[3]} = ${intervals[3]}. The jump size changes by ${k} each time, so add ${intervals[1]} to ${pattern[1]} to find the missing number.`;

    } else if (missingIndex === 1) {
      // Missing Term 2: N0, ?, N2, N3, N4
      step1Expected = `${pattern[3]} - ${pattern[2]} = ${intervals[2]}, ${pattern[4]} - ${pattern[3]} = ${intervals[3]}`;
      step1Accepted = [
        step1Expected,
        `${pattern[3]}-${pattern[2]}=${intervals[2]}, ${pattern[4]}-${pattern[3]}=${intervals[3]}`,
        `${pattern[3]}-${pattern[2]}=${intervals[2]},${pattern[4]}-${pattern[3]}=${intervals[3]}`
      ];
      step2Expected = intervals[0].toString();
      step3Expected = `${pattern[0]} + ${intervals[0]} = ${pattern[1]}`;
      step3Accepted = [
        step3Expected,
        step3Expected.replace(/\s+/g, ''),
        `${pattern[2]} - ${intervals[1]} = ${pattern[1]}`,
        `${pattern[2]}-${intervals[1]}=${pattern[1]}`
      ];

      distractors = [
        { val: (pattern[0] + intervals[1]).toString(), defect: 'CONSTANT_INTERVAL_MISCONCEPTION' },
        { val: (pattern[0] + k).toString(), defect: 'ADDED_RATE_INCORRECTLY' },
        { val: (pattern[1] + k).toString(), defect: 'WRONG_INTERVAL_INCREMENT' }
      ];
      hint = `Compare the known consecutive terms: ${pattern[3]} - ${pattern[2]} = ${intervals[2]}, ${pattern[4]} - ${pattern[3]} = ${intervals[3]}. The jump size changes by ${k} each time. Working backwards, the first jump is +${intervals[0]}.`;

    } else {
      // Missing Term 1 (Start): ?, N1, N2, N3, N4
      step1Expected = `${pattern[2]} - ${pattern[1]} = ${intervals[1]}, ${pattern[3]} - ${pattern[2]} = ${intervals[2]}`;
      step1Accepted = [
        step1Expected,
        `${pattern[2]}-${pattern[1]}=${intervals[1]}, ${pattern[3]}-${pattern[2]}=${intervals[2]}`,
        `${pattern[2]}-${pattern[1]}=${intervals[1]},${pattern[3]}-${pattern[2]}=${intervals[2]}`
      ];
      step2Expected = intervals[0].toString();
      step3Expected = `${pattern[1]} - ${intervals[0]} = ${pattern[0]}`;
      step3Accepted = [step3Expected, step3Expected.replace(/\s+/g, '')];

      distractors = [
        { val: (pattern[1] + intervals[0]).toString(), defect: 'REVERSED_OPERATION_SIGN' },
        { val: (pattern[1] - intervals[1]).toString(), defect: 'CONSTANT_INTERVAL_MISCONCEPTION' },
        { val: (pattern[1] - k).toString(), defect: 'ADDED_RATE_INCORRECTLY' }
      ];
      hint = `Find the differences between the given terms: ${pattern[2]} - ${pattern[1]} = ${intervals[1]}, ${pattern[3]} - ${pattern[2]} = ${intervals[2]}. The jump size changes by ${k} each time. Subtract the first interval (${intervals[0]}) from ${pattern[1]} to find the 1st number.`;
    }

    if (isMCQ) {
      const mcqRes = buildMcqOptions(finalAnswer, distractors);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          {
            label: "Write the working equations to find the known intervals:",
            expectedAnswer: step1Expected,
            acceptedAnswers: step1Accepted
          },
          {
            label: "What is the interval to the missing number?",
            expectedAnswer: step2Expected,
            acceptedAnswers: [step2Expected, `+${step2Expected}`, `+ ${step2Expected}`]
          },
          {
            label: "Write the working equation to find the missing number:",
            expectedAnswer: step3Expected,
            acceptedAnswers: step3Accepted
          }
        ]
      }, null, 2);
    }

    ruleDesc = isGrowing
      ? `increasing intervals (+${intervals[0]}, +${intervals[1]}, +${intervals[2]}, +${intervals[3]})`
      : `decreasing intervals (+${intervals[0]}, +${intervals[1]}, +${intervals[2]}, +${intervals[3]})`;

  // ==========================================================================
  // VARIANT 5: standard_equation_sequence_hybrid
  // ==========================================================================
  } else if (resolvedVariant === 'standard_equation_sequence_hybrid') {
    let chosenVariety = varietyStr;
    const isDiff = chosenVariety.includes('diff') || (!chosenVariety.includes('sum') && Math.random() < 0.5);
    const isDescending = chosenVariety.includes('descending') || Math.random() < 0.25;

    const stepOptions = [500, 1000, 1500, 2000, 2500, 3000, 5000];
    const d = stepOptions[Math.floor(Math.random() * stepOptions.length)];

    let startVal = 20000;
    if (!isDiff) {
      // Must ensure A + B <= 95000 => startVal <= (95000 - 8*d) / 2
      const maxStartSum = Math.floor((95000 - (8 * d)) / 2000) * 1000;
      if (isDescending) {
        const minStart = (4 * d) + 5000;
        const maxStart = Math.min(75000, maxStartSum);
        startVal = Math.floor(Math.random() * Math.max(1, (maxStart - minStart) / 1000)) * 1000 + minStart;
      } else {
        const maxStart = Math.min(38000, maxStartSum);
        startVal = (Math.floor(Math.random() * Math.max(1, (maxStart - 8000) / 1000))) * 1000 + 8000;
      }
    } else {
      if (isDescending) {
        // Must ensure startVal - 4*d >= 2000
        const minStart = (4 * d) + 5000;
        const maxStart = 85000;
        startVal = Math.floor(Math.random() * Math.max(1, (maxStart - minStart) / 1000)) * 1000 + minStart;
      } else {
        // Must ensure startVal + 4*d <= 95000
        const maxStart = 95000 - (4 * d);
        startVal = (Math.floor(Math.random() * Math.max(1, (maxStart - 10000) / 1000))) * 1000 + 10000;
      }
    }

    const pattern = [];
    for (let i = 0; i < 5; i++) {
      pattern.push(isDescending ? startVal - (i * d) : startVal + (i * d));
    }

    // 7 valid configurations of pair positions where each missing term is adjacent to at least one known term
    const validConfigurations = [
      [0, 2],
      [0, 3],
      [0, 4],
      [1, 2],
      [1, 4],
      [2, 3],
      [2, 4]
    ];
    const chosenPair = validConfigurations[Math.floor(Math.random() * validConfigurations.length)];

    // Randomize whether A or B comes first
    const flipLetters = Math.random() < 0.5;
    const idxA = flipLetters ? chosenPair[1] : chosenPair[0];
    const idxB = flipLetters ? chosenPair[0] : chosenPair[1];

    const aVal = pattern[idxA];
    const bVal = pattern[idxB];

    const largerVal = Math.max(aVal, bVal);
    const smallerVal = Math.min(aVal, bVal);
    const largerLetter = aVal >= bVal ? "A" : "B";
    const smallerLetter = aVal >= bVal ? "B" : "A";

    const operationLabel = isDiff ? `${largerLetter} - ${smallerLetter}` : "A + B";
    finalAnswer = isDiff ? (largerVal - smallerVal).toString() : (aVal + bVal).toString();

    const displayNodes = pattern.map((num, idx) => {
      if (idx === idxA) return "A";
      if (idx === idxB) return "B";
      return num.toString();
    });

    visualEngineStr = JSON.stringify({
      componentToRender: "NUMBER_SEQUENCE_BLOCKS",
      componentData: {
        nodes: displayNodes,
        orientation: "horizontal"
      }
    }, null, 2);

    promptInstruction = `- Question stem: "In the number pattern: ${displayNodes.join(', ')}, find the value of ${operationLabel}."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    // Find known adjacent pair to deduce step d
    const knownIndices = [0, 1, 2, 3, 4].filter(i => i !== idxA && i !== idxB);
    let p1 = knownIndices[0], p2 = knownIndices[1];
    for (let i = 0; i < knownIndices.length - 1; i++) {
      if (knownIndices[i + 1] === knownIndices[i] + 1) {
        p1 = knownIndices[i];
        p2 = knownIndices[i + 1];
        break;
      }
    }
    const highKnown = Math.max(pattern[p1], pattern[p2]);
    const lowKnown = Math.min(pattern[p1], pattern[p2]);

    // Equations to find A
    let aPrimaryEq = "";
    const aAccepted = [];
    if (idxA > 0 && idxA - 1 !== idxB) {
      const left = pattern[idxA - 1];
      const op = isDescending ? '-' : '+';
      aPrimaryEq = `${left} ${op} ${d} = ${aVal}`;
      aAccepted.push(aPrimaryEq, `${left}${op}${d}=${aVal}`);
    }
    if (idxA < 4 && idxA + 1 !== idxB) {
      const right = pattern[idxA + 1];
      const op = isDescending ? '+' : '-';
      const eq = `${right} ${op} ${d} = ${aVal}`;
      if (!aPrimaryEq) aPrimaryEq = eq;
      aAccepted.push(eq, `${right}${op}${d}=${aVal}`);
    }

    // Equations to find B
    let bPrimaryEq = "";
    const bAccepted = [];
    if (idxB > 0 && idxB - 1 !== idxA) {
      const left = pattern[idxB - 1];
      const op = isDescending ? '-' : '+';
      bPrimaryEq = `${left} ${op} ${d} = ${bVal}`;
      bAccepted.push(bPrimaryEq, `${left}${op}${d}=${bVal}`);
    }
    if (idxB < 4 && idxB + 1 !== idxA) {
      const right = pattern[idxB + 1];
      const op = isDescending ? '+' : '-';
      const eq = `${right} ${op} ${d} = ${bVal}`;
      if (!bPrimaryEq) bPrimaryEq = eq;
      bAccepted.push(eq, `${right}${op}${d}=${bVal}`);
    }

    // Equation for combining A and B
    let step4PrimaryEq = "";
    let step4Accepted = [];
    if (isDiff) {
      step4PrimaryEq = `${largerVal} - ${smallerVal} = ${finalAnswer}`;
      step4Accepted = [step4PrimaryEq, step4PrimaryEq.replace(/\s+/g, '')];
    } else {
      step4PrimaryEq = `${aVal} + ${bVal} = ${finalAnswer}`;
      step4Accepted = [
        step4PrimaryEq,
        step4PrimaryEq.replace(/\s+/g, ''),
        `${bVal} + ${aVal} = ${finalAnswer}`,
        `${bVal}+${aVal}=${finalAnswer}`
      ];
    }

    if (isMCQ) {
      const oppositeAns = isDiff ? (aVal + bVal) : (largerVal - smallerVal);
      let safeOpposite = oppositeAns.toString();
      if (oppositeAns <= 0 || oppositeAns > 100000) {
        safeOpposite = (Number(finalAnswer) + d).toString();
      }

      const mcqRes = buildMcqOptions(finalAnswer, [
        { val: bVal.toString(), defect: 'RETURNED_SINGLE_TERM_B' },
        { val: aVal.toString(), defect: 'RETURNED_SINGLE_TERM_A' },
        { val: safeOpposite, defect: 'WRONG_OPERATION_APPLIED' }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          {
            label: "Write the working equation to find the pattern rule using the adjacent numbers:",
            expectedAnswer: `${highKnown} - ${lowKnown} = ${d}`,
            acceptedAnswers: [`${highKnown} - ${lowKnown} = ${d}`, `${highKnown}-${lowKnown}=${d}`]
          },
          {
            label: "Write the working equation to find the value of A:",
            expectedAnswer: aPrimaryEq,
            acceptedAnswers: aAccepted
          },
          {
            label: "Write the working equation to find the value of B:",
            expectedAnswer: bPrimaryEq,
            acceptedAnswers: bAccepted
          },
          {
            label: `Write the working equation to find ${operationLabel}:`,
            expectedAnswer: step4PrimaryEq,
            acceptedAnswers: step4Accepted
          }
        ]
      }, null, 2);
    }

    ruleDesc = `${isDescending ? 'subtracting' : 'adding'} a constant step of ${d}`;
    hint = `First find the pattern rule using the two adjacent numbers (${highKnown} - ${lowKnown} = ${d}). Then find A (${aPrimaryEq}) and B (${bPrimaryEq}). Finally, calculate ${operationLabel}.`;

  // ==========================================================================
  // VARIANT 6: standard_pattern_crossing
  // ==========================================================================
  } else {
    let step = 0;
    let start = 0;
    let boundaryDesc = "";

    const standardVarieties = [
      'add_cross_thousands',
      'subtract_cross_thousands',
      'add_cross_ten_thousands',
      'subtract_cross_ten_thousands',
      'reach_100000'
    ];

    let chosenVariety = varietyStr;
    if (!chosenVariety || !standardVarieties.includes(chosenVariety)) {
      chosenVariety = standardVarieties[Math.floor(Math.random() * standardVarieties.length)];
    }

    if (chosenVariety === 'add_cross_thousands') {
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

    visualEngineStr = JSON.stringify({
      componentToRender: "NUMBER_SEQUENCE_BLOCKS",
      componentData: {
        nodes: displayNodes,
        orientation: "horizontal"
      }
    }, null, 2);

    promptInstruction = `- Question stem: "Find the missing number in the number pattern: ${displayNodes.join(', ')}."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

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
    } else if (isStructure) {
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

    hint = `Find the constant difference between two adjacent numbers in the sequence (${highVal} - ${lowVal} = ${absStep}). When ${ruleDesc}, take special care when ${boundaryDesc}.`;
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
3. Provide step-by-step solution steps separated by \\n and an encouraging conceptual hint: ${hint}
4. Forbid using "STORY:" or any instructional prefix in the output.
5. In visualEngine, do NOT provide or output interval numbers on the arrows (do NOT provide overlapping details that spoil the step size). Keep arrows plain.

${getFormatInstructions(visualEngineStr, inputRequirementStr, resolvedVariant)}`;

  return { aiPrompt };
}
