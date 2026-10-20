import {
  getRandomBarGraphTheme,
  getRandomNames,
  getRandomPaletteColors,
  getRandomFinancialTheme,
  getRandomEqualizingTheme,
  getRandomTargetShortfallTheme,
  getSingularUnit
} from '../../../../../../utils/variable-bank.js';

import {
  getRandomInt,
  getFourOptions,
  getMultiplicationAcceptedAnswers,
  getDivisionAcceptedAnswers,
  getAdditionAcceptedAnswers,
  getSubtractionAcceptedAnswers,
  getThreeTermAdditionAcceptedAnswers,
  getThreeAdditionAcceptedAnswers,
  getDifferenceAcceptedAnswers,
  getSumAcceptedAnswers,
  getThreeTermSumAcceptedAnswers,
  getCombinedAddSubAcceptedAnswers,
  getSubSubAcceptedAnswers,
  getTwoPairsDiffAcceptedAnswers,
  getFourTermAdditionAcceptedAnswers,
  getTwoPairSumAcceptedAnswers
} from '../helpers.js';

export function generateAdvancedBlankAxisFinancialApplication({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

    const finTheme = getRandomFinancialTheme(4);
    const orientation = Math.random() > 0.5 ? 'vertical' : 'horizontal';
    const verb = finTheme.verb || 'sold';
    const singularUnit = getSingularUnit(finTheme.unit);

    // 3 or 4 bars
    const barCount = Math.random() > 0.5 ? 4 : 3;
    let blocksPool = barCount === 4
      ? [getRandomInt(2, 4), getRandomInt(5, 7), getRandomInt(3, 5), getRandomInt(4, 6)]
      : [getRandomInt(2, 4), getRandomInt(5, 7), getRandomInt(3, 5)];

    // Ensure variety in heights so differences and sums are distinct
    if (blocksPool[0] === blocksPool[1]) blocksPool[1] += 2;
    if (blocksPool[1] === blocksPool[2]) blocksPool[2] += 1;
    if (barCount === 4 && blocksPool[2] === blocksPool[3]) blocksPool[3] += 1;

    const totalBlocks = blocksPool.reduce((acc, b) => acc + b, 0);
    const scaleOptions = [10, 20, 25, 30, 40, 50];
    const scaleStep = scaleOptions[getRandomInt(0, scaleOptions.length - 1)];
    const grandTotal = totalBlocks * scaleStep;

    const colors = getRandomPaletteColors(barCount);
    const data = blocksPool.map((b, i) => ({
      category: finTheme.items[i],
      value: b * scaleStep,
      color: colors[i]
    }));

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_GRAPH",
      componentData: {
        title: finTheme.title,
        xAxisLabel: finTheme.xAxisLabel,
        yAxisLabel: finTheme.yAxisLabel,
        data,
        scaleStep,
        orientation,
        showGridLines: true,
        showScaleNumbers: false
      }
    });

    // 1. Initial Information (Clue)
    // - grand_total: Grand total across all categories
    // - single_bar: Value of 1 specific bar
    // - sum_bars: Sum of 2 bars
    // - diff_bars: Difference between 2 bars
    const clueTypes = ['grand_total', 'single_bar', 'sum_bars', 'diff_bars'];
    const clueType = clueTypes[getRandomInt(0, clueTypes.length - 1)];

    let clueSentence = '';
    let clueStep1Label = '';
    let clueStep1Expected = '';
    let clueStep1Accepted = [];
    let clueStep2Expected = '';
    let clueStep2Accepted = [];

    // Indices for clue if needed
    let clueSingleIdx = -1;
    let cluePair = [];

    if (clueType === 'grand_total') {
      clueSentence = `The grand total of all ${finTheme.unit} ${verb} across all categories is exactly ${grandTotal} ${finTheme.unit}.`;
      clueStep1Label = `Total number of grid blocks across all ${barCount} categories:`;
      clueStep1Expected = String(totalBlocks);
      clueStep1Accepted = [String(totalBlocks)];
      clueStep2Expected = `${grandTotal} / ${totalBlocks} = ${scaleStep}`;
      clueStep2Accepted = getDivisionAcceptedAnswers(grandTotal, totalBlocks, scaleStep);

    } else if (clueType === 'single_bar') {
      clueSingleIdx = getRandomInt(0, barCount - 1);
      const catClue = finTheme.items[clueSingleIdx];
      const bClue = blocksPool[clueSingleIdx];
      const clueVal = bClue * scaleStep;
      clueSentence = `There were exactly ${clueVal} ${finTheme.unit} ${verb} for ${catClue}.`;
      clueStep1Label = `Number of grid blocks for ${catClue}:`;
      clueStep1Expected = String(bClue);
      clueStep1Accepted = [String(bClue)];
      clueStep2Expected = `${clueVal} / ${bClue} = ${scaleStep}`;
      clueStep2Accepted = getDivisionAcceptedAnswers(clueVal, bClue, scaleStep);

    } else if (clueType === 'sum_bars') {
      const idx1 = 0;
      const idx2 = 1;
      cluePair = [idx1, idx2];
      const cat1 = finTheme.items[idx1];
      const cat2 = finTheme.items[idx2];
      const bSum = blocksPool[idx1] + blocksPool[idx2];
      const clueVal = bSum * scaleStep;
      clueSentence = `A total of ${clueVal} ${finTheme.unit} were ${verb} for ${cat1} and ${cat2} combined.`;
      clueStep1Label = `Total number of grid blocks for ${cat1} and ${cat2} combined:`;
      clueStep1Expected = String(bSum);
      clueStep1Accepted = [String(bSum)];
      clueStep2Expected = `${clueVal} / ${bSum} = ${scaleStep}`;
      clueStep2Accepted = getDivisionAcceptedAnswers(clueVal, bSum, scaleStep);

    } else { // diff_bars
      // Find two bars where bA > bB
      let diffPairs = [];
      for (let i = 0; i < barCount; i++) {
        for (let j = 0; j < barCount; j++) {
          if (blocksPool[i] > blocksPool[j]) diffPairs.push([i, j]);
        }
      }
      const [idxA, idxB] = diffPairs[getRandomInt(0, diffPairs.length - 1)] || [1, 0];
      cluePair = [idxA, idxB];
      const catA = finTheme.items[idxA];
      const catB = finTheme.items[idxB];
      const bDiff = blocksPool[idxA] - blocksPool[idxB];
      const clueVal = bDiff * scaleStep;
      clueSentence = `There were ${clueVal} more ${finTheme.unit} ${verb} for ${catA} than ${catB}.`;
      clueStep1Label = `Difference in grid blocks between ${catA} and ${catB}:`;
      clueStep1Expected = String(bDiff);
      clueStep1Accepted = [String(bDiff)];
      clueStep2Expected = `${clueVal} / ${bDiff} = ${scaleStep}`;
      clueStep2Accepted = getDivisionAcceptedAnswers(clueVal, bDiff, scaleStep);
    }

    // 2. Workout Target
    // - single_bar: Money collected from 1 category
    // - grand_total: Money collected from all categories (at uniform price)
    // - sum_bars: Money collected from 2 categories combined
    // - diff_bars: Difference in money collected between 2 categories
    let possibleTargets = ['single_bar', 'sum_bars', 'diff_bars'];
    if (clueType !== 'grand_total') {
      possibleTargets.push('grand_total');
    }
    const targetType = possibleTargets[getRandomInt(0, possibleTargets.length - 1)];

    let targetSentence = '';
    let targetStep3Label = '';
    let targetStep3Expected = '';
    let targetStep3Accepted = [];
    let targetStep4Label = '';
    let targetStep4Expected = '';
    let targetStep4Accepted = [];
    let totalCost = 0;
    let candidateDistractors = [];

    const priceVerb = verb === 'rented out' ? 'rented out' : 'sold';

    if (targetType === 'single_bar') {
      // Pick a target index (different from clue if clue was single_bar)
      let tIdx = getRandomInt(0, barCount - 1);
      if (clueType === 'single_bar' && tIdx === clueSingleIdx) {
        tIdx = (clueSingleIdx + 1) % barCount;
      }
      const catTarget = finTheme.items[tIdx];
      const bTarget = blocksPool[tIdx];
      const qty = bTarget * scaleStep;
      const price = finTheme.prices[tIdx] || getRandomInt(2, 5);
      totalCost = qty * price;

      targetSentence = `If each ${singularUnit} of ${catTarget} is ${priceVerb} for $${price}, find the total money collected from ${catTarget}.`;
      targetStep3Label = `Write the working equation to find the exact number of ${catTarget} ${verb}:`;
      targetStep3Expected = `${bTarget} x ${scaleStep} = ${qty}`;
      targetStep3Accepted = getMultiplicationAcceptedAnswers(bTarget, scaleStep, qty);

      targetStep4Label = `Write the working equation to find the total money collected from ${catTarget}:`;
      targetStep4Expected = `${qty} x ${price} = ${totalCost}`;
      targetStep4Accepted = getMultiplicationAcceptedAnswers(qty, price, totalCost);

      candidateDistractors = [
        `$${qty}`,
        `$${totalBlocks * price}`,
        `$${totalCost + scaleStep * price}`,
        `$${Math.max(1, totalCost - scaleStep * price)}`
      ];

    } else if (targetType === 'grand_total') {
      const price = finTheme.prices[0] || getRandomInt(2, 5);
      const totalQty = grandTotal;
      totalCost = totalQty * price;

      targetSentence = `If every ${singularUnit} across all categories is ${priceVerb} for $${price}, find the total money collected from all ${finTheme.unit} ${verb}.`;
      targetStep3Label = `Write the working equation to find the total number of ${finTheme.unit} ${verb} across all categories:`;
      targetStep3Expected = `${totalBlocks} x ${scaleStep} = ${totalQty}`;
      targetStep3Accepted = getMultiplicationAcceptedAnswers(totalBlocks, scaleStep, totalQty);

      targetStep4Label = `Write the working equation to find the total money collected across all categories:`;
      targetStep4Expected = `${totalQty} x ${price} = ${totalCost}`;
      targetStep4Accepted = getMultiplicationAcceptedAnswers(totalQty, price, totalCost);

      candidateDistractors = [
        `$${totalQty}`,
        `$${totalCost + scaleStep * price}`,
        `$${Math.max(1, totalCost - scaleStep * price)}`,
        `$${totalBlocks * scaleStep}`
      ];

    } else if (targetType === 'sum_bars') {
      let sumPairs = [];
      for (let i = 0; i < barCount; i++) {
        for (let j = i + 1; j < barCount; j++) {
          if (!(cluePair.length === 2 && ((cluePair[0] === i && cluePair[1] === j) || (cluePair[0] === j && cluePair[1] === i)))) {
            sumPairs.push([i, j]);
          }
        }
      }
      if (sumPairs.length === 0) sumPairs = [[0, barCount - 1]];
      const [tIdx1, tIdx2] = sumPairs[getRandomInt(0, sumPairs.length - 1)];

      const cat1 = finTheme.items[tIdx1];
      const cat2 = finTheme.items[tIdx2];
      const bSum = blocksPool[tIdx1] + blocksPool[tIdx2];
      const qtySum = bSum * scaleStep;
      const price = finTheme.prices[tIdx1] || getRandomInt(2, 5);
      totalCost = qtySum * price;

      targetSentence = `If each ${singularUnit} of ${cat1} and ${cat2} is ${priceVerb} for $${price}, find the total money collected from these two categories combined.`;
      targetStep3Label = `Write the working equation to find the total number of ${finTheme.unit} ${verb} for ${cat1} and ${cat2} combined:`;
      targetStep3Expected = `${bSum} x ${scaleStep} = ${qtySum}`;
      targetStep3Accepted = [
        ...getMultiplicationAcceptedAnswers(bSum, scaleStep, qtySum),
        ...getAdditionAcceptedAnswers(blocksPool[tIdx1] * scaleStep, blocksPool[tIdx2] * scaleStep, qtySum)
      ];

      targetStep4Label = `Write the working equation to find the total money collected from ${cat1} and ${cat2} combined:`;
      targetStep4Expected = `${qtySum} x ${price} = ${totalCost}`;
      targetStep4Accepted = [
        ...getMultiplicationAcceptedAnswers(qtySum, price, totalCost),
        ...getAdditionAcceptedAnswers(blocksPool[tIdx1] * scaleStep * price, blocksPool[tIdx2] * scaleStep * price, totalCost)
      ];

      candidateDistractors = [
        `$${qtySum}`,
        `$${totalCost + scaleStep * price}`,
        `$${Math.max(1, totalCost - scaleStep * price)}`,
        `$${blocksPool[tIdx1] * scaleStep * price}`
      ];

    } else { // diff_bars
      let diffPairs = [];
      for (let i = 0; i < barCount; i++) {
        for (let j = 0; j < barCount; j++) {
          if (blocksPool[i] > blocksPool[j]) {
            if (!(cluePair.length === 2 && cluePair[0] === i && cluePair[1] === j)) {
              diffPairs.push([i, j]);
            }
          }
        }
      }
      if (diffPairs.length === 0) {
        for (let i = 0; i < barCount; i++) {
          for (let j = 0; j < barCount; j++) {
            if (blocksPool[i] > blocksPool[j]) diffPairs.push([i, j]);
          }
        }
      }
      const [tIdxA, tIdxB] = diffPairs[getRandomInt(0, diffPairs.length - 1)] || [1, 0];
      const catA = finTheme.items[tIdxA];
      const catB = finTheme.items[tIdxB];
      const bDiff = blocksPool[tIdxA] - blocksPool[tIdxB];
      const qtyDiff = bDiff * scaleStep;
      const price = finTheme.prices[tIdxA] || getRandomInt(2, 5);
      totalCost = qtyDiff * price;

      targetSentence = `If each ${singularUnit} is ${priceVerb} for $${price}, how much more money was collected from ${catA} than ${catB}?`;
      targetStep3Label = `Write the working equation to find how many more ${finTheme.unit} were ${verb} for ${catA} than ${catB}:`;
      targetStep3Expected = `${bDiff} x ${scaleStep} = ${qtyDiff}`;
      targetStep3Accepted = [
        ...getMultiplicationAcceptedAnswers(bDiff, scaleStep, qtyDiff),
        ...getSubtractionAcceptedAnswers(blocksPool[tIdxA] * scaleStep, blocksPool[tIdxB] * scaleStep, qtyDiff)
      ];

      targetStep4Label = `Write the working equation to find how much more money was collected from ${catA} than ${catB}:`;
      targetStep4Expected = `${qtyDiff} x ${price} = ${totalCost}`;
      targetStep4Accepted = [
        ...getMultiplicationAcceptedAnswers(qtyDiff, price, totalCost),
        ...getSubtractionAcceptedAnswers(blocksPool[tIdxA] * scaleStep * price, blocksPool[tIdxB] * scaleStep * price, totalCost)
      ];

      candidateDistractors = [
        `$${qtyDiff}`,
        `$${totalCost + scaleStep * price}`,
        `$${Math.max(1, totalCost - scaleStep * price)}`,
        `$${blocksPool[tIdxA] * scaleStep * price}`
      ];
    }

    if (isStructure) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph tracks the number of ${finTheme.unit} ${verb}, but the axis numbers on the graph are missing. ${clueSentence} ${targetSentence} Show your working and the final answer."`;
      const stepsArr = [
        {
          label: clueStep1Label,
          expectedAnswer: clueStep1Expected,
          acceptedAnswers: clueStep1Accepted
        },
        {
          label: `Write the working equation to find the value of 1 grid block:`,
          expectedAnswer: clueStep2Expected,
          acceptedAnswers: clueStep2Accepted
        },
        {
          label: targetStep3Label,
          expectedAnswer: targetStep3Expected,
          acceptedAnswers: targetStep3Accepted
        },
        {
          label: targetStep4Label,
          expectedAnswer: targetStep4Expected,
          acceptedAnswers: targetStep4Accepted
        }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
      finalAnswer = String(totalCost);
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph tracks the number of ${finTheme.unit} ${verb}, but the axis numbers on the graph are missing. ${clueSentence} ${targetSentence}"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
      finalAnswer = `$${totalCost}`;
      const opts = getFourOptions(finalAnswer, candidateDistractors);
      mcqOptionsPrompt = `Generate EXACTLY 4 options in "content.options":\n- "${opts[0]}"\n- "${opts[1]}"\n- "${opts[2]}"\n- "${opts[3]}"\nCRITICAL: The options array MUST contain exactly these 4 options. One option MUST match finalAnswer ("${finalAnswer}") exactly.`;
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"The bar graph tracks the number of ${finTheme.unit} ${verb}, but the axis numbers on the graph are missing. ${clueSentence} ${targetSentence}"`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
      finalAnswer = String(totalCost);
    }

  // --------------------------------------------------------------------------
  // Variant 14: Equalizing Transfer & Multiple Transfer (Grid Block Shift)
  // --------------------------------------------------------------------------

  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
