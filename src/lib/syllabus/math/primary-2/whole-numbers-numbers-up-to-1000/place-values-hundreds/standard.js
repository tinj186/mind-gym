export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let aiPrompt = `You are an expert Primary 2 math generator.
Generate a question for the subtopic: Place Values (Hundreds).
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
- Create a question asking to identify the value of a specific digit in a 3-digit number.
- E.g. "What is the value of the digit 4 in 345?". Answer is 40.
- If MCQ, provide 4 options.
- The finalAnswer must be just the numeral.

${getFormatInstructions()}`;

  return {
    aiPrompt: aiPrompt
  };
}
