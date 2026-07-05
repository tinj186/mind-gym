import { numberToWords } from '@/lib/utils/math-helpers';

export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, isNotationVariant) {
  const commonMeta = { level, topic, type: zodType, difficulty: zodDiff };
  const inputType = isStructure ? 'MULTI_STEP_INPUT' : (isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT');

  if (activeVariant === 'standard_match_multiple_pairs_correct' || activeVariant === 'standard_match_multiple_pairs_incorrect') {
    const isCorrectMode = activeVariant === 'standard_match_multiple_pairs_correct';
    
    // Pick 4 distinct random numbers between 20 and 99
    const nums = [];
    while (nums.length < 4) {
      const n = Math.floor(Math.random() * 80) + 20;
      if (!nums.includes(n)) nums.push(n);
    }
    
    // Decide which index is the unique one (the answer)
    const targetIdx = Math.floor(Math.random() * 4);
    
    let optionsArray = [];
    let answer = "";
    let defectMap = {};
    
    const generateIncorrectPair = (num) => {
      const w = numberToWords(num).toLowerCase();
      // swap tens and ones
      const swapped = (num % 10) * 10 + Math.floor(num / 10);
      if (swapped >= 20 && swapped !== num) return numberToWords(swapped).toLowerCase();
      // or spelling error
      if (w.includes('forty')) return w.replace('forty', 'fourty');
      if (w.includes('ninety')) return w.replace('ninety', 'ninty');
      // or completely random wrong string
      return numberToWords(Math.floor(Math.random() * 80) + 20).toLowerCase();
    };

    nums.forEach((num, idx) => {
      const makeCorrect = isCorrectMode ? (idx === targetIdx) : (idx !== targetIdx);
      const word = makeCorrect ? numberToWords(num).toLowerCase() : generateIncorrectPair(num);
      const pairString = `${num} = ${word}`;
      optionsArray.push(pairString);
      if (idx === targetIdx) {
        answer = pairString;
      } else {
        defectMap[pairString] = isCorrectMode ? "CONCEPTUAL_ERROR" : "CARELESS_CALCULATION";
      }
    });
    
    optionsArray = optionsArray.sort(() => Math.random() - 0.5);

    let options = null;
    let questionText = "";
    
    if (isMCQ) {
      options = optionsArray;
      questionText = getQText(
        `Which of the following is ${isCorrectMode ? 'correct' : 'incorrect'}?`,
        `Which is ${isCorrectMode ? 'correct' : 'incorrect'}?`
      );
    } else {
      const choicesStr = optionsArray.join(',  ');
      questionText = getQText(
        `Which of the following is ${isCorrectMode ? 'correct' : 'incorrect'}? Choices: ${choicesStr}`,
        `Which is ${isCorrectMode ? 'correct' : 'incorrect'}? (${choicesStr})`
      );
    }
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Number Notation\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "Read every single pair carefully. Look at the spelling and the numbers.",
          finalAnswer: answer,
          solutionSteps: `1. Let's check each pair to find the ${isCorrectMode ? 'correct' : 'incorrect'} one.\\n2. ${answer} is the ${isCorrectMode ? 'only correct' : 'only incorrect'} pair.`
        },
        visualEngine: {
          componentToRender: "NONE",
          componentData: {}
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: true }
    };
  }

  if (activeVariant === 'standard_place_value_to_word') {
    const tens = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const ones = Math.floor(Math.random() * 9) + 1; // 1 to 9
    const num = tens * 10 + ones;
    const answer = numberToWords(num).toLowerCase();
    
    let defectMap = null;
    let options = null;
    if (isMCQ) {
      const swappedNum = ones * 10 + tens;
      const swappedAnswer = numberToWords(swappedNum).toLowerCase();
      const distractorSet = new Set([swappedAnswer, numberToWords(tens).toLowerCase(), numberToWords(ones).toLowerCase()]);
      while (distractorSet.size < 3) distractorSet.add(numberToWords(Math.floor(Math.random() * 80) + 20).toLowerCase());
      
      options = [answer, ...Array.from(distractorSet).slice(0, 3)].sort(() => Math.random() - 0.5);
      defectMap = { [swappedAnswer]: "CONCEPTUAL_ERROR" };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const questionText = getQText(`Write ${tens} tens ${ones} ones in words.`, `Write ${tens} tens ${ones} ones in words.`);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Number Notation\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "First find out what number it is in numerals, then spell it.",
          finalAnswer: answer,
          solutionSteps: `1. ${tens} tens ${ones} ones = ${num}.\\n2. The number ${num} is written as ${answer}.`
        },
        visualEngine: {
          componentToRender: "NONE",
          componentData: {}
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: true }
    };
  }

  if (activeVariant === 'standard_word_to_place_value') {
    const num = Math.floor(Math.random() * 80) + 20;
    const word = numberToWords(num).toLowerCase();
    const isTens = Math.random() > 0.5;
    
    const tensDigit = Math.floor(num / 10);
    const onesDigit = num % 10;
    const answer = String(isTens ? tensDigit : onesDigit);
    
    let defectMap = null;
    let options = null;
    if (isMCQ) {
      const swappedAnswer = String(isTens ? onesDigit : tensDigit);
      const distractorSet = new Set([swappedAnswer, String(Math.floor(Math.random() * 9) + 1), String(Math.floor(Math.random() * 9) + 1)]);
      distractorSet.delete(answer);
      options = [answer, ...Array.from(distractorSet).slice(0, 3)];
      while(options.length < 4) { options.push(String(Math.floor(Math.random() * 9) + 1)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = { [swappedAnswer]: "CONCEPTUAL_ERROR" };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const placeString = isTens ? 'tens' : 'ones';
    const questionText = getQText(`In the number '${word}', what digit is in the ${placeString} place?`, `In '${word}', what digit is in the ${placeString} place?`);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Number Notation\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "First, write the word as a number. Then check the place values.",
          finalAnswer: answer,
          solutionSteps: `1. The word '${word}' is written as ${num}.\\n2. In ${num}, the ${placeString} digit is ${answer}.`
        },
        visualEngine: {
          componentToRender: "NONE",
          componentData: {}
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: true }
    };
  }

  if (activeVariant === 'standard_word_value_identification') {
    const propertyType = Math.floor(Math.random() * 5); // 0 to 4
    let targetNum;
    let propertyDesc = "";
    
    // Helper to get random tens and ones
    const rTens = () => Math.floor(Math.random() * 8) + 2;
    const rOnes = () => Math.floor(Math.random() * 10);
    
    // Determine the target and description based on the property type
    if (propertyType === 0) {
      // 0 in ones place
      targetNum = rTens() * 10;
      propertyDesc = "0 in the ones place";
    } else if (propertyType === 1) {
      // specific tens digit
      const chosenTen = rTens();
      targetNum = chosenTen * 10 + rOnes();
      propertyDesc = `the digit ${chosenTen} in the tens place`;
    } else if (propertyType === 2) {
      // same digit in both places
      const digit = Math.floor(Math.random() * 8) + 2;
      targetNum = digit * 10 + digit;
      propertyDesc = "the same digit in both the tens and ones place";
    } else if (propertyType === 3) {
      // ones digit greater than 6
      targetNum = rTens() * 10 + (Math.floor(Math.random() * 3) + 7); // 7, 8, or 9
      propertyDesc = "a digit greater than 6 in the ones place";
    } else {
      // ones digit is 5
      targetNum = rTens() * 10 + 5;
      propertyDesc = "the digit 5 in the ones place";
    }
    
    const answer = numberToWords(targetNum).toLowerCase();
    
    let defectMap = null;
    let optionsArray = [];
    
    const isValidDistractor = (num) => {
      const t = Math.floor(num / 10);
      const o = num % 10;
      if (propertyType === 0) return o !== 0;
      if (propertyType === 1) return t !== Math.floor(targetNum / 10);
      if (propertyType === 2) return t !== o;
      if (propertyType === 3) return o <= 6;
      if (propertyType === 4) return o !== 5;
      return true;
    };
    
    const distractorSet = new Set();
    while (distractorSet.size < 3) {
      const wrongNum = Math.floor(Math.random() * 80) + 20; // 20 to 99
      if (wrongNum !== targetNum && isValidDistractor(wrongNum)) {
        distractorSet.add(numberToWords(wrongNum).toLowerCase());
      }
    }
    
    optionsArray = [answer, ...Array.from(distractorSet)].sort(() => Math.random() - 0.5);
    
    let options = null;
    let questionText = "";

    if (isMCQ) {
      options = optionsArray;
      defectMap = {};
      options.forEach(opt => { if (opt !== answer) defectMap[opt] = "CONCEPTUAL_ERROR"; });
      questionText = getQText(`Which of these words represents a number with ${propertyDesc}?`, `Which word has a number with ${propertyDesc}?`);
    } else {
      const choicesStr = optionsArray.join(', ');
      questionText = getQText(`Which of these words represents a number with ${propertyDesc}? Choices: ${choicesStr}`, `Which word has a number with ${propertyDesc}? (${choicesStr})`);
    }
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Number Notation\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "Write each word as a number first, then check if it matches the description.",
          finalAnswer: answer,
          solutionSteps: `1. We are looking for a number with ${propertyDesc}.\\n2. The word ${answer} is ${targetNum}, which fits the description.`
        },
        visualEngine: {
          componentToRender: "NONE",
          componentData: {}
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: true }
    };
  }

  if (activeVariant === 'standard_number_clue_to_word') {
    const isMore = Math.random() > 0.5;
    const num = Math.floor(Math.random() * 78) + 20; // 20 to 97
    const targetNum = isMore ? num + 1 : num - 1;
    const answer = numberToWords(targetNum).toLowerCase();
    
    let defectMap = null;
    let options = null;
    if (isMCQ) {
      const swappedAnswer = numberToWords((targetNum % 10) * 10 + Math.floor(targetNum / 10)).toLowerCase();
      const wrongOpAnswer = numberToWords(isMore ? num - 1 : num + 1).toLowerCase();
      const distractorSet = new Set([swappedAnswer, wrongOpAnswer, numberToWords(num).toLowerCase()]);
      distractorSet.delete(answer);
      options = [answer, ...Array.from(distractorSet).slice(0, 3)].sort(() => Math.random() - 0.5);
      
      defectMap = {
        [wrongOpAnswer]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const questionText = getQText(`I am one ${isMore ? 'more' : 'less'} than ${num}. Write my name in words.`, `1 ${isMore ? 'more' : 'less'} than ${num} in words is:`);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Number Notation\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: `First, what is 1 ${isMore ? 'more' : 'less'} than ${num}? Then spell it.`,
          finalAnswer: answer,
          solutionSteps: `1. One ${isMore ? 'more' : 'less'} than ${num} is ${targetNum}.\\n2. The number ${targetNum} is written as ${answer}.`
        },
        visualEngine: {
          componentToRender: "NONE",
          componentData: {}
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: true }
    };
  }

  if (activeVariant === 'standard_number_clue_to_numeral') {
    const isMore = Math.random() > 0.5;
    const num = Math.floor(Math.random() * 78) + 20; // 20 to 97
    const word = numberToWords(num).toLowerCase();
    const targetNum = isMore ? num + 1 : num - 1;
    const answer = String(targetNum);
    
    let defectMap = null;
    let options = null;
    if (isMCQ) {
      const swappedAnswer = String((targetNum % 10) * 10 + Math.floor(targetNum / 10));
      const wrongOpAnswer = String(isMore ? num - 1 : num + 1);
      const distractorSet = new Set([swappedAnswer, wrongOpAnswer, String(num)]);
      distractorSet.delete(answer);
      options = [answer, ...Array.from(distractorSet).slice(0, 3)].sort(() => Math.random() - 0.5);
      
      defectMap = {
        [wrongOpAnswer]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const questionText = getQText(`I am one ${isMore ? 'more' : 'less'} than '${word}'. Write my number in numerals.`, `1 ${isMore ? 'more' : 'less'} than '${word}' is:`);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Number Notation\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: `First, write the word '${word}' as a number. Then find out what is 1 ${isMore ? 'more' : 'less'}.`,
          finalAnswer: answer,
          solutionSteps: `1. The word '${word}' is written as ${num}.\\n2. One ${isMore ? 'more' : 'less'} than ${num} is ${answer}.`
        },
        visualEngine: {
          componentToRender: "NONE",
          componentData: {}
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: true }
    };
  }

  if (activeVariant === 'standard_spell_greatest_two_digit') {
    const isBasic = Math.random() < 0.25; // 25% chance for the basic 99 question
    
    let answerNum;
    let questionTextRaw = "";
    let questionTextShort = "";
    let hint = "";
    let step1 = "";
    
    if (isBasic) {
      answerNum = 99;
      questionTextRaw = "Write the greatest 2-digit number in words.";
      questionTextShort = "Greatest 2-digit number in words:";
      hint = "Think of the largest number that only has 2 digits.";
      step1 = "The greatest 2-digit number is 99.";
    } else {
      // Pick two distinct digits
      let d1 = Math.floor(Math.random() * 9) + 1; // 1 to 9
      let d2 = Math.floor(Math.random() * 10); // 0 to 9
      while (d1 === d2) d2 = Math.floor(Math.random() * 10);
      
      const big = Math.max(d1, d2);
      const small = Math.min(d1, d2);
      answerNum = big * 10 + small;
      
      questionTextRaw = `What is the greatest 2-digit number you can make using the digits ${d1} and ${d2}? Write it in words.`;
      questionTextShort = `Greatest 2-digit number using digits ${d1} and ${d2} in words:`;
      hint = "To make the greatest number, put the largest digit in the tens place.";
      step1 = `The greatest number using ${d1} and ${d2} is ${answerNum}.`;
    }
    
    const answer = numberToWords(answerNum).toLowerCase();
    
    let defectMap = null;
    let options = null;
    if (isMCQ) {
      const swapped = (answerNum % 10) * 10 + Math.floor(answerNum / 10);
      const swappedWord = numberToWords(swapped).toLowerCase();
      
      const distractorSet = new Set();
      if (swapped >= 10 && swapped !== answerNum) distractorSet.add(swappedWord);
      distractorSet.add("ninety-nine");
      while (distractorSet.size < 3) distractorSet.add(numberToWords(Math.floor(Math.random() * 80) + 20).toLowerCase());
      distractorSet.delete(answer);
      
      options = [answer, ...Array.from(distractorSet).slice(0, 3)].sort(() => Math.random() - 0.5);
      defectMap = { [swappedWord]: "CONCEPTUAL_ERROR" };
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
          hint: hint,
          finalAnswer: answer,
          solutionSteps: `1. ${step1}\\n2. ${answerNum} is written as ${answer}.`
        },
        visualEngine: {
          componentToRender: "NONE",
          componentData: {}
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: true }
    };
  }

  if (activeVariant === 'standard_spell_smallest_two_digit') {
    const isBasic = Math.random() < 0.25; // 25% chance for the basic 10 question
    
    let answerNum;
    let questionTextRaw = "";
    let questionTextShort = "";
    let hint = "";
    let step1 = "";
    
    if (isBasic) {
      answerNum = 10;
      questionTextRaw = "Write the smallest 2-digit number in words.";
      questionTextShort = "Smallest 2-digit number in words:";
      hint = "Think of the first number you count that has exactly 2 digits.";
      step1 = "The smallest 2-digit number is 10.";
    } else {
      // Pick two distinct digits, neither can be 0 so we always get a proper 2-digit
      let d1 = Math.floor(Math.random() * 9) + 1; // 1 to 9
      let d2 = Math.floor(Math.random() * 9) + 1; // 1 to 9
      while (d1 === d2) d2 = Math.floor(Math.random() * 9) + 1;
      
      const small = Math.min(d1, d2);
      const big = Math.max(d1, d2);
      answerNum = small * 10 + big;
      
      questionTextRaw = `What is the smallest 2-digit number you can make using the digits ${d1} and ${d2}? Write it in words.`;
      questionTextShort = `Smallest 2-digit number using digits ${d1} and ${d2} in words:`;
      hint = "To make the smallest number, put the smallest digit in the tens place.";
      step1 = `The smallest number using ${d1} and ${d2} is ${answerNum}.`;
    }
    
    const answer = numberToWords(answerNum).toLowerCase();
    
    let defectMap = null;
    let options = null;
    if (isMCQ) {
      const swapped = (answerNum % 10) * 10 + Math.floor(answerNum / 10);
      const swappedWord = numberToWords(swapped).toLowerCase();
      
      const distractorSet = new Set();
      distractorSet.add(swappedWord);
      distractorSet.add("ten");
      while (distractorSet.size < 3) distractorSet.add(numberToWords(Math.floor(Math.random() * 80) + 11).toLowerCase());
      distractorSet.delete(answer);
      
      options = [answer, ...Array.from(distractorSet).slice(0, 3)].sort(() => Math.random() - 0.5);
      defectMap = { [swappedWord]: "CONCEPTUAL_ERROR" };
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
          hint: hint,
          finalAnswer: answer,
          solutionSteps: `1. ${step1}\\n2. ${answerNum} is written as ${answer}.`
        },
        visualEngine: {
          componentToRender: "NONE",
          componentData: {}
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: true }
    };
  }

  if (activeVariant === 'standard_count_between_words') {
    const num = Math.floor(Math.random() * 70) + 20; // 20 to 89
    const num1 = numberToWords(num).toLowerCase();
    const num2 = numberToWords(num + 2).toLowerCase();
    const answer = String(num + 1);
    
    let defectMap = null;
    let options = null;
    if (isMCQ) {
      options = [answer, String(num), String(num + 2), String(num + 3)].sort(() => Math.random() - 0.5);
      defectMap = {
        [String(num)]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const questionText = getQText(`Write the number that comes exactly between '${num1}' and '${num2}' in numerals.`, `Number exactly between '${num1}' and '${num2}' in numerals:`);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Number Notation\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "Change the words to numerals first, then figure out what number is in the middle.",
          finalAnswer: answer,
          solutionSteps: `1. The words are ${num} and ${num + 2}.\\n2. The number exactly between them is ${answer}.`
        },
        visualEngine: {
          componentToRender: "NONE",
          componentData: {}
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 2, logic: activeVariant, hideVisual: true }
    };
  }

  throw new Error(`Variant '${activeVariant}' not found in Number Notation standardLogic`);
}
