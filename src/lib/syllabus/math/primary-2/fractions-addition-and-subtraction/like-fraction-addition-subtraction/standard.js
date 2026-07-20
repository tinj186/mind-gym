import { getRandomDivisibleFoods, getRandomDivisibleObjects, getRandomNames } from '@/lib/utils/variable-bank';

export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let questionText = "";
  let answer = "";
  let hint = "";
  let solutionSteps = [];
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let customConstraints = "";

  if (activeVariant === 'standard_add_like_numeric') {
    const denominator = Math.floor(Math.random() * 8) + 5; // 5 to 12
    const maxNum1 = denominator - 1;
    const n1 = Math.floor(Math.random() * maxNum1) + 1;
    const n2 = Math.floor(Math.random() * (denominator - n1)) + 1;
    const sum = n1 + n2;
    
    answer = `${sum}/${denominator}`;

    const name = getRandomNames(1);
    const names = getRandomNames(2);
    const obj = getRandomDivisibleFoods(1);

    const useParts = Math.random() > 0.5;
    let structureText = "";
    if (useParts) {
      structureText = `A ${obj} was cut into ${denominator} equal pieces.\n${names[0]} ate ${n1} pieces in the morning and ${names[1]} ate ${n2} pieces in the afternoon.\nWhat fraction of the ${obj} did they eat altogether?\nShow your working and the final answer.`;
    } else {
      structureText = `${name} ate ${n1}/${denominator} of a ${obj} in the morning.\nThey ate another ${n2}/${denominator} of the ${obj} in the afternoon.\nWhat fraction of the ${obj} did ${name} eat altogether?\nShow your working and the final answer.`;
    }

    questionText = getQText(
      structureText,
      `${n1}/${denominator} + ${n2}/${denominator} = [?]`
    );
    
    hint = `To add fractions with the same denominator, add the top numbers (numerators) and keep the bottom number the same.`;
    solutionSteps = [
      `1. The denominators are the same: ${denominator}.`,
      `2. Add the numerators: ${n1} + ${n2} = ${sum}`,
      `3. Keep the denominator: ${denominator}`,
      `4. Therefore, the answer is ${sum}/${denominator}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Working equation:", "expectedAnswer": "${n1}/${denominator}+${n2}/${denominator}" },
          { "label": "Add the numerators:", "expectedAnswer": "${n1} + ${n2} = ${sum}" },
          { "label": "Final answer:", "expectedAnswer": "${answer}" }
        ]
      }`;
    } else if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isMCQ) {
      const wrong1 = `${sum}/${denominator + denominator}`; // Added denominators
      const wrong2 = `${Math.abs(n1 - n2)}/${denominator}`; // Subtract instead of add
      const wrong3 = `${sum + 1}/${denominator}`;
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong1}", "${wrong2}", "${wrong3}"
        2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
      `;
    }

  } else if (activeVariant === 'standard_sub_like_numeric') {
    const denominator = Math.floor(Math.random() * 8) + 5; // 5 to 12
    const n1 = Math.floor(Math.random() * (denominator - 2)) + 2; 
    const n2 = Math.floor(Math.random() * (n1 - 1)) + 1; 
    const diff = n1 - n2;
    
    answer = `${diff}/${denominator}`;

    const name = getRandomNames(1);
    const obj = getRandomDivisibleFoods(1);

    const useParts = Math.random() > 0.5;
    let structureText = "";
    if (useParts) {
      structureText = `A ${obj} was cut into ${denominator} equal pieces.\n${name} had ${n1} pieces.\nThey gave ${n2} pieces to a friend.\nWhat fraction of the ${obj} was left?\nShow your working and the final answer.`;
    } else {
      structureText = `${name} had ${n1}/${denominator} of a ${obj}.\nThey gave ${n2}/${denominator} of the ${obj} to a friend.\nWhat fraction of the ${obj} was left?\nShow your working and the final answer.`;
    }

    questionText = getQText(
      structureText,
      `${n1}/${denominator} - ${n2}/${denominator} = [?]`
    );
    
    hint = `To subtract fractions with the same denominator, subtract the top numbers (numerators) and keep the bottom number the same.`;
    solutionSteps = [
      `1. The denominators are the same: ${denominator}.`,
      `2. Subtract the numerators: ${n1} - ${n2} = ${diff}`,
      `3. Keep the denominator: ${denominator}`,
      `4. Therefore, the answer is ${diff}/${denominator}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Working equation:", "expectedAnswer": "${n1}/${denominator}-${n2}/${denominator}" },
          { "label": "Subtract the numerators:", "expectedAnswer": "${n1} - ${n2} = ${diff}" },
          { "label": "Final answer:", "expectedAnswer": "${answer}" }
        ]
      }`;
    } else if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isMCQ) {
      const wrong1 = `${n1 + n2}/${denominator}`; // Add instead of subtract
      const wrong2 = `${diff}/${denominator - n2 === 0 ? denominator : denominator - n2}`; // Messed with denominator
      const wrong3 = `${diff - 1}/${denominator}`;
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong1}", "${wrong2}", "${wrong3}"
        2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
      `;
    }

  } else if (activeVariant === 'standard_sub_from_whole') {
    const denominator = Math.floor(Math.random() * 8) + 5; // 5 to 12
    const n2 = Math.floor(Math.random() * (denominator - 1)) + 1; 
    const diff = denominator - n2;
    
    answer = `${diff}/${denominator}`;

    const name = getRandomNames(1);
    const obj = getRandomDivisibleFoods(1);

    const useParts = Math.random() > 0.5;
    let structureText = "";
    if (useParts) {
      structureText = `A ${obj} was cut into ${denominator} equal pieces.\n${name} had the whole ${obj}.\nThey gave ${n2} pieces to a friend.\nWhat fraction of the ${obj} was left?\nShow your working and the final answer.`;
    } else {
      structureText = `${name} had 1 whole ${obj}.\nThey gave ${n2}/${denominator} of the ${obj} to a friend.\nWhat fraction of the ${obj} was left?\nShow your working and the final answer.`;
    }

    questionText = getQText(
      structureText,
      `1 - ${n2}/${denominator} = [?]`
    );
    
    hint = `Change 1 whole into a fraction with the same denominator (${denominator}/${denominator}), then subtract.`;
    solutionSteps = [
      `1. Change 1 whole to a fraction with a denominator of ${denominator}.`,
      `2. 1 whole = ${denominator}/${denominator}`,
      `3. Subtract the numerators: ${denominator} - ${n2} = ${diff}`,
      `4. Therefore, the answer is ${diff}/${denominator}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "1 whole is equal to:", "expectedAnswer": "${denominator}/${denominator}" },
          { "label": "Subtract the numerators:", "expectedAnswer": "${denominator} - ${n2} = ${diff}" },
          { "label": "Final answer:", "expectedAnswer": "${answer}" }
        ]
      }`;
    } else if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isMCQ) {
      const wrong1 = `${n2}/${denominator}`; // Put the subtracted amount
      const wrong2 = `1/${denominator}`; 
      const wrong3 = `${diff - 1}/${denominator}`;
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong1}", "${wrong2}", "${wrong3}"
        2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
      `;
    }

  } else if (activeVariant === 'standard_add_three_fractions') {
    const denominator = Math.floor(Math.random() * 8) + 5; // 5 to 12
    let n1, n2, n3, sum;
    do {
      n1 = Math.floor(Math.random() * (denominator - 2)) + 1;
      n2 = Math.floor(Math.random() * (denominator - n1 - 1)) + 1;
      n3 = Math.floor(Math.random() * (denominator - n1 - n2)) + 1;
      sum = n1 + n2 + n3;
    } while (sum >= denominator || n1 === 0 || n2 === 0 || n3 === 0);

    answer = `${sum}/${denominator}`;
    
    const name = getRandomNames(1);
    const obj = getRandomDivisibleFoods(1);

    const useParts = Math.random() > 0.5;
    let structureText = "";
    if (useParts) {
      structureText = `A ${obj} was cut into ${denominator} equal pieces.\n${name} ate ${n1} pieces on Monday, ${n2} pieces on Tuesday, and ${n3} pieces on Wednesday.\nWhat fraction of the ${obj} did ${name} eat altogether?\nShow your working and the final answer.`;
    } else {
      structureText = `${name} ate ${n1}/${denominator} of a ${obj} on Monday, ${n2}/${denominator} on Tuesday, and ${n3}/${denominator} on Wednesday.\nWhat fraction of the ${obj} did ${name} eat altogether?\nShow your working and the final answer.`;
    }

    questionText = getQText(
      structureText,
      `Solve: ${n1}/${denominator} + ${n2}/${denominator} + ${n3}/${denominator} = ?`
    );
    
    hint = `Add the numerators together: ${n1} + ${n2} + ${n3}. Keep the denominator as ${denominator}.`;
    solutionSteps = [
      `1. The denominators are all the same.`,
      `2. Add the numerators: ${n1} + ${n2} + ${n3} = ${sum}`,
      `3. Keep the denominator the same: ${denominator}`,
      `4. Therefore, the answer is ${sum}/${denominator}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Working equation:", "expectedAnswer": "${n1}/${denominator}+${n2}/${denominator}+${n3}/${denominator}" },
          { "label": "Add the numerators:", "expectedAnswer": "${n1} + ${n2} + ${n3} = ${sum}" },
          { "label": "Final answer:", "expectedAnswer": "${answer}" }
        ]
      }`;
    } else if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isMCQ) {
      const wrong1 = `${sum}/${denominator * 3}`; // Added denominators
      const wrong2 = `${sum + 1}/${denominator}`;
      const wrong3 = `${sum - 1}/${denominator}`;
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong1}", "${wrong2}", "${wrong3}"
        2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
      `;
    }

  } else if (activeVariant === 'standard_add_to_make_whole') {
    const denominator = Math.floor(Math.random() * 8) + 5; // 5 to 12
    const n1 = Math.floor(Math.random() * (denominator - 1)) + 1; 
    const n2 = denominator - n1; 
    const sum = n1 + n2; 
    
    const missingPart = Math.floor(Math.random() * 3);
    
    const name = getRandomNames(1);
    const obj = getRandomDivisibleFoods(1);
    
    const useParts = Math.random() > 0.5;
    let structureText = "";

    if (missingPart === 0) {
      answer = `${n1}/${denominator}`;
      if (useParts) {
        structureText = `A ${obj} was cut into ${denominator} equal pieces.\n${name} needs 1 whole ${obj}.\nThey already have ${n2} pieces of it.\nWhat fraction of the ${obj} do they still need?\nShow your working and the final answer.`;
      } else {
        structureText = `${name} needs 1 whole ${obj}.\nThey already have ${n2}/${denominator} of it.\nWhat fraction of the ${obj} do they still need?\nShow your working and the final answer.`;
      }
      questionText = getQText(
        structureText,
        `Solve: ? + ${n2}/${denominator} = 1 (Find the missing fraction)`
      );
      hint = `1 whole is equal to ${denominator}/${denominator}. Subtract ${n2}/${denominator} from ${denominator}/${denominator} to find the missing fraction.`;
      solutionSteps = [
        `1. 1 whole is equal to ${denominator}/${denominator}.`,
        `2. Subtract to find the missing part: ${denominator}/${denominator} - ${n2}/${denominator}.`,
        `3. Subtract the numerators: ${denominator} - ${n2} = ${n1}.`,
        `4. Therefore, the missing fraction is ${n1}/${denominator}.`
      ];

      if (isStructure) {
        inputRequirementStr = `{
          "inputType": "MULTI_STEP_INPUT",
          "steps": [
            { "label": "1 whole is equal to:", "expectedAnswer": "${denominator}/${denominator}" },
            { "label": "Subtract the numerators:", "expectedAnswer": "${denominator} - ${n2} = ${n1}" },
            { "label": "Final answer:", "expectedAnswer": "${answer}" }
          ]
        }`;
      } else if (isShort) {
        inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
      }

      if (isMCQ) {
        let w1 = n1 + 1; if (w1 >= denominator) w1 = 1;
        let w2 = n1 + 2; if (w2 >= denominator) w2 = 2;
        const wrong1 = `${w1}/${denominator}`;
        const wrong2 = `${w2}/${denominator}`;
        const wrong3 = `1`; 
        customConstraints = `
          1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong1}", "${wrong2}", "${wrong3}"
          2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
        `;
      }
    } else if (missingPart === 1) {
      answer = `${n2}/${denominator}`;
      if (useParts) {
        structureText = `A ${obj} was cut into ${denominator} equal pieces.\n${name} needs 1 whole ${obj}.\nThey already have ${n1} pieces of it.\nWhat fraction of the ${obj} do they still need?\nShow your working and the final answer.`;
      } else {
        structureText = `${name} needs 1 whole ${obj}.\nThey already have ${n1}/${denominator} of it.\nWhat fraction of the ${obj} do they still need?\nShow your working and the final answer.`;
      }
      questionText = getQText(
        structureText,
        `Solve: ${n1}/${denominator} + ? = 1 (Find the missing fraction)`
      );
      hint = `1 whole is equal to ${denominator}/${denominator}. Subtract ${n1}/${denominator} from ${denominator}/${denominator} to find the missing fraction.`;
      solutionSteps = [
        `1. 1 whole is equal to ${denominator}/${denominator}.`,
        `2. Subtract to find the missing part: ${denominator}/${denominator} - ${n1}/${denominator}.`,
        `3. Subtract the numerators: ${denominator} - ${n1} = ${n2}.`,
        `4. Therefore, the missing fraction is ${n2}/${denominator}.`
      ];

      if (isStructure) {
        inputRequirementStr = `{
          "inputType": "MULTI_STEP_INPUT",
          "steps": [
            { "label": "1 whole is equal to:", "expectedAnswer": "${denominator}/${denominator}" },
            { "label": "Subtract the numerators:", "expectedAnswer": "${denominator} - ${n1} = ${n2}" },
            { "label": "Final answer:", "expectedAnswer": "${answer}" }
          ]
        }`;
      } else if (isShort) {
        inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
      }

      if (isMCQ) {
        let w1 = n2 + 1; if (w1 >= denominator) w1 = 1;
        let w2 = n2 + 2; if (w2 >= denominator) w2 = 2;
        const wrong1 = `${w1}/${denominator}`;
        const wrong2 = `${w2}/${denominator}`;
        const wrong3 = `1`; 
        customConstraints = `
          1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong1}", "${wrong2}", "${wrong3}"
          2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
        `;
      }
    } else {
      answer = `1`; 
      const names = getRandomNames(2);
      if (useParts) {
        structureText = `A ${obj} was cut into ${denominator} equal pieces.\n${names[0]} ate ${n1} pieces in the morning and ${names[1]} ate ${n2} pieces in the afternoon.\nWhat fraction of the ${obj} did they eat altogether?\nGive your final answer as a whole number if possible.\nShow your working.`;
      } else {
        structureText = `${names[0]} ate ${n1}/${denominator} of a ${obj} in the morning and ${names[1]} ate ${n2}/${denominator} of the ${obj} in the afternoon.\nWhat fraction of the ${obj} did they eat altogether?\nGive your final answer as a whole number if possible.\nShow your working.`;
      }
      questionText = getQText(
        structureText,
        `Solve: ${n1}/${denominator} + ${n2}/${denominator} = ? (Give your answer as a whole number if possible)`
      );
      hint = `Add the numerators together. When the numerator is the same as the denominator, the fraction is equal to 1 whole.`;
      solutionSteps = [
        `1. The denominators are the same.`,
        `2. Add the numerators: ${n1} + ${n2} = ${sum}`,
        `3. Keep the denominator the same: ${denominator}`,
        `4. ${sum}/${denominator} is equal to 1 whole.`,
        `5. Therefore, the answer is 1.`
      ];

      if (isStructure) {
        inputRequirementStr = `{
          "inputType": "MULTI_STEP_INPUT",
          "steps": [
            { "label": "Working equation:", "expectedAnswer": "${n1}/${denominator}+${n2}/${denominator}" },
            { "label": "Add the numerators:", "expectedAnswer": "${n1} + ${n2} = ${sum}" },
            { "label": "Final answer (as a whole number):", "expectedAnswer": "${answer}" }
          ]
        }`;
      } else if (isShort) {
        inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
      }

      if (isMCQ) {
        const wrong1 = `${sum}/${denominator + denominator}`; 
        const wrong2 = `${sum}/${denominator}`; 
        const wrong3 = `${sum - 1}/${denominator}`;
        customConstraints = `
          1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong1}", "${wrong2}", "${wrong3}"
          2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
        `;
      }
    }

  } else {
    throw new Error(`Variant '${activeVariant}' not implemented in standard.js`);
  }

  const aiPrompt = `
You are a Primary 2 Math curriculum expert. Generate a strict JSON payload for the subtopic "Like Fraction Addition/Subtraction".

CRITICAL INSTRUCTIONS:
1. "questionText" MUST exactly match: ${JSON.stringify(Array.isArray(questionText) ? questionText : [questionText])}
2. "finalAnswer" MUST exactly match: "${answer}"
3. "solutionSteps" MUST exactly match: "${solutionSteps.join('\\n')}"
4. "hint" MUST exactly match: "${hint}"

${customConstraints}

${getFormatInstructions(visualEngineStr, inputRequirementStr)}
  `.trim();

  return {
    aiPrompt,
    metadata: { difficulty: 'standard', logic: activeVariant }
  };
}
