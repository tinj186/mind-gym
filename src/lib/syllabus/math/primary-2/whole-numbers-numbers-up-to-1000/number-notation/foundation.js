export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, formatInstructions, context, selectedContextItem, getQText) {
  let aiPrompt = `You are an expert Primary 2 math generator.
Generate a question for the subtopic: Number Notation.
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
- Ask "Write [Numeral] in words." (e.g. 543).
- The finalAnswer must be the words entirely lowercased (e.g., "five hundred and forty-three").
- If MCQ, provide 4 options of spelled out words.

${formatInstructions}`;

  return {
    aiPrompt: aiPrompt
  };
}
