import { emojiObjects } from '@/lib/utils/variable-bank';

export const advancedLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, getQText) => {

  const commonMeta = {
    zodType,
    difficulty: zodDiff,
    level,
    topic
  };

  const inputType = isStructure ? 'MULTI_STEP_INPUT' : (isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT');

  const getRandomObj = () => emojiObjects[Math.floor(Math.random() * emojiObjects.length)];

  // Helper for generating reasonable options
  const generateOptions = (correctValue) => {
    if (!isMCQ) return null;
    return Array.from(new Set([
      String(correctValue),
      String(correctValue + 1),
      String(Math.abs(correctValue - 1) || 2),
      String(correctValue + Math.floor(Math.random() * 3) + 2)
    ])).sort(() => Math.random() - 0.5);
  };

  const generateDefectMap = (correctValue) => {
    let map = {};
    map[String(correctValue + 1)] = "CARELESS_CALCULATION";
    map[String(Math.abs(correctValue - 1) || 2)] = "CARELESS_CALCULATION";
    map[String(correctValue + Math.floor(Math.random() * 3) + 2)] = "CONCEPTUAL_ERROR";
    return map;
  };

  // 1. advanced_balance_equation
  if (activeVariant === 'advanced_balance_equation') {
    // Equation: X + Y = Z + ?
    // Ensure all sums <= 20
    const sum = Math.floor(Math.random() * 8) + 11; // 11 to 18
    const x = Math.floor(Math.random() * (sum - 4)) + 2; 
    const y = sum - x;
    
    // Choose Z such that Z != X and Z != Y to make it non-trivial
    let z = Math.floor(Math.random() * (sum - 3)) + 1;
    while (z === x || z === y) {
      z = Math.floor(Math.random() * (sum - 3)) + 1;
    }
    
    const missing = sum - z;
    const correctAns = missing;
    
    const eqStr = `${x} + ${y} = ${z} + ?`;
    const questionTextRaw = `Find the missing number to balance the equation:\\n${eqStr}`;
    const questionTextShort = `${eqStr}\\nMissing number:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctAns}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: generateOptions(correctAns),
          defectMap: generateDefectMap(correctAns),
          hint: "First, find the total of the left side. Then, find what number must be added to the right side to get the same total.",
          finalAnswer: String(correctAns),
          solutionSteps: `1. First calculate the left side: ${x} + ${y} = ${sum}.\\n2. The right side must also equal ${sum}.\\n3. So, ${z} + ? = ${sum}.\\n4. Subtract to find the missing number: ${sum} - ${z} = ${correctAns}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: true }
    };
  }

  // 2. advanced_multi_step_calculation
  if (activeVariant === 'advanced_multi_step_calculation') {
    // Equation: X + Y - Z = ?
    const x = Math.floor(Math.random() * 8) + 5; 
    const y = Math.floor(Math.random() * 8) + 2; 
    const sum = x + y; // Max 12 + 9 = 21, let's limit max
    const z = Math.floor(Math.random() * (sum - 2)) + 1;
    
    const correctAns = sum - z;
    
    const eqStr = `${x} + ${y} - ${z} = ?`;
    const questionTextRaw = `Calculate:\\n${eqStr}`;
    const questionTextShort = `${eqStr}`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctAns}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: generateOptions(correctAns),
          defectMap: generateDefectMap(correctAns),
          hint: "Work from left to right. First add, then subtract.",
          finalAnswer: String(correctAns),
          solutionSteps: `1. First add: ${x} + ${y} = ${sum}.\\n2. Then subtract: ${sum} - ${z} = ${correctAns}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: true }
    };
  }

  // 3. advanced_reverse_subtraction_word
  if (activeVariant === 'advanced_reverse_subtraction_word') {
    const gaveAway = Math.floor(Math.random() * 8) + 4;
    const leftOver = Math.floor(Math.random() * 8) + 4;
    const original = gaveAway + leftOver;
    const obj = getRandomObj();
    
    const questionTextRaw = `Sarah gave away ${gaveAway} ${obj.name} to her friends. She has ${leftOver} ${obj.name} left. How many ${obj.name} did she have at first?`;
    const questionTextShort = `Gave away ${gaveAway}, ${leftOver} left. Original amount:`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${original}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: generateOptions(original),
          defectMap: generateDefectMap(original),
          hint: "If you know what she gave away and what she has left, you can add them together to find the total she started with.",
          finalAnswer: String(original),
          solutionSteps: `1. The amount she had at first is the whole.\\n2. The parts are what she gave away (${gaveAway}) and what is left (${leftOver}).\\n3. To find the whole, add the parts: ${gaveAway} + ${leftOver} = ${original}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: true }
    };
  }

  // 4. advanced_true_false_balance
  if (activeVariant === 'advanced_true_false_balance') {
    // X + Y = A - B
    const isCorrect = Math.random() > 0.5;
    
    const sum = Math.floor(Math.random() * 6) + 8; // 8 to 13
    const x = Math.floor(Math.random() * (sum - 2)) + 1;
    const y = sum - x;
    
    let targetA, b;
    if (isCorrect) {
      targetA = sum + Math.floor(Math.random() * 5) + 2; // e.g., sum=10, targetA=14
      b = targetA - sum; // b=4
    } else {
      const offset = Math.random() > 0.5 ? 1 : -1;
      targetA = sum + Math.floor(Math.random() * 5) + 2;
      b = (targetA - sum) + offset;
    }
    
    const eqStr = `${x} + ${y} = ${targetA} - ${b}`;
    const questionTextRaw = `True or False: The equation is balanced.\\n${eqStr}`;
    const questionTextShort = `True or False: ${eqStr}`;
    const questionText = getQText(questionTextRaw, questionTextShort);
    
    const correctAns = isCorrect ? "True" : "False";

    let options = null;
    let defectMap = null;
    
    if (isMCQ) {
      options = ["True", "False"];
      defectMap = { [isCorrect ? "False" : "True"]: "CONCEPTUAL_ERROR" };
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${correctAns}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: (!isMCQ) ? `${questionText} (True or False)` : questionText,
          options: options,
          defectMap: defectMap,
          hint: "Calculate the total on the left side, then calculate the total on the right side. Are they the same number?",
          finalAnswer: correctAns,
          solutionSteps: `1. Calculate the left side: ${x} + ${y} = ${sum}.\\n2. Calculate the right side: ${targetA} - ${b} = ${targetA - b}.\\n3. Since ${sum} ${isCorrect ? 'is equal to' : 'is not equal to'} ${targetA - b}, the equation is ${correctAns}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: true }
    };
  }

  // 5. advanced_chained_number_bond
  if (activeVariant === 'advanced_chained_number_bond') {
    // Part A + Part B = Intermediate Whole
    // Intermediate Whole + Part C = Final Whole
    const partA = Math.floor(Math.random() * 5) + 2;
    const partB = Math.floor(Math.random() * 5) + 2;
    const intermediate = partA + partB;
    const partC = Math.floor(Math.random() * 5) + 2;
    const finalWhole = intermediate + partC;
    
    const questionTextRaw = `Think of two connected number bonds:\\nBond 1 has parts ${partA} and ${partB}. Let's call its whole "Number X".\\nBond 2 has parts "Number X" and ${partC}. What is the whole for Bond 2?`;
    const questionTextShort = `Bond 1: parts ${partA}, ${partB} = X.\\nBond 2: parts X, ${partC}. Whole?`;
    const questionText = getQText(questionTextRaw, questionTextShort);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: Keep exact "questionText". Return exact JSON.\n\n MATH CONSTRAINTS:\n - Final Answer MUST be: "${finalWhole}"\n ${formatInstructions}\n OUTPUT FORMAT:\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: generateOptions(finalWhole),
          defectMap: generateDefectMap(finalWhole),
          hint: "Solve for Number X first. Then use that number to solve the second bond.",
          finalAnswer: String(finalWhole),
          solutionSteps: `1. Solve Bond 1: The parts are ${partA} and ${partB}. Number X is ${partA} + ${partB} = ${intermediate}.\\n2. Solve Bond 2: The parts are Number X (${intermediate}) and ${partC}.\\n3. The final whole is ${intermediate} + ${partC} = ${finalWhole}.`
        },
        visualEngine: {
          componentToRender: "MULTI_COMPONENT",
          componentData: {
            className: "gap-12 md:gap-24",
            components: [
              {
                componentToRender: "NUMBER_BOND",
                componentData: { whole: "X", parts: [partA, partB] }
              },
              {
                componentToRender: "NUMBER_BOND",
                componentData: { whole: "?", parts: ["X", partC] }
              }
            ]
          }
        },
        inputRequirement: { inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: false }
    };
  }

  return null;
};
