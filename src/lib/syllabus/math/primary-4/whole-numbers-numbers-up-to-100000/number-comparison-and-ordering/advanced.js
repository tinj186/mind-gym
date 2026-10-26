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

  // Ensure digit pool has 0, at least two evens, at least two odds for robust permutations
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
      const d1 = validNumbers[0].toString(); // smallest
      const d2 = validNumbers[validNumbers.length - 2].toString(); // second greatest
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
      const d1 = validNumbers[validNumbers.length - 1].toString(); // greatest
      const d2 = validNumbers[1].toString(); // second smallest
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
      const d1 = oddsList[oddsList.length - 1].toString(); // greatest odd
      const d2 = evensList[evensList.length - 2] ? evensList[evensList.length - 2].toString() : (maxEven - 2).toString();
      const d3 = evensList[0].toString(); // smallest even
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
      const d1 = evensList[0].toString(); // smallest even
      const d2 = oddsList[1] ? oddsList[1].toString() : (minOdd + 2).toString();
      const d3 = oddsList[oddsList.length - 1].toString(); // greatest odd
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

  const visualEngineStr = JSON.stringify({
    componentToRender: "DIGIT_CARD_SORTER",
    componentData: {
      digits: digits,
      condition: conditionLabel
    }
  }, null, 2);

  const mcqInstruction = isMCQ ? `- Generate EXACTLY 4 options: ${JSON.stringify(options)}.\\n- Set defectMap to: ${JSON.stringify(defectMap)}.` : "";

  const aiPrompt = `You are an expert Singapore Primary 4 Math educator.
Generate an advanced-level question for Singapore Primary 4 students.
Topic: Whole Numbers - Numbers up to 100 000
Subtopic: Number Comparison and Ordering
Difficulty: ${zodDiff}
Type: ${zodType}
Variant: advanced_form_numbers

CRITICAL INSTRUCTIONS:
1. ${promptInstruction}
2. The finalAnswer must be strictly "${finalAnswer}".
${mcqInstruction}
3. Provide step-by-step solution steps separated by \\n:
${solutionSteps}
4. Provide a helpful conceptual hint:
"${hint}"
5. Forbid using "STORY:" or any instructional prefix in the output.

${getFormatInstructions(visualEngineStr, inputRequirementStr, 'advanced_form_numbers')}`;

  return { aiPrompt };
}
