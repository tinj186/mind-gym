import { getRandomNames, getPackingAndShoppingItems } from '../../../../../utils/variable-bank.js';
import {
  ALL_MODEL_OPTIONS,
  getRandomInt,
  getGCF,
  makeDivEq,
  makeMulEq,
  makeSubEq,
  buildFourUniqueOptions,
  buildPromptPayload
} from '../../whole-numbers-factors-and-multiples/common-factors/utils.js';

const pickReducedFraction = (minDen = 4, maxDen = 9, minNum = 2) => {
  let den, num;
  do {
    den = getRandomInt(minDen, maxDen);
    num = getRandomInt(minNum, den - 1);
  } while (getGCF(num, den) !== 1);
  return { num, den };
};

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
  const variant = activeVariant === 'standard_default' ? 'standard_finding_whole_from_part' : activeVariant;
  const names = getRandomNames(2);
  const items = getPackingAndShoppingItems(1);
  const item = items[0].item;

  let askText = '';
  let answer = '';
  let acceptedAnswers = [];
  let mcqData = null;
  let solutionSteps = '';
  let hint = '';
  const visualEngineObj = { componentToRender: 'NONE', componentData: { hideVisual: true } };
  let inputRequirementObj = null;

  if (variant === 'standard_finding_whole_from_part') {
    const { num, den } = pickReducedFraction(4, 9, 2);
    const unitVal = getRandomInt(4, 15);
    const part = num * unitVal;
    const total = den * unitVal;

    answer = String(total);
    acceptedAnswers = isShort ? [answer] : [answer, `${answer} ${item}`];
    askText = isShort
      ? `${num}/${den} of a set is ${part}. How many items are there altogether?`
      : `STORY: ${num}/${den} of the ${item} in a hall belong to ${names[0]}'s group. ${names[0]}'s group has ${part} ${item}.\n\nCRITICAL INSTRUCTION: Ask how many ${item} there are altogether.`;

    const eqDiv = makeDivEq(part, num);
    if (isStructure) {
      const steps = [
        { label: 'Write the working equation to find the value of 1 unit:', expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
        { label: 'Write the working equation to find the total:', expectedAnswer: `${unitVal} * ${den} = ${total}`, acceptedAnswers: makeMulEq(unitVal, den, total) }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'PART_WHOLE_FIND_TOTAL_FROM_PART',
          correctModelType: 'PART_WHOLE',
          modelOptions: ALL_MODEL_OPTIONS,
          parts: [
            { name: `${names[0]}'s Group (${num}u)`, value: part, displayValue: String(part) },
            { name: `Others (${den - num}u)`, value: '?', displayValue: '?' }
          ],
          whole: { label: `Total ${item}`, value: '?', displayValue: '?', isTarget: true },
          target: { type: 'WHOLE', label: `Total ${item}` },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: unitVal, defect: 'STOPPED_AT_ONE_UNIT' },
        { value: (den - num) * unitVal, defect: 'FOUND_REMAINING_PART_INSTEAD' },
        { value: part * den, defect: 'FORGOT_TO_DIVIDE_BY_NUMERATOR' }
      ]);
    }
    solutionSteps = `Step 1: ${num} units = ${part}, so 1 unit = ${eqDiv.expected}.\\nStep 2: Total (${den} units) = ${unitVal} * ${den} = ${total}.`;
    hint = `${num} units equal ${part}. Find 1 unit first, then multiply by ${den}!`;

  } else if (variant === 'standard_difference_between_parts') {
    let num, den;
    do {
      den = getRandomInt(5, 9);
      num = getRandomInt(2, Math.floor((den - 1) / 2));
    } while (getGCF(num, den) !== 1);
    const remNum = den - num;
    const diffUnits = remNum - num;
    const unitVal = getRandomInt(4, 12);
    const total = den * unitVal;
    const partAVal = num * unitVal;
    const ans = diffUnits * unitVal;
    const givenTotal = Math.random() > 0.45;

    answer = String(ans);
    acceptedAnswers = isShort ? [answer] : [answer, `${answer} ${item}`];
    askText = isShort
      ? givenTotal
        ? `${num}/${den} of a set of ${total} items are in the first part and the rest are in the second part. How many more items are in the second part than the first part?`
        : `${num}/${den} of a set are in the first part, which has ${partAVal} items. The rest are in the second part. How many more items are in the second part than the first part?`
      : givenTotal
        ? `STORY: ${names[0]} has ${total} ${item}. ${num}/${den} of them belong to Group A and the rest belong to Group B. Rewrite Group A and Group B into two natural, realistic categories fitting ${item} (never nonsensical colours).\n\nCRITICAL INSTRUCTION: Ask how many more ${item} are in the second category than the first category.`
        : `STORY: ${names[0]} has a set of ${item}. ${num}/${den} of them belong to Group A, which has ${partAVal} ${item}. The rest belong to Group B. Rewrite Group A and Group B into two natural, realistic categories fitting ${item} (never nonsensical colours).\n\nCRITICAL INSTRUCTION: Ask how many more ${item} are in the second category than the first category.`;

    const eqDiv = givenTotal ? makeDivEq(total, den) : makeDivEq(partAVal, num);
    if (isStructure) {
      const steps = [
        { label: 'Write the working equation to find the value of 1 unit:', expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
        { label: 'Write the working equation to find the difference in units between the two parts:', expectedAnswer: `${remNum} - ${num} = ${diffUnits}`, acceptedAnswers: makeSubEq(remNum, num, diffUnits) },
        { label: 'Write the working equation to find the difference in actual items:', expectedAnswer: `${unitVal} * ${diffUnits} = ${ans}`, acceptedAnswers: makeMulEq(unitVal, diffUnits, ans) }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'PART_WHOLE_DIFFERENCE_BETWEEN_PARTS',
          correctModelType: 'PART_WHOLE',
          modelOptions: ALL_MODEL_OPTIONS,
          parts: [
            { name: 'Group A', value: givenTotal ? '?' : partAVal, displayValue: givenTotal ? '?' : String(partAVal) },
            { name: 'Group B', value: '?', displayValue: '?' }
          ],
          whole: { label: `Total ${item}`, value: givenTotal ? total : '?', displayValue: givenTotal ? String(total) : '?', isTarget: false },
          target: { type: 'DIFFERENCE', label: 'Difference' },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: remNum * unitVal, defect: 'ANSWERED_SECOND_GROUP_TOTAL_INSTEAD' },
        { value: partAVal, defect: 'ANSWERED_FIRST_GROUP_TOTAL_INSTEAD' },
        { value: diffUnits, defect: 'STOPPED_AT_UNIT_DIFFERENCE' }
      ]);
    }
    solutionSteps = `Step 1: 1 unit = ${eqDiv.expected}.\\nStep 2: Second group has ${remNum} units, first group has ${num} units. Difference = ${remNum} - ${num} = ${diffUnits} units.\\nStep 3: Difference = ${unitVal} * ${diffUnits} = ${ans}.`;
    hint = givenTotal
      ? `Find 1 unit first (${total} ÷ ${den}), then find the difference in units (${remNum} - ${num})!`
      : `${num} units equal ${partAVal}. Find 1 unit first, then multiply by the difference in units (${remNum} - ${num})!`;

  } else if (variant === 'standard_multi_category_sets') {
    const den = getRandomInt(7, 12);
    const a = getRandomInt(2, Math.floor(den / 2));
    const b = getRandomInt(1, den - a - 1);
    const c = den - a - b;
    const unitVal = getRandomInt(3, 10);
    const total = den * unitVal;
    const ans = c * unitVal;

    answer = String(ans);
    acceptedAnswers = isShort ? [answer] : [answer, `${answer} ${item}`];
    askText = isShort
      ? `In a set of ${total} items, ${a}/${den} belong to the first group, ${b}/${den} belong to the second group, and the rest belong to the third group. How many items are in the third group?`
      : `STORY: ${names[0]} has ${total} ${item}. ${a}/${den} of them belong to Category 1, ${b}/${den} belong to Category 2, and the rest belong to Category 3. Rewrite Category 1, Category 2, and Category 3 into three natural, realistic types/groups fitting ${item} (never nonsensical colours).\n\nCRITICAL INSTRUCTION: Ask how many ${item} are in the remaining category (Category 3).`;

    const eqDiv = makeDivEq(total, den);
    if (isStructure) {
      const steps = [
        {
          label: 'Write the working equation to find the remaining fraction (in units):',
          expectedAnswer: `${den} - ${a} - ${b} = ${c}`,
          acceptedAnswers: [`${den} - ${a} - ${b} = ${c}`, `${den}-${a}-${b}=${c}`, String(c)]
        },
        { label: 'Write the working equation to find the value of 1 unit:', expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
        { label: 'Write the working equation to find the number of items in the remaining category:', expectedAnswer: `${unitVal} * ${c} = ${ans}`, acceptedAnswers: makeMulEq(unitVal, c, ans) }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'PART_WHOLE_MULTI_CATEGORY',
          correctModelType: 'PART_WHOLE',
          modelOptions: ALL_MODEL_OPTIONS,
          parts: [
            { name: 'Category 1', value: '?', displayValue: '?' },
            { name: 'Category 2', value: '?', displayValue: '?' },
            { name: 'Remaining', value: '?', displayValue: '?' }
          ],
          whole: { label: `Total ${item}`, value: total, displayValue: String(total), isTarget: false },
          target: { type: 'PART', label: 'Remaining' },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: (a + b) * unitVal, defect: 'FOUND_CAT1_PLUS_CAT2' },
        { value: c, defect: 'STOPPED_AT_UNITS' },
        { value: b * unitVal, defect: 'FOUND_CAT2_INSTEAD' }
      ]);
    }
    solutionSteps = `Step 1: Remaining units = ${den} - ${a} - ${b} = ${c} units.\\nStep 2: 1 unit = ${eqDiv.expected}.\\nStep 3: Remaining ${item} = ${unitVal} * ${c} = ${ans}.`;
    hint = `Subtract ${a} and ${b} from ${den} to find how many units are in the remaining category!`;

  } else if (variant === 'standard_subtractive_deduction') {
    const { num, den } = pickReducedFraction(4, 9, 2);
    const remNum = den - num;
    const unitVal = getRandomInt(4, 12);
    const left = remNum * unitVal;
    const sold = num * unitVal;

    answer = String(sold);
    acceptedAnswers = isShort ? [answer] : [answer, `${answer} ${item}`];
    askText = isShort
      ? `${num}/${den} of a set were used and ${left} items were left. How many items were used?`
      : `STORY: ${names[0]} sold ${num}/${den} of the ${item} and had ${left} ${item} left.\n\nCRITICAL INSTRUCTION: Ask how many ${item} ${names[0]} sold.`;

    const eqDiv = makeDivEq(left, remNum);
    if (isStructure) {
      const steps = [
        { label: 'Write the working equation to find the fraction of items left (in units):', expectedAnswer: `${den} - ${num} = ${remNum}`, acceptedAnswers: makeSubEq(den, num, remNum) },
        { label: 'Write the working equation to find the value of 1 unit:', expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
        { label: 'Write the working equation to find the number of items sold:', expectedAnswer: `${unitVal} * ${num} = ${sold}`, acceptedAnswers: makeMulEq(unitVal, num, sold) }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'PART_WHOLE_SUBTRACTIVE_DEDUCTION',
          correctModelType: 'PART_WHOLE',
          modelOptions: ALL_MODEL_OPTIONS,
          parts: [
            { name: 'Sold', value: '?', displayValue: '?' },
            { name: 'Left', value: left, displayValue: String(left) }
          ],
          whole: { label: `Total ${item}`, value: '?', displayValue: '?', isTarget: false },
          target: { type: 'PART', label: 'Sold' },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: den * unitVal, defect: 'FOUND_TOTAL_INSTEAD_OF_SOLD' },
        { value: unitVal, defect: 'STOPPED_AT_ONE_UNIT' },
        { value: Math.floor(left / num) * den, defect: 'DIVIDED_BY_WRONG_UNITS' }
      ]);
    }
    solutionSteps = `Step 1: Units left = ${den} - ${num} = ${remNum} units.\\nStep 2: ${remNum} units = ${left}, so 1 unit = ${eqDiv.expected}.\\nStep 3: Sold (${num} units) = ${unitVal} * ${num} = ${sold}.`;
    hint = `The ${left} items left represent ${remNum} units out of ${den}. Find 1 unit, then multiply by ${num}!`;

  } else {
    // standard_fractional_comparative
    const { num, den } = pickReducedFraction(4, 8, 2);
    const diffUnits = den - num;
    const totalUnits = den + num;
    const unitVal = getRandomInt(4, 12);
    const diffVal = diffUnits * unitVal;
    const totalVal = totalUnits * unitVal;

    answer = String(totalVal);
    acceptedAnswers = isShort ? [answer] : [answer, `${answer} ${item}`];
    askText = isShort
      ? `Set A has ${num}/${den} as many items as Set B. Set B has ${diffVal} more items than Set A. How many items do they have altogether?`
      : `STORY: ${names[0]} has ${num}/${den} as many ${item} as ${names[1]}. ${names[1]} has ${diffVal} more ${item} than ${names[0]}.\n\nCRITICAL INSTRUCTION: Ask how many ${item} they have altogether.`;

    const eqDiv = makeDivEq(diffVal, diffUnits);
    if (isStructure) {
      const steps = [
        { label: 'Write the working equation to find the difference in units:', expectedAnswer: `${den} - ${num} = ${diffUnits}`, acceptedAnswers: makeSubEq(den, num, diffUnits) },
        { label: 'Write the working equation to find the value of 1 unit:', expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
        {
          label: 'Write the working equation to find the total units:',
          expectedAnswer: `${den} + ${num} = ${totalUnits}`,
          acceptedAnswers: [`${den} + ${num} = ${totalUnits}`, `${den}+${num}=${totalUnits}`, `${num} + ${den} = ${totalUnits}`, `${num}+${den}=${totalUnits}`, String(totalUnits)]
        },
        { label: 'Write the working equation to find the total items:', expectedAnswer: `${totalUnits} * ${unitVal} = ${totalVal}`, acceptedAnswers: makeMulEq(totalUnits, unitVal, totalVal) }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'COMPARISON_FRACTIONAL_RATIO',
          correctModelType: 'COMPARISON',
          modelOptions: ALL_MODEL_OPTIONS,
          entities: [
            { id: 'A', name: `${names[0]} (${num}u)`, value: '?', displayValue: '?', relativeTo: `${names[1]} (${den}u)`, relation: 'FEWER' },
            { id: 'B', name: `${names[1]} (${den}u)`, value: '?', displayValue: '?', relation: 'BASE', difference: diffVal }
          ],
          target: { type: 'TOTAL', label: 'Total Items' },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: den * unitVal, defect: 'FOUND_B_ONLY' },
        { value: num * unitVal, defect: 'FOUND_A_ONLY' },
        { value: unitVal, defect: 'STOPPED_AT_ONE_UNIT' }
      ]);
    }
    solutionSteps = `Step 1: Difference = ${den} - ${num} = ${diffUnits} units.\\nStep 2: 1 unit = ${eqDiv.expected}.\\nStep 3: Total units = ${den} + ${num} = ${totalUnits} units.\\nStep 4: Total = ${totalUnits} * ${unitVal} = ${totalVal}.`;
    hint = `${isShort ? 'Set A' : names[0]} has ${num} units and ${isShort ? 'Set B' : names[1]} has ${den} units. The difference of ${diffUnits} units equals ${diffVal}!`;
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
