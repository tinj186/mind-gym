export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, hideVisual) {
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
  const inputType = isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT';
  const isShortQ = zodType === 'SHORT_QUESTION';

  const levelNum = parseInt(level.replace('Primary ', ''));
  const readingMandate = levelNum <= 2 
    ? "STRICT READING LEVEL: Use sentences with maximum 10-12 words. Use simple nouns and verbs (Sight Words). No words with more than 2 syllables."
    : (levelNum >= 5 
        ? "ADVANCED READING LEVEL: You may use complex sentences and technical Singaporean context (e.g., GST, interest rates, or logistics). Use a professional, descriptive tone."
        : "");

  // Safety check for localization context
  const itemLabel = selectedContextItem?.item || 'items';

  // 1. Multi-step Multiplication/Addition
  if (activeVariant === 'advanced_multi_step_mult_add') {
    const groups = Math.floor(Math.random() * 3) + 2; // 2 to 4
    const size = Math.floor(Math.random() * 3) + 3; // 3 to 5
    const extra = Math.floor(Math.random() * 4) + 2; // 2 to 5
    const groupsTotal = groups * size;
    const answer = String(groupsTotal + extra);
    
    const equationStr = `(${groups} x ${size}) + ${extra} = ?`;

    const options = isMCQ ? [
      answer, 
      String(groupsTotal), 
      String(groupsTotal + extra + 1), 
      String(groups + size + extra)
    ].sort(() => Math.random() - 0.5) : null;

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] How many items are there altogether?`, equationStr),
        options: options,
        finalAnswer: answer,
        solutionSteps: getQText(`Step 1 (Groups): ${groups} x ${size} = ${groupsTotal}. Step 2 (Add extra): ${groupsTotal} + ${extra} = ${answer}.`, `(${groups} x ${size}) + ${extra} = ${answer}`)
      },
      visualEngine: {
        componentToRender: "NUMBER_CARDS",
        componentData: { 
          items: ["(", String(groups), "x", String(size), ")", "+", String(extra)], 
          hideVisual: hideVisual 
        }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate}\nSTRICT: Return ONLY valid JSON. ${formatInstructions}\n${isShortQ 
        ? 'Task: Return the JSON exactly as provided. Do not add any text.' 
        : `Task: Replace the "[STORY]" tag with a 1-sentence Singaporean context about ${context.name} having ${groups} groups of ${size} ${itemLabel} and finding ${extra} more. Return the JSON exactly as provided.`
      }\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'advanced', logic: activeVariant }
    };
  }

  // 2. Multi-step Multiplication/Subtraction
  if (activeVariant === 'advanced_multi_step_mult_sub') {
    const groups = Math.floor(Math.random() * 3) + 3; // 3 to 5
    const size = Math.floor(Math.random() * 3) + 4; // 4 to 6
    const remove = Math.floor(Math.random() * 5) + 2; // 2 to 6
    const groupsTotal = groups * size;
    const answer = String(groupsTotal - remove);
    
    const equationStr = `(${groups} x ${size}) - ${remove} = ?`;

    const options = isMCQ ? [
      answer, 
      String(groupsTotal), 
      String(groupsTotal - remove - 1), 
      String(groupsTotal + remove)
    ].sort(() => Math.random() - 0.5) : null;

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] How many items are left?`, equationStr),
        options: options,
        finalAnswer: answer,
        solutionSteps: getQText(`Step 1 (Groups): ${groups} x ${size} = ${groupsTotal}. Step 2 (Subtract): ${groupsTotal} - ${remove} = ${answer}.`, `(${groups} x ${size}) - ${remove} = ${answer}`)
      },
      visualEngine: {
        componentToRender: "NUMBER_CARDS",
        componentData: { 
          items: ["(", String(groups), "x", String(size), ")", "-", String(remove)], 
          hideVisual: hideVisual 
        }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate}\nSTRICT: Return ONLY valid JSON. ${formatInstructions}\n${isShortQ 
        ? 'Task: Return the JSON exactly as provided. Do not add any text.' 
        : `Task: Replace the "[STORY]" tag with a 1-sentence Singaporean context about ${context.name} having ${groups} groups of ${size} ${itemLabel} and giving away ${remove} to a friend. Return the JSON exactly as provided.`
      }\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'advanced', logic: activeVariant }
    };
  }

  // 3. Multiplication Logic (Wheels/Legs)
  if (activeVariant === 'advanced_logic_wheels_legs') {
    const count = Math.floor(Math.random() * 4) + 3; // 3 to 6
    const typeLabel = Math.random() > 0.5 ? "tricycles" : "cars";
    const legsPer = typeLabel === "tricycles" ? 3 : 4;
    const answer = String(count * legsPer);

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] How many wheels are there altogether?`, `${count} x ${legsPer} = ?`),
        options: isMCQ ? [answer, String((count-1)*legsPer), String(count*(legsPer+1)), String(count+legsPer)].sort(() => Math.random() - 0.5) : null,
        finalAnswer: answer,
        solutionSteps: getQText(`1 ${typeLabel.slice(0,-1)} has ${legsPer} wheels. ${count} ${typeLabel} have ${count} x ${legsPer} = ${answer} wheels.`, `${count} x ${legsPer} = ${answer}`)
      },
      visualEngine: {
        componentToRender: hideVisual ? "NONE" : "COUNTING_OBJECTS",
        componentData: { items: [String(count), String(legsPer)], operator: "x", hideVisual: hideVisual }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate}\nSTRICT: Return ONLY valid JSON. ${formatInstructions}\n${isShortQ 
        ? 'Task: Return the JSON exactly as provided. Do not add any text.' 
        : `Task: Replace the "[STORY]" tag with a 1-sentence Singaporean context about counting ${count} ${typeLabel} at a park. Return the JSON exactly as provided.`
      }\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'advanced', logic: "wheels_legs" }
    };
  }
}