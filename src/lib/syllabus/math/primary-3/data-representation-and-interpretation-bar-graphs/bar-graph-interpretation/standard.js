import { getRandomBarGraphTheme, getRandomPackagingTheme, getRandomSubgroupTheme, getRandomBeforeAfterTheme, getRandomNames, CONTEXT_TIERS } from '../../../../../utils/variable-bank.js';

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getMultiplicationAcceptedAnswers = (a, b, product) => [
  `${a} x ${b} = ${product}`,
  `${b} x ${a} = ${product}`,
  `${a} X ${b} = ${product}`,
  `${b} X ${a} = ${product}`,
  `${a} × ${b} = ${product}`,
  `${b} × ${a} = ${product}`,
  `${a} * ${b} = ${product}`,
  `${b} * ${a} = ${product}`,
  `${a}x${b}=${product}`,
  `${b}x${a}=${product}`,
  `${a}X${b}=${product}`,
  `${b}X${a}=${product}`,
  `${a}×${b}=${product}`,
  `${b}×${a}=${product}`,
  `${a}*${b}=${product}`,
  `${b}*${a}=${product}`
];

const getDivisionAcceptedAnswers = (total, divisor, quotient) => [
  `${total} ÷ ${divisor} = ${quotient}`,
  `${total} / ${divisor} = ${quotient}`,
  `${total}÷${divisor}=${quotient}`,
  `${total}/${divisor}=${quotient}`
];

const getFourOptions = (correctVal, candidateDistractors = []) => {
  const set = new Set([String(correctVal)]);
  for (const d of candidateDistractors) {
    if (d !== undefined && d !== null && String(d).trim() !== '' && !set.has(String(d)) && set.size < 4) {
      set.add(String(d));
    }
  }
  let delta = 1;
  const num = Number(correctVal);
  while (set.size < 4) {
    if (!isNaN(num)) {
      const candidate = String(Math.max(1, num + (set.size % 2 === 1 ? delta * 5 : -delta * 5)));
      if (!set.has(candidate)) set.add(candidate);
    } else {
      set.add(`Option ${set.size + 1}`);
    }
    delta++;
  }
  return Array.from(set);
};

