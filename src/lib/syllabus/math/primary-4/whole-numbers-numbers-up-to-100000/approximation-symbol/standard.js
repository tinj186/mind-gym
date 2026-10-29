import { getRandomNames } from '../../../../../utils/variable-bank.js';

export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions) {
  let promptInstruction = "";
  let finalAnswer = "";
  let options = [];
  let defectMap = {};
  let acceptedAnswers = [];
  const visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;

  if (!activeVariant || activeVariant === 'standard_default' || activeVariant === 'default') {
    const defaultVariants = [
      'standard_correct_symbol_choice_multi',
      'standard_approx_degree_identification',
      'standard_find_original_from_approx',
      'standard_error_analysis',
      'standard_estimation_chain'
    ];
    activeVariant = defaultVariants[Math.floor(Math.random() * defaultVariants.length)];
  }

  if (activeVariant === 'standard_correct_symbol_choice_multi') {
    const isSumToRounded = Math.random() < 0.5;
    let stem = "";
    if (isSumToRounded) {
      // 43 280 + 26 810 [ ___ ] 43 000 + 27 000 (Approximation -> ≈)
      const a = Math.floor(Math.random() * 30 + 20) * 1000 + Math.floor(Math.random() * 400 + 100);
      const b = Math.floor(Math.random() * 20 + 10) * 1000 + Math.floor(Math.random() * 400 + 600);
      const ra = Math.round(a / 1000) * 1000;
      const rb = Math.round(b / 1000) * 1000;
      finalAnswer = "≈";
      stem = `Which symbol (= or ≈) should replace the blank to make the mathematical sentence correct?\\n${a.toLocaleString()} + ${b.toLocaleString()} [ ___ ] ${ra.toLocaleString()} + ${rb.toLocaleString()}`;
    } else {
      // 43 000 + 27 000 [ ___ ] 70 000 (Exact equality -> =)
      const ra = Math.floor(Math.random() * 30 + 20) * 1000;
      const rb = Math.floor(Math.random() * 20 + 10) * 1000;
      const sum = ra + rb;
      finalAnswer = "=";
      stem = `Which symbol (= or ≈) should replace the blank to make the mathematical sentence correct?\\n${ra.toLocaleString()} + ${rb.toLocaleString()} [ ___ ] ${sum.toLocaleString()}`;
    }

    promptInstruction = `- Question stem: "${stem}"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const d1 = finalAnswer === "≈" ? "=" : "≈";
      const d2 = ">";
      const d3 = "<";
      options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: finalAnswer === "≈" ? "USED_EQUAL_FOR_APPROXIMATION" : "USED_APPROX_FOR_EXACT_SUM",
        [d2]: "CONFUSED_WITH_INEQUALITY",
        [d3]: "CONFUSED_WITH_INEQUALITY"
      };
    }
  } else if (activeVariant === 'standard_approx_degree_identification') {
    // Tests multi-digit numbers that round to the same value across 1, 2, or 3 place values
    const degreeCases = ['all_three', 'hundred_thousand', 'thousand_only'];
    const pickedCase = degreeCases[Math.floor(Math.random() * degreeCases.length)];
    const baseThousands = Math.floor(Math.random() * 70 + 20); // 20 to 89
    const R = baseThousands * 1000;
    let num, matchedDesc, count;

    if (pickedCase === 'all_three') {
      const isBelow = Math.random() < 0.5;
      const offset = Math.floor(Math.random() * 4) + 1; // 1 to 4 -> rounds to R for 10, 100, 1000
      num = isBelow ? R - offset : R + offset;
      matchedDesc = "nearest ten, nearest hundred, and nearest thousand";
      count = 3;
    } else if (pickedCase === 'hundred_thousand') {
      const isBelow = Math.random() < 0.5;
      const offset = Math.floor(Math.random() * 40) + 8; // 8 to 47 -> inside [R-50, R+49], outside [R-5, R+4]
      num = isBelow ? R - offset : R + offset;
      matchedDesc = "nearest hundred and nearest thousand only";
      count = 2;
    } else {
      const isBelow = Math.random() < 0.5;
      const offset = Math.floor(Math.random() * 380) + 65; // 65 to 445 -> inside [R-500, R+499], outside [R-50, R+49]
      num = isBelow ? R - offset : R + offset;
      matchedDesc = "nearest thousand only";
      count = 1;
    }

    const r10 = Math.round(num / 10) * 10;
    const r100 = Math.round(num / 100) * 100;
    const r1000 = Math.round(num / 1000) * 1000;

    if (isMCQ) {
      finalAnswer = matchedDesc;
      const allPossible = [
        "nearest ten, nearest hundred, and nearest thousand",
        "nearest hundred and nearest thousand only",
        "nearest thousand only",
        "nearest ten only"
      ];
      options = allPossible.sort(() => Math.random() - 0.5);
      defectMap = {};
      options.forEach(opt => {
        if (opt !== finalAnswer) {
          defectMap[opt] = "MISIDENTIFIED_MATCHING_ROUNDING_SCALE";
        }
      });

      promptInstruction = `- Question stem: EXACTLY "Consider the approximation statement: ${num.toLocaleString()} ≈ ${R.toLocaleString()}. To which place value(s) can ${num.toLocaleString()} be rounded to produce this result?"
- The finalAnswer must be strictly "${finalAnswer}".
- In the solutionSteps:
  * Step 1: Round ${num.toLocaleString()} to the nearest ten: ${r10.toLocaleString()} (${r10 === R ? "equals" : "does not equal"} ${R.toLocaleString()}).
  * Step 2: Round ${num.toLocaleString()} to the nearest hundred: ${r100.toLocaleString()} (${r100 === R ? "equals" : "does not equal"} ${R.toLocaleString()}).
  * Step 3: Round ${num.toLocaleString()} to the nearest thousand: ${r1000.toLocaleString()} (${r1000 === R ? "equals" : "does not equal"} ${R.toLocaleString()}).
  * Step 4: Conclude that ${num.toLocaleString()} produces ${R.toLocaleString()} when rounded to the ${matchedDesc}.
- In the hint: Test rounding ${num.toLocaleString()} to each place value (ten, hundred, and thousand) individually to see which ones equal ${R.toLocaleString()}!`;
    } else {
      // Short question: provide two varied, concise subtypes
      const isCountQuestion = Math.random() < 0.5;
      if (isCountQuestion) {
        finalAnswer = count.toString();
        acceptedAnswers = [
          count.toString(),
          count === 3 ? "three" : count === 2 ? "two" : "one"
        ];
        if (count === 3) acceptedAnswers.push("all three", "all 3");

        promptInstruction = `- Question stem: EXACTLY "Consider the approximation statement: ${num.toLocaleString()} ≈ ${R.toLocaleString()}.\\nHow many of the following place values (nearest ten, nearest hundred, nearest thousand) give ${R.toLocaleString()} when ${num.toLocaleString()} is rounded?\\nAnswer with 1, 2, or 3."
- The finalAnswer must be strictly "${finalAnswer}".
- In the solutionSteps:
  * Step 1: Round ${num.toLocaleString()} to the nearest ten: ${r10.toLocaleString()} (${r10 === R ? "matches" : "does not match"}).
  * Step 2: Round ${num.toLocaleString()} to the nearest hundred: ${r100.toLocaleString()} (${r100 === R ? "matches" : "does not match"}).
  * Step 3: Round ${num.toLocaleString()} to the nearest thousand: ${r1000.toLocaleString()} (${r1000 === R ? "matches" : "does not match"}).
  * Step 4: Count the matching place values: exactly ${count} (${matchedDesc}).
- In the hint: Check each of the three place values one by one and count how many equal ${R.toLocaleString()}!`;
      } else {
        // Multiple-choice letter style in short question
        const choices = [
          { label: "Option A", text: "nearest ten, nearest hundred, and nearest thousand" },
          { label: "Option B", text: "nearest hundred and nearest thousand only" },
          { label: "Option C", text: "nearest thousand only" },
          { label: "Option D", text: "nearest ten only" }
        ];
        const correctChoice = choices.find(c => c.text === matchedDesc);
        finalAnswer = correctChoice.label;
        const letter = correctChoice.label.replace("Option ", "");
        acceptedAnswers = [
          correctChoice.label,
          correctChoice.label.toLowerCase(),
          letter,
          letter.toLowerCase(),
          matchedDesc
        ];

        const choicesText = choices.map(c => `${c.label}: ${c.text}`).join("\\n");
        promptInstruction = `- Question stem: EXACTLY "Consider the approximation statement: ${num.toLocaleString()} ≈ ${R.toLocaleString()}.\\nTo which place value(s) can ${num.toLocaleString()} be rounded to produce this result?\\n${choicesText}\\nWrite Option A, Option B, Option C, or Option D."
- The finalAnswer must be strictly "${finalAnswer}".
- In the solutionSteps:
  * Step 1: Round ${num.toLocaleString()} to nearest ten (${r10.toLocaleString()}), nearest hundred (${r100.toLocaleString()}), and nearest thousand (${r1000.toLocaleString()}).
  * Step 2: Identify which ones match ${R.toLocaleString()} (${matchedDesc}).
  * Step 3: Conclude that ${finalAnswer} (${matchedDesc}) is the correct choice.
- In the hint: Test each place value to determine which option lists all the matching ones!`;
      }
    }
  } else if (activeVariant === 'standard_find_original_from_approx') {
    const target = Math.floor(Math.random() * 60 + 20) * 1000; // e.g. 48 000
    const correctNum = target + Math.floor(Math.random() * 400 + 40); // 48 040 to 48 440 -> rounds to 48 000
    finalAnswer = correctNum.toLocaleString();

    const d1 = (target + 550).toLocaleString(); // rounds to target + 1000
    const d2 = (target - 550).toLocaleString(); // rounds to target - 1000
    const d3 = (target + 1200).toLocaleString();

    options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
    defectMap = {
      [d1]: "OUTSIDE_ROUNDING_INTERVAL",
      [d2]: "OUTSIDE_ROUNDING_INTERVAL",
      [d3]: "OUTSIDE_ROUNDING_INTERVAL"
    };

    promptInstruction = `- Question stem: "If Y ≈ ${target.toLocaleString()} when rounded to the nearest thousand, which of the following numbers could be Y?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;
  } else if (activeVariant === 'standard_error_analysis') {
    const studentName = getRandomNames(1)[0];
    const num = Math.floor(Math.random() * 60 + 20) * 1000 + Math.floor(Math.random() * 400 + 550); // rounds up
    const rounded = Math.round(num / 1000) * 1000;
    finalAnswer = "He should use the '≈' symbol instead of the '=' symbol.";

    promptInstruction = `- Question stem: "${studentName} wrote the mathematical sentence: ${num.toLocaleString()} = ${rounded.toLocaleString()} (to the nearest thousand). What mistake did ${studentName} make?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const d1 = `The number should round down to ${(rounded - 1000).toLocaleString()}.`;
      const d2 = `The number should round to ${Math.round(num / 100) * 100}.`;
      const d3 = "There is no error in the mathematical sentence.";
      options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: "WRONG_ROUNDING_DIRECTION",
        [d2]: "WRONG_PLACE_VALUE",
        [d3]: "FAILED_TO_IDENTIFY_EQUAL_SIGN_ERROR"
      };
    }
  } else {
    // standard_estimation_chain
    // e.g. "43 890 + 27 120 ≈ 44 000 + 27 000 = ________"
    const a = Math.floor(Math.random() * 30 + 20) * 1000 + Math.floor(Math.random() * 400 + 600);
    const b = Math.floor(Math.random() * 20 + 10) * 1000 + Math.floor(Math.random() * 300 + 100);
    const ra = Math.round(a / 1000) * 1000;
    const rb = Math.round(b / 1000) * 1000;
    const sum = ra + rb;
    finalAnswer = sum.toString();

    promptInstruction = `- Question stem: "Complete the estimation sentence:\\n${a.toLocaleString()} + ${b.toLocaleString()} ≈ ${ra.toLocaleString()} + ${rb.toLocaleString()} = ________"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const d1 = (a + b).toString(); // exact sum without rounding
      const d2 = (sum + 1000).toString();
      const d3 = (sum - 1000).toString();
      const set = new Set([finalAnswer, d1, d2, d3]);
      while (set.size < 4) {
        set.add((sum + 2000).toString());
      }
      options = Array.from(set).sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: "EXACT_SUM_INSTEAD_OF_ESTIMATE",
        [d2]: "OFF_BY_THOUSAND",
        [d3]: "OFF_BY_THOUSAND"
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
Generate a standard-level question for Singapore Primary 4 students.
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
