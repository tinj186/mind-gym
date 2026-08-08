import { generateMultiplicationAlgorithmTables, generateLongDivisionAlgorithmTables } from '@/lib/utils/math-html-utils';

export const standardLogic = (difficulty, activeVariant, type, context, selectedContextItem, getFormatInstructions) => {
  const { name: firstName } = context;
  const isMCQ = type === 'MCQ';
  const isStructure = type === 'Structured';

  let askText = "";
  let questionStemConstraint = "";
  let customConstraints = "";
  let solutionStepsConstraint = "";
  let visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: { hideVisual: true } });
  let inputRequirementStr = null;
  let answer = "";

  if (activeVariant === 'standard_complex_renaming_mult') {
    // 3-digit multiplication requiring regrouping across both tens and hundreds.
    const multiplier = Math.floor(Math.random() * 8) + 2; // 2 to 9
    
    // To ensure carrying in ones and tens:
    const minOnes = Math.ceil(10 / multiplier);
    const ones = Math.floor(Math.random() * (9 - minOnes + 1)) + minOnes;
    const carryOnes = Math.floor((ones * multiplier) / 10);
    
    const minTens = Math.ceil((10 - carryOnes) / multiplier);
    const tens = Math.floor(Math.random() * (9 - Math.max(0, minTens) + 1)) + Math.max(0, minTens);
    
    const hundreds = Math.floor(Math.random() * 9) + 1;

    const multiplicand = hundreds * 100 + tens * 10 + ones;
    const product = multiplicand * multiplier;
    answer = String(product);

    if (isStructure) {
      askText = `Write a creative, concise word problem (under 3 sentences) using the character ${firstName}. The story must involve saving or spending $${multiplicand} every month (or similar time period). The final question must ask how much is saved or spent in ${multiplier} months.`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1 (Equation)", expectedAnswer: `${multiplicand} x ${multiplier} = ${product}` },
          { label: "Step 2 (Final Answer)", expectedAnswer: String(product) }
        ]
      });
      customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${multiplicand} x ${multiplier} = ${product}".
- For MULTI_STEP_INPUT Step 2 (Final Answer), the expectedAnswer MUST exactly be "${product}".`;
    } else if (isMCQ) {
      askText = `Solve ${multiplicand} x ${multiplier}.`;
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      
      const wrongProductForgotAddCarry = (hundreds * multiplier * 100) + (tens * multiplier * 10) + ((ones * multiplier) % 10);
      const d1 = String(wrongProductForgotAddCarry);
      const d2 = String(product - 100);
      const d3 = String(product + 10);
      customConstraints = `
- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CARELESS_CALCULATION", and "${d3}" to "CARELESS_CALCULATION".`;
    } else {
      askText = `Multiply ${multiplicand} by ${multiplier}.`;
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
  separate steps using the exact characters \\n inside the string for line breaks inside the JSON string.`;

  } else if (activeVariant === 'standard_division_remainder') {
    // 3-digit division where the final answer yields a quotient and a remainder.
    const divisor = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const quotient = Math.floor(Math.random() * (999 / divisor - 10)) + 10;
    const maxRemainder = divisor - 1;
    const remainder = Math.floor(Math.random() * maxRemainder) + 1; // 1 to divisor-1
    const dividend = quotient * divisor + remainder;
    answer = `${quotient} R ${remainder}`;

    if (isStructure) {
      askText = `Write a creative, concise word problem (under 3 sentences) using the character ${firstName} and the item '${selectedContextItem}'. The story must involve sharing or packing ${dividend} '${selectedContextItem}' equally among ${divisor} children/groups. The final question must ask how many does each get, and how many are left over.`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1 (Equation)", expectedAnswer: `${dividend} ÷ ${divisor} = ${quotient} R ${remainder}` },
          { label: "Step 2 (Final Answer)", expectedAnswer: answer }
        ]
      });
      customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${dividend} ÷ ${divisor} = ${quotient} R ${remainder}".
- For MULTI_STEP_INPUT Step 2 (Final Answer), the expectedAnswer MUST exactly be "${answer}".`;
    } else if (isMCQ) {
      askText = `Divide ${dividend} by ${divisor}. What is the quotient and remainder?`;
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      
      const wrongQ1 = quotient + 1;
      const wrongR1 = Math.max(0, remainder - 2);
      const wrongQ2 = quotient - 1;
      const wrongR2 = divisor - remainder;
      
      const d1 = `${wrongQ1} R ${wrongR1}`;
      const d2 = `${wrongQ2} R ${wrongR2}`;
      const d3 = `${quotient} R ${wrongR1}`;
      customConstraints = `
- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CARELESS_CALCULATION", "${d2}" to "CARELESS_CALCULATION", and "${d3}" to "CARELESS_CALCULATION".`;
    } else {
      askText = `${dividend} ÷ ${divisor} = ___ R ___`;
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "LONG_DIVISION",
      componentData: { dividend: String(dividend), divisor: String(divisor), quotient: "?" }
    });

    const step1HTML = generateLongDivisionAlgorithmTables(dividend, divisor, quotient, remainder);
    solutionStepsConstraint = `
- You MUST explicitly generate a \`solutionSteps\` and a \`hint\`.
- For \`solutionSteps\`, provide EXACTLY ONE step:
  1. "Solving the division:" followed by this exact HTML: \n${step1HTML}
  CRITICAL: DO NOT modify the HTML strings. Use them EXACTLY as provided above!
  separate steps using the exact characters \\n inside the string for line breaks inside the JSON string.`;

  } else if (activeVariant === 'standard_multiplicative_comparison') {
    // Multiplicative Comparison (Finding the Larger Quantity)
    const multiplier = Math.floor(Math.random() * 4) + 2; // 2 to 5 times
    const baseQuantity = Math.floor(Math.random() * 90) + 10; // 10 to 99
    const product = baseQuantity * multiplier;
    answer = String(product);

    if (isStructure) {
      askText = `Write a creative, concise word problem (under 3 sentences) using two characters, ${firstName} and someone else, and the item '${selectedContextItem}'. The story must state that ${firstName} has ${baseQuantity} '${selectedContextItem}'. The second person has ${multiplier} times as many. The final question must ask how many '${selectedContextItem}' the second person has.`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1 (Equation)", expectedAnswer: `${baseQuantity} x ${multiplier} = ${product}` },
          { label: "Step 2 (Final Answer)", expectedAnswer: String(product) }
        ]
      });
      customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${baseQuantity} x ${multiplier} = ${product}".
