export const advancedLogic = function (
  activeVariant,
  difficulty,
  type,
  isMCQ,
  isShort,
  isStructure,
  zodType,
  zodDiff,
  levelName,
  topic,
  getFormatInstructions,
  context,
  selectedContextItem,
  getQText
) {
  let askText = '';
  let answer = '';
  let visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: { hideVisual: true } });
  let inputRequirementStr = null;

  const variants = [
    'advanced_missing_addend_mentally',
    'advanced_missing_subtrahend_mentally',
    'advanced_missing_minuend_mentally',
    'advanced_sub_compensation',
    'advanced_make_ten_strategy'
  ];

  if (activeVariant === 'advanced_random' || !variants.includes(activeVariant)) {
    activeVariant = variants[Math.floor(Math.random() * variants.length)];
  }

  const isWordProblem = Math.random() < 0.5;

  if (activeVariant === 'advanced_missing_addend_mentally') {
    const sum = Math.floor(Math.random() * 60) + 40; // 40 to 99
    const num1 = Math.floor(Math.random() * (sum - 20)) + 10; // 10 to sum-10
    const num2 = sum - num1;
    
    // Randomly choose which addend is missing
    const firstMissing = Math.random() > 0.5;
    
    answer = String(firstMissing ? num1 : num2);
    
    if (isWordProblem) {
      if (firstMissing) {
        askText = `${context.name} had some ${selectedContextItem}. Then, they bought ${num2} more. Now they have ${sum} ${selectedContextItem} in total. How many ${selectedContextItem} did they have at first? Mentally work out the answer.`;
      } else {
        askText = `${context.name} had ${num1} ${selectedContextItem}. They bought some more and now have ${sum} ${selectedContextItem}. How many ${selectedContextItem} did they buy? Mentally work out the answer.`;
      }
    } else {
      askText = firstMissing ? `Mentally find the missing number: [?] + ${num2} = ${sum}` : `Mentally find the missing number: ${num1} + [?] = ${sum}`;
    }

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Working for missing number", expectedAnswer: `${sum} - ${firstMissing ? num2 : num1}` },
          { label: "Mental calculated answer", expectedAnswer: `${answer}` }
        ]
      });
    }
  }
  else if (activeVariant === 'advanced_missing_subtrahend_mentally') {
    const num1 = Math.floor(Math.random() * 50) + 50; // 50 to 99
    const num2 = Math.floor(Math.random() * (num1 - 20)) + 10; // 10 to num1-10
    const diff = num1 - num2;
    
    answer = String(num2);
    
    if (isWordProblem) {
      askText = `${context.name} had ${num1} ${selectedContextItem}. They gave some away and now have ${diff} ${selectedContextItem} left. How many ${selectedContextItem} did they give away? Mentally work out the answer.`;
    } else {
      askText = `Mentally find the missing number: ${num1} - [?] = ${diff}`;
    }

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Working for missing number", expectedAnswer: `${num1} - ${diff}` },
          { label: "Mental calculated answer", expectedAnswer: `${answer}` }
        ]
      });
    }
  }
  else if (activeVariant === 'advanced_missing_minuend_mentally') {
    const num1 = Math.floor(Math.random() * 50) + 50; // 50 to 99 (minuend)
    const num2 = Math.floor(Math.random() * (num1 - 20)) + 10; // 10 to num1-10 (subtrahend)
    const diff = num1 - num2;
    
    answer = String(num1);
    
    if (isWordProblem) {
      askText = `${context.name} had some ${selectedContextItem}. They gave away ${num2} ${selectedContextItem} and had ${diff} ${selectedContextItem} left. How many ${selectedContextItem} did they have at first? Mentally work out the answer.`;
    } else {
      askText = `Mentally find the missing number: [?] - ${num2} = ${diff}`;
    }

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Working for missing number", expectedAnswer: `${diff} + ${num2}` },
          { label: "Mental calculated answer", expectedAnswer: `${answer}` }
        ]
      });
    }
  }
  else if (activeVariant === 'advanced_sub_compensation') {
    const num1 = Math.floor(Math.random() * 40) + 50; // 50 to 89
    const t2 = Math.floor(Math.random() * 3) + 1; // 1 to 3
    const o2 = Math.random() > 0.5 ? 9 : 8;
    const num2 = t2 * 10 + o2; // 18, 19, 28, 29, 38, 39
    
    const diff = num1 - num2;
    const roundedNum2 = (t2 + 1) * 10;
    const comp = roundedNum2 - num2; // 1 or 2

    answer = String(diff);
    
    if (isWordProblem) {
      askText = `${context.name} had ${num1} ${selectedContextItem}. They gave ${num2} ${selectedContextItem} to a friend. Mentally calculate how many ${selectedContextItem} they have left.`;
    } else {
      askText = `Mentally calculate: ${num1} - ${num2}`;
    }

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: `Mentally subtract ${roundedNum2} first: ${num1} - ${roundedNum2}`, expectedAnswer: `${num1 - roundedNum2}` },
          { label: `Since we subtracted too much, add ${comp} back to find the final difference`, expectedAnswer: `${diff}` }
        ]
      });
    }
  }
  else if (activeVariant === 'advanced_make_ten_strategy') {
    const t1 = Math.floor(Math.random() * 3) + 1; // 1 to 3
    const t3 = Math.floor(Math.random() * 3) + 1; // 1 to 3
    const o1 = Math.floor(Math.random() * 9) + 1; // 1 to 9
    const o3 = 10 - o1;
    const num1 = t1 * 10 + o1;
    const num3 = t3 * 10 + o3; // num1 + num3 forms a multiple of 10
    
    const maxT2 = 9 - (t1 + t3 + 1);
    const t2 = Math.max(1, Math.floor(Math.random() * (maxT2 > 0 ? maxT2 : 2)));
    const o2 = Math.floor(Math.random() * 9) + 1;
    const num2 = t2 * 10 + o2;
    
    const sum = num1 + num2 + num3;
    answer = String(sum);
    
    if (isWordProblem) {
      askText = `${context.name} bought ${num1} ${selectedContextItem} on Monday, ${num2} ${selectedContextItem} on Tuesday, and ${num3} ${selectedContextItem} on Wednesday. Mentally calculate how many ${selectedContextItem} they bought altogether.`;
    } else {
      askText = `Mentally calculate: ${num1} + ${num2} + ${num3}`;
    }

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: `Look for numbers that make a ten. Add ${num1} and ${num3} first: ${num1} + ${num3}`, expectedAnswer: `${num1 + num3}` },
          { label: `Add the remaining number to the sum: ${num1 + num3} + ${num2}`, expectedAnswer: `${sum}` }
        ]
      });
    }
  }

  const finalQuestionText = getQText(
    `${askText} Show your working and the final answer.`,
    `${askText}`
  );

  let aiPrompt = `You are an expert Primary 3 math generator.
Generate a question for the subtopic: Mental Calculation (2-Digit).
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
- The question stem must clearly ask "${finalQuestionText}".
- The finalAnswer must be EXACTLY: "${answer}".
- If MCQ, provide 4 options including the correct answer and 3 reasonable distractors. Ensure the correct option matches "${answer}".
- Do not use vertical algorithms for mental calculation. Keep the equation horizontal.
- For the model solution, explain the mental math strategy. For compensation, explicitly mention subtracting the nearest ten and adding the difference back. For adding three numbers, explain pairing the two numbers that form a multiple of 10 first.
- The solution steps MUST explicitly mirror the logical steps provided in the MULTI_STEP_INPUT (if applicable).
- separate steps using the exact characters \\n inside the string.
- Return ONLY valid JSON. Do not append extra closing braces.

${getFormatInstructions(visualEngineStr, inputRequirementStr)}`;

  return {
    aiPrompt: aiPrompt,
    metadata: {
      difficulty: 'advanced',
      steps: isStructure ? 2 : 1,
      maxNumber: 100,
      logicDescription: "Missing parts in 2-digit addition/subtraction or subtraction compensation."
    }
  };
};
