import re

with open('/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-3/measurement-length-mass-and-volume/measurement-km-ml/foundation.js', 'r') as f:
    content = f.read()

v1_old = """      const configs = [
        { maxScale: 1000, intervals: 100, labelInterval: 500 },
        { maxScale: 500, intervals: 50, labelInterval: 250 },
        { maxScale: 100, intervals: 10, labelInterval: 50 }
      ];
      const config = configs[Math.floor(Math.random() * configs.length)];
      const { maxScale, intervals, labelInterval } = config;
      
      // Ensure value lands on an unlabelled tick.
      // Since labelInterval is maxScale / 2, the only labelled ticks are at 5 * intervals and 10 * intervals.
      // Valid unlabelled ticks: 1, 2, 3, 4, 6, 7, 8, 9
      const tickCounts = [1, 2, 3, 4, 6, 7, 8, 9];
      const tickCount = tickCounts[Math.floor(Math.random() * tickCounts.length)];
      const value = tickCount * intervals;"""

v1_new = """      const configs = [
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
      const value = tickCount * intervals;"""

content = content.replace(v1_old, v1_new)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-3/measurement-length-mass-and-volume/measurement-km-ml/foundation.js', 'w') as f:
    f.write(content)

print("Done")
