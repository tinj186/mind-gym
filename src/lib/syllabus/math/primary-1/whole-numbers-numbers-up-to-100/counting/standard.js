import { emojiObjects } from '@/lib/utils/variable-bank';
export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText) {
  const generatedObj = emojiObjects[Math.floor(Math.random() * emojiObjects.length)];
  
  // ==========================================
  // STANDARD LEVEL
  // ==========================================

  // 1. Counting On
  if (activeVariant === 'standard_count_on') {
    const start = Math.floor(Math.random() * 40) + 10;
    const add = Math.floor(Math.random() * 5) + 2; // Count on 2 to 6 steps
    const total = start + add;
    
    let formattedOptions = 'null'; let defectMapJSON = 'null';
    if (isMCQ) {
      const optionValues = [total, total - 1, total + 1, total - 2];
      const options = optionValues.map(String);
      const defectMap = { [String(total - 1)]: "COUNTING_ERROR_START_AT_ONE", [String(total + 1)]: "COUNTING_ERROR_EXTRA_JUMP" };
      options.forEach(opt => { if (opt !== String(total) && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
      defectMapJSON = JSON.stringify(defectMap); formattedOptions = JSON.stringify(options.sort(() => Math.random() - 0.5));
    }

    const seqArray = [start, ...Array(add).fill('?')];
    const creativeInstructions = `CREATIVE INSTRUCTIONS:
      ${isShort ? '- CRITICAL: DO NOT use character names or math stories. Write a direct, concise math command or question.' : `- Write an engaging 1-sentence Singaporean math story context using the name ${context.name}.`}
      - You MUST phrase the question using the terms "counting on" or "count on".`;
    const questionTemplate = getQText(`[Story Context]. Start at ${start} and count on by ${add}. What is the final number?`, `Start at ${start} and count on by ${add}. What is the final number?`);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are writing a ${activeVariant} question. ${isShort ? 'Do NOT use character names.' : `You MUST use the name ${context.name} and the item ${selectedContextItem}.`}
      MATH CONSTRAINTS:
      - Start Number: ${start}
      - Steps to Count On: ${add}
      - Target Total: ${total}
      - Final Answer MUST strictly be: "${total}"
      - CRITICAL: In the output JSON, you MUST copy the "visualEngine" object exactly as shown below. DO NOT fill in the "?" marks in the sequence.
      
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
          "solutionSteps": ${JSON.stringify(`Start at ${start} and count on ${add} steps: ${Array.from({length: add}, (_, i) => start + i + 1).join(', ')}. The final number is ${total}.`)}
        },
        "visualEngine": { "componentToRender": "NUMBER_PATTERN", "componentData": { "sequence": ${JSON.stringify(seqArray)}, "rule": "+1" } },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 2, logic: "count_on", hideVisual: false }
    };
  }

  // 2. Counting Back
  if (activeVariant === 'standard_count_back') {
    const start = Math.floor(Math.random() * 40) + 20;
    const sub = Math.floor(Math.random() * 5) + 2; // Count back 2 to 6 steps
    const total = start - sub;
    
    let formattedOptions = 'null'; let defectMapJSON = 'null';
    if (isMCQ) {
      const optionValues = [total, total + 1, total - 1, total + 2];
      const options = optionValues.map(String);
      const defectMap = { [String(total + 1)]: "COUNTING_ERROR_START_AT_ONE", [String(total - 1)]: "COUNTING_ERROR_EXTRA_JUMP" };
      options.forEach(opt => { if (opt !== String(total) && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
      defectMapJSON = JSON.stringify(defectMap); formattedOptions = JSON.stringify(options.sort(() => Math.random() - 0.5));
    }

    const seqArray = [...Array(sub).fill('?'), start];
    const creativeInstructions = `CREATIVE INSTRUCTIONS:
      ${isShort ? '- CRITICAL: DO NOT use character names or math stories. Write a direct, concise math command.' : `- Write an engaging 1-sentence Singaporean math story context using the name ${context.name}.`}
      - You MUST phrase the question using the terms "counting back" or "count back".`;
    const questionTemplate = getQText(`[Story Context]. Start at ${start} and count back by ${sub}. What is the final number?`, `Start at ${start} and count back by ${sub}. What is the final number?`);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are writing a ${activeVariant} question. ${isShort ? 'Do NOT use character names.' : `You MUST use the name ${context.name} and the item ${selectedContextItem}.`}
      MATH CONSTRAINTS:
      - Start Number: ${start}
      - Steps to Count Back: ${sub}
      - Target Total: ${total}
      - Final Answer MUST strictly be: "${total}"
      - CRITICAL: In the output JSON, you MUST copy the "visualEngine" object exactly as shown below. DO NOT fill in the "?" marks in the sequence.
      
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
          "solutionSteps": ${JSON.stringify(`Start at ${start} and count back ${sub} steps: ${Array.from({length: sub}, (_, i) => start - i - 1).join(', ')}. The final number is ${total}.`)}
        },
        "visualEngine": { "componentToRender": "NUMBER_PATTERN", "componentData": { "sequence": ${JSON.stringify(seqArray)}, "rule": "-1", "direction": "backward" } },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 2, logic: "count_back", hideVisual: false }
    };
  }

  // 3. Skip Count Forward 2s
  if (activeVariant === 'standard_skip_count_forward_2s') {
    const start = Math.floor(Math.random() * 80) + 2;
    const total = start+6;
    
    let formattedOptions = 'null'; let defectMapJSON = 'null';
    if (isMCQ) {
      const optionValues = [total, total - 1, total + 2, total - 2];
      const options = optionValues.map(String);
      const defectMap = { [String(total - 1)]: "COUNTING_ERROR_BY_ONE", [String(total + 2)]: "COUNTING_ERROR_EXTRA_JUMP" };
      options.forEach(opt => { if (opt !== String(total) && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
      defectMapJSON = JSON.stringify(defectMap); formattedOptions = JSON.stringify(options.sort(() => Math.random() - 0.5));
    }

    const cardItems = [start, start+2, start+4, '?'];
    const creativeInstructions = `CREATIVE INSTRUCTIONS:
      ${isShort ? '- CRITICAL: DO NOT use character names or math stories. Write a direct, concise math command.' : `- Write an engaging 1-sentence Singaporean math story context using the name ${context.name}.`}
      - You MUST phrase the question using the terms "skip counting forward by 2s".`;
    const questionTemplate = getQText(`[Story Context]. Skip count forward by 2s: ${start}, ${start+2}, ${start+4}, ___. What is the missing number?`, `Skip count forward by 2s: ${start}, ${start+2}, ${start+4}, ___. What is the missing number?`);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are writing a ${activeVariant} question. ${isShort ? 'Do NOT use character names.' : `You MUST use the name ${context.name}.`}
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
          "solutionSteps": ${JSON.stringify(`To skip count forward by 2s, add 2 to the previous number. ${start+4} + 2 = ${total}.`)}
        },
        "visualEngine": { "componentToRender": "NUMBER_CARDS", "componentData": { "items": ${JSON.stringify(cardItems)} } },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 1, logic: "skip_count_forward_2s", hideVisual: false }
    };
  }

  // 4. Skip Count Forward 5s
  if (activeVariant === 'standard_skip_count_forward_5s') {
    const start = Math.floor(Math.random() * 80) + 5;
    const total = start+15; 
    
    let formattedOptions = 'null'; let defectMapJSON = 'null';
    if (isMCQ) {
      const optionValues = [total, total - 5, total + 5, total - 1];
      const options = optionValues.map(String);
      const defectMap = { [String(total - 5)]: "COUNTING_ERROR_MISSED_JUMP", [String(total + 5)]: "COUNTING_ERROR_EXTRA_JUMP" };
      options.forEach(opt => { if (opt !== String(total) && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
      defectMapJSON = JSON.stringify(defectMap); formattedOptions = JSON.stringify(options.sort(() => Math.random() - 0.5));
    }

    const cardItems = [start, start+5, start+10, '?'];
    const creativeInstructions = `CREATIVE INSTRUCTIONS:
      ${isShort ? '- CRITICAL: DO NOT use character names or math stories. Write a direct, concise math command.' : `- Write an engaging 1-sentence Singaporean math story.`}
      - You MUST phrase the question using the terms "skip counting forward by 5s".`;
    const questionTemplate = getQText(`[Story Context]. Skip count forward by 5s: ${start}, ${start+5}, ${start+10}, ___. What is the missing number?`, `Skip count forward by 5s: ${start}, ${start+5}, ${start+10}, ___. What is the missing number?`);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are writing a ${activeVariant} question. ${isShort ? 'Do NOT use character names.' : `You MUST use the name ${context.name}.`}
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
          "solutionSteps": ${JSON.stringify(`To skip count forward by 5s, add 5 to the previous number. ${start+10} + 5 = ${total}.`)}
        },
        "visualEngine": { "componentToRender": "NUMBER_CARDS", "componentData": { "items": ${JSON.stringify(cardItems)} } },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 1, logic: "skip_count_forward_5s", hideVisual: false }
    };
  }

  // 5. Skip Count Forward 10s
  if (activeVariant === 'standard_skip_count_forward_10s') {
    const start = Math.floor(Math.random() * 60) + 10;
    const total = start+30; 
    
    let formattedOptions = 'null'; let defectMapJSON = 'null';
    if (isMCQ) {
      const optionValues = [total, total - 10, total + 10, total - 1];
      const options = optionValues.map(String);
      const defectMap = { [String(total - 10)]: "COUNTING_ERROR_MISSED_JUMP", [String(total + 10)]: "COUNTING_ERROR_EXTRA_JUMP" };
      options.forEach(opt => { if (opt !== String(total) && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
      defectMapJSON = JSON.stringify(defectMap); formattedOptions = JSON.stringify(options.sort(() => Math.random() - 0.5));
    }

    const cardItems = [start, start+10, start+20, '?'];
    const creativeInstructions = `CREATIVE INSTRUCTIONS:
      ${isShort ? '- CRITICAL: DO NOT use character names or math stories. Write a direct, concise math command.' : `- Write an engaging 1-sentence Singaporean math story.`}
      - You MUST phrase the question using the terms "skip counting forward by 10s".`;
    const questionTemplate = getQText(`[Story Context]. Skip count forward by 10s: ${start}, ${start+10}, ${start+20}, ___. What is the missing number?`, `Skip count forward by 10s: ${start}, ${start+10}, ${start+20}, ___. What is the missing number?`);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are writing a ${activeVariant} question. ${isShort ? 'Do NOT use character names.' : `You MUST use the name ${context.name}.`}
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
          "solutionSteps": ${JSON.stringify(`To skip count forward by 10s, add 10 to the previous number. ${start+20} + 10 = ${total}.`)}
        },
        "visualEngine": { "componentToRender": "NUMBER_CARDS", "componentData": { "items": ${JSON.stringify(cardItems)} } },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 1, logic: "skip_count_forward_10s", hideVisual: false }
    };
  }

  // 6. Skip Count Backward 2s
  if (activeVariant === 'standard_skip_count_backward_2s') {
    const start = Math.floor(Math.random() * 80) + 12;
    const total = start - 6; 
    
    let formattedOptions = 'null'; let defectMapJSON = 'null';
    if (isMCQ) {
      const optionValues = [total, total + 2, total - 2, total + 1];
      const options = optionValues.map(String);
      const defectMap = { [String(total + 2)]: "COUNTING_ERROR_MISSED_JUMP", [String(total - 2)]: "COUNTING_ERROR_EXTRA_JUMP" };
      options.forEach(opt => { if (opt !== String(total) && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
      defectMapJSON = JSON.stringify(defectMap); formattedOptions = JSON.stringify(options.sort(() => Math.random() - 0.5));
    }

    const cardItems = [start, start-2, start-4, '?'];
    const creativeInstructions = `CREATIVE INSTRUCTIONS:
      ${isShort ? '- CRITICAL: DO NOT use character names or math stories. Write a direct, concise math command.' : `- Write an engaging 1-sentence Singaporean math story.`}
      - You MUST phrase the question using the terms "skip counting backward by 2s".`;
    const questionTemplate = getQText(`[Story Context]. Skip count backward by 2s: ${start}, ${start-2}, ${start-4}, ___. What is the missing number?`, `Skip count backward by 2s: ${start}, ${start-2}, ${start-4}, ___. What is the missing number?`);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are writing a ${activeVariant} question. ${isShort ? 'Do NOT use character names.' : `You MUST use the name ${context.name}.`}
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
          "solutionSteps": ${JSON.stringify(`To skip count backward by 2s, subtract 2 from the previous number. ${start-4} - 2 = ${total}.`)}
        },
        "visualEngine": { "componentToRender": "NUMBER_CARDS", "componentData": { "items": ${JSON.stringify(cardItems)} } },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 1, logic: "skip_count_backward_2s", hideVisual: false }
    };
  }

  // 7. Skip Count Backward 5s
  if (activeVariant === 'standard_skip_count_backward_5s') {
    const start = Math.floor(Math.random() * 70) + 25;
    const total = start - 15; 
    
    let formattedOptions = 'null'; let defectMapJSON = 'null';
    if (isMCQ) {
      const optionValues = [total, total + 5, total - 5, total + 1];
      const options = optionValues.map(String);
      const defectMap = { [String(total + 5)]: "COUNTING_ERROR_MISSED_JUMP", [String(total - 5)]: "COUNTING_ERROR_EXTRA_JUMP" };
      options.forEach(opt => { if (opt !== String(total) && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
      defectMapJSON = JSON.stringify(defectMap); formattedOptions = JSON.stringify(options.sort(() => Math.random() - 0.5));
    }

    const cardItems = [start, start-5, start-10, '?'];
    const creativeInstructions = `CREATIVE INSTRUCTIONS:
      ${isShort ? '- CRITICAL: DO NOT use character names or math stories. Write a direct, concise math command.' : `- Write an engaging 1-sentence Singaporean math story.`}
      - You MUST phrase the question using the terms "skip counting backward by 5s".`;
    const questionTemplate = getQText(`[Story Context]. Skip count backward by 5s: ${start}, ${start-5}, ${start-10}, ___. What is the missing number?`, `Skip count backward by 5s: ${start}, ${start-5}, ${start-10}, ___. What is the missing number?`);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are writing a ${activeVariant} question. ${isShort ? 'Do NOT use character names.' : `You MUST use the name ${context.name}.`}
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
          "solutionSteps": ${JSON.stringify(`To skip count backward by 5s, subtract 5 from the previous number. ${start-10} - 5 = ${total}.`)}
        },
        "visualEngine": { "componentToRender": "NUMBER_CARDS", "componentData": { "items": ${JSON.stringify(cardItems)} } },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 1, logic: "skip_count_backward_5s", hideVisual: false }
    };
  }

  // 8. Skip Count Backward 10s
  if (activeVariant === 'standard_skip_count_backward_10s') {
    const start = Math.floor(Math.random() * 60) + 40;
    const total = start - 30; 
    
    let formattedOptions = 'null'; let defectMapJSON = 'null';
    if (isMCQ) {
      const optionValues = [total, total + 10, total - 10, total + 1];
      const options = optionValues.map(String);
      const defectMap = { [String(total + 10)]: "COUNTING_ERROR_MISSED_JUMP", [String(total - 10)]: "COUNTING_ERROR_EXTRA_JUMP" };
      options.forEach(opt => { if (opt !== String(total) && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
      defectMapJSON = JSON.stringify(defectMap); formattedOptions = JSON.stringify(options.sort(() => Math.random() - 0.5));
    }

    const cardItems = [start, start-10, start-20, '?'];
    const creativeInstructions = `CREATIVE INSTRUCTIONS:
      ${isShort ? '- CRITICAL: DO NOT use character names or math stories. Write a direct, concise math command.' : `- Write an engaging 1-sentence Singaporean math story.`}
      - You MUST phrase the question using the terms "skip counting backward by 10s".`;
    const questionTemplate = getQText(`[Story Context]. Skip count backward by 10s: ${start}, ${start-10}, ${start-20}, ___. What is the missing number?`, `Skip count backward by 10s: ${start}, ${start-10}, ${start-20}, ___. What is the missing number?`);

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are writing a ${activeVariant} question. ${isShort ? 'Do NOT use character names.' : `You MUST use the name ${context.name}.`}
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
          "solutionSteps": ${JSON.stringify(`To skip count backward by 10s, subtract 10 from the previous number. ${start-20} - 10 = ${total}.`)}
        },
        "visualEngine": { "componentToRender": "NUMBER_CARDS", "componentData": { "items": ${JSON.stringify(cardItems)} } },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 1, logic: "skip_count_backward_10s", hideVisual: false }
    };
  }

  // 9. Missing Sequence
  if (activeVariant === 'standard_missing_sequence') {
    const start = Math.floor(Math.random() * 80) + 10;
    const direction = Math.random() > 0.5 ? 1 : -1;
    const total = start + (direction * 2); 
    
    let formattedOptions = 'null'; let defectMapJSON = 'null';
    if (isMCQ) {
      const optionValues = [total, total - direction, total + direction, total - (direction * 2)];
      const options = optionValues.map(String);
      const defectMap = { [String(total - direction)]: "COUNTING_ERROR_MISSED_JUMP", [String(total + direction)]: "COUNTING_ERROR_EXTRA_JUMP" };
      options.forEach(opt => { if (opt !== String(total) && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
      defectMapJSON = JSON.stringify(defectMap); formattedOptions = JSON.stringify(options.sort(() => Math.random() - 0.5));
    }

    const creativeInstructions = `CREATIVE INSTRUCTIONS:
      ${isShort ? '- CRITICAL: DO NOT use character names or math stories. Write a direct, concise math command.' : `- Write an engaging 1-sentence Singaporean math story.`}`;
    const seq1 = start; const seq2 = start + direction; const seq4 = start + (direction * 3);
    const sequenceString = `${seq1}, ${seq2}, ___, ${seq4}`;
    const questionTemplate = getQText(`[Story Context]. Look at the number sequence: ${sequenceString}. What is the missing number?`, `Look at the number sequence: ${sequenceString}. What is the missing number?`);

    const cardItems = [seq1, seq2, '?', seq4];
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are writing a ${activeVariant} question. ${isShort ? 'Do NOT use character names.' : `You MUST use the name ${context.name}.`}
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
          "solutionSteps": ${JSON.stringify(`Look at the numbers before and after the blank. The number sequence is counting ${direction > 0 ? 'forward' : 'backward'} by 1. Therefore, ${seq2} ${direction > 0 ? '+' : '-'} 1 = ${total}.`)}
        },
        "visualEngine": { "componentToRender": "NUMBER_CARDS", "componentData": { "items": ${JSON.stringify(cardItems)} } },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 1, logic: "missing_sequence", hideVisual: false }
    };
  }

  // 10. Before After
  if (activeVariant === 'standard_before_after') {
    const isBefore = Math.random() > 0.5;
    const anchor = Math.floor(Math.random() * 80) + 10;
    const total = isBefore ? anchor - 1 : anchor + 1;
    
    let formattedOptions = 'null'; let defectMapJSON = 'null';
    if (isMCQ) {
      const optionValues = [total, isBefore ? anchor + 1 : anchor - 1, total + 10, total - 10];
      const options = optionValues.map(String);
      const defectMap = { [String(isBefore ? anchor + 1 : anchor - 1)]: "CONFUSION_BEFORE_AFTER" };
      options.forEach(opt => { if (opt !== String(total) && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
      defectMapJSON = JSON.stringify(defectMap); formattedOptions = JSON.stringify(options.sort(() => Math.random() - 0.5));
    }

    const term = isBefore ? "just before" : "just after";
    const creativeInstructions = `CREATIVE INSTRUCTIONS:
      ${isShort ? '- CRITICAL: DO NOT use character names or math stories. Write a direct, concise math command.' : `- Write an engaging 1-sentence Singaporean math story.`}
      - You MUST phrase the question using the term "${term}".`;
    const questionTemplate = getQText(`[Story Context]. What number comes ${term} ${anchor}?`, `What number comes ${term} ${anchor}?`);

    const seqArray = isBefore ? ['?', anchor] : [anchor, '?'];
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are writing a ${activeVariant} question. ${isShort ? 'Do NOT use character names.' : `You MUST use the name ${context.name}.`}
      MATH CONSTRAINTS:
      - Target Missing Number: ${total}
      - Final Answer MUST strictly be: "${total}"
      - CRITICAL: In the output JSON, you MUST copy the "visualEngine" object exactly as shown below. DO NOT fill in the "?" marks in the sequence array.
      
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
          "solutionSteps": ${JSON.stringify(`The number ${term} ${anchor} is ${total}.`)}
        },
        "visualEngine": { "componentToRender": "NUMBER_PATTERN", "componentData": { "sequence": ${JSON.stringify(seqArray)}, "rule": "+1" } },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 1, logic: "before_after", hideVisual: false }
    };
  }

  throw new Error(`Variant ${activeVariant} not found in counting standard logic.`);
}
