import {
  getRandomBarGraphTheme,
  getRandomPackagingTheme,
  getRandomSubgroupTheme,
  getRandomBeforeAfterTheme,
  getRandomFinancialTheme,
  getRandomAlgebraicTheme,
  getRandomEqualizingTheme,
  getRandomTargetShortfallTheme,
  getRandomRepackingTheme,
  getRandomNames,
  CONTEXT_TIERS
} from '../../../../../../utils/variable-bank.js';

import {
  getRandomInt,
  capitalize,
  gcd,
  lcm,
  partitionSum,
  formatCategoryList,
  getContextQuery,
  getFourOptions,
  getMultiplicationAcceptedAnswers,
  getDivisionAcceptedAnswers,
  getAdditionAcceptedAnswers,
  getSubtractionAcceptedAnswers,
  getSumAcceptedAnswers
} from '../helpers.js';

export function generateStandardTwoStepComparison({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

    const scaleOptions = [2, 5, 10, 20];
    const scaleStep = scaleOptions[getRandomInt(0, scaleOptions.length - 1)];
    const theme = getRandomBarGraphTheme(4);
    const orientation = Math.random() > 0.5 ? "vertical" : "horizontal";

    // Shuffle category indices
    const catIndices = [0, 1, 2, 3].sort(() => 0.5 - Math.random());
    const cA = theme.items[catIndices[0]];
    const cB = theme.items[catIndices[1]];
    const cC = theme.items[catIndices[2]];
    const cD = theme.items[catIndices[3]];

    // Sub-types:
    // 1: (A + B) > C  ("how many more items do A and B have combined than C")
    // 2: (A + B) < C  ("how many fewer items do A and B have combined than C")
    // 3: Pair vs Pair: (A + B) vs (C + D)
    // 4: Difference vs Third: |A - B| compared to C
    // 5: Reverse Deduction: Missing Bar C
    // 6: Reverse Deduction: Missing Bar A
    const subType = getRandomInt(1, 6);

    let vA, vB, vC, vD;
    let missingBarName = "";

    // ========================================================================
    // SUB-TYPE 1: (A + B) > C
    // ========================================================================
    if (subType === 1) {
      const kPool = [3, 4, 5, 6, 7, 8].sort(() => 0.5 - Math.random());
      const k1 = kPool[0];
      const k2 = kPool[1];
      const k3 = kPool.slice(2).filter(k => k < k1 + k2)[0] || 2;
      const k4 = kPool.filter(k => k !== k1 && k !== k2 && k !== k3)[0] || 9;

      vA = k1 * scaleStep;
      vB = k2 * scaleStep;
      vC = k3 * scaleStep;
      vD = k4 * scaleStep;

      const combined = vA + vB;
      const diff = combined - vC;

      const itemsWithValues = [
        { category: cA, value: vA },
        { category: cB, value: vB },
        { category: cC, value: vC },
        { category: cD, value: vD }
      ];
      const data = itemsWithValues.sort(() => 0.5 - Math.random());

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: orientation === "horizontal" ? theme.yAxisLabel : theme.xAxisLabel,
          yAxisLabel: orientation === "horizontal" ? theme.xAxisLabel : theme.yAxisLabel,
          data,
          scaleStep,
          orientation,
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. Calculate the total combined number of ${theme.unit} for ${cA} and ${cB}. Then, find out how many more ${theme.unit} those two categories have compared to ${cC}."`;
        const stepsArr = [
          { label: `Write the working equation to find the total for ${cA} and ${cB}:`, expectedAnswer: `${vA} + ${vB} = ${combined}`, acceptedAnswers: [`${vB} + ${vA} = ${combined}`, `${vA}+${vB}=${combined}`, `${vB}+${vA}=${combined}`] },
          { label: `Number of ${theme.unit} for ${cC}:`, expectedAnswer: String(vC), acceptedAnswers: [] },
          { label: `Write the working equation to find how many more ${theme.unit} ${cA} and ${cB} have combined than ${cC}:`, expectedAnswer: `${combined} - ${vC} = ${diff}`, acceptedAnswers: [`${combined}-${vC}=${diff}`] },
          { label: "Difference:", expectedAnswer: String(diff), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(diff);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, how many more ${theme.unit} do ${cA} and ${cB} have combined compared to ${cC}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(diff);
        const opts = getFourOptions(finalAnswer, [String(combined), String(vC), String(diff + scaleStep), String(diff - scaleStep > 0 ? diff - scaleStep : diff + scaleStep * 2)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()}. How many more ${theme.unit} do ${cA} and ${cB} have combined than ${cC}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(diff);
      }

    // ========================================================================
    // SUB-TYPE 2: (A + B) < C
    // ========================================================================
    } else if (subType === 2) {
      const k1 = 2;
      const k2 = 3;
      const k3 = getRandomInt(7, 9);
      const k4 = getRandomInt(4, 5);

      vA = k1 * scaleStep;
      vB = k2 * scaleStep;
      vC = k3 * scaleStep;
      vD = k4 * scaleStep;

      const combined = vA + vB;
      const diff = vC - combined;

      const itemsWithValues = [
        { category: cA, value: vA },
        { category: cB, value: vB },
        { category: cC, value: vC },
        { category: cD, value: vD }
      ];
      const data = itemsWithValues.sort(() => 0.5 - Math.random());

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: orientation === "horizontal" ? theme.yAxisLabel : theme.xAxisLabel,
          yAxisLabel: orientation === "horizontal" ? theme.xAxisLabel : theme.yAxisLabel,
          data,
          scaleStep,
          orientation,
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. Calculate the total combined number of ${theme.unit} for ${cA} and ${cB}. Then, find out how many fewer ${theme.unit} those two categories have compared to ${cC}."`;
        const stepsArr = [
          { label: `Write the working equation to find the total for ${cA} and ${cB}:`, expectedAnswer: `${vA} + ${vB} = ${combined}`, acceptedAnswers: [`${vB} + ${vA} = ${combined}`, `${vA}+${vB}=${combined}`, `${vB}+${vA}=${combined}`] },
          { label: `Number of ${theme.unit} for ${cC}:`, expectedAnswer: String(vC), acceptedAnswers: [] },
          { label: `Write the working equation to find how many fewer ${theme.unit} ${cA} and ${cB} have combined than ${cC}:`, expectedAnswer: `${vC} - ${combined} = ${diff}`, acceptedAnswers: [`${vC}-${combined}=${diff}`] },
          { label: "Difference:", expectedAnswer: String(diff), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(diff);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, how many fewer ${theme.unit} do ${cA} and ${cB} have combined compared to ${cC}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(diff);
        const opts = getFourOptions(finalAnswer, [String(combined), String(vC), String(diff + scaleStep), String(diff - scaleStep > 0 ? diff - scaleStep : diff + scaleStep * 2)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()}. How many fewer ${theme.unit} do ${cA} and ${cB} have combined than ${cC}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(diff);
      }

    // ========================================================================
    // SUB-TYPE 3: Pair vs Pair ((A + B) vs (C + D))
    // ========================================================================
    } else if (subType === 3) {
      vA = getRandomInt(4, 6) * scaleStep;
      vB = getRandomInt(7, 9) * scaleStep;
      vC = getRandomInt(2, 3) * scaleStep;
      vD = getRandomInt(4, 5) * scaleStep;

      const sum1 = vA + vB;
      const sum2 = vC + vD;
      const diff = Math.abs(sum1 - sum2);

      const itemsWithValues = [
        { category: cA, value: vA },
        { category: cB, value: vB },
        { category: cC, value: vC },
        { category: cD, value: vD }
      ];
      const data = itemsWithValues.sort(() => 0.5 - Math.random());

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: orientation === "horizontal" ? theme.yAxisLabel : theme.xAxisLabel,
          yAxisLabel: orientation === "horizontal" ? theme.xAxisLabel : theme.yAxisLabel,
          data,
          scaleStep,
          orientation,
          showGridLines: true
        }
      });

      const leadingPairStr = sum1 >= sum2 ? `${cA} and ${cB}` : `${cC} and ${cD}`;
      const trailingPairStr = sum1 >= sum2 ? `${cC} and ${cD}` : `${cA} and ${cB}`;
      const largerSum = Math.max(sum1, sum2);
      const smallerSum = Math.min(sum1, sum2);

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. Calculate the total for ${cA} and ${cB} combined, and the total for ${cC} and ${cD} combined. How many more ${theme.unit} do ${leadingPairStr} have than ${trailingPairStr}?"`;
        const stepsArr = [
          { label: `Write the working equation to find the total for ${cA} and ${cB}:`, expectedAnswer: `${vA} + ${vB} = ${sum1}`, acceptedAnswers: [`${vB} + ${vA} = ${sum1}`, `${vA}+${vB}=${sum1}`, `${vB}+${vA}=${sum1}`] },
          { label: `Write the working equation to find the total for ${cC} and ${cD}:`, expectedAnswer: `${vC} + ${vD} = ${sum2}`, acceptedAnswers: [`${vD} + ${vC} = ${sum2}`, `${vC}+${vD}=${sum2}`, `${vD}+${vC}=${sum2}`] },
          { label: `Write the working equation to find the difference between the two groups:`, expectedAnswer: `${largerSum} - ${smallerSum} = ${diff}`, acceptedAnswers: [`${largerSum}-${smallerSum}=${diff}`] },
          { label: "Difference:", expectedAnswer: String(diff), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(diff);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, how many more ${theme.unit} do ${leadingPairStr} have combined compared to ${trailingPairStr}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(diff);
        const opts = getFourOptions(finalAnswer, [String(largerSum), String(smallerSum), String(diff + scaleStep), String(diff - scaleStep > 0 ? diff - scaleStep : diff + scaleStep * 2)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()}. How many more ${theme.unit} do ${leadingPairStr} have combined than ${trailingPairStr}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(diff);
      }

    // ========================================================================
    // SUB-TYPE 4: Difference vs Third (|A - B| compared to C)
    // ========================================================================
    } else if (subType === 4) {
      vA = getRandomInt(7, 9) * scaleStep;
      vB = getRandomInt(2, 4) * scaleStep;
      vC = getRandomInt(2, 4) * scaleStep;
      vD = getRandomInt(5, 6) * scaleStep;

      const diff1 = vA - vB;
      const isDiffLarger = diff1 >= vC;
      const diff2 = Math.abs(diff1 - vC);

      const itemsWithValues = [
        { category: cA, value: vA },
        { category: cB, value: vB },
        { category: cC, value: vC },
        { category: cD, value: vD }
      ];
      const data = itemsWithValues.sort(() => 0.5 - Math.random());

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: orientation === "horizontal" ? theme.yAxisLabel : theme.xAxisLabel,
          yAxisLabel: orientation === "horizontal" ? theme.xAxisLabel : theme.yAxisLabel,
          data,
          scaleStep,
          orientation,
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. First, calculate the difference between ${cA} and ${cB}. Then, find out how much ${isDiffLarger ? 'more' : 'less'} this difference is compared to ${cC}."`;
        const stepsArr = [
          { label: `Write the working equation to find the difference between ${cA} and ${cB}:`, expectedAnswer: `${vA} - ${vB} = ${diff1}`, acceptedAnswers: [`${vA}-${vB}=${diff1}`] },
          { label: `Number of ${theme.unit} for ${cC}:`, expectedAnswer: String(vC), acceptedAnswers: [] },
          { label: isDiffLarger
              ? `Write the working equation to find how much more the difference is than ${cC}:`
              : `Write the working equation to find how much more ${cC} is than the difference:`,
            expectedAnswer: isDiffLarger ? `${diff1} - ${vC} = ${diff2}` : `${vC} - ${diff1} = ${diff2}`,
            acceptedAnswers: isDiffLarger ? [`${diff1}-${vC}=${diff2}`] : [`${vC}-${diff1}=${diff2}`]
          },
          { label: "Difference:", expectedAnswer: String(diff2), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(diff2);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, what is the difference between (${cA} minus ${cB}) and ${cC}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(diff2);
        const opts = getFourOptions(finalAnswer, [String(diff1), String(vC), String(diff2 + scaleStep), String(diff2 - scaleStep > 0 ? diff2 - scaleStep : diff2 + scaleStep * 2)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()}. What is the difference between (${cA} minus ${cB}) and ${cC}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(diff2);
      }

    // ========================================================================
    // SUB-TYPE 5: Reverse Deduction: Missing Bar C
    // ========================================================================
    } else if (subType === 5) {
      vA = getRandomInt(3, 5) * scaleStep;
      vB = getRandomInt(4, 6) * scaleStep;
      const combined = vA + vB;
      const diff = getRandomInt(1, 3) * scaleStep;
      vC = combined - diff; // C is smaller than combined
      vD = getRandomInt(2, 4) * scaleStep;

      missingBarName = cC;

      const itemsWithValues = [
        { category: cA, value: vA },
        { category: cB, value: vB },
        { category: cC, value: vC },
        { category: cD, value: vD }
      ];
      const data = itemsWithValues.sort(() => 0.5 - Math.random());

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: orientation === "horizontal" ? theme.yAxisLabel : theme.xAxisLabel,
          yAxisLabel: orientation === "horizontal" ? theme.xAxisLabel : theme.yAxisLabel,
          data,
          scaleStep,
          orientation,
          showGridLines: true,
          missingBar: missingBarName
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. The bar for ${cC} is missing. You are told that ${cA} and ${cB} combined have exactly ${diff} more ${theme.unit} than ${cC}. Read the values for ${cA} and ${cB} from the graph, and calculate the missing value for ${cC}."`;
        const stepsArr = [
          { label: `Write the working equation to find the combined total of ${cA} and ${cB}:`, expectedAnswer: `${vA} + ${vB} = ${combined}`, acceptedAnswers: [`${vB} + ${vA} = ${combined}`, `${vA}+${vB}=${combined}`, `${vB}+${vA}=${combined}`] },
          { label: `Write the working equation to find the value of ${cC} (Combined Total - Difference):`, expectedAnswer: `${combined} - ${diff} = ${vC}`, acceptedAnswers: [`${combined}-${diff}=${vC}`] },
          { label: `Number of ${theme.unit} for ${cC}:`, expectedAnswer: String(vC), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(vC);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar for ${cC} is missing. If ${cA} and ${cB} have ${diff} more ${theme.unit} combined than ${cC}, how many ${theme.unit} belong to ${cC}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(vC);
        const opts = getFourOptions(finalAnswer, [String(combined), String(vC + scaleStep), String(vC - scaleStep > 0 ? vC - scaleStep : vC + scaleStep * 2), String(diff)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"On the bar graph, the bar for ${cC} is missing. If ${cA} and ${cB} have ${diff} more ${theme.unit} combined than ${cC}, what is the value of ${cC}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(vC);
      }

    // ========================================================================
    // SUB-TYPE 6: Reverse Deduction: Missing Bar A
    // ========================================================================
    } else {
      vB = getRandomInt(2, 4) * scaleStep;
      vC = getRandomInt(3, 5) * scaleStep;
      const diff = getRandomInt(2, 4) * scaleStep;
      const combined = vC + diff; // (A + B) = C + diff
      vA = combined - vB;         // A = combined - B
      vD = getRandomInt(2, 5) * scaleStep;

      missingBarName = cA;

      const itemsWithValues = [
        { category: cA, value: vA },
        { category: cB, value: vB },
        { category: cC, value: vC },
        { category: cD, value: vD }
      ];
      const data = itemsWithValues.sort(() => 0.5 - Math.random());

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: orientation === "horizontal" ? theme.yAxisLabel : theme.xAxisLabel,
          yAxisLabel: orientation === "horizontal" ? theme.xAxisLabel : theme.yAxisLabel,
          data,
          scaleStep,
          orientation,
          showGridLines: true,
          missingBar: missingBarName
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. The bar for ${cA} is missing. You are told that ${cA} and ${cB} combined have exactly ${diff} more ${theme.unit} than ${cC}. Read the values for ${cB} and ${cC} from the graph, and calculate the missing value for ${cA}."`;
        const stepsArr = [
          { label: `Write the working equation to find the combined total of ${cA} and ${cB} (${cC} + ${diff}):`, expectedAnswer: `${vC} + ${diff} = ${combined}`, acceptedAnswers: [`${diff} + ${vC} = ${combined}`, `${vC}+${diff}=${combined}`, `${diff}+${vC}=${combined}`] },
          { label: `Write the working equation to find the value of ${cA} (Combined Total - ${cB}):`, expectedAnswer: `${combined} - ${vB} = ${vA}`, acceptedAnswers: [`${combined}-${vB}=${vA}`] },
          { label: `Number of ${theme.unit} for ${cA}:`, expectedAnswer: String(vA), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(vA);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar for ${cA} is missing. If ${cA} and ${cB} have ${diff} more ${theme.unit} combined than ${cC}, how many ${theme.unit} belong to ${cA}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(vA);
        const opts = getFourOptions(finalAnswer, [String(combined), String(vA + scaleStep), String(vA - scaleStep > 0 ? vA - scaleStep : vA + scaleStep * 2), String(diff)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"On the bar graph, the bar for ${cA} is missing. If ${cA} and ${cB} have ${diff} more ${theme.unit} combined than ${cC}, what is the value of ${cA}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(vA);
      }
    }

  // --------------------------------------------------------------------------
  // Variant 8: External Multiplier (Groups and Items)
  // --------------------------------------------------------------------------

  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
