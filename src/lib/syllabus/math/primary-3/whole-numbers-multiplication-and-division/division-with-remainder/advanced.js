export const advancedLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) => {
  let dividend, divisor, quotient, remainder;
  let askText = '';
  let answer = '';
  let questionStemConstraint = '';
  let inputRequirementStr = null;
  let customConstraints = '';
  const visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: { hideVisual: true } });

  // Generate a valid division problem with a remainder
  do {
    divisor = Math.floor(Math.random() * 8) + 3; // 3 to 10
    quotient = Math.floor(Math.random() * 8) + 4; // 4 to 11
    remainder = Math.floor(Math.random() * (divisor - 1)) + 1; // 1 to (divisor-1)
    dividend = (divisor * quotient) + remainder;
  } while (dividend > 1000);

  if (activeVariant === 'advanced_rounding_up_quotient') {
    // The "Extra Box" Problem
    if (isStructure) {
      askText = `Write a creative, concise word problem (under 3 sentences) using the name ${context.name}. The story must involve ${context.name} packing a total of ${dividend} ${selectedContextItem} into boxes/groups that each hold exactly ${divisor}. The final question must ask what is the MINIMUM number of boxes/groups needed to hold ALL the ${selectedContextItem}, naturally forcing the quotient to round up to accommodate the leftovers. Do NOT explicitly tell them to round up.`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1 (Equation)", expectedAnswer: `${dividend} ÷ ${divisor} = ${quotient} R ${remainder}` },
          { label: "Step 2 (Equation)", expectedAnswer: `${quotient} + 1 = ${quotient + 1}` },
          { label: "Step 3 (Final Answer)", expectedAnswer: String(quotient + 1) }
        ]
      });
      customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${dividend} ÷ ${divisor} = ${quotient} R ${remainder}".
