/**
 * Blueprint for Primary 1: Number Patterns
 * ENGINE: Generates AI prompt constraints, strictly pre-calculating math logic.
 * ARCHITECTURE: Pre-calculates sequences and distractors to prevent AI hallucinations.
 */

export const numberPatternBlueprint = {
  id: 'p1-number-pattern',
  title: 'Number Patterns',
  strand: 'Number and Algebra',
  visualType: 'NUMBER_PATTERN',

  // 1. OVERARCHING CONDITIONS
  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      maxNumber: 100,
      logicDescription: "Find the next number in simple +1 or -1 sequences."
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      maxNumber: 100,
      logicDescription: "Find missing middle numbers in +2, -2, +5, and +10 sequences."
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 3,
      maxNumber: 100,
      logicDescription: "Find the starting number (working backwards) in skip-counting patterns."
    }
  },

  // 2. STRICT VARIANTS
  variants: {
    foundation_forward_1: "Find the next number in a +1 pattern.",
    foundation_backward_1: "Find the next number in a -1 pattern.",
    foundation_missing_middle_1: "Find the missing middle number in a +1 pattern.",
    foundation_missing_middle_back_1: "Find the missing middle number in a -1 pattern.",
    foundation_missing_start_1: "Find the missing starting number in a +1 pattern.",
    standard_forward_2: "Find the missing middle number in a +2 pattern.",
    standard_backward_2: "Find the missing middle number in a -2 pattern.",
    standard_forward_5: "Find the missing second number in a +5 pattern.",
    standard_forward_10: "Find the missing middle number in a +10 pattern.",
    standard_missing_last_2: "Find the missing last number in a +2 pattern.",
    standard_missing_last_back_2: "Find the missing last number in a -2 pattern.",
    standard_missing_last_5: "Find the missing last number in a +5 pattern.",
    standard_missing_last_10: "Find the missing last number in a +10 pattern.",
    standard_missing_start_2: "Find the missing starting number in a +2 pattern.",
    standard_missing_start_5: "Find the missing starting number in a +5 pattern.",
    advanced_missing_start_asc: "Find the missing first number in an ascending skip-counting pattern.",
    advanced_missing_start_desc: "Find the missing first number in a descending skip-counting pattern.",
    advanced_missing_second_asc: "Find the missing second number by determining the rule from the end of an ascending sequence.",
    advanced_missing_second_desc: "Find the missing second number by determining the rule from the end of a descending sequence.",
    advanced_missing_fourth_desc: "Find the missing fourth number in a descending skip-counting pattern.",
    advanced_alt_plus_minus: "Find a missing number in a two-step alternating pattern (+3, -1).",
    advanced_alt_plus_plus: "Find a missing middle number in a dual-jump alternating pattern (+10, +2).",
    advanced_alt_missing_start: "Work backwards to find the first number in an alternating pattern (+5, -2)."
  },

  // 3. GENERATION ENGINE
  generate: (difficulty = 'foundation', variant = 'foundation_forward_1', type = 'MCQ') => {
    
    // --- BULLETPROOF AUTO-RANDOMIZER ---
    const safeType = String(type).toLowerCase();
    const isShort = safeType.includes('short');
    const isStructure = safeType.includes('structure') || safeType.includes('structured');
    const isMCQ = safeType.includes('mcq');

    let activeVariant = variant;
    if (!numberPatternBlueprint.variants[variant]) {
      const safeDiff = String(difficulty).toLowerCase();
      let validVariants = Object.keys(numberPatternBlueprint.variants).filter(k => k.startsWith(safeDiff));
      
      if (isShort) {
        validVariants = validVariants.filter(k => !k.includes('word_problem') && !k.includes('interactive'));
      } else if (isStructure) {
        validVariants = validVariants.filter(k => k.includes('word_problem') || k.includes('interactive'));
      }

      if (validVariants.length > 0) {
        activeVariant = validVariants[Math.floor(Math.random() * validVariants.length)];
      } else {
        activeVariant = 'foundation_forward_1'; 
      }
    }

    const formatInstructions = type === 'MCQ' 
      ? `Format as MCQ. Include an "options" array with 4 choices. "finalAnswer" must exactly match one of the options.` 
      : `Format as Short Answer. The "options" field in your JSON should be null.`;

    const hideVis = isShort && !activeVariant.includes('interactive');

    // ==========================================
    // FOUNDATION LEVEL
    // ==========================================

    if (activeVariant === 'foundation_forward_1') {
      const start = Math.floor(Math.random() * 80) + 10;
      const sequence = [start, start + 1, start + 2, start + 3];
      const answer = String(start + 4);
      
      const optionsArray = type === 'MCQ' ? `["${start + 3}", "${answer}", "${start + 5}", "${start + 14}"]` : 'null';
      const itemsArray = JSON.stringify([String(sequence[0]), String(sequence[1]), String(sequence[2]), String(sequence[3]), "?"]);

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: +1 Number Pattern\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE FREEDOM:\n - Vary the question text\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "...", "options": ${optionsArray}, "visualItems": ${itemsArray}, "modelData": { "type": "NUMBER_PATTERN", "rule": "+1", "items": ${itemsArray}, "hideVisual": ${hideVis} }, "finalAnswer": "${answer}", "solution": "The pattern is counting on by 1. ${sequence[3]} + 1 = ${answer}." }`,
        metadata: { difficulty, steps: 1, logic: "forward_1", hideVisual: hideVis }
      };
    }

    if (activeVariant === 'foundation_backward_1') {
      const start = Math.floor(Math.random() * 80) + 20; // 20 to 99
      const sequence = [start, start - 1, start - 2, start - 3];
      const answer = String(start - 4);
      
      const optionsArray = type === 'MCQ' ? `["${start - 5}", "${answer}", "${start - 3}", "${start - 14}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: -1 Number Pattern\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE FREEDOM:\n - Vary the question text (e.g., "What number comes next in this pattern?", "These numbers are counting back. What is the next number?", "Find the missing next number.")\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "...", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_PATTERN", "rule": "-1", "items": ["${sequence[0]}", "${sequence[1]}", "${sequence[2]}", "${sequence[3]}", "?"] }, "finalAnswer": "${answer}", "solution": "The pattern is counting back by 1. ${sequence[3]} - 1 = ${answer}." }`,
        metadata: { difficulty, steps: 1, logic: "backward_1", hideVisual: false }
      };
    }

    // 3. Missing Middle (+1)
    if (activeVariant === 'foundation_missing_middle_1') {
      const start = Math.floor(Math.random() * 80) + 10;
      const sequence = [start, start + 1, start + 2, start + 3, start + 4];
      const answer = String(sequence[2]);
      
      const optionsArray = type === 'MCQ' ? `["${sequence[2] - 2}", "${sequence[2] + 1}", "${answer}", "${sequence[2] + 2}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: +1 Number Pattern (Missing Middle)\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE FREEDOM:\n - Vary the question text (e.g., "Identify the missing number in the middle.", "What number belongs in the box?", "Complete the pattern.")\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "...", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_PATTERN", "rule": "+1", "items": ["${sequence[0]}", "${sequence[1]}", "?", "${sequence[3]}", "${sequence[4]}"] }, "finalAnswer": "${answer}", "solution": "The pattern is counting on by 1. ${sequence[1]} + 1 = ${answer}." }`,
        metadata: { difficulty, steps: 1, logic: "missing_middle_1", hideVisual: false }
      };
    }

    // 4. Missing Middle (-1)
    if (activeVariant === 'foundation_missing_middle_back_1') {
      const start = Math.floor(Math.random() * 80) + 20; // 20 to 99
      const sequence = [start, start - 1, start - 2, start - 3, start - 4];
      const answer = String(sequence[2]);
      
      const optionsArray = type === 'MCQ' ? `["${sequence[2] + 2}", "${sequence[2] - 1}", "${answer}", "${sequence[2] - 2}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: -1 Number Pattern (Missing Middle)\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE FREEDOM:\n - Vary the question text (e.g., "Which number is missing from this counting back pattern?", "What is the missing middle number?", "Fill in the blank.")\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "...", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_PATTERN", "rule": "-1", "items": ["${sequence[0]}", "${sequence[1]}", "?", "${sequence[3]}", "${sequence[4]}"] }, "finalAnswer": "${answer}", "solution": "The pattern is counting back by 1. ${sequence[1]} - 1 = ${answer}." }`,
        metadata: { difficulty, steps: 1, logic: "missing_middle_back_1", hideVisual: false }
      };
    }

    // 5. Missing Start (+1)
    if (activeVariant === 'foundation_missing_start_1') {
      const start = Math.floor(Math.random() * 80) + 10;
      const sequence = [start, start + 1, start + 2, start + 3];
      const answer = String(start);
      
      const optionsArray = type === 'MCQ' ? `["${start - 1}", "${start + 4}", "${answer}", "${start + 2}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: +1 Number Pattern (Missing Start)\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE FREEDOM:\n - Vary the question text (e.g., "Find the first number in the pattern.", "What number belongs in the box?", "Complete the pattern.")\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "...", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_PATTERN", "rule": "+1", "items": ["?", "${sequence[1]}", "${sequence[2]}", "${sequence[3]}"] }, "finalAnswer": "${answer}", "solution": "The pattern is counting on by 1. To find the first number, we count back by 1. ${sequence[1]} - 1 = ${answer}." }`,
        metadata: { difficulty, steps: 1, logic: "missing_start_1", hideVisual: false }
      };
    }

    // ==========================================
    // STANDARD LEVEL
    // ==========================================

    if (activeVariant === 'standard_forward_2') {
      const start = Math.floor(Math.random() * 70) + 10;
      const sequence = [start, start + 2, start + 4, start + 6, start + 8];
      const answer = String(sequence[2]); // Missing middle
      
      const optionsArray = type === 'MCQ' ? `["${sequence[2] - 1}", "${answer}", "${sequence[2] + 1}", "${sequence[2] + 2}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: +2 Number Pattern\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE FREEDOM:\n - Vary the question text (e.g., "Identify the missing number in the middle.", "What number belongs in the box?", "Complete the pattern.")\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "...", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_PATTERN", "rule": "+2", "items": ["${sequence[0]}", "${sequence[1]}", "?", "${sequence[3]}", "${sequence[4]}"] }, "finalAnswer": "${answer}", "solution": "The pattern is counting on by 2. ${sequence[1]} + 2 = ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "forward_2", hideVisual: false }
      };
    }

    if (activeVariant === 'standard_backward_2') {
      const start = Math.floor(Math.random() * 70) + 20;
      const sequence = [start, start - 2, start - 4, start - 6, start - 8];
      const answer = String(sequence[2]); // Missing middle
      
      const optionsArray = type === 'MCQ' ? `["${sequence[2] + 1}", "${answer}", "${sequence[2] - 1}", "${sequence[2] - 2}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: -2 Number Pattern\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE FREEDOM:\n - Vary the question text (e.g., "Which number is missing from this counting back pattern?", "What is the missing middle number?", "Fill in the blank.")\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "...", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_PATTERN", "rule": "-2", "items": ["${sequence[0]}", "${sequence[1]}", "?", "${sequence[3]}", "${sequence[4]}"] }, "finalAnswer": "${answer}", "solution": "The pattern is counting back by 2. ${sequence[1]} - 2 = ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "backward_2", hideVisual: false }
      };
    }

    if (activeVariant === 'standard_forward_5') {
      const start = (Math.floor(Math.random() * 10) + 2) * 5; // Multiples of 5 (10 to 50)
      const sequence = [start, start + 5, start + 10, start + 15, start + 20];
      const answer = String(sequence[1]); // Missing second
      
      const optionsArray = type === 'MCQ' ? `["${sequence[1] - 1}", "${answer}", "${sequence[1] + 5}", "${sequence[1] + 1}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: +5 Number Pattern\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE FREEDOM:\n - Vary the question text (e.g., "Find the missing number in the skip counting pattern.", "What number belongs in the box?", "Complete the pattern.")\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "...", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_PATTERN", "rule": "+5", "items": ["${sequence[0]}", "?", "${sequence[2]}", "${sequence[3]}", "${sequence[4]}"] }, "finalAnswer": "${answer}", "solution": "The pattern is counting on by 5. ${sequence[0]} + 5 = ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "forward_5", hideVisual: false }
      };
    }

    if (activeVariant === 'standard_forward_10') {
      const start = Math.floor(Math.random() * 50) + 10;
      const sequence = [start, start + 10, start + 20, start + 30, start + 40];
      const answer = String(sequence[2]); // Missing middle
      
      const optionsArray = type === 'MCQ' ? `["${sequence[2] - 10}", "${sequence[2] + 1}", "${answer}", "${sequence[2] + 10}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: +10 Number Pattern\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE FREEDOM:\n - Vary the question text (e.g., "Identify the missing number in the middle.", "What number belongs in the box?", "Complete the pattern.")\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "...", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_PATTERN", "rule": "+10", "items": ["${sequence[0]}", "${sequence[1]}", "?", "${sequence[3]}", "${sequence[4]}"] }, "finalAnswer": "${answer}", "solution": "The pattern is counting on by 10. ${sequence[1]} + 10 = ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "forward_10", hideVisual: false }
      };
    }

    // 5. Missing Last (+2)
    if (activeVariant === 'standard_missing_last_2') {
      const start = Math.floor(Math.random() * 70) + 10;
      const sequence = [start, start + 2, start + 4, start + 6];
      const answer = String(start + 8);
      
      const optionsArray = type === 'MCQ' ? `["${start + 7}", "${start + 10}", "${answer}", "${start + 4}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: +2 Number Pattern (Missing Last)\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE FREEDOM:\n - Vary the question text (e.g., "What number comes next in this pattern?", "Complete the number pattern.", "Find the next number.")\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "...", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_PATTERN", "rule": "+2", "items": ["${sequence[0]}", "${sequence[1]}", "${sequence[2]}", "${sequence[3]}", "?"] }, "finalAnswer": "${answer}", "solution": "The pattern is counting on by 2. ${sequence[3]} + 2 = ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "missing_last_2", hideVisual: false }
      };
    }

    // 6. Missing Last (-2)
    if (activeVariant === 'standard_missing_last_back_2') {
      const start = Math.floor(Math.random() * 70) + 20; // 20 to 89
      const sequence = [start, start - 2, start - 4, start - 6];
      const answer = String(start - 8);
      
      const optionsArray = type === 'MCQ' ? `["${start - 6}", "${answer}", "${start - 10}", "${start - 7}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: -2 Number Pattern (Missing Last)\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE FREEDOM:\n - Vary the question text (e.g., "What number comes next in this pattern?", "These numbers are counting back. What is the next number?", "Find the missing next number.")\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "...", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_PATTERN", "rule": "-2", "items": ["${sequence[0]}", "${sequence[1]}", "${sequence[2]}", "${sequence[3]}", "?"] }, "finalAnswer": "${answer}", "solution": "The pattern is counting back by 2. ${sequence[3]} - 2 = ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "missing_last_back_2", hideVisual: false }
      };
    }

    // 7. Missing Last (+5)
    if (activeVariant === 'standard_missing_last_5') {
      const start = (Math.floor(Math.random() * 10) + 2) * 5; // 10, 15... 50
      const sequence = [start, start + 5, start + 10, start + 15];
      const answer = String(start + 20);
      
      const optionsArray = type === 'MCQ' ? `["${start + 15}", "${answer}", "${start + 25}", "${start + 10}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: +5 Number Pattern (Missing Last)\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE FREEDOM:\n - Vary the question text (e.g., "Find the missing number in the skip counting pattern.", "What number belongs in the box?", "Complete the pattern.")\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "...", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_PATTERN", "rule": "+5", "items": ["${sequence[0]}", "${sequence[1]}", "${sequence[2]}", "${sequence[3]}", "?"] }, "finalAnswer": "${answer}", "solution": "The pattern is counting on by 5. ${sequence[3]} + 5 = ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "missing_last_5", hideVisual: false }
      };
    }

    // 8. Missing Last (+10)
    if (activeVariant === 'standard_missing_last_10') {
      const start = Math.floor(Math.random() * 50) + 10;
      const sequence = [start, start + 10, start + 20, start + 30];
      const answer = String(start + 40);
      
      const optionsArray = type === 'MCQ' ? `["${start + 30}", "${answer}", "${start + 50}", "${start + 45}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: +10 Number Pattern (Missing Last)\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE FREEDOM:\n - Vary the question text (e.g., "Identify the missing number in the middle.", "What number belongs in the box?", "Complete the pattern.")\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "...", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_PATTERN", "rule": "+10", "items": ["${sequence[0]}", "${sequence[1]}", "${sequence[2]}", "${sequence[3]}", "?"] }, "finalAnswer": "${answer}", "solution": "The pattern is counting on by 10. ${sequence[3]} + 10 = ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "missing_last_10", hideVisual: false }
      };
    }

    // 9. Missing Start (+2)
    if (activeVariant === 'standard_missing_start_2') {
      const start = Math.floor(Math.random() * 70) + 10;
      const sequence = [start, start + 2, start + 4, start + 6, start + 8];
      const answer = String(start);
      
      const optionsArray = type === 'MCQ' ? `["${start - 2}", "${start + 10}", "${answer}", "${start + 2}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: +2 Number Pattern (Missing Start)\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE FREEDOM:\n - Vary the question text (e.g., "Find the first number in the pattern.", "What number belongs in the box?", "Complete the pattern.")\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "...", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_PATTERN", "rule": "+2", "items": ["?", "${sequence[1]}", "${sequence[2]}", "${sequence[3]}", "${sequence[4]}"] }, "finalAnswer": "${answer}", "solution": "The pattern is counting on by 2. To find the first number, we count back by 2. ${sequence[1]} - 2 = ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "missing_start_2", hideVisual: false }
      };
    }

    // 10. Missing Start (+5)
    if (activeVariant === 'standard_missing_start_5') {
      const start = (Math.floor(Math.random() * 10) + 2) * 5; 
      const sequence = [start, start + 5, start + 10, start + 15, start + 20];
      const answer = String(start);
      
      const optionsArray = type === 'MCQ' ? `["${start - 5}", "${start + 25}", "${answer}", "${start + 5}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: +5 Number Pattern (Missing Start)\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE FREEDOM:\n - Vary the question text (e.g., "Find the first number in the pattern.", "What number belongs in the box?", "Complete the pattern.")\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "...", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_PATTERN", "rule": "+5", "items": ["?", "${sequence[1]}", "${sequence[2]}", "${sequence[3]}", "${sequence[4]}"] }, "finalAnswer": "${answer}", "solution": "The pattern is counting on by 5. To find the first number, we count back by 5. ${sequence[1]} - 5 = ${answer}." }`,
        metadata: { difficulty, steps: 2, logic: "missing_start_5", hideVisual: false }
      };
    }

    // ==========================================
    // ADVANCED LEVEL
    // ==========================================

    if (activeVariant === 'advanced_missing_start_asc') {
      const steps = [2, 5, 10];
      const step = steps[Math.floor(Math.random() * steps.length)];
      const start = Math.floor(Math.random() * 40) + 20;
      const sequence = [start, start + step, start + 2*step, start + 3*step];
      const answer = String(start);
      
      const optionsArray = type === 'MCQ' ? `["${start - step}", "${answer}", "${start + 1}", "${sequence[3] + step}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Working Backwards (Ascending Pattern)\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE FREEDOM:\n - Vary the question text (e.g., "Find the first number in the pattern.", "What number belongs in the box?", "Complete the pattern.")\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "...", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_PATTERN", "rule": "+${step}", "items": ["?", "${sequence[1]}", "${sequence[2]}", "${sequence[3]}"] }, "finalAnswer": "${answer}", "solution": "To find the first number, we must work backwards. The pattern is increasing by ${step}. Going backwards, we subtract ${step}. ${sequence[1]} - ${step} = ${answer}." }`,
        metadata: { difficulty, steps: 3, logic: "missing_start_asc", hideVisual: false }
      };
    }

    if (activeVariant === 'advanced_missing_start_desc') {
      const steps = [2, 5, 10];
      const step = steps[Math.floor(Math.random() * steps.length)];
      const start = Math.floor(Math.random() * 40) + 50; // 50 to 89
      const sequence = [start, start - step, start - 2*step, start - 3*step];
      const answer = String(start);
      
      const optionsArray = type === 'MCQ' ? `["${start - 1}", "${answer}", "${start + step}", "${sequence[3] - step}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Working Backwards (Descending Pattern)\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE FREEDOM:\n - Vary the question text (e.g., "Find the first number in the pattern.", "What number belongs in the box?", "Complete the pattern.")\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "...", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_PATTERN", "rule": "-${step}", "items": ["?", "${sequence[1]}", "${sequence[2]}", "${sequence[3]}"] }, "finalAnswer": "${answer}", "solution": "To find the first number, we must work backwards. The pattern is decreasing by ${step}. Going backwards, we must add ${step}. ${sequence[1]} + ${step} = ${answer}." }`,
        metadata: { difficulty, steps: 3, logic: "missing_start_desc", hideVisual: false }
      };
    }

    // 3. Missing Second (Ascending)
    if (activeVariant === 'advanced_missing_second_asc') {
      const steps = [2, 5, 10];
      const step = steps[Math.floor(Math.random() * steps.length)];
      const start = Math.floor(Math.random() * 30) + 10;
      const sequence = [start, start + step, start + 2*step, start + 3*step, start + 4*step];
      const answer = String(sequence[1]);
      
      const optionsArray = type === 'MCQ' ? `["${sequence[1] - 1}", "${sequence[1] + step}", "${answer}", "${start - step}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Find Rule from End (Ascending)\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE FREEDOM:\n - Vary the question text (e.g., "Find the missing number in the sequence.", "What number belongs in the box?", "Complete the pattern.")\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "...", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_PATTERN", "rule": "+${step}", "items": ["${sequence[0]}", "?", "${sequence[2]}", "${sequence[3]}", "${sequence[4]}"] }, "finalAnswer": "${answer}", "solution": "First, find the pattern using the numbers at the end. ${sequence[2]} to ${sequence[3]} is increasing by ${step}. So the rule is to count on by ${step}. ${sequence[0]} + ${step} = ${answer}." }`,
        metadata: { difficulty, steps: 3, logic: "missing_second_asc", hideVisual: false }
      };
    }

    // 4. Missing Second (Descending)
    if (activeVariant === 'advanced_missing_second_desc') {
      const steps = [2, 5, 10];
      const step = steps[Math.floor(Math.random() * steps.length)];
      const start = Math.floor(Math.random() * 30) + 50; // 50 to 79
      const sequence = [start, start - step, start - 2*step, start - 3*step, start - 4*step];
      const answer = String(sequence[1]);
      
      const optionsArray = type === 'MCQ' ? `["${sequence[1] + 1}", "${sequence[1] - step}", "${answer}", "${start + step}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Find Rule from End (Descending)\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE FREEDOM:\n - Vary the question text (e.g., "Which number is missing?", "Identify the missing number to complete the pattern.", "Fill in the box.")\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "...", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_PATTERN", "rule": "-${step}", "items": ["${sequence[0]}", "?", "${sequence[2]}", "${sequence[3]}", "${sequence[4]}"] }, "finalAnswer": "${answer}", "solution": "First, find the pattern using the numbers at the end. ${sequence[2]} to ${sequence[3]} is decreasing by ${step}. So the rule is to count back by ${step}. ${sequence[0]} - ${step} = ${answer}." }`,
        metadata: { difficulty, steps: 3, logic: "missing_second_desc", hideVisual: false }
      };
    }

    // 5. Missing Fourth (Descending)
    if (activeVariant === 'advanced_missing_fourth_desc') {
      const steps = [2, 5, 10];
      const step = steps[Math.floor(Math.random() * steps.length)];
      const start = Math.floor(Math.random() * 40) + 50; 
      const sequence = [start, start - step, start - 2*step, start - 3*step, start - 4*step];
      const answer = String(sequence[3]);
      
      const optionsArray = type === 'MCQ' ? `["${sequence[3] - step}", "${sequence[3] + 1}", "${answer}", "${sequence[3] + step}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Descending Skip Counting\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE FREEDOM:\n - Vary the question text (e.g., "Find the missing number.", "What number belongs in the pattern?", "Complete the sequence.")\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "...", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_PATTERN", "rule": "-${step}", "items": ["${sequence[0]}", "${sequence[1]}", "${sequence[2]}", "?", "${sequence[4]}"] }, "finalAnswer": "${answer}", "solution": "The pattern is counting back by ${step}. ${sequence[2]} - ${step} = ${answer}." }`,
        metadata: { difficulty, steps: 3, logic: "missing_fourth_desc", hideVisual: false }
      };
    }

    // 6. Alternating Pattern (+3, -1)
    if (activeVariant === 'advanced_alt_plus_minus') {
      const start = Math.floor(Math.random() * 40) + 10;
      // Pattern: +3, -1, +3, -1
      const sequence = [start, start + 3, start + 2, start + 5, start + 4];
      const answer = String(sequence[3]); // Hide the 4th number
      
      const optionsArray = type === 'MCQ' ? `["${sequence[3] - 1}", "${sequence[3] + 2}", "${answer}", "${sequence[3] - 2}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Alternating Pattern (+3, -1)\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE FREEDOM:\n - Vary the question text (e.g., "Look at the number pattern. It follows a special two-step rule. What is the missing number?", "Complete the alternating pattern.", "Find the missing number in this two-step sequence.")\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "...", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_PATTERN", "rule": "+3, -1", "items": ["${sequence[0]}", "${sequence[1]}", "${sequence[2]}", "?", "${sequence[4]}"] }, "finalAnswer": "${answer}", "solution": "This pattern has two alternating rules. ${sequence[0]} to ${sequence[1]} is +3. ${sequence[1]} to ${sequence[2]} is -1. This (+3, -1) rule repeats. So, ${sequence[2]} + 3 = ${answer}." }`,
        metadata: { difficulty, steps: 3, logic: "alt_plus_minus", hideVisual: false }
      };
    }

    // 7. Alternating Pattern (+10, +2)
    if (activeVariant === 'advanced_alt_plus_plus') {
      const start = Math.floor(Math.random() * 40) + 10;
      // Pattern: +10, +2, +10, +2
      const sequence = [start, start + 10, start + 12, start + 22, start + 24];
      const answer = String(sequence[2]); // Hide the 3rd number
      
      const optionsArray = type === 'MCQ' ? `["${sequence[2] - 2}", "${start + 20}", "${answer}", "${sequence[2] + 10}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Alternating Pattern (+10, +2)\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE FREEDOM:\n - Vary the question text (e.g., "Look at the number pattern. The numbers are jumping by two different amounts. What is the missing number?", "Complete the dual-jump pattern.", "Find the missing number in this alternating sequence.")\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "...", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_PATTERN", "rule": "+10, +2", "items": ["${sequence[0]}", "${sequence[1]}", "?", "${sequence[3]}", "${sequence[4]}"] }, "finalAnswer": "${answer}", "solution": "This pattern alternates between two rules. ${sequence[0]} to ${sequence[1]} is +10. ${sequence[3]} to ${sequence[4]} is +2. The rule is (+10, +2). So, ${sequence[1]} + 2 = ${answer}." }`,
        metadata: { difficulty, steps: 3, logic: "alt_plus_plus", hideVisual: false }
      };
    }

    // 8. Alternating Pattern Missing Start (+5, -2)
    if (activeVariant === 'advanced_alt_missing_start') {
      const start = Math.floor(Math.random() * 40) + 20;
      // Pattern: +5, -2, +5, -2
      const sequence = [start, start + 5, start + 3, start + 8, start + 6];
      const answer = String(sequence[0]); // Hide the 1st number
      
      const optionsArray = type === 'MCQ' ? `["${start + 2}", "${start - 5}", "${answer}", "${start + 5}"]` : 'null';

      return {
        aiPrompt: `You are an expert Primary 1 math generator.\n MATH CONSTRAINTS:\n - Topic: Alternating Pattern (Missing Start)\n - Final Answer MUST be: "${answer}"\n ${formatInstructions}\n CREATIVE FREEDOM:\n - Vary the question text (e.g., "Look at the number pattern. What is the first missing number?", "Work backwards to find the starting number.", "Complete the alternating pattern by finding the first number.")\n OUTPUT FORMAT (Return ONLY valid JSON):\n { "question": "...", "options": ${optionsArray}, "visualItems": [], "modelData": { "type": "NUMBER_PATTERN", "rule": "+5, -2", "items": ["?", "${sequence[1]}", "${sequence[2]}", "${sequence[3]}", "${sequence[4]}"] }, "finalAnswer": "${answer}", "solution": "First, find the repeating rule using the visible numbers: ${sequence[2]} to ${sequence[3]} is +5. ${sequence[3]} to ${sequence[4]} is -2. The rule is (+5, -2). To find the first number, we work backwards from ${sequence[1]} and do the opposite of +5. ${sequence[1]} - 5 = ${answer}." }`,
        metadata: { difficulty, steps: 3, logic: "alt_missing_start", hideVisual: false }
      };
    }

    throw new Error(`Variant '${variant}' not valid for difficulty '${difficulty}'`);
  }
};