import { numberToWords } from '@/lib/utils/math-helpers';
import { getRandomContext } from '@/lib/utils/localization';

export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, hideVisual) {
  const commonMeta = { level, topic, type: zodType, difficulty: zodDiff };
  const inputType = isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT';
  const isShortQ = zodType === 'SHORT_QUESTION';

  // Safety check for localization context
  const itemLabel = selectedContextItem?.item || 'items';

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
        questionText: isShortQ ? `${num1} ${operator} ${num2} = ?` : `[STORY] How many items does ${context.name} have ${isAdd ? 'now' : 'left'}?`,
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
      aiPrompt: `STRICT: Return ONLY valid JSON.
      ${isShortQ 
        ? `JSON TEMPLATE:\n${JSON.stringify(promptObject)}`
        : `Task: Replace the "[STORY]" placeholder in the questionText with a 1-sentence Singaporean story about ${context.name} having ${num1} and ${num2} ${itemLabel}. This is a regrouping problem, so use context like collecting items.\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
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
        questionText: isShortQ ? `What is ${num2} more than ${num1}?` : `[STORY] How many items does the second person have?`,
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
      aiPrompt: `STRICT: Return ONLY valid JSON.
      ${isShortQ 
        ? `JSON TEMPLATE:\n${JSON.stringify(promptObject)}`
        : `Task: Replace the "[STORY]" placeholder in the questionText with a 1-sentence Singaporean story where ${context.name} has ${num1} ${itemLabel} and another person has ${num2} more than ${context.name}.\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
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
        questionText: isShortQ ? `What is ${num2} less than ${num1}?` : `[STORY] How many items does the second person have?`,
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
      aiPrompt: `STRICT: Return ONLY valid JSON.
      ${isShortQ 
        ? `JSON TEMPLATE:\n${JSON.stringify(promptObject)}`
        : `Task: Replace the "[STORY]" placeholder in the questionText with a 1-sentence Singaporean story where ${context.name} has ${num1} ${itemLabel} and another person has ${num2} fewer than ${context.name}.\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
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
        questionText: isShortQ ? `There are ${inFront} in front and ${behind} behind. How many total?` : `[STORY] How many people are there in the queue altogether?`,
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
      aiPrompt: `STRICT: Return ONLY valid JSON.
      ${isShortQ 
        ? `JSON TEMPLATE:\n${JSON.stringify(promptObject)}`
        : `Task: Replace the "[STORY]" placeholder in the questionText with a 1-sentence Singaporean story about ${context.name} in a queue with ${inFront} people in front and ${behind} people behind.\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
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
        questionText: isShortQ ? `${left1} + ${left2} = ${right1} + ?` : `[STORY] How many more must be added to the second group to make them equal?`,
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
      aiPrompt: `STRICT: Return ONLY valid JSON.
      ${isShortQ 
        ? `JSON TEMPLATE:\n${JSON.stringify(promptObject)}`
        : `Task: Replace the "[STORY]" placeholder in the questionText with a 1-sentence Singaporean story about balancing two groups: "Group A has ${left1} and ${left2} items. Group B has ${right1} items."\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
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
        questionText: isShortQ ? `? - ${change1} + ${change2} = ${finalAmount}. Find ?.` : `[STORY] How many did ${context.name} have at first?`,
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
      aiPrompt: `STRICT: Return ONLY valid JSON.
      ${isShortQ 
        ? `JSON TEMPLATE:\n${JSON.stringify(promptObject)}`
        : `Task: Replace the "[STORY]" placeholder in the questionText with a Singaporean word problem where ${context.name} had some items, gave away ${change1}, then received ${change2}, and now has ${finalAmount}.\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
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
        questionText: isShortQ ? `A = ${aAmount}. B = A + ${diff}. A + B = ?` : `[STORY] How many do they have altogether?`,
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
      aiPrompt: `STRICT: Return ONLY valid JSON.
      ${isShortQ 
        ? `JSON TEMPLATE:\n${JSON.stringify(promptObject)}`
        : `Task: Replace the "[STORY]" placeholder in the questionText with a Singaporean story: "Person A has ${aAmount} items. Person B has ${diff} MORE items than Person A."\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
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
        questionText: isShortQ ? `▲ + ▲ = ${eq1Sum}. ▲ + ● = ${eq2Sum}. What is ●?` : `[STORY] Find the value of the circle.`,
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
      aiPrompt: `STRICT: Return ONLY valid JSON.
      ${isShortQ 
        ? `JSON TEMPLATE:\n${JSON.stringify(promptObject)}`
        : `Task: Replace the "[STORY]" placeholder in the questionText with a story: "Two triangles add up to ${eq1Sum}. A triangle and a circle add up to ${eq2Sum}."\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
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
        questionText: isShortQ ? `${tens1}? + ${num2} = ${sum}. What is the missing digit?` : `[STORY] The sum is ${sum}. What is the missing digit in the first number?`,
        options: isMCQ ? [answer, String(ones1 - 1), String(tens1), "1"].sort(() => Math.random() - 0.5) : null,
        finalAnswer: answer,
        solutionSteps: `To find the whole first number, do ${sum} - ${num2} = ${tens1 * 10 + ones1}. The missing ones digit is ${answer}.`
      },
      visualEngine: {
        componentToRender: isShortQ ? "NONE" : "NUMBER_CARDS",
        componentData: { items: [`${tens1}?`, "+", String(num2), "=", String(sum)], hideVisual: isShortQ }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `STRICT: Return ONLY valid JSON.
      ${isShortQ 
        ? `JSON TEMPLATE:\n${JSON.stringify(promptObject)}`
        : `Task: Replace the "[STORY]" placeholder in the questionText with a story about an ink blot covering the ones digit of ${tens1 * 10 + ones1} being added to ${num2} to make ${sum}.\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
      }`,
      metadata: { difficulty: 'advanced', logic: "missing_digit", hideVisual: isShortQ }
    };
  }
}