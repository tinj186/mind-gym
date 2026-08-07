export const advancedLogic = function (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) {
  let askText = '';
  let questionStemConstraint = '';
  let answer = '';
  let customConstraints = '';
  let inputRequirementStr = null;

  // For MCQ, we want to randomly toggle between the short direct format and the structured creative format.
  // We can do this by temporarily treating it as 'isStructure' to generate the creative narrative.
  const originalIsMCQ = isMCQ;
  if (isMCQ && Math.random() > 0.5) {
    isStructure = true;
  }

  if (activeVariant === 'advanced_multiply_then_add_subtract') {
    const table = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const factor = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const initialTotal = table * factor;
    
    const isAdd = Math.random() > 0.5;
    const changeAmount = Math.floor(Math.random() * 8) + 2;
    const finalAnswer = isAdd ? initialTotal + changeAmount : initialTotal - changeAmount;

    // 0 = ask final amount, 1 = ask multiplier (packs), 2 = ask change amount
    const questionType = Math.floor(Math.random() * 3);

    if (isStructure) {
      if (questionType === 0) {
        // Ask for final amount (e)
        if (isAdd) {
          askText = `Write a creative, concise word problem (under 3 sentences) about ${context.name} and ${selectedContextItem}. The story must logically require the student to multiply ${table} by ${factor} to find an initial total, and then add ${changeAmount} to that total. The final question must ask the student to find the final amount.`;
        } else {
          askText = `Write a creative, concise word problem (under 3 sentences) about ${context.name} and ${selectedContextItem}. The story must logically require the student to multiply ${table} by ${factor} to find an initial total, and then subtract ${changeAmount} from that total. The final question must ask the student to find the final amount.`;
        }
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1 (Find initial total)", expectedAnswer: `${table} x ${factor} = ${initialTotal}` },
            { label: "Step 2 (Find final amount)", expectedAnswer: isAdd ? `${initialTotal} + ${changeAmount} = ${finalAnswer}` : `${initialTotal} - ${changeAmount} = ${finalAnswer}` },
            { label: "Step 3 (Final Answer)", expectedAnswer: String(finalAnswer) }
          ]
        });
        answer = String(finalAnswer);
        customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${table} x ${factor} = ${initialTotal}".
- For MULTI_STEP_INPUT Step 2, the expectedAnswer MUST exactly be "${isAdd ? `${initialTotal} + ${changeAmount} = ${finalAnswer}` : `${initialTotal} - ${changeAmount} = ${finalAnswer}`}".
- For MULTI_STEP_INPUT Step 3 (Final Answer), the expectedAnswer MUST exactly be "${finalAnswer}".`;

      } else if (questionType === 1) {
        // Ask for multiplier (a)
        if (isAdd) {
          askText = `Write a creative, concise word problem (under 3 sentences) about ${context.name} and ${selectedContextItem}. State that there is an unknown number of groups containing ${factor} items each. Then, ${changeAmount} items are added to make a total of ${finalAnswer} items. Ask the student to find the initial number of groups.`;
        } else {
          askText = `Write a creative, concise word problem (under 3 sentences) about ${context.name} and ${selectedContextItem}. State that there is an unknown number of groups containing ${factor} items each. Then, ${changeAmount} items are removed to leave ${finalAnswer} items. Ask the student to find the initial number of groups.`;
        }
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1 (Find initial total)", expectedAnswer: isAdd ? `${finalAnswer} - ${changeAmount} = ${initialTotal}` : `${finalAnswer} + ${changeAmount} = ${initialTotal}` },
            { label: "Step 2 (Find number of packs)", expectedAnswer: `${initialTotal} ÷ ${factor} = ${table}` },
            { label: "Step 3 (Final Answer)", expectedAnswer: String(table) }
          ]
        });
        answer = String(table);
        customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${isAdd ? `${finalAnswer} - ${changeAmount} = ${initialTotal}` : `${finalAnswer} + ${changeAmount} = ${initialTotal}`}".
- For MULTI_STEP_INPUT Step 2, the expectedAnswer MUST exactly be "${initialTotal} ÷ ${factor} = ${table}".
- For MULTI_STEP_INPUT Step 3 (Final Answer), the expectedAnswer MUST exactly be "${table}".`;

      } else {
        // Ask for change amount (d)
        if (isAdd) {
          askText = `Write a creative, concise word problem (under 3 sentences) about ${context.name} and ${selectedContextItem}. State that there are ${table} groups of ${factor} items. Then, an unknown amount of items are added to make a total of ${finalAnswer} items. Ask the student to find how many items were added.`;
        } else {
          askText = `Write a creative, concise word problem (under 3 sentences) about ${context.name} and ${selectedContextItem}. State that there are ${table} groups of ${factor} items. Then, an unknown amount of items are removed to leave ${finalAnswer} items. Ask the student to find how many items were removed.`;
        }
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1 (Find initial total)", expectedAnswer: `${table} x ${factor} = ${initialTotal}` },
            { label: "Step 2 (Find amount changed)", expectedAnswer: isAdd ? `${finalAnswer} - ${initialTotal} = ${changeAmount}` : `${initialTotal} - ${finalAnswer} = ${changeAmount}` },
            { label: "Step 3 (Final Answer)", expectedAnswer: String(changeAmount) }
          ]
        });
        answer = String(changeAmount);
        customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${table} x ${factor} = ${initialTotal}".
