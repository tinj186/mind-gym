import { numberToWords } from '@/lib/utils/math-helpers';

export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, isNotationVariant) {
  const commonMeta = { level, topic, type: zodType, difficulty: zodDiff };
  const inputType = isStructure ? 'MULTI_STEP_INPUT' : (isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT');

  if (activeVariant === 'foundation_numeral_to_word') {
    const num = Math.floor(Math.random() * 80) + 20; // 20 to 99
    const answer = numberToWords(num).toLowerCase();
    
    let defectMap = null;
    let options = null;
    
    if (isMCQ) {
      const swapped = (num % 10) * 10 + Math.floor(num / 10);
      const wrongSpelling = answer.replace('forty', 'fourty').replace('ninety', 'ninty');
      
      const distractorSet = new Set();
      distractorSet.add(wrongSpelling === answer ? numberToWords(num + 1).toLowerCase() : wrongSpelling);
      if (swapped >= 20 && swapped !== num) distractorSet.add(numberToWords(swapped).toLowerCase());
      while(distractorSet.size < 3) {
        distractorSet.add(numberToWords(Math.floor(Math.random() * 80) + 20).toLowerCase());
      }
      options = [answer, ...Array.from(distractorSet).slice(0, 3)].sort(() => Math.random() - 0.5);
      
      defectMap = {
        [wrongSpelling !== answer ? wrongSpelling : options.find(o => o !== answer)]: "CARELESS_CALCULATION",
        [numberToWords(swapped).toLowerCase()]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const questionText = getQText(`Write the number ${num} in words.`, `Write ${num} in words.`);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Number Notation\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "Think about how to spell the tens place and the ones place.",
          finalAnswer: answer,
          solutionSteps: `1. The number ${num} is written as ${answer}.`
        },
        visualEngine: {
          componentToRender: "NONE",
          componentData: {}
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  if (activeVariant === 'foundation_word_to_numeral') {
    const num = Math.floor(Math.random() * 80) + 20;
    const word = numberToWords(num).toLowerCase();
    const answer = String(num);
    
    let defectMap = null;
    let options = null;
    
    if (isMCQ) {
      const swapped = String((num % 10) * 10 + Math.floor(num / 10));
      const distractors = new Set([swapped, String(num + 10), String(num - 10)]);
      distractors.delete(answer);
      options = [answer, ...Array.from(distractors).slice(0, 3)].sort(() => Math.random() - 0.5);
      
      defectMap = {
        [swapped]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const questionText = getQText(`Write the word '${word}' as a number.`, `Write '${word}' in numerals.`);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Number Notation\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "What digit is in the tens place? What digit is in the ones place?",
          finalAnswer: answer,
          solutionSteps: `1. The word '${word}' is written in numerals as ${answer}.`
        },
        visualEngine: {
          componentToRender: "NONE",
          componentData: {}
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  if (activeVariant === 'foundation_fill_blank_word') {
    const num = Math.floor(Math.random() * 80) + 20;
    const parts = numberToWords(num).toLowerCase().split('-');
    
    // Fallback if the number doesn't have a hyphen (e.g. 20, 30)
    if (parts.length === 1) {
      return foundationLogic('foundation_numeral_to_word', difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, isNotationVariant);
    }
    
    const missingIndex = Math.random() > 0.5 ? 0 : 1;
    const missingWord = parts[missingIndex];
    const displayParts = [...parts];
    displayParts[missingIndex] = "______";
    
    const answer = missingWord;
    
    let defectMap = null;
    let options = null;
    
    if (isMCQ) {
      const distractors = new Set();
      while(distractors.size < 3) {
        const wrongNum = Math.floor(Math.random() * 80) + 20;
        const wrongParts = numberToWords(wrongNum).toLowerCase().split('-');
        if (wrongParts.length > 1 && wrongParts[missingIndex] !== answer) {
          distractors.add(wrongParts[missingIndex]);
        }
      }
      options = [answer, ...Array.from(distractors)].sort(() => Math.random() - 0.5);
      
      defectMap = {};
      options.forEach(opt => { if (opt !== answer) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const questionText = getQText(`Fill in the blank: The number ${num} is written as ${displayParts.join('-')}.`, `Fill in the blank: ${num} = ${displayParts.join('-')}`);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Number Notation\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: missingIndex === 0 ? "What is the tens part of the number?" : "What is the ones part of the number?",
          finalAnswer: answer,
          solutionSteps: `1. The number ${num} is written in words as ${parts.join('-')}.\\n2. The missing part is ${answer}.`
        },
        visualEngine: {
          componentToRender: "NONE",
          componentData: {}
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  if (activeVariant === 'foundation_identify_correct_word') {
    // Generate any random number between 11 and 99
    const num = Math.floor(Math.random() * 89) + 11;
    const answer = numberToWords(num).toLowerCase();
    
    let defectMap = null;
    let optionsArray = [];
    
    // Dynamically generate plausible spelling errors
    const generateMisspellings = (word) => {
      const errs = new Set();
      // Common tricky parts
      if (word.includes('forty')) errs.add(word.replace('forty', 'fourty'));
      if (word.includes('fourteen')) errs.add(word.replace('fourteen', 'forteen'));
      if (word.includes('ninety')) errs.add(word.replace('ninety', 'ninty'));
      if (word.includes('fifty')) errs.add(word.replace('fifty', 'fivety'));
      if (word.includes('fifteen')) errs.add(word.replace('fifteen', 'fiveteen'));
      if (word.includes('twelve')) errs.add(word.replace('twelve', 'twelf'));
      if (word.includes('twenty')) errs.add(word.replace('twenty', 'twenti'));
      if (word.includes('eighty')) errs.add(word.replace('eighty', 'atey'));
      if (word.includes('eleven')) errs.add(word.replace('eleven', 'elevan'));
      if (word.includes('thirty')) errs.add(word.replace('thirty', 'therty'));
      
      // Digits
      if (word.match(/\bfour\b/)) errs.add(word.replace(/\bfour\b/, 'for'));
      if (word.match(/\beight\b/)) errs.add(word.replace(/\beight\b/, 'ate'));
      if (word.match(/\btwo\b/)) errs.add(word.replace(/\btwo\b/, 'tow'));
      if (word.match(/\bthree\b/)) errs.add(word.replace(/\bthree\b/, 'tree'));
      if (word.match(/\bnine\b/)) errs.add(word.replace(/\bnine\b/, 'nin'));
      
      // Hyphen errors
      if (word.includes('-')) errs.add(word.replace('-', ' '));
      
      // Generic vocal swaps if nothing else matched
      if (errs.size === 0) {
        errs.add(word.replace('a', 'e').replace('e', 'a').replace('i', 'e').replace('o', 'u'));
      }
      
      return Array.from(errs).filter(e => e !== word);
    };

    const distractors = new Set(generateMisspellings(answer));
    
    // Fill remaining slots with completely random wrong numbers to ensure 4 options
    while (distractors.size < 3) {
      const randomWrongWord = numberToWords(Math.floor(Math.random() * 89) + 11).toLowerCase();
      if (randomWrongWord !== answer) {
        distractors.add(randomWrongWord);
      }
    }
    
    optionsArray = [answer, ...Array.from(distractors).slice(0, 3)].sort(() => Math.random() - 0.5);
    
    let options = null;
    let questionText = "";

    if (isMCQ) {
      options = optionsArray;
      defectMap = {};
      options.forEach(opt => { if (opt !== answer) defectMap[opt] = "CONCEPTUAL_ERROR"; });
      questionText = getQText(`Which is the correct spelling for ${num}?`, `Which is the correct spelling for ${num}?`);
    } else {
      const choicesStr = optionsArray.join(', ');
      questionText = getQText(`Which is the correct spelling for ${num}? Choices: ${choicesStr}`, `Which is the correct spelling for ${num}? (${choicesStr})`);
    }
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Number Notation\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "Sound out the word carefully. Watch out for tricky spellings like forty and ninety.",
          finalAnswer: answer,
          solutionSteps: `1. The number ${num} is spelled as ${answer}.`
        },
        visualEngine: {
          componentToRender: "NONE",
          componentData: {}
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  if (activeVariant === 'foundation_identify_correct_numeral') {
    const num = Math.floor(Math.random() * 80) + 20;
    const word = numberToWords(num).toLowerCase();
    const answer = String(num);
    
    let defectMap = null;
    let options = null;
    
    const isForcedMCQ = true;
    const forcedInputType = 'MCQ_BUTTONS';
    
    const swapped = String((num % 10) * 10 + Math.floor(num / 10));
    const distractors = new Set([swapped, String(num + 1), String(num - 1)]);
    distractors.delete(answer);
    
    options = [answer, ...Array.from(distractors).slice(0, 3)].sort(() => Math.random() - 0.5);
    
    defectMap = {
      [swapped]: "CONCEPTUAL_ERROR"
    };
    options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });

    const questionText = getQText(`Which numeral matches the word '${word}'?`, `Which numeral is '${word}'?`);
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story. Keep the exact questionText provided. Return exactly the provided JSON structure, modifying ONLY the hint to match the Hint Protocol.\n\n MATH CONSTRAINTS:\n - Topic: Number Notation\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):\n ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          defectMap: defectMap,
          hint: "Read the word carefully. What digit comes first?",
          finalAnswer: answer,
          solutionSteps: `1. The word '${word}' represents the numeral ${answer}.`
        },
        visualEngine: {
          componentToRender: "NONE",
          componentData: {}
        },
        inputRequirement: { inputType: forcedInputType }
      })}`,
      metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
    };
  }

  // Fallback
  return foundationLogic('foundation_numeral_to_word', difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, isNotationVariant);
}
