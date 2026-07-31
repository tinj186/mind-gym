export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, formatInstructions, context, selectedContextItem, getQText) {
  let promptInstruction = "";

  // Helper to ensure tens/ones aren't uniformly 00
  const getTensOnes = () => (Math.floor(Math.random() * 9) + 1) * 10 + (Math.floor(Math.random() * 9) + 1);

  if (activeVariant === 'standard_count_on_multiple_100_cross') {
    const multiple = (Math.floor(Math.random() * 9) + 1) * 100; // 100 to 900
    const hundredsMultiple = multiple / 100;
    const thousands = Math.floor(Math.random() * 7) + 1; // 1 to 7
    // Ensure that hundreds + hundredsMultiple >= 10 to cross boundary
    const minHundreds = 10 - hundredsMultiple;
    const hundreds = Math.floor(Math.random() * (9 - minHundreds + 1)) + minHundreds;
    const baseNumber = (thousands * 1000) + (hundreds * 100) + getTensOnes();
    promptInstruction = `- Create a question asking to find ${multiple} more than ${baseNumber}.\\n- Notice that adding ${multiple} to ${baseNumber} crosses a thousands boundary.`;
  } else if (activeVariant === 'standard_count_back_multiple_100_cross') {
    const multiple = (Math.floor(Math.random() * 9) + 1) * 100; // 100 to 900
    const hundredsMultiple = multiple / 100;
    const thousands = Math.floor(Math.random() * 8) + 2; // 2 to 9
    // Ensure that hundreds - hundredsMultiple < 0 to cross boundary
    const maxHundreds = hundredsMultiple - 1;
    const hundreds = Math.floor(Math.random() * (maxHundreds + 1));
    const baseNumber = (thousands * 1000) + (hundreds * 100) + getTensOnes();
    promptInstruction = `- Create a question asking to find ${multiple} less than ${baseNumber}.\\n- Notice that subtracting ${multiple} from ${baseNumber} crosses a thousands boundary.`;
  } else if (activeVariant === 'standard_mixed_1000_and_100') {
    const baseNumber = Math.floor(Math.random() * 6000) + 2000; // 2000 to 7999
    const isMore1000 = Math.random() > 0.5;
    const isMore100 = Math.random() > 0.5;
    const mult1000 = (Math.floor(Math.random() * 8) + 1) * 1000; // 1000 to 8000 (if addition doesn't exceed 10k)
    // To be safe with boundaries:
    const safeMult1000 = (Math.floor(Math.random() * 2) + 1) * 1000; // 1000 or 2000
    const mult100 = (Math.floor(Math.random() * 8) + 1) * 100; // 100 to 800
    
    const action1 = isMore1000 ? `add ${safeMult1000}` : `subtract ${safeMult1000}`;
    const action2 = isMore100 ? `add ${mult100}` : `subtract ${mult100}`;
    promptInstruction = `- Create a question asking to perform a two-step sequence on ${baseNumber}.\\n- The mathematical operation must be: first ${action1}, and then ${action2}.\\n- If this is a word problem, integrate the math operations naturally into the story. Ensure you end the story by actually asking the final question (e.g. "How many does she have in total?"), but DO NOT append a repetitive raw calculation sentence at the end (e.g. do not say "If you add X and subtract Y...").`;
  }

  let aiPrompt = `You are an expert Primary 3 math generator.
Generate a question for the subtopic: Counting by Hundreds/Thousands.
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
${promptInstruction}
- If MCQ, provide 4 options.
- The finalAnswer must be just the numeral.

${formatInstructions}`;

  return {
    aiPrompt: aiPrompt
  };
}
