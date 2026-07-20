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

export const generateAdvanced = (activeVariant, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, formatInstructions) => {
  let questionText = "";
  let answer = "";
  let hint = "";
  let solutionSteps = [];
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let customConstraints = "";

  const names = getRandomNames(2);

  const getQText = (structureQ, shortQ) => {
    return isStructure ? structureQ : shortQ;
  };

  if (activeVariant === 'advanced_deduce_notation_calculation') {
    const initialDollars = Math.floor(Math.random() * 9) + 5; // 5 to 13
    const spentCents = (Math.floor(Math.random() * 8) + 1) * 10; // 10 to 80
    
    const initialCents = initialDollars * 100;
    const remainingCents = initialCents - spentCents;
    const remDollars = Math.floor(remainingCents / 100);
    const remCents = remainingCents % 100;
    
    answer = `${numberToWords(remDollars)} dollars and ${numberToWords(remCents)} cents`;
    
    questionText = getQText(
      `${names[0]} had $${initialDollars}.00 and spent ${spentCents}¢.\nWrite their remaining amount in words.\nShow your working and the final answer.`,
      `Subtract ${spentCents}¢ from $${initialDollars}.00 and write the remaining amount in words.`
    );
    
    hint = `First, calculate the remaining amount. Then, convert the dollars and cents into words.`;
    solutionSteps = [
      `1. Initial amount = $${initialDollars}.00`,
      `2. Spent = ${spentCents}¢`,
      `3. Remaining amount = $${initialDollars}.00 - $0.${spentCents} = ${generateMoneyString(remainingCents)}.`,
      `4. In words, this is written as: ${answer}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Working equation:", "expectedAnswer": "$${initialDollars}.00-$0.${spentCents}" },
          { "label": "Remaining amount in numerals ($):", "expectedAnswer": "${generateMoneyString(remainingCents)}" },
          { "label": "Remaining amount in words:", "expectedAnswer": "${answer}" }
        ]
      }`;
    }
    
    if (isMCQ) {
      const wrong1 = `${numberToWords(remDollars + 1)} dollars and ${numberToWords(remCents)} cents`;
      const wrong2 = `${numberToWords(remDollars)} dollars and ${numberToWords(spentCents)} cents`;
      const wrong3 = `${numberToWords(initialDollars)} dollars and ${numberToWords(spentCents)} cents`;
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}`;
    }

  } else if (activeVariant === 'advanced_complex_word_to_numeral') {
    const hundreds = Math.floor(Math.random() * 8) + 1; // 1 to 8
    const tens = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const units = Math.floor(Math.random() * 9) + 1; // 1 to 9
    const cents = Math.floor(Math.random() * 9) + 1; // 1 to 9 (single digit cents for difficulty)
    
    const dollars = hundreds * 100 + tens * 10 + units;
    const totalCents = dollars * 100 + cents;
    
    const worded = `${numberToWords(dollars)} dollars and ${numberToWords(cents)} cents`;
    answer = generateMoneyString(totalCents);
    
    questionText = getQText(
      `${names[0]} read a price tag that said "${worded}".\nWrite this amount in numerals.\nShow your final answer.`,
      `Write "${worded}" in numerals.`
    );
    
    hint = `Break the words down into dollars and cents. Be careful with the single digit cents, remember to use a zero (e.g. 5 cents is .05).`;
    solutionSteps = [
      `1. Dollars: "${numberToWords(dollars)}" is ${dollars}.`,
      `2. Cents: "${numberToWords(cents)}" is ${cents}. Since it is less than 10, write it as .0${cents}.`,
      `3. Written as numerals: ${answer}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Final answer ($):", "expectedAnswer": "${answer}" }
        ]
      }`;
    }
    
    if (isMCQ) {
      const options = getShuffledOptions(answer, [`$${dollars}.${cents}0`, `$${dollars}0.0${cents}`, `$${hundreds * 100 + units}.${tens}${cents}`]);
      customConstraints = `1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}`;
    }

  } else if (activeVariant === 'advanced_sum_worded_amounts') {
    const d1 = Math.floor(Math.random() * 8) + 2;
    const c1 = Math.floor(Math.random() * 8) + 1;
    const c2 = Math.floor(Math.random() * 80) + 10;
    
    const w1 = `${numberToWords(d1)} dollars and ${numberToWords(c1)} cents`;
    const w2 = `${numberToWords(c2)} cents`;
    
    const totalCents = (d1 * 100 + c1) + c2;
    answer = generateMoneyString(totalCents);
    
    questionText = getQText(
      `Add "${w1}" to "${w2}".\nWrite the final answer in numerals.\nShow your working and the final answer.`,
      `Add "${w1}" to "${w2}" and write the answer in numerals.`
    );
    
    hint = `First write both amounts in numerals, then add them together.`;
    solutionSteps = [
      `1. "${w1}" in numerals is ${generateMoneyString(d1 * 100 + c1)}.`,
      `2. "${w2}" in numerals is ${generateMoneyString(c2)}.`,
      `3. Add them: ${generateMoneyString(d1 * 100 + c1)} + ${generateMoneyString(c2)} = ${answer}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Working equation:", "expectedAnswer": "${generateMoneyString(d1 * 100 + c1)}+${generateMoneyString(c2)}" },
          { "label": "Final answer ($):", "expectedAnswer": "${answer}" }
        ]
      }`;
    }
    
    if (isMCQ) {
      const options = getShuffledOptions(answer, [`$${d1}.${c1 + c2}0`, `$${d1 + 1}.${c1 + c2 - 100}`, `$${d1 + 10}.${c2}`]);
      customConstraints = `1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}`;
    }

  } else if (activeVariant === 'advanced_difference_worded_amounts') {
    const d1 = Math.floor(Math.random() * 10) + 10; // 10 to 19
    const c1 = Math.floor(Math.random() * 20) + 10; // 10 to 29
    
    const d2 = Math.floor(Math.random() * 5) + 2; // 2 to 6
    const c2 = Math.floor(Math.random() * 60) + 30; // 30 to 89 (requires regrouping from dollars)
    
    const w1 = `${numberToWords(d1)} dollars and ${numberToWords(c1)} cents`;
    const w2 = `${numberToWords(d2)} dollars and ${numberToWords(c2)} cents`;
    
    const totalCents1 = d1 * 100 + c1;
    const totalCents2 = d2 * 100 + c2;
    const diffCents = totalCents1 - totalCents2;
    
    answer = generateMoneyString(diffCents);
    
    questionText = getQText(
      `Subtract "${w2}" from "${w1}".\nWrite the final answer in numerals.\nShow your working and the final answer.`,
      `Subtract "${w2}" from "${w1}" and write the answer in numerals.`
    );
    
    hint = `First write both amounts in numerals, then subtract the smaller amount from the larger amount.`;
    solutionSteps = [
      `1. Larger amount: "${w1}" is ${generateMoneyString(totalCents1)}.`,
      `2. Smaller amount: "${w2}" is ${generateMoneyString(totalCents2)}.`,
      `3. Subtract them: ${generateMoneyString(totalCents1)} - ${generateMoneyString(totalCents2)} = ${answer}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Working equation:", "expectedAnswer": "${generateMoneyString(totalCents1)}-${generateMoneyString(totalCents2)}" },
          { "label": "Final answer ($):", "expectedAnswer": "${answer}" }
        ]
      }`;
    }
    
    if (isMCQ) {
      const diff1 = generateMoneyString(diffCents + 100);
      const diff2 = generateMoneyString(diffCents - 10);
      const diff3 = generateMoneyString(diffCents + 10);
      const options = getShuffledOptions(answer, [diff1, diff2, diff3]);
      customConstraints = `1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}`;
    }

  } else if (activeVariant === 'advanced_fill_in_the_blanks') {
    const dollars = Math.floor(Math.random() * 90) + 10;
    const cents = (Math.floor(Math.random() * 8) + 1) * 10;
    
    const worded = `${numberToWords(dollars)} dollars and ${numberToWords(cents)} cents`;
    const amountStr = `$___.${cents}`;
    
    answer = dollars.toString();
    
    const item = getRandomDivisibleObjects(1);
    questionText = getQText(
      `A ${item} costs ${amountStr}.\nIf the price is ${worded}, what is the missing dollar amount?\nShow your working and the final answer.`,
      `If ${amountStr} is ${worded}, what is the missing dollar amount?`
    );
    
    hint = `Read the words carefully to figure out the number of dollars before the decimal point.`;
    solutionSteps = [
      `1. The wording says "${numberToWords(dollars)} dollars".`,
      `2. "${numberToWords(dollars)}" is written as ${dollars} in numerals.`,
      `3. Therefore, the missing dollar amount is ${dollars}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Missing dollar amount:", "expectedAnswer": "${answer}" }
        ]
      }`;
    }
    
    if (isMCQ) {
      const options = getShuffledOptions(answer, [(dollars + 10).toString(), (dollars + 1).toString(), (dollars - 10).toString()]);
      customConstraints = `1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}`;
    }
  }

  const aiPrompt = `
You are a Primary 2 Math curriculum expert. Generate a strict JSON payload for the subtopic "Money Notation (Decimals)".

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
