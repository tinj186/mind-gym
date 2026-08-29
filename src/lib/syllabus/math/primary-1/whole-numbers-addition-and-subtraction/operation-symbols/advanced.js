import { getRandomNames } from '@/lib/utils/variable-bank';

export const advancedLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, getQText) => {

  const commonMeta = {
    zodType,
    difficulty: zodDiff,
    level,
    topic
  };

  const inputType = isStructure ? 'MULTI_STEP_INPUT' : (isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT');

  // 1. advanced_balance_equation
  if (activeVariant === 'advanced_balance_equation') {
    // Both sides equal the same target
    // target = a1 + b1 OR a1 - b1
    // target = a2 + b2 OR a2 - b2
    const target = Math.floor(Math.random() * 8) + 8; // 8 to 15
    
    // Generate left side
    const leftIsAddition = Math.random() > 0.5;
    let a1, b1;
    if (leftIsAddition) {
      b1 = Math.floor(Math.random() * (target - 3)) + 1; // At least 1
      a1 = target - b1;
    } else {
      b1 = Math.floor(Math.random() * 4) + 1;
      a1 = target + b1;
    }
    
    // Generate right side
    const rightIsAddition = !leftIsAddition; // Make them different for variety
    let a2, b2;
    if (rightIsAddition) {
      b2 = Math.floor(Math.random() * (target - 3)) + 1;
      a2 = target - b2;
      // Ensure it's not identically the same expression
      if (a1 === a2 && b1 === b2) {
        a2 = target; b2 = 0; // simple fallback
      }
    } else {
      b2 = Math.floor(Math.random() * 4) + 1;
      a2 = target + b2;
    }

    const leftSym = leftIsAddition ? '+' : '-';
    const rightSym = rightIsAddition ? '+' : '-';

    const questionTextRaw = `Fill in the missing symbols to balance the equation:\\n${a1} [ ? ] ${b1} = ${a2} [ ? ] ${b2}`;
    const questionTextShort = `${a1} [?] ${b1} = ${a2} [?] ${b2}\\nSymbols:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const correctAns = `${leftSym}, ${rightSym}`;
    
    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      const allCombos = ['+, +', '+, -', '-, +', '-, -'];
      options = allCombos;
      defectMap = {};
      allCombos.forEach(c => {
        if (c !== correctAns) defectMap[c] = "CONCEPTUAL_ERROR";
      });
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctAns}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: `Try finding the result of one side first, then see what makes the other side equal to it.`,
          finalAnswer: correctAns,
          solutionSteps: `1. We want both sides of the '=' to be equal.\\n2. Let's look at the left: ${a1} ${leftSym} ${b1} = ${target}.\\n3. Let's look at the right: ${a2} ${rightSym} ${b2} = ${target}.\\n4. Since both sides equal ${target}, the missing symbols are '${leftSym}' and '${rightSym}'.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: true }
    };
  }

  // 2. advanced_two_missing_symbols
  if (activeVariant === 'advanced_two_missing_symbols') {
    // a1 [op1] a2 [op2] a3 = target
    // Ensure intermediate steps are <= 20 and >= 0
    let a1, a2, a3, op1, op2, target, intermediate;
    
    // Attempt to generate valid combo
    let valid = false;
    while (!valid) {
      a1 = Math.floor(Math.random() * 10) + 5;
      a2 = Math.floor(Math.random() * 5) + 2;
      a3 = Math.floor(Math.random() * 5) + 2;
      
      op1 = Math.random() > 0.5 ? '+' : '-';
      op2 = Math.random() > 0.5 ? '+' : '-';
      
      intermediate = op1 === '+' ? a1 + a2 : a1 - a2;
      if (intermediate >= 0 && intermediate <= 20) {
        target = op2 === '+' ? intermediate + a3 : intermediate - a3;
        if (target >= 0 && target <= 20) {
          // Verify that this is the ONLY valid combination
          let validCount = 0;
          const combos = [['+', '+'], ['+', '-'], ['-', '+'], ['-', '-']];
          for (let combo of combos) {
            let tempInt = combo[0] === '+' ? a1 + a2 : a1 - a2;
            let tempFinal = combo[1] === '+' ? tempInt + a3 : tempInt - a3;
            if (tempFinal === target) {
              validCount++;
            }
          }
          if (validCount === 1) {
            valid = true;
          }
        }
      }
    }

    const questionTextRaw = `Fill in the missing symbols:\\n${a1} [ ? ] ${a2} [ ? ] ${a3} = ${target}`;
    const questionTextShort = `${a1} [?] ${a2} [?] ${a3} = ${target}\\nSymbols:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const correctAns = `${op1}, ${op2}`;
    
    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      const allCombos = ['+, +', '+, -', '-, +', '-, -'];
      options = allCombos;
      defectMap = {};
      allCombos.forEach(c => {
        if (c !== correctAns) defectMap[c] = "CONCEPTUAL_ERROR";
      });
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctAns}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "Try different symbols step-by-step from left to right.",
          finalAnswer: correctAns,
          solutionSteps: `1. Work from left to right.\\n2. First step: ${a1} ${op1} ${a2} = ${intermediate}.\\n3. Second step: ${intermediate} ${op2} ${a3} = ${target}.\\n4. The correct symbols are '${op1}' and '${op2}'.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: true }
    };
  }

  // 3. advanced_true_false_symbols
  if (activeVariant === 'advanced_true_false_symbols') {
    const isTrue = Math.random() > 0.5;
    
    // a1 + b1 vs a2 - b2
    const target = Math.floor(Math.random() * 8) + 8; // 8 to 15
    
    // Left side (always addition for simplicity in this variant)
    const b1 = Math.floor(Math.random() * (target - 3)) + 1;
    const a1 = target - b1;
    const leftEq = `${a1} + ${b1}`;
    
    // Right side (subtraction)
    const b2 = Math.floor(Math.random() * 4) + 1;
    const a2 = (isTrue ? target : (target + (Math.random() > 0.5 ? 1 : -1))) + b2;
    const rightTarget = a2 - b2;
    const rightEq = `${a2} - ${b2}`;

    const questionTextRaw = `True or False: ${leftEq} is the same as ${rightEq}`;
    const questionTextShort = `T/F: ${leftEq} = ${rightEq}`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const correctAns = isTrue ? "True" : "False";
    
    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      options = ["True", "False"];
      defectMap = {
        [isTrue ? "False" : "True"]: "CONCEPTUAL_ERROR"
      };
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctAns}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: `Calculate both ${leftEq} and ${rightEq}. Are the answers the same?`,
          finalAnswer: correctAns,
          solutionSteps: `1. Calculate the first part: ${leftEq} = ${a1 + b1}.\\n2. Calculate the second part: ${rightEq} = ${a2 - b2}.\\n3. Compare them: ${a1 + b1} ${isTrue ? "is" : "is NOT"} equal to ${a2 - b2}.\\n4. The statement is ${correctAns}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: true }
    };
  }

  // 4. advanced_word_to_multi_step_equation
  if (activeVariant === 'advanced_word_to_multi_step_equation') {
    const name = getRandomNames(1);
    
    // Start with a, minus b, plus c
    const a = Math.floor(Math.random() * 5) + 10; // 10 to 14
    const b = Math.floor(Math.random() * 4) + 2; // 2 to 5
    const c = Math.floor(Math.random() * 4) + 2; // 2 to 5
    
    const intermediate = a - b;
    const final = intermediate + c;
    
    const story = `${name} has ${a} apples. He eats ${b}. Then he buys ${c} more.`;

    const correctEq = `${a} - ${b} + ${c} = ${final}`;
    
    const questionTextRaw = `Read the story:\\n"${story}"\\nWhich equation matches the story?`;
    const questionTextShort = `"${story}" -> Match equation:`;
    const questionText = getQText(questionTextRaw, questionTextShort);
    
    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      const wrong1 = `${a} + ${b} - ${c} = ${a + b - c}`; // swapped signs
      const wrong2 = `${a} - ${b} - ${c} = ${a - b - c}`; // all minus
      const wrong3 = `${a} + ${b} + ${c} = ${a + b + c}`; // all plus
      
      options = [correctEq, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
      defectMap = {
        [wrong1]: "CONCEPTUAL_ERROR",
        [wrong2]: "CONCEPTUAL_ERROR",
        [wrong3]: "CONCEPTUAL_ERROR"
      };
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctEq}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "When he eats apples, do you add or subtract? When he buys more, do you add or subtract?",
          finalAnswer: correctEq,
          solutionSteps: `1. The story starts with ${a}.\\n2. "Eats ${b}" means we subtract ${b}: ${a} - ${b} = ${intermediate}.\\n3. "Buys ${c} more" means we add ${c}: ${intermediate} + ${c} = ${final}.\\n4. Putting it together: ${correctEq}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: true }
    };
  }

  // 5. advanced_find_target_two_steps
  if (activeVariant === 'advanced_find_target_two_steps') {
    // Start, add X, then what to get Target?
    const start = Math.floor(Math.random() * 5) + 5; // 5 to 9
    const step1Add = Math.floor(Math.random() * 4) + 2; // 2 to 5
    const intermediate = start + step1Add;
    
    // We want target to require a subtraction
    const step2Sub = Math.floor(Math.random() * 3) + 2; // 2 to 4
    const target = intermediate - step2Sub;

    const questionTextRaw = `You start with ${start}. You want exactly ${target}. First you Add ${step1Add}. What must you do next?`;
    const questionTextShort = `Start: ${start}, Target: ${target}, First: Add ${step1Add}. Next:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    const correctAns = `Subtract ${step2Sub}`;
    
    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      const wrong1 = `Add ${step2Sub}`;
      const wrong2 = `Subtract ${step2Sub + 2}`;
      const wrong3 = `Add ${Math.abs(target - start)}`;
      
      options = [correctAns, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
      defectMap = {
        [wrong1]: "CONCEPTUAL_ERROR",
        [wrong2]: "CARELESS_CALCULATION",
        [wrong3]: "CONCEPTUAL_ERROR"
      };
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctAns}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: `Find out what you have after you Add ${step1Add}. Then see how far you are from ${target}.`,
          finalAnswer: correctAns,
          solutionSteps: `1. You start with ${start}.\\n2. You Add ${step1Add}, so you have ${start} + ${step1Add} = ${intermediate}.\\n3. Your target is ${target}.\\n4. Since ${intermediate} is bigger than ${target}, you must subtract.\\n5. ${intermediate} - ${target} = ${step2Sub}.\\n6. You must ${correctAns}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: true }
    };
  }

  return null;
};
