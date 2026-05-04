/**
 * Blueprint for Primary 1: Comparing and Ordering
 * ENGINE: Generates AI prompt constraints, strictly pre-calculating math logic.
 * ARCHITECTURE: Pre-calculates sort orders and distractors to prevent AI hallucinations.
 */

export const comparingOrderingBlueprint = {
  id: 'p1-comparing-ordering',
  title: 'Comparing and Ordering',
  strand: 'Number and Algebra', 
  visualType: 'DYNAMIC', // Null avoids triggering untested UI components

  // 1. OVERARCHING CONDITIONS
  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 100,
      logicDescription: "Direct comparison of 2 numbers or identifying the greatest/smallest in a set of 3."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      maxNumber: 100,
      logicDescription: "Ordering sets of 4 numbers ascending/descending, and bounded comparisons."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 3,
      maxNumber: 100,
      logicDescription: "Comparing complex regrouped expressions and forming greatest/smallest numbers from digits."
    }
  },

  // 2. STRICT VARIANTS
  variants: {
    foundation_compare_two: "Identify the greater or smaller of two 2-digit numbers.",
    foundation_greatest_three: "Identify the greatest number from a set of 3.",
    foundation_smallest_three: "Identify the smallest number from a set of 3.",
    foundation_next_number: "Identify the number that comes just after a given number.",
    foundation_before_number: "Identify the number that comes just before a given number.",
    standard_order_asc: "Order 4 numbers from smallest to greatest.",
    standard_order_desc: "Order 4 numbers from greatest to smallest.",
    standard_number_between: "Identify a number that falls between two given bounds.",
    standard_compare_word: "Solve a simple word problem comparing 3 quantities.",
    standard_missing_seq_asc: "Identify a missing number in a +1 ascending sequence.",
    standard_missing_seq_desc: "Identify a missing number in a -1 descending sequence.",
    standard_greatest_four: "Identify the greatest number from a set of 4.",
    standard_smallest_four: "Identify the smallest number from a set of 4.",
    standard_ten_more_compare: "Compare '10 more than X' with another number.",
    standard_ten_less_compare: "Compare '10 less than X' with another number.",
    advanced_compare_expressions: "Compare numbers expressed as regrouped tens and ones.",
    advanced_form_greatest: "Form the greatest 2-digit number using given digits.",
    advanced_relative_logic: "Deduce the order of 3 amounts based on relative 'more than/less than' clues.",
    advanced_sequence_skip_counting: "Identify a missing number in a skip-counting pattern (by 2s, 5s, or 10s).",
    advanced_form_smallest_condition: "Form the smallest 2-digit number from given digits that is greater than a specific value.",
    advanced_swapped_digits_difference: "Find the difference between a number and the number formed by swapping its digits.",
    advanced_logic_puzzle_order: "Order 3 characters based on relative abstract clues (e.g., A is less than B).",
    advanced_mystery_number_clues: "Deduce a mystery number using bounds and the sum of its digits.",
    advanced_extreme_inequality: "Identify the greatest number that is smaller than a complex regrouped expression."
  },

  // 3. GENERATION ENGINE
  generate: (difficulty = 'foundation', variant = 'foundation_compare_two', type = 'MCQ') => {
    
    // --- LEGACY ADAPTER & AUTO-RANDOMIZER ---
    let activeVariant = variant;
    if (!comparingOrderingBlueprint.variants[variant]) {
      const validVariants = Object.keys(comparingOrderingBlueprint.variants).filter(k => k.startsWith(String(difficulty).toLowerCase()));
      if (validVariants.length > 0) {
        activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
      } else {
        activeVariant = 'foundation_compare_two'; 
      }
    }

    const formatInstructions = type === 'MCQ' 
      ? `Format as MCQ. Include an "options" array with 4 choices. "finalAnswer" must exactly match one of the options.` 
      : `Format as Short Answer. The "options" field in your JSON should be null.`;

    // ==========================================
    // FOUNDATION LEVEL
    // ==========================================

    if (activeVariant === 'foundation_compare_two') {
      const num1 = Math.floor(Math.random() * 80) + 10;
      let num2;
      do { num2 = Math.floor(Math.random() * 80) + 10; } while (num1 === num2);
      
      const askGreater = Math.random() > 0.5;
      const answer = askGreater ? String(Math.max(num1, num2)) : String(Math.min(num1, num2));
      const targetWord = askGreater ? "greater" : "smaller";
      const optionsArray = type === 'MCQ' ? `["${num1}", "${num2}", "${Math.max(num1, num2) + 10}", "${Math.min(num1, num2) - 5}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Compare 2 Numbers\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "Look at the number cards. Which number is ${targetWord}?", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_CARDS", "items": ["${num1}", "${num2}"] }, "finalAnswer": "${answer}", "solution": "Comparing the tens and ones, ${answer} is the ${targetWord} number." }`,
        metadata: { difficulty, steps: 1, logic: "compare_two", hideVisual: false }
      };
    }

    if (activeVariant === 'foundation_greatest_three' || activeVariant === 'foundation_smallest_three') {
      const askGreatest = activeVariant === 'foundation_greatest_three';
      const nums = [];
      while(nums.length < 3) {
        const n = Math.floor(Math.random() * 80) + 10;
        if (!nums.includes(n)) nums.push(n);
      }
      
      const targetWord = askGreatest ? "greatest" : "smallest";
      const answer = String(askGreatest ? Math.max(...nums) : Math.min(...nums));
      
      // Fix: Generate a safe distractor that doesn't break the logic!
      let distractor;
      do { 
         distractor = Math.floor(Math.random() * 80) + 10; 
      } while (nums.includes(distractor) || (askGreatest && distractor > Math.max(...nums)) || (!askGreatest && distractor < Math.min(...nums)));

      const optionsArray = type === 'MCQ' ? `["${nums[0]}", "${nums[1]}", "${nums[2]}", "${distractor}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Identify ${targetWord}\n - Numbers: ${nums.join(', ')}\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "Look at the number cards. Which is the ${targetWord} number?", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_CARDS", "items": ["${nums[0]}", "${nums[1]}", "${nums[2]}"] }, "finalAnswer": "${answer}", "solution": "Looking at the numbers ${nums.join(', ')}, the ${targetWord} one is ${answer}." }`,
        metadata: { difficulty, steps: 1, logic: askGreatest ? "greatest_3" : "smallest_3", hideVisual: false }
      };
    }

    // 4. Next Number (Just After)
    if (activeVariant === 'foundation_next_number') {
      const num = Math.floor(Math.random() * 88) + 10; // 10 to 97
      const answer = String(num + 1);
      const optionsArray = type === 'MCQ' ? `["${num - 1}", "${answer}", "${num + 10}", "${num}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Number Sequence (After)\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "Look at the number cards. What number comes just after ${num}?", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_CARDS", "items": ["${num}", "?"] }, "finalAnswer": "${answer}", "solution": "The number that comes right after ${num} when counting is ${answer}." }`,
        metadata: { difficulty, steps: 1, logic: "next_number", hideVisual: false }
      };
    }

    // 5. Before Number (Just Before)
    if (activeVariant === 'foundation_before_number') {
      const num = Math.floor(Math.random() * 88) + 11; // 11 to 98
      const answer = String(num - 1);
      const optionsArray = type === 'MCQ' ? `["${num + 1}", "${answer}", "${num - 10}", "${num}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Number Sequence (Before)\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "Look at the number cards. What number comes just before ${num}?", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_CARDS", "items": ["?", "${num}"] }, "finalAnswer": "${answer}", "solution": "The number that comes right before ${num} when counting is ${answer}." }`,
        metadata: { difficulty, steps: 1, logic: "before_number", hideVisual: false }
      };
    }

    // ==========================================
    // STANDARD LEVEL
    // ==========================================

    if (activeVariant === 'standard_order_asc' || activeVariant === 'standard_order_desc') {
      const askAsc = activeVariant === 'standard_order_asc';
      const nums = [];
      while(nums.length < 4) {
        const n = Math.floor(Math.random() * 80) + 10;
        if (!nums.includes(n)) nums.push(n);
      }
      
      const sortedNums = [...nums].sort((a, b) => askAsc ? a - b : b - a);
      const answer = sortedNums.join(', ');
      
      // Generate safe distractors (wrong sorting orders)
      const distractor1 = [...nums].sort((a, b) => (!askAsc) ? a - b : b - a).join(', '); // Complete reverse
      const distractor2 = [sortedNums[0], sortedNums[2], sortedNums[1], sortedNums[3]].join(', '); // Middle swap
      const distractor3 = [sortedNums[1], sortedNums[0], sortedNums[2], sortedNums[3]].join(', '); // First swap
      
      const targetWord = askAsc ? "smallest to greatest" : "greatest to smallest";
      const optionsArray = type === 'MCQ' ? `["${answer}", "${distractor1}", "${distractor2}", "${distractor3}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Ordering Numbers\n - Numbers: ${nums.join(', ')}\n - Final Answer MUST be exactly: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "Arrange these number cards from ${targetWord}:", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_CARDS", "items": ["${nums[0]}", "${nums[1]}", "${nums[2]}", "${nums[3]}"] }, "finalAnswer": "${answer}", "solution": "Comparing the tens and ones, the correct order from ${targetWord} is ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: askAsc ? "order_asc" : "order_desc", hideVisual: false }
      };
    }

    if (activeVariant === 'standard_number_between') {
      const lower = Math.floor(Math.random() * 40) + 20; // 20 to 59
      const upper = lower + 10; 
      const answerNum = lower + Math.floor(Math.random() * 8) + 1; // Between bounds
      const answer = String(answerNum);
      
      const d1 = lower - Math.floor(Math.random() * 5) - 1; // Too small
      const d2 = upper + Math.floor(Math.random() * 5) + 1; // Too big
      const d3 = upper + Math.floor(Math.random() * 10) + 6; // Way too big
      const optionsArray = type === 'MCQ' ? `["${d1}", "${answer}", "${d2}", "${d3}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Number Bounds\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "Look at the number cards. Which number can replace the question mark so that the numbers are in order from smallest to greatest?", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_CARDS", "items": ["${lower}", "?", "${upper}"] }, "finalAnswer": "${answer}", "solution": "${answer} is the only option that is larger than ${lower} and less than ${upper}." }`,
        metadata: { difficulty, steps: 2, logic: "number_between", hideVisual: false }
      };
    }

    if (activeVariant === 'standard_compare_word') {
      const amounts = [];
      while(amounts.length < 3) {
        const n = Math.floor(Math.random() * 40) + 20;
        if (!amounts.includes(n)) amounts.push(n);
      }
      const askGreatest = Math.random() > 0.5;
      const targetWord = askGreatest ? "most" : "least";
      const answer = String(askGreatest ? Math.max(...amounts) : Math.min(...amounts));
      const distractor = askGreatest ? Math.max(...amounts) + 5 : Math.min(...amounts) - 5;
      const optionsArray = type === 'MCQ' ? `["${amounts[0]}", "${amounts[1]}", "${amounts[2]}", "${distractor}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Compare Word Problem\n - Amounts: ${amounts.join(', ')}\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Choose a theme (e.g., balloons, apples, stars).\n - Do NOT put emojis in the question text.\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "Look at the groups of [theme] below. Which group has the ${targetWord} [theme]?", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "COMPARE_OBJECTS", "sets": [ { "label": "A", "count": ${amounts[0]}, "icon": "🎈" }, { "label": "B", "count": ${amounts[1]}, "icon": "🎈" }, { "label": "C", "count": ${amounts[2]}, "icon": "🎈" } ] }, "finalAnswer": "${answer}", "solution": "Comparing the amounts, the ${targetWord} amount is ${answer}." }`,
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Compare Word Problem\n - Amounts: ${amounts.join(', ')}\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n - Do NOT put emojis in the question text.\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "COMPARE_OBJECTS", "sets": [ { "label": "A", "count": ${amounts[0]}, "icon": "🎈" }, { "label": "B", "count": ${amounts[1]}, "icon": "🎈" }, { "label": "C", "count": ${amounts[2]}, "icon": "🎈" } ] }, "finalAnswer": "${answer}", "solution": "Comparing the amounts, the ${targetWord} amount is ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "compare_word", hideVisual: false }
      };
    }

    // 7. Missing Sequence Ascending
    if (activeVariant === 'standard_missing_seq_asc') {
      const start = Math.floor(Math.random() * 70) + 10;
      const sequence = [start, start + 1, start + 2, start + 3];
      const missingIdx = Math.floor(Math.random() * 2) + 1; // Pick index 1 or 2
      const answer = String(sequence[missingIdx]);
      const displaySeq = [...sequence];
      displaySeq[missingIdx] = "?";
      
      const optionsArray = type === 'MCQ' ? `["${sequence[missingIdx]-1}", "${answer}", "${sequence[missingIdx]+1}", "${start + 10}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Missing Number (Ascending)\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "Look at the number cards. What is the missing number in the pattern?", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_CARDS", "items": ["${displaySeq[0]}", "${displaySeq[1]}", "${displaySeq[2]}", "${displaySeq[3]}"] }, "finalAnswer": "${answer}", "solution": "The numbers are increasing by 1. After ${sequence[missingIdx-1]} comes ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "missing_seq_asc", hideVisual: false }
      };
    }

    // 8. Missing Sequence Descending
    if (activeVariant === 'standard_missing_seq_desc') {
      const start = Math.floor(Math.random() * 70) + 20;
      const sequence = [start, start - 1, start - 2, start - 3];
      const missingIdx = Math.floor(Math.random() * 2) + 1;
      const answer = String(sequence[missingIdx]);
      const displaySeq = [...sequence];
      displaySeq[missingIdx] = "?";
      
      const optionsArray = type === 'MCQ' ? `["${sequence[missingIdx]+1}", "${answer}", "${sequence[missingIdx]-1}", "${start - 10}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Missing Number (Descending)\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "Look at the number cards. What is the missing number in the pattern?", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_CARDS", "items": ["${displaySeq[0]}", "${displaySeq[1]}", "${displaySeq[2]}", "${displaySeq[3]}"] }, "finalAnswer": "${answer}", "solution": "The numbers are decreasing by 1. Before ${sequence[missingIdx-1]} comes ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "missing_seq_desc", hideVisual: false }
      };
    }

    // 9. Greatest of Four
    if (activeVariant === 'standard_greatest_four') {
      const nums = [];
      while(nums.length < 4) {
        const n = Math.floor(Math.random() * 80) + 10;
        if (!nums.includes(n)) nums.push(n);
      }
      const answer = String(Math.max(...nums));
      const optionsArray = type === 'MCQ' ? `["${nums[0]}", "${nums[1]}", "${nums[2]}", "${nums[3]}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Greatest of Four\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "Which is the greatest number among the cards?", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_CARDS", "items": ["${nums[0]}", "${nums[1]}", "${nums[2]}", "${nums[3]}"] }, "finalAnswer": "${answer}", "solution": "Comparing all four numbers, ${answer} has the highest value." }`,
        metadata: { difficulty, steps: 1, logic: "greatest_4", hideVisual: false }
      };
    }

    // 10. Smallest of Four
    if (activeVariant === 'standard_smallest_four') {
      const nums = [];
      while(nums.length < 4) {
        const n = Math.floor(Math.random() * 80) + 10;
        if (!nums.includes(n)) nums.push(n);
      }
      const answer = String(Math.min(...nums));
      const optionsArray = type === 'MCQ' ? `["${nums[0]}", "${nums[1]}", "${nums[2]}", "${nums[3]}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Smallest of Four\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "Which is the smallest number among the cards?", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_CARDS", "items": ["${nums[0]}", "${nums[1]}", "${nums[2]}", "${nums[3]}"] }, "finalAnswer": "${answer}", "solution": "Comparing all four numbers, ${answer} has the lowest value." }`,
        metadata: { difficulty, steps: 1, logic: "smallest_4", hideVisual: false }
      };
    }

    // 11. Ten More Compare
    if (activeVariant === 'standard_ten_more_compare') {
      const base = Math.floor(Math.random() * 50) + 10;
      const compareVal = base + (Math.random() > 0.5 ? 12 : 8);
      const tenMore = base + 10;
      const askGreater = Math.random() > 0.5;
      const answer = askGreater ? String(Math.max(tenMore, compareVal)) : String(Math.min(tenMore, compareVal));
      const targetWord = askGreater ? "greater" : "smaller";
      
      const optionsArray = type === 'MCQ' ? `["${tenMore}", "${compareVal}", "${base}", "${tenMore + 5}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: 10 More Comparison\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "Which is ${targetWord}: 10 more than ${base} or ${compareVal}?", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_CARDS", "items": ["10 more than ${base}", "${compareVal}"] }, "finalAnswer": "${answer}", "solution": "10 more than ${base} is ${tenMore}. Comparing ${tenMore} and ${compareVal}, the ${targetWord} is ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "ten_more_compare", hideVisual: false }
      };
    }

    // 12. Ten Less Compare
    if (activeVariant === 'standard_ten_less_compare') {
      const base = Math.floor(Math.random() * 50) + 20;
      const compareVal = base - (Math.random() > 0.5 ? 12 : 8);
      const tenLess = base - 10;
      const askGreater = Math.random() > 0.5;
      const answer = askGreater ? String(Math.max(tenLess, compareVal)) : String(Math.min(tenLess, compareVal));
      const targetWord = askGreater ? "greater" : "smaller";
      
      const optionsArray = type === 'MCQ' ? `["${tenLess}", "${compareVal}", "${base}", "${tenLess - 5}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: 10 Less Comparison\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "Which is ${targetWord}: 10 less than ${base} or ${compareVal}?", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_CARDS", "items": ["10 less than ${base}", "${compareVal}"] }, "finalAnswer": "${answer}", "solution": "10 less than ${base} is ${tenLess}. Comparing ${tenLess} and ${compareVal}, the ${targetWord} is ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "ten_less_compare", hideVisual: false }
      };
    }

    // ==========================================
    // ADVANCED LEVEL
    // ==========================================

    if (activeVariant === 'advanced_compare_expressions') {
      // Expression 1: Regrouped
      const t1 = Math.floor(Math.random() * 3) + 2; // 2 to 4
      const o1 = Math.floor(Math.random() * 8) + 12; // 12 to 19
      const num1 = (t1 * 10) + o1;
      
      // Expression 2: Standard
      const num2 = num1 + (Math.random() > 0.5 ? 2 : -2);
      
      const askGreatest = Math.random() > 0.5;
      const targetWord = askGreatest ? "greatest" : "smallest";
      const answer = String(askGreatest ? Math.max(num1, num2) : Math.min(num1, num2));
      
      const optionsArray = type === 'MCQ' ? `["${num1}", "${num2}", "${num1 + 10}", "${num2 - 10}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Compare Expressions\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "Look at the number cards. Which is ${targetWord}?", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_CARDS", "items": ["${t1} tens ${o1} ones", "${num2}"] }, "finalAnswer": "${answer}", "solution": "${t1} tens and ${o1} ones is ${num1}. Comparing ${num1} and ${num2}, the ${targetWord} is ${answer}." }`,
        metadata: { difficulty, steps: 3, logic: "compare_expressions", hideVisual: false }
      };
    }

    if (activeVariant === 'advanced_form_greatest') {
      const digits = [];
      while(digits.length < 3) {
        const d = Math.floor(Math.random() * 8) + 2; // 2 to 9
        if (!digits.includes(d)) digits.push(d);
      }
      const sortedDigits = [...digits].sort((a, b) => b - a); // Descending
      const greatestNum = (sortedDigits[0] * 10) + sortedDigits[1];
      const answer = String(greatestNum);
      
      const d1 = (sortedDigits[1] * 10) + sortedDigits[0];
      const d2 = (sortedDigits[0] * 10) + sortedDigits[2];
      const d3 = (sortedDigits[2] * 10) + sortedDigits[1];
      const optionsArray = type === 'MCQ' ? `["${d1}", "${answer}", "${d2}", "${d3}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Form Greatest Number\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "Use the digits on the number cards to form the greatest 2-digit number. You can only use each digit once. What is the number?", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_CARDS", "items": ["${sortedDigits[0]}", "${sortedDigits[1]}", "${sortedDigits[2]}"] }, "finalAnswer": "${answer}", "solution": "To make the greatest number, put the largest digit (${sortedDigits[0]}) in the tens place and the next largest (${sortedDigits[1]}) in the ones place. The number is ${answer}." }`,
        metadata: { difficulty, steps: 3, logic: "form_greatest", hideVisual: false }
      };
    }

    if (activeVariant === 'advanced_relative_logic') {
      const amounts = [30, 45, 60];
      // Randomize assignment to A, B, C
      const shuffled = amounts.sort(() => Math.random() - 0.5);
      const answer = `60, 45, 30`;
      
      const optionsArray = type === 'MCQ' ? `["30, 45, 60", "45, 30, 60", "60, 45, 30", "60, 30, 45"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Relative Logic Ordering\n - Final Answer MUST be exactly: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n - Use the 3 characters and their amounts: ${shuffled[0]}, ${shuffled[1]}, ${shuffled[2]}.\n - State the amounts out of order as clues.\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "The amounts are ${shuffled.join(', ')}. From greatest to smallest, the order is ${answer}." }`,
        metadata: { difficulty, steps: 3, logic: "relative_order", hideVisual: true }
      };
    }

    // 4. Sequence Skip Counting
    if (activeVariant === 'advanced_sequence_skip_counting') {
      const steps = [2, 5, 10];
      const step = steps[Math.floor(Math.random() * steps.length)];
      const start = Math.floor(Math.random() * 40) + 10;
      const sequence = [start, start + step, start + 2*step, start + 3*step];
      const missingIdx = Math.floor(Math.random() * 2) + 1; // Hide index 1 or 2
      const answer = String(sequence[missingIdx]);
      const displaySeq = [...sequence];
      displaySeq[missingIdx] = "?";
      
      const optionsArray = type === 'MCQ' ? `["${sequence[missingIdx] - step}", "${answer}", "${sequence[missingIdx] + step}", "${sequence[missingIdx] + 1}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Skip Counting Pattern\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "Look at the number cards. The numbers follow a pattern. What is the missing number?", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_CARDS", "items": ["${displaySeq[0]}", "${displaySeq[1]}", "${displaySeq[2]}", "${displaySeq[3]}"] }, "finalAnswer": "${answer}", "solution": "The numbers are increasing by ${step} each time. So, ${sequence[missingIdx-1]} + ${step} = ${answer}." }`,
        metadata: { difficulty, steps: 3, logic: "sequence_skip", hideVisual: false }
      };
    }

    // 5. Form Smallest with Condition
    if (activeVariant === 'advanced_form_smallest_condition') {
      const digits = [];
      while(digits.length < 3) {
        const d = Math.floor(Math.random() * 8) + 2; 
        if (!digits.includes(d)) digits.push(d);
      }
      digits.sort((a,b) => a - b); // Ascending: [small, med, large]
      const threshold = (digits[1] * 10); // Threshold based on middle digit
      const answerNum = (digits[1] * 10) + digits[0];
      const answer = String(answerNum);
      
      const d1 = (digits[0] * 10) + digits[1]; // Smaller but doesn't meet condition
      const d2 = (digits[1] * 10) + digits[2]; // Meets condition but not smallest
      const d3 = (digits[2] * 10) + digits[0]; 
      
      const optionsArray = type === 'MCQ' ? `["${d1}", "${answer}", "${d2}", "${d3}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Form Number with Condition\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "Use the digits on the cards to form the smallest 2-digit number that is GREATER than ${threshold}. You can only use each digit once. What is the number?", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_CARDS", "items": ["${digits[0]}", "${digits[1]}", "${digits[2]}"] }, "finalAnswer": "${answer}", "solution": "To make a number greater than ${threshold}, the tens digit must be ${digits[1]} or ${digits[2]}. To make it the smallest possible, we choose ${digits[1]} for the tens and the smallest remaining digit (${digits[0]}) for the ones. The answer is ${answer}." }`,
        metadata: { difficulty, steps: 3, logic: "form_smallest_cond", hideVisual: false }
      };
    }

    // 6. Swapped Digits Difference
    if (activeVariant === 'advanced_swapped_digits_difference') {
      const tens = Math.floor(Math.random() * 4) + 5; // 5 to 8
      const ones = Math.floor(Math.random() * 3) + 1; // 1 to 3
      const num1 = (tens * 10) + ones;
      const num2 = (ones * 10) + tens;
      const diff = num1 - num2;
      const answer = String(diff);
      
      const optionsArray = type === 'MCQ' ? `["${diff - 9}", "${answer}", "${diff + 9}", "${num1 + num2}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Swapped Digits Difference\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "I have the number ${num1}. I form a new number by swapping its tens and ones digits. What is the difference between the original number and the new number?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "The original number is ${num1}. Swapping the digits gives ${num2}. The difference is ${num1} - ${num2} = ${answer}." }`,
        metadata: { difficulty, steps: 3, logic: "swapped_diff", hideVisual: true }
      };
    }

    // 7. Logic Puzzle Order
    if (activeVariant === 'advanced_logic_puzzle_order') {
      const optionsArray = type === 'MCQ' ? `["A, B, C", "C, B, A", "B, A, C", "B, C, A"]` : 'null';
      const answer = "C, B, A";

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Logic Puzzle Ordering\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE INSTRUCTIONS:\n - Generate a Singapore-themed word problem. Use local names (e.g., Siti, Muthu, Wei Ling, Ahmad), local food/items (e.g., curry puffs, ang baos, satay, saga seeds), and local settings (e.g., hawker centre, HDB void deck, MRT station).\n - Create a story with 3 characters.\n - Clue 1: Character 2 has fewer items than Character 3.\n - Clue 2: Character 1 has fewer items than Character 2.\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "[Insert full localized Singaporean word problem here]", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "Step-by-step logic puzzle ordering explanation." }`,
        metadata: { difficulty, steps: 3, logic: "logic_puzzle_order", hideVisual: true }
      };
    }

    // 8. Mystery Number Clues
    if (activeVariant === 'advanced_mystery_number_clues') {
      const tens = Math.floor(Math.random() * 4) + 3; // 3 to 6
      const diff = Math.floor(Math.random() * 3) + 2; // 2 to 4
      const ones = tens + diff; 
      const total = (tens * 10) + ones;
      const lower = tens * 10;
      const upper = lower + 10;
      const sum = tens + ones;
      const answer = String(total);
      
      const optionsArray = type === 'MCQ' ? `["${(ones * 10) + tens}", "${total - 10}", "${answer}", "${lower + sum}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Mystery Number Clues\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "I am a number between ${lower} and ${upper}. The sum of my digits is ${sum}. What number am I?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "A number between ${lower} and ${upper} must have ${tens} in the tens place. Since the sum of the digits is ${sum}, the ones digit is ${sum} - ${tens} = ${ones}. The number is ${answer}." }`,
        metadata: { difficulty, steps: 3, logic: "mystery_clues", hideVisual: true }
      };
    }

    // 9. Extreme Inequality
    if (activeVariant === 'advanced_extreme_inequality') {
      const targetTens = Math.floor(Math.random() * 3) + 2; // 2 to 4
      const targetOnes = Math.floor(Math.random() * 8) + 12; // 12 to 19 (regrouped)
      const targetValue = (targetTens * 10) + targetOnes;
      const answer = String(targetValue - 1); 
      
      const optionsArray = type === 'MCQ' ? `["${targetValue - 10}", "${answer}", "${targetValue + 1}", "${targetValue}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Inequality with Regrouping\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "What is the GREATEST 2-digit number that is smaller than ${targetTens} tens and ${targetOnes} ones?", "options": ${optionsArray}, "visualItems": [], "finalAnswer": "${answer}", "solution": "${targetTens} tens and ${targetOnes} ones is equal to ${targetValue}. The greatest number smaller than ${targetValue} is ${answer}." }`,
        metadata: { difficulty, steps: 3, logic: "extreme_inequality", hideVisual: true }
      };
    }

    throw new Error(`Variant '${variant}' not valid for difficulty '${difficulty}'`);
  }
};