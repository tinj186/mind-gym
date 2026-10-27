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
    'advanced_alternating_add_sub': 'advanced_interleaved_sequences',
    'advanced_alternating_add_add': 'advanced_interleaved_sequences',
    'advanced_growing_jumps': 'advanced_figurate_scaled_patterns',
    'advanced_large_jumps': 'advanced_distant_term_generalization',
    'advanced_two_missing_terms': 'advanced_distant_term_generalization'
  };

  let resolvedVariant = activeVariant;
  if (aliasMap[resolvedVariant]) {
    resolvedVariant = aliasMap[resolvedVariant];
  }

  const validVariants = [
    'advanced_interleaved_sequences',
    'advanced_fibonacci_lookback',
    'advanced_distant_term_generalization',
    'advanced_figurate_scaled_patterns',
    'advanced_table_two_step_rule'
  ];

  if (!resolvedVariant || !validVariants.includes(resolvedVariant)) {
    resolvedVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
  }

  const varietyStr = explicitVariety ? String(explicitVariety).toLowerCase() : "";

  // ==========================================================================
  // VARIANT 1: advanced_interleaved_sequences (Two Interleaved Sequences)
  // ==========================================================================
  if (resolvedVariant === 'advanced_interleaved_sequences') {
    let chosenVariety = varietyStr;
    const isOpposing = chosenVariety.includes('opposing') || Math.random() < 0.5;

    let missingTarget = 'random';
    if (chosenVariety.includes('even')) missingTarget = 'even';
    else if (chosenVariety.includes('odd')) missingTarget = 'odd';

    // Sub-sequence 1 (Odd positions: index 0, 2, 4): start1, start1 + d1, start1 + 2*d1
    const d1Options = [1000, 1500, 2000, 2500, 3000];
    const d1 = d1Options[Math.floor(Math.random() * d1Options.length)];
    const start1 = (Math.floor(Math.random() * 20) + 10) * 1000; // 10 000 to 29 000

    // Sub-sequence 2 (Even positions: index 1, 3, 5): start2, start2 +/- d2, start2 +/- 2*d2
    const d2Options = [1000, 1500, 2000, 2500, 3000];
    const d2 = d2Options[Math.floor(Math.random() * d2Options.length)];
    const d2Sign = isOpposing ? -1 : 1;
    const start2 = isOpposing
      ? (Math.floor(Math.random() * 20) + 60) * 1000 // 60 000 to 79 000
      : (Math.floor(Math.random() * 20) + 35) * 1000;

    const pattern = [
      start1,
      start2,
      start1 + d1,
      start2 + (d2Sign * d2),
      start1 + (2 * d1),
      start2 + (2 * d2Sign * d2)
    ];

    // Missing index: 2, 3, 4, or 5 (keep index 0 and 1 known to introduce both sequences)
    let missingIndex = 5;
    if (missingTarget === 'odd') {
      missingIndex = Math.random() < 0.5 ? 2 : 4;
    } else if (missingTarget === 'even') {
      missingIndex = Math.random() < 0.5 ? 3 : 5;
    } else {
      missingIndex = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
    }

    const isMissingOdd = missingIndex % 2 === 0;
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

    const prevSubTerm = pattern[missingIndex - 2];
    const appliedStep = isMissingOdd ? d1 : d2;
    const appliedOp = isMissingOdd ? '+' : (d2Sign === 1 ? '+' : '-');
    const step3Equation = `${prevSubTerm} ${appliedOp} ${appliedStep} = ${correctNum}`;

    // Scaffolding: Odd subsequence pair (0, 2) or (2, 4)
    const oddRef1 = pattern[0];
    const oddRef2 = pattern[2];
    const highOdd = Math.max(oddRef1, oddRef2);
    const lowOdd = Math.min(oddRef1, oddRef2);

    // Even subsequence pair (1, 3) or (3, 5)
    const evenRef1 = pattern[1];
    const evenRef2 = pattern[3];
    const highEven = Math.max(evenRef1, evenRef2);
    const lowEven = Math.min(evenRef1, evenRef2);

    if (isMCQ) {
      const adjacentTerm = pattern[missingIndex - 1];
      const distractorAdjacent = appliedOp === '+' ? adjacentTerm + appliedStep : adjacentTerm - appliedStep;
      const wrongSeqStep = isMissingOdd ? d2 : d1;
      const distractorWrongStep = prevSubTerm + wrongSeqStep;
      const distractorReversed = appliedOp === '+' ? prevSubTerm - appliedStep : prevSubTerm + appliedStep;

      const mcqRes = buildMcqOptions(finalAnswer, [
        { val: distractorAdjacent.toString(), defect: 'APPLIED_ADJACENT_STEP' },
        { val: distractorWrongStep.toString(), defect: 'CONFUSED_SUBSEQUENCE_RULES' },
        { val: distractorReversed.toString(), defect: 'REVERSED_OPERATION_SIGN' }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          {
            label: "Write the working equation to find the rule of the 1st, 3rd, and 5th numbers:",
            expectedAnswer: `${highOdd} - ${lowOdd} = ${d1}`,
            acceptedAnswers: [`${highOdd} - ${lowOdd} = ${d1}`, `${highOdd}-${lowOdd}=${d1}`]
          },
          {
            label: "Write the working equation to find the rule of the 2nd, 4th, and 6th numbers:",
            expectedAnswer: `${highEven} - ${lowEven} = ${d2}`,
            acceptedAnswers: [`${highEven} - ${lowEven} = ${d2}`, `${highEven}-${lowEven}=${d2}`]
          },
          {
            label: "Write the working equation to find the missing number:",
            expectedAnswer: step3Equation,
            acceptedAnswers: [step3Equation, step3Equation.replace(/\s+/g, '')]
          }
        ]
      }, null, 2);
    }

    ruleDesc = `two interleaved sequences: odd terms change by ${d1}, even terms change by ${d2Sign * d2}`;
    hint = `Notice that the alternate numbers form two separate patterns: look at the 1st, 3rd, and 5th numbers (${highOdd} - ${lowOdd} = ${d1}), and compare them to the 2nd, 4th, and 6th numbers (${highEven} - ${lowEven} = ${d2}). Apply the appropriate pattern to find the missing number.`;

  // ==========================================================================
  // VARIANT 2: advanced_fibonacci_lookback (Additive Look-back / Sum of 2 Preceding)
  // ==========================================================================
  } else if (resolvedVariant === 'advanced_fibonacci_lookback') {
    let chosenVariety = varietyStr;

    // Pick clean starting pairs scaled to thousands/hundreds
    const starterPairs = [
      [1000, 2000],
      [2000, 3000],
      [1500, 2500],
      [2000, 4000],
      [3000, 4000],
      [3000, 5000],
      [4000, 5000],
      [5000, 8000]
    ];
    const starter = starterPairs[Math.floor(Math.random() * starterPairs.length)];
    const pattern = [starter[0], starter[1]];
    for (let i = 2; i < 6; i++) {
      pattern.push(pattern[i - 1] + pattern[i - 2]);
    }

    // Positions: 0, 1, 2, 3, 4, 5
    let missingIndex = 5;
    if (chosenVariety.includes('start')) {
      missingIndex = Math.random() < 0.5 ? 0 : 1;
    } else if (chosenVariety.includes('middle')) {
      missingIndex = Math.random() < 0.5 ? 2 : 3;
    } else if (chosenVariety.includes('end')) {
      missingIndex = Math.random() < 0.5 ? 4 : 5;
    } else {
      missingIndex = [0, 1, 2, 3, 4, 5][Math.floor(Math.random() * 6)];
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

    let step3Equation = "";
    if (missingIndex >= 2) {
      step3Equation = `${pattern[missingIndex - 2]} + ${pattern[missingIndex - 1]} = ${correctNum}`;
    } else if (missingIndex === 1) {
      step3Equation = `${pattern[2]} - ${pattern[0]} = ${correctNum}`;
    } else {
      step3Equation = `${pattern[2]} - ${pattern[1]} = ${correctNum}`;
    }

    // Scaffolding verification terms (pick 3 consecutive known terms)
    let v0 = pattern[1], v1 = pattern[2], v2 = pattern[3];
    if (missingIndex === 2 || missingIndex === 3) {
      v0 = pattern[3]; v1 = pattern[4]; v2 = pattern[5];
    }

    if (isMCQ) {
      // Common misconception: student assumes constant interval between previous two numbers
      let linearDistractor = pattern[4] + (pattern[4] - pattern[3]);
      if (missingIndex < 5 && missingIndex > 0) {
        linearDistractor = pattern[missingIndex - 1] + 1000;
      }
      const distractorCareless = correctNum + 1000;
      const distractorDiff = Math.abs(pattern[3] - pattern[2]);

      const mcqRes = buildMcqOptions(finalAnswer, [
        { val: linearDistractor.toString(), defect: 'APPLIED_LINEAR_INTERVAL' },
        { val: distractorCareless.toString(), defect: 'CARELESS_CALCULATION' },
        { val: distractorDiff.toString(), defect: 'SUBTRACTED_INSTEAD_OF_ADDED' }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          {
            label: "Write the working equation showing how a term is formed from the sum of the two preceding numbers:",
            expectedAnswer: `${v0} + ${v1} = ${v2}`,
            acceptedAnswers: [`${v0} + ${v1} = ${v2}`, `${v0}+${v1}=${v2}`]
          },
          {
            label: "Write the working equation to find the missing number:",
            expectedAnswer: step3Equation,
            acceptedAnswers: [step3Equation, step3Equation.replace(/\s+/g, '')]
          }
        ]
      }, null, 2);
    }

    ruleDesc = "each number is the sum of the previous two numbers";
    hint = `Check the relationship between consecutive numbers: notice that ${v0} + ${v1} = ${v2}. Each number is the sum of the two preceding numbers.`;

  // ==========================================================================
  // VARIANT 3: advanced_distant_term_generalization (Find N-th Term e.g. 10th, 15th)
  // ==========================================================================
  } else if (resolvedVariant === 'advanced_distant_term_generalization') {
    let chosenVariety = varietyStr;
    const isDescending = chosenVariety.includes('descending') || Math.random() < 0.25;

    let targetN = 15;
    if (chosenVariety.includes('10')) targetN = 10;
    else if (chosenVariety.includes('12')) targetN = 12;
    else if (chosenVariety.includes('15')) targetN = 15;
    else if (chosenVariety.includes('20')) targetN = 20;
    else {
      targetN = [10, 12, 15, 20][Math.floor(Math.random() * 4)];
    }

    const stepOptions = [250, 400, 500, 600, 800, 1000, 1200, 1500];
    const d = stepOptions[Math.floor(Math.random() * stepOptions.length)];

    const jumps = targetN - 1;
    const totalChange = jumps * d;

    let startVal = 5000;
    if (isDescending) {
      // Must ensure startVal - totalChange >= 2000 and startVal <= 95000
      const minStart = totalChange + 5000;
      const maxStart = 95000;
      startVal = Math.floor(Math.random() * Math.max(1, (maxStart - minStart) / 1000)) * 1000 + minStart;
    } else {
      // Must ensure startVal + totalChange <= 95000
      const maxStart = 95000 - totalChange;
      startVal = (Math.floor(Math.random() * Math.max(1, (maxStart - 3000) / 1000))) * 1000 + 3000;
    }

    const term1 = startVal;
    const term2 = isDescending ? term1 - d : term1 + d;
    const term3 = isDescending ? term1 - (2 * d) : term1 + (2 * d);
    const term4 = isDescending ? term1 - (3 * d) : term1 + (3 * d);
    const correctNum = isDescending ? term1 - totalChange : term1 + totalChange;
    finalAnswer = correctNum.toString();

    visualEngineStr = JSON.stringify({
      componentToRender: "NUMBER_SEQUENCE_BLOCKS",
      componentData: {
        nodes: [term1.toString(), term2.toString(), term3.toString(), term4.toString(), "?"],
        orientation: "horizontal"
      }
    }, null, 2);

    const suffix = targetN === 12 ? 'th' : (targetN % 10 === 1 ? 'st' : (targetN % 10 === 2 ? 'nd' : (targetN % 10 === 3 ? 'rd' : 'th')));
    promptInstruction = `- Question stem: "In the number pattern: ${term1}, ${term2}, ${term3}, ${term4}, ..., find the ${targetN}${suffix} number."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    const highPair = Math.max(term1, term2);
    const lowPair = Math.min(term1, term2);

    const step3Equation = `${jumps} * ${d} = ${totalChange}`;
    const step4Equation = isDescending
      ? `${term1} - ${totalChange} = ${correctNum}`
      : `${term1} + ${totalChange} = ${correctNum}`;

    if (isMCQ) {
      // Classic fencepost error: multiplying N * d instead of (N-1) * d
      const fencepostWrong = isDescending ? term1 - (targetN * d) : term1 + (targetN * d);
      // Adding step only once (finding 5th term instead of N-th term)
      const fifthTermOnly = isDescending ? term4 - d : term4 + d;
      const offByTwoWrong = isDescending ? term1 - ((targetN - 2) * d) : term1 + ((targetN - 2) * d);

      const mcqRes = buildMcqOptions(finalAnswer, [
        { val: fencepostWrong.toString(), defect: 'USED_N_JUMPS_INSTEAD_OF_N_MINUS_ONE' },
        { val: fifthTermOnly.toString(), defect: 'CALCULATED_5TH_TERM_ONLY' },
        { val: offByTwoWrong.toString(), defect: 'OFF_BY_ONE_JUMP_COUNT' }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          {
            label: "Write the working equation to find the common interval between terms:",
            expectedAnswer: `${highPair} - ${lowPair} = ${d}`,
            acceptedAnswers: [`${highPair} - ${lowPair} = ${d}`, `${highPair}-${lowPair}=${d}`]
          },
          {
            label: `Write the working equation to find the number of jumps from the 1st number to the ${targetN}${suffix} number:`,
            expectedAnswer: `${targetN} - 1 = ${jumps}`,
            acceptedAnswers: [`${targetN} - 1 = ${jumps}`, `${targetN}-1=${jumps}`]
          },
          {
            label: "Write the working equation to find the total change from the jumps:",
            expectedAnswer: step3Equation,
            acceptedAnswers: [step3Equation, step3Equation.replace(/\s+/g, ''), `${d} * ${jumps} = ${totalChange}`, `${d}*${jumps}=${totalChange}`]
          },
          {
            label: `Write the working equation to find the ${targetN}${suffix} number:`,
            expectedAnswer: step4Equation,
            acceptedAnswers: [step4Equation, step4Equation.replace(/\s+/g, '')]
          }
        ]
      }, null, 2);
    }

    ruleDesc = `${isDescending ? 'subtracting' : 'adding'} a constant step of ${d}`;
    hint = `First find the common difference (${highPair} - ${lowPair} = ${d}). From the 1st number to the ${targetN}${suffix} number requires ${targetN} - 1 = ${jumps} jumps. Multiply the jumps by ${d} (${jumps} * ${d} = ${totalChange}) and apply it to the 1st number (${step4Equation}).`;

  // ==========================================================================
  // VARIANT 4: advanced_figurate_scaled_patterns (Square / Triangular Progressions)
  // ==========================================================================
  } else if (resolvedVariant === 'advanced_figurate_scaled_patterns') {
    let chosenVariety = varietyStr;
    const isSquare = chosenVariety.includes('square') || (!chosenVariety.includes('triangular') && Math.random() < 0.5);

    const scale = [500, 1000, 1500][Math.floor(Math.random() * 3)];
    const maxFigurate = isSquare ? (36 * scale) : (21 * scale);
    const maxOffset = Math.max(1000, 85000 - maxFigurate);
    const baseOffset = (Math.floor(Math.random() * (maxOffset / 1000))) * 1000 + 1000;

    const pattern = [];
    if (isSquare) {
      // n = 1, 2, 3, 4, 5, 6: offset + (n^2 * scale)
      for (let n = 1; n <= 6; n++) {
        pattern.push(baseOffset + (n * n * scale));
      }
    } else {
      // Triangular numbers: T(n) = n*(n+1)/2 => 1, 3, 6, 10, 15, 21
      for (let n = 1; n <= 6; n++) {
        pattern.push(baseOffset + ((n * (n + 1) / 2) * scale));
      }
    }

    let missingIndex = 5;
    if (chosenVariety.includes('intermediate') || chosenVariety.includes('middle')) {
      missingIndex = Math.random() < 0.5 ? 3 : 4;
    } else {
      missingIndex = 5; // tail
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

    const d0 = pattern[1] - pattern[0];
    const d1 = pattern[2] - pattern[1];
    const prevNum = pattern[missingIndex - 1];
    const targetDiff = pattern[missingIndex] - pattern[missingIndex - 1];
    const step3Equation = `${prevNum} + ${targetDiff} = ${correctNum}`;

    if (isMCQ) {
      // Distractor 1: repeated previous difference (constant difference misconception)
      const prevDiff = missingIndex >= 2 ? pattern[missingIndex - 1] - pattern[missingIndex - 2] : d0;
      const distractorLinear = prevNum + prevDiff;
      let distractorWrongIncrement = prevNum + (targetDiff + scale);
      if (distractorWrongIncrement > 98000) {
        distractorWrongIncrement = prevNum + (targetDiff - scale);
      }
      const distractorSub = prevNum - targetDiff > 0 ? prevNum - targetDiff : prevNum + 1000;

      const mcqRes = buildMcqOptions(finalAnswer, [
        { val: distractorLinear.toString(), defect: 'APPLIED_PREVIOUS_DIFFERENCE' },
        { val: distractorWrongIncrement.toString(), defect: 'WRONG_DIFFERENCE_INCREMENT' },
        { val: distractorSub.toString(), defect: 'SUBTRACTED_INSTEAD_OF_ADDED' }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          {
            label: "Write the working equations to find the first two differences between consecutive numbers:",
            expectedAnswer: `${pattern[1]} - ${pattern[0]} = ${d0}, ${pattern[2]} - ${pattern[1]} = ${d1}`,
            acceptedAnswers: [
              `${pattern[1]} - ${pattern[0]} = ${d0}, ${pattern[2]} - ${pattern[1]} = ${d1}`,
              `${pattern[1]}-${pattern[0]}=${d0}, ${pattern[2]}-${pattern[1]}=${d1}`,
              `${pattern[1]}-${pattern[0]}=${d0},${pattern[2]}-${pattern[1]}=${d1}`
            ]
          },
          {
            label: "What is the difference that must be added to the preceding number?",
            expectedAnswer: targetDiff.toString(),
            acceptedAnswers: [targetDiff.toString(), `+${targetDiff}`, `+ ${targetDiff}`]
          },
          {
            label: "Write the working equation to find the missing number:",
            expectedAnswer: step3Equation,
            acceptedAnswers: [step3Equation, step3Equation.replace(/\s+/g, '')]
          }
        ]
      }, null, 2);
    }

    ruleDesc = isSquare ? "differences increasing by consecutive odd multiples (square number growth)" : "differences increasing by consecutive multiples (triangular number growth)";
    hint = `Find the differences between consecutive terms: ${pattern[1]} - ${pattern[0]} = ${d0}, ${pattern[2]} - ${pattern[1]} = ${d1}. The differences grow by ${isSquare ? 2 * scale : scale} each step. The difference leading to the missing term is ${targetDiff}.`;

  // ==========================================================================
  // VARIANT 5: advanced_table_two_step_rule (Two-Step Function Table Rule)
  // ==========================================================================
  } else {
    let chosenVariety = varietyStr;
    const isAdd = chosenVariety.includes('add') || (!chosenVariety.includes('sub') && Math.random() < 0.5);

    let targetType = 'find_missing_output';
    if (chosenVariety.includes('input')) targetType = 'find_missing_input';
    else if (chosenVariety.includes('output')) targetType = 'find_missing_output';
    else targetType = Math.random() < 0.5 ? 'find_missing_input' : 'find_missing_output';

    const multiplier = [2, 3][Math.floor(Math.random() * 2)];
    const cOptions = [1000, 2000, 3000, 4000, 5000];
    const c = cOptions[Math.floor(Math.random() * cOptions.length)];

    // Generate 4 clean inputs (ensure inp * multiplier - c >= 3000)
    const baseInp1 = (Math.floor(Math.random() * 4) + 4) * 1000; // 4000 to 7000
    const inpStep = (Math.floor(Math.random() * 3) + 2) * 1000;  // 2000 to 4000
    const baseInputs = [
      baseInp1,
      baseInp1 + inpStep,
      baseInp1 + (2 * inpStep),
      baseInp1 + (3 * inpStep)
    ];

    const rows = baseInputs.map(inp => {
      const out = isAdd ? (inp * multiplier) + c : (inp * multiplier) - c;
      return [inp.toString(), out.toString()];
    });

    const targetRowIdx = Math.floor(Math.random() * 3) + 1; // row 1, 2, or 3 (row 0 is always complete)
    const targetInput = rows[targetRowIdx][0];
    const targetOutput = rows[targetRowIdx][1];

    if (targetType === 'find_missing_input') {
      rows[targetRowIdx][0] = "?";
      finalAnswer = targetInput;
    } else {
      rows[targetRowIdx][1] = "?";
      finalAnswer = targetOutput;
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "TABLE_PATTERN_VISUALIZER",
      componentData: {
        title: "Two-Step Number Machine",
        headers: ["Machine Input", "Machine Output"],
        rows
      }
    }, null, 2);

    const targetLabel = targetType === 'find_missing_input' ? 'Input' : 'Output';
    promptInstruction = `- Question stem: "The table below shows the inputs and outputs of a two-step number machine. Find the missing ${targetLabel} value marked with a question mark (?)."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    // Row 0 and Row 1 are used to demonstrate rule deduction
    const inp0 = Number(rows[0][0]);
    const out0 = Number(rows[0][1]);
    const inp1 = Number(rows[targetRowIdx === 1 ? 2 : 1][0]);
    const out1 = Number(rows[targetRowIdx === 1 ? 2 : 1][1]);

    const outDiff = out1 - out0;
    const inpDiff = inp1 - inp0;

    let step3Equation = "";
    if (targetType === 'find_missing_input') {
      step3Equation = isAdd
        ? `(${targetOutput} - ${c}) / ${multiplier} = ${targetInput}`
        : `(${targetOutput} + ${c}) / ${multiplier} = ${targetInput}`;
    } else {
      step3Equation = isAdd
        ? `(${targetInput} * ${multiplier}) + ${c} = ${targetOutput}`
        : `(${targetInput} * ${multiplier}) - ${c} = ${targetOutput}`;
    }

    if (isMCQ) {
      // Applied single operation only (confused with 1-step rule)
      const singleOpOffset = Math.abs(out0 - inp0);
      let distractorSingleOp = targetType === 'find_missing_input'
        ? (Number(targetOutput) - singleOpOffset)
        : (Number(targetInput) + singleOpOffset);
      if (distractorSingleOp <= 0 || distractorSingleOp > 100000) {
        distractorSingleOp = Number(finalAnswer) + 2000;
      }

      // Inverted operation order
      let distractorInverted = targetType === 'find_missing_input'
        ? Math.floor((Number(targetOutput) / multiplier) + (isAdd ? -c : c))
        : (((Number(targetInput) + (isAdd ? c : -c)) * multiplier));
      if (distractorInverted <= 0 || distractorInverted > 100000) {
        distractorInverted = Number(finalAnswer) - 2000 > 0 ? Number(finalAnswer) - 2000 : Number(finalAnswer) + 3000;
      }

      const distractorCareless = (Number(finalAnswer) + 1000 <= 100000)
        ? (Number(finalAnswer) + 1000).toString()
        : (Number(finalAnswer) - 1000).toString();

      const mcqRes = buildMcqOptions(finalAnswer, [
        { val: distractorSingleOp.toString(), defect: 'APPLIED_SINGLE_OPERATION_ONLY' },
        { val: distractorInverted.toString(), defect: 'INVERTED_TWO_STEP_OPERATION' },
        { val: distractorCareless, defect: 'CARELESS_CALCULATION' }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    } else if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          {
            label: "Write the working equation to find the multiplier between the outputs and inputs:",
            expectedAnswer: `${outDiff} / ${inpDiff} = ${multiplier}`,
            acceptedAnswers: [`${outDiff} / ${inpDiff} = ${multiplier}`, `${outDiff}/${inpDiff}=${multiplier}`]
          },
          {
            label: `Write the working equation to find the constant offset (${isAdd ? 'added' : 'subtracted'}):`,
            expectedAnswer: isAdd ? `${out0} - (${inp0} * ${multiplier}) = ${c}` : `(${inp0} * ${multiplier}) - ${out0} = ${c}`,
            acceptedAnswers: [
              isAdd ? `${out0} - (${inp0} * ${multiplier}) = ${c}` : `(${inp0} * ${multiplier}) - ${out0} = ${c}`,
              isAdd ? `${out0}-(${inp0}*${multiplier})=${c}` : `(${inp0}*${multiplier})-${out0}=${c}`,
              isAdd ? `${out0} - ${inp0 * multiplier} = ${c}` : `${inp0 * multiplier} - ${out0} = ${c}`,
              isAdd ? `${out0}-${inp0 * multiplier}=${c}` : `${inp0 * multiplier}-${out0}=${c}`
            ]
          },
          {
            label: `Write the working equation to find the missing ${targetLabel}:`,
            expectedAnswer: step3Equation,
            acceptedAnswers: [
              step3Equation,
              step3Equation.replace(/\s+/g, ''),
              targetType === 'find_missing_input'
                ? (isAdd ? `${targetOutput} - ${c} = ${Number(targetOutput) - c}` : `${targetOutput} + ${c} = ${Number(targetOutput) + c}`)
                : (isAdd ? `${targetInput} * ${multiplier} + ${c} = ${targetOutput}` : `${targetInput} * ${multiplier} - ${c} = ${targetOutput}`)
            ]
          }
        ]
      }, null, 2);
    }

    ruleDesc = `multiply Input by ${multiplier}, then ${isAdd ? 'add' : 'subtract'} ${c}`;
    hint = `Notice the output increases by ${outDiff} whenever the input increases by ${inpDiff}, meaning the multiplier is ${outDiff} / ${inpDiff} = ${multiplier}. Check the first row: (${inp0} * ${multiplier}) ${isAdd ? '+' : '-'} ${c} = ${out0}. Follow this two-step rule to find the missing ${targetLabel}.`;
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
