import { getRandomNames, getRandomCountableItems } from '../../../../../utils/variable-bank.js';

export const ADVANCED_FORMING_VARIETIES = {
  greatest_5_digit: 'Form the greatest 5-digit number using 5 given cards.',
  smallest_5_digit: 'Form the smallest 5-digit number using 5 given cards.',
  greatest_even: 'Form the greatest 5-digit even number using 5 given cards.',
  smallest_odd: 'Form the smallest 5-digit odd number using 5 given cards.',
  greatest_less_than_x: 'Form the greatest 5-digit number less than a specific boundary.',
  smallest_greater_than_x: 'Form the smallest 5-digit number greater than a specific boundary.'
};

const legacyFormingMap = {
  'advanced_form_greatest_5_digit': 'greatest_5_digit',
  'advanced_form_smallest_5_digit': 'smallest_5_digit',
  'advanced_form_greatest_even': 'greatest_even',
  'advanced_form_smallest_odd': 'smallest_odd',
  'advanced_form_greatest_less_than_x': 'greatest_less_than_x',
  'advanced_form_smallest_greater_than_x': 'smallest_greater_than_x'
};

function ensureFourUniqueOptions(finalAnswer, rawDistractors, defaultDefect = "CARELESS_CALCULATION") {
  const options = [finalAnswer];
  const defectMap = {};

  for (const item of rawDistractors) {
    if (options.length < 4 && !options.includes(item.val)) {
      options.push(item.val);
      defectMap[item.val] = item.defect || defaultDefect;
    }
  }

  let counter = 1;
  const numAnswer = parseInt(finalAnswer);
  while (options.length < 4) {
    const fallback = isNaN(numAnswer) ? `${finalAnswer} (Option ${counter})` : (numAnswer + counter * 100).toString();
    if (!options.includes(fallback)) {
      options.push(fallback);
      defectMap[fallback] = defaultDefect;
    }
    counter++;
  }

  return { options: options.sort(() => Math.random() - 0.5), defectMap };
}

export function resolveAdvancedVariety(variantInput, explicitVariety = null) {
  if (explicitVariety && ADVANCED_FORMING_VARIETIES[explicitVariety]) {
    return explicitVariety;
  }

  let str = "";
  if (typeof variantInput === 'object' && variantInput !== null) {
    str = String(variantInput.variety || variantInput.variant || variantInput.subType || "").toLowerCase();
  } else {
    str = String(variantInput || "").toLowerCase().trim();
  }

  if (str.includes(':')) {
    const afterColon = str.split(':')[1].trim();
    if (ADVANCED_FORMING_VARIETIES[afterColon]) return afterColon;
  }

  if (legacyFormingMap[str]) {
    return legacyFormingMap[str];
  }

  if (ADVANCED_FORMING_VARIETIES[str]) {
    return str;
  }

  if (str === 'variety_1' || str === 'v1' || str === '1') return 'greatest_5_digit';
  if (str === 'variety_2' || str === 'v2' || str === '2') return 'smallest_5_digit';
  if (str === 'variety_3' || str === 'v3' || str === '3') return 'greatest_even';
  if (str === 'variety_4' || str === 'v4' || str === '4') return 'smallest_odd';
  if (str === 'variety_5' || str === 'v5' || str === '5') return 'greatest_less_than_x';
  if (str === 'variety_6' || str === 'v6' || str === '6') return 'smallest_greater_than_x';

  if (str.includes('greatest') && str.includes('less')) return 'greatest_less_than_x';
  if (str.includes('smallest') && str.includes('greater')) return 'smallest_greater_than_x';
  if (str.includes('greatest') && str.includes('even')) return 'greatest_even';
  if (str.includes('smallest') && str.includes('odd')) return 'smallest_odd';
  if (str.includes('smallest')) return 'smallest_5_digit';
  if (str.includes('greatest')) return 'greatest_5_digit';

  const keys = Object.keys(ADVANCED_FORMING_VARIETIES);
  return keys[Math.floor(Math.random() * keys.length)];
}