- For MULTI_STEP_INPUT Step 2, the expectedAnswer MUST exactly be "${isAdd ? `${finalAnswer} - ${initialTotal} = ${changeAmount}` : `${initialTotal} - ${finalAnswer} = ${changeAmount}`}".
- For MULTI_STEP_INPUT Step 3 (Final Answer), the expectedAnswer MUST exactly be "${changeAmount}".`;
      }
    } else {
      if (questionType === 0) {
        askText = `${context.name} buys ${table} packs of ${selectedContextItem}. Each pack has ${factor} items. ${isAdd ? `Then a friend gives ${context.name} ${changeAmount} more.` : `${context.name} gives away ${changeAmount}.`} How many ${selectedContextItem} does ${context.name} have ${isAdd ? 'altogether' : 'left'}?`;
        answer = String(finalAnswer);
      } else if (questionType === 1) {
        askText = `${context.name} buys some packs of ${selectedContextItem}. Each pack has ${factor} items. ${isAdd ? `Then a friend gives ${context.name} ${changeAmount} more, making the total ${finalAnswer}.` : `${context.name} gives away ${changeAmount}, leaving ${finalAnswer}.`} How many packs did ${context.name} buy?`;
        answer = String(table);
      } else {
        askText = `${context.name} buys ${table} packs of ${selectedContextItem}. Each pack has ${factor} items. ${isAdd ? `Then a friend gives ${context.name} some more, making the total ${finalAnswer}.` : `${context.name} gives away some, leaving ${finalAnswer}.`} How many ${selectedContextItem} did ${isAdd ? 'the friend give' : `${context.name} give away`}?`;
        answer = String(changeAmount);
      }
      questionStemConstraint = `- The question stem must clearly ask: "${askText}".`;
    }
  }
  else if (activeVariant === 'advanced_add_subtract_then_divide') {
    const isAdd = Math.random() > 0.5;
    const containerSize = Math.floor(Math.random() * 6) + 4; // 4 to 9
    const finalContainers = Math.floor(Math.random() * 6) + 4; // 4 to 9
    const totalItems = containerSize * finalContainers;

    const part1 = Math.floor(totalItems * 0.4) + Math.floor(Math.random() * (totalItems * 0.2));
    const part2 = totalItems - part1;

    // For subtract scenario, initial is totalItems + part1, then subtracts part1 to get totalItems
    const initialAmount = isAdd ? part1 : totalItems + part1;
    const changeAmount = isAdd ? part2 : part1;

    // 0 = ask for final containers (e), 1 = ask for initial amount (a), 2 = ask for container size (d)
    const questionType = Math.floor(Math.random() * 3);

    if (isStructure) {
      if (questionType === 0) {
        if (isAdd) {
          askText = `Write a creative, concise word problem (under 3 sentences) about ${context.name} and ${selectedContextItem}. The story must logically require the student to add ${initialAmount} and ${changeAmount} to find a total pool of items, and then divide that pool equally into groups of ${containerSize}. The final question must ask the student to find the number of groups.`;
        } else {
          askText = `Write a creative, concise word problem (under 3 sentences) about ${context.name} and ${selectedContextItem}. The story must logically require the student to subtract ${changeAmount} from ${initialAmount} to find a remaining pool of items, and then divide that pool equally into groups of ${containerSize}. The final question must ask the student to find the number of groups.`;
        }
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
        
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1 (Find total items)", expectedAnswer: isAdd ? `${initialAmount} + ${changeAmount} = ${totalItems}` : `${initialAmount} - ${changeAmount} = ${totalItems}` },
            { label: "Step 2 (Find number of groups)", expectedAnswer: `${totalItems} ÷ ${containerSize} = ${finalContainers}` },
            { label: "Step 3 (Final Answer)", expectedAnswer: String(finalContainers) }
          ]
        });
        answer = String(finalContainers);
        customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${isAdd ? `${initialAmount} + ${changeAmount} = ${totalItems}` : `${initialAmount} - ${changeAmount} = ${totalItems}`}".
- For MULTI_STEP_INPUT Step 2, the expectedAnswer MUST exactly be "${totalItems} ÷ ${containerSize} = ${finalContainers}".
- For MULTI_STEP_INPUT Step 3 (Final Answer), the expectedAnswer MUST exactly be "${finalContainers}".`;

      } else if (questionType === 1) {
        if (isAdd) {
          askText = `Write a creative, concise word problem (under 3 sentences) about ${context.name} and ${selectedContextItem}. State that an unknown amount of items is added to ${changeAmount} items, and the total is packed equally into ${finalContainers} groups of ${containerSize} items each. Ask the student to find the initial unknown amount of items.`;
        } else {
          askText = `Write a creative, concise word problem (under 3 sentences) about ${context.name} and ${selectedContextItem}. State that ${changeAmount} items are removed from an unknown initial amount of items, and the remainder is packed equally into ${finalContainers} groups of ${containerSize} items each. Ask the student to find the initial unknown amount of items.`;
        }
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
        
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1 (Find total packed items)", expectedAnswer: `${finalContainers} x ${containerSize} = ${totalItems}` },
            { label: "Step 2 (Find initial amount)", expectedAnswer: isAdd ? `${totalItems} - ${changeAmount} = ${initialAmount}` : `${totalItems} + ${changeAmount} = ${initialAmount}` },
            { label: "Step 3 (Final Answer)", expectedAnswer: String(initialAmount) }
          ]
        });
        answer = String(initialAmount);
        customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${finalContainers} x ${containerSize} = ${totalItems}".
