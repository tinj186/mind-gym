import { getRandomNames } from '../../../../../utils/variable-bank.js';

export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions) {
  let promptInstruction = "";
  let finalAnswer = "";
  let options = [];
  let defectMap = {};
  let acceptedAnswers = [];
  const visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;

  if (!activeVariant || activeVariant === 'advanced_default' || activeVariant === 'default') {
    const defaultVariants = [
      'advanced_symbol_chain_conventions',
      'advanced_dual_statement_validity',
      'advanced_range_of_approx_expression',
      'advanced_approx_inequality_heuristic',
      'advanced_estimation_sanity_check'
    ];
    activeVariant = defaultVariants[Math.floor(Math.random() * defaultVariants.length)];
  }

  if (activeVariant === 'advanced_symbol_chain_conventions') {
    // Tests strict Singapore MOE convention: A [op] B ≈ Round(A) [op] Round(B) = Total
    const isSubtraction = Math.random() < 0.5;
    const op = isSubtraction ? "-" : "+";

    const isHundred = Math.random() < 0.3;
    const pvUnit = isHundred ? 100 : 1000;
    const pvName = isHundred ? "nearest hundred" : "nearest thousand";

    const aThousands = Math.floor(Math.random() * 40 + 30);
    const bThousands = Math.floor(Math.random() * 20 + 10);

    let a = aThousands * 1000 + Math.floor(Math.random() * 800 + 100);
    let b = bThousands * 1000 + Math.floor(Math.random() * 800 + 100);

    if (isSubtraction && a <= b + 8000) {
      a = b + 12000 + Math.floor(Math.random() * 5000);
    }

    const ra = Math.round(a / pvUnit) * pvUnit;
    const rb = Math.round(b / pvUnit) * pvUnit;
    const result = isSubtraction ? ra - rb : ra + rb;

    const correctSentence = `${a.toLocaleString()} ${op} ${b.toLocaleString()} ≈ ${ra.toLocaleString()} ${op} ${rb.toLocaleString()} = ${result.toLocaleString()}`;
    const d1Sentence = `${a.toLocaleString()} ${op} ${b.toLocaleString()} = ${ra.toLocaleString()} ${op} ${rb.toLocaleString()} = ${result.toLocaleString()}`;
    const d2Sentence = `${a.toLocaleString()} ${op} ${b.toLocaleString()} ≈ ${ra.toLocaleString()} ${op} ${rb.toLocaleString()} ≈ ${result.toLocaleString()}`;
    const d3Sentence = `${a.toLocaleString()} ${op} ${b.toLocaleString()} = ${result.toLocaleString()}`;

    const isSymbolPairQuestion = Math.random() < 0.5;

    if (isSymbolPairQuestion) {
      const stem = `In the estimation sentence below, which symbols should replace [ 1 ] and [ 2 ] to follow strict Singapore mathematical conventions?\\n${a.toLocaleString()} ${op} ${b.toLocaleString()} [ 1 ] ${ra.toLocaleString()} ${op} ${rb.toLocaleString()} [ 2 ] ${result.toLocaleString()}`;

      const pairChoices = [
        { text: "[ 1 ] is ≈ and [ 2 ] is =", isCorrect: true, defect: null },
        { text: "[ 1 ] is = and [ 2 ] is =", isCorrect: false, defect: "USED_EQUAL_FOR_ROUNDED_TERMS" },
        { text: "[ 1 ] is ≈ and [ 2 ] is ≈", isCorrect: false, defect: "USED_APPROX_FOR_EXACT_CALCULATION" },
        { text: "[ 1 ] is = and [ 2 ] is ≈", isCorrect: false, defect: "REVERSED_SYMBOL_CONVENTIONS" }
      ].sort(() => Math.random() - 0.5);

      if (isMCQ) {
        finalAnswer = "[ 1 ] is ≈ and [ 2 ] is =";
        options = pairChoices.map(c => c.text);
        defectMap = {};
        pairChoices.forEach(c => {
          if (!c.isCorrect) defectMap[c.text] = c.defect;
        });

        promptInstruction = `- Question stem: EXACTLY "${stem}"
- The finalAnswer must be strictly "${finalAnswer}".
- In the solutionSteps:
  * Step 1: Note that ${a.toLocaleString()} ${op} ${b.toLocaleString()} is replaced by rounded values (${ra.toLocaleString()} ${op} ${rb.toLocaleString()}), so [ 1 ] must be the approximation symbol '≈'.
  * Step 2: Note that ${ra.toLocaleString()} ${op} ${rb.toLocaleString()} is exactly equal to ${result.toLocaleString()}, so [ 2 ] must be the equal sign '='.
  * Step 3: Conclude that [ 1 ] is ≈ and [ 2 ] is =.
- In the hint: Use '≈' when original numbers are replaced by approximations, and '=' when two expressions are strictly equal!`;
      } else {
        const labels = ["Option A", "Option B", "Option C", "Option D"];
        const labeled = pairChoices.map((c, idx) => ({
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
          "≈ and =",
          "≈, =",
          "[ 1 ] is ≈ and [ 2 ] is ="
        ];

        const choicesBlock = labeled.map(c => `${c.label}: ${c.text}`).join("\\n");
        promptInstruction = `- Question stem: EXACTLY "${stem}\\n${choicesBlock}\\nWrite Option A, Option B, Option C, or Option D."
- The finalAnswer must be strictly "${finalAnswer}".
- In the solutionSteps:
  * Step 1: Between original numbers and rounded numbers, use '≈' because it is an approximation.
  * Step 2: Between rounded numbers and the calculated result, use '=' because the arithmetic is exact.
  * Step 3: Conclude that ${finalAnswer} is the correct option.
- In the hint: Look for '≈' in the first blank and '=' in the second blank!`;
      }
    } else {
      const stem = `Which of the following mathematical sentences is written strictly correctly using the symbols '=' and '≈'?`;
      const rawSentences = [
        { text: correctSentence, isCorrect: true, defect: null },
        { text: d1Sentence, isCorrect: false, defect: "USED_EQUAL_FOR_ROUNDED_TERMS" },
        { text: d2Sentence, isCorrect: false, defect: "USED_APPROX_FOR_EXACT_CALCULATION" },
        { text: d3Sentence, isCorrect: false, defect: "EQUATED_UNROUNDED_TO_ROUNDED_RESULT" }
      ].sort(() => Math.random() - 0.5);

      if (isMCQ) {
        finalAnswer = correctSentence;
        options = rawSentences.map(c => c.text);
        defectMap = {};
        rawSentences.forEach(c => {
          if (!c.isCorrect) defectMap[c.text] = c.defect;
        });

        promptInstruction = `- Question stem: EXACTLY "${stem}"
- The finalAnswer must be strictly "${finalAnswer}".
- In the solutionSteps:
  * Step 1: Identify that ${a.toLocaleString()} and ${b.toLocaleString()} are rounded to ${ra.toLocaleString()} and ${rb.toLocaleString()} (to the ${pvName}), so the first relation must use '≈'.
  * Step 2: Identify that ${ra.toLocaleString()} ${op} ${rb.toLocaleString()} equals ${result.toLocaleString()} exactly, so the second relation must use '='.
  * Step 3: Conclude that "${finalAnswer}" follows strict Singapore MOE conventions.
- In the hint: Look for the statement that uses '≈' between original and rounded numbers, and '=' before the final exact sum/difference!`;
      } else {
        const labels = ["Option A", "Option B", "Option C", "Option D"];
        const labeled = rawSentences.map((c, idx) => ({
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
          correctSentence
        ];

        const choicesBlock = labeled.map(c => `${c.label}: ${c.text}`).join("\\n");
        promptInstruction = `- Question stem: EXACTLY "${stem}\\n${choicesBlock}\\nWrite Option A, Option B, Option C, or Option D."
- The finalAnswer must be strictly "${finalAnswer}".
- In the solutionSteps:
  * Step 1: Original numbers to rounded numbers requires '≈'.
  * Step 2: Rounded arithmetic to final total requires '='.
  * Step 3: Conclude that ${finalAnswer} (${correctSentence}) is strictly correct.
- In the hint: Find the option that correctly combines '≈' for estimation and '=' for exact calculation!`;
      }
    }
  } else if (activeVariant === 'advanced_dual_statement_validity') {
    const tth = Math.floor(Math.random() * 40 + 20) * 1000;
    const num = tth + Math.floor(Math.random() * 900 + 50);
    const actualThousand = Math.round(num / 1000) * 1000;
    const actualHundred = Math.round(num / 100) * 100;

    const s1Correct = Math.random() < 0.5;
    const s2Correct = Math.random() < 0.5;

    const claim1 = s1Correct ? actualThousand : actualThousand + (num > actualThousand ? -1000 : 1000);
    const claim2 = s2Correct ? actualHundred : actualHundred + (num > actualHundred ? -100 : 100);

    if (s1Correct && s2Correct) {
      finalAnswer = "Both Statement 1 and Statement 2 are true";
    } else if (s1Correct && !s2Correct) {
      finalAnswer = "Only Statement 1 is true";
    } else if (!s1Correct && s2Correct) {
      finalAnswer = "Only Statement 2 is true";
    } else {
      finalAnswer = "Neither Statement is true";
    }

    const allStatements = [
      "Both Statement 1 and Statement 2 are true",
      "Only Statement 1 is true",
      "Only Statement 2 is true",
      "Neither Statement is true"
    ];

    const stem = `Consider the two statements about the number ${num.toLocaleString()}:\\nStatement 1: ${num.toLocaleString()} ≈ ${claim1.toLocaleString()} (rounded to the nearest thousand)\\nStatement 2: ${num.toLocaleString()} ≈ ${claim2.toLocaleString()} (rounded to the nearest hundred)\\nWhich statement(s) are mathematically true?`;

    if (isMCQ) {
      options = allStatements.sort(() => Math.random() - 0.5);
      defectMap = {};
      options.forEach(opt => {
        if (opt !== finalAnswer) defectMap[opt] = "MISIDENTIFIED_STATEMENT_TRUTH_VALUE";
      });

      promptInstruction = `- Question stem: EXACTLY "${stem}"
- The finalAnswer must be strictly "${finalAnswer}".
- In the solutionSteps:
  * Step 1: Evaluate Statement 1: ${num.toLocaleString()} rounded to the nearest thousand is ${actualThousand.toLocaleString()} (Statement 1 is ${s1Correct ? "true" : "false"}).
  * Step 2: Evaluate Statement 2: ${num.toLocaleString()} rounded to the nearest hundred is ${actualHundred.toLocaleString()} (Statement 2 is ${s2Correct ? "true" : "false"}).
  * Step 3: Conclude that ${finalAnswer}.
- In the hint: Test Statement 1 and Statement 2 independently by rounding ${num.toLocaleString()} to the nearest thousand and nearest hundred!`;
    } else {
      const labels = ["Option A", "Option B", "Option C", "Option D"];
      const rawChoices = allStatements.map(text => ({ text, isCorrect: text === finalAnswer })).sort(() => Math.random() - 0.5);
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
        correctChoice.text
      ];

      const choicesBlock = labeled.map(c => `${c.label}: ${c.text}`).join("\\n");
      promptInstruction = `- Question stem: EXACTLY "${stem}\\n${choicesBlock}\\nWrite Option A, Option B, Option C, or Option D."
- The finalAnswer must be strictly "${finalAnswer}".
- In the solutionSteps:
  * Step 1: Round ${num.toLocaleString()} to nearest thousand (${actualThousand.toLocaleString()}) -> Statement 1 is ${s1Correct ? "true" : "false"}.
  * Step 2: Round ${num.toLocaleString()} to nearest hundred (${actualHundred.toLocaleString()}) -> Statement 2 is ${s2Correct ? "true" : "false"}.
  * Step 3: Conclude that ${finalAnswer} (${correctChoice.text}) is correct.
- In the hint: Check each statement individually against the rounding rules!`;
    }
  } else if (activeVariant === 'advanced_range_of_approx_expression') {
    const pThousands = Math.floor(Math.random() * 30 + 40) * 1000;
    const qThousands = Math.floor(Math.random() * 15 + 10) * 1000;
    const maxP = pThousands + 499;
    const minQ = qThousands - 500;
    const maxDiff = maxP - minQ;
    finalAnswer = maxDiff.toString();
    acceptedAnswers = [
      finalAnswer,
      maxDiff.toLocaleString(),
      maxDiff.toLocaleString().replace(/,/g, ' ')
    ];

    promptInstruction = `- Question stem: EXACTLY "If P ≈ ${pThousands.toLocaleString()} and Q ≈ ${qThousands.toLocaleString()} (where both numbers are rounded to the nearest thousand), what is the greatest possible value of P - Q?"
- The finalAnswer must be strictly "${finalAnswer}".
- In the solutionSteps:
  * Step 1: Find the greatest possible value of P: ${pThousands.toLocaleString()} + 499 = ${maxP.toLocaleString()}.
  * Step 2: Find the smallest possible value of Q: ${qThousands.toLocaleString()} - 500 = ${minQ.toLocaleString()}.
  * Step 3: Compute the greatest difference: ${maxP.toLocaleString()} - ${minQ.toLocaleString()} = ${maxDiff.toLocaleString()}.
- In the hint: To make P - Q as large as possible, choose the maximum possible P and the minimum possible Q!`;

    if (isMCQ) {
      const d1 = (pThousands - qThousands).toString();
      const d2 = (maxP - (qThousands + 499)).toString();
      const d3 = (maxDiff - 1).toString();
      const set = new Set([finalAnswer, d1, d2, d3]);
      let offset = 1000;
      while (set.size < 4) {
        set.add((maxDiff + offset).toString());
        offset += 1000;
      }
      options = Array.from(set).sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: "USED_ROUNDED_VALUES_DIRECTLY",
        [d2]: "CALCULATED_MINIMUM_INSTEAD_OF_MAXIMUM",
        [d3]: "OFF_BY_ONE"
      };
    }
  } else if (activeVariant === 'advanced_approx_inequality_heuristic') {
    const tth = Math.floor(Math.random() * 60 + 20);
    const thousandTarget = (tth + 1) * 1000;
    const hundredTarget = (tth * 1000) + 700;
    const isGreatest = Math.random() < 0.5;
    const ansNum = isGreatest ? hundredTarget + 49 : hundredTarget - 50;
    finalAnswer = ansNum.toString();
    acceptedAnswers = [
      finalAnswer,
      ansNum.toLocaleString(),
      ansNum.toLocaleString().replace(/,/g, ' ')
    ];

    const boundWord = isGreatest ? "greatest" : "smallest";
    promptInstruction = `- Question stem: EXACTLY "A 5-digit number N satisfies both of the following approximation statements:\\n- N ≈ ${thousandTarget.toLocaleString()} (rounded to the nearest thousand)\\n- N ≈ ${hundredTarget.toLocaleString()} (rounded to the nearest hundred)\\nWhat is the ${boundWord} possible value of N?"
- The finalAnswer must be strictly "${finalAnswer}".
- In the solutionSteps:
  * Step 1: For N to round to ${hundredTarget.toLocaleString()} (nearest hundred), N must be in [${(hundredTarget - 50).toLocaleString()}, ${(hundredTarget + 49).toLocaleString()}].
  * Step 2: For N to round to ${thousandTarget.toLocaleString()} (nearest thousand), N must be in [${(thousandTarget - 500).toLocaleString()}, ${(thousandTarget + 499).toLocaleString()}].
  * Step 3: The intersection range is [${(hundredTarget - 50).toLocaleString()}, ${(hundredTarget + 49).toLocaleString()}].
  * Step 4: The ${boundWord} possible value of N is ${finalAnswer}.
- In the hint: Write out the valid rounding ranges for both conditions and find the overlap!`;

    if (isMCQ) {
      const d1 = (isGreatest ? hundredTarget - 50 : hundredTarget + 49).toString();
      const d2 = (isGreatest ? thousandTarget + 499 : thousandTarget - 500).toString();
      const d3 = (ansNum + (isGreatest ? 1 : -1)).toString();
      options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: isGreatest ? "GAVE_SMALLEST_INSTEAD_OF_GREATEST" : "GAVE_GREATEST_INSTEAD_OF_SMALLEST",
        [d2]: "IGNORED_HUNDRED_CONSTRAINT",
        [d3]: "BOUNDARY_OFF_BY_ONE"
      };
    }
  } else {
    // advanced_estimation_sanity_check
    const name = getRandomNames(1)[0];
    const n1 = Math.floor(Math.random() * 20 + 20) * 1000 + Math.floor(Math.random() * 800 + 100);
    const n2 = Math.floor(Math.random() * 15 + 15) * 1000 + Math.floor(Math.random() * 800 + 100);
    const n3 = Math.floor(Math.random() * 10 + 10) * 1000 + Math.floor(Math.random() * 800 + 100);

    const r1 = Math.round(n1 / 1000) * 1000;
    const r2 = Math.round(n2 / 1000) * 1000;
    const r3 = Math.round(n3 / 1000) * 1000;
    const totalEst = r1 + r2 + r3;
    finalAnswer = totalEst.toString();
    acceptedAnswers = [
      finalAnswer,
      totalEst.toLocaleString(),
      totalEst.toLocaleString().replace(/,/g, ' ')
    ];

    promptInstruction = `- Question stem: EXACTLY "By rounding each number to the nearest thousand, find the estimated value of the sum:\\n${n1.toLocaleString()} + ${n2.toLocaleString()} + ${n3.toLocaleString()} ≈ ________"
- The finalAnswer must be strictly "${finalAnswer}".
- In the solutionSteps:
  * Step 1: Round each number to the nearest thousand:
    - ${n1.toLocaleString()} rounds to ${r1.toLocaleString()}.
    - ${n2.toLocaleString()} rounds to ${r2.toLocaleString()}.
    - ${n3.toLocaleString()} rounds to ${r3.toLocaleString()}.
  * Step 2: Add the rounded numbers: ${r1.toLocaleString()} + ${r2.toLocaleString()} + ${r3.toLocaleString()} = ${totalEst.toLocaleString()}.
  * Step 3: Conclude that the estimated sum is ${finalAnswer}.
- In the hint: Round each number to the nearest thousand first, then sum the three rounded numbers!`;

    if (isMCQ) {
      const d1 = (n1 + n2 + n3).toString();
      const d2 = (totalEst + 1000).toString();
      const d3 = (totalEst - 1000).toString();
      const set = new Set([finalAnswer, d1, d2, d3]);
      let offset = 2000;
      while (set.size < 4) {
        set.add((totalEst + offset).toString());
        offset += 1000;
      }
      options = Array.from(set).sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: "CALCULATED_EXACT_SUM_WITHOUT_ROUNDING",
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
Generate an advanced-level question for Singapore Primary 4 students.
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
