export const standardLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, getQText) => {

  const commonMeta = {
    zodType,
    difficulty: zodDiff,
    level,
    topic
  };

  const inputType = isStructure ? 'MULTI_STEP_INPUT' : (isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT');

  const getOptions = (correctAnswer, isAddition, num1, num2) => {
    if (!isMCQ) return null;
    let opts = [String(correctAnswer)];
    // Distractors
    opts.push(String(isAddition ? correctAnswer - 10 : correctAnswer + 10)); 
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
          map[opt] = "CALCULATION_ERROR";
        }
      }
    });
    return map;
  };

  // 1. standard_mental_add_2digit_1digit_regroup
  if (activeVariant === 'standard_mental_add_2digit_1digit_regroup') {
    // Generate 2-digit number and 1-digit number that regroup
    let tens = Math.floor(Math.random() * 8) + 1; // 1 to 8
    let ones1 = Math.floor(Math.random() * 8) + 2; // 2 to 9
    let ones2 = Math.floor(Math.random() * 8) + 2; // 2 to 9
    while (ones1 + ones2 < 10) {
      ones2 = Math.floor(Math.random() * 8) + 2;
    }
    
    const num1 = tens * 10 + ones1;
    const num2 = ones2;
    const sum = num1 + num2;
    
    const questionTextRaw = `Calculate mentally: ${num1} + ${num2} = ?`;
    const questionTextShort = `Solve mentally: ${num1} + ${num2} = ?`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const options = getOptions(sum, true, num1, num2);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${sum}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: generateDefectMap(options, sum, true, num1, num2),
          hint: "Make a 10 first. How much more does the bigger number need to reach the next ten?",
          finalAnswer: String(sum),
          solutionSteps: `1. Break apart ${num2} to make ${num1} a ten.\\n2. ${num1} needs ${10 - ones1} to make ${tens * 10 + 10}.\\n3. ${num1} + ${10 - ones1} = ${tens * 10 + 10}. Then add the rest of ${num2}: ${tens * 10 + 10} + ${num2 - (10 - ones1)} = ${sum}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: { hideVisual: true } },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  // 2. standard_mental_sub_2digit_1digit_regroup
  if (activeVariant === 'standard_mental_sub_2digit_1digit_regroup') {
    let tens = Math.floor(Math.random() * 8) + 2; // 2 to 9
    let ones1 = Math.floor(Math.random() * 7) + 1; // 1 to 7
    let ones2 = Math.floor(Math.random() * (9 - ones1)) + ones1 + 1; // > ones1, up to 9
    
    const num1 = tens * 10 + ones1;
    const num2 = ones2;
    const diff = num1 - num2;
    
    const questionTextRaw = `Calculate mentally: ${num1} - ${num2} = ?`;
    const questionTextShort = `Solve mentally: ${num1} - ${num2} = ?`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const options = getOptions(diff, false, num1, num2);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${diff}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: generateDefectMap(options, diff, false, num1, num2),
          hint: "Subtract down to the nearest ten first, then subtract the rest.",
          finalAnswer: String(diff),
          solutionSteps: `1. Subtract ${ones1} to get to ${tens * 10}.\\n2. You still need to subtract ${num2 - ones1}.\\n3. ${tens * 10} - ${num2 - ones1} = ${diff}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: { hideVisual: true } },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  // 3. standard_mental_add_2digit_tens
  if (activeVariant === 'standard_mental_add_2digit_tens') {
    let num1 = Math.floor(Math.random() * 80) + 11; // 11 to 90
    if (num1 % 10 === 0) num1 += 5; // ensure it's not a multiple of 10
    
    const maxTensToAdd = 9 - Math.floor(num1 / 10);
    const tensToAdd = Math.floor(Math.random() * maxTensToAdd) + 1;
    const num2 = tensToAdd * 10;
    
    const sum = num1 + num2;
    
    const questionTextRaw = `Calculate mentally: ${num1} + ${num2} = ?`;
    const questionTextShort = `Solve mentally: ${num1} + ${num2} = ?`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const options = getOptions(sum, true, num1, num2);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${sum}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: generateDefectMap(options, sum, true, num1, num2),
          hint: "Add the tens. The ones digit stays the same.",
          finalAnswer: String(sum),
          solutionSteps: `1. ${num1} has ${Math.floor(num1 / 10)} tens and ${num1 % 10} ones.\\n2. ${num2} is ${tensToAdd} tens.\\n3. ${Math.floor(num1 / 10)} tens + ${tensToAdd} tens = ${Math.floor(num1 / 10) + tensToAdd} tens.\\n4. The answer is ${sum}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: { hideVisual: true } },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  // 4. standard_mental_sub_2digit_tens
  if (activeVariant === 'standard_mental_sub_2digit_tens') {
    let num1 = Math.floor(Math.random() * 70) + 31; // 31 to 100
    if (num1 % 10 === 0) num1 += 5;
    
    const maxTensToSub = Math.floor(num1 / 10) - 1;
    const tensToSub = Math.floor(Math.random() * maxTensToSub) + 1;
    const num2 = tensToSub * 10;
    
    const diff = num1 - num2;
    
    const questionTextRaw = `Calculate mentally: ${num1} - ${num2} = ?`;
    const questionTextShort = `Solve mentally: ${num1} - ${num2} = ?`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const options = getOptions(diff, false, num1, num2);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${diff}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: generateDefectMap(options, diff, false, num1, num2),
          hint: "Subtract the tens. The ones digit stays the same.",
          finalAnswer: String(diff),
          solutionSteps: `1. ${num1} has ${Math.floor(num1 / 10)} tens and ${num1 % 10} ones.\\n2. Subtract ${tensToSub} tens.\\n3. ${Math.floor(num1 / 10)} tens - ${tensToSub} tens = ${Math.floor(num1 / 10) - tensToSub} tens.\\n4. The answer is ${diff}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: { hideVisual: true } },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  // 5. standard_mental_add_near_tens
  if (activeVariant === 'standard_mental_add_near_tens') {
    // Adding 9 or 8
    const num2 = Math.random() > 0.5 ? 9 : 8;
    const comp = 10 - num2;
    const num1 = Math.floor(Math.random() * 70) + 12; // 12 to 81
    const sum = num1 + num2;
    
    const questionTextRaw = `Calculate mentally: ${num1} + ${num2} = ?`;
    const questionTextShort = `Solve mentally: ${num1} + ${num2} = ?`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const options = getOptions(sum, true, num1, num2);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${sum}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: generateDefectMap(options, sum, true, num1, num2),
          hint: "Try adding 10 first, then compensate by subtracting the extra amount.",
          finalAnswer: String(sum),
          solutionSteps: `1. Adding ${num2} is like adding 10 and taking away ${comp}.\\n2. ${num1} + 10 = ${num1 + 10}.\\n3. ${num1 + 10} - ${comp} = ${sum}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: { hideVisual: true } },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  // Fallback
  return {
    aiPrompt: `Return standard placeholder JSON.`,
    metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
  };
};
