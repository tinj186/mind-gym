import { getRandomNames, getPackingAndShoppingItems } from '../../../../../utils/variable-bank.js';
import {
  getRandomInt,
  getGCF,
  makeDivEq,
  makeMulEq,
  buildFourUniqueOptions,
  buildPromptPayload
} from '../../whole-numbers-factors-and-multiples/common-factors/utils.js';

const UNIT_NAMES = {
  2: 'half',
  3: 'third',
  4: 'quarter',
  5: 'fifth',
  6: 'sixth',
  7: 'seventh',
  8: 'eighth',
  9: 'ninth',
  10: 'tenth',
  11: 'eleventh',
  12: 'twelfth'
};

const UNIT_PLURALS = {
  2: 'halves',
  3: 'thirds',
  4: 'quarters',
  5: 'fifths',
  6: 'sixths',
  7: 'sevenths',
  8: 'eighths',
  9: 'ninths',
  10: 'tenths',
  11: 'elevenths',
  12: 'twelfths'
};

const pickReducedFraction = (minDen = 3, maxDen = 12) => {
  let den, num;
  do {
    den = getRandomInt(minDen, maxDen);
    num = getRandomInt(1, den - 1);
  } while (getGCF(num, den) !== 1);
  return { num, den };
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
  const variant = activeVariant === 'foundation_default' ? 'foundation_visual_translation' : activeVariant;
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

  if (variant === 'foundation_visual_translation') {
    const { num, den } = pickReducedFraction(3, 10);
    const whole = getRandomInt(1, 4);
    const totalShaded = whole * den + num;
    const totalShapes = whole + 1;
    const usePizza = Math.random() > 0.5;
    const askImproper = isStructure || Math.random() > 0.5;
    const mixedStr = `${whole} ${num}/${den}`;
    const improperStr = `${totalShaded}/${den}`;

    visualEngineObj = usePizza
      ? {
          componentToRender: 'FRACTION_PIZZA_VISUALIZER',
          componentData: {
            shape: 'circle',
            totalShapes,
            denominator: den,
            shadedParts: totalShaded,
            color: '#3b82f6'
          }
        }
      : {
          componentToRender: 'FRACTION_BAR_VISUALIZER',
          componentData: {
            shape: 'rectangle',
            totalBars: totalShapes,
            partitionsPerBar: den,
            totalShadedBlocks: totalShaded,
            layout: 'horizontal',
            color: '#10b981'
          }
        };

    if (askImproper) {
      answer = improperStr;
      acceptedAnswers = [improperStr];
      askText = isStructure
        ? `STORY: ${names[0]} is working with ${item} (or food/objects cut into ${den} equal parts) represented by the shaded parts in the diagram. Invent a creative, varied Primary 4 story from scratch (vary the setting and context each time).\n\nCRITICAL INSTRUCTION: Ask to express the shaded fraction shown in the diagram as an improper fraction.`
        : `Express the shaded fraction shown in the diagram as an improper fraction.`;
      if (isStructure) {
        inputRequirementObj = {
          inputType: 'MULTI_STEP_INPUT',
          steps: [
            { label: 'Write the working equation to find the total number of fractional parts in the whole shapes:', expectedAnswer: `${whole} * ${den} = ${whole * den}`, acceptedAnswers: makeMulEq(whole, den, whole * den) },
            { label: 'Write the working equation to add the remaining shaded parts:', expectedAnswer: `${whole * den} + ${num} = ${totalShaded}`, acceptedAnswers: [`${whole * den} + ${num} = ${totalShaded}`, `${whole * den}+${num}=${totalShaded}`, `${num} + ${whole * den} = ${totalShaded}`, `${num}+${whole * den}=${totalShaded}`] },
            { label: 'Final Answer (Write as an improper fraction):', expectedAnswer: answer, acceptedAnswers }
          ]
        };
      } else if (isMCQ) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: mixedStr, defect: 'GAVE_MIXED_INSTEAD_OF_IMPROPER' },
          { value: `${whole + num}/${den}`, defect: 'ADDED_WHOLE_AND_NUMERATOR' },
          { value: `${totalShaded}/${totalShapes * den}`, defect: 'USED_TOTAL_SLICES_AS_DENOMINATOR' }
        ]);
      }
      solutionSteps = `Step 1: ${whole} whole(s) = ${whole} * ${den} = ${whole * den} ${UNIT_PLURALS[den]}.\\nStep 2: Add ${num} shaded part(s): ${whole * den} + ${num} = ${totalShaded}.\\nStep 3: Improper fraction = ${improperStr}.`;
      hint = `Multiply the number of whole shapes (${whole}) by ${den}, then add the ${num} shaded parts in the last shape!`;
    } else {
      answer = mixedStr;
      acceptedAnswers = [mixedStr];
      askText = `Express the shaded fraction shown in the diagram as a mixed number in its simplest form.`;
      if (isMCQ) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: improperStr, defect: 'GAVE_IMPROPER_INSTEAD_OF_MIXED' },
          { value: `${whole} ${den - num}/${den}`, defect: 'COUNTED_UNSHADED_PARTS' },
          { value: `${whole + 1} ${num}/${den}`, defect: 'MISCOUNTED_WHOLE_SHAPES' }
        ]);
      }
      solutionSteps = `Step 1: There are ${whole} completely shaded whole shape(s).\\nStep 2: The partially shaded shape has ${num} out of ${den} parts shaded (${num}/${den}).\\nStep 3: Mixed number = ${mixedStr}.`;
      hint = `Count how many whole shapes are completely shaded, then write the fraction for the remaining partially shaded shape!`;
    }

  } else if (variant === 'foundation_direct_conversion_equation') {
    const { num, den } = pickReducedFraction(3, 9);
    const whole = getRandomInt(2, 6);
    const impNum = whole * den + num;
    const eqType = isStructure ? 2 : getRandomInt(1, 3);

    if (eqType === 1) {
      // Find improper numerator X: whole num/den = ?/den
      answer = String(impNum);
      acceptedAnswers = [answer];
      askText = `Find the missing numerator '?': ${whole} ${num}/${den} = ?/${den}`;
      if (isMCQ) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: whole * num + den, defect: 'MULTIPLIED_WHOLE_BY_NUMERATOR' },
          { value: whole + num, defect: 'ADDED_WHOLE_AND_NUMERATOR' },
          { value: whole * den, defect: 'FORGOT_TO_ADD_NUMERATOR' }
        ]);
      }
      solutionSteps = `Step 1: Multiply whole by denominator: ${whole} * ${den} = ${whole * den}.\\nStep 2: Add numerator: ${whole * den} + ${num} = ${impNum}.`;
      hint = `Multiply ${whole} by ${den}, then add ${num}!`;
    } else if (eqType === 2) {
      // Find whole number A: impNum/den = ? num/den
      answer = String(whole);
      acceptedAnswers = [answer];
      askText = isStructure
        ? `STORY: ${names[0]} has ${impNum}/${den} units of ${item} and wants to express it as ? ${num}/${den} (equation: ${impNum}/${den} = ? ${num}/${den}). Invent a creative, varied Primary 4 story from scratch (e.g. baking, crafts, sports, or packing) that leads to finding the missing whole number '?'.\n\nCRITICAL INSTRUCTION: Ask for the missing whole number '?'.`
        : `Find the missing whole number '?': ${impNum}/${den} = ? ${num}/${den}`;
      const eqDiv = makeDivEq(impNum, den);
      if (isStructure) {
        inputRequirementObj = {
          inputType: 'MULTI_STEP_INPUT',
          steps: [
            { label: 'Write the working equation to find how many whole groups there are:', expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
            { label: 'Final Answer (The missing whole number):', expectedAnswer: answer, acceptedAnswers }
          ]
        };
      } else if (isMCQ) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: num, defect: 'CONFUSED_WHOLE_WITH_REMAINDER' },
          { value: whole + 1, defect: 'CARELESS_DIVISION' },
          { value: whole - 1, defect: 'CARELESS_DIVISION' }
        ]);
      }
      solutionSteps = `Step 1: Divide ${impNum} by ${den}: ${eqDiv.expected}.\\nStep 2: The quotient ${whole} is the whole number.`;
      hint = `Divide ${impNum} by ${den}—the quotient gives the whole number!`;
    } else {
      // Find remainder numerator B: impNum/den = whole ?/den
      answer = String(num);
      acceptedAnswers = [answer];
      askText = `Find the missing numerator '?': ${impNum}/${den} = ${whole} ?/${den}`;
      if (isMCQ) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: den - num, defect: 'FOUND_SHORTFALL_INSTEAD_OF_REMAINDER' },
          { value: whole, defect: 'CONFUSED_REMAINDER_WITH_WHOLE' },
          { value: num + 1 < den ? num + 1 : 1, defect: 'CARELESS_SUBTRACTION' }
        ]);
      }
      solutionSteps = `Step 1: ${whole} wholes = ${whole} * ${den} = ${whole * den}.\\nStep 2: Remainder = ${impNum} - ${whole * den} = ${num}.`;
      hint = `Subtract ${whole} × ${den} from ${impNum} to find the remaining numerator!`;
    }

  } else if (variant === 'foundation_unit_deduction') {
    const { num, den } = pickReducedFraction(2, 12);
    const whole = getRandomInt(2, 6);
    const totalUnits = whole * den + num;
    const unitPlural = UNIT_PLURALS[den];

    answer = String(totalUnits);
    acceptedAnswers = [answer, `${answer} ${unitPlural}`];
    askText = isStructure
      ? `STORY: ${names[0]} has ${whole} ${num}/${den} wholes of ${item} (or length/food/material) and divides each whole into ${den} equal parts. Invent a creative, varied Primary 4 story from scratch (vary the setting, action, and object naturally).\n\nCRITICAL INSTRUCTION: Ask how many ${unitPlural} there are in ${whole} ${num}/${den}.`
      : `How many ${unitPlural} are there in ${whole} ${num}/${den}?`;

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: 'Write the working equation to find how many fractional parts are in the whole number:', expectedAnswer: `${whole} * ${den} = ${whole * den}`, acceptedAnswers: makeMulEq(whole, den, whole * den) },
          { label: 'Write the working equation to add the remaining fractional parts:', expectedAnswer: `${whole * den} + ${num} = ${totalUnits}`, acceptedAnswers: [`${whole * den} + ${num} = ${totalUnits}`, `${whole * den}+${num}=${totalUnits}`, `${num} + ${whole * den} = ${totalUnits}`, `${num}+${whole * den}=${totalUnits}`] },
          { label: 'Final Answer:', expectedAnswer: answer, acceptedAnswers }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: whole * den, defect: 'FORGOT_TO_ADD_FRACTIONAL_PARTS' },
        { value: whole + num, defect: 'ADDED_WHOLE_AND_NUMERATOR' },
        { value: num, defect: 'COUNTED_ONLY_REMAINDER_PARTS' }
      ]);
    }
    solutionSteps = `Step 1: In ${whole} wholes, there are ${whole} * ${den} = ${whole * den} ${unitPlural}.\\nStep 2: Add ${num} more: ${whole * den} + ${num} = ${totalUnits} ${unitPlural}.`;
    hint = `1 whole = ${den} ${unitPlural}. Multiply ${whole} by ${den}, then add ${num}!`;

  } else if (variant === 'foundation_number_line_placement') {
    const { num, den } = pickReducedFraction(3, 6);
    const whole = getRandomInt(1, 3);
    const impNum = whole * den + num;
    const maxWhole = whole + 1;
    const askImproper = isStructure || Math.random() > 0.5;
    const mixedStr = `${whole} ${num}/${den}`;
    const improperStr = `${impNum}/${den}`;

    answer = askImproper ? improperStr : mixedStr;
    acceptedAnswers = [answer];
    askText = isStructure
      ? `STORY: ${names[0]} marks a point '?' on a number line from 0 to ${maxWhole}. Invent a creative, varied Primary 4 real-world context (e.g. running track, ribbon measurement, trail map, or water gauge) for the number line.\n\nCRITICAL INSTRUCTION: Ask to express the position marked '?' as an improper fraction.`
      : askImproper
        ? `Look at the number line from 0 to ${maxWhole}. Express the position marked '?' as an improper fraction.`
        : `Look at the number line from 0 to ${maxWhole}. Express the position marked '?' as a mixed number.`;

    visualEngineObj = {
      componentToRender: 'NUMBER_LINE_ADVANCED',
      componentData: {
        min: 0,
        max: maxWhole,
        numIntervals: maxWhole * den,
        markedValue: Number((impNum / den).toFixed(4)),
        markedLabel: '?'
      }
    };

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: 'Count the gaps between consecutive whole numbers to find the denominator:', expectedAnswer: String(den), acceptedAnswers: [String(den)] },
          {
            label: "Write the working equation to find the total number of fractional intervals from 0 to '?':",
            expectedAnswer: `${whole} * ${den} + ${num} = ${impNum}`,
            acceptedAnswers: [`${whole} * ${den} + ${num} = ${impNum}`, `${whole}*${den}+${num}=${impNum}`, String(impNum)]
          },
          { label: 'Final Answer:', expectedAnswer: answer, acceptedAnswers }
        ]
      };
    } else if (isMCQ) {
      mcqData = askImproper
        ? buildFourUniqueOptions(answer, [
            { value: mixedStr, defect: 'GAVE_MIXED_INSTEAD_OF_IMPROPER' },
            { value: `${impNum + 1}/${den}`, defect: 'OFF_BY_ONE_TICK' },
            { value: `${impNum - 1}/${den}`, defect: 'OFF_BY_ONE_TICK' }
          ])
        : buildFourUniqueOptions(answer, [
            { value: improperStr, defect: 'GAVE_IMPROPER_INSTEAD_OF_MIXED' },
            { value: `${whole} ${num + 1 < den ? num + 1 : 1}/${den}`, defect: 'OFF_BY_ONE_TICK' },
            { value: `${whole + 1} ${num}/${den}`, defect: 'MISREAD_WHOLE_NUMBER' }
          ]);
    }
    solutionSteps = `Step 1: Each whole unit is divided into ${den} equal parts (denominator = ${den}).\\nStep 2: '?' is ${num} ticks past ${whole}, which is ${mixedStr} = ${improperStr}.`;
    hint = `Count how many equal spaces make 1 whole to find the denominator, then count the ticks from 0 (or from ${whole})!`;

  } else {
    // foundation_whole_number_equivalence
    const w = getRandomInt(2, 9);
    const d = getRandomInt(2, 12);
    const num = w * d;

    answer = `${num}/${d}`;
    acceptedAnswers = [answer];
    askText = isStructure
      ? `STORY: ${names[0]} has ${w} whole ${item} (or cakes/bars/sheets) and splits each whole into ${d} equal parts. Invent a creative, varied Primary 4 story from scratch.\n\nCRITICAL INSTRUCTION: Ask to express ${w} as an improper fraction with a denominator of ${d}.`
      : `Express ${w} as an improper fraction with a denominator of ${d}.`;

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: 'Write the working equation to find the numerator when expressed with the given denominator:', expectedAnswer: `${w} * ${d} = ${num}`, acceptedAnswers: makeMulEq(w, d, num) },
          { label: 'Final Answer:', expectedAnswer: answer, acceptedAnswers }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: `${w}/${d}`, defect: 'DID_NOT_SCALE_NUMERATOR' },
        { value: `${w + d}/${d}`, defect: 'ADDED_INSTEAD_OF_MULTIPLIED' },
        { value: `${d}/${num}`, defect: 'INVERTED_FRACTION' }
      ]);
    }
    solutionSteps = `Step 1: 1 whole = ${d}/${d}.\\nStep 2: ${w} wholes = ${w} * ${d} = ${num} ${UNIT_PLURALS[d]}, so ${w} = ${num}/${d}.`;
    hint = `Since 1 whole = ${d}/${d}, multiply ${w} by ${d} to find the numerator!`;
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
