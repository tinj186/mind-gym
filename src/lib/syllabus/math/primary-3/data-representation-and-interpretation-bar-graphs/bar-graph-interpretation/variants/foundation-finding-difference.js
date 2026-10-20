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

export function generateFoundationFindingDifference({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

    const scaleOptions = [2, 5, 10];
    const scaleStep = scaleOptions[getRandomInt(0, 2)];
    const theme = getRandomBarGraphTheme(4);

    // Generate 4 strictly distinct values so ranking is unambiguous
    const multiplierPool = [2, 3, 4, 6, 7, 8, 9];
    const chosenMultipliers = multiplierPool.sort(() => 0.5 - Math.random()).slice(0, 4);
    
    // Assign to categories
    const data = theme.items.slice(0, 4).map((cat, idx) => ({
      category: cat,
      value: chosenMultipliers[idx] * scaleStep
    }));

    // Sorted descending by value: [0] = 1st most, [1] = 2nd most, [2] = 3rd most, [3] = least
    const sorted = [...data].sort((a, b) => b.value - a.value);

    // Sub-types:
    // 1: Ranked Ordinal Comparison (1st vs least, 1st vs 2nd, 2nd vs least, 2nd vs 3rd) -> find c (a - b = c)
    // 2: Specific Named Pair Comparison -> find c (a - b = c)
    // 3: Given b and difference c, find a (b + c = a)
    // 4: Given a and difference c, find b (a - c = b)
    // 5: Reverse Category Deduction -> given base and difference, identify category a
    const subType = getRandomInt(1, 5);

    let orientation = Math.random() > 0.5 ? "horizontal" : "vertical";
    let missingBarName = "";

    // ========================================================================
    // SUB-TYPE 1: Ranked Ordinal Comparisons (1st, 2nd, 3rd, Least)
    // ========================================================================
    if (subType === 1) {
      const rankPairs = [
        {
          idxA: 0, idxB: 3,
          labelA: `the most ${theme.unit}`,
          labelB: `the fewest ${theme.unit}`
        },
        {
          idxA: 0, idxB: 1,
          labelA: `the most ${theme.unit}`,
          labelB: `the 2nd most ${theme.unit}`
        },
        {
          idxA: 1, idxB: 3,
          labelA: `the 2nd most ${theme.unit}`,
          labelB: `the fewest ${theme.unit}`
        },
        {
          idxA: 1, idxB: 2,
          labelA: `the 2nd most ${theme.unit}`,
          labelB: `the 3rd most ${theme.unit}`
        }
      ];

      const pair = rankPairs[getRandomInt(0, rankPairs.length - 1)];
      const itemA = sorted[pair.idxA];
      const itemB = sorted[pair.idxB];
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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A survey recorded the ${theme.title.toLowerCase()} on the bar graph. Look at the bar graph carefully to find the category with ${pair.labelA} and the category with ${pair.labelB}. Then, calculate the difference between them."`;
        const stepsArr = [
          { label: `Number of ${theme.unit} for the category with ${pair.labelA} (${itemA.category}):`, expectedAnswer: String(itemA.value), acceptedAnswers: [] },
          { label: `Number of ${theme.unit} for the category with ${pair.labelB} (${itemB.category}):`, expectedAnswer: String(itemB.value), acceptedAnswers: [] },
          { label: "Write the working equation to find the difference:", expectedAnswer: `${itemA.value} - ${itemB.value} = ${diff}`, acceptedAnswers: [`${itemA.value}-${itemB.value}=${diff}`] },
          { label: "Difference:", expectedAnswer: String(diff), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(diff);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Look at the bar graph of ${theme.title.toLowerCase()}. What is the difference between the category with ${pair.labelA} (${itemA.category}) and the category with ${pair.labelB} (${itemB.category})?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(diff);
        const opts = getFourOptions(finalAnswer, [String(itemA.value), String(itemB.value), String(diff + scaleStep), String(diff - scaleStep > 0 ? diff - scaleStep : diff + scaleStep * 2)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()}. What is the difference between the category with ${pair.labelA} (${itemA.category}) and the category with ${pair.labelB} (${itemB.category})?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(diff);
      }

    // ========================================================================
    // SUB-TYPE 2: Specific Named Pair Comparison
    // ========================================================================
    } else if (subType === 2) {
      // Pick any two distinct categories
      const indices = [0, 1, 2, 3].sort(() => 0.5 - Math.random());
      const c1 = data[indices[0]];
      const c2 = data[indices[1]];
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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. Read the graph carefully. How many more ${theme.unit} did ${itemA.category} have than ${itemB.category}?"`;
        const stepsArr = [
          { label: `Number of ${theme.unit} for ${itemA.category} shown on the graph:`, expectedAnswer: String(itemA.value), acceptedAnswers: [] },
          { label: `Number of ${theme.unit} for ${itemB.category} shown on the graph:`, expectedAnswer: String(itemB.value), acceptedAnswers: [] },
          { label: `Write the working equation to find how many more ${theme.unit} ${itemA.category} has than ${itemB.category}:`, expectedAnswer: `${itemA.value} - ${itemB.value} = ${diff}`, acceptedAnswers: [`${itemA.value}-${itemB.value}=${diff}`] },
          { label: "Difference:", expectedAnswer: String(diff), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(diff);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, how many more ${theme.unit} did ${itemA.category} have than ${itemB.category}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(diff);
        const opts = getFourOptions(finalAnswer, [String(itemA.value), String(itemB.value), String(diff + scaleStep), String(diff - scaleStep > 0 ? diff - scaleStep : diff + scaleStep * 2)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows ${theme.title.toLowerCase()}. What is the difference between ${itemA.category} and ${itemB.category}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(diff);
      }

    // ========================================================================
    // SUB-TYPE 3: Given b and difference c, find a (b + c = a)
    // ========================================================================
    } else if (subType === 3) {
      const indices = [0, 1, 2, 3].sort(() => 0.5 - Math.random());
      const c1 = data[indices[0]];
      const c2 = data[indices[1]];
      const itemA = c1.value >= c2.value ? c1 : c2; // larger (a)
      const itemB = c1.value >= c2.value ? c2 : c1; // smaller (b)
      const diff = itemA.value - itemB.value;

      missingBarName = itemA.category;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. The bar for ${itemA.category} is missing. You are told that ${itemA.category} has ${diff} more ${theme.unit} than ${itemB.category}. Read the number of ${theme.unit} for ${itemB.category} from the graph, and calculate the value for ${itemA.category}."`;
        const stepsArr = [
          { label: `Number of ${theme.unit} for ${itemB.category} shown on the graph:`, expectedAnswer: String(itemB.value), acceptedAnswers: [] },
          { label: `Write the working equation to find the value of ${itemA.category} (${itemB.category} + Difference):`, expectedAnswer: `${itemB.value} + ${diff} = ${itemA.value}`, acceptedAnswers: [`${diff} + ${itemB.value} = ${itemA.value}`, `${itemB.value}+${diff}=${itemA.value}`, `${diff}+${itemB.value}=${itemA.value}`] },
          { label: `Number of ${theme.unit} for ${itemA.category}:`, expectedAnswer: String(itemA.value), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(itemA.value);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar for ${itemA.category} is missing. If ${itemA.category} has ${diff} more ${theme.unit} than ${itemB.category}, how many ${theme.unit} does ${itemA.category} have?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(itemA.value);
        const opts = getFourOptions(finalAnswer, [String(itemB.value), String(diff), String(itemA.value + scaleStep), String(itemA.value - scaleStep)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"On the bar graph, the bar for ${itemA.category} is missing. If ${itemA.category} has ${diff} more ${theme.unit} than ${itemB.category}, how many ${theme.unit} are in ${itemA.category}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(itemA.value);
      }

    // ========================================================================
    // SUB-TYPE 4: Given a and difference c, find b (a - c = b)
    // ========================================================================
    } else if (subType === 4) {
      const indices = [0, 1, 2, 3].sort(() => 0.5 - Math.random());
      const c1 = data[indices[0]];
      const c2 = data[indices[1]];
      const itemA = c1.value >= c2.value ? c1 : c2; // larger (a)
      const itemB = c1.value >= c2.value ? c2 : c1; // smaller (b)
      const diff = itemA.value - itemB.value;

      missingBarName = itemB.category;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. The bar for ${itemB.category} is missing. You are told that ${itemB.category} has ${diff} fewer ${theme.unit} than ${itemA.category}. Read the number of ${theme.unit} for ${itemA.category} from the graph, and calculate the value for ${itemB.category}."`;
        const stepsArr = [
          { label: `Number of ${theme.unit} for ${itemA.category} shown on the graph:`, expectedAnswer: String(itemA.value), acceptedAnswers: [] },
          { label: `Write the working equation to find the value of ${itemB.category} (${itemA.category} - Difference):`, expectedAnswer: `${itemA.value} - ${diff} = ${itemB.value}`, acceptedAnswers: [`${itemA.value}-${diff}=${itemB.value}`] },
          { label: `Number of ${theme.unit} for ${itemB.category}:`, expectedAnswer: String(itemB.value), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(itemB.value);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar for ${itemB.category} is missing. If ${itemB.category} has ${diff} fewer ${theme.unit} than ${itemA.category}, how many ${theme.unit} does ${itemB.category} have?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(itemB.value);
        const opts = getFourOptions(finalAnswer, [String(itemA.value), String(diff), String(itemB.value + scaleStep), String(itemB.value - scaleStep > 0 ? itemB.value - scaleStep : itemB.value + scaleStep * 2)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"On the bar graph, the bar for ${itemB.category} is missing. If ${itemB.category} has ${diff} fewer ${theme.unit} than ${itemA.category}, what is the value of ${itemB.category}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(itemB.value);
      }

    // ========================================================================
    // SUB-TYPE 5: Reverse Category Deduction (Which category is a?)
    // ========================================================================
    } else {
      const indices = [0, 1, 2, 3].sort(() => 0.5 - Math.random());
      const c1 = data[indices[0]];
      const c2 = data[indices[1]];
      const itemA = c1.value >= c2.value ? c1 : c2; // target category (a)
      const itemB = c1.value >= c2.value ? c2 : c1; // base category (b)
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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. ${itemB.category} has ${itemB.value} ${theme.unit}. One category on the graph has exactly ${diff} more ${theme.unit} than ${itemB.category}. Read the graph to calculate this target amount and identify which category it belongs to."`;
        const stepsArr = [
          { label: `Number of ${theme.unit} for ${itemB.category} shown on the graph:`, expectedAnswer: String(itemB.value), acceptedAnswers: [] },
          { label: `Write the working equation to find the target amount (${itemB.category} + ${diff}):`, expectedAnswer: `${itemB.value} + ${diff} = ${itemA.value}`, acceptedAnswers: [`${diff} + ${itemB.value} = ${itemA.value}`, `${itemB.value}+${diff}=${itemA.value}`, `${diff}+${itemB.value}=${itemA.value}`] },
          { label: `Which category has exactly this amount?`, expectedAnswer: itemA.category, acceptedAnswers: [itemA.category.toLowerCase()] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = itemA.category;
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, which category has exactly ${diff} more ${theme.unit} than ${itemB.category}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = itemA.category;
        const otherCats = data.map(d => d.category).filter(c => c !== itemA.category);
        const opts = [itemA.category, otherCats[0], otherCats[1], otherCats[2]];
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()}. Which category has exactly ${diff} more ${theme.unit} than ${itemB.category}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = itemA.category;
      }
    }

  // --------------------------------------------------------------------------
  // Variant 3: Threshold Filtering & Summation
  // --------------------------------------------------------------------------

  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
