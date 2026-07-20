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

  const getQText = (structureQ, shortQ) => {
    return isStructure ? structureQ : shortQ;
  };

  if (activeVariant === 'standard_word_to_numeral_large') {
    const dollars = Math.floor(Math.random() * 80) + 20; // 20 to 99
    const cents = Math.floor(Math.random() * 95) + 5; // 5 to 99
    
    const totalCents = dollars * 100 + cents;
    answer = generateMoneyString(totalCents);
    const worded = `${numberToWords(dollars)} dollars and ${numberToWords(cents)} cents`;
    
    questionText = getQText(
      `${names[0]} has ${worded}.\nWrite this amount in numerals.\nShow your final answer.`,
      `Write "${worded}" in numerals.`
    );
    
    hint = `Put the dollars before the decimal point and the cents after the decimal point.`;
    solutionSteps = [
      `1. Dollars: ${dollars}`,
      `2. Cents: ${cents}`,
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
      const options = getShuffledOptions(answer, [`$${dollars + 10}.${cents}`, `$${cents}.${dollars.toString().padStart(2, '0')}`, `$${dollars}0.${cents}`]);
      customConstraints = `1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}`;
    }

  } else if (activeVariant === 'standard_numeral_to_word_large') {
    const dollars = Math.floor(Math.random() * 899) + 100; // 100 to 999
    const cents = (Math.floor(Math.random() * 9) + 1) * 10;
    
    const totalCents = dollars * 100 + cents;
    const amountStr = generateMoneyString(totalCents);
    answer = `${numberToWords(dollars)} dollars and ${numberToWords(cents)} cents`;
    
    const item = getRandomDivisibleObjects(1);
    questionText = getQText(
      `${names[0]} bought a ${item} for ${amountStr}.\nWrite this amount in words.\nShow your final answer.`,
      `Write ${amountStr} in words.`
    );
    
    hint = `Write the dollar amount in words, followed by "dollars and", then the cents amount in words, followed by "cents".`;
    solutionSteps = [
      `1. Dollars: ${dollars} is written as "${numberToWords(dollars)}".`,
      `2. Cents: ${cents} is written as "${numberToWords(cents)}".`,
      `3. Combine them: ${answer}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Amount in words:", "expectedAnswer": "${answer}" }
        ]
      }`;
    }
    
    if (isMCQ) {
      const wrong1 = `${numberToWords(cents)} dollars and ${numberToWords(dollars)} cents`;
      const wrong2 = `${numberToWords(dollars)} dollars and ${numberToWords(cents + 10)} cents`;
      const wrong3 = `${numberToWords(dollars - 100)} dollars and ${numberToWords(cents)} cents`;
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}`;
    }

  } else if (activeVariant === 'standard_correct_formatting') {
    const dollars = Math.floor(Math.random() * 90) + 10;
    const centTens = Math.floor(Math.random() * 9) + 1;
    
    const amountStr = `$${dollars}.${centTens}`;
    answer = `$${dollars}.${centTens}0`;
    
    questionText = getQText(
      `${names[0]} wrote an amount of money as ${amountStr}.\nHowever, this is formatted incorrectly.\nWhat is the correct way to write this amount in decimal notation?\nShow your final answer.`,
      `Write ${amountStr} correctly in decimal notation.`
    );
    
    hint = `Money in decimal notation must always have two digits after the decimal point to represent cents.`;
    solutionSteps = [
      `1. The amount ${amountStr} has only one digit after the decimal point.`,
      `2. It represents ${centTens}0 cents.`,
      `3. We must add a zero to the end to make it two digits: ${answer}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Correctly formatted amount ($):", "expectedAnswer": "${answer}" }
        ]
      }`;
    }
    
    if (isMCQ) {
      const wrong1 = `$${dollars}.0${centTens}`;
      const wrong2 = `$${dollars}${centTens}.00`;
      const wrong3 = `$0.${dollars}${centTens}`;
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}`;
    }

  } else if (activeVariant === 'standard_combined_extraction') {
    const dollars = Math.floor(Math.random() * 90) + 10;
    const cents = Math.floor(Math.random() * 90) + 10;
    
    const worded = `${numberToWords(dollars)} dollars and ${numberToWords(cents)} cents`;
    answer = generateMoneyString(dollars * 100 + cents);
    
    const item = getRandomDivisibleObjects(1);
    questionText = getQText(
      `A ${item} costs ${worded}.\nExtract the number of dollars and cents, then write the final amount in numerals.\nShow your working and the final answer.`,
      `Write "${worded}" in numerals.`
    );
    
    hint = `First figure out the number of dollars and cents from the words, then combine them.`;
    solutionSteps = [
      `1. "${numberToWords(dollars)} dollars" means ${dollars} dollars.`,
      `2. "${numberToWords(cents)} cents" means ${cents} cents.`,
      `3. Combined, the amount is ${answer}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Number of dollars:", "expectedAnswer": "${dollars}" },
          { "label": "Number of cents:", "expectedAnswer": "${cents}" },
          { "label": "Final amount in numerals ($):", "expectedAnswer": "${answer}" }
        ]
      }`;
    }
    
    if (isMCQ) {
      const options = getShuffledOptions(answer, [`$${dollars + 1}.${cents}`, `$${cents}.${dollars}`, `$${dollars}0.${cents}`]);
      customConstraints = `1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}`;
    }

  } else if (activeVariant === 'standard_deduce_notation_simple') {
    const tenNotes = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const tenCoins = Math.floor(Math.random() * 8) + 2; // 2 to 9
    
    const dollars = tenNotes * 10;
    const cents = tenCoins * 10;
    const totalCents = dollars * 100 + cents;
    
    answer = generateMoneyString(totalCents);
    
    questionText = getQText(
      `${names[0]} has ${tenNotes} ten-dollar notes and ${tenCoins} ten-cent coins.\nWrite the total amount they have in decimal notation.\nShow your working and the final answer.`,
      `Write the total amount of ${tenNotes} ten-dollar notes and ${tenCoins} ten-cent coins in decimal notation.`
    );
    
    hint = `Calculate the total value of the notes in dollars, and the total value of the coins in cents, then write it together.`;
    solutionSteps = [
      `1. ${tenNotes} ten-dollar notes = $${dollars}.`,
      `2. ${tenCoins} ten-cent coins = ${cents}¢.`,
      `3. Total amount is ${dollars} dollars and ${cents} cents.`,
      `4. In decimal notation: ${answer}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Value of notes ($):", "expectedAnswer": "$${dollars}.00" },
          { "label": "Value of coins (¢):", "expectedAnswer": "${cents}¢" },
          { "label": "Total amount in decimal notation ($):", "expectedAnswer": "${answer}" }
        ]
      }`;
    }
    
    if (isMCQ) {
      const wrong1 = `$${tenNotes}.${tenCoins}0`;
      const wrong2 = `$${dollars}.0${tenCoins}`;
      const wrong3 = `$${cents}.${dollars}`;
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
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
