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
    // Lead digit is small (e.g. 2 or 3) while other digits are 8 or 9
    const tth = Math.floor(Math.random() * 3) + 2; // 2, 3, or 4
    const th = 8;
    const h = 9;
    const t = 7;
    const o = 9;
    const num = (tth * 10000) + (th * 1000) + (h * 100) + (t * 10) + o;
    finalAnswer = tth.toString();

    promptInstruction = `- Question stem: "Which digit has the greatest value in the number ${num}?"\\n- The finalAnswer must be just the single digit numeral ${finalAnswer} (since its value is ${tth * 10000}, which is greater than the value of any other digit).`;

    if (isMCQ) {
      options = [finalAnswer, "9", "8", "7"].sort(() => Math.random() - 0.5);
      defectMap = {
        "9": "CONFUSED_DIGIT_AND_VALUE",
        "8": "CONFUSED_DIGIT_AND_VALUE"
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
