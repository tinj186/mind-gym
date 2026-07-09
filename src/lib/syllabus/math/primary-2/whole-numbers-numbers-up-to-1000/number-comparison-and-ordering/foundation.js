export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, formatInstructions, context, selectedContextItem, getQText) {
  let aiPrompt = `You are an expert Primary 2 math generator.
Generate a question for the subtopic: Number Comparison and Ordering.
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
- Use visualType: NUMBER_CARDS. Provide exactly 2 numbers between 100 and 1000.
- Ask "Which number is greater?" or "Which number is smaller?".
- The finalAnswer must be just the numeral.
- If MCQ, provide 4 options including both numbers and 2 distractors.

${formatInstructions}`;

  return {
    aiPrompt: aiPrompt
  };
}
