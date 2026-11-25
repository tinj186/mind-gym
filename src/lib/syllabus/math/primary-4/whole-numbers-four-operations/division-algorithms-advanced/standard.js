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
  const variant = activeVariant === 'standard_default' ? 'standard_flawed_division_diagnosis' : activeVariant;
  const names = getRandomNames(4);
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

  if (variant === 'standard_flawed_division_diagnosis') {
    const divisor = getRandomInt(3, 8);
    const th = getRandomInt(1, Math.floor(9 / divisor));
    const t = getRandomInt(2, 9);
    const o = getRandomInt(2, 9);
    const correctQ = th * 1000 + t * 10 + o; // 0 in hundreds place!
    const wrongQ = th * 100 + t * 10 + o; // Dropped 0!
    const dividend = correctQ * divisor;
    const diff = correctQ - wrongQ;

    const askDiff = isStructure || Math.random() > 0.5;
    answer = String(askDiff ? diff : correctQ);
    acceptedAnswers = [answer, (askDiff ? diff : correctQ).toLocaleString()];

    askText = askDiff
      ? `${names[0]} solved ${dividend.toLocaleString()} ÷ ${divisor} and wrote ${wrongQ} as the quotient, forgetting the 0 placeholder in the hundreds place. Find the difference between the correct quotient and ${names[0]}'s wrong quotient.`
      : `${names[0]} solved ${dividend.toLocaleString()} ÷ ${divisor} and wrote ${wrongQ} as the quotient, forgetting the 0 placeholder in the hundreds place. What is the correct quotient?`;

    visualEngineObj = {
      componentToRender: 'LONG_DIVISION_GRID',
      componentData: {
        title: `Spot the Error: ${dividend.toLocaleString()} ÷ ${divisor}`,
        dividend,
        divisor,
        quotient: wrongQ,
        errorStepIndex: -2
      }
    };

    const eqDiv = makeDivEq(dividend, divisor);
    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: 'Write the working equation to find the correct quotient:', expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
          { label: 'Write the working equation to find the difference between the correct and wrong quotients:', expectedAnswer: `${correctQ} - ${wrongQ} = ${diff}`, acceptedAnswers: makeSubEq(correctQ, wrongQ, diff) }
        ]
      };
    } else if (isMCQ) {
      mcqData = askDiff
        ? buildFourUniqueOptions(answer, [
            { value: correctQ, defect: 'ANSWERED_CORRECT_QUOTIENT_INSTEAD' },
            { value: wrongQ, defect: 'ANSWERED_WRONG_QUOTIENT' },
            { value: 90, defect: 'PLACE_VALUE_ZERO_ERROR' }
          ])
        : buildFourUniqueOptions(answer, [
            { value: wrongQ, defect: 'REPEATED_DROPPED_ZERO_ERROR' },
            { value: th * 1000 + t * 100 + o, defect: 'MISPLACED_ZERO_IN_ONES_OR_TENS' },
            { value: correctQ + 100, defect: 'CARELESS_DIVISION' }
          ]);
    }
    solutionSteps = `Step 1: Correct quotient: ${dividend} / ${divisor} = ${correctQ} (there is a 0 in the hundreds place).\\n${askDiff ? `Step 2: Difference = ${correctQ} - ${wrongQ} = ${diff}.` : ''}`;
    hint = `Check the hundreds digit of ${dividend.toLocaleString()} ÷ ${divisor}—when it is smaller than ${divisor}, write 0 in the quotient!`;

  } else if (variant === 'standard_contextual_remainder_interpretation') {
    const divisor = getRandomInt(5, 9);
    const q = getRandomInt(180, Math.floor(8500 / divisor));
    const rem = getRandomInt(1, divisor - 1);
    const total = q * divisor + rem;
    const isRoundUp = isStructure || Math.random() > 0.45;
    const emptySlots = divisor - rem;

    const eqDiv = makeDivEq(total, divisor);

    if (isRoundUp) {
      const minBoxes = q + 1;
      const askEmptySlots = isStructure || Math.random() > 0.5;
      answer = String(askEmptySlots ? emptySlots : minBoxes);
      acceptedAnswers = [answer, (askEmptySlots ? emptySlots : minBoxes).toLocaleString()];

      askText = askEmptySlots
        ? `STORY: ${names[0]} packs ${total.toLocaleString()} ${item} into crates of ${divisor}, using the minimum number of crates so every ${item} is packed.\n\nCRITICAL INSTRUCTION: Ask how many more ${item} are needed to fill the last crate completely.`
        : `STORY: ${names[0]} packs ${total.toLocaleString()} ${item} into crates of ${divisor}.\n\nCRITICAL INSTRUCTION: Ask for the minimum number of crates needed to pack ALL ${total.toLocaleString()} ${item}.`;

      if (isStructure) {
        const steps = [
          { label: `Write the working equation to find the number of full crates and leftover ${item}:`, expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
          { label: 'Write the working equation to find the minimum number of crates needed:', expectedAnswer: `${q} + 1 = ${minBoxes}`, acceptedAnswers: [`${q} + 1 = ${minBoxes}`, `${q}+1=${minBoxes}`, `1 + ${q} = ${minBoxes}`, `1+${q}=${minBoxes}`] },
          { label: `Write the working equation to find how many more ${item} are needed to fill the last crate:`, expectedAnswer: `${divisor} - ${rem} = ${emptySlots}`, acceptedAnswers: makeSubEq(divisor, rem, emptySlots) }
        ];
        inputRequirementObj = {
          inputType: 'INTERACTIVE_BAR_BUILDER',
          steps,
          barBuilderConfig: {
            problemType: 'PART_WHOLE_CRATE_SHORTFALL',
            correctModelType: 'PART_WHOLE',
            modelOptions: ALL_MODEL_OPTIONS,
            parts: [
              { name: `Total ${item}`, value: total.toLocaleString(), displayValue: total.toLocaleString() },
              { name: 'Empty Slots in Last Crate', value: '?', displayValue: '?', isShortfall: true }
            ],
            whole: { label: 'Capacity of All Crates', value: '?', displayValue: '?', isTarget: true },
            target: { type: 'PART', label: 'Empty Slots in Last Crate' },
            steps
          }
        };
      } else if (isMCQ) {
        mcqData = askEmptySlots
          ? buildFourUniqueOptions(answer, [
              { value: rem, defect: 'ANSWERED_REMAINDER_INSTEAD_OF_EMPTY_SLOTS' },
              { value: minBoxes, defect: 'ANSWERED_CRATE_COUNT' },
              { value: emptySlots + 1, defect: 'CARELESS_SUBTRACTION' }
            ])
          : buildFourUniqueOptions(answer, [
              { value: q, defect: 'FORGOT_TO_ROUND_UP_FOR_LEFTOVER' },
              { value: rem, defect: 'ANSWERED_REMAINDER' },
              { value: q + 2, defect: 'CARELESS_DIVISION' }
            ]);
      }
      solutionSteps = `Step 1: Divide ${total} by ${divisor}: ${eqDiv.expected}.\\nStep 2: Minimum crates = ${q} + 1 = ${minBoxes}.\\n${askEmptySlots ? `Step 3: Empty slots in last crate = ${divisor} - ${rem} = ${emptySlots}.` : ''}`;
      hint = `Divide ${total.toLocaleString()} by ${divisor}. Since ${rem} ${item} are left over, you need 1 extra crate!`;
    } else {
      // Round Down: max full packets
      answer = String(q);
      acceptedAnswers = [answer, q.toLocaleString()];
      askText = `STORY: ${names[0]} has ${total.toLocaleString()} ${item} and packs them into full packets of ${divisor} to sell.\n\nCRITICAL INSTRUCTION: Ask for the maximum number of full packets ${names[0]} can sell.`;
      if (isMCQ) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: q + 1, defect: 'ROUNDED_UP_IN_ROUND_DOWN_CONTEXT' },
          { value: rem, defect: 'ANSWERED_REMAINDER' },
          { value: q - 1, defect: 'CARELESS_DIVISION' }
        ]);
      }
      solutionSteps = `Step 1: Divide ${total} by ${divisor}: ${eqDiv.expected}.\\nStep 2: Only complete packets of ${divisor} can be sold, so maximum full packets = ${q}.`;
      hint = `Divide ${total.toLocaleString()} by ${divisor}. Leftover items cannot form a full packet!`;
    }

  } else if (variant === 'standard_missing_digit_long_division') {
    const divisor = [3, 4, 5, 6, 7, 8, 9][getRandomInt(0, 6)];
    const q = getRandomInt(Math.ceil(1200 / divisor), Math.floor(9500 / divisor));
    const dividend = q * divisor;
    const divStr = String(dividend);
    const hundredsDigit = divStr[1];
    const maskedDividend = `${divStr[0]}?${divStr.slice(2)}`;

    answer = hundredsDigit;
    acceptedAnswers = [answer];
    askText = `In the exact division ${maskedDividend} ÷ ${divisor} = ${q.toLocaleString()}, what is the missing hundreds digit '?'?`;

    visualEngineObj = {
      componentToRender: 'LONG_DIVISION_GRID',
      componentData: {
        title: 'Missing Digit Cryptarithm',
        dividend: maskedDividend,
        divisor,
        quotient: q
      }
    };

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: 'Write the working equation to reconstruct the full dividend:', expectedAnswer: `${q} * ${divisor} = ${dividend}`, acceptedAnswers: makeMulEq(q, divisor, dividend) },
          { label: 'State the missing hundreds digit:', expectedAnswer: answer, acceptedAnswers }
        ]
      };
    } else if (isMCQ) {
      const hd = Number(hundredsDigit);
      mcqData = buildFourUniqueOptions(answer, [
        { value: (hd + 1) % 10, defect: 'CARRY_OVER_ERROR' },
        { value: hd > 0 ? hd - 1 : 2, defect: 'CARRY_OVER_ERROR' },
        { value: (hd + 2) % 10, defect: 'CARELESS_MULTIPLICATION' }
      ]);
    }
    solutionSteps = `Step 1: Multiply quotient by divisor: ${q} * ${divisor} = ${dividend}.\\nStep 2: Comparing with ${maskedDividend}, the missing hundreds digit is ${hundredsDigit}.`;
    hint = `Work backwards using Dividend = Quotient × Divisor (${q.toLocaleString()} × ${divisor})!`;

  } else if (variant === 'standard_total_difference_to_unit') {
    const use3Entities = isStructure || Math.random() > 0.4;
    const unitVal = getRandomInt(1120, 2650);

    if (use3Entities) {
      const diffB = getRandomInt(180, 450);
      const diffC = getRandomInt(180, 450);
      const valB = unitVal + diffB;
      const valC = unitVal + diffC;
      const total = unitVal + valB + valC;
      const sumDiffs = diffB + diffC;
      const threeUnits = total - sumDiffs;

      const askSmallest = isStructure || Math.random() > 0.4;
      const targetVal = askSmallest ? unitVal : valB;

      answer = String(targetVal);
      acceptedAnswers = [answer, targetVal.toLocaleString(), `${answer} ${item}`];
      askText = `STORY: ${names[0]}, ${names[1]}, and ${names[2]} have ${total.toLocaleString()} ${item} altogether. ${names[1]} has ${diffB} more ${item} than ${names[0]}, and ${names[2]} has ${diffC} more ${item} than ${names[0]}.\n\nCRITICAL INSTRUCTION: Ask how many ${item} ${askSmallest ? names[0] : names[1]} has.`;

      if (isStructure) {
        const eqDiv = makeDivEq(threeUnits, 3);
        const steps = [
          { label: 'Write the working equation to remove the extra amounts from the total:', expectedAnswer: `${total} - ${sumDiffs} = ${threeUnits}`, acceptedAnswers: makeSubEq(total, sumDiffs, threeUnits) },
          { label: `Write the working equation to find 1 unit (${names[0]}):`, expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted }
        ];
        inputRequirementObj = {
          inputType: 'INTERACTIVE_BAR_BUILDER',
          steps,
          barBuilderConfig: {
            problemType: 'COMPARISON_3_ENTITY_TOTAL_DIFF',
            correctModelType: 'COMPARISON',
            modelOptions: ALL_MODEL_OPTIONS,
            hasCombinedTotal: true,
            entities: [
              { id: 'A', name: names[0], value: '?', displayValue: '?', relation: 'BASE' },
              { id: 'B', name: names[1], value: '?', displayValue: '?', relativeTo: names[0], relation: 'MORE', diffValue: diffB, displayDiff: `+${diffB}` },
              { id: 'C', name: names[2], value: '?', displayValue: '?', relativeTo: names[0], relation: 'MORE', diffValue: diffC, displayDiff: `+${diffC}` }
            ],
            total: { label: 'Combined Total', value: total, displayValue: total.toLocaleString(), isTarget: false },
            target: { type: 'BAR', label: names[0] },
            steps
          }
        };
      } else if (isMCQ) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: askSmallest ? valB : unitVal, defect: 'WRONG_TARGET_ENTITY' },
          { value: Math.floor(total / 3), defect: 'FORGOT_TO_REMOVE_DIFFERENCES' },
          { value: targetVal + 100, defect: 'CARELESS_DIVISION' }
        ]);
      }
      solutionSteps = `Step 1: Remove extra differences: ${total} - (${diffB} + ${diffC}) = ${threeUnits}.\\nStep 2: 1 unit (${names[0]}) = ${threeUnits} / 3 = ${unitVal}.${!askSmallest ? `\\nStep 3: ${names[1]} = ${unitVal} + ${diffB} = ${valB}.` : ''}`;
      hint = `Subtract the extra amounts (${diffB} + ${diffC}) from ${total.toLocaleString()} first, then divide equally by 3!`;
    } else {
      const diffB = getRandomInt(240, 680);
      const valB = unitVal + diffB;
      const total = unitVal + valB;

      answer = String(unitVal);
      acceptedAnswers = [answer, unitVal.toLocaleString(), `${answer} ${item}`];
      askText = `STORY: ${names[0]} and ${names[1]} have ${total.toLocaleString()} ${item} altogether. ${names[1]} has ${diffB} more ${item} than ${names[0]}.\n\nCRITICAL INSTRUCTION: Ask how many ${item} ${names[0]} has.`;
      if (isMCQ) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: valB, defect: 'ANSWERED_LARGER_ENTITY' },
          { value: Math.floor(total / 2), defect: 'IGNORED_DIFFERENCE' },
          { value: total - diffB, defect: 'FORGOT_TO_DIVIDE_BY_2' }
        ]);
      }
      solutionSteps = `Step 1: Remove difference: ${total} - ${diffB} = ${total - diffB}.\\nStep 2: Divide by 2: ${total - diffB} / 2 = ${unitVal}.`;
      hint = `Subtract ${diffB} from ${total.toLocaleString()} first, then divide by 2!`;
    }

  } else {
    // standard_equalizing_redistribution
    const equalShare = getRandomInt(1850, 2950);
    const d1 = getRandomInt(220, 580);
    const d2 = getRandomInt(180, 480);
    const valA = equalShare + d1 + d2;
    const valB = equalShare - d1;
    const valC = equalShare - d2;
    const total = valA + valB + valC;

    const askChange = isStructure || Math.random() > 0.5;
    answer = String(askChange ? d1 + d2 : equalShare);
    acceptedAnswers = [answer, (askChange ? d1 + d2 : equalShare).toLocaleString(), `${answer} ${item}`];

    askText = askChange
      ? `STORY: ${names[0]} has ${valA.toLocaleString()} ${item}, ${names[1]} has ${valB.toLocaleString()} ${item}, and ${names[2]} has ${valC.toLocaleString()} ${item}. They pool all their ${item} together and share them equally among the 3 of them.\n\nCRITICAL INSTRUCTION: Ask how many ${item} ${names[0]} gave away altogether.`
      : `STORY: ${names[0]} has ${valA.toLocaleString()} ${item}, ${names[1]} has ${valB.toLocaleString()} ${item}, and ${names[2]} has ${valC.toLocaleString()} ${item}. They pool all their ${item} together and share them equally.\n\nCRITICAL INSTRUCTION: Ask how many ${item} each person receives.`;

    const eqDiv = makeDivEq(total, 3);
    if (isStructure) {
      const steps = [
        { label: 'Write the working equation to find the combined total:', expectedAnswer: `${valA} + ${valB} + ${valC} = ${total}`, acceptedAnswers: [`${valA} + ${valB} + ${valC} = ${total}`, `${valA}+${valB}+${valC}=${total}`] },
        { label: "Write the working equation to find each person's equal share:", expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
        { label: `Write the working equation to find how much ${names[0]} gave away:`, expectedAnswer: `${valA} - ${equalShare} = ${d1 + d2}`, acceptedAnswers: makeSubEq(valA, equalShare, d1 + d2) }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'BEFORE_AFTER_EQUALIZING_POOL',
          correctModelType: 'BEFORE_AFTER',
          modelOptions: ALL_MODEL_OPTIONS,
          entities: [
            { id: 'A', name: names[0], value: valA, displayValue: valA.toLocaleString() },
            { id: 'B', name: names[1], value: valB, displayValue: valB.toLocaleString() },
            { id: 'C', name: names[2], value: valC, displayValue: valC.toLocaleString() }
          ],
          target: { type: 'DIFFERENCE', label: `${names[0]} Gave Away` },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: askChange ? equalShare : d1 + d2, defect: 'CONFUSED_SHARE_AND_CHANGE' },
        { value: total, defect: 'STOPPED_AT_COMBINED_TOTAL' },
        { value: Number(answer) + 100, defect: 'CARELESS_CALCULATION' }
      ]);
    }
    solutionSteps = `Step 1: Combined total = ${valA} + ${valB} + ${valC} = ${total}.\\nStep 2: Equal share = ${total} / 3 = ${equalShare}.\\n${askChange ? `Step 3: ${names[0]} gave away ${valA} - ${equalShare} = ${d1 + d2}.` : ''}`;
    hint = `Add all three amounts together first, then divide by 3 to find each person's equal share!`;
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
