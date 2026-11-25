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
  const variant = activeVariant === 'advanced_default' ? 'advanced_maximizing_minimizing_quotient' : activeVariant;
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

  if (variant === 'advanced_maximizing_minimizing_quotient') {
    const digits = [2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5).slice(0, 5);
    const sortedAsc = [...digits].sort((a, b) => a - b);
    const askGreatest = Math.random() > 0.4;

    let bestDividend, bestDivisor;
    if (askGreatest) {
      bestDivisor = sortedAsc[0];
      bestDividend = Number([...sortedAsc.slice(1)].reverse().join(''));
    } else {
      bestDivisor = sortedAsc[4];
      bestDividend = Number(sortedAsc.slice(0, 4).join(''));
    }

    const q = Math.floor(bestDividend / bestDivisor);
    const rem = bestDividend % bestDivisor;
    const goalWord = askGreatest ? 'greatest' : 'smallest';
    const eqDiv = makeDivEq(bestDividend, bestDivisor);

    answer = eqDiv.expected.split('= ')[1];
    acceptedAnswers = rem === 0
      ? [answer, q.toLocaleString()]
      : [answer, `${q}R${rem}`, `${q} remainder ${rem}`];

    askText = `Using all 5 digit cards (${digits.join(', ')}), arrange them to form a 4-digit dividend and a 1-digit divisor that give the ${goalWord} possible quotient. What is that ${goalWord} quotient (with any remainder)?`;

    visualEngineObj = {
      componentToRender: 'MULTI_COMPONENT',
      componentData: {
        components: [
          {
            componentToRender: 'DIGIT_CARD_SORTER',
            componentData: { digits, condition: `${goalWord} 4-digit ÷ 1-digit quotient` }
          },
          {
            componentToRender: 'LONG_DIVISION_GRID',
            componentData: { title: `${goalWord.toUpperCase()} Quotient`, dividend: '????', divisor: '?', quotient: '?' }
          }
        ]
      }
    };

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          {
            label: `Write the 4-digit dividend and 1-digit divisor that form the ${goalWord} quotient:`,
            expectedAnswer: `${bestDividend}, ${bestDivisor}`,
            acceptedAnswers: [`${bestDividend}, ${bestDivisor}`, `${bestDividend},${bestDivisor}`, `${bestDividend} / ${bestDivisor}`, `${bestDividend}/${bestDivisor}`]
          },
          {
            label: `Write the working equation to find the ${goalWord} possible quotient:`,
            expectedAnswer: eqDiv.expected,
            acceptedAnswers: eqDiv.accepted
          }
        ]
      };
    } else if (isMCQ) {
      const altDivisor = sortedAsc[askGreatest ? 1 : 3];
      const altDividend = Number((askGreatest ? [...sortedAsc.slice(0, 1), ...sortedAsc.slice(2)].reverse() : [...sortedAsc.slice(0, 3), sortedAsc[4]]).join(''));
      const altEq = makeDivEq(altDividend, altDivisor).expected.split('= ')[1];
      mcqData = buildFourUniqueOptions(answer, [
        { value: altEq, defect: 'SUBOPTIMAL_DIGIT_PLACEMENT' },
        { value: String(q + 100), defect: 'CARELESS_DIVISION' },
        { value: String(Math.max(10, q - 100)), defect: 'CARELESS_DIVISION' }
      ]);
    }
    solutionSteps = `Step 1: To ${askGreatest ? 'maximize' : 'minimize'} a quotient, pair the ${askGreatest ? 'largest 4-digit dividend' : 'smallest 4-digit dividend'} (${bestDividend}) with the ${askGreatest ? 'smallest' : 'largest'} 1-digit divisor (${bestDivisor}).\\nStep 2: ${eqDiv.expected}.`;
    hint = `To make a quotient as ${askGreatest ? 'large' : 'small'} as possible, make the dividend ${askGreatest ? 'as large as possible' : 'as small as possible'} and the divisor ${askGreatest ? 'as small as possible' : 'as large as possible'}!`;

  } else if (variant === 'advanced_wrong_divisor_correction') {
    let a, b, qWrong, rWrong, dividend;
    do {
      a = getRandomInt(3, 9);
      b = getRandomInt(3, 9);
      qWrong = getRandomInt(350, 1400);
      rWrong = getRandomInt(1, b - 1);
      dividend = qWrong * b + rWrong;
    } while (a === b || dividend < 1000 || dividend > 9999);

    const eqCorrect = makeDivEq(dividend, a);
    const qCorrect = Math.floor(dividend / a);
    const rCorrect = dividend % a;
    const baseProd = qWrong * b;

    answer = eqCorrect.expected.split('= ')[1];
    acceptedAnswers = rCorrect === 0
      ? [answer, qCorrect.toLocaleString()]
      : [answer, `${qCorrect}R${rCorrect}`, `${qCorrect} remainder ${rCorrect}`];

    askText = `${names[0]} was supposed to divide a 4-digit number by ${a}, but accidentally divided it by ${b} and got ${qWrong.toLocaleString()} R ${rWrong}. What is the correct quotient and remainder?`;

    if (!isStructure) {
      visualEngineObj = {
        componentToRender: 'LONG_DIVISION_GRID',
        componentData: {
          title: `Wrong Divisor (${b} instead of ${a})`,
          dividend: '????',
          divisor: b,
          quotient: qWrong,
          remainder: rWrong
        }
      };
    }

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: 'Write the working equation to multiply the wrong quotient by the wrong divisor:', expectedAnswer: `${qWrong} * ${b} = ${baseProd}`, acceptedAnswers: makeMulEq(qWrong, b, baseProd) },
          { label: 'Write the working equation to add the remainder and recover the 4-digit number:', expectedAnswer: `${baseProd} + ${rWrong} = ${dividend}`, acceptedAnswers: [`${baseProd} + ${rWrong} = ${dividend}`, `${baseProd}+${rWrong}=${dividend}`, `${rWrong} + ${baseProd} = ${dividend}`, `${rWrong}+${baseProd}=${dividend}`] },
          { label: 'Write the working equation to find the correct quotient and remainder:', expectedAnswer: eqCorrect.expected, acceptedAnswers: eqCorrect.accepted }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: makeDivEq(baseProd, a).expected.split('= ')[1], defect: 'FORGOT_TO_ADD_WRONG_REMAINDER' },
        { value: `${qCorrect + 1} R ${rCorrect}`, defect: 'CARELESS_DIVISION' },
        { value: `${qWrong} R ${rWrong}`, defect: 'KEPT_WRONG_QUOTIENT' }
      ]);
    }
    solutionSteps = `Step 1: Recover the original 4-digit number: ${qWrong} * ${b} + ${rWrong} = ${dividend}.\\nStep 2: Divide by the correct divisor ${a}: ${eqCorrect.expected}.`;
    hint = `First work backwards (${qWrong.toLocaleString()} × ${b} + ${rWrong}) to recover the original 4-digit number, then divide it by ${a}!`;

  } else if (variant === 'advanced_multi_step_repacking_revenue') {
    const divisor = getRandomInt(4, 8);
    const damaged = getRandomInt(105, 320);
    const q = getRandomInt(250, 950);
    const rem = getRandomInt(1, divisor - 1);
    const goodItems = q * divisor + rem;
    const totalItems = goodItems + damaged;
    const pricePerCarton = getRandomInt(3, 8);
    const sellLoose = !isStructure && Math.random() > 0.5;
    const loosePrice = 1;
    const revenue = sellLoose ? q * pricePerCarton + rem * loosePrice : q * pricePerCarton;

    answer = String(revenue);
    acceptedAnswers = [answer, `$${answer}`, revenue.toLocaleString(), `$${revenue.toLocaleString()}`];

    askText = sellLoose
      ? `STORY: A supplier has ${totalItems.toLocaleString()} ${item}. ${damaged} are damaged and thrown away. The remaining ${item} are packed into cartons of ${divisor}. Full cartons are sold at $${pricePerCarton} each, and leftover loose ${item} are sold at $${loosePrice} each.\n\nCRITICAL INSTRUCTION: Ask for the total amount of money collected.`
      : `STORY: A supplier has ${totalItems.toLocaleString()} ${item}. ${damaged} are damaged and thrown away. The remaining ${item} are packed into cartons of ${divisor}. Only full cartons are sold at $${pricePerCarton} each.\n\nCRITICAL INSTRUCTION: Ask for the total amount of money collected from the full cartons.`;

    const eqDiv = makeDivEq(goodItems, divisor);
    if (isStructure) {
      const steps = [
        { label: `Write the working equation to find the number of good ${item}:`, expectedAnswer: `${totalItems} - ${damaged} = ${goodItems}`, acceptedAnswers: makeSubEq(totalItems, damaged, goodItems) },
        { label: `Write the working equation to find the number of full cartons and leftover ${item}:`, expectedAnswer: eqDiv.expected, acceptedAnswers: eqDiv.accepted },
        { label: 'Write the working equation to find the total amount collected from the full cartons:', expectedAnswer: `${q} * ${pricePerCarton} = ${revenue}`, acceptedAnswers: makeMulEq(q, pricePerCarton, revenue) }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'PART_WHOLE_REPACK_REVENUE',
          correctModelType: 'PART_WHOLE',
          modelOptions: ALL_MODEL_OPTIONS,
          parts: [
            { name: `Good ${item}`, value: '?', displayValue: '?' },
            { name: 'Damaged', value: String(damaged), displayValue: String(damaged), isShortfall: true }
          ],
          whole: { label: `Total ${item}`, value: totalItems, displayValue: totalItems.toLocaleString(), isTarget: false },
          target: { type: 'PART', label: `Good ${item}` },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: sellLoose ? q * pricePerCarton : q * pricePerCarton + rem, defect: 'REMAINDER_REVENUE_ERROR' },
        { value: (q + 1) * pricePerCarton, defect: 'ROUNDED_UP_CARTONS' },
        { value: Math.floor(totalItems / divisor) * pricePerCarton, defect: 'FORGOT_TO_SUBTRACT_DAMAGED' }
      ]);
    }
    solutionSteps = `Step 1: Good ${item} = ${totalItems} - ${damaged} = ${goodItems}.\\nStep 2: Full cartons = ${eqDiv.expected}.\\nStep 3: Revenue = ${q} * $${pricePerCarton}${sellLoose ? ` + $${rem}` : ''} = $${revenue}.`;
    hint = `Subtract the ${damaged} damaged ${item} first, divide by ${divisor} to find full cartons, then multiply by $${pricePerCarton}!`;

  } else if (variant === 'advanced_dual_rate_unit_comparison') {
    const d1 = getRandomInt(4, 8);
    let d2 = getRandomInt(4, 9);
    if (d2 === d1) d2 = d1 === 9 ? 7 : d1 + 1;

    const unitA = getRandomInt(450, 1450);
    const unitB = unitA - getRandomInt(40, 180);
    const totalA = unitA * d1;
    const totalB = unitB * d2;
    const unitDiff = unitA - unitB;
    const kPacks = !isStructure && Math.random() > 0.5 ? getRandomInt(2, 5) : 1;
    const finalDiff = unitDiff * kPacks;

    answer = String(finalDiff);
    acceptedAnswers = [answer, finalDiff.toLocaleString(), `${answer} g`];
    askText = kPacks === 1
      ? `STORY: Brand A sells ${d1} boxes of ${item} weighing ${totalA.toLocaleString()} g in total. Brand B sells ${d2} boxes of ${item} weighing ${totalB.toLocaleString()} g in total.\n\nCRITICAL INSTRUCTION: Ask for the difference in mass between 1 box of Brand A and 1 box of Brand B (in g).`
      : `STORY: Brand A sells ${d1} boxes of ${item} weighing ${totalA.toLocaleString()} g in total. Brand B sells ${d2} boxes of ${item} weighing ${totalB.toLocaleString()} g in total.\n\nCRITICAL INSTRUCTION: Ask for the difference in mass between ${kPacks} boxes of Brand A and ${kPacks} boxes of Brand B (in g).`;

    const eqA = makeDivEq(totalA, d1);
    const eqB = makeDivEq(totalB, d2);
    if (isStructure) {
      const steps = [
        { label: 'Write the working equation to find the mass of 1 box of Brand A:', expectedAnswer: eqA.expected, acceptedAnswers: eqA.accepted },
        { label: 'Write the working equation to find the mass of 1 box of Brand B:', expectedAnswer: eqB.expected, acceptedAnswers: eqB.accepted },
        { label: 'Write the working equation to find the difference in mass:', expectedAnswer: `${unitA} - ${unitB} = ${unitDiff}`, acceptedAnswers: makeSubEq(unitA, unitB, unitDiff) }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'COMPARISON_UNIT_RATE',
          correctModelType: 'COMPARISON',
          modelOptions: ALL_MODEL_OPTIONS,
          entities: [
            { id: 'A', name: '1 Box Brand A', value: '?', displayValue: '?', relation: 'BASE' },
            { id: 'B', name: '1 Box Brand B', value: '?', displayValue: '?', relativeTo: '1 Box Brand A', relation: 'FEWER' }
          ],
          target: { type: 'DIFFERENCE', label: 'Difference per box' },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: kPacks === 1 ? unitDiff * 2 : unitDiff, defect: 'SCALING_MISMATCH' },
        { value: Math.abs(totalA - totalB), defect: 'COMPARED_TOTALS_INSTEAD_OF_UNIT_RATES' },
        { value: finalDiff + 10, defect: 'CARELESS_DIVISION' }
      ]);
    }
    solutionSteps = `Step 1: 1 box of Brand A = ${totalA} / ${d1} = ${unitA} g.\\nStep 2: 1 box of Brand B = ${totalB} / ${d2} = ${unitB} g.\\nStep 3: Difference for 1 box = ${unitA} - ${unitB} = ${unitDiff} g.${kPacks > 1 ? `\\nStep 4: For ${kPacks} boxes: ${unitDiff} * ${kPacks} = ${finalDiff} g.` : ''}`;
    hint = `Find the mass of 1 box for Brand A and Brand B by dividing each total by its number of boxes, then subtract!`;

  } else {
    // advanced_maximum_remainder_constraint
    const divisor = getRandomInt(4, 9);
    const q = getRandomInt(Math.ceil(1100 / divisor), Math.floor(9500 / divisor));
    const askLargest = Math.random() > 0.35;
    const targetRem = askLargest ? divisor - 1 : 1;
    const baseProd = q * divisor;
    const dividend = baseProd + targetRem;

    answer = String(dividend);
    acceptedAnswers = [answer, dividend.toLocaleString()];
    askText = askLargest
      ? `When a 4-digit number is divided by ${divisor}, the quotient is ${q.toLocaleString()} and it leaves the largest possible remainder. What is the 4-digit number?`
      : `When a 4-digit number is divided by ${divisor}, the quotient is ${q.toLocaleString()} and it leaves the smallest possible non-zero remainder. What is the 4-digit number?`;

    visualEngineObj = {
      componentToRender: 'LONG_DIVISION_GRID',
      componentData: {
        title: `${askLargest ? 'Largest' : 'Smallest Non-Zero'} Remainder`,
        dividend: '????',
        divisor,
        quotient: q,
        remainder: '?'
      }
    };

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          {
            label: askLargest
              ? `What is the largest possible remainder when dividing by ${divisor}?`
              : `What is the smallest possible non-zero remainder when dividing by ${divisor}?`,
            expectedAnswer: String(targetRem),
            acceptedAnswers: [String(targetRem)]
          },
          {
            label: 'Write the working equation to multiply the quotient by the divisor:',
            expectedAnswer: `${q} * ${divisor} = ${baseProd}`,
            acceptedAnswers: makeMulEq(q, divisor, baseProd)
          },
          {
            label: 'Write the working equation to find the 4-digit number:',
            expectedAnswer: `${baseProd} + ${targetRem} = ${dividend}`,
            acceptedAnswers: [`${baseProd} + ${targetRem} = ${dividend}`, `${baseProd}+${targetRem}=${dividend}`, `${targetRem} + ${baseProd} = ${dividend}`, `${targetRem}+${baseProd}=${dividend}`]
          }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: baseProd + divisor, defect: 'USED_DIVISOR_AS_REMAINDER' },
        { value: baseProd, defect: 'FORGOT_TO_ADD_REMAINDER' },
        { value: baseProd + (askLargest ? 1 : divisor - 1), defect: 'CONFUSED_MAX_AND_MIN_REMAINDER' }
      ]);
    }
    solutionSteps = `Step 1: The ${askLargest ? 'largest' : 'smallest non-zero'} remainder when dividing by ${divisor} is ${targetRem}.\\nStep 2: Multiply quotient by divisor: ${q} * ${divisor} = ${baseProd}.\\nStep 3: Add remainder: ${baseProd} + ${targetRem} = ${dividend}.`;
    hint = `Remember: the remainder must always be less than the divisor (${divisor})!`;
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
