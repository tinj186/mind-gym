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
    const fallback = isNaN(numAnswer) ? `${finalAnswer} (Option ${counter})` : (numAnswer + counter).toString();
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

const ordinals = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"];

export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, explicitVariety = null) {
  let promptInstruction = "";
  let finalAnswer = "";
  let options = [];
  let defectMap = {};
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let solutionSteps = "";
  let hint = "";

  const effectiveVariant = activeVariant || 'foundation_rainbow_pairing';

  // ==========================================================================
  // VARIANT 1: foundation_rainbow_pairing (Missing Factor in Pair)
  // ==========================================================================
  if (effectiveVariant === 'foundation_rainbow_pairing') {
    const [name] = getRandomNames(1);
    const targets = [12, 16, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48, 54, 60];
    const T = targets[Math.floor(Math.random() * targets.length)];
    const allFactors = getFactors(T);
    const allPairs = getFactorPairs(T);

    // Pick a non-trivial factor pair (prefer not 1 x T if other pairs exist)
    const validPairs = allPairs.filter(([a, b]) => a !== 1 && a !== b);
    const selectedPair = validPairs.length > 0 
      ? validPairs[Math.floor(Math.random() * validPairs.length)] 
      : allPairs[Math.floor(Math.random() * allPairs.length)];

    const swap = Math.random() < 0.5;
    const givenFactor = swap ? selectedPair[0] : selectedPair[1];
    const missingFactor = swap ? selectedPair[1] : selectedPair[0];

    finalAnswer = missingFactor.toString();

    const hiddenIndex = allFactors.indexOf(missingFactor);

    if (!isStructure) {
      visualEngineStr = JSON.stringify({
        componentToRender: "FACTOR_RAINBOW",
        componentData: {
          targetNumber: T,
          factors: allFactors,
          pairs: allPairs,
          hiddenIndex: hiddenIndex,
          hiddenValue: missingFactor,
          title: `Factor Rainbow for ${T}`
        }
      }, null, 2);
    } else {
      visualEngineStr = JSON.stringify({
        componentToRender: "NONE",
        hideVisual: true,
        componentData: { hideVisual: true }
      }, null, 2);
    }

    const questionText = `${name} is finding factor pairs for ${T}. Since ${givenFactor} × ? = ${T}, what is the missing factor of ${T}?`;
    promptInstruction = `- Question stem: "${questionText}"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isStructure) {
      const steps = [
        {
          label: `Write the working equation to find the missing factor:`,
          expectedAnswer: `${T} / ${givenFactor} = ${missingFactor}`,
          acceptedAnswers: [
            `${T} / ${givenFactor} = ${missingFactor}`,
            `${T} ÷ ${givenFactor} = ${missingFactor}`,
            `${missingFactor} = ${T} / ${givenFactor}`,
            `${missingFactor} = ${T} ÷ ${givenFactor}`,
            `${givenFactor} * ${missingFactor} = ${T}`,
            `${givenFactor} × ${missingFactor} = ${T}`,
            `${missingFactor} * ${givenFactor} = ${T}`,
            `${missingFactor} × ${givenFactor} = ${T}`,
            `${T} / ${givenFactor}`,
            `${T} ÷ ${givenFactor}`
          ]
        },
        {
          label: "Final Answer:",
          expectedAnswer: finalAnswer,
          acceptedAnswers: [finalAnswer]
        }
      ];

      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: steps
      }, null, 2);
    }

    if (isMCQ) {
      const d1 = (missingFactor + 1).toString();
      const d2 = (Math.max(1, missingFactor - 1)).toString();
      const d3 = (T - givenFactor).toString(); // Subtraction misconception
      const mcqRes = ensureFourUniqueOptions(finalAnswer, [
        { val: d1, defect: "OFF_BY_ONE_CALCULATION" },
        { val: d2, defect: "OFF_BY_ONE_CALCULATION" },
        { val: d3, defect: "CONFUSED_OPERATION_SUBTRACT" }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    }

    solutionSteps = `Step 1: A factor pair multiplies together to give the target number: ${givenFactor} × ? = ${T}.\\nStep 2: Divide the target number by the given factor: ${T} ÷ ${givenFactor} = ${missingFactor}.\\nStep 3: The missing factor is ${missingFactor}.`;
    hint = `Remember that factors come in pairs! Divide ${T} by ${givenFactor} to find its partner factor.`;

  // ==========================================================================
  // VARIANT 2: foundation_multiple_skip_counter (N-th Multiple)
  // ==========================================================================
  } else if (effectiveVariant === 'foundation_multiple_skip_counter') {
    const base = Math.floor(Math.random() * 8) + 3; // 3 to 10
    const n = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const mult = base * n;
    const nOrdinal = ordinals[n - 1] || `${n}th`;

    finalAnswer = mult.toString();

    if (!isStructure) {
      visualEngineStr = JSON.stringify({
        componentToRender: "GRID_ARRAY",
        componentData: {
          rows: n,
          columns: base,
          itemShape: "dot",
          rowLabel: `${n} rows`,
          colLabel: `${base} per row`,
          title: `Array Model: ${n} rows of ${base}`,
          showTotal: '?',
          showEquation: false
        }
      }, null, 2);
    } else {
      visualEngineStr = JSON.stringify({
        componentToRender: "NONE",
        hideVisual: true,
        componentData: { hideVisual: true }
      }, null, 2);
    }

    const questionText = `What is the ${nOrdinal} multiple of ${base}?`;
    promptInstruction = `- Question stem: "${questionText}"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isStructure) {
      const steps = [
        {
          label: `Write the working equation to find the required multiple:`,
          expectedAnswer: `${n} * ${base} = ${mult}`,
          acceptedAnswers: [
            `${n} * ${base} = ${mult}`,
            `${n} × ${base} = ${mult}`,
            `${base} * ${n} = ${mult}`,
            `${base} × ${n} = ${mult}`,
            `${mult} = ${n} * ${base}`,
            `${mult} = ${n} × ${base}`,
            `${mult} = ${base} * ${n}`,
            `${mult} = ${base} × ${n}`,
            `${n} * ${base}`,
            `${base} * ${n}`,
            `${n} × ${base}`,
            `${base} × ${n}`
          ]
        },
        {
          label: "Final Answer:",
          expectedAnswer: finalAnswer,
          acceptedAnswers: [finalAnswer]
        }
      ];

      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: steps
      }, null, 2);
    }

    if (isMCQ) {
      const d1 = ((n - 1) * base).toString();
      const d2 = ((n + 1) * base).toString();
      const d3 = (n + base).toString();
      const mcqRes = ensureFourUniqueOptions(finalAnswer, [
        { val: d1, defect: "OFF_BY_ONE_MULTIPLE" },
        { val: d2, defect: "OFF_BY_ONE_MULTIPLE" },
        { val: d3, defect: "CONFUSED_OPERATION_ADD" }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    }

    solutionSteps = `Step 1: The ${nOrdinal} multiple of ${base} means counting by ${base}s, ${n} times.\\nStep 2: Multiply ${n} by ${base}: ${n} × ${base} = ${mult}.\\nStep 3: The ${nOrdinal} multiple of ${base} is ${mult}.`;
    hint = `To find the ${nOrdinal} multiple of ${base}, multiply ${base} by ${n}!`;

  // ==========================================================================
  // VARIANT 3: foundation_boundary_constraints_all_factors (Total Factors Count)
  // ==========================================================================
  } else if (effectiveVariant === 'foundation_boundary_constraints_all_factors') {
    const candidateNumbers = [12, 16, 18, 20, 24, 28, 30, 36, 40, 45];
    const T = candidateNumbers[Math.floor(Math.random() * candidateNumbers.length)];
    const allFactors = getFactors(T);
    const count = allFactors.length;
    const allPairs = getFactorPairs(T);

    finalAnswer = count.toString();

    if (!isStructure) {
      visualEngineStr = JSON.stringify({
        componentToRender: "FACTOR_RAINBOW",
        componentData: {
          targetNumber: T,
          factors: allFactors,
          pairs: allPairs,
          title: `All Factors of ${T}`
        }
      }, null, 2);
    } else {
      visualEngineStr = JSON.stringify({
        componentToRender: "NONE",
        hideVisual: true,
        componentData: { hideVisual: true }
      }, null, 2);
    }

    const questionText = `How many factors does ${T} have altogether?`;
    promptInstruction = `- Question stem: "${questionText}"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isStructure) {
      const factorsJoined = allFactors.join(', ');
      const steps = [
        {
          label: `List all the factors of ${T} in increasing order separated by commas (e.g. 1, 2, ...):`,
          expectedAnswer: factorsJoined,
          acceptedAnswers: [
            factorsJoined,
            allFactors.join(','),
            allFactors.join(' , ')
          ]
        },
        {
          label: "Final Answer (Total number of factors):",
          expectedAnswer: finalAnswer,
          acceptedAnswers: [finalAnswer]
        }
      ];

      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: steps
      }, null, 2);
    }

    if (isMCQ) {
      const d1 = (count - 1).toString();
      const d2 = (count + 1).toString();
      const d3 = (allPairs.length).toString(); // Student counted pairs instead of individual factors
      const mcqRes = ensureFourUniqueOptions(finalAnswer, [
        { val: d1, defect: "OFF_BY_ONE_COUNT" },
        { val: d2, defect: "OFF_BY_ONE_COUNT" },
        { val: d3, defect: "CONFUSED_PAIRS_WITH_FACTORS" }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    }

    solutionSteps = `Step 1: List all factor pairs of ${T}: ${allPairs.map(([a, b]) => `${a} × ${b} = ${T}`).join(', ')}.\\nStep 2: List all distinct factors in order: ${allFactors.join(', ')}.\\nStep 3: Count the total number of factors: ${count}.`;
    hint = `List down all the factor pairs starting from 1 × ${T}. Don't forget 1 and ${T} itself!`;

  // ==========================================================================
  // VARIANT 4: foundation_relationship_true_false (Factor vs Multiple)
  // ==========================================================================
  } else if (effectiveVariant === 'foundation_relationship_true_false') {
    const factor = Math.floor(Math.random() * 6) + 4; // 4 to 9
    const k = Math.floor(Math.random() * 6) + 3; // 3 to 8
    const multiple = factor * k;

    // Toggle whether asking if F is a factor of M, or M is a multiple of F
    const askForFactor = Math.random() < 0.5;

    let questionText = "";
    if (askForFactor) {
      questionText = `${multiple} is a multiple of ${factor}. Therefore, ${factor} is a _____ of ${multiple}.`;
      finalAnswer = "factor";
    } else {
      questionText = `${factor} is a factor of ${multiple}. Therefore, ${multiple} is a _____ of ${factor}.`;
      finalAnswer = "multiple";
    }

    promptInstruction = `- Question stem: "${questionText}"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isStructure) {
      const steps = [
        {
          label: `Write the working equation showing how ${multiple} and ${factor} relate:`,
          expectedAnswer: `${factor} * ${k} = ${multiple}`,
          acceptedAnswers: [
            `${factor} * ${k} = ${multiple}`,
            `${factor} × ${k} = ${multiple}`,
            `${k} * ${factor} = ${multiple}`,
            `${k} × ${factor} = ${multiple}`,
            `${multiple} / ${factor} = ${k}`,
            `${multiple} ÷ ${factor} = ${k}`,
            `${multiple} = ${factor} * ${k}`,
            `${multiple} = ${factor} × ${k}`
          ]
        },
        {
          label: "Fill in the blank (factor / multiple):",
          expectedAnswer: finalAnswer,
          acceptedAnswers: [finalAnswer, finalAnswer.toLowerCase(), finalAnswer.toUpperCase()]
        }
      ];

      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: steps
      }, null, 2);
    }

    if (isMCQ) {
      const mcqRes = ensureFourUniqueOptions(finalAnswer, [
        { val: askForFactor ? "multiple" : "factor", defect: "CONFUSED_FACTOR_AND_MULTIPLE" },
        { val: "remainder", defect: "VOCABULARY_ERROR" },
        { val: "product", defect: "VOCABULARY_ERROR" }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    }

    solutionSteps = askForFactor
      ? `Step 1: Since ${factor} × ${k} = ${multiple}, ${multiple} is a multiple of ${factor}.\\nStep 2: Conversely, any number that divides ${multiple} with no remainder is its factor.\\nStep 3: Therefore, ${factor} is a factor of ${multiple}.`
      : `Step 1: Since ${factor} divides ${multiple} exactly (${multiple} ÷ ${factor} = ${k}), ${factor} is a factor of ${multiple}.\\nStep 2: When you multiply ${factor} by ${k}, you get ${multiple}.\\nStep 3: Therefore, ${multiple} is a multiple of ${factor}.`;
    hint = `Remember: factors are smaller numbers that divide into a number. Multiples are larger numbers produced by multiplying!`;

  // ==========================================================================
  // VARIANT 5: foundation_digit_card_multiples (Form Multiple from Cards)
  // ==========================================================================
  } else {
    // Digit Card Multiples: Divisibility by 2, 5, or 10
    const divisors = [2, 5, 10];
    const D = divisors[Math.floor(Math.random() * divisors.length)];

    let c1, c2, c3;
    let validMultiples = [];

    if (D === 5) {
      // Must include 5 (or 0), plus two other digits
      const others = [1, 2, 3, 4, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
      c1 = others[0];
      c2 = 5;
      c3 = others[1];
      validMultiples = [`${c1}5`, `${c3}5`];
    } else if (D === 10) {
      const others = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
      c1 = others[0];
      c2 = 0;
      c3 = others[1];
      validMultiples = [`${c1}0`, `${c3}0`];
    } else {
      // D === 2 (Even number)
      const evens = [2, 4, 6, 8].sort(() => Math.random() - 0.5);
      const odds = [1, 3, 5, 7, 9].sort(() => Math.random() - 0.5);
      c1 = odds[0];
      c2 = evens[0];
      c3 = odds[1];
      validMultiples = [`${c1}${c2}`, `${c3}${c2}`];
    }

    const cards = [c1, c2, c3].sort(() => Math.random() - 0.5);
    finalAnswer = validMultiples[0];

    if (!isStructure) {
      visualEngineStr = JSON.stringify({
        componentToRender: "DIGIT_CARD_SORTER",
        componentData: {
          cards: cards,
          targetDescription: `Form a multiple of ${D}`
        }
      }, null, 2);
    } else {
      visualEngineStr = JSON.stringify({
        componentToRender: "NONE",
        hideVisual: true,
        componentData: { hideVisual: true }
      }, null, 2);
    }

    const questionText = `Given the three digit cards: [${cards.join(', ')}], form a 2-digit number using two of the cards that is a multiple of ${D}.`;
    promptInstruction = `- Question stem: "${questionText}"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isStructure) {
      const steps = [
        {
          label: `To be a multiple of ${D}, what must the last digit (ones place) be?`,
          expectedAnswer: D === 2 ? `${c2}` : (D === 5 ? "5" : "0"),
          acceptedAnswers: [D === 2 ? `${c2}` : (D === 5 ? "5" : "0")]
        },
        {
          label: `Form a 2-digit multiple of ${D} from the cards:`,
          expectedAnswer: finalAnswer,
          acceptedAnswers: validMultiples
        }
      ];

      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: steps
      }, null, 2);
    }

    if (isMCQ) {
      // Create invalid combinations (e.g. reverse digits where last digit is not divisible)
      const invalid1 = `${c2}${c1}`;
      const invalid2 = `${c2}${c3}`;
      const invalid3 = `${c1}${c3}`;
      const mcqRes = ensureFourUniqueOptions(finalAnswer, [
        { val: invalid1, defect: "DIVISIBILITY_RULE_VIOLATION" },
        { val: invalid2, defect: "DIVISIBILITY_RULE_VIOLATION" },
        { val: invalid3, defect: "DIVISIBILITY_RULE_VIOLATION" }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    }

    solutionSteps = `Step 1: Check the divisibility rule for ${D}: a multiple of ${D} must end in ${D === 2 ? 'an even digit' : (D === 5 ? '0 or 5' : '0')}.\\nStep 2: From the cards [${cards.join(', ')}], the ones digit must be ${D === 2 ? c2 : (D === 5 ? '5' : '0')}.\\nStep 3: Pair it with one of the other cards to form a 2-digit number: ${validMultiples.join(' or ')}.`;
    hint = `Think about the last digit! What must the ones place be for a number to be a multiple of ${D}?`;
  }

  const mcqInstruction = isMCQ ? `- Generate EXACTLY 4 options: ${JSON.stringify(options)}.\\n- Set defectMap to: ${JSON.stringify(defectMap)}.` : "";

  const aiPrompt = `You are an expert Singapore Primary 4 Math educator.
Generate a foundation-level question for Singapore Primary 4 students.
Topic: ${topic}
Subtopic: Factors and Multiples
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
