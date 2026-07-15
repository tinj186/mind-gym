import { getRandomDivisibleFoods, getRandomDivisibleObjects } from '@/lib/utils/variable-bank';

export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) {
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

  if (activeVariant === 'foundation_num_to_word') {
    const denominator = Math.floor(Math.random() * 11) + 2; // 2 to 12
    const numerator = Math.floor(Math.random() * denominator) + 1; // 1 to denom
    
    const sqText = `${context.name}'s teacher wrote the fraction ${numerator}/${denominator} on the board.\nWrite this fraction in words.`;
    questionText = getQText(
      sqText,
      `Write the fraction ${numerator}/${denominator} in words.`
    );
    answer = getFractionWord(numerator, denominator);
    hint = `The top number tells you how many parts (e.g., ${numbersToWords[numerator]}), and the bottom number tells you the name of the parts (e.g., ${fractionWords[denominator]}).`;
    solutionSteps = [
      `1. The top number (numerator) is ${numerator}, which is written as '${numbersToWords[numerator]}'.`,
      `2. The bottom number (denominator) is ${denominator}, which means '${fractionWords[denominator]}'.`,
      `3. Together, ${numerator}/${denominator} is written as '${answer}'.`
    ];

    if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Numerator (in words):", "expectedAnswer": "${numbersToWords[numerator]}" },
          { "label": "Denominator (in words):", "expectedAnswer": "${numerator > 1 && denominator === 2 ? 'halves' : fractionWords[denominator] + (numerator > 1 ? 's' : '')}" },
          { "label": "Fraction in words:", "expectedAnswer": "${answer}" }
        ]
      }`;
    }

    if (isMCQ) {
      const wrongNum = Math.max(1, (numerator + 1) % denominator);
      const wrongDen = denominator === 12 ? 11 : denominator + 1;
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${getFractionWord(wrongNum === 0 ? 1 : wrongNum, denominator)}", "${getFractionWord(numerator, wrongDen)}", "${getFractionWord(wrongNum === 0 ? 1 : wrongNum, wrongDen)}"
        2. Set defectMap for incorrect options to "NOTATION_ERROR".
      `;
    }

  } else if (activeVariant === 'foundation_word_to_num') {
    const denominator = Math.floor(Math.random() * 11) + 2; // 2 to 12
    const numerator = Math.floor(Math.random() * denominator) + 1; // 1 to denom
    const wordForm = getFractionWord(numerator, denominator);
    
    const sqText = `A recipe calls for '${wordForm}' of a cup of sugar.\nWrite this fraction in numbers.`;
    questionText = getQText(
      sqText,
      `Write the fraction '${wordForm}' in numbers.`
    );
    answer = `${numerator}/${denominator}`;
    hint = `Read the words carefully. The first word tells you the top number, and the second word tells you the bottom number.`;
    solutionSteps = [
      `1. The word '${numbersToWords[numerator]}' tells us the top number (numerator) is ${numerator}.`,
      `2. The word '${numerator > 1 && denominator === 2 ? 'halves' : fractionWords[denominator] + (numerator > 1 ? 's' : '')}' tells us the bottom number (denominator) is ${denominator}.`,
      `3. So, '${wordForm}' is written as ${answer}.`
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
      const wrongNum = Math.max(1, (numerator + 1) % denominator);
      const wrongDen = denominator === 12 ? 11 : denominator + 1;
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrongNum === 0 ? 1 : wrongNum}/${denominator}", "${numerator}/${wrongDen}", "${wrongNum === 0 ? 1 : wrongNum}/${wrongDen}"
        2. Set defectMap for incorrect options to "NOTATION_ERROR".
      `;
    }

  } else if (activeVariant === 'foundation_fraction_meaning') {
    const denominator = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const numerator = Math.floor(Math.random() * (denominator - 1)) + 1;
    
    const obj = getRandomDivisibleObjects(1);
    const sqText = `${context.name} has a ${obj}. ${context.name} wants to give ${numerator}/${denominator} of it to a friend.\nWhat does the fraction ${numerator}/${denominator} mean in this story?`;
    questionText = getQText(
      sqText,
      `What does the fraction ${numerator}/${denominator} mean?`
    );
    answer = `${numerator} out of ${denominator} equal parts`;
    hint = `The bottom number shows the total equal parts, and the top number shows how many parts are selected.`;
    solutionSteps = [
      `1. The bottom number (denominator) is ${denominator}, so there are ${denominator} equal parts in total.`,
      `2. The top number (numerator) is ${numerator}, so ${numerator} parts are being considered.`,
      `3. This means ${numerator} out of ${denominator} equal parts.`
    ];

    if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Selected parts:", "expectedAnswer": "${numerator}" },
          { "label": "Total equal parts:", "expectedAnswer": "${denominator}" },
          { "label": "Meaning:", "expectedAnswer": "${answer}" }
        ]
      }`;
    }

    if (isMCQ) {
      const wrongNum = numerator + 1 >= denominator ? 1 : numerator + 1;
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrongNum} out of ${denominator} equal parts", "${denominator} out of ${numerator} equal parts", "${numerator} out of ${denominator + 1} equal parts"
        2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
      `;
    }

  } else if (activeVariant === 'foundation_parts_to_fraction') {
    const denominator = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const numerator = Math.floor(Math.random() * (denominator - 1)) + 1;
    
    const obj = getRandomDivisibleObjects(1);
    const sqText = `${context.name} cuts a ${obj} into ${denominator} equal parts. ${numerator} parts are given away.\nWhat fraction of the ${obj} is given away?`;
    questionText = getQText(
      sqText,
      `There are ${denominator} equal parts. ${numerator} parts are shaded.\nWhat fraction is shaded?`
    );
    answer = `${numerator}/${denominator}`;
    hint = `The total number of equal parts is the bottom number. The selected parts is the top number.`;
    solutionSteps = [
      `1. There are ${denominator} equal parts in total, so the bottom number (denominator) is ${denominator}.`,
      `2. There are ${numerator} parts selected, so the top number (numerator) is ${numerator}.`,
      `3. The fraction is ${numerator}/${denominator}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Numerator:", "expectedAnswer": "${numerator}" },
          { "label": "Denominator:", "expectedAnswer": "${denominator}" },
          { "label": "Fraction:", "expectedAnswer": "\\\\frac{${numerator}}{${denominator}}" }
        ]
      }`;
    }

    if (isMCQ) {
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${denominator}/${numerator}", "${numerator}/${denominator + 1}", "1/${denominator}"
        2. Set defectMap for incorrect options to "NOTATION_ERROR".
      `;
    }

  } else if (activeVariant === 'foundation_identify_unit_fraction') {
    const denominator = Math.floor(Math.random() * 8) + 3; // 3 to 10
    const nonUnitNumerator = Math.floor(Math.random() * (denominator - 2)) + 2; // 2 to denom-1
    
    const food = getRandomDivisibleFoods(1);
    const sqText = `A ${food} is cut into ${denominator} equal slices. ${context.name} wants to eat a unit fraction of it.\nWrite a unit fraction with a denominator of ${denominator}.`;
    questionText = getQText(
      isMCQ ? `Which of the following is a unit fraction?` : sqText,
      isMCQ ? `Which of the following is a unit fraction?` : `Write a unit fraction with a denominator of ${denominator}.`
    );
    answer = `1/${denominator}`;
    hint = `A unit fraction always has a numerator of 1.`;
    solutionSteps = [
      `1. A unit fraction represents exactly one part of a whole.`,
      `2. Therefore, its top number (numerator) must always be 1.`,
      `3. The fraction 1/${denominator} has a numerator of 1, so it is a unit fraction.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Numerator for a unit fraction:", "expectedAnswer": "1" },
          { "label": "Denominator:", "expectedAnswer": "${denominator}" },
          { "label": "Unit fraction:", "expectedAnswer": "\\\\frac{1}{${denominator}}" }
        ]
      }`;
    }

    if (isMCQ) {
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${nonUnitNumerator}/${denominator}", "${denominator}/1", "2/${denominator}"
        2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
      `;
    }

  } else {
    throw new Error(`Variant '${activeVariant}' not implemented in foundation.js`);
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
