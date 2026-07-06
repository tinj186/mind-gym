import { getRandomNames } from '@/lib/utils/variable-bank';

export const advancedLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, getQText) => {

  const commonMeta = {
    zodType,
    difficulty: zodDiff,
    level,
    topic
  };

  const inputType = isStructure ? 'MULTI_STEP_INPUT' : (isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT');

  // Helper to generate a multi-part fact up to 100
  const generateMultiFact = () => {
    // a + b + c = total
    const total = Math.floor(Math.random() * 50) + 50; // 50 to 99
    const a = Math.floor(Math.random() * 20) + 10;
    const b = Math.floor(Math.random() * 20) + 10;
    const c = total - a - b;
    return { a, b, c, total };
  };

  // 1. advanced_chained_inverse
  if (activeVariant === 'advanced_chained_inverse') {
    // If A - B = C, and C - D = E, find something.
    // e.g. A = 85, B = 20, C = 65. C - D = 30 -> D = 35.
    const a = Math.floor(Math.random() * 30) + 60; // 60 to 89
    const b = Math.floor(Math.random() * 20) + 15;
    const c = a - b;
    const d = Math.floor(Math.random() * (c - 10)) + 5;
    const e = c - d;

    // We can ask to find D.
    const questionTextRaw = `If ${a} - ${b} = ${c}, and ${c} - [ ? ] = ${e}, find the missing number.`;
    const questionTextShort = `If ${a} - ${b} = ${c} and ${c} - [?] = ${e}, what is [?]?`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const correctAns = d.toString();
    const hint = `Look at the second equation: ${c} - [ ? ] = ${e}. Use inverse operations!`;
    const solutionSteps = `1. The first equation ${a} - ${b} = ${c} tells us the starting number for the second equation.\\n2. The second equation is ${c} - [ ? ] = ${e}.\\n3. This means if we take away a part from ${c}, we get ${e}.\\n4. To find that part, we can subtract the part we know from the whole: ${c} - ${e} = ${d}.\\n5. The missing number is ${d}.`;

    let options = null;
    let defectMap = null;

    if (isMCQ) {
      options = [
        correctAns,
        (d + 10).toString(),
        (c + e).toString(),
        (Math.abs(d - 5) || d + 2).toString()
      ].sort(() => Math.random() - 0.5);
      
      defectMap = {
        [(c + e).toString()]: "CONCEPTUAL_ERROR",
        [(d + 10).toString()]: "CARELESS_CALCULATION"
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
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: true }
    };
  }

  // 2. advanced_two_step_start_unknown_word_problem
  if (activeVariant === 'advanced_two_step_start_unknown_word_problem') {
    const name = getRandomNames(1);
    
    // start + get - lose = final
    // or start - lose + get = final
    const start = Math.floor(Math.random() * 30) + 40; // 40 to 69
    const get = Math.floor(Math.random() * 20) + 15;
    const lose = Math.floor(Math.random() * 20) + 10;
    
    const isFirstActionGet = Math.random() > 0.5;
    
    let finalAmount = 0;
    let questionTextRaw, questionTextShort, hint, solutionSteps;
    
    if (isFirstActionGet) {
      finalAmount = start + get - lose;
      questionTextRaw = `${name} had some game cards. ${name} bought ${get} more cards, but then lost ${lose} cards. Now ${name} has ${finalAmount} cards. How many cards did ${name} start with?`;
      questionTextShort = `Start unknown: Got ${get}, lost ${lose}, has ${finalAmount}. Started with = ?`;
      hint = `Work completely backwards! Start with the final amount, add back what was lost, and subtract what was bought.`;
      solutionSteps = `1. ${name} ended with ${finalAmount} cards.\\n2. Before losing ${lose} cards, they must have had ${finalAmount} + ${lose} = ${finalAmount + lose}.\\n3. Before buying ${get} cards, they must have had ${finalAmount + lose} - ${get} = ${start}.\\n4. ${name} started with ${start} cards.`;
    } else {
      finalAmount = start - lose + get;
      questionTextRaw = `${name} had some stickers. ${name} gave away ${lose} stickers to friends, and then bought ${get} new stickers. Now ${name} has ${finalAmount} stickers. How many stickers did ${name} start with?`;
      questionTextShort = `Start unknown: Lost ${lose}, got ${get}, has ${finalAmount}. Started with = ?`;
      hint = `Work completely backwards! Start with the final amount, subtract what was bought, and add back what was given away.`;
      solutionSteps = `1. ${name} ended with ${finalAmount} stickers.\\n2. Before buying ${get} stickers, they must have had ${finalAmount} - ${get} = ${finalAmount - get}.\\n3. Before giving away ${lose} stickers, they must have had ${finalAmount - get} + ${lose} = ${start}.\\n4. ${name} started with ${start} stickers.`;
    }

    const correctAns = start.toString();
    const questionText = getQText(questionTextRaw, questionTextShort);
    
    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      const wrongOp1 = finalAmount + get + lose; // added everything
      const wrongOp2 = Math.abs(finalAmount - get - lose); // subtracted everything
      
      options = [
        correctAns,
        wrongOp1.toString(),
        wrongOp2.toString(),
        (start + 10).toString()
      ].sort(() => Math.random() - 0.5);
      
      defectMap = {
        [wrongOp1.toString()]: "CONCEPTUAL_ERROR",
        [wrongOp2.toString()]: "CONCEPTUAL_ERROR"
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
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: true }
    };
  }

  // 3. advanced_find_missing_in_multi_part_whole
  if (activeVariant === 'advanced_find_missing_in_multi_part_whole') {
    const { a, b, c, total } = generateMultiFact();
    
    const questionTextRaw = `Fill in the missing number: ${a} + ${b} + [ ? ] = ${total}`;
    const questionTextShort = `${a} + ${b} + [?] = ${total}`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const correctAns = c.toString();
    const hint = `First, add the numbers you know. Then, subtract that from the total to find the missing part!`;
    const solutionSteps = `1. The whole is ${total}, and it is made of three parts.\\n2. We know two of the parts: ${a} and ${b}.\\n3. Let's add them together: ${a} + ${b} = ${a + b}.\\n4. Now, the equation is ${a + b} + [ ? ] = ${total}.\\n5. We can find the missing part by subtracting: ${total} - ${a + b} = ${c}.\\n6. The missing number is ${c}.`;

    let options = null;
    let defectMap = null;

    if (isMCQ) {
      options = [
        correctAns,
        (c + 10).toString(),
        (Math.abs(total - a) || c + 2).toString(),
        (Math.abs(c - 10) || c + 5).toString()
      ].sort(() => Math.random() - 0.5);
      
      defectMap = {
        [(Math.abs(total - a) || c + 2).toString()]: "CONCEPTUAL_ERROR",
        [(c + 10).toString()]: "CARELESS_CALCULATION"
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
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: true }
    };
  }

  // 4. advanced_balance_multi_term
  if (activeVariant === 'advanced_balance_multi_term') {
    // left side: X - Y = Total
    // right side: A + B + C = Total
    const total = Math.floor(Math.random() * 30) + 40; // 40 to 69
    const y = Math.floor(Math.random() * 20) + 10;
    const x = total + y;
    
    const a = Math.floor(Math.random() * 15) + 10;
    const b = Math.floor(Math.random() * 15) + 10;
    const c = total - a - b;

    const isLeftMissing = Math.random() > 0.5;
    let questionStr, correctAns, solutionSteps, missingNum;
    
    if (isLeftMissing) {
      // Missing X
      questionStr = `[ ? ] - ${y} = ${a} + ${b} + ${c}`;
      correctAns = x.toString();
      missingNum = x;
      solutionSteps = `1. First, find the total of the side with all the numbers: ${a} + ${b} + ${c} = ${total}.\\n2. Now we know both sides must equal ${total}.\\n3. The equation is now: [ ? ] - ${y} = ${total}.\\n4. To find the missing starting number, we add the parts together: ${total} + ${y} = ${x}.\\n5. The missing number is ${x}.`;
    } else {
      // Missing C
      questionStr = `${x} - ${y} = ${a} + ${b} + [ ? ]`;
      correctAns = c.toString();
      missingNum = c;
      solutionSteps = `1. First, find the total of the side with all the numbers: ${x} - ${y} = ${total}.\\n2. Now we know both sides must equal ${total}.\\n3. The equation is now: ${total} = ${a} + ${b} + [ ? ].\\n4. Combine the known parts: ${a} + ${b} = ${a + b}.\\n5. The equation is now: ${total} = ${a + b} + [ ? ].\\n6. To find the missing part, subtract: ${total} - ${a + b} = ${c}.\\n7. The missing number is ${c}.`;
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
        (Math.abs(missingNum - 10) || missingNum + 2).toString(),
        (missingNum + 1).toString()
      ].sort(() => Math.random() - 0.5);
      
      defectMap = {
        [(missingNum + 10).toString()]: "CARELESS_CALCULATION",
        [(Math.abs(missingNum - 10) || missingNum + 2).toString()]: "CARELESS_CALCULATION"
      };
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctAns}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "Solve the side with all the numbers first. Then use that total to solve for the missing piece on the other side.",
          finalAnswer: correctAns,
          solutionSteps: solutionSteps
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: true }
    };
  }

  // 5. advanced_related_equations_puzzle
  if (activeVariant === 'advanced_related_equations_puzzle') {
    // Star + A = B  --> Star = B - A
    // Heart - Star = C --> Heart = C + Star
    const b = Math.floor(Math.random() * 40) + 50; // 50 to 89
    const a = Math.floor(Math.random() * 20) + 20; // 20 to 39
    const star = b - a;
    
    const c = Math.floor(Math.random() * 20) + 10;
    const heart = c + star;
    
    const questionTextRaw = `Use the related equations to find the value of the Heart: Star + ${a} = ${b}, and Heart - Star = ${c}. What number is the Heart?`;
    const questionTextShort = `Star + ${a} = ${b}. Heart - Star = ${c}. Heart = ?`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const correctAns = heart.toString();
    const hint = "Find the value of the Star first using inverse operations! Then, plug that number into the second equation.";
    const solutionSteps = `1. Let's find the Star first using the first equation: Star + ${a} = ${b}.\\n2. Using inverse operations, Star = ${b} - ${a} = ${star}.\\n3. Now we can put ${star} into the second equation: Heart - ${star} = ${c}.\\n4. To find the Heart (the whole), we use addition: Heart = ${c} + ${star} = ${heart}.\\n5. The Heart is ${heart}.`;

    let options = null;
    let defectMap = null;

    if (isMCQ) {
      const wrongOp1 = Math.abs(c - star) || heart + 5; // Did C - Star instead of C + Star
      const wrongStar1 = b + a; // Star = B + A (wrong)
      const wrongHeart1 = c + wrongStar1;
      
      options = [
        correctAns,
        wrongOp1.toString(),
        wrongHeart1.toString(),
        star.toString() // Picked Star instead of Heart
      ].sort(() => Math.random() - 0.5);
      
      // Ensure unique options
      options = [...new Set(options)];
      while(options.length < 4) {
        options.push((heart + options.length).toString());
      }
      options.sort(() => Math.random() - 0.5);

      defectMap = {
        [wrongOp1.toString()]: "CONCEPTUAL_ERROR",
        [wrongHeart1.toString()]: "CONCEPTUAL_ERROR",
        [star.toString()]: "CARELESS_CALCULATION"
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
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: true }
    };
  }

  return null;
};
