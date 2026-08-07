export const standardLogic = function (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let askText = '';
  let questionStemConstraint = '';
  let answer = '';
  let customConstraints = '';
  let inputRequirementStr = null;

  const table = Math.floor(Math.random() * 8) + 2; // 2 to 9
  const factor = Math.floor(Math.random() * 8) + 2; // 2 to 9
  const total = table * factor;

  if (activeVariant === 'standard_single_step_multiplication') {
    const rate = Math.floor(Math.random() * 8) + 2;
    const quantity = Math.floor(Math.random() * 8) + 2;
    const totalValue = rate * quantity;

    const scenarios = [
      {
        shortText: `${context.name} buys ${quantity} ${selectedContextItem} at $${rate} each. How much does ${context.name} pay altogether?`,
        structuredInstruct: `buys exactly ${quantity} ${selectedContextItem} at $${rate} each. Ask the student to find the total cost.`,
        unitFormat: `$${totalValue}`
      },
      {
        shortText: `${context.name} has ${quantity} bags of ${selectedContextItem}. Each bag weighs ${rate} kg. What is the total mass of the bags?`,
        structuredInstruct: `has ${quantity} bags of ${selectedContextItem}, where each bag weighs exactly ${rate} kg. Ask the student to find the total mass.`,
        unitFormat: `${totalValue} kg`
      },
      {
        shortText: `${context.name} has ${quantity} pieces of string. Each piece is ${rate} cm long. What is the total length of the strings?`,
        structuredInstruct: `has ${quantity} pieces of string, where each piece is exactly ${rate} cm long. Ask the student to find the total length.`,
        unitFormat: `${totalValue} cm`
      },
      {
        shortText: `${context.name} spends ${rate} hours reading every week. How many hours does ${context.name} spend reading in ${quantity} weeks?`,
        structuredInstruct: `spends exactly ${rate} hours on a hobby (like reading or playing) every week. Ask the student to find the total hours spent over ${quantity} weeks.`,
        unitFormat: `${totalValue} hours`
      },
      {
        shortText: `${context.name} buys ${quantity} bottles of juice. Each bottle contains ${rate} litres. What is the total volume of juice?`,
        structuredInstruct: `buys ${quantity} bottles of juice, where each bottle contains exactly ${rate} litres. Ask the student to find the total volume.`,
        unitFormat: `${totalValue} litres`
      }
    ];

    const selectedScenario = scenarios[Math.floor(Math.random() * scenarios.length)];

    if (isStructure) {
      askText = `Write a creative, concise word problem (under 3 sentences) about ${context.name} and ${selectedContextItem}. The story must logically require the student to multiply ${quantity} by ${rate}. The final question must ask the student to find the total amount.`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;

      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1", expectedAnswer: `${quantity} x ${rate} = ${totalValue}` },
          { label: "Step 2 (Final Answer)", expectedAnswer: selectedScenario.unitFormat }
        ]
      });
      answer = selectedScenario.unitFormat;
      customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${quantity} x ${rate} = ${totalValue}".
- For MULTI_STEP_INPUT Step 2 (Final Answer), the expectedAnswer MUST exactly be "${selectedScenario.unitFormat}".`;
    } else {
      askText = selectedScenario.shortText;
      questionStemConstraint = `- The question stem must clearly state exactly: "${askText}". DO NOT add extra sentences.`;
      answer = selectedScenario.unitFormat;

      if (isMCQ) {
        // Just extract numeric values for distractors, appending the unit
        const isPrefix = selectedScenario.unitFormat.startsWith('$');
        const formatWithUnit = (val) => isPrefix ? `$${val}` : `${val} ${selectedScenario.unitFormat.split(' ')[1] || ''}`.trim();
        
        const d1 = formatWithUnit(rate + quantity);
        const d2 = formatWithUnit(totalValue + rate);
        const d3 = formatWithUnit(totalValue > quantity ? totalValue - quantity : totalValue + quantity + 1);
        
        customConstraints = `
- The correct option must exactly be "${answer}".
- The wrong options must include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CARELESS_CALCULATION", and "${d3}" to "CARELESS_CALCULATION".`;
      }
    }
  }
  else if (activeVariant === 'standard_packaging_division') {
    const containerSize = Math.floor(Math.random() * 8) + 2;
    const numContainers = Math.floor(Math.random() * 8) + 2;
    const totalItems = containerSize * numContainers;

    if (isStructure) {
      askText = `Write a creative, concise word problem (under 3 sentences) about ${context.name} and ${selectedContextItem}. The story must logically require the student to divide a total of ${totalItems} into equal groups of ${containerSize}. The final question must ask the student to find the number of groups.`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;

      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1", expectedAnswer: `${totalItems} ÷ ${containerSize} = ${numContainers}` },
          { label: "Step 2 (Final Answer)", expectedAnswer: String(numContainers) }
        ]
      });
      answer = String(numContainers);
      customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${totalItems} ÷ ${containerSize} = ${numContainers}".
