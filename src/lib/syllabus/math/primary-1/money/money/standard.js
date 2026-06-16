import { getRandomContext } from '@/lib/utils/localization';

const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);
const generateMoneyString = (cents) => cents >= 100 ? `$${(cents / 100).toFixed(2)}` : `${cents}¢`;

export const standardVariants = {
  standard_value_exchange: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const parentNotes = ['$1', '$2', '$5', '$10', '$50'];
    const randomParent = parentNotes[Math.floor(Math.random() * parentNotes.length)];
    const parentVal = parseInt(randomParent.replace('$', ''), 10) * 100;
    
    // Choose a valid sub-coin or smaller note to exchange into
    let validSubTokens = ['10¢', '20¢', '50¢'];
    if (parentVal >= 500) validSubTokens.push('$1', '$2');
    if (parentVal >= 1000) validSubTokens.push('$5');
    if (parentVal >= 5000) validSubTokens.push('$10');
    
    const randomSubToken = validSubTokens[Math.floor(Math.random() * validSubTokens.length)];
    const subVal = randomSubToken.endsWith('¢') ? parseInt(randomSubToken.replace('¢', ''), 10) : parseInt(randomSubToken.replace('$', ''), 10) * 100;
    
    // Only proceed if it divides cleanly (which it should based on Singapore currency structure)
    const count = parentVal / subVal;
    const answer = String(count);

    const questionTextTemplate = getQText(`How many ${randomSubToken} coins/notes make ${randomParent}?`, `Exchange ${randomParent} to ${randomSubToken} = ? count`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

    let options = [answer, String(count + 1), String(Math.max(1, count - 1)), String(count + 2)];
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
          "hint": ${JSON.stringify(getQText(`Count how many ${randomSubToken} it takes to reach ${randomParent}.`, `Count up to total.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`It takes ${count} of ${randomSubToken} to make exactly ${randomParent}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "value_exchange", hideVisual: true }
    };
  },

  standard_two_item_total: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const item1Cents = Math.floor(Math.random() * 20) * 100 + (Math.random() > 0.5 ? 50 : 0);
    const item2Cents = Math.floor(Math.random() * 20) * 100 + (Math.random() > 0.5 ? 50 : 0);
    const totalCents = item1Cents + item2Cents;
    
    const item1Str = generateMoneyString(item1Cents);
    const item2Str = generateMoneyString(item2Cents);
    const answer = generateMoneyString(totalCents);

    const questionTextTemplate = getQText(`Item A costs ${item1Str} and Item B costs ${item2Str}. What is the total cost?`, `Total cost = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

    let options = [answer, generateMoneyString(totalCents + 100), generateMoneyString(Math.abs(item1Cents - item2Cents)), generateMoneyString(totalCents + 50)];
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
          "hint": ${JSON.stringify(getQText(`Add the two amounts together to find the total.`, `Add the amounts.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Total cost = ${item1Str} + ${item2Str} = ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "two_item_total", hideVisual: true }
    };
  },

  standard_calculating_change: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const notePool = [500, 1000, 5000];
    const paidCents = notePool[Math.floor(Math.random() * notePool.length)];
    const priceCents = paidCents - (Math.floor(Math.random() * (paidCents / 100 - 1)) + 1) * 100 - (Math.random() > 0.5 ? 50 : 0);
    const changeCents = paidCents - priceCents;
    
    const paidStr = generateMoneyString(paidCents);
    const priceStr = generateMoneyString(priceCents);
    const answer = generateMoneyString(changeCents);

    const questionTextTemplate = getQText(`An item costs ${priceStr}. You pay with a ${paidStr} note. How much change will you receive?`, `Change received = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

    let options = [answer, generateMoneyString(changeCents + 100), generateMoneyString(Math.max(50, changeCents - 50)), generateMoneyString(paidCents + priceCents)];
    options = getShuffledOptions(answer, options);

    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { 
        if (opt !== answer) {
          if (opt === generateMoneyString(paidCents + priceCents)) defectMapObj[opt] = "CONCEPTUAL_ERROR";
          else defectMapObj[opt] = "CARELESS_CALCULATION"; 
        }
      });
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
          "hint": ${JSON.stringify(getQText(`Subtract the price from the amount paid to find the change.`, `Subtract price from paid.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Change = ${paidStr} - ${priceStr} = ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "calculating_change", hideVisual: true }
    };
  },

  standard_shortfall_needed: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const targetPriceCents = (Math.floor(Math.random() * 20) + 10) * 100;
    const haveCents = targetPriceCents - (Math.floor(Math.random() * 8) + 1) * 100 - (Math.random() > 0.5 ? 50 : 0);
    const shortfallCents = targetPriceCents - haveCents;
    
    const targetPriceStr = generateMoneyString(targetPriceCents);
    const haveStr = generateMoneyString(haveCents);
    const answer = generateMoneyString(shortfallCents);

    const questionTextTemplate = getQText(`An item costs ${targetPriceStr}. You only have ${haveStr}. How much more money do you need?`, `More money needed = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

    let options = [answer, generateMoneyString(shortfallCents + 100), generateMoneyString(Math.max(50, shortfallCents - 50)), generateMoneyString(targetPriceCents + haveCents)];
    options = getShuffledOptions(answer, options);

    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { 
        if (opt !== answer) {
          if (opt === generateMoneyString(targetPriceCents + haveCents)) defectMapObj[opt] = "CONCEPTUAL_ERROR";
          else defectMapObj[opt] = "CARELESS_CALCULATION"; 
        }
      });
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
          "hint": ${JSON.stringify(getQText(`Subtract the amount you have from the total price.`, `Subtract have from price.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Shortfall = ${targetPriceStr} - ${haveStr} = ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "shortfall_needed", hideVisual: true }
    };
  },

  standard_price_comparison: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const isMost = Math.random() > 0.5;
    const items = [
      { name: 'Item A', price: Math.floor(Math.random() * 10) * 100 + 50 },
      { name: 'Item B', price: Math.floor(Math.random() * 10) * 100 + 100 },
      { name: 'Item C', price: Math.floor(Math.random() * 10) * 100 + 150 }
    ];
    // Ensure all prices are unique
    items.forEach((item, index) => {
      item.price += index * 100;
    });
    // Shuffle
    items.sort(() => Math.random() - 0.5);

    let targetItem = items[0];
    items.forEach(item => {
      if (isMost && item.price > targetItem.price) targetItem = item;
      if (!isMost && item.price < targetItem.price) targetItem = item;
    });

    const answer = targetItem.name;
    const priceStrings = items.map(i => `${i.name}: ${generateMoneyString(i.price)}`).join(', ');

    const questionTextTemplate = getQText(`Here are some prices: ${priceStrings}. Which item costs the ${isMost ? 'most' : 'least'}?`, `${isMost ? 'Highest' : 'Lowest'} price item = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

    let options = items.map(i => i.name);
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
          "hint": ${JSON.stringify(getQText(`Compare the dollar amounts first, then the cents if the dollars are the same.`, `Compare values.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Comparing the prices, ${answer} has the ${isMost ? 'highest' : 'lowest'} price at ${generateMoneyString(targetItem.price)}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 1, logic: "price_comparison", hideVisual: true }
    };
  },

  standard_multi_item_change: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const item1Cents = Math.floor(Math.random() * 10) * 100 + (Math.random() > 0.5 ? 50 : 0);
    const item2Cents = Math.floor(Math.random() * 10) * 100 + (Math.random() > 0.5 ? 50 : 0);
    const totalCents = item1Cents + item2Cents;
    
    const paidOptions = [2000, 5000];
    const paidCents = paidOptions.find(p => p > totalCents) || 5000;
    const changeCents = paidCents - totalCents;
    
    const item1Str = generateMoneyString(item1Cents);
    const item2Str = generateMoneyString(item2Cents);
    const paidStr = generateMoneyString(paidCents);
    const totalStr = generateMoneyString(totalCents);
    const answer = generateMoneyString(changeCents);

    const questionTextTemplate = getQText(`You buy Item A for ${item1Str} and Item B for ${item2Str}. You pay with a ${paidStr} note. How much change will you receive?`, `Change received = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

    let options = [answer, generateMoneyString(changeCents + 100), generateMoneyString(paidCents - item1Cents), generateMoneyString(totalCents)];
    options = getShuffledOptions(answer, options);

    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { 
        if (opt !== answer) {
          if (opt === generateMoneyString(totalCents)) defectMapObj[opt] = "CONCEPTUAL_ERROR";
          else defectMapObj[opt] = "CARELESS_CALCULATION"; 
        }
      });
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
          "hint": ${JSON.stringify(getQText(`First find the total cost of the items, then subtract that from the amount paid.`, `Add costs, then subtract from paid.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Total cost = ${item1Str} + ${item2Str} = ${totalStr}. Change = ${paidStr} - ${totalStr} = ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'standard', steps: 2, logic: "multi_item_change", hideVisual: true }
    };
  }
};

export const standardLogic = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
  // Use fallback if activeVariant not explicitly implemented
  let targetVariant = standardVariants[activeVariant] ? activeVariant : 'standard_multi_item_change';
  return standardVariants[targetVariant](config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
};