export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, formatInstructions, context, selectedContextItem, getQText) {
  let aiPrompt = `You are an expert Primary 2 math generator.
Generate a question for the subtopic: Odd and Even Numbers.
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
- Provide a number up to 1000. Ask "Is [Number] an odd or even number?".
- The finalAnswer must be "odd" or "even".
- If MCQ, provide 2 options: "Odd" and "Even".

${formatInstructions}`;

  return {
    aiPrompt: aiPrompt
  };
}
