import { getRandomContext } from '@/lib/utils/localization';

const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);
const generateMoneyString = (cents) => cents >= 100 ? `$${(cents / 100).toFixed(2)}` : `${cents}¢`;

export const foundationVariants = {
  foundation_counting_coins: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const pool = ['10¢', '20¢', '50¢', '$1'];
    const itemCount = Math.floor(Math.random() * 3) + 3; 
    const generatedItems = [];
    let sumCents = 0;

    for (let i = 0; i < itemCount; i++) {
      const item = pool[Math.floor(Math.random() * pool.length)];
      const valCents = item.endsWith('¢') ? parseInt(item.replace('¢', ''), 10) : parseInt(item.replace('$', ''), 10) * 100;
      if (sumCents + valCents <= 2000) { generatedItems.push(item); sumCents += valCents; }
    }
    if (generatedItems.length === 0) { generatedItems.push('$1', '50¢'); sumCents = 150; }

    const displayTotal = generateMoneyString(sumCents);
    const answer = displayTotal;
    const componentData = { items: generatedItems, total: displayTotal };

    const questionTextTemplate = getQText(`Count the total amount of money shown below.`, `Total amount = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

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
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
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
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "counting_coins", hideVisual: false }
    };
  },

  foundation_identifying_notes: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
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
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

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
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
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
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "identifying_notes", hideVisual: false }
    };
  },

  foundation_mixed_counting: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
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
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

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
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
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
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "mixed_counting", hideVisual: false }
    };
  },

  foundation_comparing_values: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
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

    const questionTextTemplate = getQText(`An item costs ${targetPriceStr}. Is the amount of money shown enough to buy it?`, `Amount shown >= ${targetPriceStr}?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

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
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
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
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "comparing_values", hideVisual: false }
    };
  },

  foundation_matching_exact_amount: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
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
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

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
        "meta": { "level": "${level}", "topic": "${topic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
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
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'foundation', steps: 1, logic: "matching_exact_amount", hideVisual: false }
    };
  }
};

export const foundationLogic = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
  if (foundationVariants[activeVariant]) {
    return foundationVariants[activeVariant](config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
  }
};