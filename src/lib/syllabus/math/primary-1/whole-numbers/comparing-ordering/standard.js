import { numberToWords } from '@/lib/utils/math-helpers';

export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, hideVisual) {
  const commonMeta = { level, topic, type: zodType, difficulty: zodDiff };
  const inputType = isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT';

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
    const options = isMCQ ? [answer, distractor1, distractor2, distractor3] : null;

    const questionText = getQText(`Arrange these number cards from ${targetWord}:`, `Arrange from ${targetWord}: ${nums.join(', ')}`);
    const solutionSteps = getQText(`Comparing the tens and ones, the correct order from ${targetWord} is ${answer}.`, answer);

    return {
      aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Ordering Numbers\n - Numbers: ${nums.join(', ')}\n - Final Answer MUST be exactly: "${answer}"\n OUTPUT FORMAT (Return ONLY valid JSON):\n ${JSON.stringify({ // Removed formatInstructions
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          finalAnswer: answer,
          solutionSteps: solutionSteps
        },
        visualEngine: {
          componentToRender: "NUMBER_CARDS",
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
    const options = isMCQ ? [String(d1), answer, String(d2), String(d3)] : null;

    const questionText = getQText(`Look at the number cards. Which number can replace the question mark so that the numbers are in order from smallest to greatest?`, `What number is between ${lower} and ${upper}?`);
    const explanation = isShort ? `${answer} is the only number between ${lower} and ${upper}.` : `${answer} is the only option that is larger than ${lower} and less than ${upper}.`;
    const solutionSteps = getQText(explanation, `${lower} < ${answer} < ${upper}`);

    return {
      aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Number Bounds\n - Final Answer MUST be: "${answer}"\n OUTPUT FORMAT (Return ONLY valid JSON):\n ${JSON.stringify({ // Removed formatInstructions
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          finalAnswer: answer,
          solutionSteps: solutionSteps
        },
        visualEngine: {
          componentToRender: "NUMBER_CARDS",
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
    const options = isMCQ ? [String(amounts[0]), String(amounts[1]), String(amounts[2]), String(distractor)] : null;

    const promptStart = `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Compare Word Problem\n - Amounts: ${amounts.join(', ')}\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n - Do NOT put emojis in the question text.`;
    const solutionSteps = getQText(`Comparing the amounts, the ${targetWord} amount is ${answer}.`, `${answer} is the ${targetWord}.`);

    return {
      aiPrompt: `${promptStart}\n ${formatInstructions}\n CRITICAL: RETURN THE FOLLOWING VALID JSON. FILL IN ALL [Placeholders] USING LOCALIZED THEMES:\n ${JSON.stringify({ // Keep formatInstructions for creative part, as AI generates text
        meta: commonMeta,
        content: {
          questionText: "[Insert full localized Singaporean word problem here]", // AI fills this
          options: options,
          finalAnswer: answer,
          solutionSteps: solutionSteps
        },
        visualEngine: {
          componentToRender: "COMPARE_OBJECTS",
          componentData: { sets: [ { label: "A", count: amounts[0], icon: selectedIcon }, { label: "B", count: amounts[1], icon: selectedIcon }, { label: "C", count: amounts[2], icon: selectedIcon } ] , hideVisual: hideVisual}
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: "compare_word", hideVisual: hideVisual }
    };
  }

  if (activeVariant === 'standard_missing_seq_asc') {
    const start = Math.floor(Math.random() * 70) + 10;
    const sequence = [start, start + 1, start + 2, start + 3];
    const missingIdx = Math.floor(Math.random() * 2) + 1;
    const answer = String(sequence[missingIdx]);
    const displaySeq = [...sequence];
    displaySeq[missingIdx] = "?";
    
    const options = isMCQ ? [String(sequence[missingIdx] - 1), answer, String(sequence[missingIdx] + 1), String(start + 10)] : null;

    const questionText = getQText(`Look at the number cards. What is the missing number in the pattern?`, `Find the missing number: ${displaySeq.join(', ')}`);
    const solutionSteps = getQText(`The numbers are increasing by 1. After ${sequence[missingIdx - 1]} comes ${answer}.`, `${sequence[missingIdx - 1]} + 1 = ${answer}`);

    return {
      aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Missing Number (Ascending)\n - Final Answer MUST be: "${answer}"\n OUTPUT FORMAT (Return ONLY valid JSON):\n ${JSON.stringify({ // Removed formatInstructions
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          finalAnswer: answer,
          solutionSteps: solutionSteps
        },
        visualEngine: {
          componentToRender: "NUMBER_CARDS",
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
    
    const options = isMCQ ? [String(sequence[missingIdx] + 1), answer, String(sequence[missingIdx] - 1), String(start - 10)] : null;

    const questionText = getQText(`Look at the number cards. What is the missing number in the pattern?`, `Find the missing number: ${displaySeq.join(', ')}`);
    const solutionSteps = getQText(`The numbers are decreasing by 1. Before ${sequence[missingIdx - 1]} comes ${answer}.`, `${sequence[missingIdx - 1]} - 1 = ${answer}`);

    return {
      aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Missing Number (Descending)\n - Final Answer MUST be: "${answer}"\n OUTPUT FORMAT (Return ONLY valid JSON):\n ${JSON.stringify({ // Removed formatInstructions
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          finalAnswer: answer,
          solutionSteps: solutionSteps
        },
        visualEngine: {
          componentToRender: "NUMBER_CARDS",
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
    const options = isMCQ ? nums.map(String) : null;

    const questionText = getQText(`Which is the greatest number among the cards?`, `Which is the greatest: ${nums.join(', ')}?`);
    const solutionSteps = getQText(`Comparing all four numbers, ${answer} has the highest value.`, `${answer} is the greatest.`);

    return {
      aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Greatest of Four\n - Final Answer MUST be: "${answer}"\n OUTPUT FORMAT (Return ONLY valid JSON):\n ${JSON.stringify({ // Removed formatInstructions
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          finalAnswer: answer,
          solutionSteps: solutionSteps
        },
        visualEngine: {
          componentToRender: "NUMBER_CARDS",
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
    const options = isMCQ ? nums.map(String) : null;

    const questionText = getQText(`Which is the smallest number among the cards?`, `Which is the smallest: ${nums.join(', ')}?`);
    const solutionSteps = getQText(`Comparing all four numbers, ${answer} has the lowest value.`, `${answer} is the smallest.`);

    return {
      aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Smallest of Four\n - Final Answer MUST be: "${answer}"\n OUTPUT FORMAT (Return ONLY valid JSON):\n ${JSON.stringify({ // Removed formatInstructions
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          finalAnswer: answer,
          solutionSteps: solutionSteps
        },
        visualEngine: {
          componentToRender: "NUMBER_CARDS",
          componentData: { items: nums, hideVisual: hideVisual }
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: "smallest_4", hideVisual: hideVisual }
    };
  }

  if (activeVariant === 'standard_ten_more_compare') {
    const base = Math.floor(Math.random() * 50) + 10;
    const compareVal = base + (Math.random() > 0.5 ? 12 : 8);
    const tenMore = base + 10;
    const askGreater = Math.random() > 0.5;
    const answer = askGreater ? String(Math.max(tenMore, compareVal)) : String(Math.min(tenMore, compareVal));
    const targetWord = askGreater ? "greater" : "smaller";
    
    const options = isMCQ ? [String(tenMore), String(compareVal), String(base), String(tenMore + 5)] : null;

    const questionText = getQText(`Which is ${targetWord}: 10 more than ${base} or ${compareVal}?`, `Which is ${targetWord}: 10 more than ${base} or ${compareVal}?`);
    const solutionSteps = getQText(`10 more than ${base} is ${tenMore}. Comparing ${tenMore} and ${compareVal}, the ${targetWord} is ${answer}.`, `${base} + 10 = ${tenMore}, compare ${tenMore} & ${compareVal}`);

    return {
      aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: 10 More Comparison\n - Final Answer MUST be: "${answer}"\n OUTPUT FORMAT (Return ONLY valid JSON):\n ${JSON.stringify({ // Removed formatInstructions
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          finalAnswer: answer,
          solutionSteps: solutionSteps
        },
        visualEngine: {
          componentToRender: "NUMBER_CARDS",
          componentData: { items: [`10 more than ${base}`, `${compareVal}`], hideVisual: hideVisual }
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: "ten_more_compare", hideVisual: hideVisual }
    };
  }

  if (activeVariant === 'standard_ten_less_compare') {
    const base = Math.floor(Math.random() * 50) + 20;
    const compareVal = base - (Math.random() > 0.5 ? 12 : 8);
    const tenLess = base - 10;
    const askGreater = Math.random() > 0.5;
    const answer = askGreater ? String(Math.max(tenLess, compareVal)) : String(Math.min(tenLess, compareVal));
    const targetWord = askGreater ? "greater" : "smaller";
    
    const options = isMCQ ? [String(tenLess), String(compareVal), String(base), String(tenLess - 5)] : null;

    const questionText = getQText(`Which is ${targetWord}: 10 less than ${base} or ${compareVal}?`, `Which is ${targetWord}: 10 less than ${base} or ${compareVal}?`);
    const solutionSteps = getQText(`10 less than ${base} is ${tenLess}. Comparing ${tenLess} and ${compareVal}, the ${targetWord} is ${answer}.`, `${base} - 10 = ${tenLess}, compare ${tenLess} & ${compareVal}`);

    return {
      aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: 10 Less Comparison\n - Final Answer MUST be: "${answer}"\n OUTPUT FORMAT (Return ONLY valid JSON):\n ${JSON.stringify({ // Removed formatInstructions
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          finalAnswer: answer,
          solutionSteps: solutionSteps
        },
        visualEngine: {
          componentToRender: "NUMBER_CARDS",
          componentData: { items: [`10 less than ${base}`, `${compareVal}`], hideVisual: hideVisual }
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: "ten_less_compare", hideVisual: hideVisual }
    };
  }
}