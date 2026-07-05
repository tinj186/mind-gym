import { emojiObjects } from '@/lib/utils/variable-bank';

export const standardLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, getQText) => {

  const commonMeta = {
    zodType,
    difficulty: zodDiff,
    level,
    topic
  };

  const inputType = isStructure ? 'MULTI_STEP_INPUT' : (isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT');

  const createNumberBond = (whole, part1, part2) => {
    return {
      componentToRender: "NUMBER_BOND",
      componentData: {
        whole,
        parts: [part1, part2]
      }
    };
  };

  const createCrossOutGroup = (totalItems, crossedItems, selectedIcon) => {
    return {
      componentToRender: "CROSS_OUT_GROUP",
      componentData: {
        totalItems,
        crossedItems,
        selectedIcon
      }
    };
  };

  const createTwoSetComparison = (countA, countB, icon, label) => {
    return {
      componentToRender: "TWO_SET_COMPARISON",
      componentData: {
        setA: { count: countA, icon, label },
        setB: { count: countB, icon, label }
      }
    };
  };

  const getRandomObj = () => emojiObjects[Math.floor(Math.random() * emojiObjects.length)];

  // 1. standard_subtraction_take_away
  if (activeVariant === 'standard_subtraction_take_away') {
    const total = Math.floor(Math.random() * 10) + 11; // 11 to 20
    const crossed = Math.floor(Math.random() * (total - 3)) + 2; 
    const remainder = total - crossed;
    const obj = getRandomObj();
    
    const correctEq = `${total} - ${crossed} = ${remainder}`;
    
    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      options = [
        correctEq,
        `${total} - ${remainder} = ${crossed}`, // Concept error: didn't subtract the crossed out amount
        `${crossed} + ${remainder} = ${total}`, // Concept error: wrong operation asked
        `${total} + ${crossed} = ${total + crossed}` // completely wrong
      ].sort(() => Math.random() - 0.5);
      
      defectMap = {
        [`${total} - ${remainder} = ${crossed}`]: "CONCEPTUAL_ERROR",
        [`${crossed} + ${remainder} = ${total}`]: "CONCEPTUAL_ERROR",
        [`${total} + ${crossed} = ${total + crossed}`]: "CONCEPTUAL_ERROR"
      };
    }

    const questionTextRaw = `Which subtraction equation matches the picture?`;
    const questionTextShort = `Correct subtraction equation:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctEq}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "Start with the total number of items, subtract the number crossed out, to find the remaining items.",
          finalAnswer: correctEq,
          solutionSteps: `1. There are ${total} ${obj.name} in total.\\n2. ${crossed} are crossed out.\\n3. ${remainder} are left.\\n4. The equation is ${total} - ${crossed} = ${remainder}.`
        },
        visualEngine: createCrossOutGroup(total, crossed, obj.icon),
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: false }
    };
  }

  // 2. standard_addition_combine_sets
  if (activeVariant === 'standard_addition_combine_sets') {
    const countA = Math.floor(Math.random() * 9) + 2;
    const countB = Math.floor(Math.random() * 9) + 2;
    const total = countA + countB;
    const obj = getRandomObj();
    
    // To ensure a single correct answer in short text, specify the order
    const firstSet = Math.min(countA, countB);
    const secondSet = Math.max(countA, countB);
    
    const correctEq = `${firstSet} + ${secondSet} = ${total}`;
    
    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      options = [
        correctEq,
        `${total} - ${secondSet} = ${firstSet}`, // Concept error: wrong operation asked
        `${firstSet} + ${total} = ${secondSet}`, // Concept error: wrong parts
        `${secondSet} + ${total} = ${firstSet}`  // completely wrong
      ].sort(() => Math.random() - 0.5);
      
      defectMap = {
        [`${total} - ${secondSet} = ${firstSet}`]: "CONCEPTUAL_ERROR",
        [`${firstSet} + ${total} = ${secondSet}`]: "CONCEPTUAL_ERROR",
        [`${secondSet} + ${total} = ${firstSet}`]: "CONCEPTUAL_ERROR"
      };
    }

    const questionTextRaw = `Write the addition equation that shows the total number of items in both sets. (Start with the smaller set)`;
    const questionTextShort = `Correct addition equation (Start with smaller set):`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctEq}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "Count the items in each set and add them together. Start your equation with the smaller number.",
          finalAnswer: correctEq,
          solutionSteps: `1. The smaller set has ${firstSet} ${obj.name}.\\n2. The larger set has ${secondSet} ${obj.name}.\\n3. To find the total, we add them: ${firstSet} + ${secondSet} = ${total}.`
        },
        visualEngine: createTwoSetComparison(countA, countB, obj.icon, obj.name),
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: false }
    };
  }

  // 3. standard_missing_addend
  if (activeVariant === 'standard_missing_addend') {
    const part1 = Math.floor(Math.random() * 8) + 3;
    const part2 = Math.floor(Math.random() * 8) + 3;
    const whole = part1 + part2;
    
    // Question: part1 + ? = whole
    const correctAns = part2;
    
    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      options = [
        String(correctAns),
        String(whole + part1), // added instead of subtracting
        String(correctAns + 1),
        String(Math.abs(correctAns - 1) || 2)
      ].sort(() => Math.random() - 0.5);
      
      defectMap = {
        [String(whole + part1)]: "CONCEPTUAL_ERROR",
        [String(correctAns + 1)]: "CARELESS_CALCULATION",
        [String(Math.abs(correctAns - 1) || 2)]: "CARELESS_CALCULATION"
      };
    }

    const eqStr = `${part1} + ? = ${whole}`;
    const questionTextRaw = `Find the missing number:\\n${eqStr}`;
    const questionTextShort = `${eqStr}. Missing number:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctAns}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "You can find a missing part by subtracting the known part from the total.",
          finalAnswer: String(correctAns),
          solutionSteps: `1. We know one part (${part1}) and the whole (${whole}).\\n2. To find the missing part, subtract: ${whole} - ${part1}.\\n3. ${whole} - ${part1} = ${correctAns}.`
        },
        visualEngine: createNumberBond(whole, part1, '?'),
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: false }
    };
  }

  // 4. standard_missing_subtrahend
  if (activeVariant === 'standard_missing_subtrahend') {
    const whole = Math.floor(Math.random() * 10) + 11; // 11 to 20
    const part2 = Math.floor(Math.random() * 7) + 2;
    const part1 = whole - part2;
    
    // Question: whole - ? = part2
    const correctAns = part1;
    
    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      options = [
        String(correctAns),
        String(whole + part2), // added instead of subtracting
        String(correctAns + 1),
        String(Math.abs(correctAns - 1) || 2)
      ].sort(() => Math.random() - 0.5);
      
      defectMap = {
        [String(whole + part2)]: "CONCEPTUAL_ERROR",
        [String(correctAns + 1)]: "CARELESS_CALCULATION",
        [String(Math.abs(correctAns - 1) || 2)]: "CARELESS_CALCULATION"
      };
    }

    const eqStr = `${whole} - ? = ${part2}`;
    const questionTextRaw = `Find the missing number:\\n${eqStr}`;
    const questionTextShort = `${eqStr}. Missing number:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctAns}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "You are starting with the whole and ending with a part. The missing number is the other part.",
          finalAnswer: String(correctAns),
          solutionSteps: `1. The whole is ${whole} and the remaining part is ${part2}.\\n2. To find the part that was taken away, subtract the remaining part from the whole.\\n3. ${whole} - ${part2} = ${correctAns}.`
        },
        visualEngine: createNumberBond(whole, '?', part2),
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: false }
    };
  }

  // 5. standard_fact_family
  if (activeVariant === 'standard_fact_family') {
    let part1 = Math.floor(Math.random() * 7) + 2;
    let part2 = Math.floor(Math.random() * 7) + 2;
    // Ensure distinct parts to avoid doubles confusion
    while (part2 === part1) part2 = Math.floor(Math.random() * 7) + 2;
    
    const smallerPart = Math.min(part1, part2);
    const largerPart = Math.max(part1, part2);
    const whole = part1 + part2;
    
    const isAdditionPrompt = Math.random() > 0.5;
    
    let promptEq, answerEq, instructionText;
    if (isAdditionPrompt) {
      promptEq = `${largerPart} + ${smallerPart} = ${whole}`;
      answerEq = `${whole} - ${smallerPart} = ${largerPart}`; 
      instructionText = "Write the related subtraction equation. (Subtract the smaller part)";
    } else {
      promptEq = `${whole} - ${largerPart} = ${smallerPart}`;
      answerEq = `${smallerPart} + ${largerPart} = ${whole}`; 
      instructionText = "Write the related addition equation. (Start with the smaller part)";
    }
    
    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      options = [
        answerEq,
        `${whole} + ${smallerPart} = ${whole + smallerPart}`,
        `${largerPart} - ${smallerPart} = ${largerPart - smallerPart}`,
        `${whole} + ${largerPart} = ${whole + largerPart}`
      ].sort(() => Math.random() - 0.5);
      
      defectMap = {
        [`${whole} + ${smallerPart} = ${whole + smallerPart}`]: "CONCEPTUAL_ERROR",
        [`${largerPart} - ${smallerPart} = ${largerPart - smallerPart}`]: "CONCEPTUAL_ERROR",
        [`${whole} + ${largerPart} = ${whole + largerPart}`]: "CONCEPTUAL_ERROR"
      };
    }

    const questionTextRaw = `Look at the number bond. Given the fact ${promptEq}, which is the related fact?`;
    const questionTextShort = `Given ${promptEq}, ${instructionText}:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${answerEq}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "Fact families use the same three numbers to form addition and subtraction equations. Look at the number bond to see the whole and the parts.",
          finalAnswer: answerEq,
          solutionSteps: `1. The numbers in this fact family are ${smallerPart}, ${largerPart}, and ${whole}.\\n2. The whole is always the largest number (${whole}).\\n3. A related equation must use exactly these three numbers.\\n4. So, ${answerEq} is correct.`
        },
        visualEngine: createNumberBond(whole, part1, part2),
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: false }
    };
  }

  return null;
};
