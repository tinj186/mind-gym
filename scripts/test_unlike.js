import { p3UnlikeFractionComparisonBlueprint } from '../src/lib/syllabus/math/primary-3/fractions-equivalent-fractions/unlike-fraction-comparison.js';

const variants = Object.keys(p3UnlikeFractionComparisonBlueprint.variants);
const types = ['Short Question', 'MCQ', 'Structured'];

for (const variant of variants) {
  for (const type of types) {
    try {
      const difficulty = variant.startsWith('standard') ? 'standard' : 'foundation';
      const result = p3UnlikeFractionComparisonBlueprint.generate(difficulty, variant, type);
      console.log(`[SUCCESS] ${variant} - ${type}`);
    } catch (e) {
      console.error(`[ERROR] ${variant} - ${type}:`, e.stack);
    }
  }
}
