export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let num1 = 0;
  let num2 = 0;
  let askType = "";
  
  if (activeVariant === 'foundation_compare_greater_thousands') {
    const th1 = Math.floor(Math.random() * 9) + 1;
    let th2 = Math.floor(Math.random() * 9) + 1;
    while (th2 === th1) th2 = Math.floor(Math.random() * 9) + 1;
    num1 = th1 * 1000 + Math.floor(Math.random() * 1000);
    num2 = th2 * 1000 + Math.floor(Math.random() * 1000);
    askType = "greater";
  } else if (activeVariant === 'foundation_compare_smaller_thousands') {
    const th1 = Math.floor(Math.random() * 9) + 1;
    let th2 = Math.floor(Math.random() * 9) + 1;
    while (th2 === th1) th2 = Math.floor(Math.random() * 9) + 1;
    num1 = th1 * 1000 + Math.floor(Math.random() * 1000);
    num2 = th2 * 1000 + Math.floor(Math.random() * 1000);
    askType = "smaller";
  } else if (activeVariant === 'foundation_compare_greater_hundreds') {
    const th = Math.floor(Math.random() * 9) + 1;
    const h1 = Math.floor(Math.random() * 10);
    let h2 = Math.floor(Math.random() * 10);
    while (h2 === h1) h2 = Math.floor(Math.random() * 10);
    num1 = th * 1000 + h1 * 100 + Math.floor(Math.random() * 100);
    num2 = th * 1000 + h2 * 100 + Math.floor(Math.random() * 100);
    askType = "greater";
  } else if (activeVariant === 'foundation_compare_smaller_hundreds') {
    const th = Math.floor(Math.random() * 9) + 1;
    const h1 = Math.floor(Math.random() * 10);
    let h2 = Math.floor(Math.random() * 10);
    while (h2 === h1) h2 = Math.floor(Math.random() * 10);
    num1 = th * 1000 + h1 * 100 + Math.floor(Math.random() * 100);
    num2 = th * 1000 + h2 * 100 + Math.floor(Math.random() * 100);
    askType = "smaller";
  } else if (activeVariant === 'foundation_compare_tens') {
    const th = Math.floor(Math.random() * 9) + 1;
    const h = Math.floor(Math.random() * 10);
    const t1 = Math.floor(Math.random() * 10);
    let t2 = Math.floor(Math.random() * 10);
    while (t2 === t1) t2 = Math.floor(Math.random() * 10);
    num1 = th * 1000 + h * 100 + t1 * 10 + Math.floor(Math.random() * 10);
    num2 = th * 1000 + h * 100 + t2 * 10 + Math.floor(Math.random() * 10);
    askType = Math.random() < 0.5 ? "greater" : "smaller";
  } else {
    // default
    num1 = Math.floor(Math.random() * 9000) + 1000;
    num2 = Math.floor(Math.random() * 9000) + 1000;
    while(num2 === num1) {
       num2 = Math.floor(Math.random() * 9000) + 1000;
    }
    askType = Math.random() < 0.5 ? "greater" : "smaller";
  }

  // Randomize the order the numbers are presented to the AI and visual engine
  const numbers = Math.random() < 0.5 ? [num1, num2] : [num2, num1];
  const finalNum = askType === "greater" ? Math.max(num1, num2) : Math.min(num1, num2);

  const visualEngineStr = `{
    "componentToRender": "NUMBER_CARDS",
    "componentData": {
      "items": ["${numbers[0]}", "${numbers[1]}"]
    }
  }`;

  let aiPrompt = `You are an expert Primary 3 math generator.
Generate a question for the subtopic: Number Comparison and Ordering.
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
- Use visualType: NUMBER_CARDS. The numbers provided are ${numbers[0]} and ${numbers[1]}.
- Ask "Which number is ${askType}?"
- The finalAnswer must be exactly: "${finalNum}".
- If MCQ, provide 4 options including both numbers and 2 reasonable distractors, ensuring the correct option is exactly "${finalNum}".
- CRITICAL: In the output JSON, you MUST copy the "visualEngine" object EXACTLY as shown in the output format. DO NOT CHANGE IT.

${getFormatInstructions(visualEngineStr)}`;

  return {
    aiPrompt: aiPrompt
  };
}
