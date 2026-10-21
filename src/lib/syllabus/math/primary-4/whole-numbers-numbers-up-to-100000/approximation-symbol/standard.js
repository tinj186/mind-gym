import { getRandomNames } from '../../../../../utils/variable-bank.js';

export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions) {
  let promptInstruction = "";
  let finalAnswer = "";
  let options = [];
  let defectMap = {};
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
    // Tests a number like 49 998 ≈ 50 000 where it rounds to 50 000 to nearest 10, 100, and 1000!
    const prefix = Math.floor(Math.random() * 8) + 1; // 1 to 8
    const num = (prefix * 10000) + 9996; // e.g. 39 996
    const rounded = (prefix + 1) * 10000; // 40 000
    finalAnswer = "nearest ten, nearest hundred, and nearest thousand";

    promptInstruction = `- Question stem: "Consider the approximation statement: ${num.toLocaleString()} ≈ ${rounded.toLocaleString()}. To which place value(s) can ${num.toLocaleString()} be rounded to produce this result?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    if (isMCQ) {
      const d1 = "only nearest ten";
      const d2 = "only nearest hundred";
      const d3 = "only nearest thousand";
      options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: "FAILED_TO_RECOGNIZE_MULTIPLE_ROUNDING_CASES",
        [d2]: "FAILED_TO_RECOGNIZE_MULTIPLE_ROUNDING_CASES",
        [d3]: "FAILED_TO_RECOGNIZE_MULTIPLE_ROUNDING_CASES"
      };
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

  const inputRequirementStr = isStructure ? `{\n    "inputType": "MULTI_STEP_INPUT"\n  }` : null;
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
