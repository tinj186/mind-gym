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

export function generateFoundation(activeVariant, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) {
  let questionText = '';
  let hint = '';
  let solutionSteps = [];
  let answer = '';
  let inputRequirementStr = null;
  let customConstraints = "";

  const getQText = (structureQ, shortQ) => {
    return isStructure ? structureQ : shortQ;
  };

  if (activeVariant === 'foundation_cents_to_decimals') {
    // Convert simple cents amount (< 100¢) to decimals (e.g., 65¢ -> $0.65).
    const cents = Math.floor(Math.random() * 90) + 10; // 10 to 99 cents
    answer = `$0.${cents}`;
    
    questionText = getQText(
      `Convert ${cents}¢ to dollars and cents.\nShow your working and the final answer.`,
      `Convert ${cents}¢ to dollars and cents.`
    );
    
    hint = `Remember that 100¢ = $1.00. For amounts less than 100¢, write $0 in front and put the cents after the dot.`;
    solutionSteps = [
      `There are ${cents} cents.`,
      `Since it is less than 100¢, the dollar amount is 0.`,
      `So, ${cents}¢ is ${answer}.`
    ];


    if (isMCQ) {
      const wrong1 = `$${cents}.00`;
      const wrong2 = `$${(cents/10).toFixed(2)}`;
      const wrong3 = `$0.0${Math.floor(cents/10)}`;
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `1. Provide exactly these options in MCQ: ${JSON.stringify(options)}\n2. Defect map must map ${wrong1} to "CARELESS_CALCULATION", ${wrong2} to "CONFUSED_OPERATION", and ${wrong3} to "CONCEPTUAL_ERROR".`;
    }

  } else if (activeVariant === 'foundation_decimals_to_cents') {
    // Convert simple decimal amount (< $1.00) to cents (e.g., $0.54 -> 54¢).
    const cents = Math.floor(Math.random() * 90) + 10;
    const decimalAmount = `$0.${cents}`;
    answer = `${cents}¢`;
    
    questionText = getQText(
      `Convert ${decimalAmount} to cents.\nShow your working and the final answer.`,
      `Convert ${decimalAmount} to cents.`
    );
    
    hint = `Look at the numbers after the dot. That is the number of cents.`;
    solutionSteps = [
      `The amount is ${decimalAmount}.`,
      `The numbers after the dot show the cents.`,
      `So, ${decimalAmount} is ${answer}.`
    ];


    if (isMCQ) {
      const wrong1 = `${cents}0¢`;
      const wrong2 = `${Math.floor(cents/10)}¢`;
      const wrong3 = `0.${cents}¢`;
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `1. Provide exactly these options in MCQ: ${JSON.stringify(options)}\n2. Defect map must map ${wrong1} to "CARELESS_CALCULATION", ${wrong2} to "CONFUSED_OPERATION", and ${wrong3} to "CONCEPTUAL_ERROR".`;
    }

  } else if (activeVariant === 'foundation_cents_to_decimals_large') {
    // Convert large cents amount (> 100¢) to decimals (e.g., 150¢ -> $1.50).
    // Limit to under $10 for foundation
    const cents = Math.floor(Math.random() * 890) + 110; 
    const dollars = Math.floor(cents / 100);
    const remCents = cents % 100;
    answer = `$${dollars}.${remCents.toString().padStart(2, '0')}`;
    
    questionText = getQText(
      `Convert ${cents}¢ to dollars and cents.\nShow your working and the final answer.`,
      `Convert ${cents}¢ to dollars and cents.`
    );
    
    hint = `Every 100¢ is $1.00. Separate the hundreds from the rest to find the dollars and cents.`;
    solutionSteps = [
      `We have ${cents}¢.`,
      `${cents}¢ = ${dollars * 100}¢ + ${remCents}¢.`,
      `${dollars * 100}¢ is ${dollars} dollars, and we have ${remCents} cents.`,
      `So, ${cents}¢ = ${answer}.`
    ];


    if (isMCQ) {
      const wrong1 = `$${cents}.00`;
      const wrong2 = `$${dollars * 10 + remCents}.00`;
      const wrong3 = `$0.${cents}`;
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `1. Provide exactly these options in MCQ: ${JSON.stringify(options)}\n2. Defect map must map ${wrong1} to "CARELESS_CALCULATION", ${wrong2} to "CONFUSED_OPERATION", and ${wrong3} to "CONCEPTUAL_ERROR".`;
    }

  } else if (activeVariant === 'foundation_decimals_to_cents_large') {
    // Convert large decimal amount (> $1.00) to cents (e.g., $2.05 -> 205¢).
    const dollars = Math.floor(Math.random() * 9) + 1; // 1 to 9
    const cents = Math.floor(Math.random() * 99) + 1; // 1 to 99
    const decimalAmount = `$${dollars}.${cents.toString().padStart(2, '0')}`;
    answer = `${dollars * 100 + cents}¢`;
    
    questionText = getQText(
      `Convert ${decimalAmount} to cents.\nShow your working and the final answer.`,
      `Convert ${decimalAmount} to cents.`
    );
    
    hint = `$1.00 is 100¢. Multiply the dollar amount by 100 and add the cents.`;
    solutionSteps = [
      `We have ${dollars} dollars and ${cents} cents.`,
      `${dollars} dollars = ${dollars * 100}¢.`,
      `${dollars * 100}¢ + ${cents}¢ = ${answer}.`
    ];


    if (isMCQ) {
      const wrong1 = `${dollars + cents}¢`;
      const wrong2 = `${dollars}${cents.toString().padStart(2, '0')}0¢`;
      const wrong3 = `${dollars * 10 + cents}¢`;
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `1. Provide exactly these options in MCQ: ${JSON.stringify(options)}\n2. Defect map must map ${wrong1} to "CARELESS_CALCULATION", ${wrong2} to "CONFUSED_OPERATION", and ${wrong3} to "CONCEPTUAL_ERROR".`;
    }

  } else if (activeVariant === 'foundation_worded_to_decimals') {
    // Convert word string to decimals (e.g., "four dollars and fifty cents" -> $4.50).
    // Using simple numbers under 10
    const dollars = Math.floor(Math.random() * 9) + 1;
    const cents = Math.floor(Math.random() * 90) + 10;
    const wordString = moneyToWords(dollars, cents);
    answer = `$${dollars}.${cents.toString().padStart(2, '0')}`;
    
    questionText = getQText(
      `Write "${wordString}" in numbers with the $ sign and dot.\nShow your working and the final answer.`,
      `Write "${wordString}" in numbers.`
    );
    
    hint = `Put the dollars before the dot and the cents after the dot.`;
    solutionSteps = [
      `Read the words: ${wordString}.`,
      `The dollars part is ${dollars}.`,
      `The cents part is ${cents}.`,
      `Combining them with a dot, we get ${answer}.`
    ];


    if (isMCQ) {
      const wrong1 = `$${dollars * 10 + cents}.00`;
      const wrong2 = `$${cents}.${dollars.toString().padStart(2, '0')}`;
      const wrong3 = `$${dollars}.0${cents}`; // Incorrect if cents > 10, but good distractor
      const options = getShuffledOptions(answer, [wrong1, wrong2, wrong3]);
      customConstraints = `1. Provide exactly these options in MCQ: ${JSON.stringify(options)}`;
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
