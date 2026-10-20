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

export function generateFoundationScaleVerificationDifference({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

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

  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
