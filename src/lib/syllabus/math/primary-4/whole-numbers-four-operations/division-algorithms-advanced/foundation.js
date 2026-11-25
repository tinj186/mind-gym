import { getRandomNames, getPackingAndShoppingItems } from '@/lib/utils/variable-bank.js';
import {
  ALL_MODEL_OPTIONS,
  getRandomInt,
  makeDivEq,
  makeSubEq,
  makeMulEq,
  buildFourUniqueOptions,
  buildPromptPayload
} from '../../whole-numbers-factors-and-multiples/common-factors/utils.js';

const buildLongDivisionWorkoutSteps = (dividend, divisor) => {
  const digits = String(dividend).split('').map(Number);
  const placeNames = digits.length === 4 ? ['Thousands', 'Hundreds', 'Tens', 'Ones'] : ['Hundreds', 'Tens', 'Ones'];
  const lines = [];
  let rem = 0;

  digits.forEach((d, idx) => {
    const cur = rem * 10 + d;
    const qDigit = Math.floor(cur / divisor);
    const sub = qDigit * divisor;
    const newRem = cur - sub;
    const prefix = idx === 0 ? `${cur}` : `Bring down ${d} -> ${cur}`;
    lines.push(`Step ${idx + 1} (${placeNames[idx] || `Place ${idx + 1}`}): ${prefix}. ${cur} / ${divisor} = ${qDigit} R ${newRem} (write ${qDigit}, ${cur} - ${sub} = ${newRem}).`);
    rem = newRem;
  });

  const fullQ = Math.floor(dividend / divisor);
  lines.push(`Final Quotient: ${rem === 0 ? fullQ : `${fullQ} R ${rem}`}.`);
  return lines.join('\\n');
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
  const variant = activeVariant === 'foundation_default' ? 'foundation_partial_quotient_area_model' : activeVariant;
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

  if (variant === 'foundation_partial_quotient_area_model') {
    const divisor = getRandomInt(3, 9);
    const q = getRandomInt(Math.ceil(1000 / divisor), Math.floor(9999 / divisor));
    const dividend = q * divisor;
    const eqDiv = makeDivEq(dividend, divisor);

    answer = String(q);
    acceptedAnswers = [answer, q.toLocaleString()];
    askText = `Calculate ${dividend.toLocaleString()} ÷ ${divisor} using the division algorithm.`;

    visualEngineObj = {
      componentToRender: 'LONG_DIVISION_GRID',
      componentData: {
        title: `${dividend.toLocaleString()} ÷ ${divisor}`,
        dividend,
        divisor,
        quotient: '?'
      }
    };

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: 'Write the working equation for the division:', expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
          { label: 'Final Answer (Quotient):', expectedAnswer: answer, acceptedAnswers }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: q + 10, defect: 'CARELESS_DIVISION' },
        { value: q - 10 > 100 ? q - 10 : q + 20, defect: 'CARELESS_DIVISION' },
        { value: q + 100 <= 9999 ? q + 100 : q - 100, defect: 'PLACE_VALUE_ERROR' }
      ]);
    }
    solutionSteps = buildLongDivisionWorkoutSteps(dividend, divisor);
    hint = `Use long division from thousands down to ones: divide ${dividend.toLocaleString()} by ${divisor}!`;

  } else if (variant === 'foundation_internal_zero_trap') {
    const divisor = getRandomInt(3, 8);
    const zeroPattern = getRandomInt(0, 2); // 0: X0Y (e.g. 703), 1: X00Y (e.g. 2008), 2: XY0Z (e.g. 1204)
    let q;
    if (zeroPattern === 0) {
      q = getRandomInt(2, 9) * 100 + getRandomInt(2, 9);
      if (q * divisor < 1000) q = getRandomInt(Math.ceil(1000 / (divisor * 100)), 9) * 100 + getRandomInt(2, 9);
    } else if (zeroPattern === 1) {
      const th = getRandomInt(1, Math.floor(9 / divisor));
      q = th * 1000 + getRandomInt(2, 9);
    } else {
      const th = getRandomInt(1, Math.floor(9 / divisor));
      q = th * 1000 + getRandomInt(1, 5) * 100 + getRandomInt(2, 9);
    }
    const hasRem = !isStructure && Math.random() > 0.6;
    const rem = hasRem ? getRandomInt(1, divisor - 1) : 0;
    const dividend = q * divisor + rem;

    if (isStructure) {
      const k = getRandomInt(2, 3);
      const scaled = q * k;
      answer = String(scaled);
      acceptedAnswers = [answer, scaled.toLocaleString()];
      askText = `STORY: ${divisor} identical crates of ${item} weigh ${dividend.toLocaleString()} kg altogether.\n\nCRITICAL INSTRUCTION: Ask for the mass of ${k} such crates in kg.`;

      visualEngineObj = {
        componentToRender: 'LONG_DIVISION_GRID',
        componentData: { title: `${dividend.toLocaleString()} ÷ ${divisor}`, dividend, divisor, quotient: '?' }
      };
      const eq1 = makeDivEq(dividend, divisor);
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: 'Write the working equation to find the mass of 1 crate:', expectedAnswer: eq1.expected, acceptedAnswers: eq1.accepted },
          { label: `Write the working equation to find the mass of ${k} crates:`, expectedAnswer: `${q} * ${k} = ${scaled}`, acceptedAnswers: makeMulEq(q, k, scaled) }
        ]
      };
      solutionSteps = `Step 1: Mass of 1 crate = ${dividend} / ${divisor} = ${q} kg (remember the 0 placeholder in the quotient!).\\nStep 2: Mass of ${k} crates = ${q} * ${k} = ${scaled} kg.`;
      hint = `Divide ${dividend.toLocaleString()} by ${divisor} carefully—do not drop the 0 in the quotient! Then multiply by ${k}.`;
    } else {
      answer = hasRem ? `${q} R ${rem}` : String(q);
      acceptedAnswers = hasRem
        ? [`${q} R ${rem}`, `${q}R${rem}`, `${q} remainder ${rem}`]
        : [answer, q.toLocaleString()];
      askText = `Calculate ${dividend.toLocaleString()} ÷ ${divisor}.`;
      visualEngineObj = {
        componentToRender: 'LONG_DIVISION_GRID',
        componentData: { title: `${dividend.toLocaleString()} ÷ ${divisor}`, dividend, divisor, quotient: '?' }
      };
      const droppedZeroQ = Number(String(q).replace('0', ''));
      if (isMCQ) {
        mcqData = hasRem
          ? buildFourUniqueOptions(answer, [
              { value: `${droppedZeroQ} R ${rem}`, defect: 'DROPPED_QUOTIENT_ZERO' },
              { value: `${q + 10} R ${rem}`, defect: 'CARELESS_DIVISION' },
              { value: `${q} R ${divisor - rem}`, defect: 'WRONG_REMAINDER' }
            ])
          : buildFourUniqueOptions(answer, [
              { value: droppedZeroQ, defect: 'DROPPED_QUOTIENT_ZERO' },
              { value: q + 10, defect: 'PLACE_VALUE_ERROR' },
              { value: q * 10, defect: 'EXTRA_ZERO_ERROR' }
            ]);
      }
      solutionSteps = buildLongDivisionWorkoutSteps(dividend, divisor);
      hint = `When a digit (plus any brought-down remainder) is smaller than ${divisor}, write 0 in the quotient before bringing down the next digit!`;
    }

  } else if (variant === 'foundation_quotient_remainder_relationship') {
    const divisor = getRandomInt(4, 9);
    const quotient = getRandomInt(250, Math.floor(9500 / divisor));
    const rem = getRandomInt(1, divisor - 1);
    const dividend = divisor * quotient + rem;
    const subType = isStructure ? 1 : getRandomInt(1, 3);

    if (subType === 1) {
      answer = String(dividend);
      acceptedAnswers = [answer, dividend.toLocaleString()];
      askText = `When a 4-digit number is divided by ${divisor}, the quotient is ${quotient.toLocaleString()} and the remainder is ${rem}. What is the 4-digit number?`;

      if (isStructure) {
        const baseProd = quotient * divisor;
        const steps = [
          { label: 'Write the working equation to multiply the quotient by the divisor:', expectedAnswer: `${quotient} * ${divisor} = ${baseProd}`, acceptedAnswers: makeMulEq(quotient, divisor, baseProd) },
          { label: 'Write the working equation to add the remainder and find the dividend:', expectedAnswer: `${baseProd} + ${rem} = ${dividend}`, acceptedAnswers: [`${baseProd} + ${rem} = ${dividend}`, `${baseProd}+${rem}=${dividend}`, `${rem} + ${baseProd} = ${dividend}`, `${rem}+${baseProd}=${dividend}`] }
        ];
        inputRequirementObj = {
          inputType: 'INTERACTIVE_BAR_BUILDER',
          steps,
          barBuilderConfig: {
            problemType: 'PART_WHOLE_DIVIDEND_RECONSTRUCT',
            correctModelType: 'PART_WHOLE',
            modelOptions: ALL_MODEL_OPTIONS,
            parts: [
              { name: `${divisor} Equal Groups of ${quotient}`, value: '?', displayValue: '?' },
              { name: 'Remainder', value: String(rem), displayValue: String(rem), isShortfall: true }
            ],
            whole: { label: 'Dividend', value: '?', displayValue: '?', isTarget: true },
            target: { type: 'WHOLE', label: 'Dividend' },
            steps
          }
        };
      } else {
        visualEngineObj = {
          componentToRender: 'LONG_DIVISION_GRID',
          componentData: { title: 'Find the Dividend', dividend: '????', divisor, quotient, remainder: rem }
        };
        if (isMCQ) {
          mcqData = buildFourUniqueOptions(answer, [
            { value: quotient * divisor, defect: 'FORGOT_TO_ADD_REMAINDER' },
            { value: quotient * divisor - rem, defect: 'SUBTRACTED_REMAINDER' },
            { value: (quotient + rem) * divisor, defect: 'ADDED_REMAINDER_BEFORE_MULTIPLYING' }
          ]);
        }
      }
      solutionSteps = `Step 1: Multiply quotient by divisor: ${quotient} * ${divisor} = ${quotient * divisor}.\\nStep 2: Add remainder: ${quotient * divisor} + ${rem} = ${dividend}.`;
      hint = `Use Dividend = (Divisor × Quotient) + Remainder!`;
    } else if (subType === 2) {
      answer = `${quotient} R ${rem}`;
      acceptedAnswers = [`${quotient} R ${rem}`, `${quotient}R${rem}`, `${quotient} remainder ${rem}`];
      askText = `Find the quotient and remainder when ${dividend.toLocaleString()} is divided by ${divisor}.`;
      visualEngineObj = {
        componentToRender: 'LONG_DIVISION_GRID',
        componentData: { title: `${dividend.toLocaleString()} ÷ ${divisor}`, dividend, divisor, quotient: '?', remainder: '?' }
      };
      if (isMCQ) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: `${quotient} R ${divisor - rem}`, defect: 'WRONG_REMAINDER' },
          { value: `${quotient + 1} R ${rem}`, defect: 'CARELESS_QUOTIENT' },
          { value: `${quotient - 1} R ${rem}`, defect: 'CARELESS_QUOTIENT' }
        ]);
      }
      solutionSteps = `Step 1: Divide ${dividend} by ${divisor}: ${dividend} / ${divisor} = ${quotient} R ${rem}.`;
      hint = `Perform long division for ${dividend.toLocaleString()} ÷ ${divisor} and record both the quotient and remainder!`;
    } else {
      answer = String(rem);
      acceptedAnswers = [answer];
      askText = `When ${dividend.toLocaleString()} is divided by ${divisor}, the quotient is ${quotient.toLocaleString()}. What is the remainder?`;
      visualEngineObj = {
        componentToRender: 'LONG_DIVISION_GRID',
        componentData: { title: 'Find the Remainder', dividend, divisor, quotient, remainder: '?' }
      };
      if (isMCQ) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: divisor - rem, defect: 'FOUND_SHORTFALL_INSTEAD_OF_REMAINDER' },
          { value: rem + 1 < divisor ? rem + 1 : 0, defect: 'CARELESS_SUBTRACTION' },
          { value: divisor, defect: 'REMAINDER_EQUALS_DIVISOR' }
        ]);
      }
      solutionSteps = `Step 1: Multiply ${quotient} * ${divisor} = ${quotient * divisor}.\\nStep 2: Subtract from dividend: ${dividend} - ${quotient * divisor} = ${rem}.`;
      hint = `Multiply ${quotient} × ${divisor}, then subtract that from ${dividend.toLocaleString()} to find the remainder!`;
    }

  } else if (variant === 'foundation_direct_equal_sharing') {
    const divisor = getRandomInt(3, 9);
    const q = getRandomInt(180, Math.floor(9000 / divisor));
    const rem = getRandomInt(1, divisor - 1);
    const total = q * divisor + rem;
    const extra = getRandomInt(115, 350);
    const classTotal = q + extra;

    answer = String(classTotal);
    acceptedAnswers = [answer, classTotal.toLocaleString(), `${answer} ${item}`];
    askText = `STORY: ${total.toLocaleString()} ${item} are shared equally among ${divisor} classes, with any leftovers kept aside. Class A already had ${extra} ${item}.\n\nCRITICAL INSTRUCTION: Ask how many ${item} Class A has altogether after receiving its equal share.`;

    const eqDiv = makeDivEq(total, divisor);
    if (isStructure) {
      const steps = [
        { label: `Write the working equation to find how many ${item} each class receives and any leftovers:`, expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
        { label: `Write the working equation to find Class A's total ${item}:`, expectedAnswer: `${q} + ${extra} = ${classTotal}`, acceptedAnswers: [`${q} + ${extra} = ${classTotal}`, `${q}+${extra}=${classTotal}`, `${extra} + ${q} = ${classTotal}`, `${extra}+${q}=${classTotal}`] }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'PART_WHOLE_SHARING',
          correctModelType: 'PART_WHOLE',
          modelOptions: ALL_MODEL_OPTIONS,
          parts: [
            { name: 'Equal Share', value: '?', displayValue: '?' },
            { name: 'Leftover', value: '?', displayValue: '?', isShortfall: true }
          ],
          whole: { label: `Total ${item}`, value: total, displayValue: total.toLocaleString(), isTarget: false },
          target: { type: 'PART', label: 'Equal Share' },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: q, defect: 'FORGOT_TO_ADD_EXISTING' },
        { value: classTotal + rem, defect: 'ADDED_LEFTOVER_REMAINDER' },
        { value: q - extra > 0 ? q - extra : classTotal + 100, defect: 'SUBTRACTED_INSTEAD_OF_ADDED' }
      ]);
    }
    solutionSteps = `Step 1: Divide ${total} by ${divisor}: ${eqDiv.expected}. Each class gets ${q} ${item}.\\nStep 2: Add Class A's existing ${extra}: ${q} + ${extra} = ${classTotal}.`;
    hint = `Divide ${total.toLocaleString()} by ${divisor} to find 1 equal share, then add ${extra}!`;

  } else {
    // foundation_estimation_vs_exact_quotient
    const divisor = getRandomInt(3, 9);
    const estQ = getRandomInt(3, 9) * 100;
    const compatDiv = estQ * divisor;
    const deltaQ = getRandomInt(2, 9);
    const goUp = Math.random() > 0.5;
    const exactQ = goUp ? estQ + deltaQ : estQ - deltaQ;
    const dividend = exactQ * divisor;
    const diff = Math.abs(estQ - exactQ);

    answer = String(diff);
    acceptedAnswers = [answer];
    askText = `Estimate ${dividend.toLocaleString()} ÷ ${divisor} by rounding ${dividend.toLocaleString()} to the compatible multiple ${compatDiv.toLocaleString()}. Then calculate the exact quotient and find the difference between the estimated quotient and the exact quotient.`;

    const eqEst = makeDivEq(compatDiv, divisor);
    const eqExact = makeDivEq(dividend, divisor);
    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: `Write the working equation for the estimated quotient using a compatible multiple of ${divisor}:`, expectedAnswer: eqEst.expected, acceptedAnswers: eqEst.accepted },
          { label: 'Write the working equation for the exact quotient:', expectedAnswer: eqExact.expected, acceptedAnswers: eqExact.accepted },
          {
            label: 'Write the working equation to find the difference between the estimate and exact quotient:',
            expectedAnswer: `${Math.max(estQ, exactQ)} - ${Math.min(estQ, exactQ)} = ${diff}`,
            acceptedAnswers: makeSubEq(Math.max(estQ, exactQ), Math.min(estQ, exactQ), diff)
          }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: exactQ, defect: 'ANSWERED_EXACT_QUOTIENT_INSTEAD' },
        { value: estQ, defect: 'ANSWERED_ESTIMATED_QUOTIENT_INSTEAD' },
        { value: diff + 1, defect: 'CARELESS_SUBTRACTION' }
      ]);
    }
    solutionSteps = `Step 1: Estimated quotient = ${compatDiv} / ${divisor} = ${estQ}.\\nStep 2: Exact quotient = ${dividend} / ${divisor} = ${exactQ}.\\nStep 3: Difference = ${Math.max(estQ, exactQ)} - ${Math.min(estQ, exactQ)} = ${diff}.`;
    hint = `Divide ${compatDiv.toLocaleString()} by ${divisor} for the estimate, divide ${dividend.toLocaleString()} by ${divisor} for the exact quotient, then subtract!`;
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
