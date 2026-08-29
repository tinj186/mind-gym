import { getRandomNames, getRandomDivisibleFoods, getRandomDivisibleObjects } from '@/lib/utils/variable-bank';

const getArticle = (word) => /^[aeiou]/i.test(word) ? 'an' : 'a';

export const standardLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions) => {
  const names = getRandomNames(2);
  let askText = '';
  let answer = '';
  let mcqOptions = null;
  let solutionSteps = [];
  let hint = '';
  let visualEngineStr = `{"componentToRender": "NONE", "componentData": {"hideVisual": true}}`;
  let inputRequirementStr = null;
  let customConstraints = "";

  const isFoodItem = Math.random() > 0.5;
  const contextItem = isFoodItem ? getRandomDivisibleFoods(1)[0] : getRandomDivisibleObjects(1)[0];

  // Base fraction generator (P3 friendly, easy base denominators like 2, 3, 4, 5, 6, 8)
  const getBaseFraction = () => {
    const bases = [
      { n: 1, d: 2 }, { n: 1, d: 3 }, { n: 2, d: 3 },
      { n: 1, d: 4 }, { n: 2, d: 4 }, { n: 3, d: 4 },
      { n: 1, d: 5 }, { n: 2, d: 5 }, { n: 3, d: 5 }, { n: 4, d: 5 },
      { n: 1, d: 6 }, { n: 5, d: 6 }, { n: 3, d: 8 }, { n: 5, d: 8 }
    ];
    return bases[Math.floor(Math.random() * bases.length)];
  };

  const getMultiplier = () => {
    const multipliers = [2, 3, 4, 5];
    return multipliers[Math.floor(Math.random() * multipliers.length)];
  };

  let base = getBaseFraction();
  let mult = getMultiplier();
  
  // ensure target denominator isn't too large
  while (base.d * mult > 24) {
    base = getBaseFraction();
    mult = getMultiplier();
  }

  const targetN = base.n * mult;
  const targetD = base.d * mult;

  if (activeVariant === 'standard_forward_numerator') {
    answer = String(targetN);

    if (isMCQ) {
      answer = String(targetN);
      askText = `What is the missing number? ${base.n}/${base.d} = [ ]/${targetD}`;
      const dist1 = String(targetN + 1);
      const dist2 = String(targetN - 1 || 1);
      const dist3 = String(targetN + 2);
      mcqOptions = [answer, dist1, dist2, dist3].sort(() => 0.5 - Math.random());
      
      solutionSteps = [
        `Look at the denominators to find the multiplier.`,
        `${base.d} x ${mult} = ${targetD}.`,
        `Multiply the numerator by the same number.`,
        `${base.n} x ${mult} = ${targetN}.`,
        `The missing number is ${targetN}.`
      ];
      hint = `How many times does ${base.d} fit into ${targetD}? Multiply the top number by the same amount!`;
    } else {
      answer = isStructure ? `${targetN}/${targetD}` : String(targetN);
      
      let structText = `STORY: Create a short word problem for a Primary 3 student where ${names[0]} needs ${base.n}/${base.d} of a ${contextItem}. They want to find an equivalent fraction with a denominator of ${targetD}. The final sentence MUST EXACTLY be: "Write the equivalent fraction." CRITICAL: DO NOT state the answer in the story.`;
      let shortText = `Find the missing number: ${base.n}/${base.d} = [ ]/${targetD}`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Find the multiplier for the denominator.`, expectedAnswer: String(mult) },
            { label: `What is the new numerator?`, expectedAnswer: String(targetN) },
            { label: `Write the equivalent fraction.`, expectedAnswer: answer }
          ]
        });
      }

      askText = getQText(structText, shortText);
      hint = `Find what the denominator was multiplied by, then multiply the numerator by the same number to write the full fraction.`;
      solutionSteps = [
        `Find the multiplier for the denominators: ${base.d} x ${mult} = ${targetD}.`,
        `Multiply the numerator by the same number: ${base.n} x ${mult} = ${targetN}.`,
        isStructure ? `The equivalent fraction is ${targetN}/${targetD}.` : `The missing number is ${targetN}.`
      ];
    }
  } else if (activeVariant === 'standard_forward_denominator') {
    answer = String(targetD);

    if (isMCQ) {
      answer = String(targetD);
      askText = `What is the missing number? ${base.n}/${base.d} = ${targetN}/[ ]`;
      const dist1 = String(targetD + 1);
      const dist2 = String(targetD - 1);
      const dist3 = String(targetD + mult);
      mcqOptions = [answer, dist1, dist2, dist3].sort(() => 0.5 - Math.random());
      
      solutionSteps = [
        `Look at the numerators to find the multiplier.`,
        `${base.n} x ${mult} = ${targetN}.`,
        `Multiply the denominator by the same number.`,
        `${base.d} x ${mult} = ${targetD}.`,
        `The missing number is ${targetD}.`
      ];
      hint = `How many times does ${base.n} fit into ${targetN}? Multiply the bottom number by the same amount!`;
    } else {
      answer = isStructure ? `${targetN}/${targetD}` : String(targetD);
      
      let structText = `STORY: Create a short word problem for a Primary 3 student where ${names[0]} interacts with ${base.n}/${base.d} of a ${contextItem}. They want to find an equivalent fraction with a numerator of ${targetN}. The final sentence MUST EXACTLY be: "Write the equivalent fraction." CRITICAL: DO NOT state the answer in the story.`;
      let shortText = `Find the missing number: ${base.n}/${base.d} = ${targetN}/[ ]`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Find the multiplier for the numerator.`, expectedAnswer: String(mult) },
            { label: `What is the new denominator?`, expectedAnswer: String(targetD) },
            { label: `Write the equivalent fraction.`, expectedAnswer: answer }
          ]
        });
      }

      askText = getQText(structText, shortText);
      hint = `Find what the numerator was multiplied by, then multiply the denominator by the same number to write the full fraction.`;
      solutionSteps = [
        `Find the multiplier for the numerators: ${base.n} x ${mult} = ${targetN}.`,
        `Multiply the denominator by the same number: ${base.d} x ${mult} = ${targetD}.`,
        isStructure ? `The equivalent fraction is ${targetN}/${targetD}.` : `The missing number is ${targetD}.`
      ];
    }
  } else if (activeVariant === 'standard_reverse_numerator') {
    answer = String(base.n);

    if (isMCQ) {
      answer = String(base.n);
      askText = `What is the missing number? ${targetN}/${targetD} = [ ]/${base.d}`;
      const dist1 = String(base.n + 1);
      const dist2 = String(base.n - 1 || 1);
      const dist3 = String(base.n + 2);
      mcqOptions = [answer, dist1, dist2, dist3].sort(() => 0.5 - Math.random());
      
      solutionSteps = [
        `Look at the denominators to find the divisor.`,
        `${targetD} ÷ ${mult} = ${base.d}.`,
        `Divide the numerator by the same number.`,
        `${targetN} ÷ ${mult} = ${base.n}.`,
        `The missing number is ${base.n}.`
      ];
      hint = `What do you divide ${targetD} by to get ${base.d}? Divide the top number by the same amount!`;
    } else {
      answer = isStructure ? `${base.n}/${base.d}` : String(base.n);
      
      let structText = `STORY: Create a short word problem for a Primary 3 student where ${targetN}/${targetD} of a ${contextItem} is used. They want to find an equivalent fraction with a denominator of ${base.d}. The final sentence MUST EXACTLY be: "Write the equivalent fraction." CRITICAL: DO NOT state the answer in the story.`;
      let shortText = `Find the missing number: ${targetN}/${targetD} = [ ]/${base.d}`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Find the divisor for the denominator.`, expectedAnswer: String(mult) },
            { label: `What is the new numerator?`, expectedAnswer: String(base.n) },
            { label: `Write the equivalent fraction.`, expectedAnswer: answer }
          ]
        });
      }

      askText = getQText(structText, shortText);
      hint = `Find what the denominator was divided by, then divide the numerator by the same number to write the full fraction.`;
      solutionSteps = [
        `Find the divisor for the denominators: ${targetD} ÷ ${mult} = ${base.d}.`,
        `Divide the numerator by the same number: ${targetN} ÷ ${mult} = ${base.n}.`,
        isStructure ? `The equivalent fraction is ${base.n}/${base.d}.` : `The missing number is ${base.n}.`
      ];
    }
  } else if (activeVariant === 'standard_reverse_denominator') {
    answer = String(base.d);

    if (isMCQ) {
      answer = String(base.d);
      askText = `What is the missing number? ${targetN}/${targetD} = ${base.n}/[ ]`;
      const dist1 = String(base.d + 1);
      const dist2 = String(base.d - 1);
      const dist3 = String(base.d + mult);
      mcqOptions = [answer, dist1, dist2, dist3].sort(() => 0.5 - Math.random());
      
      solutionSteps = [
        `Look at the numerators to find the divisor.`,
        `${targetN} ÷ ${mult} = ${base.n}.`,
        `Divide the denominator by the same number.`,
        `${targetD} ÷ ${mult} = ${base.d}.`,
        `The missing number is ${base.d}.`
      ];
      hint = `What do you divide ${targetN} by to get ${base.n}? Divide the bottom number by the same amount!`;
    } else {
      answer = isStructure ? `${base.n}/${base.d}` : String(base.d);
      
      let structText = `STORY: Create a short word problem for a Primary 3 student where ${targetN}/${targetD} of a ${contextItem} is painted. This can be expressed as an equivalent fraction with a numerator of ${base.n}. The final sentence MUST EXACTLY be: "Write the equivalent fraction." CRITICAL: DO NOT state the answer in the story.`;
      let shortText = `Find the missing number: ${targetN}/${targetD} = ${base.n}/[ ]`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Find the divisor for the numerator.`, expectedAnswer: String(mult) },
            { label: `What is the new denominator?`, expectedAnswer: String(base.d) },
            { label: `Write the equivalent fraction.`, expectedAnswer: answer }
          ]
        });
      }

      askText = getQText(structText, shortText);
      hint = `Find what the numerator was divided by, then divide the denominator by the same number to write the full fraction.`;
      solutionSteps = [
        `Find the divisor for the numerators: ${targetN} ÷ ${mult} = ${base.n}.`,
        `Divide the denominator by the same number: ${targetD} ÷ ${mult} = ${base.d}.`,
        isStructure ? `The equivalent fraction is ${base.n}/${base.d}.` : `The missing number is ${base.d}.`
      ];
    }
  } else if (activeVariant === 'standard_multiplier_check') {
    answer = String(mult);

    if (isMCQ) {
      askText = `What is the multiplier used to change ${base.n}/${base.d} into ${targetN}/${targetD}?`;
      const dist1 = String(mult + 1);
      const dist2 = String(mult - 1 || 1);
      const dist3 = String(mult + 2);
      mcqOptions = [answer, dist1, dist2, dist3].sort(() => 0.5 - Math.random());
      
      solutionSteps = [
        `Compare the numerators: ${base.n} x ? = ${targetN}.`,
        `Compare the denominators: ${base.d} x ? = ${targetD}.`,
        `Both are multiplied by ${mult}.`
      ];
      hint = `Look at how the top number or bottom number changes. What do you multiply the first number by to get the second number?`;
    } else {
      let structText = `STORY: Create a short word problem for a Primary 3 student where ${names[0]} converts ${base.n}/${base.d} to ${targetN}/${targetD}. The final sentence MUST EXACTLY be: "What number did they multiply the numerator and denominator by?" CRITICAL: DO NOT state the answer in the story.`;
      let shortText = `What number do you multiply the top and bottom of ${base.n}/${base.d} by to get ${targetN}/${targetD}?`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `What is the multiplier for the numerator?`, expectedAnswer: answer },
            { label: `What is the multiplier for the denominator?`, expectedAnswer: answer },
            { label: `What is the multiplier?`, expectedAnswer: answer }
          ]
        });
      }

      askText = getQText(structText, shortText);
      hint = `What number links ${base.n} to ${targetN}, and ${base.d} to ${targetD}?`;
      solutionSteps = [
        `Compare the numerators: ${base.n} x ${mult} = ${targetN}.`,
        `Compare the denominators: ${base.d} x ${mult} = ${targetD}.`,
        `The multiplier is ${mult}.`
      ];
    }
  }

  if (!isMCQ && !inputRequirementStr) {
    inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
  } else if (isMCQ) {
    inputRequirementStr = `null`;
  }

  function getQText(structuredText, shortText) {
    if (isShort) return shortText;
    if (isStructure) return structuredText;
    return shortText;
  }

  // Ensure prompt asks LLM not to change the exact string if we provided a specific final sentence.
  customConstraints += `\nCRITICAL INSTRUCTION: For 'questionText', ensure you include the EXACT final sentence if specified in the STORY prompt. DO NOT paraphrase or shorten the requested final sentence.`;
  customConstraints += `\nCRITICAL INSTRUCTION: For 'finalAnswer', you MUST use the exact string provided in 'answer'.`;

  const aiPrompt = getFormatInstructions(visualEngineStr, inputRequirementStr)
    .replace('["string", "string"] (Array of strings for the full question text. Break into multiple lines if needed.)', JSON.stringify(askText.split('\\n')))
    .replace('["string", "string", "string", "string"] (ONLY if MCQ, otherwise empty array)', JSON.stringify(mcqOptions || []))
    .replace('{"distractor1": "Error category", "distractor2": "Error category"} (ONLY if MCQ, otherwise empty object)', JSON.stringify({}))
    .replace('"string (Pedagogical hint)"', JSON.stringify(hint))
    .replace('["string", "string"] (Array of strings for the step-by-step model solution. Use EXACTLY the characters \\\\n for any newlines inside strings if needed.)', JSON.stringify(solutionSteps).replace(/\\\\n/g, '\\n'))
    .replace('"string (The exact final answer)"', JSON.stringify(answer));

  return { 
    aiPrompt: aiPrompt + `\n\nQuestion parameters:\n- answer: ${answer}\n${customConstraints}`,
    visualEngine: JSON.parse(visualEngineStr),
    inputRequirement: inputRequirementStr && inputRequirementStr !== 'null' ? JSON.parse(inputRequirementStr) : undefined
  };
};
