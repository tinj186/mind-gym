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

export function generateFoundationDirectCombination({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

    const scaleOptions = [2, 5, 10];
    const scaleStep = scaleOptions[getRandomInt(0, 2)];
    const theme = getRandomBarGraphTheme(4);

    // Generate values directly on grid lines (multiples of scaleStep)
    const multiplierPool = [2, 3, 4, 5, 6, 7];
    const shuffledMultipliers = multiplierPool.sort(() => 0.5 - Math.random());
    const data = theme.items.slice(0, 4).map((cat, idx) => ({
      category: cat,
      value: shuffledMultipliers[idx] * scaleStep
    }));

    // Randomize category ordering so we don't always pick items 0 and 1
    const shuffledIndices = [0, 1, 2, 3].sort(() => 0.5 - Math.random());

    // Sub-types:
    // 1: Total of 2 categories
    // 2: Total of 3 categories
    // 3: Given grand total of all 4 categories, find the missing bar value
    // 4: Given combined total of 2 categories, find the missing bar value
    const subType = getRandomInt(1, 4);

    // ========================================================================
    // SUB-TYPE 1: Total of 2 categories
    // ========================================================================
    if (subType === 1) {
      const idx1 = shuffledIndices[0];
      const idx2 = shuffledIndices[1];
      const cat1 = data[idx1].category;
      const cat2 = data[idx2].category;
      const val1 = data[idx1].value;
      const val2 = data[idx2].value;
      const sum = val1 + val2;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep,
          orientation: "vertical",
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. The scale goes up in steps of ${scaleStep}. Read the bar graph carefully. Find the ${getContextQuery(theme, [cat1, cat2])}, and calculate their total combined amount."`;
        const stepsArr = [
          { label: `Number of ${theme.unit} for ${cat1} shown on the graph:`, expectedAnswer: String(val1), acceptedAnswers: [] },
          { label: `Number of ${theme.unit} for ${cat2} shown on the graph:`, expectedAnswer: String(val2), acceptedAnswers: [] },
          { label: "Write the working equation to find the total:", expectedAnswer: `${val1} + ${val2} = ${sum}`, acceptedAnswers: [`${val2} + ${val1} = ${sum}`, `${val1}+${val2}=${sum}`, `${val2}+${val1}=${sum}`] },
          { label: `Total ${theme.unit}:`, expectedAnswer: String(sum), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(sum);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Look at the bar graph of ${theme.title.toLowerCase()}. What is the total combined ${getContextQuery(theme, [cat1, cat2])}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(sum);
        const opts = getFourOptions(finalAnswer, [String(val1), String(val2), String(sum + scaleStep), String(sum - scaleStep > 0 ? sum - scaleStep : sum + scaleStep * 2)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()} with a scale step of ${scaleStep}. What is the total combined ${getContextQuery(theme, [cat1, cat2])}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(sum);
      }

    // ========================================================================
    // SUB-TYPE 2: Total of 3 categories
    // ========================================================================
    } else if (subType === 2) {
      const idx1 = shuffledIndices[0];
      const idx2 = shuffledIndices[1];
      const idx3 = shuffledIndices[2];
      const cat1 = data[idx1].category;
      const cat2 = data[idx2].category;
      const cat3 = data[idx3].category;
      const val1 = data[idx1].value;
      const val2 = data[idx2].value;
      const val3 = data[idx3].value;
      const sum = val1 + val2 + val3;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep,
          orientation: "vertical",
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. The scale goes up in steps of ${scaleStep}. Read the bar graph carefully. Find the ${getContextQuery(theme, [cat1, cat2, cat3])}, and calculate their total combined amount."`;
        const stepsArr = [
          { label: `Number of ${theme.unit} for ${cat1} shown on the graph:`, expectedAnswer: String(val1), acceptedAnswers: [] },
          { label: `Number of ${theme.unit} for ${cat2} shown on the graph:`, expectedAnswer: String(val2), acceptedAnswers: [] },
          { label: `Number of ${theme.unit} for ${cat3} shown on the graph:`, expectedAnswer: String(val3), acceptedAnswers: [] },
          { label: "Write the working equation to find the total:", expectedAnswer: `${val1} + ${val2} + ${val3} = ${sum}`, acceptedAnswers: [
            `${val1}+${val2}+${val3}=${sum}`,
            `${val1} + ${val3} + ${val2} = ${sum}`,
            `${val2} + ${val1} + ${val3} = ${sum}`,
            `${val2} + ${val3} + ${val1} = ${sum}`,
            `${val3} + ${val1} + ${val2} = ${sum}`,
            `${val3} + ${val2} + ${val1} = ${sum}`
          ] },
          { label: `Total ${theme.unit}:`, expectedAnswer: String(sum), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(sum);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Look at the bar graph of ${theme.title.toLowerCase()}. What is the total combined ${getContextQuery(theme, [cat1, cat2, cat3])}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(sum);
        const opts = getFourOptions(finalAnswer, [String(val1 + val2), String(sum + scaleStep), String(sum - scaleStep > 0 ? sum - scaleStep : sum + scaleStep * 2), String(val2 + val3)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows ${theme.title.toLowerCase()} with a scale step of ${scaleStep}. How many ${theme.unit} did ${cat1}, ${cat2}, and ${cat3} have altogether?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(sum);
      }

    // ========================================================================
    // SUB-TYPE 3: Given grand total of all 4 categories, find the missing bar value
    // ========================================================================
    } else if (subType === 3) {
      const missingIdx = shuffledIndices[3];
      const missingCat = data[missingIdx].category;
      const missingVal = data[missingIdx].value;

      const c1 = data[shuffledIndices[0]];
      const c2 = data[shuffledIndices[1]];
      const c3 = data[shuffledIndices[2]];

      const sumKnown = c1.value + c2.value + c3.value;
      const grandTotal = sumKnown + missingVal;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep,
          orientation: "vertical",
          showGridLines: true,
          missingBar: missingCat
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. The grand total for all 4 categories combined is ${grandTotal} ${theme.unit}. However, the bar for ${missingCat} is missing. Read the graph carefully, find the total of the other three categories, and calculate the missing number of ${theme.unit} for ${missingCat}."`;
        const stepsArr = [
          { label: `Write the working equation to find the total for ${c1.category}, ${c2.category}, and ${c3.category} combined:`, expectedAnswer: `${c1.value} + ${c2.value} + ${c3.value} = ${sumKnown}`, acceptedAnswers: [`${c1.value}+${c2.value}+${c3.value}=${sumKnown}`] },
          { label: `Write the working equation to find the missing ${theme.unit} for ${missingCat} (Grand Total - Known Sum):`, expectedAnswer: `${grandTotal} - ${sumKnown} = ${missingVal}`, acceptedAnswers: [`${grandTotal}-${sumKnown}=${missingVal}`] },
          { label: `Number of ${theme.unit} for ${missingCat}:`, expectedAnswer: String(missingVal), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(missingVal);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The grand total across all 4 categories is ${grandTotal} ${theme.unit}. Based on the bar graph, how many ${theme.unit} are there in ${missingCat} (the missing bar)?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(missingVal);
        const opts = getFourOptions(finalAnswer, [String(missingVal + scaleStep), String(missingVal - scaleStep > 0 ? missingVal - scaleStep : missingVal + scaleStep * 2), String(grandTotal - c1.value), String(sumKnown)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()}. The grand total for all 4 categories combined is ${grandTotal} ${theme.unit}. The bar for ${missingCat} is missing. What is the value of ${missingCat}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(missingVal);
      }

    // ========================================================================
    // SUB-TYPE 4: Given combined total of 2 categories, find the missing bar value
    // ========================================================================
    } else {
      const idxKnown = shuffledIndices[0];
      const idxMissing = shuffledIndices[1];

      const knownCat = data[idxKnown].category;
      const knownVal = data[idxKnown].value;
      const missingCat = data[idxMissing].category;
      const missingVal = data[idxMissing].value;

      const pairTotal = knownVal + missingVal;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: theme.xAxisLabel,
          yAxisLabel: theme.yAxisLabel,
          data,
          scaleStep,
          orientation: "vertical",
          showGridLines: true,
          missingBar: missingCat
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. The bar for ${missingCat} is missing. The combined total for ${knownCat} and ${missingCat} is ${pairTotal} ${theme.unit}. Read the number of ${theme.unit} for ${knownCat} from the graph, and calculate the missing value for ${missingCat}."`;
        const stepsArr = [
          { label: `Number of ${theme.unit} for ${knownCat} shown on the graph:`, expectedAnswer: String(knownVal), acceptedAnswers: [] },
          { label: `Write the working equation to find the missing ${theme.unit} for ${missingCat} (Combined Total - ${knownCat}):`, expectedAnswer: `${pairTotal} - ${knownVal} = ${missingVal}`, acceptedAnswers: [`${pairTotal}-${knownVal}=${missingVal}`] },
          { label: `Number of ${theme.unit} for ${missingCat}:`, expectedAnswer: String(missingVal), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(missingVal);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The combined total for ${knownCat} and ${missingCat} is ${pairTotal} ${theme.unit}. Based on the bar graph, how many ${theme.unit} are there in ${missingCat} (the missing bar)?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(missingVal);
        const opts = getFourOptions(finalAnswer, [String(knownVal), String(pairTotal), String(missingVal + scaleStep), String(missingVal - scaleStep > 0 ? missingVal - scaleStep : missingVal + scaleStep * 2)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()}. The bar for ${missingCat} is missing. If ${knownCat} and ${missingCat} have a combined total of ${pairTotal} ${theme.unit}, how many ${theme.unit} belong to ${missingCat}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(missingVal);
      }
    }

  // --------------------------------------------------------------------------
  // Variant 2: Finding the Difference (Highest/Lowest, Ordinal Rankings & Inverse Deductions)
  // --------------------------------------------------------------------------

  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
