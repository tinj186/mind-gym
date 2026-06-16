import { numberToWords } from '@/lib/utils/math-helpers';

export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon) {
  const commonMeta = { level, topic, type: zodType, difficulty: zodDiff };
  const inputType = isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT';

  // 1. GROWING PATTERN (Step-up Logic)
  if (activeVariant === 'advanced_growing_pattern') {
    const initialJump = Math.floor(Math.random() * 5) + 1; // 1 to 5
    const growth = Math.floor(Math.random() * 5) + 1; // 1 to 5
    const totalAdded = 4 * initialJump + 6 * growth; 
    const start = Math.floor(Math.random() * (101 - totalAdded));
    const sequence = [
      start,
      start + initialJump,
      start + initialJump + (initialJump + growth),
      start + initialJump + (initialJump + growth) + (initialJump + 2 * growth),
      start + initialJump + (initialJump + growth) + (initialJump + 2 * growth) + (initialJump + 3 * growth)
    ];
    const answer = String(sequence[4]);

    let defectMap = null;
    let options = null;
    if (isMCQ) {
      options = [answer, String(sequence[4] + growth), String(sequence[4] - initialJump), String(sequence[4] + 1)].sort(() => Math.random() - 0.5);
      defectMap = {
        [String(sequence[4] + growth)]: "CONCEPTUAL_ERROR",
        [String(sequence[4] - initialJump)]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions} 
      STRICT: Generate a short (2-sentence maximum), varied Singaporean math story context for the "questionText". Use themes of things getting larger, spreading further apart, or jumping higher (e.g., hopping on numbered lily pads, arranging queue tickets, stacking numbered blocks, or reading pages). End the story by asking the student to figure out the missing number. Do NOT mention the numbers or jump logic.

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": "[Generate the full 1-2 sentence story problem here asking for the missing number]",
          "options": ${isMCQ ? JSON.stringify(options) : 'null'},
          "defectMap": ${defectMap ? JSON.stringify(defectMap) : 'null'},
          "hint": "The jumps between numbers are getting larger each time.",
          "finalAnswer": "${answer}",
          "solutionSteps": "1. The first jump is +${initialJump}.\\n2. The next jump is +${initialJump + growth}.\\n3. The next jump is +${initialJump + 2 * growth}.\\n4. The last jump should be +${initialJump + 3 * growth}. So, ${sequence[3]} + ${initialJump + 3 * growth} = ${answer}."
        },
        "visualEngine": {
          "componentToRender": "NUMBER_PATTERN",
          "componentData": { "rule": "Growing Pattern", "sequence": ${JSON.stringify([String(sequence[0]), String(sequence[1]), String(sequence[2]), String(sequence[3]), "?"])} }
        },
        "inputRequirement": { "inputType": "${inputType}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "growing_step", hideVisual: false }
    };
  }

  // 3. INTERLEAVED SERIES (Two patterns in one)
  if (activeVariant === 'advanced_interleaved_series') {
    const startA = Math.floor(Math.random() * 30) + 10;
    const startB = Math.floor(Math.random() * 10) + 2;
    const stepA = Math.floor(Math.random() * 10) + 5; // 5 to 14
    const stepB = Math.floor(Math.random() * 5) + 2; // 2 to 6
    const sequence = [startA, startB, startA + stepA, startB + stepB, startA + 2 * stepA, startB + 2 * stepB];
    
    const missingIdx = Math.random() > 0.5 ? 4 : 5;
    const answer = String(sequence[missingIdx]);
    const items = [String(sequence[0]), String(sequence[1]), String(sequence[2]), String(sequence[3]), String(sequence[4]), String(sequence[5])];
    items[missingIdx] = "?";

    let defectMap = null;
    let options = null;
    if (isMCQ) {
      options = [answer, String(parseInt(answer) + 1), String(parseInt(answer) - 2), String(startA + startB)].sort(() => Math.random() - 0.5);
      defectMap = {
        [String(startA + startB)]: "CONFUSED_OPERATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }
    const solutionSteps = `1. This sequence has two patterns mixed together.\\n2. Pattern 1 (1st, 3rd, 5th numbers) counts by ${stepA}.\\n3. Pattern 2 (2nd, 4th, 6th numbers) counts by ${stepB}.\\n4. The missing number follows ${missingIdx === 4 ? `Pattern 1: ${sequence[2]} + ${stepA} = ${answer}` : `Pattern 2: ${sequence[3]} + ${stepB} = ${answer}`}.`;

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      STRICT: Generate a short (2-sentence maximum), varied Singaporean math story context for the "questionText". Use themes of two different things taking turns (e.g., alternating red and blue cards, or two friends taking turns). End the story by asking the student to figure out the missing number. Do NOT mention the dual patterns.

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": "[Generate the full 1-2 sentence story problem here asking for the missing number]",
          "options": ${isMCQ ? JSON.stringify(options) : 'null'},
          "defectMap": ${defectMap ? JSON.stringify(defectMap) : 'null'},
          "hint": "Try looking at every second number to see if you can find two patterns.",
          "finalAnswer": "${answer}",
          "solutionSteps": "${solutionSteps}"
        },
        "visualEngine": {
          "componentToRender": "NUMBER_PATTERN",
          "componentData": { "rule": "Mixed Patterns", "sequence": ${JSON.stringify(items)} }
        },
        "inputRequirement": { "inputType": "${inputType}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "interleaved", hideVisual: false }
    };
  }

  // 4. SHRINKING PATTERN (Step-down logic)
  if (activeVariant === 'advanced_shrinking_pattern') {
    const initialJump = Math.floor(Math.random() * 5) + 1; // 1 to 5
    const growth = Math.floor(Math.random() * 5) + 1; // 1 to 5
    const totalSubtracted = 4 * initialJump + 6 * growth;
    const start = Math.floor(Math.random() * (101 - totalSubtracted)) + totalSubtracted;
    const sequence = [
      start,
      start - initialJump,
      start - initialJump - (initialJump + growth),
      start - initialJump - (initialJump + growth) - (initialJump + 2 * growth),
      start - initialJump - (initialJump + growth) - (initialJump + 2 * growth) - (initialJump + 3 * growth)
    ];
    const answer = String(sequence[4]);

    let defectMap = null;
    let options = null;
    if (isMCQ) {
      options = [answer, String(sequence[4] - growth), String(sequence[4] + initialJump), String(sequence[4] - 1)].sort(() => Math.random() - 0.5);
      defectMap = {
        [String(sequence[4] - growth)]: "CONCEPTUAL_ERROR",
        [String(sequence[4] + initialJump)]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      STRICT: Generate a short (2-sentence maximum), varied Singaporean math story context for the "questionText". Use themes of things getting smaller, dropping down, or running out. End the story by asking the student to figure out the missing number. Do NOT mention the numbers or jump logic.

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": "[Generate the full 1-2 sentence story problem here asking for the missing number]",
          "options": ${isMCQ ? JSON.stringify(options) : 'null'},
          "defectMap": ${defectMap ? JSON.stringify(defectMap) : 'null'},
          "hint": "The jumps between numbers are getting larger, but the numbers are getting smaller.",
          "finalAnswer": "${answer}",
          "solutionSteps": "1. The first jump is -${initialJump}.\\n2. The next jump is -${initialJump + growth}.\\n3. The next jump is -${initialJump + 2 * growth}.\\n4. The last jump should be -${initialJump + 3 * growth}. So, ${sequence[3]} - ${initialJump + 3 * growth} = ${answer}."
        },
        "visualEngine": {
          "componentToRender": "NUMBER_PATTERN",
          "componentData": { "rule": "Shrinking Pattern", "sequence": ${JSON.stringify([String(sequence[0]), String(sequence[1]), String(sequence[2]), String(sequence[3]), "?"])} }
        },
        "inputRequirement": { "inputType": "${inputType}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "shrinking_step", hideVisual: false }
    };
  }

  // 5. DOUBLE DIGIT STEP (+11 or +12)
  if (activeVariant === 'advanced_double_digit_step') {
    const step = Math.random() > 0.5 ? 11 : 12;
    const start = Math.floor(Math.random() * 30) + 10;
    const sequence = [start, start + step, start + 2 * step, start + 3 * step, start + 4 * step];
    const answer = String(sequence[2]); // Missing middle

    let defectMap = null;
    let options = null;
    if (isMCQ) {
      options = [answer, String(sequence[2] + 1), String(sequence[2] - 1), String(sequence[1] + 10)].sort(() => Math.random() - 0.5);
      defectMap = {
        [String(sequence[1] + 10)]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. DO NOT reveal the specific number ${step} in the story.

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": "[STORY] What number is missing in this pattern?",
          "options": ${isMCQ ? JSON.stringify(options) : 'null'},
          "defectMap": ${defectMap ? JSON.stringify(defectMap) : 'null'},
          "hint": "Check the difference between the first two numbers.",
          "finalAnswer": "${answer}",
          "solutionSteps": "1. The numbers increase by ${step} every time.\\n2. To find the missing number, add ${step} to ${sequence[1]}.\\n3. ${sequence[1]} + ${step} = ${answer}."
        },
        "visualEngine": {
          "componentToRender": "NUMBER_PATTERN",
          "componentData": { "rule": "+${step}", "sequence": [String(sequence[0]), String(sequence[1]), "?", String(sequence[3]), String(sequence[4])] }
        },
        "inputRequirement": { "inputType": "${inputType}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "double_digit_step", hideVisual: false }
    };
  }

  // 6. BIG JUMP ALTERNATING (+20, -5)
  if (activeVariant === 'advanced_big_jump_alternating') {
    const j1Choices = [15, 20, 25, 30];
    const j2Choices = [-2, -3, -4, -5, -10];
    const j1 = j1Choices[Math.floor(Math.random() * j1Choices.length)];
    const j2 = j2Choices[Math.floor(Math.random() * j2Choices.length)];
    const maxJump = Math.max(j1, 2 * j1 + j2);
    const start = Math.floor(Math.random() * (100 - maxJump + 1));
    const sequence = [start, start + j1, start + j1 + j2, start + 2*j1 + j2, start + 2*j1 + 2*j2];
    const answer = String(sequence[3]); // Missing 4th
    const displaySeq = [String(sequence[0]), String(sequence[1]), String(sequence[2]), "?", String(sequence[4])];

    let defectMap = null;
    let options = null;
    if (isMCQ) {
      options = [answer, String(sequence[3] + Math.abs(j2)), String(sequence[3] - Math.abs(j2)), String(sequence[3] + 1)].sort(() => Math.random() - 0.5);
      defectMap = {
        [String(sequence[3] + Math.abs(j2))]: "CONCEPTUAL_ERROR",
        [String(sequence[3] - Math.abs(j2))]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      STRICT: This is a text-only question. Provide a direct mathematical question that includes the number sequence. Do NOT use names, items, or stories. Focus on the alternating jump logic.

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": "Find the missing number in the pattern: ${displaySeq.join(', ')}",
          "options": ${isMCQ ? JSON.stringify(options) : 'null'},
          "defectMap": ${defectMap ? JSON.stringify(defectMap) : 'null'},
          "hint": "The pattern adds a number, then subtracts a number.",
          "finalAnswer": "${answer}",
          "solutionSteps": "1. The rule is to add ${j1}, then subtract ${Math.abs(j2)}.\\n2. We just subtracted ${Math.abs(j2)} to get ${sequence[2]}.\\n3. Now we must add ${j1} to get the next number.\\n4. ${sequence[2]} + ${j1} = ${answer}."
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${inputType}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "big_alternating", hideVisual: true }
    };
  }

  // Alternating Patterns
  if (activeVariant === 'advanced_alt_plus_minus' || activeVariant === 'advanced_alt_plus_plus' || activeVariant === 'advanced_alt_missing_start' || activeVariant === 'advanced_alternating_rule') {
    let s0, j1, j2, missingIdx;
    
    if (activeVariant === 'advanced_alt_plus_minus') {
      s0 = Math.floor(Math.random() * 40) + 10;
      j1 = Math.floor(Math.random() * 4) + 3; // Random jump between +3 and +6
      j2 = -(Math.floor(Math.random() * 3) + 1); // Random drop between -1 and -3
      missingIdx = 3;
    } else if (activeVariant === 'advanced_alt_plus_plus') {
      s0 = Math.floor(Math.random() * 40) + 10;
      j1 = (Math.floor(Math.random() * 2) + 1) * 5; // Jumps of 5 or 10
      j2 = Math.floor(Math.random() * 4) + 1; // Small boost between +1 and +4
      missingIdx = 2;
    } else if (activeVariant === 'advanced_alternating_rule') {
      s0 = Math.floor(Math.random() * 40) + 20;
      j1 = Math.floor(Math.random() * 4) + 4; // 4 to 7
      j2 = -(Math.floor(Math.random() * 3) + 1); // -1 to -3
      missingIdx = 2; // Hides 3rd number
    } else {
      s0 = Math.floor(Math.random() * 40) + 20;
      j1 = Math.floor(Math.random() * 5) + 3; // 3 to 7
      j2 = -(Math.floor(Math.random() * 2) + 1); // -1 to -2
      missingIdx = 0;
    }

    const sequence = [s0, s0 + j1, s0 + j1 + j2, s0 + 2 * j1 + j2, s0 + 2 * j1 + 2 * j2];
    const answer = String(sequence[missingIdx]);
    const items = sequence.map((val, idx) => (idx === missingIdx) ? "?" : String(val));

    let defectMap = null;
    let options = null;
    if (isMCQ) {
      let distractors = [];
      while (distractors.length < 3) {
        let d = Math.floor(Math.random() * 10) + (parseInt(answer) - 5);
        if (d !== parseInt(answer) && !sequence.includes(d) && !distractors.includes(d) && d > 0) {
          distractors.push(String(d));
        }
      }
      options = [answer, ...distractors].sort(() => Math.random() - 0.5);
      defectMap = {};
      options.forEach(opt => { if (opt !== answer) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    // Generate dynamic explanation based on missing position
    let solutionExplanation;
    if (missingIdx === 0) {
      solutionExplanation = `1. The pattern has two rules: first ${j1 > 0 ? '+' : ''}${j1} then ${j2 > 0 ? '+' : ''}${j2}.\\n2. To find the start, we work backwards from ${sequence[1]}.\\n3. ${sequence[1]} - (${j1}) = ${answer}.`;
    } else {
      const ruleName = (missingIdx % 2 === 0) ? "second" : "first";
      const ruleValue = (missingIdx % 2 === 0) ? j2 : j1;
      const prevNum = sequence[missingIdx - 1];
      solutionExplanation = `1. The pattern rules are: ${j1 > 0 ? '+' : ''}${j1} then ${j2 > 0 ? '+' : ''}${j2}.\\n2. The number before the missing one is ${prevNum}.\\n3. Applying the ${ruleName} rule: ${prevNum} ${ruleValue > 0 ? '+' : ''}${ruleValue} = ${answer}.`;
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      STRICT: This is a visual number pattern question. Provide a direct, varied, and professional mathematical question to identify the missing number '?' in the sequence: ${items.join(', ')}. Do NOT use names (e.g., Ali), items (e.g., stickers), or story contexts. Focus strictly on logic and pattern identification. Do NOT convert the numerical rules into story actions (e.g., "gets more", "gives away").

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": "[Generate a clear and varied mathematical question text based on the instructions above]",
          "options": ${isMCQ ? JSON.stringify(options) : 'null'},
          "defectMap": ${defectMap ? JSON.stringify(defectMap) : 'null'},
          "hint": "This pattern has two different jumps that take turns.",
          "finalAnswer": "${answer}",
          "solutionSteps": "${solutionExplanation}"
        },
        "visualEngine": {
          "componentToRender": "NUMBER_PATTERN",
          "componentData": { "rule": "Alternating", "sequence": ${JSON.stringify(items)} }
        },
        "inputRequirement": { "inputType": "${inputType}" }
      }`,
      metadata: { difficulty, steps: 3, logic: activeVariant, hideVisual: false }
    };
  }
}