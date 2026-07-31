export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let step = 0;
  let missingIndex = Math.floor(Math.random() * 5); // 0 to 4
  let start = 0;
  let askText = "Find the missing number in the number pattern.";
  
  if (activeVariant === "foundation_random_10_or_100") {
    const options = ["foundation_add_10", "foundation_subtract_10", "foundation_add_100", "foundation_subtract_100"];
    activeVariant = options[Math.floor(Math.random() * options.length)];
  }

  if (activeVariant === "foundation_add_10") {
    step = 10;
    // ensure no hundreds boundary crossed: max ones/tens is 59 (so +40 is 99)
    let th = Math.floor(Math.random() * 9) + 1; // 1 to 9
    let h = Math.floor(Math.random() * 10);
    let t = Math.floor(Math.random() * 6); // 0 to 5
    let o = Math.floor(Math.random() * 10); // 0 to 9
    start = th * 1000 + h * 100 + t * 10 + o;
  } else if (activeVariant === "foundation_subtract_10") {
    step = -10;
    let th = Math.floor(Math.random() * 9) + 1;
    let h = Math.floor(Math.random() * 10);
    let t = Math.floor(Math.random() * 6) + 4; // 4 to 9 (so -40 stays >= 0)
    let o = Math.floor(Math.random() * 10);
    start = th * 1000 + h * 100 + t * 10 + o;
  } else if (activeVariant === "foundation_add_100") {
    step = 100;
    let th = Math.floor(Math.random() * 9) + 1;
    let h = Math.floor(Math.random() * 5); // 0 to 4 (so +400 <= 900)
    let t = Math.floor(Math.random() * 10);
    let o = Math.floor(Math.random() * 10);
    start = th * 1000 + h * 100 + t * 10 + o;
  } else if (activeVariant === "foundation_subtract_100") {
    step = -100;
    let th = Math.floor(Math.random() * 9) + 1;
    let h = Math.floor(Math.random() * 5) + 5; // 5 to 9 (so -400 >= 100)
    let t = Math.floor(Math.random() * 10);
    let o = Math.floor(Math.random() * 10);
    start = th * 1000 + h * 100 + t * 10 + o;
  }

  let pattern = [];
  for (let i = 0; i < 5; i++) {
    pattern.push(start + (i * step));
  }

  const finalAnswer = pattern[missingIndex].toString();
  
  // Format for visualEngine
  let displayPattern = [...pattern];
  displayPattern[missingIndex] = "?";

  const visualEngineStr = `{
    "componentToRender": "NUMBER_PATTERN",
    "componentData": {
      "items": ["${displayPattern[0]}", "${displayPattern[1]}", "${displayPattern[2]}", "${displayPattern[3]}", "${displayPattern[4]}"]
    }
  }`;

  let aiPrompt = `You are an expert Primary 3 math generator.
Generate a question for the subtopic: Number Patterns.
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
- Use visualType: NUMBER_PATTERN. The sequence is: ${displayPattern.join(", ")}.
- Ask "${askText}"
- The finalAnswer must be EXACTLY the numeral: "${finalAnswer}".
- If MCQ, provide 4 options including the correct answer and 3 reasonable distractors, ensuring the correct option is exactly "${finalAnswer}".
- CRITICAL: In the output JSON, you MUST copy the "visualEngine" object EXACTLY as shown in the output format. DO NOT CHANGE IT.

${getFormatInstructions(visualEngineStr)}`;

  return {
    aiPrompt: aiPrompt
  };
}
