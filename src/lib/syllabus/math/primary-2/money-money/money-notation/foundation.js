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
  return num.toString();
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

  const getQText = (structureQ, shortQ) => {
    return isStructure ? structureQ : shortQ;
  };

  if (activeVariant === 'foundation_cents_to_decimal') {
    const cents = Math.floor(Math.random() * 95) + 5; 
    
    answer = generateMoneyString(cents);
    
    questionText = getQText(
      `${names[0]} found ${cents}¢ on the floor.\nWrite the amount in dollars and cents using the $ sign.\nShow your final answer.`,
      `Write ${cents}¢ in decimal notation using the $ sign.`
    );
    
    hint = `Remember that 100¢ = $1.00. For amounts less than 100¢, write $0 followed by the decimal point and the cents.`;
    solutionSteps = [
      `1. The amount is ${cents} cents.`,
      `2. To write it in dollars and cents, it is $0.${cents.toString().padStart(2, '0')}.`
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
      const options = getShuffledOptions(answer, [`$${cents}.00`, `$0.0${cents}`, `$0.${cents + 10}`]);
      customConstraints = `1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}`;
    }

  } else if (activeVariant === 'foundation_dollars_cents_to_decimal') {
    const dollars = Math.floor(Math.random() * 9) + 1;
    const cents = Math.floor(Math.random() * 95) + 5;
    
    const totalCents = dollars * 100 + cents;
    answer = generateMoneyString(totalCents);
    
    questionText = getQText(
      `${names[0]} saved ${dollars} dollars and ${cents} cents in their piggy bank.\nWrite this amount in numerals.\nShow your final answer.`,
      `Write ${dollars} dollars and ${cents} cents in numerals.`
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
      const options = getShuffledOptions(answer, [`$${dollars + 1}.${cents}`, `$${cents}.${dollars.toString().padStart(2, '0')}`, `$${dollars}0.${cents}`]);
      customConstraints = `1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}`;
    }

  } else if (activeVariant === 'foundation_numeral_to_word_simple') {
    const dollars = Math.floor(Math.random() * 9) + 1;
    const cents = (Math.floor(Math.random() * 9) + 1) * 10;
    
    const totalCents = dollars * 100 + cents;
    const amountStr = generateMoneyString(totalCents);
    answer = `${numberToWords(dollars)} dollar${dollars > 1 ? 's' : ''} and ${numberToWords(cents)} cents`;
    
    questionText = getQText(
      `${names[0]} wants to write ${amountStr} in words on a form.\nHow should it be written?\nShow your final answer.`,
      `Write ${amountStr} in words.`
    );
    
    hint = `Write the dollar amount in words, followed by "dollars and", then the cents amount in words, followed by "cents".`;
    solutionSteps = [
      `1. Look at the dollars: $${dollars} is written as "${numberToWords(dollars)} dollar${dollars > 1 ? 's' : ''}".`,
      `2. Look at the cents: ${cents}¢ is written as "${numberToWords(cents)} cents".`,
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
      const wrong3 = `${numberToWords(dollars + 1)} dollars and ${numberToWords(cents)} cents`;
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}`;
    }

  } else if (activeVariant === 'foundation_word_to_numeral_simple') {
    const dollars = Math.floor(Math.random() * 9) + 1;
    const cents = Math.floor(Math.random() * 8) + 1;
    
    const totalCents = dollars * 100 + cents;
    answer = generateMoneyString(totalCents);
    const worded = `${numberToWords(dollars)} dollar${dollars > 1 ? 's' : ''} and ${numberToWords(cents)} cent${cents > 1 ? 's' : ''}`;
    
    const item = getRandomDivisibleObjects(1);
    questionText = getQText(
      `A ${item} costs ${worded}.\nWrite the price of the ${item} in numerals.\nShow your final answer.`,
      `Write "${worded}" in numerals.`
    );
    
    hint = `Be careful with single digit cents! ${cents} cents is written as .0${cents}, not .${cents}0.`;
    solutionSteps = [
      `1. Dollars: ${dollars}`,
      `2. Cents: ${cents} cents must be written with a zero in front: .0${cents}.`,
      `3. Combine them: ${answer}.`
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
      const options = getShuffledOptions(answer, [`$${dollars}.${cents}0`, `$${cents}.0${dollars}`, `$${dollars}0.0${cents}`]);
      customConstraints = `1. Provide exactly these 4 options in MCQ: ${JSON.stringify(options)}`;
    }

  } else if (activeVariant === 'foundation_extract_dollars_cents') {
    const dollars = Math.floor(Math.random() * 20) + 5;
    const cents = Math.floor(Math.random() * 90) + 10;
    
    const amountStr = generateMoneyString(dollars * 100 + cents);
    
    answer = `${dollars} dollars and ${cents} cents`;
    
    questionText = getQText(
      `${names[0]} is looking at a price tag that says ${amountStr}.\nHow many dollars and how many cents are there in ${amountStr}?\nShow your working and the final answer.`,
      `Extract the dollars and cents from ${amountStr}.`
    );
    
    hint = `The number before the dot is the dollars. The number after the dot is the cents.`;
    solutionSteps = [
      `1. Look at the number before the dot: ${dollars}. These are the dollars.`,
      `2. Look at the number after the dot: ${cents}. These are the cents.`,
      `3. Answer: ${dollars} dollars and ${cents} cents.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Number of dollars:", "expectedAnswer": "${dollars}" },
          { "label": "Number of cents:", "expectedAnswer": "${cents}" }
        ]
      }`;
    }
    
    if (isMCQ) {
      const wrong1 = `${cents} dollars and ${dollars} cents`;
      const wrong2 = `${dollars} dollars and ${cents + 10} cents`;
      const wrong3 = `${dollars + 10} dollars and ${cents} cents`;
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
