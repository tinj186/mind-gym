export const foundationLogic = function (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let askText = '';
  let questionStemConstraint = '';
  let answer = '';
  let customConstraints = '';
  let inputRequirementStr = null;
  let visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: { hideVisual: true } });

  let divisor = Math.floor(Math.random() * 8) + 2; // 2 to 9
  let quotient = Math.floor(Math.random() * 9) + 2; // 2 to 10
  let remainder = Math.floor(Math.random() * (divisor - 1)) + 1; // 1 to divisor-1
  let dividend = (divisor * quotient) + remainder;

  if (activeVariant === 'foundation_pure_notation') {
    if (isStructure) {
      askText = `Write a creative, concise word problem (under 3 sentences) using the name ${context.name} and the item ${selectedContextItem}. The story must involve ${context.name} possessing a total of ${dividend} ${selectedContextItem} and packing ${divisor} of them into each group/container. The final question must ask the student to find how many groups are full, and how many are left over.`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1 (Equation)", expectedAnswer: `${dividend} ÷ ${divisor} = ${quotient}` },
          { label: "Step 2 (Equation)", expectedAnswer: `${dividend} - ${quotient * divisor} = ${remainder}` },
          { label: "Step 3 (Final Answer)", expectedAnswer: `${quotient} R ${remainder}` }
        ]
      });
      answer = `${quotient} R ${remainder}`;
      customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${dividend} ÷ ${divisor} = ${quotient}".
- For MULTI_STEP_INPUT Step 2, the expectedAnswer MUST exactly be "${dividend} - ${quotient * divisor} = ${remainder}".
- For MULTI_STEP_INPUT Step 3 (Final Answer), the expectedAnswer MUST exactly be "${quotient} R ${remainder}".`;
    } else if (isMCQ) {
      askText = `Solve: ${dividend} ÷ ${divisor}`;
      questionStemConstraint = `- The question stem MUST exactly be "${askText}". DO NOT wrap it in a word problem.`;
      answer = `${quotient} R ${remainder}`;
      
      const d1 = `${quotient} R ${remainder + 1}`;
      const d2 = `${quotient - 1} R ${remainder + divisor}`;
      const d3 = `${dividend} R ${divisor}`;
      
      customConstraints = `
- isNotationVariant: true (DO NOT generate any word problem or story).
- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CARELESS_CALCULATION", "${d2}" to "CONCEPTUAL_ERROR", and "${d3}" to "CONCEPTUAL_ERROR".`;
    } else {
      askText = `${dividend} ÷ ${divisor} = ___ R ___`;
      questionStemConstraint = `- The question stem MUST exactly be "${askText}". DO NOT wrap it in a word problem.`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1 (Equation)", expectedAnswer: `${dividend} ÷ ${divisor} = ${quotient}` },
          { label: "Step 2 (Equation)", expectedAnswer: `${dividend} - ${quotient * divisor} = ${remainder}` },
          { label: "Step 3 (Final Answer)", expectedAnswer: `${quotient} R ${remainder}` }
        ]
      });
      answer = `${quotient} R ${remainder}`;
      customConstraints = `
- isNotationVariant: true (DO NOT generate any word problem or story).
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${dividend} ÷ ${divisor} = ${quotient}".
- For MULTI_STEP_INPUT Step 2, the expectedAnswer MUST exactly be "${dividend} - ${quotient * divisor} = ${remainder}".
- For MULTI_STEP_INPUT Step 3 (Final Answer), the expectedAnswer MUST exactly be "${quotient} R ${remainder}".`;
    }
  } 
  else if (activeVariant === 'foundation_identifying_remainder') {
    if (isStructure) {
      askText = `Write a creative, concise word problem (under 3 sentences) using the name ${context.name} and the item ${selectedContextItem}. The story must involve ${context.name} grouping a total of ${dividend} ${selectedContextItem} into containers that each hold exactly ${divisor}. The final question must explicitly ask the student to find how many ${selectedContextItem} are left over (unpackable).`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1 (Equation)", expectedAnswer: `${dividend} ÷ ${divisor} = ${quotient}` },
          { label: "Step 2 (Equation)", expectedAnswer: `${dividend} - ${quotient * divisor} = ${remainder}` },
          { label: "Step 3 (Final Answer)", expectedAnswer: String(remainder) }
        ]
      });
      customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${dividend} ÷ ${divisor} = ${quotient}".
- For MULTI_STEP_INPUT Step 2, the expectedAnswer MUST exactly be "${dividend} - ${quotient * divisor} = ${remainder}".
- For MULTI_STEP_INPUT Step 3 (Final Answer), the expectedAnswer MUST exactly be "${remainder}".`;
    } else if (isMCQ) {
      askText = `Find the remainder for ${dividend} ÷ ${divisor}.`;
      questionStemConstraint = `- The question stem must clearly ask exactly: "${askText}"`;
    } else {
      askText = `What is the remainder when ${dividend} is divided by ${divisor}?`;
      questionStemConstraint = `- The question stem must clearly ask exactly: "${askText}"`;
    }
    answer = String(remainder);

    if (isMCQ) {
      const d1 = String(quotient); // Quotient instead of remainder
      const d2 = String(remainder === 1 ? remainder + 1 : remainder - 1); // Off by one
      const d3 = String(remainder + 2);

      if (!customConstraints) customConstraints = '';
      customConstraints += `\n- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CARELESS_CALCULATION", and "${d3}" to "CARELESS_CALCULATION".`;
    }
  } 
  else if (activeVariant === 'foundation_maximum_full_groups') {
    if (isStructure) {
      askText = `Write a creative, concise word problem (under 3 sentences) using the name ${context.name} and the item ${selectedContextItem}. The story must involve ${context.name} possessing ${dividend} ${selectedContextItem}, and needing exactly ${divisor} ${selectedContextItem} to completely fill a single group/container. The final question must explicitly ask the student to find how many groups/containers can be filled completely (discarding any leftovers).`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1 (Equation)", expectedAnswer: `${dividend} ÷ ${divisor} = ${quotient}` },
          { label: "Step 2 (Final Answer)", expectedAnswer: String(quotient) }
        ]
      });
      customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${dividend} ÷ ${divisor} = ${quotient}".