- For MULTI_STEP_INPUT Step 2, the expectedAnswer MUST exactly be "${quotient} + 1 = ${quotient + 1}".
- For MULTI_STEP_INPUT Step 3 (Final Answer), the expectedAnswer MUST exactly be "${quotient + 1}".`;
    } else if (isMCQ) {
      askText = `${dividend} ${selectedContextItem} must be packed into boxes that hold exactly ${divisor} ${selectedContextItem} each. What is the minimum number of boxes needed to hold everything?`;
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
    }
    answer = String(quotient + 1);
    
    if (isMCQ) {
      const d1 = String(quotient); // Ignored remainder
      const d2 = String(remainder); // Selected remainder
      const d3 = String(quotient + 2);
      
      customConstraints += `\n- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CONCEPTUAL_ERROR", and "${d3}" to "CARELESS_CALCULATION".`;
    }
  } else if (activeVariant === 'advanced_divisor_minus_remainder') {
    // "How Many More to Make a Group?"
    const needed = divisor - remainder;
    const unknownType = Math.floor(Math.random() * 3); // 0 = needed, 1 = divisor, 2 = remainder
    
    if (unknownType === 0) {
      // Find Needed
      if (isStructure) {
        askText = `Write a creative, concise word problem (under 3 sentences) using the name ${context.name}. The story must involve ${context.name} arranging a total of ${dividend} ${selectedContextItem} into equal sets or rows of ${divisor}. The final question must ask exactly how many MORE ${selectedContextItem} are needed to completely fill the final incomplete set/row.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
        
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1 (Equation)", expectedAnswer: `${dividend} ÷ ${divisor} = ${quotient} R ${remainder}` },
            { label: "Step 2 (Equation)", expectedAnswer: `${divisor} - ${remainder} = ${needed}` },
            { label: "Step 3 (Final Answer)", expectedAnswer: String(needed) }
          ]
        });
        customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${dividend} ÷ ${divisor} = ${quotient} R ${remainder}".
- For MULTI_STEP_INPUT Step 2, the expectedAnswer MUST exactly be "${divisor} - ${remainder} = ${needed}".
- For MULTI_STEP_INPUT Step 3 (Final Answer), the expectedAnswer MUST exactly be "${needed}".`;
      } else if (isMCQ) {
        askText = `If you arrange ${dividend} ${selectedContextItem} into rows of ${divisor}, how many MORE ${selectedContextItem} do you need to complete the final row?`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      }
      answer = String(needed);
      
      if (isMCQ) {
        const d1 = String(remainder); // Selected remainder
        const d2 = String(divisor); // Selected divisor
        const d3 = String(needed + 1);
        
        customConstraints += `\n- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CONCEPTUAL_ERROR", and "${d3}" to "CARELESS_CALCULATION".`;
      }
    } else if (unknownType === 1) {
      // Find Divisor
      const totalBoxes = quotient + 1;
      const fullTotal = dividend + needed;
      if (isStructure) {
        askText = `Write a creative, concise word problem (under 3 sentences) using the name ${context.name}. The story must state that ${context.name} has a total of ${dividend} ${selectedContextItem}. She packs them into boxes and completely fills exactly ${quotient} boxes, leaving an incomplete final box. She needs ${needed} more ${selectedContextItem} to completely fill this final box. The final question must ask how many ${selectedContextItem} a full box holds.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
        
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1 (Equation)", expectedAnswer: `${dividend} + ${needed} = ${fullTotal}` },
            { label: "Step 2 (Equation)", expectedAnswer: `${fullTotal} ÷ ${totalBoxes} = ${divisor}` },
            { label: "Step 3 (Final Answer)", expectedAnswer: String(divisor) }
          ]
        });
        customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${dividend} + ${needed} = ${fullTotal}".
- For MULTI_STEP_INPUT Step 2, the expectedAnswer MUST exactly be "${fullTotal} ÷ ${totalBoxes} = ${divisor}".
- For MULTI_STEP_INPUT Step 3 (Final Answer), the expectedAnswer MUST exactly be "${divisor}".`;
      } else if (isMCQ) {
        askText = `${context.name} has ${dividend} ${selectedContextItem}. She completely fills ${quotient} rows, and needs ${needed} more to complete the final row. How many ${selectedContextItem} are in a full row?`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      }
      answer = String(divisor);
      
      if (isMCQ) {
        const d1 = String(divisor - 1);
        const d2 = String(divisor + 1);
        const d3 = String(remainder);
        customConstraints += `\n- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CARELESS_CALCULATION", "${d2}" to "CARELESS_CALCULATION", and "${d3}" to "CONCEPTUAL_ERROR".`;
      }
    } else {
      // Find Remainder
      const totalBoxes = quotient + 1;
      const fullTotal = dividend + needed;
      if (isStructure) {
        askText = `Write a creative, concise word problem (under 3 sentences) using the name ${context.name}. The story must state that ${context.name} has a total of ${dividend} ${selectedContextItem}. She packs them into boxes and completely fills exactly ${quotient} boxes, leaving an incomplete final box. She needs ${needed} more ${selectedContextItem} to completely fill this final box. The final question must ask exactly how many ${selectedContextItem} are CURRENTLY inside the incomplete box (which is the remainder).`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
        
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1 (Equation)", expectedAnswer: `${dividend} + ${needed} = ${fullTotal}` },
            { label: "Step 2 (Equation)", expectedAnswer: `${fullTotal} ÷ ${totalBoxes} = ${divisor}` },
            { label: "Step 3 (Equation)", expectedAnswer: `${divisor} - ${needed} = ${remainder}` },
            { label: "Step 4 (Final Answer)", expectedAnswer: String(remainder) }
          ]
        });
        customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${dividend} + ${needed} = ${fullTotal}".
