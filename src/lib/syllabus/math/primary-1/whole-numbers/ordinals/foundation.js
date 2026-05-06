import { numberToWords } from '@/lib/utils/math-helpers';

const ORDINAL_WORDS = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"];
const ORDINAL_SYMBOLS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"];

export const foundationVariants = {
  foundation_direct: (config, type, getQText) => {
    const targetIdx = Math.floor(Math.random() * config.maxItems);
    const targetOrdinal = ORDINAL_SYMBOLS[targetIdx];

    return {
      aiPrompt: `You are an expert Primary 1 math question generator.
        
        MATH CONSTRAINTS:
        - Topic: Ordinal Numbers (Foundation Level)
        - Format: ${type}
        - Total items in the line: ${config.maxItems}
        - Target position to ask about: ${targetOrdinal} (from the left)
        - Final Answer MUST strictly be: "${targetOrdinal}"
        
        CREATIVE INSTRUCTIONS:
        - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay), and local settings (e.g., hawker centre, HDB void deck, MRT station).
        - Use actual, distinct emojis representing your theme in the visualItems array. The visualItems array MUST contain exactly ${config.maxItems} unique emojis that match the characters/items in your story. Example: ["🍎", "🍊", "🍌", "🍇", "🍓"]
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        {
          "questionText": ${JSON.stringify(getQText(`Identify the position of an item in a row. The answer is ${targetOrdinal}.`, `${targetOrdinal} = ?`))},
          "options": ${type === 'MCQ' ? '["1st", "2nd", "3rd", "4th"]' : 'null'},
          "visualItems": ${JSON.stringify(Array.from({ length: config.maxItems }, (_, i) => `emoji_${i + 1}` ))},
          "modelData": { "direction": "left" },
          "finalAnswer": "${targetOrdinal}",
          "solutionSteps": ${JSON.stringify(getQText(`Start counting from the left. The item is at the ${targetOrdinal} position.`, `Count to ${targetOrdinal}`))}
        }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "direct_id", hideVisual: false }
    };
  },

  foundation_item_to_position: (config, type, getQText) => {
    const totalItems = Math.floor(Math.random() * 4) + 4; // 4 to 7 items
    const targetIndex = Math.floor(Math.random() * totalItems);
    const askForSymbol = Math.random() > 0.5;
    
    const answer = askForSymbol ? ORDINAL_SYMBOLS[targetIndex] : ORDINAL_WORDS[targetIndex];
    const distractors = askForSymbol 
      ? [ORDINAL_SYMBOLS[Math.max(0, targetIndex - 1)], ORDINAL_SYMBOLS[Math.min(9, targetIndex + 1)], ORDINAL_SYMBOLS[Math.min(9, targetIndex + 2)]]
      : [ORDINAL_WORDS[Math.max(0, targetIndex - 1)], ORDINAL_WORDS[Math.min(9, targetIndex + 1)], ORDINAL_WORDS[Math.min(9, targetIndex + 2)]];
    const optionsArray = type === 'MCQ' ? JSON.stringify([distractors[0], answer, distractors[1], distractors[2]]) : 'null';

    return {
      aiPrompt: `You are an expert Primary 1 math generator.
        MATH CONSTRAINTS:
        - Topic: Item to Position
        - Total Items: ${totalItems}
        - Final Answer MUST be: "${answer}"
        
        CREATIVE INSTRUCTIONS:
        - Generate a Singapore-themed word problem. Use local names, items, and settings.
        - Choose a theme and generate an array of ${totalItems} UNIQUE emojis. The visualItems array MUST contain exactly ${totalItems} unique emojis that represent the items in your story.
        - Ask what position the [target emoji] is in.
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        { 
          "questionText": ${JSON.stringify(getQText(`Determine the position of a specific emoji in a row of ${totalItems} items. The answer is ${answer}.`, "Position = ?"))}, 
          "options": ${optionsArray}, 
          "visualItems": ${JSON.stringify(Array.from({ length: totalItems }, (_, i) => `emoji_${i + 1}` ))}, 
          "modelData": { "direction": "left" }, 
          "finalAnswer": "${answer}", 
          "solutionSteps": ${JSON.stringify(getQText(`Counting from the left, the item is in the ${answer} position.`, `Position: ${answer}`))}
        }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "item_to_position", hideVisual: false }
    };
  },

  foundation_position_to_item: (config, type, getQText) => {
    const totalItems = Math.floor(Math.random() * 4) + 4; 
    const targetIndex = Math.floor(Math.random() * totalItems);
    const askForSymbol = Math.random() > 0.5;
    const targetPosition = askForSymbol ? ORDINAL_SYMBOLS[targetIndex] : ORDINAL_WORDS[targetIndex];

    return {
      aiPrompt: `You are an expert Primary 1 math generator.
        MATH CONSTRAINTS:
        - Topic: Position to Item
        - Total Items: ${totalItems}
        - Target Position: ${targetPosition}
        
        CREATIVE INSTRUCTIONS:
        - Generate a Singapore-themed word problem.
        - Generate an array of ${totalItems} UNIQUE emojis. The visualItems array MUST contain exactly ${totalItems} unique emojis matching your theme.
         - Ask which item is in the ${targetPosition} position.
        - The finalAnswer MUST be the specific emoji that appears at that position in your visualItems array.
        - For MCQ, use 3 other emojis from your array as distractors.

        OUTPUT FORMAT (Return ONLY valid JSON):
        { 
          "questionText": ${JSON.stringify(getQText(`Identify which emoji is in the ${targetPosition} position.`, `${targetPosition} = ?`))}, 
          "options": ${type === 'MCQ' ? '["emoji_choice_1", "emoji_choice_2", "emoji_choice_3", "emoji_choice_4"]' : 'null'}, 
          "visualItems": ${JSON.stringify(Array.from({ length: totalItems }, (_, i) => `emoji_${i + 1}` ))}, 
          "modelData": { "direction": "left" }, 
          "finalAnswer": "target_emoji",
          "solutionSteps": ${JSON.stringify(getQText(`Counting from the left, the ${targetPosition} item is the [Target Emoji].`, `${targetPosition} item`))}
         }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "position_to_item", hideVisual: false }
    };
  },

  foundation_next_position: (config, type, getQText) => {
    const targetIndex = Math.floor(Math.random() * 5) + 2; // 2nd to 6th
    const askNext = Math.random() > 0.5;
    const clueIndex = askNext ? targetIndex - 1 : targetIndex + 1;
    const clueWord = askNext ? "just behind" : "just in front of";
    
    const cluePosition = ORDINAL_WORDS[clueIndex];
    const answer = ORDINAL_WORDS[targetIndex];
    const distractors = [ORDINAL_WORDS[targetIndex - 1], ORDINAL_WORDS[targetIndex + 1], ORDINAL_WORDS[targetIndex - 2]].filter(Boolean);
    const optionsArray = type === 'MCQ' ? JSON.stringify([distractors[0], answer, distractors[1], distractors[2]]) : 'null';

    return {
      aiPrompt: `You are an expert Primary 1 math generator.
        MATH CONSTRAINTS:
        - Topic: Next/Previous Position
        - Final Answer MUST be: "${answer}"
        
        CREATIVE INSTRUCTIONS:
        - Generate a Singapore-themed word problem.
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        { 
          "questionText": ${JSON.stringify(getQText(`Determine the position that is ${clueWord} the ${cluePosition} position.`, `${ORDINAL_SYMBOLS[clueIndex]} ${askNext ? '+ 1' : '- 1'} = ?`))}, 
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

    return {
      aiPrompt: `You are an expert Primary 1 math generator.
        MATH CONSTRAINTS:
        - Topic: Last Position
        - Total Items: ${totalItems}
        - Final Answer MUST be: "${answer}"
        
        CREATIVE INSTRUCTIONS:
        - Generate a Singapore-themed word problem.
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        { 
          "questionText": ${JSON.stringify(getQText(`Identify the last position among ${numberToWords(totalItems)} items.`, `Last of ${totalItems} = ?`))}, 
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