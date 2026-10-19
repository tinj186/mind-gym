import {
  getRandomBarGraphTheme,
  getRandomNames,
  getRandomPaletteColors,
  getRandomFinancialTheme,
  getRandomEqualizingTheme,
  getRandomTargetShortfallTheme
} from '../../../../../utils/variable-bank.js';

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getFourOptions = (correctVal, candidateDistractors = []) => {
  const set = new Set([String(correctVal)]);
  for (const d of candidateDistractors) {
    if (d !== undefined && d !== null && String(d).trim() !== '' && !set.has(String(d)) && set.size < 4) {
      set.add(String(d));
    }
  }

  const rawStr = String(correctVal).replace(/^\$/, '');
  const isDollar = String(correctVal).startsWith('$');
  const num = Number(rawStr);
  const step = (!isNaN(num) && Number.isInteger(num)) ? 1 : 0.5;
  let delta = 1;

  while (set.size < 4) {
    if (!isNaN(num)) {
      const offset = (set.size % 2 === 1 ? delta : -delta) * (step >= 1 ? (num >= 20 ? 10 : (num >= 10 ? 5 : 1)) : 0.5);
      const val = num + offset;
      if (val > 0) {
        const valStr = Number.isInteger(val) ? String(val) : String(Number(val.toFixed(1)));
        const candidate = isDollar ? `$${valStr}` : valStr;
        if (!set.has(candidate)) set.add(candidate);
      }
    } else {
      set.add(`Option ${set.size + 1}`);
    }
    delta++;
  }
  return Array.from(set);
};

const getMultiplicationAcceptedAnswers = (a, b, product) => {
  const ans = new Set([String(product)]);
  const symbols = ['x', 'X', '×', '*'];
  for (const sym of symbols) {
    ans.add(`${a} ${sym} ${b} = ${product}`);
    ans.add(`${b} ${sym} ${a} = ${product}`);
    ans.add(`${a}${sym}${b}=${product}`);
    ans.add(`${b}${sym}${a}=${product}`);
    ans.add(`$${product}`);
    ans.add(`${a} ${sym} ${b} = $${product}`);
    ans.add(`${b} ${sym} ${a} = $${product}`);
    ans.add(`${a}${sym}${b}=$${product}`);
    ans.add(`${b}${sym}${a}=$${product}`);
    ans.add(`${a} ${sym} $${b} = $${product}`);
    ans.add(`${a}${sym}$${b}=$${product}`);
    ans.add(`$${b} ${sym} ${a} = $${product}`);
    ans.add(`$${b}${sym}${a}=$${product}`);
  }
  return Array.from(ans);
};

const getDivisionAcceptedAnswers = (total, divisor, quotient) => {
  const ans = new Set([String(quotient)]);
  const symbols = ['÷', '/'];
  for (const sym of symbols) {
    ans.add(`${total} ${sym} ${divisor} = ${quotient}`);
    ans.add(`${total}${sym}${divisor}=${quotient}`);
    ans.add(`$${quotient}`);
    ans.add(`${total} ${sym} ${divisor} = $${quotient}`);
    ans.add(`${total}${sym}${divisor}=$${quotient}`);
    ans.add(`$${total} ${sym} ${divisor} = $${quotient}`);
    ans.add(`$${total}${sym}${divisor}=$${quotient}`);
  }
  return Array.from(ans);
};

const getAdditionAcceptedAnswers = (a, b, sum) => {
  const ans = new Set([String(sum)]);
  ans.add(`${a} + ${b} = ${sum}`);
  ans.add(`${b} + ${a} = ${sum}`);
  ans.add(`${a}+${b}=${sum}`);
  ans.add(`${b}+${a}=${sum}`);
  ans.add(`$${sum}`);
  ans.add(`${a} + ${b} = $${sum}`);
  ans.add(`${b} + ${a} = $${sum}`);
  ans.add(`${a}+${b}=$${sum}`);
  ans.add(`${b}+${a}=$${sum}`);
  return Array.from(ans);
};

const getThreeAdditionAcceptedAnswers = (a, b, c, sum) => {
  const ans = new Set([String(sum)]);
  const perms = [
    [a, b, c], [a, c, b],
    [b, a, c], [b, c, a],
    [c, a, b], [c, b, a]
  ];
  for (const [x, y, z] of perms) {
    ans.add(`${x} + ${y} + ${z} = ${sum}`);
    ans.add(`${x}+${y}+${z}=${sum}`);
    ans.add(`${x} + ${y + z} = ${sum}`);
    ans.add(`${x}+${y + z}=${sum}`);
    ans.add(`${x + y} + ${z} = ${sum}`);
    ans.add(`${x + y}+${z}=${sum}`);
  }
  return Array.from(ans);
};

const getSubtractionAcceptedAnswers = (a, b, diff) => {
  const ans = new Set([String(diff)]);
  ans.add(`${a} - ${b} = ${diff}`);
  ans.add(`${a}-${b}=${diff}`);
  ans.add(`$${diff}`);
  ans.add(`${a} - ${b} = $${diff}`);
  ans.add(`${a}-${b}=$${diff}`);
  return Array.from(ans);
};

