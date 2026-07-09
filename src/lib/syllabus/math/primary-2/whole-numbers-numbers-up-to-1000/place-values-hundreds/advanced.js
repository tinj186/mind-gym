export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let aiPrompt = `You are an expert Primary 2 math generator.
Generate a question for the subtopic: Place Values (Hundreds).
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
- Create a question asking to decompose a 3-digit number into hundreds, tens, and ones.
- If MCQ, provide 4 options.
- The finalAnswer must be just the numeral.

${getFormatInstructions()}`;

  return {
    aiPrompt: aiPrompt
  };
}
