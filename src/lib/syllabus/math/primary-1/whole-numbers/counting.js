/**
 * Blueprint for Primary 1: Numbers to 100 (Counting, Comparing, Patterns)
 * ENGINE: Generates AI prompt constraints, leaving creative generation to the LLM.
 * ARCHITECTURE: Route strictly controls variation via the 'variant' argument.
 */

export const countingBlueprint = {
  id: 'p1-counting',
  title: 'Counting to 100',
  strand: 'Number and Algebra', // Retain strand as it's a core curriculum identifier
  visualType: 'COUNTING_OBJECTS',
  
  // 1. OVERARCHING CONDITIONS (Logical Constraints)
  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 100,
      logicDescription: "Direct counting and grouping tens/ones."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      maxNumber: 100,
      logicDescription: "Counting on and identifying place value digits."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 3,
      maxNumber: 100,
      logicDescription: "Place value regrouping and multi-condition number clues."
    }
  },

  // 2. STRICT VARIANTS (Controlled by Route)
  variants: {
    foundation_grouping: "Visual counting using groups of 10s and 1s.",
    foundation_sequence: "Simple forward or backward number sequence.",
    standard_count_on: "Counting on from a specific number to find a total.",
    standard_tens_ones: "Identifying the number of tens and ones in a 2-digit number.",
    standard_count_back: "Counting backward from a specific number.",
    standard_10_more: "Finding 10 more than a given 2-digit number.",
    standard_10_less: "Finding 10 less than a given 2-digit number.",
    standard_compose_base_10: "Composing a number from given tens and ones.",
    standard_decompose_tens: "Finding the missing tens digit when ones are given.",
    standard_decompose_ones: "Finding the missing ones digit when tens are given.",
    standard_word_to_numeral: "Converting a number word into a numeral.",
    standard_numeral_to_word: "Converting a numeral into a number word.",
    advanced_regrouping: "Place value trick questions (e.g., 2 tens and 15 ones).",
    advanced_clues: "Mental logic puzzle to identify a mystery number.",
    advanced_extreme_regrouping: "Place value puzzle with heavily unbalanced tens and ones.",
    advanced_digit_sum: "Number puzzle based on a specific tens digit and the sum of its digits.",
    advanced_digit_difference: "Number puzzle based on the difference between tens and ones digits.",
    advanced_comparison_puzzle: "Mystery number bound by greater than / smaller than conditions.",
    advanced_word_problem_10s_1s: "Real-world word problem requiring grouping tens and excess ones.",
    advanced_value_of_digit: "Identifying the actual value of a specific digit in a 2-digit number.",
    advanced_sequence_logic: "Mental math involving multiple skip-count jumps from a starting number.",
    advanced_two_step_sequence: "Finding a missing number deeper into a skip-counting sequence."
  },

  // 3. GENERATION ENGINE
  generate: (difficulty = 'foundation', variant = 'foundation_grouping', type = 'MCQ') => {
    
    // --- LEGACY ADAPTER & AUTO-RANDOMIZER ---
    let activeVariant = variant;
    if (!countingBlueprint.variants[variant]) {
      const validVariants = Object.keys(countingBlueprint.variants).filter(k => k.startsWith(difficulty));
      if (validVariants.length > 0) {
        activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
      } else {
        activeVariant = 'foundation_grouping'; 
      }
    }
    // ----------------------------------------

    const formatInstructions = type === 'MCQ' 
      ? `Format as MCQ. Include an "options" array with 4 choices. "finalAnswer" must exactly match one of the options.` 
      : `Format as Short Answer. The "options" field in your JSON should be null.`;

    // ==========================================
    // FOUNDATION LEVEL
    // ==========================================

    // 1. Grouping Tens and Ones
    if (activeVariant === 'foundation_grouping') { // Reverted to original syllabus.js specifications
      const tens = Math.floor(Math.random() * 4) + 2; // 2 to 5 tens (20-59 items total to prevent heavy UI lag)
      const ones = Math.floor(Math.random() * 9) + 1; // 1 to 9 ones
      const total = (tens * 10) + ones;

      // Layout Logic: Create an array of groups (e.g., 34 -> [10, 10, 10, 4])
      // The DiagramRenderer needs this to position items in Tens and Ones rows.
      const groups = Array(tens).fill(10);
      if (ones > 0) groups.push(ones);

      // RESTORE OLD SYLLABUS LOGIC: 50% Numeral, 50% Word
      const askForWord = Math.random() > 0.5;
      
      const numberToWords = (num) => {
        const onesArr = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
        const tensArr = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
        if (num < 20) return onesArr[num];
        return tensArr[Math.floor(num / 10)] + (num % 10 === 0 ? "" : "-" + onesArr[num % 10]);
      };

      const expectedAnswer = askForWord ? numberToWords(total) : String(total);
      const optionValues = [total - 10, total - 1, total, total + 1];
      const formattedOptions = askForWord 
        ? optionValues.map(v => numberToWords(v)) 
        : optionValues.map(v => String(v));

      const promptInstruction = askForWord 
        ? "Ask the student to count the items and write the number in WORDS (e.g., 'thirty-four')." 
        : "Ask the student to count the items and write the number in NUMERALS (e.g., '34').";

      return {
        aiPrompt: `You are an expert Primary 1 math question generator.
        
        MATH CONSTRAINTS:
        - Topic: Counting to 100 (Foundation Level - Tens and Ones)
        - Format: ${type}
        - Setup: There are ${total} items in total.
        - Question: ${promptInstruction}
        - Final Answer MUST strictly be: "${expectedAnswer}"
        ${formatInstructions}
        
        CREATIVE INSTRUCTIONS:
        - Choose a simple theme (e.g., fruits, animals, toys).
        - The "visualItems" array MUST contain exactly ${total} strings of the SAME emoji (e.g., ["🍎", "🍎", ...]).
        - Each string MUST be a single emoji representing the chosen theme (e.g., "🍎", "⚽", "🐻").
        - KEEP THE STRINGS SHORT. Do not write long sentences in the array.
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        {
          "question": "Your creative question text...",
          "options": ${type === 'MCQ' ? JSON.stringify(formattedOptions) : 'null'},
          "visualItems": ["emoji", "emoji", ...],
          "modelData": {
            "type": "COUNTING_OBJECTS",
            "groups": ${JSON.stringify(groups)},
            "items": ["emoji", "emoji", ...]
          },
          "finalAnswer": "${expectedAnswer}",
          "solution": "There are ${tens} groups of ten (${tens * 10}) and ${ones} ones. Total is ${total}."
        }`,
        metadata: { difficulty, steps: 1, logic: "base_ten_grouping", hideVisual: false }
      };
    }

    // 2. Simple Sequence
    if (activeVariant === 'foundation_sequence') {
      const start = Math.floor(Math.random() * 60) + 20;
      const isForward = Math.random() > 0.5;
      const step = isForward ? 1 : -1;
      const sequence = [start, start + step, start + (step * 2), "___"];
      const answer = start + (step * 3);

      return {
        aiPrompt: `You are an expert Primary 1 math question generator.
        
        MATH CONSTRAINTS:
        - Topic: Counting to 100 (Foundation Level - Number Sequence)
        - Format: ${type}
        - Sequence: ${sequence.join(", ")}
        - Question: Ask what number comes next to complete the pattern.
        - Final Answer MUST strictly be: "${answer}"
        ${formatInstructions}
        
        CREATIVE INSTRUCTIONS:
        - Present this as a simple pattern completion task. Use a mild theme (e.g., stepping stones, train carriages).
        - No complex visuals needed.
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        {
          "question": "Look at the numbers on the train carriages: ${sequence.join(", ")}. What number comes next?",
          "options": ${type === 'MCQ' ? `["${answer - 2}", "${answer - 1}", "${answer}", "${answer + 1}"]` : 'null'},
          "visualItems": [],
          "finalAnswer": "${answer}",
          "solution": "The numbers are counting ${isForward ? 'on' : 'back'} by 1. The next number is ${answer}."
        }`,
        visualItems: [],
        metadata: { difficulty, steps: 1, logic: "simple_sequence", hideVisual: true }
      };
    }

    // ==========================================
    // STANDARD LEVEL
    // ==========================================

    // 3. Counting On
    if (activeVariant === 'standard_count_on') {
      const startNum = Math.floor(Math.random() * 50) + 20;
      const countOnAmount = Math.floor(Math.random() * 5) + 2; 
      const answer = startNum + countOnAmount;

      return {
        aiPrompt: `You are an expert Primary 1 math question generator.
        
        MATH CONSTRAINTS:
        - Topic: Counting to 100 (Standard Level - Counting On)
        - Format: ${type}
        - Start Number: ${startNum}
        - Amount to count on: ${countOnAmount}
        - Question: Ask the student what number they get if they count on ${countOnAmount} steps from ${startNum}.
        - Final Answer MUST strictly be: "${answer}"
        ${formatInstructions}
        
        CREATIVE INSTRUCTIONS:
        - Use a simple scenario (e.g., reading page ${startNum} and reading ${countOnAmount} more pages).
        - Do not use arrays or visual items.
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        {
          "question": "Your creative question...",
          "options": ${type === 'MCQ' ? `["${answer - 2}", "${answer - 1}", "${answer}", "${answer + 1}"]` : 'null'},
          "visualItems": [],
          "finalAnswer": "${answer}",
          "solution": "Count on ${countOnAmount} from ${startNum}: ${startNum + 1}, ${startNum + 2}... The answer is ${answer}."
        }`,
        metadata: { difficulty, steps: 2, logic: "counting_on", hideVisual: true }
      };
    }

    // 4. Identifying Tens and Ones
    if (activeVariant === 'standard_tens_ones') {
      const tens = Math.floor(Math.random() * 8) + 2;
      const ones = Math.floor(Math.random() * 9) + 1;
      const total = (tens * 10) + ones;
      
      // Randomly ask for tens or ones digit
      const askForTens = Math.random() > 0.5;
      const answer = askForTens ? String(tens) : String(ones);
      const targetWord = askForTens ? "tens" : "ones";

      return {
        aiPrompt: `You are an expert Primary 1 math question generator.
        
        MATH CONSTRAINTS:
        - Topic: Counting to 100 (Standard Level - Place Value)
        - Format: ${type}
        - Target Number: ${total}
        - Question: Ask how many ${targetWord} are in the number ${total}.
        - Final Answer MUST strictly be: "${answer}"
        ${formatInstructions}
        
        CREATIVE INSTRUCTIONS:
        - Ask directly. No complex scenarios needed.
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        {
          "question": "How many ${targetWord} are in the number ${total}?",
          "options": ${type === 'MCQ' ? `["${tens}", "${ones}", "${total - 10}", "${total}"]` : 'null'},
          "visualItems": [],
          "finalAnswer": "${answer}",
          "solution": "In the number ${total}, the first digit represents the tens and the second represents the ones. There are ${answer} ${targetWord}."
        }`,
        metadata: { difficulty, steps: 1, logic: "place_value_digits", hideVisual: true }
      };
    }

    // Helper function for word variants
    const numberToWords = (num) => {
      const onesArr = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
      const tensArr = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
      if (num < 20) return onesArr[num];
      return tensArr[Math.floor(num / 10)] + (num % 10 === 0 ? "" : "-" + onesArr[num % 10]);
    };

    // 5. Counting Back
    if (activeVariant === 'standard_count_back') {
      const startNum = Math.floor(Math.random() * 60) + 30; // 30 to 89
      const countBackAmount = Math.floor(Math.random() * 4) + 2; // 2 to 5
      const answer = startNum - countBackAmount;
      const optionsArray = type === 'MCQ' ? `["${answer - 2}", "${answer - 1}", "${answer}", "${answer + 1}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Counting Back\n - Start: ${startNum}\n - Count back by: ${countBackAmount}\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "Count back ${countBackAmount} steps from ${startNum}. What number do you get?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "Counting back from ${startNum}: ${startNum - 1}, ${startNum - 2}... you get ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "counting_back", hideVisual: true }
      };
    }

    // 6. 10 More
    if (activeVariant === 'standard_10_more') {
      const startNum = Math.floor(Math.random() * 70) + 10;
      const answer = startNum + 10;
      const optionsArray = type === 'MCQ' ? `["${startNum + 1}", "${startNum + 5}", "${answer}", "${answer + 10}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: 10 More\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "What is 10 more than ${startNum}?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "${startNum} + 10 = ${answer}." }`,
        metadata: { difficulty, steps: 1, logic: "ten_more", hideVisual: true }
      };
    }

    // 7. 10 Less
    if (activeVariant === 'standard_10_less') {
      const startNum = Math.floor(Math.random() * 70) + 20;
      const answer = startNum - 10;
      const optionsArray = type === 'MCQ' ? `["${answer - 10}", "${answer - 1}", "${answer}", "${startNum - 1}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: 10 Less\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "What is 10 less than ${startNum}?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "${startNum} - 10 = ${answer}." }`,
        metadata: { difficulty, steps: 1, logic: "ten_less", hideVisual: true }
      };
    }

    // 8. Compose Base 10
    if (activeVariant === 'standard_compose_base_10') {
      const tens = Math.floor(Math.random() * 8) + 2;
      const ones = Math.floor(Math.random() * 9) + 1;
      const answer = (tens * 10) + ones;
      const optionsArray = type === 'MCQ' ? `["${(ones * 10) + tens}", "${tens + ones}", "${answer}", "${answer + 10}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Compose Base 10\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "${tens} tens and ${ones} ones make what number?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "${tens} tens is ${tens * 10}. ${tens * 10} + ${ones} = ${answer}." }`,
        metadata: { difficulty, steps: 1, logic: "compose_base_10", hideVisual: true }
      };
    }

    // 9. Decompose Tens
    if (activeVariant === 'standard_decompose_tens') {
      const tens = Math.floor(Math.random() * 8) + 2;
      const ones = Math.floor(Math.random() * 9) + 1;
      const total = (tens * 10) + ones;
      const answer = String(tens);
      const optionsArray = type === 'MCQ' ? `["${ones}", "${tens}", "${tens * 10}", "${total}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Decompose Tens\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "${total} = ___ tens and ${ones} ones. What is the missing number?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "The number ${total} has ${tens} tens." }`,
        metadata: { difficulty, steps: 1, logic: "decompose_tens", hideVisual: true }
      };
    }

    // 10. Decompose Ones
    if (activeVariant === 'standard_decompose_ones') {
      const tens = Math.floor(Math.random() * 8) + 2;
      const ones = Math.floor(Math.random() * 9) + 1;
      const total = (tens * 10) + ones;
      const answer = String(ones);
      const optionsArray = type === 'MCQ' ? `["${ones}", "${tens}", "${tens * 10}", "${total}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Decompose Ones\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "${total} = ${tens} tens and ___ ones. What is the missing number?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "The number ${total} has ${ones} ones." }`,
        metadata: { difficulty, steps: 1, logic: "decompose_ones", hideVisual: true }
      };
    }

    // 11. Word to Numeral
    if (activeVariant === 'standard_word_to_numeral') {
      const total = Math.floor(Math.random() * 80) + 20;
      const word = numberToWords(total);
      const answer = String(total);
      const reversedTotal = (total % 10) * 10 + Math.floor(total / 10);
      const optionsArray = type === 'MCQ' ? `["${total - 10}", "${reversedTotal}", "${answer}", "${total + 1}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Number Words\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "Write the number '${word}' in numerals.", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "The word '${word}' is written as ${answer}." }`,
        metadata: { difficulty, steps: 1, logic: "word_to_numeral", hideVisual: true }
      };
    }

    // 12. Numeral to Word
    if (activeVariant === 'standard_numeral_to_word') {
      const total = Math.floor(Math.random() * 80) + 20;
      const answer = numberToWords(total);
      const reversedWord = numberToWords((total % 10) * 10 + Math.floor(total / 10));
      const optionsArray = type === 'MCQ' ? `["${numberToWords(total - 10)}", "${reversedWord}", "${answer}", "${numberToWords(total + 1)}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Numeral to Word\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "How do you write ${total} in words?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "${total} is written as ${answer}." }`,
        metadata: { difficulty, steps: 1, logic: "numeral_to_word", hideVisual: true }
      };
    }

    // ==========================================
    // ADVANCED LEVEL
    // ==========================================

    // 5. Place Value Regrouping (Trick Question)
    if (activeVariant === 'advanced_regrouping') {
      const tens = Math.floor(Math.random() * 4) + 2; // 2 to 5 tens
      const extraOnes = Math.floor(Math.random() * 8) + 12; // 12 to 19 ones (forces regrouping)
      const total = (tens * 10) + extraOnes;

      return {
        aiPrompt: `You are an expert Primary 1 math question generator.
        
        MATH CONSTRAINTS:
        - Topic: Place Value Regrouping (Advanced Level)
        - Format: ${type}
        - Clue: "I have ${tens} tens and ${extraOnes} ones."
        - Question: What number am I?
        - Final Answer MUST strictly be: "${total}"
        ${formatInstructions}
        
        CREATIVE INSTRUCTIONS:
        - Present this as a riddle from a character (e.g., a robot, a wizard, or an owl).
        - Do NOT include visuals.
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        {
          "question": "Your creative question...",
          "options": ${type === 'MCQ' ? `["${(tens * 10) + (extraOnes % 10)}", "${tens + extraOnes}", "${total}", "${total + 10}"]` : 'null'},
          "visualItems": [],
          "finalAnswer": "${total}",
          "solution": "${tens} tens is ${tens * 10}. ${tens * 10} + ${extraOnes} ones = ${total}."
        }`,
        visualItems: [],
        metadata: { difficulty, steps: 3, logic: "place_value_regrouping", hideVisual: true }
      };
    }

    // 6. Logic Puzzle Clues
    if (activeVariant === 'advanced_clues') {
      const tensDigit = Math.floor(Math.random() * 4) + 5; // 5 to 8
      const onesDigit = Math.floor(Math.random() * 8) + 1; // 1 to 8
      const total = (tensDigit * 10) + onesDigit;
      
      const lowerBound = (tensDigit * 10);
      const upperBound = (tensDigit * 10) + 10;

      return {
        aiPrompt: `You are an expert Primary 1 math question generator.
        
        MATH CONSTRAINTS:
        - Topic: Number Logic Clues (Advanced Level)
        - Format: ${type}
        - Clue 1: The number is between ${lowerBound} and ${upperBound}.
        - Clue 2: The digit in the ones place is ${onesDigit}.
        - Question: What is the number?
        - Final Answer MUST strictly be: "${total}"
        ${formatInstructions}
        
        CREATIVE INSTRUCTIONS:
        - Present this as a detective mystery or treasure safe code.
        - Do NOT include visuals.
        
        OUTPUT FORMAT (Return ONLY valid JSON):
        {
          "question": "Your creative question...",
          "options": ${type === 'MCQ' ? `["${total - 10}", "${total}", "${total + 1}", "${total + 10}"]` : 'null'},
          "visualItems": [],
          "finalAnswer": "${total}",
          "solution": "The numbers between ${lowerBound} and ${upperBound} start with ${tensDigit} tens. If the ones digit is ${onesDigit}, the number is ${total}."
        }`,
        visualItems: [],
        metadata: { difficulty, steps: 3, logic: "number_clues", hideVisual: true }
      };
    }

    // 7. Extreme Regrouping
    if (activeVariant === 'advanced_extreme_regrouping') {
      const tens = Math.floor(Math.random() * 3) + 1; // 1 to 3
      const ones = Math.floor(Math.random() * 20) + 21; // 21 to 40 ones
      const total = (tens * 10) + ones;
      const optionsArray = type === 'MCQ' ? `["${tens + ones}", "${total - 10}", "${total}", "${total + 10}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Extreme Regrouping\n - Final Answer MUST be: "${total}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "I have ${tens} ten and ${ones} ones. What number am I?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${total}", "solution": "${tens} ten is ${tens * 10}. ${tens * 10} + ${ones} = ${total}." }`,
        metadata: { difficulty, steps: 3, logic: "extreme_regrouping", hideVisual: true }
      };
    }

    // 8. Digit Sum Clues
    if (activeVariant === 'advanced_digit_sum') {
      const tensDigit = Math.floor(Math.random() * 6) + 2; // 2 to 7
      const onesDigit = Math.floor(Math.random() * 4) + 1; // 1 to 4
      const sum = tensDigit + onesDigit;
      const total = (tensDigit * 10) + onesDigit;
      const optionsArray = type === 'MCQ' ? `["${total - 10}", "${(onesDigit * 10) + tensDigit}", "${total}", "${total + 1}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Digit Sum Logic\n - Final Answer MUST be: "${total}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "I am a 2-digit number. My tens digit is ${tensDigit}. The sum of my digits is ${sum}. What number am I?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${total}", "solution": "Since the tens digit is ${tensDigit}, we need a ones digit that makes the sum ${sum}. ${tensDigit} + ${onesDigit} = ${sum}, so the number is ${total}." }`,
        metadata: { difficulty, steps: 3, logic: "digit_sum", hideVisual: true }
      };
    }

    // 9. Digit Difference Clues
    if (activeVariant === 'advanced_digit_difference') {
      const tensDigit = Math.floor(Math.random() * 4) + 3; // 3 to 6
      const diff = Math.floor(Math.random() * 3) + 1; // 1 to 3
      const onesDigit = tensDigit + diff; // Ensures ones > tens and < 10
      const total = (tensDigit * 10) + onesDigit;
      const lowerBound = tensDigit * 10;
      const upperBound = lowerBound + 10;
      const optionsArray = type === 'MCQ' ? `["${total - diff}", "${total}", "${(onesDigit * 10) + tensDigit}", "${total + 10}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Digit Difference Clues\n - Final Answer MUST be: "${total}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "I am a number between ${lowerBound} and ${upperBound}. My ones digit is ${diff} more than my tens digit. What number am I?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${total}", "solution": "The number is in the ${tensDigit}0s, so the tens digit is ${tensDigit}. The ones digit is ${tensDigit} + ${diff} = ${onesDigit}. The number is ${total}." }`,
        metadata: { difficulty, steps: 3, logic: "digit_difference", hideVisual: true }
      };
    }

    // 10. Comparison Puzzle
    if (activeVariant === 'advanced_comparison_puzzle') {
      const tensDigit = Math.floor(Math.random() * 4) + 5; // 5 to 8
      const onesDigit = Math.floor(Math.random() * 3) + 3; // 3 to 5
      const total = (tensDigit * 10) + onesDigit;
      const lower = total - Math.floor(Math.random() * 2) - 1; 
      const upper = total + Math.floor(Math.random() * 3) + 1;
      const optionsArray = type === 'MCQ' ? `["${lower - 1}", "${total - 10}", "${total}", "${upper + 1}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Comparison Bounds\n - Final Answer MUST be: "${total}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "I am greater than ${lower} but smaller than ${upper}. I have a ${onesDigit} in my ones place. What number am I?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${total}", "solution": "The only number between ${lower} and ${upper} ending in ${onesDigit} is ${total}." }`,
        metadata: { difficulty, steps: 3, logic: "comparison_puzzle", hideVisual: true }
      };
    }

    // 11. Word Problem (Boxes and Singles)
    if (activeVariant === 'advanced_word_problem_10s_1s') {
      const boxes = Math.floor(Math.random() * 4) + 2; // 2 to 5 boxes
      const singles = Math.floor(Math.random() * 8) + 11; // 11 to 18 singles
      const total = (boxes * 10) + singles;
      const optionsArray = type === 'MCQ' ? `["${(boxes * 10) + (singles % 10)}", "${boxes + singles}", "${total}", "${total + 10}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Applied Regrouping Word Problem\n - Final Answer MUST be: "${total}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "A shop sells pencils in boxes of 10 and as single pieces. John bought ${boxes} boxes and ${singles} single pencils. How many pencils did he buy altogether?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${total}", "solution": "${boxes} boxes of 10 is ${boxes * 10}. ${boxes * 10} + ${singles} singles = ${total} pencils." }`,
        metadata: { difficulty, steps: 3, logic: "applied_regrouping", hideVisual: true }
      };
    }

    // 12. Value of a Digit
    if (activeVariant === 'advanced_value_of_digit') {
      const tens = Math.floor(Math.random() * 5) + 4; // 4 to 8
      const ones = Math.floor(Math.random() * 8) + 1;
      const total = (tens * 10) + ones;
      const answer = String(tens * 10);
      const optionsArray = type === 'MCQ' ? `["${tens}", "${ones}", "${answer}", "${total}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: True Value of a Digit\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "Look at the number ${total}. What does the digit ${tens} stand for?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "The digit ${tens} is in the tens place, so it stands for ${tens} tens, which is ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "value_of_digit", hideVisual: true }
      };
    }

    // 13. Sequence Logic
    if (activeVariant === 'advanced_sequence_logic') {
      const start = Math.floor(Math.random() * 8) + 2; // 2 to 9
      const jumps = Math.floor(Math.random() * 3) + 3; // 3 to 5
      const total = start + (10 * jumps);
      const optionsArray = type === 'MCQ' ? `["${total - 10}", "${total}", "${total + 1}", "${total + 10}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Multiple Skip Count Logic\n - Final Answer MUST be: "${total}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "Start at ${start}. Count on by 10s ${jumps} times. What number do you land on?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${total}", "solution": "Starting at ${start} and making ${jumps} jumps of 10: ${start + 10}, ${start + 20}... you land on ${total}." }`,
        metadata: { difficulty, steps: 3, logic: "sequence_logic", hideVisual: true }
      };
    }

    // 14. Two-Step Missing Sequence
    if (activeVariant === 'advanced_two_step_sequence') {
      const start = Math.floor(Math.random() * 30) + 10;
      const steps = [2, 5, 10];
      const step = steps[Math.floor(Math.random() * steps.length)];
      const seq = [start, start + step, "___", start + (step * 3), "___"];
      const answer = start + (step * 4);
      const optionsArray = type === 'MCQ' ? `["${answer - step}", "${start + (step * 2)}", "${answer}", "${answer + step}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Deep Sequence Completion\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "Look at this number pattern: ${seq.join(", ")}. What is the SECOND missing number?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "The pattern increases by ${step}. The first missing number is ${start + (step * 2)}. The second missing number is ${start + (step * 3)} + ${step} = ${answer}." }`,
        metadata: { difficulty, steps: 3, logic: "complex_sequence", hideVisual: true }
      };
    }

    throw new Error(`Variant '${variant}' (mapped to '${activeVariant}') not valid for difficulty '${difficulty}'`);
  }
};