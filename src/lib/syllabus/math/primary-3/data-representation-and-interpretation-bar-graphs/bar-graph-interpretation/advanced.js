import { getRandomBarGraphTheme, getRandomFinancialTheme, getRandomAlgebraicTheme, getRandomEqualizingTheme, getRandomTargetShortfallTheme, getRandomRepackingTheme, getRandomNames, CONTEXT_TIERS } from '../../../../../utils/variable-bank.js';

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

const gcd = (a, b) => (!b ? a : gcd(b, a % b));
const lcm = (a, b) => (a * b) / gcd(a, b);

const partitionSum = (totalSteps, count, minStep = 2) => {
  let rem = totalSteps - count * minStep;
  const parts = Array(count).fill(minStep);
  while (rem > 0) {
    const idx = Math.floor(Math.random() * count);
    parts[idx]++;
    rem--;
  }
  return parts;
};

const getAdditionAcceptedAnswers = (a, b, sum) => [
  `${a} + ${b} = ${sum}`,
  `${b} + ${a} = ${sum}`,
  `${a}+${b}=${sum}`,
  `${b}+${a}=${sum}`
];

const getSubtractionAcceptedAnswers = (a, b, diff) => [
  `${a} - ${b} = ${diff}`,
  `${a}-${b}=${diff}`
];

const getSumAcceptedAnswers = (terms, sum) => [
  `${terms.join(' + ')} = ${sum}`,
  `${terms.join('+')}=${sum}`
];

const getMultiplicationAcceptedAnswers = (a, b, product) => [
  `${a} x ${b} = ${product}`,
  `${b} x ${a} = ${product}`,
  `${a} X ${b} = ${product}`,
  `${b} X ${a} = ${product}`,
  `${a} × ${b} = ${product}`,
  `${b} × ${a} = ${product}`,
  `${a} * ${b} = ${product}`,
  `${b} * ${a} = ${product}`,
  `${a}x${b}=${product}`,
  `${b}x${a}=${product}`,
  `${a}X${b}=${product}`,
  `${b}X${a}=${product}`,
  `${a}×${b}=${product}`,
  `${b}×${a}=${product}`,
  `${a}*${b}=${product}`,
  `${b}*${a}=${product}`
];

const getDivisionAcceptedAnswers = (total, divisor, quotient) => [
  `${total} ÷ ${divisor} = ${quotient}`,
  `${total} / ${divisor} = ${quotient}`,
  `${total}÷${divisor}=${quotient}`,
  `${total}/${divisor}=${quotient}`
];

const getFourOptions = (correctVal, candidateDistractors = []) => {
  const set = new Set([String(correctVal)]);
  for (const d of candidateDistractors) {
    if (d !== undefined && d !== null && String(d).trim() !== '' && !set.has(String(d)) && set.size < 4) {
      set.add(String(d));
    }
  }
  let delta = 1;
  const hasDollar = String(correctVal).startsWith('$');
  const rawNum = hasDollar ? String(correctVal).replace(/^\$/, '') : String(correctVal);
  const num = Number(rawNum);
  while (set.size < 4) {
    if (!isNaN(num)) {
      const val = Math.max(1, num + (set.size % 2 === 1 ? delta * 5 : -delta * 5));
      const candidate = hasDollar ? `$${val}` : String(val);
      if (!set.has(candidate)) set.add(candidate);
    } else {
      set.add(`Option ${set.size + 1}`);
    }
    delta++;
  }
  return Array.from(set);
};

