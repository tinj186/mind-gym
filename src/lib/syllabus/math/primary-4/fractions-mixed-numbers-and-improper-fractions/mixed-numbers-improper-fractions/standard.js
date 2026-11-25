import { getRandomNames, getPackingAndShoppingItems } from '../../../../../utils/variable-bank.js';
import {
  ALL_MODEL_OPTIONS,
  getRandomInt,
  getGCF,
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
  9: 'ninths',
  10: 'tenths'
};

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
  const variant = activeVariant === 'standard_default' ? 'standard_division_equal_sharing' : activeVariant;
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

  if (variant === 'standard_division_equal_sharing') {
    let y, q, r, x;
    do {
      y = getRandomInt(3, 9);
      q = getRandomInt(2, 6);
      r = getRandomInt(1, y - 1);
      x = q * y + r;
    } while (getGCF(r, y) !== 1);

    const mixedStr = `${q} ${r}/${y}`;
    answer = mixedStr;
    acceptedAnswers = [mixedStr];
    askText = `STORY: ${x} ${item} (or shareable items) are divided equally among ${y} people/groups. Invent a creative, varied Primary 4 story and setting from scratch.\n\nCRITICAL INSTRUCTION: Ask how many each person/group gets, expressed as a mixed number in its simplest form.`;

    const eqDiv = makeDivEq(x, y);
    if (isStructure) {
      const steps = [
        { label: 'Write the working equation to divide the total equally and find the quotient and remainder:', expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
        { label: 'Final Answer (Write as a mixed number):', expectedAnswer: answer, acceptedAnswers }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'PART_WHOLE_EQUAL_SHARING_FRACTION',
          correctModelType: 'PART_WHOLE',
          modelOptions: ALL_MODEL_OPTIONS,
          parts: [
            { name: '1 Child Share', value: '?', displayValue: '?' },
            { name: `Remaining ${y - 1} Shares`, value: '?', displayValue: '?' }
          ],
          whole: { label: `Total ${item}`, value: x, displayValue: String(x), isTarget: false },
          target: { type: 'PART', label: '1 Child Share' },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: `${q} ${y - r}/${y}`, defect: 'USED_COMPLEMENT_REMAINDER' },
        { value: `${r} ${q}/${y}`, defect: 'SWAPPED_WHOLE_AND_NUMERATOR' },
        { value: `${q} ${r}/${x}`, defect: 'USED_TOTAL_AS_DENOMINATOR' }
      ]);
    }
    solutionSteps = `Step 1: Divide ${x} by ${y}: ${eqDiv.expected}.\\nStep 2: Write the quotient ${q} as the whole number and the remainder ${r} over ${y}: ${mixedStr}.`;
    hint = `Divide ${x} by ${y}. The quotient is the whole number, and the remainder over ${y} is the fraction!`;

  } else if (variant === 'standard_cross_format_comparison') {
    const den = getRandomInt(4, 9);
    const whole = getRandomInt(2, 6);
    let rImp, rMix;
    do {
      rImp = getRandomInt(1, den - 1);
      rMix = getRandomInt(1, den - 1);
    } while (rImp === rMix);

    const impNum = whole * den + rImp;
    const impStr = `${impNum}/${den}`;
    const mixStr = `${whole} ${rMix}/${den}`;
    const askGreater = Math.random() > 0.5;
    const impIsGreater = rImp > rMix;
    const targetIsImp = askGreater ? impIsGreater : !impIsGreater;

    answer = targetIsImp ? impStr : mixStr;
    acceptedAnswers = [answer];
    askText = isStructure
      ? `STORY: Compare two quantities: ${impStr} and ${mixStr}. Invent a creative, varied Primary 4 story comparing two people's items, distances, weights, or volumes (e.g. ${names[0]} and another person).\n\nCRITICAL INSTRUCTION: Ask which fraction/amount is ${askGreater ? 'greater' : 'smaller'}, written in its original form.`
      : `Compare ${impStr} and ${mixStr}. Which fraction is ${askGreater ? 'greater' : 'smaller'}? (Write your answer in its original form.)`;

    const eqDiv = makeDivEq(impNum, den);
    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: 'Write the working equation to convert the improper fraction to a mixed number:', expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
          { label: `Final Answer (State the ${askGreater ? 'greater' : 'smaller'} fraction in its original form):`, expectedAnswer: answer, acceptedAnswers }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: targetIsImp ? mixStr : impStr, defect: 'PICKED_OPPOSITE_EXTREME' },
        { value: `${whole} ${rImp}/${den}`, defect: 'CONVERTED_INSTEAD_OF_ORIGINAL_FORM' },
        { value: 'They are equal', defect: 'CARELESS_COMPARISON' }
      ]);
    }
    solutionSteps = `Step 1: Convert ${impStr} to a mixed number: ${eqDiv.expected} -> ${whole} ${rImp}/${den}.\\nStep 2: Compare ${whole} ${rImp}/${den} and ${mixStr}. The ${askGreater ? 'greater' : 'smaller'} fraction is ${answer}.`;
    hint = `Convert ${impStr} into a mixed number first so both are in the same form, then compare!`;

  } else if (variant === 'standard_additive_decomposition') {
    const den = getRandomInt(4, 9);
    const whole = getRandomInt(3, 6);
    const num = getRandomInt(1, den - 2);
    const borrowedWhole = whole - 1;
    const missingNum = den + num;

    answer = String(missingNum);
    acceptedAnswers = [answer];
    askText = isStructure
      ? `STORY: ${names[0]} has ${whole} ${num}/${den} of ${item} and regroups 1 whole into ${UNIT_PLURALS[den]} to match ${whole} ${num}/${den} = ${borrowedWhole} + ?/${den}. Invent a creative, varied Primary 4 story from scratch.\n\nCRITICAL INSTRUCTION: Ask for the missing numerator '?'.`
      : `Find the missing numerator '?': ${whole} ${num}/${den} = ${borrowedWhole} + ?/${den}`;

    visualEngineObj = {
      componentToRender: 'FRACTION_BAR_VISUALIZER',
      componentData: {
        shape: 'rectangle',
        totalBars: whole + 1,
        partitionsPerBar: den,
        totalShadedBlocks: whole * den + num,
        layout: 'horizontal',
        color: '#6366f1'
      }
    };

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: 'Write the working equation to convert 1 borrowed whole into fractional parts:', expectedAnswer: `1 * ${den} = ${den}`, acceptedAnswers: makeMulEq(1, den, den) },
          { label: 'Write the working equation to add the existing fractional parts:', expectedAnswer: `${den} + ${num} = ${missingNum}`, acceptedAnswers: [`${den} + ${num} = ${missingNum}`, `${den}+${num}=${missingNum}`, `${num} + ${den} = ${missingNum}`, `${num}+${den}=${missingNum}`] },
          { label: 'Final Answer (The missing numerator):', expectedAnswer: answer, acceptedAnswers }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: num, defect: 'FORGOT_BORROWED_WHOLE' },
        { value: den - num, defect: 'SUBTRACTED_INSTEAD_OF_ADDED' },
        { value: whole * den + num, defect: 'CONVERTED_ENTIRE_MIXED_NUMBER' }
      ]);
    }
    solutionSteps = `Step 1: Borrow 1 whole = ${den}/${den}.\\nStep 2: Add the existing ${num}/${den}: ${den} + ${num} = ${missingNum}.\\nStep 3: So ${whole} ${num}/${den} = ${borrowedWhole} + ${missingNum}/${den}.`;
    hint = `1 whole was borrowed from ${whole} to make ${borrowedWhole}. Convert that 1 whole into ${den}/${den} and add ${num}/${den}!`;

  } else if (variant === 'standard_assembly_disassembly_word') {
    const den = getRandomInt(4, 8);
    const wholes = getRandomInt(4, 7);
    const totalPieces = wholes * den;
    let soldPieces;
    do {
      soldPieces = getRandomInt(den + 1, totalPieces - den - 1);
    } while ((totalPieces - soldPieces) % den === 0);

    const leftPieces = totalPieces - soldPieces;
    const leftWhole = Math.floor(leftPieces / den);
    const leftRem = leftPieces % den;
    const mixedStr = `${leftWhole} ${leftRem}/${den}`;

    answer = mixedStr;
    acceptedAnswers = [mixedStr];
    askText = `STORY: ${names[0]} cuts ${wholes} whole ${item} (or cakes/pizzas) into ${UNIT_PLURALS[den]} and sells or gives away ${soldPieces} pieces. Vary the food/whole item naturally.\n\nCRITICAL INSTRUCTION: Ask how many whole items ${names[0]} has left, expressed as a mixed number.`;

    const eqDiv = makeDivEq(leftPieces, den);
    if (isStructure) {
      const steps = [
        { label: 'Write the working equation to find the total number of pieces:', expectedAnswer: `${wholes} * ${den} = ${totalPieces}`, acceptedAnswers: makeMulEq(wholes, den, totalPieces) },
        { label: 'Write the working equation to find the number of pieces left:', expectedAnswer: `${totalPieces} - ${soldPieces} = ${leftPieces}`, acceptedAnswers: makeSubEq(totalPieces, soldPieces, leftPieces) },
        { label: 'Write the working equation to convert the leftover pieces into a mixed number:', expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
        { label: 'Final Answer (Mixed number):', expectedAnswer: answer, acceptedAnswers }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'PART_WHOLE_PIECES_LEFT',
          correctModelType: 'PART_WHOLE',
          modelOptions: ALL_MODEL_OPTIONS,
          parts: [
            { name: 'Sold Pieces', value: String(soldPieces), displayValue: String(soldPieces) },
            { name: 'Leftover Pieces', value: '?', displayValue: '?' }
          ],
          whole: { label: `Total ${UNIT_PLURALS[den]}`, value: totalPieces, displayValue: String(totalPieces), isTarget: false },
          target: { type: 'PART', label: 'Leftover Pieces' },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: `${leftPieces}/${den}`, defect: 'GAVE_IMPROPER_INSTEAD_OF_MIXED' },
        { value: `${leftWhole} ${den - leftRem}/${den}`, defect: 'USED_COMPLEMENT_REMAINDER' },
        { value: `${leftWhole + 1} ${leftRem}/${den}`, defect: 'CARELESS_DIVISION' }
      ]);
    }
    solutionSteps = `Step 1: Total pieces = ${wholes} * ${den} = ${totalPieces}.\\nStep 2: Pieces left = ${totalPieces} - ${soldPieces} = ${leftPieces}.\\nStep 3: Convert to mixed number: ${eqDiv.expected} -> ${mixedStr}.`;
    hint = `Multiply ${wholes} by ${den} to get total pieces, subtract ${soldPieces}, then divide by ${den} to write as a mixed number!`;

  } else {
    // standard_quotients_remainders_mapping
    const y = getRandomInt(4, 9);
    const q = getRandomInt(3, 8);
    const r = getRandomInt(1, y - 1);
    const x = q * y + r;
    const eqDiv = makeDivEq(x, y);

    answer = `${q} ${r}/${y}`;
    acceptedAnswers = [answer];
    askText = isStructure
      ? `STORY: ${names[0]} divides ${x} ${item} equally among ${y} groups, represented as ${x}/${y}. Invent a creative, varied Primary 4 story from scratch.\n\nCRITICAL INSTRUCTION: Ask to divide ${x} by ${y} and express ${x}/${y} as a mixed number.`
      : `Divide ${x} by ${y} and express ${x}/${y} as a mixed number.`;

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: 'Write the working equation for the division:', expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
          { label: 'The whole number part is:', expectedAnswer: String(q), acceptedAnswers: [String(q)] },
          { label: 'The numerator of the remaining fraction is:', expectedAnswer: String(r), acceptedAnswers: [String(r)] }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: `${r} ${q}/${y}`, defect: 'SWAPPED_QUOTIENT_AND_REMAINDER' },
        { value: `${q} ${y - r}/${y}`, defect: 'USED_COMPLEMENT_REMAINDER' },
        { value: `${q + 1} ${r}/${y}`, defect: 'CARELESS_DIVISION' }
      ]);
    }
    solutionSteps = `Step 1: ${eqDiv.expected}.\\nStep 2: Quotient ${q} is the whole number, remainder ${r} is the numerator over ${y}: ${answer}.`;
    hint = `Divide ${x} by ${y}: Quotient = whole number, Remainder = numerator, Divisor (${y}) = denominator!`;
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
