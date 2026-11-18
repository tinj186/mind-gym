import { getRandomNames, getPackingAndShoppingItems } from '@/lib/utils/variable-bank.js';
import {
  ALL_MODEL_OPTIONS,
  getRandomInt,
  getGCF,
  getCommonFactors,
  formatList,
  acceptedListVariants,
  makeDivEq,
  makeSubEq,
  makeMulEq,
  buildFourUniqueOptions,
  buildPromptPayload
} from './utils.js';

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
  const variant = activeVariant === 'advanced_default' ? 'advanced_uniform_leftover' : activeVariant;
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

  if (variant === 'advanced_uniform_leftover') {
    const basePairs = [
      [36, 48], [24, 36], [30, 45], [42, 56], [40, 60], [32, 48]
    ];
    const [pA, pB] = basePairs[getRandomInt(0, basePairs.length - 1)];
    const gcf = getGCF(pA, pB);
    const r = getRandomInt(2, Math.min(5, gcf - 1));
    const totalA = pA + r;
    const totalB = pB + r;

    answer = String(gcf);
    acceptedAnswers = [answer, `${answer} bags`];
    askText = `STORY: ${names[0]} packs ${totalA} ${itemA} and ${totalB} ${itemB} equally into identical bags. After packing, there are exactly ${r} ${itemA} and ${r} ${itemB} left over.\n\nCRITICAL INSTRUCTION: Ask for the greatest possible number of identical bags ${names[0]} can pack.`;

    if (isStructure) {
      const steps = [
        { label: `Write the working equation to find the exact number of ${itemA} packed:`, expectedAnswer: `${totalA} - ${r} = ${pA}`, acceptedAnswers: makeSubEq(totalA, r, pA) },
        { label: `Write the working equation to find the exact number of ${itemB} packed:`, expectedAnswer: `${totalB} - ${r} = ${pB}`, acceptedAnswers: makeSubEq(totalB, r, pB) },
        { label: 'Final Answer (Highest common factor (HCF) of the packed amounts):', expectedAnswer: answer, acceptedAnswers }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'PART_WHOLE_LEFTOVER',
          correctModelType: 'PART_WHOLE',
          modelOptions: ALL_MODEL_OPTIONS,
          parts: [
            { name: `${itemA} Packed`, value: '?', displayValue: '?' },
            { name: 'Leftover', value: String(r), displayValue: String(r), isShortfall: true }
          ],
          whole: { label: `Total ${itemA}`, value: totalA, displayValue: String(totalA), isTarget: false },
          target: { type: 'PART', label: `${itemA} Packed` },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: getGCF(totalA, totalB), defect: 'FORGOT_TO_SUBTRACT_REMAINDER' },
        { value: r, defect: 'ANSWERED_WITH_REMAINDER' },
        { value: gcf / 2 >= 2 ? gcf / 2 : gcf + 2, defect: 'NOT_GREATEST_COMMON_FACTOR' }
      ]);
    }
    solutionSteps = `Step 1: Subtract the leftover ${r} from each: ${totalA} - ${r} = ${pA} and ${totalB} - ${r} = ${pB}.\\nStep 2: Find the highest common factor (HCF) of ${pA} and ${pB}, which is ${gcf}.`;
    hint = `First subtract the leftover ${r} from both totals to find how many were actually packed, then find their highest common factor (HCF).`;

  } else if (variant === 'advanced_different_leftovers') {
    const scenarios = [
      { pA: 42, pB: 56, r1: 3, r2: 4 },
      { pA: 36, pB: 48, r1: 2, r2: 5 },
      { pA: 45, pB: 60, r1: 4, r2: 3 },
      { pA: 32, pB: 48, r1: 3, r2: 5 },
      { pA: 36, pB: 54, r1: 5, r2: 2 }
    ];
    const sc = scenarios[getRandomInt(0, scenarios.length - 1)];
    const totalA = sc.pA + sc.r1;
    const totalB = sc.pB + sc.r2;
    const gcf = getGCF(sc.pA, sc.pB);

    answer = String(gcf);
    acceptedAnswers = [answer, `${answer} boxes`];
    askText = `STORY: ${names[0]} packs ${totalA} ${itemA} and ${totalB} ${itemB} equally into identical boxes. There are ${sc.r1} ${itemA} left over and ${sc.r2} ${itemB} left over.\n\nCRITICAL INSTRUCTION: Ask for the greatest possible number of boxes.`;

    if (isStructure) {
      const steps = [
        { label: `Write the working equation to find the exact number of ${itemA} packed:`, expectedAnswer: `${totalA} - ${sc.r1} = ${sc.pA}`, acceptedAnswers: makeSubEq(totalA, sc.r1, sc.pA) },
        { label: `Write the working equation to find the exact number of ${itemB} packed:`, expectedAnswer: `${totalB} - ${sc.r2} = ${sc.pB}`, acceptedAnswers: makeSubEq(totalB, sc.r2, sc.pB) },
        { label: 'Final Answer (Highest common factor (HCF) of the packed amounts):', expectedAnswer: answer, acceptedAnswers }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'PART_WHOLE_DIFF_LEFTOVERS',
          correctModelType: 'PART_WHOLE',
          modelOptions: ALL_MODEL_OPTIONS,
          parts: [
            { name: `${itemA} Packed`, value: '?', displayValue: '?' },
            { name: `${itemA} Leftover`, value: String(sc.r1), displayValue: String(sc.r1), isShortfall: true }
          ],
          whole: { label: `Total ${itemA}`, value: totalA, displayValue: String(totalA), isTarget: false },
          target: { type: 'PART', label: `${itemA} Packed` },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: getGCF(totalA, totalB), defect: 'FORGOT_TO_SUBTRACT_REMAINDER' },
        { value: sc.r1 + sc.r2, defect: 'SUMMED_REMAINDERS' },
        { value: gcf / 2 >= 2 ? gcf / 2 : gcf + 2, defect: 'NOT_GREATEST_COMMON_FACTOR' }
      ]);
    }
    solutionSteps = `Step 1: Subtract leftovers: ${totalA} - ${sc.r1} = ${sc.pA} ${itemA} packed; ${totalB} - ${sc.r2} = ${sc.pB} ${itemB} packed.\\nStep 2: Find the highest common factor (HCF) of ${sc.pA} and ${sc.pB}: ${gcf}.`;
    hint = `Subtract each item's leftover amount first, then find the highest common factor (HCF) of the two packed totals.`;

  } else if (variant === 'advanced_largest_tile_perimeter_area') {
    const walls = [
      [24, 32], [18, 24], [24, 36], [30, 45], [20, 28], [27, 36]
    ];
    const [w, h] = walls[getRandomInt(0, walls.length - 1)];
    const common = getCommonFactors(w, h);
    const side = common[common.length - 1];
    const askPerimeter = Math.random() > 0.4;
    const metricVal = askPerimeter ? side * 4 : side * side;
    const metricName = askPerimeter ? 'perimeter' : 'area';
    const unit = askPerimeter ? 'cm' : 'cm²';

    answer = String(metricVal);
    acceptedAnswers = [answer, `${answer} ${unit}`];
    askText = `A rectangular wall measuring ${w} cm by ${h} cm is covered completely by the largest possible identical square tiles with no gaps or overlaps. What is the ${metricName} of one such square tile (in ${unit})?`;

    visualEngineObj = {
      componentToRender: 'GRID_ARRAY_VISUALIZER',
      componentData: {
        rows: Math.min(w, 12),
        columns: Math.min(h, 15),
        title: `Wall Dimensions (${w} cm by ${h} cm)`,
        rowLabel: `${w} cm`,
        colLabel: `${h} cm`,
        itemShape: 'square',
        showTotal: false,
        showEquation: false
      }
    };

    if (isStructure) {
      const eqExpected = askPerimeter ? `${side} * 4 = ${metricVal}` : `${side} * ${side} = ${metricVal}`;
      const eqAccepted = askPerimeter
        ? [...makeMulEq(side, 4, metricVal), `${side} + ${side} + ${side} + ${side} = ${metricVal}`, `${side}+${side}+${side}+${side}=${metricVal}`]
        : makeMulEq(side, side, metricVal);

      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: 'List the common factors to find the largest possible side length of a square tile:', expectedAnswer: formatList(common), acceptedAnswers: acceptedListVariants(common) },
          { label: `Write the working equation to find the ${metricName} of one such square tile:`, expectedAnswer: eqExpected, acceptedAnswers: eqAccepted },
          { label: 'Final Answer:', expectedAnswer: answer, acceptedAnswers }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: side, defect: 'STOPPED_AT_SIDE_LENGTH' },
        { value: askPerimeter ? side * side : side * 4, defect: 'CONFUSED_AREA_AND_PERIMETER' },
        { value: metricVal + side, defect: 'CARELESS_CALCULATION' }
      ]);
    }
    solutionSteps = `Step 1: Common factors of ${w} and ${h} are ${formatList(common)}, so the largest square tile has side ${side} cm.\\nStep 2: ${askPerimeter ? `Perimeter = 4 * ${side} = ${metricVal} cm` : `Area = ${side} * ${side} = ${metricVal} cm²`}.`;
    hint = `First find the highest common factor (HCF) of ${w} and ${h} to get the side length of the largest square tile, then calculate its ${metricName}.`;

  } else if (variant === 'advanced_number_of_cuts') {
    const ribbons = [
      [24, 36], [18, 30], [24, 40], [28, 42], [30, 45], [32, 48]
    ];
    const [r1, r2] = ribbons[getRandomInt(0, ribbons.length - 1)];
    const gcf = getGCF(r1, r2);
    const pieces1 = r1 / gcf;
    const pieces2 = r2 / gcf;
    const cuts1 = pieces1 - 1;
    const cuts2 = pieces2 - 1;
    const totalCuts = cuts1 + cuts2;

    answer = String(totalCuts);
    acceptedAnswers = [answer, `${answer} cuts`];
    askText = `STORY: ${names[0]} has two ribbons of lengths ${r1} cm and ${r2} cm. ${names[0]} cuts both ribbons into the longest possible identical pieces with no remainder.\n\nCRITICAL INSTRUCTION: Ask how many cuts were made in total.`;

    if (isStructure) {
      const eq1 = makeDivEq(r1, gcf);
      const eq2 = makeDivEq(r2, gcf);
      const steps = [
        { label: 'State the highest common factor (HCF, length of each piece):', expectedAnswer: String(gcf), acceptedAnswers: [String(gcf), `${gcf} cm`] },
        { label: 'Write the working equation to find the number of pieces for the first ribbon:', expectedAnswer: eq1.expected, acceptedAnswers: eq1.accepted },
        { label: 'Number of cuts made on the first ribbon (pieces - 1):', expectedAnswer: String(cuts1), acceptedAnswers: [String(cuts1)] },
        { label: 'Write the working equation to find the number of pieces for the second ribbon:', expectedAnswer: eq2.expected, acceptedAnswers: eq2.accepted },
        { label: 'Number of cuts made on the second ribbon (pieces - 1):', expectedAnswer: String(cuts2), acceptedAnswers: [String(cuts2)] },
        { label: 'Final Answer (Total cuts):', expectedAnswer: answer, acceptedAnswers }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'PART_WHOLE_RIBBON_CUTS',
          correctModelType: 'PART_WHOLE',
          modelOptions: ALL_MODEL_OPTIONS,
          parts: [
            { name: 'Ribbon 1', value: String(r1), displayValue: `${r1} cm` },
            { name: 'Ribbon 2', value: String(r2), displayValue: `${r2} cm` }
          ],
          whole: { label: 'Total Length', value: r1 + r2, displayValue: `${r1 + r2} cm`, isTarget: false },
          target: { type: 'WHOLE', label: 'Total Cuts' },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: pieces1 + pieces2, defect: 'ANSWERED_PIECES_INSTEAD_OF_CUTS' },
        { value: gcf, defect: 'ANSWERED_PIECE_LENGTH_INSTEAD' },
        { value: totalCuts + 1, defect: 'OFF_BY_ONE_CUT' }
      ]);
    }
    solutionSteps = `Step 1: Longest piece length = highest common factor (HCF) of ${r1} and ${r2} = ${gcf} cm.\\nStep 2: First ribbon: ${r1} / ${gcf} = ${pieces1} pieces -> ${cuts1} cut(s).\\nStep 3: Second ribbon: ${r2} / ${gcf} = ${pieces2} pieces -> ${cuts2} cut(s).\\nStep 4: Total cuts = ${cuts1} + ${cuts2} = ${totalCuts}.`;
    hint = `Remember: to cut a ribbon into P pieces, you only need P - 1 cuts!`;

  } else {
    // advanced_mystery_numbers_gcf_sum
    const cases = [
      { g: 15, s: 75 },
      { g: 12, s: 60 },
      { g: 14, s: 70 },
      { g: 16, s: 80 },
      { g: 18, s: 90 }
    ];
    const c = cases[getRandomInt(0, cases.length - 1)];
    const mults = [];
    for (let m = c.g; m < 100; m += c.g) {
      if (m >= 10) mults.push(m);
    }

    const validPairs = [];
    for (let i = 0; i < mults.length; i++) {
      for (let j = i + 1; j < mults.length; j++) {
        if (mults[i] + mults[j] === c.s && getGCF(mults[i], mults[j]) === c.g) {
          validPairs.push([mults[i], mults[j]]);
        }
      }
    }

    const primaryPair = validPairs[validPairs.length - 1];
    answer = formatList(primaryPair);
    acceptedAnswers = validPairs.flatMap(([x, y]) => [
      `${x}, ${y}`, `${x},${y}`, `${y}, ${x}`, `${y},${x}`, `${x} and ${y}`, `${y} and ${x}`
    ]);

    askText = `The highest common factor (HCF) of two different 2-digit numbers is ${c.g}. Their sum is ${c.s}. What are the two numbers?`;
    visualEngineObj = { componentToRender: 'NONE', componentData: { hideVisual: true } };

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: `List the first few multiples of the highest common factor (${c.g}) that are 2-digit numbers:`, expectedAnswer: formatList(mults), acceptedAnswers: acceptedListVariants(mults) },
          { label: `Which two different numbers from your list add up to ${c.s}? (Separate with a comma):`, expectedAnswer: answer, acceptedAnswers }
        ]
      };
    } else if (isMCQ) {
      const [p1, p2] = primaryPair;
      mcqData = buildFourUniqueOptions(answer, [
        { value: `${c.g}, ${c.s - c.g}`, defect: 'PICKED_DUPLICATE_OR_NON_2_DIGIT' },
        { value: `${p1 - 5}, ${p2 + 5}`, defect: 'SUM_MATCHES_BUT_WRONG_GCF' },
        { value: `${p1 + c.g}, ${p2}`, defect: 'WRONG_SUM' }
      ]);
    }
    solutionSteps = `Step 1: List 2-digit multiples of ${c.g}: ${formatList(mults)}.\\nStep 2: Find two different numbers that sum to ${c.s} and have a highest common factor (HCF) of ${c.g}: ${answer}.`;
    hint = `Both numbers must be multiples of ${c.g}! List the 2-digit multiples of ${c.g} and find two that add up to ${c.s}.`;
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
