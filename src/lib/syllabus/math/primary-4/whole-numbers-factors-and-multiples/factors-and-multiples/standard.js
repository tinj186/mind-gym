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

export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, explicitVariety = null) {
  let promptInstruction = "";
  let finalAnswer = "";
  let options = [];
  let defectMap = {};
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let solutionSteps = "";
  let hint = "";

  const effectiveVariant = activeVariant || 'standard_common_factor_venn';

  // ==========================================================================
  // VARIANT 1: standard_common_factor_venn (Greatest Common Factor)
  // ==========================================================================
  if (effectiveVariant === 'standard_common_factor_venn') {
    const pairsPool = [
      [12, 18], [16, 24], [18, 27], [20, 30], [24, 36], 
      [15, 25], [14, 21], [24, 32], [28, 42], [30, 45]
    ];
    const [A, B] = pairsPool[Math.floor(Math.random() * pairsPool.length)];
    const factorsA = getFactors(A);
    const factorsB = getFactors(B);
    const commonFactors = factorsA.filter(f => factorsB.includes(f));
    const gcfVal = gcd(A, B);

    finalAnswer = gcfVal.toString();

    const questionText = `Find the greatest common factor of ${A} and ${B}.`;
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
          label: "Final Answer (Greatest Common Factor):",
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
      // Common misconceptions:
      // d1: Another common factor but not the greatest
      const smallerCF = commonFactors.filter(f => f !== gcfVal);
      const d1 = (smallerCF.length > 0 ? smallerCF[smallerCF.length - 1] : 1).toString();
      // d2: A multiple instead of a factor (e.g. LCM or A*B)
      const d2 = (Math.min(A, B)).toString();
      // d3: Off by one
      const d3 = (gcfVal + 1).toString();

      const mcqRes = ensureFourUniqueOptions(finalAnswer, [
        { val: d1, defect: "NOT_GREATEST_COMMON_FACTOR" },
        { val: d2, defect: "CONFUSED_WITH_ORIGINAL_NUMBER" },
        { val: d3, defect: "CARELESS_CALCULATION" }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    }

    solutionSteps = `Step 1: List all factors of ${A}: ${factorsA.join(', ')}.\\nStep 2: List all factors of ${B}: ${factorsB.join(', ')}.\\nStep 3: Identify the common factors: ${commonFactors.join(', ')}.\\nStep 4: The greatest common factor (GCF) is ${gcfVal}.`;
    hint = `List down all factors for both ${A} and ${B}, then circle the numbers that appear on both lists. Pick the biggest one!`;

  // ==========================================================================
  // VARIANT 2: standard_bounded_multiple_finder (Bounded Multiples)
  // ==========================================================================
  } else if (effectiveVariant === 'standard_bounded_multiple_finder') {
    const X = Math.floor(Math.random() * 6) + 4; // 4 to 9
    const k = Math.floor(Math.random() * 6) + 5; // 5 to 10
    const targetMultiple = X * k;

    // Bounds strictly framing targetMultiple
    const lowerBound = targetMultiple - Math.floor(Math.random() * (X - 2) + 2); // e.g. target - 3
    const upperBound = targetMultiple + Math.floor(Math.random() * (X - 2) + 2); // e.g. target + 3

    finalAnswer = targetMultiple.toString();

    if (!isStructure) {
      visualEngineStr = JSON.stringify({
        componentToRender: "NUMBER_LINE_ADVANCED",
        componentData: {
          start: lowerBound - 2,
          end: upperBound + 2,
          step: 1,
          markedPoints: [
            { value: lowerBound, label: `${lowerBound}` },
            { value: upperBound, label: `${upperBound}` }
          ],
          title: `Number Range: ${lowerBound} to ${upperBound}`
        }
      }, null, 2);
    } else {
      visualEngineStr = JSON.stringify({
        componentToRender: "NONE",
        hideVisual: true,
        componentData: { hideVisual: true }
      }, null, 2);
    }

    const questionText = `Find a multiple of ${X} that is between ${lowerBound} and ${upperBound}.`;
    promptInstruction = `- Question stem: "${questionText}"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isStructure) {
      const steps = [
        {
          label: `Write the working equation to find a multiple of ${X} just below the range:`,
          expectedAnswer: `${X} * ${k - 1} = ${X * (k - 1)}`,
          acceptedAnswers: [
            `${X} * ${k - 1} = ${X * (k - 1)}`,
            `${X} × ${k - 1} = ${X * (k - 1)}`,
            `${k - 1} * ${X} = ${X * (k - 1)}`,
            `${k - 1} × ${X} = ${X * (k - 1)}`,
            `${X} * ${k - 1}`,
            `${X} × ${k - 1}`
          ]
        },
        {
          label: `Write the working equation to find the multiple of ${X} strictly between ${lowerBound} and ${upperBound}:`,
          expectedAnswer: `${X} * ${k} = ${targetMultiple}`,
          acceptedAnswers: [
            `${X} * ${k} = ${targetMultiple}`,
            `${X} × ${k} = ${targetMultiple}`,
            `${k} * ${X} = ${targetMultiple}`,
            `${k} × ${X} = ${targetMultiple}`,
            `${targetMultiple} = ${X} * ${k}`,
            `${targetMultiple} = ${X} × ${k}`,
            `${X} * ${k}`,
            `${X} × ${k}`
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
      const d1 = (targetMultiple - X).toString(); // Out of bound (below)
      const d2 = (targetMultiple + X).toString(); // Out of bound (above)
      const d3 = (lowerBound + 1).toString(); // In bound but not multiple
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
      [3, 4], [4, 6], [6, 8], [4, 5], [3, 5], [6, 9]
    ];
    const [A, B] = pairs[Math.floor(Math.random() * pairs.length)];
    const firstLCM = lcm(A, B);
    const secondCM = firstLCM * 2;

    finalAnswer = secondCM.toString();

    const questionText = `What is the 2nd common multiple of ${A} and ${B}?`;
    promptInstruction = `- Question stem: "${questionText}"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isStructure) {
      const steps = [
        {
          label: `What is the first common multiple (LCM) of ${A} and ${B}?`,
          expectedAnswer: `${firstLCM}`,
          acceptedAnswers: [`${firstLCM}`]
        },
        {
          label: `Write the working equation to find the 2nd common multiple:`,
          expectedAnswer: `${firstLCM} * 2 = ${secondCM}`,
          acceptedAnswers: [
            `${firstLCM} * 2 = ${secondCM}`,
            `${firstLCM} × 2 = ${secondCM}`,
            `2 * ${firstLCM} = ${secondCM}`,
            `2 × ${firstLCM} = ${secondCM}`,
            `${firstLCM} + ${firstLCM} = ${secondCM}`,
            `${secondCM} = ${firstLCM} * 2`,
            `${secondCM} = ${firstLCM} × 2`,
            `${firstLCM} * 2`,
            `${firstLCM} × 2`,
            `${firstLCM} + ${firstLCM}`
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
      const d1 = (firstLCM).toString(); // Stopped at 1st common multiple
      const d2 = (firstLCM * 3).toString(); // 3rd common multiple
      const d3 = (A * B).toString(); // Direct product (if LCM is smaller)
      const mcqRes = ensureFourUniqueOptions(finalAnswer, [
        { val: d1, defect: "STOPPED_AT_FIRST_COMMON_MULTIPLE" },
        { val: d2, defect: "WRONG_MULTIPLE_INDEX" },
        { val: d3, defect: "CONFUSED_LCM_WITH_PRODUCT" }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    }

    solutionSteps = `Step 1: List the multiples of ${A}: ${A}, ${A * 2}, ${A * 3}, ${A * 4}...\\nStep 2: List the multiples of ${B}: ${B}, ${B * 2}, ${B * 3}, ${B * 4}...\\nStep 3: The 1st common multiple is ${firstLCM}.\\nStep 4: The 2nd common multiple is ${firstLCM} × 2 = ${secondCM}.`;
    hint = `Find the first common multiple first. Then multiply it by 2 to get the second common multiple!`;

  // ==========================================================================
  // VARIANT 4: standard_geometry_area_factors (Area & Factor Dimensions)
  // ==========================================================================
  } else if (effectiveVariant === 'standard_geometry_area_factors') {
    const [name] = getRandomNames(1);
    const configs = [
      { area: 36, length: 9, breadth: 4 },
      { area: 45, length: 9, breadth: 5 },
      { area: 48, length: 8, breadth: 6 },
      { area: 54, length: 9, breadth: 6 },
      { area: 56, length: 8, breadth: 7 },
      { area: 72, length: 9, breadth: 8 }
    ];
    const cfg = configs[Math.floor(Math.random() * configs.length)];
    const { area, length, breadth } = cfg;

    finalAnswer = breadth.toString();

    const questionText = `${name} drew a rectangle with an area of ${area} cm². The length and breadth of the rectangle are whole numbers. If the length is ${length} cm, what is the breadth of the rectangle?`;
    promptInstruction = `- Question stem: "${questionText}"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isStructure) {
      const steps = [
        {
          label: `Write the working equation to find the breadth:`,
          expectedAnswer: `${area} / ${length} = ${breadth}`,
          acceptedAnswers: [
            `${area} / ${length} = ${breadth}`,
            `${area} ÷ ${length} = ${breadth}`,
            `${breadth} = ${area} / ${length}`,
            `${breadth} = ${area} ÷ ${length}`,
            `${length} * ${breadth} = ${area}`,
            `${length} × ${breadth} = ${area}`,
            `${area} / ${length}`,
            `${area} ÷ ${length}`
          ]
        },
        {
          label: "Final Answer (in cm):",
          expectedAnswer: finalAnswer,
          acceptedAnswers: [finalAnswer, `${finalAnswer} cm`, `${finalAnswer}cm`]
        }
      ];

      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: steps
      }, null, 2);
    }

    if (isMCQ) {
      const d1 = (breadth + 1).toString();
      const d2 = (Math.max(1, breadth - 1)).toString();
      const d3 = (area - length).toString(); // Subtracted instead of divided
      const mcqRes = ensureFourUniqueOptions(finalAnswer, [
        { val: d1, defect: "OFF_BY_ONE_CALCULATION" },
        { val: d2, defect: "OFF_BY_ONE_CALCULATION" },
        { val: d3, defect: "CONFUSED_OPERATION_SUBTRACT" }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    }

    solutionSteps = `Step 1: The formula for the area of a rectangle is Area = Length × Breadth.\\nStep 2: Divide the area by the length: ${area} ÷ ${length} = ${breadth}.\\nStep 3: The breadth of the rectangle is ${breadth} cm.`;
    hint = `Area = Length × Breadth. Since you know the area and the length, divide to find the breadth!`;

  // ==========================================================================
  // VARIANT 5: standard_exclusion_packing (Factors excluding 1 and itself)
  // ==========================================================================
  } else {
    const [name] = getRandomNames(1);
    const itemObj = getRandomCountableItems(1);
    const item = itemObj?.item || "marbles";
    const itemSing = item.endsWith('s') ? item.slice(0, -1) : item;

    const totals = [24, 30, 36, 40, 48];
    const T = totals[Math.floor(Math.random() * totals.length)];
    const allFactors = getFactors(T);
    // Exclude 1 and T
    const allowedBags = allFactors.filter(f => f !== 1 && f !== T);
    const allowedCount = allowedBags.length;

    finalAnswer = allowedCount.toString();

    if (!isStructure) {
      visualEngineStr = JSON.stringify({
        componentToRender: "GRID_ARRAY",
        componentData: {
          rows: allowedBags[0] || 4,
          columns: T / (allowedBags[0] || 4),
          totalItems: T,
          itemShape: "dot",
          rowLabel: `${allowedBags[0] || 4} bags`,
          colLabel: `${T / (allowedBags[0] || 4)} ${item} each`,
          title: `Packing ${T} ${item}`
        }
      }, null, 2);
    } else {
      visualEngineStr = JSON.stringify({
        componentToRender: "NONE",
        hideVisual: true,
        componentData: { hideVisual: true }
      }, null, 2);
    }

    const questionText = `${name} has ${T} ${item} to pack equally into bags with no leftovers. ${name} cannot use only 1 bag, and cannot put only 1 ${itemSing} in each bag. How many different numbers of bags can ${name} use?`;
    promptInstruction = `- Question stem: "${questionText}"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isStructure) {
      const steps = [
        {
          label: `List all factors of ${T} in increasing order (separated by commas):`,
          expectedAnswer: allFactors.join(', '),
          acceptedAnswers: [allFactors.join(', '), allFactors.join(','), allFactors.join(' , ')]
        },
        {
          label: "Final Answer (Number of allowed ways to pack):",
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
      const d1 = (allFactors.length).toString(); // Included 1 and T
      const d2 = (allowedCount + 1).toString(); // Only excluded 1
      const d3 = (Math.max(1, allowedCount - 1)).toString();
      const mcqRes = ensureFourUniqueOptions(finalAnswer, [
        { val: d1, defect: "INCLUDED_EXTREME_FACTORS" },
        { val: d2, defect: "FAILED_TO_EXCLUDE_BOTH_EXTREMES" },
        { val: d3, defect: "CARELESS_CALCULATION" }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    }

    solutionSteps = `Step 1: Find all factors of ${T}: ${allFactors.join(', ')}.\\nStep 2: Apply the problem constraints: exclude 1 bag and exclude ${T} bags (since that would mean 1 in each bag).\\nStep 3: Allowed numbers of bags: ${allowedBags.join(', ')}.\\nStep 4: Count the allowed ways: ${allowedCount}.`;
    hint = `List all factors of ${T}. Remember to cross out 1 and ${T} because the problem says you cannot use 1 bag, nor have 1 in each bag!`;
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

${getFormatInstructions(visualEngineStr, inputRequirementStr, effectiveVariant)}`;

  return {
    aiPrompt,
    visualEngine: visualEngineStr ? (typeof visualEngineStr === 'string' ? JSON.parse(visualEngineStr) : visualEngineStr) : null,
    inputRequirement: inputRequirementStr ? (typeof inputRequirementStr === 'string' ? JSON.parse(inputRequirementStr) : inputRequirementStr) : null,
    acceptedAnswers: [finalAnswer]
  };
}
