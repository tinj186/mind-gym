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

const CYCLE_ITEMS = [
  { label: 'Red', color: 'red', shape: 'circle' },
  { label: 'Blue', color: 'blue', shape: 'square' },
  { label: 'Green', color: 'green', shape: 'triangle' },
  { label: 'Yellow', color: 'yellow', shape: 'star' },
  { label: 'Purple', color: 'purple', shape: 'diamond' },
  { label: 'Orange', color: 'orange', shape: 'circle' }
];

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
  const variant = activeVariant === 'standard_default' ? 'standard_adjusting_up_shortfall' : activeVariant;

  let askText = '';
  let answer = '';
  let acceptedAnswers = [];
  let mcqData = null;
  let solutionSteps = '';
  let hint = '';
  let visualEngineObj = { componentToRender: 'NONE', componentData: { hideVisual: true } };
  let inputRequirementObj = null;

  if (variant === 'standard_adjusting_up_shortfall' || variant === 'standard_adjusting_down_remainder') {
    const isAdjustUp = variant === 'standard_adjusting_down_remainder' ? false : Math.random() > 0.5;
    const x = getRandomInt(4, 9);
    const q = getRandomInt(25, 140);
    const rem = getRandomInt(1, x - 1);
    const y = q * x + rem;
    const addAmt = x - rem;
    const eqDiv = makeDivEq(y, x);

    if (isAdjustUp) {
      answer = String(addAmt);
      acceptedAnswers = [answer];
      askText = `What is the smallest whole number you must add to ${y} to make it a multiple of ${x}?`;

      if (isStructure) {
        const steps = [
          { label: 'Write the working equation to find the remainder:', expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
          { label: `Write the working equation to find how much more is needed to complete the next group of ${x}:`, expectedAnswer: `${x} - ${rem} = ${addAmt}`, acceptedAnswers: makeSubEq(x, rem, addAmt) },
          { label: 'Final Answer:', expectedAnswer: answer, acceptedAnswers }
        ];
        inputRequirementObj = {
          inputType: 'INTERACTIVE_BAR_BUILDER',
          steps,
          barBuilderConfig: {
            problemType: 'PART_WHOLE_SHORTFALL_UP',
            correctModelType: 'PART_WHOLE',
            modelOptions: ALL_MODEL_OPTIONS,
            parts: [
              { name: 'Starting Number', value: String(y), displayValue: String(y) },
              { name: 'Amount to Add', value: '?', displayValue: '?', isShortfall: true }
            ],
            whole: { label: `Next Multiple of ${x}`, value: '?', displayValue: '?', isTarget: true },
            target: { type: 'PART', label: 'Amount to Add' },
            steps
          }
        };
      } else if (isMCQ) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: rem, defect: 'ANSWERED_REMAINDER_INSTEAD_OF_SHORTFALL' },
          { value: addAmt + 1, defect: 'CARELESS_CALCULATION' },
          { value: x, defect: 'ANSWERED_DIVISOR' }
        ]);
      }
      solutionSteps = `Step 1: Divide ${y} by ${x}: ${eqDiv.expected}.\\nStep 2: Subtract the remainder from ${x} to complete the next multiple: ${x} - ${rem} = ${addAmt}.`;
      hint = `Divide ${y} by ${x} to find the remainder, then find how many more you need to reach ${x}!`;
    } else {
      answer = String(rem);
      acceptedAnswers = [answer];
      askText = `What is the smallest whole number you must subtract from ${y} to make it a multiple of ${x}?`;

      if (isStructure) {
        const steps = [
          { label: 'Write the working equation to find the leftover remainder:', expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
          { label: 'Amount to subtract:', expectedAnswer: answer, acceptedAnswers }
        ];
        inputRequirementObj = {
          inputType: 'INTERACTIVE_BAR_BUILDER',
          steps,
          barBuilderConfig: {
            problemType: 'PART_WHOLE_REMAINDER_DOWN',
            correctModelType: 'PART_WHOLE',
            modelOptions: ALL_MODEL_OPTIONS,
            parts: [
              { name: `Multiple of ${x}`, value: '?', displayValue: '?' },
              { name: 'Remainder to Remove', value: '?', displayValue: '?', isShortfall: true }
            ],
            whole: { label: 'Starting Number', value: y, displayValue: String(y), isTarget: false },
            target: { type: 'PART', label: 'Remainder to Remove' },
            steps
          }
        };
      } else if (isMCQ) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: addAmt, defect: 'FOUND_SHORTFALL_INSTEAD_OF_REMAINDER' },
          { value: rem + 1, defect: 'CARELESS_CALCULATION' },
          { value: q, defect: 'ANSWERED_QUOTIENT' }
        ]);
      }
      solutionSteps = `Step 1: Divide ${y} by ${x}: ${eqDiv.expected}.\\nStep 2: Removing the remainder ${rem} leaves ${q * x}, which is a multiple of ${x}.`;
      hint = `Divide ${y} by ${x}. The remainder is the exact amount you need to subtract!`;
    }

  } else if (variant === 'standard_bounded_multiple_finder') {
    const x = getRandomInt(6, 9);
    const askCount = Math.random() > 0.65;
    const count = askCount ? getRandomInt(2, 6) : getRandomInt(1, 3);
    const k = getRandomInt(12, 45);
    const multiples = Array.from({ length: count }, (_, idx) => (k + idx) * x);
    const firstMult = multiples[0];
    const lastMult = multiples[multiples.length - 1];
    const lowOffset = getRandomInt(1, x - 2);
    const highOffset = getRandomInt(1, x - 2);
    const boundA = firstMult - lowOffset;
    const boundB = lastMult + highOffset;

    if (askCount) {
      answer = String(count);
      acceptedAnswers = [answer];
      askText = `How many multiples of ${x} are strictly between ${boundA} and ${boundB}?`;
    } else {
      answer = multiples.join(', ');
      acceptedAnswers = count === 1
        ? [answer]
        : [...new Set([multiples.join(', '), multiples.join(','), multiples.join(' ')])];
      askText = count === 1
        ? `Find a multiple of ${x} that is strictly between ${boundA} and ${boundB}.`
        : `List all the multiples of ${x} that are strictly between ${boundA} and ${boundB}.`;
    }

    visualEngineObj = {
      componentToRender: 'NUMBER_LINE_ADVANCED',
      componentData: {
        min: boundA,
        max: boundB,
        numIntervals: Math.min(20, boundB - boundA),
        ...(!askCount && count === 1 ? { markedValue: firstMult, markedLabel: '?' } : {})
      }
    };

    const eqDiv = makeDivEq(boundA, x);
    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: !askCount && count === 1
          ? [
              { label: 'Write the working equation to find the nearest multiple below or inside the bounds:', expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
              {
                label: 'Write the working equation to find the correct multiple inside the bounds:',
                expectedAnswer: `${k} * ${x} = ${firstMult}`,
                acceptedAnswers: [...makeMulEq(k, x, firstMult), `${boundA} - ${boundA % x} + ${x} = ${firstMult}`, `${boundA} + ${x - (boundA % x)} = ${firstMult}`]
              }
            ]
          : [
              { label: 'Write the working equation to find the nearest multiple below the lower bound:', expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
              {
                label: `Write the working equation to find the first multiple of ${x} inside the bounds:`,
                expectedAnswer: `${k} * ${x} = ${firstMult}`,
                acceptedAnswers: [...makeMulEq(k, x, firstMult), `${boundA} - ${boundA % x} + ${x} = ${firstMult}`, `${boundA} + ${x - (boundA % x)} = ${firstMult}`]
              },
              {
                label: askCount
                  ? `Final Answer (How many multiples of ${x} are strictly between ${boundA} and ${boundB}?):`
                  : `Final Answer (List all multiples of ${x} strictly between ${boundA} and ${boundB}):`,
                expectedAnswer: answer,
                acceptedAnswers
              }
            ]
      };
    } else if (isMCQ) {
      if (askCount) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: count - 1, defect: 'MISSED_BOUNDARY_MULTIPLE' },
          { value: count + 1, defect: 'COUNTED_OUT_OF_BOUNDS_MULTIPLE' },
          { value: count + 2, defect: 'CARELESS_COUNTING' }
        ]);
      } else if (count === 1) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: firstMult - x, defect: 'BELOW_LOWER_BOUND' },
          { value: firstMult + x, defect: 'ABOVE_UPPER_BOUND' },
          { value: firstMult + 1, defect: 'NOT_A_MULTIPLE' }
        ]);
      } else {
        mcqData = buildFourUniqueOptions(answer, [
          { value: multiples.slice(0, -1).join(', '), defect: 'MISSED_UPPER_MULTIPLE' },
          { value: [...multiples, lastMult + x].join(', '), defect: 'INCLUDED_OUT_OF_BOUNDS' },
          { value: [firstMult - x, ...multiples].join(', '), defect: 'INCLUDED_OUT_OF_BOUNDS' }
        ]);
      }
    }
    solutionSteps = askCount
      ? `Step 1: Divide ${boundA} by ${x}: ${eqDiv.expected}.\\nStep 2: First multiple above ${boundA} is ${k} * ${x} = ${firstMult}.\\nStep 3: Multiples strictly between ${boundA} and ${boundB} are ${multiples.join(', ')}, which is ${count} multiples.`
      : count === 1
      ? `Step 1: Divide ${boundA} by ${x}: ${eqDiv.expected}.\\nStep 2: The next multiple is ${k} * ${x} = ${firstMult}, which lies between ${boundA} and ${boundB}.`
      : `Step 1: Divide ${boundA} by ${x}: ${eqDiv.expected}.\\nStep 2: The first multiple above ${boundA} is ${k} * ${x} = ${firstMult}.\\nStep 3: Add ${x} repeatedly while staying below ${boundB}: ${answer}.`;
    hint = `Divide ${boundA} by ${x} to find the nearest multiple, then step up by ${x} until you pass ${boundB}!`;

  } else if (variant === 'standard_repeating_cycle_heuristic') {
    const cycleLen = getRandomInt(3, 6);
    const cycle = [...CYCLE_ITEMS].sort(() => Math.random() - 0.5).slice(0, cycleLen);
    const n = getRandomInt(45, 2500);
    const rem = n % cycleLen;
    const posIndex = rem === 0 ? cycleLen - 1 : rem - 1;
    const targetItem = cycle[posIndex];

    answer = targetItem.label;
    acceptedAnswers = [answer, answer.toLowerCase()];
    const cycleDesc = cycle.map((c) => c.label).join(', ');
    askText = `Objects are arranged in a repeating pattern: ${cycleDesc}, ${cycleDesc}, ... What is the ${n}th object in the pattern?`;

    visualEngineObj = {
      componentToRender: 'REPEATING_PATTERN_VISUALIZER',
      componentData: {
        title: 'Repeating Cycle Pattern',
        cycle,
        targetPosition: n,
        showCycles: 2
      }
    };

    const eqDiv = makeDivEq(n, cycleLen);
    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: 'Write the working equation to find how many full cycles there are and the remainder:', expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
          { label: 'Final Answer (Position in the cycle based on remainder):', expectedAnswer: answer, acceptedAnswers }
        ]
      };
    } else if (isMCQ) {
      const wrong1 = cycle[(posIndex + 1) % cycleLen].label;
      const wrong2 = cycle[(posIndex + 2) % cycleLen].label;
      const wrong3 = cycle[(posIndex + cycleLen - 1) % cycleLen]?.label || cycle[0].label;
      mcqData = buildFourUniqueOptions(answer, [
        { value: wrong1, defect: 'OFF_BY_ONE_REMAINDER' },
        { value: wrong2, defect: 'MISREAD_CYCLE_POSITION' },
        { value: wrong3, defect: 'CONFUSED_ZERO_REMAINDER' }
      ]);
    }
    solutionSteps = `Step 1: Divide ${n} by the cycle length ${cycleLen}: ${eqDiv.expected}.\\nStep 2: ${rem === 0 ? `Remainder 0 means the ${n}th object is the last item in the cycle: ${answer}.` : `Remainder ${rem} means the ${n}th object is the ${rem}${rem === 1 ? 'st' : rem === 2 ? 'nd' : rem === 3 ? 'rd' : 'th'} item in the cycle: ${answer}.`}`;
    hint = `Divide ${n} by ${cycleLen}. Remainder 1 is the 1st item, remainder 2 is the 2nd item, and remainder 0 is the last item!`;

  } else if (variant === 'standard_dual_grouping_test') {
    const names = getRandomNames(1);
    const items = getPackingAndShoppingItems(1);
    const item = items[0].item;

    let xGood, xBad, qGood, y;
    do {
      xGood = getRandomInt(3, 9);
      xBad = getRandomInt(3, 9);
      qGood = getRandomInt(15, 250);
      y = qGood * xGood;
    } while (xGood === xBad || y % xBad === 0);

    const [x1, x2] = Math.random() > 0.5 ? [xGood, xBad] : [xBad, xGood];
    const eq1 = makeDivEq(y, x1);
    const eq2 = makeDivEq(y, x2);
    const eqGood = makeDivEq(y, xGood);
    const eqBad = makeDivEq(y, xBad);

    answer = String(xGood);
    acceptedAnswers = [answer, `boxes of ${xGood}`, `${xGood} per box`];
    askText = `STORY: ${names[0]} has ${y} ${item}. ${names[0]} wants to pack them equally into boxes of ${x1} or boxes of ${x2} without any leftovers (meaning ${y} must be a multiple of the box size).\n\nCRITICAL INSTRUCTION: Ask which box size (${x1} or ${x2}) ${names[0]} should choose.`;

    if (isStructure) {
      const steps = [
        {
          label: `Write the working equation to test packing into boxes of ${x1}:`,
          expectedAnswer: eq1.expected,
          acceptedAnswers: x1 === xGood ? [...eq1.accepted, `${y} / ${x1} = ${qGood} R 0`] : eq1.accepted
        },
        {
          label: `Write the working equation to test packing into boxes of ${x2}:`,
          expectedAnswer: eq2.expected,
          acceptedAnswers: x2 === xGood ? [...eq2.accepted, `${y} / ${x2} = ${qGood} R 0`] : eq2.accepted
        },
        {
          label: 'Final Answer (Which box size leaves no leftovers?):',
          expectedAnswer: answer,
          acceptedAnswers
        }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'PART_WHOLE_DUAL_GROUPING',
          correctModelType: 'PART_WHOLE',
          modelOptions: ALL_MODEL_OPTIONS,
          parts: [
            { name: 'Equal Boxes', value: '?', displayValue: '?' }
          ],
          whole: { label: `Total ${item}`, value: y, displayValue: String(y), isTarget: false },
          target: { type: 'PART', label: 'Equal Boxes' },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: xBad, defect: 'PICKED_DIVISOR_WITH_REMAINDER' },
        { value: 'Both', defect: 'ASSUMED_BOTH_DIVIDE_EVENLY' },
        { value: 'Neither', defect: 'MISSED_ZERO_REMAINDER' }
      ]);
    }
    solutionSteps = `Step 1: Test boxes of ${xGood}: ${eqGood.expected} (remainder 0, so ${y} is a multiple of ${xGood}).\\nStep 2: Test boxes of ${xBad}: ${eqBad.expected} (leaves a remainder).\\nStep 3: Choose boxes of ${xGood}.`;
    hint = `Divide ${y} by ${x1} and by ${x2}. The box size that leaves 0 remainder is the one where ${y} is a multiple!`;

  } else {
    // standard_condition_based_digit_cards
    const x = [2, 5, 10][getRandomInt(0, 2)];
    const askLargest = Math.random() > 0.4;
    let digits = [];

    if (x === 10) {
      const nonZero = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5).slice(0, 3);
      digits = [...nonZero, 0].sort(() => Math.random() - 0.5);
    } else if (x === 5) {
      const pool = [1, 2, 3, 4, 6, 7, 8, 9].sort(() => Math.random() - 0.5).slice(0, 2);
      const endChoice = Math.random() > 0.5 ? [5, 0] : [5, pool.pop() || 2];
      digits = [pool[0], pool[1] || 3, ...endChoice].sort(() => Math.random() - 0.5);
    } else {
      const evens = [2, 4, 6, 8].sort(() => Math.random() - 0.5);
      const odds = [1, 3, 5, 7, 9].sort(() => Math.random() - 0.5);
      digits = [evens[0], odds[0], odds[1], Math.random() > 0.5 ? 0 : evens[1]].sort(() => Math.random() - 0.5);
    }

    // Compute all valid 4-digit multiples of x using exact multiset of digits (no leading 0)
    const validNums = [];
    const used = Array(digits.length).fill(false);
    const permute = (curr) => {
      if (curr.length === digits.length) {
        if (curr[0] !== 0) {
          const val = Number(curr.join(''));
          if (val % x === 0) validNums.push(val);
        }
        return;
      }
      for (let i = 0; i < digits.length; i++) {
        if (used[i]) continue;
        used[i] = true;
        curr.push(digits[i]);
        permute(curr);
        curr.pop();
        used[i] = false;
      }
    };
    permute([]);
    const sortedValid = [...new Set(validNums)].sort((a, b) => a - b);
    const targetVal = askLargest ? sortedValid[sortedValid.length - 1] : sortedValid[0];
    const lastDigit = targetVal % 10;

    answer = String(targetVal);
    acceptedAnswers = [answer];
    const goalWord = askLargest ? 'largest' : 'smallest';
    askText = `Using all the digit cards (${digits.join(', ')}), form the ${goalWord} 4-digit number that is a multiple of ${x}.`;

    visualEngineObj = {
      componentToRender: 'DIGIT_CARD_SORTER',
      componentData: {
        digits,
        condition: `${goalWord} multiple of ${x}`
      }
    };

    const validLastDigits = [...new Set(digits.filter((d) => d % x === 0 || (x === 2 && d % 2 === 0)))];
    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          {
            label: `To be a multiple of ${x}, the last digit can be:`,
            expectedAnswer: String(lastDigit),
            acceptedAnswers: validLastDigits.map(String)
          },
          {
            label: `Form the ${goalWord} possible number using the cards:`,
            expectedAnswer: answer,
            acceptedAnswers
          }
        ]
      };
    } else if (isMCQ) {
      const sortedAll = [...digits].sort((a, b) => (askLargest ? b - a : a - b));
      const naiveExtreme = sortedAll[0] === 0 ? Number([sortedAll[1], 0, ...sortedAll.slice(2)].join('')) : Number(sortedAll.join(''));
      const secondBest = sortedValid.length > 1 ? (askLargest ? sortedValid[sortedValid.length - 2] : sortedValid[1]) : targetVal + x;
      const swappedLast = Number(String(targetVal).slice(0, 2) + String(targetVal)[3] + String(targetVal)[2]);
      mcqData = buildFourUniqueOptions(answer, [
        { value: naiveExtreme !== targetVal ? naiveExtreme : secondBest, defect: 'IGNORED_MULTIPLE_RULE' },
        { value: secondBest, defect: 'NOT_MOST_EXTREME_ARRANGEMENT' },
        { value: swappedLast, defect: 'WRONG_TENS_ONES_ORDER' }
      ]);
    }
    solutionSteps = `Step 1: A multiple of ${x} must end in ${validLastDigits.join(' or ')}.\\nStep 2: Place ${lastDigit} in the ones place so the remaining digits can form the ${goalWord} 4-digit number: ${targetVal}.`;
    hint = `Check the ones digit rule for multiples of ${x} first, then arrange the remaining digits to make the ${goalWord} number!`;
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
