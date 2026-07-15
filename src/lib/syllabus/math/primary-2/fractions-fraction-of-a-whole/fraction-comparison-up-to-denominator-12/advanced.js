import { getRandomDivisibleFoods, getRandomDivisibleObjects, getRandomNames } from '@/lib/utils/variable-bank';

export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let questionText = "";
  let answer = "";
  let hint = "";
  let solutionSteps = [];
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let customConstraints = "";

  if (activeVariant === 'advanced_compare_missing_numerator') {
    const denominator = Math.floor(Math.random() * 8) + 5; // 5 to 12
    const n = Math.floor(Math.random() * (denominator - 2)) + 2; // 2 to denom-1
    const askGreater = Math.random() > 0.5; // ?/D > n/D or ?/D < n/D
    
    // Find possible valid missing numerators
    let possibleAnswers = [];
    if (askGreater) {
      for(let i = n + 1; i <= denominator; i++) possibleAnswers.push(i);
    } else {
      for(let i = 1; i < n; i++) possibleAnswers.push(i);
    }
    
    // Pick one as the expected answer
    const ansNum = possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)];
    answer = `${ansNum}`;

    questionText = getQText(
      `A fraction with a missing numerator makes the comparison correct:\n[?]/${denominator} ${askGreater ? '>' : '<'} ${n}/${denominator}\nWhat is one possible number for [?]?`,
      `[?]/${denominator} ${askGreater ? '>' : '<'} ${n}/${denominator}\nWhat is one possible number for [?]?`
    );

    hint = `Since the denominators are the same, you just need a numerator that is ${askGreater ? 'greater' : 'smaller'} than ${n}.`;
    solutionSteps = [
      `1. The denominators are both ${denominator}.`,
      `2. To make a ${askGreater ? 'greater' : 'smaller'} fraction, the missing numerator must be ${askGreater ? 'greater' : 'smaller'} than ${n}.`,
      `3. Possible numbers are: ${possibleAnswers.join(', ')}.`,
      `4. Therefore, one possible answer is ${ansNum}.`
    ];

    if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "The missing numerator must be ${askGreater ? 'greater' : 'smaller'} than:", "expectedAnswer": "${n}" },
          { "label": "One possible number for [?]:", "expectedAnswer": "${ansNum}" }
        ]
      }`;
    }

    if (isMCQ) {
      // For MCQ, we need exactly one correct answer and 3 incorrect ones
      let wrongAnswers = [];
      if (askGreater) {
        wrongAnswers = [n, Math.max(1, n - 1), Math.max(1, n - 2)];
      } else {
        wrongAnswers = [n, Math.min(denominator, n + 1), Math.min(denominator, n + 2)];
      }
      
      const wrong = `${wrongAnswers[0]}`;
      const wrong2 = `${wrongAnswers[1]}`;
      const wrong3 = `${wrongAnswers[2]}`;
      
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong}", "${wrong2}", "${wrong3}"
        2. Set defectMap for incorrect options to "COMPARISON_ERROR".
      `;
    }
    
    // Allow any correct possible answer for AI grading
    customConstraints += `
      3. CRITICAL: The user can input any of the following valid numbers: ${possibleAnswers.join(', ')}. Ensure your prompt logic accepts any of them.
    `;

  } else if (activeVariant === 'advanced_compare_missing_denominator') {
    const d = Math.floor(Math.random() * 6) + 4; // 4 to 9
    const askGreater = Math.random() > 0.5; // 1/? > 1/d or 1/? < 1/d
    
    let possibleAnswers = [];
    if (askGreater) {
      for(let i = 2; i < d; i++) possibleAnswers.push(i);
    } else {
      for(let i = d + 1; i <= 12; i++) possibleAnswers.push(i);
    }
    
    if (possibleAnswers.length === 0) {
      // Fallback if no answers (e.g. d=2 and askGreater)
      possibleAnswers = [d + 1];
    }

    const ansDenom = possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)];
    answer = `${ansDenom}`;

    questionText = getQText(
      `A unit fraction with a missing denominator makes the comparison correct:\n1/[?] ${askGreater ? '>' : '<'} 1/${d}\nWhat is one possible number for [?] (up to 12)?`,
      `1/[?] ${askGreater ? '>' : '<'} 1/${d}\nWhat is one possible number for [?] (up to 12)?`
    );

    hint = `For unit fractions, a ${askGreater ? 'smaller' : 'larger'} denominator makes a ${askGreater ? 'greater' : 'smaller'} fraction.`;
    solutionSteps = [
      `1. Both numerators are 1.`,
      `2. To make a ${askGreater ? 'greater' : 'smaller'} fraction, the missing denominator must be ${askGreater ? 'smaller' : 'greater'} than ${d}.`,
      `3. Possible numbers (up to 12) are: ${possibleAnswers.join(', ')}.`,
      `4. Therefore, one possible answer is ${ansDenom}.`
    ];

    if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "The missing denominator must be ${askGreater ? 'smaller' : 'greater'} than:", "expectedAnswer": "${d}" },
          { "label": "One possible number for [?]:", "expectedAnswer": "${ansDenom}" }
        ]
      }`;
    }

    if (isMCQ) {
      let wrongAnswers = [];
      if (askGreater) {
        wrongAnswers = [d, d + 1, d + 2];
      } else {
        wrongAnswers = [d, Math.max(2, d - 1), Math.max(2, d - 2)];
      }
      
      const wrong = `${wrongAnswers[0]}`;
      const wrong2 = `${wrongAnswers[1]}`;
      const wrong3 = `${wrongAnswers[2]}`;
      
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong}", "${wrong2}", "${wrong3}"
        2. Set defectMap for incorrect options to "COMPARISON_ERROR".
      `;
    }
    
    customConstraints += `
      3. CRITICAL: The user can input any of the following valid numbers: ${possibleAnswers.join(', ')}. Ensure your prompt logic accepts any of them.
    `;

  } else if (activeVariant === 'advanced_word_problem_compare_order') {
    const isLike = Math.random() > 0.5;
    const askGreatest = Math.random() > 0.5;
    const names = getRandomNames(3);
    const obj = getRandomDivisibleObjects(1);
    
    let fractions = [];
    if (isLike) {
      const denom = Math.floor(Math.random() * 5) + 6; // 6 to 10
      let arr = [];
      while(arr.length < 3) {
        let r = Math.floor(Math.random() * (denom - 1)) + 1;
        if(arr.indexOf(r) === -1) arr.push(r);
      }
      fractions = arr.map(n => `${n}/${denom}`);
    } else {
      let arr = [];
      while(arr.length < 3) {
        let r = Math.floor(Math.random() * 8) + 3; // 3 to 10
        if(arr.indexOf(r) === -1) arr.push(r);
      }
      fractions = arr.map(d => `1/${d}`);
    }
    
    // Sort logic to find the answer
    let sortedFractions;
    if (isLike) {
      sortedFractions = [...fractions].sort((a,b) => {
        const numA = parseInt(a.split('/')[0]);
        const numB = parseInt(b.split('/')[0]);
        return askGreatest ? numB - numA : numA - numB;
      });
    } else {
      sortedFractions = [...fractions].sort((a,b) => {
        const denA = parseInt(a.split('/')[1]);
        const denB = parseInt(b.split('/')[1]);
        return askGreatest ? denA - denB : denB - denA;
      });
    }
    
    const ansFraction = sortedFractions[0];
    const ansName = names[fractions.indexOf(ansFraction)];
    answer = ansName;

    questionText = getQText(
      `${names[0]} uses ${fractions[0]} of a ${obj}.\n${names[1]} uses ${fractions[1]} of the same ${obj}.\n${names[2]} uses ${fractions[2]} of the same ${obj}.\nWho uses the ${askGreatest ? 'most' : 'least'} amount of ${obj}?`,
      `${names[0]} uses ${fractions[0]} of a ${obj}, ${names[1]} uses ${fractions[1]}, and ${names[2]} uses ${fractions[2]}.\nWho uses the ${askGreatest ? 'most' : 'least'}?`
    );

    hint = `First find which fraction is the ${askGreatest ? 'greatest' : 'smallest'}, then see who used that fraction.`;
    solutionSteps = [
      `1. Compare the fractions: ${fractions.join(', ')}.`,
      isLike 
        ? `2. Since the denominators are the same, the fraction with the ${askGreatest ? 'largest' : 'smallest'} numerator is the ${askGreatest ? 'greatest' : 'smallest'}.`
        : `2. Since the numerators are all 1, the fraction with the ${askGreatest ? 'smallest' : 'largest'} denominator is the ${askGreatest ? 'greatest' : 'smallest'}.`,
      `3. The ${askGreatest ? 'greatest' : 'smallest'} fraction is ${ansFraction}.`,
      `4. ${ansName} used ${ansFraction} of the ${obj}.`,
      `5. Therefore, ${ansName} uses the ${askGreatest ? 'most' : 'least'}.`
    ];

    if (isShort || isStructure) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isMCQ) {
      const wrong = names[(fractions.indexOf(ansFraction) + 1) % 3];
      const wrong2 = names[(fractions.indexOf(ansFraction) + 2) % 3];
      const wrong3 = "They used the same amount";
      
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong}", "${wrong2}", "${wrong3}"
        2. Set defectMap for incorrect options to "COMPARISON_ERROR".
      `;
    }

  } else if (activeVariant === 'advanced_order_missing_numerator') {
    const denominator = Math.floor(Math.random() * 6) + 7; // 7 to 12
    let arr = [];
    while(arr.length < 3) {
      let r = Math.floor(Math.random() * (denominator - 1)) + 1;
      if(arr.indexOf(r) === -1) arr.push(r);
    }
    
    // Sort array
    const askSmallestToGreatest = Math.random() > 0.5;
    const sorted = [...arr].sort((a,b) => askSmallestToGreatest ? a - b : b - a);
    
    // The middle one is missing
    const missingNum = sorted[1];
    
    let possibleAnswers = [];
    if (askSmallestToGreatest) {
      for(let i = sorted[0] + 1; i < sorted[2]; i++) possibleAnswers.push(i);
    } else {
      for(let i = sorted[2] + 1; i < sorted[0]; i++) possibleAnswers.push(i);
    }
    
    if (possibleAnswers.length === 0) {
      possibleAnswers = [missingNum];
    }

    const ansNum = possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)];
    answer = `${ansNum}`;

    questionText = getQText(
      `These fractions are arranged from ${askSmallestToGreatest ? 'smallest to greatest' : 'greatest to smallest'}:\n${sorted[0]}/${denominator}, [?]/${denominator}, ${sorted[2]}/${denominator}\nWhat is one possible number for [?]?`,
      `These are arranged from ${askSmallestToGreatest ? 'smallest to greatest' : 'greatest to smallest'}:\n${sorted[0]}/${denominator}, [?]/${denominator}, ${sorted[2]}/${denominator}\nWhat is one possible number for [?]?`
    );

    hint = `Since the denominators are the same, the missing numerator must be between ${sorted[0]} and ${sorted[2]}.`;
    solutionSteps = [
      `1. The fractions are ordered from ${askSmallestToGreatest ? 'smallest to greatest' : 'greatest to smallest'}.`,
      `2. All fractions have a denominator of ${denominator}.`,
      `3. This means the numerators must be in order from ${askSmallestToGreatest ? 'smallest to greatest' : 'greatest to smallest'}.`,
      `4. The missing numerator must be between ${sorted[0]} and ${sorted[2]}.`,
      `5. Possible numbers are: ${possibleAnswers.join(', ')}.`,
      `6. Therefore, one possible answer is ${ansNum}.`
    ];

    if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "The missing numerator must be between ${Math.min(sorted[0], sorted[2])} and ${Math.max(sorted[0], sorted[2])}:", "expectedAnswer": "${ansNum}" },
          { "label": "One possible number for [?]:", "expectedAnswer": "${ansNum}" }
        ]
      }`;
    }

    if (isMCQ) {
      let wrongAnswers = [
        sorted[0], 
        sorted[2], 
        Math.min(sorted[0], sorted[2]) - 1 > 0 ? Math.min(sorted[0], sorted[2]) - 1 : Math.max(sorted[0], sorted[2]) + 1
      ];
      
      const wrong = `${wrongAnswers[0]}`;
      const wrong2 = `${wrongAnswers[1]}`;
      const wrong3 = `${wrongAnswers[2]}`;
      
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong}", "${wrong2}", "${wrong3}"
        2. Set defectMap for incorrect options to "COMPARISON_ERROR".
      `;
    }
    
    customConstraints += `
      3. CRITICAL: The user can input any of the following valid numbers: ${possibleAnswers.join(', ')}. Ensure your prompt logic accepts any of them.
    `;

  } else if (activeVariant === 'advanced_identify_incorrect_comparison') {
    const isLike = Math.random() > 0.5;
    
    let statements = [];
    let correctStatementIndices = [];
    
    if (isLike) {
      const denom = Math.floor(Math.random() * 6) + 6; // 6 to 11
      for (let i = 0; i < 3; i++) {
        let n1 = Math.floor(Math.random() * (denom - 1)) + 1;
        let n2 = Math.floor(Math.random() * (denom - 1)) + 1;
        while (n1 === n2) n2 = Math.floor(Math.random() * (denom - 1)) + 1;
        
        let isStatementCorrect = Math.random() > 0.5;
        if (i === 2 && correctStatementIndices.length === 2) {
          isStatementCorrect = false; 
        } else if (i === 2 && correctStatementIndices.length === 0) {
          isStatementCorrect = true; 
        } else if (correctStatementIndices.length === 2) {
           isStatementCorrect = false; 
        }
        
        if (isStatementCorrect && correctStatementIndices.length < 2) {
           correctStatementIndices.push(i);
        } else if (!isStatementCorrect && i - correctStatementIndices.length > 0) {
           isStatementCorrect = true;
           correctStatementIndices.push(i);
        }

        let symbol = '';
        if (isStatementCorrect) {
          symbol = n1 > n2 ? '>' : '<';
        } else {
          symbol = n1 > n2 ? '<' : '>';
        }
        statements.push({ text: `${n1}/${denom} ${symbol} ${n2}/${denom}`, isCorrect: isStatementCorrect });
      }
    } else {
      for (let i = 0; i < 3; i++) {
        let d1 = Math.floor(Math.random() * 8) + 3; // 3 to 10
        let d2 = Math.floor(Math.random() * 8) + 3; // 3 to 10
        while (d1 === d2) d2 = Math.floor(Math.random() * 8) + 3;
        
        let isStatementCorrect = Math.random() > 0.5;
        if (i === 2 && correctStatementIndices.length === 2) {
          isStatementCorrect = false; 
        } else if (i === 2 && correctStatementIndices.length === 0) {
          isStatementCorrect = true; 
        } else if (correctStatementIndices.length === 2) {
           isStatementCorrect = false;
        }
        
        if (isStatementCorrect && correctStatementIndices.length < 2) {
           correctStatementIndices.push(i);
        } else if (!isStatementCorrect && i - correctStatementIndices.length > 0) {
           isStatementCorrect = true;
           correctStatementIndices.push(i);
        }
        
        let symbol = '';
        if (isStatementCorrect) {
          symbol = d1 < d2 ? '>' : '<';
        } else {
          symbol = d1 < d2 ? '<' : '>';
        }
        statements.push({ text: `1/${d1} ${symbol} 1/${d2}`, isCorrect: isStatementCorrect });
      }
    }
    
    statements.sort(() => 0.5 - Math.random());
    const incorrectStatement = statements.find(s => !s.isCorrect).text;
    answer = incorrectStatement;

    const character = getRandomNames(1);

    questionText = getQText(
      `${character} wrote three comparisons:\n1) ${statements[0].text}\n2) ${statements[1].text}\n3) ${statements[2].text}\nWhich one is INCORRECT?`,
      `${character} wrote three comparisons:\n1) ${statements[0].text}\n2) ${statements[1].text}\n3) ${statements[2].text}\nWhich one is INCORRECT?`
    );

    hint = isLike
      ? `Check each statement. When denominators are the same, the larger numerator is the greater fraction.`
      : `Check each statement. For unit fractions, the larger denominator is the smaller fraction.`;
      
    solutionSteps = [
      `1. Check the first comparison: ${statements[0].text}. This is ${statements[0].isCorrect ? 'correct' : 'incorrect'}.`,
      `2. Check the second comparison: ${statements[1].text}. This is ${statements[1].isCorrect ? 'correct' : 'incorrect'}.`,
      `3. Check the third comparison: ${statements[2].text}. This is ${statements[2].isCorrect ? 'correct' : 'incorrect'}.`,
      `4. The incorrect comparison is ${answer}.`
    ];

    if (isShort || isStructure) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isMCQ) {
      const correct1 = statements.find(s => s.isCorrect).text;
      const correct2 = statements.find(s => s.isCorrect && s.text !== correct1).text;
      const wrong = correct1;
      const wrong2 = correct2;
      const wrong3 = "None of the above";
      
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong}", "${wrong2}", "${wrong3}"
        2. Set defectMap for incorrect options to "COMPARISON_ERROR".
      `;
    }

  } else {
    throw new Error(`Variant '${activeVariant}' not implemented in advanced.js`);
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
    metadata: { difficulty: 'advanced', logic: activeVariant }
  };
}
