import { numberToWords } from '@/lib/utils/math-helpers';

// Robust extraction helper for localized context objects
const extract = (val) => {
  if (typeof val !== 'object' || val === null) return String(val);
  return val.item || val.singular || val.name?.singular || val.text || val.val || String(val);
};

export const standardVariants = {
  standard_partition: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const num = Math.floor(Math.random() * 80) + 11;
    const tensVal = Math.floor(num / 10) * 10;
    const onesVal = num % 10;
    const answer = String(onesVal);

    let options = [...new Set([answer, String(tensVal), String(num), String(Math.floor(num / 10))])];
    while (options.length < 4) {
      options.push(String(Math.floor(Math.random() * 90) + 1));
      options = [...new Set(options)];
    }
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (isMCQ) {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        [String(tensVal)]: "CONCEPTUAL_ERROR",
        [String(num)]: "CONCEPTUAL_ERROR",
        [String(Math.floor(num / 10))]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a standard_partition question. DO NOT modify the mathematical structure or the final answer.
        ${formatInstructions}
        CRITICAL: Do NOT rewrite "questionText" as a word problem. Keep the exact text provided in the schema.
        MATH CONSTRAINTS:
        - Number: ${num}
        - Partition: ${num} = ${tensVal} + ?
        - Final Answer MUST strictly be: "${answer}"
        CRITICAL: If the question type is MCQ, the "options" array MUST be exactly: ${mcqOptions}. DO NOT modify its content or format.
        OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
        {
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": ${JSON.stringify(getQText(`Fill in the missing number: ${num} = ${tensVal} + ____`, `${num} = ${tensVal} + ?`))},
            "options": ${mcqOptions},
            "defectMap": ${defectMapStr},
            "hint": ${JSON.stringify(getQText(`Think of the number ${num}. It is made up of ${tensVal} and another part. Subtract ${tensVal} from ${num} to find it.`, `What is ${num} minus ${tensVal}?`))},
            "finalAnswer": "${answer}",
            "solutionSteps": ${JSON.stringify(getQText(`${num} is made of ${tensVal} and ${onesVal}.`, `${num} - ${tensVal} = ${answer}`))}
          },
          "visualEngine": { 
            "componentToRender": "BASE_TEN_BLOCKS", 
            "componentData": { "tens": ${Math.floor(num/10)}, "ones": ${onesVal} } 
          },
          "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "partition", hideVisual: false }
    };
  },
  standard_basic_regrouping: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const tens = Math.floor(Math.random() * 4) + 1;
    const ones = Math.floor(Math.random() * 9) + 11;
    const num = (tens * 10) + ones;
    const answer = String(num);

    let options = [...new Set([answer, String(tens + ones), String((tens * 10) + (ones % 10)), String(num + 10)])];
    while (options.length < 4) {
      options.push(String(Math.floor(Math.random() * 90) + 1));
      options = [...new Set(options)];
    }
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (isMCQ) {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        [String(tens + ones)]: "CONFUSED_OPERATION",
        [String((tens * 10) + (ones % 10))]: "CONCEPTUAL_ERROR",
        [String(num + 10)]: "CARELESS_CALCULATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a standard_basic_regrouping question. DO NOT modify the mathematical structure or the final answer.
        ${formatInstructions}
        CRITICAL: Do NOT rewrite "questionText" as a word problem. Keep the exact text provided in the schema.
        MATH CONSTRAINTS:
        - Input: ${tens} tens ${ones} ones.
        - Final Answer MUST strictly be: "${answer}"
        CRITICAL: If the question type is MCQ, the "options" array MUST be exactly: ${mcqOptions}. DO NOT modify its content or format.
        OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
        {
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": ${JSON.stringify(getQText(`What number is the same as ${tens} tens and ${ones} ones?`, `${tens} tens + ${ones} ones = ?`))},
            "options": ${mcqOptions},
            "defectMap": ${defectMapStr},
            "hint": ${JSON.stringify(getQText(`Change the ${tens} tens into a number first. Then add the ${ones} ones to it.`, `${tens * 10} + ${ones} = ?`))},
            "finalAnswer": "${answer}",
            "solutionSteps": ${JSON.stringify(getQText(`${tens} tens is ${tens * 10}. ${tens * 10} + ${ones} = ${num}.`, `${tens * 10} + ${ones} = ${num}`))}
          },
          "visualEngine": { 
            "componentToRender": "BASE_TEN_BLOCKS", 
            "componentData": { "tens": ${tens}, "ones": ${ones} } 
          },
          "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "regrouping", hideVisual: false }
    };
  },
  standard_partition_tens: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const num = Math.floor(Math.random() * 80) + 11;
    const tensVal = Math.floor(num / 10) * 10;
    const onesVal = num % 10;
    const answer = String(tensVal);

    let options = [...new Set([answer, String(onesVal), String(num), String(num - 10)])];
    while (options.length < 4) {
      options.push(String(Math.floor(Math.random() * 9) * 10 + 10));
      options = [...new Set(options)];
    }
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (isMCQ) {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        [String(onesVal)]: "CONCEPTUAL_ERROR",
        [String(num)]: "CONCEPTUAL_ERROR",
        [String(num - 10)]: "CARELESS_CALCULATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a standard_partition_tens question. DO NOT modify the mathematical structure or the final answer.
        ${formatInstructions}
        CRITICAL: Do NOT rewrite "questionText" as a word problem. Keep the exact text provided in the schema.
        MATH CONSTRAINTS:
        - Number: ${num}
        - Partition: ${num} = ? + ${onesVal}
        - Final Answer MUST strictly be: "${answer}"
        CRITICAL: If the question type is MCQ, the "options" array MUST be exactly: ${mcqOptions}. DO NOT modify its content or format.
        OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
        {
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": ${JSON.stringify(getQText(`What is the missing value? ${num} = ____ + ${onesVal}`, `${num} = ? + ${onesVal}`))},
            "options": ${mcqOptions},
            "defectMap": ${defectMapStr},
            "hint": ${JSON.stringify(getQText(`If you take away the ${onesVal} ones from ${num}, how many tens value are you left with?`, `${num} - ${onesVal} = ?`))},
            "finalAnswer": "${answer}",
            "solutionSteps": ${JSON.stringify(getQText(`${num} is ${tensVal} and ${onesVal}. The missing part is ${tensVal}.`, `${num} - ${onesVal} = ${answer}`))}
          },
          "visualEngine": { 
            "componentToRender": "BASE_TEN_BLOCKS", 
            "componentData": { "tens": ${Math.floor(num/10)}, "ones": ${onesVal} } 
          },
          "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "partition_tens", hideVisual: false }
    };
  },
  standard_word_problem_groups: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const num = Math.floor(Math.random() * 40) + 20;
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    const sItem = extract(context?.items?.[0] || 'marbles');
    const sName = extract(context?.name || 'Bala');
    const answer = String(tens);

    let options = [...new Set([answer, String(tens + ones), String(ones), String(num)])];
    while (options.length < 4) {
      options.push(String(Math.floor(Math.random() * 9) + 1));
      options = [...new Set(options)];
    }
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (isMCQ) {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        [String(tens + ones)]: "CONFUSED_OPERATION",
        [String(ones)]: "CONCEPTUAL_ERROR",
        [String(num)]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a standard_word_problem_groups question. DO NOT modify the mathematical structure or the final answer. Use the name ${sName}.
        MATH CONSTRAINTS:
        - Total ${sItem}: ${num}
        - Question: How many bundles of 10 can be made?
        - Final Answer MUST strictly be: "${answer}"
        CRITICAL: If the question type is MCQ, the "options" array MUST be exactly: ${mcqOptions}. DO NOT modify its content or format.
        OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
        {
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": ${JSON.stringify(getQText(`${sName} has ${num} ${sItem}. If he puts them in groups of 10, how many groups will he have?`, `${num} = ? groups of 10 + ${ones} left`))},
            "options": ${mcqOptions},
            "defectMap": ${defectMapStr},
            "hint": ${JSON.stringify(getQText(`Try circling groups of 10 items. How many groups can you circle?`, `Count how many tens are in ${num}.`))},
            "finalAnswer": "${answer}",
            "solutionSteps": ${JSON.stringify(getQText(`${num} has ${tens} tens, so he can make ${tens} groups of 10.`, `${num} = ${tens} tens and ${ones} ones`))}
          },
          "visualEngine": { 
            "componentToRender": "BASE_TEN_BLOCKS", 
            "componentData": { "tens": 0, "ones": ${num} } 
          },
          "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "grouping_word_problem", hideVisual: false }
    };
  },
  standard_compare_place_value: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    let n1_tens, n1_ones, n2_tens, n2_ones, num1, num2;
    do {
      n1_tens = Math.floor(Math.random() * 5) + 1; // 1 to 5 tens
      n1_ones = Math.floor(Math.random() * 20);    // 0 to 19 ones
      n2_tens = Math.floor(Math.random() * 5) + 1; // 1 to 5 tens
      n2_ones = Math.floor(Math.random() * 20);    // 0 to 19 ones
      num1 = (n1_tens * 10) + n1_ones;
      num2 = (n2_tens * 10) + n2_ones;
    } while (num1 === num2);

    const askGreater = Math.random() > 0.5;
    const targetWord = askGreater ? "greater" : "smaller";
    const answer = (askGreater ? num1 > num2 : num1 < num2) ? `${n1_tens} tens ${n1_ones} ones` : `${n2_tens} tens ${n2_ones} ones`;
    const distractors = [
      answer === `${n1_tens} tens ${n1_ones} ones` ? `${n2_tens} tens ${n2_ones} ones` : `${n1_tens} tens ${n1_ones} ones`,
      `${n1_tens} tens ${n2_ones} ones`,
      `${n2_tens} tens ${n1_ones} ones`
    ];
    let options = [...new Set([answer, ...distractors])];
    while (options.length < 4) {
      const rTens = Math.floor(Math.random() * 9) + 1;
      options.push(`${rTens} tens ${Math.floor(Math.random() * 9)} ones`);
      options = [...new Set(options)];
    }
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (isMCQ) {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      distractors.forEach(d => defectMapObj[d] = "CONCEPTUAL_ERROR");
      options.forEach(opt => { if (opt !== answer && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator.
      ${formatInstructions}

      CRITICAL: This is a text-only conceptual comparison. Do NOT include a "visualEngine" block with blocks or icons. No icon rendering is allowed.

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(getQText(`Which is ${targetWord}: ${n1_tens} tens ${n1_ones} ones or ${n2_tens} tens ${n2_ones} ones?`, `Which is ${targetWord}: ${n1_tens} tens ${n1_ones} ones or ${n2_tens} tens ${n2_ones} ones?`))},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": "Convert both sets into numbers first. For example, ${n1_tens} tens and ${n1_ones} ones is ${num1}.",
          "finalAnswer": "${answer}",
          "solutionSteps": "${n1_tens} tens ${n1_ones} ones is ${num1}. ${n2_tens} tens ${n2_ones} ones is ${num2}. Since ${num1 > num2 ? num1 : num2} is bigger than ${num1 < num2 ? num1 : num2}, the ${targetWord} value is ${answer}."
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "compare_place_value", hideVisual: true }
    };
  },
  standard_add_tens_concept: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const start = Math.floor(Math.random() * 50) + 10;
    const addTens = Math.floor(Math.random() * 3) + 1;
    const answer = String(start + (addTens * 10));

    let options = [...new Set([answer, String(start + addTens), String(Number(answer) - 10), String(start)])];
    while (options.length < 4) {
      options.push(String(Math.floor(Math.random() * 90) + 1));
      options = [...new Set(options)];
    }
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (isMCQ) {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        [String(start + addTens)]: "CONCEPTUAL_ERROR",
        [String(start)]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a standard_add_tens_concept question. DO NOT modify the mathematical structure or the final answer.
        MATH CONSTRAINTS:
        - Starting number: ${start}
        - Add: ${addTens} tens
        - Final Answer MUST strictly be: "${answer}"
        CRITICAL: If the question type is MCQ, the "options" array MUST be exactly: ${mcqOptions}. DO NOT modify its content or format.
        OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
        {
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": ${JSON.stringify(getQText(`Add ${addTens} tens to ${start}. What is the new number?`, `${start} + ${addTens} tens = ?`))},
            "options": ${mcqOptions},
            "defectMap": ${defectMapStr},
            "hint": ${JSON.stringify(getQText(`Look at the tens digit. If you add ${addTens} tens, only the tens digit will change.`, `Only the tens digit increases by ${addTens}.`))},
            "finalAnswer": "${answer}",
            "solutionSteps": ${JSON.stringify(getQText(`${addTens} tens is ${addTens * 10}. ${start} + ${addTens * 10} = ${answer}.`, `${start} + ${addTens * 10} = ${answer}`))}
          },
          "visualEngine": { 
            "componentToRender": "BASE_TEN_BLOCKS", 
            "componentData": { "tens": ${Math.floor(start/10)}, "ones": ${start%10} } 
          },
          "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "add_tens", hideVisual: false }
    };
  },
  standard_subtract_tens_concept: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const start = Math.floor(Math.random() * 40) + 50;
    const subTens = Math.floor(Math.random() * 3) + 1;
    const answer = String(start - (subTens * 10));

    let options = [...new Set([answer, String(start - subTens), String(Number(answer) + 10), String(start)])];
    while (options.length < 4) {
      options.push(String(Math.floor(Math.random() * 90) + 1));
      options = [...new Set(options)];
    }
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (isMCQ) {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        [String(start - subTens)]: "CONCEPTUAL_ERROR",
        [String(start)]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a standard_subtract_tens_concept question. DO NOT modify the mathematical structure or the final answer.
        MATH CONSTRAINTS:
        - Starting number: ${start}
        - Subtract: ${subTens} tens
        - Final Answer MUST strictly be: "${answer}"
        CRITICAL: If the question type is MCQ, the "options" array MUST be exactly: ${mcqOptions}. DO NOT modify its content or format.
        OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
        {
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": ${JSON.stringify(getQText(`Subtract ${subTens} tens from ${start}. What is the new number?`, `${start} - ${subTens} tens = ?`))},
            "options": ${mcqOptions},
            "defectMap": ${defectMapStr},
            "hint": ${JSON.stringify(getQText(`Look at the tens digit. If you subtract ${subTens} tens, only the tens digit will decrease.`, `Only the tens digit decreases by ${subTens}.`))},
            "finalAnswer": "${answer}",
            "solutionSteps": ${JSON.stringify(getQText(`${subTens} tens is ${subTens * 10}. ${start} - ${subTens * 10} = ${answer}.`, `${start} - ${subTens * 10} = ${answer}`))}
          },
          "visualEngine": { 
            "componentToRender": "BASE_TEN_BLOCKS", 
            "componentData": { "tens": ${Math.floor(start/10)}, "ones": ${start%10} } 
          },
          "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "sub_tens", hideVisual: false }
    };
  },
  standard_digit_clue: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const t = Math.floor(Math.random() * 8) + 1;
    const o = Math.floor(Math.random() * 9);
    const answer = String((t * 10) + o);

    let options = [...new Set([answer, String((o * 10) + t), String(t + o), String(t * 10)])];
    while (options.length < 4) {
      options.push(String(Math.floor(Math.random() * 90) + 10));
      options = [...new Set(options)];
    }
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (isMCQ) {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        [String((o * 10) + t)]: "CONCEPTUAL_ERROR",
        [String(t + o)]: "CONFUSED_OPERATION",
        [String(t * 10)]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator.
      ${formatInstructions}

      CRITICAL: This is a text-only conceptual puzzle. Do NOT include a "visualEngine" block with blocks or icons. No icon rendering is allowed.

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(getQText(`I am a 2-digit number. My tens digit is ${t} and my ones digit is ${o}. What number am I?`, `2-digit number: Tens digit is ${t}, ones digit is ${o}?`))},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": "The digit on the left is tens and the digit on the right is ones.",
          "finalAnswer": "${answer}",
          "solutionSteps": "Combining ${t} tens and ${o} ones gives ${answer}."
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "digit_clue", hideVisual: true }
    };
  },
  standard_expanded_form: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const num = Math.floor(Math.random() * 89) + 10;
    const t = Math.floor(num / 10) * 10;
    const o = num % 10;
    const answer = `${t} + ${o}`;

    let options = [...new Set([answer, `${o} + ${t}`, `${t} + ${o + 1}`, String(num)])];
    while (options.length < 4) {
      options.push(`${Math.floor(Math.random() * 9) * 10} + ${Math.floor(Math.random() * 9)}`);
      options = [...new Set(options)];
    }
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (isMCQ) {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        [`${o} + ${t}`]: "CONCEPTUAL_ERROR",
        [String(num)]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator.
      ${formatInstructions}

      CRITICAL: This is a text-only conceptual puzzle. Do NOT include a "visualEngine" block with blocks or icons. No icon rendering is allowed.

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(getQText(`Write ${num} in expanded form.`, `Expanded form of ${num} = ?`))},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": "How many tens are in ${num}? What is their value?",
          "finalAnswer": "${answer}",
          "solutionSteps": "${num} is ${t} plus ${o}."
        },
        "visualEngine": { "componentToRender": "NONE", "componentData": {} },
        "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "expanded_form", hideVisual: true }
    };
  },
  standard_equivalent_ones: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const tens = Math.floor(Math.random() * 9) + 1;
    const answer = String(tens * 10);

    let options = [...new Set([answer, String(tens), String(tens + 10), String(tens * 100)])];
    while (options.length < 4) {
      options.push(String(Math.floor(Math.random() * 9) * 10));
      options = [...new Set(options)];
    }
    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (isMCQ) {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {
        [String(tens)]: "CONCEPTUAL_ERROR",
        [String(tens * 100)]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMapObj[opt]) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a standard_equivalent_ones question. DO NOT modify the mathematical structure or the final answer.
        MATH CONSTRAINTS:
        - Input: ${tens} tens
        - Final Answer MUST strictly be: "${answer}"
        CRITICAL: If the question type is MCQ, the "options" array MUST be exactly: ${mcqOptions}. DO NOT modify its content or format.
        OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
        {
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": ${JSON.stringify(getQText(`${tens} tens is the same as ____ ones.`, `${tens} tens = ? ones`))},
            "options": ${mcqOptions},
            "defectMap": ${defectMapStr},
            "hint": ${JSON.stringify(getQText(`Each ten is equal to 10 ones. Count by tens for each bar you see.`, `1 ten = 10 ones.`))},
            "finalAnswer": "${answer}",
            "solutionSteps": ${JSON.stringify(getQText(`1 ten is 10 ones, so ${tens} tens is ${answer} ones.`, `${tens} * 10 = ${answer}`))}
          },
          "visualEngine": { 
            "componentToRender": "BASE_TEN_BLOCKS", 
            "componentData": { "tens": ${tens}, "ones": 0 } 
          },
          "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "equivalence", hideVisual: false }
    };
  },
  standard_mixed_representation_audit: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    let target_number = Math.floor(Math.random() * 89) + 11;
    while (target_number % 10 === 0) {
      target_number = Math.floor(Math.random() * 89) + 11;
    }
    
    const tens = Math.floor(target_number / 10);
    const ones = target_number % 10;
    
    const valid1 = `${tens * 10} + ${ones}`;
    const valid2 = `${tens} tens ${ones} ones`;
    const valid3 = numberToWords(target_number);
    
    const distractorIsReversed = Math.random() > 0.5;
    const distractor = distractorIsReversed ? `${ones} tens ${tens} ones` : `${tens} + ${ones}`;
    
    const items = [valid1, valid2, valid3, distractor].sort(() => Math.random() - 0.5);
    const labels = ['A', 'B', 'C', 'D'];
    
    const distractorIndex = items.indexOf(distractor);
    const distractorLetter = labels[distractorIndex];
    
    const mcqOptions = JSON.stringify(items);
    
    let questionTextStr;
    let finalAnswerStr;
    
    if (isMCQ) {
      questionTextStr = `Which of the following is NOT the same as ${target_number}?`;
      finalAnswerStr = distractor;
    } else {
      questionTextStr = `Which of the following is NOT the same as ${target_number}?\n(A) ${items[0]}\n(B) ${items[1]}\n(C) ${items[2]}\n(D) ${items[3]}`;
      finalAnswerStr = distractorLetter;
    }

    let defectMapStr = 'null';
    if (isMCQ) {
      let defectMapObj = {};
      items.forEach(opt => { if (opt !== finalAnswerStr) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }
    
    return {
      aiPrompt: `STRICT VARIANT MANDATE: You are generating a standard_mixed_representation_audit question. DO NOT modify the mathematical structure or the final answer.
        MATH CONSTRAINTS:
        - Target Number: ${target_number}
        - Final Answer MUST strictly be: "${finalAnswerStr}"
        OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
        {
          "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
          "content": {
            "questionText": ${JSON.stringify(getQText(questionTextStr, questionTextStr))},
            "options": ${isMCQ ? mcqOptions : 'null'},
            "defectMap": ${defectMapStr},
            "hint": ${JSON.stringify(getQText(`Read each option carefully. Three of them are correct ways to write ${target_number}. One is wrong.`, `Check each form.`))},
            "finalAnswer": "${finalAnswerStr}",
            "solutionSteps": ${JSON.stringify(getQText(`The wrong representation is ${distractor}. ${target_number} is correctly written as ${valid2}, ${valid1}, or '${valid3}'.`, `${distractor} is incorrect.`))}
          },
          "visualEngine": { "componentToRender": "NONE", "componentData": {} },
          "inputRequirement": { "inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
        }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "mixed_representation_audit", hideVisual: true }
    };
  }
};

export const standardLogic = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
  if (standardVariants[activeVariant]) {
    return standardVariants[activeVariant](config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
  }
  return null;
};