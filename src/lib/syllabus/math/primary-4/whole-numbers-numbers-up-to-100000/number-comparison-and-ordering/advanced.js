export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions) {
  let digits = [];
  let promptInstruction = "";
  let finalAnswer = "";
  let options = [];
  let defectMap = {};

  if (!activeVariant || activeVariant === 'advanced_default' || activeVariant === 'default') {
    const defaultVariants = [
      'advanced_form_greatest_5_digit',
      'advanced_form_smallest_5_digit',
      'advanced_form_greatest_even',
      'advanced_form_smallest_odd',
      'advanced_form_greatest_less_than_x',
      'advanced_form_smallest_greater_than_x'
    ];
    activeVariant = defaultVariants[Math.floor(Math.random() * defaultVariants.length)];
  }

  function getPerms(arr) {
    if (arr.length <= 1) return [arr];
    let result = [];
    for (let i = 0; i < arr.length; i++) {
      let current = arr[i];
      let remaining = arr.slice(0, i).concat(arr.slice(i + 1));
      let remainingPerms = getPerms(remaining);
      for (let j = 0; j < remainingPerms.length; j++) {
        result.push([current].concat(remainingPerms[j]));
      }
    }
    return result;
  }

  // Ensure digit pool has 0, at least two evens, at least two odds for robust filtering
  const evens = [0, 2, 4, 6, 8].sort(() => Math.random() - 0.5).slice(0, 3);
  const odds = [1, 3, 5, 7, 9].sort(() => Math.random() - 0.5).slice(0, 2);
  digits = [...evens, ...odds].sort(() => Math.random() - 0.5);

  const allPerms = getPerms(digits);
  const validNumbers = [];
  for (const p of allPerms) {
    if (p[0] !== 0) {
      const val = p[0] * 10000 + p[1] * 1000 + p[2] * 100 + p[3] * 10 + p[4];
      if (!validNumbers.includes(val)) {
        validNumbers.push(val);
      }
    }
  }
  validNumbers.sort((a, b) => a - b);

  if (activeVariant === "advanced_form_greatest_5_digit") {
    const maxVal = validNumbers[validNumbers.length - 1];
    finalAnswer = maxVal.toString();
    promptInstruction = `- Question stem: "Use all the digit cards ${digits.join(', ')} to form the greatest 5-digit number. Each card can only be used once."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const d1 = validNumbers[0].toString(); // smallest
      const d2 = validNumbers[validNumbers.length - 2].toString(); // second greatest
      const d3 = validNumbers[validNumbers.length - 3].toString();
      options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: "OPPOSITE_CONDITION_SMALLEST"
      };
    }
  } else if (activeVariant === "advanced_form_smallest_5_digit") {
    const minVal = validNumbers[0];
    finalAnswer = minVal.toString();
    promptInstruction = `- Question stem: "Use all the digit cards ${digits.join(', ')} to form the smallest 5-digit number. Each card can only be used once."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const d1 = validNumbers[validNumbers.length - 1].toString(); // greatest
      const d2 = validNumbers[1].toString(); // second smallest
      const d3 = validNumbers[2].toString();
      options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: "OPPOSITE_CONDITION_GREATEST"
      };
    }
  } else if (activeVariant === "advanced_form_greatest_even") {
    const evensList = validNumbers.filter(n => n % 2 === 0);
    const maxEven = evensList[evensList.length - 1];
    finalAnswer = maxEven.toString();
    promptInstruction = `- Question stem: "Use all the digit cards ${digits.join(', ')} to form the greatest 5-digit even number. Each card can only be used once."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const oddsList = validNumbers.filter(n => n % 2 !== 0);
      const d1 = oddsList[oddsList.length - 1].toString(); // greatest odd
      const d2 = evensList[evensList.length - 2] ? evensList[evensList.length - 2].toString() : (maxEven - 2).toString();
      const d3 = evensList[0].toString(); // smallest even
      options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: "OPPOSITE_CONDITION_ODD"
      };
    }
  } else if (activeVariant === "advanced_form_smallest_odd") {
    const oddsList = validNumbers.filter(n => n % 2 !== 0);
    const minOdd = oddsList[0];
    finalAnswer = minOdd.toString();
    promptInstruction = `- Question stem: "Use all the digit cards ${digits.join(', ')} to form the smallest 5-digit odd number. Each card can only be used once."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const evensList = validNumbers.filter(n => n % 2 === 0);
      const d1 = evensList[0].toString(); // smallest even
      const d2 = oddsList[1] ? oddsList[1].toString() : (minOdd + 2).toString();
      const d3 = oddsList[oddsList.length - 1].toString(); // greatest odd
      options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: "OPPOSITE_CONDITION_EVEN"
      };
    }
  } else if (activeVariant === "advanced_form_greatest_less_than_x") {
    // Pick boundary from the middle of valid numbers
    const medianIdx = Math.floor(validNumbers.length * 0.6);
    const bound = Math.floor(validNumbers[medianIdx] / 1000) * 1000;
    const filtered = validNumbers.filter(n => n < bound);
    const maxFiltered = filtered[filtered.length - 1];
    finalAnswer = maxFiltered.toString();

    promptInstruction = `- Question stem: "Use all the digit cards ${digits.join(', ')} to form the greatest 5-digit number that is smaller than ${bound}. Each card can only be used once."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const overBound = validNumbers.filter(n => n > bound)[0]?.toString() || (bound + 100).toString();
      const secondMax = filtered[filtered.length - 2]?.toString() || (maxFiltered - 10).toString();
      const smallest = filtered[0].toString();
      options = [finalAnswer, overBound, secondMax, smallest].sort(() => Math.random() - 0.5);
      defectMap = {
        [overBound]: "EXCEEDED_BOUNDARY_CONDITION"
      };
    }
  } else {
    // advanced_form_smallest_greater_than_x
    const medianIdx = Math.floor(validNumbers.length * 0.4);
    const bound = Math.floor(validNumbers[medianIdx] / 1000) * 1000;
    const filtered = validNumbers.filter(n => n > bound);
    const minFiltered = filtered[0];
    finalAnswer = minFiltered.toString();

    promptInstruction = `- Question stem: "Use all the digit cards ${digits.join(', ')} to form the smallest 5-digit number that is greater than ${bound}. Each card can only be used once."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const underBound = validNumbers.filter(n => n < bound).pop()?.toString() || (bound - 100).toString();
      const secondMin = filtered[1]?.toString() || (minFiltered + 10).toString();
      const greatest = filtered[filtered.length - 1].toString();
      options = [finalAnswer, underBound, secondMin, greatest].sort(() => Math.random() - 0.5);
      defectMap = {
        [underBound]: "UNDER_BOUNDARY_CONDITION"
      };
    }
  }

  const visualEngineStr = `{\n    "componentToRender": "NUMBER_CARDS",\n    "componentData": {\n      "items": ["${digits[0]}", "${digits[1]}", "${digits[2]}", "${digits[3]}", "${digits[4]}"]\n    }\n  }`;

  const inputRequirementStr = isStructure ? `{\n    "inputType": "MULTI_STEP_INPUT"\n  }` : null;
  const mcqInstruction = isMCQ ? `- Generate EXACTLY 4 options: ${JSON.stringify(options)}.\\n- Set defectMap to: ${JSON.stringify(defectMap)}.` : "";

  const aiPrompt = `You are an expert Singapore Primary 4 Math educator.
Generate an advanced-level question for Singapore Primary 4 students.
Topic: Whole Numbers - Numbers up to 100 000
Subtopic: Number Comparison and Ordering
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