export const generateStandard = (variant, type, getFormatInstructions) => {
  const safeType = String(type).toLowerCase();
  const isMCQ = safeType === 'mcq';
  const isShort = safeType === 'short question';
  const isStructure = !isMCQ && !isShort;

  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

  const studentName = getRandomNames(1)[0] || 'Bala';

  // --------------------------------------------------------------------------
  // Variant 6: Half-Way Mark Computations
  // --------------------------------------------------------------------------
  if (variant === 'standard_halfway_computations') {
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
  } else if (variant === 'standard_two_step_comparison') {
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
  } else if (variant === 'standard_external_multiplier') {
    const theme = getRandomPackagingTheme(4);
    const scaleOptions = [2, 5, 10, 20];
    const scaleStep = scaleOptions[getRandomInt(0, scaleOptions.length - 1)];
    const orientation = Math.random() > 0.5 ? "vertical" : "horizontal";

    const multIdx = getRandomInt(0, theme.multiplierPool.length - 1);
    const multiplier = theme.multiplierPool[multIdx];

    // Pick 4 distinct container counts
    let kPool = scaleStep === 20 
      ? [1, 2, 3, 4, 5].sort(() => 0.5 - Math.random()) 
      : [2, 3, 4, 5, 6, 7, 8].sort(() => 0.5 - Math.random());
    const rawCounts = [kPool[0] * scaleStep, kPool[1] * scaleStep, kPool[2] * scaleStep, kPool[3] * scaleStep];

    // Shuffle category mapping
    const catIndices = [0, 1, 2, 3].sort(() => 0.5 - Math.random());
    const data = [
      { category: theme.items[catIndices[0]], value: rawCounts[0] },
      { category: theme.items[catIndices[1]], value: rawCounts[1] },
      { category: theme.items[catIndices[2]], value: rawCounts[2] },
      { category: theme.items[catIndices[3]], value: rawCounts[3] }
    ];

    // Sub-types:
    // 1: Single category forward multiplication (Containers * Multiplier = Total Items)
    // 2: Combined sum of 2 categories ((C1 + C2) * Multiplier = Total Items)
    // 3: Grand total across all 4 categories ((C1 + C2 + C3 + C4) * Multiplier = Grand Total Items)
    // 4: Difference between 2 categories ((C1 - C2) * Multiplier = Diff Items)
    // 5: Pair vs Single Category difference (((C1 + C2) - C3) * Multiplier = Diff Items)
    // 6: Reverse division - Find items per container (Total Items / Containers = Multiplier)
    // 7: Reverse category deduction - Which category has T items? (T / Multiplier = Containers -> match category)
    // 8: Reverse deduction with Missing Bar - Single category (T / Multiplier = Containers)
    // 9: Reverse deduction with Missing Bar - Pair total ((Pair Total / Multiplier) - Known = Missing Containers)
    const subType = getRandomInt(1, 9);

    let missingBarName = "";

    // ========================================================================
    // SUB-TYPE 1: Single Category Forward Multiplication
    // ========================================================================
    if (subType === 1) {
      const targetCat = data[getRandomInt(0, 3)];
      const containerCount = targetCat.value;
      const totalItems = containerCount * multiplier;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. Every single ${theme.singularGroup} holds exactly ${multiplier} ${theme.itemUnit}. Read the bar graph to find the number of ${theme.groupUnit} of ${targetCat.category}, and calculate the total number of individual ${targetCat.category}."`;
        const stepsArr = [
          { label: `Number of ${theme.groupUnit} of ${targetCat.category} shown on the graph:`, expectedAnswer: String(containerCount), acceptedAnswers: [] },
          { label: `Number of ${theme.itemUnit} in each ${theme.singularGroup}:`, expectedAnswer: String(multiplier), acceptedAnswers: [] },
          { label: `Write the working equation to find the total number of individual ${targetCat.category}:`, expectedAnswer: `${containerCount} x ${multiplier} = ${totalItems}`, acceptedAnswers: getMultiplicationAcceptedAnswers(containerCount, multiplier, totalItems) },
          { label: `Total individual ${targetCat.category}:`, expectedAnswer: String(totalItems), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(totalItems);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()}. Each ${theme.singularGroup} holds ${multiplier} ${theme.itemUnit}. How many individual ${targetCat.category} are there altogether?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(totalItems);
        const opts = getFourOptions(finalAnswer, [String(totalItems + multiplier * scaleStep), String(totalItems - multiplier * scaleStep > 0 ? totalItems - multiplier * scaleStep : totalItems + multiplier * 2), String(containerCount + multiplier), String(totalItems + multiplier)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The graph shows the number of ${theme.groupUnit} of ${targetCat.category}. If each ${theme.singularGroup} holds ${multiplier} ${theme.itemUnit}, how many individual ${targetCat.category} are there in total?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(totalItems);
      }

    // ========================================================================
    // SUB-TYPE 2: Combined Sum of 2 Categories
    // ========================================================================
    } else if (subType === 2) {
      const picked = [0, 1, 2, 3].sort(() => 0.5 - Math.random()).slice(0, 2);
      const itemA = data[picked[0]];
      const itemB = data[picked[1]];
      const totalContainers = itemA.value + itemB.value;
      const totalItems = totalContainers * multiplier;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. Each ${theme.singularGroup} contains ${multiplier} ${theme.itemUnit}. Calculate the total number of ${theme.groupUnit} for ${itemA.category} and ${itemB.category} combined, and find the total number of individual ${theme.itemUnit} for both categories."`;
        const stepsArr = [
          { label: `Write the working equation to find the total number of ${theme.groupUnit} for ${itemA.category} and ${itemB.category} combined:`, expectedAnswer: `${itemA.value} + ${itemB.value} = ${totalContainers}`, acceptedAnswers: [
            `${itemB.value} + ${itemA.value} = ${totalContainers}`,
            `${itemA.value}+${itemB.value}=${totalContainers}`,
            `${itemB.value}+${itemA.value}=${totalContainers}`
          ] },
          { label: `Write the working equation to find the total number of ${theme.itemUnit} for both categories (${totalContainers} x ${multiplier}):`, expectedAnswer: `${totalContainers} x ${multiplier} = ${totalItems}`, acceptedAnswers: getMultiplicationAcceptedAnswers(totalContainers, multiplier, totalItems) },
          { label: `Total individual ${theme.itemUnit}:`, expectedAnswer: String(totalItems), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(totalItems);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, each ${theme.singularGroup} holds ${multiplier} ${theme.itemUnit}. How many individual ${theme.itemUnit} are there for ${itemA.category} and ${itemB.category} combined?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(totalItems);
        const opts = getFourOptions(finalAnswer, [String(totalItems + multiplier * scaleStep), String(totalItems - multiplier * scaleStep > 0 ? totalItems - multiplier * scaleStep : totalItems + multiplier * 2), String(totalContainers), String(itemA.value * multiplier)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()}. If each ${theme.singularGroup} contains ${multiplier} ${theme.itemUnit}, what is the total number of individual ${theme.itemUnit} for ${itemA.category} and ${itemB.category} combined?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(totalItems);
      }

    // ========================================================================
    // SUB-TYPE 3: Grand Total Across All 4 Categories
    // ========================================================================
    } else if (subType === 3) {
      const v1 = data[0].value, v2 = data[1].value, v3 = data[2].value, v4 = data[3].value;
      const totalContainers = v1 + v2 + v3 + v4;
      const grandTotalItems = totalContainers * multiplier;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. Each ${theme.singularGroup} holds exactly ${multiplier} ${theme.itemUnit}. Read the bar graph to find the total number of ${theme.groupUnit} across all 4 categories, and calculate the grand total of individual ${theme.itemUnit}."`;
        const stepsArr = [
          { label: `List the number of ${theme.groupUnit} for all 4 categories (separated by commas):`, expectedAnswer: `${v1}, ${v2}, ${v3}, ${v4}`, acceptedAnswers: [
            `${v1},${v2},${v3},${v4}`
          ] },
          { label: `Write the working equation to find the total number of ${theme.groupUnit}:`, expectedAnswer: `${v1} + ${v2} + ${v3} + ${v4} = ${totalContainers}`, acceptedAnswers: [
            `${v1}+${v2}+${v3}+${v4}=${totalContainers}`
          ] },
          { label: `Write the working equation to find the grand total number of ${theme.itemUnit} (${totalContainers} x ${multiplier}):`, expectedAnswer: `${totalContainers} x ${multiplier} = ${grandTotalItems}`, acceptedAnswers: getMultiplicationAcceptedAnswers(totalContainers, multiplier, grandTotalItems) },
          { label: `Grand total individual ${theme.itemUnit}:`, expectedAnswer: String(grandTotalItems), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(grandTotalItems);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, each ${theme.singularGroup} contains ${multiplier} ${theme.itemUnit}. How many individual ${theme.itemUnit} are there in total across all 4 categories?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(grandTotalItems);
        const opts = getFourOptions(finalAnswer, [String(grandTotalItems + multiplier * scaleStep), String(grandTotalItems - multiplier * scaleStep > 0 ? grandTotalItems - multiplier * scaleStep : grandTotalItems + multiplier * 2), String(totalContainers), String((v1 + v2 + v3) * multiplier)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()}. Each ${theme.singularGroup} holds ${multiplier} ${theme.itemUnit}. What is the grand total number of individual ${theme.itemUnit} across all 4 categories?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(grandTotalItems);
      }

    // ========================================================================
    // SUB-TYPE 4: Difference Between 2 Categories
    // ========================================================================
    } else if (subType === 4) {
      const picked = [0, 1, 2, 3].sort(() => 0.5 - Math.random()).slice(0, 2);
      const c1 = data[picked[0]];
      const c2 = data[picked[1]];
      const itemA = c1.value >= c2.value ? c1 : c2;
      const itemB = c1.value >= c2.value ? c2 : c1;
      const diffContainers = itemA.value - itemB.value;
      const diffItems = diffContainers * multiplier;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. Each ${theme.singularGroup} holds exactly ${multiplier} ${theme.itemUnit}. Calculate how many more individual ${theme.itemUnit} there are of ${itemA.category} than ${itemB.category}."`;
        const stepsArr = [
          { label: `Write the working equation to find how many more ${theme.groupUnit} there are of ${itemA.category} than ${itemB.category}:`, expectedAnswer: `${itemA.value} - ${itemB.value} = ${diffContainers}`, acceptedAnswers: [`${itemA.value}-${itemB.value}=${diffContainers}`] },
          { label: `Write the working equation to find how many more individual ${theme.itemUnit} there are (${diffContainers} x ${multiplier}):`, expectedAnswer: `${diffContainers} x ${multiplier} = ${diffItems}`, acceptedAnswers: getMultiplicationAcceptedAnswers(diffContainers, multiplier, diffItems) },
          { label: `Difference in individual ${theme.itemUnit}:`, expectedAnswer: String(diffItems), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(diffItems);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, each ${theme.singularGroup} holds ${multiplier} ${theme.itemUnit}. How many more individual ${theme.itemUnit} are there of ${itemA.category} than ${itemB.category}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(diffItems);
        const opts = getFourOptions(finalAnswer, [String(diffItems + multiplier), String(diffItems - multiplier > 0 ? diffItems - multiplier : diffItems + multiplier * 2), String(diffContainers), String(diffItems + scaleStep * multiplier)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()}. If each ${theme.singularGroup} contains ${multiplier} ${theme.itemUnit}, how many more individual ${theme.itemUnit} of ${itemA.category} are there than ${itemB.category}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(diffItems);
      }

    // ========================================================================
    // SUB-TYPE 5: Pair vs Single Category Difference (Two-Step Comparison)
    // ========================================================================
    } else if (subType === 5) {
      const picked = [0, 1, 2, 3].sort(() => 0.5 - Math.random());
      const itemA = data[picked[0]];
      const itemB = data[picked[1]];
      const itemC = data[picked[2]];
      const sumContainers = itemA.value + itemB.value;
      const diffContainers = sumContainers - itemC.value;
      const isPairMore = diffContainers >= 0;
      const absDiffContainers = Math.abs(diffContainers);
      const diffItems = absDiffContainers * multiplier;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. Each ${theme.singularGroup} contains ${multiplier} ${theme.itemUnit}. Calculate the combined number of ${theme.groupUnit} for ${itemA.category} and ${itemB.category}. Then, find how many ${isPairMore ? 'more' : 'fewer'} individual ${theme.itemUnit} those two categories have combined than ${itemC.category}."`;
        const stepsArr = [
          { label: `Write the working equation to find the total number of ${theme.groupUnit} for ${itemA.category} and ${itemB.category}:`, expectedAnswer: `${itemA.value} + ${itemB.value} = ${sumContainers}`, acceptedAnswers: [
            `${itemB.value} + ${itemA.value} = ${sumContainers}`,
            `${itemA.value}+${itemB.value}=${sumContainers}`,
            `${itemB.value}+${itemA.value}=${sumContainers}`
          ] },
          { label: isPairMore 
              ? `Write the working equation to find how many more ${theme.groupUnit} they have combined than ${itemC.category}:` 
              : `Write the working equation to find how many fewer ${theme.groupUnit} they have combined than ${itemC.category}:`, 
            expectedAnswer: isPairMore ? `${sumContainers} - ${itemC.value} = ${absDiffContainers}` : `${itemC.value} - ${sumContainers} = ${absDiffContainers}`, 
            acceptedAnswers: isPairMore ? [`${sumContainers}-${itemC.value}=${absDiffContainers}`] : [`${itemC.value}-${sumContainers}=${absDiffContainers}`] 
          },
          { label: `Write the working equation to find the difference in individual ${theme.itemUnit} (${absDiffContainers} x ${multiplier}):`, expectedAnswer: `${absDiffContainers} x ${multiplier} = ${diffItems}`, acceptedAnswers: getMultiplicationAcceptedAnswers(absDiffContainers, multiplier, diffItems) },
          { label: `Difference in individual ${theme.itemUnit}:`, expectedAnswer: String(diffItems), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(diffItems);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Each ${theme.singularGroup} contains ${multiplier} ${theme.itemUnit}. How many ${isPairMore ? 'more' : 'fewer'} individual ${theme.itemUnit} do ${itemA.category} and ${itemB.category} have combined than ${itemC.category}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(diffItems);
        const opts = getFourOptions(finalAnswer, [String(diffItems + multiplier), String(diffItems - multiplier > 0 ? diffItems - multiplier : diffItems + multiplier * 2), String(sumContainers * multiplier), String(absDiffContainers)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()}. Each ${theme.singularGroup} holds ${multiplier} ${theme.itemUnit}. How many ${isPairMore ? 'more' : 'fewer'} individual ${theme.itemUnit} do ${itemA.category} and ${itemB.category} have combined than ${itemC.category}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(diffItems);
      }

    // ========================================================================
    // SUB-TYPE 6: Reverse Division - Find Items Per Container
    // ========================================================================
    } else if (subType === 6) {
      const targetCat = data[getRandomInt(0, 3)];
      const containerCount = targetCat.value;
      const totalItems = containerCount * multiplier;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. There are a total of ${totalItems} individual ${theme.itemUnit} of ${targetCat.category}. Read the number of ${theme.groupUnit} from the graph, and calculate how many ${theme.itemUnit} are packed in each ${theme.singularGroup}."`;
        const stepsArr = [
          { label: `Number of ${theme.groupUnit} of ${targetCat.category} shown on the graph:`, expectedAnswer: String(containerCount), acceptedAnswers: [] },
          { label: `Write the working equation to find the number of ${theme.itemUnit} per ${theme.singularGroup} (${totalItems} ÷ ${containerCount}):`, expectedAnswer: `${totalItems} / ${containerCount} = ${multiplier}`, acceptedAnswers: getDivisionAcceptedAnswers(totalItems, containerCount, multiplier) },
          { label: `Number of ${theme.itemUnit} per ${theme.singularGroup}:`, expectedAnswer: String(multiplier), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(multiplier);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"There are a total of ${totalItems} individual ${theme.itemUnit} of ${targetCat.category}. Based on the bar graph, how many ${theme.itemUnit} are in each ${theme.singularGroup}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(multiplier);
        const opts = getFourOptions(finalAnswer, [String(multiplier + 2), String(multiplier - 2 > 0 ? multiplier - 2 : multiplier + 4), String(containerCount), String(multiplier + 1)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The graph shows the number of ${theme.groupUnit} of ${targetCat.category}. If there are ${totalItems} individual ${theme.itemUnit} in total, how many ${theme.itemUnit} are in each ${theme.singularGroup}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(multiplier);
      }

    // ========================================================================
    // SUB-TYPE 7: Reverse Category Deduction (Which category has T items?)
    // ========================================================================
    } else if (subType === 7) {
      const targetCat = data[getRandomInt(0, 3)];
      const containerCount = targetCat.value;
      const totalItems = containerCount * multiplier;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. Each ${theme.singularGroup} contains exactly ${multiplier} ${theme.itemUnit}. One category has a total of ${totalItems} individual ${theme.itemUnit}. Calculate the number of ${theme.groupUnit} needed, and identify which category matches this amount on the bar graph."`;
        const stepsArr = [
          { label: `Write the working equation to find the number of ${theme.groupUnit} (${totalItems} ÷ ${multiplier}):`, expectedAnswer: `${totalItems} / ${multiplier} = ${containerCount}`, acceptedAnswers: getDivisionAcceptedAnswers(totalItems, multiplier, containerCount) },
          { label: `Which category has exactly this amount on the graph?`, expectedAnswer: targetCat.category, acceptedAnswers: [targetCat.category.toLowerCase(), targetCat.category.toUpperCase()] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = targetCat.category;
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Each ${theme.singularGroup} holds ${multiplier} ${theme.itemUnit}. Which category has a total of ${totalItems} individual ${theme.itemUnit}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = targetCat.category;
        const otherCats = data.map(d => d.category).filter(c => c !== targetCat.category);
        const opts = [targetCat.category, otherCats[0], otherCats[1], otherCats[2]];
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()}. Each ${theme.singularGroup} holds ${multiplier} ${theme.itemUnit}. Which category has a total of ${totalItems} individual ${theme.itemUnit}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = targetCat.category;
      }

    // ========================================================================
    // SUB-TYPE 8: Reverse Deduction with Missing Bar (Find Missing Containers)
    // ========================================================================
    } else if (subType === 8) {
      const targetCat = data[0];
      const containerCount = targetCat.value;
      const totalItems = containerCount * multiplier;
      missingBarName = targetCat.category;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. The bar for ${targetCat.category} is missing. Each ${theme.singularGroup} contains exactly ${multiplier} ${theme.itemUnit}. If there are a total of ${totalItems} individual ${theme.itemUnit} of ${targetCat.category}, how many ${theme.groupUnit} of ${targetCat.category} were packed?"`;
        const stepsArr = [
          { label: `Write the working equation to find the number of ${theme.groupUnit} of ${targetCat.category} (${totalItems} ÷ ${multiplier}):`, expectedAnswer: `${totalItems} / ${multiplier} = ${containerCount}`, acceptedAnswers: getDivisionAcceptedAnswers(totalItems, multiplier, containerCount) },
          { label: `Number of ${theme.groupUnit} of ${targetCat.category}:`, expectedAnswer: String(containerCount), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(containerCount);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar for ${targetCat.category} is missing. Each ${theme.singularGroup} holds ${multiplier} ${theme.itemUnit}. If there are ${totalItems} individual ${theme.itemUnit} of ${targetCat.category}, how many ${theme.groupUnit} are there?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(containerCount);
        const opts = getFourOptions(finalAnswer, [String(containerCount + scaleStep), String(containerCount - scaleStep > 0 ? containerCount - scaleStep : containerCount + scaleStep * 2), String(Math.floor(totalItems / 2)), String(containerCount + 1)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"On the bar graph, the bar for ${targetCat.category} is missing. Each ${theme.singularGroup} holds ${multiplier} ${theme.itemUnit}. If there are ${totalItems} individual ${theme.itemUnit} of ${targetCat.category}, how many ${theme.groupUnit} were packed?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(containerCount);
      }

    // ========================================================================
    // SUB-TYPE 9: Reverse Deduction with Missing Bar (Pair Total Items)
    // ========================================================================
    } else {
      const itemMissing = data[0];
      const itemKnown = data[1];
      missingBarName = itemMissing.category;
      const combinedContainers = itemMissing.value + itemKnown.value;
      const pairTotalItems = combinedContainers * multiplier;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. The bar for ${itemMissing.category} is missing. Each ${theme.singularGroup} contains exactly ${multiplier} ${theme.itemUnit}. You are told that ${itemMissing.category} and ${itemKnown.category} have a combined total of ${pairTotalItems} individual ${theme.itemUnit}. Read the number of ${theme.groupUnit} of ${itemKnown.category} from the graph, find the combined number of ${theme.groupUnit}, and calculate how many ${theme.groupUnit} belong to ${itemMissing.category}."`;
        const stepsArr = [
          { label: `Number of ${theme.groupUnit} of ${itemKnown.category} shown on the graph:`, expectedAnswer: String(itemKnown.value), acceptedAnswers: [] },
          { label: `Write the working equation to find the combined number of ${theme.groupUnit} (${pairTotalItems} ÷ ${multiplier}):`, expectedAnswer: `${pairTotalItems} / ${multiplier} = ${combinedContainers}`, acceptedAnswers: getDivisionAcceptedAnswers(pairTotalItems, multiplier, combinedContainers) },
          { label: `Write the working equation to find the number of ${theme.groupUnit} for ${itemMissing.category} (${combinedContainers} - ${itemKnown.value}):`, expectedAnswer: `${combinedContainers} - ${itemKnown.value} = ${itemMissing.value}`, acceptedAnswers: [`${combinedContainers}-${itemKnown.value}=${itemMissing.value}`] },
          { label: `Number of ${theme.groupUnit} for ${itemMissing.category}:`, expectedAnswer: String(itemMissing.value), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(itemMissing.value);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar for ${itemMissing.category} is missing. Each ${theme.singularGroup} holds ${multiplier} ${theme.itemUnit}. If ${itemMissing.category} and ${itemKnown.category} have ${pairTotalItems} individual ${theme.itemUnit} combined, how many ${theme.groupUnit} belong to ${itemMissing.category}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(itemMissing.value);
        const opts = getFourOptions(finalAnswer, [String(itemMissing.value + scaleStep), String(itemMissing.value - scaleStep > 0 ? itemMissing.value - scaleStep : itemMissing.value + scaleStep * 2), String(combinedContainers), String(itemMissing.value + 1)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"On the bar graph, the bar for ${itemMissing.category} is missing. Each ${theme.singularGroup} holds ${multiplier} ${theme.itemUnit}. If ${itemMissing.category} and ${itemKnown.category} have a combined total of ${pairTotalItems} individual ${theme.itemUnit}, how many ${theme.groupUnit} belong to ${itemMissing.category}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(itemMissing.value);
      }
    }

  // --------------------------------------------------------------------------
  // Variant 9: Subgroup Part-Whole Breakdown (Internal Categories)
  // --------------------------------------------------------------------------
  } else if (variant === 'standard_subgroup_part_whole' || variant === 'standard_missing_category_deduction') {
    const theme = getRandomSubgroupTheme(4);
    const scaleOptions = [2, 5, 10, 20];
    const scaleStep = scaleOptions[getRandomInt(0, scaleOptions.length - 1)];
    const orientation = Math.random() > 0.5 ? "vertical" : "horizontal";

    // Sub-types:
    // 1: Single Category Subgroup Deduction (Total - Part 1 = Part 2)
    // 2: Subgroup Comparison Across Two Categories (|Part A2 - Part B2|)
    // 3: Combined Subgroup Across Two Categories (Part A2 + Part B2)
    // 4: Fractional Breakdown (Half / One-quarter of a Category)
    // 5: Internal Ratio / Multiplier Relationship (Twice as many -> 3 units)
    // 6: Reverse Deduction - Missing Bar from Known Subgroups (Part 1 + Part 2 = Missing Total)
    // 7: Reverse Deduction - Missing Bar from Subgroup Comparison ((Known Part 1 + Diff) + Part 2 = Missing Total)
    const subType = getRandomInt(1, 7);

    let kPool = [3, 4, 5, 6, 7, 8].sort(() => 0.5 - Math.random());
    let rawCounts = [kPool[0] * scaleStep, kPool[1] * scaleStep, kPool[2] * scaleStep, kPool[3] * scaleStep];

    // For Sub-Type 4 (Fraction) and Sub-Type 5 (3 units), ensure target values are cleanly divisible
    if (subType === 4) {
      rawCounts[0] = getRandomInt(2, 6) * 4 * (scaleStep === 5 ? 1 : Math.max(1, Math.floor(scaleStep / 2)));
      if (rawCounts[0] % scaleStep !== 0) rawCounts[0] = Math.ceil(rawCounts[0] / (scaleStep * 4)) * (scaleStep * 4) || scaleStep * 4;
    } else if (subType === 5) {
      rawCounts[0] = getRandomInt(2, 5) * 3 * scaleStep;
    }

    const catIndices = [0, 1, 2, 3].sort(() => 0.5 - Math.random());
    const data = [
      { category: theme.items[catIndices[0]], value: rawCounts[0] },
      { category: theme.items[catIndices[1]], value: rawCounts[1] },
      { category: theme.items[catIndices[2]], value: rawCounts[2] },
      { category: theme.items[catIndices[3]], value: rawCounts[3] }
    ];

    let missingBarName = "";

    // ========================================================================
    // SUB-TYPE 1: Single Category Subgroup Deduction (Total - Part 1 = Part 2)
    // ========================================================================
    if (subType === 1) {
      const targetCat = data[getRandomInt(0, 3)];
      const tot = targetCat.value;
      const stepUnits = Math.floor(tot / scaleStep);
      const p1Units = getRandomInt(1, Math.max(1, stepUnits - 1));
      const p1 = p1Units * scaleStep;
      const p2 = tot - p1;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. In ${targetCat.category}, there are ${p1} ${theme.subgroup1} and the rest are ${theme.subgroup2}. Read the total number of ${theme.unit} for ${targetCat.category} from the graph, and calculate how many ${theme.subgroup2} there are in ${targetCat.category}."`;
        const stepsArr = [
          { label: `Total number of ${theme.unit} for ${targetCat.category} shown on the graph:`, expectedAnswer: String(tot), acceptedAnswers: [] },
          { label: `Number of ${theme.subgroup1} in ${targetCat.category}:`, expectedAnswer: String(p1), acceptedAnswers: [] },
          { label: `Write the working equation to find the number of ${theme.subgroup2} (${tot} - ${p1}):`, expectedAnswer: `${tot} - ${p1} = ${p2}`, acceptedAnswers: [`${tot}-${p1}=${p2}`] },
          { label: `Number of ${theme.subgroup2} in ${targetCat.category}:`, expectedAnswer: String(p2), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(p2);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, if there are ${p1} ${theme.subgroup1} in ${targetCat.category}, how many ${theme.subgroup2} are there in ${targetCat.category}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(p2);
        const opts = getFourOptions(finalAnswer, [String(p2 + scaleStep), String(p2 - scaleStep > 0 ? p2 - scaleStep : p2 + scaleStep * 2), String(tot + p1), String(p1)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()}. In ${targetCat.category}, there are ${p1} ${theme.subgroup1} and the rest are ${theme.subgroup2}. How many ${theme.subgroup2} are there in ${targetCat.category}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(p2);
      }

    // ========================================================================
    // SUB-TYPE 2: Subgroup Comparison Across Two Categories
    // ========================================================================
    } else if (subType === 2) {
      const catA = data[0];
      const catB = data[1];
      const totA = catA.value;
      const totB = catB.value;
      const pA1 = Math.max(scaleStep, Math.floor((totA / scaleStep) * 0.4) * scaleStep);
      let pB1 = Math.max(scaleStep, Math.floor((totB / scaleStep) * 0.5) * scaleStep);
      let pA2 = totA - pA1;
      let pB2 = totB - pB1;
      if (pA2 === pB2) {
        pB1 = Math.max(scaleStep, pB1 - scaleStep);
        pB2 = totB - pB1;
      }
      const itemMore = pA2 >= pB2 ? catA : catB;
      const itemLess = pA2 >= pB2 ? catB : catA;
      const largerP2 = Math.max(pA2, pB2);
      const smallerP2 = Math.min(pA2, pB2);
      const diff = largerP2 - smallerP2;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. In ${catA.category}, ${pA1} of the ${theme.unit} are ${theme.subgroup1} and the rest are ${theme.subgroup2}. In ${catB.category}, ${pB1} of the ${theme.unit} are ${theme.subgroup1} and the rest are ${theme.subgroup2}. Calculate the number of ${theme.subgroup2} in each category, and find how many more ${theme.subgroup2} there are in ${itemMore.category} than in ${itemLess.category}."`;
        const stepsArr = [
          { label: `Write the working equation to find the number of ${theme.subgroup2} in ${catA.category}:`, expectedAnswer: `${totA} - ${pA1} = ${pA2}`, acceptedAnswers: [`${totA}-${pA1}=${pA2}`] },
          { label: `Write the working equation to find the number of ${theme.subgroup2} in ${catB.category}:`, expectedAnswer: `${totB} - ${pB1} = ${pB2}`, acceptedAnswers: [`${totB}-${pB1}=${pB2}`] },
          { label: `Write the working equation to find how many more ${theme.subgroup2} there are in ${itemMore.category} than ${itemLess.category}:`, expectedAnswer: `${largerP2} - ${smallerP2} = ${diff}`, acceptedAnswers: [`${largerP2}-${smallerP2}=${diff}`] },
          { label: `Difference in ${theme.subgroup2}:`, expectedAnswer: String(diff), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(diff);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, how many more ${theme.subgroup2} are there in ${itemMore.category} than in ${itemLess.category}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(diff);
        const opts = getFourOptions(finalAnswer, [String(diff + scaleStep), String(diff - scaleStep > 0 ? diff - scaleStep : diff + scaleStep * 2), String(largerP2), String(Math.abs(totA - totB))]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"In ${catA.category}, ${pA1} are ${theme.subgroup1} and the rest are ${theme.subgroup2}. In ${catB.category}, ${pB1} are ${theme.subgroup1} and the rest are ${theme.subgroup2}. How many more ${theme.subgroup2} are there in ${itemMore.category} than in ${itemLess.category}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(diff);
      }

    // ========================================================================
    // SUB-TYPE 3: Combined Subgroup Across Two Categories
    // ========================================================================
    } else if (subType === 3) {
      const catA = data[0];
      const catB = data[1];
      const totA = catA.value;
      const totB = catB.value;
      const pA1 = Math.max(scaleStep, Math.floor((totA / scaleStep) * 0.4) * scaleStep);
      const pB1 = Math.max(scaleStep, Math.floor((totB / scaleStep) * 0.5) * scaleStep);
      const pA2 = totA - pA1;
      const pB2 = totB - pB1;
      const combSum = pA2 + pB2;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. In ${catA.category}, ${pA1} of the ${theme.unit} are ${theme.subgroup1} and the rest are ${theme.subgroup2}. In ${catB.category}, ${pB1} of the ${theme.unit} are ${theme.subgroup1} and the rest are ${theme.subgroup2}. How many ${theme.subgroup2} are there in ${catA.category} and ${catB.category} combined?"`;
        const stepsArr = [
          { label: `Write the working equation to find the number of ${theme.subgroup2} in ${catA.category}:`, expectedAnswer: `${totA} - ${pA1} = ${pA2}`, acceptedAnswers: [`${totA}-${pA1}=${pA2}`] },
          { label: `Write the working equation to find the number of ${theme.subgroup2} in ${catB.category}:`, expectedAnswer: `${totB} - ${pB1} = ${pB2}`, acceptedAnswers: [`${totB}-${pB1}=${pB2}`] },
          { label: `Write the working equation to find the total number of ${theme.subgroup2} in both categories combined:`, expectedAnswer: `${pA2} + ${pB2} = ${combSum}`, acceptedAnswers: [
            `${pB2} + ${pA2} = ${combSum}`,
            `${pA2}+${pB2}=${combSum}`,
            `${pB2}+${pA2}=${combSum}`
          ] },
          { label: `Total number of ${theme.subgroup2}:`, expectedAnswer: String(combSum), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(combSum);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, how many ${theme.subgroup2} are there in ${catA.category} and ${catB.category} combined?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(combSum);
        const opts = getFourOptions(finalAnswer, [String(combSum + scaleStep), String(totA + totB), String(pA1 + pB1), String(combSum - scaleStep > 0 ? combSum - scaleStep : combSum + scaleStep * 2)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()}. In ${catA.category}, ${pA1} are ${theme.subgroup1}. In ${catB.category}, ${pB1} are ${theme.subgroup1}. How many ${theme.subgroup2} are there in ${catA.category} and ${catB.category} combined?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(combSum);
      }

    // ========================================================================
    // SUB-TYPE 4: Fractional Breakdown (Half / One-quarter of a Category)
    // ========================================================================
    } else if (subType === 4) {
      const targetCat = data[0];
      const tot = targetCat.value;
      const isQuarter = tot % 4 === 0 && Math.random() > 0.5;
      const fractionStr = isQuarter ? "one-quarter (1/4)" : "half (1/2)";
      const divisor = isQuarter ? 4 : 2;
      const p1 = tot / divisor;
      const p2 = tot - p1;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. Exactly ${fractionStr} of the ${theme.unit} in ${targetCat.category} are ${theme.subgroup1} and the rest are ${theme.subgroup2}. Read the graph to find the total for ${targetCat.category}, and calculate how many ${theme.subgroup2} there are in ${targetCat.category}."`;
        const stepsArr = isQuarter ? [
          { label: `Total number of ${theme.unit} for ${targetCat.category} shown on the graph:`, expectedAnswer: String(tot), acceptedAnswers: [] },
          { label: `Write the working equation to find the number of ${theme.subgroup1} (${tot} ÷ 4):`, expectedAnswer: `${tot} / 4 = ${p1}`, acceptedAnswers: [
            `${tot} ÷ 4 = ${p1}`,
            `${tot}/4=${p1}`,
            `${tot}÷4=${p1}`
          ] },
          { label: `Write the working equation to find the number of ${theme.subgroup2} (${tot} - ${p1}):`, expectedAnswer: `${tot} - ${p1} = ${p2}`, acceptedAnswers: [`${tot}-${p1}=${p2}`] },
          { label: `Number of ${theme.subgroup2} in ${targetCat.category}:`, expectedAnswer: String(p2), acceptedAnswers: [] }
        ] : [
          { label: `Total number of ${theme.unit} for ${targetCat.category} shown on the graph:`, expectedAnswer: String(tot), acceptedAnswers: [] },
          { label: `Write the working equation to find half (${tot} ÷ 2):`, expectedAnswer: `${tot} / 2 = ${p2}`, acceptedAnswers: [
            `${tot} ÷ 2 = ${p2}`,
            `${tot}/2=${p2}`,
            `${tot}÷2=${p2}`
          ] },
          { label: `Number of ${theme.subgroup2} in ${targetCat.category}:`, expectedAnswer: String(p2), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(p2);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, exactly ${fractionStr} of the ${theme.unit} in ${targetCat.category} are ${theme.subgroup1} and the rest are ${theme.subgroup2}. How many ${theme.subgroup2} are there in ${targetCat.category}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(p2);
        const opts = getFourOptions(finalAnswer, [String(p1), String(p2 + scaleStep), String(p2 - scaleStep > 0 ? p2 - scaleStep : p2 + scaleStep * 2), String(tot / 2)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()}. Exactly ${fractionStr} of ${targetCat.category} are ${theme.subgroup1} and the rest are ${theme.subgroup2}. How many ${theme.subgroup2} are in ${targetCat.category}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(p2);
      }

    // ========================================================================
    // SUB-TYPE 5: Internal Ratio / Multiplier Relationship (Twice as many)
    // ========================================================================
    } else if (subType === 5) {
      const targetCat = data[0];
      const tot = targetCat.value;
      const unitValue = tot / 3;
      const p1 = unitValue * 2; // subgroup1 is twice as many
      const p2 = unitValue;     // subgroup2 is 1 unit

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. In ${targetCat.category}, there are twice as many ${theme.subgroup1} as ${theme.subgroup2}. Read the total for ${targetCat.category} from the graph, and calculate how many ${theme.subgroup1} there are in ${targetCat.category}."`;
        const stepsArr = [
          { label: `Total number of ${theme.unit} for ${targetCat.category} shown on the graph:`, expectedAnswer: String(tot), acceptedAnswers: [] },
          { label: `Write the working equation to find 1 unit of ${theme.subgroup2} (${tot} ÷ 3):`, expectedAnswer: `${tot} / 3 = ${p2}`, acceptedAnswers: [
            `${tot} ÷ 3 = ${p2}`,
            `${tot}/3=${p2}`,
            `${tot}÷3=${p2}`
          ] },
          { label: `Write the working equation to find 2 units of ${theme.subgroup1} (${p2} x 2):`, expectedAnswer: `${p2} x 2 = ${p1}`, acceptedAnswers: getMultiplicationAcceptedAnswers(p2, 2, p1) },
          { label: `Number of ${theme.subgroup1} in ${targetCat.category}:`, expectedAnswer: String(p1), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(p1);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"In ${targetCat.category}, there are twice as many ${theme.subgroup1} as ${theme.subgroup2}. Based on the bar graph, how many ${theme.subgroup1} are there in ${targetCat.category}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(p1);
        const opts = getFourOptions(finalAnswer, [String(p2), String(p1 + scaleStep), String(p1 - scaleStep > 0 ? p1 - scaleStep : p1 + scaleStep * 2), String(tot)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()}. In ${targetCat.category}, there are twice as many ${theme.subgroup1} as ${theme.subgroup2}. How many ${theme.subgroup1} are there in ${targetCat.category}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(p1);
      }

    // ========================================================================
    // SUB-TYPE 6: Reverse Deduction - Missing Bar from Shared Subgroup
    // ========================================================================
    } else if (subType === 6) {
      const catMissing = data[0];
      const catKnown = data[1];
      const totKnown = catKnown.value;
      const pK1 = Math.max(scaleStep, Math.floor((totKnown / scaleStep) * 0.4) * scaleStep);
      const pK2 = totKnown - pK1;
      const pM1 = Math.max(scaleStep, Math.floor(pK1 * 0.8 / scaleStep) * scaleStep || scaleStep);
      const actualTotMissing = pM1 + pK2;
      catMissing.value = actualTotMissing;
      missingBarName = catMissing.category;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. The bar for ${catMissing.category} is missing. In ${catKnown.category}, there are ${pK1} ${theme.subgroup1}. ${catMissing.category} has the exact same number of ${theme.subgroup2} as ${catKnown.category}, and has ${pM1} ${theme.subgroup1}. Read the bar for ${catKnown.category} from the graph to find its number of ${theme.subgroup2}, and calculate the total number of ${theme.unit} for ${catMissing.category}."`;
        const stepsArr = [
          { label: `Total number of ${theme.unit} for ${catKnown.category} shown on the graph:`, expectedAnswer: String(totKnown), acceptedAnswers: [] },
          { label: `Write the working equation to find the number of ${theme.subgroup2} in ${catKnown.category} (${totKnown} - ${pK1}):`, expectedAnswer: `${totKnown} - ${pK1} = ${pK2}`, acceptedAnswers: [`${totKnown}-${pK1}=${pK2}`] },
          { label: `Write the working equation to find the total for ${catMissing.category} (${pM1} + ${pK2}):`, expectedAnswer: `${pM1} + ${pK2} = ${actualTotMissing}`, acceptedAnswers: [
            `${pK2} + ${pM1} = ${actualTotMissing}`,
            `${pM1}+${pK2}=${actualTotMissing}`,
            `${pK2}+${pM1}=${actualTotMissing}`
          ] },
          { label: `Total number of ${theme.unit} for ${catMissing.category}:`, expectedAnswer: String(actualTotMissing), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(actualTotMissing);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar for ${catMissing.category} is missing. In ${catKnown.category}, there are ${pK1} ${theme.subgroup1}. ${catMissing.category} has the same number of ${theme.subgroup2} as ${catKnown.category} and has ${pM1} ${theme.subgroup1}. What is the total value of ${catMissing.category}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(actualTotMissing);
        const opts = getFourOptions(finalAnswer, [String(actualTotMissing + scaleStep), String(actualTotMissing - scaleStep > 0 ? actualTotMissing - scaleStep : actualTotMissing + scaleStep * 2), String(totKnown), String(pM1 + pK1)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"On the bar graph, the bar for ${catMissing.category} is missing. In ${catKnown.category}, there are ${pK1} ${theme.subgroup1}. ${catMissing.category} has the same number of ${theme.subgroup2} as ${catKnown.category} and has ${pM1} ${theme.subgroup1}. What is the total number of ${theme.unit} for ${catMissing.category}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(actualTotMissing);
      }

    // ========================================================================
    // SUB-TYPE 7: Reverse Deduction - Missing Bar from Subgroup Comparison
    // ========================================================================
    } else {
      const catMissing = data[0];
      const catKnown = data[1];
      const totKnown = catKnown.value;
      const pK2 = Math.max(scaleStep, Math.floor((totKnown / scaleStep) * 0.4) * scaleStep);
      const pK1 = totKnown - pK2;
      const diff = scaleStep * getRandomInt(1, 2);
      const pM1 = pK1 + diff;
      const pM2 = Math.max(scaleStep, Math.floor(pK2 * 0.8 / scaleStep) * scaleStep || scaleStep);
      const actualTotMissing = pM1 + pM2;
      catMissing.value = actualTotMissing;
      missingBarName = catMissing.category;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. The bar for ${catMissing.category} is missing. In ${catKnown.category}, there are ${pK2} ${theme.subgroup2}. In ${catMissing.category}, there are ${diff} more ${theme.subgroup1} than in ${catKnown.category}, and there are ${pM2} ${theme.subgroup2}. Read the total for ${catKnown.category} from the graph, find the number of ${theme.subgroup1} in ${catKnown.category}, and calculate the total number of ${theme.unit} for ${catMissing.category}."`;
        const stepsArr = [
          { label: `Total number of ${theme.unit} for ${catKnown.category} shown on the graph:`, expectedAnswer: String(totKnown), acceptedAnswers: [] },
          { label: `Write the working equation to find the number of ${theme.subgroup1} in ${catKnown.category} (${totKnown} - ${pK2}):`, expectedAnswer: `${totKnown} - ${pK2} = ${pK1}`, acceptedAnswers: [`${totKnown}-${pK2}=${pK1}`] },
          { label: `Write the working equation to find the number of ${theme.subgroup1} in ${catMissing.category} (${pK1} + ${diff}):`, expectedAnswer: `${pK1} + ${diff} = ${pM1}`, acceptedAnswers: [
            `${diff} + ${pK1} = ${pM1}`,
            `${pK1}+${diff}=${pM1}`,
            `${diff}+${pK1}=${pM1}`
          ] },
          { label: `Write the working equation to find the total for ${catMissing.category} (${pM1} + ${pM2}):`, expectedAnswer: `${pM1} + ${pM2} = ${actualTotMissing}`, acceptedAnswers: [
            `${pM2} + ${pM1} = ${actualTotMissing}`,
            `${pM1}+${pM2}=${actualTotMissing}`,
            `${pM2}+${pM1}=${actualTotMissing}`
          ] },
          { label: `Total number of ${theme.unit} for ${catMissing.category}:`, expectedAnswer: String(actualTotMissing), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(actualTotMissing);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar for ${catMissing.category} is missing. In ${catKnown.category}, there are ${pK2} ${theme.subgroup2}. In ${catMissing.category}, there are ${diff} more ${theme.subgroup1} than in ${catKnown.category} and there are ${pM2} ${theme.subgroup2}. What is the total value of ${catMissing.category}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(actualTotMissing);
        const opts = getFourOptions(finalAnswer, [String(actualTotMissing + scaleStep), String(actualTotMissing - scaleStep > 0 ? actualTotMissing - scaleStep : actualTotMissing + scaleStep * 2), String(totKnown), String(pM1)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"On the bar graph, the bar for ${catMissing.category} is missing. In ${catKnown.category}, there are ${pK2} ${theme.subgroup2}. ${catMissing.category} has ${diff} more ${theme.subgroup1} than in ${catKnown.category} and ${pM2} ${theme.subgroup2}. What is the total for ${catMissing.category}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(actualTotMissing);
      }
    }

  // --------------------------------------------------------------------------
  // Variant 10: Before & After Adjustments (Graph as Starting Point)
  // --------------------------------------------------------------------------
  } else if (variant === 'standard_before_after_adjustments') {
    const scaleStep = [2, 5, 10, 20][Math.floor(Math.random() * 4)];
    const orientation = Math.random() < 0.5 ? "vertical" : "horizontal";
    const studentName = getRandomNames(1)[0] || 'Bala';
    const theme = getRandomBeforeAfterTheme(4);

    const mults = [getRandomInt(6, 8), getRandomInt(4, 5), getRandomInt(3, 4), getRandomInt(2, 3)].sort(() => 0.5 - Math.random());
    const data = theme.items.map((cat, idx) => ({ category: cat, value: mults[idx] * scaleStep }));

    const subType = getRandomInt(1, 7);

    // ========================================================================
    // SUB-TYPE 1: Single Category Adjustment (After State - Decrease or Increase)
    // ========================================================================
    if (subType === 1) {
      const isDecrease = Math.random() < 0.6;
      const target = data[0];
      const vStart = target.value;

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

      if (isDecrease) {
        const multMax = Math.max(1, Math.floor(vStart / scaleStep) - 1);
        const delta = scaleStep * getRandomInt(1, multMax);
        const finalVal = vStart - delta;

        if (isStructure) {
          askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the starting ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. Later, ${delta} ${theme.unit} of ${target.category} were ${theme.decreasePast}. Read the starting amount from the graph, and calculate the number of ${theme.unit} of ${target.category} left."`;
          const stepsArr = [
            { label: `Starting number of ${theme.unit} of ${target.category} shown on the graph:`, expectedAnswer: String(vStart), acceptedAnswers: [] },
            { label: `Write the working equation to find the number of ${theme.unit} of ${target.category} left (${vStart} - ${delta}):`, expectedAnswer: `${vStart} - ${delta} = ${finalVal}`, acceptedAnswers: [`${vStart}-${delta}=${finalVal}`] },
            { label: `Final number of ${theme.unit} of ${target.category} left:`, expectedAnswer: String(finalVal), acceptedAnswers: [] }
          ];
          inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
          finalAnswer = String(finalVal);
        } else if (isMCQ) {
          askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays the starting ${theme.title.toLowerCase()}. Later, ${delta} ${theme.unit} of ${target.category} were ${theme.decreasePast}. How many ${theme.unit} of ${target.category} are left?"`;
          inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
          finalAnswer = String(finalVal);
          const opts = getFourOptions(finalAnswer, [String(vStart), String(delta), String(finalVal + scaleStep), String(finalVal - scaleStep > 0 ? finalVal - scaleStep : finalVal + scaleStep * 2)]);
          mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
        } else {
          askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays the starting ${theme.title.toLowerCase()}. If ${delta} ${theme.unit} of ${target.category} were ${theme.decreasePast}, how many ${theme.unit} of ${target.category} are left?"`;
          inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
          finalAnswer = String(finalVal);
        }
      } else {
        const delta = scaleStep * getRandomInt(1, 3);
        const finalVal = vStart + delta;

        if (isStructure) {
          askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the starting ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. Later, ${delta} more ${theme.unit} of ${target.category} were ${theme.increasePast}. Read the starting amount from the graph, and calculate the new total number of ${theme.unit} of ${target.category}."`;
          const stepsArr = [
            { label: `Starting number of ${theme.unit} of ${target.category} shown on the graph:`, expectedAnswer: String(vStart), acceptedAnswers: [] },
            { label: `Write the working equation to find the new total number of ${theme.unit} of ${target.category} (${vStart} + ${delta}):`, expectedAnswer: `${vStart} + ${delta} = ${finalVal}`, acceptedAnswers: [`${delta} + ${vStart} = ${finalVal}`, `${vStart}+${delta}=${finalVal}`, `${delta}+${vStart}=${finalVal}`] },
            { label: `New total number of ${theme.unit} of ${target.category}:`, expectedAnswer: String(finalVal), acceptedAnswers: [] }
          ];
          inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
          finalAnswer = String(finalVal);
        } else if (isMCQ) {
          askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays the starting ${theme.title.toLowerCase()}. Later, ${delta} more ${theme.unit} of ${target.category} were ${theme.increasePast}. What is the new total number of ${theme.unit} of ${target.category}?"`;
          inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
          finalAnswer = String(finalVal);
          const opts = getFourOptions(finalAnswer, [String(vStart), String(delta), String(finalVal + scaleStep), String(finalVal - scaleStep > 0 ? finalVal - scaleStep : finalVal + scaleStep * 2)]);
          mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
        } else {
          askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays the starting ${theme.title.toLowerCase()}. If ${delta} more ${theme.unit} of ${target.category} were ${theme.increasePast}, what is the new total number of ${theme.unit} of ${target.category}?"`;
          inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
          finalAnswer = String(finalVal);
        }
      }

    // ========================================================================
    // SUB-TYPE 2: Independent Adjustments on Two Categories (Comparing After States & Difference)
    // ========================================================================
    } else if (subType === 2) {
      const itemA = data[0];
      const itemB = data[1];
      const vA = itemA.value;
      const vB = itemB.value;

      const soldA = scaleStep * getRandomInt(1, Math.max(1, Math.floor(vA / scaleStep) - 1));
      const finalA = vA - soldA;

      let addB = scaleStep * getRandomInt(1, 3);
      let finalB = vB + addB;
      if (finalA === finalB) {
        addB += scaleStep;
        finalB += scaleStep;
      }

      const moreCat = finalA > finalB ? itemA.category : itemB.category;
      const fewerCat = finalA > finalB ? itemB.category : itemA.category;
      const moreVal = Math.max(finalA, finalB);
      const fewerVal = Math.min(finalA, finalB);
      const diff = moreVal - fewerVal;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the starting ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. Later, ${soldA} ${theme.unit} of ${itemA.category} were ${theme.decreasePast} and ${addB} ${theme.unit} of ${itemB.category} were ${theme.increasePast}. Read the original amounts from the graph, calculate the final amounts of ${itemA.category} and ${itemB.category}, and find out how many more ${theme.unit} of ${moreCat} there are than ${fewerCat} in the end."`;
        const stepsArr = [
          { label: `Write the working equation to find the final number of ${itemA.category} (${vA} - ${soldA}):`, expectedAnswer: `${vA} - ${soldA} = ${finalA}`, acceptedAnswers: [`${vA}-${soldA}=${finalA}`] },
          { label: `Write the working equation to find the final number of ${itemB.category} (${vB} + ${addB}):`, expectedAnswer: `${vB} + ${addB} = ${finalB}`, acceptedAnswers: [`${addB} + ${vB} = ${finalB}`, `${vB}+${addB}=${finalB}`, `${addB}+${vB}=${finalB}`] },
          { label: `Write the working equation to find how many more ${theme.unit} of ${moreCat} there are than ${fewerCat} (${moreVal} - ${fewerVal}):`, expectedAnswer: `${moreVal} - ${fewerVal} = ${diff}`, acceptedAnswers: [`${moreVal}-${fewerVal}=${diff}`] },
          { label: `Difference in ${theme.unit}:`, expectedAnswer: String(diff), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(diff);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays the starting ${theme.title.toLowerCase()}. Later, ${soldA} ${theme.unit} of ${itemA.category} were ${theme.decreasePast} and ${addB} ${theme.unit} of ${itemB.category} were ${theme.increasePast}. How many more ${theme.unit} of ${moreCat} than ${fewerCat} are there in the end?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(diff);
        const opts = getFourOptions(finalAnswer, [String(diff + scaleStep), String(diff - scaleStep > 0 ? diff - scaleStep : diff + scaleStep * 2), String(moreVal), String(fewerVal)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays the starting ${theme.title.toLowerCase()}. If ${soldA} ${theme.unit} of ${itemA.category} were ${theme.decreasePast} and ${addB} ${theme.unit} of ${itemB.category} were ${theme.increasePast}, how many more ${theme.unit} of ${moreCat} than ${fewerCat} are there in the end?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(diff);
      }

    // ========================================================================
    // SUB-TYPE 3: Combined Total Across Categories After Adjustments (Total Remaining)
    // ========================================================================
    } else if (subType === 3) {
      const itemA = data[0];
      const itemB = data[1];
      const vA = itemA.value;
      const vB = itemB.value;

      const soldA = scaleStep * getRandomInt(1, Math.max(1, Math.floor(vA / scaleStep) - 1));
      const finalA = vA - soldA;

      const soldB = scaleStep * getRandomInt(1, Math.max(1, Math.floor(vB / scaleStep) - 1));
      const finalB = vB - soldB;

      const totalRemaining = finalA + finalB;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the starting ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. Later, ${soldA} ${theme.unit} of ${itemA.category} and ${soldB} ${theme.unit} of ${itemB.category} were ${theme.decreasePast}. Read the original amounts from the graph, find how many of each are left, and calculate the total number of ${theme.unit} remaining for both categories combined."`;
        const stepsArr = [
          { label: `Write the working equation to find the number of ${itemA.category} left (${vA} - ${soldA}):`, expectedAnswer: `${vA} - ${soldA} = ${finalA}`, acceptedAnswers: [`${vA}-${soldA}=${finalA}`] },
          { label: `Write the working equation to find the number of ${itemB.category} left (${vB} - ${soldB}):`, expectedAnswer: `${vB} - ${soldB} = ${finalB}`, acceptedAnswers: [`${vB}-${soldB}=${finalB}`] },
          { label: `Write the working equation to find the total number of ${theme.unit} left for both categories combined (${finalA} + ${finalB}):`, expectedAnswer: `${finalA} + ${finalB} = ${totalRemaining}`, acceptedAnswers: [`${finalB} + ${finalA} = ${totalRemaining}`, `${finalA}+${finalB}=${totalRemaining}`, `${finalB}+${finalA}=${totalRemaining}`] },
          { label: `Total number of ${theme.unit} remaining for both categories:`, expectedAnswer: String(totalRemaining), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(totalRemaining);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays the starting ${theme.title.toLowerCase()}. If ${soldA} ${theme.unit} of ${itemA.category} and ${soldB} ${theme.unit} of ${itemB.category} were ${theme.decreasePast}, what is the total number of ${theme.unit} left for both categories combined?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(totalRemaining);
        const opts = getFourOptions(finalAnswer, [String(vA + vB), String(totalRemaining + scaleStep), String(totalRemaining - scaleStep > 0 ? totalRemaining - scaleStep : totalRemaining + scaleStep * 2), String(soldA + soldB)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays the starting ${theme.title.toLowerCase()}. If ${soldA} ${theme.unit} of ${itemA.category} and ${soldB} ${theme.unit} of ${itemB.category} were ${theme.decreasePast}, what is the total number of ${theme.unit} left for both categories combined?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(totalRemaining);
      }

    // ========================================================================
    // SUB-TYPE 4: Transfer / Redistribution Between Two Categories
    // ========================================================================
    } else if (subType === 4) {
      const itemA = data[0];
      const itemB = data[1];
      const vA = itemA.value;
      const vB = itemB.value;

      const transferAmount = scaleStep * getRandomInt(1, Math.max(1, Math.floor(vA / scaleStep) - 1));
      const finalA = vA - transferAmount;
      const finalB = vB + transferAmount;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the starting ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. Later, ${transferAmount} ${theme.unit} of ${itemA.category} were transferred to ${itemB.category}. Read the starting amount of ${itemB.category} from the graph, and calculate the new total number of ${theme.unit} for ${itemB.category}."`;
        const stepsArr = [
          { label: `Starting number of ${theme.unit} for ${itemB.category} shown on the graph:`, expectedAnswer: String(vB), acceptedAnswers: [] },
          { label: `Write the working equation to find the new total for ${itemB.category} (${vB} + ${transferAmount}):`, expectedAnswer: `${vB} + ${transferAmount} = ${finalB}`, acceptedAnswers: [`${transferAmount} + ${vB} = ${finalB}`, `${vB}+${transferAmount}=${finalB}`, `${transferAmount}+${vB}=${finalB}`] },
          { label: `New total number of ${theme.unit} for ${itemB.category}:`, expectedAnswer: String(finalB), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(finalB);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays the starting ${theme.title.toLowerCase()}. If ${transferAmount} ${theme.unit} of ${itemA.category} are transferred to ${itemB.category}, what is the new total number of ${theme.unit} for ${itemB.category}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(finalB);
        const opts = getFourOptions(finalAnswer, [String(vB), String(finalA), String(vA), String(finalB + scaleStep)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays the starting ${theme.title.toLowerCase()}. If ${transferAmount} ${theme.unit} of ${itemA.category} are transferred to ${itemB.category}, what is the new total number of ${theme.unit} for ${itemB.category}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(finalB);
      }

    // ========================================================================
    // SUB-TYPE 5: Equalizing Quantities (How Many More to Match)
    // ========================================================================
    } else if (subType === 5) {
      let itemA = data[0];
      let itemB = data[1];
      if (itemA.value <= itemB.value) {
        const temp = itemA;
        itemA = itemB;
        itemB = temp;
      }
      if (itemA.value - itemB.value < scaleStep * 2) {
        itemA.value = itemB.value + scaleStep * 3;
      }

      const vA = itemA.value;
      const vB = itemB.value;
      const soldA = scaleStep * 1;
      const finalA = vA - soldA;
      const needed = finalA - vB;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the starting ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. Later, ${soldA} ${theme.unit} of ${itemA.category} were ${theme.decreasePast}. Read the graph to find how many ${theme.unit} are left for ${itemA.category}, and calculate how many more ${theme.unit} must be added to ${itemB.category} so that both categories have the exact same amount."`;
        const stepsArr = [
          { label: `Write the working equation to find the remaining number of ${itemA.category} (${vA} - ${soldA}):`, expectedAnswer: `${vA} - ${soldA} = ${finalA}`, acceptedAnswers: [`${vA}-${soldA}=${finalA}`] },
          { label: `Starting number of ${theme.unit} for ${itemB.category} shown on the graph:`, expectedAnswer: String(vB), acceptedAnswers: [] },
          { label: `Write the working equation to find how many more ${theme.unit} are needed for ${itemB.category} (${finalA} - ${vB}):`, expectedAnswer: `${finalA} - ${vB} = ${needed}`, acceptedAnswers: [`${finalA}-${vB}=${needed}`] },
          { label: `Number of ${theme.unit} needed:`, expectedAnswer: String(needed), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(needed);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays the starting ${theme.title.toLowerCase()}. If ${soldA} ${theme.unit} of ${itemA.category} were ${theme.decreasePast}, how many more ${theme.unit} must be added to ${itemB.category} so that both categories have the exact same amount?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(needed);
        const opts = getFourOptions(finalAnswer, [String(finalA), String(vA - vB), String(needed + scaleStep), String(needed - scaleStep > 0 ? needed - scaleStep : needed + scaleStep * 2)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays the starting ${theme.title.toLowerCase()}. If ${soldA} ${theme.unit} of ${itemA.category} were ${theme.decreasePast}, how many more ${theme.unit} must be added to ${itemB.category} so that both categories have the exact same amount?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(needed);
      }

    // ========================================================================
    // SUB-TYPE 6: Reverse Adjustment (Finding Items Decreased / Sold)
    // ========================================================================
    } else if (subType === 6) {
      const target = data[0];
      const vStart = target.value;
      const endVal = scaleStep * getRandomInt(1, Math.max(1, Math.floor(vStart / scaleStep) - 1));
      const decreased = vStart - endVal;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the starting ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. At the end of the day, there are only ${endVal} ${theme.unit} of ${target.category} left. Read the starting amount from the graph, and calculate how many ${theme.unit} of ${target.category} were ${theme.decreasePast}."`;
        const stepsArr = [
          { label: `Starting number of ${theme.unit} for ${target.category} shown on the graph:`, expectedAnswer: String(vStart), acceptedAnswers: [] },
          { label: `Write the working equation to find how many ${theme.unit} were ${theme.decreasePast} (${vStart} - ${endVal}):`, expectedAnswer: `${vStart} - ${endVal} = ${decreased}`, acceptedAnswers: [`${vStart}-${endVal}=${decreased}`] },
          { label: `Number of ${theme.unit} ${theme.decreasePast}:`, expectedAnswer: String(decreased), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(decreased);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays the starting ${theme.title.toLowerCase()}. At the end of the day, there are only ${endVal} ${theme.unit} of ${target.category} left. How many ${theme.unit} of ${target.category} were ${theme.decreasePast}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(decreased);
        const opts = getFourOptions(finalAnswer, [String(vStart), String(endVal), String(decreased + scaleStep), String(decreased - scaleStep > 0 ? decreased - scaleStep : decreased + scaleStep * 2)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays the starting ${theme.title.toLowerCase()}. At the end of the day, there are only ${endVal} ${theme.unit} of ${target.category} left. How many ${theme.unit} of ${target.category} were ${theme.decreasePast}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(decreased);
      }

    // ========================================================================
    // SUB-TYPE 7: Target Shortfall After Multiple Additions
    // ========================================================================
    } else {
      const targetCat = data[0];
      const vStart = targetCat.value;
      const add1 = scaleStep * getRandomInt(1, 2);
      const add2 = scaleStep * 1;
      const current = vStart + add1 + add2;
      const shortfall = scaleStep * getRandomInt(1, 2);
      const targetGoal = current + shortfall;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the starting ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. The target goal is to have ${targetGoal} ${theme.unit} of ${targetCat.category}. Later, ${add1} ${theme.unit} were ${theme.increasePast} in the morning and ${add2} ${theme.unit} were ${theme.increasePast} in the afternoon. Read the starting amount from the graph, find the current total, and calculate how many more ${theme.unit} are still needed to reach the target."`;
        const stepsArr = [
          { label: `Starting number of ${theme.unit} for ${targetCat.category} shown on the graph:`, expectedAnswer: String(vStart), acceptedAnswers: [] },
          { label: `Write the working equation to find the total number of ${theme.unit} collected so far (${vStart} + ${add1} + ${add2}):`, expectedAnswer: `${vStart} + ${add1} + ${add2} = ${current}`, acceptedAnswers: [
            `${vStart}+${add1}+${add2}=${current}`,
            `${add1} + ${add2} + ${vStart} = ${current}`,
            `${add1}+${add2}+${vStart}=${current}`,
            `${add2} + ${add1} + ${vStart} = ${current}`
          ] },
          { label: `Write the working equation to find how many more ${theme.unit} are needed to reach the target of ${targetGoal} (${targetGoal} - ${current}):`, expectedAnswer: `${targetGoal} - ${current} = ${shortfall}`, acceptedAnswers: [`${targetGoal}-${current}=${shortfall}`] },
          { label: `Number of ${theme.unit} still needed:`, expectedAnswer: String(shortfall), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(shortfall);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The target goal is to have ${targetGoal} ${theme.unit} of ${targetCat.category}. The bar graph shows the starting amount. If ${add1} ${theme.unit} were ${theme.increasePast} in the morning and ${add2} in the afternoon, how many more ${theme.unit} are needed to reach the target?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(shortfall);
        const opts = getFourOptions(finalAnswer, [String(current), String(targetGoal - vStart), String(shortfall + scaleStep), String(shortfall - scaleStep > 0 ? shortfall - scaleStep : shortfall + scaleStep * 2)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The target goal is to have ${targetGoal} ${theme.unit} of ${targetCat.category}. The bar graph displays the starting amount. If ${add1} ${theme.unit} were ${theme.increasePast} in the morning and ${add2} in the afternoon, how many more ${theme.unit} are needed to reach the target?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(shortfall);
      }
    }
  }

  const aiPrompt = `CRITICAL INSTRUCTIONS:
1. You MUST use the exact "questionText" provided below.
2. You MUST use the exact "finalAnswer" provided below.
3. Generate detailed, pedagogical "solutionSteps" explaining the reading of the bar graph and calculation.
${mcqOptionsPrompt}

${getFormatInstructions(visualEngineStr, inputRequirementStr, askText, finalAnswer)}`;

  return { aiPrompt };
};
