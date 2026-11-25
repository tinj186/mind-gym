import { getRandomNames, getPackingAndShoppingItems, getRandomEmojiObjects } from '../../../../../utils/variable-bank.js';
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

const UNIT_PLURALS = {
  2: 'halves',
  3: 'thirds',
  4: 'quarters',
  5: 'fifths',
  6: 'sixths',
  7: 'sevenths',
  8: 'eighths',
  9: 'ninths',
  10: 'tenths'
};

const pickReducedFraction = (minDen = 3, maxDen = 9, minNum = 1) => {
  let den, num;
  do {
    den = getRandomInt(minDen, maxDen);
    num = getRandomInt(minNum, den - 1);
  } while (getGCF(num, den) !== 1);
  return { num, den };
};

export const foundationLogic = (
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
  const variant = activeVariant === 'foundation_default' ? 'foundation_direct_set_calculation' : activeVariant;
  const names = getRandomNames(2);
  const items = getPackingAndShoppingItems(1);
  const item = items[0].item;
  const emojiItems = getRandomEmojiObjects(1);
  const emojiObj = emojiItems[0];

  let askText = '';
  let answer = '';
  let acceptedAnswers = [];
  let mcqData = null;
  let solutionSteps = '';
  let hint = '';
  let visualEngineObj = { componentToRender: 'NONE', componentData: { hideVisual: true } };
  let inputRequirementObj = null;

  if (variant === 'foundation_direct_set_calculation') {
    const { num, den } = pickReducedFraction(3, 9, 2);
    const unitVal = getRandomInt(3, 12);
    const total = den * unitVal;
    const part = num * unitVal;
    const subType = getRandomInt(1, 3);

    if (subType === 1) {
      // Type 1: Given Fraction and Total, find Part
      answer = String(part);
      acceptedAnswers = [answer, `${answer} ${item}`];
      askText = isStructure
        ? `STORY: ${names[0]} has ${total} ${item}. ${num}/${den} of the ${item} are packed into boxes.\n\nCRITICAL INSTRUCTION: Ask how many ${item} are packed into boxes.`
        : `What is ${num}/${den} of ${total}?`;

      visualEngineObj = {
        componentToRender: 'GRID_ARRAY_VISUALIZER',
        componentData: {
          rows: den,
          columns: unitVal,
          totalItems: total,
          itemShape: 'square',
          rowLabel: 'Equal groups',
          colLabel: 'Items per group',
          title: `${num}/${den} of ${total}`,
          highlightRows: Array.from({ length: num }, (_, i) => i),
          showTotal: true
        }
      };

      const eqDiv = makeDivEq(total, den);
      if (isStructure) {
        inputRequirementObj = {
          inputType: 'MULTI_STEP_INPUT',
          steps: [
            { label: 'Write the working equation to find the value of 1 equal group (1 unit):', expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
            { label: 'Write the working equation to find the value of the required number of groups:', expectedAnswer: `${unitVal} * ${num} = ${part}`, acceptedAnswers: makeMulEq(unitVal, num, part) }
          ]
        };
      } else if (isMCQ) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: unitVal, defect: 'STOPPED_AT_ONE_UNIT' },
          { value: (den - num) * unitVal, defect: 'FOUND_COMPLEMENT_PART' },
          { value: num * den, defect: 'MULTIPLIED_NUMERATOR_BY_DENOMINATOR' }
        ]);
      }
      solutionSteps = `Step 1: Divide ${total} by ${den} to find 1 group: ${eqDiv.expected}.\\nStep 2: Multiply by ${num}: ${unitVal} * ${num} = ${part}.`;
      hint = `First divide ${total} into ${den} equal groups, then multiply by ${num}!`;

    } else if (subType === 2) {
      // Type 2: Given Fraction and Part, find Total
      answer = String(total);
      acceptedAnswers = [answer, `${answer} ${item}`];
      askText = isStructure
        ? `STORY: ${names[0]} gave away ${num}/${den} of a box of ${item}, which was ${part} ${item}.\n\nCRITICAL INSTRUCTION: Ask how many ${item} were in the box at first.`
        : `${num}/${den} of a number is ${part}. What is the number?`;

      visualEngineObj = {
        componentToRender: 'FRACTION_BAR_VISUALIZER',
        componentData: {
          shape: 'rectangle',
          totalBars: 1,
          partitionsPerBar: den,
          totalShadedBlocks: num,
          layout: 'horizontal',
          color: '#3b82f6'
        }
      };

      const eqDiv = makeDivEq(part, num);
      if (isStructure) {
        inputRequirementObj = {
          inputType: 'MULTI_STEP_INPUT',
          steps: [
            { label: 'Write the working equation to find the value of 1 equal group (1 unit):', expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
            { label: 'Write the working equation to find the total number of items:', expectedAnswer: `${unitVal} * ${den} = ${total}`, acceptedAnswers: makeMulEq(unitVal, den, total) }
          ]
        };
      } else if (isMCQ) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: unitVal, defect: 'STOPPED_AT_ONE_UNIT' },
          { value: part * den, defect: 'FORGOT_TO_DIVIDE_BY_NUMERATOR' },
          { value: (den - num) * unitVal, defect: 'FOUND_OTHER_PART_INSTEAD' }
        ]);
      }
      solutionSteps = `Step 1: ${num} groups = ${part}, so 1 group = ${eqDiv.expected}.\\nStep 2: Total (${den} groups) = ${unitVal} * ${den} = ${total}.`;
      hint = `Divide ${part} by ${num} to find 1 unit, then multiply by ${den} for the whole set!`;

    } else {
      // Type 3: Given Total and Part, find Fraction in simplest form
      answer = `${num}/${den}`;
      acceptedAnswers = [answer];
      askText = isStructure
        ? `STORY: ${names[0]} has ${total} ${item} and ${part} of them are blue.\n\nCRITICAL INSTRUCTION: Ask what fraction of the ${item} are blue, expressed in its simplest form.`
        : `Express ${part} as a fraction of ${total} in its simplest form.`;

      visualEngineObj = {
        componentToRender: 'GRID_ARRAY_VISUALIZER',
        componentData: {
          rows: den,
          columns: unitVal,
          totalItems: total,
          itemShape: 'square',
          rowLabel: 'Equal groups',
          colLabel: 'Items per group',
          title: `${part} out of ${total}`,
          highlightRows: Array.from({ length: num }, (_, i) => i),
          showTotal: true
        }
      };

      if (isStructure) {
        inputRequirementObj = {
          inputType: 'MULTI_STEP_INPUT',
          steps: [
            { label: 'Write the unsimplified fraction:', expectedAnswer: `${part}/${total}`, acceptedAnswers: [`${part}/${total}`] },
            { label: 'Write the fraction in its simplest form:', expectedAnswer: answer, acceptedAnswers }
          ]
        };
      } else if (isMCQ) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: `${den - num}/${den}`, defect: 'GAVE_COMPLEMENT_FRACTION' },
          { value: `${part}/${total}`, defect: 'DID_NOT_SIMPLIFY' },
          { value: `${den}/${num}`, defect: 'INVERTED_FRACTION' }
        ]);
      }
      solutionSteps = `Step 1: Write as a fraction: ${part}/${total}.\\nStep 2: Divide numerator and denominator by ${unitVal} to simplify: ${answer}.`;
      hint = `Write ${part}/${total}, then divide top and bottom by their common factor ${unitVal}!`;
    }

  } else if (variant === 'foundation_complementary_fraction') {
    const { num, den } = pickReducedFraction(4, 9, 2);
    const unitVal = getRandomInt(3, 12);
    const total = den * unitVal;
    const partVal = num * unitVal;
    const remNum = den - num;
    const ans = remNum * unitVal;
    const givenTotal = Math.random() > 0.45;

    answer = String(ans);
    acceptedAnswers = isShort ? [answer] : [answer, `${ans} ${item}`];
    askText = isShort
      ? givenTotal
        ? `${num}/${den} of a set of ${total} items are in the first group and the rest are in the second group. How many items are in the second group?`
        : `${num}/${den} of a set of items are in the first group. If there are ${partVal} items in the first group, how many items are in the remaining group?`
      : givenTotal
        ? `STORY: ${names[0]} has ${total} ${item}. ${num}/${den} of the ${item} belong to Group A and the rest belong to Group B. Rewrite Group A and Group B into a natural, realistic Primary 4 context fitting ${item} (e.g., flavours, packed vs unpacked, or sold vs kept — never nonsensical colours).\n\nCRITICAL INSTRUCTION: Ask how many ${item} are in the remaining group (Group B).`
        : `STORY: ${names[0]} has a set of ${item}. ${num}/${den} of the ${item} belong to Group A, and there are ${partVal} ${item} in Group A. The rest belong to Group B. Rewrite Group A and Group B into a natural, realistic Primary 4 context fitting ${item} (e.g., flavours, packed vs unpacked, or sold vs kept — never nonsensical colours).\n\nCRITICAL INSTRUCTION: Ask how many ${item} are in the remaining group (Group B).`;

    const eqDiv = givenTotal ? makeDivEq(total, den) : makeDivEq(partVal, num);
    if (isStructure) {
      const steps = [
        {
          label: 'Write the working equation to find the remaining fraction (in units):',
          expectedAnswer: `${den} - ${num} = ${remNum}`,
          acceptedAnswers: [...makeSubEq(den, num, remNum), `1 - ${num}/${den} = ${remNum}/${den}`, `1-${num}/${den}=${remNum}/${den}`]
        },
        { label: 'Write the working equation to find the value of 1 unit:', expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
        { label: 'Write the working equation to find the number of remaining items:', expectedAnswer: `${unitVal} * ${remNum} = ${ans}`, acceptedAnswers: makeMulEq(unitVal, remNum, ans) }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'PART_WHOLE_COMPLEMENTARY_FRACTION',
          correctModelType: 'PART_WHOLE',
          modelOptions: ALL_MODEL_OPTIONS,
          parts: [
            { name: 'Group A', value: givenTotal ? '?' : partVal, displayValue: givenTotal ? '?' : String(partVal) },
            { name: 'Remaining', value: '?', displayValue: '?' }
          ],
          whole: { label: `Total ${item}`, value: givenTotal ? total : '?', displayValue: givenTotal ? String(total) : '?', isTarget: false },
          target: { type: 'PART', label: 'Remaining' },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: givenTotal ? partVal : total, defect: 'CALCULATED_WRONG_PART_OR_TOTAL' },
        { value: unitVal, defect: 'STOPPED_AT_ONE_UNIT' },
        { value: ans + unitVal, defect: 'CARELESS_UNIT_COUNT' }
      ]);
    }
    const remUnitLabel = remNum === 1 ? 'unit' : 'units';
    solutionSteps = `Step 1: Remaining units = ${den} - ${num} = ${remNum} ${remUnitLabel}.\\nStep 2: 1 unit = ${eqDiv.expected}.\\nStep 3: Remaining ${isShort ? 'items' : item} = ${unitVal} * ${remNum} = ${ans}.`;
    hint = givenTotal
      ? `Out of ${den} equal units, ${num} units are in the first group, so ${remNum} ${remUnitLabel} are in the remaining group!`
      : `${num} units equal ${partVal}. Find 1 unit first, then multiply by the remaining ${remNum} ${remUnitLabel}!`;

  } else if (variant === 'foundation_remainder_simplest_fraction') {
    const { num: remNum, den } = pickReducedFraction(4, 10, 1);
    const unitVal = getRandomInt(2, 4);
    const total = den * unitVal;
    const rem = remNum * unitVal;
    const removed = total - rem;

    answer = `${remNum}/${den}`;
    acceptedAnswers = [answer];
    askText = isShort
      ? `Out of the ${total} ${emojiObj.name} shown, ${removed} are crossed out. What fraction of the ${emojiObj.name} are left? Express your answer in its simplest form.`
      : `STORY: ${names[0]} has a total of ${total} ${emojiObj.name}, and ${removed} of them are removed (crossed out). Rewrite this into a natural, realistic Primary 4 story fitting ${emojiObj.name} (e.g. given away, sold, used, lost, or eaten — never say "spoiled" for non-food items).\n\nCRITICAL INSTRUCTION: Ask what fraction of the ${emojiObj.name} are left, expressed in its simplest form.`;

    visualEngineObj = {
      componentToRender: 'CROSS_OUT_GROUP',
      componentData: {
        totalItems: total,
        crossedItems: removed,
        icon: emojiObj.icon
      }
    };

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: 'Write the working equation to find the number of remaining items:', expectedAnswer: `${total} - ${removed} = ${rem}`, acceptedAnswers: makeSubEq(total, removed, rem) },
          { label: 'Write the unsimplified fraction of remaining items:', expectedAnswer: `${rem}/${total}`, acceptedAnswers: [`${rem}/${total}`] },
          { label: 'Write the final fraction in its simplest form:', expectedAnswer: answer, acceptedAnswers }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: `${den - remNum}/${den}`, defect: 'FOUND_REMOVED_FRACTION_INSTEAD' },
        { value: `${rem}/${total}`, defect: 'DID_NOT_SIMPLIFY' },
        { value: `${removed}/${rem}`, defect: 'USED_REMOVED_OVER_REMAINING' }
      ]);
    }
    solutionSteps = `Step 1: Remaining ${emojiObj.name} = ${total} - ${removed} = ${rem}.\\nStep 2: Fraction remaining = ${rem}/${total}.\\nStep 3: Divide top and bottom by ${unitVal}: ${answer}.`;
    hint = `Subtract ${removed} from ${total} first to find how many are left, then simplify the fraction!`;

  } else if (variant === 'foundation_multiplier_translation') {
    const { num, den } = pickReducedFraction(3, 9, 2);
    const unitVal = getRandomInt(3, 12);
    const total = den * unitVal;

    answer = String(unitVal);
    acceptedAnswers = [answer];
    askText = isStructure
      ? `STORY: ${names[0]} wants to find ${num}/${den} of ${total} ${item}, which is the same as ${num} × ?.\n\nCRITICAL INSTRUCTION: Ask for the missing number that replaces ?.`
      : `${num}/${den} of ${total} is the same as ${num} × ?. What is the missing number?`;

    const eqDiv = makeDivEq(total, den);
    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: 'Write the working equation to find the value of 1 equal group (1 unit):', expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
          { label: 'Write the missing number:', expectedAnswer: answer, acceptedAnswers }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: num * unitVal, defect: 'CALCULATED_FINAL_PRODUCT_INSTEAD' },
        { value: total, defect: 'USED_TOTAL' },
        { value: unitVal + 1, defect: 'CARELESS_DIVISION' }
      ]);
    }
    solutionSteps = `Step 1: ${num}/${den} of ${total} means ${num} groups of 1/${den} of ${total}.\\nStep 2: 1/${den} of ${total} = ${eqDiv.expected}, so ? = ${unitVal}.`;
    hint = `Think: ${num}/${den} of ${total} is ${num} times the value of 1/${den} of ${total}!`;

  } else {
    // foundation_fractional_equivalence_sets
    const d1 = getRandomInt(2, 6);
    let d2;
    do {
      d2 = getRandomInt(2, 8);
    } while (d2 === d1);
    const part = getRandomInt(4, 12);
    const total1 = d1 * part;
    const total2 = d2 * part;

    answer = String(total2);
    acceptedAnswers = isStructure ? [answer, `${answer} ${item}`] : [answer];
    askText = isStructure
      ? `STORY: ${names[0]} has ${total1} ${item}. 1/${d1} of ${names[0]}'s ${item} is equal to 1/${d2} of ${names[1]}'s ${item}.\n\nCRITICAL INSTRUCTION: Ask how many ${item} ${names[1]} has.`
      : `1/${d1} of ${total1} is equal to 1/${d2} of what number?`;

    const eqDiv = makeDivEq(total1, d1);
    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: 'Write the working equation to find the value of the first fraction:', expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
          { label: 'Write the working equation to find the new total:', expectedAnswer: `${part} * ${d2} = ${total2}`, acceptedAnswers: makeMulEq(part, d2, total2) }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: part, defect: 'STOPPED_AT_INTERMEDIATE_PART' },
        { value: total1, defect: 'CONFUSED_WITH_FIRST_TOTAL' },
        { value: part * d1, defect: 'MULTIPLIED_BY_WRONG_DENOMINATOR' }
      ]);
    }
    solutionSteps = `Step 1: 1/${d1} of ${total1} = ${eqDiv.expected}.\\nStep 2: Since 1/${d2} of the new number is ${part}, the new number is ${part} * ${d2} = ${total2}.`;
    hint = `Find 1/${d1} of ${total1} first, then multiply that value by ${d2}!`;
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
