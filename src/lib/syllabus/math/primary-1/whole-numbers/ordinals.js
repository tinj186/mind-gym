/**
 * Blueprint for Primary 1: Ordinal Numbers
 * ENGINE: Generates AI prompt constraints, leaving creative generation to the LLM.
 * ARCHITECTURE: Route strictly controls variation via the 'variant' argument.
 */

export const ordinalsBlueprint = {
  id: 'p1-ordinals',
  title: 'Ordinal Numbers',
  strand: 'Number and Algebra',
  visualType: 'ORDINAL_LINE',

  // 1. OVERARCHING CONDITIONS (Logical Constraints)
  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxItems: 5,
      requiresStateChange: false,
      directionalLogic: "fixed",
      integration: null
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      maxItems: 10,
      requiresStateChange: true,
      directionalLogic: "variable",
      integration: "internal"
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 3,
      maxItems: 12,
      requiresStateChange: true,
      directionalLogic: "relative",
      integration: ["Addition", "Subtraction", "Comparison"]
    }
  },

  // 2. STRICT VARIANTS (Controlled by Route)
  variants: {
    foundation_direct: "Direct identification based on a row of icons.",
    foundation_item_to_position: "Identify the ordinal position of a specific item.",
    foundation_position_to_item: "Identify the item located at a specific ordinal position.",
    foundation_next_position: "Identify the ordinal position immediately after a given position.",
    foundation_last_position: "Identify the ordinal position of the last item in a queue.",
    standard_reverse: "Multi-step reverse mapping (Front to Back).",
    standard_change: "State change where an item leaves the queue.",
    standard_from_the_right: "Identifying the position of an item when counting from the right.",
    standard_join_front: "State change: finding a new position after an item joins the front of the queue.",
    standard_leave_front: "State change: finding a new position after the first item leaves the queue.",
    standard_relative_ahead: "Finding a position a specific number of steps ahead of another.",
    standard_relative_behind: "Finding a position a specific number of steps behind another.",
    standard_between_positions: "Identifying the exact position between two given positions.",
    standard_find_total: "Calculating the total items based on an item's position from the front and back.",
    standard_swap_positions: "State change: identifying a position after two items swap places.",
    advanced_container: "Targeted container addition (e.g., apples in bags).",
    advanced_comparison: "Mental comparison between two positions (no visual).",
    advanced_bidirectional_total: "Finding total items when given an item's position from both the left and the right.",
    advanced_multiple_leaves: "State change: Finding a new position after multiple people ahead leave the queue.",
    advanced_shift_position: "State change: Finding a new position after moving a specific number of places forward.",
    advanced_gap_calculation: "Logic puzzle: Calculating how many items are between two given ordinal positions.",
    advanced_overtake_race: "Dynamic scenario: Finding a new position after overtaking runners in a race.",
    advanced_ordinal_clues: "Logic puzzle: Deducing a position from a chain of 'just behind' or 'just ahead' clues.",
    advanced_net_queue_change: "Complex state change: People join AND leave the front of the queue.",
    advanced_relative_target: "Finding how many positions an item needs to move up to reach a target ordinal position."
  },

  // 3. GENERATION ENGINE
  generate: (difficulty = 'foundation', variant = 'foundation_direct', type = 'MCQ') => {
    
    // --- LEGACY ADAPTER: Intercept and map old frontend requests to randomize variations ---
    let activeVariant = variant;
    
    // If the frontend sends an old variant (like 'visual_line') that doesn't exist 
    // in our strict variants dictionary, randomly pick a valid one for this difficulty.
    if (!ordinalsBlueprint.variants[variant]) {
      const validVariants = Object.keys(ordinalsBlueprint.variants).filter(k => k.startsWith(difficulty));
      
      if (validVariants.length > 0) {
        // Flips a coin on EVERY loop iteration from route.js
        activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
      } else {
        // Failsafe fallback
        activeVariant = 'foundation_direct'; 
      }
    }
    // ---------------------------------------------------------------

    const config = ordinalsBlueprint.difficultyLevels[difficulty] || ordinalsBlueprint.difficultyLevels.foundation;

    const formatInstructions = type === 'MCQ' 
      ? `Format as MCQ. Include an "options" array with 4 choices. "finalAnswer" must exactly match one of the options.` 
      : `Format as Short Answer. The "options" field in your JSON should be null.`;

    // --- FOUNDATION: Direct Identification ---
    if (difficulty === 'foundation' && activeVariant === 'foundation_direct') {
      const targetIdx = Math.floor(Math.random() * config.maxItems);
      const ordinalWords = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"];
      const targetOrdinal = ordinalWords[targetIdx];

      return {
        aiPrompt: `You are an expert Primary 1 math question generator.
        
        MATH CONSTRAINTS:
        - Topic: Ordinal Numbers (Foundation Level)
        - Format: ${type}
        - Total items in the line: ${config.maxItems}
        - Target position to ask about: ${targetOrdinal} (from the left)
        - Final Answer MUST strictly be: "${targetOrdinal}"
        ${formatInstructions}
        
        CREATIVE INSTRUCTIONS:
        - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).
        - Use actual, distinct emojis representing your theme in the visualItems array.
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        {
          "question": "[Insert full localized Singaporean word problem here]",
          "options": ${type === 'MCQ' ? '["1st", "2nd", "3rd", "4th"]' : 'null'},
          "visualItems": ["🐶", "🐱", "🐰", "🦊"],
          "modelData": { "direction": "left" },
          "finalAnswer": "${targetOrdinal}",
          "solution": "Start counting from the left... The item is at position ${targetOrdinal}."
        }`,
        metadata: { difficulty, steps: 1, logic: "direct_id", hideVisual: false }
      };
    }

    // Helper arrays for ordinals
    const ordinalWords = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"];
    const ordinalSymbols = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"];

    // 2. Item to Position
    if (activeVariant === 'foundation_item_to_position') {
      const totalItems = Math.floor(Math.random() * 4) + 4; // 4 to 7 items
      const targetIndex = Math.floor(Math.random() * totalItems);
      const askForSymbol = Math.random() > 0.5;
      
      const answer = askForSymbol ? ordinalSymbols[targetIndex] : ordinalWords[targetIndex];
      const distractors = askForSymbol 
        ? [ordinalSymbols[Math.max(0, targetIndex - 1)], ordinalSymbols[Math.min(9, targetIndex + 1)], ordinalSymbols[Math.min(9, targetIndex + 2)]]
        : [ordinalWords[Math.max(0, targetIndex - 1)], ordinalWords[Math.min(9, targetIndex + 1)], ordinalWords[Math.min(9, targetIndex + 2)]];
      
      const optionsArray = type === 'MCQ' ? `["${distractors[0]}", "${answer}", "${distractors[1]}", "${distractors[2]}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Item to Position\n - Total Items: ${totalItems}\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n - Choose a theme and generate an array of ${totalItems} UNIQUE emojis.\n - Ask what position the [target emoji] is in.\n - The visualItems array must contain the plain emojis, NOT JSON objects.\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${optionsArray}, "visualItems": ["emoji1", "emoji2", "..."], "modelData": { "direction": "left" }, "finalAnswer": "${answer}", "solution": "Counting from the left, the item is in the ${answer} position." }`,
        metadata: { difficulty, steps: 1, logic: "item_to_position", hideVisual: false }
      };
    }

    // 3. Position to Item
    if (activeVariant === 'foundation_position_to_item') {
      const totalItems = Math.floor(Math.random() * 4) + 4; // 4 to 7 items
      const targetIndex = Math.floor(Math.random() * totalItems);
      const askForSymbol = Math.random() > 0.5;
      const targetPosition = askForSymbol ? ordinalSymbols[targetIndex] : ordinalWords[targetIndex];

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Position to Item\n - Total Items: ${totalItems}\n - Target Position: ${targetPosition}\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n - Generate an array of ${totalItems} UNIQUE emojis.\n - Ask which item is in the ${targetPosition} position.\n - The finalAnswer MUST be the exact emoji at index ${targetIndex}.\n - For MCQ, use 3 other emojis from the array as distractors.\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${type === 'MCQ' ? `["emoji_A", "emoji_B", "final_emoji", "emoji_C"]` : 'null'}, "visualItems": ["🐶", "🐱", "🐰", "🦊"], "modelData": { "direction": "left" }, "finalAnswer": "[Target Emoji]", "solution": "Counting from the left, the ${targetPosition} item is the [Target Emoji]." }`,
        metadata: { difficulty, steps: 1, logic: "position_to_item", hideVisual: false }
      };
    }

    // 4. Next/Previous Position
    if (activeVariant === 'foundation_next_position') {
      const targetIndex = Math.floor(Math.random() * 5) + 2; // 2nd to 6th (indices 1 to 5)
      const askNext = Math.random() > 0.5;
      const clueIndex = askNext ? targetIndex - 1 : targetIndex + 1;
      const clueWord = askNext ? "just behind" : "just in front of";
      
      const cluePosition = ordinalWords[clueIndex];
      const answer = ordinalWords[targetIndex];
      const optionsArray = type === 'MCQ' ? `["${ordinalWords[targetIndex - 2]}", "${ordinalWords[targetIndex - 1]}", "${answer}", "${ordinalWords[targetIndex + 1]}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Next/Previous Position\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "The position ${clueWord} ${cluePosition} is ${answer}." }`,
        metadata: { difficulty, steps: 1, logic: "relative_position", hideVisual: true }
      };
    }

    // 5. Last Position
    if (activeVariant === 'foundation_last_position') {
      const totalItems = Math.floor(Math.random() * 5) + 5; // 5 to 9 items
      const askForSymbol = Math.random() > 0.5;
      const answer = askForSymbol ? ordinalSymbols[totalItems - 1] : ordinalWords[totalItems - 1];
      const optionsArray = type === 'MCQ' ? `["${askForSymbol ? ordinalSymbols[totalItems - 3] : ordinalWords[totalItems - 3]}", "${askForSymbol ? ordinalSymbols[totalItems - 2] : ordinalWords[totalItems - 2]}", "${answer}", "${askForSymbol ? ordinalSymbols[totalItems] : ordinalWords[totalItems]}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Last Position\n - Total Items: ${totalItems}\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "Since there are ${totalItems} children, the last child is in the ${answer} position." }`,
        metadata: { difficulty, steps: 1, logic: "last_position", hideVisual: true }
      };
    }

    // --- STANDARD: Multi-Step Reverse Logic ---
    if (difficulty === 'standard' && activeVariant === 'standard_reverse') {
      const totalItems = Math.floor(Math.random() * 4) + 5; // 5 to 8
      const ordinalWords = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"];
      const targetFromFront = Math.floor(Math.random() * (totalItems - 2)) + 2;
      const targetFromBack = totalItems - targetFromFront + 1;

      return {
        aiPrompt: `You are an expert Primary 1 math question generator.
        
        MATH CONSTRAINTS:
        - Topic: Ordinal Numbers (Standard Level - Reverse Logic)
        - Format: ${type}
        - Total items: ${totalItems}
        - Condition: A specific item is ${ordinalWords[targetFromFront - 1]} from the FRONT.
        - Question: Ask for that item's position from the BACK.
        - Final Answer MUST strictly be: "${ordinalWords[targetFromBack - 1]}"
        ${formatInstructions}
        
        CREATIVE INSTRUCTIONS:
        - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).
        - The visualItems array MUST contain unique emojis representing these items.
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        {
          "question": "[Insert full localized Singaporean word problem here]",
          "options": ${type === 'MCQ' ? '["1st", "2nd", "3rd", "4th"]' : 'null'},
          "visualItems": ["🐶", "🐱", "🐰", "🦊"],
          "modelData": { "direction": "left" },
          "finalAnswer": "${ordinalWords[targetFromBack - 1]}",
          "solution": "Step-by-step reverse counting explanation."
        }`,
        metadata: { difficulty, steps: 2, logic: "reverse_mapping", hideVisual: false }
      };
    }

    // --- STANDARD: Multi-Step State Change ---
    if (difficulty === 'standard' && activeVariant === 'standard_change') {
      const totalItems = Math.floor(Math.random() * 4) + 5;
      return {
        aiPrompt: `You are an expert Primary 1 math question generator.
        
        MATH CONSTRAINTS:
        - Topic: Ordinal Numbers (Standard Level - State Change)
        - Format: ${type}
        - Total items: ${totalItems}
        - Initial state: A character/item is 4th from the front.
        - Event: 1 character/item leaves from the VERY FRONT of the line.
        - Question: Ask for the character's NEW position.
        - Final Answer MUST strictly be: "3rd"
        ${formatInstructions}
        
        CREATIVE INSTRUCTIONS:
        - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).
        - Include a visualItems array of emojis representing the queue.
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        {
          "question": "[Insert full localized Singaporean word problem here]",
          "options": ${type === 'MCQ' ? '["1st", "2nd", "3rd", "4th"]' : 'null'},
          "visualItems": ["🐶", "🐱", "🐰", "🦊"], // Example for AI
          "modelData": { "direction": "left" },
          "finalAnswer": "3rd",
          "solution": "Step-by-step subtraction explanation."
        }`,
        metadata: { difficulty, steps: 2, logic: "state_change", hideVisual: false }
      };
    }

    // Helper arrays (Ensuring scope for Standard tier)
    const ordWords = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"];
    const ordSymbols = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];

    // 3. Counting from the Right
    if (activeVariant === 'standard_from_the_right') {
      const totalItems = Math.floor(Math.random() * 4) + 5; // 5 to 8 items
      const targetIndex = Math.floor(Math.random() * totalItems); // 0 to total-1
      const rightPositionIndex = totalItems - 1 - targetIndex;
      const answer = ordWords[rightPositionIndex];
      const optionsArray = type === 'MCQ' ? `["${ordWords[Math.max(0, rightPositionIndex - 1)]}", "${answer}", "${ordWords[Math.min(9, rightPositionIndex + 1)]}", "${ordWords[Math.min(9, rightPositionIndex + 2)]}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Counting from the right\n - Total Items: ${totalItems}\n - Target Item Index (from left): ${targetIndex}\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n - Generate an array of ${totalItems} UNIQUE emojis.\n - Ask what position the [target emoji] is in, counting from the RIGHT.\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${optionsArray}, "visualItems": ["emoji1", "emoji2", "..."], "modelData": { "direction": "right" }, "finalAnswer": "${answer}", "solution": "Counting from the right side, the item is in the ${answer} position." }`,
        metadata: { difficulty, steps: 2, logic: "reverse_directional", hideVisual: false }
      };
    }

    // 4. Join Front of Queue
    if (activeVariant === 'standard_join_front') {
      const startPos = Math.floor(Math.random() * 5) + 2; // 2nd to 6th (index 1 to 5)
      const newPos = startPos + 1; // Shifts back by 1
      const answer = ordWords[newPos - 1];
      const optionsArray = type === 'MCQ' ? `["${ordWords[startPos - 2]}", "${ordWords[startPos - 1]}", "${answer}", "${ordWords[newPos]}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Queue State Change (Join Front)\n - Initial Position: ${ordWords[startPos - 1]}\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "Since 1 person joined the front, everyone moves back 1 place. Tom moves from ${ordWords[startPos - 1]} to ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "queue_addition", hideVisual: true }
      };
    }

    // 5. Leave Front of Queue
    if (activeVariant === 'standard_leave_front') {
      const startPos = Math.floor(Math.random() * 5) + 3; // 3rd to 7th
      const newPos = startPos - 1; // Shifts forward by 1
      const answer = ordWords[newPos - 1];
      const optionsArray = type === 'MCQ' ? `["${ordWords[newPos - 2]}", "${answer}", "${ordWords[startPos - 1]}", "${ordWords[startPos]}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Queue State Change (Leave Front)\n - Initial Position: ${ordWords[startPos - 1]}\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "Since the 1st person left, everyone moves up 1 place. Mary moves from ${ordWords[startPos - 1]} to ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "queue_subtraction", hideVisual: true }
      };
    }

    // 6. Relative Position Ahead
    if (activeVariant === 'standard_relative_ahead') {
      const basePos = Math.floor(Math.random() * 4) + 5; // 5th to 8th
      const stepsAhead = Math.floor(Math.random() * 3) + 2; // 2 to 4
      const targetPos = basePos - stepsAhead;
      const answer = ordWords[targetPos - 1];
      const optionsArray = type === 'MCQ' ? `["${ordWords[Math.max(0, targetPos - 2)]}", "${answer}", "${ordWords[targetPos]}", "${ordWords[basePos + stepsAhead - 1]}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Relative Position (Ahead)\n - Base Position: ${ordWords[basePos - 1]}\n - Steps Ahead: ${stepsAhead}\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "${basePos} - ${stepsAhead} = ${targetPos}. The red car is in the ${answer} position." }`,
        metadata: { difficulty, steps: 2, logic: "relative_ahead", hideVisual: true }
      };
    }

    // 7. Relative Position Behind
    if (activeVariant === 'standard_relative_behind') {
      const basePos = Math.floor(Math.random() * 4) + 2; // 2nd to 5th
      const stepsBehind = Math.floor(Math.random() * 3) + 2; // 2 to 4
      const targetPos = basePos + stepsBehind;
      const answer = ordWords[targetPos - 1];
      const optionsArray = type === 'MCQ' ? `["${ordWords[targetPos - 3]}", "${ordWords[targetPos - 2]}", "${answer}", "${ordWords[targetPos]}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Relative Position (Behind)\n - Base Position: ${ordWords[basePos - 1]}\n - Steps Behind: ${stepsBehind}\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "${basePos} + ${stepsBehind} = ${targetPos}. The dog is in the ${answer} position." }`,
        metadata: { difficulty, steps: 2, logic: "relative_behind", hideVisual: true }
      };
    }

    // 8. Between Positions
    if (activeVariant === 'standard_between_positions') {
      const startPos = Math.floor(Math.random() * 5) + 1; // 1st to 5th
      const endPos = startPos + 2; // e.g., 1st and 3rd
      const targetPos = startPos + 1;
      const answer = ordWords[targetPos - 1];
      const optionsArray = type === 'MCQ' ? `["${ordWords[startPos - 2] || "zero"}", "${ordWords[startPos - 1]}", "${answer}", "${ordWords[endPos - 1]}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Position Between\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "The position directly between the two given positions is ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "position_between", hideVisual: true }
      };
    }

    // 9. Find Total Items
    if (activeVariant === 'standard_find_total') {
      const frontPos = Math.floor(Math.random() * 4) + 2; // 2 to 5
      const backPos = Math.floor(Math.random() * 4) + 2; // 2 to 5
      const total = frontPos + backPos - 1; // Formula for overlapping position
      const answer = String(total);
      const optionsArray = type === 'MCQ' ? `["${total - 2}", "${total - 1}", "${answer}", "${total + 1}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Total Items from Front and Back\n - Front Position: ${ordWords[frontPos - 1]}\n - Back Position: ${ordWords[backPos - 1]}\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "There are ${frontPos - 1} items above/ahead and ${backPos - 1} items below/behind. ${frontPos - 1} + 1 + ${backPos - 1} = ${total} items." }`,
        metadata: { difficulty, steps: 2, logic: "total_from_ordinals", hideVisual: true }
      };
    }

    // 10. Swap Positions
    if (activeVariant === 'standard_swap_positions') {
      const posA = Math.floor(Math.random() * 3) + 1; // 1 to 3
      const posB = posA + Math.floor(Math.random() * 4) + 2; // 3 to 8
      const answer = ordWords[posA - 1];
      const optionsArray = type === 'MCQ' ? `["${ordWords[posA - 2] || "zero"}", "${answer}", "${ordWords[posB - 1]}", "${ordWords[posB]}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Swapping Positions\n - Position A: ${ordWords[posA - 1]}\n - Position B: ${ordWords[posB - 1]}\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "They traded places, so the item takes the other's spot in the ${answer} position." }`,
        metadata: { difficulty, steps: 2, logic: "position_swap", hideVisual: true }
      };
    }

    // --- ADVANCED: Targeted Container Addition ---
    if (difficulty === 'advanced' && activeVariant === 'advanced_container') {
      const numContainers = 4;
      const ordinals = ["1st", "2nd", "3rd", "4th", "5th"];

      let idx1 = Math.floor(Math.random() * numContainers);
      let idx2;
      do { idx2 = Math.floor(Math.random() * numContainers); } while (idx1 === idx2);
      
      const sortedIndices = [idx1, idx2].sort();
      const target1 = ordinals[sortedIndices[0]];
      const target2 = ordinals[sortedIndices[1]];

      const count1 = Math.floor(Math.random() * 4) + 2; // 2 to 5 items
      const count2 = Math.floor(Math.random() * 4) + 2; // 2 to 5 items
      const total = count1 + count2;

      return {
        aiPrompt: `You are an expert Primary 1 math question generator.
        
        MATH CONSTRAINTS:
        - Topic: Ordinal Numbers + Addition (Advanced Level)
        - Format: ${type}
        - Setup: There are ${numContainers} groups/containers of items in a row.
        - Condition 1: The ${target1} group MUST contain exactly ${count1} items.
        - Condition 2: The ${target2} group MUST contain exactly ${count2} items.
        - Question: Ask the student to count the TOTAL number of items in the ${target1} and ${target2} groups combined.
        - Final Answer MUST strictly be: "${total}"
        ${formatInstructions}
        
        CREATIVE INSTRUCTIONS:
        - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).
        - The "visualItems" array MUST contain exactly ${numContainers} strings. Each string represents a group using repeated emojis. (Example: ["🍪🍪🍪", "🍪", "🍪🍪🍪🍪", "🍪🍪"]).
        - Make sure the string at the ${target1} position has exactly ${count1} emojis, and the string at the ${target2} position has exactly ${count2} emojis.
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        {
          "question": "[Insert full localized Singaporean word problem here]",
          "options": ${type === 'MCQ' ? `["${total - 1}", "${total}", "${total + 1}", "${total + 2}"]` : 'null'},
          "visualItems": ["emoji string 1", "emoji string 2", "emoji string 3", "emoji string 4"],
          "finalAnswer": "${total}",
          "solution": "Step 1: The ${target1} group has ${count1}. Step 2: The ${target2} group has ${count2}. Step 3: ${count1} + ${count2} = ${total}."
        }`,
        metadata: { difficulty, steps: 3, integratedTopics: ['Ordinals', 'Addition'], logic: "container_addition", hideVisual: false }
      };
    }

    // --- ADVANCED: Mental Comparison ---
    if (difficulty === 'advanced' && activeVariant === 'advanced_comparison') {
      const ordinalWords = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"];
      const startPos = Math.floor(Math.random() * 3) + 1; // 1st to 3rd
      const gap = Math.floor(Math.random() * 3) + 2; // 2 to 4 positions behind
      const targetPos = startPos + gap;

      return {
        aiPrompt: `You are an expert Primary 1 math question generator.
          
          MATH CONSTRAINTS:
          - Topic: Ordinal Numbers + Comparison (Advanced Level)
          - Format: ${type}
          - Condition 1: Character A is ${ordinalWords[startPos - 1]} in a race/queue.
          - Condition 2: Character B is ${gap} positions behind Character A.
          - Question: What is Character B's position?
          - Final Answer MUST strictly be: "${ordinalWords[targetPos - 1]}"
          ${formatInstructions}
          
          CREATIVE INSTRUCTIONS:
          - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).
          - Do NOT include visuals or emojis.
          
          OUTPUT FORMAT (Return ONLY valid JSON):
          {
            "question": "[Insert full localized Singaporean word problem here]",
            "options": ${type === 'MCQ' ? `["${ordinalWords[targetPos - 2]}", "${ordinalWords[targetPos - 1]}", "${ordinalWords[targetPos]}", "${ordinalWords[targetPos + 1]}"]` : 'null'},
            "visualItems": [],
            "finalAnswer": "${ordinalWords[targetPos - 1]}",
            "solution": "Step-by-step explanation showing ${startPos} + ${gap} = ${targetPos}."
          }`,
        visualItems: [],
        metadata: { difficulty, steps: 2, integratedTopics: ['Ordinals', 'Comparison'], logic: "relative_offset", hideVisual: true }
      };
    }

    // 3. Bidirectional Total
    if (activeVariant === 'advanced_bidirectional_total') {
      const leftPos = Math.floor(Math.random() * 4) + 2; // 2 to 5
      const rightPos = Math.floor(Math.random() * 4) + 2; // 2 to 5
      const total = leftPos + rightPos - 1;
      const answer = String(total);
      const optionsArray = type === 'MCQ' ? `["${total - 2}", "${total - 1}", "${answer}", "${total + 1}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Bidirectional Ordinals\n - Left Position: ${ordWords[leftPos - 1]}\n - Right Position: ${ordWords[rightPos - 1]}\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "There are ${leftPos - 1} items on its left and ${rightPos - 1} items on its right. ${leftPos - 1} + 1 + ${rightPos - 1} = ${total} items." }`,
        metadata: { difficulty, steps: 3, logic: "bidirectional_total", hideVisual: true }
      };
    }

    // 4. Multiple Leaves
    if (activeVariant === 'advanced_multiple_leaves') {
      const startPos = Math.floor(Math.random() * 4) + 6; // 6 to 9 (6th to 9th)
      const leaves = Math.floor(Math.random() * 3) + 2; // 2 to 4
      const newPos = startPos - leaves;
      const answer = ordWords[newPos - 1];
      const optionsArray = type === 'MCQ' ? `["${ordWords[newPos - 2] || "zero"}", "${answer}", "${ordWords[newPos]}", "${ordWords[startPos - 1]}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Multiple Queue Exits\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "${startPos} - ${leaves} = ${newPos}. The person moves forward ${leaves} spaces to the ${answer} position." }`,
        metadata: { difficulty, steps: 2, logic: "multiple_subtractions", hideVisual: true }
      };
    }

    // 5. Shift Position Forward
    if (activeVariant === 'advanced_shift_position') {
      const startPos = Math.floor(Math.random() * 4) + 6; // 6th to 9th
      const shift = Math.floor(Math.random() * 3) + 2; // 2 to 4
      const newPos = startPos - shift;
      const answer = ordWords[newPos - 1];
      const optionsArray = type === 'MCQ' ? `["${ordWords[newPos - 2] || "zero"}", "${answer}", "${ordWords[newPos]}", "${ordWords[startPos - 1]}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Shifting Positions\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "${startPos} - ${shift} = ${newPos}. The person is now in the ${answer} position." }`,
        metadata: { difficulty, steps: 2, logic: "forward_shift", hideVisual: true }
      };
    }

    // 6. Gap Calculation
    if (activeVariant === 'advanced_gap_calculation') {
      const posA = Math.floor(Math.random() * 3) + 1; // 1 to 3
      const posB = posA + Math.floor(Math.random() * 4) + 3; // +3 to +6 gaps
      const gap = posB - posA - 1;
      const answer = String(gap);
      const optionsArray = type === 'MCQ' ? `["${gap - 1}", "${answer}", "${gap + 1}", "${gap + 2}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Gap Between Ordinals\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "${posB} - ${posA} - 1 = ${gap}. There are ${answer} items between them." }`,
        metadata: { difficulty, steps: 2, logic: "gap_calculation", hideVisual: true }
      };
    }

    // 7. Overtake Race
    if (activeVariant === 'advanced_overtake_race') {
      const startPos = Math.floor(Math.random() * 4) + 4; // 4th to 7th
      const overtakeCount = Math.floor(Math.random() * 2) + 1; // 1 to 2
      const newPos = startPos - overtakeCount;
      const answer = ordWords[newPos - 1];
      const optionsArray = type === 'MCQ' ? `["${ordWords[newPos - 2] || "zero"}", "${answer}", "${ordWords[newPos]}", "${ordWords[startPos - 1]}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Overtaking in a Race\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "Overtaking means moving forward. ${startPos} - ${overtakeCount} = ${newPos}. The person is now ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "overtake_logic", hideVisual: true }
      };
    }

    // 8. Ordinal Clues Chain
    if (activeVariant === 'advanced_ordinal_clues') {
      const posA = Math.floor(Math.random() * 4) + 1; // 1st to 4th
      const posB = posA + 1;
      const posC = posB + 1;
      const answer = ordWords[posC - 1];
      const optionsArray = type === 'MCQ' ? `["${ordWords[posA - 1]}", "${ordWords[posB - 1]}", "${answer}", "${ordWords[posC]}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Logical Clue Chain\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "Deduce positions step-by-step from the clues." }`,
        metadata: { difficulty, steps: 3, logic: "clue_chain", hideVisual: true }
      };
    }

    // 9. Net Queue Change
    if (activeVariant === 'advanced_net_queue_change') {
      const startPos = Math.floor(Math.random() * 4) + 4; // 4th to 7th
      const joins = 2; // Fixed to 2 for simplicity
      const leaves = 1; // Fixed to 1
      const netChange = joins - leaves; // +1 (moves backward)
      const newPos = startPos + netChange;
      const answer = ordWords[newPos - 1];
      const optionsArray = type === 'MCQ' ? `["${ordWords[startPos - 2]}", "${ordWords[startPos - 1]}", "${answer}", "${ordWords[newPos]}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Net Change in Queue\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "Calculate net position change from joins and leaves." }`,
        metadata: { difficulty, steps: 3, logic: "net_queue_change", hideVisual: true }
      };
    }

    // 10. Relative Target
    if (activeVariant === 'advanced_relative_target') {
      const targetPos = Math.floor(Math.random() * 3) + 1; // 1st to 3rd
      const currentPos = targetPos + Math.floor(Math.random() * 4) + 2; // 3 to 6 places back
      const movesNeeded = currentPos - targetPos;
      const answer = String(movesNeeded);
      const optionsArray = type === 'MCQ' ? `["${movesNeeded - 1}", "${answer}", "${movesNeeded + 1}", "${currentPos}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Target Movement\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "Calculate the difference between the current and target positions." }`,
        metadata: { difficulty, steps: 2, logic: "relative_target", hideVisual: true }
      };
    }

    // Fallback error handling
    throw new Error(`Variant '${variant}' (mapped to '${activeVariant}') not valid for difficulty '${difficulty}'`);
  }
};