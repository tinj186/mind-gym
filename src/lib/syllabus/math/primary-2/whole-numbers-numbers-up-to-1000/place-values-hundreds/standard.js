export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let promptInstruction = "";

  if (activeVariant === 'standard_digit_value') {
    // Generate distinct digits to avoid ambiguity
    let h = Math.floor(Math.random() * 9) + 1;
    let t = Math.floor(Math.random() * 10);
    while (t === h) t = Math.floor(Math.random() * 10);
    let o = Math.floor(Math.random() * 10);
    while (o === h || o === t) o = Math.floor(Math.random() * 10);
    const num = (h * 100) + (t * 10) + o;
    
    const digits = [h, t, o];
    const targetDigit = digits[Math.floor(Math.random() * digits.length)];
    promptInstruction = `- Create a question asking to identify the value of the digit ${targetDigit} in the number ${num}.\\n- The finalAnswer must be just the numeral.`;
  } else if (activeVariant === 'standard_digit_with_value') {
    let h = Math.floor(Math.random() * 9) + 1;
    let t = Math.floor(Math.random() * 10);
    while (t === h) t = Math.floor(Math.random() * 10);
    let o = Math.floor(Math.random() * 10);
    while (o === h || o === t) o = Math.floor(Math.random() * 10);
    const num = (h * 100) + (t * 10) + o;
    
    const values = [h * 100, t * 10, o];
    const targetValue = values[Math.floor(Math.random() * values.length)];
    promptInstruction = `- Create a question asking which digit in the number ${num} has the value of ${targetValue}.\\n- The finalAnswer must be just the single digit numeral.`;
  } else if (activeVariant === 'standard_expanded_form_missing') {
    const h = Math.floor(Math.random() * 9) + 1;
    const t = Math.floor(Math.random() * 9) + 1;
    const o = Math.floor(Math.random() * 9) + 1;
    const num = (h * 100) + (t * 10) + o;
    const parts = [h * 100, t * 10, o];
    const missingIndex = Math.floor(Math.random() * 3);
    const missingValue = parts[missingIndex];
    parts[missingIndex] = '___';
    
    promptInstruction = `- Create a question asking to find the missing number in the expanded form equation: ${num} = ${parts[0]} + ${parts[1]} + ${parts[2]}.\\n- The finalAnswer must be just the missing numeral (${missingValue}).`;
  } else if (activeVariant === 'standard_greatest_value_digit') {
    // Force hundreds digit to be smaller than tens/ones to test conceptual understanding
    const h = Math.floor(Math.random() * 4) + 1; // 1 to 4
    const t = Math.floor(Math.random() * 4) + 5; // 5 to 8
    const o = 9;
    const num = (h * 100) + (t * 10) + o;
    promptInstruction = `- Create a question asking which digit has the greatest value in the number ${num}.\\n- The finalAnswer must be just the single digit numeral (${h}).`;
  } else if (activeVariant === 'standard_mystery_number_values') {
    const h = Math.floor(Math.random() * 9) + 1;
    const t = Math.floor(Math.random() * 10);
    const o = Math.floor(Math.random() * 10);
    const num = (h * 100) + (t * 10) + o;
    
    const clues = [
      `my hundreds digit is ${h}`,
      `my tens digit is ${t}`,
      `my ones digit is ${o}`
    ];
    // Shuffle clues
    for (let i = clues.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [clues[i], clues[j]] = [clues[j], clues[i]];
    }
    const clueString = clues.join(', ');
    promptInstruction = `- Create a mystery number word problem using exactly these clues: I am a 3-digit number, ${clueString}. Ask what the number is.\\n- The finalAnswer must be just the 3-digit numeral.`;
  }

  let aiPrompt = `You are an expert Primary 2 math generator.
Generate a question for the subtopic: Place Values (Hundreds).
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
${promptInstruction}
- If MCQ, provide 4 options.

${getFormatInstructions()}`;

  return {
    aiPrompt: aiPrompt
  };
}
