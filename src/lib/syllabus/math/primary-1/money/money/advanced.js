export function advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic) {
  const commonMeta = { level, topic, subtopic: 'Money', type: zodType, difficulty: zodDiff, strand: 'Measurement and Geometry', subject: 'Math', gradeLevel: 'P1', heuristic: 'Multi-Step Financial Logic' };
  const inputType = isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT';

  // 1. Core Procedural Base Generator Engine (Advanced Max $100 Cap)
  const pool = ['10¢', '20¢', '50¢', '$1', '$2', '$5', '$10', '$50', '$100'];
  const generatedItems = [];
  let sumCents = 0;

  // Multi-step complex questions typically present 5 to 8 coins/notes visually
  const targetCount = Math.floor(Math.random() * 4) + 5; 

  for (let i = 0; i < 15; i++) {
    if (generatedItems.length >= targetCount) break;
    
    const randomItem = pool[Math.floor(Math.random() * pool.length)];
    const itemValueCents = randomItem.endsWith('¢') 
      ? parseInt(randomItem.replace('¢', ''), 10) 
      : parseInt(randomItem.replace('$', ''), 10) * 100;

    if (sumCents + itemValueCents <= 10000) {
      generatedItems.push(randomItem);
      sumCents += itemValueCents;
    }
  }

  // Fallback anchor to guarantee the payload never defaults to empty
  if (generatedItems.length === 0) {
    generatedItems.push('$10', '$5', '$2', '50¢');
    sumCents = 1750;
  }

  const displayTotal = `$${(sumCents / 100).toFixed(2)}`;

  // 2. Specialized Payload Structuring & Rule Context Mappings
  const componentData = {
    items: generatedItems,
    total: displayTotal
  };

  let variantConstitution = "Execute a multi-step calculation using the rendered monetary total.";

  if (activeVariant === 'advanced_transaction_change') {
    variantConstitution = `3-step shopping transaction logic. (e.g., Calculate the sum of multiple items, evaluate it against the shown currency wallet total of ${displayTotal}, and find the exact final change).`;
  } else if (activeVariant === 'advanced_savings_and_spending') {
    variantConstitution = `Sequential timeline ledger calculation. Start with the rendered collection worth ${displayTotal}. Apply a precise savings addition step, followed by an abstract subtraction spending step. Calculate the final balance.`;
  } else if (activeVariant === 'advanced_pooled_affordability') {
    // Generate a second person's separate wallet collection to combine
    componentData.secondPersonItems = Math.random() > 0.5 ? ['$5', '50¢', '20¢'] : ['$10', '$2'];
    variantConstitution = `Pooling wallets puzzle. Character A has the primary visual items totaling ${displayTotal}. Character B has a separate collection containing: ${componentData.secondPersonItems.join(', ')}. They pool their money to buy an item. Calculate the joint change or purchasing capability.`;
  } else if (activeVariant === 'advanced_missing_price_deduction') {
    componentData.changeReceived = Math.random() > 0.5 ? '$2.00' : '$1.50';
    variantConstitution = `Missing price value deduction logic. The total note value shown is ${displayTotal}. This money is used to buy item A and item B. The change received is ${componentData.changeReceived}. If item A costs a known amount, isolate the price of item B.`;
  } else if (activeVariant === 'advanced_max_combination_budget') {
    variantConstitution = `Budget threshold maximum boundary mapping. Given a fixed item unit price menu, calculate the absolute maximum count of item combinations or pairs that can be safely processed without exceeding the shown total budget of ${displayTotal}.`;
  } else if (activeVariant === 'advanced_comparative_remaining') {
    variantConstitution = `Comparative balance discrepancy calculation. Character A and Character B start with different values (using ${displayTotal} as a root value). They execute separate shopping transactions. Calculate the resulting final difference between their remaining balances.`;
  } else if (activeVariant === 'advanced_savings_target_shortfall') {
    componentData.savingsTarget = `$${((sumCents + 2500) / 100).toFixed(2)}`; // Set goal $25 higher
    variantConstitution = `Financial target gap isolation. The current savings collection displayed equals ${displayTotal}. The target goal to purchase a major object is ${componentData.savingsTarget}. Isolate the exact difference shortfall remaining.`;
  } else if (activeVariant === 'advanced_exact_combination_matching') {
    componentData.itemMenu = { pencilCase: '$6.50', notebook: '$3.50', toyCar: '$10.00', book: '$12.00' };
    const menuItems = Object.entries(componentData.itemMenu).map(([k, v]) => `${k} (${v})`).join(', ');
    variantConstitution = `Exact budget depletion logic. The student must identify which items from this menu [${menuItems}] exactly add up to the wallet total of ${displayTotal}.`;
  } else if (activeVariant === 'advanced_reverse_allowance_tracking') {
    variantConstitution = `Reverse engineering calculation path. Work completely backward from the display total of ${displayTotal} as the *final* remaining sum, reversing preceding multi-step transactions to solve for the unknown initial starting balance.`;
  } else if (activeVariant === 'advanced_multi_item_gift_sharing') {
    variantConstitution = `Distributive transactional mathematics. Calculate the total expense of purchasing identical gift items for a set count of recipients using the visual cash amount of ${displayTotal}, solving for leftover change.`;
  }

  // 3. Formulate the Strict Formatting Constraints
  const promptObject = {
    meta: commonMeta,
    content: {
      questionText: "[AI: Populate customized Advanced question text context following strict structural type rules]", 
      hint: "[AI: Outline a multi-step strategic hints architecture breakdown without revealing intermediate or final arithmetic results]",
      options: isMCQ ? ["Placeholder1", "Placeholder2", "Placeholder3", "Placeholder4"] : null, 
      finalAnswer: "[AI: Insert final exact numeric match string or explicit currency calculation output]",
      solutionSteps: "[AI: Provide full step-by-step mathematical reasoning block lines showing all multi-stage equations]"
    },
    visualEngine: {
      componentToRender: "SINGAPORE_MONEY",
      componentData: componentData
    },
    inputRequirement: { inputType }
  };

  const constitution = isShort ? `SHORT QUESTION MANDATE: Pure mathematical calculation. NO character names or stories. Keep text brief (e.g., 'Find the total after subtracting $5.50'). Focus: ${variantConstitution}` :
                       isStructure ? `STRUCTURED QUESTION MANDATE: A localized multi-step word problem scenario utilizing Singapore context anchors, character names, and cohesive narrative tracking scenarios. Focus rule: ${variantConstitution}` :
                       `MCQ MANDATE: A standard complex scenario problem with 4 options matching the target validation constraint. Focus rule: ${variantConstitution}`;

  const instructions = `
    # TASK
    Generate a Primary 1 Mathematics Advanced-tier money question.
    Format Mandate: ${constitution}
    
    # CONTEXT
    - Variant: ${activeVariant}
    - Localization: Use Singapore currency (10¢, 20¢, 50¢, $1, $2, $5, $10, $50, $100).
    
    # CONSTRAINTS
    - DO NOT alter 'visualEngine' items or total. The total is exactly: ${displayTotal}.
    - Accuracy: 'finalAnswer' and 'solutionSteps' must be derived from ${displayTotal}.
    
    # OUTPUT MANDATE
    Return ONLY valid JSON. Replace placeholders with content. No markdown blocks.
    
    # SCHEMA
    ${JSON.stringify(promptObject)}
  `.trim();

  return { aiPrompt: instructions, parseResponse: (json) => json };
}