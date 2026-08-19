import { getRandomNames, getRandomDivisibleFoods, getRandomDivisibleObjects } from '@/lib/utils/variable-bank';

const getArticle = (word) => /^[aeiou]/i.test(word) ? 'an' : 'a';

export const foundationLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions) => {
  const names = getRandomNames(2);
  let askText, answer, mcqOptions, solutionSteps, hint;
  let visualEngineStr = `{"componentToRender": "NONE", "componentData": {"hideVisual": true}}`;
  let inputRequirementStr = null;

  const isFoodItem = Math.random() > 0.5;
  const contextItem = isFoodItem ? getRandomDivisibleFoods(1)[0] : getRandomDivisibleObjects(1)[0];
  const itemCapitalized = contextItem.charAt(0).toUpperCase() + contextItem.slice(1);

  // Base fraction generator (P3 friendly, easy base denominators like 2, 3, 4, 5)
  const getBaseFraction = () => {
    const bases = [
      { n: 1, d: 2 }, { n: 1, d: 3 }, { n: 2, d: 3 },
      { n: 1, d: 4 }, { n: 2, d: 4 }, { n: 3, d: 4 },
      { n: 1, d: 5 }, { n: 2, d: 5 }, { n: 3, d: 5 }, { n: 4, d: 5 }
    ];
    return bases[Math.floor(Math.random() * bases.length)];
  };

  // Generate multipliers (2, 3, 4)
  const multipliers = [2, 3, 4];
  let mult = multipliers[Math.floor(Math.random() * multipliers.length)];
  let base = getBaseFraction();
  
  // ensure target denominator isn't too large for visual models
  while (base.d * mult > 16) {
    base = getBaseFraction();
    mult = multipliers[Math.floor(Math.random() * multipliers.length)];
  }

  const targetN = base.n * mult;
  const targetD = base.d * mult;

  // Visual model generator helper
  const createBarModel = (num, denom, label, wholeValue = "", showBracket = false, bracketValue = "") => {
    let parts = [];
    parts.push({ segments: num, layoutSize: num, bgClass: "bg-blue-500 text-white" });
    if (denom - num > 0) {
      parts.push({ segments: denom - num, layoutSize: denom - num, bgClass: "bg-slate-200 text-slate-400" });
    }
    
    let model = {
      modelType: "PART_WHOLE",
      parts: parts,
      barLabel: label,
      isStatic: true
    };

    if (wholeValue) {
      model.whole = wholeValue;
    }
    
    if (showBracket) {
      model.topBrackets = [{ size: num, label: bracketValue }];
    }
    
    return model;
  };

  if (activeVariant === 'foundation_visual_forward_numerator') {
    answer = `${targetN}/${targetD}`;

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_MODEL",
      componentData: {
        models: [
          createBarModel(base.n, base.d, `First ${itemCapitalized}`, String(base.d)),
          createBarModel(targetN, targetD, `Second ${itemCapitalized}`, String(targetD), true, `?`)
        ]
      }
    });

    if (isMCQ) {
      askText = `Look at the models. What is the missing numerator?\\n${base.n}/${base.d} = [ ]/${targetD}`;
      const dist1 = `${targetN + 1}/${targetD}`;
      const dist2 = `${targetN - 1 || 1}/${targetD}`;
      const dist3 = `${targetN + 2}/${targetD}`;
      mcqOptions = [answer, dist1, dist2, dist3].sort(() => 0.5 - Math.random());
      
      solutionSteps = [
        `Count the number of shaded parts in the second model.`,
        `There are ${targetN} shaded parts out of ${targetD} total parts.`,
        `So, ${base.n}/${base.d} = ${targetN}/${targetD}.`,
        `The equivalent fraction is ${answer}.`
      ];
      hint = `Count the shaded parts in the second bar!`;
    } else {
      let structText = `STORY: Create a creative short story word problem for a Primary 3 student where ${names[0]} has ${getArticle(contextItem)} ${contextItem} cut into ${base.d} equal pieces and interacts with (e.g. eats, uses, paints) ${base.n} piece(s). Another identical ${contextItem} is cut into ${targetD} equal pieces. The final sentence MUST EXACTLY be: "How many pieces must be used to match? Write the equivalent fraction." CRITICAL: DO NOT state the answer in the story.`;
      let shortText = `Look at the models. What is the missing numerator?\\n${base.n}/${base.d} = [ ]/${targetD}. Write the equivalent fraction.`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Look at the second model. How many pieces are shaded?`, expectedAnswer: String(targetN) },
            { label: `What is the equivalent fraction for ${base.n}/${base.d}?`, expectedAnswer: answer }
          ]
        });
      }

      askText = getQText(structText, shortText);
      hint = `Count the shaded pieces in the second model to find the missing numerator!`;
      solutionSteps = [
        `Look at the second model to find the missing numerator.`,
        `There are ${targetN} shaded pieces out of ${targetD} total pieces.`,
        `So, ${targetN} pieces must be shaded to match.`,
        `The equivalent fraction is ${answer}.`
      ];
    }
  } else if (activeVariant === 'foundation_visual_forward_denominator') {
    answer = `${targetN}/${targetD}`;

    let secondModel = createBarModel(targetN, targetD, `Second ${itemCapitalized}`, "?");
    secondModel.bottomBrackets = [{ size: targetD, label: `TOTAL: ${targetD}` }];

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_MODEL",
      componentData: {
        models: [
          createBarModel(base.n, base.d, `First ${itemCapitalized}`, String(base.d)),
          secondModel
        ]
      }
    });

    if (isMCQ) {
      askText = `Look at the models. What is the missing denominator?\\n${base.n}/${base.d} = ${targetN}/[ ]`;
      const dist1 = `${targetN}/${targetD + 1}`;
      const dist2 = `${targetN}/${targetD - 1}`;
      const dist3 = `${targetN}/${targetD + 2}`;
      mcqOptions = [answer, dist1, dist2, dist3].sort(() => 0.5 - Math.random());
      
      solutionSteps = [
        `Count the total number of parts in the second model.`,
        `There are ${targetD} total parts.`,
        `So, ${base.n}/${base.d} = ${targetN}/${targetD}.`,
        `The equivalent fraction is ${answer}.`
      ];
      hint = `Count the total number of parts (both shaded and unshaded) in the second bar!`;
    } else {
      let structText = `STORY: Create a creative short story word problem for a Primary 3 student where ${names[0]} interacts with (e.g. eats, uses, paints) ${base.n}/${base.d} of ${getArticle(contextItem)} ${contextItem}. They want to write an equivalent fraction with a numerator of ${targetN}. The final sentence MUST EXACTLY be: "Look at the model. What should the denominator be? Write the equivalent fraction." CRITICAL: DO NOT state the answer in the story.`;
      let shortText = `Look at the models. What is the missing denominator?\\n${base.n}/${base.d} = ${targetN}/[ ]. Write the equivalent fraction.`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Look at the second model. How many total pieces are there?`, expectedAnswer: String(targetD) },
            { label: `What is the equivalent fraction for ${base.n}/${base.d}?`, expectedAnswer: answer }
          ]
        });
      }

      askText = getQText(structText, shortText);
      hint = `Count the total number of parts in the second model to find the missing denominator!`;
      solutionSteps = [
        `Look at the second model to find the missing denominator.`,
        `There are ${targetN} shaded pieces and ${targetD} total pieces.`,
        `So, the denominator should be ${targetD}.`,
        `The equivalent fraction is ${answer}.`
      ];
    }
  } else if (activeVariant === 'foundation_arrow_diagram_multiply') {
    answer = `${targetN}/${targetD}`;

    visualEngineStr = JSON.stringify({
      componentToRender: "FRACTION_EQUIVALENCE",
      componentData: {
        before: { num: base.n, denom: base.d },
        after: { num: "?", denom: "?" },
        operator: "x",
        factor: String(mult)
      }
    });

    if (isMCQ) {
      askText = `If you multiply the numerator and denominator of ${base.n}/${base.d} by ${mult}, what fraction do you get?`;
      const dist1 = `${targetN}/${base.d}`;
      const dist2 = `${base.n}/${targetD}`;
      const dist3 = `${targetN + 1}/${targetD + 1}`;
      mcqOptions = [answer, dist1, dist2, dist3].sort(() => 0.5 - Math.random());
      
      solutionSteps = [
        `Multiply the numerator by ${mult}: ${base.n} x ${mult} = ${targetN}`,
        `Multiply the denominator by ${mult}: ${base.d} x ${mult} = ${targetD}`,
        `The equivalent fraction is ${answer}.`
      ];
      hint = `Follow the arrows! Multiply both the top number and the bottom number by ${mult}.`;
    } else {
      let structText = `STORY: Create a creative short story word problem for a Primary 3 student where ${names[0]} has a fraction ${base.n}/${base.d}. To find an equivalent fraction, they multiply the numerator and denominator by ${mult}. The final sentence MUST EXACTLY be: "Write down the equivalent fraction they get." CRITICAL: DO NOT state the answer in the story.`;
      let shortText = `Multiply the top and bottom of ${base.n}/${base.d} by ${mult}. What is the equivalent fraction?`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `What is the new numerator? (${base.n} x ${mult})`, expectedAnswer: String(targetN) },
            { label: `What is the new denominator? (${base.d} x ${mult})`, expectedAnswer: String(targetD) },
            { label: `What is the equivalent fraction?`, expectedAnswer: answer }
          ]
        });
      }

      askText = getQText(structText, shortText);
      hint = `Follow the arrows! Multiply both the top number and the bottom number by ${mult}.`;
      solutionSteps = [
        `Multiply the numerator by ${mult}: ${base.n} x ${mult} = ${targetN}`,
        `Multiply the denominator by ${mult}: ${base.d} x ${mult} = ${targetD}`,
        `The equivalent fraction is ${answer}.`
      ];
    }
  } else if (activeVariant === 'foundation_subdivided_bar') {
    answer = `${targetN}/${targetD}`;

    const subdividedContexts = [
      {
        name: "Chocolate Bar",
        action: "eaten",
        template: `${names[0]} has a large chocolate bar with ${base.d} long rows. ${base.n} row(s) are eaten. Each long row is actually made of ${mult} smaller chocolate blocks.`
      },
      {
        name: "Pizza",
        action: "eaten",
        template: `${names[0]} buys a pizza cut into ${base.d} large slices. They eat ${base.n} of them. They realize each large slice can be cut into ${mult} smaller bite-sized pieces.`
      },
      {
        name: "Community Garden",
        action: "planted",
        template: `A community garden is divided into ${base.d} large plots. ${base.n} plot(s) are planted with carrots. Each large plot is further divided into ${mult} small planting squares.`
      },
      {
        name: "Bookshelf",
        action: "painted",
        template: `A wooden shelf has ${base.d} long tiers. ${base.n} tier(s) are painted blue. Each tier is divided by wooden panels into ${mult} smaller cubbies.`
      }
    ];
    const selectedContext = subdividedContexts[Math.floor(Math.random() * subdividedContexts.length)];

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_MODEL",
      componentData: {
        models: [
          {
            modelType: "PART_WHOLE",
            parts: [
              { segments: base.n, layoutSize: base.n, bgClass: "bg-blue-500 text-white", subdividedParts: mult },
              { segments: base.d - base.n, layoutSize: base.d - base.n, bgClass: "bg-slate-200 text-slate-400", subdividedParts: mult }
            ],
            barLabel: isMCQ ? "Subdivided" : selectedContext.name,
            isStatic: true
          }
        ]
      }
    });

    if (isMCQ) {
      askText = `Which equivalent fraction matches the subdivided model?`;
      const dist1 = `${targetN}/${base.d}`;
      const dist2 = `${base.n}/${targetD}`;
      const dist3 = `${targetN + 1}/${targetD + 1}`;
      mcqOptions = [answer, dist1, dist2, dist3].sort(() => 0.5 - Math.random());
      
      solutionSteps = [
        `The original model had ${base.d} parts and ${base.n} was shaded.`,
        `Each part is cut into ${mult} smaller parts.`,
        `Now there are ${targetD} total parts, and ${targetN} are shaded.`,
        `The equivalent fraction is ${answer}.`
      ];
      hint = `Count the new total number of small parts, and the new number of small shaded parts!`;
    } else {
      let structText = `STRICT: Keep the mathematical sentences EXACTLY as they are! DO NOT paraphrase, reword, or use advanced vocabulary. Use this exact story: "${selectedContext.template} Write the equivalent fraction that shows the ${selectedContext.action} part now." CRITICAL: DO NOT state the answer in the story.`;
      let shortText = `Look at the model. Write the equivalent fraction for ${base.n}/${base.d}.`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `How many small ${selectedContext.action} parts are there now?`, expectedAnswer: String(targetN) },
            { label: `How many small parts are there in total now?`, expectedAnswer: String(targetD) },
            { label: `Write the equivalent fraction.`, expectedAnswer: answer }
          ]
        });
      }

      askText = getQText(structText, shortText);
      hint = `Count the new total number of small parts, and the new number of small ${selectedContext.action} parts!`;
      solutionSteps = [
        `The original whole had ${base.d} large parts and ${base.n} was ${selectedContext.action}.`,
        `Each large part is cut into ${mult} smaller parts.`,
        `Now there are ${targetD} total small parts, and ${targetN} are ${selectedContext.action}.`,
        `The equivalent fraction is ${answer}.`
      ];
    }
  } else if (activeVariant === 'foundation_true_false_missing_match') {
    const isTrue = Math.random() > 0.5;
    
    let multN = mult;
    let multD = mult;
    
    if (!isTrue) {
      if (Math.random() > 0.5) {
        multN = mult === 2 ? 3 : (mult === 3 ? 4 : 2);
      } else {
        multD = mult === 2 ? 3 : (mult === 3 ? 4 : 2);
      }
    }

    let providedN = base.n * multN;
    let providedD = base.d * multD;
    
    answer = isTrue ? "True" : "False";

    visualEngineStr = JSON.stringify({
      componentToRender: "FRACTION_EQUIVALENCE",
      componentData: {
        before: { num: base.n, denom: base.d },
        after: { num: providedN, denom: providedD },
        operator: "x",
        factor: "?"
      }
    });

    if (isMCQ) {
      askText = `Which of these equations is correct?`;
      const wrongAns1 = `${base.n}/${base.d} = ${base.n * 2}/${base.d * 3}`;
      const wrongAns2 = `${base.n}/${base.d} = ${base.n * 3}/${base.d * 2}`;
      
      const correctAnsStr = `${base.n}/${base.d} = ${targetN}/${targetD}`;
      answer = correctAnsStr;
      
      visualEngineStr = `{"componentToRender": "NONE", "componentData": {"hideVisual": true}}`;
      
      mcqOptions = [answer, wrongAns1, wrongAns2].sort(() => 0.5 - Math.random());
      
      solutionSteps = [
        `Check each equation to see if the top and bottom were multiplied by the same number.`,
        `For ${correctAnsStr}, both numerator and denominator are multiplied by ${mult}.`,
        `Therefore, ${answer} is the correct equation.`
      ];
      hint = `Check each equation! The numerator and denominator must be multiplied by the exact same number.`;
    } else {
      let structText = `STORY: Create a creative short story word problem for a Primary 3 student where ${names[0]} writes the equation ${base.n}/${base.d} = ${providedN}/${providedD} on the whiteboard. The final sentence MUST EXACTLY be: "Look at the arrow diagram. Is their equation correct? (Write True or False)" CRITICAL: DO NOT state the answer in the story. CRITICAL: In the visualEngine JSON, you MUST keep "factor": "?" exactly as "?". DO NOT solve or change it to a number!`;
      let shortText = `Is the equation ${base.n}/${base.d} = ${providedN}/${providedD} correct? (Write True or False)`;

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `What do you multiply the numerator ${base.n} by to get ${providedN}?`, expectedAnswer: String(multN) },
            { label: `What do you multiply the denominator ${base.d} by to get ${providedD}?`, expectedAnswer: String(multD) },
            { label: `Is the equation ${base.n}/${base.d} = ${providedN}/${providedD} correct? (Write True or False)`, expectedAnswer: answer }
          ]
        });
      }

      askText = getQText(structText, shortText);
      hint = `Find the multiplier for the top, and the multiplier for the bottom. If they are the same, the equation is True!`;
      solutionSteps = [
        `Check the numerator: ${base.n} x ${multN} = ${providedN}.`,
        `Check the denominator: ${base.d} x ${multD} = ${providedD}.`,
        isTrue ? `Both are multiplied by the same number.` : `They are multiplied by different numbers.`,
        `The statement is ${answer}.`
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

  const aiPrompt = getFormatInstructions(visualEngineStr, inputRequirementStr)
    .replace('["string", "string"] (Array of strings for the full question text. Break into multiple lines if needed.)', JSON.stringify(askText.split('\\n')))
    .replace('["string", "string", "string", "string"] (ONLY if MCQ, otherwise empty array)', JSON.stringify(mcqOptions || []))
    .replace('{"distractor1": "Error category", "distractor2": "Error category"} (ONLY if MCQ, otherwise empty object)', JSON.stringify({}))
    .replace('"string (Pedagogical hint)"', JSON.stringify(hint))
    .replace('["string", "string"] (Array of strings for the step-by-step model solution. Use EXACTLY the characters \\\\n for any newlines inside strings if needed.)', JSON.stringify(solutionSteps).replace(/\\\\n/g, '\\n'))
    .replace('"string (The exact final answer)"', JSON.stringify(answer));

  return { aiPrompt };
};
