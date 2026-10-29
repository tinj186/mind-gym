import { getRandomNames, getRandomCountableItems } from '../../../../../utils/variable-bank.js';

export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions) {
  let promptInstruction = "";
  let finalAnswer = "";
  let options = [];
  let defectMap = {};
  let acceptedAnswers = [];
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
    // 4 distinct subtypes ensuring rich variety in both Short Question and MCQ
    const subtype = Math.floor(Math.random() * 4);

    if (subtype === 0) {
      // Subtype 0: Definition completion ("approximately" / "approximation")
      const isAlt = Math.random() < 0.5;
      if (isAlt) {
        finalAnswer = "approximately";
        acceptedAnswers = ["approximately", "approximate", "nearly", "about"];
        promptInstruction = `- Question stem: EXACTLY "Complete the mathematical definition of the symbol '≈':\\nThe symbol '≈' means 'is ____________ equal to'."\\n- The finalAnswer must be strictly "approximately".\\n- In the solutionSteps, explain that '≈' is the approximation symbol and means 'is approximately equal to'.\\n- In the hint, remind the student that '≈' represents an estimate rather than an exact equality.`;

        if (isMCQ) {
          const d1 = "strictly";
          const d2 = "exactly";
          const d3 = "greater than";
          options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
          defectMap = {
            [d1]: "CONFUSED_APPROXIMATION_WITH_STRICT_EQUALITY",
            [d2]: "CONFUSED_APPROXIMATION_WITH_EXACTNESS",
            [d3]: "CONFUSED_APPROXIMATION_WITH_INEQUALITY"
          };
        }
      } else {
        finalAnswer = "approximation";
        acceptedAnswers = ["approximation", "approximate", "estimation"];
        promptInstruction = `- Question stem: EXACTLY "What word completes the name of the symbol '≈'?\\nThe '≈' sign is called the ____________ symbol."\\n- The finalAnswer must be strictly "approximation".\\n- In the solutionSteps, state that '≈' is known as the approximation symbol because it is used for rounded or estimated values.\\n- In the hint, think about what word comes from 'approximate'.`;

        if (isMCQ) {
          const d1 = "equality";
          const d2 = "addition";
          const d3 = "division";
          options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
          defectMap = {
            [d1]: "CONFUSED_APPROXIMATION_WITH_EQUALITY",
            [d2]: "CONFUSED_SYMBOL_WITH_ARITHMETIC_OPERATOR",
            [d3]: "CONFUSED_SYMBOL_WITH_ARITHMETIC_OPERATOR"
          };
        }
      }
    } else if (subtype === 1) {
      // Subtype 1: Meaning in context of a real-world rounded value ("exact" vs "approximate")
      const name = getRandomNames(1)[0];
      const itemObj = getRandomCountableItems(1)[0];
      const item = itemObj?.item || "books";

      const placeOptions = [
        { name: "thousand", round: (n) => Math.round(n / 1000) * 1000 },
        { name: "hundred", round: (n) => Math.round(n / 100) * 100 },
        { name: "ten", round: (n) => Math.round(n / 10) * 10 }
      ];
      const pickedPlace = placeOptions[Math.floor(Math.random() * placeOptions.length)];
      const thousands = Math.floor(Math.random() * 70 + 15);
      const rawNum = (thousands * 1000) + Math.floor(Math.random() * 850 + 50);
      const roundedNum = pickedPlace.round(rawNum);

      const isExact = Math.random() < 0.5;
      if (isExact) {
        finalAnswer = "exact";
        acceptedAnswers = ["exact", "exact value", "an exact value"];
        promptInstruction = `- Question stem: EXACTLY "${name} counted exactly ${rawNum.toLocaleString()} ${item}. If ${name} writes '${rawNum.toLocaleString()} = ${rawNum.toLocaleString()}', does the '=' symbol represent an 'exact' value or an 'approximate' value?"\\n- The finalAnswer must be strictly "exact".\\n- In the solutionSteps, explain that '=' represents exact equality with no rounding.\\n- In the hint, consider whether the count was rounded or counted precisely.`;

        if (isMCQ) {
          const d1 = "approximate";
          const d2 = "rounded";
          const d3 = "estimated";
          options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
          defectMap = {
            [d1]: "CONFUSED_EXACT_VALUE_WITH_APPROXIMATION",
            [d2]: "CONFUSED_EXACT_COUNT_WITH_ROUNDING",
            [d3]: "CONFUSED_EXACT_COUNT_WITH_ESTIMATE"
          };
        }
      } else {
        finalAnswer = "approximate";
        acceptedAnswers = ["approximate", "approximate value", "an approximate value", "approximately", "estimate"];
        promptInstruction = `- Question stem: EXACTLY "In the mathematical statement '${rawNum.toLocaleString()} ≈ ${roundedNum.toLocaleString()}', does the number ${roundedNum.toLocaleString()} represent an 'exact' value or an 'approximate' value?"\\n- The finalAnswer must be strictly "approximate".\\n- In the solutionSteps, explain that because ${roundedNum.toLocaleString()} is rounded and connected by '≈', it is an approximate value.\\n- In the hint, recall what the symbol '≈' tells us about the number next to it.`;

        if (isMCQ) {
          const d1 = "exact";
          const d2 = "original";
          const d3 = "greater";
          options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
          defectMap = {
            [d1]: "CONFUSED_APPROXIMATE_VALUE_WITH_EXACT_VALUE",
            [d2]: "CONFUSED_ROUNDED_VALUE_WITH_ORIGINAL_NUMBER",
            [d3]: "CONFUSED_APPROXIMATION_WITH_COMPARISON"
          };
        }
      }
    } else if (subtype === 2) {
      // Subtype 2: Connecting the symbol '≈' to its mathematical purpose
      const thousands = Math.floor(Math.random() * 60 + 20);
      const offset = Math.floor(Math.random() * 350 + 25);
      const num = (thousands * 1000) + offset;
      const rounded = Math.round(num / 1000) * 1000;

      finalAnswer = "≈";
      acceptedAnswers = ["≈", "~=", "approx", "approximately equal to"];
      promptInstruction = `- Question stem: EXACTLY "To show that ${num.toLocaleString()} has been rounded to ${rounded.toLocaleString()}, we write:\\n${num.toLocaleString()} [ ___ ] ${rounded.toLocaleString()}\\nWhich mathematical symbol (= or ≈) means 'is approximately equal to'?"\\n- The finalAnswer must be strictly "≈".\\n- In the solutionSteps, explain that since ${rounded.toLocaleString()} is a rounded estimate, '≈' must be used instead of '='.\\n- In the hint, think of the symbol with wavy lines used for estimation.`;

      if (isMCQ) {
        const d1 = "=";
        const d2 = ">";
        const d3 = "<";
        options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
        defectMap = {
          [d1]: "USED_EQUAL_SIGN_FOR_APPROXIMATION",
          [d2]: "USED_GREATER_THAN_SYMBOL",
          [d3]: "USED_LESS_THAN_SYMBOL"
        };
      }
    } else {
      // Subtype 3: Conceptual meaning of '≈' ("close" / "rounded")
      const thousands = Math.floor(Math.random() * 60 + 20);
      const hundreds = Math.floor(Math.random() * 8 + 1) * 100;
      const num = (thousands * 1000) + hundreds + Math.floor(Math.random() * 40 + 5);
      const rounded = Math.round(num / 100) * 100;

      const isClose = Math.random() < 0.5;
      if (isClose) {
        finalAnswer = "close";
        acceptedAnswers = ["close", "close to each other", "approximately equal", "approximate"];
        promptInstruction = `- Question stem: EXACTLY "The symbol '=' means two amounts are exactly equal. The symbol '≈' in '${num.toLocaleString()} ≈ ${rounded.toLocaleString()}' means that the two values are ____________ (choose: equal / close / opposite)."\\n- The finalAnswer must be strictly "close".\\n- In the solutionSteps, explain that '≈' signifies that two quantities are close to each other, not strictly equal.\\n- In the hint, recall that approximate values are near or close to the actual number.`;

        if (isMCQ) {
          const d1 = "equal";
          const d2 = "opposite";
          const d3 = "unrelated";
          options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
          defectMap = {
            [d1]: "CONFUSED_APPROXIMATION_WITH_EXACT_EQUALITY",
            [d2]: "CONFUSED_APPROXIMATION_WITH_OPPOSITE",
            [d3]: "FAILED_TO_UNDERSTAND_APPROXIMATION"
          };
        }
      } else {
        finalAnswer = "rounded";
        acceptedAnswers = ["rounded", "round", "estimated"];
        promptInstruction = `- Question stem: EXACTLY "In the mathematical sentence '${num.toLocaleString()} ≈ ${rounded.toLocaleString()}', the symbol '≈' shows that the number has been ____________ to give an estimate (choose: rounded / multiplied / divided)."\\n- The finalAnswer must be strictly "rounded".\\n- In the solutionSteps, explain that the '≈' symbol is used after a number is rounded to a specified place value.\\n- In the hint, what math operation did we perform on ${num.toLocaleString()} to get ${rounded.toLocaleString()}?`;

        if (isMCQ) {
          const d1 = "multiplied";
          const d2 = "divided";
          const d3 = "doubled";
          options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
          defectMap = {
            [d1]: "CONFUSED_ROUNDING_WITH_ARITHMETIC_OPERATION",
            [d2]: "CONFUSED_ROUNDING_WITH_ARITHMETIC_OPERATION",
            [d3]: "CONFUSED_ROUNDING_WITH_ARITHMETIC_OPERATION"
          };
        }
      }
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

  let inputRequirementStr = null;
  if (isStructure) {
    inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT"\n  }`;
  } else if (isShort && acceptedAnswers.length > 0) {
    inputRequirementStr = JSON.stringify({ inputType: "STANDARD_TEXT", acceptedAnswers }, null, 2);
  }
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
