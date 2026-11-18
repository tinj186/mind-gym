import { getRandomNames, getRandomDivisibleObjects, getRandomCountableItems } from '../../../../../utils/variable-bank.js';

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
    const fallback = isNaN(numAnswer) ? `${finalAnswer} (${counter})` : (numAnswer + counter).toString();
    if (!options.includes(fallback)) {
      options.push(fallback);
      defectMap[fallback] = defaultDefect;
    }
    counter++;
  }

  return { options: options.sort(() => Math.random() - 0.5), defectMap };
}

function getFactors(num) {
  const fSet = new Set();
  for (let i = 1; i * i <= num; i++) {
    if (num % i === 0) {
      fSet.add(i);
      fSet.add(num / i);
    }
  }
  return Array.from(fSet).sort((a, b) => a - b);
}

function getFactorPairs(num) {
  const pairs = [];
  for (let i = 1; i * i <= num; i++) {
    if (num % i === 0) {
      pairs.push([i, num / i]);
    }
  }
  return pairs;
}

function getCountableItem() {
  const rawList = getRandomCountableItems(1);
  const raw = rawList && rawList[0] ? rawList[0] : null;
  const str = (typeof raw === 'string' ? raw : (raw?.item || raw?.name || 'pencil')).trim().toLowerCase();
  
  if (str.endsWith('ies')) {
    return { singular: str.slice(0, -3) + 'y', plural: str };
  }
  if (str.endsWith('s') && !str.endsWith('ss')) {
    return { singular: str.slice(0, -1), plural: str };
  }
  return { singular: str, plural: `${str}s` };
}

function makeDivisionAcceptedAnswers(dividend, divisor, quotient, remainder = 0) {
  const ans = [];
  const divOps = ['/', '÷'];
  if (remainder === 0) {
    for (const op of divOps) {
      ans.push(`${dividend} ${op} ${divisor} = ${quotient}`);
      ans.push(`${dividend}${op}${divisor}=${quotient}`);
      ans.push(`${dividend} ${op} ${divisor} = ${quotient} R 0`);
      ans.push(`${dividend} ${op} ${divisor} = ${quotient} r 0`);
      ans.push(`${dividend}${op}${divisor}=${quotient}R0`);
      ans.push(`${dividend}${op}${divisor}=${quotient}r0`);
      ans.push(`${quotient} = ${dividend} ${op} ${divisor}`);
      ans.push(`${quotient}=${dividend}${op}${divisor}`);
    }
  } else {
    for (const op of divOps) {
      ans.push(`${dividend} ${op} ${divisor} = ${quotient} R ${remainder}`);
      ans.push(`${dividend} ${op} ${divisor} = ${quotient} r ${remainder}`);
      ans.push(`${dividend}${op}${divisor}=${quotient}R${remainder}`);
      ans.push(`${dividend}${op}${divisor}=${quotient}r${remainder}`);
      ans.push(`${dividend} ${op} ${divisor} = ${quotient} remainder ${remainder}`);
      ans.push(`${quotient} R ${remainder} = ${dividend} ${op} ${divisor}`);
    }
  }
  return ans;
}

function makeMultiplicationAcceptedAnswers(a, b, prod) {
  const multOps = ['*', 'x', '×'];
  const ans = [];
  for (const op of multOps) {
    ans.push(`${a} ${op} ${b} = ${prod}`);
    ans.push(`${a}${op}${b}=${prod}`);
    ans.push(`${b} ${op} ${a} = ${prod}`);
    ans.push(`${b}${op}${a}=${prod}`);
    ans.push(`${prod} = ${a} ${op} ${b}`);
    ans.push(`${prod}=${a}${op}${b}`);
    ans.push(`${prod} = ${b} ${op} ${a}`);
    ans.push(`${prod}=${b}${op}${a}`);
  }
  return ans;
}

function makeSubtractionAcceptedAnswers(a, b, diff) {
  return [
    `${a} - ${b} = ${diff}`,
    `${a}-${b}=${diff}`,
    `${diff} = ${a} - ${b}`,
    `${diff}=${a}-${b}`
  ];
}

function makeAdditionAcceptedAnswers(a, b, sum) {
  return [
    `${a} + ${b} = ${sum}`,
    `${a}+${b}=${sum}`,
    `${b} + ${a} = ${sum}`,
    `${b}+${a}=${sum}`,
    `${sum} = ${a} + ${b}`,
    `${sum}=${a}+${b}`,
    `${sum} = ${b} + ${a}`,
    `${sum}=${b}+${a}`
  ];
}

