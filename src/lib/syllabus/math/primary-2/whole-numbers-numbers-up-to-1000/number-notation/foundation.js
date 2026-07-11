export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  function numberToWords(num) {
    if (num === 0) return "zero";
    const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
    
    let words = "";
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

  if (activeVariant === 'foundation_to_words_tens') {
    // 2-digit number (10 to 99)
    num = Math.floor(Math.random() * 90) + 10;
  } else if (activeVariant === 'foundation_to_words_hundreds') {
    // Exact hundreds (100, 200... 900)
    num = (Math.floor(Math.random() * 9) + 1) * 100;
  } else if (activeVariant === 'foundation_to_words_hundreds_tens') {
    // 3-digit ending in 0 (e.g. 230)
    const h = Math.floor(Math.random() * 9) + 1;
    const t = Math.floor(Math.random() * 9) + 1;
    num = (h * 100) + (t * 10);
  } else if (activeVariant === 'foundation_to_words_hundreds_ones') {
    // 3-digit with 0 tens (e.g. 407)
    const h = Math.floor(Math.random() * 9) + 1;
    const o = Math.floor(Math.random() * 9) + 1;
    num = (h * 100) + o;
  } else {
    // General 3-digit number (e.g. 543)
    const h = Math.floor(Math.random() * 9) + 1;
    const t = Math.floor(Math.random() * 9) + 1;
    const o = Math.floor(Math.random() * 9) + 1;
    num = (h * 100) + (t * 10) + o;
  }

  const finalAnswerWords = numberToWords(num);

  let aiPrompt = `You are an expert Primary 2 math generator.
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
