import {
  getRandomBarGraphTheme,
  getRandomNames,
  getRandomPaletteColors,
  getRandomFinancialTheme,
  getRandomEqualizingTheme,
  getRandomTargetShortfallTheme,
  getSingularUnit
} from '../../../../../../utils/variable-bank.js';

import {
  getRandomInt,
  getFourOptions,
  getMultiplicationAcceptedAnswers,
  getDivisionAcceptedAnswers,
  getAdditionAcceptedAnswers,
  getSubtractionAcceptedAnswers,
  getThreeTermAdditionAcceptedAnswers,
  getThreeAdditionAcceptedAnswers,
  getDifferenceAcceptedAnswers,
  getSumAcceptedAnswers,
  getThreeTermSumAcceptedAnswers,
  getCombinedAddSubAcceptedAnswers,
  getSubSubAcceptedAnswers,
  getTwoPairsDiffAcceptedAnswers,
  getFourTermAdditionAcceptedAnswers,
  getTwoPairSumAcceptedAnswers
} from '../helpers.js';

export function generateStandardInterpolatingHalfwayMarks({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

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


  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
