import { numberToWords } from '@/lib/utils/math-helpers';
import { getRandomContext } from '@/lib/utils/localization';

const ORDINAL_WORDS = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"];
const ORDINAL_SYMBOLS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"];

const PERSON_EMOJIS = ["👨", "👩", "👧", "👦", "🧒", "👶", "👵", "👴", "👲", "👳", "👱", "👮"];
const ITEM_EMOJIS = ["🍎", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍒", "🍍", "🥭", "🥝", "🥑"];

// Robust extraction helper for localized context objects
const extract = (val) => {
  if (typeof val !== 'object' || val === null) return String(val);
  return val.item || val.singular || val.name?.singular || val.text || val.val || String(val);
};

export const foundationVariants = {
  foundation_direct: (config, type, getQText) => {
    const targetIdx = Math.floor(Math.random() * config.maxItems);
    const targetOrdinal = ORDINAL_SYMBOLS[targetIdx];
    const context = getRandomContext('GENERAL');
    const sName = extract(context.name);
    const sItem = extract(context.items[0]);
    const visualProtocol = `\nSTRICT VISUAL PROTOCOL: You MUST generate an array of ${config.maxItems} UNIQUE emojis for the "visualItems" field. Match these emojis to the theme of your story (e.g., animals, space, toys, food). DO NOT use generic placeholders like "Item_1".`;

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a foundation_direct question. DO NOT modify the mathematical structure or the final answer.${visualProtocol}
        
        MATH CONSTRAINTS:
        - Topic: Ordinal Numbers (Foundation Level)
        - Format: ${type}
        - Total items in the line: ${config.maxItems}
        - Logic: Place a specific identifiable emoji at position ${targetOrdinal} (index ${targetIdx} from the left).
        - Final Answer MUST strictly be: "${targetOrdinal}"
        
        CREATIVE INSTRUCTIONS:
        - Generate an engaging word problem. You may use any fun or relatable theme (e.g., animals, space, toys, food, sports) that allows for a wide variety of colorful emojis.
        - The visualItems array MUST contain exactly ${config.maxItems} unique emojis that perfectly match your chosen theme.
        - Identify the specific emoji you placed at the ${targetOrdinal} spot and ask for its position in the question text.
        - CRITICAL: DO NOT include the answer "${targetOrdinal}" in your question text.
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        {
          "questionText": "Look at the row of items. What is the position of the [Chosen Emoji] from the left?",
          "hint": "Start counting from the left side. Which position is the [Chosen Emoji] in?",
          "options": ${type === 'MCQ' ? JSON.stringify(ORDINAL_SYMBOLS.slice(0, 4)) : 'null'},
          "visualItems": ["emoji1", "emoji2", "emoji3", "emoji4", "emoji5"],
          "modelData": { "direction": "left" },
          "finalAnswer": "${targetOrdinal}",
          "solutionSteps": "Start counting from the left. The [Chosen Emoji] is at the ${targetOrdinal} position."
        }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "direct_id", hideVisual: false }
    };
  },

  foundation_item_to_position: (config, type, getQText) => {
    const totalItems = Math.floor(Math.random() * 4) + 4; // 4 to 7 items
    const targetIndex = Math.floor(Math.random() * totalItems);
    const askForSymbol = Math.random() > 0.5;
    const context = getRandomContext('GENERAL');
    const sItem = extract(context.items[0]);
    const visualProtocol = `\nSTRICT VISUAL PROTOCOL: You MUST generate an array of ${totalItems} UNIQUE emojis for the "visualItems" field. Match these emojis to the theme of your story.`;
    
    const answer = askForSymbol ? ORDINAL_SYMBOLS[targetIndex] : ORDINAL_WORDS[targetIndex];
    const distractors = askForSymbol 
      ? [ORDINAL_SYMBOLS[Math.max(0, targetIndex - 1)], ORDINAL_SYMBOLS[Math.min(9, targetIndex + 1)], ORDINAL_SYMBOLS[Math.min(9, targetIndex + 2)]]
      : [ORDINAL_WORDS[Math.max(0, targetIndex - 1)], ORDINAL_WORDS[Math.min(9, targetIndex + 1)], ORDINAL_WORDS[Math.min(9, targetIndex + 2)]];
    const optionsArray = type === 'MCQ' ? JSON.stringify([distractors[0], answer, distractors[1], distractors[2]]) : 'null';

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a foundation_item_to_position question. DO NOT modify the mathematical structure or the final answer.${visualProtocol}
        MATH CONSTRAINTS:
        - Topic: Item to Position
        - Total Items: ${totalItems}
        - Logic: Place a specific emoji at position index ${targetIndex} (from the left).
        - Final Answer MUST be: "${answer}"
        
        CREATIVE INSTRUCTIONS:
        - Generate an engaging word problem. You may use any fun theme (e.g., jungle, ocean, bakery) that allows for a variety of colorful emojis.
        - The visualItems array MUST contain exactly ${totalItems} unique emojis that perfectly match your chosen theme.
        - Identify the specific emoji you placed at position index ${targetIndex} and ask what position it is in.
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        { 
          "questionText": "Look at the row of items. Counting from the left, what is the position of the [Target Emoji]?", 
          "hint": "Start counting from the left. Which position is the [Target Emoji]?",
          "options": ${optionsArray}, 
          "visualItems": ["emoji1", "emoji2", "..."], 
          "modelData": { "direction": "left" }, 
          "finalAnswer": "${answer}", 
          "solutionSteps": "Counting from the left, the [Target Emoji] is in the ${answer} position."
        }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "item_to_position", hideVisual: false }
    };
  },

  foundation_position_to_item: (config, type, getQText) => {
    const totalItems = Math.floor(Math.random() * 2) + 4; // 4 to 5 items for Foundation
    const targetIndex = Math.floor(Math.random() * totalItems);
    const askForSymbol = Math.random() > 0.5;
    const targetPosition = askForSymbol ? ORDINAL_SYMBOLS[targetIndex] : ORDINAL_WORDS[targetIndex];
    const context = getRandomContext('GENERAL');
    const sItem = extract(context.items[0]);
    const visualProtocol = `\nSTRICT VISUAL PROTOCOL: You MUST generate an array of ${totalItems} UNIQUE emojis for the "visualItems" field. Match these emojis to the theme of your story. Use a variety of distinct objects.`;

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a foundation_position_to_item question. DO NOT modify the mathematical structure or the final answer.${visualProtocol}
        MATH CONSTRAINTS:
        - Topic: Position to Item
        - Total Items: ${totalItems}
        - Target Position: ${targetPosition} (index ${targetIndex} from the left)
        
        CREATIVE INSTRUCTIONS:
        - Generate an engaging word problem. You may use any fun theme (e.g., vehicles, monsters, garden) that allows for a variety of colorful emojis.
        - The visualItems array MUST contain exactly ${totalItems} unique emojis that match your chosen theme.
        - Ask which item is in the ${targetPosition} position.
        - The finalAnswer MUST be the specific emoji you place at position index ${targetIndex}.
        - For MCQ, the "options" array must contain the correct emoji and 3 other unique emojis from your visualItems list.

        OUTPUT FORMAT (Return ONLY valid JSON):
        { 
          "questionText": "Look at the row of items. Which item is in the ${targetPosition} position?", 
          "hint": "Count from the left until you reach the ${targetPosition}. Which item do you see?",
          "options": ["emoji1", "emoji2", "emoji3", "emoji4"], 
          "visualItems": ["emoji1", "emoji2", "..."], 
          "modelData": { "direction": "left" }, 
          "finalAnswer": "[Correct Emoji from index ${targetIndex}]",
          "solutionSteps": "Counting from the left, the ${targetPosition} item is the [Correct Emoji]."
         }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "position_to_item", hideVisual: false }
    };
  },

  foundation_next_position: (config, type, getQText) => {
    const targetIndex = Math.floor(Math.random() * 5) + 2; // 2nd to 6th
    const askNext = Math.random() > 0.5;
    const clueIndex = askNext ? targetIndex - 1 : targetIndex + 1;
    const clueWord = askNext ? "just behind" : "just in front of";
    const context = getRandomContext('GENERAL');
    const sName = extract(context.name);
    
    const cluePosition = ORDINAL_WORDS[clueIndex];
    const answer = ORDINAL_WORDS[targetIndex];
    const distractors = [ORDINAL_WORDS[targetIndex - 1], ORDINAL_WORDS[targetIndex + 1], ORDINAL_WORDS[targetIndex - 2]].filter(Boolean);
    const optionsArray = type === 'MCQ' ? JSON.stringify([distractors[0], answer, distractors[1], distractors[2]]) : 'null';

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a foundation_next_position question. DO NOT modify the mathematical structure or the final answer.
        MATH CONSTRAINTS:
        - Topic: Next/Previous Position
        - Final Answer MUST be: "${answer}"
        
        CREATIVE INSTRUCTIONS:
        - Generate an engaging word problem using any relatable theme (e.g., family, classroom, animals).
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        { 
          "questionText": "If [Name] is in the ${cluePosition} position, what position is just ${clueWord} [Name] in the line?", 
          "hint": ${JSON.stringify(getQText(`If someone is "just behind" you, their position number is one greater. If "just in front", it's one less.`, `Think: +1 for behind, -1 for in front.`))},
          "options": ${optionsArray}, 
          "visualItems": [], 
          "finalAnswer": "${answer}", 
          "solutionSteps": ${JSON.stringify(getQText(`The position ${clueWord} ${cluePosition} is ${answer}.`, `${ORDINAL_SYMBOLS[clueIndex]} ${askNext ? '+ 1' : '- 1'} = ${ORDINAL_WORDS[targetIndex]}`))}
        }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "relative_position", hideVisual: true }
    };
  },

  foundation_last_position: (config, type, getQText) => {
    const totalItems = Math.floor(Math.random() * 5) + 5; // 5 to 9 items
    const askForSymbol = Math.random() > 0.5;
    const answer = askForSymbol ? ORDINAL_SYMBOLS[totalItems - 1] : ORDINAL_WORDS[totalItems - 1];
    const distractors = askForSymbol 
      ? [ORDINAL_SYMBOLS[totalItems - 3], ORDINAL_SYMBOLS[totalItems - 2], ORDINAL_SYMBOLS[totalItems - 4] || "1st"]
      : [ORDINAL_WORDS[totalItems - 3], ORDINAL_WORDS[totalItems - 2], ORDINAL_WORDS[totalItems - 4] || "first"];
    const optionsArray = type === 'MCQ' ? JSON.stringify([distractors[0], distractors[1], answer, distractors[2]]) : 'null';
    const context = getRandomContext('GENERAL');
    const sItem = extract(context.items[0]);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a foundation_last_position question. DO NOT modify the mathematical structure or the final answer.
        MATH CONSTRAINTS:
        - Topic: Last Position
        - Total Items: ${totalItems}
        - Final Answer MUST be: "${answer}"
        
        CREATIVE INSTRUCTIONS:
        - Generate an engaging word problem using any relatable theme.
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        { 
          "questionText": ${JSON.stringify(getQText(`In a row of ${numberToWords(totalItems)} items, what is the position of the last item?`, `Last of ${totalItems} = ?`))}, 
          "hint": ${JSON.stringify(getQText(`The last position in a line of items is the same as the total number of items.`, `Last position = Total items.`))},
          "options": ${optionsArray}, 
          "visualItems": [], 
          "finalAnswer": "${answer}", 
          "solutionSteps": ${JSON.stringify(getQText(`Since there are ${totalItems} items, the last one is in the ${answer} position.`, `Last = ${answer}`))}
        }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "last_position", hideVisual: true }
    };
  }
};

export const foundationLogic = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
  return foundationVariants[activeVariant](config, type, getQText);
};