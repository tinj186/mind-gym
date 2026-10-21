import { getRandomNames } from '../../../../../utils/variable-bank.js';

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

export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions) {
  let promptInstruction = "";
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let finalAnswer = "";
  let options = [];
  let defectMap = {};
  const names = getRandomNames(2);

  if (!activeVariant || activeVariant === 'advanced_default' || activeVariant === 'default') {
    const defaultVariants = [
      'advanced_identify_spelling_error',
      'advanced_mixed_place_values_to_words',
      'advanced_mystery_number_to_words',
      'advanced_forming_numbers_to_words',
      'advanced_numeral_to_words_with_condition'
    ];
    activeVariant = defaultVariants[Math.floor(Math.random() * defaultVariants.length)];
  }

  if (activeVariant === 'advanced_identify_spelling_error') {
    // Spot the incorrectly written number in words
    const commonErrors = [
      { correct: "forty thousand", wrong: "fourty thousand" },
      { correct: "fifteen thousand", wrong: "fiveteen thousand" },
      { correct: "twelve thousand", wrong: "twelth thousand" },
      { correct: "eighty thousand", wrong: "eightty thousand" },
      { correct: "ninety thousand", wrong: "ninty thousand" }
    ];
    const picked = commonErrors[Math.floor(Math.random() * commonErrors.length)];
    finalAnswer = picked.wrong;

    promptInstruction = `- Question stem: "Which of the following numbers is written INCORRECTLY in words?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

    const otherCorrect = commonErrors.filter(e => e.wrong !== picked.wrong).slice(0, 3).map(e => e.correct);
    options = [finalAnswer, ...otherCorrect].sort(() => Math.random() - 0.5);
    defectMap = {
      [otherCorrect[0]]: "NOTATION_SYNTAX_ERROR",
      [otherCorrect[1]]: "NOTATION_SYNTAX_ERROR"
    };
  } else if (activeVariant === 'advanced_mixed_place_values_to_words') {
    const tth = Math.floor(Math.random() * 5) + 3; // 3 to 7
    const extraH = Math.floor(Math.random() * 15) + 12; // 12 to 26
    const o = Math.floor(Math.random() * 9) + 1;
    const finalNum = (tth * 10000) + (extraH * 100) + o;
    finalAnswer = numberToWords(finalNum);

    promptInstruction = `- Question stem: "What is ${tth} ten thousands, ${extraH} hundreds, and ${o} ones written in words?"\\n- The finalAnswer must be the words entirely lowercased exactly as follows: "${finalAnswer}".`;

    if (isMCQ) {
      const d1 = numberToWords((tth * 10000) + (extraH * 10) + o);
      const d2 = numberToWords(finalNum + 1000);
      const d3 = numberToWords(finalNum - 100);
      options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: "PLACE_VALUE_MISALIGNMENT"
      };
    }
  } else if (activeVariant === 'advanced_mystery_number_to_words') {
    const tth = Math.floor(Math.random() * 3) + 4; // 4 to 6
    const diff = Math.floor(Math.random() * 2) + 2; // 2 or 3
    const th = tth + diff; // 6 to 9
    const t = Math.floor(Math.random() * 7) + 2;
    const o = Math.floor(Math.random() * 8) + 1;
    const finalNum = (tth * 10000) + (th * 1000) + (t * 10) + o; // zero hundreds
    finalAnswer = numberToWords(finalNum);

    promptInstruction = `- Question stem: "${names[0]} is thinking of a 5-digit number. Use the clues below to identify the number:\\n1. The ten thousands digit is ${tth}.\\n2. The thousands digit is ${diff} more than the ten thousands digit.\\n3. The hundreds digit is 0.\\n4. The tens digit is ${t}.\\n5. The ones digit is ${o}.\\nWhat is the number? Write your answer in words."\\n- The finalAnswer must be the words entirely lowercased exactly as follows: "${finalAnswer}".`;

    if (isMCQ) {
      const d1 = numberToWords((th * 10000) + (tth * 1000) + (t * 10) + o);
      const d2 = numberToWords(finalNum + 100);
      const d3 = numberToWords(finalNum - 10);
      options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: "PLACE_VALUE_MISALIGNMENT"
      };
    }
  } else if (activeVariant === 'advanced_forming_numbers_to_words') {
    // Form the greatest 5-digit odd number
    const odds = [1, 3, 5, 7, 9].sort(() => Math.random() - 0.5).slice(0, 2);
    const evens = [2, 4, 6, 8].sort(() => Math.random() - 0.5).slice(0, 3);
    const pool = [...odds, ...evens].sort(() => Math.random() - 0.5);

    // To maximize odd number: pick smallest odd for ones place, sort rest descending
    const smallestOdd = Math.min(...odds);
    const remaining = pool.filter((_, idx) => idx !== pool.indexOf(smallestOdd)).sort((a, b) => b - a);
    const finalNum = remaining.reduce((acc, d) => acc * 10 + d, 0) * 10 + smallestOdd;
    finalAnswer = numberToWords(finalNum);

    promptInstruction = `- Question stem: "Use all the digits ${pool.join(', ')} to form the greatest 5-digit odd number. Write the number in words."\\n- The finalAnswer must be the words entirely lowercased exactly as follows: "${finalAnswer}".`;

    if (isMCQ) {
      // Greatest even
      const smallestEven = Math.min(...evens);
      const remEven = pool.filter((_, idx) => idx !== pool.indexOf(smallestEven)).sort((a, b) => b - a);
      const evenNum = remEven.reduce((acc, d) => acc * 10 + d, 0) * 10 + smallestEven;
      const d1 = numberToWords(evenNum);
      const d2 = numberToWords(finalNum - 10);
      const d3 = numberToWords(finalNum + 100);
      options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: "OPPOSITE_CONDITION_EVEN"
      };
    }
  } else {
    // advanced_numeral_to_words_with_condition
    const base = (Math.floor(Math.random() * 50) + 30) * 1000 + (Math.floor(Math.random() * 8) + 1) * 100;
    const addVal = (Math.floor(Math.random() * 5) + 2) * 100; // e.g. 300 to 600
    const finalNum = base + addVal;
    finalAnswer = numberToWords(finalNum);

    promptInstruction = `- Question stem: "What number is ${addVal} more than ${base}? Write your answer in words."\\n- The finalAnswer must be the words entirely lowercased exactly as follows: "${finalAnswer}".`;

    if (isMCQ) {
      const d1 = numberToWords(base - addVal);
      const d2 = numberToWords(finalNum + 1000);
      const d3 = numberToWords(finalNum - 10);
      options = [finalAnswer, d1, d2, d3].sort(() => Math.random() - 0.5);
      defectMap = {
        [d1]: "WRONG_OPERATION",
        [d2]: "CARELESS_CALCULATION"
      };
    }
  }

  const inputRequirementStr = isStructure ? `{\n    "inputType": "MULTI_STEP_INPUT"\n  }` : null;
  const mcqInstruction = isMCQ ? `- Generate EXACTLY 4 options: ${JSON.stringify(options)}.\\n- Set defectMap to: ${JSON.stringify(defectMap)}.` : "";

  const aiPrompt = `You are an expert Singapore Primary 4 Math educator.
Generate an advanced-level question for Singapore Primary 4 students.
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