- For MULTI_STEP_INPUT Step 2 (Final Answer), the expectedAnswer MUST exactly be "${numContainers}".`;
    } else {
      askText = `Pack ${totalItems} ${selectedContextItem} equally into boxes of ${containerSize}. How many boxes are needed?`;
      questionStemConstraint = `- The question stem must clearly ask: "${askText}".`;
      answer = String(numContainers);

      if (isMCQ) {
        const d1 = String(totalItems - containerSize);
        const d2 = String(numContainers + 1);
        const d3 = String(numContainers > 1 ? numContainers - 1 : numContainers + 2);
        customConstraints = `
- The correct option must exactly be "${answer}".
- The wrong options must include: "${d1}", "${d2}", and "${d3}".`;
      }
    }
  }
  else if (activeVariant === 'standard_fact_families') {
    const isMultiplicationGiven = Math.random() > 0.5;

    if (isStructure) {
      if (isMultiplicationGiven) {
        askText = `Write a creative, concise word problem (under 3 sentences) about ${context.name} and ${selectedContextItem}. First, state that ${context.name} has ${table} groups of ${factor}. Then, ask the student to find how many items would be in each group if the total was divided equally into ${table} groups instead.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1 (First Equation)", expectedAnswer: `${table} x ${factor} = ${total}` },
            { label: "Step 2 (Fact Family Answer)", expectedAnswer: String(factor) }
          ]
        });
        answer = String(factor);
        customConstraints = `
- For MULTI_STEP_INPUT Step 1 (First Equation), the expectedAnswer MUST exactly be "${table} x ${factor} = ${total}".
- For MULTI_STEP_INPUT Step 2 (Fact Family Answer), the expectedAnswer MUST exactly be "${factor}".`;
      } else {
        askText = `Write a creative, concise word problem (under 3 sentences) about ${context.name} and ${selectedContextItem}. First, state that ${context.name} shares ${total} items equally into ${table} groups. Then, ask the student to find how many groups there would be if they instead put exactly ${table} items into each group.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1 (First Equation)", expectedAnswer: `${total} ÷ ${table} = ${factor}` },
            { label: "Step 2 (Fact Family Answer)", expectedAnswer: String(factor) }
          ]
        });
        answer = String(factor);
        customConstraints = `
- For MULTI_STEP_INPUT Step 1 (First Equation), the expectedAnswer MUST exactly be "${total} ÷ ${table} = ${factor}".
- For MULTI_STEP_INPUT Step 2 (Fact Family Answer), the expectedAnswer MUST exactly be "${factor}".`;
      }
    } else {
      if (isMultiplicationGiven) {
        askText = `If ${table} x ${factor} = ${total}, what is ${total} ÷ ${table}?`;
        answer = String(factor);
      } else {
        askText = `If ${total} ÷ ${table} = ${factor}, what is ${factor} x ${table}?`;
        answer = String(total);
      }

      questionStemConstraint = `- The question stem must strictly be exactly: "${askText}".`;
      customConstraints = `- isNotationVariant: true. You are generating a pure notation question.`;

      if (isMCQ) {
        const d1 = String(Number(answer) > 5 ? Number(answer) - 1 : Number(answer) + 1);
        const d2 = String(Number(answer) + 2);
        const d3 = String(isMultiplicationGiven ? table : factor);
        customConstraints += `
- The correct option must exactly be "${answer}".
- The wrong options must include: "${d1}", "${d2}", and "${d3}".`;
      }
    }
  }
  else if (activeVariant === 'standard_scaling_quantities') {
    const multiplier = Math.floor(Math.random() * 7) + 2;
    const baseQuantity = Math.floor(Math.random() * 8) + 2;
    const scaledQuantity = multiplier * baseQuantity;

    const askForMultiplier = Math.random() > 0.5;

    if (isStructure) {
      if (askForMultiplier) {
        askText = `Write a creative, concise word problem (under 3 sentences) about ${context.name} and ${selectedContextItem}. State that ${context.name} has ${baseQuantity} items, and a friend has ${scaledQuantity} items. Ask the student to find how many times as many items the friend has compared to ${context.name}.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1", expectedAnswer: `${scaledQuantity} ÷ ${baseQuantity} = ${multiplier}` },
            { label: "Step 2 (Final Answer)", expectedAnswer: String(multiplier) }
          ]
        });
        answer = String(multiplier);
        customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${scaledQuantity} ÷ ${baseQuantity} = ${multiplier}".
