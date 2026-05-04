/**
 * Blueprint for Primary 1: Multiplication and Division
 * FOCUS: Concepts of Equal Groups, Sharing, and Grouping.
 */

export const multiplicationDivisionBlueprint = {
  id: 'p1-multiplication-division',
  title: 'Multiplication and Division',
  strand: 'Number and Algebra',
  visualType: 'DYNAMIC', 

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 20,
      logicDescription: "Concepts of equal groups and sharing within 20."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      maxNumber: 40,
      logicDescription: "Multiplication and grouping word problems within 40."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 3,
      maxNumber: 40,
      logicDescription: "Multi-step logic involving multiplication followed by addition/subtraction."
    }
  },

  variants: {
    foundation_mult_eqn: "Basic multiplication equation (e.g., 2 x 5).",
    foundation_div_eqn: "Basic division equation (sharing) within 20.",
    foundation_word_problem_mult: "Basic equal groups word problem.",
    foundation_word_problem_div: "Basic sharing word problem.",
    foundation_grouping_interactive: "Interactive: Group items into sets of a specific size.",
    foundation_sharing_interactive: "Interactive: Share items equally into a given number of groups.",

    standard_mult_10: "Multiplication by 10.",
    standard_grouping_logic: "Grouping items into sets of a specific size.",
    standard_word_problem_mult: "Multiplication word problem within 40.",
    standard_word_problem_div: "Grouping/Sharing word problem within 40.",
    standard_grouping_interactive_wp: "Structured: Grouping word problem with Interactive Workspace.",

    advanced_multi_step_mult_add: "Multi-step: Multiply groups then add more.",
    advanced_multi_step_mult_sub: "Multi-step: Multiply groups then subtract.",
    advanced_logic_wheels_legs: "Logic puzzle: Counting total wheels or legs across groups."
  },

  generate: (difficulty = 'foundation', variant = 'foundation_mult_eqn', type = 'MCQ') => {
    const safeType = String(type).toLowerCase();
    const isShort = safeType.includes('short');
    const isStructure = safeType.includes('structure') || safeType.includes('structured');
    const isMCQ = safeType.includes('mcq');

    let activeVariant = variant;
    const isMissing = !multiplicationDivisionBlueprint.variants[activeVariant];
    const violatesShort = isShort && activeVariant && (activeVariant.includes('word_problem') || activeVariant.includes('logic') || activeVariant.includes('interactive'));
    const violatesStructure = isStructure && activeVariant && (!activeVariant.includes('word_problem') && !activeVariant.includes('logic') && !activeVariant.includes('interactive'));

    if (isMissing || violatesShort || violatesStructure) {
      const safeDiff = String(difficulty).toLowerCase();
      let validVariants = Object.keys(multiplicationDivisionBlueprint.variants).filter(k => k.startsWith(safeDiff));
      
      // 2. APPLY SPECIFIC RULES BASED ON QUESTION TYPE
      if (isShort) {
        // Short questions: ONLY pure mathematical equations (exclude stories and interactive tools)
        validVariants = validVariants.filter(k => 
          !k.includes('word_problem') && 
          !k.includes('logic') && 
          !k.includes('interactive')
        );
      } else if (isStructure) {
        // Structured questions: ONLY word problems OR interactive tools
        validVariants = validVariants.filter(k => 
          k.includes('word_problem') || 
          k.includes('logic') || 
          k.includes('interactive')
        );
      }
      
      activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)] || 'foundation_mult_eqn';
    }

    let formatInstructions = isMCQ 
      ? `Format as MCQ. Include an "options" array with 4 choices. "finalAnswer" must exactly match one of the options.`
      : isShort 
        ? `Format as Short Answer. The "options" field in your JSON should be null. CRITICAL: For the "questionText" string, output ONLY the mathematical equation (e.g., "12 + 15 = ?"). Do not use any English words.`
        : `Format as Structured Question. The "options" field in your JSON should be null. CRITICAL: For the "questionText" string, write a clear localized word problem. CREATIVE INSTRUCTIONS: Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).`;

    const getOptions = (ans) => {
      const a = parseInt(ans);
      let d1 = a + 2;
      let d2 = a + 5;
      let d3 = Math.max(0, a - 5);
      if (d1 === a) d1 += 1;
      if (d2 === a || d2 === d1) d2 = a + 10;
      if (d3 === a || d3 === d1 || d3 === d2) d3 = a + 15;
      return JSON.stringify([String(a), String(d1), String(d2), String(d3)].sort(() => Math.random() - 0.5));
    };
    const getQText = (words, equation) => isShort ? equation : words;
    
    // Dynamic visual item selection
    const funIcons = ['⚽', '🏀', '⭐', '🚗', '🥟', '🍢', '🍡', '🍎'];
    const selectedIcon = funIcons[Math.floor(Math.random() * funIcons.length)];

    // Map to Zod enums
    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    // FIX: Only hide visuals for pure equations, NOT for interactive workspaces
    const hideVis = isShort && !activeVariant.includes('interactive');

    // --- LOGIC BLOCKS ---

    // FOUNDATION: Multiplication Equation
    if (activeVariant === 'foundation_mult_eqn') {
      const groups = Math.floor(Math.random() * 3) + 2; // 2 to 4
      const size = Math.floor(Math.random() * 4) + 2; // 2 to 5
      const answer = String(groups * size);
      const questionText = getQText('Find the total sum.', groups + ' x ' + size + ' = ?');
      const solutionSteps = `${groups} groups of ${size} is ${groups} x ${size} = ${answer}.`;

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Equal Groups\n - Equation: ${groups} x ${size} = ?\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
          "meta": { "level": "Primary 1", "topic": "Whole Numbers", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": "${questionText}",
            "options": ${isMCQ ? getOptions(answer) : 'null'},
            "finalAnswer": "${answer}",
            "solutionSteps": "${solutionSteps}"
          },
          "visualEngine": ${isShort 
            ? `{ "componentToRender": "NONE", "componentData": null }`
            : `{ "componentToRender": "EQUAL_GROUPS", "componentData": { "items": [{"count": ${size}, "label": "Group"}], "groupCount": ${groups}, "icon": "${selectedIcon}" } }`
          },
          "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
        metadata: { difficulty, steps: 1, logic: "mult_eqn" }
      };
    }

    if (activeVariant === 'foundation_div_eqn') {
      const size = Math.floor(Math.random() * 3) + 2; 
      const groups = Math.floor(Math.random() * 3) + 2; 
      const total = groups * size;
      const answer = String(groups);
      const questionText = getQText('Share ' + total + ' items into ' + size + ' equal groups. How many in each group?', total + ' ÷ ' + size + ' = ?');
      const solutionSteps = `${total} shared into ${size} groups gives ${answer} in each group.`;

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Sharing/Division\n - Equation: ${total} ÷ ${size} = ?\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
          "meta": { "level": "Primary 1", "topic": "Whole Numbers", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": "${questionText}",
            "options": ${isMCQ ? getOptions(answer) : 'null'},
            "finalAnswer": "${answer}",
            "solutionSteps": "${solutionSteps}"
          },
          "visualEngine": ${isShort 
            ? `{ "componentToRender": "NONE", "componentData": null }`
            : `{ "componentToRender": "EQUAL_GROUPS", "componentData": { "items": [{"count": 1, "label": "Item"}], "groupCount": ${size}, "totalItems": ${total}, "hideVisual": ${hideVis}, "icon": "${selectedIcon}" } }`
          },
          "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
        metadata: { difficulty, steps: 1, logic: "div_eqn" }
      };
    }

    if (activeVariant === 'foundation_word_problem_mult' || activeVariant === 'foundation_word_problem_div') {
      const isDiv = activeVariant.includes('div');
      const size = Math.floor(Math.random() * 3) + 2; 
      const groups = Math.floor(Math.random() * 3) + 2; 
      const total = groups * size;
      const answer = isDiv ? String(groups) : String(total);
      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: ${isDiv ? 'Division' : 'Multiplication'} Word Problem\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
          "meta": { "level": "Primary 1", "topic": "Whole Numbers", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": "...",
            "options": ${isMCQ ? getOptions(answer) : 'null'},
            "finalAnswer": "${answer}",
            "solutionSteps": "Mathematical explanation for the ${isDiv ? 'sharing' : 'grouping'} problem."
          },
          "visualEngine": {
            "componentToRender": "NONE",
            "componentData": null
          },
          "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
        metadata: { difficulty, steps: 1, logic: isDiv ? "wp_div_20" : "wp_mult_20" }
      };
    }

    // Foundation: Interactive Grouping
    if (activeVariant === 'foundation_grouping_interactive') {
      const size = Math.floor(Math.random() * 3) + 2; // Groups of 2, 3, or 4
      const groups = Math.floor(Math.random() * 3) + 2; // 2, 3, or 4 groups
      const total = groups * size;
      const answer = String(groups);
      
      const questionText = getQText('[Insert full localized Singaporean word problem here]', total + ' ÷ ' + size + ' = ?');
      const solutionSteps = `${total} items put into groups of ${size} makes ${answer} groups.`;

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Grouping (Interactive)\n - Task: Group ${total} items into sets of ${size}.\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE: Generate a Singapore-themed story.\n CRITICAL VISUAL RULE: DO NOT modify the "visualEngine" block below. You MUST copy the "totalItems" number and the "items" array exactly as provided in the template. Do not change them to match the final answer.\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
          "meta": { "level": "Primary 1", "topic": "Whole Numbers", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": "${questionText}",
            "options": ${isMCQ ? getOptions(answer) : 'null'},
            "finalAnswer": "${answer}",
            "solutionSteps": "${solutionSteps}"
          },
          "visualEngine": {
            "componentToRender": "GROUPING_WORKSPACE",
            "componentData": { "mode": "GROUPING", "targetGroupSize": ${size}, "totalItems": ${total}, "icon": "${selectedIcon}", "items": ${JSON.stringify(Array(total).fill(selectedIcon))} }
          },
          "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
        metadata: { difficulty, steps: 1, logic: "grouping_interactive" }
      };
    }

    // Foundation: Interactive Sharing
    if (activeVariant === 'foundation_sharing_interactive') {
      const groups = Math.floor(Math.random() * 3) + 2; // Share into 2, 3, or 4 groups
      const size = Math.floor(Math.random() * 3) + 2; // Each group gets 2, 3, or 4
      const total = groups * size;
      const answer = String(size);
      
      const questionText = getQText('[Insert full localized Singaporean word problem here]', total + ' ÷ ' + groups + ' = ?');
      const solutionSteps = `When we share ${total} items into ${groups} groups equally, each group has ${answer} items.`;
      
      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Sharing (Interactive)\n - Task: Share ${total} items equally into ${groups} groups.\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE: Generate a Singapore-themed story.\n CRITICAL VISUAL RULE: DO NOT modify the "visualEngine" block below. You MUST copy the "totalItems" number and the "items" array exactly as provided in the template. Do not change them to match the final answer.\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
          "meta": { "level": "Primary 1", "topic": "Whole Numbers", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": "${questionText}",
            "options": ${isMCQ ? getOptions(answer) : 'null'},
            "finalAnswer": "${answer}",
            "solutionSteps": "${solutionSteps}"
          },
          "visualEngine": {
            "componentToRender": "GROUPING_WORKSPACE",
            "componentData": { "mode": "SHARING", "expectedGroups": ${groups}, "totalItems": ${total}, "icon": "${selectedIcon}", "items": ${JSON.stringify(Array(total).fill(selectedIcon))} }
          },
          "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
        metadata: { difficulty, steps: 1, logic: "sharing_interactive" }
      };
    }

    // STANDARD LEVEL
    if (activeVariant === 'standard_mult_10') {
      const groups = Math.floor(Math.random() * 3) + 2;
      const answer = String(groups * 10);
      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Multiply by 10\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
          "meta": { "level": "Primary 1", "topic": "Whole Numbers", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": "${getQText('What is ' + groups + ' tens?', groups + ' x 10 = ?')}",
            "options": ${isMCQ ? getOptions(answer) : 'null'},
            "finalAnswer": "${answer}",
            "solutionSteps": "${groups} groups of 10 is ${answer}."
          },
          "visualEngine": ${isShort 
            ? `{ "componentToRender": "NONE", "componentData": null }`
            : `{ "componentToRender": "EQUAL_GROUPS", "componentData": { "items": [{"count": 10, "label": "Items"}], "groupCount": ${groups}, "hideVisual": ${hideVis}, "icon": "${selectedIcon}" } }`
          },
          "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
        metadata: { difficulty, steps: 1, logic: "mult_10" }
      };
    }

    if (activeVariant === 'standard_grouping_logic' || activeVariant === 'standard_word_problem_div') {
      const size = Math.floor(Math.random() * 3) + 3; 
      const groups = Math.floor(Math.random() * 4) + 4; 
      const total = groups * size;
      const answer = String(groups);
      const questionText = getQText('...', total + ' ÷ ' + size + ' = ?');
      const solutionSteps = `Put ${total} items into groups of ${size}. There are ${answer} groups.`;

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Grouping Logic\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
          "meta": { "level": "Primary 1", "topic": "Whole Numbers", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": "${questionText}",
            "options": ${isMCQ ? getOptions(answer) : 'null'},
            "finalAnswer": "${answer}",
            "solutionSteps": "${solutionSteps}"
          },
          "visualEngine": {
            "componentToRender": "NONE",
            "componentData": null
          },
          "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
        metadata: { difficulty, steps: 2, logic: "grouping_logic" }
      };
    }

    // Standard: Structured Interactive Grouping
    if (activeVariant === 'standard_grouping_interactive_wp') {
      const size = Math.floor(Math.random() * 3) + 3; // Groups of 3, 4, or 5
      const groups = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5 groups
      const total = groups * size;
      const answer = String(groups);
      
      // Use emojis that fit a Singaporean story (e.g., fishballs, dumplings, or satay)
      const icons = ['🍡', '🥟', '🍢'];
      const selectedIcon = icons[Math.floor(Math.random() * icons.length)];
      const itemsArray = JSON.stringify(Array(total).fill(selectedIcon));

      const questionText = "[Insert full localized Singaporean word problem here]";
      const solutionSteps = `First, we look at the total number of items: ${total}. Then, we put them into groups of ${size}. We can see that there are ${answer} groups formed.`;

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Grouping Word Problem (Structured)\n - Task: Group ${total} items into sets of ${size}.\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE: Generate a Singapore-themed story.\n CRITICAL VISUAL RULE: DO NOT modify the "visualEngine" block below. You MUST copy the "totalItems" number and the "items" array exactly as provided in the template. Do not change them to match the final answer.\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
          "meta": { "level": "Primary 1", "topic": "Whole Numbers", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": "${questionText}",
            "options": ${isMCQ ? getOptions(answer) : 'null'},
            "finalAnswer": "${answer}",
            "solutionSteps": "${solutionSteps}"
          },
          "visualEngine": {
            "componentToRender": "GROUPING_WORKSPACE",
            "componentData": { "mode": "GROUPING", "targetGroupSize": ${size}, "totalItems": ${total}, "icon": "${selectedIcon}", "items": ${itemsArray}, "hideVisual": false }
          },
          "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
        metadata: { difficulty, steps: 2, logic: "grouping_structured_interactive" }
      };
    }

    // STANDARD: Word Problem Multiplication
    if (activeVariant === 'standard_word_problem_mult') {
      const groups = Math.floor(Math.random() * 3) + 4; // 4 to 6
      const size = Math.floor(Math.random() * 3) + 3; // 3 to 5
      const answer = String(groups * size);
      const questionText = getQText('...', groups + ' x ' + size + ' = ?');
      const solutionSteps = `${groups} groups of ${size} is ${groups} x ${size} = ${answer}.`;

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Multiplication Word Problem\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
          "meta": { "level": "Primary 1", "topic": "Whole Numbers", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": "${questionText}",
            "options": ${isMCQ ? getOptions(answer) : 'null'},
            "finalAnswer": "${answer}",
            "solutionSteps": "${solutionSteps}"
          },
          "visualEngine": {
            "componentToRender": "NONE",
            "componentData": null
          },
          "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
        metadata: { difficulty, steps: 2, logic: "wp_mult" }
      };
    }

    // ADVANCED: Multi-step (Mult + Add)
    if (activeVariant === 'advanced_multi_step_mult_add') {
      const groups = 3;
      const size = 5;
      const extra = Math.floor(Math.random() * 5) + 2;
      const answer = String((groups * size) + extra);
      const questionText = getQText('...', '(' + groups + ' x ' + size + ') + ' + extra + ' = ?');
      const solutionSteps = `Step 1: ${groups} x ${size} = ${groups * size}. Step 2: ${groups * size} + ${extra} = ${answer}.`;

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Multi-step Multiplication/Addition\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
          "meta": { "level": "Primary 1", "topic": "Whole Numbers", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": "${questionText}",
            "options": ${isMCQ ? getOptions(answer) : 'null'},
            "finalAnswer": "${answer}",
            "solutionSteps": "${solutionSteps}"
          },
          "visualEngine": {
            "componentToRender": "NONE",
            "componentData": null
          },
          "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
        metadata: { difficulty, steps: 3, logic: "adv_mult_add" }
      };
    }

    if (activeVariant === 'advanced_multi_step_mult_sub') {
      const groups = 4;
      const size = 5;
      const remove = Math.floor(Math.random() * 5) + 2;
      const answer = String((groups * size) - remove);
      const questionText = getQText('...', '(' + groups + ' x ' + size + ') - ' + remove + ' = ?');
      const solutionSteps = `Step 1: ${groups} x ${size} = ${groups * size}. Step 2: ${groups * size} - ${remove} = ${answer}.`;

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Multi-step Multiplication/Subtraction\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
          "meta": { "level": "Primary 1", "topic": "Whole Numbers", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": "${questionText}",
            "options": ${isMCQ ? getOptions(answer) : 'null'},
            "finalAnswer": "${answer}",
            "solutionSteps": "${solutionSteps}"
          },
          "visualEngine": {
            "componentToRender": "NONE",
            "componentData": null
          },
          "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
        metadata: { difficulty, steps: 3, logic: "adv_mult_sub" }
      };
    }

    if (activeVariant === 'advanced_logic_wheels_legs') {
      const count = Math.floor(Math.random() * 4) + 3; // 3 to 6
      const typeLabel = Math.random() > 0.5 ? "tricycles" : "cars";
      const legsPer = typeLabel === "tricycles" ? 3 : 4;
      const answer = String(count * legsPer);
      const questionText = getQText('...', count + ' x ' + legsPer + ' = ?');
      const solutionSteps = `${count} items each have ${legsPer} parts. ${count} x ${legsPer} = ${answer}.`;

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Multiplication Logic (Wheels/Legs)\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
          "meta": { "level": "Primary 1", "topic": "Whole Numbers", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": "${questionText}",
            "options": ${isMCQ ? getOptions(answer) : 'null'},
            "finalAnswer": "${answer}",
            "solutionSteps": "${solutionSteps}"
          },
          "visualEngine": {
            "componentToRender": "NONE",
            "componentData": null
          },
          "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
        metadata: { difficulty, steps: 2, logic: "adv_wheels_legs" }
      };
    }

    throw new Error(`Variant '${activeVariant}' logic block not implemented.`);
  }
};