import { getRandomDivisibleFoods } from '@/lib/utils/variable-bank';

export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let questionText = "";
  let options = [];
  let defectMap = {};
  let hint = "";
  let solutionSteps = [];
  let answer = "";
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let customConstraints = "";

  if (activeVariant === 'advanced_find_remaining_fraction') {
    const denominator = Math.floor(Math.random() * 8) + 3; // 3 to 10
    const taken = Math.floor(Math.random() * (denominator - 2)) + 1; // 1 to denom-2
    const remaining = denominator - taken;

    const food = getRandomDivisibleFoods(1);

    questionText = getQText(
      `A ${food} is cut into ${denominator} equal slices. ${context.name} eats ${taken} slices.\nWhat fraction of the ${food} is left?`,
      `A ${food} is cut into ${denominator} equal slices. ${context.name} eats ${taken} slices. What fraction of the ${food} is left?`
    );
    answer = `${remaining}/${denominator}`;
    hint = `First, find out how many slices are left by subtracting the slices eaten from the total slices. Then, write that number over the total number of slices.`;
    solutionSteps = [
      `1. Total number of slices = ${denominator}.`,
      `2. Slices eaten = ${taken}.`,
      `3. Slices left = ${denominator} - ${taken} = ${remaining}.`,
      `4. The fraction of the ${food} left is ${remaining}/${denominator}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Total slices:", "expectedAnswer": "${denominator}" },
          { "label": "Slices left:", "expectedAnswer": "${remaining}" },
          { "label": "Fraction left:", "expectedAnswer": "\\\\frac{${remaining}}{${denominator}}" }
        ]
      }`;
    }
  } else if (activeVariant === 'advanced_combine_fractions_to_whole') {
    const denominator = Math.floor(Math.random() * 8) + 3; // 3 to 10
    const have = Math.floor(Math.random() * (denominator - 2)) + 1; // 1 to denom-2
    const needed = denominator - have;

    const food = getRandomDivisibleFoods(1);

    questionText = getQText(
      `A whole ${food} has ${denominator} slices. ${context.name} has ${have} slices.\nHow many more slices does ${context.name} need to make a whole ${food}?`,
      `A whole ${food} has ${denominator} slices. ${context.name} has ${have} slices. How many more slices does ${context.name} need to make a whole ${food}?`
    );
    answer = `${needed}`;
    hint = `Subtract the number of slices ${context.name} has from the total number of slices in a whole ${food}.`;
    solutionSteps = [
      `1. A whole ${food} has ${denominator} slices.`,
      `2. ${context.name} has ${have} slices.`,
      `3. Slices needed = ${denominator} - ${have} = ${needed}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }
  } else if (activeVariant === 'advanced_fraction_properties_parts_in_whole') {
    const fractionsMap = {
      2: "halves", 3: "thirds", 4: "quarters", 5: "fifths",
      6: "sixths", 7: "sevenths", 8: "eighths", 9: "ninths", 10: "tenths"
    };
    const denominator = Math.floor(Math.random() * 9) + 2; // 2 to 10
    const partsName = fractionsMap[denominator];
    questionText = getQText(
      `How many ${partsName} make 1 whole?`,
      `How many ${partsName} make 1 whole?`
    );
    answer = `${denominator}`;
    hint = `Think about how many equal parts a whole is divided into to make ${partsName}.`;
    solutionSteps = [
      `1. A whole is divided into ${denominator} equal parts to make ${partsName}.`,
      `2. So, ${denominator} ${partsName} make 1 whole.`
    ];
    if (isStructure) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }
  } else if (activeVariant === 'advanced_identify_whole_as_fraction') {
    const denominator = Math.floor(Math.random() * 9) + 2; // 2 to 10
    questionText = getQText(
      `Write a fraction that is equal to 1 whole, with a bottom number of ${denominator}.`,
      `Write a fraction that is equal to 1 whole, with a bottom number of ${denominator}.`
    );
    answer = `${denominator}/${denominator}`;
    hint = `A fraction is equal to 1 whole when the top number is the same as the bottom number.`;
    solutionSteps = [
      `1. 1 whole means all the equal parts are selected.`,
      `2. The bottom number is ${denominator}, so there are ${denominator} equal parts in total.`,
      `3. To make 1 whole, the top number must also be ${denominator}.`,
      `4. The fraction is ${denominator}/${denominator}.`
    ];
    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Bottom number:", "expectedAnswer": "${denominator}" },
          { "label": "Top number for 1 whole:", "expectedAnswer": "${denominator}" },
          { "label": "Fraction:", "expectedAnswer": "\\\\frac{${denominator}}{${denominator}}" }
        ]
      }`;
    }
  } else if (activeVariant === 'advanced_visual_missing_parts_to_whole') {
    const denominator = Math.floor(Math.random() * 8) + 3; // 3 to 10
    const shaded = Math.floor(Math.random() * (denominator - 2)) + 1; // 1 to denom-2
    const needed = denominator - shaded;
    
    const shapes = ['circle', 'rectangle', 'hexagon'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    visualEngineStr = `{
      "componentToRender": "FRACTION_DISPLAY",
      "componentData": {
        "shape": "${shape}",
        "totalParts": ${denominator},
        "shadedParts": ${shaded},
        "color": "#3b82f6"
      }
    }`;

    questionText = getQText(
      `Look at the shape. It is divided into ${denominator} equal parts. ${shaded} parts are shaded.\nHow many more parts must be shaded to make 1 whole?`,
      `Look at the shape. It is divided into ${denominator} equal parts. ${shaded} parts are shaded. How many more parts must be shaded to make 1 whole?`
    );
    answer = `${needed}`;
    hint = `Subtract the number of shaded parts from the total number of parts to find how many more are needed to make a whole.`;
    solutionSteps = [
      `1. Total number of parts to make a whole = ${denominator}.`,
      `2. Number of parts already shaded = ${shaded}.`,
      `3. More parts needed = ${denominator} - ${shaded} = ${needed}.`
    ];
    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Total parts:", "expectedAnswer": "${denominator}" },
          { "label": "Shaded parts:", "expectedAnswer": "${shaded}" },
          { "label": "More parts needed:", "expectedAnswer": "${needed}" }
        ]
      }`;
    }
  } else {
    throw new Error(`Variant '${activeVariant}' not implemented in advanced.js`);
  }

  if (isMCQ) {
    if (answer.includes('/')) {
      const [numStr, denStr] = answer.split('/');
      const num = parseInt(numStr);
      const den = parseInt(denStr);
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${num}/${den + 1}", "${Math.max(1, num - 1)}/${den}", "${num + 1}/${den}"
        2. Set defectMap for incorrect options to "FRACTION_ERROR".
      `;
    } else {
      const correctAns = parseInt(answer);
      const wrongOptionsSet = new Set();
      wrongOptionsSet.add(correctAns + 1);
      wrongOptionsSet.add(Math.max(1, correctAns - 1));
      wrongOptionsSet.add(correctAns + 2);
      wrongOptionsSet.add(Math.max(1, correctAns - 2));
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