function formatListVariations(arr) {
  const standard = arr.join(', ');
  const noSpace = arr.join(',');
  const andLast = arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];
  return [standard, noSpace, andLast];
}

function buildDigitClueScenarios() {
  const factors = [6, 7, 8, 9, 4];
  const scenarios = [];

  for (const X of factors) {
    const allMults = [];
    for (let m = 10; m < 100; m++) {
      if (m % X === 0) allMults.push(m);
    }

    // Range-bounded (width 35-40)
    for (let low = 10; low <= 60; low += 10) {
      const high = low + 40;
      if (high > 100) continue;

      const candidates = allMults.filter(m => m >= low && m <= high);
      if (candidates.length < 3 || candidates.length > 7) continue;

      // 1. DIGIT_SUM
      const sumMap = {};
      for (const m of candidates) {
        const s = Math.floor(m / 10) + (m % 10);
        if (!sumMap[s]) sumMap[s] = [];
        sumMap[s].push(m);
      }
      for (const s of Object.keys(sumMap)) {
        if (sumMap[s].length === 1) {
          scenarios.push({
            clueType: "DIGIT_SUM",
            X,
            hasRange: true,
            low,
            high,
            target: sumMap[s][0],
            clueValue: parseInt(s),
            candidates
          });
        }
      }

      // 2. DIGIT_DIFF
      const diffMap = {};
      for (const m of candidates) {
        const d = Math.abs(Math.floor(m / 10) - (m % 10));
        if (!diffMap[d]) diffMap[d] = [];
        diffMap[d].push(m);
      }
      for (const d of Object.keys(diffMap)) {
        if (diffMap[d].length === 1) {
          scenarios.push({
            clueType: "DIGIT_DIFF",
            X,
            hasRange: true,
            low,
            high,
            target: diffMap[d][0],
            clueValue: parseInt(d),
            candidates
          });
        }
      }

      // 3. DIGIT_PROD
      const prodMap = {};
      for (const m of candidates) {
        const p = Math.floor(m / 10) * (m % 10);
        if (!prodMap[p]) prodMap[p] = [];
        prodMap[p].push(m);
      }
      for (const p of Object.keys(prodMap)) {
        if (prodMap[p].length === 1) {
          scenarios.push({
            clueType: "DIGIT_PROD",
            X,
            hasRange: true,
            low,
            high,
            target: prodMap[p][0],
            clueValue: parseInt(p),
            candidates
          });
        }
      }
    }
  }

  // Full-range scenarios (for isShort / isMCQ)
  for (const X of [7, 8, 6, 9]) {
    const allMults = [];
    for (let m = 10; m < 100; m++) {
      if (m % X === 0) allMults.push(m);
    }
    const sumMap = {};
    for (const m of allMults) {
      const s = Math.floor(m / 10) + (m % 10);
      if (!sumMap[s]) sumMap[s] = [];
      sumMap[s].push(m);
    }
    for (const s of Object.keys(sumMap)) {
      if (sumMap[s].length === 1) {
        scenarios.push({
          clueType: "DIGIT_SUM",
          X,
          hasRange: false,
          low: 10,
          high: 100,
          target: sumMap[s][0],
          clueValue: parseInt(s),
          candidates: allMults
        });
      }
    }
  }

  return scenarios;
}

const DIGIT_CLUE_SCENARIOS = buildDigitClueScenarios();

const NO_ACCEPTED = ["No", "no", "NO", "None", "none", "NONE", "False", "false", "N"];

