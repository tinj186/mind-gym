function getAddSteps(num1, num2, p, maskNum, answer) {
    const d1 = [num1 % 10, Math.floor(num1/10)%10, Math.floor(num1/100)%10, Math.floor(num1/1000)];
    const d2 = [num2 % 10, Math.floor(num2/10)%10, Math.floor(num2/100)%10, Math.floor(num2/1000)];
    const places = ["ones", "tens", "hundreds", "thousands"];
    let steps = [];
    let carryIn = 0;
    for (let i = 0; i <= p; i++) {
       let carryOut = Math.floor((d1[i] + d2[i] + carryIn) / 10);
       let total = carryIn + d1[i] + d2[i];
       if (i < p) {
         let eqLeft = carryIn > 0 ? `${carryIn} + ${d1[i]} + ${d2[i]}` : `${d1[i]} + ${d2[i]}`;
         steps.push(`{ "label": "Look at the ${places[i]} column. Form an equation to find the total.", "expectedAnswer": "${eqLeft} = ${total}" }`);
       } else {
         let leftSub = carryIn > 0 ? `${carryIn} + ` : "";
         if (maskNum === 1) leftSub += `${answer} + ${d2[i]}`;
         else leftSub += `${d1[i]} + ${answer}`;
         steps.push(`{ "label": "Look at the ${places[i]} column. Form an equation to find the missing digit.", "expectedAnswer": "${leftSub} = ${total}" }`);
       }
       carryIn = carryOut;
    }
    steps.push(`{ "label": "What is the missing digit?", "expectedAnswer": "${answer}" }`);
    return steps.join(",\\n      ");
}

function getSubSteps(num1, num2, p, maskNum, answer) {
    const d1 = [num1 % 10, Math.floor(num1/10)%10, Math.floor(num1/100)%10, Math.floor(num1/1000)];
    const d2 = [num2 % 10, Math.floor(num2/10)%10, Math.floor(num2/100)%10, Math.floor(num2/1000)];
    const places = ["ones", "tens", "hundreds", "thousands"];
    let steps = [];
    let borrowedFrom = [0, 0, 0, 0, 0];
    for (let i = 0; i <= p; i++) {
       let top = d1[i] - borrowedFrom[i];
       let received10 = false;
       if (top < d2[i]) {
           received10 = true;
           top += 10;
           borrowedFrom[i+1] = 1;
       }
       let total = top - d2[i];
       if (i < p) {
         let eqLeft = "";
         if (received10) eqLeft = `1${d1[i] - borrowedFrom[i]} - ${d2[i]}`;
         else eqLeft = borrowedFrom[i] > 0 ? `${d1[i]} - 1 - ${d2[i]}` : `${d1[i]} - ${d2[i]}`;
         steps.push(`{ "label": "Look at the ${places[i]} column. Form an equation to find the digit.", "expectedAnswer": "${eqLeft} = ${total}" }`);
       } else {
         let eqLeft = "";
         if (maskNum === 1) {
            eqLeft = received10 ? `1${answer}` : `${answer}`;
            if (borrowedFrom[i] > 0) eqLeft += " - 1";
            eqLeft += ` - ${d2[i]}`;
         } else {
            if (received10) eqLeft = `1${d1[i] - borrowedFrom[i]} - ${answer}`;
            else eqLeft = borrowedFrom[i] > 0 ? `${d1[i]} - 1 - ${answer}` : `${d1[i]} - ${answer}`;
         }
         steps.push(`{ "label": "Look at the ${places[i]} column. Form an equation to find the missing digit.", "expectedAnswer": "${eqLeft} = ${total}" }`);
       }
    }
    steps.push(`{ "label": "What is the missing digit?", "expectedAnswer": "${answer}" }`);
    return steps.join(",\\n      ");
}

