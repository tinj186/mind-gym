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

export function generateFoundationRemainderCalculation({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

    const scaleOptions = [2, 5, 10];
    const scaleStep = scaleOptions[getRandomInt(0, 2)];
    const theme = getRandomBarGraphTheme(4);
    const orientation = Math.random() > 0.5 ? "vertical" : "horizontal";

    // 4 clean values for the categories
    const multiplierPool = [3, 4, 5, 6, 7, 8, 9].sort(() => 0.5 - Math.random());
    const data = theme.items.slice(0, 4).map((cat, idx) => ({
      category: cat,
      value: multiplierPool[idx] * scaleStep
    }));

    // Randomly pick which category is being adjusted
    const targetIdx = getRandomInt(0, 3);
    const chosenCat = data[targetIdx].category;
    const startingVal = data[targetIdx].value;

    // Sub-types:
    // 1: Remainder after deduction (Starting - Deducted = Remainder)
    // 2: Increase after addition (Starting + Added = New Total)
    // 3: Finding how many were deducted given remaining amount (Starting - Remaining = Deducted)
    const subType = getRandomInt(1, 3);

    // ========================================================================
    // SUB-TYPE 1: Remainder after deduction
    // ========================================================================
    if (subType === 1) {
      const deducted = getRandomInt(1, Math.max(1, Math.floor(startingVal / scaleStep) - 1)) * scaleStep;
      const remainder = startingVal - deducted;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. During the day, exactly ${deducted} ${theme.unit} of ${chosenCat} were used or sold. Read the starting amount of ${chosenCat} from the bar graph, and calculate how many ${theme.unit} of ${chosenCat} are left."`;
        const stepsArr = [
          { label: `Starting number of ${theme.unit} for ${chosenCat} shown on the graph:`, expectedAnswer: String(startingVal), acceptedAnswers: [] },
          { label: `Write the working equation to find the remaining amount:`, expectedAnswer: `${startingVal} - ${deducted} = ${remainder}`, acceptedAnswers: [`${startingVal}-${deducted}=${remainder}`] },
          { label: `Remaining ${theme.unit}:`, expectedAnswer: String(remainder), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(remainder);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, there were originally ${startingVal} ${theme.unit} of ${chosenCat}. If ${deducted} were used or sold, how many are left?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(remainder);
        const opts = getFourOptions(finalAnswer, [String(startingVal), String(deducted), String(remainder + scaleStep), String(remainder - scaleStep > 0 ? remainder - scaleStep : remainder + scaleStep * 2)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()}. If ${deducted} ${theme.unit} of ${chosenCat} were sold or removed from the starting amount, how many ${theme.unit} remain?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(remainder);
      }

    // ========================================================================
    // SUB-TYPE 2: Addition to Inventory / Group (Starting + Added = Total)
    // ========================================================================
    } else if (subType === 2) {
      const added = getRandomInt(1, 3) * scaleStep;
      const newTotal = startingVal + added;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on the bar graph. Later, an additional ${added} ${theme.unit} of ${chosenCat} were added. Read the original number from the bar graph, and calculate the new total number of ${theme.unit} of ${chosenCat}."`;
        const stepsArr = [
          { label: `Starting number of ${theme.unit} for ${chosenCat} shown on the graph:`, expectedAnswer: String(startingVal), acceptedAnswers: [] },
          { label: `Write the working equation to find the new total:`, expectedAnswer: `${startingVal} + ${added} = ${newTotal}`, acceptedAnswers: [`${added} + ${startingVal} = ${newTotal}`, `${startingVal}+${added}=${newTotal}`, `${added}+${startingVal}=${newTotal}`] },
          { label: `New total ${theme.unit}:`, expectedAnswer: String(newTotal), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(newTotal);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, there were ${startingVal} ${theme.unit} of ${chosenCat}. If an additional ${added} were received, what is the new total?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(newTotal);
        const opts = getFourOptions(finalAnswer, [String(startingVal), String(newTotal - scaleStep), String(newTotal + scaleStep), String(startingVal - added)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows ${theme.title.toLowerCase()}. If ${added} more ${theme.unit} of ${chosenCat} are added to the starting amount, what is the new total?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(newTotal);
      }

    // ========================================================================
    // SUB-TYPE 3: Finding deduction amount (Starting - Remaining = Deducted)
    // ========================================================================
    } else {
      const remaining = getRandomInt(1, Math.max(1, Math.floor(startingVal / scaleStep) - 1)) * scaleStep;
      const deducted = startingVal - remaining;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the starting ${theme.title.toLowerCase()} on the bar graph. At the end of the day, exactly ${remaining} ${theme.unit} of ${chosenCat} were left. Read the starting amount from the graph, and calculate how many ${theme.unit} were sold or removed."`;
        const stepsArr = [
          { label: `Starting number of ${theme.unit} for ${chosenCat} shown on the graph:`, expectedAnswer: String(startingVal), acceptedAnswers: [] },
          { label: `Write the working equation to find the amount sold or removed:`, expectedAnswer: `${startingVal} - ${remaining} = ${deducted}`, acceptedAnswers: [`${startingVal}-${remaining}=${deducted}`] },
          { label: `Number of ${theme.unit} sold or removed:`, expectedAnswer: String(deducted), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(deducted);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the starting amount of ${chosenCat}. If ${remaining} are left at the end of the day, how many were sold or used?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(deducted);
        const opts = getFourOptions(finalAnswer, [String(startingVal), String(remaining), String(deducted + scaleStep), String(deducted - scaleStep > 0 ? deducted - scaleStep : deducted + scaleStep * 2)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph displays ${theme.title.toLowerCase()}. If only ${remaining} ${theme.unit} of ${chosenCat} are left at the end of the day, how many were sold or used?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(deducted);
      }
    }

  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
