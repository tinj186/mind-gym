import { getRandomNames, getRandomDivisibleObjects } from '@/lib/utils/variable-bank';

const getShuffledOptions = (correct, distractors) => [correct, ...distractors].sort(() => 0.5 - Math.random()).slice(0, 4);

const generateMoneyString = (cents) => {
  return `$${(cents / 100).toFixed(2)}`;
};

const numberToWords = (num) => {
  const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", 
                "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  
  if (num === 0) return "zero";
  if (num < 20) return ones[num];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? "-" + ones[num % 10] : "");
  if (num >= 100 && num < 1000) {
    const hundred = ones[Math.floor(num / 100)] + " hundred";
    const remainder = num % 100;
    if (remainder === 0) return hundred;
    return hundred + " and " + numberToWords(remainder);
  }
  return num.toString();
};

export const generateStandard = (activeVariant, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions) => {
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

  if (activeVariant === 'standard_compare_worded') {
    const d1 = Math.floor(Math.random() * 50) + 10;
    const c1 = Math.floor(Math.random() * 95) + 5;
    
    let d2 = Math.floor(Math.random() * 50) + 10;
    let c2 = Math.floor(Math.random() * 95) + 5;
    while (d1 === d2) d2 = Math.floor(Math.random() * 50) + 10;
    
    const amt1Cents = d1 * 100 + c1;
    const amt2Cents = d2 * 100 + c2;
    
    const w1 = `${numberToWords(d1)} dollars and ${numberToWords(c1)} cents`;
    const w2 = `${numberToWords(d2)} dollars and ${numberToWords(c2)} cents`;
    
    const askGreater = Math.random() > 0.5;
    const greaterAmtCents = Math.max(amt1Cents, amt2Cents);
    const smallerAmtCents = Math.min(amt1Cents, amt2Cents);
    
    const greaterStr = generateMoneyString(greaterAmtCents);
    const smallerStr = generateMoneyString(smallerAmtCents);
    const differenceStr = generateMoneyString(greaterAmtCents - smallerAmtCents);
    
    answer = `${askGreater ? greaterStr : smallerStr}, ${differenceStr}`;
    
    questionText = getQText(
      `Compare "${w1}" and "${w2}".\nWhich amount is ${askGreater ? 'greater' : 'smaller'} and by how much?\nWrite your answer in numerals.\nShow your working and the final answer.`,
      `Which is ${askGreater ? 'greater' : 'smaller'} and by how much: "${w1}" or "${w2}"? Write in numerals.`
    );
    
    hint = `First, write both amounts in numerals. Compare them to find the ${askGreater ? 'greater' : 'smaller'} amount, then subtract the smaller amount from the greater amount to find the difference.`;
    solutionSteps = [
      `1. "${w1}" is ${generateMoneyString(amt1Cents)}.`,
      `2. "${w2}" is ${generateMoneyString(amt2Cents)}.`,
      `3. Comparing the two, ${greaterStr} is greater than ${smallerStr}.`,
      `4. To find the difference, subtract: ${greaterStr} - ${smallerStr} = ${differenceStr}.`,
      `5. Therefore, the ${askGreater ? 'greater' : 'smaller'} amount is ${askGreater ? greaterStr : smallerStr} and the difference is ${differenceStr}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "${askGreater ? 'Greater' : 'Smaller'} amount ($):", "expectedAnswer": "${askGreater ? greaterStr : smallerStr}" },
          { "label": "Difference ($):", "expectedAnswer": "${differenceStr}" }
        ]
      }`;
    }
    
    if (isMCQ) {
      const wrong1 = `${askGreater ? smallerStr : greaterStr}, ${differenceStr}`;
      const wrong2 = `${askGreater ? greaterStr : smallerStr}, ${generateMoneyString(greaterAmtCents - smallerAmtCents + 10)}`;
      const wrong3 = `${askGreater ? smallerStr : greaterStr}, ${generateMoneyString(greaterAmtCents - smallerAmtCents + 10)}`;
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}`;
    }

  } else if (activeVariant === 'standard_order_three_large') {
    const p1 = Math.floor(Math.random() * 500) + 100; // 100 to 599
    const p2 = Math.floor(Math.random() * 500) + 100; 
    const p3 = Math.floor(Math.random() * 500) + 100; 
    const p4 = Math.floor(Math.random() * 500) + 100; 
    
    // Pick 3 or 4
    const useFour = Math.random() > 0.5;
    const pricesList = useFour ? [p1, p2, p3, p4] : [p1, p2, p3];
    const prices = [...new Set(pricesList)].sort(() => 0.5 - Math.random());
    
    const askMostToCheapest = Math.random() > 0.5;
    const sorted = [...prices].sort((a, b) => askMostToCheapest ? b - a : a - b);
    
    answer = sorted.map(p => generateMoneyString(p)).join(', ');
    
    const questionList = prices.map(p => generateMoneyString(p)).join(', ');
    
    questionText = getQText(
      `Order the following amounts from ${askMostToCheapest ? 'most expensive to cheapest' : 'cheapest to most expensive'}:\n${questionList}\nShow your final answer.`,
      `Order from ${askMostToCheapest ? 'most expensive to cheapest' : 'cheapest to most expensive'}:\n${questionList}`
    );
    
    hint = `Compare the dollar amounts first. If they are the same, compare the cents.`;
    solutionSteps = [
      `1. The amounts are ${questionList}.`,
      `2. Ordering them from ${askMostToCheapest ? 'most expensive to cheapest' : 'cheapest to most expensive'}, we get:`,
      `3. ${answer}.`
    ];

    if (isStructure) {
      const steps = sorted.map((p, i) => {
        const labels = ["First:", "Second:", "Third:", "Fourth:"];
        return `{ "label": "${labels[i]}", "expectedAnswer": "${generateMoneyString(p)}" }`;
      }).join(', ');
      
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          ${steps}
        ]
      }`;
    }
    
    if (isMCQ) {
      const wrong1 = [...sorted].reverse().map(p => generateMoneyString(p)).join(', ');
      const wrong2 = [...prices].map(p => generateMoneyString(p)).join(', ');
      const wrong3 = [sorted[1], sorted[0], ...sorted.slice(2)].map(p => generateMoneyString(p)).join(', ');
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}`;
    }

  } else if (activeVariant === 'standard_who_has_more_difference') {
    const amt1 = Math.floor(Math.random() * 800) + 100;
    let amt2 = Math.floor(Math.random() * 800) + 100;
    while (amt1 === amt2) amt2 = Math.floor(Math.random() * 800) + 100;
    
    const amt1Greater = amt1 > amt2;
    const greaterName = amt1Greater ? names[0] : names[1];
    const difference = Math.max(amt1, amt2) - Math.min(amt1, amt2);
    
    answer = `${greaterName}, ${generateMoneyString(difference)}`;
    
    questionText = getQText(
      `${names[0]} has ${generateMoneyString(amt1)}. ${names[1]} has ${generateMoneyString(amt2)}.\nWho has more money, and how much more do they have?\nShow your working and the final answer.`,
      `${names[0]} has ${generateMoneyString(amt1)}. ${names[1]} has ${generateMoneyString(amt2)}. Who has more, and how much more?`
    );
    
    hint = `First find who has more money. Then subtract the smaller amount from the larger amount to find the difference.`;
    solutionSteps = [
      `1. ${greaterName} has more money because ${generateMoneyString(Math.max(amt1, amt2))} is greater than ${generateMoneyString(Math.min(amt1, amt2))}.`,
      `2. To find how much more, subtract: ${generateMoneyString(Math.max(amt1, amt2))} - ${generateMoneyString(Math.min(amt1, amt2))}.`,
      `3. The difference is ${generateMoneyString(difference)}.`,
      `4. Therefore, ${answer}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Who has more money?:", "expectedAnswer": "${greaterName}" },
          { "label": "How much more ($):", "expectedAnswer": "${generateMoneyString(difference)}" }
        ]
      }`;
    }
    
    if (isMCQ) {
      const wrong1 = `${amt1Greater ? names[1] : names[0]}, ${generateMoneyString(difference)}`;
      const wrong2 = `${greaterName}, ${generateMoneyString(difference + 10)}`;
      const wrong3 = `${amt1Greater ? names[1] : names[0]}, ${generateMoneyString(difference + 10)}`;
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}`;
    }

  } else if (activeVariant === 'standard_affordability_multiple') {
    const haveAmt = Math.floor(Math.random() * 300) + 200; // 200 to 499
    
    const c1 = haveAmt + (Math.floor(Math.random() * 50) + 10); // Too expensive
    const c2 = haveAmt - (Math.floor(Math.random() * 50) + 10); // Affordable
    const c3 = haveAmt + (Math.floor(Math.random() * 100) + 60); // Too expensive
    
    const prices = [c1, c2, c3].sort(() => 0.5 - Math.random());
    const affordableIndex = prices.indexOf(c2);
    const itemAffordable = items[affordableIndex];
    
    answer = itemAffordable;
    
    questionText = getQText(
      `${names[0]} has ${generateMoneyString(haveAmt)}.\nA ${items[0]} costs ${generateMoneyString(prices[0])}.\nA ${items[1]} costs ${generateMoneyString(prices[1])}.\nA ${items[2]} costs ${generateMoneyString(prices[2])}.\nWhich of the three items can ${names[0]} afford to buy?\nShow your working and the final answer.`,
      `With ${generateMoneyString(haveAmt)}, which can you buy: ${items[0]} (${generateMoneyString(prices[0])}), ${items[1]} (${generateMoneyString(prices[1])}), or ${items[2]} (${generateMoneyString(prices[2])})?`
    );
    
    hint = `You can only afford an item if its price is less than or equal to the money you have.`;
    solutionSteps = [
      `1. Compare ${names[0]}'s money (${generateMoneyString(haveAmt)}) to the price of each item.`,
      `2. ${items[0]}: ${generateMoneyString(prices[0])} is ${prices[0] <= haveAmt ? 'affordable' : 'too expensive'}.`,
      `3. ${items[1]}: ${generateMoneyString(prices[1])} is ${prices[1] <= haveAmt ? 'affordable' : 'too expensive'}.`,
      `4. ${items[2]}: ${generateMoneyString(prices[2])} is ${prices[2] <= haveAmt ? 'affordable' : 'too expensive'}.`,
      `5. Therefore, ${names[0]} can afford the ${answer}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Can afford ${items[0]}? (Yes/No):", "expectedAnswer": "${prices[0] <= haveAmt ? 'Yes' : 'No'}" },
          { "label": "Can afford ${items[1]}? (Yes/No):", "expectedAnswer": "${prices[1] <= haveAmt ? 'Yes' : 'No'}" },
          { "label": "Can afford ${items[2]}? (Yes/No):", "expectedAnswer": "${prices[2] <= haveAmt ? 'Yes' : 'No'}" },
          { "label": "Affordable item:", "expectedAnswer": "${answer}" }
        ]
      }`;
    }
    
    if (isMCQ) {
      const options = getShuffledOptions(answer, [items[(affordableIndex + 1) % 3], items[(affordableIndex + 2) % 3]]);
      customConstraints = `1. Provide exactly these 3 options in MCQ: ${JSON.stringify(options)}`;
    }

  } else if (activeVariant === 'standard_price_difference') {
    const amt1 = Math.floor(Math.random() * 800) + 100;
    let amt2 = Math.floor(Math.random() * 800) + 100;
    while (amt1 === amt2) amt2 = Math.floor(Math.random() * 800) + 100;
    
    const difference = Math.max(amt1, amt2) - Math.min(amt1, amt2);
    answer = generateMoneyString(difference);
    
    const askExpensive = Math.random() > 0.5;
    const moreExpensiveName = amt1 > amt2 ? items[0] : items[1];
    const cheaperName = amt1 > amt2 ? items[1] : items[0];
    
    questionText = getQText(
      `A ${items[0]} costs ${generateMoneyString(amt1)} and a ${items[1]} costs ${generateMoneyString(amt2)}.\nHow much ${askExpensive ? 'more does the ' + moreExpensiveName + ' cost than the ' + cheaperName : 'less does the ' + cheaperName + ' cost than the ' + moreExpensiveName}?\nShow your working and the final answer.`,
      `A ${items[0]} costs ${generateMoneyString(amt1)}. A ${items[1]} costs ${generateMoneyString(amt2)}. What is the price difference?`
    );
    
    hint = `To find how much more or less an item costs, subtract the smaller price from the larger price.`;
    solutionSteps = [
      `1. Find the larger price: ${generateMoneyString(Math.max(amt1, amt2))}.`,
      `2. Find the smaller price: ${generateMoneyString(Math.min(amt1, amt2))}.`,
      `3. Subtract them: ${generateMoneyString(Math.max(amt1, amt2))} - ${generateMoneyString(Math.min(amt1, amt2))} = ${answer}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Working equation:", "expectedAnswer": "${generateMoneyString(Math.max(amt1, amt2))}-${generateMoneyString(Math.min(amt1, amt2))}" },
          { "label": "Difference ($):", "expectedAnswer": "${answer}" }
        ]
      }`;
    }
    
    if (isMCQ) {
      const options = getShuffledOptions(answer, [generateMoneyString(difference + 10), generateMoneyString(difference - 10), generateMoneyString(Math.abs(difference - 100))]);
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
