import { numberToWords } from '@/lib/utils/math-helpers';
import { getRandomContext } from '@/lib/utils/localization';
import { ORDINAL_WORDS } from '@/lib/utils/variable-bank';
// using imported ORDINAL_WORDS
const ORDINAL_SYMBOLS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];

// Robust extraction helper for localized context objects
const extract = (val) => {
  if (typeof val !== 'object' || val === null) return String(val);
  return val.item || val.singular || val.name?.singular || val.text || val.val || String(val);
};

export const advancedVariants = {
  advanced_container: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const numContainers = Math.floor(Math.random() * 3) + 3;
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

    const questionTextTemplate = getQText(`How many ${icon} are there in the ${target1} and ${target2} containers altogether?`, `Total items in ${target1} and ${target2} containers combined = ?`);
    const storyInstruction = `STRICT: Replace the "[STORY]" placeholder in "questionText" with a ${isShort ? "short phrase" : "1-sentence Singaporean math story context. Use a local name (e.g. Siti, Muthu, Ali) instead of generic names like Sam"} using the name ${sName}. You MUST NOT leave the "[STORY]" tag in your response.`;

    const items = Array(numContainers).fill(null).map((_, i) => {
      let count;
      if (i === sortedIndices[0]) count = count1;
      else if (i === sortedIndices[1]) count = count2;
      else count = Math.floor(Math.random() * 3) + 1;
      return {
        icon: icon.repeat(count),
        label: `${ORDINAL_SYMBOLS[i]} Bag`
      };
    });

    let options = [String(total - 1), String(total), String(total + 1), String(total + 2)];
    options = [...new Set(options)];
    while(options.length < 4) {
      options.push(String(Math.floor(Math.random() * 15) + 3));
      options = [...new Set(options)];
    }
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        [String(total - 1)]: "CARELESS_CALCULATION",
        [String(total + 1)]: "CARELESS_CALCULATION",
        [String(total + 2)]: "CARELESS_CALCULATION"
      };
      options.forEach(opt => { if (opt !== String(total) && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Identify how many items are in each of the two containers mentioned and add them together.`, `Add the quantities in the ${target1} and ${target2} spots.`))},
          "finalAnswer": "${total}",
          "solutionSteps": ${JSON.stringify(getQText(`The ${target1} container has ${count1} and the ${target2} container has ${count2}. ${count1} + ${count2} = ${total}.`, `${count1} + ${count2} = ${total}`))}
        },
        "visualEngine": {
          "componentToRender": "ORDINAL_LINE",
          "componentData": {
            "items": ${JSON.stringify(items)},
            "direction": "left"
          }
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 3, integratedTopics: ['Ordinals', 'Addition'], logic: "container_addition", hideVisual: false }
    };
  },

  advanced_comparison: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const startPos = Math.floor(Math.random() * 3) + 1; 
    const gap = Math.floor(Math.random() * 3) + 2; 
    const targetPos = startPos + gap;
    const answer = ORDINAL_SYMBOLS[targetPos - 1];
    const sName = extract(context.name);

    const questionTextTemplate = getQText(`${sName} is the ${ORDINAL_SYMBOLS[startPos - 1]} position. A friend is ${gap} positions behind. What is the friend's position?`, `Position: ${ORDINAL_SYMBOLS[startPos - 1]}. Friend is ${gap} positions behind. Friend's position = ?`);
    const storyInstruction = `STRICT: Replace the "[STORY]" placeholder in "questionText" with a ${isShort ? "short phrase" : "1-sentence Singaporean math story context. Use a local name (e.g. Siti, Muthu, Ali) instead of generic names like Sam"} using the name ${sName}. You MUST NOT leave the "[STORY]" tag in your response.`;

    let options = [answer, ORDINAL_SYMBOLS[Math.max(0, targetPos - 2)], ORDINAL_SYMBOLS[Math.min(11, targetPos)], ORDINAL_SYMBOLS[Math.min(11, targetPos + 1)]];
    options = [...new Set(options)];
    while(options.length < 4) {
      options.push(ORDINAL_SYMBOLS[Math.floor(Math.random() * 12)]);
      options = [...new Set(options)];
    }
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        [ORDINAL_SYMBOLS[Math.max(0, targetPos - 2)]]: "CONCEPTUAL_ERROR",
        [ORDINAL_SYMBOLS[Math.min(11, targetPos)]]: "CONCEPTUAL_ERROR",
        [ORDINAL_SYMBOLS[Math.min(11, targetPos + 1)]]: "CARELESS_CALCULATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`If someone is "behind" you in a line, will their position number be smaller or larger than yours?`, `"Behind" someone means adding to their position number.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`${startPos} + ${gap} = ${targetPos}. The position is ${answer}.`, `${startPos} + ${gap} = ${targetPos}`))}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, integratedTopics: ['Ordinals', 'Comparison'], logic: "relative_offset", hideVisual: true }
    };
  },

  advanced_bidirectional_total: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const sName = extract(context.name);
    const leftPos = Math.floor(Math.random() * 4) + 2; 
    const rightPos = Math.floor(Math.random() * 4) + 2; 
    const total = leftPos + rightPos - 1;
    const answer = String(total);
    const questionTextTemplate = getQText(`An item is ${ORDINAL_WORDS[leftPos - 1]} from the left and ${ORDINAL_WORDS[rightPos - 1]} from the right. How many items are there in total?`, `An item is ${ORDINAL_SYMBOLS[leftPos - 1]} from the left and ${ORDINAL_SYMBOLS[rightPos - 1]} from the right. Total items = ?`);
    const storyInstruction = `STRICT: Replace the "[STORY]" placeholder in "questionText" with a ${isShort ? "short phrase" : "1-sentence Singaporean math story context. Use a local name (e.g. Siti, Muthu, Ali) instead of generic names like Sam"} using the name ${sName}. You MUST NOT leave the "[STORY]" tag in your response.`;

    let options = [answer, String(total - 2), String(total - 1), String(total + 1)];
    options = [...new Set(options)];
    while(options.length < 4) {
      options.push(String(Math.floor(Math.random() * 15) + 3));
      options = [...new Set(options)];
    }
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        [String(total - 1)]: "CARELESS_CALCULATION",
        [String(total + 1)]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Think about how many items are to the left and right of the target item. Don't forget that you are counting the target item twice if you just add the numbers!`, `Total = Left + Right - 1.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`${leftPos} + ${rightPos} - 1 = ${total}.`, `${leftPos} + ${rightPos} - 1 = ${total}`))}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "bidirectional_total", hideVisual: true }
    };
  },

  advanced_multiple_leaves: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const startPos = Math.floor(Math.random() * 4) + 6; 
    const leaves = Math.floor(Math.random() * 3) + 2; 
    const newPos = startPos - leaves;
    const answer = ORDINAL_WORDS[newPos - 1];
    const sName = extract(context.name);
    const questionTextTemplate = getQText(`${sName} is the ${ORDINAL_WORDS[startPos - 1]} from the left. If ${leaves} people to the left of ${sName} leave, what is ${sName}'s new position?`, `Position: ${ORDINAL_SYMBOLS[startPos - 1]}. ${leaves} people to the left leave. New position = ?`);
    const storyInstruction = `STRICT: Replace the "[STORY]" placeholder in "questionText" with a ${isShort ? "short phrase" : "1-sentence Singaporean math story context. Use a local name (e.g. Siti, Muthu, Ali) instead of generic names like Sam"} using the name ${sName}. You MUST NOT leave the "[STORY]" tag in your response.`;

    let options = [answer, ORDINAL_WORDS[Math.max(0, newPos - 2)], ORDINAL_WORDS[Math.min(11, newPos)], ORDINAL_WORDS[Math.max(0, startPos - 1)]];
    options = [...new Set(options)];
    while(options.length < 4) {
      options.push(ORDINAL_WORDS[Math.floor(Math.random() * 12)]);
      options = [...new Set(options)];
    }
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        [ORDINAL_WORDS[Math.min(11, newPos)]]: "CONCEPTUAL_ERROR",
        [ORDINAL_WORDS[Math.max(0, startPos - 1)]]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`If people to the left of you leave, does your position move further left or right?`, `Leaving from the left makes your number smaller.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`${startPos} - ${leaves} = ${newPos}. The new position is ${answer}.`, `${startPos} - ${leaves} = ${newPos}`))}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "multiple_subtractions", hideVisual: true }
    };
  },

  advanced_shift_position: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const sName = extract(context.name);
    const startPos = Math.floor(Math.random() * 4) + 6; 
    const shift = Math.floor(Math.random() * 3) + 2; 
    const newPos = startPos - shift;
    const answer = ORDINAL_WORDS[newPos - 1];
    const questionTextTemplate = getQText(`A runner is in the ${ORDINAL_WORDS[startPos - 1]} position and moves forward by ${shift} places. What is the new position?`, `Position: ${ORDINAL_SYMBOLS[startPos - 1]}. Move forward ${shift} places. New position = ?`);
    const storyInstruction = `STRICT: Replace the "[STORY]" placeholder in "questionText" with a ${isShort ? "short phrase" : "1-sentence Singaporean math story context. Use a local name (e.g. Siti, Muthu, Ali) instead of generic names like Sam"} using the name ${sName}. You MUST NOT leave the "[STORY]" tag in your response.`;

    let options = [answer, ORDINAL_WORDS[Math.max(0, newPos - 2)], ORDINAL_WORDS[Math.min(11, newPos)], ORDINAL_WORDS[Math.max(0, startPos - 1)]];
    options = [...new Set(options)];
    while(options.length < 4) {
      options.push(ORDINAL_WORDS[Math.floor(Math.random() * 12)]);
      options = [...new Set(options)];
    }
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        [ORDINAL_WORDS[Math.min(11, newPos)]]: "CONCEPTUAL_ERROR",
        [ORDINAL_WORDS[Math.max(0, startPos - 1)]]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Moving forward means you are getting closer to the first place.`, `Forward = Subtract from current position.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`${startPos} - ${shift} = ${newPos}.`, `${startPos} - ${shift} = ${newPos}`))}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "forward_shift", hideVisual: true }
    };
  },

  advanced_gap_calculation: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const sName = extract(context.name);
    const posA = Math.floor(Math.random() * 3) + 1; 
    const posB = posA + Math.floor(Math.random() * 4) + 3; 
    const gap = posB - posA - 1;
    const answer = String(gap);
    const questionTextTemplate = getQText(`How many people are there between the ${ORDINAL_WORDS[posA - 1]} and ${ORDINAL_WORDS[posB - 1]} person in a row?`, `How many people are between the ${ORDINAL_SYMBOLS[posA - 1]} and ${ORDINAL_SYMBOLS[posB - 1]} positions?`);
    const storyInstruction = `STRICT: Replace the "[STORY]" placeholder in "questionText" with a ${isShort ? "short phrase" : "1-sentence Singaporean math story context. Use a local name (e.g. Siti, Muthu, Ali) instead of generic names like Sam"} using the name ${sName}. You MUST NOT leave the "[STORY]" tag in your response.`;

    let options = [answer, String(gap - 1), String(gap + 1), String(gap + 2)];
    options = [...new Set(options)];
    while(options.length < 4) {
      options.push(String(Math.floor(Math.random() * 10)));
      options = [...new Set(options)];
    }
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        [String(gap + 1)]: "CONCEPTUAL_ERROR",
        [String(gap + 2)]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Think about the numbers that come after ${ORDINAL_SYMBOLS[posA - 1]} but before ${ORDINAL_SYMBOLS[posB - 1]}.`, `Difference between positions minus 1.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`${posB} - ${posA} - 1 = ${gap}.`, `${posB} - ${posA} - 1 = ${gap}`))}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "gap_calculation", hideVisual: true }
    };
  },

  advanced_overtake_race: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const sName = extract(context.name);
    const startPos = Math.floor(Math.random() * 4) + 4; 
    const overtakeCount = Math.floor(Math.random() * 2) + 1; 
    const newPos = startPos - overtakeCount;
    const answer = ORDINAL_WORDS[newPos - 1];
    const questionTextTemplate = getQText(`A runner is in the ${ORDINAL_WORDS[startPos - 1]} position. After overtaking ${overtakeCount} runners, what is the new position?`, `Position: ${ORDINAL_SYMBOLS[startPos - 1]}. Overtake ${overtakeCount} runners. New position = ?`);
    const storyInstruction = `STRICT: Replace the "[STORY]" placeholder in "questionText" with a ${isShort ? "short phrase" : "1-sentence Singaporean math story context. Use a local name (e.g. Siti, Muthu, Ali) instead of generic names like Sam"} using the name ${sName}. You MUST NOT leave the "[STORY]" tag in your response.`;

    let options = [answer, ORDINAL_WORDS[Math.max(0, newPos - 2)], ORDINAL_WORDS[Math.min(11, newPos)], ORDINAL_WORDS[Math.max(0, startPos - 1)]];
    options = [...new Set(options)];
    while(options.length < 4) {
      options.push(ORDINAL_WORDS[Math.floor(Math.random() * 12)]);
      options = [...new Set(options)];
    }
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        [ORDINAL_WORDS[Math.min(11, newPos)]]: "CONCEPTUAL_ERROR",
        [ORDINAL_WORDS[Math.max(0, startPos - 1)]]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Overtaking someone means you move one spot to their left.`, `Overtake = Subtract from current position.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`${startPos} - ${overtakeCount} = ${newPos}.`, `${startPos} - ${overtakeCount} = ${newPos}`))}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "overtake_logic", hideVisual: true }
    };
  },

  advanced_ordinal_clues: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const sName = extract(context.name);
    const posA = Math.floor(Math.random() * 4) + 1; 
    const posB = posA + 1;
    const posC = posB + 1;
    const answer = ORDINAL_WORDS[posC - 1];
    const questionTextTemplate = getQText(`If Siti is ${ORDINAL_WORDS[posA - 1]}, and Aminah is just behind her, and Bala is just behind Aminah, what position is Bala in?`, `Siti is ${ORDINAL_SYMBOLS[posA - 1]}. Aminah is just behind Siti. Bala is just behind Aminah. Bala's position = ?`);
    const storyInstruction = `STRICT: Replace the "[STORY]" placeholder in "questionText" with a ${isShort ? "short phrase" : "1-sentence Singaporean math story context. Use a local name (e.g. Siti, Muthu, Ali) instead of generic names like Sam"} using the name ${sName}. You MUST NOT leave the "[STORY]" tag in your response.`;

    let options = [answer, ORDINAL_WORDS[posA - 1], ORDINAL_WORDS[posB - 1], ORDINAL_WORDS[posC]];
    options = [...new Set(options)];
    while(options.length < 4) {
      options.push(ORDINAL_WORDS[Math.floor(Math.random() * 12)]);
      options = [...new Set(options)];
    }
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        [ORDINAL_WORDS[posA - 1]]: "CONCEPTUAL_ERROR",
        [ORDINAL_WORDS[posB - 1]]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`"Just behind" means the very next person in line.`, `Add 1 for every step behind.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Siti is ${posA}. Aminah is ${posB}. Bala is ${posC}, which is ${answer}.`, `${posA} + 1 + 1 = ${posC}`))}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "clue_chain", hideVisual: true }
    };
  },

  advanced_net_queue_change: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const sName = extract(context.name);
    const startPos = Math.floor(Math.random() * 4) + 4; 
    const joins = Math.floor(Math.random() * 3) + 2; 
    let leaves = Math.floor(Math.random() * 2) + 1;
    if (joins === leaves) leaves = (leaves === 1) ? 2 : 1;
    const netChange = joins - leaves; 
    const newPos = startPos + netChange;
    const answer = ORDINAL_WORDS[newPos - 1];
    const questionTextTemplate = getQText(`${sName} is in the ${ORDINAL_SYMBOLS[startPos - 1]} position. If ${joins} people join in front of ${sName} and ${leaves} people in front leave, what is ${sName}'s new position?`, `Position: ${ORDINAL_SYMBOLS[startPos - 1]}. ${joins} join in front, ${leaves} in front leave. New position = ?`);
    const storyInstruction = `STRICT: Replace the "[STORY]" placeholder in "questionText" with a ${isShort ? "short phrase" : "1-sentence Singaporean math story context. Use a local name (e.g. Siti, Muthu, Ali) instead of generic names like Sam"} using the name ${sName}. You MUST NOT leave the "[STORY]" tag in your response.`;

    let options = [answer, ORDINAL_WORDS[Math.max(0, startPos - 2)], ORDINAL_WORDS[startPos - 1], ORDINAL_WORDS[Math.min(11, newPos)]];
    options = [...new Set(options)];
    while(options.length < 4) {
      options.push(ORDINAL_WORDS[Math.floor(Math.random() * 12)]);
      options = [...new Set(options)];
    }
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        [ORDINAL_WORDS[Math.max(0, startPos - 2)]]: "CONCEPTUAL_ERROR",
        [ORDINAL_WORDS[startPos - 1]]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Work it out step by step: What happens when ${joins} people join in front? What happens when ${leaves} people leave?`, `Initial + Join - Leave.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Net change is ${joins} - ${leaves} = ${netChange}. Moving back by ${netChange} spots means the new position is ${answer}.`, `${startPos} + ${joins} - ${leaves} = ${newPos}`))}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "net_queue_change", hideVisual: true }
    };
  },

  advanced_relative_target: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const sName = extract(context.name);
    const targetPos = Math.floor(Math.random() * 3) + 1; 
    const currentPos = targetPos + Math.floor(Math.random() * 4) + 2; 
    const movesNeeded = currentPos - targetPos;
    const answer = String(movesNeeded);
    const questionTextTemplate = getQText(`How many places must a person in the ${ORDINAL_WORDS[currentPos - 1]} position move up to reach the ${ORDINAL_WORDS[targetPos - 1]} position?`, `Move from ${ORDINAL_SYMBOLS[currentPos - 1]} up to ${ORDINAL_SYMBOLS[targetPos - 1]}. Places to move = ?`);
    const storyInstruction = `STRICT: Replace the "[STORY]" placeholder in "questionText" with a ${isShort ? "short phrase" : "1-sentence Singaporean math story context. Use a local name (e.g. Siti, Muthu, Ali) instead of generic names like Sam"} using the name ${sName}. You MUST NOT leave the "[STORY]" tag in your response.`;

    let options = [answer, String(movesNeeded - 1), String(movesNeeded + 1), String(currentPos)];
    options = [...new Set(options)];
    while(options.length < 4) {
      options.push(String(Math.floor(Math.random() * 10) + 1));
      options = [...new Set(options)];
    }
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        [String(movesNeeded - 1)]: "CARELESS_CALCULATION",
        [String(movesNeeded + 1)]: "CARELESS_CALCULATION",
        [String(currentPos)]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Find the difference between the two positions.`, `Current position - Target position.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`${currentPos} - ${targetPos} = ${movesNeeded}.`, `${currentPos} - ${targetPos} = ${movesNeeded}`))}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "relative_target", hideVisual: true }
    };
  }
};

export const advancedLogic = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
  if (advancedVariants[activeVariant]) {
    return advancedVariants[activeVariant](config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
  }
};