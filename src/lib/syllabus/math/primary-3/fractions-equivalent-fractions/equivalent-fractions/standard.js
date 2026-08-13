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
  let visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: { hideVisual: true } });
  let inputRequirementStr = null;
  let customConstraints = "";
  let hint = "";
  let solutionSteps = [];

  const getGCD = (a, b) => b === 0 ? a : getGCD(b, a % b);

  if (activeVariant === 'standard_simplest_form_2') {
    let num, denom;
    do {
      num = Math.floor(Math.random() * 4) + 1; 
      denom = num + Math.floor(Math.random() * 4) + 1; 
    } while (getGCD(num, denom) !== 1);

    const mult = 2; 
    const newDenom = denom * mult;
    const newNum = num * mult;
    
    answer = `${num}/${denom}`;

    visualEngineStr = JSON.stringify({
      componentToRender: "FRACTION_EQUIVALENCE",
      componentData: {
        before: { num: newNum, denom: newDenom },
        after: { num: "?", denom: "?" },
        operator: "÷",
        factor: String(mult)
      }
    });

    if (isStructure) {
      askText = `Write a word problem where ${context.name} eats ${newNum} out of ${newDenom} pieces of a ${selectedContextItem}. Ask to express the fraction of the ${selectedContextItem} eaten in its simplest form.`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1", expectedAnswer: `${newNum}÷2=${num}` },
          { label: "Step 2", expectedAnswer: `${newDenom}÷2=${denom}` },
          { label: "Simplest Form", expectedAnswer: answer }
        ]
      });
    } else {
      askText = getQText(
        `Write a word problem where ${context.name} eats ${newNum} out of ${newDenom} pieces of a ${selectedContextItem}. Ask to express the fraction in its simplest form.`,
        `Express ${newNum}/${newDenom} in its simplest form.`
      );
    }

    hint = `Divide both the numerator and the denominator by 2.`;
    solutionSteps = [
      `${newNum} ÷ 2 = ${num}`,
      `${newDenom} ÷ 2 = ${denom}`,
      `The simplest form is ${answer}.`
    ];
    
    customConstraints = `
    1. Provide exactly these 4 options in MCQ: "${answer}", "${newNum-1}/${newDenom-1}", "${num}/${denom+1}", "${num+1}/${denom}"
    2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
    3. If type is SHORT_QUESTION, do not generate a word problem, output pure notation as requested.
    - isNotationVariant: true (for Short Question only)
    `;
  }
  else if (activeVariant === 'standard_simplest_form_3_4') {
    let num, denom;
    do {
      num = Math.floor(Math.random() * 4) + 1; 
      denom = num + Math.floor(Math.random() * 4) + 1; 
    } while (getGCD(num, denom) !== 1);

    const mult = Math.floor(Math.random() * 2) + 3; // 3 or 4
    const newDenom = denom * mult;
    const newNum = num * mult;
    
    answer = `${num}/${denom}`;

    visualEngineStr = JSON.stringify({
      componentToRender: "FRACTION_EQUIVALENCE",
      componentData: {
        before: { num: newNum, denom: newDenom },
        after: { num: "?", denom: "?" },
        operator: "÷",
        factor: String(mult)
      }
    });

    if (isStructure) {
      askText = `Write a word problem where ${context.name} has a ${selectedContextItem} cut into ${newDenom} equal pieces, and eats ${newNum} of them. Ask to express the fraction of the ${selectedContextItem} eaten in its simplest form.`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1", expectedAnswer: `${newNum}÷${mult}=${num}` },
          { label: "Step 2", expectedAnswer: `${newDenom}÷${mult}=${denom}` },
          { label: "Simplest Form", expectedAnswer: answer }
        ]
      });
    } else {
      askText = getQText(
        `Write a word problem where ${context.name} eats ${newNum} out of ${newDenom} pieces of a ${selectedContextItem}. Ask to express the fraction in its simplest form.`,
        `Simplify ${newNum}/${newDenom}.`
      );
    }

    hint = `Divide both the numerator and the denominator by ${mult}.`;
    solutionSteps = [
      `${newNum} ÷ ${mult} = ${num}`,
      `${newDenom} ÷ ${mult} = ${denom}`,
      `The simplest form is ${answer}.`
    ];
    
    customConstraints = `
    1. Provide exactly these 4 options in MCQ: "${answer}", "${num}/${denom+1}", "${num+1}/${denom}", "${newNum}/${denom}"
    2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
    `;
  }
  else if (activeVariant === 'standard_scaling_reverse') {
    const num = Math.floor(Math.random() * 3) + 1; 
    const denom = num + Math.floor(Math.random() * 3) + 1; 
    const mult = Math.floor(Math.random() * 2) + 2; // 2 or 3
    const newDenom = denom * mult;
    const newNum = num * mult;
    
    const isMissingNum = Math.random() > 0.5;
    
    answer = `${newNum}/${newDenom}`;

    visualEngineStr = JSON.stringify({
      componentToRender: "FRACTION_EQUIVALENCE",
      componentData: {
        before: { num: num, denom: denom },
        after: { num: isMissingNum ? "?" : newNum, denom: isMissingNum ? newDenom : "?" },
        operator: "x",
        factor: "?"
      }
    });

    if (isStructure) {
      if (isMissingNum) {
        askText = `Write a word problem where ${context.name} wants to eat ${num}/${denom} of a ${selectedContextItem}. The ${selectedContextItem} is cut into ${newDenom} pieces in total. Ask what fraction of the ${selectedContextItem} must be eaten, written out of ${newDenom}.`;
        
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1", expectedAnswer: `${newDenom}÷${denom}=${mult}` },
            { label: "Step 2", expectedAnswer: `${num}x${mult}=${newNum}` },
            { label: "Equivalent fraction", expectedAnswer: answer }
          ]
        });
      } else {
        askText = `Write a word problem where ${context.name} wants to eat ${num}/${denom} of a ${selectedContextItem}. They must eat exactly ${newNum} pieces to get their portion. Ask what fraction of the ${selectedContextItem} they must eat, written with a numerator of ${newNum}.`;
        
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1", expectedAnswer: `${newNum}÷${num}=${mult}` },
            { label: "Step 2", expectedAnswer: `${denom}x${mult}=${newDenom}` },
            { label: "Equivalent fraction", expectedAnswer: answer }
          ]
        });
      }
    } else {
      if (isMissingNum) {
        askText = getQText(
          `Write a word problem where ${context.name} eats ${num}/${denom} of a ${selectedContextItem} cut into ${newDenom} pieces. Ask what fraction is eaten out of ${newDenom}.`,
          `Express ${num}/${denom} as an equivalent fraction with a denominator of ${newDenom}.`
        );
      } else {
        askText = getQText(
          `Write a word problem where ${context.name} eats ${num}/${denom} of a ${selectedContextItem}. They eat exactly ${newNum} pieces. Ask what fraction is eaten, written with a numerator of ${newNum}.`,
          `Express ${num}/${denom} as an equivalent fraction with a numerator of ${newNum}.`
        );
      }
    }

    if (isMissingNum) {
      hint = `Find what number the denominator was multiplied by to get ${newDenom}, then multiply the numerator by the same number.`;
      solutionSteps = [
        `Since ${denom} x ${mult} = ${newDenom}`,
        `Multiply the numerator by ${mult}: ${num} x ${mult} = ${newNum}`,
        `The equivalent fraction is ${answer}.`
      ];
      customConstraints = `
      1. Provide exactly these 4 options in MCQ: "${answer}", "${num}/${newDenom}", "${newNum-1 > 0 ? newNum-1 : newNum+2}/${newDenom}", "${newNum+1}/${newDenom}"
      2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
      `;
    } else {
      hint = `Find what number the numerator was multiplied by to get ${newNum}, then multiply the denominator by the same number.`;
      solutionSteps = [
        `Since ${num} x ${mult} = ${newNum}`,
        `Multiply the denominator by ${mult}: ${denom} x ${mult} = ${newDenom}`,
        `The equivalent fraction is ${answer}.`
      ];
      customConstraints = `
      1. Provide exactly these 4 options in MCQ: "${answer}", "${newNum}/${denom}", "${newNum}/${newDenom-1 > 0 ? newDenom-1 : newDenom+2}", "${newNum}/${newDenom+1}"
      2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
      `;
    }
  }
  else if (activeVariant === 'standard_true_false') {
    const num1 = Math.floor(Math.random() * 3) + 1; 
    const denom1 = num1 + Math.floor(Math.random() * 2) + 1; 
    
    const isEquivalent = Math.random() > 0.5;
    
    let num2, denom2;
    if (isEquivalent) {
      const mult = Math.floor(Math.random() * 2) + 2; 
      num2 = num1 * mult;
      denom2 = denom1 * mult;
    } else {
      const mult = Math.floor(Math.random() * 2) + 2; 
      num2 = num1 * mult;
      denom2 = (denom1 * mult) + 1; 
    }
    
    answer = isEquivalent ? "Yes" : "No";

    const gcd1 = getGCD(num1, denom1);
    const gcd2 = getGCD(num2, denom2);
    const simpNum1 = num1 / gcd1;
    const simpDenom1 = denom1 / gcd1;
    const simpNum2 = num2 / gcd2;
    const simpDenom2 = denom2 / gcd2;

    if (isStructure) {
      askText = `Write a word problem where ${context.name} eats ${num1}/${denom1} of their ${selectedContextItem}, and a friend eats ${num2}/${denom2} of their identical ${selectedContextItem}. Ask if they ate the same amount, and require a Yes or No answer.`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: `Simplify ${num1}/${denom1}`, expectedAnswer: `${simpNum1}/${simpDenom1}` },
          { label: `Simplify ${num2}/${denom2}`, expectedAnswer: `${simpNum2}/${simpDenom2}` },
          { label: "Are they the same? (Yes/No)", expectedAnswer: answer }
        ]
      });
    } else {
      askText = getQText(
        `Write a word problem where ${context.name} eats ${num1}/${denom1} of their ${selectedContextItem}, and a friend eats ${num2}/${denom2} of their identical ${selectedContextItem}. Did they eat the same amount? Write Yes or No.`,
        `Are ${num1}/${denom1} and ${num2}/${denom2} equivalent? Write Yes or No.`
      );
    }

    hint = `Simplify both fractions to see if they are exactly the same.`;
    solutionSteps = [
      `${num1}/${denom1} simplified is ${simpNum1}/${simpDenom1}`,
      `${num2}/${denom2} simplified is ${simpNum2}/${simpDenom2}`,
      isEquivalent ? `They are the same, so the answer is Yes.` : `They are different, so the answer is No.`
    ];
    
    const genFakeEq = () => {
      const n = Math.floor(Math.random() * 2) + 1;
      const d = n + Math.floor(Math.random() * 2) + 1;
      return `${n}/${d} = ${n*2}/${(d*2)+1}`;
    };
    const correctEq = isEquivalent ? `${num1}/${denom1} = ${num2}/${denom2}` : `${num1}/${denom1} = ${num1*2}/${denom1*2}`;
    const op1 = correctEq;
    const op2 = genFakeEq();
    const op3 = genFakeEq();
    const op4 = genFakeEq();

    customConstraints = `
    1. For MCQ, DO NOT use Yes/No. Instead, provide exactly these 4 options representing statements to choose from: "${op1}", "${op2}", "${op3}", "${op4}"
    2. The questionText for MCQ MUST ask: "Which of these statements is true?"
    3. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
    4. For Short Answer and Structured, the finalAnswer MUST be exactly "Yes" or "No".
    `;
  }
  else if (activeVariant === 'standard_simplest_missing_step') {
    const num = Math.floor(Math.random() * 3) + 1; 
    const denom = num + Math.floor(Math.random() * 3) + 1; 
    const mult = Math.floor(Math.random() * 2) + 2; // 2 or 3
    const newDenom = denom * mult;
    const newNum = num * mult;
    
    answer = String(num);

    visualEngineStr = JSON.stringify({
      componentToRender: "FRACTION_EQUIVALENCE",
      componentData: {
        before: { num: newNum, denom: newDenom },
        after: { num: "?", denom: denom },
        operator: "÷",
        factor: "?"
      }
    });

    if (isStructure) {
      askText = `Write a word problem where ${context.name} eats ${newNum} out of ${newDenom} pieces of a ${selectedContextItem}. To express this in its simplest form with a denominator of ${denom}, ask what the numerator must be.`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1", expectedAnswer: `${newDenom}÷${denom}=${mult}` },
          { label: "Step 2", expectedAnswer: `${newNum}÷${mult}=${num}` },
          { label: "Missing Numerator", expectedAnswer: answer }
        ]
      });
    } else {
      askText = getQText(
        `Write a word problem where ${context.name} eats ${newNum} out of ${newDenom} pieces of a ${selectedContextItem}. Ask what the numerator must be to express this with a denominator of ${denom}.`,
        `Find the missing number: ${newNum}/${newDenom} = [ ]/${denom}.`
      );
    }

    hint = `Find out what the denominator was divided by to get ${denom}, then divide the numerator by the same number.`;
    solutionSteps = [
      `Since ${newDenom} ÷ ${mult} = ${denom}`,
      `Divide the numerator by ${mult}: ${newNum} ÷ ${mult} = ${num}`,
      `The missing number is ${num}.`
    ];
    
    customConstraints = `
    1. Provide exactly these 4 options in MCQ: "${num}", "${num+1}", "${num-1 > 0 ? num-1 : num+2}", "${newNum}"
    2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
    `;
  }
  else {
    throw new Error("Variant logic not implemented: " + activeVariant);
  }

  let questionStemConstraint = "";
  if (askText.includes("Write a word problem")) {
    questionStemConstraint = `- The questionText must be generated based on this prompt: "${askText}". Ensure the story uses proper English sentences, is creative, and makes mathematical sense.`;
  } else {
    questionStemConstraint = `- The questionText MUST be EXACTLY this mathematical instruction: "${askText}". Do NOT generate a word problem or story.`;
  }

  const aiPrompt = `
CRITICAL INSTRUCTION: You MUST use the EXACT strings provided below for hint, finalAnswer, and solutionSteps. DO NOT rephrase them!
CRITICAL INSTRUCTION: \`solutionSteps\` MUST be a single string formatted with \\n, NOT an array of objects. 
CRITICAL INSTRUCTION: You MUST include the exact \`inputRequirement\` block shown in the schema below in your final JSON output.
${customConstraints}

${questionStemConstraint}

GENERATE:
finalAnswer = \`${answer}\`
hint = \`${hint}\`
solutionSteps = \`${solutionSteps.map((step, index) => `${index + 1}. ${step}`).join('\\n')}\`

${getFormatInstructions(visualEngineStr, inputRequirementStr)}
`;

  return {
    aiPrompt,
    visualEngineStr,
    inputRequirementStr
  };
};
