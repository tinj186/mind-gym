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
  let questionStemConstraint = "";
  
  // Helper to ensure table selection between 2 and 9
  const table = Math.floor(Math.random() * 8) + 2; 

  if (activeVariant === 'foundation_direct_grouping') {
    const groups = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const total = groups * table;
    
    if (isStructure) {
      askText = `Write a creative word problem where ${context.name} has ${groups} groups, sets, or containers of ${selectedContextItem}, with exactly ${table} items in each group. Ask the student to identify the number of groups, the number of items in each group, and finally solve for the total number of items using a multiplication equation.`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1", expectedAnswer: `${groups} x ${table} = ${total}` },
          { label: "Step 2 (Final Answer)", expectedAnswer: String(total) }
        ]
      });
      answer = String(total);
    } else {
      askText = `Find the matching equation for ${groups} groups of ${table}.`;
      questionStemConstraint = `- The question stem must clearly ask exactly: "${askText}". DO NOT add any word problem context.`;
      answer = `${groups} x ${table}`;
      
      if (isMCQ) {
        const d1 = `${table} x ${groups}`; // reverse
        const d2 = `${groups} + ${table}`; // adding
        const d3 = `${groups} x ${table + 1}`; // off by one
        
        customConstraints = `
- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CONCEPTUAL_ERROR", and "${d3}" to "CARELESS_CALCULATION".`;
      }
    }
  }
  else if (activeVariant === 'foundation_missing_factor') {
    const factor = Math.floor(Math.random() * 8) + 2;
    const product = table * factor;
    const isMultiplication = Math.random() > 0.5;
    
    if (isStructure) {
      if (isMultiplication) {
        askText = `Write a creative word problem where ${context.name} has some groups of ${selectedContextItem}, with exactly ${table} in each group. The total number of items is ${product}. Ask the student to find the number of groups. DO NOT explicitly mention the answer ${factor} in the text.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
        
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1", expectedAnswer: `${product} ÷ ${table} = ${factor}` },
            { label: "Step 2", expectedAnswer: String(factor) },
            { label: "Step 3 (Equivalent Multiplication) (Final Answer)", expectedAnswer: `${factor} x ${table} = ${product}` }
          ]
        });
        answer = `${factor} x ${table} = ${product}`;
      } else {
        askText = `Write a creative word problem where ${context.name} has a total of ${product} ${selectedContextItem} and wants to share them equally into some groups so that each group has exactly ${table} items. Ask the student to find the number of groups needed. DO NOT explicitly mention the answer ${factor} in the text.`;
        questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
        
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Step 1", expectedAnswer: `${product} ÷ ${table} = ${factor}` },
            { label: "Step 2", expectedAnswer: String(factor) },
            { label: "Step 3 (Equivalent Multiplication) (Final Answer)", expectedAnswer: `${factor} x ${table} = ${product}` }
          ]
        });
        answer = `${factor} x ${table} = ${product}`;
      }
    } else {
      if (isMultiplication) {
        const isLeftMissing = Math.random() > 0.5;
        if (isLeftMissing) {
          askText = `Find the missing number: ___ x ${table} = ${product}`;
        } else {
          askText = `Find the missing number: ${table} x ___ = ${product}`;
        }
        answer = String(factor);
      } else {
        const isDivisorMissing = Math.random() > 0.5;
        if (isDivisorMissing) {
          askText = `Find the missing number: ${product} ÷ ___ = ${table}`;
          answer = String(factor);
        } else {
          askText = `Find the missing number: ${product} ÷ ${factor} = ___`;
          answer = String(table);
        }
      }
      
      questionStemConstraint = `- The question stem must clearly state exactly: "${askText}". DO NOT add any word problem context or extra sentences.`;
      customConstraints = `- isNotationVariant: true. You are generating a pure notation question. Do NOT hallucinate a word problem.`;
      
      if (isMCQ) {
        const d1 = String(factor + 1);
        const d2 = String(factor > 1 ? factor - 1 : factor + 2);
        const d3 = String(table);
        customConstraints += `
- The correct option must exactly be "${answer}".
- The wrong options must include: "${d1}", "${d2}", and "${d3}".`;
      }
    }
  }
  else if (activeVariant === 'foundation_basic_sharing') {
    const people = Math.floor(Math.random() * 8) + 2;
    const itemsPerPerson = Math.floor(Math.random() * 8) + 2;
    const totalItems = people * itemsPerPerson;
    
    if (isStructure) {
      askText = `Write a creative word problem where ${context.name} wants to share a total of ${totalItems} ${selectedContextItem} equally among ${people} people, groups, or containers. Ask the student to identify the total number of items, the number of groups, and the division equation to find how many items go into each group.`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1", expectedAnswer: `${totalItems} ÷ ${people} = ${itemsPerPerson}` },
          { label: "Step 2 (Final Answer)", expectedAnswer: String(itemsPerPerson) }
        ]
      });
      answer = String(itemsPerPerson);
    } else {
      askText = `Share ${totalItems} ${selectedContextItem} equally among ${people} people. How many ${selectedContextItem} does each person get?`;
      questionStemConstraint = `- The question stem must clearly ask: "${askText}".`;
      
      answer = String(itemsPerPerson);
      
      if (isMCQ) {
        const d1 = String(totalItems - people); // subtraction
        const d2 = String(totalItems + people); // addition
        const d3 = String(itemsPerPerson + 1); // off by one
        
        customConstraints = `
- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d2}" to "CONCEPTUAL_ERROR", and "${d3}" to "CARELESS_CALCULATION".`;
      }
    }
  }
  else if (activeVariant === 'foundation_array_model') {
    const rows = Math.floor(Math.random() * 8) + 2;
    const cols = Math.floor(Math.random() * 8) + 2;
    const total = rows * cols;
    
    if (isStructure) {
      askText = `Write a creative word problem where ${context.name} arranged some ${selectedContextItem} in exactly ${rows} rows and ${cols} columns (like an array or grid). Ask the student to find the total number of items using a multiplication equation.`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1", expectedAnswer: `${rows} x ${cols} = ${total}` },
          { label: "Step 2 (Final Answer)", expectedAnswer: String(total) }
        ]
      });
      answer = String(total);
    } else {
      askText = `${context.name} arranged some ${selectedContextItem} in ${rows} rows and ${cols} columns. How many ${selectedContextItem} are there in total?`;
      questionStemConstraint = `- The question stem must clearly ask: "${askText}".`;
      answer = String(total);
      
      inputRequirementStr = JSON.stringify({
        inputType: "SINGLE_STEP_INPUT"
      });
      
      if (isMCQ) {
        const d1 = String(rows + cols);
        const d2 = String(total + rows);
        const d3 = String(total - cols);
        customConstraints = `
- The correct option must exactly be "${answer}".
- The wrong options must include: "${d1}", "${d2}", and "${d3}".`;
      }
    }
  }
  else if (activeVariant === 'foundation_equation_equivalence') {
    let a = Math.floor(Math.random() * 8) + 2;
    let b = Math.floor(Math.random() * 8) + 2;
    // ensure a and b are not equal so b x a is distinct
    while (a === b) {
      b = Math.floor(Math.random() * 8) + 2;
    }
    
    if (isStructure) {
      const isMultiplicationEquiv = Math.random() > 0.5;
      const total = a * b;
      
      askText = `Write a creative word problem where ${context.name} has ${a} groups of ${b} ${selectedContextItem}. Ask the student to write the initial multiplication equation to find the total, and then write an equivalent ${isMultiplicationEquiv ? 'multiplication equation using the commutative property (swapping the numbers)' : 'division equation that shows the same relationship'}.`;
      questionStemConstraint = `- The question stem must be a creative word problem following these instructions: ${askText}`;
      
      const step2Answer = isMultiplicationEquiv ? `${b} x ${a} = ${total}` : `${total} ÷ ${a} = ${b}`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1 (Initial Equation)", expectedAnswer: `${a} x ${b} = ${total}` },
          { label: "Step 2 (Equivalent Equation)", expectedAnswer: step2Answer }
        ]
      });
      answer = step2Answer;
    } else {
      if (isMCQ) {
        askText = `Which of these gives the same answer as ${a} x ${b}?`;
      } else {
        askText = `Write an equivalent multiplication equation for ${a} x ${b} using the same numbers.`;
      }
      questionStemConstraint = `- The question stem must clearly ask exactly: "${askText}". DO NOT add any word problem context.`;
      
      answer = `${b} x ${a}`;
      
      if (isMCQ) {
        const d1 = `${a} + ${b}`;
        const d2 = `${a} x ${b + 1}`;
        const d3 = `${b} + ${a}`;
        
        customConstraints = `
- The correct option must exactly be "${answer}".
- The wrong options must exactly include: "${d1}", "${d2}", and "${d3}".
- DefectMap must map "${d1}" to "CONCEPTUAL_ERROR", "${d3}" to "CONCEPTUAL_ERROR", and "${d2}" to "CARELESS_CALCULATION".`;
      }
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
