import { numberToWords } from '@/lib/utils/math-helpers';
import { getRandomContext } from '@/lib/utils/localization';

// Robust extraction helper for localized context objects
const extract = (val) => {
  if (typeof val !== 'object' || val === null) return String(val);
  return val.item || val.singular || val.name?.singular || val.text || val.val || String(val);
};

export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, displayName, getQText, selectedIcon, hideVisual) {
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

  // 1. Standard Addition/Subtraction within 100 (No Regrouping)
  if (activeVariant === 'standard_add_100_no_regroup' || activeVariant === 'standard_sub_100_no_regroup') {
    const isAdd = activeVariant.includes('add');
    let num1, num2, answer;

    if (isAdd) {
      const t1 = Math.floor(Math.random() * 5) + 1; // 1-5 tens
      const o1 = Math.floor(Math.random() * 4) + 1; // 1-4 ones (non-zero)
      const t2 = Math.floor(Math.random() * 4) + 1; // 1-4 tens
      const o2 = Math.floor(Math.random() * (8 - o1)) + 1; // 1 to (8-o1) ones (non-zero, no regrouping)
      num1 = (t1 * 10) + o1;
      num2 = (t2 * 10) + o2;
      answer = String(num1 + num2);
    } else {
      const t1 = Math.floor(Math.random() * 5) + 5; // 5-9 tens
      const o1 = Math.floor(Math.random() * 4) + 5; // 5-8 ones (non-zero)
      const t2 = Math.floor(Math.random() * 4) + 1; // 1-4 tens
      const o2 = Math.floor(Math.random() * (o1 - 1)) + 1; // 1 to (o1-1) ones (non-zero, no regrouping)
      num1 = (t1 * 10) + o1;
      num2 = (t2 * 10) + o2;
      answer = String(num1 - num2);
    }

    const operator = isAdd ? '+' : '-';
    let options = null;
    let defectMap = null;
    if (isMCQ) {
      const wrongOpAnswer = isAdd ? String(num1 - num2) : String(num1 + num2);
      options = Array.from(new Set([answer, wrongOpAnswer, String(parseInt(answer) + 10), String(parseInt(answer) - 10)])).slice(0, 4);
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
        questionText: getQText(`[STORY] How many items does ${context.name} have ${isAdd ? 'in total' : 'left'}?`, `${num1} ${operator} ${num2} = ?`),
        options: options,
        defectMap: defectMap,
        hint: "[AI: INJECT HINT]",
        finalAnswer: answer,
        solutionSteps: isAdd 
          ? `1. Add the ones: ${num1 % 10} + ${num2 % 10} = ${(num1 % 10) + (num2 % 10)}.\n2. Add the tens: ${Math.floor(num1 / 10) * 10} + ${Math.floor(num2 / 10) * 10} = ${Math.floor(num1 / 10) * 10 + Math.floor(num2 / 10) * 10}.\n3. Total is ${answer}.`
          : `1. Subtract the ones: ${num1 % 10} - ${num2 % 10} = ${(num1 % 10) - (num2 % 10)}.\n2. Subtract the tens: ${Math.floor(num1 / 10) * 10} - ${Math.floor(num2 / 10) * 10} = ${Math.floor(num1 / 10) * 10 - Math.floor(num2 / 10) * 10}.\n3. Total is ${answer}.`
      },
      visualEngine: {
        componentToRender: isShortQ ? "NUMBER_CARDS" : "NONE",
        componentData: isShortQ ? { items: [String(num1), operator, String(num2)] } : {}
      },
      inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story unless replacing the [STORY] placeholder. DO NOT change the "visualEngine" component, "solutionSteps", or "finalAnswer". Return exactly the provided JSON structure, modifying ONLY the hint and array placeholders to match the requirements. ${formatInstructions}
      ${isShortQ 
        ? 'STRICT: Provide a direct mathematical equation. NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a creative 1-sentence Singaporean word problem involving ${extract(context.name)} and ${itemLabel}. The story must naturally incorporate the numbers ${num1} and ${num2} in an ${isAdd ? 'addition' : 'subtraction'} context (e.g., buying, collecting, or losing items).`
      }

      CRITICAL VISUAL RULE: "componentData" MUST be an object. NEVER return it as a string.

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { 
        difficulty: 'standard', 
        steps: 2, 
        logic: isAdd ? "add_no_regroup" : "sub_no_regroup", 
        hideVisual: !isShortQ 
      }
    };
  }

  // 2. Standard Word Problem Basic (Addition/Subtraction within 100, No Regrouping)
  if (activeVariant === 'standard_word_problem_basic') {
    const isAdd = Math.random() > 0.5;
    let num1, num2, answer;

    if (isAdd) {
      const t1 = Math.floor(Math.random() * 5) + 1; 
      const o1 = Math.floor(Math.random() * 4) + 1; 
      const t2 = Math.floor(Math.random() * 4) + 1;
      const o2 = Math.floor(Math.random() * (8 - o1)) + 1;
      num1 = (t1 * 10) + o1;
      num2 = (t2 * 10) + o2;
      answer = String(num1 + num2);
    } else {
      const t1 = Math.floor(Math.random() * 5) + 5; 
      const o1 = Math.floor(Math.random() * 4) + 5; 
      const t2 = Math.floor(Math.random() * 4) + 1;
      const o2 = Math.floor(Math.random() * (o1 - 1)) + 1;
      num1 = (t1 * 10) + o1;
      num2 = (t2 * 10) + o2;
      answer = String(num1 - num2);
    }

    const operator = isAdd ? '+' : '-';
    let options = null;
    let defectMap = null;
    if (isMCQ) {
      const wrongOpAnswer = isAdd ? String(num1 - num2) : String(num1 + num2);
      options = Array.from(new Set([answer, wrongOpAnswer, String(parseInt(answer) + 1), String(parseInt(answer) - 5)])).slice(0, 4);
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
        questionText: getQText(`[STORY] How many does ${context.name} have ${isAdd ? 'altogether' : 'left'}?`, `${num1} ${operator} ${num2} = ?`),
        options: options,
        defectMap: defectMap,
        hint: "[AI: INJECT HINT]",
        finalAnswer: answer,
        solutionSteps: `1. ${num1} ${operator} ${num2} = ${answer}.`
      },
      visualEngine: {
        componentToRender: isShortQ ? "NUMBER_CARDS" : "NONE",
        componentData: isShortQ ? { items: [String(num1), operator, String(num2)] } : {}
      },
      inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story unless replacing the [STORY] placeholder. DO NOT change the "visualEngine" component, "solutionSteps", or "finalAnswer". Return exactly the provided JSON structure, modifying ONLY the hint and array placeholders to match the requirements. ${formatInstructions}
      ${isShortQ 
        ? 'STRICT: Provide a direct mathematical equation. NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a creative 1-sentence Singaporean word problem involving ${extract(context.name)} and ${itemLabel}. The story must naturally incorporate the numbers ${num1} and ${num2} in an ${isAdd ? 'addition' : 'subtraction'} context (e.g., sharing, finding, or spending).`
      }

      CRITICAL VISUAL RULE: "componentData" MUST be an object. NEVER return it as a string.

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { 
        difficulty: 'standard', 
        steps: 2, 
        logic: "wp_basic", 
        hideVisual: !isShortQ 
      }
    };
  }

  // 3. Add Three Numbers (Standard)
  if (activeVariant === 'standard_add_three_numbers') {
    const n1 = Math.floor(Math.random() * 5) + 3; 
    const n2 = Math.floor(Math.random() * 4) + 2; 
    const n3 = Math.floor(Math.random() * 4) + 1;
    const answer = String(n1 + n2 + n3);

    let options = null;
    let defectMap = null;
    if (isMCQ) {
      const addedAnswer = String(n1 + n2);
      options = Array.from(new Set([answer, addedAnswer, String(parseInt(answer) + 2), String(parseInt(answer) - 1)])).slice(0, 4);
      options = options.filter(opt => parseInt(opt) >= 0);
      while(options.length < 4) { 
        let cand = parseInt(answer) + Math.floor(Math.random() * 10) - 3;
        if (cand >= 0 && String(cand) !== answer) options.push(String(cand));
        options = Array.from(new Set(options));
      }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [addedAnswer]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && opt !== addedAnswer) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How many are there in total?`, `${n1} + ${n2} + ${n3} = ?`),
        options: options,
        defectMap: defectMap,
        hint: "[AI: INJECT HINT]",
        finalAnswer: answer,
        solutionSteps: `1. ${n1} + ${n2} = ${n1 + n2}.\n2. ${n1 + n2} + ${n3} = ${answer}.`
      },
      visualEngine: {
        componentToRender: isShortQ ? "NUMBER_CARDS" : "NONE",
        componentData: isShortQ ? { items: [String(n1), "+", String(n2), "+", String(n3)] } : {}
      },
      inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story unless replacing the [STORY] placeholder. DO NOT change the "visualEngine" component, "solutionSteps", or "finalAnswer". Return exactly the provided JSON structure, modifying ONLY the hint and array placeholders to match the requirements. ${formatInstructions}
      ${isShortQ 
        ? 'STRICT: Provide a direct mathematical equation. NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a creative 1-sentence Singaporean word problem about ${extract(context.name)} and their ${n1}, ${n2}, and ${n3} ${itemLabel}. The story should logically combine these three groups.`
      }

      CRITICAL VISUAL RULE: "componentData" MUST be an object. NEVER return it as a string.

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'standard', logic: "add_3_num", hideVisual: !isShortQ }
    };
  }

  // 4. Missing Addend / Subtrahend (No Regrouping)
  if (activeVariant === 'standard_missing_addend_100' || activeVariant === 'standard_missing_subtrahend_100') {
    const isAdd = activeVariant.includes('add');
    const part1 = Math.floor(Math.random() * 30) + 10;
    const part2 = Math.floor(Math.random() * 8) + 1;
    const whole = part1 + part2;
    const answer = String(part2);
    
    const equation = isAdd ? `${part1} + ? = ${whole}` : `${whole} - ? = ${part1}`;

    let options = null;
    let defectMap = null;
    if (isMCQ) {
      const wrongAnswer = String(part1);
      options = Array.from(new Set([answer, String(part2 + 10), String(part2 + 1), wrongAnswer])).slice(0, 4);
      options = options.filter(opt => parseInt(opt) >= 0);
      while(options.length < 4) { 
        let cand = parseInt(answer) + Math.floor(Math.random() * 10) - 3;
        if (cand >= 0 && String(cand) !== answer) options.push(String(cand));
        options = Array.from(new Set(options));
      }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [wrongAnswer]: "CONFUSED_OPERATION"
      };
      options.forEach(opt => { if (opt !== answer && opt !== wrongAnswer) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] What is the missing number?`, `Find the missing number: ${equation}`),
        options: options,
        defectMap: defectMap,
        hint: "[AI: INJECT HINT]",
        finalAnswer: answer,
        solutionSteps: `1. ${whole} - ${part1} = ${answer}.`
      },
      visualEngine: {
        componentToRender: isShortQ ? "NUMBER_CARDS" : "NONE",
        componentData: isShortQ ? { items: isAdd ? [String(part1), "+", "?", "=", String(whole)] : [String(whole), "-", "?", "=", String(part1)] } : {}
      },
      inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story unless replacing the [STORY] placeholder. DO NOT change the "visualEngine" component, "solutionSteps", or "finalAnswer". Return exactly the provided JSON structure, modifying ONLY the hint and array placeholders to match the requirements. ${formatInstructions}
      ${isShortQ 
        ? 'STRICT: Provide a direct mathematical equation. NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a creative 1-sentence Singaporean word problem involving ${extract(context.name)} and ${itemLabel}. The story should describe a situation where ${whole} is the total and ${part1} is one part, asking for the missing ${part2} ${itemLabel}.`
      }

      CRITICAL VISUAL RULE: "componentData" MUST be an object. NEVER return it as a string.

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'standard', logic: "missing_part_100", hideVisual: !isShortQ }
    };
  }

  // 5. Related Fact Families
  if (activeVariant === 'standard_related_fact_families') {
    const part1 = Math.floor(Math.random() * 9) + 10; // 10-18
    const part2 = Math.floor(Math.random() * 5) + 2;  // 2-6
    const whole = part1 + part2;
    const answer = String(part1);

    let options = null;
    let defectMap = null;
    if (isMCQ) {
      options = Array.from(new Set([answer, String(part2), String(whole), String(part1 + 10)])).slice(0, 4);
      options = options.filter(opt => parseInt(opt) >= 0);
      while(options.length < 4) { 
        let cand = parseInt(answer) + Math.floor(Math.random() * 10) - 3;
        if (cand >= 0 && String(cand) !== answer) options.push(String(cand));
        options = Array.from(new Set(options));
      }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [String(part2)]: "CONCEPTUAL_ERROR",
        [String(whole)]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] If ${part1} + ${part2} = ${whole}, what is ${whole} - ${part2}?`, `If ${part1} + ${part2} = ${whole}, then ${whole} - ${part2} = ?`),
        options: options,
        defectMap: defectMap,
        hint: "[AI: INJECT HINT]",
        finalAnswer: answer,
        solutionSteps: `1. Since ${part1} + ${part2} = ${whole}, we know that ${whole} - ${part2} must be the other part.\n2. The other part is ${part1}.`
      },
      visualEngine: {
        componentToRender: "NONE",
        componentData: {}
      },
      inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story unless replacing the [STORY] placeholder. DO NOT change the "visualEngine" component, "solutionSteps", or "finalAnswer". Return exactly the provided JSON structure, modifying ONLY the hint and array placeholders to match the requirements. ${readingMandate} ${formatInstructions}
      ${isShortQ 
        ? 'STRICT: Provide a direct mathematical equation. NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a creative 1-sentence Singaporean word problem about related facts using ${extract(context.name)} and ${itemLabel}. (e.g., "If ${part1} ${itemLabel} and ${part2} ${itemLabel} make ${whole}...")`
      }

      CRITICAL VISUAL RULE: "componentData" MUST be an object. NEVER return it as a string.

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'standard', logic: "fact_families", hideVisual: true }
    };
  }

  // 6. Comparison More/Fewer (Standard)
  if (activeVariant === 'standard_comparison_more_basic' || activeVariant === 'standard_comparison_fewer_basic') {
    const isMore = activeVariant.includes('more');
    const val1 = Math.floor(Math.random() * 15) + 15;
    const diff = Math.floor(Math.random() * 5) + 2;
    const val2 = isMore ? val1 + diff : val1 - diff;
    const answer = String(val2);
    const equation = isMore ? `${val1} + ${diff} = ?` : `${val1} - ${diff} = ?`;

    let options = null;
    let defectMap = null;
    if (isMCQ) {
      const wrongOpAnswer = isMore ? String(val1 - diff) : String(val1 + diff);
      options = Array.from(new Set([answer, String(val1), String(val1 + 10), wrongOpAnswer])).slice(0, 4);
      options = options.filter(opt => parseInt(opt) >= 0);
      while(options.length < 4) { 
        let cand = parseInt(answer) + Math.floor(Math.random() * 10) - 3;
        if (cand >= 0 && String(cand) !== answer) options.push(String(cand));
        options = Array.from(new Set(options));
      }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [String(val1)]: "CONSTANT_VIOLATION",
        [wrongOpAnswer]: "CONFUSED_OPERATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How many ${itemLabel} does the other person have?`, equation),
        options: options,
        defectMap: defectMap,
        hint: "[AI: INJECT HINT]",
        finalAnswer: answer,
        solutionSteps: `1. ${val1} ${isMore ? '+' : '-'} ${diff} = ${answer}.`
      },
      visualEngine: {
        componentToRender: isShortQ ? "NUMBER_CARDS" : "NONE",
        componentData: isShortQ ? { items: [String(val1), isMore ? "+" : "-", String(diff)] } : {}
      },
      inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story unless replacing the [STORY] placeholder. DO NOT change the "visualEngine" component, "solutionSteps", or "finalAnswer". Return exactly the provided JSON structure, modifying ONLY the hint and array placeholders to match the requirements. ${readingMandate} ${formatInstructions}
      ${isShortQ 
        ? 'STRICT: Provide a direct mathematical equation. NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a localized Singaporean story: "${extract(context.name)} has ${val1} ${itemLabel}. Another person has ${diff} ${isMore ? 'more' : 'fewer'} than ${extract(context.name)}." You may use other localized objects (e.g. curry puffs, satay sticks) instead of ${itemLabel}.`
      }

      CRITICAL VISUAL RULE: "componentData" MUST be an object. NEVER return it as a string.

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'standard', logic: "comparison_basic", hideVisual: !isShortQ }
    };
  }

  // 7. Standard Number Bonds (within 100)
  if (activeVariant === 'standard_number_bond_multiples_10') {
    // Increased difficulty by using any number within 100 instead of just multiples of 10
    const whole = Math.floor(Math.random() * 71) + 25; // 25-95
    const part1 = Math.floor(Math.random() * (whole - 15)) + 10; // Ensures both parts are reasonably large
    const part2 = whole - part1;

    // Randomize missing position: 0 = Top (Whole), 1 = Bottom Left (Part 1), 2 = Bottom Right (Part 2)
    const missingPos = Math.floor(Math.random() * 3);
    let answer, qTextSuffix, solutionSteps, visualData;

    if (missingPos === 0) { // Top is missing (Addition)
      answer = String(whole);
      qTextSuffix = "How many items are there in total?";
      solutionSteps = `1. ${part1} + ${part2} = ${whole}.`;
      visualData = { whole: "?", parts: [String(part1), String(part2)], hideVisual: false };
    } else if (missingPos === 1) { // Left part is missing
      answer = String(part1);
      qTextSuffix = "How many are in the first group?";
      solutionSteps = `1. ${whole} - ${part2} = ${part1}.`;
      visualData = { whole: String(whole), parts: ["?", String(part2)], hideVisual: false };
    } else { // Right part is missing
      answer = String(part2);
      qTextSuffix = "How many are in the other group?";
      solutionSteps = `1. ${whole} - ${part1} = ${part2}.`;
      visualData = { whole: String(whole), parts: [String(part1), "?"], hideVisual: false };
    }

    let options = null;
    let defectMap = null;
    if (isMCQ) {
      const wrongOpAnswer = missingPos === 0 ? String(part1) : String(whole + (missingPos === 1 ? part2 : part1));
      options = Array.from(new Set([answer, String(parseInt(answer) + 10), wrongOpAnswer, String(missingPos === 0 ? part1 : whole)])).slice(0, 4);
      options = options.filter(opt => parseInt(opt) >= 0);
      while(options.length < 4) { 
        let cand = parseInt(answer) + Math.floor(Math.random() * 10) - 3;
        if (cand >= 0 && String(cand) !== answer) options.push(String(cand));
        options = Array.from(new Set(options));
      }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [String(missingPos === 0 ? part1 : whole)]: "CONSTANT_VIOLATION",
        [wrongOpAnswer]: "CONFUSED_OPERATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] ${qTextSuffix}`, missingPos === 0 ? "Complete the number bond." : `Complete the number bond for ${whole}.`),
        options: options,
        defectMap: defectMap,
        hint: "[AI: INJECT HINT]",
        finalAnswer: answer,
        solutionSteps: solutionSteps
      },
      visualEngine: {
        componentToRender: "NUMBER_BOND",
        componentData: { ...visualData, icon: selectedIcon }
      },
      inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story unless replacing the [STORY] placeholder. DO NOT change the "visualEngine" component, "solutionSteps", or "finalAnswer". Return exactly the provided JSON structure, modifying ONLY the hint and array placeholders to match the requirements. ${formatInstructions}
      ${isShortQ 
        ? 'STRICT: Provide a direct question about the number bond. NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a 1-sentence localized Singaporean story about ${missingPos === 0 ? `combining ${part1} and ${part2} ${itemLabel}` : `splitting ${whole} ${itemLabel} into two groups`}.`
      }

      CRITICAL VISUAL RULE: "componentData" MUST be an object. NEVER return it as a string.

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'standard', logic: "bond_100", hideVisual: !isShortQ }
    };
  }

  // 8. Standard Equation Equivalence
  if (activeVariant === 'standard_equation_equivalence') {
    // Force MCQ
    const finalInputType = 'MCQ_BUTTONS';
    const finalZodType = 'MCQ';
    
    // Target equation (no regrouping)
    const t1 = Math.floor(Math.random() * 5) + 1; 
    const o1 = Math.floor(Math.random() * 4) + 1; 
    const t2 = Math.floor(Math.random() * 4) + 1;
    const o2 = Math.floor(Math.random() * (8 - o1)) + 1;
    const num1 = (t1 * 10) + o1;
    const num2 = (t2 * 10) + o2;
    const targetSum = num1 + num2;
    const targetEq = `${num1} + ${num2}`;

    // Correct match equation
    let c_num1, c_num2;
    do {
      const c_t1 = Math.floor(Math.random() * (Math.floor(targetSum/10))) + 1;
      const c_o1 = Math.floor(Math.random() * (targetSum % 10 + 1));
      c_num1 = (c_t1 * 10) + c_o1;
      c_num2 = targetSum - c_num1;
    } while (c_num1 === num1);
    const correctEq = `${c_num1} + ${c_num2}`;

    // Generate 3 distractors
    const distractors = [];
    while(distractors.length < 3) {
      const d_t1 = Math.floor(Math.random() * 5) + 1;
      const d_o1 = Math.floor(Math.random() * 5);
      const d_t2 = Math.floor(Math.random() * 4) + 1;
      const d_o2 = Math.floor(Math.random() * (9 - d_o1));
      const d_n1 = (d_t1 * 10) + d_o1;
      const d_n2 = (d_t2 * 10) + d_o2;
      const d_sum = d_n1 + d_n2;
      if (d_sum !== targetSum) {
        distractors.push(`${d_n1} + ${d_n2}`);
      }
    }

    const options = [correctEq, ...distractors].sort(() => Math.random() - 0.5);

    let defectMap = {};
    distractors.forEach(d => defectMap[d] = "CONCEPTUAL_ERROR");

    const promptObject = {
      meta: { level, topic, type: finalZodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`Which of the following equations has the same answer as ${targetEq}?`, `Which of the following equations has the same answer as ${targetEq}?`),
        options: options,
        defectMap: defectMap,
        hint: "[AI: INJECT HINT]",
        finalAnswer: correctEq,
        solutionSteps: `1. ${targetEq} = ${targetSum}.\n2. Only ${correctEq} gives the same total of ${targetSum}.`
      },
      visualEngine: {
        componentToRender: "NONE",
        componentData: {}
      },
      inputRequirement: { inputType: finalInputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story unless replacing the [STORY] placeholder. DO NOT change the "visualEngine" component, "solutionSteps", or "finalAnswer". Return exactly the provided JSON structure, modifying ONLY the hint and array placeholders to match the requirements. ${formatInstructions}
      STRICT: This is an equation equivalence question. Do not generate a story. Keep the question strictly as provided.
      
      CRITICAL VISUAL RULE: "componentData" MUST be an object. NEVER return it as a string.
      
      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'standard', logic: "eq_equiv", hideVisual: true }
    };
  }

  // 9. Standard Fact Family Cards
  if (activeVariant === 'standard_fact_family_cards') {
    const part1 = Math.floor(Math.random() * 40) + 10;
    const part2 = Math.floor(Math.random() * 40) + 10;
    const whole = part1 + part2;
    
    const isAdd = Math.random() > 0.5;
    const operatorWord = isAdd ? 'addition' : 'subtraction';
    
    const answer = isAdd ? `${part1} + ${part2} = ${whole}` : `${whole} - ${part1} = ${part2}`;
    
    const distractors = [];
    if (isAdd) {
      distractors.push(`${whole} + ${part2} = ${part1}`);
      distractors.push(`${part1} + ${whole} = ${part2}`);
      distractors.push(`${part1} + ${part2} = ${whole + 10}`);
    } else {
      distractors.push(`${part1} - ${part2} = ${whole}`);
      distractors.push(`${part2} - ${part1} = ${whole}`);
      distractors.push(`${whole} - ${part2} = ${part1 + 10}`);
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
      aiPrompt: `You are an expert Primary 1 math generator. STRICT VARIANT MANDATE: You are generating a specific logic variant. DO NOT rewrite "questionText" into a story unless replacing the [STORY] placeholder. DO NOT change the "visualEngine" component, "solutionSteps", or "finalAnswer". Return exactly the provided JSON structure, modifying ONLY the hint and array placeholders to match the requirements. ${formatInstructions}
      STRICT: Do not generate a story context. Output the exact question text provided.
      
      CRITICAL VISUAL RULE: "componentData" MUST be an object. NEVER return it as a string.
      
      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'standard', logic: "fact_family_cards", hideVisual: false }
    };
  }
}