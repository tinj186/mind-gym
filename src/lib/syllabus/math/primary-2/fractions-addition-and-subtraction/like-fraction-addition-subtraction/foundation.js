import { getRandomDivisibleFoods, getRandomDivisibleObjects, getRandomNames } from '@/lib/utils/variable-bank';

export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let questionText = "";
  let answer = "";
  let hint = "";
  let solutionSteps = [];
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let customConstraints = "";

  const getShape = (parts) => {
    if (parts === 6 && Math.random() < 0.33) return 'hexagon';
    return Math.random() < 0.5 ? 'rectangle' : 'circle';
  };

  if (activeVariant === 'foundation_add_like_visual' || activeVariant === 'foundation_add_like_visual_word') {
    const denominator = Math.floor(Math.random() * 8) + 5; // 5 to 12
    const maxNum1 = denominator - 1;
    const n1 = Math.floor(Math.random() * maxNum1) + 1;
    const n2 = Math.floor(Math.random() * (denominator - n1)) + 1;
    const sum = n1 + n2;
    
    answer = `${sum}/${denominator}`;
    
    const shape = getShape(denominator);
    visualEngineStr = `{
      "componentToRender": "FRACTION_DISPLAY",
      "componentData": { 
        "shape": "${shape}", 
        "totalParts": ${denominator}, 
        "shadedSegments": [
          { "parts": ${n1}, "color": "#3b82f6" },
          { "parts": ${n2}, "color": "#ef4444" }
        ]
      }
    }`;

    if (activeVariant === 'foundation_add_like_visual_word') {
      const names = getRandomNames(2);
      const food = getRandomDivisibleFoods(1);
      questionText = getQText(
        `${names[0]} ate ${n1}/${denominator} of a ${food}. ${names[1]} ate ${n2}/${denominator} of the same ${food}. What fraction of the ${food} did they eat altogether?\nShow your working and the final answer.`,
        `${names[0]} ate ${n1}/${denominator} of a ${food}. ${names[1]} ate ${n2}/${denominator} of the same ${food}.\nWhat fraction did they eat altogether?`
      );
    } else {
      questionText = getQText(
        `Look at the model. Add the fractions:\n${n1}/${denominator} + ${n2}/${denominator} = [?]\nShow your working and the final answer.`,
        `Add the fractions:\n${n1}/${denominator} + ${n2}/${denominator} = [?]`
      );
    }
    
    hint = `To add fractions with the same denominator, add the top numbers (numerators) and keep the bottom number the same.`;
    solutionSteps = [
      `1. The denominator is ${denominator}.`,
      `2. Add the numerators: ${n1} + ${n2} = ${sum}`,
      `3. Keep the denominator the same: ${denominator}`,
      `4. Therefore, the answer is ${sum}/${denominator}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Are the denominators the same? (Yes/No)", "expectedAnswer": "Yes" },
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

  } else if (activeVariant === 'foundation_sub_like_visual') {
    const denominator = Math.floor(Math.random() * 8) + 5; // 5 to 12
    const n1 = Math.floor(Math.random() * (denominator - 2)) + 2; // At least 2 parts
    const n2 = Math.floor(Math.random() * (n1 - 1)) + 1; // Less than n1
    const diff = n1 - n2;
    
    answer = `${diff}/${denominator}`;
    
    const shape = getShape(denominator);
    visualEngineStr = `{
      "componentToRender": "FRACTION_DISPLAY",
      "componentData": { "shape": "${shape}", "totalParts": ${denominator}, "shadedParts": ${n1}, "color": "#3b82f6" }
    }`;

    questionText = getQText(
      `Look at the model. It shows ${n1}/${denominator}.\nIf ${n2}/${denominator} is taken away, what fraction is left?\nShow your working and the final answer.`,
      `The model shows ${n1}/${denominator}. If ${n2}/${denominator} is taken away, what fraction is left?`
    );
    
    hint = `To subtract fractions with the same denominator, subtract the top numbers (numerators) and keep the bottom number the same.`;
    solutionSteps = [
      `1. The denominator is ${denominator}.`,
      `2. Subtract the numerators: ${n1} - ${n2} = ${diff}`,
      `3. Keep the denominator the same: ${denominator}`,
      `4. Therefore, the answer is ${diff}/${denominator}.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Are the denominators the same? (Yes/No)", "expectedAnswer": "Yes" },
          { "label": "Subtract the numerators:", "expectedAnswer": "${n1} - ${n2} = ${diff}" },
          { "label": "Final answer:", "expectedAnswer": "${answer}" }
        ]
      }`;
    } else if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isMCQ) {
      const wrong1 = `${n1 + n2}/${denominator}`; // Added instead of subtract
      const wrong2 = `${diff}/${denominator - n2 === 0 ? denominator : denominator - n2}`; // Messed with denominator
      const wrong3 = `${diff - 1}/${denominator}`;
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong1}", "${wrong2}", "${wrong3}"
        2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
      `;
    }

  } else if (activeVariant === 'foundation_sub_from_whole_visual') {
    const denominator = Math.floor(Math.random() * 8) + 5; // 5 to 12
    const n2 = Math.floor(Math.random() * (denominator - 1)) + 1; 
    const diff = denominator - n2;
    
    answer = `${diff}/${denominator}`;
    
    const shape = getShape(denominator);
    visualEngineStr = `{
      "componentToRender": "FRACTION_DISPLAY",
      "componentData": { "shape": "${shape}", "totalParts": ${denominator}, "shadedParts": ${denominator}, "color": "#10b981" }
    }`;

    questionText = getQText(
      `Look at the model. It shows 1 whole.\nIf ${n2}/${denominator} is taken away, what fraction is left?\nShow your working and the final answer.`,
      `The model shows 1 whole. If ${n2}/${denominator} is taken away, what fraction is left?`
    );
    
    hint = `Remember that 1 whole is equal to ${denominator}/${denominator}. Subtract the numerators.`;
    solutionSteps = [
      `1. First, change 1 whole to a fraction with a denominator of ${denominator}.`,
      `2. 1 whole = ${denominator}/${denominator}`,
      `3. Subtract the numerators: ${denominator} - ${n2} = ${diff}`,
      `4. Therefore, the answer is ${diff}/${denominator}.`
    ];

    if (isShort || isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "1 whole is equal to:", "expectedAnswer": "${denominator}/${denominator}" },
          { "label": "Subtract the numerators:", "expectedAnswer": "${denominator} - ${n2} = ${diff}" },
          { "label": "Final answer:", "expectedAnswer": "${answer}" }
        ]
      }`;
      if (isShort) {
        inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
      }
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

  } else if (activeVariant === 'foundation_find_missing_part_visual') {
    const denominator = Math.floor(Math.random() * 8) + 5; // 5 to 12
    const n1 = Math.floor(Math.random() * (denominator - 1)) + 1; 
    const diff = denominator - n1;
    
    answer = `${diff}/${denominator}`;
    
    const shape = getShape(denominator);
    visualEngineStr = `{
      "componentToRender": "FRACTION_DISPLAY",
      "componentData": { "shape": "${shape}", "totalParts": ${denominator}, "shadedParts": ${n1}, "color": "#f59e0b" }
    }`;

    questionText = getQText(
      `Look at the model. It shows ${n1}/${denominator}.\nWhat fraction is needed to make 1 whole?\nShow your working and the final answer.`,
      `What fraction is needed to make 1 whole if you have ${n1}/${denominator}?`
    );
    
    hint = `Count the unshaded parts in the model to find what is needed to make 1 whole.`;
    solutionSteps = [
      `1. 1 whole is equal to ${denominator}/${denominator}.`,
      `2. Subtract what you have from 1 whole: ${denominator}/${denominator} - ${n1}/${denominator}`,
      `3. ${denominator} - ${n1} = ${diff}`,
      `4. Therefore, you need ${diff}/${denominator} to make 1 whole.`
    ];

    if (isStructure) {
      inputRequirementStr = `{
        "inputType": "MULTI_STEP_INPUT",
        "steps": [
          { "label": "Subtract the numerators:", "expectedAnswer": "${denominator} - ${n1} = ${diff}" },
          { "label": "Final answer:", "expectedAnswer": "${answer}" }
        ]
      }`;
    } else if (isShort) {
      inputRequirementStr = `{ "inputType": "STANDARD_TEXT" }`;
    }

    if (isMCQ) {
      const wrong1 = `${n1}/${denominator}`; 
      const wrong2 = `1/${denominator}`; 
      const wrong3 = `${diff - 1}/${denominator}`;
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${wrong1}", "${wrong2}", "${wrong3}"
        2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
      `;
    }

  } else {
    throw new Error(`Variant '${activeVariant}' not implemented in foundation.js`);
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
    metadata: { difficulty: 'foundation', logic: activeVariant }
  };
}
