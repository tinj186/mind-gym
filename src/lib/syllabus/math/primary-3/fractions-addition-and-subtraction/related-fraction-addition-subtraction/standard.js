import { getRandomNames, getRandomDivisibleObjects } from '@/lib/utils/variable-bank';

const getArticle = (word) => /^[aeiou]/i.test(word) ? 'an' : 'a';

export const standardLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
  const names = getRandomNames(3);
  const contextItem = getRandomDivisibleObjects(1)[0];
  const foodItem = getRandomDivisibleObjects(1)[0]; // reusing divisible objects as foods/items
  const getUniqueOptions = (ans, dists) => Array.from(new Set([ans, ...dists])).slice(0, 4).sort(() => 0.5 - Math.random());

  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const simplifyFraction = (n, d) => {
    const divisor = gcd(Math.abs(n), d);
    return { n: n / divisor, d: d / divisor };
  };

  const getRelatedFractions = (forceAddition = null, forceSimplifiable = false) => {
    let validPair = null;
    let attempts = 0;
    while (!validPair && attempts < 1000) {
      attempts++;
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
        const maxRelatedN = commonD - convertedN - 1; // ensures sum < commonD
        if (maxRelatedN < 1) continue;
        relatedN = Math.floor(Math.random() * maxRelatedN) + 1;
      } else {
        const maxRelatedN = convertedN - 1; // ensures difference > 0
        if (maxRelatedN < 1) continue;
        relatedN = Math.floor(Math.random() * maxRelatedN) + 1;
      }

      const finalN = isAddition ? convertedN + relatedN : convertedN - relatedN;
      const simp = simplifyFraction(finalN, commonD);

      if (forceSimplifiable && (simp.n === finalN || simp.d === commonD)) {
        continue;
      }

      validPair = {
        base: { n: baseN, d: baseD },
        related: { n: relatedN, d: commonD },
        mult: mult,
        isAddition: isAddition,
        finalN,
        commonD,
        simp
      };
    }
    return validPair;
  };

  const getQText = (structureText, shortText) => {
    if (isStructure) return structureText;
    return shortText;
  };

  let askText, answer, mcqOptions, solutionSteps, hint;
  let visualEngineStr = `{"componentToRender": "NONE", "componentData": {"hideVisual": true}}`;
  let inputRequirementStr = null;

  if (activeVariant === 'standard_algorithmic_addition') {
    const pair = getRelatedFractions(true, true);
    answer = `${pair.simp.n}/${pair.simp.d}`;

    if (isMCQ) {
      askText = `Add ${pair.base.n}/${pair.base.d} and ${pair.related.n}/${pair.commonD}. What is the answer in its simplest form?`;
      const dist1 = `${pair.finalN}/${pair.commonD}`; // unsimplified
      const dist2 = `${pair.base.n + pair.related.n}/${pair.base.d + pair.commonD}`; // common mistake
      const wrongSimp = simplifyFraction(pair.base.n + pair.related.n, pair.base.d + pair.commonD);
      const dist3 = `${wrongSimp.n}/${wrongSimp.d}`;
      const dist4 = `${pair.simp.n + 1}/${pair.simp.d}`;
      mcqOptions = getUniqueOptions(answer, [dist1, dist2, dist3, dist4]);
      solutionSteps = [
        `Make the denominators the same: ${pair.base.n}/${pair.base.d} = ${pair.base.n * pair.mult}/${pair.commonD}.`,
        `Add them: ${pair.base.n * pair.mult}/${pair.commonD} + ${pair.related.n}/${pair.commonD} = ${pair.finalN}/${pair.commonD}.`,
        `Simplify the fraction: ${pair.finalN} ÷ ${pair.finalN / pair.simp.n} = ${pair.simp.n}, ${pair.commonD} ÷ ${pair.commonD / pair.simp.d} = ${pair.simp.d}.`,
        `The simplest form is ${answer}.`
      ];
      hint = `Make the denominators the same first, add, and then divide the top and bottom by their greatest common factor.`;
    } else {
      let structText;
      if (Math.random() > 0.5) {
        structText = `STORY: ${names[0]} eats ${pair.base.n}/${pair.base.d} of a ${foodItem} in the morning and ${pair.related.n}/${pair.commonD} of a ${foodItem} in the afternoon. What is the total fraction of the ${foodItem} eaten? Express your answer in its simplest form.`;
      } else {
        structText = `STORY: ${names[0]} uses ${pair.base.n}/${pair.base.d} of a ${contextItem} for one craft and ${pair.related.n}/${pair.commonD} of a ${contextItem} for another craft. What is the total fraction of the ${contextItem} used? Express your answer in its simplest form.`;
      }
      let shortText = `Add ${pair.base.n}/${pair.base.d} and ${pair.related.n}/${pair.commonD}. Express your answer in simplest form.`;
      askText = getQText(structText, shortText);

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Fraction to convert", expectedAnswer: `${pair.base.n}/${pair.base.d}` },
            { label: "Convert", expectedAnswer: `${pair.base.n * pair.mult}/${pair.commonD}` },
            { label: "Add", expectedAnswer: `${pair.base.n * pair.mult}/${pair.commonD} + ${pair.related.n}/${pair.commonD} = ${pair.finalN}/${pair.commonD}` },
            { label: "Simplify", expectedAnswer: answer }
          ]
        });
      }
      hint = `Add the fractions using a common denominator, then simplify.`;
      solutionSteps = [
        `${pair.base.n}/${pair.base.d} = ${pair.base.n * pair.mult}/${pair.commonD}.`,
        `${pair.base.n * pair.mult}/${pair.commonD} + ${pair.related.n}/${pair.commonD} = ${pair.finalN}/${pair.commonD}.`,
        `${pair.finalN}/${pair.commonD} in simplest form is ${answer}.`
      ];
    }
  } else if (activeVariant === 'standard_algorithmic_subtraction') {
    const pair = getRelatedFractions(false, true);
    answer = `${pair.simp.n}/${pair.simp.d}`;

    if (isMCQ) {
      askText = `${pair.base.n}/${pair.base.d} - ${pair.related.n}/${pair.commonD} = ? (Simplest form)`;
      const dist1 = `${pair.finalN}/${pair.commonD}`;
      const nDiff = Math.abs(pair.base.n - pair.related.n) || 1;
      const dist2 = `${nDiff}/${pair.base.d}`;
      const dist3 = `${nDiff}/${pair.commonD}`;
      const wrongSimp = simplifyFraction(nDiff, pair.commonD);
      const dist4 = `${wrongSimp.n}/${wrongSimp.d}`;
      mcqOptions = getUniqueOptions(answer, [dist1, dist2, dist3, dist4]);
      solutionSteps = [
        `Make the denominators the same: ${pair.base.n}/${pair.base.d} = ${pair.base.n * pair.mult}/${pair.commonD}.`,
        `Subtract them: ${pair.base.n * pair.mult}/${pair.commonD} - ${pair.related.n}/${pair.commonD} = ${pair.finalN}/${pair.commonD}.`,
        `Simplify the fraction: ${pair.finalN} ÷ ${pair.finalN / pair.simp.n} = ${pair.simp.n}, ${pair.commonD} ÷ ${pair.commonD / pair.simp.d} = ${pair.simp.d}.`,
        `The simplest form is ${answer}.`
      ];
      hint = `Make the denominators the same first, subtract, and then simplify.`;
    } else {
      let structText;
      if (Math.random() > 0.5) {
        structText = `STORY: ${names[0]} has ${pair.base.n}/${pair.base.d} of a ${foodItem}. They eat ${pair.related.n}/${pair.commonD} of it. What fraction of the ${foodItem} is left? Express your answer in its simplest form.`;
      } else {
        structText = `STORY: A piece of ${contextItem} is ${pair.base.n}/${pair.base.d} metre long. ${names[0]} cuts off ${pair.related.n}/${pair.commonD} metre. How much of the ${contextItem} is left? Express your answer in its simplest form.`;
      }
      let shortText = `Subtract ${pair.related.n}/${pair.commonD} from ${pair.base.n}/${pair.base.d}. Express your answer in simplest form.`;
      askText = getQText(structText, shortText);

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Fraction to convert", expectedAnswer: `${pair.base.n}/${pair.base.d}` },
            { label: "Convert", expectedAnswer: `${pair.base.n * pair.mult}/${pair.commonD}` },
            { label: "Subtract", expectedAnswer: `${pair.base.n * pair.mult}/${pair.commonD} - ${pair.related.n}/${pair.commonD} = ${pair.finalN}/${pair.commonD}` },
            { label: "Simplify", expectedAnswer: answer }
          ]
        });
      }
      hint = `Subtract the fractions using a common denominator, then simplify.`;
      solutionSteps = [
        `${pair.base.n}/${pair.base.d} = ${pair.base.n * pair.mult}/${pair.commonD}.`,
        `${pair.base.n * pair.mult}/${pair.commonD} - ${pair.related.n}/${pair.commonD} = ${pair.finalN}/${pair.commonD}.`,
        `${pair.finalN}/${pair.commonD} in simplest form is ${answer}.`
      ];
    }
  } else if (activeVariant === 'standard_missing_addend') {
    const pair = getRelatedFractions(true, false);
    answer = `${pair.related.n}/${pair.commonD}`;
    const sumN = pair.finalN;

    if (isMCQ) {
      askText = `Which fraction completes the equation: ${pair.base.n}/${pair.base.d} + [ ] = ${sumN}/${pair.commonD}?`;
      const dist1 = `${sumN + pair.base.n * pair.mult}/${pair.commonD}`;
      const dist2 = `${pair.related.n + 1}/${pair.commonD}`;
      const dist3 = `${pair.related.n + 2}/${pair.commonD}`;
      const dist4 = `${Math.abs(sumN - pair.base.n) || 1}/${pair.commonD}`;
      mcqOptions = getUniqueOptions(answer, [dist1, dist2, dist3, dist4]);
      solutionSteps = [
        `Convert ${pair.base.n}/${pair.base.d} to an equivalent fraction with denominator ${pair.commonD}.`,
        `${pair.base.n}/${pair.base.d} = ${pair.base.n * pair.mult}/${pair.commonD}.`,
        `Now the equation is: ${pair.base.n * pair.mult}/${pair.commonD} + [ ] = ${sumN}/${pair.commonD}.`,
        `Subtract: ${sumN}/${pair.commonD} - ${pair.base.n * pair.mult}/${pair.commonD} = ${answer}.`
      ];
      hint = `Convert the first fraction so it matches the denominator of the total, then subtract it from the total.`;
    } else {
      let structText;
      if (Math.random() > 0.5) {
        structText = `STORY: ${names[0]} has eaten ${pair.base.n}/${pair.base.d} of a ${foodItem}. They plan to eat a total of ${sumN}/${pair.commonD} of the ${foodItem}. What fraction of the ${foodItem} do they still need to eat?`;
      } else {
        structText = `STORY: ${names[0]} has used ${pair.base.n}/${pair.base.d} of a ${contextItem}. They want to use a total of ${sumN}/${pair.commonD} of the ${contextItem} for their project. What fraction of the ${contextItem} do they still need to use?`;
      }
      let shortText = `${pair.base.n}/${pair.base.d} + [ ] = ${sumN}/${pair.commonD}. Find the missing fraction.`;
      askText = getQText(structText, shortText);
      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Fraction to convert", expectedAnswer: `${pair.base.n}/${pair.base.d}` },
            { label: "Convert", expectedAnswer: `${pair.base.n * pair.mult}/${pair.commonD}` },
            { label: "Equation", expectedAnswer: `${sumN}/${pair.commonD} - ${pair.base.n * pair.mult}/${pair.commonD} = ${answer}` }
          ]
        });
      }
      hint = `Convert the first fraction, then subtract it from the total to find the missing part.`;
      solutionSteps = [
        `${pair.base.n}/${pair.base.d} = ${pair.base.n * pair.mult}/${pair.commonD}.`,
        `${sumN}/${pair.commonD} - ${pair.base.n * pair.mult}/${pair.commonD} = ${answer}.`
      ];
    }
  } else if (activeVariant === 'standard_missing_subtrahend') {
    let baseD = [2, 3, 4, 5, 6][Math.floor(Math.random() * 5)];
    let mult = [2, 3, 4][Math.floor(Math.random() * 3)];
    let commonD = baseD * mult;
    let baseN = Math.floor(Math.random() * (baseD - 1)) + 1;
    let maxRelatedN = commonD - (baseN * mult) - 1;
    if (maxRelatedN < 1) maxRelatedN = 1;
    let relatedN = Math.floor(Math.random() * maxRelatedN) + 1;
    let startN = baseN * mult + relatedN;
    
    const startFraction = `${startN}/${commonD}`;
    const resultFraction = `${baseN}/${baseD}`;
    answer = `${relatedN}/${commonD}`;

    if (isMCQ) {
      askText = `${startFraction} - [ ] = ${resultFraction}. What is the missing fraction?`;
      const dist1 = `${startN + baseN * mult}/${commonD}`;
      const dist2 = `${relatedN + 1}/${commonD}`;
      const dist3 = `${relatedN + 2}/${commonD}`;
      const dist4 = `${Math.abs(startN - baseN) || 1}/${commonD}`;
      mcqOptions = getUniqueOptions(answer, [dist1, dist2, dist3, dist4]);
      solutionSteps = [
        `Convert ${resultFraction} to an equivalent fraction with denominator ${commonD}.`,
        `${resultFraction} = ${baseN * mult}/${commonD}.`,
        `Now the equation is: ${startFraction} - [ ] = ${baseN * mult}/${commonD}.`,
        `Subtract the remaining from the total: ${startFraction} - ${baseN * mult}/${commonD} = ${answer}.`
      ];
      hint = `Convert the fraction on the right to match the denominator of the first fraction.`;
    } else {
      let structText;
      if (Math.random() > 0.5) {
        structText = `STORY: ${names[0]} has a ${foodItem} that is ${startFraction} whole. After eating some of it, ${resultFraction} of the ${foodItem} is left. What fraction of the ${foodItem} was eaten?`;
      } else {
        structText = `STORY: A piece of ${contextItem} is ${startFraction} metre long. After ${names[0]} cuts off a piece, it is ${resultFraction} metre long. What fraction of a metre was cut off?`;
      }
      let shortText = `${startFraction} - [ ] = ${resultFraction}. Find the missing fraction.`;
      askText = getQText(structText, shortText);
      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Fraction to convert", expectedAnswer: `${resultFraction}` },
            { label: "Convert", expectedAnswer: `${baseN * mult}/${commonD}` },
            { label: "Equation", expectedAnswer: `${startFraction} - ${baseN * mult}/${commonD} = ${answer}` }
          ]
        });
      }
      hint = `Convert the fraction, then find the difference between the starting amount and the remaining amount.`;
      solutionSteps = [
        `${resultFraction} = ${baseN * mult}/${commonD}.`,
        `${startFraction} - ${baseN * mult}/${commonD} = ${answer}.`
      ];
    }
  } else if (activeVariant === 'standard_compare_sum_to_1') {
    const p1BaseD = [2, 3, 4, 5, 6][Math.floor(Math.random() * 5)];
    const p1Mult = [2, 3][Math.floor(Math.random() * 2)];
    const p1CommonD = p1BaseD * p1Mult;
    const p1BaseN = Math.floor(Math.random() * (p1BaseD - 1)) + 1;
    const p1RelatedN = p1CommonD - (p1BaseN * p1Mult);
    const pairEq1 = { bN: p1BaseN, bD: p1BaseD, rN: p1RelatedN, cD: p1CommonD, sum: 1 };
    
    let p2BaseD = p1BaseD, p2Mult = p1Mult, p2CommonD = p2BaseD * p2Mult;
    let p2BaseN = Math.floor(Math.random() * (p2BaseD - 1)) + 1;
    let maxR = p2CommonD - (p2BaseN * p2Mult) - 1;
    if (maxR < 1) { p2BaseD=4; p2Mult=2; p2CommonD=8; p2BaseN=1; maxR=4; }
    let p2RelatedN = Math.floor(Math.random() * maxR) + 1;
    const pairLt1 = { bN: p2BaseN, bD: p2BaseD, rN: p2RelatedN, cD: p2CommonD, sum: 0 };
    
    if (isMCQ) {
      askText = `Which pair of fractions adds up to exactly 1 whole?`;
      answer = `${pairEq1.bN}/${pairEq1.bD} + ${pairEq1.rN}/${pairEq1.cD}`;
      const dist1 = `${pairLt1.bN}/${pairLt1.bD} + ${pairLt1.rN}/${pairLt1.cD}`;
      const dist2 = `${pairLt1.bN}/${pairLt1.bD} + ${pairEq1.rN}/${pairEq1.cD}`;
      const dist3 = `${pairEq1.bN}/${pairEq1.bD} + ${pairLt1.rN}/${pairLt1.cD}`;
      mcqOptions = getUniqueOptions(answer, [dist1, dist2, dist3]);
      solutionSteps = [
        `To add up to 1 whole, the numerator and denominator of the sum must be the same.`,
        `Check ${answer}: ${pairEq1.bN}/${pairEq1.bD} = ${pairEq1.bN * p1Mult}/${pairEq1.cD}.`,
        `${pairEq1.bN * p1Mult}/${pairEq1.cD} + ${pairEq1.rN}/${pairEq1.cD} = ${pairEq1.cD}/${pairEq1.cD} = 1 whole.`
      ];
      hint = `Check which option gives a numerator equal to the denominator when you add them.`;
    } else {
      const isEq1 = Math.random() > 0.5;
      const pair = isEq1 ? pairEq1 : pairLt1;
      
      let structText;
      if (Math.random() > 0.5) {
        structText = `STORY: ${names[0]} eats ${pair.bN}/${pair.bD} of a ${foodItem} in the morning and ${pair.rN}/${pair.cD} of the ${foodItem} in the evening. Did they eat the whole ${foodItem}? (Write Yes or No).`;
      } else {
        structText = `STORY: ${names[0]} spends ${pair.bN}/${pair.bD} of their money on a ${contextItem} and ${pair.rN}/${pair.cD} of their money on a ${foodItem}. Did they spend all of their money? (Write Yes or No).`;
      }
      let shortText = `If you add ${pair.bN}/${pair.bD} and ${pair.rN}/${pair.cD}, is the sum less than, equal to, or greater than 1 whole?`;
      askText = getQText(structText, shortText);
      
      if (isStructure) {
        answer = isEq1 ? "Yes" : "No";
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Fraction to convert", expectedAnswer: `${pair.bN}/${pair.bD}` },
            { label: "Convert", expectedAnswer: `${pair.bN * (pair.cD/pair.bD)}/${pair.cD}` },
            { label: "Add", expectedAnswer: `${pair.bN * (pair.cD/pair.bD)}/${pair.cD} + ${pair.rN}/${pair.cD} = ${(pair.bN * (pair.cD/pair.bD)) + pair.rN}/${pair.cD}` },
            { label: "Is it 1 whole?", expectedAnswer: answer }
          ]
        });
        solutionSteps = [
          `${pair.bN}/${pair.bD} = ${pair.bN * (pair.cD/pair.bD)}/${pair.cD}.`,
          `${pair.bN * (pair.cD/pair.bD)}/${pair.cD} + ${pair.rN}/${pair.cD} = ${(pair.bN * (pair.cD/pair.bD)) + pair.rN}/${pair.cD}.`,
          isEq1 ? `Since the numerator and denominator are the same, they used the whole amount.` : `Since the numerator is less than the denominator, they did not use the whole amount.`
        ];
        hint = `Add the fractions first. If the top number equals the bottom number, it's 1 whole.`;
      } else {
        answer = isEq1 ? "equal to" : "less than";
        solutionSteps = [
          `${pair.bN}/${pair.bD} = ${pair.bN * (pair.cD/pair.bD)}/${pair.cD}.`,
          `${pair.bN * (pair.cD/pair.bD)}/${pair.cD} + ${pair.rN}/${pair.cD} = ${(pair.bN * (pair.cD/pair.bD)) + pair.rN}/${pair.cD}.`,
          isEq1 ? `The sum is equal to 1 whole.` : `The sum is less than 1 whole.`
        ];
        hint = `Find the sum of the fractions. If the numerator is smaller than the denominator, it is less than 1 whole.`;
      }
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
    metadata: { difficulty: 'standard', steps: 1, logic: activeVariant }
  };
};
