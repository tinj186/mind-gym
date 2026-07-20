import { getRandomNames, getRandomDivisibleObjects } from '@/lib/utils/variable-bank';

const getShuffledOptions = (correct, distractors) => [correct, ...distractors].sort(() => 0.5 - Math.random()).slice(0, 4);

const generateMoneyString = (cents) => {
  return `$${(cents / 100).toFixed(2)}`;
};

export const generateFoundation = (activeVariant, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions) => {
  let questionText = "";
  let answer = "";
  let hint = "";
  let solutionSteps = [];
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let customConstraints = "";

  const names = getRandomNames(2);
  const items = [getRandomDivisibleObjects(1), getRandomDivisibleObjects(1), getRandomDivisibleObjects(1)];

  const getQText = (structureQ, shortQ) => {
    return isStructure ? structureQ : shortQ;
  };

  if (activeVariant === 'foundation_compare_two_amounts') {
    const amt1 = Math.floor(Math.random() * 90) + 10;
    let amt2 = Math.floor(Math.random() * 90) + 10;
    while (amt1 === amt2) amt2 = Math.floor(Math.random() * 90) + 10;
    
    const askGreater = Math.random() > 0.5;
    const greaterAmt = Math.max(amt1, amt2);
    const smallerAmt = Math.min(amt1, amt2);
    const greaterName = amt1 > amt2 ? names[0] : names[1];
    const smallerName = amt1 < amt2 ? names[0] : names[1];
    
    const targetName = askGreater ? greaterName : smallerName;
    const targetAmt = askGreater ? greaterAmt : smallerAmt;
    const targetAmtStr = generateMoneyString(targetAmt);
    
    answer = `${targetName}, ${targetAmtStr}`;
    
    questionText = getQText(
      `${names[0]} has ${generateMoneyString(amt1)} and ${names[1]} has ${generateMoneyString(amt2)}.\nWho has the ${askGreater ? 'greater' : 'smaller'} amount of money, and how much is it?\nShow your working and the final answer.`,
      `${names[0]} has ${generateMoneyString(amt1)}. ${names[1]} has ${generateMoneyString(amt2)}. Who has ${askGreater ? 'more' : 'less'}, and how much?`
    );
    
    hint = `Compare the dollars and cents. The one with the ${askGreater ? 'higher' : 'lower'} number is the answer.`;
    solutionSteps = [
      `1. Compare ${generateMoneyString(amt1)} and ${generateMoneyString(amt2)}.`,
      `2. ${generateMoneyString(greaterAmt)} is greater than ${generateMoneyString(smallerAmt)}.`,
      `3. ${targetName} has the ${askGreater ? 'greater' : 'smaller'} amount.`,
      `4. Therefore, the answer is ${answer}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Who has ${askGreater ? 'more' : 'less'}?:", "expectedAnswer": "${targetName}" },
          { "label": "Amount ($):", "expectedAnswer": "${targetAmtStr}" }
        ]
      }`;
    }
    
    if (isMCQ) {
      const wrong1 = `${targetName === names[0] ? names[1] : names[0]}, ${targetAmtStr}`;
      const wrong2 = `${targetName}, ${generateMoneyString(targetAmt + 10)}`;
      const wrong3 = `${targetName === names[0] ? names[1] : names[0]}, ${generateMoneyString(targetAmt + 10)}`;
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}`;
    }

  } else if (activeVariant === 'foundation_cheaper_expensive') {
    const amt1 = Math.floor(Math.random() * 90) + 10;
    let amt2 = Math.floor(Math.random() * 90) + 10;
    while (amt1 === amt2) amt2 = Math.floor(Math.random() * 90) + 10;
    
    const askExpensive = Math.random() > 0.5;
    const moreExpensiveAmt = Math.max(amt1, amt2);
    const cheaperAmt = Math.min(amt1, amt2);
    const item1 = items[0];
    const item2 = items[1];
    
    const item1Expensive = amt1 > amt2;
    const cheaperItem = item1Expensive ? item2 : item1;
    const moreExpensiveItem = item1Expensive ? item1 : item2;
    const differenceStr = generateMoneyString(moreExpensiveAmt - cheaperAmt);
    
    answer = `${askExpensive ? moreExpensiveItem : cheaperItem}, ${differenceStr}`;
    
    questionText = getQText(
      `A ${item1} costs ${generateMoneyString(amt1)} and a ${item2} costs ${generateMoneyString(amt2)}.\nWhich item is ${askExpensive ? 'more expensive' : 'cheaper'} and by how much?\nShow your working and the final answer.`,
      `Which is ${askExpensive ? 'more expensive' : 'cheaper'}, and by how much: a ${item1} for ${generateMoneyString(amt1)} or a ${item2} for ${generateMoneyString(amt2)}?`
    );
    
    hint = `First compare the prices to find the ${askExpensive ? 'more expensive' : 'cheaper'} item. Then subtract the smaller price from the larger price to find the difference.`;
    solutionSteps = [
      `1. Compare the prices: ${generateMoneyString(amt1)} and ${generateMoneyString(amt2)}.`,
      `2. ${generateMoneyString(moreExpensiveAmt)} is greater than ${generateMoneyString(cheaperAmt)}.`,
      `3. The ${askExpensive ? 'more expensive' : 'cheaper'} item is the ${askExpensive ? moreExpensiveItem : cheaperItem}.`,
      `4. To find the difference, subtract: ${generateMoneyString(moreExpensiveAmt)} - ${generateMoneyString(cheaperAmt)} = ${differenceStr}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "${askExpensive ? 'More expensive' : 'Cheaper'} item:", "expectedAnswer": "${askExpensive ? moreExpensiveItem : cheaperItem}" },
          { "label": "Difference ($):", "expectedAnswer": "${differenceStr}" }
        ]
      }`;
    }
    
    if (isMCQ) {
      const options = getShuffledOptions(answer, [item1 === answer ? item2 : item1]);
      customConstraints = `1. Provide exactly these 2 options in MCQ: ${JSON.stringify(options)}`;
    }

  } else if (activeVariant === 'foundation_true_false_comparison') {
    const amt1 = Math.floor(Math.random() * 90) + 10;
    let amt2 = Math.floor(Math.random() * 90) + 10;
    while (amt1 === amt2) amt2 = Math.floor(Math.random() * 90) + 10;
    
    const useGreater = Math.random() > 0.5;
    const isTrue = useGreater ? amt1 > amt2 : amt1 < amt2;
    
    answer = isTrue ? "True" : "False";
    
    questionText = getQText(
      `Is the following statement True or False?\n${generateMoneyString(amt1)} is ${useGreater ? 'greater' : 'less'} than ${generateMoneyString(amt2)}.\nShow your working and the final answer.`,
      `True or False: ${generateMoneyString(amt1)} is ${useGreater ? 'greater' : 'less'} than ${generateMoneyString(amt2)}.`
    );
    
    hint = `Compare the two amounts to see if the statement is correct.`;
    solutionSteps = [
      `1. The amounts are ${generateMoneyString(amt1)} and ${generateMoneyString(amt2)}.`,
      `2. ${generateMoneyString(amt1)} is actually ${amt1 > amt2 ? 'greater' : 'less'} than ${generateMoneyString(amt2)}.`,
      `3. The statement says it is ${useGreater ? 'greater' : 'less'}, so it is ${answer}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Actual greater amount ($):", "expectedAnswer": "${generateMoneyString(Math.max(amt1, amt2))}" },
          { "label": "True or False:", "expectedAnswer": "${answer}" }
        ]
      }`;
    }
    
    if (isMCQ) {
      const options = ["True", "False"];
      customConstraints = `1. Provide exactly these 2 options in MCQ: ${JSON.stringify(options)}`;
    }

  } else if (activeVariant === 'foundation_order_three_simple') {
    const p1 = Math.floor(Math.random() * 30) + 10;
    const p2 = Math.floor(Math.random() * 30) + 40;
    const p3 = Math.floor(Math.random() * 20) + 75;
    
    const prices = [p1, p2, p3].sort(() => 0.5 - Math.random());
    const askCheapestToExpensive = Math.random() > 0.5;
    
    const sorted = [...prices].sort((a, b) => askCheapestToExpensive ? a - b : b - a);
    answer = `${generateMoneyString(sorted[0])}, ${generateMoneyString(sorted[1])}, ${generateMoneyString(sorted[2])}`;
    
    questionText = getQText(
      `Order the following amounts from ${askCheapestToExpensive ? 'cheapest to most expensive' : 'most expensive to cheapest'}:\n${generateMoneyString(prices[0])}, ${generateMoneyString(prices[1])}, ${generateMoneyString(prices[2])}\nShow your final answer.`,
      `Order from ${askCheapestToExpensive ? 'cheapest to most expensive' : 'most expensive to cheapest'}:\n${generateMoneyString(prices[0])}, ${generateMoneyString(prices[1])}, ${generateMoneyString(prices[2])}`
    );
    
    hint = `Compare the amounts and rank them in the requested order.`;
    solutionSteps = [
      `1. Compare the three amounts.`,
      `2. The ${askCheapestToExpensive ? 'smallest' : 'largest'} is ${generateMoneyString(sorted[0])}.`,
      `3. The ${askCheapestToExpensive ? 'largest' : 'smallest'} is ${generateMoneyString(sorted[2])}.`,
      `4. In order: ${answer}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "First:", "expectedAnswer": "${generateMoneyString(sorted[0])}" },
          { "label": "Second:", "expectedAnswer": "${generateMoneyString(sorted[1])}" },
          { "label": "Third:", "expectedAnswer": "${generateMoneyString(sorted[2])}" }
        ]
      }`;
    }
    
    if (isMCQ) {
      const wrong1 = `${generateMoneyString(sorted[0])}, ${generateMoneyString(sorted[2])}, ${generateMoneyString(sorted[1])}`;
      const wrong2 = `${generateMoneyString(sorted[2])}, ${generateMoneyString(sorted[1])}, ${generateMoneyString(sorted[0])}`;
      const wrong3 = `${generateMoneyString(sorted[1])}, ${generateMoneyString(sorted[0])}, ${generateMoneyString(sorted[2])}`;
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}`;
    }

  } else if (activeVariant === 'foundation_affordability_single') {
    const haveAmt = Math.floor(Math.random() * 50) + 30; // 30 to 79 cents
    
    // Create two items, one affordable, one too expensive
    const c1 = haveAmt - (Math.floor(Math.random() * 20) + 5); // Affordable
    const c2 = haveAmt + (Math.floor(Math.random() * 20) + 5); // Too expensive
    
    // Scramble order
    const prices = [c1, c2].sort(() => 0.5 - Math.random());
    const affordableItem = prices.indexOf(c1) === 0 ? items[0] : items[1];
    
    answer = affordableItem;
    
    questionText = getQText(
      `${names[0]} has ${generateMoneyString(haveAmt)}.\nA ${items[0]} costs ${generateMoneyString(prices[0])} and a ${items[1]} costs ${generateMoneyString(prices[1])}.\nWhich item can ${names[0]} afford to buy?\nShow your working and the final answer.`,
      `With ${generateMoneyString(haveAmt)}, which can you buy: ${items[0]} (${generateMoneyString(prices[0])}) or ${items[1]} (${generateMoneyString(prices[1])})?`
    );
    
    hint = `To afford an item, the cost must be less than or equal to the money you have. Compare the cost of each item to what you have.`;
    solutionSteps = [
      `1. ${names[0]} has ${generateMoneyString(haveAmt)}.`,
      `2. The ${items[0]} costs ${generateMoneyString(prices[0])}. ${generateMoneyString(prices[0])} is ${prices[0] <= haveAmt ? 'less than or equal to' : 'greater than'} ${generateMoneyString(haveAmt)}, so they ${prices[0] <= haveAmt ? 'can' : 'cannot'} afford it.`,
      `3. The ${items[1]} costs ${generateMoneyString(prices[1])}. ${generateMoneyString(prices[1])} is ${prices[1] <= haveAmt ? 'less than or equal to' : 'greater than'} ${generateMoneyString(haveAmt)}, so they ${prices[1] <= haveAmt ? 'can' : 'cannot'} afford it.`,
      `4. Therefore, the answer is ${answer}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Can afford ${items[0]}? (Yes/No):", "expectedAnswer": "${prices[0] <= haveAmt ? 'Yes' : 'No'}" },
          { "label": "Can afford ${items[1]}? (Yes/No):", "expectedAnswer": "${prices[1] <= haveAmt ? 'Yes' : 'No'}" },
          { "label": "Item they can afford:", "expectedAnswer": "${answer}" }
        ]
      }`;
    }
    
    if (isMCQ) {
      const options = getShuffledOptions(answer, [prices.indexOf(c1) === 0 ? items[1] : items[0]]);
      customConstraints = `1. Provide exactly these 2 options in MCQ: ${JSON.stringify(options)}`;
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