- For MULTI_STEP_INPUT Step 2, the expectedAnswer MUST exactly be "${fullTotal} ÷ ${totalBoxes} = ${divisor}".
- For MULTI_STEP_INPUT Step 3, the expectedAnswer MUST exactly be "${divisor} - ${needed} = ${remainder}".
- For MULTI_STEP_INPUT Step 4 (Final Answer), the expectedAnswer MUST exactly be "${remainder}".`;
      } else if (isMCQ) {
        askText = `${context.name} has ${dividend} ${selectedContextItem}. She completely fills ${quotient} rows, and needs ${needed} more to complete the final row. How many ${selectedContextItem} are currently in the final row?`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      }
      answer = String(remainder);
      
      if (isMCQ) {
        const d1 = String(needed);
        const d2 = String(divisor);
        const d3 = String(remainder + 1);
        customConstraints += `\n- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CONCEPTUAL_ERROR", and "${d3}" to "CARELESS_CALCULATION".`;
      }
    }
  } else if (activeVariant === 'advanced_multi_step_strand') {
    // Add/Subtract before Division
    const isSubtract = Math.random() > 0.5;
    // Ensure modifier is always strictly less than dividend to prevent negative initial amounts
    const maxModifier = Math.min(29, dividend - 1);
    const minModifier = Math.min(10, maxModifier);
    const modifier = Math.floor(Math.random() * (maxModifier - minModifier + 1)) + minModifier;
    const initialAmount = isSubtract ? dividend + modifier : dividend - modifier;
    const unknownType = Math.floor(Math.random() * 3); // 0 = remainder, 1 = quotient, 2 = initialAmount
    
    if (unknownType === 0) {
      // Find Remainder
      if (isStructure) {
        askText = `Write a creative, concise word problem (under 3 sentences) using the name ${context.name}. The story must state that ${context.name} started with ${initialAmount} ${selectedContextItem}, and then ${isSubtract ? `lost or gave away ${modifier}` : `found or received ${modifier} more`}. Then, they must pack the REMAINING amount into groups of ${divisor}. The final question must ask how many ${selectedContextItem} are left over (the remainder).`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
        
        const step1Eq = isSubtract ? `${initialAmount} - ${modifier} = ${dividend}` : `${initialAmount} + ${modifier} = ${dividend}`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1 (Equation)", expectedAnswer: step1Eq },
            { label: "Step 2 (Equation)", expectedAnswer: `${dividend} ÷ ${divisor} = ${quotient} R ${remainder}` },
            { label: "Step 3 (Final Answer)", expectedAnswer: String(remainder) }
          ]
        });
        customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${step1Eq}".
