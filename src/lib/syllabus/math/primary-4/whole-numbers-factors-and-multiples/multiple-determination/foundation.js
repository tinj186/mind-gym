import { getRandomNames, getPackingAndShoppingItems } from '@/lib/utils/variable-bank.js';
import {
  ALL_MODEL_OPTIONS,
  getRandomInt,
  makeDivEq,
  makeMulEq,
  buildFourUniqueOptions,
  buildPromptPayload
} from '../common-factors/utils.js';

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
  const variant = activeVariant === 'foundation_default' ? 'foundation_direct_proof' : activeVariant;
  const names = getRandomNames(1);
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

  if (variant === 'foundation_direct_proof') {
    const subMode = ['single_tf', 'pick_which_is_multiple', 'which_divisor_for_one', 'all_one_none'][getRandomInt(0, 3)];

    if (subMode === 'single_tf') {
      const x = getRandomInt(2, 9);
      const isMultiple = Math.random() > 0.5;
      const q = getRandomInt(25, Math.floor(9990 / x));
      const rem = isMultiple ? 0 : getRandomInt(1, x - 1);
      const y = q * x + rem;

      answer = isMultiple ? 'Yes' : 'No';
      acceptedAnswers = isMultiple ? ['Yes', 'yes', 'True', 'true'] : ['No', 'no', 'False', 'false'];
      askText = `Is ${y} a multiple of ${x}?`;

      const eq = makeDivEq(y, x);
      if (isStructure) {
        inputRequirementObj = {
          inputType: 'MULTI_STEP_INPUT',
          steps: [
            { label: 'Write the working equation to test the division:', expectedAnswer: eq.expected, acceptedAnswers: [...eq.accepted, `${y} / ${x} = ${q} R ${rem}`] },
            { label: `Is the number a multiple of ${x}? (Type Yes or No):`, expectedAnswer: answer, acceptedAnswers }
          ]
        };
      } else if (isMCQ) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: isMultiple ? 'No' : 'Yes', defect: 'CONCEPTUAL_ERROR' },
          { value: 'Only if rounded', defect: 'MISUNDERSTOOD_MULTIPLE' },
          { value: 'Cannot be determined', defect: 'AVOIDED_DIVISION' }
        ]);
      }
      solutionSteps = `Step 1: Divide ${y} by ${x}: ${eq.expected}.\\nStep 2: ${isMultiple ? `The remainder is 0, so ${y} is a multiple of ${x}.` : `The remainder is ${rem} (not 0), so ${y} is not a multiple of ${x}.`}`;
      hint = `Divide ${y} by ${x}. If there is no remainder (remainder 0), then ${y} is a multiple of ${x}!`;

    } else if (subMode === 'pick_which_is_multiple') {
      const x = getRandomInt(3, 9);
      const q1 = getRandomInt(30, Math.floor(9900 / x));
      const q2 = getRandomInt(30, Math.floor(9900 / x));
      const multNum = q1 * x;
      const nonMultNum = q2 * x + getRandomInt(1, x - 1);
      const pair = Math.random() > 0.5 ? [multNum, nonMultNum] : [nonMultNum, multNum];

      answer = String(multNum);
      acceptedAnswers = [answer];
      askText = `Which of these two numbers is a multiple of ${x}: ${pair[0]} or ${pair[1]}?`;

      const eq1 = makeDivEq(multNum, x);
      const eq2 = makeDivEq(nonMultNum, x);
      if (isStructure) {
        inputRequirementObj = {
          inputType: 'MULTI_STEP_INPUT',
          steps: [
            { label: `Write the working equation to test ${pair[0]}:`, expectedAnswer: makeDivEq(pair[0], x).expected, acceptedAnswers: makeDivEq(pair[0], x).accepted },
            { label: `Write the working equation to test ${pair[1]}:`, expectedAnswer: makeDivEq(pair[1], x).expected, acceptedAnswers: makeDivEq(pair[1], x).accepted },
            { label: `Which number is a multiple of ${x}?`, expectedAnswer: answer, acceptedAnswers }
          ]
        };
      } else if (isMCQ) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: nonMultNum, defect: 'DIVISIBILITY_CHECK_ERROR' },
          { value: 'Both', defect: 'ASSUMED_BOTH_MULTIPLES' },
          { value: 'Neither', defect: 'MISSED_ZERO_REMAINDER' }
        ]);
      }
      solutionSteps = `Step 1: Divide ${multNum} by ${x}: ${eq1.expected} (remainder 0).\\nStep 2: Divide ${nonMultNum} by ${x}: ${eq2.expected} (has remainder).\\nStep 3: Therefore ${multNum} is a multiple of ${x}.`;
      hint = `Divide both ${pair[0]} and ${pair[1]} by ${x}. The one with 0 remainder is the multiple!`;

    } else if (subMode === 'which_divisor_for_one') {
      let xGood, xBad, y;
      do {
        xGood = getRandomInt(3, 9);
        xBad = getRandomInt(3, 9);
        const q = getRandomInt(30, Math.floor(9900 / xGood));
        y = q * xGood;
      } while (xGood === xBad || y % xBad === 0);

      const pair = Math.random() > 0.5 ? [xGood, xBad] : [xBad, xGood];
      answer = String(xGood);
      acceptedAnswers = [answer];
      askText = `${y} is a multiple of which of these two numbers: ${pair[0]} or ${pair[1]}?`;

      const eqGood = makeDivEq(y, xGood);
      const eqBad = makeDivEq(y, xBad);
      if (isStructure) {
        inputRequirementObj = {
          inputType: 'MULTI_STEP_INPUT',
          steps: [
            { label: `Write the working equation to test dividing ${y} by ${pair[0]}:`, expectedAnswer: makeDivEq(y, pair[0]).expected, acceptedAnswers: makeDivEq(y, pair[0]).accepted },
            { label: `Write the working equation to test dividing ${y} by ${pair[1]}:`, expectedAnswer: makeDivEq(y, pair[1]).expected, acceptedAnswers: makeDivEq(y, pair[1]).accepted },
            { label: `${y} is a multiple of which number?`, expectedAnswer: answer, acceptedAnswers }
          ]
        };
      } else if (isMCQ) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: xBad, defect: 'DIVISIBILITY_CHECK_ERROR' },
          { value: 'Both', defect: 'ASSUMED_BOTH_DIVIDE_EVENLY' },
          { value: 'Neither', defect: 'MISSED_ZERO_REMAINDER' }
        ]);
      }
      solutionSteps = `Step 1: ${eqGood.expected} (remainder 0).\\nStep 2: ${eqBad.expected} (has remainder).\\nStep 3: Therefore ${y} is a multiple of ${xGood}.`;
      hint = `Divide ${y} by ${pair[0]} and by ${pair[1]} to see which one divides evenly with 0 remainder!`;

    } else {
      // all_one_none
      const x = getRandomInt(3, 9);
      const outcome = ['All', 'One of them', 'None'][getRandomInt(0, 2)];
      const q1 = getRandomInt(30, Math.floor(9900 / x));
      let q2 = getRandomInt(30, Math.floor(9900 / x));
      if (q2 === q1) q2 = q1 + 1;

      let n1 = outcome === 'None' ? q1 * x + getRandomInt(1, x - 1) : q1 * x;
      let n2 = outcome === 'All' ? q2 * x : q2 * x + getRandomInt(1, x - 1);
      if (outcome === 'One of them' && Math.random() > 0.5) [n1, n2] = [n2, n1];

      answer = outcome;
      acceptedAnswers =
        outcome === 'All'
          ? ['All', 'all', 'Both', 'both']
          : outcome === 'One of them'
          ? ['One of them', 'one of them', 'One', 'one', 'Only one']
          : ['None', 'none', 'Neither', 'neither'];

      askText = `Are ${n1} and ${n2} multiples of ${x}? (Answer: All, One of them, or None)`;

      const eq1 = makeDivEq(n1, x);
      const eq2 = makeDivEq(n2, x);
      if (isStructure) {
        inputRequirementObj = {
          inputType: 'MULTI_STEP_INPUT',
          steps: [
            { label: `Write the working equation to test ${n1}:`, expectedAnswer: eq1.expected, acceptedAnswers: eq1.accepted },
            { label: `Write the working equation to test ${n2}:`, expectedAnswer: eq2.expected, acceptedAnswers: eq2.accepted },
            { label: `How many are multiples of ${x}? (Type All, One of them, or None):`, expectedAnswer: answer, acceptedAnswers }
          ]
        };
      } else if (isMCQ) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: outcome === 'All' ? 'One of them' : 'All', defect: 'PARTIAL_CHECK_ONLY' },
          { value: outcome === 'None' ? 'One of them' : 'None', defect: 'DIVISIBILITY_CHECK_ERROR' },
          { value: 'Cannot be determined', defect: 'AVOIDED_DIVISION' }
        ]);
      }
      solutionSteps = `Step 1: Test ${n1}: ${eq1.expected}.\\nStep 2: Test ${n2}: ${eq2.expected}.\\nStep 3: Answer is ${outcome}.`;
      hint = `Divide both ${n1} and ${n2} by ${x} to check whether both, only one, or neither leaves remainder 0.`;
    }

  } else if (variant === 'foundation_grouping_context') {
    const x = getRandomInt(3, 9);
    const isMultiple = Math.random() > 0.5;
    const q = getRandomInt(30, Math.floor(2500 / x));
    const rem = isMultiple ? 0 : getRandomInt(1, x - 1);
    const y = q * x + rem;

    const askLeftover = !isMultiple && !isStructure && Math.random() > 0.5;
    if (askLeftover) {
      answer = String(rem);
      acceptedAnswers = [answer, `${answer} ${item}`];
      askText = `STORY: A bakery packs ${y} ${item} into boxes of ${x}. Because ${y} is not a multiple of ${x}, there will be some ${item} left over.\n\nCRITICAL INSTRUCTION: Ask how many ${item} are left over after packing all possible full boxes of ${x}.`;
      if (isMCQ) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: x - rem, defect: 'FOUND_SHORTFALL_INSTEAD_OF_REMAINDER' },
          { value: q, defect: 'ANSWERED_NUMBER_OF_BOXES' },
          { value: rem + 1, defect: 'CARELESS_CALCULATION' }
        ]);
      }
    } else {
      answer = isMultiple ? 'Yes' : 'No';
      acceptedAnswers = isMultiple ? ['Yes', 'yes'] : ['No', 'no'];
      askText = `STORY: ${names[0]} wants to pack ${y} ${item} equally into boxes of ${x} with no leftovers. For this to work, ${y} must be a multiple of ${x}.\n\nCRITICAL INSTRUCTION: Ask whether ${y} is a multiple of ${x} so that all ${y} ${item} can be packed into boxes of ${x} with no leftovers (Yes or No).`;
      if (isMCQ) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: isMultiple ? 'No' : 'Yes', defect: 'CONCEPTUAL_ERROR' },
          { value: `${rem} left over`, defect: 'ANSWERED_REMAINDER_TEXT' },
          { value: `${q} boxes`, defect: 'ANSWERED_QUOTIENT' }
        ]);
      }
    }

    const eq = makeDivEq(y, x);
    if (isStructure) {
      const steps = [
        { label: `Write the working equation to test if ${y} is a multiple of ${x} (full boxes and leftovers):`, expectedAnswer: eq.expected, acceptedAnswers: eq.accepted },
        { label: `Is ${y} a multiple of ${x} with no leftovers? (Type Yes or No):`, expectedAnswer: isMultiple ? 'Yes' : 'No', acceptedAnswers: isMultiple ? ['Yes', 'yes'] : ['No', 'no'] }
      ];
      if (!isMultiple) {
        steps.push({ label: `Number of leftover ${item}:`, expectedAnswer: String(rem), acceptedAnswers: [String(rem)] });
      }
      answer = isMultiple ? 'Yes' : String(rem);
      acceptedAnswers = isMultiple ? ['Yes', 'yes'] : [String(rem)];

      const parts = [{ name: 'Full Boxes', value: '?', displayValue: '?' }];
      if (!isMultiple) {
        parts.push({ name: 'Leftover', value: '?', displayValue: '?', isShortfall: true });
      }

      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'PART_WHOLE_GROUPING_CHECK',
          correctModelType: 'PART_WHOLE',
          modelOptions: ALL_MODEL_OPTIONS,
          parts,
          whole: { label: `Total ${item}`, value: y, displayValue: String(y), isTarget: false },
          target: { type: 'PART', label: isMultiple ? 'Full Boxes' : 'Leftover' },
          steps
        }
      };
    }
    solutionSteps = `Step 1: Divide ${y} by ${x}: ${eq.expected}.\\nStep 2: ${isMultiple ? `The remainder is 0, so ${y} is a multiple of ${x} and all ${y} ${item} can be packed with no leftovers.` : `The remainder is ${rem}, so ${y} is not a multiple of ${x} and ${rem} ${item} are left over.`}`;
    hint = `To pack in boxes of ${x} with no leftovers, ${y} must be a multiple of ${x}. Divide ${y} by ${x} and check the remainder!`;

  } else if (variant === 'foundation_extrapolating_skip_count') {
    const x = getRandomInt(3, 9);
    const isMultiple = Math.random() > 0.5;
    const q = getRandomInt(15, 140);
    const rem = isMultiple ? 0 : getRandomInt(1, x - 1);
    const y = q * x + rem;

    answer = isMultiple ? 'Yes' : 'No';
    acceptedAnswers = isMultiple ? ['Yes', 'yes'] : ['No', 'no'];
    askText = `${names[0]} starts at 0 and skip-counts in steps of ${x}. Will ${names[0]} land exactly on ${y}?`;

    visualEngineObj = {
      componentToRender: 'NUMBER_LINE_ADVANCED',
      componentData: {
        min: 0,
        max: Math.ceil((y + x * 2) / 10) * 10,
        numIntervals: 5,
        markedValue: y,
        markedLabel: String(y)
      }
    };

    const eq = makeDivEq(y, x);
    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: 'Write the working equation to find how many steps it takes to reach or pass the number:', expectedAnswer: eq.expected, acceptedAnswers: eq.accepted },
          { label: 'Will you land exactly on the number? (Type Yes or No):', expectedAnswer: answer, acceptedAnswers }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: isMultiple ? 'No' : 'Yes', defect: 'CONCEPTUAL_ERROR' },
        { value: `Lands on ${y - rem}`, defect: 'ANSWERED_NEAREST_MULTIPLE' },
        { value: `Takes ${q} steps`, defect: 'ANSWERED_STEP_COUNT' }
      ]);
    }
    solutionSteps = `Step 1: Divide ${y} by step size ${x}: ${eq.expected}.\\nStep 2: ${isMultiple ? `Since the remainder is 0, skip-counting by ${x} lands on ${y} in ${q} steps.` : `Since there is a remainder of ${rem}, skip-counting by ${x} will not land exactly on ${y}.`}`;
    hint = `Skip-counting from 0 by ${x} lands on multiples of ${x}. Divide ${y} by ${x} to check!`;

  } else if (variant === 'foundation_outlier_selection') {
    const x = getRandomInt(3, 9);
    const askNotMultiple = Math.random() > 0.4;
    const baseQ = getRandomInt(20, 95);

    const makeMult = (offset) => (baseQ + offset) * x;
    const makeNonMult = (offset) => (baseQ + offset) * x + getRandomInt(1, x - 1);

    let targetNum, others;
    if (askNotMultiple) {
      targetNum = makeNonMult(1);
      others = [makeMult(0), makeMult(2), makeMult(3)];
      askText = `Which of the following numbers is NOT a multiple of ${x}? (${[targetNum, ...others].sort((a, b) => a - b).join(', ')})`;
    } else {
      targetNum = makeMult(2);
      others = [makeNonMult(0), makeNonMult(1), makeNonMult(3)];
      askText = `Which of the following numbers IS a multiple of ${x}? (${[targetNum, ...others].sort((a, b) => a - b).join(', ')})`;
    }

    answer = String(targetNum);
    acceptedAnswers = [answer];
    const eq = makeDivEq(targetNum, x);

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          {
            label: askNotMultiple
              ? 'Write the working equation for the number that leaves a remainder:'
              : 'Write the working equation for the number that divides evenly:',
            expectedAnswer: eq.expected,
            acceptedAnswers: eq.accepted
          },
          {
            label: askNotMultiple ? 'Which number is not a multiple?' : 'Which number is a multiple?',
            expectedAnswer: answer,
            acceptedAnswers
          }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: others[0], defect: 'DIVISIBILITY_CHECK_ERROR' },
        { value: others[1], defect: 'DIVISIBILITY_CHECK_ERROR' },
        { value: others[2], defect: 'DIVISIBILITY_CHECK_ERROR' }
      ]);
    }
    solutionSteps = `Step 1: Divide each candidate by ${x}.\\nStep 2: ${eq.expected}.\\nStep 3: Therefore ${targetNum} is ${askNotMultiple ? 'not ' : ''}a multiple of ${x}.`;
    hint = `Divide each number by ${x}. Multiples leave remainder 0; non-multiples leave a remainder.`;

  } else {
    // foundation_nearest_extrapolated_multiple
    const x = getRandomInt(3, 9);
    const nPool = [20, 30, 40, 50, 60, 80, 200, 300, 400, 500, 600, 800, 1000];
    const n = nPool[getRandomInt(0, nPool.length - 1)];
    const val = n * x;
    const findPosition = Math.random() > 0.5;

    if (findPosition) {
      answer = String(n);
      acceptedAnswers = [answer, n.toLocaleString(), `${n}th`];
      askText = `In the sequence of multiples of ${x}, what position is ${val}?`;

      visualEngineObj = {
        componentToRender: 'TABLE_PATTERN_VISUALIZER',
        componentData: {
          title: `Multiples of ${x}`,
          headers: ['Position', 'Multiple'],
          rows: [
            ['1', String(x)],
            ['2', String(x * 2)],
            ['3', String(x * 3)],
            ['?', String(val)]
          ]
        }
      };

      const eqDiv = makeDivEq(val, x);
      if (isStructure) {
        inputRequirementObj = {
          inputType: 'MULTI_STEP_INPUT',
          steps: [
            { label: 'Write the working equation to find the position of the multiple:', expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
            { label: 'Final Answer (Position):', expectedAnswer: answer, acceptedAnswers }
          ]
        };
      } else if (isMCQ) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: n / 10 >= 1 ? n / 10 : n + 10, defect: 'PLACE_VALUE_ZERO_ERROR' },
          { value: n * 10, defect: 'EXTRA_ZERO_ERROR' },
          { value: val * x, defect: 'MULTIPLIED_INSTEAD_OF_DIVIDED' }
        ]);
      }
      solutionSteps = `Step 1: Divide the multiple ${val} by ${x} to find its position: ${eqDiv.expected}.\\nStep 2: ${val} is the ${n}th multiple of ${x} (Position ${n}).`;
      hint = `Each multiple is Position × ${x}. Divide ${val} by ${x} to work backwards to the position!`;
    } else {
      answer = String(val);
      acceptedAnswers = [answer, val.toLocaleString()];
      askText = `What is the ${n}th multiple of ${x}?`;

      visualEngineObj = {
        componentToRender: 'TABLE_PATTERN_VISUALIZER',
        componentData: {
          title: `Multiples of ${x}`,
          headers: ['Position', 'Multiple'],
          rows: [
            ['1', String(x)],
            ['2', String(x * 2)],
            ['3', String(x * 3)],
            [String(n), '?']
          ]
        }
      };

      if (isStructure) {
        inputRequirementObj = {
          inputType: 'MULTI_STEP_INPUT',
          steps: [
            { label: 'Write the working equation to find the required multiple:', expectedAnswer: `${n} * ${x} = ${val}`, acceptedAnswers: makeMulEq(n, x, val) },
            { label: 'Final Answer:', expectedAnswer: answer, acceptedAnswers }
          ]
        };
      } else if (isMCQ) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: val / 10, defect: 'PLACE_VALUE_ZERO_ERROR' },
          { value: val * 10, defect: 'EXTRA_ZERO_ERROR' },
          { value: n + x, defect: 'ADDED_INSTEAD_OF_MULTIPLIED' }
        ]);
      }
      solutionSteps = `Step 1: The ${n}th multiple of ${x} is ${n} * ${x}.\\nStep 2: ${n} * ${x} = ${val}.`;
      hint = `Multiply the position (${n}) by ${x}!`;
    }
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
