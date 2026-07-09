export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, formatInstructions, context, selectedContextItem, getQText) {
  let aiPrompt = `You are an expert Primary 2 math generator.
Generate a question for the subtopic: Number Comparison and Ordering.
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
- Use visualType: NUMBER_CARDS. Provide exactly 4 numbers between 100 and 1000.
- Ask "Arrange the numbers in order. Begin with the smallest." or "Begin with the greatest.".
- The finalAnswer must be the 4 numbers sorted correctly, separated by commas and a space (e.g., "345, 412, 599, 802").
- If MCQ, provide 4 order sequences as options.

${formatInstructions}`;

  return {
    aiPrompt: aiPrompt
  };
}
