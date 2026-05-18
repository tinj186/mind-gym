export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic) {
  const commonMeta = { level, topic, subtopic: 'Money', type: zodType, difficulty: zodDiff, strand: 'Measurement and Geometry', subject: 'Math', gradeLevel: 'P1', heuristic: 'Money Counting' };
  const inputType = isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT';

  // Procedural generation of variables locally
  const coinOptions = ['10¢', '20¢', '50¢', '$1'];
  const noteOptions = ['$2', '$5', '$10'];
  const pool = activeVariant.includes('notes') ? noteOptions : coinOptions;
  
  const itemCount = Math.floor(Math.random() * 3) + 2; // 2 to 4 items
  const generatedItems = [];
  let sumCents = 0;

  for(let i=0; i < itemCount; i++) {
    const item = pool[Math.floor(Math.random() * pool.length)];
    const valCents = item.endsWith('¢') ? parseInt(item.replace('¢', ''), 10) : parseInt(item.replace('$', ''), 10) * 100;
    
    if (sumCents + valCents <= 2000) {
      generatedItems.push(item);
      sumCents += valCents;
    }
  }

  const displayTotal = sumCents >= 100 ? `$${(sumCents/100).toFixed(2)}` : `${sumCents}¢`;
  const wrongOptions = [
    sumCents >= 100 ? `$${((sumCents + 100)/100).toFixed(2)}` : `${sumCents + 10}¢`,
    sumCents >= 100 ? `$${((Math.max(10, sumCents - 50))/100).toFixed(2)}` : `${Math.max(5, sumCents - 20)}¢`,
    sumCents >= 100 ? `$${((sumCents + 50)/100).toFixed(2)}` : `${sumCents + 50}¢`
  ];

  const promptObject = {
    meta: commonMeta,
    content: {
      questionText: "How much money is in the wallet?",
      hint: "Count the dollars first, then count on the cents values.",
      options: isMCQ ? [displayTotal, ...wrongOptions].sort(() => Math.random() - 0.5) : null, 
      finalAnswer: displayTotal,
      solutionSteps: "Add the values: " + generatedItems.join(' + ') + " = " + displayTotal
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

  const constitution = isShort ? "SHORT: Pure mathematical counting. No names or stories." :
                       isStructure ? "STRUCTURED: Simple localized word problem (e.g., Siti has these coins...)." :
                       "MCQ: Standard question with 4 options.";

  const instructions = `
    TASK: Generate a Primary 1 Mathematics money counting question following the ${constitution}.
    If it is a STRUCTURED question, create a simple 1-sentence localized shopping story context using the exact items provided.
    
    TARGET VARIANT WORKFLOW: ${activeVariant}
    LOCALIZATION: Singapore currency (10¢, 20¢, 50¢, $1, $2, $5, $10).
    
    CRITICAL: You must NEVER alter the numbers or tokens in 'finalAnswer', 'options', or 'visualEngine'. Keep them exactly as provided.

    Return ONLY a valid JSON object matching this structure:
    ${JSON.stringify(promptObject)}
  `;

  return { aiPrompt: instructions, parseResponse: (json) => json };
}