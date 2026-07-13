export const advancedLogic = function (
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

  if (activeVariant === 'advanced_inverse_chain') {
    // ( ? x a ) ÷ b = c
    // So ? x a = b * c
    // So ? = (b * c) / a
    
    // Let's build it backwards.
    // final answer = ans (between 2 to 10)
    let ans, a, b, c, prod;
    let found = false;
    
    while (!found) {
      ans = Math.floor(Math.random() * 9) + 2; // 2 to 10
      a = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
      prod = ans * a; // product of the parenthesis
      
      b = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
      
      // We need (prod) / b to be an integer (c)
      if (prod % b === 0) {
        c = prod / b;
        
        // Ensure c is a reasonable number (e.g. <= 10) to stay within P2 bounds
        // Well, division facts in P2 usually have quotient <= 10.
        if (c >= 1 && c <= 10) {
          found = true;
        }
      }
    }

    answer = `${ans}`;
    askText = `${context.name} is thinking of a number.\n\nWhen ${context.name} multiplies the number by ${a}, and then divides the result by ${b}, the answer is ${c}.\n\nWhat is the number?`;

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Working 1:", "expectedAnswer": "${prod}" },\n      { "label": "Working 2:", "expectedAnswer": "${answer}" },\n      { "label": "Final Answer:", "expectedAnswer": "${answer}" }\n    ]\n  }`;
    }

    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "${answer}", "${Math.max(1, ans - 1)}", "${ans + 1}", "${ans + 2}"
      2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
    `;
  }
  else if (activeVariant === 'advanced_two_equations_unknowns') {
    // A x B = p
    // A ÷ B = q
    // This is mathematically: B * q = A. So (B * q) * B = p. B^2 * q = p.
    
    // Let's generate it using valid P2 division facts:
    // A ÷ B = q  (so B is divisor in [2, 3, 4, 5, 10], q <= 10)
    // A = B * q
    // Then p = A * B = B * q * B.
    // p must be <= 100 to stay within P2 bounds.
    
    let A, B, q, p;
    let found = false;
    
    while (!found) {
      B = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
      q = Math.floor(Math.random() * 5) + 1; // 1 to 5 to keep A small
      A = B * q;
      p = A * B;
      
      // Strict P2 scope: A x B requires A <= 10 (since B is a P2 factor).
      // A ÷ B = q requires A <= 100 and q <= 10.
      if (A <= 10) {
        found = true;
      }
    }
    
    const shapeA = ["Star", "Heart", "Square", "Circle", "Triangle"][Math.floor(Math.random() * 5)];
    let shapeB = ["Star", "Heart", "Square", "Circle", "Triangle"][Math.floor(Math.random() * 5)];
    while (shapeB === shapeA) shapeB = ["Star", "Heart", "Square", "Circle", "Triangle"][Math.floor(Math.random() * 5)];

    answer = `${shapeA} = ${A}, ${shapeB} = ${B}`;
    
    askText = `I have two secret shapes: ${shapeA} and ${shapeB}.\n\n${shapeA} x ${shapeB} = ${p}\n${shapeA} ÷ ${shapeB} = ${q}\n\nWhat are the values of ${shapeA} and ${shapeB}?`;

    let pairs = [];
    for (let i = 1; i <= Math.sqrt(p); i++) {
      if (p % i === 0 && (p / i) <= 10) {
        pairs.push(`${i} and ${p / i}`);
      }
    }
    const pairsStr = pairs.join(', ');

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "List the number pairs (up to 10) that multiply to make ${p}, starting with the smallest. (Format: e.g. 1 and 8, 2 and 4)", "expectedAnswer": "${pairsStr}" },\n      { "label": "Test your pairs. Which pair divides to make ${q}?", "expectedAnswer": "${Math.max(A, B)} and ${Math.min(A, B)}" },\n      { "label": "So, what are the values of ${shapeA} and ${shapeB}?", "expectedAnswer": "${answer}" }\n    ]\n  }`;
    }

    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "${shapeA} = ${A}, ${shapeB} = ${B}", "${shapeA} = ${B}, ${shapeB} = ${A}", "${shapeA} = ${Math.max(1, A - 1)}, ${shapeB} = ${B}", "${shapeA} = ${A + B}, ${shapeB} = ${B}"
      2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
    `;
  }
  else if (activeVariant === 'advanced_balance_inverse_sides') {
    // a x b = c ÷ d
    // Let's generate a valid multiplication a x b = p (p <= 50)
    // Then c = p * d. To keep c <= 100, we need p * d <= 100.
    
    let a, b, p, c, d;
    let found = false;
    
    while (!found) {
      const factors = getFactors();
      a = factors.f1;
      b = factors.f2;
      p = factors.p;
      
      d = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
      c = p * d;
      
      // Strict P2 scope: c ÷ d = p requires the quotient p <= 10.
      // So a * b = p must be <= 10.
      if (p <= 10 && c <= 100) {
        found = true;
      }
    }

    const isLeftMissing = Math.random() > 0.5;
    
    if (isLeftMissing) {
      answer = `${a}`;
      askText = `${context.name} multiplies a number by ${b}.\n\nThe answer is the same as ${c} divided by ${d}.\n\nWhat is the number?`;
      
      if (isStructure) {
        inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Step 1:", "expectedAnswer": "${p}" },\n      { "label": "Step 2 (The number):", "expectedAnswer": "${answer}" }\n    ]\n  }`;
      }
    } else {
      answer = `${c}`;
      askText = `${context.name} multiplies ${a} by ${b}.\n\nThe answer is the same as dividing a secret number by ${d}.\n\nWhat is the secret number?`;
      
      if (isStructure) {
        inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Step 1:", "expectedAnswer": "${p}" },\n      { "label": "Step 2 (The secret number):", "expectedAnswer": "${answer}" }\n    ]\n  }`;
      }
    }

    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "${answer}", "${Math.max(1, parseInt(answer) - d)}", "${parseInt(answer) + d}", "${p}"
      2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
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
