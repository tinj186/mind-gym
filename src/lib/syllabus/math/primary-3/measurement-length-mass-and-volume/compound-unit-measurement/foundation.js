import { getRandomNames, getKgItems, getGramItems, getRandomLiquids } from '@/lib/utils/variable-bank';

export const foundationLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
  const names = getRandomNames(2);
  const kgFoods = getKgItems(2);
  const liquids = getRandomLiquids(2);
  
  let askText, answer, mcqOptions, solutionSteps, hint;
  let visualEngineStr = `{"componentToRender": "NONE", "componentData": {}}`;
  let inputRequirementStr = null;

  switch (activeVariant) {
    case 'foundation_mass_dial_reading': {
      // Variant 1: Mass Dial Reading (Past 1 kg)
      const kg = Math.floor(Math.random() * 2) + 1; // 1 or 2 kg
      const extraG = (Math.floor(Math.random() * 8) + 1) * 100; // 100 to 800 g
      const totalG = (kg * 1000) + extraG;
      answer = `${kg} kg ${extraG} g`;

      const objName = kgFoods[0]?.item || "watermelon";
      const objIcon = kgFoods[0]?.icon || "🍉";

      visualEngineStr = JSON.stringify({
        componentToRender: "MASS_SCALE",
        componentData: {
          maxScale: 3000,
          value: totalG,
          intervals: 100,
          labelInterval: 500,
          unit: "g",
          objectEmoji: objIcon
        }
      });

      if (isMCQ) {
        askText = `The scale shows ${totalG} g. What is this in kg and g?`;
        const d1 = `${kg} kg ${extraG + 100} g`;
        const d2 = `${kg + 1} kg ${extraG} g`;
        const d3 = `${kg} kg ${extraG * 10} g`;
        mcqOptions = [answer, d1, d2, d3].sort(() => 0.5 - Math.random());
        solutionSteps = [
          `Total mass = ${totalG} g.`,
          `1000 g = 1 kg.`,
          `So, ${totalG} g = ${kg} kg ${extraG} g.`
        ];
        hint = `Remember that 1000 g is equal to 1 kg.`;
      } else {
        let structText = `STORY: ${names[0]} weighs a ${objName} on a scale. Look at the scale. Read the total mass in grams, then convert it to kilograms and grams.`;
        let shortText = `Read the scale. What is the mass in kg and g?`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Read the total mass on the scale in grams:`, expectedAnswer: `${totalG} g`, acceptedAnswers: [`${totalG}g`, `${totalG} g`, totalG.toString()] },
              { label: `How many grams are in 1 kilogram?`, expectedAnswer: "1000 g", acceptedAnswers: ["1000g", "1000 g", "1000"] },
              { label: `How many full kilograms does the ${objName} weigh?`, expectedAnswer: `${kg} kg`, acceptedAnswers: [`${kg}kg`, `${kg} kg`, kg.toString()] },
              { label: `How many grams are left over?`, expectedAnswer: `${extraG} g`, acceptedAnswers: [`${extraG}g`, `${extraG} g`, extraG.toString()] }
            ]
          });
        }

        solutionSteps = [
          `1. Read the scale: The needle points to ${totalG} g.`,
          `2. Convert to kg and g: 1000 g = 1 kg.`,
          `3. ${totalG} g can be split into ${kg * 1000} g and ${extraG} g.`,
          `4. Answer = ${kg} kg ${extraG} g.`
        ];
        hint = `Read the total mass in grams first, then pull out the thousands to make kilograms.`;
      }
      break;
    }

    case 'foundation_volume_beaker_reading': {
      // Variant 2: Volume Beaker Reading (Past 1 ℓ)
      const litres = 1;
      const extraMl = (Math.floor(Math.random() * 8) + 1) * 50; // 50 to 400 ml
      const totalMl = (litres * 1000) + extraMl;
      answer = `${litres} ℓ ${extraMl} ml`;

      visualEngineStr = JSON.stringify({
        componentToRender: "VOLUME_BEAKER",
        componentData: {
          maxScale: 2000,
          value: totalMl,
          intervals: 50,
          labelInterval: 200,
          unit: "ml",
          color: "#fbbf24",
          label: "Orange Juice"
        }
      });

      if (isMCQ) {
        askText = `Which compound unit matches the ${totalMl} ml beaker?`;
        const d1 = `${litres} ℓ ${extraMl + 100} ml`;
        const d2 = `${litres + 1} ℓ ${extraMl} ml`;
        const d3 = `${litres} ℓ ${extraMl + 50} ml`;
        mcqOptions = [answer, d1, d2, d3].sort(() => 0.5 - Math.random());
        solutionSteps = [
          `Total volume = ${totalMl} ml.`,
          `1000 ml = 1 ℓ.`,
          `So, ${totalMl} ml = ${litres} ℓ ${extraMl} ml.`
        ];
        hint = `Remember that 1000 millilitres is equal to 1 Litre.`;
      } else {
        const liq = liquids[0] || "orange juice";
        let structText = `STORY: ${names[0]} pours ${liq} into a large beaker. Look at the visual model. Read the total volume in ml, and express it in ℓ and ml.`;
        let shortText = `The beaker shows ${totalMl} ml. Convert this to ℓ and ml.`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Read the total volume in the beaker in ml:`, expectedAnswer: `${totalMl} ml`, acceptedAnswers: [`${totalMl}ml`, `${totalMl} ml`, totalMl.toString()] },
              { label: `How many full Litres is this?`, expectedAnswer: `${litres} ℓ`, acceptedAnswers: [`${litres}l`, `${litres} l`, `${litres} ℓ`, litres.toString()] },
              { label: `How many millilitres are left over?`, expectedAnswer: `${extraMl} ml`, acceptedAnswers: [`${extraMl}ml`, `${extraMl} ml`, extraMl.toString()] }
            ]
          });
        }

        solutionSteps = [
          `1. Read the beaker: The water level is at ${totalMl} ml.`,
          `2. Convert to ℓ and ml: 1000 ml = 1 ℓ.`,
          `3. ${totalMl} ml can be split into ${litres * 1000} ml and ${extraMl} ml.`,
          `4. Answer = ${litres} ℓ ${extraMl} ml.`
        ];
        hint = `Read the total volume in ml first, then pull out the thousands to make Litres.`;
      }
      break;
    }

    case 'foundation_zero_trap_conversion': {
      // Variant 3: The "Zero Trap" Conversion (Compound to Single)
      const units = [
        { big: "km", small: "m", factor: 1000 },
        { big: "kg", small: "g", factor: 1000 },
        { big: "ℓ", small: "ml", factor: 1000 }
      ];
      const selectedUnit = units[Math.floor(Math.random() * units.length)];
      
      const bigVal = Math.floor(Math.random() * 4) + 1; // 1 to 4
      const smallVal = Math.floor(Math.random() * 9) * 10 + 10; // 10 to 90 (2 digits, zero trap!)
      const totalSmall = (bigVal * selectedUnit.factor) + smallVal;
      answer = `${totalSmall} ${selectedUnit.small}`;

      if (isMCQ) {
        askText = `What is ${bigVal} ${selectedUnit.big} ${smallVal} ${selectedUnit.small} in ${selectedUnit.small === 'ml' ? 'millilitres' : selectedUnit.small === 'g' ? 'grams' : 'metres'}?`;
        // Create zero trap distractors
        const d1 = `${bigVal * 100 + smallVal} ${selectedUnit.small}`; // e.g. 250 (missed a zero)
        const d2 = `${bigVal * 1000 + smallVal * 10} ${selectedUnit.small}`; // e.g. 2500 (extra zero)
        const d3 = `${(bigVal + 1) * 1000 + smallVal} ${selectedUnit.small}`; // extra 1000
        mcqOptions = [answer, d1, d2, d3].sort(() => 0.5 - Math.random());
        solutionSteps = [
          `${bigVal} ${selectedUnit.big} = ${bigVal * selectedUnit.factor} ${selectedUnit.small}.`,
          `Add the remaining ${smallVal} ${selectedUnit.small}.`,
          `${bigVal * selectedUnit.factor} + ${smallVal} = ${totalSmall} ${selectedUnit.small}.`
        ];
        hint = `Convert the big unit first, then add the small unit carefully. Watch out for the zeros!`;
      } else {
        const stories = {
          "km": `${names[0]} is walking on a trail that is ${bigVal} km ${smallVal} m long. Convert the distance entirely into metres to find out how many metres the path is.`,
          "kg": `${names[1]} buys a bag of ${kgFoods[1]?.item || "rice"} that weighs ${bigVal} kg ${smallVal} g. Convert the mass entirely into grams.`,
          "ℓ": `${names[0]} fills a container with ${bigVal} ℓ ${smallVal} ml of ${liquids[1] || "water"}. Convert the volume entirely into millilitres.`
        };
        
        let structText = stories[selectedUnit.big];
        let shortText = `Convert ${bigVal} ${selectedUnit.big} ${smallVal} ${selectedUnit.small} into ${selectedUnit.small === 'ml' ? 'millilitres' : selectedUnit.small === 'g' ? 'grams' : 'metres'}.`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { 
                label: `Convert ${bigVal} ${selectedUnit.big} into ${selectedUnit.small}:`, 
                expectedAnswer: `${bigVal * selectedUnit.factor} ${selectedUnit.small}`,
                acceptedAnswers: [`${bigVal * selectedUnit.factor}${selectedUnit.small}`, `${bigVal * selectedUnit.factor} ${selectedUnit.small}`, (bigVal * selectedUnit.factor).toString()]
              },
              { 
                label: `Add the remaining ${smallVal} ${selectedUnit.small} (${bigVal * selectedUnit.factor} + ${smallVal}). What is the total in ${selectedUnit.small}?`, 
                expectedAnswer: `${totalSmall} ${selectedUnit.small}`,
                acceptedAnswers: [`${totalSmall}${selectedUnit.small}`, `${totalSmall} ${selectedUnit.small}`, totalSmall.toString()]
              }
            ]
          });
        }

        solutionSteps = [
          `1. Convert ${selectedUnit.big} to ${selectedUnit.small}: ${bigVal} ${selectedUnit.big} = ${bigVal * selectedUnit.factor} ${selectedUnit.small}.`,
          `2. Add the extra ${selectedUnit.small}: ${bigVal * selectedUnit.factor} + ${smallVal} = ${totalSmall}.`,
          `3. Answer = ${totalSmall} ${selectedUnit.small}.`
        ];
        hint = `Remember that 1 ${selectedUnit.big} is 1000 ${selectedUnit.small}. Be careful when adding!`;
      }
      break;
    }

    case 'foundation_map_distance_extraction': {
      // Variant 4: Map Distance (Compound Unit Extraction)
      const km = Math.floor(Math.random() * 4) + 2; // 2 to 5
      const m = (Math.floor(Math.random() * 8) + 1) * 100; // 100 to 800
      const totalM = (km * 1000) + m;
      answer = `${km} km ${m} m`;

      visualEngineStr = JSON.stringify({
        componentToRender: "MEASUREMENT_RULER",
        componentData: {
          items: [{ label: "Distance" }],
          sides: [totalM / 1000],
          mapTheme: "road",
          isPerimeter: true,
          unit: "m",
          startLabel: "MRT Station",
          endLabel: "School"
        }
      });

      if (isMCQ) {
        askText = `The path is ${totalM} m. Express this in km and m.`;
        const d1 = `${km} km ${m + 100} m`;
        const d2 = `${km + 1} km ${m} m`;
        const d3 = `${Math.max(1, km - 1)} km ${m + 200} m`;
        mcqOptions = [answer, d1, d2, d3].sort(() => 0.5 - Math.random());
        solutionSteps = [
          `Total distance = ${totalM} m.`,
          `1000 m = 1 km.`,
          `${totalM} m can be split into ${km * 1000} m and ${m} m.`,
          `So, ${totalM} m = ${km} km ${m} m.`
        ];
        hint = `Pull out the thousands to make kilometres.`;
      } else {
        let structText = `STORY: The map shows the distance from the MRT station to the school is ${totalM} m. Convert this distance into kilometres and metres.`;
        let shortText = `A map path is ${totalM} m. Convert to km and m.`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Look at the map. What is the total distance in metres?`, expectedAnswer: `${totalM} m`, acceptedAnswers: [`${totalM}m`, `${totalM} m`, totalM.toString()] },
              { label: `How many full kilometres is this?`, expectedAnswer: `${km} km`, acceptedAnswers: [`${km}km`, `${km} km`, km.toString()] },
              { label: `How many metres are left over?`, expectedAnswer: `${m} m`, acceptedAnswers: [`${m}m`, `${m} m`, m.toString()] }
            ]
          });
        }

        solutionSteps = [
          `1. The total distance is ${totalM} m.`,
          `2. Convert to km and m: 1000 m = 1 km.`,
          `3. ${totalM} m can be split into ${km * 1000} m and ${m} m.`,
          `4. Answer = ${km} km ${m} m.`
        ];
        hint = `Every 1000 m is 1 km. Look at the thousands digit!`;
      }
      break;
    }

    case 'foundation_fractional_benchmark': {
      // Variant 5: Fractional Benchmark Recognition (Half/Quarter)
      const units = [
        { big: "kilometre", small: "m", factor: 1000 },
        { big: "kilogram", small: "g", factor: 1000 },
        { big: "Litre", small: "ml", factor: 1000 }
      ];
      const selectedUnit = units[Math.floor(Math.random() * units.length)];
      
      const isHalf = Math.random() > 0.5;
      const fractionText = isHalf ? "half" : "a quarter";
      const fractionVal = isHalf ? 2 : 4;
      const answerNum = selectedUnit.factor / fractionVal;
      answer = `${answerNum} ${selectedUnit.small}`;

      if (isMCQ) {
        askText = `What is ${fractionText} a ${selectedUnit.big} in ${selectedUnit.small === 'm' ? 'metres' : selectedUnit.small === 'g' ? 'grams' : 'millilitres'}?`;
        const d1 = `${answerNum / 10} ${selectedUnit.small}`;
        const d2 = `${answerNum * 10} ${selectedUnit.small}`;
        const d3 = `${answerNum + 150} ${selectedUnit.small}`;
        mcqOptions = [answer, d1, d2, d3].sort(() => 0.5 - Math.random());
        solutionSteps = [
          `1 ${selectedUnit.big} = ${selectedUnit.factor} ${selectedUnit.small}.`,
          `${fractionText === 'half' ? 'Half' : 'A quarter'} of ${selectedUnit.factor} is ${selectedUnit.factor} ÷ ${fractionVal} = ${answerNum}.`,
          `So, ${fractionText} a ${selectedUnit.big} = ${answerNum} ${selectedUnit.small}.`
        ];
        hint = `Remember that 1 full ${selectedUnit.big} is ${selectedUnit.factor} ${selectedUnit.small}. Find ${fractionText} of that!`;
      } else {
        const stories = {
          "kilometre": `${names[0]} runs for ${fractionText} a ${selectedUnit.big} in the park. Write this distance in ${selectedUnit.small === 'm' ? 'metres' : selectedUnit.small}.`,
          "kilogram": `${names[1]} buys ${fractionText} a ${selectedUnit.big} of flour. Write this mass in ${selectedUnit.small === 'g' ? 'grams' : selectedUnit.small}.`,
          "Litre": `${names[0]} drinks ${fractionText} a ${selectedUnit.big} of water. Write this volume in ${selectedUnit.small === 'ml' ? 'millilitres' : selectedUnit.small}.`
        };
        
        let structText = stories[selectedUnit.big];
        let shortText = `Express ${fractionText} a ${selectedUnit.big} in ${selectedUnit.small}.`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { 
                label: `How many ${selectedUnit.small} are in 1 full ${selectedUnit.big}?`, 
                expectedAnswer: `${selectedUnit.factor} ${selectedUnit.small}`,
                acceptedAnswers: [`${selectedUnit.factor}${selectedUnit.small}`, `${selectedUnit.factor} ${selectedUnit.small}`, selectedUnit.factor.toString()]
              },
              { 
                label: `What is ${fractionText} of ${selectedUnit.factor}?`, 
                expectedAnswer: `${answerNum} ${selectedUnit.small}`,
                acceptedAnswers: [`${answerNum}${selectedUnit.small}`, `${answerNum} ${selectedUnit.small}`, answerNum.toString()]
              }
            ]
          });
        }

        solutionSteps = [
          `1. 1 ${selectedUnit.big} = ${selectedUnit.factor} ${selectedUnit.small}.`,
          `2. To find ${fractionText}, we divide by ${fractionVal}.`,
          `3. ${selectedUnit.factor} ÷ ${fractionVal} = ${answerNum}.`,
          `4. Answer = ${answerNum} ${selectedUnit.small}.`
        ];
        hint = `Divide 1000 by ${fractionVal} to find ${fractionText}.`;
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

Inputs for your generation:
- askText: ${askText}
- solutionSteps: ${JSON.stringify(solutionSteps)}
- hint: ${hint}
- mcqOptions: ${mcqOptions ? JSON.stringify(mcqOptions) : '[]'}

${payloadStr}
`
  };
};
