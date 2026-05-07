import { numberToWords } from '@/lib/utils/math-helpers';

export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, hideVisual) {
  const commonMeta = { level, topic, type: zodType, difficulty: zodDiff };
  const inputType = isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT';

  if (activeVariant === 'advanced_greatest_from_digits') { // Renamed
    const digits = [];
    while(digits.length < 3) {
      const d = Math.floor(Math.random() * 8) + 2;
      if (!digits.includes(d)) digits.push(d);
    }
    const sortedDigits = [...digits].sort((a, b) => b - a);
    const greatestNum = (sortedDigits[0] * 10) + sortedDigits[1]; // Renamed from greatestNum to greatestNum
    const answer = String(greatestNum);
    
    const d1 = (sortedDigits[1] * 10) + sortedDigits[0];
    const d2 = (sortedDigits[0] * 10) + sortedDigits[2];
    const d3 = (sortedDigits[2] * 10) + sortedDigits[1];
    const options = isMCQ ? [String(d1), answer, String(d2), String(d3)] : null;

    const questionText = getQText(`Use the digits on the number cards to form the greatest 2-digit number. You can only use each digit once. What is the number?`, `Use digits ${digits[0]}, ${digits[1]}, and ${digits[2]} to form the greatest 2-digit number.`);
    const solutionSteps = getQText(`To make the greatest number, put the largest digit (${sortedDigits[0]}) in the tens place and the next largest (${sortedDigits[1]}) in the ones place. The number is ${answer}.`, `Tens: ${sortedDigits[0]}, Ones: ${sortedDigits[1]} -> ${answer}`);

    return {
      aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Form Greatest Number\n - Final Answer MUST be: "${answer}"\n OUTPUT FORMAT (Return ONLY valid JSON):\n ${JSON.stringify({ // Removed formatInstructions
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          finalAnswer: answer,
          solutionSteps: solutionSteps
        },
        visualEngine: {
          componentToRender: "NUMBER_CARDS",
          componentData: { items: [`${sortedDigits[0]}`, `${sortedDigits[1]}`, `${sortedDigits[2]}`], hideVisual: hideVisual }
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: "form_greatest", hideVisual: hideVisual }
    };
  }

  if (activeVariant === 'advanced_relative_logic') {
    const amounts = [30, 45, 60];
    const shuffled = amounts.sort(() => Math.random() - 0.5);
    const answer = `60, 45, 30`; // Renamed from answer to answer
    
    const options = isMCQ ? ["30, 45, 60", "45, 30, 60", "60, 45, 30", "60, 30, 45"] : null;

    const promptStart = `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Relative Logic Ordering\n - Final Answer MUST be exactly: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n - Use the 3 characters and their amounts: ${shuffled[0]}, ${shuffled[1]}, ${shuffled[2]}.\n - State the amounts out of order as clues.`;
    const solutionSteps = getQText(`The amounts are ${shuffled.join(', ')}. From greatest to smallest, the order is ${answer}.`, answer);

    return {
      aiPrompt: `${promptStart}\n ${formatInstructions}\n CRITICAL: RETURN THE FOLLOWING VALID JSON. FILL IN ALL [Placeholders] USING LOCALIZED THEMES:\n ${JSON.stringify({ // Keep formatInstructions for creative part, as AI generates text
        meta: commonMeta,
        content: {
          questionText: "[Insert full localized Singaporean word problem here]", // AI fills this
          options: options,
          finalAnswer: answer,
          solutionSteps: solutionSteps
        },
        visualEngine: {
          componentToRender: "NONE",
          componentData: { hideVisual: true }
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: "relative_order", hideVisual: true }
    };
  }

  if (activeVariant === 'advanced_sequence_skip_counting') {
    const steps = [2, 5, 10];
    const step = steps[Math.floor(Math.random() * steps.length)];
    const start = Math.floor(Math.random() * 40) + 10;
    const sequence = [start, start + step, start + 2*step, start + 3*step];
    const missingIdx = Math.floor(Math.random() * 2) + 1;
    const answer = String(sequence[missingIdx]);
    const displaySeq = [...sequence];
    displaySeq[missingIdx] = "?";
    
    const options = isMCQ ? [String(sequence[missingIdx] - step), answer, String(sequence[missingIdx] + step), String(sequence[missingIdx] + 1)] : null;

    const questionText = getQText(`Look at the number cards. The numbers follow a pattern. What is the missing number?`, `Find the missing number in the pattern: ${displaySeq.join(', ')}`);
    const solutionSteps = getQText(`The numbers are increasing by ${step} each time. So, ${sequence[missingIdx-1]} + ${step} = ${answer}.`, `${sequence[missingIdx - 1]} + ${step} = ${answer}`);

    return {
      aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Skip Counting Pattern\n - Final Answer MUST be: "${answer}"\n OUTPUT FORMAT (Return ONLY valid JSON):\n ${JSON.stringify({ // Removed formatInstructions
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          finalAnswer: answer,
          solutionSteps: solutionSteps
        },
        visualEngine: {
          componentToRender: "NUMBER_CARDS",
          componentData: { items: displaySeq, hideVisual: hideVisual }
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: "sequence_skip", hideVisual: hideVisual }
    };
  }

  if (activeVariant === 'advanced_smallest_from_digits') { // Renamed
    const digits = [];
    while(digits.length < 3) {
      const d = Math.floor(Math.random() * 8) + 2; 
      if (!digits.includes(d)) digits.push(d);
    }
    digits.sort((a,b) => a - b);
    const threshold = (digits[1] * 10); // Renamed from threshold to threshold
    const answerNum = (digits[1] * 10) + digits[0]; // Renamed from answerNum to answerNum
    const answer = String(answerNum);
    
    const d1 = (digits[0] * 10) + digits[1];
    const d2 = (digits[1] * 10) + digits[2];
    const d3 = (digits[2] * 10) + digits[0]; 
    
    const options = isMCQ ? [String(d1), answer, String(d2), String(d3)] : null;

    const questionText = getQText(`Use the digits on the cards to form the smallest 2-digit number that is GREATER than ${threshold}. You can only use each digit once. What is the number?`, `Use digits ${digits[0]}, ${digits[1]}, and ${digits[2]} to form the smallest 2-digit number greater than ${threshold}.`);
    const solutionSteps = getQText(`To make a number greater than ${threshold}, the tens digit must be ${digits[1]} or ${digits[2]}. To make it the smallest possible, we choose ${digits[1]} for the tens and the smallest remaining digit (${digits[0]}) for the ones. The number is ${answer}.`, `Tens: ${digits[1]}, Ones: ${digits[0]} -> ${answer}`);

    return {
      aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Form Number with Condition\n - Final Answer MUST be: "${answer}"\n OUTPUT FORMAT (Return ONLY valid JSON):\n ${JSON.stringify({ // Removed formatInstructions
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          finalAnswer: answer,
          solutionSteps: solutionSteps
        },
        visualEngine: {
          componentToRender: "NUMBER_CARDS",
          componentData: { items: [`${digits[0]}`, `${digits[1]}`, `${digits[2]}`], hideVisual: hideVisual }
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: "form_smallest_cond", hideVisual: hideVisual }
    };
  }

  if (activeVariant === 'advanced_swapped_digits_difference') {
    const tens = Math.floor(Math.random() * 4) + 5;
    const ones = Math.floor(Math.random() * 3) + 1;
    const num1 = (tens * 10) + ones;
    const num2 = (ones * 10) + tens;
    const diff = num1 - num2;
    const answer = String(Math.abs(diff)); // Use Math.abs to ensure positive difference
    
    const options = isMCQ ? [String(Math.abs(diff) - 9), answer, String(Math.abs(diff) + 9), String(num1 + num2)] : null;

    const questionText = getQText(`I have the number ${num1}. I form a new number by swapping its tens and ones digits. What is the difference between the original number and the new number?`, `What is the difference between ${num1} and the number formed by swapping its digits?`);
    const solutionSteps = getQText(`The original number is ${num1}. Swapping the digits gives ${num2}. The difference is ${num1} - ${num2} = ${answer}.`, `|${num1} - ${num2}| = ${answer}`);

    return {
      aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Swapped Digits Difference\n - Final Answer MUST be: "${answer}"\n OUTPUT FORMAT (Return ONLY valid JSON):\n ${JSON.stringify({ // Removed formatInstructions
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          finalAnswer: answer,
          solutionSteps: solutionSteps
        },
        visualEngine: {
          componentToRender: "NONE",
          componentData: { hideVisual: true }
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: "swapped_diff", hideVisual: true }
    };
  }

  if (activeVariant === 'advanced_logic_puzzle_order') {
    const options = isMCQ ? ["A, B, C", "C, B, A", "B, A, C", "B, C, A"] : null;
    const answer = "C, B, A"; // Renamed from answer to answer

    const promptStart = `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Logic Puzzle Ordering\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n - Create a story with 3 characters.\n - Clue 1: Character 2 has fewer items than Character 3.\n - Clue 2: Character 1 has fewer items than Character 2.`;
    const solutionSteps = getQText(`[Insert step-by-step localized explanation of the logic puzzle solution]`, answer);

    return {
      aiPrompt: `${promptStart}\n ${formatInstructions}\n CRITICAL: RETURN THE FOLLOWING VALID JSON. FILL IN ALL [Placeholders] USING LOCALIZED THEMES:\n ${JSON.stringify({ // Keep formatInstructions for creative part, as AI generates text
        meta: commonMeta,
        content: {
          questionText: "[Insert full localized Singaporean word problem here]", // AI fills this
          options: options,
          finalAnswer: answer,
          solutionSteps: solutionSteps
        },
        visualEngine: {
          componentToRender: "NONE",
          componentData: { hideVisual: true }
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: "logic_puzzle_order", hideVisual: true }
    };
  }

  if (activeVariant === 'advanced_mystery_number_clues') {
    const tens = Math.floor(Math.random() * 8) + 1; // 1-8
    const ones = Math.floor(Math.random() * 9); // 0-8
    const total = (tens * 10) + ones;
    const lower = tens * 10;
    const upper = lower + 10;
    const sum = tens + ones;
    const answer = String(total);
    
    const options = isMCQ ? [String((ones * 10) + tens), String(total - 10), answer, String(lower + sum)] : null;

    const questionText = getQText(`I am a number between ${lower} and ${upper}. The sum of my digits is ${sum}. What number am I?`, `What is the number between ${lower} and ${upper} whose digits add up to ${sum}?`);
    const solutionSteps = getQText(`A number between ${lower} and ${upper} must have ${tens} in the tens place. Since the sum of the digits is ${sum}, the ones digit is ${sum} - ${tens} = ${ones}. The number is ${answer}.`, `Tens: ${tens}, Ones: ${sum} - ${tens} = ${ones} -> ${answer}`);

    return {
      aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Mystery Number Clues\n - Final Answer MUST be: "${answer}"\n OUTPUT FORMAT (Return ONLY valid JSON):\n ${JSON.stringify({ // Removed formatInstructions
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          finalAnswer: answer,
          solutionSteps: solutionSteps
        },
        visualEngine: {
          componentToRender: "NONE",
          componentData: { hideVisual: true }
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: "mystery_clues", hideVisual: true }
    };
  }

  if (activeVariant === 'advanced_extreme_inequality') {
    const targetTens = Math.floor(Math.random() * 3) + 2;
    const targetOnes = Math.floor(Math.random() * 8) + 12;
    const targetValue = (targetTens * 10) + targetOnes;
    const answer = String(targetValue - 1); 
    
    const options = isMCQ ? [String(targetValue - 10), answer, String(targetValue + 1), String(targetValue)] : null;

    const questionText = getQText(`What is the GREATEST 2-digit number that is smaller than ${targetTens} tens and ${targetOnes} ones?`, `What is the greatest 2-digit number smaller than ${targetTens} tens and ${targetOnes} ones?`);
    const solutionSteps = getQText(`${targetTens} tens and ${targetOnes} ones is equal to ${targetValue}. The greatest number smaller than ${targetValue} is ${answer}.`, `${targetValue} - 1 = ${answer}`);

    return {
      aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Inequality with Regrouping\n - Final Answer MUST be: "${answer}"\n OUTPUT FORMAT (Return ONLY valid JSON):\n ${JSON.stringify({ // Removed formatInstructions
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: options,
          finalAnswer: answer,
          solutionSteps: solutionSteps
        },
        visualEngine: {
          componentToRender: "NONE",
          componentData: { hideVisual: true }
        },
        inputRequirement: { inputType: inputType }
      })}`,
      metadata: { difficulty, steps: 3, logic: "extreme_inequality", hideVisual: true }
    };
  }

  if (activeVariant === 'advanced_net_value_comparison') {
    const startTens = Math.floor(Math.random() * 3) + 3; // e.g., 3 to 5 tens
    const regroupedOnes = Math.floor(Math.random() * 8) + 12; // e.g., 12 to 19 ones
    const initialValue = (startTens * 10) + regroupedOnes;
    
    const changeTens = Math.floor(Math.random() * 2) + 1; // e.g., 1 or 2 tens
    const isIncrease = Math.random() > 0.5;
    const finalValue = isIncrease ? initialValue + (changeTens * 10) : initialValue - (changeTens * 10);
    
    const answer = String(finalValue);
    const options = [answer, String(finalValue + 5), String(finalValue - 10), String(initialValue)].sort(() => Math.random() - 0.5);

    const questionWords = `${context.name} has ${startTens} tens and ${regroupedOnes} ones. ${context.name} then ${isIncrease ? 'gets' : 'gives away'} ${changeTens} tens ${isIncrease ? 'MORE' : 'LESS'}. What is the total value now?`;
    const questionEquation = `${startTens} tens ${regroupedOnes} ones ${isIncrease ? '+' : '-'} ${changeTens} tens = ?`;

    const solutionWords = `${startTens} tens and ${regroupedOnes} ones is ${initialValue}. ${initialValue} ${isIncrease ? 'plus' : 'minus'} ${changeTens * 10} is ${finalValue}.`;
    const solutionEquation = `${initialValue} ${isIncrease ? '+' : '-'} ${changeTens * 10} = ${finalValue}`;

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: isStructure ? "[Insert full localized Singaporean word problem here]" : getQText(questionWords, questionEquation),
        options: isMCQ ? options : null,
        finalAnswer: answer,
        solutionSteps: getQText(solutionWords, solutionEquation)
      },
      visualEngine: {
        componentToRender: "NONE", // Changed to NONE as requested
        componentData: null // Changed to null as requested
      },
      inputRequirement: { inputType: inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. Use Singapore names/settings.\n${formatInstructions}\nOUTPUT FORMAT: Return ONLY valid JSON matching this exact structure:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty, steps: 3, logic: "net_value_comparison", hideVisual: hideVisual }
    };
  }
}