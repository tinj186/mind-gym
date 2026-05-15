import { numberToWords } from '@/lib/utils/math-helpers';
import { getRandomContext } from '@/lib/utils/localization';

const ORDINAL_WORDS = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"];
const ORDINAL_SYMBOLS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];

// Robust extraction helper for localized context objects
const extract = (val) => {
  if (typeof val !== 'object' || val === null) return String(val);
  return val.item || val.singular || val.name?.singular || val.text || val.val || String(val);
};

export const advancedVariants = {
  advanced_container: (config, type, getQText, isShort) => {
    const numContainers = 4;
    const context = getRandomContext('GENERAL');
    const emojiIcons = ['🍎', '🍪', '🍬', '🥚', '🍊', '🧁', '🍩', '🥯', '🎾', '⚽', '⭐'];
    const icon = emojiIcons[Math.floor(Math.random() * emojiIcons.length)];
    
    let idx1 = Math.floor(Math.random() * numContainers);
    let idx2;
    do { idx2 = Math.floor(Math.random() * numContainers); } while (idx1 === idx2);
    
    const sortedIndices = [idx1, idx2].sort((a, b) => a - b);
    const target1 = ORDINAL_SYMBOLS[sortedIndices[0]];
    const target2 = ORDINAL_SYMBOLS[sortedIndices[1]];

    const count1 = Math.floor(Math.random() * 4) + 2; 
    const count2 = Math.floor(Math.random() * 4) + 2; 
    const total = count1 + count2;
    const sName = extract(context.name);

    const visualProtocol = `\nSTRICT VISUAL PROTOCOL: For the "visualItems" array, you MUST use the exact pre-calculated array provided in the JSON template below. DO NOT modify the brackets or count.`;

    // Pre-calculate the visual strings to lock the visualEngine
    const visualItems = Array(numContainers).fill('').map((_, i) => {
      if (i === sortedIndices[0]) return "[ " + icon.repeat(count1) + " ]";
      if (i === sortedIndices[1]) return "[ " + icon.repeat(count2) + " ]";
      return "[ " + icon.repeat(Math.floor(Math.random() * 3) + 1) + " ]";
    });

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating an advanced_container question. DO NOT modify the mathematical structure, the pre-calculated visual items, or the final answer.${visualProtocol}
        
        MATH CONSTRAINTS:
        - Topic: Ordinal Numbers + Addition (Advanced Level)
        - Target 1: ${target1} container has ${count1} ${icon}.
        - Target 2: ${target2} container has ${count2} ${icon}.
        - Question: Find the total number of ${icon} in the ${target1} and ${target2} containers combined.
        - Final Answer MUST strictly be: "${total}"
        
        VISUAL ENGINE LOCK:
        - You MUST use this exact visualItems array: ${JSON.stringify(visualItems)}
        - The visualItems array has been pre-formatted with brackets to show container boundaries. DO NOT remove the brackets.
        
        ${isShort ? "" : `CREATIVE INSTRUCTIONS:
        - Generate an engaging word problem using any fun theme.`}
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        {
          "questionText": ${JSON.stringify(getQText(`How many ${icon} are there in the ${target1} and ${target2} containers altogether?`, `Total items in ${target1} and ${target2} containers combined = ?`))},
          "options": ${type === 'MCQ' ? JSON.stringify([String(total - 1), String(total), String(total + 1), String(total + 2)]) : 'null'},
          "hint": ${JSON.stringify(getQText(`Identify how many items are in each of the two containers mentioned and add them together.`, `Add the quantities in the ${target1} and ${target2} spots.`))},
          "visualItems": ${JSON.stringify(visualItems)},
          "modelData": { "logic": "container_addition" },
          "finalAnswer": "${total}",
          "solutionSteps": ${JSON.stringify(getQText(`The ${target1} container has ${count1} and the ${target2} container has ${count2}. ${count1} + ${count2} = ${total}.`, `${count1} + ${count2} = ${total}`))}
        }`,
      metadata: { difficulty: 'advanced', steps: 3, integratedTopics: ['Ordinals', 'Addition'], logic: "container_addition", hideVisual: false }
    };
  },

  advanced_comparison: (config, type, getQText, isShort) => {
    const startPos = Math.floor(Math.random() * 3) + 1; 
    const gap = Math.floor(Math.random() * 3) + 2; 
    const targetPos = startPos + gap;
    const answer = ORDINAL_SYMBOLS[targetPos - 1];
    const context = getRandomContext('GENERAL');
    const sName = extract(context.name);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating an advanced_comparison question. DO NOT modify the mathematical structure or the final answer.
          
        MATH CONSTRAINTS:
        - Character A: ${ORDINAL_SYMBOLS[startPos - 1]}
        - Character B: ${gap} positions behind Character A.
        - Final Answer MUST strictly be: "${answer}"
          
        ${isShort ? "" : `CREATIVE INSTRUCTIONS:
        - Generate an engaging word problem using any fun theme.`}
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        {
          "questionText": ${JSON.stringify(getQText(`${sName} is ${ORDINAL_SYMBOLS[startPos - 1]} in a line. A friend is ${gap} positions behind. What is the friend's position?`, `Position: ${ORDINAL_SYMBOLS[startPos - 1]}. Friend is ${gap} positions behind. Friend's position = ?`))},
          "options": ${type === 'MCQ' ? JSON.stringify([ORDINAL_SYMBOLS[targetPos - 2], answer, ORDINAL_SYMBOLS[targetPos], ORDINAL_SYMBOLS[targetPos + 1]]) : 'null'},
          "hint": ${JSON.stringify(getQText(`If someone is "behind" you in a line, will their position number be smaller or larger than yours?`, `Behind someone means adding to their position number.`))},
          "visualItems": [],
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`${startPos} + ${gap} = ${targetPos}. The position is ${answer}.`, `${startPos} + ${gap} = ${targetPos}`))}
        }`,
      metadata: { difficulty: 'advanced', steps: 2, integratedTopics: ['Ordinals', 'Comparison'], logic: "relative_offset", hideVisual: true }
    };
  },

  advanced_bidirectional_total: (config, type, getQText, isShort) => {
    const leftPos = Math.floor(Math.random() * 4) + 2; 
    const rightPos = Math.floor(Math.random() * 4) + 2; 
    const total = leftPos + rightPos - 1;
    const answer = String(total);
    const context = getRandomContext('GENERAL');

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating an advanced_bidirectional_total question.
        MATH CONSTRAINTS:
        - Left Position: ${ORDINAL_WORDS[leftPos - 1]}
        - Right Position: ${ORDINAL_WORDS[rightPos - 1]}
        - Final Answer MUST be: "${answer}"
        
        ${isShort ? "" : `CREATIVE INSTRUCTIONS:
        - Generate an engaging word problem using any fun theme.`}
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        { 
          "questionText": ${JSON.stringify(getQText(`An item is ${ORDINAL_WORDS[leftPos - 1]} from the left and ${ORDINAL_WORDS[rightPos - 1]} from the right. How many items are there in total?`, `An item is ${ORDINAL_SYMBOLS[leftPos - 1]} from the left and ${ORDINAL_SYMBOLS[rightPos - 1]} from the right. Total items = ?`))}, 
          "options": ${type === 'MCQ' ? JSON.stringify([String(total - 2), String(total - 1), answer, String(total + 1)]) : 'null'}, 
          "hint": ${JSON.stringify(getQText(`Think about how many items are to the left and right of the target item. Don't forget that you are counting the target item twice if you just add the numbers!`, `Total = Left + Right - 1.`))},
          "visualItems": [], 
          "finalAnswer": "${answer}", 
          "solutionSteps": ${JSON.stringify(getQText(`${leftPos} + ${rightPos} - 1 = ${total}.`, `${leftPos} + ${rightPos} - 1 = ${total}`))}
        }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "bidirectional_total", hideVisual: true }
    };
  },

  advanced_multiple_leaves: (config, type, getQText, isShort) => {
    const startPos = Math.floor(Math.random() * 4) + 6; 
    const leaves = Math.floor(Math.random() * 3) + 2; 
    const newPos = startPos - leaves;
    const answer = ORDINAL_WORDS[newPos - 1];
    const context = getRandomContext('GENERAL');
    const sName = extract(context.name);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating an advanced_multiple_leaves question.
        MATH CONSTRAINTS:
        - Initial: ${ORDINAL_WORDS[startPos - 1]}
        - Event: ${leaves} characters ahead leave the queue.
        - Final Answer MUST be: "${answer}"
        
        ${isShort ? "" : `CREATIVE INSTRUCTIONS:
        - Generate an engaging word problem using any fun theme.`}
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        { 
          "questionText": ${JSON.stringify(getQText(`${sName} is ${ORDINAL_WORDS[startPos - 1]} in line. If ${leaves} people ahead of ${sName} leave, what is ${sName}'s new position?`, `Position: ${ORDINAL_SYMBOLS[startPos - 1]}. ${leaves} people ahead leave. New position = ?`))}, 
          "options": ${type === 'MCQ' ? JSON.stringify([ORDINAL_WORDS[newPos - 2], answer, ORDINAL_WORDS[newPos], ORDINAL_WORDS[startPos - 1]]) : 'null'}, 
          "hint": ${JSON.stringify(getQText(`If people in front of you leave, does your position move closer to the front or further away?`, `Leaving from the front makes your number smaller.`))},
          "visualItems": [], 
          "finalAnswer": "${answer}", 
          "solutionSteps": ${JSON.stringify(getQText(`${startPos} - ${leaves} = ${newPos}. The new position is ${answer}.`, `${startPos} - ${leaves} = ${newPos}`))}
        }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "multiple_subtractions", hideVisual: true }
    };
  },

  advanced_shift_position: (config, type, getQText, isShort) => {
    const startPos = Math.floor(Math.random() * 4) + 6; 
    const shift = Math.floor(Math.random() * 3) + 2; 
    const newPos = startPos - shift;
    const answer = ORDINAL_WORDS[newPos - 1];

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating an advanced_shift_position question.
        MATH CONSTRAINTS:
        - Start: ${ORDINAL_WORDS[startPos - 1]}
        - Shift: moves forward by ${shift} places.
        - Final Answer: "${answer}"
        
        ${isShort ? "" : `CREATIVE INSTRUCTIONS:
        - Generate an engaging word problem using any fun theme.`}
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        { 
          "questionText": ${JSON.stringify(getQText(`A runner is in the ${ORDINAL_WORDS[startPos - 1]} position and moves forward by ${shift} places. What is the new position?`, `Position: ${ORDINAL_SYMBOLS[startPos - 1]}. Move forward ${shift} places. New position = ?`))}, 
          "options": ${type === 'MCQ' ? JSON.stringify([ORDINAL_WORDS[newPos - 2], answer, ORDINAL_WORDS[newPos], ORDINAL_WORDS[startPos - 1]]) : 'null'}, 
          "hint": ${JSON.stringify(getQText(`Moving forward means you are getting closer to the first place.`, `Forward = Subtract from current position.`))},
          "visualItems": [], 
          "finalAnswer": "${answer}", 
          "solutionSteps": ${JSON.stringify(getQText(`${startPos} - ${shift} = ${newPos}.`, `${startPos} - ${shift} = ${newPos}`))}
        }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "forward_shift", hideVisual: true }
    };
  },

  advanced_gap_calculation: (config, type, getQText, isShort) => {
    const posA = Math.floor(Math.random() * 3) + 1; 
    const posB = posA + Math.floor(Math.random() * 4) + 3; 
    const gap = posB - posA - 1;
    const answer = String(gap);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating an advanced_gap_calculation question.
        MATH CONSTRAINTS:
        - Position A: ${ORDINAL_WORDS[posA - 1]}
        - Position B: ${ORDINAL_WORDS[posB - 1]}
        - Question: How many items are BETWEEN them?
        - Final Answer MUST be: "${answer}"
        
        ${isShort ? "" : `CREATIVE INSTRUCTIONS:
        - Generate an engaging word problem using any fun theme.`}
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        { 
          "questionText": ${JSON.stringify(getQText(`How many people are there between the ${ORDINAL_WORDS[posA - 1]} and ${ORDINAL_WORDS[posB - 1]} person in a row?`, `How many people are between the ${ORDINAL_SYMBOLS[posA - 1]} and ${ORDINAL_SYMBOLS[posB - 1]} positions?`))}, 
          "options": ${type === 'MCQ' ? JSON.stringify([String(gap - 1), answer, String(gap + 1), String(gap + 2)]) : 'null'}, 
          "hint": ${JSON.stringify(getQText(`Think about the numbers that come after ${ORDINAL_SYMBOLS[posA - 1]} but before ${ORDINAL_SYMBOLS[posB - 1]}.`, `Difference between positions minus 1.`))},
          "visualItems": [], 
          "finalAnswer": "${answer}", 
          "solutionSteps": ${JSON.stringify(getQText(`${posB} - ${posA} - 1 = ${gap}.`, `${posB} - ${posA} - 1 = ${gap}`))}
        }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "gap_calculation", hideVisual: true }
    };
  },

  advanced_overtake_race: (config, type, getQText, isShort) => {
    const startPos = Math.floor(Math.random() * 4) + 4; 
    const overtakeCount = Math.floor(Math.random() * 2) + 1; 
    const newPos = startPos - overtakeCount;
    const answer = ORDINAL_WORDS[newPos - 1];

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating an advanced_overtake_race question.
        MATH CONSTRAINTS:
        - Start: ${ORDINAL_WORDS[startPos - 1]}
        - Overtakes: ${overtakeCount} runners.
        - Final Answer: "${answer}"
        
        ${isShort ? "" : `CREATIVE INSTRUCTIONS:
        - Generate an engaging word problem using any fun theme.`}
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        { 
          "questionText": ${JSON.stringify(getQText(`A runner is in the ${ORDINAL_WORDS[startPos - 1]} position. After overtaking ${overtakeCount} runners, what is the new position?`, `Position: ${ORDINAL_SYMBOLS[startPos - 1]}. Overtake ${overtakeCount} runners. New position = ?`))}, 
          "options": ${type === 'MCQ' ? JSON.stringify([ORDINAL_WORDS[newPos - 2], answer, ORDINAL_WORDS[newPos], ORDINAL_WORDS[startPos - 1]]) : 'null'}, 
          "hint": ${JSON.stringify(getQText(`Overtaking someone means you move one spot ahead of them.`, `Overtake = Subtract from current position.`))},
          "visualItems": [], 
          "finalAnswer": "${answer}", 
          "solutionSteps": ${JSON.stringify(getQText(`${startPos} - ${overtakeCount} = ${newPos}.`, `${startPos} - ${overtakeCount} = ${newPos}`))}
        }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "overtake_logic", hideVisual: true }
    };
  },

  advanced_ordinal_clues: (config, type, getQText, isShort) => {
    const posA = Math.floor(Math.random() * 4) + 1; 
    const posB = posA + 1;
    const posC = posB + 1;
    const answer = ORDINAL_WORDS[posC - 1];

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating an advanced_ordinal_clues question.
        MATH CONSTRAINTS:
        - Clue 1: Person A is ${ORDINAL_WORDS[posA - 1]}.
        - Clue 2: Person B is just behind Person A.
        - Clue 3: Person C is just behind Person B.
        - Final Answer: "${answer}"
        
        ${isShort ? "" : `CREATIVE INSTRUCTIONS:
        - Generate an engaging word problem using any fun theme.`}
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        { 
          "questionText": ${JSON.stringify(getQText(`If Siti is ${ORDINAL_WORDS[posA - 1]}, and Aminah is just behind her, and Bala is just behind Aminah, what position is Bala in?`, `Siti is ${ORDINAL_SYMBOLS[posA - 1]}. Aminah is just behind Siti. Bala is just behind Aminah. Bala's position = ?`))}, 
          "options": ${type === 'MCQ' ? JSON.stringify([ORDINAL_WORDS[posA - 1], ORDINAL_WORDS[posB - 1], answer, ORDINAL_WORDS[posC]]) : 'null'}, 
          "hint": ${JSON.stringify(getQText(`"Just behind" means the very next person in line.`, `Add 1 for every "behind" step.`))},
          "visualItems": [], 
          "finalAnswer": "${answer}", 
          "solutionSteps": ${JSON.stringify(getQText(`Siti is ${posA}. Aminah is ${posB}. Bala is ${posC}, which is ${answer}.`, `${posA} + 1 + 1 = ${posC}`))}
        }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "clue_chain", hideVisual: true }
    };
  },

  advanced_net_queue_change: (config, type, getQText, isShort) => {
    const startPos = Math.floor(Math.random() * 4) + 4; 
    const joins = 2; 
    const leaves = 1; 
    const netChange = joins - leaves; 
    const newPos = startPos + netChange;
    const answer = ORDINAL_WORDS[newPos - 1];

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating an advanced_net_queue_change question.
        MATH CONSTRAINTS:
        - Start: ${ORDINAL_WORDS[startPos - 1]}
        - Event: 2 people join the front, 1 person at the front leaves.
        - Final Answer: "${answer}"
        
        ${isShort ? "" : `CREATIVE INSTRUCTIONS:
        - Generate an engaging word problem using any fun theme.`}
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        { 
          "questionText": ${JSON.stringify(getQText(`Muthu is ${ORDINAL_WORDS[startPos - 1]} in line. If 2 people join the front and 1 person at the very front leaves, what is Muthu's new position?`, `Position: ${ORDINAL_SYMBOLS[startPos - 1]}. 2 people join front, 1 at front leaves. New position = ?`))}, 
          "options": ${type === 'MCQ' ? JSON.stringify([ORDINAL_WORDS[startPos - 2], ORDINAL_WORDS[startPos - 1], answer, ORDINAL_WORDS[newPos]]) : 'null'}, 
          "hint": ${JSON.stringify(getQText(`Work it out step by step: What happens when 2 people join? What happens when 1 person leaves?`, `Initial + Join - Leave.`))},
          "visualItems": [], 
          "finalAnswer": "${answer}", 
          "solutionSteps": ${JSON.stringify(getQText(`Net change is ${joins} - ${leaves} = 1 spot back. ${ORDINAL_WORDS[startPos - 1]} becomes ${answer}.`, `${startPos} + ${joins} - ${leaves} = ${newPos}`))}
        }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "net_queue_change", hideVisual: true }
    };
  },

  advanced_relative_target: (config, type, getQText, isShort) => {
    const targetPos = Math.floor(Math.random() * 3) + 1; 
    const currentPos = targetPos + Math.floor(Math.random() * 4) + 2; 
    const movesNeeded = currentPos - targetPos;
    const answer = String(movesNeeded);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating an advanced_relative_target question.
        MATH CONSTRAINTS:
        - Target: ${ORDINAL_WORDS[targetPos - 1]}
        - Current: ${ORDINAL_WORDS[currentPos - 1]}
        - Final Answer: "${answer}"
        
        ${isShort ? "" : `CREATIVE INSTRUCTIONS:
        - Generate an engaging word problem using any fun theme.`}
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        { 
          "questionText": ${JSON.stringify(getQText(`How many places must a person in the ${ORDINAL_WORDS[currentPos - 1]} position move up to reach the ${ORDINAL_WORDS[targetPos - 1]} position?`, `Move from ${ORDINAL_SYMBOLS[currentPos - 1]} up to ${ORDINAL_SYMBOLS[targetPos - 1]}. Places to move = ?`))}, 
          "options": ${type === 'MCQ' ? JSON.stringify([String(movesNeeded - 1), answer, String(movesNeeded + 1), String(currentPos)]) : 'null'}, 
          "hint": ${JSON.stringify(getQText(`Find the difference between the two positions.`, `Current position - Target position.`))},
          "visualItems": [], 
          "finalAnswer": "${answer}", 
          "solutionSteps": ${JSON.stringify(getQText(`${currentPos} - ${targetPos} = ${movesNeeded}.`, `${currentPos} - ${targetPos} = ${movesNeeded}`))}
        }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "relative_target", hideVisual: true }
    };
  }
};

export const advancedLogic = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
  return advancedVariants[activeVariant](config, type, getQText, isShort);
};