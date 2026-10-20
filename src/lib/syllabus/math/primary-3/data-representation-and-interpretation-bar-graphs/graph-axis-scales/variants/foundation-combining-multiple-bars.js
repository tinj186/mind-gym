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

export function generateFoundationCombiningMultipleBars({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

    // foundation_combining_multiple_bars
    // Sub-types:
    // 1: Forward Grand Total (All 4 categories combined: A + B + C + D)
    // 2: Forward 3-Bar Combined Sum (A + B + C)
    // 3: Forward Pairwise Grouped Sum ((A + B) + (C + D))
    // 4: Missing Bar from 4-Category Grand Total (Given grand total, deduce missing bar)
    // 5: Missing Bar from 3-Category Total (Given total of 3 categories, deduce missing bar)
    // 6: Reverse 3-Bars Combined Sum (Blank axis, given total of 3 bars, deduce scale step)
    // 7: Reverse Grand Total of All 4 Bars (Blank axis, given grand total, deduce scale step)
    const subType = getRandomInt(1, 7);
    const scaleOptions = [2, 5, 10];
    const scaleStep = scaleOptions[getRandomInt(0, scaleOptions.length - 1)];
    const theme = getRandomBarGraphTheme(4);
    const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';

    const multiplierPool = [2, 3, 4, 5, 6, 7];
    const shuffledMultipliers = multiplierPool.sort(() => 0.5 - Math.random()).slice(0, 4);
    const colors = getRandomPaletteColors(4);
    const data = theme.items.slice(0, 4).map((cat, idx) => ({
      category: cat,
      value: shuffledMultipliers[idx] * scaleStep,
      color: colors[idx]
    }));

    const c1 = data[0].category;
    const v1 = data[0].value;
    const b1 = shuffledMultipliers[0];
    const c2 = data[1].category;
    const v2 = data[1].value;
    const b2 = shuffledMultipliers[1];
    const c3 = data[2].category;
    const v3 = data[2].value;
    const b3 = shuffledMultipliers[2];
    const c4 = data[3].category;
    const v4 = data[3].value;
    const b4 = shuffledMultipliers[3];

    if (subType === 1) {
      // Forward Grand Total (All 4 categories: A + B + C + D)
      const total = v1 + v2 + v3 + v4;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Find the total number of ${theme.unit} for all 4 categories combined."`;
        const stepsArr = [
          { label: `Value of ${c1}:`, expectedAnswer: String(v1), acceptedAnswers: [] },
          { label: `Value of ${c2}:`, expectedAnswer: String(v2), acceptedAnswers: [] },
          { label: `Value of ${c3}:`, expectedAnswer: String(v3), acceptedAnswers: [] },
          { label: `Value of ${c4}:`, expectedAnswer: String(v4), acceptedAnswers: [] },
          { label: `Grand total combined:`, expectedAnswer: String(total), acceptedAnswers: getFourTermAdditionAcceptedAnswers(v1, v2, v3, v4, total) }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(total);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, what is the total number of ${theme.unit} for all 4 categories combined?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(total);
        const opts = getFourOptions(finalAnswer, [
          String(total + scaleStep),
          String(total - scaleStep > 0 ? total - scaleStep : total + scaleStep * 2),
          String(total + scaleStep * 2)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. What is the total number of ${theme.unit} for all 4 categories combined?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(total);
      }

    } else if (subType === 2) {
      // Forward 3-Bar Combined Sum (A + B + C)
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
      // Forward Pairwise Grouped Sum ((A + B) + (C + D))
      const sum12 = v1 + v2;
      const sum34 = v3 + v4;
      const total = sum12 + sum34;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. Calculate the combined total for (${c1} and ${c2}) and (${c3} and ${c4}), and find the grand total."`;
        const stepsArr = [
          { label: `Total for ${c1} and ${c2}:`, expectedAnswer: String(sum12), acceptedAnswers: getAdditionAcceptedAnswers(v1, v2, sum12) },
          { label: `Total for ${c3} and ${c4}:`, expectedAnswer: String(sum34), acceptedAnswers: getAdditionAcceptedAnswers(v3, v4, sum34) },
          { label: `Total for all 4 categories combined:`, expectedAnswer: String(total), acceptedAnswers: getTwoPairSumAcceptedAnswers(sum12, sum34, total) }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(total);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, what is the grand total for all 4 categories combined?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(total);
        const opts = getFourOptions(finalAnswer, [
          String(total + scaleStep),
          String(total - scaleStep > 0 ? total - scaleStep : total + scaleStep * 2),
          String(total + scaleStep * 2)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}. What is the grand total for all 4 categories combined?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(total);
      }

    } else if (subType === 4) {
      // Missing Bar from 4-Category Grand Total
      const missingBar = c4;
      const sum123 = v1 + v2 + v3;
      const grandTotal = sum123 + v4;

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
          missingBar
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the bar for ${c4} is missing. The total number of ${theme.unit} for all 4 categories combined is ${grandTotal}. How many ${theme.unit} are there for ${c4}?"`;
        const stepsArr = [
          { label: `Combined total of ${c1}, ${c2}, and ${c3}:`, expectedAnswer: String(sum123), acceptedAnswers: getThreeTermAdditionAcceptedAnswers(v1, v2, v3, sum123) },
          { label: `Value of ${c4} (${grandTotal} - ${sum123}):`, expectedAnswer: String(v4), acceptedAnswers: getSubtractionAcceptedAnswers(grandTotal, sum123, v4) }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(v4);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the bar for ${c4} is missing. The total for all 4 categories combined is ${grandTotal} ${theme.unit}. What is the value of ${c4}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(v4);
        const opts = getFourOptions(finalAnswer, [
          String(v4 + scaleStep),
          String(v4 - scaleStep > 0 ? v4 - scaleStep : v4 + scaleStep * 2),
          String(v4 + scaleStep * 2)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the bar for ${c4} is missing. The total number of ${theme.unit} for all 4 categories combined is ${grandTotal}. What is the value of ${c4}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(v4);
      }

    } else if (subType === 5) {
      // Missing Bar from 3-Category Total
      const missingBar = c3;
      const sum12 = v1 + v2;
      const total123 = sum12 + v3;

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
          missingBar
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the bar for ${c3} is missing. The combined total for ${c1}, ${c2}, and ${c3} is ${total123}. How many ${theme.unit} are there for ${c3}?"`;
        const stepsArr = [
          { label: `Total for ${c1} and ${c2}:`, expectedAnswer: String(sum12), acceptedAnswers: getAdditionAcceptedAnswers(v1, v2, sum12) },
          { label: `Value of ${c3} (${total123} - ${sum12}):`, expectedAnswer: String(v3), acceptedAnswers: getSubtractionAcceptedAnswers(total123, sum12, v3) }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(v3);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the bar for ${c3} is missing. The combined total for ${c1}, ${c2}, and ${c3} is ${total123} ${theme.unit}. What is the value of ${c3}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(v3);
        const opts = getFourOptions(finalAnswer, [
          String(v3 + scaleStep),
          String(v3 - scaleStep > 0 ? v3 - scaleStep : v3 + scaleStep * 2),
          String(v3 + scaleStep * 2)
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the bar for ${c3} is missing. The combined total for ${c1}, ${c2}, and ${c3} is ${total123}. What is the value of ${c3}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(v3);
      }

    } else if (subType === 6) {
      // Reverse 3-Bars Combined Sum to Determine Scale
      const totalBlocks = b1 + b2 + b3;
      const total = totalBlocks * scaleStep;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The total number of ${theme.unit} for ${c1}, ${c2}, and ${c3} combined is ${total}. Count the grid blocks to find the value of 1 grid interval on the scale."`;
        const stepsArr = [
          { label: `Total grid blocks for ${c1}, ${c2}, and ${c3}:`, expectedAnswer: String(totalBlocks), acceptedAnswers: [String(totalBlocks), `${b1} + ${b2} + ${b3} = ${totalBlocks}`, `${b1}+${b2}+${b3}=${totalBlocks}`] },
          { label: `Value of 1 grid interval (${total} ÷ ${totalBlocks}):`, expectedAnswer: String(scaleStep), acceptedAnswers: getDivisionAcceptedAnswers(total, totalBlocks, scaleStep) }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(scaleStep);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers are missing. The total number of ${theme.unit} for ${c1}, ${c2}, and ${c3} combined is ${total}. What is the value of 1 grid interval on the scale?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(scaleStep);
        const opts = getFourOptions(finalAnswer, [
          String(scaleStep * 2),
          String(scaleStep + 5),
          String(Math.max(1, scaleStep - 2))
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The total number of ${theme.unit} for ${c1}, ${c2}, and ${c3} combined is ${total}. What is the value of 1 grid interval on the scale?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(scaleStep);
      }

    } else {
      // Reverse Grand Total of All 4 Bars to Determine Scale
      const totalBlocks = b1 + b2 + b3 + b4;
      const grandTotal = totalBlocks * scaleStep;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The grand total for all 4 categories combined is ${grandTotal} ${theme.unit}. Count the grid blocks to find the value of 1 grid interval on the scale."`;
        const stepsArr = [
          { label: `Total grid blocks for all 4 categories:`, expectedAnswer: String(totalBlocks), acceptedAnswers: [String(totalBlocks), `${b1} + ${b2} + ${b3} + ${b4} = ${totalBlocks}`, `${b1}+${b2}+${b3}+${b4}=${totalBlocks}`] },
          { label: `Value of 1 grid interval (${grandTotal} ÷ ${totalBlocks}):`, expectedAnswer: String(scaleStep), acceptedAnswers: getDivisionAcceptedAnswers(grandTotal, totalBlocks, scaleStep) }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(scaleStep);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The axis numbers are missing. The grand total for all 4 categories combined is ${grandTotal} ${theme.unit}. What is the value of 1 grid interval on the scale?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(scaleStep);
        const opts = getFourOptions(finalAnswer, [
          String(scaleStep * 2),
          String(scaleStep + 5),
          String(Math.max(1, scaleStep - 2))
        ]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the ${theme.title.toLowerCase()}, but the axis numbers are missing. The grand total for all 4 categories combined is ${grandTotal} ${theme.unit}. What is the value of 1 grid interval on the scale?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(scaleStep);
      }
    }

  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
