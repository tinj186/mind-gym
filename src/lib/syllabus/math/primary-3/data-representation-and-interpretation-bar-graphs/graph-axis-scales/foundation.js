import { getRandomBarGraphTheme, getRandomNames, getRandomPaletteColors } from '../../../../../utils/variable-bank.js';

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getFourOptions = (correctVal, candidateDistractors = []) => {
  const set = new Set([String(correctVal)]);
  for (const d of candidateDistractors) {
    if (d !== undefined && d !== null && String(d).trim() !== '' && !set.has(String(d)) && set.size < 4) {
      set.add(String(d));
    }
  }
  let delta = 1;
  const num = Number(correctVal);
  while (set.size < 4) {
    if (!isNaN(num)) {
      const candidate = String(Math.max(1, num + (set.size % 2 === 1 ? delta * 5 : -delta * 5)));
      if (!set.has(candidate)) set.add(candidate);
    } else {
      set.add(`Option ${set.size + 1}`);
    }
    delta++;
  }
  return Array.from(set);
};

const getMultiplicationAcceptedAnswers = (a, b, product) => [
  String(product),
  `${a} x ${b} = ${product}`,
  `${b} x ${a} = ${product}`,
  `${a} X ${b} = ${product}`,
  `${b} X ${a} = ${product}`,
  `${a} × ${b} = ${product}`,
  `${b} × ${a} = ${product}`,
  `${a} * ${b} = ${product}`,
  `${b} * ${a} = ${product}`,
  `${a}x${b}=${product}`,
  `${b}x${a}=${product}`,
  `${a}X${b}=${product}`,
  `${b}X${a}=${product}`,
  `${a}×${b}=${product}`,
  `${b}×${a}=${product}`,
  `${a}*${b}=${product}`,
  `${b}*${a}=${product}`
];

const getDivisionAcceptedAnswers = (total, divisor, quotient) => [
  String(quotient),
  `${total} ÷ ${divisor} = ${quotient}`,
  `${total} / ${divisor} = ${quotient}`,
  `${total}÷${divisor}=${quotient}`,
  `${total}/${divisor}=${quotient}`
];

const getAdditionAcceptedAnswers = (a, b, sum) => [
  String(sum),
  `${a} + ${b} = ${sum}`,
  `${b} + ${a} = ${sum}`,
  `${a}+${b}=${sum}`,
  `${b}+${a}=${sum}`
];

const getThreeTermAdditionAcceptedAnswers = (a, b, c, sum) => {
  const perms = [
    [a, b, c], [a, c, b],
    [b, a, c], [b, c, a],
    [c, a, b], [c, b, a]
  ];
  const list = [String(sum)];
  for (const p of perms) {
    list.push(`${p[0]} + ${p[1]} + ${p[2]} = ${sum}`);
    list.push(`${p[0]}+${p[1]}+${p[2]}=${sum}`);
  }
  return Array.from(new Set(list));
};

const getSubtractionAcceptedAnswers = (a, b, diff) => [
  String(diff),
  `${a} - ${b} = ${diff}`,
  `${a}-${b}=${diff}`
];

const getDifferenceAcceptedAnswers = (val1, val2, diffVal, diffBlocks, scaleStep) => {
  const list = [
    ...getSubtractionAcceptedAnswers(val1, val2, diffVal),
    ...getMultiplicationAcceptedAnswers(diffBlocks, scaleStep, diffVal)
  ];
  return Array.from(new Set(list));
};

const getSumAcceptedAnswers = (val1, val2, totalVal, totalBlocks, scaleStep) => {
  const list = [
    ...getAdditionAcceptedAnswers(val1, val2, totalVal),
    ...getMultiplicationAcceptedAnswers(totalBlocks, scaleStep, totalVal)
  ];
  return Array.from(new Set(list));
};

const getThreeTermSumAcceptedAnswers = (v1, v2, v3, totalVal, totalBlocks, scaleStep) => {
  const list = [
    ...getThreeTermAdditionAcceptedAnswers(v1, v2, v3, totalVal),
    ...getMultiplicationAcceptedAnswers(totalBlocks, scaleStep, totalVal)
  ];
  return Array.from(new Set(list));
};

const getCombinedAddSubAcceptedAnswers = (a, b, c, result) => [
  String(result),
  `${a} + ${b} - ${c} = ${result}`,
  `${a}+${b}-${c}=${result}`,
  `${b} + ${a} - ${c} = ${result}`,
  `${b}+${a}-${c}=${result}`,
  `${a + b} - ${c} = ${result}`,
  `${a + b}-${c}=${result}`
];

const getSubSubAcceptedAnswers = (a, b, c, result) => [
  String(result),
  `${a} - ${b} - ${c} = ${result}`,
  `${a}-${b}-${c}=${result}`,
  `${a} - ${c} - ${b} = ${result}`,
  `${a}-${c}-${b}=${result}`,
  `${a} - ${b + c} = ${result}`,
  `${a}-${b + c}=${result}`
];

const getTwoPairsDiffAcceptedAnswers = (sum12, sum34, diff) => [
  String(diff),
  `${sum12} - ${sum34} = ${diff}`,
  `${sum12}-${sum34}=${diff}`
];

