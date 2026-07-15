import { getRandomDivisibleFoods } from '@/lib/utils/variable-bank';

export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let questionText = "";
  let options = [];
  let defectMap = {};
  let hint = "";
  let solutionSteps = [];
  let answer = "";
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let customConstraints = "";

  const denominator = Math.floor(Math.random() * 8) + 2; // 2 to 9
  const numerator = Math.floor(Math.random() * denominator) + 1; // 1 to denom
  const unshadedParts = denominator - numerator;
  
  if (activeVariant === 'standard_fraction_word_problem_shaded') {
    const food = getRandomDivisibleFoods(1);
    questionText = getQText(
      `A ${food} is cut into ${denominator} equal slices. ${context.name} eats ${numerator} slices.\nWhat fraction of the ${food} did ${context.name} eat?`,
      `A ${food} is cut into ${denominator} equal slices. ${context.name} eats ${numerator} slices. What fraction of the ${food} did ${context.name} eat?`
    );
    answer = `${numerator}/${denominator}`;
    hint = `The fraction eaten is (number of slices eaten) / (total number of slices).`;
    solutionSteps = [
      `1. Total number of slices = ${denominator}.`,
      `2. Number of slices eaten = ${numerator}.`,
      `3. The fraction of the ${food} eaten is ${numerator}/${denominator}.`
    ];
    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Total slices:", "expectedAnswer": "${denominator}" },
          { "label": "Slices eaten:", "expectedAnswer": "${numerator}" },
          { "label": "Fraction eaten:", "expectedAnswer": "\\\\frac{${numerator}}{${denominator}}" }
        ]
      }`;
    }

  } else if (activeVariant === 'standard_fraction_word_problem_unshaded') {
    const food = getRandomDivisibleFoods(1);
    questionText = getQText(
      `A ${food} is broken into ${denominator} equal pieces. ${context.name} eats ${numerator} pieces.\nWhat fraction of the ${food} is left?`,
      `A ${food} is broken into ${denominator} equal pieces. ${context.name} eats ${numerator} pieces. What fraction of the ${food} is left?`
    );
    answer = `${unshadedParts}/${denominator}`;
    hint = `First find the number of pieces left. Then find the fraction it represents out of the total.`;
    solutionSteps = [
      `1. Total number of pieces = ${denominator}.`,
      `2. Pieces left = ${denominator} - ${numerator} = ${unshadedParts}.`,
      `3. The fraction of the ${food} left is ${unshadedParts}/${denominator}.`
    ];
    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Total pieces:", "expectedAnswer": "${denominator}" },
          { "label": "Pieces left:", "expectedAnswer": "${unshadedParts}" },
          { "label": "Fraction left:", "expectedAnswer": "\\\\frac{${unshadedParts}}{${denominator}}" }
        ]
      }`;
    }

  } else if (activeVariant === 'standard_identify_fraction_of_whole') {
    const plural = selectedContextItem.plural;
    const singular = selectedContextItem.singular;
    const itemsLabel = denominator === 1 ? singular : plural;
    const numLabel = numerator === 1 ? singular : plural;
    const verb = numerator === 1 ? 'is' : 'are';
    
    questionText = getQText(
      `${context.name} has ${denominator} ${itemsLabel}.\n${numerator} ${numLabel} ${verb} red.\nWhat fraction of the ${plural} are red?`,
      `${context.name} has ${denominator} ${itemsLabel}. ${numerator} ${numLabel} ${verb} red. What fraction of the ${plural} are red?`
    );
    answer = `${numerator}/${denominator}`;
    hint = `The fraction is (number of red items) / (total number of items).`;
    solutionSteps = [
      `1. Total number of ${plural} = ${denominator}.`,
      `2. Number of red ${plural} = ${numerator}.`,
      `3. The fraction of red ${plural} is ${numerator}/${denominator}.`
    ];
    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Total number of ${plural}:", "expectedAnswer": "${denominator}" },
          { "label": "Number of red ${plural}:", "expectedAnswer": "${numerator}" },
          { "label": "Fraction of red ${plural}:", "expectedAnswer": "\\\\frac{${numerator}}{${denominator}}" }
        ]
      }`;
    }

  } else if (activeVariant === 'standard_missing_numerator') {
    const shapes = ['circle', 'rectangle'];
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
    questionText = getQText(
      `Look at the shaded shape.\nThe fraction of the shape that is shaded is [?] / ${denominator}.\nWhat is the missing number?`,
      `Look at the shaded shape. The fraction of the shape that is shaded is [?] / ${denominator}. What is the missing number?`
    );
    answer = `${numerator}`;
    hint = `The top number of the fraction represents the number of shaded parts.`;
    solutionSteps = [
      `1. The bottom number is ${denominator}, which is the total equal parts.`,
      `2. The top number is the number of shaded parts.`,
      `3. There are ${numerator} shaded parts.`,
      `4. The missing number is ${numerator}.`
    ];
    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Total number of equal parts:", "expectedAnswer": "${denominator}" },
          { "label": "Number of shaded parts:", "expectedAnswer": "${numerator}" },
          { "label": "Missing top number:", "expectedAnswer": "${numerator}" }
        ]
      }`;
    }

  } else if (activeVariant === 'standard_missing_denominator') {
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
    questionText = getQText(
      `Look at the shaded shape.\nThe fraction of the shape that is shaded is ${numerator} / [?].\nWhat is the missing number?`,
      `Look at the shaded shape. The fraction of the shape that is shaded is ${numerator} / [?]. What is the missing number?`
    );
    answer = `${denominator}`;
    hint = `The bottom number of the fraction represents the total number of equal parts.`;
    solutionSteps = [
      `1. The top number is ${numerator}, which is the number of shaded parts.`,
      `2. The bottom number is the total number of equal parts.`,
      `3. There are ${denominator} equal parts in total.`,
      `4. The missing number is ${denominator}.`
    ];
    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Total number of equal parts:", "expectedAnswer": "${denominator}" },
          { "label": "Number of shaded parts:", "expectedAnswer": "${numerator}" },
          { "label": "Missing bottom number:", "expectedAnswer": "${denominator}" }
        ]
      }`;
    }

  } else {
    throw new Error(`Variant '${activeVariant}' not implemented in standard.js`);
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
