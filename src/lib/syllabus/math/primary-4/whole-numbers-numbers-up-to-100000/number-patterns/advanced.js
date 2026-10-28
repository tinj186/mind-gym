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
    let candidate = "";
    if (isNaN(numAnswer)) {
      candidate = `${finalAnswer} (Option ${counter})`;
    } else {
      const up = numAnswer + (counter * 1000);
      const down = numAnswer - (counter * 1000);
      candidate = (up <= 98000 ? up : (down > 0 ? down : numAnswer + counter * 100)).toString();
    }
    if (!options.includes(candidate) && candidate !== '0' && Number(candidate) > 0 && Number(candidate) <= 100000) {
      options.push(candidate);
      defectMap[candidate] = 'CARELESS_CALCULATION';
    }
    counter++;
  }

  return {
    options: options.sort(() => Math.random() - 0.5),
    defectMap
  };
}

export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, explicitVariety = null) {
  let promptInstruction = "";
  let finalAnswer = "";
  let options = [];
  let defectMap = {};
  let visualEngineStr = "";
  let inputRequirementStr = null;
  let hint = "";
  let ruleDesc = "";

  // Map legacy aliases to new advanced variants if requested
  const aliasMap = {
    'advanced_alternating_add_sub': 'advanced_interlocking_sequences',
    'advanced_alternating_add_add': 'advanced_interlocking_sequences',
    'advanced_interleaved_sequences': 'advanced_interlocking_sequences',
    'advanced_growing_jumps': 'advanced_accumulated_target_term',
    'advanced_large_jumps': 'advanced_long_jump_deduction',
    'advanced_distant_term_generalization': 'advanced_long_jump_deduction',
    'advanced_two_missing_terms': 'advanced_floating_number_line',
    'advanced_fibonacci_lookback': 'advanced_floating_number_line',
    'advanced_figurate_scaled_patterns': 'advanced_accumulated_target_term',
    'advanced_table_two_step_rule': 'advanced_simultaneous_offset_deduction'
  };

  let resolvedVariant = activeVariant;
  if (aliasMap[resolvedVariant]) {
    resolvedVariant = aliasMap[resolvedVariant];
  }

  const validVariants = [
    'advanced_long_jump_deduction',
    'advanced_floating_number_line',
    'advanced_interlocking_sequences',
    'advanced_accumulated_target_term',
    'advanced_simultaneous_offset_deduction'
  ];

  if (!resolvedVariant || !validVariants.includes(resolvedVariant)) {
    resolvedVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
  }

  const varietyStr = explicitVariety ? String(explicitVariety).toLowerCase() : "";

  // ==========================================================================
  // VARIANT 1: advanced_long_jump_deduction (The Long Jump Deduction: N-th Term)
  // ==========================================================================
  if (resolvedVariant === 'advanced_long_jump_deduction') {
    let chosenVariety = varietyStr;

    let targetN = 10;
    if (chosenVariety.includes('6_to_8')) {
      targetN = [6, 7, 8][Math.floor(Math.random() * 3)];
    } else if (chosenVariety.includes('9_to_10')) {
      targetN = [9, 10][Math.floor(Math.random() * 2)];
    } else if (chosenVariety.includes('11_to_12')) {
      targetN = [11, 12][Math.floor(Math.random() * 2)];
    } else {
      targetN = [6, 7, 8, 9, 10, 12][Math.floor(Math.random() * 6)];
    }

    const stepOptions = [250, 400, 500, 600, 800, 1000, 1200, 1500, 2000, 2500];
    const d = stepOptions[Math.floor(Math.random() * stepOptions.length)];

    const jumps = targetN - 1;
    const totalJumpVal = jumps * d;

    // Base start between 10 000 and 70 000 so final term stays within 98 000
    const maxT1 = 95000 - totalJumpVal;
    const baseT1 = (Math.floor(Math.random() * Math.max(1, (maxT1 - 10000) / 1000))) * 1000 + 10000;

    const term1 = baseT1;
    const term2 = term1 + d;
    const term3 = term1 + (2 * d);
    const correctNum = term1 + totalJumpVal;
    finalAnswer = correctNum.toString();

    visualEngineStr = JSON.stringify({
      componentToRender: "TABLE_PATTERN_VISUALIZER",
      componentData: {
        title: "Number Pattern Table",
        headers: ["Term", "Value"],
        rows: [
          ["Term 1", term1.toLocaleString()],
          ["Term 2", term2.toLocaleString()],
          ["Term 3", term3.toLocaleString()],
          ["...", "..."],
          [`Term ${targetN}`, "?"]
        ]
      }
    }, null, 2);

    promptInstruction = `- Question stem: "The table shows a number pattern with a constant interval rule. By calculating the total jump value, find the value of Term ${targetN}."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    const step2Eq = `${jumps} * ${d} = ${totalJumpVal}`;
    const step3Eq = `${term1} + ${totalJumpVal} = ${correctNum}`;

    if (isMCQ) {
      const fencepostVal = term1 + (targetN * d);
      const singleStepVal = term3 + d;
      const offByTwoVal = term1 + ((targetN - 2) * d);

      const mcqRes = buildMcqOptions(finalAnswer, [
        { val: fencepostVal.toString(), defect: 'USED_N_JUMPS_INSTEAD_OF_N_MINUS_ONE' },
        { val: singleStepVal.toString(), defect: 'CALCULATED_NEXT_TERM_ONLY' },
        { val: offByTwoVal.toString(), defect: 'OFF_BY_ONE_JUMP_COUNT' }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          {
            label: `How many interval jumps are there from Term 1 to Term ${targetN}?`,
            expectedAnswer: jumps.toString(),
            acceptedAnswers: [jumps.toString(), `${targetN} - 1 = ${jumps}`, `${targetN}-1=${jumps}`]
          },
          {
            label: `Write the working equation to find the total value of all ${jumps} jumps:`,
            expectedAnswer: step2Eq,
            acceptedAnswers: [
              step2Eq,
              step2Eq.replace(/\s+/g, ''),
              `${d} * ${jumps} = ${totalJumpVal}`,
              `${d}*${jumps}=${totalJumpVal}`
            ]
          },
          {
            label: `Write the working equation to find the value of Term ${targetN}:`,
            expectedAnswer: step3Eq,
            acceptedAnswers: [
              step3Eq,
              step3Eq.replace(/\s+/g, ''),
              `${totalJumpVal} + ${term1} = ${correctNum}`,
              `${totalJumpVal}+${term1}=${correctNum}`
            ]
          }
        ]
      }, null, 2);
    }

    ruleDesc = `adding a constant step of ${d}`;
    hint = `From Term 1 to Term ${targetN}, there are ${targetN} - 1 = ${jumps} interval jumps. Calculate the total value of all jumps (${jumps} * ${d} = ${totalJumpVal}) and add it to Term 1 (${term1} + ${totalJumpVal} = ${correctNum}).`;

  // ==========================================================================
  // VARIANT 2: advanced_floating_number_line (Floating Number Line)
  // ==========================================================================
  } else if (resolvedVariant === 'advanced_floating_number_line') {
    let chosenVariety = varietyStr;

    // Pick two interior tick indices: 0: Tick 1, 1: Tick 2, 2: Tick 3, 3: Tick 4, 4: Tick 5, 5: Tick 6
    let idx1 = 1; // Tick 2
    let idx2 = 4; // Tick 5
    if (chosenVariety.includes('2_and_4')) {
      idx1 = 1; idx2 = 3;
    } else if (chosenVariety.includes('3_and_5')) {
      idx1 = 2; idx2 = 4;
    }

    const numJumps = idx2 - idx1;
    const stepOptions = [1000, 1500, 2000, 2500, 3000, 4000, 5000];
    const d = stepOptions[Math.floor(Math.random() * stepOptions.length)];

    const maxTick1 = 90000 - (5 * d);
    const tick1 = (Math.floor(Math.random() * Math.max(1, (maxTick1 - 10000) / 1000))) * 1000 + 10000;
    const tick6 = tick1 + (5 * d);

    const val1 = tick1 + (idx1 * d);
    const val2 = tick1 + (idx2 * d);
    const diffKnown = val2 - val1;

    const findFirst = chosenVariety.includes('find_first_tick');
    const correctNum = findFirst ? tick1 : tick6;
    finalAnswer = correctNum.toString();

    const targetTickLabel = findFirst ? "first tick mark (Tick 1)" : "last tick mark (Tick 6)";

    visualEngineStr = JSON.stringify({
      componentToRender: "NUMBER_LINE_ADVANCED",
      componentData: {
        min: tick1,
        max: tick6,
        numIntervals: 5,
        labeledPoints: [
          { index: 0, label: findFirst ? "Tick 1 (?)" : "Tick 1" },
          { index: idx1, label: val1.toLocaleString() },
          { index: idx2, label: val2.toLocaleString() },
          { index: 5, label: findFirst ? "Tick 6" : "Tick 6 (?)" }
        ]
      }
    }, null, 2);

    promptInstruction = `- Question stem: "The number line below has 6 equally spaced tick marks. Tick ${idx1 + 1} is ${val1.toLocaleString()} and Tick ${idx2 + 1} is ${val2.toLocaleString()}. Find the value of the ${targetTickLabel}."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    const step1Eq = `${val2} - ${val1} = ${diffKnown}`;
    const step2Eq = `${diffKnown} / ${numJumps} = ${d}`;
    const step3Eq = `${val1} - ${idx1 * d} = ${tick1}`;
    const step4Eq = `${val2} + ${(5 - idx2) * d} = ${tick6}`;

    if (isMCQ) {
      const distractorDiffAsStep = val2 + diffKnown;
      const wrongD = Math.floor(diffKnown / (numJumps === 2 ? 3 : 2));
      const distractorWrongJump = findFirst ? val1 - wrongD : val2 + wrongD;
      const distractorReversed = findFirst ? val1 + d : val2 - d;

      const mcqRes = buildMcqOptions(finalAnswer, [
        { val: distractorDiffAsStep.toString(), defect: 'CONFUSED_TOTAL_DIFF_WITH_SINGLE_INTERVAL' },
        { val: distractorWrongJump.toString(), defect: 'WRONG_INTERVAL_COUNT_DIVISION' },
        { val: distractorReversed.toString(), defect: 'REVERSED_OPERATION_DIRECTION' }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          {
            label: `Write the working equation to find the total difference between the two known marks (Tick ${idx1 + 1} and Tick ${idx2 + 1}):`,
            expectedAnswer: step1Eq,
            acceptedAnswers: [step1Eq, step1Eq.replace(/\s+/g, '')]
          },
          {
            label: `Write the working equation to find the value of 1 interval gap (${numJumps} jumps between them):`,
            expectedAnswer: step2Eq,
            acceptedAnswers: [step2Eq, step2Eq.replace(/\s+/g, '')]
          },
          {
            label: "Write the working equation to find the first tick mark (Tick 1):",
            expectedAnswer: step3Eq,
            acceptedAnswers: [step3Eq, step3Eq.replace(/\s+/g, '')]
          },
          {
            label: "Write the working equation to find the last tick mark (Tick 6):",
            expectedAnswer: step4Eq,
            acceptedAnswers: [step4Eq, step4Eq.replace(/\s+/g, '')]
          }
        ]
      }, null, 2);
    }

    ruleDesc = `equal intervals of ${d} along the number line`;
    hint = `First find the difference between the two known marks: ${val2} - ${val1} = ${diffKnown}. There are ${numJumps} jumps between them, so each interval is ${diffKnown} / ${numJumps} = ${d}. To find Tick 1, count backwards: ${val1} - ${idx1 * d} = ${tick1}. To find Tick 6, count forwards: ${val2} + ${(5 - idx2) * d} = ${tick6}.`;

  // ==========================================================================
  // VARIANT 3: advanced_interlocking_sequences (Two Interlocking Sequences)
  // ==========================================================================
  } else if (resolvedVariant === 'advanced_interlocking_sequences') {
    let chosenVariety = varietyStr;
    const isOpposing = chosenVariety.includes('opposing') || (!chosenVariety.includes('both_ascending') && Math.random() < 0.7);

    // Sequence 1 (Odd: index 0, 2, 4, 6): start1, start1 + d1, start1 + 2*d1, start1 + 3*d1
    const d1Options = [1000, 1500, 2000, 2500, 3000];
    const d1 = d1Options[Math.floor(Math.random() * d1Options.length)];
    const start1 = (Math.floor(Math.random() * 20) + 10) * 1000; // 10 000 to 29 000

    // Sequence 2 (Even: index 1, 3, 5, 7): start2, start2 +/- d2...
    const d2Options = [1000, 2000, 2500, 3000, 5000];
    const d2 = d2Options[Math.floor(Math.random() * d2Options.length)];
    const d2Sign = isOpposing ? -1 : 1;
    const start2 = isOpposing
      ? (Math.floor(Math.random() * 15) + 65) * 1000 // 65 000 to 79 000
      : (Math.floor(Math.random() * 15) + 35) * 1000;

    const termA = start1 + (3 * d1);
    const termB = start2 + (3 * d2Sign * d2);

    const patternDisplay = [
      start1.toString(),
      start2.toString(),
      (start1 + d1).toString(),
      (start2 + d2Sign * d2).toString(),
      (start1 + 2 * d1).toString(),
      (start2 + 2 * d2Sign * d2).toString(),
      "A",
      "B"
    ];

    const findSum = chosenVariety.includes('sum');
    const findB = chosenVariety.includes('missing_b');
    const correctNum = findSum ? (termA + termB) : (findB ? termB : termA);
    finalAnswer = correctNum.toString();

    visualEngineStr = JSON.stringify({
      componentToRender: "NUMBER_SEQUENCE_BLOCKS",
      componentData: {
        nodes: patternDisplay,
        nodeColors: ["blue", "orange", "blue", "orange", "blue", "orange", "blue", "orange"],
        orientation: "horizontal"
      }
    }, null, 2);

    const questionTargetText = findSum ? "find the sum of A + B" : (findB ? "find the value of B" : "find the value of A");
    promptInstruction = `- Question stem: "The sequence below has two alternating patterns (odd positions in blue, even positions in orange): ${patternDisplay.join(', ')}. By identifying the separate rules, ${questionTargetText}."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    const oddHigh = start1 + d1;
    const oddLow = start1;
    const evenHigh = Math.max(start2, start2 + d2Sign * d2);
    const evenLow = Math.min(start2, start2 + d2Sign * d2);

    const step1Eq = `${oddHigh} - ${oddLow} = ${d1}`;
    const step2Eq = `${evenHigh} - ${evenLow} = ${d2}`;
    const step3Eq = `${start1 + 2 * d1} + ${d1} = ${termA}`;
    const step4Eq = isOpposing
      ? `${start2 + 2 * d2Sign * d2} - ${d2} = ${termB}`
      : `${start2 + 2 * d2Sign * d2} + ${d2} = ${termB}`;

    if (isMCQ) {
      const distractorWrongStep = findSum ? (termA + d2 + termB) : (start1 + 2 * d1 + d2);
      const distractorReversed = findSum ? (termA - d1 + termB) : (start1 + 2 * d1 - d1);
      const distractorRepeat = findSum ? (start1 + 2 * d1 + start2 + 2 * d2Sign * d2) : (start1 + 2 * d1);

      const mcqRes = buildMcqOptions(finalAnswer, [
        { val: distractorWrongStep.toString(), defect: 'CONFUSED_SUBSEQUENCE_RULES' },
        { val: distractorReversed.toString(), defect: 'REVERSED_OPERATION_SIGN' },
        { val: distractorRepeat.toString(), defect: 'REPEATED_PREVIOUS_TERM' }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          {
            label: "Write the working equation to find the rule for the blue sequence (1st, 3rd, and 5th numbers):",
            expectedAnswer: step1Eq,
            acceptedAnswers: [step1Eq, step1Eq.replace(/\s+/g, '')]
          },
          {
            label: "Write the working equation to find the rule for the orange sequence (2nd, 4th, and 6th numbers):",
            expectedAnswer: step2Eq,
            acceptedAnswers: [step2Eq, step2Eq.replace(/\s+/g, '')]
          },
          {
            label: "Write the working equation for the first missing number (A):",
            expectedAnswer: step3Eq,
            acceptedAnswers: [step3Eq, step3Eq.replace(/\s+/g, '')]
          },
          {
            label: "Write the working equation for the second missing number (B):",
            expectedAnswer: step4Eq,
            acceptedAnswers: [step4Eq, step4Eq.replace(/\s+/g, '')]
          }
        ]
      }, null, 2);
    }

    ruleDesc = `two interlocking sequences: blue numbers change by +${d1}, orange numbers change by ${d2Sign * d2}`;
    hint = `Notice the alternate colored blocks: the blue numbers (${start1}, ${start1 + d1}, ${start1 + 2 * d1}) increase by ${d1} each step (${oddHigh} - ${oddLow} = ${d1}). The orange numbers (${start2}, ${start2 + d2Sign * d2}, ${start2 + 2 * d2Sign * d2}) change by ${d2Sign * d2} each step. Apply the blue rule to find A (${step3Eq}) and the orange rule to find B (${step4Eq}).`;

  // ==========================================================================
  // VARIANT 4: advanced_accumulated_target_term (The Accumulated Target: Finding N)
  // ==========================================================================
  } else if (resolvedVariant === 'advanced_accumulated_target_term') {
    let chosenVariety = varietyStr;

    const jumpsOptions = [4, 5, 6, 7, 8];
    const jumps = jumpsOptions[Math.floor(Math.random() * jumpsOptions.length)];
    const targetDay = 1 + jumps;

    const stepOptions = [500, 800, 1000, 1200, 1500, 2000, 2500];
    const d = stepOptions[Math.floor(Math.random() * stepOptions.length)];

    const startValOptions = [10000, 12000, 15000, 20000, 24000, 30000];
    const startVal = startValOptions[Math.floor(Math.random() * startValOptions.length)];

    const totalDiff = jumps * d;
    const targetVal = startVal + totalDiff;
    finalAnswer = targetDay.toString();

    visualEngineStr = JSON.stringify({
      componentToRender: "TABLE_PATTERN_VISUALIZER",
      componentData: {
        title: "Daily Production Schedule",
        headers: ["Day", "Units Produced"],
        rows: [
          ["Day 1", startVal.toLocaleString()],
          ["Day 2", (startVal + d).toLocaleString()],
          ["Day 3", (startVal + (2 * d)).toLocaleString()],
          ["...", "..."],
          ["Day ?", targetVal.toLocaleString()]
        ]
      }
    }, null, 2);

    promptInstruction = `- Question stem: "A factory produces ${startVal.toLocaleString()} units on Day 1. Each day it produces ${d.toLocaleString()} more units than the day before. On which day will it produce ${targetVal.toLocaleString()} units?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    const step1Eq = `${targetVal} - ${startVal} = ${totalDiff}`;
    const step2Eq = `${totalDiff} / ${d} = ${jumps}`;
    const step3Eq = `1 + ${jumps} = ${targetDay}`;

    if (isMCQ) {
      const distractorFencepost = jumps;
      const distractorOver = targetDay + 1;
      const distractorUnder = Math.max(1, jumps - 1);

      const mcqRes = buildMcqOptions(finalAnswer, [
        { val: distractorFencepost.toString(), defect: 'FENCEPOST_OMITTED_START_DAY' },
        { val: distractorOver.toString(), defect: 'OVERCOUNTED_INTERVALS' },
        { val: distractorUnder.toString(), defect: 'OFF_BY_ONE_JUMP_COUNT' }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          {
            label: "Write the working equation to find the total difference needed to reach the target:",
            expectedAnswer: step1Eq,
            acceptedAnswers: [step1Eq, step1Eq.replace(/\s+/g, '')]
          },
          {
            label: "Write the working equation to find how many interval jumps are required:",
            expectedAnswer: step2Eq,
            acceptedAnswers: [step2Eq, step2Eq.replace(/\s+/g, '')]
          },
          {
            label: "Write the working equation to find the final Day number (adding 1 for Day 1):",
            expectedAnswer: step3Eq,
            acceptedAnswers: [step3Eq, step3Eq.replace(/\s+/g, ''), `${jumps} + 1 = ${targetDay}`, `${jumps}+1=${targetDay}`]
          }
        ]
      }, null, 2);
    }

    ruleDesc = `growing by ${d} units each day to reach ${targetVal}`;
    hint = `First find the total increase needed to reach the target: ${targetVal} - ${startVal} = ${totalDiff}. Divide by the daily increase (${totalDiff} / ${d} = ${jumps} jumps). Since Day 1 is the starting point, add 1 for the starting day: 1 + ${jumps} = Day ${targetDay}.`;

  // ==========================================================================
  // VARIANT 5: advanced_simultaneous_offset_deduction (Simultaneous Offset)
  // ==========================================================================
  } else {
    let chosenVariety = varietyStr;

    let targetTerm = 5;
    if (chosenVariety.includes('4_to_6')) {
      targetTerm = [4, 5, 6][Math.floor(Math.random() * 3)];
    } else if (chosenVariety.includes('7_to_10')) {
      targetTerm = [7, 8, 10][Math.floor(Math.random() * 3)];
    } else {
      targetTerm = [5, 6, 7, 8][Math.floor(Math.random() * 4)];
    }

    const jumps = targetTerm - 1;

    // Both sequences start at the same base
    const startBase = [10000, 15000, 20000, 25000][Math.floor(Math.random() * 4)];

    // dA and dB
    const daOptions = [300, 400, 500, 600, 800, 1000];
    const dA = daOptions[Math.floor(Math.random() * daOptions.length)];

    const rateDiffOptions = [200, 300, 400, 500];
    const diffRate = rateDiffOptions[Math.floor(Math.random() * rateDiffOptions.length)];
    const dB = dA + diffRate;

    const termA_val = startBase + (jumps * dA);
    const termB_val = startBase + (jumps * dB);
    const finalDiff = jumps * diffRate;
    finalAnswer = finalDiff.toString();

    visualEngineStr = JSON.stringify({
      componentToRender: "TABLE_PATTERN_VISUALIZER",
      componentData: {
        title: "Two Simultaneous Number Sequences",
        headers: ["Term", "Sequence A", "Sequence B"],
        rows: [
          ["Term 1", startBase.toLocaleString(), startBase.toLocaleString()],
          ["Term 2", (startBase + dA).toLocaleString(), (startBase + dB).toLocaleString()],
          ["Term 3", (startBase + (2 * dA)).toLocaleString(), (startBase + (2 * dB)).toLocaleString()],
          ["...", "...", "..."],
          [`Term ${targetTerm}`, "?", "?"]
        ]
      }
    }, null, 2);

    promptInstruction = `- Question stem: "Sequence A and Sequence B both start at ${startBase.toLocaleString()}. Sequence A increases by ${dA} each term, while Sequence B increases by ${dB} each term. At Term ${targetTerm}, what is the difference between the two sequences?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    const step1Eq = `${dB} - ${dA} = ${diffRate}`;
    const step3Eq = `${jumps} * ${diffRate} = ${finalDiff}`;

    if (isMCQ) {
      const fencepostVal = targetTerm * diffRate;
      const singleStepVal = diffRate;
      const offByTwoVal = Math.max(diffRate, (targetTerm - 2) * diffRate);

      const mcqRes = buildMcqOptions(finalAnswer, [
        { val: fencepostVal.toString(), defect: 'USED_N_JUMPS_INSTEAD_OF_N_MINUS_ONE' },
        { val: singleStepVal.toString(), defect: 'CALCULATED_SINGLE_STEP_ONLY' },
        { val: offByTwoVal.toString(), defect: 'OFF_BY_ONE_JUMP_COUNT' }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          {
            label: "Write the working equation to find the difference in growth per interval:",
            expectedAnswer: step1Eq,
            acceptedAnswers: [step1Eq, step1Eq.replace(/\s+/g, '')]
          },
          {
            label: `How many jumps are there to reach Term ${targetTerm}?`,
            expectedAnswer: jumps.toString(),
            acceptedAnswers: [jumps.toString(), `${targetTerm} - 1 = ${jumps}`, `${targetTerm}-1=${jumps}`]
          },
          {
            label: `Write the working equation to find the total difference at Term ${targetTerm}:`,
            expectedAnswer: step3Eq,
            acceptedAnswers: [
              step3Eq,
              step3Eq.replace(/\s+/g, ''),
              `${diffRate} * ${jumps} = ${finalDiff}`,
              `${diffRate}*${jumps}=${finalDiff}`,
              `${termB_val} - ${termA_val} = ${finalDiff}`,
              `${termB_val}-${termA_val}=${finalDiff}`
            ]
          }
        ]
      }, null, 2);
    }

    ruleDesc = `Sequence A increases by ${dA}, Sequence B increases by ${dB}, divergence rate is ${diffRate} per step`;
    hint = `In each interval jump, Sequence B grows by ${dB} - ${dA} = ${diffRate} more than Sequence A. From Term 1 to Term ${targetTerm}, there are ${targetTerm} - 1 = ${jumps} jumps. Multiply the extra growth per jump by the number of jumps: ${jumps} * ${diffRate} = ${finalDiff}.`;
  }

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
3. Provide step-by-step solution steps separated by \\n and an encouraging conceptual hint: ${hint}
4. Forbid using "STORY:" or any instructional prefix in the output.
5. In visualEngine, do NOT provide or output interval numbers on the arrows (do NOT provide overlapping details that spoil the step size). Keep arrows plain.

${getFormatInstructions(visualEngineStr, inputRequirementStr, resolvedVariant)}`;

  return { aiPrompt };
}
