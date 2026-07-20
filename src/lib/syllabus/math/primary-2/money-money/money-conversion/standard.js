import {
  getRandomNames
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

export function generateStandard(activeVariant, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) {
  let questionText = '';
  let hint = '';
  let solutionSteps = [];
  let answer = '';
  let inputRequirementStr = null;
  let customConstraints = "";

  const getQText = (structureQ, shortQ) => {
    return isStructure ? structureQ : shortQ;
  };

  if (activeVariant === 'standard_worded_to_cents') {
    // Convert worded amount directly to pure cents (e.g., "three dollars and twenty cents" -> 320¢).
    const dollars = Math.floor(Math.random() * 9) + 1;
    const cents = Math.floor(Math.random() * 90) + 10;
    const wordString = moneyToWords(dollars, cents);
    answer = `${dollars * 100 + cents}¢`;
    
    questionText = getQText(
      `Convert "${wordString}" to cents.\nShow your working and the final answer.`,
      `Convert "${wordString}" to cents.`
    );
    
    hint = `First write it in numbers as dollars and cents. Then multiply the dollars by 100 and add the cents.`;
    solutionSteps = [
      `Read the words: ${wordString}.`,
      `In numbers, this is $${dollars}.${cents.toString().padStart(2, '0')}.`,
      `${dollars} dollars is ${dollars * 100} cents.`,
      `Add the remaining cents: ${dollars * 100}¢ + ${cents}¢ = ${answer}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Amount in $:", "expectedAnswer": "$${dollars}.${cents.toString().padStart(2, '0')}" },
          { "label": "Amount in cents:", "expectedAnswer": "${answer}" }
        ]
      }`;
    }
    
    if (isMCQ) {
      const wrong1 = `${dollars + cents}¢`;
      const wrong2 = `${dollars}${cents.toString().padStart(2, '0')}0¢`;
      const wrong3 = `${dollars * 10 + cents}¢`;
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `1. Provide exactly these options in MCQ: ${JSON.stringify(options)}\n2. Defect map must map ${wrong1} to "CARELESS_CALCULATION", ${wrong2} to "CONFUSED_OPERATION", and ${wrong3} to "CONCEPTUAL_ERROR".`;
    }

  } else if (activeVariant === 'standard_decimals_to_worded') {
    // Convert decimal amount to worded string (e.g., $5.40 -> "five dollars and forty cents").
    const dollars = Math.floor(Math.random() * 19) + 1; // 1 to 19
    const cents = Math.floor(Math.random() * 90) + 10;
    const decimalAmount = `$${dollars}.${cents.toString().padStart(2, '0')}`;
    answer = moneyToWords(dollars, cents).toLowerCase();
    
    questionText = getQText(
      `Write ${decimalAmount} in words.\nShow your working and the final answer.`,
      `Write ${decimalAmount} in words.`
    );
    
    hint = `Read the number before the dot as dollars, and the number after the dot as cents.`;
    solutionSteps = [
      `The amount is ${decimalAmount}.`,
      `The number before the dot is ${dollars}, so it is ${dollars} dollars.`,
      `The number after the dot is ${cents}, so it is ${cents} cents.`,
      `Together, it is written as "${answer}".`
    ];


    if (isMCQ) {
      const wrong1 = moneyToWords(cents, dollars).toLowerCase();
      const wrong2 = moneyToWords(dollars, cents * 10).toLowerCase();
      const wrong3 = moneyToWords(dollars * 10, cents).toLowerCase();
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `1. Provide exactly these options in MCQ: ${JSON.stringify(options)}\n2. Defect map must map ${wrong1} to "CARELESS_CALCULATION", ${wrong2} to "CONFUSED_OPERATION", and ${wrong3} to "CONCEPTUAL_ERROR".`;
    }

  } else if (activeVariant === 'standard_cents_to_worded') {
    // Convert pure cents to worded string (e.g., 405¢ -> "four dollars and five cents").
    const dollars = Math.floor(Math.random() * 9) + 1;
    const cents = Math.floor(Math.random() * 9) + 1; // Single digit cents to be tricky (e.g. 405)
    const totalCents = dollars * 100 + cents;
    answer = moneyToWords(dollars, cents).toLowerCase();
    
    questionText = getQText(
      `Write ${totalCents}¢ in words.\nShow your working and the final answer.`,
      `Write ${totalCents}¢ in words.`
    );
    
    hint = `Separate the hundreds to find the dollars. The rest is the cents.`;
    solutionSteps = [
      `We have ${totalCents}¢.`,
      `${totalCents}¢ is ${dollars} dollars and ${cents} cents.`,
      `Written in words, it is "${answer}".`
    ];


    if (isMCQ) {
      const wrong1 = moneyToWords(totalCents, 0).toLowerCase();
      const wrong2 = moneyToWords(dollars, cents * 10).toLowerCase(); // 4 dollars and 50 cents
      const wrong3 = moneyToWords(dollars * 10, cents).toLowerCase(); // 40 dollars and 5 cents
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `1. Provide exactly these options in MCQ: ${JSON.stringify(options)}\n2. Defect map must map ${wrong1} to "CARELESS_CALCULATION", ${wrong2} to "CONFUSED_OPERATION", and ${wrong3} to "CONCEPTUAL_ERROR".`;
    }

  } else if (activeVariant === 'standard_part_cents_part_dollars') {
    // Convert mixed numeral representation (e.g., 2 dollars and 45 cents -> $2.45).
    const dollars = Math.floor(Math.random() * 20) + 1;
    const cents = Math.floor(Math.random() * 90) + 10;
    answer = `$${dollars}.${cents.toString().padStart(2, '0')}`;
    
    questionText = getQText(
      `Convert ${dollars} dollars and ${cents} cents to numbers with the $ sign and dot.\nShow your working and the final answer.`,
      `Convert ${dollars} dollars and ${cents} cents to $ notation.`
    );
    
    hint = `Put the dollars before the dot and the cents after the dot.`;
    solutionSteps = [
      `We have ${dollars} dollars and ${cents} cents.`,
      `The dollars part goes before the dot: $${dollars}.`,
      `The cents part goes after the dot: .${cents}`,
      `Combining them, we get ${answer}.`
    ];


    
    if (isMCQ) {
      const wrong1 = `$${dollars * 10 + cents}.00`;
      const wrong2 = `$${cents}.${dollars.toString().padStart(2, '0')}`;
      const wrong3 = `$${dollars}.0${cents}`; 
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `1. Provide exactly these options in MCQ: ${JSON.stringify(options)}\n2. Defect map must map ${wrong1} to "CARELESS_CALCULATION", ${wrong2} to "CONFUSED_OPERATION", and ${wrong3} to "CONCEPTUAL_ERROR".`;
    }

  } else if (activeVariant === 'standard_convert_and_compare') {
    // Convert to dollars, then compare (e.g., Convert 250¢ to dollars. Is it greater than $2.00?).
    const baseDollars = Math.floor(Math.random() * 8) + 2; 
    const centsPart = Math.floor(Math.random() * 90) + 5; 
    const centsAmt = baseDollars * 100 + centsPart; 
    
    let targetCentsPart = Math.floor(Math.random() * 99); 
    while (targetCentsPart === centsPart) {
      targetCentsPart = Math.floor(Math.random() * 99);
    }
    
    const targetCents = baseDollars * 100 + targetCentsPart;
    const targetAmt = `$${baseDollars}.${targetCentsPart.toString().padStart(2, '0')}`;
    const decimalAmt = `$${baseDollars}.${centsPart.toString().padStart(2, '0')}`;
    
    const askGreater = Math.random() > 0.5;
    const comparisonWord = askGreater ? 'greater than' : 'smaller than';
    
    const isConditionTrue = askGreater ? (centsAmt > targetCents) : (centsAmt < targetCents);
    answer = isConditionTrue ? 'Yes' : 'No';
    const actualComparison = centsAmt > targetCents ? 'greater than' : 'smaller than';
    
    questionText = getQText(
      `Convert ${centsAmt}¢ to dollars. Is it ${comparisonWord} ${targetAmt}?\nShow your working and the final answer (Yes/No).`,
      `Convert ${centsAmt}¢ to dollars. Is it ${comparisonWord} ${targetAmt}? (Yes/No)`
    );
    
    hint = `First convert the cents into dollars and cents. Then compare the two amounts.`;
    solutionSteps = [
      `First, convert ${centsAmt}¢ to dollars.`,
      `${centsAmt}¢ = ${decimalAmt}.`,
      `Compare ${decimalAmt} and ${targetAmt}.`,
      `Since ${decimalAmt} is ${actualComparison} ${targetAmt}, the answer is ${answer}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Converted amount in $:", "expectedAnswer": "${decimalAmt}" },
          { "label": "Is it greater? (Yes/No):", "expectedAnswer": "${answer}" }
        ]
      }`;
    }
    
    if (isMCQ) {
      const options = ['Yes', 'No'];
      const wrong = answer === 'Yes' ? 'No' : 'Yes';
      customConstraints = `1. Provide exactly these options in MCQ: ${JSON.stringify(options)}\n2. Defect map must map ${wrong} to "CARELESS_CALCULATION".`;
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
