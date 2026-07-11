export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let targetType = "odd";
  let digits = 2;
  
  if (activeVariant === "standard_random_select_odd_even") {
    const options = [
      "standard_select_odd_from_2_digits",
      "standard_select_even_from_2_digits",
      "standard_select_odd_from_3_digits",
      "standard_select_even_from_3_digits"
    ];
    activeVariant = options[Math.floor(Math.random() * options.length)];
  }

  if (activeVariant === "standard_select_odd_from_2_digits") {
    targetType = "odd";
    digits = 2;
  } else if (activeVariant === "standard_select_even_from_2_digits") {
    targetType = "even";
    digits = 2;
  } else if (activeVariant === "standard_select_odd_from_3_digits") {
    targetType = "odd";
    digits = 3;
  } else if (activeVariant === "standard_select_even_from_3_digits") {
    targetType = "even";
    digits = 3;
  }

  const generateNumber = (isOdd, digitsLen) => {
    let onesList = isOdd ? [1, 3, 5, 7, 9] : [0, 2, 4, 6, 8];
    let ones = onesList[Math.floor(Math.random() * onesList.length)];
    if (digitsLen === 2) {
      let tens = Math.floor(Math.random() * 9) + 1; // 1-9
      return tens * 10 + ones;
    } else {
      let hundreds = Math.floor(Math.random() * 9) + 1; // 1-9
      let tens = Math.floor(Math.random() * 10); // 0-9
      return hundreds * 100 + tens * 10 + ones;
    }
  };

  let isTargetOdd = targetType === "odd";
  let correctNum = generateNumber(isTargetOdd, digits);
  
  let wrongNum1 = generateNumber(!isTargetOdd, digits);
  let wrongNum2 = generateNumber(!isTargetOdd, digits);
  let wrongNum3 = generateNumber(!isTargetOdd, digits);
  
  while (wrongNum2 === wrongNum1) {
    wrongNum2 = generateNumber(!isTargetOdd, digits);
  }
  while (wrongNum3 === wrongNum1 || wrongNum3 === wrongNum2) {
    wrongNum3 = generateNumber(!isTargetOdd, digits);
  }

  let shuffledOptions = [correctNum, wrongNum1, wrongNum2, wrongNum3].sort(() => Math.random() - 0.5);

  const visualEngineStr = `{
    "componentToRender": "NUMBER_CARDS",
    "componentData": {
      "items": ["${shuffledOptions[0]}", "${shuffledOptions[1]}", "${shuffledOptions[2]}", "${shuffledOptions[3]}"]
    }
  }`;

  const finalAnswer = correctNum.toString();
  const askText = `Which of the following is an ${targetType} number?`;

  let aiPrompt = `You are an expert Primary 2 math generator.
Generate a question for the subtopic: Odd and Even Numbers.
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
- Use visualType: NUMBER_CARDS. The numbers provided are: ${shuffledOptions.join(", ")}.
- The question stem must clearly ask "${askText}".
- The finalAnswer must be EXACTLY: "${finalAnswer}".
- If MCQ, provide exactly 4 options using these exact numbers in any scrambled order.
- CRITICAL: In the output JSON, you MUST copy the "visualEngine" object EXACTLY as shown in the output format. DO NOT CHANGE IT.

${getFormatInstructions(visualEngineStr)}`;

  return {
    aiPrompt: aiPrompt
  };
}