- For MULTI_STEP_INPUT Step 2, the expectedAnswer MUST exactly be "${isAdd ? `${totalItems} - ${changeAmount} = ${initialAmount}` : `${totalItems} + ${changeAmount} = ${initialAmount}`}".
- For MULTI_STEP_INPUT Step 3 (Final Answer), the expectedAnswer MUST exactly be "${initialAmount}".`;

      } else {
        if (isAdd) {
          askText = `Write a creative, concise word problem (under 3 sentences) about ${context.name} and ${selectedContextItem}. State that ${initialAmount} items and ${changeAmount} items are combined, and the total is packed equally into ${finalContainers} groups. Ask the student to find how many items are in each group.`;
        } else {
          askText = `Write a creative, concise word problem (under 3 sentences) about ${context.name} and ${selectedContextItem}. State that ${changeAmount} items are removed from ${initialAmount} items, and the remainder is packed equally into ${finalContainers} groups. Ask the student to find how many items are in each group.`;
        }
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
        
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1 (Find total items)", expectedAnswer: isAdd ? `${initialAmount} + ${changeAmount} = ${totalItems}` : `${initialAmount} - ${changeAmount} = ${totalItems}` },
            { label: "Step 2 (Find items per group)", expectedAnswer: `${totalItems} ÷ ${finalContainers} = ${containerSize}` },
            { label: "Step 3 (Final Answer)", expectedAnswer: String(containerSize) }
          ]
        });
        answer = String(containerSize);
        customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${isAdd ? `${initialAmount} + ${changeAmount} = ${totalItems}` : `${initialAmount} - ${changeAmount} = ${totalItems}`}".
- For MULTI_STEP_INPUT Step 2, the expectedAnswer MUST exactly be "${totalItems} ÷ ${finalContainers} = ${containerSize}".
- For MULTI_STEP_INPUT Step 3 (Final Answer), the expectedAnswer MUST exactly be "${containerSize}".`;
      }
    } else {
      if (questionType === 0) {
        askText = `${context.name} has ${initialAmount} ${selectedContextItem}${isAdd ? ` and gets ${changeAmount} more` : `, but gives away ${changeAmount}`}. ${context.name} packs the remaining ${selectedContextItem} equally into boxes of ${containerSize}. How many boxes are needed?`;
        answer = String(finalContainers);
      } else if (questionType === 1) {
        askText = `${context.name} has some ${selectedContextItem}${isAdd ? ` and gets ${changeAmount} more` : `, but gives away ${changeAmount}`}. ${context.name} packs the remaining ${selectedContextItem} equally into ${finalContainers} boxes of ${containerSize}. How many ${selectedContextItem} did ${context.name} have at first?`;
        answer = String(initialAmount);
      } else {
        askText = `${context.name} has ${initialAmount} ${selectedContextItem}${isAdd ? ` and gets ${changeAmount} more` : `, but gives away ${changeAmount}`}. ${context.name} packs the remaining ${selectedContextItem} equally into ${finalContainers} boxes. How many ${selectedContextItem} are in each box?`;
        answer = String(containerSize);
      }
      questionStemConstraint = `- The question stem must clearly ask: "${askText}".`;
    }
  }
  else if (activeVariant === 'advanced_missing_multiplier_model') {
    const multiplier = Math.floor(Math.random() * 5) + 3; // 3 to 7
    const oneUnit = Math.floor(Math.random() * 7) + 3; // 3 to 9
    const totalUnits = multiplier + 1;
    const totalItems = totalUnits * oneUnit;

    const questionType = Math.floor(Math.random() * 2); // 0 = ask for oneUnit, 1 = ask for multiplier

    if (isStructure) {
      if (questionType === 0) {
        askText = `Write a creative, concise word problem (under 3 sentences) about ${context.name} and ${selectedContextItem}. State that a friend has ${multiplier} times as many items as ${context.name}, and together they have ${totalItems} items. Ask the student to find how many items ${context.name} has.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1 (Find total units)", expectedAnswer: `${multiplier} + 1 = ${totalUnits}` },
            { label: "Step 2 (Find one unit)", expectedAnswer: `${totalItems} ÷ ${totalUnits} = ${oneUnit}` },
            { label: "Step 3 (Final Answer)", expectedAnswer: String(oneUnit) }
          ]
        });
        answer = String(oneUnit);
        customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${multiplier} + 1 = ${totalUnits}".
- For MULTI_STEP_INPUT Step 2, the expectedAnswer MUST exactly be "${totalItems} ÷ ${totalUnits} = ${oneUnit}".
- For MULTI_STEP_INPUT Step 3 (Final Answer), the expectedAnswer MUST exactly be "${oneUnit}".`;
      } else {
        askText = `Write a creative, concise word problem (under 3 sentences) about ${context.name} and ${selectedContextItem}. State that ${context.name} has ${oneUnit} items, and together with a friend they have ${totalItems} items. Ask the student to find how many times as many items the friend has compared to ${context.name}.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1 (Find total units)", expectedAnswer: `${totalItems} ÷ ${oneUnit} = ${totalUnits}` },
            { label: "Step 2 (Find multiplier)", expectedAnswer: `${totalUnits} - 1 = ${multiplier}` },
            { label: "Step 3 (Final Answer)", expectedAnswer: String(multiplier) }
          ]
        });
        answer = String(multiplier);
        customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${totalItems} ÷ ${oneUnit} = ${totalUnits}".
- For MULTI_STEP_INPUT Step 2, the expectedAnswer MUST exactly be "${totalUnits} - 1 = ${multiplier}".
- For MULTI_STEP_INPUT Step 3 (Final Answer), the expectedAnswer MUST exactly be "${multiplier}".`;
      }
    } else {
      if (questionType === 0) {
        askText = `A friend has ${multiplier} times as many ${selectedContextItem} as ${context.name}. Together, they have ${totalItems} ${selectedContextItem}. How many ${selectedContextItem} does ${context.name} have?`;
        answer = String(oneUnit);
      } else {
        askText = `${context.name} has ${oneUnit} ${selectedContextItem}. Together with a friend, they have ${totalItems} ${selectedContextItem}. How many times as many ${selectedContextItem} does the friend have compared to ${context.name}?`;
        answer = String(multiplier);
      }
      questionStemConstraint = `- The question stem must clearly ask: "${askText}".`;
    }
  }
  else if (activeVariant === 'advanced_value_vs_quantity') {
    const denominations = [2, 5, 10]; // notes
    const coinDenominations = [10, 20, 50]; // cents
    const isNotes = Math.random() > 0.5;

    const denomList = isNotes ? denominations : coinDenominations;
    const formatStr = (val) => isNotes ? `$${val}` : `${val}¢`;
    const formatName = (val) => isNotes ? `$${val} notes` : `${val}¢ coins`;

    // Pick two different denominations
    const noteA = denomList[Math.floor(Math.random() * denomList.length)];
    let noteB = denomList[Math.floor(Math.random() * denomList.length)];
    while (noteB === noteA) {
      noteB = denomList[Math.floor(Math.random() * denomList.length)];
    }

    const quantityA = Math.floor(Math.random() * 6) + 3; // 3 to 8
    const quantityB = Math.floor(Math.random() * 6) + 3; // 3 to 8

    const valueA = quantityA * noteA;
    const valueB = quantityB * noteB;
    const totalValue = valueA + valueB;

    const questionType = Math.floor(Math.random() * 3); // 0 = ask quantity B, 1 = ask total value, 2 = ask quantity A

    if (isStructure) {
      if (questionType === 0) {
        askText = `Write a creative, concise word problem (under 3 sentences) about ${context.name}. State that ${context.name} has ${quantityA} pieces of ${formatName(noteA)} and some ${formatName(noteB)}. The total amount of money is ${formatStr(totalValue)}. Ask the student to find the number of pieces of ${formatName(noteB)}.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Step 1 (Value of ${formatName(noteA)})`, expectedAnswer: `${quantityA} x ${noteA} = ${valueA}` },
            { label: `Step 2 (Value of ${formatName(noteB)})`, expectedAnswer: `${totalValue} - ${valueA} = ${valueB}` },
            { label: "Step 3 (Final Answer)", expectedAnswer: String(quantityB) }
          ]
        });
        answer = String(quantityB);
        customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${quantityA} x ${noteA} = ${valueA}".