export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, explicitVariety = null) {
  let promptInstruction = "";
  let finalAnswer = "";
  let options = [];
  let defectMap = {};
  let solutionSteps = "";
  let hint = "";
  let inputRequirementStr = null;
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;

  const allAdvancedVariants = [
    'advanced_form_numbers',
    'advanced_equalizing_transfer',
    'advanced_three_entity_grand_total',
    'advanced_shifting_difference_transfer',
    'advanced_overlapping_target_deduction',
    'advanced_two_tiered_difference'
  ];

  let effectiveVariant = activeVariant;
  if (!effectiveVariant || effectiveVariant === 'advanced_default' || effectiveVariant === 'default') {
    effectiveVariant = allAdvancedVariants[Math.floor(Math.random() * allAdvancedVariants.length)];
  } else if (legacyFormingMap[effectiveVariant] || Object.keys(ADVANCED_FORMING_VARIETIES).includes(effectiveVariant) || String(effectiveVariant).startsWith('advanced_form_numbers')) {
    effectiveVariant = 'advanced_form_numbers';
  } else if (!allAdvancedVariants.includes(effectiveVariant)) {
    effectiveVariant = allAdvancedVariants[Math.floor(Math.random() * allAdvancedVariants.length)];
  }

  // ==========================================================================
  // VARIANT 1: advanced_form_numbers (Forming Numbers with 6 Varieties)
  // ==========================================================================
  if (effectiveVariant === 'advanced_form_numbers') {
    const variety = resolveAdvancedVariety(activeVariant, explicitVariety);

    function getPerms(arr) {
      if (arr.length <= 1) return [arr];
      let result = [];
      for (let i = 0; i < arr.length; i++) {
        let current = arr[i];
        let remaining = arr.slice(0, i).concat(arr.slice(i + 1));
        let remainingPerms = getPerms(remaining);
        for (let j = 0; j < remainingPerms.length; j++) {
          result.push([current].concat(remainingPerms[j]));
        }
      }
      return result;
    }

    const evens = [0, 2, 4, 6, 8].sort(() => Math.random() - 0.5).slice(0, 3);
    const odds = [1, 3, 5, 7, 9].sort(() => Math.random() - 0.5).slice(0, 2);
    const digits = [...evens, ...odds].sort(() => Math.random() - 0.5);

    const allPerms = getPerms(digits);
    const validNumbers = [];
    for (const p of allPerms) {
      if (p[0] !== 0) {
        const val = p[0] * 10000 + p[1] * 1000 + p[2] * 100 + p[3] * 10 + p[4];
        if (!validNumbers.includes(val)) {
          validNumbers.push(val);
        }
      }
    }
    validNumbers.sort((a, b) => a - b);

    let conditionLabel = "";

    if (variety === "greatest_5_digit") {
      conditionLabel = "Greatest 5-digit Number";
      const maxVal = validNumbers[validNumbers.length - 1];
      finalAnswer = maxVal.toString();
      promptInstruction = `- Question stem: "Use all the digit cards ${digits.join(', ')} once to form the greatest 5-digit number."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Arrange the 5 digit cards from greatest to smallest:", expectedAnswer: finalAnswer },
            { label: "Final Answer:", expectedAnswer: finalAnswer }
          ]
        }, null, 2);
      }

      if (isMCQ) {
        const d1 = validNumbers[0].toString();
        const d2 = validNumbers[validNumbers.length - 2].toString();
        const d3 = validNumbers[validNumbers.length - 3].toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "OPPOSITE_CONDITION_SMALLEST" },
          { val: d2, defect: "SECOND_GREATEST_CHOICE" },
          { val: d3, defect: "PARTIAL_SORT_ERROR" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: To form the greatest 5-digit number, arrange the digit cards from greatest to smallest from left to right.\\nStep 2: The digits from greatest to smallest are: ${[...digits].sort((a, b) => b - a).join(', ')}.\\nStep 3: The greatest 5-digit number formed is ${maxVal.toLocaleString()}.`;
      hint = `Place the largest digit in the place with the greatest value (ten thousands place), followed by the next largest digits!`;

    } else if (variety === "smallest_5_digit") {
      conditionLabel = "Smallest 5-digit Number";
      const minVal = validNumbers[0];
      finalAnswer = minVal.toString();
      promptInstruction = `- Question stem: "Use all the digit cards ${digits.join(', ')} once to form the smallest 5-digit number."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Which is the smallest non-zero digit to place in the ten thousands place?", expectedAnswer: minVal.toString()[0] },
            { label: "Arrange the remaining digits in ascending order to complete the number:", expectedAnswer: finalAnswer },
            { label: "Final Answer:", expectedAnswer: finalAnswer }
          ]
        }, null, 2);
      }

      if (isMCQ) {
        const d1 = validNumbers[validNumbers.length - 1].toString();
        const d2 = validNumbers[1].toString();
        const d3 = validNumbers[2].toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "OPPOSITE_CONDITION_GREATEST" },
          { val: d2, defect: "SECOND_SMALLEST_CHOICE" },
          { val: d3, defect: "PARTIAL_SORT_ERROR" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: A 5-digit number cannot begin with 0. Place the smallest non-zero digit (${minVal.toString()[0]}) in the ten thousands place.\\nStep 2: Arrange the remaining digits in ascending order from thousands to ones place.\\nStep 3: The smallest 5-digit number formed is ${minVal.toLocaleString()}.`;
      hint = `A 5-digit number cannot start with 0! Choose the smallest non-zero digit first, then place 0 in the thousands place.`;

    } else if (variety === "greatest_even") {
      conditionLabel = "Greatest 5-digit Even Number";
      const evensList = validNumbers.filter(n => n % 2 === 0);
      const maxEven = evensList[evensList.length - 1];
      finalAnswer = maxEven.toString();
      promptInstruction = `- Question stem: "Use all the digit cards ${digits.join(', ')} once to form the greatest 5-digit even number."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Which even digit should be placed in the ones place?", expectedAnswer: maxEven.toString()[4] },
            { label: "Write the greatest 5-digit even number:", expectedAnswer: finalAnswer },
            { label: "Final Answer:", expectedAnswer: finalAnswer }
          ]
        }, null, 2);
      }

      if (isMCQ) {
        const oddsList = validNumbers.filter(n => n % 2 !== 0);
        const d1 = oddsList[oddsList.length - 1].toString();
        const d2 = evensList[evensList.length - 2] ? evensList[evensList.length - 2].toString() : (maxEven - 2).toString();
        const d3 = evensList[0].toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "FORMED_ODD_NUMBER" },
          { val: d2, defect: "SECOND_GREATEST_CHOICE" },
          { val: d3, defect: "OPPOSITE_CONDITION_SMALLEST" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: An even number must end with an even digit (${evens.sort((a,b)=>a-b).join(', ')}).\\nStep 2: To make the number as large as possible, arrange the largest remaining digits in descending order from the ten thousands place, leaving ${maxEven.toString()[4]} in the ones place.\\nStep 3: The greatest 5-digit even number formed is ${maxEven.toLocaleString()}.`;
      hint = `An even number must end in 0, 2, 4, 6, or 8. Reserve the smallest suitable even digit for the ones place so the larger digits can be used in higher place values!`;

    } else if (variety === "smallest_odd") {
      conditionLabel = "Smallest 5-digit Odd Number";
      const oddsList = validNumbers.filter(n => n % 2 !== 0);
      const minOdd = oddsList[0];
      finalAnswer = minOdd.toString();
      promptInstruction = `- Question stem: "Use all the digit cards ${digits.join(', ')} once to form the smallest 5-digit odd number."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Which odd digit should be placed in the ones place?", expectedAnswer: minOdd.toString()[4] },
            { label: "Write the smallest 5-digit odd number:", expectedAnswer: finalAnswer },
            { label: "Final Answer:", expectedAnswer: finalAnswer }
          ]
        }, null, 2);
      }

      if (isMCQ) {
        const evensList = validNumbers.filter(n => n % 2 === 0);
        const d1 = evensList[0].toString();
        const d2 = oddsList[1] ? oddsList[1].toString() : (minOdd + 2).toString();
        const d3 = oddsList[oddsList.length - 1].toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "FORMED_EVEN_NUMBER" },
          { val: d2, defect: "SECOND_SMALLEST_CHOICE" },
          { val: d3, defect: "OPPOSITE_CONDITION_GREATEST" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: An odd number must end with an odd digit (${odds.sort((a,b)=>a-b).join(', ')}).\\nStep 2: Choose the smallest non-zero digit for the ten thousands place, keeping the smallest available digits in the front and ${minOdd.toString()[4]} in the ones place.\\nStep 3: The smallest 5-digit odd number formed is ${minOdd.toLocaleString()}.`;
      hint = `The number must end in an odd digit (1, 3, 5, 7, 9). Make sure the ten thousands digit is the smallest available non-zero digit!`;

    } else if (variety === "greatest_less_than_x") {
      const medianIdx = Math.floor(validNumbers.length * 0.6);
      const bound = Math.floor(validNumbers[medianIdx] / 1000) * 1000;
      const filtered = validNumbers.filter(n => n < bound);
      const maxFiltered = filtered[filtered.length - 1];
      finalAnswer = maxFiltered.toString();
      conditionLabel = `Greatest Number Smaller Than ${bound.toLocaleString()}`;

      promptInstruction = `- Question stem: "Use all the digit cards ${digits.join(', ')} once to form the greatest 5-digit number that is smaller than ${bound.toLocaleString()}."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `What is the largest ten thousands digit you can use that keeps the number smaller than ${bound.toLocaleString()}?`, expectedAnswer: maxFiltered.toString()[0] },
            { label: `Write the greatest 5-digit number smaller than ${bound.toLocaleString()}:`, expectedAnswer: finalAnswer },
            { label: "Final Answer:", expectedAnswer: finalAnswer }
          ]
        }, null, 2);
      }

      if (isMCQ) {
        const overBound = validNumbers.filter(n => n > bound)[0]?.toString() || (bound + 100).toString();
        const secondMax = filtered[filtered.length - 2]?.toString() || (maxFiltered - 10).toString();
        const smallest = filtered[0].toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: overBound, defect: "EXCEEDED_BOUNDARY_CONDITION" },
          { val: secondMax, defect: "SECOND_GREATEST_CHOICE" },
          { val: smallest, defect: "OPPOSITE_CONDITION_SMALLEST" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: The number must be strictly smaller than ${bound.toLocaleString()}. The largest possible ten thousands digit is ${maxFiltered.toString()[0]}.\\nStep 2: Arrange the remaining digits to make the number as large as possible without exceeding the boundary.\\nStep 3: The greatest 5-digit number smaller than ${bound.toLocaleString()} is ${maxFiltered.toLocaleString()}.`;
      hint = `Check the highest place value that keeps the number below ${bound.toLocaleString()}, then arrange the remaining digits in descending order!`;

    } else {
      // smallest_greater_than_x
      const medianIdx = Math.floor(validNumbers.length * 0.4);
      const bound = Math.floor(validNumbers[medianIdx] / 1000) * 1000;
      const filtered = validNumbers.filter(n => n > bound);
      const minFiltered = filtered[0];
      finalAnswer = minFiltered.toString();
      conditionLabel = `Smallest Number Greater Than ${bound.toLocaleString()}`;

      promptInstruction = `- Question stem: "Use all the digit cards ${digits.join(', ')} once to form the smallest 5-digit number that is greater than ${bound.toLocaleString()}."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `What is the smallest ten thousands digit you can use that keeps the number greater than ${bound.toLocaleString()}?`, expectedAnswer: minFiltered.toString()[0] },
            { label: `Write the smallest 5-digit number greater than ${bound.toLocaleString()}:`, expectedAnswer: finalAnswer },
            { label: "Final Answer:", expectedAnswer: finalAnswer }
          ]
        }, null, 2);
      }

      if (isMCQ) {
        const underBound = validNumbers.filter(n => n < bound).pop()?.toString() || (bound - 100).toString();
        const secondMin = filtered[1]?.toString() || (minFiltered + 10).toString();
        const greatest = filtered[filtered.length - 1].toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: underBound, defect: "UNDER_BOUNDARY_CONDITION" },
          { val: secondMin, defect: "SECOND_SMALLEST_CHOICE" },
          { val: greatest, defect: "OPPOSITE_CONDITION_GREATEST" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: The number must be strictly greater than ${bound.toLocaleString()}. The smallest possible ten thousands digit is ${minFiltered.toString()[0]}.\\nStep 2: Arrange the remaining digits in ascending order to make the number as small as possible while staying above ${bound.toLocaleString()}.\\nStep 3: The smallest 5-digit number greater than ${bound.toLocaleString()} is ${minFiltered.toLocaleString()}.`;
      hint = `Choose the smallest digit that keeps the number above ${bound.toLocaleString()}, then arrange the remaining digits from smallest to greatest!`;
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "DIGIT_CARD_SORTER",
      componentData: {
        digits: digits,
        condition: conditionLabel
      }
    }, null, 2);
  }

  // ==========================================================================
  // VARIANT 2: advanced_equalizing_transfer (The Equalizing Transfer)
  // ==========================================================================
  else if (effectiveVariant === 'advanced_equalizing_transfer') {
    const [nameA, nameB] = getRandomNames(2);
    const itemObj = getRandomCountableItems(1);
    const item = itemObj?.item || "stickers";

    const baseAmount = (Math.floor(Math.random() * 15) + 20) * 1000 + Math.floor(Math.random() * 9) * 100;
    const diff = (Math.floor(Math.random() * 6) + 3) * 2000; // Even difference between 6k and 16k
    const transfer = diff / 2;
    const larger = baseAmount + diff;
    const smaller = baseAmount;
    const equalized = smaller + transfer;
    const grandTotal = larger + smaller;

    // Variety Selection
    const varietiesList = [
      'find_transfer_from_initial',
      'find_initial_from_equalized',
      'find_initial_from_total_and_transfer',
      'find_difference_from_transfer',
      'find_other_initial_from_one_initial'
    ];
    let selectedVariety = explicitVariety;
    if (!varietiesList.includes(selectedVariety)) {
      selectedVariety = varietiesList[Math.floor(Math.random() * varietiesList.length)];
    }

    // ========================================================================
    // ========================================================================
    // Variety 1: find_transfer_from_initial (Given x and y, find transfer t)
    // ========================================================================
    if (selectedVariety === 'find_transfer_from_initial') {
      finalAnswer = transfer.toString();

      promptInstruction = `- Question stem: "${nameA} has ${larger.toLocaleString()} ${item} and ${nameB} has ${smaller.toLocaleString()} ${item}. How many ${item} must ${nameA} give to ${nameB} so that both of them have an equal number of ${item}?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        visualEngineStr = JSON.stringify({
          componentToRender: "NONE",
          hideVisual: true,
          componentData: {
            hideVisual: true,
            modelType: "BAR_MODEL_COMPARISON",
            bars: [
              { name: nameA, value: larger, layoutSize: larger, displayValue: larger.toLocaleString() },
              { name: nameB, value: smaller, layoutSize: smaller, displayValue: smaller.toLocaleString() }
            ],
            difference: { displayValue: "?" }
          }
        }, null, 2);

        const steps = [
          {
            label: "Write the working equation:",
            expectedAnswer: `${diff} / 2 = ${transfer}`,
            acceptedAnswers: [
              `${diff} / 2 = ${transfer}`,
              `${diff}/2=${transfer}`,
              `${diff} ÷ 2 = ${transfer}`,
              `${diff}÷2=${transfer}`,
              `(${larger} - ${smaller}) / 2 = ${transfer}`,
              `(${larger}-${smaller})/2=${transfer}`,
              `(${larger} - ${smaller}) ÷ 2 = ${transfer}`,
              `(${larger}-${smaller})÷2=${transfer}`,
              `${larger} - ${smaller} = ${diff}`,
              `${larger}-${smaller}=${diff}`,
              `${diff} / 2`,
              `${diff}/2`,
              `${diff} ÷ 2`,
              `${diff}÷2`,
              `${larger} - ${smaller}`,
              `${larger}-${smaller}`,
              diff.toString(),
              Number(diff).toLocaleString(),
              transfer.toString(),
              Number(transfer).toLocaleString()
            ]
          },
          {
            label: "Final Answer:",
            expectedAnswer: finalAnswer,
            acceptedAnswers: [
              finalAnswer,
              Number(finalAnswer).toLocaleString(),
              `${finalAnswer} ${item}`,
              `${Number(finalAnswer).toLocaleString()} ${item}`
            ]
          }
        ];

        inputRequirementStr = JSON.stringify({
          inputType: "INTERACTIVE_BAR_BUILDER",
          steps: steps,
          barBuilderConfig: {
            problemType: "EQUALIZING_TRANSFER",
            targetType: "TRANSFER",
            transferFrom: nameA,
            transferTo: nameB,
            transferAmount: transfer,
            differenceValue: diff,
            largerValue: larger,
            smallerValue: smaller,
            equalizedValue: equalized,
            grandTotal: grandTotal,
            displayTransfer: transfer.toLocaleString(),
            displayEqualized: equalized.toLocaleString(),
            displayDifference: diff.toLocaleString(),
            itemName: item,
            correctModelType: ["BEFORE_AFTER", "COMPARISON"],
            modelOptions: [
              { id: "COMPARISON", label: "Comparison Model", description: "Compare quantities across distinct entities" },
              { id: "PART_WHOLE", label: "Part-Whole Model", description: "Divide a single whole quantity into parts" },
              { id: "BEFORE_AFTER", label: "Before & After Model", description: "Show transfers or changes across time states" }
            ],
            entities: [
              { id: "B", name: nameB, value: smaller, displayValue: smaller.toLocaleString(), relation: "BASE" },
              { id: "A", name: nameA, value: larger, displayValue: larger.toLocaleString(), relativeTo: nameB, relation: "MORE", diffValue: "?", displayDiff: "?", actualDiff: diff }
            ],
            target: { type: "TRANSFER", label: "Transfer Amount" },
            steps: steps
          }
        }, null, 2);
      } else {
        visualEngineStr = JSON.stringify({
          componentToRender: "BAR_MODEL_COMPARISON",
          componentData: {
            modelType: "BAR_MODEL_COMPARISON",
            bars: [
              { name: nameA, value: larger, layoutSize: larger, displayValue: larger.toLocaleString() },
              { name: nameB, value: smaller, layoutSize: smaller, displayValue: smaller.toLocaleString() }
            ],
            difference: { displayValue: "?" }
          }
        }, null, 2);
      }

      if (isMCQ) {
        const d1 = diff.toString();
        const d2 = equalized.toString();
        const d3 = (larger - transfer * 2).toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "FORGOT_TO_DIVIDE_BY_2" },
          { val: d2, defect: "FOUND_EQUALIZED_AMOUNT" },
          { val: d3, defect: "WRONG_OPERATION_SUBTRACT" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: Find the difference between ${nameA}'s and ${nameB}'s amounts: ${larger.toLocaleString()} - ${smaller.toLocaleString()} = ${diff.toLocaleString()}.\\nStep 2: To make their amounts equal, ${nameA} needs to give half of this difference to ${nameB}: ${diff.toLocaleString()} ÷ 2 = ${transfer.toLocaleString()}.\\nStep 3: ${nameA} must give ${transfer.toLocaleString()} ${item} to ${nameB}.`;
      hint = `Find the difference between them first. Giving half of this extra amount to the other person makes both amounts equal!`;

    // ========================================================================
    // Variety 2: find_initial_from_equalized (Given transfer t and equalized E, find starting A or B)
    // ========================================================================
    } else if (selectedVariety === 'find_initial_from_equalized') {
      const askForA = Math.random() < 0.5;
      finalAnswer = (askForA ? larger : smaller).toString();
      const targetName = askForA ? nameA : nameB;

      promptInstruction = `- Question stem: "After ${nameA} gave ${transfer.toLocaleString()} ${item} to ${nameB}, both of them had ${equalized.toLocaleString()} ${item} each. How many ${item} did ${targetName} have at first?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        visualEngineStr = JSON.stringify({
          componentToRender: "NONE",
          hideVisual: true,
          componentData: {
            hideVisual: true,
            modelType: "BAR_MODEL_COMPARISON",
            bars: [
              { name: `${nameA} (In the end)`, value: equalized, layoutSize: equalized, displayValue: equalized.toLocaleString() },
              { name: `${nameB} (In the end)`, value: equalized, layoutSize: equalized, displayValue: equalized.toLocaleString() }
            ]
          }
        }, null, 2);

        const steps = [
          {
            label: `Write the working equation to find ${targetName}'s amount at first:`,
            expectedAnswer: askForA ? `${equalized} + ${transfer} = ${larger}` : `${equalized} - ${transfer} = ${smaller}`,
            acceptedAnswers: [
              finalAnswer,
              Number(finalAnswer).toLocaleString(),
              askForA ? `${equalized} + ${transfer} = ${larger}` : `${equalized} - ${transfer} = ${smaller}`,
              askForA ? `${equalized}+${transfer}=${larger}` : `${equalized}-${transfer}=${smaller}`,
              askForA ? `${equalized} + ${transfer}` : `${equalized} - ${transfer}`,
              askForA ? `${equalized}+${transfer}` : `${equalized}-${transfer}`
            ]
          },
          {
            label: "Final Answer:",
            expectedAnswer: finalAnswer,
            acceptedAnswers: [
              finalAnswer,
              Number(finalAnswer).toLocaleString(),
              `${finalAnswer} ${item}`,
              `${Number(finalAnswer).toLocaleString()} ${item}`
            ]
          }
        ];

        visualEngineStr = JSON.stringify({
          componentToRender: "NONE",
          hideVisual: true,
          componentData: {
            hideVisual: true,
            modelType: "BAR_MODEL_COMPARISON",
            bars: [
              { name: `${nameA} (In the end)`, value: equalized, layoutSize: equalized, displayValue: equalized.toLocaleString() },
              { name: `${nameB} (In the end)`, value: equalized, layoutSize: equalized, displayValue: equalized.toLocaleString() }
            ]
          }
        }, null, 2);

        inputRequirementStr = JSON.stringify({
          inputType: "INTERACTIVE_BAR_BUILDER",
          steps: steps,
          barBuilderConfig: {
            problemType: "EQUALIZING_TRANSFER",
            targetType: "BAR",
            targetName: targetName,
            transferFrom: nameA,
            transferTo: nameB,
            transferAmount: transfer,
            differenceValue: diff,
            largerValue: larger,
            smallerValue: smaller,
            equalizedValue: equalized,
            grandTotal: grandTotal,
            displayTransfer: transfer.toLocaleString(),
            displayEqualized: equalized.toLocaleString(),
            displayDifference: diff.toLocaleString(),
            itemName: item,
            correctModelType: ["BEFORE_AFTER", "COMPARISON"],
            modelOptions: [
              { id: "COMPARISON", label: "Comparison Model", description: "Compare quantities across distinct entities" },
              { id: "PART_WHOLE", label: "Part-Whole Model", description: "Divide a single whole quantity into parts" },
              { id: "BEFORE_AFTER", label: "Before & After Model", description: "Show transfers or changes across time states" }
            ],
            entities: [
              { id: "B", name: nameB, value: "?", displayValue: "?", relation: "BASE" },
              { id: "A", name: nameA, value: "?", displayValue: "?", relativeTo: nameB, relation: "MORE", diffValue: "?", displayDiff: "?", actualDiff: diff }
            ],
            target: { type: "BAR", targetEntity: askForA ? "A" : "B", label: targetName },
            steps: steps
          }
        }, null, 2);
      } else {
        visualEngineStr = JSON.stringify({
          componentToRender: "BAR_MODEL_COMPARISON",
          componentData: {
            modelType: "BAR_MODEL_COMPARISON",
            bars: [
              { name: `${nameA} (In the end)`, value: equalized, layoutSize: equalized, displayValue: equalized.toLocaleString() },
              { name: `${nameB} (In the end)`, value: equalized, layoutSize: equalized, displayValue: equalized.toLocaleString() }
            ]
          }
        }, null, 2);
      }

      if (isMCQ) {
        const otherEntity = (askForA ? smaller : larger).toString();
        const d1 = otherEntity;
        const d2 = equalized.toString();
        const d3 = (askForA ? equalized + diff : equalized - diff).toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "OPPOSITE_ENTITY_FOUND" },
          { val: d2, defect: "USED_EQUALIZED_AMOUNT" },
          { val: d3, defect: "APPLIED_FULL_DIFFERENCE" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      if (askForA) {
        solutionSteps = `Step 1: ${nameA} gave away ${transfer.toLocaleString()} ${item} to end up with ${equalized.toLocaleString()} ${item}.\\nStep 2: Add the transferred amount back to find ${nameA}'s original amount: ${equalized.toLocaleString()} + ${transfer.toLocaleString()} = ${larger.toLocaleString()}.\\nStep 3: ${nameA} had ${larger.toLocaleString()} ${item} at first.`;
        hint = `Since ${nameA} gave away ${transfer.toLocaleString()} ${item} to have ${equalized.toLocaleString()} left, add the given amount back!`;
      } else {
        solutionSteps = `Step 1: ${nameB} received ${transfer.toLocaleString()} ${item} to end up with ${equalized.toLocaleString()} ${item}.\\nStep 2: Subtract the transferred amount to find ${nameB}'s original amount: ${equalized.toLocaleString()} - ${transfer.toLocaleString()} = ${smaller.toLocaleString()}.\\nStep 3: ${nameB} had ${smaller.toLocaleString()} ${item} at first.`;
        hint = `Since ${nameB} received ${transfer.toLocaleString()} ${item} to reach ${equalized.toLocaleString()}, subtract the received amount to find what ${nameB} had at first!`;
      }

    // ========================================================================
    // Variety 3: find_initial_from_total_and_transfer (Given Grand Total T and transfer t, find starting amounts)
    // ========================================================================
    } else if (selectedVariety === 'find_initial_from_total_and_transfer') {
      const askForA = Math.random() < 0.5;
      finalAnswer = (askForA ? larger : smaller).toString();
      const targetName = askForA ? nameA : nameB;

      promptInstruction = `- Question stem: "${nameA} and ${nameB} had a combined total of ${grandTotal.toLocaleString()} ${item}. After ${nameA} gave ${transfer.toLocaleString()} ${item} to ${nameB}, both of them had an equal number of ${item}. How many ${item} did ${targetName} have at first?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        visualEngineStr = JSON.stringify({
          componentToRender: "NONE",
          hideVisual: true,
          componentData: {
            hideVisual: true,
            modelType: "BAR_MODEL_COMPARISON",
            bars: [
              { name: `${nameA} (At first)`, value: askForA ? "?" : "", layoutSize: larger, displayValue: askForA ? "?" : "" },
              { name: `${nameB} (At first)`, value: !askForA ? "?" : "", layoutSize: smaller, displayValue: !askForA ? "?" : "" }
            ],
            difference: { displayValue: "" },
            whole: grandTotal.toLocaleString()
          }
        }, null, 2);

        const steps = [
          {
            label: `Write the working equation to find how many ${item} each person had in the end:`,
            expectedAnswer: `${grandTotal} / 2 = ${equalized}`,
            acceptedAnswers: [
              `${grandTotal} / 2 = ${equalized}`,
              `${grandTotal}/2=${equalized}`,
              `${grandTotal} ÷ 2 = ${equalized}`,
              `${grandTotal}÷2=${equalized}`,
              equalized.toString(),
              Number(equalized).toLocaleString(),
              `${grandTotal} / 2`,
              `${grandTotal}/2`,
              `${grandTotal} ÷ 2`,
              `${grandTotal}÷2`
            ]
          },
          {
            label: `Write the working equation to find ${targetName}'s amount at first:`,
            expectedAnswer: askForA ? `${equalized} + ${transfer} = ${larger}` : `${equalized} - ${transfer} = ${smaller}`,
            acceptedAnswers: [
              finalAnswer,
              Number(finalAnswer).toLocaleString(),
              askForA ? `${equalized} + ${transfer} = ${larger}` : `${equalized} - ${transfer} = ${smaller}`,
              askForA ? `${equalized}+${transfer}=${larger}` : `${equalized}-${transfer}=${smaller}`,
              askForA ? `${equalized} + ${transfer}` : `${equalized} - ${transfer}`,
              askForA ? `${equalized}+${transfer}` : `${equalized}-${transfer}`
            ]
          },
          {
            label: "Final Answer:",
            expectedAnswer: finalAnswer,
            acceptedAnswers: [
              finalAnswer,
              Number(finalAnswer).toLocaleString(),
              `${finalAnswer} ${item}`,
              `${Number(finalAnswer).toLocaleString()} ${item}`
            ]
          }
        ];

        visualEngineStr = JSON.stringify({
          componentToRender: "NONE",
          hideVisual: true,
          componentData: {
            hideVisual: true,
            modelType: "BAR_MODEL_COMPARISON",
            bars: [
              { name: `${nameA} (At first)`, value: askForA ? "?" : "", layoutSize: larger, displayValue: askForA ? "?" : "" },
              { name: `${nameB} (At first)`, value: !askForA ? "?" : "", layoutSize: smaller, displayValue: !askForA ? "?" : "" }
            ],
            difference: { displayValue: "" },
            whole: grandTotal.toLocaleString()
          }
        }, null, 2);

        inputRequirementStr = JSON.stringify({
          inputType: "INTERACTIVE_BAR_BUILDER",
          steps: steps,
          barBuilderConfig: {
            problemType: "EQUALIZING_TRANSFER",
            targetType: "BAR",
            targetName: targetName,
            transferFrom: nameA,
            transferTo: nameB,
            transferAmount: transfer,
            differenceValue: diff,
            largerValue: larger,
            smallerValue: smaller,
            equalizedValue: equalized,
            grandTotal: grandTotal,
            displayTransfer: transfer.toLocaleString(),
            displayEqualized: equalized.toLocaleString(),
            displayDifference: diff.toLocaleString(),
            itemName: item,
            correctModelType: ["BEFORE_AFTER", "COMPARISON"],
            modelOptions: [
              { id: "COMPARISON", label: "Comparison Model", description: "Compare quantities across distinct entities" },
              { id: "PART_WHOLE", label: "Part-Whole Model", description: "Divide a single whole quantity into parts" },
              { id: "BEFORE_AFTER", label: "Before & After Model", description: "Show transfers or changes across time states" }
            ],
            entities: [
              { id: "B", name: nameB, value: "?", displayValue: "?", relation: "BASE" },
              { id: "A", name: nameA, value: "?", displayValue: "?", relativeTo: nameB, relation: "MORE", diffValue: "?", displayDiff: "?", actualDiff: diff }
            ],
            total: {
              label: "Combined Total",
              value: grandTotal,
              displayValue: grandTotal.toLocaleString(),
              isTarget: false
            },
            target: { type: "BAR", targetEntity: askForA ? "A" : "B", label: targetName },
            steps: steps
          }
        }, null, 2);
      } else {
        visualEngineStr = JSON.stringify({
          componentToRender: "BAR_MODEL_COMPARISON",
          componentData: {
            modelType: "BAR_MODEL_COMPARISON",
            bars: [
              { name: `${nameA} (At first)`, value: askForA ? "?" : "", layoutSize: larger, displayValue: askForA ? "?" : "" },
              { name: `${nameB} (At first)`, value: !askForA ? "?" : "", layoutSize: smaller, displayValue: !askForA ? "?" : "" }
            ],
            difference: { displayValue: "" },
            whole: grandTotal.toLocaleString()
          }
        }, null, 2);
      }

      if (isMCQ) {
        const otherEntity = (askForA ? smaller : larger).toString();
        const d1 = otherEntity;
        const d2 = equalized.toString();
        const d3 = (askForA ? grandTotal - transfer : grandTotal + transfer).toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "OPPOSITE_ENTITY_FOUND" },
          { val: d2, defect: "FOUND_EQUALIZED_AMOUNT_ONLY" },
          { val: d3, defect: "CONFUSED_TOTAL_WITH_EQUALIZED" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: Since the transfer is between the two people, their combined total does not change: Total = ${grandTotal.toLocaleString()}.\\nStep 2: When both have an equal number of ${item}, each person has: ${grandTotal.toLocaleString()} ÷ 2 = ${equalized.toLocaleString()}.\\nStep 3: `;
      if (askForA) {
        solutionSteps += `Add the transferred amount to find ${nameA}'s original amount: ${equalized.toLocaleString()} + ${transfer.toLocaleString()} = ${larger.toLocaleString()}.`;
        hint = `Since transferring items between them does not change the grand total, divide the total by 2 to find each person's equalized amount, then add back the given amount!`;
      } else {
        solutionSteps += `Subtract the transferred amount to find ${nameB}'s original amount: ${equalized.toLocaleString()} - ${transfer.toLocaleString()} = ${smaller.toLocaleString()}.`;
        hint = `Since transferring items between them does not change the grand total, divide the total by 2 to find each person's equalized amount, then subtract the received amount!`;
      }

    // ========================================================================
    // Variety 4: find_difference_from_transfer (Given transfer t, find initial difference d)
    // ========================================================================
    } else if (selectedVariety === 'find_difference_from_transfer') {
      finalAnswer = diff.toString();

      promptInstruction = `- Question stem: "After ${nameA} gave ${transfer.toLocaleString()} ${item} to ${nameB}, both of them had an equal number of ${item}. How many more ${item} did ${nameA} have than ${nameB} at first?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        visualEngineStr = JSON.stringify({
          componentToRender: "NONE",
          hideVisual: true,
          componentData: {
            hideVisual: true,
            modelType: "BAR_MODEL_COMPARISON",
            bars: [
              { name: nameA, value: "", layoutSize: larger, displayValue: "" },
              { name: nameB, value: "", layoutSize: smaller, displayValue: "" }
            ],
            difference: { displayValue: "?" }
          }
        }, null, 2);

        const steps = [
          {
            label: "Write the working equation:",
            expectedAnswer: `${transfer} * 2 = ${diff}`,
            acceptedAnswers: [
              `${transfer} * 2 = ${diff}`,
              `${transfer}*2=${diff}`,
              `${transfer} × 2 = ${diff}`,
              `${transfer}×2=${diff}`,
              `${transfer} + ${transfer} = ${diff}`,
              `${transfer}+${transfer}=${diff}`,
              diff.toString(),
              Number(diff).toLocaleString(),
              `${transfer} * 2`,
              `${transfer}*2`,
              `${transfer} × 2`,
              `${transfer}×2`
            ]
          },
          {
            label: "Final Answer:",
            expectedAnswer: finalAnswer,
            acceptedAnswers: [
              finalAnswer,
              Number(finalAnswer).toLocaleString(),
              `${finalAnswer} ${item}`,
              `${Number(finalAnswer).toLocaleString()} ${item}`
            ]
          }
        ];

        inputRequirementStr = JSON.stringify({
          inputType: "INTERACTIVE_BAR_BUILDER",
          steps: steps,
          barBuilderConfig: {
            problemType: "EQUALIZING_TRANSFER",
            targetType: "DIFFERENCE",
            transferFrom: nameA,
            transferTo: nameB,
            transferAmount: transfer,
            differenceValue: diff,
            largerValue: larger,
            smallerValue: smaller,
            equalizedValue: equalized,
            grandTotal: grandTotal,
            displayTransfer: transfer.toLocaleString(),
            displayEqualized: equalized.toLocaleString(),
            displayDifference: diff.toLocaleString(),
            itemName: item,
            correctModelType: ["BEFORE_AFTER", "COMPARISON"],
            modelOptions: [
              { id: "COMPARISON", label: "Comparison Model", description: "Compare quantities across distinct entities" },
              { id: "PART_WHOLE", label: "Part-Whole Model", description: "Divide a single whole quantity into parts" },
              { id: "BEFORE_AFTER", label: "Before & After Model", description: "Show transfers or changes across time states" }
            ],
            entities: [
              { id: "B", name: nameB, value: "", displayValue: "", relation: "BASE" },
              { id: "A", name: nameA, value: "", displayValue: "", relativeTo: nameB, relation: "MORE", diffValue: "?", displayDiff: "?", actualDiff: diff }
            ],
            target: { type: "DIFFERENCE", label: "Difference" },
            steps: steps
          }
        }, null, 2);
      } else {
        visualEngineStr = JSON.stringify({
          componentToRender: "BAR_MODEL_COMPARISON",
          componentData: {
            modelType: "BAR_MODEL_COMPARISON",
            bars: [
              { name: nameA, value: "", layoutSize: larger, displayValue: "" },
              { name: nameB, value: "", layoutSize: smaller, displayValue: "" }
            ],
            difference: { displayValue: "?" }
          }
        }, null, 2);
      }

      if (isMCQ) {
        const d1 = transfer.toString();
        const d2 = (transfer * 3).toString();
        const d3 = (diff + 1000).toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "USED_TRANSFER_AS_DIFFERENCE" },
          { val: d2, defect: "MULTIPLIED_BY_THREE" },
          { val: d3, defect: "CARELESS_CALCULATION" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: When ${nameA} gives away an amount to equalize, ${nameA} gives away half of the difference between them.\\nStep 2: Multiply the transferred amount by 2 to find the original difference: ${transfer.toLocaleString()} × 2 = ${diff.toLocaleString()}.\\nStep 3: ${nameA} had ${diff.toLocaleString()} more ${item} than ${nameB} at first.`;
      hint = `To make two amounts equal, the person with more gives away half of their difference. Therefore, the original difference is twice the transferred amount!`;

    // ========================================================================
    // Variety 5: find_other_initial_from_one_initial (Given one starting amount and transfer, find the other)
    // ========================================================================
    } else {
      const givenA = Math.random() < 0.5;
      finalAnswer = (givenA ? smaller : larger).toString();

      if (givenA) {
        promptInstruction = `- Question stem: "${nameA} had ${larger.toLocaleString()} ${item} at first. After ${nameA} gave ${transfer.toLocaleString()} ${item} to ${nameB}, both of them had an equal number of ${item}. How many ${item} did ${nameB} have at first?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

        if (isStructure) {
          visualEngineStr = JSON.stringify({
            componentToRender: "NONE",
            hideVisual: true,
            componentData: {
              hideVisual: true,
              modelType: "BAR_MODEL_COMPARISON",
              bars: [
                { name: `${nameA} (At first)`, value: larger, layoutSize: larger, displayValue: larger.toLocaleString() },
                { name: `${nameB} (At first)`, value: "?", layoutSize: smaller, displayValue: "?" }
              ],
              difference: { displayValue: "" }
            }
          }, null, 2);

          const steps = [
            {
              label: `Write the working equation to find the equalized amount ${nameA} had in the end:`,
              expectedAnswer: `${larger} - ${transfer} = ${equalized}`,
              acceptedAnswers: [
                `${larger} - ${transfer} = ${equalized}`,
                `${larger}-${transfer}=${equalized}`,
                equalized.toString(),
                Number(equalized).toLocaleString(),
                `${larger} - ${transfer}`,
                `${larger}-${transfer}`
              ]
            },
            {
              label: `Write the working equation to find ${nameB}'s amount at first:`,
              expectedAnswer: `${equalized} - ${transfer} = ${smaller}`,
              acceptedAnswers: [
                `${equalized} - ${transfer} = ${smaller}`,
                `${equalized}-${transfer}=${smaller}`,
                `${larger} - ${diff} = ${smaller}`,
                `${larger}-${diff}=${smaller}`,
                smaller.toString(),
                Number(smaller).toLocaleString(),
                `${equalized} - ${transfer}`,
                `${equalized}-${transfer}`
              ]
            },
            {
              label: "Final Answer:",
              expectedAnswer: finalAnswer,
              acceptedAnswers: [
                finalAnswer,
                Number(finalAnswer).toLocaleString(),
                `${finalAnswer} ${item}`,
                `${Number(finalAnswer).toLocaleString()} ${item}`
              ]
            }
          ];

          visualEngineStr = JSON.stringify({
            componentToRender: "NONE",
            hideVisual: true,
            componentData: {
              hideVisual: true,
              modelType: "BAR_MODEL_COMPARISON",
              bars: [
                { name: `${nameA} (At first)`, value: larger, layoutSize: larger, displayValue: larger.toLocaleString() },
                { name: `${nameB} (At first)`, value: "?", layoutSize: smaller, displayValue: "?" }
              ],
              difference: { displayValue: "" }
            }
          }, null, 2);

          inputRequirementStr = JSON.stringify({
            inputType: "INTERACTIVE_BAR_BUILDER",
            steps: steps,
            barBuilderConfig: {
              problemType: "EQUALIZING_TRANSFER",
              targetType: "BAR",
              targetName: nameB,
              transferFrom: nameA,
              transferTo: nameB,
              transferAmount: transfer,
              differenceValue: diff,
              largerValue: larger,
              smallerValue: smaller,
              equalizedValue: equalized,
              grandTotal: grandTotal,
              displayTransfer: transfer.toLocaleString(),
              displayEqualized: equalized.toLocaleString(),
              displayDifference: diff.toLocaleString(),
              itemName: item,
              correctModelType: ["BEFORE_AFTER", "COMPARISON"],
              modelOptions: [
                { id: "COMPARISON", label: "Comparison Model", description: "Compare quantities across distinct entities" },
                { id: "PART_WHOLE", label: "Part-Whole Model", description: "Divide a single whole quantity into parts" },
                { id: "BEFORE_AFTER", label: "Before & After Model", description: "Show transfers or changes across time states" }
              ],
              entities: [
                { id: "B", name: nameB, value: "?", displayValue: "?", relation: "BASE" },
                { id: "A", name: nameA, value: larger, displayValue: larger.toLocaleString(), relativeTo: nameB, relation: "MORE", diffValue: diff, displayDiff: `+${diff.toLocaleString()}` }
              ],
              target: { type: "BAR", targetEntity: "B", label: nameB },
              steps: steps
            }
          }, null, 2);
        } else {
          visualEngineStr = JSON.stringify({
            componentToRender: "BAR_MODEL_COMPARISON",
            componentData: {
              modelType: "BAR_MODEL_COMPARISON",
              bars: [
                { name: `${nameA} (At first)`, value: larger, layoutSize: larger, displayValue: larger.toLocaleString() },
                { name: `${nameB} (At first)`, value: "?", layoutSize: smaller, displayValue: "?" }
              ],
              difference: { displayValue: "" }
            }
          }, null, 2);
        }

        if (isMCQ) {
          const d1 = equalized.toString();
          const d2 = (larger - transfer).toString();
          const d3 = (smaller + 1000).toString();
          const mcqRes = ensureFourUniqueOptions(finalAnswer, [
            { val: d1, defect: "STOPPED_AT_EQUALIZED_AMOUNT" },
            { val: d2, defect: "SUBTRACTED_TRANSFER_ONCE_ONLY" },
            { val: d3, defect: "CARELESS_CALCULATION" }
          ]);
          options = mcqRes.options;
          defectMap = mcqRes.defectMap;
        }

        solutionSteps = `Step 1: Find how many ${item} ${nameA} had in the end: ${larger.toLocaleString()} - ${transfer.toLocaleString()} = ${equalized.toLocaleString()}.\\nStep 2: Since both ended up with ${equalized.toLocaleString()} and ${nameB} had received ${transfer.toLocaleString()}, subtract to find ${nameB}'s starting amount: ${equalized.toLocaleString()} - ${transfer.toLocaleString()} = ${smaller.toLocaleString()}.\\nStep 3: ${nameB} had ${smaller.toLocaleString()} ${item} at first.`;
        hint = `Find the equal amount each person had in the end first, then subtract the transferred amount from that to find ${nameB}'s starting amount!`;

      } else {
        promptInstruction = `- Question stem: "${nameB} had ${smaller.toLocaleString()} ${item} at first. After ${nameA} gave ${transfer.toLocaleString()} ${item} to ${nameB}, both of them had an equal number of ${item}. How many ${item} did ${nameA} have at first?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

        if (isStructure) {
          visualEngineStr = JSON.stringify({
            componentToRender: "NONE",
            hideVisual: true,
            componentData: {
              hideVisual: true,
              modelType: "BAR_MODEL_COMPARISON",
              bars: [
                { name: `${nameA} (At first)`, value: "?", layoutSize: larger, displayValue: "?" },
                { name: `${nameB} (At first)`, value: smaller, layoutSize: smaller, displayValue: smaller.toLocaleString() }
              ],
              difference: { displayValue: "" }
            }
          }, null, 2);

          const steps = [
            {
              label: `Write the working equation to find the equalized amount ${nameB} had in the end:`,
              expectedAnswer: `${smaller} + ${transfer} = ${equalized}`,
              acceptedAnswers: [
                `${smaller} + ${transfer} = ${equalized}`,
                `${smaller}+${transfer}=${equalized}`,
                equalized.toString(),
                Number(equalized).toLocaleString(),
                `${smaller} + ${transfer}`,
                `${smaller}+${transfer}`
              ]
            },
            {
              label: `Write the working equation to find ${nameA}'s amount at first:`,
              expectedAnswer: `${equalized} + ${transfer} = ${larger}`,
              acceptedAnswers: [
                `${equalized} + ${transfer} = ${larger}`,
                `${equalized}+${transfer}=${larger}`,
                `${smaller} + ${diff} = ${larger}`,
                `${smaller}+${diff}=${larger}`,
                larger.toString(),
                Number(larger).toLocaleString(),
                `${equalized} + ${transfer}`,
                `${equalized}+${transfer}`
              ]
            },
            {
              label: "Final Answer:",
              expectedAnswer: finalAnswer,
              acceptedAnswers: [
                finalAnswer,
                Number(finalAnswer).toLocaleString(),
                `${finalAnswer} ${item}`,
                `${Number(finalAnswer).toLocaleString()} ${item}`
              ]
            }
          ];

          visualEngineStr = JSON.stringify({
            componentToRender: "NONE",
            hideVisual: true,
            componentData: {
              hideVisual: true,
              modelType: "BAR_MODEL_COMPARISON",
              bars: [
                { name: `${nameA} (At first)`, value: "?", layoutSize: larger, displayValue: "?" },
                { name: `${nameB} (At first)`, value: smaller, layoutSize: smaller, displayValue: smaller.toLocaleString() }
              ],
              difference: { displayValue: "" }
            }
          }, null, 2);

          inputRequirementStr = JSON.stringify({
            inputType: "INTERACTIVE_BAR_BUILDER",
            steps: steps,
            barBuilderConfig: {
              problemType: "EQUALIZING_TRANSFER",
              targetType: "BAR",
              targetName: nameA,
              transferFrom: nameA,
              transferTo: nameB,
              transferAmount: transfer,
              differenceValue: diff,
              largerValue: larger,
              smallerValue: smaller,
              equalizedValue: equalized,
              grandTotal: grandTotal,
              displayTransfer: transfer.toLocaleString(),
              displayEqualized: equalized.toLocaleString(),
              displayDifference: diff.toLocaleString(),
              itemName: item,
              correctModelType: ["BEFORE_AFTER", "COMPARISON"],
              modelOptions: [
                { id: "COMPARISON", label: "Comparison Model", description: "Compare quantities across distinct entities" },
                { id: "PART_WHOLE", label: "Part-Whole Model", description: "Divide a single whole quantity into parts" },
                { id: "BEFORE_AFTER", label: "Before & After Model", description: "Show transfers or changes across time states" }
              ],
              entities: [
                { id: "B", name: nameB, value: smaller, displayValue: smaller.toLocaleString(), relation: "BASE" },
                { id: "A", name: nameA, value: "?", displayValue: "?", relativeTo: nameB, relation: "MORE", diffValue: diff, displayDiff: `+${diff.toLocaleString()}` }
              ],
              target: { type: "BAR", targetEntity: "A", label: nameA },
              steps: steps
            }
          }, null, 2);
        } else {
          visualEngineStr = JSON.stringify({
            componentToRender: "BAR_MODEL_COMPARISON",
            componentData: {
              modelType: "BAR_MODEL_COMPARISON",
              bars: [
                { name: `${nameA} (At first)`, value: "?", layoutSize: larger, displayValue: "?" },
                { name: `${nameB} (At first)`, value: smaller, layoutSize: smaller, displayValue: smaller.toLocaleString() }
              ],
              difference: { displayValue: "" }
            }
          }, null, 2);
        }

        if (isMCQ) {
          const d1 = equalized.toString();
          const d2 = (smaller + transfer).toString();
          const d3 = (larger - 1000).toString();
          const mcqRes = ensureFourUniqueOptions(finalAnswer, [
            { val: d1, defect: "STOPPED_AT_EQUALIZED_AMOUNT" },
            { val: d2, defect: "ADDED_TRANSFER_ONCE_ONLY" },
            { val: d3, defect: "CARELESS_CALCULATION" }
          ]);
          options = mcqRes.options;
          defectMap = mcqRes.defectMap;
        }

        solutionSteps = `Step 1: Find how many ${item} ${nameB} had in the end after receiving: ${smaller.toLocaleString()} + ${transfer.toLocaleString()} = ${equalized.toLocaleString()}.\\nStep 2: Since ${nameA} gave away ${transfer.toLocaleString()} to reach ${equalized.toLocaleString()}, add the transfer back: ${equalized.toLocaleString()} + ${transfer.toLocaleString()} = ${larger.toLocaleString()}.\\nStep 3: ${nameA} had ${larger.toLocaleString()} ${item} at first.`;
        hint = `Find the equal amount each person had in the end by adding the transfer to ${nameB}, then add the transfer to that to find ${nameA}'s original amount!`;
      }
    }
  }

  // ==========================================================================
  // VARIANT 3: advanced_three_entity_grand_total (Three-Entity Base Finder & Multi-Unit Grand Totals)
  // Varieties:
  // - find_smallest_base: Divide by 3 (equal units + chain differences), asks for smallest entity (A)
  // - find_middle_entity: Divide by 3, asks for middle entity (B)
  // - find_largest_entity: Divide by 3, asks for largest entity (C)
  // - find_combined_entities: Divide by 3, asks for combined sum of two entities (A + B)
  // - find_difference_entities: Divide by 3, asks for difference between two entities (C - A)
  // - multiples_divide_four: Divide by 4 (multiples ratio: 1 unit, 2 units, 1 unit + extra)
  // - multiples_divide_five: Divide by 5 (multiples ratio: 1 unit, 2 units, 2 units + extra)
  // - equal_units_divide_two: Divide by 2 (two equal units + fixed third entity)
  // ==========================================================================
  else if (effectiveVariant === 'advanced_three_entity_grand_total') {
    const [nameA, nameB, nameC] = getRandomNames(3);
    const itemObj = getRandomCountableItems(1);
    const item = itemObj?.item || "admission tickets";

    const varietiesList = [
      'find_smallest_base',
      'find_middle_entity',
      'find_largest_entity',
      'find_combined_entities',
      'find_difference_entities',
      'multiples_divide_four',
      'multiples_divide_five',
      'equal_units_divide_two'
    ];
    let selectedVariety = explicitVariety;
    if (!varietiesList.includes(selectedVariety)) {
      selectedVariety = varietiesList[Math.floor(Math.random() * varietiesList.length)];
    }

    // ------------------------------------------------------------------------
    // CASE 1: Divide by 3 (Equal Units + Differences)
    // ------------------------------------------------------------------------
    if ([
      'find_smallest_base',
      'find_middle_entity',
      'find_largest_entity',
      'find_combined_entities',
      'find_difference_entities'
    ].includes(selectedVariety)) {
      const baseUnit = (Math.floor(Math.random() * 12) + 12) * 1000 + Math.floor(Math.random() * 9) * 100; // 12k - 24k
      const x = (Math.floor(Math.random() * 6) + 3) * 1000 + Math.floor(Math.random() * 9) * 100; // 3k - 8k
      const y = (Math.floor(Math.random() * 6) + 2) * 1000 + Math.floor(Math.random() * 9) * 100; // 2k - 7k

      const amountA = baseUnit;
      const amountB = baseUnit + x;
      const amountC = amountB + y;
      const extraTotal = x + (x + y);
      const grandTotal = amountA + amountB + amountC;

      let questionTarget = 'A';
      if (selectedVariety === 'find_middle_entity') questionTarget = 'B';
      else if (selectedVariety === 'find_largest_entity') questionTarget = 'C';
      else if (selectedVariety === 'find_combined_entities') questionTarget = 'A_plus_B';
      else if (selectedVariety === 'find_difference_entities') questionTarget = 'C_minus_A';
      else questionTarget = 'A';

      let targetQuestionText = "";
      if (questionTarget === 'A') {
        targetQuestionText = `How many ${item} did ${nameA} collect?`;
        finalAnswer = amountA.toString();
      } else if (questionTarget === 'B') {
        targetQuestionText = `How many ${item} did ${nameB} collect?`;
        finalAnswer = amountB.toString();
      } else if (questionTarget === 'C') {
        targetQuestionText = `How many ${item} did ${nameC} collect?`;
        finalAnswer = amountC.toString();
      } else if (questionTarget === 'A_plus_B') {
        targetQuestionText = `How many ${item} did ${nameA} and ${nameB} collect altogether?`;
        finalAnswer = (amountA + amountB).toString();
      } else if (questionTarget === 'C_minus_A') {
        targetQuestionText = `How many more ${item} did ${nameC} collect than ${nameA}?`;
        finalAnswer = (amountC - amountA).toString();
      }

      const threeUnits = 3 * baseUnit;

      if (isStructure) {
        visualEngineStr = JSON.stringify({
          componentToRender: "NONE",
          hideVisual: true,
          componentData: {
            hideVisual: true,
            modelType: "BAR_MODEL_COMPARISON",
            bars: [
              { name: nameA, value: "", layoutSize: amountA, displayValue: "" },
              { name: nameB, value: "", layoutSize: amountB, displayValue: "" },
              { name: nameC, value: "", layoutSize: amountC, displayValue: "" }
            ],
            whole: grandTotal.toLocaleString()
          }
        }, null, 2);

        const steps = [
          {
            label: "Write the working equation to find the total extra amount:",
            expectedAnswer: `${x} + ${x + y} = ${extraTotal}`,
            acceptedAnswers: [
              `${x} + ${x + y} = ${extraTotal}`,
              `${x}+${x + y}=${extraTotal}`,
              `${x + y} + ${x} = ${extraTotal}`,
              `${x + y}+${x}=${extraTotal}`,
              `${x} + ${x} + ${y} = ${extraTotal}`,
              `${x}+${x}+${y}=${extraTotal}`,
              `${2 * x} + ${y} = ${extraTotal}`,
              `${2 * x}+${y}=${extraTotal}`,
              extraTotal.toString(),
              Number(extraTotal).toLocaleString(),
              `${x} + ${x + y}`,
              `${x}+${x + y}`,
              `${x} + ${x} + ${y}`,
              `${x}+${x}+${y}`
            ]
          },
          {
            label: "Write the working equation to find the value of 3 equal units:",
            expectedAnswer: `${grandTotal} - ${extraTotal} = ${threeUnits}`,
            acceptedAnswers: [
              `${grandTotal} - ${extraTotal} = ${threeUnits}`,
              `${grandTotal}-${extraTotal}=${threeUnits}`,
              threeUnits.toString(),
              Number(threeUnits).toLocaleString(),
              `${grandTotal} - ${extraTotal}`,
              `${grandTotal}-${extraTotal}`
            ]
          },
          {
            label: `Write the working equation to find 1 unit (${nameA}):`,
            expectedAnswer: `${threeUnits} / 3 = ${baseUnit}`,
            acceptedAnswers: [
              `${threeUnits} / 3 = ${baseUnit}`,
              `${threeUnits}/3=${baseUnit}`,
              `${threeUnits} ÷ 3 = ${baseUnit}`,
              `${threeUnits}÷3=${baseUnit}`,
              baseUnit.toString(),
              Number(baseUnit).toLocaleString(),
              `${threeUnits} / 3`,
              `${threeUnits}/3`,
              `${threeUnits} ÷ 3`,
              `${threeUnits}÷3`
            ]
          }
        ];

        if (questionTarget === 'B') {
          steps.push({
            label: `Write the working equation to find ${nameB}'s amount:`,
            expectedAnswer: `${baseUnit} + ${x} = ${amountB}`,
            acceptedAnswers: [
              `${baseUnit} + ${x} = ${amountB}`,
              `${baseUnit}+${x}=${amountB}`,
              `${x} + ${baseUnit} = ${amountB}`,
              `${x}+${baseUnit}=${amountB}`,
              amountB.toString(),
              Number(amountB).toLocaleString(),
              `${baseUnit} + ${x}`,
              `${baseUnit}+${x}`
            ]
          });
        } else if (questionTarget === 'C') {
          steps.push({
            label: `Write the working equation to find ${nameC}'s amount:`,
            expectedAnswer: `${baseUnit} + ${x + y} = ${amountC}`,
            acceptedAnswers: [
              `${baseUnit} + ${x + y} = ${amountC}`,
              `${baseUnit}+${x + y}=${amountC}`,
              `${baseUnit} + ${x} + ${y} = ${amountC}`,
              `${baseUnit}+${x}+${y}=${amountC}`,
              `${amountB} + ${y} = ${amountC}`,
              `${amountB}+${y}=${amountC}`,
              `${x + y} + ${baseUnit} = ${amountC}`,
              `${x + y}+${baseUnit}=${amountC}`,
              amountC.toString(),
              Number(amountC).toLocaleString(),
              `${baseUnit} + ${x + y}`,
              `${baseUnit}+${x + y}`,
              `${baseUnit} + ${x} + ${y}`,
              `${baseUnit}+${x}+${y}`,
              `${amountB} + ${y}`,
              `${amountB}+${y}`
            ]
          });
        } else if (questionTarget === 'A_plus_B') {
          steps.push({
            label: `Write the working equation to find ${nameB}'s amount:`,
            expectedAnswer: `${baseUnit} + ${x} = ${amountB}`,
            acceptedAnswers: [
              `${baseUnit} + ${x} = ${amountB}`,
              `${baseUnit}+${x}=${amountB}`,
              `${x} + ${baseUnit} = ${amountB}`,
              `${x}+${baseUnit}=${amountB}`,
              amountB.toString(),
              Number(amountB).toLocaleString(),
              `${baseUnit} + ${x}`,
              `${baseUnit}+${x}`
            ]
          });
          steps.push({
            label: `Write the working equation to find the total of ${nameA} and ${nameB}:`,
            expectedAnswer: `${amountA} + ${amountB} = ${amountA + amountB}`,
            acceptedAnswers: [
              `${amountA} + ${amountB} = ${amountA + amountB}`,
              `${amountA}+${amountB}=${amountA + amountB}`,
              `${amountB} + ${amountA} = ${amountA + amountB}`,
              `${amountB}+${amountA}=${amountA + amountB}`,
              `${baseUnit} * 2 + ${x} = ${amountA + amountB}`,
              `${baseUnit}*2+${x}=${amountA + amountB}`,
              `${baseUnit} × 2 + ${x} = ${amountA + amountB}`,
              `${baseUnit}×2+${x}=${amountA + amountB}`,
              (amountA + amountB).toString(),
              Number(amountA + amountB).toLocaleString(),
              `${amountA} + ${amountB}`,
              `${amountA}+${amountB}`
            ]
          });
        } else if (questionTarget === 'C_minus_A') {
          steps.push({
            label: `Write the working equation to find how many more ${item} ${nameC} collected than ${nameA}:`,
            expectedAnswer: `${x} + ${y} = ${amountC - amountA}`,
            acceptedAnswers: [
              `${x} + ${y} = ${amountC - amountA}`,
              `${x}+${y}=${amountC - amountA}`,
              `${y} + ${x} = ${amountC - amountA}`,
              `${y}+${x}=${amountC - amountA}`,
              `${amountC} - ${amountA} = ${amountC - amountA}`,
              `${amountC}-${amountA}=${amountC - amountA}`,
              (amountC - amountA).toString(),
              Number(amountC - amountA).toLocaleString(),
              `${x} + ${y}`,
              `${x}+${y}`,
              `${amountC} - ${amountA}`,
              `${amountC}-${amountA}`
            ]
          });
        }

        steps.push({
          label: "Final Answer:",
          expectedAnswer: finalAnswer,
          acceptedAnswers: [
            finalAnswer,
            Number(finalAnswer).toLocaleString(),
            `${finalAnswer} ${item}`,
            `${Number(finalAnswer).toLocaleString()} ${item}`
          ]
        });

        let targetObj = { type: "BAR", targetEntity: "bar-1", label: nameA };
        if (questionTarget === 'B') targetObj = { type: "BAR", targetEntity: "bar-2", label: nameB };
        else if (questionTarget === 'C') targetObj = { type: "BAR", targetEntity: "bar-3", label: nameC };
        else if (questionTarget === 'A_plus_B') targetObj = { type: "COMBINED", label: `${nameA} & ${nameB}` };
        else if (questionTarget === 'C_minus_A') targetObj = { type: "DIFFERENCE", label: `${nameC} - ${nameA}` };

        inputRequirementStr = JSON.stringify({
          inputType: "INTERACTIVE_BAR_BUILDER",
          steps: steps,
          barBuilderConfig: {
            problemType: "THREE_ENTITY_GRAND_TOTAL",
            correctModelType: "COMPARISON",
            modelOptions: [
              { id: "COMPARISON", label: "Comparison Model", description: "Compare quantities across distinct entities" },
              { id: "PART_WHOLE", label: "Part-Whole Model", description: "Divide a single whole quantity into parts" },
              { id: "BEFORE_AFTER", label: "Before & After Model", description: "Show transfers or changes across time states" }
            ],
            entities: [
              { id: "bar-1", name: nameA, relation: "BASE", value: "?", displayValue: "1 unit" },
              { id: "bar-2", name: nameB, relation: "MORE", relativeTo: nameA, diffValue: x.toString(), displayDiff: x.toLocaleString() },
              { 
                id: "bar-3", 
                name: nameC, 
                relation: "MORE", 
                relativeTo: nameB, 
                diffValue: (x + y).toString(), 
                displayDiff: (x + y).toLocaleString(),
                diffSegments: [
                  { id: "bar-3-seg-1", value: x.toString(), displayValue: x.toLocaleString(), length: 14 },
                  { id: "bar-3-seg-2", value: y.toString(), displayValue: y.toLocaleString(), length: 14 }
                ]
              }
            ],
            total: { label: "Grand Total", value: grandTotal.toString(), displayValue: grandTotal.toLocaleString(), isTarget: false },
            target: targetObj,
            steps: steps,
            itemName: item
          }
        }, null, 2);
      } else {
        visualEngineStr = JSON.stringify({
          componentToRender: "BAR_MODEL_COMPARISON",
          componentData: {
            modelType: "BAR_MODEL_COMPARISON",
            bars: [
              {
                name: nameA,
                value: questionTarget === 'A' ? '?' : '',
                layoutSize: amountA,
                parts: [
                  {
                    label: questionTarget === 'A' ? '?' : '1 unit',
                    size: amountA,
                    bgClass: questionTarget === 'A' ? 'bg-indigo-600 text-white font-black' : 'bg-blue-500 text-white'
                  }
                ]
              },
              {
                name: nameB,
                value: questionTarget === 'B' ? '?' : '',
                layoutSize: amountB,
                parts: [
                  {
                    label: '1 unit',
                    size: amountA,
                    bgClass: 'bg-blue-500 text-white'
                  },
                  {
                    label: '',
                    bracket: `${x.toLocaleString()}`,
                    size: x,
                    isExtra: true,
                    bgClass: 'bg-amber-100 text-amber-900 border-l-2 border-dashed border-amber-400'
                  }
                ]
              },
              {
                name: nameC,
                value: questionTarget === 'C' ? '?' : '',
                layoutSize: amountC,
                parts: [
                  {
                    label: '1 unit',
                    size: amountA,
                    bgClass: 'bg-blue-500 text-white'
                  },
                  {
                    label: '',
                    size: x,
                    isExtra: true,
                    bgClass: 'bg-amber-100 text-amber-900 border-l-2 border-dashed border-amber-400'
                  },
                  {
                    label: '',
                    bracket: `${y.toLocaleString()}`,
                    size: y,
                    isExtra: true,
                    bgClass: 'bg-emerald-100 text-emerald-900 border-l-2 border-dashed border-emerald-400'
                  }
                ]
              }
            ],
            whole: grandTotal.toLocaleString()
          }
        }, null, 2);
      }

      if (isMCQ) {
        const otherAnswers = [amountA, amountB, amountC, amountA + amountB, amountC - amountA]
          .map(n => n.toString())
          .filter(n => n !== finalAnswer);
        const rawDistractors = [
          { val: otherAnswers[0] || (parseInt(finalAnswer) + 1000).toString(), defect: "CONFUSED_ENTITY_OR_STEP" },
          { val: otherAnswers[1] || (parseInt(finalAnswer) - 1000).toString(), defect: "CONFUSED_ENTITY_OR_STEP" },
          { val: Math.floor(grandTotal / 3).toString(), defect: "IGNORED_EXTRA_UNITS" }
        ];
        const mcqRes = ensureFourUniqueOptions(finalAnswer, rawDistractors);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: In the bar model, represent the base amount (${nameA}'s collection) as 1 unit.\\n- ${nameA} = 1 unit\\n- ${nameB} = 1 unit + ${x.toLocaleString()}\\n- ${nameC} = 1 unit + ${x.toLocaleString()} + ${y.toLocaleString()} = 1 unit + ${(x + y).toLocaleString()}\\nTotal extra amount above 3 units: ${x.toLocaleString()} + ${(x + y).toLocaleString()} = ${extraTotal.toLocaleString()}.\\nStep 2: Subtract the extra amounts from the grand total to find the value of 3 equal units:\\n3 units = ${grandTotal.toLocaleString()} - ${extraTotal.toLocaleString()} = ${(3 * baseUnit).toLocaleString()}.\\nStep 3: Divide by 3 to find 1 unit (${nameA}'s amount):\\n1 unit = ${(3 * baseUnit).toLocaleString()} ÷ 3 = ${amountA.toLocaleString()}.`;
      if (questionTarget === 'B') {
        solutionSteps += `\\nStep 4: Find ${nameB}'s amount (1 unit + ${x.toLocaleString()}): ${amountA.toLocaleString()} + ${x.toLocaleString()} = ${amountB.toLocaleString()}.`;
      } else if (questionTarget === 'C') {
        solutionSteps += `\\nStep 4: Find ${nameC}'s amount (1 unit + ${(x + y).toLocaleString()}): ${amountA.toLocaleString()} + ${(x + y).toLocaleString()} = ${amountC.toLocaleString()}.`;
      } else if (questionTarget === 'A_plus_B') {
        solutionSteps += `\\nStep 4: Find ${nameB}'s amount: ${amountA.toLocaleString()} + ${x.toLocaleString()} = ${amountB.toLocaleString()}.\\nStep 5: Find the combined total of ${nameA} and ${nameB}: ${amountA.toLocaleString()} + ${amountB.toLocaleString()} = ${(amountA + amountB).toLocaleString()}.`;
      } else if (questionTarget === 'C_minus_A') {
        solutionSteps += `\\nStep 4: From the model, the difference between ${nameC} and ${nameA} is ${x.toLocaleString()} + ${y.toLocaleString()} = ${(amountC - amountA).toLocaleString()}.`;
      }

      hint = `In the bar model, let ${nameA}'s amount be 1 unit. Find the total extra amount above 3 units, subtract it from the grand total to find 3 units, then divide by 3!`;
    }

    // ------------------------------------------------------------------------
    // CASE 2: Divide by 4 (Multiples Ratio: 1 unit, 2 units, 1 unit + extra)
    // ------------------------------------------------------------------------
    else if (selectedVariety === 'multiples_divide_four') {
      const baseUnit = (Math.floor(Math.random() * 10) + 8) * 1000 + Math.floor(Math.random() * 9) * 100; // 8k - 17k
      const x = (Math.floor(Math.random() * 6) + 2) * 1000 + Math.floor(Math.random() * 9) * 100; // 2k - 7k

      const amountA = baseUnit;
      const amountB = 2 * baseUnit;
      const amountC = baseUnit + x;
      const grandTotal = amountA + amountB + amountC; // 4 units + x

      const targets = ['A', 'B', 'C', 'A_plus_B'];
      const questionTarget = targets[Math.floor(Math.random() * targets.length)];

      let targetQuestionText = "";
      if (questionTarget === 'A') {
        targetQuestionText = `How many ${item} did ${nameA} collect?`;
        finalAnswer = amountA.toString();
      } else if (questionTarget === 'B') {
        targetQuestionText = `How many ${item} did ${nameB} collect?`;
        finalAnswer = amountB.toString();
      } else if (questionTarget === 'C') {
        targetQuestionText = `How many ${item} did ${nameC} collect?`;
        finalAnswer = amountC.toString();
      } else {
        targetQuestionText = `How many ${item} did ${nameA} and ${nameB} collect altogether?`;
        finalAnswer = (amountA + amountB).toString();
      }

      const fourUnits = 4 * baseUnit;

      if (isStructure) {
        visualEngineStr = JSON.stringify({
          componentToRender: "NONE",
          hideVisual: true,
          componentData: {
            hideVisual: true,
            modelType: "BAR_MODEL_COMPARISON",
            bars: [
              { name: nameA, value: "", layoutSize: amountA, displayValue: "" },
              { name: nameB, value: "", layoutSize: amountB, displayValue: "" },
              { name: nameC, value: "", layoutSize: amountC, displayValue: "" }
            ],
            whole: grandTotal.toLocaleString()
          }
        }, null, 2);

        const steps = [
          {
            label: "Write the working equation to find the value of 4 equal units:",
            expectedAnswer: `${grandTotal} - ${x} = ${fourUnits}`,
            acceptedAnswers: [
              `${grandTotal} - ${x} = ${fourUnits}`,
              `${grandTotal}-${x}=${fourUnits}`,
              fourUnits.toString(),
              Number(fourUnits).toLocaleString(),
              `${grandTotal} - ${x}`,
              `${grandTotal}-${x}`
            ]
          },
          {
            label: `Write the working equation to find 1 unit (${nameA}):`,
            expectedAnswer: `${fourUnits} / 4 = ${baseUnit}`,
            acceptedAnswers: [
              `${fourUnits} / 4 = ${baseUnit}`,
              `${fourUnits}/4=${baseUnit}`,
              `${fourUnits} ÷ 4 = ${baseUnit}`,
              `${fourUnits}÷4=${baseUnit}`,
              baseUnit.toString(),
              Number(baseUnit).toLocaleString(),
              `${fourUnits} / 4`,
              `${fourUnits}/4`,
              `${fourUnits} ÷ 4`,
              `${fourUnits}÷4`
            ]
          }
        ];

        if (questionTarget === 'B') {
          steps.push({
            label: `Write the working equation to find ${nameB}'s amount:`,
            expectedAnswer: `${baseUnit} * 2 = ${amountB}`,
            acceptedAnswers: [
              `${baseUnit} * 2 = ${amountB}`,
              `${baseUnit}*2=${amountB}`,
              `${baseUnit} × 2 = ${amountB}`,
              `${baseUnit}×2=${amountB}`,
              `${baseUnit} + ${baseUnit} = ${amountB}`,
              `${baseUnit}+${baseUnit}=${amountB}`,
              amountB.toString(),
              Number(amountB).toLocaleString(),
              `${baseUnit} * 2`,
              `${baseUnit}*2`,
              `${baseUnit} × 2`,
              `${baseUnit}×2`
            ]
          });
        } else if (questionTarget === 'C') {
          steps.push({
            label: `Write the working equation to find ${nameC}'s amount:`,
            expectedAnswer: `${baseUnit} + ${x} = ${amountC}`,
            acceptedAnswers: [
              `${baseUnit} + ${x} = ${amountC}`,
              `${baseUnit}+${x}=${amountC}`,
              `${x} + ${baseUnit} = ${amountC}`,
              `${x}+${baseUnit}=${amountC}`,
              amountC.toString(),
              Number(amountC).toLocaleString(),
              `${baseUnit} + ${x}`,
              `${baseUnit}+${x}`
            ]
          });
        } else if (questionTarget === 'A_plus_B') {
          steps.push({
            label: `Write the working equation to find the total of ${nameA} and ${nameB}:`,
            expectedAnswer: `${baseUnit} * 3 = ${amountA + amountB}`,
            acceptedAnswers: [
              `${baseUnit} * 3 = ${amountA + amountB}`,
              `${baseUnit}*3=${amountA + amountB}`,
              `${baseUnit} × 3 = ${amountA + amountB}`,
              `${baseUnit}×3=${amountA + amountB}`,
              `${amountA} + ${amountB} = ${amountA + amountB}`,
              `${amountA}+${amountB}=${amountA + amountB}`,
              (amountA + amountB).toString(),
              Number(amountA + amountB).toLocaleString(),
              `${baseUnit} * 3`,
              `${baseUnit}*3`
            ]
          });
        }

        steps.push({
          label: "Final Answer:",
          expectedAnswer: finalAnswer,
          acceptedAnswers: [
            finalAnswer,
            Number(finalAnswer).toLocaleString(),
            `${finalAnswer} ${item}`,
            `${Number(finalAnswer).toLocaleString()} ${item}`
          ]
        });

        let targetObj = { type: "BAR", targetEntity: "bar-1", label: nameA };
        if (questionTarget === 'B') targetObj = { type: "BAR", targetEntity: "bar-2", label: nameB };
        else if (questionTarget === 'C') targetObj = { type: "BAR", targetEntity: "bar-3", label: nameC };
        else if (questionTarget === 'A_plus_B') targetObj = { type: "COMBINED", label: `${nameA} & ${nameB}` };

        inputRequirementStr = JSON.stringify({
          inputType: "INTERACTIVE_BAR_BUILDER",
          steps: steps,
          barBuilderConfig: {
            problemType: "THREE_ENTITY_GRAND_TOTAL",
            correctModelType: "COMPARISON",
            modelOptions: [
              { id: "COMPARISON", label: "Comparison Model", description: "Compare quantities across distinct entities" },
              { id: "PART_WHOLE", label: "Part-Whole Model", description: "Divide a single whole quantity into parts" },
              { id: "BEFORE_AFTER", label: "Before & After Model", description: "Show transfers or changes across time states" }
            ],
            entities: [
              { id: "bar-1", name: nameA, relation: "BASE", value: "?", displayValue: "1 unit" },
              { id: "bar-2", name: nameB, relation: "MULTIPLE", isMultiple: true, multipleFactor: 2, displayValue: "2 units" },
              { id: "bar-3", name: nameC, relation: "MORE", relativeTo: nameA, diffValue: x.toString(), displayDiff: x.toLocaleString() }
            ],
            total: { label: "Grand Total", value: grandTotal.toString(), displayValue: grandTotal.toLocaleString(), isTarget: false },
            target: targetObj,
            steps: steps,
            itemName: item
          }
        }, null, 2);
      } else {
        visualEngineStr = JSON.stringify({
          componentToRender: "BAR_MODEL_COMPARISON",
          componentData: {
            modelType: "BAR_MODEL_COMPARISON",
            bars: [
              {
                name: nameA,
                value: questionTarget === 'A' ? '?' : '',
                layoutSize: amountA,
                parts: [
                  {
                    label: questionTarget === 'A' ? '?' : '1 unit',
                    size: amountA,
                    bgClass: questionTarget === 'A' ? 'bg-indigo-600 text-white font-black' : 'bg-blue-500 text-white'
                  }
                ]
              },
              {
                name: nameB,
                value: questionTarget === 'B' ? '?' : '',
                layoutSize: amountB,
                parts: [
                  {
                    label: '1 unit',
                    size: amountA,
                    bgClass: 'bg-blue-500 text-white'
                  },
                  {
                    label: '1 unit',
                    size: amountA,
                    bgClass: 'bg-blue-500 text-white'
                  }
                ]
              },
              {
                name: nameC,
                value: questionTarget === 'C' ? '?' : '',
                layoutSize: amountC,
                parts: [
                  {
                    label: '1 unit',
                    size: amountA,
                    bgClass: 'bg-blue-500 text-white'
                  },
                  {
                    label: '',
                    bracket: `${x.toLocaleString()}`,
                    size: x,
                    isExtra: true,
                    bgClass: 'bg-amber-100 text-amber-900 border-l-2 border-dashed border-amber-400'
                  }
                ]
              }
            ],
            whole: grandTotal.toLocaleString()
          }
        }, null, 2);
      }

      if (isMCQ) {
        const otherAnswers = [amountA, amountB, amountC, amountA + amountB]
          .map(n => n.toString())
          .filter(n => n !== finalAnswer);
        const rawDistractors = [
          { val: otherAnswers[0] || (parseInt(finalAnswer) + 2000).toString(), defect: "CONFUSED_ENTITY_OR_STEP" },
          { val: otherAnswers[1] || (parseInt(finalAnswer) - 2000).toString(), defect: "CONFUSED_ENTITY_OR_STEP" },
          { val: Math.floor(grandTotal / 4).toString(), defect: "IGNORED_EXTRA_UNITS" }
        ];
        const mcqRes = ensureFourUniqueOptions(finalAnswer, rawDistractors);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: In the bar model, represent ${nameA}'s collection as 1 unit.\\n- ${nameA} = 1 unit\\n- ${nameB} = 2 units\\n- ${nameC} = 1 unit + ${x.toLocaleString()}\\nTotal units = 1 + 2 + 1 = 4 units.\\nStep 2: Subtract the extra amount from the grand total to find 4 units:\\n4 units = ${grandTotal.toLocaleString()} - ${x.toLocaleString()} = ${(4 * baseUnit).toLocaleString()}.\\nStep 3: Divide by 4 to find 1 unit (${nameA}'s amount):\\n1 unit = ${(4 * baseUnit).toLocaleString()} ÷ 4 = ${amountA.toLocaleString()}.`;
      if (questionTarget === 'B') {
        solutionSteps += `\\nStep 4: Find ${nameB}'s amount (2 units): 2 × ${amountA.toLocaleString()} = ${amountB.toLocaleString()}.`;
      } else if (questionTarget === 'C') {
        solutionSteps += `\\nStep 4: Find ${nameC}'s amount (1 unit + ${x.toLocaleString()}): ${amountA.toLocaleString()} + ${x.toLocaleString()} = ${amountC.toLocaleString()}.`;
      } else if (questionTarget === 'A_plus_B') {
        solutionSteps += `\\nStep 4: Find the total of ${nameA} and ${nameB} (3 units): 3 × ${amountA.toLocaleString()} = ${(amountA + amountB).toLocaleString()}.`;
      }

      hint = `In the bar model, let ${nameA} be 1 unit and ${nameB} be 2 units. Total units = 1 + 2 + 1 = 4 units. Subtract ${x.toLocaleString()} from ${grandTotal.toLocaleString()} and divide by 4!`;
    }

    // ------------------------------------------------------------------------
    // CASE 3: Divide by 5 (Multiples Ratio: 1 unit, 2 units, 2 units + extra)
    // ------------------------------------------------------------------------
    else if (selectedVariety === 'multiples_divide_five') {
      const baseUnit = (Math.floor(Math.random() * 8) + 6) * 1000 + Math.floor(Math.random() * 9) * 100; // 6k - 13k
      const x = (Math.floor(Math.random() * 5) + 2) * 1000 + Math.floor(Math.random() * 9) * 100; // 2k - 6k

      const amountA = baseUnit;
      const amountB = 2 * baseUnit;
      const amountC = 2 * baseUnit + x;
      const grandTotal = amountA + amountB + amountC; // 5 units + x

      const targets = ['A', 'B', 'C', 'A_plus_B'];
      const questionTarget = targets[Math.floor(Math.random() * targets.length)];

      let targetQuestionText = "";
      if (questionTarget === 'A') {
        targetQuestionText = `How many ${item} did ${nameA} collect?`;
        finalAnswer = amountA.toString();
      } else if (questionTarget === 'B') {
        targetQuestionText = `How many ${item} did ${nameB} collect?`;
        finalAnswer = amountB.toString();
      } else if (questionTarget === 'C') {
        targetQuestionText = `How many ${item} did ${nameC} collect?`;
        finalAnswer = amountC.toString();
      } else {
        targetQuestionText = `How many ${item} did ${nameA} and ${nameB} collect altogether?`;
        finalAnswer = (amountA + amountB).toString();
      }

      const fiveUnits = 5 * baseUnit;

      if (isStructure) {
        visualEngineStr = JSON.stringify({
          componentToRender: "NONE",
          hideVisual: true,
          componentData: {
            hideVisual: true,
            modelType: "BAR_MODEL_COMPARISON",
            bars: [
              { name: nameA, value: "", layoutSize: amountA, displayValue: "" },
              { name: nameB, value: "", layoutSize: amountB, displayValue: "" },
              { name: nameC, value: "", layoutSize: amountC, displayValue: "" }
            ],
            whole: grandTotal.toLocaleString()
          }
        }, null, 2);

        const steps = [
          {
            label: "Write the working equation to find the value of 5 equal units:",
            expectedAnswer: `${grandTotal} - ${x} = ${fiveUnits}`,
            acceptedAnswers: [
              `${grandTotal} - ${x} = ${fiveUnits}`,
              `${grandTotal}-${x}=${fiveUnits}`,
              fiveUnits.toString(),
              Number(fiveUnits).toLocaleString(),
              `${grandTotal} - ${x}`,
              `${grandTotal}-${x}`
            ]
          },
          {
            label: `Write the working equation to find 1 unit (${nameA}):`,
            expectedAnswer: `${fiveUnits} / 5 = ${baseUnit}`,
            acceptedAnswers: [
              `${fiveUnits} / 5 = ${baseUnit}`,
              `${fiveUnits}/5=${baseUnit}`,
              `${fiveUnits} ÷ 5 = ${baseUnit}`,
              `${fiveUnits}÷5=${baseUnit}`,
              baseUnit.toString(),
              Number(baseUnit).toLocaleString(),
              `${fiveUnits} / 5`,
              `${fiveUnits}/5`,
              `${fiveUnits} ÷ 5`,
              `${fiveUnits}÷5`
            ]
          }
        ];

        if (questionTarget === 'B') {
          steps.push({
            label: `Write the working equation to find ${nameB}'s amount:`,
            expectedAnswer: `${baseUnit} * 2 = ${amountB}`,
            acceptedAnswers: [
              `${baseUnit} * 2 = ${amountB}`,
              `${baseUnit}*2=${amountB}`,
              `${baseUnit} × 2 = ${amountB}`,
              `${baseUnit}×2=${amountB}`,
              `${baseUnit} + ${baseUnit} = ${amountB}`,
              `${baseUnit}+${baseUnit}=${amountB}`,
              amountB.toString(),
              Number(amountB).toLocaleString(),
              `${baseUnit} * 2`,
              `${baseUnit}*2`,
              `${baseUnit} × 2`,
              `${baseUnit}×2`
            ]
          });
        } else if (questionTarget === 'C') {
          steps.push({
            label: `Write the working equation to find ${nameC}'s amount:`,
            expectedAnswer: `${amountB} + ${x} = ${amountC}`,
            acceptedAnswers: [
              `${amountB} + ${x} = ${amountC}`,
              `${amountB}+${x}=${amountC}`,
              `${baseUnit} * 2 + ${x} = ${amountC}`,
              `${baseUnit}*2+${x}=${amountC}`,
              `${baseUnit} × 2 + ${x} = ${amountC}`,
              `${baseUnit}×2+${x}=${amountC}`,
              `${x} + ${amountB} = ${amountC}`,
              `${x}+${amountB}=${amountC}`,
              amountC.toString(),
              Number(amountC).toLocaleString(),
              `${amountB} + ${x}`,
              `${amountB}+${x}`
            ]
          });
        } else if (questionTarget === 'A_plus_B') {
          steps.push({
            label: `Write the working equation to find the total of ${nameA} and ${nameB}:`,
            expectedAnswer: `${baseUnit} * 3 = ${amountA + amountB}`,
            acceptedAnswers: [
              `${baseUnit} * 3 = ${amountA + amountB}`,
              `${baseUnit}*3=${amountA + amountB}`,
              `${baseUnit} × 3 = ${amountA + amountB}`,
              `${baseUnit}×3=${amountA + amountB}`,
              `${amountA} + ${amountB} = ${amountA + amountB}`,
              `${amountA}+${amountB}=${amountA + amountB}`,
              (amountA + amountB).toString(),
              Number(amountA + amountB).toLocaleString(),
              `${baseUnit} * 3`,
              `${baseUnit}*3`
            ]
          });
        }

        steps.push({
          label: "Final Answer:",
          expectedAnswer: finalAnswer,
          acceptedAnswers: [
            finalAnswer,
            Number(finalAnswer).toLocaleString(),
            `${finalAnswer} ${item}`,
            `${Number(finalAnswer).toLocaleString()} ${item}`
          ]
        });

        let targetObj = { type: "BAR", targetEntity: "bar-1", label: nameA };
        if (questionTarget === 'B') targetObj = { type: "BAR", targetEntity: "bar-2", label: nameB };
        else if (questionTarget === 'C') targetObj = { type: "BAR", targetEntity: "bar-3", label: nameC };
        else if (questionTarget === 'A_plus_B') targetObj = { type: "COMBINED", label: `${nameA} & ${nameB}` };

        inputRequirementStr = JSON.stringify({
          inputType: "INTERACTIVE_BAR_BUILDER",
          steps: steps,
          barBuilderConfig: {
            problemType: "THREE_ENTITY_GRAND_TOTAL",
            correctModelType: "COMPARISON",
            modelOptions: [
              { id: "COMPARISON", label: "Comparison Model", description: "Compare quantities across distinct entities" },
              { id: "PART_WHOLE", label: "Part-Whole Model", description: "Divide a single whole quantity into parts" },
              { id: "BEFORE_AFTER", label: "Before & After Model", description: "Show transfers or changes across time states" }
            ],
            entities: [
              { id: "bar-1", name: nameA, relation: "BASE", value: "?", displayValue: "1 unit" },
              { id: "bar-2", name: nameB, relation: "MULTIPLE", isMultiple: true, multipleFactor: 2, displayValue: "2 units" },
              { id: "bar-3", name: nameC, relation: "MORE", isMultiple: true, multipleFactor: 2, relativeTo: nameB, diffValue: x.toString(), displayDiff: x.toLocaleString() }
            ],
            total: { label: "Grand Total", value: grandTotal.toString(), displayValue: grandTotal.toLocaleString(), isTarget: false },
            target: targetObj,
            steps: steps,
            itemName: item
          }
        }, null, 2);
      } else {
        visualEngineStr = JSON.stringify({
          componentToRender: "BAR_MODEL_COMPARISON",
          componentData: {
            modelType: "BAR_MODEL_COMPARISON",
            bars: [
              {
                name: nameA,
                value: questionTarget === 'A' ? '?' : '',
                layoutSize: amountA,
                parts: [
                  {
                    label: questionTarget === 'A' ? '?' : '1 unit',
                    size: amountA,
                    bgClass: questionTarget === 'A' ? 'bg-indigo-600 text-white font-black' : 'bg-blue-500 text-white'
                  }
                ]
              },
              {
                name: nameB,
                value: questionTarget === 'B' ? '?' : '',
                layoutSize: amountB,
                parts: [
                  {
                    label: '1 unit',
                    size: amountA,
                    bgClass: 'bg-blue-500 text-white'
                  },
                  {
                    label: '1 unit',
                    size: amountA,
                    bgClass: 'bg-blue-500 text-white'
                  }
                ]
              },
              {
                name: nameC,
                value: questionTarget === 'C' ? '?' : '',
                layoutSize: amountC,
                parts: [
                  {
                    label: '1 unit',
                    size: amountA,
                    bgClass: 'bg-blue-500 text-white'
                  },
                  {
                    label: '1 unit',
                    size: amountA,
                    bgClass: 'bg-blue-500 text-white'
                  },
                  {
                    label: '',
                    bracket: `${x.toLocaleString()}`,
                    size: x,
                    isExtra: true,
                    bgClass: 'bg-amber-100 text-amber-900 border-l-2 border-dashed border-amber-400'
                  }
                ]
              }
            ],
            whole: grandTotal.toLocaleString()
          }
        }, null, 2);
      }

      if (isMCQ) {
        const otherAnswers = [amountA, amountB, amountC, amountA + amountB]
          .map(n => n.toString())
          .filter(n => n !== finalAnswer);
        const rawDistractors = [
          { val: otherAnswers[0] || (parseInt(finalAnswer) + 2000).toString(), defect: "CONFUSED_ENTITY_OR_STEP" },
          { val: otherAnswers[1] || (parseInt(finalAnswer) - 2000).toString(), defect: "CONFUSED_ENTITY_OR_STEP" },
          { val: Math.floor(grandTotal / 5).toString(), defect: "IGNORED_EXTRA_UNITS" }
        ];
        const mcqRes = ensureFourUniqueOptions(finalAnswer, rawDistractors);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: In the bar model, represent ${nameA}'s collection as 1 unit.\\n- ${nameA} = 1 unit\\n- ${nameB} = 2 units\\n- ${nameC} = 2 units + ${x.toLocaleString()}\\nTotal units = 1 + 2 + 2 = 5 units.\\nStep 2: Subtract the extra amount from the grand total to find 5 units:\\n5 units = ${grandTotal.toLocaleString()} - ${x.toLocaleString()} = ${(5 * baseUnit).toLocaleString()}.\\nStep 3: Divide by 5 to find 1 unit (${nameA}'s amount):\\n1 unit = ${(5 * baseUnit).toLocaleString()} ÷ 5 = ${amountA.toLocaleString()}.`;
      if (questionTarget === 'B') {
        solutionSteps += `\\nStep 4: Find ${nameB}'s amount (2 units): 2 × ${amountA.toLocaleString()} = ${amountB.toLocaleString()}.`;
      } else if (questionTarget === 'C') {
        solutionSteps += `\\nStep 4: Find ${nameC}'s amount (2 units + ${x.toLocaleString()}): ${amountB.toLocaleString()} + ${x.toLocaleString()} = ${amountC.toLocaleString()}.`;
      } else if (questionTarget === 'A_plus_B') {
        solutionSteps += `\\nStep 4: Find the total of ${nameA} and ${nameB} (3 units): 3 × ${amountA.toLocaleString()} = ${(amountA + amountB).toLocaleString()}.`;
      }

      hint = `In the bar model, let ${nameA} be 1 unit, ${nameB} be 2 units, and ${nameC} be 2 units + ${x.toLocaleString()}. Total units = 5. Subtract ${x.toLocaleString()} from ${grandTotal.toLocaleString()} and divide by 5!`;
    }

    // ------------------------------------------------------------------------
    // CASE 4: Divide by 2 (Two Equal Units + Fixed Third Entity)
    // ------------------------------------------------------------------------
    else if (selectedVariety === 'equal_units_divide_two') {
      const baseUnit = (Math.floor(Math.random() * 14) + 12) * 1000 + Math.floor(Math.random() * 9) * 100; // 12k - 25k
      const cVal = (Math.floor(Math.random() * 12) + 8) * 1000 + Math.floor(Math.random() * 9) * 100; // 8k - 20k

      const amountA = baseUnit;
      const amountB = baseUnit;
      const amountC = cVal;
      const grandTotal = amountA + amountB + amountC; // 2 units + cVal

      const targets = ['A', 'A_plus_C'];
      const questionTarget = targets[Math.floor(Math.random() * targets.length)];

      let targetQuestionText = "";
      if (questionTarget === 'A') {
        targetQuestionText = `How many ${item} did ${nameA} collect?`;
        finalAnswer = amountA.toString();
      } else {
        targetQuestionText = `How many ${item} did ${nameA} and ${nameC} collect altogether?`;
        finalAnswer = (amountA + amountC).toString();
      }

      const twoUnits = 2 * baseUnit;

      if (isStructure) {
        visualEngineStr = JSON.stringify({
          componentToRender: "NONE",
          hideVisual: true,
          componentData: {
            hideVisual: true,
            modelType: "BAR_MODEL_COMPARISON",
            bars: [
              { name: nameA, value: "", layoutSize: amountA, displayValue: "" },
              { name: nameB, value: "", layoutSize: amountB, displayValue: "" },
              { name: nameC, value: "", layoutSize: amountC, displayValue: "" }
            ],
            whole: grandTotal.toLocaleString()
          }
        }, null, 2);

        const steps = [
          {
            label: "Write the working equation to find the value of 2 equal units:",
            expectedAnswer: `${grandTotal} - ${cVal} = ${twoUnits}`,
            acceptedAnswers: [
              `${grandTotal} - ${cVal} = ${twoUnits}`,
              `${grandTotal}-${cVal}=${twoUnits}`,
              twoUnits.toString(),
              Number(twoUnits).toLocaleString(),
              `${grandTotal} - ${cVal}`,
              `${grandTotal}-${cVal}`
            ]
          },
          {
            label: `Write the working equation to find 1 unit (${nameA}):`,
            expectedAnswer: `${twoUnits} / 2 = ${baseUnit}`,
            acceptedAnswers: [
              `${twoUnits} / 2 = ${baseUnit}`,
              `${twoUnits}/2=${baseUnit}`,
              `${twoUnits} ÷ 2 = ${baseUnit}`,
              `${twoUnits}÷2=${baseUnit}`,
              baseUnit.toString(),
              Number(baseUnit).toLocaleString(),
              `${twoUnits} / 2`,
              `${twoUnits}/2`,
              `${twoUnits} ÷ 2`,
              `${twoUnits}÷2`
            ]
          }
        ];

        if (questionTarget === 'A_plus_C') {
          steps.push({
            label: `Write the working equation to find the total of ${nameA} and ${nameC}:`,
            expectedAnswer: `${baseUnit} + ${cVal} = ${amountA + amountC}`,
            acceptedAnswers: [
              `${baseUnit} + ${cVal} = ${amountA + amountC}`,
              `${baseUnit}+${cVal}=${amountA + amountC}`,
              `${cVal} + ${baseUnit} = ${amountA + amountC}`,
              `${cVal}+${baseUnit}=${amountA + amountC}`,
              (amountA + amountC).toString(),
              Number(amountA + amountC).toLocaleString(),
              `${baseUnit} + ${cVal}`,
              `${baseUnit}+${cVal}`
            ]
          });
        }

        steps.push({
          label: "Final Answer:",
          expectedAnswer: finalAnswer,
          acceptedAnswers: [
            finalAnswer,
            Number(finalAnswer).toLocaleString(),
            `${finalAnswer} ${item}`,
            `${Number(finalAnswer).toLocaleString()} ${item}`
          ]
        });

        let targetObj = { type: "BAR", targetEntity: "bar-1", label: nameA };
        if (questionTarget === 'A_plus_C') targetObj = { type: "COMBINED", label: `${nameA} & ${nameC}` };

        inputRequirementStr = JSON.stringify({
          inputType: "INTERACTIVE_BAR_BUILDER",
          steps: steps,
          barBuilderConfig: {
            problemType: "THREE_ENTITY_GRAND_TOTAL",
            correctModelType: "COMPARISON",
            modelOptions: [
              { id: "COMPARISON", label: "Comparison Model", description: "Compare quantities across distinct entities" },
              { id: "PART_WHOLE", label: "Part-Whole Model", description: "Divide a single whole quantity into parts" },
              { id: "BEFORE_AFTER", label: "Before & After Model", description: "Show transfers or changes across time states" }
            ],
            entities: [
              { id: "bar-1", name: nameA, relation: "BASE", value: "?", displayValue: "1 unit" },
              { id: "bar-2", name: nameB, relation: "BASE", value: "?", displayValue: "1 unit" },
              { id: "bar-3", name: nameC, relation: "BASE", value: cVal.toString(), displayValue: cVal.toLocaleString() }
            ],
            total: { label: "Grand Total", value: grandTotal.toString(), displayValue: grandTotal.toLocaleString(), isTarget: false },
            target: targetObj,
            steps: steps,
            itemName: item
          }
        }, null, 2);
      } else {
        visualEngineStr = JSON.stringify({
          componentToRender: "BAR_MODEL_COMPARISON",
          componentData: {
            modelType: "BAR_MODEL_COMPARISON",
            bars: [
              {
                name: nameA,
                value: questionTarget === 'A' ? '?' : '',
                layoutSize: amountA,
                parts: [
                  {
                    label: questionTarget === 'A' ? '?' : '1 unit',
                    size: amountA,
                    bgClass: questionTarget === 'A' ? 'bg-indigo-600 text-white font-black' : 'bg-blue-500 text-white'
                  }
                ]
              },
              {
                name: nameB,
                value: '',
                layoutSize: amountB,
                parts: [
                  {
                    label: '1 unit',
                    size: amountA,
                    bgClass: 'bg-blue-500 text-white'
                  }
                ]
              },
              {
                name: nameC,
                value: cVal.toLocaleString(),
                layoutSize: amountC,
                parts: [
                  {
                    label: cVal.toLocaleString(),
                    size: amountC,
                    bgClass: 'bg-purple-600 text-white'
                  }
                ]
              }
            ],
            whole: grandTotal.toLocaleString()
          }
        }, null, 2);
      }

      if (isMCQ) {
        const otherAnswers = [amountA, cVal, amountA + amountC]
          .map(n => n.toString())
          .filter(n => n !== finalAnswer);
        const rawDistractors = [
          { val: otherAnswers[0] || (parseInt(finalAnswer) + 2000).toString(), defect: "CONFUSED_ENTITY_OR_STEP" },
          { val: otherAnswers[1] || (parseInt(finalAnswer) - 2000).toString(), defect: "CONFUSED_ENTITY_OR_STEP" },
          { val: Math.floor(grandTotal / 2).toString(), defect: "IGNORED_EXTRA_UNITS" }
        ];
        const mcqRes = ensureFourUniqueOptions(finalAnswer, rawDistractors);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: Subtract ${nameC}'s collection from the grand total to find the sum of ${nameA} and ${nameB}:\\n2 units = ${grandTotal.toLocaleString()} - ${cVal.toLocaleString()} = ${(2 * baseUnit).toLocaleString()}.\\nStep 2: Since ${nameA} and ${nameB} collected an equal amount, divide by 2 to find 1 unit (${nameA}'s amount):\\n1 unit = ${(2 * baseUnit).toLocaleString()} ÷ 2 = ${amountA.toLocaleString()}.`;
      if (questionTarget === 'A_plus_C') {
        solutionSteps += `\\nStep 3: Find the combined total of ${nameA} and ${nameC}: ${amountA.toLocaleString()} + ${cVal.toLocaleString()} = ${(amountA + amountC).toLocaleString()}.`;
      }

      hint = `Subtract ${nameC}'s collection from the grand total to find 2 equal units for ${nameA} and ${nameB}, then divide by 2!`;
    }
  }

  // ==========================================================================
  // VARIANT 4: advanced_shifting_difference_transfer (The Shifting Difference)
  // ==========================================================================
  else if (effectiveVariant === 'advanced_shifting_difference_transfer') {
    let [nameA, nameB] = getRandomNames(2);
    while (
      !nameB ||
      nameA.toLowerCase().slice(0, 4) === nameB.toLowerCase().slice(0, 4) ||
      nameA.toLowerCase().replace(/h$/i, '') === nameB.toLowerCase().replace(/h$/i, '')
    ) {
      [nameA, nameB] = getRandomNames(2);
    }
    const itemObj = getRandomCountableItems(1);
    const item = itemObj?.item || "points";

    const initialA = (Math.floor(Math.random() * 15) + 38) * 1000 + Math.floor(Math.random() * 9) * 100; // 38k - 52k
    const initialB = (Math.floor(Math.random() * 10) + 20) * 1000 + Math.floor(Math.random() * 9) * 100; // 20k - 29k
    const initialDiff = initialA - initialB;

    // Transfer amount z must flip the inequality (z > initialDiff / 2)
    const z = Math.ceil(initialDiff / 2 / 1000) * 1000 + (Math.floor(Math.random() * 6) + 4) * 1000;
    const newA = initialA - z;
    const newB = initialB + z;
    const newDiff = newB - newA;

    finalAnswer = newDiff.toString();

    promptInstruction = `- Question stem: "${nameA} had ${initialA.toLocaleString()} ${item} and ${nameB} had ${initialB.toLocaleString()} ${item}. ${nameA} gave ${z.toLocaleString()} ${item} to ${nameB}. How many more ${item} does ${nameB} have than ${nameA} now?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isStructure) {
      visualEngineStr = JSON.stringify({
        componentToRender: "NONE",
        hideVisual: true,
        componentData: {
          hideVisual: true,
          modelType: "BAR_MODEL_COMPARISON",
          bars: [
            { name: nameA, value: initialA, layoutSize: initialA, displayValue: initialA.toLocaleString() },
            { name: nameB, value: initialB, layoutSize: initialB, displayValue: initialB.toLocaleString() }
          ],
          difference: { displayValue: "?" }
        }
      }, null, 2);

      const steps = [
        {
          label: `Write the working equation to find ${nameA}'s amount in the end:`,
          expectedAnswer: `${initialA} - ${z} = ${newA}`,
          acceptedAnswers: [
            `${initialA} - ${z} = ${newA}`,
            `${initialA} - ${z}`,
            newA.toString(),
            `${newA} ${item}`
          ]
        },
        {
          label: `Write the working equation to find ${nameB}'s amount in the end:`,
          expectedAnswer: `${initialB} + ${z} = ${newB}`,
          acceptedAnswers: [
            `${initialB} + ${z} = ${newB}`,
            `${z} + ${initialB} = ${newB}`,
            `${initialB} + ${z}`,
            `${z} + ${initialB}`,
            newB.toString(),
            `${newB} ${item}`
          ]
        },
        {
          label: `Write the working equation to find how many more ${item} ${nameB} has than ${nameA} now:`,
          expectedAnswer: `${newB} - ${newA} = ${newDiff}`,
          acceptedAnswers: [
            `${newB} - ${newA} = ${newDiff}`,
            `${z * 2} - ${initialDiff} = ${newDiff}`,
            `${newB} - ${newA}`,
            `${z * 2} - ${initialDiff}`,
            newDiff.toString(),
            `${newDiff} ${item}`
          ]
        },
        {
          label: "Final Answer:",
          expectedAnswer: finalAnswer,
          acceptedAnswers: [
            finalAnswer,
            `${finalAnswer} ${item}`
          ]
        }
      ];

      const comparisonSteps = [
        {
          label: `Write the working equation to find the initial difference between ${nameA} and ${nameB}:`,
          expectedAnswer: `${initialA} - ${initialB} = ${initialDiff}`,
          acceptedAnswers: [
            `${initialA} - ${initialB} = ${initialDiff}`,
            `${initialA} - ${initialB}`,
            initialDiff.toString(),
            `${initialDiff} ${item}`
          ]
        },
        {
          label: `Write the working equation to find the change in difference caused by the transfer:`,
          expectedAnswer: `${z} * 2 = ${z * 2}`,
          acceptedAnswers: [
            `${z} * 2 = ${z * 2}`,
            `${z} x 2 = ${z * 2}`,
            `${z} × 2 = ${z * 2}`,
            `${z} + ${z} = ${z * 2}`,
            `${z} * 2`,
            `${z} x 2`,
            `${z} + ${z}`,
            (z * 2).toString(),
            `${z * 2} ${item}`
          ]
        },
        {
          label: `Write the working equation to find how many more ${item} ${nameB} has than ${nameA} now:`,
          expectedAnswer: `${z * 2} - ${initialDiff} = ${newDiff}`,
          acceptedAnswers: [
            `${z * 2} - ${initialDiff} = ${newDiff}`,
            `${z * 2} - ${initialDiff}`,
            `${newB} - ${newA} = ${newDiff}`,
            `${newB} - ${newA}`,
            newDiff.toString(),
            `${newDiff} ${item}`
          ]
        },
        {
          label: "Final Answer:",
          expectedAnswer: finalAnswer,
          acceptedAnswers: [
            finalAnswer,
            `${finalAnswer} ${item}`
          ]
        }
      ];

      inputRequirementStr = JSON.stringify({
        inputType: "INTERACTIVE_BAR_BUILDER",
        steps: steps,
        alternativeSteps: comparisonSteps,
        barBuilderConfig: {
          problemType: "SHIFTING_DIFFERENCE_TRANSFER",
          transferFrom: nameA,
          transferTo: nameB,
          transferAmount: z,
          initialA: initialA,
          initialB: initialB,
          initialDiff: initialDiff,
          newA: newA,
          newB: newB,
          newDiff: newDiff,
          differenceValue: "?",
          largerValue: initialA,
          smallerValue: initialB,
          displayTransfer: z.toLocaleString(),
          displayDifference: "?",
          displayNewA: newA.toLocaleString(),
          displayNewB: newB.toLocaleString(),
          itemName: item,
          correctModelType: ["BEFORE_AFTER", "COMPARISON"],
          modelOptions: [
            { id: "COMPARISON", label: "Comparison Model", description: "Compare quantities across distinct entities" },
            { id: "PART_WHOLE", label: "Part-Whole Model", description: "Divide a single whole quantity into parts" },
            { id: "BEFORE_AFTER", label: "Before & After Model", description: "Show transfers or changes across time states" }
          ],
          entities: [
            { id: "B", name: nameB, value: initialB, displayValue: initialB.toLocaleString(), relation: "BASE" },
            { id: "A", name: nameA, value: initialA, displayValue: initialA.toLocaleString(), relativeTo: nameB, relation: "MORE", diffValue: "?", displayDiff: "?", actualDiff: initialDiff }
          ],
          target: { type: "DIFFERENCE", label: "New Difference" },
          steps: steps.map(s => ({ label: s.label, expectedAnswer: s.expectedAnswer })),
          comparisonSteps: comparisonSteps.map(s => ({ label: s.label, expectedAnswer: s.expectedAnswer }))
        }
      }, null, 2);
    } else {
      promptInstruction += `\\n- CRITICAL: Return visualEngine and componentData EXACTLY as provided. Keep ${nameA} as the first bar and ${nameB} as the second bar in both models. Do NOT add any difference to the first bar model, and do NOT replace "?" with computed numbers.`;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL_COMPARISON",
        componentData: {
          models: [
            {
              modelType: "BAR_MODEL_COMPARISON",
              title: "At First",
              hideDifference: true,
              bars: [
                { name: `${nameA} (At first)`, value: initialA, layoutSize: initialA, displayValue: initialA.toLocaleString(), bgClass: "bg-blue-500", hideDifference: true },
                { name: `${nameB} (At first)`, value: initialB, layoutSize: initialB, displayValue: initialB.toLocaleString(), bgClass: "bg-amber-500", hideDifference: true }
              ]
            },
            {
              modelType: "BAR_MODEL_COMPARISON",
              title: `In The End (After ${nameA} gave ${z.toLocaleString()} to ${nameB})`,
              bars: [
                { name: `${nameA} (Now)`, value: "?", layoutSize: newA, displayValue: "?", bgClass: "bg-blue-500" },
                { name: `${nameB} (Now)`, value: "?", layoutSize: newB, displayValue: "?", bgClass: "bg-amber-500" }
              ],
              difference: { displayValue: "?" }
            }
          ]
        }
      }, null, 2);
    }

    if (isMCQ) {
      const d1 = Math.abs(z - initialDiff).toString();
      const d2 = initialDiff.toString();
      const d3 = (initialDiff + z).toString();
      const mcqRes = ensureFourUniqueOptions(finalAnswer, [
        { val: d1, defect: "CONFUSED_TRANSFER_WITH_DIFFERENCE" },
        { val: d2, defect: "USED_INITIAL_DIFFERENCE" },
        { val: d3, defect: "WRONG_OPERATION_ADD" }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    }

    solutionSteps = `Method 1 (Before & After Model):\\nStep 1: Find ${nameA}'s amount in the end: ${initialA.toLocaleString()} - ${z.toLocaleString()} = ${newA.toLocaleString()}\\nStep 2: Find ${nameB}'s amount in the end: ${initialB.toLocaleString()} + ${z.toLocaleString()} = ${newB.toLocaleString()}\\nStep 3: Find how many more ${item} ${nameB} has than ${nameA} now: ${newB.toLocaleString()} - ${newA.toLocaleString()} = ${newDiff.toLocaleString()}\\n\\nMethod 2 (Comparison Model):\\nStep 1: Find the initial difference: ${initialA.toLocaleString()} - ${initialB.toLocaleString()} = ${initialDiff.toLocaleString()}\\nStep 2: Find the change in difference caused by transfer: 2 × ${z.toLocaleString()} = ${(z * 2).toLocaleString()}\\nStep 3: Find new difference: ${(z * 2).toLocaleString()} - ${initialDiff.toLocaleString()} = ${newDiff.toLocaleString()}`;
    hint = `Calculate both new amounts after the transfer first, then subtract to find who has more and by how much!`;
  }

  // ==========================================================================
  // VARIANT 5: advanced_overlapping_target_deduction (The Overlapping Deduction)
  // ==========================================================================
  else if (effectiveVariant === 'advanced_overlapping_target_deduction') {
    const totalParticipants = (Math.floor(Math.random() * 20) + 65) * 1000; // 65k - 84k
    const groupA = (Math.floor(Math.random() * 15) + 36) * 1000 + Math.floor(Math.random() * 9) * 100;
    const groupB = (Math.floor(Math.random() * 15) + 36) * 1000 + Math.floor(Math.random() * 9) * 100;

    let overlap = (groupA + groupB) - totalParticipants;
    let total = totalParticipants;
    if (overlap <= 3000 || overlap >= Math.min(groupA, groupB)) {
      overlap = (Math.floor(Math.random() * 10) + 8) * 1000;
      total = groupA + groupB - overlap;
    }

    const aOnly = groupA - overlap;
    const bOnly = groupB - overlap;

    const subType = explicitVariety === 'find_group_a_only' ? 1 : (explicitVariety === 'find_group_b_only' ? 2 : (explicitVariety === 'find_both_overlap' ? 0 : Math.floor(Math.random() * 3)));
    const varietyName = subType === 0 ? 'find_both_overlap' : (subType === 1 ? 'find_group_a_only' : 'find_group_b_only');

    const contexts = [
      {
        totalDesc: `a gaming contest with a total possible score of ${total.toLocaleString()} points`,
        itemUnit: "points",
        groupAName: "Stage 1",
        groupBName: "Stage 2",
        bothDesc: "BOTH stages"
      },
      {
        totalDesc: `a youth festival with a total of ${total.toLocaleString()} participants`,
        itemUnit: "participants",
        groupAName: "Art Workshop",
        groupBName: "Robotics Workshop",
        bothDesc: "BOTH workshops"
      },
      {
        totalDesc: `a school with a total of ${total.toLocaleString()} students`,
        itemUnit: "students",
        groupAName: "Music Club",
        groupBName: "Sports Club",
        bothDesc: "BOTH clubs"
      },
      {
        totalDesc: `a community charity drive with a total of ${total.toLocaleString()} donors`,
        itemUnit: "donors",
        groupAName: "Food Aid",
        groupBName: "Shelter Fund",
        bothDesc: "BOTH causes"
      },
      {
        totalDesc: `a science fair with a total of ${total.toLocaleString()} visitors`,
        itemUnit: "visitors",
        groupAName: "Astronomy Booth",
        groupBName: "Chemistry Lab",
        bothDesc: "BOTH booths"
      }
    ];
    const ctx = contexts[Math.floor(Math.random() * contexts.length)];

    const targetLabel = subType === 0 ? `Both ${ctx.groupAName} & ${ctx.groupBName}` : (subType === 1 ? `${ctx.groupAName} Only` : `${ctx.groupBName} Only`);

    let steps = [];
    let comparisonSteps = [];
    let alternativeSteps = [];

    if (subType === 0) {
      // VARIETY 0: Find BOTH overlap
      finalAnswer = overlap.toString();
      promptInstruction = `- Question stem: "In ${ctx.totalDesc}, ${groupA.toLocaleString()} ${ctx.itemUnit} were recorded in ${ctx.groupAName} and ${groupB.toLocaleString()} ${ctx.itemUnit} were recorded in ${ctx.groupBName}. Every ${ctx.itemUnit === 'points' ? 'point' : (ctx.itemUnit.endsWith('s') ? ctx.itemUnit.slice(0, -1) : 'person')} belonged to at least one group. How many ${ctx.itemUnit} belonged to ${ctx.bothDesc}?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      steps = [
        {
          label: `Write the working equation to find the sum of the two groups:`,
          expectedAnswer: `${groupA} + ${groupB} = ${groupA + groupB}`,
          acceptedAnswers: [
            `${groupA} + ${groupB} = ${groupA + groupB}`,
            `${groupA}+${groupB}=${groupA + groupB}`,
            `${groupB} + ${groupA} = ${groupA + groupB}`,
            `${groupB}+${groupA}=${groupA + groupB}`,
            `${groupA} + ${groupB}`,
            `${groupA}+${groupB}`,
            `${groupB} + ${groupA}`,
            `${groupB}+${groupA}`,
            `${groupA.toLocaleString()} + ${groupB.toLocaleString()} = ${(groupA + groupB).toLocaleString()}`,
            `${groupA.toLocaleString()}+${groupB.toLocaleString()}=${(groupA + groupB).toLocaleString()}`,
            `${groupB.toLocaleString()} + ${groupA.toLocaleString()} = ${(groupA + groupB).toLocaleString()}`,
            `${groupB.toLocaleString()}+${groupA.toLocaleString()}=${(groupA + groupB).toLocaleString()}`,
            `${groupA.toLocaleString()} + ${groupB.toLocaleString()}`,
            `${groupB.toLocaleString()} + ${groupA.toLocaleString()}`,
            (groupA + groupB).toString(),
            (groupA + groupB).toLocaleString(),
            `${groupA + groupB} ${ctx.itemUnit}`,
            `${(groupA + groupB).toLocaleString()} ${ctx.itemUnit}`,
            `${total} - ${groupA} = ${bOnly}`,
            `${total} - ${groupB} = ${aOnly}`
          ]
        },
        {
          label: `Write the working equation to find the number of ${ctx.itemUnit} in both groups (overlap):`,
          expectedAnswer: `${groupA + groupB} - ${total} = ${overlap}`,
          acceptedAnswers: [
            `${groupA + groupB} - ${total} = ${overlap}`,
            `${groupA + groupB}-${total}=${overlap}`,
            `${groupA + groupB} - ${total}`,
            `${groupA + groupB}-${total}`,
            `${(groupA + groupB).toLocaleString()} - ${total.toLocaleString()} = ${overlap.toLocaleString()}`,
            `${(groupA + groupB).toLocaleString()}-${total.toLocaleString()}=${overlap.toLocaleString()}`,
            `${(groupA + groupB).toLocaleString()} - ${total.toLocaleString()}`,
            `${groupA} - ${aOnly} = ${overlap}`,
            `${groupB} - ${bOnly} = ${overlap}`,
            overlap.toString(),
            overlap.toLocaleString(),
            `${overlap} ${ctx.itemUnit}`,
            `${overlap.toLocaleString()} ${ctx.itemUnit}`
          ]
        },
        {
          label: "Final Answer:",
          expectedAnswer: finalAnswer,
          acceptedAnswers: [
            finalAnswer,
            Number(finalAnswer).toLocaleString(),
            `${finalAnswer} ${ctx.itemUnit}`,
            `${Number(finalAnswer).toLocaleString()} ${ctx.itemUnit}`
          ]
        }
      ];

      comparisonSteps = [
        {
          label: `Write the working equation to find the combined sum of both groups:`,
          expectedAnswer: `${groupA} + ${groupB} = ${groupA + groupB}`,
          acceptedAnswers: steps[0].acceptedAnswers
        },
        {
          label: `Write the working equation to find the overlap difference between the sum and the total:`,
          expectedAnswer: `${groupA + groupB} - ${total} = ${overlap}`,
          acceptedAnswers: steps[1].acceptedAnswers
        },
        {
          label: "Final Answer:",
          expectedAnswer: finalAnswer,
          acceptedAnswers: steps[2].acceptedAnswers
        }
      ];

      alternativeSteps = [
        {
          label: `Write the working equation to find the number of ${ctx.itemUnit} in ${ctx.groupBName} only:`,
          expectedAnswer: `${total} - ${groupA} = ${bOnly}`,
          acceptedAnswers: [
            `${total} - ${groupA} = ${bOnly}`,
            `${total}-${groupA}=${bOnly}`,
            `${total} - ${groupA}`,
            `${total.toLocaleString()} - ${groupA.toLocaleString()} = ${bOnly.toLocaleString()}`,
            bOnly.toString(),
            bOnly.toLocaleString()
          ]
        },
        {
          label: `Write the working equation to find the number of ${ctx.itemUnit} in both groups:`,
          expectedAnswer: `${groupB} - ${bOnly} = ${overlap}`,
          acceptedAnswers: [
            `${groupB} - ${bOnly} = ${overlap}`,
            `${groupB}-${bOnly}=${overlap}`,
            `${groupB} - ${bOnly}`,
            `${groupB.toLocaleString()} - ${bOnly.toLocaleString()} = ${overlap.toLocaleString()}`,
            overlap.toString(),
            overlap.toLocaleString()
          ]
        },
        {
          label: "Final Answer:",
          expectedAnswer: finalAnswer,
          acceptedAnswers: steps[2].acceptedAnswers
        }
      ];

      if (isMCQ) {
        const d1 = Math.abs(groupA - groupB).toString();
        const d2 = aOnly.toString();
        const d3 = (total - groupA).toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "CONFUSED_DIFFERENCE_WITH_OVERLAP" },
          { val: d2, defect: "FOUND_SINGLE_GROUP_ONLY" },
          { val: d3, defect: "FOUND_OPPOSITE_GROUP_ONLY" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: Add the quantities in both groups: ${groupA.toLocaleString()} + ${groupB.toLocaleString()} = ${(groupA + groupB).toLocaleString()}.\\nStep 2: Subtract the total from this sum to find the overlap: ${(groupA + groupB).toLocaleString()} - ${total.toLocaleString()} = ${overlap.toLocaleString()}.\\nStep 3: ${overlap.toLocaleString()} ${ctx.itemUnit} belonged to ${ctx.bothDesc}.`;
      hint = `Add the two group quantities together. The amount by which this sum exceeds the grand total represents those counted twice (in both groups)!`;

    } else if (subType === 1) {
      // VARIETY 1: Find Group A ONLY
      finalAnswer = aOnly.toString();
      promptInstruction = `- Question stem: "In ${ctx.totalDesc}, ${groupA.toLocaleString()} ${ctx.itemUnit} were recorded in ${ctx.groupAName} and ${groupB.toLocaleString()} ${ctx.itemUnit} were recorded in ${ctx.groupBName}. Every ${ctx.itemUnit === 'points' ? 'point' : (ctx.itemUnit.endsWith('s') ? ctx.itemUnit.slice(0, -1) : 'person')} belonged to at least one group. How many ${ctx.itemUnit} belonged ONLY to ${ctx.groupAName}?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      steps = [
        {
          label: `Write the working equation to find the sum of the two groups:`,
          expectedAnswer: `${groupA} + ${groupB} = ${groupA + groupB}`,
          acceptedAnswers: [
            `${groupA} + ${groupB} = ${groupA + groupB}`,
            `${groupA}+${groupB}=${groupA + groupB}`,
            `${groupB} + ${groupA} = ${groupA + groupB}`,
            `${groupB}+${groupA}=${groupA + groupB}`,
            `${groupA} + ${groupB}`,
            `${groupB} + ${groupA}`,
            `${groupA.toLocaleString()} + ${groupB.toLocaleString()} = ${(groupA + groupB).toLocaleString()}`,
            `${total} - ${groupB} = ${aOnly}`,
            `${total}-${groupB}=${aOnly}`,
            (groupA + groupB).toString(),
            (groupA + groupB).toLocaleString()
          ]
        },
        {
          label: `Write the working equation to find the overlap amount (in both groups):`,
          expectedAnswer: `${groupA + groupB} - ${total} = ${overlap}`,
          acceptedAnswers: [
            `${groupA + groupB} - ${total} = ${overlap}`,
            `${groupA + groupB}-${total}=${overlap}`,
            `${groupA + groupB} - ${total}`,
            `${(groupA + groupB).toLocaleString()} - ${total.toLocaleString()} = ${overlap.toLocaleString()}`,
            overlap.toString(),
            overlap.toLocaleString()
          ]
        },
        {
          label: `Write the working equation to find the amount in ${ctx.groupAName} only:`,
          expectedAnswer: `${groupA} - ${overlap} = ${aOnly}`,
          acceptedAnswers: [
            `${groupA} - ${overlap} = ${aOnly}`,
            `${groupA}-${overlap}=${aOnly}`,
            `${groupA} - ${overlap}`,
            `${groupA.toLocaleString()} - ${overlap.toLocaleString()} = ${aOnly.toLocaleString()}`,
            `${total} - ${groupB} = ${aOnly}`,
            `${total}-${groupB}=${aOnly}`,
            `${total} - ${groupB}`,
            `${total.toLocaleString()} - ${groupB.toLocaleString()} = ${aOnly.toLocaleString()}`,
            aOnly.toString(),
            aOnly.toLocaleString(),
            `${aOnly} ${ctx.itemUnit}`,
            `${aOnly.toLocaleString()} ${ctx.itemUnit}`
          ]
        },
        {
          label: "Final Answer:",
          expectedAnswer: finalAnswer,
          acceptedAnswers: [
            finalAnswer,
            Number(finalAnswer).toLocaleString(),
            `${finalAnswer} ${ctx.itemUnit}`,
            `${Number(finalAnswer).toLocaleString()} ${ctx.itemUnit}`
          ]
        }
      ];

      comparisonSteps = steps;

      alternativeSteps = [
        {
          label: `Write the working equation to subtract all ${ctx.itemUnit} in ${ctx.groupBName} from the grand total:`,
          expectedAnswer: `${total} - ${groupB} = ${aOnly}`,
          acceptedAnswers: [
            `${total} - ${groupB} = ${aOnly}`,
            `${total}-${groupB}=${aOnly}`,
            `${total} - ${groupB}`,
            `${total.toLocaleString()} - ${groupB.toLocaleString()} = ${aOnly.toLocaleString()}`,
            aOnly.toString(),
            aOnly.toLocaleString(),
            `${aOnly} ${ctx.itemUnit}`
          ]
        },
        {
          label: "Final Answer:",
          expectedAnswer: finalAnswer,
          acceptedAnswers: steps[3].acceptedAnswers
        }
      ];

      if (isMCQ) {
        const d1 = overlap.toString();
        const d2 = bOnly.toString();
        const d3 = groupA.toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "FOUND_OVERLAP_INSTEAD_OF_SINGLE_GROUP" },
          { val: d2, defect: "FOUND_OPPOSITE_GROUP_ONLY" },
          { val: d3, defect: "USED_UNFILTERED_GROUP_TOTAL" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: Find the sum of both groups: ${groupA.toLocaleString()} + ${groupB.toLocaleString()} = ${(groupA + groupB).toLocaleString()}.\\nStep 2: Subtract the total to find the overlap: ${(groupA + groupB).toLocaleString()} - ${total.toLocaleString()} = ${overlap.toLocaleString()}.\\nStep 3: Subtract the overlap from the ${ctx.groupAName} total to find those in ${ctx.groupAName} only: ${groupA.toLocaleString()} - ${overlap.toLocaleString()} = ${aOnly.toLocaleString()}. (Alternatively: Total - ${ctx.groupBName} = ${total.toLocaleString()} - ${groupB.toLocaleString()} = ${aOnly.toLocaleString()}).`;
      hint = `Find the overlap first by adding both groups and subtracting the grand total, then subtract the overlap from ${ctx.groupAName}! Or simply subtract ${ctx.groupBName} from the total!`;

    } else {
      // VARIETY 2: Find Group B ONLY
      finalAnswer = bOnly.toString();
      promptInstruction = `- Question stem: "In ${ctx.totalDesc}, ${groupA.toLocaleString()} ${ctx.itemUnit} were recorded in ${ctx.groupAName} and ${groupB.toLocaleString()} ${ctx.itemUnit} were recorded in ${ctx.groupBName}. Every ${ctx.itemUnit === 'points' ? 'point' : (ctx.itemUnit.endsWith('s') ? ctx.itemUnit.slice(0, -1) : 'person')} belonged to at least one group. How many ${ctx.itemUnit} belonged ONLY to ${ctx.groupBName}?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      steps = [
        {
          label: `Write the working equation to find the sum of the two groups:`,
          expectedAnswer: `${groupA} + ${groupB} = ${groupA + groupB}`,
          acceptedAnswers: [
            `${groupA} + ${groupB} = ${groupA + groupB}`,
            `${groupA}+${groupB}=${groupA + groupB}`,
            `${groupB} + ${groupA} = ${groupA + groupB}`,
            `${groupB}+${groupA}=${groupA + groupB}`,
            `${groupA} + ${groupB}`,
            `${groupB} + ${groupA}`,
            `${groupA.toLocaleString()} + ${groupB.toLocaleString()} = ${(groupA + groupB).toLocaleString()}`,
            `${total} - ${groupA} = ${bOnly}`,
            `${total}-${groupA}=${bOnly}`,
            (groupA + groupB).toString(),
            (groupA + groupB).toLocaleString()
          ]
        },
        {
          label: `Write the working equation to find the overlap amount (in both groups):`,
          expectedAnswer: `${groupA + groupB} - ${total} = ${overlap}`,
          acceptedAnswers: [
            `${groupA + groupB} - ${total} = ${overlap}`,
            `${groupA + groupB}-${total}=${overlap}`,
            `${groupA + groupB} - ${total}`,
            `${(groupA + groupB).toLocaleString()} - ${total.toLocaleString()} = ${overlap.toLocaleString()}`,
            overlap.toString(),
            overlap.toLocaleString()
          ]
        },
        {
          label: `Write the working equation to find the amount in ${ctx.groupBName} only:`,
          expectedAnswer: `${groupB} - ${overlap} = ${bOnly}`,
          acceptedAnswers: [
            `${groupB} - ${overlap} = ${bOnly}`,
            `${groupB}-${overlap}=${bOnly}`,
            `${groupB} - ${overlap}`,
            `${groupB.toLocaleString()} - ${overlap.toLocaleString()} = ${bOnly.toLocaleString()}`,
            `${total} - ${groupA} = ${bOnly}`,
            `${total}-${groupA}=${bOnly}`,
            `${total} - ${groupA}`,
            `${total.toLocaleString()} - ${groupA.toLocaleString()} = ${bOnly.toLocaleString()}`,
            bOnly.toString(),
            bOnly.toLocaleString(),
            `${bOnly} ${ctx.itemUnit}`,
            `${bOnly.toLocaleString()} ${ctx.itemUnit}`
          ]
        },
        {
          label: "Final Answer:",
          expectedAnswer: finalAnswer,
          acceptedAnswers: [
            finalAnswer,
            Number(finalAnswer).toLocaleString(),
            `${finalAnswer} ${ctx.itemUnit}`,
            `${Number(finalAnswer).toLocaleString()} ${ctx.itemUnit}`
          ]
        }
      ];

      comparisonSteps = steps;

      alternativeSteps = [
        {
          label: `Write the working equation to subtract all ${ctx.itemUnit} in ${ctx.groupAName} from the grand total:`,
          expectedAnswer: `${total} - ${groupA} = ${bOnly}`,
          acceptedAnswers: [
            `${total} - ${groupA} = ${bOnly}`,
            `${total}-${groupA}=${bOnly}`,
            `${total} - ${groupA}`,
            `${total.toLocaleString()} - ${groupA.toLocaleString()} = ${bOnly.toLocaleString()}`,
            bOnly.toString(),
            bOnly.toLocaleString(),
            `${bOnly} ${ctx.itemUnit}`
          ]
        },
        {
          label: "Final Answer:",
          expectedAnswer: finalAnswer,
          acceptedAnswers: steps[3].acceptedAnswers
        }
      ];

      if (isMCQ) {
        const d1 = overlap.toString();
        const d2 = aOnly.toString();
        const d3 = groupB.toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "FOUND_OVERLAP_INSTEAD_OF_SINGLE_GROUP" },
          { val: d2, defect: "FOUND_OPPOSITE_GROUP_ONLY" },
          { val: d3, defect: "USED_UNFILTERED_GROUP_TOTAL" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: Find the sum of both groups: ${groupA.toLocaleString()} + ${groupB.toLocaleString()} = ${(groupA + groupB).toLocaleString()}.\\nStep 2: Subtract the total to find the overlap: ${(groupA + groupB).toLocaleString()} - ${total.toLocaleString()} = ${overlap.toLocaleString()}.\\nStep 3: Subtract the overlap from the ${ctx.groupBName} total to find those in ${ctx.groupBName} only: ${groupB.toLocaleString()} - ${overlap.toLocaleString()} = ${bOnly.toLocaleString()}. (Alternatively: Total - ${ctx.groupAName} = ${total.toLocaleString()} - ${groupA.toLocaleString()} = ${bOnly.toLocaleString()}).`;
      hint = `Find the overlap first by adding both groups and subtracting the grand total, then subtract the overlap from ${ctx.groupBName}! Or simply subtract ${ctx.groupAName} from the total!`;
    }

    if (isStructure) {
      visualEngineStr = JSON.stringify({
        componentToRender: "NONE",
        hideVisual: true,
        componentData: {
          hideVisual: true,
          modelType: "PART_WHOLE",
          totalLabel: `Total ${ctx.itemUnit.charAt(0).toUpperCase() + ctx.itemUnit.slice(1)}`,
          whole: total.toLocaleString(),
          parts: [
            { name: `${ctx.groupAName} Only`, layoutSize: aOnly, displayValue: "?", bgClass: "bg-blue-600 text-white" },
            { name: "Both", layoutSize: overlap, displayValue: "?", bgClass: "bg-purple-600 text-white" },
            { name: `${ctx.groupBName} Only`, layoutSize: bOnly, displayValue: "?", bgClass: "bg-amber-600 text-white" }
          ]
        }
      }, null, 2);

      inputRequirementStr = JSON.stringify({
        inputType: "INTERACTIVE_BAR_BUILDER",
        steps: steps,
        alternativeSteps: alternativeSteps,
        barBuilderConfig: {
          problemType: "OVERLAPPING_TARGET_DEDUCTION",
          targetVariety: varietyName,
          correctModelType: "PART_WHOLE",
          modelOptions: [
            { id: "COMPARISON", label: "Comparison Model", description: "Compare quantities across distinct entities" },
            { id: "PART_WHOLE", label: "Part-Whole Model", description: "Divide a single whole quantity into parts" },
            { id: "BEFORE_AFTER", label: "Before & After Model", description: "Show transfers or changes across time states" }
          ],
          totalValue: total,
          displayTotal: total.toLocaleString(),
          groupAValue: groupA,
          displayGroupA: groupA.toLocaleString(),
          groupBValue: groupB,
          displayGroupB: groupB.toLocaleString(),
          overlapValue: overlap,
          displayOverlap: overlap.toLocaleString(),
          groupAOnlyValue: aOnly,
          displayGroupAOnly: aOnly.toLocaleString(),
          groupBOnlyValue: bOnly,
          displayGroupBOnly: bOnly.toLocaleString(),
          itemName: ctx.itemUnit,
          groupAName: ctx.groupAName,
          groupBName: ctx.groupBName,

          // 1. Part-Whole Model Configuration
          whole: {
            label: `Total ${ctx.itemUnit.charAt(0).toUpperCase() + ctx.itemUnit.slice(1)}`,
            value: total,
            displayValue: total.toLocaleString()
          },
          parts: [
            {
              id: "part-A-only",
              name: `${ctx.groupAName} Only`,
              value: "?",
              displayValue: "?",
              actualValue: aOnly,
              isShortfall: false,
              bgClass: "bg-blue-600 text-white border-r-2 border-white",
              aliases: [`${ctx.groupAName} Only`, ctx.groupAName, "Group A Only", "A Only"]
            },
            {
              id: "part-both",
              name: "Both",
              value: "?",
              displayValue: "?",
              actualValue: overlap,
              isShortfall: false,
              bgClass: "bg-purple-600 text-white border-r-2 border-white",
              aliases: ["Both", "Both Groups", ctx.bothDesc, "Overlap"]
            },
            {
              id: "part-B-only",
              name: `${ctx.groupBName} Only`,
              value: "?",
              displayValue: "?",
              actualValue: bOnly,
              isShortfall: false,
              bgClass: "bg-amber-600 text-white border-r-2 border-white",
              aliases: [`${ctx.groupBName} Only`, ctx.groupBName, "Group B Only", "B Only"]
            }
          ],

          // 2. Comparison Model Configuration (Sum of groups vs Total)
          entities: [
            {
              id: "total_whole",
              name: `Total ${ctx.itemUnit}`,
              value: total,
              displayValue: total.toLocaleString(),
              relation: "BASE"
            },
            {
              id: "combined_groups",
              name: `${ctx.groupAName} + ${ctx.groupBName}`,
              value: groupA + groupB,
              displayValue: (groupA + groupB).toLocaleString(),
              relation: "MORE",
              diffValue: "?",
              displayDiff: "?",
              actualDiff: overlap
            }
          ],
          target: {
            type: "DIFFERENCE",
            label: targetLabel,
            value: finalAnswer
          },

          steps: steps,
          comparisonSteps: comparisonSteps
        }
      }, null, 2);
    } else {
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL_COMPARISON",
        componentData: {
          modelType: "PART_WHOLE",
          totalLabel: `Total ${ctx.itemUnit.charAt(0).toUpperCase() + ctx.itemUnit.slice(1)}`,
          whole: total.toLocaleString(),
          parts: [
            { name: `${ctx.groupAName} Only`, layoutSize: aOnly, displayValue: "?", bgClass: "bg-blue-600 text-white" },
            { name: "Both", layoutSize: overlap, displayValue: "?", bgClass: "bg-purple-600 text-white" },
            { name: `${ctx.groupBName} Only`, layoutSize: bOnly, displayValue: "?", bgClass: "bg-amber-600 text-white" }
          ]
        }
      }, null, 2);
    }
  }

  // ==========================================================================
  // VARIANT 6: advanced_two_tiered_difference (Difference of Differences)
  // ==========================================================================
  else if (effectiveVariant === 'advanced_two_tiered_difference') {
    const [nameA, nameB, nameC] = getRandomNames(3);
    const itemObj = getRandomCountableItems(1);
    const item = itemObj?.item || "books";

    const x = (Math.floor(Math.random() * 10) + 14) * 1000 + Math.floor(Math.random() * 9) * 100; // 14k - 23k
    const y = (Math.floor(Math.random() * 8) + 4) * 1000 + Math.floor(Math.random() * 9) * 100; // 4k - 11k

    const subType = explicitVariety === 'compare_a_and_c_more_and_less' ? 1 : (explicitVariety === 'combined_excess_over_twice_base' ? 2 : (explicitVariety === 'compare_a_and_c_both_more' ? 0 : Math.floor(Math.random() * 3)));

    const baselineLayout = 25000;

    if (subType === 0) {
      // Subtype 0: Both more -> Diff between A and C is x - y
      const diffAC = x - y;
      finalAnswer = diffAC.toString();

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL_COMPARISON",
        componentData: {
          modelType: "BAR_MODEL_COMPARISON",
          bars: [
            {
              name: nameA,
              layoutSize: baselineLayout + x,
              parts: [
                { label: "1 unit", size: baselineLayout, bgClass: "bg-blue-500 text-white" },
                { label: x.toLocaleString(), size: x, isExtra: true, bgClass: "bg-amber-100 text-amber-900 border-l-2 border-dashed border-amber-400" }
              ]
            },
            {
              name: nameB,
              layoutSize: baselineLayout,
              parts: [
                { label: "1 unit", size: baselineLayout, bgClass: "bg-blue-500 text-white" }
              ]
            },
            {
              name: nameC,
              layoutSize: baselineLayout + x,
              parts: [
                { label: "1 unit", size: baselineLayout, bgClass: "bg-blue-500 text-white" },
                { label: y.toLocaleString(), size: y, isExtra: true, bgClass: "bg-amber-100 text-amber-900 border-l-2 border-dashed border-amber-400" },
                { label: "", bracket: "?", size: x - y, isExtra: true, bgClass: "bg-slate-50 text-slate-600 border-2 border-dashed border-slate-300" }
              ]
            }
          ]
        }
      }, null, 2);

      promptInstruction = `- Question stem: "${nameA} has ${x.toLocaleString()} more ${item} than ${nameB}. ${nameC} has ${y.toLocaleString()} more ${item} than ${nameB}. How many more ${item} does ${nameA} have than ${nameC}?"\\n- The finalAnswer must be strictly "${finalAnswer}".\\n- CRITICAL: Return visualEngine and componentData EXACTLY as provided.`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find the difference between ${nameA} and ${nameC}:`, expectedAnswer: `${x} - ${y} = ${diffAC}` },
            { label: "Final Answer:", expectedAnswer: finalAnswer }
          ]
        }, null, 2);
      }

      if (isMCQ) {
        const d1 = (x + y).toString();
        const d2 = x.toString();
        const d3 = (diffAC + 1000).toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "WRONG_OPERATION_ADD" },
          { val: d2, defect: "PARTIAL_WORKING_STEP_ONE_ONLY" },
          { val: d3, defect: "CARELESS_CALCULATION" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: Both ${nameA} and ${nameC} are being compared to the same base amount (${nameB}).\\nStep 2: To find how many more ${item} ${nameA} has than ${nameC}, subtract the two extra amounts: ${x.toLocaleString()} - ${y.toLocaleString()} = ${diffAC.toLocaleString()}.\\nStep 3: ${nameA} has ${diffAC.toLocaleString()} more ${item} than ${nameC}.`;
      hint = `Since both people are compared to the same baseline (${nameB}), the difference between them is simply the difference between their extra amounts!`;

    } else if (subType === 1) {
      // Subtype 1: A more, C less -> Diff between A and C is x + y
      const diffAC = x + y;
      finalAnswer = diffAC.toString();

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL_COMPARISON",
        componentData: {
          modelType: "BAR_MODEL_COMPARISON",
          bars: [
            {
              name: nameA,
              layoutSize: baselineLayout + x,
              parts: [
                { label: "1 unit", size: baselineLayout, bgClass: "bg-blue-500 text-white" },
                { label: x.toLocaleString(), size: x, isExtra: true, bgClass: "bg-amber-100 text-amber-900 border-l-2 border-dashed border-amber-400" }
              ]
            },
            {
              name: nameB,
              layoutSize: baselineLayout,
              parts: [
                { label: "1 unit", size: baselineLayout, bgClass: "bg-blue-500 text-white" }
              ]
            },
            {
              name: nameC,
              layoutSize: baselineLayout + x,
              parts: [
                { label: "", size: baselineLayout - y, bgClass: "bg-blue-500 text-white" },
                { label: y.toLocaleString(), size: y, isExtra: true, bgClass: "bg-amber-50 text-amber-900 border-2 border-dashed border-amber-300" },
                { label: "", bracket: "?", size: x, isExtra: true, bgClass: "bg-slate-50 text-slate-600 border-2 border-dashed border-slate-300" }
              ]
            }
          ]
        }
      }, null, 2);

      promptInstruction = `- Question stem: "${nameA} has ${x.toLocaleString()} more ${item} than ${nameB}. ${nameC} has ${y.toLocaleString()} fewer ${item} than ${nameB}. How many more ${item} does ${nameA} have than ${nameC}?"\\n- The finalAnswer must be strictly "${finalAnswer}".\\n- CRITICAL: Return visualEngine and componentData EXACTLY as provided.`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find the total difference between ${nameA} and ${nameC}:`, expectedAnswer: `${x} + ${y} = ${diffAC}` },
            { label: "Final Answer:", expectedAnswer: finalAnswer }
          ]
        }, null, 2);
      }

      if (isMCQ) {
        const d1 = (x - y).toString();
        const d2 = x.toString();
        const d3 = y.toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "WRONG_OPERATION_SUBTRACT" },
          { val: d2, defect: "PARTIAL_WORKING_STEP_ONE_ONLY" },
          { val: d3, defect: "PARTIAL_WORKING_STEP_ONE_ONLY" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: ${nameA} is ${x.toLocaleString()} above ${nameB}, while ${nameC} is ${y.toLocaleString()} below ${nameB}.\\nStep 2: Add both distances from the baseline to find the total difference between ${nameA} and ${nameC}: ${x.toLocaleString()} + ${y.toLocaleString()} = ${diffAC.toLocaleString()}.\\nStep 3: ${nameA} has ${diffAC.toLocaleString()} more ${item} than ${nameC}.`;
      hint = `One person is above the baseline and the other is below the baseline. Add their differences to find the total distance between them!`;

    } else {
      // Subtype 2: Combined excess over twice of B is x + y
      const excess = x + y;
      finalAnswer = excess.toString();

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL_COMPARISON",
        componentData: {
          modelType: "BAR_MODEL_COMPARISON",
          bars: [
            {
              name: nameA,
              layoutSize: baselineLayout + x,
              parts: [
                { label: "1 unit", size: baselineLayout, bgClass: "bg-blue-500 text-white" },
                { label: x.toLocaleString(), size: x, isExtra: true, bgClass: "bg-amber-100 text-amber-900 border-l-2 border-dashed border-amber-400" }
              ]
            },
            {
              name: nameB,
              layoutSize: baselineLayout,
              parts: [
                { label: "1 unit", size: baselineLayout, bgClass: "bg-blue-500 text-white" }
              ]
            },
            {
              name: nameC,
              layoutSize: baselineLayout + y,
              parts: [
                { label: "1 unit", size: baselineLayout, bgClass: "bg-blue-500 text-white" },
                { label: y.toLocaleString(), size: y, isExtra: true, bgClass: "bg-amber-100 text-amber-900 border-l-2 border-dashed border-amber-400" }
              ]
            }
          ]
        }
      }, null, 2);

      promptInstruction = `- Question stem: "${nameA} has ${x.toLocaleString()} more ${item} than ${nameB}. ${nameC} has ${y.toLocaleString()} more ${item} than ${nameB}. If ${nameA} and ${nameC} combine their ${item}, how many more ${item} will their combined total be compared to twice of ${nameB}'s amount?"\\n- The finalAnswer must be strictly "${finalAnswer}".\\n- CRITICAL: Return visualEngine and componentData EXACTLY as provided.`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find the total excess above twice of ${nameB}'s amount:`, expectedAnswer: `${x} + ${y} = ${excess}` },
            { label: "Final Answer:", expectedAnswer: finalAnswer }
          ]
        }, null, 2);
      }

      if (isMCQ) {
        const d1 = (x - y).toString();
        const d2 = x.toString();
        const d3 = (excess + 1000).toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "WRONG_OPERATION_SUBTRACT" },
          { val: d2, defect: "PARTIAL_WORKING_STEP_ONE_ONLY" },
          { val: d3, defect: "CARELESS_CALCULATION" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: ${nameA}'s amount is (${nameB} + ${x.toLocaleString()}) and ${nameC}'s amount is (${nameB} + ${y.toLocaleString()}).\\nStep 2: Combined, their total is twice of ${nameB}'s amount plus the two extra quantities: ${x.toLocaleString()} + ${y.toLocaleString()} = ${excess.toLocaleString()}.\\nStep 3: Their combined total is ${excess.toLocaleString()} more than twice of ${nameB}'s amount.`;
      hint = `Each person has ${nameB}'s base amount plus an extra portion. When you combine them, the excess above twice of ${nameB} is simply the sum of the two extra portions!`;
    }
  }

  const mcqInstruction = isMCQ ? `- Generate EXACTLY 4 options: ${JSON.stringify(options)}.\\n- Set defectMap to: ${JSON.stringify(defectMap)}.` : "";

  const aiPrompt = `You are an expert Singapore Primary 4 Math educator.
Generate an advanced-level question for Singapore Primary 4 students.
Topic: Whole Numbers - Numbers up to 100 000
Subtopic: Number Comparison and Ordering
Difficulty: ${zodDiff}
Type: ${zodType}
Variant: ${effectiveVariant}

CRITICAL INSTRUCTIONS:
1. ${promptInstruction}
2. The finalAnswer must be strictly "${finalAnswer}".
${mcqInstruction}
3. Provide step-by-step solution steps separated by \\n:
${solutionSteps}
4. Provide a helpful conceptual hint:
"${hint}"
5. Forbid using "STORY:" or any instructional prefix in the output.

${getFormatInstructions(visualEngineStr, inputRequirementStr, effectiveVariant)}`;

  return { 
    aiPrompt,
    visualEngine: visualEngineStr ? (typeof visualEngineStr === 'string' ? JSON.parse(visualEngineStr) : visualEngineStr) : null,
    inputRequirement: inputRequirementStr ? (typeof inputRequirementStr === 'string' ? JSON.parse(inputRequirementStr) : inputRequirementStr) : null
  };
}
