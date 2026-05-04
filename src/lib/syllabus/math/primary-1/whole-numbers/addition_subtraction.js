/**
 * Blueprint for Primary 1: Addition and Subtraction
 * ENGINE: Generates AI prompt constraints, strictly pre-calculating math logic.
 * ARCHITECTURE: Pre-calculates exact equations and smart distractors to prevent AI hallucinations.
 */

export const additionSubtractionBlueprint = {
  id: 'p1-addition-subtraction',
  title: 'Addition and Subtraction',
  strand: 'Number and Algebra',
  visualType: 'DYNAMIC', // Allows switching between NUMBER_CARDS and hidden visuals

  // 1. OVERARCHING CONDITIONS
  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 20,
      logicDescription: "Basic addition and subtraction within 20, including missing addends."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      maxNumber: 100,
      logicDescription: "Addition and subtraction within 100 without regrouping, basic word problems."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 3,
      maxNumber: 100,
      logicDescription: "Addition and subtraction within 100 with regrouping, comparative word problems."
    }
  },

  // 2. STRICT VARIANTS
  variants: {
    foundation_add_20: "Add two 1-digit numbers bridging 10.",
    foundation_sub_20: "Subtract a 1-digit number from a number between 11 and 20.",
    foundation_missing_addend: "Find the missing addend in an addition equation within 20.",
    foundation_missing_subtrahend: "Find the missing subtrahend in a subtraction equation within 20.",
    foundation_word_problem_add: "Solve a basic addition word problem within 20.",
    foundation_word_problem_sub: "Solve a basic subtraction word problem within 20.",
    
    standard_add_100_no_regroup: "Add two 2-digit numbers without regrouping.",
    standard_sub_100_no_regroup: "Subtract two 2-digit numbers without regrouping.",
    standard_word_problem_add: "Solve a basic part-whole addition word problem.",
    standard_word_problem_sub: "Solve a basic part-whole subtraction word problem.",
    standard_add_three_numbers: "Add three 1-digit numbers.",
    standard_missing_addend_100: "Find the missing addend in a 2-digit equation (no regrouping).",
    standard_missing_subtrahend_100: "Find the missing subtrahend in a 2-digit equation (no regrouping).",
    standard_word_problem_add_three: "Solve an addition word problem combining three numbers.",
    standard_word_problem_money_add: "Solve a basic addition word problem involving cents (¢).",
    standard_word_problem_money_sub: "Solve a basic subtraction word problem involving cents (¢).",

    advanced_add_100_regroup: "Add two 2-digit numbers with regrouping.",
    advanced_sub_100_regroup: "Subtract two 2-digit numbers with regrouping.",
    advanced_compare_more: "Solve a comparative word problem involving 'more than'.",
    advanced_compare_fewer: "Solve a comparative word problem involving 'fewer than'.",
    advanced_missing_addend_regroup: "Find the missing addend in a 2-digit equation requiring regrouping.",
    advanced_missing_subtrahend_regroup: "Find the missing subtrahend in a 2-digit equation requiring regrouping.",
    advanced_balance_equation: "Balance an equation with operations on both sides (e.g., a + b = c + ?).",
    advanced_word_problem_compare_diff: "Solve a comparative word problem to find the exact difference between two amounts.",
    advanced_word_problem_two_step: "Solve a two-step word problem (e.g., starting amount, minus two purchases).",
    advanced_word_problem_money_change: "Calculate the exact change received from 100 cents ($1).",
    advanced_cross_length_total: "Cross-Topical (Length): Find the total length of two items given their difference.",
    advanced_cross_mass_total: "Cross-Topical (Mass): Find the total mass of two items given their difference.",
    advanced_cross_ordinal_queue: "Cross-Topical (Ordinal Numbers): Use ordinal position to find remaining items in a sequence."
  },

  // 3. GENERATION ENGINE
  generate: (difficulty = 'foundation', variant = 'foundation_add_20', type = 'MCQ') => {
    
    // --- BULLETPROOF AUTO-RANDOMIZER ---
    // 1. Make type matching case-insensitive and flexible
    const safeType = String(type).toLowerCase();
    const isShort = safeType.includes('short');
    const isStructure = safeType.includes('structure') || safeType.includes('structured');
    const isMCQ = safeType.includes('mcq');

    let activeVariant = variant;
    
    // 2. DETECT MISMATCHES: Does the requested variant violate the requested type?
    const isMissing = !additionSubtractionBlueprint.variants[activeVariant];
    const violatesShort = isShort && activeVariant && (activeVariant.includes('word_problem') || activeVariant.includes('compare_'));
    const violatesStructure = isStructure && activeVariant && (!activeVariant.includes('word_problem') && !activeVariant.includes('compare_'));

    // 3. FORCE RE-ROLL if missing or mismatched
    if (isMissing || violatesShort || violatesStructure) {
      const safeDiff = String(difficulty).toLowerCase();
      let validVariants = Object.keys(additionSubtractionBlueprint.variants).filter(k => k.startsWith(safeDiff));
      
      // APPLY SPECIFIC RULES BASED ON QUESTION TYPE
      if (isShort) {
        // Short questions: ONLY mathematical equations
        validVariants = validVariants.filter(k => !k.includes('word_problem') && !k.includes('compare_') && !k.includes('interactive'));
      } else if (isStructure) {
        // Structured questions: ONLY word problems
        validVariants = validVariants.filter(k => k.includes('word_problem') || k.includes('compare_'));
      }

      if (validVariants.length > 0) {
        activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
      } else {
        // Fallback safety
        activeVariant = isStructure ? 'foundation_word_problem_add' : 'foundation_add_20'; 
      }
    }

    let formatInstructions = '';
    if (isMCQ) {
      formatInstructions = `Format as MCQ. Include an "options" array with 4 choices. "finalAnswer" must exactly match one of the options.`;
    } else if (isShort) {
      formatInstructions = `Format as Short Answer. The "options" field in your JSON should be null. CRITICAL: For the "question" string, output ONLY the mathematical equation (e.g., "12 + 15 = ?"). Do not use any English words.`;
    } else {
      formatInstructions = `Format as Structured Question. The "options" field in your JSON should be null. CRITICAL: For the "question" string, write a clear text-based word problem.`;
    }

    const getOptions = (ans) => {
      const a = parseInt(ans);
      return `["${a - 1}", "${a + 10}", "${a}", "${Math.max(0, a - 10)}"]`;
    };

    // dynamically strip English words and hide redundant cards for short questions
    const getQText = (words, equation) => isShort ? equation : words;
    const hideVis = isShort && !activeVariant.includes('interactive');

    // ==========================================
    // FOUNDATION LEVEL (Within 20)
    // ==========================================

    if (activeVariant === 'foundation_add_20') {
      const a = Math.floor(Math.random() * 6) + 4; // 4 to 9
      const b = Math.floor(Math.random() * 6) + 4; // 4 to 9
      const answer = String(a + b);
      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Addition within 20\n - Equation: ${a} + ${b} = ?\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "${getQText('Find the sum.', a + ' + ' + b + ' = ?')}", "options": ${isMCQ ? getOptions(answer) : 'null'}, "visualItems": [], "modelData": { "type": "NUMBER_CARDS", "items": ["${a}", "+", "${b}", "=", "?"], "hideVisual": ${hideVis} }, "finalAnswer": "${answer}", "solution": "${a} + ${b} = ${answer}." }`,
        metadata: { difficulty, steps: 1, logic: "add_20", hideVisual: hideVis }
      };
    }

    if (activeVariant === 'foundation_sub_20') {
      const b = Math.floor(Math.random() * 6) + 4; // 4 to 9
      const answerNum = Math.floor(Math.random() * 6) + 4; // 4 to 9
      const a = b + answerNum; // 8 to 18
      const answer = String(answerNum);
      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Subtraction within 20\n - Equation: ${a} - ${b} = ?\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "${getQText('Find the difference.', a + ' - ' + b + ' = ?')}", "options": ${isMCQ ? getOptions(answer) : 'null'}, "visualItems": [], "modelData": { "type": "NUMBER_CARDS", "items": ["${a}", "-", "${b}", "=", "?"], "hideVisual": ${hideVis} }, "finalAnswer": "${answer}", "solution": "${a} - ${b} = ${answer}." }`,
        metadata: { difficulty, steps: 1, logic: "sub_20", hideVisual: hideVis }
      };
    }

    if (activeVariant === 'foundation_missing_addend') {
      const a = Math.floor(Math.random() * 6) + 4;
      const b = Math.floor(Math.random() * 6) + 4;
      const sum = a + b;
      const answer = String(b);
      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Missing Addend\n - Equation: ${a} + ? = ${sum}\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "${getQText('What is the missing number in the equation?', a + ' + ? = ' + sum)}", "options": ${isMCQ ? getOptions(answer) : 'null'}, "visualItems": [], "modelData": { "type": "NUMBER_CARDS", "items": ["${a}", "+", "?", "=", "${sum}"], "hideVisual": ${hideVis} }, "finalAnswer": "${answer}", "solution": "To find the missing part, we subtract the part we know from the whole. ${sum} - ${a} = ${answer}." }`,
        metadata: { difficulty, steps: 1, logic: "missing_addend", hideVisual: hideVis }
      };
    }

    if (activeVariant === 'foundation_missing_subtrahend') {
      const b = Math.floor(Math.random() * 6) + 4;
      const ansNum = Math.floor(Math.random() * 6) + 4;
      const sum = b + ansNum;
      const answer = String(ansNum);
      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Missing Subtrahend\n - Equation: ${sum} - ? = ${b}\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "${getQText('What is the missing number in the equation?', sum + ' - ? = ' + b)}", "options": ${isMCQ ? getOptions(answer) : 'null'}, "visualItems": [], "modelData": { "type": "NUMBER_CARDS", "items": ["${sum}", "-", "?", "=", "${b}"], "hideVisual": ${hideVis} }, "finalAnswer": "${answer}", "solution": "To find the part taken away, we subtract the part left over from the whole. ${sum} - ${b} = ${answer}." }`,
        metadata: { difficulty, steps: 1, logic: "missing_subtrahend", hideVisual: hideVis }
      };
    }

    if (activeVariant === 'foundation_word_problem_add') {
      const a = Math.floor(Math.random() * 6) + 4; 
      const b = Math.floor(Math.random() * 6) + 4;
      const answer = String(a + b);
      
      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Addition Word Problem within 20\n - Numbers to use: ${a} and ${b}\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${isMCQ ? getOptions(answer) : 'null'}, "visualItems": [], "modelData": { "type": "NONE", "hideVisual": true }, "finalAnswer": "${answer}", "solution": "To find the total, we add. ${a} + ${b} = ${answer}." }`,
        metadata: { difficulty, steps: 1, logic: "word_problem_add_20", hideVisual: true }
      };
    }

    if (activeVariant === 'foundation_word_problem_sub') {
      const a = Math.floor(Math.random() * 6) + 10; 
      const b = Math.floor(Math.random() * 6) + 2;
      const answer = String(a - b);
      
      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Subtraction Word Problem within 20\n - Numbers to use: Start with ${a}, remove ${b}\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${isMCQ ? getOptions(answer) : 'null'}, "visualItems": [], "modelData": { "type": "NONE", "hideVisual": true }, "finalAnswer": "${answer}", "solution": "To find how many are left, we subtract. ${a} - ${b} = ${answer}." }`,
        metadata: { difficulty, steps: 1, logic: "word_problem_sub_20", hideVisual: true }
      };
    }

    // ==========================================
    // STANDARD LEVEL (Within 100, No Regrouping)
    // ==========================================

    if (activeVariant === 'standard_add_100_no_regroup') {
      const tensA = Math.floor(Math.random() * 5) + 1; // 1 to 5
      const onesA = Math.floor(Math.random() * 4) + 1; // 1 to 4
      const tensB = Math.floor(Math.random() * 3) + 1; // 1 to 3
      const onesB = Math.floor(Math.random() * 4) + 1; // 1 to 4
      const a = (tensA * 10) + onesA;
      const b = (tensB * 10) + onesB;
      const answer = String(a + b);
      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: 2-Digit Addition (No Regrouping)\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "${getQText('Find the sum.', a + ' + ' + b + ' = ?')}", "options": ${isMCQ ? getOptions(answer) : 'null'}, "visualItems": [], "modelData": { "type": "NUMBER_CARDS", "items": ["${a}", "+", "${b}", "=", "?"], "hideVisual": ${hideVis} }, "finalAnswer": "${answer}", "solution": "Add the ones: ${onesA} + ${onesB} = ${onesA + onesB}. Add the tens: ${tensA} tens + ${tensB} tens = ${tensA + tensB} tens. So, ${a} + ${b} = ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "add_100_no_regroup", hideVisual: hideVis }
      };
    }

    if (activeVariant === 'standard_sub_100_no_regroup') {
      const tensA = Math.floor(Math.random() * 4) + 5; // 5 to 8
      const onesA = Math.floor(Math.random() * 4) + 5; // 5 to 8
      const tensB = Math.floor(Math.random() * 4) + 1; // 1 to 4
      const onesB = Math.floor(Math.random() * 4) + 1; // 1 to 4
      const a = (tensA * 10) + onesA;
      const b = (tensB * 10) + onesB;
      const answer = String(a - b);
      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: 2-Digit Subtraction (No Regrouping)\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "${getQText('Find the difference.', a + ' - ' + b + ' = ?')}", "options": ${isMCQ ? getOptions(answer) : 'null'}, "visualItems": [], "modelData": { "type": "NUMBER_CARDS", "items": ["${a}", "-", "${b}", "=", "?"], "hideVisual": ${hideVis} }, "finalAnswer": "${answer}", "solution": "Subtract the ones: ${onesA} - ${onesB} = ${onesA - onesB}. Subtract the tens: ${tensA} tens - ${tensB} tens = ${tensA - tensB} tens. So, ${a} - ${b} = ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "sub_100_no_regroup", hideVisual: hideVis }
      };
    }

    if (activeVariant === 'standard_word_problem_add') {
      const a = Math.floor(Math.random() * 30) + 20; 
      const b = Math.floor(Math.random() * 30) + 10;
      const answer = String(a + b);
      
      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Addition Word Problem\n - Numbers to use: ${a} and ${b}\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${isMCQ ? getOptions(answer) : 'null'}, "visualItems": [], "modelData": { "type": "NONE", "hideVisual": true }, "finalAnswer": "${answer}", "solution": "To find the total, we add the two groups together. ${a} + ${b} = ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "word_problem_add", hideVisual: true }
      };
    }

    if (activeVariant === 'standard_word_problem_sub') {
      const total = Math.floor(Math.random() * 40) + 50; 
      const b = Math.floor(Math.random() * 20) + 10;
      const answer = String(total - b);
      
      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Subtraction Word Problem\n - Numbers to use: Start with ${total}, give away/lose ${b}\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${isMCQ ? getOptions(answer) : 'null'}, "visualItems": [], "modelData": { "type": "NONE", "hideVisual": true }, "finalAnswer": "${answer}", "solution": "To find how many are left, we subtract the amount given away from the total. ${total} - ${b} = ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "word_problem_sub", hideVisual: true }
      };
    }

    // 5. Add Three Numbers (Equation)
    if (activeVariant === 'standard_add_three_numbers') {
      const a = Math.floor(Math.random() * 5) + 3; // 3 to 7
      const b = Math.floor(Math.random() * 5) + 3; // 3 to 7
      const c = Math.floor(Math.random() * 5) + 3; // 3 to 7
      const answer = String(a + b + c);
      
      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Adding Three Numbers\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "${getQText('Find the sum.', a + ' + ' + b + ' + ' + c + ' = ?')}", "options": ${isMCQ ? getOptions(answer) : 'null'}, "visualItems": [], "modelData": { "type": "NUMBER_CARDS", "items": ["${a}", "+", "${b}", "+", "${c}", "=", "?"], "hideVisual": ${hideVis} }, "finalAnswer": "${answer}", "solution": "First add the first two numbers: ${a} + ${b} = ${a+b}. Then add the third number: ${a+b} + ${c} = ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "add_three_numbers", hideVisual: hideVis }
      };
    }

    // 6. Missing Addend within 100 (Equation)
    if (activeVariant === 'standard_missing_addend_100') {
      const tensA = Math.floor(Math.random() * 4) + 1; // 1 to 4
      const onesA = Math.floor(Math.random() * 4) + 1; // 1 to 4
      const tensB = Math.floor(Math.random() * 4) + 1; // 1 to 4
      const onesB = Math.floor(Math.random() * 4) + 1; // 1 to 4
      const a = (tensA * 10) + onesA;
      const b = (tensB * 10) + onesB;
      const sum = a + b;
      const answer = String(b);
      
      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Missing Addend (Within 100)\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "${getQText('What is the missing number?', a + ' + ? = ' + sum)}", "options": ${isMCQ ? getOptions(answer) : 'null'}, "visualItems": [], "modelData": { "type": "NUMBER_CARDS", "items": ["${a}", "+", "?", "=", "${sum}"], "hideVisual": ${hideVis} }, "finalAnswer": "${answer}", "solution": "To find the missing part, subtract the part you know from the whole: ${sum} - ${a} = ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "missing_addend_100", hideVisual: hideVis }
      };
    }

    // 7. Missing Subtrahend within 100 (Equation)
    if (activeVariant === 'standard_missing_subtrahend_100') {
      const tensTotal = Math.floor(Math.random() * 4) + 5; // 5 to 8
      const onesTotal = Math.floor(Math.random() * 4) + 5; // 5 to 8
      const tensB = Math.floor(Math.random() * 3) + 1; // 1 to 3
      const onesB = Math.floor(Math.random() * 3) + 1; // 1 to 3
      const total = (tensTotal * 10) + onesTotal;
      const b = (tensB * 10) + onesB;
      const answer = String(total - b); // The missing subtrahend
      
      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Missing Subtrahend (Within 100)\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "${getQText('What is the missing number?', total + ' - ? = ' + b)}", "options": ${isMCQ ? getOptions(answer) : 'null'}, "visualItems": [], "modelData": { "type": "NUMBER_CARDS", "items": ["${total}", "-", "?", "=", "${b}"], "hideVisual": ${hideVis} }, "finalAnswer": "${answer}", "solution": "To find the part that was taken away, subtract the part left over from the whole: ${total} - ${b} = ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "missing_subtrahend_100", hideVisual: hideVis }
      };
    }

    // 8. Word Problem: Add Three Numbers
    if (activeVariant === 'standard_word_problem_add_three') {
      const a = Math.floor(Math.random() * 10) + 5; 
      const b = Math.floor(Math.random() * 10) + 5;
      const c = Math.floor(Math.random() * 10) + 5;
      const answer = String(a + b + c);
      
      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Addition Word Problem (3 items)\n - Numbers to use: ${a}, ${b}, and ${c}\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Write a simple story about collecting 3 different types of items.\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Your short story]. How many items are there altogether?", "options": ${isMCQ ? getOptions(answer) : 'null'}, "visualItems": [], "modelData": { "type": "NONE", "hideVisual": true }, "finalAnswer": "${answer}", "solution": "Add all the groups together: ${a} + ${b} + ${c} = ${answer}." }`,
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Addition Word Problem (3 items)\n - Numbers to use: ${a}, ${b}, and ${c}\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${isMCQ ? getOptions(answer) : 'null'}, "visualItems": [], "modelData": { "type": "NONE", "hideVisual": true }, "finalAnswer": "${answer}", "solution": "Add all the groups together: ${a} + ${b} + ${c} = ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "word_problem_add_three", hideVisual: true }
      };
    }

    // 9. Word Problem: Money Addition
    if (activeVariant === 'standard_word_problem_money_add') {
      const item1 = (Math.floor(Math.random() * 4) + 1) * 10; // 10, 20, 30, 40
      const item2 = (Math.floor(Math.random() * 4) + 1) * 10; // 10, 20, 30, 40
      const answer = String(item1 + item2);
      
      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Money Addition Word Problem\n - Numbers to use: ${item1} cents and ${item2} cents\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Write a simple story about buying 2 items. Use the word \"cents\" or the symbol \"¢\".\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Your short story]. How much do the items cost altogether?", "options": ${isMCQ ? getOptions(answer) : 'null'}, "visualItems": [], "modelData": { "type": "NONE", "hideVisual": true }, "finalAnswer": "${answer}", "solution": "To find the total cost, we add the amounts. ${item1} + ${item2} = ${answer} cents." }`,
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Money Addition Word Problem\n - Numbers to use: ${item1} cents and ${item2} cents\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${isMCQ ? getOptions(answer) : 'null'}, "visualItems": [], "modelData": { "type": "NONE", "hideVisual": true }, "finalAnswer": "${answer}", "solution": "To find the total cost, we add the amounts. ${item1} + ${item2} = ${answer} cents." }`,
        metadata: { difficulty, steps: 2, logic: "word_problem_money_add", hideVisual: true }
      };
    }

    // 10. Word Problem: Money Subtraction
    if (activeVariant === 'standard_word_problem_money_sub') {
      const start = (Math.floor(Math.random() * 3) + 7) * 10; // 70, 80, 90
      const spent = (Math.floor(Math.random() * 4) + 2) * 10; // 20, 30, 40, 50
      const answer = String(start - spent);
      
      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Money Subtraction Word Problem\n - Numbers to use: Started with ${start} cents, spent ${spent} cents\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Write a simple story about having money and buying an item. Use the word \"cents\" or the symbol \"¢\".\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Your short story]. How much money is left?", "options": ${isMCQ ? getOptions(answer) : 'null'}, "visualItems": [], "modelData": { "type": "NONE", "hideVisual": true }, "finalAnswer": "${answer}", "solution": "To find how much money is left, we subtract the amount spent from the starting amount. ${start} - ${spent} = ${answer} cents." }`,
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Money Subtraction Word Problem\n - Numbers to use: Started with ${start} cents, spent ${spent} cents\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${isMCQ ? getOptions(answer) : 'null'}, "visualItems": [], "modelData": { "type": "NONE", "hideVisual": true }, "finalAnswer": "${answer}", "solution": "To find how much money is left, we subtract the amount spent from the starting amount. ${start} - ${spent} = ${answer} cents." }`,
        metadata: { difficulty, steps: 2, logic: "word_problem_money_sub", hideVisual: true }
      };
    }

    // ==========================================
    // ADVANCED LEVEL (Within 100, With Regrouping / Comparison)
    // ==========================================

    if (activeVariant === 'advanced_add_100_regroup') {
      const tensA = Math.floor(Math.random() * 5) + 1;
      const onesA = Math.floor(Math.random() * 4) + 6; // 6 to 9
      const tensB = Math.floor(Math.random() * 3) + 1;
      const onesB = Math.floor(Math.random() * (9 - onesA + 1)) + (10 - onesA); // Forces sum of ones >= 10
      const a = (tensA * 10) + onesA;
      const b = (tensB * 10) + onesB;
      const answer = String(a + b);
      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: 2-Digit Addition (With Regrouping)\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "${getQText('Find the sum.', a + ' + ' + b + ' = ?')}", "options": ${isMCQ ? '["' + ((a+b)-10) + '", "' + answer + '", "' + ((a+b)+1) + '", "' + ((a+b)+10) + '"]' : 'null'}, "visualItems": [], "modelData": { "type": "NUMBER_CARDS", "items": ["${a}", "+", "${b}", "=", "?"], "hideVisual": ${hideVis} }, "finalAnswer": "${answer}", "solution": "Add the ones: ${onesA} + ${onesB} = ${onesA + onesB}. Rename ${onesA + onesB} ones as 1 ten and ${(onesA + onesB)%10} ones. Add the tens: 1 + ${tensA} + ${tensB} = ${(1 + tensA + tensB)} tens. So, ${a} + ${b} = ${answer}." }`,
        metadata: { difficulty, steps: 3, logic: "add_100_regroup", hideVisual: hideVis }
      };
    }

    if (activeVariant === 'advanced_sub_100_regroup') {
      const tensA = Math.floor(Math.random() * 5) + 4; // 4 to 8
      const onesA = Math.floor(Math.random() * 4) + 1; // 1 to 4
      const tensB = Math.floor(Math.random() * 3) + 1; // 1 to 3
      const onesB = Math.floor(Math.random() * 4) + onesA + 1; // Forces onesB > onesA
      const a = (tensA * 10) + onesA;
      const b = (tensB * 10) + onesB;
      const answer = String(a - b);
      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: 2-Digit Subtraction (With Regrouping)\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "${getQText('Find the difference.', a + ' - ' + b + ' = ?')}", "options": ${isMCQ ? '["' + ((a-b)+10) + '", "' + ((a-b)-1) + '", "' + answer + '", "' + ((a-b)-10) + '"]' : 'null'}, "visualItems": [], "modelData": { "type": "NUMBER_CARDS", "items": ["${a}", "-", "${b}", "=", "?"], "hideVisual": ${hideVis} }, "finalAnswer": "${answer}", "solution": "We cannot subtract ${onesB} ones from ${onesA} ones. Regroup 1 ten from ${tensA} tens into 10 ones. Now subtract the ones: ${onesA + 10} - ${onesB} = ${(onesA + 10) - onesB}. Subtract the remaining tens: ${tensA - 1} - ${tensB} = ${(tensA - 1) - tensB}. So, ${a} - ${b} = ${answer}." }`,
        metadata: { difficulty, steps: 3, logic: "sub_100_regroup", hideVisual: hideVis }
      };
    }

    if (activeVariant === 'advanced_compare_more') {
      const a = Math.floor(Math.random() * 20) + 15;
      const diff = Math.floor(Math.random() * 20) + 15;
      const answer = String(a + diff);
      
      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Comparison Word Problem (More Than)\n - Constraints: Person 1 has ${a}. Person 2 has ${diff} MORE than Person 1.\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${isMCQ ? getOptions(answer) : 'null'}, "visualItems": [], "modelData": { "type": "NONE", "hideVisual": true }, "finalAnswer": "${answer}", "solution": "Since Person 2 has MORE, we must add. ${a} + ${diff} = ${answer}." }`,
        metadata: { difficulty, steps: 3, logic: "compare_more", hideVisual: true }
      };
    }

    if (activeVariant === 'advanced_compare_fewer') {
      const a = Math.floor(Math.random() * 40) + 50;
      const diff = Math.floor(Math.random() * 20) + 15;
      const answer = String(a - diff);
      
      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Comparison Word Problem (Fewer Than)\n - Constraints: Person 1 has ${a}. Person 2 has ${diff} FEWER than Person 1.\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${isMCQ ? getOptions(answer) : 'null'}, "visualItems": [], "modelData": { "type": "NONE", "hideVisual": true }, "finalAnswer": "${answer}", "solution": "Since Person 2 has FEWER, we must subtract. ${a} - ${diff} = ${answer}." }`,
        metadata: { difficulty, steps: 3, logic: "compare_fewer", hideVisual: true }
      };
    }

    // 5. Missing Addend with Regrouping (Equation)
    if (activeVariant === 'advanced_missing_addend_regroup') {
      const tensTotal = Math.floor(Math.random() * 3) + 6; // 6 to 8
      const onesTotal = Math.floor(Math.random() * 4) + 1; // 1 to 4
      const sum = (tensTotal * 10) + onesTotal; // e.g., 72
      
      const tensA = Math.floor(Math.random() * 3) + 2; // 2 to 4
      const onesA = Math.floor(Math.random() * 4) + 5; // 5 to 8 (Forces regrouping since onesA > onesTotal)
      const a = (tensA * 10) + onesA; // e.g., 37
      
      const answer = String(sum - a); // e.g., 35
      
      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Missing Addend with Regrouping\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "${getQText('What is the missing number?', a + ' + ? = ' + sum)}", "options": ${isMCQ ? getOptions(answer) : 'null'}, "visualItems": [], "modelData": { "type": "NUMBER_CARDS", "items": ["${a}", "+", "?", "=", "${sum}"], "hideVisual": ${hideVis} }, "finalAnswer": "${answer}", "solution": "To find the missing part, subtract the part you know from the whole: ${sum} - ${a} = ${answer} (requires regrouping)." }`,
        metadata: { difficulty, steps: 3, logic: "missing_addend_regroup", hideVisual: hideVis }
      };
    }

    // 6. Missing Subtrahend with Regrouping (Equation)
    if (activeVariant === 'advanced_missing_subtrahend_regroup') {
      const tensTotal = Math.floor(Math.random() * 3) + 7; // 7 to 9
      const onesTotal = Math.floor(Math.random() * 4) + 1; // 1 to 4
      const total = (tensTotal * 10) + onesTotal; // e.g., 83
      
      const tensLeft = Math.floor(Math.random() * 3) + 2; // 2 to 4
      const onesLeft = Math.floor(Math.random() * 4) + 5; // 5 to 8 (Forces regrouping)
      const left = (tensLeft * 10) + onesLeft; // e.g., 36
      
      const answer = String(total - left); // e.g., 47
      
      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Missing Subtrahend with Regrouping\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "${getQText('What is the missing number?', total + ' - ? = ' + left)}", "options": ${isMCQ ? getOptions(answer) : 'null'}, "visualItems": [], "modelData": { "type": "NUMBER_CARDS", "items": ["${total}", "-", "?", "=", "${left}"], "hideVisual": ${hideVis} }, "finalAnswer": "${answer}", "solution": "To find the part that was taken away, subtract the part left over from the whole: ${total} - ${left} = ${answer}." }`,
        metadata: { difficulty, steps: 3, logic: "missing_subtrahend_regroup", hideVisual: hideVis }
      };
    }

    // 7. Balance the Equation (Equation)
    if (activeVariant === 'advanced_balance_equation') {
      const a = Math.floor(Math.random() * 20) + 10;
      const b = Math.floor(Math.random() * 20) + 10;
      const sum = a + b;
      const c = Math.floor(Math.random() * (sum - 10)) + 5; // Must be smaller than sum
      const answer = String(sum - c);
      
      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Balancing Equations\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "${getQText('Balance the equation to find the missing number.', a + ' + ' + b + ' = ' + c + ' + ?')}", "options": ${isMCQ ? getOptions(answer) : 'null'}, "visualItems": [], "modelData": { "type": "NUMBER_CARDS", "items": ["${a}", "+", "${b}", "=", "${c}", "+", "?"], "hideVisual": ${hideVis} }, "finalAnswer": "${answer}", "solution": "First, find the total on the left side: ${a} + ${b} = ${sum}. Both sides must be equal. To find the missing number on the right, subtract: ${sum} - ${c} = ${answer}." }`,
        metadata: { difficulty, steps: 3, logic: "balance_equation", hideVisual: hideVis }
      };
    }

    // 8. Word Problem: Comparative Difference
    if (activeVariant === 'advanced_word_problem_compare_diff') {
      const a = Math.floor(Math.random() * 30) + 50; // 50 to 79
      const b = Math.floor(Math.random() * 20) + 15; // 15 to 34
      const answer = String(a - b);
      
      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Find the Difference Word Problem\n - Numbers to use: ${a} and ${b}\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${isMCQ ? getOptions(answer) : 'null'}, "visualItems": [], "modelData": { "type": "NONE", "hideVisual": true }, "finalAnswer": "${answer}", "solution": "To find how many more, we must find the difference by subtracting the smaller amount from the larger amount. ${a} - ${b} = ${answer}." }`,
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Find the Difference Word Problem\n - Numbers to use: ${a} and ${b}\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${isMCQ ? getOptions(answer) : 'null'}, "visualItems": [], "modelData": { "type": "NONE", "hideVisual": true }, "finalAnswer": "${answer}", "solution": "To find how many more, we must find the difference by subtracting the smaller amount from the larger amount. ${a} - ${b} = ${answer}." }`,
        metadata: { difficulty, steps: 3, logic: "word_problem_compare_diff", hideVisual: true }
      };
    }

    // 9. Word Problem: Two-Step Subtraction
    if (activeVariant === 'advanced_word_problem_two_step') {
      const total = Math.floor(Math.random() * 20) + 70; // 70 to 89
      const spent1 = Math.floor(Math.random() * 15) + 15; // 15 to 29
      const spent2 = Math.floor(Math.random() * 15) + 15; // 15 to 29
      const answer = String(total - spent1 - spent2);
      
      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Two-Step Subtraction Word Problem\n - Numbers to use: Start with ${total}, give away ${spent1}, then give away ${spent2}\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${isMCQ ? getOptions(answer) : 'null'}, "visualItems": [], "modelData": { "type": "NONE", "hideVisual": true }, "finalAnswer": "${answer}", "solution": "First, subtract the first amount: ${total} - ${spent1} = ${total - spent1}. Then, subtract the second amount: ${total - spent1} - ${spent2} = ${answer}." }`,
        metadata: { difficulty, steps: 3, logic: "word_problem_two_step", hideVisual: true }
      };
    }

    // 10. Word Problem: Money Change from $1
    if (activeVariant === 'advanced_word_problem_money_change') {
      const cost = Math.floor(Math.random() * 40) + 45; // 45 to 84 cents
      const answer = String(100 - cost);
      
      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Change from 100 Cents\n - Numbers to use: Cost is ${cost} cents. Paid with 100 cents.\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${isMCQ ? getOptions(answer) : 'null'}, "visualItems": [], "modelData": { "type": "NONE", "hideVisual": true }, "finalAnswer": "${answer}", "solution": "To find the change, subtract the cost from the amount paid. 100 - ${cost} = ${answer} cents." }`,
        metadata: { difficulty, steps: 3, logic: "word_problem_money_change", hideVisual: true }
      };
    }

    // 11. Cross-Topical: Length (Multi-step Subtraction then Addition)
    if (activeVariant === 'advanced_cross_length_total') {
      const lengthA = Math.floor(Math.random() * 20) + 30; // 30 to 49
      const diff = Math.floor(Math.random() * 15) + 10; // 10 to 24
      const lengthB = lengthA - diff;
      const answer = String(lengthA + lengthB); // Total length

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Cross-Topical (Addition/Subtraction + Length)\n - Constraints: Ribbon A is ${lengthA} cm. Ribbon B is ${diff} cm shorter than Ribbon A.\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station). Use "cm" for centimeters.\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${isMCQ ? getOptions(answer) : 'null'}, "visualItems": [], "modelData": { "type": "NONE", "hideVisual": true }, "finalAnswer": "${answer}", "solution": "Step 1: Find the length of the second item. ${lengthA} - ${diff} = ${lengthB} cm. Step 2: Find the total length by adding them together. ${lengthA} + ${lengthB} = ${answer} cm." }`,
        metadata: { difficulty, steps: 3, logic: "cross_length_total", hideVisual: true }
      };
    }

    // 12. Cross-Topical: Mass (Multi-step Addition then Addition)
    if (activeVariant === 'advanced_cross_mass_total') {
      const massA = Math.floor(Math.random() * 15) + 15; // 15 to 29
      const diff = Math.floor(Math.random() * 10) + 5; // 5 to 14
      const massB = massA + diff;
      const answer = String(massA + massB); // Total mass

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Cross-Topical (Addition + Mass)\n - Constraints: Box A is ${massA} kg. Box B is ${diff} kg heavier than Box A.\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station). Use "kg" for kilograms.\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${isMCQ ? getOptions(answer) : 'null'}, "visualItems": [], "modelData": { "type": "NONE", "hideVisual": true }, "finalAnswer": "${answer}", "solution": "Step 1: Find the mass of the second object. ${massA} + ${diff} = ${massB} kg. Step 2: Find the total mass. ${massA} + ${massB} = ${answer} kg." }`,
        metadata: { difficulty, steps: 3, logic: "cross_mass_total", hideVisual: true }
      };
    }

    // 13. Cross-Topical: Ordinal Numbers & Subtraction
    if (activeVariant === 'advanced_cross_ordinal_queue') {
      const total = Math.floor(Math.random() * 20) + 20; // 20 to 39
      const position = Math.floor(Math.random() * 10) + 5; // 5 to 14
      const answer = String(total - position);
      
      // Helper to generate correct ordinal suffix (th, st, nd, rd)
      const suffixes = ["th","st","nd","rd","th","th","th","th","th","th"];
      const getSuffix = (n) => (n % 100 >= 11 && n % 100 <= 13) ? "th" : suffixes[n % 10];
      const ordinalStr = `${position}${getSuffix(position)}`;

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Cross-Topical (Subtraction + Ordinal Numbers)\n - Constraints: ${total} people total. A specific person is in the ${ordinalStr} position from the front.\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${isMCQ ? getOptions(answer) : 'null'}, "visualItems": [], "modelData": { "type": "NONE", "hideVisual": true }, "finalAnswer": "${answer}", "solution": "If the person is ${ordinalStr} from the front, that means they occupy position number ${position}. To find how many people are behind them, subtract their position from the total number of people: ${total} - ${position} = ${answer} people." }`,
        metadata: { difficulty, steps: 3, logic: "cross_ordinal_queue", hideVisual: true }
      };
    }

    throw new Error(`Variant '${variant}' not valid for difficulty '${difficulty}'`);
  }
};