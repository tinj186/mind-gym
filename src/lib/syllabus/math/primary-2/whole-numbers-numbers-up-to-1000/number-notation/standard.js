export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, formatInstructions, context, selectedContextItem, getQText) {
  let aiPrompt = `You are an expert Primary 2 math generator.
Generate a question for the subtopic: Number Notation.
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
- Ask "Write [Words] in numerals." (e.g. "five hundred and forty-three").
- The finalAnswer must be the numeral (e.g., "543").
- If MCQ, provide 4 numeral options.

${formatInstructions}`;

  return {
    aiPrompt: aiPrompt
  };
}
