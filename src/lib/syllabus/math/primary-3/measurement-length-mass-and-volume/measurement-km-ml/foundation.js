import { getRandomNames, getRandomLiquids } from '@/lib/utils/variable-bank';

function getUniqueNumericOptions(answer, options) {
  // Simple helper to return unique options including the answer, shuffled
  const set = new Set(options);
  set.add(answer);
  // Ensure we have exactly 4 options
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

export const foundationLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
  const names = getRandomNames(2);
  const liquids = getRandomLiquids(2);

  let askText, answer, mcqOptions, solutionSteps, hint;
  let visualEngineStr = `{"componentToRender": "NONE", "componentData": {}}`;
  let inputRequirementStr = null;

  switch (activeVariant) {
    case 'foundation_direct_beaker_reading': {
      // Direct Beaker Reading (On the Tick)
      const configs = [
        // Pattern 1: Labels at every alternate tick
        { maxScale: 1000, intervals: 100, labelInterval: 200, validTicks: [1, 3, 5, 7, 9] },
        { maxScale: 500, intervals: 50, labelInterval: 100, validTicks: [1, 3, 5, 7, 9] },
        { maxScale: 100, intervals: 10, labelInterval: 20, validTicks: [1, 3, 5, 7, 9] },
        // Pattern 2: Labels at 5x multiplier (halfway and full)
        { maxScale: 1000, intervals: 100, labelInterval: 500, validTicks: [1, 2, 3, 4, 6, 7, 8, 9] },
        { maxScale: 500, intervals: 50, labelInterval: 250, validTicks: [1, 2, 3, 4, 6, 7, 8, 9] },
        { maxScale: 100, intervals: 10, labelInterval: 50, validTicks: [1, 2, 3, 4, 6, 7, 8, 9] },
        // Pattern 3: Labels at 4x multiplier
        { maxScale: 800, intervals: 100, labelInterval: 400, validTicks: [1, 2, 3, 5, 6, 7] },
      ];
      const config = configs[Math.floor(Math.random() * configs.length)];
      const { maxScale, intervals, labelInterval, validTicks } = config;
      
      // Ensure value lands on an unlabelled tick based on the selected config's validTicks array
      const tickCount = validTicks[Math.floor(Math.random() * validTicks.length)];
      const value = tickCount * intervals;
      const valueStr = value.toString();

      answer = valueStr;
      
      visualEngineStr = JSON.stringify({
        componentToRender: "VOLUME_BEAKER",
        componentData: {
          maxScale: maxScale,
          intervals: intervals,
          labelInterval: labelInterval,
          value: value,
          unit: "ml",
          color: "#3b82f6"
        }
      });

      if (isMCQ) {
        askText = `What is the volume of the water shown?`;
        const dist1 = (value + intervals).toString();
        const dist2 = (value - intervals > 0 ? value - intervals : value + 2 * intervals).toString();
        const dist3 = (value + 50).toString();
        mcqOptions = getUniqueNumericOptions(answer, [dist1, dist2, dist3]);
        solutionSteps = [
          `Look at the highest line the liquid reaches.`,
          `It perfectly aligns with the ${valueStr}ml mark.`
        ];
        hint = `Read the number on the scale that aligns with the top of the liquid.`;
      } else {
        const liquid1 = liquids[0];
        let structText = `STORY: ${names[0]} pours some ${liquid1} into a beaker. Look at the visual model. What is the volume of the drink?`;
        let shortText = `Read the volume of the liquid in the beaker in ml.`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: "Look at the beaker. What number does the liquid reach?", expectedAnswer: valueStr },
              { label: "Write the volume with the correct unit symbol for millilitres:", expectedAnswer: valueStr + " ml", acceptedAnswers: [valueStr + "ml", valueStr + " mL", valueStr + "mL"] }
            ]
          });
        }

        solutionSteps = [
          `1. Find the liquid level in the beaker.`,
          `2. Read the number exactly where the liquid stops. It is ${valueStr}ml.`
        ];
        hint = `Match the top of the liquid to the number on the side of the beaker.`;
      }
      break;
    }

    case 'foundation_advanced_beaker_reading': {
      // Advanced Beaker Reading (Between the Ticks)
      const configs = [
        // Pattern 1: Labels at every alternate tick
        { maxScale: 1000, intervals: 100, labelInterval: 200, validMultipliers: [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5] },
        { maxScale: 500, intervals: 50, labelInterval: 100, validMultipliers: [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5] },
        { maxScale: 100, intervals: 10, labelInterval: 20, validMultipliers: [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5] },
        // Pattern 2: Labels at 5x multiplier (halfway and full)
        { maxScale: 1000, intervals: 100, labelInterval: 500, validMultipliers: [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5] },
        { maxScale: 500, intervals: 50, labelInterval: 250, validMultipliers: [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5] },
        { maxScale: 100, intervals: 10, labelInterval: 50, validMultipliers: [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5] },
        // Pattern 3: Labels at 4x multiplier
        { maxScale: 800, intervals: 100, labelInterval: 400, validMultipliers: [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5] },
      ];
      const config = configs[Math.floor(Math.random() * configs.length)];
      const { maxScale, intervals, labelInterval, validMultipliers } = config;
      
      const selectedMultiplier = validMultipliers[Math.floor(Math.random() * validMultipliers.length)];
      const value = selectedMultiplier * intervals;
      const valueStr = value.toString();
      
      const lowerTick = (selectedMultiplier - 0.5) * intervals;
      const upperTick = (selectedMultiplier + 0.5) * intervals;

      answer = valueStr;
      
      visualEngineStr = JSON.stringify({
        componentToRender: "VOLUME_BEAKER",
        componentData: {
          maxScale: maxScale,
          intervals: intervals,
          labelInterval: labelInterval,
          value: value,
          unit: "ml",
          color: "#8b5cf6" // A different color like grape juice
        }
      });

      if (isMCQ) {
        askText = `Look at the beaker. What is the volume of the liquid?`;
        const dist1 = lowerTick.toString();
        const dist2 = upperTick.toString();
        const dist3 = (value + (intervals / 2)).toString();
        mcqOptions = getUniqueNumericOptions(answer, [dist1, dist2, dist3]);
        solutionSteps = [
          `The liquid level is exactly halfway between ${lowerTick}ml and ${upperTick}ml.`,
          `Halfway between ${lowerTick} and ${upperTick} is ${valueStr}ml.`
        ];
        hint = `Find the number exactly in the middle of the two tick marks the liquid is between.`;
      } else {
        const liquid2 = liquids[1];
        let structText = `STORY: ${names[1]} is making ${liquid2}. The liquid level in his beaker is exactly halfway between ${lowerTick} ml and ${upperTick} ml. What is the volume?`;
        let shortText = `What is the volume of the liquid in ml?`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: "Look at the beaker. What number does the liquid reach?", expectedAnswer: valueStr },
              { label: "Write the volume with the correct unit symbol for millilitres:", expectedAnswer: valueStr + " ml", acceptedAnswers: [valueStr + "ml", valueStr + " mL", valueStr + "mL"] }
            ]
          });
        }

        const diff = intervals / 2;
        solutionSteps = [
          `1. Find the two tick marks that the liquid is between: ${lowerTick}ml and ${upperTick}ml.`,
          `2. Find the exact middle: ${lowerTick} + ${diff} = ${valueStr}ml.`
        ];
        hint = `Since it is halfway between ${lowerTick} and ${upperTick}, what number comes in the middle?`;
      }
      break;
    }

    case 'foundation_map_path_distance': {
      // Map Path Distance (Direct Reading)
      const distance = Math.floor(Math.random() * 8) + 2; // 2 to 9 km
      const distanceStr = distance.toString();
      
      const themes = ['park', 'river', 'road'];
      const mapTheme = themes[Math.floor(Math.random() * themes.length)];
      
      let themeLocation = '';
      let themeActivity = '';
      if (mapTheme === 'park') {
        themeLocation = 'East Coast Park';
        themeActivity = 'jogging path';
      } else if (mapTheme === 'river') {
        themeLocation = 'the Singapore River';
        themeActivity = 'kayaking route';
      } else {
        themeLocation = 'the downtown area';
        themeActivity = 'driving route';
      }
      
      answer = distanceStr;
      
      visualEngineStr = JSON.stringify({
        componentToRender: "MEASUREMENT_RULER",
        componentData: {
          isPerimeter: true,
          sides: [distance],
          items: [{ label: "Distance (km)" }],
          mapTheme: mapTheme
        }
      });

      if (isMCQ) {
        askText = `Look at the map path. How far is it from the start to the end in km?`;
        const dist1 = (distance + 1).toString();
        const dist2 = (distance - 1 > 0 ? distance - 1 : distance + 2).toString();
        const dist3 = (distance + 2).toString();
        mcqOptions = getUniqueNumericOptions(answer, [dist1, dist2, dist3]);
        solutionSteps = [
          `Count the number of segments on the path.`,
          `There are ${distanceStr} segments, so it is ${distanceStr} km.`
        ];
        hint = `Read the number at the end of the path on the ruler.`;
      } else {
        let structText = `STORY: ${names[0]} is exploring ${themeLocation}. Look at the map showing the ${themeActivity}. Use the interactive ruler to find the total distance from the start point to the destination.`;
        let shortText = `What is the distance of the path shown in km?`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: "Align the 0 mark on the ruler to the start flag. What number does the destination pin point to?", expectedAnswer: distanceStr },
              { label: "Write the distance with the correct unit symbol for kilometres:", expectedAnswer: distanceStr + " km", acceptedAnswers: [distanceStr + "km", distanceStr + " km"] }
            ]
          });
        }

        solutionSteps = [
          `1. Click and drag the interactive ruler.`,
          `2. Line up the 0 mark exactly with the start flag.`,
          `3. Read the number that aligns with the destination pin. It points to ${distanceStr}, so the distance is ${distanceStr} km.`
        ];
        hint = `Drag the ruler and line up the 0 mark with the start flag. What number is at the destination pin?`;
      }
      break;
    }

    case 'foundation_unit_appropriateness': {
      // Unit Appropriateness (km vs. m / ml vs. l)
      const scenarios = [
        { desc: "distance between two towns", short: "distance between towns", unit: "km", alt1: "m", alt2: "cm", alt3: "mm", longUnit: "kilometres", longAlt1: "metres" },
        { desc: "water in a swimming pool", short: "swimming pool", unit: "l", alt1: "ml", alt2: "g", alt3: "kg", longUnit: "litres", longAlt1: "millilitres" },
        { desc: "medicine in a small spoon", short: "spoonful of medicine", unit: "ml", alt1: "l", alt2: "m", alt3: "km", longUnit: "millilitres", longAlt1: "litres" },
        { desc: "length of a school field", short: "school field", unit: "m", alt1: "km", alt2: "cm", alt3: "ml", longUnit: "metres", longAlt1: "kilometres" }
      ];
      const selected = scenarios[Math.floor(Math.random() * scenarios.length)];
      
      answer = selected.unit;
      visualEngineStr = `{"componentToRender": "NONE", "componentData": {}}`;

      if (isMCQ) {
        askText = `Which unit of measurement is most suitable for the ${selected.short}?`;
        mcqOptions = [selected.unit, selected.alt1, selected.alt2, selected.alt3].sort(() => 0.5 - Math.random());
        solutionSteps = [
          `Think about how large or small the ${selected.short} is.`,
          `${selected.unit} is the standard unit to measure this.`
        ];
        hint = `Is it very big or very small? Choose the unit that matches.`;
      } else {
        let structText = `STORY: ${names[0]} wants to measure the ${selected.desc}. Which unit of measurement is the most suitable: ${selected.alt1} or ${selected.unit}?`;
        let shortText = `Would you measure the ${selected.short} in ${selected.alt1} or ${selected.unit}?`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          const conversionLabel = selected.unit === 'km' || selected.alt1 === 'km' 
            ? "How many metres are in 1 kilometre?"
            : "How many millilitres are in 1 litre?";
          const conversionAns = "1000";
          const descriptionLabel = selected.unit === 'km' 
            ? `For very long distances like towns, type the correct unit (${selected.alt1} or ${selected.unit}):`
            : selected.unit === 'l'
              ? `For very large volumes like a swimming pool, type the correct unit (${selected.alt1} or ${selected.unit}):`
              : selected.unit === 'ml'
                ? `For very small volumes like a spoon, type the correct unit (${selected.alt1} or ${selected.unit}):`
                : `For short distances like a school field, type the correct unit (${selected.alt1} or ${selected.unit}):`;

          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: conversionLabel, expectedAnswer: conversionAns },
              { label: descriptionLabel, expectedAnswer: selected.unit }
            ]
          });
        }

        solutionSteps = [
          `The ${selected.short} requires an appropriate unit for its size.`,
          `Therefore, ${selected.unit} is the correct unit.`
        ];
        hint = `Think about whether it is long/heavy/large or short/light/small.`;
      }
      break;
    }

    case 'foundation_visual_volume_comparison': {
      // Visual Volume Comparison (Two Beakers with different scales)
      const configs = [
        { maxScale: 1000, intervals: 100, labelInterval: 200, validMultipliers: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
        { maxScale: 500, intervals: 50, labelInterval: 100, validMultipliers: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
        { maxScale: 100, intervals: 10, labelInterval: 20, validMultipliers: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
        { maxScale: 1000, intervals: 100, labelInterval: 500, validMultipliers: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
        { maxScale: 500, intervals: 50, labelInterval: 250, validMultipliers: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
        { maxScale: 100, intervals: 10, labelInterval: 50, validMultipliers: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
        { maxScale: 800, intervals: 100, labelInterval: 400, validMultipliers: [1, 2, 3, 4, 5, 6, 7] },
      ];
      
      // Shuffle configs to get two DIFFERENT scales
      const shuffledConfigs = [...configs].sort(() => 0.5 - Math.random());
      const configA = shuffledConfigs[0];
      const configB = shuffledConfigs[1];

      let valA = configA.validMultipliers[Math.floor(Math.random() * configA.validMultipliers.length)] * configA.intervals;
      let valB = configB.validMultipliers[Math.floor(Math.random() * configB.validMultipliers.length)] * configB.intervals;
      
      // Ensure the volumes are actually different so one is definitely 'more'
      while (valA === valB) {
        valB = configB.validMultipliers[Math.floor(Math.random() * configB.validMultipliers.length)] * configB.intervals;
      }
      
      const moreBeaker = valA > valB ? "Beaker A" : "Beaker B";
      const diff = Math.abs(valA - valB);
      
      answer = moreBeaker;
      
      visualEngineStr = JSON.stringify({
        componentToRender: "MULTI_COMPONENT",
        componentData: {
          components: [
            {
              componentToRender: "VOLUME_BEAKER",
              componentData: {
                maxScale: configA.maxScale,
                intervals: configA.intervals,
                labelInterval: configA.labelInterval,
                value: valA,
                unit: "ml",
                color: "#3b82f6",
                label: "Beaker A",
                className: "flex-1"
              }
            },
            {
              componentToRender: "VOLUME_BEAKER",
              componentData: {
                maxScale: configB.maxScale,
                intervals: configB.intervals,
                labelInterval: configB.labelInterval,
                value: valB,
                unit: "ml",
                color: "#eab308",
                label: "Beaker B",
                className: "flex-1"
              }
            }
          ]
        }
      });

      if (isMCQ) {
        askText = `Look at the models. Which beaker contains more liquid?`;
        mcqOptions = ["Beaker A", "Beaker B", "They are equal", "Cannot be determined"].sort(() => 0.5 - Math.random());
        solutionSteps = [
          `Beaker A has ${valA}ml and Beaker B has ${valB}ml.`,
          `${moreBeaker} has more liquid.`
        ];
        hint = `Read the volume of both beakers and compare the numbers.`;
      } else {
        const charName = names[0];
        const liq1 = liquids[0];
        const liq2 = liquids[1];
        let structText = `STORY: ${charName} is comparing ${liq1} and ${liq2}. Beaker A contains some ${liq1} and Beaker B contains some ${liq2}. Look at the visual models to find out which beaker holds more liquid.`;
        let shortText = `Which beaker contains more liquid, Beaker A or Beaker B?`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Read the volume of Beaker A (in ml):`, expectedAnswer: valA.toString() },
              { label: `Read the volume of Beaker B (in ml):`, expectedAnswer: valB.toString() },
              { label: `Which beaker has a larger volume of liquid? (Type A or B)`, expectedAnswer: moreBeaker.replace('Beaker ', '') }
            ]
          });
        }

        solutionSteps = [
          `1. Volume of Beaker A is ${valA}ml.`,
          `2. Volume of Beaker B is ${valB}ml.`,
          `3. Since ${Math.max(valA, valB)} > ${Math.min(valA, valB)}, ${moreBeaker} has more.`
        ];
        hint = `Find out how much liquid is in each beaker first!`;
      }
      break;
    }
  }

  const mcqOptionsStr = mcqOptions ? JSON.stringify(mcqOptions) : "[]";
  const solutionStepsStr = solutionSteps ? JSON.stringify(solutionSteps) : "[]";

  const questionInstruction = askText.includes('STORY:')
    ? `you must rewrite the text following 'STORY:' to create a highly engaging, creative word problem for a Primary 3 student. However, you MUST strictly follow these rules:\n1. NEVER reveal the actual numerical answers or values that the student is supposed to find by reading the visual models.\n2. Preserve any mathematical values and operations if they are explicitly provided in the original STORY string.\n3. DO NOT add any extra unrequested questions (e.g., do not add 'How many altogether?').\n4. Keep the final question sentence exactly as intended.`
    : `you MUST use the exact string provided in 'askText'. DO NOT paraphrase or rewrite it.`;

  const aiPrompt = `You are an expert Primary 3 math question generator.
    
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
    CRITICAL INSTRUCTION: For 'visualEngine', you MUST output EXACTLY the JSON object provided in the OUTPUT FORMAT template below. Do NOT hallucinate your own visual models or stringify nested arrays.
    
    ${getFormatInstructions(visualEngineStr, inputRequirementStr)}
  `;

  return { aiPrompt };
};
