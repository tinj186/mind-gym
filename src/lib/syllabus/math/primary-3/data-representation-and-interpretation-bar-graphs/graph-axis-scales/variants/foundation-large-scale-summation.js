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

export function generateFoundationLargeScaleSummation({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

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

  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
