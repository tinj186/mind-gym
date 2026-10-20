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

export function generateFoundationGridBlockMultiplication({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

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

  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
