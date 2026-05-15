import { numberToWords } from '@/lib/utils/math-helpers';
import { getRandomContext } from '@/lib/utils/localization';

export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, displayName, getQText, selectedIcon, hideVisual) {
  const commonMeta = { level, topic, type: zodType, difficulty: zodDiff };
  const inputType = isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT';
  const isShortQ = zodType === 'SHORT_QUESTION';

  const levelNum = parseInt(level.replace('Primary ', ''));
  const readingMandate = levelNum <= 2 
    ? "STRICT READING LEVEL: Use sentences with maximum 10-12 words. Use simple nouns and verbs (Sight Words). No words with more than 2 syllables."
    : (levelNum >= 5 
        ? "ADVANCED READING LEVEL: You may use complex sentences and technical Singaporean context (e.g., GST, interest rates, or logistics). Use a professional, descriptive tone."
        : "");

  // Safety check for localization context
  const itemLabel = displayName;

  // 1. Advanced Addition/Subtraction Regrouping
  if (activeVariant === 'advanced_add_regrouping' || activeVariant === 'advanced_sub_regrouping') {
    const isAdd = activeVariant.includes('add');
    let num1, num2, answer;

    if (isAdd) {
      num1 = Math.floor(Math.random() * 30) + 18; // e.g. 25
      num2 = Math.floor(Math.random() * 9) + 6;  // e.g. 7 (forces regrouping)
      answer = String(num1 + num2);
    } else {
      num1 = Math.floor(Math.random() * 40) + 42; // e.g. 52
      num2 = Math.floor(Math.random() * 9) + (num1 % 10) + 1; // e.g. if num1 ends in 2, num2 could be 3-9 to force regrouping
      answer = String(num1 - num2);
    }

    const operator = isAdd ? '+' : '-';
    const options = isMCQ ? [answer, String(parseInt(answer) - 1), String(parseInt(answer) + 10), String(num1 + 2)].sort(() => Math.random() - 0.5) : null;

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] How many items does ${context.name} have ${isAdd ? 'now' : 'left'}?`, `${num1} ${operator} ${num2} = ?`),
        hint: "[AI: INJECT HINT]",
        options: options,
        finalAnswer: answer,
        solutionSteps: isAdd 
          ? `First, add the ones: ${num1 % 10} + ${num2 % 10} = ${(num1 % 10) + (num2 % 10)}. Regroup 10 ones into 1 ten. Then add the tens. Total is ${answer}.`
          : `Since we cannot subtract ${num2 % 10} from ${num1 % 10}, regroup 1 ten from ${Math.floor(num1 / 10)} tens as 10 ones. Now subtract the ones: ${num1 % 10 + 10} - ${num2 % 10} = ${num1 % 10 + 10 - num2 % 10}. Then subtract the remaining tens. Answer is ${answer}.`
      },
      visualEngine: {
        componentToRender: isShortQ ? "NUMBER_CARDS" : "NONE",
        componentData: { items: [String(num1), operator, String(num2)], hideVisual: isShortQ }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate ? readingMandate + '\n' : ''}STRICT: Return ONLY valid JSON.
      Task: 
      1. Replace the "[STORY]" placeholder in the questionText with a 1-sentence Singaporean story.
      2. In the "hint" field, provide a conceptual clue about regrouping (tens and ones).
      ${isShortQ 
        ? `3. DO NOT add a story for Short Questions.\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
        : `3. The story MUST be localized.\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
      }`,
      metadata: { 
        difficulty: 'advanced', 
        steps: 3, 
        logic: isAdd ? "add_regroup" : "sub_regroup", 
        hideVisual: isShortQ 
      }
    };
  }

  // 2. Advanced Comparative More
  if (activeVariant === 'advanced_comparative_more') {
    const num1 = Math.floor(Math.random() * 30) + 20; // Base number
    const num2 = Math.floor(Math.random() * 20) + 10; // "More than" value
    const answer = String(num1 + num2);
    
    const options = isMCQ ? [answer, String(num1 - num2), String(num1 + 10), String(num1)].sort(() => Math.random() - 0.5) : null;

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] How many items does the second person have?`, `What is ${num2} more than ${num1}?`),
        hint: "[AI: INJECT HINT]",
        options: options,
        finalAnswer: answer,
        solutionSteps: `To find "more than", we add the numbers: ${num1} + ${num2} = ${answer}.`
      },
      visualEngine: { 
        componentToRender: "NONE", 
        componentData: { hideVisual: true } 
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate ? readingMandate + '\n' : ''}STRICT: Return ONLY valid JSON.
      Task: 
      1. Replace the "[STORY]" placeholder in the questionText with a 1-sentence Singaporean story.
      2. In the "hint" field, provide a conceptual clue about finding "more than".
      ${isShortQ 
        ? `3. DO NOT add a story for Short Questions.\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
        : `3. The story MUST be localized.\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
      }`,
      metadata: { 
        difficulty: 'advanced', 
        steps: 3, 
        logic: "comparative_more", 
        hideVisual: true 
      }
    };
  }

  // 3. Advanced Comparative Less
  if (activeVariant === 'advanced_comparative_less') {
    const num1 = Math.floor(Math.random() * 30) + 50; // Base number
    const num2 = Math.floor(Math.random() * 20) + 5; // "Less than" value
    const answer = String(num1 - num2);
    
    const options = isMCQ ? [answer, String(num1 + num2), String(num1 - 10), String(num1)].sort(() => Math.random() - 0.5) : null;

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] How many items does the second person have?`, `What is ${num2} less than ${num1}?`),
        hint: "[AI: INJECT HINT]",
        options: options,
        finalAnswer: answer,
        solutionSteps: `To find "less than", we subtract: ${num1} - ${num2} = ${answer}.`
      },
      visualEngine: { 
        componentToRender: "NONE", 
        componentData: { hideVisual: true } 
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate ? readingMandate + '\n' : ''}STRICT: Return ONLY valid JSON.
      Task: 
      1. Replace the "[STORY]" placeholder in the questionText with a 1-sentence Singaporean story.
      2. In the "hint" field, provide a conceptual clue about finding "less than".
      ${isShortQ 
        ? `3. DO NOT add a story for Short Questions.\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
        : `3. The story MUST be localized.\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
      }`,
      metadata: { 
        difficulty: 'advanced', 
        steps: 3, 
        logic: "comparative_less", 
        hideVisual: true 
      }
    };
  }

  // 4. Advanced Cross Ordinal Queue
  if (activeVariant === 'advanced_cross_ordinal_queue') {
    const inFront = Math.floor(Math.random() * 10) + 10; // People in front
    const behind = Math.floor(Math.random() * 10) + 5; // People behind
    const answer = String(inFront + behind + 1); // Total people = in front + person + behind
    
    const options = isMCQ ? [answer, String(inFront + behind), String(inFront + behind - 1), String(inFront + 1)].sort(() => Math.random() - 0.5) : null;

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] How many people are there in the queue altogether?`, `There are ${inFront} people in front of ${context.name} and ${behind} people behind. How many people are in the queue?`),
        hint: "[AI: INJECT HINT]",
        options: options,
        finalAnswer: answer,
        solutionSteps: `Add the people in front (${inFront}), the person themselves (1), and the people behind (${behind}): ${inFront} + 1 + ${behind} = ${answer}.`
      },
      visualEngine: {
        componentToRender: isShortQ ? "NONE" : "ORDINAL_LINE", // Ordinal line visual for word problems
        componentData: { position: inFront, total: parseInt(answer), hideVisual: isShortQ } // Pass position and total for visual
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate ? readingMandate + '\n' : ''}STRICT: Return ONLY valid JSON.
      Task: 
      1. Replace the "[STORY]" placeholder in the questionText with a 1-sentence Singaporean story.
      2. In the "hint" field, provide a conceptual clue about counting positions in a queue.
      ${isShortQ 
        ? `3. DO NOT add a story for Short Questions.\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
        : `3. The story MUST be localized.\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
      }`,
      metadata: { 
        difficulty: 'advanced', 
        steps: 3, 
        logic: "cross_ordinal_queue", 
        hideVisual: isShortQ 
      }
    };
  }

  // 6. Balance Equations
  if (activeVariant === 'advanced_balance_equations') {
    const left1 = Math.floor(Math.random() * 15) + 10;
    const left2 = Math.floor(Math.random() * 10) + 5;
    const sum = left1 + left2;
    const right1 = Math.floor(Math.random() * 10) + sum - 15; // Ensure right1 is smaller than sum
    const answer = String(sum - right1);

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] How many more must be added to the second group to make them equal?`, `${left1} + ${left2} = ${right1} + ?`),
        hint: "[AI: INJECT HINT]",
        options: isMCQ ? [answer, String(sum), String(parseInt(answer) + 10), String(parseInt(answer) - 2)].sort(() => Math.random() - 0.5) : null,
        finalAnswer: answer,
        solutionSteps: `${left1} + ${left2} = ${sum}. To make the other side equal ${sum}, we subtract: ${sum} - ${right1} = ${answer}.`
      },
      visualEngine: {
        componentToRender: "NONE",
        componentData: { hideVisual: true }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate ? readingMandate + '\n' : ''}STRICT: Return ONLY valid JSON.
      Task: 
      1. Replace the "[STORY]" placeholder in the questionText with a 1-sentence Singaporean story.
      2. In the "hint" field, provide a conceptual clue about making both sides of an equation equal.
      ${isShortQ 
        ? `3. DO NOT add a story for Short Questions.\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
        : `3. The story MUST be localized.\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
      }`,
      metadata: { difficulty: 'advanced', logic: "balance_eq", hideVisual: true }
    };
  }

  // 7. Working Backwards Heuristic
  if (activeVariant === 'advanced_working_backwards') {
    const start = Math.floor(Math.random() * 20) + 20; 
    const change1 = Math.floor(Math.random() * 10) + 5; // e.g., gave away 8
    const change2 = Math.floor(Math.random() * 10) + 2; // e.g., got 4
    const finalAmount = start - change1 + change2;
    const answer = String(start);

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] How many did ${context.name} have at first?`, `? - ${change1} + ${change2} = ${finalAmount}. Find the starting number.`),
        hint: "[AI: INJECT HINT]",
        options: isMCQ ? [answer, String(finalAmount + change1 + change2), String(finalAmount), String(start - 10)].sort(() => Math.random() - 0.5) : null,
        finalAnswer: answer,
        solutionSteps: `Work backwards from ${finalAmount}. Instead of adding ${change2}, subtract it: ${finalAmount} - ${change2} = ${finalAmount - change2}. Instead of subtracting ${change1}, add it: ${finalAmount - change2} + ${change1} = ${answer}.`
      },
      visualEngine: {
        componentToRender: "NONE",
        componentData: { hideVisual: true }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate ? readingMandate + '\n' : ''}STRICT: Return ONLY valid JSON.
      Task: 
      1. Replace the "[STORY]" placeholder in the questionText with a Singaporean word problem.
      2. In the "hint" field, provide a conceptual clue about working backwards using opposite operations.
      ${isShortQ 
        ? `3. DO NOT add a story for Short Questions.\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
        : `3. The story MUST be localized.\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
      }`,
      metadata: { difficulty: 'advanced', logic: "working_backwards", hideVisual: true }
    };
  }

  // 8. Two-Step Total (Comparative + Sum)
  if (activeVariant === 'advanced_two_step_total') {
    const aAmount = Math.floor(Math.random() * 20) + 15;
    const diff = Math.floor(Math.random() * 10) + 3;
    const bAmount = aAmount + diff; // B has 'diff' more than A
    const total = aAmount + bAmount;
    const answer = String(total);

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] How many do they have altogether?`, `Amount A = ${aAmount}. Amount B is ${diff} more than A. What is A + B?`),
        hint: "[AI: INJECT HINT]",
        options: isMCQ ? [answer, String(bAmount), String(total + 10), String(aAmount + diff)].sort(() => Math.random() - 0.5) : null,
        finalAnswer: answer,
        solutionSteps: `First, find how many the second person has: ${aAmount} + ${diff} = ${bAmount}. Then, find the total: ${aAmount} + ${bAmount} = ${answer}.`
      },
      visualEngine: {
        componentToRender: isShortQ ? "NONE" : "COUNTING_OBJECTS",
        componentData: { items: [String(aAmount), String(bAmount)], operator: "+", hideVisual: isShortQ }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate ? readingMandate + '\n' : ''}STRICT: Return ONLY valid JSON.
      Task: 
      1. Replace the "[STORY]" placeholder in the questionText with a Singaporean story.
      2. In the "hint" field, provide a conceptual clue about solving a two-step problem.
      ${isShortQ 
        ? `3. DO NOT add a story for Short Questions.\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
        : `3. The story MUST be localized.\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
      }`,
      metadata: { difficulty: 'advanced', logic: "two_step_total", hideVisual: isShortQ }
    };
  }

  // 9. Shape Substitution
  if (activeVariant === 'advanced_shape_substitution') {
    const shape1Val = Math.floor(Math.random() * 8) + 4; // 4 to 11
    const shape2Val = Math.floor(Math.random() * 9) + 2; 
    const eq1Sum = shape1Val * 2;
    const eq2Sum = shape1Val + shape2Val;
    const answer = String(shape2Val);

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] Find the value of the circle.`, `▲ + ▲ = ${eq1Sum}. ▲ + ● = ${eq2Sum}. What is ●?`),
        hint: "[AI: INJECT HINT]",
        options: isMCQ ? [answer, String(shape1Val), String(eq2Sum), String(shape2Val + 2)].sort(() => Math.random() - 0.5) : null,
        finalAnswer: answer,
        solutionSteps: `▲ + ▲ = ${eq1Sum}, so ▲ is ${shape1Val}. Substitute into the second equation: ${shape1Val} + ● = ${eq2Sum}. Therefore, ● = ${eq2Sum} - ${shape1Val} = ${answer}.`
      },
      visualEngine: {
        componentToRender: "SHAPE",
        componentData: { 
          puzzle: [
            { items: ["triangle", "triangle"], sum: eq1Sum },
            { items: ["triangle", "circle"], sum: eq2Sum }
          ],
          hideVisual: false 
        }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate ? readingMandate + '\n' : ''}STRICT: Return ONLY valid JSON.
      Task: 
      1. Replace the "[STORY]" placeholder in the questionText with a story about shapes.
      2. In the "hint" field, provide a conceptual clue about finding the value of one shape first.
      ${isShortQ 
        ? `3. DO NOT add a story for Short Questions.\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
        : `3. The story MUST be localized.\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
      }`,
      metadata: { difficulty: 'advanced', logic: "shape_substitution", hideVisual: false }
    };
  }

  // 10. Missing Digit Regrouping
  if (activeVariant === 'advanced_missing_digit_regrouping') {
    const tens1 = Math.floor(Math.random() * 3) + 2; // 2, 3, 4
    const ones1 = Math.floor(Math.random() * 4) + 6; // 6-9 (to force regrouping)
    const num2 = Math.floor(Math.random() * 8) + 14; 
    const sum = (tens1 * 10 + ones1) + num2;
    const answer = String(ones1);

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] The sum is ${sum}. What is the missing digit in the first number?`, `${tens1}? + ${num2} = ${sum}.`),
        hint: "[AI: INJECT HINT]",
        options: isMCQ ? [answer, String(ones1 - 1), String(tens1), "1"].sort(() => Math.random() - 0.5) : null,
        finalAnswer: answer,
        solutionSteps: `To find the whole first number, do ${sum} - ${num2} = ${tens1 * 10 + ones1}. The missing ones digit is ${answer}.`
      },
      visualEngine: {
        componentToRender: "NUMBER_CARDS",
        componentData: { items: [`${tens1}?`, "+", String(num2), "=", String(sum)], hideVisual: false }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate ? readingMandate + '\n' : ''}STRICT: Return ONLY valid JSON.
      Task: 
      1. Replace the "[STORY]" placeholder in the questionText with a story about a missing digit (e.g., an ink blot).
      2. In the "hint" field, provide a conceptual clue about finding the total value of the missing-digit number first.
      ${isShortQ 
        ? `3. DO NOT add a story for Short Questions.\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
        : `3. The story MUST be localized.\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
      }`,
      metadata: { difficulty: 'advanced', logic: "missing_digit", hideVisual: false }
    };
  }
}