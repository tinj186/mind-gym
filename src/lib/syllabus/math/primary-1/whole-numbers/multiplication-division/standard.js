export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, hideVisual) {
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
  const itemLabel = selectedContextItem?.item || 'items';

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

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] How many groups of ${num} are there in the addition?`, `${additionStr} = ? x ${num}`),
        options: isMCQ ? [answer, String(num), String(count * num), String(count + 1)].sort(() => Math.random() - 0.5) : null,
        finalAnswer: answer,
        solutionSteps: getQText(`${additionStr} is ${num} added ${count} times. This is ${count} groups of ${num}, which is ${count} x ${num}.`, `${additionStr} = ${count} x ${num}`)
      },
      visualEngine: {
        componentToRender: isMCQ ? "NONE" : "NUMBER_CARDS",
        componentData: { items: [additionStr, "=", "?", "x", String(num)], hideVisual: isMCQ || hideVisual }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate}\nSTRICT: Return ONLY valid JSON. ${formatInstructions}\n${isShortQ 
        ? 'Task: Return the JSON exactly as provided. Do not add any text.' 
        : `Task: Replace the "[STORY]" tag with a 1-sentence Singaporean context about ${context.name} having ${count} groups of ${num} ${itemLabel}. Return the JSON exactly as provided.`
      }\n\nJSON TEMPLATE:\n` + JSON.stringify(promptObject),
      metadata: { difficulty: 'standard', logic: "repeated_addition_convert" }
    };
  }

  // 2. Array Rows and Columns
  if (activeVariant === 'standard_array_rows_cols') {
    const rows = Math.floor(Math.random() * 3) + 2;
    const cols = Math.floor(Math.random() * 4) + 3;
    const answer = String(rows * cols);

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] How many ${itemLabel} are there in the array altogether?`, `${rows} x ${cols} = ?`),
        options: isMCQ ? [answer, String(rows + cols), String(parseInt(answer) + 2), String(parseInt(answer) - 5)].sort(() => Math.random() - 0.5) : null,
        finalAnswer: answer,
        solutionSteps: getQText(`There are ${rows} rows and ${cols} columns. ${rows} x ${cols} = ${answer}.`, `${rows} x ${cols} = ${answer}`)
      },
      visualEngine: {
        componentToRender: isMCQ ? "NONE" : "NUMBER_CARDS",
        componentData: { items: [String(rows), "x", String(cols), "=", "?"], hideVisual: isMCQ || hideVisual }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate}\nSTRICT: Return ONLY valid JSON. ${formatInstructions}\n${isShortQ 
        ? 'Task: Return the JSON exactly as provided. Do not add any text.' 
        : `Task: Replace the "[STORY]" tag with a 1-sentence Singaporean context about ${context.name} arranging ${itemLabel} into ${rows} rows of ${cols}. Return the JSON exactly as provided.`
      }\n\nJSON TEMPLATE:\n` + JSON.stringify(promptObject),
      metadata: { difficulty: 'standard', logic: "array_logic" }
    };
  }

  // 3. Comparison (Times as many)
  if (activeVariant === 'standard_comparison_times_as_many') {
    const startVal = Math.floor(Math.random() * 5) + 2; 
    const times = Math.floor(Math.random() * 3) + 2; 
    const answer = String(startVal * times);

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] How many ${itemLabel} does the second person have?`, `${times} x ${startVal} = ?`),
        options: isMCQ ? [answer, String(startVal + times), String(startVal), String(parseInt(answer) + 5)].sort(() => Math.random() - 0.5) : null,
        finalAnswer: answer,
        solutionSteps: getQText(`${times} times as many as ${startVal} means ${times} x ${startVal} = ${answer}.`, `${times} x ${startVal} = ${answer}`)
      },
      visualEngine: {
        componentToRender: isMCQ ? "NONE" : "COUNTING_OBJECTS",
        componentData: { items: [String(startVal), String(times)], operator: "x", hideVisual: isMCQ || hideVisual }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate}\nSTRICT: Return ONLY valid JSON. ${formatInstructions}\n${isShortQ 
        ? 'Task: Return the JSON exactly as provided. Do not add any text.' 
        : `Task: Replace the "[STORY]" tag with a 1-sentence Singaporean context: "${context.name} has ${startVal} ${itemLabel}. Another person has ${times} times as many." Return the JSON exactly as provided.`
      }\n\nJSON TEMPLATE:\n` + JSON.stringify(promptObject),
      metadata: { difficulty: 'standard', logic: "comparison_times" }
    };
  }

  // 4. Skip Count Total
  if (activeVariant === 'standard_skip_count_total') {
    const step = [2, 5, 10][Math.floor(Math.random() * 3)];
    const groups = Math.floor(Math.random() * 4) + 3;
    const answer = String(groups * step);

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] If you skip count by ${step} for ${groups} jumps, what is the total?`, `${groups} x ${step} = ?`),
        options: isMCQ ? [answer, String(parseInt(answer) - step), String(parseInt(answer) + step), String(groups)].sort(() => Math.random() - 0.5) : null,
        finalAnswer: answer,
        solutionSteps: getQText(`Counting by ${step} for ${groups} times: ${Array.from({length: groups}, (_, i) => (i + 1) * step).join(', ')}. The total is ${answer}.`, `${groups} x ${step} = ${answer}`)
      },
      visualEngine: {
        componentToRender: hideVisual ? "NONE" : "EQUAL_GROUPS",
        componentData: { 
          numGroups: groups, itemsPerGroup: step, emoji: selectedIcon,
          hideVisual: hideVisual 
        }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate}\nSTRICT: Return ONLY valid JSON. ${formatInstructions}\n${isShortQ 
        ? 'Task: Return the JSON exactly as provided. Do not add any text.' 
        : `Task: Replace the "[STORY]" tag with a 1-sentence Singaporean context about ${context.name} counting ${itemLabel} in groups. Return the JSON exactly as provided.`
      }\n\nJSON TEMPLATE:\n` + JSON.stringify(promptObject),
      metadata: { difficulty: 'standard', logic: "skip_count" }
    };
  }

  // 5. Unit Price Calc
  if (activeVariant === 'standard_unit_price_calc') {
    const qty = Math.floor(Math.random() * 4) + 2; 
    const price = [2, 5, 10][Math.floor(Math.random() * 3)]; 
    const answer = String(qty * price);

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] How much does ${context.name} pay in total?`, `${qty} x $${price} = ?`),
        options: isMCQ ? [answer, String(qty + price), String(parseInt(answer) - price), String(parseInt(answer) + 10)].sort(() => Math.random() - 0.5) : null,
        finalAnswer: answer,
        solutionSteps: getQText(`Each item costs $${price}. For ${qty} items, we calculate ${qty} x ${price} = ${answer}.`, `${qty} x ${price} = ${answer}`)
      },
      visualEngine: {
        componentToRender: "NUMBER_CARDS",
        componentData: { items: [String(qty), "x", `$${price}`], hideVisual: hideVisual }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate}\nSTRICT: Return ONLY valid JSON. ${formatInstructions}\n${isShortQ 
        ? 'Task: Return the JSON exactly as provided. Do not add any text.' 
        : `Task: Replace the "[STORY]" tag with a 1-sentence Singaporean context about ${context.name} buying ${qty} ${itemLabel} at $${price} each. Return the JSON exactly as provided.`
      }\n\nJSON TEMPLATE:\n` + JSON.stringify(promptObject),
      metadata: { difficulty: 'standard', logic: "unit_price" }
    };
  }

  // 6. Sharing (Missing Each)
  if (activeVariant === 'standard_sharing_missing_each') {
    const groups = Math.floor(Math.random() * 3) + 2; 
    const each = Math.floor(Math.random() * 4) + 2; 
    const total = groups * each;
    const answer = String(each);

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] How many ${itemLabel} does each person get?`, `${total} ÷ ${groups} = ?`),
        options: isMCQ ? [answer, String(total), String(groups), String(each + 1)].sort(() => Math.random() - 0.5) : null,
        finalAnswer: answer,
        solutionSteps: getQText(`Sharing ${total} items among ${groups} people means ${total} ÷ ${groups} = ${answer} each.`, `${total} ÷ ${groups} = ${answer}`)
      },
      visualEngine: {
        componentToRender: "GROUPING_WORKSPACE",
        componentData: { mode: "SHARING", totalItems: total, groups: groups, icon: selectedIcon, items: Array(total).fill(selectedIcon), hideVisual: hideVisual }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate}\nSTRICT: Return ONLY valid JSON. ${formatInstructions}\n${isShortQ 
        ? 'Task: Return the JSON exactly as provided. Do not add any text.' 
        : `Task: Replace the "[STORY]" tag with a 1-sentence Singaporean context about ${context.name} sharing ${total} ${itemLabel} among ${groups} friends. Return the JSON exactly as provided.`
      }\n\nJSON TEMPLATE:\n` + JSON.stringify(promptObject),
      metadata: { difficulty: 'standard', logic: "sharing_each" }
    };
  }

  // 7. Grouping (Missing Groups)
  if (activeVariant === 'standard_grouping_missing_groups') {
    const size = Math.floor(Math.random() * 3) + 2; 
    const groups = Math.floor(Math.random() * 4) + 2; 
    const total = groups * size;
    const answer = String(groups);
    
    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] How many groups can ${context.name} make?`, `${total} ÷ ${size} = ?`),
        options: isMCQ ? [answer, String(total), String(size), String(groups + 1)].sort(() => Math.random() - 0.5) : null,
        finalAnswer: answer,
        solutionSteps: getQText(`Putting ${total} items into groups of ${size} means ${total} ÷ ${size} = ${answer} groups.`, `${total} ÷ ${size} = ${answer}`)
      },
      visualEngine: {
        componentToRender: "GROUPING_WORKSPACE",
        componentData: { mode: "GROUPING", totalItems: total, targetGroupSize: size, icon: selectedIcon, items: Array(total).fill(selectedIcon), hideVisual: hideVisual }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate}\nSTRICT: Return ONLY valid JSON. ${formatInstructions}\n${isShortQ 
        ? 'Task: Return the JSON exactly as provided. Do not add any text.' 
        : `Task: Replace the "[STORY]" tag with a 1-sentence Singaporean context about ${context.name} packing ${total} ${itemLabel} into sets of ${size}. Return the JSON exactly as provided.`
      }\n\nJSON TEMPLATE:\n` + JSON.stringify(promptObject),
      metadata: { difficulty: 'standard', logic: "grouping_groups" }
    };
  }

  // 8. Inverse Fact Families
  if (activeVariant === 'standard_inverse_fact_families') {
    const n1 = Math.floor(Math.random() * 4) + 2;
    const n2 = Math.floor(Math.random() * 4) + 2;
    const prod = n1 * n2;
    const answer = String(n1);

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] If ${n1} x ${n2} = ${prod}, what is ${prod} ÷ ${n2}?`, `If ${n1} x ${n2} = ${prod}, then ${prod} ÷ ${n2} = ?`),
        options: isMCQ ? [answer, String(n2), String(prod), String(n1 + n2)].sort(() => Math.random() - 0.5) : null,
        finalAnswer: answer,
        solutionSteps: getQText(`Division is the opposite of multiplication. Since ${n1} x ${n2} = ${prod}, it follows that ${prod} ÷ ${n2} = ${n1}.`, `${prod} ÷ ${n2} = ${n1}`)
      },
      visualEngine: {
        componentToRender: "NUMBER_CARDS",
        componentData: { items: [String(n1), "x", String(n2), "=", String(prod)], hideVisual: hideVisual }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate}\nSTRICT: Return ONLY valid JSON. ${formatInstructions}\n${isShortQ 
        ? 'Task: Return the JSON exactly as provided. Do not add any text.' 
        : `Task: Replace the "[STORY]" tag with a 1-sentence Singaporean context about the relationship between multiplying and dividing ${itemLabel}. Return the JSON exactly as provided.`
      }\n\nJSON TEMPLATE:\n` + JSON.stringify(promptObject),
      metadata: { difficulty: 'standard', logic: "inverse_fact" }
    };
  }

  // 9. Even/Odd Sharing
  if (activeVariant === 'standard_even_odd_sharing') {
    const total = Math.floor(Math.random() * 15) + 5;
    const isEven = total % 2 === 0;
    const answer = isEven ? "Yes" : "No";

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] Can ${context.name} share these ${itemLabel} equally between 2 friends without any left over?`, `Can ${total} be shared equally into 2 groups?`),
        options: ["Yes", "No"],
        finalAnswer: answer,
        solutionSteps: getQText(`${total} is an ${isEven ? 'even' : 'odd'} number. ${isEven ? 'Even numbers can be shared equally into 2 groups.' : 'Odd numbers will always have 1 left over when shared into 2 groups.'}`, `${total} ÷ 2 = ${Math.floor(total/2)}${isEven ? '' : ' remainder 1'}`)
      },
      visualEngine: { // Use GROUPING_WORKSPACE to show the total items for sharing
        componentToRender: "GROUPING_WORKSPACE",
        componentData: { 
          totalItems: total, 
          groups: 2, // Implicitly sharing among 2 friends
          mode: "SHARING",
          icon: selectedIcon,
          items: Array(total).fill(selectedIcon),
          hideVisual: hideVisual 
        }
      },
      inputRequirement: { inputType: 'MCQ_BUTTONS' }
    };

    return {
      aiPrompt: `${readingMandate}\nSTRICT: Return ONLY valid JSON. ${formatInstructions}\n${isShortQ 
        ? 'Task: Return the JSON exactly as provided. Do not add any text.' 
        : `Task: Replace the "[STORY]" tag with a 1-sentence Singaporean context about ${context.name} having ${total} ${itemLabel} and trying to share them with a friend. Return the JSON exactly as provided.`
      }\n\nJSON TEMPLATE:\n` + JSON.stringify(promptObject),
      metadata: { difficulty: 'standard', logic: "even_odd" }
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

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] How many ${scenario.attr} are there altogether?`, `${count} x ${scenario.per} = ?`),
        options: isMCQ ? [answer, String(count), String(scenario.per), String(count + scenario.per)].sort(() => Math.random() - 0.5) : null,
        finalAnswer: answer,
        solutionSteps: getQText(`Each ${scenario.type.slice(0, -1)} has ${scenario.per} ${scenario.attr}. ${count} ${scenario.type} have ${count} x ${scenario.per} = ${answer} ${scenario.attr}.`, `${count} x ${scenario.per} = ${answer}`)
      },
      visualEngine: {
        componentToRender: hideVisual ? "NONE" : "EQUAL_GROUPS",
        componentData: { 
          numGroups: count, itemsPerGroup: scenario.per, emoji: selectedIcon,
          hideVisual: hideVisual 
        }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate}\nSTRICT: Return ONLY valid JSON. ${formatInstructions}\n${isShortQ 
        ? 'Task: Return the JSON exactly as provided. Do not add any text.' 
        : `Task: Replace the "[STORY]" tag with a 1-sentence Singaporean context about seeing ${count} ${scenario.type} at a park. Return the JSON exactly as provided.`
      }\n\nJSON TEMPLATE:\n` + JSON.stringify(promptObject),
      metadata: { difficulty: 'standard', logic: "attribute_mult" }
    };
  }
}