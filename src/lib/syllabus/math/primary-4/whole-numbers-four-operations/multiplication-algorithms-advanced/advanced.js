import { getRandomNames, getPackingAndShoppingItems } from '@/lib/utils/variable-bank.js';
import {
  ALL_MODEL_OPTIONS,
  getRandomInt,
  makeDivEq,
  makeSubEq,
  makeMulEq,
  buildFourUniqueOptions,
  buildPromptPayload
} from '../../whole-numbers-factors-and-multiples/common-factors/utils.js';

export const advancedLogic = (
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
  const variant = activeVariant === 'advanced_default' ? 'advanced_reverse_3by2_deduction' : activeVariant;
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

  if (variant === 'advanced_reverse_3by2_deduction') {
    const a = getRandomInt(125, 485);
    const bTens = getRandomInt(2, 7);
    const bOnes = getRandomInt(2, 9);
    const onesProd = a * bOnes;
    const tensProd = a * (bTens * 10);
    const finalProd = onesProd + tensProd;

    const askTensDigit = !isStructure && Math.random() > 0.5;
    answer = String(askTensDigit ? bTens : finalProd);
    acceptedAnswers = askTensDigit ? [answer] : [answer, finalProd.toLocaleString()];

    askText = askTensDigit
      ? `In the vertical multiplication ${a} × ?${bOnes}, the tens partial product row is ${tensProd.toLocaleString()}. What is the missing tens digit '?' of the multiplier?`
      : `In the vertical multiplication ${a} × ?${bOnes}, the tens partial product row is ${tensProd.toLocaleString()}. Deduce the missing tens digit and find the final product.`;

    visualEngineObj = {
      componentToRender: 'VERTICAL_ALGORITHM_GRID',
      componentData: {
        title: 'Reverse Partial Product Deduction',
        multiplicand: a,
        multiplier: `?${bOnes}`,
        partialProducts: [String(onesProd), String(tensProd)],
        finalProduct: '?'
      }
    };

    if (isStructure) {
      const eqDiv = makeDivEq(tensProd, a);
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          {
            label: `Write the working equation to find the tens value of the multiplier (using ${tensProd} and ${a}):`,
            expectedAnswer: eqDiv.expected,
            acceptedAnswers: [...eqDiv.accepted, `${tensProd} / ${a} = ${bTens * 10}`]
          },
          {
            label: `Write the working equation for the ones partial product (${a} × ${bOnes}):`,
            expectedAnswer: `${a} * ${bOnes} = ${onesProd}`,
            acceptedAnswers: makeMulEq(a, bOnes, onesProd)
          },
          {
            label: 'Write the working equation to find the final product:',
            expectedAnswer: `${onesProd} + ${tensProd} = ${finalProd}`,
            acceptedAnswers: [`${onesProd} + ${tensProd} = ${finalProd}`, `${onesProd}+${tensProd}=${finalProd}`, `${tensProd} + ${onesProd} = ${finalProd}`, `${tensProd}+${onesProd}=${finalProd}`]
          }
        ]
      };
    } else if (isMCQ) {
      mcqData = askTensDigit
        ? buildFourUniqueOptions(answer, [
            { value: bTens * 10, defect: 'GAVE_VALUE_INSTEAD_OF_DIGIT' },
            { value: bTens + 1, defect: 'CARELESS_DIVISION' },
            { value: bTens > 1 ? bTens - 1 : bTens + 2, defect: 'CARELESS_DIVISION' }
          ])
        : buildFourUniqueOptions(answer, [
            { value: onesProd + tensProd / 10, defect: 'ZERO_PLACEHOLDER_ERROR' },
            { value: finalProd + a * 10, defect: 'WRONG_TENS_DIGIT' },
            { value: finalProd - a * 10, defect: 'WRONG_TENS_DIGIT' }
          ]);
    }
    solutionSteps = `Step 1: Divide the tens partial product by ${a}: ${tensProd} / ${a} = ${bTens * 10}, so the missing tens digit is ${bTens}.\\nStep 2: Ones partial product = ${a} * ${bOnes} = ${onesProd}.\\nStep 3: Final product = ${onesProd} + ${tensProd} = ${finalProd}.`;
    hint = `Use the tens partial product (${tensProd}) and divide by ${a} to find the tens part of the multiplier!`;

  } else if (variant === 'advanced_digit_card_product_optimization') {
    const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5).slice(0, 5);
    const askGreatest = Math.random() > 0.4;
    const sorted = [...digits].sort((a, b) => (askGreatest ? b - a : a - b));

    // Brute-force all (3-digit, 2-digit) partitions of the 5 cards for exact optimal pair
    let bestProd = askGreatest ? -1 : Infinity;
    let bestA = 0;
    let bestB = 0;
    const permute = (arr, used, curr) => {
      if (curr.length === 5) {
        const numA = curr[0] * 100 + curr[1] * 10 + curr[2];
        const numB = curr[3] * 10 + curr[4];
        const p = numA * numB;
        if ((askGreatest && p > bestProd) || (!askGreatest && p < bestProd)) {
          bestProd = p;
          bestA = numA;
          bestB = numB;
        }
        return;
      }
      for (let i = 0; i < 5; i++) {
        if (used[i]) continue;
        used[i] = true;
        curr.push(arr[i]);
        permute(arr, used, curr);
        curr.pop();
        used[i] = false;
      }
    };
    permute(sorted, Array(5).fill(false), []);

    const goalWord = askGreatest ? 'greatest' : 'smallest';
    answer = String(bestProd);
    acceptedAnswers = [answer, bestProd.toLocaleString()];
    askText = `Using all 5 digit cards (${digits.join(', ')}), arrange them to form a 3-digit number and a 2-digit number that give the ${goalWord} possible product. What is that ${goalWord} product?`;

    visualEngineObj = {
      componentToRender: 'MULTI_COMPONENT',
      componentData: {
        components: [
          {
            componentToRender: 'DIGIT_CARD_SORTER',
            componentData: { digits, condition: `${goalWord} 3-digit × 2-digit product` }
          },
          {
            componentToRender: 'VERTICAL_ALGORITHM_GRID',
            componentData: { title: `${goalWord.toUpperCase()} Product`, multiplicand: '???', multiplier: '??', partialProducts: [], finalProduct: '?' }
          }
        ]
      }
    };

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          {
            label: `Write the 3-digit and 2-digit numbers that form the ${goalWord} product:`,
            expectedAnswer: `${bestA}, ${bestB}`,
            acceptedAnswers: [`${bestA}, ${bestB}`, `${bestA},${bestB}`, `${bestB}, ${bestA}`, `${bestB},${bestA}`, `${bestA} and ${bestB}`, `${bestB} and ${bestA}`]
          },
          {
            label: `Write the working equation to find the ${goalWord} possible product:`,
            expectedAnswer: `${bestA} * ${bestB} = ${bestProd}`,
            acceptedAnswers: makeMulEq(bestA, bestB, bestProd)
          }
        ]
      };
    } else if (isMCQ) {
      const altA = sorted[0] * 100 + sorted[2] * 10 + sorted[4];
      const altB = sorted[1] * 10 + sorted[3];
      const altProd = altA * altB === bestProd ? bestProd + (askGreatest ? -100 : 100) : altA * altB;
      mcqData = buildFourUniqueOptions(answer, [
        { value: altProd, defect: 'SUBOPTIMAL_DIGIT_PLACEMENT' },
        { value: bestProd + (askGreatest ? -200 : 200), defect: 'CARRY_OVER_ERROR' },
        { value: bestA + bestB, defect: 'ADDED_INSTEAD_OF_MULTIPLIED' }
      ]);
    }
    solutionSteps = `Step 1: Place the ${askGreatest ? 'largest' : 'smallest'} digits in the hundreds and tens places, balancing the remaining digits to get ${bestA} and ${bestB}.\\nStep 2: Multiply: ${bestA} * ${bestB} = ${bestProd}.`;
    hint = `Put the ${askGreatest ? 'two largest' : 'two smallest'} digits in the highest place values (hundreds of the 3-digit number and tens of the 2-digit number), and test the two pairings!`;

  } else if (variant === 'advanced_wrong_multiplier_correction') {
    const x = getRandomInt(145, 485);
    const a = getRandomInt(28, 55);
    const diffMult = getRandomInt(4, 9);
    const b = a - diffMult;
    const wrongProd = x * b;
    const diffVal = x * diffMult;
    const correctProd = x * a;

    const findCorrectFromWrong = !isStructure && Math.random() > 0.5;
    if (findCorrectFromWrong) {
      answer = String(correctProd);
      acceptedAnswers = [answer, correctProd.toLocaleString()];
      askText = `${names[0]} wanted to multiply ${x} by ${a}, but accidentally multiplied ${x} by ${b} and got ${wrongProd.toLocaleString()}. What is the correct answer?`;
    } else {
      answer = String(diffVal);
      acceptedAnswers = [answer, diffVal.toLocaleString()];
      askText = `${names[0]} was supposed to multiply ${x} by ${a}, but accidentally multiplied ${x} by ${b}. How much smaller is the wrong answer than the correct answer?`;
    }

    if (isStructure) {
      const steps = [
        { label: 'Write the working equation to find the difference in the number of groups:', expectedAnswer: `${a} - ${b} = ${diffMult}`, acceptedAnswers: makeSubEq(a, b, diffMult) },
        { label: 'Write the working equation to find how much smaller the wrong answer is:', expectedAnswer: `${x} * ${diffMult} = ${diffVal}`, acceptedAnswers: makeMulEq(x, diffMult, diffVal) }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'COMPARISON_WRONG_MULTIPLIER',
          correctModelType: 'COMPARISON',
          modelOptions: ALL_MODEL_OPTIONS,
          entities: [
            { id: 'A', name: `${a} groups of ${x}`, value: '?', displayValue: '?', relation: 'BASE' },
            { id: 'B', name: `${b} groups of ${x}`, value: '?', displayValue: '?', relativeTo: `${a} groups of ${x}`, relation: 'FEWER' }
          ],
          target: { type: 'DIFFERENCE', label: 'Shortfall' },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = findCorrectFromWrong
        ? buildFourUniqueOptions(answer, [
            { value: diffVal, defect: 'STOPPED_AT_DIFFERENCE' },
            { value: wrongProd - diffVal, defect: 'SUBTRACTED_INSTEAD_OF_ADDED' },
            { value: wrongProd + diffMult, defect: 'FORGOT_TO_MULTIPLY_BY_X' }
          ])
        : buildFourUniqueOptions(answer, [
            { value: diffMult, defect: 'STOPPED_AT_GROUP_DIFFERENCE' },
            { value: correctProd, defect: 'ANSWERED_CORRECT_PRODUCT_INSTEAD' },
            { value: diffVal + x, defect: 'OFF_BY_ONE_GROUP' }
          ]);
    }
    solutionSteps = `Step 1: Difference in groups = ${a} - ${b} = ${diffMult}.\\nStep 2: Difference in product = ${x} * ${diffMult} = ${diffVal}.${findCorrectFromWrong ? `\\nStep 3: Correct answer = ${wrongProd} + ${diffVal} = ${correctProd}.` : ''}`;
    hint = `Instead of multiplying everything twice, find how many groups of ${x} are missing (${a} - ${b}) and multiply that by ${x}!`;

  } else if (variant === 'advanced_before_after_inventory_transfer') {
    const x = getRandomInt(115, 245);
    const startA = getRandomInt(28, 45);
    const startB = startA - getRandomInt(4, 8);
    const transfer = getRandomInt(8, 15); // Ensures newB > newA!
    const newA = startA - transfer;
    const newB = startB + transfer;
    const diffCartons = newB - newA;
    const diffItems = diffCartons * x;

    answer = String(diffItems);
    acceptedAnswers = [answer, diffItems.toLocaleString(), `${answer} ${item}`];
    askText = `STORY: Warehouse A starts with ${startA} cartons of ${x} ${item}. Warehouse B starts with ${startB} cartons of ${x} ${item}. Warehouse A transfers ${transfer} cartons to Warehouse B.\n\nCRITICAL INSTRUCTION: Ask how many more ${item} Warehouse B has than Warehouse A now.`;

    if (isStructure) {
      const steps = [
        { label: "Write the working equation to find Warehouse A's new number of cartons:", expectedAnswer: `${startA} - ${transfer} = ${newA}`, acceptedAnswers: makeSubEq(startA, transfer, newA) },
        { label: "Write the working equation to find Warehouse B's new number of cartons:", expectedAnswer: `${startB} + ${transfer} = ${newB}`, acceptedAnswers: [`${startB} + ${transfer} = ${newB}`, `${startB}+${transfer}=${newB}`, `${transfer} + ${startB} = ${newB}`, `${transfer}+${startB}=${newB}`] },
        { label: 'Write the working equation to find the difference in cartons:', expectedAnswer: `${newB} - ${newA} = ${diffCartons}`, acceptedAnswers: makeSubEq(newB, newA, diffCartons) },
        { label: 'Write the working equation to find the difference in total items:', expectedAnswer: `${x} * ${diffCartons} = ${diffItems}`, acceptedAnswers: makeMulEq(x, diffCartons, diffItems) }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'BEFORE_AFTER_CARTON_TRANSFER',
          correctModelType: 'BEFORE_AFTER',
          modelOptions: ALL_MODEL_OPTIONS,
          entities: [
            { id: 'A', name: 'Warehouse A (cartons)', value: startA, displayValue: String(startA) },
            { id: 'B', name: 'Warehouse B (cartons)', value: startB, displayValue: String(startB) }
          ],
          transfer: { from: 'Warehouse A (cartons)', to: 'Warehouse B (cartons)', amount: transfer },
          target: { type: 'DIFFERENCE', label: 'Difference in items' },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: diffCartons, defect: 'ANSWERED_CARTONS_INSTEAD_OF_ITEMS' },
        { value: Math.abs(startA - startB) * x, defect: 'FORGOT_TRANSFER' },
        { value: (newB - newA + 1) * x, defect: 'CARELESS_CALCULATION' }
      ]);
    }
    solutionSteps = `Step 1: Warehouse A now has ${startA} - ${transfer} = ${newA} cartons.\\nStep 2: Warehouse B now has ${startB} + ${transfer} = ${newB} cartons.\\nStep 3: Difference in cartons = ${newB} - ${newA} = ${diffCartons}.\\nStep 4: Difference in ${item} = ${x} * ${diffCartons} = ${diffItems}.`;
    hint = `Find the new number of cartons in each warehouse after the transfer, subtract to find the carton difference, then multiply by ${x}!`;

  } else {
    // advanced_target_shortfall_multi_tiered
    const x = getRandomInt(215, 425);
    const m = getRandomInt(24, 52);
    const batch1 = x * m;

    const y = getRandomInt(1250, 2850);
    const n = getRandomInt(4, 8);
    const batch2 = y * n;

    const collected = batch1 + batch2;
    const isShortfall = isStructure || Math.random() > 0.35;
    const target = isShortfall
      ? Math.ceil((collected + 5000) / 5000) * 5000
      : Math.floor((collected - 3000) / 5000) * 5000;
    const diff = Math.abs(target - collected);

    answer = String(diff);
    acceptedAnswers = [answer, diff.toLocaleString(), `${answer} ${item}`];
    askText = isShortfall
      ? `STORY: A charity needs ${target.toLocaleString()} ${item}. They have collected ${m} boxes of ${x} ${item} and ${n} crates of ${y} ${item}.\n\nCRITICAL INSTRUCTION: Ask how many more ${item} are needed to reach the target of ${target.toLocaleString()}.`
      : `STORY: A charity set a target of ${target.toLocaleString()} ${item}. They collected ${m} boxes of ${x} ${item} and ${n} crates of ${y} ${item}.\n\nCRITICAL INSTRUCTION: Ask by how many ${item} they exceeded their target.`;

    if (isStructure) {
      const steps = [
        { label: 'Write the working equation to find the items in the boxes:', expectedAnswer: `${x} * ${m} = ${batch1}`, acceptedAnswers: makeMulEq(x, m, batch1) },
        { label: 'Write the working equation to find the items in the crates:', expectedAnswer: `${y} * ${n} = ${batch2}`, acceptedAnswers: makeMulEq(y, n, batch2) },
        { label: 'Write the working equation to find the total items collected so far:', expectedAnswer: `${batch1} + ${batch2} = ${collected}`, acceptedAnswers: [`${batch1} + ${batch2} = ${collected}`, `${batch1}+${batch2}=${collected}`, `${batch2} + ${batch1} = ${collected}`, `${batch2}+${batch1}=${collected}`] },
        { label: `Write the working equation to find how many more items are needed to reach ${target.toLocaleString()}:`, expectedAnswer: `${target} - ${collected} = ${diff}`, acceptedAnswers: makeSubEq(target, collected, diff) }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'PART_WHOLE_TARGET_SHORTFALL',
          correctModelType: 'PART_WHOLE',
          modelOptions: ALL_MODEL_OPTIONS,
          parts: [
            { name: 'Collected So Far', value: '?', displayValue: '?' },
            { name: 'Still Needed', value: '?', displayValue: '?', isShortfall: true }
          ],
          whole: { label: `Target ${item}`, value: target, displayValue: target.toLocaleString(), isTarget: false },
          target: { type: 'PART', label: 'Still Needed' },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: collected, defect: 'STOPPED_AT_COLLECTED_TOTAL' },
        { value: target - batch1, defect: 'FORGOT_SECOND_BATCH' },
        { value: diff + 1000, defect: 'CARELESS_SUBTRACTION' }
      ]);
    }
    solutionSteps = `Step 1: Items in boxes = ${x} * ${m} = ${batch1}.\\nStep 2: Items in crates = ${y} * ${n} = ${batch2}.\\nStep 3: Total collected = ${batch1} + ${batch2} = ${collected}.\\nStep 4: ${isShortfall ? `Needed = ${target} - ${collected} = ${diff}.` : `Surplus = ${collected} - ${target} = ${diff}.`}`;
    hint = `Multiply to find both batches first, add them to get the total collected, then compare with ${target.toLocaleString()}!`;
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
