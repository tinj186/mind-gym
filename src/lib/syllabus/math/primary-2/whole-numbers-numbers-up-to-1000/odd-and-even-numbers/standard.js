export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, formatInstructions, context, selectedContextItem, getQText) {
  let aiPrompt = `You are an expert Primary 2 math generator.
Generate a question for the subtopic: Odd and Even Numbers.
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
- Only applicable for MCQ. Ask "Which of the following is an [odd/even] number?".
- Provide 4 options where only one is correct (e.g. 1 odd and 3 even).
- The finalAnswer must be the correct numeral.

${formatInstructions}`;

  return {
    aiPrompt: aiPrompt
  };
}
