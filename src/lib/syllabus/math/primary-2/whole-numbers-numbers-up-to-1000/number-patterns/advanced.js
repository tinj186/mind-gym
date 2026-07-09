export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, formatInstructions, context, selectedContextItem, getQText) {
  let aiPrompt = `You are an expert Primary 2 math generator.
Generate a question for the subtopic: Number Patterns.
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
- Use visualType: NUMBER_PATTERN. Provide a sequence of 6 numbers up to 1000.
- Exactly ONE item must be "?".
- Use an alternating pattern (e.g., +10 then -2) OR double jumps (+20).
- The finalAnswer must be the missing numeral.
- If MCQ, provide 4 options.

${formatInstructions}`;

  return {
    aiPrompt: aiPrompt
  };
}
