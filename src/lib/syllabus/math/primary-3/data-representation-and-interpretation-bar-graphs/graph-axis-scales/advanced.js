import {
  getRandomBarGraphTheme,
  getRandomNames,
  getRandomPaletteColors,
  getRandomFinancialTheme,
  getRandomEqualizingTheme,
  getRandomTargetShortfallTheme,
  getSingularUnit
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
    const barCount = Math.random() > 0.5 ? 4 : 3;
    const theme = getRandomBarGraphTheme(barCount);
    const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';

    // 4 inquiry sub-varieties: 'addition', 'subtraction', 'combined', 'reverse_working'
    const subTypes = ['addition', 'subtraction', 'combined', 'reverse_working'];
    const subType = subTypes[getRandomInt(0, subTypes.length - 1)];

    if (subType === 'addition') {
      const catIdx = getRandomInt(0, barCount - 1);
      const cat = theme.items[catIdx];

      // Curate pairs with moderate ratios so Graph 1 has 3-6 blocks, and Graph 2 has 2-5 blocks
      const addConfigs = [
        { scale1: 5, scale2: 10, blocksRange: [4, 5, 6], minB1: 3, maxB1: 5 },
        { scale1: 5, scale2: 20, blocksRange: [3, 4], minB1: 3, maxB1: 5 },
        { scale1: 10, scale2: 20, blocksRange: [3, 4, 5], minB1: 3, maxB1: 5 },
        { scale1: 10, scale2: 25, blocksRange: [3, 4], minB1: 3, maxB1: 5 },
        { scale1: 10, scale2: 50, blocksRange: [2, 3], minB1: 3, maxB1: 6 },
        { scale1: 20, scale2: 50, blocksRange: [3, 4], minB1: 3, maxB1: 5 },
        { scale1: 25, scale2: 50, blocksRange: [3, 4], minB1: 3, maxB1: 5 },
        { scale1: 50, scale2: 100, blocksRange: [3, 4], minB1: 3, maxB1: 5 }
      ];
      const cfg = addConfigs[getRandomInt(0, addConfigs.length - 1)];
      const scale1 = cfg.scale1;
      const scale2 = cfg.scale2;

      const blocksNeeded = cfg.blocksRange[getRandomInt(0, cfg.blocksRange.length - 1)];
      const newTotal = blocksNeeded * scale2;

      const maxB1 = Math.min(cfg.maxB1, Math.floor((newTotal - scale1) / scale1));
      const minB1 = Math.min(cfg.minB1, maxB1);
      const b1 = getRandomInt(minB1, maxB1);

      let startVal = b1 * scale1;
      if (scale1 % 2 === 0 && Math.random() > 0.5 && (startVal + scale1 / 2 < newTotal)) {
        startVal += scale1 / 2;
      }
      const delta = newTotal - startVal;

      const addVerbs = ['added', 'donated', 'collected', 'received', 'baked', 'produced', 'packed', 'gathered'];
      const verb = addVerbs[getRandomInt(0, addVerbs.length - 1)];

      const colors = getRandomPaletteColors(barCount);
      const data = theme.items.map((item, idx) => {
        if (idx === catIdx) return { category: item, value: startVal, color: colors[idx] };
        const bOther = getRandomInt(2, Math.min(6, b1 + 1));
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

      // Curate pairs for subtraction: newTotal = blocksNeeded * scale2 < startVal <= 7 * scale1
      const subConfigs = [
        { scale1: 5, scale2: 10, blocksNeeded: 2, minB1: 5, maxB1: 6 },
        { scale1: 10, scale2: 20, blocksNeeded: 2, minB1: 5, maxB1: 6 },
        { scale1: 10, scale2: 25, blocksNeeded: 2, minB1: 6, maxB1: 7 },
        { scale1: 20, scale2: 50, blocksNeeded: 2, minB1: 6, maxB1: 7 },
        { scale1: 25, scale2: 50, blocksNeeded: 2, minB1: 5, maxB1: 6 },
        { scale1: 50, scale2: 100, blocksNeeded: 2, minB1: 5, maxB1: 6 }
      ];
      const cfg = subConfigs[getRandomInt(0, subConfigs.length - 1)];
      const scale1 = cfg.scale1;
      const scale2 = cfg.scale2;

      const blocksNeeded = cfg.blocksNeeded;
      const newTotal = blocksNeeded * scale2;

      const b1 = getRandomInt(cfg.minB1, cfg.maxB1);
      let startVal = b1 * scale1;
      if (scale1 % 2 === 0 && Math.random() > 0.5) {
        startVal += scale1 / 2;
      }
      const delta = startVal - newTotal;

      const removeVerbs = ['sold', 'given away', 'eaten', 'distributed', 'used', 'borrowed'];
      const verb = removeVerbs[getRandomInt(0, removeVerbs.length - 1)];

      const colors = getRandomPaletteColors(barCount);
      const data = theme.items.map((item, idx) => {
        if (idx === catIdx) return { category: item, value: startVal, color: colors[idx] };
        const bOther = getRandomInt(2, Math.min(6, b1));
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

      const combConfigs = [
        { scale1: 5, scale2: 10, pairs: [[3, 3], [4, 4], [3, 5], [4, 6]] },
        { scale1: 5, scale2: 20, pairs: [[3, 5], [4, 4], [5, 7]] },
        { scale1: 10, scale2: 20, pairs: [[2, 4], [3, 3], [3, 5], [4, 4]] },
        { scale1: 10, scale2: 25, pairs: [[4, 6], [5, 5], [3, 7]] },
        { scale1: 20, scale2: 50, pairs: [[2, 3], [4, 6]] },
        { scale1: 25, scale2: 50, pairs: [[2, 4], [3, 3], [4, 4]] },
        { scale1: 50, scale2: 100, pairs: [[2, 4], [3, 3], [4, 4]] }
      ];
      const cfg = combConfigs[getRandomInt(0, combConfigs.length - 1)];
      const scale1 = cfg.scale1;
      const scale2 = cfg.scale2;

      const p = cfg.pairs[getRandomInt(0, cfg.pairs.length - 1)];
      const val1 = p[0] * scale1;
      const val2 = p[1] * scale1;
      const combinedTotal = val1 + val2;
      const blocksNeeded = Math.round(combinedTotal / scale2);

      const colors = getRandomPaletteColors(barCount);
      const data = theme.items.map((item, idx) => {
        if (idx === idx1) return { category: item, value: val1, color: colors[idx] };
        if (idx === idx2) return { category: item, value: val2, color: colors[idx] };
        const bOther = getRandomInt(2, 5);
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

      const revConfigs = [
        { scale1: 5, scale2: 10, blocksRange: [4, 5, 6], minB1: 4, maxB1: 6 },
        { scale1: 5, scale2: 20, blocksRange: [3, 4], minB1: 4, maxB1: 6 },
        { scale1: 10, scale2: 20, blocksRange: [3, 4, 5], minB1: 3, maxB1: 5 },
        { scale1: 10, scale2: 25, blocksRange: [3, 4], minB1: 4, maxB1: 6 },
        { scale1: 10, scale2: 50, blocksRange: [2, 3], minB1: 4, maxB1: 6 },
        { scale1: 20, scale2: 50, blocksRange: [3, 4], minB1: 3, maxB1: 5 },
        { scale1: 25, scale2: 50, blocksRange: [3, 4], minB1: 3, maxB1: 5 },
        { scale1: 50, scale2: 100, blocksRange: [3, 4], minB1: 3, maxB1: 5 }
      ];
      const cfg = revConfigs[getRandomInt(0, revConfigs.length - 1)];
      const scale1 = cfg.scale1;
      const scale2 = cfg.scale2;

      const blocksNew = cfg.blocksRange[getRandomInt(0, cfg.blocksRange.length - 1)];
      const newTotal = blocksNew * scale2;

      const maxB1 = Math.min(cfg.maxB1, Math.floor((newTotal - scale1) / scale1));
      const minB1 = Math.min(cfg.minB1, maxB1);
      const b1 = getRandomInt(minB1, maxB1);

      let startVal = b1 * scale1;
      if (scale1 % 2 === 0 && Math.random() > 0.5 && (startVal + scale1 / 2 < newTotal)) {
        startVal += scale1 / 2;
      }
      const delta = newTotal - startVal;

      const colors = getRandomPaletteColors(barCount);
      const data = theme.items.map((item, idx) => {
        if (idx === catIdx) return { category: item, value: startVal, color: colors[idx] };
        const bOther = getRandomInt(2, Math.min(6, b1 + 1));
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
    const verb = finTheme.verb || 'sold';
    const singularUnit = getSingularUnit(finTheme.unit);

    // 3 or 4 bars
    const barCount = Math.random() > 0.5 ? 4 : 3;
    let blocksPool = barCount === 4
      ? [getRandomInt(2, 4), getRandomInt(5, 7), getRandomInt(3, 5), getRandomInt(4, 6)]
      : [getRandomInt(2, 4), getRandomInt(5, 7), getRandomInt(3, 5)];

    // Ensure variety in heights so differences and sums are distinct
    if (blocksPool[0] === blocksPool[1]) blocksPool[1] += 2;
    if (blocksPool[1] === blocksPool[2]) blocksPool[2] += 1;
    if (barCount === 4 && blocksPool[2] === blocksPool[3]) blocksPool[3] += 1;

    const totalBlocks = blocksPool.reduce((acc, b) => acc + b, 0);
    const scaleOptions = [10, 20, 25, 30, 40, 50];
    const scaleStep = scaleOptions[getRandomInt(0, scaleOptions.length - 1)];
    const grandTotal = totalBlocks * scaleStep;

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

    // 1. Initial Information (Clue)
    // - grand_total: Grand total across all categories
    // - single_bar: Value of 1 specific bar
    // - sum_bars: Sum of 2 bars
    // - diff_bars: Difference between 2 bars
    const clueTypes = ['grand_total', 'single_bar', 'sum_bars', 'diff_bars'];
    const clueType = clueTypes[getRandomInt(0, clueTypes.length - 1)];

    let clueSentence = '';
    let clueStep1Label = '';
    let clueStep1Expected = '';
    let clueStep1Accepted = [];
    let clueStep2Expected = '';
    let clueStep2Accepted = [];

    // Indices for clue if needed
    let clueSingleIdx = -1;
    let cluePair = [];

    if (clueType === 'grand_total') {
      clueSentence = `The grand total of all ${finTheme.unit} ${verb} across all categories is exactly ${grandTotal} ${finTheme.unit}.`;
      clueStep1Label = `Total number of grid blocks across all ${barCount} categories:`;
      clueStep1Expected = String(totalBlocks);
      clueStep1Accepted = [String(totalBlocks)];
      clueStep2Expected = `${grandTotal} / ${totalBlocks} = ${scaleStep}`;
      clueStep2Accepted = getDivisionAcceptedAnswers(grandTotal, totalBlocks, scaleStep);

    } else if (clueType === 'single_bar') {
      clueSingleIdx = getRandomInt(0, barCount - 1);
      const catClue = finTheme.items[clueSingleIdx];
      const bClue = blocksPool[clueSingleIdx];
      const clueVal = bClue * scaleStep;
      clueSentence = `There were exactly ${clueVal} ${finTheme.unit} ${verb} for ${catClue}.`;
      clueStep1Label = `Number of grid blocks for ${catClue}:`;
      clueStep1Expected = String(bClue);
      clueStep1Accepted = [String(bClue)];
      clueStep2Expected = `${clueVal} / ${bClue} = ${scaleStep}`;
      clueStep2Accepted = getDivisionAcceptedAnswers(clueVal, bClue, scaleStep);

    } else if (clueType === 'sum_bars') {
      const idx1 = 0;
      const idx2 = 1;
      cluePair = [idx1, idx2];
      const cat1 = finTheme.items[idx1];
      const cat2 = finTheme.items[idx2];
      const bSum = blocksPool[idx1] + blocksPool[idx2];
      const clueVal = bSum * scaleStep;
      clueSentence = `A total of ${clueVal} ${finTheme.unit} were ${verb} for ${cat1} and ${cat2} combined.`;
      clueStep1Label = `Total number of grid blocks for ${cat1} and ${cat2} combined:`;
      clueStep1Expected = String(bSum);
      clueStep1Accepted = [String(bSum)];
      clueStep2Expected = `${clueVal} / ${bSum} = ${scaleStep}`;
      clueStep2Accepted = getDivisionAcceptedAnswers(clueVal, bSum, scaleStep);

    } else { // diff_bars
      // Find two bars where bA > bB
      let diffPairs = [];
      for (let i = 0; i < barCount; i++) {
        for (let j = 0; j < barCount; j++) {
          if (blocksPool[i] > blocksPool[j]) diffPairs.push([i, j]);
        }
      }
      const [idxA, idxB] = diffPairs[getRandomInt(0, diffPairs.length - 1)] || [1, 0];
      cluePair = [idxA, idxB];
      const catA = finTheme.items[idxA];
      const catB = finTheme.items[idxB];
      const bDiff = blocksPool[idxA] - blocksPool[idxB];
      const clueVal = bDiff * scaleStep;
      clueSentence = `There were ${clueVal} more ${finTheme.unit} ${verb} for ${catA} than ${catB}.`;
      clueStep1Label = `Difference in grid blocks between ${catA} and ${catB}:`;
      clueStep1Expected = String(bDiff);
      clueStep1Accepted = [String(bDiff)];
      clueStep2Expected = `${clueVal} / ${bDiff} = ${scaleStep}`;
      clueStep2Accepted = getDivisionAcceptedAnswers(clueVal, bDiff, scaleStep);
    }

    // 2. Workout Target
    // - single_bar: Money collected from 1 category
    // - grand_total: Money collected from all categories (at uniform price)
    // - sum_bars: Money collected from 2 categories combined
    // - diff_bars: Difference in money collected between 2 categories
    let possibleTargets = ['single_bar', 'sum_bars', 'diff_bars'];
    if (clueType !== 'grand_total') {
      possibleTargets.push('grand_total');
    }
    const targetType = possibleTargets[getRandomInt(0, possibleTargets.length - 1)];

    let targetSentence = '';
    let targetStep3Label = '';
    let targetStep3Expected = '';
    let targetStep3Accepted = [];
    let targetStep4Label = '';
    let targetStep4Expected = '';
    let targetStep4Accepted = [];
    let totalCost = 0;
    let candidateDistractors = [];

    const priceVerb = verb === 'rented out' ? 'rented out' : 'sold';

    if (targetType === 'single_bar') {
      // Pick a target index (different from clue if clue was single_bar)
      let tIdx = getRandomInt(0, barCount - 1);
      if (clueType === 'single_bar' && tIdx === clueSingleIdx) {
        tIdx = (clueSingleIdx + 1) % barCount;
      }
      const catTarget = finTheme.items[tIdx];
      const bTarget = blocksPool[tIdx];
      const qty = bTarget * scaleStep;
      const price = finTheme.prices[tIdx] || getRandomInt(2, 5);
      totalCost = qty * price;

      targetSentence = `If each ${singularUnit} of ${catTarget} is ${priceVerb} for $${price}, find the total money collected from ${catTarget}.`;
      targetStep3Label = `Write the working equation to find the exact number of ${catTarget} ${verb}:`;
      targetStep3Expected = `${bTarget} x ${scaleStep} = ${qty}`;
      targetStep3Accepted = getMultiplicationAcceptedAnswers(bTarget, scaleStep, qty);

      targetStep4Label = `Write the working equation to find the total money collected from ${catTarget}:`;
      targetStep4Expected = `${qty} x ${price} = ${totalCost}`;
      targetStep4Accepted = getMultiplicationAcceptedAnswers(qty, price, totalCost);

      candidateDistractors = [
        `$${qty}`,
        `$${totalBlocks * price}`,
        `$${totalCost + scaleStep * price}`,
        `$${Math.max(1, totalCost - scaleStep * price)}`
      ];

    } else if (targetType === 'grand_total') {
      const price = finTheme.prices[0] || getRandomInt(2, 5);
      const totalQty = grandTotal;
      totalCost = totalQty * price;

      targetSentence = `If every ${singularUnit} across all categories is ${priceVerb} for $${price}, find the total money collected from all ${finTheme.unit} ${verb}.`;
      targetStep3Label = `Write the working equation to find the total number of ${finTheme.unit} ${verb} across all categories:`;
      targetStep3Expected = `${totalBlocks} x ${scaleStep} = ${totalQty}`;
      targetStep3Accepted = getMultiplicationAcceptedAnswers(totalBlocks, scaleStep, totalQty);

      targetStep4Label = `Write the working equation to find the total money collected across all categories:`;
      targetStep4Expected = `${totalQty} x ${price} = ${totalCost}`;
      targetStep4Accepted = getMultiplicationAcceptedAnswers(totalQty, price, totalCost);

      candidateDistractors = [
        `$${totalQty}`,
        `$${totalCost + scaleStep * price}`,
        `$${Math.max(1, totalCost - scaleStep * price)}`,
        `$${totalBlocks * scaleStep}`
      ];

    } else if (targetType === 'sum_bars') {
      let sumPairs = [];
      for (let i = 0; i < barCount; i++) {
        for (let j = i + 1; j < barCount; j++) {
          if (!(cluePair.length === 2 && ((cluePair[0] === i && cluePair[1] === j) || (cluePair[0] === j && cluePair[1] === i)))) {
            sumPairs.push([i, j]);
          }
        }
      }
      if (sumPairs.length === 0) sumPairs = [[0, barCount - 1]];
      const [tIdx1, tIdx2] = sumPairs[getRandomInt(0, sumPairs.length - 1)];

      const cat1 = finTheme.items[tIdx1];
      const cat2 = finTheme.items[tIdx2];
      const bSum = blocksPool[tIdx1] + blocksPool[tIdx2];
      const qtySum = bSum * scaleStep;
      const price = finTheme.prices[tIdx1] || getRandomInt(2, 5);
      totalCost = qtySum * price;

      targetSentence = `If each ${singularUnit} of ${cat1} and ${cat2} is ${priceVerb} for $${price}, find the total money collected from these two categories combined.`;
      targetStep3Label = `Write the working equation to find the total number of ${finTheme.unit} ${verb} for ${cat1} and ${cat2} combined:`;
      targetStep3Expected = `${bSum} x ${scaleStep} = ${qtySum}`;
      targetStep3Accepted = [
        ...getMultiplicationAcceptedAnswers(bSum, scaleStep, qtySum),
        ...getAdditionAcceptedAnswers(blocksPool[tIdx1] * scaleStep, blocksPool[tIdx2] * scaleStep, qtySum)
      ];

      targetStep4Label = `Write the working equation to find the total money collected from ${cat1} and ${cat2} combined:`;
      targetStep4Expected = `${qtySum} x ${price} = ${totalCost}`;
      targetStep4Accepted = [
        ...getMultiplicationAcceptedAnswers(qtySum, price, totalCost),
        ...getAdditionAcceptedAnswers(blocksPool[tIdx1] * scaleStep * price, blocksPool[tIdx2] * scaleStep * price, totalCost)
      ];

      candidateDistractors = [
        `$${qtySum}`,
        `$${totalCost + scaleStep * price}`,
        `$${Math.max(1, totalCost - scaleStep * price)}`,
        `$${blocksPool[tIdx1] * scaleStep * price}`
      ];

    } else { // diff_bars
      let diffPairs = [];
      for (let i = 0; i < barCount; i++) {
        for (let j = 0; j < barCount; j++) {
          if (blocksPool[i] > blocksPool[j]) {
            if (!(cluePair.length === 2 && cluePair[0] === i && cluePair[1] === j)) {
              diffPairs.push([i, j]);
            }
          }
        }
      }
      if (diffPairs.length === 0) {
        for (let i = 0; i < barCount; i++) {
          for (let j = 0; j < barCount; j++) {
            if (blocksPool[i] > blocksPool[j]) diffPairs.push([i, j]);
          }
        }
      }
      const [tIdxA, tIdxB] = diffPairs[getRandomInt(0, diffPairs.length - 1)] || [1, 0];
      const catA = finTheme.items[tIdxA];
      const catB = finTheme.items[tIdxB];
      const bDiff = blocksPool[tIdxA] - blocksPool[tIdxB];
      const qtyDiff = bDiff * scaleStep;
      const price = finTheme.prices[tIdxA] || getRandomInt(2, 5);
      totalCost = qtyDiff * price;

      targetSentence = `If each ${singularUnit} is ${priceVerb} for $${price}, how much more money was collected from ${catA} than ${catB}?`;
      targetStep3Label = `Write the working equation to find how many more ${finTheme.unit} were ${verb} for ${catA} than ${catB}:`;
      targetStep3Expected = `${bDiff} x ${scaleStep} = ${qtyDiff}`;
      targetStep3Accepted = [
        ...getMultiplicationAcceptedAnswers(bDiff, scaleStep, qtyDiff),
        ...getSubtractionAcceptedAnswers(blocksPool[tIdxA] * scaleStep, blocksPool[tIdxB] * scaleStep, qtyDiff)
      ];

      targetStep4Label = `Write the working equation to find how much more money was collected from ${catA} than ${catB}:`;
      targetStep4Expected = `${qtyDiff} x ${price} = ${totalCost}`;
      targetStep4Accepted = [
        ...getMultiplicationAcceptedAnswers(qtyDiff, price, totalCost),
        ...getSubtractionAcceptedAnswers(blocksPool[tIdxA] * scaleStep * price, blocksPool[tIdxB] * scaleStep * price, totalCost)
      ];

      candidateDistractors = [
        `$${qtyDiff}`,
        `$${totalCost + scaleStep * price}`,
        `$${Math.max(1, totalCost - scaleStep * price)}`,
        `$${blocksPool[tIdxA] * scaleStep * price}`
      ];
    }

    if (isStructure) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph tracks the number of ${finTheme.unit} ${verb}, but the axis numbers on the graph are missing. ${clueSentence} ${targetSentence} Show your working and the final answer."`;
      const stepsArr = [
        {
          label: clueStep1Label,
          expectedAnswer: clueStep1Expected,
          acceptedAnswers: clueStep1Accepted
        },
        {
          label: `Write the working equation to find the value of 1 grid block:`,
          expectedAnswer: clueStep2Expected,
          acceptedAnswers: clueStep2Accepted
        },
        {
          label: targetStep3Label,
          expectedAnswer: targetStep3Expected,
          acceptedAnswers: targetStep3Accepted
        },
        {
          label: targetStep4Label,
          expectedAnswer: targetStep4Expected,
          acceptedAnswers: targetStep4Accepted
        }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      finalAnswer = String(totalCost);
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph tracks the number of ${finTheme.unit} ${verb}, but the axis numbers on the graph are missing. ${clueSentence} ${targetSentence}"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
      finalAnswer = `$${totalCost}`;
      const opts = getFourOptions(finalAnswer, candidateDistractors);
      mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph tracks the number of ${finTheme.unit} ${verb}, but the axis numbers on the graph are missing. ${clueSentence} ${targetSentence}"`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      finalAnswer = String(totalCost);
    }

  // --------------------------------------------------------------------------
  // Variant 14: Equalizing Transfer & Multiple Transfer (Grid Block Shift)
  // --------------------------------------------------------------------------
  } else if (canonicalVariant === 'advanced_equalizing_transfer_grid_block_shift') {
    const scaleOptions = [5, 10, 20, 25, 50];
    const scaleStep = scaleOptions[getRandomInt(0, scaleOptions.length - 1)];
    const eqTheme = getRandomEqualizingTheme(3);
    const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';
    const containersPlural = eqTheme.containersPlural || 'groups';

    // 2 or 3 bars on the graph
    const barCount = Math.random() > 0.5 ? 3 : 2;
    const catA = eqTheme.items[0];
    const catB = eqTheme.items[1];
    const catC = barCount === 3 ? eqTheme.items[2] : null;

    // Pick Relationship Type:
    // 1. 'equal': both containers have the exact same number
    // 2. 'twice_recipient': catB has 2 times as many as catA
    // 3. 'three_times_recipient': catB has 3 times as many as catA
    // 4. 'twice_donor': catA still has 2 times as many as catB
    // 5. 'three_times_donor': catA still has 3 times as many as catB
    const relationshipTypes = [
      'equal',
      'twice_recipient',
      'three_times_recipient',
      'twice_donor',
      'three_times_donor'
    ];
    const relationship = relationshipTypes[getRandomInt(0, relationshipTypes.length - 1)];

    let bA, bB, blocksMoved, itemsMoved, relPhrase;
    let finalBlocksA, finalBlocksB;
    let stepsArr = [];

    if (relationship === 'equal') {
      relPhrase = `both ${containersPlural} have the exact same number of ${eqTheme.unit}`;
      blocksMoved = getRandomInt(1, 3); // 1, 2, 3 blocks moved
      const diffBlocks = blocksMoved * 2; // 2, 4, 6
      bB = getRandomInt(2, 5);
      bA = bB + diffBlocks;
      finalBlocksA = bA - blocksMoved;
      finalBlocksB = bB + blocksMoved;
      itemsMoved = blocksMoved * scaleStep;

      const valA = bA * scaleStep;
      const valB = bB * scaleStep;
      const valDiff = valA - valB;

      stepsArr = [
        {
          label: `Write the working equation to find the difference in ${eqTheme.unit} between ${catA} and ${catB}:`,
          expectedAnswer: `${valA} - ${valB} = ${valDiff}`,
          acceptedAnswers: getSubtractionAcceptedAnswers(valA, valB, valDiff)
        },
        {
          label: `Write the working equation to find how many ${eqTheme.unit} must be moved:`,
          expectedAnswer: `${valDiff} / 2 = ${itemsMoved}`,
          acceptedAnswers: getDivisionAcceptedAnswers(valDiff, 2, itemsMoved)
        },
        {
          label: `Write the working equation to find how many grid blocks shorter ${catA}'s bar will become:`,
          expectedAnswer: `${itemsMoved} / ${scaleStep} = ${blocksMoved}`,
          acceptedAnswers: [
            ...getDivisionAcceptedAnswers(itemsMoved, scaleStep, blocksMoved),
            String(blocksMoved)
          ]
        }
      ];

    } else if (relationship === 'twice_recipient') {
      relPhrase = `${catB} has 2 times as many ${eqTheme.unit} as ${catA}`;
      finalBlocksA = getRandomInt(2, 4);
      finalBlocksB = finalBlocksA * 2;
      const totalBlocks = finalBlocksA + finalBlocksB; // 3 * finalBlocksA
      blocksMoved = getRandomInt(1, 2);
      bA = finalBlocksA + blocksMoved;
      bB = finalBlocksB - blocksMoved;
      if (bB < 1) {
        bB = 1;
        bA = totalBlocks - bB;
        blocksMoved = bA - finalBlocksA;
      }
      itemsMoved = blocksMoved * scaleStep;

      const valA = bA * scaleStep;
      const valB = bB * scaleStep;
      const totalVal = valA + valB;
      const oneUnitVal = totalVal / 3;

      stepsArr = [
        {
          label: `Write the working equation to find the total number of ${eqTheme.unit} in both ${containersPlural}:`,
          expectedAnswer: `${valA} + ${valB} = ${totalVal}`,
          acceptedAnswers: getAdditionAcceptedAnswers(valA, valB, totalVal)
        },
        {
          label: `Write the working equation to find the number of ${eqTheme.unit} in 1 unit (${catA}'s final amount):`,
          expectedAnswer: `${totalVal} / 3 = ${oneUnitVal}`,
          acceptedAnswers: getDivisionAcceptedAnswers(totalVal, 3, oneUnitVal)
        },
        {
          label: `Write the working equation to find how many ${eqTheme.unit} were moved from ${catA} to ${catB}:`,
          expectedAnswer: `${valA} - ${oneUnitVal} = ${itemsMoved}`,
          acceptedAnswers: [
            ...getSubtractionAcceptedAnswers(valA, oneUnitVal, itemsMoved),
            ...getSubtractionAcceptedAnswers(finalBlocksB * scaleStep, valB, itemsMoved)
          ]
        },
        {
          label: `Write the working equation to find how many grid blocks shorter ${catA}'s bar will become:`,
          expectedAnswer: `${itemsMoved} / ${scaleStep} = ${blocksMoved}`,
          acceptedAnswers: [
            ...getDivisionAcceptedAnswers(itemsMoved, scaleStep, blocksMoved),
            String(blocksMoved)
          ]
        }
      ];

    } else if (relationship === 'three_times_recipient') {
      relPhrase = `${catB} has 3 times as many ${eqTheme.unit} as ${catA}`;
      finalBlocksA = getRandomInt(1, 3);
      finalBlocksB = finalBlocksA * 3;
      const totalBlocks = finalBlocksA + finalBlocksB; // 4 * finalBlocksA
      blocksMoved = getRandomInt(1, 2);
      bA = finalBlocksA + blocksMoved;
      bB = finalBlocksB - blocksMoved;
      if (bB < 1) {
        bB = 1;
        bA = totalBlocks - bB;
        blocksMoved = bA - finalBlocksA;
      }
      itemsMoved = blocksMoved * scaleStep;

      const valA = bA * scaleStep;
      const valB = bB * scaleStep;
      const totalVal = valA + valB;
      const oneUnitVal = totalVal / 4;

      stepsArr = [
        {
          label: `Write the working equation to find the total number of ${eqTheme.unit} in both ${containersPlural}:`,
          expectedAnswer: `${valA} + ${valB} = ${totalVal}`,
          acceptedAnswers: getAdditionAcceptedAnswers(valA, valB, totalVal)
        },
        {
          label: `Write the working equation to find the number of ${eqTheme.unit} in 1 unit (${catA}'s final amount):`,
          expectedAnswer: `${totalVal} / 4 = ${oneUnitVal}`,
          acceptedAnswers: getDivisionAcceptedAnswers(totalVal, 4, oneUnitVal)
        },
        {
          label: `Write the working equation to find how many ${eqTheme.unit} were moved from ${catA} to ${catB}:`,
          expectedAnswer: `${valA} - ${oneUnitVal} = ${itemsMoved}`,
          acceptedAnswers: [
            ...getSubtractionAcceptedAnswers(valA, oneUnitVal, itemsMoved),
            ...getSubtractionAcceptedAnswers(finalBlocksB * scaleStep, valB, itemsMoved)
          ]
        },
        {
          label: `Write the working equation to find how many grid blocks shorter ${catA}'s bar will become:`,
          expectedAnswer: `${itemsMoved} / ${scaleStep} = ${blocksMoved}`,
          acceptedAnswers: [
            ...getDivisionAcceptedAnswers(itemsMoved, scaleStep, blocksMoved),
            String(blocksMoved)
          ]
        }
      ];

    } else if (relationship === 'twice_donor') {
      relPhrase = `${catA} still has 2 times as many ${eqTheme.unit} as ${catB}`;
      finalBlocksB = getRandomInt(2, 4);
      finalBlocksA = finalBlocksB * 2;
      const totalBlocks = finalBlocksA + finalBlocksB;
      blocksMoved = getRandomInt(1, Math.max(1, finalBlocksB - 1));
      bB = finalBlocksB - blocksMoved;
      bA = finalBlocksA + blocksMoved;
      itemsMoved = blocksMoved * scaleStep;

      const valA = bA * scaleStep;
      const valB = bB * scaleStep;
      const totalVal = valA + valB;
      const oneUnitVal = totalVal / 3; // final B

      stepsArr = [
        {
          label: `Write the working equation to find the total number of ${eqTheme.unit} in both ${containersPlural}:`,
          expectedAnswer: `${valA} + ${valB} = ${totalVal}`,
          acceptedAnswers: getAdditionAcceptedAnswers(valA, valB, totalVal)
        },
        {
          label: `Write the working equation to find the number of ${eqTheme.unit} in 1 unit (${catB}'s final amount):`,
          expectedAnswer: `${totalVal} / 3 = ${oneUnitVal}`,
          acceptedAnswers: getDivisionAcceptedAnswers(totalVal, 3, oneUnitVal)
        },
        {
          label: `Write the working equation to find how many ${eqTheme.unit} were moved from ${catA} to ${catB}:`,
          expectedAnswer: `${oneUnitVal} - ${valB} = ${itemsMoved}`,
          acceptedAnswers: [
            ...getSubtractionAcceptedAnswers(oneUnitVal, valB, itemsMoved),
            ...getSubtractionAcceptedAnswers(valA, finalBlocksA * scaleStep, itemsMoved)
          ]
        },
        {
          label: `Write the working equation to find how many grid blocks shorter ${catA}'s bar will become:`,
          expectedAnswer: `${itemsMoved} / ${scaleStep} = ${blocksMoved}`,
          acceptedAnswers: [
            ...getDivisionAcceptedAnswers(itemsMoved, scaleStep, blocksMoved),
            String(blocksMoved)
          ]
        }
      ];

    } else { // 'three_times_donor'
      relPhrase = `${catA} still has 3 times as many ${eqTheme.unit} as ${catB}`;
      finalBlocksB = getRandomInt(2, 3);
      finalBlocksA = finalBlocksB * 3;
      const totalBlocks = finalBlocksA + finalBlocksB;
      blocksMoved = getRandomInt(1, Math.max(1, finalBlocksB - 1));
      bB = finalBlocksB - blocksMoved;
      bA = finalBlocksA + blocksMoved;
      itemsMoved = blocksMoved * scaleStep;

      const valA = bA * scaleStep;
      const valB = bB * scaleStep;
      const totalVal = valA + valB;
      const oneUnitVal = totalVal / 4; // final B

      stepsArr = [
        {
          label: `Write the working equation to find the total number of ${eqTheme.unit} in both ${containersPlural}:`,
          expectedAnswer: `${valA} + ${valB} = ${totalVal}`,
          acceptedAnswers: getAdditionAcceptedAnswers(valA, valB, totalVal)
        },
        {
          label: `Write the working equation to find the number of ${eqTheme.unit} in 1 unit (${catB}'s final amount):`,
          expectedAnswer: `${totalVal} / 4 = ${oneUnitVal}`,
          acceptedAnswers: getDivisionAcceptedAnswers(totalVal, 4, oneUnitVal)
        },
        {
          label: `Write the working equation to find how many ${eqTheme.unit} were moved from ${catA} to ${catB}:`,
          expectedAnswer: `${oneUnitVal} - ${valB} = ${itemsMoved}`,
          acceptedAnswers: [
            ...getSubtractionAcceptedAnswers(oneUnitVal, valB, itemsMoved),
            ...getSubtractionAcceptedAnswers(valA, finalBlocksA * scaleStep, itemsMoved)
          ]
        },
        {
          label: `Write the working equation to find how many grid blocks shorter ${catA}'s bar will become:`,
          expectedAnswer: `${itemsMoved} / ${scaleStep} = ${blocksMoved}`,
          acceptedAnswers: [
            ...getDivisionAcceptedAnswers(itemsMoved, scaleStep, blocksMoved),
            String(blocksMoved)
          ]
        }
      ];
    }

    const colors = getRandomPaletteColors(barCount);
    const data = [
      { category: catA, value: bA * scaleStep, color: colors[0] },
      { category: catB, value: bB * scaleStep, color: colors[1] }
    ];
    if (barCount === 3 && catC) {
      const bC = getRandomInt(2, 6);
      data.push({ category: catC, value: bC * scaleStep, color: colors[2] });
    }

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

    const categoriesListStr = barCount === 3 ? `${catA}, ${catB}, and ${catC}` : `${catA} and ${catB}`;

    if (isStructure) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the number of ${eqTheme.unit} in ${categoriesListStr}. Some ${eqTheme.unit} are moved from ${catA} to ${catB} so that ${relPhrase}. How many grid blocks shorter will the bar for ${catA} become?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      finalAnswer = String(blocksMoved);
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the number of ${eqTheme.unit} in ${categoriesListStr}. Some ${eqTheme.unit} are moved from ${catA} to ${catB} so that ${relPhrase}. How many grid blocks shorter will the bar for ${catA} become?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
      finalAnswer = String(blocksMoved);
      const opts = getFourOptions(finalAnswer, [
        String(blocksMoved + 1),
        String(Math.max(1, blocksMoved - 1) === blocksMoved ? blocksMoved + 2 : Math.max(1, blocksMoved - 1)),
        String(blocksMoved + 3),
        String(bA - bB > 0 ? bA - bB : blocksMoved + 4)
      ]);
      mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the number of ${eqTheme.unit} in ${categoriesListStr}. Some ${eqTheme.unit} are moved from ${catA} to ${catB} so that ${relPhrase}. How many grid blocks shorter will the bar for ${catA} become?"`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      finalAnswer = String(blocksMoved);
    }

  // --------------------------------------------------------------------------
  // Variant 15: Target Shortfall & Bar Height Prediction
  // --------------------------------------------------------------------------
  } else {
    const scaleOptions = [10, 20, 25, 50, 100];
    const scaleStep = scaleOptions[getRandomInt(0, scaleOptions.length - 1)];

    const sfTheme = getRandomTargetShortfallTheme(4);
    const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';
    const verb = sfTheme.verb || 'collect';
    const pastVerb = sfTheme.pastVerb || 'collected';
    const prep = sfTheme.prep || 'in';
    const categoriesPlural = sfTheme.categoriesPlural || 'categories';
    const categorySingular = sfTheme.categorySingular || 'category';

    // 3 or 4 bars
    const barCount = Math.random() > 0.4 ? 4 : 3;
    const allCats = sfTheme.items && sfTheme.items.length >= barCount
      ? sfTheme.items.slice(0, barCount)
      : (barCount === 4 ? ["Week 1", "Week 2", "Week 3", "Week 4"] : ["Week 1", "Week 2", "Week 3"]);

    // Missing bar can be ANY position (not just the last one!)
    const missingIdx = getRandomInt(0, barCount - 1);
    const missingCat = allCats[missingIdx];
    const knownIndices = [];
    for (let i = 0; i < barCount; i++) {
      if (i !== missingIdx) knownIndices.push(i);
    }

    // Generate known bar heights (blocks)
    const possibleBlocks = [2, 2.5, 3, 3.5, 4, 5];
    const blocksArr = [];
    for (let i = 0; i < barCount; i++) {
      if (i === missingIdx) {
        blocksArr.push(0);
      } else {
        blocksArr.push(possibleBlocks[getRandomInt(0, possibleBlocks.length - 1)]);
      }
    }

    // Values of known bars
    const knownValues = knownIndices.map(idx => blocksArr[idx] * scaleStep);
    const knownSum = knownValues.reduce((acc, v) => acc + v, 0);
    const knownCats = knownIndices.map(idx => allCats[idx]);
    const knownCatsStr = knownCats.length === 2
      ? `${knownCats[0]} and ${knownCats[1]}`
      : `${knownCats[0]}, ${knownCats[1]}, and ${knownCats[2]}`;

    // Helper for addition equation across known bars
    const getKnownSumAdditionAccepted = () => {
      if (knownValues.length === 2) {
        return getAdditionAcceptedAnswers(knownValues[0], knownValues[1], knownSum);
      }
      return getThreeAdditionAcceptedAnswers(knownValues[0], knownValues[1], knownValues[2], knownSum);
    };

    // Archetypes:
    // 1. 'overall_target': Grand goal across all categories
    // 2. 'comparative_multiple': Target is k times another known bar (k = 2 or 3)
    // 3. 'comparative_sum': Target equals the sum of two known bars
    // 4. 'comparative_excess': Target exceeds a known bar by a stated difference
    // 5. 'average_target': Target average per category
    const archetypes = [
      'overall_target',
      'overall_target',
      'comparative_multiple',
      'comparative_sum',
      'comparative_excess',
      'average_target'
    ];
    const archetype = archetypes[getRandomInt(0, archetypes.length - 1)];

    let blocksNeeded = 0;
    let shortage = 0;
    let goal = 0;
    let stepsArr = [];
    let candidateDistractors = [];

    if (archetype === 'overall_target') {
      const possibleTargetBlocks = [2, 3, 4, 5];
      blocksNeeded = possibleTargetBlocks[getRandomInt(0, possibleTargetBlocks.length - 1)];
      shortage = blocksNeeded * scaleStep;
      goal = knownSum + shortage;

      const askItems = Math.random() < 0.25;

      if (!askItems) {
        finalAnswer = String(blocksNeeded);
        askText = isStructure
          ? `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A goal was set to ${verb} exactly ${goal} ${sfTheme.unit} across all ${barCount} ${categoriesPlural}. The bar graph shows the amounts ${pastVerb} for ${knownCatsStr}. To reach the goal, how many grid blocks tall must the bar for ${missingCat} be drawn? Show your working and the final answer."`
          : `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A goal was set to ${verb} exactly ${goal} ${sfTheme.unit} across all ${barCount} ${categoriesPlural}. The bar graph shows the amounts ${pastVerb} for ${knownCatsStr}. Based on the bar graph, how many grid blocks tall must the bar for ${missingCat} be drawn to reach the goal?"`;

        stepsArr = [
          {
            label: `Write the working equation to find the total ${sfTheme.unit} ${pastVerb} in ${knownCatsStr}:`,
            expectedAnswer: knownValues.length === 2
              ? `${knownValues[0]} + ${knownValues[1]} = ${knownSum}`
              : `${knownValues[0]} + ${knownValues[1]} + ${knownValues[2]} = ${knownSum}`,
            acceptedAnswers: getKnownSumAdditionAccepted()
          },
          {
            label: `Write the working equation to find the shortage needed for ${missingCat}:`,
            expectedAnswer: `${goal} - ${knownSum} = ${shortage}`,
            acceptedAnswers: getSubtractionAcceptedAnswers(goal, knownSum, shortage)
          },
          {
            label: `Write the working equation to find how many grid blocks tall the bar for ${missingCat} must be:`,
            expectedAnswer: `${shortage} / ${scaleStep} = ${blocksNeeded}`,
            acceptedAnswers: [
              ...getDivisionAcceptedAnswers(shortage, scaleStep, blocksNeeded),
              String(blocksNeeded)
            ]
          }
        ];

        candidateDistractors = [
          String(blocksNeeded + 1),
          String(Math.max(1, blocksNeeded - 1)),
          String(blocksNeeded + 2),
          String(blocksNeeded + 0.5)
        ];

      } else {
        finalAnswer = String(shortage);
        askText = isStructure
          ? `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A goal was set to ${verb} exactly ${goal} ${sfTheme.unit} across all ${barCount} ${categoriesPlural}. The bar graph shows the amounts ${pastVerb} for ${knownCatsStr}. How many more ${sfTheme.unit} must be ${pastVerb} ${prep} ${missingCat} to reach the goal? Show your working and the final answer."`
          : `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A goal was set to ${verb} exactly ${goal} ${sfTheme.unit} across all ${barCount} ${categoriesPlural}. The bar graph shows the amounts ${pastVerb} for ${knownCatsStr}. How many more ${sfTheme.unit} must be ${pastVerb} ${prep} ${missingCat} to reach the goal?"`;

        stepsArr = [
          {
            label: `Write the working equation to find the total ${sfTheme.unit} ${pastVerb} in ${knownCatsStr}:`,
            expectedAnswer: knownValues.length === 2
              ? `${knownValues[0]} + ${knownValues[1]} = ${knownSum}`
              : `${knownValues[0]} + ${knownValues[1]} + ${knownValues[2]} = ${knownSum}`,
            acceptedAnswers: getKnownSumAdditionAccepted()
          },
          {
            label: `Write the working equation to find how many more ${sfTheme.unit} are needed for ${missingCat}:`,
            expectedAnswer: `${goal} - ${knownSum} = ${shortage}`,
            acceptedAnswers: [
              ...getSubtractionAcceptedAnswers(goal, knownSum, shortage),
              String(shortage)
            ]
          }
        ];

        candidateDistractors = [
          String(shortage + scaleStep),
          String(Math.max(scaleStep, shortage - scaleStep)),
          String(shortage + scaleStep * 2),
          String(blocksNeeded)
        ];
      }

    } else if (archetype === 'comparative_multiple') {
      const compIdx = knownIndices[getRandomInt(0, knownIndices.length - 1)];
      const compCat = allCats[compIdx];
      const compVal = blocksArr[compIdx] * scaleStep;
      const compBlocks = blocksArr[compIdx];

      const multiplier = Math.random() > 0.5 ? 2 : 3;
      blocksNeeded = compBlocks * multiplier;
      shortage = blocksNeeded * scaleStep;

      finalAnswer = String(blocksNeeded);

      askText = isStructure
        ? `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the amounts ${pastVerb} ${sfTheme.activity}. The target for ${missingCat} is to have exactly ${multiplier} times the amount ${prep} ${compCat}. Based on the scale of the bar graph, how many grid blocks tall must the bar for ${missingCat} be drawn? Show your working and the final answer."`
        : `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the amounts ${pastVerb} ${sfTheme.activity}. The target for ${missingCat} is to have exactly ${multiplier} times the amount ${prep} ${compCat}. Based on the scale of the bar graph, how many grid blocks tall must the bar for ${missingCat} be drawn?"`;

      stepsArr = [
        {
          label: `Write the working equation to find the target amount for ${missingCat}:`,
          expectedAnswer: `${compVal} x ${multiplier} = ${shortage}`,
          acceptedAnswers: getMultiplicationAcceptedAnswers(compVal, multiplier, shortage)
        },
        {
          label: `Write the working equation to find how many grid blocks tall the bar for ${missingCat} must be:`,
          expectedAnswer: `${shortage} / ${scaleStep} = ${blocksNeeded}`,
          acceptedAnswers: [
            ...getDivisionAcceptedAnswers(shortage, scaleStep, blocksNeeded),
            ...getMultiplicationAcceptedAnswers(compBlocks, multiplier, blocksNeeded),
            String(blocksNeeded)
          ]
        }
      ];

      candidateDistractors = [
        String(blocksNeeded + 1),
        String(Math.max(1, blocksNeeded - 1)),
        String(compBlocks),
        String(blocksNeeded + 2)
      ];

    } else if (archetype === 'comparative_sum') {
      const c1 = knownIndices[0];
      const c2 = knownIndices[1];
      const cat1Name = allCats[c1];
      const cat2Name = allCats[c2];
      const val1 = blocksArr[c1] * scaleStep;
      const val2 = blocksArr[c2] * scaleStep;
      const sumTwo = val1 + val2;
      blocksNeeded = blocksArr[c1] + blocksArr[c2];
      shortage = sumTwo;

      finalAnswer = String(blocksNeeded);

      askText = isStructure
        ? `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the amounts ${pastVerb} ${sfTheme.activity}. The goal for ${missingCat} is to have the same amount as ${cat1Name} and ${cat2Name} combined. Based on the bar graph, how many grid blocks tall must the bar for ${missingCat} be drawn? Show your working and the final answer."`
        : `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the amounts ${pastVerb} ${sfTheme.activity}. The goal for ${missingCat} is to have the same amount as ${cat1Name} and ${cat2Name} combined. Based on the bar graph, how many grid blocks tall must the bar for ${missingCat} be drawn?"`;

      stepsArr = [
        {
          label: `Write the working equation to find the combined total of ${cat1Name} and ${cat2Name}:`,
          expectedAnswer: `${val1} + ${val2} = ${sumTwo}`,
          acceptedAnswers: getAdditionAcceptedAnswers(val1, val2, sumTwo)
        },
        {
          label: `Write the working equation to find how many grid blocks tall the bar for ${missingCat} must be:`,
          expectedAnswer: `${sumTwo} / ${scaleStep} = ${blocksNeeded}`,
          acceptedAnswers: [
            ...getDivisionAcceptedAnswers(sumTwo, scaleStep, blocksNeeded),
            ...getAdditionAcceptedAnswers(blocksArr[c1], blocksArr[c2], blocksNeeded),
            String(blocksNeeded)
          ]
        }
      ];

      candidateDistractors = [
        String(blocksNeeded + 1),
        String(Math.max(1, blocksNeeded - 1)),
        String(blocksArr[c1]),
        String(blocksNeeded + 2)
      ];

    } else if (archetype === 'comparative_excess') {
      const compIdx = knownIndices[0];
      const compCat = allCats[compIdx];
      const compVal = blocksArr[compIdx] * scaleStep;
      const extraBlocks = getRandomInt(1, 3);
      const diffVal = extraBlocks * scaleStep;

      blocksNeeded = blocksArr[compIdx] + extraBlocks;
      shortage = compVal + diffVal;

      finalAnswer = String(blocksNeeded);

      askText = isStructure
        ? `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the amounts ${pastVerb} ${sfTheme.activity}. The target for ${missingCat} is to ${verb} exactly ${diffVal} more ${sfTheme.unit} than ${compCat}. Based on the bar graph, how many grid blocks tall must the bar for ${missingCat} be drawn? Show your working and the final answer."`
        : `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the amounts ${pastVerb} ${sfTheme.activity}. The target for ${missingCat} is to ${verb} exactly ${diffVal} more ${sfTheme.unit} than ${compCat}. Based on the bar graph, how many grid blocks tall must the bar for ${missingCat} be drawn?"`;

      stepsArr = [
        {
          label: `Write the working equation to find the target amount for ${missingCat}:`,
          expectedAnswer: `${compVal} + ${diffVal} = ${shortage}`,
          acceptedAnswers: getAdditionAcceptedAnswers(compVal, diffVal, shortage)
        },
        {
          label: `Write the working equation to find how many grid blocks tall the bar for ${missingCat} must be:`,
          expectedAnswer: `${shortage} / ${scaleStep} = ${blocksNeeded}`,
          acceptedAnswers: [
            ...getDivisionAcceptedAnswers(shortage, scaleStep, blocksNeeded),
            String(blocksNeeded)
          ]
        }
      ];

      candidateDistractors = [
        String(blocksNeeded + 1),
        String(Math.max(1, blocksNeeded - 1)),
        String(extraBlocks),
        String(blocksNeeded + 2)
      ];

    } else { // 'average_target'
      blocksNeeded = getRandomInt(2, 5);
      shortage = blocksNeeded * scaleStep;
      goal = knownSum + shortage;
      const rem = goal % barCount;
      if (rem !== 0) {
        blocksNeeded += (barCount - rem);
        shortage = blocksNeeded * scaleStep;
        goal = knownSum + shortage;
      }
      const finalAvgVal = Math.round(goal / barCount);

      finalAnswer = String(blocksNeeded);

      askText = isStructure
        ? `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The ${sfTheme.targetSubject} set a goal to ${verb} an average of ${finalAvgVal} ${sfTheme.unit} per ${categorySingular} across all ${barCount} ${categoriesPlural}. The bar graph shows the amounts ${pastVerb} for ${knownCatsStr}. How many grid blocks tall must the bar for ${missingCat} be drawn to achieve this goal? Show your working and the final answer."`
        : `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The ${sfTheme.targetSubject} set a goal to ${verb} an average of ${finalAvgVal} ${sfTheme.unit} per ${categorySingular} across all ${barCount} ${categoriesPlural}. The bar graph shows the amounts ${pastVerb} for ${knownCatsStr}. How many grid blocks tall must the bar for ${missingCat} be drawn to achieve this goal?"`;

      stepsArr = [
        {
          label: `Write the working equation to find the total ${sfTheme.unit} needed across all ${barCount} ${categoriesPlural}:`,
          expectedAnswer: `${finalAvgVal} x ${barCount} = ${goal}`,
          acceptedAnswers: getMultiplicationAcceptedAnswers(finalAvgVal, barCount, goal)
        },
        {
          label: `Write the working equation to find the total ${sfTheme.unit} ${pastVerb} in ${knownCatsStr}:`,
          expectedAnswer: knownValues.length === 2
            ? `${knownValues[0]} + ${knownValues[1]} = ${knownSum}`
            : `${knownValues[0]} + ${knownValues[1]} + ${knownValues[2]} = ${knownSum}`,
          acceptedAnswers: getKnownSumAdditionAccepted()
        },
        {
          label: `Write the working equation to find the shortage needed for ${missingCat}:`,
          expectedAnswer: `${goal} - ${knownSum} = ${shortage}`,
          acceptedAnswers: getSubtractionAcceptedAnswers(goal, knownSum, shortage)
        },
        {
          label: `Write the working equation to find how many grid blocks tall the bar for ${missingCat} must be:`,
          expectedAnswer: `${shortage} / ${scaleStep} = ${blocksNeeded}`,
          acceptedAnswers: [
            ...getDivisionAcceptedAnswers(shortage, scaleStep, blocksNeeded),
            String(blocksNeeded)
          ]
        }
      ];

      candidateDistractors = [
        String(blocksNeeded + 1),
        String(Math.max(1, blocksNeeded - 1)),
        String(blocksNeeded + 2),
        String(Math.round(finalAvgVal / scaleStep))
      ];
    }

    const colors = getRandomPaletteColors(barCount);
    const data = allCats.map((cat, i) => ({
      category: cat,
      value: i === missingIdx ? 0 : blocksArr[i] * scaleStep,
      color: colors[i]
    }));

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
        missingBar: missingCat
      }
    });

    if (isStructure) {
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
    } else if (isMCQ) {
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
      const opts = getFourOptions(finalAnswer, candidateDistractors);
      mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
    } else {
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
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
