export const standardLogic = function (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let askText = '';
  let questionStemConstraint = '';
  let answer = '';
  let customConstraints = '';
  let inputRequirementStr = null;
  let visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: { hideVisual: true } });

  // Common random variables
  let divisor = Math.floor(Math.random() * 8) + 2; // 2 to 9
  let quotient = Math.floor(Math.random() * 9) + 2; // 2 to 10
  let remainder = Math.floor(Math.random() * (divisor - 1)) + 1; // 1 to divisor-1
  let dividend = (divisor * quotient) + remainder;

  if (activeVariant === 'standard_extracting_remainder') {
    if (isStructure) {
      askText = `Write a creative, concise word problem (under 3 sentences) using the name ${context.name} and the item ${selectedContextItem}. The story must involve dividing a total of ${dividend} ${selectedContextItem} into groups/boxes of ${divisor}. The final question must ask the student to find exactly how many ${selectedContextItem} are left over (unpacked).`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1 (Equation)", expectedAnswer: `${dividend} ÷ ${divisor} = ${quotient} R ${remainder}` },
          { label: "Step 2 (Final Answer)", expectedAnswer: String(remainder) }
        ]
      });
      customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${dividend} ÷ ${divisor} = ${quotient} R ${remainder}".
- For MULTI_STEP_INPUT Step 2 (Final Answer), the expectedAnswer MUST exactly be "${remainder}".`;
    } else if (isMCQ) {
      askText = `${context.name} packs ${dividend} ${selectedContextItem} into boxes of ${divisor}. How many ${selectedContextItem} are left over?`;
      questionStemConstraint = `- The question stem must clearly ask exactly: "${askText}"`;
    } else {
      askText = `${context.name} packs ${dividend} ${selectedContextItem} into boxes of ${divisor}. Find the number of unpacked ${selectedContextItem}.`;
      questionStemConstraint = `- The question stem must clearly ask exactly: "${askText}"`;
    }
    answer = String(remainder);

    if (isMCQ) {
      const d1 = String(quotient); // Quotient instead of remainder
      const d2 = String(remainder === 1 ? remainder + 1 : remainder - 1); // Off by one
      const d3 = String(remainder + 2); // Random wrong

      if (!customConstraints) customConstraints = '';
      customConstraints += `\n- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CARELESS_CALCULATION", and "${d3}" to "CARELESS_CALCULATION".`;
    }
  }
  else if (activeVariant === 'standard_reverse_calculation') {
    const unknownType = Math.floor(Math.random() * 3); // 0: Dividend, 1: Quotient, 2: Divisor
    
    if (unknownType === 0) { // Ask for Dividend
      if (isStructure) {
        askText = `Write a creative, concise word problem (under 3 sentences) using the name ${context.name} and the item ${selectedContextItem}. The story must describe ${quotient} groups/containers that each hold exactly ${divisor} ${selectedContextItem}, with ${remainder} ${selectedContextItem} left over. The final question must ask the student to find the total number of ${selectedContextItem} ${context.name} had at first.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1 (Equation)", expectedAnswer: `${quotient} x ${divisor} = ${quotient * divisor}` },
            { label: "Step 2 (Equation)", expectedAnswer: `${quotient * divisor} + ${remainder} = ${dividend}` },
            { label: "Step 3 (Final Answer)", expectedAnswer: String(dividend) }
          ]
        });
        customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${quotient} x ${divisor} = ${quotient * divisor}".
- For MULTI_STEP_INPUT Step 2, the expectedAnswer MUST exactly be "${quotient * divisor} + ${remainder} = ${dividend}".
- For MULTI_STEP_INPUT Step 3 (Final Answer), the expectedAnswer MUST exactly be "${dividend}".`;
      } else if (isMCQ) {
        askText = `A mystery number divided by ${divisor} gives a quotient of ${quotient} and a remainder of ${remainder}. What is the mystery number?`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      } else {
        askText = `___ ÷ ${divisor} = ${quotient} R ${remainder}`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      }
      answer = String(dividend);
      
      if (isMCQ) {
        const d1 = String(quotient * divisor);
        const d2 = String((quotient * divisor) + remainder + remainder);
        const d3 = String((quotient * divisor) - remainder);
        if (!customConstraints) customConstraints = '';
        customConstraints += `\n- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CONCEPTUAL_ERROR", and "${d3}" to "CONCEPTUAL_ERROR".`;
      }
    } else if (unknownType === 1) { // Ask for Quotient
      if (isStructure) {
        askText = `Write a creative, concise word problem (under 3 sentences) using the name ${context.name} and the item ${selectedContextItem}. The story must describe ${context.name} having ${dividend} ${selectedContextItem} and packing them into groups of ${divisor}. The story states there are ${remainder} ${selectedContextItem} left over. The final question must ask the student to find how many full groups were made.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1 (Equation)", expectedAnswer: `${dividend} - ${remainder} = ${quotient * divisor}` },
            { label: "Step 2 (Equation)", expectedAnswer: `${quotient * divisor} ÷ ${divisor} = ${quotient}` },
            { label: "Step 3 (Final Answer)", expectedAnswer: String(quotient) }
          ]
        });
        customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${dividend} - ${remainder} = ${quotient * divisor}".
- For MULTI_STEP_INPUT Step 2, the expectedAnswer MUST exactly be "${quotient * divisor} ÷ ${divisor} = ${quotient}".
- For MULTI_STEP_INPUT Step 3 (Final Answer), the expectedAnswer MUST exactly be "${quotient}".`;
      } else if (isMCQ) {
        askText = `${dividend} divided by ${divisor} gives a mystery quotient and a remainder of ${remainder}. What is the mystery quotient?`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      } else {
        askText = `${dividend} ÷ ${divisor} = ___ R ${remainder}`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      }
      answer = String(quotient);
      
      if (isMCQ) {
        const d1 = String(quotient + 1);
        const d2 = String(quotient - 1);
        const d3 = String(dividend);
        if (!customConstraints) customConstraints = '';
        customConstraints += `\n- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CARELESS_CALCULATION", "${d2}" to "CARELESS_CALCULATION", and "${d3}" to "CONCEPTUAL_ERROR".`;
      }
    } else { // Ask for Divisor
      if (isStructure) {
        askText = `Write a creative, concise word problem (under 3 sentences) using the name ${context.name} and the item ${selectedContextItem}. The story must describe ${context.name} having ${dividend} ${selectedContextItem} and packing them evenly into ${quotient} groups. The story states there are ${remainder} ${selectedContextItem} left over. The final question must ask the student to find how many ${selectedContextItem} were placed into each group.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1 (Equation)", expectedAnswer: `${dividend} - ${remainder} = ${quotient * divisor}` },
            { label: "Step 2 (Equation)", expectedAnswer: `${quotient * divisor} ÷ ${quotient} = ${divisor}` },
            { label: "Step 3 (Final Answer)", expectedAnswer: String(divisor) }
          ]
        });
        customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${dividend} - ${remainder} = ${quotient * divisor}".
- For MULTI_STEP_INPUT Step 2, the expectedAnswer MUST exactly be "${quotient * divisor} ÷ ${quotient} = ${divisor}".
- For MULTI_STEP_INPUT Step 3 (Final Answer), the expectedAnswer MUST exactly be "${divisor}".`;
      } else if (isMCQ) {
        askText = `${dividend} divided by a mystery number gives a quotient of ${quotient} and a remainder of ${remainder}. What is the mystery number?`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      } else {
        askText = `${dividend} ÷ ___ = ${quotient} R ${remainder}`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      }
      answer = String(divisor);
      
      if (isMCQ) {
        const d1 = String(divisor + 1);
        const d2 = String(divisor - 1);
        const d3 = String(quotient * divisor);
        if (!customConstraints) customConstraints = '';
        customConstraints += `\n- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CARELESS_CALCULATION", "${d2}" to "CARELESS_CALCULATION", and "${d3}" to "CONCEPTUAL_ERROR".`;
      }
    }
    
    if (isShort) {
      if (!customConstraints) customConstraints = '';
      customConstraints += `\n- isNotationVariant: true (DO NOT generate any word problem or story).`;
    }
  }
  else if (activeVariant === 'standard_extracting_quotient') {
    const askForRemainder = Math.random() > 0.5;

    if (isStructure) {
      const discardingScenarios = [
        `packing ${selectedContextItem} into containers`,
        `sharing ${selectedContextItem} equally among friends`,
        `cutting a large batch of ${selectedContextItem} into equal sets/pieces`,
        `organizing ${selectedContextItem} into equal groups or rows`
      ];
      const randomScenario = discardingScenarios[Math.floor(Math.random() * discardingScenarios.length)];

      if (askForRemainder) {
        askText = `Write a creative, concise word problem (under 3 sentences) using the name ${context.name}. The story must involve ${randomScenario}. Use ${dividend} as the total amount, and ${divisor} as the divisor. The final question must explicitly ask the student to find how many ${selectedContextItem} are left over (the waste/remainder). Do NOT explicitly use the word "remainder" in the story.`;
      } else {
        askText = `Write a creative, concise word problem (under 3 sentences) using the name ${context.name}. The story must involve ${randomScenario}. Use ${dividend} as the total amount, and ${divisor} as the divisor. The story must naturally imply that any leftovers cannot be used or shared. The final question must explicitly ask how many full groups/containers/pieces are formed. Do NOT explicitly use the words "discard" or "remainder" in the story.`;
      }
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1 (Equation)", expectedAnswer: `${dividend} ÷ ${divisor} = ${quotient} R ${remainder}` },
          { label: "Step 2 (Final Answer)", expectedAnswer: askForRemainder ? String(remainder) : String(quotient) }
        ]
      });
      customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${dividend} ÷ ${divisor} = ${quotient} R ${remainder}".
