export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, formatInstructions, context, selectedContextItem, getQText) {
  let aiPrompt = `You are an expert Primary 2 math generator.
Generate a question for the subtopic: Number Notation.
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
- For MCQ ONLY: Ask "Which of the following numbers is written incorrectly in words?"
- Provide 4 options, where 3 are correct and 1 is incorrect.
- The finalAnswer must be the incorrect option exactly as written.
- For Short Question: Ask "Write [Number with tricky zero, e.g., 504] in words."

${formatInstructions}`;

  return {
    aiPrompt: aiPrompt
  };
}
