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

export function generateAdvancedRepackingGrouping({ isMCQ, isShort, isStructure, studentName }) {
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
    // SUB-TYPE 1: Full Combination & Equal Repacking (Classic Division)
    // ========================================================================
    if (subType === 1) {
      const N = getRandomInt(3, 4);
      const theme = getRandomRepackingTheme(N);
      const capPool = theme.capacityPool || [4, 5, 6, 8, 10];
      const capacity = capPool[Math.floor(Math.random() * capPool.length)];
      const L = lcm(scaleStep, capacity);
      let mult = getRandomInt(2, 4);
      while ((mult * L) / scaleStep < N * 2) {
        mult++;
      }
      const totalAmount = mult * L;
      const containersNeeded = totalAmount / capacity;
      const totalSteps = totalAmount / scaleStep;
      const parts = partitionSum(totalSteps, N, 2);

      data = theme.items.map((cat, idx) => ({ category: cat, value: parts[idx] * scaleStep }));

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"All the ${theme.unit} from ${data.map(d => d.category).join(', ')} are mixed together and packed equally into ${theme.containersPlural}. Each ${theme.container} holds exactly ${capacity} ${theme.unit}. Read the bar graph to find the total ${theme.unit} ${theme.actionVerb}, and calculate how many ${theme.containersPlural} are needed."`;
        const stepsArr = [
          { label: `Write the working equation to find the total ${theme.unit} ${theme.actionVerb} across all ${N} ${theme.sourcesPlural}:`, expectedAnswer: `${data.map(d => d.value).join(' + ')} = ${totalAmount}`, acceptedAnswers: getSumAcceptedAnswers(data.map(d => d.value), totalAmount) },
          { label: `Write the working equation to find the number of ${theme.containersPlural} needed:`, expectedAnswer: `${totalAmount} ÷ ${capacity} = ${containersNeeded}`, acceptedAnswers: getDivisionAcceptedAnswers(totalAmount, capacity, containersNeeded) },
          { label: `Number of ${theme.containersPlural} needed:`, expectedAnswer: String(containersNeeded), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(containersNeeded);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"All the ${theme.unit} from ${data.map(d => d.category).join(', ')} are packed into ${theme.containersPlural} of ${capacity} ${theme.unit} each. Based on the bar graph, how many ${theme.containersPlural} are needed?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(containersNeeded);
        const opts = getFourOptions(finalAnswer, [String(containersNeeded - 2 > 0 ? containersNeeded - 2 : containersNeeded + 3), String(containersNeeded + 2), String(containersNeeded + 5), String(Math.floor(totalAmount / scaleStep))]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"All the ${theme.unit} shown on the bar graph are packed into ${theme.containersPlural} of ${capacity} ${theme.unit} each. How many ${theme.containersPlural} are needed?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(containersNeeded);
      }

    // ========================================================================
    // SUB-TYPE 2: Repacking with Leftover / Remainder
    // ========================================================================
    } else if (subType === 2) {
      const theme = getRandomRepackingTheme(3);
      const subScaleSteps = [2, 5, 10];
      const step = subScaleSteps[Math.floor(Math.random() * subScaleSteps.length)];
      const capacity = getRandomInt(4, 7);
      let kTotal = getRandomInt(10, 18);
      let totalAmount = kTotal * step;
      let remainder = totalAmount % capacity;
      if (remainder === 0) {
        kTotal += 1;
        totalAmount = kTotal * step;
        remainder = totalAmount % capacity;
      }
      if (remainder === 0) {
        kTotal += 1;
        totalAmount = kTotal * step;
        remainder = totalAmount % capacity;
      }
      const fullContainers = Math.floor(totalAmount / capacity);
      const packedAmount = fullContainers * capacity;
      const parts = partitionSum(kTotal, 3, 2);

      data = theme.items.map((cat, idx) => ({ category: cat, value: parts[idx] * step }));

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: orientation === "horizontal" ? theme.yAxisLabel : theme.xAxisLabel,
          yAxisLabel: orientation === "horizontal" ? theme.xAxisLabel : theme.yAxisLabel,
          data,
          scaleStep: step,
          orientation,
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"All the ${theme.unit} from ${data[0].category}, ${data[1].category}, and ${data[2].category} are collected together and packed into ${theme.containersPlural} of ${capacity} ${theme.unit} each. Calculate the total number of ${theme.unit} ${theme.actionVerb}, and determine how many ${theme.unit} are left unpacked after filling as many full ${theme.containersPlural} as possible."`;
        const stepsArr = [
          { label: `Write the working equation to find the total number of ${theme.unit} ${theme.actionVerb} across all 3 ${theme.sourcesPlural}:`, expectedAnswer: `${data.map(d => d.value).join(' + ')} = ${totalAmount}`, acceptedAnswers: getSumAcceptedAnswers(data.map(d => d.value), totalAmount) },
          { label: `Write the working equation to find how many ${theme.unit} are packed into full ${theme.containersPlural}:`, expectedAnswer: `${fullContainers} × ${capacity} = ${packedAmount}`, acceptedAnswers: getMultiplicationAcceptedAnswers(fullContainers, capacity, packedAmount) },
          { label: `Write the working equation to find how many ${theme.unit} are left unpacked:`, expectedAnswer: `${totalAmount} - ${packedAmount} = ${remainder}`, acceptedAnswers: getSubtractionAcceptedAnswers(totalAmount, packedAmount, remainder) },
          { label: `Number of ${theme.unit} left unpacked:`, expectedAnswer: String(remainder), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(remainder);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"All the ${theme.unit} shown on the bar graph are packed into ${theme.containersPlural} of ${capacity} ${theme.unit} each. How many ${theme.unit} are left unpacked after filling as many full ${theme.containersPlural} as possible?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(remainder);
        const opts = getFourOptions(finalAnswer, [String(remainder + 1), String(remainder - 1 > 0 ? remainder - 1 : remainder + 2), String(fullContainers), String(capacity)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"All the ${theme.unit} shown on the bar graph are packed into ${theme.containersPlural} of ${capacity} ${theme.unit} each. How many ${theme.unit} are left unpacked after filling as many full ${theme.containersPlural} as possible?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(remainder);
      }

    // ========================================================================
    // SUB-TYPE 3: Repacking Subset / Specific Categories Combined
    // ========================================================================
    } else if (subType === 3) {
      const theme = getRandomRepackingTheme(4);
      const capacity = getRandomInt(3, 8);
      const L = lcm(scaleStep, capacity);
      let mult = getRandomInt(2, 3);
      while ((mult * L) / scaleStep < 4) {
        mult++;
      }
      const subTotal = mult * L;
      const containersNeeded = subTotal / capacity;
      const subSteps = subTotal / scaleStep;
      const partsAB = partitionSum(subSteps, 2, 2);
      const valA = partsAB[0] * scaleStep;
      const valB = partsAB[1] * scaleStep;
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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Only the ${theme.unit} from ${catA.category} and ${catB.category} are combined and repacked into ${theme.containersPlural} of ${capacity} ${theme.unit} each. Calculate the combined total of ${theme.unit} from ${catA.category} and ${catB.category}, then determine how many ${theme.containersPlural} are needed."`;
        const stepsArr = [
          { label: `Write the working equation to find the combined total ${theme.unit} from ${catA.category} and ${catB.category}:`, expectedAnswer: `${valA} + ${valB} = ${subTotal}`, acceptedAnswers: getAdditionAcceptedAnswers(valA, valB, subTotal) },
          { label: `Write the working equation to find the number of ${theme.containersPlural} needed:`, expectedAnswer: `${subTotal} ÷ ${capacity} = ${containersNeeded}`, acceptedAnswers: getDivisionAcceptedAnswers(subTotal, capacity, containersNeeded) },
          { label: `Number of ${theme.containersPlural} needed:`, expectedAnswer: String(containersNeeded), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(containersNeeded);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Only the ${theme.unit} from ${catA.category} and ${catB.category} are packed into ${theme.containersPlural} of ${capacity} ${theme.unit} each. Based on the bar graph, how many ${theme.containersPlural} are needed?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(containersNeeded);
        const opts = getFourOptions(finalAnswer, [String(containersNeeded - 2 > 0 ? containersNeeded - 2 : containersNeeded + 3), String(containersNeeded + 2), String(containersNeeded + 4), String(Math.floor(subTotal / scaleStep))]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Only the ${theme.unit} from ${catA.category} and ${catB.category} are packed into ${theme.containersPlural} of ${capacity} ${theme.unit} each. Based on the bar graph, how many ${theme.containersPlural} are needed?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(containersNeeded);
      }

    // ========================================================================
    // SUB-TYPE 4: Repacking and Selling (Grouping + Value / Revenue)
    // ========================================================================
    } else if (subType === 4) {
      const theme = getRandomRepackingTheme(3);
      const subScaleSteps = [2, 5, 10];
      const step = subScaleSteps[Math.floor(Math.random() * subScaleSteps.length)];
      const capPool = theme.capacityPool || [4, 5, 6, 8, 10];
      const capacity = capPool[Math.floor(Math.random() * capPool.length)];
      const pricePool = theme.pricePool || [4, 5, 6, 8];
      const price = pricePool[Math.floor(Math.random() * pricePool.length)];
      const L = lcm(step, capacity);
      let mult = getRandomInt(2, 3);
      while ((mult * L) / step < 6) {
        mult++;
      }
      const totalAmount = mult * L;
      const containersPacked = totalAmount / capacity;
      const revenue = containersPacked * price;
      const totalSteps = totalAmount / step;
      const parts = partitionSum(totalSteps, 3, 2);

      data = theme.items.map((cat, idx) => ({ category: cat, value: parts[idx] * step }));

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: orientation === "horizontal" ? theme.yAxisLabel : theme.xAxisLabel,
          yAxisLabel: orientation === "horizontal" ? theme.xAxisLabel : theme.yAxisLabel,
          data,
          scaleStep: step,
          orientation,
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"All the ${theme.unit} from ${data[0].category}, ${data[1].category}, and ${data[2].category} are packed into ${theme.containersPlural} of ${capacity} ${theme.unit} each. Each ${theme.container} is then sold for $${price}. Calculate the total number of ${theme.unit} ${theme.actionVerb}, the number of ${theme.containersPlural} packed, and the total money collected from selling all the ${theme.containersPlural}."`;
        const stepsArr = [
          { label: `Write the working equation to find the total number of ${theme.unit} ${theme.actionVerb} across all 3 ${theme.sourcesPlural}:`, expectedAnswer: `${data.map(d => d.value).join(' + ')} = ${totalAmount}`, acceptedAnswers: getSumAcceptedAnswers(data.map(d => d.value), totalAmount) },
          { label: `Write the working equation to find the number of ${theme.containersPlural} packed:`, expectedAnswer: `${totalAmount} ÷ ${capacity} = ${containersPacked}`, acceptedAnswers: getDivisionAcceptedAnswers(totalAmount, capacity, containersPacked) },
          { label: `Write the working equation to find the total money collected from selling all ${theme.containersPlural}:`, expectedAnswer: `${containersPacked} × ${price} = ${revenue}`, acceptedAnswers: getMultiplicationAcceptedAnswers(containersPacked, price, revenue) },
          { label: `Total money collected in dollars:`, expectedAnswer: String(revenue), acceptedAnswers: [`$${revenue}`] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(revenue);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"All the ${theme.unit} from the 3 ${theme.sourcesPlural} are packed into ${theme.containersPlural} of ${capacity} ${theme.unit} each and sold for $${price} per ${theme.container}. How much money was collected in total?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(revenue);
        const opts = getFourOptions(finalAnswer, [String(revenue + price * 2), String(revenue - price * 2 > 0 ? revenue - price * 2 : revenue + price * 4), String(containersPacked), String(totalAmount)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"All the ${theme.unit} from the 3 ${theme.sourcesPlural} are packed into ${theme.containersPlural} of ${capacity} ${theme.unit} each and sold for $${price} per ${theme.container}. How much money was collected in total?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(revenue);
      }

    // ========================================================================
    // SUB-TYPE 5: Two Container Sizes Comparison (Large vs Small Containers)
    // ========================================================================
    } else if (subType === 5) {
      const theme = getRandomRepackingTheme(3);
      const subScaleSteps = [2, 5, 10];
      const step = subScaleSteps[Math.floor(Math.random() * subScaleSteps.length)];
      const pairs = [[8, 4], [10, 5], [6, 3], [12, 6], [10, 2]];
      const [cL, cS] = pairs[Math.floor(Math.random() * pairs.length)];
      const L = lcm(step, lcm(cL, cS));
      let mult = 1;
      while ((mult * L) / step < 6) {
        mult++;
      }
      const totalAmount = mult * L;
      const numLarge = totalAmount / cL;
      const numSmall = totalAmount / cS;
      const diffContainers = numSmall - numLarge;
      const totalSteps = totalAmount / step;
      const parts = partitionSum(totalSteps, 3, 2);

      data = theme.items.map((cat, idx) => ({ category: cat, value: parts[idx] * step }));

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: orientation === "horizontal" ? theme.yAxisLabel : theme.xAxisLabel,
          yAxisLabel: orientation === "horizontal" ? theme.xAxisLabel : theme.yAxisLabel,
          data,
          scaleStep: step,
          orientation,
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"All the ${theme.unit} from ${data[0].category}, ${data[1].category}, and ${data[2].category} can be packed into either large ${theme.containersPlural} of ${cL} ${theme.unit} each or small ${theme.containersPlural} of ${cS} ${theme.unit} each. Calculate the number of large ${theme.containersPlural} needed and the number of small ${theme.containersPlural} needed, then determine how many more small ${theme.containersPlural} than large ${theme.containersPlural} are needed to pack all the ${theme.unit}."`;
        const stepsArr = [
          { label: `Write the working equation to find the number of large ${theme.containersPlural} needed:`, expectedAnswer: `${totalAmount} ÷ ${cL} = ${numLarge}`, acceptedAnswers: getDivisionAcceptedAnswers(totalAmount, cL, numLarge) },
          { label: `Write the working equation to find the number of small ${theme.containersPlural} needed:`, expectedAnswer: `${totalAmount} ÷ ${cS} = ${numSmall}`, acceptedAnswers: getDivisionAcceptedAnswers(totalAmount, cS, numSmall) },
          { label: `Write the working equation to find how many more small ${theme.containersPlural} than large ${theme.containersPlural} are needed:`, expectedAnswer: `${numSmall} - ${numLarge} = ${diffContainers}`, acceptedAnswers: getSubtractionAcceptedAnswers(numSmall, numLarge, diffContainers) },
          { label: `Difference in number of ${theme.containersPlural}:`, expectedAnswer: String(diffContainers), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(diffContainers);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"All the ${theme.unit} shown on the bar graph can be packed into either large ${theme.containersPlural} of ${cL} ${theme.unit} each or small ${theme.containersPlural} of ${cS} ${theme.unit} each. How many more small ${theme.containersPlural} than large ${theme.containersPlural} are needed?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(diffContainers);
        const opts = getFourOptions(finalAnswer, [String(diffContainers + 2), String(diffContainers - 2 > 0 ? diffContainers - 2 : diffContainers + 4), String(numLarge), String(numSmall)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"All the ${theme.unit} shown on the bar graph can be packed into either large ${theme.containersPlural} of ${cL} ${theme.unit} each or small ${theme.containersPlural} of ${cS} ${theme.unit} each. How many more small ${theme.containersPlural} than large ${theme.containersPlural} are needed?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(diffContainers);
      }

    // ========================================================================
    // SUB-TYPE 6: Repacking with Defective / Damaged Deduction First
    // ========================================================================
    } else {
      const theme = getRandomRepackingTheme(3);
      const subScaleSteps = [2, 5, 10];
      const step = subScaleSteps[Math.floor(Math.random() * subScaleSteps.length)];
      const capacity = getRandomInt(4, 8);
      const L = lcm(step, capacity);
      let mult = getRandomInt(2, 3);
      while ((mult * L) / step < 6) {
        mult++;
      }
      const goodAmount = mult * L;
      const damagedAmount = getRandomInt(1, 2) * step;
      const totalAmount = goodAmount + damagedAmount;
      const containersPacked = goodAmount / capacity;
      const totalSteps = totalAmount / step;
      const parts = partitionSum(totalSteps, 3, 2);

      data = theme.items.map((cat, idx) => ({ category: cat, value: parts[idx] * step }));

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_GRAPH",
        componentData: {
          title: theme.title,
          xAxisLabel: orientation === "horizontal" ? theme.yAxisLabel : theme.xAxisLabel,
          yAxisLabel: orientation === "horizontal" ? theme.xAxisLabel : theme.yAxisLabel,
          data,
          scaleStep: step,
          orientation,
          showGridLines: true
        }
      });

      if (isStructure) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A total of ${damagedAmount} damaged ${theme.unit} were found and removed from the collection across ${data[0].category}, ${data[1].category}, and ${data[2].category}. The remaining ${theme.unit} were then packed evenly into ${theme.containersPlural} of ${capacity} ${theme.unit} each. Calculate the total number of ${theme.unit} ${theme.actionVerb}, the number of remaining ${theme.unit}, and determine how many ${theme.containersPlural} were packed."`;
        const stepsArr = [
          { label: `Write the working equation to find the total number of ${theme.unit} ${theme.actionVerb} across all 3 ${theme.sourcesPlural}:`, expectedAnswer: `${data.map(d => d.value).join(' + ')} = ${totalAmount}`, acceptedAnswers: getSumAcceptedAnswers(data.map(d => d.value), totalAmount) },
          { label: `Write the working equation to find the number of ${theme.unit} remaining after removing the damaged ${theme.unit}:`, expectedAnswer: `${totalAmount} - ${damagedAmount} = ${goodAmount}`, acceptedAnswers: getSubtractionAcceptedAnswers(totalAmount, damagedAmount, goodAmount) },
          { label: `Write the working equation to find the number of ${theme.containersPlural} packed:`, expectedAnswer: `${goodAmount} ÷ ${capacity} = ${containersPacked}`, acceptedAnswers: getDivisionAcceptedAnswers(goodAmount, capacity, containersPacked) },
          { label: `Number of ${theme.containersPlural} packed:`, expectedAnswer: String(containersPacked), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(containersPacked);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"After removing ${damagedAmount} damaged ${theme.unit} from the items shown on the bar graph, the remaining ${theme.unit} were packed into ${theme.containersPlural} of ${capacity} ${theme.unit} each. How many ${theme.containersPlural} were packed?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(containersPacked);
        const opts = getFourOptions(finalAnswer, [String(containersPacked + 2), String(containersPacked - 2 > 0 ? containersPacked - 2 : containersPacked + 4), String(Math.floor(totalAmount / capacity)), String(damagedAmount)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"After removing ${damagedAmount} damaged ${theme.unit} from the items shown on the bar graph, the remaining ${theme.unit} were packed into ${theme.containersPlural} of ${capacity} ${theme.unit} each. How many ${theme.containersPlural} were packed?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(containersPacked);
      }
    }

  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
