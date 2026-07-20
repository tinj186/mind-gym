import { getRandomNames, getRandomDivisibleFoods } from '@/lib/utils/variable-bank';

export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let questionText = "";
  let answer = "";
  let hint = "";
  let solutionSteps = [];
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let customConstraints = "";

  if (activeVariant === 'advanced_missing_numerator_add') {
    const denominator = Math.floor(Math.random() * 8) + 5; // 5 to 12
    const sumNum = Math.floor(Math.random() * (denominator - 2)) + 3; // 3 to denom
    const n1 = Math.floor(Math.random() * (sumNum - 1)) + 1; // 1 to sum-1
    const n2 = sumNum - n1;
    
    // Randomize missing position
    const isFirstMissing = Math.random() > 0.5;
    const ansNum = isFirstMissing ? n1 : n2;
    answer = isStructure ? `${ansNum}/${denominator}` : `${ansNum}`;

    const names = getRandomNames(2);
    const obj = getRandomDivisibleFoods(1);
    const useParts = Math.random() > 0.5;

    let structureText = "";
    if (useParts) {
      if (isFirstMissing) {
        structureText = `A ${obj} was cut into ${denominator} equal pieces.\n${names[0]} and ${names[1]} ate ${sumNum} pieces altogether.\n${names[1]} ate ${n2} pieces.\nWhat fraction of the ${obj} did ${names[0]} eat?\nShow your working and the final answer.`;
      } else {
        structureText = `A ${obj} was cut into ${denominator} equal pieces.\n${names[0]} and ${names[1]} ate ${sumNum} pieces altogether.\n${names[0]} ate ${n1} pieces.\nWhat fraction of the ${obj} did ${names[1]} eat?\nShow your working and the final answer.`;
      }
    } else {
      if (isFirstMissing) {
        structureText = `${names[0]} and ${names[1]} ate ${sumNum}/${denominator} of a ${obj} altogether.\n${names[1]} ate ${n2}/${denominator} of the ${obj}.\nWhat fraction of the ${obj} did ${names[0]} eat?\nShow your working and the final answer.`;
      } else {
        structureText = `${names[0]} and ${names[1]} ate ${sumNum}/${denominator} of a ${obj} altogether.\n${names[0]} ate ${n1}/${denominator} of the ${obj}.\nWhat fraction of the ${obj} did ${names[1]} eat?\nShow your working and the final answer.`;
      }
    }
    
    questionText = getQText(
      structureText,
      `Find the missing numerator:\n${isFirstMissing ? '[?]' : n1}/${denominator} + ${isFirstMissing ? n2 : '[?]'}/${denominator} = ${sumNum}/${denominator}`
    );
    
    if (isStructure) {
      hint = `Subtract the fraction ${names[isFirstMissing ? 1 : 0]} ate from the total fraction eaten.`;
      solutionSteps = [
        `1. The working equation is ${sumNum}/${denominator} - ${isFirstMissing ? n2 : n1}/${denominator}.`,
        `2. Subtract the numerators: ${sumNum} - ${isFirstMissing ? n2 : n1} = ${ansNum}`,
        `3. Keep the denominator: ${denominator}`,
        `4. Therefore, the answer is ${ansNum}/${denominator}.`
      ];
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Working equation:", "expectedAnswer": "${sumNum}/${denominator}-${isFirstMissing ? n2 : n1}/${denominator}" },
          { "label": "Subtract the numerators:", "expectedAnswer": "${sumNum} - ${isFirstMissing ? n2 : n1} = ${ansNum}" },
          { "label": "Final answer:", "expectedAnswer": "${answer}" }
        ]
      }`;
    } else {
      hint = `To find the missing numerator in an addition equation, subtract the known numerator from the total numerator.`;
      solutionSteps = [
        `1. Since the denominators are the same, we only need to look at the numerators.`,
        `2. ${isFirstMissing ? '[?] + ' + n2 : n1 + ' + [?]'} = ${sumNum}`,
        `3. Subtract the known numerator from the total: ${sumNum} - ${isFirstMissing ? n2 : n1} = ${ansNum}`,
        `4. Therefore, the missing numerator is ${ansNum}.`
      ];
      if (isShort) {
        inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
      }
    }

    if (isMCQ) {
      const wrong1 = `${sumNum + (isFirstMissing ? n2 : n1)}`; 
      const wrong2 = `${Math.abs(n2 - n1) || 1}`; 
      const wrong3 = `${parseInt(answer) + 1}`;
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong1}", "${wrong2}", "${wrong3}"
        2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
      `;
    }

  } else if (activeVariant === 'advanced_missing_numerator_sub') {
    const denominator = Math.floor(Math.random() * 8) + 5; // 5 to 12
    const n1 = Math.floor(Math.random() * (denominator - 2)) + 2; 
    const diff = Math.floor(Math.random() * (n1 - 1)) + 1;
    const n2 = n1 - diff;
    
    // Randomize missing position
    const isFirstMissing = Math.random() > 0.5;
    const ansNum = isFirstMissing ? n1 : n2;
    answer = isStructure ? `${ansNum}/${denominator}` : `${ansNum}`;
    
    const name = getRandomNames(1);
    const obj = getRandomDivisibleFoods(1);
    const useParts = Math.random() > 0.5;

    let structureText = "";
    if (useParts) {
      if (isFirstMissing) {
        structureText = `A ${obj} was cut into ${denominator} equal pieces.\n${name} had some pieces and gave away ${n2} pieces to a friend.\nThey had ${diff} pieces left.\nWhat fraction of the ${obj} did they have at first?\nShow your working and the final answer.`;
      } else {
        structureText = `A ${obj} was cut into ${denominator} equal pieces.\n${name} had ${n1} pieces and gave some away to a friend.\nThey had ${diff} pieces left.\nWhat fraction of the ${obj} did they give away?\nShow your working and the final answer.`;
      }
    } else {
      if (isFirstMissing) {
        structureText = `${name} gave away ${n2}/${denominator} of a ${obj} to a friend.\nThey had ${diff}/${denominator} of the ${obj} left.\nWhat fraction of the ${obj} did they have at first?\nShow your working and the final answer.`;
      } else {
        structureText = `${name} had ${n1}/${denominator} of a ${obj}.\nThey gave some away to a friend and had ${diff}/${denominator} left.\nWhat fraction of the ${obj} did they give away?\nShow your working and the final answer.`;
      }
    }
    
    questionText = getQText(
      structureText,
      `Find the missing numerator:\n${isFirstMissing ? '[?]' : n1}/${denominator} - ${isFirstMissing ? n2 : '[?]'}/${denominator} = ${diff}/${denominator}`
    );

    if (isStructure) {
      hint = isFirstMissing 
        ? `To find the starting fraction, add the fraction given away and the fraction left.`
        : `To find the fraction given away, subtract the fraction left from the starting fraction.`;
        
      if (isFirstMissing) {
        solutionSteps = [
          `1. The working equation is ${diff}/${denominator} + ${n2}/${denominator}.`,
          `2. Add the numerators: ${diff} + ${n2} = ${ansNum}`,
          `3. Keep the denominator: ${denominator}`,
          `4. Therefore, the answer is ${ansNum}/${denominator}.`
        ];
        inputRequirementStr = `{
          "inputType": "MULTI_STEP_INPUT",
          "steps": [
            { "label": "Working equation:", "expectedAnswer": "${diff}/${denominator}+${n2}/${denominator}" },
            { "label": "Add the numerators:", "expectedAnswer": "${diff} + ${n2} = ${ansNum}" },
            { "label": "Final answer:", "expectedAnswer": "${answer}" }
          ]
        }`;
      } else {
        solutionSteps = [
          `1. The working equation is ${n1}/${denominator} - ${diff}/${denominator}.`,
          `2. Subtract the numerators: ${n1} - ${diff} = ${ansNum}`,
          `3. Keep the denominator: ${denominator}`,
          `4. Therefore, the answer is ${ansNum}/${denominator}.`
        ];
        inputRequirementStr = `{
          "inputType": "MULTI_STEP_INPUT",
          "steps": [
            { "label": "Working equation:", "expectedAnswer": "${n1}/${denominator}-${diff}/${denominator}" },
            { "label": "Subtract the numerators:", "expectedAnswer": "${n1} - ${diff} = ${ansNum}" },
            { "label": "Final answer:", "expectedAnswer": "${answer}" }
          ]
        }`;
      }
    } else {
      hint = isFirstMissing 
        ? `To find the starting numerator, add the part subtracted and the part left over.`
        : `To find the part subtracted, subtract the part left over from the starting numerator.`;
        
      solutionSteps = [
        `1. Since the denominators are the same, we only need to look at the numerators.`,
        `2. ${isFirstMissing ? '[?] - ' + n2 : n1 + ' - [?]'} = ${diff}`,
        isFirstMissing 
          ? `3. Add the part subtracted to the part left: ${diff} + ${n2} = ${ansNum}`
          : `3. Subtract the part left from the starting numerator: ${n1} - ${diff} = ${ansNum}`,
        `4. Therefore, the missing numerator is ${ansNum}.`
      ];
      if (isShort) {
        inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
      }
    }

    if (isMCQ) {
      const wrong1 = isFirstMissing ? `${Math.abs(diff - n2)}` : `${n1 + diff}`; 
      const wrong2 = `${parseInt(answer) + 1}`; 
      const wrong3 = `${Math.max(1, parseInt(answer) - 1)}`;
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong1}", "${wrong2}", "${wrong3}"
        2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
      `;
    }

  } else if (activeVariant === 'advanced_missing_numerator_three_parts') {
    const denominator = Math.floor(Math.random() * 6) + 7; // 7 to 12
    const n1 = Math.floor(Math.random() * (denominator - 3)) + 1;
    const n2 = Math.floor(Math.random() * (denominator - n1 - 2)) + 1;
    const n3 = denominator - n1 - n2;
    
    const answerStr = `${n3}/${denominator}`;
    answer = isStructure ? answerStr : `${n3}`;

    const names = getRandomNames(3);
    const obj = getRandomDivisibleFoods(1);
    const useParts = Math.random() > 0.5;

    let structureText = "";
    if (useParts) {
      structureText = `A ${obj} was cut into ${denominator} equal pieces.\n${names[0]}, ${names[1]}, and ${names[2]} shared the whole ${obj}.\n${names[0]} ate ${n1} pieces and ${names[1]} ate ${n2} pieces.\nWhat fraction of the ${obj} did ${names[2]} eat?\nShow your working and the final answer.`;
    } else {
      structureText = `${names[0]}, ${names[1]}, and ${names[2]} shared 1 whole ${obj}.\n${names[0]} ate ${n1}/${denominator} of it and ${names[1]} ate ${n2}/${denominator} of it.\nWhat fraction of the ${obj} did ${names[2]} eat?\nShow your working and the final answer.`;
    }
    
    questionText = getQText(
      structureText,
      `Find the missing numerator:\n${n1}/${denominator} + ${n2}/${denominator} + [?]/${denominator} = 1`
    );

    if (isStructure) {
      hint = `First add the fractions that ${names[0]} and ${names[1]} ate. Then subtract from 1 whole (${denominator}/${denominator}).`;
        
      solutionSteps = [
        `1. Add the fractions eaten: ${n1}/${denominator} + ${n2}/${denominator} = ${n1 + n2}/${denominator}`,
        `2. 1 whole is equal to ${denominator}/${denominator}.`,
        `3. Subtract from 1 whole: ${denominator}/${denominator} - ${n1 + n2}/${denominator}`,
        `4. Subtract the numerators: ${denominator} - ${n1 + n2} = ${n3}`,
        `5. Therefore, the answer is ${answerStr}.`
      ];
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Fraction eaten by the first two:", "expectedAnswer": "${n1 + n2}/${denominator}" },
          { "label": "Working equation to find the rest:", "expectedAnswer": "${denominator}/${denominator}-${n1 + n2}/${denominator}" },
          { "label": "Final answer:", "expectedAnswer": "${answer}" }
        ]
      }`;
    } else {
      hint = `Remember that 1 whole is ${denominator}/${denominator}. Add the numerators you have, then find what is needed to make ${denominator}.`;
        
      solutionSteps = [
        `1. 1 whole is equal to ${denominator}/${denominator}.`,
        `2. Add the numerators you have: ${n1} + ${n2} = ${n1 + n2}`,
        `3. Subtract from the total numerator: ${denominator} - ${n1 + n2} = ${n3}`,
        `4. Therefore, the missing numerator is ${n3}.`
      ];

      if (isShort) {
        inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
      }
    }

    if (isMCQ) {
      const wrong1 = `${n1 + n2}`; 
      const wrong2 = `${Math.abs(denominator - n1)}`; 
      const wrong3 = `${parseInt(answer) + 1}`;
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong1}", "${wrong2}", "${wrong3}"
        2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
      `;
    }

  } else if (activeVariant === 'advanced_identify_incorrect_equation') {
    // Generate 2 correct equations, 1 incorrect
    const denominator = Math.floor(Math.random() * 5) + 6; // 6 to 10
    
    const eq1_n1 = 2;
    const eq1_n2 = 3;
    const eq1_sum = eq1_n1 + eq1_n2;
    const eq1Text = `${eq1_n1}/${denominator} + ${eq1_n2}/${denominator} = ${eq1_sum}/${denominator}`;
    
    const eq2_n1 = denominator - 1;
    const eq2_n2 = 1;
    const eq2_diff = eq2_n1 - eq2_n2;
    const eq2Text = `${eq2_n1}/${denominator} - ${eq2_n2}/${denominator} = ${eq2_diff}/${denominator}`;
    
    const eq3_n1 = denominator - 2;
    const eq3_n2 = 2;
    // Incorrect sum
    const eq3_wrong_sum = eq3_n1 + eq3_n2 - 1;
    const eq3Text = `${eq3_n1}/${denominator} + ${eq3_n2}/${denominator} = ${eq3_wrong_sum}/${denominator}`;
    
    const equations = [
      { text: eq1Text, isCorrect: true },
      { text: eq2Text, isCorrect: true },
      { text: eq3Text, isCorrect: false }
    ].sort(() => Math.random() - 0.5);
    
    answer = equations.find(eq => !eq.isCorrect).text;

    questionText = getQText(
      `Identify the INCORRECT equation:\n1) ${equations[0].text}\n2) ${equations[1].text}\n3) ${equations[2].text}\nWhich one is INCORRECT? Show your working and the final answer.`,
      `Identify the INCORRECT equation:\n1) ${equations[0].text}\n2) ${equations[1].text}\n3) ${equations[2].text}\nWhich one is INCORRECT?`
    );
    
    hint = `Check the addition or subtraction of the numerators for each equation.`;
      
    solutionSteps = [
      `1. Check equation 1: ${equations[0].text}. This is ${equations[0].isCorrect ? 'correct' : 'incorrect'}.`,
      `2. Check equation 2: ${equations[1].text}. This is ${equations[1].isCorrect ? 'correct' : 'incorrect'}.`,
      `3. Check equation 3: ${equations[2].text}. This is ${equations[2].isCorrect ? 'correct' : 'incorrect'}.`,
      `4. Therefore, the incorrect equation is ${answer}.`
    ];

    if (isShort || isStructure) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Is equation 1 correct? (yes/no):", "expectedAnswer": "${equations[0].isCorrect ? 'yes' : 'no'}" },
          { "label": "Is equation 2 correct? (yes/no):", "expectedAnswer": "${equations[1].isCorrect ? 'yes' : 'no'}" },
          { "label": "Is equation 3 correct? (yes/no):", "expectedAnswer": "${equations[2].isCorrect ? 'yes' : 'no'}" },
          { "label": "The incorrect equation is:", "expectedAnswer": "${answer}" }
        ]
      }`;
    }

    if (isMCQ) {
      const correct1 = equations.find(e => e.isCorrect).text;
      const correct2 = equations.find(e => e.isCorrect && e.text !== correct1).text;
      
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${correct1}", "${correct2}", "None of the above"
        2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
      `;
    }

  } else if (activeVariant === 'advanced_multi_step_word_problem') {
    const denominator = Math.floor(Math.random() * 5) + 6; // 6 to 10
    const n1 = Math.floor(Math.random() * (denominator - 4)) + 1;
    const n2 = Math.floor(Math.random() * (denominator - n1 - 2)) + 1;
    const sum = n1 + n2;
    const left = denominator - sum;
    
    answer = `${left}/${denominator}`;
    
    const names = getRandomNames(2);
    const obj = getRandomDivisibleFoods(1);

    questionText = getQText(
      `${names[0]} ate ${n1}/${denominator} of a ${obj}.\n${names[1]} ate ${n2}/${denominator} of the same ${obj}.\nWhat fraction of the ${obj} is left? Show your working and the final answer.`,
      `${names[0]} ate ${n1}/${denominator} of a ${obj}, and ${names[1]} ate ${n2}/${denominator} of the same ${obj}.\nWhat fraction of the ${obj} is left?`
    );
    
    hint = `First, find the total fraction they ate together. Then subtract that from 1 whole (${denominator}/${denominator}).`;
      
    solutionSteps = [
      `1. Find the total fraction eaten: ${n1}/${denominator} + ${n2}/${denominator} = ${sum}/${denominator}.`,
      `2. 1 whole is equal to ${denominator}/${denominator}.`,
      `3. Subtract the fraction eaten from 1 whole: ${denominator}/${denominator} - ${sum}/${denominator}.`,
      `4. ${denominator} - ${sum} = ${left}`,
      `5. Therefore, ${answer} of the ${obj} is left.`
    ];

    if (isShort || isStructure) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Total fraction eaten:", "expectedAnswer": "${sum}/${denominator}" },
          { "label": "1 whole is equal to:", "expectedAnswer": "${denominator}/${denominator}" },
          { "label": "Subtract the numerators:", "expectedAnswer": "${denominator} - ${sum} = ${left}" },
          { "label": "Final answer:", "expectedAnswer": "${answer}" }
        ]
      }`;
    }

    if (isMCQ) {
      const wrong1 = `${sum}/${denominator}`; // Fraction eaten
      const wrong2 = `${Math.abs(left - 1) || 1}/${denominator}`; 
      const wrong3 = `${left + 1}/${denominator}`;
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong1}", "${wrong2}", "${wrong3}"
        2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
      `;
    }

  } else {
    throw new Error(`Variant '${activeVariant}' not implemented in advanced.js`);
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
    metadata: { difficulty: 'advanced', logic: activeVariant }
  };
}
