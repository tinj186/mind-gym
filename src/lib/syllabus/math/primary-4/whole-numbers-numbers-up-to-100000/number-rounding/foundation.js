export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions) {
  let promptInstruction = "";
  let finalAnswer = "";
  let options = [];
  let defectMap = {};
  const visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;

  if (!activeVariant || activeVariant === 'foundation_default' || activeVariant === 'default') {
    const defaultVariants = [
      'foundation_round_nearest_10',
      'foundation_round_nearest_100',
      'foundation_round_nearest_1000',
      'foundation_midpoint_rule',
      'foundation_identify_rounding_digit'
    ];
    activeVariant = defaultVariants[Math.floor(Math.random() * defaultVariants.length)];
  }

  if (activeVariant === 'foundation_round_nearest_10') {
    // Generate 4-digit or 5-digit number not ending in 0
    const tensBase = Math.floor(Math.random() * 8900 + 1000) * 10; // e.g. 10 000 to 99 000
    const ones = Math.floor(Math.random() * 9) + 1; // 1 to 9
    const num = tensBase + ones;
    const min = tensBase;
    const max = tensBase + 10;
    const correctRound = ones >= 5 ? max : min;
    finalAnswer = correctRound.toString();

    promptInstruction = `- Question stem: "Round ${num.toLocaleString()} to the nearest ten."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const d1 = (ones >= 5 ? min : max).toString(); // wrong direction
      const d2 = (correctRound + 10).toString();
      const d3 = (correctRound - 10).toString();
      const set = new Set([finalAnswer, d1, d2, d3]);
      while (set.size < 4) {
        set.add((correctRound + (Math.floor(Math.random() * 4 + 2) * 10)).toString());
      }
      options = Array.from(set).slice(0, 4).sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: ones >= 5 ? "ROUNDED_DOWN_INSTEAD_OF_UP" : "ROUNDED_UP_INSTEAD_OF_DOWN",
        [d2]: "OFF_BY_TEN",
        [d3]: "OFF_BY_TEN"
      };
      options.forEach(opt => {
        if (opt !== finalAnswer && !defectMap[opt]) {
          defectMap[opt] = "INCORRECT_ROUNDING";
        }
      });
    }
  } else if (activeVariant === 'foundation_round_nearest_100') {
    const hundredsBase = Math.floor(Math.random() * 890 + 100) * 100;
    const offset = Math.floor(Math.random() * 99) + 1;
    const num = hundredsBase + offset;
    const min = hundredsBase;
    const max = hundredsBase + 100;
    const correctRound = offset >= 50 ? max : min;
    finalAnswer = correctRound.toString();

    promptInstruction = `- Question stem: "Round ${num.toLocaleString()} to the nearest hundred."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const d1 = (offset >= 50 ? min : max).toString();
      const d2 = (correctRound + 100).toString();
      const d3 = (correctRound - 100).toString();
      const set = new Set([finalAnswer, d1, d2, d3]);
      while (set.size < 4) {
        set.add((correctRound + (Math.floor(Math.random() * 4 + 2) * 100)).toString());
      }
      options = Array.from(set).slice(0, 4).sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: offset >= 50 ? "ROUNDED_DOWN_INSTEAD_OF_UP" : "ROUNDED_UP_INSTEAD_OF_DOWN",
        [d2]: "OFF_BY_HUNDRED",
        [d3]: "OFF_BY_HUNDRED"
      };
      options.forEach(opt => {
        if (opt !== finalAnswer && !defectMap[opt]) {
          defectMap[opt] = "INCORRECT_ROUNDING";
        }
      });
    }
  } else if (activeVariant === 'foundation_round_nearest_1000') {
    const thousandsBase = Math.floor(Math.random() * 89 + 10) * 1000;
    const offset = Math.floor(Math.random() * 999) + 1;
    const num = thousandsBase + offset;
    const min = thousandsBase;
    const max = thousandsBase + 1000;
    const correctRound = offset >= 500 ? max : min;
    finalAnswer = correctRound.toString();

    promptInstruction = `- Question stem: "Round ${num.toLocaleString()} to the nearest thousand."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const d1 = (offset >= 500 ? min : max).toString();
      const d2 = (correctRound + 1000).toString();
      const d3 = (correctRound - 1000).toString();
      const set = new Set([finalAnswer, d1, d2, d3]);
      while (set.size < 4) {
        set.add((correctRound + (Math.floor(Math.random() * 4 + 2) * 1000)).toString());
      }
      options = Array.from(set).slice(0, 4).sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: offset >= 500 ? "ROUNDED_DOWN_INSTEAD_OF_UP" : "ROUNDED_UP_INSTEAD_OF_DOWN",
        [d2]: "OFF_BY_THOUSAND",
        [d3]: "OFF_BY_THOUSAND"
      };
      options.forEach(opt => {
        if (opt !== finalAnswer && !defectMap[opt]) {
          defectMap[opt] = "INCORRECT_ROUNDING";
        }
      });
    }
  } else if (activeVariant === 'foundation_midpoint_rule') {
    // Tests exact halfway mark (5, 50, 500) rounding up
    const typeChoice = Math.floor(Math.random() * 3); // 0: nearest 10, 1: nearest 100, 2: nearest 1000
    if (typeChoice === 0) {
      const base = Math.floor(Math.random() * 8900 + 1000) * 10;
      const num = base + 5;
      finalAnswer = (base + 10).toString();
      promptInstruction = `- Question stem: "Round ${num.toLocaleString()} to the nearest ten."\\n- The finalAnswer must be strictly "${finalAnswer}".`;
      if (isMCQ) {
        const d1 = base.toString();
        const d2 = (base + 20).toString();
        const d3 = (base - 10).toString();
        options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
        defectMap = {
          [d1]: "FAILED_HALFWAY_ROUND_UP_RULE",
          [d2]: "OFF_BY_TEN",
          [d3]: "OFF_BY_TEN"
        };
      }
    } else if (typeChoice === 1) {
      const base = Math.floor(Math.random() * 890 + 100) * 100;
      const num = base + 50;
      finalAnswer = (base + 100).toString();
      promptInstruction = `- Question stem: "Round ${num.toLocaleString()} to the nearest hundred."\\n- The finalAnswer must be strictly "${finalAnswer}".`;
      if (isMCQ) {
        const d1 = base.toString();
        const d2 = (base + 200).toString();
        const d3 = (base - 100).toString();
        options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
        defectMap = {
          [d1]: "FAILED_HALFWAY_ROUND_UP_RULE",
          [d2]: "OFF_BY_HUNDRED",
          [d3]: "OFF_BY_HUNDRED"
        };
      }
    } else {
      const base = Math.floor(Math.random() * 89 + 10) * 1000;
      const num = base + 500;
      finalAnswer = (base + 1000).toString();
      promptInstruction = `- Question stem: "Round ${num.toLocaleString()} to the nearest thousand."\\n- The finalAnswer must be strictly "${finalAnswer}".`;
      if (isMCQ) {
        const d1 = base.toString();
        const d2 = (base + 2000).toString();
        const d3 = (base - 1000).toString();
        options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
        defectMap = {
          [d1]: "FAILED_HALFWAY_ROUND_UP_RULE",
          [d2]: "OFF_BY_THOUSAND",
          [d3]: "OFF_BY_THOUSAND"
        };
      }
    }
  } else {
    // foundation_identify_rounding_digit
    const places = [
      { name: "ten", targetDigitName: "ones", posFromRight: 0 },
      { name: "hundred", targetDigitName: "tens", posFromRight: 1 },
      { name: "thousand", targetDigitName: "hundreds", posFromRight: 2 }
    ];
    const picked = places[Math.floor(Math.random() * places.length)];
    const num = Math.floor(Math.random() * 80000 + 10000);
    const numStr = num.toString();
    const targetDigit = numStr[numStr.length - 1 - picked.posFromRight];
    finalAnswer = targetDigit;

    promptInstruction = `- Question stem: "When rounding ${num.toLocaleString()} to the nearest ${picked.name}, which digit in the number do you check to decide whether to round up or down?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const digits = new Set([finalAnswer]);
      for (const char of numStr) {
        digits.add(char);
      }
      let fallback = 1;
      while (digits.size < 4) {
        digits.add(fallback.toString());
        fallback++;
      }
      options = Array.from(digits).slice(0, 4).sort(() => Math.random() - 0.5);
      defectMap = {};
      options.forEach(opt => {
        if (opt !== finalAnswer) defectMap[opt] = "INCORRECT_PLACE_VALUE_CHECK";
      });
    }
  }

  const inputRequirementStr = isStructure ? `{\n    "inputType": "MULTI_STEP_INPUT"\n  }` : null;
  const mcqInstruction = isMCQ ? `- Generate EXACTLY 4 options: ${JSON.stringify(options)}.\\n- Set defectMap to: ${JSON.stringify(defectMap)}.` : "";

  const aiPrompt = `You are an expert Singapore Primary 4 Math educator.
Generate a foundation-level question for Singapore Primary 4 students.
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
