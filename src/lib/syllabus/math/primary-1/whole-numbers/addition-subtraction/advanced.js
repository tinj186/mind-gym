import { numberToWords } from '@/lib/utils/math-helpers';
import { getRandomContext } from '@/lib/utils/localization';

// Robust extraction helper for localized context objects
const extract = (val) => {
  if (typeof val !== 'object' || val === null) return String(val);
  return val.item || val.singular || val.name?.singular || val.text || val.val || String(val);
};

export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, displayName, getQText, selectedIcon, hideVisual) {
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

  // 1. Advanced Addition/Subtraction Regrouping
  if (activeVariant === 'advanced_add_regrouping' || activeVariant === 'advanced_sub_regrouping') {
    const isAdd = activeVariant.includes('add');
    let num1, num2, answer;

    if (isAdd) {
      num1 = Math.floor(Math.random() * 30) + 18; // e.g. 25
      num2 = Math.floor(Math.random() * 9) + 6;  // e.g. 7 (forces regrouping)
      answer = String(num1 + num2);
    } else {
      num1 = Math.floor(Math.random() * 40) + 42; // e.g. 52
      num2 = Math.floor(Math.random() * 9) + (num1 % 10) + 1; // e.g. if num1 ends in 2, num2 could be 3-9 to force regrouping
      answer = String(num1 - num2);
    }

    const operator = isAdd ? '+' : '-';
    let options = null;
    let defectMap = null;
    if (isMCQ) {
      const wrongOpAnswer = isAdd ? String(num1 - num2) : String(num1 + num2);
      options = Array.from(new Set([answer, wrongOpAnswer, String(parseInt(answer) - 1), String(parseInt(answer) + 10)])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [wrongOpAnswer]: "CONFUSED_OPERATION"
      };
      options.forEach(opt => { if (opt !== answer && opt !== wrongOpAnswer) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How many items does ${context.name} have ${isAdd ? 'now' : 'left'}?`, `${num1} ${operator} ${num2} = ?`),
        options: options,
        defectMap: defectMap,
        hint: "[AI: INJECT HINT]",
        finalAnswer: answer,
        solutionSteps: isAdd 
          ? `1. First, add the ones: ${num1 % 10} + ${num2 % 10} = ${(num1 % 10) + (num2 % 10)}.\n2. Regroup 10 ones into 1 ten.\n3. Then add the tens.\n4. Total is ${answer}.`
          : `1. Since we cannot subtract ${num2 % 10} from ${num1 % 10}, regroup 1 ten from ${Math.floor(num1 / 10)} tens as 10 ones.\n2. Now subtract the ones: ${num1 % 10 + 10} - ${num2 % 10} = ${num1 % 10 + 10 - num2 % 10}.\n3. Then subtract the remaining tens.\n4. Answer is ${answer}.`
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
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a creative 1-sentence localized Singaporean math story about ${extract(context.name)} and ${itemLabel} involving ${isAdd ? 'regrouping ones into tens' : 'regrouping tens into ones'}.`
      }

      CRITICAL VISUAL RULE: "componentData" MUST be an object. NEVER return it as a string.

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { 
        difficulty: 'advanced', 
        steps: 3, 
        logic: isAdd ? "add_regroup" : "sub_regroup", 
        hideVisual: isStructure 
      }
    };
  }

  // 2. Advanced Comparative More
  if (activeVariant === 'advanced_comparative_more') {
    const num1 = Math.floor(Math.random() * 30) + 20; // Base number
    const num2 = Math.floor(Math.random() * 20) + 10; // "More than" value
    const answer = String(num1 + num2);
    
    let options = null;
    let defectMap = null;
    if (isMCQ) {
      const wrongOpAnswer = String(num1 - num2);
      options = Array.from(new Set([answer, wrongOpAnswer, String(num1 + 10), String(num1)])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [String(num1)]: "CONSTANT_VIOLATION",
        [wrongOpAnswer]: "CONFUSED_OPERATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How many items does the second person have?`, `What is ${num2} more than ${num1}?`),
        options: options,
        defectMap: defectMap,
        hint: "[AI: INJECT HINT]",
        finalAnswer: answer,
        solutionSteps: `1. To find "more than", we add the numbers.\n2. ${num1} + ${num2} = ${answer}.`
      },
      visualEngine: { componentToRender: "NONE", componentData: {} },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      ${isShortQ 
        ? 'STRICT: Provide a direct mathematical question (e.g., "What is X more than Y?"). NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a creative 1-sentence localized Singaporean story about finding an amount that is ${num2} more than ${num1} ${itemLabel}.`
      }

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { 
        difficulty: 'advanced', 
        steps: 3, 
        logic: "comparative_more", 
        hideVisual: true 
      }
    };
  }

  // 3. Advanced Comparative Less
  if (activeVariant === 'advanced_comparative_less') {
    const num1 = Math.floor(Math.random() * 30) + 50; // Base number
    const num2 = Math.floor(Math.random() * 20) + 5; // "Less than" value
    const answer = String(num1 - num2);
    
    let options = null;
    let defectMap = null;
    if (isMCQ) {
      const wrongOpAnswer = String(num1 + num2);
      options = Array.from(new Set([answer, wrongOpAnswer, String(num1 - 10), String(num1)])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [String(num1)]: "CONSTANT_VIOLATION",
        [wrongOpAnswer]: "CONFUSED_OPERATION"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How many items does the second person have?`, `What is ${num2} less than ${num1}?`),
        options: options,
        defectMap: defectMap,
        hint: "[AI: INJECT HINT]",
        finalAnswer: answer,
        solutionSteps: `1. To find "less than", we subtract.\n2. ${num1} - ${num2} = ${answer}.`
      },
      visualEngine: { componentToRender: "NONE", componentData: {} },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      ${isShortQ 
        ? 'STRICT: Provide a direct mathematical question (e.g., "What is X less than Y?"). NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a creative 1-sentence localized Singaporean story about finding an amount that is ${num2} less than ${num1} ${itemLabel}.`
      }

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { 
        difficulty: 'advanced', 
        steps: 3, 
        logic: "comparative_less", 
        hideVisual: true 
      }
    };
  }

  // 4. Advanced Cross Ordinal Queue
  if (activeVariant === 'advanced_cross_ordinal_queue') {
    const inFront = Math.floor(Math.random() * 10) + 10; // People in front
    const behind = Math.floor(Math.random() * 10) + 5; // People behind
    const totalPeople = inFront + behind + 1;
    const answer = String(totalPeople);
    
    let options = null;
    let defectMap = null;
    if (isMCQ) {
      const wrongAnswer = String(inFront + behind);
      options = Array.from(new Set([answer, wrongAnswer, String(inFront + behind - 1), String(inFront + 1)])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [wrongAnswer]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How many people are there in the queue altogether?`, `There are ${inFront} people in front of ${extract(context.name)} and ${behind} people behind. How many people are in the queue?`),
        options: options,
        defectMap: defectMap,
        hint: "[AI: INJECT HINT]",
        finalAnswer: answer,
        solutionSteps: `1. Add the people in front: ${inFront}.\n2. Add ${extract(context.name)} themselves: 1.\n3. Add the people behind: ${behind}.\n4. Total: ${inFront} + 1 + ${behind} = ${answer}.`
      },
      visualEngine: { componentToRender: "NONE", componentData: {} },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      ${isShortQ 
        ? 'STRICT: Provide a direct mathematical question. NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a creative 1-sentence localized Singaporean story about ${extract(context.name)} being in a queue.`
      }

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { 
        difficulty: 'advanced', 
        steps: 3, 
        logic: "cross_ordinal_queue", 
        hideVisual: true 
      }
    };
  }

  // 6. Balance Equations
  if (activeVariant === 'advanced_balance_equations') {
    const left1 = Math.floor(Math.random() * 15) + 10;
    const left2 = Math.floor(Math.random() * 10) + 5;
    const sum = left1 + left2;
    const right1 = Math.floor(Math.random() * 10) + sum - 15; // Ensure right1 is smaller than sum
    let options = null;
    let defectMap = null;
    if (isMCQ) {
      options = Array.from(new Set([answer, String(sum), String(parseInt(answer) + 10), String(parseInt(answer) - 2)])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {
        [String(sum)]: "CONCEPTUAL_ERROR"
      };
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How many more must be added to the second group to make them equal?`, `${left1} + ${left2} = ${right1} + ?`),
        options: options,
        defectMap: defectMap,
        hint: "[AI: INJECT HINT]",
        finalAnswer: answer,
        solutionSteps: `1. Find the total of the first group: ${left1} + ${left2} = ${sum}.\n2. To make the other side equal ${sum}, we subtract the known amount: ${sum} - ${right1} = ${answer}.`
      },
      visualEngine: { componentToRender: "NONE", componentData: {} },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      ${isShortQ 
        ? 'STRICT: Provide a direct mathematical equation (e.g. A + B = C + ?). NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a creative 1-sentence localized Singaporean story about balancing two groups of ${itemLabel}.`
      }

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'advanced', logic: "balance_eq", hideVisual: isStructure }
    };
  }

  // 7. Working Backwards Heuristic
  if (activeVariant === 'advanced_working_backwards') {
    const start = Math.floor(Math.random() * 20) + 20; 
    const change1 = Math.floor(Math.random() * 10) + 5; // e.g., gave away 8
    const change2 = Math.floor(Math.random() * 10) + 2; // e.g., got 4
    const finalAmount = start - change1 + change2;
    const answer = String(start);

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How many did ${extract(context.name)} have at first?`, `? - ${change1} + ${change2} = ${finalAmount}. Find the starting number.`),
        options: options,
        defectMap: defectMap,
        hint: "[AI: INJECT HINT]",
        finalAnswer: answer,
        solutionSteps: `1. Work backwards from the final amount: ${finalAmount}.\n2. Reverse the last change: ${finalAmount} - ${change2} = ${finalAmount - change2}.\n3. Reverse the first change: ${finalAmount - change2} + ${change1} = ${answer}.`
      },
      visualEngine: { componentToRender: "NONE", componentData: {} },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      ${isShortQ 
        ? 'STRICT: Provide a direct mathematical equation involving a missing start (e.g. ? - X + Y = Z). NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a creative 1-sentence localized Singaporean word problem requiring the student to work backwards to find the starting number of ${itemLabel}.`
      }

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'advanced', logic: "working_backwards", hideVisual: isStructure }
    };
  }

  // 8. Two-Step Total (Comparative + Sum)
  if (activeVariant === 'advanced_two_step_total') {
    const aAmount = Math.floor(Math.random() * 20) + 15;
    const diff = Math.floor(Math.random() * 10) + 3;
    const bAmount = aAmount + diff; // B has 'diff' more than A
    const total = aAmount + bAmount;
    const answer = String(total);

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] How many do they have altogether?`, `[Person 1] has ${aAmount} ${itemLabel}. [Person 2] has ${diff} more than [Person 1]. How many do they have in total?`),
        options: options,
        defectMap: defectMap,
        hint: "[AI: INJECT HINT]",
        finalAnswer: answer,
        solutionSteps: `1. Find how many items the second person has: ${aAmount} + ${diff} = ${bAmount}.\n2. Find the total by adding both amounts: ${aAmount} + ${bAmount} = ${answer}.`
      },
      visualEngine: { componentToRender: "NONE", componentData: {} },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      ${isShortQ 
        ? 'STRICT: Provide a direct two-step mathematical question. NO story context. Use generic labels if necessary, but keep it purely mathematical.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a creative 1-sentence localized Singaporean story involving ${extract(context.name)} and another person. Do NOT use "A" and "B" or "Person 1" and "Person 2". Use real names (e.g., Siti, Ahmad, Wei Ling). Describe a scenario involving ${itemLabel} where one person has ${aAmount} and the other has ${diff} more.`
      }

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'advanced', logic: "two_step_total", hideVisual: true }
    };
  }

  // 9. Shape Substitution
  if (activeVariant === 'advanced_shape_substitution') {
    const shape1Val = Math.floor(Math.random() * 8) + 4; // 4 to 11
    const shape2Val = Math.floor(Math.random() * 9) + 2; 
    const eq1Sum = shape1Val * 2;
    const eq2Sum = shape1Val + shape2Val;
    const answer = String(shape2Val);

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] Find the value of the circle.`, `▲ + ▲ = ${eq1Sum}. ▲ + ● = ${eq2Sum}. What is ●?`),
        options: options,
        defectMap: defectMap,
        hint: "[AI: INJECT HINT]",
        finalAnswer: answer,
        solutionSteps: `1. ▲ + ▲ = ${eq1Sum}, so ▲ is ${shape1Val}.\n2. Substitute into the second equation: ${shape1Val} + ● = ${eq2Sum}.\n3. Therefore, ● = ${eq2Sum} - ${shape1Val} = ${answer}.`
      },
      visualEngine: { componentToRender: "NONE", componentData: {} },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      ${isShortQ 
        ? 'STRICT: Provide a direct shape logic question. NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a creative 1-sentence localized story involving objects being used as symbols/shapes.`
      }

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'advanced', logic: "shape_substitution", hideVisual: true }
    };
  }

  // 10. Missing Digit Regrouping
  if (activeVariant === 'advanced_missing_digit_regrouping') {
    const tens1 = Math.floor(Math.random() * 3) + 2; // 2, 3, 4
    const ones1 = Math.floor(Math.random() * 4) + 6; // 6-9 (to force regrouping)
    const num2 = Math.floor(Math.random() * 8) + 14; 
    const sum = (tens1 * 10 + ones1) + num2;
    const answer = String(ones1);

    const promptObject = {
      meta: { level, topic, type: zodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`[STORY] The sum is ${sum}. What is the missing digit in the first number?`, `${tens1}? + ${num2} = ${sum}.`),
        options: options,
        defectMap: defectMap,
        hint: "[AI: INJECT HINT]",
        finalAnswer: answer,
        solutionSteps: `1. To find the whole first number, do ${sum} - ${num2} = ${tens1 * 10 + ones1}.\n2. The missing ones digit is ${answer}.`
      },
      visualEngine: {
        componentToRender: "NUMBER_CARDS",
        componentData: { items: [`${tens1}?`, "+", String(num2), "=", String(sum)], hideVisual: false }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      ${isShortQ 
        ? 'STRICT: Provide a direct missing digit question (e.g. 2? + 14 = 38). NO story context or names.' 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a creative 1-sentence localized Singaporean story involving ${extract(context.name)} and ${itemLabel}. The story should describe a reason why a digit is missing, using varied scenarios such as an ink blot, a torn piece of paper, a hidden sticker, or a smudge. Do NOT always use the same theme.`
      }

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'advanced', logic: "missing_digit", hideVisual: isStructure }
    };
  }

  // 11. Advanced Equation Equivalence
  if (activeVariant === 'advanced_equation_equivalence') {
    // Force MCQ
    const finalInputType = 'MCQ_BUTTONS';
    const finalZodType = 'MCQ';
    
    const isAdd = Math.random() > 0.5;
    let targetEq, targetSum;
    let d1_sum, d2_sum, d3_sum;

    if (isAdd) {
      const o1 = Math.floor(Math.random() * 4) + 5; // 5-8
      const t1 = Math.floor(Math.random() * 4) + 2; // 20-50
      const num1 = t1 * 10 + o1;
      
      const o2 = Math.floor(Math.random() * (9 - (10 - o1))) + (10 - o1); // forces o1 + o2 >= 10
      const t2 = Math.floor(Math.random() * 3) + 1; // 10-30
      const num2 = t2 * 10 + o2;
      
      targetSum = num1 + num2;
      targetEq = `${num1} + ${num2}`;
      
      d1_sum = targetSum - 10; // Forgot to carry
      d2_sum = targetSum + 10; // Carried twice
      d3_sum = (t1 + t2) * 10 + Math.abs(o1 - o2); // Subtracted ones instead of adding
    } else {
      const o1 = Math.floor(Math.random() * 4) + 1; // 1-4
      const t1 = Math.floor(Math.random() * 4) + 5; // 50-80
      const num1 = t1 * 10 + o1;
      
      const o2 = Math.floor(Math.random() * 4) + 5; // 5-8 (ensures o2 > o1)
      const t2 = Math.floor(Math.random() * 3) + 1; // 10-30
      const num2 = t2 * 10 + o2;
      
      targetSum = num1 - num2;
      targetEq = `${num1} - ${num2}`;
      
      d1_sum = (t1 - t2) * 10 + Math.abs(o1 - o2); // Always subtracted smaller from larger
      d2_sum = targetSum - 10; // Borrowed twice
      d3_sum = targetSum + 10; // Forgot to borrow correctly
    }

    // Correct equation (use subtraction so it looks different)
    const c_num1 = targetSum + 13;
    const correctEq = `${c_num1} - 13`;

    // Distractor equations
    const distractor1 = `${d1_sum + 11} - 11`;
    const distractor2 = `${d2_sum + 12} - 12`;
    const distractor3 = `${d3_sum + 14} - 14`;

    const options = [correctEq, distractor1, distractor2, distractor3].sort(() => Math.random() - 0.5);
    let defectMap = {};
    [distractor1, distractor2, distractor3].forEach(d => defectMap[d] = "CONCEPTUAL_ERROR");

    const promptObject = {
      meta: { level, topic, type: finalZodType, difficulty: zodDiff },
      content: {
        questionText: getQText(`Which of the following equations has the same answer as ${targetEq}?`, `Which of the following equations has the same answer as ${targetEq}?`),
        options: options,
        defectMap: defectMap,
        hint: "[AI: INJECT HINT]",
        finalAnswer: correctEq,
        solutionSteps: `1. ${targetEq} = ${targetSum}.\n2. Only ${correctEq} gives the same answer of ${targetSum}.`
      },
      visualEngine: { componentToRender: "NONE", componentData: {} },
      inputRequirement: { inputType: finalInputType }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      STRICT: This is an advanced equation equivalence question. Do not generate a story. Keep the question strictly as provided.
      
      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'advanced', logic: "eq_equiv_regrouping", hideVisual: true }
    };
  }
}