import { getRandomNames, getPackingAndShoppingItems } from '@/lib/utils/variable-bank.js';
import {
  ALL_MODEL_OPTIONS,
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

const PACKING_PAIRS = [
  [18, 24], [24, 36], [28, 42], [30, 45], [32, 48],
  [36, 48], [36, 54], [40, 60], [42, 56], [48, 72]
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
  const variant = activeVariant === 'standard_default' ? 'standard_two_item_equal_packing' : activeVariant;
  const names = getRandomNames(2);
  const items = getPackingAndShoppingItems(2);
  const itemA = items[0].item;
  const itemB = items[1].item;

  let askText = '';
  let answer = '';
  let acceptedAnswers = [];
  let mcqData = null;
  let solutionSteps = '';
  let hint = '';
  let visualEngineObj = { componentToRender: 'NONE', componentData: { hideVisual: true } };
  let inputRequirementObj = null;

  if (variant === 'standard_two_item_equal_packing') {
    const [x, y] = PACKING_PAIRS[getRandomInt(0, PACKING_PAIRS.length - 1)];
    const facX = getFactors(x);
    const facY = getFactors(y);
    const common = getCommonFactors(x, y);
    const gcf = common[common.length - 1];

    const askAll = !isStructure && Math.random() > 0.6;

    if (askAll) {
      answer = formatList(common);
      acceptedAnswers = acceptedListVariants(common);
      askText = `STORY: ${names[0]} has ${x} ${itemA} and ${y} ${itemB} to pack into identical goodie bags with no leftovers.\n\nCRITICAL INSTRUCTION: Ask what are all the possible numbers of identical bags ${names[0]} can make.`;
      if (isMCQ) {
        const missingLast = common.slice(0, -1);
        const withExtra = [...common, facX.find((f) => !common.includes(f)) || gcf + 1].sort((a, b) => a - b);
        mcqData = buildFourUniqueOptions(answer, [
          { value: formatList(missingLast), defect: 'MISSED_GREATEST_COMMON_FACTOR' },
          { value: formatList(withExtra), defect: 'INCLUDED_NON_COMMON_FACTOR' },
          { value: String(gcf), defect: 'GAVE_ONLY_GREATEST_INSTEAD_OF_ALL' }
        ]);
      }
      solutionSteps = `Step 1: Factors of ${x}: ${formatList(facX)}.\\nStep 2: Factors of ${y}: ${formatList(facY)}.\\nStep 3: Common factors give all possible bag counts: ${answer}.`;
      hint = `Every common factor of ${x} and ${y} is a valid number of identical bags.`;
    } else {
      answer = String(gcf);
      acceptedAnswers = [answer, `${answer} bags`];
      askText = `STORY: ${names[0]} has ${x} ${itemA} and ${y} ${itemB} to pack into identical bags so each bag has the same number of ${itemA} and ${itemB}, with none left over.\n\nCRITICAL INSTRUCTION: Ask for the greatest number of identical bags ${names[0]} can make.`;

      if (isStructure) {
        const steps = [
          { label: `List the factors of ${x}:`, expectedAnswer: formatList(facX), acceptedAnswers: acceptedListVariants(facX) },
          { label: `List the factors of ${y}:`, expectedAnswer: formatList(facY), acceptedAnswers: acceptedListVariants(facY) },
          { label: 'Final Answer (Greatest number of identical bags):', expectedAnswer: answer, acceptedAnswers }
        ];
        inputRequirementObj = {
          inputType: 'INTERACTIVE_BAR_BUILDER',
          steps,
          barBuilderConfig: {
            problemType: 'PART_WHOLE_GROUPING',
            correctModelType: 'PART_WHOLE',
            modelOptions: ALL_MODEL_OPTIONS,
            parts: [
              { name: `Bags of ${itemA}`, value: '?', displayValue: '?' },
              { name: `Bags of ${itemB}`, value: '?', displayValue: '?' }
            ],
            whole: { label: 'Greatest Number of Bags', value: '?', displayValue: '?', isTarget: true },
            target: { type: 'WHOLE', label: 'Greatest Number of Bags' },
            steps
          }
        };
      } else if (isMCQ) {
        const secondGcf = common.length > 1 ? common[common.length - 2] : gcf - 1;
        mcqData = buildFourUniqueOptions(answer, [
          { value: secondGcf, defect: 'NOT_GREATEST_COMMON_FACTOR' },
          { value: x + y, defect: 'ADDED_QUANTITIES' },
          { value: Math.abs(y - x), defect: 'SUBTRACTED_QUANTITIES' }
        ]);
      }
      solutionSteps = `Step 1: List factors of ${x}: ${formatList(facX)}.\\nStep 2: List factors of ${y}: ${formatList(facY)}.\\nStep 3: Common factors are ${formatList(common)}. The greatest number of identical bags is ${gcf}.`;
      hint = `Find the highest common factor (HCF) of ${x} and ${y}.`;
    }

  } else if (variant === 'standard_max_group_vs_contents') {
    const [x, y] = PACKING_PAIRS[getRandomInt(0, PACKING_PAIRS.length - 1)];
    const common = getCommonFactors(x, y);
    const gcf = common[common.length - 1];
    const perBagA = x / gcf;
    const perBagB = y / gcf;
    const targetMode = ['A', 'B', 'total'][getRandomInt(0, 2)];

    const targetVal = targetMode === 'A' ? perBagA : targetMode === 'B' ? perBagB : perBagA + perBagB;
    const targetDesc =
      targetMode === 'A'
        ? `${itemA} in each bag`
        : targetMode === 'B'
        ? `${itemB} in each bag`
        : `items altogether in each bag`;

    answer = String(targetVal);
    acceptedAnswers = [answer];
    askText = `STORY: ${names[0]} packs ${x} ${itemA} and ${y} ${itemB} equally into the greatest possible number of identical bags with nothing left over.\n\nCRITICAL INSTRUCTION: Ask how many ${targetDesc} there are.`;

    if (isStructure) {
      const steps = [
        { label: 'List the common factors to find the greatest number of bags:', expectedAnswer: formatList(common), acceptedAnswers: acceptedListVariants(common) }
      ];
      if (targetMode === 'A') {
        const eqA = makeDivEq(x, gcf);
        steps.push({ label: `Write the working equation to find the number of ${itemA} in each of the ${gcf} bags:`, expectedAnswer: eqA.expected, acceptedAnswers: eqA.accepted });
      } else if (targetMode === 'B') {
        const eqB = makeDivEq(y, gcf);
        steps.push({ label: `Write the working equation to find the number of ${itemB} in each of the ${gcf} bags:`, expectedAnswer: eqB.expected, acceptedAnswers: eqB.accepted });
      } else {
        const eqBoth = `${perBagA} + ${perBagB} = ${targetVal}`;
        steps.push({ label: `Write the working equation to find the total items in each of the ${gcf} bags:`, expectedAnswer: eqBoth, acceptedAnswers: [eqBoth, `${perBagA}+${perBagB}=${targetVal}`, `${perBagB} + ${perBagA} = ${targetVal}`, `${perBagB}+${perBagA}=${targetVal}`] });
      }
      steps.push({ label: 'Final Answer:', expectedAnswer: answer, acceptedAnswers });

      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'PART_WHOLE_CONTENTS',
          correctModelType: 'PART_WHOLE',
          modelOptions: ALL_MODEL_OPTIONS,
          parts: [
            { name: '1 Bag Contents', value: '?', displayValue: '?' },
            { name: 'Remaining Bags', value: '?', displayValue: '?' }
          ],
          whole: {
            label: targetMode === 'A' ? `Total ${itemA}` : targetMode === 'B' ? `Total ${itemB}` : 'Total Items',
            value: targetMode === 'A' ? x : targetMode === 'B' ? y : x + y,
            displayValue: String(targetMode === 'A' ? x : targetMode === 'B' ? y : x + y),
            isTarget: false
          },
          target: { type: 'PART', label: '1 Bag Contents' },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: gcf, defect: 'ANSWERED_NUMBER_OF_BAGS_INSTEAD' },
        { value: targetMode === 'A' ? perBagB : perBagA, defect: 'CONFUSED_ITEM_A_AND_B' },
        { value: targetVal + 1, defect: 'CARELESS_CALCULATION' }
      ]);
    }
    solutionSteps = `Step 1: Common factors of ${x} and ${y} are ${formatList(common)}, so greatest number of bags = ${gcf}.\\nStep 2: Divide into ${gcf} bags: ${x} / ${gcf} = ${perBagA} ${itemA} and ${y} / ${gcf} = ${perBagB} ${itemB} per bag.\\nStep 3: Required ${targetDesc} = ${targetVal}.`;
    hint = `First find the highest common factor (HCF) of ${x} and ${y} to get the number of bags, then divide!`;

  } else if (variant === 'standard_grid_tile_cutting') {
    const [len, wid] = [
      [18, 24], [12, 18], [16, 24], [20, 30], [18, 27], [15, 25]
    ][getRandomInt(0, 5)];
    const facL = getFactors(len);
    const facW = getFactors(wid);
    const common = getCommonFactors(len, wid);
    const gcf = common[common.length - 1];
    const askAll = isStructure || Math.random() > 0.5;

    visualEngineObj = {
      componentToRender: 'GRID_ARRAY_VISUALIZER',
      componentData: {
        rows: Math.min(len, 12),
        columns: Math.min(wid, 15),
        title: `Rectangular Sheet (${len} cm by ${wid} cm)`,
        rowLabel: `${len} cm`,
        colLabel: `${wid} cm`,
        itemShape: 'square',
        showTotal: false,
        showEquation: false
      }
    };

    if (askAll) {
      answer = formatList(common);
      acceptedAnswers = acceptedListVariants(common);
      askText = `A rectangular sheet of paper is ${len} cm long and ${wid} cm wide. It is cut into identical squares with no paper left over. What are all the possible side lengths (in cm) of the squares?`;
      if (isStructure) {
        inputRequirementObj = {
          inputType: 'MULTI_STEP_INPUT',
          steps: [
            { label: 'List the factors of the length:', expectedAnswer: formatList(facL), acceptedAnswers: acceptedListVariants(facL) },
            { label: 'List the factors of the width:', expectedAnswer: formatList(facW), acceptedAnswers: acceptedListVariants(facW) },
            { label: 'Final Answer (List all possible side lengths of the squares in cm):', expectedAnswer: answer, acceptedAnswers }
          ]
        };
      } else if (isMCQ) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: formatList(common.slice(0, -1)), defect: 'MISSED_GREATEST_COMMON_FACTOR' },
          { value: String(gcf), defect: 'GAVE_ONLY_GREATEST_INSTEAD_OF_ALL' },
          { value: formatList([...common, facL.find((f) => !common.includes(f)) || gcf + 1].sort((a, b) => a - b)), defect: 'INCLUDED_NON_COMMON_FACTOR' }
        ]);
      }
    } else {
      answer = String(gcf);
      acceptedAnswers = [answer, `${answer} cm`];
      askText = `A rectangular sheet of paper is ${len} cm long and ${wid} cm wide. It is cut into the largest possible identical squares with no paper left over. What is the side length of each square in cm?`;
      if (isMCQ) {
        const secondGcf = common.length > 1 ? common[common.length - 2] : gcf - 1;
        mcqData = buildFourUniqueOptions(answer, [
          { value: secondGcf, defect: 'NOT_GREATEST_COMMON_FACTOR' },
          { value: len - wid, defect: 'SUBTRACTED_DIMENSIONS' },
          { value: gcf * 2, defect: 'CONFUSED_FACTOR_WITH_MULTIPLE' }
        ]);
      }
    }
    solutionSteps = `Step 1: Factors of ${len}: ${formatList(facL)}.\\nStep 2: Factors of ${wid}: ${formatList(facW)}.\\nStep 3: Common factors give the valid square side lengths: ${formatList(common)}${askAll ? '.' : `, and the largest is ${gcf} cm.`}`;
    hint = `A square's side length must divide BOTH ${len} cm and ${wid} cm evenly.`;

  } else if (variant === 'standard_deduction_shared_clue') {
    const validPuzzles = [];
    for (let m = 2; m <= 12; m++) {
      for (let k = 2; m * k <= 36; k++) {
        const g = m * k;
        for (let c1 = 2; g * c1 <= 100; c1++) {
          for (let c2 = c1 + 1; g * c2 <= 100; c2++) {
            if (getGCF(c1, c2) === 1) {
              validPuzzles.push({ a: g * c1, b: g * c2, m });
            }
          }
        }
      }
    }
    const picked = validPuzzles[getRandomInt(0, validPuzzles.length - 1)];
    const p = Math.random() > 0.5 ? picked : { a: picked.b, b: picked.a, m: picked.m };
    const common = getCommonFactors(p.a, p.b);
    const matches = common.filter((c) => c % p.m === 0);
    const largestMatch = matches[matches.length - 1];

    const askAll = isStructure || matches.length === 1 || Math.random() > 0.5;
    answer = askAll ? formatList(matches) : String(largestMatch);
    acceptedAnswers = askAll ? acceptedListVariants(matches) : [String(largestMatch)];

    askText = askAll
      ? `A mystery number is a common factor of ${p.a} and ${p.b}. It is also a multiple of ${p.m}. List all possible values of the mystery number.`
      : `A mystery number is a common factor of ${p.a} and ${p.b}. It is also a multiple of ${p.m}. What is the greatest possible mystery number?`;

    visualEngineObj = { componentToRender: 'NONE', componentData: { hideVisual: true } };

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: 'List all the common factors of the two numbers:', expectedAnswer: formatList(common), acceptedAnswers: acceptedListVariants(common) },
          { label: `Final Answer (Which of these is a multiple of ${p.m}?):`, expectedAnswer: answer, acceptedAnswers }
        ]
      };
    } else if (isMCQ) {
      const nonMatch = common.find((c) => c % p.m !== 0 && c > 1) || 1;
      mcqData = buildFourUniqueOptions(answer, [
        { value: nonMatch, defect: 'IGNORED_MULTIPLE_CLUE' },
        { value: p.m * 2 === Number(answer) ? p.m * 3 : p.m * 2, defect: 'MULTIPLE_NOT_COMMON_FACTOR' },
        { value: formatList(common), defect: 'LISTED_ALL_COMMON_FACTORS' }
      ]);
    }
    solutionSteps = `Step 1: Common factors of ${p.a} and ${p.b} are ${formatList(common)}.\\nStep 2: Check which ones are multiples of ${p.m}: ${formatList(matches)}.`;
    hint = `List the common factors of ${p.a} and ${p.b} first, then pick the ones in the ${p.m} times table.`;

  } else {
    // standard_failed_grouping
    const n = getRandomInt(4, 9);
    const failMode = ['Boys', 'Girls', 'Both'][getRandomInt(0, 2)];
    const mult1 = getRandomInt(3, 9);
    let mult2 = getRandomInt(3, 9);
    if (mult2 === mult1) mult2 = mult1 + 1;

    const x = failMode === 'Girls' ? n * mult1 : n * mult1 + getRandomInt(1, n - 1);
    const y = failMode === 'Boys' ? n * mult2 : n * mult2 + getRandomInt(1, n - 1);
    const sc = { x, y, n, who: failMode };

    const labelA = 'Boys';
    const labelB = 'Girls';
    const remX = sc.x % sc.n;
    const remY = sc.y % sc.n;
    const eqX = makeDivEq(sc.x, sc.n);
    const eqY = makeDivEq(sc.y, sc.n);

    answer = sc.who;
    acceptedAnswers = [sc.who, sc.who.toLowerCase()];
    askText = `STORY: ${names[0]} claims that ${sc.n} is a common factor of ${sc.x} and ${sc.y}, so ${sc.x} boys and ${sc.y} girls can be split into equal teams of ${sc.n} with no leftovers.\n\nCRITICAL INSTRUCTION: Ask which group (Boys, Girls, or Both) proves that ${sc.n} is NOT a common factor because it cannot be divided equally into teams of ${sc.n}.`;

    if (isStructure) {
      const steps = [
        { label: `Write the working equation to test if ${sc.n} is a factor of ${sc.x} (${labelA.toLowerCase()}):`, expectedAnswer: eqX.expected, acceptedAnswers: eqX.accepted },
        { label: `Write the working equation to test if ${sc.n} is a factor of ${sc.y} (${labelB.toLowerCase()}):`, expectedAnswer: eqY.expected, acceptedAnswers: eqY.accepted },
        { label: `Which group proves ${sc.n} is NOT a common factor? (Type ${labelA}, ${labelB}, or Both):`, expectedAnswer: answer, acceptedAnswers }
      ];
      const parts = [];
      if (remX > 0) {
        parts.push({ name: `${labelA} Grouped`, value: '?', displayValue: '?' });
        parts.push({ name: `${labelA} Leftover`, value: '?', displayValue: '?', isShortfall: true });
      } else {
        parts.push({ name: `${labelA} Grouped`, value: String(sc.x), displayValue: String(sc.x) });
      }
      if (remY > 0) {
        parts.push({ name: `${labelB} Leftover`, value: '?', displayValue: '?', isShortfall: true });
      }

      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'PART_WHOLE_SHORTFALL',
          correctModelType: 'PART_WHOLE',
          modelOptions: ALL_MODEL_OPTIONS,
          parts,
          whole: { label: 'Total Students', value: sc.x + sc.y, displayValue: String(sc.x + sc.y), isTarget: false },
          target: { type: 'PART', label: 'Leftover' },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: sc.who === 'Boys' ? 'Girls' : 'Boys', defect: 'REVERSED_GROUP_CHECK' },
        { value: sc.who === 'Both' ? 'Boys' : 'Both', defect: 'MISCHECKED_SECOND_GROUP' },
        { value: 'Neither', defect: 'ASSUMED_COMMON_FACTOR' }
      ]);
    }
    solutionSteps = `Step 1: Test if ${sc.n} is a factor of ${sc.x} (${labelA.toLowerCase()}): ${eqX.expected}.\\nStep 2: Test if ${sc.n} is a factor of ${sc.y} (${labelB.toLowerCase()}): ${eqY.expected}.\\nStep 3: Since ${sc.n} leaves a remainder for ${sc.who}, ${sc.n} is NOT a factor of ${sc.who}'s total, proving ${sc.n} is not a common factor.`;
    hint = `A number is a common factor only if it divides BOTH ${sc.x} and ${sc.y} with 0 remainder. Check which group leaves a remainder when divided by ${sc.n}.`;
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
