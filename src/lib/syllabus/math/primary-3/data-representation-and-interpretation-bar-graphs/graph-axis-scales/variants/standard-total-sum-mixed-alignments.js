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

export function generateStandardTotalSumMixedAlignments({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

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

  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
