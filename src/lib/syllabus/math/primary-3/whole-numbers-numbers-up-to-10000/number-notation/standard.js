export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  function numberToWords(num) {
    if (num === 0) return "zero";
    const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
    
    let words = "";
    if (num >= 1000) {
      words += ones[Math.floor(num / 1000)] + " thousand";
      num %= 1000;
      if (num > 0 && num < 100) words += " and ";
      else if (num > 0) words += " ";
    }
    
    if (num >= 100) {
      words += ones[Math.floor(num / 100)] + " hundred";
      num %= 100;
      if (num > 0) words += " and ";
    }
    
    if (num > 0) {
      if (num < 20) {
        words += ones[num];
      } else {
        words += tens[Math.floor(num / 10)];
        if (num % 10 > 0) {
          words += "-" + ones[num % 10];
        }
      }
    }
    return words;
  }

  let num = 0;

  if (activeVariant === 'standard_to_numeral_hundreds') {
    // 3-digit number
    num = Math.floor(Math.random() * 900) + 100;
  } else if (activeVariant === 'standard_to_numeral_thousands') {
    // Exact thousands
    num = (Math.floor(Math.random() * 9) + 1) * 1000;
  } else if (activeVariant === 'standard_to_numeral_thousands_hundreds') {
    // 4-digit ending in 0
    const th = Math.floor(Math.random() * 9) + 1;
    const h = Math.floor(Math.random() * 10);
    const t = Math.floor(Math.random() * 9) + 1;
    num = (th * 1000) + (h * 100) + (t * 10);
  } else if (activeVariant === 'standard_to_numeral_thousands_tens') {
    // 4-digit with 0 hundreds
    const th = Math.floor(Math.random() * 9) + 1;
    const t = Math.floor(Math.random() * 9) + 1;
    const o = Math.floor(Math.random() * 10);
    num = (th * 1000) + (t * 10) + o;
  } else {
    // General 4-digit number
    const th = Math.floor(Math.random() * 9) + 1;
    const h = Math.floor(Math.random() * 10);
    const t = Math.floor(Math.random() * 10);
    const o = Math.floor(Math.random() * 10);
    num = (th * 1000) + (h * 100) + (t * 10) + o;
  }

  const numWords = numberToWords(num);

  let aiPrompt = `You are an expert Primary 3 math generator.
Generate a question for the subtopic: Number Notation.
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
- Ask "Write ${numWords} in numerals."
- The finalAnswer must be the numeral exactly as follows: "${num}".
- If MCQ, provide 4 numeral options, ensuring the correct option is exactly "${num}".

${getFormatInstructions()}`;

  return {
    aiPrompt: aiPrompt
  };
}
