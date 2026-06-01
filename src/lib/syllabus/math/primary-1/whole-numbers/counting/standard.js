import { numberToWords } from '@/lib/utils/math-helpers';

export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText) {
  // ==========================================
  // STANDARD LEVEL
  // ==========================================

  // 3. Counting On
  if (activeVariant === 'standard_count_on') {
    const startNum = Math.floor(Math.random() * 50) + 20;
    const countOnAmount = Math.floor(Math.random() * 5) + 2; 
    const answer = startNum + countOnAmount;
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are writing a ${activeVariant} story. You MUST use the name ${context.name} and the item ${selectedContextItem}. The setting should be ${context.setting}.\nYou are an expert Primary 1 math question generator.\n MATH CONSTRAINTS:\n - Topic: Counting to 100 (Standard Level - Counting On)\n - Start Number: ${startNum}\n - Amount to count on: ${countOnAmount}\n - Question: Ask the student what number they get if they count on ${countOnAmount} steps from ${startNum}.\n - Final Answer MUST strictly be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": ${JSON.stringify(getQText('[Insert full localized Singaporean word problem here]', 'Count on ' + countOnAmount + ' from ' + startNum + '.'))},
            "options": ${isMCQ ? JSON.stringify([answer - 2, answer - 1, answer, answer + 1].map(String)) : 'null'},
            "hint": "[Insert conceptual hint here]",
            "finalAnswer": "${answer}",
            "solutionSteps": ${JSON.stringify(`Count on ${countOnAmount} from ${startNum}: ${startNum + 1}, ${startNum + 2}... The answer is ${answer}.`)}
          },
          "visualEngine": {
            "componentToRender": "NONE",
            "componentData": {}
          },
          "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty, steps: 2, logic: "counting_on", hideVisual: true }
    };
  }

  // 4. Identifying Tens and Ones
  if (activeVariant === 'standard_tens_ones') {
    const tens = Math.floor(Math.random() * 8) + 2;
    const ones = Math.floor(Math.random() * 9) + 1;
    const total = (tens * 10) + ones;
    
    // Randomly ask for tens or ones digit
    const askForTens = Math.random() > 0.5;
    const answer = askForTens ? String(tens) : String(ones);
    const targetWord = askForTens ? "tens" : "ones";
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a ${activeVariant} question. DO NOT modify the mathematical structure or the final answer.\nYou are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Counting to 100 (Standard Level - Place Value).\n - Target Number: ${total}.\n - Question: Ask how many ${targetWord} are in the number ${total}.\n - Final Answer MUST strictly be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": ${JSON.stringify(getQText('How many ' + targetWord + ' are in the number ' + total + '?', total + ': ' + targetWord + ' = ?'))},
            "options": ${isMCQ ? JSON.stringify([tens, ones, total - 10, total].map(String)) : 'null'},
            "hint": "[Insert conceptual hint here]",
            "finalAnswer": "${answer}",
            "solutionSteps": ${JSON.stringify(`In the number ${total}, the first digit represents the tens and the second represents the ones. There are ${answer} ${targetWord}.`)}
          },
          "visualEngine": {
            "componentToRender": "NONE",
            "componentData": {}
          },
          "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty, steps: 1, logic: "place_value_digits", hideVisual: true }
    };
  }

  // 5. Counting Back
  if (activeVariant === 'standard_count_back') {
    const startNum = Math.floor(Math.random() * 60) + 30; // 30 to 89
    const countBackAmount = Math.floor(Math.random() * 4) + 2; // 2 to 5
    const answer = startNum - countBackAmount;
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a ${activeVariant} question. DO NOT modify the mathematical structure or the final answer.\nYou are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Counting Back\n - Start: ${startNum}.\n - Count back by: ${countBackAmount}.\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": ${JSON.stringify(getQText('Count back ' + countBackAmount + ' steps from ' + startNum + '. What number do you get?', 'Count back ' + countBackAmount + ' from ' + startNum + '.'))},
            "options": ${isMCQ ? JSON.stringify([answer - 2, answer - 1, answer, answer + 1].map(String)) : 'null'},
            "hint": "[Insert conceptual hint here]",
            "finalAnswer": "${answer}",
            "solutionSteps": ${JSON.stringify(`Counting back from ${startNum}: ${startNum - 1}, ${startNum - 2}... you get ${answer}.`)}
          },
          "visualEngine": { "componentToRender": "NONE", "componentData": {} },
          "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty, steps: 2, logic: "counting_back", hideVisual: true }
    };
  }

  // 6. 10 More
  if (activeVariant === 'standard_10_more') {
    const startNum = Math.floor(Math.random() * 70) + 10;
    const amount = Math.floor(Math.random() * 10) + 1;
    const answer = String(startNum + amount);
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a ${activeVariant} question. DO NOT modify the mathematical structure or the final answer.\nYou are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Addition\n - Operation: Find ${amount} more than ${startNum}\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": ${JSON.stringify(getQText('What is ' + amount + ' more than ' + startNum + '?', startNum + ' + ' + amount + ' = ?'))},
            "options": ${isMCQ ? JSON.stringify([parseInt(answer) - 2, parseInt(answer) - 1, parseInt(answer), parseInt(answer) + 1].map(String)) : 'null'},
            "hint": "[Insert conceptual hint here]",
            "finalAnswer": "${answer}",
            "solutionSteps": ${JSON.stringify(`${startNum} + ${amount} = ${answer}.`)}
          },
          "visualEngine": { "componentToRender": "NONE", "componentData": {} },
          "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty, steps: 1, logic: "more_than", hideVisual: true }
    };
  }

  // 7. 10 Less
  if (activeVariant === 'standard_10_less') {
    const startNum = Math.floor(Math.random() * 70) + 20;
    const amount = Math.floor(Math.random() * 10) + 1;
    const answer = String(startNum - amount);
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a ${activeVariant} question. DO NOT modify the mathematical structure or the final answer.\nYou are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Subtraction\n - Operation: Find ${amount} less than ${startNum}\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": ${JSON.stringify(getQText('What is ' + amount + ' less than ' + startNum + '?', startNum + ' - ' + amount + ' = ?'))},
            "options": ${isMCQ ? JSON.stringify([parseInt(answer) - 1, parseInt(answer) + 1, parseInt(answer) + 2, parseInt(answer)].map(String)) : 'null'},
            "hint": "[Insert conceptual hint here]",
            "finalAnswer": "${answer}",
            "solutionSteps": ${JSON.stringify(`${startNum} - ${amount} = ${answer}.`)}
          },
          "visualEngine": { "componentToRender": "NONE", "componentData": {} },
          "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty, steps: 1, logic: "less_than", hideVisual: true }
    };
  }

  // 8. Compose Base 10
  if (activeVariant === 'standard_compose_base_10') {
    const tens = Math.floor(Math.random() * 8) + 2;
    const ones = Math.floor(Math.random() * 9) + 1;
    const answer = (tens * 10) + ones;
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a ${activeVariant} question. DO NOT modify the mathematical structure or the final answer.\nYou are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Compose Base 10.\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": ${JSON.stringify(getQText(tens + ' tens and ' + ones + ' ones make what number?', tens + ' tens ' + ones + ' ones = ?'))},
            "options": ${isMCQ ? JSON.stringify([(ones * 10) + tens, tens + ones, answer, answer + 10].map(String)) : 'null'},
            "hint": "[Insert conceptual hint here]",
            "finalAnswer": "${answer}",
            "solutionSteps": ${JSON.stringify(`${tens} tens is ${tens * 10}. ${tens * 10} + ${ones} = ${answer}.`)}
          },
          "visualEngine": { "componentToRender": "NONE", "componentData": {} },
          "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty, steps: 1, logic: "compose_base_10", hideVisual: true }
    };
  }

  // 9. Decompose Tens
  if (activeVariant === 'standard_decompose_tens') {
    const tens = Math.floor(Math.random() * 8) + 2;
    const ones = Math.floor(Math.random() * 9) + 1;
    const total = (tens * 10) + ones;
    const answer = String(tens);
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a ${activeVariant} question. DO NOT modify the mathematical structure or the final answer.\nYou are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Decompose Tens.\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": ${JSON.stringify(getQText(total + ' = ___ tens and ' + ones + ' ones. What is the missing number?', total + ' = ? tens + ' + ones + ' ones'))},
            "options": ${isMCQ ? JSON.stringify([ones, tens, tens * 10, total].map(String)) : 'null'},
            "hint": "[Insert conceptual hint here]",
            "finalAnswer": "${answer}",
            "solutionSteps": ${JSON.stringify(`The number ${total} has ${tens} tens.`)}
          },
          "visualEngine": { "componentToRender": "NONE", "componentData": {} },
          "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty, steps: 1, logic: "decompose_tens", hideVisual: true }
    };
  }

  // 10. Decompose Ones
  if (activeVariant === 'standard_decompose_ones') {
    const tens = Math.floor(Math.random() * 8) + 2;
    const ones = Math.floor(Math.random() * 9) + 1;
    const total = (tens * 10) + ones;
    const answer = String(ones);
    return { 
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a ${activeVariant} question. DO NOT modify the mathematical structure or the final answer.\nYou are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Decompose Ones.\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": ${JSON.stringify(getQText(total + ' = ' + tens + ' tens and ___ ones. What is the missing number?', total + ' = ' + tens + ' tens + ? ones'))},
            "options": ${isMCQ ? JSON.stringify([ones, tens, tens * 10, total].map(String)) : 'null'},
            "hint": "[Insert conceptual hint here]",
            "finalAnswer": "${answer}",
            "solutionSteps": ${JSON.stringify(`The number ${total} has ${ones} ones.`)}
          },
          "visualEngine": { "componentToRender": "NONE", "componentData": {} },
          "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty, steps: 1, logic: "decompose_ones", hideVisual: true }
    };
  }

  // 11. Word to Numeral
  if (activeVariant === 'standard_word_to_numeral') {
    const total = Math.floor(Math.random() * 80) + 20;
    const word = numberToWords(total);
    const answer = String(total);
    const reversedTotal = (total % 10) * 10 + Math.floor(total / 10);
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a ${activeVariant} question. DO NOT modify the mathematical structure or the final answer.\nYou are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Number Words.\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": ${JSON.stringify(getQText("Write the number '" + word + "' in numerals.", word + ' = ?'))},
            "options": ${isMCQ ? JSON.stringify([total - 10, reversedTotal, total, total + 1].map(String)) : 'null'},
            "hint": "[Insert conceptual hint here]",
            "finalAnswer": "${answer}",
            "solutionSteps": ${JSON.stringify(`The word '${word}' is written as ${answer}.`)}
          },
          "visualEngine": { "componentToRender": "NONE", "componentData": {} },
          "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty, steps: 1, logic: "word_to_numeral", hideVisual: true }
    };
  }

  // 12. Numeral to Word
  if (activeVariant === 'standard_numeral_to_word') {
    const total = Math.floor(Math.random() * 80) + 20;
    const answer = numberToWords(total);
    const reversedTotal = (total % 10) * 10 + Math.floor(total / 10);
    return { 
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a ${activeVariant} question. DO NOT modify the mathematical structure or the final answer.\nYou are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Numeral to Word.\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": ${JSON.stringify(getQText('How do you write ' + total + ' in words?', total + ' = ? (words)'))},
            "options": ${isMCQ ? JSON.stringify([numberToWords(total - 10), numberToWords(reversedTotal), answer, numberToWords(total + 1)]) : 'null'},
            "hint": "[Insert conceptual hint here]",
            "finalAnswer": "${answer}",
            "solutionSteps": ${JSON.stringify(`${total} is written as ${answer}.`)}
          },
          "visualEngine": { "componentToRender": "NONE", "componentData": {} },
          "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty, steps: 1, logic: "numeral_to_word", hideVisual: true }
    };
  }

  throw new Error(`Variant '${activeVariant}' logic block not implemented in standard.js.`);
}