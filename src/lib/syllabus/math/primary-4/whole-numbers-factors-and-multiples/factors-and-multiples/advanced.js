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

// Generate extensive pool of verified mystery number scenarios (200+ combinations)
function buildMysteryPool() {
  const pool = [];
  for (let M = 3; M <= 12; M++) {
    for (let F = 36; F <= 120; F++) {
      const factors = getFactors(F);
      const common = factors.filter(f => f % M === 0 && f < F);
      for (const ans of common) {
        const low = ans - Math.floor(M / 2) - 1;
        const high = ans + Math.floor(M / 2) + 1;
        
        const multiplesInRange = [];
        for (let m = M; m < high; m += M) {
          if (m > low && m < high) multiplesInRange.push(m);
        }
        const factorsInRange = factors.filter(f => f > low && f < high);
        const intersection = multiplesInRange.filter(m => factorsInRange.includes(m));
        if (intersection.length === 1 && intersection[0] === ans && ans >= 12 && ans <= 96) {
          pool.push({ M, F, low, high, ans });
        }
      }
    }
  }
  return pool;
}

const MYSTERY_POOL = buildMysteryPool();

export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, explicitVariety = null) {
  let promptInstruction = "";
  let finalAnswer = "";
  let acceptedAnswers = [];
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
    const item = MYSTERY_POOL[Math.floor(Math.random() * MYSTERY_POOL.length)];
    const { M, F, low, high, ans } = item;
    finalAnswer = ans.toString();
    acceptedAnswers = [finalAnswer];

    // Multiples of M strictly between low and high
    const multiplesInRange = [];
    for (let m = M; m < high; m += M) {
      if (m > low && m < high) multiplesInRange.push(m);
    }

    // Factors of F strictly between low and high
    const allFactorsF = getFactors(F);
    const factorsInRange = allFactorsF.filter(f => f > low && f < high);

    const templates = [
      `I am a multiple of ${M}. I am a factor of ${F}. I am greater than ${low} but less than ${high}. What number am I?`,
      `Find the mystery number that is a factor of ${F}, a multiple of ${M}, and lies strictly between ${low} and ${high}.`,
      `I am greater than ${low} and less than ${high}. I can be divided by ${M} without remainder, and I divide ${F} exactly. What number am I?`
    ];
    const askText = templates[Math.floor(Math.random() * templates.length)];

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
      const factorNotMultiple = factorsInRange.find(f => f % M !== 0) || (low + 1);
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
  // VARIANT 2: advanced_synchronization_periodic_intervals (Periodic Intervals / LCM)
  // ==========================================================================
  else if (effectiveVariant === 'advanced_synchronization_periodic_intervals') {
    const pairsPool = [
      { i1: 4, i2: 6 }, { i1: 6, i2: 8 }, { i1: 8, i2: 12 }, { i1: 6, i2: 9 },
      { i1: 4, i2: 10 }, { i1: 9, i2: 12 }, { i1: 10, i2: 15 }, { i1: 12, i2: 15 },
      { i1: 8, i2: 10 }, { i1: 6, i2: 10 }, { i1: 15, i2: 20 }, { i1: 12, i2: 18 },
      { i1: 10, i2: 25 }, { i1: 16, i2: 24 }, { i1: 14, i2: 21 }, { i1: 18, i2: 24 },
      { i1: 20, i2: 30 }, { i1: 15, i2: 25 }, { i1: 8, i2: 14 }, { i1: 9, i2: 15 }
    ];

    const item = pairsPool[Math.floor(Math.random() * pairsPool.length)];
    const [i1, i2] = Math.random() > 0.5 ? [item.i1, item.i2] : [item.i2, item.i1];
    const lcmVal = lcm(i1, i2);
    finalAnswer = lcmVal.toString();
    acceptedAnswers = [finalAnswer, `${finalAnswer} minutes`, `${finalAnswer} min`];

    const m1List = [i1, i1 * 2, i1 * 3, i1 * 4];
    const m2List = [i2, i2 * 2, i2 * 3, i2 * 4];

    // Randomize context: Bus departures, flashing beacons, or bell alarms
    const contextType = Math.floor(Math.random() * 3);
    let askText = "";
    let contextNoun = "";

    if (contextType === 0) {
      const busRoutes = ["12", "34", "51", "65", "80", "143", "166", "190", "972"].sort(() => Math.random() - 0.5);
      askText = `At a bus interchange, Service ${busRoutes[0]} departs every ${i1} minutes and Service ${busRoutes[1]} departs every ${i2} minutes. If both bus services depart together at 8:00 a.m., in how many minutes will they next depart together?`;
      contextNoun = "bus departures";
    } else if (contextType === 1) {
      askText = `Two warning lights at a harbor flash periodically. Light A flashes every ${i1} seconds and Light B flashes every ${i2} seconds. If both lights flash together now, after how many seconds will they next flash together?`;
      contextNoun = "flashes";
      acceptedAnswers = [finalAnswer, `${finalAnswer} seconds`, `${finalAnswer} s`];
    } else {
      askText = `Two school bells ring at regular intervals. Bell X rings every ${i1} minutes and Bell Y rings every ${i2} minutes. If both bells chime together at 9:00 a.m., in how many minutes will both bells chime together again?`;
      contextNoun = "chimes";
    }

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

    solutionSteps = `Step 1: List the multiples of ${i1}: ${m1List.join(', ')}...\\nStep 2: List the multiples of ${i2}: ${m2List.join(', ')}...\\nStep 3: The lowest common multiple (LCM) of ${i1} and ${i2} is ${finalAnswer}.`;
    hint = `When events repeat at periodic intervals, they occur simultaneously at their Lowest Common Multiple (LCM). List the multiples of both numbers!`;
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
      { T: 80, fSmall: 5, fBig: 16, isSum: false, val: 11 },
      { T: 84, fSmall: 6, fBig: 14, isSum: true, val: 20 },
      { T: 90, fSmall: 6, fBig: 15, isSum: false, val: 9 },
      { T: 96, fSmall: 8, fBig: 12, isSum: false, val: 4 },
      { T: 75, fSmall: 5, fBig: 15, isSum: true, val: 20 },
      { T: 63, fSmall: 7, fBig: 9, isSum: false, val: 2 },
      { T: 70, fSmall: 5, fBig: 14, isSum: true, val: 19 },
      { T: 50, fSmall: 5, fBig: 10, isSum: false, val: 5 },
      { T: 32, fSmall: 4, fBig: 8, isSum: true, val: 12 },
      { T: 42, fSmall: 6, fBig: 7, isSum: false, val: 1 }
    ];

    const item = pool[Math.floor(Math.random() * pool.length)];
    const { T, fSmall, fBig, isSum, val } = item;

    // Toggle asking for greater factor or smaller factor
    const askGreater = Math.random() > 0.4;
    finalAnswer = (askGreater ? fBig : fSmall).toString();
    acceptedAnswers = [finalAnswer];

    const pairs = getFactorPairs(T);
    const opText = isSum ? 'sum' : 'difference';
    const opSign = isSum ? '+' : '-';
    const targetDescriptor = askGreater ? "greater" : "smaller";

    const askText = `${name} found two factors of ${T}. The ${opText} of these two factors is ${val}. Find the ${targetDescriptor} of the two factors.`;
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
          label: `Final Answer (the ${targetDescriptor} factor):`,
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
        hideVisual: true,
        componentData: { hideVisual: true }
      }, null, 2);
    }

    if (isMCQ) {
      const otherFactor = (askGreater ? fSmall : fBig).toString();
      const dist2 = (val - fSmall).toString();
      const dist3 = (Number(finalAnswer) + 2).toString();

      const mcqRes = ensureFourUniqueOptions(finalAnswer, [
        { val: otherFactor, defect: askGreater ? "CHOSE_SMALLER_FACTOR" : "CHOSE_GREATER_FACTOR" },
        { val: dist2, defect: "INCORRECT_FACTOR_PAIR" },
        { val: dist3, defect: "CARELESS_CALCULATION" }
      ]);
      options = mcqRes.options;
      defectMap = mcqRes.defectMap;
    }

    const testedPairsStr = pairs.map(([a, b]) => `${b} ${opSign} ${a} = ${isSum ? a + b : b - a}`).join(', ');
    solutionSteps = `Step 1: List all factor pairs of ${T}: ${pairs.map(p => `(${p[0]}, ${p[1]})`).join(', ')}.\\nStep 2: Test the ${opText} of each pair: ${testedPairsStr}.\\nStep 3: The pair with a ${opText} of ${val} is ${fSmall} and ${fBig}. The ${targetDescriptor} factor is ${finalAnswer}.`;
    hint = `List all factor pairs that multiply to give ${T}, then find which pair has a ${opText} of ${val}!`;
  }

  // ==========================================================================
  // VARIANT 4: advanced_grouping_with_leftovers (Common Remainder Problem)
  // ==========================================================================
  else if (effectiveVariant === 'advanced_grouping_with_leftovers') {
    const [name] = getRandomNames(1);
    const rawItem = getRandomCountableItems(1)[0];
    const itemNoun = (rawItem && typeof rawItem === 'object' && rawItem.item) ? rawItem.item : (rawItem || 'sweets');

    const pool = [
      { g1: 4, g2: 6, R: 3, lcmVal: 12 },
      { g1: 6, g2: 8, R: 5, lcmVal: 24 },
      { g1: 5, g2: 6, R: 2, lcmVal: 30 },
      { g1: 4, g2: 9, R: 1, lcmVal: 36 },
      { g1: 6, g2: 9, R: 4, lcmVal: 18 },
      { g1: 8, g2: 12, R: 3, lcmVal: 24 },
      { g1: 5, g2: 8, R: 3, lcmVal: 40 },
      { g1: 4, g2: 7, R: 2, lcmVal: 28 },
      { g1: 6, g2: 10, R: 4, lcmVal: 30 },
      { g1: 7, g2: 9, R: 3, lcmVal: 63 },
      { g1: 8, g2: 10, R: 5, lcmVal: 40 },
      { g1: 9, g2: 12, R: 5, lcmVal: 36 },
      { g1: 5, g2: 9, R: 4, lcmVal: 45 },
      { g1: 6, g2: 15, R: 2, lcmVal: 30 },
      { g1: 10, g2: 12, R: 7, lcmVal: 60 }
    ];

    const entry = pool[Math.floor(Math.random() * pool.length)];
    const { g1, g2, R, lcmVal } = entry;
    const ansTotal = lcmVal + R;
    finalAnswer = ansTotal.toString();
    acceptedAnswers = [finalAnswer];

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
      { L: 72, W: 48, hcfVal: 24 },
      { L: 64, W: 48, hcfVal: 16 },
      { L: 56, W: 42, hcfVal: 14 },
      { L: 84, W: 60, hcfVal: 12 },
      { L: 60, W: 45, hcfVal: 15 },
      { L: 70, W: 42, hcfVal: 14 },
      { L: 80, W: 50, hcfVal: 10 }
    ];

    const entry = pool[Math.floor(Math.random() * pool.length)];
    const { L, W, hcfVal } = entry;
    finalAnswer = hcfVal.toString();
    acceptedAnswers = [finalAnswer, `${finalAnswer} cm`, `${finalAnswer}cm`];

    const fL = getFactors(L);
    const fW = getFactors(W);
    const commonFactors = fL.filter(f => fW.includes(f));

    const materialTypes = ["cardboard", "wood sheet", "tile surface", "poster board"];
    const material = materialTypes[Math.floor(Math.random() * materialTypes.length)];

    const askText = `${name} has a rectangular ${material} measuring ${L} cm by ${W} cm. ${name} wants to cut it into identical square cards of the greatest possible size without any leftover material. What is the length of each side of the square card?`;
    promptInstruction = `The question must strictly be: "${askText}"`;

    if (isStructure) {
      visualEngineStr = JSON.stringify({
        componentToRender: "INTERACTIVE_SCRIBBLE_CANVAS",
        componentData: {
          watermarkText: "Sketch the rectangular sheet and square tiling layout",
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
        componentToRender: "NONE",
        hideVisual: true,
        componentData: { hideVisual: true }
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

${getFormatInstructions(visualEngineStr, inputRequirementStr, effectiveVariant, acceptedAnswers)}`;

  return {
    aiPrompt,
    visualEngine: visualEngineStr ? (typeof visualEngineStr === 'string' ? JSON.parse(visualEngineStr) : visualEngineStr) : null,
    inputRequirement: inputRequirementStr ? (typeof inputRequirementStr === 'string' ? JSON.parse(inputRequirementStr) : inputRequirementStr) : null,
    acceptedAnswers: acceptedAnswers.length > 0 ? acceptedAnswers : [finalAnswer]
  };
}
