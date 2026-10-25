import { getRandomNames, getRandomCountableItems } from '../../../../../utils/variable-bank.js';

export const STANDARD_ORDER_VARIETIES = {
  asc_diff_ten_thousands: 'Arrange 4 numbers (different ten thousands) in ascending order.',
  desc_diff_ten_thousands: 'Arrange 4 numbers (different ten thousands) in descending order.',
  asc_same_ten_thousands: 'Arrange 4 numbers (same ten thousands) in ascending order.',
  desc_same_ten_thousands: 'Arrange 4 numbers (same ten thousands) in descending order.',
  mixed_digits: 'Arrange 4 numbers containing a mixture of 4-digit and 5-digit numbers.'
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
    const fallback = isNaN(numAnswer) ? `${finalAnswer} (Option ${counter})` : (numAnswer + counter * 1000).toString();
    if (!options.includes(fallback)) {
      options.push(fallback);
      defectMap[fallback] = defaultDefect;
    }
    counter++;
  }

  return { options: options.sort(() => Math.random() - 0.5), defectMap };
}

export function resolveStandardVariety(variantInput, explicitVariety = null) {
  if (explicitVariety && STANDARD_ORDER_VARIETIES[explicitVariety]) {
    return explicitVariety;
  }

  let str = "";
  if (typeof variantInput === 'object' && variantInput !== null) {
    str = String(variantInput.variety || variantInput.variant || variantInput.subType || "").toLowerCase();
  } else {
    str = String(variantInput || "").toLowerCase().trim();
  }

  if (STANDARD_ORDER_VARIETIES[str]) {
    return str;
  }

  if (str.includes(':')) {
    const afterColon = str.split(':')[1].trim();
    if (STANDARD_ORDER_VARIETIES[afterColon]) return afterColon;
  }
  for (const key of Object.keys(STANDARD_ORDER_VARIETIES)) {
    if (str.endsWith(`_${key}`) || str.endsWith(`:${key}`)) {
      return key;
    }
  }

  const legacyMap = {
    'standard_order_asc_diff_ten_thousands': 'asc_diff_ten_thousands',
    'standard_order_desc_diff_ten_thousands': 'desc_diff_ten_thousands',
    'standard_order_asc_same_ten_thousands': 'asc_same_ten_thousands',
    'standard_order_desc_same_ten_thousands': 'desc_same_ten_thousands',
    'standard_order_mixed_digits': 'mixed_digits'
  };
  if (legacyMap[str]) {
    return legacyMap[str];
  }

  if (str === 'variety_1' || str === 'v1' || str === '1') return 'asc_diff_ten_thousands';
  if (str === 'variety_2' || str === 'v2' || str === '2') return 'desc_diff_ten_thousands';
  if (str === 'variety_3' || str === 'v3' || str === '3') return 'asc_same_ten_thousands';
  if (str === 'variety_4' || str === 'v4' || str === '4') return 'desc_same_ten_thousands';
  if (str === 'variety_5' || str === 'v5' || str === '5') return 'mixed_digits';

  if (str.includes('diff') && str.includes('asc')) return 'asc_diff_ten_thousands';
  if (str.includes('diff') && str.includes('desc')) return 'desc_diff_ten_thousands';
  if (str.includes('same') && str.includes('asc')) return 'asc_same_ten_thousands';
  if (str.includes('same') && str.includes('desc')) return 'desc_same_ten_thousands';
  if (str.includes('mixed')) return 'mixed_digits';

  const keys = Object.keys(STANDARD_ORDER_VARIETIES);
  return keys[Math.floor(Math.random() * keys.length)];
}

