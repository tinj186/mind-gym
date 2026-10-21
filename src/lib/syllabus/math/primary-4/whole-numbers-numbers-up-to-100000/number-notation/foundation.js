function numberToWords(num) {
  if (num === 0) return 'zero';
  if (num === 100000) return 'one hundred thousand';

  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  function convertTwoDigits(n) {
    if (n < 20) return ones[n];
    const t = Math.floor(n / 10);
    const o = n % 10;
    return o > 0 ? tens[t] + '-' + ones[o] : tens[t];
  }

  let words = '';
  if (num >= 1000) {
    const th = Math.floor(num / 1000);
    words += convertTwoDigits(th) + ' thousand';
    num %= 1000;
    if (num > 0 && num < 100) {
      words += ' and ';
    } else if (num >= 100) {
      words += ', ';
    }
  }

  if (num >= 100) {
    const h = Math.floor(num / 100);
    words += ones[h] + ' hundred';
    num %= 100;
    if (num > 0) {
      words += ' and ';
    }
  }

  if (num > 0) {
    words += convertTwoDigits(num);
  }

  return words;
}

export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions) {
  let promptInstruction = "";
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let finalAnswer = "";
  let options = [];
  let defectMap = {};

  if (!activeVariant || activeVariant === 'foundation_default' || activeVariant === 'default') {
    const defaultVariants = [
      'foundation_to_words_exact_thousands',
      'foundation_to_words_thousands_hundreds',
      'foundation_to_words_zero_hundreds',
      'foundation_to_words_zero_tens_hundreds',
      'foundation_to_words_general'
    ];
    activeVariant = defaultVariants[Math.floor(Math.random() * defaultVariants.length)];
  }

  let num = 0;

  if (activeVariant === 'foundation_to_words_exact_thousands') {
    // Exact ten thousands e.g. 10 000, 20 000 ... 90 000, 100 000
    const tensList = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const pickedTens = tensList[Math.floor(Math.random() * tensList.length)];
    num = pickedTens * 1000;
    const words = numberToWords(num);
    const isWordsToNumeral = Math.random() < 0.5;

    // Format with MOE-style space (e.g. 40 000)
    const formattedNum = num === 100000 ? "100 000" : `${pickedTens} 000`;

    if (isWordsToNumeral) {
      // Direction: Words to Numeral (concise question)
      finalAnswer = num.toString();
      promptInstruction = `- Question stem: "Write ${words} in numerals."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isMCQ) {
        const teenMap = { 20: 12, 30: 13, 40: 14, 50: 15, 60: 16, 70: 17, 80: 18, 90: 19 };
        const teenVal = teenMap[pickedTens] ? teenMap[pickedTens] * 1000 : num + 10000;
        const d1 = (num / 10).toString(); // dropped zero
        const d2 = num < 100000 ? (num * 10).toString() : (num - 10000).toString(); // extra zero
        const d3 = teenVal.toString(); // teen vs ty confusion (e.g. 14 000 vs 40 000)

        const set = new Set([finalAnswer, d1, d2, d3]);
        while (set.size < 4) {
          set.add(((pickedTens + 10) * 1000).toString());
        }
        options = Array.from(set).sort(() => Math.random() - 0.5);
        defectMap = {
          [d1]: "DROPPED_PLACE_VALUE_ZERO",
          [d2]: "EXTRA_PLACE_VALUE_ZERO",
          [d3]: "CONFUSED_TEEN_WITH_TY"
        };
      }
    } else {
      // Direction: Numeral to Words (concise question)
      finalAnswer = words;
      promptInstruction = `- Question stem: "Write ${formattedNum} in words."\\n- The finalAnswer must be the words entirely lowercased exactly as follows: "${finalAnswer}".`;

      if (isMCQ) {
        const teenWordMap = {
          20: "twelve thousand",
          30: "thirteen thousand",
          40: "fourteen thousand",
          50: "fifteen thousand",
          60: "sixteen thousand",
          70: "seventeen thousand",
          80: "eighteen thousand",
          90: "nineteen thousand"
        };
        const d1 = num === 100000 ? "ten thousand" : numberToWords(num / 10);
        const d2 = num < 100000 ? `${numberToWords(pickedTens)} hundred` : "one million";
        const d3 = teenWordMap[pickedTens] || (num > 10000 ? numberToWords(num - 10000) : "twenty thousand");

        const set = new Set([finalAnswer, d1, d2, d3]);
        while (set.size < 4) {
          set.add(numberToWords(num + 10000));
        }
        options = Array.from(set).sort(() => Math.random() - 0.5);
        defectMap = {
          [d1]: "OFF_BY_PLACE_VALUE_MAGNITUDE",
          [d2]: "CONFUSED_HUNDRED_WITH_THOUSAND",
          [d3]: "CONFUSED_TEEN_WITH_TY"
        };
      }
    }
  } else {
    if (activeVariant === 'foundation_to_words_thousands_hundreds') {
      // 5-digit ending in 00 e.g. 35 400
      const th = Math.floor(Math.random() * 80) + 11;
      const h = Math.floor(Math.random() * 9) + 1;
      num = (th * 1000) + (h * 100);
    } else if (activeVariant === 'foundation_to_words_zero_hundreds') {
      // 5-digit with zero hundreds e.g. 42 035
      const th = Math.floor(Math.random() * 80) + 11;
      const t = Math.floor(Math.random() * 8) + 2;
      const o = Math.floor(Math.random() * 9) + 1;
      num = (th * 1000) + (t * 10) + o;
    } else if (activeVariant === 'foundation_to_words_zero_tens_hundreds') {
      // 5-digit with 00 in hundreds/tens e.g. 60 008 or 74 005
      const th = Math.floor(Math.random() * 80) + 11;
      const o = Math.floor(Math.random() * 9) + 1;
      num = (th * 1000) + o;
    } else {
      // General 5-digit number e.g. 58 327
      const th = Math.floor(Math.random() * 80) + 11;
      const h = Math.floor(Math.random() * 9) + 1;
      const t = Math.floor(Math.random() * 8) + 2;
      const o = Math.floor(Math.random() * 9) + 1;
      num = (th * 1000) + (h * 100) + (t * 10) + o;
    }

    finalAnswer = numberToWords(num);
    const thPart = Math.floor(num / 1000);
    const remPart = (num % 1000).toString().padStart(3, '0');
    const formattedNum = `${thPart} ${remPart}`;
    promptInstruction = `- Question stem: "Write ${formattedNum} in words."\\n- The finalAnswer must be the words entirely lowercased exactly as follows: "${finalAnswer}".`;

    if (isMCQ) {
      const d1 = numberToWords(num).replace(' and ', ' ');
      const d2 = numberToWords(num + 100);
      const d3 = numberToWords(num - 10 > 10000 ? num - 10 : num + 10);
      const set = new Set([finalAnswer, d1, d2, d3]);
      while (set.size < 4) {
        set.add(numberToWords(num + Math.floor(Math.random() * 20 - 10) * 1000));
      }
      options = Array.from(set).sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: "NOTATION_SYNTAX_ERROR",
        [d2]: "PLACE_VALUE_MISALIGNMENT"
      };
    }
  }

  const inputRequirementStr = isStructure ? `{\n    "inputType": "MULTI_STEP_INPUT"\n  }` : null;
  const mcqInstruction = isMCQ ? `- Generate EXACTLY 4 options: ${JSON.stringify(options)}.\\n- Set defectMap to: ${JSON.stringify(defectMap)}.` : "";

  const aiPrompt = `You are an expert Singapore Primary 4 Math educator.
Generate a foundation-level question for Singapore Primary 4 students.
Topic: Whole Numbers - Numbers up to 100 000
Subtopic: Number Notation
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
