export const advancedLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon) => {

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
    if (type === "number") {
      let opts = [String(correctValue)];
      opts.push(String(correctValue + 1));
      if (correctValue - 1 >= 0) opts.push(String(correctValue - 1));
      else opts.push(String(correctValue + 2));
      opts.push(String(correctValue + Math.floor(Math.random() * 3) + 2));
      return Array.from(new Set(opts)).sort(() => Math.random() - 0.5); // Dedup
    } else if (type === "string") {
      return ["Set A", "Set B"].sort(() => Math.random() - 0.5);
    } else {
      return ["True", "False"];
    }
  };

  // 1. advanced_relative_third_set_more
  if (activeVariant === 'advanced_relative_third_set_more') {
    const numA = Math.floor(Math.random() * 15) + 10; // Keep visually small
    const numB = Math.floor(Math.random() * 15) + 10;
    const diff = Math.floor(Math.random() * 10) + 2;
    
    const numC = numA + diff;
    const answer = numC;

    const questionTextRaw = `Set C (not shown) has ${diff} more ${selectedContextItem.item} than Set A. How many ${selectedContextItem.item} are in Set C?`;
    const questionTextShort = `Total in Set C:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: generateOptions(answer, "number"),
          defectMap: generateDefectMap(answer, "number"),
          hint: "Count the items in Set A first. Then add the extra items to find out how many are in Set C.",
          finalAnswer: String(answer),
          solutionSteps: `1. Set A has ${numA} ${selectedContextItem.item}.\\n2. Set C has ${diff} more than Set A.\\n3. Total in Set C = ${numA} + ${diff} = ${answer}.`
        },
        visualEngine: createVisualSets(numA, numB, context),
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: false }
    };
  }

  // 2. advanced_relative_third_set_fewer
  if (activeVariant === 'advanced_relative_third_set_fewer') {
    const numB = Math.floor(Math.random() * 15) + 15; // Ensure large enough to subtract
    const numA = Math.floor(Math.random() * 15) + 10;
    const diff = Math.floor(Math.random() * (numB - 5)) + 1; // Ensure Set C is positive
    
    const numC = numB - diff;
    const answer = numC;

    const questionTextRaw = `Set C (not shown) has ${diff} fewer ${selectedContextItem.item} than Set B. How many ${selectedContextItem.item} are in Set C?`;
    const questionTextShort = `Total in Set C:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: generateOptions(answer, "number"),
          defectMap: generateDefectMap(answer, "number"),
          hint: "Count the items in Set B first. Then subtract to find out how many are in Set C.",
          finalAnswer: String(answer),
          solutionSteps: `1. Set B has ${numB} ${selectedContextItem.item}.\\n2. Set C has ${diff} fewer than Set B.\\n3. Total in Set C = ${numB} - ${diff} = ${answer}.`
        },
        visualEngine: createVisualSets(numA, numB, context),
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: false }
    };
  }

  // 3. advanced_relative_third_set_combined
  if (activeVariant === 'advanced_relative_third_set_combined') {
    const numA = Math.floor(Math.random() * 15) + 10; 
    const numB = Math.floor(Math.random() * 15) + 10;
    
    const numC = numA + numB;
    const answer = numC;

    const questionTextRaw = `Set C (not shown) has exactly the same number of ${selectedContextItem.item} as Set A and Set B combined. How many ${selectedContextItem.item} are in Set C?`;
    const questionTextShort = `Total in Set C:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: generateOptions(answer, "number"),
          defectMap: generateDefectMap(answer, "number"),
          hint: "Count the items in Set A and Set B. Add them together.",
          finalAnswer: String(answer),
          solutionSteps: `1. Set A has ${numA} ${selectedContextItem.item}.\\n2. Set B has ${numB} ${selectedContextItem.item}.\\n3. Set C = Set A + Set B = ${numA} + ${numB} = ${answer}.`
        },
        visualEngine: createVisualSets(numA, numB, context),
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: false }
    };
  }

  // 4. advanced_relative_third_set_difference
  if (activeVariant === 'advanced_relative_third_set_difference') {
    let numA = Math.floor(Math.random() * 20) + 10; 
    let numB = Math.floor(Math.random() * 20) + 10;
    while(numA === numB) numB++;
    
    const numC = Math.abs(numA - numB);
    const answer = numC;

    const questionTextRaw = `Set C (not shown) has a number of ${selectedContextItem.item} equal to the difference between Set A and Set B. How many ${selectedContextItem.item} are in Set C?`;
    const questionTextShort = `Total in Set C:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: generateOptions(answer, "number"),
          defectMap: generateDefectMap(answer, "number"),
          hint: "Find the difference between Set A and Set B by subtracting the smaller amount from the larger amount.",
          finalAnswer: String(answer),
          solutionSteps: `1. Set A has ${numA} ${selectedContextItem.item}.\\n2. Set B has ${numB} ${selectedContextItem.item}.\\n3. Difference = ${Math.max(numA, numB)} - ${Math.min(numA, numB)} = ${answer}.\\n4. So, Set C has ${answer} ${selectedContextItem.item}.`
        },
        visualEngine: createVisualSets(numA, numB, context),
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: false }
    };
  }

  // 5. advanced_multiple_transfer
  if (activeVariant === 'advanced_multiple_transfer') {
    let numA = Math.floor(Math.random() * 15) + 15; 
    let numB = Math.floor(Math.random() * 15) + 15;
    const transfer1 = Math.floor(Math.random() * 5) + 3;
    let transfer2 = Math.floor(Math.random() * 5) + 2;
    while (transfer2 === transfer1) transfer2 = Math.floor(Math.random() * 5) + 2;
    
    const finalA = numA - transfer1 + transfer2;
    const finalB = numB + transfer1 - transfer2;
    
    // Ensure they don't end up equal
    if (finalA === finalB) numA += 1;

    const answer = finalA > finalB ? "Set A" : "Set B";

    const questionTextRaw = `If I move ${transfer1} items from Set A to Set B, and then move ${transfer2} items from Set B back to Set A, which set will have more ${selectedContextItem.item}?`;
    const questionTextShort = `Which set has more:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: (!isMCQ) ? `${questionText} (Set A or Set B)` : questionText,
          options: generateOptions(answer, "string"),
          defectMap: { [finalA > finalB ? "Set B" : "Set A"]: "CONCEPTUAL_ERROR" },
          hint: "Calculate the final number of items in Set A and Set B after both moves. Then compare them.",
          finalAnswer: answer,
          solutionSteps: `1. Initially, Set A has ${numA} and Set B has ${numB}.\\n2. Move 1: Set A gives ${transfer1}, so it has ${numA - transfer1}. Set B receives ${transfer1}, so it has ${numB + transfer1}.\\n3. Move 2: Set B gives ${transfer2}, so it has ${numB + transfer1 - transfer2}. Set A receives ${transfer2}, so it has ${numA - transfer1 + transfer2}.\\n4. Final counts: Set A = ${finalA}, Set B = ${finalB}.\\n5. ${answer} has more.`
        },
        visualEngine: createVisualSets(numA, numB, context),
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: false }
    };
  }

  // 6. advanced_ratio_concept
  if (activeVariant === 'advanced_ratio_concept') {
    let numA = Math.floor(Math.random() * 10) + 5; // Smaller
    let numB = Math.floor(Math.random() * 15) + 12; // Larger
    while (numA >= numB) numB++;
    
    // Randomize which is A and B
    if (Math.random() > 0.5) {
      let temp = numA; numA = numB; numB = temp;
    }

    const largerSet = numA > numB ? "Set A" : "Set B";
    const smallerSet = numA < numB ? "Set A" : "Set B";
    const smallerVal = Math.min(numA, numB);
    const largerVal = Math.max(numA, numB);
    
    const doubleSmall = smallerVal * 2;
    const statementIsTrue = doubleSmall > largerVal;
    const answer = statementIsTrue ? "Yes" : "No";

    const questionTextRaw = `If I double the number of items in ${smallerSet}, will it have more ${selectedContextItem.item} than ${largerSet}?`;
    const questionTextShort = `Double ${smallerSet} > ${largerSet}? (Yes/No):`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    let defectMap = null;
    let options = null;
    if (isMCQ) {
      options = ["Yes", "No"];
      defectMap = { [statementIsTrue ? "No" : "Yes"]: "CONCEPTUAL_ERROR" };
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: (!isMCQ) ? `${questionText} (Yes or No)` : questionText,
          options: options,
          defectMap: defectMap,
          hint: "Find out how many items are in the smaller set, double that number, and compare it to the larger set.",
          finalAnswer: answer,
          solutionSteps: `1. ${smallerSet} has ${smallerVal} items. ${largerSet} has ${largerVal} items.\\n2. Doubling ${smallerSet}: ${smallerVal} + ${smallerVal} = ${doubleSmall}.\\n3. Is ${doubleSmall} greater than ${largerVal}? ${answer}.`
        },
        visualEngine: createVisualSets(numA, numB, context),
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: false }
    };
  }

  // 7. advanced_equalize_both_target
  if (activeVariant === 'advanced_equalize_both_target') {
    let numA = Math.floor(Math.random() * 15) + 5; 
    let numB = Math.floor(Math.random() * 15) + 5;
    const target = Math.max(numA, numB) + Math.floor(Math.random() * 10) + 5;
    
    const addA = target - numA;
    const addB = target - numB;
    const answer = `${addA}, ${addB}`;

    const questionTextRaw = `How many items must be added to Set A and Set B respectively so that they both have exactly ${target} ${selectedContextItem.item}?`;
    const questionTextShort = `Amount to add (Set A, Set B):`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be exactly: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: isMCQ ? [answer, `${addA + 1}, ${addB}`, `${addA}, ${addB + 1}`, `${addB}, ${addA}`] : null,
          defectMap: isMCQ ? { [`${addA + 1}, ${addB}`]: "CARELESS_CALCULATION", [`${addB}, ${addA}`]: "CONCEPTUAL_ERROR" } : null,
          hint: "Calculate how many items each set needs to reach the target number.",
          finalAnswer: answer,
          solutionSteps: `1. Set A currently has ${numA}. To reach ${target}, add: ${target} - ${numA} = ${addA}.\\n2. Set B currently has ${numB}. To reach ${target}, add: ${target} - ${numB} = ${addB}.\\n3. Answer: ${answer}.`
        },
        visualEngine: createVisualSets(numA, numB, context),
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: false }
    };
  }

  // 8. advanced_reverse_transfer_a
  if (activeVariant === 'advanced_reverse_transfer_a') {
    const finalA = Math.floor(Math.random() * 15) + 10;
    const finalB = Math.floor(Math.random() * 15) + 10;
    const transfer = Math.floor(Math.random() * 5) + 2;
    
    // The picture shows final state. To find original A: A gave `transfer` to B. So Original A = finalA + transfer.
    const origA = finalA + transfer;
    const answer = origA;

    const questionTextRaw = `The picture shows the sets AFTER ${transfer} items were moved from Set A to Set B. How many items did Set A originally have?`;
    const questionTextShort = `Original Set A:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: generateOptions(answer, "number"),
          defectMap: generateDefectMap(answer, "number"),
          hint: "Since items were moved away from Set A, you need to add them back to find the original amount.",
          finalAnswer: String(answer),
          solutionSteps: `1. The picture shows Set A currently has ${finalA} items.\\n2. This is AFTER it gave away ${transfer} items.\\n3. Original Set A = ${finalA} + ${transfer} = ${answer}.`
        },
        visualEngine: createVisualSets(finalA, finalB, context),
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: false }
    };
  }

  // 9. advanced_reverse_transfer_b
  if (activeVariant === 'advanced_reverse_transfer_b') {
    const finalA = Math.floor(Math.random() * 15) + 10;
    const finalB = Math.floor(Math.random() * 15) + 15; // Ensure B has enough to reverse
    const transfer = Math.floor(Math.random() * 5) + 2;
    
    // The picture shows final state. A moved to B. Original B = finalB - transfer.
    const origB = finalB - transfer;
    const answer = origB;

    const questionTextRaw = `The picture shows the sets AFTER ${transfer} items were moved from Set A to Set B. How many items did Set B originally have?`;
    const questionTextShort = `Original Set B:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: generateOptions(answer, "number"),
          defectMap: generateDefectMap(answer, "number"),
          hint: "Since items were added to Set B, you need to subtract them to find the original amount.",
          finalAnswer: String(answer),
          solutionSteps: `1. The picture shows Set B currently has ${finalB} items.\\n2. This is AFTER it received ${transfer} items.\\n3. Original Set B = ${finalB} - ${transfer} = ${answer}.`
        },
        visualEngine: createVisualSets(finalA, finalB, context),
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: false }
    };
  }

  // 10. advanced_true_false_inequality
  if (activeVariant === 'advanced_true_false_inequality') {
    let numA = Math.floor(Math.random() * 20) + 10;
    let numB = Math.floor(Math.random() * 20) + 10;
    
    // Make A greater than B usually, but randomize
    if (Math.random() > 0.3) {
      if (numA <= numB) {
        let temp = numA; numA = numB; numB = temp;
        if (numA === numB) numA += 2;
      }
    }
    
    const offset = Math.floor(Math.random() * 5) + 2;
    const upperLimit = numB + offset;
    
    const isGreater = numA > numB;
    const isLess = numA < upperLimit;
    const statementIsTrue = isGreater && isLess;
    const answer = statementIsTrue ? "True" : "False";

    const questionTextRaw = `True or False: The number of items in Set A is greater than Set B, but less than ${upperLimit}.`;
    const questionTextShort = `Is Set A more than Set B but less than ${upperLimit}? (True/False):`;
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
          hint: "Check two things: First, does Set A have more than Set B? Second, is Set A's count smaller than the given number?",
          finalAnswer: answer,
          solutionSteps: `1. Set A has ${numA}. Set B has ${numB}.\\n2. Is ${numA} > ${numB}? ${isGreater ? "Yes" : "No"}.\\n3. Is ${numA} < ${upperLimit}? ${isLess ? "Yes" : "No"}.\\n4. Both conditions must be true. The statement is ${answer}.`
        },
        visualEngine: createVisualSets(numA, numB, context),
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: false }
    };
  }

  return null;
};
