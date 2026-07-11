export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
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

  let aiPrompt = `You are an expert Primary 2 math generator.
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
    const h = Math.floor(Math.random() * 9) + 1;
    const t = Math.floor(Math.random() * 10);
    const o = Math.floor(Math.random() * 10);
    const num = (h * 100) + (t * 10) + o;
    const words = numberToWords(num);
    // Scramble randomly (fixed backticks for Turbopack)
    const parts = [`${h} hundreds`, `${t} tens`, `${o} ones`].sort(() => Math.random() - 0.5);
    aiPrompt += `- Ask "Write ${parts[0]}, ${parts[1]}, and ${parts[2]} in words."
- The finalAnswer must be the words entirely lowercased exactly as follows: "${words}".
- If MCQ, provide 4 options, ensuring the correct option is exactly "${words}".`;
  } else if (activeVariant === 'advanced_mystery_number_to_words') {
    const h = Math.floor(Math.random() * 5) + 1; // 1 to 5
    const tAdd = Math.floor(Math.random() * 3) + 1;
    const t = h + tAdd; // max 5 + 3 = 8
    const oSub = Math.floor(Math.random() * 3) + 1;
    const o = t - oSub; // min 2 - 3 < 0? No, min h=1 + 1 = 2. 2 - 3 = -1! wait.
    // Let's make it simpler
    const tSafe = Math.floor(Math.random() * 6) + 3; // 3 to 8
    const hSafe = tSafe - (Math.floor(Math.random() * 2) + 1); // t - 1 or 2
    const oSafe = tSafe - (Math.floor(Math.random() * 2) + 1); // t - 1 or 2
    const hDiff = tSafe - hSafe;
    const oDiff = tSafe - oSafe;
    const num = (hSafe * 100) + (tSafe * 10) + oSafe;
    const words = numberToWords(num);
    aiPrompt += `- Ask a mystery number riddle: "I am a 3-digit number. I have ${hSafe} hundreds. My tens digit is ${hDiff} more than my hundreds digit. My ones digit is ${oDiff} less than my tens digit. What number am I? Write the number in words."
- The finalAnswer must be the words entirely lowercased exactly as follows: "${words}".
- If MCQ, provide 4 options, ensuring the correct option is exactly "${words}".`;
  } else if (activeVariant === 'advanced_largest_even_to_words') {
    // Need 3 distinct digits, at least one even.
    let digits = [];
    while (digits.length < 3) {
      const d = Math.floor(Math.random() * 9) + 1; // 1 to 9 (avoid 0 for simplicity)
      if (!digits.includes(d)) digits.push(d);
    }
    // Ensure at least one even
    if (!digits.some(d => d % 2 === 0)) {
      digits[0] = [2, 4, 6, 8][Math.floor(Math.random() * 4)];
    }
    // Find largest even
    const evens = digits.filter(d => d % 2 === 0).sort((a,b) => a-b);
    const lastDigit = evens[0]; // To make it largest, use the smallest available even digit at the end
    const remaining = [...digits];
    remaining.splice(remaining.indexOf(lastDigit), 1);
    remaining.sort((a,b) => b-a);
    const num = remaining[0] * 100 + remaining[1] * 10 + lastDigit;
    
    const words = numberToWords(num);
    aiPrompt += `- Ask "Form the largest 3-digit even number using the digits ${digits.join(', ')}. Write it in words."
- The finalAnswer must be the words entirely lowercased exactly as follows: "${words}".
- If MCQ, provide 4 options, ensuring the correct option is exactly "${words}".`;
  } else if (activeVariant === 'advanced_smallest_odd_to_words') {
    let digits = [];
    while (digits.length < 3) {
      const d = Math.floor(Math.random() * 9) + 1;
      if (!digits.includes(d)) digits.push(d);
    }
    // Ensure at least one odd
    if (!digits.some(d => d % 2 !== 0)) {
      digits[0] = [1, 3, 5, 7, 9][Math.floor(Math.random() * 5)];
    }
    // Find smallest odd
    const odds = digits.filter(d => d % 2 !== 0).sort((a,b) => b-a);
    const lastDigit = odds[0]; // To make it smallest, use largest available odd digit at the end
    const remaining = [...digits];
    remaining.splice(remaining.indexOf(lastDigit), 1);
    remaining.sort((a,b) => a-b);
    const num = remaining[0] * 100 + remaining[1] * 10 + lastDigit;
    
    const words = numberToWords(num);
    aiPrompt += `- Ask "Form the smallest 3-digit odd number using the digits ${digits.join(', ')}. Write it in words."
- The finalAnswer must be the words entirely lowercased exactly as follows: "${words}".
- If MCQ, provide 4 options, ensuring the correct option is exactly "${words}".`;
  } else if (activeVariant === 'advanced_largest_odd_to_words') {
    let digits = [];
    while (digits.length < 3) {
      const d = Math.floor(Math.random() * 9) + 1;
      if (!digits.includes(d)) digits.push(d);
    }
    // Ensure at least one odd
    if (!digits.some(d => d % 2 !== 0)) {
      digits[0] = [1, 3, 5, 7, 9][Math.floor(Math.random() * 5)];
    }
    // Find largest odd
    const odds = digits.filter(d => d % 2 !== 0).sort((a,b) => a-b);
    const lastDigit = odds[0]; // Smallest available odd digit at the end for largest number
    const remaining = [...digits];
    remaining.splice(remaining.indexOf(lastDigit), 1);
    remaining.sort((a,b) => b-a);
    const num = remaining[0] * 100 + remaining[1] * 10 + lastDigit;
    
    const words = numberToWords(num);
    aiPrompt += `- Ask "Form the largest 3-digit odd number using the digits ${digits.join(', ')}. Write it in words."
- The finalAnswer must be the words entirely lowercased exactly as follows: "${words}".
- If MCQ, provide 4 options, ensuring the correct option is exactly "${words}".`;
  }

  aiPrompt += `\n\n${getFormatInstructions()}`;

  return {
    aiPrompt: aiPrompt
  };
}
