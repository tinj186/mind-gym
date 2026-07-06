export const advancedLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, getQText) => {

  const commonMeta = {
    zodType,
    difficulty: zodDiff,
    level,
    topic
  };

  const inputType = isStructure ? 'MULTI_STEP_INPUT' : (isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT');

  const getOptions = (correctAnswer) => {
    if (!isMCQ) return null;
    let opts = [String(correctAnswer)];
    while(opts.length < 4) {
      opts.push(String(Math.floor(Math.random() * 10)));
      opts = [...new Set(opts)];
    }
    return opts.slice(0, 4).sort(() => Math.random() - 0.5);
  };

  const generateDefectMap = (options, correctAnswer) => {
    if (!isMCQ) return null;
    const map = {};
    options.forEach(opt => {
      if (opt !== String(correctAnswer)) {
        map[opt] = "CALCULATION_ERROR";
      }
    });
    return map;
  };

  // 1. advanced_algo_missing_addend_digit
  if (activeVariant === 'advanced_algo_missing_addend_digit') {
    // Equation: AB + CD = EF (we mask one digit in AB or CD)
    const num1 = Math.floor(Math.random() * 40) + 10;
    const num2 = Math.floor(Math.random() * 40) + 10;
    const sum = num1 + num2;
    
    // Pick which digit to hide: 0 = num1 tens, 1 = num1 ones, 2 = num2 tens, 3 = num2 ones
    const hideTarget = Math.floor(Math.random() * 4);
    let str1 = String(num1);
    let str2 = String(num2);
    let answer = 0;
    
    if (hideTarget === 0) { answer = parseInt(str1[0]); str1 = "?" + str1[1]; }
    else if (hideTarget === 1) { answer = parseInt(str1[1]); str1 = str1[0] + "?"; }
    else if (hideTarget === 2) { answer = parseInt(str2[0]); str2 = "?" + str2[1]; }
    else { answer = parseInt(str2[1]); str2 = str2[0] + "?"; }

    const questionTextRaw = `Find the missing digit in the addition working.`;
    const questionTextShort = `Find the missing digit (?):`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const options = getOptions(answer);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: generateDefectMap(options, answer),
          hint: "Work backwards using subtraction, or think about what number adds up to the total.",
          finalAnswer: String(answer),
          solutionSteps: `1. The addition is ${num1} + ${num2} = ${sum}.\\n2. The missing digit is ${answer}.`
        },
        visualEngine: { componentToRender: "VERTICAL_ALGORITHM", componentData: { items: [str1, "+", str2, String(sum)] } },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: false }
    };
  }

  // 2. advanced_algo_missing_sum_digit
  if (activeVariant === 'advanced_algo_missing_sum_digit') {
    const num1 = Math.floor(Math.random() * 40) + 10;
    const num2 = Math.floor(Math.random() * 40) + 10;
    const sum = num1 + num2;
    
    // Pick which digit to hide: 0 = sum tens, 1 = sum ones
    const hideTarget = Math.floor(Math.random() * 2);
    let strSum = String(sum);
    let answer = 0;
    
    if (hideTarget === 0) { answer = parseInt(strSum[0]); strSum = "?" + strSum[1]; }
    else { answer = parseInt(strSum[1]); strSum = strSum[0] + "?"; }

    const questionTextRaw = `Find the missing digit in the addition working.`;
    const questionTextShort = `Find the missing digit (?):`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const options = getOptions(answer);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: generateDefectMap(options, answer),
          hint: "Perform the addition normally to find the missing digit in the answer.",
          finalAnswer: String(answer),
          solutionSteps: `1. Add the numbers normally: ${num1} + ${num2} = ${sum}.\\n2. The missing digit in the answer is ${answer}.`
        },
        visualEngine: { componentToRender: "VERTICAL_ALGORITHM", componentData: { items: [String(num1), "+", String(num2), strSum] } },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: false }
    };
  }

  // 3. advanced_algo_missing_minuend_digit
  if (activeVariant === 'advanced_algo_missing_minuend_digit') {
    const num1 = Math.floor(Math.random() * 40) + 50; // 50 to 89
    const num2 = Math.floor(Math.random() * 30) + 10; // 10 to 39
    const diff = num1 - num2;
    
    // Pick which digit to hide in num1 (minuend)
    const hideTarget = Math.floor(Math.random() * 2);
    let str1 = String(num1);
    let answer = 0;
    
    if (hideTarget === 0) { answer = parseInt(str1[0]); str1 = "?" + str1[1]; }
    else { answer = parseInt(str1[1]); str1 = str1[0] + "?"; }

    const questionTextRaw = `Find the missing digit in the subtraction working.`;
    const questionTextShort = `Find the missing digit (?):`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const options = getOptions(answer);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: generateDefectMap(options, answer),
          hint: "Work backwards by adding the answer to the number being subtracted.",
          finalAnswer: String(answer),
          solutionSteps: `1. The subtraction is ${num1} - ${num2} = ${diff}.\\n2. The missing digit is ${answer}.`
        },
        visualEngine: { componentToRender: "VERTICAL_ALGORITHM", componentData: { items: [str1, "-", String(num2), String(diff)] } },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: false }
    };
  }

  // 4. advanced_algo_missing_subtrahend_digit
  if (activeVariant === 'advanced_algo_missing_subtrahend_digit') {
    const num1 = Math.floor(Math.random() * 40) + 50; // 50 to 89
    const num2 = Math.floor(Math.random() * 30) + 10; // 10 to 39
    const diff = num1 - num2;
    
    // Pick which digit to hide in num2 (subtrahend)
    const hideTarget = Math.floor(Math.random() * 2);
    let str2 = String(num2);
    let answer = 0;
    
    if (hideTarget === 0) { answer = parseInt(str2[0]); str2 = "?" + str2[1]; }
    else { answer = parseInt(str2[1]); str2 = str2[0] + "?"; }

    const questionTextRaw = `Find the missing digit in the subtraction working.`;
    const questionTextShort = `Find the missing digit (?):`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const options = getOptions(answer);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: generateDefectMap(options, answer),
          hint: "Subtract the final answer from the top number.",
          finalAnswer: String(answer),
          solutionSteps: `1. The subtraction is ${num1} - ${num2} = ${diff}.\\n2. The missing digit is ${answer}.`
        },
        visualEngine: { componentToRender: "VERTICAL_ALGORITHM", componentData: { items: [String(num1), "-", str2, String(diff)] } },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: false }
    };
  }

  // 5. advanced_algo_missing_mixed
  if (activeVariant === 'advanced_algo_missing_mixed') {
    // Generate an addition with two missing digits, but ask for one of them specifically, or just return both as a string.
    // Actually, since this is Primary 1, finding a missing digit in the ones place of top number and tens place of bottom number is good.
    // Let's ask for the sum of the two missing digits, to keep the final answer a single number!
    const num1 = Math.floor(Math.random() * 40) + 10; // 10 to 49
    const num2 = Math.floor(Math.random() * 40) + 10; // 10 to 49
    const sum = num1 + num2;
    
    let str1 = String(num1);
    let str2 = String(num2);
    
    const missingA = parseInt(str1[1]); // ones place
    const missingB = parseInt(str2[0]); // tens place
    str1 = str1[0] + "?";
    str2 = "?" + str2[1];
    
    const finalAnswer = missingA + missingB;
    
    const questionTextRaw = `Find the two missing digits (?) and add them together.`;
    const questionTextShort = `Find the two missing digits (?) and add them together:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    // Options will be sums (0-18)
    const options = getOptions(finalAnswer);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${finalAnswer}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: generateDefectMap(options, finalAnswer),
          hint: "Solve for each ? one by one, then add them up.",
          finalAnswer: String(finalAnswer),
          solutionSteps: `1. The ones place: ${str1[0]}? + ?${str2[1]} = ${sum}. The missing ones digit is ${missingA}.\\n2. The missing tens digit is ${missingB}.\\n3. Their sum is ${missingA} + ${missingB} = ${finalAnswer}.`
        },
        visualEngine: { componentToRender: "VERTICAL_ALGORITHM", componentData: { items: [str1, "+", str2, String(sum)] } },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: false }
    };
  }

  // Fallback
  return {
    aiPrompt: `Return standard placeholder JSON.`,
    metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: true }
  };
};
