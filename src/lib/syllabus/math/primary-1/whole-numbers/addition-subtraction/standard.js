import { numberToWords } from '@/lib/utils/math-helpers';
import { getRandomContext } from '@/lib/utils/localization';

export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, hideVisual) {
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
  const itemLabel = selectedContextItem?.item || 'items';

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
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] How many items does ${context.name} have ${isAdd ? 'in total' : 'left'}?`, `${num1} ${operator} ${num2} = ?`),
        options: options,
        finalAnswer: answer,
        solutionSteps: isAdd 
          ? `Add the ones: ${num1 % 10} + ${num2 % 10} = ${(num1 % 10) + (num2 % 10)}. Add the tens: ${Math.floor(num1 / 10)}0 + ${Math.floor(num2 / 10)}0 = ${Math.floor(num1 / 10) * 10 + Math.floor(num2 / 10) * 10}. Total is ${answer}.`
          : `Subtract the ones: ${num1 % 10} - ${num2 % 10} = ${(num1 % 10) - (num2 % 10)}. Subtract the tens: ${Math.floor(num1 / 10)}0 - ${Math.floor(num2 / 10)}0 = ${Math.floor(num1 / 10) * 10 - Math.floor(num2 / 10) * 10}. Total is ${answer}.`
      },
      visualEngine: {
        componentToRender: "NUMBER_CARDS", // Always render number cards for these types
        componentData: { 
          items: [String(num1), String(num2)], 
          hideVisual: isShortQ 
        }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate ? readingMandate + '\n' : ''}STRICT: Return ONLY valid JSON.
      ${isShortQ 
        ? `JSON TEMPLATE:\n${JSON.stringify(promptObject)}`
        : `Task: Replace the "[STORY]" placeholder in the questionText with a 1-sentence Singaporean story about ${context.name} having ${num1} and ${num2} ${itemLabel}. DO NOT reveal the answer, but include the numbers ${num1} and ${num2}.\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
      }`,
      metadata: { 
        difficulty: 'standard', 
        steps: 2, 
        logic: isAdd ? "add_no_regroup" : "sub_no_regroup", 
        hideVisual: isShortQ 
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
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] How many does ${context.name} have ${isAdd ? 'altogether' : 'left'}?`, `${num1} ${operator} ${num2} = ?`),
        options: options,
        finalAnswer: answer,
        solutionSteps: `${num1} ${operator} ${num2} = ${answer}.`
      },
      visualEngine: {
        componentToRender: "NUMBER_CARDS", 
        componentData: { items: [String(num1), String(num2)], hideVisual: isShortQ }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate ? readingMandate + '\n' : ''}STRICT: Return ONLY valid JSON.
      ${isShortQ 
        ? `JSON TEMPLATE:\n${JSON.stringify(promptObject)}`
        : `Task: Replace the "[STORY]" placeholder in the questionText with a 1-sentence Singaporean story about ${context.name} having ${num1} and ${num2} ${itemLabel}. include the numbers ${num1} and ${num2}.\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
      }`,
      metadata: { 
        difficulty: 'standard', 
        steps: 2, 
        logic: "wp_basic", 
        hideVisual: isShortQ 
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
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] How many are there in total?`, `${n1} + ${n2} + ${n3} = ?`),
        options: isMCQ ? [answer, String(n1 + n2), String(parseInt(answer) + 2), String(parseInt(answer) - 1)].sort(() => Math.random() - 0.5) : null,
        finalAnswer: answer,
        solutionSteps: `${n1} + ${n2} = ${n1 + n2}. Then ${n1 + n2} + ${n3} = ${answer}.`
      },
      visualEngine: {
        componentToRender: "NUMBER_CARDS",
        componentData: { items: [String(n1), String(n2), String(n3)], operator: "+", hideVisual: isShortQ }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate ? readingMandate + '\n' : ''}STRICT: Return ONLY valid JSON.
      ${isShortQ 
        ? `JSON TEMPLATE:\n${JSON.stringify(promptObject)}`
        : `Task: Replace the "[STORY]" placeholder in the questionText with a 1-sentence Singaporean story about ${context.name} and ${n1}, ${n2}, and ${n3} ${itemLabel}.\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
      }`,
      metadata: { difficulty: 'standard', logic: "add_3_num", hideVisual: isShortQ }
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
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] What is the missing number?`, `Find the missing number: ${equation}`),
        options: isMCQ ? [answer, String(part2 + 10), String(part2 + 1), String(part1)].sort(() => Math.random() - 0.5) : null,
        finalAnswer: answer,
        solutionSteps: isAdd ? `${whole} - ${part1} = ${answer}.` : `${whole} - ${part1} = ${answer}.`
      },
      visualEngine: {
        componentToRender: "NONE",
        componentData: { 
          items: [String(isAdd ? part1 : whole), isAdd ? "+" : "-", "?"], 
          target: String(isAdd ? whole : part1), 
          hideVisual: true
        }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate ? readingMandate + '\n' : ''}STRICT: Return ONLY valid JSON.
      ${isShortQ 
        ? `JSON TEMPLATE:\n${JSON.stringify(promptObject)}`
        : `Task: Replace the "[STORY]" placeholder in the questionText with a 1-sentence Singaporean story using only the numbers ${isAdd ? part1 : whole} and ${isAdd ? whole : part1}. DO NOT mention or reveal the missing number (${answer}) in the story text.\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
      }`,
      metadata: { difficulty: 'standard', logic: "missing_part_100", hideVisual: true }
    };
  }

  // 5. Related Fact Families
  if (activeVariant === 'standard_related_fact_families') {
    const part1 = Math.floor(Math.random() * 9) + 10; // 10-18
    const part2 = Math.floor(Math.random() * 5) + 2;  // 2-6
    const whole = part1 + part2;
    const answer = String(part1);

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] If ${part1} + ${part2} = ${whole}, what is ${whole} - ${part2}?`, `If ${part1} + ${part2} = ${whole}, then ${whole} - ${part2} = ?`),
        options: isMCQ ? [answer, String(part2), String(whole), String(part1 + 10)].sort(() => Math.random() - 0.5) : null,
        finalAnswer: answer,
        solutionSteps: `Since ${part1} + ${part2} = ${whole}, we know that ${whole} - ${part2} must be the other part, which is ${part1}.`
      },
      visualEngine: {
        componentToRender: "NONE",
        componentData: { hideVisual: true }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate ? readingMandate + '\n' : ''}STRICT: Return ONLY valid JSON.
      ${isShortQ 
        ? `JSON TEMPLATE:\n${JSON.stringify(promptObject)}`
        : `Task: Replace the "[STORY]" placeholder in the questionText with a 1-sentence Singaporean story about related addition and subtraction facts.\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
      }`,
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

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: `[STORY] How many ${itemLabel} does the other person have?`,
        options: isMCQ ? [answer, String(val1), String(val1 + 10), String(val2 + 1)].sort(() => Math.random() - 0.5) : null,
        finalAnswer: answer,
        solutionSteps: isMore ? `${val1} + ${diff} = ${answer}` : `${val1} - ${diff} = ${answer}`
      },
      visualEngine: {
        componentToRender: "COUNTING_OBJECTS",
        componentData: { items: [String(val1), String(diff)], operator: isMore ? "+" : "-", hideVisual: false }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate ? readingMandate + '\n' : ''}STRICT: Return ONLY valid JSON.
      Task: Replace the "[STORY]" tag in the questionText with a Singaporean story: "${context.name} has ${val1} ${itemLabel}. Another person has ${diff} ${isMore ? 'more' : 'fewer'} than ${context.name}."
      
      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'standard', logic: "comparison_basic", hideVisual: false }
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
      solutionSteps = `${part1} + ${part2} = ${whole}.`;
      visualData = { whole: "?", part1: String(part1), part2: String(part2), hideVisual: false };
    } else if (missingPos === 1) { // Left part is missing
      answer = String(part1);
      qTextSuffix = "How many are in the first group?";
      solutionSteps = `${whole} - ${part2} = ${part1}.`;
      visualData = { whole: String(whole), part1: "?", part2: String(part2), hideVisual: false };
    } else { // Right part is missing
      answer = String(part2);
      qTextSuffix = "How many are in the other group?";
      solutionSteps = `${whole} - ${part1} = ${part2}.`;
      visualData = { whole: String(whole), part1: String(part1), part2: "?", hideVisual: false };
    }

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] ${qTextSuffix}`, missingPos === 0 ? "Complete the number bond." : `Complete the number bond for ${whole}.`),
        options: isMCQ ? [answer, String(parseInt(answer) + 10), String(parseInt(answer) + 1), String(missingPos === 0 ? part1 : whole)].sort(() => Math.random() - 0.5) : null,
        finalAnswer: answer,
        solutionSteps: solutionSteps
      },
      visualEngine: {
        componentToRender: "NUMBER_BOND",
        componentData: visualData
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate ? readingMandate + '\n' : ''}STRICT: Return ONLY valid JSON.
      ${isShortQ 
        ? `JSON TEMPLATE:\n${JSON.stringify(promptObject)}`
        : `Task: Replace the "[STORY]" placeholder in the questionText with a 1-sentence Singaporean story.
      ${missingPos === 0
        ? `The story should be about combining ${part1} ${itemLabel} and ${part2} ${itemLabel} to find the total.`
        : `The story should be about splitting ${whole} ${itemLabel} into two groups, where one has ${missingPos === 1 ? part2 : part1}.`
      }
      The story MUST be localized (e.g., using names like Siti and settings like a hawker centre) and include the relevant numbers.\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`
      }`,
      metadata: { difficulty: 'standard', logic: "bond_100", hideVisual: false }
    };
  }
}