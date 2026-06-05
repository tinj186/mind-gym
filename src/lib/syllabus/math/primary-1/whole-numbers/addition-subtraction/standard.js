import { numberToWords } from '@/lib/utils/math-helpers';
import { getRandomContext } from '@/lib/utils/localization';

// Robust extraction helper for localized context objects
const extract = (val) => {
  if (typeof val !== 'object' || val === null) return String(val);
  return val.item || val.singular || val.name?.singular || val.text || val.val || String(val);
};

export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, displayName, getQText, selectedIcon, hideVisual) {
  const commonMeta = { level, topic, type: zodType, difficulty: zodDiff };
  const inputType = isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT';
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
      const o1 = Math.floor(Math.random() * 5); // 0-4 ones
      const t2 = Math.floor(Math.random() * 4) + 1; // 1-4 tens
      const o2 = Math.floor(Math.random() * (9 - o1)); // ones that don't cause regrouping
      num1 = (t1 * 10) + o1;
      num2 = (t2 * 10) + o2;
      answer = String(num1 + num2);
    } else {
      const t1 = Math.floor(Math.random() * 5) + 5; // 5-9 tens
      const o1 = Math.floor(Math.random() * 5) + 4; // 4-8 ones
      const t2 = Math.floor(Math.random() * 4) + 1; // 1-4 tens
      const o2 = Math.floor(Math.random() * (o1 + 1)); // ones that don't cause regrouping
      num1 = (t1 * 10) + o1;
      num2 = (t2 * 10) + o2;
      answer = String(num1 - num2);
    }

    const operator = isAdd ? '+' : '-';
    const options = isMCQ ? [answer, String(parseInt(answer) + 10), String(parseInt(answer) - 10), String(parseInt(answer) + 2)].sort(() => Math.random() - 0.5) : null;

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How many items does ${context.name} have ${isAdd ? 'in total' : 'left'}?`, `${num1} ${operator} ${num2} = ?`),
        options: options,
        hint: "[AI: INJECT HINT]",
        finalAnswer: answer,
        solutionSteps: isAdd 
          ? `1. Add the ones: ${num1 % 10} + ${num2 % 10} = ${(num1 % 10) + (num2 % 10)}.\n2. Add the tens: ${Math.floor(num1 / 10) * 10} + ${Math.floor(num2 / 10) * 10} = ${Math.floor(num1 / 10) * 10 + Math.floor(num2 / 10) * 10}.\n3. Total is ${answer}.`
          : `1. Subtract the ones: ${num1 % 10} - ${num2 % 10} = ${(num1 % 10) - (num2 % 10)}.\n2. Subtract the tens: ${Math.floor(num1 / 10) * 10} - ${Math.floor(num2 / 10) * 10} = ${Math.floor(num1 / 10) * 10 - Math.floor(num2 / 10) * 10}.\n3. Total is ${answer}.`
      },
      visualEngine: {
        componentToRender: isStructure ? "NONE" : "NUMBER_CARDS",
        componentData: isStructure ? {} : { items: [String(num1), operator, String(num2)] }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      ${isShortQ 
        ? 'STRICT: Provide a direct mathematical equation. NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a 1-sentence localized Singaporean math story about ${extract(context.name)} having ${num1} and ${num2} ${itemLabel}.`
      }

      CRITICAL VISUAL RULE: "componentData" MUST be an object. NEVER return it as a string.

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { 
        difficulty: 'standard', 
        steps: 2, 
        logic: isAdd ? "add_no_regroup" : "sub_no_regroup", 
        hideVisual: isStructure 
      }
    };
  }

  // 2. Standard Word Problem Basic (Addition/Subtraction within 100, No Regrouping)
  if (activeVariant === 'standard_word_problem_basic') {
    const isAdd = Math.random() > 0.5;
    let num1, num2, answer;

    if (isAdd) {
      const t1 = Math.floor(Math.random() * 5) + 1; 
      const o1 = Math.floor(Math.random() * 5); 
      const t2 = Math.floor(Math.random() * 4) + 1;
      const o2 = Math.floor(Math.random() * (9 - o1));
      num1 = (t1 * 10) + o1;
      num2 = (t2 * 10) + o2;
      answer = String(num1 + num2);
    } else {
      const t1 = Math.floor(Math.random() * 5) + 5; 
      const o1 = Math.floor(Math.random() * 5) + 4; 
      const t2 = Math.floor(Math.random() * 4) + 1;
      const o2 = Math.floor(Math.random() * (o1 + 1));
      num1 = (t1 * 10) + o1;
      num2 = (t2 * 10) + o2;
      answer = String(num1 - num2);
    }

    const operator = isAdd ? '+' : '-';
    const options = isMCQ ? [answer, String(parseInt(answer) + 1), String(parseInt(answer) - 5), String(parseInt(answer) + 10)].sort(() => Math.random() - 0.5) : null;

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How many does ${context.name} have ${isAdd ? 'altogether' : 'left'}?`, `${num1} ${operator} ${num2} = ?`),
        options: options,
        hint: "[AI: INJECT HINT]",
        finalAnswer: answer,
        solutionSteps: `1. ${num1} ${operator} ${num2} = ${answer}.`
      },
      visualEngine: {
        componentToRender: isStructure ? "NONE" : "NUMBER_CARDS",
        componentData: isStructure ? {} : { items: [String(num1), operator, String(num2)] }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      ${isShortQ 
        ? 'STRICT: Provide a direct mathematical equation. NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a 1-sentence localized Singaporean math story about ${extract(context.name)} having ${num1} and ${num2} ${itemLabel}.`
      }

      CRITICAL VISUAL RULE: "componentData" MUST be an object. NEVER return it as a string.

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { 
        difficulty: 'standard', 
        steps: 2, 
        logic: "wp_basic", 
        hideVisual: isStructure 
      }
    };
  }

  // 3. Add Three Numbers (Standard)
  if (activeVariant === 'standard_add_three_numbers') {
    const n1 = Math.floor(Math.random() * 5) + 3; 
    const n2 = Math.floor(Math.random() * 4) + 2; 
    const n3 = Math.floor(Math.random() * 4) + 1;
    const answer = String(n1 + n2 + n3);

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How many are there in total?`, `${n1} + ${n2} + ${n3} = ?`),
        options: isMCQ ? [answer, String(n1 + n2), String(parseInt(answer) + 2), String(parseInt(answer) - 1)].sort(() => Math.random() - 0.5) : null,
        hint: "[AI: INJECT HINT]",
        finalAnswer: answer,
        solutionSteps: `1. ${n1} + ${n2} = ${n1 + n2}.\n2. ${n1 + n2} + ${n3} = ${answer}.`
      },
      visualEngine: {
        componentToRender: isStructure ? "NONE" : "NUMBER_CARDS",
        componentData: isStructure ? {} : { items: [String(n1), "+", String(n2), "+", String(n3)] }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      ${isShortQ 
        ? 'STRICT: Provide a direct mathematical equation. NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a 1-sentence localized Singaporean story about ${extract(context.name)} and their ${n1}, ${n2}, and ${n3} ${itemLabel}.`
      }

      CRITICAL VISUAL RULE: "componentData" MUST be an object. NEVER return it as a string.

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'standard', logic: "add_3_num", hideVisual: isStructure }
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

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] What is the missing number?`, `Find the missing number: ${equation}`),
        options: isMCQ ? [answer, String(part2 + 10), String(part2 + 1), String(part1)].sort(() => Math.random() - 0.5) : null,
        hint: "[AI: INJECT HINT]",
        finalAnswer: answer,
        solutionSteps: `1. ${whole} - ${part1} = ${answer}.`
      },
      visualEngine: {
        componentToRender: isStructure ? "NONE" : "NUMBER_CARDS",
        componentData: isStructure ? {} : { items: isAdd ? [String(part1), "+", "?", "=", String(whole)] : [String(whole), "-", "?", "=", String(part1)] }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      ${isShortQ 
        ? 'STRICT: Provide a direct mathematical equation. NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a 1-sentence localized Singaporean story.`
      }

      CRITICAL VISUAL RULE: "componentData" MUST be an object. NEVER return it as a string.

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'standard', logic: "missing_part_100", hideVisual: isStructure }
    };
  }

  // 5. Related Fact Families
  if (activeVariant === 'standard_related_fact_families') {
    const part1 = Math.floor(Math.random() * 9) + 10; // 10-18
    const part2 = Math.floor(Math.random() * 5) + 2;  // 2-6
    const whole = part1 + part2;
    const answer = String(part1);

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] If ${part1} + ${part2} = ${whole}, what is ${whole} - ${part2}?`, `If ${part1} + ${part2} = ${whole}, then ${whole} - ${part2} = ?`),
        options: isMCQ ? [answer, String(part2), String(whole), String(part1 + 10)].sort(() => Math.random() - 0.5) : null,
        hint: "[AI: INJECT HINT]",
        finalAnswer: answer,
        solutionSteps: `1. Since ${part1} + ${part2} = ${whole}, we know that ${whole} - ${part2} must be the other part.\n2. The other part is ${part1}.`
      },
      visualEngine: {
        componentToRender: "NONE",
        componentData: {}
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      ${isShortQ 
        ? 'STRICT: Provide a direct mathematical equation. NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a 1-sentence localized Singaporean story about related facts.`
      }

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

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How many ${itemLabel} does the other person have?`, equation),
        options: isMCQ ? [answer, String(val1), String(val1 + 10), String(val2 + 1)].sort(() => Math.random() - 0.5) : null,
        hint: "[AI: INJECT HINT]",
        finalAnswer: answer,
        solutionSteps: `1. ${val1} ${isMore ? '+' : '-'} ${diff} = ${answer}.`
      },
      visualEngine: {
        componentToRender: isStructure ? "NONE" : "NUMBER_CARDS",
        componentData: isStructure ? {} : { items: [String(val1), isMore ? "+" : "-", String(diff)] }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      ${isShortQ 
        ? 'STRICT: Provide a direct mathematical equation. NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a localized Singaporean story: "${extract(context.name)} has ${val1} ${itemLabel}. Another person has ${diff} ${isMore ? 'more' : 'fewer'} than ${extract(context.name)}."`
      }

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'standard', logic: "comparison_basic", hideVisual: isStructure }
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

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] ${qTextSuffix}`, missingPos === 0 ? "Complete the number bond." : `Complete the number bond for ${whole}.`),
        options: isMCQ ? [answer, String(parseInt(answer) + 10), String(parseInt(answer) + 1), String(missingPos === 0 ? part1 : whole)].sort(() => Math.random() - 0.5) : null,
        hint: "[AI: INJECT HINT]",
        finalAnswer: answer,
        solutionSteps: solutionSteps
      },
      visualEngine: {
        componentToRender: "NUMBER_BOND",
        componentData: { ...visualData, icon: selectedIcon }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      ${isShortQ 
        ? 'STRICT: Provide a direct question about the number bond. NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a 1-sentence localized Singaporean story about ${missingPos === 0 ? `combining ${part1} and ${part2} ${itemLabel}` : `splitting ${whole} ${itemLabel} into two groups`}.`
      }

      CRITICAL VISUAL RULE: "componentData" MUST be an object. NEVER return it as a string.

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'standard', logic: "bond_100", hideVisual: false }
    };
  }
}