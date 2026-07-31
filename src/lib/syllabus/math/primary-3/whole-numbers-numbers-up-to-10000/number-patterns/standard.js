export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let step = 0;
  let missingIndex = Math.floor(Math.random() * 5); // 0 to 4
  let start = 0;
  let askText = "Find the missing number in the number pattern.";
  
  if (activeVariant === "standard_random_cross_hundreds") {
    const options = ["standard_add_10_cross_hundreds", "standard_subtract_10_cross_hundreds", "standard_add_small_cross_hundreds", "standard_subtract_small_cross_hundreds"];
    activeVariant = options[Math.floor(Math.random() * options.length)];
  }

  if (activeVariant === "standard_add_10_cross_hundreds") {
    step = 10;
    let th = Math.floor(Math.random() * 9) + 1; // 1 to 9
    let h = Math.floor(Math.random() * 8) + 1; // 1 to 8
    let validTens = [6, 7, 8, 9];
    let t = validTens[Math.floor(Math.random() * validTens.length)];
    let o = Math.floor(Math.random() * 10);
    start = th * 1000 + h * 100 + t * 10 + o;
  } else if (activeVariant === "standard_subtract_10_cross_hundreds") {
    step = -10;
    let th = Math.floor(Math.random() * 9) + 1;
    let h = Math.floor(Math.random() * 8) + 2; // 2 to 9
    let validTens = [0, 1, 2, 3];
    let t = validTens[Math.floor(Math.random() * validTens.length)];
    let o = Math.floor(Math.random() * 10);
    start = th * 1000 + h * 100 + t * 10 + o;
  } else if (activeVariant === "standard_add_small_cross_hundreds") {
    let smallSteps = [2, 3, 4, 5];
    step = smallSteps[Math.floor(Math.random() * smallSteps.length)];
    let th = Math.floor(Math.random() * 9) + 1;
    let h = Math.floor(Math.random() * 8) + 1;
    let minTensOnes = 100 - (step * 4) + 1;
    let tensOnes = Math.floor(Math.random() * (99 - minTensOnes + 1)) + minTensOnes;
    start = th * 1000 + h * 100 + tensOnes;
  } else if (activeVariant === "standard_subtract_small_cross_hundreds") {
    let smallSteps = [-2, -3, -4, -5];
    step = smallSteps[Math.floor(Math.random() * smallSteps.length)];
    let th = Math.floor(Math.random() * 9) + 1;
    let h = Math.floor(Math.random() * 8) + 2;
    let maxTensOnes = Math.abs(step) * 4 - 1;
    let tensOnes = Math.floor(Math.random() * (maxTensOnes + 1));
    start = th * 1000 + h * 100 + tensOnes;
  }

  let pattern = [];
  for (let i = 0; i < 5; i++) {
    pattern.push(start + (i * step));
  }

  const finalAnswer = pattern[missingIndex].toString();
  
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
