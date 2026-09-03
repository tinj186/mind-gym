import re

with open('/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-3/measurement-length-mass-and-volume/measurement-km-ml/foundation.js', 'r') as f:
    content = f.read()

# Variant 1 Fix
v1_old_start = """    case 'foundation_direct_beaker_reading': {
      // Direct Beaker Reading (On the Tick)
      const maxScale = 1000;
      const intervals = 100;
      // Ensure value lands on an unlabelled tick (e.g., 100, 300, 500, 700, 900)
      // since labelInterval is 200.
      const tickCounts = [1, 3, 5, 7, 9];
      const tickCount = tickCounts[Math.floor(Math.random() * tickCounts.length)];
      const value = tickCount * intervals;
      const valueStr = value.toString();

      answer = valueStr;
      
      visualEngineStr = JSON.stringify({
        componentToRender: "VOLUME_BEAKER",
        componentData: {
          maxScale: maxScale,
          intervals: intervals,
          labelInterval: intervals * 2,
          value: value,
          unit: "ml",
          color: "#3b82f6"
        }
      });"""

v1_new_start = """    case 'foundation_direct_beaker_reading': {
      // Direct Beaker Reading (On the Tick)
      const configs = [
        { maxScale: 1000, intervals: 100, labelInterval: 200 },
        { maxScale: 500, intervals: 50, labelInterval: 100 },
        { maxScale: 100, intervals: 10, labelInterval: 20 }
      ];
      const config = configs[Math.floor(Math.random() * configs.length)];
      const { maxScale, intervals, labelInterval } = config;
      
      // Ensure value lands on an unlabelled tick (odd multiple of intervals)
      const tickCounts = [1, 3, 5, 7, 9];
      const tickCount = tickCounts[Math.floor(Math.random() * tickCounts.length)];
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
      });"""

content = content.replace(v1_old_start, v1_new_start)

# Variant 2 Fix
v2_old_start = """    case 'foundation_advanced_beaker_reading': {
      // Advanced Beaker Reading (Between the Ticks)
      const maxScale = 1000;
      const intervals = 200;
      // Ticks are at 200, 400, 600, 800
      // We want a value halfway between ticks (e.g., 100, 300, 500, 700, 900)
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
          intervals: intervals / 2,
          labelInterval: intervals,
          value: value,
          unit: "ml",
          color: "#8b5cf6" // A different color like grape juice
        }
      });"""

v2_new_start = """    case 'foundation_advanced_beaker_reading': {
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
      });"""

content = content.replace(v2_old_start, v2_new_start)

# Update V2 solution steps to use dynamic diff
old_v2_steps = """        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: "The water is above which major marking?", expectedAnswer: lowerTick.toString() },
              { label: "The water is below which major marking?", expectedAnswer: upperTick.toString() },
              { label: `What number is exactly halfway between ${lowerTick} and ${upperTick}?`, expectedAnswer: valueStr }
            ]
          });
        }

        solutionSteps = [
          `1. Find the two tick marks that the liquid is between: ${lowerTick}ml and ${upperTick}ml.`,
          `2. Find the exact middle: ${lowerTick} + 100 = ${valueStr}ml.`
        ];"""

new_v2_steps = """        if (isStructure) {
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
        ];"""

content = content.replace(old_v2_steps, new_v2_steps)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-3/measurement-length-mass-and-volume/measurement-km-ml/foundation.js', 'w') as f:
    f.write(content)

print("Done")
