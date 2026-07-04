import { numberToWords } from '@/lib/utils/math-helpers';

// Robust extraction helper for localized context objects
const extract = (val) => {
  if (typeof val !== 'object' || val === null) return String(val);
  return val.item || val.singular || val.name?.singular || val.text || val.val || String(val);
};

export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, hideVisual, supportsStructured) {
  const commonMeta = { 
    level, 
    topic, 
    subtopic: 'Multiplication and Division',
    type: zodType, 
    difficulty: zodDiff,
    strand: 'Number and Algebra',
    subject: 'Math',
    gradeLevel: 'P1',
    heuristic: activeVariant.includes('mult_add') ? 'Multi-step Add' : (activeVariant.includes('mult_sub') ? 'Multi-step Sub' : 'Logic Wheels/Legs')
  };
  const inputType = isStructure ? 'MULTI_STEP_INPUT' : (isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT');
  const isShortQ = zodType === 'SHORT_QUESTION';

  const levelNum = parseInt(level.replace('Primary ', ''));
  const readingMandate = levelNum <= 2 
    ? "STRICT READING LEVEL: Use sentences with maximum 10-12 words. Use simple nouns and verbs (Sight Words). No words with more than 2 syllables."
    : (levelNum >= 5 
        ? "ADVANCED READING LEVEL: You may use complex sentences and technical Singaporean context (e.g., GST, interest rates, or logistics). Use a professional, descriptive tone."
        : "");

  // 1. Multi-step Multiplication/Addition
  if (activeVariant === 'advanced_multi_step_mult_add') {
    const itemLabel = extract(selectedContextItem);
    const groups = Math.floor(Math.random() * 3) + 2; // 2 to 4
    const size = Math.floor(Math.random() * 3) + 3; // 3 to 5
    const extra = Math.floor(Math.random() * 4) + 2; // 2 to 5
    const groupsTotal = groups * size;
    const answer = String(groupsTotal + extra);
    
    const equationStr = `${groups} groups of ${size}, plus ${extra} more = ?`;

    let defectMap = null;
    let options = null;
    if (isMCQ) {
      options = Array.from(new Set([
        answer, 
        String(groupsTotal), 
        String(groupsTotal + extra + 1), 
        String(groups + size + extra)
      ])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);

      defectMap = {
        [String(groupsTotal)]: "CONCEPTUAL_ERROR",
        [String(groups + size + extra)]: "CONFUSED_OPERATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How many items are there altogether?`, equationStr, zodType),
        options: options,
        defectMap: defectMap,
        hint: "[AI: PROVIDE A CONCEPTUAL HINT]",
        finalAnswer: answer,
        solutionSteps: `1. Step 1 (Groups): ${groups} x ${size} = ${groupsTotal}.\n2. Step 2 (Add extra): ${groupsTotal} + ${extra} = ${answer}.`
      },
      visualEngine: {
        componentToRender: "NONE",
        componentData: {}
      },
      inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      ${isShortQ 
        ? `STRICT: Use exactly "${equationStr}" as the question. Ignore the rule about not using English words.`
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a creative 1-sentence localized Singaporean math story involving ${groups} groups of ${size} ${itemLabel} (represented by the emoji "${selectedIcon}") and ${extra} more.`
      }

      CRITICAL VISUAL RULE: "componentData" MUST be an object. NEVER return it as a string.

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'advanced', logic: activeVariant, hideVisual: hideVisual }
    };
  }

  // 2. Multi-step Multiplication/Subtraction
  if (activeVariant === 'advanced_multi_step_mult_sub') {
    const itemLabel = extract(selectedContextItem);
    const groups = Math.floor(Math.random() * 3) + 3; // 3 to 5
    const size = Math.floor(Math.random() * 3) + 4; // 4 to 6
    const remove = Math.floor(Math.random() * 5) + 2; // 2 to 6
    const groupsTotal = groups * size;
    const answer = String(groupsTotal - remove);
    
    const equationStr = `${groups} groups of ${size}, take away ${remove} = ?`;

    let defectMap = null;
    let options = null;
    if (isMCQ) {
      options = Array.from(new Set([
        answer, 
        String(groupsTotal), 
        String(groupsTotal - remove - 1), 
        String(groupsTotal + remove)
      ])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);

      defectMap = {
        [String(groupsTotal)]: "CONCEPTUAL_ERROR",
        [String(groupsTotal + remove)]: "CONFUSED_OPERATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How many items are left?`, equationStr, zodType),
        options: options,
        defectMap: defectMap,
        hint: "[AI: PROVIDE A CONCEPTUAL HINT]",
        finalAnswer: answer,
        solutionSteps: `1. Step 1 (Groups): ${groups} x ${size} = ${groupsTotal}.\n2. Step 2 (Subtract): ${groupsTotal} - ${remove} = ${answer}.`
      },
      visualEngine: {
        componentToRender: "NONE",
        componentData: {}
      },
      inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      ${isShortQ 
        ? `STRICT: Use exactly "${equationStr}" as the question. Ignore the rule about not using English words.`
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a creative 1-sentence localized Singaporean math story involving ${groups} groups of ${size} ${itemLabel} (represented by the emoji "${selectedIcon}") where ${remove} are removed.`
      }

      CRITICAL VISUAL RULE: "componentData" MUST be an object. NEVER return it as a string.

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'advanced', logic: activeVariant, hideVisual: hideVisual }
    };
  }

  // 3. Multiplication Logic (Wheels/Legs)
  if (activeVariant === 'advanced_logic_wheels_legs') {
    const count = Math.floor(Math.random() * 4) + 3; // 3 to 6
    const typeLabel = Math.random() > 0.5 ? "tricycles" : "cars";
    const legsPer = typeLabel === "tricycles" ? 3 : 4;
    const answer = String(count * legsPer);

    const equationStr = `${count} ${typeLabel} have how many wheels?`;

    let defectMap = null;
    let options = null;
    if (isMCQ) {
      options = Array.from(new Set([answer, String((count-1)*legsPer), String(count*(legsPer+1)), String(count+legsPer)])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);

      defectMap = {
        [String(count+legsPer)]: "CONFUSED_OPERATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How many wheels are there altogether?`, equationStr, zodType),
        options: options,
        defectMap: defectMap,
        hint: "[AI: PROVIDE A CONCEPTUAL HINT]",
        finalAnswer: answer,
        solutionSteps: `1. 1 ${typeLabel.slice(0,-1)} has ${legsPer} wheels.\n2. ${count} ${typeLabel} have ${count} x ${legsPer} = ${answer} wheels.`
      },
      visualEngine: {
        componentToRender: "NONE",
        componentData: {}
      },
      inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      ${isShortQ 
        ? `STRICT: Use exactly "${equationStr}" as the question. Ignore the rule about not using English words.` 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a creative 1-sentence localized Singaporean story involving ${count} ${typeLabel} (visually represented by the emoji "${selectedIcon}").`
      }

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'advanced', logic: "wheels_legs", hideVisual: hideVisual }
    };
  }

  // 4. Multi-step: Share equally then receive more
  if (activeVariant === 'advanced_multi_step_sharing_add') {
    const itemLabel = extract(selectedContextItem);
    const groups = Math.floor(Math.random() * 3) + 2; // 2 to 4
    const each = Math.floor(Math.random() * 4) + 3; // 3 to 6
    const total = groups * each;
    const extra = Math.floor(Math.random() * 4) + 2; // 2 to 5
    const answer = String(each + extra);
    
    const equationStr = `${total} shared equally among ${groups}, and ${extra} more = ?`;

    let defectMap = null;
    let options = null;
    if (isMCQ) {
      options = Array.from(new Set([
        answer, 
        String(each), 
        String(total + extra), 
        String(each + extra + 2)
      ])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);

      defectMap = {
        [String(each)]: "CONCEPTUAL_ERROR",
        [String(total + extra)]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How many items does that person have now?`, equationStr, zodType),
        options: options,
        defectMap: defectMap,
        hint: "[AI: PROVIDE A CONCEPTUAL HINT]",
        finalAnswer: answer,
        solutionSteps: `1. Step 1 (Share): ${total} ÷ ${groups} = ${each}.\n2. Step 2 (Receive more): ${each} + ${extra} = ${answer}.`
      },
      visualEngine: {
        componentToRender: "NONE",
        componentData: {}
      },
      inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      IMPORTANT: For story questions, DO NOT include the mathematical equation (e.g., 3 x $10 = ?) in the questionText.
      ${isShortQ 
        ? `STRICT: Use exactly "${equationStr}" as the question. Ignore the rule about not using English words.`
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a creative localized Singaporean story where ${total} ${itemLabel} (represented by "${selectedIcon}") are shared equally among ${groups} people. Then, one person receives ${extra} more.`
      }

      CRITICAL VISUAL RULE: "componentData" MUST be an object. NEVER return it as a string.

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'advanced', logic: activeVariant, hideVisual: hideVisual }
    };
  }

  // 5. Multi-step: Grouping and finding how many more needed
  if (activeVariant === 'advanced_grouping_need_more') {
    const itemLabel = extract(selectedContextItem);
    const size = Math.floor(Math.random() * 3) + 3; // 3 to 5
    const currentItems = (Math.floor(Math.random() * 3) + 2) * size; // multiple of size
    const targetGroups = (currentItems / size) + 1; // want one more group
    const targetItems = targetGroups * size;
    const needed = size;
    const answer = String(needed);
    
    const equationStr = `You have ${currentItems}. To make ${targetGroups} groups of ${size}, how many more do you need?`;

    let defectMap = null;
    let options = null;
    if (isMCQ) {
      options = Array.from(new Set([
        answer, 
        String(targetGroups), 
        String(currentItems + needed), 
        String(needed + 1)
      ])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);

      defectMap = {
        [String(targetGroups)]: "CONSTANT_VIOLATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How many more items are needed to make the required number of groups?`, equationStr, zodType),
        options: options,
        defectMap: defectMap,
        hint: "[AI: PROVIDE A CONCEPTUAL HINT]",
        finalAnswer: answer,
        solutionSteps: `1. Step 1 (Target total): ${targetGroups} groups of ${size} is ${targetGroups} x ${size} = ${targetItems}.\n2. Step 2 (Find difference): ${targetItems} - ${currentItems} = ${answer} more needed.`
      },
      visualEngine: {
        componentToRender: "NONE",
        componentData: {}
      },
      inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      IMPORTANT: For story questions, DO NOT include the mathematical equation (e.g., 3 x $10 = ?) in the questionText.
      ${isShortQ 
        ? `STRICT: Use exactly "${equationStr}" as the question. Ignore the rule about not using English words.`
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a localized Singaporean story where someone has ${currentItems} ${itemLabel} (represented by "${selectedIcon}") and wants to make ${targetGroups} groups with ${size} in each group.`
      }

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'advanced', logic: activeVariant, hideVisual: hideVisual }
    };
  }

  // 6. Multi-step: Total of two grouped quantities
  if (activeVariant === 'advanced_two_entities_total') {
    const itemLabel = extract(selectedContextItem);
    const groupsA = Math.floor(Math.random() * 3) + 2;
    const sizeA = Math.floor(Math.random() * 3) + 2;
    const groupsB = Math.floor(Math.random() * 3) + 2;
    const sizeB = Math.floor(Math.random() * 3) + 2;
    
    const totalA = groupsA * sizeA;
    const totalB = groupsB * sizeB;
    const answer = String(totalA + totalB);
    
    const equationStr = `${groupsA} groups of ${sizeA}, plus ${groupsB} groups of ${sizeB} = ?`;

    let defectMap = null;
    let options = null;
    if (isMCQ) {
      options = Array.from(new Set([
        answer, 
        String(totalA), 
        String(totalB), 
        String(totalA + totalB + 2)
      ])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);

      defectMap = {
        [String(totalA)]: "CONCEPTUAL_ERROR",
        [String(totalB)]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How many items are there altogether?`, equationStr, zodType),
        options: options,
        defectMap: defectMap,
        hint: "[AI: PROVIDE A CONCEPTUAL HINT]",
        finalAnswer: answer,
        solutionSteps: `1. Person 1 has: ${groupsA} x ${sizeA} = ${totalA}.\n2. Person 2 has: ${groupsB} x ${sizeB} = ${totalB}.\n3. Total altogether: ${totalA} + ${totalB} = ${answer}.`
      },
      visualEngine: {
        componentToRender: "NONE",
        componentData: {}
      },
      inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      IMPORTANT: For story questions, DO NOT include the mathematical equation (e.g., 3 x $10 = ?) in the questionText.
      ${isShortQ 
        ? `STRICT: Use exactly "${equationStr}" as the question. Ignore the rule about not using English words.`
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a localized Singaporean story involving Person A with ${groupsA} groups of ${sizeA} ${itemLabel} and Person B with ${groupsB} groups of ${sizeB} ${itemLabel}.`
      }

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'advanced', logic: activeVariant, hideVisual: hideVisual }
    };
  }

  // 7. Multi-step: Difference of two grouped quantities
  if (activeVariant === 'advanced_two_entities_diff') {
    const itemLabel = extract(selectedContextItem);
    const groupsA = Math.floor(Math.random() * 3) + 3; // 3 to 5
    const sizeA = Math.floor(Math.random() * 3) + 3; // 3 to 5
    const groupsB = Math.floor(Math.random() * 2) + 2; // 2 to 3
    const sizeB = Math.floor(Math.random() * 2) + 2; // 2 to 3
    
    const totalA = groupsA * sizeA;
    const totalB = groupsB * sizeB; // Ensure totalA is always > totalB
    const answer = String(totalA - totalB);
    
    const equationStr = `Difference between ${groupsA} groups of ${sizeA} and ${groupsB} groups of ${sizeB} = ?`;

    let defectMap = null;
    let options = null;
    if (isMCQ) {
      options = Array.from(new Set([
        answer, 
        String(totalA + totalB), 
        String(totalA), 
        String(totalA - totalB + 2)
      ])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);

      defectMap = {
        [String(totalA + totalB)]: "CONFUSED_OPERATION",
        [String(totalA)]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How many more items does Person A have than Person B?`, equationStr, zodType),
        options: options,
        defectMap: defectMap,
        hint: "[AI: PROVIDE A CONCEPTUAL HINT]",
        finalAnswer: answer,
        solutionSteps: `1. Person A has: ${groupsA} x ${sizeA} = ${totalA}.\n2. Person B has: ${groupsB} x ${sizeB} = ${totalB}.\n3. Difference: ${totalA} - ${totalB} = ${answer} more.`
      },
      visualEngine: {
        componentToRender: "NONE",
        componentData: {}
      },
      inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      IMPORTANT: For story questions, DO NOT include the mathematical equation (e.g., 3 x $10 = ?) in the questionText.
      ${isShortQ 
        ? `STRICT: Use exactly "${equationStr}" as the question. Ignore the rule about not using English words.`
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a localized Singaporean story where Person A has ${groupsA} groups of ${sizeA} ${itemLabel} and Person B has ${groupsB} groups of ${sizeB} ${itemLabel}.`
      }

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'advanced', logic: activeVariant, hideVisual: hideVisual }
    };
  }

  // 8. Money: Buy multiple items and find change
  if (activeVariant === 'advanced_money_mult_change') {
    const itemLabel = extract(selectedContextItem);
    const qty = Math.floor(Math.random() * 4) + 2; // 2 to 5
    const unitPrice = [2, 5][Math.floor(Math.random() * 2)]; 
    const totalCost = qty * unitPrice;
    
    // Choose a note that is larger than the total cost
    const possibleNotes = [10, 50, 100].filter(n => n > totalCost);
    const paidNote = possibleNotes[Math.floor(Math.random() * possibleNotes.length)] || 50;
    
    const answer = String(paidNote - totalCost);
    
    const equationStr = `Buy ${qty} items at $${unitPrice} each. Change from $${paidNote} = ?`;

    let defectMap = null;
    let options = null;
    if (isMCQ) {
      options = Array.from(new Set([
        answer, 
        String(totalCost), 
        String(paidNote - totalCost + 5), 
        String(paidNote - totalCost - 1)
      ])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);

      defectMap = {
        [String(totalCost)]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How much change does the person receive?`, equationStr, zodType),
        options: options,
        defectMap: defectMap,
        hint: "[AI: PROVIDE A CONCEPTUAL HINT]",
        finalAnswer: answer,
        solutionSteps: `1. Total cost of items: ${qty} x $${unitPrice} = $${totalCost}.\n2. Change received: $${paidNote} - $${totalCost} = $${answer}.`
      },
      visualEngine: {
        componentToRender: "NONE",
        componentData: {}
      },
      inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      IMPORTANT: For story questions, DO NOT include the mathematical equation (e.g., 3 x $10 = ?) in the questionText.
      ${isShortQ 
        ? `STRICT: Use exactly "${equationStr}" as the question. Ignore the rule about not using English words.`
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a localized Singaporean story where someone buys ${qty} ${itemLabel} for $${unitPrice} each, and pays with a $${paidNote} note.`
      }

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'advanced', logic: activeVariant, hideVisual: hideVisual }
    };
  }

  // 9. Money: Find how many items can be bought with a sum
  if (activeVariant === 'advanced_money_group_buy') {
    const itemLabel = extract(selectedContextItem);
    const unitPrice = [2, 5, 10][Math.floor(Math.random() * 3)];
    const qty = Math.floor(Math.random() * 4) + 2; // 2 to 5
    const totalMoney = qty * unitPrice;
    
    const answer = String(qty);
    
    const equationStr = `$${totalMoney} ÷ $${unitPrice} = ?`;

    let defectMap = null;
    let options = null;
    if (isMCQ) {
      options = Array.from(new Set([
        answer, 
        String(totalMoney), 
        String(unitPrice), 
        String(qty + 1)
      ])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);

      defectMap = {
        [String(totalMoney)]: "CONSTANT_VIOLATION",
        [String(unitPrice)]: "CONSTANT_VIOLATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How many items can be bought?`, equationStr, zodType),
        options: options,
        defectMap: defectMap,
        hint: "[AI: PROVIDE A CONCEPTUAL HINT]",
        finalAnswer: answer,
        solutionSteps: `1. Finding how many groups of $${unitPrice} are in $${totalMoney} is division.\n2. $${totalMoney} ÷ $${unitPrice} = ${answer} items.`
      },
      visualEngine: {
        componentToRender: "NONE",
        componentData: {}
      },
      inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      IMPORTANT: For story questions, DO NOT include the mathematical equation (e.g., 3 x $10 = ?) in the questionText.
      ${isShortQ 
        ? 'STRICT: Provide a direct mathematical equation involving money. NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a localized Singaporean story where someone has $${totalMoney} and wants to buy ${itemLabel} that cost $${unitPrice} each.`
      }

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'advanced', logic: activeVariant, hideVisual: hideVisual }
    };
  }

  // 10. Multi-step: Equate a grouped quantity with another by finding difference
  if (activeVariant === 'advanced_balance_mult_add') {
    const itemLabel = extract(selectedContextItem);
    const groupsA = Math.floor(Math.random() * 3) + 3; // 3 to 5
    const sizeA = Math.floor(Math.random() * 3) + 3; // 3 to 5
    const totalA = groupsA * sizeA;
    
    const currentB = Math.floor(Math.random() * 5) + 2; // 2 to 6
    const answer = String(totalA - currentB);
    
    const equationStr = `${groupsA} groups of ${sizeA}, take away ${currentB} = ?`;

    let defectMap = null;
    let options = null;
    if (isMCQ) {
      options = Array.from(new Set([
        answer, 
        String(totalA), 
        String(totalA + currentB), 
        String(totalA - currentB + 2)
      ])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);

      defectMap = {
        [String(totalA)]: "CONCEPTUAL_ERROR",
        [String(totalA + currentB)]: "CONFUSED_OPERATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How many more items does Person B need to have the same amount as Person A?`, equationStr, zodType),
        options: options,
        defectMap: defectMap,
        hint: "[AI: PROVIDE A CONCEPTUAL HINT]",
        finalAnswer: answer,
        solutionSteps: `1. Person A has: ${groupsA} x ${sizeA} = ${totalA}.\n2. Person B has ${currentB}. To find how many more are needed: ${totalA} - ${currentB} = ${answer}.`
      },
      visualEngine: {
        componentToRender: "NONE",
        componentData: {}
      },
      inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      IMPORTANT: For story questions, DO NOT include the mathematical equation (e.g., 3 x $10 = ?) in the questionText.
      ${isShortQ 
        ? `STRICT: Use exactly "${equationStr}" as the question. Ignore the rule about not using English words.`
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a localized Singaporean story where Person A has ${groupsA} groups of ${sizeA} ${itemLabel} and Person B has only ${currentB} ${itemLabel}.`
      }

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'advanced', logic: activeVariant, hideVisual: hideVisual }
    };
  }

  // 11. Attribute True/False Matrix Logic Puzzle
  if (activeVariant === 'advanced_attribute_tf_matrix') {
    const animals2Legs = [
      { name: 'chickens', legs: 2, icon: '🐔' },
      { name: 'ducks', legs: 2, icon: '🦆' },
      { name: 'birds', legs: 2, icon: '🐦' }
    ];
    const animals4Legs = [
      { name: 'cows', legs: 4, icon: '🐄' },
      { name: 'cats', legs: 4, icon: '🐈' },
      { name: 'dogs', legs: 4, icon: '🐕' }
    ];

    const entityA = animals2Legs[Math.floor(Math.random() * animals2Legs.length)];
    const entityB = animals4Legs[Math.floor(Math.random() * animals4Legs.length)];

    const countA = Math.floor(Math.random() * 3) + 2; // 2-4
    const countB = Math.floor(Math.random() * 3) + 2; // 2-4

    const totalLegs = (countA * entityA.legs) + (countB * entityB.legs);

    // S1
    const s1Correct = Math.random() > 0.5;
    const s1Sum = s1Correct ? totalLegs : totalLegs + 2;
    const s1 = `The animals have ${s1Sum} legs altogether.`;
    const s1Ans = s1Correct ? 'True' : 'False';

    // S2
    const s2Correct = Math.random() > 0.5;
    const s2Count = s2Correct ? countB : countB + 1;
    const s2 = `There are ${s2Count} groups of 4 legs.`;
    const s2Ans = s2Correct ? 'True' : 'False';

    // S3
    const s3Correct = Math.random() > 0.5;
    let s3Num = Math.floor(Math.random() * 3) + 2;
    if (s3Correct) {
      const divisors = [2, 4, 5, 10].filter(d => totalLegs % d === 0);
      s3Num = divisors.length > 0 ? divisors[Math.floor(Math.random() * divisors.length)] : 2;
    } else {
      const nonDivisors = [3, 4, 5].filter(d => totalLegs % d !== 0);
      s3Num = nonDivisors.length > 0 ? nonDivisors[0] : 3;
    }
    const s3 = `They can be grouped equally so each group has ${s3Num} legs.`;
    const s3Ans = totalLegs % s3Num === 0 ? 'True' : 'False';

    const finalAnswer = `${s1Ans}, ${s2Ans}, ${s3Ans}`;

    let options = null;
    if (isMCQ) {
      const possibleAnswers = ['True, True, True', 'True, True, False', 'True, False, True', 'True, False, False', 'False, True, True', 'False, True, False', 'False, False, True', 'False, False, False'];
      let opts = [finalAnswer];
      while (opts.length < 4) {
        const rand = possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)];
        if (!opts.includes(rand)) opts.push(rand);
      }
      options = opts.sort(() => Math.random() - 0.5);
    }

    let defectMap = null;
    if (isMCQ) {
      defectMap = {};
      options.forEach(opt => { if (opt !== finalAnswer) defectMap[opt] = "CONCEPTUAL_ERROR"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`Look at the animals. Are the statements below True or False? (Format: True, False, True)`, `Look at the animals. Are the statements below True or False? (Format: True, False, True)`, zodType),
        options: options,
        defectMap: defectMap,
        hint: "[AI: PROVIDE A CONCEPTUAL HINT]",
        finalAnswer: finalAnswer,
        solutionSteps: `1. There are ${countA} ${entityA.name} (${countA * 2} legs) and ${countB} ${entityB.name} (${countB * 4} legs).\\n2. Total legs = ${totalLegs}.\\n3. Statement 1 is ${s1Ans}.\\n4. Statement 2 is ${s2Ans}.\\n5. Statement 3 is ${s3Ans}.`
      },
      visualEngine: {
        componentToRender: "TF_MATRIX_TABLE",
        componentData: {
          statements: [s1, s2, s3],
          entities: [
            { count: countA, icon: entityA.icon, name: entityA.name },
            { count: countB, icon: entityB.icon, name: entityB.name }
          ]
        }
      },
      inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      STRICT: Do not generate a story context. Output the exact question text provided.
      
      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'advanced', logic: "attribute_tf_matrix", hideVisual: false }
    };
  }

}