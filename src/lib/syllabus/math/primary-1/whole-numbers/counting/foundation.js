import { numberToWords } from '@/lib/utils/math-helpers';
import { getRandomContext } from '@/lib/utils/localization';
import { NUMBER_WORDS as numberWords } from '@/lib/utils/variable-bank';

export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon) {
  // ==========================================
  // FOUNDATION LEVEL
  // ==========================================

  // 1. Grouping Tens and Ones
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

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are writing a ${activeVariant} story. You MUST use the name ${context.name} and the item ${selectedContextItem}. The setting should be ${context.setting}.\nYou are an expert Primary 1 math question generator.\n MATH CONSTRAINTS:\n - Topic: Counting to 100 (Foundation Level - Tens and Ones)\n - Target Total: ${total}. CRITICAL INSTRUCTION: DO NOT write the number ${total} anywhere in the "questionText" story! The student must count the items visually. You should introduce the character, the items, and ask the student to count them.\n - Question: ${promptInstruction}\n - Final Answer MUST strictly be: "${expectedAnswer}"\n ${formatInstructions}\n CRITICAL VISUAL RULE: DO NOT modify the "visualEngine" block below. You MUST copy the "totalItems" number and the "items" array exactly as provided in the template.\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(getQText('[Insert full localized Singaporean word problem here]', `Count the ${selectedContextItem}. Write the total amount ${askForWord ? 'in words' : 'in numerals'}.`))},
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
            "items": ${JSON.stringify(Array(total).fill(selectedIcon))},
            "totalItems": ${total},
            "icon": "${selectedIcon}"
          }
        },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
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
    const answer = String(start + (step * 3));
    
    let optionsJSON = 'null';
    let defectMapJSON = 'null';
    if (isMCQ) {
      let options = [parseInt(answer) - 2, parseInt(answer) - 1, parseInt(answer), parseInt(answer) + 1].map(String);
      const defectMap = {};
      options.forEach(opt => { if (opt !== answer) defectMap[opt] = "CARELESS_CALCULATION"; });
      defectMapJSON = JSON.stringify(defectMap);
      optionsJSON = JSON.stringify(options.sort(() => Math.random() - 0.5));
    }
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a ${activeVariant} question. DO NOT modify the mathematical structure or the final answer.\nYou are an expert Primary 1 math question generator.\n MATH CONSTRAINTS:\n - Topic: Counting to 100 (Foundation Level - Number Sequence)
      - Sequence: ${sequence.join(", ")}
      - Final Answer MUST strictly be: "${answer}"
      
      ${formatInstructions}
      
      CRITICAL VISUAL RULE: DO NOT modify the "visualEngine" block below. You MUST copy the "sequence" array and the "rule" string exactly as provided in the template. Do not change them to match the final answer.\n OUTPUT FORMAT (Return ONLY valid JSON matching this schema):\n {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(getQText('Look at the numbers: ' + sequence.join(", ") + '. What number comes next?', sequence.slice(0, 3).join(", ") + ", ?"))},
          "options": ${optionsJSON},
          "defectMap": ${defectMapJSON},
          "hint": "[Insert conceptual hint here]",
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(`The numbers are counting ${isForward ? 'on' : 'back'} by 1. After ${sequence[2]}, the next number is ${answer}.`)}
        },
        "visualEngine": {
          "componentToRender": "NUMBER_PATTERN",
          "componentData": {
            "sequence": ["${sequence[0]}", "${sequence[1]}", "${sequence[2]}", "?"],
            "rule": "${isForward ? '+' : '-'}1"
          }
        },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty, steps: 1, logic: "simple_sequence", hideVisual: false }
    };
  }

  // 3. Number Words (Numeral <-> Word)
  if (activeVariant === 'foundation_number_words') {
    const number = Math.floor(Math.random() * 20) + 1;
    // using imported numberWords
    const chosenWord = numberWords[number];
    
    // Alternates between numeral-to-word and word-to-numeral
    const isToWord = Math.random() > 0.5;
    const questionPrompt = isToWord 
      ? `Write the number ${number} in words.` 
      : `Write the number word "${chosenWord}" as a numeral.`;
    const finalAnswer = isToWord ? chosenWord : String(number);
    
    let optionsJSON = 'null';
    let defectMapJSON = 'null';
    if (isMCQ) {
      const optionsValues = [number - 1, number, number + 1, number + 2].map(n => isToWord ? numberWords[n] || numberWords[20] : String(n));
      let options = Array.from(new Set(optionsValues)).slice(0, 4);
      while(options.length < 4) { options.push(isToWord ? numberWords[Math.floor(Math.random() * 20)] : String(Math.floor(Math.random() * 20))); options = Array.from(new Set(options)); }
      const defectMap = {};
      options.forEach(opt => { if (opt !== finalAnswer) defectMap[opt] = "CARELESS_CALCULATION"; });
      defectMapJSON = JSON.stringify(defectMap);
      optionsJSON = JSON.stringify(options.sort(() => Math.random() - 0.5));
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a foundation_number_words question.
        MATH CONSTRAINTS:
        - Target Number: ${number}
        - Target Word: "${chosenWord}"
        - Expected Final Answer Format: "${finalAnswer}"
        
        OUTPUT FORMAT (Return ONLY valid JSON matching this schema):
        {
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": ${JSON.stringify(getQText(questionPrompt, isToWord ? `${number} = ? (words)` : `"${chosenWord}" = ? (numeral)`))},
            "hint": ${JSON.stringify(getQText(isToWord ? "Spell out the number carefully." : "Write down the digits for this number word.", "Check the spelling or digits."))},
            "options": ${optionsJSON},
            "defectMap": ${defectMapJSON},
            "finalAnswer": "${finalAnswer}",
            "solutionSteps": ${JSON.stringify(getQText(isToWord ? `The number ${number} is written as "${chosenWord}".` : `The number word "${chosenWord}" is written as the numeral ${number}.`, "Match complete."))}
          },
          "visualEngine": { "componentToRender": "NONE", "componentData": {} },
          "inputRequirement": { "inputType": "STANDARD_TEXT" }
        }`,
      metadata: { difficulty, steps: 1, logic: "number_words", hideVisual: true }
    };
  }

  // 4. One More or One Less
  if (activeVariant === 'foundation_one_more_less') {
    const baseNumber = Math.floor(Math.random() * 18) + 2; // Range 2 to 19
    const isMore = Math.random() > 0.5;
    const answer = isMore ? baseNumber + 1 : baseNumber - 1;
    const dynamicOperator = isMore ? "1 more than" : "1 less than";
    
    let optionsJSON = 'null';
    let defectMapJSON = 'null';
    if (isMCQ) {
      const wrongAnswer = String(isMore ? baseNumber - 1 : baseNumber + 1);
      let options = Array.from(new Set([String(answer), wrongAnswer, String(answer + 1), String(answer - 1)])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);
      
      const defectMap = {
        [wrongAnswer]: "CONFUSED_OPERATION"
      };
      options.forEach(opt => { if (opt !== String(answer) && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
      defectMapJSON = JSON.stringify(defectMap);
      optionsJSON = JSON.stringify(options);
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a foundation_one_more_less question.
        MATH CONSTRAINTS:
        - Base Number: ${baseNumber}
        - Operation: ${dynamicOperator}
        - Final Answer MUST be: "${answer}"
        
        OUTPUT FORMAT (Return ONLY valid JSON matching this schema):
        {
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": ${JSON.stringify(getQText(`What is ${dynamicOperator} ${baseNumber}?`, `${dynamicOperator} ${baseNumber} = ?`))},
            "hint": ${JSON.stringify(getQText(isMore ? "Count forward by 1 step." : "Count backward by 1 step.", "Count 1 step."))},
            "options": ${optionsJSON},
            "defectMap": ${defectMapJSON},
            "finalAnswer": "${answer}",
            "solutionSteps": ${JSON.stringify(getQText(`Counting ${isMore ? 'forward' : 'backward'} 1 step from ${baseNumber} gives us ${answer}.`, `Result = ${answer}`))}
          },
          "visualEngine": { "componentToRender": "NONE", "componentData": {} },
          "inputRequirement": { "inputType": "STANDARD_TEXT" }
        }`,
      metadata: { difficulty, steps: 1, logic: "one_more_less", hideVisual: true }
    };
  }

  // 5. Order and Compare (Greatest/Smallest)
  if (activeVariant === 'foundation_order_compare') {
    // Generates 3 unique numbers within 20
    const nums = [];
    while(nums.length < 3) {
      const n = Math.floor(Math.random() * 20) + 1;
      if(!nums.includes(n)) nums.push(n);
    }
    
    const isGreatest = Math.random() > 0.5;
    const sorted = [...nums].sort((a, b) => a - b);
    const answer = String(isGreatest ? sorted[2] : sorted[0]);
    const targetLabel = isGreatest ? "greatest" : "smallest";
    
    let optionsJSON = 'null';
    let defectMapJSON = 'null';
    if (isMCQ) {
      let options = Array.from(new Set(nums.map(String))).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);
      
      const defectMap = {};
      options.forEach(opt => { if (opt !== String(answer)) defectMap[opt] = "CONCEPTUAL_ERROR"; });
      defectMapJSON = JSON.stringify(defectMap);
      optionsJSON = JSON.stringify(options);
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a foundation_order_compare question.
        MATH CONSTRAINTS:
        - Numbers given: ${nums.join(', ')}
        - Find the: ${targetLabel} number
        - Final Answer MUST be: "${answer}"
        
        CREATIVE INSTRUCTIONS:
        ${isShort || isStructure ? "- Generate an engaging word problem where a character has these quantities of items." : "- Keep it simple and direct."}
        - CRITICAL: You MUST explicitly ask "What is the ${targetLabel} NUMBER of items?". 
        - DO NOT ask "Which item has the ${targetLabel} amount?" or "Which fruit is the ${targetLabel}?", because the final answer is the numeric digit, NOT the name of the item.
        
        OUTPUT FORMAT (Return ONLY valid JSON matching this schema):
        {
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": ${JSON.stringify(getQText(`Look at these numbers: ${nums.join(', ')}. What is the ${targetLabel} number?`, `Find ${targetLabel}: ${nums.join(', ')}`))},
            "hint": ${JSON.stringify(getQText(`Compare the value of the numbers. Which one is the ${isGreatest ? 'biggest' : 'least'}?`, "Compare the numbers."))},
            "options": ${optionsJSON},
            "defectMap": ${defectMapJSON},
            "finalAnswer": "${answer}",
            "solutionSteps": ${JSON.stringify(getQText(`Comparing ${nums.join(', ')}, the ${targetLabel} number is ${answer}.`, `${targetLabel} = ${answer}`))}
          },
          "visualEngine": { "componentToRender": "NONE", "componentData": {} },
          "inputRequirement": { "inputType": "STANDARD_TEXT" }
        }`,
      metadata: { difficulty, steps: 1, logic: "order_compare", hideVisual: true }
    };
  }

  // 6. Visual Word Conversion
  if (activeVariant === 'foundation_visual_word_conversion') {
    const visual_count = Math.floor(Math.random() * 20) + 1; // 1-20
    const target_word_string = numberToWords(visual_count);
    
    // distractors for MCQ
    const distractors = [
      numberToWords(Math.max(1, visual_count - 1)),
      numberToWords(visual_count + 1),
      numberToWords(visual_count + 2)
    ];
    // filter out duplicates if visual_count is very low, though logic is fine
    const uniqueDistractors = [...new Set(distractors)];
    while (uniqueDistractors.length < 3) {
      uniqueDistractors.push(numberToWords(Math.floor(Math.random() * 20) + 1));
    }
    const options = isMCQ ? [target_word_string, ...uniqueDistractors.slice(0,3)].sort(() => Math.random() - 0.5) : null;
    let defectMap = null;
    if (isMCQ) {
      defectMap = {};
      options.forEach(opt => { if (opt !== target_word_string) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const itemPlural = context.items ? context.items[0]?.plural || selectedContextItem : 'items';

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`Count and write the number of ${itemPlural} in words.`, `Count and write the number of items in words.`),
        options: options,
        defectMap: defectMap,
        hint: "[AI: INJECT HINT]",
        finalAnswer: target_word_string,
        solutionSteps: `1. There are ${visual_count} items.\n2. The number ${visual_count} in words is '${target_word_string}'.`
      },
      visualEngine: {
        componentToRender: "ICON_GRID",
        componentData: { totalItems: visual_count, icon: selectedIcon }
      },
      inputRequirement: { inputType: isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT' }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      CRITICAL INSTRUCTION: You MUST NOT invent your own question, story, or visual component. You MUST output the EXACT JSON provided below. The ONLY thing you are allowed to change is replacing "[AI: INJECT HINT]" with a real hint. Do not change the "componentToRender", do not change the "componentData", and do not change the "questionText".
      
      EXACT OUTPUT REQUIRED:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'foundation', logic: "visual_word_conversion", hideVisual: false }
    };
  }

  // 7. Visual Set Comparison
  if (activeVariant === 'foundation_visual_set_comparison') {
    let set_a_count = Math.floor(Math.random() * 15) + 1; // 1-15
    let set_b_count = Math.floor(Math.random() * 15) + 1;
    while (set_a_count === set_b_count) {
      set_b_count = Math.floor(Math.random() * 15) + 1;
    }

    const isMore = Math.random() > 0.5;
    const targetLabel = isMore ? 'more' : 'fewer';
    
    let answer;
    if (isMore) {
      answer = set_a_count > set_b_count ? 'Set A' : 'Set B';
    } else {
      answer = set_a_count < set_b_count ? 'Set A' : 'Set B';
    }

    const itemPlural = context.items ? context.items[0]?.plural || selectedContextItem : 'items';
    const options = isMCQ ? ['Set A', 'Set B'] : null;
    let defectMap = null;
    if (isMCQ) {
      defectMap = {
        [answer === 'Set A' ? 'Set B' : 'Set A']: "CONCEPTUAL_ERROR"
      };
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`Look at the pictures. Which set has ${targetLabel} ${itemPlural}?`, `Which set has ${targetLabel} items?`),
        options: options,
        defectMap: defectMap,
        hint: "[AI: INJECT HINT]",
        finalAnswer: answer,
        solutionSteps: `1. Set A has ${set_a_count} items.\n2. Set B has ${set_b_count} items.\n3. Therefore, ${answer} has ${targetLabel} items.`
      },
      visualEngine: {
        componentToRender: "TWO_SET_COMPARISON",
        componentData: {
          setA: { count: set_a_count, icon: selectedIcon },
          setB: { count: set_b_count, icon: selectedIcon }
        }
      },
      inputRequirement: { inputType: isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT' }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      CRITICAL INSTRUCTION: You MUST NOT invent your own question, story, or visual component. You MUST output the EXACT JSON provided below. The ONLY thing you are allowed to change is replacing "[AI: INJECT HINT]" with a real hint. Do not change the "componentToRender", do not change the "componentData", and do not change the "questionText".
      
      EXACT OUTPUT REQUIRED:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'foundation', logic: "visual_set_comparison", hideVisual: false }
    };
  }

  throw new Error(`Variant '${activeVariant}' logic block not implemented in foundation.js.`);
}