- For MULTI_STEP_INPUT Step 2, the expectedAnswer MUST exactly be "${dividend} ÷ ${divisor} = ${quotient} R ${remainder}".
- For MULTI_STEP_INPUT Step 3 (Final Answer), the expectedAnswer MUST exactly be "${remainder}".`;
      } else if (isMCQ) {
        askText = `Start with ${initialAmount}, ${isSubtract ? `subtract` : `add`} ${modifier}, and pack the result into groups of ${divisor}. How many items are left over?`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      }
      answer = String(remainder);
      
      if (isMCQ) {
        const d1 = String(quotient); // Quotient instead of remainder
        const d2 = String(remainder === 1 ? remainder + 1 : remainder - 1);
        const d3 = String(remainder + 2);
        
        customConstraints += `\n- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CARELESS_CALCULATION", and "${d3}" to "CARELESS_CALCULATION".`;
      }
    } else if (unknownType === 1) {
      // Find Quotient
      if (isStructure) {
        askText = `Write a creative, concise word problem (under 3 sentences) using the name ${context.name}. The story must state that ${context.name} started with ${initialAmount} ${selectedContextItem}, and then ${isSubtract ? `lost or gave away ${modifier}` : `found or received ${modifier} more`}. Then, they must pack the REMAINING amount into groups of ${divisor}. The final question must ask how many FULL groups of ${divisor} can be packed.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
        
        const step1Eq = isSubtract ? `${initialAmount} - ${modifier} = ${dividend}` : `${initialAmount} + ${modifier} = ${dividend}`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1 (Equation)", expectedAnswer: step1Eq },
            { label: "Step 2 (Equation)", expectedAnswer: `${dividend} ÷ ${divisor} = ${quotient} R ${remainder}` },
            { label: "Step 3 (Final Answer)", expectedAnswer: String(quotient) }
          ]
        });
        customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${step1Eq}".
- For MULTI_STEP_INPUT Step 2, the expectedAnswer MUST exactly be "${dividend} ÷ ${divisor} = ${quotient} R ${remainder}".
- For MULTI_STEP_INPUT Step 3 (Final Answer), the expectedAnswer MUST exactly be "${quotient}".`;
      } else if (isMCQ) {
        askText = `Start with ${initialAmount}, ${isSubtract ? `subtract` : `add`} ${modifier}, and pack the result into groups of ${divisor}. How many FULL groups do you get?`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      }
      answer = String(quotient);
      
      if (isMCQ) {
        const d1 = String(remainder);
        const d2 = String(quotient - 1);
        const d3 = String(quotient + 1);
        
        customConstraints += `\n- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CARELESS_CALCULATION", and "${d3}" to "CARELESS_CALCULATION".`;
      }
    } else {
      // Find Initial Amount (Work backwards)
      if (isStructure) {
        askText = `Write a creative, concise word problem (under 3 sentences) using the name ${context.name}. The story must state that ${context.name} ${isSubtract ? `lost or gave away ${modifier} ${selectedContextItem}` : `received ${modifier} more ${selectedContextItem}`}. AFTER that, they packed all their remaining ${selectedContextItem} into EXACTLY ${quotient} groups of ${divisor}, and had ${remainder} left over. The final question must ask how many ${selectedContextItem} ${context.name} started with.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
        
        const step3Eq = isSubtract ? `${dividend} + ${modifier} = ${initialAmount}` : `${dividend} - ${modifier} = ${initialAmount}`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1 (Equation)", expectedAnswer: `${quotient} x ${divisor} = ${quotient * divisor}` },
            { label: "Step 2 (Equation)", expectedAnswer: `${quotient * divisor} + ${remainder} = ${dividend}` },
            { label: "Step 3 (Equation)", expectedAnswer: step3Eq },
            { label: "Step 4 (Final Answer)", expectedAnswer: String(initialAmount) }
          ]
        });
        customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${quotient} x ${divisor} = ${quotient * divisor}".
- For MULTI_STEP_INPUT Step 2, the expectedAnswer MUST exactly be "${quotient * divisor} + ${remainder} = ${dividend}".
- For MULTI_STEP_INPUT Step 3, the expectedAnswer MUST exactly be "${step3Eq}".
- For MULTI_STEP_INPUT Step 4 (Final Answer), the expectedAnswer MUST exactly be "${initialAmount}".`;
      } else if (isMCQ) {
        askText = `${context.name} ${isSubtract ? `lost ${modifier} items` : `received ${modifier} items`}. They packed the rest into ${quotient} groups of ${divisor} and had ${remainder} left over. How many items did they start with?`;
        questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      }
      answer = String(initialAmount);
      
      if (isMCQ) {
        const d1 = String(dividend);
        const d2 = String(isSubtract ? dividend - modifier : dividend + modifier); // Inverse operation error
        const d3 = String(initialAmount + 1);
        
        customConstraints += `\n- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CONCEPTUAL_ERROR", and "${d3}" to "CARELESS_CALCULATION".`;
      }
    }
  } else if (activeVariant === 'advanced_pattern_sequence') {
    // Pattern & Sequence Prediction
    const patterns = [
      ["Red", "Blue", "Green", "Yellow", "Purple"],
      ["Circle", "Square", "Triangle", "Star"],
      ["A", "B", "C", "D"],
      ["Apple", "Banana", "Cherry", "Date"]
    ];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    const patternLength = pattern.length;
    divisor = patternLength;
    quotient = Math.floor(Math.random() * 10) + 5; // 5 to 14 loops
    remainder = Math.floor(Math.random() * (patternLength - 1)) + 1;
    dividend = (divisor * quotient) + remainder; // The Nth term
    
    const targetItem = pattern[remainder - 1]; // remainder 1 = index 0. remainder 0 would be index patternLength - 1, but remainder is always > 0 here.
    
    if (isStructure) {
      askText = `Write a creative word problem describing a repeating pattern using these elements: ${pattern.join(', ')}. The pattern repeats continuously in that exact order. The question must ask the student to determine what element will be in the ${dividend}th position.`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1 (Equation)", expectedAnswer: `${dividend} ÷ ${divisor} = ${quotient} R ${remainder}` },
          { label: "Step 2 (Final Answer)", expectedAnswer: targetItem }
        ]
      });
      customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${dividend} ÷ ${divisor} = ${quotient} R ${remainder}".