export const generateAdvanced = (variant, type, getFormatInstructions) => {
  const safeType = String(type || 'short question').toLowerCase();
  const isMCQ = safeType === 'mcq';
  const isShort = safeType === 'short question';
  const isStructure = !isMCQ && !isShort;

  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

  // Map legacy aliases to canonical 5 new variants
  let canonicalVariant = variant;
  if (variant === 'advanced_missing_scale_missing_bar' || variant === 'advanced_axis_deduction_stated_differences') {
    canonicalVariant = 'advanced_missing_scale_value_difference_deduction';
  } else if (variant === 'advanced_drawing_translation_blocks') {
    canonicalVariant = 'advanced_scale_translation_block_projection';
  } else if (variant === 'advanced_financial_large_scales_halfway') {
    canonicalVariant = 'advanced_blank_axis_financial_application';
  } else if (variant === 'advanced_fractional_ratio_halfway') {
    canonicalVariant = 'advanced_equalizing_transfer_grid_block_shift';
  }

  // --------------------------------------------------------------------------
  // Variant 11: Missing Scale via Value Difference Deduction
  // --------------------------------------------------------------------------
  if (canonicalVariant === 'advanced_missing_scale_value_difference_deduction') {
    const scaleOptions = [5, 10, 20, 25, 40, 50];
    const scaleStep = scaleOptions[getRandomInt(0, scaleOptions.length - 1)];

    // 3 or 4 bars
    const barCount = Math.random() > 0.5 ? 4 : 3;
    const theme = getRandomBarGraphTheme(barCount, 'game_points') || getRandomBarGraphTheme(barCount);
    const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';

    // Choose blocks: A > B, C is 3rd bar, D optional 4th bar
    const diffBlocks = getRandomInt(2, 5); // 2, 3, 4, 5
    const bB = getRandomInt(2, 4); // 2, 3, 4
    const bA = bB + diffBlocks; // 4 to 9
    let bC = getRandomInt(3, 7);
    if (bC === bA) bC = Math.max(1, bA - 1);
    if (bC === bB) bC = bB + 1;
    const bD = barCount === 4 ? getRandomInt(2, 7) : 0;

    const diffVal = diffBlocks * scaleStep;
    const valA = bA * scaleStep;
    const valB = bB * scaleStep;
    const valC = bC * scaleStep;
    const valD = bD * scaleStep;

    const totalBlocks = bA + bB + bC + (barCount === 4 ? bD : 0);
    const grandTotal = totalBlocks * scaleStep;

    const catA = theme.items[0];
    const catB = theme.items[1];
    const catC = theme.items[2];
    const catD = barCount === 4 ? theme.items[3] : '';

    const colors = getRandomPaletteColors(barCount);
    const data = [
      { category: catA, value: valA, color: colors[0] },
      { category: catB, value: valB, color: colors[1] },
      { category: catC, value: valC, color: colors[2] }
    ];
    if (barCount === 4) {
      data.push({ category: catD, value: valD, color: colors[3] });
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_GRAPH",
      componentData: {
        title: theme.title,
        xAxisLabel: theme.xAxisLabel,
        yAxisLabel: theme.yAxisLabel,
        data,
        scaleStep,
        orientation,
        showGridLines: true,
        showScaleNumbers: false
      }
    });

    // Inquiry goal: single_bar (value of 1 bar), grand_total (total of all bars), bar_and_total (value of bar + total), combined_two_bars (sum of 2 bars)
    const goalTypes = ['single_bar', 'grand_total', 'bar_and_total', 'combined_two_bars'];
    const goal = goalTypes[getRandomInt(0, goalTypes.length - 1)];

    const valSumEquationTerms = barCount === 4 ? `${valA} + ${valB} + ${valC} + ${valD} = ${grandTotal}` : `${valA} + ${valB} + ${valC} = ${grandTotal}`;
    const valSumEquationTermsNoSpace = barCount === 4 ? `${valA}+${valB}+${valC}+${valD}=${grandTotal}` : `${valA}+${valB}+${valC}=${grandTotal}`;

    if (isStructure) {
      if (goal === 'single_bar') {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. ${catA} has ${diffVal} more ${theme.unit} than ${catB}. Determine what 1 grid block stands for, and then find the value of ${catC}."`;
        const stepsArr = [
          {
            label: `Write the working equation to find the difference in grid blocks between ${catA} and ${catB}:`,
            expectedAnswer: `${bA} - ${bB} = ${diffBlocks}`,
            acceptedAnswers: getSubtractionAcceptedAnswers(bA, bB, diffBlocks)
          },
          {
            label: `Write the working equation to find the value of 1 grid block:`,
            expectedAnswer: `${diffVal} / ${diffBlocks} = ${scaleStep}`,
            acceptedAnswers: getDivisionAcceptedAnswers(diffVal, diffBlocks, scaleStep)
          },
          {
            label: `Write the working equation to find the value of ${catC}:`,
            expectedAnswer: `${bC} x ${scaleStep} = ${valC}`,
            acceptedAnswers: getMultiplicationAcceptedAnswers(bC, scaleStep, valC)
          },
          {
            label: `${theme.unit.charAt(0).toUpperCase() + theme.unit.slice(1)} for ${catC}:`,
            expectedAnswer: String(valC),
            acceptedAnswers: [String(valC)]
          }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(valC);
      } else if (goal === 'grand_total') {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. ${catA} has ${diffVal} more ${theme.unit} than ${catB}. Determine what 1 grid block stands for, and then calculate the total number of ${theme.unit} across all categories combined."`;
        const stepsArr = [
          {
            label: `Write the working equation to find the difference in grid blocks between ${catA} and ${catB}:`,
            expectedAnswer: `${bA} - ${bB} = ${diffBlocks}`,
            acceptedAnswers: getSubtractionAcceptedAnswers(bA, bB, diffBlocks)
          },
          {
            label: `Write the working equation to find the value of 1 grid block:`,
            expectedAnswer: `${diffVal} / ${diffBlocks} = ${scaleStep}`,
            acceptedAnswers: getDivisionAcceptedAnswers(diffVal, diffBlocks, scaleStep)
          },
          {
            label: `Total number of grid blocks across all ${data.length} categories:`,
            expectedAnswer: String(totalBlocks),
            acceptedAnswers: [String(totalBlocks)]
          },
          {
            label: `Write the working equation to find the total ${theme.unit} across all categories:`,
            expectedAnswer: `${totalBlocks} x ${scaleStep} = ${grandTotal}`,
            acceptedAnswers: [
              ...getMultiplicationAcceptedAnswers(totalBlocks, scaleStep, grandTotal),
              valSumEquationTerms,
              valSumEquationTermsNoSpace,
              String(grandTotal)
            ]
          },
          {
            label: `Total ${theme.unit} across all categories:`,
            expectedAnswer: String(grandTotal),
            acceptedAnswers: [String(grandTotal)]
          }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(grandTotal);
      } else if (goal === 'bar_and_total') {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. ${catA} has ${diffVal} more ${theme.unit} than ${catB}. Determine what 1 grid block stands for, find the value of ${catC}, and then calculate the total number of ${theme.unit} across all categories combined."`;
        const stepsArr = [
          {
            label: `Write the working equation to find the difference in grid blocks between ${catA} and ${catB}:`,
            expectedAnswer: `${bA} - ${bB} = ${diffBlocks}`,
            acceptedAnswers: getSubtractionAcceptedAnswers(bA, bB, diffBlocks)
          },
          {
            label: `Write the working equation to find the value of 1 grid block:`,
            expectedAnswer: `${diffVal} / ${diffBlocks} = ${scaleStep}`,
            acceptedAnswers: getDivisionAcceptedAnswers(diffVal, diffBlocks, scaleStep)
          },
          {
            label: `Write the working equation to find the value of ${catC}:`,
            expectedAnswer: `${bC} x ${scaleStep} = ${valC}`,
            acceptedAnswers: getMultiplicationAcceptedAnswers(bC, scaleStep, valC)
          },
          {
            label: `Write the working equation to find the total ${theme.unit} across all categories:`,
            expectedAnswer: `${totalBlocks} x ${scaleStep} = ${grandTotal}`,
            acceptedAnswers: [
              ...getMultiplicationAcceptedAnswers(totalBlocks, scaleStep, grandTotal),
              valSumEquationTerms,
              valSumEquationTermsNoSpace,
              String(grandTotal)
            ]
          },
          {
            label: `Total ${theme.unit} across all categories:`,
            expectedAnswer: String(grandTotal),
            acceptedAnswers: [String(grandTotal)]
          }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(grandTotal);
      } else {
        // combined_two_bars
        const combinedBlocks = bA + bC;
        const combinedVal = combinedBlocks * scaleStep;
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. ${catA} has ${diffVal} more ${theme.unit} than ${catB}. Determine what 1 grid block stands for, and then calculate the combined total of ${catA} and ${catC}."`;
        const stepsArr = [
          {
            label: `Write the working equation to find the difference in grid blocks between ${catA} and ${catB}:`,
            expectedAnswer: `${bA} - ${bB} = ${diffBlocks}`,
            acceptedAnswers: getSubtractionAcceptedAnswers(bA, bB, diffBlocks)
          },
          {
            label: `Write the working equation to find the value of 1 grid block:`,
            expectedAnswer: `${diffVal} / ${diffBlocks} = ${scaleStep}`,
            acceptedAnswers: getDivisionAcceptedAnswers(diffVal, diffBlocks, scaleStep)
          },
          {
            label: `Write the working equation to find the total grid blocks for ${catA} and ${catC} combined:`,
            expectedAnswer: `${bA} + ${bC} = ${combinedBlocks}`,
            acceptedAnswers: getAdditionAcceptedAnswers(bA, bC, combinedBlocks)
          },
          {
            label: `Write the working equation to find the combined total for ${catA} and ${catC}:`,
            expectedAnswer: `${combinedBlocks} x ${scaleStep} = ${combinedVal}`,
            acceptedAnswers: [
              ...getMultiplicationAcceptedAnswers(combinedBlocks, scaleStep, combinedVal),
              `${valA} + ${valC} = ${combinedVal}`,
              `${valA}+${valC}=${combinedVal}`,
              `${valC} + ${valA} = ${combinedVal}`,
              `${valC}+${valA}=${combinedVal}`,
              String(combinedVal)
            ]
          },
          {
            label: `Combined total for ${catA} and ${catC}:`,
            expectedAnswer: String(combinedVal),
            acceptedAnswers: [String(combinedVal)]
          }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(combinedVal);
      }
    } else if (isMCQ) {
      if (goal === 'single_bar') {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers on the bar graph are missing. ${catA} has ${diffVal} more ${theme.unit} than ${catB}. How many ${theme.unit} does ${catC} represent?"`;
        finalAnswer = String(valC);
        const opts = getFourOptions(finalAnswer, [
          String(valC + scaleStep),
          String(Math.max(scaleStep, valC - scaleStep)),
          String(valB),
          String(valA)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else if (goal === 'grand_total' || goal === 'bar_and_total') {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers on the bar graph are missing. ${catA} has ${diffVal} more ${theme.unit} than ${catB}. What is the total number of ${theme.unit} across all categories combined?"`;
        finalAnswer = String(grandTotal);
        const opts = getFourOptions(finalAnswer, [
          String(grandTotal - scaleStep * 2),
          String(grandTotal + scaleStep * 2),
          String(valA + valB),
          String(totalBlocks * (scaleStep + 5))
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        // combined_two_bars
        const combinedVal = (bA + bC) * scaleStep;
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers on the bar graph are missing. ${catA} has ${diffVal} more ${theme.unit} than ${catB}. What is the combined total of ${catA} and ${catC}?"`;
        finalAnswer = String(combinedVal);
        const opts = getFourOptions(finalAnswer, [
          String((bA + bC + 1) * scaleStep),
          String(Math.max(scaleStep, (bA + bC - 1) * scaleStep)),
          String(valA + valB),
          String(grandTotal)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      }
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
    } else {
      // Short Question
      if (goal === 'single_bar') {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers on the bar graph are missing. ${catA} represents ${diffVal} more ${theme.unit} than ${catB}. What is the value of ${catC}?"`;
        finalAnswer = String(valC);
      } else if (goal === 'grand_total' || goal === 'bar_and_total') {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers on the bar graph are missing. ${catA} represents ${diffVal} more ${theme.unit} than ${catB}. What is the total number of ${theme.unit} across all categories combined?"`;
        finalAnswer = String(grandTotal);
      } else {
        const combinedVal = (bA + bC) * scaleStep;
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers on the bar graph are missing. ${catA} represents ${diffVal} more ${theme.unit} than ${catB}. What is the combined total for ${catA} and ${catC}?"`;
        finalAnswer = String(combinedVal);
      }
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

  // --------------------------------------------------------------------------
  // Variant 12: Scale Translation & Block Projection
  // --------------------------------------------------------------------------
  } else if (canonicalVariant === 'advanced_scale_translation_block_projection') {
    const scalePairOptions = [
      { scale1: 10, scale2: 50 },
      { scale1: 10, scale2: 25 },
      { scale1: 20, scale2: 50 },
      { scale1: 20, scale2: 100 },
      { scale1: 25, scale2: 50 },
      { scale1: 25, scale2: 100 },
      { scale1: 5, scale2: 20 },
      { scale1: 5, scale2: 50 }
    ];
    const pair = scalePairOptions[getRandomInt(0, scalePairOptions.length - 1)];
    const scale1 = pair.scale1;
    const scale2 = pair.scale2;

    const barCount = Math.random() > 0.5 ? 4 : 3;
    const theme = getRandomBarGraphTheme(barCount);
    const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';

    // 4 inquiry sub-varieties: 'addition', 'subtraction', 'combined', 'reverse_working'
    const subTypes = ['addition', 'subtraction', 'combined', 'reverse_working'];
    const subType = subTypes[getRandomInt(0, subTypes.length - 1)];

    if (subType === 'addition') {
      const catIdx = getRandomInt(0, barCount - 1);
      const cat = theme.items[catIdx];

      const blocksNeededOptions = [3, 4, 5, 6];
      const blocksNeeded = blocksNeededOptions[getRandomInt(0, blocksNeededOptions.length - 1)];
      const newTotal = blocksNeeded * scale2;

      const isHalf = Math.random() > 0.5 && (scale1 % 2 === 0);
      let startVal;
      if (isHalf) {
        const halfStep = scale1 / 2;
        const maxBlocks1 = Math.floor((newTotal - halfStep) / scale1);
        const b1 = Math.max(1, getRandomInt(Math.max(1, maxBlocks1 - 3), Math.max(1, maxBlocks1 - 1)));
        startVal = b1 * scale1 + halfStep;
      } else {
        const maxBlocks1 = Math.floor((newTotal - scale1) / scale1);
        const b1 = Math.max(1, getRandomInt(Math.max(1, maxBlocks1 - 3), maxBlocks1));
        startVal = b1 * scale1;
      }
      const delta = newTotal - startVal;

      const addVerbs = ['added', 'donated', 'collected', 'received', 'baked', 'produced', 'packed', 'gathered'];
      const verb = addVerbs[getRandomInt(0, addVerbs.length - 1)];

      const colors = getRandomPaletteColors(barCount);
      const data = theme.items.map((item, idx) => {
        if (idx === catIdx) return { category: item, value: startVal, color: colors[idx] };
        const bOther = getRandomInt(1, Math.max(2, Math.floor(startVal / scale1) + 2));
        const valOther = (Math.random() > 0.5 && scale1 % 2 === 0) ? (bOther * scale1 + scale1 / 2) : (bOther * scale1);
        return { category: item, value: valOther, color: colors[idx] };
      });

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep: scale1,
          orientation,
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Later, ${delta} more ${theme.unit} are ${verb} for ${cat}. If the new total is drawn on a new graph where 1 grid block stands for ${scale2} ${theme.unit}, how many grid blocks tall will the bar for ${cat} be?"`;
        const stepsArr = [
          {
            label: `Number of ${theme.unit} for ${cat} on the graph:`,
            expectedAnswer: String(startVal),
            acceptedAnswers: [String(startVal)]
          },
          {
            label: `Write the working equation to find the new total of ${cat}:`,
            expectedAnswer: `${startVal} + ${delta} = ${newTotal}`,
            acceptedAnswers: getAdditionAcceptedAnswers(startVal, delta, newTotal)
          },
          {
            label: `Write the working equation to find the number of grid blocks needed on the new graph:`,
            expectedAnswer: `${newTotal} / ${scale2} = ${blocksNeeded}`,
            acceptedAnswers: getDivisionAcceptedAnswers(newTotal, scale2, blocksNeeded)
          },
          {
            label: `Number of grid blocks tall:`,
            expectedAnswer: String(blocksNeeded),
            acceptedAnswers: [String(blocksNeeded)]
          }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(blocksNeeded);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. After ${delta} more ${theme.unit} are ${verb} for ${cat}, the new total is drawn on a new graph where 1 grid block stands for ${scale2} ${theme.unit}. How many grid blocks tall will the bar for ${cat} be?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(blocksNeeded);
        const opts = getFourOptions(finalAnswer, [
          String(blocksNeeded + 1),
          String(Math.max(1, blocksNeeded - 1)),
          String(blocksNeeded + 2),
          String(Math.max(1, blocksNeeded - 2))
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. After ${delta} more ${theme.unit} are ${verb} for ${cat}, the new total is drawn on a new graph where 1 grid block stands for ${scale2} ${theme.unit}. How many grid blocks tall will the bar be?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(blocksNeeded);
      }

    } else if (subType === 'subtraction') {
      const catIdx = getRandomInt(0, barCount - 1);
      const cat = theme.items[catIdx];

      const blocksNeededOptions = [2, 3, 4, 5];
      const blocksNeeded = blocksNeededOptions[getRandomInt(0, blocksNeededOptions.length - 1)];
      const newTotal = blocksNeeded * scale2;

      const isHalf = Math.random() > 0.5 && (scale1 % 2 === 0);
      let startVal;
      if (isHalf) {
        const halfStep = scale1 / 2;
        const minBlocks1 = Math.ceil((newTotal + halfStep) / scale1);
        const b1 = getRandomInt(minBlocks1, minBlocks1 + 3);
        startVal = b1 * scale1 + halfStep;
      } else {
        const minBlocks1 = Math.ceil((newTotal + scale1) / scale1);
        const b1 = getRandomInt(minBlocks1, minBlocks1 + 3);
        startVal = b1 * scale1;
      }
      const delta = startVal - newTotal;

      const removeVerbs = ['sold', 'given away', 'eaten', 'distributed', 'used', 'borrowed'];
      const verb = removeVerbs[getRandomInt(0, removeVerbs.length - 1)];

      const colors = getRandomPaletteColors(barCount);
      const data = theme.items.map((item, idx) => {
        if (idx === catIdx) return { category: item, value: startVal, color: colors[idx] };
        const bOther = getRandomInt(1, Math.max(2, Math.floor(startVal / scale1)));
        const valOther = (Math.random() > 0.5 && scale1 % 2 === 0) ? (bOther * scale1 + scale1 / 2) : (bOther * scale1);
        return { category: item, value: valOther, color: colors[idx] };
      });

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep: scale1,
          orientation,
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Later, ${delta} ${theme.unit} are ${verb} from ${cat}. If the remaining amount is drawn on a new graph where 1 grid block stands for ${scale2} ${theme.unit}, how many grid blocks tall will the bar for ${cat} be?"`;
        const stepsArr = [
          {
            label: `Number of ${theme.unit} for ${cat} on the graph:`,
            expectedAnswer: String(startVal),
            acceptedAnswers: [String(startVal)]
          },
          {
            label: `Write the working equation to find the remaining amount of ${cat}:`,
            expectedAnswer: `${startVal} - ${delta} = ${newTotal}`,
            acceptedAnswers: getSubtractionAcceptedAnswers(startVal, delta, newTotal)
          },
          {
            label: `Write the working equation to find the number of grid blocks needed on the new graph:`,
            expectedAnswer: `${newTotal} / ${scale2} = ${blocksNeeded}`,
            acceptedAnswers: getDivisionAcceptedAnswers(newTotal, scale2, blocksNeeded)
          },
          {
            label: `Number of grid blocks tall:`,
            expectedAnswer: String(blocksNeeded),
            acceptedAnswers: [String(blocksNeeded)]
          }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(blocksNeeded);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. After ${delta} ${theme.unit} are ${verb} from ${cat}, the remaining amount is drawn on a new graph where 1 grid block stands for ${scale2} ${theme.unit}. How many grid blocks tall will the bar for ${cat} be?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(blocksNeeded);
        const opts = getFourOptions(finalAnswer, [
          String(blocksNeeded + 1),
          String(Math.max(1, blocksNeeded - 1)),
          String(blocksNeeded + 2),
          String(Math.max(1, blocksNeeded - 2))
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. If ${delta} ${theme.unit} are ${verb} from ${cat}, and the remaining amount is drawn on a new graph where 1 grid block stands for ${scale2} ${theme.unit}, how many grid blocks tall will the bar be?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(blocksNeeded);
      }

    } else if (subType === 'combined') {
      const idx1 = 0;
      const idx2 = 1;
      const cat1 = theme.items[idx1];
      const cat2 = theme.items[idx2];

      const blocksNeededOptions = [3, 4, 5, 6];
      const blocksNeeded = blocksNeededOptions[getRandomInt(0, blocksNeededOptions.length - 1)];
      const combinedTotal = blocksNeeded * scale2;

      const isHalf1 = Math.random() > 0.5 && (scale1 % 2 === 0);
      const halfStep = scale1 / 2;
      let val1, val2;
      if (isHalf1) {
        const maxB1 = Math.floor((combinedTotal - halfStep - scale1) / scale1);
        const b1 = Math.max(1, getRandomInt(1, Math.max(1, maxB1)));
        val1 = b1 * scale1 + halfStep;
        val2 = combinedTotal - val1;
      } else {
        const maxB1 = Math.floor((combinedTotal - scale1) / scale1);
        const b1 = Math.max(1, getRandomInt(1, Math.max(1, maxB1)));
        val1 = b1 * scale1;
        val2 = combinedTotal - val1;
      }

      const colors = getRandomPaletteColors(barCount);
      const data = theme.items.map((item, idx) => {
        if (idx === idx1) return { category: item, value: val1, color: colors[idx] };
        if (idx === idx2) return { category: item, value: val2, color: colors[idx] };
        const bOther = getRandomInt(1, Math.max(2, Math.floor(val1 / scale1)));
        const valOther = (Math.random() > 0.5 && scale1 % 2 === 0) ? (bOther * scale1 + scale1 / 2) : (bOther * scale1);
        return { category: item, value: valOther, color: colors[idx] };
      });

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep: scale1,
          orientation,
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. If the combined total of ${cat1} and ${cat2} is drawn as a summary bar on a new graph where 1 grid block stands for ${scale2} ${theme.unit}, how many grid blocks tall will the summary bar be?"`;
        const stepsArr = [
          {
            label: `Number of ${theme.unit} for ${cat1} on the graph:`,
            expectedAnswer: String(val1),
            acceptedAnswers: [String(val1)]
          },
          {
            label: `Number of ${theme.unit} for ${cat2} on the graph:`,
            expectedAnswer: String(val2),
            acceptedAnswers: [String(val2)]
          },
          {
            label: `Write the working equation to find the combined total of ${cat1} and ${cat2}:`,
            expectedAnswer: `${val1} + ${val2} = ${combinedTotal}`,
            acceptedAnswers: getAdditionAcceptedAnswers(val1, val2, combinedTotal)
          },
          {
            label: `Write the working equation to find the number of grid blocks needed on the new graph:`,
            expectedAnswer: `${combinedTotal} / ${scale2} = ${blocksNeeded}`,
            acceptedAnswers: getDivisionAcceptedAnswers(combinedTotal, scale2, blocksNeeded)
          },
          {
            label: `Number of grid blocks tall:`,
            expectedAnswer: String(blocksNeeded),
            acceptedAnswers: [String(blocksNeeded)]
          }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(blocksNeeded);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. If the combined total of ${cat1} and ${cat2} is drawn on a new graph where 1 grid block stands for ${scale2} ${theme.unit}, how many grid blocks tall will the combined bar be?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(blocksNeeded);
        const opts = getFourOptions(finalAnswer, [
          String(blocksNeeded + 1),
          String(Math.max(1, blocksNeeded - 1)),
          String(blocksNeeded + 2),
          String(Math.max(1, blocksNeeded - 2))
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. If the combined total of ${cat1} and ${cat2} is drawn on a new graph where 1 grid block stands for ${scale2} ${theme.unit}, how many grid blocks tall will the combined bar be?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(blocksNeeded);
      }

    } else {
      // reverse_working
      const catIdx = getRandomInt(0, barCount - 1);
      const cat = theme.items[catIdx];

      const blocksNew = getRandomInt(3, 6);
      const newTotal = blocksNew * scale2;

      const isHalf = Math.random() > 0.5 && (scale1 % 2 === 0);
      let startVal;
      if (isHalf) {
        const halfStep = scale1 / 2;
        const maxBlocks1 = Math.floor((newTotal - halfStep) / scale1);
        const b1 = Math.max(1, getRandomInt(Math.max(1, maxBlocks1 - 3), Math.max(1, maxBlocks1 - 1)));
        startVal = b1 * scale1 + halfStep;
      } else {
        const maxBlocks1 = Math.floor((newTotal - scale1) / scale1);
        const b1 = Math.max(1, getRandomInt(Math.max(1, maxBlocks1 - 3), maxBlocks1));
        startVal = b1 * scale1;
      }
      const delta = newTotal - startVal;

      const colors = getRandomPaletteColors(barCount);
      const data = theme.items.map((item, idx) => {
        if (idx === catIdx) return { category: item, value: startVal, color: colors[idx] };
        const bOther = getRandomInt(1, Math.max(2, Math.floor(startVal / scale1) + 2));
        const valOther = (Math.random() > 0.5 && scale1 % 2 === 0) ? (bOther * scale1 + scale1 / 2) : (bOther * scale1);
        return { category: item, value: valOther, color: colors[idx] };
      });

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep: scale1,
          orientation,
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Later, more ${theme.unit} were added to ${cat}, and the new total was drawn on a new graph where 1 grid block stands for ${scale2} ${theme.unit}. On the new graph, the bar for ${cat} is ${blocksNew} grid blocks tall. How many ${theme.unit} were added?"`;
        const stepsArr = [
          {
            label: `Number of ${theme.unit} for ${cat} on the graph:`,
            expectedAnswer: String(startVal),
            acceptedAnswers: [String(startVal)]
          },
          {
            label: `Write the working equation to find the new total on the new graph:`,
            expectedAnswer: `${blocksNew} x ${scale2} = ${newTotal}`,
            acceptedAnswers: getMultiplicationAcceptedAnswers(blocksNew, scale2, newTotal)
          },
          {
            label: `Write the working equation to find how many ${theme.unit} were added:`,
            expectedAnswer: `${newTotal} - ${startVal} = ${delta}`,
            acceptedAnswers: getSubtractionAcceptedAnswers(newTotal, startVal, delta)
          },
          {
            label: `Number of ${theme.unit} added:`,
            expectedAnswer: String(delta),
            acceptedAnswers: [String(delta)]
          }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(delta);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Later, more ${theme.unit} were added to ${cat} and drawn on a new graph where 1 grid block stands for ${scale2} ${theme.unit} as a bar ${blocksNew} grid blocks tall. How many ${theme.unit} were added?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(delta);
        const opts = getFourOptions(finalAnswer, [
          String(delta + scale2),
          String(Math.max(scale1, delta - scale2)),
          String(newTotal),
          String(startVal)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. After more ${theme.unit} are added to ${cat}, the new total is drawn ${blocksNew} grid blocks tall on a new graph where 1 grid block stands for ${scale2} ${theme.unit}. How many ${theme.unit} were added?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(delta);
      }
    }

  // --------------------------------------------------------------------------
  // Variant 13: Blank Axis Financial Application
  // --------------------------------------------------------------------------
  } else if (canonicalVariant === 'advanced_blank_axis_financial_application') {
    const finTheme = getRandomFinancialTheme(4);
    const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';

    // 3 or 4 bars
    const barCount = Math.random() > 0.5 ? 4 : 3;
    const blocksPool = barCount === 4
      ? [getRandomInt(3, 6), getRandomInt(4, 7), getRandomInt(2, 5), getRandomInt(3, 6)]
      : [getRandomInt(2, 4), getRandomInt(4, 6), getRandomInt(3, 5)];
    const totalBlocks = blocksPool.reduce((acc, b) => acc + b, 0);

    const scaleOptions = [10, 20, 25, 30, 40, 50];
    const scaleStep = scaleOptions[getRandomInt(0, scaleOptions.length - 1)];
    const grandTotal = totalBlocks * scaleStep;

    const targetIdx = getRandomInt(0, barCount - 1);
    const bTarget = blocksPool[targetIdx];
    const qty = bTarget * scaleStep;
    const price = finTheme.prices[targetIdx] || getRandomInt(2, 5);
    const totalCost = qty * price;

    const catTarget = finTheme.items[targetIdx];
    const singularUnit = finTheme.unit.endsWith('s') ? finTheme.unit.slice(0, -1) : finTheme.unit;

    const colors = getRandomPaletteColors(barCount);
    const data = blocksPool.map((b, i) => ({
      category: finTheme.items[i],
      value: b * scaleStep,
      color: colors[i]
    }));

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_GRAPH",
      componentData: {
        title: finTheme.title,
        xAxisLabel: finTheme.xAxisLabel,
        yAxisLabel: finTheme.yAxisLabel,
        data,
        scaleStep,
        orientation,
        showGridLines: true,
        showScaleNumbers: false
      }
    });

    if (isStructure) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph tracks the number of ${finTheme.unit} ${finTheme.verb || 'sold'}, but the axis numbers on the graph are missing. The grand total of all ${finTheme.unit} sold across all categories is exactly ${grandTotal} ${finTheme.unit}. If every ${singularUnit} in ${catTarget} is sold for $${price}, find the total money collected from ${catTarget}."`;
      const stepsArr = [
        {
          label: `Total number of grid blocks across all ${barCount} categories:`,
          expectedAnswer: String(totalBlocks),
          acceptedAnswers: [String(totalBlocks)]
        },
        {
          label: `Write the working equation to find the value of 1 grid block:`,
          expectedAnswer: `${grandTotal} / ${totalBlocks} = ${scaleStep}`,
          acceptedAnswers: getDivisionAcceptedAnswers(grandTotal, totalBlocks, scaleStep)
        },
        {
          label: `Write the working equation to find the exact number of ${catTarget} sold:`,
          expectedAnswer: `${bTarget} x ${scaleStep} = ${qty}`,
          acceptedAnswers: getMultiplicationAcceptedAnswers(bTarget, scaleStep, qty)
        },
        {
          label: `Write the working equation to find the total money collected from ${catTarget}:`,
          expectedAnswer: `${qty} x ${price} = ${totalCost}`,
          acceptedAnswers: getMultiplicationAcceptedAnswers(qty, price, totalCost)
        }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      finalAnswer = String(totalCost);
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers on the bar graph are missing. The grand total across all categories is ${grandTotal} ${finTheme.unit}. If each ${singularUnit} in ${catTarget} is sold for $${price}, how much money was collected from ${catTarget}?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
      finalAnswer = `$${totalCost}`;
      const opts = getFourOptions(finalAnswer, [
        `$${qty}`,
        `$${totalBlocks * price}`,
        `$${Math.round(grandTotal * price / barCount)}`,
        `$${totalCost + scaleStep * price}`
      ]);
      mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers on the bar graph are missing. The grand total across all categories is ${grandTotal} ${finTheme.unit}. If each ${singularUnit} in ${catTarget} costs $${price}, how much money was collected from ${catTarget}?"`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      finalAnswer = String(totalCost);
    }

  // --------------------------------------------------------------------------
  // Variant 14: Equalizing Transfer (Grid Block Shift)
  // --------------------------------------------------------------------------
  } else if (canonicalVariant === 'advanced_equalizing_transfer_grid_block_shift') {
    const scaleOptions = [10, 20, 50];
    const scaleStep = scaleOptions[getRandomInt(0, scaleOptions.length - 1)];
    const eqTheme = getRandomEqualizingTheme(3);
    const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';

    // bA > bB, diffBlocks is EVEN (2, 4, 6)
    const blocksDropped = getRandomInt(1, 3); // 1, 2, 3
    const diffBlocks = blocksDropped * 2; // 2, 4, 6
    const bB = getRandomInt(2, 4); // 2, 3, 4
    const bA = bB + diffBlocks; // 4 to 10

    const valA = bA * scaleStep;
    const valB = bB * scaleStep;
    const valDiff = valA - valB;
    const itemsMoved = valDiff / 2;

    const catA = eqTheme.items[0];
    const catB = eqTheme.items[1];

    const colors = getRandomPaletteColors(2);
    const data = [
      { category: catA, value: valA, color: colors[0] },
      { category: catB, value: valB, color: colors[1] }
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_GRAPH",
      componentData: {
        title: eqTheme.title,
        xAxisLabel: eqTheme.xAxisLabel,
        yAxisLabel: eqTheme.yAxisLabel,
        data,
        scaleStep,
        orientation,
        showGridLines: true
      }
    });

    if (isStructure) {
      const containerName = eqTheme.containersPlural || 'groups';
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the number of ${eqTheme.unit} in ${catA} and ${catB}. Some ${eqTheme.unit} are moved from ${catA} to ${catB} so that both ${containerName} have the exact same number of ${eqTheme.unit}. How many grid blocks shorter will the bar for ${catA} become?"`;
      const stepsArr = [
        {
          label: `Write the working equation to find the difference in ${eqTheme.unit} between the two ${containerName}:`,
          expectedAnswer: `${valA} - ${valB} = ${valDiff}`,
          acceptedAnswers: getSubtractionAcceptedAnswers(valA, valB, valDiff)
        },
        {
          label: `Write the working equation to find how many ${eqTheme.unit} must be moved:`,
          expectedAnswer: `${valDiff} / 2 = ${itemsMoved}`,
          acceptedAnswers: getDivisionAcceptedAnswers(valDiff, 2, itemsMoved)
        },
        {
          label: `Write the working equation to find how many grid blocks ${catA}'s bar will drop by:`,
          expectedAnswer: `${itemsMoved} / ${scaleStep} = ${blocksDropped}`,
          acceptedAnswers: getDivisionAcceptedAnswers(itemsMoved, scaleStep, blocksDropped)
        },
        {
          label: `Number of grid blocks ${catA} will drop by:`,
          expectedAnswer: String(blocksDropped),
          acceptedAnswers: [String(blocksDropped)]
        }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      finalAnswer = String(blocksDropped);
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the number of ${eqTheme.unit} in ${catA} and ${catB}. If ${eqTheme.unit} are moved from ${catA} to ${catB} so that both have equal amounts, how many grid blocks shorter will ${catA}'s bar become?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
      finalAnswer = String(blocksDropped);
      const opts = getFourOptions(finalAnswer, [
        String(diffBlocks),
        String(blocksDropped + 1),
        String(Math.max(1, blocksDropped - 1) === blocksDropped ? blocksDropped + 2 : Math.max(1, blocksDropped - 1)),
        String(blocksDropped + 3)
      ]);
      mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the number of ${eqTheme.unit} in ${catA} and ${catB}. Items are transferred from ${catA} to ${catB} until they have the same amount. How many grid blocks shorter will ${catA}'s bar become?"`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      finalAnswer = String(blocksDropped);
    }

  // --------------------------------------------------------------------------
  // Variant 15: Target Shortfall & Bar Height Prediction
  // --------------------------------------------------------------------------
  } else {
    // advanced_target_shortfall_bar_height_prediction
    const scaleOptions = [50, 100];
    const scaleStep = scaleOptions[getRandomInt(0, 1)];

    const sfTheme = getRandomTargetShortfallTheme(4);
    const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';

    const periods = sfTheme.items && sfTheme.items.length >= 4 ? sfTheme.items.slice(0, 4) : ["Week 1", "Week 2", "Week 3", "Week 4"];
    const cat1 = periods[0];
    const cat2 = periods[1];
    const cat3 = periods[2];
    const cat4 = periods[3]; // The missing 4th bar

    // Generate values for 1, 2, 3 where one or two can land on halfway marks
    const possibleBlocks = [2, 2.5, 3, 3.5, 4];
    const b1 = possibleBlocks[getRandomInt(0, possibleBlocks.length - 1)];
    const b2 = possibleBlocks[getRandomInt(0, possibleBlocks.length - 1)];
    const b3 = possibleBlocks[getRandomInt(0, possibleBlocks.length - 1)];

    const val1 = b1 * scaleStep;
    const val2 = b2 * scaleStep;
    const val3 = b3 * scaleStep;
    const sum123 = val1 + val2 + val3;

    // blocksNeeded for 4th period
    const blocksNeededOptions = [2, 2.5, 3, 3.5, 4];
    const blocksNeeded = blocksNeededOptions[getRandomInt(0, blocksNeededOptions.length - 1)];
    const shortage = blocksNeeded * scaleStep;
    const goal = sum123 + shortage;

    const colors = getRandomPaletteColors(4);
    const data = [
      { category: cat1, value: val1, color: colors[0] },
      { category: cat2, value: val2, color: colors[1] },
      { category: cat3, value: val3, color: colors[2] },
      { category: cat4, value: 0, color: colors[3] }
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_GRAPH",
      componentData: {
        title: sfTheme.title,
        xAxisLabel: sfTheme.xAxisLabel,
        yAxisLabel: sfTheme.yAxisLabel,
        data,
        scaleStep,
        orientation,
        showGridLines: true,
        missingBar: cat4
      }
    });

    if (isStructure) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A goal was set to collect exactly ${goal} ${sfTheme.unit} across all 4 categories. The bar graph shows the amounts collected for ${cat1}, ${cat2}, and ${cat3}. To reach the goal, how many grid blocks tall must the bar for ${cat4} be drawn?"`;
      const stepsArr = [
        {
          label: `Write the working equation to find the total ${sfTheme.unit} collected in ${cat1}, ${cat2}, and ${cat3}:`,
          expectedAnswer: `${val1} + ${val2} + ${val3} = ${sum123}`,
          acceptedAnswers: getThreeAdditionAcceptedAnswers(val1, val2, val3, sum123)
        },
        {
          label: `Write the working equation to find the shortage needed for ${cat4}:`,
          expectedAnswer: `${goal} - ${sum123} = ${shortage}`,
          acceptedAnswers: getSubtractionAcceptedAnswers(goal, sum123, shortage)
        },
        {
          label: `Write the working equation to find how many grid blocks tall the bar for ${cat4} must be:`,
          expectedAnswer: `${shortage} / ${scaleStep} = ${blocksNeeded}`,
          acceptedAnswers: getDivisionAcceptedAnswers(shortage, scaleStep, blocksNeeded)
        },
        {
          label: `Number of grid blocks tall:`,
          expectedAnswer: String(blocksNeeded),
          acceptedAnswers: [String(blocksNeeded)]
        }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      finalAnswer = String(blocksNeeded);
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A goal was set to collect ${goal} ${sfTheme.unit} across all 4 categories. Based on the bar graph, how many grid blocks tall must the bar for ${cat4} be drawn to reach the goal?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
      finalAnswer = String(blocksNeeded);
      const opts = getFourOptions(finalAnswer, [
        String(blocksNeeded + 1),
        String(blocksNeeded - 0.5 > 0 ? blocksNeeded - 0.5 : blocksNeeded + 1.5),
        String(blocksNeeded + 0.5),
        String(blocksNeeded - 1 > 0 ? blocksNeeded - 1 : blocksNeeded + 2)
      ]);
      mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A goal was set to collect ${goal} ${sfTheme.unit} across all 4 categories. Based on the bar graph, how many grid blocks tall must the bar for ${cat4} be drawn to reach the goal?"`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      finalAnswer = String(blocksNeeded);
    }
  }

  const aiPrompt = `CRITICAL INSTRUCTIONS:
1. You MUST use the exact "questionText" provided below.
2. You MUST use the exact "finalAnswer" provided below.
3. Generate detailed, pedagogical "solutionSteps" explaining the reading of the bar graph and calculation.
${mcqOptionsPrompt}

${getFormatInstructions(visualEngineStr, inputRequirementStr, askText, finalAnswer)}`;

  return { aiPrompt };
};
