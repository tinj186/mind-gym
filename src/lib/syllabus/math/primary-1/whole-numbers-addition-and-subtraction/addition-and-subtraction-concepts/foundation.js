export const foundationLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, getQText) => {

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

  const generateDefectMap = (correctValue, type) => {
    let map = {};
    if (type === "number") {
      map[correctValue + 1] = "CARELESS_CALCULATION";
      map[correctValue - 1] = "CARELESS_CALCULATION";
      map[correctValue + 2] = "CONCEPTUAL_ERROR";
      if (correctValue - 2 > 0) map[correctValue - 2] = "CONCEPTUAL_ERROR";
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
    } else if (type === "equation") {
      // Equation variations generated in the specific variants
      return null;
    } else {
      opts = ["True", "False"];
    }
    return Array.from(new Set(opts)).sort(() => Math.random() - 0.5);
  };

  // 1. foundation_find_missing_whole
  if (activeVariant === 'foundation_find_missing_whole') {
    const part1 = Math.floor(Math.random() * 9) + 1;
    const part2 = Math.floor(Math.random() * (10 - part1)) + 1; // Keep sum <= 10 for foundation
    const whole = part1 + part2;
    const answer = whole;

    const questionTextRaw = `Look at the number bond. What is the missing whole?`;
    const questionTextShort = `Missing whole:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: generateOptions(answer, "number"),
          defectMap: generateDefectMap(answer, "number"),
          hint: "To find the whole, you need to add the two parts together.",
          finalAnswer: String(answer),
          solutionSteps: `1. The two parts are ${part1} and ${part2}.\\n2. The whole is the sum of the two parts.\\n3. ${part1} + ${part2} = ${answer}.`
        },
        visualEngine: createNumberBond('?', part1, part2),
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: false }
    };
  }

  // 2. foundation_find_missing_part
  if (activeVariant === 'foundation_find_missing_part') {
    const whole = Math.floor(Math.random() * 8) + 3; // 3 to 10
    const part1 = Math.floor(Math.random() * (whole - 1)) + 1;
    const part2 = whole - part1;
    
    // Randomize which part is missing
    const isPart1Missing = Math.random() > 0.5;
    const answer = isPart1Missing ? part1 : part2;

    const visualPart1 = isPart1Missing ? '?' : part1;
    const visualPart2 = isPart1Missing ? part2 : '?';
    const knownPart = isPart1Missing ? part2 : part1;

    const questionTextRaw = `Look at the number bond. What is the missing part?`;
    const questionTextShort = `Missing part:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: generateOptions(answer, "number"),
          defectMap: generateDefectMap(answer, "number"),
          hint: "To find a missing part, subtract the known part from the whole.",
          finalAnswer: String(answer),
          solutionSteps: `1. The whole is ${whole}.\\n2. The known part is ${knownPart}.\\n3. To find the missing part, subtract: ${whole} - ${knownPart} = ${answer}.`
        },
        visualEngine: createNumberBond(whole, visualPart1, visualPart2),
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: false }
    };
  }

  // 3. foundation_addition_equation
  if (activeVariant === 'foundation_addition_equation') {
    let part1 = Math.floor(Math.random() * 8) + 1;
    let part2 = Math.floor(Math.random() * (9 - part1)) + 1; 
    
    // Ensure we start with smaller part for a single correct answer in short answer
    const smallerPart = Math.min(part1, part2);
    const largerPart = Math.max(part1, part2);
    const whole = part1 + part2;
    
    const correctEq = `${smallerPart} + ${largerPart} = ${whole}`;
    
    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      options = [
        correctEq,
        `${largerPart} + ${whole} = ${smallerPart}`, // Wrong logic
        `${whole} + ${smallerPart} = ${largerPart}`, // Wrong logic
        `${largerPart} - ${smallerPart} = ${whole}` // Wrong operation
      ].sort(() => Math.random() - 0.5);
      
      defectMap = {
        [`${largerPart} + ${whole} = ${smallerPart}`]: "CONCEPTUAL_ERROR",
        [`${whole} + ${smallerPart} = ${largerPart}`]: "CONCEPTUAL_ERROR",
        [`${largerPart} - ${smallerPart} = ${whole}`]: "CONCEPTUAL_ERROR"
      };
    }

    const questionTextRaw = `Write the addition equation that matches the number bond. (Start with the smaller part)`;
    const questionTextShort = `Correct addition equation (Start with smaller part):`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctEq}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "An addition equation adds the two parts together to get the whole. Remember to start with the smaller part.",
          finalAnswer: correctEq,
          solutionSteps: `1. The two parts are ${smallerPart} and ${largerPart}.\\n2. The whole is ${whole}.\\n3. The addition equation is Part + Part = Whole.\\n4. So, ${smallerPart} + ${largerPart} = ${whole}.`
        },
        visualEngine: createNumberBond(whole, part1, part2),
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: false }
    };
  }

  // 4. foundation_subtraction_equation
  if (activeVariant === 'foundation_subtraction_equation') {
    let part1 = Math.floor(Math.random() * 8) + 1;
    let part2 = Math.floor(Math.random() * (9 - part1)) + 1; 
    
    // Ensure we subtract the smaller part for a single correct answer in short answer
    const smallerPart = Math.min(part1, part2);
    const largerPart = Math.max(part1, part2);
    const whole = part1 + part2;
    
    const correctEq = `${whole} - ${smallerPart} = ${largerPart}`;
    
    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      options = [
        correctEq,
        `${smallerPart} - ${largerPart} = ${whole}`, // Wrong logic
        `${largerPart} - ${whole} = ${smallerPart}`, // Wrong logic
        `${smallerPart} + ${largerPart} = ${whole}`  // Wrong operation (they asked for subtraction)
      ].sort(() => Math.random() - 0.5);
      
      defectMap = {
        [`${smallerPart} - ${largerPart} = ${whole}`]: "CONCEPTUAL_ERROR",
        [`${largerPart} - ${whole} = ${smallerPart}`]: "CONCEPTUAL_ERROR",
        [`${smallerPart} + ${largerPart} = ${whole}`]: "CONCEPTUAL_ERROR"
      };
    }

    const questionTextRaw = `Write the subtraction equation that matches the number bond. (Subtract the smaller part from the whole)`;
    const questionTextShort = `Correct subtraction equation (Subtract smaller part):`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctEq}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "A subtraction equation starts with the whole, subtracts one part, and equals the other part. Remember to subtract the smaller part.",
          finalAnswer: correctEq,
          solutionSteps: `1. The whole is ${whole}. The two parts are ${smallerPart} and ${largerPart}.\\n2. The subtraction equation is Whole - Part = Part.\\n3. Subtracting the smaller part: ${correctEq}.`
        },
        visualEngine: createNumberBond(whole, part1, part2),
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: false }
    };
  }

  // 5. foundation_true_false_bond
  if (activeVariant === 'foundation_true_false_bond') {
    const part1 = Math.floor(Math.random() * 8) + 1;
    const part2 = Math.floor(Math.random() * (9 - part1)) + 1; 
    
    const isCorrect = Math.random() > 0.5;
    
    let displayedWhole;
    if (isCorrect) {
      displayedWhole = part1 + part2;
    } else {
      const offset = Math.random() > 0.5 ? 1 : -1;
      displayedWhole = (part1 + part2) + offset;
      if (displayedWhole <= 0) displayedWhole = 2; // Safety
    }

    const answer = isCorrect ? "True" : "False";

    const questionTextRaw = `True or False: The number bond is correct.`;
    const questionTextShort = `Is bond correct? (True/False):`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      options = ["True", "False"];
      defectMap = { [isCorrect ? "False" : "True"]: "CONCEPTUAL_ERROR" };
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: (!isMCQ) ? `${questionText} (True or False)` : questionText,
          options: options,
          defectMap: defectMap,
          hint: "Add the two parts together. Does their sum equal the whole shown?",
          finalAnswer: answer,
          solutionSteps: `1. The two parts are ${part1} and ${part2}.\\n2. Add them: ${part1} + ${part2} = ${part1 + part2}.\\n3. The whole shown is ${displayedWhole}.\\n4. Since ${part1 + part2} ${isCorrect ? 'is equal to' : 'is not equal to'} ${displayedWhole}, the statement is ${answer}.`
        },
        visualEngine: createNumberBond(displayedWhole, part1, part2),
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: false }
    };
  }

  return null;
};