export const generateAdvanced = (variant, type, getFormatInstructions) => {
  const safeType = String(type).toLowerCase();
  const isMCQ = safeType === 'mcq';
  const isShort = safeType === 'short question';
  const isStructure = !isMCQ && !isShort;

  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

  const studentName = getRandomNames(1)[0] || 'Cindy';

  // --------------------------------------------------------------------------
  // Variant 11: Unit Value / Financial Application
  // --------------------------------------------------------------------------
  if (variant === 'advanced_unit_value_financial') {
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
  } else if (variant === 'advanced_algebraic_multiplier_deduction') {
    const scaleStep = [2, 5, 10, 20][Math.floor(Math.random() * 4)];
    const orientation = Math.random() < 0.5 ? "vertical" : "horizontal";
    const theme = getRandomAlgebraicTheme(3);
    const extEntity = theme.externalEntity;
    const baseVerb = theme.baseVerb || 'collect';

    // 6 Sub-types covering diverse algebraic multiplier reasoning
    const subType = getRandomInt(1, 6);

    // Multiplier: 2, 3, or 4
    const multiplier = [2, 3, 4][Math.floor(Math.random() * 3)];
    const multiplierWord = multiplier === 2 ? "twice as many" : `${multiplier} times as many`;

    let data = [];

    // ========================================================================
    // SUB-TYPE 1: External Entity Multiplier of Combined Categories
    // ========================================================================
    if (subType === 1) {
      const valA = getRandomInt(2, 5) * scaleStep;
      const valB = getRandomInt(2, 5) * scaleStep;
      const valC = getRandomInt(2, 5) * scaleStep;
      data = [
        { category: theme.items[0], value: valA },
        { category: theme.items[1], value: valB },
        { category: theme.items[2], value: valC }
      ];
      const catA = data[1];
      const catB = data[2];
      const combined = catA.value + catB.value;
      const ans = combined * multiplier;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the number of ${theme.unit} ${theme.verb} by ${data[0].category}, ${catA.category}, and ${catB.category}. ${extEntity} ${theme.verb} ${multiplierWord} ${theme.unit} as ${catA.category} and ${catB.category} combined. Calculate the total number of ${theme.unit} ${theme.verb} by ${catA.category} and ${catB.category}, then find the number of ${theme.unit} ${extEntity} ${theme.verb}."`;
        const stepsArr = [
          { label: `Write the working equation to find the combined number of ${theme.unit} for ${catA.category} and ${catB.category}:`, expectedAnswer: `${catA.value} + ${catB.value} = ${combined}`, acceptedAnswers: getAdditionAcceptedAnswers(catA.value, catB.value, combined) },
          { label: `Write the working equation to find the number of ${theme.unit} ${extEntity} ${theme.verb}:`, expectedAnswer: `${combined} x ${multiplier} = ${ans}`, acceptedAnswers: getMultiplicationAcceptedAnswers(combined, multiplier, ans) },
          { label: `Number of ${theme.unit} ${extEntity} ${theme.verb}:`, expectedAnswer: String(ans), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(ans);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, ${extEntity} ${theme.verb} ${multiplierWord} ${theme.unit} as ${catA.category} and ${catB.category} combined. How many ${theme.unit} did ${extEntity} ${baseVerb}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(ans);
        const opts = getFourOptions(finalAnswer, [String(combined), String(ans + scaleStep * multiplier), String(ans - scaleStep * multiplier > 0 ? ans - scaleStep * multiplier : ans + 20), String(catA.value * multiplier)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Based on the bar graph, ${extEntity} ${theme.verb} ${multiplierWord} ${theme.unit} as ${catA.category} and ${catB.category} combined. How many ${theme.unit} did ${extEntity} ${baseVerb}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(ans);
      }

    // ========================================================================
    // SUB-TYPE 2: External Entity Multiplier of Difference
    // ========================================================================
    } else if (subType === 2) {
      let valA = getRandomInt(3, 6) * scaleStep;
      let valB = getRandomInt(1, 4) * scaleStep;
      if (valA === valB) valA += scaleStep;
      const valC = getRandomInt(2, 5) * scaleStep;
      data = [
        { category: theme.items[0], value: valA },
        { category: theme.items[1], value: valB },
        { category: theme.items[2], value: valC }
      ];
      const moreCat = valA > valB ? data[0] : data[1];
      const fewerCat = valA > valB ? data[1] : data[0];
      const diff = moreCat.value - fewerCat.value;
      const ans = diff * multiplier;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the number of ${theme.unit} ${theme.verb} by ${data[0].category}, ${data[1].category}, and ${data[2].category}. ${extEntity} ${theme.verb} ${multiplierWord} ${theme.unit} as the difference between ${moreCat.category} and ${fewerCat.category}. Calculate the difference between ${moreCat.category} and ${fewerCat.category}, then determine how many ${theme.unit} ${extEntity} ${theme.verb}."`;
        const stepsArr = [
          { label: `Write the working equation to find the difference in ${theme.unit} between ${moreCat.category} and ${fewerCat.category}:`, expectedAnswer: `${moreCat.value} - ${fewerCat.value} = ${diff}`, acceptedAnswers: getSubtractionAcceptedAnswers(moreCat.value, fewerCat.value, diff) },
          { label: `Write the working equation to find the number of ${theme.unit} ${extEntity} ${theme.verb}:`, expectedAnswer: `${diff} x ${multiplier} = ${ans}`, acceptedAnswers: getMultiplicationAcceptedAnswers(diff, multiplier, ans) },
          { label: `Number of ${theme.unit} ${extEntity} ${theme.verb}:`, expectedAnswer: String(ans), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(ans);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${extEntity} ${theme.verb} ${multiplierWord} ${theme.unit} as the difference between ${moreCat.category} and ${fewerCat.category}. Based on the bar graph, how many ${theme.unit} did ${extEntity} ${baseVerb}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(ans);
        const opts = getFourOptions(finalAnswer, [String(diff), String(ans + scaleStep * 2), String(ans - scaleStep > 0 ? ans - scaleStep : ans + 15), String(moreCat.value)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${extEntity} ${theme.verb} ${multiplierWord} ${theme.unit} as the difference between ${moreCat.category} and ${fewerCat.category}. Based on the bar graph, how many ${theme.unit} did ${extEntity} ${baseVerb}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(ans);
      }

    // ========================================================================
    // SUB-TYPE 3: Reverse Multiplier Deduction (Finding Unknown From Graph Multiplier)
    // ========================================================================
    } else if (subType === 3) {
      const valA = getRandomInt(2, 5) * multiplier * scaleStep;
      const valB = getRandomInt(2, 5) * scaleStep;
      const valC = getRandomInt(2, 5) * scaleStep;
      data = [
        { category: theme.items[0], value: valA },
        { category: theme.items[1], value: valB },
        { category: theme.items[2], value: valC }
      ];
      const catA = data[0];
      const ans = valA / multiplier;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the number of ${theme.unit} ${theme.verb}. ${catA.category} ${theme.verb} ${multiplierWord} ${theme.unit} as ${extEntity}. Read the quantity from the bar graph, and calculate how many ${theme.unit} ${extEntity} ${theme.verb}."`;
        const stepsArr = [
          { label: `Write the working equation to find the number of ${theme.unit} ${extEntity} ${theme.verb}:`, expectedAnswer: `${valA} ÷ ${multiplier} = ${ans}`, acceptedAnswers: getDivisionAcceptedAnswers(valA, multiplier, ans) },
          { label: `Number of ${theme.unit} ${extEntity} ${theme.verb}:`, expectedAnswer: String(ans), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(ans);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${catA.category} ${theme.verb} ${multiplierWord} ${theme.unit} as ${extEntity}. Based on the bar graph, how many ${theme.unit} did ${extEntity} ${baseVerb}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(ans);
        const opts = getFourOptions(finalAnswer, [String(valA), String(ans + scaleStep), String(ans - scaleStep > 0 ? ans - scaleStep : ans + 5), String(valA * multiplier)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${catA.category} ${theme.verb} ${multiplierWord} ${theme.unit} as ${extEntity}. Based on the bar graph, how many ${theme.unit} did ${extEntity} ${baseVerb}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(ans);
      }

    // ========================================================================
    // SUB-TYPE 4: Unknown with Multiplier and Additional / Fewer ("m times as many and k more/fewer")
    // ========================================================================
    } else if (subType === 4) {
      const valA = getRandomInt(2, 4) * scaleStep;
      const valB = getRandomInt(2, 5) * scaleStep;
      const valC = getRandomInt(2, 5) * scaleStep;
      data = [
        { category: theme.items[0], value: valA },
        { category: theme.items[1], value: valB },
        { category: theme.items[2], value: valC }
      ];
      const catA = data[0];
      const isMore = Math.random() < 0.6;
      const k = getRandomInt(1, 3) * scaleStep;
      const base = valA * multiplier;
      const ans = isMore ? base + k : base - k;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the number of ${theme.unit} ${theme.verb}. ${extEntity} ${theme.verb} ${multiplierWord} ${theme.unit} as ${catA.category} and ${k} ${isMore ? 'more' : 'fewer'} ${theme.unit}. Calculate ${multiplier} times the number of ${theme.unit} for ${catA.category}, then find the number of ${theme.unit} ${extEntity} ${theme.verb}."`;
        const stepsArr = [
          { label: `Write the working equation to find ${multiplier} times the number of ${theme.unit} for ${catA.category}:`, expectedAnswer: `${valA} x ${multiplier} = ${base}`, acceptedAnswers: getMultiplicationAcceptedAnswers(valA, multiplier, base) },
          { label: `Write the working equation to find the number of ${theme.unit} ${extEntity} ${theme.verb}:`, expectedAnswer: isMore ? `${base} + ${k} = ${ans}` : `${base} - ${k} = ${ans}`, acceptedAnswers: isMore ? getAdditionAcceptedAnswers(base, k, ans) : getSubtractionAcceptedAnswers(base, k, ans) },
          { label: `Number of ${theme.unit} ${extEntity} ${theme.verb}:`, expectedAnswer: String(ans), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(ans);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${extEntity} ${theme.verb} ${multiplierWord} ${theme.unit} as ${catA.category} and ${k} ${isMore ? 'more' : 'fewer'} ${theme.unit}. Based on the bar graph, how many ${theme.unit} did ${extEntity} ${baseVerb}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(ans);
        const opts = getFourOptions(finalAnswer, [String(base), String(isMore ? base - k : base + k), String(ans + scaleStep * 2), String(valA + k)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${extEntity} ${theme.verb} ${multiplierWord} ${theme.unit} as ${catA.category} and ${k} ${isMore ? 'more' : 'fewer'} ${theme.unit}. Based on the bar graph, how many ${theme.unit} did ${extEntity} ${baseVerb}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(ans);
      }

    // ========================================================================
    // SUB-TYPE 5: Combined Total of Known and Multiplier Unknown
    // ========================================================================
    } else if (subType === 5) {
      const valA = getRandomInt(2, 4) * scaleStep;
      const valB = getRandomInt(2, 5) * scaleStep;
      const valC = getRandomInt(2, 5) * scaleStep;
      data = [
        { category: theme.items[0], value: valA },
        { category: theme.items[1], value: valB },
        { category: theme.items[2], value: valC }
      ];
      const catA = data[0];
      const unknown = valA * multiplier;
      const total = valA + unknown;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the number of ${theme.unit} ${theme.verb}. ${extEntity} ${theme.verb} ${multiplierWord} ${theme.unit} as ${catA.category}. Calculate the number of ${theme.unit} ${extEntity} ${theme.verb}, then find the total number of ${theme.unit} for ${catA.category} and ${extEntity} combined."`;
        const stepsArr = [
          { label: `Write the working equation to find the number of ${theme.unit} ${extEntity} ${theme.verb}:`, expectedAnswer: `${valA} x ${multiplier} = ${unknown}`, acceptedAnswers: getMultiplicationAcceptedAnswers(valA, multiplier, unknown) },
          { label: `Write the working equation to find the total number of ${theme.unit} for ${catA.category} and ${extEntity} combined:`, expectedAnswer: `${valA} + ${unknown} = ${total}`, acceptedAnswers: getAdditionAcceptedAnswers(valA, unknown, total) },
          { label: `Total number of ${theme.unit} combined:`, expectedAnswer: String(total), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(total);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${extEntity} ${theme.verb} ${multiplierWord} ${theme.unit} as ${catA.category}. Based on the bar graph, how many ${theme.unit} did ${catA.category} and ${extEntity} ${baseVerb} altogether?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(total);
        const opts = getFourOptions(finalAnswer, [String(unknown), String(valA * (multiplier - 1)), String(total + scaleStep * 2), String(total - scaleStep * 2 > 0 ? total - scaleStep * 2 : total + 20)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${extEntity} ${theme.verb} ${multiplierWord} ${theme.unit} as ${catA.category}. Based on the bar graph, how many ${theme.unit} did ${catA.category} and ${extEntity} ${baseVerb} altogether?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(total);
      }

    // ========================================================================
    // SUB-TYPE 6: Difference Between Multiplier Unknown and Known
    // ========================================================================
    } else {
      const valA = getRandomInt(2, 4) * scaleStep;
      const valB = getRandomInt(2, 5) * scaleStep;
      const valC = getRandomInt(2, 5) * scaleStep;
      data = [
        { category: theme.items[0], value: valA },
        { category: theme.items[1], value: valB },
        { category: theme.items[2], value: valC }
      ];
      const catA = data[0];
      const unknown = valA * multiplier;
      const diff = unknown - valA;

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
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph shows the number of ${theme.unit} ${theme.verb}. ${extEntity} ${theme.verb} ${multiplierWord} ${theme.unit} as ${catA.category}. Calculate the number of ${theme.unit} ${extEntity} ${theme.verb}, then find how many more ${theme.unit} ${extEntity} ${theme.verb} than ${catA.category}."`;
        const stepsArr = [
          { label: `Write the working equation to find the number of ${theme.unit} ${extEntity} ${theme.verb}:`, expectedAnswer: `${valA} x ${multiplier} = ${unknown}`, acceptedAnswers: getMultiplicationAcceptedAnswers(valA, multiplier, unknown) },
          { label: `Write the working equation to find how many more ${theme.unit} ${extEntity} ${theme.verb} than ${catA.category}:`, expectedAnswer: `${unknown} - ${valA} = ${diff}`, acceptedAnswers: getSubtractionAcceptedAnswers(unknown, valA, diff) },
          { label: `Difference in ${theme.unit}:`, expectedAnswer: String(diff), acceptedAnswers: [] }
        ];
        inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
        finalAnswer = String(diff);
      } else if (isMCQ) {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${extEntity} ${theme.verb} ${multiplierWord} ${theme.unit} as ${catA.category}. Based on the bar graph, how many more ${theme.unit} did ${extEntity} ${baseVerb} than ${catA.category}?"`;
        inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
        finalAnswer = String(diff);
        const opts = getFourOptions(finalAnswer, [String(unknown), String(valA), String(diff + scaleStep * 2), String(diff - scaleStep > 0 ? diff - scaleStep : diff + 10)]);
        mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
      } else {
        askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"${extEntity} ${theme.verb} ${multiplierWord} ${theme.unit} as ${catA.category}. Based on the bar graph, how many more ${theme.unit} did ${extEntity} ${baseVerb} than ${catA.category}?"`;
        inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
        finalAnswer = String(diff);
      }
    }

  // --------------------------------------------------------------------------
  // Variant 13: Equalizing Quantities (The Transfer Problem)
  // --------------------------------------------------------------------------
  } else if (variant === 'advanced_equalizing_quantities') {
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
  } else if (variant === 'advanced_target_shortfall_analysis') {
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
  } else if (variant === 'advanced_repacking_grouping') {
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
  }

  const aiPrompt = `CRITICAL INSTRUCTIONS:
1. You MUST use the exact "questionText" provided below.
2. You MUST use the exact "finalAnswer" provided below.
3. Generate detailed, pedagogical "solutionSteps" explaining the reading of the bar graph and calculation.
${mcqOptionsPrompt}

${getFormatInstructions(visualEngineStr, inputRequirementStr, askText, finalAnswer)}`;

  return { aiPrompt };
};
