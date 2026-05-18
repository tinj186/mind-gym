export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic) {
  const commonMeta = { level, topic, subtopic: 'Money', type: zodType, difficulty: zodDiff, strand: 'Measurement and Geometry', subject: 'Math', gradeLevel: 'P1', heuristic: 'Money Counting' };
  const inputType = isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT';

  // 1. Setup targeted asset pools to strictly match variant definitions
  let pool = [];
  let itemCount = 3;

  if (activeVariant === 'foundation_counting_coins') {
    pool = ['10¢', '20¢', '50¢', '$1'];
    itemCount = Math.floor(Math.random() * 3) + 3; // 3 to 5 coins
  } else if (activeVariant === 'foundation_identifying_notes') {
    pool = ['$2', '$5', '$10'];
    itemCount = Math.floor(Math.random() * 2) + 2; // 2 to 3 notes
  } else {
    // Mixed, Comparing, and Matching variants utilize a full combined pool
    pool = ['10¢', '20¢', '50¢', '$1', '$2', '$5', '$10'];
    itemCount = Math.floor(Math.random() * 3) + 4; // 4 to 6 asset structures
  }

  // 2. Build the randomized procedural configuration array within strict syllabus boundaries
  const generatedItems = [];
  let sumCents = 0;

  for (let i = 0; i < itemCount; i++) {
    const item = pool[Math.floor(Math.random() * pool.length)];
    const valCents = item.endsWith('¢') ? parseInt(item.replace('¢', ''), 10) : parseInt(item.replace('$', ''), 10) * 100;
    
    // Hard Upper Capping Restriction: Maximum $20 total for Foundation tier questions
    if (sumCents + valCents <= 2000) {
      generatedItems.push(item);
      sumCents += valCents;
    }
  }

  // Fallback check to guarantee the array is never empty
  if (generatedItems.length === 0) {
    generatedItems.push('$2', '50¢');
    sumCents = 250;
  }

  const displayTotal = `$${(sumCents / 100).toFixed(2)}`;

  // 3. Assemble the dynamic payload contract
  const promptObject = {
    meta: commonMeta,
    content: {
      questionText: "[AI: Generate clear P1 money counting question customized to the target variant task context]", 
      hint: "[AI: Provide a conceptual coin/note checking breakdown hint without revealing the final sum]",
      options: isMCQ ? ["Placeholder1", "Placeholder2", "Placeholder3", "Placeholder4"] : null, 
      finalAnswer: "[AI: Insert dynamically calculated numeric value or string amount]",
      solutionSteps: "[AI: Show step-by-step arithmetic totaling calculations]"
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

  // 4. Set tailored constitution guidelines to guide the text layout rules
  let variantGuideline = "Count the total monetary sum of the items displayed.";
  if (activeVariant === 'foundation_comparing_values') {
    variantGuideline = "Frame the question around comparison (e.g., Siti has these coins. Does she have enough to buy an item costing a specific static amount, or does she have more/less than a target value?).";
  } else if (activeVariant === 'foundation_matching_exact_amount') {
    variantGuideline = "Frame the question around target matching (e.g., Identify which choice or target price matches the visual set of assets provided).";
  }

  const constitution = isShort ? "SHORT QUESTION MANDATE: Pure mathematical counting notation only. You must NOT include character names, shopping stories, backstories, or narrative text. Keep the questionText text brief and direct (e.g., 'Count the total amount of money shown below.')." :
                       isStructure ? "STRUCTURED QUESTION MANDATE: A localized simple word problem scenario utilizing Singapore context anchors, character names, or real-world transactions (e.g., 'Siti has these notes in her purse. She buys a bun...')." :
                       "MCQ MANDATE: A standard multiple-choice word problem scenario with 4 distinct options.";

  const instructions = `
    TASK: Generate a Primary 1 Mathematics money question following the ${constitution}.
    LOCALIZATION: Singapore currency representations (10¢, 20¢, 50¢, $1, $2, $5, $10).
    
    CRITICAL GENERATION PARAMETERS:
    - You MUST NEVER alter the tokens, numbers, or elements present inside 'visualEngine'. Keep them exactly as provided.
    - Align your 'finalAnswer' calculation directly to match the mathematical sum of the provided items data: ${displayTotal} (unless a comparison scenario requires a boolean response or specific flag value).
    
    OUTPUT MANDATE: Replace all string placeholders within the 'content' block. Return ONLY a valid JSON object structure.
    ${JSON.stringify(promptObject)}
  `;

  return { aiPrompt: instructions, parseResponse: (json) => json };
}