export const standardLogic = function (
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

  if (activeVariant === 'standard_missing_factor_6_9') {
    const table = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
    const missing = Math.floor(Math.random() * 10) + 1; // 1 to 10
    const total = table * missing;
    
    const isFirstMissing = Math.random() > 0.5;
    
    answer = String(missing);

    if (isFirstMissing) {
      if (isStructure) {
        askText = `Write a creative 1-step word problem where ${context.name} has an unknown number of containers, sets, or groups. Each container has exactly ${table} ${selectedContextItem}. ${context.name} has a total of ${total} ${selectedContextItem}. Ask for the number of containers.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
        
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Write the multiplication equation with a question mark (e.g., ? x B = C)", expectedAnswer: `? x ${table} = ${total}` },
            { label: "What is the missing number of groups?", expectedAnswer: `${missing}` }
          ]
        });
      } else {
        askText = getQText(
          `${context.name} has some boxes. There are ${table} ${selectedContextItem} in each box. ${context.name} has ${total} ${selectedContextItem} altogether. How many boxes does ${context.name} have?`,
          `? boxes of ${table}. Total is ${total}. How many boxes?`
        );
        questionStemConstraint = `- The question stem must clearly ask exactly: "${askText}".`;
      }
    } else {
      if (isStructure) {
        askText = `Write a creative 1-step word problem where ${context.name} has exactly ${table} containers, sets, or groups. They distribute ${total} ${selectedContextItem} equally among them. Ask for the number of ${selectedContextItem} in each container.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
        
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Write the multiplication equation with a question mark (e.g., A x ? = C)", expectedAnswer: `${table} x ? = ${total}` },
            { label: `What is the missing number of ${selectedContextItem} per group?`, expectedAnswer: `${missing}` }
          ]
        });
      } else {
        askText = getQText(
          `${context.name} has ${table} boxes. There are an equal number of ${selectedContextItem} in each box. ${context.name} has ${total} ${selectedContextItem} altogether. How many ${selectedContextItem} are in each box?`,
          `${table} boxes with equal amount. Total is ${total}. How many per box?`
        );
        questionStemConstraint = `- The question stem must clearly ask exactly: "${askText}".`;
      }
    }
  }
  else if (activeVariant === 'standard_word_problem_grouping') {
    const groups = Math.floor(Math.random() * 9) + 2; // 2 to 10
    const itemsPerGroup = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
    const total = groups * itemsPerGroup;

    answer = String(total);
    
    if (isStructure) {
      askText = `Write a creative 1-step word problem where ${context.name} has ${groups} containers, sets, or groups of ${selectedContextItem}. There are ${itemsPerGroup} ${selectedContextItem} in each group. Ask for the total number of ${selectedContextItem}.`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Write the multiplication equation to find the total", expectedAnswer: `${groups} x ${itemsPerGroup} = ${total}` },
          { label: `What is the total number of ${selectedContextItem}?`, expectedAnswer: `${total}` }
        ]
      });
    } else {
      askText = getQText(
        `${context.name} has ${groups} bags. There are ${itemsPerGroup} ${selectedContextItem} in each bag. How many ${selectedContextItem} does ${context.name} have altogether?`,
        `${groups} bags of ${itemsPerGroup}. How many in total?`
      );
      questionStemConstraint = `- The question stem must clearly ask exactly: "${askText}".`;
    }
  }
  else if (activeVariant === 'standard_word_problem_rate') {
    const rate = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
    const quantity = Math.floor(Math.random() * 9) + 2; // 2 to 10
    const total = rate * quantity;

    answer = "$" + total;
    
    if (isStructure) {
      askText = `Write a creative 1-step word problem where ${context.name} buys ${quantity} ${selectedContextItem}. Each one costs $${rate}. Ask for the total amount ${context.name} pays.`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { 
            label: "Write the multiplication equation to find the total cost", 
            expectedAnswer: `${quantity} x ${rate} = ${total}`,
            acceptedAnswers: [
              `${quantity} x $${rate} = $${total}`,
              `${quantity} x $${rate} = ${total}`,
              `$${rate} x ${quantity} = $${total}`,
              `$${rate} x ${quantity} = ${total}`,
              `${rate} x ${quantity} = ${total}`
            ]
          },
          { label: "What is the total cost?", expectedAnswer: `$${total}` }
        ]
      });
    } else {
      askText = getQText(
        `Each sticker costs $${rate}. ${context.name} buys ${quantity} stickers. How much does ${context.name} pay altogether?`,
        `${quantity} stickers at $${rate} each. Total cost?`
      );
      questionStemConstraint = `- The question stem must clearly ask exactly: "${askText}".`;
    }
  }
  else if (activeVariant === 'standard_commutativity') {
    const num1 = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
    let num2;
    do {
      num2 = Math.floor(Math.random() * 9) + 2; // 2 to 10
    } while (num2 === num1);
    const total = num1 * num2;

    answer = String(num2);
    
    if (isStructure) {
      askText = `Write a creative word problem where ${context.name} has ${num1} of a specific type of container (e.g. boxes, bags) holding ${selectedContextItem}, with exactly ${num2} items in each container. In a second scenario, they rearrange the exact same total amount of items so that there are ${num1} items in each container. Ask how many containers they will have in the second scenario. CRITICAL: Use the exact same container noun (e.g. 'boxes') in both scenarios. DO NOT explicitly mention the answer ${num2} for the second scenario in the text.`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
    } else {
      askText = `Find the missing number: ${num1} x ${num2} = ? x ${num1}`;
      questionStemConstraint = `- The question stem must clearly ask exactly: "${askText}".`;
    }

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Work out the equation on the left.", expectedAnswer: `${num1} x ${num2} = ${total}` },
          { label: "Work out the equation on the right with ?.", expectedAnswer: `? x ${num1} = ${total}` },
          { label: "Work out '?'.", expectedAnswer: `${num2}` }
        ]
      });
    }
  }
  else if (activeVariant === 'standard_true_false_equation') {
    const table = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
    const multiplier = Math.floor(Math.random() * 9) + 2; // 2 to 10
    const correctTotal = table * multiplier;
    
    const isTrue = Math.random() > 0.5;
    let displayedTotal = correctTotal;
    
    if (!isTrue) {
      // Offset the answer by either +1 or -1 multiplier
      const offset = Math.random() > 0.5 ? table : -table;
      displayedTotal = correctTotal + offset;
      if (displayedTotal <= 0) displayedTotal = correctTotal + table;
    }
    
    answer = isTrue ? "True" : "False";
    
    if (isStructure) {
      askText = `Write a creative word problem where ${context.name} claims that having ${table} groups, sets, or containers of ${selectedContextItem} (with ${multiplier} in each) gives a total of ${displayedTotal} ${selectedContextItem}. Ask the student if ${context.name}'s claim is True or False.`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Write the multiplication equation to find the true total", expectedAnswer: `${table} x ${multiplier} = ${correctTotal}` },
          { label: "Is the claim True or False?", expectedAnswer: `${answer}` }
        ]
      });
    } else {
      askText = `Is the following equation true or false?\n${table} x ${multiplier} = ${displayedTotal}`;
      questionStemConstraint = `- The question stem must clearly ask exactly: "${askText.replace('\n', ' ')}". DO NOT add any word problem context or extra sentences.`;
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
      difficulty: 'standard',
      steps: isStructure ? 2 : 1,
      maxNumber: 100,
      logicDescription: "Finding missing factors and solving 1-step word problems involving equal groups or rate."
    }
  };
};
