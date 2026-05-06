import { numberToWords } from '@/lib/utils/math-helpers';
import { getRandomContext } from '@/lib/utils/localization';

const ORDINAL_WORDS = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"];
const ORDINAL_SYMBOLS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];

export const standardVariants = {
  standard_reverse: (config, type, getQText, isShort) => {
    const totalItems = Math.floor(Math.random() * 4) + 5; // 5 to 8
    const targetFromFront = Math.floor(Math.random() * (totalItems - 2)) + 2;
    const targetFromBack = totalItems - targetFromFront + 1;
    const frontOrdinal = ORDINAL_SYMBOLS[targetFromFront - 1];
    const backOrdinal = ORDINAL_SYMBOLS[targetFromBack - 1];
    const context = getRandomContext('GENERAL');

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a standard_reverse question. DO NOT modify the mathematical structure or the final answer. You MUST use the name ${context.name} and the item ${context.items[0]} in the setting ${context.setting}.
        
        MATH CONSTRAINTS:
        - Topic: Ordinal Numbers (Standard Level - Reverse Logic)
        - Total items in line: ${totalItems}
        - Condition: ${context.name} is ${frontOrdinal} from the FRONT.
        - Question: What is ${context.name}'s position from the BACK?
        - Final Answer MUST strictly be: "${backOrdinal}"
        
        ${isShort ? "" : `CREATIVE INSTRUCTIONS:
        - Generate a Singapore-themed word problem.
        - The visualItems array MUST contain exactly ${totalItems} UNIQUE emojis representing the people or items in your story. Example: ["👨", "👩", "👧", "👦", "👶"]`}
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        {
          "questionText": ${JSON.stringify(getQText(`In a line of ${totalItems} people, ${context.name} is ${frontOrdinal} from the front. What is ${context.name}'s position from the back?`, `${frontOrdinal} front = ? back`))},
          "options": ${type === 'MCQ' ? JSON.stringify([ORDINAL_SYMBOLS[targetFromBack - 2] || "1st", backOrdinal, ORDINAL_SYMBOLS[targetFromBack], ORDINAL_SYMBOLS[targetFromBack + 1]]) : 'null'},
          "visualItems": ${JSON.stringify(Array.from({ length: totalItems }, (_, i) => `emoji_${i + 1}` ))},
          "modelData": { "direction": "left" },
          "finalAnswer": "${backOrdinal}",
          "solutionSteps": ${JSON.stringify(getQText(`Total items are ${totalItems}. To find the position from the back: (Total - Front Position) + 1. ${totalItems} - ${targetFromFront} + 1 = ${targetFromBack}. The position is ${backOrdinal}.`, `${totalItems} - ${targetFromFront} + 1 = ${targetFromBack}`))}
        }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "reverse_mapping", hideVisual: false }
    };
  },

  standard_change: (config, type, getQText, isShort) => {
    const context = getRandomContext('GENERAL');
    const answer = "3rd";
    const totalItems = Math.floor(Math.random() * 4) + 5; // 5 to 8 items in the queue

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a standard_change question. DO NOT modify the mathematical structure or the final answer. You MUST use the name ${context.name}.
        
        MATH CONSTRAINTS:
        - Topic: Ordinal Numbers (Standard Level - State Change)
        - Initial state: ${context.name} is 4th from the front.
        - Event: 1 person leaves from the VERY FRONT of the line.
        - Question: What is ${context.name}'s NEW position?
        - Final Answer MUST strictly be: "${answer}"
        
        ${isShort ? "" : `CREATIVE INSTRUCTIONS:
        - Generate a Singapore-themed word problem.
        - The visualItems array MUST contain exactly ${totalItems} UNIQUE emojis representing the people in the queue.`}
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        {
          "questionText": ${JSON.stringify(getQText(`${context.name} is 4th in a queue at ${context.setting}. If the person at the very front leaves, what is ${context.name}'s new position?`, "Position: 4th. 1 person at the front leaves. New position = ?"))},
          "options": ${type === 'MCQ' ? '["2nd", "3rd", "4th", "5th"]' : 'null'},
          "visualItems": ${JSON.stringify(Array.from({ length: totalItems }, (_, i) => `emoji_${i + 1}` ))},
          "modelData": { "direction": "left" },
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`${context.name} moves forward by 1 spot because the first person left. 4 - 1 = 3rd.`, "4 - 1 = 3"))}
        }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "state_change", hideVisual: false }
    };
  },

  standard_from_the_right: (config, type, getQText, isShort) => {
    const totalItems = Math.floor(Math.random() * 4) + 5; 
    const targetIndex = Math.floor(Math.random() * totalItems);
    const rightPositionIndex = totalItems - 1 - targetIndex;
    const answer = ORDINAL_WORDS[rightPositionIndex];

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a standard_from_the_right question. DO NOT modify the mathematical structure or the final answer.
        MATH CONSTRAINTS:
        - Topic: Counting from the right
        - Total Items in row: ${totalItems}
        - Final Answer MUST be: "${answer}"
        
        ${isShort ? "" : `CREATIVE INSTRUCTIONS:
        - Generate a Singapore-themed word problem.
        - Generate an array of ${totalItems} UNIQUE emojis matching your theme. The visualItems array MUST contain exactly ${totalItems} unique emojis.`}
        - Ask what position the [target emoji] is in, counting from the RIGHT.
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        { 
          "questionText": ${JSON.stringify(getQText(`Look at the row of items. Counting from the right, what is the position of the [target emoji]?`, "Position from right = ?"))}, 
          "options": ${type === 'MCQ' ? JSON.stringify([ORDINAL_WORDS[Math.max(0, rightPositionIndex - 1)], answer, ORDINAL_WORDS[Math.min(9, rightPositionIndex + 1)], ORDINAL_WORDS[Math.min(9, rightPositionIndex + 2)]]) : 'null'}, 
          "visualItems": ${JSON.stringify(Array.from({ length: totalItems }, (_, i) => `emoji_${i + 1}` ))}, 
          "modelData": { "direction": "right" }, 
          "finalAnswer": "${answer}", 
          "solutionSteps": ${JSON.stringify(getQText(`Counting from the right side, the item is in the ${answer} position.`, `Right position: ${answer}`))}
        }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "reverse_directional", hideVisual: false }
    };
  },

  standard_join_front: (config, type, getQText, isShort) => {
    const startPos = Math.floor(Math.random() * 5) + 2; // 2nd to 6th
    const joinPos = Math.floor(Math.random() * startPos) + 1; // 1 to startPos
    const joinOrdinal = ORDINAL_WORDS[joinPos - 1];
    const newPos = startPos + 1;
    const answer = ORDINAL_WORDS[newPos - 1];
    const context = getRandomContext('GENERAL');
    const eventDesc = joinPos === 1 ? "joins the front of the queue" : `joins the queue at the ${joinOrdinal} position`;

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a standard_join_front question. DO NOT modify the mathematical structure or the final answer. You MUST use the name ${context.name}.
        MATH CONSTRAINTS:
        - Initial Position: ${ORDINAL_WORDS[startPos - 1]}
        - Event: 1 more person ${eventDesc}.
        - Final Answer MUST be: "${answer}"
        
        ${isShort ? "" : `CREATIVE INSTRUCTIONS:
        - Generate a Singapore-themed word problem.
        - The visualItems array MUST contain exactly ${startPos + 2} UNIQUE emojis representing the initial queue.`}
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        { 
          "questionText": ${JSON.stringify(getQText(`${context.name} is ${ORDINAL_WORDS[startPos - 1]} in line. If 1 more person ${eventDesc}, what is ${context.name}'s new position?`, `Position: ${ORDINAL_SYMBOLS[startPos - 1]}. 1 person ${eventDesc}. New position = ?`))}, 
          "options": ${type === 'MCQ' ? JSON.stringify([ORDINAL_WORDS[startPos - 2] || "first", ORDINAL_WORDS[startPos - 1], answer, ORDINAL_WORDS[newPos]]) : 'null'}, 
          "visualItems": ${JSON.stringify(Array.from({ length: startPos + 2 }, (_, i) => `emoji_${i + 1}` ))}, 
          "modelData": { "direction": "left" }, 
          "finalAnswer": "${answer}", 
          "solutionSteps": ${JSON.stringify(getQText(`When someone joins at or before the ${ORDINAL_WORDS[startPos - 1]} position, everyone from that spot onwards moves back 1 spot. ${ORDINAL_WORDS[startPos - 1]} becomes ${answer}.`, `${startPos} + 1 = ${newPos}`))}
        }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "queue_addition", hideVisual: false }
    };
  },

  standard_leave_front: (config, type, getQText, isShort) => {
    const startPos = Math.floor(Math.random() * 5) + 3; // 3rd to 7th
    const leavePos = Math.floor(Math.random() * (startPos - 1)) + 1; // 1 to startPos-1
    const leaveOrdinal = ORDINAL_WORDS[leavePos - 1];
    const newPos = startPos - 1; 
    const answer = ORDINAL_WORDS[newPos - 1];
    const context = getRandomContext('GENERAL');
    const eventDesc = leavePos === 1 ? "at the very front leaves" : `at the ${leaveOrdinal} position leaves`;

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a standard_leave_front question. DO NOT modify the mathematical structure or the final answer. You MUST use the name ${context.name}.
        MATH CONSTRAINTS:
        - Initial Position: ${ORDINAL_WORDS[startPos - 1]}
        - Event: 1 person ${eventDesc}.
        - Final Answer MUST be: "${answer}"
        
        ${isShort ? "" : `CREATIVE INSTRUCTIONS:
        - Generate a Singapore-themed word problem.
        - The visualItems array MUST contain exactly ${startPos + 1} UNIQUE emojis representing the initial queue.`}
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        { 
          "questionText": ${JSON.stringify(getQText(`${context.name} is the ${ORDINAL_WORDS[startPos - 1]} person in line. After the person ${eventDesc}, what position is ${context.name} in?`, `Position: ${ORDINAL_SYMBOLS[startPos - 1]}. Person ${eventDesc}. New position = ?`))}, 
          "options": ${type === 'MCQ' ? JSON.stringify([ORDINAL_WORDS[newPos - 2] || "first", answer, ORDINAL_WORDS[startPos - 1], ORDINAL_WORDS[startPos]]) : 'null'}, 
          "visualItems": ${JSON.stringify(Array.from({ length: startPos + 1 }, (_, i) => `emoji_${i + 1}` ))}, 
          "modelData": { "direction": "left" }, 
          "finalAnswer": "${answer}", 
          "solutionSteps": ${JSON.stringify(getQText(`Since someone in front of ${context.name} left, everyone behind that spot moves up 1 spot. ${ORDINAL_WORDS[startPos - 1]} becomes ${answer}.`, `${startPos} - 1 = ${newPos}`))}
        }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "queue_subtraction", hideVisual: false }
    };
  },

  standard_relative_ahead: (config, type, getQText, isShort) => {
    const basePos = Math.floor(Math.random() * 4) + 5; 
    const stepsAhead = Math.floor(Math.random() * 3) + 2; 
    const targetPos = basePos - stepsAhead;
    const answer = ORDINAL_WORDS[targetPos - 1];
    const context = getRandomContext('GENERAL');

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a standard_relative_ahead question. DO NOT modify the mathematical structure or the final answer. You MUST use the name ${context.name}.
        MATH CONSTRAINTS:
        - Base Position: ${ORDINAL_WORDS[basePos - 1]}
        - Condition: Target is ${stepsAhead} positions ahead of ${context.name}.
        - Final Answer MUST be: "${answer}"
        
        ${isShort ? "" : `CREATIVE INSTRUCTIONS:
        - Generate a Singapore-themed word problem.`}
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        { 
          "questionText": ${JSON.stringify(getQText(`${context.name} is ${ORDINAL_WORDS[basePos - 1]} in a race. Another runner is ${stepsAhead} positions ahead of ${context.name}. What is that runner's position?`, `Position: ${ORDINAL_SYMBOLS[basePos - 1]}. Runner is ${stepsAhead} positions ahead. Runner's position = ?`))}, 
          "options": ${type === 'MCQ' ? JSON.stringify([ORDINAL_WORDS[targetPos - 2] || "first", answer, ORDINAL_WORDS[targetPos], ORDINAL_WORDS[basePos + stepsAhead - 1]]) : 'null'}, 
          "visualItems": [], 
          "finalAnswer": "${answer}", 
          "solutionSteps": ${JSON.stringify(getQText(`${basePos} - ${stepsAhead} = ${targetPos}. The position is ${answer}.`, `${basePos} - ${stepsAhead} = ${targetPos}`))}
        }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "relative_ahead", hideVisual: true }
    };
  },

  standard_relative_behind: (config, type, getQText, isShort) => {
    const basePos = Math.floor(Math.random() * 4) + 2; 
    const stepsBehind = Math.floor(Math.random() * 3) + 2; 
    const targetPos = basePos + stepsBehind;
    const answer = ORDINAL_WORDS[targetPos - 1];
    const context = getRandomContext('GENERAL');

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a standard_relative_behind question. DO NOT modify the mathematical structure or the final answer. You MUST use the name ${context.name}.
        MATH CONSTRAINTS:
        - Base Position: ${ORDINAL_WORDS[basePos - 1]}
        - Condition: Target is ${stepsBehind} positions behind ${context.name}.
        - Final Answer MUST be: "${answer}"
        
        ${isShort ? "" : `CREATIVE INSTRUCTIONS:
        - Generate a Singapore-themed word problem.`}
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        { 
          "questionText": ${JSON.stringify(getQText(`${context.name} is ${ORDINAL_WORDS[basePos - 1]} in a queue. A friend is ${stepsBehind} positions behind ${context.name}. What is the friend's position?`, `Position: ${ORDINAL_SYMBOLS[basePos - 1]}. Friend is ${stepsBehind} positions behind. Friend's position = ?`))}, 
          "options": ${type === 'MCQ' ? JSON.stringify([ORDINAL_WORDS[targetPos - 3], ORDINAL_WORDS[targetPos - 2], answer, ORDINAL_WORDS[targetPos]]) : 'null'}, 
          "visualItems": [], 
          "finalAnswer": "${answer}", 
          "solutionSteps": ${JSON.stringify(getQText(`${basePos} + ${stepsBehind} = ${targetPos}. The position is ${answer}.`, `${basePos} + ${stepsBehind} = ${targetPos}`))}
        }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "relative_behind", hideVisual: true }
    };
  },

  standard_between_positions: (config, type, getQText, isShort) => {
    const startPos = Math.floor(Math.random() * 5) + 1; 
    const endPos = startPos + 2; 
    const targetPos = startPos + 1;
    const answer = ORDINAL_WORDS[targetPos - 1];

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a standard_between_positions question. DO NOT modify the mathematical structure or the final answer.
        MATH CONSTRAINTS:
        - Given positions: ${ORDINAL_WORDS[startPos - 1]} and ${ORDINAL_WORDS[endPos - 1]}.
        - Question: Find the position exactly in between.
        - Final Answer MUST be: "${answer}"
        
        ${isShort ? "" : `CREATIVE INSTRUCTIONS:
        - Generate a Singapore-themed word problem.`}
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        { 
          "questionText": ${JSON.stringify(getQText(`Which ordinal position is exactly between the ${ORDINAL_WORDS[startPos - 1]} and ${ORDINAL_WORDS[endPos - 1]} positions?`, `Find the position exactly between ${ORDINAL_SYMBOLS[startPos - 1]} and ${ORDINAL_SYMBOLS[endPos - 1]}.`))}, 
          "options": ${type === 'MCQ' ? JSON.stringify([ORDINAL_WORDS[startPos - 2] || "zero", ORDINAL_WORDS[startPos - 1], answer, ORDINAL_WORDS[endPos - 1]]) : 'null'}, 
          "visualItems": [], 
          "finalAnswer": "${answer}", 
          "solutionSteps": ${JSON.stringify(getQText(`The number between ${startPos} and ${endPos} is ${targetPos}, which is the ${answer} position.`, `${startPos} < ${targetPos} < ${endPos}`))}
        }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "position_between", hideVisual: true }
    };
  },

  standard_find_total: (config, type, getQText, isShort) => {
    const frontPos = Math.floor(Math.random() * 4) + 2; 
    const backPos = Math.floor(Math.random() * 4) + 2; 
    const total = frontPos + backPos - 1; 
    const answer = String(total);
    const context = getRandomContext('GENERAL');

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a standard_find_total question. DO NOT modify the mathematical structure or the final answer. You MUST use the name ${context.name}.
        MATH CONSTRAINTS:
        - Position from front: ${ORDINAL_WORDS[frontPos - 1]}
        - Position from back: ${ORDINAL_WORDS[backPos - 1]}
        - Final Answer MUST be: "${answer}"
        
        ${isShort ? "" : `CREATIVE INSTRUCTIONS:
        - Generate a Singapore-themed word problem.`}
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        { 
          "questionText": ${JSON.stringify(getQText(`${context.name} is ${ORDINAL_WORDS[frontPos - 1]} from the front and ${ORDINAL_WORDS[backPos - 1]} from the back in a row of students. How many students are there altogether?`, `Position: ${ORDINAL_SYMBOLS[frontPos - 1]} from the front and ${ORDINAL_SYMBOLS[backPos - 1]} from the back. Total students = ?`))}, 
          "options": ${type === 'MCQ' ? JSON.stringify([String(total - 2), String(total - 1), answer, String(total + 1)]) : 'null'}, 
          "visualItems": [], 
          "finalAnswer": "${answer}", 
          "solutionSteps": ${JSON.stringify(getQText(`${frontPos} (front) + ${backPos} (back) - 1 (overlapping person) = ${total}.`, `${frontPos} + ${backPos} - 1 = ${total}`))}
        }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "total_from_ordinals", hideVisual: true }
    };
  },

  standard_swap_positions: (config, type, getQText, isShort) => {
    const posA = Math.floor(Math.random() * 3) + 1; 
    const posB = posA + Math.floor(Math.random() * 4) + 2; 
    const answer = ORDINAL_WORDS[posA - 1];
    const context = getRandomContext('GENERAL');

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a standard_swap_positions question. DO NOT modify the mathematical structure or the final answer.
        MATH CONSTRAINTS:
        - Position A: ${ORDINAL_WORDS[posA - 1]}
        - Position B: ${ORDINAL_WORDS[posB - 1]}
        - Event: Items at these positions swap places.
        - Final Answer MUST be: "${answer}"
        
        ${isShort ? "" : `CREATIVE INSTRUCTIONS:
        - Generate a Singapore-themed word problem.`}
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        { 
          "questionText": ${JSON.stringify(getQText(`Item A is ${ORDINAL_WORDS[posA - 1]} and Item B is ${ORDINAL_WORDS[posB - 1]}. If they swap positions, what is Item B's new position?`, `${ORDINAL_SYMBOLS[posA - 1]} and ${ORDINAL_SYMBOLS[posB - 1]} swap. ${ORDINAL_SYMBOLS[posB - 1]} is now at ? position.`))}, 
          "options": ${type === 'MCQ' ? JSON.stringify([ORDINAL_WORDS[posA - 2] || "zero", answer, ORDINAL_WORDS[posB - 1], ORDINAL_WORDS[posB]]) : 'null'}, 
          "visualItems": [], 
          "finalAnswer": "${answer}", 
          "solutionSteps": ${JSON.stringify(getQText(`Since they swap, Item B takes Item A's original spot, which was ${answer}.`, `Swap spots: ${answer}`))}
        }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "position_swap", hideVisual: true }
    };
  }
};

export const standardLogic = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
  return standardVariants[activeVariant](config, type, getQText, isShort);
};