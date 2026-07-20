import { getRandomNames, getRandomDivisibleObjects } from '@/lib/utils/variable-bank';

const getShuffledOptions = (correct, distractors) => [correct, ...distractors].sort(() => 0.5 - Math.random()).slice(0, 4);

const generateMoneyString = (cents) => {
  return `$${(cents / 100).toFixed(2)}`;
};

export const generateAdvanced = (activeVariant, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions) => {
  let questionText = "";
  let answer = "";
  let hint = "";
  let solutionSteps = [];
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let customConstraints = "";

  const names = getRandomNames(2);
  const items = [getRandomDivisibleObjects(1), getRandomDivisibleObjects(1), getRandomDivisibleObjects(1), getRandomDivisibleObjects(1)];

  const getQText = (structureQ, shortQ) => {
    return isStructure ? structureQ : shortQ;
  };

  if (activeVariant === 'advanced_compare_purchases') {
    const amt1 = Math.floor(Math.random() * 300) + 100;
    const amt2 = Math.floor(Math.random() * 300) + 100;
    const amt3 = Math.floor(Math.random() * 600) + 200;
    
    const sumA = amt1 + amt2;
    const sumB = amt3;
    
    let difference = Math.abs(sumA - sumB);
    while (difference === 0) {
       difference = 50; // Just in case they are exactly the same, force a difference
    }
    
    const greaterName = sumA > sumB ? names[0] : names[1];
    answer = `${greaterName}, ${generateMoneyString(difference)}`;
    
    questionText = getQText(
      `${names[0]} bought a ${items[0]} for ${generateMoneyString(amt1)} and a ${items[1]} for ${generateMoneyString(amt2)}.\n${names[1]} bought a ${items[2]} for ${generateMoneyString(amt3)}.\nWho spent more, and by how much?\nShow your working and the final answer.`,
      `Who spent more and by how much? ${names[0]}: ${generateMoneyString(amt1)} + ${generateMoneyString(amt2)}. ${names[1]}: ${generateMoneyString(amt3)}.`
    );
    
    hint = `First calculate the total amount spent by ${names[0]}. Then compare it to what ${names[1]} spent.`;
    solutionSteps = [
      `1. ${names[0]} spent ${generateMoneyString(amt1)} + ${generateMoneyString(amt2)} = ${generateMoneyString(sumA)}.`,
      `2. ${names[1]} spent ${generateMoneyString(sumB)}.`,
      `3. ${greaterName} spent more because ${generateMoneyString(Math.max(sumA, sumB))} is greater than ${generateMoneyString(Math.min(sumA, sumB))}.`,
      `4. The difference is ${generateMoneyString(Math.max(sumA, sumB))} - ${generateMoneyString(Math.min(sumA, sumB))} = ${generateMoneyString(difference)}.`,
      `5. Therefore, ${answer}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "${names[0]} spent ($):", "expectedAnswer": "${generateMoneyString(sumA)}" },
          { "label": "${names[1]} spent ($):", "expectedAnswer": "${generateMoneyString(sumB)}" },
          { "label": "Who spent more?:", "expectedAnswer": "${greaterName}" },
          { "label": "How much more ($):", "expectedAnswer": "${generateMoneyString(difference)}" }
        ]
      }`;
    }
    
    if (isMCQ) {
      const wrong1 = `${sumA > sumB ? names[1] : names[0]}, ${generateMoneyString(difference)}`;
      const wrong2 = `${greaterName}, ${generateMoneyString(difference + 50)}`;
      const wrong3 = `${sumA > sumB ? names[1] : names[0]}, ${generateMoneyString(difference + 50)}`;
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}`;
    }

  } else if (activeVariant === 'advanced_compare_sums') {
    const a1 = Math.floor(Math.random() * 200) + 100;
    const a2 = Math.floor(Math.random() * 200) + 100;
    const a3 = Math.floor(Math.random() * 400) + 200;
    
    const sumAB = a1 + a2;
    const sumC = a3;
    const diff = Math.abs(sumAB - sumC) || 10;
    
    answer = generateMoneyString(diff);
    
    questionText = getQText(
      `A ${items[0]} costs ${generateMoneyString(a1)} and a ${items[1]} costs ${generateMoneyString(a2)}.\nA ${items[2]} costs ${generateMoneyString(a3)}.\nWhat is the difference in price between buying the first two items together, compared to buying the third item alone?\nShow your working and the final answer.`,
      `Find the difference between the sum of ${generateMoneyString(a1)} and ${generateMoneyString(a2)}, and ${generateMoneyString(a3)}.`
    );
    
    hint = `First, find the total cost of the first two items. Then, subtract the smaller amount from the larger amount to find the difference.`;
    solutionSteps = [
      `1. Total cost of the ${items[0]} and ${items[1]} = ${generateMoneyString(a1)} + ${generateMoneyString(a2)} = ${generateMoneyString(sumAB)}.`,
      `2. Cost of the ${items[2]} = ${generateMoneyString(sumC)}.`,
      `3. To find the difference, subtract the smaller amount from the larger amount: ${generateMoneyString(Math.max(sumAB, sumC))} - ${generateMoneyString(Math.min(sumAB, sumC))} = ${answer}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Total of first two items ($):", "expectedAnswer": "${generateMoneyString(sumAB)}" },
          { "label": "Working equation (difference):", "expectedAnswer": "${generateMoneyString(Math.max(sumAB, sumC))}-${generateMoneyString(Math.min(sumAB, sumC))}" },
          { "label": "Difference ($):", "expectedAnswer": "${answer}" }
        ]
      }`;
    }
    
    if (isMCQ) {
      const options = getShuffledOptions(answer, [generateMoneyString(diff + 100), generateMoneyString(diff - 50), generateMoneyString(sumAB + sumC)]);
      customConstraints = `1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}`;
    }

  } else if (activeVariant === 'advanced_post_spending_comparison') {
    const amt1 = Math.floor(Math.random() * 800) + 200;
    const amt2 = Math.floor(Math.random() * 800) + 200;
    const spent = Math.floor(Math.random() * (amt1 - 100)) + 50; // Ensure Person A still has money
    
    const rem1 = amt1 - spent;
    const greaterName = rem1 > amt2 ? names[0] : names[1];
    answer = greaterName;
    
    questionText = getQText(
      `${names[0]} has ${generateMoneyString(amt1)}. ${names[1]} has ${generateMoneyString(amt2)}.\nIf ${names[0]} spends ${generateMoneyString(spent)} on a ${items[0]}, who has more money now?\nShow your working and the final answer.`,
      `${names[0]} had ${generateMoneyString(amt1)} and spent ${generateMoneyString(spent)}. ${names[1]} has ${generateMoneyString(amt2)}. Who has more now?`
    );
    
    hint = `First, figure out how much money ${names[0]} has left after buying the ${items[0]}. Then compare it to ${names[1]}'s amount.`;
    solutionSteps = [
      `1. ${names[0]} had ${generateMoneyString(amt1)} and spent ${generateMoneyString(spent)}.`,
      `2. ${names[0]} now has ${generateMoneyString(amt1)} - ${generateMoneyString(spent)} = ${generateMoneyString(rem1)}.`,
      `3. ${names[1]} has ${generateMoneyString(amt2)}.`,
      `4. Since ${generateMoneyString(Math.max(rem1, amt2))} is greater than ${generateMoneyString(Math.min(rem1, amt2))}, ${answer} has more.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "${names[0]} money left ($):", "expectedAnswer": "${generateMoneyString(rem1)}" },
          { "label": "Who has more money?:", "expectedAnswer": "${answer}" }
        ]
      }`;
    }
    
    if (isMCQ) {
      const options = [names[0], names[1]];
      customConstraints = `1. Provide exactly these 2 options in MCQ: ${JSON.stringify(options)}`;
    }

  } else if (activeVariant === 'advanced_affordability_combo') {
    const c1 = Math.floor(Math.random() * 300) + 100;
    const c2 = Math.floor(Math.random() * 300) + 100;
    const c3 = Math.floor(Math.random() * 500) + 400; // expensive
    
    // We want the user to be able to afford c1 and c2 together, but no other combination.
    const haveAmt = (c1 + c2) + Math.floor(Math.random() * 50); // Just enough for c1 + c2
    
    // Scramble the items and prices together
    const mapping = [
      { item: items[0], price: c1 },
      { item: items[1], price: c2 },
      { item: items[2], price: c3 }
    ].sort(() => 0.5 - Math.random());
    
    // Find the two affordable items
    const affordableNames = [mapping.find(m => m.price === c1).item, mapping.find(m => m.price === c2).item].sort();
    
    answer = `${affordableNames[0]} and ${affordableNames[1]}`;
    
    questionText = getQText(
      `${names[0]} has ${generateMoneyString(haveAmt)}.\nA ${mapping[0].item} costs ${generateMoneyString(mapping[0].price)}.\nA ${mapping[1].item} costs ${generateMoneyString(mapping[1].price)}.\nA ${mapping[2].item} costs ${generateMoneyString(mapping[2].price)}.\nWhich TWO items can ${names[0]} afford to buy together?\nShow your working and the final answer.`,
      `With ${generateMoneyString(haveAmt)}, which two can you buy? ${mapping[0].item} (${generateMoneyString(mapping[0].price)}), ${mapping[1].item} (${generateMoneyString(mapping[1].price)}), or ${mapping[2].item} (${generateMoneyString(mapping[2].price)}).`
    );
    
    hint = `Try adding the prices of two items together. The total cost must be less than or equal to the money you have.`;
    solutionSteps = [
      `1. Find the sum of the two cheapest items: ${generateMoneyString(c1)} + ${generateMoneyString(c2)} = ${generateMoneyString(c1 + c2)}.`,
      `2. Compare this to what ${names[0]} has: ${generateMoneyString(c1 + c2)} is less than or equal to ${generateMoneyString(haveAmt)}, so they can afford both.`,
      `3. Any other combination with the ${mapping.find(m => m.price === c3).item} (${generateMoneyString(c3)}) would cost more than what they have.`,
      `4. Therefore, they can buy the ${answer}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Two affordable items:", "expectedAnswer": "${answer}" },
          { "label": "Total cost ($):", "expectedAnswer": "${generateMoneyString(c1 + c2)}" },
          { "label": "Can afford them? (Yes/No):", "expectedAnswer": "Yes" }
        ]
      }`;
    }
    
    if (isMCQ) {
      const wrong1 = `${mapping[0].item} and ${mapping[2].item}`;
      const wrong2 = `${mapping[1].item} and ${mapping[2].item}`;
      // Just ensure wrong answers are sorted alphabetically
      const w1Sorted = [mapping[0].item, mapping[2].item].sort().join(' and ');
      const w2Sorted = [mapping[1].item, mapping[2].item].sort().join(' and ');
      const options = getShuffledOptions(answer, [w1Sorted, w2Sorted]);
      customConstraints = `1. Provide exactly these options in MCQ: ${JSON.stringify(options)}`;
    }

  } else if (activeVariant === 'advanced_multi_step_affordability') {
    const c1 = Math.floor(Math.random() * 200) + 100;
    const c2 = Math.floor(Math.random() * 200) + 100;
    const c3 = Math.floor(Math.random() * 200) + 100;
    const totalCost = c1 + c2 + c3;
    
    const hasEnough = Math.random() > 0.5;
    const haveAmt = hasEnough 
      ? totalCost + Math.floor(Math.random() * 100) + 10 
      : totalCost - (Math.floor(Math.random() * 100) + 10);
      
    const difference = Math.abs(haveAmt - totalCost);
    answer = `${hasEnough ? 'Yes' : 'No'}, ${generateMoneyString(difference)}`;
    
    questionText = getQText(
      `${names[0]} wants to buy a ${items[0]} for ${generateMoneyString(c1)}, a ${items[1]} for ${generateMoneyString(c2)}, and a ${items[2]} for ${generateMoneyString(c3)}.\nThey have ${generateMoneyString(haveAmt)}.\nDo they have enough money? What is the difference (either left over or needed)?\nShow your working and the final answer (e.g. Yes, $1.00).`,
      `Total items cost: ${generateMoneyString(c1)}, ${generateMoneyString(c2)}, ${generateMoneyString(c3)}. You have ${generateMoneyString(haveAmt)}. Do you have enough, and what is the difference?`
    );
    
    hint = `First, calculate the total cost of all three items. Then, compare it to the amount of money ${names[0]} has, and subtract to find the difference.`;
    solutionSteps = [
      `1. Total cost = ${generateMoneyString(c1)} + ${generateMoneyString(c2)} + ${generateMoneyString(c3)} = ${generateMoneyString(totalCost)}.`,
      `2. ${names[0]} has ${generateMoneyString(haveAmt)}.`,
      `3. Since ${generateMoneyString(haveAmt)} is ${hasEnough ? 'greater than' : 'less than'} ${generateMoneyString(totalCost)}, they ${hasEnough ? 'do' : 'do not'} have enough money.`,
      `4. Difference = ${generateMoneyString(Math.max(haveAmt, totalCost))} - ${generateMoneyString(Math.min(haveAmt, totalCost))} = ${generateMoneyString(difference)}.`,
      `5. Therefore, ${answer}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Total cost ($):", "expectedAnswer": "${generateMoneyString(totalCost)}" },
          { "label": "Have enough? (Yes/No):", "expectedAnswer": "${hasEnough ? 'Yes' : 'No'}" },
          { "label": "Difference ($):", "expectedAnswer": "${generateMoneyString(difference)}" }
        ]
      }`;
    }
    
    if (isMCQ) {
      const wrong1 = `${hasEnough ? 'No' : 'Yes'}, ${generateMoneyString(difference)}`;
      const wrong2 = `${hasEnough ? 'Yes' : 'No'}, ${generateMoneyString(difference + 50)}`;
      const wrong3 = `${hasEnough ? 'No' : 'Yes'}, ${generateMoneyString(difference + 50)}`;
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}`;
    }
  }

  const aiPrompt = `
You are a Primary 2 Math curriculum expert. Generate a strict JSON payload for the subtopic "Money Comparison".

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
    visualEngine: visualEngineStr,
    inputRequirement: inputRequirementStr
  };
};
