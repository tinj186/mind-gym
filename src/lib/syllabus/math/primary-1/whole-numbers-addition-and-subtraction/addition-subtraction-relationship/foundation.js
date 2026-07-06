export const foundationLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, getQText) => {

  const commonMeta = {
    zodType,
    difficulty: zodDiff,
    level,
    topic
  };

  const inputType = isStructure ? 'MULTI_STEP_INPUT' : (isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT');

  // Helper to generate a fact family (a + b = c)
  const generateFact = () => {
    const a = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const b = Math.floor(Math.random() * 8) + 2; // 2 to 9
    return { a, b, c: a + b };
  };

  // 1. foundation_commutative_addition
  if (activeVariant === 'foundation_commutative_addition') {
    const { a, b, c } = generateFact();
    const correctEq = `${b} + ${a} = ${c}`;
    
    const questionTextRaw = `If ${a} + ${b} = ${c}, what is ${b} + ${a}?`;
    const questionTextShort = `If ${a} + ${b} = ${c}, ${b} + ${a} = ?`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      options = [
        c.toString(),
        (c + 1).toString(),
        (Math.abs(a - b)).toString(),
        (c + 2).toString()
      ].sort(() => Math.random() - 0.5);
      
      defectMap = {
        [(c + 1).toString()]: "CARELESS_CALCULATION",
        [(Math.abs(a - b)).toString()]: "CONCEPTUAL_ERROR",
        [(c + 2).toString()]: "CARELESS_CALCULATION"
      };
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${c}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "When you add, the order of the numbers does not matter.",
          finalAnswer: c.toString(),
          solutionSteps: `1. We know that ${a} + ${b} = ${c}.\\n2. In addition, changing the order of the numbers gives the same total.\\n3. Therefore, ${b} + ${a} is also ${c}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  // 2. foundation_addition_to_subtraction
  if (activeVariant === 'foundation_addition_to_subtraction') {
    const { a, b, c } = generateFact();
    
    const questionTextRaw = `If ${a} + ${b} = ${c}, what is ${c} - ${a}?`;
    const questionTextShort = `If ${a} + ${b} = ${c}, ${c} - ${a} = ?`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const correctAns = b.toString();
    
    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      options = [
        b.toString(),
        (b + 1).toString(),
        c.toString(),
        Math.abs(b - 1).toString()
      ].sort(() => Math.random() - 0.5);
      
      defectMap = {
        [(b + 1).toString()]: "CARELESS_CALCULATION",
        [c.toString()]: "CONCEPTUAL_ERROR",
        [Math.abs(b - 1).toString()]: "CARELESS_CALCULATION"
      };
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctAns}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "Addition and subtraction are related! Look at the three numbers used in the addition equation.",
          finalAnswer: correctAns,
          solutionSteps: `1. The addition equation uses the numbers ${a}, ${b}, and ${c}.\\n2. Subtraction is the opposite of addition.\\n3. If you take away ${a} from the total ${c}, you are left with the other part, which is ${b}.\\n4. So, ${c} - ${a} = ${b}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  // 3. foundation_subtraction_to_addition
  if (activeVariant === 'foundation_subtraction_to_addition') {
    const { a, b, c } = generateFact();
    
    const questionTextRaw = `If ${c} - ${b} = ${a}, what is ${a} + ${b}?`;
    const questionTextShort = `If ${c} - ${b} = ${a}, ${a} + ${b} = ?`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const correctAns = c.toString();
    
    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      options = [
        c.toString(),
        (Math.abs(a - b)).toString(),
        (c + 1).toString(),
        (c - 1).toString()
      ].sort(() => Math.random() - 0.5);
      
      defectMap = {
        [(Math.abs(a - b)).toString()]: "CONCEPTUAL_ERROR",
        [(c + 1).toString()]: "CARELESS_CALCULATION",
        [(c - 1).toString()]: "CARELESS_CALCULATION"
      };
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctAns}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "Addition and subtraction are opposites. Putting the parts back together gives you the whole.",
          finalAnswer: correctAns,
          solutionSteps: `1. The subtraction equation tells us that ${c} is the whole, and ${a} and ${b} are the parts.\\n2. When we add the parts (${a} and ${b}) back together, we get the whole.\\n3. So, ${a} + ${b} = ${c}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  // 4. foundation_identify_fact_family
  if (activeVariant === 'foundation_identify_fact_family') {
    const { a, b, c } = generateFact();
    const numbersList = [a, b, c].sort((x, y) => x - y).join(", ");
    
    const questionTextRaw = `Which equation uses the same relationship as these numbers: ${numbersList}?`;
    const questionTextShort = `Related equation for ${numbersList}:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    // Pick one correct equation from the 4 valid ones
    const validEquations = [
      `${a} + ${b} = ${c}`,
      `${b} + ${a} = ${c}`,
      `${c} - ${a} = ${b}`,
      `${c} - ${b} = ${a}`
    ];
    const correctEq = validEquations[Math.floor(Math.random() * validEquations.length)];
    
    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      const invalidEquations = [
        `${a} + ${c} = ${b}`,
        `${b} + ${c} = ${a}`,
        `${a} - ${b} = ${c}`,
        `${b} - ${a} = ${c}`,
        `${a} - ${c} = ${b}`,
        `${b} - ${c} = ${a}`
      ];
      const distractors = invalidEquations.slice(0, 3);
      
      options = [correctEq, ...distractors].sort(() => Math.random() - 0.5);
      defectMap = {};
      distractors.forEach(d => defectMap[d] = "CONCEPTUAL_ERROR");
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctEq}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "The biggest number must be the total when you add, or the number you start with when you subtract.",
          finalAnswer: correctEq,
          solutionSteps: `1. The numbers are ${numbersList}. The largest number is ${c}.\\n2. In a set of related equations, the two smaller parts (${a} and ${b}) add up to the whole (${c}).\\n3. Also, the whole (${c}) minus one part equals the other part.\\n4. The correct equation using these rules is: ${correctEq}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  // 5. foundation_missing_family_member
  if (activeVariant === 'foundation_missing_family_member') {
    const { a, b, c } = generateFact();
    
    // The 4 equations in the family
    const eq1 = `${a} + ${b} = ${c}`;
    const eq2 = `${b} + ${a} = ${c}`;
    const eq3 = `${c} - ${a} = ${b}`;
    const eq4 = `${c} - ${b} = ${a}`;
    
    const allEqs = [eq1, eq2, eq3, eq4];
    
    // Pick one to be the missing one
    const missingIndex = Math.floor(Math.random() * 4);
    const correctEq = allEqs[missingIndex];
    
    // The other 3 are shown to the student
    const shownEqs = allEqs.filter((_, idx) => idx !== missingIndex);

    const questionTextRaw = `These 4 equations are related. Here are 3 of them: ${shownEqs[0]}, ${shownEqs[1]}, and ${shownEqs[2]}. What is the 4th missing equation?`;
    const questionTextShort = `Find the missing related equation: ${shownEqs[0]}, ${shownEqs[1]}, ${shownEqs[2]}. Missing:`;
    const questionText = getQText(questionTextRaw, questionTextShort);
    
    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      const distractors = [
        `${a} + ${c} = ${b}`, // wrong add
        `${c} + ${a} = ${b}`, // wrong add
        `${a} - ${b} = ${c}`, // wrong sub
        `${b} - ${a} = ${c}`  // wrong sub
      ].slice(0, 3);
      
      options = [correctEq, ...distractors].sort(() => Math.random() - 0.5);
      defectMap = {};
      distractors.forEach(d => defectMap[d] = "CONCEPTUAL_ERROR");
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctEq}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "Related equations have two addition facts and two subtraction facts using the exact same three numbers.",
          finalAnswer: correctEq,
          solutionSteps: `1. A complete set of related equations for ${a}, ${b}, and ${c} has 4 facts.\\n2. The two addition equations are ${eq1} and ${eq2}.\\n3. The two subtraction equations are ${eq3} and ${eq4}.\\n4. Looking at the 3 given equations, the one that is missing is ${correctEq}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  return null;
};
