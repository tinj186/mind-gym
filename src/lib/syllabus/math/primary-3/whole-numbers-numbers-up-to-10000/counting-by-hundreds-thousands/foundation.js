export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, formatInstructions, context, selectedContextItem, getQText) {
  let promptInstruction = "";

  // Helper to get non-zero tens and ones (e.g. 1-9) so the number is not a "neat" multiple
  const getTensOnes = () => (Math.floor(Math.random() * 9) + 1) * 10 + (Math.floor(Math.random() * 9) + 1);

  if (activeVariant === 'foundation_count_on_100') {
    const multiplier = Math.floor(Math.random() * 9) + 1; // 1 to 9
    const amount = multiplier * 100;
    const thousands = Math.floor(Math.random() * 8) + 1; // 1 to 8
    const maxHundreds = 9 - multiplier;
    const hundreds = Math.floor(Math.random() * (maxHundreds + 1));
    const baseNumber = (thousands * 1000) + (hundreds * 100) + getTensOnes();
    promptInstruction = `- Create a question asking to find ${amount} more than ${baseNumber}.\\n- Do not cross thousands boundaries for 100s.\\n- The tens and ones digits must remain static.`;
  } else if (activeVariant === 'foundation_count_on_1000') {
    const multiplier = Math.floor(Math.random() * 8) + 1; // 1 to 8
    const amount = multiplier * 1000;
    const maxThousands = 9 - multiplier;
    const thousands = Math.floor(Math.random() * maxThousands) + 1; // 1 to maxThousands
    const hundreds = Math.floor(Math.random() * 10);
    const baseNumber = (thousands * 1000) + (hundreds * 100) + getTensOnes();
    promptInstruction = `- Create a question asking to find ${amount} more than ${baseNumber}.\\n- The hundreds, tens, and ones digits must remain static.`;
  } else if (activeVariant === 'foundation_count_back_100') {
    const multiplier = Math.floor(Math.random() * 9) + 1; // 1 to 9
    const amount = multiplier * 100;
    const thousands = Math.floor(Math.random() * 8) + 1; // 1 to 8
    const minHundreds = multiplier;
    const hundreds = Math.floor(Math.random() * (9 - minHundreds + 1)) + minHundreds; // minHundreds to 9
    const baseNumber = (thousands * 1000) + (hundreds * 100) + getTensOnes();
    promptInstruction = `- Create a question asking to find ${amount} less than ${baseNumber}.\\n- Do not cross thousands boundaries for 100s.\\n- The tens and ones digits must remain static.`;
  } else if (activeVariant === 'foundation_count_back_1000') {
    const multiplier = Math.floor(Math.random() * 8) + 1; // 1 to 8
    const amount = multiplier * 1000;
    const minThousands = multiplier + 1; // +1 ensures we don't drop to 0 thousands
    const thousands = Math.floor(Math.random() * (9 - minThousands + 1)) + minThousands;
    const hundreds = Math.floor(Math.random() * 10);
    const baseNumber = (thousands * 1000) + (hundreds * 100) + getTensOnes();
    promptInstruction = `- Create a question asking to find ${amount} less than ${baseNumber}.\\n- The hundreds, tens, and ones digits must remain static.`;
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
