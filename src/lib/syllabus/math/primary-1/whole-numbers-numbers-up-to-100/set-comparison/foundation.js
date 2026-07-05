export const foundationLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon) => {

  const commonMeta = {
    zodType,
    difficulty: zodDiff,
    level,
    topic
  };

  const inputType = isStructure ? 'MULTI_STEP_INPUT' : (isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT');

  // Helper to generate visual engine payload
  const createVisualSets = (numA, numB, context) => {
    return {
      componentToRender: "TWO_SET_COMPARISON",
      componentData: {
        setA: {
          count: numA,
          icon: selectedIcon,
          label: `Set A`
        },
        setB: {
          count: numB,
          icon: selectedIcon,
          label: `Set B`
        },
        context: context
      }
    };
  };

  // 1. foundation_identify_set_more
  if (activeVariant === 'foundation_identify_set_more') {
    let numA = Math.floor(Math.random() * 40) + 10;
    let numB = Math.floor(Math.random() * 40) + 10;
    while (numA === numB) numB = Math.floor(Math.random() * 40) + 10;

    const hasMore = numA > numB ? "Set A" : "Set B";
    
    // Always MCQ for this since it's identifying a set
    const questionTextRaw = `Which set has more ${selectedContextItem.item}?`;
    const questionTextShort = `Set with more ${selectedContextItem.item}:`;
    
    let defectMap = null;
    let options = null;
    
    // Even if isShort, we should probably force options in the prompt to allow user to type "Set A" or "Set B",
    // but the engine prefers MCQ for picking sets. We will construct options anyway.
    options = ["Set A", "Set B"].sort(() => Math.random() - 0.5);
    defectMap = {
      [numA > numB ? "Set B" : "Set A"]: "CONCEPTUAL_ERROR"
    };

    const questionText = getQText(questionTextRaw, questionTextShort);
    const finalQuestionText = (!isMCQ) ? `${questionText} (Set A or Set B)` : questionText;
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Set Comparison\n - Final Answer MUST be: "${hasMore}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: finalQuestionText,
          options: options,
          defectMap: defectMap,
          hint: `Count the ${selectedContextItem.item} in each set. Which number is bigger?`,
          finalAnswer: hasMore,
          solutionSteps: `1. Set A has ${numA} ${selectedContextItem.item}.\\n2. Set B has ${numB} ${selectedContextItem.item}.\\n3. ${Math.max(numA, numB)} is greater than ${Math.min(numA, numB)}, so ${hasMore} has more.`
        },
        visualEngine: createVisualSets(numA, numB, context),
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: false }
    };
  }

  // 2. foundation_identify_set_fewer
  if (activeVariant === 'foundation_identify_set_fewer') {
    let numA = Math.floor(Math.random() * 40) + 10;
    let numB = Math.floor(Math.random() * 40) + 10;
    while (numA === numB) numB = Math.floor(Math.random() * 40) + 10;

    const hasFewer = numA < numB ? "Set A" : "Set B";
    
    const questionTextRaw = `Which set has fewer ${selectedContextItem.item}?`;
    const questionTextShort = `Set with fewer ${selectedContextItem.item}:`;
    
    let defectMap = null;
    let options = null;
    
    options = ["Set A", "Set B"].sort(() => Math.random() - 0.5);
    defectMap = {
      [numA < numB ? "Set B" : "Set A"]: "CONCEPTUAL_ERROR"
    };

    const questionText = getQText(questionTextRaw, questionTextShort);
    const finalQuestionText = (!isMCQ) ? `${questionText} (Set A or Set B)` : questionText;
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Set Comparison\n - Final Answer MUST be: "${hasFewer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: finalQuestionText,
          options: options,
          defectMap: defectMap,
          hint: `Count the ${selectedContextItem.item} in each set. Which number is smaller?`,
          finalAnswer: hasFewer,
          solutionSteps: `1. Set A has ${numA} ${selectedContextItem.item}.\\n2. Set B has ${numB} ${selectedContextItem.item}.\\n3. ${Math.min(numA, numB)} is smaller than ${Math.max(numA, numB)}, so ${hasFewer} has fewer.`
        },
        visualEngine: createVisualSets(numA, numB, context),
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: false }
    };
  }

  // 3. foundation_true_false_more
  if (activeVariant === 'foundation_true_false_more') {
    let numA = Math.floor(Math.random() * 40) + 10;
    let numB = Math.floor(Math.random() * 40) + 10;
    while (numA === numB) numB = Math.floor(Math.random() * 40) + 10; // Ensure unequal

    // Randomize whether the statement is true or false
    const statementIsTrue = Math.random() > 0.5;
    
    if (statementIsTrue) {
      if (numA < numB) {
        let temp = numA; numA = numB; numB = temp;
      }
    } else {
      if (numA > numB) {
        let temp = numA; numA = numB; numB = temp;
      }
    }

    const answer = statementIsTrue ? "True" : "False";
    const questionTextRaw = `True or False: Set A has more ${selectedContextItem.item} than Set B.`;
    const questionTextShort = `Set A > Set B? (True/False):`;
    
    let defectMap = null;
    let options = null;
    
    if (isMCQ) {
      options = ["True", "False"];
      defectMap = { [statementIsTrue ? "False" : "True"]: "CONCEPTUAL_ERROR" };
    }

    const questionText = getQText(questionTextRaw, questionTextShort);
    const finalQuestionText = (!isMCQ) ? `${questionText} (True or False)` : questionText;
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Set Comparison\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: finalQuestionText,
          options: options,
          defectMap: defectMap,
          hint: "Count both sets. Does Set A have a bigger number?",
          finalAnswer: answer,
          solutionSteps: `1. Set A has ${numA} ${selectedContextItem.item}.\\n2. Set B has ${numB} ${selectedContextItem.item}.\\n3. Set A (${numA}) is ${numA > numB ? "greater" : "not greater"} than Set B (${numB}).\\n4. The statement is ${answer}.`
        },
        visualEngine: createVisualSets(numA, numB, context),
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: false }
    };
  }

  // 4. foundation_true_false_fewer
  if (activeVariant === 'foundation_true_false_fewer') {
    let numA = Math.floor(Math.random() * 40) + 10;
    let numB = Math.floor(Math.random() * 40) + 10;
    while (numA === numB) numB = Math.floor(Math.random() * 40) + 10; // Ensure unequal

    // Randomize whether the statement is true or false
    const statementIsTrue = Math.random() > 0.5;
    
    if (statementIsTrue) {
      if (numA > numB) {
        let temp = numA; numA = numB; numB = temp;
      }
    } else {
      if (numA < numB) {
        let temp = numA; numA = numB; numB = temp;
      }
    }

    const answer = statementIsTrue ? "True" : "False";
    const questionTextRaw = `True or False: Set A has fewer ${selectedContextItem.item} than Set B.`;
    const questionTextShort = `Set A < Set B? (True/False):`;
    
    let defectMap = null;
    let options = null;
    
    if (isMCQ) {
      options = ["True", "False"];
      defectMap = { [statementIsTrue ? "False" : "True"]: "CONCEPTUAL_ERROR" };
    }

    const questionText = getQText(questionTextRaw, questionTextShort);
    const finalQuestionText = (!isMCQ) ? `${questionText} (True or False)` : questionText;
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Set Comparison\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: finalQuestionText,
          options: options,
          defectMap: defectMap,
          hint: "Count both sets. Does Set A have a smaller number?",
          finalAnswer: answer,
          solutionSteps: `1. Set A has ${numA} ${selectedContextItem.item}.\\n2. Set B has ${numB} ${selectedContextItem.item}.\\n3. Set A (${numA}) is ${numA < numB ? "smaller" : "not smaller"} than Set B (${numB}).\\n4. The statement is ${answer}.`
        },
        visualEngine: createVisualSets(numA, numB, context),
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: false }
    };
  }

  // 5. foundation_compare_equal_sets
  if (activeVariant === 'foundation_compare_equal_sets') {
    const isEqual = Math.random() > 0.5;
    
    let numA = Math.floor(Math.random() * 30) + 10;
    let numB = isEqual ? numA : Math.floor(Math.random() * 30) + 10;
    
    // Ensure they are strictly unequal if isEqual is false
    if (!isEqual && numA === numB) numB++;

    const answer = isEqual ? "Yes" : "No";
    
    const questionTextRaw = `Do Set A and Set B have the same number of ${selectedContextItem.item}?`;
    const questionTextShort = `Same number of ${selectedContextItem.item}? (Yes/No):`;
    
    let defectMap = null;
    let options = null;
    
    if (isMCQ) {
      options = ["Yes", "No"];
      defectMap = { [isEqual ? "No" : "Yes"]: "CONCEPTUAL_ERROR" };
    }

    const questionText = getQText(questionTextRaw, questionTextShort);
    const finalQuestionText = (!isMCQ) ? `${questionText} (Yes or No)` : questionText;
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Set Comparison\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: finalQuestionText,
          options: options,
          defectMap: defectMap,
          hint: "Count Set A. Then count Set B. Are the numbers exactly the same?",
          finalAnswer: answer,
          solutionSteps: `1. Set A has ${numA}.\\n2. Set B has ${numB}.\\n3. ${numA} is ${isEqual ? "equal to" : "not equal to"} ${numB}.\\n4. The answer is ${answer}.`
        },
        visualEngine: createVisualSets(numA, numB, context),
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: false }
    };
  }

  // Fallback
  return null;
};
