import { getRandomNames, getRandomDivisibleFoods, getRandomDivisibleObjects } from '@/lib/utils/variable-bank';

export const advancedLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions) => {
  const names = getRandomNames(3);
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

  if (activeVariant === 'advanced_sum_of_variables') {
    let base = getBaseFraction();
    let multA = getMultiplier();
    let multB = getMultiplier();
    while (multA === multB || base.d * multA > 24 || base.n * multB > 24) {
      multA = getMultiplier();
      multB = getMultiplier();
    }
    
    // Eq: base.n/base.d = A / (base.d * multA) = (base.n * multB) / B
    let valA = base.n * multA;
    let valB = base.d * multB;
    let sumAB = valA + valB;
    answer = String(sumAB);

    visualEngineStr = JSON.stringify({
      componentToRender: "NUMBER_CARDS",
      componentData: {
        items: [
          { label: "First", type: "fraction", num: base.n, denom: base.d, color: "#BFDBFE" },
          { label: "Second", type: "fraction", num: "?", denom: base.d * multA, color: "#FCA5A5" },
          { label: "Third", type: "fraction", num: base.n * multB, denom: "?", color: "#FDE047" }
        ]
      }
    });

    if (isMCQ) {
      askText = `Sarah has three identical ${contextItem}s. She uses ${base.n}/${base.d} of the first ${contextItem}. She uses an equivalent fraction of the second ${contextItem} with a denominator of ${base.d * multA}. She uses an equivalent fraction of the third ${contextItem} with a numerator of ${base.n * multB}.
If ${base.n}/${base.d} = A/${base.d * multA} = ${base.n * multB}/B, what is the value of A + B?`;
      const dist1 = String(sumAB + 1);
      const dist2 = String(sumAB - 1 || 1);
      const dist3 = String(sumAB + 2);
      mcqOptions = [answer, dist1, dist2, dist3].sort(() => 0.5 - Math.random());
      
      solutionSteps = [
        `First, find the second fraction: ${base.n}/${base.d} = ?/${base.d * multA}.`,
        `${base.d} x ${multA} = ${base.d * multA}, so ${base.n} x ${multA} = ${valA}. The missing numerator A is ${valA}.`,
        `Next, find the third fraction: ${base.n}/${base.d} = ${base.n * multB}/?.`,
        `${base.n} x ${multB} = ${base.n * multB}, so ${base.d} x ${multB} = ${valB}. The missing denominator B is ${valB}.`,
        `Sum of unknowns = ${valA} + ${valB} = ${sumAB}.`
      ];
      hint = `Find the equivalent fraction for the second ${contextItem}, then the third ${contextItem}. Then add the missing numbers together.`;
    } else {
      let structText = `STORY: Create a word problem for a Primary 3 student where Sarah has three identical ${contextItem}s. She uses ${base.n}/${base.d} of the first ${contextItem}. She uses an equivalent amount of the second ${contextItem}, but as a fraction out of ${base.d * multA}. She uses an equivalent amount of the third ${contextItem}, but with a numerator of ${base.n * multB}. The final sentence MUST EXACTLY be: "Find the fraction of the second ${contextItem}, find the fraction of the third ${contextItem}, and write down the sum of the unknown numerator and denominator." CRITICAL: DO NOT state the answer in the story.`;
      let shortText = `If ${base.n}/${base.d} = A/${base.d * multA} = ${base.n * multB}/B, find the value of A + B.`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `What is the fraction of the second ${contextItem}?`, expectedAnswer: `${valA}/${base.d * multA}` },
            { label: `What is the fraction of the third ${contextItem}?`, expectedAnswer: `${base.n * multB}/${valB}` },
            { label: `What is the sum of the missing numbers?`, expectedAnswer: answer }
          ]
        });
      }

      askText = getQText(structText, shortText);
      hint = `Find the full equivalent fraction for the second ${contextItem}, then the third ${contextItem}. Finally, add the two missing numbers!`;
      solutionSteps = [
        `Second ${contextItem} fraction: ${base.d} x ${multA} = ${base.d * multA}, so the numerator is ${base.n} x ${multA} = ${valA}. The fraction is ${valA}/${base.d * multA}.`,
        `Third ${contextItem} fraction: ${base.n} x ${multB} = ${base.n * multB}, so the denominator is ${base.d} x ${multB} = ${valB}. The fraction is ${base.n * multB}/${valB}.`,
        `The sum of the unknowns is ${valA} + ${valB} = ${sumAB}.`
      ];
    }
  } else if (activeVariant === 'advanced_contextual_forward') {
    let base = getBaseFraction();
    let mult = getMultiplier();
    while (base.d * mult > 24) {
      base = getBaseFraction();
      mult = getMultiplier();
    }
    const targetN = base.n * mult;
    const targetD = base.d * mult;

    answer = String(targetN);

    if (isMCQ) {
      askText = `I have ${targetD} ${contextItem}s. I want to keep ${base.n}/${base.d} of them. Which fraction shows the amount I keep out of ${targetD}?`;
      const dist1 = `${targetN + 1}/${targetD}`;
      const dist2 = `${targetN - 1 || 1}/${targetD}`;
      const dist3 = `${targetN + 2}/${targetD}`;
      mcqOptions = [`${targetN}/${targetD}`, dist1, dist2, dist3].sort(() => 0.5 - Math.random());
      answer = `${targetN}/${targetD}`;
      
      solutionSteps = [
        `We need to find an equivalent fraction for ${base.n}/${base.d} with a denominator of ${targetD}.`,
        `${base.d} x ${mult} = ${targetD}.`,
        `So, multiply the numerator by the same number: ${base.n} x ${mult} = ${targetN}.`,
        `The equivalent fraction is ${targetN}/${targetD}.`
      ];
      hint = `Convert the fraction so that the bottom number matches the total amount of ${contextItem}s.`;
    } else {
      answer = isStructure ? `${targetN}/${targetD}` : String(targetN);
      
      let structText = `STORY: Create a word problem for a Primary 3 student where a packet contains ${targetD} ${contextItem}s. ${names[0]} wants to take exactly ${base.n}/${base.d} of the packet. The final sentence MUST EXACTLY be: "Write the equivalent fraction out of ${targetD}." CRITICAL: DO NOT state the answer in the story.`;
      let shortText = `A box holds ${targetD} items. I need ${base.n}/${base.d} of the box. How many items is that?`;

      if (!isStructure) {
        // short question wants just the integer answer
        answer = String(targetN);
      }
      
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
      hint = `Change the fraction so its denominator is ${targetD}. Multiply the top and bottom by the same number.`;
      solutionSteps = [
        `Find the equivalent fraction for ${base.n}/${base.d} with a denominator of ${targetD}.`,
        `${base.d} x ${mult} = ${targetD}.`,
        `Multiply the numerator: ${base.n} x ${mult} = ${targetN}.`,
        isStructure ? `The equivalent fraction is ${targetN}/${targetD}.` : `The answer is ${targetN} items.`
      ];
    }
  } else if (activeVariant === 'advanced_contextual_reverse') {
    let base = { n: 1, d: Math.floor(Math.random() * 4) + 2 }; // e.g. 1/2, 1/3, 1/4, 1/5
    let targetN = Math.floor(Math.random() * 5) + 3; // e.g. 3 to 7
    const targetD = targetN * base.d;
    
    answer = String(targetD);

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_MODEL",
      componentData: {
        modelType: "PART_WHOLE",
        parts: [
          { value: "?", layoutSize: 1, segments: 1, bgClass: "bg-blue-500 text-white" },
          { value: "", layoutSize: base.d - 1, segments: base.d - 1, bgClass: "bg-slate-200 text-slate-600" }
        ],
        whole: "?"
      }
    });

    if (isMCQ) {
      askText = `${targetN} parts represent ${base.n}/${base.d} of a full ${contextItem}. How many parts are in the full ${contextItem}?`;
      const dist1 = String(targetD + base.d);
      const dist2 = String(targetD - base.d);
      const dist3 = String(targetN * (base.d + 1));
      mcqOptions = [answer, dist1, dist2, dist3].sort(() => 0.5 - Math.random());
      
      solutionSteps = [
        `If ${base.n}/${base.d} is ${targetN} parts...`,
        `That means ${base.n} unit = ${targetN} parts.`,
        `The whole is ${base.d} units.`,
        `${targetN} x ${base.d} = ${targetD}.`,
        `There are ${targetD} parts in the full ${contextItem}.`
      ];
      hint = `If 1 part is ${targetN}, how many would ${base.d} parts be?`;
    } else {
      let structText = `STORY: Create a logical word problem for a Primary 3 student where ${names[0]} interacts with ${targetN} smaller parts of a single ${contextItem}. They calculate that this is exactly ${base.n}/${base.d} of the whole ${contextItem}. Make sure the action makes logical sense for a ${contextItem} (e.g. eating for food, using/cutting/painting for objects). The final sentence MUST EXACTLY be: "How many smaller parts was the whole ${contextItem} divided into at first?" CRITICAL: DO NOT state the answer in the story.`;
      let shortText = `${targetN} parts of a ${contextItem} is exactly ${base.n}/${base.d} of the whole ${contextItem}. How many parts are in the whole ${contextItem}?`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `How many pieces does 1 unit represent?`, expectedAnswer: String(targetN) },
            { label: `How many units are in the whole ${contextItem}?`, expectedAnswer: String(base.d) },
            { label: `How many parts were there at first?`, expectedAnswer: answer }
          ]
        });
      }

      askText = getQText(structText, shortText);
      hint = `If ${base.n}/${base.d} of it is ${targetN}, it means 1 unit equals ${targetN}. How many units make up the whole?`;
      solutionSteps = [
        `The fraction ${base.n}/${base.d} means the whole is divided into ${base.d} parts.`,
        `1 part = ${targetN}.`,
        `Total parts = ${base.d} units.`,
        `Total = ${targetN} x ${base.d} = ${targetD}.`
      ];
    }
  } else if (activeVariant === 'advanced_add_first_then_scale') {
    let baseD = Math.floor(Math.random() * 3) + 4; // 4, 5, 6
    let n1 = Math.floor(Math.random() * 2) + 1; // 1 or 2
    let n2 = Math.floor(Math.random() * 2) + 1;
    let sumN = n1 + n2;
    let mult = Math.floor(Math.random() * 2) + 2; // 2 or 3
    let targetD = baseD * mult;
    let targetN = sumN * mult;

    answer = isStructure ? `${targetN}/${targetD}` : String(targetN);

    if (isMCQ) {
      answer = String(targetN);
      askText = `${n1}/${baseD} + ${n2}/${baseD} = [ ]/${targetD}. What is the missing numerator?`;
      const dist1 = String(targetN + 1);
      const dist2 = String(targetN - 1 || 1);
      const dist3 = String(sumN);
      mcqOptions = [answer, dist1, dist2, dist3].sort(() => 0.5 - Math.random());
      
      solutionSteps = [
        `First add the fractions: ${n1}/${baseD} + ${n2}/${baseD} = ${sumN}/${baseD}.`,
        `Next, find the multiplier to get the denominator ${targetD}.`,
        `${baseD} x ${mult} = ${targetD}.`,
        `Multiply the numerator by the same number: ${sumN} x ${mult} = ${targetN}.`,
        `The missing numerator is ${targetN}.`
      ];
      hint = `Add the two fractions first! Then find the equivalent fraction.`;
    } else {
      let structText = `STORY: Create a logical word problem for a Primary 3 student where ${names[0]} uses ${n1}/${baseD} of a ${contextItem} for one purpose and ${n2}/${baseD} of the same ${contextItem} for another purpose. Make sure the actions make sense for a ${contextItem} (e.g., eating/sharing for food, cutting/using for objects). The final sentence MUST EXACTLY be: "Express the total amount used as an equivalent fraction with a denominator of ${targetD}." CRITICAL: DO NOT state the answer in the story.`;
      let shortText = `Add ${n1}/${baseD} and ${n2}/${baseD}. Write the answer as an equivalent fraction with a denominator of ${targetD}.`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `What is the total amount used?`, expectedAnswer: `${sumN}/${baseD}` },
            { label: `Find the multiplier for the denominator.`, expectedAnswer: String(mult) },
            { label: `Write the equivalent fraction.`, expectedAnswer: answer }
          ]
        });
      }

      askText = getQText(structText, shortText);
      hint = `Add the fractions first to get the total. Then multiply the top and bottom to get the new denominator.`;
      solutionSteps = [
        `First, add the two fractions together: ${n1}/${baseD} + ${n2}/${baseD} = ${sumN}/${baseD}.`,
        `Find the multiplier for the denominator: ${baseD} x ${mult} = ${targetD}.`,
        `Multiply the numerator: ${sumN} x ${mult} = ${targetN}.`,
        isStructure ? `The equivalent fraction is ${targetN}/${targetD}.` : `The answer is ${targetN}/${targetD}.`
      ];
      if (!isStructure) {
          answer = `${targetN}/${targetD}`; // both short and structure expect the full fraction based on the prompt text
      }
    }
  } else if (activeVariant === 'advanced_impossible_conversion') {
    const validD1 = 2;
    const validD2 = 3;
    const validD3 = 4;
    const validD4 = 6;
    
    // Choose a target denominator that has specific divisors
    const targetDOptions = [12, 10, 15, 18, 20];
    const targetD = targetDOptions[Math.floor(Math.random() * targetDOptions.length)];
    
    // Find valid factors for the targetD
    const allPossibleBases = [2, 3, 4, 5, 6, 7, 8, 9, 10];
    const validFactors = allPossibleBases.filter(d => targetD % d === 0);
    const invalidFactors = allPossibleBases.filter(d => targetD % d !== 0);
    
    const valid1 = validFactors[0];
    const valid2 = validFactors[1 % validFactors.length];
    const invalidD = invalidFactors[Math.floor(Math.random() * invalidFactors.length)];
    
    const options = [
      `1/${valid1}`,
      `1/${valid2}`,
      `1/${invalidD}`
    ].sort(() => 0.5 - Math.random());
    
    const invalidPlayerIndex = options.indexOf(`1/${invalidD}`);
    answer = `1/${invalidD}`;

    if (isMCQ) {
      askText = `Which of these fractions cannot be written as an equivalent fraction with a denominator of ${targetD}?`;
      mcqOptions = options;
      
      solutionSteps = [
        `Check each fraction's denominator to see if it can multiply into ${targetD}.`,
        `${valid1} x ${targetD / valid1} = ${targetD}. (Possible)`,
        `${valid2} x ${targetD / valid2} = ${targetD}. (Possible)`,
        `${invalidD} cannot be multiplied by a whole number to get ${targetD}.`,
        `Therefore, 1/${invalidD} cannot be converted.`
      ];
      hint = `Can you multiply the denominator by a whole number to get exactly ${targetD}? Try it for each one!`;
    } else {
      let structText = `STORY: Create a word problem for a Primary 3 student where a game requires changing a fraction so the denominator is exactly ${targetD}. ${names[0]} has ${options[0]}. ${names[1]} has ${options[1]}. ${names[2]} has ${options[2]}. The final sentence MUST EXACTLY be: "Who cannot play the game?" CRITICAL: DO NOT state the answer in the story.`;
      let shortText = `Which fraction cannot be changed to a denominator of ${targetD}? ${options.join(', or ')}?`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Can ${options[0]} be converted? (Yes or No)`, expectedAnswer: options[0] === `1/${invalidD}` ? "No" : "Yes" },
            { label: `Can ${options[1]} be converted? (Yes or No)`, expectedAnswer: options[1] === `1/${invalidD}` ? "No" : "Yes" },
            { label: `Can ${options[2]} be converted? (Yes or No)`, expectedAnswer: options[2] === `1/${invalidD}` ? "No" : "Yes" },
            { label: `Who cannot play?`, expectedAnswer: names[invalidPlayerIndex] }
          ]
        });
        answer = names[invalidPlayerIndex];
      } else {
        answer = `1/${invalidD}`;
      }

      askText = getQText(structText, shortText);
      hint = `Try multiplying each denominator. Which one does not fit into ${targetD} perfectly?`;
      solutionSteps = [
        `For 1/${valid1}: ${valid1} x ${targetD / valid1} = ${targetD}. This works!`,
        `For 1/${valid2}: ${valid2} x ${targetD / valid2} = ${targetD}. This works!`,
        `For 1/${invalidD}: ${invalidD} cannot be multiplied by a whole number to get ${targetD}.`,
        isStructure ? `The player with 1/${invalidD} cannot play.` : `The fraction 1/${invalidD} cannot be changed.`
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
