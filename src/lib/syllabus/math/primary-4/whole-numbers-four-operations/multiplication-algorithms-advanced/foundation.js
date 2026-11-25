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

const decomposeDigits = (n) => {
  const s = String(n);
  const parts = [];
  for (let i = 0; i < s.length; i++) {
    const d = Number(s[i]);
    if (d > 0) parts.push(d * 10 ** (s.length - 1 - i));
  }
  return parts;
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
  const variant = activeVariant === 'foundation_default' ? 'foundation_partial_products_area_model' : activeVariant;
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

  if (variant === 'foundation_partial_products_area_model') {
    const is3by2 = isStructure || Math.random() > 0.35;
    if (is3by2) {
      const h = getRandomInt(1, 5);
      const t = getRandomInt(1, 9);
      const o = getRandomInt(1, 9);
      const a = h * 100 + t * 10 + o;
      const bTens = getRandomInt(1, 5) * 10;
      const bOnes = getRandomInt(2, 9);
      const b = bTens + bOnes;

      const onesProd = a * bOnes;
      const tensProd = a * bTens;
      const totalProd = onesProd + tensProd;

      const topParts = [h * 100, t * 10, o];
      const sideParts = [bTens, bOnes];
      const fullCells = sideParts.map((sp) => topParts.map((tp) => sp * tp));

      const subMode = isStructure ? 'sum' : ['cell', 'sum', 'factor'][getRandomInt(0, 2)];

      if (subMode === 'cell') {
        const rIdx = getRandomInt(0, 1);
        const cIdx = getRandomInt(0, 2);
        const missingVal = fullCells[rIdx][cIdx];
        const cellValues = fullCells.map((row, r) => row.map((v, c) => (r === rIdx && c === cIdx ? '?' : v)));
        const flatSumExpr = fullCells.flat().join(' + ');

        answer = String(totalProd);
        acceptedAnswers = [answer, totalProd.toLocaleString()];
        askText = `The area model represents ${a} × ${b} with one partial product marked '?'. Find the missing partial product, then add all the partial products together to calculate ${a} × ${b}.`;
        visualEngineObj = {
          componentToRender: 'AREA_MODEL_MULTIPLICATION',
          componentData: { title: `Area Model: ${a} × ${b}`, topParts, sideParts, cellValues }
        };
        if (isMCQ) {
          mcqData = buildFourUniqueOptions(answer, [
            { value: missingVal, defect: 'STOPPED_AT_MISSING_PARTIAL_PRODUCT' },
            { value: totalProd - missingVal, defect: 'FORGOT_TO_ADD_MISSING_CELL' },
            { value: totalProd + 100, defect: 'CARRY_OVER_ERROR' }
          ]);
        }
        solutionSteps = `Step 1: Find the missing partial product: ${sideParts[rIdx]} * ${topParts[cIdx]} = ${missingVal}.\\nStep 2: Add all partial products: ${flatSumExpr} = ${totalProd}.`;
        hint = `First multiply ${sideParts[rIdx]} × ${topParts[cIdx]} to find '?', then add all 6 partial products together!`;
      } else if (subMode === 'factor') {
        const cIdx = getRandomInt(0, 2);
        const missingTop = topParts[cIdx];
        const maskedTop = topParts.map((tp, idx) => (idx === cIdx ? '?' : tp));

        answer = String(missingTop);
        acceptedAnswers = [answer];
        askText = `In the area model for ${a} × ${b}, one decomposed place-value part on the top is missing ('?'). What is the missing number?`;
        visualEngineObj = {
          componentToRender: 'AREA_MODEL_MULTIPLICATION',
          componentData: { title: `Area Model: ${a} × ${b}`, topParts: maskedTop, sideParts, cellValues: fullCells }
        };
        if (isMCQ) {
          mcqData = buildFourUniqueOptions(answer, [
            { value: Number(String(missingTop)[0]), defect: 'IGNORED_PLACE_VALUE_ZEROS' },
            { value: missingTop * 10, defect: 'EXTRA_ZERO_ERROR' },
            { value: fullCells[0][cIdx], defect: 'GAVE_CELL_PRODUCT_INSTEAD' }
          ]);
        }
        solutionSteps = `Step 1: Divide the cell value ${fullCells[0][cIdx]} by side factor ${sideParts[0]}: ${fullCells[0][cIdx]} / ${sideParts[0]} = ${missingTop}.`;
        hint = `Divide any cell in that column by its side value (${sideParts[0]} or ${sideParts[1]})!`;
      } else {
        answer = String(totalProd);
        acceptedAnswers = [answer, totalProd.toLocaleString()];
        askText = `Use partial products to calculate ${a} × ${b}.`;
        visualEngineObj = isStructure
          ? { componentToRender: 'NONE', componentData: { hideVisual: true } }
          : {
              componentToRender: 'AREA_MODEL_MULTIPLICATION',
              componentData: {
                title: `Area Model: ${a} × ${b}`,
                topParts,
                sideParts,
                cellValues: sideParts.map(() => topParts.map(() => '?'))
              }
            };
        if (isStructure) {
          inputRequirementObj = {
            inputType: 'MULTI_STEP_INPUT',
            steps: [
              { label: `Write the working equation for the ones partial product (${a} × ${bOnes}):`, expectedAnswer: `${a} * ${bOnes} = ${onesProd}`, acceptedAnswers: makeMulEq(a, bOnes, onesProd) },
              { label: `Write the working equation for the tens partial product (${a} × ${bTens}):`, expectedAnswer: `${a} * ${bTens} = ${tensProd}`, acceptedAnswers: makeMulEq(a, bTens, tensProd) },
              { label: 'Write the working equation to find the final product:', expectedAnswer: `${onesProd} + ${tensProd} = ${totalProd}`, acceptedAnswers: [`${onesProd} + ${tensProd} = ${totalProd}`, `${onesProd}+${tensProd}=${totalProd}`, `${tensProd} + ${onesProd} = ${totalProd}`, `${tensProd}+${onesProd}=${totalProd}`] }
            ]
          };
        } else if (isMCQ) {
          mcqData = buildFourUniqueOptions(answer, [
            { value: onesProd + a * (bTens / 10), defect: 'FORGOT_TENS_ZERO_PLACEHOLDER' },
            { value: totalProd + 100, defect: 'CARRY_OVER_ERROR' },
            { value: totalProd - 100, defect: 'CARRY_OVER_ERROR' }
          ]);
        }
        solutionSteps = `Step 1: Ones partial product: ${a} * ${bOnes} = ${onesProd}.\\nStep 2: Tens partial product: ${a} * ${bTens} = ${tensProd}.\\nStep 3: Total = ${onesProd} + ${tensProd} = ${totalProd}.`;
        hint = `Multiply ${a} by ${bOnes}, then ${a} by ${bTens}, and add both partial products together!`;
      }
    } else {
      // 4-digit x 1-digit area model
      const a = getRandomInt(1, 5) * 1000 + getRandomInt(1, 9) * 100 + getRandomInt(1, 9) * 10 + getRandomInt(1, 9);
      const b = getRandomInt(3, 9);
      const topParts = decomposeDigits(a);
      const sideParts = [b];
      const fullCells = [topParts.map((tp) => tp * b)];
      const cIdx = getRandomInt(0, topParts.length - 1);
      const missingVal = fullCells[0][cIdx];
      const totalProd = a * b;
      const cellValues = [topParts.map((_, idx) => (idx === cIdx ? '?' : fullCells[0][idx]))];
      const flatSumExpr = fullCells[0].join(' + ');

      answer = String(totalProd);
      acceptedAnswers = [answer, totalProd.toLocaleString()];
      askText = `The area model shows ${a} × ${b} with one partial product marked '?'. Find the missing partial product, then add all the partial products together to calculate ${a} × ${b}.`;
      visualEngineObj = {
        componentToRender: 'AREA_MODEL_MULTIPLICATION',
        componentData: { title: `Area Model: ${a} × ${b}`, topParts, sideParts, cellValues }
      };
      if (isMCQ) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: missingVal, defect: 'STOPPED_AT_MISSING_PARTIAL_PRODUCT' },
          { value: totalProd - missingVal, defect: 'FORGOT_TO_ADD_MISSING_CELL' },
          { value: totalProd + 100, defect: 'CARRY_OVER_ERROR' }
        ]);
      }
      solutionSteps = `Step 1: Find the missing partial product: ${topParts[cIdx]} * ${b} = ${missingVal}.\\nStep 2: Add all partial products: ${flatSumExpr} = ${totalProd}.`;
      hint = `First multiply ${topParts[cIdx]} × ${b} to find '?', then add all the partial products together!`;
    }

  } else if (variant === 'foundation_place_value_zero_shift') {
    const a = getRandomInt(125, 895);
    const tensDigit = getRandomInt(2, 9);
    const b = tensDigit * 10;
    const baseProd = a * tensDigit;
    const finalProd = baseProd * 10;

    const findMissingMultiplier = !isStructure && Math.random() > 0.6;
    if (findMissingMultiplier) {
      answer = String(b);
      acceptedAnswers = [answer];
      askText = `Find the missing multiplier: ${a} × ? = ${finalProd.toLocaleString()}`;
      visualEngineObj = {
        componentToRender: 'VERTICAL_ALGORITHM_GRID',
        componentData: {
          title: 'Missing Multiplier',
          multiplicand: a,
          multiplier: '??',
          partialProducts: [],
          finalProduct: finalProd
        }
      };
      if (isMCQ) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: tensDigit, defect: 'FORGOT_TENS_ZERO' },
          { value: b * 10, defect: 'EXTRA_ZERO_ERROR' },
          { value: b + 10, defect: 'CARELESS_CALCULATION' }
        ]);
      }
      solutionSteps = `Step 1: Since ${a} * ${tensDigit} = ${baseProd}, multiplying by ${tensDigit} * 10 = ${b} gives ${finalProd}.`;
      hint = `Divide ${finalProd} by 10 first (${baseProd}), then check what times ${a} equals ${baseProd}!`;
    } else {
      answer = String(finalProd);
      acceptedAnswers = [answer, finalProd.toLocaleString()];
      askText = `Calculate ${a} × ${b} using place-value zero shifting.`;
      visualEngineObj = {
        componentToRender: 'VERTICAL_ALGORITHM_GRID',
        componentData: {
          title: `${a} × ${b}`,
          multiplicand: a,
          multiplier: b,
          partialProducts: [],
          finalProduct: '?'
        }
      };
      if (isStructure) {
        inputRequirementObj = {
          inputType: 'MULTI_STEP_INPUT',
          steps: [
            { label: 'Write the working equation to multiply by the non-zero digit:', expectedAnswer: `${a} * ${tensDigit} = ${baseProd}`, acceptedAnswers: makeMulEq(a, tensDigit, baseProd) },
            { label: 'Write the working equation to multiply the result by 10:', expectedAnswer: `${baseProd} * 10 = ${finalProd}`, acceptedAnswers: makeMulEq(baseProd, 10, finalProd) }
          ]
        };
      } else if (isMCQ) {
        mcqData = buildFourUniqueOptions(answer, [
          { value: baseProd, defect: 'FORGOT_FINAL_ZERO' },
          { value: finalProd * 10, defect: 'EXTRA_ZERO_ERROR' },
          { value: finalProd + 100, defect: 'CARRY_OVER_ERROR' }
        ]);
      }
      solutionSteps = `Step 1: Multiply by the non-zero digit: ${a} * ${tensDigit} = ${baseProd}.\\nStep 2: Multiply by 10: ${baseProd} * 10 = ${finalProd}.`;
      hint = `Multiply ${a} by ${tensDigit} first, then shift one place left by multiplying by 10!`;
    }

  } else if (variant === 'foundation_regrouping_across_zeros') {
    const th = getRandomInt(2, 8);
    const zeroMode = getRandomInt(0, 2); // 0: x0yz, 1: xy0z, 2: x00z
    const h = zeroMode === 0 || zeroMode === 2 ? 0 : getRandomInt(2, 9);
    const t = zeroMode === 1 || zeroMode === 2 ? 0 : getRandomInt(2, 9);
    const o = getRandomInt(4, 9);
    const a = th * 1000 + h * 100 + t * 10 + o;
    const b = getRandomInt(3, 9);
    const prod = a * b;

    if (isStructure) {
      const extra = getRandomInt(110, 350);
      const isAdd = Math.random() > 0.5;
      const finalTotal = isAdd ? prod + extra : prod - extra;
      answer = String(finalTotal);
      acceptedAnswers = [answer, finalTotal.toLocaleString()];
      askText = `STORY: A warehouse receives ${b} crates, each containing ${a} ${item}. ${isAdd ? `Another loose batch of ${extra} ${item} is added.` : `${extra} ${item} are removed for an urgent order.`}\n\nCRITICAL INSTRUCTION: Ask how many ${item} there are in total at the end.`;
      visualEngineObj = {
        componentToRender: 'VERTICAL_ALGORITHM_GRID',
        componentData: {
          title: `${a} × ${b}`,
          multiplicand: a,
          multiplier: b,
          partialProducts: [],
          finalProduct: '?'
        }
      };
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: `Write the working equation to find the total ${item} in the crates:`, expectedAnswer: `${a} * ${b} = ${prod}`, acceptedAnswers: makeMulEq(a, b, prod) },
          {
            label: 'Write the working equation to find the final total:',
            expectedAnswer: isAdd ? `${prod} + ${extra} = ${finalTotal}` : `${prod} - ${extra} = ${finalTotal}`,
            acceptedAnswers: isAdd
              ? [`${prod} + ${extra} = ${finalTotal}`, `${prod}+${extra}=${finalTotal}`, `${extra} + ${prod} = ${finalTotal}`, `${extra}+${prod}=${finalTotal}`]
              : makeSubEq(prod, extra, finalTotal)
          }
        ]
      };
      solutionSteps = `Step 1: Multiply ${a} * ${b} = ${prod}.\\nStep 2: ${isAdd ? `Add ${extra}: ${prod} + ${extra} = ${finalTotal}.` : `Subtract ${extra}: ${prod} - ${extra} = ${finalTotal}.`}`;
      hint = `Multiply ${a} by ${b} carefully (watch the regrouping across zero!), then ${isAdd ? 'add' : 'subtract'} ${extra}.`;
    } else {
      const askCarry = Math.random() > 0.65;
      if (askCarry) {
        const carryToTens = Math.floor((o * b) / 10);
        answer = String(carryToTens);
        acceptedAnswers = [answer];
        askText = `When multiplying ${a} × ${b} in the vertical algorithm, what digit is carried from the ones place to the tens place?`;
        visualEngineObj = {
          componentToRender: 'VERTICAL_ALGORITHM_GRID',
          componentData: { title: `${a} × ${b}`, multiplicand: a, multiplier: b, partialProducts: [], finalProduct: '?' }
        };
        if (isMCQ) {
          mcqData = buildFourUniqueOptions(answer, [
            { value: (o * b) % 10, defect: 'CONFUSED_ONES_DIGIT_WITH_CARRY' },
            { value: carryToTens + 1, defect: 'CARELESS_CALCULATION' },
            { value: 0, defect: 'FORGOT_CARRY_OVER' }
          ]);
        }
        solutionSteps = `Step 1: Multiply ones: ${o} * ${b} = ${o * b}.\\nStep 2: Write ${(o * b) % 10} in the ones place and carry ${carryToTens} to the tens place.`;
        hint = `Multiply the ones digit (${o}) by ${b}, and look at the tens digit of that product!`;
      } else {
        answer = String(prod);
        acceptedAnswers = [answer, prod.toLocaleString()];
        askText = `Calculate ${a} × ${b}.`;
        visualEngineObj = {
          componentToRender: 'VERTICAL_ALGORITHM_GRID',
          componentData: { title: `${a} × ${b}`, multiplicand: a, multiplier: b, partialProducts: [], finalProduct: '?' }
        };
        if (isMCQ) {
          mcqData = buildFourUniqueOptions(answer, [
            { value: prod - 100, defect: 'FORGOT_CARRY_OVER' },
            { value: prod + 100, defect: 'CARRY_OVER_ERROR' },
            { value: prod - 10, defect: 'REGROUPING_ACROSS_ZERO_ERROR' }
          ]);
        }
        solutionSteps = `Step 1: Multiply each place value of ${a} by ${b}, regrouping carefully across zeros.\\nStep 2: ${a} * ${b} = ${prod}.`;
        hint = `Be careful when carrying into a 0 digit—add the carried digit to 0!`;
      }
    }

  } else if (variant === 'foundation_distributive_property_splitting') {
    const a = getRandomInt(125, 450);
    const isSub = Math.random() > 0.5;
    const baseTen = [20, 30, 40][getRandomInt(0, 2)];
    const offset = isSub ? getRandomInt(1, 2) : [1, 2, 4][getRandomInt(0, 2)];
    const b = isSub ? baseTen - offset : baseTen + offset;
    const baseProd = a * baseTen;
    const offsetProd = a * offset;
    const finalProd = isSub ? baseProd - offsetProd : baseProd + offsetProd;

    answer = String(finalProd);
    acceptedAnswers = [answer, finalProd.toLocaleString()];
    askText = isSub
      ? `Use compensation (${baseTen} - ${offset}) to calculate ${a} × ${b}.`
      : `Use distributive splitting (${baseTen} + ${offset}) to calculate ${a} × ${b}.`;

    visualEngineObj = {
      componentToRender: 'AREA_MODEL_MULTIPLICATION',
      componentData: {
        title: `Distributive Strategy: ${a} × ${b}`,
        topParts: [a],
        sideParts: isSub ? [baseTen, `-${offset}`] : [baseTen, offset],
        cellValues: [[baseProd], ['?']]
      }
    };

    if (isStructure) {
      inputRequirementObj = {
        inputType: 'MULTI_STEP_INPUT',
        steps: [
          { label: `Write the working equation to find ${baseTen} groups of ${a}:`, expectedAnswer: `${a} * ${baseTen} = ${baseProd}`, acceptedAnswers: makeMulEq(a, baseTen, baseProd) },
          {
            label: isSub
              ? `Write the working equation to subtract ${offset} group(s) of ${a}:`
              : `Write the working equation to add ${offset} group(s) of ${a}:`,
            expectedAnswer: isSub ? `${baseProd} - ${offsetProd} = ${finalProd}` : `${baseProd} + ${offsetProd} = ${finalProd}`,
            acceptedAnswers: isSub
              ? makeSubEq(baseProd, offsetProd, finalProd)
              : [`${baseProd} + ${offsetProd} = ${finalProd}`, `${baseProd}+${offsetProd}=${finalProd}`, `${offsetProd} + ${baseProd} = ${finalProd}`, `${offsetProd}+${baseProd}=${finalProd}`]
          }
        ]
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: isSub ? baseProd + offsetProd : baseProd - offsetProd, defect: 'WRONG_COMPENSATION_SIGN' },
        { value: isSub ? baseProd - offset : baseProd + offset, defect: 'FORGOT_TO_MULTIPLY_OFFSET_BY_A' },
        { value: finalProd + 10, defect: 'CARELESS_CALCULATION' }
      ]);
    }
    solutionSteps = `Step 1: ${a} * ${baseTen} = ${baseProd}.\\nStep 2: ${offset} * ${a} = ${offsetProd}.\\nStep 3: ${isSub ? `${baseProd} - ${offsetProd}` : `${baseProd} + ${offsetProd}`} = ${finalProd}.`;
    hint = `Find ${a} × ${baseTen} first, then ${isSub ? 'subtract' : 'add'} ${offset} × ${a}!`;

  } else {
    // foundation_direct_multi_digit_scaling
    const use4by1 = Math.random() > 0.5;
    const perGroup = use4by1 ? getRandomInt(1120, 3450) : getRandomInt(115, 385);
    const groups = use4by1 ? getRandomInt(4, 9) : getRandomInt(14, 38);
    const prod = perGroup * groups;
    const adj = getRandomInt(125, 480);
    const isSub = Math.random() > 0.4;
    const finalTotal = isSub ? prod - adj : prod + adj;

    answer = String(finalTotal);
    acceptedAnswers = [answer, finalTotal.toLocaleString(), `${answer} ${item}`];
    askText = isSub
      ? `STORY: ${names[0]} has ${groups} boxes, each containing ${perGroup} ${item}. ${names[0]} gives away ${adj} ${item}.\n\nCRITICAL INSTRUCTION: Ask how many ${item} ${names[0]} has left.`
      : `STORY: ${names[0]} packs ${groups} boxes of ${perGroup} ${item} and has ${adj} extra ${item} in a basket.\n\nCRITICAL INSTRUCTION: Ask how many ${item} ${names[0]} has altogether.`;

    if (isStructure) {
      const steps = [
        { label: 'Write the working equation to find the total from the boxes:', expectedAnswer: `${perGroup} * ${groups} = ${prod}`, acceptedAnswers: makeMulEq(perGroup, groups, prod) },
        {
          label: isSub ? 'Write the working equation to find the remaining amount:' : 'Write the working equation to find the total amount:',
          expectedAnswer: isSub ? `${prod} - ${adj} = ${finalTotal}` : `${prod} + ${adj} = ${finalTotal}`,
          acceptedAnswers: isSub
            ? makeSubEq(prod, adj, finalTotal)
            : [`${prod} + ${adj} = ${finalTotal}`, `${prod}+${adj}=${finalTotal}`, `${adj} + ${prod} = ${finalTotal}`, `${adj}+${prod}=${finalTotal}`]
        }
      ];
      inputRequirementObj = {
        inputType: 'INTERACTIVE_BAR_BUILDER',
        steps,
        barBuilderConfig: {
          problemType: 'PART_WHOLE_SCALING',
          correctModelType: 'PART_WHOLE',
          modelOptions: ALL_MODEL_OPTIONS,
          parts: isSub
            ? [
                { name: 'Remaining', value: '?', displayValue: '?' },
                { name: 'Given Away', value: String(adj), displayValue: String(adj) }
              ]
            : [
                { name: `${groups} Boxes`, value: '?', displayValue: '?' },
                { name: 'Extra', value: String(adj), displayValue: String(adj) }
              ],
          whole: { label: `Total ${item}`, value: '?', displayValue: '?', isTarget: !isSub },
          target: { type: isSub ? 'PART' : 'WHOLE', label: isSub ? 'Remaining' : `Total ${item}` },
          steps
        }
      };
    } else if (isMCQ) {
      mcqData = buildFourUniqueOptions(answer, [
        { value: isSub ? prod + adj : prod - adj, defect: 'CONFUSED_ADD_AND_SUBTRACT' },
        { value: prod, defect: 'FORGOT_SECOND_STEP' },
        { value: finalTotal + 100, defect: 'CARRY_OVER_ERROR' }
      ]);
    }
    solutionSteps = `Step 1: Total in boxes = ${perGroup} * ${groups} = ${prod}.\\nStep 2: ${isSub ? `Subtract ${adj}: ${prod} - ${adj} = ${finalTotal}.` : `Add ${adj}: ${prod} + ${adj} = ${finalTotal}.`}`;
    hint = `Multiply ${perGroup} by ${groups} first, then ${isSub ? 'subtract' : 'add'} ${adj}!`;
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
