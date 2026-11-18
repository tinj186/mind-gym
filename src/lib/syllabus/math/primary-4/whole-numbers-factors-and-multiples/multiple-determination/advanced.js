import { getRandomNames, getPackingAndShoppingItems } from '@/lib/utils/variable-bank.js';
import {
  ALL_MODEL_OPTIONS,
  getRandomInt,
  makeDivEq,
  makeSubEq,
  makeMulEq,
  buildFourUniqueOptions,
  buildPromptPayload
} from '../common-factors/utils.js';

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
  const variant = activeVariant === 'advanced_default' ? 'advanced_shared_remainder_dual_constraint' : activeVariant;
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

  if (variant === 'advanced_shared_remainder_dual_constraint') {
    const validCases = [];
    for (const x of [4, 5, 6, 7, 8, 9]) {
      for (const y of [3, 4, 5, 6, 7, 8, 9]) {
        if (x === y) continue;
        for (let r = 1; r < x; r++) {
          const low = 30;
          const high = low + x * 6;
          const matches = [];
          const remList = [];
          for (let n = low; n <= high; n++) {
            if (n % x === r) {
              remList.push(n);
              if (n % y === 0) matches.push(n);
            }
          }
          if (matches.length === 1 && remList.length >= 4) {
            validCases.push({ low, high, x, y, r, remList, ans: matches[0] });
          }
        }
      }
    }
    const c = validCases[getRandomInt(0, validCases.length - 1)];

    answer = String(c.ans);
    acceptedAnswers = [answer];
    askText = `A mystery number is between ${c.low} and ${c.high}. When divided by ${c.x}, it leaves a remainder of ${c.r}. It is also a multiple of ${c.y}. What is the mystery number?`;

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          {
            label: `List the numbers between ${c.low} and ${c.high} that leave a remainder of ${c.r} when divided by ${c.x}:`,
            expectedAnswer: c.remList.join(', '),
            acceptedAnswers: [c.remList.join(', '), c.remList.join(','), c.remList.join(' ')]
          },
          {
            label: `Which of these numbers is a multiple of ${c.y}?`,
            expectedAnswer: answer,
            acceptedAnswers
          }
        ]
      };
    } else if (isMCQ) {
      const otherRem = c.remList.filter((v) => v !== c.ans);
      const multY = c.ans + c.y <= c.high ? c.ans + c.y : c.ans - c.y;
      mcqData = buildFourUniqueOptions(answer, [
        { value: otherRem[0] || c.ans + c.x, defect: 'IGNORED_MULTIPLE_CONDITION' },
        { value: otherRem[1] || c.ans - c.x, defect: 'IGNORED_MULTIPLE_CONDITION' },
        { value: multY, defect: 'IGNORED_REMAINDER_CONDITION' }
      ]);
    }
    solutionSteps = `Step 1: Numbers between ${c.low} and ${c.high} leaving remainder ${c.r} when divided by ${c.x}: ${c.remList.join(', ')}.\\nStep 2: Check which one is a multiple of ${c.y}: ${c.ans}.`;
    hint = `First list numbers in the range that give remainder ${c.r} when divided by ${c.x}, then pick the multiple of ${c.y}!`;

  } else if (variant === 'advanced_multiplicative_difference_transfer') {
    const isMultiple = Math.random() > 0.5;
    const newB = getRandomInt(12, 35);
    const k = getRandomInt(2, 4);
    const newA = isMultiple ? newB * k : newB * k + getRandomInt(2, Math.max(3, newB - 2));
    const transfer = getRandomInt(5, 18);
    const initA = newA + transfer;
    const initB = newB - transfer > 4 ? newB - transfer : newB + transfer;
    const actualTransfer = newB > initB ? newB - initB : transfer;
    const actualInitA = newA + actualTransfer;
    const actualInitB = newB - actualTransfer;

    answer = isMultiple ? 'Yes' : 'No';
    acceptedAnswers = isMultiple ? ['Yes', 'yes'] : ['No', 'no'];
    askText = `STORY: ${names[0]} has ${actualInitA} ${item} and ${names[1]} has ${actualInitB} ${item}. ${names[0]} gives ${actualTransfer} ${item} to ${names[1]}.\n\nCRITICAL INSTRUCTION: Ask whether ${names[0]}'s new amount is a multiple of ${names[1]}'s new amount (Yes or No).`;

    const eqDiv = makeDivEq(newA, newB);
    if (isStructure) {
      const steps = [
        { label: `Write the working equation to find ${names[0]}'s new amount:`, expectedAnswer: `${actualInitA} - ${actualTransfer} = ${newA}`, acceptedAnswers: makeSubEq(actualInitA, actualTransfer, newA) },
        { label: `Write the working equation to find ${names[1]}'s new amount:`, expectedAnswer: `${actualInitB} + ${actualTransfer} = ${newB}`, acceptedAnswers: [`${actualInitB} + ${actualTransfer} = ${newB}`, `${actualInitB}+${actualTransfer}=${newB}`, String(newB)] },
        { label: `Write the working equation to test if ${newA} is a multiple of ${newB}:`, expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
        { label: 'Is it a multiple? (Type Yes or No):', expectedAnswer: answer, acceptedAnswers }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'BEFORE_AFTER_TRANSFER_MULTIPLE',
          correctModelType: 'BEFORE_AFTER',
          modelOptions: ALL_MODEL_OPTIONS,
          entities: [
            { id: 'A', name: names[0], value: actualInitA, displayValue: String(actualInitA) },
            { id: 'B', name: names[1], value: actualInitB, displayValue: String(actualInitB) }
          ],
          transfer: { from: names[0], to: names[1], amount: actualTransfer },
          target: { type: 'BAR', label: `${names[0]} after transfer` },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: isMultiple ? 'No' : 'Yes', defect: 'CONCEPTUAL_ERROR' },
        { value: `Difference is ${Math.abs(newA - newB)}`, defect: 'SUBTRACTED_INSTEAD_OF_DIVIDED' },
        { value: `${actualInitA % actualInitB === 0 ? 'Yes (before)' : 'No (before)'}`, defect: 'CHECKED_BEFORE_TRANSFER' }
      ]);
    }
    solutionSteps = `Step 1: ${names[0]}'s new amount = ${actualInitA} - ${actualTransfer} = ${newA}.\\nStep 2: ${names[1]}'s new amount = ${actualInitB} + ${actualTransfer} = ${newB}.\\nStep 3: Divide ${newA} by ${newB}: ${eqDiv.expected}. Therefore ${answer}.`;
    hint = `Find both new amounts after the transfer first, then divide ${names[0]}'s new amount by ${names[1]}'s new amount!`;

  } else if (variant === 'advanced_target_leftover_deduction') {
    const x = getRandomInt(4, 9);
    const q = getRandomInt(35, 180);
    const r = getRandomInt(1, x - 1);
    const multBase = q * x;
    const total = multBase + r;

    answer = String(total);
    acceptedAnswers = [answer, `${answer} ${item}`];
    askText = `STORY: ${names[0]} packed some ${item} into boxes of ${x}. ${names[0]} filled ${q} boxes and had ${r} ${item} left over.\n\nCRITICAL INSTRUCTION: Ask how many ${item} ${names[0]} had at first.`;

    if (isStructure) {
      const steps = [
        { label: 'Write the working equation to find the total in the full boxes (the multiple):', expectedAnswer: `${q} * ${x} = ${multBase}`, acceptedAnswers: makeMulEq(q, x, multBase) },
        { label: 'Write the working equation to add the remainder to find the total:', expectedAnswer: `${multBase} + ${r} = ${total}`, acceptedAnswers: [`${multBase} + ${r} = ${total}`, `${multBase}+${r}=${total}`, `${r} + ${multBase} = ${total}`, `${r}+${multBase}=${total}`] },
        { label: 'Final Answer:', expectedAnswer: answer, acceptedAnswers }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'PART_WHOLE_RECONSTRUCT_TOTAL',
          correctModelType: 'PART_WHOLE',
          modelOptions: ALL_MODEL_OPTIONS,
          parts: [
            { name: `${q} Full Boxes of ${x}`, value: '?', displayValue: '?' },
            { name: 'Leftover', value: String(r), displayValue: String(r), isShortfall: true }
          ],
          whole: { label: `Total ${item}`, value: '?', displayValue: '?', isTarget: true },
          target: { type: 'WHOLE', label: `Total ${item}` },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: multBase, defect: 'FORGOT_TO_ADD_REMAINDER' },
        { value: multBase - r, defect: 'SUBTRACTED_REMAINDER' },
        { value: q * (x + r), defect: 'ADDED_REMAINDER_TO_BOX_SIZE' }
      ]);
    }
    solutionSteps = `Step 1: Total in full boxes = ${q} * ${x} = ${multBase}.\\nStep 2: Add the leftover ${r}: ${multBase} + ${r} = ${total}.`;
    hint = `Multiply the number of full boxes (${q}) by ${x} first, then add the ${r} leftover ${item}!`;

  } else if (variant === 'advanced_divisibility_calculated_area') {
    const x = getRandomInt(3, 6);
    const fitsPerfectly = Math.random() > 0.65;
    const len = x * getRandomInt(4, 8);
    let wid;
    if (fitsPerfectly) {
      wid = x * getRandomInt(3, 6);
    } else {
      // Choose width so area (len * wid) IS a multiple of x*x, yet wid is NOT a multiple of x (true area-trap!)
      wid = x * getRandomInt(3, 6) + (x % 2 === 0 ? x / 2 : 1);
      if (wid % x === 0) wid += 1;
    }

    answer = fitsPerfectly ? 'Yes' : 'No';
    acceptedAnswers = fitsPerfectly ? ['Yes', 'yes'] : ['No', 'no'];
    askText = `A rectangular room is ${len} m long and ${wid} m wide. We want to cover it completely with square mats of side length ${x} m. Can the room be covered perfectly without cutting any mats?`;

    visualEngineObj = {
      componentToRender: 'GRID_ARRAY_VISUALIZER',
      componentData: {
        rows: Math.min(wid, 12),
        columns: Math.min(len, 15),
        title: `Room (${len} m by ${wid} m) with ${x} m × ${x} m mats`,
        rowLabel: `${wid} m`,
        colLabel: `${len} m`,
        itemShape: 'square',
        showTotal: false,
        showEquation: false
      }
    };

    const eqL = makeDivEq(len, x);
    const eqW = makeDivEq(wid, x);
    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: `Write the working equation to test if the length (${len}) is a multiple of ${x}:`, expectedAnswer: eqL.expected, acceptedAnswers: eqL.accepted },
          { label: `Write the working equation to test if the width (${wid}) is a multiple of ${x}:`, expectedAnswer: eqW.expected, acceptedAnswers: eqW.accepted },
          { label: 'Can the room be covered perfectly without cutting mats? (Yes or No):', expectedAnswer: answer, acceptedAnswers }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: fitsPerfectly ? 'No' : 'Yes', defect: 'CHECKED_AREA_INSTEAD_OF_BOTH_SIDES' },
        { value: 'Only along the length', defect: 'PARTIAL_SIDE_CHECK' },
        { value: 'Only if rotated', defect: 'SPATIAL_MISCONCEPTION' }
      ]);
    }
    solutionSteps = `Step 1: Test length: ${eqL.expected}.\\nStep 2: Test width: ${eqW.expected}.\\nStep 3: ${fitsPerfectly ? `Both length and width are multiples of ${x}, so Yes.` : `Width ${wid} is not a multiple of ${x}, so mats would need to be cut. Answer: No.`}`;
    hint = `Don't just check total area! BOTH the length (${len} m) AND the width (${wid} m) must be multiples of ${x} m.`;

  } else {
    // advanced_unknown_multiplier_shift
    const x = getRandomInt(4, 9);
    const kA = getRandomInt(3, 10);
    const kB = getRandomInt(4, 15);
    const numA = kA * x;
    const numB = kB * x;
    const total = numA + numB;

    answer = String(kB);
    acceptedAnswers = [answer, `${kB}th`, `${kB}th multiple`];
    askText = `Number A is a multiple of ${x}. Number B is also a multiple of ${x}. Their sum is ${total}. If Number A is ${numA}, which multiple of ${x} is Number B? (Enter the multiplier number, e.g. 10 for the 10th multiple.)`;

    const eqDiv = makeDivEq(numB, x);
    if (isStructure) {
      const steps = [
        { label: 'Write the working equation to find Number B:', expectedAnswer: `${total} - ${numA} = ${numB}`, acceptedAnswers: makeSubEq(total, numA, numB) },
        { label: `Write the working equation to find which multiple of ${x} Number B is:`, expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
        { label: `Final Answer (Number B is the ____-th multiple of ${x}):`, expectedAnswer: answer, acceptedAnswers }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'PART_WHOLE_UNKNOWN_MULTIPLIER',
          correctModelType: 'PART_WHOLE',
          modelOptions: ALL_MODEL_OPTIONS,
          parts: [
            { name: 'Number A', value: String(numA), displayValue: String(numA) },
            { name: 'Number B', value: '?', displayValue: '?' }
          ],
          whole: { label: 'Sum (Total)', value: total, displayValue: String(total), isTarget: false },
          target: { type: 'PART', label: 'Number B' },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: numB, defect: 'ANSWERED_NUMBER_B_INSTEAD_OF_MULTIPLIER' },
        { value: kA + kB, defect: 'DIVIDED_TOTAL_INSTEAD_OF_B' },
        { value: kB + 1, defect: 'CARELESS_CALCULATION' }
      ]);
    }
    solutionSteps = `Step 1: Find Number B = ${total} - ${numA} = ${numB}.\\nStep 2: Divide Number B by ${x}: ${eqDiv.expected}.\\nStep 3: Number B is the ${kB}th multiple of ${x}.`;
    hint = `Subtract ${numA} from ${total} to find Number B, then divide Number B by ${x}!`;
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
