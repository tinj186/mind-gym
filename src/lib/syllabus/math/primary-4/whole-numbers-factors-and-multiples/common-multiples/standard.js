import { getRandomNames, getPackingAndShoppingItems } from '@/lib/utils/variable-bank.js';
import {
  ALL_MODEL_OPTIONS,
  getRandomInt,
  getGCF,
  formatList,
  acceptedListVariants,
  makeDivEq,
  makeSubEq,
  makeMulEq,
  buildFourUniqueOptions,
  buildPromptPayload
} from '../common-factors/utils.js';

const getLCM = (a, b) => (a * b) / getGCF(a, b);

const ONE_DIGIT_PAIRS = [
  [3, 4], [3, 5], [3, 8], [4, 5], [4, 6],
  [4, 7], [5, 6], [5, 8], [6, 8], [6, 9],
  [7, 8], [8, 9]
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
  const variant = activeVariant === 'standard_default' ? 'standard_equating_two_groups' : activeVariant;
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

  if (variant === 'standard_equating_two_groups') {
    const [x, y] = ONE_DIGIT_PAIRS[getRandomInt(0, ONE_DIGIT_PAIRS.length - 1)];
    const lcm = getLCM(x, y);
    const packsA = lcm / x;
    const askPacksA = isStructure || Math.random() > 0.5;

    if (askPacksA) {
      answer = String(packsA);
      acceptedAnswers = [answer, `${answer} packs`];
      askText = `STORY: Box A contains packs of ${x} ${item}. Box B contains packs of ${y} ${item}. Both boxes have the exact same smallest possible total number of ${item}.\n\nCRITICAL INSTRUCTION: Ask how many packs of ${item} are in Box A.`;
    } else {
      answer = String(lcm);
      acceptedAnswers = [answer, `${answer} ${item}`];
      askText = `STORY: Box A contains packs of ${x} ${item}. Box B contains packs of ${y} ${item}. Both boxes have the exact same total number of ${item}.\n\nCRITICAL INSTRUCTION: Ask what is the smallest possible number of ${item} in one box.`;
    }

    if (isStructure) {
      const eqA = makeDivEq(lcm, x);
      const steps = [
        { label: `Write the lowest common multiple (LCM) of ${x} and ${y} (the smallest equal total for one box):`, expectedAnswer: String(lcm), acceptedAnswers: [String(lcm)] },
        { label: 'Write the working equation to find the number of packs in Box A:', expectedAnswer: eqA.expected, acceptedAnswers: eqA.accepted }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'COMPARISON_EQUAL_TOTALS',
          correctModelType: 'COMPARISON',
          modelOptions: ALL_MODEL_OPTIONS,
          entities: [
            { id: 'A', name: `Box A (packs of ${x})`, value: '?', displayValue: '?', relation: 'BASE' },
            { id: 'B', name: `Box B (packs of ${y})`, value: '?', displayValue: '?', relativeTo: `Box A (packs of ${x})`, relation: 'EQUAL' }
          ],
          target: { type: 'BAR', label: 'Equal Total' },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = askPacksA
        ? buildFourUniqueOptions(answer, [
            { value: lcm / y, defect: 'FOUND_PACKS_IN_BOX_B' },
            { value: lcm, defect: 'ANSWERED_TOTAL_ITEMS_INSTEAD_OF_PACKS' },
            { value: packsA + 1, defect: 'CARELESS_CALCULATION' }
          ])
        : buildFourUniqueOptions(answer, [
            { value: x * y !== lcm ? x * y : lcm * 2, defect: 'MULTIPLIED_WITHOUT_FINDING_LCM' },
            { value: packsA, defect: 'ANSWERED_PACKS_INSTEAD_OF_TOTAL' },
            { value: x + y, defect: 'ADDED_PACK_SIZES' }
          ]);
    }
    solutionSteps = `Step 1: Find the lowest common multiple (LCM) of ${x} and ${y}: ${lcm} ${item} per box.\\nStep 2: ${askPacksA ? `Packs in Box A = ${lcm} / ${x} = ${packsA}.` : `Smallest equal total in one box = ${lcm}.`}`;
    hint = `Both boxes have the same total, so the total must be a common multiple of ${x} and ${y}!`;

  } else if (variant === 'standard_strict_bounded_range') {
    const [x, y] = ONE_DIGIT_PAIRS.filter(([a, b]) => getLCM(a, b) <= 30)[getRandomInt(0, 7)];
    const lcm = getLCM(x, y);
    const k = getRandomInt(2, 4);
    const target = lcm * k;
    const boundA = target - getRandomInt(2, Math.min(8, lcm - 2));
    const boundB = target + getRandomInt(2, Math.min(8, lcm - 2));

    answer = String(target);
    acceptedAnswers = [answer];
    askText = `Find a common multiple of ${x} and ${y} that is strictly between ${boundA} and ${boundB}.`;

    visualEngineObj = {
      componentToRender: 'NUMBER_LINE_ADVANCED',
      componentData: {
        min: boundA,
        max: boundB,
        numIntervals: Math.min(20, boundB - boundA),
        markedValue: target,
        markedLabel: '?'
      }
    };

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: 'State the lowest common multiple (LCM) of the two numbers:', expectedAnswer: String(lcm), acceptedAnswers: [String(lcm)] },
          { label: 'Write the working equation to find the multiple that falls inside the bounds:', expectedAnswer: `${lcm} * ${k} = ${target}`, acceptedAnswers: makeMulEq(lcm, k, target) },
          { label: 'Final Answer:', expectedAnswer: answer, acceptedAnswers }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: target - lcm, defect: 'BELOW_LOWER_BOUND' },
        { value: target + lcm, defect: 'ABOVE_UPPER_BOUND' },
        { value: lcm, defect: 'STOPPED_AT_LCM' }
      ]);
    }
    solutionSteps = `Step 1: The lowest common multiple (LCM) of ${x} and ${y} is ${lcm}.\\nStep 2: Multiply ${lcm} * ${k} = ${target}, which lies strictly between ${boundA} and ${boundB}.`;
    hint = `Find the LCM of ${x} and ${y} first, then list its multiples until one lands between ${boundA} and ${boundB}!`;

  } else if (variant === 'standard_common_multiple_constant_remainder') {
    const [x, y] = ONE_DIGIT_PAIRS.filter(([a, b]) => getLCM(a, b) <= 45)[getRandomInt(0, 9)];
    const lcm = getLCM(x, y);
    const r = getRandomInt(1, Math.min(x, y) - 1);
    const total = lcm + r;

    answer = String(total);
    acceptedAnswers = [answer, `${answer} ${item}`];
    askText = `STORY: ${names[0]} has some ${item}. If ${names[0]} packs them into bags of ${x}, there are ${r} left over. If ${names[0]} packs them into bags of ${y}, there are also ${r} left over.\n\nCRITICAL INSTRUCTION: Ask what is the smallest possible number of ${item} ${names[0]} has.`;

    if (isStructure) {
      const steps = [
        { label: `Write the lowest common multiple (LCM) of ${x} and ${y} (smallest number dividing evenly by both):`, expectedAnswer: String(lcm), acceptedAnswers: [String(lcm), ...makeMulEq(x, y, lcm)] },
        { label: `Write the working equation to add the leftover ${item}:`, expectedAnswer: `${lcm} + ${r} = ${total}`, acceptedAnswers: [`${lcm} + ${r} = ${total}`, `${lcm}+${r}=${total}`, `${r} + ${lcm} = ${total}`, `${r}+${lcm}=${total}`] },
        { label: 'Final Answer:', expectedAnswer: answer, acceptedAnswers }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'PART_WHOLE_CONSTANT_REMAINDER',
          correctModelType: 'PART_WHOLE',
          modelOptions: ALL_MODEL_OPTIONS,
          parts: [
            { name: `Common Multiple of ${x} and ${y}`, value: '?', displayValue: '?' },
            { name: 'Leftover', value: String(r), displayValue: String(r), isShortfall: true }
          ],
          whole: { label: `Total ${item}`, value: '?', displayValue: '?', isTarget: true },
          target: { type: 'WHOLE', label: `Total ${item}` },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: lcm, defect: 'FORGOT_TO_ADD_REMAINDER' },
        { value: lcm - r, defect: 'SUBTRACTED_REMAINDER_INSTEAD' },
        { value: total + lcm, defect: 'NOT_SMALLEST_POSSIBLE' }
      ]);
    }
    solutionSteps = `Step 1: Find the lowest common multiple (LCM) of ${x} and ${y}: ${lcm}.\\nStep 2: Add the constant remainder ${r}: ${lcm} + ${r} = ${total}.`;
    hint = `Find the LCM of ${x} and ${y} first, then add the ${r} leftover ${item}!`;

  } else if (variant === 'standard_target_shortfall_common_multiple') {
    const [x, y] = ONE_DIGIT_PAIRS.filter(([a, b]) => getLCM(a, b) <= 30)[getRandomInt(0, 6)];
    const lcm = getLCM(x, y);
    const k = getRandomInt(2, 4);
    const nextMult = lcm * k;
    const shortfall = getRandomInt(2, Math.min(9, lcm - 2));
    const current = nextMult - shortfall;

    answer = String(shortfall);
    acceptedAnswers = [answer, `${answer} ${item}`];
    askText = `STORY: ${names[0]} has ${current} ${item}. ${names[0]} wants to pack them into bunches of ${x} or bunches of ${y} with no ${item} left over.\n\nCRITICAL INSTRUCTION: Ask what is the smallest number of ${item} ${names[0]} needs to buy to make this possible.`;

    if (isStructure) {
      const steps = [
        { label: 'State the lowest common multiple (LCM) of the two bunch sizes:', expectedAnswer: String(lcm), acceptedAnswers: [String(lcm)] },
        { label: `Write the working equation to find the next common multiple greater than ${current}:`, expectedAnswer: `${lcm} * ${k} = ${nextMult}`, acceptedAnswers: makeMulEq(lcm, k, nextMult) },
        { label: `Write the working equation to find how many more ${item} ${names[0]} needs to buy:`, expectedAnswer: `${nextMult} - ${current} = ${shortfall}`, acceptedAnswers: makeSubEq(nextMult, current, shortfall) }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'PART_WHOLE_SHORTFALL_TO_LCM',
          correctModelType: 'PART_WHOLE',
          modelOptions: ALL_MODEL_OPTIONS,
          parts: [
            { name: `Current ${item}`, value: String(current), displayValue: String(current) },
            { name: 'More Needed', value: '?', displayValue: '?', isShortfall: true }
          ],
          whole: { label: 'Next Common Multiple', value: '?', displayValue: '?', isTarget: true },
          target: { type: 'PART', label: 'More Needed' },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: current - (nextMult - lcm), defect: 'SUBTRACTED_TO_PREVIOUS_MULTIPLE' },
        { value: nextMult, defect: 'ANSWERED_NEXT_MULTIPLE_INSTEAD' },
        { value: shortfall + 1, defect: 'CARELESS_CALCULATION' }
      ]);
    }
    solutionSteps = `Step 1: LCM of ${x} and ${y} is ${lcm}.\\nStep 2: Next multiple above ${current} is ${lcm} * ${k} = ${nextMult}.\\nStep 3: Shortfall = ${nextMult} - ${current} = ${shortfall}.`;
    hint = `Find the LCM of ${x} and ${y}, find the next multiple above ${current}, then subtract ${current}!`;

  } else {
    // standard_smallest_square_tiling
    const cardPairs = [
      [4, 6], [3, 4], [4, 5], [6, 8], [6, 9], [3, 5], [4, 10]
    ];
    const [b, l] = cardPairs[getRandomInt(0, cardPairs.length - 1)];
    const lcm = getLCM(b, l);
    const multsL = Array.from({ length: Math.max(4, lcm / l) }, (_, i) => (i + 1) * l);
    const multsB = Array.from({ length: Math.max(4, lcm / b) }, (_, i) => (i + 1) * b);

    answer = String(lcm);
    acceptedAnswers = [answer, `${answer} cm`];
    askText = `A student uses rectangular cards measuring ${l} cm by ${b} cm and places them side-by-side in the same orientation to form the smallest possible square. What is the side length of the square (in cm)?`;

    visualEngineObj = {
      componentToRender: 'GRID_ARRAY_VISUALIZER',
      componentData: {
        rows: b,
        columns: l,
        title: `Rectangular Card (${l} cm by ${b} cm)`,
        rowLabel: `${b} cm`,
        colLabel: `${l} cm`,
        itemShape: 'square',
        showTotal: false,
        showEquation: false
      }
    };

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: `List the first ${multsL.length} multiples of the length (${l} cm) to see possible square sides:`, expectedAnswer: formatList(multsL), acceptedAnswers: acceptedListVariants(multsL) },
          { label: `List the first ${multsB.length} multiples of the breadth (${b} cm) to see possible square sides:`, expectedAnswer: formatList(multsB), acceptedAnswers: acceptedListVariants(multsB) },
          { label: 'Final Answer (The smallest possible side length of the square):', expectedAnswer: answer, acceptedAnswers }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: b * l !== lcm ? b * l : lcm * 2, defect: 'MULTIPLIED_DIMENSIONS_FOR_AREA' },
        { value: (b + l) * 2, defect: 'CALCULATED_PERIMETER' },
        { value: lcm * 2, defect: 'NOT_SMALLEST_SQUARE' }
      ]);
    }
    solutionSteps = `Step 1: Multiples of ${l}: ${formatList(multsL)}.\\nStep 2: Multiples of ${b}: ${formatList(multsB)}.\\nStep 3: The smallest side length where both match is ${lcm} cm.`;
    hint = `For a square, the total length and total breadth must be equal. Find the LCM of ${l} and ${b}!`;
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
