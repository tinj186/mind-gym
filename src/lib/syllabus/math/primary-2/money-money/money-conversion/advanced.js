import {
  getRandomNames,
  getRandomDivisibleObjects
} from '@/lib/utils/variable-bank';

const getShuffledOptions = (correct, distractors) => [correct, ...distractors].sort(() => 0.5 - Math.random()).slice(0, 4);

const generateMoneyString = (cents) => {
  return `$${(cents / 100).toFixed(2)}`;
};

const numberToWordsUpTo999 = (num) => {
  if (num === 0) return 'zero';
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  
  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? '-' + ones[num % 10] : '');
  
  return ones[Math.floor(num / 100)] + ' hundred' + (num % 100 !== 0 ? ' and ' + numberToWordsUpTo999(num % 100) : '');
};

const moneyToWords = (dollars, cents) => {
  let res = '';
  if (dollars > 0) {
    res += `${numberToWordsUpTo999(dollars)} dollar${dollars !== 1 ? 's' : ''}`;
  }
  if (cents > 0) {
    if (res.length > 0) res += ' and ';
    res += `${numberToWordsUpTo999(cents)} cent${cents !== 1 ? 's' : ''}`;
  }
  return res;
};

export function generateAdvanced(activeVariant, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) {
  let questionText = '';
  let hint = '';
  let solutionSteps = [];
  let answer = '';
  let inputRequirementStr = null;
  let customConstraints = "";

  const names = getRandomNames(2);
  const items = [getRandomDivisibleObjects(1), getRandomDivisibleObjects(1)];

  const getQText = (structureQ, shortQ) => {
    return isStructure ? structureQ : shortQ;
  };

  if (activeVariant === 'advanced_sum_and_convert') {
    // Add mixed units and output in decimals (e.g., $1.20 + 45¢ = $1.65).
    const dollarsPart = Math.floor(Math.random() * 9) + 1;
    const centsPart = Math.floor(Math.random() * 40) + 10;
    const centsToAdd = Math.floor(Math.random() * 40) + 10;
    
    const amt1 = `$${dollarsPart}.${centsPart}`;
    const amt2 = `${centsToAdd}¢`;
    const totalCents = dollarsPart * 100 + centsPart + centsToAdd;
    answer = `$${Math.floor(totalCents / 100)}.${(totalCents % 100).toString().padStart(2, '0')}`;
    
    questionText = getQText(
      `${names[0]} bought a ${items[0]} for ${amt1} and a ${items[1]} for ${amt2}. How much did ${names[0]} spend altogether? Give your answer in dollars and cents.\nShow your working and the final answer.`,
      `Find the sum of ${amt1} and ${amt2}. Give your answer in dollars and cents.`
    );
    
    hint = `First convert ${amt2} to dollars and cents, then add the two amounts together.`;
    solutionSteps = [
      `${names[0]} bought a ${items[0]} and a ${items[1]}.`,
      `Cost of ${items[0]} = ${amt1}.`,
      `Cost of ${items[1]} = ${amt2}.`,
      `Total cost = ${amt1} + ${amt2} = ${answer}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "${items[1]} in $:", "expectedAnswer": "$0.${centsToAdd}" },
          { "label": "Total spent ($):", "expectedAnswer": "${answer}" }
        ]
      }`;
    }
    
    if (isMCQ) {
      const wrong1 = `$${dollarsPart + centsToAdd}.${centsPart}`;
      const wrong2 = `$${dollarsPart}.${centsPart + centsToAdd + 10}`;
      const wrong3 = `$${Math.floor((dollarsPart * 100 + centsToAdd) / 100)}.${((dollarsPart * 100 + centsToAdd) % 100).toString().padStart(2, '0')}`;
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `1. Provide exactly these options in MCQ: ${JSON.stringify(options)}\n2. Defect map must map ${wrong1} to "CARELESS_CALCULATION", ${wrong2} to "SUBTRACTION_ERROR", and ${wrong3} to "ADDITION_ERROR".`;
    }

  } else if (activeVariant === 'advanced_change_conversion') {
    // Subtract mixed units to find change in decimals (e.g., You have $5.00, spend 120¢, how much left in decimals?).
    const startDollars = Math.floor(Math.random() * 5) + 3; // 3 to 7
    const startAmt = `$${startDollars}.00`;
    const spendCents = Math.floor(Math.random() * 150) + 110; // 110 to 250
    const remCents = startDollars * 100 - spendCents;
    
    const spendDollars = Math.floor(spendCents / 100);
    const spendRemCents = spendCents % 100;
    const spendDecimal = `$${spendDollars}.${spendRemCents.toString().padStart(2, '0')}`;
    
    answer = `$${Math.floor(remCents / 100)}.${(remCents % 100).toString().padStart(2, '0')}`;
    
    questionText = getQText(
      `${names[0]} has ${startAmt}. ${names[0]} spent ${spendCents}¢ on a ${items[0]}. How much money does ${names[0]} have left in dollars and cents?\nShow your working and the final answer.`,
      `${names[0]} has ${startAmt} and spends ${spendCents}¢. How much is left in dollars and cents?`
    );
    
    hint = `First convert the amount spent into dollars and cents, then subtract it from the starting amount.`;
    solutionSteps = [
      `${names[0]} started with ${startAmt}.`,
      `${names[0]} spent ${spendCents}¢. In dollars and cents, this is ${spendDecimal}.`,
      `Amount left = ${startAmt} - ${spendDecimal} = ${answer}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Amount spent in $:", "expectedAnswer": "${spendDecimal}" },
          { "label": "Amount left ($):", "expectedAnswer": "${answer}" }
        ]
      }`;
    }
    
    if (isMCQ) {
      const wrong1 = `$${startDollars - spendDollars}.${spendRemCents.toString().padStart(2, '0')}`;
      const wrong2 = `$${Math.floor((remCents + 100) / 100)}.${((remCents + 100) % 100).toString().padStart(2, '0')}`;
      const wrong3 = `$${Math.floor((startDollars * 100 - spendRemCents) / 100)}.${((startDollars * 100 - spendRemCents) % 100).toString().padStart(2, '0')}`;
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `1. Provide exactly these options in MCQ: ${JSON.stringify(options)}\n2. Defect map must map ${wrong1} to "CARELESS_CALCULATION", ${wrong2} to "CONFUSED_OPERATION", and ${wrong3} to "CONCEPTUAL_ERROR".`;
    }

  } else if (activeVariant === 'advanced_missing_cents') {
    // Find missing cents component (e.g., $3.50 = 3 dollars and __ cents).
    const dollars = Math.floor(Math.random() * 19) + 1;
    const cents = Math.floor(Math.random() * 90) + 10;
    const decimalAmt = `$${dollars}.${cents.toString().padStart(2, '0')}`;
    answer = `${cents}`;
    
    questionText = getQText(
      `Fill in the blank: ${decimalAmt} = ${dollars} dollars and ___ cents.\nShow your working and the final answer.`,
      `${decimalAmt} = ${dollars} dollars and ___ cents.`
    );
    
    hint = `Look at the number after the dot to find the number of cents.`;
    solutionSteps = [
      `The amount is ${decimalAmt}.`,
      `The number before the dot represents the dollars: ${dollars} dollars.`,
      `The number after the dot represents the cents: ${cents} cents.`,
      `The missing number is ${cents}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Number before dot (dollars):", "expectedAnswer": "${dollars}" },
          { "label": "Number after dot (cents):", "expectedAnswer": "${cents}" },
          { "label": "Missing number:", "expectedAnswer": "${answer}" }
        ]
      }`;
    }
    
    if (isMCQ) {
      const wrong1 = `${dollars}`;
      const wrong2 = `${cents * 10}`;
      const wrong3 = `${dollars * 100 + cents}`;
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `1. Provide exactly these options in MCQ: ${JSON.stringify(options)}\n2. Defect map must map ${wrong1} to "CARELESS_CALCULATION", ${wrong2} to "CONCEPTUAL_ERROR", and ${wrong3} to "CONFUSED_OPERATION".`;
    }

  } else if (activeVariant === 'advanced_convert_large_amount') {
    // Convert very large amount (e.g., 1250¢ -> $12.50). Up to $1000 limit.
    const dollars = Math.floor(Math.random() * 800) + 100; // 100 to 900 dollars
    const cents = Math.floor(Math.random() * 90) + 10;
    const totalCents = dollars * 100 + cents;
    answer = `$${dollars}.${cents.toString().padStart(2, '0')}`;
    
    questionText = getQText(
      `Convert ${totalCents}¢ to dollars and cents.\nShow your working and the final answer.`,
      `Convert ${totalCents}¢ to dollars and cents.`
    );
    
    hint = `The last two digits are the cents. The rest of the digits make up the dollars.`;
    solutionSteps = [
      `We have ${totalCents}¢.`,
      `Separate the last two digits for the cents: ${cents}¢.`,
      `The remaining digits are the dollars: ${dollars} dollars.`,
      `Combining them, we get ${answer}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Dollars part:", "expectedAnswer": "${dollars}" },
          { "label": "Cents part:", "expectedAnswer": "${cents}" },
          { "label": "Amount in $:", "expectedAnswer": "${answer}" }
        ]
      }`;
    }
    
    if (isMCQ) {
      const wrong1 = `$${Math.floor(totalCents / 10)}.${(totalCents % 10).toString().padStart(2, '0')}`;
      const wrong2 = `$${dollars + cents}.00`;
      const wrong3 = `$0.${totalCents}`;
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `1. Provide exactly these options in MCQ: ${JSON.stringify(options)}\n2. Defect map must map ${wrong1} to "CARELESS_CALCULATION", ${wrong2} to "CONCEPTUAL_ERROR", and ${wrong3} to "CONFUSED_OPERATION".`;
    }

  } else if (activeVariant === 'advanced_multi_step_conversion') {
    // Convert coin denominations to total dollars (e.g., You have 5 fifty-cent coins. How much in dollars?).
    const numCoins = Math.floor(Math.random() * 6) + 4; // 4 to 9 coins
    const coinValue = 50; // Use 50-cent coins
    const totalCents = numCoins * coinValue;
    const dollars = Math.floor(totalCents / 100);
    const remCents = totalCents % 100;
    answer = `$${dollars}.${remCents.toString().padStart(2, '0')}`;
    
    questionText = getQText(
      `${names[0]} has ${numCoins} fifty-cent coins. How much money does ${names[0]} have in dollars and cents?\nShow your working and the final answer.`,
      `${names[0]} has ${numCoins} fifty-cent coins. How much money in dollars and cents?`
    );
    
    hint = `First multiply to find the total amount in cents. Then convert the total cents into dollars and cents.`;
    solutionSteps = [
      `There are ${numCoins} coins, and each is worth 50¢.`,
      `Total cents = ${numCoins} x 50¢ = ${totalCents}¢.`,
      `Now, convert ${totalCents}¢ to dollars.`,
      `${totalCents}¢ is ${dollars} dollars and ${remCents} cents.`,
      `The total amount is ${answer}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Total in cents:", "expectedAnswer": "${totalCents}¢" },
          { "label": "Total in $:", "expectedAnswer": "${answer}" }
        ]
      }`;
    }
    
    if (isMCQ) {
      const wrong1 = `$${numCoins}.50`;
      const wrong2 = `$${totalCents}.00`;
      const wrong3 = `$${Math.floor(totalCents / 10)}.${(totalCents % 10).toString().padStart(2, '0')}`;
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `1. Provide exactly these options in MCQ: ${JSON.stringify(options)}\n2. Defect map must map ${wrong1} to "CARELESS_CALCULATION", ${wrong2} to "CONCEPTUAL_ERROR", and ${wrong3} to "CONFUSED_OPERATION".`;
    }
  }

  const formatInstructions = getFormatInstructions(isStructure ? inputRequirementStr : '', isMCQ ? 'true' : 'false');
  const aiPrompt = `
You are a Math question generator.
Generate a question exactly based on the template below. 
Do not add additional story context, do not change the numbers, just use the exact text provided.

CRITICAL INSTRUCTIONS:
- For 'questionText', use EXACTLY: """${questionText}"""
- For 'hint', use EXACTLY: """${hint}"""
- For 'solutionSteps', format it as an array of strings. You MUST use the exact escaped newline characters '\\n' to separate steps if needed. Use EXACTLY:
${JSON.stringify(solutionSteps, null, 2)}
- For 'finalAnswer', use EXACTLY: """${answer}"""
${customConstraints ? `- ${customConstraints}` : ''}
${formatInstructions}
`;

  return {
    aiPrompt,
    formatInstructions
  };
}
