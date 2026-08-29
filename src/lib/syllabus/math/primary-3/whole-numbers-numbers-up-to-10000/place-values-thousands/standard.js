export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let promptInstruction = "";

  if (activeVariant === 'standard_digit_value') {
    let th = Math.floor(Math.random() * 9) + 1;
    let h = Math.floor(Math.random() * 10);
    while (h === th) h = Math.floor(Math.random() * 10);
    let t = Math.floor(Math.random() * 10);
    while (t === th || t === h) t = Math.floor(Math.random() * 10);
    let o = Math.floor(Math.random() * 10);
    while (o === th || o === h || o === t) o = Math.floor(Math.random() * 10);
    const num = (th * 1000) + (h * 100) + (t * 10) + o;
    
    const places = [
      { name: 'thousands', val: th * 1000, dig: th },
      { name: 'hundreds', val: h * 100, dig: h },
      { name: 'tens', val: t * 10, dig: t },
      { name: 'ones', val: o, dig: o }
    ];
    const target = places[Math.floor(Math.random() * places.length)];
    promptInstruction = `- Create a question asking for the value of the digit ${target.dig} in the number ${num}.\\n- The finalAnswer must be just the numeral (which is ${target.val}).`;
  } else if (activeVariant === 'standard_digit_with_value') {
    let th = Math.floor(Math.random() * 9) + 1;
    let h = Math.floor(Math.random() * 10);
    while (h === th) h = Math.floor(Math.random() * 10);
    let t = Math.floor(Math.random() * 10);
    while (t === th || t === h) t = Math.floor(Math.random() * 10);
    let o = Math.floor(Math.random() * 10);
    while (o === th || o === h || o === t) o = Math.floor(Math.random() * 10);
    const num = (th * 1000) + (h * 100) + (t * 10) + o;
    
    const places = [
      { name: 'thousands', val: th * 1000, dig: th },
      { name: 'hundreds', val: h * 100, dig: h },
      { name: 'tens', val: t * 10, dig: t },
      { name: 'ones', val: o, dig: o }
    ];
    const target = places[Math.floor(Math.random() * places.length)];
    promptInstruction = `- Create a question asking which digit has a value of ${target.val} in the number ${num}.\\n- The finalAnswer must be just the single digit numeral (which is ${target.dig}).`;
  } else if (activeVariant === 'standard_expanded_form_missing') {
    const th = Math.floor(Math.random() * 9) + 1;
    const h = Math.floor(Math.random() * 9) + 1;
    const t = Math.floor(Math.random() * 9) + 1;
    const o = Math.floor(Math.random() * 9) + 1;
    const num = (th * 1000) + (h * 100) + (t * 10) + o;
    
    const parts = [
      { val: th * 1000 },
      { val: h * 100 },
      { val: t * 10 },
      { val: o }
    ];
    const missingIndex = Math.floor(Math.random() * 4);
    const missingValue = parts[missingIndex].val;
    const equationParts = parts.map((p, idx) => idx === missingIndex ? '___' : p.val);
    
    promptInstruction = `- Create a question asking to find the missing number in the expanded form equation: ${num} = ${equationParts.join(' + ')}.\\n- The finalAnswer must be just the missing numeral (${missingValue}).`;
  } else if (activeVariant === 'standard_greatest_value_digit') {
    const th = Math.floor(Math.random() * 4) + 1;
    let h = Math.floor(Math.random() * 4) + 5;
    const t = 9;
    const o = 9;
    const num = (th * 1000) + (h * 100) + (t * 10) + o;
    promptInstruction = `- Create a question asking which digit has the greatest value in the number ${num}.\\n- The finalAnswer must be just the single digit numeral (${th}).`;
  } else if (activeVariant === 'standard_mystery_number_values') {
    const th = Math.floor(Math.random() * 9) + 1;
    const h = Math.floor(Math.random() * 10);
    const t = Math.floor(Math.random() * 10);
    const o = Math.floor(Math.random() * 10);
    const num = (th * 1000) + (h * 100) + (t * 10) + o;
    
    const clues = [
      `my thousands digit is ${th}`,
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
    promptInstruction = `- Create a mystery number word problem using exactly these clues: I am a 4-digit number, ${clueString}. Ask what the number is.\\n- The finalAnswer must be just the 4-digit numeral.`;
  }

  let aiPrompt = `You are an expert Primary 3 math generator.
Generate a question for the subtopic: Place Values (Thousands).
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
