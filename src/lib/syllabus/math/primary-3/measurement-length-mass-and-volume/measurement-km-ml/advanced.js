import { getRandomNames, getRandomLiquids } from '@/lib/utils/variable-bank';

export const advancedLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
  const names = getRandomNames(2);
  const liquids = getRandomLiquids(2);
  
  let askText, answer, mcqOptions, solutionSteps, hint;
  let visualEngineStr = `{"componentToRender": "NONE", "componentData": {}}`;
  let inputRequirementStr = null;

  switch (activeVariant) {
    case 'advanced_subdivided_map': {
      // Variant 11: The Subdivided Map (3-Part Deduction)
      const leg1 = Math.floor(Math.random() * 5) + 3; // 3 to 7
      const leg2 = Math.floor(Math.random() * 5) + 3; // 3 to 7
      const leg3 = Math.floor(Math.random() * 8) + 4; // 4 to 11
      const totalDist = leg1 + leg2 + leg3;
      answer = `${leg3} km`;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "PART_WHOLE",
          isStatic: true,
          whole: `${totalDist} km`,
          parts: [
            { displayValue: `${leg1} km`, layoutSize: leg1, segments: 1 },
            { displayValue: `${leg2} km`, layoutSize: leg2, segments: 1 },
            { displayValue: "?", layoutSize: leg3, segments: 1 }
          ]
        }
      });

      if (isMCQ) {
        askText = `A route is ${totalDist} km in total. Leg A is ${leg1} km and Leg B is ${leg2} km. What is the distance of Leg C?`;
        const d1 = `${leg3 + 2} km`;
        const d2 = `${leg1 + leg2} km`;
        const d3 = `${totalDist - leg1} km`;
        mcqOptions = [answer, d1, d2, d3].sort(() => 0.5 - Math.random());
        solutionSteps = [
          `Total distance = ${totalDist} km.`,
          `Sum of Leg A and B = ${leg1} + ${leg2} = ${leg1 + leg2} km.`,
          `Distance of Leg C = ${totalDist} - ${leg1 + leg2} = ${leg3} km.`
        ];
        hint = `Add the two known legs together, then subtract that sum from the total.`;
      } else {
        let structText = `STORY: ${names[0]} is hiking a trail that is ${totalDist} km long in total. The distance from the entrance to the camp is ${leg1} km. The distance from the camp to the waterfall is ${leg2} km. What is the distance from the waterfall to the peak?`;
        let shortText = `Total route is ${totalDist} km. Leg A is ${leg1} km and Leg B is ${leg2} km. What is Leg C?`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          const firstSum = leg1 + leg2;
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { 
                label: `Working equation (Sum):`, 
                expectedAnswer: `${leg1} + ${leg2} = ${firstSum}`,
                acceptedAnswers: [
                  `${leg1}+${leg2}=${firstSum}`,
                  `${leg1} + ${leg2}=${firstSum}`,
                  `${leg1}+${leg2} = ${firstSum}`
                ]
              },
              { 
                label: `Working equation (Remaining):`, 
                expectedAnswer: `${totalDist} - ${firstSum} = ${leg3}`,
                acceptedAnswers: [
                  `${totalDist}-${firstSum}=${leg3}`,
                  `${totalDist} - ${firstSum}=${leg3}`,
                  `${totalDist}-${firstSum} = ${leg3}`
                ]
              },
              { 
                label: `Distance to peak =`, 
                expectedAnswer: `${leg3} km`,
                acceptedAnswers: [`${leg3}km`, `${leg3} km`]
              }
            ]
          });
        }

        solutionSteps = [
          `1. Add the two known legs: ${leg1} + ${leg2} = ${leg1 + leg2} km.`,
          `2. The total distance is ${totalDist} km.`,
          `3. Remaining distance = ${totalDist} - ${leg1 + leg2} = ${leg3} km.`
        ];
        hint = `Find the total of the parts you know first, then subtract from the whole.`;
      }
      break;
    }

    case 'advanced_hidden_beaker': {
      // Variant 12: The Hidden Beaker (Conversion + Deduction)
      const litres = Math.floor(Math.random() * 3) + 1; // 1 to 3
      const extraMl = (Math.floor(Math.random() * 8) + 1) * 100; // 100 to 800
      const totalMl = (litres * 1000) + extraMl;
      const juice1 = (Math.floor(Math.random() * 5) + 3) * 50; // 150 to 350
      const juice2 = totalMl - juice1;
      answer = `${juice2} ml`;

      // Render Beaker A (juice1)
      visualEngineStr = JSON.stringify({
        componentToRender: "VOLUME_BEAKER",
        componentData: {
          maxScale: 1000,
          intervals: 50,
          labelInterval: 200,
          value: juice1,
          unit: "ml",
          color: "#f97316", // orange
          label: "Orange Juice"
        }
      });

      if (isMCQ) {
        askText = `A total mixture needs ${litres} ℓ ${extraMl} ml of liquid. The beaker shows the volume of liquid A. What is the missing volume of liquid B in ml?`;
        const d1 = `${juice2 + 100} ml`;
        const d2 = `${juice2 - 100 > 0 ? juice2 - 100 : juice2 + 200} ml`;
        const d3 = `${totalMl + juice1} ml`;
        mcqOptions = [answer, d1, d2, d3].sort(() => 0.5 - Math.random());
        solutionSteps = [
          `Target volume = ${litres} ℓ ${extraMl} ml = ${totalMl} ml.`,
          `Volume of liquid A (from beaker) = ${juice1} ml.`,
          `Volume of liquid B = ${totalMl} - ${juice1} = ${juice2} ml.`
        ];
        hint = `Convert the target into ml first, then subtract the beaker volume.`;
      } else {
        const liqName1 = "orange juice";
        const liqName2 = "apple juice";
        let structText = `STORY: Wei Ling needs ${litres} ℓ ${extraMl} ml of fruit punch for a party. The beaker model shows the amount of ${liqName1} she already has. How many more millilitres of juice does she need to add to reach her target?`;
        let shortText = `Target is ${litres} ℓ ${extraMl} ml. Beaker A is shown as ${juice1} ml. Find the missing amount in ml.`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Target volume (in ml) =`, expectedAnswer: totalMl.toString() },
              { label: `Volume in beaker (in ml) =`, expectedAnswer: juice1.toString() },
              { 
                label: `Working equation:`, 
                expectedAnswer: `${totalMl} - ${juice1} = ${juice2}`,
                acceptedAnswers: [
                  `${totalMl}-${juice1}=${juice2}`,
                  `${totalMl} - ${juice1}=${juice2}`,
                  `${totalMl}-${juice1} = ${juice2}`
                ]
              },
              { 
                label: `Missing volume =`, 
                expectedAnswer: `${juice2} ml`,
                acceptedAnswers: [`${juice2}ml`, `${juice2} mL`, `${juice2}mL`]
              }
            ]
          });
        }

        solutionSteps = [
          `1. Target volume = ${litres} ℓ ${extraMl} ml = ${totalMl} ml.`,
          `2. Read the beaker to find the starting liquid: ${juice1} ml.`,
          `3. Missing volume = ${totalMl} - ${juice1} = ${juice2} ml.`
        ];
        hint = `Convert the total to ml, find the current amount on the beaker, and subtract.`;
      }
      break;
    }

    case 'advanced_round_trip_journey': {
      // Variant 13: The Round Trip Journey
      const oneWay = Math.floor(Math.random() * 5) + 2; // 2 to 6 km
      const detour = Math.floor(Math.random() * 3) + 1; // 1 to 3 km
      const totalRoundTrip = oneWay + oneWay + detour;
      answer = `${totalRoundTrip} km`;

      if (isMCQ) {
        askText = `A journey is ${oneWay} km one way. What is the total distance of a round trip plus an extra ${detour} km?`;
        const d1 = `${oneWay * 2} km`;
        const d2 = `${oneWay + detour} km`;
        const d3 = `${totalRoundTrip + 2} km`;
        mcqOptions = [answer, d1, d2, d3].sort(() => 0.5 - Math.random());
        solutionSteps = [
          `One-way distance = ${oneWay} km.`,
          `Round trip distance = ${oneWay} + ${oneWay} = ${oneWay * 2} km.`,
          `Total distance = ${oneWay * 2} + ${detour} = ${totalRoundTrip} km.`
        ];
        hint = `Remember a round trip means traveling the distance twice! Then add the extra distance.`;
      } else {
        let structText = `STORY: ${names[0]} cycles ${oneWay} km from his house to the swimming complex, and back along the exact same route. Afterwards, he cycles ${detour} km to the mall. What is the total distance he cycled?`;
        let shortText = `Home to school is ${oneWay} km. What is the total distance traveled going to school and back home, plus an extra ${detour} km?`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { 
                label: `Working equation (Round trip):`, 
                expectedAnswer: `${oneWay} + ${oneWay} = ${oneWay * 2}`,
                acceptedAnswers: [
                  `${oneWay}+${oneWay}=${oneWay * 2}`,
                  `${oneWay} + ${oneWay}=${oneWay * 2}`,
                  `${oneWay}+${oneWay} = ${oneWay * 2}`,
                  `${oneWay} * 2 = ${oneWay * 2}`,
                  `${oneWay} x 2 = ${oneWay * 2}`,
                  `${oneWay}*2=${oneWay * 2}`,
                  `${oneWay}x2=${oneWay * 2}`
                ]
              },
              { 
                label: `Working equation (Total):`, 
                expectedAnswer: `${oneWay * 2} + ${detour} = ${totalRoundTrip}`,
                acceptedAnswers: [
                  `${oneWay * 2}+${detour}=${totalRoundTrip}`,
                  `${oneWay * 2} + ${detour}=${totalRoundTrip}`,
                  `${oneWay * 2}+${detour} = ${totalRoundTrip}`
                ]
              },
              { 
                label: `Total distance =`, 
                expectedAnswer: `${totalRoundTrip} km`,
                acceptedAnswers: [`${totalRoundTrip}km`, `${totalRoundTrip} km`]
              }
            ]
          });
        }

        solutionSteps = [
          `1. Distance to destination = ${oneWay} km.`,
          `2. Distance back home = ${oneWay} km. (Round trip = ${oneWay * 2} km).`,
          `3. Total distance = ${oneWay * 2} + ${detour} = ${totalRoundTrip} km.`
        ];
        hint = `Add the distance going there and coming back, then add the final leg.`;
      }
      break;
    }

    case 'advanced_combining_volumes': {
      // Variant 14: Combining Volumes (Target Threshold Check)
      const capacities = [
        { total: 1000, text: "1 Litre" },
        { total: 1500, text: "1 ℓ 500 ml" },
        { total: 2000, text: "2 Litres" }
      ];
      const jug = capacities[Math.floor(Math.random() * capacities.length)];
      const targetVol = jug.total;
      
      const minCup1 = Math.floor((targetVol * 0.4) / 100) * 100;
      const maxCup1 = Math.floor((targetVol * 0.7) / 100) * 100;
      const cup1 = (Math.floor(Math.random() * ((maxCup1 - minCup1)/100 + 1)) * 100) + minCup1;
      
      const diff = (Math.floor(Math.random() * 4) - 2) * 100;
      const actualDiff = diff === 0 ? 100 : diff;
      const cup2 = targetVol - cup1 + actualDiff;
      
      const totalVol = cup1 + cup2;
      const overflows = totalVol > targetVol;
      answer = overflows ? "Yes" : "No";

      if (isMCQ) {
        askText = `Which pair of volumes is greater than ${jug.text}?`;
        const pairs = [
          [Math.floor(targetVol * 0.4), Math.floor(targetVol * 0.5)], // 0.9
          [Math.floor(targetVol * 0.3), Math.floor(targetVol * 0.6)], // 0.9
          [Math.floor(targetVol * 0.6), Math.floor(targetVol * 0.55)], // 1.15 (correct option)
          [Math.floor(targetVol * 0.2), Math.floor(targetVol * 0.7)] // 0.9
        ].sort(() => 0.5 - Math.random());
        
        let correctOption = "";
        let distractors = [];
        for (let pair of pairs) {
          const sum = pair[0] + pair[1];
          const str = `${pair[0]}ml + ${pair[1]}ml`;
          if (sum > targetVol && correctOption === "") {
            correctOption = str;
          } else {
            if (distractors.length < 3) distractors.push(str);
          }
        }
        if (!correctOption) correctOption = `${Math.floor(targetVol * 0.6)}ml + ${Math.floor(targetVol * 0.5)}ml`;
        
        answer = correctOption;
        mcqOptions = [answer, ...distractors];
        if (mcqOptions.length > 4) mcqOptions.length = 4;
        mcqOptions.sort(() => 0.5 - Math.random());

        solutionSteps = [
          `${jug.text} is equal to ${targetVol} ml.`,
          `Add the volumes in each option to see which one is greater than ${targetVol} ml.`,
          `The correct option is ${answer}.`
        ];
        hint = `Remember that ${jug.text} = ${targetVol} ml. Find the pair that adds up to more than ${targetVol}.`;
      } else {
        let structText = `STORY: ${names[0]} has an empty jug that holds exactly ${jug.text}. She has two cups containing ${cup1} ml and ${cup2} ml of liquid. If she pours both into the jug, will it overflow?`;
        let shortText = `Add ${cup1} ml and ${cup2} ml. Is it more than ${jug.text}? (Type Yes/No)`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { 
                label: `Working equation:`, 
                expectedAnswer: `${cup1} + ${cup2} = ${totalVol}`,
                acceptedAnswers: [
                  `${cup1}+${cup2}=${totalVol}`,
                  `${cup1} + ${cup2}=${totalVol}`,
                  `${cup1}+${cup2} = ${totalVol}`
                ]
              },
              { label: `Target volume =`, expectedAnswer: `${targetVol} ml`, acceptedAnswers: [`${targetVol}ml`, `${targetVol} ml`, `${targetVol} mL`, `${targetVol}mL`, `${targetVol}`] },
              { 
                label: `Will it overflow? (Yes/No):`, 
                expectedAnswer: answer,
                acceptedAnswers: [answer, answer.toLowerCase(), answer.toUpperCase()]
              }
            ]
          });
        }

        solutionSteps = [
          `1. Calculate total volume: ${cup1} + ${cup2} = ${totalVol} ml.`,
          `2. Note that ${jug.text} = ${targetVol} ml.`,
          `3. Compare: ${totalVol} ml is ${overflows ? 'greater' : 'less'} than ${targetVol} ml. So the answer is ${answer}.`
        ];
        hint = `Convert ${jug.text} to ml, add the two cups together, and see if the total is bigger.`;
      }
      break;
    }

    case 'advanced_constant_difference': {
      // Variant 15: The Constant Difference (Find the Total)
      const largeVol = (Math.floor(Math.random() * 5) + 6) * 100 + 50; // 650, 750, 850, 950, 1050
      const diff = (Math.floor(Math.random() * 4) + 2) * 100 + 20; // 220, 320, 420, 520
      const smallVol = largeVol - diff;
      const totalBoth = largeVol + smallVol;
      answer = `${totalBoth} ml`;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "COMPARISON",
          isStatic: true,
          bar1: { name: "Large Bottle", layoutSize: largeVol, displayValue: `${largeVol} ml` },
          bar2: { name: "Small Bottle", layoutSize: smallVol, displayValue: "?" },
          difference: { layoutSize: diff, displayValue: `${diff} ml` }
        }
      });

      if (isMCQ) {
        askText = `A large bottle contains ${largeVol} ml of water. A small bottle contains ${diff} ml less water than the large bottle. What is the total volume of water in both bottles?`;
        const d1 = `${largeVol + diff} ml`;
        const d2 = `${smallVol} ml`;
        const d3 = `${largeVol * 2} ml`;
        mcqOptions = [answer, d1, d2, d3].sort(() => 0.5 - Math.random());
        solutionSteps = [
          `Large bottle = ${largeVol} ml.`,
          `Small bottle = ${largeVol} - ${diff} = ${smallVol} ml.`,
          `Total volume = ${largeVol} + ${smallVol} = ${totalBoth} ml.`
        ];
        hint = `First find the small bottle, then add it to the large bottle to find the total.`;
      } else {
        const liq = liquids[0] || "water";
        let structText = `STORY: ${names[0]} has a large bottle containing ${largeVol} ml of ${liq}. A small bottle contains ${diff} ml less ${liq} than the large bottle. What is the total volume of ${liq} in both bottles?`;
        let shortText = `Jug A has ${largeVol} ml. Jug B has ${diff} ml less than Jug A. What is the total volume of both jugs?`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { 
                label: `Working equation (Small bottle):`, 
                expectedAnswer: `${largeVol} - ${diff} = ${smallVol}`,
                acceptedAnswers: [
                  `${largeVol}-${diff}=${smallVol}`,
                  `${largeVol} - ${diff}=${smallVol}`,
                  `${largeVol}-${diff} = ${smallVol}`
                ]
              },
              { 
                label: `Working equation (Total):`, 
                expectedAnswer: `${largeVol} + ${smallVol} = ${totalBoth}`,
                acceptedAnswers: [
                  `${largeVol}+${smallVol}=${totalBoth}`,
                  `${largeVol} + ${smallVol}=${totalBoth}`,
                  `${largeVol}+${smallVol} = ${totalBoth}`
                ]
              },
              { 
                label: `Total volume =`, 
                expectedAnswer: `${totalBoth} ml`,
                acceptedAnswers: [`${totalBoth}ml`, `${totalBoth} mL`, `${totalBoth}mL`]
              }
            ]
          });
        }

        solutionSteps = [
          `1. The small bottle is ${diff} ml less than ${largeVol} ml.`,
          `2. Small bottle = ${largeVol} - ${diff} = ${smallVol} ml.`,
          `3. Total volume = ${largeVol} + ${smallVol} = ${totalBoth} ml.`
        ];
        hint = `Don't stop at the small bottle! You must add both bottles together at the end.`;
      }
      break;
    }
  }

  const mcqOptionsStr = mcqOptions ? JSON.stringify(mcqOptions) : "[]";
  const solutionStepsStr = solutionSteps ? JSON.stringify(solutionSteps) : "[]";

  const questionInstruction = askText.includes('STORY:')
    ? `you must rewrite the text following 'STORY:' to create a highly engaging, creative word problem for a Primary 3 student. However, you MUST strictly follow these rules:\n1. NEVER reveal the actual numerical answers or values that the student is supposed to find by reading the visual models.\n2. Preserve any mathematical values and operations if they are explicitly provided in the original STORY string.\n3. DO NOT add any extra unrequested questions (e.g., do not add 'How many altogether?').\n4. Keep the final question sentence exactly as intended.\n5. DO NOT include the word "STORY:" or any other prefixes in your final generated questionText.`
    : `you MUST use the exact string provided in 'askText'. DO NOT paraphrase or rewrite it.`;

  const aiPrompt = getFormatInstructions(visualEngineStr, inputRequirementStr) + `
    You are an expert Primary 3 math question generator.
    
    Question parameters:
    - askText: ${JSON.stringify(askText)}
    - answer: ${JSON.stringify(answer)}
    - options: ${mcqOptionsStr}
    - hint: ${JSON.stringify(hint)}
    - solutionSteps: ${solutionStepsStr}
    
    CRITICAL INSTRUCTION: For 'questionText', ${questionInstruction}
    CRITICAL INSTRUCTION: For 'finalAnswer', you MUST use the exact string provided in 'answer'. DO NOT add any extra words.
    CRITICAL INSTRUCTION: For 'options', you MUST use the exact array provided in 'options' (if applicable).
    CRITICAL INSTRUCTION: For 'hint', you MUST use the exact string provided in 'hint'.
    CRITICAL INSTRUCTION: For 'solutionSteps', you MUST use the exact array provided in 'solutionSteps'. DO NOT add extra items to the array. DO NOT inject any key-value pairs (like "modelDescription") into this array; it must be a strict array of strings only.
    `;

  return {
    aiPrompt,
    visualEngine: JSON.parse(visualEngineStr),
    inputRequirement: inputRequirementStr ? JSON.parse(inputRequirementStr) : null
  };
};
