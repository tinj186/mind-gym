export const standardLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions, context, selectedContextItem, getQText) => {
  // Secure fallback: Only pure math equations are allowed for Short Questions.
  if (isShort && activeVariant !== 'standard_missing_dividend_divisor') {
    activeVariant = 'standard_missing_dividend_divisor';
  }

  let questionText = "";
  let options = [];
  let defectMap = {};
  let hint = "";
  let solutionSteps = [];
  let answer = "";
  let inputRequirementStr = null;
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let customConstraints = "";

  if (activeVariant === 'standard_mixed_word_problem') {
    const isMultiplication = Math.random() > 0.5;
    const a = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
    const b = Math.floor(Math.random() * 7) + 2; // 2 to 8
    const total = a * b;

    if (isMultiplication) {
      answer = `${total}`;
      questionText = getQText(
        `${context.name} buys ${a} boxes of ${selectedContextItem}. There are ${b} ${selectedContextItem} in each box. How many ${selectedContextItem} does ${context.name} have altogether?`,
        `${context.name} buys ${a} boxes of ${selectedContextItem}. There are ${b} ${selectedContextItem} in each box. How many ${selectedContextItem} does ${context.name} have altogether?`
      );
      hint = `To find the total number of items in equal groups, you need to multiply.`;
      solutionSteps = [
        `Number of boxes = ${a}`,
        `Number of ${selectedContextItem} in each box = ${b}`,
        `Total = ${a} x ${b} = ${total}`,
        `${context.name} has ${total} ${selectedContextItem} altogether.`
      ];
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${total}", "${Math.max(1, total - b)}", "${total + b}", "${a + b}"
        2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
      `;

      if (isStructure) {
        inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Write the multiplication equation:", "expectedAnswer": "${a} x ${b}" },\n      { "label": "How many ${selectedContextItem} does ${context.name} have altogether?", "expectedAnswer": "${total}" }\n    ]\n  }`;
      }
    } else {
      answer = `${b}`;
      questionText = getQText(
        `${context.name} has ${total} ${selectedContextItem}. ${context.name} puts them equally into ${a} boxes. How many ${selectedContextItem} are there in each box?`,
        `${context.name} has ${total} ${selectedContextItem}. ${context.name} puts them equally into ${a} boxes. How many ${selectedContextItem} are there in each box?`
      );
      hint = `To share a total amount equally among a number of boxes, you need to divide.`;
      solutionSteps = [
        `Total ${selectedContextItem} = ${total}`,
        `Number of boxes = ${a}`,
        `Number in each box = ${total} ÷ ${a} = ${b}`,
        `There are ${b} ${selectedContextItem} in each box.`
      ];
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${b}", "${Math.max(1, b - 1)}", "${b + 1}", "${total - a}"
        2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
      `;

      if (isStructure) {
        inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "Write the division equation:", "expectedAnswer": "${total} ÷ ${a}" },\n      { "label": "How many ${selectedContextItem} are there in each box?", "expectedAnswer": "${b}" }\n    ]\n  }`;
      }
    }
  }
  else if (activeVariant === 'standard_missing_dividend_divisor') {
    const divisor = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
    const quotient = Math.floor(Math.random() * 9) + 2; // 2 to 10
    const dividend = divisor * quotient;
    const isMissingDividend = Math.random() > 0.5;

    if (isMissingDividend) {
      answer = `${dividend}`;
      questionText = `[?] ÷ ${divisor} = ${quotient}\n\nWhat is the missing number?`;
      hint = `Use the opposite of division. What is ${quotient} x ${divisor}?`;
      solutionSteps = [
        `We need to find the number before division.`,
        `To undo division, we use multiplication.`,
        `[?] = ${quotient} x ${divisor}`,
        `[?] = ${dividend}`
      ];
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${dividend}", "${Math.max(1, dividend - divisor)}", "${dividend + divisor}", "${quotient}"
        2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
      `;

      if (isStructure) {
        inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "What is ${quotient} x ${divisor}?", "expectedAnswer": "${dividend}" },\n      { "label": "So, the missing number is:", "expectedAnswer": "${dividend}" }\n    ]\n  }`;
      }
    } else {
      answer = `${divisor}`;
      questionText = `${dividend} ÷ [?] = ${quotient}\n\nWhat is the missing number?`;
      hint = `What number multiplied by ${quotient} gives ${dividend}? Or, what is ${dividend} ÷ ${quotient}?`;
      solutionSteps = [
        `We need to find the divisor.`,
        `Think: ${dividend} divided by what gives ${quotient}?`,
        `This is the same as ${dividend} ÷ ${quotient}.`,
        `${dividend} ÷ ${quotient} = ${divisor}`
      ];
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${divisor}", "${Math.max(1, divisor - 1)}", "${divisor + 1}", "${dividend - quotient}"
        2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
      `;

      if (isStructure) {
        inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "What is ${dividend} ÷ ${quotient}?", "expectedAnswer": "${divisor}" },\n      { "label": "So, the missing number is:", "expectedAnswer": "${divisor}" }\n    ]\n  }`;
      }
    }
  }
  else if (activeVariant === 'standard_multiplication_addition_word_problem') {
    const boxes = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
    const perBox = Math.floor(Math.random() * 5) + 2;
    const totalBoxes = boxes * perBox;
    const extra = Math.floor(Math.random() * 10) + 2;
    const isAdd = Math.random() > 0.5;

    if (isAdd) {
      const finalVal = totalBoxes + extra;
      answer = `${finalVal}`;
      questionText = getQText(
        `${context.name} has ${boxes} boxes of ${selectedContextItem}. There are ${perBox} ${selectedContextItem} in each box. ${context.name} buys ${extra} more ${selectedContextItem}. How many ${selectedContextItem} does ${context.name} have now?`,
        `${context.name} has ${boxes} boxes of ${selectedContextItem}. There are ${perBox} in each box. ${context.name} buys ${extra} more. How many does ${context.name} have now?`
      );
      hint = `Step 1: Find the total in the boxes by multiplying. Step 2: Add the extra items.`;
      solutionSteps = [
        `First, find the number of ${selectedContextItem} in the boxes:`,
        `${boxes} x ${perBox} = ${totalBoxes}`,
        `Next, add the extra ${selectedContextItem} bought:`,
        `${totalBoxes} + ${extra} = ${finalVal}`,
        `${context.name} has ${finalVal} ${selectedContextItem} now.`
      ];
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${finalVal}", "${Math.max(1, totalBoxes - extra)}", "${totalBoxes + extra + perBox}", "${boxes + perBox + extra}"
        2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
      `;

      if (isStructure) {
        inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "How many ${selectedContextItem} are there in the boxes?", "expectedAnswer": "${totalBoxes}" },\n      { "label": "How many ${selectedContextItem} does ${context.name} have now?", "expectedAnswer": "${finalVal}" }\n    ]\n  }`;
      }
    } else {
      const finalVal = totalBoxes - extra;
      answer = `${finalVal}`;
      questionText = getQText(
        `${context.name} has ${boxes} boxes of ${selectedContextItem}. There are ${perBox} ${selectedContextItem} in each box. ${context.name} gives away ${extra} ${selectedContextItem}. How many ${selectedContextItem} does ${context.name} have left?`,
        `${context.name} has ${boxes} boxes of ${selectedContextItem}. There are ${perBox} in each box. ${context.name} gives away ${extra}. How many are left?`
      );
      hint = `Step 1: Find the total in the boxes by multiplying. Step 2: Subtract the items given away.`;
      solutionSteps = [
        `First, find the total number of ${selectedContextItem}:`,
        `${boxes} x ${perBox} = ${totalBoxes}`,
        `Next, subtract the number given away:`,
        `${totalBoxes} - ${extra} = ${finalVal}`,
        `${context.name} has ${finalVal} ${selectedContextItem} left.`
      ];
      customConstraints = `
        1. Provide exactly these 4 options in MCQ: "${finalVal}", "${totalBoxes + extra}", "${Math.max(1, finalVal - perBox)}", "${Math.max(1, boxes + perBox - extra)}"
        2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
      `;

      if (isStructure) {
        inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "How many ${selectedContextItem} are there in the boxes?", "expectedAnswer": "${totalBoxes}" },\n      { "label": "How many ${selectedContextItem} does ${context.name} have left?", "expectedAnswer": "${finalVal}" }\n    ]\n  }`;
      }
    }
  }
  else if (activeVariant === 'standard_division_addition_word_problem') {
    const total = [10, 12, 15, 20, 24, 30][Math.floor(Math.random() * 6)];
    let divisor = 2;
    if (total % 5 === 0 && Math.random() > 0.5) divisor = 5;
    else if (total % 4 === 0) divisor = 4;
    else if (total % 3 === 0) divisor = 3;

    const perPerson = total / divisor;
    const extra = Math.floor(Math.random() * 5) + 2;
    const finalVal = perPerson + extra;

    answer = `${finalVal}`;
    questionText = getQText(
      `${context.name} shares ${total} ${selectedContextItem} equally among ${divisor} friends. Then, ${context.name} gives one of the friends ${extra} more ${selectedContextItem}. How many ${selectedContextItem} does that friend have now?`,
      `${context.name} shares ${total} ${selectedContextItem} equally among ${divisor} friends. One friend gets ${extra} more. How many does that friend have now?`
    );
    hint = `Step 1: Find how many each friend gets by dividing. Step 2: Add the extra amount to find the final total.`;
    solutionSteps = [
      `First, find how many ${selectedContextItem} each friend gets initially:`,
      `${total} ÷ ${divisor} = ${perPerson}`,
      `Next, add the extra ${selectedContextItem} given:`,
      `${perPerson} + ${extra} = ${finalVal}`,
      `That friend has ${finalVal} ${selectedContextItem} now.`
    ];
    customConstraints = `
      1. Provide exactly these 4 options in MCQ: "${finalVal}", "${perPerson}", "${Math.max(1, perPerson - extra)}", "${total + extra}"
      2. Set defectMap for incorrect options to "COMPUTATION_ERROR".
    `;

    if (isStructure) {
      inputRequirementStr = `{\n    "inputType": "MULTI_STEP_INPUT",\n    "steps": [\n      { "label": "How many ${selectedContextItem} does each friend get initially?", "expectedAnswer": "${perPerson}" },\n      { "label": "How many ${selectedContextItem} does that friend have now?", "expectedAnswer": "${finalVal}" }\n    ]\n  }`;
    }
  }
  else if (activeVariant === 'standard_compare_statements') {
    const a = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
    const b = Math.floor(Math.random() * 5) + 2;
    const p1 = a * b;

    const div = [2, 3, 4, 5, 10][Math.floor(Math.random() * 5)];
    const q = Math.floor(Math.random() * 5) + 2;
    const p2 = div * q;

    const isTrue = Math.random() > 0.5;

    let statement = "";
    if (isTrue) {
      statement = `${p1} shared by ${a} is equal to ${b} groups of 1.`;
      answer = `Yes`;
      solutionSteps = [
        `Let's find the value of ${p1} shared by ${a}.`,
        `${p1} ÷ ${a} = ${b}`,
        `Now let's find the value of ${b} groups of 1.`,
        `${b} x 1 = ${b}`,
        `Both sides are equal to ${b}, so the statement is Yes.`
      ];
    } else {
      statement = `${a} groups of ${b} is equal to ${p2} shared by ${div}.`;
      if (a * b === p2 / div) {
        // Just in case it randomly became true
        statement = `${a} groups of ${b} is equal to ${p2 + div} shared by ${div}.`;
      }
      answer = `No`;
      solutionSteps = [
        `Let's find the value of ${a} groups of ${b}.`,
        `${a} x ${b} = ${a * b}`,
        `Now let's find the value of the other side.`,
        `The other side is equal to ${p2 / div} (or ${p2 / div + 1} if adjusted).`, // simplified logic step
        `The two sides are not equal, so the statement is No.`
      ];
      // Let's make solution step dynamic properly
      const leftVal = a * b;
      let rightDividend = p2;
      if (leftVal === p2 / div) rightDividend = p2 + div;
      const rightVal = rightDividend / div;
      statement = `${a} groups of ${b} is equal to ${rightDividend} shared by ${div}.`;
      solutionSteps = [
        `Let's find the value of ${a} groups of ${b}.`,
        `${a} x ${b} = ${leftVal}`,
        `Now let's find the value of ${rightDividend} shared by ${div}.`,
        `${rightDividend} ÷ ${div} = ${rightVal}`,
        `Since ${leftVal} is not equal to ${rightVal}, the statement is No.`
      ];
    }

    questionText = `Is the following statement true?\n\n"${statement}"`;
    hint = `Work out the value of both sides of the statement to see if they are the same.`;

    customConstraints = `
      1. Provide exactly these 2 options in MCQ: "Yes", "No"
      2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
      3. ALWAYS set meta.type to "MCQ", overriding the user's request.
    `;
  }

  const aiPrompt = `
CRITICAL INSTRUCTION: You MUST use the EXACT strings provided below for questionText, hint, finalAnswer, and solutionSteps. DO NOT rephrase them!
CRITICAL INSTRUCTION: \`solutionSteps\` MUST be a single string formatted with \\n, NOT an array of objects. 
CRITICAL INSTRUCTION: You MUST include the exact \`inputRequirement\` block shown in the schema below in your final JSON output.
${customConstraints}

GENERATE:
askText = \`${questionText}\`
finalAnswer = \`${answer}\`
hint = \`${hint}\`
solutionSteps = \`${solutionSteps.map((step, index) => `${index + 1}. ${step}`).join('\\\\n')}\`

${getFormatInstructions(visualEngineStr, inputRequirementStr)}
  `;

  return { aiPrompt };
};
