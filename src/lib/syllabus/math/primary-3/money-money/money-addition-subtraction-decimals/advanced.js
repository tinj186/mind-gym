import { getUniqueOptions, getAdditionAlgoHtml, getRenamingHtml } from '../../../../../utils/decimal-algorithms.js';
import { getRandomNames, getRandomCountableItems } from '@/lib/utils/variable-bank';

export const advancedLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
  const names = getRandomNames(2);
  const items = getRandomCountableItems(3);
  
  let askText = '';
  let answer = '';
  let mcqOptions = [];
  let solutionSteps = [];
  let hint = '';
  let visualEngineStr = null;
  let inputRequirementStr = null;
  let aiPrompt = null;

  switch (activeVariant) {
    case 'advanced_add_find_change': {
      // Add, Then Find Change (3-Step Logic)
      // Bought items for $15.50 and $12.80. Paid with a $50 note. Find the change.
      const note = [20, 50, 100][Math.floor(Math.random() * 3)];
      const v1 = parseFloat(((Math.random() * (note * 0.4)) + 2).toFixed(2));
      const v2 = parseFloat(((Math.random() * (note * 0.4)) + 2).toFixed(2));
      const sum = parseFloat((v1 + v2).toFixed(2));
      const change = parseFloat((note - sum).toFixed(2));
      
      const v1Str = v1.toFixed(2);
      const v2Str = v2.toFixed(2);
      const sumStr = sum.toFixed(2);
      const changeStr = change.toFixed(2);
      
      answer = changeStr;
      const addAlgoHTML = getAdditionAlgoHtml(v1Str, v2Str, sumStr);
      const subAlgoHTML = getRenamingHtml(note, sum, change);

          
        visualEngineStr = JSON.stringify({
          componentToRender: "BAR_MODEL",
          componentData: {
            modelType: "PART_WHOLE",
            isStatic: true,
            whole: `$${note}.00`,
            parts: [
              { label: items[0], value: v1, layoutSize: v1, displayValue: `$${v1Str}`, isUnknown: false, color: "#3b82f6" },
              { label: items[1], value: v2, layoutSize: v2, displayValue: `$${v2Str}`, isUnknown: false, color: "#eab308" },
              { label: "Change", value: change, layoutSize: change, displayValue: "?", isUnknown: true, color: "#22c55e" }
            ]
          }
        });
      if (isMCQ) {
        askText = `Bought items for $${v1Str} and $${v2Str}. Paid with $${note}.00. Change?`;
        const dist1 = (change + 1).toFixed(2);
        const dist2 = (change - 1).toFixed(2);
        const dist3 = (change + 0.1).toFixed(2);
        answer = `$${changeStr}`;
        mcqOptions = getUniqueOptions(answer, [dist1, dist2, dist3].map(d => `$${d}`));
        solutionSteps = [
          `First, find the total cost: $${v1Str} + $${v2Str} = $${sumStr}`,
          `Then, subtract from the amount paid: $${note}.00 - $${sumStr} = $${changeStr}`
        ];
        hint = `First find the total cost of the items. Then subtract that total from the $${note}.00 note!`;
      } else {
        let structText = `STORY: ${names[0]} buys a ${items[0]} for $${v1Str} and a ${items[1]} for $${v2Str}. ${names[0]} pays the cashier with a $${note} note. How much change does ${names[0]} receive?`;
        let shortText = `Bought items for $${v1Str} and $${v2Str}. Paid with a $${note} note. Find the change.`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Total cost`, expectedAnswer: `${v1Str} + ${v2Str} = ${sumStr}` },
              { label: `Change equation`, expectedAnswer: `${note.toFixed(2)} - ${sumStr} = ${changeStr}` },
              { label: `Change received ($)`, expectedAnswer: changeStr }
            ]
          });
        }        
        solutionSteps = [
          `Step 1: Find the total cost of the ${items[0]} and ${items[1]}.`,
          addAlgoHTML,
          `Step 2: Subtract the total cost from the amount paid ($${note}) to find the change.`,
          subAlgoHTML
        ];
        hint = `First find the total cost of the items. Then subtract that total from the $${note} note!`;
      }
      break;
    }

    case 'advanced_insufficient_funds': {
      // Insufficient Funds (The Shortfall)
      // Has $24.50. Wants to buy a toy for $32.00. How much more money is needed?
      const itemCost = parseFloat(((Math.random() * 30) + 10).toFixed(2));
      const hasMoney = parseFloat((itemCost - (Math.random() * 8 + 2)).toFixed(2));
      const needed = parseFloat((itemCost - hasMoney).toFixed(2));
      
      const itemCostStr = itemCost.toFixed(2);
      const hasMoneyStr = hasMoney.toFixed(2);
      const neededStr = needed.toFixed(2);

      answer = neededStr;
      const subAlgoHTML = getRenamingHtml(itemCost, hasMoney, needed);

          
        visualEngineStr = JSON.stringify({
          componentToRender: "BAR_MODEL",
          componentData: {
            modelType: "COMPARISON",
            isStatic: true,
            bar1: { name: items[0], value: itemCost, layoutSize: itemCost, segments: 1, displayValue: `$${itemCostStr}`, isUnknown: false, color: "#3b82f6" },
            bar2: { name: "Savings", value: hasMoney, layoutSize: hasMoney, segments: 1, displayValue: `$${hasMoneyStr}`, isUnknown: false, color: "#eab308" },
            difference: {
              value: needed,
              displayValue: "?"
            }
          }
        });
      if (isMCQ) {
        askText = `Item costs $${itemCostStr}. I have $${hasMoneyStr}. How much more do I need?`;
        const dist1 = (needed + 1).toFixed(2);
        const dist2 = (needed - 0.1).toFixed(2);
        const dist3 = (itemCost + hasMoney).toFixed(2);
        answer = `$${neededStr}`;
        mcqOptions = getUniqueOptions(answer, [dist1, dist2, dist3].map(d => `$${d}`));
        solutionSteps = [
          `Subtract what you have from the cost of the item to find out how much more you need:`,
          subAlgoHTML
        ];
        hint = `Find the difference between the item's cost and the money you have.`;
      } else {
        let structText = `STORY: ${names[0]} wants to buy a ${items[0]} that costs $${itemCostStr}. ${names[0]} only has $${hasMoneyStr} in their piggy bank. How much more money does ${names[0]} need to save to buy the ${items[0]}?`;
        let shortText = `Has $${hasMoneyStr}. Wants to buy an item for $${itemCostStr}. How much more money is needed?`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Working equation`, expectedAnswer: `${itemCostStr} - ${hasMoneyStr} = ${neededStr}` },
              { label: `More money needed ($)`, expectedAnswer: neededStr }
            ]
          });
        }        
        solutionSteps = [
          `Subtract the amount ${names[0]} has from the cost of the ${items[0]} to find the shortfall.`,
          subAlgoHTML
        ];
        hint = `Subtract the smaller amount from the larger amount to find out how much more is needed.`;
      }
      break;
    }

    case 'advanced_total_of_two': {
      // The "Total of Two People" (Comparison into Addition)
      // Ali has $20.00. Ben has $4.50 less than Ali. How much do they have altogether?
      const valA = parseFloat(((Math.random() * 40) + 10).toFixed(2));
      const diff = parseFloat(((Math.random() * (valA / 2)) + 1).toFixed(2));
      const valB = parseFloat((valA - diff).toFixed(2));
      const total = parseFloat((valA + valB).toFixed(2));

      const valAStr = valA.toFixed(2);
      const diffStr = diff.toFixed(2);
      const valBStr = valB.toFixed(2);
      const totalStr = total.toFixed(2);

      answer = totalStr;
      const subAlgoHTML = getRenamingHtml(valA, diff, valB);
      const addAlgoHTML = getAdditionAlgoHtml(valAStr, valBStr, totalStr);

          
        visualEngineStr = JSON.stringify({
          componentToRender: "BAR_MODEL",
          componentData: {
            modelType: "COMPARISON",
            isStatic: true,
            whole: "?",
            bar1: { name: names[0], value: valA, layoutSize: valA, segments: 1, displayValue: `$${valAStr}`, isUnknown: false, color: "#3b82f6" },
            bar2: { name: names[1], value: valB, layoutSize: valB, segments: 1, displayValue: `?`, isUnknown: true, color: "#eab308" },
            difference: {
              value: diff,
              displayValue: `$${diffStr}`
            }
          }
        });
      if (isMCQ) {
        askText = `Person A has $${valAStr}. Person B has $${diffStr} less. Total amount?`;
        const dist1 = valBStr;
        const dist2 = (total + 1).toFixed(2);
        const dist3 = (valA + diff).toFixed(2);
        answer = `$${totalStr}`;
        mcqOptions = getUniqueOptions(answer, [dist1, dist2, dist3].map(d => `$${d}`));
        solutionSteps = [
          `First, find Person B's amount: $${valAStr} - $${diffStr} = $${valBStr}`,
          `Then, add both amounts together: $${valAStr} + $${valBStr} = $${totalStr}`
        ];
        hint = `Find Person B's money first, then add it to Person A's money.`;
      } else {
        let structText = `STORY: ${names[0]} saved $${valAStr}. ${names[1]} saved $${diffStr} less than ${names[0]}. How much money did the two children save altogether?`;
        let shortText = `Person A has $${valAStr}. Person B has $${diffStr} less than Person A. How much do they have altogether?`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Amount ${names[1]} saved`, expectedAnswer: `${valAStr} - ${diffStr} = ${valBStr}` },
              { label: `Total amount saved by both ($)`, expectedAnswer: totalStr }
            ]
          });
        }        
        solutionSteps = [
          `Step 1: Find how much ${names[1]} saved.`,
          subAlgoHTML,
          `Step 2: Add both amounts to find the total saved altogether.`,
          addAlgoHTML
        ];
        hint = `Find how much ${names[1]} has first by subtracting. Then add both amounts together!`;
      }
      break;
    }

    case 'advanced_unitary_pricing': {
      // Unitary Pricing (Multiplication via Repeated Addition)
      // 2 pens cost $1.50 each. A book costs $4.20. Total cost?
      const item1 = items[0].item || items[0];
      const item2 = items[1].item || items[1];
      const price1 = parseFloat(((Math.random() * 3) + 0.50).toFixed(2));
      const price2 = parseFloat(((Math.random() * 10) + 2.00).toFixed(2));
      
      const qty1 = 2; // Keep it simple for P3 repeated addition
      const total1 = parseFloat((price1 * qty1).toFixed(2));
      const totalAll = parseFloat((total1 + price2).toFixed(2));

      const price1Str = price1.toFixed(2);
      const price2Str = price2.toFixed(2);
      const total1Str = total1.toFixed(2);
      const totalAllStr = totalAll.toFixed(2);

      answer = totalAllStr;
      const add1AlgoHTML = getAdditionAlgoHtml(price1Str, price1Str, total1Str);
      const addAllAlgoHTML = getAdditionAlgoHtml(total1Str, price2Str, totalAllStr);

          
        visualEngineStr = JSON.stringify({
          componentToRender: "NONE",
          componentData: {}
        });
      if (isMCQ) {
        askText = `${qty1} items at $${price1Str} each, plus 1 item at $${price2Str}. Total?`;
        const dist1 = (price1 + price2).toFixed(2); // Forgot to multiply
        const dist2 = (totalAll + 1).toFixed(2);
        const dist3 = (totalAll - 1).toFixed(2);
        answer = `$${totalAllStr}`;
        mcqOptions = getUniqueOptions(answer, [dist1, dist2, dist3].map(d => `$${d}`));
        solutionSteps = [
          `Find the cost of ${qty1} items: $${price1Str} + $${price1Str} = $${total1Str}`,
          `Add the cost of the other item: $${total1Str} + $${price2Str} = $${totalAllStr}`
        ];
        hint = `Remember to add the price of the first item twice!`;
      } else {
        let structText = `STORY: A shop sells ${item1} for $${price1Str} each and ${item2} for $${price2Str} each. ${names[0]} buys ${qty1} ${item1} and 1 ${item2}. How much does ${names[0]} pay in total?`;
        let shortText = `${qty1} ${item1} cost $${price1Str} each. A ${item2} costs $${price2Str}. Total cost?`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Cost of ${qty1} ${item1}`, expectedAnswer: `${price1Str} + ${price1Str} = ${total1Str}` },
              { label: `Total cost equation`, expectedAnswer: `${total1Str} + ${price2Str} = ${totalAllStr}` },
              { label: `Total cost ($)`, expectedAnswer: totalAllStr }
            ]
          });
        }        
        solutionSteps = [
          `Step 1: Find the cost of ${qty1} ${item1}.`,
          add1AlgoHTML,
          `Step 2: Add the cost of the ${item2} to find the total.`,
          addAllAlgoHTML
        ];
        hint = `Find the cost of ${qty1} ${item1} first. Then add the cost of the ${item2}.`;
      }
      break;
    }

    case 'advanced_deduction_from_total': {
      // Deduction from Total (Missing Item)
      // Total bill for 3 items is $50.00. Item A is $12.50, Item B is $15.00. Cost of Item C?
      const item1 = items[0].item || items[0];
      const item2 = items[1].item || items[1];
      const item3 = items[2].item || items[2];
      const priceA = parseFloat(((Math.random() * 15) + 5).toFixed(2));
      const priceB = parseFloat(((Math.random() * 15) + 5).toFixed(2));
      const priceC = parseFloat(((Math.random() * 15) + 5).toFixed(2));
      const totalAB = parseFloat((priceA + priceB).toFixed(2));
      const totalAll = parseFloat((totalAB + priceC).toFixed(2));

      const priceAStr = priceA.toFixed(2);
      const priceBStr = priceB.toFixed(2);
      const priceCStr = priceC.toFixed(2);
      const totalABStr = totalAB.toFixed(2);
      const totalAllStr = totalAll.toFixed(2);

      answer = priceCStr;
      const addAlgoHTML = getAdditionAlgoHtml(priceAStr, priceBStr, totalABStr);
      const subAlgoHTML = getRenamingHtml(totalAll, totalAB, priceC);

          
        visualEngineStr = JSON.stringify({
          componentToRender: "BAR_MODEL",
          componentData: {
            modelType: "PART_WHOLE",
            isStatic: true,
            whole: `$${totalAllStr}`,
            parts: [
              { label: item1, value: priceA, layoutSize: priceA, displayValue: `$${priceAStr}`, isUnknown: false, color: "#3b82f6" },
              { label: item2, value: priceB, layoutSize: priceB, displayValue: `$${priceBStr}`, isUnknown: false, color: "#eab308" },
              { label: item3, value: priceC, layoutSize: priceC, displayValue: "?", isUnknown: true, color: "#ef4444" }
            ]
          }
        });
      if (isMCQ) {
        askText = `Total is $${totalAllStr}. Item 1 is $${priceAStr}. Item 2 is $${priceBStr}. Item 3 is?`;
        const dist1 = totalABStr;
        const dist2 = (priceC + 1).toFixed(2);
        const dist3 = (priceC - 1).toFixed(2);
        answer = `$${priceCStr}`;
        mcqOptions = getUniqueOptions(answer, [dist1, dist2, dist3].map(d => `$${d}`));
        solutionSteps = [
          `Add Item 1 and Item 2: $${priceAStr} + $${priceBStr} = $${totalABStr}`,
          `Subtract from total to find Item 3: $${totalAllStr} - $${totalABStr} = $${priceCStr}`
        ];
        hint = `Add the two known prices together first, then subtract from the total.`;
      } else {
        let structText = `STORY: The total cost of a ${item1}, a ${item2}, and a ${item3} is $${totalAllStr}. The ${item1} costs $${priceAStr} and the ${item2} costs $${priceBStr}. How much does the ${item3} cost?`;
        let shortText = `Total bill for 3 items is $${totalAllStr}. Item A is $${priceAStr}, Item B is $${priceBStr}. Cost of Item C?`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Cost of ${item1} and ${item2}`, expectedAnswer: `${priceAStr} + ${priceBStr} = ${totalABStr}` },
              { label: `Equation to find ${item3}`, expectedAnswer: `${totalAllStr} - ${totalABStr} = ${priceCStr}` },
              { label: `Cost of ${item3} ($)`, expectedAnswer: priceCStr }
            ]
          });
        }        
        solutionSteps = [
          `Step 1: Find the total cost of the ${item1} and ${item2}.`,
          addAlgoHTML,
          `Step 2: Subtract their total from the overall total to find the cost of the ${item3}.`,
          subAlgoHTML
        ];
        hint = `Find the total cost of the first two items, then subtract it from the total bill.`;
      }
      break;
    }
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
    metadata: { difficulty: "Advanced", steps: isStructure ? 3 : 1 }
  };
};
