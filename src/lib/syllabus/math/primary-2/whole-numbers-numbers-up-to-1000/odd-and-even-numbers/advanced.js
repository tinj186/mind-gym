export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let targetOdd = Math.random() < 0.5;
  let targetType = targetOdd ? "odd" : "even";
  let askText = "";
  let finalAnswer = "";
  let componentToRender = "NONE";
  let componentItems = [];
  
  if (activeVariant === "advanced_next_odd_even_after") {
    let start = Math.floor(Math.random() * 800) + 100;
    let nextNum = start + 1;
    while ( (nextNum % 2 !== 0) !== targetOdd ) {
      nextNum++;
    }
    askText = `What is the next ${targetType} number after ${start}?`;
    finalAnswer = nextNum.toString();
  } else if (activeVariant === "advanced_greatest_odd_even_formed" || activeVariant === "advanced_smallest_odd_even_formed") {
    let isGreatest = activeVariant === "advanced_greatest_odd_even_formed";
    let d1 = Math.floor(Math.random() * 9) + 1; // 1-9
    let d2 = Math.floor(Math.random() * 10);
    let parityList = targetOdd ? [1, 3, 5, 7, 9] : [0, 2, 4, 6, 8];
    let d3 = parityList[Math.floor(Math.random() * parityList.length)];
    let digits = [d1, d2, d3];
    
    let permutations = [
      [digits[0], digits[1], digits[2]], [digits[0], digits[2], digits[1]],
      [digits[1], digits[0], digits[2]], [digits[1], digits[2], digits[0]],
      [digits[2], digits[0], digits[1]], [digits[2], digits[1], digits[0]]
    ];
    
    let validNumbers = [];
    for (let p of permutations) {
      if (p[0] === 0) continue; 
      let num = p[0]*100 + p[1]*10 + p[2];
      if ((num % 2 !== 0) === targetOdd) {
        validNumbers.push(num);
      }
    }
    
    if (isGreatest) {
      finalAnswer = Math.max(...validNumbers).toString();
      askText = `What is the greatest 3-digit ${targetType} number that can be formed using the digits ${digits[0]}, ${digits[1]}, and ${digits[2]}?`;
    } else {
      finalAnswer = Math.min(...validNumbers).toString();
      askText = `What is the smallest 3-digit ${targetType} number that can be formed using the digits ${digits[0]}, ${digits[1]}, and ${digits[2]}?`;
    }
    
    componentToRender = "NUMBER_CARDS";
    componentItems = [`"${digits[0]}"`, `"${digits[1]}"`, `"${digits[2]}"`];
    
  } else if (activeVariant === "advanced_sum_of_next_two") {
    let start = Math.floor(Math.random() * 300) + 100;
    let n1 = start + 1;
    while ( (n1 % 2 !== 0) !== targetOdd ) n1++;
    let n2 = n1 + 2;
    askText = `What is the sum of the next two ${targetType} numbers after ${start}?`;
    finalAnswer = (n1 + n2).toString();
  } else if (activeVariant === "advanced_nth_odd_even_after") {
    let n = Math.floor(Math.random() * 3) + 3; // 3rd, 4th, 5th
    let nthStr = ["3rd", "4th", "5th"][n-3];
    let start = Math.floor(Math.random() * 500) + 100;
    
    let current = start + 1;
    let count = 0;
    while (count < n) {
      if ((current % 2 !== 0) === targetOdd) {
        count++;
        if (count === n) break;
      }
      current++;
    }
    askText = `What is the ${nthStr} ${targetType} number after ${start}?`;
    finalAnswer = current.toString();
  }

  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  if (componentToRender === "NUMBER_CARDS") {
    visualEngineStr = `{
      "componentToRender": "NUMBER_CARDS",
      "componentData": {
        "items": [${componentItems.join(", ")}]
      }
    }`;
  }

  let aiPrompt = `You are an expert Primary 2 math generator.
Generate a question for the subtopic: Odd and Even Numbers.
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
- The question stem must clearly ask "${askText}".
- The finalAnswer must be EXACTLY: "${finalAnswer}".
- If MCQ, provide 4 options including the correct answer and 3 reasonable distractors, ensuring the correct option is exactly "${finalAnswer}".
- CRITICAL: In the output JSON, you MUST copy the "visualEngine" object EXACTLY as shown in the output format. DO NOT CHANGE IT.

${getFormatInstructions(visualEngineStr)}`;

  return {
    aiPrompt: aiPrompt
  };
}