- For MULTI_STEP_INPUT Step 2, the expectedAnswer MUST exactly be "${totalValue} - ${valueA} = ${valueB}".
- For MULTI_STEP_INPUT Step 3 (Final Answer), the expectedAnswer MUST exactly be "${quantityB}".`;

      } else if (questionType === 1) {
        askText = `Write a creative, concise word problem (under 3 sentences) about ${context.name}. State that ${context.name} has ${quantityA} pieces of ${formatName(noteA)} and ${quantityB} pieces of ${formatName(noteB)}. Ask the student to find the total amount of money.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Step 1 (Value of ${formatName(noteA)})`, expectedAnswer: `${quantityA} x ${noteA} = ${valueA}` },
            { label: `Step 2 (Value of ${formatName(noteB)})`, expectedAnswer: `${quantityB} x ${noteB} = ${valueB}` },
            { label: "Step 3 (Final Answer)", expectedAnswer: formatStr(totalValue) }
          ]
        });
        answer = formatStr(totalValue);
        customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${quantityA} x ${noteA} = ${valueA}".
- For MULTI_STEP_INPUT Step 2, the expectedAnswer MUST exactly be "${quantityB} x ${noteB} = ${valueB}".
- For MULTI_STEP_INPUT Step 3 (Final Answer), the expectedAnswer MUST exactly be "${answer}".`;

      } else {
        askText = `Write a creative, concise word problem (under 3 sentences) about ${context.name}. State that ${context.name} has some ${formatName(noteA)} and ${quantityB} pieces of ${formatName(noteB)}. The total amount of money is ${formatStr(totalValue)}. Ask the student to find the number of pieces of ${formatName(noteA)}.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Step 1 (Value of ${formatName(noteB)})`, expectedAnswer: `${quantityB} x ${noteB} = ${valueB}` },
            { label: `Step 2 (Value of ${formatName(noteA)})`, expectedAnswer: `${totalValue} - ${valueB} = ${valueA}` },
            { label: "Step 3 (Final Answer)", expectedAnswer: String(quantityA) }
          ]
        });
        answer = String(quantityA);
        customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${quantityB} x ${noteB} = ${valueB}".
