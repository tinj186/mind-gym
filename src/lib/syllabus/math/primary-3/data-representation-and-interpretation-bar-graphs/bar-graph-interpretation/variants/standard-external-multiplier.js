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

export function generateStandardExternalMultiplier({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

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

  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
