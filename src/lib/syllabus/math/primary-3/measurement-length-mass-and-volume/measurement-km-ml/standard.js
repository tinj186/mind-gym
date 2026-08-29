import { getRandomNames, getRandomLiquids, getRandomObjects } from '@/lib/utils/variable-bank';

function getUniqueNumericOptions(answer, options) {
  const set = new Set(options);
  set.add(answer);
  let arr = Array.from(set);
  while (arr.length < 4) {
    let dummy = (parseInt(answer) + Math.floor(Math.random() * 100) + 10).toString();
    if (dummy !== answer) {
      arr.push(dummy);
      set.add(dummy);
      arr = Array.from(set);
    }
  }
  return arr.sort(() => 0.5 - Math.random());
}

export const standardLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
  const names = getRandomNames(2);
  const liquids = getRandomLiquids(2);
  
  let askText, answer, mcqOptions, solutionSteps, hint;
  let visualEngineStr = `{"componentToRender": "NONE", "componentData": {}}`;
  let inputRequirementStr = null;

  switch (activeVariant) {
    case 'standard_beaker_to_compound_conversion': {
      // Variant 6: Beaker Reading to Compound Conversion
      const maxScale = (Math.floor(Math.random() * 3) + 2) * 1000; // 2000, 3000, 4000
      const intervals = 100;
      let totalMl = 0;
      while (totalMl === 0 || totalMl % 1000 === 0) {
        totalMl = (Math.floor(Math.random() * (maxScale / intervals)) + 1) * intervals;
      }
      
      const litres = Math.floor(totalMl / 1000);
      const ml = totalMl % 1000;
      const answerStr = `${litres} l ${ml} ml`;
      answer = answerStr;

      visualEngineStr = JSON.stringify({
        componentToRender: "VOLUME_BEAKER",
        componentData: {
          maxScale: maxScale,
          intervals: intervals,
          labelInterval: 500,
          value: totalMl,
          unit: "ml",
          color: "#f59e0b"
        }
      });

      if (isMCQ) {
        askText = `Look at the beaker. What is the total volume of the liquid in ml?`;
        answer = `${totalMl} ml`;
        const dist1 = `${totalMl + 100} ml`;
        const dist2 = `${totalMl - 100 > 0 ? totalMl - 100 : totalMl + 200} ml`;
        const dist3 = `${totalMl + 500} ml`;
        mcqOptions = [answer, dist1, dist2, dist3].sort(() => 0.5 - Math.random());
        solutionSteps = [
          `Read the scale on the beaker to find the liquid level.`,
          `The liquid is at the ${totalMl} mark.`,
          `Therefore, the total volume is ${totalMl} ml.`
        ];
        hint = `Look carefully at the scale and the liquid level to find the volume in ml.`;
      } else {
        const liquid = liquids[0];
        let structText = `STORY: ${names[0]} boils a large pot of ${liquid}. She pours it into a giant measuring beaker. Look at the model. Read the total volume in ml, then convert it to litres and millilitres.`;
        let shortText = `Read the beaker and express the volume in l and ml.`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { 
                label: `Read the total volume from the beaker:`, 
                expectedAnswer: totalMl + " ml", 
                acceptedAnswers: [totalMl + "ml", totalMl + " mL", totalMl + "mL"] 
              },
              { 
                label: `Convert this to litres and millilitres. How many litres (l)?`, 
                expectedAnswer: litres.toString(), 
                acceptedAnswers: [litres.toString(), litres + "l", litres + " l", litres + " L", litres + "L"] 
              },
              { 
                label: `How many millilitres (ml)?`, 
                expectedAnswer: ml.toString(), 
                acceptedAnswers: [ml.toString(), ml + "ml", ml + " ml", ml + " mL", ml + "mL"] 
              }
            ]
          });
          answer = `${totalMl} ml = ${litres} l ${ml} ml`;
        }

        solutionSteps = [
          `1. Read the beaker scale. The liquid level is at ${totalMl} ml.`,
          `2. Convert ml to l and ml: 1000 ml = 1 l.`,
          `3. ${totalMl} ml = ${litres} l ${ml} ml.`
        ];
        hint = `Read the scale to find the total ml. Then split it into thousands (litres) and the rest (millilitres).`;
      }
      break;
    }

    case 'standard_map_distance_addition': {
      // Variant 7: Map Distance Addition
      const dist1 = Math.floor(Math.random() * 3) + 2; // 2 to 4 km
      const dist2 = Math.floor(Math.random() * 3) + 2; // 2 to 4 km
      const totalDist = dist1 + dist2;
      answer = `${totalDist} km`;

      const themes = ['park', 'road'];
      const mapTheme = themes[Math.floor(Math.random() * themes.length)];

      visualEngineStr = JSON.stringify({
        componentToRender: "MEASUREMENT_RULER",
        componentData: {
          isPerimeter: true,
          sides: [dist1, dist2],
          items: [{ label: "Distance (km)" }],
          mapTheme: mapTheme
        }
      });

      if (isMCQ) {
        askText = `Find the total length of the path shown in the map.`;
        const d1 = `${totalDist + 1} km`;
        const d2 = `${totalDist - 1 > 0 ? totalDist - 1 : totalDist + 2} km`;
        const d3 = `${totalDist + Math.floor(Math.random() * 2) + 3} km`;
        mcqOptions = [answer, d1, d2, d3].sort(() => 0.5 - Math.random());
        solutionSteps = [
          `The first segment is ${dist1} km.`,
          `The second segment is ${dist2} km.`,
          `Total distance = ${dist1} + ${dist2} = ${totalDist} km.`
        ];
        hint = `Add the lengths of both segments of the path together.`;
      } else {
        let structText = `STORY: ${names[0]} travels ${dist1} km from home to the library, and then another ${dist2} km from the library to the destination. Look at the map path. What is the total distance traveled?`;
        let shortText = `What is the total distance from the start to the end of the path in km?`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Length of first segment (km) =`, expectedAnswer: dist1.toString() },
              { label: `Length of second segment (km) =`, expectedAnswer: dist2.toString() },
              { 
                label: `Working equation:`, 
                expectedAnswer: `${dist1} + ${dist2} = ${totalDist}`,
                acceptedAnswers: [
                  `${dist1}+${dist2}=${totalDist}`,
                  `${dist1} + ${dist2}=${totalDist}`,
                  `${dist1}+${dist2} = ${totalDist}`,
                  `${dist1} + ${dist2} = ${totalDist}`
                ]
              },
              { 
                label: `Total distance =`, 
                expectedAnswer: `${totalDist} km`,
                acceptedAnswers: [`${totalDist}km`, `${totalDist} km`]
              }
            ]
          });
        }

        solutionSteps = [
          `1. Distance of first part = ${dist1} km.`,
          `2. Distance of second part = ${dist2} km.`,
          `3. Total distance = ${dist1} + ${dist2} = ${totalDist} km.`
        ];
        hint = `Count or read the length of each segment and add them together.`;
      }
      break;
    }

    case 'standard_volume_deduction': {
      // Variant 8: Volume Deduction (Poured Out)
      const configs = [
        { maxScale: 1000, intervals: 100, labelInterval: 200, validTicks: [5, 6, 7, 8, 9] },
        { maxScale: 500, intervals: 50, labelInterval: 100, validTicks: [5, 6, 7, 8, 9] },
        { maxScale: 100, intervals: 10, labelInterval: 20, validTicks: [5, 6, 7, 8, 9] },
        { maxScale: 1000, intervals: 100, labelInterval: 500, validTicks: [4, 6, 7, 8, 9] },
        { maxScale: 500, intervals: 50, labelInterval: 250, validTicks: [4, 6, 7, 8, 9] },
        { maxScale: 100, intervals: 10, labelInterval: 50, validTicks: [4, 6, 7, 8, 9] },
        { maxScale: 800, intervals: 100, labelInterval: 400, validTicks: [5, 6, 7] }
      ];
      const config = configs[Math.floor(Math.random() * configs.length)];
      const { maxScale, intervals, labelInterval, validTicks } = config;
      
      const tickCount = validTicks[Math.floor(Math.random() * validTicks.length)];
      const startVol = tickCount * intervals; 
      
      // Ensure pourVol requires standard-level subtraction (not a clean multiple of intervals)
      const basePour = Math.floor(Math.random() * (tickCount - 2)) + 1; // At least 1 tick, up to tickCount-1
      const pourVol = (basePour * intervals) + (intervals / 2);
      const remainder = startVol - pourVol;
      answer = `${remainder} ml`;

      visualEngineStr = JSON.stringify({
        componentToRender: "VOLUME_BEAKER",
        componentData: {
          maxScale: maxScale,
          intervals: intervals,
          labelInterval: labelInterval,
          value: startVol,
          unit: "ml",
          color: "#22c55e",
          label: "Starting Volume"
        }
      });

      if (isMCQ) {
        askText = `A beaker starts with ${startVol} ml of liquid. If ${pourVol} ml is poured out, what is the final volume?`;
        const d1 = `${remainder + 10} ml`;
        const d2 = `${remainder - 10 > 0 ? remainder - 10 : remainder + 20} ml`;
        const d3 = `${startVol + pourVol} ml`;
        mcqOptions = [answer, d1, d2, d3].sort(() => 0.5 - Math.random());
        solutionSteps = [
          `Starting volume = ${startVol} ml.`,
          `Volume poured out = ${pourVol} ml.`,
          `Final volume = ${startVol} - ${pourVol} = ${remainder} ml.`
        ];
        hint = `Subtract the amount poured out from the starting amount shown.`;
      } else {
        const liquid = liquids[0];
        let structText = `STORY: The model shows the starting amount of ${liquid} in a jug. ${names[0]} pours out ${pourVol} ml to share with friends. How much ${liquid} is left in the jug?`;
        let shortText = `A beaker has ${startVol} ml of water. ${pourVol} ml is poured out. How much is left?`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Starting volume shown (ml) =`, expectedAnswer: startVol.toString() },
              { label: `Amount poured out (ml) =`, expectedAnswer: pourVol.toString() },
              { 
                label: `Working equation:`, 
                expectedAnswer: `${startVol} - ${pourVol} = ${remainder}`,
                acceptedAnswers: [
                  `${startVol}-${pourVol}=${remainder}`,
                  `${startVol} - ${pourVol}=${remainder}`,
                  `${startVol}-${pourVol} = ${remainder}`,
                  `${startVol} - ${pourVol} = ${remainder}`
                ]
              },
              { 
                label: `Remaining volume =`, 
                expectedAnswer: `${remainder} ml`,
                acceptedAnswers: [`${remainder}ml`, `${remainder} mL`, `${remainder}mL`]
              }
            ]
          });
        }

        solutionSteps = [
          `1. Read the starting volume from the beaker: ${startVol} ml.`,
          `2. Subtract the amount poured out: ${startVol} - ${pourVol} = ${remainder} ml.`
        ];
        hint = `First read the total volume from the beaker. Then subtract the amount that was poured out.`;
      }
      break;
    }

    case 'standard_distance_to_target': {
      // Variant 9: Distance to Target
      const totalDist = (Math.floor(Math.random() * 20) + 10); // 10 to 29
      const traveled = (Math.floor(Math.random() * (totalDist - 5)) + 2); // 2 to total-3
      const remaining = totalDist - traveled;
      answer = `${remaining} km`;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "PART_WHOLE",
          isStatic: true,
          whole: `${totalDist} km`,
          parts: [
            { displayValue: `${traveled} km`, layoutSize: traveled, segments: 1 },
            { displayValue: "?", layoutSize: remaining, segments: 1 }
          ]
        }
      });

      if (isMCQ) {
        askText = `A target distance is ${totalDist} km. If ${traveled} km is already traveled, what is the remaining distance?`;
        const d1 = `${remaining + 1} km`;
        const d2 = `${remaining - 1 > 0 ? remaining - 1 : remaining + 2} km`;
        const d3 = `${totalDist + traveled} km`;
        mcqOptions = [answer, d1, d2, d3].sort(() => 0.5 - Math.random());
        solutionSteps = [
          `Total distance = ${totalDist} km.`,
          `Traveled distance = ${traveled} km.`,
          `Remaining distance = ${totalDist} - ${traveled} = ${remaining} km.`
        ];
        hint = `Subtract the traveled part from the total whole to find the missing part.`;
      } else {
        let structText = `STORY: The total distance between two towns is ${totalDist} km. A bus has traveled ${traveled} km so far. How many more kilometres does the bus need to travel to reach the destination?`;
        let shortText = `A marathon is ${totalDist} km. Someone has run ${traveled} km. How much further must they run?`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Total distance (km) =`, expectedAnswer: totalDist.toString() },
              { label: `Distance traveled (km) =`, expectedAnswer: traveled.toString() },
              { 
                label: `Working equation:`, 
                expectedAnswer: `${totalDist} - ${traveled} = ${remaining}`,
                acceptedAnswers: [
                  `${totalDist}-${traveled}=${remaining}`,
                  `${totalDist} - ${traveled}=${remaining}`,
                  `${totalDist}-${traveled} = ${remaining}`,
                  `${totalDist} - ${traveled} = ${remaining}`
                ]
              },
              { 
                label: `Remaining distance =`, 
                expectedAnswer: `${remaining} km`,
                acceptedAnswers: [`${remaining}km`, `${remaining} km`]
              }
            ]
          });
        }

        solutionSteps = [
          `1. From the bar model, the whole is ${totalDist} km.`,
          `2. One part is ${traveled} km.`,
          `3. Remaining part = ${totalDist} - ${traveled} = ${remaining} km.`
        ];
        hint = `The total distance is made of the traveled part plus the remaining part. Use subtraction.`;
      }
      break;
    }

    case 'standard_equal_groupings': {
      // Variant 10: Equal Groupings
      const groups = Math.floor(Math.random() * 4) + 3; // 3 to 6
      const perGroup = (Math.floor(Math.random() * 6) + 2) * 50; // 100 to 350
      const totalVol = groups * perGroup;
      answer = `${perGroup} ml`;

      const parts = Array(groups).fill(0).map(() => ({ displayValue: '?', layoutSize: perGroup, segments: 1 }));

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "PART_WHOLE",
          isStatic: true,
          whole: `${totalVol} ml`,
          parts: parts
        }
      });

      if (isMCQ) {
        askText = `A total volume of ${totalVol} ml is split equally into ${groups} identical containers. What is the volume of 1 container?`;
        const d1 = `${perGroup + 50} ml`;
        const d2 = `${perGroup - 50 > 0 ? perGroup - 50 : perGroup + 100} ml`;
        const d3 = `${Math.floor(totalVol / (groups - 1))} ml`;
        mcqOptions = [answer, d1, d2, d3].sort(() => 0.5 - Math.random());
        solutionSteps = [
          `Total volume = ${totalVol} ml.`,
          `Number of equal containers = ${groups}.`,
          `Volume per container = ${totalVol} ÷ ${groups} = ${perGroup} ml.`
        ];
        hint = `Divide the total volume by the number of equal parts in the bar model.`;
      } else {
        const liquid = liquids[0];
        let structText = `STORY: A large bottle holds ${totalVol} ml of ${liquid}. It is poured equally into ${groups} smaller travel bottles. What is the volume of ${liquid} in each travel bottle?`;
        let shortText = `${groups} identical cups hold ${totalVol} ml in total. What is the volume of 1 cup?`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Total volume (ml) =`, expectedAnswer: totalVol.toString() },
              { label: `Number of equal parts =`, expectedAnswer: groups.toString() },
              { 
                label: `Working equation:`, 
                expectedAnswer: `${totalVol} ÷ ${groups} = ${perGroup}`,
                acceptedAnswers: [
                  `${totalVol}/${groups}=${perGroup}`,
                  `${totalVol} / ${groups} = ${perGroup}`,
                  `${totalVol}÷${groups}=${perGroup}`,
                  `${totalVol} ÷ ${groups} = ${perGroup}`
                ]
              },
              { 
                label: `Volume of one part =`, 
                expectedAnswer: `${perGroup} ml`,
                acceptedAnswers: [`${perGroup}ml`, `${perGroup} mL`, `${perGroup}mL`]
              }
            ]
          });
        }

        solutionSteps = [
          `1. The bar model shows the total volume is ${totalVol} ml.`,
          `2. It is divided into ${groups} equal parts.`,
          `3. Volume of one part = ${totalVol} ÷ ${groups} = ${perGroup} ml.`
        ];
        hint = `Look at how many equal boxes make up the whole bar model, then divide the total by that number.`;
      }
      break;
    }
  }

  const mcqOptionsStr = mcqOptions ? JSON.stringify(mcqOptions) : "[]";
  const solutionStepsStr = solutionSteps ? JSON.stringify(solutionSteps) : "[]";

  const questionInstruction = askText.includes('STORY:')
    ? `you must rewrite the text following 'STORY:' to create a highly engaging, creative word problem for a Primary 3 student. However, you MUST strictly follow these rules:\n1. NEVER reveal the actual numerical answers or values that the student is supposed to find by reading the visual models.\n2. Preserve any mathematical values and operations if they are explicitly provided in the original STORY string.\n3. DO NOT add any extra unrequested questions (e.g., do not add 'How many altogether?').\n4. Keep the final question sentence exactly as intended.`
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
