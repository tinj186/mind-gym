export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
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

  let aiPrompt = `You are an expert Primary 3 math generator.
Generate a question for the subtopic: Number Notation.
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:\n`;

  if (activeVariant === 'advanced_identify_error') {
    aiPrompt += `- For MCQ ONLY: Ask "Which of the following numbers is written incorrectly in words?"
- Provide 4 options, where 3 are correct number spellings and 1 is completely incorrect (e.g., using "fourty" instead of "forty").
- The finalAnswer must be the incorrect option exactly as written.
- For Short Question: Ask "Write 504 in words." (as a fallback)`;
  } else if (activeVariant === 'advanced_mixed_place_values_to_words') {
    const th = Math.floor(Math.random() * 9) + 1;
    const h = Math.floor(Math.random() * 10);
    const t = Math.floor(Math.random() * 10);
    const o = Math.floor(Math.random() * 10);
    const num = (th * 1000) + (h * 100) + (t * 10) + o;
    const words = numberToWords(num);
    const parts = [`${th} thousands`, `${h} hundreds`, `${t} tens`, `${o} ones`].sort(() => Math.random() - 0.5);
    aiPrompt += `- Ask "Write ${parts[0]}, ${parts[1]}, ${parts[2]}, and ${parts[3]} in words."
- The finalAnswer must be the words entirely lowercased exactly as follows: "${words}".
- If MCQ, provide 4 options, ensuring the correct option is exactly "${words}".`;
  } else if (activeVariant === 'advanced_mystery_number_to_words') {
    const thSafe = Math.floor(Math.random() * 5) + 3; // 3 to 7
    const hSafe = thSafe - (Math.floor(Math.random() * 2) + 1);
    const tSafe = thSafe + 1;
    const oSafe = tSafe - (Math.floor(Math.random() * 2) + 1);
    const hDiff = thSafe - hSafe;
    const tDiff = tSafe - hSafe;
    const oDiff = tSafe - oSafe;
    const num = (thSafe * 1000) + (hSafe * 100) + (tSafe * 10) + oSafe;
    const words = numberToWords(num);
    aiPrompt += `- Ask a mystery number riddle: "I am a 4-digit number. I have ${thSafe} thousands. My hundreds digit is ${hDiff} less than my thousands digit. My tens digit is ${tDiff} more than my hundreds digit. My ones digit is ${oDiff} less than my tens digit. What number am I? Write the number in words."
- The finalAnswer must be the words entirely lowercased exactly as follows: "${words}".
- If MCQ, provide 4 options, ensuring the correct option is exactly "${words}".`;
  } else if (activeVariant === 'advanced_largest_even_to_words') {
    let digits = [];
    while (digits.length < 4) {
      const d = Math.floor(Math.random() * 9) + 1;
      if (!digits.includes(d)) digits.push(d);
    }
    if (!digits.some(d => d % 2 === 0)) {
      digits[0] = [2, 4, 6, 8][Math.floor(Math.random() * 4)];
    }
    const evens = digits.filter(d => d % 2 === 0).sort((a,b) => a-b);
    const lastDigit = evens[0];
    const remaining = [...digits];
    remaining.splice(remaining.indexOf(lastDigit), 1);
    remaining.sort((a,b) => b-a);
    const num = remaining[0] * 1000 + remaining[1] * 100 + remaining[2] * 10 + lastDigit;
    
    const words = numberToWords(num);
    aiPrompt += `- Ask "Form the largest 4-digit even number using the digits ${digits.join(', ')}. Write it in words."
- The finalAnswer must be the words entirely lowercased exactly as follows: "${words}".
- If MCQ, provide 4 options, ensuring the correct option is exactly "${words}".`;
  } else if (activeVariant === 'advanced_smallest_odd_to_words') {
    let digits = [];
    while (digits.length < 4) {
      const d = Math.floor(Math.random() * 9) + 1;
      if (!digits.includes(d)) digits.push(d);
    }
    if (!digits.some(d => d % 2 !== 0)) {
      digits[0] = [1, 3, 5, 7, 9][Math.floor(Math.random() * 5)];
    }
    const odds = digits.filter(d => d % 2 !== 0).sort((a,b) => b-a);
    const lastDigit = odds[0];
    const remaining = [...digits];
    remaining.splice(remaining.indexOf(lastDigit), 1);
    remaining.sort((a,b) => a-b);
    const num = remaining[0] * 1000 + remaining[1] * 100 + remaining[2] * 10 + lastDigit;
    
    const words = numberToWords(num);
    aiPrompt += `- Ask "Form the smallest 4-digit odd number using the digits ${digits.join(', ')}. Write it in words."
- The finalAnswer must be the words entirely lowercased exactly as follows: "${words}".
- If MCQ, provide 4 options, ensuring the correct option is exactly "${words}".`;
  } else if (activeVariant === 'advanced_largest_odd_to_words') {
    let digits = [];
    while (digits.length < 4) {
      const d = Math.floor(Math.random() * 9) + 1;
      if (!digits.includes(d)) digits.push(d);
    }
    if (!digits.some(d => d % 2 !== 0)) {
      digits[0] = [1, 3, 5, 7, 9][Math.floor(Math.random() * 5)];
    }
    const odds = digits.filter(d => d % 2 !== 0).sort((a,b) => a-b);
    const lastDigit = odds[0];
    const remaining = [...digits];
    remaining.splice(remaining.indexOf(lastDigit), 1);
    remaining.sort((a,b) => b-a);
    const num = remaining[0] * 1000 + remaining[1] * 100 + remaining[2] * 10 + lastDigit;
    
    const words = numberToWords(num);
    aiPrompt += `- Ask "Form the largest 4-digit odd number using the digits ${digits.join(', ')}. Write it in words."
- The finalAnswer must be the words entirely lowercased exactly as follows: "${words}".
- If MCQ, provide 4 options, ensuring the correct option is exactly "${words}".`;
  }

  aiPrompt += `\n\n${getFormatInstructions()}`;

  return {
    aiPrompt: aiPrompt
  };
}
