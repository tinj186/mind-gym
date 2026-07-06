import { getRandomNames } from '@/lib/utils/variable-bank';

export const standardLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, getQText) => {

  const commonMeta = {
    zodType,
    difficulty: zodDiff,
    level,
    topic
  };

  const inputType = isStructure ? 'MULTI_STEP_INPUT' : (isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT');

  // Helper to generate WITH REGROUPING addition
  // tens1 + tens2 < 9 (to keep sum <= 99 after regrouping), ones1 + ones2 >= 10
  const generateWithRegroup = (tens1Max = 8, ones1Max = 9, tens2Max = 8, ones2Max = 9) => {
    let tens1 = 0, ones1 = 0, tens2 = 0, ones2 = 0;
    while (true) {
      tens1 = Math.floor(Math.random() * (tens1Max + 1));
      ones1 = Math.floor(Math.random() * (ones1Max + 1));
      tens2 = Math.floor(Math.random() * (tens2Max + 1));
      ones2 = Math.floor(Math.random() * (ones2Max + 1));
      
      if (ones1 + ones2 < 10) continue; // MUST regroup
      if (tens1 + tens2 + 1 > 9) continue; // MUST keep sum < 100
      
      const num1 = tens1 * 10 + ones1;
      const num2 = tens2 * 10 + ones2;
      
      return { num1, num2, tens1, ones1, tens2, ones2, sum: num1 + num2 };
    }
  };

  // 1. standard_add_one_digit_with_regroup
  if (activeVariant === 'standard_add_one_digit_with_regroup') {
    // num1 is 2-digit, num2 is 1-digit, ones sum >= 10
    const { num1, num2, sum, tens1, ones1, ones2 } = generateWithRegroup(8, 9, 0, 9);
    
    // Ensure n1 is 2-digit and n2 is 1-digit
    const n1 = Math.max(num1, num2);
    const n2 = Math.min(num1, num2);
    const actualTens = Math.floor(n1 / 10);
    const actualOnes1 = n1 % 10;
    
    const questionTextRaw = `Add the numbers: ${n1} + ${n2} = [ ? ]`;
    const questionTextShort = `${n1} + ${n2} = ?`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const correctAns = sum.toString();
    const hint = `Add the ones first: ${actualOnes1} + ${n2} = ${actualOnes1 + n2}. Then you need to regroup 10 ones into 1 ten!`;
    const solutionSteps = `1. Add the ones: ${actualOnes1} + ${n2} = ${actualOnes1 + n2}.\\n2. Regroup ${actualOnes1 + n2} into 1 ten and ${actualOnes1 + n2 - 10} ones.\\n3. Add the tens: ${actualTens} tens + 1 regrouped ten = ${actualTens + 1} tens.\\n4. So, ${n1} + ${n2} = ${sum}.`;

    let options = null;
    let defectMap = null;

    if (isMCQ) {
      const forgotRegroup = actualTens * 10 + (actualOnes1 + n2 - 10);
      const addedToTens = (actualTens + n2) * 10 + actualOnes1;
      
      options = [
        correctAns,
        forgotRegroup.toString(),
        addedToTens.toString(),
        (sum + 10).toString()
      ];
      options = [...new Set(options)];
      while(options.length < 4) options.push((sum + Math.floor(Math.random() * 5) + 1).toString());
      options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [forgotRegroup.toString()]: "CONCEPTUAL_ERROR", // forgot to carry 1
        [addedToTens.toString()]: "CONCEPTUAL_ERROR" // added ones to tens
      };
      options.forEach(opt => {
        if (!defectMap[opt] && opt !== correctAns) defectMap[opt] = "CARELESS_CALCULATION";
      });
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

  // 2. standard_add_two_digit_with_regroup
  if (activeVariant === 'standard_add_two_digit_with_regroup') {
    let generated;
    while (true) {
      generated = generateWithRegroup(8, 9, 8, 9);
      if (generated.num1 > 9 && generated.num2 > 9) break; // Both 2-digit
    }
    const { num1, num2, sum, tens1, ones1, tens2, ones2 } = generated;
    
    const questionTextRaw = `Add the numbers: ${num1} + ${num2} = [ ? ]`;
    const questionTextShort = `${num1} + ${num2} = ?`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const correctAns = sum.toString();
    const hint = `Start with the ones: ${ones1} + ${ones2}. Since it is 10 or more, remember to carry over 1 ten!`;
    const solutionSteps = `1. Add the ones: ${ones1} + ${ones2} = ${ones1 + ones2}.\\n2. Regroup ${ones1 + ones2} into 1 ten and ${ones1 + ones2 - 10} ones.\\n3. Add the tens: ${tens1} + ${tens2} + 1 (regrouped ten) = ${tens1 + tens2 + 1} tens.\\n4. So, ${num1} + ${num2} = ${sum}.`;

    let options = null;
    let defectMap = null;

    if (isMCQ) {
      const forgotRegroup = (tens1 + tens2) * 10 + (ones1 + ones2 - 10);
      const regroupedToOnes = (tens1 + tens2) * 10 + (ones1 + ones2);
      
      options = [
        correctAns,
        forgotRegroup.toString(),
        regroupedToOnes.toString(),
        (sum + 10).toString()
      ];
      options = [...new Set(options)];
      while(options.length < 4) options.push((sum - 10).toString());
      options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [forgotRegroup.toString()]: "CONCEPTUAL_ERROR", // forgot to carry 1
        [regroupedToOnes.toString()]: "CONCEPTUAL_ERROR" // didn't regroup, kept it in ones place
      };
      options.forEach(opt => {
        if (!defectMap[opt] && opt !== correctAns) defectMap[opt] = "CARELESS_CALCULATION";
      });
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

  // 3. standard_add_three_numbers
  if (activeVariant === 'standard_add_three_numbers') {
    // a + b + c = sum < 100, where two of the numbers sum to a nice round 10, 20, 30
    const a = Math.floor(Math.random() * 20) + 5; // 5 to 24
    const aOnes = a % 10;
    const bOnes = 10 - aOnes;
    const bTens = Math.floor(Math.random() * 2);
    const b = bTens * 10 + bOnes; // forms a nice 10 with a
    const sumAB = a + b;
    const c = Math.floor(Math.random() * (90 - sumAB)) + 5;
    const sum = a + b + c;

    // Shuffle the three numbers so it's not always a + b first
    const nums = [a, b, c].sort(() => Math.random() - 0.5);
    
    const questionTextRaw = `Add the numbers: ${nums[0]} + ${nums[1]} + ${nums[2]} = [ ? ]`;
    const questionTextShort = `${nums[0]} + ${nums[1]} + ${nums[2]} = ?`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const correctAns = sum.toString();
    const hint = `Look for two numbers that are easy to add together first (like making a 10)!`;
    const solutionSteps = `1. To add 3 numbers easily, look for pairs that make 10.\\n2. Notice that ${a} and ${b} make a nice round number: ${a} + ${b} = ${sumAB}.\\n3. Then add the third number: ${sumAB} + ${c} = ${sum}.\\n4. The total is ${sum}.`;

    let options = null;
    let defectMap = null;

    if (isMCQ) {
      options = [
        correctAns,
        (sum + 10).toString(),
        (sum - 10).toString(),
        (Math.abs(nums[0] + nums[1] - nums[2])).toString() // subtracted the third instead
      ];
      options = [...new Set(options)];
      while(options.length < 4) options.push((sum + 1).toString());
      options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [(Math.abs(nums[0] + nums[1] - nums[2])).toString()]: "CONCEPTUAL_ERROR",
        [(sum + 10).toString()]: "CARELESS_CALCULATION",
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

  // 4. standard_add_word_problem_with_regroup
  if (activeVariant === 'standard_add_word_problem_with_regroup') {
    const name = getRandomNames(1);
    
    let generated;
    while (true) {
      generated = generateWithRegroup(8, 9, 8, 9);
      if (generated.num1 > 9 && generated.num2 > 9) break;
    }
    const { num1, num2, sum, tens1, ones1, tens2, ones2 } = generated;
    
    const questionTextRaw = `${name} baked ${num1} cookies on Saturday and ${num2} cookies on Sunday. How many cookies did ${name} bake altogether?`;
    const questionTextShort = `Baked ${num1} on Sat, ${num2} on Sun. Total = ?`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const correctAns = sum.toString();
    const hint = `Altogether means you need to add! Remember to regroup the ones if they add up to 10 or more.`;
    const solutionSteps = `1. ${name} baked ${num1} cookies and ${num2} cookies.\\n2. To find the total altogether, we add: ${num1} + ${num2}.\\n3. Add the ones: ${ones1} + ${ones2} = ${ones1 + ones2}. We regroup ${ones1 + ones2} into 1 ten and ${ones1 + ones2 - 10} ones.\\n4. Add the tens: ${tens1} + ${tens2} + 1 = ${tens1 + tens2 + 1} tens.\\n5. The total is ${sum} cookies.`;

    let options = null;
    let defectMap = null;

    if (isMCQ) {
      const forgotRegroup = (tens1 + tens2) * 10 + (ones1 + ones2 - 10);
      options = [
        correctAns,
        forgotRegroup.toString(),
        Math.abs(num1 - num2).toString(), // Subtract instead
        (sum + 10).toString()
      ];
      options = [...new Set(options)];
      while(options.length < 4) options.push((sum - 10).toString());
      options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [forgotRegroup.toString()]: "CONCEPTUAL_ERROR",
        [Math.abs(num1 - num2).toString()]: "CONCEPTUAL_ERROR",
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

  // 5. standard_add_tens_and_ones_regrouping_concept
  if (activeVariant === 'standard_add_tens_and_ones_regrouping_concept') {
    // "What is 4 tens and 15 ones?"
    const tens = Math.floor(Math.random() * 5) + 2; // 2 to 6
    const extraTens = Math.floor(Math.random() * 2) + 1; // 1 or 2
    const extraOnes = Math.floor(Math.random() * 8) + 1; // 1 to 8
    const ones = extraTens * 10 + extraOnes; // 11 to 28 ones
    
    const sum = tens * 10 + ones;
    
    const questionTextRaw = `What number is the same as ${tens} tens and ${ones} ones?`;
    const questionTextShort = `${tens} tens and ${ones} ones = ?`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const correctAns = sum.toString();
    const hint = `Change the ones into tens! ${ones} ones is the same as ${extraTens} ten(s) and ${extraOnes} ones.`;
    const solutionSteps = `1. Let's look at ${ones} ones.\\n2. Since 10 ones make 1 ten, ${ones} ones can be regrouped as ${extraTens} ten(s) and ${extraOnes} ones.\\n3. Now add the tens together: ${tens} tens + ${extraTens} tens = ${tens + extraTens} tens.\\n4. We have ${tens + extraTens} tens and ${extraOnes} ones.\\n5. That makes the number ${sum}.`;

    let options = null;
    let defectMap = null;

    if (isMCQ) {
      const forgotRegroup = tens * 10 + extraOnes; // completely lost the extra tens
      const justConcatenated = Number(`${tens}${ones}`); // 415
      
      options = [
        correctAns,
        forgotRegroup.toString(),
        (justConcatenated > 100 ? (sum + 10) : justConcatenated).toString(),
        (sum - 10).toString()
      ];
      options = [...new Set(options)];
      while(options.length < 4) options.push((sum + 1).toString());
      options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [forgotRegroup.toString()]: "CONCEPTUAL_ERROR",
        [justConcatenated.toString()]: "CONCEPTUAL_ERROR",
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

  return null;
};
