export const foundationLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, getQText) => {

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
    opts.push(String(isAddition ? correctAnswer - 2 : correctAnswer + 2)); 
    opts.push(String(isAddition ? correctAnswer + 1 : correctAnswer - 1));
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
          map[opt] = "CALCULATION_ERROR";
        }
      }
    });
    return map;
  };

  // 1. foundation_mental_add_within_10
  if (activeVariant === 'foundation_mental_add_within_10') {
    const num1 = Math.floor(Math.random() * 8) + 1; // 1 to 8
    const num2 = Math.floor(Math.random() * (9 - num1)) + 1; // 1 to 9-num1
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
          hint: "Count on from the bigger number.",
          finalAnswer: String(sum),
          solutionSteps: `1. The numbers are ${num1} and ${num2}.\\n2. Adding them gives ${sum}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: { hideVisual: true } },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  // 2. foundation_mental_add_within_20
  if (activeVariant === 'foundation_mental_add_within_20') {
    const sum = Math.floor(Math.random() * 9) + 11; // 11 to 19
    const num1 = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const num2 = sum - num1;
    
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
          hint: "Try making a 10 first. What do you need to add to the bigger number to make 10?",
          finalAnswer: String(sum),
          solutionSteps: `1. ${num1} + ${num2} can be solved by making a 10.\\n2. The sum is ${sum}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: { hideVisual: true } },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  // 3. foundation_mental_sub_within_10
  if (activeVariant === 'foundation_mental_sub_within_10') {
    const num1 = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const num2 = Math.floor(Math.random() * (num1 - 1)) + 1; // 1 to num1-1
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
          hint: "Count backwards from the first number.",
          finalAnswer: String(diff),
          solutionSteps: `1. Start at ${num1} and count back ${num2}.\\n2. The difference is ${diff}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: { hideVisual: true } },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  // 4. foundation_mental_sub_within_20
  if (activeVariant === 'foundation_mental_sub_within_20') {
    const num1 = Math.floor(Math.random() * 9) + 11; // 11 to 19
    const ones = num1 % 10;
    // No regrouping, so num2 must be <= ones
    const num2 = Math.floor(Math.random() * ones) + 1; // 1 to ones
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
          hint: "Subtract the ones first. Keep the tens the same.",
          finalAnswer: String(diff),
          solutionSteps: `1. Subtract the ones: ${ones} - ${num2} = ${ones - num2}.\\n2. Add back the 10: 10 + ${ones - num2} = ${diff}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: { hideVisual: true } },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  // 5. foundation_mental_add_tens
  if (activeVariant === 'foundation_mental_add_tens') {
    const num1 = (Math.floor(Math.random() * 4) + 1) * 10; // 10, 20, 30, 40
    const num2 = (Math.floor(Math.random() * 4) + 1) * 10; // 10, 20, 30, 40
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
          hint: "Add the tens together like you would add single numbers.",
          finalAnswer: String(sum),
          solutionSteps: `1. Think of ${num1} as ${num1/10} tens and ${num2} as ${num2/10} tens.\\n2. ${num1/10} tens + ${num2/10} tens = ${sum/10} tens.\\n3. The answer is ${sum}.`
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
