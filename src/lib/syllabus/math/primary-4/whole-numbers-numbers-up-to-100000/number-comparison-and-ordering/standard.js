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
  while (options.length < 4) {
    const fallback = `${finalAnswer} (Option ${counter})`;
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

  // 1. Direct key matching
  if (STANDARD_ORDER_VARIETIES[str]) {
    return str;
  }

  // 2. Colon or underscore delimited variety matching (e.g. 'standard_order_numbers:asc_diff_ten_thousands' or 'standard_order_numbers_asc_diff_ten_thousands')
  if (str.includes(':')) {
    const afterColon = str.split(':')[1].trim();
    if (STANDARD_ORDER_VARIETIES[afterColon]) return afterColon;
  }
  for (const key of Object.keys(STANDARD_ORDER_VARIETIES)) {
    if (str.endsWith(`_${key}`) || str.endsWith(`:${key}`)) {
      return key;
    }
  }

  // 3. Legacy full variant names
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

  // 4. Variety index/numbers (e.g. 'variety_1', 'v1', '1')
  if (str === 'variety_1' || str === 'v1' || str === '1') return 'asc_diff_ten_thousands';
  if (str === 'variety_2' || str === 'v2' || str === '2') return 'desc_diff_ten_thousands';
  if (str === 'variety_3' || str === 'v3' || str === '3') return 'asc_same_ten_thousands';
  if (str === 'variety_4' || str === 'v4' || str === '4') return 'desc_same_ten_thousands';
  if (str === 'variety_5' || str === 'v5' || str === '5') return 'mixed_digits';

  // 5. Semantic substrings
  if (str.includes('diff') && str.includes('asc')) return 'asc_diff_ten_thousands';
  if (str.includes('diff') && str.includes('desc')) return 'desc_diff_ten_thousands';
  if (str.includes('same') && str.includes('asc')) return 'asc_same_ten_thousands';
  if (str.includes('same') && str.includes('desc')) return 'desc_same_ten_thousands';
  if (str.includes('mixed')) return 'mixed_digits';

  // 6. Default fallback: Pick randomly from the 5 varieties
  const keys = Object.keys(STANDARD_ORDER_VARIETIES);
  return keys[Math.floor(Math.random() * keys.length)];
}

export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, explicitVariety = null) {
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
  const finalAnswer = sortedNumbers.join(", ");

  let presentedNumbers = [...numbers].sort(() => Math.random() - 0.5);
  // Ensure presented numbers are not already in the sorted order
  if (presentedNumbers.join(", ") === finalAnswer) {
    presentedNumbers.reverse();
  }

  const visualEngineStr = JSON.stringify({
    componentToRender: "NUMBER_CARDS",
    componentData: {
      items: presentedNumbers.map(n => n.toString())
    }
  }, null, 2);

  const promptInstruction = `- Question stem: "Arrange the numbers in order, beginning with the ${askType}:\\n${presentedNumbers.join(', ')}"\\n- The numbers are: ${presentedNumbers.join(', ')}.\\n- The finalAnswer must be strictly "${finalAnswer}".`;

  let options = [];
  let defectMap = {};

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
      {
        val: reverseOrder,
        defect: isAscending ? "REVERSE_ORDER_GREATEST" : "REVERSE_ORDER_SMALLEST"
      },
      {
        val: swap01.join(", "),
        defect: "PARTIAL_SORT_ERROR"
      },
      {
        val: swap23.join(", "),
        defect: "PARTIAL_SORT_ERROR"
      },
      {
        val: swap12.join(", "),
        defect: "PARTIAL_SORT_ERROR"
      },
      {
        val: swap03.join(", "),
        defect: "CARELESS_CALCULATION"
      }
    ];

    const mcqRes = ensureFourUniqueOptions(finalAnswer, rawDistractors);
    options = mcqRes.options;
    defectMap = mcqRes.defectMap;
  }

  let inputRequirementStr = null;
  if (isStructure) {
    inputRequirementStr = JSON.stringify({
      inputType: "MULTI_STEP_INPUT",
      steps: [
        {
          label: `Which is the ${askType} number?`,
          expectedAnswer: sortedNumbers[0].toString()
        },
        {
          label: `Which is the ${oppositeType} number?`,
          expectedAnswer: sortedNumbers[3].toString()
        },
        {
          label: `Arrange all 4 numbers in order, beginning with the ${askType} (separate numbers with a comma):`,
          expectedAnswer: finalAnswer
        }
      ]
    }, null, 2);
  }

  let solutionSteps = "";
  let hint = "";

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
    // mixed_digits
    solutionSteps = `Step 1: Count the digits in each number. A 4-digit number is always smaller than a 5-digit number.\\nStep 2: Compare the 4-digit numbers by looking at their highest place value.\\nStep 3: Compare the 5-digit numbers by looking at their ten thousands and thousands digits.\\nStep 4: Arrange all 4 numbers in order, beginning with the ${askType}: ${finalAnswer}.`;
    hint = `Count the number of digits in each number first. Remember that 4-digit numbers are always smaller than 5-digit numbers!`;
  }

  const mcqInstruction = isMCQ ? `- Generate EXACTLY 4 options: ${JSON.stringify(options)}.\\n- Set defectMap to: ${JSON.stringify(defectMap)}.` : "";

  const aiPrompt = `You are an expert Singapore Primary 4 Math educator.
Generate a standard-level question for Singapore Primary 4 students.
Topic: Whole Numbers - Numbers up to 100 000
Subtopic: Number Comparison and Ordering
Difficulty: ${zodDiff}
Type: ${zodType}
Variant: standard_order_numbers
Variety: ${variety} (${STANDARD_ORDER_VARIETIES[variety]})

CRITICAL INSTRUCTIONS:
1. ${promptInstruction}
2. The finalAnswer must be strictly "${finalAnswer}".
${mcqInstruction}
3. Provide step-by-step solution steps separated by \\n:
${solutionSteps}
4. Provide a helpful conceptual hint:
"${hint}"
5. Forbid using "STORY:" or any instructional prefix in the output.

${getFormatInstructions(visualEngineStr, inputRequirementStr, 'standard_order_numbers')}`;

  return { aiPrompt };
}
