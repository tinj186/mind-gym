import {
  getRandomInt,
  getGCF,
  formatList,
  acceptedListVariants,
  makeDivEq,
  makeMulEq,
  buildFourUniqueOptions,
  buildPromptPayload
} from '../common-factors/utils.js';

const getLCM = (a, b) => (a * b) / getGCF(a, b);

const ONE_DIGIT_PAIRS = [
  [3, 4], [3, 5], [3, 8], [4, 5], [4, 6],
  [4, 9], [5, 6], [5, 8], [6, 8], [6, 9],
  [7, 8], [8, 9], [3, 7], [4, 7], [6, 7]
];

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
  const variant = activeVariant === 'foundation_default' ? 'foundation_direct_venn_lcm' : activeVariant;

  let askText = '';
  let answer = '';
  let acceptedAnswers = [];
  let mcqData = null;
  let solutionSteps = '';
  let hint = '';
  let visualEngineObj = { componentToRender: 'NONE', componentData: { hideVisual: true } };
  let inputRequirementObj = null;

  if (variant === 'foundation_direct_venn_lcm') {
    const [x, y] = ONE_DIGIT_PAIRS[getRandomInt(0, ONE_DIGIT_PAIRS.length - 1)];
    const lcm = getLCM(x, y);
    const countA = Math.max(5, Math.min(8, lcm / x));
    const countB = Math.max(5, Math.min(8, lcm / y));
    const multsA = Array.from({ length: countA }, (_, i) => (i + 1) * x);
    const multsB = Array.from({ length: countB }, (_, i) => (i + 1) * y);
    const commonMults = multsA.filter((m) => multsB.includes(m));
    const onlyA = multsA.filter((m) => !commonMults.includes(m));
    const onlyB = multsB.filter((m) => !commonMults.includes(m));

    answer = String(lcm);
    acceptedAnswers = [answer];
    askText = `Find the lowest common multiple (LCM) of ${x} and ${y}.`;

    visualEngineObj = {
      componentToRender: 'VENN_DIAGRAM_VISUALIZER',
      componentData: {
        title: `Multiples of ${x} and ${y}`,
        setALabel: `Multiples of ${x}`,
        setBLabel: `Multiples of ${y}`,
        setAValues: onlyA,
        setBValues: onlyB,
        intersectionValues: commonMults.length > 0 ? commonMults : [lcm],
        hiddenNodes: ['intersection']
      }
    };

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: `List the first ${countA} multiples of ${x} (separated by commas):`, expectedAnswer: formatList(multsA), acceptedAnswers: acceptedListVariants(multsA) },
          { label: `List the first ${countB} multiples of ${y} (separated by commas):`, expectedAnswer: formatList(multsB), acceptedAnswers: acceptedListVariants(multsB) },
          { label: 'Final Answer (State the lowest common multiple):', expectedAnswer: answer, acceptedAnswers }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: x * y !== lcm ? x * y : lcm * 2, defect: 'MULTIPLIED_WITHOUT_SIMPLIFYING' },
        { value: lcm * 2, defect: 'NOT_LOWEST_COMMON_MULTIPLE' },
        { value: getGCF(x, y) > 1 ? getGCF(x, y) : x + y, defect: 'CONFUSED_HCF_WITH_LCM' }
      ]);
    }
    solutionSteps = `Step 1: Multiples of ${x}: ${formatList(multsA)}.\\nStep 2: Multiples of ${y}: ${formatList(multsB)}.\\nStep 3: The lowest common multiple (LCM) is ${lcm}.`;
    hint = `List the multiples of ${x} and ${y} until you find the smallest number that appears in both lists!`;

  } else if (variant === 'foundation_true_false_common_multiple') {
    const subMode = ['single_tf', 'pick_two_divisors', 'pick_two_multiples'][getRandomInt(0, 2)];

    if (subMode === 'single_tf') {
      const [x, y] = ONE_DIGIT_PAIRS[getRandomInt(0, ONE_DIGIT_PAIRS.length - 1)];
      const lcm = getLCM(x, y);
      const isTrue = Math.random() > 0.5;
      let z;
      if (isTrue) {
        const maxK = Math.max(1, Math.floor(100 / lcm));
        z = lcm * getRandomInt(1, maxK);
      } else {
        const multX = x * getRandomInt(2, Math.floor(96 / x));
        z = multX % y !== 0 ? multX : multX + 1;
      }

      answer = isTrue ? 'Yes' : 'No';
      acceptedAnswers = isTrue ? ['Yes', 'yes', 'True', 'true'] : ['No', 'no', 'False', 'false'];
      askText = `Is ${z} a common multiple of ${x} and ${y}?`;

      const eq1 = makeDivEq(z, x);
      const eq2 = makeDivEq(z, y);
      if (isStructure) {
        inputRequirementObj = {
          inputType: 'MULTI_STEP_INPUT',
          steps: [
            { label: `Write the working equation to test ${x}:`, expectedAnswer: eq1.expected, acceptedAnswers: eq1.accepted },
            { label: `Write the working equation to test ${y}:`, expectedAnswer: eq2.expected, acceptedAnswers: eq2.accepted },
            { label: 'Is it a common multiple? (Type Yes or No):', expectedAnswer: answer, acceptedAnswers }
          ]
        };
      } else if (isMCQ) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: isTrue ? 'No' : 'Yes', defect: 'CONCEPTUAL_ERROR' },
          { value: `Only of ${x}`, defect: 'PARTIAL_CHECK_ONLY' },
          { value: `Only of ${y}`, defect: 'PARTIAL_CHECK_ONLY' }
        ]);
      }
      solutionSteps = `Step 1: Divide ${z} by ${x}: ${eq1.expected}.\\nStep 2: Divide ${z} by ${y}: ${eq2.expected}.\\nStep 3: ${isTrue ? `Both divide with remainder 0, so ${z} is a common multiple.` : `There is a remainder, so ${z} is not a common multiple.`}`;
      hint = `A common multiple must divide evenly by BOTH ${x} and ${y} with no remainder!`;

    } else if (subMode === 'pick_two_divisors') {
      const [x, y] = ONE_DIGIT_PAIRS[getRandomInt(0, ONE_DIGIT_PAIRS.length - 1)];
      const lcm = getLCM(x, y);
      const z = lcm * getRandomInt(1, Math.max(1, Math.floor(96 / lcm)));
      const nonDivisors = [2, 3, 4, 5, 6, 7, 8, 9].filter((d) => d !== x && d !== y && z % d !== 0);
      const bad = nonDivisors[getRandomInt(0, nonDivisors.length - 1)] || 7;
      const goodSorted = [x, y].sort((a, b) => a - b);
      const allThree = [x, y, bad].sort((a, b) => a - b);

      answer = `${goodSorted[0]}, ${goodSorted[1]}`;
      acceptedAnswers = [
        `${goodSorted[0]}, ${goodSorted[1]}`,
        `${goodSorted[0]},${goodSorted[1]}`,
        `${goodSorted[1]}, ${goodSorted[0]}`,
        `${goodSorted[1]},${goodSorted[0]}`,
        `${goodSorted[0]} and ${goodSorted[1]}`,
        `${goodSorted[1]} and ${goodSorted[0]}`
      ];
      askText = `${z} is a common multiple of which two numbers from (${allThree.join(', ')})?`;

      const eqX = makeDivEq(z, goodSorted[0]);
      const eqY = makeDivEq(z, goodSorted[1]);
      const eqBad = makeDivEq(z, bad);
      if (isStructure) {
        inputRequirementObj = {
          inputType: 'MULTI_STEP_INPUT',
          steps: [
            { label: `Write the working equation to test ${allThree[0]}:`, expectedAnswer: makeDivEq(z, allThree[0]).expected, acceptedAnswers: makeDivEq(z, allThree[0]).accepted },
            { label: `Write the working equation to test ${allThree[1]}:`, expectedAnswer: makeDivEq(z, allThree[1]).expected, acceptedAnswers: makeDivEq(z, allThree[1]).accepted },
            { label: `Write the working equation to test ${allThree[2]}:`, expectedAnswer: makeDivEq(z, allThree[2]).expected, acceptedAnswers: makeDivEq(z, allThree[2]).accepted },
            { label: `Final Answer (Which two numbers have ${z} as a common multiple?):`, expectedAnswer: answer, acceptedAnswers }
          ]
        };
      } else if (isMCQ) {
        const p1 = [goodSorted[0], bad].sort((a, b) => a - b);
        const p2 = [goodSorted[1], bad].sort((a, b) => a - b);
        mcqData = buildFourUniqueOptions(answer, [
          { value: `${p1[0]}, ${p1[1]}`, defect: 'INCLUDED_NON_DIVISOR' },
          { value: `${p2[0]}, ${p2[1]}`, defect: 'INCLUDED_NON_DIVISOR' },
          { value: 'All three', defect: 'ASSUMED_ALL_DIVIDE_EVENLY' }
        ]);
      }
      solutionSteps = `Step 1: ${eqX.expected} (remainder 0).\\nStep 2: ${eqY.expected} (remainder 0).\\nStep 3: ${eqBad.expected} (leaves a remainder).\\nStep 4: So ${z} is a common multiple of ${answer}.`;
      hint = `Divide ${z} by each of the 3 numbers. The two numbers that leave 0 remainder are the answer!`;

    } else {
      // pick_two_multiples
      const [x, y] = ONE_DIGIT_PAIRS.filter(([a, b]) => getLCM(a, b) <= 30)[getRandomInt(0, 7)];
      const lcm = getLCM(x, y);
      const maxK = Math.floor(99 / lcm);
      const k1 = 1;
      const k2 = getRandomInt(2, maxK);
      const m1 = lcm * k1;
      const m2 = lcm * k2;

      const trapPool = [];
      for (let n = 10; n < 100; n++) {
        if (n !== m1 && n !== m2 && ((n % x === 0 && n % y !== 0) || (n % y === 0 && n % x !== 0))) {
          trapPool.push(n);
        }
      }
      const shuffledTraps = trapPool.sort(() => Math.random() - 0.5);
      const t1 = shuffledTraps[0];
      const t2 = shuffledTraps[1];
      const candidates = [m1, m2, t1, t2].sort((a, b) => a - b);
      const goodSorted = [m1, m2].sort((a, b) => a - b);

      answer = `${goodSorted[0]}, ${goodSorted[1]}`;
      acceptedAnswers = [
        `${goodSorted[0]}, ${goodSorted[1]}`,
        `${goodSorted[0]},${goodSorted[1]}`,
        `${goodSorted[1]}, ${goodSorted[0]}`,
        `${goodSorted[1]},${goodSorted[0]}`,
        `${goodSorted[0]} and ${goodSorted[1]}`,
        `${goodSorted[1]} and ${goodSorted[0]}`
      ];
      askText = `Which two numbers from (${candidates.join(', ')}) are common multiples of ${x} and ${y}?`;

      if (isStructure) {
        inputRequirementObj = {
          inputType: 'MULTI_STEP_INPUT',
          steps: [
            { label: `State the lowest common multiple (LCM) of ${x} and ${y}:`, expectedAnswer: String(lcm), acceptedAnswers: [String(lcm)] },
            { label: `Final Answer (Which two numbers from the list are common multiples of ${x} and ${y}?):`, expectedAnswer: answer, acceptedAnswers }
          ]
        };
      } else if (isMCQ) {
        const wrong1 = [goodSorted[0], t1].sort((a, b) => a - b);
        const wrong2 = [goodSorted[1], t2].sort((a, b) => a - b);
        const wrong3 = [t1, t2].sort((a, b) => a - b);
        mcqData = buildFourUniqueOptions(answer, [
          { value: `${wrong1[0]}, ${wrong1[1]}`, defect: 'PICKED_SINGLE_MULTIPLE_TRAP' },
          { value: `${wrong2[0]}, ${wrong2[1]}`, defect: 'PICKED_SINGLE_MULTIPLE_TRAP' },
          { value: `${wrong3[0]}, ${wrong3[1]}`, defect: 'CONFUSED_SINGLE_WITH_COMMON_MULTIPLE' }
        ]);
      }
      solutionSteps = `Step 1: The lowest common multiple (LCM) of ${x} and ${y} is ${lcm}.\\nStep 2: Check which numbers in (${candidates.join(', ')}) divide evenly by both ${x} and ${y} (multiples of ${lcm}): ${answer}.`;
      hint = `Check each number in the list: a common multiple must divide evenly by BOTH ${x} and ${y}!`;
    }

  } else if (variant === 'foundation_nth_common_multiple') {
    const [x, y] = ONE_DIGIT_PAIRS[getRandomInt(0, ONE_DIGIT_PAIRS.length - 1)];
    const lcm = getLCM(x, y);
    const n = getRandomInt(2, 4);
    const nthVal = lcm * n;
    const ord = n === 2 ? '2nd' : n === 3 ? '3rd' : '4th';

    answer = String(nthVal);
    acceptedAnswers = [answer];
    askText = `What is the ${ord} common multiple of ${x} and ${y}?`;

    visualEngineObj = {
      componentToRender: 'NUMBER_LINE_ADVANCED',
      componentData: {
        min: 0,
        max: lcm * (n + 1),
        numIntervals: n + 1,
        markedValue: nthVal,
        markedLabel: '?'
      }
    };

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: `What is the first common multiple (lowest common multiple) of ${x} and ${y}?`, expectedAnswer: String(lcm), acceptedAnswers: [String(lcm)] },
          { label: `Write the working equation to find the ${ord} common multiple:`, expectedAnswer: `${lcm} * ${n} = ${nthVal}`, acceptedAnswers: makeMulEq(lcm, n, nthVal) }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: lcm, defect: 'STOPPED_AT_FIRST_COMMON_MULTIPLE' },
        { value: lcm * (n - 1), defect: 'OFF_BY_ONE_MULTIPLE' },
        { value: lcm * (n + 1), defect: 'OFF_BY_ONE_MULTIPLE' }
      ]);
    }
    solutionSteps = `Step 1: The lowest common multiple (LCM) of ${x} and ${y} is ${lcm}.\\nStep 2: The ${ord} common multiple is ${lcm} * ${n} = ${nthVal}.`;
    hint = `Find the lowest common multiple (LCM) of ${x} and ${y} first, then multiply it by ${n}!`;

  } else if (variant === 'foundation_number_line_frog_jumps') {
    const [x, y] = ONE_DIGIT_PAIRS.filter(([a, b]) => getLCM(a, b) <= 36)[getRandomInt(0, 7)];
    const lcm = getLCM(x, y);
    const jumpsA = Array.from({ length: lcm / x }, (_, i) => (i + 1) * x);
    const jumpsB = Array.from({ length: lcm / y }, (_, i) => (i + 1) * y);

    answer = String(lcm);
    acceptedAnswers = [answer];
    askText = `Frog A starts at 0 and jumps ${x} units at a time. Frog B starts at 0 and jumps ${y} units at a time. What is the first number they will both land on?`;

    visualEngineObj = {
      componentToRender: 'NUMBER_LINE_ADVANCED',
      componentData: {
        min: 0,
        max: lcm + Math.max(x, y),
        numIntervals: lcm + Math.max(x, y) <= 24 ? lcm + Math.max(x, y) : 10,
        markedValue: lcm,
        markedLabel: '?'
      }
    };

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: `List the numbers Frog A lands on (up to ${lcm}):`, expectedAnswer: formatList(jumpsA), acceptedAnswers: acceptedListVariants(jumpsA) },
          { label: `List the numbers Frog B lands on (up to ${lcm}):`, expectedAnswer: formatList(jumpsB), acceptedAnswers: acceptedListVariants(jumpsB) },
          { label: 'Final Answer (The first number they both land on):', expectedAnswer: answer, acceptedAnswers }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: x * y !== lcm ? x * y : lcm * 2, defect: 'MULTIPLIED_WITHOUT_FINDING_LCM' },
        { value: x + y, defect: 'ADDED_JUMP_LENGTHS' },
        { value: lcm * 2, defect: 'NOT_FIRST_MEETING_POINT' }
      ]);
    }
    solutionSteps = `Step 1: Frog A lands on ${formatList(jumpsA)}.\\nStep 2: Frog B lands on ${formatList(jumpsB)}.\\nStep 3: The first number they both land on is ${lcm}.`;
    hint = `List the jumps (multiples) of ${x} and ${y} until you find the first number that matches!`;

  } else {
    // foundation_bounded_common_multiple_limit
    const [x, y] = ONE_DIGIT_PAIRS.filter(([a, b]) => getLCM(a, b) <= 30)[getRandomInt(0, 6)];
    const lcm = getLCM(x, y);
    const k = getRandomInt(2, Math.floor(90 / lcm));
    const largestUnder = lcm * k;
    const limit = Math.min(100, largestUnder + getRandomInt(2, lcm - 1));
    const lcmListUpToPass = Array.from({ length: k + 1 }, (_, i) => (i + 1) * lcm);

    const multsA = Array.from({ length: Math.min(6, Math.floor(limit / x)) }, (_, i) => (i + 1) * x);
    const multsB = Array.from({ length: Math.min(6, Math.floor(limit / y)) }, (_, i) => (i + 1) * y);
    const onlyA = multsA.filter((m) => m % lcm !== 0);
    const onlyB = multsB.filter((m) => m % lcm !== 0);

    answer = String(largestUnder);
    acceptedAnswers = [answer];
    askText = `Find the largest common multiple of ${x} and ${y} that is less than ${limit}.`;

    visualEngineObj = {
      componentToRender: 'VENN_DIAGRAM_VISUALIZER',
      componentData: {
        title: `Multiples of ${x} and ${y}`,
        setALabel: `Multiples of ${x}`,
        setBLabel: `Multiples of ${y}`,
        setAValues: onlyA,
        setBValues: onlyB,
        intersectionValues: lcmListUpToPass.slice(0, -1),
        hiddenNodes: ['intersection']
      }
    };

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: `Find the lowest common multiple (LCM) of ${x} and ${y}:`, expectedAnswer: String(lcm), acceptedAnswers: [String(lcm)] },
          { label: `List the multiples of ${lcm} until you pass ${limit}:`, expectedAnswer: formatList(lcmListUpToPass), acceptedAnswers: acceptedListVariants(lcmListUpToPass) },
          { label: `Final Answer (The largest common multiple under ${limit}):`, expectedAnswer: answer, acceptedAnswers }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: largestUnder + lcm, defect: 'EXCEEDED_LIMIT' },
        { value: largestUnder - lcm >= lcm ? largestUnder - lcm : lcm, defect: 'NOT_LARGEST_UNDER_LIMIT' },
        { value: lcm, defect: 'STOPPED_AT_LCM' }
      ]);
    }
    solutionSteps = `Step 1: The lowest common multiple (LCM) of ${x} and ${y} is ${lcm}.\\nStep 2: Multiples of ${lcm} are ${formatList(lcmListUpToPass)}.\\nStep 3: The largest common multiple less than ${limit} is ${largestUnder}.`;
    hint = `Find the LCM of ${x} and ${y} first, then count up in multiples of the LCM without going over ${limit}!`;
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
