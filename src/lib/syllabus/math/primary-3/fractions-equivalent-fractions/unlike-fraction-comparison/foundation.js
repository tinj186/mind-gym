import { getRandomNames, getRandomDivisibleFoods, getRandomDivisibleObjects } from '@/lib/utils/variable-bank';

const getArticle = (word) => /^[aeiou]/i.test(word) ? 'an' : 'a';

export const foundationLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions) => {
  let askText = "";
  let hint = "";
  let solutionSteps = [];
  let answer = "";
  let mcqOptions = [];
  let defectMap = {};
  let visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: { hideVisual: true } });
  let inputRequirementStr = null;

  const names = getRandomNames(3);
  const contexts = getRandomDivisibleFoods(2);

  const getQText = (structText, shortText) => isStructure ? structText : (shortText || structText);

  // Helper to construct BAR_MODEL model
  const createBarModel = (num, denom, label) => ({
    modelType: "PART_WHOLE",
    parts: [
      { segments: num, layoutSize: num, bgClass: "bg-blue-500 text-white" },
      { segments: denom - num, layoutSize: denom - num, bgClass: "bg-slate-200 text-slate-400" }
    ],
    whole: String(denom),
    barLabel: label,
    topBrackets: [], // explicitly empty to avoid LLM hallucinations
    isStatic: true
  });

  if (activeVariant === 'foundation_visual_comparison_same_numerator') {
    // Same numerator, different denominators
    const pairs = [
      { n: 1, d1: 2, d2: 3 }, { n: 1, d1: 3, d2: 4 }, { n: 1, d1: 4, d2: 5 }, { n: 1, d1: 2, d2: 5 },
      { n: 2, d1: 3, d2: 5 }, { n: 2, d1: 3, d2: 7 }, { n: 3, d1: 4, d2: 5 }, { n: 3, d1: 4, d2: 8 },
      { n: 4, d1: 5, d2: 7 }, { n: 5, d1: 6, d2: 8 }
    ];
    const p = pairs[Math.floor(Math.random() * pairs.length)];
    const isFirstLarger = Math.random() > 0.5;
    const f1 = { n: p.n, d: isFirstLarger ? p.d1 : p.d2 };
    const f2 = { n: p.n, d: isFirstLarger ? p.d2 : p.d1 };
    
    // e.g. f1 = 2/3, f2 = 2/5 (f1 is greater)
    const askForGreater = Math.random() > 0.5;
    
    const greaterFrac = `${p.n}/${p.d1}`;
    const smallerFrac = `${p.n}/${p.d2}`;
    answer = askForGreater ? greaterFrac : smallerFrac;

    const item = contexts[0];
    
    let structText = `${names[0]} has two identical ${item}s. ${names[0]} cuts the first into ${f1.d} equal pieces and eats ${f1.n}. ${names[0]} cuts the second into ${f2.d} equal pieces and eats ${f2.n}. Which fraction represents the ${askForGreater ? 'larger' : 'smaller'} amount eaten?`;
    let shortText = `Which is ${askForGreater ? 'greater' : 'smaller'}: ${f1.n}/${f1.d} or ${f2.n}/${f2.d}?`;

    if (isMCQ) {
      mcqOptions = [`${f1.n}/${f1.d}`, `${f2.n}/${f2.d}`];
      shortText = `Which fraction is ${askForGreater ? 'greater' : 'smaller'}?`;
      structText = shortText;
    }

    if (isStructure) {
      inputRequirementStr = JSON.stringify({
        inputType: "MULTI_STEP_INPUT",
        steps: [
          { label: `Denominator that gives ${askForGreater ? 'larger' : 'smaller'} pieces`, expectedAnswer: askForGreater ? String(Math.min(f1.d, f2.d)) : String(Math.max(f1.d, f2.d)) },
          { label: `The ${askForGreater ? 'greater' : 'smaller'} fraction is`, expectedAnswer: answer }
        ]
      });
    }

    askText = getQText(structText, shortText);

    hint = `Look at the bar models. When the numerators are the same, the fraction with the smaller denominator is greater!`;
    
    solutionSteps = [
      `Both fractions have the same numerator (${p.n}).`,
      `A smaller denominator means the whole is divided into fewer, larger pieces.`,
      `Therefore, ${greaterFrac} is greater than ${smallerFrac}.`,
      `The ${askForGreater ? 'greater' : 'smaller'} fraction is ${answer}.`
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_MODEL",
      componentData: {
        models: [
          createBarModel(f1.n, f1.d, `First ${item} (${f1.n}/${f1.d})`),
          createBarModel(f2.n, f2.d, `Second ${item} (${f2.n}/${f2.d})`)
        ]
      }
    });

  } else if (activeVariant === 'foundation_visual_comparison_related_denominators') {
    // Related denominators (one is multiple of other)
    const pairs = [
      { f1: {n: 1, d: 2}, f2: {n: 3, d: 8} }, // 1/2 vs 3/8
      { f1: {n: 1, d: 2}, f2: {n: 5, d: 8} }, // 1/2 vs 5/8
      { f1: {n: 1, d: 3}, f2: {n: 2, d: 9} }, // 1/3 vs 2/9
      { f1: {n: 1, d: 4}, f2: {n: 3, d: 8} }, // 1/4 vs 3/8
      { f1: {n: 2, d: 3}, f2: {n: 5, d: 9} }, // 2/3 vs 5/9
      { f1: {n: 3, d: 4}, f2: {n: 5, d: 8} }, // 3/4 vs 5/8
    ];
    const p = pairs[Math.floor(Math.random() * pairs.length)];
    const isFirstF1 = Math.random() > 0.5;
    const first = isFirstF1 ? p.f1 : p.f2;
    const second = isFirstF1 ? p.f2 : p.f1;
    
    const val1 = first.n / first.d;
    const val2 = second.n / second.d;
    
    let structText, shortText;
    
    const contexts = getRandomDivisibleFoods(2);
    const item = contexts[0];
    
    if (isMCQ) {
      structText = `Look at the visual models. Which statement is true?`;
      shortText = structText;
      const strF1 = `${p.f1.n}/${p.f1.d}`;
      const strF2 = `${p.f2.n}/${p.f2.d}`;
      const isF1Greater = val1 > val2; // p.f1 > p.f2
      
      const correctStmt = isF1Greater ? `${strF1} is greater than ${strF2}` : `${strF1} is less than ${strF2}`;
      const wrongStmt1 = isF1Greater ? `${strF1} is less than ${strF2}` : `${strF1} is greater than ${strF2}`;
      const wrongStmt2 = `${strF1} is equal to ${strF2}`;
      
      answer = correctStmt;
      mcqOptions = [correctStmt, wrongStmt1, wrongStmt2];
      
      solutionSteps = [
        `Look at the shaded regions in the bar models.`,
        `The shaded region for ${isF1Greater ? strF1 : strF2} is longer than the shaded region for ${isF1Greater ? strF2 : strF1}.`,
        `So, ${correctStmt} is true.`
      ];
    } else {
      const askForGreater = Math.random() > 0.5;
      answer = askForGreater 
        ? (val1 > val2 ? `${first.n}/${first.d}` : `${second.n}/${second.d}`)
        : (val1 < val2 ? `${first.n}/${first.d}` : `${second.n}/${second.d}`);
      
      const scenarios = [
        `${names[0]} and ${names[1]} have identical ${item}s. ${names[0]} eats ${first.n}/${first.d} of their ${item} and ${names[1]} eats ${second.n}/${second.d} of their ${item}. Which fraction represents the ${askForGreater ? 'larger' : 'smaller'} amount eaten?`,
        `${names[0]} buys ${getArticle(item)} ${item} and eats ${first.n}/${first.d} of it. ${names[1]} buys an identical ${item} and eats ${second.n}/${second.d} of it. Which fraction represents the ${askForGreater ? 'larger' : 'smaller'} amount eaten?`,
        `Two identical ${item}s are cut into pieces. ${names[0]} takes ${first.n}/${first.d} of one ${item}, while ${names[1]} takes ${second.n}/${second.d} of the other. Which fraction represents the ${askForGreater ? 'larger' : 'smaller'} portion?`
      ];
      structText = scenarios[Math.floor(Math.random() * scenarios.length)];
      shortText = `Which is ${askForGreater ? 'greater' : 'smaller'}: ${first.n}/${first.d} or ${second.n}/${second.d}?`;
      
      const scaledNumerator = p.f1.n * (p.f2.d / p.f1.d);
      
      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Look at the models or multiply to find the equivalent fraction for ${p.f1.n}/${p.f1.d}:`, expectedAnswer: `${scaledNumerator}/${p.f2.d}` },
            { label: `Compare ${scaledNumerator}/${p.f2.d} and ${p.f2.n}/${p.f2.d}. Which fraction is ${askForGreater ? 'greater' : 'smaller'}?`, expectedAnswer: answer }
          ]
        });
      }

      const targetNumerator = askForGreater ? Math.max(scaledNumerator, p.f2.n) : Math.min(scaledNumerator, p.f2.n);
      solutionSteps = [
        `First, convert ${p.f1.n}/${p.f1.d} to an equivalent fraction with denominator ${p.f2.d}.`,
        `${p.f1.n}/${p.f1.d} = ${p.f1.n * (p.f2.d/p.f1.d)}/${p.f2.d}.`,
        `Now compare ${p.f1.n * (p.f2.d/p.f1.d)}/${p.f2.d} and ${p.f2.n}/${p.f2.d}.`,
        `Since ${targetNumerator} is the ${askForGreater ? 'larger' : 'smaller'} numerator, ${answer} is the ${askForGreater ? 'greater' : 'smaller'} fraction.`
      ];
    }
    
    askText = getQText(structText, shortText);
    hint = `Convert ${p.f1.n}/${p.f1.d} into an equivalent fraction with denominator ${p.f2.d} first, then compare the numerators!`;

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_MODEL",
      componentData: {
        models: [
          createBarModel(first.n, first.d, isMCQ ? `Fraction 1 (${first.n}/${first.d})` : `First ${item} (${first.n}/${first.d})`),
          createBarModel(second.n, second.d, isMCQ ? `Fraction 2 (${second.n}/${second.d})` : `Second ${item} (${second.n}/${second.d})`)
        ]
      }
    });

  } else if (activeVariant === 'foundation_benchmark_half') {
    // Benchmark 1/2, 1/3, 1/4
    const benchmarks = [
      { 
        bench: { n: 1, d: 2 },
        pairs: [
          { n: 2, d: 6 }, { n: 3, d: 8 }, { n: 5, d: 12 }, { n: 4, d: 10 }, // less
          { n: 4, d: 6 }, { n: 5, d: 8 }, { n: 7, d: 12 }, { n: 6, d: 10 }  // more
        ]
      },
      {
        bench: { n: 1, d: 3 },
        pairs: [
          { n: 1, d: 6 }, { n: 2, d: 9 }, { n: 3, d: 12 }, // less
          { n: 3, d: 6 }, { n: 4, d: 9 }, { n: 5, d: 12 }  // more
        ]
      },
      {
        bench: { n: 1, d: 4 },
        pairs: [
          { n: 1, d: 8 }, { n: 2, d: 12 }, // less
          { n: 3, d: 8 }, { n: 4, d: 12 }, { n: 5, d: 12 } // more
        ]
      }
    ];
    
    const selectedBenchGroup = benchmarks[Math.floor(Math.random() * benchmarks.length)];
    const bench = selectedBenchGroup.bench;
    const p = selectedBenchGroup.pairs[Math.floor(Math.random() * selectedBenchGroup.pairs.length)];
    const val = p.n / p.d;
    const benchVal = bench.n / bench.d;
    const isGreater = val > benchVal;
    
    const fractionStr = `${p.n}/${p.d}`;
    const benchStr = `${bench.n}/${bench.d}`;
    
    let structText, shortText;
    
    if (isMCQ) {
      structText = `Which of these fractions is ${isGreater ? 'greater' : 'less'} than ${benchStr}?`;
      shortText = structText;
      answer = fractionStr;
      
      const wrongPairs = selectedBenchGroup.pairs.filter(pair => (pair.n / pair.d > benchVal) !== isGreater);
      const selectedWrong = wrongPairs.sort(() => 0.5 - Math.random()).slice(0, 3).map(pair => `${pair.n}/${pair.d}`);
      mcqOptions = [answer, ...selectedWrong];
      
      solutionSteps = [
        `Use ${benchStr} as a benchmark.`,
        `The equivalent of ${benchStr} with denominator ${p.d} is ${(p.d / bench.d) * bench.n}/${p.d}.`,
        `Since ${p.n} is ${isGreater ? 'greater' : 'less'} than ${(p.d / bench.d) * bench.n}, ${fractionStr} is ${isGreater ? 'greater' : 'less'} than ${benchStr}.`,
        `The correct fraction is ${answer}.`
      ];
      
      visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: { hideVisual: true } });
      hint = `Convert ${benchStr} to an equivalent fraction with denominator ${p.d} to easily compare!`;
      
    } else {
      answer = isGreater ? "more" : "less";
      const item = getRandomDivisibleObjects(1)[0];
      
      structText = `A craft project requires ${benchStr} of ${getArticle(item)} ${item}. ${names[0]} cuts ${fractionStr} of ${getArticle(item)} ${item}. Did ${names[0]} cut more or less than the project requires?`;
      shortText = `Is ${fractionStr} greater than or less than ${benchStr}? (Answer "more" or "less")`;
      
      if (isStructure) {
        const equivalentNumerator = (p.d / bench.d) * bench.n;
        const equivalentFraction = `${equivalentNumerator}/${p.d}`;
        
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `To compare ${fractionStr} to ${benchStr}, first find the equivalent fraction for ${benchStr}. What is ${benchStr} with a denominator of ${p.d}?`, expectedAnswer: equivalentFraction },
            { label: `Compare ${fractionStr} and ${equivalentFraction}. Did ${names[0]} cut more or less?`, expectedAnswer: answer }
          ]
        });
      }

      solutionSteps = [
        `Compare ${fractionStr} to ${benchStr}.`,
        `Look at the models. The shaded part for ${fractionStr} is ${isGreater ? 'longer' : 'shorter'} than the shaded part for ${benchStr}.`,
        `So, ${fractionStr} is ${answer} than ${benchStr}.`
      ];
      
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          models: [
            createBarModel(bench.n, bench.d, `${benchStr} (Required)`),
            createBarModel(p.n, p.d, `${fractionStr} (Cut)`)
          ]
        }
      });
      hint = `Look at the bar models to see which shaded part is longer!`;
    }
    
    askText = getQText(structText, shortText);

  } else if (activeVariant === 'foundation_ordering_same_numerator') {
    // Ordering 3 Fractions, Same Numerator
    const groups = [
      { n: 2, dList: [3, 5, 7] },
      { n: 3, dList: [4, 5, 8] },
      { n: 4, dList: [5, 7, 9] },
      { n: 5, dList: [6, 8, 12] }
    ];
    const g = groups[Math.floor(Math.random() * groups.length)];
    const fractions = g.dList.map(d => ({ n: g.n, d })); // already sorted largest to smallest pieces (smallest to largest denom)
    
    // Shuffle for presentation
    const shuffled = [...fractions].sort(() => 0.5 - Math.random());
    const strList = shuffled.map(f => `${f.n}/${f.d}`).join(', ');
    
    const askSmallestToGreatest = Math.random() > 0.5;
    
    let sortedList;
    if (askSmallestToGreatest) {
      sortedList = [...fractions].reverse(); // smallest piece first (largest denom)
    } else {
      sortedList = [...fractions]; // largest piece first (smallest denom)
    }
    
    answer = sortedList.map(f => `${f.n}/${f.d}`).join(', ');
    
    const item = getRandomDivisibleFoods(1)[0];
    
    let structText, shortText;
    if (isMCQ) {
      structText = `Which list shows the fractions in order from ${askSmallestToGreatest ? 'smallest to greatest' : 'greatest to smallest'}?\\nFractions: ${strList}`;
      shortText = structText;
      
      const wrong1 = [...fractions].map(f => `${f.n}/${f.d}`).join(', '); // greatest to smallest
      const wrong2 = [...fractions].reverse().map(f => `${f.n}/${f.d}`).join(', '); // smallest to greatest
      const wrong3 = [shuffled[0], shuffled[2], shuffled[1]].map(f => `${f.n}/${f.d}`).join(', ');
      const wrong4 = [shuffled[1], shuffled[0], shuffled[2]].map(f => `${f.n}/${f.d}`).join(', ');
      
      mcqOptions = Array.from(new Set([answer, wrong1, wrong2, wrong3, wrong4])).slice(0, 4);
    } else {
      structText = `Three friends have identical ${item}s. ${names[0]} eats ${shuffled[0].n}/${shuffled[0].d}, ${names[1]} eats ${shuffled[1].n}/${shuffled[1].d}, and ${names[2]} eats ${shuffled[2].n}/${shuffled[2].d}. Arrange the fractions starting from the ${askSmallestToGreatest ? 'smallest' : 'greatest'} amount eaten. (e.g. 1/2, 1/3, 1/4)`;
      shortText = `Arrange these fractions from ${askSmallestToGreatest ? 'smallest to greatest' : 'greatest to smallest'}: ${strList}`;
      
      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Look at the models. The fraction with the ${askSmallestToGreatest ? 'shortest' : 'longest'} shaded part is:`, expectedAnswer: `${sortedList[0].n}/${sortedList[0].d}` },
            { label: `Arrange the fractions starting from the ${askSmallestToGreatest ? 'smallest' : 'greatest'}:`, expectedAnswer: answer }
          ]
        });
      }
    }
    
    askText = getQText(structText, shortText);
    hint = `When numerators are the same, the fraction with the largest denominator is the smallest!`;
    
    solutionSteps = [
      `The numerators are all the same (${g.n}).`,
      `A larger denominator means the whole is cut into more pieces, so each piece is smaller.`,
      `The fractions from smallest to greatest are: ${[...fractions].reverse().map(f => `${f.n}/${f.d}`).join(', ')}.`,
      `The required order is: ${answer}.`
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_MODEL",
      componentData: {
        models: shuffled.map((f, i) => createBarModel(f.n, f.d, isMCQ ? `Fraction ${i+1} (${f.n}/${f.d})` : `${names[i]}'s ${item} (${f.n}/${f.d})`))
      }
    });

  } else if (activeVariant === 'foundation_visual_equivalence_true_false') {
    // True/False Visual Equivalence
    const pairs = [
      { f1: {n: 2, d: 3}, f2: {n: 5, d: 9}, realIsF1Greater: true },
      { f1: {n: 3, d: 4}, f2: {n: 5, d: 8}, realIsF1Greater: true },
      { f1: {n: 1, d: 2}, f2: {n: 5, d: 12}, realIsF1Greater: true },
      { f1: {n: 2, d: 5}, f2: {n: 1, d: 2}, realIsF1Greater: false },
      { f1: {n: 3, d: 8}, f2: {n: 1, d: 2}, realIsF1Greater: false }
    ];
    const p = pairs[Math.floor(Math.random() * pairs.length)];
    
    const statementSaysF1Greater = Math.random() > 0.5;
    const isTrue = statementSaysF1Greater === p.realIsF1Greater;
    
    answer = isTrue ? "True" : "False";
    
    const strF1 = `${p.f1.n}/${p.f1.d}`;
    const strF2 = `${p.f2.n}/${p.f2.d}`;
    const greaterFraction = p.realIsF1Greater ? strF1 : strF2;
    
    const item = getRandomDivisibleFoods(1)[0];
    
    let structText, shortText;
    if (isMCQ) {
      structText = `Which of the following statements about the visual models is correct?`;
      shortText = structText;
      
      const correctStmt = p.realIsF1Greater ? `${strF1} is greater than ${strF2}` : `${strF1} is less than ${strF2}`;
      const wrongStmt1 = p.realIsF1Greater ? `${strF1} is less than ${strF2}` : `${strF1} is greater than ${strF2}`;
      const wrongStmt2 = `${strF1} is equal to ${strF2}`;
      
      answer = correctStmt;
      mcqOptions = [correctStmt, wrongStmt1, wrongStmt2];
    } else {
      structText = `${names[0]} says that ${strF1} of ${getArticle(item)} ${item} is ${statementSaysF1Greater ? 'greater' : 'less'} than ${strF2} of an identical ${item}. Look at the models. Is ${names[0]} correct? Write True or False.`;
      shortText = `Look at the models. True or False: ${strF1} is ${statementSaysF1Greater ? 'greater' : 'less'} than ${strF2}.`;
      
      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Look at the models. Which fraction has the longer shaded part?`, expectedAnswer: greaterFraction },
            { label: `Is the statement True or False?`, expectedAnswer: answer }
          ]
        });
      }
    }
    
    askText = getQText(structText, shortText);
    hint = `Look at the shaded regions in the models to see which fraction is actually greater.`;
    
    solutionSteps = [
      `Look at the models for ${strF1} and ${strF2}.`,
      `The shaded part for ${greaterFraction} is longer.`,
      `Therefore, ${strF1} is ${p.realIsF1Greater ? 'greater' : 'less'} than ${strF2}.`,
      isMCQ ? `The correct statement is: ${answer}.` : `The statement is ${answer}.`
    ];

    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_MODEL",
      componentData: {
        models: [
          createBarModel(p.f1.n, p.f1.d, isMCQ ? `Fraction 1 (${strF1})` : `First ${item} (${strF1})`),
          createBarModel(p.f2.n, p.f2.d, isMCQ ? `Fraction 2 (${strF2})` : `Second ${item} (${strF2})`)
        ]
      }
    });
  }

  if (!isMCQ && !inputRequirementStr) {
    if (answer === "True" || answer === "False" || answer === "greater" || answer === "less") {
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    } else {
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }
  } else if (isMCQ) {
    inputRequirementStr = `null`;
  }

  const aiPrompt = `
You are an expert Primary 3 math teacher.
Generate a valid JSON object representing a math question.

CRITICAL INSTRUCTIONS:
- questionText: MUST be an array of strings. Break the question into multiple lines if needed.
- ${isStructure ? (inputRequirementStr && inputRequirementStr.includes('MULTI_STEP_INPUT') ? 'The output MUST match the MULTI_STEP format specified below.' : 'Use TEXT_INPUT format.') : (isMCQ ? 'The output MUST provide the multiple choice options.' : 'The output MUST NOT provide options or multi-step input.')}
- EXACTLY use the following text as the question:
  ${askText}
- EXACTLY use the following as the finalAnswer:
  "${answer}"
- Use the following steps for the solution (do NOT add numbers like "1." yourself, just use the strings directly):
  ${JSON.stringify(solutionSteps)}
- Use the following hint:
  "${hint}"
${isMCQ ? `- EXACTLY use these options: ${JSON.stringify(mcqOptions)}` : ''}
- Do NOT modify the \`visualEngine\` object in any way. Keep it exactly as provided in the instructions below.

${getFormatInstructions(visualEngineStr, inputRequirementStr)}
  `;

  return { aiPrompt };
};
