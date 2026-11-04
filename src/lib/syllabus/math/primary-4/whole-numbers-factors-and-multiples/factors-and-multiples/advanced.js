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

export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, explicitVariety = null) {
  let promptInstruction = "";
  let finalAnswer = "";
  let options = [];
  let defectMap = {};
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let solutionSteps = "";
  let hint = "";

  const effectiveVariant = activeVariant || 'advanced_mystery_number_dual_constraints';

  // ==========================================================================
  // VARIANT 1: advanced_mystery_number_dual_constraints (Dual Constraints)
  // ==========================================================================
  if (effectiveVariant === 'advanced_mystery_number_dual_constraints') {
    const pool = [
      { M: 6, F: 72, low: 20, high: 30, ans: 24 },
      { M: 4, F: 60, low: 16, high: 24, ans: 20 },
      { M: 7, F: 84, low: 22, high: 34, ans: 28 },
      { M: 8, F: 96, low: 20, high: 30, ans: 24 },
      { M: 9, F: 72, low: 10, high: 25, ans: 18 },
      { M: 5, F: 90, low: 25, high: 35, ans: 30 },
      { M: 8, F: 80, low: 35, high: 45, ans: 40 },
      { M: 3, F: 45, low: 10, high: 20, ans: 15 },
      { M: 6, F: 90, low: 25, high: 35, ans: 30 }
    ];

    const item = pool[Math.floor(Math.random() * pool.length)];
    const { M, F, low, high, ans } = item;
    finalAnswer = ans.toString();

    // Multiples of M strictly between low and high
    const multiplesInRange = [];
    for (let m = M; m < high; m += M) {
      if (m > low && m < high) multiplesInRange.push(m);
    }

    // Factors of F strictly between low and high
    const allFactorsF = getFactors(F);
    const factorsInRange = allFactorsF.filter(f => f > low && f < high);

    const askText = `I am a multiple of ${M}. I am a factor of ${F}. I am greater than ${low} but less than ${high}. What number am I?`;

    promptInstruction = `The question must strictly be: "${askText}"`;

    if (isStructure) {
      visualEngineStr = JSON.stringify({
        componentToRender: "INTERACTIVE_SCRIBBLE_CANVAS",
        componentData: {
          watermarkText: "Use this space to list factors, multiples, or working",
          backgroundGrid: true
        }
      }, null, 2);

      const steps = [
        {
          label: `Write the multiples of ${M} between ${low} and ${high}:`,
          type: "text",
          expectedAnswer: multiplesInRange.join(', '),
          expected: multiplesInRange.join(', ')
        },
        {
          label: `Write the factors of ${F} between ${low} and ${high}:`,
          type: "text",
          expectedAnswer: factorsInRange.join(', '),
          expected: factorsInRange.join(', ')
        },
        {
          label: "Final Answer:",
          type: "text",
          expectedAnswer: finalAnswer,
          expected: finalAnswer
        }
      ];

      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: steps
      }, null, 2);
    } else {
      visualEngineStr = JSON.stringify({
        componentToRender: "NONE",
        componentData: { hideVisual: true }
      }, null, 2);
    }

    if (isMCQ) {
      // Find a factor of F that is NOT a multiple of M
      const factorNotMultiple = factorsInRange.find(f => f % M !== 0) || (low + 1);
      // Find a multiple of M that is out of range or not factor
      const dist1 = (ans - M).toString();
      const dist2 = (ans + M).toString();
      const dist3 = factorNotMultiple.toString();

      const mcqRes = ensureFourUniqueOptions(finalAnswer, [
        { val: dist1, defect: "OUT_OF_BOUNDS" },
        { val: dist2, defect: "OUT_OF_BOUNDS" },
        { val: dist3, defect: "NOT_A_MULTIPLE" }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    }

    solutionSteps = `Step 1: Multiples of ${M} between ${low} and ${high}: ${multiplesInRange.join(', ')}.\\nStep 2: Factors of ${F} between ${low} and ${high}: ${factorsInRange.join(', ')}.\\nStep 3: The only number that is both a multiple of ${M} and a factor of ${F} is ${finalAnswer}.`;
    hint = `List all multiples of ${M} in the given range, then test which one is an exact divisor (factor) of ${F}!`;
  }

  // ==========================================================================
  // VARIANT 2: advanced_synchronization_periodic_intervals (Meeting Intervals / LCM)
  // ==========================================================================
  else if (effectiveVariant === 'advanced_synchronization_periodic_intervals') {
    const pairsPool = [
      { i1: 6, i2: 8, lcmVal: 24, routeA: "12", routeB: "34" },
      { i1: 8, i2: 12, lcmVal: 24, routeA: "51", routeB: "62" },
      { i1: 6, i2: 9, lcmVal: 18, routeA: "7", routeB: "15" },
      { i1: 4, i2: 10, lcmVal: 20, routeA: "85", routeB: "98" },
      { i1: 9, i2: 12, lcmVal: 36, routeA: "105", routeB: "143" },
      { i1: 10, i2: 15, lcmVal: 30, routeA: "21", routeB: "65" },
      { i1: 12, i2: 15, lcmVal: 60, routeA: "166", routeB: "174" },
      { i1: 8, i2: 10, lcmVal: 40, routeA: "3", routeB: "19" },
      { i1: 6, i2: 10, lcmVal: 30, routeA: "80", routeB: "87" },
      { i1: 15, i2: 20, lcmVal: 60, routeA: "190", routeB: "972" }
    ];

    const item = pairsPool[Math.floor(Math.random() * pairsPool.length)];
    const { i1, i2, lcmVal, routeA, routeB } = item;
    finalAnswer = lcmVal.toString();

    const m1List = [i1, i1 * 2, i1 * 3, i1 * 4];
    const m2List = [i2, i2 * 2, i2 * 3, i2 * 4];

    const askText = `At a bus interchange, Service ${routeA} departs every ${i1} minutes and Service ${routeB} departs every ${i2} minutes. If both bus services depart together at 8:00 a.m., in how many minutes will they next depart together?`;

    promptInstruction = `The question must strictly be: "${askText}"`;

    if (isStructure) {
      visualEngineStr = JSON.stringify({
        componentToRender: "INTERACTIVE_SCRIBBLE_CANVAS",
        componentData: {
          watermarkText: "Draw timeline or list periodic multiples here",
          backgroundGrid: true
        }
      }, null, 2);

      const steps = [
        {
          label: `Write the first 4 multiples of ${i1}:`,
          type: "text",
          expectedAnswer: m1List.join(', '),
          expected: m1List.join(', ')
        },
        {
          label: `Write the first 4 multiples of ${i2}:`,
          type: "text",
          expectedAnswer: m2List.join(', '),
          expected: m2List.join(', ')
        },
        {
          label: "Write the lowest common multiple (LCM):",
          type: "text",
          expectedAnswer: finalAnswer,
          expected: finalAnswer
        },
        {
          label: "Final Answer (in minutes):",
          type: "text",
          expectedAnswer: finalAnswer,
          expected: finalAnswer
        }
      ];

      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: steps
      }, null, 2);
    } else {
      visualEngineStr = JSON.stringify({
        componentToRender: "NONE",
        componentData: { hideVisual: true }
      }, null, 2);
    }

    if (isMCQ) {
      const sumDist = (i1 + i2).toString();
      const prodDist = (i1 * i2).toString();
      const diffDist = Math.abs(i1 - i2).toString();

      const mcqRes = ensureFourUniqueOptions(finalAnswer, [
        { val: sumDist, defect: "ADDITION_INSTEAD_OF_LCM" },
        { val: prodDist, defect: "PRODUCT_INSTEAD_OF_LCM" },
        { val: diffDist, defect: "SUBTRACTION_INSTEAD_OF_LCM" }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    }

    solutionSteps = `Step 1: List the departure intervals for Service ${routeA} (multiples of ${i1}): ${m1List.join(', ')}...\\nStep 2: List the departure intervals for Service ${routeB} (multiples of ${i2}): ${m2List.join(', ')}...\\nStep 3: The lowest common multiple (LCM) of ${i1} and ${i2} is ${finalAnswer} minutes.`;
    hint = `When events repeat at periodic intervals, they happen together again at their Lowest Common Multiple (LCM). List the multiples of both numbers!`;
  }

  // ==========================================================================
  // VARIANT 3: advanced_factor_sum_difference (Factor Sum or Difference)
  // ==========================================================================
  else if (effectiveVariant === 'advanced_factor_sum_difference') {
    const [name] = getRandomNames(1);
    const pool = [
      { T: 36, fSmall: 4, fBig: 9, isSum: true, val: 13 },
      { T: 48, fSmall: 4, fBig: 12, isSum: false, val: 8 },
      { T: 60, fSmall: 4, fBig: 15, isSum: true, val: 19 },
      { T: 40, fSmall: 4, fBig: 10, isSum: false, val: 6 },
      { T: 72, fSmall: 8, fBig: 9, isSum: false, val: 1 },
      { T: 45, fSmall: 3, fBig: 15, isSum: true, val: 18 },
      { T: 56, fSmall: 7, fBig: 8, isSum: false, val: 1 },
      { T: 54, fSmall: 3, fBig: 18, isSum: true, val: 21 },
      { T: 64, fSmall: 4, fBig: 16, isSum: false, val: 12 },
      { T: 80, fSmall: 5, fBig: 16, isSum: false, val: 11 }
    ];

    const item = pool[Math.floor(Math.random() * pool.length)];
    const { T, fSmall, fBig, isSum, val } = item;
    finalAnswer = fBig.toString();

    const pairs = getFactorPairs(T);
    const opText = isSum ? 'sum' : 'difference';
    const opSign = isSum ? '+' : '-';

    const askText = `${name} found two factors of ${T}. The ${opText} of these two factors is ${val}. Find the greater of the two factors.`;

    promptInstruction = `The question must strictly be: "${askText}"`;

    if (isStructure) {
      visualEngineStr = JSON.stringify({
        componentToRender: "INTERACTIVE_SCRIBBLE_CANVAS",
        componentData: {
          watermarkText: `List factor pairs of ${T} and test their ${opText}`,
          backgroundGrid: true
        }
      }, null, 2);

      const steps = [
        {
          label: `Write the equation testing the correct factor pair:`,
          type: "text",
          expectedAnswer: `${fBig} ${opSign} ${fSmall} = ${val}`,
          expected: `${fBig} ${opSign} ${fSmall} = ${val}`
        },
        {
          label: "Final Answer (the greater factor):",
          type: "text",
          expectedAnswer: finalAnswer,
          expected: finalAnswer
        }
      ];

      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: steps
      }, null, 2);
    } else {
      visualEngineStr = JSON.stringify({
        componentToRender: "FACTOR_RAINBOW",
        componentData: {
          targetNumber: T,
          factorPairs: pairs,
          hiddenNodes: []
        }
      }, null, 2);
    }

    if (isMCQ) {
      const dist1 = fSmall.toString();
      const dist2 = (val - fSmall).toString();
      const dist3 = (fBig + 2).toString();

      const mcqRes = ensureFourUniqueOptions(finalAnswer, [
        { val: dist1, defect: "CHOSE_SMALLER_FACTOR" },
        { val: dist2, defect: "INCORRECT_FACTOR_PAIR" },
        { val: dist3, defect: "CARELESS_CALCULATION" }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    }

    const testedPairsStr = pairs.map(([a, b]) => `${b} ${opSign} ${a} = ${isSum ? a + b : b - a}`).join(', ');

    solutionSteps = `Step 1: List all factor pairs of ${T}: ${pairs.map(p => `(${p[0]}, ${p[1]})`).join(', ')}.\\nStep 2: Test the ${opText} of each pair: ${testedPairsStr}.\\nStep 3: The pair with a ${opText} of ${val} is ${fSmall} and ${fBig}. The greater factor is ${finalAnswer}.`;
    hint = `List all factor pairs that multiply to give ${T}, then find which pair has a ${opText} of ${val}!`;
  }

  // ==========================================================================
  // VARIANT 4: advanced_grouping_with_leftovers (Chinese Remainder / Common Remainder)
  // ==========================================================================
  else if (effectiveVariant === 'advanced_grouping_with_leftovers') {
    const [name] = getRandomNames(1);
    const [itemNoun] = getRandomCountableItems(1);

    const pool = [
      { g1: 4, g2: 6, R: 3, lcmVal: 12 },
      { g1: 6, g2: 8, R: 5, lcmVal: 24 },
      { g1: 5, g2: 6, R: 2, lcmVal: 30 },
      { g1: 4, g2: 9, R: 1, lcmVal: 36 },
      { g1: 6, g2: 9, R: 4, lcmVal: 18 },
      { g1: 8, g2: 12, R: 3, lcmVal: 24 },
      { g1: 5, g2: 8, R: 3, lcmVal: 40 },
      { g1: 4, g2: 7, R: 2, lcmVal: 28 },
      { g1: 6, g2: 10, R: 4, lcmVal: 30 }
    ];

    const entry = pool[Math.floor(Math.random() * pool.length)];
    const { g1, g2, R, lcmVal } = entry;
    const ansTotal = lcmVal + R;
    finalAnswer = ansTotal.toString();

    const askText = `When ${name} packs some ${itemNoun} into packets of ${g1}, there are ${R} ${itemNoun} left over. When ${name} packs the same ${itemNoun} into packets of ${g2}, there are also ${R} ${itemNoun} left over. What is the smallest possible number of ${itemNoun} ${name} has?`;

    promptInstruction = `The question must strictly be: "${askText}"`;

    if (isStructure) {
      visualEngineStr = JSON.stringify({
        componentToRender: "INTERACTIVE_SCRIBBLE_CANVAS",
        componentData: {
          watermarkText: "Draw grouping model or multiples working",
          backgroundGrid: true
        }
      }, null, 2);

      const steps = [
        {
          label: `Write the lowest common multiple (LCM) of ${g1} and ${g2}:`,
          type: "text",
          expectedAnswer: lcmVal.toString(),
          expected: lcmVal.toString()
        },
        {
          label: `Write the working equation to find the total number of ${itemNoun}:`,
          type: "text",
          expectedAnswer: `${lcmVal} + ${R} = ${ansTotal}`,
          expected: `${lcmVal} + ${R} = ${ansTotal}`
        },
        {
          label: `Final Answer:`,
          type: "text",
          expectedAnswer: finalAnswer,
          expected: finalAnswer
        }
      ];

      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: steps
      }, null, 2);
    } else {
      visualEngineStr = JSON.stringify({
        componentToRender: "NONE",
        componentData: { hideVisual: true }
      }, null, 2);
    }

    if (isMCQ) {
      const omittedRemainder = lcmVal.toString();
      const productPlusR = (g1 * g2 + R).toString();
      const subtractedR = (lcmVal - R).toString();

      const mcqRes = ensureFourUniqueOptions(finalAnswer, [
        { val: omittedRemainder, defect: "OMITTED_REMAINDER" },
        { val: productPlusR, defect: "PRODUCT_INSTEAD_OF_LCM" },
        { val: subtractedR, defect: "SUBTRACTED_REMAINDER" }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    }

    solutionSteps = `Step 1: If there were no remainder, the number of ${itemNoun} would be a common multiple of ${g1} and ${g2}.\\nStep 2: The lowest common multiple (LCM) of ${g1} and ${g2} is ${lcmVal}.\\nStep 3: Add the common remainder: ${lcmVal} + ${R} = ${finalAnswer}.`;
    hint = `Find the smallest common multiple of ${g1} and ${g2} first, then add the leftover remainder!`;
  }

  // ==========================================================================
  // VARIANT 5: advanced_hcf_grid_square_tiling (Square Tiling / HCF)
  // ==========================================================================
  else if (effectiveVariant === 'advanced_hcf_grid_square_tiling') {
    const [name] = getRandomNames(1);
    const pool = [
      { L: 36, W: 24, hcfVal: 12 },
      { L: 48, W: 32, hcfVal: 16 },
      { L: 45, W: 30, hcfVal: 15 },
      { L: 42, W: 28, hcfVal: 14 },
      { L: 60, W: 36, hcfVal: 12 },
      { L: 40, W: 24, hcfVal: 8 },
      { L: 54, W: 36, hcfVal: 18 },
      { L: 50, W: 30, hcfVal: 10 },
      { L: 72, W: 48, hcfVal: 24 }
    ];

    const entry = pool[Math.floor(Math.random() * pool.length)];
    const { L, W, hcfVal } = entry;
    finalAnswer = hcfVal.toString();

    const fL = getFactors(L);
    const fW = getFactors(W);
    const commonFactors = fL.filter(f => fW.includes(f));

    const askText = `${name} has a rectangular cardboard measuring ${L} cm by ${W} cm. ${name} wants to cut it into identical square cards of the greatest possible size without any leftover cardboard. What is the length of each side of the square card?`;

    promptInstruction = `The question must strictly be: "${askText}"`;

    if (isStructure) {
      visualEngineStr = JSON.stringify({
        componentToRender: "INTERACTIVE_SCRIBBLE_CANVAS",
        componentData: {
          watermarkText: "Sketch the rectangular cardboard and square tiling layout",
          backgroundGrid: true
        }
      }, null, 2);

      const steps = [
        {
          label: `Write the common factors of ${L} and ${W}:`,
          type: "text",
          expectedAnswer: commonFactors.join(', '),
          expected: commonFactors.join(', ')
        },
        {
          label: `Write the greatest common factor (length of side in cm):`,
          type: "text",
          expectedAnswer: finalAnswer,
          expected: finalAnswer
        },
        {
          label: "Final Answer (in cm):",
          type: "text",
          expectedAnswer: finalAnswer,
          expected: finalAnswer
        }
      ];

      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: steps
      }, null, 2);
    } else {
      visualEngineStr = JSON.stringify({
        componentToRender: "GRID_ARRAY",
        componentData: {
          rows: Math.min(W / hcfVal, 5),
          columns: Math.min(L / hcfVal, 6),
          itemShape: "square",
          rowLabel: `${W} cm`,
          colLabel: `${L} cm`,
          highlightedCells: []
        }
      }, null, 2);
    }

    if (isMCQ) {
      const suboptimalHcf = (hcfVal / 2).toString();
      const totalTiles = ((L / hcfVal) * (W / hcfVal)).toString();
      const diffDist = (L - W).toString();

      const mcqRes = ensureFourUniqueOptions(finalAnswer, [
        { val: suboptimalHcf, defect: "SUBOPTIMAL_COMMON_FACTOR" },
        { val: totalTiles, defect: "CALCULATED_TOTAL_TILES_INSTEAD_OF_SIDE" },
        { val: diffDist, defect: "DIFFERENCE_INSTEAD_OF_HCF" }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    }

    solutionSteps = `Step 1: The side of each square card must be a factor of both ${L} and ${W}.\\nStep 2: Common factors of ${L} and ${W} are ${commonFactors.join(', ')}.\\nStep 3: The greatest possible size is the Highest Common Factor (HCF), which is ${finalAnswer} cm.`;
    hint = `To cut a rectangle into the largest possible identical squares without waste, find the Highest Common Factor (HCF) of its length and breadth!`;
  }

  const mcqInstruction = isMCQ ? `- Generate EXACTLY 4 options: ${JSON.stringify(options)}.\\n- Set defectMap to: ${JSON.stringify(defectMap)}.` : "";

  const aiPrompt = `You are an expert Singapore Primary 4 Math educator.
Generate an advanced-level question for Singapore Primary 4 students.
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
