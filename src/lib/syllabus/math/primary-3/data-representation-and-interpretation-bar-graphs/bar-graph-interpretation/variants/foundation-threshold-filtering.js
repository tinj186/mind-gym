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

export function generateFoundationThresholdFiltering({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

    const scaleOptions = [2, 5, 10];
    const scaleStep = scaleOptions[getRandomInt(0, 2)];
    const theme = getRandomBarGraphTheme(4);
    const orientation = Math.random() > 0.5 ? "vertical" : "horizontal";

    // Condition: 'more_than' vs 'fewer_than'
    const condition = Math.random() > 0.5 ? 'more_than' : 'fewer_than';
    const condPhrase = condition === 'more_than' ? 'more than' : 'fewer than';

    // Pick a threshold appropriate for scaleStep
    let threshold;
    let belowPool = [];
    let abovePool = [];

    if (scaleStep === 2) {
      // Thresholds: 10, 12, 14, 16, 18, 20
      const tOptions = [10, 12, 14, 16, 18, 20];
      threshold = tOptions[getRandomInt(0, tOptions.length - 1)];
      belowPool = [threshold - 8, threshold - 6, threshold - 4, threshold - 2].filter(v => v >= 2);
      abovePool = [threshold + 2, threshold + 4, threshold + 6, threshold + 8];
    } else if (scaleStep === 5) {
      // Thresholds: 20, 25, 30, 35, 40, 45
      const tOptions = [20, 25, 30, 35, 40, 45];
      threshold = tOptions[getRandomInt(0, tOptions.length - 1)];
      belowPool = [threshold - 15, threshold - 10, threshold - 5].filter(v => v >= 5);
      abovePool = [threshold + 5, threshold + 10, threshold + 15, threshold + 20];
    } else {
      // scaleStep === 10: Thresholds: 30, 40, 50, 60, 70
      const tOptions = [30, 40, 50, 60, 70];
      threshold = tOptions[getRandomInt(0, tOptions.length - 1)];
      belowPool = [threshold - 30, threshold - 20, threshold - 10].filter(v => v >= 10);
      abovePool = [threshold + 10, threshold + 20, threshold + 30, threshold + 40];
    }

    // Number of qualifying categories: 2 or 3
    const qualifyingCount = Math.random() > 0.35 ? 2 : 3;
    const nonQualifyingCount = 4 - qualifyingCount;

    // Shuffle pools
    belowPool.sort(() => 0.5 - Math.random());
    abovePool.sort(() => 0.5 - Math.random());

    let pickedQualifying = [];
    let pickedNonQualifying = [];

    if (condition === 'more_than') {
      pickedQualifying = abovePool.slice(0, qualifyingCount);
      pickedNonQualifying = belowPool.slice(0, nonQualifyingCount);
    } else {
      pickedQualifying = belowPool.slice(0, qualifyingCount);
      pickedNonQualifying = abovePool.slice(0, nonQualifyingCount);
    }

    // Combine and shuffle all 4 values to ensure completely randomized graph shapes
    const combinedValues = [...pickedQualifying, ...pickedNonQualifying].sort(() => 0.5 - Math.random());

    const data = theme.items.slice(0, 4).map((cat, idx) => ({
      category: cat,
      value: combinedValues[idx]
    }));

    const qualifying = condition === 'more_than'
      ? data.filter(d => d.value > threshold)
      : data.filter(d => d.value < threshold);

    const qualifyingValues = qualifying.map(q => q.value);
    const sum = qualifyingValues.reduce((a, b) => a + b, 0);

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
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. Look at the graph to identify the categories that have ${condPhrase} ${threshold} ${theme.unit}. Calculate the total combined ${theme.unit} from just those specific categories."`;
      
      let stepsArr = [];
      if (qualifyingCount === 2) {
        const v1 = qualifyingValues[0];
        const v2 = qualifyingValues[1];
        stepsArr = [
          { label: `List the values of the categories with ${condPhrase} ${threshold} ${theme.unit} (separated by a comma):`, expectedAnswer: `${v1}, ${v2}`, acceptedAnswers: [`${v2}, ${v1}`, `${v1},${v2}`, `${v2},${v1}`] },
          { label: "Write the working equation to find their total:", expectedAnswer: `${v1} + ${v2} = ${sum}`, acceptedAnswers: [`${v2} + ${v1} = ${sum}`, `${v1}+${v2}=${sum}`, `${v2}+${v1}=${sum}`] },
          { label: `Total ${theme.unit}:`, expectedAnswer: String(sum), acceptedAnswers: [] }
        ];
      } else {
        const v1 = qualifyingValues[0];
        const v2 = qualifyingValues[1];
        const v3 = qualifyingValues[2];
        stepsArr = [
          { label: `List the values of the categories with ${condPhrase} ${threshold} ${theme.unit} (separated by a comma):`, expectedAnswer: `${v1}, ${v2}, ${v3}`, acceptedAnswers: [
            `${v1}, ${v3}, ${v2}`, `${v2}, ${v1}, ${v3}`, `${v2}, ${v3}, ${v1}`, `${v3}, ${v1}, ${v2}`, `${v3}, ${v2}, ${v1}`,
            `${v1},${v2},${v3}`, `${v1},${v3},${v2}`, `${v2},${v1},${v3}`, `${v2},${v3},${v1}`, `${v3},${v1},${v2}`, `${v3},${v2},${v1}`
          ] },
          { label: "Write the working equation to find their total:", expectedAnswer: `${v1} + ${v2} + ${v3} = ${sum}`, acceptedAnswers: [
            `${v1}+${v2}+${v3}=${sum}`,
            `${v1} + ${v3} + ${v2} = ${sum}`,
            `${v2} + ${v1} + ${v3} = ${sum}`,
            `${v2} + ${v3} + ${v1} = ${sum}`,
            `${v3} + ${v1} + ${v2} = ${sum}`,
            `${v3} + ${v2} + ${v1} = ${sum}`
          ] },
          { label: `Total ${theme.unit}:`, expectedAnswer: String(sum), acceptedAnswers: [] }
        ];
      }

      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      finalAnswer = String(sum);
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Look at the bar graph of ${theme.title.toLowerCase()}. What is the total combined number of ${theme.unit} for the categories that have ${condPhrase} ${threshold} ${theme.unit}?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
      finalAnswer = String(sum);
      const opts = getFourOptions(finalAnswer, [String(qualifyingValues[0]), String(sum + scaleStep), String(sum - scaleStep > 0 ? sum - scaleStep : sum + scaleStep * 2), String(qualifyingValues[1] || sum + scaleStep * 3)]);
      mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()} with a scale step of ${scaleStep}. What is the total combined ${theme.unit} from all categories that have ${condPhrase} ${threshold} ${theme.unit}?"`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      finalAnswer = String(sum);
    }

  // --------------------------------------------------------------------------
  // Variant 4: Reverse Reading (Category Deduction)
  // --------------------------------------------------------------------------

  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
