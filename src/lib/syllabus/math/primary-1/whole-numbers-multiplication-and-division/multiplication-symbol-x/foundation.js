import { numberToWords } from '@/lib/utils/math-helpers';

// Robust extraction helper for localized context objects
const extract = (val) => {
  if (typeof val !== 'object' || val === null) return String(val);
  return val.item || val.singular || val.name?.singular || val.text || val.val || String(val);
};

export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, getQText, context, selectedContextItem) {
  const commonMeta = { 
    level, 
    topic, 
    subtopic: "Multiplication Symbol 'x'",
    type: zodType, 
    difficulty: zodDiff,
    strand: 'Number and Algebra',
    subject: 'Math',
    gradeLevel: 'P1',
    heuristic: 'Multiplication'
  };
  const inputType = isStructure ? 'MULTI_STEP_INPUT' : (isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT');
  const isShortQ = zodType === 'SHORT_QUESTION';

  // 1. Convert repeated addition to a multiplication expression
  if (activeVariant === 'foundation_repeated_addition_to_mult') {
    const groups = Math.floor(Math.random() * 4) + 2; // 2 to 5
    const num = Math.floor(Math.random() * 5) + 2; // 2 to 6
    const total = groups * num;
    
    const repeatedAdd = Array(groups).fill(num).join(' + ');
    const answer = `${groups} x ${num} = ${total}`;
    
    let options = null;
    let defectMap = null;
    if (isMCQ) {
      options = [
        answer,
        `${num} x ${groups} = ${total}`,
        `${groups + 1} x ${num} = ${total + num}`,
        `${groups} + ${num} = ${groups + num}`
      ].sort(() => Math.random() - 0.5);
      
      defectMap = {
        [`${groups} + ${num} = ${groups + num}`]: "CONFUSED_OPERATION",
        [`${num} x ${groups} = ${total}`]: "REVERSED_ORDER"
      };
    }

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`Look at this addition: ${repeatedAdd} = ${total}. Which multiplication equation is the same?`, `Which multiplication equation is the same as ${repeatedAdd} = ${total}?`),
        options,
        defectMap,
        hint: "Count how many times the number is added. That is the number of groups.",
        finalAnswer: answer,
        solutionSteps: `1. The number ${num} is added ${groups} times.\n2. This means there are ${groups} groups of ${num}.\n3. So, ${repeatedAdd} is the same as ${answer}.`
      },
      visualEngine: { componentToRender: "NONE", componentData: {} },
      inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'foundation', logic: activeVariant, hideVisual: true }
    };
  }

  // 2. Convert 'groups of' text to a multiplication expression
  if (activeVariant === 'foundation_groups_of_to_mult') {
    const groups = Math.floor(Math.random() * 4) + 2; // 2 to 5
    const num = Math.floor(Math.random() * 5) + 2; // 2 to 6
    const total = groups * num;
    
    const textStr = `${groups} groups of ${num} is ${total}`;
    const answer = `${groups} x ${num} = ${total}`;
    
    let options = null;
    let defectMap = null;
    if (isMCQ) {
      options = [
        answer,
        `${num} x ${groups} = ${total}`,
        `${groups} + ${num} = ${groups + num}`,
        `${groups} - ${num} = ${Math.max(0, groups - num)}`
      ].sort(() => Math.random() - 0.5);
      
      defectMap = {
        [`${groups} + ${num} = ${groups + num}`]: "CONFUSED_OPERATION",
        [`${num} x ${groups} = ${total}`]: "REVERSED_ORDER"
      };
    }

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`Which multiplication equation shows "${textStr}"?`, `Which equation shows "${textStr}"?`),
        options,
        defectMap,
        hint: "The word 'groups of' can be written as a multiplication sign 'x'.",
        finalAnswer: answer,
        solutionSteps: `1. We have ${groups} groups, and each group has ${num}.\n2. The symbol for 'groups of' is 'x'.\n3. So, "${textStr}" is written as ${answer}.`
      },
      visualEngine: { componentToRender: "NONE", componentData: {} },
      inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'foundation', logic: activeVariant, hideVisual: true }
    };
  }

  // 3. Convert a multiplication expression into repeated addition
  if (activeVariant === 'foundation_mult_to_repeated_addition') {
    const groups = Math.floor(Math.random() * 3) + 3; // 3 to 5
    const num = Math.floor(Math.random() * 4) + 2; // 2 to 5
    const total = groups * num;
    
    const multStr = `${groups} x ${num} = ${total}`;
    const answer = Array(groups).fill(num).join(' + ') + ` = ${total}`;
    
    let options = null;
    let defectMap = null;
    if (isMCQ) {
      options = [
        answer,
        Array(num).fill(groups).join(' + ') + ` = ${total}`, // Reversed
        Array(groups - 1).fill(num).join(' + ') + ` = ${total - num}`, // One less
        Array(groups + 1).fill(num).join(' + ') + ` = ${total + num}`  // One more
      ].sort(() => Math.random() - 0.5);
      
      defectMap = {
        [Array(num).fill(groups).join(' + ') + ` = ${total}`]: "REVERSED_ORDER",
        [Array(groups - 1).fill(num).join(' + ') + ` = ${total - num}`]: "CARELESS_CALCULATION"
      };
    }

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`Look at this multiplication: ${multStr}. Which repeated addition shows the same thing?`, `Which repeated addition is the same as ${multStr}?`),
        options,
        defectMap,
        hint: "The first number tells you how many times to add the second number.",
        finalAnswer: answer,
        solutionSteps: `1. ${multStr} means ${groups} groups of ${num}.\n2. So we must add the number ${num}, ${groups} times.\n3. The correct addition is ${answer}.`
      },
      visualEngine: { componentToRender: "NONE", componentData: {} },
      inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'foundation', logic: activeVariant, hideVisual: true }
    };
  }

  // 4. Match a picture of equal groups to the correct multiplication expression
  if (activeVariant === 'foundation_mult_equation_match') {
    const groups = Math.floor(Math.random() * 3) + 2; // 2 to 4
    const itemsPerGroup = Math.floor(Math.random() * 4) + 2; // 2 to 5
    const total = groups * itemsPerGroup;
    
    const answer = `${groups} x ${itemsPerGroup} = ${total}`;
    
    let options = null;
    let defectMap = null;
    if (isMCQ) {
      options = [
        answer,
        `${itemsPerGroup} x ${groups} = ${total}`,
        `${groups + itemsPerGroup} = ${groups + itemsPerGroup}`,
        `${groups} x ${itemsPerGroup + 1} = ${groups * (itemsPerGroup + 1)}`
      ].sort(() => Math.random() - 0.5);
      
      defectMap = {
        [`${itemsPerGroup} x ${groups} = ${total}`]: "REVERSED_ORDER",
        [`${groups + itemsPerGroup} = ${groups + itemsPerGroup}`]: "CONFUSED_OPERATION"
      };
    }

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`Which multiplication equation matches the picture?`, `Which multiplication equation matches the picture?`),
        options,
        defectMap,
        hint: "Count the number of groups first. Then count how many are in each group.",
        finalAnswer: answer,
        solutionSteps: `1. There are ${groups} equal groups.\n2. Each group has ${itemsPerGroup} items.\n3. So, we write this as ${groups} groups of ${itemsPerGroup}, or ${answer}.`
      },
      visualEngine: { 
        componentToRender: "EQUAL_GROUPS", 
        componentData: { totalItems: total, groups: groups, itemsPerGroup: itemsPerGroup, icon: "⭐" } 
      },
      inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      CRITICAL VISUAL RULE: "componentData" MUST be an object. NEVER return it as a string.
      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'foundation', logic: activeVariant, hideVisual: false }
    };
  }

  // 5. Identify the correct mathematical operation symbol ('x')
  if (activeVariant === 'foundation_identify_mult_symbol') {
    const answer = "x";
    
    let options = null;
    if (isMCQ) {
      options = ["x", "+", "-", "÷"].sort(() => Math.random() - 0.5);
    }

    const name = extract(context?.name) || "Ahmad";
    const n1 = Math.floor(Math.random() * 5) + 2;
    const n2 = Math.floor(Math.random() * 5) + 2;
    
    const shortVariations = [
      `Which symbol is used for multiplication?`,
      `Which mathematical symbol means 'groups of'?`,
      `If you want to multiply numbers together, which symbol do you use?`,
      `${name} wants to multiply ${n1} and ${n2}. Which symbol should be used?`
    ];
    const selectedShortText = shortVariations[Math.floor(Math.random() * shortVariations.length)];

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`${name} wants to multiply ${n1} and ${n2} to find the total. Which symbol should be used?`, selectedShortText),
        options,
        defectMap: {
          "+": "CONFUSED_OPERATION",
          "-": "CONFUSED_OPERATION",
          "÷": "CONFUSED_OPERATION"
        },
        hint: "The symbol for multiplication looks like a cross.",
        finalAnswer: answer,
        solutionSteps: `1. The plus (+) symbol is for addition.\n2. The minus (-) symbol is for subtraction.\n3. The multiplication symbol is 'x'.`
      },
      visualEngine: { componentToRender: "NONE", componentData: {} },
      inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'foundation', logic: activeVariant, hideVisual: true }
    };
  }
}
