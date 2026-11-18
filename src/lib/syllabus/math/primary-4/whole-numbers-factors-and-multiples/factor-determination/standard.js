import { getRandomNames, getRandomDivisibleObjects, getRandomCountableItems, getPackingAndShoppingItems } from '../../../../../utils/variable-bank.js';

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

function formatFactorListVariations(factorArr) {
  const standard = factorArr.join(', ');
  const noSpace = factorArr.join(',');
  const andLast = factorArr.slice(0, -1).join(', ') + ' and ' + factorArr[factorArr.length - 1];
  return [standard, noSpace, andLast];
}

const YES_ACCEPTED = ["Yes", "yes", "YES", "True", "true", "TRUE", "Y", "T"];

export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, explicitVariety = null) {
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

  const effectiveVariant = activeVariant || 'standard_valid_container_condition';

  // ==========================================================================
  // VARIANT 1: standard_valid_container_condition (Remainder Analysis)
  // ==========================================================================
  if (effectiveVariant === 'standard_valid_container_condition') {
    const [name] = getRandomNames(1);
    const { singular: itemName, plural: itemPlural } = getCountableItem();

    const X = Math.floor(Math.random() * 5) + 5; // 5 to 9 (items per bag)
    const Q = Math.floor(Math.random() * 7) + 6; // 6 to 12 (full bags)
    const R = Math.floor(Math.random() * (X - 1)) + 1; // 1 to X-1 (leftover)
    const Y = X * Q + R; // 35 to 98

    finalAnswer = R.toString();
    acceptedAnswers = [finalAnswer, `${finalAnswer} ${itemPlural}`, `${finalAnswer} ${itemName}`];

    if (isShort || isMCQ) {
      askText = `What is the remainder when ${Y} is divided by ${X}?`;
      acceptedAnswers = [finalAnswer];
    } else {
      askText = `${name} has ${Y} ${itemPlural}. ${name} packs them into bags of ${X}. If ${X} is not an exact factor of ${Y}, how many ${itemPlural} are left unpacked? Show your working and the final answer.`;
    }

    visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;

    if (isMCQ) {
      const distractors = [
        { val: Q.toString(), defect: "CONFUSED_QUOTIENT_WITH_REMAINDER" },
        { val: (X - R).toString(), defect: "CALCULATED_SHORTFALL_INSTEAD_OF_REMAINDER" },
        { val: (R + 1).toString(), defect: "CARELESS_CALCULATION" }
      ];
      const built = ensureFourUniqueOptions(finalAnswer, distractors);
      options = built.options;
      defectMap = built.defectMap;
    }

    if (isStructure) {
      const workingExpected = `${Y} / ${X} = ${Q} R ${R}`;
      const workingAccepted = makeDivisionAcceptedAnswers(Y, X, Q, R);

      const steps = [
        {
          label: `Write the working equation to find the number of full bags and leftovers:`,
          expectedAnswer: workingExpected,
          acceptedAnswers: workingAccepted
        },
        {
          label: `How many ${itemPlural} are left unpacked?`,
          expectedAnswer: finalAnswer,
          acceptedAnswers: acceptedAnswers
        }
      ];

      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps }, null, 2);
    }

    solutionSteps = `1. Divide ${Y} by ${X}: ${Y} ÷ ${X} = ${Q} R ${R}.\n2. The quotient is ${Q} and the remainder is ${R}.\n3. Therefore, the remainder is ${R}.`;

    hint = `Divide ${Y} by ${X}. The remainder is the number left over!`;

    promptInstruction = `CRITICAL INSTRUCTIONS:
- The questionText must be strictly: ${JSON.stringify(askText)}.
- finalAnswer must be strictly "${finalAnswer}".`;
  }

  // ==========================================================================
  // VARIANT 2: standard_add_subtract_adjustment (The Add/Subtract Adjustment)
  // ==========================================================================
  else if (effectiveVariant === 'standard_add_subtract_adjustment') {
    const [name] = getRandomNames(1);
    const { singular: itemName, plural: itemPlural } = getCountableItem();

    const X = Math.floor(Math.random() * 5) + 5; // 5 to 9
    const Q = Math.floor(Math.random() * 6) + 5; // 5 to 10
    const R = Math.floor(Math.random() * (X - 1)) + 1; // 1 to X-1
    const Y = X * Q + R;

    finalAnswer = R.toString();
    acceptedAnswers = [finalAnswer, `${finalAnswer} ${itemPlural}`, `${finalAnswer} ${itemName}`];

    if (isShort || isMCQ) {
      askText = `What is the smallest number that must be subtracted from ${Y} so that ${X} is a factor of the result?`;
      acceptedAnswers = [finalAnswer];
    } else {
      askText = `${name} has ${Y} ${itemPlural}. ${name} notices that ${X} is not a factor of ${Y}. What is the smallest number of ${itemPlural} ${name} must take away from ${Y} so that ${X} becomes an exact factor of the remaining ${itemPlural}? Show your working and the final answer.`;
    }

    visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;

    if (isMCQ) {
      const distractors = [
        { val: (X - R).toString(), defect: "CONFUSED_ADDITION_WITH_SUBTRACTION" },
        { val: Q.toString(), defect: "CONFUSED_QUOTIENT_WITH_REMAINDER" },
        { val: (R + 1).toString(), defect: "CARELESS_CALCULATION" }
      ];
      const built = ensureFourUniqueOptions(finalAnswer, distractors);
      options = built.options;
      defectMap = built.defectMap;
    }

    if (isStructure) {
      const workingExpected = `${Y} / ${X} = ${Q} R ${R}`;
      const workingAccepted = makeDivisionAcceptedAnswers(Y, X, Q, R);

      const steps = [
        {
          label: `Write the working equation to find the remainder:`,
          expectedAnswer: workingExpected,
          acceptedAnswers: workingAccepted
        },
        {
          label: `Number of ${itemPlural} to take away:`,
          expectedAnswer: finalAnswer,
          acceptedAnswers: acceptedAnswers
        }
      ];

      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps }, null, 2);
    }

    solutionSteps = `1. Divide ${Y} by ${X} to find the remainder: ${Y} ÷ ${X} = ${Q} R ${R}.\n2. The remainder of ${R} is the extra amount that prevents ${Y} from being a multiple of ${X}.\n3. Subtracting ${R} gives ${Y} - ${R} = ${X * Q}, which is an exact multiple of ${X} (${X} × ${Q} = ${X * Q}).\n4. Therefore, the smallest number that must be subtracted is ${R}.`;

    hint = `Divide ${Y} by ${X} to find the remainder. Subtracting this remainder will make the result divisible by ${X}!`;

    promptInstruction = `CRITICAL INSTRUCTIONS:
- The questionText must be strictly: ${JSON.stringify(askText)}.
- finalAnswer must be strictly "${finalAnswer}".`;
  }

  // ==========================================================================
  // VARIANT 3: standard_area_geometry_factors (Area and Geometry: Valid Dimensions)
  // ==========================================================================
  else if (effectiveVariant === 'standard_area_geometry_factors') {
    const targets = [48, 60, 64, 72, 80, 84, 90, 96];
    const Y = targets[Math.floor(Math.random() * targets.length)];
    const allFactors = getFactors(Y);
    const oneDigitFactors = allFactors.filter(f => f >= 1 && f <= 9);
    const maxOneDigitFactor = oneDigitFactors[oneDigitFactors.length - 1]; // e.g. 8 for 96
    const breadth = Y / maxOneDigitFactor; // e.g. 12 for 96

    finalAnswer = maxOneDigitFactor.toString();
    acceptedAnswers = [
      finalAnswer,
      `${finalAnswer} m`,
      `${finalAnswer}m`,
      `${finalAnswer} cm`,
      `${finalAnswer}cm`
    ];

    if (isShort || isMCQ) {
      askText = `What is the largest 1-digit factor of ${Y}?`;
      acceptedAnswers = [finalAnswer];
    } else {
      askText = `A rectangular garden has an area of ${Y} m². Its length and breadth are whole numbers. If the length is a 1-digit number in metres, what is the largest possible length of the garden? Show your working and the final answer.`;
    }

    visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;

    if (isMCQ) {
      const distractors = [
        { val: (maxOneDigitFactor - 1).toString(), defect: "SUBOPTIMAL_FACTOR" },
        { val: breadth.toString(), defect: "CHOSE_BREADTH_INSTEAD_OF_LENGTH" },
        { val: "9", defect: "CHOSE_MAX_DIGIT_WITHOUT_CHECKING_DIVISIBILITY" }
      ];
      const built = ensureFourUniqueOptions(finalAnswer, distractors);
      options = built.options;
      defectMap = built.defectMap;
    }

    if (isStructure) {
      const factorListStr = oneDigitFactors.join(', ');
      const factorListVariations = formatFactorListVariations(oneDigitFactors);
      const workingExpected = `${Y} / ${maxOneDigitFactor} = ${breadth}`;
      const workingAccepted = makeDivisionAcceptedAnswers(Y, maxOneDigitFactor, breadth, 0);

      const steps = [
        {
          label: `List all the 1-digit factors of ${Y}:`,
          expectedAnswer: factorListStr,
          acceptedAnswers: factorListVariations
        },
        {
          label: `Write the working equation using the largest 1-digit factor to find the breadth:`,
          expectedAnswer: workingExpected,
          acceptedAnswers: workingAccepted
        },
        {
          label: `Final Answer (Largest 1-digit length in metres):`,
          expectedAnswer: finalAnswer,
          acceptedAnswers: acceptedAnswers
        }
      ];

      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps }, null, 2);
    }

    solutionSteps = `1. List all 1-digit factors of ${Y}: ${oneDigitFactors.join(', ')}.\n2. The largest 1-digit factor is ${maxOneDigitFactor}.\n3. Check: ${Y} ÷ ${maxOneDigitFactor} = ${breadth}.\n4. Therefore, the largest 1-digit factor is ${maxOneDigitFactor}.`;

    hint = `List all numbers from 1 to 9 that divide into ${Y} without a remainder. Find the largest one!`;

    promptInstruction = `CRITICAL INSTRUCTIONS:
- The questionText must be strictly: ${JSON.stringify(askText)}.
- finalAnswer must be strictly "${finalAnswer}".`;
  }

  // ==========================================================================
  // VARIANT 4: standard_dual_factor_condition (The Dual Factor Condition)
  // ==========================================================================
  else if (effectiveVariant === 'standard_dual_factor_condition') {
    const scenarios = [
      { X1: 6, X2: 8, Target: 72, A: 60, B: 85 },
      { X1: 4, X2: 6, Target: 60, A: 50, B: 70 },
      { X1: 6, X2: 9, Target: 54, A: 40, B: 65 },
      { X1: 6, X2: 9, Target: 72, A: 65, B: 85 },
      { X1: 3, X2: 8, Target: 72, A: 60, B: 85 },
      { X1: 4, X2: 9, Target: 72, A: 55, B: 85 },
      { X1: 4, X2: 7, Target: 84, A: 70, B: 95 },
      { X1: 5, X2: 8, Target: 80, A: 65, B: 95 },
      { X1: 3, X2: 7, Target: 63, A: 50, B: 75 },
      { X1: 5, X2: 6, Target: 60, A: 45, B: 75 }
    ];

    const item = scenarios[Math.floor(Math.random() * scenarios.length)];
    const { X1, X2, Target, A, B } = item;

    // Find candidate multiples of X2 in (A, B)
    const candidates = [];
    for (let n = A + 1; n < B; n++) {
      if (n % X2 === 0) candidates.push(n);
    }

    finalAnswer = Target.toString();
    acceptedAnswers = [finalAnswer];

    if (isShort || isMCQ) {
      askText = `Find a whole number between ${A} and ${B} that has both ${X1} and ${X2} as factors.`;
    } else {
      const { singular: itemName, plural: itemPlural } = getCountableItem();
      askText = `A box contains between ${A} and ${B} ${itemPlural}. The ${itemPlural} can be packed equally into packets of ${X1} or packets of ${X2} with no ${itemPlural} left over. How many ${itemPlural} are in the box? Show your working and the final answer.`;
    }

    visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;

    if (isMCQ) {
      const nonTargetCandidates = candidates.filter(c => c !== Target);
      const distractors = [];

      // Distractor 1 & 2: other multiples of X2 in range
      for (const cand of nonTargetCandidates) {
        distractors.push({ val: cand.toString(), defect: "FACTOR_OF_ONE_NUMBER_ONLY" });
      }

      // Distractor: multiple of X1 in range
      for (let n = A + 1; n < B; n++) {
        if (n % X1 === 0 && n !== Target && !distractors.some(d => d.val === n.toString())) {
          distractors.push({ val: n.toString(), defect: "FACTOR_OF_ONE_NUMBER_ONLY" });
          break;
        }
      }

      // Distractor: Naive multiplication X1 * X2
      const naive = X1 * X2;
      if (naive !== Target && !distractors.some(d => d.val === naive.toString())) {
        distractors.push({ val: naive.toString(), defect: "NAIVE_MULTIPLICATION_BELOW_RANGE" });
      }

      const built = ensureFourUniqueOptions(finalAnswer, distractors);
      options = built.options;
      defectMap = built.defectMap;
    }

    if (isStructure) {
      const candidateListStr = candidates.join(', ');
      const candidateVariations = formatFactorListVariations(candidates);
      candidateVariations.push(candidates.join(' '));

      const workingExpected = `${Target} / ${X1} = ${Target / X1}`;
      const workingAccepted = [
        ...makeDivisionAcceptedAnswers(Target, X1, Target / X1, 0),
        ...makeDivisionAcceptedAnswers(Target, X2, Target / X2, 0),
        ...makeMultiplicationAcceptedAnswers(X1, Target / X1, Target),
        ...makeMultiplicationAcceptedAnswers(X2, Target / X2, Target)
      ];

      const steps = [
        {
          label: `List the multiples of ${X2} between ${A} and ${B} (separated by commas):`,
          expectedAnswer: candidateListStr,
          acceptedAnswers: candidateVariations
        },
        {
          label: `Write the division equation showing which candidate has ${X1} as an exact factor:`,
          expectedAnswer: workingExpected,
          acceptedAnswers: workingAccepted
        },
        {
          label: `Final Answer (The whole number):`,
          expectedAnswer: finalAnswer,
          acceptedAnswers: [finalAnswer]
        }
      ];

      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps }, null, 2);
    }

    const testSteps = candidates.map(c => {
      const q = Math.floor(c / X1);
      const r = c % X1;
      if (r === 0) {
        return `   • ${c} ÷ ${X1} = ${q} (Exact division with 0 remainder, so ${X1} is a factor!)`;
      } else {
        return `   • ${c} ÷ ${X1} = ${q} R ${r} (Leaves a remainder of ${r}, so ${X1} is NOT a factor)`;
      }
    }).join('\n');

    solutionSteps = `1. List all multiples of the larger factor, ${X2}, between ${A} and ${B}:\n   ${candidates.join(', ')}.\n2. Test each candidate to determine if ${X1} is also a factor:\n${testSteps}\n3. Only ${Target} divides exactly by both ${X1} and ${X2} with 0 remainder.\n4. Therefore, the required whole number is ${Target}.`;

    hint = `List all multiples of ${X2} between ${A} and ${B}. Then divide each candidate by ${X1} to see which one leaves no remainder!`;

    promptInstruction = `CRITICAL INSTRUCTIONS:
- The questionText must be strictly: ${JSON.stringify(askText)}.
- finalAnswer must be strictly "${finalAnswer}".`;
  }

  // ==========================================================================
  // VARIANT 5: standard_unknown_divisor_odd_quotient (Finding X)
  // ==========================================================================
  else if (effectiveVariant === 'standard_unknown_divisor_odd_quotient') {
    const scenarios = [
      { Y: 40, X: 8, Q: 5 },
      { Y: 56, X: 8, Q: 7 },
      { Y: 72, X: 8, Q: 9 },
      { Y: 24, X: 8, Q: 3 },
      { Y: 36, X: 4, Q: 9 },
      { Y: 48, X: 3, Q: 16 } // 48 ÷ 3 = 16 (even), but 48 ÷ 16 = 3 (16 not 1-digit)
    ];

    const validScenarios = scenarios.filter(s => s.Q % 2 === 1);
    const item = validScenarios[Math.floor(Math.random() * validScenarios.length)];
    const { Y, X, Q } = item;

    const allFactors = getFactors(Y);
    const oneDigitFactors = allFactors.filter(f => f >= 1 && f <= 9);

    finalAnswer = X.toString();
    acceptedAnswers = [finalAnswer];

    if (isShort || isMCQ) {
      askText = `Find a 1-digit factor of ${Y} that gives an odd quotient greater than 1 when ${Y} is divided by it.`;
    } else {
      askText = `A 1-digit number X is a factor of ${Y}. When ${Y} is divided by X, the quotient is an odd number greater than 1. Find X. Show your working and the final answer.`;
    }

    visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;

    if (isMCQ) {
      const other1Digit = oneDigitFactors.filter(f => f !== X && f !== 1);
      const distractors = other1Digit.slice(0, 3).map(f => ({
        val: f.toString(),
        defect: "RESULTED_IN_EVEN_QUOTIENT"
      }));
      const built = ensureFourUniqueOptions(finalAnswer, distractors);
      options = built.options;
      defectMap = built.defectMap;
    }

    if (isStructure) {
      const factorListStr = oneDigitFactors.join(', ');
      const factorListVariations = formatFactorListVariations(oneDigitFactors);
      const workingExpected = `${Y} / ${X} = ${Q}`;
      const workingAccepted = makeDivisionAcceptedAnswers(Y, X, Q, 0);

      const steps = [
        {
          label: `List all the 1-digit factors of ${Y}:`,
          expectedAnswer: factorListStr,
          acceptedAnswers: factorListVariations
        },
        {
          label: `Write the working equation using the correct factor that gives an odd quotient:`,
          expectedAnswer: workingExpected,
          acceptedAnswers: workingAccepted
        },
        {
          label: `Final Answer (The factor):`,
          expectedAnswer: finalAnswer,
          acceptedAnswers: [finalAnswer]
        }
      ];

      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps }, null, 2);
    }

    solutionSteps = `1. List all 1-digit factors of ${Y}: ${oneDigitFactors.join(', ')}.\n2. Divide ${Y} by each factor to test the quotients:\n   ${oneDigitFactors.map(f => `${Y} ÷ ${f} = ${Y / f}`).join(', ')}.\n3. The quotient ${Q} is an odd number greater than 1 when divided by ${X}.\n4. Therefore, X = ${X}.`;

    hint = `List all 1-digit factors of ${Y}. Test dividing ${Y} by each factor until you find one that produces an odd quotient!`;

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
Generate a standard-level question for Singapore Primary 4 students.
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
