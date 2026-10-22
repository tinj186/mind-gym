import { getRandomNames } from '../../../../../utils/variable-bank.js';

export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions) {
  let promptInstruction = "";
  let finalAnswer = "";
  let options = [];
  let defectMap = {};
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
    // Tests strict Singapore MOE convention: A + B ≈ Round(A) + Round(B) = Total
    const a = 24820;
    const b = 18190;
    const ra = 25000;
    const rb = 18000;
    const sum = 43000;

    finalAnswer = `${a.toLocaleString()} + ${b.toLocaleString()} ≈ ${ra.toLocaleString()} + ${rb.toLocaleString()} = ${sum.toLocaleString()}`;
    const d1 = `${a.toLocaleString()} + ${b.toLocaleString()} = ${ra.toLocaleString()} + ${rb.toLocaleString()} = ${sum.toLocaleString()}`;
    const d2 = `${a.toLocaleString()} + ${b.toLocaleString()} ≈ ${ra.toLocaleString()} + ${rb.toLocaleString()} ≈ ${sum.toLocaleString()}`;
    const d3 = `${a.toLocaleString()} + ${b.toLocaleString()} = ${sum.toLocaleString()}`;

    promptInstruction = `- Question stem: "Which of the following mathematical sentences is written strictly correctly using the symbols '=' and '≈'?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: "USED_EQUAL_FOR_ROUNDED_TERMS",
        [d2]: "USED_APPROX_FOR_EXACT_ADDITION",
        [d3]: "EQUATED_UNROUNDED_SUM_TO_ROUNDED_RESULT"
      };
    }
  } else if (activeVariant === 'advanced_dual_statement_validity') {
    // Statement 1: 54 499 ≈ 54 000 (to nearest thousand) -> True
    // Statement 2: 54 499 ≈ 54 500 (to nearest hundred) -> True
    const tth = Math.floor(Math.random() * 40 + 20) * 1000; // e.g. 30 000
    const num = tth + 499; // e.g. 30 499
    const s1Correct = true; // num to nearest 1000 is tth
    const s2Correct = true; // num to nearest 100 is tth + 500

    finalAnswer = "Both Statement 1 and Statement 2 are true";
    const d1 = "Only Statement 1 is true";
    const d2 = "Only Statement 2 is true";
    const d3 = "Neither Statement is true";

    promptInstruction = `- Question stem: "Consider the two statements about the number ${num.toLocaleString()}:\\nStatement 1: ${num.toLocaleString()} ≈ ${tth.toLocaleString()} (rounded to the nearest thousand)\\nStatement 2: ${num.toLocaleString()} ≈ ${(tth + 500).toLocaleString()} (rounded to the nearest hundred)\\nWhich statement(s) are mathematically true?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: "MISUNDERSTOOD_HUNDRED_ROUNDING",
        [d2]: "MISUNDERSTOOD_THOUSAND_ROUNDING",
        [d3]: "MISUNDERSTOOD_BOTH_ROUNDING_RULES"
      };
    }
  } else if (activeVariant === 'advanced_range_of_approx_expression') {
    // "If P ≈ 40 000 and Q ≈ 25 000 (both rounded to nearest thousand), what is the greatest possible value of P - Q?"
    const pThousands = Math.floor(Math.random() * 30 + 40) * 1000; // 40 000 to 69 000
    const qThousands = Math.floor(Math.random() * 15 + 10) * 1000; // 10 000 to 24 000
    const maxP = pThousands + 499;
    const minQ = qThousands - 500;
    const maxDiff = maxP - minQ;
    finalAnswer = maxDiff.toString();

    promptInstruction = `- Question stem: "If P ≈ ${pThousands.toLocaleString()} and Q ≈ ${qThousands.toLocaleString()} (where both numbers are rounded to the nearest thousand), what is the greatest possible value of P - Q?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const d1 = (pThousands - qThousands).toString(); // simple difference of rounded values
      const d2 = (maxP - (qThousands + 499)).toString(); // minimum difference
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
    // "A 5-digit number N satisfies: N ≈ 70 000 (nearest thousand) and N ≈ 69 700 (nearest hundred). What is the greatest (or smallest) possible value of N?"
    const tth = Math.floor(Math.random() * 60 + 20); // 20 to 79
    const thousandTarget = (tth + 1) * 1000; // e.g. 70 000
    const hundredTarget = (tth * 1000) + 700; // e.g. 69 700
    // Nearest hundred: [hundredTarget - 50, hundredTarget + 49] -> [69 650, 69 749]
    // Nearest thousand: [thousandTarget - 500, thousandTarget + 499] -> [69 500, 70 499]
    // Intersection: [hundredTarget - 50, hundredTarget + 49]
    const isGreatest = Math.random() < 0.5;
    const ansNum = isGreatest ? hundredTarget + 49 : hundredTarget - 50;
    finalAnswer = ansNum.toString();

    const boundWord = isGreatest ? "greatest" : "smallest";
    promptInstruction = `- Question stem: "A 5-digit number N satisfies both of the following approximation statements:\\n- N ≈ ${thousandTarget.toLocaleString()} (rounded to the nearest thousand)\\n- N ≈ ${hundredTarget.toLocaleString()} (rounded to the nearest hundred)\\nWhat is the ${boundWord} possible value of N?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

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

    promptInstruction = `- Question stem: "By rounding each number to the nearest thousand, find the estimated value of the sum:\\n${n1.toLocaleString()} + ${n2.toLocaleString()} + ${n3.toLocaleString()} ≈ ________"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const d1 = (n1 + n2 + n3).toString(); // exact without rounding
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

  const inputRequirementStr = isStructure ? `{\n    "inputType": "MULTI_STEP_INPUT"\n  }` : null;
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
