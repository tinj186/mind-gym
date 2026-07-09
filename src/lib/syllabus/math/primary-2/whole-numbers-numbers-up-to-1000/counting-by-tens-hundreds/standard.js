export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, formatInstructions, context, selectedContextItem, getQText) {
  let promptInstruction = "";

  if (activeVariant === 'standard_cross_boundary') {
    const hundreds = Math.floor(Math.random() * 8) + 1; // 1 to 8
    const ones = Math.floor(Math.random() * 10); // 0 to 9
    const baseNumber = (hundreds * 100) + ones;
    promptInstruction = `- Create a question asking to find 10 less than ${baseNumber}.\\n- Notice that subtracting 10 from ${baseNumber} crosses a hundreds boundary.`;
  } else if (activeVariant === 'standard_count_on_10_cross_boundary') {
    const hundreds = Math.floor(Math.random() * 8) + 1; // 1 to 8
    const tens = 9;
    const ones = Math.floor(Math.random() * 10); // 0 to 9
    const baseNumber = (hundreds * 100) + (tens * 10) + ones;
    promptInstruction = `- Create a question asking to find 10 more than ${baseNumber}.\\n- Notice that adding 10 to ${baseNumber} crosses a hundreds boundary.`;
  } else if (activeVariant === 'standard_count_on_multiple_10_cross') {
    const multiple = (Math.floor(Math.random() * 8) + 2) * 10; // 20 to 90
    const tensMultiple = multiple / 10;
    const hundreds = Math.floor(Math.random() * 7) + 1; // 1 to 7
    // Ensure that tens + tensMultiple >= 10 to cross boundary
    const minTens = 10 - tensMultiple;
    const tens = Math.floor(Math.random() * (9 - minTens + 1)) + minTens;
    const ones = Math.floor(Math.random() * 10);
    const baseNumber = (hundreds * 100) + (tens * 10) + ones;
    promptInstruction = `- Create a question asking to find ${multiple} more than ${baseNumber}.\\n- Notice that adding ${multiple} to ${baseNumber} crosses a hundreds boundary.`;
  } else if (activeVariant === 'standard_count_back_multiple_10_cross') {
    const multiple = (Math.floor(Math.random() * 8) + 2) * 10; // 20 to 90
    const tensMultiple = multiple / 10;
    const hundreds = Math.floor(Math.random() * 8) + 2; // 2 to 9
    // Ensure that tens - tensMultiple < 0 to cross boundary
    const maxTens = tensMultiple - 1;
    const tens = Math.floor(Math.random() * (maxTens + 1));
    const ones = Math.floor(Math.random() * 10);
    const baseNumber = (hundreds * 100) + (tens * 10) + ones;
    promptInstruction = `- Create a question asking to find ${multiple} less than ${baseNumber}.\\n- Notice that subtracting ${multiple} from ${baseNumber} crosses a hundreds boundary.`;
  } else if (activeVariant === 'standard_mixed_100_and_10') {
    const baseNumber = Math.floor(Math.random() * 600) + 200; // 200 to 799
    const isMore100 = Math.random() > 0.5;
    const isMore10 = Math.random() > 0.5;
    const mult100 = (Math.floor(Math.random() * 2) + 1) * 100; // 100 or 200
    const mult10 = (Math.floor(Math.random() * 3) + 1) * 10; // 10, 20, or 30
    
    const action1 = isMore100 ? `${mult100} more` : `${mult100} less`;
    const action2 = isMore10 ? `${mult10} more` : `${mult10} less`;
    promptInstruction = `- Create a question asking to find the number that is ${action1} and then ${action2} than ${baseNumber}.\\n- Do not break it into two separate questions. Frame it as a single question (e.g. "What is ${action1} and then ${action2} than ${baseNumber}?").`;
  }

  let aiPrompt = `You are an expert Primary 2 math generator.
Generate a question for the subtopic: Counting by Tens/Hundreds.
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
${promptInstruction}
- If MCQ, provide 4 options.
- The finalAnswer must be just the numeral.

${formatInstructions}`;

  return {
    aiPrompt: aiPrompt
  };
}
