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
    if (!['alternating_add_sub', 'alternating_sub_add', 'alternating_add_add'].includes(chosenVariety)) {
      chosenVariety = ['alternating_add_sub', 'alternating_sub_add', 'alternating_add_add'][Math.floor(Math.random() * 3)];
    }

    let a = 1500;
    let b = 500;
    let op1Sign = '+';
    let op2Sign = '-';
    let op1Val = 1500;
    let op2Val = 500;
    let startVal = 50000;

    if (chosenVariety === 'alternating_add_sub') {
      const aOptions = [1000, 1500, 2000, 2500, 3000];
      const bOptions = [300, 500, 600, 800, 1000];
      a = aOptions[Math.floor(Math.random() * aOptions.length)];
      b = bOptions[Math.floor(Math.random() * bOptions.length)];
      op1Sign = '+';
      op2Sign = '-';
      op1Val = a;
      op2Val = b;
      startVal = (Math.floor(Math.random() * 30) + 20) * 1000;
    } else if (chosenVariety === 'alternating_sub_add') {
      const aOptions = [1000, 1500, 2000, 2500];
      const bOptions = [300, 500, 800, 1000];
      a = aOptions[Math.floor(Math.random() * aOptions.length)];
      b = bOptions[Math.floor(Math.random() * bOptions.length)];
      op1Sign = '-';
      op2Sign = '+';
      op1Val = a;
      op2Val = b;
      startVal = (Math.floor(Math.random() * 30) + 40) * 1000;
    } else {
      // alternating_add_add
      a = [500, 1000, 1500][Math.floor(Math.random() * 3)];
      b = [2000, 2500, 3000][Math.floor(Math.random() * 3)];
      op1Sign = '+';
      op2Sign = '+';
      op1Val = a;
      op2Val = b;
      startVal = (Math.floor(Math.random() * 20) + 15) * 1000;
    }

    const pattern = [];
    let curr = startVal;
    for (let i = 0; i < 6; i++) {
      pattern.push(curr);
      curr += (i % 2 === 0 ? (op1Sign === '+' ? op1Val : -op1Val) : (op2Sign === '+' ? op2Val : -op2Val));
    }

    // Missing term is term 4 (index 4) so students see first 4 numbers [0, 1, 2, 3] to identify both rules
    const missingIndex = 4;
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

    const high01 = Math.max(pattern[0], pattern[1]);
    const low01 = Math.min(pattern[0], pattern[1]);
    const high12 = Math.max(pattern[1], pattern[2]);
    const low12 = Math.min(pattern[1], pattern[2]);

    // From pattern[3] to pattern[4] uses rule 1 (op1)
    const prevNum = pattern[3];
    const step3Equation = `${prevNum} ${op1Sign} ${op1Val} = ${correctNum}`;

    if (isMCQ) {
      const wrongRuleNum = op2Sign === '+' ? prevNum + op2Val : prevNum - op2Val;
      const reverseRuleNum = op1Sign === '+' ? prevNum - op1Val : prevNum + op1Val;
      const mcqRes = buildMcqOptions(finalAnswer, [
        { val: wrongRuleNum.toString(), defect: 'APPLIED_WRONG_ALTERNATING_RULE' },
        { val: reverseRuleNum.toString(), defect: 'REVERSED_OPERATION_SIGN' },
        { val: pattern[3].toString(), defect: 'RETURNED_PREVIOUS_TERM' }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          {
            label: "Write the working equation to find the first alternating rule:",
            expectedAnswer: `${high01} - ${low01} = ${op1Val}`,
            acceptedAnswers: [`${high01} - ${low01} = ${op1Val}`, `${high01}-${low01}=${op1Val}`]
          },
          {
            label: "Write the working equation to find the second alternating rule:",
            expectedAnswer: `${high12} - ${low12} = ${op2Val}`,
            acceptedAnswers: [`${high12} - ${low12} = ${op2Val}`, `${high12}-${low12}=${op2Val}`]
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
    if (!['find_input', 'find_output'].includes(chosenVariety)) {
      chosenVariety = Math.random() < 0.5 ? 'find_input' : 'find_output';
    }

    const offsets = [1500, 2400, 5000, 12000, 15000, 24000, 35000, 44000];
    const offset = offsets[Math.floor(Math.random() * offsets.length)];
    const isAdd = Math.random() < 0.7; // Output = Input + offset or Input - offset

    const baseInputs = [
      (Math.floor(Math.random() * 10) + 10) * 1000, // e.g. 24000
      (Math.floor(Math.random() * 10) + 25) * 1000, // e.g. 35000
      (Math.floor(Math.random() * 10) + 40) * 1000, // e.g. 45000 (Target)
      (Math.floor(Math.random() * 10) + 55) * 1000  // e.g. 60000
    ];

    const rows = baseInputs.map(inp => {
      const out = isAdd ? inp + offset : inp - offset;
      return [inp.toString(), out.toString()];
    });

    const targetRowIdx = 2;
    const targetInput = rows[targetRowIdx][0];
    const targetOutput = rows[targetRowIdx][1];

    if (chosenVariety === 'find_input') {
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

    const targetLabel = chosenVariety === 'find_input' ? 'Input' : 'Output';
    promptInstruction = `- Question stem: "The table below shows the inputs and outputs of a number machine. Find the missing ${targetLabel} value marked with a question mark (?)."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    const row0High = Math.max(Number(rows[0][0]), Number(rows[0][1]));
    const row0Low = Math.min(Number(rows[0][0]), Number(rows[0][1]));

    let step2Equation = "";
    if (chosenVariety === 'find_input') {
      step2Equation = isAdd
        ? `${targetOutput} - ${offset} = ${targetInput}`
        : `${targetOutput} + ${offset} = ${targetInput}`;
    } else {
      step2Equation = isAdd
        ? `${targetInput} + ${offset} = ${targetOutput}`
        : `${targetInput} - ${offset} = ${targetOutput}`;
    }

    if (isMCQ) {
      const oppositeAns = chosenVariety === 'find_input'
        ? (isAdd ? Number(targetOutput) + offset : Number(targetOutput) - offset).toString()
        : (isAdd ? Number(targetInput) - offset : Number(targetInput) + offset).toString();

      const mcqRes = buildMcqOptions(finalAnswer, [
        { val: offset.toString(), defect: 'CONFUSED_RULE_WITH_ANSWER' },
        { val: oppositeAns, defect: 'INVERTED_MACHINE_OPERATION' },
        { val: (Number(finalAnswer) + 1000).toString(), defect: 'CARELESS_CALCULATION' }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          {
            label: "Write the working equation to find the machine's rule using a completed row:",
            expectedAnswer: `${row0High} - ${row0Low} = ${offset}`,
            acceptedAnswers: [`${row0High} - ${row0Low} = ${offset}`, `${row0High}-${row0Low}=${offset}`]
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
    hint = `Compare the completed Input and Output pairs in the table (${row0High} - ${row0Low} = ${offset}). Apply this constant relationship (${ruleDesc}) to find the missing ${targetLabel}.`;

  // ==========================================================================
  // VARIANT 4: standard_growing_shrinking_interval (Difference of Differences)
  // ==========================================================================
  } else if (resolvedVariant === 'standard_growing_shrinking_interval') {
    let chosenVariety = varietyStr;
    if (!['growing_intervals', 'shrinking_intervals'].includes(chosenVariety)) {
      chosenVariety = Math.random() < 0.5 ? 'growing_intervals' : 'shrinking_intervals';
    }

    const isGrowing = chosenVariety === 'growing_intervals';
    const rateOptions = [100, 200, 500];
    const k = rateOptions[Math.floor(Math.random() * rateOptions.length)];

    let intervals = [];
    if (isGrowing) {
      intervals = [k, 2 * k, 3 * k, 4 * k];
    } else {
      intervals = [4 * k, 3 * k, 2 * k, k];
    }

    const startVal = (Math.floor(Math.random() * 30) + 20) * 1000;
    const pattern = [startVal];
    for (let i = 0; i < 4; i++) {
      pattern.push(pattern[i] + intervals[i]);
    }

    // Pattern terms: N0, N1, N2, N3, N4 (missing is N4)
    finalAnswer = pattern[4].toString();
    const displayNodes = [pattern[0].toString(), pattern[1].toString(), pattern[2].toString(), pattern[3].toString(), "?"];

    visualEngineStr = JSON.stringify({
      componentToRender: "NUMBER_SEQUENCE_BLOCKS",
      componentData: {
        nodes: displayNodes,
        orientation: "horizontal"
      }
    }, null, 2);

    promptInstruction = `- Question stem: "Find the next number in the number pattern: ${pattern[0]}, ${pattern[1]}, ${pattern[2]}, ${pattern[3]}, ?."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    const d1 = intervals[0];
    const d2 = intervals[1];
    const nextInterval = intervals[3];
    const step3Equation = `${pattern[3]} + ${nextInterval} = ${pattern[4]}`;

    if (isMCQ) {
      const repeatedInterval = pattern[3] + intervals[2]; // repeated previous jump
      const addedRateOnly = pattern[3] + k; // added rate directly
      const mcqRes = buildMcqOptions(finalAnswer, [
        { val: repeatedInterval.toString(), defect: 'CONSTANT_INTERVAL_MISCONCEPTION' },
        { val: addedRateOnly.toString(), defect: 'ADDED_RATE_INCORRECTLY' },
        { val: (pattern[4] + k).toString(), defect: 'WRONG_INTERVAL_INCREMENT' }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          {
            label: "Write the working equations to find the first two intervals:",
            expectedAnswer: `${pattern[1]} - ${pattern[0]} = ${d1}, ${pattern[2]} - ${pattern[1]} = ${d2}`,
            acceptedAnswers: [
              `${pattern[1]} - ${pattern[0]} = ${d1}, ${pattern[2]} - ${pattern[1]} = ${d2}`,
              `${pattern[1]}-${pattern[0]}=${d1}, ${pattern[2]}-${pattern[1]}=${d2}`,
              `${pattern[1]}-${pattern[0]}=${d1},${pattern[2]}-${pattern[1]}=${d2}`
            ]
          },
          {
            label: "What is the next interval amount?",
            expectedAnswer: nextInterval.toString(),
            acceptedAnswers: [nextInterval.toString(), `+${nextInterval}`, `+ ${nextInterval}`]
          },
          {
            label: "Write the working equation to find the missing number:",
            expectedAnswer: step3Equation,
            acceptedAnswers: [step3Equation, step3Equation.replace(/\s+/g, '')]
          }
        ]
      }, null, 2);
    }

    ruleDesc = isGrowing ? `increasing intervals (+${d1}, +${d2}, +${intervals[2]}, +${nextInterval})` : `decreasing intervals (+${d1}, +${d2}, +${intervals[2]}, +${nextInterval})`;
    hint = `Calculate the differences between consecutive terms: ${pattern[1]} - ${pattern[0]} = ${d1}, ${pattern[2]} - ${pattern[1]} = ${d2}. Notice how the jump size changes by ${k} each time, so the next jump will be +${nextInterval}.`;

  // ==========================================================================
  // VARIANT 5: standard_equation_sequence_hybrid
  // ==========================================================================
  } else if (resolvedVariant === 'standard_equation_sequence_hybrid') {
    let chosenVariety = varietyStr;
    if (!['find_difference', 'find_sum'].includes(chosenVariety)) {
      chosenVariety = Math.random() < 0.5 ? 'find_difference' : 'find_sum';
    }

    const stepOptions = [500, 1000, 2000, 2500, 3000, 5000];
    const d = stepOptions[Math.floor(Math.random() * stepOptions.length)];
    const startVal = (Math.floor(Math.random() * 20) + 15) * 1000;

    // Terms: N0, A (N1), N2, N3, B (N4)
    const n0 = startVal;
    const aVal = n0 + d;
    const n2 = n0 + (2 * d);
    const n3 = n0 + (3 * d);
    const bVal = n0 + (4 * d);

    const isDiff = chosenVariety === 'find_difference';
    finalAnswer = isDiff ? (bVal - aVal).toString() : (aVal + bVal).toString();

    visualEngineStr = JSON.stringify({
      componentToRender: "NUMBER_SEQUENCE_BLOCKS",
      componentData: {
        nodes: [n0.toString(), "A", n2.toString(), n3.toString(), "B"],
        orientation: "horizontal"
      }
    }, null, 2);

    const operationLabel = isDiff ? "B - A" : "A + B";
    promptInstruction = `- Question stem: "In the number pattern: ${n0}, A, ${n2}, ${n3}, B, find the value of ${operationLabel}."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    const step4Equation = isDiff
      ? `${bVal} - ${aVal} = ${finalAnswer}`
      : `${aVal} + ${bVal} = ${finalAnswer}`;

    if (isMCQ) {
      const oppositeAns = isDiff ? (aVal + bVal).toString() : (bVal - aVal).toString();
      const mcqRes = buildMcqOptions(finalAnswer, [
        { val: bVal.toString(), defect: 'RETURNED_SINGLE_TERM_B' },
        { val: aVal.toString(), defect: 'RETURNED_SINGLE_TERM_A' },
        { val: oppositeAns, defect: 'WRONG_OPERATION_APPLIED' }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          {
            label: "Write the working equation to find the pattern rule:",
            expectedAnswer: `${n3} - ${n2} = ${d}`,
            acceptedAnswers: [`${n3} - ${n2} = ${d}`, `${n3}-${n2}=${d}`]
          },
          {
            label: "Write the working equation to find the value of A:",
            expectedAnswer: `${n0} + ${d} = ${aVal}`,
            acceptedAnswers: [
              `${n0} + ${d} = ${aVal}`,
              `${n0}+${d}=${aVal}`,
              `${n2} - ${d} = ${aVal}`,
              `${n2}-${d}=${aVal}`
            ]
          },
          {
            label: "Write the working equation to find the value of B:",
            expectedAnswer: `${n3} + ${d} = ${bVal}`,
            acceptedAnswers: [`${n3} + ${d} = ${bVal}`, `${n3}+${d}=${bVal}`]
          },
          {
            label: `Write the working equation to find ${operationLabel}:`,
            expectedAnswer: step4Equation,
            acceptedAnswers: [
              step4Equation,
              step4Equation.replace(/\s+/g, ''),
              isDiff ? `${bVal} - ${aVal} = ${finalAnswer}` : `${bVal} + ${aVal} = ${finalAnswer}`,
              isDiff ? `${bVal}-${aVal}=${finalAnswer}` : `${bVal}+${aVal}=${finalAnswer}`
            ]
          }
        ]
      }, null, 2);
    }

    ruleDesc = `a constant step of ${d}`;
    hint = `First find the pattern rule using the two adjacent numbers (${n3} - ${n2} = ${d}). Then find A (${n0} + ${d} = ${aVal}) and B (${n3} + ${d} = ${bVal}). Finally, calculate ${operationLabel}.`;

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
