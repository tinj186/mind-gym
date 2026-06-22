import { numberToWords } from '@/lib/utils/math-helpers';
import { getRandomContext } from '@/lib/utils/localization';
import { ORDINAL_WORDS } from '@/lib/utils/variable-bank';
// using imported ORDINAL_WORDS
const ORDINAL_SYMBOLS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];

const PERSON_EMOJIS = ["👨", "👩", "👧", "👦", "🧒", "👶", "👵", "👴", "👲", "👳", "👱", "👮"];
const ITEM_EMOJIS = ["🍎", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍒", "🍍", "🥭", "🥝", "🥑"];

// Robust extraction helper for localized context objects
const extract = (val) => {
  if (typeof val !== 'object' || val === null) return String(val);
  return val.item || val.singular || val.name?.singular || val.text || val.val || String(val);
};

export const standardVariants = {
  standard_reverse: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const totalItems = Math.floor(Math.random() * 4) + 5; // 5 to 8
    const targetFromFront = Math.floor(Math.random() * (totalItems - 2)) + 2;
    const targetFromBack = totalItems - targetFromFront + 1;
    const frontOrdinal = ORDINAL_SYMBOLS[targetFromFront - 1];
    const backOrdinal = ORDINAL_SYMBOLS[targetFromBack - 1];
    const sName = extract(context.name);
    const sItem = extract(context.items[0]);
    const sSetting = extract(context.setting);

    const visualProtocol = `\nSTRICT VISUAL PROTOCOL: You MUST generate an array of ${totalItems} UNIQUE emojis for the "componentData.items" field. The emojis MUST match the subject of your story (e.g., if the story is about children queuing, use people emojis like 👦, 👧, 👨, 👩. DO NOT default to fruits unless the story is explicitly about fruits!).`;

    let options = [backOrdinal, ORDINAL_SYMBOLS[Math.max(0, targetFromBack - 2)], ORDINAL_SYMBOLS[Math.min(11, targetFromBack)], ORDINAL_SYMBOLS[Math.min(11, targetFromBack + 1)]];
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
        [ORDINAL_SYMBOLS[Math.max(0, targetFromBack - 2)]]: "CONCEPTUAL_ERROR",
        [ORDINAL_SYMBOLS[Math.min(11, targetFromBack)]]: "CONCEPTUAL_ERROR",
        [ORDINAL_SYMBOLS[Math.min(11, targetFromBack + 1)]]: "CARELESS_CALCULATION"
      };
      options.forEach(opt => { if (opt !== backOrdinal && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a standard_reverse question. DO NOT modify the mathematical structure or the final answer.${visualProtocol}
        
        MATH CONSTRAINTS:
        - Topic: Counting from left and right
        - Total items in line: ${totalItems}
        - Condition: A specific character or item is ${frontOrdinal} from the LEFT.
        - Question: What is its position from the RIGHT?
        - Final Answer MUST strictly be: "${backOrdinal}"
        
        CREATIVE INSTRUCTIONS:
        ${isShort ? "- Write a short, simple question (max 2 sentences). You MUST explicitly ask a question." : "- Generate an engaging word problem. You may use any fun theme (e.g., underwater, forest, toy box, space)."}
        - CRITICAL: You MUST use the localized name ${sName} in your question to add Singaporean flavor.
        - CRITICAL: The "items" array in "componentData" MUST contain exactly ${totalItems} UNIQUE emojis that match your story theme. DO NOT use placeholder text like "emoji1" or "emoji2". Generate varied, creative emojis!
        
        OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
        {
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": "...",
            "options": ${mcqOptions},
            "defectMap": ${defectMapStr},
            "hint": ${JSON.stringify(getQText(`If you know the position from the left, how can you use the total number of items to find the position from the right?`, `Think: Total - Left Position + 1`))},
            "finalAnswer": "${backOrdinal}",
            "solutionSteps": "..."
          },
          "visualEngine": {
            "componentToRender": "ORDINAL_LINE",
            "componentData": {
              "items": ["[Theme Emoji 1]", "[Theme Emoji 2]"],
              "direction": "left"
            }
          },
          "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "reverse_mapping", hideVisual: false }
    };
  },

  standard_change: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const sName = extract(context.name);
    const sSetting = extract(context.setting);
    const answer = "3rd";
    const totalItems = Math.floor(Math.random() * 4) + 5; // 5 to 8 items in the queue

    const visualProtocol = `\nSTRICT VISUAL PROTOCOL: You MUST generate an array of ${totalItems} UNIQUE emojis for the "componentData.items" field. The emojis MUST match the subject of your story (e.g., if the story is about children queuing, use people emojis like 👦, 👧, 👨, 👩. DO NOT default to fruits unless the story is explicitly about fruits!).`;

    let options = [answer, "2nd", "4th", "5th"];
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
        ["2nd"]: "CONCEPTUAL_ERROR",
        ["4th"]: "CONCEPTUAL_ERROR",
        ["5th"]: "CARELESS_CALCULATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a standard_change question. DO NOT modify the mathematical structure or the final answer.${visualProtocol}
        
        MATH CONSTRAINTS:
        - Topic: Ordinal Numbers (Standard Level - State Change)
        - Initial state: A character is 4th from the left.
        - Event: 1 person leaves from the VERY LEFT of the line.
        - Question: What is that character's NEW position?
        - Final Answer MUST strictly be: "${answer}"
        
        CREATIVE INSTRUCTIONS:
        ${isShort ? "- Write a short, simple question (max 2 sentences). You MUST explicitly ask a question." : "- Generate an engaging word problem."}
        - CRITICAL: You MUST use the localized name ${sName} in your question to add Singaporean flavor.
        - CRITICAL: The "items" array in "componentData" MUST contain exactly ${totalItems} UNIQUE emojis that match your story theme. DO NOT use placeholder text. Generate varied, creative emojis!
        
        OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
        {
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": "...",
            "options": ${mcqOptions},
            "defectMap": ${defectMapStr},
            "hint": ${JSON.stringify(getQText(`If someone to the left of ${sName} leaves, does ${sName}'s position move further left or right? By how many spots?`, `Think: Does the position number get smaller or larger?`))},
            "finalAnswer": "${answer}",
            "solutionSteps": "..."
          },
          "visualEngine": {
            "componentToRender": "ORDINAL_LINE",
            "componentData": {
              "items": ["[Theme Emoji 1]", "[Theme Emoji 2]"],
              "direction": "left"
            }
          },
          "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "state_change", hideVisual: false }
    };
  },

  standard_from_the_right: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const sName = extract(context.name);
    const totalItems = Math.floor(Math.random() * 4) + 5; 
    const targetIndex = Math.floor(Math.random() * totalItems);
    const rightPositionIndex = totalItems - 1 - targetIndex;
    const answer = ORDINAL_WORDS[rightPositionIndex];
    const targetEmoji = ITEM_EMOJIS[targetIndex];

    const visualProtocol = `\nSTRICT VISUAL PROTOCOL: You MUST generate an array of ${totalItems} UNIQUE emojis for the "componentData.items" field. The emojis MUST match the subject of your story (e.g., if the story is about children queuing, use people emojis like 👦, 👧, 👨, 👩. DO NOT default to fruits unless the story is explicitly about fruits!).`;

    let options = [answer, ORDINAL_WORDS[Math.max(0, rightPositionIndex - 1)], ORDINAL_WORDS[Math.min(11, rightPositionIndex + 1)], ORDINAL_WORDS[Math.min(11, rightPositionIndex + 2)]];
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
        [ORDINAL_WORDS[Math.max(0, rightPositionIndex - 1)]]: "CONCEPTUAL_ERROR",
        [ORDINAL_WORDS[Math.min(11, rightPositionIndex + 1)]]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a standard_from_the_right question. DO NOT modify the mathematical structure or the final answer.${visualProtocol}
        MATH CONSTRAINTS:
        - Topic: Counting from the right
        - Total Items in row: ${totalItems}
        - Logic: The chosen emoji is the ${ORDINAL_WORDS[targetIndex]} from the left.
        - Final Answer MUST be: "${answer}"
        
        CREATIVE INSTRUCTIONS:
        ${isShort ? "- Write a short, simple question (max 2 sentences). You MUST explicitly ask a question." : "- Generate an engaging word problem."}
        - CRITICAL: You MUST use the localized name ${sName} in your question to add Singaporean flavor.
        - CRITICAL: The "items" array in "componentData" MUST contain exactly ${totalItems} UNIQUE emojis matching your theme. DO NOT use placeholder text. Generate varied, creative emojis!
        - Ask what position the [Chosen Emoji] is in, counting from the RIGHT.
        
        OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
        { 
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": "...", 
            "hint": "Start counting from the rightmost item. Counting from the right, which position is it in?",
            "options": ${mcqOptions}, 
            "defectMap": ${defectMapStr},
            "finalAnswer": "${answer}", 
            "solutionSteps": "..."
          },
          "visualEngine": {
            "componentToRender": "ORDINAL_LINE",
            "componentData": {
              "items": ["[Theme Emoji 1]", "[Theme Emoji 2]"],
              "direction": "right"
            }
          },
          "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "reverse_directional", hideVisual: false }
    };
  },

  standard_join_front: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const startPos = Math.floor(Math.random() * 5) + 2; // 2nd to 6th
    const joinPos = Math.floor(Math.random() * startPos) + 1; // 1 to startPos
    const joinOrdinal = ORDINAL_WORDS[joinPos - 1];
    const newPos = startPos + 1;
    const answer = ORDINAL_WORDS[newPos - 1];
    const sName = extract(context.name);
    const eventDesc = joinPos === 1 ? "joins the left side of the queue" : `joins the queue at the ${joinOrdinal} position from the left`;
    const visualProtocol = `\nSTRICT VISUAL PROTOCOL: You MUST generate an array of ${startPos + 2} UNIQUE emojis for the "componentData.items" field. The emojis MUST match the subject of your story (e.g., if the story is about children queuing, use people emojis like 👦, 👧, 👨, 👩. DO NOT default to fruits unless the story is explicitly about fruits!).`;

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
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a standard_join_front question. DO NOT modify the mathematical structure or the final answer.${visualProtocol}
        MATH CONSTRAINTS:
        - Initial Position: ${ORDINAL_WORDS[startPos - 1]} from the left
        - Event: 1 more person ${eventDesc}.
        - Final Answer MUST be: "${answer}"
        
        CREATIVE INSTRUCTIONS:
        ${isShort ? "- Write a short, simple question (max 2 sentences). You MUST explicitly ask a question." : "- Generate an engaging word problem."}
        - CRITICAL: You MUST use the localized name ${sName} in your question to add Singaporean flavor.
        - CRITICAL: The "items" array in "componentData" MUST contain exactly ${startPos + 2} UNIQUE emojis matching your theme. DO NOT use placeholder text. Generate varied, creative emojis!
        
        OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
        { 
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": "...", 
            "hint": ${JSON.stringify(getQText(`If someone joins the line to the left of ${sName}, does ${sName}'s position move further left or right? By how many spots?`, `Think: Does the position number get smaller or larger?`))},
            "options": ${mcqOptions}, 
            "defectMap": ${defectMapStr},
            "finalAnswer": "${answer}", 
            "solutionSteps": "..."
          },
          "visualEngine": {
            "componentToRender": "ORDINAL_LINE",
            "componentData": {
              "items": ["[Theme Emoji 1]", "[Theme Emoji 2]"],
              "direction": "left"
            }
          },
          "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "queue_addition", hideVisual: false }
    };
  },

  standard_leave_front: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const startPos = Math.floor(Math.random() * 5) + 3; // 3rd to 7th
    const leavePos = Math.floor(Math.random() * (startPos - 1)) + 1; // 1 to startPos-1
    const leaveOrdinal = ORDINAL_WORDS[leavePos - 1];
    const newPos = startPos - 1; 
    const answer = ORDINAL_WORDS[newPos - 1];
    const sName = extract(context.name);
    const eventDesc = leavePos === 1 ? "at the very left leaves" : `at the ${leaveOrdinal} position from the left leaves`;
    const visualProtocol = `\nSTRICT VISUAL PROTOCOL: You MUST generate an array of ${startPos + 1} UNIQUE emojis for the "componentData.items" field. The emojis MUST match the subject of your story (e.g., if the story is about children queuing, use people emojis like 👦, 👧, 👨, 👩. DO NOT default to fruits unless the story is explicitly about fruits!).`;

    let options = [answer, ORDINAL_WORDS[Math.max(0, newPos - 2)], ORDINAL_WORDS[startPos - 1], ORDINAL_WORDS[startPos]];
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
        [ORDINAL_WORDS[Math.max(0, newPos - 2)]]: "CONCEPTUAL_ERROR",
        [ORDINAL_WORDS[startPos - 1]]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a standard_leave_front question. DO NOT modify the mathematical structure or the final answer.${visualProtocol}
        MATH CONSTRAINTS:
        - Initial Position: ${ORDINAL_WORDS[startPos - 1]} from the left
        - Event: 1 person ${eventDesc}.
        - Final Answer MUST be: "${answer}"
        
        CREATIVE INSTRUCTIONS:
        ${isShort ? "- Write a short, simple question (max 2 sentences). You MUST explicitly ask a question." : "- Generate an engaging word problem."}
        - CRITICAL: You MUST use the localized name ${sName} in your question to add Singaporean flavor.
        - CRITICAL: The "items" array in "componentData" MUST contain exactly ${startPos + 1} UNIQUE emojis matching your theme. DO NOT use placeholder text. Generate varied, creative emojis!
        
        OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
        { 
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": "...", 
            "hint": ${JSON.stringify(getQText(`If someone to the left of ${sName} leaves, does ${sName}'s position move further left or right? By how many spots?`, `Think: Does the position number get smaller or larger?`))},
            "options": ${mcqOptions}, 
            "defectMap": ${defectMapStr},
            "finalAnswer": "${answer}", 
            "solutionSteps": "..."
          },
          "visualEngine": {
            "componentToRender": "ORDINAL_LINE",
            "componentData": {
              "items": ["[Theme Emoji 1]", "[Theme Emoji 2]"],
              "direction": "left"
            }
          },
          "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "queue_subtraction", hideVisual: false }
    };
  },

  standard_relative_ahead: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const basePos = Math.floor(Math.random() * 4) + 5; 
    const stepsAhead = Math.floor(Math.random() * 3) + 2; 
    const targetPos = basePos - stepsAhead;
    const answer = ORDINAL_WORDS[targetPos - 1];
    const sName = extract(context.name);

    let options = [answer, ORDINAL_WORDS[Math.max(0, targetPos - 2)], ORDINAL_WORDS[targetPos], ORDINAL_WORDS[basePos + stepsAhead - 1]];
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
        [ORDINAL_WORDS[Math.max(0, targetPos - 2)]]: "CONCEPTUAL_ERROR",
        [ORDINAL_WORDS[targetPos]]: "CONCEPTUAL_ERROR",
        [ORDINAL_WORDS[basePos + stepsAhead - 1]]: "CONFUSED_OPERATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a standard_relative_ahead question. DO NOT modify the mathematical structure or the final answer.
        MATH CONSTRAINTS:
        - Base Position: ${ORDINAL_WORDS[basePos - 1]} from the left
        - Condition: Target is ${stepsAhead} positions to the left.
        - Final Answer MUST be: "${answer}"
        
        CREATIVE INSTRUCTIONS:
        ${isShort ? "- Write a short, simple question (max 2 sentences). You MUST explicitly ask a question." : "- Generate an engaging word problem using any fun theme."}
        - CRITICAL: You MUST use the localized name ${sName} in your question to add Singaporean flavor.
        
        OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
        { 
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": "...", 
            "hint": ${JSON.stringify(getQText(`If someone is 'to the left' of you, is their position number smaller or larger than yours?`, `Think: Smaller number means further left.`))},
            "options": ${mcqOptions}, 
            "defectMap": ${defectMapStr},
            "finalAnswer": "${answer}", 
            "solutionSteps": ${JSON.stringify(getQText(`${basePos} - ${stepsAhead} = ${targetPos}. The position is ${answer}.`, `${basePos} - ${stepsAhead} = ${targetPos}`))}
          },
          "visualEngine": { "componentToRender": "NONE", "componentData": {} },
          "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "relative_ahead", hideVisual: true }
    };
  },

  standard_relative_behind: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const basePos = Math.floor(Math.random() * 4) + 2; 
    const stepsBehind = Math.floor(Math.random() * 3) + 2; 
    const targetPos = basePos + stepsBehind;
    const answer = ORDINAL_WORDS[targetPos - 1];
    const sName = extract(context.name);

    let options = [answer, ORDINAL_WORDS[Math.max(0, targetPos - 3)], ORDINAL_WORDS[Math.max(0, targetPos - 2)], ORDINAL_WORDS[Math.min(11, targetPos)]];
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
        [ORDINAL_WORDS[Math.max(0, targetPos - 2)]]: "CONCEPTUAL_ERROR",
        [ORDINAL_WORDS[Math.min(11, targetPos)]]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a standard_relative_behind question. DO NOT modify the mathematical structure or the final answer.
        MATH CONSTRAINTS:
        - Base Position: ${ORDINAL_WORDS[basePos - 1]} from the left
        - Condition: Target is ${stepsBehind} positions to the right.
        - Final Answer MUST be: "${answer}"
        
        CREATIVE INSTRUCTIONS:
        ${isShort ? "- Write a short, simple question (max 2 sentences). You MUST explicitly ask a question." : "- Generate an engaging word problem using any fun theme."}
        - CRITICAL: You MUST use the localized name ${sName} in your question to add Singaporean flavor.
        
        OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
        { 
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": "...", 
            "hint": ${JSON.stringify(getQText(`If someone is 'to the right' of you, is their position number smaller or larger than yours?`, `Think: Larger number means further right.`))},
            "options": ${mcqOptions}, 
            "defectMap": ${defectMapStr},
            "finalAnswer": "${answer}", 
            "solutionSteps": ${JSON.stringify(getQText(`${basePos} + ${stepsBehind} = ${targetPos}. The position is ${answer}.`, `${basePos} + ${stepsBehind} = ${targetPos}`))}
          },
          "visualEngine": { "componentToRender": "NONE", "componentData": {} },
          "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "relative_behind", hideVisual: true }
    };
  },

  standard_between_positions: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const sName = extract(context.name);
    const startPos = Math.floor(Math.random() * 5) + 1; 
    const endPos = startPos + 2; 
    const targetPos = startPos + 1;
    const answer = ORDINAL_WORDS[targetPos - 1];

    let options = [answer, ORDINAL_WORDS[Math.max(0, startPos - 2)], ORDINAL_WORDS[startPos - 1], ORDINAL_WORDS[endPos - 1]];
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
        [ORDINAL_WORDS[startPos - 1]]: "CONCEPTUAL_ERROR",
        [ORDINAL_WORDS[endPos - 1]]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a standard_between_positions question.
        MATH CONSTRAINTS:
        - Given positions: ${ORDINAL_WORDS[startPos - 1]} and ${ORDINAL_WORDS[endPos - 1]}.
        - Question: Find the position exactly in between.
        - Final Answer MUST be: "${answer}"
        
        CREATIVE INSTRUCTIONS:
        ${isShort ? "- Write a short, simple question (max 2 sentences). You MUST explicitly ask a question." : "- Generate an engaging word problem using any fun theme."}
        - CRITICAL: You MUST use the localized name ${sName} in your question to add Singaporean flavor.
        
        OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
        { 
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": ${JSON.stringify(getQText(`Which ordinal position is exactly between the ${ORDINAL_WORDS[startPos - 1]} and ${ORDINAL_WORDS[endPos - 1]} positions?`, `Find the position exactly between ${ORDINAL_SYMBOLS[startPos - 1]} and ${ORDINAL_SYMBOLS[endPos - 1]}.`))}, 
            "hint": ${JSON.stringify(getQText(`What number comes exactly in the middle of the two given numbers?`, `Think: What's between X and Y?`))},
            "options": ${mcqOptions}, 
            "defectMap": ${defectMapStr},
            "finalAnswer": "${answer}", 
            "solutionSteps": ${JSON.stringify(getQText(`The number between ${startPos} and ${endPos} is ${targetPos}, which is the ${answer} position.`, `${startPos} < ${targetPos} < ${endPos}`))}
          },
          "visualEngine": { "componentToRender": "NONE", "componentData": {} },
          "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "position_between", hideVisual: true }
    };
  },

  standard_find_total: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const frontPos = Math.floor(Math.random() * 4) + 2; 
    const backPos = Math.floor(Math.random() * 4) + 2; 
    const total = frontPos + backPos - 1; 
    const answer = String(total);
    const sName = extract(context.name);

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
        [String(total - 1)]: "CONCEPTUAL_ERROR",
        [String(total + 1)]: "CONFUSED_OPERATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a standard_find_total question. DO NOT modify the mathematical structure or the final answer.
        MATH CONSTRAINTS:
        - Position from left: ${ORDINAL_WORDS[frontPos - 1]}
        - Position from right: ${ORDINAL_WORDS[backPos - 1]}
        - Final Answer MUST be: "${answer}"
        
        CREATIVE INSTRUCTIONS:
        ${isShort ? "- Write a short, simple question (max 2 sentences). You MUST explicitly ask a question." : "- Generate an engaging word problem using any fun theme."}
        - CRITICAL: You MUST use the localized name ${sName} in your question to add Singaporean flavor.
        
        OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
        { 
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": "...", 
            "hint": ${JSON.stringify(getQText(`If you add the position from the left and the position from the right, what does that sum represent? How do you adjust for the person being counted twice?`, `Think: Left + Right - 1`))},
            "options": ${mcqOptions}, 
            "defectMap": ${defectMapStr},
            "finalAnswer": "${answer}", 
            "solutionSteps": ${JSON.stringify(getQText(`${frontPos} (left) + ${backPos} (right) - 1 (overlapping person) = ${total}.`, `${frontPos} + ${backPos} - 1 = ${total}`))}
          },
          "visualEngine": { "componentToRender": "NONE", "componentData": {} },
          "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "total_from_ordinals", hideVisual: true }
    };
  },

  standard_swap_positions: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const sName = extract(context.name);
    const posA = Math.floor(Math.random() * 3) + 1; 
    const posB = posA + Math.floor(Math.random() * 4) + 2; 
    const answer = ORDINAL_WORDS[posA - 1];

    let options = [answer, ORDINAL_WORDS[Math.max(0, posA - 2)], ORDINAL_WORDS[posB - 1], ORDINAL_WORDS[posB]];
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
        [ORDINAL_WORDS[posB - 1]]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a standard_swap_positions question.
        MATH CONSTRAINTS:
        - Position A: ${ORDINAL_WORDS[posA - 1]}
        - Position B: ${ORDINAL_WORDS[posB - 1]}
        - Event: Items at these positions swap places.
        - Final Answer MUST be: "${answer}"
        
        CREATIVE INSTRUCTIONS:
        ${isShort ? "- Write a short, simple question (max 2 sentences). You MUST explicitly ask a question." : "- Generate an engaging word problem using any fun theme."}
        - CRITICAL: You MUST use the localized name ${sName} in your question to add Singaporean flavor.
        
        OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
        { 
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": ${JSON.stringify(getQText(`Item A is ${ORDINAL_WORDS[posA - 1]} and Item B is ${ORDINAL_WORDS[posB - 1]}. If they swap positions, what is Item B's new position?`, `${ORDINAL_SYMBOLS[posA - 1]} and ${ORDINAL_SYMBOLS[posB - 1]} swap. ${ORDINAL_SYMBOLS[posB - 1]} is now at ? position.`))}, 
            "hint": ${JSON.stringify(getQText(`If two items swap positions, what happens to their original spots?`, `Think: They exchange places.`))},
            "options": ${mcqOptions}, 
            "defectMap": ${defectMapStr},
            "finalAnswer": "${answer}", 
            "solutionSteps": ${JSON.stringify(getQText(`Since they swap, Item B takes Item A's original spot, which was ${answer}.`, `Swap spots: ${answer}`))}
          },
          "visualEngine": { "componentToRender": "NONE", "componentData": {} },
          "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "position_swap", hideVisual: true }
    };
  }
};

export const standardLogic = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
  if (standardVariants[activeVariant]) {
    return standardVariants[activeVariant](config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
  }
};