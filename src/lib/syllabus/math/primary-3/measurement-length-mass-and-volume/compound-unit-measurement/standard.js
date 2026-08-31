import { getRandomNames, getKgItems, getRandomLiquids } from '@/lib/utils/variable-bank';

export const standardLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
  const names = getRandomNames(2);
  const kgFoods = getKgItems(2);
  const liquids = getRandomLiquids(2);
  
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
    case 'standard_pure_addition': {
      // Variant 6: Pure Addition (No Regrouping)
      const b1 = Math.floor(Math.random() * 3) + 1; // 1 to 3
      const s1 = Math.floor(Math.random() * 4) * 100 + 100; // 100 to 400
      const b2 = Math.floor(Math.random() * 3) + 1;
      const s2 = Math.floor(Math.random() * 4) * 100 + 100; // 100 to 400
      const totalB = b1 + b2;
      const totalS = s1 + s2; // Max 800, no regrouping
      answer = `${totalB} ${selectedUnit.big} ${totalS} ${selectedUnit.small}`;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "PART_WHOLE",
          isStatic: true,
          parts: [
            { value: `${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small}`, size: b1 * 1000 + s1, layoutSize: b1 * 1000 + s1, segments: 1 },
            { value: `${b2} ${selectedUnit.big} ${s2} ${selectedUnit.small}`, size: b2 * 1000 + s2, layoutSize: b2 * 1000 + s2, segments: 1 }
          ],
          whole: "?"
        }
      });

      if (isMCQ) {
        askText = `Add ${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small} and ${b2} ${selectedUnit.big} ${s2} ${selectedUnit.small}.`;
        const d1 = `${totalB + 1} ${selectedUnit.big} ${totalS} ${selectedUnit.small}`;
        const d2 = `${totalB} ${selectedUnit.big} ${totalS + 100} ${selectedUnit.small}`;
        const d3 = `${Math.max(1, totalB - 1)} ${selectedUnit.big} ${totalS} ${selectedUnit.small}`;
        options = [answer, d1, d2, d3].sort(() => 0.5 - Math.random());
        solutionSteps = [
          `Add the ${fullBigLabel} first: ${b1} + ${b2} = ${totalB} ${selectedUnit.big}.`,
          `Add the ${fullSmallLabel} next: ${s1} + ${s2} = ${totalS} ${selectedUnit.small}.`,
          `Total = ${totalB} ${selectedUnit.big} ${totalS} ${selectedUnit.small}.`
        ];
        hint = `Add the big units together, then add the small units together.`;
      } else {
        const stories = {
          "km": `${names[0]} walked ${b1} km ${s1} m on Saturday and ${b2} km ${s2} m on Sunday. What is the total distance walked?`,
          "kg": `${names[0]} bought a ${kgFoods[0].item} weighing ${b1} kg ${s1} g and a ${kgFoods[1].item} weighing ${b2} kg ${s2} g. What is their total mass?`,
          "ℓ": `${names[0]} mixed ${b1} ℓ ${s1} ml of ${liquids[0]} with ${b2} ℓ ${s2} ml of ${liquids[1]}. What is the total volume of liquid?`
        };
        
        let structText = `STORY: ${stories[selectedUnit.big]}`;
        let shortText = `Add ${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small} and ${b2} ${selectedUnit.big} ${s2} ${selectedUnit.small}.`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Step 1: Equation for ${fullBigLabel}`, expectedAnswer: `${b1} + ${b2} = ${totalB}`, acceptedAnswers: [`${b1}+${b2}=${totalB}`, totalB.toString(), `${totalB}${selectedUnit.big}`, `${totalB} ${selectedUnit.big}`] },
              { label: `Step 2: Equation for ${fullSmallLabel}`, expectedAnswer: `${s1} + ${s2} = ${totalS}`, acceptedAnswers: [`${s1}+${s2}=${totalS}`, totalS.toString(), `${totalS}${selectedUnit.small}`, `${totalS} ${selectedUnit.small}`] },
              { label: `Step 3: Total in ${selectedUnit.big} and ${selectedUnit.small}`, expectedAnswer: `${totalB} ${selectedUnit.big} ${totalS} ${selectedUnit.small}`, acceptedAnswers: [`${totalB}${selectedUnit.big}${totalS}${selectedUnit.small}`, `${totalB} ${selectedUnit.big} ${totalS} ${selectedUnit.small}`] }
            ]
          });
        }

        solutionSteps = [
          `1. Add the ${selectedUnit.big} first: ${b1} + ${b2} = ${totalB} ${selectedUnit.big}.`,
          `2. Add the ${selectedUnit.small} next: ${s1} + ${s2} = ${totalS} ${selectedUnit.small}.`,
          `3. Answer = ${totalB} ${selectedUnit.big} ${totalS} ${selectedUnit.small}.`
        ];
        hint = `Group the big units together, and group the small units together. Add them separately!`;
      }
      break;
    }

    case 'standard_pure_subtraction': {
      // Variant 7: Pure Subtraction (No Regrouping)
      const b1 = Math.floor(Math.random() * 3) + 4; // 4 to 6
      const s1 = Math.floor(Math.random() * 4) * 100 + 500; // 500 to 800
      const b2 = Math.floor(Math.random() * 2) + 1; // 1 to 2
      const s2 = Math.floor(Math.random() * 3) * 100 + 100; // 100 to 300
      const remB = b1 - b2;
      const remS = s1 - s2;
      answer = `${remB} ${selectedUnit.big} ${remS} ${selectedUnit.small}`;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "PART_WHOLE",
          isStatic: true,
          parts: [
            { value: `${b2} ${selectedUnit.big} ${s2} ${selectedUnit.small}`, size: b2 * 1000 + s2, layoutSize: b2 * 1000 + s2, segments: 1 },
            { value: "?", size: remB * 1000 + remS, layoutSize: remB * 1000 + remS, segments: 1 }
          ],
          whole: `${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small}`,
          wholeLayoutSize: b1 * 1000 + s1
        }
      });

      if (isMCQ) {
        askText = `${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small} - ${b2} ${selectedUnit.big} ${s2} ${selectedUnit.small} = ?`;
        const d1 = `${remB - 1} ${selectedUnit.big} ${remS} ${selectedUnit.small}`;
        const d2 = `${remB} ${selectedUnit.big} ${remS + 100} ${selectedUnit.small}`;
        const d3 = `${remB + 1} ${selectedUnit.big} ${remS} ${selectedUnit.small}`;
        options = [answer, d1, d2, d3].sort(() => 0.5 - Math.random());
        solutionSteps = [
          `Subtract the ${fullBigLabel} first: ${b1} - ${b2} = ${remB} ${selectedUnit.big}.`,
          `Subtract the ${fullSmallLabel} next: ${s1} - ${s2} = ${remS} ${selectedUnit.small}.`,
          `Result = ${remB} ${selectedUnit.big} ${remS} ${selectedUnit.small}.`
        ];
        hint = `Subtract the big units first, then subtract the small units.`;
      } else {
        const stories = {
          "km": `${names[0]} needs to run ${b1} km ${s1} m. After running ${b2} km ${s2} m, how much further does ${names[0]} need to run?`,
          "kg": `A ${kgFoods[0].item} has a mass of ${b1} kg ${s1} g. A ${kgFoods[1].item} has a mass of ${b2} kg ${s2} g. What is the difference in their mass?`,
          "ℓ": `A jug contained ${b1} ℓ ${s1} ml of ${liquids[0]}. ${names[0]} poured out ${b2} ℓ ${s2} ml. How much ${liquids[0]} is left in the jug?`
        };
        
        let structText = `STORY: ${stories[selectedUnit.big]}`;
        let shortText = `Subtract ${b2} ${selectedUnit.big} ${s2} ${selectedUnit.small} from ${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small}.`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Step 1: Equation for ${fullBigLabel}`, expectedAnswer: `${b1} - ${b2} = ${remB}`, acceptedAnswers: [`${b1}-${b2}=${remB}`, remB.toString(), `${remB}${selectedUnit.big}`, `${remB} ${selectedUnit.big}`] },
              { label: `Step 2: Equation for ${fullSmallLabel}`, expectedAnswer: `${s1} - ${s2} = ${remS}`, acceptedAnswers: [`${s1}-${s2}=${remS}`, remS.toString(), `${remS}${selectedUnit.small}`, `${remS} ${selectedUnit.small}`] },
              { label: `Step 3: Remaining amount in ${selectedUnit.big} and ${selectedUnit.small}`, expectedAnswer: `${remB} ${selectedUnit.big} ${remS} ${selectedUnit.small}`, acceptedAnswers: [`${remB}${selectedUnit.big}${remS}${selectedUnit.small}`, `${remB} ${selectedUnit.big} ${remS} ${selectedUnit.small}`] }
            ]
          });
        }

        solutionSteps = [
          `1. Subtract the ${selectedUnit.big} first: ${b1} - ${b2} = ${remB} ${selectedUnit.big}.`,
          `2. Subtract the ${selectedUnit.small} next: ${s1} - ${s2} = ${remS} ${selectedUnit.small}.`,
          `3. Answer = ${remB} ${selectedUnit.big} ${remS} ${selectedUnit.small}.`
        ];
        hint = `Subtract the same units from each other separately.`;
      }
      break;
    }

    case 'standard_reaching_next_whole': {
      // Variant 8: Reaching the Next Whole Unit (Shortfall)
      const whole = 1;
      const s1 = (Math.floor(Math.random() * 8) + 1) * 100 + (Math.floor(Math.random() * 2) * 50); // e.g. 150, 200, 350
      const shortfall = 1000 - s1;
      answer = `${shortfall} ${selectedUnit.small}`;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "PART_WHOLE",
          isStatic: true,
          parts: [
            { value: `${s1} ${selectedUnit.small}`, size: s1, layoutSize: s1, segments: 1 },
            { value: "?", size: shortfall, layoutSize: shortfall, segments: 1 }
          ],
          whole: `1 ${selectedUnit.big} (1000 ${selectedUnit.small})`,
          wholeLayoutSize: 1000
        }
      });

      if (isMCQ) {
        askText = `I have ${s1} ${selectedUnit.small}. How much more to reach 1 ${selectedUnit.big}?`;
        const d1 = `${shortfall - 100} ${selectedUnit.small}`;
        const d2 = `${shortfall + 100} ${selectedUnit.small}`;
        const d3 = `${Math.abs(1000 - shortfall)} ${selectedUnit.small}`; // e.g. 1000 - 850 = 150, d3 = 850 (confused subtraction)
        options = [answer, d1, d2, d3].sort(() => 0.5 - Math.random());
        solutionSteps = [
          `1 ${selectedUnit.big} = 1000 ${selectedUnit.small}.`,
          `Subtract ${s1} from 1000.`,
          `1000 - ${s1} = ${shortfall} ${selectedUnit.small}.`
        ];
        hint = `Remember that 1 ${selectedUnit.big} is 1000 ${selectedUnit.small}. Subtract from 1000!`;
      } else {
        const stories = {
          "km": `${names[0]} wants to run 1 km. So far, ${names[0]} has run ${s1} m. How many more metres does ${names[0]} need to run to reach 1 km?`,
          "kg": `${names[0]} needs exactly 1 kg of sugar for a recipe. The kitchen only has ${s1} g of sugar. How many more grams of sugar are needed?`,
          "ℓ": `A jug can hold exactly 1 ℓ of water. It currently has ${s1} ml of water. How much more water in ml is needed to fill the jug?`
        };
        
        let structText = `STORY: ${stories[selectedUnit.big]}`;
        let shortText = `How many more ${fullSmallLabel} to make 1 ${selectedUnit.big} from ${s1} ${selectedUnit.small}?`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Step 1: 1 ${selectedUnit.big} is equal to how many ${selectedUnit.small}?`, expectedAnswer: `1000 ${selectedUnit.small}`, acceptedAnswers: [`1000${selectedUnit.small}`, `1000`] },
              { label: `Step 2: Equation to find the shortfall`, expectedAnswer: `1000 - ${s1} = ${shortfall}`, acceptedAnswers: [`1000-${s1}=${shortfall}`, shortfall.toString(), `${shortfall}${selectedUnit.small}`, `${shortfall} ${selectedUnit.small}`] }
            ]
          });
        }

        solutionSteps = [
          `1. Convert the whole unit: 1 ${selectedUnit.big} = 1000 ${selectedUnit.small}.`,
          `2. Find the difference: 1000 - ${s1} = ${shortfall}.`,
          `3. Answer = ${shortfall} ${selectedUnit.small}.`
        ];
        hint = `1 ${selectedUnit.big} is equal to 1000 ${selectedUnit.small}. Subtract your current amount from 1000.`;
      }
      break;
    }

    case 'standard_subtracting_from_whole': {
      // Variant 9: Subtracting from a Whole Unit (Remaining)
      const whole = Math.floor(Math.random() * 4) + 2; // 2 to 5
      const s1 = (Math.floor(Math.random() * 8) + 1) * 100 + (Math.floor(Math.random() * 2) * 50); // e.g. 250, 400
      const remTotal = whole * 1000 - s1;
      answer = `${remTotal} ${selectedUnit.small}`;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "PART_WHOLE",
          isStatic: true,
          parts: [
            { value: `${s1} ${selectedUnit.small}`, size: s1, layoutSize: s1, segments: 1 },
            { value: "?", size: remTotal, layoutSize: remTotal, segments: 1 }
          ],
          whole: `${whole} ${selectedUnit.big}`,
          wholeLayoutSize: whole * 1000
        }
      });

      if (isMCQ) {
        askText = `${whole} ${selectedUnit.big} - ${s1} ${selectedUnit.small} = ? ${selectedUnit.small}`;
        const d1 = `${remTotal - 100} ${selectedUnit.small}`;
        const d2 = `${remTotal + 100} ${selectedUnit.small}`;
        const d3 = `${remTotal - 1000} ${selectedUnit.small}`;
        options = [answer, d1, d2, d3].filter(o => !o.includes('-')).sort(() => 0.5 - Math.random());
        while(options.length < 4) options.push(`${remTotal + 200} ${selectedUnit.small}`);
        
        solutionSteps = [
          `Convert ${whole} ${selectedUnit.big} to ${fullSmallLabel}: ${whole * 1000} ${selectedUnit.small}.`,
          `Subtract ${s1} from ${whole * 1000}.`,
          `${whole * 1000} - ${s1} = ${remTotal} ${selectedUnit.small}.`
        ];
        hint = `Convert the big unit entirely into the small unit first, then subtract.`;
      } else {
        const stories = {
          "km": `A road is ${whole} km long. ${names[0]} paves ${s1} m of the road. How many metres of the road are left to pave?`,
          "kg": `${names[0]} has ${whole} kg of flour. ${names[0]} uses ${s1} g to bake a cake. How much flour is left in grams?`,
          "ℓ": `A bottle has ${whole} ℓ of juice. ${names[0]} drinks ${s1} ml of it. How much juice is left in ml?`
        };
        
        let structText = `STORY: ${stories[selectedUnit.big]}`;
        let shortText = `${whole} ${selectedUnit.big} - ${s1} ${selectedUnit.small} = ? ${selectedUnit.small}`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Step 1: Convert ${whole} ${selectedUnit.big} to ${fullSmallLabel}`, expectedAnswer: `${whole * 1000} ${selectedUnit.small}`, acceptedAnswers: [`${whole * 1000}${selectedUnit.small}`, `${whole * 1000}`] },
              { label: `Step 2: Equation to find the remaining amount`, expectedAnswer: `${whole * 1000} - ${s1} = ${remTotal}`, acceptedAnswers: [`${whole * 1000}-${s1}=${remTotal}`, remTotal.toString(), `${remTotal}${selectedUnit.small}`, `${remTotal} ${selectedUnit.small}`] }
            ]
          });
        }

        solutionSteps = [
          `1. Convert ${whole} ${selectedUnit.big} to ${selectedUnit.small}: ${whole} × 1000 = ${whole * 1000} ${selectedUnit.small}.`,
          `2. Subtract the used amount: ${whole * 1000} - ${s1} = ${remTotal}.`,
          `3. Answer = ${remTotal} ${selectedUnit.small}.`
        ];
        hint = `Convert ${whole} ${selectedUnit.big} to ${fullSmallLabel} first before you subtract.`;
      }
      break;
    }

    case 'standard_direct_comparison': {
      // Variant 10: Direct Comparison (How much more/less)
      const b1 = Math.floor(Math.random() * 3) + 4; // 4 to 6
      const s1 = Math.floor(Math.random() * 4) * 100 + 500; // 500 to 800
      const b2 = Math.floor(Math.random() * 2) + 1; // 1 to 2
      const s2 = Math.floor(Math.random() * 3) * 100 + 100; // 100 to 300
      const diffB = b1 - b2;
      const diffS = s1 - s2;
      answer = `${diffB} ${selectedUnit.big} ${diffS} ${selectedUnit.small}`;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "COMPARISON",
          isStatic: true,
          bar1: { name: `A`, size: b1 * 1000 + s1, layoutSize: b1 * 1000 + s1, value: `${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small}`, segments: 1 },
          bar2: { name: `B`, size: b2 * 1000 + s2, layoutSize: b2 * 1000 + s2, value: `${b2} ${selectedUnit.big} ${s2} ${selectedUnit.small}`, segments: 1 },
          difference: { displayValue: "?" }
        }
      });

      if (isMCQ) {
        askText = `Item 1 is ${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small}. Item 2 is ${b2} ${selectedUnit.big} ${s2} ${selectedUnit.small}. What is the difference?`;
        const d1 = `${diffB - 1} ${selectedUnit.big} ${diffS} ${selectedUnit.small}`;
        const d2 = `${diffB} ${selectedUnit.big} ${diffS + 100} ${selectedUnit.small}`;
        const d3 = `${diffB + 1} ${selectedUnit.big} ${diffS} ${selectedUnit.small}`;
        options = [answer, d1, d2, d3].sort(() => 0.5 - Math.random());
        solutionSteps = [
          `Subtract the ${fullBigLabel} first: ${b1} - ${b2} = ${diffB} ${selectedUnit.big}.`,
          `Subtract the ${fullSmallLabel} next: ${s1} - ${s2} = ${diffS} ${selectedUnit.small}.`,
          `The difference is ${diffB} ${selectedUnit.big} ${diffS} ${selectedUnit.small}.`
        ];
        hint = `Subtract the smaller amount from the larger amount by matching the units.`;
      } else {
        const stories = {
          "km": `Trail A is ${b1} km ${s1} m long. Trail B is ${b2} km ${s2} m long. How much longer is Trail A than Trail B?`,
          "kg": `Box A weighs ${b1} kg ${s1} g. Box B weighs ${b2} kg ${s2} g. How much heavier is Box A than Box B?`,
          "ℓ": `Bucket A holds ${b1} ℓ ${s1} ml of water. Bucket B holds ${b2} ℓ ${s2} ml. How much more water does Bucket A hold than Bucket B?`
        };
        
        let structText = `STORY: ${stories[selectedUnit.big]}`;
        let shortText = `Find the difference between ${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small} and ${b2} ${selectedUnit.big} ${s2} ${selectedUnit.small}.`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Step 1: Equation for ${fullBigLabel}`, expectedAnswer: `${b1} - ${b2} = ${diffB}`, acceptedAnswers: [`${b1}-${b2}=${diffB}`, diffB.toString(), `${diffB}${selectedUnit.big}`, `${diffB} ${selectedUnit.big}`] },
              { label: `Step 2: Equation for ${fullSmallLabel}`, expectedAnswer: `${s1} - ${s2} = ${diffS}`, acceptedAnswers: [`${s1}-${s2}=${diffS}`, diffS.toString(), `${diffS}${selectedUnit.small}`, `${diffS} ${selectedUnit.small}`] },
              { label: `Step 3: Difference in ${selectedUnit.big} and ${selectedUnit.small}`, expectedAnswer: `${diffB} ${selectedUnit.big} ${diffS} ${selectedUnit.small}`, acceptedAnswers: [`${diffB}${selectedUnit.big}${diffS}${selectedUnit.small}`, `${diffB} ${selectedUnit.big} ${diffS} ${selectedUnit.small}`] }
            ]
          });
        }

        solutionSteps = [
          `1. Subtract the ${selectedUnit.big}: ${b1} - ${b2} = ${diffB} ${selectedUnit.big}.`,
          `2. Subtract the ${selectedUnit.small}: ${s1} - ${s2} = ${diffS} ${selectedUnit.small}.`,
          `3. Answer = ${diffB} ${selectedUnit.big} ${diffS} ${selectedUnit.small}.`
        ];
        hint = `To find the difference, subtract the smaller measurement from the bigger measurement. Match the units!`;
      }
      break;
    }

    default:
      throw new Error(`Variant not implemented: ${activeVariant}`);
  }

  const payloadStr = getFormatInstructions(visualEngineStr, inputRequirementStr);

  return {
    aiPrompt: `You are an expert Primary 3 math teacher.
Your task is to generate a JSON response for a math question.

CRITICAL INSTRUCTIONS:
1. ONLY return valid JSON. No markdown, no code blocks, no trailing characters.
2. If the 'askText' contains 'STORY:', you must rewrite the text following 'STORY:' to create a highly engaging, creative word problem for a Primary 3 student. However, you MUST strictly follow these rules:
   - NEVER reveal the actual numerical answers or values that the student is supposed to find by reading the visual models.
   - Preserve any mathematical values and operations if they are explicitly provided in the original STORY string.
   - DO NOT add any extra unrequested questions (e.g., do not add 'How many altogether?').
   - Keep the final question sentence exactly as intended.
   - DO NOT include the word "STORY:" or any other prefixes in your final generated questionText.
3. If there is no 'STORY:', you MUST use the exact string provided in 'askText'. DO NOT paraphrase or rewrite it.
4. Set the exact string "${answer}" as the 'finalAnswer'.
5. Use the exact provided solution steps and hint.
6. The 'visualEngine' and 'inputRequirement' fields MUST match the provided JSON schema exactly. DO NOT invent or generate your own visual engine objects (like BAR_MODEL).
7. If 'options' is provided in the inputs, you MUST use the exact array for the 'options' field in the 'content' object. If it is empty, return [].

Inputs for your generation:
- askText: ${askText}
- solutionSteps: ${JSON.stringify(solutionSteps)}
- hint: ${hint}
- options: ${options ? JSON.stringify(options) : '[]'}

${payloadStr}
`
  };
};
