import { getRandomNames, getRandomDivisibleObjects } from '@/lib/utils/variable-bank';

const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

const generateMoneyString = (cents) => {
  return `$${(cents / 100).toFixed(2)}`;
};

export const advancedLogic = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
  let questionText = "";
  let answer = "";
  let hint = "";
  let solutionSteps = [];
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let customConstraints = "";
  
  const names = getRandomNames(2);

  if (activeVariant === 'advanced_multi_step_shopping') {
    // Give a 50% chance for the total cost to be under $10 so the $10 note gets picked more often
    let sumCents = 0;
    let c1 = 0;
    let c2 = 0;
    if (Math.random() < 0.5) {
      // Total between $2 and $8.90
      c1 = (Math.floor(Math.random() * 4) + 1) * 100 + (Math.floor(Math.random() * 9) * 10);
      c2 = (Math.floor(Math.random() * 4) + 1) * 100 + (Math.floor(Math.random() * 9) * 10);
      sumCents = c1 + c2;
    } else {
      // Total up to $45
      c1 = (Math.floor(Math.random() * 20) + 5) * 100 + (Math.floor(Math.random() * 9) * 10);
      c2 = (Math.floor(Math.random() * 20) + 5) * 100 + (Math.floor(Math.random() * 9) * 10);
      sumCents = c1 + c2;
    }
    const validNotes = [1000, 5000, 10000].filter(n => n > sumCents);
    const useSmallest = Math.random() < 0.9;
    const paidCents = useSmallest ? validNotes[0] : (validNotes[Math.floor(Math.random() * validNotes.length)] || 10000);
    const changeCents = paidCents - sumCents;
    
    answer = generateMoneyString(changeCents);
    const items = getRandomDivisibleObjects(2);

    questionText = getQText(
      `${names[0]} bought a ${items[0]} for ${generateMoneyString(c1)} and a ${items[1]} for ${generateMoneyString(c2)}.\nThey gave the cashier a ${generateMoneyString(paidCents)} note.\nHow much change did they receive?\nShow your working and the final answer.`,
      `Find the change received from ${generateMoneyString(paidCents)} after spending ${generateMoneyString(c1)} and ${generateMoneyString(c2)}.`
    );

    hint = `First, find the total cost of the two items. Then, subtract the total cost from the amount paid to find the change.`;
    solutionSteps = [
      `1. Find the total cost: ${generateMoneyString(c1)} + ${generateMoneyString(c2)} = ${generateMoneyString(sumCents)}.`,
      `2. Subtract the total cost from the amount paid: ${generateMoneyString(paidCents)} - ${generateMoneyString(sumCents)} = ${answer}.`,
      `3. Therefore, the change received is ${answer}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Working equation (total cost):", "expectedAnswer": "${generateMoneyString(c1)}+${generateMoneyString(c2)}" },
          { "label": "Total cost ($):", "expectedAnswer": "${generateMoneyString(sumCents)}" },
          { "label": "Working equation (change):", "expectedAnswer": "${generateMoneyString(paidCents)}-${generateMoneyString(sumCents)}" },
          { "label": "Final answer for change ($):", "expectedAnswer": "${answer}" }
        ]
      }`;
    } else if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isMCQ) {
      const wrong1 = generateMoneyString(changeCents + 100);
      const wrong2 = generateMoneyString(sumCents);
      const wrong3 = generateMoneyString(Math.abs(changeCents - 100));
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}
      `;
    }

  } else if (activeVariant === 'advanced_savings_target') {
    const costCents = (Math.floor(Math.random() * 50) + 50) * 100 + (Math.floor(Math.random() * 9) * 10);
    const haveCents = (Math.floor(Math.random() * 30) + 10) * 100 + (Math.floor(Math.random() * 9) * 10);
    const savedCents = (Math.floor(Math.random() * 10) + 5) * 100;
    const totalHaveCents = haveCents + savedCents;
    const needCents = costCents - totalHaveCents;
    
    answer = generateMoneyString(needCents);
    const item = getRandomDivisibleObjects(1);

    questionText = getQText(
      `${names[0]} wants to buy a ${item} that costs ${generateMoneyString(costCents)}.\nThey have ${generateMoneyString(haveCents)} and saved another ${generateMoneyString(savedCents)}.\nHow much more money do they need?\nShow your working and the final answer.`,
      `An item costs ${generateMoneyString(costCents)}. You have ${generateMoneyString(haveCents)} and saved ${generateMoneyString(savedCents)}. How much more is needed?`
    );

    hint = `First, find the total amount of money they have. Then subtract that from the cost of the item.`;
    solutionSteps = [
      `1. Find total money they have: ${generateMoneyString(haveCents)} + ${generateMoneyString(savedCents)} = ${generateMoneyString(totalHaveCents)}.`,
      `2. Subtract what they have from the cost: ${generateMoneyString(costCents)} - ${generateMoneyString(totalHaveCents)} = ${answer}.`,
      `3. Therefore, they need ${answer} more.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Working equation (total money they have):", "expectedAnswer": "${generateMoneyString(haveCents)}+${generateMoneyString(savedCents)}" },
          { "label": "Total money they have ($):", "expectedAnswer": "${generateMoneyString(totalHaveCents)}" },
          { "label": "Working equation (money needed):", "expectedAnswer": "${generateMoneyString(costCents)}-${generateMoneyString(totalHaveCents)}" },
          { "label": "Final answer for money needed ($):", "expectedAnswer": "${answer}" }
        ]
      }`;
    } else if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isMCQ) {
      const wrong1 = generateMoneyString(needCents + 100);
      const wrong2 = generateMoneyString(totalHaveCents);
      const wrong3 = generateMoneyString(costCents - haveCents);
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}
      `;
    }

  } else if (activeVariant === 'advanced_deduce_missing_price') {
    const c1 = (Math.floor(Math.random() * 20) + 10) * 100 + (Math.floor(Math.random() * 9) * 10);
    const c2 = (Math.floor(Math.random() * 20) + 10) * 100 + (Math.floor(Math.random() * 9) * 10);
    const sumCents = c1 + c2;
    const paidCents = 10000; // $100
    const changeCents = paidCents - sumCents;
    
    answer = generateMoneyString(c2);
    const items = getRandomDivisibleObjects(2);

    questionText = getQText(
      `${names[0]} bought a ${items[0]} and a ${items[1]}.\nThey paid with a ${generateMoneyString(paidCents)} note and received ${generateMoneyString(changeCents)} in change.\nIf the ${items[0]} costs ${generateMoneyString(c1)}, how much does the ${items[1]} cost?\nShow your working and the final answer.`,
      `Total change from ${generateMoneyString(paidCents)} is ${generateMoneyString(changeCents)}. Item 1 costs ${generateMoneyString(c1)}. What is the cost of Item 2?`
    );

    hint = `First, find the total cost of the two items by subtracting the change from the amount paid. Then subtract the cost of the first item to find the cost of the second item.`;
    solutionSteps = [
      `1. Find the total cost: ${generateMoneyString(paidCents)} - ${generateMoneyString(changeCents)} = ${generateMoneyString(sumCents)}.`,
      `2. Subtract the cost of the first item: ${generateMoneyString(sumCents)} - ${generateMoneyString(c1)} = ${answer}.`,
      `3. Therefore, the second item costs ${answer}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Working equation (total cost):", "expectedAnswer": "${generateMoneyString(paidCents)}-${generateMoneyString(changeCents)}" },
          { "label": "Total cost ($):", "expectedAnswer": "${generateMoneyString(sumCents)}" },
          { "label": "Working equation (cost of second item):", "expectedAnswer": "${generateMoneyString(sumCents)}-${generateMoneyString(c1)}" },
          { "label": "Final answer for cost of second item ($):", "expectedAnswer": "${answer}" }
        ]
      }`;
    } else if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isMCQ) {
      const wrong1 = generateMoneyString(c2 + 100);
      const wrong2 = generateMoneyString(sumCents);
      const wrong3 = generateMoneyString(Math.abs(c2 - 100));
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}
      `;
    }

  } else if (activeVariant === 'advanced_equal_sharing') {
    const costCents = (Math.floor(Math.random() * 30) + 10) * 100 * 2; // Make sure it's divisible by 2, e.g. 2000, 2200
    const eachCents = costCents / 2;
    
    answer = generateMoneyString(eachCents);
    const item = getRandomDivisibleObjects(1);

    questionText = getQText(
      `${names[0]} and ${names[1]} bought a ${item} that costs ${generateMoneyString(costCents)}.\nThey shared the cost equally.\nHow much did each person pay?\nShow your working and the final answer.`,
      `Share ${generateMoneyString(costCents)} equally between 2 people. How much does each person pay?`
    );

    hint = `To share the cost equally, divide the total cost by 2.`;
    solutionSteps = [
      `1. Total cost of the ${item} = ${generateMoneyString(costCents)}.`,
      `2. Divide by 2: ${generateMoneyString(costCents)} ÷ 2 = ${answer}.`,
      `3. Therefore, each person pays ${answer}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Working equation (divide by 2):", "expectedAnswer": "${generateMoneyString(costCents)}/2" },
          { "label": "Final answer for amount each person pays ($):", "expectedAnswer": "${answer}" }
        ]
      }`;
    } else if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isMCQ) {
      const wrong1 = generateMoneyString(eachCents + 100);
      const wrong2 = generateMoneyString(costCents);
      const wrong3 = generateMoneyString(eachCents - 100);
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}
      `;
    }

  } else if (activeVariant === 'advanced_reverse_change') {
    const costCents = (Math.floor(Math.random() * 20) + 10) * 100;
    const paidCents = 10000; // $100
    const changeCents = paidCents - costCents;
    const item = getRandomDivisibleObjects(1);
    
    // Instead of exactly 3 notes, we'll just say "received exactly X amount in change" for simplicity if rendering money is not needed, 
    // but the blueprint says "After buying an item, Person A has exactly 3 notes left that total $60. Deducing the change received."
    // Let's adapt it to: "After buying an item, Person A received exactly 3 notes in change. The notes are two $10 notes and one $5 note. How much did the item cost?"
    
    const changeOptions = [
      { notes: ['$10', '$10', '$5'], cents: 2500 },
      { notes: ['$50', '$10', '$10'], cents: 7000 },
      { notes: ['$50', '$2', '$2'], cents: 5400 },
      { notes: ['$10', '$5', '$5'], cents: 2000 }
    ];
    const changeSet = changeOptions[Math.floor(Math.random() * changeOptions.length)];
    const theCost = paidCents - changeSet.cents;

    answer = generateMoneyString(theCost);

    questionText = getQText(
      `${names[0]} bought a ${item} and paid with a ${generateMoneyString(paidCents)} note.\nThey received exactly 3 notes in change: ${changeSet.notes.join(', ')}.\nHow much did the ${item} cost?\nShow your working and the final answer.`,
      `Paid with ${generateMoneyString(paidCents)}. Received change of ${changeSet.notes.join(', ')}. Find the cost.`
    );

    hint = `First, calculate the total change received. Then, subtract the change from the amount paid to find the cost of the item.`;
    solutionSteps = [
      `1. Find the total change: ${changeSet.notes.join(' + ')} = ${generateMoneyString(changeSet.cents)}.`,
      `2. Subtract the change from the amount paid: ${generateMoneyString(paidCents)} - ${generateMoneyString(changeSet.cents)} = ${answer}.`,
      `3. Therefore, the item cost ${answer}.`
    ];

    visualEngineStr = `{
      "componentToRender": "SINGAPORE_MONEY",
      "componentData": { "items": ${JSON.stringify(changeSet.notes)}, "total": "${generateMoneyString(changeSet.cents)}" }
    }`;

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Working equation (total change):", "expectedAnswer": "${changeSet.notes.join('+')}" },
          { "label": "Total change ($):", "expectedAnswer": "${generateMoneyString(changeSet.cents)}" },
          { "label": "Working equation (cost of item):", "expectedAnswer": "${generateMoneyString(paidCents)}-${generateMoneyString(changeSet.cents)}" },
          { "label": "Final answer for cost of item ($):", "expectedAnswer": "${answer}" }
        ]
      }`;
    } else if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isMCQ) {
      const wrong1 = generateMoneyString(theCost + 100);
      const wrong2 = generateMoneyString(changeSet.cents);
      const wrong3 = generateMoneyString(Math.abs(theCost - 100));
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}
      `;
    }

  } else {
    throw new Error(`Variant '${activeVariant}' not implemented in advanced.js`);
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
    metadata: { difficulty: 'advanced', logic: activeVariant }
  };
};
