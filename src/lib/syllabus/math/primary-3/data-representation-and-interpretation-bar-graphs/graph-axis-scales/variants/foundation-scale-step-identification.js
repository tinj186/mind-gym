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

export function generateFoundationScaleStepIdentification({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

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

  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
