export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let pattern = [];
  let missingIndex = 0;
  let askText = "Find the missing number in the number pattern.";
  
  if (activeVariant === "advanced_alternating_add_sub") {
    let start = Math.floor(Math.random() * 500) + 200;
    let step1 = [5, 10, 20][Math.floor(Math.random() * 3)];
    let step2 = [-2, -5, -10][Math.floor(Math.random() * 3)];
    for(let i=0; i<6; i++) {
      pattern.push(start);
      start += (i % 2 === 0) ? step1 : step2;
    }
    missingIndex = Math.floor(Math.random() * 6);
  } else if (activeVariant === "advanced_alternating_add_add") {
    let start = Math.floor(Math.random() * 500) + 100;
    let step1 = [2, 3, 5][Math.floor(Math.random() * 3)];
    let step2 = [10, 20, 50][Math.floor(Math.random() * 3)];
    for(let i=0; i<6; i++) {
      pattern.push(start);
      start += (i % 2 === 0) ? step1 : step2;
    }
    missingIndex = Math.floor(Math.random() * 6);
  } else if (activeVariant === "advanced_alternating_sub_sub") {
    let start = Math.floor(Math.random() * 500) + 400;
    let step1 = [-5, -10][Math.floor(Math.random() * 2)];
    let step2 = [-2, -3][Math.floor(Math.random() * 2)];
    for(let i=0; i<6; i++) {
      pattern.push(start);
      start += (i % 2 === 0) ? step1 : step2;
    }
    missingIndex = Math.floor(Math.random() * 6);
  } else if (activeVariant === "advanced_increasing_jumps") {
    let start = Math.floor(Math.random() * 500) + 100;
    let baseStep = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
    for(let i=0; i<6; i++) {
      pattern.push(start);
      start += baseStep * (i + 1);
    }
    missingIndex = Math.floor(Math.random() * 6);
  } else if (activeVariant === "advanced_large_jumps") {
    let largeStep = [200, 300][Math.floor(Math.random() * 2)];
    let sign = Math.random() < 0.5 ? 1 : -1;
    let start = 0;
    if (sign === 1) {
      let maxStart = 1000 - (3 * largeStep);
      start = Math.floor(Math.random() * maxStart) + 1;
    } else {
      let minStart = 3 * largeStep;
      start = Math.floor(Math.random() * (1000 - minStart)) + minStart;
    }
    let step = largeStep * sign;
    for(let i=0; i<4; i++) {
      pattern.push(start);
      start += step;
    }
    missingIndex = Math.floor(Math.random() * 4);
  } else if (activeVariant === "advanced_multiples_of_10") {
    let baseStep = [20, 30, 40, 50][Math.floor(Math.random() * 4)];
    let sign = Math.random() < 0.5 ? 1 : -1;
    let start = Math.floor(Math.random() * 500) + (sign === 1 ? 100 : 400);
    let step = baseStep * sign;
    for(let i=0; i<6; i++) {
      pattern.push(start);
      start += step;
    }
    missingIndex = Math.floor(Math.random() * 6);
  } else if (activeVariant === "advanced_quarters") {
    let baseStep = [25, 75][Math.floor(Math.random() * 2)];
    let sign = Math.random() < 0.5 ? 1 : -1;
    let start = Math.floor(Math.random() * 400) + (sign === 1 ? 100 : 500);
    start = Math.floor(start / 25) * 25; // Align to quarter boundaries
    let step = baseStep * sign;
    for(let i=0; i<6; i++) {
      pattern.push(start);
      start += step;
    }
    missingIndex = Math.floor(Math.random() * 6);
  }

  const finalAnswer = pattern[missingIndex].toString();
  
  let displayPattern = [...pattern];
  displayPattern[missingIndex] = "?";

  // Using dynamic items mapping to gracefully handle 4 or 6 item length arrays
  const itemsJson = displayPattern.map(num => `"${num}"`).join(", ");

  const visualEngineStr = `{
    "componentToRender": "NUMBER_PATTERN",
    "componentData": {
      "items": [${itemsJson}]
    }
  }`;

  let aiPrompt = `You are an expert Primary 2 math generator.
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
