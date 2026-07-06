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
    
    // Distractors
    opts.push(String(correctAnswer - 10)); 
    opts.push(String(correctAnswer + 10));
    opts.push(String(correctAnswer - 1));
    opts.push(String(correctAnswer + 1));
    
    // Ensure all are positive and unique
    opts = [...new Set(opts.filter(opt => parseInt(opt) >= 0))];
    
    while(opts.length < 4) {
      opts.push(String(correctAnswer + Math.floor(Math.random() * 5) + 1));
      opts = [...new Set(opts)];
    }
    
    return opts.slice(0, 4).sort(() => Math.random() - 0.5);
  };

  const generateDefectMap = (options, correctAnswer) => {
    if (!isMCQ) return null;
    const map = {};
    options.forEach(opt => {
      if (opt !== String(correctAnswer)) {
        if (opt === String(correctAnswer - 10) || opt === String(correctAnswer + 10)) {
          map[opt] = "COMPENSATION_ERROR";
        } else {
          map[opt] = "CALCULATION_ERROR";
        }
      }
    });
    return map;
  };

  // 1. advanced_mental_sub_near_tens
  if (activeVariant === 'advanced_mental_sub_near_tens') {
    // Subtracting 9 or 8
    const num2 = Math.random() > 0.5 ? 9 : 8;
    const comp = 10 - num2;
    const num1 = Math.floor(Math.random() * 70) + 21; // 21 to 90
    const diff = num1 - num2;
    
    const questionTextRaw = `Calculate mentally: ${num1} - ${num2} = ?`;
    const questionTextShort = `Solve mentally: ${num1} - ${num2} = ?`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const options = getOptions(diff);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${diff}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: generateDefectMap(options, diff),
          hint: "Try subtracting 10 first, then compensate by adding the extra amount back.",
          finalAnswer: String(diff),
          solutionSteps: `1. Subtracting ${num2} is like subtracting 10 and adding back ${comp}.\\n2. ${num1} - 10 = ${num1 - 10}.\\n3. ${num1 - 10} + ${comp} = ${diff}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: { hideVisual: true } },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  // 2. advanced_mental_add_3_numbers
  if (activeVariant === 'advanced_mental_add_3_numbers') {
    // 3 single digit numbers, two of them make 10
    const pair1 = Math.floor(Math.random() * 8) + 1; // 1 to 8
    const pair2 = 10 - pair1;
    const num3 = Math.floor(Math.random() * 8) + 1;
    
    // shuffle
    const arr = [pair1, pair2, num3].sort(() => Math.random() - 0.5);
    const sum = pair1 + pair2 + num3; // always 10 + num3
    
    const questionTextRaw = `Calculate mentally: ${arr[0]} + ${arr[1]} + ${arr[2]} = ?`;
    const questionTextShort = `Solve mentally: ${arr[0]} + ${arr[1]} + ${arr[2]} = ?`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const options = getOptions(sum);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${sum}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: generateDefectMap(options, sum),
          hint: "Look for two numbers that add up to 10 first.",
          finalAnswer: String(sum),
          solutionSteps: `1. Find the friends of 10: ${pair1} and ${pair2} make 10.\\n2. Then add the remaining number: 10 + ${num3} = ${sum}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: { hideVisual: true } },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  // 3. advanced_mental_missing_addend
  if (activeVariant === 'advanced_mental_missing_addend') {
    const num1 = Math.floor(Math.random() * 30) + 10;
    const missing = Math.floor(Math.random() * 20) + 5;
    const sum = num1 + missing;
    
    const questionTextRaw = `Find the missing number: ${num1} + ? = ${sum}`;
    const questionTextShort = `Find the missing number: ${num1} + ? = ${sum}`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const options = getOptions(missing);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${missing}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: generateDefectMap(options, missing),
          hint: "Work backwards. What is the total minus the number you already have?",
          finalAnswer: String(missing),
          solutionSteps: `1. To find the missing part, subtract the part you know from the total.\\n2. ${sum} - ${num1} = ${missing}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: { hideVisual: true } },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  // 4. advanced_mental_missing_subtrahend
  if (activeVariant === 'advanced_mental_missing_subtrahend') {
    const num1 = Math.floor(Math.random() * 30) + 30; // 30 to 59
    const missing = Math.floor(Math.random() * 20) + 5;
    const diff = num1 - missing;
    
    const questionTextRaw = `Find the missing number: ${num1} - ? = ${diff}`;
    const questionTextShort = `Find the missing number: ${num1} - ? = ${diff}`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const options = getOptions(missing);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${missing}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: generateDefectMap(options, missing),
          hint: "Subtract the final answer from the starting number.",
          finalAnswer: String(missing),
          solutionSteps: `1. To find what was taken away, subtract the amount left from the starting amount.\\n2. ${num1} - ${diff} = ${missing}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: { hideVisual: true } },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  // 5. advanced_mental_word_problem
  if (activeVariant === 'advanced_mental_word_problem') {
    const names = ['Ali', 'Ben', 'Chloe', 'Dan', 'Emma', 'Faris'];
    const items = ['stickers', 'marbles', 'sweets', 'cards', 'stamps'];
    
    const name = names[Math.floor(Math.random() * names.length)];
    const item = items[Math.floor(Math.random() * items.length)];
    
    const isAddition = Math.random() > 0.5;
    const num1 = Math.floor(Math.random() * 30) + 20; // 20 to 49
    const num2 = Math.floor(Math.random() * 15) + 5; // 5 to 19
    
    let answer = 0;
    let text = '';
    
    if (isAddition) {
      answer = num1 + num2;
      text = `${name} has ${num1} ${item}. His friend gives him ${num2} more. How many ${item} does ${name} have now?`;
    } else {
      answer = num1 - num2;
      text = `${name} has ${num1} ${item}. She gives away ${num2} ${item}. How many ${item} does she have left?`;
    }
    
    const questionTextRaw = text;
    const questionTextShort = text;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const options = getOptions(answer);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: generateDefectMap(options, answer),
          hint: isAddition ? "Add the two numbers together." : "Subtract the second number from the first.",
          finalAnswer: String(answer),
          solutionSteps: `1. We need to ${isAddition ? 'add' : 'subtract'} the numbers.\\n2. ${num1} ${isAddition ? '+' : '-'} ${num2} = ${answer}.`
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