export const generateFoundation = (variant, type, getFormatInstructions) => {
  const safeType = String(type || 'short question').toLowerCase();
  const isMCQ = safeType === 'mcq';
  const isShort = safeType === 'short question';
  const isStructure = !isMCQ && !isShort;

  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

  const studentName = getRandomNames(1)[0] || 'Ahmad';

  // --------------------------------------------------------------------------
  // Variant 1: Scale Step Identification and Reading (With Forward & Reverse Varieties)
  // --------------------------------------------------------------------------
  if (variant === 'foundation_scale_step_identification') {
    // Sub-types:
    // 1: Forward - Read axis scale & determine single bar value
    // 2: Forward - Read axis scale & determine sum of 2 bars
    // 3: Reverse - Blank axis, given grand total across all bars, work backward to determine scale
    // 4: Reverse - Blank axis, given value of 1 bar, work backward to determine scale
    const subType = getRandomInt(1, 4);

    if (subType === 1) {
      // Forward: Read scale & single bar value
      const scaleOptions = [2, 5, 10, 50, 100];
      const scaleStep = scaleOptions[getRandomInt(0, scaleOptions.length - 1)];
      const theme = getRandomBarGraphTheme(4);
      const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';
      const axisWord = orientation === 'horizontal' ? 'horizontal axis' : 'vertical axis';

      const multiplierPool = [2, 3, 4, 5, 6, 7];
      const shuffledMultipliers = multiplierPool.sort(() => 0.5 - Math.random());
      const colors = getRandomPaletteColors(4);
      const data = theme.items.slice(0, 4).map((cat, idx) => ({
        category: cat,
        value: shuffledMultipliers[idx] * scaleStep,
        color: colors[idx]
      }));

      const targetIdx = getRandomInt(0, 3);
      const targetCat = data[targetIdx].category;
      const targetVal = data[targetIdx].value;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep,
          orientation,
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Look at the ${axisWord} to find the value of each grid interval. Then, determine the value of ${targetCat}."`;
        const stepsArr = [
          { label: `Value of 1 grid interval:`, expectedAnswer: String(scaleStep), acceptedAnswers: [] },
          { label: `Value of ${targetCat}:`, expectedAnswer: String(targetVal), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(targetVal);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Look at the ${axisWord} of the bar graph. What is the value of 1 grid interval on the scale?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(scaleStep);
        const opts = getFourOptions(finalAnswer, [
          String(scaleStep * 2),
          String(Math.max(1, Math.floor(scaleStep / 2))),
          String(scaleStep * 5)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. What is the value of 1 grid interval on the ${axisWord}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(scaleStep);
      }

    } else if (subType === 2) {
      // Forward: Read scale & sum of 2 bars
      const scaleOptions = [2, 5, 10, 50];
      const scaleStep = scaleOptions[getRandomInt(0, scaleOptions.length - 1)];
      const theme = getRandomBarGraphTheme(4);
      const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';
      const axisWord = orientation === 'horizontal' ? 'horizontal axis' : 'vertical axis';

      const multiplierPool = [2, 3, 4, 5];
      const shuffledMultipliers = multiplierPool.sort(() => 0.5 - Math.random());
      const colors = getRandomPaletteColors(4);
      const data = theme.items.slice(0, 4).map((cat, idx) => ({
        category: cat,
        value: shuffledMultipliers[idx] * scaleStep,
        color: colors[idx]
      }));

      const cat1 = data[0].category;
      const val1 = data[0].value;
      const cat2 = data[1].category;
      const val2 = data[1].value;
      const total = val1 + val2;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep,
          orientation,
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Look at the ${axisWord} to determine the scale used. Then, calculate the total number of ${theme.unit} for ${cat1} and ${cat2} combined."`;
        const stepsArr = [
          { label: `Value of 1 grid interval:`, expectedAnswer: String(scaleStep), acceptedAnswers: [] },
          { label: `Value of ${cat1}:`, expectedAnswer: String(val1), acceptedAnswers: [] },
          { label: `Value of ${cat2}:`, expectedAnswer: String(val2), acceptedAnswers: [] },
          { label: `Total for ${cat1} and ${cat2}:`, expectedAnswer: String(total), acceptedAnswers: getAdditionAcceptedAnswers(val1, val2, total) }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(total);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, what is the combined total of ${cat1} and ${cat2}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(total);
        const opts = getFourOptions(finalAnswer, [
          String(total + scaleStep),
          String(total - scaleStep > 0 ? total - scaleStep : total + scaleStep * 2),
          String(total + scaleStep * 2)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. What is the combined total for ${cat1} and ${cat2}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(total);
      }

    } else if (subType === 3) {
      // Reverse: Blank axis, given grand total across all bars, work backward to determine scale
      const scaleOptions = [2, 5, 10, 20];
      const scaleStep = scaleOptions[getRandomInt(0, scaleOptions.length - 1)];
      const theme = getRandomBarGraphTheme(3);
      const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';

      const blocks = [3, 5, 4];
      const totalBlocks = blocks[0] + blocks[1] + blocks[2]; // 12
      const grandTotal = totalBlocks * scaleStep;

      const colors = getRandomPaletteColors(3);
      const data = theme.items.slice(0, 3).map((cat, idx) => ({
        category: cat,
        value: blocks[idx] * scaleStep,
        color: colors[idx]
      }));

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

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The total number of ${theme.unit} for all categories combined is ${grandTotal}. Count the grid blocks across all bars to determine the value of 1 grid interval on the scale."`;
        const stepsArr = [
          { label: `Total number of grid blocks:`, expectedAnswer: String(totalBlocks), acceptedAnswers: [] },
          { label: `Value of 1 grid interval (${grandTotal} ÷ ${totalBlocks}):`, expectedAnswer: String(scaleStep), acceptedAnswers: getDivisionAcceptedAnswers(grandTotal, totalBlocks, scaleStep) }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(scaleStep);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers are missing. The total number of ${theme.unit} across all categories is ${grandTotal}. What is the value of 1 grid interval on the scale?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(scaleStep);
        const opts = getFourOptions(finalAnswer, [
          String(scaleStep * 2),
          String(scaleStep + 5),
          String(Math.max(1, scaleStep - 2))
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers are missing. The total number of ${theme.unit} across all categories is ${grandTotal}. What is the value of 1 grid interval on the scale?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(scaleStep);
      }

    } else {
      // Reverse: Blank axis, given value of 1 bar, work backward to determine scale
      const scaleOptions = [2, 5, 10];
      const scaleStep = scaleOptions[getRandomInt(0, scaleOptions.length - 1)];
      const theme = getRandomBarGraphTheme(3);
      const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';

      const blocks = [4, 6, 3];
      const knownIdx = 0;
      const knownCat = theme.items[knownIdx];
      const knownBlocks = blocks[knownIdx];
      const knownVal = knownBlocks * scaleStep;

      const colors = getRandomPaletteColors(3);
      const data = theme.items.slice(0, 3).map((cat, idx) => ({
        category: cat,
        value: blocks[idx] * scaleStep,
        color: colors[idx]
      }));

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

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${knownCat} represents ${knownVal} ${theme.unit} and is ${knownBlocks} grid blocks long. Count the grid blocks to find the value of 1 grid interval on the scale."`;
        const stepsArr = [
          { label: `Number of grid blocks for ${knownCat}:`, expectedAnswer: String(knownBlocks), acceptedAnswers: [] },
          { label: `Value of 1 grid interval (${knownVal} ÷ ${knownBlocks}):`, expectedAnswer: String(scaleStep), acceptedAnswers: getDivisionAcceptedAnswers(knownVal, knownBlocks, scaleStep) }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(scaleStep);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers are missing. The bar for ${knownCat} (${knownBlocks} blocks) represents ${knownVal} ${theme.unit}. What is the value of 1 grid interval on the scale?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(scaleStep);
        const opts = getFourOptions(finalAnswer, [
          String(scaleStep * 2),
          String(scaleStep + 5),
          String(Math.max(1, scaleStep - 2))
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers are missing. The bar for ${knownCat} (${knownBlocks} blocks) represents ${knownVal} ${theme.unit}. What is the value of 1 grid interval on the scale?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(scaleStep);
      }
    }

  // --------------------------------------------------------------------------
  // Variant 2: Large Scale Summation (50s and 100s) (Forward & Reverse Varieties)
  // --------------------------------------------------------------------------
  } else if (variant === 'foundation_large_scale_summation') {
    // Sub-types:
    // 1: Forward - Read large scale & find sum of 2 categories
    // 2: Forward - Read large scale & find sum of 3 categories
    // 3: Reverse - Blank axis, given combined sum of 2 bars, deduce scale step (50 or 100)
    // 4: Reverse - Blank axis, given grand total across all bars, deduce scale step (50 or 100)
    const subType = getRandomInt(1, 4);

    if (subType === 1) {
      // Forward: Sum of 2 categories on large scale
      const scaleOptions = [50, 100];
      const scaleStep = scaleOptions[getRandomInt(0, 1)];
      const theme = getRandomBarGraphTheme(4, scaleStep === 100 ? 'zoo_visitors' : 'factory_production') || getRandomBarGraphTheme(4);
      const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';

      const multiplierPool = [2, 3, 4, 5, 6];
      const shuffledMultipliers = multiplierPool.sort(() => 0.5 - Math.random());
      const colors = getRandomPaletteColors(4);
      const data = theme.items.slice(0, 4).map((cat, idx) => ({
        category: cat,
        value: shuffledMultipliers[idx] * scaleStep,
        color: colors[idx]
      }));

      const shuffledIndices = [0, 1, 2, 3].sort(() => 0.5 - Math.random());
      const cat1 = data[shuffledIndices[0]].category;
      const val1 = data[shuffledIndices[0]].value;
      const cat2 = data[shuffledIndices[1]].category;
      const val2 = data[shuffledIndices[1]].value;
      const total = val1 + val2;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep,
          orientation,
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Find the total number of ${theme.unit} for ${cat1} and ${cat2} combined."`;
        const stepsArr = [
          { label: `Value of ${cat1}:`, expectedAnswer: String(val1), acceptedAnswers: [] },
          { label: `Value of ${cat2}:`, expectedAnswer: String(val2), acceptedAnswers: [] },
          { label: `Total for ${cat1} and ${cat2}:`, expectedAnswer: String(total), acceptedAnswers: getAdditionAcceptedAnswers(val1, val2, total) }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(total);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, what is the total number of ${theme.unit} for ${cat1} and ${cat2} combined?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(total);
        const opts = getFourOptions(finalAnswer, [
          String(total + scaleStep),
          String(total - scaleStep > 0 ? total - scaleStep : total + scaleStep * 2),
          String(total + scaleStep * 2)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. How many ${theme.unit} were there for ${cat1} and ${cat2} altogether?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(total);
      }

    } else if (subType === 2) {
      // Forward: Sum of 3 categories on large scale
      const scaleOptions = [50, 100];
      const scaleStep = scaleOptions[getRandomInt(0, 1)];
      const theme = getRandomBarGraphTheme(4, 'factory_production') || getRandomBarGraphTheme(4);
      const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';

      const multiplierPool = [2, 3, 4, 5];
      const shuffledMultipliers = multiplierPool.sort(() => 0.5 - Math.random());
      const colors = getRandomPaletteColors(4);
      const data = theme.items.slice(0, 4).map((cat, idx) => ({
        category: cat,
        value: shuffledMultipliers[idx] * scaleStep,
        color: colors[idx]
      }));

      const c1 = data[0].category;
      const v1 = data[0].value;
      const c2 = data[1].category;
      const v2 = data[1].value;
      const c3 = data[2].category;
      const v3 = data[2].value;
      const total = v1 + v2 + v3;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep,
          orientation,
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Find the total number of ${theme.unit} for ${c1}, ${c2}, and ${c3} combined."`;
        const stepsArr = [
          { label: `Value of ${c1}:`, expectedAnswer: String(v1), acceptedAnswers: [] },
          { label: `Value of ${c2}:`, expectedAnswer: String(v2), acceptedAnswers: [] },
          { label: `Value of ${c3}:`, expectedAnswer: String(v3), acceptedAnswers: [] },
          { label: `Total combined:`, expectedAnswer: String(total), acceptedAnswers: getThreeTermAdditionAcceptedAnswers(v1, v2, v3, total) }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(total);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, what is the total number of ${theme.unit} for ${c1}, ${c2}, and ${c3} combined?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(total);
        const opts = getFourOptions(finalAnswer, [
          String(total + scaleStep),
          String(total - scaleStep > 0 ? total - scaleStep : total + scaleStep * 2),
          String(total + scaleStep * 2)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. What is the total number of ${theme.unit} for ${c1}, ${c2}, and ${c3} combined?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(total);
      }

    } else if (subType === 3) {
      // Reverse: Blank axis, given combined sum of 2 bars, deduce scale step (50 or 100)
      const scaleOptions = [50, 100];
      const scaleStep = scaleOptions[getRandomInt(0, 1)];
      const theme = getRandomBarGraphTheme(3, 'zoo_visitors') || getRandomBarGraphTheme(3);
      const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';

      const blocks = [3, 5, 4];
      const cat1 = theme.items[0];
      const cat2 = theme.items[1];
      const b1 = blocks[0];
      const b2 = blocks[1];
      const combinedBlocks = b1 + b2; // 8
      const pairTotal = combinedBlocks * scaleStep; // 400 or 800

      const colors = getRandomPaletteColors(3);
      const data = theme.items.slice(0, 3).map((cat, idx) => ({
        category: cat,
        value: blocks[idx] * scaleStep,
        color: colors[idx]
      }));

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

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The combined total for ${cat1} and ${cat2} is ${pairTotal} ${theme.unit}. Count the grid blocks for both bars to determine the value of 1 grid interval on the scale."`;
        const stepsArr = [
          { label: `Total grid blocks for ${cat1} and ${cat2}:`, expectedAnswer: String(combinedBlocks), acceptedAnswers: [] },
          { label: `Value of 1 grid interval (${pairTotal} ÷ ${combinedBlocks}):`, expectedAnswer: String(scaleStep), acceptedAnswers: getDivisionAcceptedAnswers(pairTotal, combinedBlocks, scaleStep) }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(scaleStep);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers are missing. The combined total for ${cat1} and ${cat2} is ${pairTotal} ${theme.unit}. What is the value of 1 grid interval on the scale?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(scaleStep);
        const opts = getFourOptions(finalAnswer, [
          String(scaleStep * 2),
          String(scaleStep === 100 ? 50 : 20),
          String(scaleStep + 50)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers are missing. The combined total for ${cat1} and ${cat2} is ${pairTotal} ${theme.unit}. What is the value of 1 grid interval on the scale?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(scaleStep);
      }

    } else {
      // Reverse: Blank axis, given grand total across all bars, deduce scale step (50 or 100)
      const scaleOptions = [50, 100];
      const scaleStep = scaleOptions[getRandomInt(0, 1)];
      const theme = getRandomBarGraphTheme(3, 'factory_production') || getRandomBarGraphTheme(3);
      const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';

      const blocks = [3, 4, 3];
      const totalBlocks = blocks[0] + blocks[1] + blocks[2]; // 10
      const grandTotal = totalBlocks * scaleStep; // 500 or 1000

      const colors = getRandomPaletteColors(3);
      const data = theme.items.slice(0, 3).map((cat, idx) => ({
        category: cat,
        value: blocks[idx] * scaleStep,
        color: colors[idx]
      }));

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

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The grand total for all categories combined is ${grandTotal} ${theme.unit}. Count the grid blocks across all bars to determine the value of 1 grid interval on the scale."`;
        const stepsArr = [
          { label: `Total number of grid blocks:`, expectedAnswer: String(totalBlocks), acceptedAnswers: [] },
          { label: `Value of 1 grid interval (${grandTotal} ÷ ${totalBlocks}):`, expectedAnswer: String(scaleStep), acceptedAnswers: getDivisionAcceptedAnswers(grandTotal, totalBlocks, scaleStep) }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(scaleStep);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers are missing. The grand total for all categories combined is ${grandTotal} ${theme.unit}. What is the value of 1 grid interval on the scale?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(scaleStep);
        const opts = getFourOptions(finalAnswer, [
          String(scaleStep * 2),
          String(scaleStep === 100 ? 50 : 25),
          String(scaleStep + 50)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers are missing. The grand total for all categories combined is ${grandTotal} ${theme.unit}. What is the value of 1 grid interval on the scale?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(scaleStep);
      }
    }

  // --------------------------------------------------------------------------
  // Variant 3: Grid Block Multiplication (Value by Counting)
  // --------------------------------------------------------------------------
  } else if (variant === 'foundation_grid_block_multiplication') {
    // Sub-types:
    // 1: Value of single bar by counting grid blocks
    // 2: Difference between two bars (multiplication & subtraction)
    // 3: Sum of two bars (multiplication & addition)
    // 4: Difference in grid blocks and difference in units
    // 5: Sum of three bars (multiplication & multi-term addition)
    const subType = getRandomInt(1, 5);
    const scaleOptions = [2, 5, 10];
    const scaleStep = scaleOptions[getRandomInt(0, scaleOptions.length - 1)];
    const theme = getRandomBarGraphTheme(4);
    const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';

    const blocksPool = [2, 3, 4, 5, 6, 7, 8];
    const shuffledBlocks = blocksPool.sort(() => 0.5 - Math.random()).slice(0, 4);
    const colors = getRandomPaletteColors(4);
    const data = theme.items.slice(0, 4).map((cat, idx) => ({
      category: cat,
      value: shuffledBlocks[idx] * scaleStep,
      color: colors[idx]
    }));

    // In all sub-types of this variant, the axis numbers are blank.
    // The student relies on the given grid block value and counts the physical blocks.
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

    if (subType === 1) {
      // Sub-type 1: Single Bar Value
      const targetIdx = getRandomInt(0, 3);
      const targetCat = data[targetIdx].category;
      const blocksCount = shuffledBlocks[targetIdx];
      const targetVal = blocksCount * scaleStep;

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Each grid block represents ${scaleStep} ${theme.unit}. Count the number of grid blocks for the ${targetCat} bar, and calculate the total number of ${theme.unit} for ${targetCat}."`;
        const stepsArr = [
          { label: `Number of grid blocks for ${targetCat}:`, expectedAnswer: String(blocksCount), acceptedAnswers: [] },
          { label: `Total ${theme.unit} for ${targetCat}:`, expectedAnswer: String(targetVal), acceptedAnswers: getMultiplicationAcceptedAnswers(blocksCount, scaleStep, targetVal) }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(targetVal);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"In the bar graph for ${theme.title.toLowerCase()}, each grid block represents ${scaleStep} ${theme.unit}. The bar for ${targetCat} is ${blocksCount} grid blocks long. What is the value of ${targetCat}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(targetVal);
        const opts = getFourOptions(finalAnswer, [
          String(targetVal + scaleStep),
          String(targetVal - scaleStep > 0 ? targetVal - scaleStep : targetVal + scaleStep * 2),
          String((blocksCount + 1) * scaleStep)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Each grid block represents ${scaleStep} ${theme.unit}. How many ${theme.unit} are there for ${targetCat}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(targetVal);
      }

    } else if (subType === 2) {
      // Sub-type 2: Difference between two bars
      const higherIdx = shuffledBlocks[0] > shuffledBlocks[1] ? 0 : 1;
      const lowerIdx = higherIdx === 0 ? 1 : 0;
      const cat1 = data[higherIdx].category;
      const blocks1 = shuffledBlocks[higherIdx];
      const val1 = blocks1 * scaleStep;
      const cat2 = data[lowerIdx].category;
      const blocks2 = shuffledBlocks[lowerIdx];
      const val2 = blocks2 * scaleStep;
      const diffBlocks = blocks1 - blocks2;
      const diffVal = diffBlocks * scaleStep;

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Each grid block represents ${scaleStep} ${theme.unit}. Count the grid blocks for ${cat1} and ${cat2}, and calculate how many more ${theme.unit} there are for ${cat1} than for ${cat2}."`;
        const stepsArr = [
          { label: `Number of grid blocks for ${cat1}:`, expectedAnswer: String(blocks1), acceptedAnswers: [] },
          { label: `Number of grid blocks for ${cat2}:`, expectedAnswer: String(blocks2), acceptedAnswers: [] },
          { label: `Difference in ${theme.unit} (${cat1} - ${cat2}):`, expectedAnswer: String(diffVal), acceptedAnswers: getDifferenceAcceptedAnswers(val1, val2, diffVal, diffBlocks, scaleStep) }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(diffVal);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"In the bar graph for ${theme.title.toLowerCase()}, each grid block represents ${scaleStep} ${theme.unit}. How many more ${theme.unit} are there for ${cat1} than for ${cat2}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(diffVal);
        const opts = getFourOptions(finalAnswer, [
          String(diffVal + scaleStep),
          String(diffVal - scaleStep > 0 ? diffVal - scaleStep : diffVal + scaleStep * 2),
          String(diffVal + scaleStep * 2)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Each grid block represents ${scaleStep} ${theme.unit}. Find the difference in ${theme.unit} between ${cat1} and ${cat2}."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(diffVal);
      }

    } else if (subType === 3) {
      // Sub-type 3: Sum of two bars
      const cat1 = data[0].category;
      const blocks1 = shuffledBlocks[0];
      const val1 = blocks1 * scaleStep;
      const cat2 = data[1].category;
      const blocks2 = shuffledBlocks[1];
      const val2 = blocks2 * scaleStep;
      const totalBlocks = blocks1 + blocks2;
      const totalVal = totalBlocks * scaleStep;

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Each grid block represents ${scaleStep} ${theme.unit}. Count the grid blocks for ${cat1} and ${cat2}, and calculate the total number of ${theme.unit} for both categories combined."`;
        const stepsArr = [
          { label: `Number of grid blocks for ${cat1}:`, expectedAnswer: String(blocks1), acceptedAnswers: [] },
          { label: `Number of grid blocks for ${cat2}:`, expectedAnswer: String(blocks2), acceptedAnswers: [] },
          { label: `Total ${theme.unit} for ${cat1} and ${cat2}:`, expectedAnswer: String(totalVal), acceptedAnswers: getSumAcceptedAnswers(val1, val2, totalVal, totalBlocks, scaleStep) }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(totalVal);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"In the bar graph for ${theme.title.toLowerCase()}, each grid block represents ${scaleStep} ${theme.unit}. What is the total number of ${theme.unit} for ${cat1} and ${cat2} combined?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(totalVal);
        const opts = getFourOptions(finalAnswer, [
          String(totalVal + scaleStep),
          String(totalVal - scaleStep > 0 ? totalVal - scaleStep : totalVal + scaleStep * 2),
          String(totalVal + scaleStep * 2)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Each grid block represents ${scaleStep} ${theme.unit}. What is the total number of ${theme.unit} for ${cat1} and ${cat2} combined?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(totalVal);
      }

    } else if (subType === 4) {
      // Sub-type 4: Comparing grid blocks & converting to value
      const higherIdx = shuffledBlocks[0] > shuffledBlocks[1] ? 0 : 1;
      const lowerIdx = higherIdx === 0 ? 1 : 0;
      const cat1 = data[higherIdx].category;
      const blocks1 = shuffledBlocks[higherIdx];
      const val1 = blocks1 * scaleStep;
      const cat2 = data[lowerIdx].category;
      const blocks2 = shuffledBlocks[lowerIdx];
      const val2 = blocks2 * scaleStep;
      const diffBlocks = blocks1 - blocks2;
      const diffVal = diffBlocks * scaleStep;

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Each grid block represents ${scaleStep} ${theme.unit}. Find how many more grid blocks the ${cat1} bar has than the ${cat2} bar, and calculate the difference in ${theme.unit}."`;
        const stepsArr = [
          { label: `Difference in grid blocks (${cat1} - ${cat2}):`, expectedAnswer: String(diffBlocks), acceptedAnswers: getSubtractionAcceptedAnswers(blocks1, blocks2, diffBlocks) },
          { label: `Difference in ${theme.unit}:`, expectedAnswer: String(diffVal), acceptedAnswers: getDifferenceAcceptedAnswers(val1, val2, diffVal, diffBlocks, scaleStep) }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(diffVal);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"In the bar graph for ${theme.title.toLowerCase()}, each grid block represents ${scaleStep} ${theme.unit}. How many more grid blocks does the bar for ${cat1} have than the bar for ${cat2}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(diffBlocks);
        const opts = getFourOptions(finalAnswer, [
          String(diffBlocks + 1),
          String(diffBlocks > 1 ? diffBlocks - 1 : diffBlocks + 2),
          String(diffBlocks + 3)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Each grid block represents ${scaleStep} ${theme.unit}. How many more grid blocks does the bar for ${cat1} have than the bar for ${cat2}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(diffBlocks);
      }

    } else {
      // Sub-type 5: Sum of three bars
      const cat1 = data[0].category;
      const blocks1 = shuffledBlocks[0];
      const val1 = blocks1 * scaleStep;
      const cat2 = data[1].category;
      const blocks2 = shuffledBlocks[1];
      const val2 = blocks2 * scaleStep;
      const cat3 = data[2].category;
      const blocks3 = shuffledBlocks[2];
      const val3 = blocks3 * scaleStep;
      const totalBlocks = blocks1 + blocks2 + blocks3;
      const totalVal = totalBlocks * scaleStep;

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Each grid block represents ${scaleStep} ${theme.unit}. Count the grid blocks to find the total number of ${theme.unit} for ${cat1}, ${cat2}, and ${cat3} combined."`;
        const stepsArr = [
          { label: `Number of grid blocks for ${cat1}:`, expectedAnswer: String(blocks1), acceptedAnswers: [] },
          { label: `Number of grid blocks for ${cat2}:`, expectedAnswer: String(blocks2), acceptedAnswers: [] },
          { label: `Number of grid blocks for ${cat3}:`, expectedAnswer: String(blocks3), acceptedAnswers: [] },
          { label: `Total ${theme.unit} for the 3 categories:`, expectedAnswer: String(totalVal), acceptedAnswers: getThreeTermSumAcceptedAnswers(val1, val2, val3, totalVal, totalBlocks, scaleStep) }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(totalVal);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"In the bar graph for ${theme.title.toLowerCase()}, each grid block represents ${scaleStep} ${theme.unit}. What is the total number of ${theme.unit} for ${cat1}, ${cat2}, and ${cat3} combined?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(totalVal);
        const opts = getFourOptions(finalAnswer, [
          String(totalVal + scaleStep),
          String(totalVal - scaleStep > 0 ? totalVal - scaleStep : totalVal + scaleStep * 2),
          String(totalVal + scaleStep * 2)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Each grid block represents ${scaleStep} ${theme.unit}. What is the total number of ${theme.unit} for ${cat1}, ${cat2}, and ${cat3} combined?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(totalVal);
      }
    }

  // --------------------------------------------------------------------------
  // Variant 4: Scale Verification & Difference
  // --------------------------------------------------------------------------
  } else if (variant === 'foundation_scale_verification_difference') {
    // Sub-types:
    // 1: Forward A - B = C (Direct 2-bar difference)
    // 2: Forward (A + B) - C = D (Sum of two bars minus a third)
    // 3: Forward A - (B + C) = D / A - B - C = D (Tallest bar minus sum of two others)
    // 4: Forward (A + B) - (C + D) = E (Difference between two pairs)
    // 5: Reverse A - B = C (Blank axis, given difference between two bars, deduce scale step)
    // 6: Reverse (A + B) - C = D (Blank axis, given combined difference, deduce scale step)
    // 7: Reverse A - (B + C) = D (Blank axis, given 3-category net difference, deduce scale step)
    const subType = getRandomInt(1, 7);
    const scaleOptions = [2, 5, 10, 20, 50];
    const scaleStep = scaleOptions[getRandomInt(0, scaleOptions.length - 1)];
    const theme = getRandomBarGraphTheme(4);
    const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';
    const colors = getRandomPaletteColors(4);

    if (subType === 1) {
      // Forward A - B = C
      const blocksPool = [2, 3, 4, 5, 6, 7, 8];
      const shuffledBlocks = blocksPool.sort(() => 0.5 - Math.random()).slice(0, 4);
      const data = theme.items.slice(0, 4).map((cat, idx) => ({
        category: cat,
        value: shuffledBlocks[idx] * scaleStep,
        color: colors[idx]
      }));

      const higherIdx = shuffledBlocks[0] > shuffledBlocks[1] ? 0 : 1;
      const lowerIdx = higherIdx === 0 ? 1 : 0;
      const cat1 = data[higherIdx].category;
      const val1 = data[higherIdx].value;
      const cat2 = data[lowerIdx].category;
      const val2 = data[lowerIdx].value;
      const diff = val1 - val2;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep,
          orientation,
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. How many more ${theme.unit} are there in ${cat1} than in ${cat2}?"`;
        const stepsArr = [
          { label: `Value of ${cat1}:`, expectedAnswer: String(val1), acceptedAnswers: [] },
          { label: `Value of ${cat2}:`, expectedAnswer: String(val2), acceptedAnswers: [] },
          { label: `Difference (${cat1} - ${cat2}):`, expectedAnswer: String(diff), acceptedAnswers: getSubtractionAcceptedAnswers(val1, val2, diff) }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(diff);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, how many more ${theme.unit} are there in ${cat1} than in ${cat2}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(diff);
        const opts = getFourOptions(finalAnswer, [
          String(diff + scaleStep),
          String(diff - scaleStep > 0 ? diff - scaleStep : diff + scaleStep * 2),
          String(diff + scaleStep * 2)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Find the difference in ${theme.unit} between ${cat1} and ${cat2}."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(diff);
      }

    } else if (subType === 2) {
      // Forward (A + B) - C = D
      const bPool = [2, 3, 4, 5, 6, 7, 8].sort(() => 0.5 - Math.random());
      let b1 = bPool[0], b2 = bPool[1], b3 = bPool[2], b4 = bPool[3];
      if (b1 + b2 <= b3) {
        const tmp = b3; b3 = b1; b1 = tmp;
      }
      const blocks = [b1, b2, b3, b4];
      const data = theme.items.slice(0, 4).map((cat, idx) => ({
        category: cat,
        value: blocks[idx] * scaleStep,
        color: colors[idx]
      }));

      const cat1 = data[0].category;
      const val1 = data[0].value;
      const cat2 = data[1].category;
      const val2 = data[1].value;
      const cat3 = data[2].category;
      const val3 = data[2].value;
      const sum12 = val1 + val2;
      const diff = sum12 - val3;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep,
          orientation,
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. How many more ${theme.unit} are there in ${cat1} and ${cat2} combined than in ${cat3}?"`;
        const stepsArr = [
          { label: `Total for ${cat1} and ${cat2}:`, expectedAnswer: String(sum12), acceptedAnswers: getAdditionAcceptedAnswers(val1, val2, sum12) },
          { label: `Value of ${cat3}:`, expectedAnswer: String(val3), acceptedAnswers: [] },
          { label: `Difference in ${theme.unit}:`, expectedAnswer: String(diff), acceptedAnswers: getCombinedAddSubAcceptedAnswers(val1, val2, val3, diff) }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(diff);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, how many more ${theme.unit} are there in ${cat1} and ${cat2} combined than in ${cat3}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(diff);
        const opts = getFourOptions(finalAnswer, [
          String(diff + scaleStep),
          String(diff - scaleStep > 0 ? diff - scaleStep : diff + scaleStep * 2),
          String(diff + scaleStep * 2)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. How many more ${theme.unit} are there in ${cat1} and ${cat2} combined than in ${cat3}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(diff);
      }

    } else if (subType === 3) {
      // Forward A - (B + C) = D / A - B - C = D
      const b2 = getRandomInt(2, 3);
      const b3 = getRandomInt(2, 3);
      const b1 = getRandomInt(b2 + b3 + 1, 9);
      const b4 = getRandomInt(2, 5);
      const blocks = [b1, b2, b3, b4];
      const data = theme.items.slice(0, 4).map((cat, idx) => ({
        category: cat,
        value: blocks[idx] * scaleStep,
        color: colors[idx]
      }));

      const cat1 = data[0].category;
      const val1 = data[0].value;
      const cat2 = data[1].category;
      const val2 = data[1].value;
      const cat3 = data[2].category;
      const val3 = data[2].value;
      const sum23 = val2 + val3;
      const diff = val1 - sum23;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep,
          orientation,
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. How much greater is the number of ${theme.unit} for ${cat1} than the combined total for ${cat2} and ${cat3}?"`;
        const stepsArr = [
          { label: `Value of ${cat1}:`, expectedAnswer: String(val1), acceptedAnswers: [] },
          { label: `Total for ${cat2} and ${cat3}:`, expectedAnswer: String(sum23), acceptedAnswers: getAdditionAcceptedAnswers(val2, val3, sum23) },
          { label: `Difference in ${theme.unit}:`, expectedAnswer: String(diff), acceptedAnswers: getSubSubAcceptedAnswers(val1, val2, val3, diff) }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(diff);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, how much greater is the number of ${theme.unit} for ${cat1} than the combined total for ${cat2} and ${cat3}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(diff);
        const opts = getFourOptions(finalAnswer, [
          String(diff + scaleStep),
          String(diff - scaleStep > 0 ? diff - scaleStep : diff + scaleStep * 2),
          String(diff + scaleStep * 2)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. How many more ${theme.unit} are there in ${cat1} than in ${cat2} and ${cat3} combined?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(diff);
      }

    } else if (subType === 4) {
      // Forward (A + B) - (C + D) = E
      const b1 = getRandomInt(6, 8);
      const b2 = getRandomInt(5, 7);
      const b3 = getRandomInt(2, 4);
      const b4 = getRandomInt(2, 4);
      const blocks = [b1, b2, b3, b4];
      const data = theme.items.slice(0, 4).map((cat, idx) => ({
        category: cat,
        value: blocks[idx] * scaleStep,
        color: colors[idx]
      }));

      const cat1 = data[0].category;
      const val1 = data[0].value;
      const cat2 = data[1].category;
      const val2 = data[1].value;
      const cat3 = data[2].category;
      const val3 = data[2].value;
      const cat4 = data[3].category;
      const val4 = data[3].value;
      const sum12 = val1 + val2;
      const sum34 = val3 + val4;
      const diff = sum12 - sum34;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep,
          orientation,
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Find the difference between the combined total of (${cat1} and ${cat2}) and the combined total of (${cat3} and ${cat4})."`;
        const stepsArr = [
          { label: `Total for ${cat1} and ${cat2}:`, expectedAnswer: String(sum12), acceptedAnswers: getAdditionAcceptedAnswers(val1, val2, sum12) },
          { label: `Total for ${cat3} and ${cat4}:`, expectedAnswer: String(sum34), acceptedAnswers: getAdditionAcceptedAnswers(val3, val4, sum34) },
          { label: `Difference in ${theme.unit}:`, expectedAnswer: String(diff), acceptedAnswers: getTwoPairsDiffAcceptedAnswers(sum12, sum34, diff) }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(diff);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, what is the difference between the combined total of (${cat1} and ${cat2}) and (${cat3} and ${cat4})?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(diff);
        const opts = getFourOptions(finalAnswer, [
          String(diff + scaleStep),
          String(diff - scaleStep > 0 ? diff - scaleStep : diff + scaleStep * 2),
          String(diff + scaleStep * 2)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. What is the difference between the combined total of (${cat1} and ${cat2}) and (${cat3} and ${cat4})?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(diff);
      }

    } else if (subType === 5) {
      // Reverse A - B = C: Given difference between two bars, deduce scale step
      const blocksPool = [2, 3, 4, 5, 6, 7, 8];
      const shuffledBlocks = blocksPool.sort(() => 0.5 - Math.random()).slice(0, 4);
      const data = theme.items.slice(0, 4).map((cat, idx) => ({
        category: cat,
        value: shuffledBlocks[idx] * scaleStep,
        color: colors[idx]
      }));

      const higherIdx = shuffledBlocks[0] > shuffledBlocks[1] ? 0 : 1;
      const lowerIdx = higherIdx === 0 ? 1 : 0;
      const cat1 = data[higherIdx].category;
      const blocks1 = shuffledBlocks[higherIdx];
      const cat2 = data[lowerIdx].category;
      const blocks2 = shuffledBlocks[lowerIdx];
      const diffBlocks = blocks1 - blocks2;
      const diffVal = diffBlocks * scaleStep;

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

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. There are ${diffVal} more ${theme.unit} in ${cat1} than in ${cat2}. Count the grid blocks to find the value of 1 grid interval on the scale."`;
        const stepsArr = [
          { label: `Difference in grid blocks (${cat1} - ${cat2}):`, expectedAnswer: String(diffBlocks), acceptedAnswers: getSubtractionAcceptedAnswers(blocks1, blocks2, diffBlocks) },
          { label: `Value of 1 grid interval (${diffVal} ÷ ${diffBlocks}):`, expectedAnswer: String(scaleStep), acceptedAnswers: getDivisionAcceptedAnswers(diffVal, diffBlocks, scaleStep) }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(scaleStep);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers are missing. There are ${diffVal} more ${theme.unit} in ${cat1} than in ${cat2}. What is the value of 1 grid interval on the scale?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(scaleStep);
        const opts = getFourOptions(finalAnswer, [
          String(scaleStep * 2),
          String(scaleStep + 5),
          String(Math.max(1, scaleStep - 2))
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. There are ${diffVal} more ${theme.unit} in ${cat1} than in ${cat2}. What is the value of 1 grid interval on the scale?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(scaleStep);
      }

    } else if (subType === 6) {
      // Reverse (A + B) - C = D: Given combined difference, deduce scale step
      const bPool = [2, 3, 4, 5, 6, 7, 8].sort(() => 0.5 - Math.random());
      let b1 = bPool[0], b2 = bPool[1], b3 = bPool[2], b4 = bPool[3];
      if (b1 + b2 <= b3) {
        const tmp = b3; b3 = b1; b1 = tmp;
      }
      const blocks = [b1, b2, b3, b4];
      const data = theme.items.slice(0, 4).map((cat, idx) => ({
        category: cat,
        value: blocks[idx] * scaleStep,
        color: colors[idx]
      }));

      const cat1 = data[0].category;
      const blocks1 = blocks[0];
      const cat2 = data[1].category;
      const blocks2 = blocks[1];
      const cat3 = data[2].category;
      const blocks3 = blocks[2];
      const diffBlocks = blocks1 + blocks2 - blocks3;
      const diffVal = diffBlocks * scaleStep;

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

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. There are ${diffVal} more ${theme.unit} in ${cat1} and ${cat2} combined than in ${cat3}. Count the grid blocks to find the value of 1 grid interval on the scale."`;
        const stepsArr = [
          { label: `Difference in grid blocks ((${cat1} + ${cat2}) - ${cat3}):`, expectedAnswer: String(diffBlocks), acceptedAnswers: [String(diffBlocks), `${blocks1} + ${blocks2} - ${blocks3} = ${diffBlocks}`, `${blocks1}+${blocks2}-${blocks3}=${diffBlocks}`, `${blocks1 + blocks2} - ${blocks3} = ${diffBlocks}`, `${blocks1 + blocks2}-${blocks3}=${diffBlocks}`] },
          { label: `Value of 1 grid interval (${diffVal} ÷ ${diffBlocks}):`, expectedAnswer: String(scaleStep), acceptedAnswers: getDivisionAcceptedAnswers(diffVal, diffBlocks, scaleStep) }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(scaleStep);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers are missing. There are ${diffVal} more ${theme.unit} in ${cat1} and ${cat2} combined than in ${cat3}. What is the value of 1 grid interval on the scale?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(scaleStep);
        const opts = getFourOptions(finalAnswer, [
          String(scaleStep * 2),
          String(scaleStep + 5),
          String(Math.max(1, scaleStep - 2))
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. There are ${diffVal} more ${theme.unit} in ${cat1} and ${cat2} combined than in ${cat3}. What is the value of 1 grid interval on the scale?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(scaleStep);
      }

    } else {
      // Reverse A - (B + C) = D: Given 3-category net difference, deduce scale step
      const b2 = getRandomInt(2, 3);
      const b3 = getRandomInt(2, 3);
      const b1 = getRandomInt(b2 + b3 + 1, 9);
      const b4 = getRandomInt(2, 5);
      const blocks = [b1, b2, b3, b4];
      const data = theme.items.slice(0, 4).map((cat, idx) => ({
        category: cat,
        value: blocks[idx] * scaleStep,
        color: colors[idx]
      }));

      const cat1 = data[0].category;
      const blocks1 = blocks[0];
      const cat2 = data[1].category;
      const blocks2 = blocks[1];
      const cat3 = data[2].category;
      const blocks3 = blocks[2];
      const diffBlocks = blocks1 - (blocks2 + blocks3);
      const diffVal = diffBlocks * scaleStep;

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

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. There are ${diffVal} more ${theme.unit} in ${cat1} than in ${cat2} and ${cat3} combined. Count the grid blocks to find the value of 1 grid interval on the scale."`;
        const stepsArr = [
          { label: `Difference in grid blocks (${cat1} - (${cat2} + ${cat3})):`, expectedAnswer: String(diffBlocks), acceptedAnswers: [String(diffBlocks), `${blocks1} - ${blocks2} - ${blocks3} = ${diffBlocks}`, `${blocks1}-${blocks2}-${blocks3}=${diffBlocks}`, `${blocks1} - ${blocks2 + blocks3} = ${diffBlocks}`, `${blocks1}-${blocks2 + blocks3}=${diffBlocks}`] },
          { label: `Value of 1 grid interval (${diffVal} ÷ ${diffBlocks}):`, expectedAnswer: String(scaleStep), acceptedAnswers: getDivisionAcceptedAnswers(diffVal, diffBlocks, scaleStep) }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(scaleStep);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers are missing. There are ${diffVal} more ${theme.unit} in ${cat1} than in ${cat2} and ${cat3} combined. What is the value of 1 grid interval on the scale?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(scaleStep);
        const opts = getFourOptions(finalAnswer, [
          String(scaleStep * 2),
          String(scaleStep + 5),
          String(Math.max(1, scaleStep - 2))
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. There are ${diffVal} more ${theme.unit} in ${cat1} than in ${cat2} and ${cat3} combined. What is the value of 1 grid interval on the scale?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(scaleStep);
      }
    }

  // --------------------------------------------------------------------------
  // Variant 5: Combining Multiple Bars on Base Scales
  // --------------------------------------------------------------------------
  } else {
    // foundation_combining_multiple_bars
    const scaleOptions = [2, 5];
    const scaleStep = scaleOptions[getRandomInt(0, 1)];
    const theme = getRandomBarGraphTheme(4);
    const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';

    const multiplierPool = [2, 3, 4, 6];
    const shuffledMultipliers = multiplierPool.sort(() => 0.5 - Math.random());
    const colors = getRandomPaletteColors(4);
    const data = theme.items.slice(0, 4).map((cat, idx) => ({
      category: cat,
      value: shuffledMultipliers[idx] * scaleStep,
      color: colors[idx]
    }));

    const c1 = data[0].category;
    const v1 = data[0].value;
    const c2 = data[1].category;
    const v2 = data[1].value;
    const c3 = data[2].category;
    const v3 = data[2].value;
    const total = v1 + v2 + v3;

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_GRAPH",
      componentData: {
        title: theme.title,
        xAxisLabel: theme.xAxisLabel,
        yAxisLabel: theme.yAxisLabel,
        data,
        scaleStep,
        orientation,
        showGridLines: true
      }
    });

    if (isStructure) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Find the total number of ${theme.unit} for ${c1}, ${c2}, and ${c3} combined."`;
      const stepsArr = [
        { label: `Value of ${c1}:`, expectedAnswer: String(v1), acceptedAnswers: [] },
        { label: `Value of ${c2}:`, expectedAnswer: String(v2), acceptedAnswers: [] },
        { label: `Value of ${c3}:`, expectedAnswer: String(v3), acceptedAnswers: [] },
        { label: `Total combined:`, expectedAnswer: String(total), acceptedAnswers: getThreeTermAdditionAcceptedAnswers(v1, v2, v3, total) }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      finalAnswer = String(total);
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, what is the total number of ${theme.unit} for ${c1}, ${c2}, and ${c3} combined?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
      finalAnswer = String(total);
      const opts = getFourOptions(finalAnswer, [
        String(total + scaleStep),
        String(total - scaleStep > 0 ? total - scaleStep : total + scaleStep * 2),
        String(total + scaleStep * 2)
      ]);
      mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. What is the total number of ${theme.unit} for ${c1}, ${c2}, and ${c3} combined?"`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      finalAnswer = String(total);
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
