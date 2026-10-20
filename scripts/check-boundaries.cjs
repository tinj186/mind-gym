const fs = require('fs');
const lines = fs.readFileSync('src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/graph-axis-scales/foundation.js', 'utf8').split('\n');

const checks = [
  "variant === 'foundation_scale_step_identification'",
  "variant === 'foundation_large_scale_summation'",
  "variant === 'foundation_grid_block_multiplication'",
  "variant === 'foundation_scale_verification_difference'",
  "Variant 5: Combining Multiple Bars on Base Scales",
  "const aiPrompt = `CRITICAL INSTRUCTIONS:"
];

checks.forEach(c => {
  const idx = lines.findIndex(l => l.includes(c));
  console.log(c, idx);
});
