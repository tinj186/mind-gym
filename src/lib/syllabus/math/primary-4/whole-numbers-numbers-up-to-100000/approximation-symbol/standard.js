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
    // Dynamic place value selection: nearest thousand, nearest hundred, or nearest ten
    const placeValues = [
      { name: "nearest thousand", unit: 1000, half: 500, minTarget: 20, maxTarget: 89, mul: 1000 },
      { name: "nearest hundred", unit: 100, half: 50, minTarget: 200, maxTarget: 899, mul: 100 },
      { name: "nearest ten", unit: 10, half: 5, minTarget: 2000, maxTarget: 8999, mul: 10 }
    ];
    // Weight towards thousand and hundred
    const pvWeights = [0, 0, 1, 1, 2];
    const pv = placeValues[pvWeights[Math.floor(Math.random() * pvWeights.length)]];
    const target = Math.floor(Math.random() * (pv.maxTarget - pv.minTarget + 1) + pv.minTarget) * pv.mul;

    // Pick variable name or phrasing
    const varNames = ['Y', 'X', 'N', 'P', 'M', 'K', 'W'];
    const varName = varNames[Math.floor(Math.random() * varNames.length)];

    // Correct number: either rounds up or rounds down to target
    const roundUp = Math.random() < 0.5;
    const offsetMin = Math.max(1, Math.floor(pv.half * 0.1));
    const offsetMax = pv.half - 1;
    const offset = Math.floor(Math.random() * (offsetMax - offsetMin + 1)) + offsetMin;
    const correctNum = roundUp ? target - offset : target + offset;

    // Distractor 1: rounds up to target + unit
    const d1Offset = pv.half + Math.floor(Math.random() * Math.floor(pv.half * 0.6) + Math.max(1, Math.floor(pv.half * 0.05)));
    const d1 = target + d1Offset;

    // Distractor 2: rounds down to target - unit
    const d2Offset = pv.half + Math.floor(Math.random() * Math.floor(pv.half * 0.6) + Math.max(1, Math.floor(pv.half * 0.05)));
    const d2 = target - d2Offset;

    // Distractor 3: further off
    const d3 = target + pv.unit + Math.floor(Math.random() * Math.floor(pv.half * 0.8) + Math.max(1, Math.floor(pv.half * 0.1)));

    const lowerBound = target - pv.half;
    const upperBound = target + pv.half - 1;

    const correctStr = correctNum.toLocaleString();
    const d1Str = d1.toLocaleString();
    const d2Str = d2.toLocaleString();
    const d3Str = d3.toLocaleString();

    // Question stems
    const stems = [
      `If ${varName} ≈ ${target.toLocaleString()} when rounded to the ${pv.name}, which of the following numbers could be ${varName}?`,
      `Given that ${varName} ≈ ${target.toLocaleString()} when rounded to the ${pv.name}, which number can ${varName} be?`,
      `Which of the following numbers gives ${target.toLocaleString()} when rounded to the ${pv.name}?`
    ];
    const baseStem = stems[Math.floor(Math.random() * stems.length)];

    if (isMCQ) {
      finalAnswer = correctStr;
      options = [correctStr, d1Str, d2Str, d3Str].sort(() => Math.random() - 0.5);
      defectMap = {
        [d1Str]: "ROUNDS_UP_TO_NEXT_PLACE_VALUE",
        [d2Str]: "ROUNDS_DOWN_TO_PREVIOUS_PLACE_VALUE",
        [d3Str]: "OUTSIDE_ROUNDING_INTERVAL"
      };

      promptInstruction = `- Question stem: EXACTLY "${baseStem}"
- The finalAnswer must be strictly "${finalAnswer}".
- In the solutionSteps:
  * Step 1: State that to round to the ${pv.name}, numbers from ${lowerBound.toLocaleString()} to ${upperBound.toLocaleString()} round to ${target.toLocaleString()}.
  * Step 2: Test each option:
    - ${correctStr} is between ${lowerBound.toLocaleString()} and ${upperBound.toLocaleString()}, so it rounds to ${target.toLocaleString()} (correct).
    - ${d1Str} rounds to ${(Math.round(d1 / pv.unit) * pv.unit).toLocaleString()}.
    - ${d2Str} rounds to ${(Math.round(d2 / pv.unit) * pv.unit).toLocaleString()}.
    - ${d3Str} rounds to ${(Math.round(d3 / pv.unit) * pv.unit).toLocaleString()}.
  * Step 3: Conclude that ${finalAnswer} is the correct number.
- In the hint: Any number between ${lowerBound.toLocaleString()} and ${upperBound.toLocaleString()} rounds to ${target.toLocaleString()} when rounded to the ${pv.name}!`;
    } else {
      // Short question: provide options directly in stem so student can answer
      const isLetterStyle = Math.random() < 0.5;
      const rawChoices = [
        { text: correctStr, isCorrect: true, defect: null },
        { text: d1Str, isCorrect: false, defect: "ROUNDS_UP_TO_NEXT_PLACE_VALUE" },
        { text: d2Str, isCorrect: false, defect: "ROUNDS_DOWN_TO_PREVIOUS_PLACE_VALUE" },
        { text: d3Str, isCorrect: false, defect: "OUTSIDE_ROUNDING_INTERVAL" }
      ].sort(() => Math.random() - 0.5);

      if (isLetterStyle) {
        const labels = ["Option A", "Option B", "Option C", "Option D"];
        const labeledChoices = rawChoices.map((c, idx) => ({
          label: labels[idx],
          text: c.text,
          isCorrect: c.isCorrect
        }));
        const correctChoice = labeledChoices.find(c => c.isCorrect);
        finalAnswer = correctChoice.label;
        const letterOnly = correctChoice.label.replace("Option ", "");

        acceptedAnswers = [
          correctChoice.label,
          correctChoice.label.toLowerCase(),
          letterOnly,
          letterOnly.toLowerCase(),
          correctStr,
          correctNum.toString(),
          correctStr.replace(/,/g, ' ')
        ];

        const choicesBlock = labeledChoices.map(c => `${c.label}: ${c.text}`).join("\\n");
        promptInstruction = `- Question stem: EXACTLY "${baseStem}\\n${choicesBlock}\\nWrite Option A, Option B, Option C, or Option D."
- The finalAnswer must be strictly "${finalAnswer}".
- In the solutionSteps:
  * Step 1: Note that whole numbers from ${lowerBound.toLocaleString()} to ${upperBound.toLocaleString()} round to ${target.toLocaleString()} when rounded to the ${pv.name}.
  * Step 2: Check each option to see which falls in the range [${lowerBound.toLocaleString()}, ${upperBound.toLocaleString()}].
  * Step 3: ${correctChoice.label} (${correctStr}) rounds to ${target.toLocaleString()}.
  * Step 4: Conclude that ${finalAnswer} is the correct option.
- In the hint: Look at the rounding rule for ${pv.name} and check which option falls between ${lowerBound.toLocaleString()} and ${upperBound.toLocaleString()}!`;
      } else {
        // Direct list selection style
        finalAnswer = correctStr;
        acceptedAnswers = [
          correctStr,
          correctNum.toString(),
          correctStr.replace(/,/g, ' ')
        ];

        const choicesList = rawChoices.map(c => c.text).join(", ");
        promptInstruction = `- Question stem: EXACTLY "${baseStem}\\nChoices: ${choicesList}\\nWrite the correct number."
- The finalAnswer must be strictly "${finalAnswer}".
- In the solutionSteps:
  * Step 1: Recall the rounding range for ${pv.name}: whole numbers from ${lowerBound.toLocaleString()} to ${upperBound.toLocaleString()} round to ${target.toLocaleString()}.
  * Step 2: Evaluate the numbers in the list:
    - ${correctStr} rounds to ${target.toLocaleString()} (correct).
    - ${d1Str} rounds to ${(Math.round(d1 / pv.unit) * pv.unit).toLocaleString()}.
    - ${d2Str} rounds to ${(Math.round(d2 / pv.unit) * pv.unit).toLocaleString()}.
    - ${d3Str} rounds to ${(Math.round(d3 / pv.unit) * pv.unit).toLocaleString()}.
  * Step 3: Conclude that the correct number is ${finalAnswer}.
- In the hint: Check which of the listed numbers falls in the range from ${lowerBound.toLocaleString()} to ${upperBound.toLocaleString()}!`;
      }
    }
  } else if (activeVariant === 'standard_error_analysis') {
    const studentName = getRandomNames(1)[0];
    const errorTypes = ['symbol_equal_for_approx', 'symbol_approx_for_exact', 'wrong_direction', 'wrong_place_value'];
    const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];

    let baseStem = "";
    let correctDesc = "";
    let d1Desc = "";
    let d2Desc = "";
    let d3Desc = "";
    let d1Defect = "";
    let d2Defect = "";
    let d3Defect = "";
    let solSteps = "";
    let hintText = "";
    const shortQuestionType = Math.random() < 0.5 ? 'letter' : 'direct';

    let directAnswer = "";
    let directAccepted = [];
    let directQuestionStem = "";
    let directSolSteps = "";
    let directHint = "";

    if (errorType === 'symbol_equal_for_approx') {
      const placeValues = [
        { name: "nearest thousand", unit: 1000 },
        { name: "nearest hundred", unit: 100 }
      ];
      const pv = placeValues[Math.floor(Math.random() * placeValues.length)];
      const num = Math.floor(Math.random() * 60 + 20) * 1000 + Math.floor(Math.random() * 800 + 100);
      const rounded = Math.round(num / pv.unit) * pv.unit;

      baseStem = `${studentName} wrote the mathematical sentence: ${num.toLocaleString()} = ${rounded.toLocaleString()} (to the ${pv.name}). What mistake did ${studentName} make?`;
      correctDesc = "Used the '=' symbol instead of the '≈' symbol for an approximation.";
      d1Desc = "Rounded in the wrong direction.";
      d1Defect = "WRONG_ROUNDING_DIRECTION";
      d2Desc = "Rounded to the wrong place value.";
      d2Defect = "WRONG_PLACE_VALUE";
      d3Desc = "There is no mistake in the mathematical sentence.";
      d3Defect = "FAILED_TO_IDENTIFY_EQUAL_SIGN_ERROR";

      solSteps = `* Step 1: Check the rounding: ${num.toLocaleString()} rounded to the ${pv.name} is indeed ${rounded.toLocaleString()}.\\n  * Step 2: Notice the symbol used is '=', which indicates exact equality.\\n  * Step 3: Since ${num.toLocaleString()} is not equal to ${rounded.toLocaleString()}, the approximation symbol '≈' should be used instead.\\n  * Step 4: Conclude that ${studentName} made the mistake of using '=' instead of '≈'.`;
      hintText = `Look closely at the symbol between ${num.toLocaleString()} and ${rounded.toLocaleString()}. Is ${num.toLocaleString()} exactly equal to ${rounded.toLocaleString()}, or is it an approximation?`;

      directQuestionStem = `${studentName} wrote: ${num.toLocaleString()} [ ? ] ${rounded.toLocaleString()} (to the ${pv.name}).\\nWhich symbol (= or ≈) should replace [ ? ] to make the mathematical sentence correct?`;
      directAnswer = "≈";
      directAccepted = ["≈", "approx", "approximately", "approximate", "~"];
      directSolSteps = `* Step 1: ${num.toLocaleString()} rounded to the ${pv.name} is ${rounded.toLocaleString()}.\\n  * Step 2: Since ${num.toLocaleString()} is an estimate rather than exact equality, use the approximation symbol '≈'.`;
      directHint = `Recall that '=' means exactly equal, while '≈' means approximately equal!`;

    } else if (errorType === 'symbol_approx_for_exact') {
      const a = Math.floor(Math.random() * 40 + 10) * 1000;
      const b = Math.floor(Math.random() * 30 + 10) * 1000;
      const sum = a + b;

      baseStem = `${studentName} calculated the exact sum: ${a.toLocaleString()} + ${b.toLocaleString()} ≈ ${sum.toLocaleString()}. What mistake did ${studentName} make?`;
      correctDesc = "Used the '≈' symbol instead of the '=' symbol for an exact calculation.";
      d1Desc = "Calculated the sum incorrectly.";
      d1Defect = "CALCULATION_MISCONCEPTION";
      d2Desc = "Should have rounded both numbers to the nearest thousand first.";
      d2Defect = "CONFUSED_ESTIMATION_CONVENTION";
      d3Desc = "There is no mistake in the mathematical sentence.";
      d3Defect = "FAILED_TO_IDENTIFY_APPROX_SIGN_ERROR";

      solSteps = `* Step 1: Calculate the exact sum: ${a.toLocaleString()} + ${b.toLocaleString()} = ${sum.toLocaleString()}.\\n  * Step 2: Observe that the calculation is exact, not an estimate.\\n  * Step 3: The symbol '≈' should only be used for approximations, while '=' must be used for exact equality.\\n  * Step 4: Conclude that ${studentName} should have used '=' instead of '≈'.`;
      hintText = `Calculate ${a.toLocaleString()} + ${b.toLocaleString()}. Is the result exactly ${sum.toLocaleString()} or an estimate?`;

      directQuestionStem = `${studentName} calculated: ${a.toLocaleString()} + ${b.toLocaleString()} [ ? ] ${sum.toLocaleString()}.\\nWhich symbol (= or ≈) should replace [ ? ] to make the exact sentence correct?`;
      directAnswer = "=";
      directAccepted = ["=", "equal", "equals", "equal sign", "is equal to"];
      directSolSteps = `* Step 1: Calculate the exact sum: ${a.toLocaleString()} + ${b.toLocaleString()} = ${sum.toLocaleString()}.\\n  * Step 2: Since the two sides are exactly equal, the correct symbol is '='.`;
      directHint = `Check if the left side equals the right side exactly!`;

    } else if (errorType === 'wrong_direction') {
      const thousands = Math.floor(Math.random() * 60 + 20);
      const shouldRoundUp = Math.random() < 0.5;
      let num, wrongRounded, correctRounded;

      if (shouldRoundUp) {
        const offset = Math.floor(Math.random() * 400 + 550);
        num = (thousands * 1000) + offset;
        correctRounded = (thousands + 1) * 1000;
        wrongRounded = thousands * 1000;
        correctDesc = `Rounded down to ${wrongRounded.toLocaleString()} instead of rounding up to ${correctRounded.toLocaleString()}.`;
      } else {
        const offset = Math.floor(Math.random() * 350 + 100);
        num = (thousands * 1000) + offset;
        correctRounded = thousands * 1000;
        wrongRounded = (thousands + 1) * 1000;
        correctDesc = `Rounded up to ${wrongRounded.toLocaleString()} instead of rounding down to ${correctRounded.toLocaleString()}.`;
      }

      d1Desc = "Used the '≈' symbol instead of the '=' symbol.";
      d1Defect = "CONFUSED_SYMBOL_WITH_CALCULATION";
      d2Desc = "Rounded to the nearest hundred instead of the nearest thousand.";
      d2Defect = "WRONG_PLACE_VALUE";
      d3Desc = "There is no mistake in the approximation sentence.";
      d3Defect = "FAILED_TO_IDENTIFY_ROUNDING_ERROR";

      baseStem = `${studentName} wrote: ${num.toLocaleString()} ≈ ${wrongRounded.toLocaleString()} (to the nearest thousand). What mistake did ${studentName} make?`;
      solSteps = `* Step 1: Look at the digit in the hundreds place of ${num.toLocaleString()}: it is ${Math.floor((num % 1000) / 100)}.\\n  * Step 2: According to the rounding rule, since this digit is ${shouldRoundUp ? "5 or greater, we round up" : "less than 5, we round down"}.\\n  * Step 3: ${num.toLocaleString()} rounded to the nearest thousand should be ${correctRounded.toLocaleString()}.\\n  * Step 4: Conclude that ${studentName} ${shouldRoundUp ? "rounded down instead of rounding up" : "rounded up instead of rounding down"}.`;
      hintText = `Look at the digit in the hundreds place of ${num.toLocaleString()}. Should the number be rounded up or rounded down?`;

      directQuestionStem = `${studentName} made a rounding error in the statement: ${num.toLocaleString()} ≈ ${wrongRounded.toLocaleString()} (to the nearest thousand).\\nWhat is the correct value when ${num.toLocaleString()} is rounded to the nearest thousand?`;
      directAnswer = correctRounded.toLocaleString();
      directAccepted = [
        correctRounded.toLocaleString(),
        correctRounded.toString(),
        correctRounded.toLocaleString().replace(/,/g, ' ')
      ];
      directSolSteps = `* Step 1: Look at the hundreds digit of ${num.toLocaleString()}.\\n  * Step 2: Since it is ${shouldRoundUp ? "5 or greater, round up" : "less than 5, round down"} to ${correctRounded.toLocaleString()}.`;
      directHint = `Identify the hundreds digit of ${num.toLocaleString()} and apply the rounding rule to round to the nearest thousand!`;

    } else {
      // wrong_place_value
      const thousands = Math.floor(Math.random() * 60 + 20);
      const hundredsDigit = Math.floor(Math.random() * 4 + 6);
      const tensOnes = Math.floor(Math.random() * 40 + 10);
      const num = (thousands * 1000) + (hundredsDigit * 100) + tensOnes;
      const wrongRounded = (thousands * 1000) + (hundredsDigit * 100);
      const correctRounded = (thousands + 1) * 1000;

      baseStem = `${studentName} wrote: ${num.toLocaleString()} ≈ ${wrongRounded.toLocaleString()} (to the nearest thousand). What mistake did ${studentName} make?`;
      correctDesc = "Rounded to the nearest hundred instead of the nearest thousand.";
      d1Desc = "Used the '≈' symbol instead of the '=' symbol.";
      d1Defect = "CONFUSED_SYMBOL_WITH_PLACE_VALUE";
      d2Desc = `The number should round down to ${(thousands * 1000).toLocaleString()}.`;
      d2Defect = "WRONG_ROUNDING_DIRECTION";
      d3Desc = "There is no mistake in the mathematical statement.";
      d3Defect = "FAILED_TO_IDENTIFY_PLACE_VALUE_ERROR";

      solSteps = `* Step 1: Observe that the rounded value ${wrongRounded.toLocaleString()} has only the tens and ones digits as zeros, which means it was rounded to the nearest hundred.\\n  * Step 2: The question specifies rounding to the nearest thousand, which requires looking at the hundreds place (${hundredsDigit}).\\n  * Step 3: Since ${hundredsDigit} is 5 or greater, ${num.toLocaleString()} rounded to the nearest thousand is ${correctRounded.toLocaleString()}.\\n  * Step 4: Conclude that ${studentName} rounded to the nearest hundred instead of the nearest thousand.`;
      hintText = `Count how many zeros are at the end of ${wrongRounded.toLocaleString()}. Was it rounded to the nearest thousand or another place value?`;

      directQuestionStem = `${studentName} wrote: ${num.toLocaleString()} ≈ ${wrongRounded.toLocaleString()} (to the nearest thousand).\\nWhat is the correct value of ${num.toLocaleString()} rounded to the nearest thousand?`;
      directAnswer = correctRounded.toLocaleString();
      directAccepted = [
        correctRounded.toLocaleString(),
        correctRounded.toString(),
        correctRounded.toLocaleString().replace(/,/g, ' ')
      ];
      directSolSteps = `* Step 1: Look at the hundreds digit of ${num.toLocaleString()} (${hundredsDigit}).\\n  * Step 2: Since it is 5 or greater, round up to ${correctRounded.toLocaleString()}.`;
      directHint = `To round to the nearest thousand, look at the hundreds digit and round up or down!`;
    }

    if (isMCQ) {
      finalAnswer = correctDesc;
      options = [correctDesc, d1Desc, d2Desc, d3Desc].sort(() => Math.random() - 0.5);
      defectMap = {
        [d1Desc]: d1Defect,
        [d2Desc]: d2Defect,
        [d3Desc]: d3Defect
      };

      promptInstruction = `- Question stem: EXACTLY "${baseStem}"
- The finalAnswer must be strictly "${finalAnswer}".
- In the solutionSteps:
  ${solSteps}
- In the hint: ${hintText}`;
    } else {
      if (shortQuestionType === 'direct') {
        finalAnswer = directAnswer;
        acceptedAnswers = directAccepted;
        promptInstruction = `- Question stem: EXACTLY "${directQuestionStem}"
- The finalAnswer must be strictly "${finalAnswer}".
- In the solutionSteps:
  ${directSolSteps}
- In the hint: ${directHint}`;
      } else {
        // letter choice format
        const rawChoices = [
          { text: correctDesc, isCorrect: true },
          { text: d1Desc, isCorrect: false },
          { text: d2Desc, isCorrect: false },
          { text: d3Desc, isCorrect: false }
        ].sort(() => Math.random() - 0.5);

        const labels = ["Option A", "Option B", "Option C", "Option D"];
        const labeled = rawChoices.map((c, idx) => ({
          label: labels[idx],
          text: c.text,
          isCorrect: c.isCorrect
        }));
        const correctChoice = labeled.find(c => c.isCorrect);
        finalAnswer = correctChoice.label;
        const letter = correctChoice.label.replace("Option ", "");

        acceptedAnswers = [
          correctChoice.label,
          correctChoice.label.toLowerCase(),
          letter,
          letter.toLowerCase(),
          correctDesc
        ];

        const choicesBlock = labeled.map(c => `${c.label}: ${c.text}`).join("\\n");
        promptInstruction = `- Question stem: EXACTLY "${baseStem}\\n${choicesBlock}\\nWrite Option A, Option B, Option C, or Option D."
- The finalAnswer must be strictly "${finalAnswer}".
- In the solutionSteps:
  ${solSteps}
  * Conclude that ${finalAnswer} is the correct choice.
- In the hint: ${hintText}`;
      }
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
