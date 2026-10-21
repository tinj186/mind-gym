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

export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions) {
  let promptInstruction = "";
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let finalAnswer = "";
  let options = [];
  let defectMap = {};

  if (!activeVariant || activeVariant === 'standard_default' || activeVariant === 'default') {
    const defaultVariants = [
      'standard_to_numeral_exact_thousands',
      'standard_to_numeral_zero_hundreds',
      'standard_to_numeral_zero_tens_hundreds',
      'standard_to_numeral_general',
      'standard_to_numeral_with_thousands_group'
    ];
    activeVariant = defaultVariants[Math.floor(Math.random() * defaultVariants.length)];
  }

  let num = 0;
  let d1 = 0;
  let d2 = 0;
  let d3 = 0;

  if (activeVariant === 'standard_to_numeral_exact_thousands') {
    const tth = (Math.floor(Math.random() * 8) + 2) * 10;
    num = tth * 1000;
    d1 = num / 10;
    d2 = num * 10 > 100000 ? num - 10000 : num * 10;
    d3 = num + 1000;
  } else if (activeVariant === 'standard_to_numeral_zero_hundreds') {
    const th = Math.floor(Math.random() * 80) + 11;
    const t = Math.floor(Math.random() * 8) + 2;
    const o = Math.floor(Math.random() * 9) + 1;
    num = (th * 1000) + (t * 10) + o;
    // Classic place value trap: writing hundreds digit as non-zero or omitting 0
    d1 = (th * 100) + (t * 10) + o; // omitted 0
    d2 = (th * 1000) + (t * 100) + o; // shifted tens to hundreds
    d3 = num + 100;
  } else if (activeVariant === 'standard_to_numeral_zero_tens_hundreds') {
    const th = Math.floor(Math.random() * 80) + 11;
    const o = Math.floor(Math.random() * 9) + 1;
    num = (th * 1000) + o;
    // Classic trap: 80 005 written as 8005 or 8050
    d1 = (th * 100) + o;
    d2 = (th * 1000) + (o * 10);
    d3 = (th * 10000) + o;
  } else if (activeVariant === 'standard_to_numeral_with_thousands_group') {
    const th = Math.floor(Math.random() * 80) + 11;
    const h = Math.floor(Math.random() * 9) + 1;
    num = (th * 1000) + (h * 100);
    d1 = (th * 100) + h;
    d2 = num + 10;
    d3 = (th * 1000) + h;
  } else {
    // General 5-digit number
    const th = Math.floor(Math.random() * 80) + 11;
    const h = Math.floor(Math.random() * 9) + 1;
    const t = Math.floor(Math.random() * 8) + 2;
    const o = Math.floor(Math.random() * 9) + 1;
    num = (th * 1000) + (h * 100) + (t * 10) + o;
    d1 = num - 100;
    d2 = num + 10;
    d3 = (th * 1000) + (h * 100) + (o * 10) + t; // swapped tens and ones
  }

  const numWords = numberToWords(num);
  finalAnswer = num.toString();

  promptInstruction = `- Question stem: "Write ${numWords} in numerals."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

  if (isMCQ) {
    const set = new Set([finalAnswer, d1.toString(), d2.toString(), d3.toString()]);
    while (set.size < 4) {
      set.add((num + Math.floor(Math.random() * 20 - 10) * 10).toString());
    }
    options = Array.from(set).sort(() => Math.random() - 0.5);
    defectMap = {
      [d1.toString()]: "PLACE_VALUE_ZERO_OMISSION",
      [d2.toString()]: "PLACE_VALUE_MISALIGNMENT"
    };
  }

  const inputRequirementStr = isStructure ? `{\n    "inputType": "MULTI_STEP_INPUT"\n  }` : null;
  const mcqInstruction = isMCQ ? `- Generate EXACTLY 4 options: ${JSON.stringify(options)}.\\n- Set defectMap to: ${JSON.stringify(defectMap)}.` : "";

  const aiPrompt = `You are an expert Singapore Primary 4 Math educator.
Generate a standard-level question for Singapore Primary 4 students.
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
