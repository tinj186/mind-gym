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
  let hint = "";
  let solutionSteps = [];

  if (activeVariant === 'foundation_visual_missing_numerator') {
    const num = Math.floor(Math.random() * 2) + 1; // 1 to 2
    const denom = num + Math.floor(Math.random() * 3) + 1; // num < denom
    const mult = Math.floor(Math.random() * 2) + 2; // 2 or 3
    const newDenom = denom * mult;
    const newNum = num * mult;
    
    answer = `${newNum}/${newDenom}`;

    if (isStructure) {
      askText = `Write a word problem where ${context.name} consumes ${num}/${denom} of a ${selectedContextItem}. A friend has a ${selectedContextItem} of the exact same size, but cut into ${newDenom} pieces. Ask what fraction of the ${selectedContextItem} the friend must consume to have the exact same amount.`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1", expectedAnswer: `${newDenom}/${denom}=${mult}` },
          { label: "Step 2", expectedAnswer: `${num}x${mult}=${newNum}` },
          { label: "Equivalent fraction", expectedAnswer: `${newNum}/${newDenom}` }
        ]
      });
    } else {
      askText = getQText(
      `Write a word problem where ${context.name} eats/uses ${num}/${denom} of a ${selectedContextItem}. A friend has a ${selectedContextItem} of the exact same size, but cut into ${newDenom} pieces. Ask what fraction of the ${selectedContextItem} the friend must eat/use to have the exact same amount.`,
      `Find the equivalent fraction: ${num}/${denom} = [ ]/${newDenom}.`
    );
    }
    
    if (isShort) {
       customConstraints = `
       - For isNotationVariant, the finalAnswer should just be the missing number, e.g. "${newNum}".
       `;
    }

    hint = `Multiply both the numerator and denominator by ${mult}.`;
    solutionSteps = [
      `Since ${denom} x ${mult} = ${newDenom}`,
      `Multiply the numerator by ${mult}: ${num} x ${mult} = ${newNum}`,
      `The equivalent fraction is ${newNum}/${newDenom}.`
    ];
    
    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_MODEL",
      componentData: {
        models: [
          {
            modelType: "PART_WHOLE",
            parts: [{ value: "", segments: num, layoutSize: num }, { value: "", segments: denom - num, layoutSize: denom - num }],
            whole: String(denom),
            barLabel: context.name,
            isStatic: true
          },
          {
            modelType: "PART_WHOLE",
            parts: [{ value: "", segments: newNum, layoutSize: newNum }, { value: "", segments: newDenom - newNum, layoutSize: newDenom - newNum }],
            whole: String(newDenom),
            barLabel: "Friend",
            isStatic: true
          }
        ]
      }
    });
    
    customConstraints += `
    1. Provide exactly these 4 options in MCQ: "${newNum}/${newDenom}", "${newNum + 1}/${newDenom}", "${Math.max(1, newNum - 1)}/${newDenom}", "${num + mult}/${newDenom}"
    2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
    3. The questionText MUST explicitly contain the base fraction using the / symbol (e.g., ${num}/${denom}). Do not spell out the fraction entirely in words, and do not reduce it to a simple ratio problem.
    `;
  }
  else if (activeVariant === 'foundation_visual_missing_denominator') {
    const num = Math.floor(Math.random() * 2) + 1; // 1 to 2
    const denom = num + Math.floor(Math.random() * 3) + 1; 
    const mult = Math.floor(Math.random() * 2) + 2; // 2 or 3
    const newDenom = denom * mult;
    const newNum = num * mult;
    
    answer = `${newNum}/${newDenom}`;

    if (isStructure) {
      askText = `Write a word problem where ${context.name} consumes ${newNum} pieces of a ${selectedContextItem}. A friend consumes ${num}/${denom} of a ${selectedContextItem} of the exact same size. If they both consumed the exact same amount, ask what fraction of the ${selectedContextItem} ${context.name} consumed.`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1", expectedAnswer: `${newNum}/${num}=${mult}` },
          { label: "Step 2", expectedAnswer: `${denom}x${mult}=${newDenom}` },
          { label: "Equivalent fraction", expectedAnswer: `${newNum}/${newDenom}` }
        ]
      });
    } else {
      askText = getQText(
      `Write a word problem where ${context.name} eats/uses ${newNum} pieces of a ${selectedContextItem}. A friend eats/uses ${num}/${denom} of a ${selectedContextItem} of the exact same size. If they both ate/used the exact same amount, ask what fraction of the ${selectedContextItem} ${context.name} ate/used.`,
      `Find the equivalent fraction: ${num}/${denom} = ${newNum}/[ ].`
    );
    }

    hint = `Since the numerator was multiplied by ${mult}, multiply the denominator by ${mult} too.`;
    solutionSteps = [
      `Since ${num} x ${mult} = ${newNum}`,
      `Multiply the denominator by ${mult}: ${denom} x ${mult} = ${newDenom}`,
      `The missing denominator is ${newDenom}.`
    ];
    
      visualEngineStr = JSON.stringify({
      componentToRender: "BAR_MODEL",
      componentData: {
        models: [
          {
            modelType: "PART_WHOLE",
            parts: [{ value: "", segments: num, layoutSize: num }, { value: "", segments: denom - num, layoutSize: denom - num }],
            whole: String(denom),
            barLabel: "Friend",
            isStatic: true
          },
          {
            modelType: "PART_WHOLE",
            parts: [{ value: "", segments: newNum, layoutSize: newNum }, { value: "", segments: newDenom - newNum, layoutSize: newDenom - newNum }],
            whole: String(newDenom),
            barLabel: context.name,
            isStatic: true
          }
        ]
      }
    });
    
    customConstraints += `
    1. Provide exactly these 4 options in MCQ: "${newNum}/${newDenom}", "${newNum}/${newDenom + mult}", "${newNum}/${denom + newNum}", "${newNum}/${newDenom - 1}"
    2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
    3. The questionText MUST explicitly contain the base fraction using the / symbol (e.g., ${num}/${denom}). Do not spell out the fraction entirely in words, and do not reduce it to a simple ratio problem.
    `;
  }
  else if (activeVariant === 'foundation_times_2_rule') {
    const num = Math.floor(Math.random() * 3) + 1;
    const denom = num + Math.floor(Math.random() * 3) + 1;
    const newNum = num * 2;
    const newDenom = denom * 2;
    
    answer = `${newNum}/${newDenom}`;

    if (isStructure) {
      askText = `Write a word problem where ${context.name} uses ${num}/${denom} of a ${selectedContextItem}. A friend has a ${selectedContextItem} of the exact same size, but cut into twice as many pieces and uses twice as many pieces. Ask what fraction of the ${selectedContextItem} the friend used.`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1", expectedAnswer: `${num}x2=${newNum}` },
          { label: "Step 2", expectedAnswer: `${denom}x2=${newDenom}` },
          { label: "Equivalent fraction", expectedAnswer: `${newNum}/${newDenom}` }
        ]
      });
    } else {
      askText = getQText(
        `${context.name} has a chocolate bar with ${denom} blocks, and eats ${num}. A friend has a chocolate bar with twice as many blocks, and eats twice as many pieces. What fraction of the chocolate bar did the friend eat?`,
        `Multiply the top and bottom of ${num}/${denom} by 2 to find an equivalent fraction.`
      );
    }

    hint = `Multiply the numerator by 2, and the denominator by 2.`;
    solutionSteps = [
      `${num} x 2 = ${newNum}`,
      `${denom} x 2 = ${newDenom}`,
      `The equivalent fraction is ${newNum}/${newDenom}.`
    ];
    
    customConstraints = `
    1. Provide exactly these 4 options in MCQ: "${newNum}/${newDenom}", "${num}/${newDenom}", "${newNum}/${denom}", "${num+2}/${denom+2}"
    2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
    `;
  }
  else if (activeVariant === 'foundation_times_3_rule') {
    const num = Math.floor(Math.random() * 3) + 1;
    const denom = num + Math.floor(Math.random() * 3) + 1;
    const newNum = num * 3;
    const newDenom = denom * 3;
    
    answer = `${newNum}/${newDenom}`; // Short text actually asked for missing num but let's provide fraction

    if (isStructure) {
      askText = `Write a word problem where ${context.name} uses ${num}/${denom} of a ${selectedContextItem}. A friend has a ${selectedContextItem} of the exact same size, but cut into 3 times as many pieces, and uses 3 times as many pieces. Ask what fraction of the ${selectedContextItem} the friend used.`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Step 1", expectedAnswer: `${num}x3=${newNum}` },
          { label: "Step 2", expectedAnswer: `${denom}x3=${newDenom}` },
          { label: "Equivalent fraction", expectedAnswer: `${newNum}/${newDenom}` }
        ]
      });
    } else {
      askText = getQText(
      `Write a word problem where ${context.name} uses ${num}/${denom} of a ${selectedContextItem}. A friend has a ${selectedContextItem} of the exact same size, but cut into 3 times as many pieces, and uses 3 times as many pieces. Ask what fraction of the ${selectedContextItem} the friend used.`,
      `Write a short question asking for the fraction equivalent to ${num}/${denom} when both numbers are multiplied by 3.`
    );
      if (isShort && !isStructure) {
         answer = String(newNum);
      }
    }

    hint = `Since the denominator is multiplied by 3 (${denom} x 3 = ${newDenom}), multiply the numerator by 3 as well.`;
    solutionSteps = [
      `Since ${denom} x 3 = ${newDenom}`,
      `Multiply the numerator by 3: ${num} x 3 = ${newNum}`,
      `The equivalent fraction is ${newNum}/${newDenom}.`
    ];
    
    customConstraints = `
    1. Provide exactly these 4 options in MCQ: "${newNum}/${newDenom}", "${newNum-1}/${newDenom}", "${newNum+1}/${newDenom}", "${num+3}/${newDenom}"
    2. If MCQ and isShort is true, the options should be just the numbers: "${newNum}", "${newNum-1}", "${newNum+1}", "${num+3}".
    3. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
    `;
  }
  else if (activeVariant === 'foundation_identifying_match') {
    const num = Math.floor(Math.random() * 3) + 1; 
    const denom = num + Math.floor(Math.random() * 3) + 1; 
    
    const numX2 = num * 2;
    const denomX2 = denom * 2;
    const numX3 = num * 3;
    const denomX3 = denom * 3;

    const useX3 = Math.random() < 0.5;
    const correctNum = useX3 ? numX3 : numX2;
    const correctDenom = useX3 ? denomX3 : denomX2;

    const fake1Num = correctNum + 1;
    const fake1Denom = correctDenom;
    const fake2Num = correctNum;
    const fake2Denom = correctDenom + 1;

    const options = [
      { f: `${correctNum}/${correctDenom}`, isCorrect: true },
      { f: `${fake1Num}/${fake1Denom}`, isCorrect: false },
      { f: `${fake2Num}/${fake2Denom}`, isCorrect: false }
    ].sort(() => Math.random() - 0.5);

    answer = `${correctNum}/${correctDenom}`;

    if (isStructure) {
      askText = `Write a word problem where ${context.name} eats ${num}/${denom} of a ${selectedContextItem}. You MUST explicitly list the following three fractions inside the question text: ${options[0].f}, ${options[1].f}, and ${options[2].f}. Ask which of these fractions shows the exact same proportion of the ${selectedContextItem} eaten.`;
      
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: "Multiply by 2", expectedAnswer: `${numX2}/${denomX2}` },
          { label: "Multiply by 3", expectedAnswer: `${numX3}/${denomX3}` },
          { label: "Which option matches?", expectedAnswer: answer }
        ]
      });
    } else {
      askText = getQText(
      `Write a word problem where ${context.name} reads ${num}/${denom} of a book. You MUST explicitly list the following three fractions inside the question text: ${options[0].f}, ${options[1].f}, and ${options[2].f}. Ask which of these fractions shows the exact same proportion of the book read.`,
      `Which of these fractions is equivalent to ${num}/${denom}: ${options[0].f}, ${options[1].f}, or ${options[2].f}?`
    );
    }

    hint = `Find the equivalent fractions by multiplying ${num}/${denom} by 2 and by 3, then see which one matches the options.`;
    solutionSteps = [
      `${num}/${denom} x 2 = ${numX2}/${denomX2}`,
      `${num}/${denom} x 3 = ${numX3}/${denomX3}`,
      `So, ${answer} is the equivalent fraction.`
    ];
    
    customConstraints = `
    1. Provide exactly these 4 options in MCQ: "${correctNum}/${correctDenom}", "${fake1Num}/${fake1Denom}", "${fake2Num}/${fake2Denom}", "${correctNum + 1}/${correctDenom + 1}"
    2. Set defectMap for incorrect options to "CONCEPTUAL_ERROR".
    3. The questionText MUST explicitly contain the three fractions: ${options[0].f}, ${options[1].f}, and ${options[2].f} inside the story.
    `;
  }
  else {
    throw new Error("Variant logic not implemented: " + activeVariant);
  }

  const questionStemConstraint = `- The questionText must be generated based on this prompt: "${askText}". Ensure the story uses proper English sentences, is creative, and makes mathematical sense.`;

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

  return { aiPrompt };
};
