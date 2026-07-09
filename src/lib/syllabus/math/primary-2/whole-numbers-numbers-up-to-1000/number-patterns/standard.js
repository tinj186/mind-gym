export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, formatInstructions, context, selectedContextItem, getQText) {
  let aiPrompt = `You are an expert Primary 2 math generator.
Generate a question for the subtopic: Number Patterns.
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
- Use visualType: NUMBER_PATTERN. Provide a sequence of 5 numbers up to 1000.
- Exactly ONE item must be "?".
- Use jumps of +10, -10, +5, -5 that cross hundreds boundaries (e.g. 290, 300, 310).
- The finalAnswer must be the missing numeral.
- If MCQ, provide 4 options.

${formatInstructions}`;

  return {
    aiPrompt: aiPrompt
  };
}
