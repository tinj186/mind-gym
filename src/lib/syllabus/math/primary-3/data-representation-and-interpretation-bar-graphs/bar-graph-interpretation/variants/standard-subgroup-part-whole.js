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

export function generateStandardSubgroupPartWhole({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

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

  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
