import { getRandomNames } from '../../../../../utils/variable-bank.js';

export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions) {
  let promptInstruction = "";
  let finalAnswer = "";
  let options = [];
  let defectMap = {};
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;

  if (!activeVariant || activeVariant === 'advanced_default' || activeVariant === 'default') {
    const defaultVariants = [
      'advanced_dual_rounding_mystery',
      'advanced_difference_between_bounds',
      'advanced_digits_card_rounding',
      'advanced_bounds_difference_optimization',
      'advanced_interval_count'
    ];
    activeVariant = defaultVariants[Math.floor(Math.random() * defaultVariants.length)];
  }

  if (activeVariant === 'advanced_dual_rounding_mystery') {
    // "A 5-digit whole number when rounded to the nearest 100 is 56 400. When rounded to the nearest 1000, it is 56 000. What is the greatest (or smallest) possible value of this number?"
    const tth = Math.floor(Math.random() * 70 + 20); // 20 to 89
    const baseThousand = tth * 1000;
    // Choose hundreds digit that rounds down to baseThousand when rounded to 1000: hundreds = 1, 2, 3, or 4
    const hundredsDigit = Math.floor(Math.random() * 4) + 1; // 1 to 4
    const targetHundred = baseThousand + (hundredsDigit * 100); // e.g. 56 400
    const targetThousand = baseThousand; // 56 000

    const isGreatest = Math.random() < 0.5;
    // For nearest 100 to be targetHundred: [targetHundred - 50, targetHundred + 49]
    // For nearest 1000 to be targetThousand: [targetThousand - 500, targetThousand + 499]
    // Since hundredsDigit is 1 to 4, targetHundred + 49 is <= baseThousand + 449, so intersection is [targetHundred - 50, targetHundred + 49]
    const minVal = targetHundred - 50;
    const maxVal = targetHundred + 49;
    const correctVal = isGreatest ? maxVal : minVal;
    finalAnswer = correctVal.toString();

    const boundWord = isGreatest ? "greatest" : "smallest";
    promptInstruction = `- Question stem: "A 5-digit whole number when rounded to the nearest hundred is ${targetHundred.toLocaleString()}. When rounded to the nearest thousand, it is ${targetThousand.toLocaleString()}. What is the ${boundWord} possible value of this number?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const d1 = (isGreatest ? minVal : maxVal).toString();
      const d2 = (targetHundred + (isGreatest ? 50 : -49)).toString(); // boundary off-by-one
      const d3 = (targetThousand + (isGreatest ? 499 : -500)).toString(); // ignored nearest 100 constraint
      options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: isGreatest ? "GAVE_SMALLEST_INSTEAD_OF_GREATEST" : "GAVE_GREATEST_INSTEAD_OF_SMALLEST",
        [d2]: "BOUNDARY_OFF_BY_ONE",
        [d3]: "IGNORED_HUNDRED_CONSTRAINT"
      };
    }
  } else if (activeVariant === 'advanced_difference_between_bounds') {
    // Two different target numbers: "The greatest whole number that rounds to P to nearest thousand is A. The smallest whole number that rounds to Q to nearest thousand is B. Find A - B."
    const pThousands = Math.floor(Math.random() * 30 + 50) * 1000; // 50 000 to 79 000
    const qThousands = Math.floor(Math.random() * 20 + 20) * 1000; // 20 000 to 39 000
    const valA = pThousands + 499;
    const valB = qThousands - 500;
    const diff = valA - valB;
    finalAnswer = diff.toString();

    promptInstruction = `- Question stem: "The greatest whole number that gives ${pThousands.toLocaleString()} when rounded to the nearest thousand is A. The smallest whole number that gives ${qThousands.toLocaleString()} when rounded to the nearest thousand is B. What is the value of A - B?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const d1 = (pThousands - qThousands).toString(); // rounded target difference without bounds
      const d2 = (diff - 1).toString();
      const d3 = (diff + 1).toString();
      const set = new Set([finalAnswer, d1, d2, d3]);
      while (set.size < 4) {
        set.add((diff + 1000).toString());
      }
      options = Array.from(set).sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: "SUBTRACTED_ROUNDED_VALUES_DIRECTLY",
        [d2]: "OFF_BY_ONE",
        [d3]: "OFF_BY_ONE"
      };
    }
  } else if (activeVariant === 'advanced_digits_card_rounding') {
    // Form the greatest / smallest number from 5 distinct digit cards that rounds to target
    // e.g. Cards: 5, 8, 2, 7, 4. Round to nearest ten-thousand is 50 000.
    // Let's create 5 distinct non-zero digits
    const digits = [3, 4, 5, 7, 8].sort(() => Math.random() - 0.5);
    const targetTenThousand = 50000;

    // To round to 50 000:
    // Ten-thousands digit can be 4 (if thousands digit >= 5) or 5 (if thousands digit < 5).
    // Valid combinations:
    // With 4 as first digit: remaining [3, 5, 7, 8], thousands digit can be 5, 7, 8.
    // With 5 as first digit: remaining [3, 4, 7, 8], thousands digit must be 3 or 4 (< 5).
    // Greatest possible: 5 as first digit, 4 as second digit, then remaining [8, 7, 3] sorted desc -> 54 873!
    // Let's compute systematically:
    const allPerms = [];
    function permute(arr, memo = []) {
      if (arr.length === 0) {
        allPerms.push(Number(memo.join('')));
      } else {
        for (let i = 0; i < arr.length; i++) {
          const curr = arr.slice();
          const next = curr.splice(i, 1);
          permute(curr.slice(), memo.concat(next));
        }
      }
    }
    permute(digits);

    const validNums = allPerms.filter(n => Math.round(n / 10000) * 10000 === targetTenThousand);
    const isGreatest = Math.random() < 0.5;
    const sortedValid = validNums.sort((a, b) => a - b);
    const ansNum = isGreatest ? sortedValid[sortedValid.length - 1] : sortedValid[0];
    finalAnswer = ansNum.toString();

    const boundWord = isGreatest ? "greatest" : "smallest";
    promptInstruction = `- Question stem: "Using each of the digits ${digits.join(', ')} exactly once, what is the ${boundWord} 5-digit number that becomes 50 000 when rounded to the nearest ten thousand?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const d1 = (isGreatest ? sortedValid[0] : sortedValid[sortedValid.length - 1]).toString();
      // Distractor: greatest overall permutation regardless of rounding
      const allSorted = allPerms.sort((a, b) => a - b);
      const d2 = (isGreatest ? allSorted[allSorted.length - 1] : allSorted[0]).toString();
      const d3 = (isGreatest ? sortedValid[sortedValid.length - 2] : sortedValid[1]).toString();
      const set = new Set([finalAnswer, d1, d2, d3]);
      while (set.size < 4) {
        set.add((ansNum + 1000).toString());
      }
      options = Array.from(set).sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: isGreatest ? "GAVE_SMALLEST_INSTEAD_OF_GREATEST" : "GAVE_GREATEST_INSTEAD_OF_SMALLEST",
        [d2]: "IGNORED_ROUNDING_CONSTRAINT"
      };
    }
  } else if (activeVariant === 'advanced_bounds_difference_optimization') {
    // Upper and lower bounds optimization in applied context:
    // Cost of item A rounded to nearest hundred is $P. Cost of item B rounded to nearest hundred is $Q.
    // What is the greatest possible difference between actual cost of item A and actual cost of item B?
    const name = getRandomNames(1)[0];
    const priceA = Math.floor(Math.random() * 10 + 15) * 100; // $1500 to $2400
    const priceB = Math.floor(Math.random() * 6 + 6) * 100;   // $600 to $1100
    // Price A range: [priceA - 50, priceA + 49]
    // Price B range: [priceB - 50, priceB + 49]
    // Max difference = Max A - Min B = (priceA + 49) - (priceB - 50) = (priceA - priceB) + 99
    const maxDiff = (priceA - priceB) + 99;
    finalAnswer = maxDiff.toString();

    promptInstruction = `- Question stem: "The price of a computer rounded to the nearest hundred dollars is $${priceA.toLocaleString()}. The price of a printer rounded to the nearest hundred dollars is $${priceB.toLocaleString()}. What is the greatest possible difference between the actual price of the computer and the actual price of the printer?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const d1 = (priceA - priceB).toString(); // simple difference of rounded amounts
      const d2 = (priceA - priceB + 100).toString();
      const d3 = (priceA - priceB - 99).toString(); // min difference
      options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: "USED_ROUNDED_VALUES_WITHOUT_BOUNDS",
        [d2]: "OFF_BY_ONE",
        [d3]: "CALCULATED_MINIMUM_DIFFERENCE"
      };
    }
  } else {
    // advanced_interval_count
    // "How many whole numbers become 74 000 when rounded to the nearest thousand?" (1000)
    // Or "How many 5-digit whole numbers become 74 000 when rounded to the nearest hundred?" (100)
    const isThousand = Math.random() < 0.5;
    const target = Math.floor(Math.random() * 60 + 20) * 1000;
    const unitWord = isThousand ? "thousand" : "hundred";
    finalAnswer = isThousand ? "1000" : "100";

    promptInstruction = `- Question stem: "How many whole numbers give ${target.toLocaleString()} when rounded to the nearest ${unitWord}?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const d1 = isThousand ? "999" : "99";
      const d2 = isThousand ? "1001" : "101";
      const d3 = isThousand ? "500" : "50";
      options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: "MISSED_INCLUSIVE_INTERVAL_COUNT",
        [d2]: "OFF_BY_ONE",
        [d3]: "CONFUSED_HALF_INTERVAL_WITH_FULL_COUNT"
      };
    }
  }

  const inputRequirementStr = isStructure ? `{\n    "inputType": "MULTI_STEP_INPUT"\n  }` : null;
  const mcqInstruction = isMCQ ? `- Generate EXACTLY 4 options: ${JSON.stringify(options)}.\\n- Set defectMap to: ${JSON.stringify(defectMap)}.` : "";

  const aiPrompt = `You are an expert Singapore Primary 4 Math educator.
Generate an advanced-level question for Singapore Primary 4 students.
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