- For MULTI_STEP_INPUT Step 2 (Final Answer), the expectedAnswer MUST exactly be "${targetItem}".`;
    } else if (isMCQ) {
      askText = `A repeating pattern of ${pattern.length} elements goes: ${pattern.join(', ')}. What will be the ${dividend}th element?`;
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
    }
    answer = targetItem;
    
    if (isMCQ) {
      const wrongOptions = pattern.filter(p => p !== targetItem);
      // Select exactly 3 wrong options. If the pattern is only 4 items, we have 3. If 5, slice the first 3.
      const selectedWrongs = wrongOptions.slice(0, 3);
      
      customConstraints += `\n- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${selectedWrongs[0]}", "${selectedWrongs[1]}", and "${selectedWrongs[2]}".
- DefectMap must map "${selectedWrongs[0]}" to "CONCEPTUAL_ERROR", "${selectedWrongs[1]}" to "CONCEPTUAL_ERROR", and "${selectedWrongs[2]}" to "CONCEPTUAL_ERROR".`;
    }
  } else if (activeVariant === 'advanced_dual_output') {
    // Value vs. Quantity Dual Output (Optimized for 3-Type)
    // Adjust variables to be money-like
    const budgets = [50, 100, 200];
    dividend = budgets[Math.floor(Math.random() * budgets.length)]; // $50, $100, $200 notes
    divisor = Math.floor(Math.random() * 8) + 6; // item cost $6 to $13
    quotient = Math.floor(dividend / divisor);
    remainder = dividend % divisor;
    
    if (remainder === 0) {
      remainder = 1;
      divisor -= 1;
      quotient = Math.floor(dividend / divisor);
      remainder = dividend % divisor;
    }
    
    const firstName = context.name[0] || context.name;
    askText = `Write a creative, concise word problem (under 3 sentences) using the name ${firstName}. The story must involve ${firstName} going shopping with a $${dividend} note. They want to buy as many identical ${selectedContextItem} that cost $${divisor} each as possible. The final question must ask TWO things: the maximum number of ${selectedContextItem} they can buy, AND the exact amount of change they will receive.`;
    questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;

    customConstraints = "";

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1 (Equation)", expectedAnswer: `${dividend} ÷ ${divisor} = ${quotient} R ${remainder}` },
          { label: "Step 2 (Max Items)", expectedAnswer: String(quotient) },
          { label: "Step 3 (Change Received)", expectedAnswer: `$${remainder}` }
        ]
      });
      customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${dividend} ÷ ${divisor} = ${quotient} R ${remainder}".
- For MULTI_STEP_INPUT Step 2 (Max Items), the expectedAnswer MUST exactly be "${quotient}".
- For MULTI_STEP_INPUT Step 3 (Change Received), the expectedAnswer MUST exactly be "$${remainder}".`;
    }
    answer = `${quotient} items and $${remainder} change`;
    
    if (isMCQ) {
      const d1 = `${quotient} items and $${divisor} change`; // Wrong change
      const d2 = `${quotient + 1} items`; // Rounded up
      const d3 = `${quotient - 1} items and $${remainder + divisor} change`; // Didn't maximize purchases
      
      customConstraints += `\n- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CONCEPTUAL_ERROR", and "${d3}" to "CONCEPTUAL_ERROR".`;
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
- The solutionSteps should clearly explain how to get the answer, breaking it down logically step by step.
${customConstraints}
`;

  return { aiPrompt };
};
