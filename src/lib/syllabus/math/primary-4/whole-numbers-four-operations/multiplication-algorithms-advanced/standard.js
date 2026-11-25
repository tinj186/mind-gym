import { getRandomNames, getPackingAndShoppingItems } from '@/lib/utils/variable-bank.js';
import {
  ALL_MODEL_OPTIONS,
  getRandomInt,
  makeSubEq,
  makeMulEq,
  buildFourUniqueOptions,
  buildPromptPayload
} from '../../whole-numbers-factors-and-multiples/common-factors/utils.js';

export const standardLogic = (
  activeVariant,
  difficulty,
  type,
  isMCQ,
  isShort,
  isStructure,
  zodType,
  zodDiff,
  level,
  topic,
  getFormatInstructions
) => {
  const variant = activeVariant === 'standard_default' ? 'standard_flawed_algorithm_diagnosis' : activeVariant;
  const names = getRandomNames(2);
  const items = getPackingAndShoppingItems(1);
  const item = items[0].item;

  let askText = '';
  let answer = '';
  let acceptedAnswers = [];
  let mcqData = null;
  let solutionSteps = '';
  let hint = '';
  let visualEngineObj = { componentToRender: 'NONE', componentData: { hideVisual: true } };
  let inputRequirementObj = null;

  if (variant === 'standard_flawed_algorithm_diagnosis') {
    const a = getRandomInt(123, 456);
    const bTens = getRandomInt(2, 5);
    const bOnes = getRandomInt(2, 9);
    const b = bTens * 10 + bOnes;
    const onesProd = a * bOnes;
    const wrongTensProd = a * bTens; // Forgot 0 placeholder!
    const correctTensProd = wrongTensProd * 10;
    const wrongSum = onesProd + wrongTensProd;
    const correctSum = onesProd + correctTensProd;
    const diff = correctSum - wrongSum;

    const askDiff = !isStructure && Math.random() > 0.55;
    answer = String(askDiff ? diff : correctSum);
    acceptedAnswers = askDiff
      ? [answer, diff.toLocaleString()]
      : [answer, correctSum.toLocaleString()];

    askText = askDiff
      ? `${names[0]} solved ${a} × ${b} as shown, forgetting the 0 placeholder in the tens partial product row. How much smaller is ${names[0]}'s wrong answer than the correct product?`
      : `${names[0]} solved ${a} × ${b} as shown, forgetting the 0 placeholder in the tens partial product row. What is the correct final product?`;

    visualEngineObj = {
      componentToRender: 'VERTICAL_ALGORITHM_GRID',
      componentData: {
        title: `Spot the Error: ${a} × ${b}`,
        multiplicand: a,
        multiplier: b,
        partialProducts: [String(onesProd), String(wrongTensProd)],
        finalProduct: String(wrongSum),
        errorRowIndex: 1
      }
    };

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: 'Write the working equation for the correct tens partial product:', expectedAnswer: `${a} * ${bTens * 10} = ${correctTensProd}`, acceptedAnswers: makeMulEq(a, bTens * 10, correctTensProd) },
          { label: 'Write the working equation to find the correct final product:', expectedAnswer: `${onesProd} + ${correctTensProd} = ${correctSum}`, acceptedAnswers: [`${onesProd} + ${correctTensProd} = ${correctSum}`, `${onesProd}+${correctTensProd}=${correctSum}`, `${correctTensProd} + ${onesProd} = ${correctSum}`, `${correctTensProd}+${onesProd}=${correctSum}`] }
        ]
      };
    } else if (isMCQ) {
      mcqData = askDiff
        ? buildFourUniqueOptions(answer, [
            { value: correctSum, defect: 'ANSWERED_CORRECT_PRODUCT_INSTEAD_OF_DIFF' },
            { value: wrongSum, defect: 'ANSWERED_WRONG_PRODUCT' },
            { value: correctTensProd - wrongTensProd - 10, defect: 'CARELESS_SUBTRACTION' }
          ])
        : buildFourUniqueOptions(answer, [
            { value: wrongSum, defect: 'REPEATED_ZERO_PLACEHOLDER_ERROR' },
            { value: correctTensProd, defect: 'FORGOT_ONES_PARTIAL_PRODUCT' },
            { value: correctSum + 100, defect: 'CARRY_OVER_ERROR' }
          ]);
    }
    solutionSteps = `Step 1: The second row multiplied ${a} by ${bTens} instead of ${bTens * 10}. Correct tens partial product = ${a} * ${bTens * 10} = ${correctTensProd}.\\nStep 2: Correct product = ${onesProd} + ${correctTensProd} = ${correctSum}.${askDiff ? `\\nStep 3: Difference = ${correctSum} - ${wrongSum} = ${diff}.` : ''}`;
    hint = `Look at the highlighted row: multiplying by the tens digit (${bTens}) means multiplying by ${bTens * 10}, so it needs a 0 in the ones place!`;

  } else if (variant === 'standard_missing_digit_cryptarithm') {
    // Choose multiplier in [3, 4, 6, 7, 8, 9] (avoid 5/0 for uniqueness; when multiplier is odd/coprime to 10 or even, hundreds digit is uniquely determined by prod / mult)
    const mult = [3, 4, 6, 7, 8, 9][getRandomInt(0, 5)];
    const th = getRandomInt(2, 7);
    const h = getRandomInt(2, 8);
    const t = getRandomInt(2, 8);
    const o = getRandomInt(2, 8);
    const multiplicand = th * 1000 + h * 100 + t * 10 + o;
    const prod = multiplicand * mult;
    const tensOnes = t * 10 + o;
    const tensOnesProd = tensOnes * mult;
    const carryToHundreds = Math.floor(tensOnesProd / 100);
    const maskedMultiplicand = `${th}?${t}${o}`;

    answer = String(h);
    acceptedAnswers = [answer];
    askText = `In the vertical multiplication ${maskedMultiplicand} × ${mult} = ${prod.toLocaleString()}, what is the missing hundreds digit '?'?`;

    visualEngineObj = {
      componentToRender: 'VERTICAL_ALGORITHM_GRID',
      componentData: {
        title: 'Missing Digit Cryptarithm',
        multiplicand: maskedMultiplicand,
        multiplier: mult,
        partialProducts: [],
        finalProduct: String(prod)
      }
    };

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: `Write the working equation to find the product of the tens and ones (${tensOnes} × ${mult}):`, expectedAnswer: `${tensOnes} * ${mult} = ${tensOnesProd}`, acceptedAnswers: makeMulEq(tensOnes, mult, tensOnesProd) },
          { label: `Deduce the missing hundreds digit (include the carry-over of ${carryToHundreds}):`, expectedAnswer: answer, acceptedAnswers }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: (h + 1) % 10, defect: 'FORGOT_CARRY_OVER' },
        { value: h > 1 ? h - 1 : h + 2, defect: 'CARRY_OVER_MISCALCULATION' },
        { value: (h + 2) % 10, defect: 'CARELESS_CALCULATION' }
      ]);
    }
    solutionSteps = `Step 1: Multiply the tens and ones: ${tensOnes} * ${mult} = ${tensOnesProd} (carry ${carryToHundreds} to the hundreds place).\\nStep 2: Test which digit '?' gives ${Math.floor((prod % 1000) / 100)} in the hundreds place (and matches ${prod}): ${h} * ${mult} + ${carryToHundreds} = ${h * mult + carryToHundreds}. So ? = ${h}.`;
    hint = `Multiply ${tensOnes} by ${mult} first to find the carry-over into the hundreds place!`;

  } else if (variant === 'standard_two_rate_combined_totals_diff') {
    const rateA = getRandomInt(125, 345);
    const packsA = getRandomInt(12, 28);
    const totalA = rateA * packsA;

    const rateB = getRandomInt(1120, 2450);
    const packsB = getRandomInt(3, 8);
    const totalB = rateB * packsB;

    const askSum = Math.random() > 0.5;
    const ansNum = askSum ? totalA + totalB : Math.abs(totalA - totalB);
    const largerName = totalA >= totalB ? names[0] : names[1];
    const smallerName = totalA >= totalB ? names[1] : names[0];

    answer = String(ansNum);
    acceptedAnswers = [answer, ansNum.toLocaleString(), `${answer} ${item}`];
    askText = askSum
      ? `STORY: ${names[0]} has ${packsA} boxes of ${rateA} ${item}. ${names[1]} has ${packsB} crates of ${rateB} ${item}.\n\nCRITICAL INSTRUCTION: Ask how many ${item} they have altogether.`
      : `STORY: ${names[0]} has ${packsA} boxes of ${rateA} ${item}. ${names[1]} has ${packsB} crates of ${rateB} ${item}.\n\nCRITICAL INSTRUCTION: Ask how many more ${item} ${largerName} has than ${smallerName}.`;

    if (isStructure) {
      const largerVal = Math.max(totalA, totalB);
      const smallerVal = Math.min(totalA, totalB);
      const steps = [
        { label: `Write the working equation to find ${names[0]}'s total:`, expectedAnswer: `${rateA} * ${packsA} = ${totalA}`, acceptedAnswers: makeMulEq(rateA, packsA, totalA) },
        { label: `Write the working equation to find ${names[1]}'s total:`, expectedAnswer: `${rateB} * ${packsB} = ${totalB}`, acceptedAnswers: makeMulEq(rateB, packsB, totalB) },
        askSum
          ? { label: 'Write the working equation to find the combined total:', expectedAnswer: `${totalA} + ${totalB} = ${ansNum}`, acceptedAnswers: [`${totalA} + ${totalB} = ${ansNum}`, `${totalA}+${totalB}=${ansNum}`, `${totalB} + ${totalA} = ${ansNum}`, `${totalB}+${totalA}=${ansNum}`] }
          : { label: 'Write the working equation to find the difference:', expectedAnswer: `${largerVal} - ${smallerVal} = ${ansNum}`, acceptedAnswers: makeSubEq(largerVal, smallerVal, ansNum) }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: askSum ? 'COMPARISON_COMBINED_TOTAL' : 'COMPARISON_DIFFERENCE',
          correctModelType: 'COMPARISON',
          modelOptions: ALL_MODEL_OPTIONS,
          hasCombinedTotal: askSum,
          entities: [
            { id: 'A', name: names[0], value: '?', displayValue: '?', relation: 'BASE' },
            { id: 'B', name: names[1], value: '?', displayValue: '?', relativeTo: names[0], relation: totalB >= totalA ? 'MORE' : 'FEWER' }
          ],
          target: { type: askSum ? 'TOTAL' : 'DIFFERENCE', label: askSum ? 'Combined Total' : 'Difference' },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: askSum ? Math.abs(totalA - totalB) : totalA + totalB, defect: 'CONFUSED_SUM_AND_DIFFERENCE' },
        { value: totalA, defect: 'ANSWERED_ONLY_ENTITY_A' },
        { value: totalB, defect: 'ANSWERED_ONLY_ENTITY_B' }
      ]);
    }
    solutionSteps = `Step 1: ${names[0]}'s total = ${rateA} * ${packsA} = ${totalA}.\\nStep 2: ${names[1]}'s total = ${rateB} * ${packsB} = ${totalB}.\\nStep 3: ${askSum ? `Combined total = ${totalA} + ${totalB} = ${ansNum}.` : `Difference = ${Math.max(totalA, totalB)} - ${Math.min(totalA, totalB)} = ${ansNum}.`}`;
    hint = `Calculate ${names[0]}'s total and ${names[1]}'s total separately first, then ${askSum ? 'add them' : 'subtract the smaller from the larger'}!`;

  } else if (variant === 'standard_multiplicative_comparison_offset') {
    const valA = getRandomInt(1120, 2450);
    const mult = getRandomInt(3, 8);
    const multVal = valA * mult;
    const offset = getRandomInt(220, 650);
    const isMinus = Math.random() > 0.5;
    const valB = isMinus ? multVal - offset : multVal + offset;
    const combined = valA + valB;
    const askCombined = isStructure || Math.random() > 0.5;

    answer = String(askCombined ? combined : valB);
    acceptedAnswers = [answer, (askCombined ? combined : valB).toLocaleString(), `${answer} ${item}`];
    askText = `STORY: ${names[0]} has ${valA} ${item}. ${names[1]} has ${offset} ${isMinus ? 'fewer' : 'more'} ${item} than ${mult} times as many ${item} as ${names[0]}.\n\nCRITICAL INSTRUCTION: Ask ${askCombined ? `how many ${item} they have altogether` : `how many ${item} ${names[1]} has`}.`;

    if (isStructure) {
      const steps = [
        { label: `Write the working equation to find ${mult} times of ${names[0]}:`, expectedAnswer: `${valA} * ${mult} = ${multVal}`, acceptedAnswers: makeMulEq(valA, mult, multVal) },
        {
          label: `Write the working equation to find ${names[1]}'s exact amount:`,
          expectedAnswer: isMinus ? `${multVal} - ${offset} = ${valB}` : `${multVal} + ${offset} = ${valB}`,
          acceptedAnswers: isMinus
            ? makeSubEq(multVal, offset, valB)
            : [`${multVal} + ${offset} = ${valB}`, `${multVal}+${offset}=${valB}`, `${offset} + ${multVal} = ${valB}`, `${offset}+${multVal}=${valB}`]
        },
        { label: 'Write the working equation to find their combined total:', expectedAnswer: `${valA} + ${valB} = ${combined}`, acceptedAnswers: [`${valA} + ${valB} = ${combined}`, `${valA}+${valB}=${combined}`, `${valB} + ${valA} = ${combined}`, `${valB}+${valA}=${combined}`] }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'COMPARISON_MULTIPLICATIVE_OFFSET',
          correctModelType: 'COMPARISON',
          modelOptions: ALL_MODEL_OPTIONS,
          hasCombinedTotal: true,
          entities: [
            { id: 'A', name: names[0], value: valA, displayValue: valA.toLocaleString(), relation: 'BASE' },
            { id: 'B', name: names[1], value: '?', displayValue: '?', relativeTo: names[0], relation: 'MULTIPLE', multiplier: mult }
          ],
          target: { type: 'TOTAL', label: 'Combined Total' },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: askCombined ? valB : combined, defect: 'WRONG_TARGET_ENTITY' },
        { value: isMinus ? multVal + offset : multVal - offset, defect: 'WRONG_OFFSET_SIGN' },
        { value: multVal, defect: 'IGNORED_OFFSET' }
      ]);
    }
    solutionSteps = `Step 1: ${mult} times ${names[0]} = ${valA} * ${mult} = ${multVal}.\\nStep 2: ${names[1]} = ${multVal} ${isMinus ? '-' : '+'} ${offset} = ${valB}.\\n${askCombined ? `Step 3: Combined total = ${valA} + ${valB} = ${combined}.` : ''}`;
    hint = `First multiply ${valA} by ${mult}, then ${isMinus ? 'subtract' : 'add'} ${offset} to find ${names[1]}'s amount!`;

  } else {
    // standard_estimation_vs_exact_product
    const roundTo100 = Math.random() > 0.4;
    const a = getRandomInt(132, 688);
    const b = getRandomInt(23, 68);
    const estA = roundTo100 ? Math.round(a / 100) * 100 : Math.round(a / 10) * 10;
    const estB = Math.round(b / 10) * 10;
    const estProd = estA * estB;
    const exactProd = a * b;
    const diff = Math.abs(estProd - exactProd);

    answer = String(diff);
    acceptedAnswers = [answer, diff.toLocaleString()];
    const roundDesc = roundTo100
      ? `rounding ${a} to the nearest hundred and ${b} to the nearest ten`
      : `rounding both ${a} and ${b} to the nearest ten`;
    askText = `Estimate the product of ${a} × ${b} by ${roundDesc}. Then find the exact product. What is the difference between the estimated product and the exact product?`;

    if (isStructure) {
      const larger = Math.max(estProd, exactProd);
      const smaller = Math.min(estProd, exactProd);
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: 'Write the working equation for the estimated product:', expectedAnswer: `${estA} * ${estB} = ${estProd}`, acceptedAnswers: makeMulEq(estA, estB, estProd) },
          { label: 'Write the working equation for the exact product:', expectedAnswer: `${a} * ${b} = ${exactProd}`, acceptedAnswers: makeMulEq(a, b, exactProd) },
          { label: 'Write the working equation to find the difference between the estimate and exact product:', expectedAnswer: `${larger} - ${smaller} = ${diff}`, acceptedAnswers: makeSubEq(larger, smaller, diff) }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: estProd, defect: 'ANSWERED_ESTIMATE_ONLY' },
        { value: exactProd, defect: 'ANSWERED_EXACT_ONLY' },
        { value: diff + 100, defect: 'CARELESS_SUBTRACTION' }
      ]);
    }
    solutionSteps = `Step 1: Estimated product = ${estA} * ${estB} = ${estProd}.\\nStep 2: Exact product = ${a} * ${b} = ${exactProd}.\\nStep 3: Difference = ${Math.max(estProd, exactProd)} - ${Math.min(estProd, exactProd)} = ${diff}.`;
    hint = `Round ${a} and ${b} first to get the estimate, then multiply ${a} × ${b} exactly and subtract!`;
  }

  return buildPromptPayload({
    difficulty,
    isMCQ,
    isShort,
    isStructure,
    getFormatInstructions,
    askText,
    answer,
    acceptedAnswers,
    mcqData,
    solutionSteps,
    hint,
    visualEngineObj,
    inputRequirementObj,
    variantKey: variant
  });
};