- For MULTI_STEP_INPUT Step 2 (Final Answer), the expectedAnswer MUST exactly be "${product}".`;
    } else if (isMCQ) {
      askText = `If a blue string is ${baseQuantity} cm long and a red string is ${multiplier} times as long, how long is the red string?`;
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      
      const d1 = String(baseQuantity + multiplier);
      const d2 = String(product + baseQuantity);
      const d3 = String(product - 10);
      customConstraints = `
- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CONCEPTUAL_ERROR", and "${d3}" to "CARELESS_CALCULATION".`;
    } else {
      askText = `Number A is ${baseQuantity}. Number B is ${multiplier} times as large as Number A. What is Number B?`;
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
    }

    const bars = [
      { label: "A", parts: [String(baseQuantity)] },
      { label: "B", parts: Array(multiplier).fill("?") }
    ];
    const items = [String(baseQuantity), "x", String(multiplier), "?"];
    
    visualEngineStr = JSON.stringify({
      componentToRender: "MULTI_COMPONENT",
      componentData: {
        className: "!flex-col",
        components: [
          {
            componentToRender: "BAR_MODEL",
            componentData: { modelType: "COMPARISON", bars: bars, className: "w-full max-w-sm min-w-[250px]", isStatic: false }
          },
          {
            componentToRender: "VERTICAL_ALGORITHM",
            componentData: { items }
          }
        ]
      }
    });

    const [step1HTML, step2HTML] = generateMultiplicationAlgorithmTables(baseQuantity, multiplier);
    solutionStepsConstraint = `
- You MUST explicitly generate a \`solutionSteps\` and a \`hint\`.
- For \`solutionSteps\`, provide EXACTLY TWO steps:
  1. "Setting up the vertical algorithm:" followed by this exact HTML: \n${step1HTML}
  2. "Solving the multiplication:" followed by this exact HTML: \n${step2HTML}
  CRITICAL: DO NOT modify the HTML strings. Use them EXACTLY as provided above!
  separate steps using the exact characters \\n inside the string for line breaks inside the JSON string.`;

  } else if (activeVariant === 'standard_zero_in_quotient') {
    // 3-digit division where the tens digit of the dividend is smaller than the divisor.
    const divisor = Math.floor(Math.random() * 5) + 3; // 3 to 7
    const qHundreds = Math.floor(Math.random() * 3) + 1; // 1 to 3
    const qTens = 0; // Forced zero
    const qOnes = Math.floor(Math.random() * 8) + 1; // 1 to 8
    
    const quotient = qHundreds * 100 + qTens * 10 + qOnes;
    const remainder = Math.floor(Math.random() * divisor); // Can be 0 or more
    const dividend = quotient * divisor + remainder;
    
    answer = remainder > 0 ? `${quotient} R ${remainder}` : String(quotient);

    if (isStructure) {
      askText = `Write a creative, concise word problem (under 3 sentences) using the character ${firstName} and the item '${selectedContextItem}'. The story must involve packing ${dividend} '${selectedContextItem}' equally into ${divisor} containers. The final question must ask how many are in each container. (If there is a remainder, mention finding the left over too).`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1 (Equation)", expectedAnswer: remainder > 0 ? `${dividend} ÷ ${divisor} = ${quotient} R ${remainder}` : `${dividend} ÷ ${divisor} = ${quotient}` },
          { label: "Step 2 (Final Answer)", expectedAnswer: answer }
        ]
      });
      customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${remainder > 0 ? `${dividend} ÷ ${divisor} = ${quotient} R ${remainder}` : `${dividend} ÷ ${divisor} = ${quotient}`}".
