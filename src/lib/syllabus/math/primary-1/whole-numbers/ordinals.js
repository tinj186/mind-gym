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
    standard_reverse: "Multi-step reverse mapping (Front to Back).",
    standard_change: "State change where an item leaves the queue.",
    advanced_container: "Targeted container addition (e.g., apples in bags).",
    advanced_comparison: "Mental comparison between two positions (no visual)."
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
        - Choose a creative theme (e.g., different types of sports balls, unique animals).
        - Use actual, distinct emojis representing your theme in the visualItems array.
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        {
          "question": "Your creative question text...",
          "options": ${type === 'MCQ' ? '["1st", "2nd", "3rd", "4th"]' : 'null'},
          "visualItems": ["emoji1", "emoji2", "emoji3", "emoji4", "emoji5"],
          "finalAnswer": "${targetOrdinal}",
          "solution": "Start counting from the left... The item is at position ${targetOrdinal}."
        }`,
        metadata: { difficulty, steps: 1, logic: "direct_id", hideVisual: false }
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
        - Create a scenario like a parade of different vehicles or a line of unique toys. 
        - The visualItems array MUST contain unique emojis representing these items.
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        {
          "question": "Your creative question...",
          "options": ${type === 'MCQ' ? '["1st", "2nd", "3rd", "4th"]' : 'null'},
          "visualItems": ["emoji1", "emoji2", "emoji3", "emoji4", "emoji5"],
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
        - Use a relatable scenario (queue for a ride, race cars, etc.).
        - Include a visualItems array of emojis representing the queue.
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        {
          "question": "Your creative question...",
          "options": ${type === 'MCQ' ? '["1st", "2nd", "3rd", "4th"]' : 'null'},
          "visualItems": ["emoji1", "emoji2", "emoji3", "emoji4", "emoji5"], // Example for AI
          "finalAnswer": "3rd",
          "solution": "Step-by-step subtraction explanation."
        }`,
        metadata: { difficulty, steps: 2, logic: "state_change", hideVisual: false }
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
        - Choose a relatable theme (e.g., plates of cookies, bags of apples, boxes of toys).
        - The "visualItems" array MUST contain exactly ${numContainers} strings. Each string represents a group using repeated emojis. (Example: ["🍪🍪🍪", "🍪", "🍪🍪🍪🍪", "🍪🍪"]).
        - Make sure the string at the ${target1} position has exactly ${count1} emojis, and the string at the ${target2} position has exactly ${count2} emojis.
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        {
          "question": "Your creative question...",
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
          - Create a dynamic scenario (e.g., a marathon, a flying competition).
          - Do NOT include visuals or emojis.
          
          OUTPUT FORMAT (Return ONLY valid JSON):
          {
            "question": "Your creative question...",
            "options": ${type === 'MCQ' ? `["${ordinalWords[targetPos - 2]}", "${ordinalWords[targetPos - 1]}", "${ordinalWords[targetPos]}", "${ordinalWords[targetPos + 1]}"]` : 'null'},
            "visualItems": [],
            "finalAnswer": "${ordinalWords[targetPos - 1]}",
            "solution": "Step-by-step explanation showing ${startPos} + ${gap} = ${targetPos}."
          }`,
        visualItems: [],
        metadata: { difficulty, steps: 2, integratedTopics: ['Ordinals', 'Comparison'], logic: "relative_offset", hideVisual: true }
      };
    }

    // Fallback error handling
    throw new Error(`Variant '${variant}' (mapped to '${activeVariant}') not valid for difficulty '${difficulty}'`);
  }
};