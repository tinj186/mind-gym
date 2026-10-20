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

export function generateAdvancedEqualizingQuantities({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

    const scaleStep = [2, 5, 10, 20][Math.floor(Math.random() * 4)];
    const orientation = Math.random() < 0.5 ? "vertical" : "horizontal";
    const subType = getRandomInt(1, 6);

    let data = [];

    // Helper: generate an even difference so dividing by 2 yields an integer
    const getEvenDiffValues = () => {
      const kDiff = getRandomInt(1, 3) * 2; // always even difference steps: 2, 4, 6
      const valB = getRandomInt(2, 5) * scaleStep;
      const valA = valB + kDiff * scaleStep;
      return { valA, valB, diff: valA - valB, transfer: (valA - valB) / 2 };
    };

    // ========================================================================
    // SUB-TYPE 1: Direct Internal Transfer Between Two Containers
    // ========================================================================
    if (subType === 1) {
      const theme = getRandomEqualizingTheme(3);
      const { valA, valB, diff, transfer } = getEvenDiffValues();
      const valC = getRandomInt(2, 5) * scaleStep;
      data = [
        { category: theme.items[0], value: valA },
        { category: theme.items[1], value: valB },
        { category: theme.items[2], value: valC }
      ];
      const catA = data[0];
      const catB = data[1];
      const catC = data[2];

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the number of ${theme.unit} in ${catA.category}, ${catB.category}, and ${catC.category}. Calculate the difference between ${catA.category} and ${catB.category}, then determine how many ${theme.unit} must be moved from ${catA.category} to ${catB.category} so that both ${theme.containersPlural} have an equal number of ${theme.unit}."`;
        const stepsArr = [
          { label: `Write the working equation to find the difference in ${theme.unit} between ${catA.category} and ${catB.category}:`, expectedAnswer: `${valA} - ${valB} = ${diff}`, acceptedAnswers: getSubtractionAcceptedAnswers(valA, valB, diff) },
          { label: `Write the working equation to find how many ${theme.unit} must be moved to make both ${theme.containersPlural} equal:`, expectedAnswer: `${diff} ÷ 2 = ${transfer}`, acceptedAnswers: getDivisionAcceptedAnswers(diff, 2, transfer) },
          { label: `Number of ${theme.unit} to be moved:`, expectedAnswer: String(transfer), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(transfer);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, how many ${theme.unit} must be moved from ${catA.category} to ${catB.category} so that both ${theme.containersPlural} have an equal number of ${theme.unit}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(transfer);
        const opts = getFourOptions(finalAnswer, [String(diff), String(transfer + scaleStep), String(transfer - scaleStep > 0 ? transfer - scaleStep : transfer + 5), String(valB)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, how many ${theme.unit} must be moved from ${catA.category} to ${catB.category} so that both ${theme.containersPlural} have an equal number of ${theme.unit}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(transfer);
      }

    // ========================================================================
    // SUB-TYPE 2: Equalized Quantity After Transfer (How many in each?)
    // ========================================================================
    } else if (subType === 2) {
      const theme = getRandomEqualizingTheme(3);
      const { valA, valB, diff, transfer } = getEvenDiffValues();
      const valC = getRandomInt(2, 5) * scaleStep;
      data = [
        { category: theme.items[0], value: valA },
        { category: theme.items[1], value: valB },
        { category: theme.items[2], value: valC }
      ];
      const catA = data[0];
      const catB = data[1];
      const catC = data[2];
      const totalAB = valA + valB;
      const equalAmt = totalAB / 2;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the number of ${theme.unit} in ${catA.category}, ${catB.category}, and ${catC.category}. Some ${theme.unit} are moved from ${catA.category} to ${catB.category} so that both have an equal number of ${theme.unit}. Calculate the total number of ${theme.unit} in ${catA.category} and ${catB.category} combined, then determine how many ${theme.unit} will be in each ${theme.container} after the transfer."`;
        const stepsArr = [
          { label: `Write the working equation to find the total number of ${theme.unit} in ${catA.category} and ${catB.category} combined:`, expectedAnswer: `${valA} + ${valB} = ${totalAB}`, acceptedAnswers: getAdditionAcceptedAnswers(valA, valB, totalAB) },
          { label: `Write the working equation to find how many ${theme.unit} each ${theme.container} will have when equal:`, expectedAnswer: `${totalAB} ÷ 2 = ${equalAmt}`, acceptedAnswers: getDivisionAcceptedAnswers(totalAB, 2, equalAmt) },
          { label: `Number of ${theme.unit} in each ${theme.container}:`, expectedAnswer: String(equalAmt), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(equalAmt);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Some ${theme.unit} are moved from ${catA.category} to ${catB.category} so that both have an equal number of ${theme.unit}. Based on the bar graph, how many ${theme.unit} will be in each ${theme.container}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(equalAmt);
        const opts = getFourOptions(finalAnswer, [String(valA), String(valB), String(transfer), String(equalAmt + scaleStep)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Some ${theme.unit} are moved from ${catA.category} to ${catB.category} so that both have an equal number of ${theme.unit}. Based on the bar graph, how many ${theme.unit} will be in each ${theme.container}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(equalAmt);
      }

    // ========================================================================
    // SUB-TYPE 3: Transfer to an External Container / Entity
    // ========================================================================
    } else if (subType === 3) {
      const theme = getRandomEqualizingTheme(3);
      const { valA, valB: valExt, diff, transfer } = getEvenDiffValues();
      const valB = getRandomInt(2, 5) * scaleStep;
      const valC = getRandomInt(2, 5) * scaleStep;
      data = [
        { category: theme.items[0], value: valA },
        { category: theme.items[1], value: valB },
        { category: theme.items[2], value: valC }
      ];
      const catA = data[0];
      const extContainer = theme.externalContainer;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the number of ${theme.unit} in different ${theme.containersPlural}. An additional ${theme.container}, ${extContainer}, contains ${valExt} ${theme.unit}. Calculate the difference between ${catA.category} and ${extContainer}, then find how many ${theme.unit} must be moved from ${catA.category} to ${extContainer} so that both have an equal number of ${theme.unit}."`;
        const stepsArr = [
          { label: `Write the working equation to find the difference in ${theme.unit} between ${catA.category} and ${extContainer}:`, expectedAnswer: `${valA} - ${valExt} = ${diff}`, acceptedAnswers: getSubtractionAcceptedAnswers(valA, valExt, diff) },
          { label: `Write the working equation to find how many ${theme.unit} must be moved to make both equal:`, expectedAnswer: `${diff} ÷ 2 = ${transfer}`, acceptedAnswers: getDivisionAcceptedAnswers(diff, 2, transfer) },
          { label: `Number of ${theme.unit} to be moved:`, expectedAnswer: String(transfer), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(transfer);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${extContainer} has ${valExt} ${theme.unit}. Based on the bar graph, how many ${theme.unit} must be moved from ${catA.category} to ${extContainer} so that both have an equal number of ${theme.unit}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(transfer);
        const opts = getFourOptions(finalAnswer, [String(diff), String(transfer + scaleStep), String(transfer - scaleStep > 0 ? transfer - scaleStep : transfer + 6), String(valExt)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${extContainer} has ${valExt} ${theme.unit}. Based on the bar graph, how many ${theme.unit} must be moved from ${catA.category} to ${extContainer} so that both have an equal number of ${theme.unit}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(transfer);
      }

    // ========================================================================
    // SUB-TYPE 4: Equalizing Three Containers (Fair Share / Equal Redistribution)
    // ========================================================================
    } else if (subType === 4) {
      const theme = getRandomEqualizingTheme(3);
      let kA = getRandomInt(2, 6);
      let kB = getRandomInt(2, 6);
      let rem = (kA + kB) % 3;
      let kC = rem === 0 ? 3 : rem === 1 ? 2 : 1;
      let kExtra = getRandomInt(0, 1) * 3;
      kC += kExtra;

      const valA = kA * scaleStep;
      const valB = kB * scaleStep;
      const valC = kC * scaleStep;
      const grandTotal = valA + valB + valC;
      const equalAmt = grandTotal / 3;

      data = [
        { category: theme.items[0], value: valA },
        { category: theme.items[1], value: valB },
        { category: theme.items[2], value: valC }
      ];

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"All the ${theme.unit} from ${data[0].category}, ${data[1].category}, and ${data[2].category} are collected together and redistributed equally among the 3 ${theme.containersPlural}. Calculate the total number of ${theme.unit} across all 3 ${theme.containersPlural}, then determine how many ${theme.unit} each ${theme.container} will have."`;
        const stepsArr = [
          { label: `Write the working equation to find the total number of ${theme.unit} across all 3 ${theme.containersPlural}:`, expectedAnswer: `${valA} + ${valB} + ${valC} = ${grandTotal}`, acceptedAnswers: [`${valA}+${valB}+${valC}=${grandTotal}`, `${valA} + ${valB} + ${valC} = ${grandTotal}`] },
          { label: `Write the working equation to find how many ${theme.unit} each ${theme.container} will have after equal redistribution:`, expectedAnswer: `${grandTotal} ÷ 3 = ${equalAmt}`, acceptedAnswers: getDivisionAcceptedAnswers(grandTotal, 3, equalAmt) },
          { label: `Number of ${theme.unit} in each ${theme.container}:`, expectedAnswer: String(equalAmt), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(equalAmt);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"If all the ${theme.unit} from ${data[0].category}, ${data[1].category}, and ${data[2].category} are redistributed equally among the 3 ${theme.containersPlural}, how many ${theme.unit} will each ${theme.container} have?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(equalAmt);
        const opts = getFourOptions(finalAnswer, [String(equalAmt + scaleStep), String(equalAmt - scaleStep > 0 ? equalAmt - scaleStep : equalAmt + 6), String(valA), String(valB)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"If all the ${theme.unit} from ${data[0].category}, ${data[1].category}, and ${data[2].category} are redistributed equally among the 3 ${theme.containersPlural}, how many ${theme.unit} will each ${theme.container} have?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(equalAmt);
      }

    // ========================================================================
    // SUB-TYPE 5: Transfer from Highest Container to Lowest Container
    // ========================================================================
    } else if (subType === 5) {
      const theme = getRandomEqualizingTheme(4);
      const diffSteps = getRandomInt(1, 3) * 2;
      const kLowest = getRandomInt(2, 4);
      const kHighest = kLowest + diffSteps;
      const valLowest = kLowest * scaleStep;
      const valHighest = kHighest * scaleStep;
      const valMid1 = valLowest + Math.floor(diffSteps / 2) * scaleStep;
      const valMid2 = valMid1;
      const diff = valHighest - valLowest;
      const transfer = diff / 2;

      data = [
        { category: theme.items[0], value: valHighest },
        { category: theme.items[1], value: valLowest },
        { category: theme.items[2], value: valMid1 },
        { category: theme.items[3], value: valMid2 }
      ];
      const highestCat = data[0];
      const lowestCat = data[1];

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the number of ${theme.unit} across 4 ${theme.containersPlural}. Calculate the difference between the ${theme.container} with the most ${theme.unit} and the ${theme.container} with the fewest ${theme.unit}, then determine how many ${theme.unit} must be moved from ${highestCat.category} to ${lowestCat.category} so that both have an equal number of ${theme.unit}."`;
        const stepsArr = [
          { label: `Write the working equation to find the difference in ${theme.unit} between ${highestCat.category} and ${lowestCat.category}:`, expectedAnswer: `${valHighest} - ${valLowest} = ${diff}`, acceptedAnswers: getSubtractionAcceptedAnswers(valHighest, valLowest, diff) },
          { label: `Write the working equation to find how many ${theme.unit} must be moved from ${highestCat.category} to ${lowestCat.category} to make them equal:`, expectedAnswer: `${diff} ÷ 2 = ${transfer}`, acceptedAnswers: getDivisionAcceptedAnswers(diff, 2, transfer) },
          { label: `Number of ${theme.unit} to be moved:`, expectedAnswer: String(transfer), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(transfer);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, how many ${theme.unit} must be moved from the ${theme.container} with the most ${theme.unit} to the ${theme.container} with the fewest ${theme.unit} so that both have an equal number of ${theme.unit}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(transfer);
        const opts = getFourOptions(finalAnswer, [String(diff), String(transfer + scaleStep), String(transfer - scaleStep > 0 ? transfer - scaleStep : transfer + 5), String(valLowest)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, how many ${theme.unit} must be moved from the ${theme.container} with the most ${theme.unit} to the ${theme.container} with the fewest ${theme.unit} so that both have an equal number of ${theme.unit}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(transfer);
      }

    // ========================================================================
    // SUB-TYPE 6: Equalizing by Adding Instead of Transferring
    // ========================================================================
    } else {
      const theme = getRandomEqualizingTheme(3);
      let valA = getRandomInt(4, 7) * scaleStep;
      let valB = getRandomInt(2, 4) * scaleStep;
      if (valA === valB) valA += scaleStep;
      const valC = getRandomInt(2, 5) * scaleStep;
      const diff = valA - valB;

      data = [
        { category: theme.items[0], value: valA },
        { category: theme.items[1], value: valB },
        { category: theme.items[2], value: valC }
      ];
      const catA = data[0];
      const catB = data[1];
      const catC = data[2];

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the number of ${theme.unit} in ${catA.category}, ${catB.category}, and ${catC.category}. More ${theme.unit} are added to ${catB.category} so that it has the exact same number of ${theme.unit} as ${catA.category}. Read the quantities from the bar graph, and find how many ${theme.unit} must be added to ${catB.category}."`;
        const stepsArr = [
          { label: `Write the working equation to find how many ${theme.unit} must be added to ${catB.category} to equal ${catA.category}:`, expectedAnswer: `${valA} - ${valB} = ${diff}`, acceptedAnswers: getSubtractionAcceptedAnswers(valA, valB, diff) },
          { label: `Number of ${theme.unit} to be added:`, expectedAnswer: String(diff), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(diff);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, how many more ${theme.unit} must be added to ${catB.category} so that it has the exact same number of ${theme.unit} as ${catA.category}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(diff);
        const opts = getFourOptions(finalAnswer, [String(valA), String(valB), String(diff + scaleStep), String(diff - scaleStep > 0 ? diff - scaleStep : diff + 5)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, how many more ${theme.unit} must be added to ${catB.category} so that it has the exact same number of ${theme.unit} as ${catA.category}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(diff);
      }
    }

  // --------------------------------------------------------------------------
  // Variant 14: Combined Target / Shortfall Analysis
  // --------------------------------------------------------------------------

  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
