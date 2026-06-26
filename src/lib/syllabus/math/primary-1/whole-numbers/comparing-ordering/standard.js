import { numberToWords } from '@/lib/utils/math-helpers';

export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, hideVisual) {
  const commonMeta = { level, topic, type: zodType, difficulty: zodDiff };
  const inputType = isStructure ? 'MULTI_STEP_INPUT' : (isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT');

  if (activeVariant === 'standard_ordering_asc' || activeVariant === 'standard_ordering_desc') { // Renamed
    const askAsc = activeVariant === 'standard_ordering_asc';
    const nums = [];
    while(nums.length < 4) {
      const n = Math.floor(Math.random() * 80) + 10;
      if (!nums.includes(n)) nums.push(n);
    }
    
    const sortedNums = [...nums].sort((a, b) => askAsc ? a - b : b - a);
    const answer = sortedNums.join(', ');
    
    const distractor1 = [...nums].sort((a, b) => (!askAsc) ? a - b : b - a).join(', ');
    const distractor2 = [sortedNums[0], sortedNums[2], sortedNums[1], sortedNums[3]].join(', ');
    const distractor3 = [sortedNums[1], sortedNums[0], sortedNums[2], sortedNums[3]].join(', ');
    
    const targetWord = askAsc ? "smallest to greatest" : "greatest to smallest";
    let options = null;
    let defectMap = null;
    if (isMCQ) {
      options = Array.from(new Set([answer, distractor1, distractor2, distractor3])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [distractor1]: "CONCEPTUAL_ERROR",
        [distractor2]: "CARELESS_CALCULATION",
        [distractor3]: "CARELESS_CALCULATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }
    const hint = getQText(`Compare the tens of all numbers. Start with the one that has the ${askAsc ? 'least' : 'most'} tens.`, `Which number is the ${askAsc ? 'smallest' : 'greatest'}?`);

    const questionText = getQText(`Arrange these number cards from ${targetWord}:`, `Arrange from ${targetWord}: ${nums.join(', ')}`);
    const solutionSteps = getQText(`Comparing the tens and ones, the correct order from ${targetWord} is ${answer}.`, answer);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a standard_ordering question. You MUST write the word problem into "questionText". DO NOT change the "visualEngine" component or "solutionSteps". Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Ordering Numbers\n - Numbers: ${nums.join(', ')}\n - Final Answer MUST be exactly: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: hint,
          finalAnswer: answer,
          solutionSteps: solutionSteps
        },
        visualEngine: {
          componentToRender: hideVisual ? "NONE" : "NUMBER_CARDS",
          componentData: { items: [`${nums[0]}`, `${nums[1]}`, `${nums[2]}`, `${nums[3]}`], hideVisual: hideVisual }
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: askAsc ? "order_asc" : "order_desc", hideVisual: hideVisual }
    };
  }

  if (activeVariant === 'standard_between_bounds') { // Renamed
    const lower = Math.floor(Math.random() * 40) + 20;
    // For Short Answer, we narrow the gap to exactly one integer so the answer is unique.
    // For MCQ, a wider gap is fine because distractors handle the ambiguity.
    const upper = isShort ? lower + 2 : lower + 10; 
    const answerNum = isShort ? lower + 1 : lower + Math.floor(Math.random() * 8) + 1;
    const answer = String(answerNum);
    
    const d1 = lower - Math.floor(Math.random() * 5) - 1;
    const d2 = upper + Math.floor(Math.random() * 5) + 1;
    const d3 = upper + Math.floor(Math.random() * 10) + 6;
    let options = null;
    let defectMap = null;
    if (isMCQ) {
      options = Array.from(new Set([String(d1), answer, String(d2), String(d3)])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [String(d1)]: "CONSTANT_VIOLATION",
        [String(d2)]: "CONSTANT_VIOLATION",
        [String(d3)]: "CONSTANT_VIOLATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }
    const hint = getQText(`The number must be larger than ${lower} and less than ${upper}.`, `${lower} < ? < ${upper}`);

    const questionText = getQText(`Look at the number cards. Which number can replace the question mark so that the numbers are in order from smallest to greatest?`, `What number is between ${lower} and ${upper}?`);
    const explanation = isShort ? `${answer} is the only number between ${lower} and ${upper}.` : `${answer} is the only option that is larger than ${lower} and less than ${upper}.`;
    const solutionSteps = getQText(explanation, `${lower} < ${answer} < ${upper}`);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a standard_between_bounds question. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. DO NOT change the "visualEngine" component or "solutionSteps". Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Number Bounds\n - Final Answer MUST strictly be: "${answer}"\n ${formatInstructions}\n\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: hint,
          finalAnswer: answer,
          solutionSteps: solutionSteps
        },
        visualEngine: {
          componentToRender: hideVisual ? "NONE" : "NUMBER_CARDS",
          componentData: { items: [`${lower}`, "?", `${upper}`], hideVisual: hideVisual }
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: "number_between", hideVisual: hideVisual }
    };
  }

  if (activeVariant === 'standard_clue_comparison') { // Renamed
    const amounts = [];
    while(amounts.length < 3) {
      const n = Math.floor(Math.random() * 40) + 20;
      if (!amounts.includes(n)) amounts.push(n);
    }
    const askGreatest = Math.random() > 0.5;
    const targetWord = askGreatest ? "most" : "least";
    const answer = String(askGreatest ? Math.max(...amounts) : Math.min(...amounts));
    const distractor = askGreatest ? Math.max(...amounts) + 5 : Math.min(...amounts) - 5; // Renamed from distractor to distractor
    let options = null;
    let defectMap = null;
    if (isMCQ) {
      options = Array.from(new Set([String(amounts[0]), String(amounts[1]), String(amounts[2]), String(distractor)])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {};
      options.forEach(opt => { if (opt !== answer) defectMap[opt] = "CONCEPTUAL_ERROR"; });
    }

    const promptStart = `STRICT VARIANT MANDATE: You are generating a compare word problem. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. DO NOT change the "visualEngine" component or "solutionSteps". Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n MATH CONSTRAINTS:\n - Topic: Compare Word Problem\n - Amounts: ${amounts.join(', ')}\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n - Do NOT put emojis in the question text.\n - CRITICAL: Because the answer options are numbers, your question MUST ask for the AMOUNT (e.g., "What is the fewest number of items?"). It MUST NOT ask "Who", because the answer choices are numbers, not names.`;
    const solutionSteps = getQText(`Comparing the amounts, the ${targetWord} amount is ${answer}.`, `${answer} is the ${targetWord}.`);

    return {
      aiPrompt: `${promptStart}\n ${formatInstructions}\n CRITICAL: RETURN THE FOLLOWING VALID JSON. FILL IN ALL [Placeholders] USING LOCALIZED THEMES:\n ${JSON.stringify({ // Keep formatInstructions for creative part, as AI generates text
        meta: commonMeta,
        content: {
          questionText: "[Insert full localized Singaporean word problem here]", // AI fills this
          options: options,
          defectMap: defectMap,
          hint: "[Insert conceptual hint here]",
          finalAnswer: answer,
          solutionSteps: solutionSteps
        },
        visualEngine: {
          componentToRender: "NONE",
          componentData: {}
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: "compare_word", hideVisual: true }
    };
  }

  if (activeVariant === 'standard_missing_seq_asc') {
    const start = Math.floor(Math.random() * 70) + 10;
    const sequence = [start, start + 1, start + 2, start + 3];
    const missingIdx = Math.floor(Math.random() * 2) + 1;
    const answer = String(sequence[missingIdx]);
    const displaySeq = [...sequence];
    displaySeq[missingIdx] = "?";
    
    let options = null;
    let defectMap = null;
    if (isMCQ) {
      options = Array.from(new Set([String(sequence[missingIdx] - 1), answer, String(sequence[missingIdx] + 1), String(start + 10)])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [String(sequence[missingIdx] - 1)]: "CONFUSED_OPERATION",
        [String(start + 10)]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }
    const hint = getQText(`The numbers are going up by 1. What comes after ${sequence[missingIdx - 1]}?`, `Count forward by 1.`);

    const questionText = getQText(`Look at the number cards. What is the missing number in the pattern?`, `Find the missing number: ${displaySeq.join(', ')}`);
    const solutionSteps = getQText(`The numbers are increasing by 1. After ${sequence[missingIdx - 1]} comes ${answer}.`, `${sequence[missingIdx - 1]} + 1 = ${answer}`);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a missing sequence question. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. DO NOT change the "visualEngine" component or "solutionSteps". Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Missing Number (Ascending)\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: hint,
          finalAnswer: answer,
          solutionSteps: solutionSteps
        },
        visualEngine: {
          componentToRender: hideVisual ? "NONE" : "NUMBER_CARDS",
          componentData: { items: displaySeq, hideVisual: hideVisual }
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: "missing_seq_asc", hideVisual: hideVisual }
    };
  }

  if (activeVariant === 'standard_missing_seq_desc') {
    const start = Math.floor(Math.random() * 70) + 20;
    const sequence = [start, start - 1, start - 2, start - 3];
    const missingIdx = Math.floor(Math.random() * 2) + 1;
    const answer = String(sequence[missingIdx]);
    const displaySeq = [...sequence];
    displaySeq[missingIdx] = "?";
    
    let options = null;
    let defectMap = null;
    if (isMCQ) {
      options = Array.from(new Set([String(sequence[missingIdx] + 1), answer, String(sequence[missingIdx] - 1), String(start - 10)])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [String(sequence[missingIdx] + 1)]: "CONFUSED_OPERATION",
        [String(start - 10)]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }
    const hint = getQText(`The numbers are going down by 1. What comes before ${sequence[missingIdx - 1]}?`, `Count backward by 1.`);

    const questionText = getQText(`Look at the number cards. What is the missing number in the pattern?`, `Find the missing number: ${displaySeq.join(', ')}`);
    const solutionSteps = getQText(`The numbers are decreasing by 1. Before ${sequence[missingIdx - 1]} comes ${answer}.`, `${sequence[missingIdx - 1]} - 1 = ${answer}`);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a missing sequence question. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. DO NOT change the "visualEngine" component or "solutionSteps". Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Missing Number (Descending)\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: hint,
          finalAnswer: answer,
          solutionSteps: solutionSteps
        },
        visualEngine: {
          componentToRender: hideVisual ? "NONE" : "NUMBER_CARDS",
          componentData: { items: displaySeq, hideVisual: hideVisual }
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: "missing_seq_desc", hideVisual: hideVisual }
    };
  }

  if (activeVariant === 'standard_greatest_four') {
    const nums = [];
    while(nums.length < 4) {
      const n = Math.floor(Math.random() * 80) + 10;
      if (!nums.includes(n)) nums.push(n);
    }
    const answer = String(Math.max(...nums));
    let options = null;
    let defectMap = null;
    if (isMCQ) {
      options = Array.from(new Set(nums.map(String))).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {};
      options.forEach(opt => { if (opt !== answer) defectMap[opt] = "CONCEPTUAL_ERROR"; });
    }
    const hint = getQText(`Compare the tens digits of all cards. Which one is the biggest?`, `Look for the most tens.`);

    const questionText = getQText(`Which is the greatest number among the cards?`, `Which is the greatest: ${nums.join(', ')}?`);
    const solutionSteps = getQText(`Comparing all four numbers, ${answer} has the highest value.`, `${answer} is the greatest.`);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a greatest_four question. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. DO NOT change the "visualEngine" component or "solutionSteps". Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Greatest of Four\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: hint,
          finalAnswer: answer,
          solutionSteps: solutionSteps
        },
        visualEngine: {
          componentToRender: hideVisual ? "NONE" : "NUMBER_CARDS",
          componentData: { items: nums, hideVisual: hideVisual }
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: "greatest_4", hideVisual: hideVisual }
    };
  }

  if (activeVariant === 'standard_smallest_four') {
    const nums = [];
    while(nums.length < 4) {
      const n = Math.floor(Math.random() * 80) + 10;
      if (!nums.includes(n)) nums.push(n);
    }
    const answer = String(Math.min(...nums));
    let options = null;
    let defectMap = null;
    if (isMCQ) {
      options = Array.from(new Set(nums.map(String))).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {};
      options.forEach(opt => { if (opt !== answer) defectMap[opt] = "CONCEPTUAL_ERROR"; });
    }
    const hint = getQText(`Compare the tens digits of all cards. Which one is the smallest?`, `Look for the least tens.`);

    const questionText = getQText(`Which is the smallest number among the cards?`, `Which is the smallest: ${nums.join(', ')}?`);
    const solutionSteps = getQText(`Comparing all four numbers, ${answer} has the lowest value.`, `${answer} is the smallest.`);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a smallest_four question. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. DO NOT change the "visualEngine" component or "solutionSteps". Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Smallest of Four\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: hint,
          finalAnswer: answer,
          solutionSteps: solutionSteps
        },
        visualEngine: {
          componentToRender: hideVisual ? "NONE" : "NUMBER_CARDS",
          componentData: { items: nums, hideVisual: hideVisual }
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: "smallest_4", hideVisual: hideVisual }
    };
  }

  if (activeVariant === 'standard_ten_more_compare') {
    const amount = Math.floor(Math.random() * 10) + 1; // Variable < 11 (1 to 10)
    const base = Math.floor(Math.random() * 50) + 10;
    const changedVal = base + amount;
    const compareVal = changedVal + (Math.random() > 0.5 ? 2 : -2);

    const askGreater = Math.random() > 0.5;
    const targetWord = askGreater ? "greater" : "smaller";
    const answer = askGreater ? String(Math.max(changedVal, compareVal)) : String(Math.min(changedVal, compareVal));

    let mcqOptions = 'null';
    let defectMapJSON = 'null';
    if (isMCQ) {
      const wrongOpAnswer = String(Math.max(changedVal, compareVal) === parseInt(answer) ? Math.min(changedVal, compareVal) : Math.max(changedVal, compareVal));
      let options = Array.from(new Set([String(changedVal), String(compareVal), String(base), String(changedVal + 5)])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      
      const defectMap = {
        [String(base)]: "CONSTANT_VIOLATION",
        [wrongOpAnswer]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
      defectMapJSON = JSON.stringify(defectMap);
    }
    const questionTextTemplate = getQText(`Which is ${targetWord}: ${amount} more than ${base} or ${compareVal}?`, `Which is ${targetWord}: ${amount} more than ${base} or ${compareVal}?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use a local name (e.g. Siti, Muthu, Ali) instead of generic names like Sam.`;

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a compare question. DO NOT rewrite "questionText" into a story unless replacing the [STORY] placeholder. DO NOT change the "visualEngine" component or "solutionSteps". Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.
      ${formatInstructions}
      ${storyInstruction}

      CRITICAL: This is a text-only conceptual comparison. Do NOT include a "visualEngine" block with blocks or icons. No icon rendering is allowed.

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapJSON},
          "hint": "Find what ${amount} more than ${base} is first.",
          "finalAnswer": "${answer}",
          "solutionSteps": "1. Find ${amount} more than ${base}: ${base} + ${amount} = ${changedVal}.\\n2. Compare ${changedVal} and ${compareVal}.\\n3. The ${targetWord} number is ${answer}."
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${inputType}" }
      }`,
      metadata: { difficulty, steps: 2, logic: "amount_more_compare", hideVisual: true }
    };
  }

  if (activeVariant === 'standard_ten_less_compare') {
    const amount = Math.floor(Math.random() * 10) + 1; // Variable < 11 (1 to 10)
    const base = Math.floor(Math.random() * 50) + 20;
    const changedVal = base - amount;
    const compareVal = changedVal + (Math.random() > 0.5 ? 2 : -2);

    const askGreater = Math.random() > 0.5;
    const targetWord = askGreater ? "greater" : "smaller";
    const answer = askGreater ? String(Math.max(changedVal, compareVal)) : String(Math.min(changedVal, compareVal));

    let mcqOptions = 'null';
    let defectMapJSON = 'null';
    if (isMCQ) {
      const wrongOpAnswer = String(Math.max(changedVal, compareVal) === parseInt(answer) ? Math.min(changedVal, compareVal) : Math.max(changedVal, compareVal));
      let options = Array.from(new Set([String(changedVal), String(compareVal), String(base), String(changedVal - 5)])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      
      const defectMap = {
        [String(base)]: "CONSTANT_VIOLATION",
        [wrongOpAnswer]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
      defectMapJSON = JSON.stringify(defectMap);
    }
    const questionTextTemplate = getQText(`Which is ${targetWord}: ${amount} less than ${base} or ${compareVal}?`, `Which is ${targetWord}: ${amount} less than ${base} or ${compareVal}?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use a local name (e.g. Siti, Muthu, Ali) instead of generic names like Sam.`;

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a compare question. DO NOT rewrite "questionText" into a story unless replacing the [STORY] placeholder. DO NOT change the "visualEngine" component or "solutionSteps". Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.
      ${formatInstructions}
      ${storyInstruction}

      CRITICAL: This is a text-only conceptual comparison. Do NOT include a "visualEngine" block with blocks or icons. No icon rendering is allowed.

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapJSON},
          "hint": "Find what ${amount} less than ${base} is first.",
          "finalAnswer": "${answer}",
          "solutionSteps": "1. Find ${amount} less than ${base}: ${base} - ${amount} = ${changedVal}.\\n2. Compare ${changedVal} and ${compareVal}.\\n3. The ${targetWord} number is ${answer}."
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${inputType}" }
      }`,
      metadata: { difficulty, steps: 2, logic: "amount_less_compare", hideVisual: true }
    };
  }
}