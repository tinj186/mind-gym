import { getRandomNames } from '@/lib/utils/variable-bank';

export const advancedLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, getQText) => {

  const commonMeta = {
    zodType,
    difficulty: zodDiff,
    level,
    topic
  };

  const inputType = isStructure ? 'MULTI_STEP_INPUT' : (isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT');

  // Helper to generate WITH REGROUPING addition
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

  // 1. advanced_add_two_step_word_problem
  if (activeVariant === 'advanced_add_two_step_word_problem') {
    const name = getRandomNames(1);
    const name2 = getRandomNames(1);
    
    // a + b + c = total < 100
    const a = Math.floor(Math.random() * 20) + 15;
    const b = Math.floor(Math.random() * 20) + 15;
    const c = Math.floor(Math.random() * 20) + 15;
    const sumAB = a + b;
    const total = sumAB + c;
    
    const isItems = Math.random() > 0.5;
    const itemWord = isItems ? "stickers" : "marbles";
    
    const questionTextRaw = `${name} had ${a} ${itemWord}. ${name} bought ${b} more ${itemWord}. Later, ${name2} gave ${name} another ${c} ${itemWord}. How many ${itemWord} does ${name} have now?`;
    const questionTextShort = `Had ${a}, bought ${b}, got ${c} more. Total = ?`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const correctAns = total.toString();
    const hint = `Take it one step at a time! First, add the first two numbers. Then, add the third number to that total.`;
    const solutionSteps = `1. ${name} started with ${a} ${itemWord} and bought ${b} more.\\n2. First addition: ${a} + ${b} = ${sumAB}. Now ${name} has ${sumAB} ${itemWord}.\\n3. Then, ${name2} gave ${c} more.\\n4. Second addition: ${sumAB} + ${c} = ${total}.\\n5. ${name} now has ${total} ${itemWord}.`;

    let options = null;
    let defectMap = null;

    if (isMCQ) {
      options = [
        correctAns,
        (total + 10).toString(),
        (total - 10).toString(),
        (Math.abs(a + b - c) || total + 5).toString() // Subtracted last step
      ];
      options = [...new Set(options)];
      while(options.length < 4) options.push((total + 1).toString());
      options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [(total + 10).toString()]: "CARELESS_CALCULATION",
        [(total - 10).toString()]: "CARELESS_CALCULATION",
        [(Math.abs(a + b - c) || total + 5).toString()]: "CONCEPTUAL_ERROR"
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

  // 2. advanced_missing_digit_addition
  if (activeVariant === 'advanced_missing_digit_addition') {
    // 3[?] + 45 = 82
    let generated;
    while (true) {
      generated = generateWithRegroup(8, 9, 8, 9);
      if (generated.num1 > 10 && generated.num2 > 10) break;
    }
    const { num1, num2, sum, tens1, ones1 } = generated;
    
    // Hide ones1
    const maskedNum1 = `${tens1}[ ? ]`;
    
    const questionTextRaw = `Find the missing digit in the box: ${maskedNum1} + ${num2} = ${sum}`;
    const questionTextShort = `${maskedNum1} + ${num2} = ${sum}. Missing digit = ?`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const correctAns = ones1.toString();
    const hint = `To find the missing digit, you can work backwards! Subtract ${num2} from the total ${sum}.`;
    const solutionSteps = `1. The equation is ${maskedNum1} + ${num2} = ${sum}.\\n2. We can find the whole first number by working backwards: ${sum} - ${num2}.\\n3. ${sum} - ${num2} = ${num1}.\\n4. The first number is ${num1}, which is ${tens1} tens and ${ones1} ones.\\n5. The missing digit in the ones place is ${ones1}.`;

    let options = null;
    let defectMap = null;

    if (isMCQ) {
      const wrongDigitNoRegroup = (sum % 10) - (num2 % 10);
      const wrongDigitAbs = Math.abs(wrongDigitNoRegroup);
      
      options = [
        correctAns,
        wrongDigitAbs.toString(), // student just subtracts ones without regrouping
        ((ones1 + 1) % 10).toString(),
        tens1.toString()
      ];
      options = [...new Set(options)];
      while(options.length < 4) options.push(((ones1 + 2) % 10).toString());
      options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [wrongDigitAbs.toString()]: "CONCEPTUAL_ERROR", // ignored regrouping
        [tens1.toString()]: "CARELESS_CALCULATION" // put the tens digit instead
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

  // 3. advanced_find_greatest_sum
  if (activeVariant === 'advanced_find_greatest_sum') {
    // Generate 4 numbers
    const n1 = Math.floor(Math.random() * 15) + 10;
    const n2 = Math.floor(Math.random() * 15) + 25;
    const n3 = Math.floor(Math.random() * 15) + 40;
    const n4 = Math.floor(Math.random() * 15) + 15;
    
    // Sort them
    const sorted = [n1, n2, n3, n4].sort((a, b) => b - a);
    const largest1 = sorted[0];
    const largest2 = sorted[1];
    const maxSum = largest1 + largest2;
    
    const nums = [n1, n2, n3, n4].sort(() => Math.random() - 0.5);
    const numStr = nums.join(', ');
    
    const questionTextRaw = `Pick any two numbers from this list to add together: ${numStr}. What is the greatest possible sum you can make?`;
    const questionTextShort = `Greatest sum from: ${numStr}?`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const correctAns = maxSum.toString();
    const hint = `To get the greatest sum, you need to add the two largest numbers together!`;
    const solutionSteps = `1. To make the greatest sum, we must pick the two largest numbers from the list: ${numStr}.\\n2. The largest number is ${largest1}.\\n3. The second largest number is ${largest2}.\\n4. Now, add them together: ${largest1} + ${largest2} = ${maxSum}.\\n5. The greatest possible sum is ${maxSum}.`;

    let options = null;
    let defectMap = null;

    if (isMCQ) {
      const smallestSum = sorted[2] + sorted[3];
      const mediumSum = sorted[1] + sorted[2];
      
      options = [
        correctAns,
        smallestSum.toString(),
        mediumSum.toString(),
        (maxSum - 10).toString()
      ];
      options = [...new Set(options)];
      while(options.length < 4) options.push((maxSum + 10).toString());
      options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [smallestSum.toString()]: "CONCEPTUAL_ERROR", // Picked smallest
        [mediumSum.toString()]: "CONCEPTUAL_ERROR" // Picked wrong pair
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

  // 4. advanced_balance_multi_digit_equation
  if (activeVariant === 'advanced_balance_multi_digit_equation') {
    // A + B = C + D
    let generated;
    while (true) {
      generated = generateWithRegroup(8, 9, 8, 9);
      if (generated.num1 > 10 && generated.num2 > 10) break;
    }
    const { num1: a, num2: b, sum } = generated;
    
    const c = Math.floor(Math.random() * 30) + 15;
    const d = sum - c; // missing number
    
    const questionTextRaw = `Balance the equation: ${a} + ${b} = ${c} + [ ? ]`;
    const questionTextShort = `${a} + ${b} = ${c} + [?]`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const correctAns = d.toString();
    const hint = `First, find the total on the left side: ${a} + ${b}. The right side must add up to the exact same total!`;
    const solutionSteps = `1. Both sides of the equals sign must have the same total.\\n2. First, solve the left side: ${a} + ${b} = ${sum}.\\n3. So, the right side must also equal ${sum}: ${c} + [ ? ] = ${sum}.\\n4. To find the missing number, subtract: ${sum} - ${c} = ${d}.\\n5. The missing number is ${d}.`;

    let options = null;
    let defectMap = null;

    if (isMCQ) {
      options = [
        correctAns,
        (d + 10).toString(),
        (sum).toString(), // just put the sum
        (Math.abs(c - d) || d + 5).toString()
      ];
      options = [...new Set(options)];
      while(options.length < 4) options.push((d + 1).toString());
      options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [(d + 10).toString()]: "CARELESS_CALCULATION",
        [(sum).toString()]: "CONCEPTUAL_ERROR" // didn't subtract C
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

  // 5. advanced_consecutive_addition_pattern
  if (activeVariant === 'advanced_consecutive_addition_pattern') {
    // Pattern: start, start+step, start+2*step, start+3*step
    // step is 2-digit, e.g. 11, 12, 15, 20, 25
    const steps = [11, 12, 15, 20, 25];
    const step = steps[Math.floor(Math.random() * steps.length)];
    const start = Math.floor(Math.random() * 15) + 5;
    
    const n1 = start;
    const n2 = start + step;
    const n3 = start + step * 2;
    const n4 = start + step * 3;
    
    const questionTextRaw = `What number comes next in the pattern?\\n${n1}, ${n2}, ${n3}, [ ? ]`;
    const questionTextShort = `Next in pattern: ${n1}, ${n2}, ${n3}, ?`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const correctAns = n4.toString();
    const hint = `Find out how much is being added each time. What is ${n2} - ${n1}?`;
    const solutionSteps = `1. Let's find the difference between the numbers in the pattern.\\n2. From ${n1} to ${n2}: ${n2} - ${n1} = ${step}.\\n3. From ${n2} to ${n3}: ${n3} - ${n2} = ${step}.\\n4. The rule is to add ${step} each time!\\n5. To find the next number, add ${step} to the last number: ${n3} + ${step} = ${n4}.\\n6. The next number is ${n4}.`;

    let options = null;
    let defectMap = null;

    if (isMCQ) {
      options = [
        correctAns,
        (n4 + 10).toString(),
        (n4 - 10).toString(),
        (n3 + step + 2).toString()
      ];
      options = [...new Set(options)];
      while(options.length < 4) options.push((n4 + 1).toString());
      options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [(n4 + 10).toString()]: "CARELESS_CALCULATION",
        [(n4 - 10).toString()]: "CARELESS_CALCULATION"
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

  return null;
};
