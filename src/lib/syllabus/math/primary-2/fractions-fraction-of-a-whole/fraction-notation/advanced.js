import { getRandomDivisibleFoods, getRandomDivisibleObjects } from '@/lib/utils/variable-bank';

export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let questionText = "";
  let answer = "";
  let hint = "";
  let solutionSteps = [];
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let customConstraints = "";

  const fractionWords = {
    2: "half", 3: "third", 4: "quarter", 5: "fifth", 
    6: "sixth", 7: "seventh", 8: "eighth", 9: "ninth", 
    10: "tenth", 11: "eleventh", 12: "twelfth"
  };
  const numbersToWords = {
    1: "one", 2: "two", 3: "three", 4: "four", 5: "five",
    6: "six", 7: "seven", 8: "eight", 9: "nine", 10: "ten",
    11: "eleven", 12: "twelve"
  };

  const getFractionWord = (num, den, isWrongPlural = false, isWrongOrder = false) => {
    let top = numbersToWords[num];
    let bottom = fractionWords[den];
    
    if (isWrongOrder) {
      top = numbersToWords[den];
      bottom = fractionWords[num] || numbersToWords[num];
    }
    
    if (num > 1 || isWrongPlural) {
      if (den === 2) bottom = "halves";
      else bottom += "s";
    }
    
    if (isWrongPlural && num === 1) {
      // Intentionally pluralize unit fraction
      if (den === 2) bottom = "halves";
      else bottom += "s";
    }

    return `${top} ${bottom}`;
  };

  if (activeVariant === 'advanced_identify_incorrect_notation') {
    const denominator = Math.floor(Math.random() * 8) + 3; // 3 to 10
    const numerator = Math.floor(Math.random() * (denominator - 1)) + 1; // 1 to denom-1
    
    const correct1 = getFractionWord(numerator, denominator);
    const correct2 = `${numerator} out of ${denominator} equal parts`;
    const wrong = getFractionWord(numerator, denominator, false, true); // Swapped numerator and denominator words
    
    const sqText = `${context.name} wrote three different phrases to describe the fraction ${numerator}/${denominator}:\n1) ${correct1}\n2) ${correct2}\n3) ${wrong}\n\n${context.name}'s teacher said one of them is INCORRECT. Which one is it? Write the incorrect phrase.`;
    const sqTextShort = `${context.name} wrote three different phrases for ${numerator}/${denominator}: 1) ${correct1}, 2) ${correct2}, 3) ${wrong}. Which one is INCORRECT? Write the incorrect phrase.`;
    
    questionText = getQText(
      isMCQ ? `Which of the following is an INCORRECT way to write the fraction ${numerator}/${denominator}?` : sqText,
      isMCQ ? `Which of the following is an INCORRECT way to write the fraction ${numerator}/${denominator}?` : sqTextShort
    );
    answer = wrong;

    hint = `An incorrect way might swap the numerator and denominator or use the wrong words.`;
    solutionSteps = [
      `1. The fraction is ${numerator}/${denominator}.`,
      `2. The top number (numerator) is ${numerator}.`,
      `3. The bottom number (denominator) is ${denominator}.`,
      `4. It can be written correctly as '${correct1}' or '${correct2}'.`,
      `5. The incorrect notation is '${wrong}'.`
    ];

    if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Top number:", "expectedAnswer": "${numerator}" },
          { "label": "Bottom number:", "expectedAnswer": "${denominator}" },
          { "label": "Incorrect phrase:", "expectedAnswer": "${wrong}" }
        ]
      }`;
    }

    if (isMCQ) {
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${correct1}", "${correct2}", "${numerator} over ${denominator}"
        2. Set defectMap for incorrect options to "NOTATION_ERROR".
      `;
    }

  } else if (activeVariant === 'advanced_convert_wholes_to_words') {
    const denominator = Math.floor(Math.random() * 8) + 3; // 3 to 10
    const wordForm = getFractionWord(denominator, denominator);
    
    const food = getRandomDivisibleFoods(1);
    const sqText = `${context.name} has a ${food} that is cut into ${denominator} equal pieces. ${context.name} wants to eat the whole ${food}.\nWrite the fraction of the ${food} that ${context.name} eats in words.`;
    questionText = getQText(
      sqText,
      `Write the fraction equal to 1 whole that has a denominator of ${denominator} in words.`
    );
    answer = wordForm;
    hint = `A fraction is equal to 1 whole when the numerator and denominator are the same.`;
    solutionSteps = [
      `1. For a fraction to be equal to 1 whole, the numerator and denominator must be the same number.`,
      `2. '${wordForm}' means the numerator is ${denominator} and the denominator is ${denominator}.`,
      `3. ${denominator}/${denominator} is equal to 1 whole.`
    ];

    if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Numerator (in words):", "expectedAnswer": "${numbersToWords[denominator]}" },
          { "label": "Denominator (in words):", "expectedAnswer": "${denominator === 2 ? 'halves' : fractionWords[denominator] + 's'}" },
          { "label": "Fraction in words:", "expectedAnswer": "${answer}" }
        ]
      }`;
    }

    if (isMCQ) {
      const wrong1 = getFractionWord(denominator - 1, denominator);
      const wrong2 = getFractionWord(1, denominator);
      const wrong3 = getFractionWord(2, denominator);
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong1}", "${wrong2}", "${wrong3}"
        2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
      `;
    }

  } else if (activeVariant === 'advanced_word_problem_fraction_left') {
    const food = getRandomDivisibleFoods(1);
    const denominator = Math.floor(Math.random() * 6) + 5; // 5 to 10
    const numerator = Math.floor(Math.random() * (denominator - 2)) + 1; // 1 to denom-2
    const remaining = denominator - numerator;
    const wordForm = getFractionWord(remaining, denominator);

    questionText = getQText(
      `A ${food} is cut into ${denominator} equal pieces. ${context.name} eats ${numerator} pieces.\nWrite the fraction of the ${food} that is LEFT in words.`,
      `A fraction has a denominator of ${denominator}. Its numerator is ${denominator} - ${numerator}. Write this fraction in words.`
    );
    answer = wordForm;
    hint = `First, subtract to find the number of pieces left. Then write the fraction in words.`;
    solutionSteps = [
      `1. Total pieces (denominator) = ${denominator}.`,
      `2. Pieces eaten = ${numerator}.`,
      `3. Pieces left (numerator) = ${denominator} - ${numerator} = ${remaining}.`,
      `4. The fraction left is ${remaining}/${denominator}.`,
      `5. In words, this is written as '${wordForm}'.`
    ];

    if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Pieces left (Numerator):", "expectedAnswer": "${remaining}" },
          { "label": "Total pieces (Denominator):", "expectedAnswer": "${denominator}" },
          { "label": "Fraction in numbers:", "expectedAnswer": "\\\\frac{${remaining}}{${denominator}}" },
          { "label": "Fraction in words:", "expectedAnswer": "${wordForm}" }
        ]
      }`;
    }

    if (isMCQ) {
      const wrong1 = getFractionWord(numerator, denominator); // they give eaten instead of left
      const wrong2 = getFractionWord(remaining, denominator + 1);
      const wrong3 = getFractionWord(remaining - 1 > 0 ? remaining - 1 : remaining + 1, denominator);
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong1}", "${wrong2}", "${wrong3}"
        2. Set defectMap for incorrect options to "WORD_PROBLEM_ERROR".
      `;
    }

  } else if (activeVariant === 'advanced_compare_word_fractions') {
    const denominator = Math.floor(Math.random() * 7) + 4; // 4 to 10
    const num1 = Math.floor(Math.random() * (denominator - 2)) + 2; 
    let num2 = Math.floor(Math.random() * (denominator - 1)) + 1;
    if (num1 === num2) num2 = (num1 % (denominator - 1)) + 1; // ensure they are different

    const word1 = getFractionWord(num1, denominator);
    const word2 = getFractionWord(num2, denominator);
    
    const askGreater = Math.random() > 0.5;
    const greaterNum = num1 > num2 ? num1 : num2;
    const smallerNum = num1 < num2 ? num1 : num2;
    const ansNum = askGreater ? greaterNum : smallerNum;
    
    const obj = getRandomDivisibleObjects(1);
    const sqText = `${context.name} has '${word1}' of a ${obj}, and a friend has '${word2}' of a ${obj}.\nWhich fraction is ${askGreater ? 'greater' : 'smaller'}?`;
    questionText = getQText(
      sqText,
      `Compare '${word1}' and '${word2}'. Which fraction is ${askGreater ? 'greater' : 'smaller'}?`
    );
    answer = getFractionWord(ansNum, denominator);
    hint = `When the denominator is the same, compare the numerators. The larger numerator makes the greater fraction.`;
    solutionSteps = [
      `1. Write the fractions in numbers: '${word1}' is ${num1}/${denominator} and '${word2}' is ${num2}/${denominator}.`,
      `2. Since the denominators are both ${denominator}, compare the numerators: ${num1} and ${num2}.`,
      `3. ${ansNum} is ${askGreater ? 'greater' : 'smaller'}.`,
      `4. Therefore, the ${askGreater ? 'greater' : 'smaller'} fraction is ${ansNum}/${denominator}, or '${answer}'.`
    ];

    if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "First fraction in numbers:", "expectedAnswer": "\\\\frac{${num1}}{${denominator}}" },
          { "label": "Second fraction in numbers:", "expectedAnswer": "\\\\frac{${num2}}{${denominator}}" },
          { "label": "${askGreater ? 'Greater' : 'Smaller'} fraction (in words):", "expectedAnswer": "${answer}" }
        ]
      }`;
    }

    if (isMCQ) {
      const wrongAns = getFractionWord(ansNum === num1 ? num2 : num1, denominator);
      customConstraints = `
        1. Provide exactly these 2 options in MCQ: "${answer}", "${wrongAns}"
        2. Set defectMap for incorrect options to "COMPARISON_ERROR".
      `;
    }

  } else if (activeVariant === 'advanced_complex_construction') {
    const denominator = Math.floor(Math.random() * 6) + 5; // 5 to 10
    const numerator = Math.floor(Math.random() * (denominator - 2)) + 1; // 1 to denom-2
    const wordForm = getFractionWord(numerator, denominator);

    const sqText = `${context.name} is solving a puzzle about a fraction. The fraction's denominator is ${denominator}. Its numerator is ${denominator - numerator} less than its denominator.\nWhat is the fraction in words?`;
    questionText = getQText(
      sqText,
      `A fraction's denominator is ${denominator}. Its numerator is ${denominator - numerator} less than its denominator. Write the fraction in words.`
    );
    answer = wordForm;
    hint = `First, calculate the numerator. Then write the fraction in words.`;
    solutionSteps = [
      `1. The denominator is given as ${denominator}.`,
      `2. The numerator is ${denominator - numerator} less than the denominator.`,
      `3. Numerator = ${denominator} - ${denominator - numerator} = ${numerator}.`,
      `4. The fraction is ${numerator}/${denominator}.`,
      `5. In words, this is written as '${wordForm}'.`
    ];

    if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Numerator:", "expectedAnswer": "${numerator}" },
          { "label": "Denominator:", "expectedAnswer": "${denominator}" },
          { "label": "Fraction in words:", "expectedAnswer": "${wordForm}" }
        ]
      }`;
    }

    if (isMCQ) {
      const wrongNum = denominator - numerator; // they just take the difference as the answer
      const wrong1 = getFractionWord(wrongNum, denominator);
      const wrong2 = getFractionWord(numerator, denominator + 1);
      const wrong3 = getFractionWord(wrongNum + 1 > denominator ? 1 : wrongNum + 1, denominator);
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong1}", "${wrong2}", "${wrong3}"
        2. Set defectMap for incorrect options to "WORD_PROBLEM_ERROR".
      `;
    }

  } else {
    throw new Error(`Variant '${activeVariant}' not implemented in advanced.js`);
  }

  const aiPrompt = `
You are a Primary 2 Math curriculum expert. Generate a strict JSON payload for the subtopic "Fraction Notation".

CRITICAL INSTRUCTIONS:
1. "questionText" MUST exactly match: ${JSON.stringify(Array.isArray(questionText) ? questionText : [questionText])}
2. "finalAnswer" MUST exactly match: "${answer}"
3. "solutionSteps" MUST exactly match: "${solutionSteps.join('\\n')}"
4. "hint" MUST exactly match: "${hint}"

${customConstraints}

${getFormatInstructions(visualEngineStr, inputRequirementStr)}
  `.trim();

  return { aiPrompt };
}
