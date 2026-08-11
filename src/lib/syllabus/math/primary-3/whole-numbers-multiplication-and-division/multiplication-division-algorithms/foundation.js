import { BarModelBuilder } from '@/lib/builders/BarModelBuilder';
import { generateMultiplicationAlgorithmTables, generateLongDivisionAlgorithmTables } from '@/lib/utils/math-html-utils';

export function foundationLogic(difficulty, activeVariant, type, context, selectedContextItem, getFormatInstructions) {
  const isMCQ = type === 'MCQ';
  const isStructure = type === 'Structured';
  const firstName = context.name[0] || context.name;

  let askText = "";
  let answer = "";
  let customConstraints = "";
  let visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: { hideVisual: true } });
  let inputRequirementStr = null;
  let questionStemConstraint = "";
  let solutionStepsConstraint = "";

  if (activeVariant === 'foundation_direct_multiplication') {
    const isThreeDigit = Math.random() > 0.5;
    const multiplier = Math.floor(Math.random() * 3) + 2; 
    
    const maxDigit = Math.floor(9 / multiplier);
    
    let ones = Math.floor(Math.random() * (maxDigit + 1));
    let tens = Math.floor(Math.random() * maxDigit) + 1; 
    let hundreds = isThreeDigit ? Math.floor(Math.random() * maxDigit) + 1 : 0;
    
    const multiplicand = hundreds * 100 + tens * 10 + ones;
    const product = multiplicand * multiplier;
    answer = String(product);

    if (isStructure) {
      askText = `Write a creative, concise word problem (under 3 sentences) using the character ${firstName} and the item '${selectedContextItem}'. The story must involve ${multiplier} groups (e.g., boxes, bags, days) with exactly ${multiplicand} '${selectedContextItem}' in each group. The final question must ask for the total amount altogether.`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1 (Equation)", expectedAnswer: `${multiplicand} x ${multiplier} = ${product}` },
          { label: "Step 2 (Final Answer)", expectedAnswer: String(product) }
        ]
      });
      customConstraints = "";
    } else if (isMCQ) {
      askText = `Solve: ${multiplicand} x ${multiplier}`;
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      
      const d1 = String(multiplicand + multiplier); 
      const d2 = String(product + 10); 
      const d3 = String(product - multiplier); 
      customConstraints = `
- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CARELESS_CALCULATION", and "${d3}" to "CARELESS_CALCULATION".`;
    } else {
      askText = `Solve: ${multiplicand} x ${multiplier}`;
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
    }

    const items = [String(multiplicand), "x", String(multiplier), "?"];
    const parts = Array(multiplier).fill(String(multiplicand));
    
    visualEngineStr = JSON.stringify({
      componentToRender: "MULTI_COMPONENT",
      componentData: {
        className: "!flex-col",
        components: [
          {
            componentToRender: "BAR_MODEL",
            componentData: { modelType: "PART_WHOLE", parts: parts, whole: "?", className: "w-full max-w-sm min-w-[250px]", isStatic: true }
          },
          {
            componentToRender: "VERTICAL_ALGORITHM",
            componentData: { items }
          }
        ]
      }
    });

    const [step1HTML, step2HTML] = generateMultiplicationAlgorithmTables(multiplicand, multiplier);
    solutionStepsConstraint = `
- You MUST explicitly generate a \`solutionSteps\` and a \`hint\`.
- For \`solutionSteps\`, provide EXACTLY TWO steps:
  1. "Setting up the vertical algorithm:" followed by this exact HTML: \n${step1HTML}
  2. "Solving the multiplication:" followed by this exact HTML: \n${step2HTML}
  CRITICAL: DO NOT modify the HTML strings. Use them EXACTLY as provided above!
  separate steps using the exact characters \\n inside the string.for line breaks inside the JSON string.`;


  } else if (activeVariant === 'foundation_direct_division') {
    const divisor = Math.floor(Math.random() * 3) + 2; 
    const maxDigit = Math.floor(9 / divisor);
    
    let qOnes = Math.floor(Math.random() * (maxDigit + 1));
    let qTens = Math.floor(Math.random() * (maxDigit + 1));
    let qHundreds = Math.floor(Math.random() * maxDigit) + 1; 
    
    const quotient = qHundreds * 100 + qTens * 10 + qOnes;
    const dividend = quotient * divisor;
    answer = String(quotient);

    if (isStructure) {
      askText = `Write a creative, concise word problem (under 3 sentences) using the character ${firstName} and the item '${selectedContextItem}'. The story must involve sharing, dividing, or arranging a total of ${dividend} '${selectedContextItem}' equally into ${divisor} groups or containers. The final question must ask how many are in each group.`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1 (Equation)", expectedAnswer: `${dividend} ÷ ${divisor} = ${quotient}` },
          { label: "Step 2 (Final Answer)", expectedAnswer: String(quotient) }
        ]
      });
      customConstraints = "";
    } else if (isMCQ) {
      askText = `Divide ${dividend} by ${divisor}. What is the quotient?`;
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      
      const d1 = String(dividend * divisor); 
      const d2 = String(quotient + 10);
      const d3 = String(Math.abs(quotient - divisor));
      customConstraints = `
- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CARELESS_CALCULATION", and "${d3}" to "CARELESS_CALCULATION".`;
    } else {
      askText = `Divide ${dividend} by ${divisor}. What is the quotient?`;
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
    }

    const parts = Array(divisor).fill("?");
    visualEngineStr = JSON.stringify({
      componentToRender: "MULTI_COMPONENT",
      componentData: {
        className: "!flex-col",
        components: [
          {
            componentToRender: "BAR_MODEL",
            componentData: { modelType: "PART_WHOLE", parts: parts, whole: String(dividend), className: "w-full max-w-sm min-w-[250px]", isStatic: true }
          },
          {
            componentToRender: "LONG_DIVISION",
            componentData: { dividend: String(dividend), divisor: String(divisor), quotient: "?" }
          }
        ]
      }
    });

    const step1HTML = generateLongDivisionAlgorithmTables(dividend, divisor, quotient);
    solutionStepsConstraint = `
- You MUST explicitly generate a \`solutionSteps\` and a \`hint\`.
- For \`solutionSteps\`, provide EXACTLY ONE step:
  1. "Solving the division:" followed by this exact HTML: \n${step1HTML}
  CRITICAL: DO NOT modify the HTML strings. Use them EXACTLY as provided above!
  separate steps using the exact characters \\n inside the string.for line breaks inside the JSON string.`;

  } else if (activeVariant === 'foundation_single_step_renaming_mult') {
    const multiplier = Math.floor(Math.random() * 4) + 2; 
    const isThreeDigit = Math.random() > 0.5;
    
    const minOnes = Math.ceil(10 / multiplier);
    const ones = Math.floor(Math.random() * (9 - minOnes + 1)) + minOnes; 
    const carry = Math.floor((ones * multiplier) / 10);
    
    const maxTens = Math.floor((9 - carry) / multiplier);
    const tens = maxTens > 0 ? (Math.floor(Math.random() * maxTens) + 1) : 0;
    
    const maxHundreds = Math.floor(9 / multiplier);
    let hundreds = 0;
    if (isThreeDigit && maxHundreds > 0) {
      hundreds = Math.floor(Math.random() * maxHundreds) + 1;
    }

    const multiplicand = hundreds * 100 + tens * 10 + ones;
    const product = multiplicand * multiplier;
    answer = String(product);

    if (isStructure) {
      askText = `Write a creative, concise word problem (under 3 sentences) using the character ${firstName} and the item '${selectedContextItem}'. The story must involve buying ${multiplier} sets/groups, where each set has ${multiplicand} '${selectedContextItem}' (or costs $${multiplicand}). The final question must ask for the total amount.`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1 (Equation)", expectedAnswer: `${multiplicand} x ${multiplier} = ${product}` },
          { label: "Step 2 (Final Answer)", expectedAnswer: String(product) }
        ]
      });
      customConstraints = "";
    } else if (isMCQ) {
      askText = `Find the product of ${multiplicand} and ${multiplier}.`;
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      
      const wrongProductForgotCarry = (hundreds * multiplier * 100) + (tens * multiplier * 10) + ((ones * multiplier) % 10);
      const d1 = String(wrongProductForgotCarry);
      const d2 = String(product - 10);
      const d3 = String(product + 10);
      customConstraints = `
- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CARELESS_CALCULATION", and "${d3}" to "CARELESS_CALCULATION".`;
    } else {
      askText = `${multiplicand} x ${multiplier} = ___`;
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
    }

    const items = [String(multiplicand), "x", String(multiplier), "?"];
    visualEngineStr = JSON.stringify({
      componentToRender: "VERTICAL_ALGORITHM",
      componentData: { items }
    });

    const [step1HTML, step2HTML] = generateMultiplicationAlgorithmTables(multiplicand, multiplier);
    solutionStepsConstraint = `
- You MUST explicitly generate a \`solutionSteps\` and a \`hint\`.
- For \`solutionSteps\`, provide EXACTLY TWO steps:
  1. "Setting up the vertical algorithm:" followed by this exact HTML: \n${step1HTML}
  2. "Solving the multiplication:" followed by this exact HTML: \n${step2HTML}
  CRITICAL: DO NOT modify the HTML strings. Use them EXACTLY as provided above!
  separate steps using the exact characters \\n inside the string.for line breaks inside the JSON string.`;
  } else if (activeVariant === 'foundation_missing_factor') {
    const multiplier = Math.floor(Math.random() * 8) + 2; 
    const missingFactor = Math.floor(Math.random() * 11) + 2; 
    const product = multiplier * missingFactor;
    answer = String(missingFactor);

    if (isStructure) {
      askText = `Write a creative, concise word problem (under 3 sentences) using the character ${firstName} and the item '${selectedContextItem}'. The story must involve packing or organizing a total of ${product} '${selectedContextItem}' into an unknown number of groups, where each group holds exactly ${multiplier} '${selectedContextItem}'. The final question must ask how many groups were needed in total.`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1 (Equation)", expectedAnswer: `${product} ÷ ${multiplier} = ${missingFactor}` },
          { label: "Step 2 (Final Answer)", expectedAnswer: String(missingFactor) }
        ]
      });
      customConstraints = "";
    } else if (isMCQ) {
      askText = `Which number multiplied by ${multiplier} gives ${product}?`;
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      
      const d1 = String(product + multiplier);
      const d2 = String(Math.abs(product - multiplier));
      const d3 = String(missingFactor + 1);
      customConstraints = `
- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CONCEPTUAL_ERROR", and "${d3}" to "CARELESS_CALCULATION".`;
    } else {
      askText = `___ x ${multiplier} = ${product}`;
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
    }

    let parts;
    if (missingFactor <= 4) {
      parts = Array(missingFactor).fill(String(multiplier));
    } else {
      parts = [String(multiplier), String(multiplier), "...", String(multiplier)];
    }
    
    visualEngineStr = JSON.stringify({
      componentToRender: "MULTI_COMPONENT",
      componentData: {
        className: "!flex-col",
        components: [
          {
            componentToRender: "BAR_MODEL",
            componentData: { modelType: "PART_WHOLE", parts: parts, whole: String(product), className: "w-full max-w-sm min-w-[250px]", isStatic: true }
          },
          {
            componentToRender: "LONG_DIVISION",
            componentData: { dividend: String(product), divisor: String(multiplier), quotient: "?" }
          }
        ]
      }
    });

    const step1HTML = generateLongDivisionAlgorithmTables(product, multiplier, missingFactor);
    solutionStepsConstraint = `
- You MUST explicitly generate a \`solutionSteps\` and a \`hint\`.
- For \`solutionSteps\`, provide EXACTLY ONE step:
  1. "Solving for the missing factor using division:" followed by this exact HTML: \n${step1HTML}
  CRITICAL: DO NOT modify the HTML strings. Use them EXACTLY as provided above!
  separate steps using the exact characters \\n inside the string.for line breaks inside the JSON string.`;

  } else if (activeVariant === 'foundation_zero_in_ones') {
    const isHundreds = Math.random() > 0.5;
    const baseMult = Math.floor(Math.random() * 9) + 1; 
    const multiplicand = isHundreds ? baseMult * 100 : baseMult * 10;
    const multiplier = Math.floor(Math.random() * 8) + 2; 
    const product = multiplicand * multiplier;
    answer = String(product);

    if (isStructure) {
      askText = `Write a creative, concise word problem (under 3 sentences) using the character ${firstName} and the item '${selectedContextItem}'. The story must involve ${multiplicand} '${selectedContextItem}' happening repeatedly for ${multiplier} instances (e.g., selling ${multiplicand} items per day for ${multiplier} days). The final question must ask for the total.`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1 (Equation)", expectedAnswer: `${multiplicand} x ${multiplier} = ${product}` },
          { label: "Step 2 (Final Answer)", expectedAnswer: String(product) }
        ]
      });
      customConstraints = "";
    } else if (isMCQ) {
      askText = `What is ${multiplicand} x ${multiplier}?`;
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      
      const rawProduct = baseMult * multiplier;
      const d1 = String(rawProduct * (isHundreds ? 10 : 1)); 
      const d2 = String(rawProduct * (isHundreds ? 1000 : 100)); 
      const d3 = String(multiplicand + multiplier); 
      
      const w1 = d1 === answer ? String(product + 10) : d1;
      const w2 = d2 === answer ? String(product - 10) : d2;
      const w3 = d3 === answer ? String(product + 100) : d3;
      
      customConstraints = `
- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${w1}", "${w2}", and "${w3}".
- DefectMap must map "${w1}" to "CONCEPTUAL_ERROR", "${w2}" to "CONCEPTUAL_ERROR", and "${w3}" to "CARELESS_CALCULATION".`;
    } else {
      askText = `${multiplicand} x ${multiplier} = ___`;
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
    }

    const items = [String(multiplicand), "x", String(multiplier), "?"];
    visualEngineStr = JSON.stringify({
      componentToRender: "VERTICAL_ALGORITHM",
      componentData: { items }
    });

    const [step1HTML, step2HTML] = generateMultiplicationAlgorithmTables(multiplicand, multiplier);
    solutionStepsConstraint = `
- You MUST explicitly generate a \`solutionSteps\` and a \`hint\`.
- For \`solutionSteps\`, provide EXACTLY TWO steps:
  1. "Setting up the vertical algorithm:" followed by this exact HTML: \n${step1HTML}
  2. "Solving the multiplication:" followed by this exact HTML: \n${step2HTML}
  CRITICAL: DO NOT modify the HTML strings. Use them EXACTLY as provided above!
  separate steps using the exact characters \\n inside the string.for line breaks inside the JSON string.`;
  }

  return {
    askText,
    questionStemConstraint,
    customConstraints,
    solutionStepsConstraint,
    visualEngineStr,
    inputRequirementStr,
    answer
  };
}
