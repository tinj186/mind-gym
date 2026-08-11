import { BarModelBuilder } from '@/lib/builders/BarModelBuilder';
import { generateMultiplicationAlgorithmTables, generateLongDivisionAlgorithmTables, generateAlgorithmTables } from '@/lib/utils/math-html-utils';

export const advancedLogic = (difficulty, activeVariant, type, context, selectedContextItem, getFormatInstructions) => {
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

  if (activeVariant === 'advanced_multiplicative_comparison_total') {
    const scenario = Math.floor(Math.random() * 3); // 0, 1, or 2

    if (scenario === 0) {
      // Find Total (Given Base and Multiplier)
      const baseValue = Math.floor(Math.random() * 80) + 120; // 120 to 199
      const multiplier = Math.floor(Math.random() * 5) + 3; // 3 to 7
      const siblingValue = baseValue * multiplier;
      const total = baseValue + siblingValue;
      answer = String(total);

      if (isStructure) {
        askText = `Write a creative, concise word problem (under 4 sentences) using the character ${firstName} and the item '${selectedContextItem}'. The story must state that ${firstName} has ${baseValue} items, and another person has ${multiplier} times as many. The final question must ask for the total number of items they have altogether.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
        
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Step 1 (Find the other person's amount)`, expectedAnswer: `${baseValue} x ${multiplier} = ${siblingValue}` },
            { label: `Step 2 (Find Total)`, expectedAnswer: `${baseValue} + ${siblingValue} = ${total}` },
            { label: "Step 3 (Final Answer)", expectedAnswer: String(total) }
          ]
        });
        customConstraints = `
- CRITICAL: DO NOT modify the \`visualEngine\` payload in the JSON template. You MUST return it EXACTLY as provided, keeping all "?" strings intact.`;
      } else if (isMCQ) {
        askText = `${firstName} has ${baseValue} ${selectedContextItem}. His brother has ${multiplier} times as many. How many ${selectedContextItem} do they have altogether?`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
        
        const d1 = String(siblingValue); 
        const d2 = String(total + 100);
        const d3 = String(baseValue * (multiplier - 1));
        customConstraints = `
- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CARELESS_CALCULATION", and "${d3}" to "CONCEPTUAL_ERROR".`;
      } else {
        askText = `If A = ${baseValue}, and B is ${multiplier} times A, what is A + B?`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      }

      visualEngineStr = JSON.stringify(BarModelBuilder.createComparison({
          whole: "?",
          bar1: { name: firstName, value: "?" },
          bar2: { name: "Brother", segments: String(multiplier), value: "?" },
          className: "w-full max-w-2xl mx-auto",
          isStatic: false
        }));

      const [multStep1, multStep2] = generateMultiplicationAlgorithmTables(baseValue, multiplier);
      const [addStep1, addStep2] = generateAlgorithmTables(baseValue, siblingValue, true);

      solutionStepsConstraint = `
- You MUST explicitly generate a \`solutionSteps\` and a \`hint\`.
- For \`solutionSteps\`, provide EXACTLY TWO steps:
  1. "Step 1: Find the other person's amount: ${baseValue} x ${multiplier} = ${siblingValue}" followed by this exact HTML: \\n${multStep2}
  2. "Step 2: Find the total amount: ${baseValue} + ${siblingValue} = ${total}" followed by this exact HTML: \\n${addStep2}
  CRITICAL: DO NOT modify the HTML strings. Use them EXACTLY as provided above!
  separate steps using the exact characters \\n inside the string for line breaks.`;

    } else if (scenario === 1) {
      // Find Base (Given Total and Multiplier)
      const baseValue = Math.floor(Math.random() * 80) + 120; // 120 to 199
      const multiplier = Math.floor(Math.random() * 5) + 3; // 3 to 7
      const totalUnits = 1 + multiplier;
      const total = baseValue * totalUnits;
      answer = String(baseValue);

      if (isStructure) {
        askText = `Write a creative, concise word problem (under 4 sentences) using the character ${firstName} and the item '${selectedContextItem}'. The story must state that ${firstName} and another person have ${total} items altogether. The other person has ${multiplier} times as many items as ${firstName}. The final question must ask for the number of items ${firstName} has.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
        
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Step 1 (Find Total Units)`, expectedAnswer: `1 + ${multiplier} = ${totalUnits}` },
            { label: `Step 2 (Find ${firstName}'s amount)`, expectedAnswer: `${total} ÷ ${totalUnits} = ${baseValue}` },
            { label: "Step 3 (Final Answer)", expectedAnswer: String(baseValue) }
          ]
        });
        customConstraints = `
- CRITICAL: DO NOT modify the \`visualEngine\` payload in the JSON template. You MUST return it EXACTLY as provided, keeping all "?" strings intact.`;
      } else if (isMCQ) {
        askText = `${firstName} and his brother have ${total} ${selectedContextItem} altogether. His brother has ${multiplier} times as many. How many ${selectedContextItem} does ${firstName} have?`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
        
        const d1 = String(total - multiplier); 
        const d2 = String(Math.floor(total / multiplier));
        const d3 = String(baseValue + 10);
        customConstraints = `
- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CONCEPTUAL_ERROR", and "${d3}" to "CARELESS_CALCULATION".`;
      } else {
        askText = `If A + B = ${total}, and B is ${multiplier} times A, what is A?`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      }

      visualEngineStr = JSON.stringify(BarModelBuilder.createComparison({
          whole: "?",
          bar1: { name: firstName, value: "?" },
          bar2: { name: "Brother", segments: String(multiplier), value: "?" },
          className: "w-full max-w-2xl mx-auto",
          isStatic: false
        }));

      const divStep = generateLongDivisionAlgorithmTables(total, totalUnits, baseValue, 0);

      solutionStepsConstraint = `
- You MUST explicitly generate a \`solutionSteps\` and a \`hint\`.
- For \`solutionSteps\`, provide EXACTLY TWO steps:
  1. "Step 1: Find total units: 1 + ${multiplier} = ${totalUnits}"
  2. "Step 2: Find ${firstName}'s amount by dividing the total:" followed by this exact HTML: \\n${divStep}
  CRITICAL: DO NOT modify the HTML strings. Use them EXACTLY as provided above!
  separate steps using the exact characters \\n inside the string for line breaks.`;

    } else {
      // Scenario 2: Find Multiplier (Given Base and Total)
      const baseValue = Math.floor(Math.random() * 6) + 4; // 4 to 9 (1-digit divisor)
      const multiplier = Math.floor(Math.random() * 80) + 40; // 40 to 119
      const siblingValue = baseValue * multiplier;
      const total = baseValue + siblingValue;
      answer = String(multiplier);

      if (isStructure) {
        askText = `Write a creative, concise word problem (under 4 sentences) using the character ${firstName} and the item '${selectedContextItem}'. The story must state that ${firstName} has ${baseValue} items. Altogether, ${firstName} and another person have ${total} items. The final question must ask how many times as many items the other person has compared to ${firstName}.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
        
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Step 1 (Find the other person's amount)`, expectedAnswer: `${total} - ${baseValue} = ${siblingValue}` },
            { label: `Step 2 (Find Multiplier)`, expectedAnswer: `${siblingValue} ÷ ${baseValue} = ${multiplier}` },
            { label: "Step 3 (Final Answer)", expectedAnswer: String(multiplier) }
          ]
        });
        customConstraints = `
- CRITICAL: DO NOT modify the \`visualEngine\` payload in the JSON template. You MUST return it EXACTLY as provided, keeping all "?" strings intact.`;
      } else if (isMCQ) {
        askText = `${firstName} has ${baseValue} ${selectedContextItem}. His brother has some ${selectedContextItem}. Altogether they have ${total} ${selectedContextItem}. How many times as many ${selectedContextItem} does his brother have compared to ${firstName}?`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
        
        const d1 = String(Math.floor(total / baseValue)); 
        const d2 = String(siblingValue);
        const d3 = String(multiplier + 1);
        customConstraints = `
- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CONCEPTUAL_ERROR", and "${d3}" to "CARELESS_CALCULATION".`;
      } else {
        askText = `If A = ${baseValue} and A + B = ${total}, B is how many times of A?`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      }

      visualEngineStr = JSON.stringify(BarModelBuilder.createComparison({
          whole: "?",
          bar1: { name: firstName, value: "?", layoutSize: "1" },
          bar2: { name: "Brother", segments: "?:" + baseValue, layoutSize: "4" }, // Visually larger with unknown segments
          className: "w-full max-w-2xl mx-auto",
          isStatic: false
        }));

      const [subStep1, subStep2] = generateAlgorithmTables(total, baseValue, false);
      const divStep = generateLongDivisionAlgorithmTables(siblingValue, baseValue, multiplier, 0);

      solutionStepsConstraint = `
- You MUST explicitly generate a \`solutionSteps\` and a \`hint\`.
- For \`solutionSteps\`, provide EXACTLY TWO steps:
  1. "Step 1: Find the other person's amount: ${total} - ${baseValue} = ${siblingValue}" followed by this exact HTML: \\n${subStep2}
  2. "Step 2: Find the multiplier by dividing:" followed by this exact HTML: \\n${divStep}
  CRITICAL: DO NOT modify the HTML strings. Use them EXACTLY as provided above!
  separate steps using the exact characters \\n inside the string for line breaks.`;
    }

  } else if (activeVariant === 'advanced_unitary_method') {
    const scenario = Math.floor(Math.random() * 2); // 0 or 1
    const unitPrice = Math.floor(Math.random() * 40) + 25; // 25 to 64
    const firstQuantity = Math.floor(Math.random() * 4) + 2; // 2 to 5
    const secondQuantity = Math.floor(Math.random() * 4) + 6; // 6 to 9
    const firstTotal = unitPrice * firstQuantity;
    const finalTotal = unitPrice * secondQuantity;
    
    if (scenario === 0) {
      // Find finalTotal
      answer = String(finalTotal);

      if (isStructure) {
        askText = `Write a creative, concise word problem (under 4 sentences) using the character ${firstName} and the item '${selectedContextItem}'. The story must state that ${firstQuantity} identical ${selectedContextItem} cost $${firstTotal}. The final question must ask for the cost of ${secondQuantity} such ${selectedContextItem}.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
        
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Step 1 (Find cost of 1 item)`, expectedAnswer: `${firstTotal} ÷ ${firstQuantity} = ${unitPrice}` },
            { label: `Step 2 (Find cost of ${secondQuantity} items)`, expectedAnswer: `${unitPrice} x ${secondQuantity} = ${finalTotal}` },
            { label: "Step 3 (Final Answer)", expectedAnswer: String(finalTotal) }
          ]
        });
        customConstraints = `
- CRITICAL: DO NOT modify the \`visualEngine\` payload in the JSON template. You MUST return it EXACTLY as provided, keeping all "?" strings intact.`;
      } else if (isMCQ) {
        askText = `${firstQuantity} bags of ${selectedContextItem} weigh ${firstTotal} kg. How much do ${secondQuantity} bags weigh?`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
        
        const d1 = String(firstTotal * secondQuantity); 
        const d2 = String(finalTotal + unitPrice);
        const d3 = String(unitPrice);
        customConstraints = `
- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CARELESS_CALCULATION", and "${d3}" to "CONCEPTUAL_ERROR".`;
      } else {
        askText = `If ${firstQuantity} units equal ${firstTotal}, what is the value of ${secondQuantity} units?`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      }

      visualEngineStr = JSON.stringify(BarModelBuilder.createComparison({
        whole: undefined,
        bar1: { name: `${firstQuantity} ${selectedContextItem}`, segments: String(firstQuantity), value: "?" },
        bar2: { name: `${secondQuantity} ${selectedContextItem}`, segments: String(secondQuantity), value: "?" },
        className: "w-full max-w-4xl mx-auto",
        isStatic: false
      }));

      const divStep = generateLongDivisionAlgorithmTables(firstTotal, firstQuantity, unitPrice, 0);
      const [multStep1, multStep2] = generateMultiplicationAlgorithmTables(unitPrice, secondQuantity);

      solutionStepsConstraint = `
- You MUST explicitly generate a \`solutionSteps\` and a \`hint\`.
- For \`solutionSteps\`, provide EXACTLY TWO steps:
  1. "Step 1: Find the value of 1 unit:" followed by this exact HTML: \\n${divStep}
  2. "Step 2: Find the value of ${secondQuantity} units: ${unitPrice} x ${secondQuantity} = ${finalTotal}" followed by this exact HTML: \\n${multStep2}
  CRITICAL: DO NOT modify the HTML strings. Use them EXACTLY as provided above!
  separate steps using the exact characters \\n inside the string for line breaks.`;
    } else {
      // Find secondQuantity
      answer = String(secondQuantity);

      if (isStructure) {
        askText = `Write a creative, concise word problem (under 4 sentences) using the character ${firstName} and the item '${selectedContextItem}'. The story must state that ${firstQuantity} identical ${selectedContextItem} cost $${firstTotal}. The final question must state that ${firstName} spent $${finalTotal} in total, and ask for the number of ${selectedContextItem} bought.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
        
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Step 1 (Find cost of 1 item)`, expectedAnswer: `${firstTotal} ÷ ${firstQuantity} = ${unitPrice}` },
            { label: `Step 2 (Find number of items)`, expectedAnswer: `${finalTotal} ÷ ${unitPrice} = ${secondQuantity}` },
            { label: "Step 3 (Final Answer)", expectedAnswer: String(secondQuantity) }
          ]
        });
        customConstraints = `
- CRITICAL: DO NOT modify the \`visualEngine\` payload in the JSON template. You MUST return it EXACTLY as provided, keeping all "?" strings intact.`;
      } else if (isMCQ) {
        askText = `${firstQuantity} bags of ${selectedContextItem} cost $${firstTotal}. If ${firstName} paid $${finalTotal}, how many bags did they buy?`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
        
        const d1 = String(firstQuantity * 2); 
        const d2 = String(secondQuantity + 1);
        const d3 = String(unitPrice);
        customConstraints = `
- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CARELESS_CALCULATION", and "${d3}" to "CONCEPTUAL_ERROR".`;
      } else {
        askText = `If ${firstQuantity} units equal ${firstTotal}, how many units equal ${finalTotal}?`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      }

      visualEngineStr = JSON.stringify(BarModelBuilder.createComparison({
        whole: undefined,
        bar1: { name: `${firstQuantity} items`, segments: String(firstQuantity), value: "?" },
        bar2: { name: `? items`, segments: String(secondQuantity), value: "?" },
        className: "w-full max-w-4xl mx-auto",
        isStatic: false
      }));

      const divStep1 = generateLongDivisionAlgorithmTables(firstTotal, firstQuantity, unitPrice, 0);
      const divStep2 = generateLongDivisionAlgorithmTables(finalTotal, unitPrice, secondQuantity, 0);

      solutionStepsConstraint = `
- You MUST explicitly generate a \`solutionSteps\` and a \`hint\`.
- For \`solutionSteps\`, provide EXACTLY TWO steps:
  1. "Step 1: Find the value of 1 unit:" followed by this exact HTML: \\n${divStep1}
  2. "Step 2: Find the number of units:" followed by this exact HTML: \\n${divStep2}
  CRITICAL: DO NOT modify the HTML strings. Use them EXACTLY as provided above!
  separate steps using the exact characters \\n inside the string for line breaks.`;
    }

  } else if (activeVariant === 'advanced_money_change') {
    const price = Math.floor(Math.random() * 80) + 115; // 115 to 194
    const quantity = Math.floor(Math.random() * 5) + 4; // 4 to 8
    const totalCost = price * quantity;
    const note = Math.ceil(totalCost / 1000) * 1000 + 1000; // Always larger than total cost (e.g. 2000)
    const change = note - totalCost;
    
    const scenario = Math.floor(Math.random() * 3); // 0: find change, 1: find price, 2: find note
    
    if (scenario === 0) {
      answer = String(change);
      
      if (isStructure) {
        askText = `Write a creative, concise word problem (under 4 sentences) using the character ${firstName} and the item '${selectedContextItem}'. The story must state that ${firstName} buys ${quantity} ${selectedContextItem}s at $${price} each. He pays with a $${note} note. The final question must ask for the change he receives.`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1", expectedAnswer: `${price} x ${quantity} = ${totalCost}` },
            { label: "Step 2", expectedAnswer: `${note} - ${totalCost} = ${change}` },
            { label: "Step 3", expectedAnswer: String(change) }
          ]
        });
        customConstraints = `\n- CRITICAL: DO NOT modify the \`visualEngine\` payload in the JSON template. You MUST return it EXACTLY as provided, keeping all "?" strings intact.`;
      } else if (isMCQ) {
        askText = `${firstName} buys ${quantity} ${selectedContextItem}s at $${price} each. If he pays with a $${note} note, how much change does he receive?`;
        const d1 = String(totalCost); 
        const d2 = String(change + 100);
        const d3 = String(note - price);
        customConstraints = `
- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CARELESS_CALCULATION", and "${d3}" to "CONCEPTUAL_ERROR".`;
      } else {
        askText = `Multiply ${price} by ${quantity}, then subtract the result from ${note}.`;
      }
      
      visualEngineStr = JSON.stringify(BarModelBuilder.createPartWhole({
        parts: [
          { value: "?:?", layoutSize: quantity },
          { value: "?", layoutSize: 1 }
        ],
        whole: "?",
        className: "w-full max-w-4xl mx-auto",
        isStatic: false
      }));

      const [multStep1, multStep2] = generateMultiplicationAlgorithmTables(price, quantity);
      const [subStep1, subStep2] = generateAlgorithmTables(note, totalCost, false);

      solutionStepsConstraint = `
- You MUST explicitly generate a \`solutionSteps\` and a \`hint\`.
- For \`solutionSteps\`, provide EXACTLY TWO steps:
  1. "Step 1: Find the total cost: ${price} x ${quantity} = ${totalCost}" followed by this exact HTML: \\n${multStep2}
  2. "Step 2: Subtract from the note to find the change: ${note} - ${totalCost} = ${change}" followed by this exact HTML: \\n${subStep2}
  CRITICAL: DO NOT modify the HTML strings. Use them EXACTLY as provided above!
  separate steps using the exact characters \\n inside the string for line breaks.`;

    } else if (scenario === 1) {
      // Find Price
      answer = String(price);
      
      if (isStructure) {
        askText = `Write a creative, concise word problem (under 4 sentences) using the character ${firstName} and the item '${selectedContextItem}'. The story must state that ${firstName} buys ${quantity} ${selectedContextItem}s. He pays with a $${note} note and receives $${change} in change. The final question must ask for the cost of each ${selectedContextItem}.`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1", expectedAnswer: `${note} - ${change} = ${totalCost}` },
            { label: "Step 2", expectedAnswer: `${totalCost} ÷ ${quantity} = ${price}` },
            { label: "Step 3", expectedAnswer: String(price) }
          ]
        });
        customConstraints = `\n- CRITICAL: DO NOT modify the \`visualEngine\` payload in the JSON template. You MUST return it EXACTLY as provided, keeping all "?" strings intact.`;
      } else if (isMCQ) {
        askText = `${firstName} buys ${quantity} identical ${selectedContextItem}s. He pays with a $${note} note and receives $${change} change. How much does one ${selectedContextItem} cost?`;
        const d1 = String(totalCost); 
        const d2 = String(Math.floor((note + change) / quantity));
        const d3 = String(price + 10);
        customConstraints = `
- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CARELESS_CALCULATION", and "${d3}" to "CARELESS_CALCULATION".`;
      } else {
        askText = `Subtract ${change} from ${note}, then divide the result by ${quantity}.`;
      }
      
      visualEngineStr = JSON.stringify(BarModelBuilder.createPartWhole({
        parts: [
          { value: "?:?", layoutSize: totalCost },
          { value: String(change), layoutSize: change }
        ],
        whole: String(note),
        className: "w-full max-w-4xl mx-auto",
        isStatic: false
      }));

      const [subStep1, subStep2] = generateAlgorithmTables(note, change, false);
      const divStep = generateLongDivisionAlgorithmTables(totalCost, quantity, price);

      solutionStepsConstraint = `
- You MUST explicitly generate a \`solutionSteps\` and a \`hint\`.
- For \`solutionSteps\`, provide EXACTLY TWO steps:
  1. "Step 1: Find the total cost: ${note} - ${change} = ${totalCost}" followed by this exact HTML: \\n${subStep2}
  2. "Step 2: Find the cost of one item: ${totalCost} ÷ ${quantity} = ${price}" followed by this exact HTML: \\n${divStep}
  CRITICAL: DO NOT modify the HTML strings. Use them EXACTLY as provided above!
  separate steps using the exact characters \\n inside the string for line breaks.`;

    } else {
      // Find Note
      answer = String(note);
      
      if (isStructure) {
        askText = `Write a creative, concise word problem (under 4 sentences) using the character ${firstName} and the item '${selectedContextItem}'. The story must state that ${firstName} buys ${quantity} ${selectedContextItem}s at $${price} each. After paying the cashier, he receives $${change} in change. The final question must ask for the value of the note he gave the cashier.`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1", expectedAnswer: `${price} x ${quantity} = ${totalCost}` },
            { label: "Step 2", expectedAnswer: `${totalCost} + ${change} = ${note}` },
            { label: "Step 3", expectedAnswer: String(note) }
          ]
        });
        customConstraints = `\n- CRITICAL: DO NOT modify the \`visualEngine\` payload in the JSON template. You MUST return it EXACTLY as provided, keeping all "?" strings intact.`;
      } else if (isMCQ) {
        askText = `${firstName} buys ${quantity} ${selectedContextItem}s at $${price} each. He receives $${change} in change. How much money did he give the cashier?`;
        const d1 = String(totalCost); 
        const d2 = String(note - 100);
        const d3 = String(Math.abs(totalCost - change));
        customConstraints = `
- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CARELESS_CALCULATION", and "${d3}" to "CONCEPTUAL_ERROR".`;
      } else {
        askText = `Multiply ${price} by ${quantity}, then add ${change}.`;
      }
      
      visualEngineStr = JSON.stringify(BarModelBuilder.createPartWhole({
        parts: [
          { value: `?:${price}`, layoutSize: quantity },
          { value: String(change), layoutSize: 1 }
        ],
        whole: "?",
        className: "w-full max-w-4xl mx-auto",
        isStatic: false
      }));

      const [multStep1, multStep2] = generateMultiplicationAlgorithmTables(price, quantity);
      const [addStep1, addStep2] = generateAlgorithmTables(totalCost, change, true);

      solutionStepsConstraint = `
- You MUST explicitly generate a \`solutionSteps\` and a \`hint\`.
- For \`solutionSteps\`, provide EXACTLY TWO steps:
  1. "Step 1: Find the total cost: ${price} x ${quantity} = ${totalCost}" followed by this exact HTML: \\n${multStep2}
  2. "Step 2: Add the change to find the note: ${totalCost} + ${change} = ${note}" followed by this exact HTML: \\n${addStep2}
  CRITICAL: DO NOT modify the HTML strings. Use them EXACTLY as provided above!
  separate steps using the exact characters \\n inside the string for line breaks.`;
    }

    if (isStructure) {
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
    } else if (isMCQ) {
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
    } else {
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
    }

  } else if (activeVariant === 'advanced_multiplicative_comparison_diff') {
    const baseValue = Math.floor(Math.random() * 80) + 120; // 120 to 199
    const multiplier = Math.floor(Math.random() * 4) + 4; // 4 to 7
    const siblingValue = baseValue * multiplier;
    const diff = siblingValue - baseValue;
    const total = siblingValue + baseValue;
    
    const questionType = Math.floor(Math.random() * 3); // 0 = brother's, 1 = total, 2 = diff
    let askTypeStr = "";
    if (questionType === 0) {
      answer = String(siblingValue);
      askTypeStr = `how many items the other person has`;
    } else if (questionType === 1) {
      answer = String(total);
      askTypeStr = `how many items they have altogether`;
    } else {
      answer = String(diff);
      askTypeStr = `how many MORE items the other person has than ${firstName}`;
    }

    if (isStructure) {
      askText = `Write a creative, concise word problem (under 4 sentences) using the character ${firstName} and the item '${selectedContextItem}'. The story must state that ${firstName} has ${baseValue} items, and another person has ${multiplier} times as many. The final question must ask ${askTypeStr}.`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
      
      let stepsArray = [];
      if (questionType === 0) {
        stepsArray = [
          { label: "Working", expectedAnswer: `${baseValue} x ${multiplier} = ${siblingValue}` },
          { label: "Final Answer", expectedAnswer: String(siblingValue) }
        ];
      } else if (questionType === 1) {
        stepsArray = [
          { label: "Step 1", expectedAnswer: `${baseValue} x ${multiplier} = ${siblingValue}` },
          { label: "Step 2", expectedAnswer: `${siblingValue} + ${baseValue} = ${total}` },
          { label: "Final Answer", expectedAnswer: String(total) }
        ];
      } else {
        stepsArray = [
          { label: "Step 1", expectedAnswer: `${baseValue} x ${multiplier} = ${siblingValue}` },
          { label: "Step 2", expectedAnswer: `${siblingValue} - ${baseValue} = ${diff}` },
          { label: "Final Answer", expectedAnswer: String(diff) }
        ];
      }
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: stepsArray
      });
      customConstraints = `
- CRITICAL: DO NOT modify the \`visualEngine\` payload in the JSON template. You MUST return it EXACTLY as provided, keeping all "?" strings intact.`;
    } else if (isMCQ) {
      if (questionType === 0) {
        askText = `${firstName} has ${baseValue} ${selectedContextItem}s. His brother has ${multiplier} times as many. How many ${selectedContextItem}s does his brother have?`;
      } else if (questionType === 1) {
        askText = `${firstName} has ${baseValue} ${selectedContextItem}s. His brother has ${multiplier} times as many. How many ${selectedContextItem}s do they have altogether?`;
      } else {
        askText = `${firstName} has ${baseValue} ${selectedContextItem}s. His brother has ${multiplier} times as many. How many more ${selectedContextItem}s does his brother have?`;
      }
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      
      let d1, d2, d3;
      if (questionType === 0) {
        d1 = String(diff); d2 = String(total); d3 = String(siblingValue + 100);
      } else if (questionType === 1) {
        d1 = String(diff); d2 = String(siblingValue); d3 = String(total + 100);
      } else {
        d1 = String(siblingValue); d2 = String(diff + 100); d3 = String(total);
      }
      
      customConstraints = `
- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CONCEPTUAL_ERROR", and "${d3}" to "CARELESS_CALCULATION".`;
    } else {
      if (questionType === 0) {
        askText = `If A = ${baseValue}, and B is ${multiplier} times A, what is B?`;
      } else if (questionType === 1) {
        askText = `If A = ${baseValue}, and B is ${multiplier} times A, what is A + B?`;
      } else {
        askText = `If A = ${baseValue}, and B is ${multiplier} times A, what is B - A?`;
      }
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
    }

    visualEngineStr = JSON.stringify(BarModelBuilder.createComparison({
        bar1: { name: firstName, value: "?" },
        bar2: { name: "Brother", segments: String(multiplier), value: "?" },
        className: "w-full max-w-2xl mx-auto",
        isStatic: false
    }));

    const [multStep1, multStep2] = generateMultiplicationAlgorithmTables(baseValue, multiplier);
    const [subStep1, subStep2] = generateAlgorithmTables(siblingValue, baseValue, false);
    const [addStep1, addStep2] = generateAlgorithmTables(siblingValue, baseValue, true);

    if (questionType === 0) {
      solutionStepsConstraint = `
- You MUST explicitly generate a \`solutionSteps\` and a \`hint\`.
- For \`solutionSteps\`, provide EXACTLY ONE step:
  1. "Step 1: Find the other person's amount: ${baseValue} x ${multiplier} = ${siblingValue}" followed by this exact HTML: \\n${multStep2}
  CRITICAL: DO NOT modify the HTML strings. Use them EXACTLY as provided above!
  separate steps using the exact characters \\n inside the string for line breaks.`;
    } else if (questionType === 1) {
      solutionStepsConstraint = `
- You MUST explicitly generate a \`solutionSteps\` and a \`hint\`.
- For \`solutionSteps\`, provide EXACTLY TWO steps:
  1. "Step 1: Find the other person's amount: ${baseValue} x ${multiplier} = ${siblingValue}" followed by this exact HTML: \\n${multStep2}
  2. "Step 2: Find the total amount: ${siblingValue} + ${baseValue} = ${total}" followed by this exact HTML: \\n${addStep2}
  CRITICAL: DO NOT modify the HTML strings. Use them EXACTLY as provided above!
  separate steps using the exact characters \\n inside the string for line breaks.`;
    } else {
      solutionStepsConstraint = `
- You MUST explicitly generate a \`solutionSteps\` and a \`hint\`.
- For \`solutionSteps\`, provide EXACTLY TWO steps:
  1. "Step 1: Find the other person's amount: ${baseValue} x ${multiplier} = ${siblingValue}" followed by this exact HTML: \\n${multStep2}
  2. "Step 2: Find the difference: ${siblingValue} - ${baseValue} = ${diff}" followed by this exact HTML: \\n${subStep2}
  CRITICAL: DO NOT modify the HTML strings. Use them EXACTLY as provided above!
  separate steps using the exact characters \\n inside the string for line breaks.`;
    }


  } else if (activeVariant === 'advanced_leftover_capacity') {
    const groups = Math.floor(Math.random() * 4) + 5; // 5 to 8
    const size = Math.floor(Math.random() * 30) + 120; // 120 to 149
    const totalCapacity = groups * size;
    const filled = Math.floor(totalCapacity * 0.4) + 100; // random amount filled
    const remaining = totalCapacity - filled;
    
    // Ensure remaining is divisible by packSize
    const packSize = Math.floor(Math.random() * 4) + 4; // 4 to 7
    const adjustedRemaining = Math.ceil(remaining / packSize) * packSize;
    const adjustedFilled = totalCapacity - adjustedRemaining;
    const newPacks = adjustedRemaining / packSize;
    answer = String(newPacks);

    if (isStructure) {
      askText = `Write a creative, concise word problem (under 5 sentences) using the character ${firstName} and the item '${selectedContextItem}'. The story must state that ${firstName} has ${groups} containers, each holding ${size} items. He currently has ${adjustedFilled} items. He buys more items in packs of ${packSize} to fill the rest of the capacity exactly. The final question must ask how many packs he needs to buy.`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1", expectedAnswer: `${size} x ${groups} = ${totalCapacity}` },
          { label: "Step 2", expectedAnswer: `${totalCapacity} - ${adjustedFilled} = ${adjustedRemaining}` },
          { label: "Step 3", expectedAnswer: `${adjustedRemaining} ÷ ${packSize} = ${newPacks}` },
          { label: "Final Answer", expectedAnswer: String(newPacks) }
        ]
      });
      customConstraints = `
- CRITICAL: DO NOT modify the \`visualEngine\` payload in the JSON template. You MUST return it EXACTLY as provided, keeping all "?" strings intact.`;
    } else if (isMCQ) {
      askText = `A tank holds ${groups} buckets of ${size} liters. ${adjustedFilled} liters are already filled. How many ${packSize}-liter jugs are needed to fill the rest?`;
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      
      const d1 = String(newPacks + 20); 
      const d2 = String(Math.floor(adjustedFilled / packSize));
      const d3 = String(newPacks - 2);
      customConstraints = `
- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CARELESS_CALCULATION", "${d2}" to "CONCEPTUAL_ERROR", and "${d3}" to "CARELESS_CALCULATION".`;
    } else {
      askText = `Total capacity is ${groups} groups of ${size}. ${adjustedFilled} is used. Divide the rest by ${packSize}.`;
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "NONE",
      componentData: { hideVisual: true }
    });

    const [multStep1, multStep2] = generateMultiplicationAlgorithmTables(size, groups);
    const [subStep1, subStep2] = generateAlgorithmTables(totalCapacity, adjustedFilled, false);
    const divStep = generateLongDivisionAlgorithmTables(adjustedRemaining, packSize, newPacks, 0);

    solutionStepsConstraint = `
- You MUST explicitly generate a \`solutionSteps\` and a \`hint\`.
- For \`solutionSteps\`, provide EXACTLY THREE steps:
  1. "Step 1: Find total capacity: ${size} x ${groups} = ${totalCapacity}" followed by this exact HTML: \\n${multStep2}
  2. "Step 2: Find remaining space: ${totalCapacity} - ${adjustedFilled} = ${adjustedRemaining}" followed by this exact HTML: \\n${subStep2}
  3. "Step 3: Find number of packs:" followed by this exact HTML: \\n${divStep}
  CRITICAL: DO NOT modify the HTML strings. Use them EXACTLY as provided above!
  separate steps using the exact characters \\n inside the string for line breaks.`;

  } else {
    throw new Error("Variant logic not implemented for this activeVariant.");
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
