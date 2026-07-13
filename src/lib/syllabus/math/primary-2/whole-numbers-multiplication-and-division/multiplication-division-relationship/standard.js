export const standardLogic = function (
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

  if (activeVariant === 'standard_inverse_balance') {
    const { f1, f2, p } = getFactors();
    
    // ? x f1 = p OR f2 x ? = p
    const isFirstUnknown = Math.random() > 0.5;
    const eq = isFirstUnknown ? `[?] x ${f1} = ${p}` : `${f2} x [?] = ${p}`;
    answer = isFirstUnknown ? `${f2}` : `${f1}`;
    
    const knownFactor = isFirstUnknown ? f1 : f2;
    
    askText = `Find the missing number using division: ${eq}`;

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Write the related division equation to solve this", "expectedAnswer": "${p} ÷ ${knownFactor} = ${answer}" },\n      { "label": "So, the missing number is", "expectedAnswer": "${answer}" }\n    ]\n  }`;
    }

    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "${answer}", "${answer - 1}", "${answer + 1}", "${knownFactor}"
      2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
    `;
  }
  else if (activeVariant === 'standard_division_to_multiplication_unknown') {
    const { f1, f2, p } = getFactors();
    
    // ? ÷ f1 = f2 OR ? ÷ f2 = f1
    const useF1Divisor = Math.random() > 0.5;
    const divisor = useF1Divisor ? f1 : f2;
    const quotient = useF1Divisor ? f2 : f1;
    
    answer = `${p}`;
    askText = `Find the missing number using multiplication: [?] ÷ ${divisor} = ${quotient}`;

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Write the related multiplication equation to solve this", "expectedAnswer": "${quotient} x ${divisor} = ${p}" },\n      { "label": "So, the missing number is", "expectedAnswer": "${answer}" }\n    ]\n  }`;
    }

    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "${answer}", "${answer - divisor}", "${answer + divisor}", "${Math.max(1, quotient - 1) * divisor}"
      2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
      3. Accept either "${quotient} x ${divisor} = ${p}" or "${divisor} x ${quotient} = ${p}" as correct in the structure step.
    `;
  }
  else if (activeVariant === 'standard_identify_false_related_fact') {
    let _f1, _f2, _p;
    do {
      _f1 = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
      _f2 = Math.floor(Math.random() * 5) + 2;
      _p = _f1 * _f2;
    } while (_f1 === _f2); // Avoid perfect squares so we have 4 distinct valid equations

    // Valid ones:
    // f1 x f2 = p
    // f2 x f1 = p
    // p ÷ f1 = f2
    // p ÷ f2 = f1

    // False one:
    const falseType = Math.floor(Math.random() * 4);
    let correctEq = "";
    if (falseType === 0) {
      answer = `${_p} x ${_f1} = ${_f2}`;
      correctEq = `${_p} ÷ ${_f1} = ${_f2}`;
    }
    else if (falseType === 1) {
      answer = `${_p} x ${_f2} = ${_f1}`;
      correctEq = `${_p} ÷ ${_f2} = ${_f1}`;
    }
    else if (falseType === 2) {
      answer = `${_f1} ÷ ${_p} = ${_f2}`;
      correctEq = `${_f1} x ${_f2} = ${_p}`; // 5 x 6 = 30 instead of 5 ÷ 30 = 6
    }
    else {
      answer = `${_f2} ÷ ${_p} = ${_f1}`;
      correctEq = `${_f2} x ${_f1} = ${_p}`;
    }

    const validEq = `${_f1} x ${_f2} = ${_p}`;
    
    let optionsList = [
      answer,
      `${_f2} x ${_f1} = ${_p}`,
      `${_p} ÷ ${_f1} = ${_f2}`,
      `${_p} ÷ ${_f2} = ${_f1}`
    ].sort(() => Math.random() - 0.5);

    askText = `Look at this equation: ${validEq}\n\nWhich of the following equations is FALSE?`;
    
    if (!isMCQ) {
      askText += `\n\n- ${optionsList[0]}\n- ${optionsList[1]}\n- ${optionsList[2]}\n- ${optionsList[3]}`;
    }

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "The equation that is FALSE is", "expectedAnswer": "${answer}" },\n      { "label": "To make it true, what should that equation be?", "expectedAnswer": "${correctEq}" }\n    ]\n  }`;
    }

    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "${answer}", "${_f2} x ${_f1} = ${_p}", "${_p} ÷ ${_f1} = ${_f2}", "${_p} ÷ ${_f2} = ${_f1}"
      2. Set defectMap for the valid fact family equations to "CONCEPTUAL_ERROR".
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
