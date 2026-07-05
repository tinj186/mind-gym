export const standardLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon) => {

  const commonMeta = {
    zodType,
    difficulty: zodDiff,
    level,
    topic
  };

  const inputType = isStructure ? 'MULTI_STEP_INPUT' : (isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT');

  const createVisualSets = (numA, numB, ctx) => {
    return {
      componentToRender: "TWO_SET_COMPARISON",
      componentData: {
        setA: { count: numA, icon: selectedIcon, label: `Set A` },
        setB: { count: numB, icon: selectedIcon, label: `Set B` },
        context: ctx
      }
    };
  };

  const generateDefectMap = (correctValue, type) => {
    let map = {};
    if (type === "number") {
      map[correctValue + 1] = "CARELESS_CALCULATION";
      map[correctValue - 1] = "CARELESS_CALCULATION";
      map[correctValue + 2] = "CONCEPTUAL_ERROR";
    }
    return map;
  };

  const generateOptions = (correctValue, type) => {
    if (!isMCQ) return null;
    let opts = [String(correctValue)];
    if (type === "number") {
      opts.push(String(correctValue + 1));
      if (correctValue - 1 >= 0) opts.push(String(correctValue - 1));
      else opts.push(String(correctValue + 2));
      opts.push(String(correctValue + Math.floor(Math.random() * 3) + 2));
    } else {
      opts = ["True", "False"];
    }
    return opts.sort(() => Math.random() - 0.5);
  };

  // 1. standard_how_many_more_seta
  if (activeVariant === 'standard_how_many_more_seta') {
    const numB = Math.floor(Math.random() * 30) + 10;
    const diff = Math.floor(Math.random() * 10) + 1;
    const numA = numB + diff; // Set A is strictly more

    const answer = diff;
    const questionTextRaw = `Set A has how many more ${selectedContextItem.item} than Set B?`;
    const questionTextShort = `How many more in Set A:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: generateOptions(answer, "number"),
          defectMap: generateDefectMap(answer, "number"),
          hint: "Subtract the number of items in Set B from the number of items in Set A.",
          finalAnswer: String(answer),
          solutionSteps: `1. Set A has ${numA} ${selectedContextItem.item}.\\n2. Set B has ${numB} ${selectedContextItem.item}.\\n3. Difference = ${numA} - ${numB} = ${answer}.`
        },
        visualEngine: createVisualSets(numA, numB, context),
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: false }
    };
  }

  // 2. standard_how_many_fewer_setb
  if (activeVariant === 'standard_how_many_fewer_setb') {
    const numB = Math.floor(Math.random() * 30) + 10;
    const diff = Math.floor(Math.random() * 10) + 1;
    const numA = numB + diff; // Set A is strictly more

    const answer = diff;
    const questionTextRaw = `Set B has how many fewer ${selectedContextItem.item} than Set A?`;
    const questionTextShort = `How many fewer in Set B:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: generateOptions(answer, "number"),
          defectMap: generateDefectMap(answer, "number"),
          hint: "Subtract the number of items in Set B from the number of items in Set A.",
          finalAnswer: String(answer),
          solutionSteps: `1. Set A has ${numA} ${selectedContextItem.item}.\\n2. Set B has ${numB} ${selectedContextItem.item}.\\n3. Difference = ${numA} - ${numB} = ${answer}.`
        },
        visualEngine: createVisualSets(numA, numB, context),
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: false }
    };
  }

  // 3. standard_how_many_more_random
  if (activeVariant === 'standard_how_many_more_random') {
    let numA = Math.floor(Math.random() * 30) + 10;
    let numB = Math.floor(Math.random() * 30) + 10;
    while (numA === numB) numB++; 

    const answer = Math.abs(numA - numB);
    const questionTextRaw = `How many more ${selectedContextItem.item} does the larger set have than the smaller set?`;
    const questionTextShort = `Difference between sets:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: generateOptions(answer, "number"),
          defectMap: generateDefectMap(answer, "number"),
          hint: "Find the set with the larger number. Then subtract the smaller number from it.",
          finalAnswer: String(answer),
          solutionSteps: `1. Set A has ${numA} ${selectedContextItem.item}.\\n2. Set B has ${numB} ${selectedContextItem.item}.\\n3. The larger set has ${Math.max(numA, numB)}, and the smaller set has ${Math.min(numA, numB)}.\\n4. Difference = ${Math.max(numA, numB)} - ${Math.min(numA, numB)} = ${answer}.`
        },
        visualEngine: createVisualSets(numA, numB, context),
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: false }
    };
  }

  // 4. standard_difference_value
  if (activeVariant === 'standard_difference_value') {
    let numA = Math.floor(Math.random() * 30) + 10;
    let numB = Math.floor(Math.random() * 30) + 10;
    while (numA === numB) numB++; 

    const answer = Math.abs(numA - numB);
    const questionTextRaw = `What is the difference in the number of ${selectedContextItem.item} between Set A and Set B?`;
    const questionTextShort = `Difference:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: generateOptions(answer, "number"),
          defectMap: generateDefectMap(answer, "number"),
          hint: "Difference means you need to subtract the smaller number from the larger number.",
          finalAnswer: String(answer),
          solutionSteps: `1. Set A has ${numA} ${selectedContextItem.item}.\\n2. Set B has ${numB} ${selectedContextItem.item}.\\n3. Difference = ${Math.max(numA, numB)} - ${Math.min(numA, numB)} = ${answer}.`
        },
        visualEngine: createVisualSets(numA, numB, context),
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: false }
    };
  }

  // 5. standard_add_to_equalize
  if (activeVariant === 'standard_add_to_equalize') {
    let numA = Math.floor(Math.random() * 30) + 10;
    let numB = Math.floor(Math.random() * 30) + 10;
    while (numA === numB) numB++; 
    
    const smaller = numA < numB ? "Set A" : "Set B";
    const answer = Math.abs(numA - numB);
    const questionTextRaw = `How many ${selectedContextItem.item} must be added to ${smaller} to make it equal to the other set?`;
    const questionTextShort = `Amount to add to ${smaller} to equalize:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: generateOptions(answer, "number"),
          defectMap: generateDefectMap(answer, "number"),
          hint: "To make the sets equal, you need to add the difference between them to the smaller set.",
          finalAnswer: String(answer),
          solutionSteps: `1. Set A has ${numA} ${selectedContextItem.item}.\\n2. Set B has ${numB} ${selectedContextItem.item}.\\n3. The difference is ${Math.max(numA, numB)} - ${Math.min(numA, numB)} = ${answer}.\\n4. You must add ${answer} to ${smaller} to equalize them.`
        },
        visualEngine: createVisualSets(numA, numB, context),
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: false }
    };
  }

  // 6. standard_remove_to_equalize
  if (activeVariant === 'standard_remove_to_equalize') {
    let numA = Math.floor(Math.random() * 30) + 10;
    let numB = Math.floor(Math.random() * 30) + 10;
    while (numA === numB) numB++; 
    
    const larger = numA > numB ? "Set A" : "Set B";
    const answer = Math.abs(numA - numB);
    const questionTextRaw = `How many ${selectedContextItem.item} must be removed from ${larger} to make it equal to the other set?`;
    const questionTextShort = `Amount to remove from ${larger} to equalize:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: generateOptions(answer, "number"),
          defectMap: generateDefectMap(answer, "number"),
          hint: "To make the sets equal, you need to remove the difference between them from the larger set.",
          finalAnswer: String(answer),
          solutionSteps: `1. Set A has ${numA} ${selectedContextItem.item}.\\n2. Set B has ${numB} ${selectedContextItem.item}.\\n3. The difference is ${Math.max(numA, numB)} - ${Math.min(numA, numB)} = ${answer}.\\n4. You must remove ${answer} from ${larger} to equalize them.`
        },
        visualEngine: createVisualSets(numA, numB, context),
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: false }
    };
  }

  // 7. standard_transfer_to_equalize
  if (activeVariant === 'standard_transfer_to_equalize') {
    let numA = Math.floor(Math.random() * 20) + 10;
    let numB = Math.floor(Math.random() * 20) + 10;
    while (numA === numB || Math.abs(numA - numB) % 2 !== 0) {
      numB = Math.floor(Math.random() * 20) + 10; // Ensure difference is even so transfer works perfectly
    }
    
    const larger = numA > numB ? "Set A" : "Set B";
    const smaller = numA < numB ? "Set A" : "Set B";
    const diff = Math.abs(numA - numB);
    const answer = diff / 2;
    
    const questionTextRaw = `How many ${selectedContextItem.item} must be moved from ${larger} to ${smaller} so they have the same number?`;
    const questionTextShort = `Move from ${larger} to ${smaller} to equalize:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: generateOptions(answer, "number"),
          defectMap: generateDefectMap(answer, "number"),
          hint: "First find the difference between the two sets. Then divide that difference by 2 to find out how many to move.",
          finalAnswer: String(answer),
          solutionSteps: `1. Set A has ${numA} ${selectedContextItem.item}.\\n2. Set B has ${numB} ${selectedContextItem.item}.\\n3. The difference is ${Math.max(numA, numB)} - ${Math.min(numA, numB)} = ${diff}.\\n4. To equalize, move half the difference: ${diff} ÷ 2 = ${answer}.`
        },
        visualEngine: createVisualSets(numA, numB, context),
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: false }
    };
  }

  // 8. standard_combine_total
  if (activeVariant === 'standard_combine_total') {
    let numA = Math.floor(Math.random() * 30) + 10;
    let numB = Math.floor(Math.random() * 30) + 10;

    const answer = numA + numB;
    const questionTextRaw = `How many ${selectedContextItem.item} are there altogether in Set A and Set B?`;
    const questionTextShort = `Total ${selectedContextItem.item}:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: generateOptions(answer, "number"),
          defectMap: generateDefectMap(answer, "number"),
          hint: "Add the number of items in Set A to the number of items in Set B.",
          finalAnswer: String(answer),
          solutionSteps: `1. Set A has ${numA} ${selectedContextItem.item}.\\n2. Set B has ${numB} ${selectedContextItem.item}.\\n3. Total = ${numA} + ${numB} = ${answer}.`
        },
        visualEngine: createVisualSets(numA, numB, context),
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: false }
    };
  }

  // 9. standard_compare_sum_to_value
  if (activeVariant === 'standard_compare_sum_to_value') {
    let numA = Math.floor(Math.random() * 20) + 10;
    let numB = Math.floor(Math.random() * 20) + 10;
    const sum = numA + numB;
    
    // Create a target to compare against
    const targetOffset = Math.floor(Math.random() * 5) + 1; // 1 to 5
    const isGreater = Math.random() > 0.5;
    const target = isGreater ? sum - targetOffset : sum + targetOffset;
    
    const statementIsTrue = sum > target;
    const answer = statementIsTrue ? "True" : "False";
    
    const questionTextRaw = `True or False: The total number of ${selectedContextItem.item} in Set A and Set B is greater than ${target}.`;
    const questionTextShort = `Total > ${target}? (True/False):`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    let defectMap = null;
    let options = null;
    if (isMCQ) {
      options = ["True", "False"];
      defectMap = { [statementIsTrue ? "False" : "True"]: "CONCEPTUAL_ERROR" };
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: (!isMCQ) ? `${questionText} (True or False)` : questionText,
          options: options,
          defectMap: defectMap,
          hint: "First calculate the total number of items in both sets. Then compare it to the target number.",
          finalAnswer: answer,
          solutionSteps: `1. Set A has ${numA} ${selectedContextItem.item}.\\n2. Set B has ${numB} ${selectedContextItem.item}.\\n3. Total = ${numA} + ${numB} = ${sum}.\\n4. Is ${sum} greater than ${target}? The statement is ${answer}.`
        },
        visualEngine: createVisualSets(numA, numB, context),
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: false }
    };
  }

  // 10. standard_compare_diff_to_value
  if (activeVariant === 'standard_compare_diff_to_value') {
    let numA = Math.floor(Math.random() * 20) + 10;
    let numB = Math.floor(Math.random() * 20) + 10;
    while (numA === numB) numB++; 
    
    const diff = Math.abs(numA - numB);
    
    // Create a target to compare against
    const statementIsTrue = Math.random() > 0.5;
    const targetOffset = Math.floor(Math.random() * 3) + 1; // 1 to 3
    const target = statementIsTrue ? diff : diff + targetOffset;
    
    const answer = statementIsTrue ? "True" : "False";
    
    const questionTextRaw = `True or False: The difference between Set A and Set B is exactly ${target}.`;
    const questionTextShort = `Difference = ${target}? (True/False):`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    let defectMap = null;
    let options = null;
    if (isMCQ) {
      options = ["True", "False"];
      defectMap = { [statementIsTrue ? "False" : "True"]: "CONCEPTUAL_ERROR" };
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: (!isMCQ) ? `${questionText} (True or False)` : questionText,
          options: options,
          defectMap: defectMap,
          hint: "First find the difference between the two sets by subtracting the smaller from the larger. Then compare it to the target number.",
          finalAnswer: answer,
          solutionSteps: `1. Set A has ${numA} ${selectedContextItem.item}.\\n2. Set B has ${numB} ${selectedContextItem.item}.\\n3. Difference = ${Math.max(numA, numB)} - ${Math.min(numA, numB)} = ${diff}.\\n4. Is the difference exactly ${target}? The statement is ${answer}.`
        },
        visualEngine: createVisualSets(numA, numB, context),
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: false }
    };
  }

  return null;
};
