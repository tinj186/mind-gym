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

const YES_ACCEPTED = ["Yes", "yes", "YES", "True", "true", "TRUE", "Y", "T"];
const NO_ACCEPTED = ["No", "no", "NO", "False", "false", "FALSE", "N", "F"];

export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, explicitVariety = null) {
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

  const effectiveVariant = activeVariant || 'foundation_divisibility_proof';

  // ==========================================================================
  // VARIANT 1: foundation_divisibility_proof (The Divisibility Proof)
  // ==========================================================================
  if (effectiveVariant === 'foundation_divisibility_proof') {
    const varietyStr = explicitVariety ? String(explicitVariety).toLowerCase() : "";
    const isFactor = varietyStr === 'no' || varietyStr === 'false' || varietyStr === 'not_factor'
      ? false
      : (varietyStr === 'yes' || varietyStr === 'true' || varietyStr === 'is_factor'
        ? true
        : Math.random() < 0.5);

    const X = Math.floor(Math.random() * 8) + 2; // 2 to 9
    let Y, Q, R;

    if (isFactor) {
      const minQ = Math.ceil(12 / X);
      const maxQ = Math.floor(100 / X);
      Q = Math.floor(Math.random() * (maxQ - minQ + 1)) + minQ;
      Y = X * Q;
      R = 0;
    } else {
      const minQ = Math.ceil(12 / X);
      const maxQ = Math.max(minQ, Math.floor(98 / X));
      Q = Math.floor(Math.random() * (maxQ - minQ + 1)) + minQ;
      R = Math.floor(Math.random() * (X - 1)) + 1;
      Y = X * Q + R;
      if (Y > 100) {
        Y -= X;
        Q = Math.floor(Y / X);
        R = Y % X;
      }
      if (Y % X === 0) {
        Y += 1;
        R = 1;
      }
      if (Y < 12) {
        Y += X;
        Q = Math.floor(Y / X);
        R = Y % X;
      }
    }

    finalAnswer = isFactor ? "Yes" : "No";
    acceptedAnswers = isFactor ? YES_ACCEPTED : NO_ACCEPTED;

    const questionStem = `Is ${X} a factor of ${Y}? Show your working and the final answer.`;
    askText = questionStem;

    if (isMCQ) {
      const correctText = isFactor 
        ? `Yes, because ${Y} ÷ ${X} = ${Q}` 
        : `No, because ${Y} ÷ ${X} = ${Q} R ${R}`;
      finalAnswer = correctText;
      acceptedAnswers = [correctText];

      const distractors = isFactor ? [
        { val: `No, because ${Y} ÷ ${X} has a remainder`, defect: "CONCEPTUAL_ERROR" },
        { val: `No, because ${X} is too small to be a factor`, defect: "CONCEPTUAL_ERROR" },
        { val: `Yes, because ${Y} is a factor of ${X}`, defect: "REVERSED_RELATIONSHIP" }
      ] : [
        { val: `Yes, because ${Y} ÷ ${X} = ${Q}`, defect: "IGNORED_REMAINDER" },
        { val: `Yes, because ${X} is smaller than ${Y}`, defect: "CONCEPTUAL_ERROR" },
        { val: `No, because ${Y} is an odd number`, defect: "FALSE_GENERALIZATION" }
      ];

      const built = ensureFourUniqueOptions(finalAnswer, distractors);
      options = built.options;
      defectMap = built.defectMap;
    }

    if (isStructure) {
      const workingExpected = isFactor ? `${Y} / ${X} = ${Q}` : `${Y} / ${X} = ${Q} R ${R}`;
      const workingAccepted = makeDivisionAcceptedAnswers(Y, X, Q, R);

      const steps = [
        {
          label: `Write the working equation to test if ${X} divides exactly into ${Y}:`,
          expectedAnswer: workingExpected,
          acceptedAnswers: workingAccepted
        },
        {
          label: `Is ${X} a factor of ${Y}? (Type Yes or No):`,
          expectedAnswer: isFactor ? "Yes" : "No",
          acceptedAnswers: isFactor ? YES_ACCEPTED : NO_ACCEPTED
        }
      ];

      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps }, null, 2);
    }

    solutionSteps = isFactor
      ? `1. Divide ${Y} by ${X}: ${Y} ÷ ${X} = ${Q}.\\n2. Since the remainder is 0, ${X} divides ${Y} exactly.\\n3. Therefore, ${X} is a factor of ${Y}.`
      : `1. Divide ${Y} by ${X}: ${Y} ÷ ${X} = ${Q} R ${R}.\\n2. Since there is a remainder of ${R}, ${X} does not divide ${Y} exactly.\\n3. Therefore, ${X} is not a factor of ${Y}.`;

    hint = `Divide ${Y} by ${X}. A number is a factor if and only if it divides with no remainder (remainder 0).`;

    promptInstruction = `CRITICAL INSTRUCTIONS:
- The questionText must ask whether ${X} is a factor of ${Y}.
- Keep exact values: X = ${X}, Y = ${Y}.
- finalAnswer must be strictly "${finalAnswer}".`;
  }

  // ==========================================================================
  // VARIANT 2: foundation_perfect_grid (The Perfect Grid: Array Packing)
  // ==========================================================================
  else if (effectiveVariant === 'foundation_perfect_grid') {
    const [name] = getRandomNames(1);
    const { singular: itemName, plural: itemPlural } = getCountableItem();

    const varietyStr = explicitVariety ? String(explicitVariety).toLowerCase() : "";
    const isPerfect = varietyStr === 'no' || varietyStr === 'false' || varietyStr === 'has_remainder'
      ? false
      : (varietyStr === 'yes' || varietyStr === 'true' || varietyStr === 'perfect'
        ? true
        : Math.random() < 0.5);
    const X = Math.floor(Math.random() * 6) + 3; // 3 to 8 (columns / items per row)
    let Q, R, Y;

    if (isPerfect) {
      Q = Math.floor(Math.random() * 6) + 3; // 3 to 8 rows
      Y = X * Q;
      R = 0;
    } else {
      Q = Math.floor(Math.random() * 5) + 3; // 3 to 7 rows
      R = Math.floor(Math.random() * (X - 1)) + 1; // 1 to X-1
      Y = X * Q + R;
    }

    finalAnswer = isPerfect ? "Yes" : "No";
    acceptedAnswers = isPerfect ? YES_ACCEPTED : NO_ACCEPTED;

    const questionStem = `${name} wants to use an array to determine if ${X} is a factor of ${Y}. ${name} arranges ${Y} ${itemPlural} into equal rows of ${X}. Can ${name} form a complete rectangular array with no leftovers to prove that ${X} is a factor of ${Y}?`;
    askText = questionStem;

    if (!isStructure) {
      const gridRows = isPerfect ? Q : Q + 1;
      visualEngineStr = JSON.stringify({
        componentToRender: "GRID_ARRAY",
        componentData: {
          rows: gridRows,
          columns: X,
          totalItems: Y,
          itemShape: "square",
          rowLabel: "Rows",
          colLabel: `${X} per row`,
          title: `Arranging ${Y} ${itemPlural} in rows of ${X}`,
          showTotal: false,
          showEquation: false,
          ...(isPerfect ? {} : { highlightRows: [Q] })
        }
      }, null, 2);
    }

    if (isMCQ) {
      const correctText = isPerfect 
        ? `Yes, because all rows are full with no leftovers, proving ${X} is a factor of ${Y}` 
        : `No, because there is an incomplete row of leftovers, so ${X} is not a factor of ${Y}`;
      finalAnswer = correctText;
      acceptedAnswers = [correctText];

      const distractors = isPerfect ? [
        { val: `No, because ${Y} ÷ ${X} leaves a remainder`, defect: "CONCEPTUAL_ERROR" },
        { val: `No, because an array cannot prove factor relationships`, defect: "CONCEPTUAL_ERROR" },
        { val: `Yes, because any number of items can form a rectangle`, defect: "SUPERFICIAL_REASONING" }
      ] : [
        { val: `Yes, because ${Y} ÷ ${X} = ${Q} full rows regardless of leftovers`, defect: "IGNORED_REMAINDER" },
        { val: `Yes, because ${X} is smaller than ${Y}`, defect: "SUPERFICIAL_REASONING" },
        { val: `No, because ${X} cannot be divided into ${Y}`, defect: "REVERSED_RELATIONSHIP" }
      ];
      const built = ensureFourUniqueOptions(finalAnswer, distractors);
      options = built.options;
      defectMap = built.defectMap;
    }

    if (isStructure) {
      const workingExpected = isPerfect ? `${Y} / ${X} = ${Q}` : `${Y} / ${X} = ${Q} R ${R}`;
      const workingAccepted = makeDivisionAcceptedAnswers(Y, X, Q, R);

      const steps = [
        {
          label: `Write the working equation to find the number of rows and any leftover ${itemPlural}:`,
          expectedAnswer: workingExpected,
          acceptedAnswers: workingAccepted
        },
        {
          label: `Since there are ${isPerfect ? 'no leftovers (remainder 0)' : `${R} leftover ${itemPlural} (remainder ${R})`}, is ${X} a factor of ${Y}? (Type Yes or No):`,
          expectedAnswer: isPerfect ? "Yes" : "No",
          acceptedAnswers: isPerfect ? YES_ACCEPTED : NO_ACCEPTED
        }
      ];

      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps }, null, 2);
    }

    solutionSteps = isPerfect
      ? `1. Arrange the items into rows of ${X}: ${Y} ÷ ${X} = ${Q} complete rows with remainder 0.\\n2. Since the items form a complete rectangular array with 0 leftovers, ${X} divides ${Y} exactly.\\n3. Therefore, ${X} is a factor of ${Y}.\\n4. Final Answer: Yes.`
      : `1. Arrange the items into rows of ${X}: ${Y} ÷ ${X} = ${Q} R ${R}.\\n2. There are ${Q} full rows and ${R} leftover ${itemPlural} forming an incomplete row.\\n3. Because there are leftovers, ${X} does not divide ${Y} exactly, so ${X} is not a factor of ${Y}.\\n4. Final Answer: No.`;

    hint = `A number is a factor if the items can be arranged into complete rows with zero leftovers (remainder 0). Any leftovers mean it is NOT a factor!`;

    promptInstruction = `CRITICAL INSTRUCTIONS:
- Question stem must describe using an array of ${Y} ${itemPlural} in rows of ${X} to determine if ${X} is a factor of ${Y}.
- finalAnswer must be strictly "${finalAnswer}".`;
  }

  // ==========================================================================
  // VARIANT 3: foundation_missing_partner (The Missing Partner)
  // ==========================================================================
  else if (effectiveVariant === 'foundation_missing_partner') {
    const targets = [24, 28, 30, 32, 36, 40, 42, 45, 48, 54, 56, 60, 64, 70, 72, 80, 84, 90, 96];
    const Y = targets[Math.floor(Math.random() * targets.length)];
    const allPairs = getFactorPairs(Y);
    const allFactors = getFactors(Y);

    // Pick a pair where one factor is a 1-digit number (2 to 9)
    const validPairs = allPairs.filter(([a, b]) => (a >= 2 && a <= 9) || (b >= 2 && b <= 9));
    const pair = validPairs[Math.floor(Math.random() * validPairs.length)] || allPairs[0];

    const isAOneDigit = pair[0] >= 2 && pair[0] <= 9;
    const X = isAOneDigit ? pair[0] : pair[1];
    const partner = isAOneDigit ? pair[1] : pair[0];

    finalAnswer = partner.toString();
    acceptedAnswers = [finalAnswer];

    const questionStem = `Given that ${X} is a factor of ${Y}, find the matching partner factor that multiplies with ${X} to give ${Y}.`;
    askText = questionStem;

    visualEngineStr = JSON.stringify({
      componentToRender: "FACTOR_RAINBOW",
      componentData: {
        targetNumber: Y,
        factors: allFactors,
        pairs: allPairs,
        hiddenValue: partner,
        title: `Factor Rainbow for ${Y}`
      }
    }, null, 2);

    if (isMCQ) {
      const distractors = [
        { val: (partner + 1).toString(), defect: "OFF_BY_ONE" },
        { val: (partner - 1).toString(), defect: "OFF_BY_ONE" },
        { val: (partner + X).toString(), defect: "ADDED_INSTEAD_OF_DIVIDED" }
      ];
      const built = ensureFourUniqueOptions(finalAnswer, distractors);
      options = built.options;
      defectMap = built.defectMap;
    }

    if (isStructure) {
      const workingExpected = `${Y} / ${X} = ${partner}`;
      const workingAccepted = makeDivisionAcceptedAnswers(Y, X, partner, 0);

      const steps = [
        {
          label: `Write the working equation to find the matching factor:`,
          expectedAnswer: workingExpected,
          acceptedAnswers: workingAccepted
        },
        {
          label: `Final Answer:`,
          expectedAnswer: finalAnswer,
          acceptedAnswers: [finalAnswer]
        }
      ];

      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps }, null, 2);
    }

    solutionSteps = `1. A factor pair consists of two factors that multiply to give the target number: ${X} × ? = ${Y}.\n2. Divide the target number by the known factor: ${Y} ÷ ${X} = ${partner}.\n3. The matching partner factor is ${partner}.`;

    hint = `Divide ${Y} by ${X} to find the factor that pairs with ${X}!`;

    promptInstruction = `CRITICAL INSTRUCTIONS:
- The question stem must ask for the matching factor of ${Y} paired with ${X}.
- finalAnswer must be strictly "${finalAnswer}".`;
  }

  // ==========================================================================
  // VARIANT 4: foundation_outlier_factor (The Outlier Factor: Selection)
  // ==========================================================================
  else if (effectiveVariant === 'foundation_outlier_factor') {
    const targets = [36, 40, 42, 48, 54, 56, 60, 64, 72, 80, 84, 90, 96];
    const Y = targets[Math.floor(Math.random() * targets.length)];
    const oneDigitFactors = getFactors(Y).filter(f => f >= 2 && f <= 9);
    const nonFactors = [2, 3, 4, 5, 6, 7, 8, 9].filter(n => !oneDigitFactors.includes(n));

    // Choose 1 non-factor as outlier
    const outlier = nonFactors[Math.floor(Math.random() * nonFactors.length)];
    const Q = Math.floor(Y / outlier);
    const R = Y % outlier;

    // Pick 3 factors from oneDigitFactors
    const shuffledFactors = [...oneDigitFactors].sort(() => Math.random() - 0.5);
    const threeFactors = shuffledFactors.slice(0, 3);

    // 4 candidate numbers for the number cards display and MCQ
    const candidateNumbers = [...threeFactors, outlier].sort(() => Math.random() - 0.5);

    finalAnswer = outlier.toString();
    acceptedAnswers = [finalAnswer];

    const questionStem = `Look at the number cards below. Which number is NOT a factor of ${Y}? Show your working and the final answer.`;
    askText = questionStem;

    visualEngineStr = JSON.stringify({
      componentToRender: "NUMBER_CARDS",
      componentData: {
        cards: candidateNumbers.map(n => ({ value: n.toString() }))
      }
    }, null, 2);

    if (isMCQ) {
      options = candidateNumbers.map(n => n.toString());
      defectMap = {};
      for (const f of threeFactors) {
        defectMap[f.toString()] = "CHOSE_ACTUAL_FACTOR";
      }
    }

    if (isStructure) {
      const workingExpected = `${Y} / ${outlier} = ${Q} R ${R}`;
      const workingAccepted = makeDivisionAcceptedAnswers(Y, outlier, Q, R);

      const steps = [
        {
          label: `Write the working equation showing the division that leaves a remainder:`,
          expectedAnswer: workingExpected,
          acceptedAnswers: workingAccepted
        },
        {
          label: `Which number on the cards is NOT a factor of ${Y}?`,
          expectedAnswer: finalAnswer,
          acceptedAnswers: [finalAnswer]
        }
      ];

      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps }, null, 2);
    }

    solutionSteps = `1. Test each number card by dividing ${Y} by it:\n${candidateNumbers.map(c => {
      if (c === outlier) {
        return `   ${Y} ÷ ${c} = ${Q} R ${R} (leaves a remainder of ${R})`;
      } else {
        return `   ${Y} ÷ ${c} = ${Y / c} (exact division, remainder 0)`;
      }
    }).join('\n')}\n2. Since ${outlier} does not divide ${Y} exactly (leaves a remainder of ${R}), ${outlier} is NOT a factor of ${Y}.\n3. Final Answer: ${finalAnswer}.`;

    hint = `Divide ${Y} by each number on the cards. The number that leaves a remainder is NOT a factor!`;

    promptInstruction = `CRITICAL INSTRUCTIONS:
- Question stem must refer to the number cards shown below to find which number is NOT a factor of ${Y}.
- Number cards contain: ${candidateNumbers.join(', ')}.
- finalAnswer must be strictly "${finalAnswer}".`;
  }

  // ==========================================================================
  // VARIANT 5: foundation_multiple_reversal_proof (The "Multiple" Reversal Proof)
  // ==========================================================================
  else if (effectiveVariant === 'foundation_multiple_reversal_proof') {
    const [name] = getRandomNames(1);
    const { singular: itemName, plural: itemPlural } = getCountableItem();

    const varietyStr = explicitVariety ? String(explicitVariety).toLowerCase() : "";
    const isMultiple = varietyStr === 'no' || varietyStr === 'false' || varietyStr === 'not_multiple'
      ? false
      : (varietyStr === 'yes' || varietyStr === 'true' || varietyStr === 'is_multiple'
        ? true
        : Math.random() < 0.5);
    const X = Math.floor(Math.random() * 6) + 3; // 3 to 8 (bundle size)
    let Q, R, Y;

    if (isMultiple) {
      Q = Math.floor(Math.random() * 8) + 4; // 4 to 11
      Y = X * Q;
      R = 0;
    } else {
      Q = Math.floor(Math.random() * 7) + 3; // 3 to 9
      R = Math.floor(Math.random() * (X - 1)) + 1; // 1 to X-1
      Y = X * Q + R;
    }

    finalAnswer = isMultiple ? "Yes" : "No";
    acceptedAnswers = isMultiple ? YES_ACCEPTED : NO_ACCEPTED;

    const questionStem = `A shop sells ${itemPlural} in bundles of ${X}. To test if ${X} is a factor of ${Y}, can ${name} buy exactly ${Y} ${itemPlural} using only complete bundles of ${X}? Show your working and the final answer.`;
    askText = questionStem;

    visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;

    if (isMCQ) {
      const correctText = isMultiple 
        ? `Yes, because ${Y} ÷ ${X} = ${Q} with no remainder, so ${X} is a factor of ${Y}` 
        : `No, because ${Y} ÷ ${X} = ${Q} R ${R}, so ${X} is not a factor of ${Y}`;
      finalAnswer = correctText;
      acceptedAnswers = [correctText];

      const distractors = isMultiple ? [
        { val: `No, because ${Y} cannot be divided by ${X}`, defect: "CONCEPTUAL_ERROR" },
        { val: `Yes, by buying ${Q + 1} bundles`, defect: "OFF_BY_ONE_BUNDLE" },
        { val: `No, there will be ${X - 1} leftover`, defect: "CALCULATION_ERROR" }
      ] : [
        { val: `Yes, by buying exactly ${Q} bundles`, defect: "IGNORED_REMAINDER" },
        { val: `Yes, because ${Y} ends with an even digit`, defect: "DIVISIBILITY_RULE_CONFUSION" },
        { val: `No, because ${X} is smaller than ${Y}`, defect: "VAGUE_REASONING" }
      ];

      const built = ensureFourUniqueOptions(finalAnswer, distractors);
      options = built.options;
      defectMap = built.defectMap;
    }

    if (isStructure) {
      const workingExpected = isMultiple ? `${Y} / ${X} = ${Q}` : `${Y} / ${X} = ${Q} R ${R}`;
      const workingAccepted = makeDivisionAcceptedAnswers(Y, X, Q, R);

      const steps = [
        {
          label: `Write the working equation to test if ${Y} can be divided evenly by ${X}:`,
          expectedAnswer: workingExpected,
          acceptedAnswers: workingAccepted
        },
        {
          label: `Since ${Y} ${isMultiple ? "divides exactly with 0 leftovers" : `leaves a remainder of ${R}`}, is ${X} a factor of ${Y}? (Type Yes or No):`,
          expectedAnswer: isMultiple ? "Yes" : "No",
          acceptedAnswers: isMultiple ? YES_ACCEPTED : NO_ACCEPTED
        }
      ];

      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps }, null, 2);
    }

    solutionSteps = isMultiple
      ? `1. Test if ${Y} is a multiple of ${X} by dividing: ${Y} ÷ ${X} = ${Q}.\n2. Since the remainder is 0, ${name} can buy exactly ${Q} full bundles.\n3. Answer: Yes.`
      : `1. Test if ${Y} is a multiple of ${X} by dividing: ${Y} ÷ ${X} = ${Q} R ${R}.\n2. Since there is a remainder of ${R}, ${Y} cannot be made from whole bundles of ${X}.\n3. Answer: No.`;

    hint = `Divide ${Y} by ${X}. If it divides evenly with remainder 0, then ${Y} can be formed from exact bundles!`;

    promptInstruction = `CRITICAL INSTRUCTIONS:
- Question stem must describe buying ${itemPlural} in bundles of ${X} to reach ${Y} to test if ${X} is a factor of ${Y}.
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
Generate a foundation-level question for Singapore Primary 4 students.
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