- For MULTI_STEP_INPUT Step 2, the expectedAnswer MUST exactly be "${totalValue} - ${valueB} = ${valueA}".
- For MULTI_STEP_INPUT Step 3 (Final Answer), the expectedAnswer MUST exactly be "${quantityA}".`;
      }
    } else {
      if (questionType === 0) {
        askText = `${context.name} has ${quantityA} pieces of ${formatName(noteA)} and some ${formatName(noteB)}. The total amount of money is ${formatStr(totalValue)}. How many pieces of ${formatName(noteB)} does ${context.name} have?`;
        answer = String(quantityB);
      } else if (questionType === 1) {
        askText = `${context.name} has ${quantityA} pieces of ${formatName(noteA)} and ${quantityB} pieces of ${formatName(noteB)}. What is the total amount of money?`;
        answer = formatStr(totalValue);
      } else {
        askText = `${context.name} has some ${formatName(noteA)} and ${quantityB} pieces of ${formatName(noteB)}. The total amount of money is ${formatStr(totalValue)}. How many pieces of ${formatName(noteA)} does ${context.name} have?`;
        answer = String(quantityA);
      }
      questionStemConstraint = `- The question stem must clearly ask: "${askText}".`;
    }
  }
  else if (activeVariant === 'advanced_two_part_comparison') {
    const multiplier = Math.floor(Math.random() * 6) + 3; // 3 to 8
    const baseQuantity = Math.floor(Math.random() * 6) + 4; // 4 to 9
    const scaledQuantity = multiplier * baseQuantity;
    const totalQuantity = baseQuantity + scaledQuantity;

    const questionType = Math.floor(Math.random() * 3); // 0 = find total (given scaled & multiplier), 1 = find multiplier (given scaled & total), 2 = find total (given base & multiplier)

    if (isStructure) {
      if (questionType === 0) {
        askText = `Write a creative, concise word problem (under 3 sentences) about ${context.name} and ${selectedContextItem}. State that ${context.name} has ${scaledQuantity} items, which is ${multiplier} times as many as a friend. Ask the student to find how many items they have altogether.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1 (Find friend's quantity)", expectedAnswer: `${scaledQuantity} ÷ ${multiplier} = ${baseQuantity}` },
            { label: "Step 2 (Find total quantity)", expectedAnswer: `${scaledQuantity} + ${baseQuantity} = ${totalQuantity}` },
            { label: "Step 3 (Final Answer)", expectedAnswer: String(totalQuantity) }
          ]
        });
        answer = String(totalQuantity);
        customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${scaledQuantity} ÷ ${multiplier} = ${baseQuantity}".
