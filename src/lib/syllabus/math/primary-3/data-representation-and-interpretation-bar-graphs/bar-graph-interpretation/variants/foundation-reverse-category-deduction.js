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

export function generateFoundationReverseCategoryDeduction({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

    const scaleOptions = [2, 5, 10];
    const scaleStep = scaleOptions[getRandomInt(0, 2)];
    const theme = getRandomBarGraphTheme(4);
    const orientation = Math.random() > 0.5 ? "vertical" : "horizontal";

    // Sub-types:
    // 1: Forward Multiplier ("twice as many", "double", "3 times as many", "triple", "4 times as many")
    // 2: Reverse Multiplier (Division: Target has M times as many, deduce Base via Target / M)
    // 3: Forward Comparison (Additive: "X more than", "X fewer than")
    // 4: Reverse Comparison (Inverse Additive: Target has X more/fewer, deduce Base via Target - X or Target + X)
    // 5: Forward Fractional ("half as many as": Base / 2)
    // 6: Reverse Fractional ("Target is half as many as Base": Target * 2)
    const subType = getRandomInt(1, 6);

    let valBase, valTarget, catBase, catTarget;
    let distractor1, distractor2;
    let equationStr = "";
    let equationAccepted = [];
    let relationPromptDesc = "";
    let step2Label = "";
    let finalCategoryAnswer = "";
    let questionTextStructured = "";
    let questionTextMCQ = "";
    let questionTextShort = "";

    // Shuffle category indices
    const catIndices = [0, 1, 2, 3].sort(() => 0.5 - Math.random());
    const cA = theme.items[catIndices[0]];
    const cB = theme.items[catIndices[1]];
    const cC = theme.items[catIndices[2]];
    const cD = theme.items[catIndices[3]];

    // ========================================================================
    // SUB-TYPE 1: Forward Multiplier ("twice", "double", "3 times", "triple", "4 times")
    // ========================================================================
    if (subType === 1) {
      catBase = cA;
      catTarget = cB;
      finalCategoryAnswer = catTarget;

      const multChoice = getRandomInt(1, 3); // 1: 2x, 2: 3x, 3: 4x
      let multiplier = 2;
      let multPhrase = "";
      let stepCalcPhrase = "";

      if (multChoice === 1) {
        multiplier = 2;
        valBase = getRandomInt(2, 4) * scaleStep;
        valTarget = valBase * multiplier;
        const useDouble = Math.random() > 0.5;
        multPhrase = useDouble ? "double the number of" : "twice as many";
        stepCalcPhrase = useDouble ? "double that amount" : "twice that amount";
      } else if (multChoice === 2) {
        multiplier = 3;
        valBase = getRandomInt(2, 3) * scaleStep;
        valTarget = valBase * multiplier;
        const useTriple = Math.random() > 0.5;
        multPhrase = useTriple ? "triple the number of" : "3 times as many";
        stepCalcPhrase = useTriple ? "triple that amount" : "3 times that amount";
      } else {
        multiplier = 4;
        valBase = getRandomInt(1, 2) * scaleStep;
        valTarget = valBase * multiplier;
        multPhrase = "4 times as many";
        stepCalcPhrase = "4 times that amount";
      }

      equationStr = `${valBase} x ${multiplier} = ${valTarget}`;
      equationAccepted = [
        `${multiplier} x ${valBase} = ${valTarget}`,
        `${valBase}*${multiplier}=${valTarget}`,
        `${multiplier}*${valBase}=${valTarget}`,
        `${valBase}x${multiplier}=${valTarget}`,
        `${multiplier}x${valBase}=${valTarget}`,
        `${valBase} X ${multiplier} = ${valTarget}`,
        `${multiplier} X ${valBase} = ${valTarget}`,
        `${valBase}X${multiplier}=${valTarget}`,
        `${multiplier}X${valBase}=${valTarget}`
      ];

      relationPromptDesc = `one category has exactly ${multPhrase} ${theme.unit} as ${catBase}`;
      step2Label = `Write the working equation to find ${stepCalcPhrase}:`;

      questionTextStructured = `${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. You are told that ${relationPromptDesc}. Read the number of ${theme.unit} for ${catBase} from the graph, calculate that target amount, and verify which category matches this value.`;
      questionTextMCQ = `Based on the bar graph, which category has exactly ${multPhrase} ${theme.unit} as ${catBase}?`;
      questionTextShort = `The bar graph displays ${theme.title.toLowerCase()}. Which category has exactly ${multPhrase} ${theme.unit} as ${catBase}?`;

    // ========================================================================
    // SUB-TYPE 2: Reverse Multiplier (Division: Target has M times, deduce Base)
    // ========================================================================
    } else if (subType === 2) {
      catTarget = cA; // Known on graph
      catBase = cB;   // Unknown to deduce
      finalCategoryAnswer = catBase;

      const multChoice = getRandomInt(1, 3); // 1: 2x, 2: 3x, 3: 4x
      let multiplier = 2;
      let multPhrase = "";

      if (multChoice === 1) {
        multiplier = 2;
        valBase = getRandomInt(2, 4) * scaleStep;
        valTarget = valBase * multiplier;
        multPhrase = Math.random() > 0.5 ? "twice as many" : "double the number of";
      } else if (multChoice === 2) {
        multiplier = 3;
        valBase = getRandomInt(2, 3) * scaleStep;
        valTarget = valBase * multiplier;
        multPhrase = Math.random() > 0.5 ? "3 times as many" : "triple the number of";
      } else {
        multiplier = 4;
        valBase = getRandomInt(1, 2) * scaleStep;
        valTarget = valBase * multiplier;
        multPhrase = "4 times as many";
      }

      equationStr = `${valTarget} / ${multiplier} = ${valBase}`;
      equationAccepted = [
        `${valTarget} ÷ ${multiplier} = ${valBase}`,
        `${valTarget}/${multiplier}=${valBase}`,
        `${valTarget}÷${multiplier}=${valBase}`
      ];

      relationPromptDesc = `${catTarget} has exactly ${multPhrase} ${theme.unit} as another category`;
      step2Label = `Write the working equation to find the value of that category (${valTarget} ÷ ${multiplier}):`;

      questionTextStructured = `${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. You are told that ${relationPromptDesc}. Read the number of ${theme.unit} for ${catTarget} from the graph, calculate the amount for the other category, and verify which category it is.`;
      questionTextMCQ = `Based on the bar graph, ${catTarget} has exactly ${multPhrase} ${theme.unit} as which category?`;
      questionTextShort = `The bar graph displays ${theme.title.toLowerCase()}. ${catTarget} has exactly ${multPhrase} ${theme.unit} as another category. Which category is it?`;

    // ========================================================================
    // SUB-TYPE 3: Forward Comparison (Additive: "X more than" or "X fewer than")
    // ========================================================================
    } else if (subType === 3) {
      catBase = cA;
      catTarget = cB;
      finalCategoryAnswer = catTarget;

      const isMore = Math.random() > 0.5;
      const diff = getRandomInt(2, 4) * scaleStep;

      if (isMore) {
        valBase = getRandomInt(2, 5) * scaleStep;
        valTarget = valBase + diff;
        equationStr = `${valBase} + ${diff} = ${valTarget}`;
        equationAccepted = [
          `${diff} + ${valBase} = ${valTarget}`,
          `${valBase}+${diff}=${valTarget}`,
          `${diff}+${valBase}=${valTarget}`
        ];
        relationPromptDesc = `one category has exactly ${diff} more ${theme.unit} than ${catBase}`;
        step2Label = `Write the working equation to find ${diff} more than ${catBase}:`;
        questionTextMCQ = `Based on the bar graph, which category has exactly ${diff} more ${theme.unit} than ${catBase}?`;
        questionTextShort = `The bar graph displays ${theme.title.toLowerCase()}. Which category has exactly ${diff} more ${theme.unit} than ${catBase}?`;
      } else {
        valBase = getRandomInt(5, 8) * scaleStep;
        valTarget = valBase - diff;
        equationStr = `${valBase} - ${diff} = ${valTarget}`;
        equationAccepted = [`${valBase}-${diff}=${valTarget}`];
        relationPromptDesc = `one category has exactly ${diff} fewer ${theme.unit} than ${catBase}`;
        step2Label = `Write the working equation to find ${diff} fewer than ${catBase}:`;
        questionTextMCQ = `Based on the bar graph, which category has exactly ${diff} fewer ${theme.unit} than ${catBase}?`;
        questionTextShort = `The bar graph displays ${theme.title.toLowerCase()}. Which category has exactly ${diff} fewer ${theme.unit} than ${catBase}?`;
      }

      questionTextStructured = `${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. You are told that ${relationPromptDesc}. Read the number of ${theme.unit} for ${catBase} from the graph, calculate that target amount, and verify which category matches this value.`;

    // ========================================================================
    // SUB-TYPE 4: Reverse Comparison (Inverse Working: Target has X more/fewer, deduce Base)
    // ========================================================================
    } else if (subType === 4) {
      catTarget = cA; // Known on graph
      catBase = cB;   // Unknown to deduce
      finalCategoryAnswer = catBase;

      const isMore = Math.random() > 0.5;
      const diff = getRandomInt(2, 4) * scaleStep;

      if (isMore) {
        // catTarget has diff MORE than catBase => catBase = valTarget - diff
        valBase = getRandomInt(2, 5) * scaleStep;
        valTarget = valBase + diff;
        equationStr = `${valTarget} - ${diff} = ${valBase}`;
        equationAccepted = [`${valTarget}-${diff}=${valBase}`];
        relationPromptDesc = `${catTarget} has exactly ${diff} more ${theme.unit} than another category`;
        step2Label = `Write the working equation to find the value of that category (${valTarget} - ${diff}):`;
        questionTextMCQ = `Based on the bar graph, ${catTarget} has exactly ${diff} more ${theme.unit} than which category?`;
        questionTextShort = `The bar graph displays ${theme.title.toLowerCase()}. ${catTarget} has exactly ${diff} more ${theme.unit} than another category. Which category is it?`;
      } else {
        // catTarget has diff FEWER than catBase => catBase = valTarget + diff
        valBase = getRandomInt(5, 8) * scaleStep;
        valTarget = valBase - diff;
        equationStr = `${valTarget} + ${diff} = ${valBase}`;
        equationAccepted = [
          `${diff} + ${valTarget} = ${valBase}`,
          `${valTarget}+${diff}=${valBase}`,
          `${diff}+${valTarget}=${valBase}`
        ];
        relationPromptDesc = `${catTarget} has exactly ${diff} fewer ${theme.unit} than another category`;
        step2Label = `Write the working equation to find the value of that category (${valTarget} + ${diff}):`;
        questionTextMCQ = `Based on the bar graph, ${catTarget} has exactly ${diff} fewer ${theme.unit} than which category?`;
        questionTextShort = `The bar graph displays ${theme.title.toLowerCase()}. ${catTarget} has exactly ${diff} fewer ${theme.unit} than another category. Which category is it?`;
      }

      questionTextStructured = `${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. You are told that ${relationPromptDesc}. Read the number of ${theme.unit} for ${catTarget} from the graph, calculate the amount for the other category, and verify which category it is.`;

    // ========================================================================
    // SUB-TYPE 5: Forward Fractional ("half as many as": valBase / 2)
    // ========================================================================
    } else if (subType === 5) {
      catBase = cA;
      catTarget = cB;
      finalCategoryAnswer = catTarget;

      valBase = getRandomInt(2, 4) * 2 * scaleStep; // even multiple so half is an integer multiple of scaleStep
      valTarget = valBase / 2;

      equationStr = `${valBase} / 2 = ${valTarget}`;
      equationAccepted = [
        `${valBase} ÷ 2 = ${valTarget}`,
        `${valBase}/2=${valTarget}`,
        `${valBase}÷2=${valTarget}`
      ];

      relationPromptDesc = `one category has exactly half as many ${theme.unit} as ${catBase}`;
      step2Label = `Write the working equation to find half that amount:`;

      questionTextStructured = `${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. You are told that ${relationPromptDesc}. Read the number of ${theme.unit} for ${catBase} from the graph, calculate half that amount, and verify which category matches this value.`;
      questionTextMCQ = `Based on the bar graph, which category has exactly half as many ${theme.unit} as ${catBase}?`;
      questionTextShort = `The bar graph displays ${theme.title.toLowerCase()}. Which category has exactly half as many ${theme.unit} as ${catBase}?`;

    // ========================================================================
    // SUB-TYPE 6: Reverse Fractional ("Target is half as many as Base": Target * 2)
    // ========================================================================
    } else {
      catTarget = cA; // Known on graph
      catBase = cB;   // Unknown to deduce
      finalCategoryAnswer = catBase;

      valTarget = getRandomInt(2, 4) * scaleStep;
      valBase = valTarget * 2;

      equationStr = `${valTarget} x 2 = ${valBase}`;
      equationAccepted = [
        `2 x ${valTarget} = ${valBase}`,
        `${valTarget}*2=${valBase}`,
        `2*${valTarget}=${valBase}`,
        `${valTarget}x2=${valBase}`,
        `2x${valTarget}=${valBase}`,
        `${valTarget} X 2 = ${valBase}`,
        `2 X ${valTarget} = ${valBase}`,
        `${valTarget}X2=${valBase}`,
        `2X${valTarget}=${valBase}`
      ];

      relationPromptDesc = `${catTarget} has exactly half as many ${theme.unit} as another category`;
      step2Label = `Write the working equation to find the value of that category (${valTarget} x 2):`;

      questionTextStructured = `${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. You are told that ${relationPromptDesc}. Read the number of ${theme.unit} for ${catTarget} from the graph, calculate the amount for the other category, and verify which category it is.`;
      questionTextMCQ = `Based on the bar graph, ${catTarget} has exactly half as many ${theme.unit} as which category?`;
      questionTextShort = `The bar graph displays ${theme.title.toLowerCase()}. ${catTarget} has exactly half as many ${theme.unit} as another category. Which category is it?`;
    }

    // Generate guaranteed unique, strictly positive distractors aligned to scaleStep
    const usedVals = new Set([valBase, valTarget]);
    const candidateDistractors = [
      valBase + scaleStep,
      valBase - scaleStep,
      valTarget + scaleStep,
      valTarget - scaleStep,
      valBase + scaleStep * 2,
      valTarget + scaleStep * 2,
      valBase + scaleStep * 3,
      valTarget + scaleStep * 3,
      scaleStep * 2,
      scaleStep * 3,
      scaleStep * 4,
      scaleStep * 5,
      scaleStep * 6,
      scaleStep * 7,
      scaleStep * 8
    ].filter(v => v > 0 && !usedVals.has(v));

    distractor1 = candidateDistractors[0];
    usedVals.add(distractor1);
    const remainingCandidates = candidateDistractors.filter(v => !usedVals.has(v));
    distractor2 = remainingCandidates[0];

    // Build categories data mapping with completely randomized bar positions
    const itemsWithValues = [
      { category: catBase, value: valBase },
      { category: catTarget, value: valTarget },
      { category: cC, value: distractor1 },
      { category: cD, value: distractor2 }
    ];
    // Shuffle the items array to randomize bar positions on the chart
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
      const knownCategory = (subType === 1 || subType === 3 || subType === 5) ? catBase : catTarget;
      const knownValue = (subType === 1 || subType === 3 || subType === 5) ? valBase : valTarget;

      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${questionTextStructured}"`;
      const stepsArr = [
        { label: `Number of ${theme.unit} for ${knownCategory} shown on the graph:`, expectedAnswer: String(knownValue), acceptedAnswers: [] },
        { label: step2Label, expectedAnswer: equationStr, acceptedAnswers: equationAccepted },
        { label: `Which category has exactly this amount?`, expectedAnswer: finalCategoryAnswer, acceptedAnswers: [finalCategoryAnswer.toLowerCase(), finalCategoryAnswer.toUpperCase()] }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      finalAnswer = finalCategoryAnswer;
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${questionTextMCQ}"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
      finalAnswer = finalCategoryAnswer;
      const otherCategories = theme.items.slice(0, 4).filter(c => c !== finalCategoryAnswer);
      const opts = [finalCategoryAnswer, otherCategories[0], otherCategories[1], otherCategories[2]];
      mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${questionTextShort}"`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      finalAnswer = finalCategoryAnswer;
    }

  // --------------------------------------------------------------------------
  // Variant 5: The Remainder Calculation & Inventory Adjustments
  // --------------------------------------------------------------------------

  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
