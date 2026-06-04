import { numberToWords } from '@/lib/utils/math-helpers';

export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, hideVisual) {
  const commonMeta = { level, topic, type: zodType, difficulty: zodDiff };
  const inputType = isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT';

  if (activeVariant === 'advanced_greatest_from_digits') { // Renamed
    const digits = [];
    while(digits.length < 3) {
      const d = Math.floor(Math.random() * 8) + 2;
      if (!digits.includes(d)) digits.push(d);
    }
    const sortedDigits = [...digits].sort((a, b) => b - a);
    const greatestNum = (sortedDigits[0] * 10) + sortedDigits[1]; // Renamed from greatestNum to greatestNum
    const answer = String(greatestNum);
    
    const d1 = (sortedDigits[1] * 10) + sortedDigits[0];
    const d2 = (sortedDigits[0] * 10) + sortedDigits[2];
    const d3 = (sortedDigits[2] * 10) + sortedDigits[1];
    const options = isMCQ ? [String(d1), answer, String(d2), String(d3)] : null;
    const mcqOptions = isMCQ ? JSON.stringify([String(d1), answer, String(d2), String(d3)].sort(() => Math.random() - 0.5)) : 'null';

    return {
      aiPrompt: `You are an expert Primary 1 math generator.
      ${formatInstructions}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": "Use these digits to form the greatest 2-digit number: ${digits.join(', ')}",
          "options": ${mcqOptions},
          "hint": "To make the greatest number, put the largest digit in the tens place.",
          "finalAnswer": "${answer}",
          "solutionSteps": "1. Look at the digits: ${digits.join(', ')}.\\n2. The largest digit is ${sortedDigits[0]}. Put it in the tens place.\\n3. The next largest digit is ${sortedDigits[1]}. Put it in the ones place.\\n4. The number is ${answer}."
        },
        "visualEngine": {
          "componentToRender": "NUMBER_CARDS",
          "componentData": { "items": ${JSON.stringify(digits.map(String))} }
        },
        "inputRequirement": { "inputType": "${inputType}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "form_greatest", hideVisual: hideVisual }
    };
  }

  if (activeVariant === 'advanced_relative_logic') {
    const names = ['Wei Ling', 'Siti', 'Ahmad', 'Muthu', 'Bala', 'Kumar', 'Mei Hua', 'Fatimah'].sort(() => 0.5 - Math.random());
    const [p1, p2, p3] = names.slice(0, 3);
    const amounts = [60, 45, 30]; 
    
    const askAsc = Math.random() > 0.5;
    const targetOrder = askAsc ? "least to most" : "most to least";
    const answer = askAsc ? `${p3}, ${p2}, ${p1}` : `${p1}, ${p2}, ${p3}`;

    const distractors = [
      `${p1}, ${p2}, ${p3}`,
      `${p2}, ${p1}, ${p3}`,
      `${p3}, ${p2}, ${p1}`,
      `${p1}, ${p3}, ${p2}`
    ].filter(p => p !== answer).slice(0, 3);
    const mcqOptions = JSON.stringify([answer, ...distractors].sort(() => 0.5 - Math.random()));

    const storyInstruction = `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context where ${p1} has 60, ${p2} has 45, and ${p3} has 30 items. You MUST NOT leave the "[STORY]" tag.`;

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      MATH CONSTRAINTS:
      - Logic: ${p1} has 60, ${p2} has 45, ${p3} has 30.
      - Question: Order the names from ${targetOrder}.
      - Final Answer MUST be: "${answer}"

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": "[STORY] Order the children from ${targetOrder}.",
          "options": ${mcqOptions},
          "hint": "Identify the number of items for each child first, then compare them.",
          "finalAnswer": "${answer}",
          "solutionSteps": "1. ${p1} has 60.\\n2. ${p2} has 45.\\n3. ${p3} has 30.\\n4. The order from ${targetOrder} is ${answer}."
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${inputType}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "relative_order", hideVisual: hideVisual }
    };
  }

  if (activeVariant === 'advanced_sequence_skip_counting') {
    const steps = [2, 5, 10];
    const step = steps[Math.floor(Math.random() * steps.length)];
    const start = Math.floor(Math.random() * 40) + 10;
    const sequence = [start, start + step, start + 2*step, start + 3*step];
    const missingIdx = Math.floor(Math.random() * 2) + 1;
    const answer = String(sequence[missingIdx]);
    const displaySeq = [...sequence];
    displaySeq[missingIdx] = "?";
    const mcqOptions = isMCQ ? JSON.stringify([String(sequence[missingIdx] - step), answer, String(sequence[missingIdx] + step), String(sequence[missingIdx] + 1)].sort(() => Math.random() - 0.5)) : 'null';

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": "What is the missing number in the pattern? ${displaySeq.join(', ')}",
          "options": ${mcqOptions},
          "hint": "Check how much the numbers are increasing by each time.",
          "finalAnswer": "${answer}",
          "solutionSteps": "1. Look at the numbers: ${sequence[0]}, ${sequence[1]}...\\n2. Each jump is +${step}.\\n3. ${sequence[missingIdx - 1]} + ${step} = ${answer}."
        },
        "visualEngine": {
          "componentToRender": "NUMBER_PATTERN",
          "componentData": { "sequence": ${JSON.stringify(displaySeq.map(String))}, "rule": "+${step}" }
        },
        "inputRequirement": { "inputType": "${inputType}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "sequence_skip", hideVisual: hideVisual }
    };
  }

  if (activeVariant === 'advanced_smallest_from_digits') { // Renamed
    const digits = [];
    while(digits.length < 3) {
      const d = Math.floor(Math.random() * 8) + 2; 
      if (!digits.includes(d)) digits.push(d);
    }
    digits.sort((a,b) => a - b);
    const threshold = (digits[1] * 10); // Renamed from threshold to threshold
    const answerNum = (digits[1] * 10) + digits[0]; // Renamed from answerNum to answerNum
    const answer = String(answerNum);
    
    const d1 = (digits[0] * 10) + digits[1];
    const d2 = (digits[1] * 10) + digits[2];
    const d3 = (digits[2] * 10) + digits[0]; 
    const mcqOptions = isMCQ ? JSON.stringify([String(d1), answer, String(d2), String(d3)].sort(() => Math.random() - 0.5)) : 'null';

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": "Form the SMALLEST 2-digit number that is GREATER than ${threshold} using these digits: ${digits.join(', ')}",
          "options": ${mcqOptions},
          "hint": "To be greater than ${threshold}, the tens digit must be at least ${digits[1]}.",
          "finalAnswer": "${answer}",
          "solutionSteps": "1. To be greater than ${threshold}, the tens digit must be ${digits[1]} or ${digits[2]}.\\n2. For the smallest number, we choose ${digits[1]} for tens.\\n3. The smallest remaining digit is ${digits[0]} for ones.\\n4. The number is ${answer}."
        },
        "visualEngine": {
          "componentToRender": "NUMBER_CARDS",
          "componentData": { "items": ${JSON.stringify(digits.map(String))} }
        },
        "inputRequirement": { "inputType": "${inputType}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "form_smallest_cond", hideVisual: hideVisual }
    };
  }

  if (activeVariant === 'advanced_swapped_digits_difference') {
    const tens = Math.floor(Math.random() * 4) + 5;
    const ones = Math.floor(Math.random() * 3) + 1;
    const num1 = (tens * 10) + ones;
    const num2 = (ones * 10) + tens;
    const diff = num1 - num2;
    const answer = String(Math.abs(diff)); // Use Math.abs to ensure positive difference
    const mcqOptions = isMCQ ? JSON.stringify([String(Math.abs(diff) - 9), answer, String(Math.abs(diff) + 9), String(num1 + num2)].sort(() => Math.random() - 0.5)) : 'null';

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": "I have the number ${num1}. If I swap its tens and ones digits, what is the difference between the original and the new number?",
          "options": ${mcqOptions},
          "hint": "Swap the digits to get a new number, then subtract the smaller one from the larger one.",
          "finalAnswer": "${answer}",
          "solutionSteps": "1. Original: ${num1}.\\n2. Swapped: ${num2}.\\n3. Difference: ${num1} - ${num2} = ${answer}."
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${inputType}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "swapped_diff", hideVisual: hideVisual }
    };
  }

  if (activeVariant === 'advanced_logic_puzzle_order') {
    const names = ['Wei Ling', 'Siti', 'Ahmad', 'Muthu', 'Bala', 'Kumar', 'Mei Hua', 'Fatimah'].sort(() => 0.5 - Math.random());
    const [p1, p2, p3] = names.slice(0, 3);
    
    // Internal Logic: p1 > p2 > p3
    const askAsc = Math.random() > 0.5;
    const targetOrder = askAsc ? "smallest to greatest" : "greatest to smallest";
    const answer = askAsc ? `${p3}, ${p2}, ${p1}` : `${p1}, ${p2}, ${p3}`;

    const distractorPool = [
      `${p1}, ${p2}, ${p3}`, `${p1}, ${p3}, ${p2}`, `${p2}, ${p1}, ${p3}`, `${p2}, ${p3}, ${p1}`, `${p3}, ${p1}, ${p2}`, `${p3}, ${p2}, ${p1}`
    ].filter(p => p !== answer).sort(() => 0.5 - Math.random()).slice(0, 3);
    const mcqOptions = JSON.stringify([answer, ...distractorPool].sort(() => 0.5 - Math.random()));

    const clueOptions = [
      { c1: `${p1} has the most.`, c2: `${p2} has more than ${p3}.` },
      { c1: `${p3} has the least.`, c2: `${p2} has fewer than ${p1}.` },
      { c1: `${p1} has more than ${p2}.`, c2: `${p2} has more than ${p3}.` },
      { c1: `${p3} has fewer than ${p2}.`, c2: `${p2} has fewer than ${p1}.` }
    ];
    const clues = clueOptions[Math.floor(Math.random() * clueOptions.length)];
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context using names ${p1}, ${p2}, and ${p3}. You MUST NOT leave the "[STORY]" tag.`;

    return {
      aiPrompt: `You are an expert Primary 1 math generator.
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? `Order from ${targetOrder}: ${clues.c1} ${clues.c2}` : "[STORY] Order the children from ${targetOrder}.")},
          "options": ${mcqOptions},
          "hint": "Try listing the people from most to fewest first based on the clues.",
          "finalAnswer": "${answer}",
          "solutionSteps": "1. ${clues.c1}\\n2. ${clues.c2}\\n3. Based on these clues, the order from ${targetOrder} is ${answer}."
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${inputType}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "logic_puzzle_order", hideVisual: hideVisual }
    };
  }

  if (activeVariant === 'advanced_mystery_number_clues') {
    const tens = Math.floor(Math.random() * 8) + 1; // 1-8
    const ones = Math.floor(Math.random() * 9); // 0-8
    const total = (tens * 10) + ones;
    const lower = tens * 10;
    const upper = lower + 10;
    const sum = tens + ones;
    const mcqOptions = isMCQ ? JSON.stringify([String((ones * 10) + tens), String(total - 10), String(total), String(lower + sum)].sort(() => Math.random() - 0.5)) : 'null';

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": "I am a 2-digit number between ${lower} and ${upper}. The sum of my digits is ${sum}. What number am I?",
          "options": ${mcqOptions},
          "hint": "Since the number is between ${lower} and ${upper}, the tens digit must be ${tens}.",
          "finalAnswer": "${total}",
          "solutionSteps": "1. A number between ${lower} and ${upper} starts with ${tens}.\\n2. Sum of digits is ${sum}, so the ones digit is ${sum} - ${tens} = ${ones}.\\n3. The number is ${total}."
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${inputType}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "mystery_clues", hideVisual: hideVisual }
    };
  }

  if (activeVariant === 'advanced_extreme_inequality') {
    const targetTens = Math.floor(Math.random() * 3) + 2;
    const targetOnes = Math.floor(Math.random() * 8) + 12;
    const targetValue = (targetTens * 10) + targetOnes;
    const answer = String(targetValue - 1); 
    const mcqOptions = isMCQ ? JSON.stringify([String(targetValue - 10), answer, String(targetValue + 1), String(targetValue)].sort(() => Math.random() - 0.5)) : 'null';

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": "What is the GREATEST 2-digit number that is smaller than ${targetTens} tens and ${targetOnes} ones?",
          "options": ${mcqOptions},
          "hint": "Find the value of ${targetTens} tens and ${targetOnes} ones first.",
          "finalAnswer": "${answer}",
          "solutionSteps": "1. ${targetTens} tens is ${targetTens * 10}.\\n2. ${targetTens * 10} + ${targetOnes} = ${targetValue}.\\n3. The greatest number smaller than ${targetValue} is ${targetValue} - 1 = ${answer}."
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${inputType}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "extreme_inequality", hideVisual: hideVisual }
    };
  }

  if (activeVariant === 'advanced_net_value_comparison') {
    const startTens = Math.floor(Math.random() * 3) + 3; // e.g., 3 to 5 tens
    const regroupedOnes = Math.floor(Math.random() * 8) + 12; // e.g., 12 to 19 ones
    const initialValue = (startTens * 10) + regroupedOnes;
    
    const changeTens = Math.floor(Math.random() * 2) + 1; // e.g., 1 or 2 tens
    const isIncrease = Math.random() > 0.5;
    const finalValue = isIncrease ? initialValue + (changeTens * 10) : initialValue - (changeTens * 10);
    const mcqOptions = isMCQ ? JSON.stringify([String(finalValue), String(finalValue + 5), String(finalValue - 10), String(initialValue)].sort(() => Math.random() - 0.5)) : 'null';

    const storyInstruction = `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context where a character has ${startTens} tens and ${regroupedOnes} ones, then ${isIncrease ? 'gets' : 'loses'} ${changeTens} tens. You MUST NOT leave the "[STORY]" tag.`;

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      MATH CONSTRAINTS:
      - Start: ${startTens} tens, ${regroupedOnes} ones.
      - Change: ${isIncrease ? '+' : '-'} ${changeTens} tens.
      - Final Answer MUST be: "${finalValue}"

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": "[STORY] What is the total value now?",
          "options": ${mcqOptions},
          "hint": "Convert the starting tens and ones into a number first, then add or subtract the extra tens.",
          "finalAnswer": "${finalValue}",
          "solutionSteps": "1. Starting value: ${startTens} tens (${startTens * 10}) + ${regroupedOnes} ones = ${initialValue}.\\n2. Change: ${changeTens} tens = ${changeTens * 10}.\\n3. Final: ${initialValue} ${isIncrease ? '+' : '-'} ${changeTens * 10} = ${finalValue}."
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${inputType}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "net_value_comparison", hideVisual: hideVisual }
    };
  }
}