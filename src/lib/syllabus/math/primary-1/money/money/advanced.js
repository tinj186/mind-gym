import { getRandomContext } from '@/lib/utils/localization';

const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);
const generateMoneyString = (cents) => cents >= 100 ? `$${(cents / 100).toFixed(2)}` : `${cents}¢`;

export const advancedVariants = {
  advanced_transaction_change: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const item1Cents = Math.floor(Math.random() * 10) * 100 + (Math.random() > 0.5 ? 50 : 0);
    const item2Cents = Math.floor(Math.random() * 10) * 100 + (Math.random() > 0.5 ? 50 : 0);
    const item3Cents = Math.floor(Math.random() * 10) * 100 + (Math.random() > 0.5 ? 50 : 0);
    const totalCents = item1Cents + item2Cents + item3Cents;
    
    const paidOptions = [5000, 10000];
    const paidCents = paidOptions.find(p => p > totalCents) || 10000;
    const changeCents = paidCents - totalCents;
    
    const item1Str = generateMoneyString(item1Cents);
    const item2Str = generateMoneyString(item2Cents);
    const item3Str = generateMoneyString(item3Cents);
    const paidStr = generateMoneyString(paidCents);
    const totalStr = generateMoneyString(totalCents);
    const answer = generateMoneyString(changeCents);

    const questionTextTemplate = getQText(`You buy Item A for ${item1Str}, Item B for ${item2Str}, and Item C for ${item3Str}. You pay with a ${paidStr} note. How much change will you receive?`, `Change received = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

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
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 3, logic: "transaction_change", hideVisual: true }
    };
  },

  advanced_savings_and_spending: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const startCents = Math.floor(Math.random() * 20) * 100;
    const saveCents = Math.floor(Math.random() * 10) * 100 + 50;
    const spendCents = Math.floor(Math.random() * 5) * 100 + 50;
    const finalCents = startCents + saveCents - spendCents;

    const startStr = generateMoneyString(startCents);
    const saveStr = generateMoneyString(saveCents);
    const spendStr = generateMoneyString(spendCents);
    const answer = generateMoneyString(finalCents);

    const questionTextTemplate = getQText(`You start with ${startStr}. You save another ${saveStr}. Then you spend ${spendStr}. How much money do you have left?`, `Amount left = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

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
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "savings_and_spending", hideVisual: true }
    };
  },

  advanced_missing_price_deduction: (config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
    const item1Cents = Math.floor(Math.random() * 10) * 100 + 50;
    const item2Cents = Math.floor(Math.random() * 10) * 100 + 50;
    const changeCents = Math.floor(Math.random() * 5) * 100;
    const paidCents = item1Cents + item2Cents + changeCents;

    const item1Str = generateMoneyString(item1Cents);
    const paidStr = generateMoneyString(paidCents);
    const changeStr = generateMoneyString(changeCents);
    const answer = generateMoneyString(item2Cents);

    const questionTextTemplate = getQText(`You bought Item A for ${item1Str} and Item B. You paid with ${paidStr} and received ${changeStr} in change. What is the price of Item B?`, `Price of Item B = ?`);
    const storyInstruction = isShort ? "" : `STRICT: Replace the "[STORY]" placeholder in "questionText" with a 1-sentence Singaporean math story context.`;

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
        "inputRequirement": { "inputType": "${type === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}" }
      }`,
      metadata: { difficulty: 'advanced', steps: 2, logic: "missing_price_deduction", hideVisual: true }
    };
  }
};

export const advancedLogic = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText) => {
  let targetVariant = advancedVariants[activeVariant] ? activeVariant : 'advanced_transaction_change';
  return advancedVariants[targetVariant](config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, getQText);
};