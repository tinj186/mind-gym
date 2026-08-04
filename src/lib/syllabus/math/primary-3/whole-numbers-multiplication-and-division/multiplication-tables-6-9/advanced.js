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
  let customConstraints = "";
  let questionStemConstraint = "";
  
  const isWordProblem = isStructure || (isMCQ && Math.random() > 0.5);
  const localGetQText = (long, short) => {
    if (isWordProblem) return long;
    return short || long;
  };

  if (activeVariant === 'advanced_2_step_word_problem') {
    const table = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
    const groups = Math.floor(Math.random() * 5) + 3; // 3 to 7
    const product = table * groups;
    
    const isAdding = Math.random() > 0.5;
    let extra = Math.floor(Math.random() * 20) + 5;
    
    // Prevent negative numbers for subtraction
    if (!isAdding && extra >= product) {
      extra = Math.floor(Math.random() * (product - 1)) + 1;
    }
    
    const finalTotal = isAdding ? product + extra : product - extra;
    
    const unknownType = Math.floor(Math.random() * 4); // 0: find E, 1: find D, 2: find A, 3: find B

    switch (unknownType) {
      case 0: // Find Final Total (E)
        answer = String(finalTotal);
        if (isAdding) {
          askText = localGetQText(
            `${context.name} has ${groups} boxes of ${selectedContextItem}. There are ${table} ${selectedContextItem} in each box. Then, a friend gives ${context.name} ${extra} more ${selectedContextItem}. How many ${selectedContextItem} does ${context.name} have altogether?`,
            `${groups} boxes of ${table}. Got ${extra} more. Total?`
          );
          if (isStructure) {
            inputRequirementStr = JSON.stringify({
              inputType: "MULTI_STEP_INPUT",
              steps: [
                { label: "Step 1", expectedAnswer: `${groups} x ${table} = ${product}` },
                { label: "Step 2 (Final Answer)", expectedAnswer: `${product} + ${extra} = ${finalTotal}` }
              ]
            });
          }
        } else {
          askText = localGetQText(
            `${context.name} has ${groups} boxes of ${selectedContextItem}. There are ${table} ${selectedContextItem} in each box. ${context.name} gives away ${extra} ${selectedContextItem}. How many ${selectedContextItem} does ${context.name} have left?`,
            `${groups} boxes of ${table}. Gave away ${extra}. Left?`
          );
          if (isStructure) {
            inputRequirementStr = JSON.stringify({
              inputType: "MULTI_STEP_INPUT",
              steps: [
                { label: "Step 1", expectedAnswer: `${groups} x ${table} = ${product}` },
                { label: "Step 2 (Final Answer)", expectedAnswer: `${product} - ${extra} = ${finalTotal}` }
              ]
            });
          }
        }
        break;

      case 1: // Find Offset (D)
        answer = String(extra);
        if (isAdding) {
          askText = localGetQText(
            `${context.name} has ${groups} boxes of ${selectedContextItem}. There are ${table} ${selectedContextItem} in each box. Then, a friend gives ${context.name} some more ${selectedContextItem}. ${context.name} now has ${finalTotal} ${selectedContextItem} altogether. How many ${selectedContextItem} did the friend give to ${context.name}?`,
            `${groups} boxes of ${table}. Got some more. Now has ${finalTotal}. How many more?`
          );
          if (isStructure) {
            inputRequirementStr = JSON.stringify({
              inputType: "MULTI_STEP_INPUT",
              steps: [
                { label: "Step 1", expectedAnswer: `${groups} x ${table} = ${product}` },
                { label: "Step 2 (Final Answer)", expectedAnswer: `${finalTotal} - ${product} = ${extra}` }
              ]
            });
          }
        } else {
          askText = localGetQText(
            `${context.name} has ${groups} boxes of ${selectedContextItem}. There are ${table} ${selectedContextItem} in each box. ${context.name} gives away some ${selectedContextItem}. ${context.name} now has ${finalTotal} ${selectedContextItem} left. How many ${selectedContextItem} did ${context.name} give away?`,
            `${groups} boxes of ${table}. Gave away some. Now has ${finalTotal}. How many given away?`
          );
          if (isStructure) {
            inputRequirementStr = JSON.stringify({
              inputType: "MULTI_STEP_INPUT",
              steps: [
                { label: "Step 1", expectedAnswer: `${groups} x ${table} = ${product}` },
                { label: "Step 2 (Final Answer)", expectedAnswer: `${product} - ${finalTotal} = ${extra}` }
              ]
            });
          }
        }
        break;

      case 2: // Find Groups (A)
        answer = String(groups);
        if (isAdding) {
          askText = localGetQText(
            `${context.name} has some boxes of ${selectedContextItem}, with ${table} ${selectedContextItem} in each box. Then, a friend gives ${context.name} ${extra} more ${selectedContextItem}. ${context.name} now has ${finalTotal} ${selectedContextItem} altogether. How many boxes of ${selectedContextItem} did ${context.name} have at first?`,
            `Some boxes of ${table}. Got ${extra} more. Now has ${finalTotal}. How many boxes?`
          );
          if (isStructure) {
            inputRequirementStr = JSON.stringify({
              inputType: "MULTI_STEP_INPUT",
              steps: [
                { label: "Step 1", expectedAnswer: `${finalTotal} - ${extra} = ${product}` },
                { label: "Step 2 (Final Answer)", expectedAnswer: `${product} ÷ ${table} = ${groups}` }
              ]
            });
          }
        } else {
          askText = localGetQText(
            `${context.name} has some boxes of ${selectedContextItem}, with ${table} ${selectedContextItem} in each box. ${context.name} gives away ${extra} ${selectedContextItem}. ${context.name} now has ${finalTotal} ${selectedContextItem} left. How many boxes of ${selectedContextItem} did ${context.name} have at first?`,
            `Some boxes of ${table}. Gave away ${extra}. Now has ${finalTotal}. How many boxes?`
          );
          if (isStructure) {
            inputRequirementStr = JSON.stringify({
              inputType: "MULTI_STEP_INPUT",
              steps: [
                { label: "Step 1", expectedAnswer: `${finalTotal} + ${extra} = ${product}` },
                { label: "Step 2 (Final Answer)", expectedAnswer: `${product} ÷ ${table} = ${groups}` }
              ]
            });
          }
        }
        break;

      case 3: // Find Items per Group (B)
        answer = String(table);
        if (isAdding) {
          askText = localGetQText(
            `${context.name} has ${groups} boxes of ${selectedContextItem}, with an equal number in each box. Then, a friend gives ${context.name} ${extra} more ${selectedContextItem}. ${context.name} now has ${finalTotal} ${selectedContextItem} altogether. How many ${selectedContextItem} were in each box?`,
            `${groups} boxes with equal amounts. Got ${extra} more. Now has ${finalTotal}. How many in each box?`
          );
          if (isStructure) {
            inputRequirementStr = JSON.stringify({
              inputType: "MULTI_STEP_INPUT",
              steps: [
                { label: "Step 1", expectedAnswer: `${finalTotal} - ${extra} = ${product}` },
                { label: "Step 2 (Final Answer)", expectedAnswer: `${product} ÷ ${groups} = ${table}` }
              ]
            });
          }
        } else {
          askText = localGetQText(
            `${context.name} has ${groups} boxes of ${selectedContextItem}, with an equal number in each box. ${context.name} gives away ${extra} ${selectedContextItem}. ${context.name} now has ${finalTotal} ${selectedContextItem} left. How many ${selectedContextItem} were in each box?`,
            `${groups} boxes with equal amounts. Gave away ${extra}. Now has ${finalTotal}. How many in each box?`
          );
          if (isStructure) {
            inputRequirementStr = JSON.stringify({
              inputType: "MULTI_STEP_INPUT",
              steps: [
                { label: "Step 1", expectedAnswer: `${finalTotal} + ${extra} = ${product}` },
                { label: "Step 2 (Final Answer)", expectedAnswer: `${product} ÷ ${groups} = ${table}` }
              ]
            });
          }
        }
        break;
    }
  }
  else if (activeVariant === 'advanced_comparing_products') {
    const table1 = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
    const multiplier1 = Math.floor(Math.random() * 6) + 4; // 4 to 9
    const prod1 = table1 * multiplier1;

    let table2, multiplier2, prod2;
    do {
      table2 = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
      multiplier2 = Math.floor(Math.random() * 6) + 4;
      prod2 = table2 * multiplier2;
    } while (prod1 === prod2);

    const askLarger = Math.random() > 0.5;
    const targetProd = askLarger ? Math.max(prod1, prod2) : Math.min(prod1, prod2);
    
    answer = String(targetProd);
    const comparison = askLarger ? "larger" : "smaller";

    if (isWordProblem) {
      askText = `Write a creative word problem where ${context.name} is comparing two options for acquiring ${selectedContextItem}. The first option gives ${table1} groups of ${multiplier1}. The second option gives ${table2} groups of ${multiplier2}. Ask the student which option gives the ${comparison} total amount, and to provide the value of that ${comparison} total.`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1", expectedAnswer: `${table1} x ${multiplier1} = ${prod1}` },
            { label: "Step 2", expectedAnswer: `${table2} x ${multiplier2} = ${prod2}` },
            { label: "Step 3 (Final Answer)", expectedAnswer: `${targetProd}` }
          ]
        });
      }
    } else {
      askText = `Which is ${comparison}: ${table1} x ${multiplier1} or ${table2} x ${multiplier2}? Give the value of the ${comparison} product.`;
      questionStemConstraint = `- The question stem must clearly ask exactly: "${askText}". DO NOT add any word problem context or extra sentences.`;
    }
  }
  else if (activeVariant === 'advanced_distributive') {
    const isSameGroupSize = Math.random() > 0.5;

    if (isSameGroupSize) {
      // Variety 1: Same Group Size (Pure Distributive Property)
      const table = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
      const multiplier = Math.floor(Math.random() * 4) + 6; // 6 to 9
      const part1 = Math.floor(Math.random() * (multiplier - 2)) + 1; // 1 to multiplier-1
      const part2 = multiplier - part1;

      answer = String(part2);
      
      if (isWordProblem) {
        askText = `Write a creative word problem where ${context.name} needs a total of ${multiplier} groups, sets, or containers of ${selectedContextItem} (with ${table} in each). They already have ${part1} groups of ${table}. Ask the student how many more groups of ${table} they need to reach the total. DO NOT explicitly mention the answer ${part2} in the text.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
        
        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: "Step 1 (Final Answer)", expectedAnswer: `${multiplier} - ${part1} = ${part2}` }
            ]
          });
        }
      } else {
        askText = `Fill in the missing number: ${multiplier} groups of ${table} = ${part1} groups of ${table} and ? groups of ${table}`;
        questionStemConstraint = `- The question stem must clearly ask exactly: "${askText}". DO NOT add any word problem context or extra sentences.`;
      }
    } else {
      // Variety 2: Different Group Size (Algebraic Balance)
      let table1, multiplier, table2, part1, part2, totalProd, part1Prod, remainingProd;
      
      do {
        table1 = [6, 7, 8, 9][Math.floor(Math.random() * 4)]; // 'b' (initial group size)
        multiplier = Math.floor(Math.random() * 5) + 5; // 'a' (total groups, 5 to 9)
        totalProd = multiplier * table1;
        
        part1 = Math.floor(Math.random() * (multiplier - 2)) + 1; // 'd' (groups already done)
        part1Prod = part1 * table1;
        
        table2 = [4, 5, 6, 7, 8, 9][Math.floor(Math.random() * 6)]; // 'e' (new group size)
        
        remainingProd = totalProd - part1Prod;
        part2 = remainingProd / table2; // '?' (missing groups)
      } while (
        table1 === table2 || // Must switch to a different group size
        remainingProd <= 0 || // Must be a positive remainder
        remainingProd % table2 !== 0 || // Must be perfectly divisible
        part2 <= 1 || part2 > 12 // Reasonable missing groups
      );

      answer = String(part2);
      
      if (isWordProblem) {
        askText = `Write a creative word problem where ${context.name} needs a total amount equal to ${multiplier} groups of ${table1} ${selectedContextItem}. They have already completed ${part1} groups of ${table1}. They decide to pack the remaining items into groups of ${table2}. Ask the student how many groups of ${table2} they need for the remaining items. DO NOT explicitly mention the answer ${part2} in the text.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
        
        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: "Step 1", expectedAnswer: `${multiplier} x ${table1} = ${totalProd}` },
              { label: "Step 2", expectedAnswer: `${part1} x ${table1} = ${part1Prod}` },
              { label: "Step 3", expectedAnswer: `${totalProd} - ${part1Prod} = ${remainingProd}` },
              { label: "Step 4 (Final Answer)", expectedAnswer: `${remainingProd} ÷ ${table2} = ${part2}` }
            ]
          });
        }
      } else {
        askText = `Fill in the missing number: ${multiplier} groups of ${table1} = ${part1} groups of ${table1} and ? groups of ${table2}`;
        questionStemConstraint = `- The question stem must clearly ask exactly: "${askText}". DO NOT add any word problem context or extra sentences.`;
      }
    }
  }
  else if (activeVariant === 'advanced_balance_equations') {
    // Generate valid balanced multiplication: A x B = C x D
    const validPairs = [
      {a: 6, b: 6, c: 4, d: 9},
      {a: 6, b: 8, c: 4, d: 12},
      {a: 8, b: 9, c: 6, d: 12},
      {a: 9, b: 4, c: 6, d: 6},
      {a: 6, b: 12, c: 8, d: 9}
    ];
    const pair = validPairs[Math.floor(Math.random() * validPairs.length)];
    
    const isLeftMissing = Math.random() > 0.5;
    const missingValue = isLeftMissing ? pair.b : pair.d;
    const knownProd = pair.a * pair.b;
    
    answer = String(missingValue);

    if (isWordProblem) {
      if (isLeftMissing) {
        askText = `Write a creative word problem where ${context.name} has ${pair.a} groups of an unknown number of ${selectedContextItem}. A friend has ${pair.c} groups of ${pair.d} ${selectedContextItem}. They both have the exact same total number of ${selectedContextItem}. Ask the student to find the unknown number of ${selectedContextItem} in each of ${context.name}'s groups. DO NOT explicitly mention the answer ${missingValue} in the text.`;
        
        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: "Step 1", expectedAnswer: `${pair.c} x ${pair.d} = ${knownProd}` },
              { label: "Step 2 (Final Answer)", expectedAnswer: `${knownProd} ÷ ${pair.a} = ${missingValue}` }
            ]
          });
        }
      } else {
        askText = `Write a creative word problem where ${context.name} has ${pair.a} groups of ${pair.b} ${selectedContextItem}. A friend has ${pair.c} groups of an unknown number of ${selectedContextItem}. They both have the exact same total number of ${selectedContextItem}. Ask the student to find the unknown number of ${selectedContextItem} in each of the friend's groups. DO NOT explicitly mention the answer ${missingValue} in the text.`;
        
        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: "Step 1", expectedAnswer: `${pair.a} x ${pair.b} = ${knownProd}` },
              { label: "Step 2 (Final Answer)", expectedAnswer: `${knownProd} ÷ ${pair.c} = ${missingValue}` }
            ]
          });
        }
      }
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
    } else {
      if (isLeftMissing) {
        askText = `Find the missing number: ${pair.a} x ? = ${pair.c} x ${pair.d}`;
      } else {
        askText = `Find the missing number: ${pair.a} x ${pair.b} = ${pair.c} x ?`;
      }
      questionStemConstraint = `- The question stem must clearly ask exactly: "${askText}". DO NOT add any word problem context or extra sentences.`;
    }
  }
  else if (activeVariant === 'advanced_word_problem_difference') {
    const isSameGroupSize = Math.random() > 0.5;

    if (isSameGroupSize) {
      // Variety 1: Same Group Size (Shortcut Method)
      const table = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
      const groups1 = Math.floor(Math.random() * 5) + 5; // 5 to 9
      const groups2 = Math.floor(Math.random() * 3) + 1; // 1 to 3
      
      const diffGroups = groups1 - groups2;
      const difference = diffGroups * table;

      answer = String(difference);
      
      if (isWordProblem) {
        askText = `Write a creative word problem where ${context.name} has ${groups1} groups, sets, or containers of ${selectedContextItem}. A friend has ${groups2} groups of ${selectedContextItem}. Each group contains exactly ${table} ${selectedContextItem}. Ask the student how many more ${selectedContextItem} ${context.name} has than their friend.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: "Step 1", expectedAnswer: `${groups1} - ${groups2} = ${diffGroups}` },
              { label: "Step 2 (Final Answer)", expectedAnswer: `${diffGroups} x ${table} = ${difference}` }
            ]
          });
        }
      } else {
        askText = localGetQText(
          `${context.name} has ${groups1} boxes of ${selectedContextItem}. A friend has ${groups2} boxes of ${selectedContextItem}. Each box contains ${table} ${selectedContextItem}. How many more ${selectedContextItem} does ${context.name} have than their friend?`,
          `${context.name} has ${groups1} boxes, friend has ${groups2} boxes. Each has ${table}. Difference in ${selectedContextItem}?`
        );
      }
    } else {
      // Variety 2: Different Group Size (Full Calculation)
      const table1 = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
      let table2;
      do {
        table2 = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
      } while (table1 === table2);
      
      const groups1 = Math.floor(Math.random() * 5) + 5; // 5 to 9
      const groups2 = Math.floor(Math.random() * 4) + 2; // 2 to 5
      
      const total1 = table1 * groups1;
      const total2 = table2 * groups2;
      
      // Ensure context.name always has more to prevent negative numbers
      let name1, name2, t1, t2, g1, g2, tot1, tot2;
      if (total1 > total2) {
        name1 = context.name;
        name2 = "a friend";
        t1 = table1; t2 = table2;
        g1 = groups1; g2 = groups2;
        tot1 = total1; tot2 = total2;
      } else {
        name1 = context.name;
        name2 = "a friend";
        t1 = table2; t2 = table1;
        g1 = groups2; g2 = groups1;
        tot1 = total2; tot2 = total1;
      }
      
      const difference = tot1 - tot2;

      answer = String(difference);
      
      if (isWordProblem) {
        askText = `Write a creative word problem where ${name1} has ${g1} groups, sets, or containers of ${selectedContextItem}, with exactly ${t1} items in each group. ${name2} has ${g2} groups of ${selectedContextItem}, with exactly ${t2} items in each group. Ask the student how many more ${selectedContextItem} ${name1} has than ${name2}.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: "Step 1", expectedAnswer: `${g1} x ${t1} = ${tot1}` },
              { label: "Step 2", expectedAnswer: `${g2} x ${t2} = ${tot2}` },
              { label: "Step 3 (Final Answer)", expectedAnswer: `${tot1} - ${tot2} = ${difference}` }
            ]
          });
        }
      } else {
        askText = localGetQText(
          `${name1} has ${g1} boxes of ${selectedContextItem} with ${t1} in each box. ${name2} has ${g2} boxes of ${selectedContextItem} with ${t2} in each box. How many more ${selectedContextItem} does ${name1} have than ${name2}?`,
          `${name1} has ${g1} boxes of ${t1}. ${name2} has ${g2} boxes of ${t2}. Difference in ${selectedContextItem}?`
        );
      }
    }
  }

  if (!questionStemConstraint) {
    questionStemConstraint = `- The question stem must clearly ask "${askText}".`;
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
      difficulty: 'advanced',
      steps: isStructure ? 2 : 1,
      maxNumber: 100,
      logicDescription: "2-step word problems, distributive property, balancing equations, and comparing products."
    }
  };
};