- For MULTI_STEP_INPUT Step 2 (Final Answer), the expectedAnswer MUST exactly be "${quotient}".`;
    } else if (isMCQ) {
      askText = `Divide ${dividend} by ${divisor}. What is the quotient?`;
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
    } else {
      askText = `How many full groups of ${divisor} are in ${dividend}?`;
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
    }
    answer = String(quotient);
    
    if (isMCQ) {
      const d1 = String(quotient + 1);
      const d2 = String(remainder); // Remainder instead of quotient
      const d3 = String(quotient - 1 === 0 ? quotient + 2 : quotient - 1);
      
      if (!customConstraints) customConstraints = '';
      customConstraints += `\n- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CARELESS_CALCULATION", "${d2}" to "CONCEPTUAL_ERROR", and "${d3}" to "CARELESS_CALCULATION".`;
    }
  } 
  else if (activeVariant === 'foundation_reverse_calculation') {
    if (isStructure) {
      askText = `Write a creative, concise word problem (under 3 sentences) using the name ${context.name} and the item ${selectedContextItem}. The story must describe ${context.name} filling ${quotient} groups, with each group holding exactly ${divisor} ${selectedContextItem}. There must also be exactly ${remainder} ${selectedContextItem} left over (unpacked). The final question must ask the student to calculate the total number of ${selectedContextItem} they had at the very beginning.`;
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
      askText = `Which number gives a quotient of ${quotient} and a remainder of ${remainder} when divided by ${divisor}?`;
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
    } else {
      askText = `A number divided by ${divisor} gives a quotient of ${quotient} and a remainder of ${remainder}. What is the number?`;
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
    }
    answer = String(dividend);
    
    if (isMCQ) {
      const d1 = String(quotient * divisor); // Forgot to add remainder
      const d2 = String((quotient * divisor) - remainder); // Subtracted remainder instead
      const d3 = String(quotient + remainder); // Completely wrong logic
      
      if (!customConstraints) customConstraints = '';
      customConstraints += `\n- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CONCEPTUAL_ERROR", and "${d3}" to "CONCEPTUAL_ERROR".`;
    }
  } 
  else if (activeVariant === 'foundation_remainder_rule') {
    // Override divisor to be at least 4 so we have enough valid remainders to use as distractors.
    divisor = Math.floor(Math.random() * 6) + 4; // 4 to 9
    
    if (isStructure) {
      // Redefine remainder and dividend for the structured variant upgrade
      remainder = divisor - 1;
      dividend = (divisor * quotient) + remainder;

      askText = `Write a creative, concise word problem (under 3 sentences) using the name ${context.name} and the item ${selectedContextItem}. The story must describe ${context.name} packing ${selectedContextItem} into exactly ${quotient} boxes, with each box holding exactly ${divisor}. The story must mention that after packing, they realize they have the "greatest possible number" of ${selectedContextItem} left unpacked without being able to make a new box. The final question must ask the student to find the total number of ${selectedContextItem} they had in total.`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
      answer = String(dividend);
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1 (Equation)", expectedAnswer: `${divisor} - 1 = ${remainder}` },
          { label: "Step 2 (Equation)", expectedAnswer: `${quotient} x ${divisor} = ${quotient * divisor}` },
          { label: "Step 3 (Equation)", expectedAnswer: `${quotient * divisor} + ${remainder} = ${dividend}` },
          { label: "Step 4 (Final Answer)", expectedAnswer: String(dividend) }
        ]
      });
      customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${divisor} - 1 = ${remainder}".
- For MULTI_STEP_INPUT Step 2, the expectedAnswer MUST exactly be "${quotient} x ${divisor} = ${quotient * divisor}".
- For MULTI_STEP_INPUT Step 3, the expectedAnswer MUST exactly be "${quotient * divisor} + ${remainder} = ${dividend}".
- For MULTI_STEP_INPUT Step 4 (Final Answer), the expectedAnswer MUST exactly be "${dividend}".`;
    } else if (isMCQ) {
      askText = `When dividing a number by ${divisor}, which of these numbers CANNOT be the remainder?`;
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      
      // The correct answer to "CANNOT be the remainder" is a number >= divisor
      const correctAnswer = divisor + Math.floor(Math.random() * 3); // divisor, divisor+1, or divisor+2
      answer = String(correctAnswer);

      // Pick 3 unique valid remainders (< divisor)
      const validRemainders = Array.from({length: divisor}, (_, i) => i); // [0, 1, ..., divisor-1]
      // Shuffle array
      for (let i = validRemainders.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [validRemainders[i], validRemainders[j]] = [validRemainders[j], validRemainders[i]];
      }
      const d1 = String(validRemainders[0]);
      const d2 = String(validRemainders[1]);
      const d3 = String(validRemainders[2]);

      if (!customConstraints) customConstraints = '';
      customConstraints += `\n- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CONCEPTUAL_ERROR", and "${d3}" to "CONCEPTUAL_ERROR".`;
    } else {
      askText = `When dividing any number by ${divisor}, what is the largest possible remainder?`;
      questionStemConstraint = `- The question stem must exactly be: "${askText}"`;
      answer = String(divisor - 1);
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
