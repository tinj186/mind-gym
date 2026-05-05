import { getRandomContext } from '@/lib/utils/localization';
import { numberToWords } from '@/lib/utils/math-helpers'; // Import from new helper file

export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText) {
  // ==========================================
  // ADVANCED LEVEL
  // ==========================================

  // 5. Place Value Regrouping (Trick Question)
  if (activeVariant === 'advanced_regrouping') {
    const tens = Math.floor(Math.random() * 4) + 2; // 2 to 5 tens
    const extraOnes = Math.floor(Math.random() * 8) + 12; // 12 to 19 ones (forces regrouping)
    const total = (tens * 10) + extraOnes;
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a ${activeVariant} question. DO NOT modify the mathematical structure or the final answer.\nYou are an expert Primary 1 math question generator.\n MATH CONSTRAINTS:\n - Topic: Place Value Regrouping (Advanced Level).\n - Clue: "I have ${tens} tens and ${extraOnes} ones."\n - Question: What number am I?\n - Final Answer MUST strictly be: "${total}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(getQText('[Insert full localized Singaporean word problem here]', `${tens} tens ${extraOnes} ones = ?`))},
          "options": ${isMCQ ? JSON.stringify([String((tens * 10) + (extraOnes % 10)), String(tens + extraOnes), String(total), String(total + 10)]) : 'null'},
          "finalAnswer": "${total}",
          "solutionSteps": ${JSON.stringify(`${tens} tens is ${tens * 10}. ${tens * 10} + ${extraOnes} ones = ${total}.`)}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": null
        },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "place_value_regrouping", hideVisual: true }
    };
  }

  // 6. Logic Puzzle Clues
  if (activeVariant === 'advanced_clues') {
    const tensDigit = Math.floor(Math.random() * 4) + 5; // 5 to 8
    const onesDigit = Math.floor(Math.random() * 8) + 1; // 1 to 8
    const total = (tensDigit * 10) + onesDigit;

    const lowerBound = (tensDigit * 10);
    const upperBound = (tensDigit * 10) + 10;

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a ${activeVariant} question. DO NOT modify the mathematical structure or the final answer.\nYou are an expert Primary 1 math question generator.\n MATH CONSTRAINTS:\n - Topic: Number Logic Clues (Advanced Level).\n - Clue 1: The number is between ${lowerBound} and ${upperBound}.\n - Clue 2: The digit in the ones place is ${onesDigit}.\n - Question: What is the number?\n - Final Answer MUST strictly be: "${total}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(getQText('[Insert full localized Singaporean word problem here]', 'Mystery number clues: ' + lowerBound + ' < ? < ' + upperBound + ', ones = ' + onesDigit))},
          "options": ${isMCQ ? JSON.stringify([String(total - 10), String(total), String(total + 1), String(total + 10)]) : 'null'},
          "finalAnswer": "${total}",
          "solutionSteps": ${JSON.stringify(`The numbers between ${lowerBound} and ${upperBound} start with ${tensDigit} tens. If the ones digit is ${onesDigit}, the number is ${total}.`)}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": null
        },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "number_clues", hideVisual: true }
    };
  }

  // 7. Extreme Regrouping
  if (activeVariant === 'advanced_extreme_regrouping') {
    const tens = Math.floor(Math.random() * 3) + 1; // 1 to 3
    const ones = Math.floor(Math.random() * 20) + 21; // 21 to 40 ones
    const total = (tens * 10) + ones;
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a ${activeVariant} question. DO NOT modify the mathematical structure or the final answer.\nYou are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Extreme Regrouping.\n - Final Answer MUST be: "${total}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(getQText('I have ' + tens + ' ten and ' + ones + ' ones. What number am I?', `${tens} tens ${ones} ones = ?`))},
          "options": ${isMCQ ? JSON.stringify([String(tens + ones), String(total - 10), String(total), String(total + 10)]) : 'null'},
          "finalAnswer": "${total}",
          "solutionSteps": ${JSON.stringify(`${tens} ten is ${tens * 10}. ${tens * 10} + ${ones} = ${total}.`)}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": null },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "extreme_regrouping", hideVisual: true }
    };
  }

  // 8. Digit Sum Clues
  if (activeVariant === 'advanced_digit_sum') {
    const tensDigit = Math.floor(Math.random() * 6) + 2; // 2 to 7
    const onesDigit = Math.floor(Math.random() * 4) + 1; // 1 to 4
    const sum = tensDigit + onesDigit;
    const total = (tensDigit * 10) + onesDigit;
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a ${activeVariant} question. DO NOT modify the mathematical structure or the final answer.\nYou are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Digit Sum Logic.\n - Final Answer MUST be: "${total}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(getQText('I am a 2-digit number. My tens digit is ' + tensDigit + '. The sum of my digits is ' + sum + '. What number am I?', `Tens=${tensDigit}, Sum=${sum} -> ?`))},
          "options": ${isMCQ ? JSON.stringify([String(total - 10), String((onesDigit * 10) + tensDigit), String(total), String(total + 1)]) : 'null'},
          "finalAnswer": "${total}",
          "solutionSteps": ${JSON.stringify(`Since the tens digit is ${tensDigit}, we need a ones digit that makes the sum ${sum}. ${tensDigit} + ${onesDigit} = ${sum}, so the number is ${total}.`)}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": null },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "digit_sum", hideVisual: true }
    };
  }

  // 9. Digit Difference Clues
  if (activeVariant === 'advanced_digit_difference') {
    const tensDigit = Math.floor(Math.random() * 4) + 3; // 3 to 6
    const diff = Math.floor(Math.random() * 3) + 1; // 1 to 3
    const onesDigit = tensDigit + diff; // Ensures ones > tens and < 10
    const total = (tensDigit * 10) + onesDigit;
    const lowerBound = tensDigit * 10;
    const upperBound = lowerBound + 10;
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a ${activeVariant} question. DO NOT modify the mathematical structure or the final answer.\nYou are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Digit Difference Clues.\n - Final Answer MUST be: "${total}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(getQText('I am a number between ' + lowerBound + ' and ' + upperBound + '. My ones digit is ' + diff + ' more than my tens digit. What number am I?', `${lowerBound} < ? < ${upperBound}, ones=tens+${diff} -> ?`))},
          "options": ${isMCQ ? JSON.stringify([String(total - diff), String(total), String((onesDigit * 10) + tensDigit), String(total + 10)]) : 'null'},
          "finalAnswer": "${total}",
          "solutionSteps": ${JSON.stringify(`The number is in the ${tensDigit}0s, so the tens digit is ${tensDigit}. The ones digit is ${tensDigit} + ${diff} = ${onesDigit}. The number is ${total}.`)}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": null },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "digit_difference", hideVisual: true }
    };
  }

  // 10. Comparison Puzzle
  if (activeVariant === 'advanced_comparison_puzzle') {
    const tensDigit = Math.floor(Math.random() * 4) + 5; // 5 to 8
    const onesDigit = Math.floor(Math.random() * 3) + 3; // 3 to 5
    const total = (tensDigit * 10) + onesDigit;
    const lower = total - Math.floor(Math.random() * 2) - 1;
    const upper = total + Math.floor(Math.random() * 3) + 1;
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a ${activeVariant} question. DO NOT modify the mathematical structure or the final answer.\nYou are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Comparison Bounds.\n - Final Answer MUST be: "${total}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(getQText('I am greater than ' + lower + ' but smaller than ' + upper + '. I have a ' + onesDigit + ' in my ones place. What number am I?', `${lower} < ? < ${upper}, ones=${onesDigit} -> ?`))},
          "options": ${isMCQ ? JSON.stringify([String(lower - 1), String(total - 10), String(total), String(upper + 1)]) : 'null'},
          "finalAnswer": "${total}",
          "solutionSteps": ${JSON.stringify(`The only number between ${lower} and ${upper} ending in ${onesDigit} is ${total}.`)}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": null },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "comparison_puzzle", hideVisual: true }
    };
  }

  // 11. Word Problem (Boxes and Singles)
  if (activeVariant === 'advanced_word_problem_10s_1s') {
    const boxes = Math.floor(Math.random() * 4) + 2; // 2 to 5 boxes
    const singles = Math.floor(Math.random() * 8) + 11; // 11 to 18 singles
    const total = (boxes * 10) + singles;
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a ${activeVariant} question. DO NOT modify the mathematical structure or the final answer.\nYou are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Applied Regrouping Word Problem.\n - Final Answer MUST be: "${total}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(getQText('[Insert full localized Singaporean word problem here]', boxes + ' groups of 10 + ' + singles + ' = ?'))},
          "options": ${isMCQ ? JSON.stringify([String((boxes * 10) + (singles % 10)), String(boxes + singles), String(total), String(total + 10)]) : 'null'},
          "finalAnswer": "${total}",
          "solutionSteps": ${JSON.stringify(`Calculate total from groups of 10 and singles: (${boxes} x 10) + ${singles} = ${total}.`)}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": null },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "applied_regrouping", hideVisual: true }
    };
  }

  // 12. Value of a Digit
  if (activeVariant === 'advanced_value_of_digit') {
    const tens = Math.floor(Math.random() * 5) + 4; // 4 to 8
    const ones = Math.floor(Math.random() * 8) + 1;
    const total = (tens * 10) + ones;
    const answer = String(tens * 10);
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a ${activeVariant} question. DO NOT modify the mathematical structure or the final answer.\nYou are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: True Value of a Digit.\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(getQText('Look at the number ' + total + '. What does the digit ' + tens + ' stand for?', `${total}: digit ${tens} value = ?`))},
          "options": ${isMCQ ? JSON.stringify([String(tens), String(ones), String(answer), String(total)]) : 'null'},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(`The digit ${tens} is in the tens place, so it stands for ${tens} tens, which is ${answer}.`)}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": null },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 2, logic: "value_of_digit", hideVisual: true }
    };
  }

  // 13. Sequence Logic
  if (activeVariant === 'advanced_sequence_logic') {
    const start = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const jumps = Math.floor(Math.random() * 3) + 3; // 3 to 5
    const total = start + (10 * jumps);
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a ${activeVariant} question. DO NOT modify the mathematical structure or the final answer.\nYou are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Multiple Skip Count Logic.\n - Final Answer MUST be: "${total}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(getQText('Start at ' + start + '. Count on by 10s ' + jumps + ' times. What number do you land on?', `${start} + (${jumps} x 10) = ?`))},
          "options": ${isMCQ ? JSON.stringify([String(total - 10), String(total), String(total + 1), String(total + 10)]) : 'null'},
          "finalAnswer": "${total}",
          "solutionSteps": ${JSON.stringify(`Starting at ${start} and making ${jumps} jumps of 10: ${start + 10}, ${start + 20}... you land on ${total}.`)}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": null },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "sequence_logic", hideVisual: true }
    };
  }

  // 14. Two-Step Missing Sequence
  if (activeVariant === 'advanced_two_step_sequence') {
    const start = Math.floor(Math.random() * 30) + 10;
    const steps = [2, 5, 10];
    const step = steps[Math.floor(Math.random() * steps.length)];
    const seq = [start, start + step, "___", start + (step * 3), "___"];
    const answer = String(start + (step * 4)); // Ensure answer is a string
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a ${activeVariant} question. DO NOT modify the mathematical structure or the final answer.\nYou are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Deep Sequence Completion.\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(getQText('Look at this number pattern: ' + seq.join(", ") + '. What is the SECOND missing number?', seq.join(", ")))},
          "options": ${isMCQ ? JSON.stringify([String(parseInt(answer) - step), String(start + (step * 2)), String(answer), String(parseInt(answer) + step)]) : 'null'},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(`The pattern increases by ${step}. The first missing number is ${start + (step * 2)}. The second missing number is ${start + (step * 3)} + ${step} = ${answer}.`)}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": null },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "complex_sequence", hideVisual: true }
    };
  }

  throw new Error(`Variant '${activeVariant}' logic block not implemented in advanced.js.`);
}