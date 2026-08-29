export const foundationLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, getQText) => {

  const commonMeta = {
    zodType,
    difficulty: zodDiff,
    level,
    topic
  };

  const inputType = isStructure ? 'MULTI_STEP_INPUT' : (isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT');

  // 1. foundation_identify_plus
  if (activeVariant === 'foundation_identify_plus') {
    const questionTextRaw = "Which word means the same as the '+' symbol?";
    const questionTextShort = "Meaning of '+':";
    const questionText = getQText(questionTextRaw, questionTextShort);
    
    const plusWords = ["Add", "Plus", "Combine"];
    const correctAns = isMCQ ? plusWords[Math.floor(Math.random() * plusWords.length)] : "Add";
    
    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      const allDistractors = ["Subtract", "Minus", "Take away", "Difference", "Is the same as"];
      const distractors = allDistractors.sort(() => 0.5 - Math.random()).slice(0, 3);
      options = [correctAns, ...distractors].sort(() => Math.random() - 0.5);
      
      defectMap = {};
      distractors.forEach(d => defectMap[d] = "CONCEPTUAL_ERROR");
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctAns}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "The '+' symbol is used when we put things together or get more of something.",
          finalAnswer: correctAns,
          solutionSteps: "1. The '+' symbol is the addition sign.\\n2. It means 'to add' or 'plus'.\\n3. Therefore, it means the same as 'Add'."
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  // 2. foundation_identify_minus
  if (activeVariant === 'foundation_identify_minus') {
    const minusWords = ["Subtract", "Minus", "Take away", "Difference"];
    const correctAns = isMCQ ? minusWords[Math.floor(Math.random() * minusWords.length)] : "Subtract";
    const questionTextRaw = `Which word means the same as the '-' symbol?`;
    const questionTextShort = "Meaning of '-':";
    const questionText = getQText(questionTextRaw, questionTextShort);
    
    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      const allDistractors = ["Add", "Plus", "Combine", "Together", "Is the same as"];
      const distractors = allDistractors.sort(() => 0.5 - Math.random()).slice(0, 3);
      options = [correctAns, ...distractors].sort(() => Math.random() - 0.5);
      
      defectMap = {};
      distractors.forEach(d => defectMap[d] = "CONCEPTUAL_ERROR");
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctAns}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "The '-' symbol is used when we take things away or find the difference.",
          finalAnswer: correctAns,
          solutionSteps: `1. The '-' symbol is the subtraction sign.\\n2. It means 'to take away', 'subtract', or 'minus'.\\n3. Therefore, it means the same as '${correctAns}'.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  // 3. foundation_identify_equals
  if (activeVariant === 'foundation_identify_equals') {
    const questionTextRaw = "What does the '=' symbol mean in an equation?";
    const questionTextShort = "Meaning of '=':";
    const questionText = getQText(questionTextRaw, questionTextShort);
    
    const equalsWords = ["Is the same as", "Equals", "Makes"];
    const correctAns = isMCQ ? equalsWords[Math.floor(Math.random() * equalsWords.length)] : "Is the same as";
    
    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      const allDistractors = ["Add together", "Take away from", "Is greater than", "Is less than", "Plus", "Minus"];
      const distractors = allDistractors.sort(() => 0.5 - Math.random()).slice(0, 3);
      options = [correctAns, ...distractors].sort(() => Math.random() - 0.5);
      
      defectMap = {};
      distractors.forEach(d => defectMap[d] = "CONCEPTUAL_ERROR");
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctAns}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "The '=' symbol shows that the amounts on both sides have the same value.",
          finalAnswer: correctAns,
          solutionSteps: "1. The '=' symbol is the equals sign.\\n2. It tells us that what is on the left is exactly the same amount as what is on the right.\\n3. Therefore, it means 'Is the same as'."
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  // 4. foundation_choose_operation_word
  if (activeVariant === 'foundation_choose_operation_word') {
    const isAddition = Math.random() > 0.5;
    let story, correctSymbol;
    
    if (isAddition) {
      const additionContexts = [
        "Tom gets 2 more apples.",
        "Sarah finds 3 shiny stones.",
        "Ali buys 1 more book."
      ];
      story = additionContexts[Math.floor(Math.random() * additionContexts.length)];
      correctSymbol = "+";
    } else {
      const subtractionContexts = [
        "Tom eats 2 of his apples.",
        "Sarah loses 3 shiny stones.",
        "Ali gives away 1 book."
      ];
      story = subtractionContexts[Math.floor(Math.random() * subtractionContexts.length)];
      correctSymbol = "-";
    }

    const questionTextRaw = `Read the sentence:\\n"${story}"\\nWhich math symbol should you use?`;
    const questionTextShort = `"${story}" -> Symbol to use:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      options = ["+", "-", "="];
      defectMap = {
        [isAddition ? "-" : "+"]: "CONCEPTUAL_ERROR",
        "=": "CONCEPTUAL_ERROR"
      };
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctSymbol}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: isAddition ? "Think about whether they are getting more or putting things together." : "Think about whether things are being taken away or lost.",
          finalAnswer: correctSymbol,
          solutionSteps: isAddition 
            ? `1. The sentence shows someone getting more of something.\\n2. When we get more or combine things, we add.\\n3. The addition symbol is ${correctSymbol}.` 
            : `1. The sentence shows someone losing or giving something away.\\n2. When things are taken away, we subtract.\\n3. The subtraction symbol is ${correctSymbol}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  // 5. foundation_missing_symbol_equation
  if (activeVariant === 'foundation_missing_symbol_equation') {
    const isAddition = Math.random() > 0.5;
    
    let num1, num2, result, correctSymbol;
    if (isAddition) {
      num1 = Math.floor(Math.random() * 5) + 2; // 2 to 6
      num2 = Math.floor(Math.random() * 5) + 2;
      
      // Prevent ambiguous 2 [ ? ] 2 = 4 which could be + or *
      if (num1 === 2 && num2 === 2) {
        num1 = 3;
      }
      
      result = num1 + num2;
      correctSymbol = "+";
    } else {
      num1 = Math.floor(Math.random() * 5) + 6; // 6 to 10
      num2 = Math.floor(Math.random() * 4) + 1; // 1 to 4
      result = num1 - num2;
      correctSymbol = "-";
    }

    const eqStr = `${num1} [ ? ] ${num2} = ${result}`;
    const questionTextRaw = `Fill in the missing symbol to make the equation true:\\n${eqStr}`;
    const questionTextShort = `${eqStr}\\nMissing symbol:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      options = ["+", "-"];
      defectMap = {
        [isAddition ? "-" : "+"]: "CONCEPTUAL_ERROR"
      };
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctSymbol}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "Compare the starting number with the answer. Did the number get bigger or smaller?",
          finalAnswer: correctSymbol,
          solutionSteps: `1. The equation is ${num1} [ ? ] ${num2} = ${result}.\\n2. Since ${num1} and ${num2} makes ${result}, we are ${isAddition ? 'adding' : 'subtracting'}.\\n3. The correct symbol is ${correctSymbol}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  return null;
};
