import { numberToWords } from '@/lib/utils/math-helpers';

// Robust extraction helper for localized context objects
const extract = (val) => {
  if (typeof val !== 'object' || val === null) return String(val);
  return val.item || val.singular || val.name?.singular || val.text || val.val || String(val);
};

export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, hideVisual, supportsStructured) {
  const commonMeta = { 
    level, 
    topic, 
    subtopic: 'Multiplication and Division',
    type: zodType, 
    difficulty: zodDiff,
    strand: 'Number and Algebra',
    subject: 'Math',
    gradeLevel: 'P1',
    heuristic: activeVariant.replace('standard_', '').split('_').join(' ')
  };
  const inputType = isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT';
  const isShortQ = zodType === 'SHORT_QUESTION';
  const itemLabel = extract(selectedContextItem);

  const levelNum = parseInt(level.replace('Primary ', ''));
  const readingMandate = levelNum <= 2 
    ? "STRICT READING LEVEL: Use sentences with maximum 10-12 words. Use simple nouns and verbs (Sight Words). No words with more than 2 syllables."
    : (levelNum >= 5 
        ? "ADVANCED READING LEVEL: You may use complex sentences and technical Singaporean context (e.g., GST, interest rates, or logistics). Use a professional, descriptive tone."
        : "");

  // 1. Repeated Addition Convert
  if (activeVariant === 'standard_repeated_addition_convert') {
    const num = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
    const count = Math.floor(Math.random() * 3) + 3; // 3 to 5
    const additionStr = Array(count).fill(num).join(' + ');
    const answer = String(count);

    let defectMap = null;
    let options = null;
    if (isMCQ) {
      options = Array.from(new Set([answer, String(num), String(count * num), String(count + 1)])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [String(num)]: "CONCEPTUAL_ERROR",
        [String(count * num)]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How many groups of ${num} are there in the addition?`, `${additionStr} = ? x ${num}`, zodType),
        options: options,
        defectMap: defectMap,
        hint: "[AI: PROVIDE A CONCEPTUAL HINT]",
        finalAnswer: answer,
        solutionSteps: `1. ${additionStr} is ${num} added ${count} times.\n2. This is ${count} groups of ${num}.\n3. Therefore, ${additionStr} = ${count} x ${num}.`
      },
      visualEngine: {
        componentToRender: isShortQ ? "NUMBER_CARDS" : "NONE",
        componentData: isShortQ ? { items: [additionStr, "=", "?", "x", String(num)] } : {}
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      IMPORTANT: For story questions, DO NOT include the mathematical equation (e.g., 3 x $10 = ?) in the questionText.
      ${isShortQ 
        ? `STRICT: Provide a direct mathematical question. NO story context or names.` 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a creative localized Singaporean story involving ${count} repeated groups of ${num} ${itemLabel} (visually represented by the emoji "${selectedIcon}").`
      }

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'standard', logic: "repeated_addition_convert", hideVisual: hideVisual }
    };
  }

  // 2. Array Rows and Columns
  if (activeVariant === 'standard_array_rows_cols') {
    const rows = Math.floor(Math.random() * 3) + 2;
    const cols = Math.floor(Math.random() * 4) + 3;
    const answer = String(rows * cols);

    let defectMap = null;
    let options = null;
    if (isMCQ) {
      options = Array.from(new Set([answer, String(rows + cols), String(parseInt(answer) + 2), String(parseInt(answer) - 5)])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [String(rows + cols)]: "CONFUSED_OPERATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How many ${itemLabel} are there altogether?`, `${rows} x ${cols} = ?`, zodType),
        options: options,
        defectMap: defectMap,
        hint: "[AI: PROVIDE A CONCEPTUAL HINT]",
        finalAnswer: answer,
        solutionSteps: `1. There are ${rows} rows with ${cols} in each row.\n2. ${rows} x ${cols} = ${answer}.`
      },
      visualEngine: {
        componentToRender: isShortQ ? "NUMBER_CARDS" : "NONE",
        componentData: isShortQ ? { items: [String(rows), "x", String(cols), "=", "?"] } : {}
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      IMPORTANT: For story questions, DO NOT include the mathematical equation (e.g., 3 x $10 = ?) in the questionText.
      ${isShortQ 
        ? 'STRICT: Provide a direct mathematical equation. NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a creative localized Singaporean story involving ${rows} rows with ${cols} ${itemLabel} in each row (represented by the emoji "${selectedIcon}"). DO NOT use the words "array" or "columns".`
      }

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'standard', logic: "array_logic", hideVisual: hideVisual }
    };
  }

  // 3. Comparison (Times as many)
  if (activeVariant === 'standard_comparison_times_as_many') {
    const startVal = Math.floor(Math.random() * 5) + 2; 
    const times = Math.floor(Math.random() * 3) + 2; 
    const answer = String(startVal * times);

    let defectMap = null;
    let options = null;
    if (isMCQ) {
      options = Array.from(new Set([answer, String(startVal + times), String(startVal), String(parseInt(answer) + 5)])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [String(startVal + times)]: "CONFUSED_OPERATION",
        [String(startVal)]: "CONSTANT_VIOLATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How many ${itemLabel} does the second person have?`, `${times} x ${startVal} = ?`, zodType),
        options: options,
        defectMap: defectMap,
        hint: "[AI: PROVIDE A CONCEPTUAL HINT]",
        finalAnswer: answer,
        solutionSteps: `1. ${times} times as many as ${startVal} means we multiply by ${times}.\n2. ${times} x ${startVal} = ${answer}.`
      },
      visualEngine: {
        componentToRender: isShortQ ? "NUMBER_CARDS" : "NONE",
        componentData: isShortQ ? { items: [String(times), "x", String(startVal), "=", "?"] } : {}
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      IMPORTANT: For story questions, DO NOT include the mathematical equation (e.g., 3 x $10 = ?) in the questionText.
      ${isShortQ 
        ? 'STRICT: Provide a direct mathematical equation. NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a localized Singaporean story where one person has ${startVal} ${itemLabel} (represented by the emoji "${selectedIcon}") and another has ${times} times as many.`
      }

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'standard', logic: "comparison_times", hideVisual: hideVisual }
    };
  }

  // 4. Skip Count Total
  if (activeVariant === 'standard_skip_count_total') {
    const step = [2, 5, 10][Math.floor(Math.random() * 3)];
    const groups = Math.floor(Math.random() * 4) + 3;
    const answer = String(groups * step);

    let defectMap = null;
    let options = null;
    if (isMCQ) {
      options = Array.from(new Set([answer, String(parseInt(answer) - step), String(parseInt(answer) + step), String(groups)])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [String(groups)]: "CONSTANT_VIOLATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] If you skip count by ${step} for ${groups} jumps, what is the total?`, `${groups} x ${step} = ?`, zodType),
        options: options,
        defectMap: defectMap,
        hint: "[AI: PROVIDE A CONCEPTUAL HINT]",
        finalAnswer: answer,
        solutionSteps: `1. Counting by ${step} for ${groups} times: ${Array.from({length: groups}, (_, i) => (i + 1) * step).join(', ')}.\n2. The total is ${answer}.`
      },
      visualEngine: {
        componentToRender: isShortQ ? "NUMBER_CARDS" : "NONE",
        componentData: isShortQ ? { items: [String(groups), "x", String(step), "=", "?"] } : {}
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      IMPORTANT: For story questions, DO NOT include the mathematical equation (e.g., 3 x $10 = ?) in the questionText.
      ${isShortQ 
        ? 'STRICT: Provide a direct mathematical equation. NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a localized Singaporean story involving ${groups} groups of ${itemLabel} (represented by the emoji "${selectedIcon}"), requiring skip-counting by ${step}.`
      }

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'standard', logic: "skip_count", hideVisual: hideVisual }
    };
  }

  // 5. Unit Price Calc
  if (activeVariant === 'standard_unit_price_calc') {
    const qty = Math.floor(Math.random() * 4) + 2; 
    const price = [2, 5, 10][Math.floor(Math.random() * 3)]; 
    const answer = String(qty * price);

    let defectMap = null;
    let options = null;
    if (isMCQ) {
      options = Array.from(new Set([answer, String(qty + price), String(parseInt(answer) - price), String(parseInt(answer) + 10)])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [String(qty + price)]: "CONFUSED_OPERATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How much does ${context.name} pay in total?`, `${qty} x $${price} = ?`, zodType),
        options: options,
        defectMap: defectMap,
        hint: "[AI: PROVIDE A CONCEPTUAL HINT]",
        finalAnswer: answer,
        solutionSteps: `1. Each item costs $${price}.\n2. For ${qty} items, we calculate ${qty} x ${price} = ${answer}.`
      },
      visualEngine: {
        componentToRender: isShortQ ? "NUMBER_CARDS" : "NONE",
        componentData: isShortQ ? { items: [String(qty), "x", `$${price}`] } : {}
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      IMPORTANT: For story questions, DO NOT include the mathematical equation (e.g., 3 x $10 = ?) in the questionText.
      ${isShortQ 
        ? 'STRICT: Provide a direct mathematical equation. NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a localized Singaporean story where ${extract(context.name)} buys ${qty} ${extract(selectedContextItem)} at $${price} each.`
      }

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'standard', logic: "unit_price", hideVisual: hideVisual }
    };
  }

  // 6. Sharing (Missing Each)
  if (activeVariant === 'standard_sharing_missing_each') {
    const groups = Math.floor(Math.random() * 3) + 2; 
    const each = Math.floor(Math.random() * 4) + 2; 
    const total = groups * each;
    const answer = String(each);

    let defectMap = null;
    let options = null;
    if (isMCQ) {
      options = Array.from(new Set([answer, String(total), String(groups), String(each + 1)])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [String(total)]: "CONSTANT_VIOLATION",
        [String(groups)]: "CONSTANT_VIOLATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How many ${itemLabel} does each person get?`, `${total} ÷ ${groups} = ?`, zodType),
        options: options,
        defectMap: defectMap,
        hint: "[AI: PROVIDE A CONCEPTUAL HINT]",
        finalAnswer: answer,
        solutionSteps: `1. Sharing ${total} items among ${groups} people means we divide by ${groups}.\n2. ${total} ÷ ${groups} = ${answer} each.`
      },
      visualEngine: {
        componentToRender: isShortQ ? "NUMBER_CARDS" : "NONE",
        componentData: isShortQ ? { items: [String(total), "÷", String(groups), "=", "?"] } : {}
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      IMPORTANT: For story questions, DO NOT include the mathematical equation (e.g., 3 x $10 = ?) in the questionText.
      ${isShortQ 
        ? 'STRICT: Provide a direct mathematical equation. NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a localized Singaporean story where ${total} ${itemLabel} (represented by the emoji "${selectedIcon}") are shared equally among ${groups} people.`
      }

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'standard', logic: "sharing_each", hideVisual: hideVisual }
    };
  }

  // 7. Grouping (Missing Groups)
  if (activeVariant === 'standard_grouping_missing_groups') {
    const size = Math.floor(Math.random() * 3) + 2; 
    const groups = Math.floor(Math.random() * 4) + 2; 
    const total = groups * size;
    const answer = String(groups);
    
    let defectMap = null;
    let options = null;
    if (isMCQ) {
      options = Array.from(new Set([answer, String(total), String(size), String(groups + 1)])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [String(total)]: "CONSTANT_VIOLATION",
        [String(size)]: "CONSTANT_VIOLATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How many groups can ${context.name} make?`, `${total} ÷ ${size} = ?`, zodType),
        options: options,
        defectMap: defectMap,
        hint: "[AI: PROVIDE A CONCEPTUAL HINT]",
        finalAnswer: answer,
        solutionSteps: `1. Putting ${total} items into groups of ${size} means we divide by ${size}.\n2. ${total} ÷ ${size} = ${answer} groups.`
      },
      visualEngine: {
        componentToRender: isShortQ ? "NUMBER_CARDS" : "NONE",
        componentData: isShortQ ? { items: [String(total), "÷", String(size), "=", "?"] } : {}
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      IMPORTANT: For story questions, DO NOT include the mathematical equation (e.g., 3 x $10 = ?) in the questionText.
      ${isShortQ 
        ? 'STRICT: Provide a direct mathematical equation. NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a unique localized Singaporean story where ${extract(context.name)} has ${total} ${itemLabel} (visually represented by "${selectedIcon}") and organizes them into groups of ${size}.`
      }

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'standard', logic: "grouping_groups", hideVisual: hideVisual }
    };
  }

  // 8. Inverse Fact Families
  if (activeVariant === 'standard_inverse_fact_families') {
    const n1 = Math.floor(Math.random() * 4) + 2;
    const n2 = Math.floor(Math.random() * 4) + 2;
    const prod = n1 * n2;
    const answer = String(n1);

    let defectMap = null;
    let options = null;
    if (isMCQ) {
      options = Array.from(new Set([answer, String(n2), String(prod), String(n1 + n2)])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [String(n2)]: "CONSTANT_VIOLATION",
        [String(prod)]: "CONSTANT_VIOLATION",
        [String(n1 + n2)]: "CONFUSED_OPERATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] If ${n1} x ${n2} = ${prod}, what is ${prod} ÷ ${n2}?`, `If ${n1} x ${n2} = ${prod}, then ${prod} ÷ ${n2} = ?`, zodType),
        options: options,
        defectMap: defectMap,
        hint: "[AI: PROVIDE A CONCEPTUAL HINT]",
        finalAnswer: answer,
        solutionSteps: `1. Division is the opposite of multiplication.\n2. Since ${n1} x ${n2} = ${prod}, it follows that ${prod} ÷ ${n2} = ${n1}.`
      },
      visualEngine: {
        componentToRender: "NONE",
        componentData: {}
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      IMPORTANT: For story questions, DO NOT include the mathematical equation (e.g., 3 x $10 = ?) in the questionText.
      ${isShortQ 
        ? 'STRICT: Provide a direct mathematical equation using fact families. NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a creative localized Singaporean story about fact families involving ${itemLabel} (represented by "${selectedIcon}").`
      }

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'standard', logic: "inverse_fact", hideVisual: hideVisual }
    };
  }

  // 9. Even/Odd Sharing
  if (activeVariant === 'standard_even_odd_sharing') {
    const total = Math.floor(Math.random() * 15) + 5;
    const isEven = total % 2 === 0;
    const answer = isEven ? "Yes" : "No";

    let defectMap = null;
    if (isMCQ) {
      defectMap = {
        [answer === "Yes" ? "No" : "Yes"]: "CONCEPTUAL_ERROR"
      };
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] Can ${context.name} share these ${itemLabel} equally between 2 friends without any left over?`, `Can ${total} be shared equally into 2 groups?`, zodType),
        options: ["Yes", "No"],
        defectMap: defectMap,
        hint: "[AI: PROVIDE A CONCEPTUAL HINT]",
        finalAnswer: answer,
        solutionSteps: `1. ${total} is an ${isEven ? 'even' : 'odd'} number.\n2. ${isEven ? 'Even numbers can be shared equally into 2 groups.' : 'Odd numbers will always have 1 left over when shared into 2 groups.'}`
      },
      visualEngine: {
        componentToRender: "NONE",
        componentData: {}
      },
      inputRequirement: { inputType: 'MCQ_BUTTONS' }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      IMPORTANT: For story questions, DO NOT include the mathematical equation (e.g., 3 x $10 = ?) in the questionText.
      ${isShortQ 
        ? 'STRICT: Provide a direct mathematical question. NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a unique localized Singaporean story where ${extract(context.name)} tries to share ${total} ${itemLabel} (represented by "${selectedIcon}") equally with 2 friends.`
      }

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'standard', logic: "even_odd", hideVisual: hideVisual }
    };
  }

  // 10. Attribute Multiplication
  if (activeVariant === 'standard_attribute_multiplication') {
    const scenarios = [
      { type: "bicycles", attr: "wheels", per: 2 },
      { type: "cars", attr: "wheels", per: 4 },
      { type: "birds", attr: "legs", per: 2 },
      { type: "cats", attr: "legs", per: 4 },
      { type: "tricycles", attr: "wheels", per: 3 }
    ];
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const count = Math.floor(Math.random() * 4) + 3; // 3 to 6
    const answer = String(count * scenario.per);

    let defectMap = null;
    let options = null;
    if (isMCQ) {
      options = Array.from(new Set([answer, String(count), String(scenario.per), String(count + scenario.per)])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [String(count)]: "CONSTANT_VIOLATION",
        [String(scenario.per)]: "CONSTANT_VIOLATION",
        [String(count + scenario.per)]: "CONFUSED_OPERATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How many ${scenario.attr} are there altogether?`, `${count} x ${scenario.per} = ?`, zodType),
        options: options,
        defectMap: defectMap,
        hint: "[AI: PROVIDE A CONCEPTUAL HINT]",
        finalAnswer: answer,
        solutionSteps: `1. Each ${scenario.type.slice(0, -1)} has ${scenario.per} ${scenario.attr}.\n2. ${count} ${scenario.type} have ${count} x ${scenario.per} = ${answer} ${scenario.attr}.`
      },
      visualEngine: {
        componentToRender: isShortQ ? "NUMBER_CARDS" : "NONE",
        componentData: isShortQ ? { items: [String(count), "x", String(scenario.per), "=", "?"] } : {}
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      IMPORTANT: For story questions, DO NOT include the mathematical equation (e.g., 3 x $10 = ?) in the questionText.
      ${isShortQ 
        ? 'STRICT: Provide a direct mathematical equation. NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a localized Singaporean story involving ${count} ${scenario.type} and their ${scenario.attr} (visually represented by the emoji "${selectedIcon}").`
      }

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'standard', logic: "attribute_mult", hideVisual: hideVisual }
    };
  }

  // 11. Multiplication Syntax Audit
  if (activeVariant === 'standard_multiplication_syntax_audit') {
    const group_count = Math.floor(Math.random() * 4) + 2; // 2 to 5
    const items_per_group = Math.floor(Math.random() * 8) + 2; // 2 to 9
    
    const valid1 = `${group_count} x ${items_per_group}`;
    const wordGroup = numberToWords ? numberToWords(items_per_group) + 's' : `${items_per_group}s`;
    const valid2 = `${group_count} ${wordGroup}`;
    const valid3 = `${group_count} groups of ${items_per_group}`;
    const distractor = `${group_count} + ${items_per_group}`;
    
    const items = [valid1, valid2, valid3, distractor].sort(() => Math.random() - 0.5);
    const labels = ['A', 'B', 'C', 'D'];
    
    const distractorIndex = items.indexOf(distractor);
    const distractorLetter = labels[distractorIndex];
    
    const itemPlural = context?.items ? context.items[0]?.plural || itemLabel + 's' : itemLabel + 's';
    
    let questionTextStr;
    let finalAnswerStr;
    
    if (isMCQ) {
      questionTextStr = `Look at the picture. Which sentence does NOT represent the total number of ${itemPlural}?`;
      finalAnswerStr = distractor;
    } else {
      questionTextStr = `Look at the picture. Which sentence does NOT represent the total number of ${itemPlural}?\n(A) ${items[0]}\n(B) ${items[1]}\n(C) ${items[2]}\n(D) ${items[3]}`;
      finalAnswerStr = distractorLetter;
    }
    
    let defectMap = null;
    if (isMCQ) {
      defectMap = {
        [valid1]: "CONCEPTUAL_ERROR",
        [valid2]: "CONCEPTUAL_ERROR",
        [valid3]: "CONCEPTUAL_ERROR"
      };
    }
    
    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(questionTextStr, questionTextStr, zodType),
        options: isMCQ ? items : null,
        defectMap: defectMap,
        hint: "[AI: PROVIDE A CONCEPTUAL HINT]",
        finalAnswer: finalAnswerStr,
        solutionSteps: `1. There are ${group_count} groups of ${items_per_group}.\n2. This can be written as ${valid1}, ${valid2}, or ${valid3}.\n3. ${distractor} is addition, which gives the wrong total.`
      },
      visualEngine: {
        componentToRender: "GROUPING_WORKSPACE",
        componentData: {
          mode: "GROUPING",
          targetGroupSize: items_per_group,
          items: Array(group_count * items_per_group).fill(selectedIcon),
          totalItems: group_count * items_per_group,
          icon: selectedIcon
        }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      STRICT: Do not generate a story context. Output the exact question text provided.
      
      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'standard', logic: "syntax_audit", hideVisual: false }
    };
  }

}