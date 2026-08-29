import { getRandomNames, getRandomDivisibleObjects, getRandomDivisibleFoods } from '@/lib/utils/variable-bank';

const getArticle = (word) => /^[aeiou]/i.test(word) ? 'an' : 'a';

export const advancedLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
  const names = getRandomNames(3);
  const contextItem = getRandomDivisibleObjects(1)[0];
  const foodItem = getRandomDivisibleFoods(1)[0];
  const getUniqueOptions = (ans, dists) => Array.from(new Set([ans, ...dists])).slice(0, 4).sort(() => 0.5 - Math.random());

  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const simplifyFraction = (n, d) => {
    const divisor = gcd(Math.abs(n), d);
    return { n: n / divisor, d: d / divisor };
  };

  const getQText = (structureText, shortText) => {
    if (isStructure) return structureText;
    return shortText;
  };

  let askText, answer, mcqOptions, solutionSteps, hint;
  let visualEngineStr = `{"componentToRender": "NONE", "componentData": {"hideVisual": true}}`;
  let inputRequirementStr = null;

  if (activeVariant === 'advanced_rest_of_whole') {
    // 1 - (A + B)
    let bD = [2, 3, 4, 5, 6][Math.floor(Math.random() * 5)];
    let mult = [2, 3, 4][Math.floor(Math.random() * 3)];
    let cD = bD * mult;
    
    let bN = Math.floor(Math.random() * (bD - 1)) + 1;
    let maxR = cD - (bN * mult) - 1;
    if (maxR < 1) { bD=4; mult=2; cD=8; bN=1; maxR=4; } // fallback
    let rN = Math.floor(Math.random() * maxR) + 1;
    
    let sumN = (bN * mult) + rN;
    let restN = cD - sumN;
    answer = `${restN}/${cD}`;

    if (isMCQ) {
      askText = `1/${bD} of a pizza is eaten. Then ${rN}/${cD} is eaten. What fraction of the pizza is left?`;
      const dist1 = `${sumN}/${cD}`; // sum instead of rest
      const dist2 = `${restN + 1}/${cD}`;
      const dist3 = `${Math.abs(restN - 1) || 1}/${cD}`;
      mcqOptions = getUniqueOptions(answer, [dist1, dist2, dist3]);
      solutionSteps = [
        `Total eaten: 1/${bD} + ${rN}/${cD} = ${1 * mult}/${cD} + ${rN}/${cD} = ${sumN}/${cD}.`,
        `Leftover: 1 whole - ${sumN}/${cD} = ${cD}/${cD} - ${sumN}/${cD} = ${answer}.`
      ];
      hint = `First, find the total fraction eaten. Then subtract that from 1 whole (${cD}/${cD}).`;
    } else {
      let structText;
      if (Math.random() > 0.5) {
        structText = `STORY: A farmer plants carrots on ${bN}/${bD} of his land and tomatoes on ${rN}/${cD} of his land. He leaves the rest of the land empty. What fraction of the land is empty?`;
      } else {
        structText = `STORY: ${names[0]} eats ${bN}/${bD} of a ${foodItem} for lunch and ${rN}/${cD} of it for dinner. What fraction of the ${foodItem} is left?`;
      }
      let shortText = `Calculate: 1 - (${bN}/${bD} + ${rN}/${cD}).`;
      askText = getQText(structText, shortText);

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          modelType: "PART_WHOLE",
          parts: [
            { layoutSize: bN * mult },
            { layoutSize: rN },
            { layoutSize: restN, bgClass: "bg-slate-200" }
          ],
          topBrackets: [
            { size: bN * mult, label: `${bN}/${bD}` },
            { size: rN, label: `${rN}/${cD}` },
            { size: restN, label: "?" }
          ],
          whole: "1 Whole",
          isStatic: true
        }
      });

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Form equation for total used", expectedAnswer: `${bN}/${bD} + ${rN}/${cD}` },
            { label: "Convert and solve", expectedAnswer: `${bN * mult}/${cD} + ${rN}/${cD} = ${sumN}/${cD}` },
            { label: "Solve the question", expectedAnswer: `${cD}/${cD} - ${sumN}/${cD} = ${answer}` }
          ]
        });
      }
      hint = `Add the two fractions first, then subtract their sum from 1 whole (${cD}/${cD}).`;
      solutionSteps = [
        `${bN}/${bD} + ${rN}/${cD} = ${bN * mult}/${cD} + ${rN}/${cD} = ${sumN}/${cD}.`,
        `1 whole - ${sumN}/${cD} = ${cD}/${cD} - ${sumN}/${cD} = ${answer}.`
      ];
    }
  } else if (activeVariant === 'advanced_how_much_more') {
    let valid = false;
    let bD, mult, cD, bN, rN, diffN, simp;
    while (!valid) {
      bD = [2, 3, 4, 5, 6][Math.floor(Math.random() * 5)];
      mult = [2, 3, 4][Math.floor(Math.random() * 3)];
      cD = bD * mult;
      bN = Math.floor(Math.random() * (bD - 1)) + 1;
      rN = Math.floor(Math.random() * (cD - 1)) + 1;
      if ((bN * mult) > rN) {
        diffN = (bN * mult) - rN;
        simp = simplifyFraction(diffN, cD);
        if (simp.n !== diffN) valid = true; // ensure it can be simplified
      }
    }
    answer = `${simp.n}/${simp.d}`;

    if (isMCQ) {
      askText = `Bag X weighs ${bN}/${bD} kg. Bag Y weighs ${rN}/${cD} kg. What is the difference in their weights? (Simplest form)`;
      const dist1 = `${diffN}/${cD}`; // unsimplified
      const dist2 = `${simp.n + 1}/${simp.d}`;
      const dist3 = `${Math.abs(simp.n - 1) || 1}/${simp.d}`;
      mcqOptions = getUniqueOptions(answer, [dist1, dist2, dist3]);
      solutionSteps = [
        `Convert to a common denominator: ${bN}/${bD} = ${bN * mult}/${cD}.`,
        `Find the difference: ${bN * mult}/${cD} - ${rN}/${cD} = ${diffN}/${cD}.`,
        `Simplify: ${diffN}/${cD} = ${answer}.`
      ];
      hint = `Change the fractions to have the same denominator, subtract, then simplify.`;
    } else {
      let structText;
      if (Math.random() > 0.5) {
        const lengthItems = ['ribbon', 'rope', 'wire', 'string', 'yarn'];
        const lengthItem = lengthItems[Math.floor(Math.random() * lengthItems.length)];
        structText = `STORY: ${names[0]} has a piece of ${lengthItem} that is ${bN}/${bD} metre long. ${names[1]} has a piece of ${lengthItem} that is ${rN}/${cD} metre long. How much longer is ${names[0]}'s ${lengthItem} than ${names[1]}'s ${lengthItem}? Express your answer in simplest form.`;
      } else {
        structText = `STORY: ${names[0]} ate ${bN}/${bD} of a ${foodItem}. ${names[1]} ate ${rN}/${cD} of the same ${foodItem}. How much more did ${names[0]} eat than ${names[1]}? Express your answer in simplest form.`;
      }
      let shortText = `Find the difference between ${bN}/${bD} and ${rN}/${cD}. Express in simplest form.`;
      askText = getQText(structText, shortText);

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Form equation", expectedAnswer: `${bN}/${bD} - ${rN}/${cD}` },
            { label: "Convert and solve", expectedAnswer: `${bN * mult}/${cD} - ${rN}/${cD} = ${diffN}/${cD}` },
            { label: "Simplify", expectedAnswer: answer }
          ]
        });
      }
      hint = `First, convert the fractions to have the same denominator, subtract, then simplify your final answer.`;
      solutionSteps = [
        `${bN}/${bD} = ${bN * mult}/${cD}.`,
        `${bN * mult}/${cD} - ${rN}/${cD} = ${diffN}/${cD}.`,
        `Simplifying ${diffN}/${cD} gives ${answer}.`
      ];
    }
  } else if (activeVariant === 'advanced_multi_operation') {
    // A + B - C or A - B + C
    let cD = [8, 10, 12][Math.floor(Math.random() * 3)];
    let seq = [
      { n: 1, d: 2 }, // 4/8, 5/10, 6/12
      { n: Math.floor(Math.random() * (cD/2 - 1)) + 1, d: cD }, // addition addend
      { n: Math.floor(Math.random() * (cD/2 - 1)) + 1, d: cD } // subtraction subtrahend
    ];
    let startN = seq[0].n * (cD / seq[0].d);
    let finalN = startN + seq[1].n - seq[2].n;
    if (finalN <= 0) finalN = 1; // safety
    
    let simp = simplifyFraction(finalN, cD);
    answer = `${simp.n}/${simp.d}`;

    if (isMCQ) {
      askText = `Calculate: ${seq[0].n}/${seq[0].d} + ${seq[1].n}/${cD} - ${seq[2].n}/${cD}.`;
      const dist1 = `${finalN}/${cD}`;
      const dist2 = `${finalN + 1}/${cD}`;
      const dist3 = `${Math.abs(finalN - 1) || 1}/${cD}`;
      mcqOptions = getUniqueOptions(answer, [dist1, dist2, dist3]);
      solutionSteps = [
        `Change ${seq[0].n}/${seq[0].d} to ${startN}/${cD}.`,
        `Add: ${startN}/${cD} + ${seq[1].n}/${cD} = ${startN + seq[1].n}/${cD}.`,
        `Subtract: ${startN + seq[1].n}/${cD} - ${seq[2].n}/${cD} = ${finalN}/${cD}.`,
        `Simplify if possible: ${answer}.`
      ];
      hint = `Solve it step by step from left to right. Convert ${seq[0].n}/${seq[0].d} first.`;
    } else {
      let structText;
      if (Math.random() > 0.5) {
        structText = `STORY: A jug contains ${seq[0].n}/${seq[0].d} litre of water. ${names[0]} pours in another ${seq[1].n}/${cD} litre. Later, they drink ${seq[2].n}/${cD} litre. How much water is in the jug now?`;
      } else {
        structText = `STORY: ${names[0]} has a ribbon that is ${seq[0].n}/${seq[0].d} metre long. They tie another piece that is ${seq[1].n}/${cD} metre long to it. Then they cut off ${seq[2].n}/${cD} metre. How long is the ribbon now?`;
      }
      let shortText = `Start with ${seq[0].n}/${seq[0].d}. Add ${seq[1].n}/${cD}. Then subtract ${seq[2].n}/${cD}. What is the final fraction?`;
      askText = getQText(structText, shortText);

      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Form equation 1", expectedAnswer: `${seq[0].n}/${seq[0].d} + ${seq[1].n}/${cD}` },
            { label: "Convert and solve 1", expectedAnswer: `${startN}/${cD} + ${seq[1].n}/${cD} = ${startN + seq[1].n}/${cD}` },
            { label: "Form equation 2", expectedAnswer: `${startN + seq[1].n}/${cD} - ${seq[2].n}/${cD}` },
            { label: "Solve equation 2", expectedAnswer: `${startN + seq[1].n}/${cD} - ${seq[2].n}/${cD} = ${finalN}/${cD}` },
            { label: "Simplify", expectedAnswer: answer }
          ]
        });
      }
      hint = `Take it one step at a time! First convert, then add, then subtract.`;
      solutionSteps = [
        `${seq[0].n}/${seq[0].d} = ${startN}/${cD}.`,
        `${startN}/${cD} + ${seq[1].n}/${cD} = ${startN + seq[1].n}/${cD}.`,
        `${startN + seq[1].n}/${cD} - ${seq[2].n}/${cD} = ${finalN}/${cD}.`,
        `Simplified to ${answer}.`
      ];
    }
  } else if (activeVariant === 'advanced_reverse_logic') {
    let bD = [2, 3, 4, 5, 6][Math.floor(Math.random() * 5)];
    let mult = [2, 3, 4][Math.floor(Math.random() * 3)];
    let cD = bD * mult;
    
    // We want to solve by either Addition (if the story was subtraction) 
    // or Subtraction (if the story was addition).
    const solveByAdd = Math.random() > 0.5;
    
    let bN = Math.floor(Math.random() * (bD - 1)) + 1; // amount added or subtracted
    
    let startN, finalN;
    
    if (solveByAdd) {
      // Story: Start - bN = finalN  => Start = finalN + bN
      finalN = Math.floor(Math.random() * (cD - (bN * mult) - 1)) + 1;
      startN = finalN + (bN * mult);
    } else {
      // Story: Start + bN = finalN => Start = finalN - bN
      startN = Math.floor(Math.random() * (cD - (bN * mult) - 1)) + 1;
      finalN = startN + (bN * mult);
    }
    
    let simp = simplifyFraction(startN, cD);
    answer = `${simp.n}/${simp.d}`;

    if (isMCQ) {
      let eqSymbol = solveByAdd ? '-' : '+';
      askText = `[ ] ${eqSymbol} ${bN}/${bD} = ${finalN}/${cD}. What is the starting fraction?`;
      const dist1 = `${Math.abs((bN * mult) - finalN) || 1}/${cD}`;
      const dist2 = `${startN + 1}/${cD}`;
      const dist3 = `${startN - 1}/${cD}`;
      mcqOptions = getUniqueOptions(answer, [dist1, dist2, dist3]);
      
      let reverseOp = solveByAdd ? '+' : '-';
      solutionSteps = [
        `We are looking for the starting amount. To reverse the operation, we ${solveByAdd ? 'add' : 'subtract'}!`,
        `Convert ${bN}/${bD} to ${bN * mult}/${cD}.`,
        `${finalN}/${cD} ${reverseOp} ${bN * mult}/${cD} = ${startN}/${cD}.`,
        `Simplified to ${answer}.`
      ];
      hint = `To find what you started with, reverse the operation!`;
    } else {
      let structText;
      if (solveByAdd) {
        if (Math.random() > 0.5) {
          structText = `STORY: ${names[0]} cuts ${bN}/${bD} of a metre off a roll of string. They measure the leftover string and find it is exactly ${finalN}/${cD} of a metre long. What was the length of the string at first?`;
        } else {
          structText = `STORY: ${names[0]} gives away ${bN}/${bD} of their ${foodItem}. They have exactly ${finalN}/${cD} of the ${foodItem} left. What fraction of the ${foodItem} did they start with?`;
        }
      } else {
        if (Math.random() > 0.5) {
          structText = `STORY: ${names[0]} has a piece of ribbon. They tie another piece that is ${bN}/${bD} of a metre long to it. The ribbon is now exactly ${finalN}/${cD} of a metre long. What was the length of the ribbon at first?`;
        } else {
          structText = `STORY: ${names[0]} bakes a pie. They add ${bN}/${bD} kg of flour, making the total mass of the pie exactly ${finalN}/${cD} kg. What was the mass of the pie before adding the flour?`;
        }
      }
      
      let shortText = solveByAdd 
        ? `I subtract ${bN}/${bD} from a fraction and get ${finalN}/${cD}. What was my starting fraction?`
        : `I add ${bN}/${bD} to a fraction and get ${finalN}/${cD}. What was my starting fraction?`;
        
      askText = getQText(structText, shortText);
      
      let eqSymbol = solveByAdd ? '+' : '-';
      
      if (isStructure) {
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Form equation", expectedAnswer: `${finalN}/${cD} ${eqSymbol} ${bN}/${bD}` },
            { label: "Convert and solve", expectedAnswer: `${finalN}/${cD} ${eqSymbol} ${bN * mult}/${cD} = ${startN}/${cD}` },
            { label: "Simplify", expectedAnswer: answer }
          ]
        });
      }
      hint = solveByAdd 
        ? `If you subtract to get the final amount, you must add to find the starting amount!`
        : `If you add to get the final amount, you must subtract to find the starting amount!`;
        
      solutionSteps = [
        solveByAdd 
          ? `To find the total starting amount, add the part given away and the part left over.`
          : `To find the starting amount, subtract the part added from the final amount.`,
        `${bN}/${bD} = ${bN * mult}/${cD}.`,
        `${finalN}/${cD} ${eqSymbol} ${bN * mult}/${cD} = ${startN}/${cD}.`,
        `Simplified to ${answer}.`
      ];
    }
  } else if (activeVariant === 'advanced_unrelated_denominator') {
    let pairs = [[2, 3], [3, 4], [4, 5], [2, 5]];
    let pair = pairs[Math.floor(Math.random() * pairs.length)];
    
    if (isMCQ) {
      const f1 = pair[0];
      const f2 = pair[1];
      const related = f1 * 2;
      
      askText = `Why can we easily add 1/${f1} and 1/${related}, but NOT 1/${f1} and 1/${f2} in Primary 3?`;
      answer = `Because ${related} is in the ${f1} times table, but ${f2} is not in the ${f1} times table.`;
      
      mcqOptions = getUniqueOptions(answer, [
        `Because 1/${f2} is smaller than 1/${f1}.`,
        `Because ${f1} and ${f2} are both even numbers.`,
        `Because we can directly add denominators.`
      ]);
      
      solutionSteps = [
        `In Primary 3, we learn to add related fractions, where one denominator is a multiple of the other (e.g., ${f1} and ${related}).`,
        `${f1} and ${f2} are not related because ${f2} is not in the ${f1} times table.`
      ];
      hint = `Think about whether one denominator can be easily multiplied to become the other denominator.`;
    } else {
      let structText = `STORY: ${names[0]} tries to add 1/${pair[0]} and 1/${pair[1]}. They realize that ${pair[1]} is not in the ${pair[0]} times table. Can they solve this by just changing one fraction, or do they need to change both? (Type "One" or "Both").`;
      let shortText = `Can you directly add the numerators of 1/${pair[0]} and 1/${pair[1]} without converting both fractions first? (Yes/No).`;
      askText = getQText(structText, shortText);

      if (isStructure) {
        answer = "Both";
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Is ${pair[1]} a multiple of ${pair[0]}?`, expectedAnswer: "No" },
            { label: "Do they need to change one or both?", expectedAnswer: answer }
          ]
        });
        solutionSteps = [
          `Since ${pair[1]} is not a multiple of ${pair[0]}, they do not share a simple related denominator.`,
          `Therefore, they cannot just change one fraction. They must change both.`
        ];
        hint = `If one denominator is not a multiple of the other, you cannot just change one fraction to match it.`;
      } else {
        answer = "No";
        solutionSteps = [
          `You cannot directly add fractions with different denominators.`,
          `Since ${pair[1]} is not a multiple of ${pair[0]}, you would have to change both fractions.`
        ];
        hint = `Can you add fractions if their bottom numbers are different?`;
      }
    }
  }

  const mcqOptionsStr = mcqOptions ? JSON.stringify(mcqOptions) : "[]";
  const solutionStepsStr = solutionSteps ? JSON.stringify(solutionSteps) : "[]";

  const questionInstruction = askText.includes('STORY:')
    ? `you must rewrite the text following 'STORY:' to create a highly engaging, creative word problem for a Primary 3 student. However, you MUST strictly follow these rules:\n1. Preserve the exact mathematical values and operations.\n2. DO NOT add any extra unrequested questions (e.g., do not add 'How many altogether?').\n3. Keep the final question sentence exactly as intended.`
    : `you MUST use the exact string provided in 'askText'. DO NOT paraphrase or rewrite it.`;

  return {
    aiPrompt: `You are an expert Primary 3 math question generator.
    
    Question parameters:
    - askText: ${JSON.stringify(askText)}
    - answer: ${JSON.stringify(answer)}
    - options: ${mcqOptionsStr}
    - hint: ${JSON.stringify(hint)}
    - solutionSteps: ${solutionStepsStr}
    
    CRITICAL INSTRUCTION: For 'questionText', ${questionInstruction}
    CRITICAL INSTRUCTION: For 'finalAnswer', you MUST use the exact string provided in 'answer'.
    CRITICAL INSTRUCTION: For 'options', you MUST use the exact array provided in 'options' (if applicable).
    CRITICAL INSTRUCTION: For 'solutionSteps', you MUST use the exact array provided in 'solutionSteps'.
    CRITICAL INSTRUCTION: For 'hint', you MUST use the exact string provided in 'hint'.
    CRITICAL INSTRUCTION: For 'visualEngine', you MUST use the EXACT object provided in the FORMAT INSTRUCTIONS below. DO NOT modify it or add properties like modeldescription.
    CRITICAL INSTRUCTION: For 'inputRequirement', you MUST use the EXACT object provided in the FORMAT INSTRUCTIONS below. DO NOT modify it.
    
    ${getFormatInstructions(visualEngineStr, inputRequirementStr)}`,
    metadata: { difficulty: 'advanced', steps: 1, logic: activeVariant }
  };
};
