import { getRandomNames, getRandomCountableItems, getRandomDivisibleFoods } from '@/lib/utils/variable-bank';
import { getUniqueOptions, getArticle, getAdditionAlgoHtml } from '../../../../../utils/decimal-algorithms.js';

export const foundationLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
  const names = getRandomNames(2);
  const items = getRandomCountableItems(2);
  const foods = getRandomDivisibleFoods(4);

  let askText, answer, mcqOptions, solutionSteps, hint;
  let visualEngineStr = `{"componentToRender": "NONE", "componentData": {"hideVisual": true}}`;
  let inputRequirementStr = null;

  if (activeVariant === 'foundation_pure_addition') {
    // Pure Addition (No Regrouping Across Dollars)
    const d1 = Math.floor(Math.random() * 15) + 1;
    const c1 = [10, 20, 30, 40][Math.floor(Math.random() * 4)];
    const d2 = Math.floor(Math.random() * 10) + 1;
    const c2 = [10, 20, 30, 40][Math.floor(Math.random() * 4)];
    
    const v1 = d1 + c1 / 100;
    const v2 = d2 + c2 / 100;
    const sum = v1 + v2;
    
    const v1Str = v1.toFixed(2);
    const v2Str = v2.toFixed(2);
    const sumStr = sum.toFixed(2);

    answer = sumStr;

    if (isMCQ) {
      askText = `Add $${v1Str} and $${v2Str}.`;
      const dist1 = (sum + 1).toFixed(2);
      const dist2 = (sum - 1).toFixed(2);
      const dist3 = (v1 + d2 + (Math.abs(c1 - c2)) / 100).toFixed(2);
      answer = `$${sumStr}`;
      mcqOptions = getUniqueOptions(answer, [dist1, dist2, dist3].map(d => `$${d}`));
      solutionSteps = [
        `Add the cents: ${c1}¢ + ${c2}¢ = ${c1 + c2}¢.`,
        `Add the dollars: $${d1} + $${d2} = $${d1 + d2}.`,
        `Total: $${sumStr}.`
      ];
      hint = `Add the cents first, then add the dollars.`;
    } else {
      let structText = `STORY: ${names[0]} buys a ${items[0]} for $${v1Str} and a ${items[1]} for $${v2Str}. How much does ${names[0]} spend altogether?`;
      let shortText = `$${v1Str} + $${v2Str} = ?`;
      askText = isStructure ? structText : shortText;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Add the cents", expectedAnswer: (c1 + c2).toString().padStart(2, '0') },
            { label: "Add the dollars", expectedAnswer: (d1 + d2).toString() },
            { label: "Total spent ($)", expectedAnswer: answer }
          ]
        });
      }
      
      visualEngineStr = JSON.stringify({
        componentToRender: "VERTICAL_ALGORITHM",
        componentData: {
          items: [`$${v1Str}`, "+", `$${v2Str}`]
        }
      });
      
      const v1Pad = v1Str.padStart(5, ' ');
      const v2Pad = v2Str.padStart(5, ' ');
      const sumPad = sumStr.padStart(5, ' ');
      const algoHTML = `<div style="font-family: monospace; white-space: pre; text-align: right; width: fit-content; margin: 0 auto; font-size: 1.2rem;">  $${v1Pad}<br/>+ $${v2Pad}<hr style="border-top: 2px solid black; margin: 2px 0;" />  $${sumPad}</div>`;
      
      solutionSteps = [
        `Setting up the vertical algorithm:<br/>${algoHTML}`,
        `Add the cents: ${c1}¢ + ${c2}¢ = ${c1 + c2}¢.<br/>Add the dollars: $${d1} + $${d2} = $${d1 + d2}.`
      ];
      hint = `Add the dollars together, and add the cents together.`;
    }
  } else if (activeVariant === 'foundation_pure_subtraction') {
    // Pure Subtraction (No Regrouping Across Dollars)
    const d1 = Math.floor(Math.random() * 15) + 15;
    const c1 = [50, 60, 70, 80, 90][Math.floor(Math.random() * 5)];
    const d2 = Math.floor(Math.random() * 10) + 1;
    const c2 = [10, 20, 30, 40][Math.floor(Math.random() * 4)];
    
    const v1 = d1 + c1 / 100;
    const v2 = d2 + c2 / 100;
    const diff = v1 - v2;
    
    const v1Str = v1.toFixed(2);
    const v2Str = v2.toFixed(2);
    const diffStr = diff.toFixed(2);

    answer = diffStr;

    if (isMCQ) {
      askText = `Subtract $${v2Str} from $${v1Str}.`;
      const dist1 = (diff + 1).toFixed(2);
      const dist2 = (diff - 1).toFixed(2);
      const dist3 = (v1 + v2).toFixed(2);
      answer = `$${diffStr}`;
      mcqOptions = getUniqueOptions(answer, [dist1, dist2, dist3].map(d => `$${d}`));
      solutionSteps = [
        `Subtract the cents: ${c1}¢ - ${c2}¢ = ${c1 - c2}¢.`,
        `Subtract the dollars: $${d1} - $${d2} = $${d1 - d2}.`,
        `Difference: $${diffStr}.`
      ];
      hint = `Subtract the cents first, then subtract the dollars.`;
    } else {
      let structText = `STORY: ${names[0]} has $${v1Str}. They spend $${v2Str} on a ${items[0]}. How much money do they have left?`;
      let shortText = `$${v1Str} - $${v2Str} = ?`;
      askText = isStructure ? structText : shortText;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Subtract the cents", expectedAnswer: (c1 - c2).toString().padStart(2, '0') },
            { label: "Subtract the dollars", expectedAnswer: (d1 - d2).toString() },
            { label: "Amount left ($)", expectedAnswer: answer }
          ]
        });
      }
      
      visualEngineStr = JSON.stringify({
        componentToRender: "VERTICAL_ALGORITHM",
        componentData: {
          items: [`$${v1Str}`, "-", `$${v2Str}`]
        }
      });
      
      const v1Pad = v1Str.padStart(5, ' ');
      const v2Pad = v2Str.padStart(5, ' ');
      const diffPad = diffStr.padStart(5, ' ');
      const algoHTML = `<div style="font-family: monospace; white-space: pre; text-align: right; width: fit-content; margin: 0 auto; font-size: 1.2rem;">  $${v1Pad}<br/>- $${v2Pad}<hr style="border-top: 2px solid black; margin: 2px 0;" />  $${diffPad}</div>`;
      
      solutionSteps = [
        `Setting up the vertical algorithm:<br/>${algoHTML}`,
        `Subtract the cents: ${c1}¢ - ${c2}¢ = ${c1 - c2}¢.<br/>Subtract the dollars: $${d1} - $${d2} = $${d1 - d2}.`
      ];
      hint = `Subtract the cents from the cents, and the dollars from the dollars.`;
    }
  } else if (activeVariant === 'foundation_make_whole_dollar') {
    // Making the Next Whole Dollar
    const d1 = Math.floor(Math.random() * 8) + 1;
    const c1 = [10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90][Math.floor(Math.random() * 11)];
    const v1 = d1 + c1 / 100;
    const nextD = d1 + 1;
    const v2 = nextD - v1;
    
    const v1Str = v1.toFixed(2);
    const nextDStr = nextD.toFixed(2);
    const diffStr = v2.toFixed(2);

    answer = diffStr;

    if (isMCQ) {
      askText = `$${v1Str} + [ ] = $${nextDStr}. What is the missing amount?`;
      const dist1 = (v2 + 0.1).toFixed(2);
      const dist2 = (v2 - 0.1).toFixed(2);
      const dist3 = ((100 - c1 + 10) / 100).toFixed(2);
      answer = `$${diffStr}`;
      mcqOptions = getUniqueOptions(answer, [dist1, dist2, dist3].map(d => `$${d}`));
      solutionSteps = [
        `We need to find how many more cents make $1.00.`,
        `$1.00 is 100 cents.`,
        `100¢ - ${c1}¢ = ${100 - c1}¢.`,
        `So, we need $${diffStr} to make $${nextDStr}.`
      ];
      hint = `How many more cents do you need to add to ${c1}¢ to make 100¢ ($1.00)?`;
    } else {
      let structText = `STORY: A ${foods[0]} costs $${nextDStr}. ${names[0]} has $${v1Str}. How much more money does ${names[0]} need to buy the ${foods[0]}?`;
      let shortText = `How much more must you add to $${v1Str} to make $${nextDStr}?`;
      askText = isStructure ? structText : shortText;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Working equation", expectedAnswer: `${nextDStr} - ${v1Str} = ${answer}` },
            { label: "Amount needed ($)", expectedAnswer: answer }
          ]
        });
      }
      
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          modelType: "PART_WHOLE",
          parts: [{ value: `$${v1Str}`, layoutSize: v1 }, { value: "?", layoutSize: v2 }],
          whole: `$${nextDStr}`,
          isStatic: true
        }
      });
      
      const algoHTML = getRenamingHtml(nextD, v1, v2);

      solutionSteps = [
        `Setting up the vertical algorithm:<br/>${algoHTML}`,
        `Find how many cents make the next whole dollar.`,
        `$1.00 = 100¢.`,
        `100¢ - ${c1}¢ = ${100 - c1}¢.`,
        `Therefore, they need $${diffStr}.`
      ];
      hint = `Subtract $${v1Str} from $${nextDStr} to find the difference.`;
    }
  } else if (activeVariant === 'foundation_change_from_10') {
    // Change from a $10 Note
    const c1 = [10, 20, 30, 40, 60, 70, 80, 90][Math.floor(Math.random() * 8)];
    const d1 = Math.floor(Math.random() * 7) + 1;
    const v1 = d1 + c1 / 100;
    const diff = 10 - v1;
    
    const v1Str = v1.toFixed(2);
    const diffStr = diff.toFixed(2);

    answer = diffStr;

    if (isMCQ) {
      askText = `Paid $10.00 for an item costing $${v1Str}. What is the change?`;
      const dist1 = (diff + 1).toFixed(2);
      const dist2 = (10 - d1 + (c1 / 100)).toFixed(2);
      const dist3 = (10 - d1 - ((100 - c1 + 10) / 100)).toFixed(2);
      answer = `$${diffStr}`;
      mcqOptions = getUniqueOptions(answer, [dist1, dist2, dist3].map(d => `$${d}`));
      solutionSteps = [
        `To find the change, subtract $${v1Str} from $10.00.`,
        `$10.00 - $${d1}.00 = $${10 - d1}.00.`,
        `$${10 - d1}.00 - 0.${c1} = $${diffStr}.`
      ];
      hint = `Subtract the dollars first, then subtract the cents from a whole dollar.`;
    } else {
      let structText = `STORY: ${names[0]} buys a ${items[0]} for $${v1Str}. They give the cashier a $10 note. How much change does ${names[0]} receive?`;
      let shortText = `Find the change when you pay for a $${v1Str} item with a $10 note.`;
      askText = isStructure ? structText : shortText;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Working equation", expectedAnswer: `10.00 - ${v1Str} = ${answer}` },
            { label: "Change received ($)", expectedAnswer: answer }
          ]
        });
      }
      
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          modelType: "PART_WHOLE",
          parts: [{ value: `$${v1Str}`, layoutSize: v1 }, { value: "?", layoutSize: diff }],
          whole: `$10.00`,
          isStatic: true
        }
      });
      
      const algoHTML = getRenamingHtml(10.00, v1, diff);

      solutionSteps = [
        `Setting up the vertical algorithm:<br/>${algoHTML}`,
        `Subtract the cost from the amount paid to find the change.`,
        `$10.00 - $${v1Str} = $${diffStr}.`
      ];
      hint = `Think of $10.00 as $9.00 and 100 cents.`;
    }
  } else if (activeVariant === 'foundation_visual_receipt') {
    // Visual Receipt/Menu Addition
    const itemA = foods[0].charAt(0).toUpperCase() + foods[0].slice(1);
    const itemB = foods[1].charAt(0).toUpperCase() + foods[1].slice(1);
    const itemC = foods[2].charAt(0).toUpperCase() + foods[2].slice(1);
    const itemD = foods[3].charAt(0).toUpperCase() + foods[3].slice(1);
    
    const priceA = (Math.floor(Math.random() * 5) + 1 + [10, 20, 50, 80][Math.floor(Math.random() * 4)] / 100);
    const priceB = (Math.floor(Math.random() * 4) + 1 + [10, 20, 30, 40][Math.floor(Math.random() * 4)] / 100);
    const priceC = (Math.floor(Math.random() * 3) + 1 + [15, 25, 45, 75][Math.floor(Math.random() * 4)] / 100);
    const priceD = (Math.floor(Math.random() * 6) + 1 + [5, 35, 65, 95][Math.floor(Math.random() * 4)] / 100);
    
    const priceAStr = priceA.toFixed(2);
    const priceBStr = priceB.toFixed(2);
    const priceCStr = priceC.toFixed(2);
    const priceDStr = priceD.toFixed(2);
    
    const total = (priceA + priceB).toFixed(2);
    
    answer = total;

    const receiptHtml = `
      <div class="max-w-sm mx-auto bg-amber-50 p-6 rounded-xl border-2 border-dashed border-amber-200 shadow-sm font-mono text-slate-700">
        <div class="text-center font-black text-xl mb-4 border-b-2 border-slate-300 pb-2 uppercase tracking-widest">Cafe Menu</div>
        <div class="flex justify-between gap-6 mb-2 text-lg">
          <span>${itemA}</span>
          <span class="font-bold text-slate-900">$${priceAStr}</span>
        </div>
        <div class="flex justify-between gap-6 mb-2 text-lg">
          <span>${itemC}</span>
          <span class="font-bold text-slate-900">$${priceCStr}</span>
        </div>
        <div class="flex justify-between gap-6 mb-2 text-lg">
          <span>${itemB}</span>
          <span class="font-bold text-slate-900">$${priceBStr}</span>
        </div>
        <div class="flex justify-between gap-6 text-lg">
          <span>${itemD}</span>
          <span class="font-bold text-slate-900">$${priceDStr}</span>
        </div>
      </div>
    `.replace(/\n/g, '');

    visualEngineStr = JSON.stringify({
      componentToRender: "HTML_CONTENT",
      componentData: {
        html: receiptHtml
      }
    });
    
    const bPadCount = Math.max(0, priceAStr.length - priceBStr.length);
    const bPad = bPadCount > 0 ? Array(bPadCount).fill('&nbsp;').join('') + priceBStr : priceBStr;
    const aPadCount = Math.max(0, priceBStr.length - priceAStr.length);
    const aPad = aPadCount > 0 ? Array(aPadCount).fill('&nbsp;').join('') + priceAStr : priceAStr;
    const sumPadCount = Math.max(priceAStr.length, priceBStr.length) - total.length;
    const sumPad = sumPadCount > 0 ? Array(sumPadCount).fill('&nbsp;').join('') + total : total;
    
    const algoHTML = `<div style="font-family: monospace; text-align: right; width: fit-content; margin: 0 auto; font-size: 1.2rem; display: flex; flex-direction: column; align-items: flex-end; padding-top: 1rem;"><div>&nbsp;&nbsp;$&nbsp;${aPad}</div><div>+&nbsp;$&nbsp;${bPad}</div><hr style="border-top: 2px solid black; margin: 4px 0; width: 100%;" /><div>&nbsp;&nbsp;$&nbsp;${sumPad}</div></div>`;

    if (isMCQ) {
      askText = `Based on the menu, what is the total cost of ${getArticle(itemA)} ${itemA} and ${getArticle(itemB)} ${itemB}?`;
      const dist1 = (priceA + priceB + 1).toFixed(2);
      const dist2 = (priceA + priceB - 1).toFixed(2);
      const dist3 = Math.abs(priceA - priceB).toFixed(2);
      answer = `$${total}`;
      mcqOptions = getUniqueOptions(answer, [dist1, dist2, dist3].map(d => `$${d}`));
      solutionSteps = [
        `From the menu, ${itemA} costs $${priceAStr}.`,
        `From the menu, ${itemB} costs $${priceBStr}.`,
        `Setting up the vertical algorithm:<br/>${algoHTML}`
      ];
      hint = `Look at the table to find the prices, then add them up.`;
    } else {
      let structText = `STORY: ${names[0]} looks at a cafe menu. They order ${getArticle(itemA)} ${itemA} and ${getArticle(itemB)} ${itemB}. What is their total bill?`;
      let shortText = `Look at the menu. Find the total cost of ${getArticle(itemA)} ${itemA} and ${getArticle(itemB)} ${itemB}.`;
      askText = isStructure ? structText : shortText;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Working equation", expectedAnswer: `${priceAStr} + ${priceBStr} = ${answer}` },
            { label: "Total bill ($)", expectedAnswer: answer }
          ]
        });
      }
      
      solutionSteps = [
        `From the menu, ${itemA} costs $${priceAStr}.`,
        `From the menu, ${itemB} costs $${priceBStr}.`,
        `Setting up the vertical algorithm:<br/>${algoHTML}`
      ];
      hint = `Find the prices from the menu and add them using a vertical algorithm.`;
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
    CRITICAL INSTRUCTION: For 'visualEngine', you MUST output EXACTLY the JSON object provided in the OUTPUT FORMAT template below. Do NOT hallucinate your own visual models.
    CRITICAL INSTRUCTION: For 'inputRequirement', you MUST output EXACTLY the JSON object provided in the OUTPUT FORMAT template below. Do NOT change the labels or steps.
    
    ${getFormatInstructions(visualEngineStr, inputRequirementStr)}`
  };
};
