with open('/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-3/measurement-length-mass-and-volume/measurement-km-ml/foundation.js', 'r') as f:
    content = f.read()

v1_old = """      const configs = [
        { maxScale: 1000, intervals: 100, labelInterval: 200 },
        { maxScale: 500, intervals: 50, labelInterval: 100 },
        { maxScale: 100, intervals: 10, labelInterval: 20 }
      ];
      const config = configs[Math.floor(Math.random() * configs.length)];
      const { maxScale, intervals, labelInterval } = config;
      
      // Ensure value lands on an unlabelled tick (odd multiple of intervals)
      const tickCounts = [1, 3, 5, 7, 9];
      const tickCount = tickCounts[Math.floor(Math.random() * tickCounts.length)];
      const value = tickCount * intervals;"""

v1_new = """      const configs = [
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

content = content.replace(v1_old, v1_new)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-3/measurement-length-mass-and-volume/measurement-km-ml/foundation.js', 'w') as f:
    f.write(content)

print("Done")
