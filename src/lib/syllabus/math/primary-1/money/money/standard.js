export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic) {
  const commonMeta = { level, topic, subtopic: 'Money', type: zodType, difficulty: zodDiff, strand: 'Measurement and Geometry', subject: 'Math', gradeLevel: 'P1', heuristic: 'Money Exchanges' };
  const inputType = isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT';

  // Procedural generation: Mixed pool for Standard tier
  const pool = ['10¢', '20¢', '50¢', '$1', '$2', '$5', '$10'];
  const itemCount = Math.floor(Math.random() * 3) + 4; // 4 to 6 items
  const generatedItems = [];
  let sumCents = 0;

  for(let i=0; i < itemCount; i++) {
    const item = pool[Math.floor(Math.random() * pool.length)];
    const valCents = item.endsWith('¢') ? parseInt(item.replace('¢', ''), 10) : parseInt(item.replace('$', ''), 10) * 100;
    
    if (sumCents + valCents <= 5000) {
      generatedItems.push(item);
      sumCents += valCents;
    }
  }

  const displayTotal = sumCents >= 100 ? `$${(sumCents/100).toFixed(2)}` : `${sumCents}¢`;
  const wrongOptions = [
    `$${((sumCents + 100)/100).toFixed(2)}`,
    `$${((Math.max(10, sumCents - 50))/100).toFixed(2)}`,
    `$${((sumCents + 50)/100).toFixed(2)}`
  ];

  const promptObject = {
    meta: commonMeta,
    content: {
      questionText: "How much money is shown altogether?",
      hint: "Add the dollars first, then add the cents.",
      options: isMCQ ? [displayTotal, ...wrongOptions].sort(() => Math.random() - 0.5) : null, 
      finalAnswer: displayTotal,
      solutionSteps: "List values: " + generatedItems.join(', ') + ". Sum = " + displayTotal
    },
    visualEngine: {
      componentToRender: "SINGAPORE_MONEY",
      componentData: { 
        items: generatedItems,
        total: displayTotal
      }
    },
    inputRequirement: { inputType }
  };

  const constitution = isShort ? "SHORT: Pure counting math." :
                       isStructure ? "STRUCTURED: Localized shopping story." :
                       "MCQ: Question with 4 options.";

  const instructions = `
    TASK: Generate a Standard P1 Money question following the ${constitution}.
    For STRUCTURED questions, create a localized Singapore shopping scenario using these values.
    
    TARGET VARIANT WORKFLOW: ${activeVariant}
    LOCALIZATION: Singapore currency (10¢, 20¢, 50¢, $1, $2, $5, $10).
    
    CRITICAL: Never alter the numbers in 'finalAnswer' or 'visualEngine'.

    Return ONLY a valid JSON object matching this structure:
    ${JSON.stringify(promptObject)}
  `;

  return { aiPrompt: instructions, parseResponse: (json) => json };
}