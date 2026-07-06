import { numberToWords } from '@/lib/utils/math-helpers';

// Robust extraction helper for localized context objects
const extract = (val) => {
  if (typeof val !== 'object' || val === null) return String(val);
  return val.item || val.singular || val.name?.singular || val.text || val.val || String(val);
};

export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, hideVisual, supportsStructured) {
  const commonMeta = { 
    level, 
    topic, 
    subtopic: 'Multiplication and Division',
    type: zodType, 
    difficulty: zodDiff,
    strand: 'Number and Algebra',
    subject: 'Math',
    gradeLevel: 'P1',
    heuristic: activeVariant.includes('multiplication') ? 'Multiplication' : 'Division'
  };
  const inputType = isStructure ? 'MULTI_STEP_INPUT' : (isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT');
  const isShortQ = zodType === 'SHORT_QUESTION';

  const levelNum = parseInt(level.replace('Primary ', ''));
  const readingMandate = levelNum <= 2 
    ? "STRICT READING LEVEL: Use sentences with maximum 10-12 words. Use simple nouns and verbs (Sight Words). No words with more than 2 syllables."
    : (levelNum >= 5 
        ? "ADVANCED READING LEVEL: You may use complex sentences and technical Singaporean context (e.g., GST, interest rates, or logistics). Use a professional, descriptive tone."
        : "");

  // 1. Basic Multiplication & Division
  if (activeVariant === 'foundation_multiplication' || activeVariant === 'foundation_division') {
    const isMult = activeVariant.includes('multiplication');
    const itemLabel = extract(selectedContextItem);
    const groups = Math.floor(Math.random() * 4) + 2; // 2 to 5 groups
    const itemsPerGroup = Math.floor(Math.random() * 5) + 2; // 2 to 6 items per group
    const total = groups * itemsPerGroup;
    
    const answer = isMult ? String(total) : String(itemsPerGroup);
    const operator = isMult ? 'x' : '÷';
    const equationStr = isMult ? `${groups} x ${itemsPerGroup} = ?` : `${total} ÷ ${groups} = ?`;

    let defectMap = null;
    let options = null;
    if (isMCQ) {
      options = Array.from(new Set([answer, String(parseInt(answer) + 1), String(parseInt(answer) - 1), isMult ? String(groups + itemsPerGroup) : String(total)])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {};
      if (isMult) defectMap[String(groups + itemsPerGroup)] = "CONFUSED_OPERATION";
      else defectMap[String(total)] = "CONSTANT_VIOLATION";
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] How many are there ${isMult ? 'altogether' : 'in each group'}?`, equationStr, zodType),
        options: options,
        defectMap: defectMap,
        hint: "[AI: PROVIDE A CONCEPTUAL HINT]",
        finalAnswer: answer,
        solutionSteps: isMult ? `1. ${groups} groups of ${itemsPerGroup} makes ${total}.` : `1. ${total} shared into ${groups} groups gives ${itemsPerGroup} in each group.`,
      },
      visualEngine: {
        componentToRender: isShortQ ? "NUMBER_CARDS" : "NONE",
        componentData: isShortQ 
          ? { items: isMult ? [String(groups), 'x', String(itemsPerGroup), '=', '?'] : [String(total), '÷', String(groups), '=', '?'] }
          : {}
      },
      inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      ${isShortQ 
        ? `STRICT: Provide a direct mathematical equation (${equationStr}). NO story context or names.` 
        : `STRICT: Write a unique and creative 1-sentence localized Singaporean math story about ${extract(context.name)} and ${itemLabel} (visually represented by the emoji "${selectedIcon}") using ${isMult ? 'equal groups' : 'sharing equally'}. 
        
        CRITICAL: For "questionText", you MUST output your story followed EXACTLY by the sentence: "How many are there ${isMult ? 'altogether' : 'in each group'}?"
        MANDATORY: You MUST use the name "${extract(context.name)}" and the item "${itemLabel}". 
        ${isMult ? 'MANDATORY: You MUST include the word "each" in the story to clearly specify the amount per group (e.g., "3 erasers into each of 2 bags").' : ''}
        VARIETY GUARDRAIL: Do NOT default to common clichés like "pencils", "apples", or "oranges". 
        Creative Examples: distributing prizes at a community event, organizing a hobby collection, preparing materials for a craft project, or sorting items for a school drive.`
      }

      CRITICAL VISUAL RULE: "componentData" MUST be an object. NEVER return it as a string.

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'foundation', logic: activeVariant, hideVisual: hideVisual }
    };
  }

  // 2. Interactive Grouping/Sharing
  if (activeVariant === 'foundation_grouping_interactive' || activeVariant === 'foundation_sharing_interactive') {
    const isSharing = activeVariant.includes('sharing');
    const groups = Math.floor(Math.random() * 3) + 2; 
    const itemsPerGroup = Math.floor(Math.random() * 4) + 2; 
    const total = groups * itemsPerGroup;
    const answer = isSharing ? String(itemsPerGroup) : String(groups);

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] Use the grouping tool to find the answer.`, isSharing ? `${total} ÷ ${groups} = ?` : `${total} ÷ ${itemsPerGroup} = ?`, zodType),
        options: null, 
        hint: "[AI: PROVIDE A CONCEPTUAL HINT]",
        finalAnswer: answer,
        solutionSteps: isSharing ? `1. Share ${total} items equally into ${groups} groups.\n2. There are ${answer} items in each group.` : `1. Group ${total} items into sets of ${itemsPerGroup}.\n2. You get ${answer} groups.`
      },
      visualEngine: {
        componentToRender: "GROUPING_WORKSPACE",
        componentData: { 
          totalItems: total, 
          groups: isSharing ? groups : null, 
          itemsPerGroup: isSharing ? null : itemsPerGroup,
          mode: isSharing ? 'SHARING' : 'GROUPING',
          icon: selectedIcon,
          items: Array(total).fill(selectedIcon),
          hideVisual: false
        }
      },
      inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      STRICT: This is an interactive ${isSharing ? 'sharing' : 'grouping'} variant. Replace the "[STORY]" tag in "questionText" with a highly unique and creative 1-sentence localized Singaporean story involving ${extract(context.name)} and ${extract(selectedContextItem)} (visually represented by "${selectedIcon}").
      
      MANDATORY: You MUST use the name "${extract(context.name)}" and the item "${extract(selectedContextItem)}". 
      VARIETY GUARDRAIL: Avoid repetitive themes like "star stickers" or "pencils". 
      The story should give a fresh and engaging reason for ${isSharing ? 'sharing' : 'grouping'} the ${total} items.
      Creative Contexts: materials for a puppet show, resources for a science experiment, items for a charitable donation, or treats for a festive celebration.

      CRITICAL VISUAL RULE: "componentData" MUST be an object. NEVER return it as a string.

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'foundation', logic: activeVariant, hideVisual: false }
    };
  }

  // 3. Recognize Equal Groups
  if (activeVariant === 'foundation_recognize_equal_groups') {
    const groups = Math.floor(Math.random() * 2) + 3; // 3 to 4 groups
    const itemsPerGroup = Math.floor(Math.random() * 3) + 2; // 2 to 4 items
    const total = groups * itemsPerGroup;
    
    const valid = `${groups} groups of ${itemsPerGroup}`;
    const invalid1 = `${groups} groups with ${itemsPerGroup}, ${itemsPerGroup - 1}, and ${itemsPerGroup + 1} items`;
    const invalid2 = `${groups - 1} groups of ${itemsPerGroup} and 1 group of ${itemsPerGroup + 1}`;
    
    const options = [valid, invalid1, invalid2, `${groups} groups of different amounts`].sort(() => Math.random() - 0.5);
    
    let questionText = "Which of the following describes equal groups?";
    let finalAnswerStr = valid;
    if (!isMCQ) {
      questionText += `\n(A) ${options[0]}\n(B) ${options[1]}\n(C) ${options[2]}\n(D) ${options[3]}`;
      const validIndex = options.indexOf(valid);
      finalAnswerStr = ['A', 'B', 'C', 'D'][validIndex];
    }
    
    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      STRICT GUARDRAIL: Do NOT modify the "questionText" string. You MUST output it EXACTLY as provided in the JSON template below, preserving all newlines and options.
      
      OUTPUT FORMAT:
      ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: isMCQ ? options : null,
          defectMap: isMCQ ? {
            [invalid1]: "CONCEPTUAL_ERROR",
            [invalid2]: "CONCEPTUAL_ERROR",
            [`${groups} groups of different amounts`]: "CONCEPTUAL_ERROR"
          } : null,
          hint: "Equal groups mean every group has exactly the same number of items.",
          finalAnswer: finalAnswerStr,
          solutionSteps: `1. Equal groups must have the same number of items in every single group.\n2. "${valid}" means every group has exactly ${itemsPerGroup} items.\n3. The others have different amounts in some groups.`
        },
        visualEngine: { componentToRender: "NONE", componentData: { hideVisual: true } },
        inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
      })}`,
      metadata: { difficulty: 'foundation', logic: activeVariant, hideVisual: true }
    };
  }

  // 4. Count Equal Groups
  if (activeVariant === 'foundation_count_equal_groups') {
    const groups = Math.floor(Math.random() * 4) + 2; // 2 to 5 groups
    const itemsPerGroup = Math.floor(Math.random() * 5) + 2; // 2 to 6 items
    const total = groups * itemsPerGroup;
    
    const answerStr = `${groups} groups of ${itemsPerGroup}`;
    
    const distractor1 = `${itemsPerGroup} groups of ${groups}`;
    const distractor2 = `${groups} groups of ${itemsPerGroup + 1}`;
    const distractor3 = `${groups + 1} groups of ${itemsPerGroup}`;
    
    const options = [answerStr, distractor1, distractor2, distractor3].sort(() => Math.random() - 0.5);
    
    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      STRICT GUARDRAIL: Do NOT modify the "questionText" string. You MUST output it EXACTLY as provided in the JSON template below.
      
      OUTPUT FORMAT:
      ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: `Look at the picture. How many equal groups are there, and how many items are in each group?`,
          options: options,
          defectMap: {
            [distractor1]: "CONFUSED_GROUPS_AND_ITEMS",
            [distractor2]: "COUNTING_ERROR",
            [distractor3]: "COUNTING_ERROR"
          },
          hint: "First count how many big groups there are. Then count how many items are inside one group.",
          finalAnswer: answerStr,
          solutionSteps: `1. Count the big groups. There are ${groups} groups.\n2. Count the items inside one group. There are ${itemsPerGroup} items.\n3. So, there are ${groups} groups of ${itemsPerGroup}.`
        },
        visualEngine: {
          componentToRender: "EQUAL_GROUPS",
          componentData: {
            totalItems: total,
            groups: groups,
            itemsPerGroup: itemsPerGroup,
            icon: selectedIcon
          }
        },
        inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
      })}`,
      metadata: { difficulty: 'foundation', logic: activeVariant, hideVisual: false }
    };
  }

  // 5. Repeated Addition
  if (activeVariant === 'foundation_repeated_addition') {
    const groups = Math.floor(Math.random() * 3) + 3; // 3 to 5 groups
    const itemsPerGroup = Math.floor(Math.random() * 4) + 2; // 2 to 5 items
    const total = groups * itemsPerGroup;
    
    const answer = Array(groups).fill(itemsPerGroup).join(' + ');
    
    const distractor1 = Array(itemsPerGroup).fill(groups).join(' + ');
    const distractor2 = Array(groups - 1).fill(itemsPerGroup).join(' + ');
    const distractor3 = Array(groups + 1).fill(itemsPerGroup).join(' + ');
    
    const options = Array.from(new Set([answer, distractor1, distractor2, distractor3]));
    while(options.length < 4) { options.push(Array(groups).fill(itemsPerGroup + 1).join(' + ')); }
    const shuffledOptions = options.slice(0, 4).sort(() => Math.random() - 0.5);
    
    let questionText = `Which addition sentence matches the picture?`;
    let finalAnswerStr = answer;
    if (!isMCQ) {
      questionText += `\n(A) ${shuffledOptions[0]}\n(B) ${shuffledOptions[1]}\n(C) ${shuffledOptions[2]}\n(D) ${shuffledOptions[3]}`;
      const validIndex = shuffledOptions.indexOf(answer);
      finalAnswerStr = ['A', 'B', 'C', 'D'][validIndex];
    }
    
    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      STRICT GUARDRAIL: Do NOT modify the "questionText" string. You MUST output it EXACTLY as provided in the JSON template below.
      
      OUTPUT FORMAT:
      ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: isMCQ ? shuffledOptions : null,
          defectMap: {
            [distractor1]: "CONFUSED_GROUPS_AND_ITEMS",
            [distractor2]: "COUNTING_ERROR",
            [distractor3]: "COUNTING_ERROR"
          },
          hint: "How many items are in each group? Write that number down for every group you see and add them.",
          finalAnswer: finalAnswerStr,
          solutionSteps: `1. There are ${groups} groups.\n2. Each group has ${itemsPerGroup} items.\n3. We add ${itemsPerGroup} together ${groups} times: ${answer}.`
        },
        visualEngine: {
          componentToRender: "EQUAL_GROUPS",
          componentData: {
            totalItems: total,
            groups: groups,
            itemsPerGroup: itemsPerGroup,
            icon: selectedIcon
          }
        },
        inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
      })}`,
      metadata: { difficulty: 'foundation', logic: activeVariant, hideVisual: false }
    };
  }
  // 6. Repeated Subtraction
  if (activeVariant === 'foundation_repeated_subtraction') {
    const groups = Math.floor(Math.random() * 3) + 3; // 3 to 5 groups
    const itemsPerGroup = Math.floor(Math.random() * 4) + 2; // 2 to 5 items
    const total = groups * itemsPerGroup;
    
    const answer = `${total} - ` + Array(groups).fill(itemsPerGroup).join(' - ') + ' = 0';
    
    const distractor1 = `${total} - ` + Array(itemsPerGroup).fill(groups).join(' - ') + ' = 0';
    const distractor2 = `${total} - ` + Array(groups - 1).fill(itemsPerGroup).join(' - ') + ' = 0';
    const distractor3 = `${total} - ` + Array(groups + 1).fill(itemsPerGroup).join(' - ') + ' = 0';
    
    const options = Array.from(new Set([answer, distractor1, distractor2, distractor3]));
    while(options.length < 4) { options.push(`${total} - ` + Array(groups).fill(itemsPerGroup + 1).join(' - ') + ' = 0'); }
    const shuffledOptions = options.slice(0, 4).sort(() => Math.random() - 0.5);
    
    let questionText = `Which subtraction sentence matches the picture?`;
    let finalAnswerStr = answer;
    if (!isMCQ) {
      questionText += `\n(A) ${shuffledOptions[0]}\n(B) ${shuffledOptions[1]}\n(C) ${shuffledOptions[2]}\n(D) ${shuffledOptions[3]}`;
      const validIndex = shuffledOptions.indexOf(answer);
      finalAnswerStr = ['A', 'B', 'C', 'D'][validIndex];
    }
    
    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      STRICT GUARDRAIL: Do NOT modify the "questionText" string. You MUST output it EXACTLY as provided in the JSON template below.
      
      OUTPUT FORMAT:
      ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: isMCQ ? shuffledOptions : null,
          defectMap: {
            [distractor1]: "CONFUSED_GROUPS_AND_ITEMS",
            [distractor2]: "COUNTING_ERROR",
            [distractor3]: "COUNTING_ERROR"
          },
          hint: "We start with the total items. Then we subtract the number of items in one group again and again until we have 0.",
          finalAnswer: finalAnswerStr,
          solutionSteps: `1. The total number of items is ${total}.\n2. Each group has ${itemsPerGroup} items.\n3. We subtract ${itemsPerGroup} repeatedly until 0: ${answer}.`
        },
        visualEngine: {
          componentToRender: "EQUAL_GROUPS",
          componentData: {
            totalItems: total,
            groups: groups,
            itemsPerGroup: itemsPerGroup,
            icon: selectedIcon
          }
        },
        inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
      })}`,
      metadata: { difficulty: 'foundation', logic: activeVariant, hideVisual: false }
    };
  }

  // 7. Division Equation
  if (activeVariant === 'foundation_division_equation') {
    const groups = Math.floor(Math.random() * 4) + 2; // 2 to 5 groups
    const itemsPerGroup = Math.floor(Math.random() * 5) + 2; // 2 to 6 items
    const total = groups * itemsPerGroup;
    
    const answer = `${total} ÷ ${groups} = ${itemsPerGroup}`;
    const answerAlternative = `${total} ÷ ${itemsPerGroup} = ${groups}`;
    
    const isGroupFocus = Math.random() > 0.5;
    const finalAns = isGroupFocus ? answer : answerAlternative;
    
    const distractor1 = `${total} ÷ ${groups + 1} = ${itemsPerGroup}`;
    const distractor2 = `${total} ÷ ${groups} = ${itemsPerGroup + 1}`;
    const distractor3 = `${total} - ${groups} = ${itemsPerGroup}`; // Confused operation
    
    const options = [finalAns, distractor1, distractor2, distractor3].sort(() => Math.random() - 0.5);
    
    let questionText = `Which division equation matches the picture?`;
    let finalAnswerStr = finalAns;
    if (!isMCQ) {
      questionText += `\n(A) ${options[0]}\n(B) ${options[1]}\n(C) ${options[2]}\n(D) ${options[3]}`;
      const validIndex = options.indexOf(finalAns);
      finalAnswerStr = ['A', 'B', 'C', 'D'][validIndex];
    }
    
    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      STRICT GUARDRAIL: Do NOT modify the "questionText" string. You MUST output it EXACTLY as provided in the JSON template below.
      
      OUTPUT FORMAT:
      ${JSON.stringify({
        meta: commonMeta,
        content: {
          questionText: questionText,
          options: isMCQ ? options : null,
          defectMap: {
            [distractor1]: "COUNTING_ERROR",
            [distractor2]: "COUNTING_ERROR",
            [distractor3]: "CONFUSED_OPERATION"
          },
          hint: "The first number is the total. Then we divide by the number of groups to get the items in each group (or divide by items to get groups).",
          finalAnswer: finalAnswerStr,
          solutionSteps: `1. The total number of items is ${total}.\n2. There are ${groups} groups with ${itemsPerGroup} items each.\n3. The division equation is ${finalAns}.`
        },
        visualEngine: {
          componentToRender: "EQUAL_GROUPS",
          componentData: {
            totalItems: total,
            groups: groups,
            itemsPerGroup: itemsPerGroup,
            icon: selectedIcon
          }
        },
        inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
      })}`,
      metadata: { difficulty: 'foundation', logic: activeVariant, hideVisual: false }
    };
  }

  // Fallback
  return {
    aiPrompt: `Return standard placeholder JSON.`,
    metadata: { difficulty, steps: 1, logic: activeVariant, hideVisual: true }
  };
}