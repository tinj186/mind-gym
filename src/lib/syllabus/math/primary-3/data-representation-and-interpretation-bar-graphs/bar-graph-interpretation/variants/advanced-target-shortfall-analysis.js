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

export function generateAdvancedTargetShortfallAnalysis({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

    const subTypes = [1, 2, 3, 4, 5, 6];
    const subType = subTypes[Math.floor(Math.random() * subTypes.length)];

    const orientations = ["vertical", "horizontal"];
    const orientation = orientations[Math.floor(Math.random() * orientations.length)];
    const scaleSteps = [2, 5, 10, 20];
    const scaleStep = scaleSteps[Math.floor(Math.random() * scaleSteps.length)];
    let data = [];

    // ========================================================================
    // SUB-TYPE 1: Single Missing Period Shortfall (Classic 4-Period Sum + Goal Deduction)
    // ========================================================================
    if (subType === 1) {
      const theme = getRandomTargetShortfallTheme(4);
      const k1 = getRandomInt(3, 6);
      const k2 = getRandomInt(3, 6);
      const k3 = getRandomInt(3, 6);
      const k4 = getRandomInt(2, 5);
      const d1 = k1 * scaleStep;
      const d2 = k2 * scaleStep;
      const d3 = k3 * scaleStep;
      const d4 = k4 * scaleStep;
      const collected = d1 + d2 + d3 + d4;
      const shortage = getRandomInt(2, 5) * scaleStep;
      const goal = collected + shortage;

      data = [
        { category: theme.items[0], value: d1 },
        { category: theme.items[1], value: d2 },
        { category: theme.items[2], value: d3 },
        { category: theme.items[3], value: d4 }
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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A ${theme.targetSubject} set a goal to ${theme.verb} exactly ${goal} ${theme.unit} ${theme.activity} over 5 ${theme.categoriesPlural}. The bar graph shows the number of ${theme.unit} ${theme.pastVerb} from ${data[0].category} to ${data[3].category}. Calculate the total number of ${theme.unit} ${theme.pastVerb} so far, and determine how many more ${theme.unit} must be ${theme.pastVerb} ${theme.prep} ${theme.nextItem} to reach the goal."`;
        const stepsArr = [
          { label: `Write the working equation to find the total ${theme.pastVerb} from ${data[0].category} to ${data[3].category}:`, expectedAnswer: `${d1} + ${d2} + ${d3} + ${d4} = ${collected}`, acceptedAnswers: getSumAcceptedAnswers([d1, d2, d3, d4], collected) },
          { label: `Write the working equation to find the shortage needed ${theme.prep} ${theme.nextItem}:`, expectedAnswer: `${goal} - ${collected} = ${shortage}`, acceptedAnswers: getSubtractionAcceptedAnswers(goal, collected, shortage) },
          { label: `${capitalize(theme.unit)} needed ${theme.prep} ${theme.nextItem}:`, expectedAnswer: String(shortage), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(shortage);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The 5-${theme.categorySingular} target goal is ${goal} ${theme.unit} ${theme.activity}. The bar graph shows the ${theme.unit} ${theme.pastVerb} from ${data[0].category} to ${data[3].category}. How many ${theme.unit} must be ${theme.pastVerb} ${theme.prep} ${theme.nextItem} to reach the goal?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(shortage);
        const opts = getFourOptions(finalAnswer, [String(shortage + scaleStep), String(shortage - scaleStep > 0 ? shortage - scaleStep : shortage + 2 * scaleStep), String(goal - collected + scaleStep * 2), String(collected)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A ${theme.targetSubject} aims to ${theme.verb} ${goal} ${theme.unit} over 5 ${theme.categoriesPlural} ${theme.activity}. Based on the bar graph, how many ${theme.unit} must be ${theme.pastVerb} ${theme.prep} ${theme.nextItem} to meet the goal?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(shortage);
      }

    // ========================================================================
    // SUB-TYPE 2: Exceeding Target / Surplus Calculation
    // ========================================================================
    } else if (subType === 2) {
      const theme = getRandomTargetShortfallTheme(4);
      const k1 = getRandomInt(3, 6);
      const k2 = getRandomInt(3, 6);
      const k3 = getRandomInt(3, 6);
      const k4 = getRandomInt(3, 5);
      const d1 = k1 * scaleStep;
      const d2 = k2 * scaleStep;
      const d3 = k3 * scaleStep;
      const d4 = k4 * scaleStep;
      const total = d1 + d2 + d3 + d4;
      const surplus = getRandomInt(2, 5) * scaleStep;
      const goal = total - surplus;

      data = [
        { category: theme.items[0], value: d1 },
        { category: theme.items[1], value: d2 },
        { category: theme.items[2], value: d3 },
        { category: theme.items[3], value: d4 }
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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A ${theme.targetSubject} set a target goal to ${theme.verb} ${goal} ${theme.unit} across 4 ${theme.categoriesPlural} ${theme.activity}. The bar graph shows the actual number of ${theme.unit} ${theme.pastVerb}. Calculate the total number of ${theme.unit} ${theme.pastVerb}, and determine by how many ${theme.unit} they exceeded their target goal."`;
        const stepsArr = [
          { label: `Write the working equation to find the total number of ${theme.unit} ${theme.pastVerb} across all 4 ${theme.categoriesPlural}:`, expectedAnswer: `${d1} + ${d2} + ${d3} + ${d4} = ${total}`, acceptedAnswers: getSumAcceptedAnswers([d1, d2, d3, d4], total) },
          { label: `Write the working equation to find how many ${theme.unit} exceeded the target goal:`, expectedAnswer: `${total} - ${goal} = ${surplus}`, acceptedAnswers: getSubtractionAcceptedAnswers(total, goal, surplus) },
          { label: `Number of ${theme.unit} exceeding the target goal:`, expectedAnswer: String(surplus), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(surplus);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A target goal of ${goal} ${theme.unit} was set across 4 ${theme.categoriesPlural} ${theme.activity}. Based on the bar graph, by how many ${theme.unit} did the total ${theme.pastVerb} exceed the target goal?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(surplus);
        const opts = getFourOptions(finalAnswer, [String(surplus + scaleStep), String(surplus - scaleStep > 0 ? surplus - scaleStep : surplus + 2 * scaleStep), String(total), String(goal)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A target goal of ${goal} ${theme.unit} was set across 4 ${theme.categoriesPlural} ${theme.activity}. Based on the bar graph, by how many ${theme.unit} did the total ${theme.pastVerb} exceed the target goal?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(surplus);
      }

    // ========================================================================
    // SUB-TYPE 3: Two-Period Combined Shortfall (Remaining 2 Periods Combined)
    // ========================================================================
    } else if (subType === 3) {
      const theme = getRandomTargetShortfallTheme(3);
      const k1 = getRandomInt(3, 6);
      const k2 = getRandomInt(3, 6);
      const k3 = getRandomInt(2, 5);
      const d1 = k1 * scaleStep;
      const d2 = k2 * scaleStep;
      const d3 = k3 * scaleStep;
      const sum3 = d1 + d2 + d3;
      const remaining = getRandomInt(3, 7) * scaleStep;
      const goal = sum3 + remaining;

      data = [
        { category: theme.items[0], value: d1 },
        { category: theme.items[1], value: d2 },
        { category: theme.items[2], value: d3 }
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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A ${theme.targetSubject} set a target goal to ${theme.verb} ${goal} ${theme.unit} ${theme.activity} over 5 ${theme.categoriesPlural}. The bar graph shows the number of ${theme.unit} ${theme.pastVerb} during the first 3 ${theme.categoriesPlural} (${data[0].category}, ${data[1].category}, and ${data[2].category}). Calculate the total ${theme.pastVerb} in the first 3 ${theme.categoriesPlural}, and determine how many ${theme.unit} in total must be ${theme.pastVerb} across the remaining 2 ${theme.categoriesPlural} to reach the goal."`;
        const stepsArr = [
          { label: `Write the working equation to find the total ${theme.unit} ${theme.pastVerb} in the first 3 ${theme.categoriesPlural}:`, expectedAnswer: `${d1} + ${d2} + ${d3} = ${sum3}`, acceptedAnswers: getSumAcceptedAnswers([d1, d2, d3], sum3) },
          { label: `Write the working equation to find the remaining ${theme.unit} needed across the final 2 ${theme.categoriesPlural}:`, expectedAnswer: `${goal} - ${sum3} = ${remaining}`, acceptedAnswers: getSubtractionAcceptedAnswers(goal, sum3, remaining) },
          { label: `Number of ${theme.unit} needed across the remaining 2 ${theme.categoriesPlural}:`, expectedAnswer: String(remaining), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(remaining);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The target goal is to ${theme.verb} ${goal} ${theme.unit} ${theme.activity} over 5 ${theme.categoriesPlural}. The bar graph shows the quantities ${theme.pastVerb} during the first 3 ${theme.categoriesPlural}. How many ${theme.unit} in total must be ${theme.pastVerb} across the remaining 2 ${theme.categoriesPlural} to achieve the goal?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(remaining);
        const opts = getFourOptions(finalAnswer, [String(remaining + scaleStep), String(remaining - scaleStep > 0 ? remaining - scaleStep : remaining + 2 * scaleStep), String(sum3), String(goal)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The target goal is to ${theme.verb} ${goal} ${theme.unit} ${theme.activity} over 5 ${theme.categoriesPlural}. Based on the bar graph of the first 3 ${theme.categoriesPlural}, how many ${theme.unit} in total must be ${theme.pastVerb} across the remaining 2 ${theme.categoriesPlural} to achieve the goal?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(remaining);
      }

    // ========================================================================
    // SUB-TYPE 4: Reverse Goal Deduction (Given Shortfall, Find Original Target Goal)
    // ========================================================================
    } else if (subType === 4) {
      const theme = getRandomTargetShortfallTheme(4);
      const k1 = getRandomInt(2, 5);
      const k2 = getRandomInt(3, 6);
      const k3 = getRandomInt(2, 5);
      const k4 = getRandomInt(3, 6);
      const d1 = k1 * scaleStep;
      const d2 = k2 * scaleStep;
      const d3 = k3 * scaleStep;
      const d4 = k4 * scaleStep;
      const sum = d1 + d2 + d3 + d4;
      const shortfall = getRandomInt(2, 5) * scaleStep;
      const goal = sum + shortfall;

      data = [
        { category: theme.items[0], value: d1 },
        { category: theme.items[1], value: d2 },
        { category: theme.items[2], value: d3 },
        { category: theme.items[3], value: d4 }
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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"After the 4 ${theme.categoriesPlural} shown in the bar graph, the ${theme.targetSubject} was still short of its target goal by ${shortfall} ${theme.unit}. Calculate the total number of ${theme.unit} ${theme.pastVerb} across the 4 ${theme.categoriesPlural}, and determine the original target goal."`;
        const stepsArr = [
          { label: `Write the working equation to find the total number of ${theme.unit} ${theme.pastVerb} across the 4 ${theme.categoriesPlural}:`, expectedAnswer: `${d1} + ${d2} + ${d3} + ${d4} = ${sum}`, acceptedAnswers: getSumAcceptedAnswers([d1, d2, d3, d4], sum) },
          { label: `Write the working equation to find the original target goal:`, expectedAnswer: `${sum} + ${shortfall} = ${goal}`, acceptedAnswers: getAdditionAcceptedAnswers(sum, shortfall, goal) },
          { label: `Original target goal:`, expectedAnswer: String(goal), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(goal);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"After the 4 ${theme.categoriesPlural} shown in the bar graph, the ${theme.targetSubject} was still short of its target goal by ${shortfall} ${theme.unit}. What was the original target goal?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(goal);
        const opts = getFourOptions(finalAnswer, [String(goal + scaleStep), String(goal - scaleStep), String(sum), String(shortfall)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"After the 4 ${theme.categoriesPlural} shown in the bar graph, the ${theme.targetSubject} was still short of its target goal by ${shortfall} ${theme.unit}. What was the original target goal?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(goal);
      }

    // ========================================================================
    // SUB-TYPE 5: Target Shortfall with Multiplier Goal (Goal is m times a specific category)
    // ========================================================================
    } else if (subType === 5) {
      const theme = getRandomTargetShortfallTheme(3);
      const m = getRandomInt(3, 4);
      const k1 = getRandomInt(4, 5);
      const k2 = getRandomInt(1, 2);
      const k3 = getRandomInt(1, 2);
      const d1 = k1 * scaleStep;
      const d2 = k2 * scaleStep;
      const d3 = k3 * scaleStep;
      const goal = d1 * m;
      const sum = d1 + d2 + d3;
      const shortage = goal - sum;

      data = [
        { category: theme.items[0], value: d1 },
        { category: theme.items[1], value: d2 },
        { category: theme.items[2], value: d3 }
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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A ${theme.targetSubject} set a target goal that is ${m} times the number of ${theme.unit} ${theme.pastVerb} in ${data[0].category}. The bar graph shows the number of ${theme.unit} ${theme.pastVerb} in ${data[0].category}, ${data[1].category}, and ${data[2].category}. Calculate the target goal, the total number of ${theme.unit} ${theme.pastVerb} so far, and determine how many more ${theme.unit} are needed to reach the target goal."`;
        const stepsArr = [
          { label: `Write the working equation to find the target goal:`, expectedAnswer: `${d1} × ${m} = ${goal}`, acceptedAnswers: getMultiplicationAcceptedAnswers(d1, m, goal) },
          { label: `Write the working equation to find the total ${theme.unit} ${theme.pastVerb} across all 3 ${theme.categoriesPlural}:`, expectedAnswer: `${d1} + ${d2} + ${d3} = ${sum}`, acceptedAnswers: getSumAcceptedAnswers([d1, d2, d3], sum) },
          { label: `Write the working equation to find how many more ${theme.unit} are needed to reach the target goal:`, expectedAnswer: `${goal} - ${sum} = ${shortage}`, acceptedAnswers: getSubtractionAcceptedAnswers(goal, sum, shortage) },
          { label: `Number of ${theme.unit} needed to reach the target goal:`, expectedAnswer: String(shortage), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(shortage);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The target goal is ${m} times the number of ${theme.unit} ${theme.pastVerb} in ${data[0].category}. The bar graph shows the quantities ${theme.pastVerb} in ${data[0].category}, ${data[1].category}, and ${data[2].category}. How many more ${theme.unit} are needed to reach the target goal?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(shortage);
        const opts = getFourOptions(finalAnswer, [String(shortage + scaleStep), String(shortage - scaleStep > 0 ? shortage - scaleStep : shortage + 2 * scaleStep), String(goal), String(sum)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The target goal is ${m} times the number of ${theme.unit} ${theme.pastVerb} in ${data[0].category}. Based on the bar graph, how many more ${theme.unit} are needed to reach the target goal?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(shortage);
      }

    // ========================================================================
    // SUB-TYPE 6: Comparative Shortfall Between Two Groups / Categories
    // ========================================================================
    } else {
      const theme = getRandomTargetShortfallTheme(4);
      const kA = getRandomInt(4, 6);
      const kB = getRandomInt(2, 3);
      const valA = kA * scaleStep;
      const valB = kB * scaleStep;
      const goal = (kA + getRandomInt(2, 4)) * scaleStep;
      const shortA = goal - valA;
      const shortB = goal - valB;
      const diffShort = shortB - shortA;
      const valC = getRandomInt(2, 5) * scaleStep;
      const valD = getRandomInt(2, 5) * scaleStep;

      data = [
        { category: theme.items[0], value: valA },
        { category: theme.items[1], value: valB },
        { category: theme.items[2], value: valC },
        { category: theme.items[3], value: valD }
      ];
      const catA = data[0];
      const catB = data[1];

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Both ${catA.category} and ${catB.category} had an individual target goal to ${theme.verb} ${goal} ${theme.unit} ${theme.activity}. The bar graph shows the number of ${theme.unit} ${theme.pastVerb} by each group. Calculate the shortfall for ${catA.category} and the shortfall for ${catB.category}, then determine how many fewer ${theme.unit} ${catA.category} needed than ${catB.category} to reach the target goal."`;
        const stepsArr = [
          { label: `Write the working equation to find the shortfall for ${catA.category} to reach the target goal:`, expectedAnswer: `${goal} - ${valA} = ${shortA}`, acceptedAnswers: getSubtractionAcceptedAnswers(goal, valA, shortA) },
          { label: `Write the working equation to find the shortfall for ${catB.category} to reach the target goal:`, expectedAnswer: `${goal} - ${valB} = ${shortB}`, acceptedAnswers: getSubtractionAcceptedAnswers(goal, valB, shortB) },
          { label: `Write the working equation to find the difference between their shortfalls:`, expectedAnswer: `${shortB} - ${shortA} = ${diffShort}`, acceptedAnswers: getSubtractionAcceptedAnswers(shortB, shortA, diffShort) },
          { label: `Difference in shortfalls:`, expectedAnswer: String(diffShort), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(diffShort);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Both ${catA.category} and ${catB.category} had an individual target goal of ${goal} ${theme.unit} ${theme.activity}. How many fewer ${theme.unit} did ${catA.category} need than ${catB.category} to reach the target goal?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(diffShort);
        const opts = getFourOptions(finalAnswer, [String(diffShort + scaleStep), String(diffShort - scaleStep > 0 ? diffShort - scaleStep : diffShort + 2 * scaleStep), String(shortA), String(shortB)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Both ${catA.category} and ${catB.category} had an individual target goal of ${goal} ${theme.unit} ${theme.activity}. Based on the bar graph, how many fewer ${theme.unit} did ${catA.category} need than ${catB.category} to reach the target goal?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(diffShort);
      }
    }

  // --------------------------------------------------------------------------
  // Variant 15: Repacking/Grouping from Total Data
  // --------------------------------------------------------------------------

  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
