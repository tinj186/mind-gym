import { p3EquivalentFractionWritingBlueprint } from './src/lib/syllabus/math/primary-3/fractions-equivalent-fractions/equivalent-fraction-writing.js';

console.log("=== Testing Standard - Multiplier Checkpoint ===");
const res = p3EquivalentFractionWritingBlueprint.generate('Standard', 'standard_multiplier_check', 'Structured');
console.log(JSON.stringify(res, null, 2));

console.log("\n=== Testing Standard - Forward Denominator ===");
const res2 = p3EquivalentFractionWritingBlueprint.generate('Standard', 'standard_forward_denominator', 'MCQ');
console.log(JSON.stringify(res2, null, 2));
