import { getRandomNames } from '@/lib/utils/variable-bank';

export const standardLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, getQText) => {

  const commonMeta = {
    zodType,
    difficulty: zodDiff,
    level,
    topic
  };

  const inputType = isStructure ? 'MULTI_STEP_INPUT' : (isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT');

  // Helper to generate a fact family with numbers up to 40
  const generateFact = () => {
    // Keep it such that a + b <= 40
    const c = Math.floor(Math.random() * 20) + 20; // 20 to 39
    const a = Math.floor(Math.random() * (c - 10)) + 5; // 5 to c-5
    const b = c - a;
    return { a, b, c };
  };

  // 1. standard_missing_part_family
  if (activeVariant === 'standard_missing_part_family') {
    const { a, b, c } = generateFact();
    const isAddition = Math.random() > 0.5;
    
    let questionTextRaw, questionTextShort, correctAns, hint, solutionSteps;
    let missingIsA = Math.random() > 0.5;

    if (isAddition) {
      if (missingIsA) {
        questionTextRaw = `Fill in the missing number: [ ? ] + ${b} = ${c}`;
        questionTextShort = `[?] + ${b} = ${c}`;
        correctAns = a.toString();
        hint = `If you know the total and one part, you can subtract to find the other part.`;
        solutionSteps = `1. The equation is missing a part.\\n2. The whole is ${c} and one part is ${b}.\\n3. To find the missing part, we use subtraction: ${c} - ${b} = ${a}.\\n4. The missing number is ${a}.`;
      } else {
        questionTextRaw = `Fill in the missing number: ${a} + [ ? ] = ${c}`;
        questionTextShort = `${a} + [?] = ${c}`;
        correctAns = b.toString();
        hint = `If you know the total and one part, you can subtract to find the other part.`;
        solutionSteps = `1. The equation is missing a part.\\n2. The whole is ${c} and one part is ${a}.\\n3. To find the missing part, we use subtraction: ${c} - ${a} = ${b}.\\n4. The missing number is ${b}.`;
      }
    } else {
      // Subtraction: c - ? = a  OR ? - b = a
      if (missingIsA) {
        // missing the part
        questionTextRaw = `Fill in the missing number: ${c} - [ ? ] = ${a}`;
        questionTextShort = `${c} - [?] = ${a}`;
        correctAns = b.toString();
        hint = `If you know the whole and the part that is left, subtract to find the part taken away.`;
        solutionSteps = `1. The whole is ${c}, and after taking away a part, we are left with ${a}.\\n2. To find the part we took away, we can subtract: ${c} - ${a} = ${b}.\\n3. The missing number is ${b}.`;
      } else {
        // missing the whole
        questionTextRaw = `Fill in the missing number: [ ? ] - ${b} = ${a}`;
        questionTextShort = `[?] - ${b} = ${a}`;
        correctAns = c.toString();
        hint = `If you took something away and have some left, add them back together to find what you started with!`;
        solutionSteps = `1. The equation is missing the starting number, which is the whole.\\n2. We took away ${b} and have ${a} left.\\n3. To find the whole, we add the parts back together: ${a} + ${b} = ${c}.\\n4. The missing number is ${c}.`;
      }
    }

    const questionText = getQText(questionTextRaw, questionTextShort);
    
    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      const numAns = parseInt(correctAns);
      options = [
        correctAns,
        (numAns + 10).toString(),
        (numAns > 10 ? numAns - 10 : numAns + 5).toString(),
        (numAns + 1).toString()
      ].sort(() => Math.random() - 0.5);
      
      defectMap = {
        [(numAns + 10).toString()]: "CONCEPTUAL_ERROR",
        [(numAns > 10 ? numAns - 10 : numAns + 5).toString()]: "CONCEPTUAL_ERROR",
        [(numAns + 1).toString()]: "CARELESS_CALCULATION"
      };
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctAns}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: hint,
          finalAnswer: correctAns,
          solutionSteps: solutionSteps
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: true }
    };
  }

  // 2. standard_inverse_word_problem
  if (activeVariant === 'standard_inverse_word_problem') {
    const name = getRandomNames(1);
    const { a, b, c } = generateFact(); // a + b = c
    
    // Start Unknown: "Name had some items. Got b more, now has c. How many at first?" (a)
    // Or: "Name had some items. Lost a, now has b. How many at first?" (c)
    
    const isAdditionContext = Math.random() > 0.5;
    let questionTextRaw, questionTextShort, correctAns, hint, solutionSteps;
    
    if (isAdditionContext) {
      questionTextRaw = `${name} had some stickers. They received ${b} more stickers. Now they have ${c} stickers in total. How many stickers did ${name} have at first?`;
      questionTextShort = `Start unknown: got ${b}, now has ${c}. Started with:`;
      correctAns = a.toString();
      hint = "Work backwards! If they ended up with more, you need to subtract to find the starting amount.";
      solutionSteps = `1. ${name} ended with ${c} stickers.\\n2. They got ${b} stickers to reach that total.\\n3. This means: [ ? ] + ${b} = ${c}.\\n4. To find the starting amount, we subtract: ${c} - ${b} = ${a}.\\n5. ${name} started with ${a} stickers.`;
    } else {
      questionTextRaw = `${name} had some marbles. They lost ${a} marbles. Now they have ${b} marbles left. How many marbles did ${name} have at first?`;
      questionTextShort = `Start unknown: lost ${a}, now has ${b}. Started with:`;
      correctAns = c.toString();
      hint = "Work backwards! If they lost some and have some left, put them together to find the starting amount.";
      solutionSteps = `1. ${name} has ${b} marbles left.\\n2. They lost ${a} marbles.\\n3. This means: [ ? ] - ${a} = ${b}.\\n4. To find the starting amount, we add them together: ${b} + ${a} = ${c}.\\n5. ${name} started with ${c} marbles.`;
    }

    const questionText = getQText(questionTextRaw, questionTextShort);
    
    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      const numAns = parseInt(correctAns);
      options = [
        correctAns,
        (Math.abs(a - b) || a + 2).toString(), // Usually wrong operation or distractor
        (c + a).toString(), // Wrong operation
        (numAns + 1).toString()
      ].sort(() => Math.random() - 0.5);
      
      defectMap = {
        [(Math.abs(a - b) || a + 2).toString()]: "CONCEPTUAL_ERROR",
        [(c + a).toString()]: "CONCEPTUAL_ERROR",
        [(numAns + 1).toString()]: "CARELESS_CALCULATION"
      };
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctAns}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: hint,
          finalAnswer: correctAns,
          solutionSteps: solutionSteps
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: true }
    };
  }

  // 3. standard_identify_wrong_family_member
  if (activeVariant === 'standard_identify_wrong_family_member') {
    // Note: Router guarantees this is MCQ only.
    const { a, b, c } = generateFact();
    
    const eq1 = `${a} + ${b} = ${c}`;
    const eq2 = `${b} + ${a} = ${c}`;
    const eq3 = `${c} - ${a} = ${b}`;
    const eq4 = `${c} - ${b} = ${a}`;
    
    // Make an imposter
    const imposterType = Math.floor(Math.random() * 3);
    let imposterEq;
    if (imposterType === 0) {
      imposterEq = `${a} + ${c} = ${b}`; // Mathematically wrong and wrong family
    } else if (imposterType === 1) {
      imposterEq = `${b} - ${a} = ${c}`;
    } else {
      imposterEq = `${a} - ${b} = ${c}`;
    }

    // Give 3 valid and 1 imposter
    const validEquations = [eq1, eq2, eq3, eq4].sort(() => Math.random() - 0.5);
    
    const questionTextRaw = `Three of these equations belong to the same related family for ${a}, ${b}, and ${c}. Which equation is INCORRECT?`;
    const questionTextShort = `Find the incorrect equation for ${a}, ${b}, ${c}:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const correctAns = imposterEq;
    const options = [validEquations[0], validEquations[1], validEquations[2], imposterEq].sort(() => Math.random() - 0.5);
    
    const defectMap = {
      [validEquations[0]]: "CONCEPTUAL_ERROR",
      [validEquations[1]]: "CONCEPTUAL_ERROR",
      [validEquations[2]]: "CONCEPTUAL_ERROR"
    };

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctAns}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "Check which equation does not make sense! A smaller number cannot be the whole in addition.",
          finalAnswer: correctAns,
          solutionSteps: `1. A complete set of related equations uses the same three numbers.\\n2. The whole (the largest number, ${c}) must be the answer when adding.\\n3. The whole (${c}) must be the starting number when subtracting.\\n4. Looking at the choices, ${imposterEq} does not follow these rules and is incorrect.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: true }
    };
  }

  // 4. standard_balance_with_inverse
  if (activeVariant === 'standard_balance_with_inverse') {
    // Equation: X - Y = A + B
    // Where X - Y is the left side, A + B is the right side.
    const leftTotal = Math.floor(Math.random() * 15) + 10; // 10 to 24
    
    const x = Math.floor(Math.random() * 10) + leftTotal; // up to 34
    const y = x - leftTotal;
    
    const a = Math.floor(Math.random() * (leftTotal - 2)) + 1;
    const b = leftTotal - a;

    // which one is missing?
    const missingSlot = Math.floor(Math.random() * 4); // 0=x, 1=y, 2=a, 3=b
    let questionStr = "";
    let correctAns = "";
    let missingNum = 0;
    
    if (missingSlot === 0) {
      questionStr = `[ ? ] - ${y} = ${a} + ${b}`;
      correctAns = x.toString(); missingNum = x;
    } else if (missingSlot === 1) {
      questionStr = `${x} - [ ? ] = ${a} + ${b}`;
      correctAns = y.toString(); missingNum = y;
    } else if (missingSlot === 2) {
      questionStr = `${x} - ${y} = [ ? ] + ${b}`;
      correctAns = a.toString(); missingNum = a;
    } else {
      questionStr = `${x} - ${y} = ${a} + [ ? ]`;
      correctAns = b.toString(); missingNum = b;
    }
    
    const questionTextRaw = `Find the missing number to balance the equation:\\n${questionStr}`;
    const questionTextShort = `Balance: ${questionStr}`;
    const questionText = getQText(questionTextRaw, questionTextShort);
    
    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      options = [
        correctAns,
        (missingNum + 10).toString(),
        (Math.abs(missingNum - 2) || missingNum + 3).toString(),
        (missingNum + 1).toString()
      ].sort(() => Math.random() - 0.5);
      
      defectMap = {
        [(missingNum + 10).toString()]: "CONCEPTUAL_ERROR",
        [(Math.abs(missingNum - 2) || missingNum + 3).toString()]: "CONCEPTUAL_ERROR",
        [(missingNum + 1).toString()]: "CARELESS_CALCULATION"
      };
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctAns}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "Solve the side of the equation that has all the numbers first. Then use that total to find the missing part on the other side.",
          finalAnswer: correctAns,
          solutionSteps: `1. The equal sign means both sides must have the same total.\\n2. First, solve the side we know completely.\\n3. ${missingSlot < 2 ? `${a} + ${b} = ${leftTotal}` : `${x} - ${y} = ${leftTotal}`}.\\n4. Now we know the other side must also equal ${leftTotal}.\\n5. ${missingSlot === 0 ? `[?] - ${y} = ${leftTotal}, so ${leftTotal} + ${y} = ${x}.` : 
              missingSlot === 1 ? `${x} - [?] = ${leftTotal}, so ${x} - ${leftTotal} = ${y}.` :
              missingSlot === 2 ? `[?] + ${b} = ${leftTotal}, so ${leftTotal} - ${b} = ${a}.` :
                                  `${a} + [?] = ${leftTotal}, so ${leftTotal} - ${a} = ${b}.`}\\n6. The missing number is ${correctAns}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: true }
    };
  }

  // 5. standard_related_subtraction_to_subtraction
  if (activeVariant === 'standard_related_subtraction_to_subtraction') {
    const { a, b, c } = generateFact();
    
    // If c - a = b, what is c - b?
    const questionTextRaw = `If ${c} - ${a} = ${b}, then what is ${c} - ${b}?`;
    const questionTextShort = `If ${c} - ${a} = ${b}, ${c} - ${b} = ?`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const correctAns = a.toString();
    
    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      options = [
        correctAns,
        c.toString(),
        b.toString(), // They might just pick the number they saw
        (a + 1).toString()
      ].sort(() => Math.random() - 0.5);
      
      // Filter unique just in case a == b
      if (a === b) {
        options = [correctAns, c.toString(), (a+2).toString(), (a+1).toString()].sort(() => Math.random() - 0.5);
      }
      
      defectMap = {
        [c.toString()]: "CONCEPTUAL_ERROR",
        [b.toString()]: "CONCEPTUAL_ERROR",
        [(a + 2).toString()]: "CARELESS_CALCULATION",
        [(a + 1).toString()]: "CARELESS_CALCULATION"
      };
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctAns}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "In a fact family, if you subtract one part from the whole, you get the other part.",
          finalAnswer: correctAns,
          solutionSteps: `1. The numbers are ${a}, ${b}, and ${c}. The whole is ${c}.\\n2. The subtraction equation ${c} - ${a} = ${b} tells us taking away one part leaves the other.\\n3. If we swap the parts and take away ${b} instead, we must be left with the first part, which is ${a}.\\n4. So, ${c} - ${b} = ${a}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: true }
    };
  }

  return null;
};