- For MULTI_STEP_INPUT Step 2 (Final Answer), the expectedAnswer MUST exactly be "${askForRemainder ? remainder : quotient}".`;
    } else if (isMCQ) {
      if (askForRemainder) {
        askText = `${context.name} shares ${dividend} ${selectedContextItem} equally among ${divisor} friends. How many ${selectedContextItem} are left over?`;
      } else {
        askText = `${context.name} shares ${dividend} ${selectedContextItem} equally among ${divisor} friends. What is the greatest number of ${selectedContextItem} each friend can get?`;
      }
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
    } else {
      if (askForRemainder) {
        askText = `Share ${dividend} ${selectedContextItem} equally among ${divisor} friends. How many ${selectedContextItem} are left over?`;
      } else {
        askText = `Share ${dividend} ${selectedContextItem} equally among ${divisor} friends. How many ${selectedContextItem} does each friend get?`;
      }
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
    }
    answer = askForRemainder ? String(remainder) : String(quotient);
    
    if (isMCQ) {
      let d1, d2, d3;
      if (askForRemainder) {
        d1 = String(quotient);
        d2 = String(remainder === 1 ? remainder + 1 : remainder - 1);
        d3 = String(remainder + 2);
      } else {
        d1 = String(quotient + 1);
        d2 = String(remainder);
        d3 = String(quotient - 1 === 0 ? quotient + 2 : quotient - 1);
      }
      
      if (!customConstraints) customConstraints = '';
      customConstraints += `\n- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CARELESS_CALCULATION", and "${d3}" to "CARELESS_CALCULATION".`;
    }
  }
  else if (activeVariant === 'standard_money_leftover') {
    divisor = Math.floor(Math.random() * 6) + 4; // 4 to 9 cost per item
    quotient = Math.floor(Math.random() * 6) + 3; // 3 to 8 items
    remainder = Math.floor(Math.random() * (divisor - 1)) + 1; // leftover money
    dividend = (divisor * quotient) + remainder;
    
    const unknownType = Math.floor(Math.random() * 4); // 0: Change, 1: Max Items, 2: Budget, 3: Cost

    if (unknownType === 0) { // Ask for Change (Remainder)
      if (isStructure) {
        askText = `Write a creative, concise word problem (under 3 sentences) using the name ${context.name} and the item ${selectedContextItem}. The story must involve a shopping context where ${context.name} has a budget of $${dividend} and wants to buy as many ${selectedContextItem} as possible that cost $${divisor} each. The final question must ask how much money (change) she has left over after paying.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1 (Equation)", expectedAnswer: `${dividend} ÷ ${divisor} = ${quotient} R ${remainder}` },
            { label: "Step 2 (Final Answer)", expectedAnswer: `$${remainder}` }
          ]
        });
        customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${dividend} ÷ ${divisor} = ${quotient} R ${remainder}".
- For MULTI_STEP_INPUT Step 2 (Final Answer), the expectedAnswer MUST exactly be "$${remainder}".`;
      } else if (isMCQ) {
        askText = `${context.name} has $${dividend}. She buys as many $${divisor} ${selectedContextItem} as she can. How much money is left over?`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      } else {
        askText = `${context.name} has $${dividend}. She buys ${selectedContextItem} that cost $${divisor} each. How much change does she get?`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      }
      answer = `$${remainder}`;
      if (isMCQ) {
        const d1 = `$${quotient}`;
        const d2 = `$${divisor}`;
        const d3 = `$${remainder === 1 ? remainder + 1 : remainder - 1}`;
        if (!customConstraints) customConstraints = '';
        customConstraints += `\n- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CONCEPTUAL_ERROR", and "${d3}" to "CARELESS_CALCULATION".`;
      }
    } else if (unknownType === 1) { // Ask for Max Items (Quotient)
      if (isStructure) {
        askText = `Write a creative, concise word problem (under 3 sentences) using the name ${context.name} and the item ${selectedContextItem}. The story must involve a shopping context where ${context.name} has a budget of $${dividend} and wants to buy as many ${selectedContextItem} as possible that cost $${divisor} each. The final question must ask exactly how many ${selectedContextItem} she can buy in total.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1 (Equation)", expectedAnswer: `${dividend} ÷ ${divisor} = ${quotient} R ${remainder}` },
            { label: "Step 2 (Final Answer)", expectedAnswer: String(quotient) }
          ]
        });
        customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${dividend} ÷ ${divisor} = ${quotient} R ${remainder}".
- For MULTI_STEP_INPUT Step 2 (Final Answer), the expectedAnswer MUST exactly be "${quotient}".`;
      } else if (isMCQ) {
        askText = `${context.name} has $${dividend}. She buys as many $${divisor} ${selectedContextItem} as she can. How many ${selectedContextItem} does she buy?`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      } else {
        askText = `${context.name} has $${dividend}. She buys ${selectedContextItem} that cost $${divisor} each. How many ${selectedContextItem} can she buy?`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      }
      answer = String(quotient);
      if (isMCQ) {
        const d1 = String(remainder);
        const d2 = String(quotient + 1);
        const d3 = String(quotient - 1 === 0 ? 2 : quotient - 1);
        if (!customConstraints) customConstraints = '';
        customConstraints += `\n- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CARELESS_CALCULATION", and "${d3}" to "CARELESS_CALCULATION".`;
      }
    } else if (unknownType === 2) { // Ask for Budget (Dividend)
      if (isStructure) {
        askText = `Write a creative, concise word problem (under 3 sentences) using the name ${context.name} and the item ${selectedContextItem}. The story must involve ${context.name} going shopping. She buys exactly ${quotient} ${selectedContextItem} that cost $${divisor} each. After paying, she receives $${remainder} in change. The final question must ask how much money she had at first.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1 (Equation)", expectedAnswer: `${quotient} x ${divisor} = ${quotient * divisor}` },
            { label: "Step 2 (Equation)", expectedAnswer: `${quotient * divisor} + ${remainder} = ${dividend}` },
            { label: "Step 3 (Final Answer)", expectedAnswer: `$${dividend}` }
          ]
        });
        customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${quotient} x ${divisor} = ${quotient * divisor}".
- For MULTI_STEP_INPUT Step 2, the expectedAnswer MUST exactly be "${quotient * divisor} + ${remainder} = ${dividend}".
- For MULTI_STEP_INPUT Step 3 (Final Answer), the expectedAnswer MUST exactly be "$${dividend}".`;
      } else if (isMCQ) {
        askText = `${context.name} buys ${quotient} ${selectedContextItem} that cost $${divisor} each. She has $${remainder} left over. How much money did she have at first?`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      } else {
        askText = `${context.name} buys ${quotient} ${selectedContextItem} for $${divisor} each and has $${remainder} left. How much did she start with?`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      }
      answer = `$${dividend}`;
      if (isMCQ) {
        const d1 = `$${quotient * divisor}`;
        const d2 = `$${(quotient * divisor) - remainder}`;
        const d3 = `$${(quotient * divisor) + remainder + remainder}`;
        if (!customConstraints) customConstraints = '';
        customConstraints += `\n- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CONCEPTUAL_ERROR", and "${d3}" to "CONCEPTUAL_ERROR".`;
      }
    } else { // Ask for Cost (Divisor)
      if (isStructure) {
        askText = `Write a creative, concise word problem (under 3 sentences) using the name ${context.name} and the item ${selectedContextItem}. The story must involve ${context.name} bringing $${dividend} to the store. She buys exactly ${quotient} identical ${selectedContextItem}. After paying, she receives $${remainder} in change. The final question must ask exactly how much one ${selectedContextItem} cost.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1 (Equation)", expectedAnswer: `${dividend} - ${remainder} = ${quotient * divisor}` },
            { label: "Step 2 (Equation)", expectedAnswer: `${quotient * divisor} ÷ ${quotient} = ${divisor}` },
            { label: "Step 3 (Final Answer)", expectedAnswer: `$${divisor}` }
          ]
        });
        customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${dividend} - ${remainder} = ${quotient * divisor}".
- For MULTI_STEP_INPUT Step 2, the expectedAnswer MUST exactly be "${quotient * divisor} ÷ ${quotient} = ${divisor}".
- For MULTI_STEP_INPUT Step 3 (Final Answer), the expectedAnswer MUST exactly be "$${divisor}".`;
      } else if (isMCQ) {
        askText = `${context.name} has $${dividend}. She buys ${quotient} identical ${selectedContextItem} and has $${remainder} left over. How much did each ${selectedContextItem} cost?`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      } else {
        askText = `${context.name} buys ${quotient} ${selectedContextItem} with $${dividend} and gets $${remainder} change. What is the cost of one ${selectedContextItem}?`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      }
      answer = `$${divisor}`;
      if (isMCQ) {
        const d1 = `$${divisor + 1}`;
        const d2 = `$${divisor - 1}`;
        const d3 = `$${quotient * divisor}`;
        if (!customConstraints) customConstraints = '';
        customConstraints += `\n- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CARELESS_CALCULATION", "${d2}" to "CARELESS_CALCULATION", and "${d3}" to "CONCEPTUAL_ERROR".`;
      }
    }
  }
  else if (activeVariant === 'standard_smallest_divisor') {
    const findLargestRemainder = Math.random() > 0.5;

    if (findLargestRemainder) { // Given Divisor, find Largest Remainder
      divisor = Math.floor(Math.random() * 6) + 4; // 4 to 9
      const maxRemainder = divisor - 1;
      
      if (isStructure) {
        askText = `Write a creative, concise word problem (under 3 sentences) using the name ${context.name} and the item ${selectedContextItem}. The story must involve ${context.name} packing a mystery total number of ${selectedContextItem} into equal groups of ${divisor}. The story should state that some ${selectedContextItem} were left over (not enough to form another group). The final question must ask the student for the LARGEST possible number of ${selectedContextItem} that could be left over.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
        
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1 (Equation)", expectedAnswer: `${divisor} - 1 = ${maxRemainder}` },
            { label: "Step 2 (Final Answer)", expectedAnswer: String(maxRemainder) }
          ]
        });
        customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${divisor} - 1 = ${maxRemainder}".
- For MULTI_STEP_INPUT Step 2 (Final Answer), the expectedAnswer MUST exactly be "${maxRemainder}".`;
      } else if (isMCQ) {
        askText = `A mystery number is divided by ${divisor}. What is the largest possible remainder?`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      } else {
        askText = `When dividing by ${divisor}, what is the greatest possible remainder?`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      }
      answer = String(maxRemainder);
      
      if (isMCQ) {
        const d1 = String(divisor); // Remainder cannot equal divisor
        const d2 = String(divisor + 1); // Remainder cannot be larger
        const d3 = String(maxRemainder - 1);
        if (!customConstraints) customConstraints = '';
        customConstraints += `\n- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CONCEPTUAL_ERROR", and "${d3}" to "CARELESS_CALCULATION".`;
      }
    } else { // Given Remainder, find Smallest Divisor
      remainder = Math.floor(Math.random() * 6) + 4; // 4 to 9
      const minDivisor = remainder + 1;
      
      if (isStructure) {
        askText = `Write a creative, concise word problem (under 3 sentences) using the name ${context.name} and the item ${selectedContextItem}. The story must involve ${context.name} packing a mystery total number of ${selectedContextItem} into equal groups, but realizing there are exactly ${remainder} ${selectedContextItem} left over (not enough to fill another group). The final question must ask the student for the SMALLEST possible number of ${selectedContextItem} that a full group could hold.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
        
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1 (Equation)", expectedAnswer: `${remainder} + 1 = ${minDivisor}` },
            { label: "Step 2 (Final Answer)", expectedAnswer: String(minDivisor) }
          ]
        });
        customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${remainder} + 1 = ${minDivisor}".
- For MULTI_STEP_INPUT Step 2 (Final Answer), the expectedAnswer MUST exactly be "${minDivisor}".`;
      } else if (isMCQ) {
        askText = `When a number is divided by a mystery number, the remainder is ${remainder}. What is the smallest possible value for the mystery number?`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      } else {
        askText = `A number is divided by a mystery number. The remainder is ${remainder}. What is the smallest possible value of the mystery number?`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      }
      answer = String(minDivisor);
      
      if (isMCQ) {
        const d1 = String(remainder); // Divisor cannot equal remainder
        const d2 = String(remainder - 1); // Divisor must be greater than remainder
        const d3 = String(remainder - 2);
        if (!customConstraints) customConstraints = '';
        customConstraints += `\n- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CONCEPTUAL_ERROR", and "${d3}" to "CONCEPTUAL_ERROR".`;
      }
    }
    
    if (isShort) {
      if (!customConstraints) customConstraints = '';
      customConstraints += `\n- isNotationVariant: true (DO NOT generate any word problem or story).`;
    }
  }

  const aiPrompt = `
You are an expert mathematics educator creating content for Primary 3 students.

Topic: ${topic}
Difficulty: ${difficulty}
Variant: ${activeVariant}

Your task is to generate a JSON response following this strict schema:
${getFormatInstructions(visualEngineStr, inputRequirementStr)}

CRITICAL INSTRUCTIONS:
${questionStemConstraint}
- The final answer MUST exactly match: "${answer}".
- The solutionSteps should clearly explain how to get the answer.
${customConstraints}
`;

  return { aiPrompt };
};
