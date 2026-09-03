import { getRandomNames, getKgItems, getRandomLiquids, getRandomCountableItems } from '@/lib/utils/variable-bank';

export const advancedLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
  const names = getRandomNames(2);
  const kgFoods = getKgItems(3);
  const liquids = getRandomLiquids(3);
  const general = getRandomCountableItems(2);
  
  let askText, answer, options, solutionSteps, hint;
  let visualEngineStr = `{"componentToRender": "NONE", "componentData": {}}`;
  let inputRequirementStr = null;

  const units = [
    { big: "km", small: "m", factor: 1000 },
    { big: "kg", small: "g", factor: 1000 },
    { big: "ℓ", small: "ml", factor: 1000 }
  ];
  const selectedUnit = units[Math.floor(Math.random() * units.length)];
  const fullSmallLabel = selectedUnit.small === 'ml' ? 'millilitres' : selectedUnit.small === 'g' ? 'grams' : 'metres';
  const fullBigLabel = selectedUnit.big === 'ℓ' ? 'Litres' : selectedUnit.big === 'kg' ? 'kilograms' : 'kilometres';

  switch (activeVariant) {
    case 'advanced_addition_regrouping': {
      // Variant 11: Addition with Regrouping (Convert First Strategy)
      const b1 = Math.floor(Math.random() * 3) + 1; // 1-3
      const s1 = Math.floor(Math.random() * 5) * 100 + 500; // 500-900
      const b2 = Math.floor(Math.random() * 3) + 1; // 1-3
      const s2 = Math.floor(Math.random() * 5) * 100 + 500; // 500-900
      
      const v1G = b1 * 1000 + s1;
      const v2G = b2 * 1000 + s2;
      const totalG = v1G + v2G;
      
      const totalB = Math.floor(totalG / 1000);
      const totalS = totalG % 1000;
      
      answer = `${totalB} ${selectedUnit.big} ${totalS} ${selectedUnit.small}`;

      let label1, label2;
      if (selectedUnit.big === 'km') {
        label1 = "Monday's distance"; label2 = "Tuesday's distance";
      } else if (selectedUnit.big === 'kg') {
        label1 = `${kgFoods[0].item}'s mass`; label2 = `${kgFoods[1].item}'s mass`;
      } else {
        label1 = `${liquids[0]}'s volume`; label2 = `${liquids[1]}'s volume`;
      }

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "PART_WHOLE",
          isStatic: true,
          parts: [
            { value: label1, size: v1G, layoutSize: v1G, segments: 1 },
            { value: label2, size: v2G, layoutSize: v2G, segments: 1 }
          ],
          whole: "?"
        }
      });

      if (isMCQ) {
        askText = `${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small} + ${b2} ${selectedUnit.big} ${s2} ${selectedUnit.small} = ?`;
        const d1 = `${totalB - 1} ${selectedUnit.big} ${totalS} ${selectedUnit.small}`;
        const d2 = `${b1 + b2} ${selectedUnit.big} ${s1 + s2} ${selectedUnit.small}`;
        const d3 = `${totalB} ${selectedUnit.big} ${Math.abs(totalS - 100)} ${selectedUnit.small}`;
        options = [answer, d1, d2, d3].sort(() => 0.5 - Math.random());
      } else if (isShort) {
        askText = `Add ${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small} and ${b2} ${selectedUnit.big} ${s2} ${selectedUnit.small}. Answer in ${selectedUnit.big} and ${selectedUnit.small}.`;
      } else {
        const stories = {
          "km": `${names[0]} cycles ${b1} km ${s1} m on Monday and ${b2} km ${s2} m on Tuesday. What is the total distance cycled in km and m?`,
          "kg": `${names[0]} buys a ${kgFoods[0].item} weighing ${b1} kg ${s1} g and a ${kgFoods[1].item} weighing ${b2} kg ${s2} g. What is the total mass in kg and g?`,
          "ℓ": `A chef mixes ${b1} ℓ ${s1} ml of ${liquids[0]} and ${b2} ℓ ${s2} ml of ${liquids[1]}. What is the total volume in ℓ and ml?`
        };
        
        let structText = `STORY: ${stories[selectedUnit.big]}`;
        structText += `\n\nCRITICAL INSTRUCTION: Rewrite the story dynamically. Ask for the total in ${selectedUnit.big} and ${selectedUnit.small}.`;
        askText = structText;

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Step 1: Convert ${label1} to ${fullSmallLabel}`, expectedAnswer: `${v1G} ${selectedUnit.small}`, acceptedAnswers: [`${v1G}${selectedUnit.small}`, `${v1G}`] },
            { label: `Step 2: Convert ${label2} to ${fullSmallLabel}`, expectedAnswer: `${v2G} ${selectedUnit.small}`, acceptedAnswers: [`${v2G}${selectedUnit.small}`, `${v2G}`] },
            { label: `Step 3: Equation to find the total in ${selectedUnit.small}`, expectedAnswer: `${v1G} + ${v2G} = ${totalG}`, acceptedAnswers: [`${v1G}+${v2G}=${totalG}`, totalG.toString(), `${totalG} ${selectedUnit.small}`] },
            { label: `Step 4: Convert back to ${selectedUnit.big} and ${selectedUnit.small}`, expectedAnswer: answer, acceptedAnswers: [answer.replace(/ /g, "")] }
          ]
        });
      }

      solutionSteps = [
        `Convert to ${selectedUnit.small}: ${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small} = ${v1G} ${selectedUnit.small}.`,
        `Convert to ${selectedUnit.small}: ${b2} ${selectedUnit.big} ${s2} ${selectedUnit.small} = ${v2G} ${selectedUnit.small}.`,
        `Add them: ${v1G} + ${v2G} = ${totalG} ${selectedUnit.small}.`,
        `Convert back: ${totalG} ${selectedUnit.small} = ${answer}.`
      ];
      hint = `Convert both measurements into ${selectedUnit.small} first, then add them up!`;
      break;
    }

    case 'advanced_subtraction_regrouping': {
      // Variant 12: Subtraction with Regrouping (Borrowing Strategy)
      const b1 = Math.floor(Math.random() * 3) + 3; // 3-5
      const s1 = Math.floor(Math.random() * 3) * 100 + 100; // 100-300
      const b2 = Math.floor(Math.random() * 2) + 1; // 1-2
      const s2 = Math.floor(Math.random() * 4) * 100 + 500; // 500-800
      
      const v1G = b1 * 1000 + s1;
      const v2G = b2 * 1000 + s2;
      const remG = v1G - v2G;
      
      const remB = Math.floor(remG / 1000);
      const remS = remG % 1000;
      
      answer = `${remB} ${selectedUnit.big} ${remS} ${selectedUnit.small}`;

      let labelTotal, labelUsed, labelLeft;
      if (selectedUnit.big === 'km') {
        labelTotal = "Total distance"; labelUsed = "Distance used"; labelLeft = "Distance left";
      } else if (selectedUnit.big === 'kg') {
        labelTotal = `Total ${kgFoods[0].item}`; labelUsed = `${kgFoods[0].item} used`; labelLeft = `${kgFoods[0].item} left`;
      } else {
        labelTotal = `Total ${liquids[0]}`; labelUsed = `${liquids[0]} used`; labelLeft = `${liquids[0]} left`;
      }

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "PART_WHOLE",
          isStatic: true,
          parts: [
            { value: labelUsed, size: v2G, layoutSize: v2G, segments: 1 },
            { value: "?", size: remG, layoutSize: remG, segments: 1 }
          ],
          whole: labelTotal,
          wholeLayoutSize: v1G
        }
      });

      if (isMCQ) {
        askText = `${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small} - ${b2} ${selectedUnit.big} ${s2} ${selectedUnit.small} = ?`;
        const d1 = `${remB} ${selectedUnit.big} ${remS + 100} ${selectedUnit.small}`;
        const d2 = `${remB + 1} ${selectedUnit.big} ${remS} ${selectedUnit.small}`;
        const d3 = `${Math.max(1, remB - 1)} ${selectedUnit.big} ${remS} ${selectedUnit.small}`;
        options = [answer, d1, d2, d3].sort(() => 0.5 - Math.random());
      } else if (isShort) {
        askText = `${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small} - ${b2} ${selectedUnit.big} ${s2} ${selectedUnit.small} = ? Answer in ${selectedUnit.big} and ${selectedUnit.small}.`;
      } else {
        const stories = {
          "km": `A journey is ${b1} km ${s1} m long. ${names[0]} travels ${b2} km ${s2} m. How much further is there left in km and m?`,
          "kg": `${names[0]} has ${b1} kg ${s1} g of ${kgFoods[0].item}. ${names[1]} uses ${b2} kg ${s2} g. How much ${kgFoods[0].item} is left in kg and g?`,
          "ℓ": `A container has ${b1} ℓ ${s1} ml of ${liquids[0]}. ${b2} ℓ ${s2} ml is used. How much ${liquids[0]} is left in ℓ and ml?`
        };
        
        let structText = `STORY: ${stories[selectedUnit.big]}`;
        structText += `\n\nCRITICAL INSTRUCTION: Rewrite the story dynamically. Ask for the remaining amount in ${selectedUnit.big} and ${selectedUnit.small}.`;
        askText = structText;

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Step 1: Convert ${labelTotal} to ${fullSmallLabel}`, expectedAnswer: `${v1G} ${selectedUnit.small}`, acceptedAnswers: [`${v1G}${selectedUnit.small}`, `${v1G}`] },
            { label: `Step 2: Convert ${labelUsed} to ${fullSmallLabel}`, expectedAnswer: `${v2G} ${selectedUnit.small}`, acceptedAnswers: [`${v2G}${selectedUnit.small}`, `${v2G}`] },
            { label: `Step 3: Equation to subtract in ${selectedUnit.small}`, expectedAnswer: `${v1G} - ${v2G} = ${remG}`, acceptedAnswers: [`${v1G}-${v2G}=${remG}`, remG.toString(), `${remG} ${selectedUnit.small}`] },
            { label: `Step 4: Convert back to ${selectedUnit.big} and ${selectedUnit.small}`, expectedAnswer: answer, acceptedAnswers: [answer.replace(/ /g, "")] }
          ]
        });
      }

      solutionSteps = [
        `Convert to ${selectedUnit.small}: ${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small} = ${v1G} ${selectedUnit.small}.`,
        `Convert to ${selectedUnit.small}: ${b2} ${selectedUnit.big} ${s2} ${selectedUnit.small} = ${v2G} ${selectedUnit.small}.`,
        `Subtract them: ${v1G} - ${v2G} = ${remG} ${selectedUnit.small}.`,
        `Convert back: ${remG} ${selectedUnit.small} = ${answer}.`
      ];
      hint = `Since you cannot subtract ${s2} from ${s1} directly, convert the whole measurement into ${selectedUnit.small} first!`;
      break;
    }

    case 'advanced_three_part_total': {
      // Variant 13: The 3-Part Total (Add Twice)
      const b1 = Math.floor(Math.random() * 2) + 1; // 1-2
      const s1 = Math.floor(Math.random() * 3) * 100 + 100; // 100-300
      const s2 = Math.floor(Math.random() * 5) * 100 + 400; // 400-800
      const s3 = Math.floor(Math.random() * 5) * 100 + 400; // 400-800
      
      const v1G = b1 * 1000 + s1;
      const totalG = v1G + s2 + s3;
      const totalB = Math.floor(totalG / 1000);
      const totalS = totalG % 1000;
      
      answer = `${totalB} ${selectedUnit.big} ${totalS} ${selectedUnit.small}`;

      let label1, label2, label3;
      if (selectedUnit.big === 'km') {
        label1 = "Distance run"; label2 = "Distance cycled"; label3 = "Distance walked";
      } else if (selectedUnit.big === 'kg') {
        label1 = `${kgFoods[0].item}'s mass`; label2 = `${kgFoods[1].item}'s mass`; label3 = `${kgFoods[2].item}'s mass`;
      } else {
        label1 = `${liquids[0]}'s volume`; label2 = `${liquids[1]}'s volume`; label3 = `${liquids[2]}'s volume`;
      }

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "PART_WHOLE",
          isStatic: true,
          parts: [
            { value: label1, size: v1G, layoutSize: v1G, segments: 1 },
            { value: label2, size: s2, layoutSize: s2, segments: 1 },
            { value: label3, size: s3, layoutSize: s3, segments: 1 }
          ],
          whole: "?"
        }
      });

      if (isMCQ) {
        askText = `Total of ${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small}, ${s2} ${selectedUnit.small}, and ${s3} ${selectedUnit.small}.`;
        const d1 = `${totalB + 1} ${selectedUnit.big} ${totalS} ${selectedUnit.small}`;
        const d2 = `${totalB} ${selectedUnit.big} ${Math.abs(totalS - 100)} ${selectedUnit.small}`;
        const d3 = `${Math.max(1, totalB - 1)} ${selectedUnit.big} ${totalS} ${selectedUnit.small}`;
        options = [answer, d1, d2, d3].sort(() => 0.5 - Math.random());
      } else if (isShort) {
        askText = `Add ${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small}, ${s2} ${selectedUnit.small}, and ${s3} ${selectedUnit.small}.`;
      } else {
        const stories = {
          "km": `${names[0]} runs ${b1} km ${s1} m, cycles ${s2} m, and walks ${s3} m. What is the total distance covered in km and m?`,
          "kg": `${names[0]} buys ${b1} kg ${s1} g of ${kgFoods[0].item}, ${s2} g of ${kgFoods[1].item}, and ${s3} g of ${kgFoods[2].item}. What is the total mass in kg and g?`,
          "ℓ": `A recipe mixes ${b1} ℓ ${s1} ml of ${liquids[0]}, ${s2} ml of ${liquids[1]}, and ${s3} ml of ${liquids[2]}. What is the total volume in ℓ and ml?`
        };
        
        let structText = `STORY: ${stories[selectedUnit.big]}`;
        structText += `\n\nCRITICAL INSTRUCTION: Rewrite the story dynamically. Ask for the total in ${selectedUnit.big} and ${selectedUnit.small}.`;
        askText = structText;

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Step 1: Convert ${label1} to ${fullSmallLabel}`, expectedAnswer: `${v1G} ${selectedUnit.small}`, acceptedAnswers: [`${v1G}${selectedUnit.small}`, `${v1G}`] },
            { label: `Step 2: Equation to add all three in ${selectedUnit.small}`, expectedAnswer: `${v1G} + ${s2} + ${s3} = ${totalG}`, acceptedAnswers: [`${v1G}+${s2}+${s3}=${totalG}`, totalG.toString(), `${totalG} ${selectedUnit.small}`] },
            { label: `Step 3: Convert the total to ${selectedUnit.big} and ${selectedUnit.small}`, expectedAnswer: answer, acceptedAnswers: [answer.replace(/ /g, "")] }
          ]
        });
      }

      solutionSteps = [
        `Convert to ${selectedUnit.small}: ${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small} = ${v1G} ${selectedUnit.small}.`,
        `Add them all: ${v1G} + ${s2} + ${s3} = ${totalG} ${selectedUnit.small}.`,
        `Convert back: ${totalG} ${selectedUnit.small} = ${answer}.`
      ];
      hint = `Convert all the measurements into the smaller unit (${selectedUnit.small}), then add them all together!`;
      break;
    }

    case 'advanced_two_step_comparison': {
      // Variant 14: The 2-Step Comparison (Find Item B, then Total)
      const b1 = Math.floor(Math.random() * 3) + 2; // 2-4
      const s1 = Math.floor(Math.random() * 4) * 100 + 100; // 100-400
      const diff = Math.floor(Math.random() * 4) * 100 + 400; // 400-700
      
      const v1G = b1 * 1000 + s1;
      const v2G = v1G - diff;
      const totalG = v1G + v2G;
      
      const totalB = Math.floor(totalG / 1000);
      const totalS = totalG % 1000;
      
      answer = `${totalG} ${selectedUnit.small}`; 

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "COMPARISON",
          isStatic: true,
          bar1: { name: `A`, size: v1G, layoutSize: v1G, value: `${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small}`, segments: 1 },
          bar2: { name: `B`, size: v2G, layoutSize: v2G, value: "?", segments: 1 },
          difference: { displayValue: `${diff} ${selectedUnit.small}` },
          whole: "?"
        }
      });

      if (isMCQ) {
        askText = `Path X is ${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small}. Path Y is ${diff} ${selectedUnit.small} shorter. What is the total distance in ${selectedUnit.small}?`;
        const d1 = `${totalG + 100} ${selectedUnit.small}`;
        const d2 = `${v2G} ${selectedUnit.small}`;
        const d3 = `${totalG - 100} ${selectedUnit.small}`;
        options = [answer, d1, d2, d3].sort(() => 0.5 - Math.random());
      } else if (isShort) {
        askText = `Item A is ${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small}. Item B is ${diff} ${selectedUnit.small} less. What is the total of both in ${selectedUnit.small}?`;
      } else {
        const stories = {
          "km": `Path A is ${b1} km ${s1} m long. Path B is ${diff} m shorter than Path A. What is the total length of both paths in m?`,
          "kg": `A bag of ${kgFoods[0].item} weighs ${b1} kg ${s1} g. A bag of ${kgFoods[1].item} is ${diff} g lighter. What is the total mass of both bags in g?`,
          "ℓ": `A jug of ${liquids[0]} holds ${b1} ℓ ${s1} ml. A jug of ${liquids[1]} holds ${diff} ml less. What is the total volume in ml?`
        };
        
        let structText = `STORY: ${stories[selectedUnit.big]}`;
        structText += `\n\nCRITICAL INSTRUCTION: Rewrite the story dynamically. Emphasize that the student needs to find the TOTAL of both items in ${selectedUnit.small}.`;
        askText = structText;

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Step 1: Convert Item A to ${fullSmallLabel}`, expectedAnswer: `${v1G} ${selectedUnit.small}`, acceptedAnswers: [`${v1G}${selectedUnit.small}`, `${v1G}`] },
            { label: `Step 2: Equation to find Item B in ${selectedUnit.small}`, expectedAnswer: `${v1G} - ${diff} = ${v2G}`, acceptedAnswers: [`${v1G}-${diff}=${v2G}`, v2G.toString(), `${v2G} ${selectedUnit.small}`] },
            { label: `Step 3: Equation to find the total in ${selectedUnit.small}`, expectedAnswer: `${v1G} + ${v2G} = ${totalG}`, acceptedAnswers: [`${v1G}+${v2G}=${totalG}`, totalG.toString(), `${totalG} ${selectedUnit.small}`] }
          ]
        });
      }

      solutionSteps = [
        `Convert Item A: ${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small} = ${v1G} ${selectedUnit.small}.`,
        `Find Item B: ${v1G} - ${diff} = ${v2G} ${selectedUnit.small}.`,
        `Find Total: ${v1G} + ${v2G} = ${totalG} ${selectedUnit.small}.`
      ];
      hint = `First, find the value of the second item by subtracting. Then, add both items together to get the total!`;
      break;
    }

    case 'advanced_remaining_multiple_uses': {
      // Variant 15: Remaining After Multiple Uses (Subtract Twice)
      const whole = Math.floor(Math.random() * 3) + 3; // 3-5
      const b1 = Math.floor(Math.random() * 2) + 1; // 1-2
      const s1 = Math.floor(Math.random() * 3) * 100 + 100; // 100-300
      const s2 = Math.floor(Math.random() * 5) * 100 + 500; // 500-900
      
      const v1G = b1 * 1000 + s1;
      const usedTotal = v1G + s2;
      const remG = (whole * 1000) - usedTotal;
      
      answer = `${remG} ${selectedUnit.small}`;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "PART_WHOLE",
          isStatic: true,
          parts: [
            { value: `${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small}`, size: v1G, layoutSize: v1G, segments: 1 },
            { value: `${s2} ${selectedUnit.small}`, size: s2, layoutSize: s2, segments: 1 },
            { value: "?", size: remG, layoutSize: remG, segments: 1 }
          ],
          whole: `${whole} ${selectedUnit.big}`,
          wholeLayoutSize: whole * 1000
        }
      });

      if (isMCQ) {
        askText = `Start with ${whole} ${selectedUnit.big}. Use ${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small} and ${s2} ${selectedUnit.small}. Amount left in ${selectedUnit.small}?`;
        const d1 = `${remG + 100} ${selectedUnit.small}`;
        const d2 = `${usedTotal} ${selectedUnit.small}`;
        const d3 = `${remG - 100} ${selectedUnit.small}`;
        options = [answer, d1, d2, d3].sort(() => 0.5 - Math.random());
      } else if (isShort) {
        askText = `Start with ${whole} ${selectedUnit.big}. Subtract ${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small} and ${s2} ${selectedUnit.small}. How much is left in ${selectedUnit.small}?`;
      } else {
        const stories = {
          "km": `${names[0]} has a ${whole} km journey. They travel ${b1} km ${s1} m, then ${s2} m. How much further is left in m?`,
          "kg": `${names[0]} has ${whole} kg of ${kgFoods[0].item}. They use ${b1} kg ${s1} g and ${s2} g. How much ${kgFoods[0].item} is left in g?`,
          "ℓ": `A container holds ${whole} ℓ of ${liquids[0]}. ${b1} ℓ ${s1} ml is used first, and ${s2} ml is used later. How much ${liquids[0]} is left in ml?`
        };
        
        let structText = `STORY: ${stories[selectedUnit.big]}`;
        structText += `\n\nCRITICAL INSTRUCTION: Rewrite the story dynamically. Ask for the remaining amount in ${selectedUnit.small}.`;
        askText = structText;

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Step 1: Convert the total to ${fullSmallLabel}`, expectedAnswer: `${whole * 1000} ${selectedUnit.small}`, acceptedAnswers: [`${whole * 1000}${selectedUnit.small}`, `${whole * 1000}`] },
            { label: `Step 2: Equation to find total used in ${selectedUnit.small}`, expectedAnswer: `${v1G} + ${s2} = ${usedTotal}`, acceptedAnswers: [`${v1G}+${s2}=${usedTotal}`, usedTotal.toString(), `${usedTotal} ${selectedUnit.small}`] },
            { label: `Step 3: Equation to find amount left in ${selectedUnit.small}`, expectedAnswer: `${whole * 1000} - ${usedTotal} = ${remG}`, acceptedAnswers: [`${whole * 1000}-${usedTotal}=${remG}`, remG.toString(), `${remG} ${selectedUnit.small}`] }
          ]
        });
      }

      solutionSteps = [
        `Convert total: ${whole} ${selectedUnit.big} = ${whole * 1000} ${selectedUnit.small}.`,
        `Convert first used amount: ${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small} = ${v1G} ${selectedUnit.small}.`,
        `Find total used: ${v1G} + ${s2} = ${usedTotal} ${selectedUnit.small}.`,
        `Find remainder: ${whole * 1000} - ${usedTotal} = ${remG} ${selectedUnit.small}.`
      ];
      hint = `First, find the total amount used by adding the two parts together. Then, subtract the total used from the starting amount!`;
      break;
    }
  }

  const generatedPrompt = getFormatInstructions(visualEngineStr, inputRequirementStr);

  return {
    aiPrompt: `
You are a Primary 3 Math Teacher. Generate a ${difficulty} difficulty question about ${subtopic}.

${askText}

CRITICAL INSTRUCTION: 
- Keep names exactly as requested.
- Keep exact values.
- NO unrequested extra questions.
- Provide JSON ONLY.
- questionText must match the story logic but phrased engagingly.
- finalAnswer must be EXACTLY "${answer}".
- DO NOT alter or append numerical values to the strings inside visualEngine parts. Keep the exact text provided in the template.

${generatedPrompt}
`
  };
};
