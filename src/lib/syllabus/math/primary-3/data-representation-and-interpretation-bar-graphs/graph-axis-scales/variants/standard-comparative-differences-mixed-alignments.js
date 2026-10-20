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

export function generateStandardComparativeDifferencesMixedAlignments({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

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


  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
