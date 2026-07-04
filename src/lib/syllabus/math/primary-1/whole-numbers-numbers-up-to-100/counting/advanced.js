export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText) {
  // ==========================================
  // ADVANCED LEVEL
  // ==========================================

  // 1. Skip Counting with Offset
  if (activeVariant === 'advanced_skip_counting_offset') {
    const jumpSize = [2, 5, 10][Math.floor(Math.random() * 3)];
    const offset = Math.floor(Math.random() * (jumpSize - 1)) + 1; // 1 to jumpSize-1
    const steps = Math.floor(Math.random() * 3) + 3; // 3 to 5 steps
    const total = offset + (jumpSize * steps);
    
    let formattedOptions = 'null';
    let defectMapJSON = 'null';
    
    if (isMCQ) {
      const optionValues = [total, total - jumpSize, total + jumpSize, total - offset];
      const options = optionValues.map(String);
      const defectMap = {
        [String(total - jumpSize)]: "COUNTING_ERROR_MISSED_JUMP",
        [String(total + jumpSize)]: "COUNTING_ERROR_EXTRA_JUMP",
        [String(total - offset)]: "COUNTING_ERROR_FORGOT_OFFSET"
      };
      options.forEach(opt => { if (opt !== String(total) && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
      defectMapJSON = JSON.stringify(defectMap);
      formattedOptions = JSON.stringify(options.sort(() => Math.random() - 0.5));
    }

    const creativeInstructions = `CREATIVE INSTRUCTIONS:
      ${isShort ? `- Write a direct, concise math question using the name ${context.name}. You MUST explicitly ask a question.` : `- Write an engaging 1-sentence Singaporean math story context using the name ${context.name}.`}
      - You MUST phrase the question indicating the start number and the skip counting interval.`;

    const questionTemplate = getQText(
      `[Story Context]. Start at ${offset} and count on by ${jumpSize}s for ${steps} steps. What is the final number?`,
      `Start at ${offset} and count on by ${jumpSize}s for ${steps} steps. What is the final number?`
    );

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are writing a ${activeVariant} question. You MUST use the name ${context.name} and the item ${selectedContextItem}.
      You are an expert Primary 1 math question generator.
      MATH CONSTRAINTS:
      - Topic: Counting to 100 (Advanced Level - Skip Counting with Offset)
      - Start Number: ${offset}
      - Jump Size: ${jumpSize}
      - Steps: ${steps}
      - Target Total: ${total}
      - Final Answer MUST strictly be: "${total}"
      
      ${creativeInstructions}
      ${formatInstructions}
      
      OUTPUT FORMAT (Return ONLY valid JSON matching this schema):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(questionTemplate)},
          "options": ${formattedOptions},
          "defectMap": ${defectMapJSON},
          "hint": "[Insert conceptual hint here]",
          "finalAnswer": "${total}",
          "solutionSteps": ${JSON.stringify(`Start at ${offset}. Add ${jumpSize} for ${steps} times: ${Array.from({length: steps}, (_, i) => offset + ((i+1)*jumpSize)).join(', ')}. The final number is ${total}.`)}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "skip_count_offset", hideVisual: true }
    };
  }

  // 2. Skip Count Backward Offset
  if (activeVariant === 'advanced_skip_count_backward_offset') {
    const jumpSize = [2, 5, 10][Math.floor(Math.random() * 3)];
    const start = Math.floor(Math.random() * 40) + 50; 
    const steps = Math.floor(Math.random() * 2) + 3; 
    const total = start - (jumpSize * steps);
    
    let formattedOptions = 'null'; let defectMapJSON = 'null';
    if (isMCQ) {
      const optionValues = [total, total + jumpSize, total - jumpSize, total + 1];
      const options = optionValues.map(String);
      const defectMap = { [String(total + jumpSize)]: "COUNTING_ERROR_MISSED_JUMP", [String(total - jumpSize)]: "COUNTING_ERROR_EXTRA_JUMP" };
      options.forEach(opt => { if (opt !== String(total) && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
      defectMapJSON = JSON.stringify(defectMap); formattedOptions = JSON.stringify(options.sort(() => Math.random() - 0.5));
    }

    const seqItems = [start];
    for (let i = 1; i < steps; i++) seqItems.push(start - (jumpSize * i));
    seqItems.push('?');

    const creativeInstructions = `CREATIVE INSTRUCTIONS:
      ${isShort ? `- Write a direct, concise math question.` : `- Write an engaging 1-sentence Singaporean math story context.`}
      - You MUST phrase the question using the terms "skip counting backward by ${jumpSize}s".`;
    const questionTemplate = getQText(`[Story Context]. Skip count backward by ${jumpSize}s: ${seqItems.slice(0, -1).join(', ')}, ___. What is the missing number?`, `Skip count backward by ${jumpSize}s: ${seqItems.slice(0, -1).join(', ')}, ___. What is the missing number?`);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are writing a ${activeVariant} question. You MUST use the name ${context.name}.
      MATH CONSTRAINTS:
      - Target Missing Number: ${total}
      - Final Answer MUST strictly be: "${total}"
      - CRITICAL: In the output JSON, you MUST copy the "visualEngine" object exactly as shown below. DO NOT fill in the "?" marks in the items array.
      ${creativeInstructions}
      ${formatInstructions}
      OUTPUT FORMAT (Return ONLY valid JSON matching this schema):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(questionTemplate)},
          "options": ${formattedOptions},
          "defectMap": ${defectMapJSON},
          "hint": "[Insert conceptual hint here]",
          "finalAnswer": "${total}",
          "solutionSteps": ${JSON.stringify(`To skip count backward by ${jumpSize}s, subtract ${jumpSize} from the previous number. ${seqItems[seqItems.length-2]} - ${jumpSize} = ${total}.`)}
        },
        "visualEngine": { "componentToRender": "NUMBER_CARDS", "componentData": { "items": ${JSON.stringify(seqItems)} } },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 2, logic: "skip_count_backward_offset", hideVisual: false }
    };
  }

  // 3. Missing Sequence Multiple
  if (activeVariant === 'advanced_missing_sequence_multiple') {
    const jumpSize = [2, 5, 10][Math.floor(Math.random() * 3)];
    const start = Math.floor(Math.random() * 30) + 10;
    const seqItems = [start, '?', start + (jumpSize * 2), start + (jumpSize * 3), '?'];
    const total1 = start + jumpSize;
    const total2 = start + (jumpSize * 4);
    const total = `${total1} and ${total2}`;
    
    let formattedOptions = 'null'; let defectMapJSON = 'null';
    if (isMCQ) {
      const optionValues = [total, `${total1-1} and ${total2-1}`, `${total1+1} and ${total2+1}`, `${total1} and ${total2+jumpSize}`];
      const options = optionValues.map(String);
      const defectMap = { [String(`${total1-1} and ${total2-1}`)]: "COUNTING_ERROR" };
      options.forEach(opt => { if (opt !== String(total) && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
      defectMapJSON = JSON.stringify(defectMap); formattedOptions = JSON.stringify(options.sort(() => Math.random() - 0.5));
    }

    const creativeInstructions = `CREATIVE INSTRUCTIONS:
      ${isShort ? `- Write a direct, concise math question.` : `- Write an engaging 1-sentence Singaporean math story context.`}`;
    const questionTemplate = getQText(`[Story Context]. Look at the sequence: ${start}, ___, ${start + (jumpSize * 2)}, ${start + (jumpSize * 3)}, ___. What are the two missing numbers?`, `Look at the sequence: ${start}, ___, ${start + (jumpSize * 2)}, ${start + (jumpSize * 3)}, ___. What are the two missing numbers?`);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are writing a ${activeVariant} question. You MUST use the name ${context.name}.
      MATH CONSTRAINTS:
      - Target Missing Numbers: ${total}
      - Final Answer MUST strictly be: "${total}"
      - CRITICAL: In the output JSON, you MUST copy the "visualEngine" object exactly as shown below. DO NOT fill in the "?" marks in the items array.
      ${creativeInstructions}
      ${formatInstructions}
      OUTPUT FORMAT (Return ONLY valid JSON matching this schema):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(questionTemplate)},
          "options": ${formattedOptions},
          "defectMap": ${defectMapJSON},
          "hint": "[Insert conceptual hint here]",
          "finalAnswer": "${total}",
          "solutionSteps": ${JSON.stringify(`The sequence is skip counting forward by ${jumpSize}. The first missing number is ${start} + ${jumpSize} = ${total1}. The second missing number is ${start + (jumpSize * 3)} + ${jumpSize} = ${total2}.`)}
        },
        "visualEngine": { "componentToRender": "NUMBER_CARDS", "componentData": { "items": ${JSON.stringify(seqItems)} } },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "missing_sequence_multiple", hideVisual: false }
    };
  }

  // 4. Mixed Skip Counting
  if (activeVariant === 'advanced_mixed_skip_counting') {
    const start = Math.floor(Math.random() * 40) + 10;
    const tens = Math.floor(Math.random() * 3) + 1;
    const ones = Math.floor(Math.random() * 4) + 1;
    const total = start + (tens * 10) + ones;
    
    let formattedOptions = 'null'; let defectMapJSON = 'null';
    if (isMCQ) {
      const optionValues = [total, total - 10, total + 10, total - 1];
      const options = optionValues.map(String);
      const defectMap = { [String(total - 10)]: "COUNTING_ERROR_MISSED_TEN", [String(total - 1)]: "COUNTING_ERROR_MISSED_ONE" };
      options.forEach(opt => { if (opt !== String(total) && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
      defectMapJSON = JSON.stringify(defectMap); formattedOptions = JSON.stringify(options.sort(() => Math.random() - 0.5));
    }

    const creativeInstructions = `CREATIVE INSTRUCTIONS:
      ${isShort ? `- Write a direct math command.` : `- Write an engaging 1-sentence math story.`}
      - You MUST phrase the question using the exact instructions to "count forward by ${tens} tens, and then by ${ones} ones".`;
    const questionTemplate = getQText(`[Story Context]. Start at ${start}. Count forward by ${tens} tens, and then count forward by ${ones} ones. What is the final number?`, `Start at ${start}. Count forward by ${tens} tens, and then count forward by ${ones} ones. What is the final number?`);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are writing a ${activeVariant} question.
      MATH CONSTRAINTS:
      - Target Total: ${total}
      - Final Answer MUST strictly be: "${total}"
      ${creativeInstructions}
      ${formatInstructions}
      OUTPUT FORMAT (Return ONLY valid JSON matching this schema):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(questionTemplate)},
          "options": ${formattedOptions},
          "defectMap": ${defectMapJSON},
          "hint": "[Insert conceptual hint here]",
          "finalAnswer": "${total}",
          "solutionSteps": ${JSON.stringify(`Start at ${start}. Count forward by ${tens} tens: ${start + (tens * 10)}. Then count forward by ${ones} ones: ${start + (tens * 10)} + ${ones} = ${total}.`)}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "mixed_skip_counting", hideVisual: true }
    };
  }

  // 5. Complex Before After
  if (activeVariant === 'advanced_complex_before_after') {
    const anchor = Math.floor(Math.random() * 60) + 20;
    const isBefore = Math.random() > 0.5;
    const offset = Math.floor(Math.random() * 5) + 2;
    const intermediate = isBefore ? anchor - 1 : anchor + 1;
    const total = intermediate + offset;
    
    let formattedOptions = 'null'; let defectMapJSON = 'null';
    if (isMCQ) {
      const optionValues = [total, total - 2, total + 2, (isBefore ? anchor + 1 : anchor - 1) + offset];
      const options = optionValues.map(String);
      const defectMap = { [String((isBefore ? anchor + 1 : anchor - 1) + offset)]: "CONFUSION_BEFORE_AFTER" };
      options.forEach(opt => { if (opt !== String(total) && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
      defectMapJSON = JSON.stringify(defectMap); formattedOptions = JSON.stringify(options.sort(() => Math.random() - 0.5));
    }

    const term = isBefore ? "just before" : "just after";
    const creativeInstructions = `CREATIVE INSTRUCTIONS:
      ${isShort ? `- Write a direct math command.` : `- Write an engaging 1-sentence math story.`}
      - You MUST phrase the question using the terms "${offset} more than" and "${term}".`;
    const questionTemplate = getQText(`[Story Context]. What number is ${offset} more than the number ${term} ${anchor}?`, `What number is ${offset} more than the number ${term} ${anchor}?`);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are writing a ${activeVariant} question.
      MATH CONSTRAINTS:
      - Target Answer: ${total}
      - Final Answer MUST strictly be: "${total}"
      ${creativeInstructions}
      ${formatInstructions}
      OUTPUT FORMAT (Return ONLY valid JSON matching this schema):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(questionTemplate)},
          "options": ${formattedOptions},
          "defectMap": ${defectMapJSON},
          "hint": "[Insert conceptual hint here]",
          "finalAnswer": "${total}",
          "solutionSteps": ${JSON.stringify(`The number ${term} ${anchor} is ${intermediate}. ${offset} more than ${intermediate} is ${intermediate} + ${offset} = ${total}.`)}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "complex_before_after", hideVisual: true }
    };
  }

  // 6. Nth Term Skip Counting
  if (activeVariant === 'advanced_nth_term_skip_counting') {
    const jumpSize = [2, 5, 10][Math.floor(Math.random() * 3)];
    const start = Math.floor(Math.random() * 20) + 5;
    const ordinalNum = Math.floor(Math.random() * 4) + 4; // 4th to 7th
    const ordinals = ["", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th"];
    const nth = ordinals[ordinalNum];
    const total = start + (jumpSize * (ordinalNum - 1));
    
    let formattedOptions = 'null'; let defectMapJSON = 'null';
    if (isMCQ) {
      const optionValues = [total, total - jumpSize, total + jumpSize, total + (jumpSize * 2)];
      const options = optionValues.map(String);
      const defectMap = { [String(total - jumpSize)]: "COUNTING_ERROR_MISSED_JUMP" };
      options.forEach(opt => { if (opt !== String(total) && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
      defectMapJSON = JSON.stringify(defectMap); formattedOptions = JSON.stringify(options.sort(() => Math.random() - 0.5));
    }

    const creativeInstructions = `CREATIVE INSTRUCTIONS:
      ${isShort ? `- Write a direct math command.` : `- Write an engaging 1-sentence math story.`}`;
    const questionTemplate = getQText(`[Story Context]. Start at ${start} and skip count forward by ${jumpSize}s. What is the ${nth} number you count?`, `Start at ${start} and skip count forward by ${jumpSize}s. What is the ${nth} number you count?`);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are writing a ${activeVariant} question.
      MATH CONSTRAINTS:
      - Target Answer: ${total}
      - Final Answer MUST strictly be: "${total}"
      ${creativeInstructions}
      ${formatInstructions}
      OUTPUT FORMAT (Return ONLY valid JSON matching this schema):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(questionTemplate)},
          "options": ${formattedOptions},
          "defectMap": ${defectMapJSON},
          "hint": "[Insert conceptual hint here]",
          "finalAnswer": "${total}",
          "solutionSteps": ${JSON.stringify(`The 1st number is ${start}. Counting by ${jumpSize}s: ${Array.from({length: ordinalNum}, (_, i) => start + (jumpSize * i)).join(', ')}. The ${nth} number is ${total}.`)}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "nth_term_skip_counting", hideVisual: true }
    };
  }

  // 7. Number Line Jumps
  if (activeVariant === 'advanced_number_line_jumps') {
    const start = Math.floor(Math.random() * 40) + 30; // 30 to 69
    const forwardJumps = Math.floor(Math.random() * 3) + 2; // 2 to 4
    const forwardSize = 5;
    const backwardJumps = Math.floor(Math.random() * 3) + 1; // 1 to 3
    const backwardSize = 2;
    const total = start + (forwardJumps * forwardSize) - (backwardJumps * backwardSize);
    
    let formattedOptions = 'null'; let defectMapJSON = 'null';
    if (isMCQ) {
      const optionValues = [total, total + backwardSize * 2, total - forwardSize, total - backwardSize];
      const options = optionValues.map(String);
      const defectMap = { [String(total + backwardSize * 2)]: "ADDITION_INSTEAD_OF_SUBTRACTION" };
      options.forEach(opt => { if (opt !== String(total) && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
      defectMapJSON = JSON.stringify(defectMap); formattedOptions = JSON.stringify(options.sort(() => Math.random() - 0.5));
    }

    const creativeInstructions = `CREATIVE INSTRUCTIONS:
      - Write an engaging 2-sentence Singaporean math story about an animal jumping on a number line.
      - The animal must start at ${start}, make ${forwardJumps} jumps forward of ${forwardSize} units each, and then ${backwardJumps} jumps backward of ${backwardSize} units each.`;
    const questionTemplate = `[Animal] starts at ${start} on a number line. It makes ${forwardJumps} jumps forward of ${forwardSize} units each, and then ${backwardJumps} jumps backward of ${backwardSize} units each. What number does it land on?`;

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are writing a ${activeVariant} question.
      MATH CONSTRAINTS:
      - Target Answer: ${total}
      - Final Answer MUST strictly be: "${total}"
      ${creativeInstructions}
      ${formatInstructions}
      OUTPUT FORMAT (Return ONLY valid JSON matching this schema):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(questionTemplate)},
          "options": ${formattedOptions},
          "defectMap": ${defectMapJSON},
          "hint": "[Insert conceptual hint here]",
          "finalAnswer": "${total}",
          "solutionSteps": ${JSON.stringify(`Start at ${start}. Jump forward ${forwardJumps} times by ${forwardSize}: ${start} + ${forwardJumps * forwardSize} = ${start + (forwardJumps * forwardSize)}. Then jump backward ${backwardJumps} times by ${backwardSize}: ${start + (forwardJumps * forwardSize)} - ${backwardJumps * backwardSize} = ${total}.`)}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "number_line_jumps", hideVisual: true }
    };
  }

  // 8. Hundreds Chart Logic
  if (activeVariant === 'advanced_hundreds_chart_logic') {
    // Number grid is 1 to 100. Down = +10, Right = +1.
    // Make sure we don't go out of bounds.
    const startRow = Math.floor(Math.random() * 5) + 2; // Row 2 to 6 (so tens digit 1 to 5)
    const startCol = Math.floor(Math.random() * 5) + 2; // Col 2 to 6 (ones digit 2 to 6)
    const start = (startRow * 10) + startCol;
    const rowJumps = Math.floor(Math.random() * 3) + 1; // 1 to 3 rows down
    const colJumps = Math.floor(Math.random() * 3) + 1; // 1 to 3 cols right
    const total = start + (rowJumps * 10) + colJumps;
    
    let formattedOptions = 'null'; let defectMapJSON = 'null';
    if (isMCQ) {
      const optionValues = [total, total - 10, total - 1, total + 9];
      const options = optionValues.map(String);
      const defectMap = { [String(total - 10)]: "MISSED_ROW" };
      options.forEach(opt => { if (opt !== String(total) && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
      defectMapJSON = JSON.stringify(defectMap); formattedOptions = JSON.stringify(options.sort(() => Math.random() - 0.5));
    }

    const creativeInstructions = `CREATIVE INSTRUCTIONS:
      - Write a short, direct question.`;
    const questionTemplate = `On a 1 to 100 number chart, what number is ${rowJumps} rows exactly below and ${colJumps} columns to the right of ${start}?`;

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are writing a ${activeVariant} question.
      MATH CONSTRAINTS:
      - Target Answer: ${total}
      - Final Answer MUST strictly be: "${total}"
      ${creativeInstructions}
      ${formatInstructions}
      OUTPUT FORMAT (Return ONLY valid JSON matching this schema):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(questionTemplate)},
          "options": ${formattedOptions},
          "defectMap": ${defectMapJSON},
          "hint": "[Insert conceptual hint here]",
          "finalAnswer": "${total}",
          "solutionSteps": ${JSON.stringify(`Moving down ${rowJumps} rows adds ${rowJumps * 10}. Moving right ${colJumps} columns adds ${colJumps}. ${start} + ${rowJumps * 10} + ${colJumps} = ${total}.`)}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "hundreds_chart_logic", hideVisual: true }
    };
  }

  // 9. Odd Even Sequence
  if (activeVariant === 'advanced_odd_even_sequence') {
    const isEven = Math.random() > 0.5;
    const baseStart = Math.floor(Math.random() * 50) + 10;
    // ensure start is odd/even as required
    const start = (baseStart % 2 === (isEven ? 0 : 1)) ? baseStart : baseStart + 1;
    const total1 = start + 2;
    const total2 = start + 4;
    const total3 = start + 6;
    const total = `${total1}, ${total2}, and ${total3}`;
    
    let formattedOptions = 'null'; let defectMapJSON = 'null';
    if (isMCQ) {
      const optionValues = [total, `${total1+1}, ${total2+1}, and ${total3+1}`, `${total1-2}, ${total2-2}, and ${total3-2}`, `${total1}, ${total3}, and ${total3+2}`];
      const options = optionValues.map(String);
      const defectMap = { [String(`${total1+1}, ${total2+1}, and ${total3+1}`)]: "WRONG_PARITY" };
      options.forEach(opt => { if (opt !== String(total) && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
      defectMapJSON = JSON.stringify(defectMap); formattedOptions = JSON.stringify(options.sort(() => Math.random() - 0.5));
    }

    const typeStr = isEven ? "even" : "odd";
    const creativeInstructions = `CREATIVE INSTRUCTIONS:
      ${isShort ? `- Write a direct math command.` : `- Write an engaging 1-sentence math story.`}`;
    const questionTemplate = getQText(`[Story Context]. Start at ${start}. What are the next three ${typeStr} numbers?`, `Start at ${start}. What are the next three ${typeStr} numbers?`);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are writing a ${activeVariant} question.
      MATH CONSTRAINTS:
      - Target Answer: ${total}
      - Final Answer MUST strictly be: "${total}"
      ${creativeInstructions}
      ${formatInstructions}
      OUTPUT FORMAT (Return ONLY valid JSON matching this schema):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(questionTemplate)},
          "options": ${formattedOptions},
          "defectMap": ${defectMapJSON},
          "hint": "[Insert conceptual hint here]",
          "finalAnswer": "${total}",
          "solutionSteps": ${JSON.stringify(`The next consecutive ${typeStr} numbers after ${start} are found by adding 2 each time. The answers are ${total1}, ${total2}, and ${total3}.`)}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "odd_even_sequence", hideVisual: true }
    };
  }

  // 10. Count On Tens Ones
  if (activeVariant === 'advanced_count_on_tens_ones') {
    const start = Math.floor(Math.random() * 40) + 10;
    const tens = Math.floor(Math.random() * 3) + 1;
    const ones = Math.floor(Math.random() * 6) + 1;
    const total = start + (tens * 10) + ones;
    
    let formattedOptions = 'null'; let defectMapJSON = 'null';
    if (isMCQ) {
      const optionValues = [total, total - 10, total + 10, total - ones];
      const options = optionValues.map(String);
      const defectMap = { [String(total - 10)]: "MISSED_TEN" };
      options.forEach(opt => { if (opt !== String(total) && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
      defectMapJSON = JSON.stringify(defectMap); formattedOptions = JSON.stringify(options.sort(() => Math.random() - 0.5));
    }

    const creativeInstructions = `CREATIVE INSTRUCTIONS:
      ${isShort ? `- Write a direct math command.` : `- Write an engaging 1-sentence math story.`}`;
    const questionTemplate = getQText(`[Story Context]. Start at ${start}. Count on ${tens} tens and ${ones} ones. What is the number?`, `Start at ${start}. Count on ${tens} tens and ${ones} ones. What is the number?`);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are writing a ${activeVariant} question.
      MATH CONSTRAINTS:
      - Target Answer: ${total}
      - Final Answer MUST strictly be: "${total}"
      ${creativeInstructions}
      ${formatInstructions}
      OUTPUT FORMAT (Return ONLY valid JSON matching this schema):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(questionTemplate)},
          "options": ${formattedOptions},
          "defectMap": ${defectMapJSON},
          "hint": "[Insert conceptual hint here]",
          "finalAnswer": "${total}",
          "solutionSteps": ${JSON.stringify(`Start at ${start}. Counting on ${tens} tens gives ${start + (tens * 10)}. Counting on ${ones} ones gives ${start + (tens * 10)} + ${ones} = ${total}.`)}
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 3, logic: "count_on_tens_ones", hideVisual: true }
    };
  }

  throw new Error(`Variant ${activeVariant} not found in counting advanced logic.`);
}