const fs = require('fs');
const path = require('path');

const standardFile = path.resolve(__dirname, '../src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/graph-axis-scales/standard.js');
const content = fs.readFileSync(standardFile, 'utf8');

const lines = content.split('\n');

// Find variant boundaries
const v1Start = lines.findIndex(l => l.includes("variant === 'standard_interpolating_halfway_marks'"));
const v2Start = lines.findIndex(l => l.includes("variant === 'standard_deductive_axis_labeling'"));
const v3Start = lines.findIndex(l => l.includes("variant === 'standard_comparative_differences_mixed_alignments'"));
const v4Start = lines.findIndex(l => l.includes("variant === 'standard_total_sum_mixed_alignments'"));
const v5Start = lines.findIndex(l => l.includes("// Variant 10: Scale Error Correction"));
const v5End = lines.findIndex((l, idx) => idx > v5Start && l.includes("const aiPrompt = `CRITICAL INSTRUCTIONS:"));

console.log({ v1Start, v2Start, v3Start, v4Start, v5Start, v5End });
