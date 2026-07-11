export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let digits = [];
  let askText = "";
  let finalAnswer = "";

  if (activeVariant === "advanced_form_greatest_3_digit") {
    askText = "Form the greatest 3-digit number using the cards.";
    let pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
    digits = pool.slice(0, 3);
    const sorted = [...digits].sort((a, b) => b - a);
    finalAnswer = sorted.join("");
  } else if (activeVariant === "advanced_form_smallest_3_digit") {
    askText = "Form the smallest 3-digit number using the cards.";
    let pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
    digits = pool.slice(0, 3);
    const sorted = [...digits].sort((a, b) => a - b);
    if (sorted[0] === 0) {
      const temp = sorted[0];
      sorted[0] = sorted[1];
      sorted[1] = temp;
    }
    finalAnswer = sorted.join("");
  } else if (activeVariant === "advanced_form_greatest_even") {
    askText = "Form the greatest 3-digit even number using the cards.";
    let evens = [0, 2, 4, 6, 8].sort(() => Math.random() - 0.5);
    let odds = [1, 3, 5, 7, 9].sort(() => Math.random() - 0.5);
    digits.push(evens[0]);
    let remaining = [...evens.slice(1), ...odds].sort(() => Math.random() - 0.5);
    digits.push(remaining[0], remaining[1]);
    
    let maxEven = -1;
    const perms = [[digits[0], digits[1], digits[2]], [digits[0], digits[2], digits[1]], [digits[1], digits[0], digits[2]], [digits[1], digits[2], digits[0]], [digits[2], digits[0], digits[1]], [digits[2], digits[1], digits[0]]];
    for (const p of perms) {
      if (p[0] !== 0 && p[2] % 2 === 0) {
        let val = p[0] * 100 + p[1] * 10 + p[2];
        if (val > maxEven) maxEven = val;
      }
    }
    finalAnswer = maxEven.toString();
  } else if (activeVariant === "advanced_form_smallest_odd") {
    askText = "Form the smallest 3-digit odd number using the cards.";
    let odds = [1, 3, 5, 7, 9].sort(() => Math.random() - 0.5);
    let evens = [0, 2, 4, 6, 8].sort(() => Math.random() - 0.5);
    digits.push(odds[0]);
    let remaining = [...odds.slice(1), ...evens].sort(() => Math.random() - 0.5);
    digits.push(remaining[0], remaining[1]);
    
    let minOdd = 9999;
    const perms = [[digits[0], digits[1], digits[2]], [digits[0], digits[2], digits[1]], [digits[1], digits[0], digits[2]], [digits[1], digits[2], digits[0]], [digits[2], digits[0], digits[1]], [digits[2], digits[1], digits[0]]];
    for (const p of perms) {
      if (p[0] !== 0 && p[2] % 2 !== 0) {
        let val = p[0] * 100 + p[1] * 10 + p[2];
        if (val < minOdd) minOdd = val;
      }
    }
    finalAnswer = minOdd.toString();
  } else if (activeVariant === "advanced_form_greatest_odd") {
    askText = "Form the greatest 3-digit odd number using the cards.";
    let odds = [1, 3, 5, 7, 9].sort(() => Math.random() - 0.5);
    let evens = [0, 2, 4, 6, 8].sort(() => Math.random() - 0.5);
    digits.push(odds[0]);
    let remaining = [...odds.slice(1), ...evens].sort(() => Math.random() - 0.5);
    digits.push(remaining[0], remaining[1]);
    
    let maxOdd = -1;
    const perms = [[digits[0], digits[1], digits[2]], [digits[0], digits[2], digits[1]], [digits[1], digits[0], digits[2]], [digits[1], digits[2], digits[0]], [digits[2], digits[0], digits[1]], [digits[2], digits[1], digits[0]]];
    for (const p of perms) {
      if (p[0] !== 0 && p[2] % 2 !== 0) {
        let val = p[0] * 100 + p[1] * 10 + p[2];
        if (val > maxOdd) maxOdd = val;
      }
    }
    finalAnswer = maxOdd.toString();
  } else if (activeVariant === "advanced_form_smallest_even") {
    askText = "Form the smallest 3-digit even number using the cards.";
    let evens = [0, 2, 4, 6, 8].sort(() => Math.random() - 0.5);
    let odds = [1, 3, 5, 7, 9].sort(() => Math.random() - 0.5);
    digits.push(evens[0]);
    let remaining = [...evens.slice(1), ...odds].sort(() => Math.random() - 0.5);
    digits.push(remaining[0], remaining[1]);
    
    let minEven = 9999;
    const perms = [[digits[0], digits[1], digits[2]], [digits[0], digits[2], digits[1]], [digits[1], digits[0], digits[2]], [digits[1], digits[2], digits[0]], [digits[2], digits[0], digits[1]], [digits[2], digits[1], digits[0]]];
    for (const p of perms) {
      if (p[0] !== 0 && p[2] % 2 === 0) {
        let val = p[0] * 100 + p[1] * 10 + p[2];
        if (val < minEven) minEven = val;
      }
    }
    finalAnswer = minEven.toString();
  } else if (activeVariant === "advanced_form_greatest_less_than_x") {
    let thresholds = [400, 500, 600, 700, 800];
    let threshold = thresholds[Math.floor(Math.random() * thresholds.length)];
    askText = `Form the greatest 3-digit number less than ${threshold} using the cards.`;
    
    let tHundred = threshold / 100;
    let validHundreds = [];
    for (let i = 1; i < tHundred; i++) validHundreds.push(i);
    let h = validHundreds[Math.floor(Math.random() * validHundreds.length)];
    
    digits.push(h);
    let remaining = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => n !== h).sort(() => Math.random() - 0.5);
    digits.push(remaining[0], remaining[1]);
    
    let maxVal = -1;
    const perms = [[digits[0], digits[1], digits[2]], [digits[0], digits[2], digits[1]], [digits[1], digits[0], digits[2]], [digits[1], digits[2], digits[0]], [digits[2], digits[0], digits[1]], [digits[2], digits[1], digits[0]]];
    for (const p of perms) {
      let val = p[0] * 100 + p[1] * 10 + p[2];
      if (p[0] !== 0 && val < threshold && val > maxVal) maxVal = val;
    }
    finalAnswer = maxVal.toString();
  } else if (activeVariant === "advanced_form_smallest_greater_than_x") {
    let thresholds = [300, 400, 500, 600];
    let threshold = thresholds[Math.floor(Math.random() * thresholds.length)];
    askText = `Form the smallest 3-digit number greater than ${threshold} using the cards.`;
    
    let tHundred = threshold / 100;
    let validHundreds = [];
    for (let i = tHundred + 1; i <= 9; i++) validHundreds.push(i);
    let h = validHundreds[Math.floor(Math.random() * validHundreds.length)];
    
    digits.push(h);
    let remaining = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => n !== h).sort(() => Math.random() - 0.5);
    digits.push(remaining[0], remaining[1]);
    
    let minVal = 9999;
    const perms = [[digits[0], digits[1], digits[2]], [digits[0], digits[2], digits[1]], [digits[1], digits[0], digits[2]], [digits[1], digits[2], digits[0]], [digits[2], digits[0], digits[1]], [digits[2], digits[1], digits[0]]];
    for (const p of perms) {
      let val = p[0] * 100 + p[1] * 10 + p[2];
      if (p[0] !== 0 && val > threshold && val < minVal) minVal = val;
    }
    finalAnswer = minVal.toString();
  } else if (activeVariant === "advanced_form_greatest_even_less_than_x") {
    let thresholds = [500, 600, 700, 800];
    let threshold = thresholds[Math.floor(Math.random() * thresholds.length)];
    askText = `Form the greatest 3-digit even number less than ${threshold} using the cards.`;
    
    let tHundred = threshold / 100;
    let validHundreds = [];
    for (let i = 1; i < tHundred; i++) validHundreds.push(i);
    let h = validHundreds[Math.floor(Math.random() * validHundreds.length)];
    
    let evens = [0, 2, 4, 6, 8].filter(n => n !== h).sort(() => Math.random() - 0.5);
    let e = evens[0];
    
    digits.push(h, e);
    let remaining = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => n !== h && n !== e).sort(() => Math.random() - 0.5);
    digits.push(remaining[0]);
    
    let maxVal = -1;
    const perms = [[digits[0], digits[1], digits[2]], [digits[0], digits[2], digits[1]], [digits[1], digits[0], digits[2]], [digits[1], digits[2], digits[0]], [digits[2], digits[0], digits[1]], [digits[2], digits[1], digits[0]]];
    for (const p of perms) {
      let val = p[0] * 100 + p[1] * 10 + p[2];
      if (p[0] !== 0 && p[2] % 2 === 0 && val < threshold && val > maxVal) maxVal = val;
    }
    finalAnswer = maxVal.toString();
  } else if (activeVariant === "advanced_form_smallest_odd_greater_than_x") {
    let thresholds = [300, 400, 500, 600];
    let threshold = thresholds[Math.floor(Math.random() * thresholds.length)];
    askText = `Form the smallest 3-digit odd number greater than ${threshold} using the cards.`;
    
    let tHundred = threshold / 100;
    let validHundreds = [];
    for (let i = tHundred + 1; i <= 9; i++) validHundreds.push(i);
    let h = validHundreds[Math.floor(Math.random() * validHundreds.length)];
    
    let odds = [1, 3, 5, 7, 9].filter(n => n !== h).sort(() => Math.random() - 0.5);
    let o = odds[0];
    
    digits.push(h, o);
    let remaining = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => n !== h && n !== o).sort(() => Math.random() - 0.5);
    digits.push(remaining[0]);
    
    let minVal = 9999;
    const perms = [[digits[0], digits[1], digits[2]], [digits[0], digits[2], digits[1]], [digits[1], digits[0], digits[2]], [digits[1], digits[2], digits[0]], [digits[2], digits[0], digits[1]], [digits[2], digits[1], digits[0]]];
    for (const p of perms) {
      let val = p[0] * 100 + p[1] * 10 + p[2];
      if (p[0] !== 0 && p[2] % 2 !== 0 && val > threshold && val < minVal) minVal = val;
    }
    finalAnswer = minVal.toString();
  }

  const presentedDigits = [...digits].sort(() => Math.random() - 0.5);

  const visualEngineStr = `{
    "componentToRender": "NUMBER_CARDS",
    "componentData": {
      "items": ["${presentedDigits[0]}", "${presentedDigits[1]}", "${presentedDigits[2]}"]
    }
  }`;

  let aiPrompt = `You are an expert Primary 2 math generator.
Generate a question for the subtopic: Number Comparison and Ordering.
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
- Use visualType: NUMBER_CARDS. The 3 digits provided are ${presentedDigits.join(", ")}.
- Ask "${askText}"
- Note: The smallest 3-digit number cannot start with 0.
- The finalAnswer must be EXACTLY the numeral: "${finalAnswer}".
- If MCQ, provide 4 options including the correct answer and 3 reasonable distractors, ensuring the correct option is exactly "${finalAnswer}".
- CRITICAL: In the output JSON, you MUST copy the "visualEngine" object EXACTLY as shown in the output format. DO NOT CHANGE IT.

${getFormatInstructions(visualEngineStr)}`;

  return {
    aiPrompt: aiPrompt
  };
}
