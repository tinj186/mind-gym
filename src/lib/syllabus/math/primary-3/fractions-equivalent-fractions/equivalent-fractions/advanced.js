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
  let hint = "";
  let solutionSteps = [];

  const getGCD = (a, b) => b === 0 ? a : getGCD(b, a % b);

  if (activeVariant === 'advanced_remaining_simplify') {
    let num, denom;
    do {
      num = Math.floor(Math.random() * 4) + 1;
      denom = num + Math.floor(Math.random() * 4) + 1;
    } while (getGCD(num, denom) !== 1);

    const mult = Math.floor(Math.random() * 2) + 2; 
    const totalParts = denom * mult;
    const remainingParts = num * mult;
    const usedParts = totalParts - remainingParts;
    
    answer = `${num}/${denom}`;

    visualEngineStr = JSON.stringify({
      componentToRender: "FRACTION_EQUIVALENCE",
      componentData: {
        before: { num: "?", denom: totalParts },
        after: { num: "?", denom: "?" },
        operator: "÷",
        factor: "?"
      }
    });

    if (isStructure) {
      askText = `Write a word problem where ${context.name} has a ${selectedContextItem} cut into ${totalParts} equal pieces, and they eat ${usedParts} pieces. Ask what fraction of the ${selectedContextItem} is left over, expressed in its simplest form.`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1", expectedAnswer: `${totalParts}-${usedParts}=${remainingParts}` },
          { label: "Step 2", expectedAnswer: `${remainingParts}/${totalParts}` },
          { label: "Simplest Form", expectedAnswer: answer }
        ]
      });
    } else {
      askText = getQText(
        `Write a word problem where ${context.name} has a ${selectedContextItem} cut into ${totalParts} pieces, and eats ${usedParts} pieces. Ask what fraction is left in its simplest form.`,
        `A whole is cut into ${totalParts} pieces and ${usedParts} are removed. What fraction is left? Write in simplest form.`
      );
    }

    hint = `First, subtract to find the number of pieces left over. Then, write it as a fraction out of ${totalParts} and simplify.`;
    solutionSteps = [
      `Total pieces = ${totalParts}, Used pieces = ${usedParts}`,
      `Leftover pieces = ${totalParts} - ${usedParts} = ${remainingParts}`,
      `Leftover fraction = ${remainingParts}/${totalParts}`,
      `Simplify ${remainingParts}/${totalParts} by dividing numerator and denominator by ${mult}.`,
      `The simplest form is ${answer}.`
    ];
    
    customConstraints = `
    1. Provide exactly these 4 options in MCQ: "${answer}", "${remainingParts}/${totalParts}", "${num+1}/${denom}", "${usedParts}/${totalParts}"
    2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
    `;
  }
  else if (activeVariant === 'advanced_equivalence_chain') {
    let num, denom;
    do {
      num = Math.floor(Math.random() * 3) + 1;
      denom = num + Math.floor(Math.random() * 3) + 1;
    } while (getGCD(num, denom) !== 1);

    const mult1 = 2;
    const mult2 = 3;
    
    const isNumMissingFirst = Math.random() > 0.5;
    
    let a, b, eq1, eq2, eq3;
    
    if (isNumMissingFirst) {
      a = num * mult1;
      b = denom * mult2;
      eq1 = `${num}/${denom}`;
      eq2 = `A/${denom * mult1}`;
      eq3 = `${num * mult2}/B`;
    } else {
      a = denom * mult1;
      b = num * mult2;
      eq1 = `${num}/${denom}`;
      eq2 = `${num * mult1}/A`;
      eq3 = `B/${denom * mult2}`;
    }

    answer = `A=${a}, B=${b}`;

    visualEngineStr = JSON.stringify({
      componentToRender: "NUMBER_CARDS",
      componentData: {
        items: [
          { type: 'fraction', num: num, denom: denom },
          { type: 'fraction', num: isNumMissingFirst ? 'A' : num * mult1, denom: isNumMissingFirst ? denom * mult1 : 'A' },
          { type: 'fraction', num: isNumMissingFirst ? num * mult2 : 'B', denom: isNumMissingFirst ? 'B' : denom * mult2 }
        ]
      }
    });

    if (isStructure) {
      askText = `Write a word problem where three friends have identical ${selectedContextItem}s. The first eats ${eq1}. The second eats ${eq2} to match the first. The third eats ${eq3} to match them both. Ask to find the values of A and B.`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1", expectedAnswer: isNumMissingFirst ? `${num}x${mult1}=${a}` : `${denom}x${mult1}=${a}` },
          { label: "Step 2", expectedAnswer: isNumMissingFirst ? `${denom}x${mult2}=${b}` : `${num}x${mult2}=${b}` },
          { label: "Values of A and B", expectedAnswer: `A=${a}, B=${b}` }
        ]
      });
    } else {
      askText = getQText(
        `Write a word problem where three friends eat ${eq1}, ${eq2}, and ${eq3} of identical ${selectedContextItem}s, and all ate the same amount. Ask to find A and B.`,
        `If ${eq1} = ${eq2} = ${eq3}, what are the values of A and B?`
      );
    }

    hint = `Solve for A by finding the equivalent fraction to ${eq1}. Then solve for B by finding another equivalent fraction to ${eq1}.`;
    
    if (isNumMissingFirst) {
      solutionSteps = [
        `Since ${eq1} = ${eq2}: The denominator was multiplied by ${mult1}, so A = ${num} x ${mult1} = ${a}`,
        `Since ${eq1} = ${eq3}: The numerator was multiplied by ${mult2}, so B = ${denom} x ${mult2} = ${b}`,
        `Therefore, A=${a} and B=${b}.`
      ];
    } else {
      solutionSteps = [
        `Since ${eq1} = ${eq2}: The numerator was multiplied by ${mult1}, so A = ${denom} x ${mult1} = ${a}`,
        `Since ${eq1} = ${eq3}: The denominator was multiplied by ${mult2}, so B = ${num} x ${mult2} = ${b}`,
        `Therefore, A=${a} and B=${b}.`
      ];
    }
    
    customConstraints = `
    1. Provide exactly these 4 options in MCQ: "${answer}", "A=${a-1}, B=${b+1}", "A=${a}, B=${b-2}", "A=${b}, B=${a}"
    2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
    3. If type is SHORT_QUESTION, output pure notation as requested.
    - isNotationVariant: true (for Short Question only)
    `;
  }
  else if (activeVariant === 'advanced_who_is_correct') {
    let num, denom;
    do {
      num = Math.floor(Math.random() * 3) + 1;
      denom = num + Math.floor(Math.random() * 3) + 1;
    } while (getGCD(num, denom) !== 1);

    const mult = Math.floor(Math.random() * 2) + 2; 
    
    const isEquivalent = Math.random() > 0.5;
    
    const frac1Num = num;
    const frac1Denom = denom;
    const frac2Num = isEquivalent ? num * mult : (num * mult) - 1;
    const frac2Denom = denom * mult;

    const name2 = "Ben"; 
    
    answer = isEquivalent ? "They are equal" : "No";

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_MODEL",
      componentData: {
        models: [
          {
            modelType: 'PART_WHOLE',
            barLabel: context.name,
            whole: "?",
            isStatic: true,
            parts: [
              { layoutSize: frac1Num, segments: frac1Num, value: "" },
              { layoutSize: frac1Denom - frac1Num, segments: frac1Denom - frac1Num, value: "" }
            ]
          },
          {
            modelType: 'PART_WHOLE',
            barLabel: name2,
            whole: "?",
            isStatic: true,
            parts: [
              { layoutSize: frac2Num, segments: frac2Num, value: "" },
              { layoutSize: frac2Denom - frac2Num, segments: frac2Denom - frac2Num, value: "" }
            ]
          }
        ]
      }
    });

    if (isStructure) {
      askText = `Write a word problem where ${context.name} painted ${frac1Num}/${frac1Denom} of a wall, and ${name2} painted ${frac2Num}/${frac2Denom} of an identical wall. ${context.name} says ${isEquivalent ? "they painted the same amount" : "they painted more"}. Ask if ${context.name} is correct and to prove it.`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: `Equivalent fraction for ${frac1Num}/${frac1Denom}`, expectedAnswer: `${num*mult}/${denom*mult}` },
          { label: `Is ${context.name} correct? (Yes/No)`, expectedAnswer: isEquivalent ? "Yes" : "Yes" }
        ]
      });
      answer = "Yes";
    } else {
      askText = getQText(
        `Write a word problem where ${context.name} eats ${frac1Num}/${frac1Denom} of a ${selectedContextItem}, and ${name2} eats ${frac2Num}/${frac2Denom}. ${context.name} claims ${isEquivalent ? "they ate the same" : "they ate more"}. Are they correct? Answer Yes or No.`,
        `${context.name} has ${frac1Num}/${frac1Denom}. ${name2} has ${frac2Num}/${frac2Denom}. ${context.name} says ${isEquivalent ? "they are equal" : "theirs is bigger"}. Are they correct? Answer Yes or No.`
      );
      answer = "Yes";
    }

    hint = `Change ${frac1Num}/${frac1Denom} into an equivalent fraction with a denominator of ${frac2Denom} to compare them easily.`;
    solutionSteps = [
      `Convert ${frac1Num}/${frac1Denom} to have a denominator of ${frac2Denom}.`,
      `${frac1Num} x ${mult} = ${num*mult} and ${frac1Denom} x ${mult} = ${denom*mult}`,
      `${frac1Num}/${frac1Denom} is equal to ${num*mult}/${frac2Denom}.`,
      isEquivalent ? `Since ${num*mult}/${frac2Denom} is exactly equal to ${frac2Num}/${frac2Denom}, they are the same.` : `Since ${num*mult}/${frac2Denom} is larger than ${frac2Num}/${frac2Denom}, ${context.name} painted more.`,
      `Therefore, ${context.name} is correct. (Yes)`
    ];
    
    customConstraints = `
    1. Provide exactly these 4 options in MCQ: "Yes, they are equal", "No, ${name2} painted more", "No, ${context.name} painted less", "No, they are different"
    2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
    3. For Short Answer and Structured, the finalAnswer MUST be exactly "Yes" or "No".
    `;
    
    if (isMCQ) answer = isEquivalent ? "Yes, they are equal" : `Yes, ${context.name} painted more`;
  }
  else if (activeVariant === 'advanced_reverse_simplest') {
    let num, denom;
    do {
      num = Math.floor(Math.random() * 3) + 1;
      denom = num + Math.floor(Math.random() * 3) + 1;
    } while (getGCD(num, denom) !== 1);

    const mult = Math.floor(Math.random() * 3) + 3; // 3, 4, 5
    const originalDenom = denom * mult;
    const originalNum = num * mult;
    
    answer = String(originalNum);

    if (isStructure) {
      askText = `Write a word problem where ${context.name} simplified a fraction describing his test score and got ${num}/${denom}. If there were exactly ${originalDenom} questions on the test in total, ask how many questions he answered correctly.`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1", expectedAnswer: `${originalDenom}÷${denom}=${mult}` },
          { label: "Step 2", expectedAnswer: `${num}x${mult}=${originalNum}` },
          { label: "Original Numerator", expectedAnswer: answer }
        ]
      });
    } else {
      askText = getQText(
        `Write a word problem where ${context.name} simplifies a fraction to ${num}/${denom}. The original denominator was ${originalDenom}. Ask for the original numerator.`,
        `A fraction simplifies to ${num}/${denom}. Its original denominator was ${originalDenom}. What was the numerator?`
      );
    }

    hint = `Set ${num}/${denom} equal to an unknown number over ${originalDenom}. Find what the denominator was multiplied by.`;
    solutionSteps = [
      `Let the original fraction be ? / ${originalDenom}`,
      `Since ${denom} x ${mult} = ${originalDenom}, the multiplier is ${mult}.`,
      `Multiply the simplified numerator by ${mult}: ${num} x ${mult} = ${originalNum}.`,
      `The original numerator was ${originalNum}.`
    ];
    
    customConstraints = `
    1. Provide exactly these 4 options in MCQ: "${answer}", "${originalNum-1}", "${originalNum+1}", "${num}"
    2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
    `;
  }
  else if (activeVariant === 'advanced_find_total_parts') {
    const num = Math.floor(Math.random() * 2) + 2; // 2 or 3
    const denom = num + Math.floor(Math.random() * 3) + 1; 
    const unitValue = Math.floor(Math.random() * 3) + 2; // 2, 3, 4
    const qty = num * unitValue;
    const totalQty = denom * unitValue;
    
    answer = String(totalQty);

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_MODEL",
      componentData: {
        models: [
          {
            modelType: 'PART_WHOLE',
            whole: "?",
            isStatic: true,
            parts: [
              { layoutSize: num, segments: num, value: String(qty) },
              { layoutSize: denom - num, segments: denom - num, value: "" }
            ]
          }
        ]
      }
    });

    if (isStructure) {
      askText = `Write a word problem where ${context.name} gave away ${qty} ${selectedContextItem}s. This was exactly ${num}/${denom} of their entire collection. Ask how many ${selectedContextItem}s they had in their collection at first.`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Find 1 unit", expectedAnswer: `${qty}÷${num}=${unitValue}` },
          { label: `Find total units (${denom})`, expectedAnswer: `${denom}x${unitValue}=${totalQty}` },
          { label: "Total items", expectedAnswer: answer }
        ]
      });
    } else {
      askText = getQText(
        `Write a word problem where ${qty} ${selectedContextItem}s is exactly ${num}/${denom} of a box. Ask how many ${selectedContextItem}s are in the full box.`,
        `${qty} items represent ${num}/${denom} of a group. How many items are in the whole group?`
      );
    }

    hint = `If ${num} units equal ${qty}, find what 1 unit equals first. Then find the total for ${denom} units.`;
    solutionSteps = [
      `${num} units = ${qty}`,
      `1 unit = ${qty} ÷ ${num} = ${unitValue}`,
      `Total items (${denom} units) = ${denom} x ${unitValue} = ${totalQty}`,
      `There are ${totalQty} items in total.`
    ];
    
    customConstraints = `
    1. Provide exactly these 4 options in MCQ: "${answer}", "${unitValue}", "${totalQty-unitValue}", "${totalQty+unitValue}"
    2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
    `;
  }
  else {
    throw new Error("Variant logic not implemented: " + activeVariant);
  }

  let questionStemConstraint = "";
  if (askText.includes("Write a word problem")) {
    questionStemConstraint = `- The questionText must be generated based on this prompt: "${askText}". Ensure the story uses proper English sentences, is creative, and makes mathematical sense.`;
  } else {
    questionStemConstraint = `- The questionText MUST be EXACTLY this mathematical instruction: "${askText}". Do NOT generate a word problem or story.`;
  }

  const aiPrompt = `
CRITICAL INSTRUCTION: You MUST use the EXACT strings provided below for hint, finalAnswer, and solutionSteps. DO NOT rephrase them!
CRITICAL INSTRUCTION: \`solutionSteps\` MUST be a single string formatted with \\n, NOT an array of objects. 
CRITICAL INSTRUCTION: You MUST include the exact \`inputRequirement\` block shown in the schema below in your final JSON output.
${customConstraints}

${questionStemConstraint}

GENERATE:
finalAnswer = \`${answer}\`
hint = \`${hint}\`
solutionSteps = \`${solutionSteps.map((step, index) => `${index + 1}. ${step}`).join('\\n')}\`

${getFormatInstructions(visualEngineStr, inputRequirementStr)}
`;

  return {
    aiPrompt,
    visualEngineStr,
    inputRequirementStr
  };
};
