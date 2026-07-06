import { getRandomNames } from '@/lib/utils/variable-bank';

export const foundationLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, getQText) => {

  const commonMeta = {
    zodType,
    difficulty: zodDiff,
    level,
    topic
  };

  const inputType = isStructure ? 'MULTI_STEP_INPUT' : (isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT');

  // Helper to generate NO REGROUPING addition
  // tens1 + tens2 < 10, ones1 + ones2 < 10
  const generateNoRegroup = (tens1Max = 9, ones1Max = 9, tens2Max = 9, ones2Max = 9) => {
    let tens1 = 0, ones1 = 0, tens2 = 0, ones2 = 0;
    while (true) {
      tens1 = Math.floor(Math.random() * (tens1Max + 1));
      ones1 = Math.floor(Math.random() * (ones1Max + 1));
      tens2 = Math.floor(Math.random() * (tens2Max + 1));
      ones2 = Math.floor(Math.random() * (ones2Max + 1));
      
      if (tens1 + tens2 > 9 || tens1 + tens2 === 0) continue; // Must be < 100, and not both zero
      if (ones1 + ones2 > 9) continue;
      
      const num1 = tens1 * 10 + ones1;
      const num2 = tens2 * 10 + ones2;
      // Prevent trivial 0 + x
      if (num1 === 0 || num2 === 0) continue;
      
      return { num1, num2, tens1, ones1, tens2, ones2, sum: num1 + num2 };
    }
  };

  // 1. foundation_add_tens
  if (activeVariant === 'foundation_add_tens') {
    // Both ones must be 0
    const { num1, num2, sum, tens1, tens2 } = generateNoRegroup(9, 0, 9, 0);
    
    const questionTextRaw = `Find the sum: ${num1} + ${num2} = [ ? ]`;
    const questionTextShort = `${num1} + ${num2} = ?`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const correctAns = sum.toString();
    const hint = `Count the tens! ${tens1} tens + ${tens2} tens = ${tens1 + tens2} tens.`;
    const solutionSteps = `1. The numbers are ${num1} and ${num2}.\\n2. They only have tens, no ones.\\n3. ${tens1} tens + ${tens2} tens = ${tens1 + tens2} tens.\\n4. ${tens1 + tens2} tens is ${sum}.\\n5. The answer is ${sum}.`;

    let options = null;
    let defectMap = null;

    if (isMCQ) {
      options = [
        correctAns,
        (sum + 10).toString(),
        (Math.abs(num1 - num2) || sum + 20).toString(),
        ((tens1 + tens2) * 10 + 10).toString() // Just in case it's same as sum+10, but set will filter
      ].sort(() => Math.random() - 0.5);
      
      options = [...new Set(options)];
      while(options.length < 4) {
        options.push((sum + options.length * 10).toString());
      }
      options.sort(() => Math.random() - 0.5);

      defectMap = {};
      options.forEach(opt => {
        if (opt !== correctAns) defectMap[opt] = "CARELESS_CALCULATION";
      });
      if (options.includes(Math.abs(num1 - num2).toString())) {
        defectMap[Math.abs(num1 - num2).toString()] = "CONCEPTUAL_ERROR";
      }
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
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  // 2. foundation_add_one_digit_no_regroup
  if (activeVariant === 'foundation_add_one_digit_no_regroup') {
    // num1 is 2-digit (10-89), num2 is 1-digit (1-9)
    const { num1, num2, sum, tens1, ones1, ones2 } = generateNoRegroup(8, 8, 0, 8);
    
    // Ensure num1 is 2-digit and num2 is 1-digit
    const n1 = Math.max(num1, num2);
    const n2 = Math.min(num1, num2);
    
    // Safety check just in case, though the rng constraints should enforce it
    const actualTens = Math.floor(n1 / 10);
    const actualOnes1 = n1 % 10;
    const actualOnes2 = n2;
    
    const questionTextRaw = `Add the numbers: ${n1} + ${n2} = [ ? ]`;
    const questionTextShort = `${n1} + ${n2} = ?`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const correctAns = sum.toString();
    const hint = `Add the ones together first! ${actualOnes1} ones + ${actualOnes2} ones = ${actualOnes1 + actualOnes2} ones.`;
    const solutionSteps = `1. We are adding ${n1} and ${n2}.\\n2. Add the ones: ${actualOnes1} + ${actualOnes2} = ${actualOnes1 + actualOnes2}.\\n3. The tens place stays the same: ${actualTens} tens.\\n4. So, ${n1} + ${n2} = ${sum}.`;

    let options = null;
    let defectMap = null;

    if (isMCQ) {
      options = [
        correctAns,
        (sum + 10).toString(), // Added to tens instead
        (sum + 1).toString(), // Off by 1
        (sum - 1).toString()
      ];
      options = [...new Set(options)].sort(() => Math.random() - 0.5);
      
      defectMap = {
        [(sum + 10).toString()]: "CONCEPTUAL_ERROR",
        [(sum + 1).toString()]: "CARELESS_CALCULATION",
        [(sum - 1).toString()]: "CARELESS_CALCULATION"
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
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  // 3. foundation_add_two_digit_no_regroup
  if (activeVariant === 'foundation_add_two_digit_no_regroup') {
    // Both are 2-digit numbers
    let generated;
    while (true) {
      generated = generateNoRegroup(8, 8, 8, 8);
      if (generated.num1 > 9 && generated.num2 > 9) break;
    }
    const { num1, num2, sum, tens1, ones1, tens2, ones2 } = generated;
    
    const questionTextRaw = `Add the numbers: ${num1} + ${num2} = [ ? ]`;
    const questionTextShort = `${num1} + ${num2} = ?`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const correctAns = sum.toString();
    const hint = `Add the ones together, then add the tens together!`;
    const solutionSteps = `1. We are adding ${num1} and ${num2}.\\n2. Add the ones: ${ones1} + ${ones2} = ${ones1 + ones2}.\\n3. Add the tens: ${tens1} + ${tens2} = ${tens1 + tens2} tens.\\n4. Put them together: ${tens1 + tens2} tens and ${ones1 + ones2} ones is ${sum}.`;

    let options = null;
    let defectMap = null;

    if (isMCQ) {
      const wrongTens = (tens1 + tens2 + 1) * 10 + (ones1 + ones2);
      const wrongOnes = (tens1 + tens2) * 10 + (ones1 + ones2 + 1);
      
      options = [
        correctAns,
        wrongTens.toString(),
        wrongOnes.toString(),
        (sum - 10).toString()
      ];
      options = [...new Set(options)].sort(() => Math.random() - 0.5);
      
      defectMap = {
        [wrongTens.toString()]: "CARELESS_CALCULATION",
        [wrongOnes.toString()]: "CARELESS_CALCULATION",
        [(sum - 10).toString()]: "CARELESS_CALCULATION"
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
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  // 4. foundation_add_tens_and_ones_decomposition
  if (activeVariant === 'foundation_add_tens_and_ones_decomposition') {
    // "Add 3 tens and 4 ones to 20"
    let generated;
    while (true) {
      generated = generateNoRegroup(8, 8, 8, 0); // num2 is a multiple of 10
      if (generated.num1 > 10 && generated.num2 > 9) break;
    }
    const { num1, num2, sum, tens1, ones1, tens2 } = generated; // num1 will be the decomposed part
    
    const questionTextRaw = `Add ${tens1} tens and ${ones1} ones to ${num2}. What is the total?`;
    const questionTextShort = `Add ${tens1} tens ${ones1} ones to ${num2}:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const correctAns = sum.toString();
    const hint = `First, figure out what number ${tens1} tens and ${ones1} ones is. Then add it to ${num2}.`;
    const solutionSteps = `1. First, ${tens1} tens and ${ones1} ones is the number ${num1}.\\n2. The question is asking us to add ${num1} to ${num2}.\\n3. ${num1} + ${num2} = ${sum}.\\n4. The total is ${sum}.`;

    let options = null;
    let defectMap = null;

    if (isMCQ) {
      // Common error: just adding the single digits: tens1 + ones1 + tens2
      const wrongAddDigits = tens1 + ones1 + tens2;
      const wrongPlaceValue = (ones1 * 10 + tens1) + num2; // swapped tens and ones
      
      options = [
        correctAns,
        wrongAddDigits.toString(),
        wrongPlaceValue.toString(),
        (sum + 10).toString()
      ];
      options = [...new Set(options)].sort(() => Math.random() - 0.5);
      if (options.length < 4) options.push((sum - 10).toString());
      
      defectMap = {
        [wrongAddDigits.toString()]: "CONCEPTUAL_ERROR",
        [wrongPlaceValue.toString()]: "CONCEPTUAL_ERROR",
        [(sum + 10).toString()]: "CARELESS_CALCULATION"
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
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  // 5. foundation_add_word_problem_no_regroup
  if (activeVariant === 'foundation_add_word_problem_no_regroup') {
    const name = getRandomNames(1);
    
    let generated;
    while (true) {
      generated = generateNoRegroup(8, 8, 8, 8);
      if (generated.num1 > 10 && generated.num2 > 10) break; // Two reasonable amounts
    }
    const { num1, num2, sum, tens1, ones1, tens2, ones2 } = generated;
    
    const isItems = Math.random() > 0.5;
    let itemWord = isItems ? "marbles" : "stickers";
    
    const questionTextRaw = `${name} has ${num1} red ${itemWord} and ${num2} blue ${itemWord}. How many ${itemWord} does ${name} have in total?`;
    const questionTextShort = `Has ${num1} red, ${num2} blue. Total = ?`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const correctAns = sum.toString();
    const hint = `When you want to find the total, you add the two numbers together.`;
    const solutionSteps = `1. ${name} has ${num1} red ${itemWord} and ${num2} blue ${itemWord}.\\n2. To find the total, we add them together: ${num1} + ${num2}.\\n3. Add the ones: ${ones1} + ${ones2} = ${ones1 + ones2}.\\n4. Add the tens: ${tens1} + ${tens2} = ${tens1 + tens2}.\\n5. ${num1} + ${num2} = ${sum}.\\n6. ${name} has ${sum} ${itemWord} in total.`;

    let options = null;
    let defectMap = null;

    if (isMCQ) {
      options = [
        correctAns,
        Math.abs(num1 - num2).toString(), // Subtracted instead
        (sum + 10).toString(),
        (sum + 1).toString()
      ];
      options = [...new Set(options)].sort(() => Math.random() - 0.5);
      
      defectMap = {
        [Math.abs(num1 - num2).toString()]: "CONCEPTUAL_ERROR",
        [(sum + 10).toString()]: "CARELESS_CALCULATION",
        [(sum + 1).toString()]: "CARELESS_CALCULATION"
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
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  return null;
};
