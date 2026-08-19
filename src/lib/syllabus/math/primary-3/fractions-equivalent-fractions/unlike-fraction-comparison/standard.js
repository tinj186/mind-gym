import { getRandomNames, getRandomDivisibleFoods, getRandomColors, getRandomDivisibleObjects } from '@/lib/utils/variable-bank';

const getArticle = (word) => /^[aeiou]/i.test(word) ? 'an' : 'a';

export const standardLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions) => {
  let askText = "";
  let hint = "";
  let solutionSteps = [];
  let answer = "";
  let mcqOptions = [];
  let defectMap = {};
  
  // No visual rendering for standard difficulty
  let visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: { hideVisual: true } });
  let inputRequirementStr = null;

  const names = getRandomNames(3);
  const getQText = (structText, shortText) => isStructure ? structText : (shortText || structText);

  if (activeVariant === 'standard_convert_compare') {
    const pairs = [
      { f1: {n: 1, d: 2}, f2: {n: 3, d: 8} },
      { f1: {n: 1, d: 2}, f2: {n: 5, d: 8} },
      { f1: {n: 1, d: 3}, f2: {n: 2, d: 9} },
      { f1: {n: 1, d: 4}, f2: {n: 3, d: 8} },
      { f1: {n: 1, d: 4}, f2: {n: 5, d: 12} },
      { f1: {n: 2, d: 3}, f2: {n: 5, d: 9} },
      { f1: {n: 2, d: 3}, f2: {n: 7, d: 12} },
      { f1: {n: 3, d: 4}, f2: {n: 5, d: 8} },
      { f1: {n: 3, d: 4}, f2: {n: 7, d: 12} }
    ];
    
    const p = pairs[Math.floor(Math.random() * pairs.length)];
    const isFirstF1 = Math.random() > 0.5;
    const first = isFirstF1 ? p.f1 : p.f2;
    const second = isFirstF1 ? p.f2 : p.f1;
    
    const val1 = first.n / first.d;
    const val2 = second.n / second.d;
    
    const askForGreater = Math.random() > 0.5;
    
    if (isMCQ) {
      const askForSmallest = Math.random() > 0.5;
      const threeFracSets = [
        [{n: 3, d: 4}, {n: 5, d: 8}, {n: 7, d: 12}],
        [{n: 1, d: 2}, {n: 3, d: 8}, {n: 5, d: 12}],
        [{n: 2, d: 3}, {n: 5, d: 6}, {n: 7, d: 12}],
        [{n: 1, d: 4}, {n: 5, d: 12}, {n: 1, d: 3}]
      ];
      
      const fSet = threeFracSets[Math.floor(Math.random() * threeFracSets.length)];
      const shuffledSet = [...fSet].sort(() => 0.5 - Math.random());
      
      const strList = shuffledSet.map(f => `${f.n}/${f.d}`).join(', ');
      askText = `Compare the fractions. Which is the ${askForSmallest ? 'smallest' : 'greatest'}?\nFractions: ${strList}`;
      
      const sortedByValue = [...shuffledSet].sort((a, b) => (a.n / a.d) - (b.n / b.d));
      const targetFrac = askForSmallest ? sortedByValue[0] : sortedByValue[sortedByValue.length - 1];
      answer = `${targetFrac.n}/${targetFrac.d}`;
      
      mcqOptions = shuffledSet.map(f => `${f.n}/${f.d}`);
      
      hint = `Find a common denominator for all fractions to compare them easily!`;
      solutionSteps = [
        `List the fractions: ${strList}.`,
        `Find equivalent fractions with a common denominator.`,
        `The ${askForSmallest ? 'smallest' : 'greatest'} fraction is ${answer}.`
      ];
    } else {
      answer = askForGreater 
        ? (val1 > val2 ? `${first.n}/${first.d}` : `${second.n}/${second.d}`)
        : (val1 < val2 ? `${first.n}/${first.d}` : `${second.n}/${second.d}`);
        
      const colors = getRandomColors(2);
      const item = getRandomDivisibleObjects(1)[0];
      
      let structText = `STORY: Create a creative short story word problem featuring characters ${names[0]} and ${names[1]}. A ${colors[0]} ${item} is ${first.n}/${first.d} of a metre long, and a ${colors[1]} ${item} is ${second.n}/${second.d} of a metre long. The final sentence of your story MUST EXACTLY be: "Which ${item} is ${askForGreater ? 'longer' : 'shorter'}?"`;
      let shortText = `Which is ${askForGreater ? 'greater' : 'smaller'}: ${first.n}/${first.d} or ${second.n}/${second.d}?`;
      
      if (isStructure) {
        const multiplier = p.f2.d / p.f1.d;
        const scaledNumerator = p.f1.n * multiplier;
        const equivalentFrac = `${scaledNumerator}/${p.f2.d}`;
        const answerColor = answer === `${first.n}/${first.d}` ? colors[0] : colors[1];
        
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Which fraction needs to be converted?`, expectedAnswer: `${p.f1.n}/${p.f1.d}` },
            { label: `Equivalent fraction for comparison:`, expectedAnswer: equivalentFrac },
            { label: `Which ${item} is ${askForGreater ? 'longer' : 'shorter'}? (Enter the color)`, expectedAnswer: answerColor }
          ]
        });
        answer = answerColor;
      }
      
      askText = getQText(structText, shortText);
      hint = `Convert ${p.f1.n}/${p.f1.d} to an equivalent fraction with denominator ${p.f2.d} to compare!`;
      solutionSteps = [
        `Convert ${p.f1.n}/${p.f1.d} to an equivalent fraction with denominator ${p.f2.d}.`,
        `${p.f1.n}/${p.f1.d} = ${p.f1.n * (p.f2.d/p.f1.d)}/${p.f2.d}.`,
        `Now compare the numerators.`,
        `The ${askForGreater ? (isStructure ? 'longer' : 'greater') : (isStructure ? 'shorter' : 'smaller')} one is ${answer}.`
      ];
    }
  } else if (activeVariant === 'standard_missing_sign') {
    const pairs = [
      { f1: {n: 1, d: 2}, f2: {n: 4, d: 8}, sym: '=' },
      { f1: {n: 1, d: 2}, f2: {n: 5, d: 8}, sym: '<' },
      { f1: {n: 1, d: 2}, f2: {n: 3, d: 8}, sym: '>' },
      { f1: {n: 3, d: 4}, f2: {n: 9, d: 12}, sym: '=' },
      { f1: {n: 3, d: 4}, f2: {n: 7, d: 12}, sym: '>' },
      { f1: {n: 5, d: 6}, f2: {n: 11, d: 12}, sym: '<' }
    ];
    
    const p = pairs[Math.floor(Math.random() * pairs.length)];
    const isFirstF1 = Math.random() > 0.5;
    const first = isFirstF1 ? p.f1 : p.f2;
    const second = isFirstF1 ? p.f2 : p.f1;
    
    let sym = p.sym;
    if (!isFirstF1 && sym === '>') sym = '<';
    else if (!isFirstF1 && sym === '<') sym = '>';
    
    const phraseMap = {
      '=': 'equal to',
      '>': 'greater than',
      '<': 'smaller than'
    };
    const phrase = phraseMap[sym];
    
    answer = phrase;
    const f1Str = `${first.n}/${first.d}`;
    const f2Str = `${second.n}/${second.d}`;
    
    if (isMCQ) {
      askText = `Which phrase makes the statement true? ${f1Str} is ________ ${f2Str}.`;
      mcqOptions = ['greater than', 'smaller than', 'equal to', 'none of the above'];
      solutionSteps = [
        `Compare ${f1Str} and ${f2Str}.`,
        `Find a common denominator.`,
        `Since the first fraction is ${phrase} the second fraction, the correct phrase is "${phrase}".`
      ];
      hint = `Change both fractions to have the same denominator, then compare them!`;
    } else {
      let structText = `STORY: Create a creative short story word problem featuring characters ${names[0]} and ${names[1]} comparing two identical items or measurements using fractions. Value 1 is ${f1Str} and Value 2 is ${f2Str}. The final sentence of your story MUST EXACTLY be: "Compare them by filling in the blank: ${f1Str} is ________ ${f2Str} (using greater than, smaller than, or equal to)."`;
      let shortText = `Fill in the blank with greater than, smaller than, or equal to: ${f1Str} is ________ ${f2Str}.`;
      
      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Which fraction needs to be converted?`, expectedAnswer: `${p.f1.n}/${p.f1.d}` },
            { label: `Equivalent fraction for comparison:`, expectedAnswer: `${p.f1.n * (p.f2.d/p.f1.d)}/${p.f2.d}` },
            { label: `Compare by writing greater than, smaller than, or equal to:`, expectedAnswer: answer }
          ]
        });
      }
      
      askText = getQText(structText, shortText);
      hint = `Find a common denominator to compare the weights!`;
      solutionSteps = [
        `Convert to a common denominator to compare.`,
        `${p.f1.n}/${p.f1.d} = ${p.f1.n * (p.f2.d/p.f1.d)}/${p.f2.d}.`,
        `Comparing the two, we see that the correct phrase is "${phrase}".`
      ];
    }
  } else if (activeVariant === 'standard_ordering_ascending' || activeVariant === 'standard_ordering_descending') {
    const isAscending = activeVariant === 'standard_ordering_ascending';
    
    const fractionSets = [
      [{n: 1, d: 2}, {n: 3, d: 4}, {n: 7, d: 8}],
      [{n: 1, d: 3}, {n: 5, d: 6}, {n: 11, d: 12}],
      [{n: 2, d: 5}, {n: 7, d: 10}, {n: 1, d: 2}],
      [{n: 1, d: 4}, {n: 5, d: 12}, {n: 1, d: 3}]
    ];
    
    const fSet = fractionSets[Math.floor(Math.random() * fractionSets.length)];
    const shuffledSet = [...fSet].sort(() => 0.5 - Math.random());
    const sortedSet = [...fSet].sort((a, b) => isAscending ? (a.n/a.d - b.n/b.d) : (b.n/b.d - a.n/a.d));
    
    const strList = shuffledSet.map(f => `${f.n}/${f.d}`).join(', ');
    answer = sortedSet.map(f => `${f.n}/${f.d}`).join(', ');
    
    if (isMCQ) {
      askText = `Which option shows the fractions arranged from ${isAscending ? 'smallest to greatest' : 'greatest to smallest'}?\nFractions: ${strList}`;
      
      const wrong1 = [...fSet].sort((a, b) => !isAscending ? (a.n/a.d - b.n/b.d) : (b.n/b.d - a.n/a.d)).map(f => `${f.n}/${f.d}`).join(', ');
      const wrong2 = [shuffledSet[0], shuffledSet[2], shuffledSet[1]].map(f => `${f.n}/${f.d}`).join(', ');
      const wrong3 = [shuffledSet[1], shuffledSet[0], shuffledSet[2]].map(f => `${f.n}/${f.d}`).join(', ');
      
      mcqOptions = Array.from(new Set([answer, wrong1, wrong2, wrong3])).slice(0, 4);
      while(mcqOptions.length < 4) { mcqOptions.push(strList); } // fallback
      
      solutionSteps = [
        `List the fractions: ${strList}.`,
        `Find a common denominator for all fractions to compare them.`,
        `Arrange them in ${isAscending ? 'increasing' : 'decreasing'} order.`,
        `The required order is: ${answer}.`
      ];
      hint = `Find a common denominator to compare and sort the fractions easily!`;
    } else {
      const item = getRandomDivisibleObjects(1)[0];
      let structText = `STORY: Create a creative short story word problem featuring characters ${names[0]} and ${names[1]} involving three amounts of ${item}. The amounts are ${shuffledSet[0].n}/${shuffledSet[0].d}, ${shuffledSet[1].n}/${shuffledSet[1].d}, and ${shuffledSet[2].n}/${shuffledSet[2].d}. The final sentence MUST EXACTLY be: "List the amounts from the ${isAscending ? 'least to the most' : 'greatest to the smallest'}."`;
      
      let shortText = `Arrange in ${isAscending ? 'increasing' : 'decreasing'} order: ${strList}.`;
      
      if (isStructure) {
        const maxD = Math.max(...shuffledSet.map(f => f.d));
        const fractionsToConvert = shuffledSet.filter(f => f.d !== maxD);
        const sortedFracsToConvert = [...fractionsToConvert].sort((a,b) => (a.n/a.d) - (b.n/b.d));
        const fracToConvertStr = sortedFracsToConvert.map(f => `${f.n}/${f.d}`).join(', ');
        const equivalentFractions = sortedFracsToConvert.map(f => {
          const multiplier = maxD / f.d;
          return `${f.n * multiplier}/${maxD}`;
        }).join(', ');

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Which two fractions need to be converted to a common denominator? (smallest to largest)`, expectedAnswer: fracToConvertStr },
            { label: `What are their equivalent fractions?`, expectedAnswer: equivalentFractions },
            { label: `List the amounts from the ${isAscending ? 'least to the most' : 'greatest to the smallest'}:`, expectedAnswer: answer }
          ]
        });
      }
      
      askText = getQText(structText, shortText);
      hint = `Find a common denominator for all fractions to compare them easily!`;
      solutionSteps = [
        `Convert all fractions to a common denominator.`,
        `Compare the numerators to arrange them.`,
        `The correct order is ${answer}.`
      ];
    }
  } else if (activeVariant === 'standard_odd_one_out') {
    const rules = [
      { text: 'greater than 1/2', val: 0.5 },
      { text: 'less than 1/2', val: 0.5 }
    ];
    const rule = rules[Math.floor(Math.random() * rules.length)];
    
    let fractions = [];
    if (rule.text === 'greater than 1/2') {
      fractions = [ {n: 5, d: 8, fits: true}, {n: 7, d: 12, fits: true}, {n: 4, d: 6, fits: true}, {n: 4, d: 10, fits: false} ];
    } else {
      fractions = [ {n: 3, d: 8, fits: true}, {n: 5, d: 12, fits: true}, {n: 2, d: 6, fits: true}, {n: 6, d: 10, fits: false} ];
    }
    
    const shuffled = [...fractions].sort(() => 0.5 - Math.random());
    const strList = shuffled.map(f => `${f.n}/${f.d}`).join(', ');
    const oddOne = shuffled.find(f => !f.fits);
    answer = `${oddOne.n}/${oddOne.d}`;
    
    if (isMCQ) {
      askText = `Which of these fractions is NOT ${rule.text}?\nFractions: ${strList}`;
      mcqOptions = shuffled.map(f => `${f.n}/${f.d}`);
      solutionSteps = [
        `Compare each fraction to 1/2.`,
        `Find half of each denominator to check if the numerator is greater or smaller.`,
        `The only fraction that does not fit the rule is ${answer}.`
      ];
      hint = `Check each fraction one by one against the rule!`;
    } else {
      let shortText = `Which of these fractions is NOT ${rule.text}: ${strList}?`;
      
      if (isStructure) {
        const subset = shuffled.slice(0, 3);
        if (!subset.includes(oddOne)) {
          subset[0] = oddOne;
        }
        const shuffledSubset = [...subset].sort(() => 0.5 - Math.random());
        const namesSubset = [names[0], names[1], names[2]];
        
        let wrongKid = '';
        for (let i = 0; i < 3; i++) {
          if (shuffledSubset[i] === oddOne) wrongKid = namesSubset[i];
        }
        answer = wrongKid;
        
        let structText = `STORY: Create a creative short story word problem featuring characters ${namesSubset[0]}, ${namesSubset[1]}, and ${namesSubset[2]}. A teacher asks them to write down a fraction ${rule.text}. ${namesSubset[0]} writes ${shuffledSubset[0].n}/${shuffledSubset[0].d}, ${namesSubset[1]} writes ${shuffledSubset[1].n}/${shuffledSubset[1].d}, and ${namesSubset[2]} writes ${shuffledSubset[2].n}/${shuffledSubset[2].d}. The final sentence MUST EXACTLY be: "Who wrote the wrong fraction? (Write the name)"`;
        
        const steps = shuffledSubset.map((f, i) => {
          const denomNameMap = { 4: 'fourths', 6: 'sixths', 8: 'eighths', 10: 'tenths', 12: 'twelfths' };
          const denomName = denomNameMap[f.d] || `${f.d}ths`;
          return {
            label: `Check ${namesSubset[i]} (${f.n}/${f.d}). 1/2 is equal to how many ${denomName}?`,
            expectedAnswer: `${f.d / 2}/${f.d}`
          };
        });
        
        steps.push({
          label: `Compare their written fractions to your answers. Who wrote a fraction that is NOT ${rule.text}?`,
          expectedAnswer: wrongKid
        });
        
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: steps
        });
        
        askText = getQText(structText, shortText);
        hint = `Compare each fraction to 1/2 by finding equivalent fractions!`;
        solutionSteps = [
          `Find half of each denominator to make an equivalent fraction for 1/2.`,
          `Compare the student's fraction to 1/2.`,
          `The student who wrote a fraction that is NOT ${rule.text} is ${wrongKid}.`
        ];
      } else {
        let structText = `STORY: Create a creative short story word problem featuring characters ${names[0]}, ${names[1]}, and ${names[2]}. A teacher asks them to write down a fraction ${rule.text}. ${names[0]} writes ${shuffled[0].n}/${shuffled[0].d}, ${names[1]} writes ${shuffled[1].n}/${shuffled[1].d}, and ${names[2]} writes ${shuffled[2].n}/${shuffled[2].d}. The final sentence MUST EXACTLY be: "Who wrote the wrong fraction? (Write the name)"`;
        
        let wrongKid = '';
        for (let i = 0; i < 3; i++) {
          if (shuffled[i] === oddOne) wrongKid = [names[0], names[1], names[2]][i];
        }
        answer = `${oddOne.n}/${oddOne.d}`;
        askText = getQText(structText, shortText);
        hint = `Compare each fraction to 1/2 using equivalent fractions!`;
        solutionSteps = [
          `Check each fraction against the rule "${rule.text}".`,
          `The wrong fraction is ${oddOne.n}/${oddOne.d}.`,
          `The answer is ${answer}.`
        ];
      }
    }
  }

  if (!isMCQ && !inputRequirementStr) {
    inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
  } else if (isMCQ) {
    inputRequirementStr = `null`;
  }

  const aiPrompt = `
You are an expert Primary 3 math teacher.
Generate a valid JSON object representing a math question.

CRITICAL INSTRUCTIONS:
- questionText: MUST be an array of strings. Break the question into multiple lines if needed.
- ${isStructure ? (inputRequirementStr && inputRequirementStr.includes('MULTI_STEP_INPUT') ? 'The output MUST match the MULTI_STEP format specified below.' : 'Use TEXT_INPUT format.') : (isMCQ ? 'The output MUST provide the multiple choice options.' : 'The output MUST NOT provide options or multi-step input.')}
- ${askText.startsWith('STORY:') ? `Write a creative short story word problem using these exact details, and use the generated story as the questionText:\n  ${askText.replace('STORY:', '')}` : `EXACTLY use the following text as the questionText:\n  ${askText}`}
- EXACTLY use the following as the finalAnswer:
  "${answer}"
- EXACTLY use the following steps for the solution (do NOT add numbers like "1." yourself, just use the strings directly):
  ${JSON.stringify(solutionSteps)}
- EXACTLY use the following hint:
  "${hint}"
- visualEngine MUST EXACTLY be {"componentToRender": "NONE", "componentData": {"hideVisual": true}}. DO NOT generate a BAR_MODEL or any other visual engine.

${getFormatInstructions(visualEngineStr, inputRequirementStr)}
  `;

  return { aiPrompt };
};
