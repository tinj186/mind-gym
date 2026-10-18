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

export const generateStandard = (variant, type, getFormatInstructions) => {
  const safeType = String(type || 'short question').toLowerCase();
  const isMCQ = safeType === 'mcq';
  const isShort = safeType === 'short question';
  const isStructure = !isMCQ && !isShort;

  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

  const studentName = getRandomNames(1)[0] || 'Mei Ling';

  // --------------------------------------------------------------------------
  // Variant 6: Interpolating Halfway Marks
  // --------------------------------------------------------------------------
  if (variant === 'standard_interpolating_halfway_marks') {
    // Sub-types:
    // 1: Forward Reading - Single Halfway Value (Finding Variable a)
    // 2: Forward Arithmetic - Difference a - b = c (Halfway bar vs another bar)
    // 3: Forward Arithmetic - Sum a + b = c (Two halfway bars combined)
    // 4: Forward Arithmetic - Missing Component b = c - a (Given total, find missing bar)
    // 5: Reverse Deduction - Halfway Bar Value to Scale Step (val ÷ 2.5 = Scale)
    // 6: Reverse Deduction - Half-Block Difference to Scale Step (halfStep × 2 = Scale)
    // 7: Reverse Deduction - Combined Sum of Halfway Bars to Scale Step (Total ÷ 4 = Scale)
    const subType = getRandomInt(1, 7);
    const scaleOptions = [10, 20, 50, 100];
    const scaleStep = scaleOptions[getRandomInt(0, scaleOptions.length - 1)];
    const halfStep = scaleStep / 2;
    const theme = getRandomBarGraphTheme(4, scaleStep <= 20 ? 'bakery_buns' : 'zoo_visitors') || getRandomBarGraphTheme(4);
    const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';
    const colors = getRandomPaletteColors(4);

    if (subType === 1) {
      // Sub-type 1: Single Halfway Value Reading
      const b1 = getRandomInt(2, 4);
      const low1 = b1 * scaleStep;
      const high1 = low1 + scaleStep;
      const val1 = low1 + halfStep;
      const val2 = (b1 + 1) * scaleStep;
      const val3 = Math.max(scaleStep, (b1 - 1) * scaleStep);
      const val4 = (b1 + 2) * scaleStep;

      const data = [
        { category: theme.items[0], value: val1, color: colors[0] },
        { category: theme.items[1], value: val2, color: colors[1] },
        { category: theme.items[2], value: val3, color: colors[2] },
        { category: theme.items[3], value: val4, color: colors[3] }
      ];
      const cat1 = data[0].category;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. The bar for ${cat1} stops halfway between ${low1} and ${high1}. How many ${theme.unit} are there for ${cat1}?"`;
        const stepsArr = [
          { label: `Lower value of the grid interval:`, expectedAnswer: String(low1), acceptedAnswers: [] },
          { label: `Half of 1 grid interval (${scaleStep} ÷ 2):`, expectedAnswer: String(halfStep), acceptedAnswers: getDivisionAcceptedAnswers(scaleStep, 2, halfStep) },
          { label: `Value of ${cat1} (${low1} + ${halfStep}):`, expectedAnswer: String(val1), acceptedAnswers: getAdditionAcceptedAnswers(low1, halfStep, val1) }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(val1);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. The bar for ${cat1} stops halfway between ${low1} and ${high1}. What is the value of ${cat1}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(val1);
        const opts = getFourOptions(finalAnswer, [
          String(low1),
          String(high1),
          String(val1 + scaleStep)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. The bar for ${cat1} stops halfway between ${low1} and ${high1}. What is the value of ${cat1}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(val1);
      }

    } else if (subType === 2) {
      // Sub-type 2: Difference a - b = c (Halfway bar vs another bar)
      const b1 = getRandomInt(3, 5);
      const low1 = b1 * scaleStep;
      const val1 = low1 + halfStep;
      const b2 = getRandomInt(1, b1 - 1);
      const val2 = b2 * scaleStep;
      const diff = val1 - val2;
      const val3 = (b1 + 1) * scaleStep;
      const val4 = (b2 + 1) * scaleStep;

      const data = [
        { category: theme.items[0], value: val1, color: colors[0] },
        { category: theme.items[1], value: val2, color: colors[1] },
        { category: theme.items[2], value: val3, color: colors[2] },
        { category: theme.items[3], value: val4, color: colors[3] }
      ];
      const cat1 = data[0].category;
      const cat2 = data[1].category;

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
          String(diff + halfStep),
          String(diff - halfStep > 0 ? diff - halfStep : diff + scaleStep),
          String(val1 - (val2 + halfStep))
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. How many more ${theme.unit} are there in ${cat1} than in ${cat2}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(diff);
      }

    } else if (subType === 3) {
      // Sub-type 3: Sum a + b = c (Two halfway bars combined)
      const b1 = getRandomInt(2, 3);
      const low1 = b1 * scaleStep;
      const high1 = low1 + scaleStep;
      const val1 = low1 + halfStep;
      const b2 = getRandomInt(3, 4);
      const low2 = b2 * scaleStep;
      const high2 = low2 + scaleStep;
      const val2 = low2 + halfStep;
      const total = val1 + val2;
      const val3 = b1 * scaleStep;
      const val4 = (b2 + 1) * scaleStep;

      const data = [
        { category: theme.items[0], value: val1, color: colors[0] },
        { category: theme.items[1], value: val2, color: colors[1] },
        { category: theme.items[2], value: val3, color: colors[2] },
        { category: theme.items[3], value: val4, color: colors[3] }
      ];
      const cat1 = data[0].category;
      const cat2 = data[1].category;

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
          { label: `Total ${theme.unit}:`, expectedAnswer: String(total), acceptedAnswers: getAdditionAcceptedAnswers(val1, val2, total) }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(total);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. What is the total number of ${theme.unit} for ${cat1} and ${cat2} combined?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(total);
        const opts = getFourOptions(finalAnswer, [
          String(total + scaleStep),
          String(total - halfStep),
          String(low1 + low2)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. What is the total number of ${theme.unit} for ${cat1} and ${cat2} combined?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(total);
      }

    } else if (subType === 4) {
      // Sub-type 4: Missing Component b = c - a
      const b1 = getRandomInt(2, 4);
      const low1 = b1 * scaleStep;
      const val1 = low1 + halfStep;
      const b2 = getRandomInt(2, 4);
      const val2 = b2 * scaleStep;
      const total = val1 + val2;
      const val3 = (b1 + 1) * scaleStep;
      const val4 = Math.max(scaleStep, (b2 - 1) * scaleStep);

      const data = [
        { category: theme.items[0], value: val1, color: colors[0] },
        { category: theme.items[1], value: val2, color: colors[1] },
        { category: theme.items[2], value: val3, color: colors[2] },
        { category: theme.items[3], value: val4, color: colors[3] }
      ];
      const cat1 = data[0].category;
      const cat2 = data[1].category;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. The total number of ${theme.unit} for ${cat1} and ${cat2} combined is ${total}. What is the value of ${cat2}?"`;
        const stepsArr = [
          { label: `Value of ${cat1}:`, expectedAnswer: String(val1), acceptedAnswers: [] },
          { label: `Value of ${cat2} (${total} - ${val1}):`, expectedAnswer: String(val2), acceptedAnswers: getSubtractionAcceptedAnswers(total, val1, val2) }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(val2);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The total number of ${theme.unit} for ${cat1} and ${cat2} combined is ${total}. What is the value of ${cat2}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(val2);
        const opts = getFourOptions(finalAnswer, [
          String(val2 + halfStep),
          String(val2 - halfStep > 0 ? val2 - halfStep : val2 + scaleStep),
          String(val2 + scaleStep)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. The total number of ${theme.unit} for ${cat1} and ${cat2} combined is ${total}. What is the value of ${cat2}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(val2);
      }

    } else if (subType === 5) {
      // Sub-type 5: Reverse Deduction - Halfway Bar Value to Scale Step (val ÷ 2.5 = Scale)
      const val1 = Math.round(2.5 * scaleStep);
      const val2 = 2 * scaleStep;
      const val3 = 3 * scaleStep;
      const val4 = scaleStep;

      const data = [
        { category: theme.items[0], value: val1, color: colors[0] },
        { category: theme.items[1], value: val2, color: colors[1] },
        { category: theme.items[2], value: val3, color: colors[2] },
        { category: theme.items[3], value: val4, color: colors[3] }
      ];
      const cat1 = data[0].category;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${cat1} is 2 and a half grid blocks long and represents ${val1} ${theme.unit}. Count the grid blocks to find the value of 1 grid interval on the scale."`;
        const stepsArr = [
          { label: `Number of grid blocks for ${cat1}:`, expectedAnswer: `2.5`, acceptedAnswers: ["2.5", "2 1/2", "5/2", "2.5 blocks"] },
          { label: `Value of 1 grid interval (${val1} ÷ 2.5):`, expectedAnswer: String(scaleStep), acceptedAnswers: [String(scaleStep), `${val1} ÷ 2.5 = ${scaleStep}`, `${val1} / 2.5 = ${scaleStep}`, `${val1}÷2.5=${scaleStep}`, `${val1}/2.5=${scaleStep}`, `${val1 * 2} ÷ 5 = ${scaleStep}`, `${val1 * 2} / 5 = ${scaleStep}`] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(scaleStep);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers are missing. The bar for ${cat1} is 2 and a half grid blocks long and represents ${val1} ${theme.unit}. What is the value of 1 grid interval on the scale?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(scaleStep);
        const opts = getFourOptions(finalAnswer, [
          String(scaleStep * 2),
          String(scaleStep + 10),
          String(Math.max(1, scaleStep - 5))
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${cat1} is 2 and a half grid blocks long and represents ${val1} ${theme.unit}. What is the value of 1 grid interval on the scale?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(scaleStep);
      }

    } else if (subType === 6) {
      // Sub-type 6: Reverse Deduction - Half-Block Difference to Scale Step (halfStep × 2 = Scale)
      const val1 = 3 * scaleStep;
      const val2 = Math.round(2.5 * scaleStep);
      const val3 = 2 * scaleStep;
      const val4 = scaleStep;

      const data = [
        { category: theme.items[0], value: val1, color: colors[0] },
        { category: theme.items[1], value: val2, color: colors[1] },
        { category: theme.items[2], value: val3, color: colors[2] },
        { category: theme.items[3], value: val4, color: colors[3] }
      ];
      const cat1 = data[0].category;
      const cat2 = data[1].category;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${cat1} is 3 grid blocks long, and the bar for ${cat2} is 2 and a half grid blocks long. There are ${halfStep} more ${theme.unit} in ${cat1} than in ${cat2}. What is the value of 1 full grid interval on the scale?"`;
        const stepsArr = [
          { label: `Difference in grid blocks (${cat1} - ${cat2}):`, expectedAnswer: `0.5`, acceptedAnswers: ["0.5", "1/2", "0.5 block", "half"] },
          { label: `Value of 1 full grid interval (${halfStep} × 2):`, expectedAnswer: String(scaleStep), acceptedAnswers: getMultiplicationAcceptedAnswers(halfStep, 2, scaleStep) }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(scaleStep);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers are missing. The bar for ${cat1} is 3 blocks long, and the bar for ${cat2} is 2 and a half blocks long. There are ${halfStep} more ${theme.unit} in ${cat1} than in ${cat2}. What is the value of 1 full grid interval on the scale?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(scaleStep);
        const opts = getFourOptions(finalAnswer, [
          String(scaleStep * 2),
          String(scaleStep + 10),
          String(Math.max(1, scaleStep - 5))
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${cat1} is 3 blocks long, and the bar for ${cat2} is 2 and a half blocks long. There are ${halfStep} more ${theme.unit} in ${cat1} than in ${cat2}. What is the value of 1 full grid interval on the scale?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(scaleStep);
      }

    } else {
      // Sub-type 7: Reverse Deduction - Combined Sum of Halfway Bars to Scale Step (Total ÷ 4 = Scale)
      const val1 = Math.round(2.5 * scaleStep);
      const val2 = Math.round(1.5 * scaleStep);
      const total = val1 + val2; // 4 * scaleStep
      const val3 = 2 * scaleStep;
      const val4 = scaleStep;

      const data = [
        { category: theme.items[0], value: val1, color: colors[0] },
        { category: theme.items[1], value: val2, color: colors[1] },
        { category: theme.items[2], value: val3, color: colors[2] },
        { category: theme.items[3], value: val4, color: colors[3] }
      ];
      const cat1 = data[0].category;
      const cat2 = data[1].category;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${cat1} is 2 and a half grid blocks long, and the bar for ${cat2} is 1 and a half grid blocks long. Their combined total is ${total} ${theme.unit}. Count the grid blocks to find the value of 1 grid interval on the scale."`;
        const stepsArr = [
          { label: `Total grid blocks for ${cat1} and ${cat2}:`, expectedAnswer: `4`, acceptedAnswers: ["4", "2.5 + 1.5 = 4", "2.5+1.5=4"] },
          { label: `Value of 1 grid interval (${total} ÷ 4):`, expectedAnswer: String(scaleStep), acceptedAnswers: getDivisionAcceptedAnswers(total, 4, scaleStep) }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(scaleStep);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers are missing. The bar for ${cat1} is 2 and a half blocks long, and the bar for ${cat2} is 1 and a half blocks long. Their combined total is ${total} ${theme.unit}. What is the value of 1 grid interval on the scale?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(scaleStep);
        const opts = getFourOptions(finalAnswer, [
          String(scaleStep * 2),
          String(scaleStep + 10),
          String(Math.max(1, scaleStep - 5))
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${cat1} is 2 and a half blocks long, and the bar for ${cat2} is 1 and a half blocks long. Their combined total is ${total} ${theme.unit}. What is the value of 1 grid interval on the scale?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(scaleStep);
      }
    }

  // --------------------------------------------------------------------------
  // Variant 7: Deductive Axis Labeling (Blank Axis)
  // --------------------------------------------------------------------------
  } else if (variant === 'standard_deductive_axis_labeling') {
    const scaleOptions = [5, 10];
    const scaleStep = scaleOptions[getRandomInt(0, 1)];
    const theme = getRandomBarGraphTheme(4, 'marbles_collected') || getRandomBarGraphTheme(4);
    const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';

    const blocksA = getRandomInt(5, 7);
    const blocksB = getRandomInt(3, 4);
    const valA = blocksA * scaleStep;
    const valB = blocksB * scaleStep;

    const colors = getRandomPaletteColors(3);
    const data = [
      { category: theme.items[0], value: valA, color: colors[0] },
      { category: theme.items[1], value: valB, color: colors[1] },
      { category: theme.items[2], value: (blocksA - 2) * scaleStep, color: colors[2] }
    ];

    const catA = data[0].category;
    const catB = data[1].category;

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
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. ${catA} has exactly ${valA} ${theme.unit} and is ${blocksA} grid blocks long. Determine the value of 1 grid block, and find the value of ${catB}."`;
      const stepsArr = [
        { label: `Value of 1 grid block (${valA} ÷ ${blocksA}):`, expectedAnswer: String(scaleStep), acceptedAnswers: getDivisionAcceptedAnswers(valA, blocksA, scaleStep) },
        { label: `Value of ${catB} (${blocksB} blocks):`, expectedAnswer: String(valB), acceptedAnswers: getMultiplicationAcceptedAnswers(blocksB, scaleStep, valB) }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      finalAnswer = String(valB);
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers are missing. The bar for ${catA} (${blocksA} blocks) represents ${valA} ${theme.unit}. How many ${theme.unit} does ${catB} (${blocksB} blocks) represent?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
      finalAnswer = String(valB);
      const opts = getFourOptions(finalAnswer, [
        String(valB + scaleStep),
        String(valB - scaleStep > 0 ? valB - scaleStep : valB + scaleStep * 2),
        String(valA - scaleStep)
      ]);
      mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers are missing. The bar for ${catA} (${blocksA} blocks) has ${valA} ${theme.unit}. How many ${theme.unit} are in ${catB} (${blocksB} blocks)?"`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      finalAnswer = String(valB);
    }

  // --------------------------------------------------------------------------
  // Variant 8: Comparative Differences with Mixed Alignments
  // --------------------------------------------------------------------------
  } else if (variant === 'standard_comparative_differences_mixed_alignments') {
    const scaleOptions = [10, 50, 100];
    const scaleStep = scaleOptions[getRandomInt(0, 2)];
    const halfStep = scaleStep / 2;
    const theme = getRandomBarGraphTheme(4, 'weekly_profits') || getRandomBarGraphTheme(4);
    const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';

    const low1 = scaleStep * 3;
    const val1 = low1 + halfStep;
    const high1 = low1 + scaleStep;
    const val2 = scaleStep * 2;
    const diff = val1 - val2;

    const colors = getRandomPaletteColors(3);
    const data = [
      { category: theme.items[0], value: val1, color: colors[0] },
      { category: theme.items[1], value: val2, color: colors[1] },
      { category: theme.items[2], value: scaleStep * 4, color: colors[2] }
    ];

    const cat1 = data[0].category;
    const cat2 = data[1].category;

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
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. For ${cat1}, the bar stops halfway between ${low1} and ${high1}. For ${cat2}, the bar lands on the ${val2} line. How much more ${theme.unit} does ${cat1} have than ${cat2}?"`;
      const stepsArr = [
        { label: `Value of ${cat1}:`, expectedAnswer: String(val1), acceptedAnswers: [] },
        { label: `Value of ${cat2}:`, expectedAnswer: String(val2), acceptedAnswers: [] },
        { label: `Difference:`, expectedAnswer: String(diff), acceptedAnswers: getSubtractionAcceptedAnswers(val1, val2, diff) }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      finalAnswer = String(diff);
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, how much more ${theme.unit} does ${cat1} have than ${cat2}?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
      finalAnswer = String(diff);
      const opts = getFourOptions(finalAnswer, [
        String(diff + halfStep),
        String(diff - halfStep > 0 ? diff - halfStep : diff + scaleStep),
        String(diff + scaleStep)
      ]);
      mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. What is the difference in ${theme.unit} between ${cat1} and ${cat2}?"`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      finalAnswer = String(diff);
    }

  // --------------------------------------------------------------------------
  // Variant 9: Total Sum (3 Categories, Mixed Alignments)
  // --------------------------------------------------------------------------
  } else if (variant === 'standard_total_sum_mixed_alignments') {
    const scaleOptions = [2, 10, 50];
    const scaleStep = scaleOptions[getRandomInt(0, 2)];
    const halfStep = scaleStep / 2;
    const theme = getRandomBarGraphTheme(4, 'vegetables_harvested') || getRandomBarGraphTheme(4);
    const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';

    const val1 = scaleStep * 4;
    const low2 = scaleStep * 5;
    const val2 = low2 + halfStep;
    const high2 = low2 + scaleStep;
    const val3 = scaleStep * 3;
    const total = val1 + val2 + val3;

    const colors = getRandomPaletteColors(3);
    const data = [
      { category: theme.items[0], value: val1, color: colors[0] },
      { category: theme.items[1], value: val2, color: colors[1] },
      { category: theme.items[2], value: val3, color: colors[2] }
    ];

    const cat1 = data[0].category;
    const cat2 = data[1].category;
    const cat3 = data[2].category;

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
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Find the total number of ${theme.unit} for ${cat1}, ${cat2}, and ${cat3} combined."`;
      const stepsArr = [
        { label: `Value of ${cat1}:`, expectedAnswer: String(val1), acceptedAnswers: [] },
        { label: `Value of ${cat2}:`, expectedAnswer: String(val2), acceptedAnswers: [] },
        { label: `Value of ${cat3}:`, expectedAnswer: String(val3), acceptedAnswers: [] },
        { label: `Total ${theme.unit}:`, expectedAnswer: String(total), acceptedAnswers: getThreeTermAdditionAcceptedAnswers(val1, val2, val3, total) }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      finalAnswer = String(total);
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, what is the total number of ${theme.unit} for ${cat1}, ${cat2}, and ${cat3} combined?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
      finalAnswer = String(total);
      const opts = getFourOptions(finalAnswer, [
        String(total + halfStep),
        String(total - halfStep),
        String(total + scaleStep)
      ]);
      mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. What is the total number of ${theme.unit} for ${cat1}, ${cat2}, and ${cat3} combined?"`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      finalAnswer = String(total);
    }

  // --------------------------------------------------------------------------
  // Variant 10: Scale Error Correction (Translating Blocks to New Scale)
  // --------------------------------------------------------------------------
  } else {
    // standard_scale_error_correction
    const scaleOrig = 2;
    const scaleNew = 10;
    const blocks = getRandomInt(4, 7);
    const valOrig = blocks * scaleOrig;
    const valNew = blocks * scaleNew;

    const theme = getRandomBarGraphTheme(4, 'favorite_fruits') || getRandomBarGraphTheme(4);
    const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';

    const colors = getRandomPaletteColors(3);
    const data = [
      { category: theme.items[0], value: valOrig, color: colors[0] },
      { category: theme.items[1], value: (blocks - 1) * scaleOrig, color: colors[1] },
      { category: theme.items[2], value: (blocks + 1) * scaleOrig, color: colors[2] }
    ];

    const cat = data[0].category;

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_GRAPH",
      componentData: {
        title: theme.title,
        xAxisLabel: theme.xAxisLabel,
        yAxisLabel: theme.yAxisLabel,
        data,
        scaleStep: scaleOrig,
        orientation,
        showGridLines: true
      }
    });

    if (isStructure) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. The bar for ${cat} is ${blocks} grid blocks tall. If the scale is changed so that 1 grid block stands for ${scaleNew} ${theme.unit} instead of ${scaleOrig}, what is the correct value for ${cat}?"`;
      const stepsArr = [
        { label: `Number of grid blocks for ${cat}:`, expectedAnswer: String(blocks), acceptedAnswers: [] },
        { label: `Correct value for ${cat} (${blocks} x ${scaleNew}):`, expectedAnswer: String(valNew), acceptedAnswers: getMultiplicationAcceptedAnswers(blocks, scaleNew, valNew) }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      finalAnswer = String(valNew);
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar for ${cat} is ${blocks} grid blocks tall. If 1 grid block stands for ${scaleNew} units instead of ${scaleOrig}, what is the new value of the bar?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
      finalAnswer = String(valNew);
      const opts = getFourOptions(finalAnswer, [
        String(valOrig),
        String(valNew - scaleNew),
        String(blocks + scaleNew)
      ]);
      mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar for ${cat} is ${blocks} grid blocks tall. If 1 grid block stands for ${scaleNew} instead of ${scaleOrig}, what is the correct value of ${cat}?"`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      finalAnswer = String(valNew);
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
