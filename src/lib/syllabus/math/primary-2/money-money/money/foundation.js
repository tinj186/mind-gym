import { getRandomNames } from '@/lib/utils/variable-bank';

const getShuffledOptions = (correct, distractors) => [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

const generateMoneyString = (cents) => {
  return `$${(cents / 100).toFixed(2)}`;
};

export const foundationLogic = (activeVariant, config, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions, context, getQText) => {
  let questionText = "";
  let answer = "";
  let hint = "";
  let solutionSteps = [];
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let customConstraints = "";
  
  const names = getRandomNames(2);

  if (activeVariant === 'foundation_counting_coins_notes') {
    const pool = ['5¢', '10¢', '20¢', '50¢', '$1', '$2', '$5', '$10', '$50'];
    const itemCount = Math.floor(Math.random() * 4) + 4; 
    const generatedItems = [];
    let sumCents = 0;

    for (let i = 0; i < itemCount; i++) {
      const item = pool[Math.floor(Math.random() * pool.length)];
      const valCents = item.endsWith('¢') ? parseInt(item.replace('¢', ''), 10) : parseInt(item.replace('$', ''), 10) * 100;
      if (sumCents + valCents <= 10000) { generatedItems.push(item); sumCents += valCents; }
    }
    if (generatedItems.length === 0) { generatedItems.push('$10', '50¢'); sumCents = 1050; }

    const displayTotal = generateMoneyString(sumCents);
    answer = displayTotal;
    
    questionText = getQText(
      `${names[0]} opened their wallet and found these notes and coins. Count the total amount of money.\nShow your working and the final answer.`,
      `Count the total amount of money shown below.`
    );
    
    hint = `Group the notes first to find the total dollars, then add the coins to find the cents. Write the answer as $XX.XX`;
    solutionSteps = [
      `1. The items are: ${generatedItems.join(', ')}.`,
      `2. Add their values together to find the total sum.`,
      `3. The total amount is ${answer}.`
    ];

    visualEngineStr = `{
      "componentToRender": "SINGAPORE_MONEY",
      "componentData": { "items": ${JSON.stringify(generatedItems)}, "total": "${displayTotal}" }
    }`;

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Working equation (adding values):", "expectedAnswer": "${generatedItems.join('+')}" },
          { "label": "Final answer ($XX.XX):", "expectedAnswer": "${answer}" }
        ]
      }`;
    } else if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isMCQ) {
      const wrong1 = generateMoneyString(sumCents + 100);
      const wrong2 = generateMoneyString(sumCents + 10);
      const wrong3 = generateMoneyString(Math.max(0, sumCents - 100));
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}
        2. Set defectMap for incorrect options to "CARELESS_CALCULATION".
      `;
    }

  } else if (activeVariant === 'foundation_identifying_target_amount') {
    const targetCents = (Math.floor(Math.random() * 50) + 10) * 100 + (Math.floor(Math.random() * 9) * 10); 
    const isMatch = Math.random() > 0.5;
    const actualCents = isMatch ? targetCents : targetCents + (Math.random() > 0.5 ? 100 : -100);
    
    // Deconstruct actualCents to items
    const generatedItems = [];
    let rem = actualCents;
    const denoms = [
      { val: 5000, label: '$50' },
      { val: 1000, label: '$10' },
      { val: 500, label: '$5' },
      { val: 200, label: '$2' },
      { val: 100, label: '$1' },
      { val: 50, label: '50¢' },
      { val: 20, label: '20¢' },
      { val: 10, label: '10¢' }
    ];
    for (let d of denoms) {
      while (rem >= d.val) {
        generatedItems.push(d.label);
        rem -= d.val;
      }
    }

    const displayTarget = generateMoneyString(targetCents);
    answer = isMatch ? "Yes" : "No";

    questionText = getQText(
      `${names[0]} wants to buy a toy that costs ${displayTarget}. They have the money shown below. Do they have exactly ${displayTarget}?\nShow your working and the final answer (Yes/No).`,
      `Does the money shown equal exactly ${displayTarget}? (Yes/No)`
    );

    hint = `First count the money shown, then check if it matches the target amount of ${displayTarget}.`;
    const displayActual = generateMoneyString(actualCents);
    solutionSteps = [
      `1. Count the money shown: ${generatedItems.join(' + ')} = ${displayActual}.`,
      `2. Compare it with the target amount: ${displayTarget}.`,
      `3. ${displayActual} is ${isMatch ? 'equal to' : 'not equal to'} ${displayTarget}.`,
      `4. Therefore, the answer is ${answer}.`
    ];

    visualEngineStr = `{
      "componentToRender": "SINGAPORE_MONEY",
      "componentData": { "items": ${JSON.stringify(generatedItems)}, "total": "${displayActual}" }
    }`;

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Amount of money shown ($):", "expectedAnswer": "${displayActual}" },
          { "label": "Is it exactly ${displayTarget}? (Yes/No):", "expectedAnswer": "${answer}" }
        ]
      }`;
    } else if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isMCQ) {
      const options = ["Yes", "No"];
      customConstraints = `
        1. Provide exactly these 2 options in MCQ: ${JSON.stringify(options)}
      `;
    }

  } else if (activeVariant === 'foundation_comparing_two_sets') {
    const base = (Math.floor(Math.random() * 20) + 5) * 100 + (Math.floor(Math.random() * 9) * 10);
    const larger = base + (Math.floor(Math.random() * 10) + 1) * 100 + 50; 
    
    // Randomize who gets the larger amount
    const isP1Larger = Math.random() > 0.5;
    const p1Amt = isP1Larger ? larger : base;
    const p2Amt = isP1Larger ? base : larger;
    
    const greaterAmt = isP1Larger ? p1Amt : p2Amt;
    const smallerAmt = isP1Larger ? p2Amt : p1Amt;
    const diff = greaterAmt - smallerAmt;
    const askGreater = Math.random() > 0.5;
    const greaterName = isP1Larger ? names[0] : names[1];

    if (isStructure) {
      answer = generateMoneyString(diff);
      questionText = getQText(
        `${names[0]} has ${generateMoneyString(p1Amt)}. ${names[1]} has ${generateMoneyString(p2Amt)}.\nWho has more money and how much more do they have?\nShow your working and the final answer.`,
        `${names[0]} has ${generateMoneyString(p1Amt)}. ${names[1]} has ${generateMoneyString(p2Amt)}.\nHow much more money does the person with more have?`
      );
      hint = `First find who has more money, then subtract the smaller amount from the larger amount to find the difference.`;
      solutionSteps = [
        `1. ${greaterName} has ${generateMoneyString(greaterAmt)} which is greater than ${generateMoneyString(smallerAmt)}.`,
        `2. The working equation is ${generateMoneyString(greaterAmt)}-${generateMoneyString(smallerAmt)}.`,
        `3. The difference is ${answer}.`
      ];
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Who has more money?:", "expectedAnswer": "${greaterName}" },
          { "label": "The greater amount is ($):", "expectedAnswer": "${generateMoneyString(greaterAmt)}" },
          { "label": "The smaller amount is ($):", "expectedAnswer": "${generateMoneyString(smallerAmt)}" },
          { "label": "Working equation (difference):", "expectedAnswer": "${generateMoneyString(greaterAmt)}-${generateMoneyString(smallerAmt)}" },
          { "label": "Final answer for how much more ($):", "expectedAnswer": "${answer}" }
        ]
      }`;
    } else {
      answer = askGreater ? generateMoneyString(greaterAmt) : generateMoneyString(smallerAmt);
      questionText = getQText(
        `${names[0]} has ${generateMoneyString(p1Amt)}. ${names[1]} has ${generateMoneyString(p2Amt)}.\nWho has the ${askGreater ? 'greater' : 'smaller'} amount of money? How much is it?\nShow your working and the final answer.`,
        `Which amount is ${askGreater ? 'greater' : 'smaller'}: ${generateMoneyString(p1Amt)} or ${generateMoneyString(p2Amt)}?`
      );
      hint = `Compare the dollar amounts first. The one with more dollars is greater.`;
      solutionSteps = [
        `1. Compare the two amounts: ${generateMoneyString(p1Amt)} and ${generateMoneyString(p2Amt)}.`,
        `2. ${generateMoneyString(greaterAmt)} is greater than ${generateMoneyString(smallerAmt)}.`,
        `3. The ${askGreater ? 'greater' : 'smaller'} amount is ${answer}.`
      ];
      if (isShort) {
        inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
      } else if (isMCQ) {
        const options = getShuffledOptions(answer, [generateMoneyString(p1Amt), generateMoneyString(p2Amt)]);
        customConstraints = `
          1. Provide exactly these 2 options in MCQ: ${JSON.stringify([generateMoneyString(p1Amt), generateMoneyString(p2Amt)])}
        `;
      }
    }

  } else if (activeVariant === 'foundation_missing_value_equation') {
    const isAddition = Math.random() > 0.5;
    const p1 = (Math.floor(Math.random() * 20) + 5) * 100 + (Math.floor(Math.random() * 9) * 10);
    const p2 = (Math.floor(Math.random() * 20) + 5) * 100 + (Math.floor(Math.random() * 9) * 10);
    const total = p1 + p2;

    const missingPart = Math.floor(Math.random() * 3); // 0 = p1, 1 = p2, 2 = total
    
    let eq = "";
    let expectedMissing = "";
    let workingEq = "";
    let storyText = "";
    
    if (isAddition) {
      if (missingPart === 0) {
        eq = `? + ${generateMoneyString(p2)} = ${generateMoneyString(total)}`;
        expectedMissing = generateMoneyString(p1);
        workingEq = `${generateMoneyString(total)}-${generateMoneyString(p2)}`;
        storyText = `${names[0]} and ${names[1]} put their money together to buy a gift.\nThey paid a total of ${generateMoneyString(total)}.\nIf ${names[1]} paid ${generateMoneyString(p2)}, how much did ${names[0]} pay?\nShow your working and the final answer.`;
        hint = `To find the missing part in an addition equation, subtract the known part from the total.`;
        solutionSteps = [
          `1. The working equation is ${workingEq}.`,
          `2. The missing value is ${expectedMissing}.`
        ];
      } else if (missingPart === 1) {
        eq = `${generateMoneyString(p1)} + ? = ${generateMoneyString(total)}`;
        expectedMissing = generateMoneyString(p2);
        workingEq = `${generateMoneyString(total)}-${generateMoneyString(p1)}`;
        storyText = `${names[0]} and ${names[1]} put their money together to buy a gift.\nThey paid a total of ${generateMoneyString(total)}.\nIf ${names[0]} paid ${generateMoneyString(p1)}, how much did ${names[1]} pay?\nShow your working and the final answer.`;
        hint = `To find the missing part in an addition equation, subtract the known part from the total.`;
        solutionSteps = [
          `1. The working equation is ${workingEq}.`,
          `2. The missing value is ${expectedMissing}.`
        ];
      } else {
        eq = `${generateMoneyString(p1)} + ${generateMoneyString(p2)} = ?`;
        expectedMissing = generateMoneyString(total);
        workingEq = `${generateMoneyString(p1)}+${generateMoneyString(p2)}`;
        storyText = `${names[0]} paid ${generateMoneyString(p1)} and ${names[1]} paid ${generateMoneyString(p2)} to buy a gift.\nHow much did the gift cost in total?\nShow your working and the final answer.`;
        hint = `To find the total in an addition equation, add the two parts together.`;
        solutionSteps = [
          `1. The working equation is ${workingEq}.`,
          `2. The missing value is ${expectedMissing}.`
        ];
      }
    } else {
      if (missingPart === 0) {
        // total is missing
        eq = `? - ${generateMoneyString(p2)} = ${generateMoneyString(p1)}`;
        expectedMissing = generateMoneyString(total);
        workingEq = `${generateMoneyString(p1)}+${generateMoneyString(p2)}`;
        storyText = `${names[0]} had some money.\nAfter buying a toy for ${generateMoneyString(p2)}, they had ${generateMoneyString(p1)} left.\nHow much money did ${names[0]} have at first?\nShow your working and the final answer.`;
        hint = `To find the starting total in a subtraction equation, add the two parts together.`;
        solutionSteps = [
          `1. The working equation is ${workingEq}.`,
          `2. The missing value is ${expectedMissing}.`
        ];
      } else if (missingPart === 1) {
        // p2 is missing
        eq = `${generateMoneyString(total)} - ? = ${generateMoneyString(p1)}`;
        expectedMissing = generateMoneyString(p2);
        workingEq = `${generateMoneyString(total)}-${generateMoneyString(p1)}`;
        storyText = `${names[0]} had ${generateMoneyString(total)}.\nThey bought a toy and received ${generateMoneyString(p1)} in change.\nHow much did the toy cost?\nShow your working and the final answer.`;
        hint = `To find the amount subtracted, subtract the final amount from the starting total.`;
        solutionSteps = [
          `1. The working equation is ${workingEq}.`,
          `2. The missing value is ${expectedMissing}.`
        ];
      } else {
        // p1 is missing
        eq = `${generateMoneyString(total)} - ${generateMoneyString(p2)} = ?`;
        expectedMissing = generateMoneyString(p1);
        workingEq = `${generateMoneyString(total)}-${generateMoneyString(p2)}`;
        storyText = `${names[0]} had ${generateMoneyString(total)}.\nThey bought a toy for ${generateMoneyString(p2)}.\nHow much money did they have left?\nShow your working and the final answer.`;
        hint = `To find the result of a subtraction, just subtract the numbers.`;
        solutionSteps = [
          `1. The working equation is ${workingEq}.`,
          `2. The missing value is ${expectedMissing}.`
        ];
      }
    }
    
    answer = expectedMissing;
    
    questionText = getQText(
      storyText,
      `Find the missing value: ${eq}`
    );

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Working equation:", "expectedAnswer": "${workingEq}" },
          { "label": "Final answer ($):", "expectedAnswer": "${answer}" }
        ]
      }`;
    } else if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isMCQ) {
      const valNum = parseInt(answer.replace('$', '').replace('.', ''));
      const wrong1 = generateMoneyString(valNum + 100);
      const wrong2 = generateMoneyString(valNum + 10);
      const wrong3 = generateMoneyString(Math.abs(valNum - 100));
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}
      `;
    }

  } else if (activeVariant === 'foundation_equivalent_exchange') {
    const smallOptions = [{ label: '10¢', val: 10 }, { label: '20¢', val: 20 }, { label: '50¢', val: 50 }];
    const small = smallOptions[Math.floor(Math.random() * smallOptions.length)];
    
    const multipliers = [5, 10, 20];
    const multiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
    const largeVal = small.val * multiplier; // cents
    const largeStr = generateMoneyString(largeVal);

    answer = `${multiplier}`;
    
    const largeType = largeVal <= 100 ? "coin" : "note";
    
    questionText = getQText(
      `${names[0]} wants to exchange a ${largeStr} ${largeType} for ${small.label} coins.\nHow many ${small.label} coins will ${names[0]} get?\nShow your working and the final answer.`,
      `How many ${small.label} coins make ${largeStr}?`
    );

    hint = `Think about how many ${small.label} coins make $1. Then multiply that by the number of dollars in ${largeStr}.`;
    
    const coinsInDollar = 100 / small.val;
    solutionSteps = [
      `1. There are ${coinsInDollar} ${small.label} coins in $1.00.`,
      `2. ${largeStr} is ${largeVal / 100} dollars.`,
      `3. ${largeVal / 100} x ${coinsInDollar} = ${answer}.`,
      `4. Therefore, there are ${answer} coins.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "How many ${small.label} coins in $1.00?:", "expectedAnswer": "${coinsInDollar}" },
          { "label": "Total number of coins:", "expectedAnswer": "${answer}" }
        ]
      }`;
    } else if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isMCQ) {
      const wrong1 = `${multiplier + coinsInDollar}`;
      const wrong2 = `${Math.abs(multiplier - coinsInDollar) || (multiplier + 1)}`;
      const wrong3 = `${multiplier * 2}`;
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}
      `;
    }

  } else {
    throw new Error(`Variant '${activeVariant}' not implemented in foundation.js`);
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
    metadata: { difficulty: 'foundation', logic: activeVariant }
  };
};
