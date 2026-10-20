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

export function generateStandardHalfwayComputations({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

    const scaleOptions = [2, 10, 20, 100];
    const scaleStep = scaleOptions[getRandomInt(0, scaleOptions.length - 1)];
    const halfStep = scaleStep / 2;
    const theme = getRandomBarGraphTheme(4);
    const orientation = Math.random() > 0.5 ? "vertical" : "horizontal";

    // Value pools: 2 halfway values and 2 grid line values
    let gridVals = [];
    let halfVals = [];

    if (scaleStep === 2) {
      gridVals = [6, 8, 10, 12, 14, 16];
      halfVals = [5, 7, 9, 11, 13, 15];
    } else if (scaleStep === 10) {
      gridVals = [20, 30, 40, 50, 60, 70, 80];
      halfVals = [15, 25, 35, 45, 55, 65, 75];
    } else if (scaleStep === 20) {
      gridVals = [40, 60, 80, 100, 120, 140];
      halfVals = [30, 50, 70, 90, 110, 130];
    } else {
      // scaleStep === 100
      gridVals = [200, 300, 400, 500, 600, 700];
      halfVals = [150, 250, 350, 450, 550, 650];
    }

    gridVals.sort(() => 0.5 - Math.random());
    halfVals.sort(() => 0.5 - Math.random());

    const rawValues = [halfVals[0], halfVals[1], gridVals[0], gridVals[1]].sort(() => 0.5 - Math.random());

    const data = theme.items.slice(0, 4).map((cat, idx) => ({
      category: cat,
      value: rawValues[idx]
    }));

    const getHalfwayStepLabel = (cat, val) => {
      const isHalfway = (val % scaleStep !== 0);
      if (isHalfway) {
        const low = val - halfStep;
        const high = val + halfStep;
        return `Exact number of ${theme.unit} for ${cat} (halfway between ${low} and ${high}):`;
      }
      return `Number of ${theme.unit} for ${cat} shown on the graph:`;
    };

    // Sub-types:
    // 1: Total of 2 categories
    // 2: Total of 3 categories
    // 3: Grand total of all 4 categories
    // 4: Difference between 2 categories
    // 5: Reverse deduction from grand total (Missing Bar)
    // 6: Reverse deduction from pair total (Missing Bar)
    const subType = getRandomInt(1, 6);

    let missingBarName = "";

    // ========================================================================
    // SUB-TYPE 1: Total of 2 categories
    // ========================================================================
    if (subType === 1) {
      const picked = [0, 1, 2, 3].sort(() => 0.5 - Math.random()).slice(0, 2);
      const itemA = data[picked[0]];
      const itemB = data[picked[1]];
      const sum = itemA.value + itemB.value;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. Read the bar graph carefully to find the exact number of ${theme.unit} for ${itemA.category} and ${itemB.category}, and calculate their total combined amount."`;
        const stepsArr = [
          { label: getHalfwayStepLabel(itemA.category, itemA.value), expectedAnswer: String(itemA.value), acceptedAnswers: [] },
          { label: getHalfwayStepLabel(itemB.category, itemB.value), expectedAnswer: String(itemB.value), acceptedAnswers: [] },
          { label: "Write the working equation to find the total:", expectedAnswer: `${itemA.value} + ${itemB.value} = ${sum}`, acceptedAnswers: [`${itemB.value} + ${itemA.value} = ${sum}`, `${itemA.value}+${itemB.value}=${sum}`, `${itemB.value}+${itemA.value}=${sum}`] },
          { label: `Total combined ${theme.unit}:`, expectedAnswer: String(sum), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(sum);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Look at the bar graph with a scale step of ${scaleStep}. What is the total combined number of ${theme.unit} for ${itemA.category} and ${itemB.category}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(sum);
        const opts = getFourOptions(finalAnswer, [String(sum + scaleStep), String(sum - scaleStep > 0 ? sum - scaleStep : sum + scaleStep * 2), String(sum + halfStep), String(itemA.value + scaleStep)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()} with grid lines in steps of ${scaleStep}. What is the total combined number of ${theme.unit} for ${itemA.category} and ${itemB.category}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(sum);
      }

    // ========================================================================
    // SUB-TYPE 2: Total of 3 categories
    // ========================================================================
    } else if (subType === 2) {
      const picked = [0, 1, 2, 3].sort(() => 0.5 - Math.random()).slice(0, 3);
      const items = picked.map(i => data[i]);
      const v1 = items[0].value, v2 = items[1].value, v3 = items[2].value;
      const sum = v1 + v2 + v3;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. Read the bar graph carefully to find the values of ${items[0].category}, ${items[1].category}, and ${items[2].category}, and calculate their total combined amount."`;
        const stepsArr = [
          { label: `List the values of ${items[0].category}, ${items[1].category}, and ${items[2].category} (separated by commas):`, expectedAnswer: `${v1}, ${v2}, ${v3}`, acceptedAnswers: [
            `${v1}, ${v3}, ${v2}`, `${v2}, ${v1}, ${v3}`, `${v2}, ${v3}, ${v1}`, `${v3}, ${v1}, ${v2}`, `${v3}, ${v2}, ${v1}`,
            `${v1},${v2},${v3}`, `${v1},${v3},${v2}`, `${v2},${v1},${v3}`, `${v2},${v3},${v1}`, `${v3},${v1},${v2}`, `${v3},${v2},${v1}`
          ] },
          { label: "Write the working equation to find their combined total:", expectedAnswer: `${v1} + ${v2} + ${v3} = ${sum}`, acceptedAnswers: [
            `${v1}+${v2}+${v3}=${sum}`,
            `${v1} + ${v3} + ${v2} = ${sum}`,
            `${v2} + ${v1} + ${v3} = ${sum}`,
            `${v2} + ${v3} + ${v1} = ${sum}`,
            `${v3} + ${v1} + ${v2} = ${sum}`,
            `${v3} + ${v2} + ${v1} = ${sum}`
          ] },
          { label: `Total combined ${theme.unit}:`, expectedAnswer: String(sum), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(sum);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Look at the bar graph with a scale step of ${scaleStep}. What is the total combined number of ${theme.unit} for ${items[0].category}, ${items[1].category}, and ${items[2].category}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(sum);
        const opts = getFourOptions(finalAnswer, [String(sum + scaleStep), String(sum - scaleStep > 0 ? sum - scaleStep : sum + scaleStep * 2), String(sum + halfStep), String(v1 + v2)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()} with grid lines in steps of ${scaleStep}. What is the total number of ${theme.unit} for ${items[0].category}, ${items[1].category}, and ${items[2].category} combined?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(sum);
      }

    // ========================================================================
    // SUB-TYPE 3: Grand Total of all 4 categories
    // ========================================================================
    } else if (subType === 3) {
      const v1 = data[0].value, v2 = data[1].value, v3 = data[2].value, v4 = data[3].value;
      const grandTotal = v1 + v2 + v3 + v4;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. Read the bar graph carefully to find the values of all 4 categories, and calculate the grand total across all categories."`;
        const stepsArr = [
          { label: `List the values of all 4 categories shown on the graph (separated by commas):`, expectedAnswer: `${v1}, ${v2}, ${v3}, ${v4}`, acceptedAnswers: [
            `${v1},${v2},${v3},${v4}`
          ] },
          { label: "Write the working equation to find the grand total:", expectedAnswer: `${v1} + ${v2} + ${v3} + ${v4} = ${grandTotal}`, acceptedAnswers: [
            `${v1}+${v2}+${v3}+${v4}=${grandTotal}`
          ] },
          { label: `Grand total ${theme.unit}:`, expectedAnswer: String(grandTotal), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(grandTotal);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Look at the bar graph with a scale step of ${scaleStep}. What is the grand total number of ${theme.unit} across all 4 categories?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(grandTotal);
        const opts = getFourOptions(finalAnswer, [String(grandTotal + scaleStep), String(grandTotal - scaleStep > 0 ? grandTotal - scaleStep : grandTotal + scaleStep * 2), String(grandTotal + halfStep), String(v1 + v2 + v3)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()} with a scale step of ${scaleStep}. What is the grand total number of ${theme.unit} across all 4 categories?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(grandTotal);
      }

    // ========================================================================
    // SUB-TYPE 4: Difference between 2 categories
    // ========================================================================
    } else if (subType === 4) {
      const picked = [0, 1, 2, 3].sort(() => 0.5 - Math.random()).slice(0, 2);
      const c1 = data[picked[0]];
      const c2 = data[picked[1]];
      const itemA = c1.value >= c2.value ? c1 : c2;
      const itemB = c1.value >= c2.value ? c2 : c1;
      const diff = itemA.value - itemB.value;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. Read the bar graph carefully to find the values for ${itemA.category} and ${itemB.category}, and calculate how many more ${theme.unit} ${itemA.category} has than ${itemB.category}."`;
        const stepsArr = [
          { label: getHalfwayStepLabel(itemA.category, itemA.value), expectedAnswer: String(itemA.value), acceptedAnswers: [] },
          { label: getHalfwayStepLabel(itemB.category, itemB.value), expectedAnswer: String(itemB.value), acceptedAnswers: [] },
          { label: `Write the working equation to find how many more ${theme.unit} ${itemA.category} has than ${itemB.category}:`, expectedAnswer: `${itemA.value} - ${itemB.value} = ${diff}`, acceptedAnswers: [`${itemA.value}-${itemB.value}=${diff}`] },
          { label: `Difference:`, expectedAnswer: String(diff), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(diff);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph with a scale step of ${scaleStep}, how many more ${theme.unit} does ${itemA.category} have than ${itemB.category}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(diff);
        const opts = getFourOptions(finalAnswer, [String(diff + scaleStep), String(diff - scaleStep > 0 ? diff - scaleStep : diff + scaleStep * 2), String(diff + halfStep), String(itemA.value)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()} with grid lines in steps of ${scaleStep}. How many more ${theme.unit} does ${itemA.category} have than ${itemB.category}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(diff);
      }

    // ========================================================================
    // SUB-TYPE 5: Backward from Grand Total (Missing Bar)
    // ========================================================================
    } else if (subType === 5) {
      const missIdx = getRandomInt(0, 3);
      const itemMissing = data[missIdx];
      const visibleItems = data.filter((_, idx) => idx !== missIdx);
      const v1 = visibleItems[0].value, v2 = visibleItems[1].value, v3 = visibleItems[2].value;
      const sumKnown = v1 + v2 + v3;
      const grandTotal = sumKnown + itemMissing.value;
      missingBarName = itemMissing.category;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. The grand total across all 4 categories is ${grandTotal} ${theme.unit}. The bar for ${itemMissing.category} is missing. Determine the total of the 3 visible categories and calculate the missing value for ${itemMissing.category}."`;
        const stepsArr = [
          { label: `List the values of the 3 visible categories (${visibleItems[0].category}, ${visibleItems[1].category}, ${visibleItems[2].category}) separated by commas:`, expectedAnswer: `${v1}, ${v2}, ${v3}`, acceptedAnswers: [
            `${v1}, ${v3}, ${v2}`, `${v2}, ${v1}, ${v3}`, `${v2}, ${v3}, ${v1}`, `${v3}, ${v1}, ${v2}`, `${v3}, ${v2}, ${v1}`,
            `${v1},${v2},${v3}`, `${v1},${v3},${v2}`, `${v2},${v1},${v3}`, `${v2},${v3},${v1}`, `${v3},${v1},${v2}`, `${v3},${v2},${v1}`
          ] },
          { label: `Write the working equation to find the combined total of the 3 visible categories:`, expectedAnswer: `${v1} + ${v2} + ${v3} = ${sumKnown}`, acceptedAnswers: [
            `${v1}+${v2}+${v3}=${sumKnown}`,
            `${v1} + ${v3} + ${v2} = ${sumKnown}`,
            `${v2} + ${v1} + ${v3} = ${sumKnown}`,
            `${v2} + ${v3} + ${v1} = ${sumKnown}`,
            `${v3} + ${v1} + ${v2} = ${sumKnown}`,
            `${v3} + ${v2} + ${v1} = ${sumKnown}`
          ] },
          { label: `Write the working equation to find the value of ${itemMissing.category} (Grand Total - Known Sum):`, expectedAnswer: `${grandTotal} - ${sumKnown} = ${itemMissing.value}`, acceptedAnswers: [`${grandTotal}-${sumKnown}=${itemMissing.value}`] },
          { label: `Number of ${theme.unit} for ${itemMissing.category}:`, expectedAnswer: String(itemMissing.value), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(itemMissing.value);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The grand total for all 4 categories is ${grandTotal} ${theme.unit}. Based on the bar graph, how many ${theme.unit} belong to ${itemMissing.category} (the missing bar)?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(itemMissing.value);
        const opts = getFourOptions(finalAnswer, [String(itemMissing.value + scaleStep), String(itemMissing.value - scaleStep > 0 ? itemMissing.value - scaleStep : itemMissing.value + scaleStep * 2), String(itemMissing.value + halfStep), String(grandTotal - v1)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The grand total across all 4 categories on the bar graph is ${grandTotal} ${theme.unit}. The bar for ${itemMissing.category} is missing. How many ${theme.unit} belong to ${itemMissing.category}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(itemMissing.value);
      }

    // ========================================================================
    // SUB-TYPE 6: Reverse deduction from Pair Total (Missing Bar)
    // ========================================================================
    } else {
      const missIdx = getRandomInt(0, 3);
      const itemMissing = data[missIdx];
      const otherIndices = [0, 1, 2, 3].filter(i => i !== missIdx);
      const knownIdx = otherIndices[getRandomInt(0, otherIndices.length - 1)];
      const itemKnown = data[knownIdx];
      const pairTotal = itemKnown.value + itemMissing.value;
      missingBarName = itemMissing.category;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. The bar for ${itemMissing.category} is missing. You are told that ${itemKnown.category} and ${itemMissing.category} have a combined total of ${pairTotal} ${theme.unit}. Read the number for ${itemKnown.category} from the graph, and calculate the value for ${itemMissing.category}."`;
        const stepsArr = [
          { label: getHalfwayStepLabel(itemKnown.category, itemKnown.value), expectedAnswer: String(itemKnown.value), acceptedAnswers: [] },
          { label: `Write the working equation to find the value of ${itemMissing.category} (${pairTotal} - ${itemKnown.category}):`, expectedAnswer: `${pairTotal} - ${itemKnown.value} = ${itemMissing.value}`, acceptedAnswers: [`${pairTotal}-${itemKnown.value}=${itemMissing.value}`] },
          { label: `Number of ${theme.unit} for ${itemMissing.category}:`, expectedAnswer: String(itemMissing.value), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(itemMissing.value);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar for ${itemMissing.category} is missing on the graph. If ${itemKnown.category} and ${itemMissing.category} have a combined total of ${pairTotal} ${theme.unit}, what is the value of ${itemMissing.category}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(itemMissing.value);
        const opts = getFourOptions(finalAnswer, [String(itemMissing.value + scaleStep), String(itemMissing.value - scaleStep > 0 ? itemMissing.value - scaleStep : itemMissing.value + scaleStep * 2), String(itemMissing.value + halfStep), String(pairTotal - scaleStep)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar for ${itemMissing.category} is missing on the bar graph. If ${itemKnown.category} and ${itemMissing.category} have a combined total of ${pairTotal} ${theme.unit}, how many ${theme.unit} belong to ${itemMissing.category}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(itemMissing.value);
      }
    }

  // --------------------------------------------------------------------------
  // Variant 7: Two-Step Comparison (A + B vs C)
  // --------------------------------------------------------------------------

  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
