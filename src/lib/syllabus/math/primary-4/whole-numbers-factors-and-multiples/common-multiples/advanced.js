import { getRandomNames, getPackingAndShoppingItems, getSyncEventPairs } from '@/lib/utils/variable-bank.js';
import {
  ALL_MODEL_OPTIONS,
  getRandomInt,
  getFactors,
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
  const variant = activeVariant === 'advanced_default' ? 'advanced_group_scaling_equal_totals' : activeVariant;
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

  if (variant === 'advanced_group_scaling_equal_totals') {
    const pairs = [
      [6, 8], [4, 6], [6, 9], [8, 12], [4, 10], [6, 10]
    ];
    const [x, y] = pairs[getRandomInt(0, pairs.length - 1)];
    const lcm = getLCM(x, y);
    const boxesA = lcm / x;
    const boxesB = lcm / y;
    const boxesPerSet = boxesA + boxesB;
    const numSets = getRandomInt(3, 6);
    const totalBoxes = boxesPerSet * numSets;
    const itemsA = numSets * lcm;

    answer = String(itemsA);
    acceptedAnswers = [answer, `${answer} ${item}`];
    askText = `STORY: Factory A packs ${item} in boxes of ${x}. Factory B packs ${item} in boxes of ${y}. Both factories packed the exact same total number of ${item}. Altogether, they used ${totalBoxes} boxes.\n\nCRITICAL INSTRUCTION: Ask how many ${item} Factory A packed.`;

    if (isStructure) {
      const eqSets = makeDivEq(totalBoxes, boxesPerSet);
      const steps = [
        { label: `What is the lowest common multiple (smallest equal number of ${item}) for ${x} and ${y}?`, expectedAnswer: String(lcm), acceptedAnswers: [String(lcm)] },
        { label: `For every ${lcm} ${item}, write the working equation to find the total number of boxes used by both factories:`, expectedAnswer: `${boxesA} + ${boxesB} = ${boxesPerSet}`, acceptedAnswers: [`${boxesA} + ${boxesB} = ${boxesPerSet}`, `${boxesA}+${boxesB}=${boxesPerSet}`, `${boxesB} + ${boxesA} = ${boxesPerSet}`, `${boxesB}+${boxesA}=${boxesPerSet}`] },
        { label: `Write the working equation to find how many sets of ${lcm} ${item} there are in ${totalBoxes} boxes:`, expectedAnswer: eqSets.expected, acceptedAnswers: eqSets.accepted },
        { label: `Write the working equation to find the total ${item} Factory A packed:`, expectedAnswer: `${numSets} * ${lcm} = ${itemsA}`, acceptedAnswers: makeMulEq(numSets, lcm, itemsA) }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'PART_WHOLE_UNIT_SCALING',
          correctModelType: 'PART_WHOLE',
          modelOptions: ALL_MODEL_OPTIONS,
          parts: [
            { name: 'Factory A Boxes', value: '?', displayValue: '?' },
            { name: 'Factory B Boxes', value: '?', displayValue: '?' }
          ],
          whole: { label: 'Total Boxes Used', value: totalBoxes, displayValue: String(totalBoxes), isTarget: false },
          target: { type: 'PART', label: 'Factory A Boxes' },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: itemsA * 2, defect: 'DOUBLED_FOR_BOTH_FACTORIES' },
        { value: lcm, defect: 'STOPPED_AT_ONE_SET_LCM' },
        { value: numSets * boxesA, defect: 'ANSWERED_BOXES_INSTEAD_OF_ITEMS' }
      ]);
    }
    solutionSteps = `Step 1: LCM of ${x} and ${y} is ${lcm} ${item}.\\nStep 2: In 1 set of ${lcm} ${item}, Factory A uses ${boxesA} boxes and Factory B uses ${boxesB} boxes (${boxesA} + ${boxesB} = ${boxesPerSet} boxes).\\nStep 3: Number of sets = ${totalBoxes} / ${boxesPerSet} = ${numSets}.\\nStep 4: Factory A packed ${numSets} * ${lcm} = ${itemsA} ${item}.`;
    hint = `Find the LCM of ${x} and ${y} first to make 1 equal set, count the total boxes in 1 set, then divide ${totalBoxes} by that!`;

  } else if (variant === 'advanced_time_synchronization_bus') {
    const syncEvent = getSyncEventPairs();
    const schedules = [
      [6, 9], [8, 12], [6, 8], [10, 15], [9, 12], [12, 15], [8, 10]
    ];
    const [x, y] = schedules[getRandomInt(0, schedules.length - 1)];
    const lcm = getLCM(x, y);
    const startHour = getRandomInt(7, 10);
    const startMin = [0, 5, 10, 15][getRandomInt(0, 3)];
    const totalMins = startMin + lcm;
    const endHour = startHour + Math.floor(totalMins / 60);
    const endMin = totalMins % 60;
    const padMin = (m) => (m < 10 ? `0${m}` : String(m));
    const startStr = `${startHour}:${padMin(startMin)} AM`;
    const endStr = `${endHour}:${padMin(endMin)} AM`;

    answer = endStr;
    acceptedAnswers = [endStr, `${endHour}:${padMin(endMin)}`, `${endHour}.${padMin(endMin)} AM`];
    askText = `${syncEvent.entityA} ${syncEvent.action} every ${x} minutes. ${syncEvent.entityB} ${syncEvent.action} every ${y} minutes. Both ${syncEvent.togetherVerb} at ${startStr}. When is the next time they will ${syncEvent.nextVerb}?`;

    visualEngineObj = {
      componentToRender: 'NUMBER_LINE_ADVANCED',
      componentData: {
        min: startMin,
        max: startMin + lcm + 10,
        numIntervals: 10,
        markedValue: startMin + lcm,
        markedLabel: '?'
      }
    };

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: 'State the lowest common multiple (LCM) of the two time intervals (in minutes):', expectedAnswer: String(lcm), acceptedAnswers: [String(lcm), `${lcm} min`, `${lcm} minutes`] },
          { label: `Final Answer (State the new time, e.g., ${startStr}):`, expectedAnswer: answer, acceptedAnswers }
        ]
      };
    } else if (isMCQ) {
      const wrong1 = `${startHour + Math.floor((startMin + x + y) / 60)}:${padMin((startMin + x + y) % 60)} AM`;
      const wrong2 = `${startHour + Math.floor((startMin + lcm * 2) / 60)}:${padMin((startMin + lcm * 2) % 60)} AM`;
      const wrong3 = `${startHour + Math.floor((startMin + lcm + 5) / 60)}:${padMin((startMin + lcm + 5) % 60)} AM`;
      mcqData = buildFourUniqueOptions(answer, [
        { value: wrong1, defect: 'ADDED_INTERVALS_INSTEAD_OF_LCM' },
        { value: wrong2, defect: 'NOT_NEXT_MEETING_TIME' },
        { value: wrong3, defect: 'CARELESS_TIME_ADDITION' }
      ]);
    }
    solutionSteps = `Step 1: Find the lowest common multiple (LCM) of ${x} and ${y}: ${lcm} minutes.\\nStep 2: Add ${lcm} minutes to ${startStr} = ${endStr}.`;
    hint = `Find the LCM of ${x} and ${y} to get how many minutes pass before both ${syncEvent.nextVerb} again!`;

  } else if (variant === 'advanced_missing_divisor_reverse_lcm') {
    const cases = [
      { x: 4, lcm: 12 },
      { x: 6, lcm: 18 },
      { x: 6, lcm: 24 },
      { x: 8, lcm: 24 },
      { x: 9, lcm: 18 },
      { x: 4, lcm: 20 }
    ];
    const c = cases[getRandomInt(0, cases.length - 1)];
    const oneDigitFactors = getFactors(c.lcm).filter((f) => f <= 9);
    const validYs = oneDigitFactors.filter((y) => y !== c.x && getLCM(c.x, y) === c.lcm);

    answer = formatList(validYs);
    acceptedAnswers = acceptedListVariants(validYs);
    askText = `The lowest common multiple (LCM) of ${c.x} and an unknown 1-digit number Y (different from ${c.x}) is ${c.lcm}. What are all the possible values of Y?`;

    if (isStructure) {
      const steps = [
        { label: `List the 1-digit factors of the LCM (${c.lcm}):`, expectedAnswer: formatList(oneDigitFactors), acceptedAnswers: acceptedListVariants(oneDigitFactors) }
      ];
      validYs.slice(0, 2).forEach((vy) => {
        steps.push({ label: `Test the number ${vy}. What is the lowest common multiple (LCM) of ${c.x} and ${vy}?`, expectedAnswer: String(c.lcm), acceptedAnswers: [String(c.lcm)] });
      });
      steps.push({ label: 'Final Answer (List the possible values for the unknown number):', expectedAnswer: answer, acceptedAnswers });
      inputRequirementObj = { inputType: 'MULTI_STEP_INPUT', steps };
    } else if (isMCQ) {
      const nonMatching = oneDigitFactors.filter((f) => !validYs.includes(f) && f > 1);
      mcqData = buildFourUniqueOptions(answer, [
        { value: formatList([...validYs, nonMatching[0] || 1].sort((a, b) => a - b)), defect: 'INCLUDED_INVALID_FACTOR' },
        { value: String(validYs[0]), defect: 'MISSED_SECOND_POSSIBLE_VALUE' },
        { value: formatList(oneDigitFactors), defect: 'LISTED_ALL_FACTORS_OF_LCM' }
      ]);
    }
    solutionSteps = `Step 1: 1-digit factors of ${c.lcm} are ${formatList(oneDigitFactors)}.\\nStep 2: Test each factor with ${c.x} to see which gives an LCM of ${c.lcm}: ${answer}.`;
    hint = `Y must be a 1-digit factor of ${c.lcm}. List all 1-digit factors of ${c.lcm} and test each one with ${c.x}!`;

  } else if (variant === 'advanced_dual_condition_constant_deficit') {
    const pairs = [
      [5, 6], [4, 5], [3, 4], [4, 7], [6, 8], [5, 8], [6, 9]
    ];
    const [x, y] = pairs[getRandomInt(0, pairs.length - 1)];
    const lcm = getLCM(x, y);
    const deficit = getRandomInt(1, Math.min(3, Math.min(x, y) - 1));
    const total = lcm - deficit;

    answer = String(total);
    acceptedAnswers = [answer, `${answer} ${item}`];
    askText = `STORY: ${names[0]} has some ${item}. If ${names[0]} arranges them in rows of ${x}, ${names[0]} is short of ${deficit} to complete the last row. If ${names[0]} arranges them in rows of ${y}, ${names[0]} is also short of ${deficit} to complete the last row.\n\nCRITICAL INSTRUCTION: Ask what is the smallest possible number of ${item} ${names[0]} has.`;

    if (isStructure) {
      const steps = [
        { label: `Write the lowest common multiple (LCM) of ${x} and ${y} (smallest number dividing evenly by both):`, expectedAnswer: String(lcm), acceptedAnswers: [String(lcm), ...makeMulEq(x, y, lcm)] },
        { label: `Since you are short of ${deficit} for both arrangements, write the working equation to find the actual number of ${item}:`, expectedAnswer: `${lcm} - ${deficit} = ${total}`, acceptedAnswers: makeSubEq(lcm, deficit, total) },
        { label: 'Final Answer:', expectedAnswer: answer, acceptedAnswers }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'PART_WHOLE_CONSTANT_DEFICIT',
          correctModelType: 'PART_WHOLE',
          modelOptions: ALL_MODEL_OPTIONS,
          parts: [
            { name: `Actual ${item}`, value: '?', displayValue: '?' },
            { name: 'Shortfall', value: String(deficit), displayValue: String(deficit), isShortfall: true }
          ],
          whole: { label: `Common Multiple of ${x} and ${y}`, value: '?', displayValue: '?', isTarget: true },
          target: { type: 'PART', label: `Actual ${item}` },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: lcm + deficit, defect: 'ADDED_DEFICIT_INSTEAD_OF_SUBTRACTING' },
        { value: lcm, defect: 'FORGOT_TO_SUBTRACT_DEFICIT' },
        { value: total + lcm, defect: 'NOT_SMALLEST_POSSIBLE' }
      ]);
    }
    solutionSteps = `Step 1: Find the lowest common multiple (LCM) of ${x} and ${y}: ${lcm}.\\nStep 2: Subtract the shortfall ${deficit}: ${lcm} - ${deficit} = ${total}.`;
    hint = `If you had ${deficit} more, it would be an exact common multiple of ${x} and ${y}. Find the LCM first, then subtract ${deficit}!`;

  } else {
    // advanced_mystery_number_multi_constraint
    const validPuzzles = [];
    for (const [x, y] of [[3, 4], [4, 6], [3, 5], [4, 5], [6, 8]]) {
      const lcm = getLCM(x, y);
      const mults = [];
      for (let m = lcm; m < 100; m += lcm) mults.push(m);
      for (const div of [5, 7, 9]) {
        if (div === x || div === y || lcm % div === 0) continue;
        for (let rem = 1; rem < div; rem++) {
          const matches = mults.filter((m) => m % div === rem);
          if (matches.length === 2) {
            const mid = Math.floor((matches[0] + matches[1]) / 2);
            validPuzzles.push({ x, y, lcm, mults, div, rem, matches, mid, pickGreater: true, ans: matches[1] });
            validPuzzles.push({ x, y, lcm, mults, div, rem, matches, mid, pickGreater: false, ans: matches[0] });
          }
        }
      }
    }
    const p = validPuzzles[getRandomInt(0, validPuzzles.length - 1)];
    const boundCond = p.pickGreater ? `greater than ${p.mid}` : `less than ${p.mid}`;

    answer = String(p.ans);
    acceptedAnswers = [answer];
    askText = `I am a whole number less than 100. I am a common multiple of ${p.x} and ${p.y}. When divided by ${p.div}, I leave a remainder of ${p.rem}. I am also ${boundCond}. What number am I?`;

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: `List the common multiples of ${p.x} and ${p.y} that are less than 100:`, expectedAnswer: formatList(p.mults), acceptedAnswers: acceptedListVariants(p.mults) },
          { label: `Which of these numbers leave a remainder of ${p.rem} when divided by ${p.div}?`, expectedAnswer: formatList(p.matches), acceptedAnswers: acceptedListVariants(p.matches) },
          { label: `Final Answer (The number ${boundCond}):`, expectedAnswer: answer, acceptedAnswers }
        ]
      };
    } else if (isMCQ) {
      const otherMatch = p.matches.find((m) => m !== p.ans);
      const nonMatch = p.mults.find((m) => !p.matches.includes(m)) || p.lcm;
      mcqData = buildFourUniqueOptions(answer, [
        { value: otherMatch, defect: 'IGNORED_SIZE_BOUND_CLUE' },
        { value: nonMatch, defect: 'IGNORED_REMAINDER_CLUE' },
        { value: p.ans + p.div, defect: 'NOT_COMMON_MULTIPLE' }
      ]);
    }
    solutionSteps = `Step 1: Common multiples of ${p.x} and ${p.y} under 100: ${formatList(p.mults)}.\\nStep 2: Numbers leaving remainder ${p.rem} when divided by ${p.div}: ${formatList(p.matches)}.\\nStep 3: The one ${boundCond} is ${p.ans}.`;
    hint = `List the common multiples of ${p.x} and ${p.y} below 100 first, then test dividing each by ${p.div}!`;
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
