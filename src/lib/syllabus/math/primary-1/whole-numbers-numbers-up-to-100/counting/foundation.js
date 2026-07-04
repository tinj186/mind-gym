import { numberToWords } from '@/lib/utils/math-helpers';
import { emojiObjects } from '@/lib/utils/variable-bank';

export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon) {

const generatedObj = emojiObjects[Math.floor(Math.random() * emojiObjects.length)];

  // ==========================================
  // FOUNDATION LEVEL
  // ==========================================

  // 1. Grouping Tens and Ones (Visual Counting)
  if (activeVariant === 'foundation_grouping') {
    const tens = Math.floor(Math.random() * 4) + 2; // 2 to 5 tens (20-59 items total)
    const ones = Math.floor(Math.random() * 9) + 1; // 1 to 9 ones
    const total = (tens * 10) + ones;

    const groups = Array(tens).fill(10);
    if (ones > 0) groups.push(ones);

    const askForWord = Math.random() > 0.5;
    
    const expectedAnswer = askForWord ? numberToWords(total) : String(total);
    let formattedOptions = 'null';
    let defectMapJSON = 'null';
    if (isMCQ) {
      const optionValues = [total - 10, total - 1, total, total + 1];
      let options = askForWord ? optionValues.map(v => numberToWords(v)) : optionValues.map(v => String(v));
      const wrongOp1 = askForWord ? numberToWords(total - 10) : String(total - 10);
      const defectMap = {
        [wrongOp1]: "CONFUSED_OPERATION"
      };
      options.forEach(opt => { if (opt !== expectedAnswer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
      defectMapJSON = JSON.stringify(defectMap);
      formattedOptions = JSON.stringify(options.sort(() => Math.random() - 0.5));
    }

    const promptInstruction = askForWord 
      ? "Ask the student to count the items and write the number in WORDS (e.g., 'thirty-four')." 
      : "Ask the student to count the items and write the number in NUMERALS (e.g., '34').";

    const creativeInstructions = `CREATIVE INSTRUCTIONS:
      ${isShort ? '- CRITICAL: DO NOT use any character names or stories. Write a direct, concise command (e.g., "Count all the ${generatedObj.name}.").' : `- Write an engaging 1-sentence Singaporean math story context using the name ${context.name}.`}
      - You MUST use the object "${generatedObj.name}" in your question. (Do not change the object, use exactly "${generatedObj.name}").
      - CRITICAL: DO NOT write the number ${total} anywhere in the "questionText" story! The student must count the items visually.`;

    const questionTemplate = getQText(
      `[Story Context]. Count the ${generatedObj.name}. Write the total amount ${askForWord ? 'in words' : 'in numerals'}.`,
      `Count the ${generatedObj.name}. Write the total amount ${askForWord ? 'in words' : 'in numerals'}.`
    );

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are writing a ${activeVariant} question. ${isShort ? '' : `You MUST use the name ${context.name} in a 1-sentence math story.`}
      You are an expert Primary 1 math question generator.
      MATH CONSTRAINTS:
      - Topic: Counting to 100 (Foundation Level - Visual Counting)
      - Target Total: ${total}. 
      - Question: ${promptInstruction}
      - Final Answer MUST strictly be: "${expectedAnswer}"
      
      ${creativeInstructions}
      ${formatInstructions}
      
      CRITICAL VISUAL RULE: DO NOT modify the "visualEngine" block below. You MUST copy the "totalItems" number and the "items" array exactly as provided in the template.
      OUTPUT FORMAT (Return ONLY valid JSON matching this schema):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(questionTemplate)},
          "options": ${formattedOptions},
          "defectMap": ${defectMapJSON},
          "hint": "[Insert conceptual hint here]",
          "finalAnswer": "${expectedAnswer}",
          "solutionSteps": ${JSON.stringify(`There are ${tens} groups of ten (${tens * 10}) and ${ones} ones. Total is ${total}.`)}
        },
        "visualEngine": {
          "componentToRender": "GROUPING_WORKSPACE",
          "componentData": {
            "mode": "GROUPING",
            "targetGroupSize": 10,
            
            "totalItems": ${total},
            "icon": "${generatedObj.icon}"
          }
        },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 1, logic: "base_ten_grouping", hideVisual: false }
    };
  }

  // 2. Visual Word Conversion
  if (activeVariant === 'foundation_visual_word_conversion') {
    const total = Math.floor(Math.random() * 20) + 1; // 1 to 20
    const answer = numberToWords(total);
    
    let optionsJSON = 'null';
    let defectMapJSON = 'null';
    if (isMCQ) {
      let options = [
        numberToWords(total), 
        numberToWords(Math.max(1, total - 1)), 
        numberToWords(total + 1), 
        numberToWords(Math.max(1, total - 2))
      ];
      options = [...new Set(options)];
      while(options.length < 4) {
        options.push(numberToWords(Math.floor(Math.random() * 20) + 1));
        options = [...new Set(options)];
      }
      
      const defectMap = {};
      options.forEach(opt => { if (opt !== answer) defectMap[opt] = "VOCABULARY_ERROR"; });
      defectMapJSON = JSON.stringify(defectMap);
      optionsJSON = JSON.stringify(options.sort(() => Math.random() - 0.5));
    }

    const creativeInstructions = `CREATIVE INSTRUCTIONS:
      ${isShort ? '- CRITICAL: DO NOT use any character names or stories. Write a direct, concise command (e.g., "Count all the ${generatedObj.name}.").' : `- Write an engaging 1-sentence Singaporean math story context using the name ${context.name}.`}
      - You MUST use the object "${generatedObj.name}" in your question. (Do not change the object, use exactly "${generatedObj.name}").
      - CRITICAL: DO NOT write the number ${total} anywhere in the "questionText" story! The student must count the items visually.`;

    const questionTemplate = getQText(
      `[Story Context]. Count the ${generatedObj.name}. Write the number in words.`,
      `Count the ${generatedObj.name}. Write the number in words.`
    );

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a ${activeVariant} question. ${isShort ? '' : `You MUST use the name ${context.name} in a 1-sentence math story.`}
      MATH CONSTRAINTS:
      - Topic: Counting to 100 (Foundation Level)
      - Total Items: ${total}. 
      - Final Answer MUST strictly be: "${answer}"
      
      ${creativeInstructions}
      ${formatInstructions}
      
      OUTPUT FORMAT (Return ONLY valid JSON matching this schema):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(questionTemplate)},
          "options": ${optionsJSON},
          "defectMap": ${defectMapJSON},
          "hint": "[Insert conceptual hint here]",
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(`Count the items one by one. The total is ${total}, which is spelled as ${answer}.`)}
        },
        "visualEngine": {
          "componentToRender": "ICON_GRID",
          "componentData": {
            
            "totalItems": ${total},
            "icon": "${generatedObj.icon}"
          }
        },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 1, logic: "visual_word_conversion", hideVisual: false }
    };
  }

  // 3. Scattered Counting
  if (activeVariant === 'foundation_scattered') {
    const total = Math.floor(Math.random() * 15) + 5; // 5 to 19 items
    const expectedAnswer = String(total);
    
    let formattedOptions = 'null';
    let defectMapJSON = 'null';
    if (isMCQ) {
      const options = [total - 1, total, total + 1, total - 2].map(String);
      const defectMap = {};
      options.forEach(opt => { if (opt !== expectedAnswer) defectMap[opt] = "CARELESS_CALCULATION"; });
      defectMapJSON = JSON.stringify(defectMap);
      formattedOptions = JSON.stringify(options.sort(() => Math.random() - 0.5));
    }

    const creativeInstructions = `CREATIVE INSTRUCTIONS:
      ${isShort ? '- CRITICAL: DO NOT use any character names or stories. Write a direct, concise command (e.g., "Count all the ${generatedObj.name}.").' : `- Write an engaging 1-sentence Singaporean math story context using the name ${context.name}.`}
      - You MUST use the object "${generatedObj.name}" in your question. (Do not change the object, use exactly "${generatedObj.name}").
      - CRITICAL: DO NOT write the number ${total} anywhere in the "questionText" story! The student must count the items visually.`;

    const questionTemplate = getQText(
      `[Story Context]. Count the ${generatedObj.name}. What is the total amount?`,
      `Count the ${generatedObj.name}. What is the total amount?`
    );

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are writing a ${activeVariant} question. ${isShort ? '' : `You MUST use the name ${context.name} in a 1-sentence math story.`}
      MATH CONSTRAINTS:
      - Target Total: ${total}. 
      - Final Answer MUST strictly be: "${expectedAnswer}"
      
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
          "finalAnswer": "${expectedAnswer}",
          "solutionSteps": ${JSON.stringify(`Count the items one by one. The total is ${total}.`)}
        },
        "visualEngine": {
          "componentToRender": "ICON_GRID",
          "componentData": {
            
            "totalItems": ${total},
            "icon": "${generatedObj.icon}"
          }
        },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 1, logic: "scattered_counting", hideVisual: false }
    };
  }

  // 4. Skip Counting Visual
  if (activeVariant === 'foundation_skip_count_visual') {
    const groupSize = [2, 5, 10][Math.floor(Math.random() * 3)];
    const groups = Math.floor(Math.random() * 5) + 3; // 3 to 7 groups
    const total = groupSize * groups;
    const expectedAnswer = String(total);
    
    let formattedOptions = 'null';
    let defectMapJSON = 'null';
    if (isMCQ) {
      const options = [total - groupSize, total, total + groupSize, total - (groupSize * 2)].map(String);
      const defectMap = {};
      options.forEach(opt => { if (opt !== expectedAnswer) defectMap[opt] = "COUNTING_ERROR_MISSED_JUMP"; });
      defectMapJSON = JSON.stringify(defectMap);
      formattedOptions = JSON.stringify(options.sort(() => Math.random() - 0.5));
    }

    const creativeInstructions = `CREATIVE INSTRUCTIONS:
      ${isShort ? '- CRITICAL: DO NOT use any character names or stories. Write a direct, concise command (e.g., "Count all the ${generatedObj.name}.").' : `- Write an engaging 1-sentence Singaporean math story context using the name ${context.name}.`}
      - You MUST use the object "${generatedObj.name}" in your question. (Do not change the object, use exactly "${generatedObj.name}").
      - CRITICAL: DO NOT use the word "groups" or "sets" in the story. DO NOT frame this as multiplication or repeated addition (e.g. do not say "${groups} groups of ${groupSize}").
      - Simply present a scenario where the character has the items (if story) or just command to count them (if short).
      - CRITICAL: DO NOT write the number ${total} anywhere in the "questionText" story!`;

    const questionTemplate = getQText(
      `[Story Context]. Count the ${generatedObj.name}. What is the total amount?`,
      `Count the ${generatedObj.name}. What is the total amount?`
    );

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are writing a ${activeVariant} question. ${isShort ? '' : `You MUST use the name ${context.name} in a 1-sentence math story.`}
      MATH CONSTRAINTS:
      - Target Total: ${total}. 
      - Final Answer MUST strictly be: "${expectedAnswer}"
      
      ${creativeInstructions}
      ${formatInstructions}
      
      OUTPUT FORMAT (Return ONLY valid JSON matching this schema):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(questionTemplate)},
          "options": ${formattedOptions},
          "defectMap": ${defectMapJSON},
          "hint": "Try counting by ${groupSize}s.",
          "finalAnswer": "${expectedAnswer}",
          "solutionSteps": ${JSON.stringify(`Count by ${groupSize}s: ${Array.from({length: groups}, (_, i) => (i+1)*groupSize).join(', ')}. The total is ${total}.`)}
        },
        "visualEngine": {
          "componentToRender": "GROUPING_WORKSPACE",
          "componentData": {
            "mode": "GROUPING",
            "targetGroupSize": ${groupSize},
            
            "totalItems": ${total},
            "icon": "${generatedObj.icon}"
          }
        },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 1, logic: "skip_count_visual", hideVisual: false }
    };
  }

  // 5. Counting On Visual
  if (activeVariant === 'foundation_count_on_visual') {
    const tens = 1; 
    const ones = Math.floor(Math.random() * 8) + 2; // 2 to 9 ones
    const total = 10 + ones;
    const expectedAnswer = String(total);
    
    let formattedOptions = 'null';
    let defectMapJSON = 'null';
    if (isMCQ) {
      const options = [total - 1, total, total + 1, total - 2].map(String);
      const defectMap = {};
      options.forEach(opt => { if (opt !== expectedAnswer) defectMap[opt] = "CARELESS_CALCULATION"; });
      defectMapJSON = JSON.stringify(defectMap);
      formattedOptions = JSON.stringify(options.sort(() => Math.random() - 0.5));
    }

    const creativeInstructions = `CREATIVE INSTRUCTIONS:
      ${isShort ? '- CRITICAL: DO NOT use any character names or stories. Write a direct, concise command (e.g., "Count all the ${generatedObj.name}.").' : `- Write an engaging 1-sentence Singaporean math story context using the name ${context.name}.`}
      - You MUST use the object "${generatedObj.name}" in your question. (Do not change the object, use exactly "${generatedObj.name}").
      - CRITICAL: DO NOT write the number ${total} anywhere in the "questionText" story!`;

    const questionTemplate = getQText(
      `[Story Context]. Count the ${generatedObj.name}. What is the total amount?`,
      `Count the ${generatedObj.name}. What is the total amount?`
    );

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are writing a ${activeVariant} question. ${isShort ? '' : `You MUST use the name ${context.name} in a 1-sentence math story.`}
      MATH CONSTRAINTS:
      - Target Total: ${total}. 
      - Final Answer MUST strictly be: "${expectedAnswer}"
      
      ${creativeInstructions}
      ${formatInstructions}
      
      OUTPUT FORMAT (Return ONLY valid JSON matching this schema):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(questionTemplate)},
          "options": ${formattedOptions},
          "defectMap": ${defectMapJSON},
          "hint": "Start at 10 and count on the rest.",
          "finalAnswer": "${expectedAnswer}",
          "solutionSteps": ${JSON.stringify(`There is 1 group of ten (10) and ${ones} loose items. Start at 10 and count on: ${Array.from({length: ones}, (_, i) => 10 + i + 1).join(', ')}. The total is ${total}.`)}
        },
        "visualEngine": {
          "componentToRender": "GROUPING_WORKSPACE",
          "componentData": {
            "mode": "GROUPING",
            "targetGroupSize": 10,
            
            "totalItems": ${total},
            "icon": "${generatedObj.icon}"
          }
        },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 1, logic: "count_on_visual", hideVisual: false }
    };
  }

  throw new Error(`Variant ${activeVariant} not found in counting foundation logic.`);
}