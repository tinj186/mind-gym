export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic) {
  const commonMeta = { level, topic, subtopic: 'Money', type: zodType, difficulty: zodDiff, strand: 'Measurement and Geometry', subject: 'Math', gradeLevel: 'P1', heuristic: 'Money Calculations' };
  const inputType = isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT';

  // 1. Core Procedural Generator Engine for Standard Tier (Max $50 Boundary)
  const fullPool = ['10¢', '20¢', '50¢', '$1', '$2', '$5', '$10', '$50'];
  const generatedItems = [];
  let sumCents = 0;

  // Set asset volume limits based on variant design parameters
  let targetCount = Math.floor(Math.random() * 3) + 3; // 3 to 5 pieces default
  if (activeVariant === 'standard_value_exchange') targetCount = 1; // Single item to break down

  // Safe generation loop bounded within $50.00 max limit
  for (let i = 0; i < 12; i++) {
    if (generatedItems.length >= targetCount) break;
    
    const randomItem = fullPool[Math.floor(Math.random() * fullPool.length)];
    const itemValueCents = randomItem.endsWith('¢') 
      ? parseInt(randomItem.replace('¢', ''), 10) 
      : parseInt(randomItem.replace('$', ''), 10) * 100;

    if (sumCents + itemValueCents <= 5000) {
      generatedItems.push(randomItem);
      sumCents += itemValueCents;
    }
  }

  // Fallback to guarantee values are never empty
  if (generatedItems.length === 0) {
    generatedItems.push('$5', '$2', '50¢');
    sumCents = 750;
  }

  const displayTotal = sumCents >= 100 ? `$${(sumCents/100).toFixed(2)}` : `${sumCents}¢`;

  // 2. Inject context parameters matching target variant profiles
  const componentData = {
    items: generatedItems,
    total: displayTotal
  };

  let variantConstitution = "Calculate the total amount of money shown.";

  // Tailor runtime rules and target criteria context fields
  if (activeVariant === 'standard_value_exchange') {
    variantConstitution = `Frame around currency denomination exchange. (e.g., How many smaller coins match the rendered parent value of ${displayTotal}?).`;
  } else if (activeVariant === 'standard_two_item_total') {
    variantConstitution = `Frame around combining costs. (e.g., Buying an item matching ${displayTotal} and a second item. Find the combined total cost).`;
  } else if (activeVariant === 'standard_calculating_change') {
    const paidOptions = sumCents <= 500 ? [500, 1000] : sumCents <= 1000 ? [1000, 5000] : [5000];
    const rawPaid = paidOptions[Math.floor(Math.random() * paidOptions.length)];
    componentData.paidAmount = `$${(rawPaid / 100).toFixed(2)}`;
    variantConstitution = `Frame around transaction change. The item price is exactly ${displayTotal}. The student pays with a ${componentData.paidAmount} note. Calculate the change.`;
  } else if (activeVariant === 'standard_affordability_check') {
    const targetDiff = (Math.floor(Math.random() * 3) + 1) * 50; // shift by 50c increments
    const itemPriceCents = Math.random() > 0.5 ? sumCents + targetDiff : Math.max(50, sumCents - targetDiff);
    componentData.targetPrice = `$${(itemPriceCents / 100).toFixed(2)}`;
    variantConstitution = `Frame around an affordability evaluation. Compare the visual set worth ${displayTotal} against an object priced at ${componentData.targetPrice}. State if they can afford it or determine the comparison boolean outcome.`;
  } else if (activeVariant === 'standard_shortfall_needed') {
    const shortfallCents = (Math.floor(Math.random() * 4) + 1) * 50;
    componentData.targetPrice = `$${((sumCents + shortfallCents) / 100).toFixed(2)}`;
    variantConstitution = `Frame around finding shortfalls. The user wants to buy an item costing ${componentData.targetPrice} but only has the visual set worth ${displayTotal}. Find the extra shortfall amount needed.`;
  } else if (activeVariant === 'standard_price_comparison') {
    variantConstitution = `Frame around price comparison rankings using ${displayTotal} as a baseline value anchor compared against other abstract prices.`;
  } else if (activeVariant === 'standard_amount_difference') {
    variantConstitution = `Frame around tracking differences. Person A has the visual collection totaling ${displayTotal}. Person B has a different configuration. Calculate the numeric difference between their amounts.`;
  } else if (activeVariant === 'standard_equivalent_sets') {
    variantConstitution = `Frame around equivalence matching. Identify an alternate coin/note configuration that results in the exact same total sum value of ${displayTotal}.`;
  } else if (activeVariant === 'standard_reverse_price_lookup') {
    const rawChange = (Math.floor(Math.random() * 3) + 1) * 100;
    componentData.changeReceived = `$${(rawChange / 100).toFixed(2)}`;
    variantConstitution = `Frame around reverse subtraction calculation loops. The student pays for an item with the visual notes worth ${displayTotal} and receives ${componentData.changeReceived} back in change. Deducing the original item price.`;
  } else if (activeVariant === 'standard_multi_item_change') {
    variantConstitution = `Frame as a 2-step math calculation problem. Sum up multiple items within a transaction flow using the visual baseline total ${displayTotal}.`;
  }

  const promptObject = {
    meta: commonMeta,
    content: {
      questionText: "[AI: Generate a clear P1 money question customized to the target variant task context profile]", 
      hint: "[AI: Provide a step-by-step counting breakdown or strategic approach hint without revealing the final numeric answer]",
      options: isMCQ ? ["Placeholder1", "Placeholder2", "Placeholder3", "Placeholder4"] : null, 
      finalAnswer: "[AI: Insert calculated numeric or currency response string]",
      solutionSteps: "[AI: Detail full calculation step-by-step math pathway equations]"
    },
    visualEngine: {
      componentToRender: "SINGAPORE_MONEY",
      componentData: componentData
    },
    inputRequirement: { inputType }
  };

  const constitution = isShort ? "SHORT QUESTION MANDATE: Pure mathematical counting notation only. You must NOT include character names, shopping stories, backstories, or narrative text. Keep the questionText text brief and direct (e.g., 'Count the total amount of money shown below.')." :
                       isStructure ? "STRUCTURED QUESTION MANDATE: A localized simple word problem scenario utilizing Singapore context anchors, character names, or real-world transactions (e.g., 'Siti has these notes in her purse. She buys a bun...')." :
                       "MCQ MANDATE: A standard multiple-choice word problem scenario with 4 distinct options.";

  const instructions = `
    TASK: Generate a Primary 1 Mathematics Standard-tier money question following the structural rules of: ${constitution}.
    LOCALIZATION: Singapore currency standards (10¢, 20¢, 50¢, $1, $2, $5, $10, $50).
    
    TARGET SYLLABUS VARIANT CODE REFERENCE: ${activeVariant}
    
    CRITICAL GENERATION PARAMETERS:
    - You MUST NEVER alter the array tokens or parameters inside 'visualEngine'. Keep 'items' and 'total' exactly as structured.
    - Carefully calculate your 'finalAnswer' and 'solutionSteps' so they are mathematically derived from the exact item set value sum provided: ${displayTotal}.
    
    OUTPUT MANDATE: Replace all string brackets inside 'content'. Return ONLY a clean, parseable JSON object matching this schema blueprint structure:
    ${JSON.stringify(promptObject)}
  `;

  return { aiPrompt: instructions, parseResponse: (json) => json };
}