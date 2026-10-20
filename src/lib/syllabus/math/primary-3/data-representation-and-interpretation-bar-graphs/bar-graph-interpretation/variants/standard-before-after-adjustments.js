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

export function generateStandardBeforeAfterAdjustments({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

    const scaleStep = [2, 5, 10, 20][Math.floor(Math.random() * 4)];
    const orientation = Math.random() < 0.5 ? "vertical" : "horizontal";
    studentName = getRandomNames(1)[0] || 'Bala';
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

  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
