import { getRandomContext } from '@/lib/utils/localization';
import { numberToWords } from '@/lib/utils/math-helpers';
import { getRandomNames } from '@/lib/utils/variable-bank';

const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);
const generateMoneyString = (cents) => {
  if (cents % 100 === 0) return `$${cents / 100}`;
  if (cents > 100) return `$${Math.floor(cents / 100)} and ${cents % 100}¢`;
  return `${cents}¢`;
};

export const foundationVariants = {
  foundation_counting_coins: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
    const pool = ['5¢', '10¢', '20¢', '50¢'];
    const itemCount = Math.floor(Math.random() * 3) + 3; 
    const generatedItems = [];
    let sumCents = 0;

    for (let i = 0; i < itemCount; i++) {
      const item = pool[Math.floor(Math.random() * pool.length)];
      const valCents = parseInt(item.replace('¢', ''), 10);
      if (sumCents + valCents <= 100) { generatedItems.push(item); sumCents += valCents; }
    }
    if (generatedItems.length === 0) { generatedItems.push('50¢', '20¢'); sumCents = 70; }

    const displayTotal = generateMoneyString(sumCents);
    const answer = displayTotal;
    const componentData = { items: generatedItems, total: displayTotal };

    const questionTextTemplate = getQText(`Count the total amount of money shown below.`, `Total amount = ?`);
    const randomName = getRandomNames(1);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question." : `STRICT: Keep the mathematical sentences in "questionText" exactly as they are! Just replace the "[STORY]" tag at the beginning with a 1-sentence Singaporean math story context (e.g. '${randomName} went to the shop.'). DO NOT delete the math question! IMPORTANT: In Singapore, $2, $5, $10 are notes. 5¢, 10¢, 20¢, 50¢, $1 are coins.`;

    let options = [answer, generateMoneyString(sumCents + 10), generateMoneyString(Math.max(10, sumCents - 10)), generateMoneyString(sumCents + 20)];
    options = getShuffledOptions(answer, options);

    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "subtopic": "${subtopic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Count the values of all coins carefully!`, `Add all coin values.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Add the values together: ${generatedItems.join(' + ')} = ${displayTotal}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "SINGAPORE_MONEY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE COUNTING PROCESS (e.g., adding dollars first, then cents)]"' : ''} }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "counting_coins", hideVisual: false }
    };
  },

  foundation_identifying_notes: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
    const pool = ['$2', '$5', '$10'];
    const itemCount = Math.floor(Math.random() * 2) + 2; 
    const generatedItems = [];
    let sumCents = 0;

    for (let i = 0; i < itemCount; i++) {
      const item = pool[Math.floor(Math.random() * pool.length)];
      const valCents = parseInt(item.replace('$', ''), 10) * 100;
      if (sumCents + valCents <= 2000) { generatedItems.push(item); sumCents += valCents; }
    }
    if (generatedItems.length === 0) { generatedItems.push('$2', '$5'); sumCents = 700; }

    const displayTotal = generateMoneyString(sumCents);
    const answer = displayTotal;
    const componentData = { items: generatedItems, total: displayTotal };

    const questionTextTemplate = getQText(`Count the total amount of money shown below.`, `Total amount = ?`);
    const randomName = getRandomNames(1);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question." : `STRICT: Keep the mathematical sentences in "questionText" exactly as they are! Just replace the "[STORY]" tag at the beginning with a 1-sentence Singaporean math story context (e.g. '${randomName} went to the shop.'). DO NOT delete the math question! IMPORTANT: In Singapore, $2, $5, $10 are notes. 5¢, 10¢, 20¢, 50¢, $1 are coins.`;

    let options = [answer, generateMoneyString(sumCents + 100), generateMoneyString(Math.max(200, sumCents - 100)), generateMoneyString(sumCents + 200)];
    options = getShuffledOptions(answer, options);

    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "subtopic": "${subtopic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Count the values of all notes carefully!`, `Add all note values.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Add the values together: ${generatedItems.join(' + ')} = ${displayTotal}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "SINGAPORE_MONEY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE COUNTING PROCESS (e.g., adding dollars first, then cents)]"' : ''} }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "identifying_notes", hideVisual: false }
    };
  },

  foundation_mixed_counting: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
    const pool = ['10¢', '20¢', '50¢', '$1', '$2', '$5', '$10'];
    const itemCount = Math.floor(Math.random() * 3) + 4; 
    const generatedItems = [];
    let sumCents = 0;

    for (let i = 0; i < itemCount; i++) {
      const item = pool[Math.floor(Math.random() * pool.length)];
      const valCents = item.endsWith('¢') ? parseInt(item.replace('¢', ''), 10) : parseInt(item.replace('$', ''), 10) * 100;
      if (sumCents + valCents <= 2000) { generatedItems.push(item); sumCents += valCents; }
    }
    if (generatedItems.length === 0) { generatedItems.push('$2', '50¢'); sumCents = 250; }

    const displayTotal = generateMoneyString(sumCents);
    const answer = displayTotal;
    const componentData = { items: generatedItems, total: displayTotal };

    const questionTextTemplate = getQText(`Count the total amount of money shown below.`, `Total amount = ?`);
    const randomName = getRandomNames(1);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question." : `STRICT: Keep the mathematical sentences in "questionText" exactly as they are! Just replace the "[STORY]" tag at the beginning with a 1-sentence Singaporean math story context (e.g. '${randomName} went to the shop.'). DO NOT delete the math question! IMPORTANT: In Singapore, $2, $5, $10 are notes. 5¢, 10¢, 20¢, 50¢, $1 are coins.`;

    let options = [answer, generateMoneyString(sumCents + 10), generateMoneyString(Math.max(50, sumCents - 10)), generateMoneyString(sumCents + 50)];
    options = getShuffledOptions(answer, options);

    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "subtopic": "${subtopic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Count the dollars first, then add the cents!`, `Add dollars then cents.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Add the values together: ${generatedItems.join(' + ')} = ${displayTotal}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "SINGAPORE_MONEY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE COUNTING PROCESS (e.g., adding dollars first, then cents)]"' : ''} }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "mixed_counting", hideVisual: false }
    };
  },

  foundation_comparing_values: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
    const pool = ['10¢', '20¢', '50¢', '$1', '$2', '$5', '$10'];
    const itemCount = Math.floor(Math.random() * 3) + 4; 
    const generatedItems = [];
    let sumCents = 0;

    for (let i = 0; i < itemCount; i++) {
      const item = pool[Math.floor(Math.random() * pool.length)];
      const valCents = item.endsWith('¢') ? parseInt(item.replace('¢', ''), 10) : parseInt(item.replace('$', ''), 10) * 100;
      if (sumCents + valCents <= 2000) { generatedItems.push(item); sumCents += valCents; }
    }
    if (generatedItems.length === 0) { generatedItems.push('$2', '50¢'); sumCents = 250; }
    
    const displayTotal = generateMoneyString(sumCents);
    const targetPriceCents = sumCents + (Math.random() > 0.5 ? 50 : -50);
    const targetPriceStr = generateMoneyString(targetPriceCents);
    const answer = sumCents >= targetPriceCents ? "Yes" : "No";
    const componentData = { items: generatedItems, total: displayTotal };

    const questionTextTemplate = getQText(`An item costs ${targetPriceStr}. Is the amount of money shown enough to buy it?`, `Is amount shown enough for ${targetPriceStr}?`);
    const randomName = getRandomNames(1);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question." : `STRICT: Keep the mathematical sentences in "questionText" exactly as they are! Just replace the "[STORY]" tag at the beginning with a 1-sentence Singaporean math story context (e.g. '${randomName} went to the shop.'). DO NOT delete the math question! IMPORTANT: In Singapore, $2, $5, $10 are notes. 5¢, 10¢, 20¢, 50¢, $1 are coins.`;

    let options = ["Yes", "No"];
    options = getShuffledOptions(answer, options);

    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CONCEPTUAL_ERROR"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "subtopic": "${subtopic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Count the money first, then compare it to the price.`, `Compare total to price.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`The money shown is ${displayTotal}. The price is ${targetPriceStr}. Is ${displayTotal} enough? ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "SINGAPORE_MONEY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? `, "steps": [{"label": "How much money is shown in total?", "expectedAnswer": "${displayTotal}"}, {"label": "Is ${displayTotal} enough to buy the item that costs ${targetPriceStr}? (Type 'Yes' or 'No')", "expectedAnswer": "${answer}"}]` : ''} }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "comparing_values", hideVisual: false }
    };
  },

  foundation_matching_exact_amount: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
    const pool = ['10¢', '20¢', '50¢', '$1', '$2', '$5', '$10'];
    const itemCount = Math.floor(Math.random() * 3) + 4; 
    const generatedItems = [];
    let sumCents = 0;

    for (let i = 0; i < itemCount; i++) {
      const item = pool[Math.floor(Math.random() * pool.length)];
      const valCents = item.endsWith('¢') ? parseInt(item.replace('¢', ''), 10) : parseInt(item.replace('$', ''), 10) * 100;
      if (sumCents + valCents <= 2000) { generatedItems.push(item); sumCents += valCents; }
    }
    if (generatedItems.length === 0) { generatedItems.push('$2', '50¢'); sumCents = 250; }

    const displayTotal = generateMoneyString(sumCents);
    const answer = displayTotal;
    const componentData = { items: generatedItems, total: displayTotal };

    const questionTextTemplate = getQText(`Which amount matches the total money shown?`, `Total amount matches = ?`);
    const randomName = getRandomNames(1);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question." : `STRICT: Keep the mathematical sentences in "questionText" exactly as they are! Just replace the "[STORY]" tag at the beginning with a 1-sentence Singaporean math story context (e.g. '${randomName} went to the shop.'). DO NOT delete the math question! IMPORTANT: In Singapore, $2, $5, $10 are notes. 5¢, 10¢, 20¢, 50¢, $1 are coins.`;

    let options = [answer, generateMoneyString(sumCents + 10), generateMoneyString(Math.max(10, sumCents - 10)), generateMoneyString(sumCents + 50)];
    options = getShuffledOptions(answer, options);

    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { if (opt !== answer) defectMapObj[opt] = "CARELESS_CALCULATION"; });
      defectMapStr = JSON.stringify(defectMapObj);
    }

    return {
      aiPrompt: `You are an expert Primary 1 math generator. 
      ${formatInstructions}
      ${storyInstruction}

      OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
      {
        "meta": { "level": "${level}", "topic": "${topic}", "subtopic": "${subtopic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
        "content": {
          "questionText": ${JSON.stringify(isShort ? questionTextTemplate : "[STORY] " + questionTextTemplate)},
          "options": ${mcqOptions},
          "defectMap": ${defectMapStr},
          "hint": ${JSON.stringify(getQText(`Count the values of all coins and notes carefully!`, `Add all values.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Add the values together: ${generatedItems.join(' + ')} = ${displayTotal}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "SINGAPORE_MONEY",
          "componentData": ${JSON.stringify(componentData)}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE COUNTING PROCESS (e.g., adding dollars first, then cents). DO NOT add a redundant final step asking which amount matches the total.]"' : ''} }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "matching_exact_amount", hideVisual: false }
    };
  }
};

export const foundationLogic = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
  if (foundationVariants[activeVariant]) {
    return foundationVariants[activeVariant](config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText);
  }
};