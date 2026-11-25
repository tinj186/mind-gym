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

const UNIT_NAMES = {
  2: 'half',
  3: 'third',
  4: 'quarter',
  5: 'fifth',
  6: 'sixth',
  7: 'seventh',
  8: 'eighth',
  9: 'ninth',
  10: 'tenth'
};

const pickReducedFraction = (minDen = 4, maxDen = 9, minNum = 1) => {
  let den, num;
  do {
    den = getRandomInt(minDen, maxDen);
    num = getRandomInt(minNum, den - 2);
  } while (getGCF(num, den) !== 1);
  return { num, den };
};

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
  const variant = activeVariant === 'advanced_default' ? 'advanced_mixed_variable_spending' : activeVariant;
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

  if (variant === 'advanced_mixed_variable_spending') {
    const { num, den } = pickReducedFraction(4, 7, 1);
    const remUnits = den - num;
    const unitVal = getRandomInt(6, 18);
    const remTotal = remUnits * unitVal;
    const discrete1 = getRandomInt(8, remTotal - 6);
    const discrete2 = remTotal - discrete1;
    const total = den * unitVal;

    answer = String(total);
    acceptedAnswers = [answer, `$${answer}`];
    askText = `STORY: ${names[0]} spent ${num}/${den} of their money on Item 1, spent $${discrete1} on Item 2, and had $${discrete2} left. Invent a creative, realistic Primary 4 word problem by replacing Item 1 and Item 2 with varied everyday items, food, gifts, or activities (do NOT always use a book and a toy).\n\nCRITICAL INSTRUCTION: Ask how much money ${names[0]} had at first.`;

    const eqDiv = makeDivEq(remTotal, remUnits);
    if (isStructure) {
      const steps = [
        {
          label: 'Write the working equation to find the total value of the remaining fraction:',
          expectedAnswer: `${discrete1} + ${discrete2} = ${remTotal}`,
          acceptedAnswers: [`${discrete1} + ${discrete2} = ${remTotal}`, `${discrete1}+${discrete2}=${remTotal}`, `${discrete2} + ${discrete1} = ${remTotal}`, `${discrete2}+${discrete1}=${remTotal}`, String(remTotal)]
        },
        { label: 'Write the working equation to find the value of 1 unit:', expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
        { label: 'Write the working equation to find the original total:', expectedAnswer: `${unitVal} * ${den} = ${total}`, acceptedAnswers: makeMulEq(unitVal, den, total) }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'PART_WHOLE_MIXED_DISCRETE_REMAINDER',
          correctModelType: 'PART_WHOLE',
          modelOptions: ALL_MODEL_OPTIONS,
          parts: [
            { name: 'Item 1', value: '?', displayValue: '?' },
            { name: 'Item 2', value: discrete1, displayValue: `$${discrete1}` },
            { name: 'Left', value: discrete2, displayValue: `$${discrete2}` }
          ],
          whole: { label: 'Original Money', value: '?', displayValue: '?', isTarget: true },
          target: { type: 'WHOLE', label: 'Original Money' },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: remTotal, defect: 'STOPPED_AT_REMAINING_TOTAL' },
        { value: unitVal, defect: 'STOPPED_AT_ONE_UNIT' },
        { value: num * unitVal, defect: 'FOUND_FIRST_ITEM_COST_INSTEAD' }
      ]);
    }
    solutionSteps = `Step 1: Remaining ${remUnits} units = $${discrete1} + $${discrete2} = $${remTotal}.\\nStep 2: 1 unit = ${eqDiv.expected}.\\nStep 3: Original total (${den} units) = ${unitVal} * ${den} = $${total}.`;
    hint = `Add $${discrete1} and $${discrete2} together to find the value of the remaining ${remUnits} units!`;

  } else if (variant === 'advanced_equalizing_transfers') {
    const denOptions = [6, 8, 10];
    const den = denOptions[getRandomInt(0, denOptions.length - 1)];
    const numA = getRandomInt(den / 2 + 1, den - 1);
    const numB = den - numA;
    const diffU = numA - numB;
    const transferU = diffU / 2;
    const unitVal = getRandomInt(3, 12);
    const total = den * unitVal;
    const transferVal = transferU * unitVal;

    answer = String(transferVal);
    acceptedAnswers = [answer, `${answer} ${item}`];
    askText = `STORY: ${names[0]} and ${names[1]} have a total of ${total} ${item}. ${names[0]} has ${numA}/${den} of the total. ${names[0]} transfers some ${item} to ${names[1]} so that they both have an equal number. Rewrite this into a creative, realistic Primary 4 story with a vivid setting (e.g., school event, baking, packing, or collecting).\n\nCRITICAL INSTRUCTION: Ask how many ${item} ${names[0]} gave to ${names[1]}.`;

    const eqDiv1 = makeDivEq(total, den);
    const eqDiv2 = makeDivEq(diffU, 2);
    if (isStructure) {
      const steps = [
        { label: 'Write the working equation to find the value of 1 unit:', expectedAnswer: eqDiv1.expected, acceptedAnswers: eqDiv1.accepted },
        { label: 'Write the working equation to find the difference in units between the two people:', expectedAnswer: `${numA} - ${numB} = ${diffU}`, acceptedAnswers: makeSubEq(numA, numB, diffU) },
        { label: 'A transfer is half the difference. Write the working equation to find the transfer in units:', expectedAnswer: eqDiv2.expected, acceptedAnswers: eqDiv2.accepted },
        { label: 'Write the working equation to find the actual number of items transferred:', expectedAnswer: `${transferU} * ${unitVal} = ${transferVal}`, acceptedAnswers: makeMulEq(transferU, unitVal, transferVal) }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'BEFORE_AFTER_EQUALIZING_TRANSFER',
          correctModelType: 'BEFORE_AFTER',
          modelOptions: ALL_MODEL_OPTIONS,
          entities: [
            { id: 'A', name: `${names[0]} (${numA}u)`, value: '?', displayValue: '?' },
            { id: 'B', name: `${names[1]} (${numB}u)`, value: '?', displayValue: '?' }
          ],
          whole: { label: `Total ${item}`, value: total, displayValue: String(total), isTarget: false },
          target: { type: 'TRANSFER', label: 'Items Transferred' },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: diffU * unitVal, defect: 'FORGOT_TO_HALVE_DIFFERENCE' },
        { value: (den / 2) * unitVal, defect: 'ANSWERED_EQUAL_AMOUNT_INSTEAD' },
        { value: unitVal, defect: 'STOPPED_AT_ONE_UNIT' }
      ]);
    }
    solutionSteps = `Step 1: 1 unit = ${eqDiv1.expected}.\\nStep 2: ${names[0]} has ${numA} units and ${names[1]} has ${numB} units. Difference = ${numA} - ${numB} = ${diffU} units.\\nStep 3: Transfer = ${diffU} / 2 = ${transferU} units.\\nStep 4: Items transferred = ${transferU} * ${unitVal} = ${transferVal}.`;
    hint = `To make both equal, ${names[0]} gives away half the difference between ${numA} units and ${numB} units!`;

  } else if (variant === 'advanced_reverse_additive') {
    const { num: leftNum, den } = pickReducedFraction(5, 9, 2);
    const soldNum = den - leftNum;
    const unitVal = getRandomInt(5, 15);
    const sold = soldNum * unitVal;
    const total = den * unitVal;

    answer = String(total);
    acceptedAnswers = [answer, `${answer} ${item}`];
    askText = `STORY: ${names[0]} used/gave away/sold ${sold} ${item} and had ${leftNum}/${den} of the ${item} left. Rewrite this into a creative, realistic Primary 4 story with an action and setting that naturally fit ${item} (do NOT always use a shopkeeper).\n\nCRITICAL INSTRUCTION: Ask how many ${item} ${names[0]} had at first.`;

    const eqDiv = makeDivEq(sold, soldNum);
    if (isStructure) {
      const steps = [
        { label: 'Write the working equation to find the fraction of items used or removed (in units):', expectedAnswer: `${den} - ${leftNum} = ${soldNum}`, acceptedAnswers: makeSubEq(den, leftNum, soldNum) },
        { label: 'Write the working equation to find the value of 1 unit:', expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
        { label: 'Write the working equation to find the original total:', expectedAnswer: `${unitVal} * ${den} = ${total}`, acceptedAnswers: makeMulEq(unitVal, den, total) }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'PART_WHOLE_REVERSE_ADDITIVE',
          correctModelType: 'PART_WHOLE',
          modelOptions: ALL_MODEL_OPTIONS,
          parts: [
            { name: 'Used / Removed', value: sold, displayValue: String(sold) },
            { name: `Left (${leftNum}u)`, value: '?', displayValue: '?' }
          ],
          whole: { label: `Original ${item}`, value: '?', displayValue: '?', isTarget: true },
          target: { type: 'WHOLE', label: `Original ${item}` },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: leftNum * unitVal, defect: 'FOUND_LEFT_INSTEAD_OF_TOTAL' },
        { value: unitVal, defect: 'STOPPED_AT_ONE_UNIT' },
        { value: Math.floor(sold / leftNum) * den, defect: 'USED_LEFT_NUMERATOR_AS_SOLD_UNITS' }
      ]);
    }
    solutionSteps = `Step 1: Sold units = ${den} - ${leftNum} = ${soldNum} units.\\nStep 2: 1 unit = ${eqDiv.expected}.\\nStep 3: Original total (${den} units) = ${unitVal} * ${den} = ${total}.`;
    hint = `If ${leftNum}/${den} was left, then ${soldNum}/${den} was sold! Divide ${sold} by ${soldNum} to find 1 unit.`;

  } else if (variant === 'advanced_shared_numerator') {
    const d1 = getRandomInt(2, 5);
    let d2;
    do {
      d2 = getRandomInt(3, 6);
    } while (d2 === d1);
    const totalUnits = d1 + d2;
    const unitVal = getRandomInt(4, 12);
    const total = totalUnits * unitVal;
    const valB = d2 * unitVal;

    answer = String(valB);
    acceptedAnswers = [answer, `${answer} ${item}`];
    askText = `STORY: 1/${d1} of ${names[0]}'s ${item} is equal to 1/${d2} of ${names[1]}'s ${item}. Altogether, they have ${total} ${item}. Rewrite this into a creative, realistic Primary 4 story with a fitting setting.\n\nCRITICAL INSTRUCTION: Ask how many ${item} ${names[1]} has.`;

    const eqDiv = makeDivEq(total, totalUnits);
    if (isStructure) {
      const steps = [
        {
          label: 'Write the working equation to find the total number of equal units in both sets:',
          expectedAnswer: `${d1} + ${d2} = ${totalUnits}`,
          acceptedAnswers: [`${d1} + ${d2} = ${totalUnits}`, `${d1}+${d2}=${totalUnits}`, `${d2} + ${d1} = ${totalUnits}`, `${d2}+${d1}=${totalUnits}`, String(totalUnits)]
        },
        { label: 'Write the working equation to find the value of 1 unit:', expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
        { label: `Write the working equation to find the number of items ${names[1]} has:`, expectedAnswer: `${unitVal} * ${d2} = ${valB}`, acceptedAnswers: makeMulEq(unitVal, d2, valB) }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'COMPARISON_SHARED_NUMERATOR',
          correctModelType: 'COMPARISON',
          modelOptions: ALL_MODEL_OPTIONS,
          entities: [
            { id: 'A', name: `${names[0]} (${d1}u)`, value: '?', displayValue: '?', relation: 'BASE' },
            { id: 'B', name: `${names[1]} (${d2}u)`, value: '?', displayValue: '?' }
          ],
          whole: { label: 'Combined Total', value: total, displayValue: String(total), isTarget: false },
          target: { type: 'ENTITY', label: `${names[1]} (${d2}u)` },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: d1 * unitVal, defect: 'FOUND_FIRST_PERSON_INSTEAD' },
        { value: unitVal, defect: 'STOPPED_AT_ONE_UNIT' },
        { value: Math.floor(total / d2), defect: 'DIVIDED_TOTAL_BY_D2' }
      ]);
    }
    solutionSteps = `Step 1: ${names[0]} has ${d1} equal units and ${names[1]} has ${d2} equal units. Total = ${d1} + ${d2} = ${totalUnits} units.\\nStep 2: 1 unit = ${eqDiv.expected}.\\nStep 3: ${names[1]} (${d2} units) = ${unitVal} * ${d2} = ${valB}.`;
    hint = `Since 1/${d1} of ${names[0]}'s = 1/${d2} of ${names[1]}'s, ${names[0]} has ${d1} equal units and ${names[1]} has ${d2} equal units!`;

  } else {
    // advanced_two_tiered_difference
    const pairs = [[3, 4], [3, 5], [4, 5], [3, 7], [4, 7], [5, 6]];
    const [d1, d2] = pairs[getRandomInt(0, pairs.length - 1)];
    const n1 = 1;
    let n2 = getRandomInt(1, Math.floor(d2 / 2));
    if (n1 / d1 + n2 / d2 >= 0.9) n2 = 1;

    const lcm = d1 * d2;
    const mult = getRandomInt(2, 5);
    const total = lcm * mult;
    const red = (total / d1) * n1;
    const blue = (total / d2) * n2;
    const green = total - red - blue;
    const diff = Math.abs(green - red);

    answer = String(diff);
    acceptedAnswers = [answer, `${answer} ${item}`];
    askText = `STORY: ${names[0]} has ${total} ${item}. ${n1}/${d1} of them belong to Category 1, ${n2}/${d2} belong to Category 2, and the rest belong to Category 3. Rewrite Category 1, Category 2, and Category 3 into three natural, realistic types/groups fitting ${item} (never nonsensical colours).\n\nCRITICAL INSTRUCTION: Ask for the difference between the number of ${item} in the remaining category (Category 3) and the first category (Category 1).`;

    const eqRed = makeDivEq(total, d1);
    const blueUnit = total / d2;
    const eqBlueExpected = n2 === 1 ? `${total} / ${d2} = ${blue}` : `${total} / ${d2} * ${n2} = ${blue}`;
    const eqBlueAccepted = n2 === 1
      ? makeDivEq(total, d2).accepted
      : [`${total} / ${d2} * ${n2} = ${blue}`, `${total}/${d2}*${n2}=${blue}`, `${blueUnit} * ${n2} = ${blue}`, `${blueUnit}*${n2}=${blue}`, String(blue)];

    if (isStructure) {
      const steps = [
        { label: 'Write the working equation to find the number of items in Category 1:', expectedAnswer: eqRed.expected, acceptedAnswers: eqRed.accepted },
        { label: 'Write the working equation to find the number of items in Category 2:', expectedAnswer: eqBlueExpected, acceptedAnswers: eqBlueAccepted },
        {
          label: 'Write the working equation to find the number of items in the remaining category (Category 3):',
          expectedAnswer: `${total} - ${red} - ${blue} = ${green}`,
          acceptedAnswers: [`${total} - ${red} - ${blue} = ${green}`, `${total}-${red}-${blue}=${green}`, String(green)]
        },
        {
          label: 'Write the working equation to find the difference between the remaining category and Category 1:',
          expectedAnswer: `${Math.max(green, red)} - ${Math.min(green, red)} = ${diff}`,
          acceptedAnswers: makeSubEq(Math.max(green, red), Math.min(green, red), diff)
        }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'PART_WHOLE_TWO_TIERED_DIFFERENCE',
          correctModelType: 'PART_WHOLE',
          modelOptions: ALL_MODEL_OPTIONS,
          parts: [
            { name: 'Category 1', value: '?', displayValue: '?' },
            { name: 'Category 2', value: '?', displayValue: '?' },
            { name: 'Remaining', value: '?', displayValue: '?' }
          ],
          whole: { label: `Total ${item}`, value: total, displayValue: String(total), isTarget: false },
          target: { type: 'DIFFERENCE', label: 'Difference (Remaining & Cat 1)' },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: green, defect: 'STOPPED_AT_REMAINING_TOTAL' },
        { value: Math.abs(green - blue), defect: 'COMPARED_REMAINING_AND_CAT2_INSTEAD' },
        { value: Math.abs(blue - red), defect: 'COMPARED_CAT2_AND_CAT1_INSTEAD' }
      ]);
    }
    solutionSteps = `Step 1: Category 1 = ${eqRed.expected}.\\nStep 2: Category 2 = ${eqBlueExpected}.\\nStep 3: Remaining = ${total} - ${red} - ${blue} = ${green}.\\nStep 4: Difference = ${Math.max(green, red)} - ${Math.min(green, red)} = ${diff}.`;
    hint = `Find the exact number of ${item} in the first two categories, subtract both from ${total} to get the remaining category, then find the difference!`;
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
