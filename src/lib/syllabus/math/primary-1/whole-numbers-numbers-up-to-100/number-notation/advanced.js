import { numberToWords } from '@/lib/utils/math-helpers';

export const advancedLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, isNotationVariant) => {

  const commonMeta = {
    zodType,
    difficulty: zodDiff,
    level,
    topic
  };
  
  const inputType = isStructure ? 'MULTI_STEP_INPUT' : (isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT');

  // 1. advanced_riddle_two_clues_to_word
  // Deduce a number from 2 clues (e.g., "My tens digit is 4. My ones digit is 2 more than my tens digit. Write my name in words.")
  if (activeVariant === 'advanced_riddle_two_clues_to_word') {
    const tens = Math.floor(Math.random() * 6) + 2; // 2 to 7
    // ones is either more or less than tens
    let isMore = Math.random() > 0.5;
    let diff = Math.floor(Math.random() * 3) + 1; // 1 to 3
    
    // Ensure ones digit is between 0 and 9
    if (isMore && tens + diff > 9) isMore = false;
    if (!isMore && tens - diff < 0) isMore = true;
    
    const ones = isMore ? tens + diff : tens - diff;
    const num = tens * 10 + ones;
    const answer = numberToWords(num).toLowerCase();
    
    const clueWord = isMore ? "more" : "less";
    const questionTextRaw = `I am a 2-digit number. My tens digit is ${tens}. My ones digit is ${diff} ${clueWord} than my tens digit. Write my name in words.`;
    const questionTextShort = `Tens digit is ${tens}, ones digit is ${diff} ${clueWord}. Number in words:`;
    
    let defectMap = null;
    let options = null;
    
    if (isMCQ) {
      // Swapped tens/ones distractor
      const swapped = ones * 10 + tens;
      const wrongOpOnes = isMore ? tens - diff : tens + diff;
      const wrongOpDist = tens * 10 + wrongOpOnes;
      
      const distractorSet = new Set();
      if (swapped >= 10 && swapped !== num) distractorSet.add(numberToWords(swapped).toLowerCase());
      if (wrongOpOnes >= 0 && wrongOpOnes <= 9 && wrongOpDist !== num) distractorSet.add(numberToWords(wrongOpDist).toLowerCase());
      while (distractorSet.size < 3) distractorSet.add(numberToWords(Math.floor(Math.random() * 80) + 20).toLowerCase());
      
      options = [answer, ...Array.from(distractorSet).slice(0, 3)].sort(() => Math.random() - 0.5);
      defectMap = {};
      options.forEach(opt => { if (opt !== answer) defectMap[opt] = "CONCEPTUAL_ERROR"; });
    }

    const questionText = getQText(questionTextRaw, questionTextShort);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Number Notation\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "First find out what the ones digit is. Then put the tens and ones digits together.",
          finalAnswer: answer,
          solutionSteps: `1. The tens digit is ${tens}.\\n2. The ones digit is ${tens} ${isMore ? '+' : '-'} ${diff} = ${ones}.\\n3. The number is ${num}, which is written as ${answer}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: true }
    };
  }

  // 2. advanced_riddle_sum_of_digits
  if (activeVariant === 'advanced_riddle_sum_of_digits') {
    const tens = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const ones = Math.floor(Math.random() * 10);
    const num = tens * 10 + ones;
    const sum = tens + ones;
    const answer = numberToWords(num).toLowerCase();
    
    const lowerBound = tens * 10;
    const upperBound = tens * 10 + 10;
    
    const questionTextRaw = `I am a number between ${lowerBound - 1} and ${upperBound}. The sum of my digits is ${sum}. Write my name in words.`;
    const questionTextShort = `Between ${lowerBound - 1} and ${upperBound}, sum of digits is ${sum}. Number in words:`;
    
    let defectMap = null;
    let options = null;
    
    if (isMCQ) {
      const swapped = ones * 10 + tens;
      const distractorSet = new Set();
      if (swapped >= 10 && swapped !== num) distractorSet.add(numberToWords(swapped).toLowerCase());
      while (distractorSet.size < 3) {
        const rand = Math.floor(Math.random() * 10);
        const wrongNum = tens * 10 + rand;
        if (wrongNum !== num) distractorSet.add(numberToWords(wrongNum).toLowerCase());
      }
      
      options = [answer, ...Array.from(distractorSet).slice(0, 3)].sort(() => Math.random() - 0.5);
      defectMap = {};
      options.forEach(opt => { if (opt !== answer) defectMap[opt] = "CONCEPTUAL_ERROR"; });
    }

    const questionText = getQText(questionTextRaw, questionTextShort);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Number Notation\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: `If the number is between ${lowerBound - 1} and ${upperBound}, what must the tens digit be?`,
          finalAnswer: answer,
          solutionSteps: `1. A number between ${lowerBound - 1} and ${upperBound} must have ${tens} in the tens place.\\n2. Since the sum of digits is ${sum}, the ones digit is ${sum} - ${tens} = ${ones}.\\n3. The number is ${num}, written as ${answer}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: true }
    };
  }

  // 3. advanced_regrouping_place_value
  if (activeVariant === 'advanced_regrouping_place_value') {
    const tens = Math.floor(Math.random() * 6) + 1; // 1 to 6
    const ones = Math.floor(Math.random() * 10) + 10; // 10 to 19 (requires regrouping)
    const num = tens * 10 + ones;
    const answer = numberToWords(num).toLowerCase();
    
    const questionTextRaw = `Write ${tens} tens and ${ones} ones in words.`;
    const questionTextShort = `${tens} tens and ${ones} ones in words:`;
    
    let defectMap = null;
    let options = null;
    
    if (isMCQ) {
      // Distractor: student just mashes them together (e.g., 3 tens 14 ones -> 314? No, out of scope. Maybe just 44)
      const wrongNoRegroup = (tens + 1) * 10 + (ones % 10 - 1); // just a random plausible mistake
      const wrongAddError = (tens - 1) * 10 + ones; 
      
      const distractorSet = new Set();
      distractorSet.add(numberToWords((tens * 10) + (ones % 10)).toLowerCase()); // Forgot to carry the ten
      if (wrongAddError > 10) distractorSet.add(numberToWords(wrongAddError).toLowerCase());
      while (distractorSet.size < 3) distractorSet.add(numberToWords(Math.floor(Math.random() * 80) + 20).toLowerCase());
      distractorSet.delete(answer);
      
      options = [answer, ...Array.from(distractorSet).slice(0, 3)].sort(() => Math.random() - 0.5);
      defectMap = {};
      options.forEach(opt => { if (opt !== answer) defectMap[opt] = "CONCEPTUAL_ERROR"; });
    }

    const questionText = getQText(questionTextRaw, questionTextShort);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Number Notation\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: `${tens} tens is ${tens * 10}. Add that to ${ones}.`,
          finalAnswer: answer,
          solutionSteps: `1. ${tens} tens = ${tens * 10}.\\n2. ${tens * 10} + ${ones} = ${num}.\\n3. The number ${num} is written as ${answer}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: true }
    };
  }

  // 4. advanced_number_pattern_next_word
  if (activeVariant === 'advanced_number_pattern_next_word') {
    const step = Math.floor(Math.random() * 4) + 2; // jump by 2, 3, 4, or 5
    const start = Math.floor(Math.random() * 50) + 20; 
    const n1 = start;
    const n2 = start + step;
    const n3 = start + step * 2;
    const num = start + step * 3;
    const answer = numberToWords(num).toLowerCase();
    
    const questionTextRaw = `Find the next number in the pattern: ${numberToWords(n1).toLowerCase()}, ${numberToWords(n2).toLowerCase()}, ${numberToWords(n3).toLowerCase()}, ____. Write the missing number in words.`;
    const questionTextShort = `Next in pattern: ${n1}, ${n2}, ${n3}, ____ (in words)`;
    
    let defectMap = null;
    let options = null;
    
    if (isMCQ) {
      const wrongAdd = start + step * 4;
      const wrongSub = start + step * 2 - step;
      
      const distractorSet = new Set([numberToWords(wrongAdd).toLowerCase(), numberToWords(wrongSub).toLowerCase()]);
      while (distractorSet.size < 3) distractorSet.add(numberToWords(Math.floor(Math.random() * 80) + 20).toLowerCase());
      distractorSet.delete(answer);
      
      options = [answer, ...Array.from(distractorSet).slice(0, 3)].sort(() => Math.random() - 0.5);
      defectMap = {};
      options.forEach(opt => { if (opt !== answer) defectMap[opt] = "CONCEPTUAL_ERROR"; });
    }

    const questionText = getQText(questionTextRaw, questionTextShort);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Number Notation\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: `Write the words as numbers first. How much is added each time?`,
          finalAnswer: answer,
          solutionSteps: `1. The pattern in numbers is ${n1}, ${n2}, ${n3}.\\n2. The pattern increases by ${step} each time.\\n3. ${n3} + ${step} = ${num}, which is written as ${answer}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: true }
    };
  }

  // 5. advanced_arithmetic_sum_to_word
  if (activeVariant === 'advanced_arithmetic_sum_to_word') {
    const add1 = Math.floor(Math.random() * 40) + 20;
    const add2 = Math.floor(Math.random() * 30) + 10;
    const num = add1 + add2;
    const answer = numberToWords(num).toLowerCase();
    
    const questionTextRaw = `What is ${add1} + ${add2}? Write your answer in words.`;
    const questionTextShort = `${add1} + ${add2} in words:`;
    
    let defectMap = null;
    let options = null;
    
    if (isMCQ) {
      const distractorSet = new Set([
        numberToWords(num + 10).toLowerCase(),
        numberToWords(num - 10).toLowerCase(),
        numberToWords(num + 1).toLowerCase()
      ]);
      distractorSet.delete(answer);
      while (distractorSet.size < 3) distractorSet.add(numberToWords(Math.floor(Math.random() * 80) + 20).toLowerCase());
      
      options = [answer, ...Array.from(distractorSet).slice(0, 3)].sort(() => Math.random() - 0.5);
      defectMap = {};
      options.forEach(opt => { if (opt !== answer) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const questionText = getQText(questionTextRaw, questionTextShort);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Number Notation\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "First add the numbers together. Then spell the answer.",
          finalAnswer: answer,
          solutionSteps: `1. ${add1} + ${add2} = ${num}.\\n2. ${num} is written as ${answer}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: true }
    };
  }

  // 6. advanced_arithmetic_diff_to_word
  if (activeVariant === 'advanced_arithmetic_diff_to_word') {
    const num1 = Math.floor(Math.random() * 40) + 50; // 50 to 89
    const num2 = Math.floor(Math.random() * 30) + 10; // 10 to 39
    const num = num1 - num2;
    const answer = numberToWords(num).toLowerCase();
    
    const questionTextRaw = `What is ${num2} less than ${num1}? Write your answer in words.`;
    const questionTextShort = `${num2} less than ${num1} in words:`;
    
    let defectMap = null;
    let options = null;
    
    if (isMCQ) {
      const distractorSet = new Set([
        numberToWords(num + 10).toLowerCase(),
        numberToWords(num - 10).toLowerCase(),
        numberToWords(num1 + num2).toLowerCase() // Student added instead of subtracted
      ]);
      distractorSet.delete(answer);
      while (distractorSet.size < 3) distractorSet.add(numberToWords(Math.floor(Math.random() * 80) + 20).toLowerCase());
      
      options = [answer, ...Array.from(distractorSet).slice(0, 3)].sort(() => Math.random() - 0.5);
      defectMap = { [numberToWords(num1 + num2).toLowerCase()]: "CONCEPTUAL_ERROR" };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const questionText = getQText(questionTextRaw, questionTextShort);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Number Notation\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "Less than means you need to subtract. Then spell the answer.",
          finalAnswer: answer,
          solutionSteps: `1. ${num1} - ${num2} = ${num}.\\n2. ${num} is written as ${answer}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: true }
    };
  }

  // 7. advanced_compare_spelling_greater
  if (activeVariant === 'advanced_compare_spelling_greater') {
    const num1 = Math.floor(Math.random() * 80) + 20;
    let num2 = Math.floor(Math.random() * 80) + 20;
    while (num1 === num2) num2 = Math.floor(Math.random() * 80) + 20;
    
    const greater = Math.max(num1, num2);
    const answer = numberToWords(greater).toLowerCase();
    const w1 = numberToWords(num1).toLowerCase();
    const w2 = numberToWords(num2).toLowerCase();
    
    const questionTextRaw = `Which is greater: '${w1}' or '${w2}'? Write the greater number in words.`;
    const questionTextShort = `Greater between '${w1}' and '${w2}' in words:`;
    
    let defectMap = null;
    let options = null;
    
    if (isMCQ) {
      options = [w1, w2].sort(() => Math.random() - 0.5);
      defectMap = { [numberToWords(Math.min(num1, num2)).toLowerCase()]: "CONCEPTUAL_ERROR" };
    }

    const questionText = getQText(questionTextRaw, questionTextShort);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Number Notation\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "Write both words as numbers, compare them, and spell the larger one.",
          finalAnswer: answer,
          solutionSteps: `1. '${w1}' is ${num1} and '${w2}' is ${num2}.\\n2. ${greater} is greater.\\n3. It is written as ${answer}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: true }
    };
  }

  // 8. advanced_compare_spelling_smaller
  if (activeVariant === 'advanced_compare_spelling_smaller') {
    const num1 = Math.floor(Math.random() * 80) + 20;
    let num2 = Math.floor(Math.random() * 80) + 20;
    while (num1 === num2) num2 = Math.floor(Math.random() * 80) + 20;
    
    const smaller = Math.min(num1, num2);
    const answer = numberToWords(smaller).toLowerCase();
    const w1 = numberToWords(num1).toLowerCase();
    const w2 = numberToWords(num2).toLowerCase();
    
    const questionTextRaw = `Which is smaller: '${w1}' or '${w2}'? Write the smaller number in words.`;
    const questionTextShort = `Smaller between '${w1}' and '${w2}' in words:`;
    
    let defectMap = null;
    let options = null;
    
    if (isMCQ) {
      options = [w1, w2].sort(() => Math.random() - 0.5);
      defectMap = { [numberToWords(Math.max(num1, num2)).toLowerCase()]: "CONCEPTUAL_ERROR" };
    }

    const questionText = getQText(questionTextRaw, questionTextShort);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Number Notation\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "Write both words as numbers, compare them, and spell the smaller one.",
          finalAnswer: answer,
          solutionSteps: `1. '${w1}' is ${num1} and '${w2}' is ${num2}.\\n2. ${smaller} is smaller.\\n3. It is written as ${answer}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: true }
    };
  }

  // 9. advanced_spell_between_bounds
  if (activeVariant === 'advanced_spell_between_bounds') {
    const num = Math.floor(Math.random() * 80) + 20; // The target answer
    const answer = numberToWords(num).toLowerCase();
    const lower = num - 1;
    const upper = num + 1;
    
    const questionTextRaw = `I am greater than ${lower} but smaller than ${upper}. Write my name in words.`;
    const questionTextShort = `Between ${lower} and ${upper} in words:`;
    
    let defectMap = null;
    let options = null;
    
    if (isMCQ) {
      const distractorSet = new Set([
        numberToWords(lower).toLowerCase(),
        numberToWords(upper).toLowerCase(),
        numberToWords(num + 10).toLowerCase()
      ]);
      distractorSet.delete(answer);
      while (distractorSet.size < 3) distractorSet.add(numberToWords(Math.floor(Math.random() * 80) + 20).toLowerCase());
      
      options = [answer, ...Array.from(distractorSet).slice(0, 3)].sort(() => Math.random() - 0.5);
      defectMap = {
        [numberToWords(lower).toLowerCase()]: "CONCEPTUAL_ERROR",
        [numberToWords(upper).toLowerCase()]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const questionText = getQText(questionTextRaw, questionTextShort);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Number Notation\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "What number comes right after the smaller number and right before the bigger number?",
          finalAnswer: answer,
          solutionSteps: `1. The number between ${lower} and ${upper} is ${num}.\\n2. ${num} is written as ${answer}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: true }
    };
  }

  // 10. advanced_reverse_digits_to_word
  if (activeVariant === 'advanced_reverse_digits_to_word') {
    const tens = Math.floor(Math.random() * 9) + 1;
    let ones = Math.floor(Math.random() * 9) + 1;
    while (tens === ones) ones = Math.floor(Math.random() * 9) + 1;
    
    const startNum = tens * 10 + ones;
    const num = ones * 10 + tens;
    const answer = numberToWords(num).toLowerCase();
    
    const questionTextRaw = `Write the number formed by reversing the digits of ${startNum} in words.`;
    const questionTextShort = `Reverse digits of ${startNum} and write in words:`;
    
    let defectMap = null;
    let options = null;
    
    if (isMCQ) {
      const distractorSet = new Set([
        numberToWords(startNum).toLowerCase(),
        numberToWords(ones * 10 + ones).toLowerCase(),
        numberToWords(tens * 10 + tens).toLowerCase()
      ]);
      distractorSet.delete(answer);
      while (distractorSet.size < 3) distractorSet.add(numberToWords(Math.floor(Math.random() * 80) + 20).toLowerCase());
      
      options = [answer, ...Array.from(distractorSet).slice(0, 3)].sort(() => Math.random() - 0.5);
      defectMap = { [numberToWords(startNum).toLowerCase()]: "CONCEPTUAL_ERROR" };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const questionText = getQText(questionTextRaw, questionTextShort);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Number Notation\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "Swap the tens digit and the ones digit.",
          finalAnswer: answer,
          solutionSteps: `1. Reversing the digits of ${startNum} gives ${num}.\\n2. ${num} is written as ${answer}.`
        },
        visualEngine: { componentToRender: "NONE", componentData: {} },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: true }
    };
  }

  // Fallback
  return null;
};
