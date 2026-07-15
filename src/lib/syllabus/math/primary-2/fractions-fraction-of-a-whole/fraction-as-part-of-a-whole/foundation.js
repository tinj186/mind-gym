export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let questionText = "";
  let options = [];
  let defectMap = {};
  let hint = "";
  let solutionSteps = [];
  let answer = "";
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let customConstraints = "";

  // Common randomizers
  const denominator = Math.floor(Math.random() * 8) + 2; // 2 to 9
  const numerator = Math.floor(Math.random() * denominator) + 1; // 1 to denom
  const unshadedParts = denominator - numerator;
  
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

  if (activeVariant === 'foundation_identify_fraction_shaded') {
    questionText = getQText(
      `What fraction of the shape is shaded?`,
      `What fraction of the shape is shaded?`
    );
    answer = `${numerator}/${denominator}`;
    hint = `First, count the total number of equal parts. Then, count the number of shaded parts. The fraction is (shaded parts) / (total parts).`;
    solutionSteps = [
      `1. Count the total number of equal parts in the shape. There are ${denominator} equal parts.`,
      `2. Count the number of shaded parts. There are ${numerator} shaded parts.`,
      `3. The fraction of the shape that is shaded is ${numerator}/${denominator}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          {
            "label": "Total number of equal parts:",
            "expectedAnswer": "${denominator}"
          },
          {
            "label": "Number of shaded parts:",
            "expectedAnswer": "${numerator}"
          },
          {
            "label": "Fraction of the shape that is shaded:",
            "expectedAnswer": "\\\\frac{${numerator}}{${denominator}}"
          }
        ]
      }`;
    }

  } else if (activeVariant === 'foundation_identify_fraction_unshaded') {
    questionText = getQText(
      `What fraction of the shape is unshaded?`,
      `What fraction of the shape is unshaded?`
    );
    answer = `${unshadedParts}/${denominator}`;
    hint = `First, count the total number of equal parts. Then, count the number of unshaded (white) parts. The fraction is (unshaded parts) / (total parts).`;
    solutionSteps = [
      `1. Count the total number of equal parts in the shape. There are ${denominator} equal parts.`,
      `2. Count the number of unshaded parts. There are ${unshadedParts} unshaded parts.`,
      `3. The fraction of the shape that is unshaded is ${unshadedParts}/${denominator}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          {
            "label": "Total number of equal parts:",
            "expectedAnswer": "${denominator}"
          },
          {
            "label": "Number of unshaded parts:",
            "expectedAnswer": "${unshadedParts}"
          },
          {
            "label": "Fraction of the shape that is unshaded:",
            "expectedAnswer": "\\\\frac{${unshadedParts}}{${denominator}}"
          }
        ]
      }`;
    }

  } else if (activeVariant === 'foundation_identify_shaded_parts') {
    questionText = getQText(
      `How many equal parts of the shape are shaded?`,
      `How many equal parts of the shape are shaded?`
    );
    answer = `${numerator}`;
    hint = `Count only the parts that are colored in.`;
    solutionSteps = [
      `1. Look at the colored parts of the shape.`,
      `2. There are ${numerator} shaded parts.`
    ];
    if (isStructure) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

  } else if (activeVariant === 'foundation_identify_unshaded_parts') {
    questionText = getQText(
      `How many equal parts of the shape are unshaded?`,
      `How many equal parts of the shape are unshaded?`
    );
    answer = `${unshadedParts}`;
    hint = `Count only the parts that are white.`;
    solutionSteps = [
      `1. Look at the white parts of the shape.`,
      `2. There are ${unshadedParts} unshaded parts.`
    ];
    if (isStructure) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

  } else if (activeVariant === 'foundation_identify_total_parts') {
    questionText = getQText(
      `How many equal parts is the shape divided into in total?`,
      `How many equal parts is the shape divided into in total?`
    );
    answer = `${denominator}`;
    hint = `Count every part of the shape, both shaded and unshaded.`;
    solutionSteps = [
      `1. Count the shaded parts: ${numerator}.`,
      `2. Count the unshaded parts: ${unshadedParts}.`,
      `3. Total equal parts = ${numerator} + ${unshadedParts} = ${denominator}.`
    ];
    if (isStructure) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }
  } else {
    throw new Error(`Variant '${activeVariant}' not implemented in foundation.js`);
  }

  // Generate options if MCQ
  if (isMCQ) {
    if (activeVariant.includes('fraction')) {
      const isShaded = activeVariant.includes('shaded') && !activeVariant.includes('unshaded');
      const correctNumerator = isShaded ? numerator : unshadedParts;
      const wrongNum1 = correctNumerator + 1 > denominator - 1 ? 1 : correctNumerator + 1;
      const wrongNum2 = Math.max(1, correctNumerator - 1);
      
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${correctNumerator}/${denominator + 1}", "${wrongNum1}/${denominator}", "${wrongNum2}/${denominator}"
        2. Set defectMap for incorrect options to "FRACTION_IDENTIFICATION_ERROR".
      `;
    } else {
      // Identifying parts (integer answer)
      const correctAns = parseInt(answer);
      const wrongOptionsSet = new Set();
      wrongOptionsSet.add(correctAns + 1);
      wrongOptionsSet.add(Math.max(1, correctAns - 1));
      wrongOptionsSet.add(denominator);
      wrongOptionsSet.add(denominator + 1);
      const wrongOptions = Array.from(wrongOptionsSet).filter(x => x !== correctAns).slice(0, 3);
      
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${correctAns}", "${wrongOptions[0]}", "${wrongOptions[1]}", "${wrongOptions[2]}"
        2. Set defectMap for incorrect options to "COUNTING_ERROR".
      `;
    }
  }

  const aiPrompt = `
You are a Primary 2 Math curriculum expert. Generate a strict JSON payload for the subtopic "Fraction as Part of a Whole".

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