- For MULTI_STEP_INPUT Step 2, the expectedAnswer MUST exactly be "${scaledQuantity} + ${baseQuantity} = ${totalQuantity}".
- For MULTI_STEP_INPUT Step 3 (Final Answer), the expectedAnswer MUST exactly be "${totalQuantity}".`;

      } else if (questionType === 1) {
        askText = `Write a creative, concise word problem (under 3 sentences) about ${context.name} and ${selectedContextItem}. State that ${context.name} has ${scaledQuantity} items, and together with a friend they have ${totalQuantity} items. Ask the student to find how many times as many items ${context.name} has compared to the friend.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1 (Find friend's quantity)", expectedAnswer: `${totalQuantity} - ${scaledQuantity} = ${baseQuantity}` },
            { label: "Step 2 (Find multiplier)", expectedAnswer: `${scaledQuantity} ÷ ${baseQuantity} = ${multiplier}` },
            { label: "Step 3 (Final Answer)", expectedAnswer: String(multiplier) }
          ]
        });
        answer = String(multiplier);
        customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${totalQuantity} - ${scaledQuantity} = ${baseQuantity}".
- For MULTI_STEP_INPUT Step 2, the expectedAnswer MUST exactly be "${scaledQuantity} ÷ ${baseQuantity} = ${multiplier}".
- For MULTI_STEP_INPUT Step 3 (Final Answer), the expectedAnswer MUST exactly be "${multiplier}".`;

      } else {
        askText = `Write a creative, concise word problem (under 3 sentences) about ${context.name} and ${selectedContextItem}. State that a friend has ${baseQuantity} items, and ${context.name} has ${multiplier} times as many items as the friend. Ask the student to find how many items they have altogether.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1 (Find ${context.name}'s quantity)", expectedAnswer: `${baseQuantity} x ${multiplier} = ${scaledQuantity}` },
            { label: "Step 2 (Find total quantity)", expectedAnswer: `${scaledQuantity} + ${baseQuantity} = ${totalQuantity}` },
            { label: "Step 3 (Final Answer)", expectedAnswer: String(totalQuantity) }
          ]
        });
        answer = String(totalQuantity);
        customConstraints = `
- For MULTI_STEP_INPUT Step 1, the expectedAnswer MUST exactly be "${baseQuantity} x ${multiplier} = ${scaledQuantity}".
- For MULTI_STEP_INPUT Step 2, the expectedAnswer MUST exactly be "${scaledQuantity} + ${baseQuantity} = ${totalQuantity}".
- For MULTI_STEP_INPUT Step 3 (Final Answer), the expectedAnswer MUST exactly be "${totalQuantity}".`;
      }
    } else {
      if (questionType === 0) {
        askText = `${context.name} has ${scaledQuantity} ${selectedContextItem}. ${context.name} has ${multiplier} times as many ${selectedContextItem} as a friend. How many ${selectedContextItem} do they have altogether?`;
        answer = String(totalQuantity);
      } else if (questionType === 1) {
        askText = `${context.name} has ${scaledQuantity} ${selectedContextItem}. Together with a friend, they have ${totalQuantity} ${selectedContextItem}. How many times as many ${selectedContextItem} does ${context.name} have compared to the friend?`;
        answer = String(multiplier);
      } else {
        askText = `A friend has ${baseQuantity} ${selectedContextItem}. ${context.name} has ${multiplier} times as many ${selectedContextItem} as the friend. How many ${selectedContextItem} do they have altogether?`;
        answer = String(totalQuantity);
      }
      questionStemConstraint = `- The question stem must clearly ask: "${askText}".`;
    }
  }

  // If this was originally an MCQ question but we used the structured logic to generate a creative word problem,
  // we must remove the multi-step input requirements so the AI generates standard MCQ options instead.
  if (originalIsMCQ) {
    inputRequirementStr = null;
    customConstraints = '';
  }

  const aiPrompt = `
You are an expert mathematics educator creating content for Primary 3 students.

Topic: ${topic}
Difficulty: ${difficulty}
Variant: ${activeVariant}

Your task is to generate a JSON response following this strict schema:
${getFormatInstructions(JSON.stringify({ componentToRender: "NONE", componentData: { hideVisual: true } }), inputRequirementStr)}

CRITICAL INSTRUCTIONS:
${questionStemConstraint}
- The final answer MUST exactly match: "${answer}".
- The solutionSteps should clearly explain how to get the answer.
${customConstraints}
`;

  return { aiPrompt };
};
