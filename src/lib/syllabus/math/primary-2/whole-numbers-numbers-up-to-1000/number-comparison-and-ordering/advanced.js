export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, formatInstructions, context, selectedContextItem, getQText) {
  let aiPrompt = `You are an expert Primary 2 math generator.
Generate a question for the subtopic: Number Comparison and Ordering.
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
- Use visualType: NUMBER_CARDS. Provide exactly 3 single digits (0-9).
- Ask "Form the greatest 3-digit number using the cards." or "Form the smallest 3-digit number using the cards.".
- Note: The smallest 3-digit number cannot start with 0.
- The finalAnswer must be the numeral.
- If MCQ, provide 4 options.

${formatInstructions}`;

  return {
    aiPrompt: aiPrompt
  };
}