export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, explicitVariety = null) {
  let askText = "";
  let promptInstruction = "";
  let finalAnswer = "";
  let acceptedAnswers = [];
  let options = [];
  let defectMap = {};
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let solutionSteps = "";
  let hint = "";

  const effectiveVariant = activeVariant || 'advanced_shortfall_adjustment';

  // ==========================================================================
  // VARIANT 1: advanced_shortfall_adjustment (The Shortfall Adjustment)
  // ==========================================================================
  if (effectiveVariant === 'advanced_shortfall_adjustment') {
    const [name] = getRandomNames(1);
    const { singular: itemName, plural: itemPlural } = getCountableItem();

    const X = Math.floor(Math.random() * 4) + 6; // 6 to 9 (group size)
    const Q = Math.floor(Math.random() * 6) + 8; // 8 to 13
    const R = Math.floor(Math.random() * (X - 2)) + 1; // 1 to X-2 (remainder)
    const Y = X * Q + R; // 50 to 98
    const S = X - R; // Shortfall
    const nextMultiple = Y + S;

    finalAnswer = S.toString();
    acceptedAnswers = [finalAnswer, `${finalAnswer} ${itemPlural}`, `${finalAnswer} more`];

    const questionStem = `${name} has ${Y} ${itemPlural}. ${name} wants to pack them into equal boxes of ${X} with no ${itemPlural} left over. Since ${X} is not an exact factor of ${Y}, what is the smallest number of additional ${itemPlural} ${name} must add to complete the next box?${isStructure ? ' Show your working and the final answer.' : ''}`;
    askText = questionStem;

    visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;

    if (isMCQ) {
      const distractors = [
        { val: R.toString(), defect: "CONFUSED_REMAINDER_WITH_SHORTFALL" },
        { val: (S + 1).toString(), defect: "OFF_BY_ONE" },
        { val: X.toString(), defect: "CHOSE_DIVISOR" }
      ];
      const built = ensureFourUniqueOptions(finalAnswer, distractors);
      options = built.options;
      defectMap = built.defectMap;
    }

    if (isStructure) {
      const remWorkingExpected = `${Y} / ${X} = ${Q} R ${R}`;
      const remWorkingAccepted = makeDivisionAcceptedAnswers(Y, X, Q, R);
      const shortfallExpected = `${X} - ${R} = ${S}`;
      const shortfallAccepted = makeSubtractionAcceptedAnswers(X, R, S);

      const steps = [
        {
          label: `Write the working equation to find the remainder:`,
          expectedAnswer: remWorkingExpected,
          acceptedAnswers: remWorkingAccepted
        },
        {
          label: `Write the working equation to find how many more items are needed to complete the next group of ${X}:`,
          expectedAnswer: shortfallExpected,
          acceptedAnswers: shortfallAccepted
        },
        {
          label: `Final Answer:`,
          expectedAnswer: finalAnswer,
          acceptedAnswers: acceptedAnswers
        }
      ];

      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps }, null, 2);
    }

    solutionSteps = `1. Divide the total items by the group size: ${Y} ÷ ${X} = ${Q} R ${R}.\n2. There are ${R} items left over in the incomplete box.\n3. To complete the box of ${X}, calculate the shortfall: ${X} - ${R} = ${S}.\n4. Therefore, ${name} must add ${S} more ${itemPlural}.`;

    hint = `Divide ${Y} by ${X} to find the remainder. Subtract the remainder from ${X} to find how many more items are needed to make a full group!`;

    promptInstruction = `CRITICAL INSTRUCTIONS:
- Question stem must ask how many MORE ${itemPlural} are needed to reach the next multiple of ${X} from ${Y}.
- finalAnswer must be strictly "${finalAnswer}".`;
  }

  // ==========================================================================
  // VARIANT 2: advanced_common_factor_elimination (Common Factor Elimination)
  // ==========================================================================
  else if (effectiveVariant === 'advanced_common_factor_elimination') {
    const scenarios = [
      { Y1: 56, Y2: 84, K: 5, X: 7 }, // common 1-digit factors: 1, 2, 4, 7. Greater than 5 -> 7
      { Y1: 48, Y2: 72, K: 7, X: 8 }, // common 1-digit: 1, 2, 3, 4, 6, 8. Greater than 7 -> 8
      { Y1: 54, Y2: 90, K: 6, X: 9 }, // common 1-digit: 1, 2, 3, 6, 9. Greater than 6 -> 9
      { Y1: 45, Y2: 75, K: 4, X: 5 }, // common 1-digit: 1, 3, 5. Greater than 4 -> 5
      { Y1: 42, Y2: 70, K: 3, X: 7 }  // common 1-digit: 1, 2, 7. Greater than 3 -> 7
    ];

    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const { Y1, Y2, K, X } = scenario;

    const factors1 = getFactors(Y1).filter(f => f >= 1 && f <= 9);
    const factors2 = getFactors(Y2).filter(f => f >= 1 && f <= 9);

    finalAnswer = X.toString();
    acceptedAnswers = [finalAnswer];

    const questionStem = `A 1-digit number X is a factor of both ${Y1} and ${Y2}. If X is strictly greater than ${K}, find the value of X.`;
    askText = questionStem;

    if (!isStructure) {
      visualEngineStr = JSON.stringify({
        componentToRender: "FACTOR_RAINBOW",
        componentData: {
          targetNumber: Y1,
          factors: getFactors(Y1),
          pairs: getFactorPairs(Y1),
          title: `Factor Rainbow for ${Y1}`
        }
      }, null, 2);
    }

    if (isMCQ) {
      const distractors = [
        { val: (X - 1).toString(), defect: "SUBOPTIMAL_FACTOR" },
        { val: (X > 7 ? X - 2 : X + 1).toString(), defect: "COMMON_FACTOR_CALCULATION_ERROR" },
        { val: K.toString(), defect: "CHOSE_BOUNDARY_VALUE" }
      ];
      const built = ensureFourUniqueOptions(finalAnswer, distractors);
      options = built.options;
      defectMap = built.defectMap;
    }

    if (isStructure) {
      const f1Str = factors1.join(', ');
      const f1Variations = formatListVariations(factors1);
      const f2Str = factors2.join(', ');
      const f2Variations = formatListVariations(factors2);

      const steps = [
        {
          label: `List the 1-digit factors of ${Y1}:`,
          expectedAnswer: f1Str,
          acceptedAnswers: f1Variations
        },
        {
          label: `List the 1-digit factors of ${Y2}:`,
          expectedAnswer: f2Str,
          acceptedAnswers: f2Variations
        },
        {
          label: `Final Answer (The common factor greater than ${K}):`,
          expectedAnswer: finalAnswer,
          acceptedAnswers: [finalAnswer]
        }
      ];

      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps }, null, 2);
    }

    const commonFactors = factors1.filter(f => factors2.includes(f));
    solutionSteps = `1. List 1-digit factors of ${Y1}: ${factors1.join(', ')}.\n2. List 1-digit factors of ${Y2}: ${factors2.join(', ')}.\n3. Common 1-digit factors are: ${commonFactors.join(', ')}.\n4. Among these common factors, the only one greater than ${K} is ${X}.\n5. Therefore, X = ${X}.`;

    hint = `Find the 1-digit factors for both ${Y1} and ${Y2}. Compare them to find which common factor is greater than ${K}!`;

    promptInstruction = `CRITICAL INSTRUCTIONS:
- Question stem must state X is a factor of both ${Y1} and ${Y2}, and X > ${K}.
- finalAnswer must be strictly "${finalAnswer}".`;
  }

  // ==========================================================================
  // VARIANT 3: advanced_digit_clue_deduction (Digit Clue Deduction)
  // ==========================================================================
  else if (effectiveVariant === 'advanced_digit_clue_deduction') {
    // If structured, filter to range-bounded scenarios so the student lists only 3-7 numbers
    const validPool = isStructure
      ? DIGIT_CLUE_SCENARIOS.filter(s => s.hasRange)
      : DIGIT_CLUE_SCENARIOS;

    const item = validPool[Math.floor(Math.random() * validPool.length)];
    const { clueType, X, hasRange, low, high, target, clueValue, candidates } = item;

    finalAnswer = target.toString();
    acceptedAnswers = [finalAnswer];

    let cluePhrase = "";
    let stepLabel = "";
    let defectType = "INCORRECT_DIGIT_CLUE";
    let checkStr = (m) => "";

    if (clueType === "DIGIT_SUM") {
      cluePhrase = `the sum of its digits is ${clueValue}`;
      stepLabel = `Which multiple's digits add up to ${clueValue}?`;
      defectType = "INCORRECT_DIGIT_SUM";
      checkStr = (m) => `${Math.floor(m / 10)} + ${m % 10} = ${Math.floor(m / 10) + (m % 10)}`;
    } else if (clueType === "DIGIT_DIFF") {
      cluePhrase = `the difference between its two digits is ${clueValue}`;
      stepLabel = `Which multiple has a difference of ${clueValue} between its two digits?`;
      defectType = "INCORRECT_DIGIT_DIFFERENCE";
      checkStr = (m) => `${Math.max(Math.floor(m / 10), m % 10)} - ${Math.min(Math.floor(m / 10), m % 10)} = ${Math.abs(Math.floor(m / 10) - (m % 10))}`;
    } else if (clueType === "DIGIT_PROD") {
      cluePhrase = `the product of its digits is ${clueValue}`;
      stepLabel = `Which multiple's digits multiply to ${clueValue}?`;
      defectType = "INCORRECT_DIGIT_PRODUCT";
      checkStr = (m) => `${Math.floor(m / 10)} × ${m % 10} = ${Math.floor(m / 10) * (m % 10)}`;
    }

    if (hasRange) {
      askText = `A 2-digit whole number between ${low} and ${high} has ${X} as a factor, and ${cluePhrase}. What is the number?${isStructure ? ' Show your working and the final answer.' : ''}`;
    } else {
      askText = `A 2-digit whole number is less than 100. It has ${X} as a factor, and ${cluePhrase}. What is the number?${isStructure ? ' Show your working and the final answer.' : ''}`;
    }

    if (isMCQ) {
      const nonTarget = candidates.filter(c => c !== target);
      const distractors = nonTarget.slice(0, 3).map(c => ({
        val: c.toString(),
        defect: defectType
      }));
      if (distractors.length < 3) {
        const alt = target + X < 100 ? target + X : target - X;
        distractors.push({ val: alt.toString(), defect: defectType });
      }
      const built = ensureFourUniqueOptions(finalAnswer, distractors);
      options = built.options;
      defectMap = built.defectMap;
    }

    if (isStructure) {
      const multStr = candidates.join(', ');
      const multVariations = formatListVariations(candidates);
      multVariations.push(candidates.join(' '));

      const steps = [
        {
          label: `List the multiples of ${X}${hasRange ? ` between ${low} and ${high}` : ' that are 2-digit numbers'} (separated by commas):`,
          expectedAnswer: multStr,
          acceptedAnswers: multVariations
        },
        {
          label: stepLabel,
          expectedAnswer: finalAnswer,
          acceptedAnswers: [finalAnswer]
        }
      ];

      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps }, null, 2);
    }

    const verifications = candidates.map(m => {
      const isMatch = m === target;
      return `   • ${m}: ${checkStr(m)}${isMatch ? ` (Matches ${clueValue}!)` : ''}`;
    }).join('\n');

    solutionSteps = `1. List all multiples of ${X}${hasRange ? ` between ${low} and ${high}` : ' that are 2-digit numbers'}:\n   ${candidates.join(', ')}.\n2. Test each multiple against the digit clue (${cluePhrase}):\n${verifications}\n3. The only multiple that satisfies the clue is ${target}.\n4. Therefore, the required number is ${target}.`;

    hint = `List all multiples of ${X}${hasRange ? ` between ${low} and ${high}` : ' up to 100'}. Then check each multiple to see which one satisfies: ${cluePhrase}!`;

    promptInstruction = `CRITICAL INSTRUCTIONS:
- The questionText must be strictly: ${JSON.stringify(askText)}.
- finalAnswer must be strictly "${finalAnswer}".`;
  }

  // ==========================================================================
  // VARIANT 4: advanced_shared_remainder (The Shared Remainder)
  // ==========================================================================
  else if (effectiveVariant === 'advanced_shared_remainder') {
    const scenarios = [
      { A: 5, B: 6, Base: 30, R: 3, Y: 33, M1: 25, M2: 40 },
      { A: 4, B: 7, Base: 28, R: 2, Y: 30, M1: 22, M2: 38 },
      { A: 6, B: 8, Base: 24, R: 5, Y: 29, M1: 20, M2: 35 },
      { A: 5, B: 8, Base: 40, R: 3, Y: 43, M1: 35, M2: 50 },
      { A: 7, B: 9, Base: 63, R: 4, Y: 67, M1: 55, M2: 75 },
      { A: 6, B: 9, Base: 36, R: 5, Y: 41, M1: 30, M2: 48 }
    ];

    const item = scenarios[Math.floor(Math.random() * scenarios.length)];
    const { A, B, Base, R, Y, M1, M2 } = item;

    finalAnswer = Y.toString();
    acceptedAnswers = [finalAnswer];

    const questionStem = `When a whole number between ${M1} and ${M2} is divided by ${A}, it leaves a remainder of ${R}. When the same number is divided by ${B}, it also leaves a remainder of ${R}. What is the number?`;
    askText = questionStem;

    if (isMCQ) {
      const distractors = [
        { val: Base.toString(), defect: "FORGOT_TO_ADD_REMAINDER" },
        { val: (Y + A).toString(), defect: "EXCEEDED_TARGET_MULTIPLE" },
        { val: (Base - R).toString(), defect: "SUBTRACTED_REMAINDER_INSTEAD_OF_ADDING" }
      ];
      const built = ensureFourUniqueOptions(finalAnswer, distractors);
      options = built.options;
      defectMap = built.defectMap;
    }

    if (isStructure) {
      const multExpected = `${A} * ${B} = ${Base}`;
      const multAccepted = makeMultiplicationAcceptedAnswers(A, B, Base);
      const addExpected = `${Base} + ${R} = ${Y}`;
      const addAccepted = makeAdditionAcceptedAnswers(Base, R, Y);

      const steps = [
        {
          label: `Write the working equation to find the common multiple of ${A} and ${B}:`,
          expectedAnswer: multExpected,
          acceptedAnswers: multAccepted
        },
        {
          label: `Write the working equation to add the remainder to the multiple:`,
          expectedAnswer: addExpected,
          acceptedAnswers: addAccepted
        },
        {
          label: `Final Answer:`,
          expectedAnswer: finalAnswer,
          acceptedAnswers: [finalAnswer]
        }
      ];

      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps }, null, 2);
    }

    solutionSteps = `1. If the number leaves a remainder of ${R} when divided by both ${A} and ${B}, subtracting ${R} must leave a common multiple of ${A} and ${B}.\n2. Find the common multiple of ${A} and ${B}: ${A} × ${B} = ${Base} (or LCM = ${Base}).\n3. Add the remainder: ${Base} + ${R} = ${Y}.\n4. Check the boundary condition: ${M1} < ${Y} < ${M2}.\n5. Therefore, the number is ${Y}.`;

    hint = `Find a common multiple of ${A} and ${B} between ${M1} and ${M2}, then add the common remainder ${R}!`;

    promptInstruction = `CRITICAL INSTRUCTIONS:
- Question stem must state dividing by ${A} and ${B} both leave remainder ${R}, within boundary ${M1} and ${M2}.
- finalAnswer must be strictly "${finalAnswer}".`;
  }

  // ==========================================================================
  // VARIANT 5: advanced_max_min_multiplier_boundary (Max/Min Multiplier)
  // ==========================================================================
  else if (effectiveVariant === 'advanced_max_min_multiplier_boundary') {
    const scenarios = [
      { winningAnswer: 92, factorsText: "1, 2, and 4", targetFactor: 4, test1: 96, test1Factors: "3, 6, 8" },
      { winningAnswer: 93, factorsText: "1 and 3", targetFactor: 3, test1: 99, test1Factors: "9" },
      { winningAnswer: 95, factorsText: "1 and 5", targetFactor: 5, test1: 90, test1Factors: "2, 3, 6, 9" },
      { winningAnswer: 91, factorsText: "1 and 7", targetFactor: 7, test1: 98, test1Factors: "2" },
      { winningAnswer: 94, factorsText: "1 and 2", targetFactor: 2, test1: 98, test1Factors: "7" },
      { winningAnswer: 78, factorsText: "1, 2, 3, and 6", targetFactor: 6, test1: 96, test1Factors: "4, 8" }
    ];

    const item = scenarios[Math.floor(Math.random() * scenarios.length)];
    const { winningAnswer, factorsText, targetFactor, test1, test1Factors } = item;

    finalAnswer = winningAnswer.toString();
    acceptedAnswers = [finalAnswer];

    if (isShort || isMCQ) {
      askText = `What is the largest 2-digit whole number that has exactly ${factorsText} as its only 1-digit factors?`;
    } else {
      askText = `What is the largest 2-digit whole number that has exactly ${factorsText} as its only 1-digit factors? Show your working and the final answer.`;
    }

    if (isMCQ) {
      const distractors = [
        { val: test1.toString(), defect: "IGNORED_OTHER_ONE_DIGIT_FACTORS" },
        { val: (winningAnswer - targetFactor).toString(), defect: "SUBOPTIMAL_VALUE" },
        { val: (winningAnswer + 2 < 100 ? winningAnswer + 2 : winningAnswer - 4).toString(), defect: "NOT_DIVISIBLE_BY_REQUIRED_FACTOR" }
      ];
      const built = ensureFourUniqueOptions(finalAnswer, distractors);
      options = built.options;
      defectMap = built.defectMap;
    }

    if (isStructure) {
      const step1Expected = `${test1} / ${targetFactor} = ${test1 / targetFactor}`;
      const step1Accepted = makeDivisionAcceptedAnswers(test1, targetFactor, test1 / targetFactor, 0);

      const steps = [
        {
          label: `Write the working equation to test a candidate 2-digit multiple of ${targetFactor} (${test1}):`,
          expectedAnswer: step1Expected,
          acceptedAnswers: step1Accepted
        },
        {
          label: `Does ${test1} have other 1-digit factors? (List them if yes, or type No):`,
          expectedAnswer: test1Factors,
          acceptedAnswers: [test1Factors, test1Factors.replace(/\s+/g, ''), "Yes", "yes"]
        },
        {
          label: `Test the multiple ${winningAnswer}. Does it have other 1-digit factors? (Type No if it has only ${factorsText}):`,
          expectedAnswer: "No",
          acceptedAnswers: NO_ACCEPTED
        },
        {
          label: `Final Answer:`,
          expectedAnswer: finalAnswer,
          acceptedAnswers: [finalAnswer]
        }
      ];

      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps }, null, 2);
    }

    solutionSteps = `1. The number must be divisible by ${targetFactor} and have no other 1-digit factors besides ${factorsText}.\n2. Test larger candidates such as ${test1}: ${test1} ÷ ${targetFactor} = ${test1 / targetFactor}, but ${test1} has other 1-digit factor(s) (${test1Factors}), so it is rejected.\n3. Test ${winningAnswer}: ${winningAnswer} ÷ ${targetFactor} = ${winningAnswer / targetFactor}.\n4. The only 1-digit factors of ${winningAnswer} are ${factorsText}.\n5. Therefore, the largest 2-digit whole number is ${winningAnswer}.`;

    hint = `Start testing 2-digit multiples of ${targetFactor} downwards from 99. Check which multiple has only ${factorsText} as its 1-digit factors!`;

    promptInstruction = `CRITICAL INSTRUCTIONS:
- The questionText must be strictly: ${JSON.stringify(askText)}.
- finalAnswer must be strictly "${finalAnswer}".`;
  }

  // ==========================================================================
  // VARIANT 6: advanced_factor_rainbow_cutting (Factor Rainbow Piece Cutting)
  // ==========================================================================
  else if (effectiveVariant === 'advanced_factor_rainbow_cutting') {
    const lengths = [48, 60, 72, 80, 84, 90, 96];
    const materials = ["ribbon", "wire", "rope", "string", "wooden strip", "tape"];
    const [name] = getRandomNames(1);

    const L = lengths[Math.floor(Math.random() * lengths.length)];
    const material = materials[Math.floor(Math.random() * materials.length)];
    const factors = getFactors(L);
    const pairs = getFactorPairs(L);

    const isMinPieces = Math.random() < 0.5;

    let constraintText = "";
    let directConstraint = "";
    let pieceLen = 0;
    let validLens = [];

    if (isMinPieces) {
      // Smallest number of pieces -> Maximize piece length
      const sub = Math.random() < 0.5 ? "1DIGIT" : "MAX_BOUND";
      if (sub === "1DIGIT") {
        validLens = factors.filter(f => f >= 2 && f <= 9);
        pieceLen = validLens[validLens.length - 1];
        constraintText = "have a 1-digit whole-number length in centimetres (greater than 1 cm)";
        directConstraint = "have a 1-digit length (greater than 1 cm)";
      } else {
        const maxBound = Math.random() < 0.5 ? 15 : 20;
        validLens = factors.filter(f => f >= 2 && f <= maxBound);
        pieceLen = validLens[validLens.length - 1];
        constraintText = `be no longer than ${maxBound} cm`;
        directConstraint = `be no longer than ${maxBound} cm`;
      }
    } else {
      // Greatest number of pieces -> Minimize piece length
      const sub = Math.random() < 0.5 ? "MIN_BOUND" : "2DIGIT";
      if (sub === "MIN_BOUND") {
        const minBound = Math.random() < 0.5 ? 5 : 6;
        validLens = factors.filter(f => f >= minBound && f < L);
        pieceLen = validLens[0];
        constraintText = `be at least ${minBound} cm long`;
        directConstraint = `be at least ${minBound} cm long`;
      } else {
        validLens = factors.filter(f => f >= 10 && f < L);
        pieceLen = validLens[0];
        constraintText = "have a 2-digit whole-number length in centimetres";
        directConstraint = "have a 2-digit length";
      }
    }

    const numPieces = L / pieceLen;
    finalAnswer = numPieces.toString();
    acceptedAnswers = [finalAnswer, `${finalAnswer} pieces`, `${finalAnswer} piece`];

    const article = (L === 80 || L === 84) ? 'an' : 'a';

    if (isShort || isMCQ) {
      askText = `What is the ${isMinPieces ? 'smallest' : 'greatest'} number of equal pieces that can be cut from ${article} ${L}-cm ${material} if each piece must ${directConstraint} with no remainder?`;
    } else {
      askText = `${name} has ${article} ${L}-cm ${material}. ${name} cuts it into equal pieces with no ${material} left over. Each piece must ${constraintText}. What is the ${isMinPieces ? 'smallest' : 'greatest'} number of pieces ${name} can cut? Show your working and the final answer.`;
    }

    if (isMCQ) {
      const distractors = [
        { val: pieceLen.toString(), defect: "CONFUSED_PIECE_LENGTH_WITH_COUNT" },
        { val: (validLens.length > 1 ? (L / validLens[validLens.length - 2]).toString() : (numPieces + 2).toString()), defect: "SUBOPTIMAL_FACTOR_CHOICE" },
        { val: (L / 2).toString(), defect: "CHOSE_HALF_PIECES" }
      ];
      const built = ensureFourUniqueOptions(finalAnswer, distractors);
      options = built.options;
      defectMap = built.defectMap;
    }

    if (isStructure) {
      const workingExpected = `${L} / ${pieceLen} = ${numPieces}`;
      const workingAccepted = makeDivisionAcceptedAnswers(L, pieceLen, numPieces, 0);

      const steps = [
        {
          label: `To get the ${isMinPieces ? 'smallest' : 'greatest'} number of pieces, what is the ${isMinPieces ? 'largest' : 'smallest'} allowable length of each piece in centimetres?`,
          expectedAnswer: pieceLen.toString(),
          acceptedAnswers: [pieceLen.toString(), `${pieceLen} cm`, `${pieceLen}cm`]
        },
        {
          label: `Write the division equation to find the number of pieces:`,
          expectedAnswer: workingExpected,
          acceptedAnswers: workingAccepted
        },
        {
          label: `Final Answer (Number of pieces):`,
          expectedAnswer: finalAnswer,
          acceptedAnswers: acceptedAnswers
        }
      ];

      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps }, null, 2);
    }

    solutionSteps = `1. Find all factor pairs of ${L} using the factor rainbow:\n   ${pairs.map(([a, b]) => `${a} × ${b}`).join(', ')}.\n2. The factors of ${L} are: ${factors.join(', ')}.\n3. Under the given condition (${constraintText}), the allowable piece lengths are: ${validLens.join(', ')} cm.\n4. To get the ${isMinPieces ? 'smallest' : 'greatest'} number of pieces, each piece must be as ${isMinPieces ? 'long' : 'short'} as possible.\n   The optimal piece length is ${pieceLen} cm.\n5. Divide the total length by the piece length:\n   ${L} ÷ ${pieceLen} = ${numPieces} pieces.\n6. Therefore, the ${isMinPieces ? 'smallest' : 'greatest'} number of pieces is ${numPieces}.`;

    hint = `Work out the factor rainbow of ${L} to find all its factor pairs! To get the smallest number of pieces, make each piece as long as possible; to get the greatest number of pieces, make each piece as short as possible.`;

    promptInstruction = `CRITICAL INSTRUCTIONS:
- The questionText must be strictly: ${JSON.stringify(askText)}.
- finalAnswer must be strictly "${finalAnswer}".`;
  }

  // ==========================================================================
  // FINAL SCHEMA ASSEMBLY
  // ==========================================================================
  const formatInstructions = getFormatInstructions(
    visualEngineStr,
    inputRequirementStr,
    effectiveVariant,
    acceptedAnswers,
    askText,
    isMCQ ? options : null,
    isMCQ ? defectMap : null,
    finalAnswer
  );

  let parsedVE = null;
  if (visualEngineStr) {
    try { parsedVE = JSON.parse(visualEngineStr); } catch (e) {}
  }
  let parsedIR = null;
  if (inputRequirementStr) {
    try { parsedIR = JSON.parse(inputRequirementStr); } catch (e) {}
  }

  return {
    aiPrompt: `You are an expert Singapore Primary 4 Math educator.
Generate an advanced-level question for Singapore Primary 4 students.
Topic: ${topic}
Subtopic: Factor Determination
Variant: ${effectiveVariant}
Difficulty: ${zodDiff}
Type: ${zodType}

${promptInstruction}

CRITICAL RULES:
1. ONLY return valid JSON matching the schema provided below.
2. The 'questionText' MUST be exactly: ${JSON.stringify(askText)}. DO NOT truncate, rephrase, or drop the factor question.
3. DO NOT alter numerical values, finalAnswer, or expected steps.
4. Keep solutionSteps clear, pedagogical, and separated by literal escaped \\n.
5. Keep hint constructive and focused on factor determination concepts.
6. If visualEngine is NONE, do not add or invent any visual components.

${formatInstructions}`,
    visualEngine: parsedVE,
    inputRequirement: parsedIR,
    acceptedAnswers
  };
}
