import { getRandomContext } from '@/lib/utils/localization';
import { numberToWords } from '@/lib/utils/math-helpers'; // Import from new helper file

export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon) {
  // ==========================================
  // ADVANCED LEVEL
  // ==========================================

  // 5. Place Value Regrouping (Trick Question)
  if (activeVariant === 'advanced_regrouping') {
    const tens = Math.floor(Math.random() * 4) + 2; // 2 to 5 tens
    const extraOnes = Math.floor(Math.random() * 8) + 12; // 12 to 19 ones (forces regrouping)
    const total = (tens * 10) + extraOnes;

    const questionTextTemplate = getQText(`What is the number if I have ${tens} tens and ${extraOnes} ones?`, `${tens} tens ${extraOnes} ones = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Use the [STORY] placeholder in "questionText" to create a 1-sentence Singaporean math story (e.g., Siti at the MRT station).`;

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      CRITICAL: This is a text-only question. Do NOT include any "modelData" or legacy keys like "modelVisualizer" or "modelDrawing". No icon rendering is allowed.

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${isMCQ ? JSON.stringify([String((tens * 10) + (extraOnes % 10)), String(tens + extraOnes), String(total), String(total + 10)]) : 'null'},
          "hint": "Group 10 ones together to form 1 ten.",
          "finalAnswer": "${total}",
          "solutionSteps": "${tens} tens is ${tens * 10}. ${extraOnes} ones is ${extraOnes}. ${tens * 10} + ${extraOnes} = ${total}."
        },
        "visualEngine": { 
          "componentToRender": "NONE", 
          "componentData": {} 
        },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "advanced_regrouping", hideVisual: true }
    };
  }

  // 6. Logic Puzzle Clues
  if (activeVariant === 'advanced_clues') {
    const tensDigit = Math.floor(Math.random() * 4) + 5; // 5 to 8
    const onesDigit = Math.floor(Math.random() * 8) + 1; // 1 to 8
    const total = (tensDigit * 10) + onesDigit;

    const lowerBound = (tensDigit * 10);
    const upperBound = (tensDigit * 10) + 10;

    const questionTextTemplate = getQText(`What is the number if it is between ${lowerBound} and ${upperBound}, and the ones digit is ${onesDigit}?`, `Mystery number clues: ${lowerBound} < ? < ${upperBound}, ones = ${onesDigit}`);
    const storyInstruction = isShort ? "" : `STRICT: Use the [STORY] placeholder in "questionText" to create a 1-sentence Singaporean math story.`;

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      CRITICAL: This is a text-only question. Do NOT include any "modelData" or legacy keys like "modelVisualizer" or "modelDrawing". No icon rendering is allowed.

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${isMCQ ? JSON.stringify([String(total - 10), String(total), String(total + 1), String(total + 10)]) : 'null'},
          "hint": "Identify the range of numbers first, then look for the one with the correct ones digit.",
          "finalAnswer": "${total}",
          "solutionSteps": "The numbers between ${lowerBound} and ${upperBound} start with ${tensDigit} tens. If the ones digit is ${onesDigit}, the number is ${total}."
        },
        "visualEngine": { 
          "componentToRender": "NONE", 
          "componentData": {} 
        },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "advanced_clues", hideVisual: true }
    };
  }

  // 7. Extreme Regrouping
  if (activeVariant === 'advanced_extreme_regrouping') {
    const tens = Math.floor(Math.random() * 3) + 1; // 1 to 3
    const ones = Math.floor(Math.random() * 20) + 21; // 21 to 40 ones
    const total = (tens * 10) + ones;

    const questionTextTemplate = getQText(`What is the number if I have ${tens} tens and ${ones} ones?`, `${tens} tens ${ones} ones = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Use the [STORY] placeholder in "questionText" to create a 1-sentence Singaporean math story.`;

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      CRITICAL: This is a text-only question. Do NOT include any "modelData" or legacy keys like "modelVisualizer" or "modelDrawing". No icon rendering is allowed.

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${isMCQ ? JSON.stringify([String(tens + ones), String(total - 10), String(total), String(total + 10)]) : 'null'},
          "hint": "Trade your ones for tens whenever you reach ten ones. 10 ones = 1 ten.",
          "finalAnswer": "${total}",
          "solutionSteps": "${tens} ten is ${tens * 10}. ${tens * 10} + ${ones} = ${total}."
        },
        "visualEngine": { 
          "componentToRender": "NONE", 
          "componentData": {} 
        },
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

    const questionTextTemplate = getQText(`What is the 2-digit number if its tens digit is ${tensDigit} and the sum of its digits is ${sum}?`, `Tens=${tensDigit}, Sum=${sum} -> ?`);
    const storyInstruction = isShort ? "" : `STRICT: Use the [STORY] placeholder in "questionText" to create a 1-sentence Singaporean math story.`;

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      CRITICAL: This is a text-only question. Do NOT include any "modelData" or legacy keys like "modelVisualizer" or "modelDrawing". No icon rendering is allowed.

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${isMCQ ? JSON.stringify([String(total - 10), String((onesDigit * 10) + tensDigit), String(total), String(total + 1)]) : 'null'},
          "hint": "Add the tens digit and a mystery ones digit to get the sum.",
          "finalAnswer": "${total}",
          "solutionSteps": "Since the tens digit is ${tensDigit}, we need a ones digit that makes the sum ${sum}. ${tensDigit} + ${onesDigit} = ${sum}, so the number is ${total}."
        },
        "visualEngine": { 
          "componentToRender": "NONE", 
          "componentData": {} 
        },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "advanced_digit_sum", hideVisual: true }
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

    const questionTextTemplate = getQText(`What is the number between ${lowerBound} and ${upperBound} if its ones digit is ${diff} more than its tens digit?`, `${lowerBound} < ? < ${upperBound}, ones=tens+${diff} -> ?`);
    const storyInstruction = isShort ? "" : `STRICT: Use the [STORY] placeholder in "questionText" to create a 1-sentence Singaporean math story.`;

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      CRITICAL: This is a text-only question. Do NOT include any "modelData" or legacy keys like "modelVisualizer" or "modelDrawing". No icon rendering is allowed.

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${isMCQ ? JSON.stringify([String(total - diff), String(total), String((onesDigit * 10) + tensDigit), String(total + 10)]) : 'null'},
          "hint": "The digit on the right is larger than the digit on the left.",
          "finalAnswer": "${total}",
          "solutionSteps": "The number is in the ${tensDigit}0s, so the tens digit is ${tensDigit}. The ones digit is ${tensDigit} + ${diff} = ${onesDigit}. The number is ${total}."
        },
        "visualEngine": { 
          "componentToRender": "NONE", 
          "componentData": {} 
        },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "advanced_digit_difference", hideVisual: true }
    };
  }

  // 10. Comparison Puzzle
  if (activeVariant === 'advanced_comparison_puzzle') {
    const tensDigit = Math.floor(Math.random() * 4) + 5; // 5 to 8
    const onesDigit = Math.floor(Math.random() * 3) + 3; // 3 to 5
    const total = (tensDigit * 10) + onesDigit;
    const lower = total - Math.floor(Math.random() * 2) - 1;
    const upper = total + Math.floor(Math.random() * 3) + 1;

    const questionTextTemplate = getQText(`What is the number between ${lower} and ${upper} that has a ${onesDigit} in its ones place?`, `${lower} < ? < ${upper}, ones=${onesDigit} -> ?`);
    const storyInstruction = isShort ? "" : `STRICT: Use the [STORY] placeholder in "questionText" to create a 1-sentence Singaporean math story.`;

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      CRITICAL: This is a text-only question. Do NOT include any "modelData" or legacy keys like "modelVisualizer" or "modelDrawing". No icon rendering is allowed.

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${isMCQ ? JSON.stringify([String(lower - 1), String(total - 10), String(total), String(upper + 1)]) : 'null'},
          "hint": "Check which number in the given range ends with the target digit.",
          "finalAnswer": "${total}",
          "solutionSteps": "The only number between ${lower} and ${upper} ending in ${onesDigit} is ${total}."
        },
        "visualEngine": { 
          "componentToRender": "NONE", 
          "componentData": {} 
        },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "advanced_comparison_puzzle", hideVisual: true }
    };
  }

  // 11. Word Problem (Boxes and Singles)
  if (activeVariant === 'advanced_word_problem_10s_1s') {
    const boxes = Math.floor(Math.random() * 4) + 2; // 2 to 5 boxes
    const singles = Math.floor(Math.random() * 8) + 11; // 11 to 18 singles
    const total = (boxes * 10) + singles;

    const questionTextTemplate = getQText(`What is the total number if there are ${boxes} boxes of 10 and ${singles} single items?`, `${boxes} groups of 10 + ${singles} = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Use the [STORY] placeholder in "questionText" to create a 1-sentence Singaporean math story.`;

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      CRITICAL: This is a text-only question. Do NOT include any "modelData" or legacy keys like "modelVisualizer" or "modelDrawing". No icon rendering is allowed.

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${isMCQ ? JSON.stringify([String((boxes * 10) + (singles % 10)), String(boxes + singles), String(total), String(total + 10)]) : 'null'},
          "hint": "Total = (number of boxes × 10) + single items.",
          "finalAnswer": "${total}",
          "solutionSteps": "Calculate total from groups of 10 and singles: (${boxes} x 10) + ${singles} = ${total}."
        },
        "visualEngine": { 
          "componentToRender": "NONE", 
          "componentData": {} 
        },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "advanced_word_problem_10s_1s", hideVisual: true }
    };
  }

  // 12. Value of a Digit
  if (activeVariant === 'advanced_value_of_digit') {
    const tens = Math.floor(Math.random() * 5) + 4; // 4 to 8
    const ones = Math.floor(Math.random() * 8) + 1;
    const total = (tens * 10) + ones;
    const answer = String(tens * 10);

    const questionTextTemplate = getQText(`What is the value of the digit ${tens} in the number ${total}?`, `${total}: digit ${tens} value = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Use the [STORY] placeholder in "questionText" to create a 1-sentence Singaporean math story.`;

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      CRITICAL: This is a text-only question. Do NOT include any "modelData" or legacy keys like "modelVisualizer" or "modelDrawing". No icon rendering is allowed.

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${isMCQ ? JSON.stringify([String(tens), String(ones), String(answer), String(total)]) : 'null'},
          "hint": "Place value determines the 'worth' of the digit based on its position.",
          "finalAnswer": "${answer}",
          "solutionSteps": "The digit ${tens} is in the tens place, so it stands for ${tens} tens, which is ${answer}."
        },
        "visualEngine": { 
          "componentToRender": "NONE", 
          "componentData": {} 
        },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 2, logic: "advanced_value_of_digit", hideVisual: true }
    };
  }

  // 13. Sequence Logic
  if (activeVariant === 'advanced_sequence_logic') {
    const start = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const jumps = Math.floor(Math.random() * 3) + 3; // 3 to 5
    const total = start + (10 * jumps);

    const questionTextTemplate = getQText(`What is the number you land on if you start at ${start} and count on by 10s ${jumps} times?`, `${start} + (${jumps} x 10) = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Use the [STORY] placeholder in "questionText" to create a 1-sentence Singaporean math story.`;

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      CRITICAL: This is a text-only question. Do NOT include any "modelData" or legacy keys like "modelVisualizer" or "modelDrawing". No icon rendering is allowed.

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${isMCQ ? JSON.stringify([String(total - 10), String(total), String(total + 1), String(total + 10)]) : 'null'},
          "hint": "Each jump of 10 increases the tens digit by 1.",
          "finalAnswer": "${total}",
          "solutionSteps": "Starting at ${start} and making ${jumps} jumps of 10: ${start + 10}, ${start + 20}... you land on ${total}."
        },
        "visualEngine": { 
          "componentToRender": "NONE", 
          "componentData": {} 
        },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "advanced_sequence_logic", hideVisual: true }
    };
  }

  // 14. Two-Step Missing Sequence
  if (activeVariant === 'advanced_two_step_sequence') {
    const start = Math.floor(Math.random() * 30) + 10;
    const steps = [2, 5, 10];
    const step = steps[Math.floor(Math.random() * steps.length)];
    const seq = [start, start + step, "___", start + (step * 3), "___"];
    const answer = String(start + (step * 4)); // Ensure answer is a string

    const questionTextTemplate = getQText(`Look at this number pattern: ${seq.join(", ")}. What is the SECOND missing number?`, seq.join(", "));
    const storyInstruction = isShort ? "" : `STRICT: Use the [STORY] placeholder in "questionText" to create a 1-sentence Singaporean math story.`;

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      CRITICAL: This is a text-only question. Do NOT include any "modelData" or legacy keys like "modelVisualizer" or "modelDrawing". No icon rendering is allowed.

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${isMCQ ? JSON.stringify([String(parseInt(answer) - step), String(start + (step * 2)), String(answer), String(parseInt(answer) + step)]) : 'null'},
          "hint": "First find the pattern by looking at the first two numbers.",
          "finalAnswer": "${answer}",
          "solutionSteps": "The pattern increases by ${step}. The first missing number is ${start + (step * 2)}. The second missing number is ${start + (step * 3)} + ${step} = ${answer}."
        },
        "visualEngine": { 
          "componentToRender": "NONE", 
          "componentData": {} 
        },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "advanced_two_step_sequence", hideVisual: true }
    };
  }

  throw new Error(`Variant '${activeVariant}' logic block not implemented in advanced.js.`);
}