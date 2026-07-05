import { getRandomNames } from '@/lib/utils/variable-bank';

export const standardLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, getQText) => {

  const commonMeta = {
    zodType,
    difficulty: zodDiff,
    level,
    topic
  };

  const inputType = isStructure ? 'MULTI_STEP_INPUT' : (isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT');

  // 1. standard_word_to_equation
  if (activeVariant === 'standard_word_to_equation') {
    const isAddition = Math.random() > 0.5;
    const name = getRandomNames(1)[0];
    
    let a, b, total, story;
    if (isAddition) {
      a = Math.floor(Math.random() * 8) + 3; // 3 to 10
      b = Math.floor(Math.random() * 8) + 3; // 3 to 10
      total = a + b;
      const additionContexts = [
        `${name} has ${a} apples. He buys ${b} more.`,
        `${name} catches ${a} fish. Then she catches ${b} more.`,
        `${name} sees ${a} birds. ${b} more birds join them.`
      ];
      story = additionContexts[Math.floor(Math.random() * additionContexts.length)];
    } else {
      a = Math.floor(Math.random() * 8) + 10; // 10 to 17
      b = Math.floor(Math.random() * 5) + 3; // 3 to 7
      total = a - b;
      const subtractionContexts = [
        `${name} has ${a} apples. He eats ${b} of them.`,
        `${name} catches ${a} fish. She releases ${b} back into the water.`,
        `${name} sees ${a} birds. ${b} birds fly away.`
      ];
      story = subtractionContexts[Math.floor(Math.random() * subtractionContexts.length)];
    }

    const questionTextRaw = `Read the story:\\n"${story}"\\nWhich equation matches the story?`;
    const questionTextShort = `"${story}" -> Match equation:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const correctEq = isAddition ? `${a} + ${b} = ${total}` : `${a} - ${b} = ${total}`;
    
    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      const wrongEq1 = isAddition ? `${a} - ${b} = ${a - b}` : `${a} + ${b} = ${a + b}`; // Wrong operation
      const wrongEq2 = isAddition ? `${b} - ${a} = ${Math.abs(b - a)}` : `${a} + ${total} = ${a + total}`; // Nonsense mix
      const wrongEq3 = isAddition ? `${total} + ${b} = ${total + b}` : `${b} - ${total} = ${Math.abs(b - total)}`; // Using result in operation
      
      options = [correctEq, wrongEq1, wrongEq2, wrongEq3].sort(() => Math.random() - 0.5);
      defectMap = {
        [wrongEq1]: "CONCEPTUAL_ERROR",
        [wrongEq2]: "CONCEPTUAL_ERROR",
        [wrongEq3]: "CONCEPTUAL_ERROR"
      };
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctEq}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: isAddition ? "Does the story show combining or adding more?" : "Does the story show taking something away?",
          finalAnswer: correctEq,
          solutionSteps: `1. The story starts with ${a}.\\n2. The story describes ${isAddition ? `getting ${b} more, which means we add (+) ${b}.` : `losing ${b}, which means we subtract (-) ${b}.`}\\n3. The result is ${total}.\\n4. The matching equation is ${correctEq}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: true }
    };
  }

  // 2. standard_equation_to_word
  if (activeVariant === 'standard_equation_to_word') {
    const isAddition = Math.random() > 0.5;
    
    let a, b, total, correctWord;
    if (isAddition) {
      a = Math.floor(Math.random() * 8) + 3;
      b = Math.floor(Math.random() * 8) + 3;
      total = a + b;
      correctWord = `${a} plus ${b} equals ${total}`;
    } else {
      a = Math.floor(Math.random() * 8) + 10;
      b = Math.floor(Math.random() * 5) + 3;
      total = a - b;
      correctWord = `${a} minus ${b} equals ${total}`;
    }

    const eqStr = isAddition ? `${a} + ${b} = ${total}` : `${a} - ${b} = ${total}`;
    
    const questionTextRaw = `Which sentence correctly reads this equation?\\n${eqStr}`;
    const questionTextShort = `${eqStr} -> In words:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      const wrongWord1 = isAddition ? `${a} minus ${b} equals ${total}` : `${a} plus ${b} equals ${total}`; // Wrong operator word
      const wrongWord2 = isAddition ? `${b} plus ${total} equals ${a}` : `${b} minus ${a} equals ${total}`; // Jumbled numbers
      const wrongWord3 = isAddition ? `${a} plus ${total} equals ${b}` : `${a} equals ${b} minus ${total}`; // Jumbled numbers
      
      options = [correctWord, wrongWord1, wrongWord2, wrongWord3].sort(() => Math.random() - 0.5);
      defectMap = {
        [wrongWord1]: "CONCEPTUAL_ERROR",
        [wrongWord2]: "CONCEPTUAL_ERROR",
        [wrongWord3]: "CONCEPTUAL_ERROR"
      };
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctWord}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: isAddition ? "The '+' symbol reads as 'plus'." : "The '-' symbol reads as 'minus'.",
          finalAnswer: correctWord,
          solutionSteps: `1. The first number is ${a}.\\n2. The '${isAddition ? '+' : '-'}' symbol means '${isAddition ? 'plus' : 'minus'}'.\\n3. The second number is ${b}.\\n4. The '=' symbol means 'equals', and the result is ${total}.\\n5. Putting it together: "${correctWord}".`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: true }
    };
  }

  // 3. standard_fix_wrong_symbol
  if (activeVariant === 'standard_fix_wrong_symbol') {
    const shouldBeAddition = Math.random() > 0.5;
    
    let num1, num2, result;
    if (shouldBeAddition) {
      num1 = Math.floor(Math.random() * 8) + 3;
      num2 = Math.floor(Math.random() * 8) + 3;
      result = num1 + num2;
    } else {
      num1 = Math.floor(Math.random() * 8) + 10;
      num2 = Math.floor(Math.random() * 5) + 3;
      result = num1 - num2;
    }

    // Display the WRONG symbol
    const wrongSymbol = shouldBeAddition ? "-" : "+";
    const correctSymbol = shouldBeAddition ? "+" : "-";
    const wrongEq = `${num1} ${wrongSymbol} ${num2} = ${result}`;
    
    const questionTextRaw = `This equation has the WRONG symbol.\\n${wrongEq}\\nWhat symbol should it be?`;
    const questionTextShort = `${wrongEq} (WRONG) -> Fix symbol:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      options = ["+", "-", "="];
      defectMap = {
        [wrongSymbol]: "CONCEPTUAL_ERROR",
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
          hint: `Does ${num1} and ${num2} make ${result} when added or subtracted?`,
          finalAnswer: correctSymbol,
          solutionSteps: `1. Look at the numbers: ${num1} and ${num2}. The result is ${result}.\\n2. Let's test addition: ${num1} + ${num2} = ${num1 + num2}.\\n3. Let's test subtraction: ${num1} - ${num2} = ${num1 - num2}.\\n4. Since ${num1} ${correctSymbol} ${num2} makes ${result}, the correct symbol is '${correctSymbol}'.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: true }
    };
  }

  // 4. standard_missing_symbol_large
  if (activeVariant === 'standard_missing_symbol_large') {
    const isAddition = Math.random() > 0.5;
    
    let num1, num2, result, correctSymbol;
    if (isAddition) {
      num1 = Math.floor(Math.random() * 8) + 8; // 8 to 15
      num2 = Math.floor(Math.random() * 5) + 3; // 3 to 7
      result = num1 + num2; // Max 22
      correctSymbol = "+";
    } else {
      num1 = Math.floor(Math.random() * 8) + 12; // 12 to 19
      num2 = Math.floor(Math.random() * 8) + 3; // 3 to 10
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
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: true }
    };
  }

  // 5. standard_find_target_operation
  if (activeVariant === 'standard_find_target_operation') {
    const needsAddition = Math.random() > 0.5;
    
    let start, target, diff, correctOpStr;
    if (needsAddition) {
      start = Math.floor(Math.random() * 8) + 5;
      diff = Math.floor(Math.random() * 5) + 3;
      target = start + diff;
      correctOpStr = `Add ${diff}`;
    } else {
      start = Math.floor(Math.random() * 8) + 12;
      diff = Math.floor(Math.random() * 6) + 2;
      target = start - diff;
      correctOpStr = `Subtract ${diff}`;
    }

    const questionTextRaw = `You have ${start}. You want to have exactly ${target}. What must you do?`;
    const questionTextShort = `Start: ${start}, Target: ${target} -> Action:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      const wrongOp1 = needsAddition ? `Subtract ${diff}` : `Add ${diff}`;
      const wrongOp2 = needsAddition ? `Add ${Math.abs(diff + 1)}` : `Subtract ${Math.abs(diff - 1)}`;
      const wrongOp3 = `Add ${target}`;
      
      options = [correctOpStr, wrongOp1, wrongOp2, wrongOp3].sort(() => Math.random() - 0.5);
      defectMap = {
        [wrongOp1]: "CONCEPTUAL_ERROR",
        [wrongOp2]: "CARELESS_CALCULATION",
        [wrongOp3]: "CONCEPTUAL_ERROR"
      };
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctOpStr}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: `Find the difference between ${start} and ${target}. Are you getting more or less?`,
          finalAnswer: correctOpStr,
          solutionSteps: `1. The starting number is ${start} and the target is ${target}.\\n2. Since the target is ${needsAddition ? 'bigger' : 'smaller'}, we must ${needsAddition ? 'add' : 'subtract'}.\\n3. To find out how much, we calculate the difference: ${Math.max(start, target)} - ${Math.min(start, target)} = ${diff}.\\n4. We must ${correctOpStr}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: true }
    };
  }

  return null;
};
