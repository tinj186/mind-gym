with open('/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-3/measurement-length-mass-and-volume/measurement-km-ml/foundation.js', 'r') as f:
    content = f.read()

old_v1_tick = """      // Pick a random tick: 1 to 9 (e.g. 100 to 900)
      const tickCount = Math.floor(Math.random() * 9) + 1;
      const value = tickCount * intervals;"""

new_v1_tick = """      // Ensure value lands on an unlabelled tick (e.g., 100, 300, 500, 700, 900)
      // since labelInterval is 200.
      const tickCounts = [1, 3, 5, 7, 9];
      const tickCount = tickCounts[Math.floor(Math.random() * tickCounts.length)];
      const value = tickCount * intervals;"""

content = content.replace(old_v1_tick, new_v1_tick)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-3/measurement-length-mass-and-volume/measurement-km-ml/foundation.js', 'w') as f:
    f.write(content)

print("Done")
