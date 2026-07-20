import { getRandomDivisibleFoods, getRandomDivisibleObjects, getRandomNames } from '@/lib/utils/variable-bank';

export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let questionText = "";
  let answer = "";
  let hint = "";
  let solutionSteps = [];
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let customConstraints = "";

  if (activeVariant === 'standard_compare_like_fractions') {
    const denominator = Math.floor(Math.random() * 9) + 4; // 4 to 12
    let n1 = Math.floor(Math.random() * (denominator - 1)) + 1;
    let n2 = Math.floor(Math.random() * (denominator - 1)) + 1;
    while (n1 === n2) {
      n2 = Math.floor(Math.random() * (denominator - 1)) + 1;
    }
    const askGreater = Math.random() > 0.5;
    const greaterNum = n1 > n2 ? n1 : n2;
    const smallerNum = n1 < n2 ? n1 : n2;
    const ansNumerator = askGreater ? greaterNum : smallerNum;
    answer = `${ansNumerator}/${denominator}`;

    questionText = getQText(
      `Compare ${n1}/${denominator} and ${n2}/${denominator}. Which fraction is ${askGreater ? 'greater' : 'smaller'}?`,
      `Which fraction is ${askGreater ? 'greater' : 'smaller'}: ${n1}/${denominator} or ${n2}/${denominator}?`
    );

    hint = `When the denominators are the same, compare the numerators. The fraction with the ${askGreater ? 'larger' : 'smaller'} numerator is ${askGreater ? 'greater' : 'smaller'}.`;
    solutionSteps = [
      `1. Both fractions have the same denominator (${denominator}).`,
      `2. Compare their numerators: ${n1} and ${n2}.`,
      `3. ${ansNumerator} is ${askGreater ? 'greater' : 'smaller'} than the other numerator.`,
      `4. Therefore, ${answer} is the ${askGreater ? 'greater' : 'smaller'} fraction.`
    ];

    if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isStructure) {
      const names = getRandomNames(2);
      const obj = getRandomDivisibleObjects(1);
      
      questionText = `${names[0]} has ${n1}/${denominator} of a ${obj}.\\n${names[1]} has ${n2}/${denominator} of a similar ${obj}.\\nWho has ${askGreater ? 'more' : 'less'}?`;
      const ansName = (ansNumerator === n1) ? names[0] : names[1];
      answer = ansName;
      
      solutionSteps = [
        `1. ${names[0]} has ${n1}/${denominator} and ${names[1]} has ${n2}/${denominator}.`,
        `2. Both fractions have the same denominator (${denominator}).`,
        `3. Compare their numerators: ${n1} and ${n2}.`,
        `4. ${ansNumerator} is ${askGreater ? 'greater' : 'smaller'} than the other numerator.`,
        `5. Therefore, ${ansName} has ${askGreater ? 'more' : 'less'}.`
      ];

      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "${askGreater ? 'Greater' : 'Smaller'} fraction:", "expectedAnswer": "${ansNumerator}/${denominator}" },
          { "label": "Who has ${askGreater ? 'more' : 'less'}?", "expectedAnswer": "${ansName}" }
        ]
      }`;
    }

    if (isMCQ) {
      const wrong = n1 === ansNumerator ? `${n2}/${denominator}` : `${n1}/${denominator}`;
      const wrong2 = `${denominator}/${ansNumerator}`;
      const wrong3 = `${ansNumerator + 1 > denominator ? denominator - 1 : ansNumerator + 1}/${denominator}`;
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong}", "${wrong2}", "${wrong3}"
        2. Set defectMap for incorrect options to "COMPARISON_ERROR".
      `;
    }

  } else if (activeVariant === 'standard_compare_unit_fractions') {
    let d1 = Math.floor(Math.random() * 10) + 3; // 3 to 12
    let d2 = Math.floor(Math.random() * 10) + 3; // 3 to 12
    while (d1 === d2) {
      d2 = Math.floor(Math.random() * 10) + 3;
    }
    const askGreater = Math.random() > 0.5;
    
    let greaterDenom, smallerDenom; 
    if (d1 < d2) {
      greaterDenom = d1;
      smallerDenom = d2;
    } else {
      greaterDenom = d2;
      smallerDenom = d1;
    }
    
    const ansDenom = askGreater ? greaterDenom : smallerDenom;
    answer = `1/${ansDenom}`;

    questionText = getQText(
      `Compare 1/${d1} and 1/${d2}. Which fraction is ${askGreater ? 'greater' : 'smaller'}?`,
      `Which fraction is ${askGreater ? 'greater' : 'smaller'}: 1/${d1} or 1/${d2}?`
    );

    hint = `When the numerators are 1, a ${askGreater ? 'smaller' : 'larger'} denominator means the fraction is ${askGreater ? 'greater' : 'smaller'}.`;
    solutionSteps = [
      `1. Both fractions have the same numerator (1).`,
      `2. Compare their denominators: ${d1} and ${d2}.`,
      `3. A ${askGreater ? 'smaller' : 'larger'} denominator means the whole is divided into ${askGreater ? 'fewer, bigger' : 'more, smaller'} parts.`,
      `4. Therefore, ${answer} is the ${askGreater ? 'greater' : 'smaller'} fraction.`
    ];

    if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isStructure) {
      const names = getRandomNames(2);
      const obj = getRandomDivisibleObjects(1);
      
      questionText = `${names[0]} has 1/${d1} of a ${obj}.\\n${names[1]} has 1/${d2} of a similar ${obj}.\\nWho has ${askGreater ? 'more' : 'less'}?`;
      const ansName = (ansDenom === d1) ? names[0] : names[1];
      answer = ansName;
      
      solutionSteps = [
        `1. ${names[0]} has 1/${d1} and ${names[1]} has 1/${d2}.`,
        `2. Both fractions have the same numerator (1).`,
        `3. Compare their denominators: ${d1} and ${d2}.`,
        `4. A ${askGreater ? 'smaller' : 'larger'} denominator means the fraction is ${askGreater ? 'greater' : 'smaller'}.`,
        `5. Therefore, ${ansName} has ${askGreater ? 'more' : 'less'}.`
      ];

      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "${askGreater ? 'Greater' : 'Smaller'} fraction:", "expectedAnswer": "1/${ansDenom}" },
          { "label": "Who has ${askGreater ? 'more' : 'less'}?", "expectedAnswer": "${ansName}" }
        ]
      }`;
    }

    if (isMCQ) {
      const wrong = d1 === ansDenom ? `1/${d2}` : `1/${d1}`;
      const wrong2 = `${ansDenom}/1`;
      const wrong3 = `2/${ansDenom}`;
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong}", "${wrong2}", "${wrong3}"
        2. Set defectMap for incorrect options to "COMPARISON_ERROR".
      `;
    }

  } else if (activeVariant === 'standard_order_like_fractions') {
    const denominator = Math.floor(Math.random() * 7) + 5; // 5 to 11
    let arr = [];
    while(arr.length < 3) {
      let r = Math.floor(Math.random() * (denominator - 1)) + 1;
      if(arr.indexOf(r) === -1) arr.push(r);
    }
    const askSmallestToGreatest = Math.random() > 0.5;
    
    const sorted = [...arr].sort((a,b) => askSmallestToGreatest ? a - b : b - a);
    const answerStr = `${sorted[0]}/${denominator}, ${sorted[1]}/${denominator}, ${sorted[2]}/${denominator}`;
    answer = answerStr;

    questionText = getQText(
      `Arrange the fractions in order, beginning with the ${askSmallestToGreatest ? 'smallest' : 'greatest'}:\n${arr[0]}/${denominator}, ${arr[1]}/${denominator}, ${arr[2]}/${denominator}`,
      `Arrange from ${askSmallestToGreatest ? 'smallest to greatest' : 'greatest to smallest'}: ${arr[0]}/${denominator}, ${arr[1]}/${denominator}, ${arr[2]}/${denominator}`
    );

    hint = `Since the denominators are the same, just order the numerators from ${askSmallestToGreatest ? 'smallest to greatest' : 'greatest to smallest'}.`;
    solutionSteps = [
      `1. All three fractions have the same denominator (${denominator}).`,
      `2. Compare the numerators: ${arr.join(', ')}.`,
      `3. Order the numerators from ${askSmallestToGreatest ? 'smallest to greatest' : 'greatest to smallest'}: ${sorted.join(', ')}.`,
      `4. The ordered fractions are: ${answerStr}.`
    ];

    if (isShort || isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "1st:", "expectedAnswer": "${sorted[0]}/${denominator}" },
          { "label": "2nd:", "expectedAnswer": "${sorted[1]}/${denominator}" },
          { "label": "3rd:", "expectedAnswer": "${sorted[2]}/${denominator}" }
        ]
      }`;
    }

    if (isMCQ) {
      const wrongSorted = [...arr].sort((a,b) => askSmallestToGreatest ? b - a : a - b);
      const wrong = `${wrongSorted[0]}/${denominator}, ${wrongSorted[1]}/${denominator}, ${wrongSorted[2]}/${denominator}`;
      const wrong2 = `${sorted[0]}/${denominator}, ${sorted[2]}/${denominator}, ${sorted[1]}/${denominator}`;
      const wrong3 = `${sorted[1]}/${denominator}, ${sorted[0]}/${denominator}, ${sorted[2]}/${denominator}`;
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong}", "${wrong2}", "${wrong3}"
        2. Set defectMap for incorrect options to "ORDERING_ERROR".
      `;
    }

  } else if (activeVariant === 'standard_order_unit_fractions') {
    let arr = [];
    while(arr.length < 3) {
      let r = Math.floor(Math.random() * 10) + 3; // 3 to 12
      if(arr.indexOf(r) === -1) arr.push(r);
    }
    const askSmallestToGreatest = Math.random() > 0.5;
    
    // For unit fractions, larger denominator = smaller fraction
    const sorted = [...arr].sort((a,b) => askSmallestToGreatest ? b - a : a - b);
    const answerStr = `1/${sorted[0]}, 1/${sorted[1]}, 1/${sorted[2]}`;
    answer = answerStr;

    questionText = getQText(
      `Arrange the fractions in order, beginning with the ${askSmallestToGreatest ? 'smallest' : 'greatest'}:\n1/${arr[0]}, 1/${arr[1]}, 1/${arr[2]}`,
      `Arrange from ${askSmallestToGreatest ? 'smallest to greatest' : 'greatest to smallest'}: 1/${arr[0]}, 1/${arr[1]}, 1/${arr[2]}`
    );

    hint = `For unit fractions, a larger denominator means a smaller fraction.`;
    solutionSteps = [
      `1. All three fractions have the same numerator (1).`,
      `2. A larger denominator means the fraction is smaller.`,
      `3. Order the denominators from ${askSmallestToGreatest ? 'largest to smallest' : 'smallest to largest'}: ${sorted.join(', ')}.`,
      `4. The ordered fractions are: ${answerStr}.`
    ];

    if (isShort || isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "1st:", "expectedAnswer": "1/${sorted[0]}" },
          { "label": "2nd:", "expectedAnswer": "1/${sorted[1]}" },
          { "label": "3rd:", "expectedAnswer": "1/${sorted[2]}" }
        ]
      }`;
    }

    if (isMCQ) {
      const wrongSorted = [...arr].sort((a,b) => askSmallestToGreatest ? a - b : b - a);
      const wrong = `1/${wrongSorted[0]}, 1/${wrongSorted[1]}, 1/${wrongSorted[2]}`;
      const wrong2 = `1/${sorted[0]}, 1/${sorted[2]}, 1/${sorted[1]}`;
      const wrong3 = `1/${sorted[1]}, 1/${sorted[0]}, 1/${sorted[2]}`;
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong}", "${wrong2}", "${wrong3}"
        2. Set defectMap for incorrect options to "ORDERING_ERROR".
      `;
    }

  } else if (activeVariant === 'standard_word_problem_compare') {
    const isLike = Math.random() > 0.5;
    const names = getRandomNames(2);
    const obj = getRandomDivisibleObjects(1);
    const askGreater = Math.random() > 0.5;

    let ansName, denom1, num1, denom2, num2, n1, n2;

    if (isLike) {
      const denom = Math.floor(Math.random() * 8) + 5; // 5 to 12
      n1 = Math.floor(Math.random() * (denom - 1)) + 1;
      n2 = Math.floor(Math.random() * (denom - 1)) + 1;
      while (n1 === n2) {
        n2 = Math.floor(Math.random() * (denom - 1)) + 1;
      }
      denom1 = denom;
      denom2 = denom;
      num1 = n1;
      num2 = n2;
      
      const greaterName = n1 > n2 ? names[0] : names[1];
      const smallerName = n1 < n2 ? names[0] : names[1];
      ansName = askGreater ? greaterName : smallerName;
    } else {
      let d1 = Math.floor(Math.random() * 8) + 4; // 4 to 11
      let d2 = Math.floor(Math.random() * 8) + 4; // 4 to 11
      while (d1 === d2) {
        d2 = Math.floor(Math.random() * 8) + 4;
      }
      denom1 = d1;
      denom2 = d2;
      num1 = 1;
      num2 = 1;

      const greaterName = d1 < d2 ? names[0] : names[1];
      const smallerName = d1 > d2 ? names[0] : names[1];
      ansName = askGreater ? greaterName : smallerName;
    }

    answer = ansName;

    questionText = getQText(
      `${names[0]} uses ${num1}/${denom1} of a ${obj}.\n${names[1]} uses ${num2}/${denom2} of the same ${obj}.\nWho uses ${askGreater ? 'more' : 'less'}?`,
      `${names[0]} uses ${num1}/${denom1} of a ${obj}. ${names[1]} uses ${num2}/${denom2}.\nWho uses ${askGreater ? 'more' : 'less'}?`
    );

    hint = isLike 
      ? `When the denominators are the same, the fraction with the ${askGreater ? 'larger' : 'smaller'} numerator is ${askGreater ? 'greater' : 'smaller'}.`
      : `When the numerators are 1, the fraction with the ${askGreater ? 'smaller' : 'larger'} denominator is ${askGreater ? 'greater' : 'smaller'}.`;
    
    if (isLike) {
      solutionSteps = [
        `1. ${names[0]} uses ${num1}/${denom1} and ${names[1]} uses ${num2}/${denom2}.`,
        `2. Both fractions have the same denominator (${denom1}).`,
        `3. Compare the numerators: ${num1} and ${num2}.`,
        `4. The ${askGreater ? 'larger' : 'smaller'} numerator is ${askGreater ? Math.max(num1, num2) : Math.min(num1, num2)}.`,
        `5. Therefore, ${ansName} uses ${askGreater ? 'more' : 'less'}.`
      ];
    } else {
      solutionSteps = [
        `1. ${names[0]} uses ${num1}/${denom1} and ${names[1]} uses ${num2}/${denom2}.`,
        `2. Both fractions have the same numerator (1).`,
        `3. Compare the denominators: ${denom1} and ${denom2}.`,
        `4. A ${askGreater ? 'smaller' : 'larger'} denominator means the parts are ${askGreater ? 'bigger' : 'smaller'}.`,
        `5. Therefore, ${ansName} uses ${askGreater ? 'more' : 'less'}.`
      ];
    }

    if (isStructure) {
      const ansFraction = isLike 
        ? (askGreater ? `${Math.max(num1, num2)}/${denom1}` : `${Math.min(num1, num2)}/${denom1}`)
        : (askGreater ? `1/${Math.min(denom1, denom2)}` : `1/${Math.max(denom1, denom2)}`);
        
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "${askGreater ? 'Greater' : 'Smaller'} fraction:", "expectedAnswer": "${ansFraction}" },
          { "label": "Who uses ${askGreater ? 'more' : 'less'}?", "expectedAnswer": "${ansName}" }
        ]
      }`;
    } else if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isMCQ) {
      const wrong = ansName === names[0] ? names[1] : names[0];
      const wrong2 = "They use the same amount";
      const wrong3 = "Cannot be determined";
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong}", "${wrong2}", "${wrong3}"
        2. Set defectMap for incorrect options to "COMPARISON_ERROR".
      `;
    }

  } else {
    throw new Error(`Variant '${activeVariant}' not implemented in standard.js`);
  }

  const aiPrompt = `
You are a Primary 2 Math curriculum expert. Generate a strict JSON payload for the subtopic "Fraction Comparison (Up to Denominator 12)".

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
