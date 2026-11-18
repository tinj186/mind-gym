import { getRandomNames, getRandomCountableItems } from '../../../../../utils/variable-bank.js';

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

function gcd(a, b) {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

// Generate an extensive pool of authentic 2-digit pairs with GCF >= 2 (over 200 distinct combinations)
function getGcfPairsPool() {
  const pairs = [];
  const gcfList = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 16];
  for (const g of gcfList) {
    for (let m1 = 2; m1 <= 10; m1++) {
      for (let m2 = m1 + 1; m2 <= 10; m2++) {
        if (gcd(m1, m2) === 1) {
          const A = g * m1;
          const B = g * m2;
          if (A >= 10 && B >= 10 && A <= 100 && B <= 100) {
            pairs.push([A, B]);
          }
        }
      }
    }
  }
  return pairs;
}

const GCF_PAIRS_CACHE = getGcfPairsPool();

export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, explicitVariety = null) {
  let promptInstruction = "";
  let finalAnswer = "";
  let acceptedAnswers = [];
  let options = [];
  let defectMap = {};
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let solutionSteps = "";
  let hint = "";

  const effectiveVariant = activeVariant || 'standard_common_factor_venn';

  // ==========================================================================
  // VARIANT 1: standard_common_factor_venn (Common Factors & GCF)
  // ==========================================================================
  if (effectiveVariant === 'standard_common_factor_venn') {
    const pair = GCF_PAIRS_CACHE[Math.floor(Math.random() * GCF_PAIRS_CACHE.length)];
    // Randomly swap A and B for variety
    const [A, B] = Math.random() > 0.5 ? [pair[0], pair[1]] : [pair[1], pair[0]];
    const factorsA = getFactors(A);
    const factorsB = getFactors(B);
    const commonFactors = factorsA.filter(f => factorsB.includes(f));
    const gcfVal = gcd(A, B);

    // Sub-modes:
    // 1. "find_gcf": Direct GCF / HCF calculation
    // 2. "count_common_factors": Count how many common factors they have
    // 3. "word_problem": Practical division / packaging problem
    const subModes = ["find_gcf", "find_gcf", "count_common_factors", "word_problem"];
    const subMode = subModes[Math.floor(Math.random() * subModes.length)];

    let questionText = "";

    if (subMode === "find_gcf") {
      finalAnswer = gcfVal.toString();
      acceptedAnswers = [finalAnswer];

      const templates = [
        `What is the highest common factor (HCF) of ${A} and ${B}?`,
        `Find the highest common factor of ${A} and ${B}.`,
        `What is the greatest common factor of ${A} and ${B}?`,
        `What is the greatest number that divides both ${A} and ${B} without leaving a remainder?`
      ];
      questionText = templates[Math.floor(Math.random() * templates.length)];
      promptInstruction = `- Question stem: "${questionText}"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        const steps = [
          {
            label: `List all the factors of ${A} in increasing order (separated by commas):`,
            expectedAnswer: factorsA.join(', '),
            acceptedAnswers: [factorsA.join(', '), factorsA.join(','), factorsA.join(' , ')]
          },
          {
            label: `List all the factors of ${B} in increasing order (separated by commas):`,
            expectedAnswer: factorsB.join(', '),
            acceptedAnswers: [factorsB.join(', '), factorsB.join(','), factorsB.join(' , ')]
          },
          {
            label: `List the common factors of ${A} and ${B}:`,
            expectedAnswer: commonFactors.join(', '),
            acceptedAnswers: [commonFactors.join(', '), commonFactors.join(','), commonFactors.join(' , ')]
          },
          {
            label: "Final Answer (Highest Common Factor / HCF):",
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
        const smallerCF = commonFactors.filter(f => f !== gcfVal);
        const d1 = (smallerCF.length > 0 ? smallerCF[smallerCF.length - 1] : 1).toString();
        const d2 = (Math.min(A, B)).toString();
        const d3 = (gcfVal + 1).toString();

        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "NOT_HIGHEST_COMMON_FACTOR" },
          { val: d2, defect: "CONFUSED_WITH_ORIGINAL_NUMBER" },
          { val: d3, defect: "CARELESS_CALCULATION" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: List all factors of ${A}: ${factorsA.join(', ')}.\\nStep 2: List all factors of ${B}: ${factorsB.join(', ')}.\\nStep 3: Identify the common factors: ${commonFactors.join(', ')}.\\nStep 4: The highest common factor (HCF) is ${gcfVal}.`;
      hint = `List down all factors for both ${A} and ${B}, then circle the numbers that appear on both lists. Pick the biggest one!`;

    } else if (subMode === "count_common_factors") {
      finalAnswer = commonFactors.length.toString();
      acceptedAnswers = [finalAnswer];

      questionText = `How many common factors do ${A} and ${B} have?`;
      promptInstruction = `- Question stem: "${questionText}"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        const steps = [
          {
            label: `List all the factors of ${A} in increasing order (separated by commas):`,
            expectedAnswer: factorsA.join(', '),
            acceptedAnswers: [factorsA.join(', '), factorsA.join(','), factorsA.join(' , ')]
          },
          {
            label: `List all the factors of ${B} in increasing order (separated by commas):`,
            expectedAnswer: factorsB.join(', '),
            acceptedAnswers: [factorsB.join(', '), factorsB.join(','), factorsB.join(' , ')]
          },
          {
            label: `List the common factors of ${A} and ${B}:`,
            expectedAnswer: commonFactors.join(', '),
            acceptedAnswers: [commonFactors.join(', '), commonFactors.join(','), commonFactors.join(' , ')]
          },
          {
            label: "Final Answer (Total number of common factors):",
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
        const d1 = (commonFactors.length + 1).toString();
        const d2 = Math.max(1, commonFactors.length - 1).toString();
        const d3 = (commonFactors.length + 2).toString();

        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "OFF_BY_ONE_CALCULATION" },
          { val: d2, defect: "OFF_BY_ONE_CALCULATION" },
          { val: d3, defect: "CARELESS_COUNTING" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: List all factors of ${A}: ${factorsA.join(', ')}.\\nStep 2: List all factors of ${B}: ${factorsB.join(', ')}.\\nStep 3: Identify the common factors: ${commonFactors.join(', ')}.\\nStep 4: Count the common factors: there are ${finalAnswer} common factors altogether.`;
      hint = `Find the factors of each number, identify the numbers that appear on both lists, and count how many there are!`;

    } else {
      // word_problem: real-world sharing context
      const [name] = getRandomNames(1);
      const rawItems = getRandomCountableItems(2);
      const itemA = (rawItems[0] && typeof rawItems[0] === 'object' && rawItems[0].item) ? rawItems[0].item : (rawItems[0] || 'pencils');
      const itemB = (rawItems[1] && typeof rawItems[1] === 'object' && rawItems[1].item) ? rawItems[1].item : (rawItems[1] || 'erasers');
      finalAnswer = gcfVal.toString();
      acceptedAnswers = [finalAnswer];

      questionText = `${name} has ${A} ${itemA} and ${B} ${itemB}. ${name} wants to pack them equally into identical gift packs such that each pack contains the same number of ${itemA} and the same number of ${itemB} with none left over. What is the greatest number of gift packs ${name} can prepare?`;
      promptInstruction = `- Question stem: "${questionText}"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        const steps = [
          {
            label: `List all the factors of ${A}:`,
            expectedAnswer: factorsA.join(', '),
            acceptedAnswers: [factorsA.join(', '), factorsA.join(','), factorsA.join(' , ')]
          },
          {
            label: `List all the factors of ${B}:`,
            expectedAnswer: factorsB.join(', '),
            acceptedAnswers: [factorsB.join(', '), factorsB.join(','), factorsB.join(' , ')]
          },
          {
            label: "Final Answer (Greatest number of gift packs):",
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
        const smallerCF = commonFactors.filter(f => f !== gcfVal);
        const d1 = (smallerCF.length > 0 ? smallerCF[smallerCF.length - 1] : 1).toString();
        const d2 = (Math.min(A, B)).toString();
        const d3 = (gcfVal + 2).toString();

        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "NOT_GREATEST_COMMON_FACTOR" },
          { val: d2, defect: "CONFUSED_WITH_TOTAL_ITEMS" },
          { val: d3, defect: "CARELESS_CALCULATION" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: The number of identical packs must divide both ${A} and ${B} without remainder (a common factor).\\nStep 2: Factors of ${A}: ${factorsA.join(', ')}.\\nStep 3: Factors of ${B}: ${factorsB.join(', ')}.\\nStep 4: The greatest number of gift packs is the Highest Common Factor (HCF), which is ${finalAnswer}.`;
      hint = `To find the greatest number of identical packs with no leftovers, find the Highest Common Factor (HCF) of ${A} and ${B}!`;
    }

  // ==========================================================================
  // VARIANT 2: standard_bounded_multiple_finder (Bounded Multiples)
  // ==========================================================================
  } else if (effectiveVariant === 'standard_bounded_multiple_finder') {
    const X = Math.floor(Math.random() * 10) + 3; // 3 to 12
    const k = Math.floor(Math.random() * 10) + 3; // 3 to 12
    const targetMultiple = X * k;

    // Bounds strictly framing targetMultiple
    const lowerOffset = Math.floor(Math.random() * (X - 2)) + 1; // 1 to X-2
    const upperOffset = Math.floor(Math.random() * (X - 2)) + 1; // 1 to X-2
    const lowerBound = targetMultiple - lowerOffset;
    const upperBound = targetMultiple + upperOffset;

    finalAnswer = targetMultiple.toString();
    acceptedAnswers = [finalAnswer];

    visualEngineStr = JSON.stringify({
      componentToRender: "NONE",
      hideVisual: true,
      componentData: { hideVisual: true }
    }, null, 2);

    const [name] = getRandomNames(1);
    const templates = [
      `Find a multiple of ${X} that is between ${lowerBound} and ${upperBound}.`,
      `What number strictly between ${lowerBound} and ${upperBound} is a multiple of ${X}?`,
      `${name} is looking for a multiple of ${X} that lies between ${lowerBound} and ${upperBound}. What is this number?`
    ];
    const questionText = templates[Math.floor(Math.random() * templates.length)];
    promptInstruction = `- Question stem: "${questionText}"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isStructure) {
      const steps = [
        {
          label: `Write the multiple of ${X} just below ${lowerBound}:`,
          expectedAnswer: `${X} * ${k - 1} = ${X * (k - 1)}`,
          acceptedAnswers: [
            `${X} * ${k - 1} = ${X * (k - 1)}`,
            `${X} × ${k - 1} = ${X * (k - 1)}`,
            `${X * (k - 1)} = ${X} * ${k - 1}`,
            `${X * (k - 1)} = ${X} × ${k - 1}`,
            `${X} * ${k - 1}`,
            `${X} × ${k - 1}`,
            (X * (k - 1)).toString()
          ]
        },
        {
          label: `Write the multiple of ${X} that lands between ${lowerBound} and ${upperBound}:`,
          expectedAnswer: `${X} * ${k} = ${targetMultiple}`,
          acceptedAnswers: [
            `${X} * ${k} = ${targetMultiple}`,
            `${X} × ${k} = ${targetMultiple}`,
            `${targetMultiple} = ${X} * ${k}`,
            `${targetMultiple} = ${X} × ${k}`,
            `${X} * ${k}`,
            `${X} × ${k}`,
            targetMultiple.toString()
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
      const d1 = (X * (k - 1)).toString();
      const d2 = (X * (k + 1)).toString();
      const d3 = (targetMultiple + 1).toString();

      const mcqRes = ensureFourUniqueOptions(finalAnswer, [
        { val: d1, defect: "MULTIPLE_OUTSIDE_BOUNDS" },
        { val: d2, defect: "MULTIPLE_OUTSIDE_BOUNDS" },
        { val: d3, defect: "NOT_A_MULTIPLE" }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    }

    solutionSteps = `Step 1: Multiples of ${X} near ${lowerBound} are: ${X * (k - 1)}, ${targetMultiple}, ${X * (k + 1)}.\\nStep 2: Check which multiple lies strictly between ${lowerBound} and ${upperBound}: ${targetMultiple} satisfies ${lowerBound} < ${targetMultiple} < ${upperBound}.\\nStep 3: The multiple is ${targetMultiple}.`;
    hint = `Count by ${X}s until you find a number that lands strictly between ${lowerBound} and ${upperBound}!`;

  // ==========================================================================
  // VARIANT 3: standard_common_multiple_sequence (Common Multiples)
  // ==========================================================================
  } else if (effectiveVariant === 'standard_common_multiple_sequence') {
    const pairs = [
      [2, 3], [2, 5], [2, 7], [3, 4], [3, 5], [3, 7], [3, 8], [4, 5],
      [4, 6], [4, 7], [4, 9], [5, 6], [5, 7], [5, 8], [6, 8], [6, 9],
      [6, 10], [8, 10], [8, 12], [9, 12], [3, 10], [4, 10], [7, 8]
    ];
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    const [A, B] = Math.random() > 0.5 ? [pair[0], pair[1]] : [pair[1], pair[0]];
    const firstLCM = lcm(A, B);

    // Randomize N: 1st (LCM), 2nd, 3rd, or 4th common multiple
    const nList = [1, 2, 2, 3, 3, 4];
    const N = nList[Math.floor(Math.random() * nList.length)];
    const targetCM = firstLCM * N;

    finalAnswer = targetCM.toString();
    acceptedAnswers = [finalAnswer];

    const ordinals = ["1st", "2nd", "3rd", "4th"];
    const nOrd = ordinals[N - 1] || `${N}th`;

    const questionText = N === 1
      ? `What is the first common multiple (lowest common multiple) of ${A} and ${B}?`
      : `What is the ${nOrd} common multiple of ${A} and ${B}?`;

    promptInstruction = `- Question stem: "${questionText}"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isStructure) {
      const steps = [
        {
          label: `What is the first common multiple (LCM) of ${A} and ${B}?`,
          expectedAnswer: `${firstLCM}`,
          acceptedAnswers: [`${firstLCM}`]
        },
        {
          label: N === 1 ? `Write the first common multiple:` : `Write the working equation to find the ${nOrd} common multiple:`,
          expectedAnswer: N === 1 ? `${firstLCM}` : `${firstLCM} * ${N} = ${targetCM}`,
          acceptedAnswers: N === 1 ? [`${firstLCM}`] : [
            `${firstLCM} * ${N} = ${targetCM}`,
            `${firstLCM} × ${N} = ${targetCM}`,
            `${N} * ${firstLCM} = ${targetCM}`,
            `${N} × ${firstLCM} = ${targetCM}`,
            `${targetCM} = ${firstLCM} * ${N}`,
            `${targetCM} = ${firstLCM} × ${N}`,
            `${firstLCM} * ${N}`,
            `${firstLCM} × ${N}`,
            targetCM.toString()
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
      const d1 = (firstLCM * (N > 1 ? N - 1 : 2)).toString();
      const d2 = (firstLCM * (N + 1)).toString();
      const d3 = (A * B).toString();

      const mcqRes = ensureFourUniqueOptions(finalAnswer, [
        { val: d1, defect: "INCORRECT_MULTIPLE_INDEX" },
        { val: d2, defect: "INCORRECT_MULTIPLE_INDEX" },
        { val: d3, defect: "CONFUSED_PRODUCT_WITH_COMMON_MULTIPLE" }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    }

    solutionSteps = N === 1
      ? `Step 1: List the multiples of ${A}: ${A}, ${A*2}, ${A*3}...\\nStep 2: List the multiples of ${B}: ${B}, ${B*2}, ${B*3}...\\nStep 3: The first common multiple (LCM) is ${finalAnswer}.`
      : `Step 1: The first common multiple (LCM) of ${A} and ${B} is ${firstLCM}.\\nStep 2: Multiply the LCM by ${N} to find the ${nOrd} common multiple: ${firstLCM} × ${N} = ${finalAnswer}.`;
    hint = N === 1 
      ? `Find the multiples of both numbers and identify the first number that appears on both lists!`
      : `Find the first common multiple (LCM) first, then multiply it by ${N}!`;

  // ==========================================================================
  // VARIANT 4: standard_geometry_area_factors (Dimensions from Area & Factor Pairs)
  // ==========================================================================
  } else if (effectiveVariant === 'standard_geometry_area_factors') {
    const [name] = getRandomNames(1);

    // Sub-modes to thoroughly drill factor pairs and dimension constraints:
    // 1. "bounded_factor": Determine the dimension that falls within a given range by listing factors
    // 2. "perimeter_extremum": Find the greatest or smallest possible perimeter from factor pairs
    // 3. "count_rectangles": Count how many distinct rectangles can be formed with whole number sides
    // 4. "sum_or_diff_dimensions": Identify the length/breadth given the sum or difference of dimensions
    const subModes = [
      "bounded_factor",
      "perimeter_extremum",
      "count_rectangles",
      "sum_or_diff_dimensions"
    ];
    const subMode = subModes[Math.floor(Math.random() * subModes.length)];

    let questionText = "";

    if (subMode === "bounded_factor") {
      const areas = [24, 30, 32, 36, 40, 42, 48, 54, 60, 72, 80];
      const area = areas[Math.floor(Math.random() * areas.length)];
      const factors = getFactors(area);
      const nonExtreme = factors.filter(f => f > 2 && f < area / 2);
      const targetF = nonExtreme[Math.floor(Math.random() * nonExtreme.length)] || factors[2];
      const idx = factors.indexOf(targetF);
      const prevF = factors[idx - 1];
      const nextF = factors[idx + 1];
      const lower = prevF + 1;
      const upper = nextF - 1;

      finalAnswer = targetF.toString();
      acceptedAnswers = [finalAnswer, `${finalAnswer} cm`, `${finalAnswer}cm`];

      const isLength = targetF * targetF >= area;
      const dimName = isLength ? "length" : "breadth";

      const stems = [
        `${name} drew a rectangle with an area of ${area} cm². The length and breadth of the rectangle are whole numbers in cm. If the ${dimName} is longer than ${lower - 1} cm but shorter than ${upper + 1} cm, what is the ${dimName} of the rectangle?`,
        `A rectangle has an area of ${area} cm². Its length and breadth are whole numbers in cm. If its ${dimName} lies strictly between ${lower - 1} cm and ${upper + 1} cm, find the ${dimName} of the rectangle.`
      ];
      questionText = stems[Math.floor(Math.random() * stems.length)];
      promptInstruction = `- Question stem: "${questionText}"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isStructure) {
        const factorsJoined = factors.join(', ');
        const steps = [
          {
            label: `List all factors of ${area} in increasing order separated by commas (e.g. 1, 2, ...):`,
            expectedAnswer: factorsJoined,
            acceptedAnswers: [factorsJoined, factors.join(','), factors.join(' , ')]
          },
          {
            label: `Final Answer (${isLength ? 'Length' : 'Breadth'} in cm):`,
            expectedAnswer: finalAnswer,
            acceptedAnswers: acceptedAnswers
          }
        ];

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: steps
        }, null, 2);
      }

      if (isMCQ) {
        const d1 = prevF.toString();
        const d2 = (targetF + 1).toString();
        const d3 = (area / targetF).toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "FACTOR_OUTSIDE_GIVEN_RANGE" },
          { val: d2, defect: "NOT_A_FACTOR_OF_AREA" },
          { val: d3, defect: isLength ? "CONFUSED_BREADTH_WITH_LENGTH" : "CONFUSED_LENGTH_WITH_BREADTH" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: List all factors of ${area}: ${factors.join(', ')}.\\nStep 2: Find the factor that lies strictly between ${lower - 1} and ${upper + 1}.\\nStep 3: The only factor within this range is ${targetF}.\\nStep 4: Therefore, the ${dimName} of the rectangle is ${targetF} cm.`;
      hint = `List all factors of ${area}. Which factor is strictly between ${lower - 1} and ${upper + 1}?`;

    } else if (subMode === "perimeter_extremum") {
      const areas = [20, 24, 28, 30, 32, 36, 40, 48, 60];
      const area = areas[Math.floor(Math.random() * areas.length)];
      const pairs = getFactorPairs(area).filter(([b, L]) => b !== L);
      const perimeters = pairs.map(([b, L]) => 2 * (b + L));
      const minP = Math.min(...perimeters);
      const maxP = Math.max(...perimeters);

      const isGreatest = Math.random() > 0.5;
      const targetP = isGreatest ? maxP : minP;
      finalAnswer = targetP.toString();
      acceptedAnswers = [finalAnswer, `${finalAnswer} cm`, `${finalAnswer}cm`];

      const extremumWord = isGreatest ? "greatest" : "smallest";
      questionText = `A rectangle has an area of ${area} cm². The length and breadth are whole numbers in cm, and the length is strictly longer than the breadth. What is the ${extremumWord} possible perimeter of the rectangle?`;
      promptInstruction = `- Question stem: "${questionText}"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      const pairsText = pairs.map(([b, L]) => `${b} × ${L}`).join(', ');
      const perimCalculations = pairs.map(([b, L]) => `${b} × ${L} → 2 × (${L} + ${b}) = ${2 * (L + b)} cm`).join('\\n');

      if (isStructure) {
        const sortedPerims = [...new Set(perimeters)].sort((a, b) => a - b).join(', ');
        const steps = [
          {
            label: `List all possible perimeters (in cm) for an area of ${area} cm² in increasing order:`,
            expectedAnswer: sortedPerims,
            acceptedAnswers: [sortedPerims, sortedPerims.replace(/, /g, ',')]
          },
          {
            label: `Final Answer (${isGreatest ? 'Greatest' : 'Smallest'} perimeter in cm):`,
            expectedAnswer: finalAnswer,
            acceptedAnswers: acceptedAnswers
          }
        ];

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: steps
        }, null, 2);
      }

      if (isMCQ) {
        const otherP = isGreatest ? minP : maxP;
        const halfP = (targetP / 2).toString();
        const midP = perimeters.find(p => p !== targetP && p !== otherP) || (targetP + 2);
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: otherP.toString(), defect: "CHOSE_OPPOSITE_EXTREMUM" },
          { val: halfP, defect: "FORGOT_TO_DOUBLE_FOR_PERIMETER" },
          { val: midP.toString(), defect: "SUBOPTIMAL_FACTOR_PAIR" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: List all possible whole number factor pairs (breadth × length) for ${area} cm² where length > breadth: ${pairsText}.\\nStep 2: Calculate the perimeter for each pair using Perimeter = 2 × (Length + Breadth):\\n${perimCalculations}\\nStep 3: Comparing all perimeters, the ${extremumWord} possible perimeter is ${finalAnswer} cm.`;
      hint = `List all factor pairs of ${area}. For each pair, calculate the perimeter 2 × (Length + Breadth) and select the ${extremumWord} value!`;

    } else if (subMode === "count_rectangles") {
      const areas = [18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48, 50, 60];
      const area = areas[Math.floor(Math.random() * areas.length)];
      const pairs = getFactorPairs(area).filter(([b, L]) => b !== L);
      const count = pairs.length;

      finalAnswer = count.toString();
      acceptedAnswers = [finalAnswer];

      questionText = `${name} wants to draw a rectangle with an area of ${area} cm². The length and breadth must be whole numbers in cm, and the length must be strictly longer than the breadth. How many different rectangles can ${name} draw?`;
      promptInstruction = `- Question stem: "${questionText}"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      const pairsText = pairs.map(([b, L]) => `${b} × ${L}`).join(', ');

      if (isStructure) {
        const steps = [
          {
            label: `List all factor pairs (breadth × length) for ${area} where length > breadth (e.g. 1 x ${area}, ...):`,
            expectedAnswer: pairsText,
            acceptedAnswers: [
              pairsText,
              pairs.map(([b, L]) => `${b}*${L}`).join(', '),
              pairs.map(([b, L]) => `${b} x ${L}`).join(', ')
            ]
          },
          {
            label: "Final Answer (Number of different rectangles):",
            expectedAnswer: finalAnswer,
            acceptedAnswers: acceptedAnswers
          }
        ];

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: steps
        }, null, 2);
      }

      if (isMCQ) {
        const d1 = (count + 1).toString();
        const d2 = (Math.max(1, count - 1)).toString();
        const d3 = (getFactors(area).length).toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "INCLUDED_SQUARE_OR_REVERSED_PAIR" },
          { val: d2, defect: "MISSED_ONE_FACTOR_PAIR" },
          { val: d3, defect: "CONFUSED_FACTORS_WITH_FACTOR_PAIRS" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = `Step 1: List all whole number factor pairs that multiply to give ${area}: ${pairsText}.\\nStep 2: Since the length must be strictly longer than the breadth, each factor pair represents 1 unique rectangle.\\nStep 3: Count the pairs: there are ${count} different rectangles that can be formed.`;
      hint = `Find all pairs of whole numbers that multiply to give ${area} cm², where the length is longer than the breadth!`;

    } else {
      // subMode === "sum_or_diff_dimensions"
      const areas = [24, 30, 36, 40, 42, 48, 54, 60, 72];
      const area = areas[Math.floor(Math.random() * areas.length)];
      const pairs = getFactorPairs(area).filter(([b, L]) => b !== L && b > 1);
      const [b, L] = pairs[Math.floor(Math.random() * pairs.length)];

      const modeType = Math.random() > 0.5 ? 'sum' : 'diff';
      let metricVal = 0;

      if (modeType === 'sum') {
        metricVal = L + b;
        questionText = `${name} drew a rectangle with an area of ${area} cm². The length and breadth of the rectangle are whole numbers in cm. The sum of its length and breadth is ${metricVal} cm. What is the length of the rectangle?`;
      } else {
        metricVal = L - b;
        questionText = `${name} drew a rectangle with an area of ${area} cm². The length and breadth of the rectangle are whole numbers in cm. The length is ${metricVal} cm longer than the breadth. What is the length of the rectangle?`;
      }

      finalAnswer = L.toString();
      acceptedAnswers = [finalAnswer, `${finalAnswer} cm`, `${finalAnswer}cm`];
      promptInstruction = `- Question stem: "${questionText}"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      const allPairs = getFactorPairs(area);
      const allPairsText = allPairs.map(([x, y]) => `${x} × ${y}`).join(', ');

      if (isStructure) {
        const steps = [
          {
            label: `List all factor pairs of ${area} (e.g. 1 x ${area}, ...):`,
            expectedAnswer: allPairsText,
            acceptedAnswers: [
              allPairsText,
              allPairs.map(([x, y]) => `${x}*${y}`).join(', '),
              allPairs.map(([x, y]) => `${x} x ${y}`).join(', ')
            ]
          },
          {
            label: "Final Answer (Length in cm):",
            expectedAnswer: finalAnswer,
            acceptedAnswers: acceptedAnswers
          }
        ];

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: steps
        }, null, 2);
      }

      if (isMCQ) {
        const d1 = b.toString();
        const otherFactors = getFactors(area).filter(f => f !== L && f !== b);
        const d2 = (otherFactors[0] || (L + 1)).toString();
        const d3 = (metricVal).toString();
        const mcqRes = ensureFourUniqueOptions(finalAnswer, [
          { val: d1, defect: "CONFUSED_BREADTH_WITH_LENGTH" },
          { val: d2, defect: "WRONG_FACTOR_PAIR" },
          { val: d3, defect: "USED_GIVEN_METRIC_VALUE" }
        ]);
        options = mcqRes.options;
        defectMap = mcqRes.defectMap;
      }

      solutionSteps = modeType === 'sum'
        ? `Step 1: List all factor pairs of ${area}: ${allPairsText}.\\nStep 2: Find the pair whose sum equals ${metricVal} cm: ${b} + ${L} = ${metricVal} cm.\\nStep 3: Since length is the longer side, the length of the rectangle is ${L} cm.`
        : `Step 1: List all factor pairs of ${area}: ${allPairsText}.\\nStep 2: Find the pair whose difference equals ${metricVal} cm: ${L} - ${b} = ${metricVal} cm.\\nStep 3: Since length is the longer side, the length of the rectangle is ${L} cm.`;
      hint = `Find the factor pairs of ${area} that multiply to ${area}, then find which pair has a ${modeType === 'sum' ? 'sum' : 'difference'} of ${metricVal}!`;
    }

  // ==========================================================================
  // VARIANT 5: standard_exclusion_packing (Factor Configurations)
  // ==========================================================================
  } else {
    const [name] = getRandomNames(1);
    const rawItem = getRandomCountableItems(1)[0];
    const item = (rawItem && typeof rawItem === 'object' && rawItem.item) ? rawItem.item : (rawItem || 'sweets');
    const totals = [
      18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 
      48, 50, 54, 56, 60, 64, 70, 72, 80, 84, 90, 96
    ];
    const T = totals[Math.floor(Math.random() * totals.length)];
    const allFactors = getFactors(T);
    // Exclude 1 and T (must be more than 1 item per bag, and more than 1 bag)
    const allowedBags = allFactors.filter(f => f !== 1 && f !== T);
    const allowedCount = allowedBags.length;

    finalAnswer = allowedCount.toString();
    acceptedAnswers = [finalAnswer];

    visualEngineStr = JSON.stringify({
      componentToRender: "NONE",
      hideVisual: true,
      componentData: { hideVisual: true }
    }, null, 2);

    const questionText = `${name} has ${T} ${item}. ${name} wants to pack all the ${item} equally into bags such that each bag has more than 1 ${item}, and there is more than 1 bag. In how many different ways can ${name} pack the ${item}?`;
    promptInstruction = `- Question stem: "${questionText}"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isStructure) {
      const steps = [
        {
          label: `List all factors of ${T} in increasing order:`,
          expectedAnswer: allFactors.join(', '),
          acceptedAnswers: [allFactors.join(', '), allFactors.join(','), allFactors.join(' , ')]
        },
        {
          label: `How many factors are there after excluding 1 and ${T}?`,
          expectedAnswer: finalAnswer,
          acceptedAnswers: [finalAnswer]
        },
        {
          label: "Final Answer (Number of different ways):",
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
      const d1 = allFactors.length.toString(); // Included 1 and T
      const d2 = Math.floor(allFactors.length / 2).toString(); // Counted pairs instead of individual bag sizes
      const d3 = (allowedCount + 1).toString();

      const mcqRes = ensureFourUniqueOptions(finalAnswer, [
        { val: d1, defect: "INCLUDED_EXCLUDED_BOUNDARIES" },
        { val: d2, defect: "COUNTED_PAIRS_INSTEAD_OF_FACTORS" },
        { val: d3, defect: "OFF_BY_ONE_CALCULATION" }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    }

    solutionSteps = `Step 1: List all factors of ${T}: ${allFactors.join(', ')}.\\nStep 2: Exclude 1 and ${T} because each bag has more than 1 ${item} and there is more than 1 bag: ${allowedBags.join(', ')}.\\nStep 3: Count the remaining factors: there are ${finalAnswer} ways to pack them.`;
    hint = `List all factors of ${T}, then cross out 1 and ${T} itself! Count how many factors remain.`;
  }

  const mcqInstruction = isMCQ ? `- Generate EXACTLY 4 options: ${JSON.stringify(options)}.\\n- Set defectMap to: ${JSON.stringify(defectMap)}.` : "";

  const aiPrompt = `You are an expert Singapore Primary 4 Math educator.
Generate a standard-level question for Singapore Primary 4 students.
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

${getFormatInstructions(visualEngineStr, inputRequirementStr, effectiveVariant, acceptedAnswers)}`;

  return {
    aiPrompt,
    visualEngine: visualEngineStr ? (typeof visualEngineStr === 'string' ? JSON.parse(visualEngineStr) : visualEngineStr) : null,
    inputRequirement: inputRequirementStr ? (typeof inputRequirementStr === 'string' ? JSON.parse(inputRequirementStr) : inputRequirementStr) : null,
    acceptedAnswers: acceptedAnswers.length > 0 ? acceptedAnswers : [finalAnswer]
  };
}
