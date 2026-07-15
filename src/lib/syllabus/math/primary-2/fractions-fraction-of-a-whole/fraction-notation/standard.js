import { getRandomDivisibleFoods } from '@/lib/utils/variable-bank';

export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) {
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

  const getFractionWord = (num, den) => {
    const top = numbersToWords[num];
    let bottom = fractionWords[den];
    if (num > 1) {
      if (den === 2) bottom = "halves";
      else bottom += "s";
    }
    return `${top} ${bottom}`;
  };

  if (activeVariant === 'standard_construct_from_desc') {
    const denominator = Math.floor(Math.random() * 10) + 3; // 3 to 12
    const numerator = Math.floor(Math.random() * (denominator - 1)) + 1; // 1 to denom-1
    const order = Math.random() > 0.5 ? 'num_first' : 'den_first';

    if (order === 'num_first') {
      const sqText = `${context.name} is thinking of a fraction. The fraction has a numerator of ${numerator} and a denominator of ${denominator}.\nWhat is the fraction?`;
      questionText = getQText(
        sqText,
        `A fraction has a numerator of ${numerator} and a denominator of ${denominator}. What is the fraction?`
      );
    } else {
      const sqText = `${context.name} is thinking of a fraction. The fraction has a denominator of ${denominator} and a numerator of ${numerator}.\nWhat is the fraction?`;
      questionText = getQText(
        sqText,
        `A fraction has a denominator of ${denominator} and a numerator of ${numerator}. What is the fraction?`
      );
    }
    
    answer = `${numerator}/${denominator}`;
    hint = `The numerator is the top number and the denominator is the bottom number.`;
    solutionSteps = [
      `1. The numerator is the top number, which is ${numerator}.`,
      `2. The denominator is the bottom number, which is ${denominator}.`,
      `3. The fraction is ${numerator}/${denominator}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Top number:", "expectedAnswer": "${numerator}" },
          { "label": "Bottom number:", "expectedAnswer": "${denominator}" },
          { "label": "Fraction:", "expectedAnswer": "\\\\frac{${numerator}}{${denominator}}" }
        ]
      }`;
    }

    if (isMCQ) {
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${denominator}/${numerator}", "${numerator + 1}/${denominator}", "${numerator}/${denominator + 1}"
        2. Set defectMap for incorrect options to "NOTATION_ERROR".
      `;
    }

  } else if (activeVariant === 'standard_identify_components') {
    const denominator = Math.floor(Math.random() * 11) + 2; // 2 to 12
    const numerator = Math.floor(Math.random() * denominator) + 1; // 1 to denom
    const wordForm = getFractionWord(numerator, denominator);
    
    const askFor = Math.random() > 0.5 ? 'numerator' : 'denominator';
    const numValue = askFor === 'numerator' ? numerator : denominator;
    
    const sqText = `${context.name} wrote the fraction '${wordForm}' on a piece of paper.\nWhat is its ${askFor}?`;
    questionText = getQText(
      sqText,
      `Look at the fraction: '${wordForm}'. What is its ${askFor}?`
    );
    answer = `${numValue}`;
    hint = askFor === 'numerator' 
      ? `The numerator is the top number, which corresponds to the first word in the fraction name.`
      : `The denominator is the bottom number, which corresponds to the second word in the fraction name.`;
      
    solutionSteps = [
      `1. The word '${wordForm}' can be written as the fraction ${numerator}/${denominator}.`,
      `2. The ${askFor} is the ${askFor === 'numerator' ? 'top' : 'bottom'} number.`,
      `3. The ${askFor} is ${numValue}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Fraction in numbers:", "expectedAnswer": "\\\\frac{${numerator}}{${denominator}}" },
          { "label": "The ${askFor} is:", "expectedAnswer": "${numValue}" }
        ]
      }`;
    }

    if (isMCQ) {
      const wrong = askFor === 'numerator' ? denominator : numerator;
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong}", "${numValue + 1}", "${Math.max(1, numValue - 1)}"
        2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
      `;
    }

  } else if (activeVariant === 'standard_match_visual_to_word') {
    const denominator = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const numerator = Math.floor(Math.random() * (denominator - 1)) + 1; // 1 to denom-1
    const wordForm = getFractionWord(numerator, denominator);
    
    const shapes = ['circle', 'rectangle', 'hexagon'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    visualEngineStr = `{
      "componentToRender": "FRACTION_DISPLAY",
      "componentData": {
        "shape": "${shape}",
        "totalParts": ${denominator},
        "shadedParts": ${numerator},
        "color": "#3b82f6"
      }
    }`;

    const sqText = `${context.name} shaded part of a shape.\nWhich word represents the shaded fraction of the shape?`;
    questionText = getQText(
      sqText,
      `Which word represents the shaded fraction of the shape?`
    );
    answer = wordForm;
    hint = `First, write the fraction in numbers by counting the shaded parts and the total parts. Then, write it in words.`;
    solutionSteps = [
      `1. Count the shaded parts: ${numerator}. This is the numerator.`,
      `2. Count the total equal parts: ${denominator}. This is the denominator.`,
      `3. The fraction is ${numerator}/${denominator}.`,
      `4. In words, this is written as '${wordForm}'.`
    ];

    if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Numerator (shaded parts):", "expectedAnswer": "${numerator}" },
          { "label": "Denominator (total equal parts):", "expectedAnswer": "${denominator}" },
          { "label": "Fraction in words:", "expectedAnswer": "${answer}" }
        ]
      }`;
    }

    if (isMCQ) {
      const wrongWord1 = getFractionWord(numerator + 1 > denominator ? 1 : numerator + 1, denominator);
      const wrongWord2 = getFractionWord(numerator, denominator + 1);
      const wrongWord3 = getFractionWord(denominator - numerator, denominator); // unshaded parts
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrongWord1}", "${wrongWord2}", "${wrongWord3}"
        2. Set defectMap for incorrect options to "NOTATION_ERROR".
      `;
    }

  } else if (activeVariant === 'standard_spelling_fractions') {
    const denominator = Math.floor(Math.random() * 11) + 2; // 2 to 12
    const numerator = Math.floor(Math.random() * denominator) + 1; // 1 to denom
    const wordForm = getFractionWord(numerator, denominator);
    
    const sqText = `${context.name} wants to spell out the fraction ${numerator}/${denominator} in words.\nHow should ${context.name} spell it?`;
    questionText = getQText(
      sqText,
      `Spell out the fraction ${numerator}/${denominator} in words.`
    );
    answer = wordForm;
    hint = `The top number is read as a normal number, and the bottom number is read as an ordinal (or half/quarter). Remember to add an 's' if the top number is more than one.`;
    solutionSteps = [
      `1. The numerator is ${numerator}, spelled as '${numbersToWords[numerator]}'.`,
      `2. The denominator is ${denominator}. Since the numerator is ${numerator === 1 ? '1' : 'more than 1'}, it is spelled as '${numerator > 1 && denominator === 2 ? 'halves' : fractionWords[denominator] + (numerator > 1 ? 's' : '')}'.`,
      `3. The fraction is spelled as '${wordForm}'.`
    ];

    if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Numerator (top word):", "expectedAnswer": "${numbersToWords[numerator]}" },
          { "label": "Denominator (bottom word):", "expectedAnswer": "${numerator > 1 && denominator === 2 ? 'halves' : fractionWords[denominator] + (numerator > 1 ? 's' : '')}" },
          { "label": "Full spelling:", "expectedAnswer": "${answer}" }
        ]
      }`;
    }

    if (isMCQ) {
      // Intentionally bad spelling/grammar options
      const wrong1 = `${numbersToWords[numerator]} ${fractionWords[denominator]}`; // missing plural
      const wrong2 = `${numbersToWords[numerator]} ${numbersToWords[denominator]}`; // cardinal number
      const wrong3 = `${numerator > 1 && denominator === 2 ? 'halves' : fractionWords[denominator] + (numerator > 1 ? 's' : '')} ${numbersToWords[numerator]}`; // flipped
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong1}", "${wrong2}", "${wrong3}"
        2. Set defectMap for incorrect options to "SPELLING_ERROR".
      `;
    }

  } else if (activeVariant === 'standard_word_problem_notation') {
    const food = getRandomDivisibleFoods(1);
    const denominator = Math.floor(Math.random() * 7) + 3; // 3 to 9
    const numerator = Math.floor(Math.random() * (denominator - 1)) + 1; // 1 to denom-1
    const wordForm = getFractionWord(numerator, denominator);

    questionText = getQText(
      `A ${food} is cut into ${denominator} equal pieces. ${context.name} eats ${numerator} pieces.\nWrite the fraction of the ${food} eaten in words.`,
      `Write the fraction ${numerator}/${denominator} in words.`
    );
    answer = wordForm;
    hint = `First, write the fraction in numbers. Then spell it out in words.`;
    solutionSteps = [
      `1. The total number of pieces is the denominator: ${denominator}.`,
      `2. The number of pieces eaten is the numerator: ${numerator}.`,
      `3. The fraction eaten is ${numerator}/${denominator}.`,
      `4. In words, this is written as '${wordForm}'.`
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
          { "label": "Fraction in numbers:", "expectedAnswer": "\\\\frac{${numerator}}{${denominator}}" },
          { "label": "Fraction in words:", "expectedAnswer": "${wordForm}" }
        ]
      }`;
    }

    if (isMCQ) {
      const wrong1 = getFractionWord(denominator - numerator, denominator); // remaining fraction
      const wrong2 = getFractionWord(numerator, denominator + 1);
      const wrong3 = getFractionWord(numerator + 1 > denominator ? 1 : numerator + 1, denominator);
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong1}", "${wrong2}", "${wrong3}"
        2. Set defectMap for incorrect options to "WORD_PROBLEM_ERROR".
      `;
    }

  } else {
    throw new Error(`Variant '${activeVariant}' not implemented in standard.js`);
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
