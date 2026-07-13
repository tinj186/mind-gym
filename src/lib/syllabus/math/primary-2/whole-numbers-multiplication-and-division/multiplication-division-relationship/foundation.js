export const foundationLogic = function (
  activeVariant,
  difficulty,
  type,
  isMCQ,
  isShort,
  isStructure,
  zodType,
  zodDiff,
  levelName,
  topic,
  getFormatInstructions,
  context,
  selectedContextItem,
  getQText
) {
  let askText = '';
  let answer = '';
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let inputRequirementStr = null;
  let customConstraints = "";

  // Common P2 factors
  const getFactors = () => {
    const f1 = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
    const f2 = Math.floor(Math.random() * 5) + 2; // 2 to 6
    return { f1, f2, p: f1 * f2 };
  };

  if (activeVariant === 'foundation_related_multiplication_fact') {
    const { f1, f2, p } = getFactors();
    
    const divFact = `${p} ÷ ${f1} = ${f2}`;
    
    if (isShort) {
      answer = `${p}`;
      askText = `If ${divFact}, ${f2} x ${f1} = [?]`;
      customConstraints = `Accept only "${p}" as the correct answer.`;
    } else {
      answer = `${f2} x ${f1} = ${p}`; // also accepts f1 x f2 = p
      askText = `If ${divFact}, which multiplication equation belongs to the same fact family?`;
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${f2} x ${f1} = ${p}", "${p} x ${f1} = ${f2}", "${f2} x ${p} = ${f1}", "${f1} x ${f1} = ${p}"
        2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
      `;
    }

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "The total product is", "expectedAnswer": "${p}" },\n      { "label": "So the related multiplication equation is", "expectedAnswer": "${answer}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'foundation_related_division_fact') {
    const { f1, f2, p } = getFactors();
    
    const multFact = `${f1} x ${f2} = ${p}`;
    
    if (isShort) {
      answer = `${f2}`;
      askText = `If ${multFact}, ${p} ÷ ${f1} = [?]`;
      customConstraints = `Accept only "${f2}" as the correct answer.`;
    } else {
      answer = `${p} ÷ ${f1} = ${f2}`;
      askText = `If ${multFact}, which division equation belongs to the same fact family?`;
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${answer}", "${f1} ÷ ${f2} = ${p}", "${p} ÷ ${p} = ${f1}", "${f2} ÷ ${f1} = ${p}"
        2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
      `;
    }

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "The total product to divide is", "expectedAnswer": "${p}" },\n      { "label": "So the related division equation is", "expectedAnswer": "${answer}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'foundation_fact_family_missing_equation') {
    const { f1, f2, p } = getFactors();
    
    let eq1, eq2, eq3;
    let typeMissing = Math.floor(Math.random() * 4);
    
    if (typeMissing === 0) {
      eq1 = `${f1} x ${f2} = ${p}`;
      eq2 = `${p} ÷ ${f1} = ${f2}`;
      eq3 = `${p} ÷ ${f2} = ${f1}`;
      answer = `${f2} x ${f1} = ${p}`;
    } else if (typeMissing === 1) {
      eq1 = `${f2} x ${f1} = ${p}`;
      eq2 = `${p} ÷ ${f1} = ${f2}`;
      eq3 = `${p} ÷ ${f2} = ${f1}`;
      answer = `${f1} x ${f2} = ${p}`;
    } else if (typeMissing === 2) {
      eq1 = `${f1} x ${f2} = ${p}`;
      eq2 = `${f2} x ${f1} = ${p}`;
      eq3 = `${p} ÷ ${f2} = ${f1}`;
      answer = `${p} ÷ ${f1} = ${f2}`;
    } else {
      eq1 = `${f1} x ${f2} = ${p}`;
      eq2 = `${f2} x ${f1} = ${p}`;
      eq3 = `${p} ÷ ${f1} = ${f2}`;
      answer = `${p} ÷ ${f2} = ${f1}`;
    }

    // Edge case if f1 == f2 (e.g. 2x2=4), then the missing equation is identical to one of them.
    // Let's avoid perfect squares for this variant to not confuse the AI.
    let _f1 = f1, _f2 = f2, _p = p;
    while (_f1 === _f2) {
      _f1 = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
      _f2 = Math.floor(Math.random() * 5) + 2;
      _p = _f1 * _f2;
    }
    
    if (_f1 !== f1) {
      if (typeMissing === 0) {
        eq1 = `${_f1} x ${_f2} = ${_p}`; eq2 = `${_p} ÷ ${_f1} = ${_f2}`; eq3 = `${_p} ÷ ${_f2} = ${_f1}`; answer = `${_f2} x ${_f1} = ${_p}`;
      } else if (typeMissing === 1) {
        eq1 = `${_f2} x ${_f1} = ${_p}`; eq2 = `${_p} ÷ ${_f1} = ${_f2}`; eq3 = `${_p} ÷ ${_f2} = ${_f1}`; answer = `${_f1} x ${_f2} = ${_p}`;
      } else if (typeMissing === 2) {
        eq1 = `${_f1} x ${_f2} = ${_p}`; eq2 = `${_f2} x ${_f1} = ${_p}`; eq3 = `${_p} ÷ ${_f2} = ${_f1}`; answer = `${_p} ÷ ${_f1} = ${_f2}`;
      } else {
        eq1 = `${_f1} x ${_f2} = ${_p}`; eq2 = `${_f2} x ${_f1} = ${_p}`; eq3 = `${_p} ÷ ${_f1} = ${_f2}`; answer = `${_p} ÷ ${_f2} = ${_f1}`;
      }
    }

    askText = `Here is a fact family with one missing equation:\n\n${eq1}\n${eq2}\n${eq3}\n\nWhat is the missing equation?`;

    if (isStructure) {
      const isMultiplication = answer.includes('x');
      const opName = isMultiplication ? 'multiplication' : 'division';
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "The missing equation must be a", "expectedAnswer": "${opName} equation" },\n      { "label": "The missing equation is", "expectedAnswer": "${answer}" }\n    ]\n  }`;
    }

    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "${answer}", "Incorrect Variation 1", "Incorrect Variation 2", "Incorrect Variation 3"
      2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
    `;
  }
  
  const systemPrompt = `You are an expert Primary 2 mathematics educator in Singapore.
Your task is to generate a JSON response for a mathematical question based on the provided logic.
Follow the exact instructions and use the provided inputs.
${getFormatInstructions(visualEngineStr, inputRequirementStr)}
`;

  const aiPrompt = `Generate a ${zodType} question for ${levelName} Math, ${topic} - Multiplication/Division Relationship.
Difficulty: ${zodDiff}

CRITICAL INSTRUCTIONS:
1. You MUST use the EXACT string below as the \`questionText\` in your JSON output. Do NOT rephrase it into a word problem.
Exact Question Text: ${askText}

2. You MUST use the EXACT string below as the \`finalAnswer\` in your JSON output.
Exact Final Answer: ${answer}

3. You MUST provide a step-by-step mathematical explanation in the \`solutionSteps\` field.
4. You MUST provide a helpful tip in the \`hint\` field.

${customConstraints}

${getFormatInstructions(visualEngineStr, inputRequirementStr)}`;

  return { systemPrompt, aiPrompt };
};
