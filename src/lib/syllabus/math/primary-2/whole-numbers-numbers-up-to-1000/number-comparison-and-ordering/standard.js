export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let numbers = [];
  let askType = "";
  
  if (activeVariant === "standard_order_asc_diff_hundreds" || activeVariant === "standard_order_desc_diff_hundreds") {
    askType = activeVariant.includes("asc") ? "smallest" : "greatest";
    let hundreds = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5).slice(0, 4);
    for (let i = 0; i < 4; i++) {
      let t = Math.floor(Math.random() * 10);
      let o = Math.floor(Math.random() * 10);
      numbers.push(hundreds[i] * 100 + t * 10 + o);
    }
  } else if (activeVariant === "standard_order_asc_same_hundreds" || activeVariant === "standard_order_desc_same_hundreds") {
    askType = activeVariant.includes("asc") ? "smallest" : "greatest";
    let h = Math.floor(Math.random() * 9) + 1;
    let tens = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5).slice(0, 4);
    for (let i = 0; i < 4; i++) {
      let o = Math.floor(Math.random() * 10);
      numbers.push(h * 100 + tens[i] * 10 + o);
    }
  } else if (activeVariant === "standard_order_mixed_digits") {
    askType = Math.random() < 0.5 ? "smallest" : "greatest";
    // Generate 2 two-digit numbers and 2 three-digit numbers, ensuring they are distinct
    while (numbers.length < 2) {
      let n = Math.floor(Math.random() * 90) + 10;
      if (!numbers.includes(n)) numbers.push(n);
    }
    while (numbers.length < 4) {
      let n = Math.floor(Math.random() * 900) + 100;
      if (!numbers.includes(n)) numbers.push(n);
    }
  }

  // Sort logically for the correct final answer
  const sortedNumbers = [...numbers].sort((a, b) => askType === "smallest" ? a - b : b - a);
  const finalAnswer = sortedNumbers.join(", ");

  // Shuffle for presentation
  const presentedNumbers = [...numbers].sort(() => Math.random() - 0.5);

  const visualEngineStr = `{
    "componentToRender": "NUMBER_CARDS",
    "componentData": {
      "items": ["${presentedNumbers[0]}", "${presentedNumbers[1]}", "${presentedNumbers[2]}", "${presentedNumbers[3]}"]
    }
  }`;

  let aiPrompt = `You are an expert Primary 2 math generator.
Generate a question for the subtopic: Number Comparison and Ordering.
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
- Use visualType: NUMBER_CARDS. The numbers provided are ${presentedNumbers.join(", ")}.
- Ask "Arrange the numbers in order. Begin with the ${askType}."
- The finalAnswer must be the 4 numbers sorted correctly exactly as follows: "${finalAnswer}".
- If MCQ, provide 4 options including the correct order and 3 reasonable distractor sequences, ensuring the correct option is exactly "${finalAnswer}".
- CRITICAL: In the output JSON, you MUST copy the "visualEngine" object EXACTLY as shown in the output format. DO NOT CHANGE IT.

${getFormatInstructions(visualEngineStr)}`;

  return {
    aiPrompt: aiPrompt
  };
}
