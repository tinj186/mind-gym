import { getRandomNames } from '../../../../../utils/variable-bank.js';

export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions) {
  let promptInstruction = "";
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let finalAnswer = "";
  let options = [];
  let defectMap = {};
  const names = getRandomNames(2);

  if (!activeVariant || activeVariant === 'advanced_default' || activeVariant === 'default') {
    const defaultVariants = [
      'advanced_decomposition',
      'advanced_regrouping',
      'advanced_value_riddles',
      'advanced_difference_between_values',
      'advanced_forming_numbers'
    ];
    activeVariant = defaultVariants[Math.floor(Math.random() * defaultVariants.length)];
  }

  if (activeVariant === 'advanced_decomposition') {
    const tth = Math.floor(Math.random() * 5) + 1; // 1 to 5
    const extraTh = Math.floor(Math.random() * 4) + 1; // 1 to 4
    const extraH = Math.floor(Math.random() * 20) + 12; // 12 to 31 hundreds
    const t = Math.floor(Math.random() * 9) + 1;
    const o = Math.floor(Math.random() * 10);
    const finalNum = (tth * 10000) + (extraTh * 1000) + (extraH * 100) + (t * 10) + o;
    finalAnswer = finalNum.toString();

    promptInstruction = `- Question stem: "What number is represented by ${tth} ten thousands, ${extraTh} thousands, ${extraH} hundreds, ${t} tens, and ${o} ones?"\\n- The finalAnswer must be strictly the 5-digit numeral ${finalAnswer}.`;

    if (isMCQ) {
      const d1 = (tth * 10000) + (extraTh * 1000) + (extraH * 10) + (t * 10) + o;
      const d2 = finalNum + 1000;
      const d3 = finalNum - 100;
      const set = new Set([finalAnswer, d1.toString(), d2.toString(), d3.toString()]);
      while (set.size < 4) {
        set.add((finalNum + Math.floor(Math.random() * 5 + 1) * 100).toString());
      }
      options = Array.from(set).sort(() => Math.random() - 0.5);
      defectMap = {
        [d1.toString()]: "PLACE_VALUE_MISALIGNMENT"
      };
    }
  } else if (activeVariant === 'advanced_regrouping') {
    const baseTth = Math.floor(Math.random() * 4) + 2; // 2 to 5
    const baseTh = Math.floor(Math.random() * 6) + 10; // 10 to 15 (regroupable)
    const baseH = Math.floor(Math.random() * 8) + 10; // 10 to 17 (regroupable)
    const baseT = Math.floor(Math.random() * 8) + 1;
    const baseO = Math.floor(Math.random() * 10);
    const finalNum = (baseTth * 10000) + (baseTh * 1000) + (baseH * 100) + (baseT * 10) + baseO;
    finalAnswer = finalNum.toString();

    promptInstruction = `- Question stem: "${names[0]} collected place value tokens: ${baseTth} ten thousands, ${baseTh} thousands, ${baseH} hundreds, ${baseT} tens, and ${baseO} ones. What number do all of ${names[0]}'s tokens represent in total?"\\n- The finalAnswer must be strictly the numeral ${finalAnswer}.`;

    if (isMCQ) {
      const d1 = (baseTth * 10000) + (baseTh * 100) + (baseH * 10) + baseT;
      const d2 = finalNum + 100;
      const d3 = finalNum - 1000;
      const set = new Set([finalAnswer, d1.toString(), d2.toString(), d3.toString()]);
      while (set.size < 4) {
        set.add((finalNum + Math.floor(Math.random() * 5 + 1) * 10).toString());
      }
      options = Array.from(set).sort(() => Math.random() - 0.5);
      defectMap = {
        [d1.toString()]: "REGROUPING_ERROR"
      };
    }
  } else if (activeVariant === 'advanced_value_riddles') {
    const tth = Math.floor(Math.random() * 3) + 2; // 2, 3, or 4
    const diff = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
    const th = tth + diff; // 3 to 7
    const h = Math.floor(th / 2);
    const t = Math.floor(Math.random() * 6) + 1;
    const o = Math.floor(Math.random() * 5);
    const finalNum = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;
    const sumDigits = tth + th + h + t + o;
    finalAnswer = finalNum.toString();

    promptInstruction = `- Question stem: "${names[0]} is thinking of a 5-digit number. Use the clues below to find the number:\\n1. The ten thousands digit is ${tth}.\\n2. The thousands digit is ${diff} more than the ten thousands digit.\\n3. The hundreds digit is ${h}.\\n4. The tens digit is ${t}.\\n5. The sum of all its 5 digits is ${sumDigits}.\\nWhat number is ${names[0]} thinking of?"\\n- The finalAnswer must be strictly ${finalAnswer}.`;

    if (isMCQ) {
      const d1 = (th * 10000) + (tth * 1000) + (h * 100) + (t * 10) + o;
      const d2 = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + (o + 1);
      const d3 = finalNum - 10;
      const set = new Set([finalAnswer, d1.toString(), d2.toString(), d3.toString()]);
      while (set.size < 4) {
        set.add((finalNum + Math.floor(Math.random() * 5 + 1)).toString());
      }
      options = Array.from(set).sort(() => Math.random() - 0.5);
      defectMap = {
        [d1.toString()]: "PLACE_VALUE_MISALIGNMENT",
        [d2.toString()]: "CARELESS_CALCULATION"
      };
    }
  } else if (activeVariant === 'advanced_difference_between_values') {
    // Dynamic varieties for difference between digit values:
    // Subtype 0: Two randomly selected distinct place value columns (e.g. ten thousands vs thousands, hundreds vs tens, etc.)
    // Subtype 1: Repeated digits in the same number (e.g. difference between the values of the two '7's in 74 721)
    const subtype = Math.floor(Math.random() * 2);

    if (subtype === 0) {
      const allPlaces = [
        { name: 'ten thousands', mult: 10000 },
        { name: 'thousands', mult: 1000 },
        { name: 'hundreds', mult: 100 },
        { name: 'tens', mult: 10 },
        { name: 'ones', mult: 1 }
      ];

      const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5).slice(0, 5);
      const [tth, th, h, t, o] = digits;
      const num = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;

      const placesWithDigits = [
        { ...allPlaces[0], dig: tth, val: tth * 10000 },
        { ...allPlaces[1], dig: th, val: th * 1000 },
        { ...allPlaces[2], dig: h, val: h * 100 },
        { ...allPlaces[3], dig: t, val: t * 10 },
        { ...allPlaces[4], dig: o, val: o }
      ];

      // Randomly pick two distinct place columns (higher place value first)
      const idx1 = Math.floor(Math.random() * 4); // 0 to 3
      const idx2 = Math.floor(Math.random() * (5 - idx1 - 1)) + idx1 + 1; // idx1 + 1 to 4
      const p1 = placesWithDigits[idx1];
      const p2 = placesWithDigits[idx2];

      const diffVal = p1.val - p2.val;
      finalAnswer = diffVal.toString();

      promptInstruction = `- Question stem: "In the number ${num}, what is the difference between the value of the digit ${p1.dig} and the value of the digit ${p2.dig}?"\\n- The finalAnswer must be strictly the numeral ${finalAnswer}.\\n- When writing solutionSteps, explain that the value of digit ${p1.dig} in the ${p1.name} place is ${p1.val}, the value of digit ${p2.dig} in the ${p2.name} place is ${p2.val}, and their difference is ${p1.val} - ${p2.val} = ${finalAnswer}.\\n- In the hint, remind students to calculate each digit's full value before subtracting.`;

      if (isMCQ) {
        const d1 = Math.abs(p1.dig - p2.dig).toString(); // face value difference (guaranteed positive)
        const d2 = (p1.val + p2.val).toString(); // sum instead of difference
        const d3 = (diffVal - p2.mult > 0) ? (diffVal - p2.mult).toString() : (diffVal + p2.mult).toString();
        const set = new Set([finalAnswer, d1, d2, d3]);
        let offset = 100;
        while (set.size < 4) {
          set.add((diffVal + offset).toString());
          offset += 100;
        }
        options = Array.from(set).sort(() => Math.random() - 0.5);
        defectMap = {
          [d1]: "CONFUSED_DIGIT_AND_VALUE",
          [d2]: "WRONG_OPERATION"
        };
      }
    } else {
      // Subtype 1: Repeated digits in the same number
      const repDigit = Math.floor(Math.random() * 8) + 2; // 2 to 9
      const pairTypes = [
        { p1Name: 'ten thousands', mult1: 10000, p2Name: 'thousands', mult2: 1000 },
        { p1Name: 'ten thousands', mult1: 10000, p2Name: 'hundreds', mult2: 100 },
        { p1Name: 'ten thousands', mult1: 10000, p2Name: 'tens', mult2: 10 },
        { p1Name: 'thousands', mult1: 1000, p2Name: 'hundreds', mult2: 100 },
        { p1Name: 'thousands', mult1: 1000, p2Name: 'tens', mult2: 10 },
        { p1Name: 'thousands', mult1: 1000, p2Name: 'ones', mult2: 1 }
      ];
      const pair = pairTypes[Math.floor(Math.random() * pairTypes.length)];

      const pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(x => x !== repDigit);
      const rnd = () => pool[Math.floor(Math.random() * pool.length)];

      let d_tth = rnd(), d_th = rnd(), d_h = rnd(), d_t = rnd(), d_o = rnd();
      if (d_tth === 0) d_tth = pool.find(x => x > 0) || 1;

      if (pair.mult1 === 10000) d_tth = repDigit;
      if (pair.mult1 === 1000) d_th = repDigit;

      if (pair.mult2 === 1000) d_th = repDigit;
      if (pair.mult2 === 100) d_h = repDigit;
      if (pair.mult2 === 10) d_t = repDigit;
      if (pair.mult2 === 1) d_o = repDigit;

      const num = (d_tth * 10000) + (d_th * 1000) + (d_h * 100) + (d_t * 10) + d_o;
      const val1 = repDigit * pair.mult1;
      const val2 = repDigit * pair.mult2;
      const diffVal = val1 - val2;
      finalAnswer = diffVal.toString();

      promptInstruction = `- Question stem: "In the number ${num}, what is the difference between the values of the two digits '${repDigit}'?"\\n- The finalAnswer must be strictly the numeral ${finalAnswer}.\\n- When writing solutionSteps, explain that in ${num}, one digit ${repDigit} is in the ${pair.p1Name} place with value ${val1}, the other is in the ${pair.p2Name} place with value ${val2}, and their difference is ${val1} - ${val2} = ${finalAnswer}.\\n- In the hint, find the values of both digits '${repDigit}' before subtracting.`;

      if (isMCQ) {
        const d1 = (val1 + val2).toString();
        const d2 = val1.toString();
        const d3 = (diffVal - pair.mult2 > 0) ? (diffVal - pair.mult2).toString() : (diffVal + pair.mult2).toString();
        const set = new Set([finalAnswer, d1, d2, d3]);
        let offset = 100;
        while (set.size < 4) {
          set.add((diffVal + offset).toString());
          offset += 100;
        }
        options = Array.from(set).sort(() => Math.random() - 0.5);
        defectMap = {
          [d1]: "WRONG_OPERATION",
          [d2]: "OMITTED_SECOND_STEP"
        };
      }
    }
  } else {
    // advanced_forming_numbers
    // Pick 5 distinct digits: 1 zero, 2 evens, 2 odds
    const zero = 0;
    const nonZeroEvens = [2, 4, 6, 8].sort(() => Math.random() - 0.5).slice(0, 2);
    const odds = [1, 3, 5, 7, 9].sort(() => Math.random() - 0.5).slice(0, 2);
    const digitPool = [zero, ...nonZeroEvens, ...odds].sort(() => Math.random() - 0.5);

    // Generate valid 5-digit even numbers
    const validEvenNumbers = [];
    // Permutations of 5 digits
    function permute(arr, m = []) {
      if (arr.length === 0) {
        if (m[0] !== 0 && m[4] % 2 === 0) {
          validEvenNumbers.push(m.reduce((acc, d) => acc * 10 + d, 0));
        }
      } else {
        for (let i = 0; i < arr.length; i++) {
          let curr = arr.slice();
          let next = curr.splice(i, 1);
          permute(curr.slice(), m.concat(next));
        }
      }
    }
    permute(digitPool);

    validEvenNumbers.sort((a, b) => a - b);
    const smallestEven = validEvenNumbers[0];
    finalAnswer = smallestEven.toString();

    promptInstruction = `- Question stem: "Use all the digits ${digitPool.join(', ')} to form the smallest 5-digit even number. Each digit can only be used once."\\n- The finalAnswer must be strictly the numeral ${finalAnswer}.`;

    if (isMCQ) {
      const d1 = validEvenNumbers[validEvenNumbers.length - 1].toString(); // greatest even
      const d2 = validEvenNumbers[1] ? validEvenNumbers[1].toString() : (smallestEven + 2).toString();
      const d3 = validEvenNumbers[2] ? validEvenNumbers[2].toString() : (smallestEven + 4).toString();
      options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: "OPPOSITE_CONDITION_GREATEST"
      };
    }
  }

  const inputRequirementStr = isStructure ? `{\n    "inputType": "MULTI_STEP_INPUT"\n  }` : null;
  const mcqInstruction = isMCQ ? `- Generate EXACTLY 4 options: ${JSON.stringify(options)}.\\n- Set defectMap to: ${JSON.stringify(defectMap)}.` : "";

  const aiPrompt = `You are an expert Singapore Primary 4 Math educator.
Generate an advanced-level question for Singapore Primary 4 students.
Topic: Whole Numbers - Numbers up to 100 000
Subtopic: Place Values (Ten Thousands)
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
