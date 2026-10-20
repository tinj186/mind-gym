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

export function generateAdvancedUnitValueFinancial({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

    const scaleStep = [2, 5, 10, 20][Math.floor(Math.random() * 4)];
    const orientation = Math.random() < 0.5 ? "vertical" : "horizontal";
    const theme = getRandomFinancialTheme(4);

    const mults = [getRandomInt(5, 7), getRandomInt(4, 5), getRandomInt(3, 4), getRandomInt(2, 3)].sort(() => 0.5 - Math.random());
    const data = theme.items.map((cat, idx) => ({ category: cat, value: mults[idx] * scaleStep }));

    const subType = getRandomInt(1, 7);

    // ========================================================================
    // SUB-TYPE 1: Two-Category Combined Revenue (QA x PA + QB x PB)
    // ========================================================================
    if (subType === 1) {
      const catA = data[0];
      const catB = data[1];
      const qtyA = catA.value;
      const qtyB = catB.value;
      const priceA = theme.prices[0] || 5;
      const priceB = theme.prices[1] || 3;

      const totalA = qtyA * priceA;
      const totalB = qtyB * priceB;
      const grandTotal = totalA + totalB;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. Each ${theme.unit.slice(0, -1) || 'item'} of ${catA.category} costs $${priceA} and each ${theme.unit.slice(0, -1) || 'item'} of ${catB.category} costs $${priceB}. Read the quantities from the bar graph, calculate the money collected from each, and find the grand total collected."`;
        const stepsArr = [
          { label: `Write the working equation to find the money collected from ${catA.category}:`, expectedAnswer: `${qtyA} x ${priceA} = ${totalA}`, acceptedAnswers: getMultiplicationAcceptedAnswers(qtyA, priceA, totalA) },
          { label: `Write the working equation to find the money collected from ${catB.category}:`, expectedAnswer: `${qtyB} x ${priceB} = ${totalB}`, acceptedAnswers: getMultiplicationAcceptedAnswers(qtyB, priceB, totalB) },
          { label: `Write the working equation to find the grand total collected:`, expectedAnswer: `${totalA} + ${totalB} = ${grandTotal}`, acceptedAnswers: [`${totalB} + ${totalA} = ${grandTotal}`, `${totalA}+${totalB}=${grandTotal}`, `${totalB}+${totalA}=${grandTotal}`] },
          { label: "Grand total collected ($):", expectedAnswer: String(grandTotal), acceptedAnswers: [`$${grandTotal}`] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(grandTotal);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${catA.category} costs $${priceA} each and ${catB.category} costs $${priceB} each. Based on the bar graph, what is the grand total amount of money collected from ${catA.category} and ${catB.category}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = `$${grandTotal}`;
        const opts = getFourOptions(finalAnswer, [`$${grandTotal + priceA * scaleStep}`, `$${grandTotal - priceB * scaleStep > 0 ? grandTotal - priceB * scaleStep : grandTotal + 25}`, `$${totalA}`, `$${totalB}`]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${catA.category} costs $${priceA} each and ${catB.category} costs $${priceB} each. Based on the bar graph, how much money was collected altogether from ${catA.category} and ${catB.category}? ($)"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(grandTotal);
      }

    // ========================================================================
    // SUB-TYPE 2: Difference in Revenue between Two Categories
    // ========================================================================
    } else if (subType === 2) {
      const catA = data[0];
      const catB = data[1];
      const qtyA = catA.value;
      const qtyB = catB.value;
      const priceA = theme.prices[0] || 5;
      let priceB = theme.prices[1] || 3;

      let totalA = qtyA * priceA;
      let totalB = qtyB * priceB;
      if (totalA === totalB) {
        priceB += 1;
        totalB = qtyB * priceB;
      }

      const moreCat = totalA > totalB ? catA.category : catB.category;
      const fewerCat = totalA > totalB ? catB.category : catA.category;
      const moreTotal = Math.max(totalA, totalB);
      const fewerTotal = Math.min(totalA, totalB);
      const diff = moreTotal - fewerTotal;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. Each ${theme.unit.slice(0, -1) || 'item'} of ${catA.category} costs $${priceA} and each ${theme.unit.slice(0, -1) || 'item'} of ${catB.category} costs $${priceB}. Read the quantities from the bar graph, calculate the money collected for both, and find out how much more money was collected from ${moreCat} than ${fewerCat}."`;
        const stepsArr = [
          { label: `Write the working equation to find the money collected from ${catA.category}:`, expectedAnswer: `${qtyA} x ${priceA} = ${totalA}`, acceptedAnswers: getMultiplicationAcceptedAnswers(qtyA, priceA, totalA) },
          { label: `Write the working equation to find the money collected from ${catB.category}:`, expectedAnswer: `${qtyB} x ${priceB} = ${totalB}`, acceptedAnswers: getMultiplicationAcceptedAnswers(qtyB, priceB, totalB) },
          { label: `Write the working equation to find how much more money was collected from ${moreCat} than ${fewerCat}:`, expectedAnswer: `${moreTotal} - ${fewerTotal} = ${diff}`, acceptedAnswers: [`${moreTotal}-${fewerTotal}=${diff}`] },
          { label: "Difference in money collected ($):", expectedAnswer: String(diff), acceptedAnswers: [`$${diff}`] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(diff);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${catA.category} costs $${priceA} each and ${catB.category} costs $${priceB} each. Based on the bar graph, how much more money was collected from ${moreCat} than ${fewerCat}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = `$${diff}`;
        const opts = getFourOptions(finalAnswer, [`$${diff + scaleStep * 2}`, `$${diff - scaleStep > 0 ? diff - scaleStep : diff + 20}`, `$${moreTotal}`, `$${fewerTotal}`]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${catA.category} costs $${priceA} each and ${catB.category} costs $${priceB} each. Based on the bar graph, how much more money was collected from ${moreCat} than ${fewerCat}? ($)"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(diff);
      }

    // ========================================================================
    // SUB-TYPE 3: Uniform Price Across Two Categories
    // ========================================================================
    } else if (subType === 3) {
      const catA = data[0];
      const catB = data[1];
      const qtyA = catA.value;
      const qtyB = catB.value;
      const uniformPrice = theme.prices[0] || 3;
      const totalQty = qtyA + qtyB;
      const totalMoney = totalQty * uniformPrice;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. Each ${theme.unit.slice(0, -1) || 'item'} of ${catA.category} and ${catB.category} was sold at the same price of $${uniformPrice}. Calculate the total number of ${theme.unit} for both items combined, and find the total money collected."`;
        const stepsArr = [
          { label: `Write the working equation to find the total number of ${theme.unit} for ${catA.category} and ${catB.category} combined:`, expectedAnswer: `${qtyA} + ${qtyB} = ${totalQty}`, acceptedAnswers: [`${qtyB} + ${qtyA} = ${totalQty}`, `${qtyA}+${qtyB}=${totalQty}`, `${qtyB}+${qtyA}=${totalQty}`] },
          { label: `Write the working equation to find the total money collected:`, expectedAnswer: `${totalQty} x ${uniformPrice} = ${totalMoney}`, acceptedAnswers: getMultiplicationAcceptedAnswers(totalQty, uniformPrice, totalMoney) },
          { label: "Total money collected ($):", expectedAnswer: String(totalMoney), acceptedAnswers: [`$${totalMoney}`] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(totalMoney);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Each ${theme.unit.slice(0, -1) || 'item'} of ${catA.category} and ${catB.category} was sold for $${uniformPrice}. Based on the bar graph, how much money was collected from selling both items combined?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = `$${totalMoney}`;
        const opts = getFourOptions(finalAnswer, [`$${totalMoney + uniformPrice * scaleStep}`, `$${totalMoney - uniformPrice * scaleStep > 0 ? totalMoney - uniformPrice * scaleStep : totalMoney + 15}`, `$${qtyA * uniformPrice}`, `$${qtyB * uniformPrice}`]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Each ${theme.unit.slice(0, -1) || 'item'} of ${catA.category} and ${catB.category} was sold for $${uniformPrice}. Based on the bar graph, how much money was collected from selling both items combined? ($)"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(totalMoney);
      }

    // ========================================================================
    // SUB-TYPE 4: Three-Category Total Revenue
    // ========================================================================
    } else if (subType === 4) {
      const catA = data[0];
      const catB = data[1];
      const catC = data[2];
      const priceA = theme.prices[0] || 4;
      const priceB = theme.prices[1] || 3;
      const priceC = theme.prices[2] || 2;

      const tA = catA.value * priceA;
      const tB = catB.value * priceB;
      const tC = catC.value * priceC;
      const grandTotal = tA + tB + tC;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. ${catA.category} costs $${priceA}, ${catB.category} costs $${priceB}, and ${catC.category} costs $${priceC}. Read the quantities from the bar graph, calculate the money collected for each category, and find the total money collected from all three categories."`;
        const stepsArr = [
          { label: `Write the working equation to find the money collected from ${catA.category}:`, expectedAnswer: `${catA.value} x ${priceA} = ${tA}`, acceptedAnswers: getMultiplicationAcceptedAnswers(catA.value, priceA, tA) },
          { label: `Write the working equation to find the money collected from ${catB.category}:`, expectedAnswer: `${catB.value} x ${priceB} = ${tB}`, acceptedAnswers: getMultiplicationAcceptedAnswers(catB.value, priceB, tB) },
          { label: `Write the working equation to find the money collected from ${catC.category}:`, expectedAnswer: `${catC.value} x ${priceC} = ${tC}`, acceptedAnswers: getMultiplicationAcceptedAnswers(catC.value, priceC, tC) },
          { label: `Write the working equation to find the total money collected from all 3 categories:`, expectedAnswer: `${tA} + ${tB} + ${tC} = ${grandTotal}`, acceptedAnswers: [`${tA}+${tB}+${tC}=${grandTotal}`] },
          { label: "Total money collected ($):", expectedAnswer: String(grandTotal), acceptedAnswers: [`$${grandTotal}`] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(grandTotal);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${catA.category} costs $${priceA}, ${catB.category} costs $${priceB}, and ${catC.category} costs $${priceC}. Based on the bar graph, what is the total money collected from these three categories?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = `$${grandTotal}`;
        const opts = getFourOptions(finalAnswer, [`$${grandTotal + 20}`, `$${grandTotal - 20 > 0 ? grandTotal - 20 : grandTotal + 40}`, `$${tA + tB}`, `$${tB + tC}`]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${catA.category} costs $${priceA}, ${catB.category} costs $${priceB}, and ${catC.category} costs $${priceC}. What is the total money collected from all three categories combined? ($)"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(grandTotal);
      }

    // ========================================================================
    // SUB-TYPE 5: Finding Unit Price from Given Total Revenue
    // ========================================================================
    } else if (subType === 5) {
      const catA = data[0];
      const unitPrice = theme.prices[0] || getRandomInt(3, 6);
      const totalRevenue = catA.value * unitPrice;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} recorded the ${theme.title.toLowerCase()} on a bar graph with grid lines in steps of ${scaleStep}. A total of $${totalRevenue} was collected from selling all the ${catA.category} shown on the graph. Read the quantity from the bar graph, and calculate the selling price of each ${theme.unit.slice(0, -1) || 'item'} of ${catA.category}."`;
        const stepsArr = [
          { label: `Write the working equation to find the price of each ${catA.category}:`, expectedAnswer: `${totalRevenue} ÷ ${catA.value} = ${unitPrice}`, acceptedAnswers: getDivisionAcceptedAnswers(totalRevenue, catA.value, unitPrice) },
          { label: `Price of each ${catA.category} ($):`, expectedAnswer: String(unitPrice), acceptedAnswers: [`$${unitPrice}`] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(unitPrice);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A total of $${totalRevenue} was collected from selling all the ${catA.category} shown on the bar graph. What was the price of each ${theme.unit.slice(0, -1) || 'item'} of ${catA.category}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = `$${unitPrice}`;
        const opts = getFourOptions(finalAnswer, [`$${unitPrice + 1}`, `$${unitPrice - 1 > 0 ? unitPrice - 1 : unitPrice + 2}`, `$${unitPrice + 3}`, `$${unitPrice + 4}`]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A total of $${totalRevenue} was collected from selling all the ${catA.category} shown on the bar graph. What was the selling price of each ${catA.category}? ($)"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(unitPrice);
      }

    // ========================================================================
    // SUB-TYPE 6: Budget / Remaining Balance After Purchases
    // ========================================================================
    } else if (subType === 6) {
      const catA = data[0];
      const catB = data[1];
      const priceA = theme.prices[0] || 5;
      const priceB = theme.prices[1] || 3;

      const costA = catA.value * priceA;
      const costB = catB.value * priceB;
      const totalCost = costA + costB;
      const budget = totalCost + scaleStep * getRandomInt(2, 4) * 5;
      const remaining = budget - totalCost;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} had $${budget}. The bar graph shows the items bought for the ${theme.context}. Each ${theme.unit.slice(0, -1) || 'item'} of ${catA.category} cost $${priceA} and each ${theme.unit.slice(0, -1) || 'item'} of ${catB.category} cost $${priceB}. Calculate the total cost of both items, and determine how much money ${studentName} had left."`;
        const stepsArr = [
          { label: `Write the working equation to find the total cost of ${catA.category}:`, expectedAnswer: `${catA.value} x ${priceA} = ${costA}`, acceptedAnswers: getMultiplicationAcceptedAnswers(catA.value, priceA, costA) },
          { label: `Write the working equation to find the total cost of ${catB.category}:`, expectedAnswer: `${catB.value} x ${priceB} = ${costB}`, acceptedAnswers: getMultiplicationAcceptedAnswers(catB.value, priceB, costB) },
          { label: `Write the working equation to find the total cost of both categories:`, expectedAnswer: `${costA} + ${costB} = ${totalCost}`, acceptedAnswers: [`${costB} + ${costA} = ${totalCost}`, `${costA}+${costB}=${totalCost}`, `${costB}+${costA}=${totalCost}`] },
          { label: `Write the working equation to find how much money was left:`, expectedAnswer: `${budget} - ${totalCost} = ${remaining}`, acceptedAnswers: [`${budget}-${totalCost}=${remaining}`] },
          { label: "Money left ($):", expectedAnswer: String(remaining), acceptedAnswers: [`$${remaining}`] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(remaining);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} had $${budget}. ${studentName} bought all the ${catA.category} at $${priceA} each and all the ${catB.category} at $${priceB} each as shown on the bar graph. How much money was left?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = `$${remaining}`;
        const opts = getFourOptions(finalAnswer, [`$${remaining + 20}`, `$${remaining - 20 > 0 ? remaining - 20 : remaining + 30}`, `$${totalCost}`, `$${budget - costA}`]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} had $${budget}. ${studentName} bought all the ${catA.category} at $${priceA} each and all the ${catB.category} at $${priceB} each as shown on the graph. How much money was left? ($)"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(remaining);
      }

    // ========================================================================
    // SUB-TYPE 7: Fundraising Goal / Target Revenue Shortfall
    // ========================================================================
    } else {
      const catA = data[0];
      const catB = data[1];
      const priceA = theme.prices[0] || 5;
      const priceB = theme.prices[1] || 3;

      const raisedA = catA.value * priceA;
      const raisedB = catB.value * priceB;
      const totalRaised = raisedA + raisedB;
      const shortfall = scaleStep * getRandomInt(2, 4) * 5;
      const targetGoal = totalRaised + shortfall;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${studentName} set a target to raise $${targetGoal} for charity. The bar graph shows the items sold so far. Each ${theme.unit.slice(0, -1) || 'item'} of ${catA.category} was sold for $${priceA} and each ${theme.unit.slice(0, -1) || 'item'} of ${catB.category} was sold for $${priceB}. Calculate the total money raised so far, and find how much more money is needed to reach the target."`;
        const stepsArr = [
          { label: `Write the working equation to find the money raised from ${catA.category}:`, expectedAnswer: `${catA.value} x ${priceA} = ${raisedA}`, acceptedAnswers: getMultiplicationAcceptedAnswers(catA.value, priceA, raisedA) },
          { label: `Write the working equation to find the money raised from ${catB.category}:`, expectedAnswer: `${catB.value} x ${priceB} = ${raisedB}`, acceptedAnswers: getMultiplicationAcceptedAnswers(catB.value, priceB, raisedB) },
          { label: `Write the working equation to find the total money raised so far:`, expectedAnswer: `${raisedA} + ${raisedB} = ${totalRaised}`, acceptedAnswers: [`${raisedB} + ${raisedA} = ${totalRaised}`, `${raisedA}+${raisedB}=${totalRaised}`, `${raisedB}+${raisedA}=${totalRaised}`] },
          { label: `Write the working equation to find how much more money is needed:`, expectedAnswer: `${targetGoal} - ${totalRaised} = ${shortfall}`, acceptedAnswers: [`${targetGoal}-${totalRaised}=${shortfall}`] },
          { label: "Money still needed ($):", expectedAnswer: String(shortfall), acceptedAnswers: [`$${shortfall}`] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(shortfall);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The fundraising target is $${targetGoal}. ${catA.category} was sold for $${priceA} each and ${catB.category} for $${priceB} each. Based on the bar graph, how much more money is needed to reach the target?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = `$${shortfall}`;
        const opts = getFourOptions(finalAnswer, [`$${shortfall + 20}`, `$${shortfall - 20 > 0 ? shortfall - 20 : shortfall + 40}`, `$${totalRaised}`, `$${targetGoal - raisedA}`]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The fundraising target is $${targetGoal}. ${catA.category} was sold for $${priceA} each and ${catB.category} for $${priceB} each. Based on the bar graph, how much more money is needed to reach the target? ($)"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(shortfall);
      }
    }

  // --------------------------------------------------------------------------
  // Variant 12: Algebraic Multiplier Deduction (Finding the Unknown)
  // --------------------------------------------------------------------------

  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
