import { getRandomNames } from '../../../../../utils/variable-bank.js';

export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions) {
  let promptInstruction = "";
  let finalAnswer = "";
  let options = [];
  let defectMap = {};
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;

  if (!activeVariant || activeVariant === 'standard_default' || activeVariant === 'default') {
    const defaultVariants = [
      'standard_cascade_nine',
      'standard_which_numbers_round_to',
      'standard_find_smallest_largest_bound',
      'standard_estimation_sum_difference',
      'standard_round_same_number_multiple_ways'
    ];
    activeVariant = defaultVariants[Math.floor(Math.random() * defaultVariants.length)];
  }

  if (activeVariant === 'standard_cascade_nine') {
    // Tests rounding that causes carries across 9s (e.g. 49 998 -> 50 000 or 72 985 -> 73 000)
    const subtype = Math.floor(Math.random() * 3);
    if (subtype === 0) {
      // Nearest 10: e.g. 54 996 -> 55 000
      const prefix = Math.floor(Math.random() * 80 + 10); // 10 to 89
      const ones = Math.floor(Math.random() * 4) + 6; // 6 to 9
      const num = (prefix * 1000) + 990 + ones;
      const rounded = (prefix + 1) * 1000;
      finalAnswer = rounded.toString();

      promptInstruction = `- Question stem: "Round ${num.toLocaleString()} to the nearest ten."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isMCQ) {
        const d1 = ((prefix * 1000) + 990).toString(); // rounded down
        const d2 = ((prefix * 1000) + 900).toString(); // stripped digit
        const d3 = (rounded + 10).toString();
        const set = new Set([finalAnswer, d1, d2, d3]);
        let offset = 20;
        while (set.size < 4) {
          set.add((rounded + offset).toString());
          offset += 10;
        }
        options = Array.from(set).sort(() => Math.random() - 0.5);
        defectMap = {
          [d1]: "ROUNDED_DOWN_INSTEAD_OF_UP",
          [d2]: "DROPPED_DIGITS_WITHOUT_CARRY",
          [d3]: "OFF_BY_TEN"
        };
      }
    } else if (subtype === 1) {
      // Nearest 100: e.g. 38 974 -> 39 000
      const prefix = Math.floor(Math.random() * 80 + 10);
      const tensOnes = Math.floor(Math.random() * 40) + 55; // 55 to 94
      const num = (prefix * 1000) + 900 + tensOnes;
      const rounded = (prefix + 1) * 1000;
      finalAnswer = rounded.toString();

      promptInstruction = `- Question stem: "Round ${num.toLocaleString()} to the nearest hundred."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isMCQ) {
        const d1 = ((prefix * 1000) + 900).toString();
        const d2 = ((prefix * 1000) + 800).toString();
        const d3 = (rounded + 100).toString();
        const set = new Set([finalAnswer, d1, d2, d3]);
        let offset = 200;
        while (set.size < 4) {
          set.add((rounded + offset).toString());
          offset += 100;
        }
        options = Array.from(set).sort(() => Math.random() - 0.5);
        defectMap = {
          [d1]: "ROUNDED_DOWN_INSTEAD_OF_UP",
          [d2]: "DROPPED_DIGITS_WITHOUT_CARRY",
          [d3]: "OFF_BY_HUNDRED"
        };
      }
    } else {
      // Nearest 1000: e.g. 89 650 -> 90 000 or 99 750 -> 100 000
      const isHundredThousand = Math.random() < 0.5;
      let num = 0;
      let rounded = 0;
      if (isHundredThousand) {
        num = 99000 + Math.floor(Math.random() * 400 + 550);
        rounded = 100000;
      } else {
        const tth = Math.floor(Math.random() * 8) + 1;
        num = (tth * 10000) + 9000 + Math.floor(Math.random() * 400 + 550);
        rounded = (tth + 1) * 10000;
      }
      finalAnswer = rounded.toString();

      promptInstruction = `- Question stem: "Round ${num.toLocaleString()} to the nearest thousand."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isMCQ) {
        const d1 = (rounded - 1000).toString();
        const d2 = (rounded - 10000).toString();
        const d3 = (rounded + 1000).toString();
        const set = new Set([finalAnswer, d1, d2, d3]);
        let offset = 2000;
        while (set.size < 4) {
          set.add((rounded + offset).toString());
          offset += 1000;
        }
        options = Array.from(set).sort(() => Math.random() - 0.5);
        defectMap = {
          [d1]: "ROUNDED_DOWN_INSTEAD_OF_UP",
          [d2]: "DROPPED_TEN_THOUSANDS",
          [d3]: "OFF_BY_THOUSAND"
        };
      }
    }
  } else if (activeVariant === 'standard_which_numbers_round_to') {
    // Variety: nearest thousand, nearest hundred, or nearest ten
    const placeTypes = [
      { name: 'thousand', step: 1000, half: 500, rangeMin: 20, rangeMax: 89 },
      { name: 'hundred', step: 100, half: 50, rangeMin: 100, rangeMax: 890 },
      { name: 'ten', step: 10, half: 5, rangeMin: 1000, rangeMax: 8900 }
    ];
    const rand = Math.random();
    const pickedPlace = rand < 0.6 ? placeTypes[0] : (rand < 0.8 ? placeTypes[1] : placeTypes[2]);
    const { name: placeName, step, half, rangeMin, rangeMax } = pickedPlace;

    const target = Math.floor(Math.random() * (rangeMax - rangeMin) + rangeMin) * step;

    // 1. Correct number: strictly inside [target - half, target + half - 1], not equal to target
    const isAbove = Math.random() < 0.5;
    let correctNum;
    if (step === 1000) {
      correctNum = isAbove
        ? target + Math.floor(Math.random() * 400 + 40)
        : target - Math.floor(Math.random() * 400 + 40);
    } else if (step === 100) {
      correctNum = isAbove
        ? target + Math.floor(Math.random() * 40 + 5)
        : target - Math.floor(Math.random() * 40 + 5);
    } else {
      correctNum = isAbove
        ? target + Math.floor(Math.random() * 4 + 1)
        : target - Math.floor(Math.random() * 4 + 1);
    }
    finalAnswer = correctNum.toString();

    // 2. Distractor 1: Just above upper threshold (rounds up to target + step)
    let d1;
    if (step === 1000) {
      d1 = target + half + Math.floor(Math.random() * 250 + 10);
    } else if (step === 100) {
      d1 = target + half + Math.floor(Math.random() * 25 + 5);
    } else {
      d1 = target + half + Math.floor(Math.random() * 3 + 1);
    }

    // 3. Distractor 2: Just below lower threshold (rounds down to target - step)
    let d2;
    if (step === 1000) {
      d2 = target - half - Math.floor(Math.random() * 250 + 10);
    } else if (step === 100) {
      d2 = target - half - Math.floor(Math.random() * 25 + 5);
    } else {
      d2 = target - half - Math.floor(Math.random() * 3 + 1);
    }

    // 4. Distractor 3: Clearly outside the rounding interval
    let d3;
    if (step === 1000) {
      d3 = target + 1500;
    } else if (step === 100) {
      d3 = target + 150;
    } else {
      d3 = target + 15;
    }

    const candidateList = [correctNum, d1, d2, d3].sort(() => Math.random() - 0.5);

    visualEngineStr = JSON.stringify({
      componentToRender: "NUMBER_CARDS",
      componentData: {
        items: candidateList.map(n => n.toLocaleString())
      }
    }, null, 2);

    promptInstruction = `- Question stem: "From the number cards below, which number gives ${target.toLocaleString()} when rounded to the nearest ${placeName}?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      options = candidateList.map(n => n.toString());
      defectMap = {
        [d1.toString()]: "ROUNDS_UP_TO_NEXT_INTERVAL",
        [d2.toString()]: "ROUNDS_DOWN_TO_PREVIOUS_INTERVAL",
        [d3.toString()]: "OUTSIDE_ROUNDING_INTERVAL"
      };
      options.forEach(opt => {
        if (opt !== finalAnswer && !defectMap[opt]) {
          defectMap[opt] = "OUTSIDE_ROUNDING_INTERVAL";
        }
      });
    }
  } else if (activeVariant === 'standard_find_smallest_largest_bound') {
    const isSmallest = Math.random() < 0.5;
    const roundType = Math.random() < 0.5 ? 'thousand' : 'hundred';
    const target = roundType === 'thousand'
      ? Math.floor(Math.random() * 70 + 20) * 1000
      : Math.floor(Math.random() * 700 + 100) * 100;

    let boundValue = 0;
    if (roundType === 'thousand') {
      boundValue = isSmallest ? target - 500 : target + 499;
    } else {
      boundValue = isSmallest ? target - 50 : target + 49;
    }
    finalAnswer = boundValue.toString();

    const boundWord = isSmallest ? "smallest" : "greatest";
    promptInstruction = `- Question stem: "What is the ${boundWord} whole number that gives ${target.toLocaleString()} when rounded to the nearest ${roundType}?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      let d1 = 0;
      let d2 = 0;
      let d3 = 0;
      if (roundType === 'thousand') {
        d1 = isSmallest ? target + 499 : target - 500; // opposite bound
        d2 = isSmallest ? target - 499 : target + 500; // off by 1 bound error
        d3 = isSmallest ? target - 1000 : target + 1000;
      } else {
        d1 = isSmallest ? target + 49 : target - 50;
        d2 = isSmallest ? target - 49 : target + 50;
        d3 = isSmallest ? target - 100 : target + 100;
      }
      options = [finalAnswer, d1.toString(), d2.toString(), d3.toString()].sort(() => Math.random() - 0.5);
      defectMap = {
        [d1.toString()]: isSmallest ? "GAVE_GREATEST_INSTEAD_OF_SMALLEST" : "GAVE_SMALLEST_INSTEAD_OF_GREATEST",
        [d2.toString()]: "BOUNDARY_OFF_BY_ONE",
        [d3.toString()]: "OFF_BY_ONE_ROUNDING_UNIT"
      };
    }
  } else if (activeVariant === 'standard_estimation_sum_difference') {
    const isAdd = Math.random() < 0.5;
    const name = getRandomNames(1)[0];
    const n1 = Math.floor(Math.random() * 30 + 20) * 1000 + Math.floor(Math.random() * 800 + 100);
    const n2 = Math.floor(Math.random() * 20 + 10) * 1000 + Math.floor(Math.random() * 800 + 100);
    const r1 = Math.round(n1 / 1000) * 1000;
    const r2 = Math.round(n2 / 1000) * 1000;
    const estimated = isAdd ? r1 + r2 : r1 - r2;
    finalAnswer = estimated.toString();

    const opSymbol = isAdd ? "+" : "-";
    const opWord = isAdd ? "sum" : "difference";
    promptInstruction = `- Question stem: "Estimate the ${opWord} of ${n1.toLocaleString()} ${opSymbol} ${n2.toLocaleString()} by rounding each number to the nearest thousand first."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const d1 = (isAdd ? n1 + n2 : n1 - n2).toString(); // exact without rounding
      const d2 = (estimated + 1000).toString();
      const d3 = (estimated - 1000).toString();
      const set = new Set([finalAnswer, d1, d2, d3]);
      while (set.size < 4) {
        set.add((estimated + 2000).toString());
      }
      options = Array.from(set).sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: "CALCULATED_EXACT_WITHOUT_ESTIMATION",
        [d2]: "OFF_BY_THOUSAND",
        [d3]: "OFF_BY_THOUSAND"
      };
    }
  } else {
    // standard_round_same_number_multiple_ways
    // "When 74 658 is rounded to the nearest ten, it is A. When rounded to the nearest hundred, it is B. Find the value of B - A."
    const base = Math.floor(Math.random() * 70 + 20) * 1000 + Math.floor(Math.random() * 8 + 1) * 100; // e.g. 45 600
    const tens = Math.floor(Math.random() * 4) + 5; // 5 to 8 (so tens is >= 5)
    const ones = Math.floor(Math.random() * 4) + 6; // 6 to 9 (so ones is >= 5)
    const num = base + (tens * 10) + ones; // e.g. 45 678
    const round10 = Math.round(num / 10) * 10;
    const round100 = Math.round(num / 100) * 100;
    const diffVal = Math.abs(round100 - round10);
    finalAnswer = diffVal.toString();

    promptInstruction = `- Question stem: "When ${num.toLocaleString()} is rounded to the nearest ten, the result is A. When it is rounded to the nearest hundred, the result is B. What is the difference between B and A?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const d1 = (diffVal + 10).toString();
      const d2 = (diffVal > 10 ? diffVal - 10 : diffVal + 20).toString();
      const d3 = (round100 - num).toString();
      const set = new Set([finalAnswer, d1, d2, d3]);
      while (set.size < 4) {
        set.add((diffVal + 30).toString());
      }
      options = Array.from(set).sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: "OFF_BY_TEN",
        [d2]: "OFF_BY_TEN",
        [d3]: "SUBTRACTED_ORIGINAL_NUMBER"
      };
    }
  }

  const inputRequirementStr = isStructure ? `{\n    "inputType": "MULTI_STEP_INPUT"\n  }` : null;
  const mcqInstruction = isMCQ ? `- Generate EXACTLY 4 options: ${JSON.stringify(options)}.\\n- Set defectMap to: ${JSON.stringify(defectMap)}.` : "";

  const aiPrompt = `You are an expert Singapore Primary 4 Math educator.
Generate a standard-level question for Singapore Primary 4 students.
Topic: Whole Numbers - Numbers up to 100 000
Subtopic: Number Rounding
Difficulty: ${zodDiff}
Type: ${zodType}

CRITICAL INSTRUCTIONS:
1. ${promptInstruction}
2. The finalAnswer must be strictly "${finalAnswer}".
${mcqInstruction}
3. Provide step-by-step solution steps separated by \\n and an encouraging conceptual hint.
4. Forbid using "STORY:" or any instructional prefix in the output.

${getFormatInstructions(visualEngineStr, inputRequirementStr)}`;

  return { aiPrompt };
}
