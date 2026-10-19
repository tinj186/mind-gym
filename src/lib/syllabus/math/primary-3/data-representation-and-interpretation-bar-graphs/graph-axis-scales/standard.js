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
  // Variant 7: Deductive Axis Labeling (Blank Axis with 1-bar, 2-bar, 3-bar, Diff, or Grand Total Deductions)
  // --------------------------------------------------------------------------
  } else if (variant === 'standard_deductive_axis_labeling') {
    // Sub-types:
    // 1: Deduction from 1 bar -> find remaining 1 bar
    // 2: Deduction from total of 2 bars -> find remaining 1 bar
    // 3: Deduction from total of 3 bars -> find remaining 1 bar
    // 4: Deduction from difference between 2 bars -> find remaining 1 bar
    // 5: Deduction from 1 bar -> find combined total of 2 remaining bars
    // 6: Deduction from grand total of all 4 bars -> find remaining 1 bar
    const subType = getRandomInt(1, 6);
    const scaleOptions = [2, 5, 10, 20, 50];
    const scaleStep = scaleOptions[getRandomInt(0, scaleOptions.length - 1)];
    const theme = getRandomBarGraphTheme(4);
    const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';
    const colors = getRandomPaletteColors(4);

    // Pick 4 distinct block counts between 2 and 8
    const blockPool = [2, 3, 4, 5, 6, 7, 8].sort(() => 0.5 - Math.random());
    const blocks = blockPool.slice(0, 4);
    const categories = [...theme.items].slice(0, 4);

    const data = categories.map((cat, idx) => ({
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

    if (subType === 1) {
      // Sub-type 1: Deduction from 1 bar -> determine a remaining bar
      const catA = data[0].category;
      const bA = blocks[0];
      const valA = data[0].value;

      const catB = data[1].category;
      const bB = blocks[1];
      const valB = data[1].value;

      finalAnswer = String(valB);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${catA} represents ${valA} ${theme.unit} and is ${bA} grid blocks long. Determine the value of 1 grid block, and find the value of ${catB}."`;
        const stepsArr = [
          { label: "Write the working equation to find the value of 1 grid block:", expectedAnswer: `${valA} ÷ ${bA} = ${scaleStep}`, acceptedAnswers: getDivisionAcceptedAnswers(valA, bA, scaleStep) },
          { label: `Write the working equation to find the value of ${catB}:`, expectedAnswer: `${bB} × ${scaleStep} = ${valB}`, acceptedAnswers: getMultiplicationAcceptedAnswers(bB, scaleStep, valB) },
          { label: `Value of ${catB}:`, expectedAnswer: String(valB), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${catA} (${bA} blocks) represents ${valA} ${theme.unit}. How many ${theme.unit} does ${catB} (${bB} blocks) represent?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(valB + scaleStep),
          String(valB - scaleStep > 0 ? valB - scaleStep : valB + scaleStep * 2),
          String(valA - scaleStep > 0 ? valA - scaleStep : valB + 20)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${catA} represents ${valA} ${theme.unit} and is ${bA} grid blocks long. Determine the value of 1 grid block, and find the value of ${catB}."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (subType === 2) {
      // Sub-type 2: Deduction from total of 2 bars -> determine remaining 1 bar
      const cat1 = data[0].category;
      const b1 = blocks[0];
      const val1 = data[0].value;

      const cat2 = data[1].category;
      const b2 = blocks[1];
      const val2 = data[1].value;

      const cat3 = data[2].category;
      const b3 = blocks[2];
      const val3 = data[2].value;

      const total12 = val1 + val2;
      const blocks12 = b1 + b2;

      finalAnswer = String(val3);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. Together, ${cat1} and ${cat2} have a combined total of ${total12} ${theme.unit}. Determine the value of 1 grid block, and find the value of ${cat3}."`;
        const stepsArr = [
          { label: `Total number of grid blocks for ${cat1} and ${cat2}:`, expectedAnswer: String(blocks12), acceptedAnswers: getAdditionAcceptedAnswers(b1, b2, blocks12) },
          { label: "Write the working equation to find the value of 1 grid block:", expectedAnswer: `${total12} ÷ ${blocks12} = ${scaleStep}`, acceptedAnswers: getDivisionAcceptedAnswers(total12, blocks12, scaleStep) },
          { label: `Write the working equation to find the value of ${cat3}:`, expectedAnswer: `${b3} × ${scaleStep} = ${val3}`, acceptedAnswers: getMultiplicationAcceptedAnswers(b3, scaleStep, val3) },
          { label: `Value of ${cat3}:`, expectedAnswer: String(val3), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The combined total for ${cat1} and ${cat2} is ${total12} ${theme.unit}. How many ${theme.unit} does ${cat3} (${b3} blocks) represent?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(val3 + scaleStep),
          String(val3 - scaleStep > 0 ? val3 - scaleStep : val3 + scaleStep * 2),
          String(b3 * (scaleStep + 5))
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. Together, ${cat1} and ${cat2} have a combined total of ${total12} ${theme.unit}. Determine the value of 1 grid block, and find the value of ${cat3}."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (subType === 3) {
      // Sub-type 3: Deduction from total of 3 bars -> determine remaining 1 bar
      const cat1 = data[0].category;
      const b1 = blocks[0];
      const val1 = data[0].value;

      const cat2 = data[1].category;
      const b2 = blocks[1];
      const val2 = data[1].value;

      const cat3 = data[2].category;
      const b3 = blocks[2];
      const val3 = data[2].value;

      const cat4 = data[3].category;
      const b4 = blocks[3];
      const val4 = data[3].value;

      const total123 = val1 + val2 + val3;
      const blocks123 = b1 + b2 + b3;

      finalAnswer = String(val4);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The combined total for ${cat1}, ${cat2}, and ${cat3} is ${total123} ${theme.unit}. Determine the value of 1 grid block, and find the value of ${cat4}."`;
        const stepsArr = [
          { label: `Total number of grid blocks for ${cat1}, ${cat2}, and ${cat3}:`, expectedAnswer: String(blocks123), acceptedAnswers: getThreeTermAdditionAcceptedAnswers(b1, b2, b3, blocks123) },
          { label: "Write the working equation to find the value of 1 grid block:", expectedAnswer: `${total123} ÷ ${blocks123} = ${scaleStep}`, acceptedAnswers: getDivisionAcceptedAnswers(total123, blocks123, scaleStep) },
          { label: `Write the working equation to find the value of ${cat4}:`, expectedAnswer: `${b4} × ${scaleStep} = ${val4}`, acceptedAnswers: getMultiplicationAcceptedAnswers(b4, scaleStep, val4) },
          { label: `Value of ${cat4}:`, expectedAnswer: String(val4), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The combined total for ${cat1}, ${cat2}, and ${cat3} is ${total123} ${theme.unit}. How many ${theme.unit} does ${cat4} (${b4} blocks) represent?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(val4 + scaleStep),
          String(val4 - scaleStep > 0 ? val4 - scaleStep : val4 + scaleStep * 2),
          String(b4 * (scaleStep + 5))
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The combined total for ${cat1}, ${cat2}, and ${cat3} is ${total123} ${theme.unit}. Determine the value of 1 grid block, and find the value of ${cat4}."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (subType === 4) {
      // Sub-type 4: Deduction from difference between 2 bars -> determine remaining 1 bar
      let idxA = 0;
      let idxB = 1;
      if (blocks[idxA] < blocks[idxB]) {
        [idxA, idxB] = [idxB, idxA];
      }
      const catA = data[idxA].category;
      const bA = blocks[idxA];
      const catB = data[idxB].category;
      const bB = blocks[idxB];
      const diffBlocks = bA - bB;
      const diffVal = diffBlocks * scaleStep;

      const catC = data[2].category;
      const bC = blocks[2];
      const valC = data[2].value;

      finalAnswer = String(valC);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. There are ${diffVal} more ${theme.unit} in ${catA} than in ${catB}. Determine the value of 1 grid block, and find the value of ${catC}."`;
        const stepsArr = [
          { label: `Difference in grid blocks between ${catA} and ${catB}:`, expectedAnswer: String(diffBlocks), acceptedAnswers: getSubtractionAcceptedAnswers(bA, bB, diffBlocks) },
          { label: "Write the working equation to find the value of 1 grid block:", expectedAnswer: `${diffVal} ÷ ${diffBlocks} = ${scaleStep}`, acceptedAnswers: getDivisionAcceptedAnswers(diffVal, diffBlocks, scaleStep) },
          { label: `Write the working equation to find the value of ${catC}:`, expectedAnswer: `${bC} × ${scaleStep} = ${valC}`, acceptedAnswers: getMultiplicationAcceptedAnswers(bC, scaleStep, valC) },
          { label: `Value of ${catC}:`, expectedAnswer: String(valC), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. ${catA} has ${diffVal} more ${theme.unit} than ${catB}. How many ${theme.unit} does ${catC} (${bC} blocks) represent?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(valC + scaleStep),
          String(valC - scaleStep > 0 ? valC - scaleStep : valC + scaleStep * 2),
          String(bC * (scaleStep + 5))
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. There are ${diffVal} more ${theme.unit} in ${catA} than in ${catB}. Determine the value of 1 grid block, and find the value of ${catC}."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (subType === 5) {
      // Sub-type 5: Deduction from 1 bar -> determine combined total of 2 remaining bars
      const cat1 = data[0].category;
      const b1 = blocks[0];
      const val1 = data[0].value;

      const cat2 = data[1].category;
      const b2 = blocks[1];
      const val2 = data[1].value;

      const cat3 = data[2].category;
      const b3 = blocks[2];
      const val3 = data[2].value;

      const blocks23 = b2 + b3;
      const total23 = val2 + val3;

      finalAnswer = String(total23);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${cat1} represents ${val1} ${theme.unit} and is ${b1} grid blocks long. Determine the value of 1 grid block, and find the combined total for ${cat2} and ${cat3}."`;
        const stepsArr = [
          { label: "Write the working equation to find the value of 1 grid block:", expectedAnswer: `${val1} ÷ ${b1} = ${scaleStep}`, acceptedAnswers: getDivisionAcceptedAnswers(val1, b1, scaleStep) },
          { label: `Total number of grid blocks for ${cat2} and ${cat3}:`, expectedAnswer: String(blocks23), acceptedAnswers: getAdditionAcceptedAnswers(b2, b3, blocks23) },
          { label: `Write the working equation to find the combined total of ${cat2} and ${cat3}:`, expectedAnswer: `${blocks23} × ${scaleStep} = ${total23}`, acceptedAnswers: [...getMultiplicationAcceptedAnswers(blocks23, scaleStep, total23), ...getAdditionAcceptedAnswers(val2, val3, total23)] },
          { label: `Combined total of ${cat2} and ${cat3}:`, expectedAnswer: String(total23), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${cat1} (${b1} blocks) represents ${val1} ${theme.unit}. What is the combined total for ${cat2} and ${cat3}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(total23 + scaleStep),
          String(total23 - scaleStep > 0 ? total23 - scaleStep : total23 + scaleStep * 2),
          String(val2 + val3 + scaleStep * 2)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${cat1} represents ${val1} ${theme.unit} and is ${b1} grid blocks long. Determine the value of 1 grid block, and find the combined total for ${cat2} and ${cat3}."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else {
      // Sub-type 6: Deduction from grand total of all 4 bars -> determine remaining 1 bar
      const totalBlocks = blocks[0] + blocks[1] + blocks[2] + blocks[3];
      const grandTotal = totalBlocks * scaleStep;

      const targetIdx = getRandomInt(0, 3);
      const targetCat = data[targetIdx].category;
      const targetBlocks = blocks[targetIdx];
      const targetVal = data[targetIdx].value;

      finalAnswer = String(targetVal);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The grand total across all 4 categories is ${grandTotal} ${theme.unit}. Determine the value of 1 grid block, and find the value of ${targetCat}."`;
        const stepsArr = [
          { label: "Total number of grid blocks across all 4 categories:", expectedAnswer: String(totalBlocks), acceptedAnswers: [] },
          { label: "Write the working equation to find the value of 1 grid block:", expectedAnswer: `${grandTotal} ÷ ${totalBlocks} = ${scaleStep}`, acceptedAnswers: getDivisionAcceptedAnswers(grandTotal, totalBlocks, scaleStep) },
          { label: `Write the working equation to find the value of ${targetCat}:`, expectedAnswer: `${targetBlocks} × ${scaleStep} = ${targetVal}`, acceptedAnswers: getMultiplicationAcceptedAnswers(targetBlocks, scaleStep, targetVal) },
          { label: `Value of ${targetCat}:`, expectedAnswer: String(targetVal), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The grand total across all 4 categories is ${grandTotal} ${theme.unit}. How many ${theme.unit} does ${targetCat} (${targetBlocks} blocks) represent?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(targetVal + scaleStep),
          String(targetVal - scaleStep > 0 ? targetVal - scaleStep : targetVal + scaleStep * 2),
          String(targetBlocks * (scaleStep + 5))
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The grand total across all 4 categories is ${grandTotal} ${theme.unit}. Determine the value of 1 grid block, and find the value of ${targetCat}."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }
    }

  // --------------------------------------------------------------------------
  // Variant 8: Comparative Differences with Mixed Alignments
  // --------------------------------------------------------------------------
  } else if (variant === 'standard_comparative_differences_mixed_alignments') {
    // Sub-types:
    // 1: Higher Halfway bar vs Lower Grid-line bar (A_half - B_line)
    // 2: Higher Grid-line bar vs Lower Halfway bar (A_line - B_half)
    // 3: Both bars on Halfway marks (A_half - B_half)
    // 4: Most popular vs Least popular with mixed alignments
    // 5: Combined sum of 2 bars compared to a 3rd bar ((A + B) - C)
    // 6: Additional units needed to make two categories equal
    // 7: Double difference comparison: (A - B) vs (C - D)
    const subType = getRandomInt(1, 7);
    const scaleOptions = [2, 10, 20, 50, 100];
    const scaleStep = scaleOptions[getRandomInt(0, scaleOptions.length - 1)];
    const halfStep = scaleStep / 2;
    const theme = getRandomBarGraphTheme(4);
    const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';
    const colors = getRandomPaletteColors(4);

    if (subType === 1) {
      // Sub-type 1: Higher Halfway bar vs Lower Grid-line bar (A_half - B_line)
      const b1 = getRandomInt(4, 6);
      const b2 = getRandomInt(1, b1 - 1);
      const valA = b1 * scaleStep + halfStep;
      const valB = b2 * scaleStep;
      const valC = (b1 - 1) * scaleStep;
      const valD = (b2 + 1) * scaleStep + halfStep;
      const diff = valA - valB;

      const data = [
        { category: theme.items[0], value: valA, color: colors[0] },
        { category: theme.items[1], value: valB, color: colors[1] },
        { category: theme.items[2], value: valC, color: colors[2] },
        { category: theme.items[3], value: valD, color: colors[3] }
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
          showGridLines: true
        }
      });

      finalAnswer = String(diff);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. How many more ${theme.unit} does ${catA} have than ${catB}?"`;
        const stepsArr = [
          { label: `Value of ${catA}:`, expectedAnswer: String(valA), acceptedAnswers: [] },
          { label: `Value of ${catB}:`, expectedAnswer: String(valB), acceptedAnswers: [] },
          { label: "Write the working equation to find the difference:", expectedAnswer: `${valA} - ${valB} = ${diff}`, acceptedAnswers: getSubtractionAcceptedAnswers(valA, valB, diff) },
          { label: `Difference in ${theme.unit}:`, expectedAnswer: String(diff), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. How many more ${theme.unit} does ${catA} have than ${catB}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(diff + halfStep),
          String(diff - halfStep > 0 ? diff - halfStep : diff + scaleStep),
          String(diff + scaleStep)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. How many more ${theme.unit} does ${catA} have than ${catB}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (subType === 2) {
      // Sub-type 2: Higher Grid-line bar vs Lower Halfway bar (A_line - B_half)
      const b1 = getRandomInt(4, 6);
      const b2 = getRandomInt(1, b1 - 1);
      const valA = b1 * scaleStep;
      const valB = b2 * scaleStep + halfStep;
      const valC = (b1 - 2) * scaleStep + halfStep;
      const valD = (b2 + 1) * scaleStep;
      const diff = valA - valB;

      const data = [
        { category: theme.items[0], value: valA, color: colors[0] },
        { category: theme.items[1], value: valB, color: colors[1] },
        { category: theme.items[2], value: valC, color: colors[2] },
        { category: theme.items[3], value: valD, color: colors[3] }
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
          showGridLines: true
        }
      });

      finalAnswer = String(diff);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. How many fewer ${theme.unit} does ${catB} have than ${catA}?"`;
        const stepsArr = [
          { label: `Value of ${catA}:`, expectedAnswer: String(valA), acceptedAnswers: [] },
          { label: `Value of ${catB}:`, expectedAnswer: String(valB), acceptedAnswers: [] },
          { label: "Write the working equation to find the difference:", expectedAnswer: `${valA} - ${valB} = ${diff}`, acceptedAnswers: getSubtractionAcceptedAnswers(valA, valB, diff) },
          { label: `Difference in ${theme.unit}:`, expectedAnswer: String(diff), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. How many fewer ${theme.unit} does ${catB} have than ${catA}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(diff + halfStep),
          String(diff - halfStep > 0 ? diff - halfStep : diff + scaleStep),
          String(diff + scaleStep)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. How many fewer ${theme.unit} does ${catB} have than ${catA}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (subType === 3) {
      // Sub-type 3: Both bars on Halfway marks (A_half - B_half)
      const b1 = getRandomInt(4, 6);
      const b2 = getRandomInt(1, b1 - 1);
      const valA = b1 * scaleStep + halfStep;
      const valB = b2 * scaleStep + halfStep;
      const valC = (b1 - 1) * scaleStep;
      const valD = (b2 + 1) * scaleStep;
      const diff = valA - valB;

      const data = [
        { category: theme.items[0], value: valA, color: colors[0] },
        { category: theme.items[1], value: valB, color: colors[1] },
        { category: theme.items[2], value: valC, color: colors[2] },
        { category: theme.items[3], value: valD, color: colors[3] }
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
          showGridLines: true
        }
      });

      finalAnswer = String(diff);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. What is the difference in ${theme.unit} between ${catA} and ${catB}?"`;
        const stepsArr = [
          { label: `Value of ${catA}:`, expectedAnswer: String(valA), acceptedAnswers: [] },
          { label: `Value of ${catB}:`, expectedAnswer: String(valB), acceptedAnswers: [] },
          { label: "Write the working equation to find the difference:", expectedAnswer: `${valA} - ${valB} = ${diff}`, acceptedAnswers: getSubtractionAcceptedAnswers(valA, valB, diff) },
          { label: `Difference in ${theme.unit}:`, expectedAnswer: String(diff), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. What is the difference in ${theme.unit} between ${catA} and ${catB}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(diff + halfStep),
          String(diff - halfStep > 0 ? diff - halfStep : diff + scaleStep),
          String(diff + scaleStep)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. What is the difference in ${theme.unit} between ${catA} and ${catB}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (subType === 4) {
      // Sub-type 4: Most popular vs Least popular with mixed alignments
      const bMax = getRandomInt(5, 6);
      const bMin = getRandomInt(1, 2);
      const maxVal = bMax * scaleStep + halfStep;
      const minVal = bMin * scaleStep;
      const midVal1 = (bMin + 1) * scaleStep + halfStep;
      const midVal2 = (bMax - 1) * scaleStep;
      const diff = maxVal - minVal;

      const rawData = [
        { category: theme.items[0], value: maxVal },
        { category: theme.items[1], value: minVal },
        { category: theme.items[2], value: midVal1 },
        { category: theme.items[3], value: midVal2 }
      ];
      const shuffledData = rawData.sort(() => 0.5 - Math.random());
      const data = shuffledData.map((d, i) => ({ ...d, color: colors[i] }));

      let maxCatObj = data[0];
      let minCatObj = data[0];
      for (const d of data) {
        if (d.value > maxCatObj.value) maxCatObj = d;
        if (d.value < minCatObj.value) minCatObj = d;
      }
      const maxCat = maxCatObj.category;
      const minCat = minCatObj.category;

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

      finalAnswer = String(diff);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Find the difference in ${theme.unit} between the category with the most (${maxCat}) and the category with the least (${minCat})."`;
        const stepsArr = [
          { label: `Value of ${maxCat}:`, expectedAnswer: String(maxVal), acceptedAnswers: [] },
          { label: `Value of ${minCat}:`, expectedAnswer: String(minVal), acceptedAnswers: [] },
          { label: "Write the working equation to find the difference:", expectedAnswer: `${maxVal} - ${minVal} = ${diff}`, acceptedAnswers: getSubtractionAcceptedAnswers(maxVal, minVal, diff) },
          { label: `Difference in ${theme.unit}:`, expectedAnswer: String(diff), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. What is the difference in ${theme.unit} between ${maxCat} and ${minCat}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(diff + halfStep),
          String(diff - halfStep > 0 ? diff - halfStep : diff + scaleStep),
          String(diff + scaleStep)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Find the difference in ${theme.unit} between the category with the most (${maxCat}) and the category with the least (${minCat})."`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (subType === 5) {
      // Sub-type 5: Combined sum of 2 bars compared to a 3rd bar ((A + B) - C)
      const b1 = getRandomInt(2, 4);
      const b2 = getRandomInt(2, 3);
      const valA = b1 * scaleStep + halfStep;
      const valB = b2 * scaleStep;
      const sumAB = valA + valB;
      const bC = getRandomInt(2, Math.floor(sumAB / scaleStep) - 1);
      const valC = bC * scaleStep;
      const valD = (b1 + 1) * scaleStep;
      const diff = sumAB - valC;

      const data = [
        { category: theme.items[0], value: valA, color: colors[0] },
        { category: theme.items[1], value: valB, color: colors[1] },
        { category: theme.items[2], value: valC, color: colors[2] },
        { category: theme.items[3], value: valD, color: colors[3] }
      ];
      const catA = data[0].category;
      const catB = data[1].category;
      const catC = data[2].category;

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

      finalAnswer = String(diff);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. How much greater is the combined total of ${catA} and ${catB} than ${catC}?"`;
        const stepsArr = [
          { label: `Write the working equation to find the combined total of ${catA} and ${catB}:`, expectedAnswer: `${valA} + ${valB} = ${sumAB}`, acceptedAnswers: getAdditionAcceptedAnswers(valA, valB, sumAB) },
          { label: `Value of ${catC}:`, expectedAnswer: String(valC), acceptedAnswers: [] },
          { label: "Write the working equation to find how much greater the combined total is:", expectedAnswer: `${sumAB} - ${valC} = ${diff}`, acceptedAnswers: getSubtractionAcceptedAnswers(sumAB, valC, diff) },
          { label: `Difference in ${theme.unit}:`, expectedAnswer: String(diff), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. How much greater is the combined total of ${catA} and ${catB} than ${catC}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(diff + halfStep),
          String(diff - halfStep > 0 ? diff - halfStep : diff + scaleStep),
          String(diff + scaleStep)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. How much greater is the combined total of ${catA} and ${catB} than ${catC}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (subType === 6) {
      // Sub-type 6: Additional units needed to make two categories equal
      const b1 = getRandomInt(4, 6);
      const b2 = getRandomInt(1, b1 - 1);
      const valA = b1 * scaleStep + halfStep;
      const valB = b2 * scaleStep;
      const valC = (b1 - 1) * scaleStep;
      const valD = (b2 + 1) * scaleStep + halfStep;
      const diff = valA - valB;

      const data = [
        { category: theme.items[0], value: valA, color: colors[0] },
        { category: theme.items[1], value: valB, color: colors[1] },
        { category: theme.items[2], value: valC, color: colors[2] },
        { category: theme.items[3], value: valD, color: colors[3] }
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
          showGridLines: true
        }
      });

      finalAnswer = String(diff);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. How many more ${theme.unit} does ${catB} need to have the same amount as ${catA}?"`;
        const stepsArr = [
          { label: `Value of ${catA}:`, expectedAnswer: String(valA), acceptedAnswers: [] },
          { label: `Value of ${catB}:`, expectedAnswer: String(valB), acceptedAnswers: [] },
          { label: `Write the working equation to find how many more ${theme.unit} are needed:`, expectedAnswer: `${valA} - ${valB} = ${diff}`, acceptedAnswers: getSubtractionAcceptedAnswers(valA, valB, diff) },
          { label: `Number of ${theme.unit} needed:`, expectedAnswer: String(diff), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. How many more ${theme.unit} does ${catB} need to have the same amount as ${catA}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(diff + halfStep),
          String(diff - halfStep > 0 ? diff - halfStep : diff + scaleStep),
          String(diff + scaleStep)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. How many more ${theme.unit} does ${catB} need to have the same amount as ${catA}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else {
      // Sub-type 7: Double difference comparison: (A - B) vs (C - D)
      const valA = 5 * scaleStep + halfStep;
      const valB = 2 * scaleStep;
      const valC = 4 * scaleStep;
      const valD = 2 * scaleStep + halfStep;
      const diff1 = valA - valB;
      const diff2 = valC - valD;
      const finalDiff = diff1 - diff2;

      const data = [
        { category: theme.items[0], value: valA, color: colors[0] },
        { category: theme.items[1], value: valB, color: colors[1] },
        { category: theme.items[2], value: valC, color: colors[2] },
        { category: theme.items[3], value: valD, color: colors[3] }
      ];
      const catA = data[0].category;
      const catB = data[1].category;
      const catC = data[2].category;
      const catD = data[3].category;

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

      finalAnswer = String(finalDiff);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. How much greater is the difference between ${catA} and ${catB} than the difference between ${catC} and ${catD}?"`;
        const stepsArr = [
          { label: `Difference between ${catA} and ${catB}:`, expectedAnswer: String(diff1), acceptedAnswers: getSubtractionAcceptedAnswers(valA, valB, diff1) },
          { label: `Difference between ${catC} and ${catD}:`, expectedAnswer: String(diff2), acceptedAnswers: getSubtractionAcceptedAnswers(valC, valD, diff2) },
          { label: "Write the working equation to compare the two differences:", expectedAnswer: `${diff1} - ${diff2} = ${finalDiff}`, acceptedAnswers: getSubtractionAcceptedAnswers(diff1, diff2, finalDiff) },
          { label: `Final difference in ${theme.unit}:`, expectedAnswer: String(finalDiff), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. How much greater is the difference between ${catA} and ${catB} than the difference between ${catC} and ${catD}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(finalDiff + halfStep),
          String(finalDiff - halfStep > 0 ? finalDiff - halfStep : finalDiff + scaleStep),
          String(finalDiff + scaleStep)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. How much greater is the difference between ${catA} and ${catB} than the difference between ${catC} and ${catD}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }
    }

  // --------------------------------------------------------------------------
  // Variant 9: Total Sum (Mixed Alignments: 2, 3, 4 bars forward & backward)
  // --------------------------------------------------------------------------
  } else if (variant === 'standard_total_sum_mixed_alignments') {
    // Sub-types:
    // 1: Forward sum of 2 bars (mixed alignments)
    // 2: Forward sum of 3 bars (mixed alignments)
    // 3: Forward sum of 4 bars (grand total with mixed alignments)
    // 4: Backward to missing bar (from 3-category total)
    // 5: Backward to missing bar (from 4-category grand total)
    // 6: Backward to missing scale (from 2 halfway bars combining to integer blocks)
    // 7: Backward to missing scale (from 3 mixed-alignment bars)
    const subType = getRandomInt(1, 7);
    const scaleOptions = [2, 10, 20, 50, 100];
    const scaleStep = scaleOptions[getRandomInt(0, scaleOptions.length - 1)];
    const halfStep = scaleStep / 2;
    const theme = getRandomBarGraphTheme(4);
    const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';
    const colors = getRandomPaletteColors(4);

    if (subType === 1) {
      // Sub-type 1: Forward sum of 2 categories (mixed alignments)
      const b1 = getRandomInt(3, 5);
      const b2 = getRandomInt(2, 4);
      const valA = b1 * scaleStep + halfStep;
      const valB = b2 * scaleStep;
      const valC = (b1 - 1) * scaleStep;
      const valD = (b2 + 1) * scaleStep + halfStep;
      const total = valA + valB;

      const data = [
        { category: theme.items[0], value: valA, color: colors[0] },
        { category: theme.items[1], value: valB, color: colors[1] },
        { category: theme.items[2], value: valC, color: colors[2] },
        { category: theme.items[3], value: valD, color: colors[3] }
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
          showGridLines: true
        }
      });

      finalAnswer = String(total);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Find the total number of ${theme.unit} for ${catA} and ${catB} combined."`;
        const stepsArr = [
          { label: `Value of ${catA}:`, expectedAnswer: String(valA), acceptedAnswers: [] },
          { label: `Value of ${catB}:`, expectedAnswer: String(valB), acceptedAnswers: [] },
          { label: "Write the working equation to find the total:", expectedAnswer: `${valA} + ${valB} = ${total}`, acceptedAnswers: getAdditionAcceptedAnswers(valA, valB, total) },
          { label: `Total ${theme.unit}:`, expectedAnswer: String(total), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. What is the total number of ${theme.unit} for ${catA} and ${catB} combined?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(total + halfStep),
          String(total - halfStep > 0 ? total - halfStep : total + scaleStep * 2),
          String(total + scaleStep)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. What is the total number of ${theme.unit} for ${catA} and ${catB} combined?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (subType === 2) {
      // Sub-type 2: Forward sum of 3 categories (mixed alignments)
      const b1 = getRandomInt(2, 4);
      const b2 = getRandomInt(3, 5);
      const b3 = getRandomInt(1, 3);
      const valA = b1 * scaleStep + halfStep;
      const valB = b2 * scaleStep;
      const valC = b3 * scaleStep + halfStep;
      const valD = 4 * scaleStep;
      const total = valA + valB + valC;

      const data = [
        { category: theme.items[0], value: valA, color: colors[0] },
        { category: theme.items[1], value: valB, color: colors[1] },
        { category: theme.items[2], value: valC, color: colors[2] },
        { category: theme.items[3], value: valD, color: colors[3] }
      ];
      const catA = data[0].category;
      const catB = data[1].category;
      const catC = data[2].category;

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

      finalAnswer = String(total);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Find the total number of ${theme.unit} for ${catA}, ${catB}, and ${catC} combined."`;
        const stepsArr = [
          { label: `Value of ${catA}:`, expectedAnswer: String(valA), acceptedAnswers: [] },
          { label: `Value of ${catB}:`, expectedAnswer: String(valB), acceptedAnswers: [] },
          { label: `Value of ${catC}:`, expectedAnswer: String(valC), acceptedAnswers: [] },
          { label: "Write the working equation to find the total:", expectedAnswer: `${valA} + ${valB} + ${valC} = ${total}`, acceptedAnswers: getThreeTermAdditionAcceptedAnswers(valA, valB, valC, total) },
          { label: `Total ${theme.unit}:`, expectedAnswer: String(total), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. What is the total number of ${theme.unit} for ${catA}, ${catB}, and ${catC} combined?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(total + halfStep),
          String(total - halfStep > 0 ? total - halfStep : total + scaleStep * 2),
          String(total + scaleStep)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. What is the total number of ${theme.unit} for ${catA}, ${catB}, and ${catC} combined?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (subType === 3) {
      // Sub-type 3: Forward sum of all 4 categories (Grand Total with mixed alignments)
      const b1 = getRandomInt(2, 4);
      const b2 = getRandomInt(1, 3);
      const b3 = getRandomInt(2, 3);
      const b4 = getRandomInt(3, 5);
      const valA = b1 * scaleStep + halfStep;
      const valB = b2 * scaleStep;
      const valC = b3 * scaleStep + halfStep;
      const valD = b4 * scaleStep;
      const sumAB = valA + valB;
      const sumCD = valC + valD;
      const total = sumAB + sumCD;

      const data = [
        { category: theme.items[0], value: valA, color: colors[0] },
        { category: theme.items[1], value: valB, color: colors[1] },
        { category: theme.items[2], value: valC, color: colors[2] },
        { category: theme.items[3], value: valD, color: colors[3] }
      ];
      const catA = data[0].category;
      const catB = data[1].category;
      const catC = data[2].category;
      const catD = data[3].category;

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

      finalAnswer = String(total);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. What is the grand total number of ${theme.unit} across all 4 categories?"`;
        const stepsArr = [
          { label: `Combined total of ${catA} and ${catB}:`, expectedAnswer: String(sumAB), acceptedAnswers: getAdditionAcceptedAnswers(valA, valB, sumAB) },
          { label: `Combined total of ${catC} and ${catD}:`, expectedAnswer: String(sumCD), acceptedAnswers: getAdditionAcceptedAnswers(valC, valD, sumCD) },
          { label: "Write the working equation to find the grand total:", expectedAnswer: `${sumAB} + ${sumCD} = ${total}`, acceptedAnswers: [...getAdditionAcceptedAnswers(sumAB, sumCD, total), `${valA} + ${valB} + ${valC} + ${valD} = ${total}`, `${valA}+${valB}+${valC}+${valD}=${total}`] },
          { label: `Grand total ${theme.unit}:`, expectedAnswer: String(total), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. What is the grand total number of ${theme.unit} across all 4 categories?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(total + scaleStep),
          String(total - scaleStep > 0 ? total - scaleStep : total + scaleStep * 2),
          String(total + halfStep)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. What is the grand total number of ${theme.unit} across all 4 categories?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (subType === 4) {
      // Sub-type 4: Backward to missing bar (from 3-category total)
      const b1 = getRandomInt(2, 4);
      const b2 = getRandomInt(3, 5);
      const b3 = getRandomInt(2, 4);
      const valA = b1 * scaleStep + halfStep;
      const valB = b2 * scaleStep;
      const valC = b3 * scaleStep + halfStep;
      const sumAB = valA + valB;
      const total = sumAB + valC;

      // On graph, Cat C bar has not been drawn (value: 0)
      const data = [
        { category: theme.items[0], value: valA, color: colors[0] },
        { category: theme.items[1], value: valB, color: colors[1] },
        { category: theme.items[2], value: 0, color: colors[2] }
      ];
      const catA = data[0].category;
      const catB = data[1].category;
      const catC = data[2].category;

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

      finalAnswer = String(valC);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the bar for ${catC} was not drawn. The combined total for ${catA}, ${catB}, and ${catC} is ${total} ${theme.unit}. How many ${theme.unit} should there be for ${catC}?"`;
        const stepsArr = [
          { label: `Write the working equation to find the combined total of ${catA} and ${catB}:`, expectedAnswer: `${valA} + ${valB} = ${sumAB}`, acceptedAnswers: getAdditionAcceptedAnswers(valA, valB, sumAB) },
          { label: `Write the working equation to find the value of ${catC}:`, expectedAnswer: `${total} - ${sumAB} = ${valC}`, acceptedAnswers: getSubtractionAcceptedAnswers(total, sumAB, valC) },
          { label: `Value of ${catC}:`, expectedAnswer: String(valC), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the bar for ${catC} was not drawn. The combined total for ${catA}, ${catB}, and ${catC} is ${total} ${theme.unit}. How many ${theme.unit} should there be for ${catC}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(valC + halfStep),
          String(valC - halfStep > 0 ? valC - halfStep : valC + scaleStep),
          String(valC + scaleStep)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the bar for ${catC} was not drawn. The combined total for ${catA}, ${catB}, and ${catC} is ${total} ${theme.unit}. How many ${theme.unit} should there be for ${catC}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (subType === 5) {
      // Sub-type 5: Backward to missing bar (from 4-category grand total)
      const b1 = getRandomInt(2, 4);
      const b2 = getRandomInt(2, 4);
      const b3 = getRandomInt(1, 3);
      const b4 = getRandomInt(3, 5);
      const valA = b1 * scaleStep + halfStep;
      const valB = b2 * scaleStep;
      const valC = b3 * scaleStep + halfStep;
      const valD = b4 * scaleStep;
      const sumKnown = valA + valB + valC;
      const grandTotal = sumKnown + valD;

      // On graph, Cat D bar is left out (value: 0)
      const data = [
        { category: theme.items[0], value: valA, color: colors[0] },
        { category: theme.items[1], value: valB, color: colors[1] },
        { category: theme.items[2], value: valC, color: colors[2] },
        { category: theme.items[3], value: 0, color: colors[3] }
      ];
      const catA = data[0].category;
      const catB = data[1].category;
      const catC = data[2].category;
      const catD = data[3].category;

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

      finalAnswer = String(valD);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the bar for ${catD} is missing. The grand total across all 4 categories is ${grandTotal} ${theme.unit}. How many ${theme.unit} should the bar for ${catD} represent?"`;
        const stepsArr = [
          { label: `Write the working equation to find the combined total of ${catA}, ${catB}, and ${catC}:`, expectedAnswer: `${valA} + ${valB} + ${valC} = ${sumKnown}`, acceptedAnswers: getThreeTermAdditionAcceptedAnswers(valA, valB, valC, sumKnown) },
          { label: `Write the working equation to find the missing value of ${catD}:`, expectedAnswer: `${grandTotal} - ${sumKnown} = ${valD}`, acceptedAnswers: getSubtractionAcceptedAnswers(grandTotal, sumKnown, valD) },
          { label: `Value of ${catD}:`, expectedAnswer: String(valD), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the bar for ${catD} is missing. The grand total across all 4 categories is ${grandTotal} ${theme.unit}. How many ${theme.unit} should the bar for ${catD} represent?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(valD + scaleStep),
          String(valD - scaleStep > 0 ? valD - scaleStep : valD + scaleStep * 2),
          String(valD + halfStep)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the bar for ${catD} is missing. The grand total across all 4 categories is ${grandTotal} ${theme.unit}. How many ${theme.unit} should the bar for ${catD} represent?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (subType === 6) {
      // Sub-type 6: Backward to missing scale (from 2 halfway bars combining to integer blocks)
      const b1 = getRandomInt(2, 4);
      const b2 = getRandomInt(1, 3);
      const valA = b1 * scaleStep + halfStep;
      const valB = b2 * scaleStep + halfStep;
      const totalBlocks = b1 + b2 + 1; // (b1 + 0.5) + (b2 + 0.5)
      const total = totalBlocks * scaleStep;

      const data = [
        { category: theme.items[0], value: valA, color: colors[0] },
        { category: theme.items[1], value: valB, color: colors[1] },
        { category: theme.items[2], value: (b1 + 1) * scaleStep, color: colors[2] }
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

      finalAnswer = String(scaleStep);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${catA} is ${b1} and a half grid blocks long, and the bar for ${catB} is ${b2} and a half grid blocks long. Their combined total is ${total} ${theme.unit}. Determine the value of 1 grid interval on the scale."`;
        const stepsArr = [
          { label: `Total number of grid intervals for ${catA} and ${catB}:`, expectedAnswer: String(totalBlocks), acceptedAnswers: [] },
          { label: "Write the working equation to find the value of 1 grid interval:", expectedAnswer: `${total} ÷ ${totalBlocks} = ${scaleStep}`, acceptedAnswers: getDivisionAcceptedAnswers(total, totalBlocks, scaleStep) },
          { label: "Value of 1 grid interval:", expectedAnswer: String(scaleStep), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${catA} is ${b1} and a half blocks, and ${catB} is ${b2} and a half blocks. Their combined total is ${total} ${theme.unit}. What is the value of 1 grid interval?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(scaleStep * 2),
          String(Math.max(1, Math.floor(scaleStep / 2))),
          String(scaleStep + 5)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${catA} is ${b1} and a half blocks, and ${catB} is ${b2} and a half blocks. Their combined total is ${total} ${theme.unit}. What is the value of 1 grid interval on the scale?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else {
      // Sub-type 7: Backward to missing scale (from 3 mixed-alignment bars)
      const b1 = getRandomInt(2, 3);
      const b2 = getRandomInt(2, 4);
      const b3 = getRandomInt(1, 2);
      const valA = b1 * scaleStep + halfStep;
      const valB = b2 * scaleStep;
      const valC = b3 * scaleStep + halfStep;
      const totalBlocks = b1 + b2 + b3 + 1; // (b1 + 0.5) + b2 + (b3 + 0.5)
      const total = totalBlocks * scaleStep;

      const data = [
        { category: theme.items[0], value: valA, color: colors[0] },
        { category: theme.items[1], value: valB, color: colors[1] },
        { category: theme.items[2], value: valC, color: colors[2] }
      ];
      const catA = data[0].category;
      const catB = data[1].category;
      const catC = data[2].category;

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

      finalAnswer = String(scaleStep);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${catA} is ${b1} and a half blocks, ${catB} is ${b2} blocks, and ${catC} is ${b3} and a half blocks. Their combined total is ${total} ${theme.unit}. Determine the value of 1 grid interval on the scale."`;
        const stepsArr = [
          { label: `Total number of grid intervals for ${catA}, ${catB}, and ${catC}:`, expectedAnswer: String(totalBlocks), acceptedAnswers: [] },
          { label: "Write the working equation to find the value of 1 grid interval:", expectedAnswer: `${total} ÷ ${totalBlocks} = ${scaleStep}`, acceptedAnswers: getDivisionAcceptedAnswers(total, totalBlocks, scaleStep) },
          { label: "Value of 1 grid interval:", expectedAnswer: String(scaleStep), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${catA} is ${b1} and a half blocks, ${catB} is ${b2} blocks, and ${catC} is ${b3} and a half blocks. Their combined total is ${total} ${theme.unit}. What is the value of 1 grid interval?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(scaleStep * 2),
          String(Math.max(1, Math.floor(scaleStep / 2))),
          String(scaleStep + 5)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${catA} is ${b1} and a half blocks, ${catB} is ${b2} blocks, and ${catC} is ${b3} and a half blocks. Their combined total is ${total} ${theme.unit}. What is the value of 1 grid interval on the scale?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }
    }

  // --------------------------------------------------------------------------
  // Variant 10: Scale Error Correction (Translating Blocks to New Scale)
  // --------------------------------------------------------------------------
  } else {
    // Sub-types:
    // 1: Scale correction for 1 single bar
    // 2: Scale correction for combined total of 2 bars
    // 3: Scale correction for grand total of all 4 bars
    // 4: Difference caused by scale error (valNew - valOrig)
    // 5: Work backward from missing scale -> work forward to new scale (1 bar)
    // 6: Work backward from missing scale -> work forward to new scale total of 2 bars
    // 7: Correcting halfway marks to a new scale
    const subType = getRandomInt(1, 7);

    const scalePairs = [
      [2, 5],
      [2, 10],
      [5, 10],
      [5, 20],
      [10, 20],
      [10, 50],
      [20, 50],
      [50, 100]
    ];
    const pair = scalePairs[getRandomInt(0, scalePairs.length - 1)];
    const scaleOrig = pair[0];
    const scaleNew = pair[1];

    const theme = getRandomBarGraphTheme(4);
    const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';
    const colors = getRandomPaletteColors(4);

    if (subType === 1) {
      // Sub-type 1: Scale correction for 1 single bar
      const blocks = [getRandomInt(4, 7), getRandomInt(2, 4), getRandomInt(3, 5), getRandomInt(2, 6)];
      const data = theme.items.slice(0, 4).map((cat, idx) => ({
        category: cat,
        value: blocks[idx] * scaleOrig,
        color: colors[idx]
      }));
      const catA = data[0].category;
      const bA = blocks[0];
      const valOrig = bA * scaleOrig;
      const valNew = bA * scaleNew;

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

      finalAnswer = String(valNew);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()} with a scale of ${scaleOrig} ${theme.unit} per grid block. If the scale is corrected so that each grid block represents ${scaleNew} ${theme.unit}, what is the correct value for ${catA}?"`;
        const stepsArr = [
          { label: `Number of grid blocks for ${catA}:`, expectedAnswer: String(bA), acceptedAnswers: [] },
          { label: `Write the working equation to find the corrected value for ${catA}:`, expectedAnswer: `${bA} × ${scaleNew} = ${valNew}`, acceptedAnswers: getMultiplicationAcceptedAnswers(bA, scaleNew, valNew) },
          { label: `Corrected value for ${catA}:`, expectedAnswer: String(valNew), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows ${theme.title.toLowerCase()} where 1 grid block represents ${scaleOrig} ${theme.unit}. If 1 grid block is changed to represent ${scaleNew} ${theme.unit}, what is the new value for ${catA}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(valOrig),
          String(valNew - scaleNew),
          String(bA * (scaleOrig + scaleNew))
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows ${theme.title.toLowerCase()} with a scale step of ${scaleOrig}. If each grid block is corrected to represent ${scaleNew} ${theme.unit}, what is the corrected value for ${catA}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (subType === 2) {
      // Sub-type 2: Scale correction for combined total of 2 bars
      const blocks = [getRandomInt(3, 5), getRandomInt(2, 4), getRandomInt(3, 6), getRandomInt(2, 5)];
      const data = theme.items.slice(0, 4).map((cat, idx) => ({
        category: cat,
        value: blocks[idx] * scaleOrig,
        color: colors[idx]
      }));
      const catA = data[0].category;
      const bA = blocks[0];
      const catB = data[1].category;
      const bB = blocks[1];
      const totalBlocks = bA + bB;
      const newTotal = totalBlocks * scaleNew;

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

      finalAnswer = String(newTotal);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()} drawn with a scale step of ${scaleOrig}. If each grid block is re-scaled to represent ${scaleNew} ${theme.unit}, what is the new combined total for ${catA} and ${catB}?"`;
        const stepsArr = [
          { label: `Total number of grid blocks for ${catA} and ${catB}:`, expectedAnswer: String(totalBlocks), acceptedAnswers: getAdditionAcceptedAnswers(bA, bB, totalBlocks) },
          { label: "Write the working equation to find the new combined total:", expectedAnswer: `${totalBlocks} × ${scaleNew} = ${newTotal}`, acceptedAnswers: getMultiplicationAcceptedAnswers(totalBlocks, scaleNew, newTotal) },
          { label: `New combined total for ${catA} and ${catB}:`, expectedAnswer: String(newTotal), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()} with scale step ${scaleOrig}. If each block represents ${scaleNew} ${theme.unit} instead, what is the new combined total for ${catA} and ${catB}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(totalBlocks * scaleOrig),
          String(newTotal - scaleNew),
          String(newTotal + scaleNew)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()} with a scale step of ${scaleOrig}. If each grid block is re-scaled to represent ${scaleNew} ${theme.unit}, what is the new combined total for ${catA} and ${catB}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (subType === 3) {
      // Sub-type 3: Scale correction for grand total of all 4 bars
      const blocks = [getRandomInt(2, 4), getRandomInt(3, 5), getRandomInt(2, 4), getRandomInt(3, 5)];
      const data = theme.items.slice(0, 4).map((cat, idx) => ({
        category: cat,
        value: blocks[idx] * scaleOrig,
        color: colors[idx]
      }));
      const totalBlocks = blocks[0] + blocks[1] + blocks[2] + blocks[3];
      const newGrandTotal = totalBlocks * scaleNew;

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

      finalAnswer = String(newGrandTotal);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()} using a scale of ${scaleOrig} ${theme.unit} per grid block. If the graph is corrected to use a scale of ${scaleNew} ${theme.unit} per grid block, what is the correct grand total for all 4 categories?"`;
        const stepsArr = [
          { label: "Total number of grid blocks across all 4 categories:", expectedAnswer: String(totalBlocks), acceptedAnswers: [] },
          { label: "Write the working equation to find the corrected grand total:", expectedAnswer: `${totalBlocks} × ${scaleNew} = ${newGrandTotal}`, acceptedAnswers: getMultiplicationAcceptedAnswers(totalBlocks, scaleNew, newGrandTotal) },
          { label: `Corrected grand total ${theme.unit}:`, expectedAnswer: String(newGrandTotal), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows ${theme.title.toLowerCase()} with 1 block = ${scaleOrig} units. If corrected so that 1 block = ${scaleNew} units, what is the grand total across all 4 categories?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(totalBlocks * scaleOrig),
          String(newGrandTotal - scaleNew * 2),
          String(newGrandTotal + scaleNew)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()} using a scale of ${scaleOrig} ${theme.unit} per grid block. If the graph is corrected to use a scale of ${scaleNew} ${theme.unit} per grid block, what is the correct grand total for all 4 categories?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (subType === 4) {
      // Sub-type 4: Difference caused by scale error (valNew - valOrig)
      const blocks = [getRandomInt(4, 7), getRandomInt(2, 4), getRandomInt(3, 5), getRandomInt(2, 5)];
      const data = theme.items.slice(0, 4).map((cat, idx) => ({
        category: cat,
        value: blocks[idx] * scaleOrig,
        color: colors[idx]
      }));
      const catA = data[0].category;
      const bA = blocks[0];
      const valOrig = bA * scaleOrig;
      const valNew = bA * scaleNew;
      const diff = valNew - valOrig;

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

      finalAnswer = String(diff);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()} with a scale step of ${scaleOrig}. A pupil mistakenly used this scale instead of the correct scale step of ${scaleNew}. How much greater is the correct value for ${catA} than the value shown on the graph?"`;
        const stepsArr = [
          { label: `Value of ${catA} shown on the graph:`, expectedAnswer: String(valOrig), acceptedAnswers: [] },
          { label: `Correct value of ${catA} with the new scale:`, expectedAnswer: String(valNew), acceptedAnswers: getMultiplicationAcceptedAnswers(bA, scaleNew, valNew) },
          { label: "Write the working equation to find the difference:", expectedAnswer: `${valNew} - ${valOrig} = ${diff}`, acceptedAnswers: getSubtractionAcceptedAnswers(valNew, valOrig, diff) },
          { label: `Difference in ${theme.unit}:`, expectedAnswer: String(diff), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A pupil mistakenly used scale ${scaleOrig} instead of ${scaleNew} for ${catA}. How much greater is the correct value of ${catA} than the value shown on the graph?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(valNew),
          String(valOrig),
          String(diff + scaleOrig)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()} with a scale step of ${scaleOrig}. A pupil mistakenly used this scale instead of the correct scale step of ${scaleNew}. How much greater is the correct value for ${catA} than the value shown on the graph?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (subType === 5) {
      // Sub-type 5: Backward from missing scale -> forward to new scale (1 bar)
      const blocks = [getRandomInt(4, 6), getRandomInt(2, 4), getRandomInt(3, 5), getRandomInt(2, 5)];
      const bA = blocks[0];
      const valOrig = bA * scaleOrig;
      const bB = blocks[1];
      const valNewB = bB * scaleNew;

      const data = theme.items.slice(0, 4).map((cat, idx) => ({
        category: cat,
        value: blocks[idx] * scaleOrig,
        color: colors[idx]
      }));
      const catA = data[0].category;
      const catB = data[1].category;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep: scaleOrig,
          orientation,
          showGridLines: true,
          showScaleNumbers: false
        }
      });

      finalAnswer = String(valNewB);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${catA} (${bA} grid blocks) represents ${valOrig} ${theme.unit}. If each grid block is re-scaled to represent ${scaleNew} ${theme.unit} instead, what will be the new value of ${catB}?"`;
        const stepsArr = [
          { label: "Write the working equation to find the original value of 1 grid block:", expectedAnswer: `${valOrig} ÷ ${bA} = ${scaleOrig}`, acceptedAnswers: getDivisionAcceptedAnswers(valOrig, bA, scaleOrig) },
          { label: `Number of grid blocks for ${catB}:`, expectedAnswer: String(bB), acceptedAnswers: [] },
          { label: `Write the working equation to find the new value of ${catB}:`, expectedAnswer: `${bB} × ${scaleNew} = ${valNewB}`, acceptedAnswers: getMultiplicationAcceptedAnswers(bB, scaleNew, valNewB) },
          { label: `New value of ${catB}:`, expectedAnswer: String(valNewB), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers are missing. ${catA} (${bA} blocks) has ${valOrig} ${theme.unit}. If each block is re-scaled to represent ${scaleNew} ${theme.unit}, what is the new value of ${catB} (${bB} blocks)?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(bB * scaleOrig),
          String(valNewB - scaleNew),
          String(valNewB + scaleNew)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${catA} (${bA} grid blocks) represents ${valOrig} ${theme.unit}. If each grid block is re-scaled to represent ${scaleNew} ${theme.unit} instead, what will be the new value of ${catB}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else if (subType === 6) {
      // Sub-type 6: Backward from missing scale -> forward to new scale total of 2 bars
      const blocks = [getRandomInt(4, 6), getRandomInt(2, 4), getRandomInt(3, 5), getRandomInt(2, 4)];
      const b1 = blocks[0];
      const valOrig = b1 * scaleOrig;
      const b2 = blocks[1];
      const b3 = blocks[2];
      const blocks23 = b2 + b3;
      const newTotal23 = blocks23 * scaleNew;

      const data = theme.items.slice(0, 4).map((cat, idx) => ({
        category: cat,
        value: blocks[idx] * scaleOrig,
        color: colors[idx]
      }));
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
          scaleStep: scaleOrig,
          orientation,
          showGridLines: true,
          showScaleNumbers: false
        }
      });

      finalAnswer = String(newTotal23);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${cat1} (${b1} grid blocks) represents ${valOrig} ${theme.unit}. If the graph is updated so that 1 grid block stands for ${scaleNew} ${theme.unit}, what is the new combined total for ${cat2} and ${cat3}?"`;
        const stepsArr = [
          { label: "Write the working equation to find the original value of 1 grid block:", expectedAnswer: `${valOrig} ÷ ${b1} = ${scaleOrig}`, acceptedAnswers: getDivisionAcceptedAnswers(valOrig, b1, scaleOrig) },
          { label: `Total number of grid blocks for ${cat2} and ${cat3}:`, expectedAnswer: String(blocks23), acceptedAnswers: getAdditionAcceptedAnswers(b2, b3, blocks23) },
          { label: `Write the working equation to find the new combined total for ${cat2} and ${cat3}:`, expectedAnswer: `${blocks23} × ${scaleNew} = ${newTotal23}`, acceptedAnswers: getMultiplicationAcceptedAnswers(blocks23, scaleNew, newTotal23) },
          { label: `New combined total for ${cat2} and ${cat3}:`, expectedAnswer: String(newTotal23), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers are missing. ${cat1} (${b1} blocks) has ${valOrig} ${theme.unit}. If 1 block stands for ${scaleNew} ${theme.unit}, what is the new combined total for ${cat2} and ${cat3}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(blocks23 * scaleOrig),
          String(newTotal23 - scaleNew),
          String(newTotal23 + scaleNew)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The bar for ${cat1} (${b1} grid blocks) represents ${valOrig} ${theme.unit}. If the graph is updated so that 1 grid block stands for ${scaleNew} ${theme.unit}, what is the new combined total for ${cat2} and ${cat3}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }

    } else {
      // Sub-type 7: Correcting halfway marks to a new scale
      const pair7 = [[2, 10], [10, 20], [10, 50], [20, 50], [50, 100]][getRandomInt(0, 4)];
      const sOrig = pair7[0];
      const sNew = pair7[1];
      const halfOrig = sOrig / 2;
      const halfNew = sNew / 2;

      const bA = getRandomInt(3, 5);
      const valOrig = bA * sOrig + halfOrig;
      const valNew = bA * sNew + halfNew;

      const data = [
        { category: theme.items[0], value: valOrig, color: colors[0] },
        { category: theme.items[1], value: 2 * sOrig, color: colors[1] },
        { category: theme.items[2], value: (bA - 1) * sOrig, color: colors[2] },
        { category: theme.items[3], value: (bA + 1) * sOrig, color: colors[3] }
      ];
      const catA = data[0].category;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep: sOrig,
          orientation,
          showGridLines: true
        }
      });

      finalAnswer = String(valNew);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()} with a scale step of ${sOrig}. The bar for ${catA} stops halfway between two grid lines (${bA} and a half intervals). If the scale is changed so that 1 grid interval represents ${sNew} ${theme.unit}, what is the new value for ${catA}?"`;
        const stepsArr = [
          { label: `Value of ${bA} whole grid intervals with the new scale:`, expectedAnswer: String(bA * sNew), acceptedAnswers: getMultiplicationAcceptedAnswers(bA, sNew, bA * sNew) },
          { label: `Half of the new grid interval (${sNew} ÷ 2):`, expectedAnswer: String(halfNew), acceptedAnswers: getDivisionAcceptedAnswers(sNew, 2, halfNew) },
          { label: `Write the working equation to find the new value for ${catA}:`, expectedAnswer: `${bA * sNew} + ${halfNew} = ${valNew}`, acceptedAnswers: getAdditionAcceptedAnswers(bA * sNew, halfNew, valNew) },
          { label: `New value for ${catA}:`, expectedAnswer: String(valNew), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar for ${catA} is ${bA} and a half intervals long. If 1 grid interval is changed from ${sOrig} to ${sNew} ${theme.unit}, what is the new value for ${catA}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        const opts = getFourOptions(finalAnswer, [
          String(valOrig),
          String(valNew - sNew),
          String(valNew + sNew)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()} with a scale step of ${sOrig}. The bar for ${catA} stops halfway between two grid lines (${bA} and a half intervals). If the scale is changed so that 1 grid interval represents ${sNew} ${theme.unit}, what is the new value for ${catA}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      }
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
