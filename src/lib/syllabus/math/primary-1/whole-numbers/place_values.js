/**
 * Blueprint for Primary 1: Place Values (Tens and Ones)
 * ENGINE: Generates AI prompt constraints, strictly pre-calculating math logic.
 * ARCHITECTURE: Pre-calculates distractors to prevent AI hallucinations.
 */

export const placeValuesBlueprint = {
  id: 'p1-place-values',
  title: 'Place Value (Tens/Ones)',
  strand: 'Number and Algebra',
  visualType: null, // Null avoids triggering untested UI components

  // 1. OVERARCHING CONDITIONS
  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 100,
      logicDescription: "Direct identification of tens, ones, and digit values."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      maxNumber: 100,
      logicDescription: "Simple regrouping and partitioned equations (e.g., 45 = 40 + 5)."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 3,
      maxNumber: 100,
      logicDescription: "Complex regrouping and multi-clue digit puzzles."
    }
  },

  // 2. STRICT VARIANTS
  variants: {
    foundation_identify: "Identify how many tens and ones are in a given number.",
    foundation_value: "Identify the actual value of a specific digit.",
    foundation_compose: "Compose a 2-digit number from given tens and ones.",
    foundation_decompose_tens: "Identify the number of tens in a multiple of 10.",
    foundation_digit_position: "Identify which digit is in the tens or ones place.",
    standard_partition: "Find the missing part in a base-10 equation (e.g., 34 = 30 + ?).",
    standard_basic_regrouping: "Regroup excess ones into tens (e.g., 2 tens 14 ones).",
    standard_partition_tens: "Find the missing tens part in a base-10 equation (e.g., 45 = ? + 5).",
    standard_word_problem_groups: "Solve a word problem involving items grouped in tens and loose ones.",
    standard_compare_place_value: "Compare two numbers described in tens and ones to find the greater/smaller.",
    standard_add_tens_concept: "Add a specific number of tens to a 2-digit number.",
    standard_subtract_tens_concept: "Subtract a specific number of tens from a 2-digit number.",
    standard_digit_clue: "Identify a number based on simple relative clues for its digits.",
    standard_expanded_form: "Identify the correct expanded form of a 2-digit number.",
    standard_equivalent_ones: "Convert a multiple of ten entirely into ones (e.g., 5 tens = 50 ones).",
    advanced_extreme_regrouping: "Find missing tens when given an extreme amount of ones.",
    advanced_digit_clues: "Logic puzzle based on the sum and difference of the digits.",
    advanced_mystery_number_bounds: "Find a mystery number given a range and a relationship between its digits.",
    advanced_digit_swap: "Find the original number if swapping its tens and ones gives a specific result.",
    advanced_balance_equation: "Find the missing ones/tens to balance a place value equation.",
    advanced_consecutive_digits: "Identify a number based on consecutive digits and their sum.",
    advanced_same_digits: "Identify a number where both digits are the same, given a specific range limit.",
    advanced_value_deduction: "Find a number given the actual value of its tens digit and the sum of its digits.",
    advanced_missing_regrouped_tens: "Determine how many tens are needed to reach a target after regrouping ones.",
    advanced_extreme_ones_comparison: "Compare a standard 2-digit number with a number expressed entirely in ones."
  },

  // 3. GENERATION ENGINE
  generate: (difficulty = 'foundation', variant = 'foundation_identify', type = 'MCQ') => {
    
    // --- LEGACY ADAPTER & AUTO-RANDOMIZER ---
    let activeVariant = variant;
    if (!placeValuesBlueprint.variants[variant]) {
      const validVariants = Object.keys(placeValuesBlueprint.variants).filter(k => k.startsWith(difficulty));
      if (validVariants.length > 0) {
        activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
      } else {
        activeVariant = 'foundation_identify'; 
      }
    }

    const formatInstructions = type === 'MCQ' 
      ? `Format as MCQ. Include an "options" array with 4 choices. "finalAnswer" must exactly match one of the options.` 
      : `Format as Short Answer. The "options" field in your JSON should be null.`;

    // ==========================================
    // FOUNDATION LEVEL
    // ==========================================

    if (activeVariant === 'foundation_identify') {
      const tens = Math.floor(Math.random() * 8) + 2; // 2 to 9
      const ones = Math.floor(Math.random() * 9) + 1; // 1 to 9
      const total = (tens * 10) + ones;
      
      const askForTens = Math.random() > 0.5;
      const answer = askForTens ? String(tens) : String(ones);
      const targetWord = askForTens ? "tens" : "ones";
      const optionsArray = type === 'MCQ' ? `["${tens}", "${ones}", "${total}", "${tens + ones}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Identifying Tens and Ones\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "Look at the number ${total}. How many ${targetWord} are there in this number?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "In the number ${total}, the first digit represents the tens and the second digit represents the ones. There are ${answer} ${targetWord}." }`,
        metadata: { difficulty, steps: 1, logic: "identify_place_value", hideVisual: true }
      };
    }

    if (activeVariant === 'foundation_value') {
      const tens = Math.floor(Math.random() * 8) + 2; 
      const ones = Math.floor(Math.random() * 8) + 1; 
      const total = (tens * 10) + ones;
      
      const askForTens = Math.random() > 0.5;
      const answer = askForTens ? String(tens * 10) : String(ones);
      const targetDigit = askForTens ? tens : ones;
      const optionsArray = type === 'MCQ' ? `["${tens}", "${ones}", "${tens * 10}", "${ones * 10}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Value of a Digit\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "In the number ${total}, what does the digit ${targetDigit} stand for?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "The digit ${targetDigit} is in the ${askForTens ? 'tens' : 'ones'} place, so it stands for ${answer}." }`,
        metadata: { difficulty, steps: 1, logic: "digit_value", hideVisual: true }
      };
    }

    // 3. Compose Number
    if (activeVariant === 'foundation_compose') {
      const tens = Math.floor(Math.random() * 8) + 2; // 2 to 9
      const ones = Math.floor(Math.random() * 9) + 1; // 1 to 9
      const total = (tens * 10) + ones;
      const answer = String(total);
      
      // Distractors: reverse digits, sum of digits, plus 10
      const optionsArray = type === 'MCQ' ? `["${(ones * 10) + tens}", "${tens + ones}", "${answer}", "${total + 10}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Compose Tens and Ones\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "What number is made of ${tens} tens and ${ones} ones?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "${tens} tens is ${tens * 10}. ${tens * 10} + ${ones} ones = ${total}." }`,
        metadata: { difficulty, steps: 1, logic: "compose_number", hideVisual: true }
      };
    }

    // 4. Decompose Multiples of Ten
    if (activeVariant === 'foundation_decompose_tens') {
      const tens = Math.floor(Math.random() * 8) + 2; // 2 to 9
      const total = tens * 10;
      const answer = String(tens);
      
      const optionsArray = type === 'MCQ' ? `["${tens - 1}", "${answer}", "${total}", "0"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Decompose Multiples of 10\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "How many tens are there in the number ${total}?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "The number ${total} is made up of ${tens} groups of ten." }`,
        metadata: { difficulty, steps: 1, logic: "decompose_tens_only", hideVisual: true }
      };
    }

    // 5. Digit Position Identification
    if (activeVariant === 'foundation_digit_position') {
      let tens = Math.floor(Math.random() * 8) + 2; // 2 to 9
      let ones = Math.floor(Math.random() * 9) + 1; // 1 to 9
      if (tens === ones) ones = (ones % 8) + 1; // Ensure digits are different
      
      const total = (tens * 10) + ones;
      const askForTens = Math.random() > 0.5;
      const answer = askForTens ? String(tens) : String(ones);
      const targetWord = askForTens ? "tens" : "ones";
      
      const optionsArray = type === 'MCQ' ? `["${tens}", "${ones}", "${total}", "0"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Digit Position\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "Look at the number ${total}. Which digit is in the ${targetWord} place?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "In the number ${total}, the first digit (${tens}) is in the tens place, and the second digit (${ones}) is in the ones place. So, the digit is ${answer}." }`,
        metadata: { difficulty, steps: 1, logic: "digit_position", hideVisual: true }
      };
    }

    // ==========================================
    // STANDARD LEVEL
    // ==========================================

    if (activeVariant === 'standard_partition') {
      const tens = Math.floor(Math.random() * 8) + 2; 
      const ones = Math.floor(Math.random() * 8) + 1; 
      const total = (tens * 10) + ones;
      
      const askForTens = Math.random() > 0.5;
      const answer = askForTens ? String(tens * 10) : String(ones);
      const givenPart = askForTens ? ones : (tens * 10);
      const optionsArray = type === 'MCQ' ? `["${tens}", "${ones}", "${tens * 10}", "${total}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Number Partitioning\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "Fill in the missing number: ${total} = ${givenPart} + ____", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "${total} is made of ${tens * 10} and ${ones}. Since ${givenPart} is given, the missing part is ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "partitioning_equation", hideVisual: true }
      };
    }

    if (activeVariant === 'standard_basic_regrouping') {
      const tens = Math.floor(Math.random() * 6) + 1; // 1 to 6
      const excessOnes = Math.floor(Math.random() * 8) + 12; // 12 to 19 ones
      const total = (tens * 10) + excessOnes;
      const answer = String(total);
      const optionsArray = type === 'MCQ' ? `["${tens + excessOnes}", "${(tens * 10) + (excessOnes % 10)}", "${answer}", "${total + 10}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Basic Regrouping\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "What number is the same as ${tens} tens and ${excessOnes} ones?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "${tens} tens is ${tens * 10}. ${tens * 10} + ${excessOnes} = ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "basic_regrouping", hideVisual: true }
      };
    }

    // 3. Partition Tens
    if (activeVariant === 'standard_partition_tens') {
      const tens = Math.floor(Math.random() * 8) + 2; // 2 to 9
      const ones = Math.floor(Math.random() * 8) + 1; // 1 to 9
      const total = (tens * 10) + ones;
      const answer = String(tens * 10);
      const optionsArray = type === 'MCQ' ? `["${tens}", "${ones}", "${answer}", "${total}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Number Partitioning (Tens)\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "Fill in the missing number: ${total} = ____ + ${ones}", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "${total} is made of ${tens * 10} and ${ones}. The missing part is ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "partition_tens", hideVisual: true }
      };
    }

    // 4. Word Problem Groups
    if (activeVariant === 'standard_word_problem_groups') {
      const tens = Math.floor(Math.random() * 6) + 2; // 2 to 7
      const ones = Math.floor(Math.random() * 8) + 1; // 1 to 8
      const total = (tens * 10) + ones;
      const answer = String(total);
      const optionsArray = type === 'MCQ' ? `["${tens + ones}", "${(ones * 10) + tens}", "${total - 10}", "${answer}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Place Value Word Problem\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Create a simple story about a shopkeeper, baker, or teacher packing items.\n - They must have ${tens} boxes/bags of 10 items, and ${ones} extra loose items.\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "A baker packs cookies in bags of 10. He has ${tens} bags of cookies and ${ones} extra cookies. How many cookies does he have altogether?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "${tens} bags of 10 is ${tens * 10}. ${tens * 10} + ${ones} extra = ${answer} cookies." }`,
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Place Value Word Problem\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n - The scenario should involve packing ${tens} boxes/bags of 10 items, and ${ones} extra loose items.\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "${tens} groups of 10 is ${tens * 10}. ${tens * 10} + ${ones} extra = ${answer} items." }`,
        metadata: { difficulty, steps: 2, logic: "word_problem_groups", hideVisual: true }
      };
    }

    // 5. Compare Place Value
    if (activeVariant === 'standard_compare_place_value') {
      const t1 = Math.floor(Math.random() * 5) + 4; // 4 to 8
      const o1 = Math.floor(Math.random() * 8) + 1; 
      const t2 = t1 - (Math.floor(Math.random() * 2) + 1); // 1 or 2 less
      const o2 = Math.floor(Math.random() * 8) + 1;
      
      const num1 = (t1 * 10) + o1;
      const num2 = (t2 * 10) + o2;
      
      const askGreater = Math.random() > 0.5;
      const answer = askGreater ? String(Math.max(num1, num2)) : String(Math.min(num1, num2));
      const targetWord = askGreater ? "greater" : "smaller";
      
      const optionsArray = type === 'MCQ' ? `["${num1}", "${num2}", "${(o1 * 10) + t1}", "${(o2 * 10) + t2}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Compare Place Values\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "Which is ${targetWord}: ${t1} tens ${o1} ones OR ${t2} tens ${o2} ones?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "${t1} tens ${o1} ones is ${num1}. ${t2} tens ${o2} ones is ${num2}. The ${targetWord} number is ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "compare_place_value", hideVisual: true }
      };
    }

    // 6. Add Tens Concept
    if (activeVariant === 'standard_add_tens_concept') {
      const startTens = Math.floor(Math.random() * 4) + 2; // 2 to 5
      const ones = Math.floor(Math.random() * 8) + 1;
      const startNum = (startTens * 10) + ones;
      const addTens = Math.floor(Math.random() * 3) + 1; // 1 to 3
      const totalNum = startNum + (addTens * 10);
      const answer = String(totalNum);
      const optionsArray = type === 'MCQ' ? `["${startNum + addTens}", "${totalNum - 10}", "${answer}", "${totalNum + 10}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Add Tens conceptually\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "What is ${addTens} tens more than ${startNum}?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "${addTens} tens is ${addTens * 10}. ${startNum} + ${addTens * 10} = ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "add_tens", hideVisual: true }
      };
    }

    // 7. Subtract Tens Concept
    if (activeVariant === 'standard_subtract_tens_concept') {
      const startTens = Math.floor(Math.random() * 4) + 5; // 5 to 8
      const ones = Math.floor(Math.random() * 8) + 1;
      const startNum = (startTens * 10) + ones;
      const subTens = Math.floor(Math.random() * 3) + 1; // 1 to 3
      const totalNum = startNum - (subTens * 10);
      const answer = String(totalNum);
      const optionsArray = type === 'MCQ' ? `["${startNum - subTens}", "${totalNum - 10}", "${answer}", "${totalNum + 10}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Subtract Tens conceptually\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "What is ${subTens} tens less than ${startNum}?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "${subTens} tens is ${subTens * 10}. ${startNum} - ${subTens * 10} = ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "subtract_tens", hideVisual: true }
      };
    }

    // 8. Digit Clue
    if (activeVariant === 'standard_digit_clue') {
      const tens = Math.floor(Math.random() * 4) + 2; // 2 to 5
      const diff = Math.floor(Math.random() * 3) + 1; // 1 to 3
      const ones = tens + diff; 
      const total = (tens * 10) + ones;
      const answer = String(total);
      const optionsArray = type === 'MCQ' ? `["${(ones * 10) + tens}", "${total - 10}", "${answer}", "${total + diff}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Digit Clues\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "I am a 2-digit number. My tens digit is ${tens}. My ones digit is ${diff} more than my tens digit. What number am I?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "The tens digit is ${tens}. The ones digit is ${tens} + ${diff} = ${ones}. The number is ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "digit_clues", hideVisual: true }
      };
    }

    // 9. Expanded Form
    if (activeVariant === 'standard_expanded_form') {
      const tens = Math.floor(Math.random() * 8) + 2;
      const ones = Math.floor(Math.random() * 8) + 1;
      const total = (tens * 10) + ones;
      const answer = `${tens * 10} + ${ones}`;
      const optionsArray = type === 'MCQ' ? `["${tens} + ${ones}", "${ones * 10} + ${tens}", "${answer}", "${tens * 10} + ${ones * 10}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Expanded Form\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "Which of the following is equal to ${total}?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "${total} has ${tens} tens (${tens * 10}) and ${ones} ones. So, ${total} = ${answer}." }`,
        metadata: { difficulty, steps: 1, logic: "expanded_form", hideVisual: true }
      };
    }

    // 10. Equivalent Ones
    if (activeVariant === 'standard_equivalent_ones') {
      const tens = Math.floor(Math.random() * 8) + 2;
      const answer = String(tens * 10);
      const optionsArray = type === 'MCQ' ? `["${tens}", "${tens + 10}", "${answer}", "${tens * 100}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Equivalent Ones\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "How many ones are there in ${tens} tens?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "${tens} tens is equal to ${answer}. Therefore, there are ${answer} ones." }`,
        metadata: { difficulty, steps: 1, logic: "equivalent_ones", hideVisual: true }
      };
    }

    // ==========================================
    // ADVANCED LEVEL
    // ==========================================

    if (activeVariant === 'advanced_extreme_regrouping') {
      const targetTens = Math.floor(Math.random() * 4) + 5; // 5 to 8 tens total
      const onesGiven = Math.floor(Math.random() * 3) * 10 + 20; // 20, 30, or 40 ones
      const total = targetTens * 10;
      const tensNeeded = (total - onesGiven) / 10;
      const answer = String(tensNeeded);
      const optionsArray = type === 'MCQ' ? `["${tensNeeded - 1}", "${answer}", "${tensNeeded + 1}", "${targetTens}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Extreme Regrouping Puzzle\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "${total} is the same as ____ tens and ${onesGiven} ones. What is the missing number?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "${onesGiven} ones is the same as ${onesGiven / 10} tens. To make ${targetTens} tens total, we need ${tensNeeded} more tens." }`,
        metadata: { difficulty, steps: 3, logic: "extreme_regrouping", hideVisual: true }
      };
    }

    if (activeVariant === 'advanced_digit_clues') {
      const tensDigit = Math.floor(Math.random() * 4) + 4; // 4 to 7
      const onesDigit = tensDigit - (Math.floor(Math.random() * 2) + 2); // 2 or 3 less than tens
      const total = (tensDigit * 10) + onesDigit;
      const answer = String(total);
      const sum = tensDigit + onesDigit;
      const diff = tensDigit - onesDigit;
      const optionsArray = type === 'MCQ' ? `["${(onesDigit * 10) + tensDigit}", "${total - 10}", "${total}", "${total + 1}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Digit Logic Puzzle\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "I am a 2-digit number. The sum of my digits is ${sum}. My tens digit is ${diff} more than my ones digit. What number am I?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${total}", "solution": "The two numbers that add to ${sum} and have a difference of ${diff} are ${tensDigit} and ${onesDigit}. Since the tens digit is bigger, the number is ${total}." }`,
        metadata: { difficulty, steps: 3, logic: "digit_logic_puzzle", hideVisual: true }
      };
    }

    // 3. Mystery Number Bounds
    if (activeVariant === 'advanced_mystery_number_bounds') {
      const tens = Math.floor(Math.random() * 3) + 5; // 5 to 7
      const diff = Math.floor(Math.random() * 2) + 2; // 2 to 3
      const ones = tens + diff; // e.g., 5 + 3 = 8
      const total = (tens * 10) + ones;
      const lower = tens * 10;
      const upper = lower + 10;
      const answer = String(total);
      const optionsArray = type === 'MCQ' ? `["${(ones * 10) + tens}", "${total - 10}", "${answer}", "${total + 1}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Bounded Digit Puzzle\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "I am a number between ${lower} and ${upper}. My ones digit is ${diff} more than my tens digit. What number am I?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "Numbers between ${lower} and ${upper} have a tens digit of ${tens}. Since the ones digit is ${diff} more, the ones digit is ${tens} + ${diff} = ${ones}. The number is ${answer}." }`,
        metadata: { difficulty, steps: 3, logic: "mystery_bounds", hideVisual: true }
      };
    }

    // 4. Digit Swap
    if (activeVariant === 'advanced_digit_swap') {
      const tens = Math.floor(Math.random() * 5) + 2; // 2 to 6
      const ones = Math.floor(Math.random() * 3) + tens + 1; // Ensure ones > tens
      const original = (tens * 10) + ones;
      const swapped = (ones * 10) + tens;
      const answer = String(original);
      const optionsArray = type === 'MCQ' ? `["${swapped}", "${original - 10}", "${answer}", "${swapped + 10}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Digit Swapping\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "I am a 2-digit number. If you swap my tens digit and my ones digit, I become ${swapped}. What number was I at first?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "The number ${swapped} has ${ones} tens and ${tens} ones. Swapping them back gives ${tens} tens and ${ones} ones, which is ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "digit_swap", hideVisual: true }
      };
    }

    // 5. Balance Equation
    if (activeVariant === 'advanced_balance_equation') {
      const leftTens = Math.floor(Math.random() * 4) + 2; // 2 to 5
      const leftOnes = Math.floor(Math.random() * 8) + 12; // 12 to 19
      const total = (leftTens * 10) + leftOnes;
      const rightTens = leftTens + 1;
      const rightOnes = leftOnes - 10;
      const answer = String(rightOnes);
      const optionsArray = type === 'MCQ' ? `["${leftOnes}", "${rightOnes - 1}", "${answer}", "${total}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Balance Place Value Equation\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "Fill in the missing number: ${leftTens} tens ${leftOnes} ones = ${rightTens} tens ____ ones.", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "${leftTens} tens ${leftOnes} ones is ${total}. ${rightTens} tens is ${rightTens * 10}. ${total} - ${rightTens * 10} = ${answer} ones." }`,
        metadata: { difficulty, steps: 3, logic: "balance_equation", hideVisual: true }
      };
    }

    // 6. Consecutive Digits
    if (activeVariant === 'advanced_consecutive_digits') {
      const ones = Math.floor(Math.random() * 5) + 2; // 2 to 6
      const tens = ones + 1; // 3 to 7
      const sum = tens + ones;
      const total = (tens * 10) + ones;
      const answer = String(total);
      const optionsArray = type === 'MCQ' ? `["${(ones * 10) + tens}", "${total - 10}", "${answer}", "${total + 1}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Consecutive Digits\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "I am a 2-digit number. My digits are consecutive numbers (one comes right after the other). The sum of my digits is ${sum}, and my tens digit is larger. What number am I?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "The consecutive numbers that add up to ${sum} are ${tens} and ${ones}. Since the tens digit is larger, the number is ${answer}." }`,
        metadata: { difficulty, steps: 3, logic: "consecutive_digits", hideVisual: true }
      };
    }

    // 7. Same Digits Range
    if (activeVariant === 'advanced_same_digits') {
      const digit = Math.floor(Math.random() * 5) + 4; // 4 to 8
      const total = (digit * 10) + digit;
      const lower = (digit * 10) - 10;
      const upper = (digit * 10) + 10;
      const answer = String(total);
      const optionsArray = type === 'MCQ' ? `["${lower + 11}", "${total - 10}", "${answer}", "${upper - 11}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Same Digits Bounds\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "I am a number between ${lower} and ${upper}. Both of my digits are exactly the same. What number am I?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "The numbers with the same digits are 11, 22, 33, 44, etc. The only one between ${lower} and ${upper} is ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "same_digits", hideVisual: true }
      };
    }

    // 8. Value Deduction
    if (activeVariant === 'advanced_value_deduction') {
      const tens = Math.floor(Math.random() * 5) + 4; // 4 to 8
      const ones = Math.floor(Math.random() * 8) + 1;
      const total = (tens * 10) + ones;
      const tensValue = tens * 10;
      const sum = tens + ones;
      const answer = String(total);
      const optionsArray = type === 'MCQ' ? `["${(ones * 10) + tens}", "${total - 10}", "${answer}", "${total + 1}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Digit Value Logic\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "The value of my tens digit is ${tensValue}. The sum of my two digits is ${sum}. What number am I?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "If the value of the tens digit is ${tensValue}, the tens digit is ${tens}. ${tens} + ones digit = ${sum}, so the ones digit is ${ones}. The number is ${answer}." }`,
        metadata: { difficulty, steps: 3, logic: "value_deduction", hideVisual: true }
      };
    }

    // 9. Missing Regrouped Tens
    if (activeVariant === 'advanced_missing_regrouped_tens') {
      const startTens = Math.floor(Math.random() * 2) + 1; // 1 to 2
      const startOnes = 20; // Hardcoded to 20 for pure P1 regrouping
      const currentTotal = (startTens * 10) + startOnes;
      const neededTens = Math.floor(Math.random() * 3) + 2; // 2 to 4
      const targetTotal = currentTotal + (neededTens * 10);
      const answer = String(neededTens);
      const optionsArray = type === 'MCQ' ? `["${neededTens - 1}", "${answer}", "${neededTens * 10}", "${targetTotal}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Regrouping Addition\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "Calculate how many more tens are needed after regrouping ones." }`,
        metadata: { difficulty, steps: 3, logic: "missing_regrouped_tens", hideVisual: true }
      };
    }

    // 10. Extreme Ones Comparison
    if (activeVariant === 'advanced_extreme_ones_comparison') {
      const tens = Math.floor(Math.random() * 4) + 4; // 4 to 7
      const ones = Math.floor(Math.random() * 8) + 1;
      const num1 = (tens * 10) + ones;
      const num2 = num1 + (Math.random() > 0.5 ? 2 : -2); // Extremely close comparison
      
      const askGreater = Math.random() > 0.5;
      const answer = askGreater ? String(Math.max(num1, num2)) : String(Math.min(num1, num2));
      const targetWord = askGreater ? "greater" : "smaller";
      
      const optionsArray = type === 'MCQ' ? `["${num1}", "${num2}", "${Math.max(num1, num2) + 10}", "${Math.min(num1, num2) - 10}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Extreme Ones Comparison\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "Which number is ${targetWord}: ${tens} tens ${ones} ones OR ${num2} ones?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "${tens} tens ${ones} ones is ${num1}. Comparing ${num1} and ${num2}, the ${targetWord} number is ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "extreme_comparison", hideVisual: true }
      };
    }

    throw new Error(`Variant '${variant}' (mapped to '${activeVariant}') not valid for difficulty '${difficulty}'`);
  }
};