export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, explicitVariety = null) {
  let promptInstruction = "";
  let finalAnswer = "";
  let options = [];
  let defectMap = {};
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let solutionSteps = "";
  let hint = "";

  const allStandardVariants = [
    'standard_order_numbers',
    'standard_total_difference_base',
    'standard_missing_interval_deduction',
    'standard_target_shortfall_comparison',
    'standard_condition_digit_difference',
    'standard_chain_comparison_three_entities'
  ];

  const legacyOrderingMap = {
    'standard_order_asc_diff_ten_thousands': 'standard_order_numbers',
    'standard_order_desc_diff_ten_thousands': 'standard_order_numbers',
    'standard_order_asc_same_ten_thousands': 'standard_order_numbers',
    'standard_order_desc_same_ten_thousands': 'standard_order_numbers',
    'standard_order_mixed_digits': 'standard_order_numbers'
  };

  const orderingVarietyKeys = [
    'asc_diff_ten_thousands',
    'desc_diff_ten_thousands',
    'asc_same_ten_thousands',
    'desc_same_ten_thousands',
    'mixed_digits',
    'variety_1', 'variety_2', 'variety_3', 'variety_4', 'variety_5'
  ];

  let effectiveVariant = activeVariant;
  if (!effectiveVariant || effectiveVariant === 'standard_default' || effectiveVariant === 'default') {
    effectiveVariant = allStandardVariants[Math.floor(Math.random() * allStandardVariants.length)];
  } else if (legacyOrderingMap[effectiveVariant] || orderingVarietyKeys.includes(effectiveVariant) || String(effectiveVariant).startsWith('standard_order_numbers') || String(effectiveVariant).includes(':')) {
    effectiveVariant = 'standard_order_numbers';
  } else if (!allStandardVariants.includes(effectiveVariant)) {
    effectiveVariant = allStandardVariants[Math.floor(Math.random() * allStandardVariants.length)];
  }

  // --------------------------------------------------------------------------
  // VARIANT 1: standard_order_numbers (Ordering 4 numbers with 5 varieties)
  // --------------------------------------------------------------------------
  if (effectiveVariant === 'standard_order_numbers') {
    const variety = resolveStandardVariety(activeVariant, explicitVariety);
    let numbers = [];
    let isAscending = true;

    if (variety === 'asc_diff_ten_thousands') {
      isAscending = true;
      const tenThousands = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5).slice(0, 4);
      for (let i = 0; i < 4; i++) {
        const th = Math.floor(Math.random() * 10);
        const h = Math.floor(Math.random() * 10);
        const t = Math.floor(Math.random() * 10);
        const o = Math.floor(Math.random() * 10);
        numbers.push(tenThousands[i] * 10000 + th * 1000 + h * 100 + t * 10 + o);
      }
    } else if (variety === 'desc_diff_ten_thousands') {
      isAscending = false;
      const tenThousands = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5).slice(0, 4);
      for (let i = 0; i < 4; i++) {
        const th = Math.floor(Math.random() * 10);
        const h = Math.floor(Math.random() * 10);
        const t = Math.floor(Math.random() * 10);
        const o = Math.floor(Math.random() * 10);
        numbers.push(tenThousands[i] * 10000 + th * 1000 + h * 100 + t * 10 + o);
      }
    } else if (variety === 'asc_same_ten_thousands') {
      isAscending = true;
      const sharedTth = Math.floor(Math.random() * 9) + 1;
      const thousands = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5).slice(0, 4);
      for (let i = 0; i < 4; i++) {
        const h = Math.floor(Math.random() * 10);
        const t = Math.floor(Math.random() * 10);
        const o = Math.floor(Math.random() * 10);
        numbers.push(sharedTth * 10000 + thousands[i] * 1000 + h * 100 + t * 10 + o);
      }
    } else if (variety === 'desc_same_ten_thousands') {
      isAscending = false;
      const sharedTth = Math.floor(Math.random() * 9) + 1;
      const thousands = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5).slice(0, 4);
      for (let i = 0; i < 4; i++) {
        const h = Math.floor(Math.random() * 10);
        const t = Math.floor(Math.random() * 10);
        const o = Math.floor(Math.random() * 10);
        numbers.push(sharedTth * 10000 + thousands[i] * 1000 + h * 100 + t * 10 + o);
      }
    } else {
      // mixed_digits
      const variantStr = String(activeVariant || "").toLowerCase();
      if (variantStr.includes('asc')) {
        isAscending = true;
      } else if (variantStr.includes('desc')) {
        isAscending = false;
      } else {
        isAscending = Math.random() < 0.5;
      }

      const num4Count = Math.random() < 0.5 ? 2 : 1;
      while (numbers.length < num4Count) {
        const n = Math.floor(Math.random() * 9000) + 1000;
        if (!numbers.includes(n)) numbers.push(n);
      }
      while (numbers.length < 4) {
        const n = Math.floor(Math.random() * 80000) + 10000;
        if (!numbers.includes(n)) numbers.push(n);
      }
    }

    const askType = isAscending ? "smallest" : "greatest";
    const oppositeType = isAscending ? "greatest" : "smallest";

    const sortedNumbers = [...numbers].sort((a, b) => isAscending ? a - b : b - a);
    finalAnswer = sortedNumbers.join(", ");

    let presentedNumbers = [...numbers].sort(() => Math.random() - 0.5);
    if (presentedNumbers.join(", ") === finalAnswer) {
      presentedNumbers.reverse();
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "NUMBER_CARDS",
      componentData: {
        items: presentedNumbers.map(n => n.toString())
      }
    }, null, 2);

    promptInstruction = `- Question stem: "Arrange the numbers in order, beginning with the ${askType}:\\n${presentedNumbers.join(', ')}"\\n- The numbers are: ${presentedNumbers.join(', ')}.\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const reverseOrder = [...numbers].sort((a, b) => isAscending ? b - a : a - b).join(", ");
      const swap01 = [...sortedNumbers];
      [swap01[0], swap01[1]] = [swap01[1], swap01[0]];

      const swap23 = [...sortedNumbers];
      [swap23[2], swap23[3]] = [swap23[3], swap23[2]];

      const swap12 = [...sortedNumbers];
      [swap12[1], swap12[2]] = [swap12[2], swap12[1]];

      const swap03 = [...sortedNumbers];
      [swap03[0], swap03[3]] = [swap03[3], swap03[0]];

      const rawDistractors = [
        { val: reverseOrder, defect: isAscending ? "REVERSE_ORDER_GREATEST" : "REVERSE_ORDER_SMALLEST" },
        { val: swap01.join(", "), defect: "PARTIAL_SORT_ERROR" },
        { val: swap23.join(", "), defect: "PARTIAL_SORT_ERROR" },
        { val: swap12.join(", "), defect: "PARTIAL_SORT_ERROR" },
        { val: swap03.join(", "), defect: "CARELESS_CALCULATION" }
      ];

      const mcqRes = ensureFourUniqueOptions(finalAnswer, rawDistractors);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    }

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: `Which is the ${askType} number?`, expectedAnswer: sortedNumbers[0].toString() },
          { label: `Which is the ${oppositeType} number?`, expectedAnswer: sortedNumbers[3].toString() },
          { label: `Arrange all 4 numbers in order, beginning with the ${askType} (separate numbers with a comma):`, expectedAnswer: finalAnswer }
        ]
      }, null, 2);
    }

    if (variety === 'asc_diff_ten_thousands' || variety === 'desc_diff_ten_thousands') {
      const orderSign = isAscending ? " < " : " > ";
      const tthSteps = sortedNumbers.map(n => Math.floor(n / 10000)).join(orderSign);
      solutionSteps = `Step 1: Look at the ten thousands digits of the numbers:\\n${presentedNumbers.map(n => `${n} has ${Math.floor(n / 10000)} ten thousands`).join('\\n')}\\nStep 2: Compare and arrange the ten thousands digits from ${isAscending ? 'smallest to greatest' : 'greatest to smallest'}: ${tthSteps}.\\nStep 3: Arrange the numbers in order: ${finalAnswer}.`;
      hint = `Look at the digit with the greatest place value (the ten thousands place) in each number to arrange them!`;
    } else if (variety === 'asc_same_ten_thousands' || variety === 'desc_same_ten_thousands') {
      const orderSign = isAscending ? " < " : " > ";
      const sharedTth = Math.floor(numbers[0] / 10000);
      const thSteps = sortedNumbers.map(n => Math.floor((n % 10000) / 1000)).join(orderSign);
      solutionSteps = `Step 1: All 4 numbers have the same ten thousands digit (${sharedTth}).\\nStep 2: Compare the thousands digits of the numbers:\\n${presentedNumbers.map(n => `${n} has ${Math.floor((n % 10000) / 1000)} thousands`).join('\\n')}\\nStep 3: Compare and arrange the thousands digits from ${isAscending ? 'smallest to greatest' : 'greatest to smallest'}: ${thSteps}.\\nStep 4: Arrange the numbers in order: ${finalAnswer}.`;
      hint = `Since all numbers have the same ten thousands digit, look at their thousands digits to determine their order!`;
    } else {
      solutionSteps = `Step 1: Count the digits in each number. A 4-digit number is always smaller than a 5-digit number.\\nStep 2: Compare the 4-digit numbers by looking at their highest place value.\\nStep 3: Compare the 5-digit numbers by looking at their ten thousands and thousands digits.\\nStep 4: Arrange all 4 numbers in order, beginning with the ${askType}: ${finalAnswer}.`;
      hint = `Count the number of digits in each number first. Remember that 4-digit numbers are always smaller than 5-digit numbers!`;
    }
  }

  // --------------------------------------------------------------------------
  // VARIANT 2: standard_total_difference_base (The Total & Difference Base Finder)
  // --------------------------------------------------------------------------
  else if (effectiveVariant === 'standard_total_difference_base') {
    const [nameA, nameB] = getRandomNames(2);
    const itemObj = getRandomCountableItems(1);
    const item = itemObj?.item || "stickers";

    // 7 Varieties:
    // Subtype 0: Given (Total, Diff) -> Find Smaller B
    // Subtype 1: Given (Total, Diff) -> Find Larger A
    // Subtype 2: Given (Total, Diff) -> Find Larger A and round to nearest hundred
    // Subtype 3: Given (Smaller B, Diff) -> Find Total
    // Subtype 4: Given (Larger A, Diff) -> Find Total
    // Subtype 5: Given (Larger A, Total) -> Find Difference
    // Subtype 6: Given (Smaller B, Total) -> Find Difference
    const subType = Math.floor(Math.random() * 7);

    const baseMult = Math.floor(Math.random() * 20) + 12; // 12k to 31k
    const smaller = baseMult * 1000 + Math.floor(Math.random() * 9) * 100;
    const diffMult = (Math.floor(Math.random() * 6) + 2) * 2; // 4k, 6k, 8k, 10k, 12k
    const diff = diffMult * 1000 + Math.floor(Math.random() * 9) * 100;
    const larger = smaller + diff;
    const total = larger + smaller;

    if (subType === 0) {
      // 0: Given (Total, Diff) -> Find Smaller (B)
      finalAnswer = smaller.toString();
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL_COMPARISON",
        componentData: {
          modelType: "BAR_MODEL_COMPARISON",
          bars: [
            { name: nameA, value: "", layoutSize: larger, displayValue: "" },
            { name: nameB, value: "?", layoutSize: smaller, displayValue: "?" }
          ],
          difference: { displayValue: diff.toLocaleString() },
          whole: total.toLocaleString()
        }
      }, null, 2);

      promptInstruction = `- Question stem: "${nameA} and ${nameB} have a combined total of ${total.toLocaleString()} ${item}. ${nameA} has ${diff.toLocaleString()} more ${item} than ${nameB}. How many ${item} does ${nameB} have?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Write the working equation to remove the difference from the total:", expectedAnswer: `${total} - ${diff} = ${total - diff}` },
            { label: `Write the working equation to find ${nameB}'s amount:`, expectedAnswer: `${total - diff} / 2 = ${smaller}` },
            { label: "Final Answer:", expectedAnswer: finalAnswer }
          ]
        }, null, 2);
      }

      if (isMCQ) {
        const d1 = larger.toString();
        const d2 = (total - diff).toString();
        const d3 = Math.floor(total / 2).toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "OPPOSITE_ENTITY_FOUND" },
          { val: d2, defect: "FORGOT_TO_DIVIDE_BY_2" },
          { val: d3, defect: "IGNORED_DIFFERENCE" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: The model shows that ${nameA} and ${nameB} share 2 equal units plus a difference of ${diff.toLocaleString()}, giving a total of ${total.toLocaleString()}.\\nStep 2: Subtract the difference from the total to get 2 equal units: ${total} - ${diff} = ${total - diff}.\\nStep 3: Divide by 2 to find 1 unit (${nameB}'s amount): ${total - diff} ÷ 2 = ${smaller.toLocaleString()}.`;
      hint = `Subtract the difference from the total first to find the value of 2 equal units, then divide by 2!`;

    } else if (subType === 1) {
      // 1: Given (Total, Diff) -> Find Larger (A)
      finalAnswer = larger.toString();
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL_COMPARISON",
        componentData: {
          modelType: "BAR_MODEL_COMPARISON",
          bars: [
            { name: nameA, value: "?", layoutSize: larger, displayValue: "?" },
            { name: nameB, value: "", layoutSize: smaller, displayValue: "" }
          ],
          difference: { displayValue: diff.toLocaleString() },
          whole: total.toLocaleString()
        }
      }, null, 2);

      promptInstruction = `- Question stem: "${nameA} and ${nameB} have a combined total of ${total.toLocaleString()} ${item}. ${nameA} has ${diff.toLocaleString()} more ${item} than ${nameB}. How many ${item} does ${nameA} have?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Write the working equation to remove the difference from the total:", expectedAnswer: `${total} - ${diff} = ${total - diff}` },
            { label: `Write the working equation to find 1 unit (${nameB}'s amount):`, expectedAnswer: `${total - diff} / 2 = ${smaller}` },
            { label: `Write the working equation to find ${nameA}'s amount:`, expectedAnswer: `${smaller} + ${diff} = ${larger}` },
            { label: "Final Answer:", expectedAnswer: finalAnswer }
          ]
        }, null, 2);
      }

      if (isMCQ) {
        const d1 = smaller.toString();
        const d2 = (total - diff).toString();
        const d3 = Math.floor(total / 2).toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "OPPOSITE_ENTITY_FOUND" },
          { val: d2, defect: "FORGOT_TO_DIVIDE_BY_2" },
          { val: d3, defect: "IGNORED_DIFFERENCE" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: Subtract the difference from the total to get 2 units: ${total} - ${diff} = ${total - diff}.\\nStep 2: Divide by 2 to find ${nameB}'s amount: ${total - diff} ÷ 2 = ${smaller.toLocaleString()}.\\nStep 3: Add the difference to find ${nameA}'s amount: ${smaller} + ${diff} = ${larger.toLocaleString()}.`;
      hint = `First find the smaller amount by removing the difference from the total and dividing by 2. Then add the difference back to find ${nameA}'s amount!`;

    } else if (subType === 2) {
      // 2: Given (Total, Diff) -> Multi-step with Rounding
      const roundedVal = Math.round(larger / 100) * 100;
      finalAnswer = roundedVal.toString();
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL_COMPARISON",
        componentData: {
          modelType: "BAR_MODEL_COMPARISON",
          bars: [
            { name: nameA, value: "?", layoutSize: larger, displayValue: "?" },
            { name: nameB, value: "", layoutSize: smaller, displayValue: "" }
          ],
          difference: { displayValue: diff.toLocaleString() },
          whole: total.toLocaleString()
        }
      }, null, 2);

      promptInstruction = `- Question stem: "${nameA} and ${nameB} have a combined total of ${total.toLocaleString()} ${item}. ${nameA} has ${diff.toLocaleString()} more ${item} than ${nameB}. Find the number of ${item} ${nameA} has, then round your answer to the nearest hundred."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Write the working equation to remove the difference from the total:", expectedAnswer: `${total} - ${diff} = ${total - diff}` },
            { label: `Write the working equation to find ${nameA}'s amount:`, expectedAnswer: `${(total - diff) / 2} + ${diff} = ${larger}` },
            { label: `Round ${nameA}'s amount to the nearest hundred:`, expectedAnswer: finalAnswer },
            { label: "Final Answer:", expectedAnswer: finalAnswer }
          ]
        }, null, 2);
      }

      if (isMCQ) {
        const d1 = larger.toString();
        const d2 = (Math.round(smaller / 100) * 100).toString();
        const d3 = (Math.floor(larger / 1000) * 1000).toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "FORGOT_TO_ROUND" },
          { val: d2, defect: "OPPOSITE_ENTITY_FOUND" },
          { val: d3, defect: "ROUNDED_TO_WRONG_PLACE_VALUE" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: Subtract the difference from the total to get 2 units: ${total} - ${diff} = ${total - diff}.\\nStep 2: Find ${nameB}'s amount: ${total - diff} ÷ 2 = ${smaller.toLocaleString()}.\\nStep 3: Find ${nameA}'s amount: ${smaller} + ${diff} = ${larger.toLocaleString()}.\\nStep 4: Round ${larger.toLocaleString()} to the nearest hundred: look at the tens digit. It rounds to ${roundedVal.toLocaleString()}.`;
      hint = `Calculate ${nameA}'s exact amount first, then look at the tens digit to round to the nearest hundred!`;

    } else if (subType === 3) {
      // 3: Given (Smaller B, Diff) -> Find Total
      finalAnswer = total.toString();
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL_COMPARISON",
        componentData: {
          modelType: "BAR_MODEL_COMPARISON",
          bars: [
            { name: nameA, value: "", layoutSize: larger, displayValue: "" },
            { name: nameB, value: smaller, layoutSize: smaller, displayValue: smaller.toLocaleString() }
          ],
          difference: { displayValue: diff.toLocaleString() },
          whole: "?"
        }
      }, null, 2);

      promptInstruction = `- Question stem: "${nameB} has ${smaller.toLocaleString()} ${item}. ${nameA} has ${diff.toLocaleString()} more ${item} than ${nameB}. How many ${item} do they have altogether?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find ${nameA}'s amount:`, expectedAnswer: `${smaller} + ${diff} = ${larger}` },
            { label: "Write the working equation to find the total amount:", expectedAnswer: `${larger} + ${smaller} = ${total}` },
            { label: "Final Answer:", expectedAnswer: finalAnswer }
          ]
        }, null, 2);
      }

      if (isMCQ) {
        const d1 = larger.toString();
        const d2 = (smaller * 2).toString();
        const d3 = (diff * 2).toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "PARTIAL_WORKING_STEP_ONE_ONLY" },
          { val: d2, defect: "IGNORED_DIFFERENCE" },
          { val: d3, defect: "WRONG_OPERATION" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: Find ${nameA}'s amount by adding the difference to ${nameB}'s amount: ${smaller.toLocaleString()} + ${diff.toLocaleString()} = ${larger.toLocaleString()}.\\nStep 2: Add both amounts together to find the total: ${larger.toLocaleString()} + ${smaller.toLocaleString()} = ${total.toLocaleString()}.`;
      hint = `First add the difference to ${nameB}'s amount to find ${nameA}'s amount, then add both amounts together!`;

    } else if (subType === 4) {
      // 4: Given (Larger A, Diff) -> Find Total
      finalAnswer = total.toString();
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL_COMPARISON",
        componentData: {
          modelType: "BAR_MODEL_COMPARISON",
          bars: [
            { name: nameA, value: larger, layoutSize: larger, displayValue: larger.toLocaleString() },
            { name: nameB, value: "", layoutSize: smaller, displayValue: "" }
          ],
          difference: { displayValue: diff.toLocaleString() },
          whole: "?"
        }
      }, null, 2);

      promptInstruction = `- Question stem: "${nameA} has ${larger.toLocaleString()} ${item}. ${nameA} has ${diff.toLocaleString()} more ${item} than ${nameB}. How many ${item} do they have altogether?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find ${nameB}'s amount:`, expectedAnswer: `${larger} - ${diff} = ${smaller}` },
            { label: "Write the working equation to find the total amount:", expectedAnswer: `${larger} + ${smaller} = ${total}` },
            { label: "Final Answer:", expectedAnswer: finalAnswer }
          ]
        }, null, 2);
      }

      if (isMCQ) {
        const d1 = smaller.toString();
        const d2 = (larger * 2).toString();
        const d3 = (larger + diff).toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "PARTIAL_WORKING_STEP_ONE_ONLY" },
          { val: d2, defect: "IGNORED_DIFFERENCE" },
          { val: d3, defect: "WRONG_OPERATION_ADD" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: Find ${nameB}'s amount by subtracting the difference from ${nameA}'s amount: ${larger.toLocaleString()} - ${diff.toLocaleString()} = ${smaller.toLocaleString()}.\\nStep 2: Add both amounts together to find the total: ${larger.toLocaleString()} + ${smaller.toLocaleString()} = ${total.toLocaleString()}.`;
      hint = `Subtract the difference from ${nameA}'s amount to find ${nameB}'s amount, then add them together!`;

    } else if (subType === 5) {
      // 5: Given (Larger A, Total) -> Find Difference
      finalAnswer = diff.toString();
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL_COMPARISON",
        componentData: {
          modelType: "BAR_MODEL_COMPARISON",
          bars: [
            { name: nameA, value: larger, layoutSize: larger, displayValue: larger.toLocaleString() },
            { name: nameB, value: "", layoutSize: smaller, displayValue: "" }
          ],
          difference: { displayValue: "?" },
          whole: total.toLocaleString()
        }
      }, null, 2);

      promptInstruction = `- Question stem: "${nameA} and ${nameB} have a combined total of ${total.toLocaleString()} ${item}. ${nameA} has ${larger.toLocaleString()} ${item}. How many more ${item} does ${nameA} have than ${nameB}?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find ${nameB}'s amount:`, expectedAnswer: `${total} - ${larger} = ${smaller}` },
            { label: `Write the working equation to find the difference between ${nameA} and ${nameB}:`, expectedAnswer: `${larger} - ${smaller} = ${diff}` },
            { label: "Final Answer:", expectedAnswer: finalAnswer }
          ]
        }, null, 2);
      }

      if (isMCQ) {
        const d1 = smaller.toString();
        const d2 = (total - larger).toString();
        const d3 = (diff + 1000).toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "PARTIAL_WORKING_STEP_ONE_ONLY" },
          { val: d2, defect: "PARTIAL_WORKING_STEP_ONE_ONLY" },
          { val: d3, defect: "CARELESS_CALCULATION" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: Subtract ${nameA}'s amount from the total to find ${nameB}'s amount: ${total.toLocaleString()} - ${larger.toLocaleString()} = ${smaller.toLocaleString()}.\\nStep 2: Subtract ${nameB}'s amount from ${nameA}'s amount to find the difference: ${larger.toLocaleString()} - ${smaller.toLocaleString()} = ${diff.toLocaleString()}.`;
      hint = `First find ${nameB}'s amount by subtracting ${nameA}'s amount from the total. Then find the difference between their amounts!`;

    } else {
      // 6: Given (Smaller B, Total) -> Find Difference
      finalAnswer = diff.toString();
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL_COMPARISON",
        componentData: {
          modelType: "BAR_MODEL_COMPARISON",
          bars: [
            { name: nameA, value: "", layoutSize: larger, displayValue: "" },
            { name: nameB, value: smaller, layoutSize: smaller, displayValue: smaller.toLocaleString() }
          ],
          difference: { displayValue: "?" },
          whole: total.toLocaleString()
        }
      }, null, 2);

      promptInstruction = `- Question stem: "${nameA} and ${nameB} have a combined total of ${total.toLocaleString()} ${item}. ${nameB} has ${smaller.toLocaleString()} ${item}. What is the difference between the number of ${item} ${nameA} and ${nameB} have?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find ${nameA}'s amount:`, expectedAnswer: `${total} - ${smaller} = ${larger}` },
            { label: "Write the working equation to find the difference:", expectedAnswer: `${larger} - ${smaller} = ${diff}` },
            { label: "Final Answer:", expectedAnswer: finalAnswer }
          ]
        }, null, 2);
      }

      if (isMCQ) {
        const d1 = larger.toString();
        const d2 = (total - smaller).toString();
        const d3 = (diff + 1000).toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "PARTIAL_WORKING_STEP_ONE_ONLY" },
          { val: d2, defect: "PARTIAL_WORKING_STEP_ONE_ONLY" },
          { val: d3, defect: "CARELESS_CALCULATION" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: Subtract ${nameB}'s amount from the total to find ${nameA}'s amount: ${total.toLocaleString()} - ${smaller.toLocaleString()} = ${larger.toLocaleString()}.\\nStep 2: Subtract ${nameB}'s amount from ${nameA}'s amount to find the difference: ${larger.toLocaleString()} - ${smaller.toLocaleString()} = ${diff.toLocaleString()}.`;
      hint = `First find ${nameA}'s amount by subtracting ${nameB}'s amount from the total. Then find the difference!`;
    }
  }

  // --------------------------------------------------------------------------
  // VARIANT 3: standard_missing_interval_deduction (Missing Interval on Number Line)
  // --------------------------------------------------------------------------
  else if (effectiveVariant === 'standard_missing_interval_deduction') {
    const jumpOptions = [4, 5, 8, 10];
    const jumps = jumpOptions[Math.floor(Math.random() * jumpOptions.length)];

    const stepPool = [1000, 2000, 2500, 4000, 5000];
    const step = stepPool[Math.floor(Math.random() * stepPool.length)];
    const totalDiff = jumps * step;

    const startVal = (Math.floor(Math.random() * 30) + 10) * 1000;
    const endVal = startVal + totalDiff;

    const targetPoint = Math.floor(Math.random() * (jumps - 2)) + 1;
    const targetVal = startVal + targetPoint * step;

    finalAnswer = targetVal.toString();

    visualEngineStr = JSON.stringify({
      componentToRender: "NUMBER_LINE_ADVANCED",
      componentData: {
        startValue: startVal,
        endValue: endVal,
        numIntervals: jumps,
        labeledPoints: [
          { index: 0, label: startVal.toLocaleString() },
          { index: jumps, label: endVal.toLocaleString() }
        ],
        targetPoint: targetPoint,
        markedLabel: "?"
      }
    }, null, 2);

    promptInstruction = `- Question stem: "Look at the number line below. Find the value represented by the question mark (? )."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Write the working equation to find the total difference between the start and end marks:", expectedAnswer: `${endVal} - ${startVal} = ${totalDiff}` },
          { label: "Write the working equation to find the value of 1 interval jump:", expectedAnswer: `${totalDiff} / ${jumps} = ${step}` },
          { label: "Write the working equation to find the unknown mark:", expectedAnswer: `${startVal} + ${targetPoint * step} = ${targetVal}` },
          { label: "Final Answer:", expectedAnswer: finalAnswer }
        ]
      }, null, 2);
    }

    if (isMCQ) {
      const d1 = (targetVal + step).toString();
      const d2 = (targetVal - step).toString();
      const d3 = (targetPoint * step).toString();
      const mcqRes = ensureFourUniqueOptions(finalAnswer, [
        { val: d1, defect: "INTERVAL_COUNT_OFF_BY_ONE" },
        { val: d2, defect: "INTERVAL_COUNT_OFF_BY_ONE" },
        { val: d3, defect: "FORGOT_STARTING_OFFSET" }
      ], "CARELESS_CALCULATION");
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    }

    solutionSteps = `Step 1: Find the total difference between the start and end marks: ${endVal.toLocaleString()} - ${startVal.toLocaleString()} = ${totalDiff.toLocaleString()}.\\nStep 2: Count the physical interval jumps between the start and end marks. There are ${jumps} equal jumps.\\nStep 3: Calculate the value of 1 interval jump: ${totalDiff.toLocaleString()} ÷ ${jumps} = ${step.toLocaleString()}.\\nStep 4: Count the jumps from ${startVal.toLocaleString()} to the question mark: there are ${targetPoint} jumps.\\nStep 5: Calculate the unknown mark: ${startVal} + (${targetPoint} × ${step}) = ${targetVal.toLocaleString()}.`;
    hint = `First find the total difference between the two end numbers. Then divide by the number of jumps to find the value of each step!`;
  }

  // --------------------------------------------------------------------------
  // VARIANT 4: standard_target_shortfall_comparison (Target Shortfall Comparison)
  // --------------------------------------------------------------------------
  else if (effectiveVariant === 'standard_target_shortfall_comparison') {
    const [nameA, nameB] = getRandomNames(2);
    const itemObj = getRandomCountableItems(1);
    const item = itemObj?.item || "keys";

    // 4 Varieties:
    // Subtype 0: Given A, B, Target -> Find Shortfall
    // Subtype 1: Given A, Shortfall, Target -> Find B
    // Subtype 2: Given B, Shortfall, Target -> Find A
    // Subtype 3: Given A, B, Shortfall -> Find Target
    const subType = Math.floor(Math.random() * 4);

    const valA = (Math.floor(Math.random() * 18) + 15) * 1000 + Math.floor(Math.random() * 9) * 100; // 15k - 33k
    const valB = (Math.floor(Math.random() * 18) + 15) * 1000 + Math.floor(Math.random() * 9) * 100; // 15k - 33k
    const currentTotal = valA + valB;

    const shortfall = (Math.floor(Math.random() * 14) + 6) * 1000 + Math.floor(Math.random() * 9) * 100; // 6k - 20k
    const target = currentTotal + shortfall;

    if (subType === 0) {
      // Subtype 0: Given A, B, and Target -> Find Shortfall
      finalAnswer = shortfall.toString();

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL_COMPARISON",
        componentData: {
          modelType: "PART_WHOLE",
          totalLabel: "TARGET",
          whole: target.toLocaleString(),
          parts: [
            { name: nameA, value: valA, layoutSize: valA, displayValue: valA.toLocaleString(), bgClass: "bg-blue-500 text-white" },
            { name: nameB, value: valB, layoutSize: valB, displayValue: valB.toLocaleString(), bgClass: "bg-amber-500 text-white" },
            { name: "Shortfall", value: "?", layoutSize: shortfall, displayValue: "?", isShortfall: true, bgClass: "bg-slate-200 text-slate-700 border-2 border-dashed border-slate-400" }
          ]
        }
      }, null, 2);

      promptInstruction = `- Question stem: "${nameA} collected ${valA.toLocaleString()} ${item} and ${nameB} collected ${valB.toLocaleString()} ${item}. Their target is to collect ${target.toLocaleString()} ${item} altogether. How many more ${item} do they need to reach their target?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find the total ${item} collected so far:`, expectedAnswer: `${valA} + ${valB} = ${currentTotal}` },
            { label: "Write the working equation to find the remaining shortfall needed:", expectedAnswer: `${target} - ${currentTotal} = ${shortfall}` },
            { label: "Final Answer:", expectedAnswer: finalAnswer }
          ]
        }, null, 2);
      }

      if (isMCQ) {
        const d1 = currentTotal.toString();
        const d2 = (target - valA).toString();
        const d3 = (target - valB).toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "PARTIAL_WORKING_SUM_ONLY" },
          { val: d2, defect: "IGNORED_SECOND_ENTITY" },
          { val: d3, defect: "IGNORED_FIRST_ENTITY" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: Find the combined total collected by ${nameA} and ${nameB}: ${valA.toLocaleString()} + ${valB.toLocaleString()} = ${currentTotal.toLocaleString()}.\\nStep 2: Subtract the collected total from the target to find the shortfall: ${target.toLocaleString()} - ${currentTotal.toLocaleString()} = ${shortfall.toLocaleString()}.\\nStep 3: They need ${shortfall.toLocaleString()} more ${item} to reach their target.`;
      hint = `First add ${nameA}'s and ${nameB}'s amounts together. Then subtract that sum from the target amount!`;

    } else if (subType === 1) {
      // Subtype 1: Given A, Shortfall, Target -> Find B
      finalAnswer = valB.toString();

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL_COMPARISON",
        componentData: {
          modelType: "PART_WHOLE",
          totalLabel: "TARGET",
          whole: target.toLocaleString(),
          parts: [
            { name: nameA, value: valA, layoutSize: valA, displayValue: valA.toLocaleString(), bgClass: "bg-blue-500 text-white" },
            { name: nameB, value: "?", layoutSize: valB, displayValue: "?", bgClass: "bg-amber-500 text-white" },
            { name: "Shortfall", value: shortfall, layoutSize: shortfall, displayValue: shortfall.toLocaleString(), isShortfall: true, bgClass: "bg-slate-200 text-slate-700 border-2 border-dashed border-slate-400" }
          ]
        }
      }, null, 2);

      promptInstruction = `- Question stem: "${nameA} collected ${valA.toLocaleString()} ${item}. Together with ${nameB}, they need a total of ${target.toLocaleString()} ${item} to reach their target. If they still need ${shortfall.toLocaleString()} more ${item}, how many ${item} did ${nameB} collect?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find the total ${item} collected so far:`, expectedAnswer: `${target} - ${shortfall} = ${currentTotal}` },
            { label: `Write the working equation to find ${nameB}'s amount:`, expectedAnswer: `${currentTotal} - ${valA} = ${valB}` },
            { label: "Final Answer:", expectedAnswer: finalAnswer }
          ]
        }, null, 2);
      }

      if (isMCQ) {
        const d1 = currentTotal.toString();
        const d2 = (valA + shortfall).toString();
        const d3 = (target - valA).toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "PARTIAL_WORKING_SUM_ONLY" },
          { val: d2, defect: "WRONG_OPERATION_ADD" },
          { val: d3, defect: "FORGOT_TO_SUBTRACT_SHORTFALL" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: Subtract the shortfall from the target to find the total collected so far: ${target.toLocaleString()} - ${shortfall.toLocaleString()} = ${currentTotal.toLocaleString()}.\\nStep 2: Subtract ${nameA}'s amount from the collected total to find ${nameB}'s amount: ${currentTotal.toLocaleString()} - ${valA.toLocaleString()} = ${valB.toLocaleString()}.`;
      hint = `First subtract the shortfall from the target to find how many they collected altogether. Then subtract ${nameA}'s amount!`;

    } else if (subType === 2) {
      // Subtype 2: Given B, Shortfall, Target -> Find A
      finalAnswer = valA.toString();

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL_COMPARISON",
        componentData: {
          modelType: "PART_WHOLE",
          totalLabel: "TARGET",
          whole: target.toLocaleString(),
          parts: [
            { name: nameA, value: "?", layoutSize: valA, displayValue: "?", bgClass: "bg-blue-500 text-white" },
            { name: nameB, value: valB, layoutSize: valB, displayValue: valB.toLocaleString(), bgClass: "bg-amber-500 text-white" },
            { name: "Shortfall", value: shortfall, layoutSize: shortfall, displayValue: shortfall.toLocaleString(), isShortfall: true, bgClass: "bg-slate-200 text-slate-700 border-2 border-dashed border-slate-400" }
          ]
        }
      }, null, 2);

      promptInstruction = `- Question stem: "${nameB} collected ${valB.toLocaleString()} ${item}. Together with ${nameA}, they need a total of ${target.toLocaleString()} ${item} to reach their target. If they still need ${shortfall.toLocaleString()} more ${item}, how many ${item} did ${nameA} collect?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find the total ${item} collected so far:`, expectedAnswer: `${target} - ${shortfall} = ${currentTotal}` },
            { label: `Write the working equation to find ${nameA}'s amount:`, expectedAnswer: `${currentTotal} - ${valB} = ${valA}` },
            { label: "Final Answer:", expectedAnswer: finalAnswer }
          ]
        }, null, 2);
      }

      if (isMCQ) {
        const d1 = currentTotal.toString();
        const d2 = (valB + shortfall).toString();
        const d3 = (target - valB).toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "PARTIAL_WORKING_SUM_ONLY" },
          { val: d2, defect: "WRONG_OPERATION_ADD" },
          { val: d3, defect: "FORGOT_TO_SUBTRACT_SHORTFALL" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: Subtract the shortfall from the target to find the total collected so far: ${target.toLocaleString()} - ${shortfall.toLocaleString()} = ${currentTotal.toLocaleString()}.\\nStep 2: Subtract ${nameB}'s amount from the collected total to find ${nameA}'s amount: ${currentTotal.toLocaleString()} - ${valB.toLocaleString()} = ${valA.toLocaleString()}.`;
      hint = `First subtract the shortfall from the target to find how many they collected altogether. Then subtract ${nameB}'s amount!`;

    } else {
      // Subtype 3: Given A, B, and Shortfall -> Find Target
      finalAnswer = target.toString();

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL_COMPARISON",
        componentData: {
          modelType: "PART_WHOLE",
          totalLabel: "TARGET",
          whole: "?",
          parts: [
            { name: nameA, value: valA, layoutSize: valA, displayValue: valA.toLocaleString(), bgClass: "bg-blue-500 text-white" },
            { name: nameB, value: valB, layoutSize: valB, displayValue: valB.toLocaleString(), bgClass: "bg-amber-500 text-white" },
            { name: "Shortfall", value: shortfall, layoutSize: shortfall, displayValue: shortfall.toLocaleString(), isShortfall: true, bgClass: "bg-slate-200 text-slate-700 border-2 border-dashed border-slate-400" }
          ]
        }
      }, null, 2);

      promptInstruction = `- Question stem: "${nameA} collected ${valA.toLocaleString()} ${item} and ${nameB} collected ${valB.toLocaleString()} ${item}. They still need ${shortfall.toLocaleString()} more ${item} to reach their target. What is their target number of ${item}?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find the total ${item} collected by ${nameA} and ${nameB}:`, expectedAnswer: `${valA} + ${valB} = ${currentTotal}` },
            { label: `Write the working equation to find the overall target amount:`, expectedAnswer: `${currentTotal} + ${shortfall} = ${target}` },
            { label: "Final Answer:", expectedAnswer: finalAnswer }
          ]
        }, null, 2);
      }

      if (isMCQ) {
        const d1 = currentTotal.toString();
        const d2 = (valA + shortfall).toString();
        const d3 = (valB + shortfall).toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "FORGOT_TO_ADD_SHORTFALL" },
          { val: d2, defect: "IGNORED_SECOND_ENTITY" },
          { val: d3, defect: "IGNORED_FIRST_ENTITY" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: Find the combined amount collected so far: ${valA.toLocaleString()} + ${valB.toLocaleString()} = ${currentTotal.toLocaleString()}.\\nStep 2: Add the remaining shortfall to find the target: ${currentTotal.toLocaleString()} + ${shortfall.toLocaleString()} = ${target.toLocaleString()}.\\nStep 3: Their target is ${target.toLocaleString()} ${item}.`;
      hint = `Add ${nameA}'s and ${nameB}'s amounts together first, then add the shortfall to reach the total target!`;
    }
  }

  // --------------------------------------------------------------------------
  // VARIANT 5: standard_condition_digit_difference (Condition-Based Digit Construction & Difference)
  // --------------------------------------------------------------------------
  else if (effectiveVariant === 'standard_condition_digit_difference') {
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

    const numEvens = Math.random() < 0.5 ? 2 : 3;
    const numOdds = 5 - numEvens;

    const evenPool = [0, 2, 4, 6, 8].sort(() => Math.random() - 0.5).slice(0, numEvens);
    const oddPool = [1, 3, 5, 7, 9].sort(() => Math.random() - 0.5).slice(0, numOdds);
    const digits = [...evenPool, ...oddPool].sort(() => Math.random() - 0.5);

    const allPerms = getPerms(digits);
    const validEvenNumbers = [];
    const validOddNumbers = [];

    for (const p of allPerms) {
      if (p[0] !== 0) {
        const num = p[0] * 10000 + p[1] * 1000 + p[2] * 100 + p[3] * 10 + p[4];
        const lastDigit = p[4];
        if (lastDigit % 2 === 0) {
          if (!validEvenNumbers.includes(num)) validEvenNumbers.push(num);
        } else {
          if (!validOddNumbers.includes(num)) validOddNumbers.push(num);
        }
      }
    }

    const greatEven = Math.max(...validEvenNumbers);
    const smallOdd = Math.min(...validOddNumbers);
    const diff = greatEven - smallOdd;

    finalAnswer = diff.toString();

    visualEngineStr = JSON.stringify({
      componentToRender: "DIGIT_CARD_SORTER",
      componentData: {
        digits: digits,
        condition: "Greatest Even & Smallest Odd"
      }
    }, null, 2);

    promptInstruction = `- Question stem: "Use all 5 digit cards ${digits.join(', ')} once to form the greatest 5-digit even number and the smallest 5-digit odd number. What is the difference between these two numbers?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Write the greatest 5-digit even number:", expectedAnswer: greatEven.toString() },
          { label: "Write the smallest 5-digit odd number:", expectedAnswer: smallOdd.toString() },
          { label: "Write the working equation to find their difference:", expectedAnswer: `${greatEven} - ${smallOdd} = ${diff}` },
          { label: "Final Answer:", expectedAnswer: finalAnswer }
        ]
      }, null, 2);
    }

    if (isMCQ) {
      const allValid = [...validEvenNumbers, ...validOddNumbers];
      const unconstrainedMax = Math.max(...allValid);
      const unconstrainedMin = Math.min(...allValid);
      const d1 = (unconstrainedMax - unconstrainedMin).toString();
      const d2 = (greatEven + smallOdd).toString();
      const d3 = (diff - 1000 > 0 ? diff - 1000 : diff + 1000).toString();

      const mcqRes = ensureFourUniqueOptions(finalAnswer, [
        { val: d1, defect: "IGNORED_EVEN_ODD_CONDITION" },
        { val: d2, defect: "WRONG_OPERATION_ADD" },
        { val: d3, defect: "CARELESS_CALCULATION" }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    }

    solutionSteps = `Step 1: To form the greatest 5-digit even number, the last digit must be an even digit (${evenPool.join(', ')}). Arrange the largest remaining digits from greatest to smallest in the front places: ${greatEven.toLocaleString()}.\\nStep 2: To form the smallest 5-digit odd number, the first digit must be the smallest non-zero digit, and the last digit must be odd (${oddPool.join(', ')}): ${smallOdd.toLocaleString()}.\\nStep 3: Calculate their difference: ${greatEven} - ${smallOdd} = ${diff.toLocaleString()}.`;
    hint = `Remember that an even number must end with an even digit, and an odd number must end with an odd digit. A 5-digit number cannot start with 0!`;
  }

  // --------------------------------------------------------------------------
  // VARIANT 6: standard_chain_comparison_three_entities (Chain Comparison with Three Entities)
  // --------------------------------------------------------------------------
  else if (effectiveVariant === 'standard_chain_comparison_three_entities') {
    const [nameA, nameB, nameC] = getRandomNames(3);
    const itemObj = getRandomCountableItems(1);
    const item = itemObj?.item || "stickers";

    const isFindingTotal = Math.random() < 0.5;

    let valA, y, z, valB, valC, total;

    if (isFindingTotal) {
      valA = (Math.floor(Math.random() * 12) + 10) * 1000 + Math.floor(Math.random() * 9) * 100;
      y = (Math.floor(Math.random() * 6) + 3) * 1000;
      valB = valA + y;
      z = (Math.floor(Math.random() * 4) + 2) * 1000;
      valC = valB - z;
      total = valA + valB + valC;
      finalAnswer = total.toString();
    } else {
      valA = (Math.floor(Math.random() * 20) + 25) * 1000 + Math.floor(Math.random() * 9) * 100;
      y = (Math.floor(Math.random() * 8) + 4) * 1000;
      valB = valA + y;
      z = (Math.floor(Math.random() * 6) + 2) * 1000;
      valC = valB - z;
      finalAnswer = valC.toString();
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_MODEL_COMPARISON",
      componentData: {
        modelType: "BAR_MODEL_COMPARISON",
        bars: [
          { name: nameA, value: valA, layoutSize: valA, displayValue: valA.toLocaleString() },
          { name: nameB, value: valB, layoutSize: valB, displayValue: valB.toLocaleString() },
          { name: nameC, value: isFindingTotal ? valC : "?", layoutSize: valC, displayValue: isFindingTotal ? valC.toLocaleString() : "?" }
        ],
        whole: isFindingTotal ? "?" : undefined
      }
    }, null, 2);

    if (isFindingTotal) {
      promptInstruction = `- Question stem: "${nameA} has ${valA.toLocaleString()} ${item}. ${nameB} has ${y.toLocaleString()} more ${item} than ${nameA}. ${nameC} has ${z.toLocaleString()} fewer ${item} than ${nameB}. How many ${item} do the three of them have altogether?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find ${nameB}'s amount:`, expectedAnswer: `${valA} + ${y} = ${valB}` },
            { label: `Write the working equation to find ${nameC}'s amount:`, expectedAnswer: `${valB} - ${z} = ${valC}` },
            { label: `Write the working equation to find the total amount:`, expectedAnswer: `${valA} + ${valB} + ${valC} = ${total}` },
            { label: "Final Answer:", expectedAnswer: finalAnswer }
          ]
        }, null, 2);
      }

      if (isMCQ) {
        const d1 = valC.toString();
        const d2 = valB.toString();
        const d3 = (valA + valB).toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "STOPPED_AT_ENTITY_C" },
          { val: d2, defect: "STOPPED_AT_ENTITY_B" },
          { val: d3, defect: "PARTIAL_WORKING_TWO_ENTITIES_ONLY" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: Find ${nameB}'s amount: ${valA.toLocaleString()} + ${y.toLocaleString()} = ${valB.toLocaleString()}.\\nStep 2: Find ${nameC}'s amount: ${valB.toLocaleString()} - ${z.toLocaleString()} = ${valC.toLocaleString()}.\\nStep 3: Add all three amounts together: ${valA.toLocaleString()} + ${valB.toLocaleString()} + ${valC.toLocaleString()} = ${total.toLocaleString()}.`;
      hint = `First find ${nameB}'s amount by adding to ${nameA}'s amount. Then find ${nameC}'s amount. Finally, add all three together!`;

    } else {
      promptInstruction = `- Question stem: "${nameA} has ${valA.toLocaleString()} ${item}. ${nameB} has ${y.toLocaleString()} more ${item} than ${nameA}. ${nameC} has ${z.toLocaleString()} fewer ${item} than ${nameB}. How many ${item} does ${nameC} have?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find ${nameB}'s amount:`, expectedAnswer: `${valA} + ${y} = ${valB}` },
            { label: `Write the working equation to find ${nameC}'s amount:`, expectedAnswer: `${valB} - ${z} = ${valC}` },
            { label: "Final Answer:", expectedAnswer: finalAnswer }
          ]
        }, null, 2);
      }

      if (isMCQ) {
        const d1 = valB.toString();
        const d2 = (valA - z > 0 ? valA - z : valA + z).toString();
        const d3 = (valB + z).toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "PARTIAL_WORKING_STEP_ONE_ONLY" },
          { val: d2, defect: "RELATION_MISATTRIBUTION" },
          { val: d3, defect: "WRONG_OPERATION_ADD" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: Find ${nameB}'s amount: ${valA.toLocaleString()} + ${y.toLocaleString()} = ${valB.toLocaleString()}.\\nStep 2: Find ${nameC}'s amount: ${valB.toLocaleString()} - ${z.toLocaleString()} = ${valC.toLocaleString()}.`;
      hint = `Find ${nameB}'s amount first by adding to ${nameA}'s amount. Then subtract to find ${nameC}'s amount!`;
    }
  }

  const mcqInstruction = isMCQ ? `- Generate EXACTLY 4 options: ${JSON.stringify(options)}.\\n- Set defectMap to: ${JSON.stringify(defectMap)}.` : "";

  const aiPrompt = `You are an expert Singapore Primary 4 Math educator.
Generate a standard-level question for Singapore Primary 4 students.
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

  return { aiPrompt };
}