- For MULTI_STEP_INPUT Step 2 (Final Answer), the expectedAnswer MUST exactly be "${multiplier}".`;
      } else {
        askText = `Write a creative, concise word problem (under 3 sentences) about ${context.name} and ${selectedContextItem}. State that ${context.name} has ${baseQuantity} items, and a friend has ${multiplier} times as many. Ask the student to find how many items the friend has.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1", expectedAnswer: `${multiplier} x ${baseQuantity} = ${scaledQuantity}` },
            { label: "Step 2 (Final Answer)", expectedAnswer: String(scaledQuantity) }
          ]
        });
        answer = String(scaledQuantity);
        customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${multiplier} x ${baseQuantity} = ${scaledQuantity}".
- For MULTI_STEP_INPUT Step 2 (Final Answer), the expectedAnswer MUST exactly be "${scaledQuantity}".`;
      }
    } else {
      if (askForMultiplier) {
        askText = `${context.name} has ${baseQuantity} ${selectedContextItem}. A friend has ${scaledQuantity} ${selectedContextItem}. How many times as many ${selectedContextItem} does the friend have?`;
        questionStemConstraint = `- The question stem must clearly ask: "${askText}".`;
        answer = String(multiplier);

        if (isMCQ) {
          const d1 = String(multiplier + 1);
          const d2 = String(multiplier > 1 ? multiplier - 1 : multiplier + 2);
          const d3 = String(scaledQuantity - baseQuantity); // subtraction mistake
          customConstraints = `
- The correct option must exactly be "${answer}".
- The wrong options must include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CARELESS_CALCULATION", "${d2}" to "CARELESS_CALCULATION", and "${d3}" to "CONCEPTUAL_ERROR".`;
        }
      } else {
        askText = `${context.name} has ${baseQuantity} ${selectedContextItem}. A friend has ${multiplier} times as many ${selectedContextItem}. How many ${selectedContextItem} does the friend have?`;
        questionStemConstraint = `- The question stem must clearly ask: "${askText}".`;
        answer = String(scaledQuantity);

        if (isMCQ) {
          const d1 = String(baseQuantity + multiplier);
          const d2 = String(scaledQuantity + baseQuantity);
          const d3 = String(scaledQuantity - baseQuantity);
          customConstraints = `
- The correct option must exactly be "${answer}".
- The wrong options must include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CARELESS_CALCULATION", and "${d3}" to "CARELESS_CALCULATION".`;
        }
      }
    }
  }
  else if (activeVariant === 'standard_remainder_trap') {
    const divisor = Math.floor(Math.random() * 6) + 4; // 4 to 9
    const multiplier = Math.floor(Math.random() * 6) + 4; // 4 to 9
    const correctTarget = divisor * multiplier;

    if (isStructure) {
      askText = `Write a creative, concise word problem (under 3 sentences) about ${context.name} and ${selectedContextItem}. The story must state that ${context.name} has between ${correctTarget - 2} and ${correctTarget + 2} items, and they can be shared perfectly into ${divisor} equal groups with none left over. Ask the student to find the exact number of items.`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;

      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1 (Equation)", expectedAnswer: `${multiplier} x ${divisor} = ${correctTarget}` },
          { label: "Step 2 (Final Answer)", expectedAnswer: String(correctTarget) }
        ]
      });
      answer = String(correctTarget);
      customConstraints = `
- For MULTI_STEP_INPUT Step 1 (Equation), the expectedAnswer MUST exactly be "${multiplier} x ${divisor} = ${correctTarget}". Do NOT use division.
- For MULTI_STEP_INPUT Step 2 (Final Answer), the expectedAnswer MUST exactly be "${correctTarget}".`;
    } else {
      if (isMCQ) {
        askText = `Which of these numbers can be divided equally into ${divisor} groups?`;
        questionStemConstraint = `- The question stem must clearly ask exactly: "${askText}". DO NOT add any word problem context.`;
        answer = String(correctTarget);

        const d1 = String(correctTarget + 1);
        const d2 = String(correctTarget - 2);
        const d3 = String(divisor * (multiplier - 1) + 2);

        customConstraints = `
- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CONCEPTUAL_ERROR", and "${d3}" to "CONCEPTUAL_ERROR".`;
      } else {
        askText = `Give an example of a number between ${correctTarget - 2} and ${correctTarget + 2} that can be divided equally into ${divisor} groups.`;
        questionStemConstraint = `- The question stem must clearly ask exactly: "${askText}".`;
        answer = String(correctTarget);
      }
    }
  }

  const aiPrompt = `
You are an expert mathematics educator creating content for Primary 3 students.

Topic: ${topic}
Difficulty: ${difficulty}
Variant: ${activeVariant}

Your task is to generate a JSON response following this strict schema:
${getFormatInstructions(JSON.stringify({ componentToRender: "NONE", componentData: { hideVisual: true } }), inputRequirementStr)}

CRITICAL INSTRUCTIONS:
${questionStemConstraint}
- The final answer MUST exactly match: "${answer}".
- The solutionSteps should clearly explain how to get the answer.
${customConstraints}
`;

  return { aiPrompt };
};
