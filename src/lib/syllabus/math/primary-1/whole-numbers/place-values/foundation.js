import { numberToWords } from '@/lib/utils/math-helpers';

// Robust extraction helper for localized context objects
const extract = (val) => {
  if (typeof val !== 'object' || val === null) return String(val);
  return val.item || val.singular || val.name?.singular || val.text || val.val || String(val);
};

export const foundationVariants = {
  foundation_identify: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const num = Math.floor(Math.random() * 89) + 10;
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    const answer = `${tens} tens ${ones} ones`;
    const visualProtocol = `\nSTRICT VISUAL PROTOCOL: For the "visualItems" array, you MUST use the exact array of symbols (▮ and ▪) provided in the JSON template below. DO NOT replace them with words or emojis.`;

    const options = [];
    options.push(answer);
    // Distractor 1: Incorrect ones
    options.push(`${tens} tens ${ (ones + 1) % 10 } ones`);
    // Distractor 2: Incorrect tens
    options.push(`${ (tens % 8) + 1 } tens ${ones} ones`);
    // Distractor 3: The number itself
    options.push(String(num));

    let uniqueOptions = [...new Set(options)];
    while (uniqueOptions.length < 4) {
      uniqueOptions.push(`${Math.floor(Math.random() * 9) + 1} tens ${Math.floor(Math.random() * 9) + 1} ones`);
      uniqueOptions = [...new Set(uniqueOptions)];
    }
    const mcqOptions = type === 'MCQ' ? JSON.stringify(uniqueOptions.sort(() => Math.random() - 0.5)) : 'null';

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a foundation_identify question. DO NOT modify the mathematical structure or the final answer.${visualProtocol}
        MATH CONSTRAINTS:
        - Number: ${num}
        - Final Answer MUST strictly be: "${answer}"

        CONCISENESS MANDATE:
        - DO NOT use stories, names, or settings.
        - DO NOT include extra emojis (like fruit, people, or places) in the questionText.
        - Stick strictly to a direct mathematical question.

        CRITICAL: If the question type is MCQ, the "options" array MUST be exactly: ${mcqOptions}. DO NOT modify its content or format.

        OUTPUT FORMAT (Return ONLY valid JSON):
        {
          "questionText": ${JSON.stringify(getQText(`How many tens and ones are there in the number ${num}?`, `${num} = ? tens ? ones`))},
          "options": ${mcqOptions},
          "hint": ${JSON.stringify(getQText(`The number on the left shows the tens. The number on the right shows the ones. Count the tens and ones blocks.`, `Count the ▮ (tens) and ▪ (ones).`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`${num} has ${tens} tens and ${ones} ones.`, `${num} = ${tens} tens + ${ones} ones`))},
          "visualItems": ${JSON.stringify([...Array(tens).fill('▮'), ...Array(ones).fill('▪')])}
        }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "identify", hideVisual: true }
    };
  },
  foundation_value: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const num = Math.floor(Math.random() * 89) + 10;
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    const isTens = Math.random() > 0.5;
    const digit = isTens ? tens : ones;
    const answer = isTens ? String(tens * 10) : String(ones);
    const place = isTens ? "tens" : "ones";
    const visualProtocol = `\nSTRICT VISUAL PROTOCOL: For the "visualItems" array, you MUST use the exact array of symbols (▮ and ▪) provided in the JSON template below.`;

    const options = [];
    options.push(answer);
    // Distractors
    if (isTens) { options.push(String(tens), String(ones), String(ones * 10)); }
    else { options.push(String(ones * 10), String(tens), String(tens * 10)); }

    let uniqueOptions = [...new Set(options)];
    while (uniqueOptions.length < 4) {
      uniqueOptions.push(String(Math.floor(Math.random() * 9) * 10));
      uniqueOptions = [...new Set(uniqueOptions)];
    }
    const mcqOptions = type === 'MCQ' ? JSON.stringify(uniqueOptions.sort(() => Math.random() - 0.5)) : 'null';

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a foundation_value question. DO NOT modify the mathematical structure or the final answer.${visualProtocol}
        MATH CONSTRAINTS:
        - Number: ${num}
        - Digit to ask about: ${digit}
        - Final Answer MUST strictly be: "${answer}"

        CONCISENESS MANDATE:
        - DO NOT use stories, names, or settings.
        - DO NOT include extra emojis in the questionText.
        - Stick strictly to a direct mathematical question.

        CRITICAL: If the question type is MCQ, the "options" array MUST be exactly: ${mcqOptions}. DO NOT modify its content or format.

        OUTPUT FORMAT (Return ONLY valid JSON):
        {
          "questionText": ${JSON.stringify(getQText(`In the number ${num}, what is the value of the digit ${digit}?`, `Value of ${digit} in ${num} = ?`))},
          "options": ${mcqOptions},
          "hint": ${JSON.stringify(getQText(`Check the place where the digit ${digit} is sitting. If it is in the tens place, its value is ${digit} tens.`, `Which place is ${digit} in?`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The digit ${digit} is in the ${place} place, so its value is ${answer}.`, `Digit ${digit} in ${place} place. Value = ${answer}`))},
          "visualItems": ${JSON.stringify([...Array(tens).fill('▮'), ...Array(ones).fill('▪')])}
        }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "value", hideVisual: true }
    };
  },
  foundation_compose: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const tens = Math.floor(Math.random() * 8) + 1;
    const ones = Math.floor(Math.random() * 9) + 1;
    const num = (tens * 10) + ones;
    const answer = String(num);
    const visualProtocol = `\nSTRICT VISUAL PROTOCOL: For the "visualItems" array, you MUST use the exact array of symbols (▮ and ▪) provided in the JSON template below.`;

    const options = [];
    options.push(answer);
    // Distractors
    options.push(String((ones * 10) + tens)); // Swapped digits
    options.push(String(tens + ones)); // Sum of digits
    options.push(String(num + 1));

    let uniqueOptions = [...new Set(options)];
    while (uniqueOptions.length < 4) {
      uniqueOptions.push(String(Math.floor(Math.random() * 90) + 10));
      uniqueOptions = [...new Set(uniqueOptions)];
    }
    const mcqOptions = type === 'MCQ' ? JSON.stringify(uniqueOptions.sort(() => Math.random() - 0.5)) : 'null';

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a foundation_compose question. DO NOT modify the mathematical structure or the final answer.${visualProtocol}
        MATH CONSTRAINTS:
        - Input: ${tens} tens and ${ones} ones.
        - Final Answer MUST strictly be: "${answer}"

        CONCISENESS MANDATE:
        - DO NOT use stories, names, or settings.
        - DO NOT include extra emojis in the questionText.
        - Stick strictly to a direct mathematical question.

        CRITICAL: If the question type is MCQ, the "options" array MUST be exactly: ${mcqOptions}. DO NOT modify its content or format.

        OUTPUT FORMAT (Return ONLY valid JSON):
        {
          "questionText": ${JSON.stringify(getQText(`What number is formed by ${tens} tens and ${ones} ones?`, `${tens} tens + ${ones} ones = ?`))},
          "options": ${mcqOptions},
          "hint": ${JSON.stringify(getQText(`${tens} tens is the same as ${tens * 10}. Now add the ${ones} ones to it.`, `${tens * 10} + ${ones} = ?`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`${tens} tens is ${tens * 10} and ${ones} ones is ${ones}. ${tens * 10} + ${ones} = ${num}.`, `${tens * 10} + ${ones} = ${num}`))},
          "visualItems": ${JSON.stringify([...Array(tens).fill('▮'), ...Array(ones).fill('▪')])}
        }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "compose", hideVisual: true }
    };
  },
  foundation_decompose_tens: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const num = Math.floor(Math.random() * 89) + 10;
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    const answer = String(tens);
    const visualProtocol = `\nSTRICT VISUAL PROTOCOL: For the "visualItems" array, you MUST use the exact array of symbols (▮ and ▪) provided in the JSON template below.`;

    const options = [];
    options.push(answer);
    // Distractors
    options.push(String(ones));
    options.push(String(tens * 10));
    options.push(String(tens + 1));

    let uniqueOptions = [...new Set(options)];
    while (uniqueOptions.length < 4) {
      uniqueOptions.push(String(Math.floor(Math.random() * 9) + 1));
      uniqueOptions = [...new Set(uniqueOptions)];
    }
    const mcqOptions = type === 'MCQ' ? JSON.stringify(uniqueOptions.sort(() => Math.random() - 0.5)) : 'null';
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a foundation_decompose_tens question. DO NOT modify the mathematical structure or the final answer.${visualProtocol}
        MATH CONSTRAINTS:
        - Number: ${num}
        - Missing part: number of tens.
        - Final Answer MUST strictly be: "${answer}"

        CONCISENESS MANDATE:
        - DO NOT use stories, names, or settings.
        - DO NOT include extra emojis in the questionText.
        - Stick strictly to a direct mathematical question.

        CRITICAL: If the question type is MCQ, the "options" array MUST be exactly: ${mcqOptions}. DO NOT modify its content or format.

        OUTPUT FORMAT (Return ONLY valid JSON):
        {
          "questionText": ${JSON.stringify(getQText(`Fill in the blank: ${num} = ____ tens ${ones} ones.`, `${num} = ? tens ${ones} ones`))},
          "options": ${mcqOptions},
          "hint": ${JSON.stringify(getQText(`How many groups of 10 blocks can you find in the number ${num}? Count the long bars.`, `Count the long bars (▮).`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`${num} has ${tens} tens and ${ones} ones.`, `${num} = ${tens} tens + ${ones} ones`))},
          "visualItems": ${JSON.stringify([...Array(tens).fill('▮'), ...Array(ones).fill('▪')])}
        }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "decompose_tens", hideVisual: true }
    };
  },
  foundation_digit_position: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const num = Math.floor(Math.random() * 89) + 10;
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    const isTens = Math.random() > 0.5;
    const place = isTens ? "tens" : "ones";
    const answer = isTens ? String(tens) : String(ones);
    const visualProtocol = `\nSTRICT VISUAL PROTOCOL: For the "visualItems" array, you MUST use the exact array of symbols (▮ and ▪) provided in the JSON template below.`;

    const options = [];
    options.push(answer);
    // Distractors
    if (isTens) { options.push(String(ones), String(tens * 10), String(ones * 10)); }
    else { options.push(String(tens), String(ones * 10), String(tens * 10)); }

    let uniqueOptions = [...new Set(options)];
    while (uniqueOptions.length < 4) {
      uniqueOptions.push(String(Math.floor(Math.random() * 9) + 1));
      uniqueOptions = [...new Set(uniqueOptions)];
    }
    const mcqOptions = type === 'MCQ' ? JSON.stringify(uniqueOptions.sort(() => Math.random() - 0.5)) : 'null';

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a foundation_digit_position question. DO NOT modify the mathematical structure or the final answer.${visualProtocol}
        MATH CONSTRAINTS:
        - Number: ${num}
        - Question: Which digit is in the ${place} place?
        - Final Answer MUST strictly be: "${answer}"

        CONCISENESS MANDATE:
        - DO NOT use stories, names, or settings.
        - DO NOT include extra emojis in the questionText.
        - Stick strictly to a direct mathematical question.

        CRITICAL: If the question type is MCQ, the "options" array MUST be exactly: ${mcqOptions}. DO NOT modify its content or format.

        OUTPUT FORMAT (Return ONLY valid JSON):
        {
          "questionText": ${JSON.stringify(getQText(`In the number ${num}, which digit is in the ${place} place?`, `Digit in ${place} place of ${num} = ?`))},
          "options": ${mcqOptions},
          "hint": ${JSON.stringify(getQText(`The first digit from the left is the tens place. The second digit is the ones place.`, `Look at ${num}. Which digit is for ${place}?`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The number ${num} has ${tens} in the tens place and ${ones} in the ones place.`, `Tens: ${tens}, Ones: ${ones}`))},
          "visualItems": ${JSON.stringify([...Array(tens).fill('▮'), ...Array(ones).fill('▪')])}
        }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "digit_position", hideVisual: true }
    };
  }
};

export const foundationLogic = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
  if (foundationVariants[activeVariant]) {
    return foundationVariants[activeVariant](config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
  }
  return null;
};