export const foundationLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, getQText) => {

  const commonMeta = {
    zodType,
    difficulty: zodDiff,
    level,
    topic
  };

  const inputType = isStructure ? 'MULTI_STEP_INPUT' : (isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT');

  // Helper to generate NO REGROUPING addition
  const generateNoRegroupAdd = (tens1Max, ones1Max, tens2Max, ones2Max) => {
    let tens1 = 0, ones1 = 0, tens2 = 0, ones2 = 0;
    while (true) {
      tens1 = Math.floor(Math.random() * (tens1Max + 1));
      ones1 = Math.floor(Math.random() * (ones1Max + 1));
      tens2 = Math.floor(Math.random() * (tens2Max + 1));
      ones2 = Math.floor(Math.random() * (ones2Max + 1));
      
      if (tens1 + tens2 > 9 || tens1 + tens2 === 0) continue; 
      if (ones1 + ones2 > 9) continue;
      
      const num1 = tens1 * 10 + ones1;
      const num2 = tens2 * 10 + ones2;
      
      // Prevent trivial 0 + x
      if (num1 === 0 || num2 === 0) continue;
      
      return { num1, num2, tens1, ones1, tens2, ones2, sum: num1 + num2 };
    }
  };

  // Helper to generate NO REGROUPING subtraction (num1 - num2)
  const generateNoRegroupSub = (tens1Max, ones1Max, tens2Max, ones2Max) => {
    let tens1 = 0, ones1 = 0, tens2 = 0, ones2 = 0;
    while (true) {
      tens1 = Math.floor(Math.random() * (tens1Max + 1));
      ones1 = Math.floor(Math.random() * (ones1Max + 1));
      tens2 = Math.floor(Math.random() * (tens2Max + 1));
      ones2 = Math.floor(Math.random() * (ones2Max + 1));
      
      // Must not require regrouping and num1 > num2
      if (tens1 < tens2 || ones1 < ones2) continue;
      
      const num1 = tens1 * 10 + ones1;
      const num2 = tens2 * 10 + ones2;
      
      // Prevent trivial x - 0 or x - x
      if (num2 === 0 || num1 === num2) continue;
      
      return { num1, num2, tens1, ones1, tens2, ones2, diff: num1 - num2 };
    }
  };

  const getOptions = (correctAnswer, isAddition, num1, num2) => {
    if (!isMCQ) return null;
    let opts = [String(correctAnswer)];
    // Distractors
    opts.push(String(isAddition ? correctAnswer + 10 : Math.max(0, correctAnswer - 10)));
    opts.push(String(isAddition ? correctAnswer - 1 : correctAnswer + 1));
    opts.push(String(isAddition ? Math.abs(num1 - num2) : num1 + num2)); 
    
    // Ensure all are positive and unique
    opts = [...new Set(opts.filter(opt => parseInt(opt) >= 0))];
    
    while(opts.length < 4) {
      opts.push(String(correctAnswer + Math.floor(Math.random() * 5) + 1));
      opts = [...new Set(opts)];
    }
    
    return opts.slice(0, 4).sort(() => Math.random() - 0.5);
  };

  const generateDefectMap = (options, correctAnswer, isAddition, num1, num2) => {
    if (!isMCQ) return null;
    const map = {};
    options.forEach(opt => {
      if (opt !== String(correctAnswer)) {
        if (opt === String(isAddition ? Math.abs(num1 - num2) : num1 + num2)) {
          map[opt] = "CONFUSED_OPERATION";
        } else {
          map[opt] = "CARELESS_CALCULATION";
        }
      }
    });
    return map;
  };

  // 1. foundation_algo_add_2digit_1digit_no_regroup
  if (activeVariant === 'foundation_algo_add_2digit_1digit_no_regroup') {
    const { num1, num2, sum } = generateNoRegroupAdd(8, 8, 0, 8);
    const n1 = Math.max(num1, num2);
    const n2 = Math.min(num1, num2); // n2 is 1-digit
    
    const questionTextRaw = `Look at the addition working. What is the answer?`;
    const questionTextShort = `Solve:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const options = getOptions(sum, true, n1, n2);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${sum}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: generateDefectMap(options, sum, true, n1, n2),
          hint: "Add the ones first, then bring down the tens.",
          finalAnswer: String(sum),
          solutionSteps: `1. Add the ones: ${n1 % 10} + ${n2 % 10} = ${(n1 % 10) + (n2 % 10)}.\\n2. Bring down the tens: ${Math.floor(n1 / 10)} tens.\\n3. The answer is ${sum}.`
        },
        visualEngine: { componentToRender: "VERTICAL_ALGORITHM", componentData: { items: [String(n1), "+", String(n2)] } },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: false }
    };
  }

  // 2. foundation_algo_add_2digit_2digit_no_regroup
  if (activeVariant === 'foundation_algo_add_2digit_2digit_no_regroup') {
    const { num1, num2, sum } = generateNoRegroupAdd(8, 8, 8, 8);
    // ensure both are 2 digits
    const n1 = num1 < 10 ? num1 + 10 : num1;
    const n2 = num2 < 10 ? num2 + 10 : (num1 + num2 > 99 ? num2 - 10 : num2);
    const finalSum = n1 + n2;
    
    const questionTextRaw = `Look at the addition working. What is the answer?`;
    const questionTextShort = `Solve:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const options = getOptions(finalSum, true, n1, n2);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${finalSum}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: generateDefectMap(options, finalSum, true, n1, n2),
          hint: "Add the ones first, then add the tens.",
          finalAnswer: String(finalSum),
          solutionSteps: `1. Add the ones: ${n1 % 10} + ${n2 % 10} = ${(n1 % 10) + (n2 % 10)}.\\n2. Add the tens: ${Math.floor(n1 / 10)} + ${Math.floor(n2 / 10)} = ${Math.floor(n1 / 10) + Math.floor(n2 / 10)} tens.\\n3. The answer is ${finalSum}.`
        },
        visualEngine: { componentToRender: "VERTICAL_ALGORITHM", componentData: { items: [String(n1), "+", String(n2)] } },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: false }
    };
  }

  // 3. foundation_algo_sub_2digit_1digit_no_regroup
  if (activeVariant === 'foundation_algo_sub_2digit_1digit_no_regroup') {
    const { num1, num2, diff } = generateNoRegroupSub(9, 9, 0, 9);
    
    const questionTextRaw = `Look at the subtraction working. What is the answer?`;
    const questionTextShort = `Solve:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const options = getOptions(diff, false, num1, num2);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${diff}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: generateDefectMap(options, diff, false, num1, num2),
          hint: "Subtract the ones first, then bring down the tens.",
          finalAnswer: String(diff),
          solutionSteps: `1. Subtract the ones: ${num1 % 10} - ${num2 % 10} = ${(num1 % 10) - (num2 % 10)}.\\n2. Bring down the tens: ${Math.floor(num1 / 10)} tens.\\n3. The answer is ${diff}.`
        },
        visualEngine: { componentToRender: "VERTICAL_ALGORITHM", componentData: { items: [String(num1), "-", String(num2)] } },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: false }
    };
  }

  // 4. foundation_algo_sub_2digit_2digit_no_regroup
  if (activeVariant === 'foundation_algo_sub_2digit_2digit_no_regroup') {
    const { num1, num2, diff } = generateNoRegroupSub(9, 9, 9, 9);
    const n1 = num1 < 10 ? num1 + 10 : num1;
    const n2 = num2 < 10 ? num2 + 10 : num2;
    // ensure no regrouping is violated by our fix
    let safeN1 = n1;
    let safeN2 = n2;
    if (safeN1 % 10 < safeN2 % 10) {
      safeN1 += 10;
      safeN2 = Math.max(10, safeN2 - 10);
    }
    const finalDiff = safeN1 - safeN2;
    
    const questionTextRaw = `Look at the subtraction working. What is the answer?`;
    const questionTextShort = `Solve:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const options = getOptions(finalDiff, false, safeN1, safeN2);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${finalDiff}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: generateDefectMap(options, finalDiff, false, safeN1, safeN2),
          hint: "Subtract the ones first, then subtract the tens.",
          finalAnswer: String(finalDiff),
          solutionSteps: `1. Subtract the ones: ${safeN1 % 10} - ${safeN2 % 10} = ${(safeN1 % 10) - (safeN2 % 10)}.\\n2. Subtract the tens: ${Math.floor(safeN1 / 10)} - ${Math.floor(safeN2 / 10)} = ${Math.floor(safeN1 / 10) - Math.floor(safeN2 / 10)} tens.\\n3. The answer is ${finalDiff}.`
        },
        visualEngine: { componentToRender: "VERTICAL_ALGORITHM", componentData: { items: [String(safeN1), "-", String(safeN2)] } },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: false }
    };
  }

  // 5. foundation_algo_add_tens
  if (activeVariant === 'foundation_algo_add_tens') {
    const { num1, num2, sum, tens1, tens2 } = generateNoRegroupAdd(9, 0, 9, 0);
    
    const questionTextRaw = `Look at the addition working. What is the answer?`;
    const questionTextShort = `Solve:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const options = getOptions(sum, true, num1, num2);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${sum}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: generateDefectMap(options, sum, true, num1, num2),
          hint: "Add the tens together.",
          finalAnswer: String(sum),
          solutionSteps: `1. The numbers are ${num1} and ${num2}.\\n2. Add the tens: ${tens1} + ${tens2} = ${tens1 + tens2} tens.\\n3. The answer is ${sum}.`
        },
        visualEngine: { componentToRender: "VERTICAL_ALGORITHM", componentData: { items: [String(num1), "+", String(num2)] } },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: false }
    };
  }

  // Fallback
  return {
    aiPrompt: `Return standard placeholder JSON.`,
    metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
  };
};
