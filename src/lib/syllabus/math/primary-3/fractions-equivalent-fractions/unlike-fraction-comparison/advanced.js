import { getRandomNames, getRandomDivisibleFoods, getRandomColors, getRandomDivisibleObjects } from '@/lib/utils/variable-bank';

const getArticle = (word) => /^[aeiou]/i.test(word) ? 'an' : 'a';

// Helper to construct BAR_MODEL model
const createBarModel = (num, denom, label) => ({
  modelType: "PART_WHOLE",
  parts: [
    { segments: num, layoutSize: num, bgClass: "bg-blue-500 text-white" },
    { segments: denom - num, layoutSize: denom - num, bgClass: "bg-slate-200 text-slate-400" }
  ],
  barLabel: label,
  topBrackets: [
    { size: num, label: "Consumed amount" }
  ],
  hideTotal: true,
  isStatic: true
});

export const advancedLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions) => {
  let askText = "";
  let hint = "";
  let solutionSteps = [];
  let answer = "";
  let mcqOptions = [];
  let defectMap = {};
  
  let visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: { hideVisual: true } });
  let inputRequirementStr = null;

  const names = getRandomNames(3);
  const getQText = (structText, shortText) => isStructure ? structText : (shortText || structText);

  if (activeVariant === 'advanced_remaining_comparison') {
    const pairs = [
      { f1: {n: 1, d: 2}, f2: {n: 3, d: 8} },
      { f1: {n: 1, d: 2}, f2: {n: 5, d: 8} },
      { f1: {n: 1, d: 3}, f2: {n: 2, d: 9} },
      { f1: {n: 1, d: 4}, f2: {n: 3, d: 8} },
      { f1: {n: 1, d: 4}, f2: {n: 5, d: 12} },
      { f1: {n: 2, d: 3}, f2: {n: 5, d: 9} },
      { f1: {n: 3, d: 4}, f2: {n: 5, d: 8} }
    ];
    
    const p = pairs[Math.floor(Math.random() * pairs.length)];
    const isFirstF1 = Math.random() > 0.5;
    const first = isFirstF1 ? p.f1 : p.f2;
    const second = isFirstF1 ? p.f2 : p.f1;
    
    const rem1 = { n: first.d - first.n, d: first.d };
    const rem2 = { n: second.d - second.n, d: second.d };
    
    const val1 = rem1.n / rem1.d;
    const val2 = rem2.n / rem2.d;
    
    const askForMore = Math.random() > 0.5; // True = who has more left, False = who has less left
    
    const winner = (val1 > val2 && askForMore) || (val1 < val2 && !askForMore) ? names[0] : names[1];
    answer = winner;
    
    const item = getRandomDivisibleFoods(1)[0];
    
    visualEngineStr = JSON.stringify({
      componentToRender: "BAR_MODEL",
      componentData: {
        models: [
          createBarModel(first.n, first.d, names[0]),
          createBarModel(second.n, second.d, names[1])
        ]
      }
    });

    if (isMCQ) {
      askText = `STORY: Create a creative short story where ${names[0]} spends ${first.n}/${first.d} of their money and ${names[1]} spends ${second.n}/${second.d} of their money. The final sentence MUST EXACTLY be: "Who has ${askForMore ? 'more' : 'less'} money remaining?"`;
      mcqOptions = [names[0], names[1], "Both have the same amount", "Cannot be determined"];
      
      const newDenom = Math.max(rem1.d, rem2.d);
      const isRem1Converted = rem1.d < rem2.d;
      const convertedPerson = isRem1Converted ? names[0] : names[1];
      const convertedNum = isRem1Converted ? rem1.n * (newDenom / rem1.d) : rem2.n * (newDenom / rem2.d);
      
      const uncovertedNum = isRem1Converted ? rem2.n : rem1.n;
      
      solutionSteps = [
        `Find the fraction left over for each person.`,
        `${names[0]}: 1 - ${first.n}/${first.d} = ${rem1.n}/${rem1.d}.`,
        `${names[1]}: 1 - ${second.n}/${second.d} = ${rem2.n}/${rem2.d}.`,
        `Convert to a common denominator to compare: ${convertedPerson}'s fraction becomes ${convertedNum}/${newDenom}.`,
        `Since ${convertedNum}/${newDenom} is ${convertedNum > uncovertedNum ? 'greater' : 'smaller'} than ${uncovertedNum}/${newDenom}, ${answer} has the ${askForMore ? 'larger' : 'smaller'} amount remaining.`
      ];
      hint = `Find the fraction that is left over first! 1 whole minus the amount spent.`;
    } else {
      let structText = `STORY: Create a creative short story word problem featuring characters ${names[0]} and ${names[1]}. They each have an identical ${item}. ${names[0]} eats ${first.n}/${first.d} of their ${item}, and ${names[1]} eats ${second.n}/${second.d} of their ${item}. The final sentence MUST EXACTLY be: "Who has a ${askForMore ? 'larger' : 'smaller'} fraction of their ${item} left over? (Write the name)"`;
      let shortText = `STORY: Create a creative short story word problem where ${names[0]} eats ${first.n}/${first.d} of ${getArticle(item)} ${item}, and ${names[1]} eats ${second.n}/${second.d} of an identical ${item}. The final sentence MUST EXACTLY be: "Who has ${askForMore ? 'more' : 'less'} ${item} left over? (Write the name)"`;
      
      const newDenom = Math.max(rem1.d, rem2.d);
      const isRem1Converted = rem1.d < rem2.d;
      const convertedPerson = isRem1Converted ? names[0] : names[1];
      const convertedFrac = isRem1Converted ? `${rem1.n}/${rem1.d}` : `${rem2.n}/${rem2.d}`;
      const convertedNum = isRem1Converted ? rem1.n * (newDenom / rem1.d) : rem2.n * (newDenom / rem2.d);
      
      const uncovertedNum = isRem1Converted ? rem2.n : rem1.n;
      
      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `What fraction of ${names[0]}'s ${item} is left over?`, expectedAnswer: `${rem1.n}/${rem1.d}` },
            { label: `What fraction of ${names[1]}'s ${item} is left over?`, expectedAnswer: `${rem2.n}/${rem2.d}` },
            { label: `Which fraction needs to be changed to compare them?`, expectedAnswer: convertedFrac },
            { label: `What is the new equivalent fraction?`, expectedAnswer: `${convertedNum}/${newDenom}` },
            { label: `Who has a ${askForMore ? 'larger' : 'smaller'} fraction left over? (Write the name)`, expectedAnswer: answer }
          ]
        });
      }
      
      askText = getQText(structText, shortText);
      hint = `Subtract the eaten amount from 1 whole to find the leftover amount first!`;
      solutionSteps = [
        `Find the fraction left over for each person.`,
        `${names[0]}: 1 - ${first.n}/${first.d} = ${rem1.n}/${rem1.d}.`,
        `${names[1]}: 1 - ${second.n}/${second.d} = ${rem2.n}/${rem2.d}.`,
        `Convert to a common denominator to compare: ${convertedPerson}'s fraction becomes ${convertedNum}/${newDenom}.`,
        `Since ${convertedNum}/${newDenom} is ${convertedNum > uncovertedNum ? 'greater' : 'smaller'} than ${uncovertedNum}/${newDenom}, ${answer} has the ${askForMore ? 'larger' : 'smaller'} fraction left over.`
      ];
    }
  } else if (activeVariant === 'advanced_missing_numerator') {
    const scenarios = [
      { t: {n: 1, d: 2}, d2: 8, op: '<', type: 'largest' },
      { t: {n: 1, d: 2}, d2: 8, op: '>', type: 'smallest' },
      { t: {n: 2, d: 3}, d2: 9, op: '<', type: 'largest' },
      { t: {n: 2, d: 3}, d2: 9, op: '>', type: 'smallest' },
      { t: {n: 3, d: 4}, d2: 12, op: '<', type: 'largest' },
      { t: {n: 3, d: 4}, d2: 12, op: '>', type: 'smallest' },
      { t: {n: 1, d: 4}, d2: 12, op: '<', type: 'largest' },
      { t: {n: 1, d: 4}, d2: 12, op: '>', type: 'smallest' }
    ];
    
    const sc = scenarios[Math.floor(Math.random() * scenarios.length)];
    const equiv = sc.t.n * (sc.d2 / sc.t.d);
    
    const targetAns = sc.type === 'largest' ? equiv - 1 : equiv + 1;
    answer = targetAns.toString();
    
    if (isMCQ) {
      askText = `Which number can be placed in the box to make this statement true?\n${sc.t.n}/${sc.t.d} ${sc.op === '<' ? '>' : '<'} [ ]/${sc.d2}`;
      
      const wrong1 = equiv.toString();
      const wrong2 = (sc.type === 'largest' ? targetAns - 1 : targetAns + 1).toString();
      const wrong3 = (sc.type === 'largest' ? equiv + 1 : equiv - 1).toString();
      
      mcqOptions = [answer, wrong1, wrong2, wrong3].sort(() => 0.5 - Math.random());
      
      solutionSteps = [
        `Find an equivalent fraction for ${sc.t.n}/${sc.t.d} with a denominator of ${sc.d2}.`,
        `${sc.t.n}/${sc.t.d} is equal to ${equiv}/${sc.d2}.`,
        `The statement becomes: ${equiv}/${sc.d2} ${sc.op === '<' ? '>' : '<'} [ ]/${sc.d2}.`,
        `The ${sc.type} number that makes this true is ${answer}.`
      ];
      hint = `Change the first fraction so it has the same denominator as the second fraction!`;
    } else {
      let structText = `STORY: Create a short story word problem where a container can hold ${sc.d2} liters of water. It currently holds an unknown amount, represented by [ ]/${sc.d2}. If the container is ${sc.op === '<' ? 'less' : 'more'} than ${sc.t.n}/${sc.t.d} full, what is the ${sc.type} possible whole number of liters it could contain?`;
      let shortText = `What is the ${sc.type} whole number that can fill the box?\n[ ]/${sc.d2} ${sc.op} ${sc.t.n}/${sc.t.d}`;
      
      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Convert ${sc.t.n}/${sc.t.d} to an equivalent fraction with denominator ${sc.d2}:`, expectedAnswer: `${equiv}/${sc.d2}` },
            { label: `What is the ${sc.type} whole number that can fill the box?`, expectedAnswer: answer }
          ]
        });
      }
      
      askText = getQText(structText, shortText);
      hint = `First, find an equivalent fraction for ${sc.t.n}/${sc.t.d} with a denominator of ${sc.d2}.`;
      solutionSteps = [
        `To compare, first find an equivalent fraction for ${sc.t.n}/${sc.t.d} that has a denominator of ${sc.d2}.`,
        `${sc.t.n}/${sc.t.d} = ${equiv}/${sc.d2}.`,
        `We are looking for the ${sc.type} number where [ ]/${sc.d2} ${sc.op} ${equiv}/${sc.d2}.`,
        `The ${sc.type} possible whole number is ${answer}.`
      ];
    }
  } else if (activeVariant === 'advanced_missing_denominator') {
    const scenarios = [
      { num: 3, d1: 10, op: '<', type: 'smallest' },
      { num: 3, d1: 10, op: '>', type: 'largest' },
      { num: 4, d1: 5, op: '>', type: 'smallest' }, // 4/[ ] < 4/5 => [ ] > 5
      { num: 4, d1: 5, op: '<', type: 'largest' },  // 4/[ ] > 4/5 => [ ] < 5
      { num: 5, d1: 8, op: '<', type: 'smallest' }, // 5/[ ] < 5/8 => [ ] > 8
      { num: 5, d1: 8, op: '>', type: 'largest' }
    ];
    
    const sc = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    let isBoxFirst = Math.random() > 0.5;
    let boxOp = sc.op; 
    let expr = `${sc.num}/[ ] ${boxOp} ${sc.num}/${sc.d1}`;
    if (!isBoxFirst) {
      boxOp = sc.op === '<' ? '>' : '<';
      expr = `${sc.num}/${sc.d1} ${boxOp} ${sc.num}/[ ]`;
    }
    
    let relationToD1 = sc.op === '<' ? '>' : '<'; 
    let targetAns = relationToD1 === '>' ? sc.d1 + 1 : sc.d1 - 1;
    answer = targetAns.toString();
    
    if (isMCQ) {
      askText = `Which denominator makes the statement true?\n${expr}`;
      
      const wrong1 = sc.d1.toString();
      const wrong2 = relationToD1 === '>' ? (sc.d1 - 1).toString() : (sc.d1 + 1).toString();
      const wrong3 = relationToD1 === '>' ? (sc.d1 - 2).toString() : (sc.d1 + 2).toString();
      
      mcqOptions = [answer, wrong1, wrong2, wrong3].sort(() => 0.5 - Math.random());
      
      solutionSteps = [
        `When numerators are the same, the fraction with the larger denominator is smaller.`,
        `The statement is ${expr}.`,
        `This means the denominator must be ${relationToD1 === '>' ? 'greater' : 'smaller'} than ${sc.d1}.`,
        `The correct denominator is ${answer}.`
      ];
      hint = `Remember, a larger denominator means smaller pieces!`;
    } else {
      const item = getRandomDivisibleObjects(1)[0];
      let structText = `STORY: Create a short story word problem. Two identical ${item}s are shared. The first is shared equally among ${sc.d1} people, and each gets ${sc.num}/${sc.d1}. The second is shared equally among an unknown number of people, getting ${sc.num}/[ ]. If the people in the second group got a ${sc.op === '<' ? 'smaller' : 'larger'} share than the first group, what is the ${sc.type} number of people that could be in the second group?`;
      let shortText = `What is the ${sc.type} whole number that can fill the box?\n${expr}`;
      
      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Does the second group need MORE or FEWER people to get a ${sc.op === '<' ? 'smaller' : 'larger'} share? (Type MORE or FEWER)`, expectedAnswer: sc.op === '<' ? 'MORE' : 'FEWER' },
            { label: `What is the ${sc.type} number of people that could be in the second group?`, expectedAnswer: answer }
          ]
        });
      }
      
      askText = getQText(structText, shortText);
      hint = `If you want a ${sc.op === '<' ? 'smaller' : 'larger'} slice, do you need to share the whole with more or fewer people?`;
      solutionSteps = [
        `If the numerator is the same, we compare the denominators.`,
        `A ${sc.op === '<' ? 'smaller' : 'larger'} fraction means the pieces are ${sc.op === '<' ? 'smaller' : 'larger'}.`,
        `To get ${sc.op === '<' ? 'smaller' : 'larger'} pieces, you must divide the whole into ${sc.op === '<' ? 'more' : 'fewer'} parts.`,
        `So, the denominator must be ${sc.op === '<' ? 'greater' : 'less'} than ${sc.d1}.`,
        `The ${sc.type} whole number is ${answer}.`
      ];
    }
  } else if (activeVariant === 'advanced_benchmark_no_conversion') {
    const pairs = [
      { f1: {n: 2, d: 5}, f2: {n: 5, d: 8} }, 
      { f1: {n: 3, d: 8}, f2: {n: 4, d: 6} }, 
      { f1: {n: 4, d: 9}, f2: {n: 5, d: 7} }, 
      { f1: {n: 3, d: 7}, f2: {n: 5, d: 9} }, 
      { f1: {n: 5, d: 11}, f2: {n: 7, d: 12} }
    ];
    
    const p = pairs[Math.floor(Math.random() * pairs.length)];
    const isFirstF1 = Math.random() > 0.5;
    const first = isFirstF1 ? p.f1 : p.f2; 
    const second = isFirstF1 ? p.f2 : p.f1;
    
    const val1 = first.n / first.d;
    const val2 = second.n / second.d;
    
    const askForGreater = Math.random() > 0.5;
    const winnerFrac = (val1 > val2 && askForGreater) || (val1 < val2 && !askForGreater) ? first : second;
    
    const winnerName = (val1 > val2 && askForGreater) || (val1 < val2 && !askForGreater) ? names[0] : names[1];
    
    if (isMCQ) {
      answer = `${winnerFrac.n}/${winnerFrac.d}`;
      askText = `Which is ${askForGreater ? 'greater' : 'smaller'}: ${first.n}/${first.d} or ${second.n}/${second.d}?`;
      mcqOptions = [`${first.n}/${first.d}`, `${second.n}/${second.d}`];
      solutionSteps = [
        `Compare both fractions to the benchmark of 1/2.`,
        `${p.f1.n}/${p.f1.d} is less than 1/2.`,
        `${p.f2.n}/${p.f2.d} is greater than 1/2.`,
        `Therefore, ${winnerFrac.n}/${winnerFrac.d} is ${askForGreater ? 'greater' : 'smaller'}.`
      ];
      hint = `Compare each fraction to 1/2 instead of finding a common denominator!`;
    } else {
      answer = isStructure ? winnerName : `${winnerFrac.n}/${winnerFrac.d}`;
      
      let structText = `STORY: Create a short story where ${names[0]} spends ${first.n}/${first.d} of an hour reading, and ${names[1]} spends ${second.n}/${second.d} of an hour reading. The final sentence MUST EXACTLY be: "Without converting to a common denominator, deduce who read for a ${askForGreater ? 'longer' : 'shorter'} time by comparing both fractions to half an hour. (Write the name)"`;
      let shortText = `Compare ${first.n}/${first.d} and ${second.n}/${second.d}. Which is ${askForGreater ? 'greater' : 'smaller'}?`;
      
      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Is ${names[0]}'s time (${first.n}/${first.d}) MORE or LESS than half an hour?`, expectedAnswer: val1 > 0.5 ? 'MORE' : 'LESS' },
            { label: `Is ${names[1]}'s time (${second.n}/${second.d}) MORE or LESS than half an hour?`, expectedAnswer: val2 > 0.5 ? 'MORE' : 'LESS' },
            { label: `Who read for a ${askForGreater ? 'longer' : 'shorter'} time? (Write the name)`, expectedAnswer: answer }
          ]
        });
      }
      
      askText = getQText(structText, shortText);
      hint = `Compare each fraction to 1/2. Is the numerator more or less than half of the denominator?`;
      solutionSteps = [
        `Compare both fractions to 1/2.`,
        `${names[0]}'s time: ${first.n}/${first.d} is ${val1 > 0.5 ? 'more' : 'less'} than 1/2.`,
        `${names[1]}'s time: ${second.n}/${second.d} is ${val2 > 0.5 ? 'more' : 'less'} than 1/2.`,
        `Therefore, ${isStructure ? answer : `${winnerFrac.n}/${winnerFrac.d}`} is ${askForGreater ? 'greater' : 'smaller'}.`
      ];
    }
  } else if (activeVariant === 'advanced_closest_to_one') {
    const fractionSets = [
      [{n: 2, d: 3}, {n: 3, d: 4}, {n: 5, d: 6}], 
      [{n: 3, d: 4}, {n: 4, d: 5}, {n: 7, d: 8}], 
      [{n: 4, d: 5}, {n: 5, d: 6}, {n: 7, d: 8}], 
      [{n: 3, d: 4}, {n: 5, d: 6}, {n: 7, d: 8}]  
    ];
    
    const set = fractionSets[Math.floor(Math.random() * fractionSets.length)];
    const shuffled = [...set].sort(() => 0.5 - Math.random());
    const isAscending = Math.random() > 0.5;
    
    if (isMCQ) {
      const mcqSets = [
        [{n: 2, d: 3}, {n: 4, d: 5}, {n: 7, d: 8}, {n: 11, d: 12}],
        [{n: 3, d: 4}, {n: 5, d: 6}, {n: 8, d: 9}, {n: 9, d: 10}],
        [{n: 4, d: 5}, {n: 7, d: 8}, {n: 9, d: 10}, {n: 11, d: 12}]
      ];
      const mSet = mcqSets[Math.floor(Math.random() * mcqSets.length)];
      const mShuffled = [...mSet].sort(() => 0.5 - Math.random());
      const mSorted = [...mSet].sort((a,b) => (a.n/a.d) - (b.n/b.d));
      
      const askForClosest = Math.random() > 0.5;
      const winner = askForClosest ? mSorted[3] : mSorted[0];
      
      answer = `${winner.n}/${winner.d}`;
      askText = `Which fraction is ${askForClosest ? 'closest to' : 'furthest from'} 1 whole?\nFractions: ${mShuffled.map(f=>`${f.n}/${f.d}`).join(', ')}`;
      mcqOptions = mShuffled.map(f => `${f.n}/${f.d}`);
      
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          models: mShuffled.map(f => createBarModel(f.n, f.d, `${f.n}/${f.d}`))
        }
      });
      
      solutionSteps = [
        `Look at how much each fraction is missing to make 1 whole.`,
        `The smaller the missing piece, the closer the fraction is to 1 whole.`,
        `The fraction ${askForClosest ? 'closest to' : 'furthest from'} 1 whole is ${answer}.`
      ];
      hint = `Think about how much each fraction needs to make 1 whole!`;
    } else {
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          models: shuffled.map((f, i) => createBarModel(f.n, f.d, isStructure ? names[i] : `${f.n}/${f.d}`))
        }
      });
      
      const sorted = [...set].sort((a,b) => (a.n/a.d) - (b.n/b.d));
      if (!isAscending) sorted.reverse();
      
      const ansArr = isStructure ? 
        sorted.map(f => {
          const idx = shuffled.findIndex(shf => shf.n === f.n && shf.d === f.d);
          return names[idx];
        }) : 
        sorted.map(f => `${f.n}/${f.d}`);
      answer = ansArr.join(', ');
      
      let structText = `STORY: Create a short story where three students are running a race. ${names[0]} has completed ${shuffled[0].n}/${shuffled[0].d} of the track, ${names[1]} has completed ${shuffled[1].n}/${shuffled[1].d}, and ${names[2]} has completed ${shuffled[2].n}/${shuffled[2].d}. The final sentence MUST EXACTLY be: "Arrange the students from who is ${isAscending ? 'furthest from' : 'closest to'} the finish line to who is ${isAscending ? 'closest to' : 'furthest from'} the finish line."`;
      let shortText = `Arrange the fractions from ${isAscending ? 'smallest to greatest' : 'greatest to smallest'}:\n${shuffled.map(f=>`${f.n}/${f.d}`).join(', ')}`;
      
      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `What fraction of the track does ${names[0]} still need to complete?`, expectedAnswer: `1/${shuffled[0].d}` },
            { label: `What fraction of the track does ${names[1]} still need to complete?`, expectedAnswer: `1/${shuffled[1].d}` },
            { label: `What fraction of the track does ${names[2]} still need to complete?`, expectedAnswer: `1/${shuffled[2].d}` },
            { label: `Arrange the students from ${isAscending ? 'furthest from' : 'closest to'} to ${isAscending ? 'closest to' : 'furthest from'} the finish line:`, expectedAnswer: answer }
          ]
        });
      }
      
      askText = getQText(structText, shortText);
      hint = `Find the fraction that is missing from 1 whole! The smaller the missing piece, the closer they are to the finish line.`;
      solutionSteps = [
        `Find the missing piece for each fraction to reach 1 whole.`,
        `${isStructure ? `${names[0]}: ` : ''}1 - ${shuffled[0].n}/${shuffled[0].d} = 1/${shuffled[0].d}`,
        `${isStructure ? `${names[1]}: ` : ''}1 - ${shuffled[1].n}/${shuffled[1].d} = 1/${shuffled[1].d}`,
        `${isStructure ? `${names[2]}: ` : ''}1 - ${shuffled[2].n}/${shuffled[2].d} = 1/${shuffled[2].d}`,
        `A smaller missing piece means the fraction is closer to 1 whole.`,
        `The correct order is ${answer}.`
      ];
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
${visualEngineStr.includes('NONE') ? '- visualEngine MUST EXACTLY be {"componentToRender": "NONE", "componentData": {"hideVisual": true}}. DO NOT generate a BAR_MODEL or any other visual engine.' : ''}

${getFormatInstructions(visualEngineStr, inputRequirementStr)}
  `;

  return { aiPrompt };
};
