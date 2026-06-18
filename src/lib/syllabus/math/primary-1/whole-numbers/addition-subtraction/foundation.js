import { numberToWords } from '@/lib/utils/math-helpers';
import { getRandomContext } from '@/lib/utils/localization';

// Robust extraction helper for localized context objects
const extract = (val) => {
  if (typeof val !== 'object' || val === null) return String(val);
  return val.item || val.singular || val.name?.singular || val.text || val.val || String(val);
};

export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, displayName, getQText, selectedIcon, hideVisual) {
  const commonMeta = { level, topic, type: zodType, difficulty: zodDiff };
  const inputType = isStructure ? 'MULTI_STEP_INPUT' : (isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT');
  const isShortQ = zodType === 'SHORT_QUESTION';

  const levelNum = parseInt(level.replace('Primary ', ''));
  const readingMandate = levelNum <= 2 
    ? "STRICT READING LEVEL: Use sentences with maximum 10-12 words. Use simple nouns and verbs (Sight Words). No words with more than 2 syllables."
    : (levelNum >= 5 
        ? "ADVANCED READING LEVEL: You may use complex sentences and technical Singaporean context (e.g., GST, interest rates, or logistics). Use a professional, descriptive tone."
        : "");

  // Safety check for localization context
  const itemLabel = displayName;

  // 1. Foundation Addition/Subtraction within 20
  if (activeVariant === 'foundation_add_20' || activeVariant === 'foundation_sub_20') {
    const isAdd = activeVariant.includes('add');
    const num1 = isAdd ? Math.floor(Math.random() * 6) + 6 : Math.floor(Math.random() * 8) + 12; 
    const num2 = isAdd ? Math.floor(Math.random() * 6) + 3 : Math.floor(Math.random() * 5) + 2;
    const answer = isAdd ? String(num1 + num2) : String(num1 - num2);
    const operator = isAdd ? '+' : '-';

    let options = null;
    let defectMap = null;
    if (isMCQ) {
      const wrongOpAnswer = isAdd ? String(num1 - num2) : String(num1 + num2);
      options = Array.from(new Set([answer, wrongOpAnswer, String(parseInt(answer) + 1), String(parseInt(answer) - 1)])).slice(0, 4);
      options = options.filter(opt => parseInt(opt) >= 0);
      while(options.length < 4) { 
        let cand = parseInt(answer) + Math.floor(Math.random() * 10) - 3;
        if (cand >= 0 && String(cand) !== answer) options.push(String(cand));
        options = Array.from(new Set(options));
      }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [wrongOpAnswer]: "CONFUSED_OPERATION"
      };
      options.forEach(opt => { if (opt !== answer && opt !== wrongOpAnswer) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How many ${isAdd ? 'altogether' : 'are left'}?`, `${num1} ${operator} ${num2} = ?`),
        options: options,
        defectMap: defectMap,
        hint: "[AI: INJECT HINT]",
        finalAnswer: answer,
        solutionSteps: `1. ${num1} ${operator} ${num2} = ${answer}.`
      },
      visualEngine: {
        componentToRender: isStructure ? "NONE" : "NUMBER_CARDS",
        componentData: isStructure ? {} : { items: [String(num1), operator, String(num2)] }
      },
      inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      ${isShortQ 
        ? 'STRICT: Provide a direct mathematical equation. NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a 1-sentence Singaporean math story about ${extract(context.name)} having ${num1} ${itemLabel} and ${isAdd ? 'getting' : 'giving away'} ${num2} more.`
      }
      
      CRITICAL VISUAL RULE: "componentData" MUST be an object (e.g. {}). NEVER return it as a string (like "NONE").
      
      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { 
        difficulty: 'foundation', 
        steps: 1, 
        logic: isAdd ? "add_20" : "sub_20", 
        hideVisual: isStructure 
      }
    };
  }

  // 2. Foundation Missing Addend
  if (activeVariant === 'foundation_missing_addend') {
    const sum = Math.floor(Math.random() * 10) + 10; // 10-19
    const part = Math.floor(Math.random() * (sum - 4)) + 2; 
    const answer = String(sum - part);
    const isFirstMissing = Math.random() > 0.5;

    let options = null;
    let defectMap = null;
    if (isMCQ) {
      const addedAnswer = String(sum + part);
      options = Array.from(new Set([answer, String(sum), addedAnswer, String(parseInt(answer) + 1)])).slice(0, 4);
      options = options.filter(opt => parseInt(opt) >= 0);
      while(options.length < 4) { 
        let cand = parseInt(answer) + Math.floor(Math.random() * 10) - 3;
        if (cand >= 0 && String(cand) !== answer) options.push(String(cand));
        options = Array.from(new Set(options));
      }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [String(sum)]: "CONSTANT_VIOLATION",
        [addedAnswer]: "CONFUSED_OPERATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How many more does ${extract(context.name)} need?`, isFirstMissing ? `? + ${part} = ${sum}` : `${part} + ? = ${sum}`),
        options: options,
        defectMap: defectMap,
        hint: "[AI: INJECT HINT]",
        finalAnswer: answer,
        solutionSteps: `1. ${sum} - ${part} = ${answer}.`
      },
      visualEngine: {
        componentToRender: isStructure ? "NONE" : "NUMBER_CARDS",
        componentData: isStructure ? {} : { items: isFirstMissing ? ["?", "+", String(part), "=", String(sum)] : [String(part), "+", "?", "=", String(sum)] }
      },
      inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      ${isShortQ 
        ? 'STRICT: Provide a direct mathematical equation. NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a 1-sentence localized Singaporean story where ${extract(context.name)} has ${part} ${itemLabel} but needs ${sum} in total.`
      }

      CRITICAL VISUAL RULE: "componentData" MUST be an object. NEVER return it as a string.

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { 
        difficulty: 'foundation', 
        steps: 1, 
        logic: "missing_addend", 
        hideVisual: isStructure 
      }
    };
  }

  // 3. Foundation Number Bond Logic
  if (activeVariant === 'foundation_number_bond_logic') {
    const whole = Math.floor(Math.random() * 9) + 11; // 11-19
    const part1 = Math.floor(Math.random() * (whole - 4)) + 2; 
    const part2 = whole - part1;

    // Randomize missing position: 0 = Top, 1 = Left, 2 = Right
    const missingPos = Math.floor(Math.random() * 3);
    let answer, qTextSuffix, solutionSteps, visualData;

    if (missingPos === 0) {
      answer = String(whole);
      qTextSuffix = "What is the missing number?";
      solutionSteps = `${part1} + ${part2} = ${whole}.`;
      visualData = { whole: "?", part1: String(part1), part2: String(part2), hideVisual: false };
    } else if (missingPos === 1) {
      answer = String(part1);
      qTextSuffix = "What is the missing number?";
      solutionSteps = `${whole} - ${part2} = ${part1}.`;
      visualData = { whole: String(whole), part1: "?", part2: String(part2), hideVisual: false };
    } else {
      answer = String(part2);
      qTextSuffix = "What is the missing number?";
      solutionSteps = `${whole} - ${part1} = ${part2}.`;
      visualData = { whole: String(whole), part1: String(part1), part2: "?", hideVisual: false };
    }
    
    let options = null;
    let defectMap = null;
    if (isMCQ) {
      const addedAnswer = missingPos === 0 ? String(part1 + part2 + 1) : String(whole + (missingPos === 1 ? part2 : part1)); // Wrong operation
      options = Array.from(new Set([answer, String(whole), addedAnswer, String(parseInt(answer) + 1)])).slice(0, 4);
      options = options.filter(opt => parseInt(opt) >= 0);
      while(options.length < 4) { 
        let cand = parseInt(answer) + Math.floor(Math.random() * 10) - 3;
        if (cand >= 0 && String(cand) !== answer) options.push(String(cand));
        options = Array.from(new Set(options));
      }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [String(whole)]: "CONSTANT_VIOLATION",
        [addedAnswer]: "CONFUSED_OPERATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }
    
    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] ${qTextSuffix}`, "Find the missing number in the number bond."),
        hint: "[AI: INJECT HINT]",
        options: options,
        defectMap: defectMap,
        finalAnswer: answer,
        solutionSteps: `1. ${solutionSteps}`
      },
      visualEngine: {
        componentToRender: "NUMBER_BOND", // Always show number bonds for this variant
        componentData: { ...visualData, icon: selectedIcon }
      },
      inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      ${isShortQ 
        ? 'STRICT: Provide a direct question about the provided number bond. NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in the questionText with a 1-sentence localized Singaporean story about ${missingPos === 0 ? `combining ${part1} and ${part2} ${itemLabel}.` : `splitting ${whole} ${itemLabel} into two groups.`}`
      }

      CRITICAL VISUAL RULE: "componentData" MUST be an object. NEVER return it as a string.

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { 
        difficulty: 'foundation', 
        steps: 1, 
        logic: "number_bond", 
        hideVisual: false 
      }
    };
  }
  // 4. Foundation Visual Cross Out
  if (activeVariant === 'foundation_visual_cross_out') {
    const total_count = Math.floor(Math.random() * 16) + 5; // 5 to 20
    const crossed_count = Math.floor(Math.random() * (total_count - 1)) + 1; // 1 to total_count - 1
    const remaining = total_count - crossed_count;
    const answer = String(remaining);

    let options = null;
    let defectMap = null;
    if (isMCQ) {
      const addedAnswer = String(total_count + crossed_count);
      options = Array.from(new Set([answer, String(total_count), addedAnswer, String(remaining + 1)])).slice(0, 4);
      options = options.filter(opt => parseInt(opt) >= 0);
      while(options.length < 4) { 
        let cand = parseInt(answer) + Math.floor(Math.random() * 10) - 3;
        if (cand >= 0 && String(cand) !== answer) options.push(String(cand));
        options = Array.from(new Set(options));
      }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [String(total_count)]: "CONSTANT_VIOLATION",
        [addedAnswer]: "CONFUSED_OPERATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] Look at the picture. Complete the subtraction equation.`, `${total_count} - ${crossed_count} = ?`),
        hint: "[AI: INJECT HINT]",
        options: options,
        defectMap: defectMap,
        finalAnswer: answer,
        solutionSteps: `1. ${total_count} - ${crossed_count} = ${answer}.`
      },
      visualEngine: {
        componentToRender: "CROSS_OUT_GROUP",
        componentData: { totalItems: total_count, crossedItems: crossed_count, icon: selectedIcon }
      },
      inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      ${isShortQ 
        ? 'STRICT: Provide a direct mathematical question. NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a 1-sentence localized Singaporean story about ${extract(context.name)} having ${total_count} ${itemLabel} and giving away or losing ${crossed_count}.`
      }
      
      CRITICAL VISUAL RULE: "componentData" MUST be an object. NEVER return it as a string.
      
      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { 
        difficulty: 'foundation', 
        steps: 1, 
        logic: "visual_cross_out", 
        hideVisual: false 
      }
    };
  }

  // 5. Foundation Fact Family Cards
  if (activeVariant === 'foundation_fact_family_cards') {
    const part1 = Math.floor(Math.random() * 9) + 1; // 1-9
    const part2 = Math.floor(Math.random() * 9) + 1; // 1-9
    const whole = part1 + part2;
    
    const isAdd = Math.random() > 0.5;
    const operatorWord = isAdd ? 'addition' : 'subtraction';
    
    const answer = isAdd ? `${part1} + ${part2} = ${whole}` : `${whole} - ${part1} = ${part2}`;
    
    const distractors = [];
    if (isAdd) {
      distractors.push(`${whole} + ${part2} = ${part1}`);
      distractors.push(`${part1} + ${whole} = ${part2}`);
      distractors.push(`${part1} + ${part2} = ${whole + 1}`);
    } else {
      distractors.push(`${part1} - ${part2} = ${whole}`);
      distractors.push(`${part2} - ${part1} = ${whole}`);
      distractors.push(`${whole} - ${part2} = ${part1}`);
    }

    const items = [String(part1), String(part2), String(whole)].sort(() => Math.random() - 0.5);
    let options = null;
    let defectMap = null;
    if (isMCQ) {
      options = [answer, ...distractors].slice(0, 4).sort(() => Math.random() - 0.5);
      defectMap = {};
      distractors.forEach(d => defectMap[d] = "CONCEPTUAL_ERROR");
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: `Use all the number cards to form a correct ${operatorWord} equation.`,
        options: options,
        defectMap: defectMap,
        hint: "[AI: INJECT HINT]",
        finalAnswer: answer,
        solutionSteps: `1. The correct ${operatorWord} equation is ${answer}.`
      },
      visualEngine: {
        componentToRender: "NUMBER_CARDS",
        componentData: { items: items }
      },
      inputRequirement: { inputType: isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT' }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      STRICT: Do not generate a story context. Output the exact question text provided.
      
      CRITICAL VISUAL RULE: "componentData" MUST be an object. NEVER return it as a string.
      
      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'foundation', logic: "fact_family_cards", hideVisual: false }
    };
  }
}

export const foundationLogicWrapper = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
  // Note: This logic for mapping variants can be maintained here if needed for consistency across blueprints.
  return null;
};