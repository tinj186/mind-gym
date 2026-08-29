import { getRandomNames, getRandomCountableItems } from '@/lib/utils/variable-bank';
import { getUniqueOptions, getAdditionAlgoHtml, getRenamingHtml } from '../../../../../utils/decimal-algorithms.js';

export const standardLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
  const names = getRandomNames(2);
  const rawItems = getRandomCountableItems(2);
  const items = rawItems.map(i => typeof i === 'string' ? i : (i.item || 'item'));

  let askText, answer, mcqOptions, solutionSteps, hint;
  let visualEngineStr = `{"componentToRender": "NONE", "componentData": {"hideVisual": true}}`;
  let inputRequirementStr = null;

  if (activeVariant === 'standard_addition_regrouping') {
    // Addition with Regrouping (Cents to Dollars)
    // Cents sum must exceed 100
    const d1 = Math.floor(Math.random() * 40) + 10;
    const c1 = [60, 70, 80, 90][Math.floor(Math.random() * 4)];
    const d2 = Math.floor(Math.random() * 20) + 5;
    const c2 = [30, 40, 50, 60, 70, 80][Math.floor(Math.random() * 6)];
    
    // Ensure cents sum > 100
    const v1 = d1 + c1 / 100;
    const v2 = d2 + (c1 + c2 <= 100 ? (110 - c1) : c2) / 100;
    const sum = v1 + v2;
    
    const v1Str = v1.toFixed(2);
    const v2Str = v2.toFixed(2);
    const sumStr = sum.toFixed(2);

    answer = sumStr;
    const algoHTML = getAdditionAlgoHtml(v1Str, v2Str, sumStr);

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_MODEL",
      componentData: {
        modelType: "COMPARISON",
        isStatic: true,
        bar1: { name: items[0], value: parseFloat(v1Str), layoutSize: parseFloat(v1Str), segments: 1, displayValue: `$${v1Str}`, isUnknown: false, color: "#3b82f6" },
        bar2: { name: items[1], value: parseFloat(sumStr), layoutSize: parseFloat(sumStr), segments: 1, displayValue: `?`, isUnknown: true, color: "#eab308" },
        difference: {
          value: v2,
          displayValue: `$${v2Str}`
        }
      }
    });

    if (isMCQ) {
      
      solutionSteps = [
        isStructure ? `The ${items[1]} costs more, so we add the difference to the cost of the ${items[0]}.` : `Set up the numbers for vertical addition.`,
        algoHTML
      ];
      hint = isStructure ? `The ${items[1]} is more expensive. Add the two amounts to find its cost.` : `Remember to regroup the cents to dollars!`;
    }
  } else if (activeVariant === 'standard_subtraction_regrouping') {
    // Subtraction with Regrouping (Dollars to Cents)
    const d1 = Math.floor(Math.random() * 50) + 30; // 30 to 79
    const c1 = [10, 15, 20, 25, 30][Math.floor(Math.random() * 5)];
    const d2 = Math.floor(Math.random() * 20) + 10; // 10 to 29
    const c2 = [50, 60, 70, 80, 90][Math.floor(Math.random() * 5)];
    
    const v1 = d1 + c1 / 100;
    const v2 = d2 + c2 / 100;
    const diff = v1 - v2;
    
    const v1Str = v1.toFixed(2);
    const v2Str = v2.toFixed(2);
    const diffStr = diff.toFixed(2);

    answer = diffStr;
    const algoHTML = getRenamingHtml(v1, v2, diff);

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_MODEL",
      componentData: {
        modelType: "PART_WHOLE",
        isStatic: true,
        whole: `$${v1Str}`,
        parts: [
          { label: `Spent on ${items[0]}`, value: parseFloat(v2Str), layoutSize: parseFloat(v2Str), displayValue: `$${v2Str}`, isUnknown: false, color: "#ef4444" },
          { label: "Left", value: parseFloat(diffStr), layoutSize: parseFloat(diffStr), displayValue: "?", isUnknown: true, color: "#22c55e" }
        ]
      }
    });

    if (isMCQ) {
      askText = `Find the difference between $${v1Str} and $${v2Str}.`;
      const dist1 = (v1 - d2 - c1/100).toFixed(2);
      const dist2 = (diff + 1).toFixed(2);
      const dist3 = (diff - 0.1).toFixed(2);
      answer = `$${diffStr}`;
      mcqOptions = getUniqueOptions(answer, [dist1, dist2, dist3].map(d => `$${d}`));
      solutionSteps = [
        `Set up the numbers for subtraction:`,
        algoHTML
      ];
      hint = `Since ${c1}¢ is smaller than ${c2}¢, you need to borrow $1 (or 100¢) from the dollars.`;
    } else {
      let structText = `STORY: ${names[0]} saved $${v1Str}. ${names[0]} spent $${v2Str} on a ${items[0]}. How much money does ${names[0]} have left?`;
      let shortText = `$${v1Str} - $${v2Str} = ?`;
      askText = isStructure ? structText : shortText;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Working equation", expectedAnswer: `${v1Str} - ${v2Str} = ${answer}` },
            { label: "Amount left ($)", expectedAnswer: answer }
          ]
        });
      }
      
      solutionSteps = [
        isStructure ? `Subtract the amount spent from the total savings to find the amount left.` : `Set up the numbers for vertical subtraction.`,
        algoHTML
      ];
      hint = isStructure ? `Subtract the amount spent from the total amount saved.` : `Since ${c1}¢ is smaller than ${c2}¢, borrow $1 from the dollars column.`;
    }
  } else if (activeVariant === 'standard_two_step_addition') {
    // Two-Step Addition (3 Items)
    const items3 = [...items, "chicken"]; // just adding a 3rd item string
    const v1 = (Math.floor(Math.random() * 8) + 2) + [20, 50, 80][Math.floor(Math.random() * 3)] / 100;
    const v2 = (Math.floor(Math.random() * 5) + 1) + [30, 60, 90][Math.floor(Math.random() * 3)] / 100;
    const v3 = (Math.floor(Math.random() * 15) + 5) + [10, 40, 70][Math.floor(Math.random() * 3)] / 100;
    
    const sum = v1 + v2 + v3;
    const step1 = v1 + v2;
    
    const v1Str = v1.toFixed(2);
    const v2Str = v2.toFixed(2);
    const v3Str = v3.toFixed(2);
    const step1Str = step1.toFixed(2);
    const sumStr = sum.toFixed(2);

    answer = sumStr;
    const algo1HTML = getAdditionAlgoHtml(v1Str, v2Str, step1Str);
    const algo2HTML = getAdditionAlgoHtml(step1Str, v3Str, sumStr);

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_MODEL",
      componentData: {
        modelType: "PART_WHOLE",
        isStatic: true,
        whole: "?",
        parts: [
          { label: items3[0], value: parseFloat(v1Str), layoutSize: parseFloat(v1Str), displayValue: `$${v1Str}`, isUnknown: false, color: "#3b82f6" },
          { label: items3[1], value: parseFloat(v2Str), layoutSize: parseFloat(v2Str), displayValue: `$${v2Str}`, isUnknown: false, color: "#eab308" },
          { label: items3[2], value: parseFloat(v3Str), layoutSize: parseFloat(v3Str), displayValue: `$${v3Str}`, isUnknown: false, color: "#ef4444" }
        ]
      }
    });

    if (isMCQ) {
      askText = `Add $${v1Str}, $${v2Str}, and $${v3Str}.`;
      const dist1 = (sum + 1).toFixed(2);
      const dist2 = (sum - 0.1).toFixed(2);
      const dist3 = (v1 + v2).toFixed(2);
      answer = `$${sumStr}`;
      mcqOptions = getUniqueOptions(answer, [dist1, dist2, dist3].map(d => `$${d}`));
      solutionSteps = [
        `Step 1: Add the first two amounts.`,
        algo1HTML,
        `Step 2: Add the third amount to the total.`,
        algo2HTML
      ];
      hint = `Add the first two amounts together, then add the third amount to that total.`;
    } else {
      let structText = `STORY: ${names[0]} bought three items at the supermarket. They bought a ${items3[0]} for $${v1Str}, a ${items3[1]} for $${v2Str}, and a ${items3[2]} for $${v3Str}. What was their total bill?`;
      let shortText = `Add $${v1Str}, $${v2Str}, and $${v3Str}.`;
      askText = isStructure ? structText : shortText;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Step 1: Add the first two items`, expectedAnswer: `${v1Str} + ${v2Str} = ${step1Str}` },
            { label: `Step 2: Add the third item`, expectedAnswer: `${step1Str} + ${v3Str} = ${sumStr}` },
            { label: "Total bill ($)", expectedAnswer: answer }
          ]
        });
      }
      
      solutionSteps = [
        `Step 1: Add the first two amounts.`,
        algo1HTML,
        `Step 2: Add the third amount to the total.`,
        algo2HTML
      ];
      hint = isStructure ? `Step 1: Add the cost of the first two items. Step 2: Add that total to the third item.` : `Add the first two amounts, then add the third amount to the total.`;
    }
  } else if (activeVariant === 'standard_reverse_subtraction') {
    // Finding the Original Amount (Reverse Subtraction)
    // Spent + Left = Total at first
    const d1 = Math.floor(Math.random() * 20) + 10;
    const c1 = [30, 40, 50, 60, 70, 80][Math.floor(Math.random() * 6)];
    const d2 = Math.floor(Math.random() * 10) + 5;
    const c2 = [30, 40, 50, 60, 70, 80][Math.floor(Math.random() * 6)];
    
    const v1 = d1 + c1 / 100; // Spent
    const v2 = d2 + c2 / 100; // Left
    const total = v1 + v2;
    
    const v1Str = v1.toFixed(2);
    const v2Str = v2.toFixed(2);
    const totalStr = total.toFixed(2);

    answer = totalStr;
    const algoHTML = getAdditionAlgoHtml(v1Str, v2Str, totalStr);

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_MODEL",
      componentData: {
        modelType: "PART_WHOLE",
        isStatic: true,
        whole: "?",
        parts: [
          { label: "Spent", value: parseFloat(v1Str), layoutSize: parseFloat(v1Str), displayValue: `$${v1Str}`, isUnknown: false, color: "#ef4444" },
          { label: "Left", value: parseFloat(v2Str), layoutSize: parseFloat(v2Str), displayValue: `$${v2Str}`, isUnknown: false, color: "#22c55e" }
        ]
      }
    });

    if (isMCQ) {
      askText = `Spent $${v1Str}. Left with $${v2Str}. Total at first?`;
      const dist1 = Math.abs(v1 - v2).toFixed(2);
      const dist2 = (total + 1).toFixed(2);
      const dist3 = (total - 0.1).toFixed(2);
      answer = `$${totalStr}`;
      mcqOptions = getUniqueOptions(answer, [dist1, dist2, dist3].map(d => `$${d}`));
      solutionSteps = [
        `To find the total amount at first, add the amount spent and the amount left together:`,
        algoHTML
      ];
      hint = `Add the amount spent and the amount left to find the starting total.`;
    } else {
      let structText = `STORY: After spending $${v1Str} on a ${items[0]}, ${names[0]} had $${v2Str} left. How much money did ${names[0]} have at first?`;
      let shortText = `I spent $${v1Str} and have $${v2Str} left. How much did I have at first?`;
      askText = isStructure ? structText : shortText;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Working equation`, expectedAnswer: `${v1Str} + ${v2Str} = ${totalStr}` },
            { label: "Amount at first ($)", expectedAnswer: answer }
          ]
        });
      }
      
      solutionSteps = [
        isStructure ? `Add the amount spent and the amount left to find the total money at first.` : `Set up the numbers for vertical addition.`,
        algoHTML
      ];
      hint = `Add the amount spent and the amount left together!`;
    }
  } else if (activeVariant === 'standard_comparison') {
    // Comparison (How much more/less)
    const d1 = Math.floor(Math.random() * 50) + 30; 
    const c1 = [50, 60, 70, 80, 90][Math.floor(Math.random() * 5)];
    const d2 = Math.floor(Math.random() * 20) + 10; 
    const c2 = [10, 20, 30, 40, 50][Math.floor(Math.random() * 5)];
    
    // Ensure v1 > v2
    const v1 = d1 + c1 / 100; 
    const v2 = d2 + c2 / 100; 
    const diff = v1 - v2;
    
    const v1Str = v1.toFixed(2);
    const v2Str = v2.toFixed(2);
    const diffStr = diff.toFixed(2);

    answer = diffStr;
    const algoHTML = getRenamingHtml(v1, v2, diff);

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_MODEL",
      componentData: {
        modelType: "COMPARISON",
        isStatic: true,
        bar1: { name: items[0], value: parseFloat(v1Str), layoutSize: parseFloat(v1Str), segments: 1, displayValue: `$${v1Str}`, isUnknown: false, color: "#3b82f6" },
        bar2: { name: items[1], value: parseFloat(v2Str), layoutSize: parseFloat(v2Str), segments: 1, displayValue: `$${v2Str}`, isUnknown: false, color: "#eab308" },
        difference: {
          value: parseFloat(diffStr),
          displayValue: "?"
        }
      }
    });

    if (isMCQ) {
      askText = `Find the difference in price between a $${v1Str} shirt and a $${v2Str} hat.`;
      const dist1 = (diff + 1).toFixed(2);
      const dist2 = (diff - 0.1).toFixed(2);
      const dist3 = (v1 + v2).toFixed(2);
      answer = `$${diffStr}`;
      mcqOptions = getUniqueOptions(answer, [dist1, dist2, dist3].map(d => `$${d}`));
      solutionSteps = [
        `To find the difference, subtract the smaller amount from the larger amount:`,
        algoHTML
      ];
      hint = `Subtract the price of the hat from the price of the shirt.`;
    } else {
      let structText = `STORY: A ${items[0]} costs $${v1Str}. A ${items[1]} costs $${v2Str}. How much cheaper is the ${items[1]} than the ${items[0]}?`;
      let shortText = `Item A costs $${v1Str}. Item B costs $${v2Str}. How much more does Item A cost?`;
      askText = isStructure ? structText : shortText;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Working equation`, expectedAnswer: `${v1Str} - ${v2Str} = ${diffStr}` },
            { label: "Difference ($)", expectedAnswer: answer }
          ]
        });
      }
      
      solutionSteps = [
        isStructure ? `Subtract the cost of the ${items[1]} from the ${items[0]} to find the difference.` : `Subtract the smaller amount from the larger amount.`,
        algoHTML
      ];
      hint = `Subtract the smaller amount from the larger amount to find the difference.`;
    }
  } else {
    throw new Error(`Variant '${activeVariant}' not implemented in standard.js`);
  }

  const mcqOptionsStr = mcqOptions ? JSON.stringify(mcqOptions) : "[]";
  const solutionStepsStr = solutionSteps ? JSON.stringify(solutionSteps) : "[]";

  const questionInstruction = askText.includes('STORY:')
    ? `you must rewrite the text following 'STORY:' to create a highly engaging, creative word problem for a Primary 3 student. However, you MUST strictly follow these rules:\n1. Preserve the exact mathematical values and operations.\n2. DO NOT add any extra unrequested questions (e.g., do not add 'How many altogether?').\n3. Keep the final question sentence exactly as intended.`
    : `you MUST use the exact string provided in 'askText'. DO NOT paraphrase or rewrite it.`;

  return {
    aiPrompt: `You are an expert Primary 3 math question generator.
    
    Question parameters:
    - askText: ${JSON.stringify(askText)}
    - answer: ${JSON.stringify(answer)}
    - options: ${mcqOptionsStr}
    - hint: ${JSON.stringify(hint)}
    - solutionSteps: ${solutionStepsStr}
    
    CRITICAL INSTRUCTION: For 'questionText', ${questionInstruction}
    CRITICAL INSTRUCTION: For 'finalAnswer', you MUST use the exact string provided in 'answer'.
    CRITICAL INSTRUCTION: For 'options', you MUST use the exact array provided in 'options' (if applicable).
    CRITICAL INSTRUCTION: For 'solutionSteps', you MUST use the exact array provided in 'solutionSteps'.
    CRITICAL INSTRUCTION: For 'hint', you MUST use the exact string provided in 'hint'.
    CRITICAL INSTRUCTION: For 'visualEngine', you MUST output EXACTLY the JSON object provided in the OUTPUT FORMAT template below. Do NOT hallucinate your own visual models or stringify nested arrays.
    CRITICAL INSTRUCTION: For 'inputRequirement', you MUST output EXACTLY the JSON object provided in the OUTPUT FORMAT template below. Do NOT change the labels or steps.
    
    ${getFormatInstructions(visualEngineStr, inputRequirementStr)}`,
    visualEngine: JSON.parse(visualEngineStr),
    inputRequirement: inputRequirementStr ? JSON.parse(inputRequirementStr) : undefined,
    metadata: { difficulty, steps: isStructure ? 2 : 1 }
  };
};