- For MULTI_STEP_INPUT Step 2 (Final Answer), the expectedAnswer MUST exactly be "${answer}".`;
    } else if (isMCQ) {
      askText = `What is the quotient when ${dividend} is divided by ${divisor}?`;
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      
      const wrongQ1 = qHundreds * 10 + qOnes; // Missing zero
      const wrongQ2 = quotient + 10;
      const wrongQ3 = quotient + 1;
      
      const d1 = remainder > 0 ? `${wrongQ1} R ${remainder}` : String(wrongQ1);
      const d2 = remainder > 0 ? `${wrongQ2} R ${remainder}` : String(wrongQ2);
      const d3 = remainder > 0 ? `${wrongQ3} R ${remainder}` : String(wrongQ3);
      customConstraints = `
- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CARELESS_CALCULATION", and "${d3}" to "CARELESS_CALCULATION".`;
    } else {
      askText = `${dividend} ÷ ${divisor} = ___`;
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "LONG_DIVISION",
      componentData: { dividend: String(dividend), divisor: String(divisor), quotient: "?" }
    });

    const step1HTML = generateLongDivisionAlgorithmTables(dividend, divisor, quotient, remainder);
    solutionStepsConstraint = `
- You MUST explicitly generate a \`solutionSteps\` and a \`hint\`.
- For \`solutionSteps\`, provide EXACTLY ONE step:
  1. "Solving the division:" followed by this exact HTML: \n${step1HTML}
  CRITICAL: DO NOT modify the HTML strings. Use them EXACTLY as provided above!
  separate steps using the exact characters \\n inside the string for line breaks inside the JSON string.`;

  } else if (activeVariant === 'standard_multistep_grouping') {
    // Combine a given total before dividing into groups.
    const divisor = Math.floor(Math.random() * 6) + 2; // 2 to 7
    const quotient = Math.floor(Math.random() * 40) + 12; // 12 to 51
    const totalItems = quotient * divisor; // Exact division
    
    // Split total into two groups
    const part1 = Math.floor(totalItems * 0.4) + Math.floor(Math.random() * (totalItems * 0.2));
    const part2 = totalItems - part1;
    answer = String(quotient);

    if (isStructure) {
      askText = `Write a creative, concise word problem (under 4 sentences) using the character ${firstName} and two different types of '${selectedContextItem}'. The story must state that ${firstName} has ${part1} of the first type and ${part2} of the second type. They pack ALL of them into boxes/groups of ${divisor}. The final question must ask how many boxes/groups are needed.`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1 (Find Total)", expectedAnswer: `${part1} + ${part2} = ${totalItems}` },
          { label: "Step 2 (Find Groups)", expectedAnswer: `${totalItems} ÷ ${divisor} = ${quotient}` },
          { label: "Step 3 (Final Answer)", expectedAnswer: String(quotient) }
        ]
      });
      customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${part1} + ${part2} = ${totalItems}".
- For MULTI_STEP_INPUT Step 2, the expectedAnswer MUST exactly be "${totalItems} ÷ ${divisor} = ${quotient}".
- For MULTI_STEP_INPUT Step 3 (Final Answer), the expectedAnswer MUST exactly be "${quotient}".`;
    } else if (isMCQ) {
      askText = `A boy has ${part1} red balls and ${part2} blue balls. He puts them equally into bags of ${divisor}. How many bags does he need?`;
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      
      const d1 = String(Math.floor(part1 / divisor) + Math.floor(part2 / divisor));
      const d2 = String(quotient + 2);
      const d3 = String(Math.abs(quotient - 10));
      customConstraints = `
- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CARELESS_CALCULATION", and "${d3}" to "CARELESS_CALCULATION".`;
    } else {
      askText = `Add ${part1} and ${part2}, then divide by ${divisor}.`;
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
            componentData: { modelType: "PART_WHOLE", parts: parts, whole: String(totalItems), className: "w-full max-w-sm min-w-[250px]", isStatic: false }
          },
          {
            componentToRender: "LONG_DIVISION",
            componentData: { dividend: String(totalItems), divisor: String(divisor), quotient: "?" }
          }
        ]
      }
    });

    const step1HTML = generateLongDivisionAlgorithmTables(totalItems, divisor, quotient, 0);
    solutionStepsConstraint = `
- You MUST explicitly generate a \`solutionSteps\` and a \`hint\`.
- For \`solutionSteps\`, provide EXACTLY TWO steps:
  1. "Step 1: Find the total amount:\\n${part1} + ${part2} = ${totalItems}"
  2. "Step 2: Solve the division:" followed by this exact HTML: \n${step1HTML}
  CRITICAL: DO NOT modify the HTML strings. Use them EXACTLY as provided above!
  separate steps using the exact characters \\n inside the string for line breaks inside the JSON string.`;
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
};
