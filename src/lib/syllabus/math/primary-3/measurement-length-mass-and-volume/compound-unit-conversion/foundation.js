import { getRandomNames, getKgItems, getGramItems, getRandomLiquids, getRandomLocations } from '@/lib/utils/variable-bank';

export const foundationLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
  const names = getRandomNames(2);
  const kgFoods = getKgItems(2);
  const liquids = getRandomLiquids(2);
  const locations = getRandomLocations(2);
  
  let askText, answer, options, solutionSteps, hint;
  let visualEngineStr = `{"componentToRender": "NONE", "componentData": {}}`;
  let inputRequirementStr = null;

  switch (activeVariant) {
    case 'foundation_mass_dial_reading': {
      // Variant 1: Mass Dial Reading (Smaller to Compound)
      const kg = Math.floor(Math.random() * 3) + 1; // 1 to 3 kg
      const extraG = (Math.floor(Math.random() * 9) + 1) * 100; // 100 to 900 g
      const totalG = (kg * 1000) + extraG;
      answer = `${kg} kg ${extraG} g`;

      const objName = kgFoods[0]?.item || "rice";
      const objIcon = kgFoods[0]?.icon || "🍉";

      visualEngineStr = JSON.stringify({
        componentToRender: "MASS_SCALE",
        componentData: {
          maxScale: (kg + 1) * 1000,
          value: totalG,
          intervals: 100,
          labelInterval: 500,
          unit: "g",
          objectEmoji: objIcon
        }
      });

      answer = `${kg} kg ${extraG} g`;
      
      if (isStructure) {
        askText = `STORY: ${names[0]} weighs a bag of ${objName}. Look at the scale. Read the total mass in grams, then convert it to kilograms and grams.`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Read the total mass on the scale in grams:", expectedAnswer: `${totalG} g`, acceptedAnswers: [`${totalG}`, `${totalG}g`, `${totalG} g`] },
            { label: "How many full kilograms is this (remember 1000 g = 1 kg)?", expectedAnswer: `${kg} kg`, acceptedAnswers: [`${kg}`, `${kg}kg`, `${kg} kg`] },
            { label: "How many grams are left over?", expectedAnswer: `${extraG} g`, acceptedAnswers: [`${extraG}`, `${extraG}g`, `${extraG} g`] }
          ]
        });
      } else {
        askText = `Read the scale and convert the mass into kg and g.`;
      }
      
      options = [
        answer,
        `${kg * 10} kg ${extraG / 10} g`,
        `${kg} kg ${extraG + 100} g`,
        `${kg + 1} kg ${extraG} g`
      ];
      
      solutionSteps = `1. Read the scale carefully: The dial points to ${totalG} g.\n2. We know that 1000 g = 1 kg.\n3. Split ${totalG} g into ${kg * 1000} g and ${extraG} g.\n4. Convert ${kg * 1000} g into ${kg} kg.\n5. The remaining mass is ${extraG} g.\n6. So, ${totalG} g is ${answer}.`;
      hint = `Remember that 1000 grams make 1 kilogram. Separate the thousands from the hundreds!`;
      break;
    }

    case 'foundation_volume_beaker_reading': {
      // Variant 2: Beaker Reading (Compound to Smaller)
      const l = Math.floor(Math.random() * 2) + 1; // 1 to 2 L
      const extraMl = (Math.floor(Math.random() * 9) + 1) * 100; // 100 to 900 ml
      const totalMl = (l * 1000) + extraMl;
      answer = `${totalMl} ml`;

      const liquidName = liquids[0] || "water";

      visualEngineStr = JSON.stringify({
        componentToRender: "VOLUME_BEAKER",
        componentData: {
          maxScale: (l + 1) * 1000,
          value: totalMl,
          intervals: 100,
          labelInterval: 500,
          unit: "ml",
          color: "#3b82f6",
          label: liquidName
        }
      });

      answer = `${l} ℓ ${extraMl} ml`;
      
      if (isStructure) {
        askText = `STORY: A beaker is filled with ${liquidName}. Look at the beaker to read the total volume in ml, then convert it into Litres and millilitres.`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Read the total volume on the beaker in ml:`, expectedAnswer: `${totalMl} ml`, acceptedAnswers: [`${totalMl}ml`, `${totalMl} ml`, totalMl.toString()] },
            { label: `How many full Litres is this?`, expectedAnswer: `${l} ℓ`, acceptedAnswers: [`${l}ℓ`, `${l} ℓ`, l.toString()] },
            { label: `How many millilitres are left over?`, expectedAnswer: `${extraMl} ml`, acceptedAnswers: [`${extraMl}ml`, `${extraMl} ml`, extraMl.toString()] }
          ]
        });
      } else {
        askText = `Read the beaker and convert the volume into ℓ and ml.`;
      }
      
      options = [
        answer,
        `${l * 10} ℓ ${extraMl / 10} ml`,
        `${l} ℓ ${extraMl + 100} ml`,
        `${l + 1} ℓ ${extraMl} ml`
      ];
      
      solutionSteps = `1. Read the beaker carefully: The liquid level is at ${totalMl} ml.\n2. We know that 1000 ml = 1 ℓ.\n3. Split ${totalMl} ml into ${l * 1000} ml and ${extraMl} ml.\n4. Convert ${l * 1000} ml into ${l} ℓ.\n5. The remaining volume is ${extraMl} ml.\n6. So, ${totalMl} ml is ${answer}.`;
      hint = `Remember that 1000 ml make 1 ℓ. Separate the thousands from the hundreds!`;
      break;
    }

    case 'foundation_zero_placeholder_trap': {
      // Variant 3: The "Zero Placeholder" Trap (Length)
      const bUnit = "km";
      const sUnit = "m";
      const obj = locations[0] || "park";
      
      const big = Math.floor(Math.random() * 4) + 1; // 1 to 4 km
      const small = Math.floor(Math.random() * 9) * 10 + 10; // 10 to 90 m (two digits to force zero placeholder)
      const totalSmall = (big * 1000) + small;
      
      const isCompoundToPure = Math.random() > 0.5;

      if (isCompoundToPure) {
        answer = `${totalSmall} ${sUnit}`;
        if (isStructure) {
          askText = `STORY: A hiking path to the ${obj} is ${big} km ${small} m long. Convert this measurement entirely into ${sUnit}.`;
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Convert the full kilometres into ${sUnit}:`, expectedAnswer: `${big * 1000} ${sUnit}`, acceptedAnswers: [`${big * 1000}${sUnit}`, `${big * 1000} ${sUnit}`, (big * 1000).toString()] },
              { label: `Add the remaining ${sUnit} to find the total:`, expectedAnswer: answer, acceptedAnswers: [answer.replace(/ /g, ""), answer, totalSmall.toString()] }
            ]
          });
        } else {
          askText = `Convert ${big} km ${small} m into m.`;
        }
        options = [
          answer,
          `${big * 100 + small} ${sUnit}`, // e.g. 2 km 50 m -> 250 m
          `${big * 1000 + small * 10} ${sUnit}`, // e.g. 2 km 50 m -> 2500 m
          `${big * 10 + small} ${sUnit}`
        ];
        solutionSteps = `1. The base conversion is 1 km = 1000 m.\n2. Convert the large unit: ${big} km = ${big * 1000} m.\n3. Add the small unit: ${big * 1000} m + ${small} m = ${totalSmall} m.\n4. Make sure not to forget the zero placeholder!`;
        hint = `Always write out the thousand value first (e.g., 2000), then add the smaller number to it safely.`;
      } else {
        answer = `${big} km ${small} m`;
        if (isStructure) {
          askText = `STORY: A hiking path to the ${obj} is exactly ${totalSmall} m long. Convert this length into kilometres and metres.`;
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `How many full kilometres is this?`, expectedAnswer: `${big} km`, acceptedAnswers: [`${big}km`, `${big} km`, big.toString()] },
              { label: `How many metres are left over?`, expectedAnswer: `${small} m`, acceptedAnswers: [`${small}m`, `${small} m`, small.toString()] }
            ]
          });
        } else {
          askText = `Convert ${totalSmall} m into km and m.`;
        }
        options = [
          answer,
          `${big} km ${small * 10} m`, // e.g. 2050 m -> 2 km 500 m
          `${big * 10} km ${small} m`,
          `${Math.floor(totalSmall/100)} km ${totalSmall%100} m`
        ];
        solutionSteps = `1. We know that 1000 m = 1 km.\n2. Split ${totalSmall} m into thousands and the rest: ${big * 1000} m and ${small} m.\n3. Convert ${big * 1000} m into ${big} km.\n4. The remaining length is ${small} m.\n5. Don't forget the zero placeholder!`;
        hint = `Look at the thousands digit to find the kilometres. The rest is metres!`;
      }
      break;
    }

    case 'foundation_m_cm_boundary': {
      // Variant 4: The m/cm Boundary (Base 100)
      const isMToCm = Math.random() > 0.5;
      const m = Math.floor(Math.random() * 5) + 1; // 1 to 5 m
      const cm = Math.floor(Math.random() * 9) + 1; // 1 to 9 cm (force 0 placeholder trap in base 100)
      const totalCm = (m * 100) + cm;

      if (isMToCm) {
        answer = `${totalCm} cm`;
        if (isStructure) {
          askText = `STORY: A roll of ribbon is ${m} m ${cm} cm long. Convert this length into centimetres.`;
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Convert the full metres into centimetres:`, expectedAnswer: `${m * 100} cm`, acceptedAnswers: [`${m * 100}cm`, `${m * 100} cm`, (m * 100).toString()] },
              { label: `Add the remaining centimetres to find the total length:`, expectedAnswer: `${totalCm} cm`, acceptedAnswers: [`${totalCm}cm`, `${totalCm} cm`, totalCm.toString()] }
            ]
          });
        } else {
          askText = `Convert ${m} m ${cm} cm to cm.`;
        }

        options = [
          answer,
          `${m * 10 + cm} cm`,
          `${m * 1000 + cm} cm`, // Trapping kids who think m to cm is 1000
          `${m * 100 + cm * 10} cm`
        ];

        solutionSteps = `1. The key rule for length is 1 m = 100 cm.\n2. Convert the metres: ${m} m = ${m * 100} cm.\n3. Add the centimetres: ${m * 100} cm + ${cm} cm = ${totalCm} cm.`;
        hint = `Be careful! Metres to centimetres uses 100, not 1000!`;

      } else {
        answer = `${m} m ${cm} cm`;
        if (isStructure) {
          askText = `STORY: A piece of string is ${totalCm} cm long. Convert this length into metres and centimetres.`;
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Extract the hundreds to find the full metres:`, expectedAnswer: `${m} m`, acceptedAnswers: [`${m}m`, `${m} m`, m.toString()] },
              { label: `How many centimetres are left over?`, expectedAnswer: `${cm} cm`, acceptedAnswers: [`${cm}cm`, `${cm} cm`, cm.toString()] }
            ]
          });
        } else {
          askText = `Convert ${totalCm} cm into m and cm.`;
        }

        options = [
          answer,
          `${m} m ${cm * 10} cm`,
          `${Math.floor(totalCm/1000)} m ${totalCm%1000} cm`,
          `${m * 10} m ${cm} cm`
        ];

        solutionSteps = `1. The key rule for length is 100 cm = 1 m.\n2. Break apart ${totalCm} cm into hundreds and ones: ${m * 100} cm and ${cm} cm.\n3. Convert ${m * 100} cm into ${m} m.\n4. The remaining length is ${cm} cm, so the answer is ${answer}.`;
        hint = `Look at the hundreds digit to find the metres. The rest is centimetres!`;
      }
      break;
    }

    case 'foundation_fractional_benchmark': {
      // Variant 5: Fractional Benchmark Conversions
      const bigUnits = ["km", "kg", "ℓ"];
      const smallUnits = ["m", "g", "ml"];
      const fractions = [ { word: "half", val: 500, frac: "1/2" }, { word: "quarter", val: 250, frac: "1/4" } ];
      
      const randUnitIdx = Math.floor(Math.random() * 3);
      const bUnit = bigUnits[randUnitIdx];
      const sUnit = smallUnits[randUnitIdx];
      
      const randFracIdx = Math.floor(Math.random() * 2);
      const fractionObj = fractions[randFracIdx];
      
      answer = `${fractionObj.val} ${sUnit}`;

      if (isStructure) {
        let objectContext = bUnit === "km" ? "a track" : bUnit === "kg" ? kgFoods[0]?.item || "flour" : liquids[0] || "milk";
        askText = `STORY: ${names[0]} has ${fractionObj.word} a ${bUnit === "km" ? "kilometre" : bUnit === "kg" ? "kilogram" : "Litre"} of ${objectContext}. Convert this entirely into ${sUnit}.`;
        
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `How many ${sUnit} are in 1 full ${bUnit}?`, expectedAnswer: `1000 ${sUnit}`, acceptedAnswers: ["1000", `1000${sUnit}`, `1000 ${sUnit}`] },
            { label: `What is ${fractionObj.word} of 1000?`, expectedAnswer: `${fractionObj.val} ${sUnit}`, acceptedAnswers: [`${fractionObj.val}`, `${fractionObj.val}${sUnit}`, `${fractionObj.val} ${sUnit}`] }
          ]
        });
      } else {
        askText = `Express ${fractionObj.word} a ${bUnit === "km" ? "kilometre" : bUnit === "kg" ? "kilogram" : "Litre"} in ${sUnit}.`;
      }

      options = [
        answer,
        `${fractionObj.val / 10} ${sUnit}`, // e.g. 50
        `${fractionObj.val * 10} ${sUnit}`, // e.g. 5000
        fractionObj.val === 500 ? `250 ${sUnit}` : `500 ${sUnit}`
      ];

      solutionSteps = `1. Remember that 1 ${bUnit} = 1000 ${sUnit}.\n2. To find ${fractionObj.word} of a ${bUnit}, we calculate ${fractionObj.word} of 1000.\n3. ${fractionObj.word === "half" ? "1000 ÷ 2" : "1000 ÷ 4"} = ${fractionObj.val}.\n4. So, the answer is ${answer}.`;
      hint = `Start by remembering how many ${sUnit} are in 1 whole ${bUnit} (it's 1000). Then divide it!`;
      break;
    }

    default:
      throw new Error(`Variant not found in Foundation logic: ${activeVariant}`);
  }

  const generatedPrompt = getFormatInstructions(visualEngineStr, inputRequirementStr);

  return {
    aiPrompt: `You are an expert Primary 3 math teacher.
Your task is to generate a JSON response for a math question.

CRITICAL INSTRUCTIONS:
1. ONLY return valid JSON. No markdown, no code blocks, no trailing characters.
2. If the 'askText' contains 'STORY:', you must rewrite the text following 'STORY:' to create a highly engaging, creative word problem for a Primary 3 student. However, you MUST strictly follow these rules:
   - NEVER reveal the actual numerical answers or values that the student is supposed to find by reading the visual models (like dials or scales).
   - Preserve any mathematical values and operations if they are explicitly provided in the original STORY string.
   - DO NOT add any extra unrequested questions.
   - Keep the final question sentence exactly as intended.
   - DO NOT include the word "STORY:" or any other prefixes in your final generated questionText.
3. If there is no 'STORY:', you MUST use the exact string provided in 'askText'. DO NOT paraphrase or rewrite it.
4. Generate a logical solution sequence for the 'solutionSteps' array that matches the finalAnswer. Ensure the steps explicitly address the conversion mathematics.
5. DO NOT alter or append numerical values to the strings inside visualEngine parts. Keep the exact text provided in the template.
6. The 'visualEngine' and 'inputRequirement' fields MUST match the provided JSON schema EXACTLY. DO NOT invent or generate your own visual engine objects (like BAR_MODEL) if the template says NONE. If the provided visualEngine is {"componentToRender": "NONE", "componentData": {}}, you MUST output that EXACT literal object without adding anything.

Inputs for your generation:
- askText: ${askText}
- solutionSteps: ${JSON.stringify(solutionSteps)}
- hint: ${hint}

${generatedPrompt}
`
  };
};
