export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions) {
  let promptInstruction = "";
  let finalAnswer = "";
  let options = [];
  let defectMap = {};
  const visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;

  if (!activeVariant || activeVariant === 'foundation_default' || activeVariant === 'default') {
    const defaultVariants = [
      'foundation_symbol_meaning',
      'foundation_choose_correct_symbol',
      'foundation_complete_approx_statement',
      'foundation_identify_rounding_place_from_approx',
      'foundation_true_false_statement'
    ];
    activeVariant = defaultVariants[Math.floor(Math.random() * defaultVariants.length)];
  }

  if (activeVariant === 'foundation_symbol_meaning') {
    finalAnswer = "is approximately equal to";
    promptInstruction = `- Question stem: "What does the mathematical symbol '≈' mean?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const d1 = "is equal to";
      const d2 = "is greater than";
      const d3 = "is less than";
      options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: "CONFUSED_APPROXIMATION_WITH_EXACT_EQUALITY",
        [d2]: "CONFUSED_APPROXIMATION_WITH_INEQUALITY",
        [d3]: "CONFUSED_APPROXIMATION_WITH_INEQUALITY"
      };
    }
  } else if (activeVariant === 'foundation_choose_correct_symbol') {
    // Tests deciding between '=' and '≈'
    const isApprox = Math.random() < 0.5;
    let stem = "";
    if (isApprox) {
      const base = Math.floor(Math.random() * 80 + 10) * 1000; // e.g. 34 000
      const offset = Math.floor(Math.random() * 400 + 40); // e.g. 230
      const num = base + offset; // e.g. 34 230
      finalAnswer = "≈";
      stem = `Which symbol (= or ≈) should replace the blank to make the statement correct?\\n${num.toLocaleString()} [ ___ ] ${base.toLocaleString()} (rounded to the nearest thousand)`;
    } else {
      const a = Math.floor(Math.random() * 40 + 10) * 1000;
      const b = Math.floor(Math.random() * 40 + 10) * 1000;
      const sum = a + b;
      finalAnswer = "=";
      stem = `Which symbol (= or ≈) should replace the blank to make the statement correct?\\n${a.toLocaleString()} + ${b.toLocaleString()} [ ___ ] ${sum.toLocaleString()}`;
    }

    promptInstruction = `- Question stem: "${stem}"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const d1 = finalAnswer === "≈" ? "=" : "≈";
      const d2 = ">";
      const d3 = "<";
      options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: finalAnswer === "≈" ? "USED_EQUAL_FOR_ROUNDED_VALUE" : "USED_APPROX_FOR_EXACT_VALUE",
        [d2]: "USED_INEQUALITY_INSTEAD_OF_RELATION",
        [d3]: "USED_INEQUALITY_INSTEAD_OF_RELATION"
      };
    }
  } else if (activeVariant === 'foundation_complete_approx_statement') {
    // e.g. "Complete the statement: 47 628 ≈ ________ (rounded to the nearest hundred)."
    const placeTypes = [
      { name: "ten", roundFn: (n) => Math.round(n / 10) * 10 },
      { name: "hundred", roundFn: (n) => Math.round(n / 100) * 100 },
      { name: "thousand", roundFn: (n) => Math.round(n / 1000) * 1000 }
    ];
    const picked = placeTypes[Math.floor(Math.random() * placeTypes.length)];
    const num = Math.floor(Math.random() * 80000 + 12000);
    const rounded = picked.roundFn(num);
    finalAnswer = rounded.toString();

    promptInstruction = `- Question stem: "Complete the statement:\\n${num.toLocaleString()} ≈ ________ (rounded to the nearest ${picked.name})"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const d1 = (rounded + (picked.name === 'thousand' ? 1000 : picked.name === 'hundred' ? 100 : 10)).toString();
      const d2 = (rounded - (picked.name === 'thousand' ? 1000 : picked.name === 'hundred' ? 100 : 10)).toString();
      const d3 = num.toString();
      const set = new Set([finalAnswer, d1, d2, d3]);
      while (set.size < 4) {
        set.add((rounded + 500).toString());
      }
      options = Array.from(set).sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: "OFF_BY_ONE_ROUNDING_UNIT",
        [d2]: "OFF_BY_ONE_ROUNDING_UNIT",
        [d3]: "DID_NOT_ROUND"
      };
    }
  } else if (activeVariant === 'foundation_identify_rounding_place_from_approx') {
    // "In the statement 83 240 ≈ 83 000, to which place value has 83 240 been rounded?"
    const choices = [
      { num: 68340, rounded: 68000, answer: "nearest thousand" },
      { num: 45720, rounded: 45700, answer: "nearest hundred" },
      { num: 39462, rounded: 39460, answer: "nearest ten" }
    ];
    const picked = choices[Math.floor(Math.random() * choices.length)];
    finalAnswer = picked.answer;

    promptInstruction = `- Question stem: "In the statement ${picked.num.toLocaleString()} ≈ ${picked.rounded.toLocaleString()}, to which place value has the number been rounded?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const allOptions = ["nearest ten", "nearest hundred", "nearest thousand", "nearest ten thousand"];
      options = allOptions.sort(() => Math.random() - 0.5);
      defectMap = {};
      options.forEach(opt => {
        if (opt !== finalAnswer) defectMap[opt] = "MISIDENTIFIED_ROUNDING_PLACE_VALUE";
      });
    }
  } else {
    // foundation_true_false_statement
    const tth = Math.floor(Math.random() * 50 + 20) * 1000; // e.g. 35 000
    const num = tth + Math.floor(Math.random() * 300 + 50); // e.g. 35 180
    // Nearest thousand is tth
    finalAnswer = `${num.toLocaleString()} ≈ ${tth.toLocaleString()} (nearest thousand)`;
    const d1 = `${num.toLocaleString()} = ${tth.toLocaleString()}`;
    const d2 = `${num.toLocaleString()} ≈ ${(tth + 1000).toLocaleString()} (nearest thousand)`;
    const d3 = `${num.toLocaleString()} ≈ ${(tth - 1000).toLocaleString()} (nearest thousand)`;

    promptInstruction = `- Question stem: "Which of the following statements is mathematically correct?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: "USED_EQUAL_INSTEAD_OF_APPROXIMATION",
        [d2]: "ROUNDED_INCORRECTLY",
        [d3]: "ROUNDED_INCORRECTLY"
      };
    }
  }

  const inputRequirementStr = isStructure ? `{\n    "inputType": "MULTI_STEP_INPUT"\n  }` : null;
  const mcqInstruction = isMCQ ? `- Generate EXACTLY 4 options: ${JSON.stringify(options)}.\\n- Set defectMap to: ${JSON.stringify(defectMap)}.` : "";

  const aiPrompt = `You are an expert Singapore Primary 4 Math educator.
Generate a foundation-level question for Singapore Primary 4 students.
Topic: Whole Numbers - Numbers up to 100 000
Subtopic: Approximation Symbol (≈)
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
