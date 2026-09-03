import re

with open('/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-3/measurement-length-mass-and-volume/measurement-km-ml/foundation.js', 'r') as f:
    content = f.read()

v2_old = """    case 'foundation_advanced_beaker_reading': {
      // Advanced Beaker Reading (Between the Ticks)
      const configs = [
        { maxScale: 1000, intervals: 200, labelInterval: 200 },
        { maxScale: 500, intervals: 100, labelInterval: 100 },
        { maxScale: 50, intervals: 10, labelInterval: 10 }
      ];
      const config = configs[Math.floor(Math.random() * configs.length)];
      const { maxScale, intervals, labelInterval } = config;
      
      // Ticks are at intervals (e.g. 200, 400).
      // We want a value halfway between ticks (e.g., 100, 300)
      const multipliers = [0.5, 1.5, 2.5, 3.5, 4.5];
      const selectedMultiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
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
        const dist3 = (value + 50).toString();
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
              { label: "The water is above which major marking?", expectedAnswer: lowerTick.toString() },
              { label: "The water is below which major marking?", expectedAnswer: upperTick.toString() },
              { label: `What number is exactly halfway between ${lowerTick} and ${upperTick}?`, expectedAnswer: valueStr }
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
    }"""

v2_new = """    case 'foundation_advanced_beaker_reading': {
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
    }"""

content = content.replace(v2_old, v2_new)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-3/measurement-length-mass-and-volume/measurement-km-ml/foundation.js', 'w') as f:
    f.write(content)

print("Done")
