import { numberToWords } from '@/lib/utils/math-helpers';

export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, hideVisual) {
  const commonMeta = { level, topic, type: zodType, difficulty: zodDiff };
  const inputType = isStructure ? 'MULTI_STEP_INPUT' : (isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT');

  if (activeVariant === 'foundation_compare_two') {
    const num1 = Math.floor(Math.random() * 80) + 10;
    let num2;
    do { num2 = Math.floor(Math.random() * 80) + 10; } while (num1 === num2);
    
    const askGreater = Math.random() > 0.5;
    const answer = askGreater ? String(Math.max(num1, num2)) : String(Math.min(num1, num2));
    const targetWord = askGreater ? "greater" : "smaller"; // Renamed from targetWord to targetWord
    let options = null;
    let defectMap = null;
    if (isMCQ) {
      const wrongAnswer = askGreater ? String(Math.min(num1, num2)) : String(Math.max(num1, num2));
      options = Array.from(new Set([answer, wrongAnswer, String(Math.max(num1, num2) + 10), String(Math.min(num1, num2) - 5)])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [wrongAnswer]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }
    const hint = getQText(`Look at the tens digits of ${num1} and ${num2}. Which one is ${targetWord}?`, `Compare the tens place first.`);

    const questionText = getQText(`Look at the number cards. Which number is ${targetWord}?`, `Which is ${targetWord}: ${num1} or ${num2}?`);
    const solutionSteps = getQText(`Comparing the tens and ones, ${answer} is the ${targetWord} number.`, `${answer} is the ${targetWord} number.`);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story unless replacing the [STORY] placeholder. DO NOT change the "visualEngine" component or "solutionSteps". Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n MATH CONSTRAINTS:\n - Topic: Compare 2 Numbers\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: hint,
          finalAnswer: answer,
          solutionSteps: solutionSteps
        },
        visualEngine: {
          componentToRender: hideVisual ? "NONE" : "NUMBER_CARDS",
          componentData: { items: [`${num1}`, `${num2}`], hideVisual: hideVisual }
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: "compare_two", hideVisual: hideVisual }
    };
  }

  if (activeVariant === 'foundation_greatest_three' || activeVariant === 'foundation_smallest_three') {
    const askGreatest = activeVariant === 'foundation_greatest_three';
    const nums = [];
    while(nums.length < 3) {
      const n = Math.floor(Math.random() * 80) + 10;
      if (!nums.includes(n)) nums.push(n);
    }
    
    const targetWord = askGreatest ? "greatest" : "smallest";
    const answer = String(askGreatest ? Math.max(...nums) : Math.min(...nums));
    
    let distractor;
    do { 
       distractor = Math.floor(Math.random() * 80) + 10; 
    } while (nums.includes(distractor) || (askGreatest && distractor > Math.max(...nums)) || (!askGreatest && distractor < Math.min(...nums)));

    let options = null;
    let defectMap = null;
    if (isMCQ) {
      options = Array.from(new Set([String(nums[0]), String(nums[1]), String(nums[2]), String(distractor)])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {};
      options.forEach(opt => { if (opt !== answer) defectMap[opt] = "CONCEPTUAL_ERROR"; });
    }
    const hint = getQText(`Look at all the numbers. Which one has the ${askGreatest ? 'most' : 'least'} tens?`, `Compare the tens places.`);

    const questionText = getQText(`Look at the number cards. Which is the ${targetWord} number?`, `Which is the ${targetWord}: ${nums[0]}, ${nums[1]}, or ${nums[2]}?`);
    const solutionSteps = getQText(`Looking at the numbers ${nums.join(', ')}, the ${targetWord} one is ${answer}.`, `${answer} is the ${targetWord}.`);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story unless replacing the [STORY] placeholder. DO NOT change the "visualEngine" component or "solutionSteps". Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n MATH CONSTRAINTS:\n - Topic: Identify ${targetWord}\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: hint,
          finalAnswer: answer,
          solutionSteps: solutionSteps
        },
        visualEngine: {
          componentToRender: hideVisual ? "NONE" : "NUMBER_CARDS",
          componentData: { items: [`${nums[0]}`, `${nums[1]}`, `${nums[2]}`], hideVisual: hideVisual }
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: askGreatest ? "greatest_3" : "smallest_3", hideVisual: hideVisual }
    };
  }

  if (activeVariant === 'foundation_greater_than_target' || activeVariant === 'foundation_smaller_than_target') {
    const askGreater = activeVariant === 'foundation_greater_than_target';
    const targetWord = askGreater ? "greater" : "smaller";
    
    // Target between 25 and 85 to leave room on both sides
    const target = Math.floor(Math.random() * 60) + 25; 
    
    // We need 1 correct answer and 2 wrong options for the visual cards
    const answer = askGreater 
        ? target + Math.floor(Math.random() * 10) + 1 
        : target - (Math.floor(Math.random() * 10) + 1);
        
    const distractor1 = askGreater
        ? target - (Math.floor(Math.random() * 10) + 1)
        : target + Math.floor(Math.random() * 10) + 1;
        
    let distractor2;
    do {
        distractor2 = askGreater
            ? target - (Math.floor(Math.random() * 10) + 1)
            : target + Math.floor(Math.random() * 10) + 1;
    } while (distractor1 === distractor2);
    
    const cardNums = [answer, distractor1, distractor2].sort(() => Math.random() - 0.5);
    const answerStr = String(answer);
    
    let options = null;
    let defectMap = null;
    if (isMCQ) {
      options = Array.from(new Set([String(answer), String(distractor1), String(distractor2), String(target)])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answerStr) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [String(distractor1)]: "CONCEPTUAL_ERROR",
        [String(distractor2)]: "CONCEPTUAL_ERROR",
        [String(target)]: "CONSTANT_VIOLATION"
      };
      options.forEach(opt => { if (opt !== answerStr && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }
    const hint = getQText(`Compare each number on the cards with ${target}. Which one is ${targetWord}?`, `Which number is ${targetWord} than ${target}?`);

    const questionText = getQText(`Look at the number cards. Which number is ${targetWord} than ${target}?`, `Which number is ${targetWord} than ${target}?`);
    const solutionSteps = getQText(`Comparing the numbers to ${target}, only ${answerStr} is ${targetWord} than ${target}.`, `${answerStr} is ${targetWord} than ${target}.`);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story unless replacing the [STORY] placeholder. DO NOT change the "visualEngine" component or "solutionSteps". Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n MATH CONSTRAINTS:\n - Topic: Compare to Target\n - Final Answer MUST be: "${answerStr}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: hint,
          finalAnswer: answerStr,
          solutionSteps: solutionSteps
        },
        visualEngine: {
          componentToRender: "NUMBER_CARDS",
          componentData: { items: [`${cardNums[0]}`, `${cardNums[1]}`, `${cardNums[2]}`], hideVisual: false }
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: askGreater ? "greater_than_target" : "smaller_than_target", hideVisual: false }
    };
  }

}