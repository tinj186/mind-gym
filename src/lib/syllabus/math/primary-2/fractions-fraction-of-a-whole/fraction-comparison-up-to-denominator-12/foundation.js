import { getRandomShapes, getRandomColors, getRandomDivisibleFoods, getRandomDivisibleObjects, getRandomNames } from '@/lib/utils/variable-bank';

export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let questionText = "";
  let answer = "";
  let hint = "";
  let solutionSteps = [];
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let customConstraints = "";

  if (activeVariant === 'foundation_compare_like_fractions_visual') {
    const denominator = Math.floor(Math.random() * 8) + 3; // 3 to 10
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
      `Look at the two shapes. Which fraction is ${askGreater ? 'greater' : 'smaller'}?`,
      `Look at the two shapes. Which fraction is ${askGreater ? 'greater' : 'smaller'}?`
    );

    hint = `Count the number of shaded parts in each shape. The one with ${askGreater ? 'more' : 'fewer'} shaded parts is the ${askGreater ? 'greater' : 'smaller'} fraction.`;
    solutionSteps = [
      `1. The first shape has ${n1} out of ${denominator} parts shaded (${n1}/${denominator}).`,
      `2. The second shape has ${n2} out of ${denominator} parts shaded (${n2}/${denominator}).`,
      `3. Since they have the same number of total parts, we compare the shaded parts.`,
      `4. ${ansNumerator} is ${askGreater ? 'greater' : 'smaller'} than the other numerator.`,
      `5. The ${askGreater ? 'greater' : 'smaller'} fraction is ${answer}.`
    ];

    if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Fraction for first shape:", "expectedAnswer": "\\\\frac{${n1}}{${denominator}}" },
          { "label": "Fraction for second shape:", "expectedAnswer": "\\\\frac{${n2}}{${denominator}}" },
          { "label": "${askGreater ? 'Greater' : 'Smaller'} fraction:", "expectedAnswer": "\\\\frac{${ansNumerator}}{${denominator}}" }
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

    const shape = getRandomShapes(1);
    const color = getRandomColors(1);
    visualEngineStr = `{
      "componentToRender": "MULTI_COMPONENT",
      "componentData": {
        "className": "!flex-col sm:!flex-col items-center !gap-2 md:!gap-4",
        "components": [
          { "componentToRender": "FRACTION_DISPLAY", "componentData": { "hideCardStyles": true, "shape": "${shape}", "totalParts": ${denominator}, "shadedParts": ${n1}, "color": "${color}" } },
          { "componentToRender": "FRACTION_DISPLAY", "componentData": { "hideCardStyles": true, "shape": "${shape}", "totalParts": ${denominator}, "shadedParts": ${n2}, "color": "${color}" } }
        ]
      }
    }`;

  } else if (activeVariant === 'foundation_compare_unit_fractions_visual') {
    let d1 = Math.floor(Math.random() * 6) + 3; // 3 to 8
    let d2 = Math.floor(Math.random() * 6) + 3; // 3 to 8
    while (d1 === d2) {
      d2 = Math.floor(Math.random() * 6) + 3;
    }
    const askGreater = Math.random() > 0.5;
    
    // For unit fractions, smaller denominator = greater fraction
    let greaterDenom, smallerDenom; // Wait, greater fraction has smaller denominator
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
      `Look at the two shapes. Which fraction is ${askGreater ? 'greater' : 'smaller'}?`,
      `Look at the two shapes. Which fraction is ${askGreater ? 'greater' : 'smaller'}?`
    );

    hint = `When the numerators are both 1, the fraction with the ${askGreater ? 'smaller' : 'larger'} denominator is ${askGreater ? 'greater' : 'smaller'}, because each part is ${askGreater ? 'bigger' : 'smaller'}.`;
    solutionSteps = [
      `1. The first shape shows 1/${d1}.`,
      `2. The second shape shows 1/${d2}.`,
      `3. Both fractions have 1 as the numerator.`,
      `4. A ${askGreater ? 'smaller' : 'larger'} denominator means the whole is divided into ${askGreater ? 'fewer, bigger' : 'more, smaller'} parts.`,
      `5. The ${askGreater ? 'greater' : 'smaller'} fraction is 1/${ansDenom}.`
    ];

    if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Fraction for first shape:", "expectedAnswer": "\\\\frac{1}{${d1}}" },
          { "label": "Fraction for second shape:", "expectedAnswer": "\\\\frac{1}{${d2}}" },
          { "label": "${askGreater ? 'Greater' : 'Smaller'} fraction:", "expectedAnswer": "\\\\frac{1}{${ansDenom}}" }
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

    const shape = getRandomShapes(1);
    const color = getRandomColors(1);
    visualEngineStr = `{
      "componentToRender": "MULTI_COMPONENT",
      "componentData": {
        "className": "!flex-col sm:!flex-col items-center !gap-2 md:!gap-4",
        "components": [
          { "componentToRender": "FRACTION_DISPLAY", "componentData": { "hideCardStyles": true, "shape": "${shape}", "totalParts": ${d1}, "shadedParts": 1, "color": "${color}" } },
          { "componentToRender": "FRACTION_DISPLAY", "componentData": { "hideCardStyles": true, "shape": "${shape}", "totalParts": ${d2}, "shadedParts": 1, "color": "${color}" } }
        ]
      }
    }`;

  } else if (activeVariant === 'foundation_identify_greatest_like_visual') {
    const denominator = Math.floor(Math.random() * 6) + 4; // 4 to 9
    let arr = [];
    while(arr.length < 3) {
      let r = Math.floor(Math.random() * (denominator - 1)) + 1;
      if(arr.indexOf(r) === -1) arr.push(r);
    }
    
    // Sort array descending to find greatest
    const sorted = [...arr].sort((a,b) => b - a);
    const greatestNum = sorted[0];
    answer = `${greatestNum}/${denominator}`;

    questionText = getQText(
      `Look at the three shapes.\nWhich shape shows the greatest fraction?`,
      `Which shape shows the greatest fraction?`
    );

    hint = `Count the number of shaded parts in each shape. The fraction with the most shaded parts is the greatest.`;
    solutionSteps = [
      `1. All three shapes have ${denominator} equal parts.`,
      `2. The first shape has ${arr[0]} shaded parts (${arr[0]}/${denominator}).`,
      `3. The second shape has ${arr[1]} shaded parts (${arr[1]}/${denominator}).`,
      `4. The third shape has ${arr[2]} shaded parts (${arr[2]}/${denominator}).`,
      `5. Since ${greatestNum} is the largest numerator, the greatest fraction is ${answer}.`
    ];

    if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Number of shaded parts for greatest fraction:", "expectedAnswer": "${greatestNum}" },
          { "label": "Greatest fraction:", "expectedAnswer": "\\\\frac{${greatestNum}}{${denominator}}" }
        ]
      }`;
    }

    if (isMCQ) {
      const wrong = `${sorted[1]}/${denominator}`;
      const wrong2 = `${sorted[2]}/${denominator}`;
      const wrong3 = "They are all equal";
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong}", "${wrong2}", "${wrong3}"
        2. Set defectMap for incorrect options to "COMPARISON_ERROR".
      `;
    }

    const shape = getRandomShapes(1);
    const color = getRandomColors(1);
    visualEngineStr = `{
      "componentToRender": "MULTI_COMPONENT",
      "componentData": {
        "className": "!flex-col sm:!flex-col items-center !gap-2 md:!gap-4",
        "components": [
          { "componentToRender": "FRACTION_DISPLAY", "componentData": { "hideCardStyles": true, "shape": "${shape}", "totalParts": ${denominator}, "shadedParts": ${arr[0]}, "color": "${color}" } },
          { "componentToRender": "FRACTION_DISPLAY", "componentData": { "hideCardStyles": true, "shape": "${shape}", "totalParts": ${denominator}, "shadedParts": ${arr[1]}, "color": "${color}" } },
          { "componentToRender": "FRACTION_DISPLAY", "componentData": { "hideCardStyles": true, "shape": "${shape}", "totalParts": ${denominator}, "shadedParts": ${arr[2]}, "color": "${color}" } }
        ]
      }
    }`;

  } else if (activeVariant === 'foundation_identify_smallest_unit_visual') {
    let arr = [];
    while(arr.length < 3) {
      let r = Math.floor(Math.random() * 8) + 3; // 3 to 10
      if(arr.indexOf(r) === -1) arr.push(r);
    }
    
    // Sort array descending to find largest denominator (which is smallest unit fraction)
    const sorted = [...arr].sort((a,b) => b - a);
    const largestDenom = sorted[0];
    answer = `1/${largestDenom}`;

    questionText = getQText(
      `Look at the three shapes.\nWhich shape shows the smallest fraction?`,
      `Which shape shows the smallest fraction?`
    );

    hint = `For unit fractions, a larger denominator means the shape is divided into more parts, making each part smaller.`;
    solutionSteps = [
      `1. All three shapes show a fraction with a numerator of 1.`,
      `2. The denominators are ${arr[0]}, ${arr[1]}, and ${arr[2]}.`,
      `3. The largest denominator is ${largestDenom}, meaning its parts are the smallest.`,
      `4. Therefore, the smallest fraction is ${answer}.`
    ];

    if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Largest denominator:", "expectedAnswer": "${largestDenom}" },
          { "label": "Smallest fraction:", "expectedAnswer": "\\\\frac{1}{${largestDenom}}" }
        ]
      }`;
    }

    if (isMCQ) {
      const wrong = `1/${sorted[1]}`;
      const wrong2 = `1/${sorted[2]}`;
      const wrong3 = "They are all equal";
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong}", "${wrong2}", "${wrong3}"
        2. Set defectMap for incorrect options to "COMPARISON_ERROR".
      `;
    }

    const shape = getRandomShapes(1);
    const color = getRandomColors(1);
    visualEngineStr = `{
      "componentToRender": "MULTI_COMPONENT",
      "componentData": {
        "className": "!flex-col sm:!flex-col items-center !gap-2 md:!gap-4",
        "components": [
          { "componentToRender": "FRACTION_DISPLAY", "componentData": { "hideCardStyles": true, "shape": "${shape}", "totalParts": ${arr[0]}, "shadedParts": 1, "color": "${color}" } },
          { "componentToRender": "FRACTION_DISPLAY", "componentData": { "hideCardStyles": true, "shape": "${shape}", "totalParts": ${arr[1]}, "shadedParts": 1, "color": "${color}" } },
          { "componentToRender": "FRACTION_DISPLAY", "componentData": { "hideCardStyles": true, "shape": "${shape}", "totalParts": ${arr[2]}, "shadedParts": 1, "color": "${color}" } }
        ]
      }
    }`;

  } else if (activeVariant === 'foundation_word_problem_visual') {
    const isLike = Math.random() > 0.5;
    const isFood = Math.random() > 0.5;
    const obj = isFood ? getRandomDivisibleFoods(1) : getRandomDivisibleObjects(1);
    const names = getRandomNames(2);
    const name1 = names[0];
    const name2 = names[1];
    const askGreater = Math.random() > 0.5;
    
    const verbS = isFood ? 'eats' : 'uses';
    const verbP = isFood ? 'eat' : 'use';
    const verbPast = isFood ? 'ate' : 'used';

    let ansName, denom1, num1, denom2, num2, n1, n2;

    if (isLike) {
      const denom = Math.floor(Math.random() * 6) + 4; // 4 to 9
      n1 = Math.floor(Math.random() * (denom - 1)) + 1;
      n2 = Math.floor(Math.random() * (denom - 1)) + 1;
      while (n1 === n2) {
        n2 = Math.floor(Math.random() * (denom - 1)) + 1;
      }
      denom1 = denom;
      denom2 = denom;
      num1 = n1;
      num2 = n2;
      
      const greaterName = n1 > n2 ? name1 : name2;
      const smallerName = n1 < n2 ? name1 : name2;
      ansName = askGreater ? greaterName : smallerName;
    } else {
      let d1 = Math.floor(Math.random() * 6) + 3; // 3 to 8
      let d2 = Math.floor(Math.random() * 6) + 3; // 3 to 8
      while (d1 === d2) {
        d2 = Math.floor(Math.random() * 6) + 3;
      }
      denom1 = d1;
      denom2 = d2;
      num1 = 1;
      num2 = 1;

      // greater fraction has smaller denominator
      const greaterName = d1 < d2 ? name1 : name2;
      const smallerName = d1 > d2 ? name1 : name2;
      ansName = askGreater ? greaterName : smallerName;
    }

    answer = ansName;

    questionText = getQText(
      `${name1} ${verbS} ${num1}/${denom1} of a ${obj}.\n${name2} ${verbS} ${num2}/${denom2} of a similar ${obj}.\nThe shapes show how much they ${verbPast}.\nWho ${verbS} ${askGreater ? 'more' : 'less'}?`,
      `${name1} ${verbS} ${num1}/${denom1} of a ${obj}. ${name2} ${verbS} ${num2}/${denom2}.\nWho ${verbS} ${askGreater ? 'more' : 'less'}?`
    );

    hint = `Look at the shapes to see which one has a ${askGreater ? 'larger' : 'smaller'} shaded area.`;
    
    if (isLike) {
      solutionSteps = [
        `1. ${name1} ${verbS} ${num1}/${denom1}.`,
        `2. ${name2} ${verbS} ${num2}/${denom2}.`,
        `3. Both ${obj}s are cut into ${denom1} parts.`,
        `4. ${name1} ${verbS} ${num1} parts and ${name2} ${verbS} ${num2} parts.`,
        `5. Therefore, ${ansName} ${verbS} ${askGreater ? 'more' : 'less'}.`
      ];
    } else {
      solutionSteps = [
        `1. ${name1} ${verbS} ${num1}/${denom1}.`,
        `2. ${name2} ${verbS} ${num2}/${denom2}.`,
        `3. Both ${name1} and ${name2} ${verbP} 1 part.`,
        `4. The ${obj} that is cut into ${Math.min(denom1, denom2)} parts has bigger pieces.`,
        `5. Therefore, ${ansName} ${verbS} ${askGreater ? 'more' : 'less'}.`
      ];
    }

    if (isShort || isStructure) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isMCQ) {
      const wrong = ansName === name1 ? name2 : name1;
      const wrong2 = "They ate the same amount";
      const wrong3 = "Cannot be determined";
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong}", "${wrong2}", "${wrong3}"
        2. Set defectMap for incorrect options to "COMPARISON_ERROR".
      `;
    }

    const shape = getRandomShapes(1);
    const color1 = getRandomColors(1);
    const color2 = getRandomColors(1);
    visualEngineStr = `{
      "componentToRender": "MULTI_COMPONENT",
      "componentData": {
        "className": "!flex-col sm:!flex-col items-center !gap-2 md:!gap-4",
        "components": [
          { "componentToRender": "FRACTION_DISPLAY", "componentData": { "hideCardStyles": true, "shape": "${shape}", "totalParts": ${denom1}, "shadedParts": ${num1}, "color": "${color1}" } },
          { "componentToRender": "FRACTION_DISPLAY", "componentData": { "hideCardStyles": true, "shape": "${shape}", "totalParts": ${denom2}, "shadedParts": ${num2}, "color": "${color2}" } }
        ]
      }
    }`;

  } else {
    throw new Error(`Variant '${activeVariant}' not implemented in foundation.js`);
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
    metadata: { difficulty: 'foundation', logic: activeVariant }
  };
}
