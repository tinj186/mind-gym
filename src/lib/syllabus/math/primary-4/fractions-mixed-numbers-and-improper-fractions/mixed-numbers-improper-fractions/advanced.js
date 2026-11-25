import { getRandomNames, getPackingAndShoppingItems } from '../../../../../utils/variable-bank.js';
import {
  ALL_MODEL_OPTIONS,
  getRandomInt,
  getFactors,
  formatList,
  acceptedListVariants,
  makeDivEq,
  makeSubEq,
  makeMulEq,
  buildFourUniqueOptions,
  buildPromptPayload
} from '../../whole-numbers-factors-and-multiples/common-factors/utils.js';

const UNIT_PLURALS = {
  2: 'halves',
  3: 'thirds',
  4: 'quarters',
  5: 'fifths',
  6: 'sixths',
  7: 'sevenths',
  8: 'eighths',
  9: 'ninths'
};

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
  const variant = activeVariant === 'advanced_default' ? 'advanced_dual_unknown_cryptarithm' : activeVariant;
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

  if (variant === 'advanced_dual_unknown_cryptarithm') {
    let x, y, r, totalNum;
    do {
      x = getRandomInt(4, 9);
      y = getRandomInt(3, 9);
      r = getRandomInt(1, x - 1);
      totalNum = x * y + r;
    } while (getFactors(x * y).filter((f) => f > r && f <= 9).length < 1);

    const baseMultiple = totalNum - r;
    const validOneDigitXs = getFactors(baseMultiple).filter((f) => f > r && f <= 9);
    const chosenX = validOneDigitXs[0];
    const chosenY = baseMultiple / chosenX;
    const validPairs = validOneDigitXs.map((vx) => `${vx}, ${baseMultiple / vx}`);

    answer = `${chosenX}, ${chosenY}`;
    acceptedAnswers = [
      ...validPairs,
      ...validOneDigitXs.map((vx) => `${vx},${baseMultiple / vx}`),
      ...validOneDigitXs.map((vx) => `${vx} and ${baseMultiple / vx}`)
    ];
    askText = isStructure
      ? `STORY: ${names[0]} is solving a fraction puzzle with the equivalence equation ${totalNum}/X = Y ${r}/X, where both X and Y are 1-digit whole numbers. Invent a creative, varied Primary 4 story/context (e.g. coding lock, math treasure hunt, or packing ${item}) around this equation.\n\nCRITICAL INSTRUCTION: Ask to find a valid pair of values for X and Y (write as X, Y).`
      : `In the equivalence equation ${totalNum}/X = Y ${r}/X, both X and Y are 1-digit whole numbers. Find a valid pair of values for X and Y (write as X, Y).`;

    if (isStructure) {
      const validFactors = getFactors(baseMultiple).filter((f) => f > r);
      const eqDiv = makeDivEq(baseMultiple, chosenX);
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: 'Write the working equation to subtract the remainder from the numerator:', expectedAnswer: `${totalNum} - ${r} = ${baseMultiple}`, acceptedAnswers: makeSubEq(totalNum, r, baseMultiple) },
          { label: 'List the factors of that result that are greater than the remainder:', expectedAnswer: formatList(validFactors), acceptedAnswers: acceptedListVariants(validFactors) },
          { label: 'Using a valid 1-digit factor for X, write the working equation to find Y:', expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: `${r}, ${chosenY}`, defect: 'SET_DENOMINATOR_EQUAL_TO_REMAINDER' },
        { value: `${chosenY + 1}, ${chosenX}`, defect: 'SWAPPED_X_AND_Y_INCORRECTLY' },
        { value: `${chosenX}, ${chosenY + 1}`, defect: 'CARELESS_DIVISION' }
      ]);
    }
    solutionSteps = `Step 1: Subtract the remainder ${r}: ${totalNum} - ${r} = ${baseMultiple}.\\nStep 2: X must be a 1-digit factor of ${baseMultiple} greater than ${r} (${formatList(validOneDigitXs)}).\\nStep 3: If X = ${chosenX}, Y = ${baseMultiple} / ${chosenX} = ${chosenY}.`;
    hint = `Subtract ${r} from ${totalNum} first, then remember the denominator X must be greater than the remainder ${r}!`;

  } else if (variant === 'advanced_extreme_bounded_fraction') {
    const d = getRandomInt(4, 9);
    const w = getRandomInt(3, 7);
    const boundaryNum = w * d;
    const askLargestBelow = Math.random() > 0.4;
    const targetNum = askLargestBelow ? boundaryNum - 1 : boundaryNum + 1;

    answer = `${targetNum}/${d}`;
    acceptedAnswers = [answer];
    askText = isStructure
      ? `STORY: ${names[0]} is looking at a number line around ${w} wholes. Invent a creative, varied Primary 4 context (e.g. measuring distance, liquid, or time) for finding the ${askLargestBelow ? 'largest' : 'smallest'} improper fraction with denominator ${d} that is ${askLargestBelow ? 'smaller' : 'greater'} than ${w} wholes.\n\nCRITICAL INSTRUCTION: Ask for the ${askLargestBelow ? 'largest' : 'smallest'} improper fraction with a denominator of ${d} that is ${askLargestBelow ? 'smaller' : 'greater'} than ${w} wholes.`
      : askLargestBelow
        ? `Find the largest improper fraction with a denominator of ${d} that is smaller than ${w} wholes.`
        : `Find the smallest improper fraction with a denominator of ${d} that is greater than ${w} wholes.`;

    visualEngineObj = {
      componentToRender: 'NUMBER_LINE_ADVANCED',
      componentData: {
        min: w - 1,
        max: w + 1,
        numIntervals: d * 2,
        markedValue: w,
        markedLabel: String(w)
      }
    };

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: 'Write the working equation to convert the whole number into an improper fraction numerator:', expectedAnswer: `${w} * ${d} = ${boundaryNum}`, acceptedAnswers: makeMulEq(w, d, boundaryNum) },
          {
            label: askLargestBelow
              ? 'Write the working equation to find the largest numerator smaller than that boundary:'
              : 'Write the working equation to find the smallest numerator greater than that boundary:',
            expectedAnswer: askLargestBelow ? `${boundaryNum} - 1 = ${targetNum}` : `${boundaryNum} + 1 = ${targetNum}`,
            acceptedAnswers: askLargestBelow
              ? makeSubEq(boundaryNum, 1, targetNum)
              : [`${boundaryNum} + 1 = ${targetNum}`, `${boundaryNum}+1=${targetNum}`, String(targetNum)]
          },
          { label: 'Final Answer:', expectedAnswer: answer, acceptedAnswers }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: `${boundaryNum}/${d}`, defect: 'PICKED_EXACT_BOUNDARY' },
        { value: `${askLargestBelow ? boundaryNum + 1 : boundaryNum - 1}/${d}`, defect: 'WRONG_DIRECTION_FROM_BOUNDARY' },
        { value: `${w - 1}/${d}`, defect: 'IGNORED_DENOMINATOR_SCALING' }
      ]);
    }
    solutionSteps = `Step 1: Convert ${w} wholes to ${UNIT_PLURALS[d]}: ${w} * ${d} = ${boundaryNum}, so ${w} = ${boundaryNum}/${d}.\\nStep 2: Step by 1 ${askLargestBelow ? 'down' : 'up'}: ${targetNum}/${d}.`;
    hint = `First express ${w} wholes as an improper fraction with denominator ${d} (${w} × ${d} = ${boundaryNum}), then adjust the numerator by 1!`;

  } else if (variant === 'advanced_fractional_shift_before_after') {
    const d = getRandomInt(4, 8);
    const wBefore = getRandomInt(2, 4);
    const rBefore = getRandomInt(1, d - 1);
    const impBefore = wBefore * d + rBefore;
    const wAfter = wBefore + getRandomInt(2, 3);
    const rAfter = getRandomInt(1, d - 1);
    const impAfter = wAfter * d + rAfter;
    const diffNum = impAfter - impBefore;

    answer = `${diffNum}/${d}`;
    acceptedAnswers = [answer];
    askText = `STORY: ${names[0]} has ${impBefore}/${d} kg of ${item} (or cooking ingredient). ${names[0]} buys some more and now has ${wAfter} ${rAfter}/${d} kg. Vary the ingredient/item naturally.\n\nCRITICAL INSTRUCTION: Ask how many kg ${names[0]} bought (express as an improper fraction).`;

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          {
            label: 'Write the working equation to convert the final amount into fractional parts (numerator):',
            expectedAnswer: `${wAfter} * ${d} + ${rAfter} = ${impAfter}`,
            acceptedAnswers: [`${wAfter} * ${d} + ${rAfter} = ${impAfter}`, `${wAfter}*${d}+${rAfter}=${impAfter}`, String(impAfter)]
          },
          { label: 'Write the working equation to find the difference in fractional parts:', expectedAnswer: `${impAfter} - ${impBefore} = ${diffNum}`, acceptedAnswers: makeSubEq(impAfter, impBefore, diffNum) },
          { label: 'Final Answer (Write as an improper fraction):', expectedAnswer: answer, acceptedAnswers }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: `${impAfter + impBefore}/${d}`, defect: 'ADDED_INSTEAD_OF_SUBTRACTED' },
        { value: `${diffNum + 1}/${d}`, defect: 'CARELESS_SUBTRACTION' },
        { value: `${Math.abs((wAfter * 1 + rAfter) - impBefore)}/${d}`, defect: 'FORGOT_TO_MULTIPLY_WHOLE_BY_DEN' }
      ]);
    }
    solutionSteps = `Step 1: Convert ${wAfter} ${rAfter}/${d} to improper fraction: (${wAfter} * ${d}) + ${rAfter} = ${impAfter}/${d}.\\nStep 2: Subtract: ${impAfter} - ${impBefore} = ${diffNum} ${UNIT_PLURALS[d]} = ${answer} kg.`;
    hint = `Convert ${wAfter} ${rAfter}/${d} into ${UNIT_PLURALS[d]} first, then subtract ${impBefore} ${UNIT_PLURALS[d]}!`;

  } else if (variant === 'advanced_shared_common_remainder_capacity') {
    const cap = getRandomInt(4, 9);
    const fullJugs = getRandomInt(4, 9);
    const rem = getRandomInt(1, cap - 1);
    const totalLiters = fullJugs * cap + rem;

    answer = `${rem}/${cap}`;
    acceptedAnswers = [answer];
    askText = isStructure
      ? `STORY: ${names[0]} pours ${totalLiters} liters of liquid into containers that each hold ${cap} liters, filling as many full containers as possible and pouring the rest into one last container. Vary the container and liquid naturally.\n\nCRITICAL INSTRUCTION: Ask what fraction of the last container is filled.`
      : `A jug holds exactly ${cap} liters. ${totalLiters} liters of water is poured into as many full jugs as possible, and the rest is poured into one last jug. What fraction of the last jug is filled with water?`;

    visualEngineObj = {
      componentToRender: 'FRACTION_BAR_VISUALIZER',
      componentData: {
        shape: 'rectangle',
        totalBars: fullJugs + 1,
        partitionsPerBar: cap,
        totalShadedBlocks: totalLiters,
        layout: 'horizontal',
        color: '#06b6d4'
      }
    };

    const eqDiv = makeDivEq(totalLiters, cap);
    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: 'Write the working equation to find how many full containers and leftover liters there are:', expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
          { label: 'How many liters are in the last container?', expectedAnswer: String(rem), acceptedAnswers: [String(rem), `${rem} L`, `${rem} liters`] },
          { label: 'Final Answer (Write the fraction of the last container that is filled):', expectedAnswer: answer, acceptedAnswers }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: `${cap - rem}/${cap}`, defect: 'GAVE_EMPTY_FRACTION_INSTEAD' },
        { value: `${fullJugs}/${cap}`, defect: 'USED_QUOTIENT_AS_NUMERATOR' },
        { value: `${rem}/${totalLiters}`, defect: 'USED_TOTAL_AS_DENOMINATOR' }
      ]);
    }
    solutionSteps = `Step 1: Divide ${totalLiters} by ${cap}: ${eqDiv.expected}.\\nStep 2: ${fullJugs} jugs are full, and the last jug has ${rem} out of ${cap} liters = ${answer}.`;
    hint = `Divide ${totalLiters} by ${cap}. The remainder tells you how many liters go into the last ${cap}-liter jug!`;

  } else {
    // advanced_unit_matching_comparative_scaling
    const d = getRandomInt(3, 6);
    const wA = getRandomInt(2, 5);
    const rA = getRandomInt(1, d - 1);
    const piecesA = wA * d + rA;
    const piecesB = getRandomInt(d + 2, d * 5 + 3);
    const totalPieces = piecesA + piecesB;

    answer = String(totalPieces);
    acceptedAnswers = [answer, `${answer} pieces`];
    askText = `STORY: ${names[0]} has ${wA} ${rA}/${d} m of a material (e.g. ribbon, rope, wire, or fabric) and ${names[1]} has ${piecesB}/${d} m. They combine them and cut them into 1/${d} m pieces. Vary the material naturally.\n\nCRITICAL INSTRUCTION: Ask how many 1/${d} m pieces they will get altogether.`;

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          {
            label: 'Write the working equation to convert the mixed number into fractional parts:',
            expectedAnswer: `${wA} * ${d} + ${rA} = ${piecesA}`,
            acceptedAnswers: [`${wA} * ${d} + ${rA} = ${piecesA}`, `${wA}*${d}+${rA}=${piecesA}`, String(piecesA)]
          },
          {
            label: 'Write the working equation to find the total number of fractional parts:',
            expectedAnswer: `${piecesA} + ${piecesB} = ${totalPieces}`,
            acceptedAnswers: [`${piecesA} + ${piecesB} = ${totalPieces}`, `${piecesA}+${piecesB}=${totalPieces}`, `${piecesB} + ${piecesA} = ${totalPieces}`, `${piecesB}+${piecesA}=${totalPieces}`]
          },
          { label: 'Final Answer (Total pieces):', expectedAnswer: answer, acceptedAnswers }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: piecesA, defect: 'FORGOT_TO_ADD_SECOND_RIBBON' },
        { value: wA + rA + piecesB, defect: 'DID_NOT_CONVERT_WHOLE_TO_UNITS' },
        { value: Math.abs(piecesB - piecesA), defect: 'SUBTRACTED_INSTEAD_OF_ADDED' }
      ]);
    }
    solutionSteps = `Step 1: Convert ${names[0]}'s ribbon to ${UNIT_PLURALS[d]}: (${wA} * ${d}) + ${rA} = ${piecesA}.\\nStep 2: Add ${names[1]}'s ${piecesB} ${UNIT_PLURALS[d]}: ${piecesA} + ${piecesB} = ${totalPieces} pieces.`;
    hint = `Convert ${wA} ${rA}/${d} into ${UNIT_PLURALS[d]} first, then add ${piecesB} ${UNIT_PLURALS[d]}!`;
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
