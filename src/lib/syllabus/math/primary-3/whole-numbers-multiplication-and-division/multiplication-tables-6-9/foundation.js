export const foundationLogic = function (
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
  let customConstraints = "";

  let questionStemConstraint = `- The question stem must clearly ask exactly: "${askText}".`;

  if (activeVariant === 'foundation_groups_of') {
    const groups = Math.floor(Math.random() * 9) + 2; // 2 to 10
    const itemsPerGroup = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
    const total = groups * itemsPerGroup;

    answer = String(total);
    if (isStructure) {
      askText = `Write a creative 1-step word problem where ${context.name} has ${groups} sets, boxes, or collections of ${selectedContextItem}, and there are ${itemsPerGroup} ${selectedContextItem} in each set. Ask for the total number of ${selectedContextItem}. Do not use the word 'groups'.`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
    } else {
      askText = `What is ${groups} groups of ${itemsPerGroup}?`;
      questionStemConstraint = `- The question stem must clearly ask exactly: "${askText}".`;
    }
    
    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Write this as a multiplication equation (e.g., A x B)", expectedAnswer: `${groups} x ${itemsPerGroup}` },
          { label: "What is the total?", expectedAnswer: `${total}` }
        ]
      });
    }
  }
  else if (activeVariant === 'foundation_repeated_addition') {
    const num = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
    const count = Math.floor(Math.random() * 5) + 3; // 3 to 7 times
    const total = num * count;
    
    const addArr = Array(count).fill(num);
    const addString = addArr.join(' + ');

    answer = `${count} x ${num}`;
    
    if (isStructure) {
      askText = `Write a creative word problem about ${context.name} receiving or organizing ${num} ${selectedContextItem} repeatedly for ${count} times. State that the total can be found using the addition equation: ${addString}. Ask the student to rewrite this addition equation as a multiplication equation.`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
    } else {
      askText = `Write the addition equation as a multiplication equation: ${addString}`;
      questionStemConstraint = `- The question stem must clearly ask exactly: "${askText}".`;
    }
    
    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: `How many groups of ${num} are there?`, expectedAnswer: `${count}` },
          { label: "Write the multiplication equation (Groups x Items)", expectedAnswer: `${answer}` }
        ]
      });
    }
  }
  else if (activeVariant === 'foundation_arrays') {
    const rows = Math.floor(Math.random() * 9) + 2; // 2 to 10
    const cols = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
    const total = rows * cols;

    answer = String(total);
    askText = `How many items are there in the array?`;
    questionStemConstraint = `- The entire questionText must be EXACTLY "${askText}". DO NOT add any context about the number of rows or columns. The student must count them from the visual.`;
    visualEngineStr = JSON.stringify({
      componentToRender: "ICON_GRID",
      componentData: { totalItems: total, cols: cols, icon: "⭐" }
    });

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Write the multiplication equation (Rows x Columns)", expectedAnswer: `${rows} x ${cols}` },
          { label: "What is the total?", expectedAnswer: `${total}` }
        ]
      });
    }
  }
  else if (activeVariant === 'foundation_direct_multiply_6_9') {
    const num = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
    const multiplier = Math.floor(Math.random() * 10) + 1; // 1 to 10
    const total = num * multiplier;

    const isFlipped = Math.random() > 0.5;
    const equation = isFlipped ? `${num} x ${multiplier}` : `${multiplier} x ${num}`;
    const groups = isFlipped ? num : multiplier;
    const items = isFlipped ? multiplier : num;

    answer = String(total);
    
    if (isStructure) {
      askText = `Write a creative 1-step word problem where ${context.name} has ${groups} sets, boxes, or collections of ${selectedContextItem}, and there are ${items} ${selectedContextItem} in each set. Ask for the total number of ${selectedContextItem}.`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
    } else {
      askText = getQText(`What is ${equation}?`, `${equation} = ?`);
      questionStemConstraint = `- The question stem must clearly ask exactly: "${askText}".`;
    }

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Write this as a multiplication equation (e.g., A x B)", expectedAnswer: `${groups} x ${items}` },
          { label: "What is the total?", expectedAnswer: `${total}` }
        ]
      });
    }
  }
  else if (activeVariant === 'foundation_skip_counting_6_9') {
    const num = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
    const startMultiplier = Math.floor(Math.random() * 5) + 1; // 1 to 5
    const sequence = [];
    let missingIndex = Math.floor(Math.random() * 5); // 0 to 4
    
    for (let i = 0; i < 5; i++) {
      sequence.push(num * (startMultiplier + i));
    }
    
    const missingValue = sequence[missingIndex];
    sequence[missingIndex] = '[?]';
    
    answer = String(missingValue);
    
    if (isStructure) {
      askText = `Write a creative 1-step word problem where ${context.name} is counting a sequence of numbers: ${sequence.join(', ')}. Ask the student to find the missing number in the pattern. DO NOT mention what number they are skip counting by (e.g., do not say 'skip counting by ${num}'). The student must figure out the pattern themselves.`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
    } else {
      askText = getQText(
        `Find the missing number in the skip counting pattern:\n\n${sequence.join(', ')}`, 
        `Find the missing number: ${sequence.join(', ')}`
      );
      questionStemConstraint = `- The question stem must clearly ask exactly: "${askText}".`;
    }

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: `What number is being added each time? (Skip counting by...)`, expectedAnswer: `${num}` },
          { label: "What is the missing number?", expectedAnswer: `${missingValue}` }
        ]
      });
    }
  }

  let aiPrompt = `You are an expert Primary 3 math generator.
Generate a question for the subtopic: Multiplication Tables (6-9).
Level: ${levelName}
Difficulty: ${zodDiff}
Type: ${zodType}

STRICT CONSTRAINTS:
${questionStemConstraint}
- The finalAnswer must be EXACTLY: "${answer}".
- If MCQ, provide 4 options including the correct answer and 3 reasonable distractors. Ensure the correct option matches "${answer}".
- The solution steps MUST explicitly mirror the logical steps provided in the MULTI_STEP_INPUT (if applicable).
${customConstraints}

${getFormatInstructions(visualEngineStr, inputRequirementStr)}`;

  return {
    aiPrompt: aiPrompt,
    metadata: {
      difficulty: 'foundation',
      steps: isStructure ? 2 : 1,
      maxNumber: 100,
      logicDescription: "Basic concepts of multiplication: groups of, repeated addition, arrays, and direct facts."
    }
  };
};
