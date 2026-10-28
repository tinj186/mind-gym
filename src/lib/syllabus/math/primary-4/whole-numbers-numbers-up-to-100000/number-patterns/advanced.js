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

    // Available combinations of (totalTicks, idx1, idx2)
    const tickConfigs = [
      { totalTicks: 6, idx1: 1, idx2: 3 }, // Ticks 2 & 4 (gap 2)
      { totalTicks: 6, idx1: 1, idx2: 4 }, // Ticks 2 & 5 (gap 3)
      { totalTicks: 6, idx1: 2, idx2: 4 }, // Ticks 3 & 5 (gap 2)
      { totalTicks: 7, idx1: 1, idx2: 4 }, // Ticks 2 & 5 (gap 3)
      { totalTicks: 7, idx1: 2, idx2: 5 }, // Ticks 3 & 6 (gap 3)
      { totalTicks: 7, idx1: 1, idx2: 5 }, // Ticks 2 & 6 (gap 4)
      { totalTicks: 7, idx1: 2, idx2: 4 }, // Ticks 3 & 5 (gap 2)
      { totalTicks: 8, idx1: 2, idx2: 5 }, // Ticks 3 & 6 (gap 3)
      { totalTicks: 8, idx1: 1, idx2: 5 }, // Ticks 2 & 6 (gap 4)
      { totalTicks: 8, idx1: 2, idx2: 6 }, // Ticks 3 & 7 (gap 4)
      { totalTicks: 8, idx1: 1, idx2: 4 }  // Ticks 2 & 5 (gap 3)
    ];

    let selectedConfig = null;
    if (chosenVariety.includes('2_and_4')) {
      selectedConfig = { totalTicks: 6, idx1: 1, idx2: 3 };
    } else if (chosenVariety.includes('3_and_5')) {
      selectedConfig = { totalTicks: 6, idx1: 2, idx2: 4 };
    } else if (chosenVariety.includes('2_and_5')) {
      selectedConfig = { totalTicks: 6, idx1: 1, idx2: 4 };
    } else if (chosenVariety.includes('3_and_6')) {
      selectedConfig = { totalTicks: 7, idx1: 2, idx2: 5 };
    } else if (chosenVariety.includes('2_and_6')) {
      selectedConfig = { totalTicks: 7, idx1: 1, idx2: 5 };
    } else if (chosenVariety.includes('7_ticks')) {
      const c7 = tickConfigs.filter(c => c.totalTicks === 7);
      selectedConfig = c7[Math.floor(Math.random() * c7.length)];
    } else if (chosenVariety.includes('8_ticks')) {
      const c8 = tickConfigs.filter(c => c.totalTicks === 8);
      selectedConfig = c8[Math.floor(Math.random() * c8.length)];
    } else {
      selectedConfig = tickConfigs[Math.floor(Math.random() * tickConfigs.length)];
    }

    const { totalTicks, idx1, idx2 } = selectedConfig;
    const totalIntervals = totalTicks - 1;
    const numJumps = idx2 - idx1;

    const stepOptions = [500, 800, 1000, 1200, 1500, 2000, 2500, 3000, 4000, 5000];
    const d = stepOptions[Math.floor(Math.random() * stepOptions.length)];

    const maxTick1 = 98000 - (totalIntervals * d);
    const tick1 = (Math.floor(Math.random() * Math.max(1, (maxTick1 - 10000) / 1000))) * 1000 + 10000;
    const lastTick = tick1 + (totalIntervals * d);

    const val1 = tick1 + (idx1 * d);
    const val2 = tick1 + (idx2 * d);
    const diffKnown = val2 - val1;

    let findFirst = Math.random() < 0.5;
    if (chosenVariety.includes('find_first_tick')) findFirst = true;
    if (chosenVariety.includes('find_last_tick')) findFirst = false;

    const correctNum = findFirst ? tick1 : lastTick;
    finalAnswer = correctNum.toString();

    const targetTickLabel = findFirst ? "first tick mark (Tick 1)" : `last tick mark (Tick ${totalTicks})`;

    visualEngineStr = JSON.stringify({
      componentToRender: "NUMBER_LINE_ADVANCED",
      componentData: {
        min: tick1,
        max: lastTick,
        numIntervals: totalIntervals,
        labeledPoints: [
          { index: 0, label: findFirst ? "Tick 1 (?)" : "Tick 1" },
          { index: idx1, label: val1.toLocaleString() },
          { index: idx2, label: val2.toLocaleString() },
          { index: totalIntervals, label: findFirst ? `Tick ${totalTicks}` : `Tick ${totalTicks} (?)` }
        ]
      }
    }, null, 2);

    promptInstruction = `- Question stem: "The number line below has ${totalTicks} equally spaced tick marks. Tick ${idx1 + 1} is ${val1.toLocaleString()} and Tick ${idx2 + 1} is ${val2.toLocaleString()}. Find the value of the ${targetTickLabel}."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    const step1Eq = `${val2} - ${val1} = ${diffKnown}`;
    const step2Eq = `${diffKnown} / ${numJumps} = ${d}`;
    const targetEq = findFirst
      ? `${val1} - ${idx1 * d} = ${tick1}`
      : `${val2} + ${(totalIntervals - idx2) * d} = ${lastTick}`;

    if (isMCQ) {
      const wrongD = Math.floor(diffKnown / (numJumps === 2 ? 3 : 2));
      let distractorDiffAsStep, distractorWrongJump, distractorReversed, distractorOneStep;

      if (findFirst) {
        distractorDiffAsStep = Math.max(1000, val1 - diffKnown);
        distractorWrongJump = Math.max(1000, val1 - wrongD);
        distractorReversed = val1 + d;
        distractorOneStep = idx1 > 1 ? val1 - d : tick1 + d;
      } else {
        distractorDiffAsStep = val2 + diffKnown;
        distractorWrongJump = val2 + wrongD;
        distractorReversed = val2 - d;
        distractorOneStep = (totalIntervals - idx2) > 1 ? val2 + d : lastTick - d;
      }

      const mcqRes = buildMcqOptions(finalAnswer, [
        { val: distractorDiffAsStep.toString(), defect: 'CONFUSED_TOTAL_DIFF_WITH_SINGLE_INTERVAL' },
        { val: distractorWrongJump.toString(), defect: 'WRONG_INTERVAL_COUNT_DIVISION' },
        { val: distractorReversed.toString(), defect: 'REVERSED_OPERATION_DIRECTION' },
        { val: distractorOneStep.toString(), defect: 'OFF_BY_ONE_STEP' }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    } else if (isStructure) {
      const step3Label = findFirst
        ? `Write the working equation to find the first tick mark (Tick 1) by counting backwards ${idx1} step(s) from Tick ${idx1 + 1}:`
        : `Write the working equation to find the last tick mark (Tick ${totalTicks}) by counting forwards ${totalIntervals - idx2} step(s) from Tick ${idx2 + 1}:`;

      const acceptedTarget = findFirst
        ? [targetEq, targetEq.replace(/\s+/g, ''), `${val1} - ${idx1} * ${d} = ${tick1}`, `${val1}-${idx1}*${d}=${tick1}`]
        : [targetEq, targetEq.replace(/\s+/g, ''), `${val2} + ${totalIntervals - idx2} * ${d} = ${lastTick}`, `${val2}+${totalIntervals - idx2}*${d}=${lastTick}`];

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
            label: step3Label,
            expectedAnswer: targetEq,
            acceptedAnswers: acceptedTarget
          }
        ]
      }, null, 2);
    }

    ruleDesc = `equal intervals of ${d} along the number line`;
    hint = findFirst
      ? `First find the difference between the two known marks: ${val2} - ${val1} = ${diffKnown}. There are ${numJumps} jumps between them, so each interval is ${diffKnown} / ${numJumps} = ${d}. To find Tick 1, count backwards ${idx1} step(s) from Tick ${idx1 + 1}: ${val1} - ${idx1 * d} = ${tick1}.`
      : `First find the difference between the two known marks: ${val2} - ${val1} = ${diffKnown}. There are ${numJumps} jumps between them, so each interval is ${diffKnown} / ${numJumps} = ${d}. To find Tick ${totalTicks}, count forwards ${totalIntervals - idx2} step(s) from Tick ${idx2 + 1}: ${val2} + ${(totalIntervals - idx2) * d} = ${lastTick}.`;

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
    const blueVals = [start1, start1 + d1, start1 + 2 * d1, start1 + 3 * d1];

    // Sequence 2 (Even: index 1, 3, 5, 7): start2, start2 +/- d2...
    const d2Options = [1000, 2000, 2500, 3000, 5000];
    const d2 = d2Options[Math.floor(Math.random() * d2Options.length)];
    const d2Sign = isOpposing ? -1 : 1;
    const start2 = isOpposing
      ? (Math.floor(Math.random() * 15) + 65) * 1000 // 65 000 to 79 000
      : (Math.floor(Math.random() * 15) + 35) * 1000;
    const orangeVals = [
      start2,
      start2 + d2Sign * d2,
      start2 + 2 * d2Sign * d2,
      start2 + 3 * d2Sign * d2
    ];

    // 4 Position configurations for A (blue, odd index) and B (orange, even index):
    // In all configurations, indices 0, 2 (blue) and 1, 3 (orange) are given so rules are always clearly deducible!
    const positionConfigs = [
      { mode: 'end', posA: 6, posB: 7 },              // Terms 7 & 8 are A & B (end)
      { mode: 'middle', posA: 4, posB: 5 },           // Terms 5 & 6 are A & B (middle)
      { mode: 'split_middle_end', posA: 4, posB: 7 }, // Term 5 is A, Term 8 is B (split)
      { mode: 'split_end_middle', posA: 6, posB: 5 }  // Term 7 is A, Term 6 is B (split)
    ];

    let selectedPos = null;
    if (chosenVariety.includes('middle')) {
      selectedPos = positionConfigs[1];
    } else if (chosenVariety.includes('split_middle_end')) {
      selectedPos = positionConfigs[2];
    } else if (chosenVariety.includes('split_end_middle')) {
      selectedPos = positionConfigs[3];
    } else if (chosenVariety.includes('end')) {
      selectedPos = positionConfigs[0];
    } else {
      selectedPos = positionConfigs[Math.floor(Math.random() * positionConfigs.length)];
    }

    const { posA, posB } = selectedPos;

    // Blue term index for A: posA is 4 (index 2) or 6 (index 3)
    const bIndexA = posA / 2;
    const valA = blueVals[bIndexA];
    const prevBlueVal = blueVals[bIndexA - 1];

    // Orange term index for B: posB is 5 (index 2) or 7 (index 3)
    const oIndexB = Math.floor(posB / 2);
    const valB = orangeVals[oIndexB];
    const prevOrangeVal = orangeVals[oIndexB - 1];

    const patternDisplay = [];
    for (let i = 0; i < 8; i++) {
      if (i === posA) {
        patternDisplay.push("A");
      } else if (i === posB) {
        patternDisplay.push("B");
      } else if (i % 2 === 0) {
        patternDisplay.push(blueVals[i / 2].toString());
      } else {
        patternDisplay.push(orangeVals[Math.floor(i / 2)].toString());
      }
    }

    let findTarget = 'A';
    if (chosenVariety.includes('sum') || chosenVariety.includes('a_plus_b')) {
      findTarget = 'sum';
    } else if (chosenVariety.includes('missing_b') || chosenVariety.includes('second_missing')) {
      findTarget = 'B';
    } else if (chosenVariety.includes('missing_a') || chosenVariety.includes('first_missing')) {
      findTarget = 'A';
    } else {
      findTarget = ['A', 'B', 'sum'][Math.floor(Math.random() * 3)];
    }

    const findSum = findTarget === 'sum';
    const findB = findTarget === 'B';
    const correctNum = findSum ? (valA + valB) : (findB ? valB : valA);
    finalAnswer = correctNum.toString();

    visualEngineStr = JSON.stringify({
      componentToRender: "NUMBER_SEQUENCE_BLOCKS",
      componentData: {
        nodes: patternDisplay,
        nodeColors: ["blue", "orange", "blue", "orange", "blue", "orange", "blue", "orange"],
        orientation: "horizontal"
      }
    }, null, 2);

    const questionTargetText = findSum ? "find the sum of A + B" : (findB ? "find the value of missing number B" : "find the value of missing number A");
    promptInstruction = `- Question stem: "The sequence below contains two interlocking patterns (blue boxes for odd positions and orange boxes for even positions). By identifying the separate rules, ${questionTargetText}."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    const oddHigh = blueVals[1];
    const oddLow = blueVals[0];
    const evenHigh = Math.max(orangeVals[0], orangeVals[1]);
    const evenLow = Math.min(orangeVals[0], orangeVals[1]);

    const step1Eq = `${oddHigh} - ${oddLow} = ${d1}`;
    const step2Eq = `${evenHigh} - ${evenLow} = ${d2}`;
    const step3Eq = `${prevBlueVal} + ${d1} = ${valA}`;
    const step4Eq = isOpposing
      ? `${prevOrangeVal} - ${d2} = ${valB}`
      : `${prevOrangeVal} + ${d2} = ${valB}`;

    if (isMCQ) {
      let distractorWrongStep, distractorReversed, distractorRepeat;
      if (findSum) {
        distractorWrongStep = valA + d2 + valB;
        distractorReversed = valA - d1 + valB;
        distractorRepeat = prevBlueVal + prevOrangeVal;
      } else if (findB) {
        distractorWrongStep = prevOrangeVal + d1;
        distractorReversed = isOpposing ? prevOrangeVal + d2 : prevOrangeVal - d2;
        distractorRepeat = prevOrangeVal;
      } else {
        distractorWrongStep = prevBlueVal + d2;
        distractorReversed = prevBlueVal - d1;
        distractorRepeat = prevBlueVal;
      }

      const mcqRes = buildMcqOptions(finalAnswer, [
        { val: distractorWrongStep.toString(), defect: 'CONFUSED_SUBSEQUENCE_RULES' },
        { val: distractorReversed.toString(), defect: 'REVERSED_OPERATION_SIGN' },
        { val: distractorRepeat.toString(), defect: 'REPEATED_PREVIOUS_TERM' }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    } else if (isStructure) {
      const structSteps = [
        {
          label: "Write the working equation to find the rule for the blue sequence (odd positions):",
          expectedAnswer: step1Eq,
          acceptedAnswers: [step1Eq, step1Eq.replace(/\s+/g, '')]
        },
        {
          label: "Write the working equation to find the rule for the orange sequence (even positions):",
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
      ];

      if (findSum) {
        structSteps.push({
          label: "Write the working equation to find the sum of A + B:",
          expectedAnswer: `${valA} + ${valB} = ${valA + valB}`,
          acceptedAnswers: [
            `${valA} + ${valB} = ${valA + valB}`,
            `${valA}+${valB}=${valA + valB}`
          ]
        });
      }

      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: structSteps
      }, null, 2);
    }

    ruleDesc = `two interlocking sequences: blue numbers change by +${d1}, orange numbers change by ${d2Sign * d2}`;
    hint = `Notice the alternate colored blocks: the blue numbers (${blueVals[0]}, ${blueVals[1]}) increase by ${d1} each step (${oddHigh} - ${oddLow} = ${d1}). The orange numbers (${orangeVals[0]}, ${orangeVals[1]}) change by ${d2Sign * d2} each step (${evenHigh} - ${evenLow} = ${d2}). Apply the blue rule to find A (${step3Eq}) and the orange rule to find B (${step4Eq}).` + (findSum ? ` Finally, add A and B: ${valA} + ${valB} = ${valA + valB}.` : '');

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

    const themes = [
      {
        title: "Daily Production Schedule",
        unitName: "Day",
        valName: "Units Produced",
        stem: `A factory produces ${startVal.toLocaleString()} units on Day 1. Each day it produces ${d.toLocaleString()} more units than the day before. On which day will it produce ${targetVal.toLocaleString()} units?`,
        step3Label: "Write the working equation to find the final Day number (adding 1 for Day 1):",
        hintText: `First find the total increase needed to reach the target: ${targetVal} - ${startVal} = ${totalDiff}. Divide by the daily increase (${totalDiff} / ${d} = ${jumps} jumps). Since Day 1 is the starting point, add 1 for the starting day: 1 + ${jumps} = Day ${targetDay}.`
      },
      {
        title: "Monthly Savings Plan",
        unitName: "Month",
        valName: "Total Savings ($)",
        stem: `A student had saved $${startVal.toLocaleString()} in Month 1. Each month, the student saves an additional $${d.toLocaleString()}. In which month will the total savings reach $${targetVal.toLocaleString()}?`,
        step3Label: "Write the working equation to find the final Month number (adding 1 for Month 1):",
        hintText: `First find the total savings increase needed to reach the target: ${targetVal} - ${startVal} = ${totalDiff}. Divide by the monthly savings amount (${totalDiff} / ${d} = ${jumps} jumps). Since Month 1 is the starting point, add 1 for the first month: 1 + ${jumps} = Month ${targetDay}.`
      },
      {
        title: "Weekly Distance Program",
        unitName: "Week",
        valName: "Distance Run (m)",
        stem: `An athlete ran ${startVal.toLocaleString()} m in Week 1. Each week, the athlete increases the running distance by ${d.toLocaleString()} m. In which week will the athlete run ${targetVal.toLocaleString()} m?`,
        step3Label: "Write the working equation to find the final Week number (adding 1 for Week 1):",
        hintText: `First find the total distance increase needed: ${targetVal} - ${startVal} = ${totalDiff}. Divide by the weekly increase (${totalDiff} / ${d} = ${jumps} jumps). Since Week 1 is the starting point, add 1 for the first week: 1 + ${jumps} = Week ${targetDay}.`
      }
    ];

    let theme = themes[0];
    if (chosenVariety.includes('savings')) {
      theme = themes[1];
    } else if (chosenVariety.includes('distance')) {
      theme = themes[2];
    } else if (chosenVariety.includes('daily_production')) {
      theme = themes[0];
    } else {
      theme = themes[Math.floor(Math.random() * themes.length)];
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "TABLE_PATTERN_VISUALIZER",
      componentData: {
        title: theme.title,
        headers: [theme.unitName, theme.valName],
        rows: [
          [`${theme.unitName} 1`, startVal.toLocaleString()],
          [`${theme.unitName} 2`, (startVal + d).toLocaleString()],
          [`${theme.unitName} 3`, (startVal + (2 * d)).toLocaleString()],
          ["...", "..."],
          [`${theme.unitName} ?`, targetVal.toLocaleString()]
        ]
      }
    }, null, 2);

    promptInstruction = `- Question stem: "${theme.stem}"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

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
            label: theme.step3Label,
            expectedAnswer: step3Eq,
            acceptedAnswers: [step3Eq, step3Eq.replace(/\s+/g, ''), `${jumps} + 1 = ${targetDay}`, `${jumps}+1=${targetDay}`]
          }
        ]
      }, null, 2);
    }

    ruleDesc = `growing by ${d} units each ${theme.unitName.toLowerCase()} to reach ${targetVal}`;
    hint = theme.hintText;

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
