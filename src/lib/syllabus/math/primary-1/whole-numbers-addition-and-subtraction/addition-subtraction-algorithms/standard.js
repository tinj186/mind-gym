export const standardLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, getQText) => {

  const commonMeta = {
    zodType,
    difficulty: zodDiff,
    level,
    topic
  };

  const inputType = isStructure ? 'MULTI_STEP_INPUT' : (isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT');

  // Helper to generate REGROUPING addition
  const generateRegroupAdd = (tens1Max, tens2Max) => {
    let tens1 = 0, ones1 = 0, tens2 = 0, ones2 = 0;
    while (true) {
      tens1 = tens1Max > 0 ? Math.floor(Math.random() * tens1Max) + 1 : 0;
      ones1 = Math.floor(Math.random() * 8) + 2; // 2 to 9
      tens2 = tens2Max > 0 ? Math.floor(Math.random() * tens2Max) + 1 : 0;
      ones2 = Math.floor(Math.random() * 8) + 2; // 2 to 9
      
      // Must require regrouping
      if (ones1 + ones2 < 10) continue;
      
      // Keep sum within 100 for P1
      if (tens1 + tens2 + 1 > 9) continue;
      
      const num1 = tens1 * 10 + ones1;
      const num2 = tens2 * 10 + ones2;
      
      return { num1, num2, tens1, ones1, tens2, ones2, sum: num1 + num2 };
    }
  };

  // Helper to generate REGROUPING subtraction (num1 - num2)
  const generateRegroupSub = (tens1Max, tens2Max) => {
    let tens1 = 0, ones1 = 0, tens2 = 0, ones2 = 0;
    while (true) {
      tens1 = Math.floor(Math.random() * (tens1Max - 1)) + 1; // At least 1 ten
      ones1 = Math.floor(Math.random() * 8); // 0 to 7
      tens2 = Math.floor(Math.random() * (tens2Max + 1));
      ones2 = Math.floor(Math.random() * 8) + 2; // 2 to 9
      
      // Must require regrouping
      if (ones1 >= ones2) continue;
      // num1 must be > num2
      if (tens1 <= tens2) continue;
      
      const num1 = tens1 * 10 + ones1;
      const num2 = tens2 * 10 + ones2;
      
      return { num1, num2, tens1, ones1, tens2, ones2, diff: num1 - num2 };
    }
  };

  const getOptions = (correctAnswer, isAddition, num1, num2) => {
    if (!isMCQ) return null;
    let opts = [String(correctAnswer)];
    // Distractors
    opts.push(String(isAddition ? correctAnswer - 10 : correctAnswer + 10)); // forgot to regroup tens
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
        } else if (opt === String(isAddition ? correctAnswer - 10 : correctAnswer + 10)) {
          map[opt] = "REGROUPING_ERROR";
        } else {
          map[opt] = "CARELESS_CALCULATION";
        }
      }
    });
    return map;
  };

  // 1. standard_algo_add_2digit_1digit_regroup
  if (activeVariant === 'standard_algo_add_2digit_1digit_regroup') {
    const { num1, num2, sum } = generateRegroupAdd(8, 0); // num2 has max 0 tens
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
          hint: "Add the ones. Since it is 10 or more, carry over 1 ten.",
          finalAnswer: String(sum),
          solutionSteps: `1. Add the ones: ${n1 % 10} + ${n2 % 10} = ${(n1 % 10) + (n2 % 10)}.\\n2. Regroup 10 ones into 1 ten. We have ${(n1 % 10 + n2 % 10) % 10} ones left.\\n3. Add the tens: ${Math.floor(n1 / 10)} + 1 (carried over) = ${Math.floor(n1 / 10) + 1} tens.\\n4. The answer is ${sum}.`
        },
        visualEngine: { componentToRender: "VERTICAL_ALGORITHM", componentData: { items: [String(n1), "+", String(n2)] } },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: false }
    };
  }

  // 2. standard_algo_add_2digit_2digit_regroup
  if (activeVariant === 'standard_algo_add_2digit_2digit_regroup') {
    const { num1, num2, sum } = generateRegroupAdd(8, 8);
    let n1 = num1;
    let n2 = num2;
    // ensure sum < 100
    if (n1 + n2 > 99) {
      if (n1 > 50) n1 -= 40;
      else n2 -= 40;
    }
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
          hint: "Add the ones. Since it is 10 or more, regroup and carry over 1 ten.",
          finalAnswer: String(finalSum),
          solutionSteps: `1. Add the ones: ${n1 % 10} + ${n2 % 10} = ${(n1 % 10) + (n2 % 10)}.\\n2. Regroup 10 ones into 1 ten. Carry it over.\\n3. Add the tens: ${Math.floor(n1 / 10)} + ${Math.floor(n2 / 10)} + 1 (carried) = ${Math.floor(n1 / 10) + Math.floor(n2 / 10) + 1} tens.\\n4. The answer is ${finalSum}.`
        },
        visualEngine: { componentToRender: "VERTICAL_ALGORITHM", componentData: { items: [String(n1), "+", String(n2)] } },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: false }
    };
  }

  // 3. standard_algo_sub_2digit_1digit_regroup
  if (activeVariant === 'standard_algo_sub_2digit_1digit_regroup') {
    const { num1, num2, diff } = generateRegroupSub(9, 0);
    
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
          hint: "You cannot subtract a bigger number from a smaller number. Borrow 1 ten from the tens place.",
          finalAnswer: String(diff),
          solutionSteps: `1. Subtract the ones: ${num1 % 10} is smaller than ${num2 % 10}.\\n2. Borrow 1 ten. Now you have ${num1 % 10 + 10} ones.\\n3. ${num1 % 10 + 10} - ${num2 % 10} = ${(num1 % 10 + 10) - (num2 % 10)} ones.\\n4. The tens place is now ${Math.floor(num1 / 10) - 1}. Bring it down.\\n5. The answer is ${diff}.`
        },
        visualEngine: { componentToRender: "VERTICAL_ALGORITHM", componentData: { items: [String(num1), "-", String(num2)] } },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: false }
    };
  }

  // 4. standard_algo_sub_2digit_2digit_regroup
  if (activeVariant === 'standard_algo_sub_2digit_2digit_regroup') {
    let { num1, num2, diff } = generateRegroupSub(9, 8);
    // ensure both are 2 digits
    if (num2 < 10) {
      num2 += 10;
      if (num1 <= num2) num1 += 20;
    }
    const finalDiff = num1 - num2;
    
    const questionTextRaw = `Look at the subtraction working. What is the answer?`;
    const questionTextShort = `Solve:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const options = getOptions(finalDiff, false, num1, num2);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${finalDiff}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: generateDefectMap(options, finalDiff, false, num1, num2),
          hint: "Borrow 1 ten from the tens place before subtracting the ones.",
          finalAnswer: String(finalDiff),
          solutionSteps: `1. Subtract the ones: Borrow 1 ten. ${num1 % 10 + 10} - ${num2 % 10} = ${(num1 % 10 + 10) - (num2 % 10)} ones.\\n2. Subtract the tens: ${Math.floor(num1 / 10) - 1} (after borrowing) - ${Math.floor(num2 / 10)} = ${(Math.floor(num1 / 10) - 1) - Math.floor(num2 / 10)} tens.\\n3. The answer is ${finalDiff}.`
        },
        visualEngine: { componentToRender: "VERTICAL_ALGORITHM", componentData: { items: [String(num1), "-", String(num2)] } },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: false }
    };
  }

  // 5. standard_algo_sub_from_tens
  if (activeVariant === 'standard_algo_sub_from_tens') {
    const tens = Math.floor(Math.random() * 6) + 4; // 40 to 90
    const num1 = tens * 10;
    const num2 = Math.floor(Math.random() * (num1 - 10)) + 5; // e.g. 5 to num1-10
    // ensure ones of num2 is not 0
    const safeNum2 = num2 % 10 === 0 ? num2 + 2 : num2;
    const diff = num1 - safeNum2;
    
    const questionTextRaw = `Look at the subtraction working. What is the answer?`;
    const questionTextShort = `Solve:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const options = getOptions(diff, false, num1, safeNum2);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${diff}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: generateDefectMap(options, diff, false, num1, safeNum2),
          hint: "You have 0 ones, so you must borrow 1 ten from the tens place.",
          finalAnswer: String(diff),
          solutionSteps: `1. Subtract the ones: You have 0 ones. Borrow 1 ten. 10 - ${safeNum2 % 10} = ${10 - (safeNum2 % 10)} ones.\\n2. Subtract the tens: ${tens - 1} (after borrowing) - ${Math.floor(safeNum2 / 10)} = ${(tens - 1) - Math.floor(safeNum2 / 10)} tens.\\n3. The answer is ${diff}.`
        },
        visualEngine: { componentToRender: "VERTICAL_ALGORITHM", componentData: { items: [String(num1), "-", String(safeNum2)] } },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: false }
    };
  }

  // Fallback
  return {
    aiPrompt: `Return standard placeholder JSON.`,
    metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: true }
  };
};
