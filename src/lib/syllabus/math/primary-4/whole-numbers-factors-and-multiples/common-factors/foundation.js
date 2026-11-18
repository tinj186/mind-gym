import {
  getRandomInt,
  getFactors,
  getGCF,
  getCommonFactors,
  formatList,
  acceptedListVariants,
  makeDivEq,
  buildFourUniqueOptions,
  buildPromptPayload
} from './utils.js';

const PAIR_POOL = [
  [12, 18], [16, 24], [18, 24], [20, 30], [24, 36],
  [24, 40], [28, 42], [30, 45], [32, 48], [36, 48],
  [36, 54], [40, 60], [42, 56], [48, 72], [54, 81],
  [60, 90], [64, 96], [45, 75], [36, 60], [28, 56]
];

const pickPairWithMinGCF = (minGcf = 2, minCommonCount = 2) => {
  const candidates = PAIR_POOL.filter(([a, b]) => {
    const cf = getCommonFactors(a, b);
    return cf[cf.length - 1] >= minGcf && cf.length >= minCommonCount;
  });
  return candidates[Math.floor(Math.random() * candidates.length)];
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
  const variant = activeVariant === 'foundation_default' ? 'foundation_direct_venn_intersection' : activeVariant;

  let askText = '';
  let answer = '';
  let acceptedAnswers = [];
  let mcqData = null;
  let solutionSteps = '';
  let hint = '';
  let visualEngineObj = { componentToRender: 'NONE', componentData: { hideVisual: true } };
  let inputRequirementObj = null;

  if (variant === 'foundation_direct_venn_intersection') {
    const [a, b] = pickPairWithMinGCF(4, 3);
    const facA = getFactors(a);
    const facB = getFactors(b);
    const common = getCommonFactors(a, b);
    const onlyA = facA.filter((f) => !common.includes(f));
    const onlyB = facB.filter((f) => !common.includes(f));

    const mode = isStructure ? 'list' : ['list', 'count', 'missing'][getRandomInt(0, 2)];

    if (mode === 'count') {
      answer = String(common.length);
      acceptedAnswers = [answer];
      askText = `How many common factors do ${a} and ${b} have altogether?`;
      visualEngineObj = isMCQ
        ? {
            componentToRender: 'VENN_DIAGRAM_VISUALIZER',
            componentData: {
              title: `Factors of ${a} and ${b}`,
              setALabel: `Factors of ${a}`,
              setBLabel: `Factors of ${b}`,
              setAValues: onlyA,
              setBValues: onlyB,
              intersectionValues: common,
              hiddenNodes: ['intersection']
            }
          }
        : { componentToRender: 'NONE', componentData: { hideVisual: true } };

      if (isMCQ) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: common.length + 1, defect: 'COUNTED_EXTRA_FACTOR' },
          { value: Math.max(1, common.length - 1), defect: 'MISSED_COMMON_FACTOR' },
          { value: common[common.length - 1], defect: 'CONFUSED_COUNT_WITH_GCF' }
        ]);
      }
      solutionSteps = `Step 1: List factors of ${a}: ${formatList(facA)}.\\nStep 2: List factors of ${b}: ${formatList(facB)}.\\nStep 3: Common factors are ${formatList(common)}, so there are ${common.length} common factors.`;
      hint = `List all factors of ${a} and ${b}, then count how many numbers appear in both lists.`;
    } else if (mode === 'missing') {
      const hiddenVal = common[getRandomInt(1, common.length - 1)];
      const shownCommon = common.map((c) => (c === hiddenVal ? '?' : c));
      answer = String(hiddenVal);
      acceptedAnswers = [answer];
      askText = `The common factors of ${a} and ${b} are ${formatList(shownCommon)}. What is the missing common factor?`;
      visualEngineObj = {
        componentToRender: 'VENN_DIAGRAM_VISUALIZER',
        componentData: {
          title: `Factors of ${a} and ${b}`,
          setALabel: `Factors of ${a}`,
          setBLabel: `Factors of ${b}`,
          setAValues: onlyA,
          setBValues: onlyB,
          intersectionValues: common,
          hiddenNodes: [hiddenVal]
        }
      };

      if (isMCQ) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: onlyA[0] || hiddenVal + 1, defect: 'PICKED_UNIQUE_FACTOR_A' },
          { value: onlyB[0] || hiddenVal + 2, defect: 'PICKED_UNIQUE_FACTOR_B' },
          { value: hiddenVal + 1, defect: 'CARELESS_CALCULATION' }
        ]);
      }
      solutionSteps = `Step 1: List factors of ${a}: ${formatList(facA)}.\\nStep 2: List factors of ${b}: ${formatList(facB)}.\\nStep 3: Compare both lists to find the missing shared factor: ${hiddenVal}.`;
      hint = `Check which factor divides both ${a} and ${b} evenly and is missing from the overlap.`;
    } else {
      answer = formatList(common);
      acceptedAnswers = acceptedListVariants(common);
      askText = `Find all the common factors of ${a} and ${b}.`;
      visualEngineObj = isMCQ
        ? {
            componentToRender: 'VENN_DIAGRAM_VISUALIZER',
            componentData: {
              title: `Factors of ${a} and ${b}`,
              setALabel: `Factors of ${a}`,
              setBLabel: `Factors of ${b}`,
              setAValues: onlyA,
              setBValues: onlyB,
              intersectionValues: common,
              hiddenNodes: ['intersection']
            }
          }
        : { componentToRender: 'NONE', componentData: { hideVisual: true } };

      if (isStructure) {
        inputRequirementObj = {
          inputType: 'MULTI_STEP_INPUT',
          steps: [
            { label: `List all the factors of ${a} (separated by commas):`, expectedAnswer: formatList(facA), acceptedAnswers: acceptedListVariants(facA) },
            { label: `List all the factors of ${b} (separated by commas):`, expectedAnswer: formatList(facB), acceptedAnswers: acceptedListVariants(facB) },
            { label: 'Final Answer (List the common factors):', expectedAnswer: answer, acceptedAnswers }
          ]
        };
      } else if (isMCQ) {
        const missingOne = common.slice(0, -1);
        const withExtraA = [...common, onlyA[0]].filter(Boolean).sort((x, y) => x - y);
        const withExtraB = [...common, onlyB[0]].filter(Boolean).sort((x, y) => x - y);
        mcqData = buildFourUniqueOptions(answer, [
          { value: formatList(missingOne), defect: 'MISSED_GREATEST_COMMON_FACTOR' },
          { value: formatList(withExtraA), defect: 'INCLUDED_NON_COMMON_FACTOR' },
          { value: formatList(withExtraB), defect: 'INCLUDED_NON_COMMON_FACTOR' }
        ]);
      }
      solutionSteps = `Step 1: Factors of ${a}: ${formatList(facA)}.\\nStep 2: Factors of ${b}: ${formatList(facB)}.\\nStep 3: The numbers in both lists are ${answer}.`;
      hint = `A common factor must divide both ${a} and ${b} with no remainder. Always start with 1!`;
    }

  } else if (variant === 'foundation_gcf_direct') {
    const [a, b] = pickPairWithMinGCF(4, 3);
    const facA = getFactors(a);
    const facB = getFactors(b);
    const common = getCommonFactors(a, b);
    const gcf = common[common.length - 1];

    answer = String(gcf);
    acceptedAnswers = [answer];
    askText = `Find the highest common factor (HCF) of ${a} and ${b}.`;

    visualEngineObj = {
      componentToRender: 'MULTI_COMPONENT',
      componentData: {
        components: [
          {
            componentToRender: 'FACTOR_RAINBOW_VISUALIZER',
            componentData: { targetNumber: a, factors: facA, title: `Factor Rainbow for ${a}` }
          },
          {
            componentToRender: 'FACTOR_RAINBOW_VISUALIZER',
            componentData: { targetNumber: b, factors: facB, title: `Factor Rainbow for ${b}` }
          }
        ]
      }
    };

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: `List all the factors of ${a}:`, expectedAnswer: formatList(facA), acceptedAnswers: acceptedListVariants(facA) },
          { label: `List all the factors of ${b}:`, expectedAnswer: formatList(facB), acceptedAnswers: acceptedListVariants(facB) },
          { label: 'Final Answer (State the highest common factor):', expectedAnswer: answer, acceptedAnswers }
        ]
      };
    } else if (isMCQ) {
      const secondLargest = common.length > 1 ? common[common.length - 2] : gcf - 1;
      mcqData = buildFourUniqueOptions(answer, [
        { value: secondLargest, defect: 'NOT_GREATEST_COMMON_FACTOR' },
        { value: Math.min(a, b), defect: 'PICKED_SMALLER_NUMBER' },
        { value: gcf * 2, defect: 'CONFUSED_FACTOR_WITH_MULTIPLE' }
      ]);
    }
    solutionSteps = `Step 1: Factors of ${a}: ${formatList(facA)}.\\nStep 2: Factors of ${b}: ${formatList(facB)}.\\nStep 3: Common factors are ${formatList(common)}. The highest common factor (HCF) is ${gcf}.`;
    hint = `Compare the two factor rainbows and find the largest number that appears in both.`;

  } else if (variant === 'foundation_true_false_proof') {
    const isTrue = Math.random() > 0.5;
    let n, x, y;
    if (isTrue) {
      n = getRandomInt(3, 9);
      const m1 = getRandomInt(3, 10);
      let m2 = getRandomInt(3, 10);
      if (m2 === m1) m2 = m1 + 1;
      x = n * m1;
      y = n * m2;
    } else {
      n = getRandomInt(4, 9);
      const m1 = getRandomInt(3, 10);
      x = n * m1;
      y = n * getRandomInt(3, 10) + getRandomInt(1, n - 1);
      if (Math.random() > 0.5) [x, y] = [y, x];
    }

    answer = isTrue ? 'Yes' : 'No';
    acceptedAnswers = isTrue ? ['Yes', 'yes', 'True', 'true'] : ['No', 'no', 'False', 'false'];
    askText = `Is ${n} a common factor of ${x} and ${y}?`;
    visualEngineObj = { componentToRender: 'NONE', componentData: { hideVisual: true } };

    const eq1 = makeDivEq(x, n);
    const eq2 = makeDivEq(y, n);

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: `Write the working equation to test ${x}:`, expectedAnswer: eq1.expected, acceptedAnswers: eq1.accepted },
          { label: `Write the working equation to test ${y}:`, expectedAnswer: eq2.expected, acceptedAnswers: eq2.accepted },
          { label: 'Is it a common factor? (Type Yes or No):', expectedAnswer: answer, acceptedAnswers }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: isTrue ? 'No' : 'Yes', defect: 'CONCEPTUAL_ERROR' },
        { value: `Only ${x}`, defect: 'PARTIAL_CHECK_ONLY' },
        { value: `Only ${y}`, defect: 'PARTIAL_CHECK_ONLY' }
      ]);
    }
    solutionSteps = `Step 1: Divide ${x} by ${n}: ${eq1.expected}.\\nStep 2: Divide ${y} by ${n}: ${eq2.expected}.\\nStep 3: ${isTrue ? `Both divide with no remainder, so ${n} is a common factor.` : `There is a remainder, so ${n} is not a common factor.`}`;
    hint = `A number is a common factor only if it divides BOTH ${x} and ${y} evenly with 0 remainder.`;

  } else if (variant === 'foundation_bounded_common_factor') {
    const [a, b] = [
      [30, 45], [24, 36], [36, 54], [40, 60], [28, 42], [48, 72], [32, 48]
    ][getRandomInt(0, 6)];
    const facA = getFactors(a);
    const facB = getFactors(b);
    const common = getCommonFactors(a, b);
    const onlyA = facA.filter((f) => !common.includes(f));
    const onlyB = facB.filter((f) => !common.includes(f));

    const oddCommons = common.filter((c) => c > 1 && c % 2 === 1);
    const evenCommons = common.filter((c) => c > 1 && c % 2 === 0);
    const useOdd = oddCommons.length > 0 && (evenCommons.length === 0 || Math.random() > 0.5);
    const matching = useOdd ? oddCommons : evenCommons;
    const condText = useOdd ? 'an odd common factor' : 'an even common factor';

    answer = String(matching[matching.length - 1]);
    acceptedAnswers = matching.map(String);
    askText = `Find ${condText} of ${a} and ${b} that is greater than 1.`;

    visualEngineObj = {
      componentToRender: 'VENN_DIAGRAM_VISUALIZER',
      componentData: {
        title: `Factors of ${a} and ${b}`,
        setALabel: `Factors of ${a}`,
        setBLabel: `Factors of ${b}`,
        setAValues: onlyA,
        setBValues: onlyB,
        intersectionValues: common,
        hiddenNodes: ['intersection']
      }
    };

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: 'List all the common factors of the two numbers:', expectedAnswer: formatList(common), acceptedAnswers: acceptedListVariants(common) },
          { label: 'Final Answer (State a common factor matching the condition):', expectedAnswer: answer, acceptedAnswers }
        ]
      };
    } else if (isMCQ) {
      const wrongParity = common.find((c) => c > 1 && (useOdd ? c % 2 === 0 : c % 2 === 1)) || 1;
      const uniqueWrong = (useOdd ? onlyA.find((v) => v % 2 === 1) : onlyA.find((v) => v % 2 === 0)) || onlyA[0] || Number(answer) + 2;
      mcqData = buildFourUniqueOptions(answer, [
        { value: 1, defect: 'IGNORED_GREATER_THAN_1' },
        { value: wrongParity, defect: 'WRONG_PARITY_CONDITION' },
        { value: uniqueWrong, defect: 'NOT_COMMON_FACTOR' }
      ]);
    }
    solutionSteps = `Step 1: List all common factors of ${a} and ${b}: ${formatList(common)}.\\nStep 2: Filter for ${condText} greater than 1: ${formatList(matching)}.`;
    hint = `First find all common factors of ${a} and ${b}, then check which one matches the ${useOdd ? 'odd' : 'even'} and > 1 rule.`;

  } else {
    // foundation_shared_factor_pairing
    const [a, b] = pickPairWithMinGCF(4, 3);
    const common = getCommonFactors(a, b).filter((c) => c > 1);
    const n = common[getRandomInt(0, common.length - 1)];
    const partnerA = a / n;
    const partnerB = b / n;

    answer = `${partnerA}, ${partnerB}`;
    acceptedAnswers = acceptedListVariants([partnerA, partnerB]);
    askText = `${n} is a common factor of ${a} and ${b}. What are the partner factors that multiply with ${n} to make ${a} and ${b} respectively?`;

    visualEngineObj = {
      componentToRender: 'MULTI_COMPONENT',
      componentData: {
        components: [
          {
            componentToRender: 'FACTOR_RAINBOW_VISUALIZER',
            componentData: { targetNumber: a, factors: getFactors(a), hiddenValue: partnerA, title: `Factor Rainbow for ${a}` }
          },
          {
            componentToRender: 'FACTOR_RAINBOW_VISUALIZER',
            componentData: { targetNumber: b, factors: getFactors(b), hiddenValue: partnerB, title: `Factor Rainbow for ${b}` }
          }
        ]
      }
    };

    const eqA = makeDivEq(a, n);
    const eqB = makeDivEq(b, n);

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: `Write the working equation to find the partner factor for ${a}:`, expectedAnswer: eqA.expected, acceptedAnswers: eqA.accepted },
          { label: `Write the working equation to find the partner factor for ${b}:`, expectedAnswer: eqB.expected, acceptedAnswers: eqB.accepted }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: `${partnerB}, ${partnerA}`, defect: 'REVERSED_ORDER' },
        { value: `${partnerA + 1}, ${partnerB}`, defect: 'CARELESS_CALCULATION' },
        { value: `${a - n}, ${b - n}`, defect: 'SUBTRACTED_INSTEAD_OF_DIVIDED' }
      ]);
    }
    solutionSteps = `Step 1: Divide ${a} by ${n}: ${eqA.expected}. Partner factor is ${partnerA}.\\nStep 2: Divide ${b} by ${n}: ${eqB.expected}. Partner factor is ${partnerB}.`;
    hint = `Divide each number by the common factor ${n} to find its matching partner factor.`;
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
