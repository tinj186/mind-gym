export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, formatInstructions, context, selectedContextItem, getQText) {
  let aiPrompt = `You are an expert Primary 2 math generator.
Generate a question for the subtopic: Odd and Even Numbers.
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
- Ask "What is the next [odd/even] number after [Number]?" or "What is the greatest [odd/even] number formed by these 3 digits?".
- The finalAnswer must be the numeral.
- If MCQ, provide 4 options.

${formatInstructions}`;

  return {
    aiPrompt: aiPrompt
  };
}
