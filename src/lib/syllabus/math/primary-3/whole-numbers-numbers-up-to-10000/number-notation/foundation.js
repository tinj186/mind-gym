export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  function numberToWords(num) {
    if (num === 0) return "zero";
    const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
    
    let words = "";
    if (num >= 1000) {
      words += ones[Math.floor(num / 1000)] + " thousand";
      num %= 1000;
      if (num > 0 && num < 100) words += " and "; // e.g. one thousand and five
      else if (num > 0) words += " "; // e.g. one thousand five hundred
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

  if (activeVariant === 'foundation_to_words_hundreds') {
    // 3-digit number (100 to 999)
    num = Math.floor(Math.random() * 900) + 100;
  } else if (activeVariant === 'foundation_to_words_thousands') {
    // Exact thousands (1000, 2000... 9000)
    num = (Math.floor(Math.random() * 9) + 1) * 1000;
  } else if (activeVariant === 'foundation_to_words_thousands_hundreds') {
    // 4-digit ending in 0 (e.g. 2340)
    const th = Math.floor(Math.random() * 9) + 1;
    const h = Math.floor(Math.random() * 10);
    const t = Math.floor(Math.random() * 9) + 1;
    num = (th * 1000) + (h * 100) + (t * 10);
  } else if (activeVariant === 'foundation_to_words_thousands_tens') {
    // 4-digit with 0 hundreds (e.g. 4070 or 4015)
    const th = Math.floor(Math.random() * 9) + 1;
    const t = Math.floor(Math.random() * 9) + 1;
    const o = Math.floor(Math.random() * 10);
    num = (th * 1000) + (t * 10) + o;
  } else {
    // General 4-digit number (e.g. 5432)
    const th = Math.floor(Math.random() * 9) + 1;
    const h = Math.floor(Math.random() * 10);
    const t = Math.floor(Math.random() * 10);
    const o = Math.floor(Math.random() * 10);
    num = (th * 1000) + (h * 100) + (t * 10) + o;
  }

  const finalAnswerWords = numberToWords(num);

  let aiPrompt = `You are an expert Primary 3 math generator.
Generate a question for the subtopic: Number Notation.
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
- Ask "Write ${num} in words."
- The finalAnswer must be the words entirely lowercased exactly as follows: "${finalAnswerWords}".
- If MCQ, provide 4 options of spelled out words, ensuring the correct option is exactly "${finalAnswerWords}".

${getFormatInstructions()}`;

  return {
    aiPrompt: aiPrompt
  };
}
