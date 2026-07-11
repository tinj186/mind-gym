export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let isOdd = true;
  let digits = 2;

  if (activeVariant === "foundation_random_odd_even") {
    const options = [
      "foundation_identify_odd_2_digit",
      "foundation_identify_even_2_digit",
      "foundation_identify_odd_3_digit",
      "foundation_identify_even_3_digit"
    ];
    activeVariant = options[Math.floor(Math.random() * options.length)];
  }

  if (activeVariant === "foundation_identify_odd_2_digit") {
    isOdd = true;
    digits = 2;
  } else if (activeVariant === "foundation_identify_even_2_digit") {
    isOdd = false;
    digits = 2;
  } else if (activeVariant === "foundation_identify_odd_3_digit") {
    isOdd = true;
    digits = 3;
  } else if (activeVariant === "foundation_identify_even_3_digit") {
    isOdd = false;
    digits = 3;
  }

  let finalNumber = 0;
  if (digits === 2) {
    let tens = Math.floor(Math.random() * 9) + 1; // 1-9
    let onesList = isOdd ? [1, 3, 5, 7, 9] : [0, 2, 4, 6, 8];
    let ones = onesList[Math.floor(Math.random() * onesList.length)];
    finalNumber = tens * 10 + ones;
  } else {
    let hundreds = Math.floor(Math.random() * 9) + 1; // 1-9
    let tens = Math.floor(Math.random() * 10); // 0-9
    let onesList = isOdd ? [1, 3, 5, 7, 9] : [0, 2, 4, 6, 8];
    let ones = onesList[Math.floor(Math.random() * onesList.length)];
    finalNumber = hundreds * 100 + tens * 10 + ones;
  }

  const finalAnswer = isOdd ? "Odd" : "Even";
  const askText = `Is ${finalNumber} an odd or even number?`;
  
  let aiPrompt = `You are an expert Primary 2 math generator.
Generate a question for the subtopic: Odd and Even Numbers.
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
- Use visualType: NONE.
- The question MUST revolve around the number: ${finalNumber}.
- The question stem must clearly ask "${askText}".
- The finalAnswer must be EXACTLY: "${finalAnswer}".
- If MCQ, provide exactly 2 options: ["Odd", "Even"].

${getFormatInstructions()}`;

  return {
    aiPrompt: aiPrompt
  };
}
