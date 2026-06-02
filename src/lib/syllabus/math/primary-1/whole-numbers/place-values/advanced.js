import { numberToWords } from '@/lib/utils/math-helpers';

// Robust extraction helper for localized context objects
const extract = (val) => {
  if (typeof val !== 'object' || val === null) return String(val);
  return val.item || val.singular || val.name?.singular || val.text || val.val || String(val);
};

export const advancedVariants = {
  advanced_extreme_regrouping: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const tens = Math.floor(Math.random() * 3) + 1; // 1 to 3 tens
    const ones = Math.floor(Math.random() * 10) + 11; // 11 to 20 ones
    const num = (tens * 10) + ones;
    const answer = String(num);

    // Ensure options are distinct and include the correct answer
    const options = [num, num - 10, num + 10, (tens + 1) * 10 + (ones % 10)].filter(
      (val, idx, self) => self.indexOf(val) === idx
    ).sort(() => Math.random() - 0.5).slice(0, 3);
    if (!options.includes(num)) options.push(num); // Ensure correct answer is always present
    while (options.length < 4) options.push(Math.floor(Math.random() * 89) + 10); // Fill with random if needed

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating an advanced_extreme_regrouping question. DO NOT modify the mathematical structure or the final answer. NO addition or subtraction stories.
        MATH CONSTRAINTS:
        - Input: ${tens} tens and ${ones} ones.
        - Final Answer MUST strictly be: "${answer}"
        ${formatInstructions}
        CRITICAL: If the question type is MCQ, the "options" array MUST be exactly: ${JSON.stringify(options)}. DO NOT modify its content or format.

        OUTPUT FORMAT (Return ONLY a single valid JSON object):
        {
          "questionText": ${JSON.stringify(getQText(`What number is ${tens} tens and ${ones} ones?`, `${tens} tens ${ones} ones = ?`))},
          "options": ${type === 'MCQ' ? JSON.stringify(options) : 'null'},
          "hint": ${JSON.stringify(getQText(`Remember that ${ones} ones can make another ten. ${tens} tens is ${tens * 10}. Add ${ones} to it.`, `What is ${tens * 10} + ${ones}?`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`${tens} tens is ${tens * 10}. ${tens * 10} + ${ones} = ${num}.`, `${tens * 10} + ${ones} = ${num}`))},          
          "visualEngine": { 
            "componentToRender": "BASE_TEN_BLOCKS", 
            "componentData": { "tens": ${tens}, "ones": ${ones} } 
          }
        }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "extreme_regroup", hideVisual: false }
    };
  },
  advanced_digit_clues: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const onesDigit = Math.floor(Math.random() * 6) + 4; // 4 to 9
    const tensDigit = onesDigit - (Math.floor(Math.random() * 3) + 1); // 1 to 3 less than ones
    if (tensDigit < 1) tensDigit = 1; // Ensure tens digit is at least 1
    const num = (tensDigit * 10) + onesDigit;
    const sum = tensDigit + onesDigit;
    const diff = onesDigit - tensDigit;
    const sName = extract(context?.name || 'Wei Ling');

    // Ensure options are distinct and include the correct answer
    const options = [num, num - 1, num + 1, (onesDigit * 10) + tensDigit].filter(
      (val, idx, self) => self.indexOf(val) === idx
    ).sort(() => Math.random() - 0.5).slice(0, 3);
    if (!options.includes(num)) options.push(num);
    while (options.length < 4) options.push(Math.floor(Math.random() * 89) + 10);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating an advanced_digit_clues question. DO NOT modify the mathematical structure or the final answer. Use the name ${sName}. NO addition or subtraction stories.
        MATH CONSTRAINTS:
        - Target Number: ${num}
        - Clue: Sum of digits is ${sum}, tens digit is ${diff} less than ones.
        - Final Answer MUST strictly be: "${num}"
        ${formatInstructions}
        CRITICAL: If the question type is MCQ, the "options" array MUST be exactly: ${JSON.stringify(options)}. DO NOT modify its content or format.

        OUTPUT FORMAT (Return ONLY a single valid JSON object):
        {
          "questionText": ${JSON.stringify(getQText(`I am a 2-digit number. The sum of my digits is ${sum}. My tens digit is ${diff} less than my ones digit. What number am I?`, `2-digit number: Sum of digits is ${sum}, tens digit is ${diff} less than ones?`))},
          "options": ${type === 'MCQ' ? JSON.stringify(options) : 'null'},
          "hint": ${JSON.stringify(getQText(`Find two numbers that add up to ${sum}, where one number is ${diff} smaller than the other.`, `Try splitting ${sum} into two digits.`))},
          "finalAnswer": "${num}",
          "solutionSteps": ${JSON.stringify(getQText(`Ones digit is ${onesDigit}, tens digit is ${tensDigit}. ${tensDigit} + ${onesDigit} = ${sum}. The number is ${num}.`, `${tensDigit}+${onesDigit}=${sum}, ${tensDigit}=${onesDigit}-${diff}`))},
          "visualItems": []
        }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "logic_puzzle", hideVisual: true }
    };
  },
  advanced_mystery_number_bounds: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const tensDigit = Math.floor(Math.random() * 4) + 3; // 3 to 6
    const onesDigit = tensDigit - 1; // tens digit is 1 more than ones
    const num = (tensDigit * 10) + onesDigit;
    const lowerBound = tensDigit * 10;
    const upperBound = (tensDigit + 1) * 10;

    // Ensure options are distinct and include the correct answer
    const options = [num, num - 1, num + 1, (onesDigit * 10) + tensDigit].filter(
      (val, idx, self) => self.indexOf(val) === idx
    ).sort(() => Math.random() - 0.5).slice(0, 3);
    if (!options.includes(num)) options.push(num);
    while (options.length < 4) options.push(Math.floor(Math.random() * 89) + 10);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating an advanced_mystery_number_bounds question. NO addition or subtraction stories.
        MATH CONSTRAINTS:
        - Number: ${num}
        - Clues: Between ${lowerBound} and ${upperBound}, tens digit is 1 more than ones.
        - Final Answer MUST strictly be: "${num}"
        ${formatInstructions}
        CRITICAL: If the question type is MCQ, the "options" array MUST be exactly: ${JSON.stringify(options)}. DO NOT modify its content or format.

        OUTPUT FORMAT (Return ONLY a single valid JSON object):
        {
          "questionText": ${JSON.stringify(getQText(`I am a number between ${lowerBound} and ${upperBound}. My tens digit is 1 more than my ones digit. What number am I?`, `Number between ${lowerBound} and ${upperBound}: Tens digit is 1 more than ones?`))},
          "options": ${type === 'MCQ' ? JSON.stringify(options) : 'null'},
          "hint": ${JSON.stringify(getQText(`If I am between ${lowerBound} and ${upperBound}, my tens digit must be ${tensDigit}. Now find the ones digit.`, `Tens digit is ${tensDigit}.`))},
          "finalAnswer": "${num}",
          "solutionSteps": ${JSON.stringify(getQText(`The tens digit must be ${tensDigit}. So the ones digit is ${onesDigit}. The number is ${num}.`, `tens=${tensDigit}, ones=${tensDigit}-1=${onesDigit}`))},
          "visualItems": []
        }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "bounds", hideVisual: true }
    };
  },
  advanced_digit_swap: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const tens = Math.floor(Math.random() * 4) + 1; // 1 to 4
    const ones = Math.floor(Math.random() * 4) + 5; // 5 to 8 (ensure ones > tens for positive diff)
    const startNum = (tens * 10) + ones;
    const swappedNum = (ones * 10) + tens;
    const diff = Math.abs(swappedNum - startNum);
    const answer = String(diff);

    // Ensure options are distinct and include the correct answer
    const options = [diff, diff - 9, diff + 9, startNum + swappedNum].filter(
      (val, idx, self) => self.indexOf(val) === idx
    ).sort(() => Math.random() - 0.5).slice(0, 3);
    if (!options.includes(diff)) options.push(diff);
    while (options.length < 4) options.push(Math.floor(Math.random() * 89) + 10);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating an advanced_digit_swap question. NO addition or subtraction stories.
        MATH CONSTRAINTS:
        - Number: ${startNum}
        - Event: Swap digits.
        - Final Answer MUST strictly be: "${diff}"
        ${formatInstructions}
        CRITICAL: If the question type is MCQ, the "options" array MUST be exactly: ${JSON.stringify(options)}. DO NOT modify its content or format.

        OUTPUT FORMAT (Return ONLY a single valid JSON object):
        {
          "questionText": ${JSON.stringify(getQText(`If I swap the digits of ${startNum}, by how much does the number change?`, `How much does ${startNum} change if you swap its digits?`))},
          "options": ${type === 'MCQ' ? JSON.stringify(options) : 'null'},
          "hint": ${JSON.stringify(getQText(`First, find the new number by swapping the tens and ones. Then find the difference between the numbers.`, `Swap digits and subtract.`))},
          "finalAnswer": "${diff}",
          "solutionSteps": ${JSON.stringify(getQText(`Swapping ${startNum} gives ${swappedNum}. The difference is ${Math.max(startNum, swappedNum)} - ${Math.min(startNum, swappedNum)} = ${diff}.`, `${Math.max(startNum, swappedNum)} - ${Math.min(startNum, swappedNum)} = ${diff}`))},
          "visualItems": []
        }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "swap", hideVisual: true }
    };
  },
  advanced_balance_equation: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const numA = Math.floor(Math.random() * 40) + 30; // 30 to 69
    const tensA = Math.floor(numA / 10);
    const onesA = numA % 10;

    const tensB = Math.floor(Math.random() * (tensA - 1)) + 1; // 1 to tensA-1
    const onesB = numA - (tensB * 10); // Calculate onesB to balance

    // Ensure options are distinct and include the correct answer
    const options = [onesB, onesB - 10, onesB + 10, tensA * 10 + onesA].filter(
      (val, idx, self) => self.indexOf(val) === idx
    ).sort(() => Math.random() - 0.5).slice(0, 3);
    if (!options.includes(onesB)) options.push(onesB);
    while (options.length < 4) options.push(Math.floor(Math.random() * 20) + 1);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating an advanced_balance_equation question. NO addition or subtraction stories.
        MATH CONSTRAINTS:
        - Equation: ${tensA} tens ${onesA} ones = ${tensB} tens ? ones.
        - Final Answer MUST strictly be: "${onesB}"
        ${formatInstructions}
        CRITICAL: If the question type is MCQ, the "options" array MUST be exactly: ${JSON.stringify(options)}. DO NOT modify its content or format.

        OUTPUT FORMAT (Return ONLY a single valid JSON object):
        {
          "questionText": ${JSON.stringify(getQText(`Balance the equation: ${tensA} tens ${onesA} ones = ${tensB} tens ____ ones.`, `${tensA} tens ${onesA} ones = ${tensB} tens ? ones`))},
          "options": ${type === 'MCQ' ? JSON.stringify(options) : 'null'},
          "hint": ${JSON.stringify(getQText(`Calculate the total value on the left side first. Then subtract the value of ${tensB} tens.`, `Find total, then subtract ${tensB * 10}.`))},
          "finalAnswer": "${onesB}",
          "solutionSteps": ${JSON.stringify(getQText(`${tensA} tens ${onesA} ones is ${numA}. ${tensB} tens is ${tensB * 10}. ${numA} - ${tensB * 10} = ${onesB}.`, `${numA} - ${tensB * 10} = ${onesB}`))},
          "visualItems": []
        }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "balance", hideVisual: true }
    };
  },
  advanced_consecutive_digits: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const tensDigit = Math.floor(Math.random() * 4) + 1; // 1 to 4
    const onesDigit = tensDigit + 1;
    const num = (tensDigit * 10) + onesDigit;
    const sum = tensDigit + onesDigit;

    // Ensure options are distinct and include the correct answer
    const options = [num, num - 1, num + 1, (onesDigit * 10) + tensDigit].filter(
      (val, idx, self) => self.indexOf(val) === idx
    ).sort(() => Math.random() - 0.5).slice(0, 3);
    if (!options.includes(num)) options.push(num);
    while (options.length < 4) options.push(Math.floor(Math.random() * 89) + 10);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating an advanced_consecutive_digits question. NO addition or subtraction stories.
        MATH CONSTRAINTS:
        - Number: ${num}
        - Clue: Digits are consecutive (next to each other), sum is ${sum}.
        - Final Answer MUST strictly be: "${num}"
        ${formatInstructions}
        CRITICAL: If the question type is MCQ, the "options" array MUST be exactly: ${JSON.stringify(options)}. DO NOT modify its content or format.

        OUTPUT FORMAT (Return ONLY a single valid JSON object):
        {
          "questionText": ${JSON.stringify(getQText(`The digits of a number are consecutive. Their sum is ${sum}. What is the 2-digit number?`, `2-digit number with consecutive digits that sum to ${sum}?`))},
          "options": ${type === 'MCQ' ? JSON.stringify(options) : 'null'},
          "hint": ${JSON.stringify(getQText(`Consecutive numbers are like 1 and 2, or 3 and 4. Which two next-door numbers add up to ${sum}?`, `Try pairs like (1,2), (2,3)...`))},
          "finalAnswer": "${num}",
          "solutionSteps": ${JSON.stringify(getQText(`The digits ${tensDigit} and ${onesDigit} are consecutive and sum to ${sum}. The number is ${num}.`, `${tensDigit}+${onesDigit}=${sum}`))},
          "visualItems": []
        }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "consecutive", hideVisual: true }
    };
  },
  advanced_same_digits: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const digit = Math.floor(Math.random() * 8) + 1; // 1 to 8
    const num = (digit * 10) + digit;
    const sum = digit + digit;

    // Ensure options are distinct and include the correct answer
    const options = [num, num - 11, num + 11, (digit + 1) * 10 + (digit + 1)].filter(
      (val, idx, self) => self.indexOf(val) === idx
    ).sort(() => Math.random() - 0.5).slice(0, 3);
    if (!options.includes(num)) options.push(num);
    while (options.length < 4) options.push(Math.floor(Math.random() * 89) + 10);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating an advanced_same_digits question. NO addition or subtraction stories.
        MATH CONSTRAINTS:
        - Number: ${num}
        - Clue: Digits are the same, sum is ${sum}.
        - Final Answer MUST strictly be: "${num}"
        ${formatInstructions}
        CRITICAL: If the question type is MCQ, the "options" array MUST be exactly: ${JSON.stringify(options)}. DO NOT modify its content or format.

        OUTPUT FORMAT (Return ONLY a single valid JSON object):
        {
          "questionText": ${JSON.stringify(getQText(`My tens digit and ones digit are the same. Their sum is ${sum}. What number am I?`, `2-digit number where tens and ones digits are the same and sum to ${sum}?`))},
          "options": ${type === 'MCQ' ? JSON.stringify(options) : 'null'},
          "hint": ${JSON.stringify(getQText(`If the digits are the same, divide ${sum} by 2 to find the digit.`, `Half of ${sum} is the digit.`))},
          "finalAnswer": "${num}",
          "solutionSteps": ${JSON.stringify(getQText(`The digits must be ${digit} and ${digit} because ${digit} + ${digit} = ${sum}.`, `${digit}+${digit}=${sum}`))},
          "visualItems": []
        }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "same_digits", hideVisual: true }
    };
  },
  advanced_value_deduction: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const tensDigit = Math.floor(Math.random() * 4) + 3; // 3 to 6
    const onesDigit = Math.floor(Math.random() * 9);
    const num = (tensDigit * 10) + onesDigit;
    const tensValue = tensDigit * 10;
    const sum = tensDigit + onesDigit;

    // Ensure options are distinct and include the correct answer
    const options = [num, num - 1, num + 1, (onesDigit * 10) + tensDigit].filter(
      (val, idx, self) => self.indexOf(val) === idx
    ).sort(() => Math.random() - 0.5).slice(0, 3);
    if (!options.includes(num)) options.push(num);
    while (options.length < 4) options.push(Math.floor(Math.random() * 89) + 10);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating an advanced_value_deduction question. NO addition or subtraction stories.
        MATH CONSTRAINTS:
        - Tens value: ${tensValue}.
        - Sum of digits: ${sum}.
        - Final Answer MUST strictly be: "${num}"
        ${formatInstructions}
        CRITICAL: If the question type is MCQ, the "options" array MUST be exactly: ${JSON.stringify(options)}. DO NOT modify its content or format.

        OUTPUT FORMAT (Return ONLY a single valid JSON object):
        {
          "questionText": ${JSON.stringify(getQText(`The value of my tens digit is ${tensValue}. The sum of my digits is ${sum}. What number am I?`, `2-digit number: Tens value is ${tensValue}, sum of digits is ${sum}?`))},
          "options": ${type === 'MCQ' ? JSON.stringify(options) : 'null'},
          "hint": ${JSON.stringify(getQText(`If the tens value is ${tensValue}, the tens digit is ${tensDigit}. Now find what ones digit adds to ${tensDigit} to make ${sum}.`, `Tens digit is ${tensDigit}.`))},
          "finalAnswer": "${num}",
          "solutionSteps": ${JSON.stringify(getQText(`Tens digit is ${tensDigit}. ${tensDigit} + ones digit = ${sum}, so ones digit is ${onesDigit}. The number is ${num}.`, `${tensValue}=${tensDigit} tens, ${tensDigit}+${onesDigit}=${sum}`))},
          "visualItems": []
        }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "deduction", hideVisual: true }
    };
  },
  advanced_missing_regrouped_tens: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const ones = Math.floor(Math.random() * 10) + 11; // 11 to 20 ones
    const totalNum = Math.floor(Math.random() * 40) + 30; // 30 to 69
    const tens = Math.floor((totalNum - ones) / 10);
    if (tens < 1) tens = 1; // Ensure at least 1 ten
    const num = (tens * 10) + ones; // Recalculate num based on valid tens and ones

    // Ensure options are distinct and include the correct answer
    const options = [tens, tens - 1, tens + 1, Math.floor(num / 10)].filter(
      (val, idx, self) => self.indexOf(val) === idx
    ).sort(() => Math.random() - 0.5).slice(0, 3);
    if (!options.includes(tens)) options.push(tens);
    while (options.length < 4) options.push(Math.floor(Math.random() * 8) + 1);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating an advanced_missing_regrouped_tens question. NO addition or subtraction stories.
        MATH CONSTRAINTS:
        - Equation: ? tens ${ones} ones = ${num}.
        - Final Answer MUST strictly be: "${tens}"
        ${formatInstructions}
        CRITICAL: If the question type is MCQ, the "options" array MUST be exactly: ${JSON.stringify(options)}. DO NOT modify its content or format.

        OUTPUT FORMAT (Return ONLY a single valid JSON object):
        {
          "questionText": ${JSON.stringify(getQText(`Fill in the blank: ____ tens ${ones} ones = ${num}`, `____ tens ${ones} ones = ${num}`))},
          "options": ${type === 'MCQ' ? JSON.stringify(options) : 'null'},
          "hint": ${JSON.stringify(getQText(`Subtract the ${ones} ones from ${num}. The result is the value of the missing tens.`, `${num} - ${ones} = ?`))},
          "finalAnswer": "${tens}",
          "solutionSteps": ${JSON.stringify(getQText(`${num} - ${ones} = ${tens * 10}. ${tens * 10} is ${tens} tens.`, `${num} - ${ones} = ${tens * 10}`))},
          "visualItems": []
        }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "missing_tens", hideVisual: true }
    };
  },
  advanced_extreme_ones_comparison: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const tens = Math.floor(Math.random() * 5) + 4; // 4 to 8 tens
    const numTens = tens * 10;
    const numOnes = (Math.floor(Math.random() * 2) + 8) * 10; // 80 or 90 ones
    const compareValue = Math.random() > 0.5 ? numTens : numOnes;
    const answer = (numTens === numOnes) ? "They are equal" : (numTens < numOnes ? `${tens} tens` : `${numOnes} ones`);

    // Ensure options are distinct and include the correct answer
    const options = ["They are equal", `${tens} tens`, `${numOnes} ones`, `${tens + 1} tens`].filter(
      (val, idx, self) => self.indexOf(val) === idx
    ).sort(() => Math.random() - 0.5).slice(0, 3);
    if (!options.includes(answer)) options.push(answer);
    while (options.length < 4) options.push(Math.random() > 0.5 ? `${Math.floor(Math.random() * 8) + 1} tens` : `${(Math.floor(Math.random() * 8) + 1) * 10} ones`);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating an advanced_extreme_ones_comparison question. NO addition or subtraction stories.
        MATH CONSTRAINTS:
        - Compare: ${tens} tens vs ${numOnes} ones.
        - Final Answer MUST strictly be: "Equal" or specific value if asked which is smaller/greater.
        ${formatInstructions}
        CRITICAL: If the question type is MCQ, the "options" array MUST be exactly: ${JSON.stringify(options)}. DO NOT modify its content or format.

        OUTPUT FORMAT (Return ONLY a single valid JSON object):
        {
          "questionText": ${JSON.stringify(getQText(`Which is smaller: ${tens} tens or ${numOnes} ones?`, `Which is smaller: ${tens} tens or ${numOnes} ones?`))},
          "options": ${type === 'MCQ' ? JSON.stringify(options) : 'null'},
          "hint": ${JSON.stringify(getQText(`Convert ${tens} tens into a single number. Then compare it to ${numOnes}.`, `${tens} tens = ?`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`${tens} tens is ${numTens}. ${numOnes} ones is also ${numOnes}. They are ${answer === "They are equal" ? "the same" : (numTens < numOnes ? "90" : "9 tens")}.`, `${tens}*10=${numTens}, ${numOnes}*1=${numOnes}`))},
          "visualItems": []
        }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "comparison", hideVisual: true }
    };
  }
};

export const advancedLogic = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
  if (advancedVariants[activeVariant]) {
    return advancedVariants[activeVariant](config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
  }
  return null;
};