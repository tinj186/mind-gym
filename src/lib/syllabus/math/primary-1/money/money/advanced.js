export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic) {
  const commonMeta = { level, topic, subtopic: 'Money', type: zodType, difficulty: zodDiff, strand: 'Measurement and Geometry', subject: 'Math', gradeLevel: 'P1', heuristic: 'Multi-Step Money Problems' };
  const inputType = isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT';

  // Procedural generation: Large pool for Advanced tier
  const pool = ['10¢', '20¢', '50¢', '$1', '$2', '$5', '$10'];
  const itemCount = Math.floor(Math.random() * 4) + 6; // 6 to 9 items
  const generatedItems = [];
  let sumCents = 0;

  for(let i=0; i < itemCount; i++) {
    const item = pool[Math.floor(Math.random() * pool.length)];
    const valCents = item.endsWith('¢') ? parseInt(item.replace('¢', ''), 10) : parseInt(item.replace('$', ''), 10) * 100;
    
    // Strict Parameter: $100 Cap
    if (sumCents + valCents <= 10000) {
      generatedItems.push(item);
      sumCents += valCents;
    }
  }

  const displayTotal = `$${(sumCents/100).toFixed(2)}`;
  const wrongOptions = [
    `$${((sumCents + 1000)/100).toFixed(2)}`,
    `$${((Math.max(1000, sumCents - 500))/100).toFixed(2)}`,
    `$${((sumCents + 2000)/100).toFixed(2)}`
  ];

  const promptObject = {
    meta: commonMeta,
    content: {
      questionText: "Ailing has some money in her purse. She buys a pencil for 80¢. How much money does she have left?", // Restored to questionText
      hint: "[AI: Provide a multi-step hint breakdown without revealing the answer]",
      options: isMCQ ? ["Placeholder1", "Placeholder2", "Placeholder3", "Placeholder4"] : null, 
      finalAnswer: "[AI: Insert calculated response]",
      solutionSteps: "[AI: Detail step by step calculation pathway]"
    },
    visualEngine: {
      componentToRender: "SINGAPORE_MONEY", // Directed to the isolated text-card troubleshooting block
      componentData: { 
        items: generatedItems,
        total: displayTotal
      }
    },
    inputRequirement: { inputType }
  };

  const constitution = isShort ? "SHORT (Pure math/notation only, NO story/names)" :
                       isStructure ? "STRUCTURED (Localized word problem with a story)" :
                       "MCQ (Word problem with 4 options)";

  const instructions = `
    TASK: Generate an Advanced Primary 1 Money question. 
    If the question type is STRUCTURED, rewrite the 'content.question' into a multi-step word problem (e.g. buying two items or calculating change) using the provided 'total' value.
    
    TARGET VARIANT WORKFLOW: ${activeVariant}
    CRITICAL: You must NEVER alter the numbers or tokens in 'finalAnswer' or 'visualEngine'. Keep them exactly as provided.

    OUTPUT MANDATE: Return ONLY a valid JSON object matching this structure:
    ${JSON.stringify(promptObject)}
  `;

  return { aiPrompt: instructions, parseResponse: (json) => json };
}