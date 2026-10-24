import { getRandomNames } from '../../../../../utils/variable-bank.js';

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

export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions) {
  let promptInstruction = "";
  let finalAnswer = "";
  let options = [];
  let defectMap = {};
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let solutionSteps = "";
  let hint = "";

  const itemsPool = ["game cards", "stickers", "stamps", "points", "tokens", "books", "erasers"];
  const randomItem = itemsPool[Math.floor(Math.random() * itemsPool.length)];

  // Legacy aliases support
  const legacyAliases = {
    'foundation_compare_greater_ten_thousands': 'foundation_compare_two_numbers',
    'foundation_compare_smaller_ten_thousands': 'foundation_compare_two_numbers',
    'foundation_compare_greater_thousands': 'foundation_compare_two_numbers',
    'foundation_compare_smaller_thousands': 'foundation_compare_two_numbers',
    'foundation_compare_hundreds_tens': 'foundation_compare_two_numbers'
  };
  if (legacyAliases[activeVariant]) {
    activeVariant = legacyAliases[activeVariant];
  }

  const allFoundationVariants = [
    'foundation_compare_two_numbers',
    'foundation_difference_deduction',
    'foundation_number_line_reading',
    'foundation_place_value_step_shifts',
    'foundation_extreme_sorting_digit_cards',
    'foundation_three_entity_extrema'
  ];

  if (!activeVariant || activeVariant === 'foundation_default' || activeVariant === 'default' || !allFoundationVariants.includes(activeVariant)) {
    activeVariant = allFoundationVariants[Math.floor(Math.random() * allFoundationVariants.length)];
  }

  // --------------------------------------------------------------------------
  // VARIANT 1: foundation_compare_two_numbers (Direct Comparisons)
  // --------------------------------------------------------------------------
  if (activeVariant === 'foundation_compare_two_numbers') {
    const categoryChoice = Math.floor(Math.random() * 5);
    let num1 = 0;
    let num2 = 0;
    let diffPlaceName = "";
    let stepExplanation = "";

    if (categoryChoice === 0) {
      diffPlaceName = "ten thousands";
      const tth1 = Math.floor(Math.random() * 9) + 1;
      let tth2 = Math.floor(Math.random() * 9) + 1;
      while (tth2 === tth1) tth2 = Math.floor(Math.random() * 9) + 1;
      num1 = tth1 * 10000 + Math.floor(Math.random() * 10000);
      num2 = tth2 * 10000 + Math.floor(Math.random() * 10000);
      const maxTth = Math.max(tth1, tth2);
      const minTth = Math.min(tth1, tth2);
      stepExplanation = `Compare the ten thousands digits: ${maxTth} ten thousands is greater than ${minTth} ten thousands.`;
    } else if (categoryChoice === 1) {
      diffPlaceName = "thousands";
      const tth = Math.floor(Math.random() * 9) + 1;
      const th1 = Math.floor(Math.random() * 10);
      let th2 = Math.floor(Math.random() * 10);
      while (th2 === th1) th2 = Math.floor(Math.random() * 10);
      num1 = tth * 10000 + th1 * 1000 + Math.floor(Math.random() * 1000);
      num2 = tth * 10000 + th2 * 1000 + Math.floor(Math.random() * 1000);
      const maxTh = Math.max(th1, th2);
      const minTh = Math.min(th1, th2);
      stepExplanation = `Both numbers have the same ten thousands digit (${tth}). Compare the thousands digits: ${maxTh} thousands is greater than ${minTh} thousands.`;
    } else if (categoryChoice === 2) {
      diffPlaceName = "hundreds";
      const tth = Math.floor(Math.random() * 9) + 1;
      const th = Math.floor(Math.random() * 10);
      const h1 = Math.floor(Math.random() * 10);
      let h2 = Math.floor(Math.random() * 10);
      while (h2 === h1) h2 = Math.floor(Math.random() * 10);
      num1 = tth * 10000 + th * 1000 + h1 * 100 + Math.floor(Math.random() * 100);
      num2 = tth * 10000 + th * 1000 + h2 * 100 + Math.floor(Math.random() * 100);
      const maxH = Math.max(h1, h2);
      const minH = Math.min(h1, h2);
      stepExplanation = `Both numbers have the same ten thousands (${tth}) and thousands (${th}) digits. Compare the hundreds digits: ${maxH} hundreds is greater than ${minH} hundreds.`;
    } else if (categoryChoice === 3) {
      diffPlaceName = "tens";
      const tth = Math.floor(Math.random() * 9) + 1;
      const th = Math.floor(Math.random() * 10);
      const h = Math.floor(Math.random() * 10);
      const t1 = Math.floor(Math.random() * 10);
      let t2 = Math.floor(Math.random() * 10);
      while (t2 === t1) t2 = Math.floor(Math.random() * 10);
      const o1 = Math.floor(Math.random() * 10);
      const o2 = Math.floor(Math.random() * 10);
      num1 = tth * 10000 + th * 1000 + h * 100 + t1 * 10 + o1;
      num2 = tth * 10000 + th * 1000 + h * 100 + t2 * 10 + o2;
      const maxT = Math.max(t1, t2);
      const minT = Math.min(t1, t2);
      stepExplanation = `Both numbers have identical digits in the ten thousands, thousands, and hundreds places. Compare the tens digits: ${maxT} tens is greater than ${minT} tens.`;
    } else {
      diffPlaceName = "ten thousands";
      num1 = Math.floor(Math.random() * 90000) + 10000;
      num2 = Math.floor(Math.random() * 9000) + 1000;
      stepExplanation = `Compare the number of digits: ${Math.max(num1, num2)} is a 5-digit number, while ${Math.min(num1, num2)} is a 4-digit number. A 5-digit number is always greater than a 4-digit number.`;
    }

    const askType = Math.random() < 0.5 ? "greater" : "smaller";
    const isGreater = askType === "greater";
    const presentedNumbers = Math.random() < 0.5 ? [num1, num2] : [num2, num1];
    const greaterNum = Math.max(num1, num2);
    const smallerNum = Math.min(num1, num2);
    const targetNum = isGreater ? greaterNum : smallerNum;
    const otherNum = isGreater ? smallerNum : greaterNum;

    visualEngineStr = JSON.stringify({
      componentToRender: "NUMBER_CARDS",
      componentData: {
        items: [presentedNumbers[0].toString(), presentedNumbers[1].toString()]
      }
    }, null, 2);

    if (isMCQ) {
      const mcqSubtype = Math.floor(Math.random() * 3);
      if (mcqSubtype === 0) {
        const correctStmt = `${greaterNum} is greater than ${smallerNum}`;
        const wrongStmt1 = `${smallerNum} is greater than ${greaterNum}`;
        const wrongStmt2 = `${greaterNum} is smaller than ${smallerNum}`;
        const wrongStmt3 = `${presentedNumbers[0]} is equal to ${presentedNumbers[1]}`;

        finalAnswer = correctStmt;
        options = [correctStmt, wrongStmt1, wrongStmt2, wrongStmt3].sort(() => Math.random() - 0.5);
        defectMap = {
          [wrongStmt1]: "OPPOSITE_CONDITION_GREATER",
          [wrongStmt2]: "OPPOSITE_CONDITION_SMALLER",
          [wrongStmt3]: "CONSTANT_VIOLATION"
        };
        promptInstruction = `- Question stem: "Look at the two numbers: ${presentedNumbers[0]} and ${presentedNumbers[1]}. Which statement is correct?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;
      } else if (mcqSubtype === 1) {
        const symbolAnswer = presentedNumbers[0] > presentedNumbers[1] ? ">" : "<";
        const wrongSymbol = presentedNumbers[0] > presentedNumbers[1] ? "<" : ">";
        finalAnswer = symbolAnswer;
        options = [">", "<", "=", "None of the above"];
        defectMap = {
          [wrongSymbol]: "REVERSED_INEQUALITY",
          "=": "CONSTANT_VIOLATION",
          "None of the above": "MISREAD_QUESTION"
        };
        promptInstruction = `- Question stem: "Which symbol correctly completes the number sentence?\\n${presentedNumbers[0]} [ ? ] ${presentedNumbers[1]}"\\n- The finalAnswer must be strictly "${finalAnswer}".`;
      } else {
        finalAnswer = targetNum.toString();
        const d1 = otherNum.toString();
        const d2 = "Both numbers are equal";
        const d3 = "Cannot be determined";
        options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
        defectMap = {
          [d1]: isGreater ? "OPPOSITE_CONDITION_SMALLER" : "OPPOSITE_CONDITION_GREATER",
          [d2]: "CONSTANT_VIOLATION",
          [d3]: "MISREAD_QUESTION"
        };
        promptInstruction = `- Question stem: "Which number is ${askType}, ${presentedNumbers[0]} or ${presentedNumbers[1]}?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;
      }
    } else if (isStructure) {
      finalAnswer = targetNum.toString();
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          {
            label: "Which place value has different digits that determine which number is greater? (ten thousands, thousands, hundreds, tens, ones)",
            expectedAnswer: diffPlaceName
          },
          {
            label: `Which number is ${askType}?`,
            expectedAnswer: finalAnswer
          }
        ]
      }, null, 2);
      promptInstruction = `- Question stem: "Compare the two numbers: ${presentedNumbers[0]} and ${presentedNumbers[1]}. Which number is ${askType}?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;
    } else {
      const shortSubtype = Math.floor(Math.random() * 2);
      if (shortSubtype === 0) {
        finalAnswer = targetNum.toString();
        promptInstruction = `- Question stem: "Which number is ${askType}, ${presentedNumbers[0]} or ${presentedNumbers[1]}?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;
      } else {
        finalAnswer = presentedNumbers[0] > presentedNumbers[1] ? ">" : "<";
        promptInstruction = `- Question stem: "Write > or < in the blank to make the statement true:\\n${presentedNumbers[0]} _____ ${presentedNumbers[1]}"\\n- The finalAnswer must be strictly "${finalAnswer}".`;
      }
    }

    solutionSteps = `Step 1: Compare ${presentedNumbers[0]} and ${presentedNumbers[1]} from left to right starting from the highest place value.\\nStep 2: ${stepExplanation}\\nStep 3: Conclude that ${greaterNum} > ${smallerNum}, so the ${askType} number is ${targetNum}.`;
    hint = "Compare the digits starting from the highest place value (the leftmost digit). The first digit from the left that is different tells you which number is greater or smaller!";

  // --------------------------------------------------------------------------
  // VARIANT 2: foundation_difference_deduction (Bar Model Comparison)
  // --------------------------------------------------------------------------
  } else if (activeVariant === 'foundation_difference_deduction') {
    let [nameA, nameB] = getRandomNames(2);
    while (nameA.toLowerCase().includes(nameB.toLowerCase()) || nameB.toLowerCase().includes(nameA.toLowerCase())) {
      [nameA, nameB] = getRandomNames(2);
    }
    const subType = Math.floor(Math.random() * 3); // 0: find diff, 1: find larger, 2: find smaller

    const base = (Math.floor(Math.random() * 50) + 20) * 1000 + (Math.floor(Math.random() * 9) * 100);
    const diff = (Math.floor(Math.random() * 20) + 4) * 1000 + (Math.floor(Math.random() * 9) * 100);
    const smaller = base;
    const larger = base + diff;

    if (subType === 0) {
      // Find difference z given x and y
      finalAnswer = diff.toString();
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL_COMPARISON",
        componentData: {
          modelType: "BAR_MODEL_COMPARISON",
          bars: [
            { name: nameA, value: larger, layoutSize: larger, displayValue: larger.toLocaleString() },
            { name: nameB, value: smaller, layoutSize: smaller, displayValue: smaller.toLocaleString() }
          ],
          difference: { displayValue: "?" },
          hiddenValues: ["difference"]
        }
      }, null, 2);

      promptInstruction = `- Question stem: "${nameA} has ${larger.toLocaleString()} ${randomItem}. ${nameB} has ${smaller.toLocaleString()} ${randomItem}. What is the difference between the number of ${randomItem} they have?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Write the working equation to find the difference:", expectedAnswer: `${larger} - ${smaller} = ${diff}` },
            { label: "Final Answer:", expectedAnswer: finalAnswer }
          ]
        }, null, 2);
      }

      if (isMCQ) {
        const d1 = (larger + smaller).toString();
        const d2 = (diff + 1000).toString();
        const d3 = (diff - 1000 > 0 ? diff - 1000 : diff + 2000).toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "WRONG_OPERATION_ADD" },
          { val: d2, defect: "CARELESS_CALCULATION" },
          { val: d3, defect: "CARELESS_CALCULATION" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: Identify ${nameA}'s amount (${larger.toLocaleString()}) and ${nameB}'s amount (${smaller.toLocaleString()}).\\nStep 2: Subtract ${nameB}'s amount from ${nameA}'s amount: ${larger} - ${smaller} = ${diff}.\\nStep 3: The difference is ${diff.toLocaleString()}.`;
      hint = "To find the difference between two quantities, subtract the smaller number from the larger number!";

    } else if (subType === 1) {
      // Given smaller and difference, find larger
      finalAnswer = larger.toString();
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL_COMPARISON",
        componentData: {
          modelType: "BAR_MODEL_COMPARISON",
          bars: [
            { name: nameA, value: "?", layoutSize: larger, displayValue: "?" },
            { name: nameB, value: smaller, layoutSize: smaller, displayValue: smaller.toLocaleString() }
          ],
          difference: { displayValue: diff.toLocaleString() },
          hiddenValues: [nameA]
        }
      }, null, 2);

      promptInstruction = `- Question stem: "${nameB} has ${smaller.toLocaleString()} ${randomItem}. ${nameA} has ${diff.toLocaleString()} more ${randomItem} than ${nameB}. How many ${randomItem} does ${nameA} have?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find ${nameA}'s amount:`, expectedAnswer: `${smaller} + ${diff} = ${larger}` },
            { label: "Final Answer:", expectedAnswer: finalAnswer }
          ]
        }, null, 2);
      }

      if (isMCQ) {
        const d1 = (smaller - diff > 0 ? smaller - diff : smaller + 2 * diff).toString();
        const d2 = (larger + 1000).toString();
        const d3 = (larger - 1000).toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "WRONG_OPERATION_SUBTRACT" },
          { val: d2, defect: "CARELESS_CALCULATION" },
          { val: d3, defect: "CARELESS_CALCULATION" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: ${nameB} has ${smaller.toLocaleString()} ${randomItem}.\\nStep 2: ${nameA} has ${diff.toLocaleString()} more than ${nameB}, so add: ${smaller} + ${diff} = ${larger}.\\nStep 3: Therefore, ${nameA} has ${larger.toLocaleString()} ${randomItem}.`;
      hint = "When someone has MORE than another person, add the difference to the smaller amount!";

    } else {
      // Given larger and difference, find smaller
      finalAnswer = smaller.toString();
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL_COMPARISON",
        componentData: {
          modelType: "BAR_MODEL_COMPARISON",
          bars: [
            { name: nameA, value: larger, layoutSize: larger, displayValue: larger.toLocaleString() },
            { name: nameB, value: "?", layoutSize: smaller, displayValue: "?" }
          ],
          difference: { displayValue: diff.toLocaleString() },
          hiddenValues: [nameB]
        }
      }, null, 2);

      promptInstruction = `- Question stem: "${nameA} has ${larger.toLocaleString()} ${randomItem}. ${nameB} has ${diff.toLocaleString()} fewer ${randomItem} than ${nameA}. How many ${randomItem} does ${nameB} have?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Write the working equation to find ${nameB}'s amount:`, expectedAnswer: `${larger} - ${diff} = ${smaller}` },
            { label: "Final Answer:", expectedAnswer: finalAnswer }
          ]
        }, null, 2);
      }

      if (isMCQ) {
        const d1 = (larger + diff).toString();
        const d2 = (smaller + 1000).toString();
        const d3 = (smaller - 1000).toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "WRONG_OPERATION_ADD" },
          { val: d2, defect: "CARELESS_CALCULATION" },
          { val: d3, defect: "CARELESS_CALCULATION" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: ${nameA} has ${larger.toLocaleString()} ${randomItem}.\\nStep 2: ${nameB} has ${diff.toLocaleString()} fewer than ${nameA}, so subtract: ${larger} - ${diff} = ${smaller}.\\nStep 3: Therefore, ${nameB} has ${smaller.toLocaleString()} ${randomItem}.`;
      hint = "When someone has FEWER than another person, subtract the difference from the larger amount!";
    }

  // --------------------------------------------------------------------------
  // VARIANT 3: foundation_number_line_reading (Fixed Interval Number Line)
  // --------------------------------------------------------------------------
  } else if (activeVariant === 'foundation_number_line_reading') {
    const stepChoices = [100, 500, 1000];
    const step = stepChoices[Math.floor(Math.random() * stepChoices.length)];
    const numIntervals = Math.floor(Math.random() * 3) + 4; // 4, 5, or 6 intervals

    const baseThousands = (Math.floor(Math.random() * 50) + 20) * 1000;
    const baseOffset = step === 500 ? (Math.random() < 0.5 ? 0 : 500) : (step === 100 ? (Math.floor(Math.random() * 9) * 100) : 0);
    const startVal = baseThousands + baseOffset;
    const endVal = startVal + numIntervals * step;

    // Pick target tick index between 2 and numIntervals - 1
    const targetIndex = Math.floor(Math.random() * (numIntervals - 2)) + 2;
    const targetVal = startVal + targetIndex * step;

    finalAnswer = targetVal.toString();

    visualEngineStr = JSON.stringify({
      componentToRender: "NUMBER_LINE_ADVANCED",
      componentData: {
        startValue: startVal,
        endValue: endVal,
        numIntervals: numIntervals,
        labeledPoints: [
          { index: 0, label: startVal.toLocaleString() },
          { index: 1, label: (startVal + step).toLocaleString() }
        ],
        targetPoint: targetIndex,
        markedLabel: "?"
      }
    }, null, 2);

    promptInstruction = `- Question stem: "Look at the number line below. Find the value represented by the question mark (? )."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Write the working equation to find the value of 1 interval step:", expectedAnswer: `${startVal + step} - ${startVal} = ${step}` },
          { label: "Write the working equation to find the missing number:", expectedAnswer: `${startVal} + ${targetIndex * step} = ${targetVal}` },
          { label: "Final Answer:", expectedAnswer: finalAnswer }
        ]
      }, null, 2);
    }

    if (isMCQ) {
      const d1 = (targetVal + step).toString();
      const d2 = (targetVal - step).toString();
      const wrongStep = step === 500 ? 1000 : (step === 100 ? 200 : 500);
      const d3 = (startVal + targetIndex * wrongStep).toString();
      const mcqRes = ensureFourUniqueOptions(finalAnswer, [
        { val: d1, defect: "STEP_COUNT_MISALIGNMENT_OVER" },
        { val: d2, defect: "STEP_COUNT_MISALIGNMENT_UNDER" },
        { val: d3, defect: "INTERVAL_CALCULATION_ERROR" }
      ], "INTERVAL_CALCULATION_ERROR");
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    }

    solutionSteps = `Step 1: Find the value of 1 interval step by subtracting two adjacent labeled points: ${startVal + step} - ${startVal} = ${step}.\\nStep 2: Count the number of steps from ${startVal.toLocaleString()} to the question mark: there are ${targetIndex} steps.\\nStep 3: Calculate the value: ${startVal} + (${targetIndex} × ${step}) = ${targetVal.toLocaleString()}.`;
    hint = "First, find the step size by subtracting the first labeled number from the second labeled number. Then count how many steps forward you need to go!";

  // --------------------------------------------------------------------------
  // VARIANT 4: foundation_place_value_step_shifts (Place Value Step Shifts)
  // --------------------------------------------------------------------------
  } else if (activeVariant === 'foundation_place_value_step_shifts') {
    const shiftTypes = [
      { unit: "thousands", values: [1000, 2000, 3000, 4000, 5000] },
      { unit: "hundreds", values: [200, 300, 400, 500, 600, 800] },
      { unit: "tens", values: [20, 30, 40, 50, 70] }
    ];
    const chosenType = shiftTypes[Math.floor(Math.random() * shiftTypes.length)];
    const shift = chosenType.values[Math.floor(Math.random() * chosenType.values.length)];

    const base = (Math.floor(Math.random() * 60) + 25) * 1000 + (Math.floor(Math.random() * 8) + 1) * 100 + (Math.floor(Math.random() * 8) + 1) * 10;
    const isMore = Math.random() < 0.5;
    const shifted = isMore ? base + shift : base - shift;

    const subType = Math.floor(Math.random() * 3);

    if (subType === 0) {
      // Type 1: "What is 3000 more than 78,450?"
      finalAnswer = shifted.toString();
      promptInstruction = `- Question stem: "What number is ${shift.toLocaleString()} ${isMore ? 'more' : 'less'} than ${base.toLocaleString()}?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Write the working equation:", expectedAnswer: `${base} ${isMore ? '+' : '-'} ${shift} = ${shifted}` },
            { label: "Final Answer:", expectedAnswer: finalAnswer }
          ]
        }, null, 2);
      }

      if (isMCQ) {
        const d1 = (isMore ? base - shift : base + shift).toString();
        const d2 = (isMore ? base + shift * 10 : Math.max(1000, base - shift * 10)).toString();
        const d3 = (shifted + 100).toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "OPPOSITE_OPERATION" },
          { val: d2, defect: "PLACE_VALUE_MISALIGNMENT" },
          { val: d3, defect: "CARELESS_CALCULATION" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: Start with ${base.toLocaleString()}.\\nStep 2: Since we need ${shift.toLocaleString()} ${isMore ? 'more' : 'less'}, ${isMore ? 'add' : 'subtract'}: ${base} ${isMore ? '+' : '-'} ${shift} = ${shifted}.\\nStep 3: The answer is ${shifted.toLocaleString()}.`;
      hint = `Notice which place value is changing (${chosenType.unit}). Keep the other digits unchanged!`;

    } else if (subType === 1) {
      // Type 2: "81,450 is ____ more than 78,450."
      finalAnswer = shift.toString();
      promptInstruction = `- Question stem: "${shifted.toLocaleString()} is _____ ${isMore ? 'more' : 'less'} than ${base.toLocaleString()}."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Write the working equation to find the difference:", expectedAnswer: `${Math.max(shifted, base)} - ${Math.min(shifted, base)} = ${shift}` },
            { label: "Final Answer:", expectedAnswer: finalAnswer }
          ]
        }, null, 2);
      }

      if (isMCQ) {
        const d1 = (shift * 10).toString();
        const d2 = (Math.max(10, Math.floor(shift / 10))).toString();
        const d3 = (shift + 100).toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "PLACE_VALUE_MISALIGNMENT" },
          { val: d2, defect: "PLACE_VALUE_MISALIGNMENT" },
          { val: d3, defect: "CARELESS_CALCULATION" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: Compare the two numbers: ${shifted.toLocaleString()} and ${base.toLocaleString()}.\\nStep 2: Find the difference: ${Math.max(shifted, base)} - ${Math.min(shifted, base)} = ${shift}.\\nStep 3: Therefore, ${shifted.toLocaleString()} is ${shift.toLocaleString()} ${isMore ? 'more' : 'less'} than ${base.toLocaleString()}.`;
      hint = "Subtract the smaller number from the larger number to find by how much the value shifted!";

    } else {
      // Type 3: "____ is 3000 less than 81,450."
      finalAnswer = shifted.toString();
      promptInstruction = `- Question stem: "_____ is ${shift.toLocaleString()} ${isMore ? 'more' : 'less'} than ${base.toLocaleString()}."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Write the working equation:", expectedAnswer: `${base} ${isMore ? '+' : '-'} ${shift} = ${shifted}` },
            { label: "Final Answer:", expectedAnswer: finalAnswer }
          ]
        }, null, 2);
      }

      if (isMCQ) {
        const d1 = (isMore ? base - shift : base + shift).toString();
        const d2 = (isMore ? base + shift * 10 : Math.max(1000, base - shift * 10)).toString();
        const d3 = (shifted + 100).toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "OPPOSITE_OPERATION" },
          { val: d2, defect: "PLACE_VALUE_MISALIGNMENT" },
          { val: d3, defect: "CARELESS_CALCULATION" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: Start with ${base.toLocaleString()}.\\nStep 2: Calculate ${shift.toLocaleString()} ${isMore ? 'more' : 'less'}: ${base} ${isMore ? '+' : '-'} ${shift} = ${shifted}.\\nStep 3: The missing number is ${shifted.toLocaleString()}.`;
      hint = `Identify which digit position (${chosenType.unit}) is changing, and ${isMore ? 'add' : 'subtract'} that amount.`;
    }

  // --------------------------------------------------------------------------
  // VARIANT 5: foundation_extreme_sorting_digit_cards (Digit Cards Extreme Sorting)
  // --------------------------------------------------------------------------
  } else if (activeVariant === 'foundation_extreme_sorting_digit_cards') {
    const nonZeroPool = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5).slice(0, 4);
    const digits = [0, ...nonZeroPool]; // Always contains '0'
    const shuffledDigits = [...digits].sort(() => Math.random() - 0.5);

    const isGreatest = Math.random() < 0.5;

    const nonZerosSorted = [...nonZeroPool].sort((a, b) => a - b);
    const sortedDesc = [...digits].sort((a, b) => b - a);

    if (isGreatest) {
      finalAnswer = sortedDesc.join('');
    } else {
      // Smallest: first digit cannot be 0!
      const firstDigit = nonZerosSorted[0];
      const remaining = [0, ...nonZerosSorted.slice(1)].sort((a, b) => a - b);
      finalAnswer = [firstDigit, ...remaining].join('');
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "DIGIT_CARD_SORTER",
      componentData: {
        digits: shuffledDigits,
        condition: isGreatest ? "greatest" : "smallest"
      }
    }, null, 2);

    promptInstruction = `- Question stem: "Use all the digit cards below to form the ${isGreatest ? 'greatest' : 'smallest'} 5-digit number. Each card can only be used once.\\nCards: [ ${shuffledDigits.join(' ]  [ ')} ]"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: `Form the required ${isGreatest ? 'greatest' : 'smallest'} 5-digit number:`, expectedAnswer: finalAnswer }
        ]
      }, null, 2);
    }

    if (isMCQ) {
      const oppositeAns = isGreatest
        ? [nonZerosSorted[0], 0, ...nonZerosSorted.slice(1)].join('')
        : sortedDesc.join('');
      const leadingZeroDistractor = [0, ...nonZerosSorted].join(''); // 0xxxx misconception
      const swappedDigits = finalAnswer.slice(0, 3) + finalAnswer[4] + finalAnswer[3];

      const mcqRes = ensureFourUniqueOptions(finalAnswer, [
        { val: oppositeAns, defect: isGreatest ? "OPPOSITE_CONDITION_SMALLEST" : "OPPOSITE_CONDITION_GREATEST" },
        { val: leadingZeroDistractor, defect: "LEADING_ZERO_ERROR" },
        { val: swappedDigits, defect: "PARTIAL_ORDERING_ERROR" }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    }

    if (isGreatest) {
      solutionSteps = `Step 1: To form the greatest 5-digit number, arrange the digits in descending order from largest to smallest.\\nStep 2: The digits from greatest to smallest are: ${sortedDesc.join(', ')}.\\nStep 3: Combine them: ${finalAnswer}.`;
      hint = "To make the greatest number, place the largest digit in the ten thousands place, followed by the next largest, all the way to the ones place!";
    } else {
      solutionSteps = `Step 1: A 5-digit number cannot have 0 as its first digit (ten thousands place).\\nStep 2: Place the smallest non-zero digit (${nonZerosSorted[0]}) in the ten thousands place.\\nStep 3: Arrange the remaining digits (including 0) from smallest to greatest: ${[0, ...nonZerosSorted.slice(1)].join(', ')}.\\nStep 4: Combine them: ${finalAnswer}.`;
      hint = "Remember that a 5-digit number cannot start with 0! Use the smallest non-zero digit for the first position, then put 0 in the thousands place!";
    }

  // --------------------------------------------------------------------------
  // VARIANT 6: foundation_three_entity_extrema (Three-Entity Extrema Comparison)
  // --------------------------------------------------------------------------
  } else {
    let names = getRandomNames(3);
    while (new Set(names).size < 3 || names.some((n1, i) => names.some((n2, j) => i !== j && (n1.toLowerCase().includes(n2.toLowerCase()) || n2.toLowerCase().includes(n1.toLowerCase()))))) {
      names = getRandomNames(3);
    }
    const tth = Math.floor(Math.random() * 8) + 2; // 2..9
    const lead = tth * 10000;
    const thousands = Math.floor(Math.random() * 7) + 2;
    const h1 = Math.floor(Math.random() * 7) + 2;
    let h2 = Math.floor(Math.random() * 7) + 2;
    while (h2 === h1) h2 = Math.floor(Math.random() * 7) + 2;

    const val1 = lead + thousands * 1000 + h1 * 100 + Math.floor(Math.random() * 80) + 10;
    const val2 = lead + thousands * 1000 + h2 * 100 + Math.floor(Math.random() * 80) + 10;
    const val3 = lead + (thousands - 1) * 1000 + Math.floor(Math.random() * 800) + 100;

    const entities = [
      { name: names[0], val: val1 },
      { name: names[1], val: val2 },
      { name: names[2], val: val3 }
    ];

    const sortedEntities = [...entities].sort((a, b) => b.val - a.val);
    const maxE = sortedEntities[0];
    const midE = sortedEntities[1];
    const minE = sortedEntities[2];

    const subType = Math.floor(Math.random() * 3);
    let labelA = "";
    let labelB = "";
    let highVal = 0;
    let lowVal = 0;
    let highName = "";
    let lowName = "";

    if (subType === 0) {
      labelA = "greatest";
      labelB = "smallest";
      highVal = maxE.val;
      lowVal = minE.val;
      highName = maxE.name;
      lowName = minE.name;
    } else if (subType === 1) {
      labelA = "greatest";
      labelB = "middle";
      highVal = maxE.val;
      lowVal = midE.val;
      highName = maxE.name;
      lowName = midE.name;
    } else {
      labelA = "middle";
      labelB = "smallest";
      highVal = midE.val;
      lowVal = minE.val;
      highName = midE.name;
      lowName = minE.name;
    }

    const diff = highVal - lowVal;
    finalAnswer = diff.toString();

    visualEngineStr = JSON.stringify({
      componentToRender: "NUMBER_CARDS",
      componentData: {
        items: [
          { label: entities[0].name, value: entities[0].val.toLocaleString() },
          { label: entities[1].name, value: entities[1].val.toLocaleString() },
          { label: entities[2].name, value: entities[2].val.toLocaleString() }
        ]
      }
    }, null, 2);

    promptInstruction = `- Question stem: "The cards show the number of ${randomItem} collected by three students:\\n- ${entities[0].name}: ${entities[0].val.toLocaleString()} ${randomItem}\\n- ${entities[1].name}: ${entities[1].val.toLocaleString()} ${randomItem}\\n- ${entities[2].name}: ${entities[2].val.toLocaleString()} ${randomItem}\\n\\nWhat is the difference between the ${labelA} and ${labelB} number of ${randomItem}?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: `Write the working equation to find the difference between the ${labelA} and ${labelB} amounts:`, expectedAnswer: `${highVal} - ${lowVal} = ${diff}` },
          { label: "Final Answer:", expectedAnswer: finalAnswer }
        ]
      }, null, 2);
    }

    if (isMCQ) {
      const wrongPair1 = subType === 0 ? maxE.val - midE.val : maxE.val - minE.val;
      const wrongPair2 = subType === 2 ? maxE.val - midE.val : midE.val - minE.val;
      const d1 = wrongPair1.toString();
      const d2 = wrongPair2.toString();
      const d3 = (diff + 100).toString();

      const mcqRes = ensureFourUniqueOptions(finalAnswer, [
        { val: d1, defect: "WRONG_PAIR_SELECTED" },
        { val: d2, defect: "WRONG_PAIR_SELECTED" },
        { val: d3, defect: "CARELESS_CALCULATION" }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    }

    solutionSteps = `Step 1: Compare the three amounts to order them from greatest to smallest: ${maxE.name} (${maxE.val.toLocaleString()}) > ${midE.name} (${midE.val.toLocaleString()}) > ${minE.name} (${minE.val.toLocaleString()}).\\nStep 2: The ${labelA} amount is ${highVal.toLocaleString()} (${highName}) and the ${labelB} amount is ${lowVal.toLocaleString()} (${lowName}).\\nStep 3: Subtract to find the difference: ${highVal} - ${lowVal} = ${diff}.`;
    hint = `First, compare the ten thousands and thousands digits to arrange all three numbers in order. Then subtract the ${labelB} value from the ${labelA} value!`;
  }

  const mcqInstruction = isMCQ ? `- Generate EXACTLY 4 options: ${JSON.stringify(options)}.\\n- Set defectMap to: ${JSON.stringify(defectMap)}.` : "";

  const aiPrompt = `You are an expert Singapore Primary 4 Math educator.
Generate a foundation-level question for Singapore Primary 4 students.
Topic: Whole Numbers - Numbers up to 100 000
Subtopic: Number Comparison and Ordering
Difficulty: ${zodDiff}
Type: ${zodType}

CRITICAL INSTRUCTIONS:
1. ${promptInstruction}
2. The finalAnswer must be strictly "${finalAnswer}".
${mcqInstruction}
3. Solution explanation:
   ${solutionSteps}
4. Hint: "${hint}"
5. Forbid using "STORY:" or any instructional prefix in the output.

${getFormatInstructions(visualEngineStr, inputRequirementStr)}`;

  return { aiPrompt };
}
