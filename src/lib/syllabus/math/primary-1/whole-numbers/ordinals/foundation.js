import { numberToWords } from '@/lib/utils/math-helpers';
import { getRandomContext } from '@/lib/utils/localization';
import { ORDINAL_WORDS } from '@/lib/utils/variable-bank';
// using imported ORDINAL_WORDS
const ORDINAL_SYMBOLS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"];

const PERSON_EMOJIS = ["👨", "👩", "👧", "👦", "🧒", "👶", "👵", "👴", "👲", "👳", "👱", "👮"];
const ITEM_EMOJIS = ["🍎", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍒", "🍍", "🥭", "🥝", "🥑"];

// Robust extraction helper for localized context objects
const extract = (val) => {
  if (typeof val !== 'object' || val === null) return String(val);
  return val.item || val.singular || val.name?.singular || val.text || val.val || String(val);
};

export const foundationVariants = {
  foundation_direct: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const targetIdx = Math.floor(Math.random() * config.maxItems);
    const targetOrdinal = ORDINAL_SYMBOLS[targetIdx];
    const sName = extract(context.name);
    const sItem = extract(context.items[0]);
    const visualProtocol = `\nSTRICT VISUAL PROTOCOL: You MUST generate an array of ${config.maxItems} UNIQUE objects for the "componentData.items" field. Each object must have an "icon" (emoji) and a "label" (one-word name, e.g., "Apple"). The emojis MUST match the subject of your story (e.g., if the story is about children queuing, use people emojis like 👦, 👧, 👨, 👩. DO NOT default to fruits unless the story is explicitly about fruits!).`;
    
    let options = [targetOrdinal, ORDINAL_SYMBOLS[Math.max(0, targetIdx - 1)], ORDINAL_SYMBOLS[Math.min(9, targetIdx + 1)], ORDINAL_SYMBOLS[Math.min(9, targetIdx + 2)]];
    options = [...new Set(options)];
    while(options.length < 4) {
      options.push(ORDINAL_SYMBOLS[Math.floor(Math.random() * 10)]);
      options = [...new Set(options)];
    }
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== targetOrdinal) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a foundation_direct question. DO NOT modify the mathematical structure or the final answer.${visualProtocol}
        
        MATH CONSTRAINTS:
        - Topic: Ordinal Numbers (Foundation Level)
        - Format: ${type}
        - Total items in the line: ${config.maxItems}
        - Logic: Place a specific identifiable emoji at position ${targetOrdinal} (index ${targetIdx} from the left).
        - Final Answer MUST strictly be: "${targetOrdinal}"
        
        CREATIVE INSTRUCTIONS:
        ${isShort ? "- Write a short, simple question (max 2 sentences). You MUST explicitly ask a question." : "- Generate an engaging word problem. You may use any fun or relatable theme (e.g., animals, space, toys, food, sports) that allows for a wide variety of colorful emojis."}
        - CRITICAL: You MUST use the localized name ${sName} in your question to add Singaporean flavor.
        - CRITICAL: The "items" array in "componentData" MUST contain exactly ${config.maxItems} unique objects formatted as {"icon": "<emoji>", "label": "<name>"}. DO NOT use placeholders like "emoji1" or "Name1". Generate varied, creative objects!
        - Identify the specific item name (label) you placed at the ${targetOrdinal} spot and ask for its position in the question text (e.g., "What is the position of the Lion?").
        - CRITICAL: DO NOT include the answer "${targetOrdinal}" in your question text.
        
        OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
        {
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": "Look at the row of labeled items. What is the position of the [Item Label] from the left?",
            "hint": "Start counting from the left side. Which position is the [Chosen Emoji] in?",
            "options": ${mcqOptions},
            "defectMap": ${defectMapStr},
            "finalAnswer": "${targetOrdinal}",
            "solutionSteps": "Start counting from the left. The [Item Label] is at the ${targetOrdinal} position."
          },
          "visualEngine": {
            "componentToRender": "ORDINAL_LINE",
            "componentData": {
              "items": [{"icon": "[Theme Emoji]", "label": "[Theme Word]"}, {"icon": "[Theme Emoji 2]", "label": "[Theme Word 2]"}], 
              "direction": "left"
            }
          },
          "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "direct_id", hideVisual: false }
    };
  },

  foundation_item_to_position: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const totalItems = Math.floor(Math.random() * 4) + 4; // 4 to 7 items
    const targetIndex = Math.floor(Math.random() * totalItems);
    const askForSymbol = Math.random() > 0.5;
    const sItem = extract(context.items[0]);
    const visualProtocol = `\nSTRICT VISUAL PROTOCOL: You MUST generate an array of ${totalItems} UNIQUE objects {"icon": "...", "label": "..."} for the "componentData.items" field. The emojis MUST match the subject of your story (e.g., if the story is about children queuing, use people emojis like 👦, 👧, 👨, 👩. DO NOT default to fruits unless the story is explicitly about fruits!).`;
    
    const answer = askForSymbol ? ORDINAL_SYMBOLS[targetIndex] : ORDINAL_WORDS[targetIndex];
    const distractors = askForSymbol 
      ? [ORDINAL_SYMBOLS[Math.max(0, targetIndex - 1)], ORDINAL_SYMBOLS[Math.min(9, targetIndex + 1)], ORDINAL_SYMBOLS[Math.min(9, targetIndex + 2)]]
      : [ORDINAL_WORDS[Math.max(0, targetIndex - 1)], ORDINAL_WORDS[Math.min(9, targetIndex + 1)], ORDINAL_WORDS[Math.min(9, targetIndex + 2)]];
    let options = [...new Set([answer, ...distractors])];
    while(options.length < 4) {
      options.push(askForSymbol ? ORDINAL_SYMBOLS[Math.floor(Math.random() * 10)] : ORDINAL_WORDS[Math.floor(Math.random() * 10)]);
      options = [...new Set(options)];
    }
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a foundation_item_to_position question. DO NOT modify the mathematical structure or the final answer.${visualProtocol}
        MATH CONSTRAINTS:
        - Topic: Item to Position
        - Total Items: ${totalItems}
        - Logic: Place a specific emoji at position index ${targetIndex} (from the left).
        - Final Answer MUST be: "${answer}"
        
        CREATIVE INSTRUCTIONS:
        ${isShort ? "- Write a short, simple question (max 2 sentences). You MUST explicitly ask a question." : "- Generate an engaging word problem using any fun theme."}
        - CRITICAL: You MUST use the localized name ${sName} in your question to add Singaporean flavor.
        - CRITICAL: The "items" array in "componentData" MUST contain exactly ${totalItems} unique objects formatted as {"icon": "<emoji>", "label": "<name>"}. DO NOT use placeholders like "emoji1" or "Name1". Generate varied, creative objects!
        - Identify the specific item name (label) you placed at index ${targetIndex} and ask what position it is in.
        
        OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
        { 
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": "Look at the row of labeled items. Counting from the left, what is the position of the [Target Label]?", 
            "hint": "Start counting from the left. Which position is the [Target Label]?",
            "options": ${mcqOptions}, 
            "defectMap": ${defectMapStr},
            "finalAnswer": "${answer}", 
            "solutionSteps": "Counting from the left, the [Target Label] is in the ${answer} position."
          },
          "visualEngine": {
            "componentToRender": "ORDINAL_LINE",
            "componentData": { 
              "items": [{"icon": "[Theme Emoji]", "label": "[Theme Word]"}, {"icon": "[Theme Emoji 2]", "label": "[Theme Word 2]"}], 
              "direction": "left" 
            }
          },
          "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "item_to_position", hideVisual: false }
    };
  },

  foundation_position_to_item: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const totalItems = Math.floor(Math.random() * 2) + 4; // 4 to 5 items for Foundation
    const targetIndex = Math.floor(Math.random() * totalItems);
    const askForSymbol = Math.random() > 0.5;
    const targetPosition = askForSymbol ? ORDINAL_SYMBOLS[targetIndex] : ORDINAL_WORDS[targetIndex];
    const sItem = extract(context.items[0]);
    const visualProtocol = `\nSTRICT VISUAL PROTOCOL: You MUST generate an array of ${totalItems} UNIQUE objects {"icon": "...", "label": "..."} for the "componentData.items" field. Match these to your theme.`;

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a foundation_position_to_item question. DO NOT modify the mathematical structure or the final answer.${visualProtocol}
        MATH CONSTRAINTS:
        - Topic: Position to Item
        - Total Items: ${totalItems}
        - Target Position: ${targetPosition} (index ${targetIndex} from the left)
        
        CREATIVE INSTRUCTIONS:
        - Generate an engaging word problem. Use a theme that allows for distinct emojis.
        - CRITICAL: Assign a simple 1-word name/label to each emoji within the visualItems objects.
        - Ask which item is in the ${targetPosition} position.
        - The finalAnswer MUST be the NAME of the item at position index ${targetIndex} (e.g., "Apple"), not the emoji.
        - For MCQ, the "options" array must contain the correct name and 3 other unique names from your list.

        OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
        { 
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": "Look at the labeled items. Which item is in the ${targetPosition} position?", 
            "hint": "Count from the left until you reach the ${targetPosition}. Which item do you see?",
            "options": ${type === 'MCQ' ? `["[Correct Name]", "[Wrong Name 1]", "[Wrong Name 2]", "[Wrong Name 3]"]` : 'null'}, 
            "defectMap": ${type === 'MCQ' ? `{"[Wrong Name 1]": "CONCEPTUAL_ERROR", "[Wrong Name 2]": "CONCEPTUAL_ERROR", "[Wrong Name 3]": "CONCEPTUAL_ERROR"}` : 'null'},
            "finalAnswer": "[Name of the item at index ${targetIndex}]",
            "solutionSteps": "Counting from the left, the ${targetPosition} item is the [Name]."
          },
          "visualEngine": {
            "componentToRender": "ORDINAL_LINE",
            "componentData": { "items": [{"icon": "[Theme Emoji]", "label": "[Theme Word]"}, {"icon": "[Theme Emoji 2]", "label": "[Theme Word 2]"}], "direction": "left" }
          },
          "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
         }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "position_to_item", hideVisual: false }
    };
  },

  foundation_next_position: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const targetIndex = Math.floor(Math.random() * 5) + 2; // 2nd to 6th
    const askNext = Math.random() > 0.5;
    const clueIndex = askNext ? targetIndex - 1 : targetIndex + 1;
    const clueWord = askNext ? "just to the right of" : "just to the left of";
    const sName = extract(context.name);
    
    const cluePosition = ORDINAL_WORDS[clueIndex];
    const answer = ORDINAL_WORDS[targetIndex];
    const distractors = [ORDINAL_WORDS[targetIndex - 1], ORDINAL_WORDS[targetIndex + 1], ORDINAL_WORDS[targetIndex - 2]].filter(Boolean);
    let options = [...new Set([answer, ...distractors])];
    while(options.length < 4) {
      options.push(ORDINAL_WORDS[Math.floor(Math.random() * 10)]);
      options = [...new Set(options)];
    }
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a foundation_next_position question. DO NOT modify the mathematical structure or the final answer. CRITICAL: This is a text-only conceptual question. No visual rendering or "items" should be provided.
        MATH CONSTRAINTS:
        - Topic: Next/Previous Position
        - Final Answer MUST be: "${answer}"
        
        CREATIVE INSTRUCTIONS:
        ${isShort ? "- Write a short, simple question (max 2 sentences). You MUST explicitly ask a question." : "- Generate an engaging word problem using any fun theme."}
        - CRITICAL: You MUST use the localized name ${sName} in your question to add Singaporean flavor.
        - CRITICAL: The "items" array in "componentData" MUST contain exactly 0 unique objects since this is text-only.
        - Ask what ordinal position is just ${clueWord} the ${cluePosition} position.
        - CRITICAL: DO NOT include the answer "${answer}" in your question text.
        
        OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
        { 
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": "If [Name] is in the ${cluePosition} position, what position is just ${clueWord} [Name] in the line?", 
            "hint": ${JSON.stringify(getQText(`If someone is "just to the right of" you, their position number is one greater. If "just to the left of", it's one less.`, `Think: +1 for right, -1 for left.`))},
            "options": ${mcqOptions}, 
            "defectMap": ${defectMapStr},
            "finalAnswer": "${answer}",
            "solutionSteps": ${JSON.stringify(getQText(`The position ${clueWord} ${cluePosition} is ${answer}.`, `${ORDINAL_SYMBOLS[clueIndex]} ${askNext ? '+ 1' : '- 1'} = ${ORDINAL_WORDS[targetIndex]}`))}
          },
          "visualEngine": { "componentToRender": "NONE", "componentData": {} },
          "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "relative_position", hideVisual: true }
    };
  },

  foundation_last_position: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const totalItems = Math.floor(Math.random() * 5) + 5; // 5 to 9 items
    const askForSymbol = Math.random() > 0.5;
    const answer = askForSymbol ? ORDINAL_SYMBOLS[totalItems - 1] : ORDINAL_WORDS[totalItems - 1];
    const distractors = askForSymbol 
      ? [ORDINAL_SYMBOLS[totalItems - 3], ORDINAL_SYMBOLS[totalItems - 2], ORDINAL_SYMBOLS[totalItems - 4] || "1st"]
      : [ORDINAL_WORDS[totalItems - 3], ORDINAL_WORDS[totalItems - 2], ORDINAL_WORDS[totalItems - 4] || "first"];
    let options = [...new Set([answer, ...distractors])];
    while(options.length < 4) {
      options.push(askForSymbol ? ORDINAL_SYMBOLS[Math.floor(Math.random() * 10)] : ORDINAL_WORDS[Math.floor(Math.random() * 10)]);
      options = [...new Set(options)];
    }
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }
    const sItem = extract(context.items[0]);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a foundation_last_position question. DO NOT modify the mathematical structure or the final answer.
        MATH CONSTRAINTS:
        - Topic: Last Position
        - Total Items: ${totalItems}
        - Final Answer MUST be: "${answer}"
        
        CREATIVE INSTRUCTIONS:
        - Generate an engaging word problem using any relatable theme.
        
        OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
        { 
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": ${JSON.stringify(getQText(`In a row of ${numberToWords(totalItems)} items, what is the position of the last item?`, `Last of ${totalItems} = ?`))}, 
            "hint": ${JSON.stringify(getQText(`The last position in a line of items is the same as the total number of items.`, `Last position = Total items.`))},
            "options": ${mcqOptions}, 
            "defectMap": ${defectMapStr},
            "finalAnswer": "${answer}", 
            "solutionSteps": ${JSON.stringify(getQText(`Since there are ${totalItems} items, the last one is in the ${answer} position.`, `Last = ${answer}`))}
          },
          "visualEngine": { "componentToRender": "NONE", "componentData": {} },
          "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "last_position", hideVisual: true }
    };
  }
};

export const foundationLogic = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
  if (foundationVariants[activeVariant]) {
    return foundationVariants[activeVariant](config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
  }
};