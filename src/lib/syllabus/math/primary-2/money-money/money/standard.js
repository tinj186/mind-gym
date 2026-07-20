import { getRandomNames, getRandomDivisibleObjects } from '@/lib/utils/variable-bank';

const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

const generateMoneyString = (cents) => {
  return `$${(cents / 100).toFixed(2)}`;
};

export const standardLogic = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
  let questionText = "";
  let answer = "";
  let hint = "";
  let solutionSteps = [];
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let customConstraints = "";
  
  const names = getRandomNames(2);

  if (activeVariant === 'standard_money_exchange_large') {
    const smallOptions = [{ label: '$2', val: 200 }, { label: '$5', val: 500 }, { label: '$10', val: 1000 }, { label: '$50', val: 5000 }];
    const small = smallOptions[Math.floor(Math.random() * smallOptions.length)];
    
    let multipliers = [2, 5, 10, 20];
    if (small.val === 5000) multipliers = [2, 10, 20]; // 100, 500, 1000
    const multiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
    const largeVal = small.val * multiplier; 
    const largeStr = generateMoneyString(largeVal);

    answer = `${multiplier}`;
    
    questionText = getQText(
      `${names[0]} wants to exchange ${largeStr} for ${small.label} notes.\nHow many ${small.label} notes will ${names[0]} get?\nShow your working and the final answer.`,
      `How many ${small.label} notes make ${largeStr}?`
    );

    hint = `Divide the total amount by the value of the note.`;
    
    solutionSteps = [
      `1. The total amount is ${largeStr}.`,
      `2. Each note is worth ${small.label}.`,
      `3. Divide: ${largeVal / 100} ÷ ${small.val / 100} = ${answer}.`,
      `4. Therefore, there are ${answer} notes.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Working equation:", "expectedAnswer": "${largeVal / 100}/${small.val / 100}" },
          { "label": "Total number of notes:", "expectedAnswer": "${answer}" }
        ]
      }`;
    } else if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isMCQ) {
      const wrong1 = `${multiplier + 10}`;
      const wrong2 = `${Math.abs(multiplier - 5) || (multiplier + 5)}`;
      const wrong3 = `${multiplier * 2}`;
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}
      `;
    }

  } else if (activeVariant === 'standard_calculating_total_cost') {
    const item1Cents = (Math.floor(Math.random() * 20) + 5) * 100 + (Math.floor(Math.random() * 9) * 10);
    const item2Cents = (Math.floor(Math.random() * 20) + 5) * 100 + (Math.floor(Math.random() * 9) * 10);
    const sumCents = item1Cents + item2Cents;
    
    answer = generateMoneyString(sumCents);
    const items = getRandomDivisibleObjects(2);

    questionText = getQText(
      `${names[0]} bought a ${items[0]} for ${generateMoneyString(item1Cents)} and a ${items[1]} for ${generateMoneyString(item2Cents)}.\nHow much did ${names[0]} pay altogether?\nShow your working and the final answer.`,
      `Find the total cost of ${generateMoneyString(item1Cents)} and ${generateMoneyString(item2Cents)}.`
    );

    hint = `To find the total cost, add the two prices together.`;
    solutionSteps = [
      `1. Cost of ${items[0]} = ${generateMoneyString(item1Cents)}`,
      `2. Cost of ${items[1]} = ${generateMoneyString(item2Cents)}`,
      `3. Add them together: ${generateMoneyString(item1Cents)} + ${generateMoneyString(item2Cents)} = ${answer}.`,
      `4. Therefore, the total cost is ${answer}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Working equation:", "expectedAnswer": "${generateMoneyString(item1Cents)}+${generateMoneyString(item2Cents)}" },
          { "label": "Total cost ($):", "expectedAnswer": "${answer}" }
        ]
      }`;
    } else if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isMCQ) {
      const wrong1 = generateMoneyString(sumCents + 100);
      const wrong2 = generateMoneyString(sumCents - 100);
      const wrong3 = generateMoneyString(sumCents + 10);
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}
      `;
    }

  } else if (activeVariant === 'standard_finding_change') {
    // Give a 50% chance for the cost to be under $10 so the $10 note gets picked more often
    let costCents = 0;
    if (Math.random() < 0.5) {
      costCents = (Math.floor(Math.random() * 8) + 1) * 100 + (Math.floor(Math.random() * 9) * 10); // $1.00 to $8.90
    } else {
      costCents = (Math.floor(Math.random() * 35) + 10) * 100 + (Math.floor(Math.random() * 9) * 10); // $10.00 to $44.90
    }
    const validNotes = [1000, 5000, 10000].filter(n => n > costCents);
    // 90% chance to use the smallest valid note (most realistic), 10% chance to overpay with a larger note
    const useSmallest = Math.random() < 0.9;
    const paidCents = useSmallest ? validNotes[0] : (validNotes[Math.floor(Math.random() * validNotes.length)] || 10000);
    const changeCents = paidCents - costCents;
    
    answer = generateMoneyString(changeCents);
    const item = getRandomDivisibleObjects(1);

    questionText = getQText(
      `${names[0]} bought a ${item} for ${generateMoneyString(costCents)}.\nThey paid the cashier with a ${generateMoneyString(paidCents)} note.\nHow much change did they receive?\nShow your working and the final answer.`,
      `Calculate the change received when paying ${generateMoneyString(paidCents)} for an item costing ${generateMoneyString(costCents)}.`
    );

    hint = `To find the change, subtract the cost of the item from the amount paid.`;
    solutionSteps = [
      `1. Amount paid = ${generateMoneyString(paidCents)}`,
      `2. Cost of ${item} = ${generateMoneyString(costCents)}`,
      `3. Subtract to find change: ${generateMoneyString(paidCents)} - ${generateMoneyString(costCents)} = ${answer}.`,
      `4. Therefore, the change received is ${answer}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Working equation:", "expectedAnswer": "${generateMoneyString(paidCents)}-${generateMoneyString(costCents)}" },
          { "label": "Change received ($):", "expectedAnswer": "${answer}" }
        ]
      }`;
    } else if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isMCQ) {
      const wrong1 = generateMoneyString(changeCents + 100);
      const wrong2 = generateMoneyString(changeCents - 100);
      const wrong3 = generateMoneyString(paidCents + costCents);
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}
      `;
    }

  } else if (activeVariant === 'standard_affordability_shortfall') {
    const costCents = (Math.floor(Math.random() * 60) + 20) * 100 + (Math.floor(Math.random() * 9) * 10);
    const haveCents = costCents - ((Math.floor(Math.random() * 10) + 1) * 100 + (Math.floor(Math.random() * 9) * 10));
    const shortfall = costCents - haveCents;
    
    answer = generateMoneyString(shortfall);
    const item = getRandomDivisibleObjects(1);
    
    const pool = ['$2', '$5', '$10', '$50', '50¢'];
    const generatedItems = [];
    let rem = haveCents;
    const denoms = [{val: 5000, label: '$50'}, {val: 1000, label: '$10'}, {val: 500, label: '$5'}, {val: 200, label: '$2'}, {val: 100, label: '$1'}, {val: 50, label: '50¢'}, {val: 20, label: '20¢'}, {val: 10, label: '10¢'}];
    for (let d of denoms) {
      while (rem >= d.val) {
        generatedItems.push(d.label);
        rem -= d.val;
      }
    }

    questionText = getQText(
      `${names[0]} wants to buy a ${item} that costs ${generateMoneyString(costCents)}.\nThey only have the money shown below.\nHow much more money do they need?\nShow your working and the final answer.`,
      `How much more money is needed to buy an item costing ${generateMoneyString(costCents)} if you have the money shown?`
    );

    hint = `First count the money they have. Then subtract that amount from the cost of the item.`;
    solutionSteps = [
      `1. Count the money shown: ${generateMoneyString(haveCents)}.`,
      `2. The cost of the item is ${generateMoneyString(costCents)}.`,
      `3. Subtract to find how much more is needed: ${generateMoneyString(costCents)} - ${generateMoneyString(haveCents)} = ${answer}.`,
      `4. Therefore, they need ${answer} more.`
    ];

    visualEngineStr = `{
      "componentToRender": "SINGAPORE_MONEY",
      "componentData": { "items": ${JSON.stringify(generatedItems)}, "total": "${generateMoneyString(haveCents)}" }
    }`;

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Amount of money shown ($):", "expectedAnswer": "${generateMoneyString(haveCents)}" },
          { "label": "Working equation:", "expectedAnswer": "${generateMoneyString(costCents)}-${generateMoneyString(haveCents)}" },
          { "label": "Money needed ($):", "expectedAnswer": "${answer}" }
        ]
      }`;
    } else if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isMCQ) {
      const wrong1 = generateMoneyString(shortfall + 100);
      const wrong2 = generateMoneyString(Math.max(10, shortfall - 100));
      const wrong3 = generateMoneyString(costCents + haveCents);
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}
      `;
    }

  } else if (activeVariant === 'standard_adding_three_items') {
    const c1 = (Math.floor(Math.random() * 10) + 2) * 100 + (Math.floor(Math.random() * 9) * 10);
    const c2 = (Math.floor(Math.random() * 10) + 2) * 100 + (Math.floor(Math.random() * 9) * 10);
    const c3 = (Math.floor(Math.random() * 10) + 2) * 100 + (Math.floor(Math.random() * 9) * 10);
    const sumCents = c1 + c2 + c3;
    
    answer = generateMoneyString(sumCents);
    const items = getRandomDivisibleObjects(3);

    questionText = getQText(
      `${names[0]} bought a ${items[0]} for ${generateMoneyString(c1)}, a ${items[1]} for ${generateMoneyString(c2)}, and a ${items[2]} for ${generateMoneyString(c3)}.\nHow much did they pay altogether?\nShow your working and the final answer.`,
      `Find the total cost of ${generateMoneyString(c1)}, ${generateMoneyString(c2)}, and ${generateMoneyString(c3)}.`
    );

    hint = `Add all three prices together to find the total amount.`;
    solutionSteps = [
      `1. Add the first two items: ${generateMoneyString(c1)} + ${generateMoneyString(c2)} = ${generateMoneyString(c1 + c2)}.`,
      `2. Add the third item: ${generateMoneyString(c1 + c2)} + ${generateMoneyString(c3)} = ${answer}.`,
      `3. Therefore, the total amount is ${answer}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Cost of first two items ($):", "expectedAnswer": "${generateMoneyString(c1 + c2)}" },
          { "label": "Working equation (add third item):", "expectedAnswer": "${generateMoneyString(c1 + c2)}+${generateMoneyString(c3)}" },
          { "label": "Total cost ($):", "expectedAnswer": "${answer}" }
        ]
      }`;
    } else if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isMCQ) {
      const wrong1 = generateMoneyString(sumCents + 100);
      const wrong2 = generateMoneyString(sumCents - 100);
      const wrong3 = generateMoneyString(sumCents + 50);
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}
      `;
    }

  } else {
    throw new Error(`Variant '${activeVariant}' not implemented in standard.js`);
  }

  const aiPrompt = `
You are a Primary 2 Math curriculum expert. Generate a strict JSON payload for the subtopic "Money Counting (Dollars/Cents)".

CRITICAL INSTRUCTIONS:
1. "questionText" MUST exactly match: ${JSON.stringify(Array.isArray(questionText) ? questionText : [questionText])}
2. "finalAnswer" MUST exactly match: "${answer}"
3. "solutionSteps" MUST exactly match: "${solutionSteps.join('\\n')}"
4. "hint" MUST exactly match: "${hint}"

${customConstraints}

${formatInstructions}

OUTPUT FORMAT (Return ONLY valid JSON matching this schema exactly):
{
  "meta": { "level": "${level}", "topic": "${topic}", "subtopic": "${subtopic}", "type": "${zodType}", "difficulty": "${zodDiff}" },
  "content": {
    "questionText": "[AI: INJECT questionText HERE]",
    "options": ${isMCQ ? '"[AI: INJECT ARRAY OF STRINGS]"' : "null"},
    "defectMap": ${isMCQ ? '"[AI: INJECT DEFECT MAP OBJECT]"' : "null"},
    "hint": "[AI: INJECT hint HERE]",
    "finalAnswer": "[AI: INJECT finalAnswer HERE]",
    "solutionSteps": "[AI: INJECT solutionSteps HERE]"
  },
  "visualEngine": ${visualEngineStr},
  "inputRequirement": ${inputRequirementStr || `{"inputType": "${isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'}"}`}
}
  `.trim();

  return {
    aiPrompt,
    metadata: { difficulty: 'standard', logic: activeVariant }
  };
};
