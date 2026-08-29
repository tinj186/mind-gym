import { getRandomNames, getRandomDivisibleObjects } from '@/lib/utils/variable-bank';

const getArticle = (word) => /^[aeiou]/i.test(word) ? 'an' : 'a';

export const foundationLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
  const names = getRandomNames(3);
  const getUniqueOptions = (ans, dists) => Array.from(new Set([ans, ...dists])).slice(0, 4).sort(() => 0.5 - Math.random());
  let askText, answer, mcqOptions, solutionSteps, hint;
  let visualEngineStr = `{"componentToRender": "NONE", "componentData": {"hideVisual": true}}`;
  let inputRequirementStr = null;

  const contextItem = getRandomDivisibleObjects(1)[0];

  const getRelatedFractions = (forceAddition = null) => {
    let validPair = null;
    while (!validPair) {
      const isAddition = forceAddition !== null ? forceAddition : Math.random() > 0.5;
      const baseDOptions = [2, 3, 4, 5, 6];
      const baseD = baseDOptions[Math.floor(Math.random() * baseDOptions.length)];
      const maxMult = Math.floor(12 / baseD);
      if (maxMult < 2) continue;

      const mults = Array.from({length: maxMult - 1}, (_, i) => i + 2);
      const mult = mults[Math.floor(Math.random() * mults.length)];
      const commonD = baseD * mult;
      
      const baseN = Math.floor(Math.random() * (baseD - 1)) + 1;
      const convertedN = baseN * mult;

      let relatedN;
      if (isAddition) {
        const maxRelatedN = commonD - convertedN - 1;
        if (maxRelatedN < 1) continue;
        relatedN = Math.floor(Math.random() * maxRelatedN) + 1;
      } else {
        const maxRelatedN = convertedN - 1;
        if (maxRelatedN < 1) continue;
        relatedN = Math.floor(Math.random() * maxRelatedN) + 1;
      }

      validPair = {
        base: { n: baseN, d: baseD },
        related: { n: relatedN, d: commonD },
        mult: mult,
        isAddition: isAddition
      };
    }
    return validPair;
  };

  const getQText = (structureText, shortText) => {
    if (isStructure) return structureText;
    return shortText;
  };

  if (activeVariant === 'foundation_visual_addition') {
    let pair = getRelatedFractions(true);
    const convertedN = pair.base.n * pair.mult;
    const commonD = pair.base.d * pair.mult;
    const finalN = convertedN + pair.related.n;
    answer = `${finalN}/${commonD}`;

    const parts = [
      { segments: 1, layoutSize: convertedN, bgClass: "bg-blue-500 text-white" },
      { segments: pair.related.n, layoutSize: pair.related.n, bgClass: "bg-green-500 text-white" }
    ];
    if (commonD - finalN > 0) {
      parts.push({ segments: commonD - finalN, layoutSize: commonD - finalN, bgClass: "bg-slate-200 text-slate-400" });
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_MODEL",
      componentData: {
        modelType: "PART_WHOLE",
        hideTotal: true,
        parts: parts,
        topBrackets: [
          { size: convertedN, label: `${pair.base.n}/${pair.base.d}` },
          { size: pair.related.n, label: `${pair.related.n}/${commonD}` }
        ],
        isStatic: true
      }
    });

    if (isMCQ) {
      askText = `Which fraction represents the total shaded area of ${pair.base.n}/${pair.base.d} + ${pair.related.n}/${commonD}?`;
      const dist1 = `${pair.base.n + pair.related.n}/${pair.base.d + commonD}`;
      const dist2 = `${pair.base.n + pair.related.n}/${commonD}`;
      const dist3 = `${finalN + 1}/${commonD}`;
      const dist4 = `${finalN + 2}/${commonD}`;
      const dist5 = `${pair.base.n + pair.related.n + 1}/${commonD}`;
      mcqOptions = getUniqueOptions(answer, [dist1, dist2, dist3, dist4, dist5]);
      
      solutionSteps = [
        `Change ${pair.base.n}/${pair.base.d} to match the denominator of ${commonD}.`,
        `${pair.base.n}/${pair.base.d} = ${convertedN}/${commonD}.`,
        `Add them together: ${convertedN}/${commonD} + ${pair.related.n}/${commonD} = ${finalN}/${commonD}.`
      ];
      hint = `First, change ${pair.base.n}/${pair.base.d} into an equivalent fraction with a denominator of ${commonD}.`;
    } else {
      let structText = `STORY: ${names[0]} uses ${pair.base.n}/${pair.base.d} of a ${contextItem} for one project and ${pair.related.n}/${commonD} of the same ${contextItem} for another project. Look at the visual models to find the total fraction of the ${contextItem} used.`;
      let shortText = `Look at the models. Add ${pair.base.n}/${pair.base.d} and ${pair.related.n}/${commonD}.`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Which fraction to convert`, expectedAnswer: `${pair.base.n}/${pair.base.d}` },
            { label: `Converted fraction`, expectedAnswer: `${convertedN}/${commonD}` },
            { label: `Visually added fraction`, expectedAnswer: answer }
          ]
        });
      }

      askText = getQText(structText, shortText);
      hint = `Convert the first fraction so they both have the same denominator, then add the numerators.`;
      solutionSteps = [
        `Convert ${pair.base.n}/${pair.base.d} to an equivalent fraction with denominator ${commonD}: ${convertedN}/${commonD}.`,
        `Add the numerators: ${convertedN} + ${pair.related.n} = ${finalN}.`,
        `The total is ${finalN}/${commonD}.`
      ];
    }
  } else if (activeVariant === 'foundation_visual_subtraction') {
    let pair = getRelatedFractions(false);
    const convertedN = pair.base.n * pair.mult;
    const commonD = pair.base.d * pair.mult;
    const finalN = convertedN - pair.related.n;
    answer = `${finalN}/${commonD}`;

    const parts = [];
    if (pair.base.n > 1) {
      parts.push({ segments: pair.base.n - 1, layoutSize: (pair.base.n - 1) * pair.mult, bgClass: "bg-blue-500 text-white" });
    }
    if (pair.mult - pair.related.n > 0) {
      parts.push({ segments: 1, layoutSize: pair.mult - pair.related.n, bgClass: "bg-blue-500 text-white" });
    }
    parts.push({ segments: 1, layoutSize: pair.related.n, bgClass: "bg-blue-500/30 text-white strikethrough", value: "X" });
    if (pair.base.d - pair.base.n > 0) {
      parts.push({ segments: pair.base.d - pair.base.n, layoutSize: (pair.base.d - pair.base.n) * pair.mult, bgClass: "bg-slate-200 text-slate-400" });
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_MODEL",
      componentData: {
        modelType: "PART_WHOLE",
        hideTotal: true,
        parts: parts,
        topBrackets: [
          { size: finalN },
          { size: pair.related.n, label: `${pair.related.n}/${commonD}` }
        ],
        isStatic: true
      }
    });

    if (isMCQ) {
      askText = `The model shows ${pair.base.n}/${pair.base.d} with ${pair.related.n}/${commonD} crossed out. What is the remaining fraction?`;
      const nDiff = Math.abs(pair.base.n - pair.related.n) || 1;
      const dist1 = `${nDiff}/${pair.base.d}`;
      const dist2 = `${nDiff}/${commonD}`;
      const dist3 = `${finalN - 1 || 1}/${commonD}`;
      const dist4 = `${finalN + 1}/${commonD}`;
      const dist5 = `${pair.base.n}/${commonD}`;
      mcqOptions = getUniqueOptions(answer, [dist1, dist2, dist3, dist4, dist5]);
      
      solutionSteps = [
        `Change ${pair.base.n}/${pair.base.d} to match the denominator of ${commonD}.`,
        `${pair.base.n}/${pair.base.d} = ${convertedN}/${commonD}.`,
        `Subtract the crossed-out parts: ${convertedN}/${commonD} - ${pair.related.n}/${commonD} = ${finalN}/${commonD}.`
      ];
      hint = `First, change ${pair.base.n}/${pair.base.d} into an equivalent fraction with a denominator of ${commonD}.`;
    } else {
      let structText = `STORY: ${names[0]} has a ${contextItem} that is ${pair.base.n}/${pair.base.d} of a metre long. They cut off ${pair.related.n}/${commonD} of a metre. Look at the model showing the crossed-out parts. What fraction of the ${contextItem} is left?`;
      let shortText = `Look at the model. Subtract ${pair.related.n}/${commonD} from ${pair.base.n}/${pair.base.d}.`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Which fraction to convert`, expectedAnswer: `${pair.base.n}/${pair.base.d}` },
            { label: `Converted fraction`, expectedAnswer: `${convertedN}/${commonD}` },
            { label: `Remaining fraction`, expectedAnswer: answer }
          ]
        });
      }

      askText = getQText(structText, shortText);
      hint = `Convert the first fraction so they both have the same denominator, then subtract the numerators.`;
      solutionSteps = [
        `Convert ${pair.base.n}/${pair.base.d} to an equivalent fraction with denominator ${commonD}: ${convertedN}/${commonD}.`,
        `Subtract the numerators: ${convertedN} - ${pair.related.n} = ${finalN}.`,
        `The remaining fraction is ${finalN}/${commonD}.`
      ];
    }
  } else if (activeVariant === 'foundation_convert_first') {
    let pair = getRelatedFractions(null);
    const convertedN = pair.base.n * pair.mult;
    const commonD = pair.base.d * pair.mult;
    const finalN = pair.isAddition ? convertedN + pair.related.n : convertedN - pair.related.n;
    const operator = pair.isAddition ? '+' : '-';
    answer = `${finalN}/${commonD}`;

    visualEngineStr = JSON.stringify({
      componentToRender: "FRACTION_EQUIVALENCE",
      componentData: {
        before: { num: pair.base.n, denom: pair.base.d },
        after: { num: "?", denom: commonD },
        operator: "x",
        factor: "?"
      }
    });

    if (isMCQ) {
      askText = `What is the correct first step to solve ${pair.base.n}/${pair.base.d} ${operator} ${pair.related.n}/${commonD}?`;
      answer = `${convertedN}/${commonD} ${operator} ${pair.related.n}/${commonD}`;
      const dist1 = pair.isAddition 
          ? `${pair.base.n + pair.related.n}/${pair.base.d + commonD}`
          : `${Math.abs(pair.base.n - pair.related.n) || 1}/${Math.abs(pair.base.d - commonD)}`;
      const wrongMult = pair.mult === 2 ? 3 : 2;
      const dist2 = `${pair.base.n * wrongMult}/${commonD} ${operator} ${pair.related.n}/${commonD}`;
      const dist3 = `${pair.base.n}/${commonD} ${operator} ${pair.related.n}/${commonD}`;
      const dist4 = `${pair.base.n}/${pair.base.d} ${operator} ${pair.related.n}/${pair.base.d}`;
      mcqOptions = getUniqueOptions(answer, [dist1, dist2, dist3, dist4]);
      visualEngineStr = `{"componentToRender": "NONE", "componentData": {"hideVisual": true}}`;
      
      const opWord = pair.isAddition ? "add" : "subtract";
      solutionSteps = [
        `Before we can ${opWord}, the denominators must be the same.`,
        `Convert ${pair.base.n}/${pair.base.d} to an equivalent fraction with denominator ${commonD}.`,
        `${pair.base.n}/${pair.base.d} = ${convertedN}/${commonD}.`,
        `So, the first step is ${convertedN}/${commonD} ${operator} ${pair.related.n}/${commonD}.`
      ];
      hint = `Change ${pair.base.n}/${pair.base.d} so its denominator matches ${commonD}.`;
    } else {
      let structText;
      if (pair.isAddition) {
        structText = `STORY: ${names[0]} has ${pair.base.n}/${pair.base.d} of a ${contextItem} and their friend gives them another ${pair.related.n}/${commonD} of a ${contextItem}. To find the total amount of ${contextItem} ${names[0]} has, first change ${pair.base.n}/${pair.base.d} into an equivalent fraction with a denominator of ${commonD}, then find the total sum.`;
      } else {
        structText = `STORY: ${names[0]} has ${pair.base.n}/${pair.base.d} of a ${contextItem} and gives ${pair.related.n}/${commonD} of it to their friend. To find the remaining amount of ${contextItem}, first change ${pair.base.n}/${pair.base.d} into an equivalent fraction with a denominator of ${commonD}, then find the difference.`;
      }
      
      const opWord = pair.isAddition ? "final sum" : "difference";
      let shortText = `${pair.base.n}/${pair.base.d} ${operator} ${pair.related.n}/${commonD} = [ ]/${commonD} ${operator} ${pair.related.n}/${commonD} = [ ]/${commonD}. Find the ${opWord}.`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Complete the conversion`, expectedAnswer: `${convertedN}/${commonD}` },
            { label: `Working equation`, expectedAnswer: `${convertedN}/${commonD} ${operator} ${pair.related.n}/${commonD}` },
            { label: `Final answer`, expectedAnswer: answer }
          ]
        });
      }

      askText = getQText(structText, shortText);
      const hintWord = pair.isAddition ? "add" : "subtract";
      hint = `First find the missing numerator for the equivalent fraction, then ${hintWord} the numerators.`;
      const stepWord = pair.isAddition ? "Now add" : "Now subtract";
      solutionSteps = [
        `${pair.base.n}/${pair.base.d} = ${convertedN}/${commonD}.`,
        `${stepWord}: ${convertedN}/${commonD} ${operator} ${pair.related.n}/${commonD} = ${finalN}/${commonD}.`
      ];
    }
  } else if (activeVariant === 'foundation_error_analysis') {
    let pair = getRelatedFractions(null);
    const convertedN = pair.base.n * pair.mult;
    const commonD = pair.base.d * pair.mult;
    const operator = pair.isAddition ? '+' : '-';
    
    const correctN = pair.isAddition ? convertedN + pair.related.n : convertedN - pair.related.n;
    const errorN = pair.isAddition ? pair.base.n + pair.related.n : Math.abs(pair.base.n - pair.related.n);
    const errorD = pair.isAddition ? pair.base.d + commonD : Math.abs(pair.base.d - commonD);

    const isMethodCorrect = Math.random() > 0.5;
    answer = isMethodCorrect ? "True" : "False";

    visualEngineStr = `{"componentToRender": "NONE", "componentData": {"hideVisual": true}}`;

    if (isMCQ) {
      askText = `Which of these students solved ${pair.base.n}/${pair.base.d} ${operator} ${pair.related.n}/${commonD} correctly?`;
      const correctString = `${names[0]}: ${convertedN}/${commonD} ${operator} ${pair.related.n}/${commonD} = ${correctN}/${commonD}`;
      const dist1 = `${names[1]}: ${pair.base.n}/${pair.base.d} ${operator} ${pair.related.n}/${commonD} = ${errorN}/${errorD}`;
      const dist2 = `${names[2]}: ${pair.base.n}/${commonD} ${operator} ${pair.related.n}/${commonD} = ${pair.isAddition ? pair.base.n + pair.related.n : Math.abs(pair.base.n - pair.related.n)}/${commonD}`;
      const dist3 = `None of them`;
      
      answer = correctString;
      mcqOptions = getUniqueOptions(answer, [dist1, dist2, dist3]);
      
      const opWord = pair.isAddition ? "add" : "subtract";
      solutionSteps = [
        `You cannot ${opWord} the top and bottom numbers directly.`,
        `You must first convert ${pair.base.n}/${pair.base.d} to have a denominator of ${commonD}.`,
        `${pair.base.n}/${pair.base.d} = ${convertedN}/${commonD}.`,
        `${convertedN}/${commonD} ${operator} ${pair.related.n}/${commonD} = ${correctN}/${commonD}.`
      ];
      const hintWord = pair.isAddition ? "adding" : "subtracting";
      hint = `Check if they made the denominators the same before ${hintWord}!`;
    } else {
      let structText, shortText, solutionStepText;
      const opWord = pair.isAddition ? "add" : "subtract";
      
      if (isMethodCorrect) {
        structText = `STORY: ${names[0]} tries to ${opWord} ${pair.base.n}/${pair.base.d} and ${pair.related.n}/${commonD}. They first change ${pair.base.n}/${pair.base.d} to ${convertedN}/${commonD}, then ${opWord} the numerators to get ${correctN}. Their answer is ${correctN}/${commonD}. Is this method True or False?`;
        shortText = `${names[0]} writes: ${convertedN}/${commonD} ${operator} ${pair.related.n}/${commonD} = ${correctN}/${commonD}. Is this True or False?`;
        solutionStepText = `True! ${names[0]} correctly converted to a common denominator before ${pair.isAddition ? 'adding' : 'subtracting'}.`;
      } else {
        structText = `STORY: ${names[0]} tries to ${opWord} ${pair.base.n}/${pair.base.d} and ${pair.related.n}/${commonD}. They ${opWord} the top numbers to get ${errorN}, and ${opWord} the bottom numbers to get ${errorD}. Their answer is ${errorN}/${errorD}. Is this method True or False?`;
        shortText = `${names[0]} writes: ${pair.base.n}/${pair.base.d} ${operator} ${pair.related.n}/${commonD} = ${errorN}/${errorD}. Is this True or False?`;
        solutionStepText = `False! We never ${opWord} denominators together. We must find a common denominator first.`;
      }

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `True or False?`, expectedAnswer: answer },
            { label: `Which fraction to convert`, expectedAnswer: `${pair.base.n}/${pair.base.d}` },
            { label: `Converted fraction`, expectedAnswer: `${convertedN}/${commonD}` },
            { label: `Working equation result`, expectedAnswer: `${correctN}/${commonD}` }
          ]
        });
      }
      
      mcqOptions = JSON.stringify(["True", "False"]);
      askText = getQText(structText, shortText);
      hint = `Do we ${opWord} denominators together when calculating fractions?`;
      solutionSteps = [
        solutionStepText,
        `The correct answer is ${correctN}/${commonD}.`
      ];
    }
  } else if (activeVariant === 'foundation_match_equation') {
    let pair = getRelatedFractions(null);
    const convertedN = pair.base.n * pair.mult;
    const commonD = pair.base.d * pair.mult;
    const operator = pair.isAddition ? '+' : '-';
    
    answer = `${convertedN}/${commonD} ${operator} ${pair.related.n}/${commonD}`;
    visualEngineStr = `{"componentToRender": "NONE", "componentData": {"hideVisual": true}}`;

    const opWord = pair.isAddition ? "add" : "subtract";
    
    if (isMCQ) {
      askText = `Which equation is the same as ${pair.base.n}/${pair.base.d} ${operator} ${pair.related.n}/${commonD}?`;
      
      const wrongMult = pair.mult === 2 ? 3 : 2;
      const dist1 = `${pair.base.n * wrongMult}/${commonD} ${operator} ${pair.related.n}/${commonD}`;
      const dist2 = `${pair.base.n}/${commonD} ${operator} ${pair.related.n}/${commonD}`;
      const dist3 = `${pair.base.n + pair.related.n}/${pair.base.d + commonD}`;
      const dist4 = `${pair.base.n * pair.mult}/${pair.base.d} ${operator} ${pair.related.n}/${commonD}`;
      
      mcqOptions = getUniqueOptions(answer, [dist1, dist2, dist3, dist4]);
      
      solutionSteps = [
        `To ${opWord} fractions, the denominators must match.`,
        `Convert ${pair.base.n}/${pair.base.d} to an equivalent fraction with denominator ${commonD}.`,
        `${pair.base.n}/${pair.base.d} = ${convertedN}/${commonD}.`,
        `The equivalent equation is ${convertedN}/${commonD} ${operator} ${pair.related.n}/${commonD}.`
      ];
      hint = `Change ${pair.base.n}/${pair.base.d} so its denominator matches ${commonD}.`;
    } else {
      let structText = `STORY: ${names[0]} wants to solve ${pair.base.n}/${pair.base.d} ${operator} ${pair.related.n}/${commonD}. Rewrite the equation so both fractions have the same denominator.`;
      let shortText = `Rewrite the equation with a common denominator: ${pair.base.n}/${pair.base.d} ${operator} ${pair.related.n}/${commonD}`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Which fraction needs to change?`, expectedAnswer: `${pair.base.n}/${pair.base.d}` },
            { label: `What is the new denominator?`, expectedAnswer: `${commonD}` },
            { label: `Rewrite the full equation`, expectedAnswer: answer }
          ]
        });
      }
      
      askText = getQText(structText, shortText);
      hint = `First find the missing numerator for the equivalent fraction, then rewrite the full equation with the common denominator.`;
      solutionSteps = [
        `Convert ${pair.base.n}/${pair.base.d} to an equivalent fraction with denominator ${commonD}.`,
        `${pair.base.n}/${pair.base.d} = ${convertedN}/${commonD}.`,
        `The equivalent equation is ${convertedN}/${commonD} ${operator} ${pair.related.n}/${commonD}.`
      ];
    }
  }

  const mcqOptionsStr = mcqOptions ? JSON.stringify(mcqOptions) : "[]";
  const solutionStepsStr = solutionSteps ? JSON.stringify(solutionSteps) : "[]";
  
  return {
    aiPrompt: `You are an expert Primary 3 math question generator.
    
    Question parameters:
    - askText: ${JSON.stringify(askText)}
    - answer: ${JSON.stringify(answer)}
    - options: ${mcqOptionsStr}
    - hint: ${JSON.stringify(hint)}
    - solutionSteps: ${solutionStepsStr}
    
    CRITICAL INSTRUCTION: For 'questionText', ${askText.includes('STORY:') ? `you must rewrite the text following 'STORY:' to create a highly engaging, creative word problem for a Primary 3 student. However, you MUST strictly follow these rules:\n1. Preserve the exact mathematical values and operations.\n2. DO NOT add any extra unrequested questions (e.g., do not add 'How many altogether?').\n3. Keep the final question sentence exactly as intended.` : `you MUST use the exact string provided in 'askText'. DO NOT paraphrase or rewrite it.`}
    CRITICAL INSTRUCTION: For 'finalAnswer', you MUST use the exact string provided in 'answer'.
    CRITICAL INSTRUCTION: For 'options', you MUST use the exact array provided in 'options' (if applicable).
    CRITICAL INSTRUCTION: For 'solutionSteps', you MUST use the exact array provided in 'solutionSteps'.
    CRITICAL INSTRUCTION: For 'hint', you MUST use the exact string provided in 'hint'.
    CRITICAL INSTRUCTION: For 'visualEngine', you MUST use the EXACT object provided in the FORMAT INSTRUCTIONS below. DO NOT modify it or add properties like modeldescription.
    CRITICAL INSTRUCTION: For 'inputRequirement', you MUST use the EXACT object provided in the FORMAT INSTRUCTIONS below. DO NOT modify it.
    
    ${getFormatInstructions(visualEngineStr, inputRequirementStr)}`,
    metadata: { difficulty: 'foundation', steps: 1, logic: activeVariant }
  };
};
