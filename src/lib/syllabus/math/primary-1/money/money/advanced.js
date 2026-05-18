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
      questionText: "How much money does Ailing have altogether?",
      hint: "Count the notes first, then add the coins.",
      options: isMCQ ? [displayTotal, ...wrongOptions].sort(() => Math.random() - 0.5) : null, 
      finalAnswer: displayTotal,
      solutionSteps: "Calculate sum of: " + generatedItems.join(', ') + " = " + displayTotal
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

  const constitution = isShort ? "SHORT (Pure math/notation only, NO story/names)" :
                       isStructure ? "STRUCTURED (Localized word problem with a story)" :
                       "MCQ (Word problem with 4 options)";

  const instructions = `
    TASK: Generate an Advanced Primary 1 Money question following the ${constitution}. 
    If it is a STRUCTURED question, rewrite 'content.questionText' into a multi-step word problem using the provided total.
    
    TARGET VARIANT WORKFLOW: ${activeVariant}
    CRITICAL: Never alter the numbers or tokens in 'finalAnswer', 'options', or 'visualEngine'.

    OUTPUT MANDATE: Return ONLY a valid JSON object matching this structure:
    ${JSON.stringify(promptObject)}
  `;

  return { aiPrompt: instructions, parseResponse: (json) => json };
}