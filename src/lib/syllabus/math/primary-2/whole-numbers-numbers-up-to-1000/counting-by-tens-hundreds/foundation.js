export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, formatInstructions, context, selectedContextItem, getQText) {
  let promptInstruction = "";

  if (activeVariant === 'foundation_count_on_10') {
    const baseNumber = Math.floor(Math.random() * 800) + 100;
    promptInstruction = `- Create a question asking to find 10 more than ${baseNumber}.\\n- Do not cross hundreds boundaries for 10s.`;
  } else if (activeVariant === 'foundation_count_on_100') {
    const baseNumber = Math.floor(Math.random() * 800) + 100;
    promptInstruction = `- Create a question asking to find 100 more than ${baseNumber}.`;
  } else if (activeVariant === 'foundation_count_back_10') {
    // Generate base number ensuring it does not drop hundreds boundary (e.g., ends in 10-99)
    const hundreds = Math.floor(Math.random() * 8) + 1; // 1 to 8
    const ones = Math.floor(Math.random() * 90) + 10; // 10 to 99
    const baseNumber = (hundreds * 100) + ones;
    promptInstruction = `- Create a question asking to find 10 less than ${baseNumber}.\\n- Do not cross hundreds boundaries for 10s.`;
  } else if (activeVariant === 'foundation_count_back_100') {
    const baseNumber = Math.floor(Math.random() * 799) + 200; // 200 to 999
    promptInstruction = `- Create a question asking to find 100 less than ${baseNumber}.`;
  } else if (activeVariant === 'foundation_count_multiple_10_100') {
    const isHundreds = Math.random() > 0.5;
    const multiplier = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const multipleAmount = isHundreds ? multiplier * 100 : multiplier * 10;
    
    let baseNumber;
    if (isHundreds) {
      // e.g. multiplier=3 (adding 300). hundreds can be 1 to (9-3) = 6
      const maxHundreds = 9 - multiplier;
      const hundreds = Math.floor(Math.random() * maxHundreds) + 1;
      baseNumber = (hundreds * 100) + Math.floor(Math.random() * 100);
    } else {
      // e.g. multiplier=4 (adding 40). tens can be 0 to (9-4) = 5
      const hundreds = Math.floor(Math.random() * 8) + 1;
      const maxTens = 9 - multiplier;
      const tens = Math.floor(Math.random() * (maxTens + 1));
      baseNumber = (hundreds * 100) + (tens * 10) + Math.floor(Math.random() * 10);
    }
    promptInstruction = `- Create a question asking to find ${multipleAmount} more than ${baseNumber}.\\n- Do not cross hundreds boundaries.`;
  }

  let aiPrompt = `You are an expert Primary 2 math generator.
Generate a question for the subtopic: Counting by Tens/Hundreds.
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