export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  const variants = [
    'advanced_algo_missing_digit_add',
    'advanced_algo_missing_digit_sub',
    'advanced_word_add_three_4_digit_numbers',
    'advanced_word_add_sub_4_digit_numbers',
    'advanced_algo_missing_two_digits_add',
    'advanced_algo_missing_two_digits_sub',
    'advanced_word_part_whole',
    'advanced_word_comparison'
  ];

  if (activeVariant === 'advanced_random' || !variants.includes(activeVariant)) {
    activeVariant = variants[Math.floor(Math.random() * variants.length)];
  }

  let answer;
  let askText = '';
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let customConstraints = "";
  let num1, num2, num3, total, remain;
  const { getRandomNames, getRandomCountableItems } = require('@/lib/utils/variable-bank');
  const isAdd = activeVariant.includes('add');

  if (activeVariant === 'advanced_algo_missing_digit_add') {
    num1 = Math.floor(Math.random() * 8000) + 1000;
    num2 = Math.floor(Math.random() * 1999) + 1; 
    const sum = num1 + num2;
    const p = Math.floor(Math.random() * 4); // 0 to 3
    const maskNum = Math.floor(Math.random() * 2) + 1; // 1 or 2
    
    let str1 = String(num1).padStart(4, '0');
    let str2 = String(num2).padStart(4, '0');
    
    if (maskNum === 1) {
       answer = str1[3-p];
       str1 = str1.substring(0, 3-p) + '?' + str1.substring(4-p);
    } else {
       answer = str2[3-p];
       str2 = str2.substring(0, 3-p) + '?' + str2.substring(4-p);
    }

    askText = `Find the missing digit in the addition algorithm.`;
    visualEngineStr = `{\n    "componentToRender": "VERTICAL_ALGORITHM",\n    "componentData": { "items": ["${str1}", "+", "${str2}", "${sum}"] }\n  }`;
    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      ${getAddSteps(num1, num2, p, maskNum, answer)}\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'advanced_algo_missing_digit_sub') {
    num1 = Math.floor(Math.random() * 5000) + 4000; // 4000 to 8999
    num2 = Math.floor(Math.random() * 3999) + 1; // 1 to 3999, so num1 > num2
    const diff = num1 - num2;
    const p = Math.floor(Math.random() * 4); // 0 to 3
    const maskNum = Math.floor(Math.random() * 2) + 1; // 1 or 2
    
    let str1 = String(num1).padStart(4, '0');
    let str2 = String(num2).padStart(4, '0');
    
    if (maskNum === 1) {
       answer = str1[3-p];
       str1 = str1.substring(0, 3-p) + '?' + str1.substring(4-p);
    } else {
       answer = str2[3-p];
       str2 = str2.substring(0, 3-p) + '?' + str2.substring(4-p);
    }

    askText = `Find the missing digit in the subtraction algorithm.`;
    visualEngineStr = `{\n    "componentToRender": "VERTICAL_ALGORITHM",\n    "componentData": { "items": ["${str1}", "-", "${str2}", "${diff}"] }\n  }`;
    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      ${getSubSteps(num1, num2, p, maskNum, answer)}\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'advanced_word_add_three_4_digit_numbers') {
    num1 = Math.floor(Math.random() * 2000) + 1000;
    num2 = Math.floor(Math.random() * 2000) + 1000;
    num3 = Math.floor(Math.random() * 2000) + 1000;
    const sum = num1 + num2 + num3;
    answer = String(sum);
    
    const name = getRandomNames(1)[0];
    const item = getRandomCountableItems(1).item;
    
    askText = `${name} collected ${num1} ${item} on Monday, ${num2} ${item} on Tuesday, and ${num3} ${item} on Wednesday. How many ${item} did ${name} collect in total?`;
    visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
    
    customConstraints = `- In the model solution, show the vertical algorithm to find the total.`;
    
    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Form an equation to find the total number of ${item}.", "expectedAnswer": "${num1} + ${num2} + ${num3} = ${sum}" },\n      { "label": "What is the final answer?", "expectedAnswer": "${sum}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'advanced_word_add_sub_4_digit_numbers') {
    num1 = Math.floor(Math.random() * 2000) + 1000;
    num2 = Math.floor(Math.random() * 2000) + 1000;
    total = Math.floor(Math.random() * 2000) + 7000;
    remain = total - (num1 + num2);
    answer = String(remain);
    
    const name = getRandomNames(1)[0];
    const item = getRandomCountableItems(1).item;
    
    askText = `${name} had ${total} ${item} in a warehouse. They shipped out ${num1} ${item} in the morning and ${num2} ${item} in the afternoon. How many ${item} are left in the warehouse?`;
    visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
    
    customConstraints = `- In the model solution, provide the vertical algorithms for BOTH the addition step and the subtraction step.`;
    
    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Form an equation to find the total number of ${item} shipped out.", "expectedAnswer": "${num1} + ${num2} = ${num1 + num2}" },\n      { "label": "Form an equation to find the remaining number of ${item}.", "expectedAnswer": "${total} - ${num1 + num2} = ${remain}" },\n      { "label": "What is the final answer?", "expectedAnswer": "${remain}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'advanced_algo_missing_two_digits_add') {
    const th1 = Math.floor(Math.random() * 5) + 1;
    const h1 = Math.floor(Math.random() * 5) + 1;
    const t1 = Math.floor(Math.random() * 8) + 1;
    const o1 = Math.floor(Math.random() * 5) + 5;
    const th2 = Math.floor(Math.random() * 3) + 1;
    const h2 = Math.floor(Math.random() * 3) + 1;
    const t2 = Math.floor(Math.random() * 4) + 1;
    const o2 = Math.floor(Math.random() * 4) + 5; 
    num1 = th1 * 1000 + h1 * 100 + t1 * 10 + o1;
    num2 = th2 * 1000 + h2 * 100 + t2 * 10 + o2;
    const sum = num1 + num2;
    const maskedNum1 = `${th1}${h1}?${o1}`;
    const maskedNum2 = `${th2}${h2}${t2}?`;
    answer = `${t1}, ${o2}`;
    askText = `Find the two missing digits in the addition algorithm. (Format: tens digit of first number, ones digit of second number)`;
    visualEngineStr = `{\n    "componentToRender": "VERTICAL_ALGORITHM",\n    "componentData": { "items": ["${maskedNum1}", "+", "${maskedNum2}", "${sum}"] }\n  }`;
    if (isStructure) {
      const sumOnes = (o1 + o2) % 10;
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Look at the ones column. Form an equation to find the missing digit.", "expectedAnswer": "${o1} + ${o2} = 1${sumOnes}" },\n      { "label": "Look at the tens column. Form an equation to find the missing digit.", "expectedAnswer": "1 + ${t1} + ${t2} = ${t1 + t2 + 1}" },\n      { "label": "What are the two missing digits?", "expectedAnswer": "${answer}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'advanced_algo_missing_two_digits_sub') {
    const th1 = Math.floor(Math.random() * 4) + 5;
    const h1 = Math.floor(Math.random() * 4) + 5;
    const t1 = Math.floor(Math.random() * 4) + 1;
    const o1 = Math.floor(Math.random() * 4) + 1;
    const th2 = Math.floor(Math.random() * 3) + 1;
    const h2 = Math.floor(Math.random() * 3) + 1;
    const t2 = Math.floor(Math.random() * 4) + 5;
    const o2 = Math.floor(Math.random() * 4) + 5;
    num1 = th1 * 1000 + h1 * 100 + t1 * 10 + o1;
    num2 = th2 * 1000 + h2 * 100 + t2 * 10 + o2;
    const diff = num1 - num2;
    const maskedNum1 = `${th1}${h1}?${o1}`;
    const maskedNum2 = `${th2}${h2}${t2}?`;
    answer = `${t1}, ${o2}`;
    askText = `Find the two missing digits in the subtraction algorithm. (Format: tens digit of first number, ones digit of second number)`;
    visualEngineStr = `{\n    "componentToRender": "VERTICAL_ALGORITHM",\n    "componentData": { "items": ["${maskedNum1}", "-", "${maskedNum2}", "${diff}"] }\n  }`;
    if (isStructure) {
      const diffTens = Math.floor(diff / 10) % 10;
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Look at the ones column. Form an equation to find the missing digit.", "expectedAnswer": "1${o1} - ${o2} = ${(10 + o1) - o2}" },\n      { "label": "Look at the tens column. Form an equation to find the missing digit.", "expectedAnswer": "${t1} - 1 - ${t2} = ${diffTens}" },\n      { "label": "What are the two missing digits?", "expectedAnswer": "${answer}" }\n    ]\n  }`;
    }
  } else if (activeVariant === 'advanced_word_part_whole') {
    const scenario = Math.floor(Math.random() * 3); // 0 = find whole, 1 = find part1, 2 = find part2
    const part1 = Math.floor(Math.random() * 4000) + 1000;
    const part2 = Math.floor(Math.random() * 4000) + 1000;
    const whole = part1 + part2;
    
    askText = "AI_GENERATED";
    
    if (scenario === 0) {
      answer = String(whole);
      customConstraints = `- Write a creative word problem about combining two quantities to find a total.
- Use the character name "${context.name[0]}" and the item "${selectedContextItem}".
- The two quantities must be exactly ${part1} and ${part2}.
- The question must ask for the total amount.`;
      
      visualEngineStr = `{
        "componentToRender": "BAR_MODEL",
        "componentData": {
          "modelType": "PART_WHOLE",
          "parts": ["?", "?"],
          "whole": "?",
          "barLabel": "string - short label (max 2 words) describing what the total represents (e.g. Total Books, Cars)"
        }
      }`;
      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1 (Equation)", expectedAnswer: `${part1} + ${part2} = ${whole}` },
            { label: "Step 2 (Final Answer)", expectedAnswer: String(whole) }
          ]
        });
      }
    } else if (scenario === 1) {
      answer = String(part1);
      customConstraints = `- Write a creative word problem where a total amount is broken into two parts, and one part is unknown.
- Use the character name "${context.name[0]}" and the item "${selectedContextItem}".
- The total amount must be exactly ${whole}.
- The known part must be exactly ${part2}.
- The question must ask for the remaining unknown part.`;
      
      visualEngineStr = `{
        "componentToRender": "BAR_MODEL",
        "componentData": {
          "modelType": "PART_WHOLE",
          "parts": ["?", "?"],
          "whole": "?",
          "barLabel": "string - short label (max 2 words) describing what the total represents (e.g. Total Books, Cars)"
        }
      }`;
      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1 (Equation)", expectedAnswer: `${whole} - ${part2} = ${part1}` },
            { label: "Step 2 (Final Answer)", expectedAnswer: String(part1) }
          ]
        });
      }
    } else {
      answer = String(part2);
      customConstraints = `- Write a creative word problem where a total amount is broken into two parts, and one part is unknown.
- Use the character name "${context.name[0]}" and the item "${selectedContextItem}".
- The total amount must be exactly ${whole}.
- The known part must be exactly ${part1}.
- The question must ask for the remaining unknown part.`;
      
      visualEngineStr = `{
        "componentToRender": "BAR_MODEL",
        "componentData": {
          "modelType": "PART_WHOLE",
          "parts": ["?", "?"],
          "whole": "?",
          "barLabel": "string - short label (max 2 words) describing what the total represents (e.g. Total Books, Cars)"
        }
      }`;
      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1 (Equation)", expectedAnswer: `${whole} - ${part1} = ${part2}` },
            { label: "Step 2 (Final Answer)", expectedAnswer: String(part2) }
          ]
        });
      }
    }
  } else if (activeVariant === 'advanced_word_comparison') {
    const isMoreThan = Math.random() > 0.5;
    const scenario = Math.floor(Math.random() * 3); // 0 = find target, 1 = find base, 2 = find difference
    const baseValue = Math.floor(Math.random() * 4000) + 1000;
    const difference = Math.floor(Math.random() * 1000) + 100;
    const secondName = getRandomNames(1)[0];
    const firstName = context.name[0];
    
    askText = "AI_GENERATED";

    if (isMoreThan) {
      const targetValue = baseValue + difference;
      
      let questionConstraint = "";
      let steps = [];
      if (scenario === 0) {
        answer = String(targetValue);
        questionConstraint = `- The question must ask for the amount ${secondName} has.`;
        steps = [
          { label: "Step 1 (Equation)", expectedAnswer: `${baseValue} + ${difference} = ${targetValue}` },
          { label: "Step 2 (Final Answer)", expectedAnswer: String(targetValue) }
        ];
      } else if (scenario === 1) {
        answer = String(baseValue);
        questionConstraint = `- The question must ask for the amount ${firstName} has.`;
        steps = [
          { label: "Step 1 (Equation)", expectedAnswer: `${targetValue} - ${difference} = ${baseValue}` },
          { label: "Step 2 (Final Answer)", expectedAnswer: String(baseValue) }
        ];
      } else {
        answer = String(difference);
        questionConstraint = `- The question must ask for how many more ${selectedContextItem} ${secondName} has than ${firstName}.`;
        steps = [
          { label: "Step 1 (Equation)", expectedAnswer: `${targetValue} - ${baseValue} = ${difference}` },
          { label: "Step 2 (Final Answer)", expectedAnswer: String(difference) }
        ];
      }
      
      customConstraints = `- Write a creative word problem about comparing two quantities of ${selectedContextItem}.
- ${firstName} has exactly ${baseValue} ${selectedContextItem}.
- ${secondName} has exactly ${difference} MORE ${selectedContextItem} than ${firstName}.
${questionConstraint}`;
      
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          modelType: "COMPARISON",
          bar1: { name: firstName, value: String(baseValue) },
          bar2: { name: secondName, value: String(targetValue) }
        }
      });
      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: steps
        });
      }
    } else {
      const targetValue = baseValue - difference;
      
      let questionConstraint = "";
      let steps = [];
      if (scenario === 0) {
        answer = String(targetValue);
        questionConstraint = `- The question must ask for the amount ${secondName} has.`;
        steps = [
          { label: "Step 1 (Equation)", expectedAnswer: `${baseValue} - ${difference} = ${targetValue}` },
          { label: "Step 2 (Final Answer)", expectedAnswer: String(targetValue) }
        ];
      } else if (scenario === 1) {
        answer = String(baseValue);
        questionConstraint = `- The question must ask for the amount ${firstName} has.`;
        steps = [
          { label: "Step 1 (Equation)", expectedAnswer: `${targetValue} + ${difference} = ${baseValue}` },
          { label: "Step 2 (Final Answer)", expectedAnswer: String(baseValue) }
        ];
      } else {
        answer = String(difference);
        questionConstraint = `- The question must ask for how many fewer ${selectedContextItem} ${secondName} has than ${firstName}.`;
        steps = [
          { label: "Step 1 (Equation)", expectedAnswer: `${baseValue} - ${targetValue} = ${difference}` },
          { label: "Step 2 (Final Answer)", expectedAnswer: String(difference) }
        ];
      }

      customConstraints = `- Write a creative word problem about comparing two quantities of ${selectedContextItem}.
- ${firstName} has exactly ${baseValue} ${selectedContextItem}.
- ${secondName} has exactly ${difference} FEWER ${selectedContextItem} than ${firstName}.
${questionConstraint}`;
      
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          modelType: "COMPARISON",
          bar1: { name: firstName, value: String(baseValue) },
          bar2: { name: secondName, value: String(targetValue) }
        }
      });
      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: steps
        });
      }
    }
  }

  const { generateAlgorithmTables } = require('@/lib/utils/math-html-utils');
  
  let solutionStepsRule = "";
  if (activeVariant === 'advanced_word_add_three_4_digit_numbers') {
    const [step1HTML, step2HTML] = generateAlgorithmTables(num1, num2, true, num3);
    solutionStepsRule = `- For \`solutionSteps\`, provide EXACTLY TWO steps:
  1. "Setting up the vertical algorithm:" followed by this exact HTML: \\n${step1HTML}
  2. "Solving with renaming/regrouping:" followed by this exact HTML: \\n${step2HTML}
  CRITICAL: DO NOT modify the HTML strings. Use them EXACTLY as provided above!
  separate steps using the exact characters \\\\n inside the string.for line breaks inside the JSON string.`;
  } else if (activeVariant === 'advanced_word_add_sub_4_digit_numbers') {
    const [addStep1, addStep2] = generateAlgorithmTables(num1, num2, true);
    const [subStep1, subStep2] = generateAlgorithmTables(total, num1 + num2, false);
    solutionStepsRule = `- For \`solutionSteps\`, provide EXACTLY FOUR steps:
  1. "Adding the shipped amounts:" followed by this exact HTML: \\n${addStep1}
  2. "Solving the addition:" followed by this exact HTML: \\n${addStep2}
  3. "Subtracting from the total:" followed by this exact HTML: \\n${subStep1}
  4. "Solving the subtraction:" followed by this exact HTML: \\n${subStep2}
  CRITICAL: DO NOT modify the HTML strings. Use them EXACTLY as provided above!
  separate steps using the exact characters \\\\n inside the string.for line breaks inside the JSON string.`;
  } else if (activeVariant === 'advanced_word_part_whole' || activeVariant === 'advanced_word_comparison') {
    solutionStepsRule = `- For \`solutionSteps\`, provide a BRIEF 2-3 sentence explanation of how to solve the word problem using the information given. Keep it very short. Do NOT draw an HTML table in the solution steps.
  CRITICAL: You MUST separate steps using the exact literal characters \\\\n inside the string. Do NOT use raw newlines!`;
  } else {
    // Missing digit variants
    const [step1HTML, step2HTML] = generateAlgorithmTables(num1, num2, isAdd, num3);
    solutionStepsRule = `- For \`solutionSteps\`, provide a BRIEF 2-3 sentence text explanation of how to find the missing digit(s). Keep it very short. Do NOT draw an HTML table in the solution steps. 
  CRITICAL: You MUST separate steps using the exact literal characters \\\\n inside the string. Do NOT use raw newlines!`;
  }

  let aiPrompt = `You are an expert Primary 3 math generator.
Generate a question for the subtopic: Addition/Subtraction Algorithms (4-Digit).
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
${askText === "AI_GENERATED" ? "" : `- You MUST use the exact string "${askText}" as the \`questionText\`.`}
- You MUST use the exact string "${answer}" as the \`finalAnswer\`.
- You MUST explicitly generate a \`solutionSteps\` and a \`hint\`.
${solutionStepsRule}
- If MCQ, provide 4 options including the correct answer and 3 reasonable distractors. Ensure the correct option matches "${answer}".
- Do NOT modify the \`visualEngine\` or \`inputRequirement\` JSON blocks provided in the template. Use them EXACTLY as shown.
- Return ONLY valid JSON. Ensure the JSON object ends properly without extra repeating closing braces.
${customConstraints ? customConstraints : ""}

${getFormatInstructions(visualEngineStr, inputRequirementStr)}`;

  return {
    aiPrompt: aiPrompt,
    metadata: {
      difficulty: 'advanced',
      steps: isStructure ? 2 : 1,
      maxNumber: 10000,
      logicDescription: "Missing digits in 4-digit addition/subtraction algorithms."
    }
  };
}
