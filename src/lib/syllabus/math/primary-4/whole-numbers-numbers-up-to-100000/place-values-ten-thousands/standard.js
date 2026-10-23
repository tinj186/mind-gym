export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions) {
  let promptInstruction = "";
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let finalAnswer = "";
  let options = [];
  let defectMap = {};

  if (!activeVariant || activeVariant === 'standard_default' || activeVariant === 'default') {
    const defaultVariants = [
      'standard_digit_value',
      'standard_digit_with_value',
      'standard_expanded_form_missing',
      'standard_greatest_value_digit',
      'standard_mystery_number_values'
    ];
    activeVariant = defaultVariants[Math.floor(Math.random() * defaultVariants.length)];
  }

  if (activeVariant === 'standard_digit_value') {
    // Generate distinct digits to avoid ambiguity
    let digits = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5).slice(0, 5);
    const [tth, th, h, t, o] = digits;
    const num = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;

    const places = [
      { name: 'ten thousands', dig: tth, val: tth * 10000 },
      { name: 'thousands', dig: th, val: th * 1000 },
      { name: 'hundreds', dig: h, val: h * 100 },
      { name: 'tens', dig: t, val: t * 10 },
      { name: 'ones', dig: o, val: o }
    ];
    const target = places[Math.floor(Math.random() * places.length)];
    finalAnswer = target.val.toString();

    promptInstruction = `- Question stem: "What is the value of the digit ${target.dig} in the number ${num}?"\\n- The finalAnswer must be just the numeral ${finalAnswer}.`;

    if (isMCQ) {
      const opts = new Set([
        finalAnswer,
        target.dig.toString(),
        (target.dig * 10).toString(),
        (target.dig * 100).toString(),
        (target.dig * 1000).toString(),
        (target.dig * 10000).toString()
      ]);
      options = Array.from(opts).slice(0, 4).sort(() => Math.random() - 0.5);
      defectMap = {
        [target.dig.toString()]: "CONFUSED_DIGIT_AND_VALUE"
      };
    }
  } else if (activeVariant === 'standard_digit_with_value') {
    let digits = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5).slice(0, 5);
    const [tth, th, h, t, o] = digits;
    const num = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;

    const places = [
      { name: 'ten thousands', dig: tth, val: tth * 10000 },
      { name: 'thousands', dig: th, val: th * 1000 },
      { name: 'hundreds', dig: h, val: h * 100 },
      { name: 'tens', dig: t, val: t * 10 },
      { name: 'ones', dig: o, val: o }
    ];
    const target = places[Math.floor(Math.random() * places.length)];
    finalAnswer = target.dig.toString();

    promptInstruction = `- Question stem: "In the number ${num}, which digit has a value of ${target.val}?"\\n- The finalAnswer must be just the single digit numeral ${finalAnswer}.`;

    if (isMCQ) {
      const others = digits.filter(d => d !== target.dig).slice(0, 3);
      options = [finalAnswer, ...others.map(String)].sort(() => Math.random() - 0.5);
      defectMap = {
        [others[0]]: "PLACE_VALUE_MISALIGNMENT"
      };
    }
  } else if (activeVariant === 'standard_expanded_form_missing') {
    const tth = Math.floor(Math.random() * 9) + 1;
    const th = Math.floor(Math.random() * 9) + 1;
    const h = Math.floor(Math.random() * 9) + 1;
    const t = Math.floor(Math.random() * 9) + 1;
    const o = Math.floor(Math.random() * 9) + 1;
    const num = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;

    const parts = [
      { val: tth * 10000 },
      { val: th * 1000 },
      { val: h * 100 },
      { val: t * 10 },
      { val: o }
    ];
    const missingIdx = Math.floor(Math.random() * 5);
    const missingValue = parts[missingIdx].val;
    finalAnswer = missingValue.toString();

    const equationStr = parts.map((p, idx) => idx === missingIdx ? '___' : p.val).join(' + ');
    promptInstruction = `- Question stem: "Find the missing number in the expanded form equation: ${num} = ${equationStr}."\\n- The finalAnswer must be strictly the missing numeral ${finalAnswer}.`;

    if (isMCQ) {
      const d1 = missingValue > 9 ? (missingValue / 10).toString() : (missingValue * 10).toString();
      const d2 = (missingValue * 10).toString();
      const d3 = (missingValue + 100).toString();
      const set = new Set([finalAnswer, d1, d2, d3]);
      while (set.size < 4) {
        set.add((missingValue + Math.floor(Math.random() * 5 + 1) * 10).toString());
      }
      options = Array.from(set).sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: "PLACE_VALUE_MISALIGNMENT"
      };
    }
  } else if (activeVariant === 'standard_greatest_value_digit') {
    // Varieties for comparing digit values across place values and numbers:
    // Subtype 0: "In which of the following numbers does the digit D have the greatest value?" (MCQ) / "Between X and Y, in which number does D have the greater value?" (Short)
    // Subtype 1: "In which of the following numbers does the digit D have the smallest value?" (MCQ) / "Between X and Y, in which number does D have the smaller value?" (Short)
    // Subtype 2: Multiplicative comparison of repeated digits within a number ("In X, how many times is the value of the digit D in the ten thousands place greater than the value of D in the hundreds place?")
    // Subtype 3 (MCQ): Difference between values of a digit across two numbers ("What is the difference between the values of the digit D in X and Y?")

    const subtype = isMCQ ? Math.floor(Math.random() * 4) : Math.floor(Math.random() * 3);
    const d = Math.floor(Math.random() * 8) + 2; // target digit 2 to 9
    let stem = "";

    if (subtype === 0) {
      // Subtype 0: Greatest value across numbers
      const pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(x => x !== d);
      const rnd = () => pool[Math.floor(Math.random() * pool.length)];

      const numTenThousands = (d * 10000) + (rnd() * 1000) + (rnd() * 100) + (rnd() * 10) + rnd();
      const numThousands = (rnd() * 10000 || 20000) + (d * 1000) + (rnd() * 100) + (rnd() * 10) + rnd();
      const numHundreds = (rnd() * 10000 || 30000) + (rnd() * 1000) + (d * 100) + (rnd() * 10) + rnd();
      const numTens = (rnd() * 10000 || 40000) + (rnd() * 1000) + (rnd() * 100) + (d * 10) + rnd();

      finalAnswer = numTenThousands.toString();

      if (isMCQ) {
        stem = `In which of the following numbers does the digit ${d} have the greatest value?`;
        options = [finalAnswer, numThousands.toString(), numHundreds.toString(), numTens.toString()].sort(() => Math.random() - 0.5);
        defectMap = {
          [numThousands.toString()]: "PLACE_VALUE_MISALIGNMENT",
          [numHundreds.toString()]: "PLACE_VALUE_MISALIGNMENT"
        };
        promptInstruction = `- Question stem: "${stem}"\\n- The finalAnswer must be strictly "${finalAnswer}".\\n- When writing solutionSteps, calculate the value of the digit ${d} in each number: in ${numTenThousands} it is ${d * 10000}, in ${numThousands} it is ${d * 1000}, in ${numHundreds} it is ${d * 100}, in ${numTens} it is ${d * 10}, then state that ${d * 10000} is the greatest.\\n- In the hint, encourage checking which number places ${d} in the ten thousands column.`;
      } else {
        stem = `Between the numbers ${numThousands} and ${numTenThousands}, in which number does the digit ${d} have the greater value?`;
        promptInstruction = `- Question stem: "${stem}"\\n- The finalAnswer must be strictly "${finalAnswer}".\\n- When writing solutionSteps, compare the value of ${d} in ${numThousands} (${d * 1000}) and ${numTenThousands} (${d * 10000}) to conclude ${finalAnswer} has the greater value.\\n- In the hint, compare the place value of the digit ${d} in both numbers.`;
      }
    } else if (subtype === 1) {
      // Subtype 1: Smallest value across numbers
      const pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(x => x !== d);
      const rnd = () => pool[Math.floor(Math.random() * pool.length)];

      const numTenThousands = (d * 10000) + (rnd() * 1000) + (rnd() * 100) + (rnd() * 10) + rnd();
      const numThousands = (rnd() * 10000 || 20000) + (d * 1000) + (rnd() * 100) + (rnd() * 10) + rnd();
      const numHundreds = (rnd() * 10000 || 30000) + (rnd() * 1000) + (d * 100) + (rnd() * 10) + rnd();
      const numTens = (rnd() * 10000 || 40000) + (rnd() * 1000) + (rnd() * 100) + (d * 10) + rnd();

      finalAnswer = numTens.toString();

      if (isMCQ) {
        stem = `In which of the following numbers does the digit ${d} have the smallest value?`;
        options = [finalAnswer, numHundreds.toString(), numThousands.toString(), numTenThousands.toString()].sort(() => Math.random() - 0.5);
        defectMap = {
          [numTenThousands.toString()]: "REVERSED_GREATEST_SMALLEST",
          [numHundreds.toString()]: "PLACE_VALUE_MISALIGNMENT"
        };
        promptInstruction = `- Question stem: "${stem}"\\n- The finalAnswer must be strictly "${finalAnswer}".\\n- When writing solutionSteps, calculate the value of ${d} in each number and show that ${d * 10} is the smallest.\\n- In the hint, look for which number has ${d} in the lowest place value column (tens).`;
      } else {
        stem = `Between the numbers ${numTenThousands} and ${numTens}, in which number does the digit ${d} have the smaller value?`;
        promptInstruction = `- Question stem: "${stem}"\\n- The finalAnswer must be strictly "${finalAnswer}".\\n- When writing solutionSteps, compare the value of ${d} in ${numTenThousands} (${d * 10000}) and in ${numTens} (${d * 10}) to conclude ${finalAnswer} has the smaller value.\\n- In the hint, compare the place value of the digit ${d} in each number.`;
      }
    } else if (subtype === 2) {
      // Subtype 2: Multiplicative comparison of repeated digits within a number
      const p2Choices = [
        { name: 'thousands', mult: 1000, ratio: 10 },
        { name: 'hundreds', mult: 100, ratio: 100 },
        { name: 'tens', mult: 10, ratio: 1000 }
      ];
      const p2 = p2Choices[Math.floor(Math.random() * p2Choices.length)];

      const pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(x => x !== d);
      const rnd = () => pool[Math.floor(Math.random() * pool.length)];

      let num = d * 10000;
      if (p2.name === 'thousands') {
        num += (d * 1000) + (rnd() * 100) + (rnd() * 10) + rnd();
      } else if (p2.name === 'hundreds') {
        num += (rnd() * 1000) + (d * 100) + (rnd() * 10) + rnd();
      } else {
        num += (rnd() * 1000) + (rnd() * 100) + (d * 10) + rnd();
      }

      finalAnswer = p2.ratio.toString();
      stem = `In the number ${num}, how many times is the value of the digit ${d} in the ten thousands place greater than the value of the digit ${d} in the ${p2.name} place?`;
      promptInstruction = `- Question stem: "${stem}"\\n- The finalAnswer must be strictly "${finalAnswer}".\\n- When writing solutionSteps, explain that in ${num}, the value of ${d} in the ten thousands place is ${d * 10000}, the value of ${d} in the ${p2.name} place is ${d * p2.mult}, and ${d * 10000} ÷ ${d * p2.mult} = ${finalAnswer}.\\n- In the hint, divide the larger value by the smaller value.`;

      if (isMCQ) {
        const wrong = ['10', '100', '1000', '10000'].filter(r => r !== finalAnswer);
        options = [finalAnswer, wrong[0], wrong[1], wrong[2]].sort(() => Math.random() - 0.5);
        defectMap = {
          [wrong[0]]: "OFF_BY_FACTOR_OF_10",
          [wrong[1]]: "OFF_BY_FACTOR_OF_10"
        };
      }
    } else {
      // Subtype 3 (MCQ): Difference between values of a digit across two numbers
      const val1 = d * 10000;
      const val2 = d * 1000;
      const diff = val1 - val2;
      finalAnswer = diff.toString();

      const pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(x => x !== d);
      const rnd = () => pool[Math.floor(Math.random() * pool.length)];
      const num1 = val1 + (rnd() * 1000) + (rnd() * 100) + (rnd() * 10) + rnd();
      const num2 = (rnd() * 10000 || 30000) + val2 + (rnd() * 100) + (rnd() * 10) + rnd();

      stem = `What is the difference between the values of the digit ${d} in the numbers ${num1} and ${num2}?`;
      promptInstruction = `- Question stem: "${stem}"\\n- The finalAnswer must be strictly "${finalAnswer}".\\n- When writing solutionSteps, calculate the value of ${d} in ${num1} (${val1}), the value of ${d} in ${num2} (${val2}), and subtract: ${val1} - ${val2} = ${finalAnswer}.\\n- In the hint, calculate the values of the digit in both numbers and find their difference.`;

      options = [finalAnswer, val1.toString(), (val1 + val2).toString(), (diff - 1000).toString()].sort(() => Math.random() - 0.5);
      defectMap = {
        [(val1 + val2).toString()]: "CONFUSED_ADDITION_AND_SUBTRACTION",
        [val1.toString()]: "OMITTED_SECOND_STEP"
      };
    }
  } else {
    // standard_mystery_number_values
    const tth = Math.floor(Math.random() * 9) + 1;
    const th = Math.floor(Math.random() * 10);
    const h = Math.floor(Math.random() * 10);
    const t = Math.floor(Math.random() * 10);
    const o = Math.floor(Math.random() * 10);
    const num = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;
    finalAnswer = num.toString();

    const clues = [
      `my ten thousands digit is ${tth}`,
      `my thousands digit is ${th}`,
      `my hundreds digit is ${h}`,
      `my tens digit is ${t}`,
      `my ones digit is ${o}`
    ];
    // Shuffle clues
    for (let i = clues.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [clues[i], clues[j]] = [clues[j], clues[i]];
    }

    promptInstruction = `- Question stem: "I am a 5-digit number. ${clues.join(', ')}. What number am I?"\\n- The finalAnswer must be strictly ${finalAnswer}.`;

    if (isMCQ) {
      const d1 = (th * 10000) + (tth * 1000) + (h * 100) + (t * 10) + o; // swapped ten-thousands and thousands
      const d2 = num + 100;
      const d3 = num - 10;
      const set = new Set([finalAnswer, d1.toString(), d2.toString(), d3.toString()]);
      while (set.size < 4) {
        set.add((num + Math.floor(Math.random() * 5 + 1) * 1000).toString());
      }
      options = Array.from(set).sort(() => Math.random() - 0.5);
      defectMap = {
        [d1.toString()]: "PLACE_VALUE_MISALIGNMENT"
      };
    }
  }

  const inputRequirementStr = isStructure ? `{\n    "inputType": "MULTI_STEP_INPUT"\n  }` : null;
  const mcqInstruction = isMCQ ? `- Generate EXACTLY 4 options: ${JSON.stringify(options)}.\\n- Set defectMap to: ${JSON.stringify(defectMap)}.` : "";

  const aiPrompt = `You are an expert Singapore Primary 4 Math educator.
Generate a standard-level question for Singapore Primary 4 students.
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
