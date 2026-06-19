import { getRandomContext } from '@/lib/utils/localization';

const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);
const generateMoneyString = (cents) => {
  if (cents % 100 === 0) return `$${cents / 100}`;
  if (cents > 100) return `$${Math.floor(cents / 100)} and ${cents % 100}¢`;
  return `${cents}¢`;
};

export const advancedVariants = {
  advanced_transaction_change: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const isCentsMode = Math.random() > 0.5;
    let item1Cents, item2Cents, item3Cents, paidCents;
    if (isCentsMode) {
      item1Cents = Math.floor(Math.random() * 3 + 1) * 10;
      item2Cents = Math.floor(Math.random() * 3 + 1) * 10;
      item3Cents = Math.floor(Math.random() * 2 + 1) * 10;
      const coinPool = [100, 200];
      paidCents = coinPool[Math.floor(Math.random() * coinPool.length)];
    } else {
      item1Cents = Math.floor(Math.random() * 5 + 1) * 100;
      item2Cents = Math.floor(Math.random() * 5 + 1) * 100;
      item3Cents = Math.floor(Math.random() * 5 + 1) * 100;
      const notePool = [2000, 5000];
      paidCents = notePool[Math.floor(Math.random() * notePool.length)];
    }
    const totalCents = item1Cents + item2Cents + item3Cents;
    if (paidCents < totalCents) paidCents = isCentsMode ? 200 : 5000;
    const changeCents = paidCents - totalCents;
    
    const item1Str = generateMoneyString(item1Cents);
    const item2Str = generateMoneyString(item2Cents);
    const item3Str = generateMoneyString(item3Cents);
    const paidStr = generateMoneyString(paidCents);
    const totalStr = generateMoneyString(totalCents);
    const answer = generateMoneyString(changeCents);

    const randomName = ['Siti', 'Muthu', 'Ali', 'Wei Ming', 'Ravi', 'Nurul', 'Ahmad', 'Mei', 'Kumar'][Math.floor(Math.random() * 9)];
    const questionTextTemplate = getQText(`${randomName} buys Item A for ${item1Str}, Item B for ${item2Str}, and Item C for ${item3Str}. ${randomName} pays with a ${paidStr} note. How much change will ${randomName} receive?`, `Item A: ${item1Str}. Item B: ${item2Str}. Item C: ${item3Str}. Paid: ${paidStr}. Change = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question." : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use the name ${randomName}. IMPORTANT: In Singapore, $2, $5, $10 are notes. 5¢, 10¢, 20¢, 50¢, $1 are coins.`;

    let options = [answer, generateMoneyString(changeCents + 100), generateMoneyString(paidCents - (item1Cents + item2Cents)), generateMoneyString(totalCents)];
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
          "hint": ${JSON.stringify(getQText(`First find the total cost of all three items, then subtract that from the amount paid.`, `Add costs, then subtract from paid.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Total cost = ${item1Str} + ${item2Str} + ${item3Str} = ${totalStr}. Change = ${paidStr} - ${totalStr} = ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "transaction_change", hideVisual: true }
    };
  },

  advanced_savings_and_spending: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const isCentsMode = Math.random() > 0.5;
    let startCents, saveCents, spendCents;
    if (isCentsMode) {
      startCents = Math.floor(Math.random() * 5 + 1) * 10;
      saveCents = Math.floor(Math.random() * 3 + 1) * 10;
      spendCents = Math.floor(Math.random() * 4 + 1) * 10;
    } else {
      startCents = Math.floor(Math.random() * 15 + 5) * 100;
      saveCents = Math.floor(Math.random() * 10 + 1) * 100;
      spendCents = Math.floor(Math.random() * 10 + 1) * 100;
    }
    const finalCents = startCents + saveCents - spendCents;

    const startStr = generateMoneyString(startCents);
    const saveStr = generateMoneyString(saveCents);
    const spendStr = generateMoneyString(spendCents);
    const answer = generateMoneyString(finalCents);

    const randomName = ['Siti', 'Muthu', 'Ali', 'Wei Ming', 'Ravi', 'Nurul', 'Ahmad', 'Mei', 'Kumar'][Math.floor(Math.random() * 9)];
    const questionTextTemplate = getQText(`${randomName} starts with ${startStr}. ${randomName} saves another ${saveStr}. Then ${randomName} spends ${spendStr}. How much money does ${randomName} have left?`, `Start: ${startStr}. Save: ${saveStr}. Spend: ${spendStr}. Money left = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question." : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use the name ${randomName}. IMPORTANT: In Singapore, $2, $5, $10 are notes. 5¢, 10¢, 20¢, 50¢, $1 are coins.`;

    let options = [answer, generateMoneyString(finalCents + 100), generateMoneyString(startCents + saveCents + spendCents), generateMoneyString(Math.max(0, startCents - spendCents))];
    options = getShuffledOptions(answer, options);

    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { 
        if (opt !== answer) {
          if (opt === generateMoneyString(startCents + saveCents + spendCents)) defectMapObj[opt] = "CONCEPTUAL_ERROR";
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
          "hint": ${JSON.stringify(getQText(`First add the savings to the starting amount, then subtract the spending.`, `Add savings, subtract spending.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Amount after saving = ${startStr} + ${saveStr} = ${generateMoneyString(startCents + saveCents)}. Final amount = ${generateMoneyString(startCents + saveCents)} - ${spendStr} = ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "savings_and_spending", hideVisual: true }
    };
  },

  advanced_missing_price_deduction: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const isCentsMode = Math.random() > 0.5;
    let item1Cents, item2Cents, changeCents;
    if (isCentsMode) {
      item1Cents = Math.floor(Math.random() * 4 + 1) * 10;
      item2Cents = Math.floor(Math.random() * 4 + 1) * 10;
      changeCents = Math.floor(Math.random() * 2) * 10;
    } else {
      item1Cents = Math.floor(Math.random() * 10 + 1) * 100;
      item2Cents = Math.floor(Math.random() * 10 + 1) * 100;
      changeCents = Math.floor(Math.random() * 5) * 100;
    }
    const paidCents = item1Cents + item2Cents + changeCents;

    const item1Str = generateMoneyString(item1Cents);
    const paidStr = generateMoneyString(paidCents);
    const changeStr = generateMoneyString(changeCents);
    const answer = generateMoneyString(item2Cents);

    const randomName = ['Siti', 'Muthu', 'Ali', 'Wei Ming', 'Ravi', 'Nurul', 'Ahmad', 'Mei', 'Kumar'][Math.floor(Math.random() * 9)];
    const questionTextTemplate = getQText(`${randomName} bought Item A for ${item1Str} and Item B. ${randomName} paid with ${paidStr} and received ${changeStr} in change. What is the price of Item B?`, `Item A: ${item1Str}. Paid: ${paidStr}. Change: ${changeStr}. Price of Item B = ?`);
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question." : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Use the name ${randomName}. IMPORTANT: In Singapore, $2, $5, $10 are notes. 5¢, 10¢, 20¢, 50¢, $1 are coins.`;

    let options = [answer, generateMoneyString(item2Cents + 100), generateMoneyString(Math.abs(paidCents - changeCents)), generateMoneyString(Math.abs(item1Cents - changeCents))];
    options = getShuffledOptions(answer, options);

    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { 
        if (opt !== answer) {
          if (opt === generateMoneyString(paidCents - changeCents)) defectMapObj[opt] = "CONCEPTUAL_ERROR";
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
          "hint": ${JSON.stringify(getQText(`Subtract the change from the amount paid to find the total cost, then subtract Item A's price.`, `Subtract change, then subtract Item A.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Total cost = ${paidStr} - ${changeStr} = ${generateMoneyString(paidCents - changeCents)}. Price of Item B = ${generateMoneyString(paidCents - changeCents)} - ${item1Str} = ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "NONE",
          "componentData": {}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "missing_price_deduction", hideVisual: true }
    };
  },

  advanced_pooled_affordability: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const isCentsMode = Math.random() > 0.5;
    // Generate money for person 1
    const p1Pool = isCentsMode ? ['10¢', '20¢', '50¢'] : ['$1', '$2', '$5', '$10'];
    const p1ItemCount = Math.floor(Math.random() * 3) + 3; 
    const p1Items = [];
    let p1Cents = 0;
    for (let i = 0; i < p1ItemCount; i++) {
      const item = p1Pool[Math.floor(Math.random() * p1Pool.length)];
      const valCents = item.endsWith('¢') ? parseInt(item.replace('¢', ''), 10) : parseInt(item.replace('$', ''), 10) * 100;
      p1Items.push(item); 
      p1Cents += valCents;
    }
    
    // Generate money for person 2
    const p2Pool = isCentsMode ? ['10¢', '20¢', '50¢'] : ['$2', '$5', '$10'];
    const p2ItemCount = Math.floor(Math.random() * 2) + 1; 
    const p2Items = [];
    let p2Cents = 0;
    for (let i = 0; i < p2ItemCount; i++) {
      const item = p2Pool[Math.floor(Math.random() * p2Pool.length)];
      const valCents = parseInt(item.replace('$', ''), 10) * 100;
      p2Items.push(item); 
      p2Cents += valCents;
    }

    const totalCents = p1Cents + p2Cents;
    
    // Decide if it's a shortfall question or change question
    const isShortfall = Math.random() > 0.5;
    
    let targetPriceCents;
    let answerCents;
    
    if (isShortfall) {
      // Must cost MORE than what they have
      targetPriceCents = totalCents + (Math.floor(Math.random() * 5) + 1) * (isCentsMode ? 10 : 100);
      answerCents = targetPriceCents - totalCents;
    } else {
      // Must cost LESS than what they have
      targetPriceCents = Math.max(isCentsMode ? 10 : 100, totalCents - (Math.floor(Math.random() * 5) + 1) * (isCentsMode ? 10 : 100));
      answerCents = totalCents - targetPriceCents;
    }

    const p1TotalStr = generateMoneyString(p1Cents);
    const targetPriceStr = generateMoneyString(targetPriceCents);
    const answer = generateMoneyString(answerCents);

    const questionTextTemplate = getQText(
      `Mei has ${p1TotalStr} in her purse. Ali has ${p2Items.join(' and ')}. They put all their money together. They want to buy a toy that costs ${targetPriceStr}. ${isShortfall ? 'How much more money do they need?' : 'How much change will they receive?'}`, 
      isShortfall ? `Mei: ${p1TotalStr}, Ali: ${p2Items.join(' + ')}. Toy: ${targetPriceStr}. More money needed = ?` : `Mei: ${p1TotalStr}, Ali: ${p2Items.join(' + ')}. Toy: ${targetPriceStr}. Change = ?`
    );
    const randomName = ['Siti', 'Muthu', 'Ali', 'Wei Ming', 'Ravi', 'Nurul', 'Ahmad', 'Mei', 'Kumar'][Math.floor(Math.random() * 9)];
    const storyInstruction = isShort ? "STRICT: Output the EXACT questionText provided in the JSON template below. DO NOT add any story context, names, or words. Keep it as a pure mathematical question." : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context. Ensure the character names and items match the logic. IMPORTANT: In Singapore, $2, $5, $10 are notes. 5¢, 10¢, 20¢, 50¢, $1 are coins.`;

    let options = [
      answer, 
      generateMoneyString(answerCents + 100), 
      generateMoneyString(Math.abs(targetPriceCents - p1Cents)), 
      generateMoneyString(Math.max(50, answerCents - 50))
    ];
    options = getShuffledOptions(answer, options);

    let mcqOptions = 'null';
    let defectMapStr = 'null';
    if (type === 'MCQ') {
      options = options.sort(() => Math.random() - 0.5);
      mcqOptions = JSON.stringify(options);
      let defectMapObj = {};
      options.forEach(opt => { 
        if (opt !== answer) {
          if (opt === generateMoneyString(Math.abs(targetPriceCents - p1Cents))) defectMapObj[opt] = "CONCEPTUAL_ERROR";
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
          "hint": ${JSON.stringify(getQText(`Find the total amount they have together, then subtract it from the toy price.`, `Find total, subtract from price.`))},
          "finalAnswer": "${answer}",
          "solutionSteps": ${JSON.stringify(getQText(`Ali's money = ${generateMoneyString(p2Cents)}. Total money = ${p1TotalStr} + ${generateMoneyString(p2Cents)} = ${generateMoneyString(totalCents)}. ${isShortfall ? 'Amount needed' : 'Change'} = ${isShortfall ? targetPriceStr + ' - ' + generateMoneyString(totalCents) : generateMoneyString(totalCents) + ' - ' + targetPriceStr} = ${answer}.`, `Answer is ${answer}.`))}
        },
        "visualEngine": {
          "componentToRender": "SINGAPORE_MONEY",
          "componentData": ${JSON.stringify({ items: p1Items, total: p1TotalStr, secondPersonItems: p2Items })}
        },
        "inputRequirement": { "inputType": "${isStructure ? 'MULTI_STEP_INPUT' : (type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT')}"${isStructure ? ', "steps": "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]"' : ''} }
      }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "pooled_affordability", hideVisual: false }
    };
  }
};

export const advancedLogic = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
  let targetVariant = advancedVariants[activeVariant] ? activeVariant : 'advanced_transaction_change';
  return advancedVariants[targetVariant](config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
};