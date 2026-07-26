import { fractionComparisonBlueprint } from '../src/lib/syllabus/math/primary-2/fractions-fraction-of-a-whole/fraction-comparison-up-to-denominator-12.js';

try {
  const result = fractionComparisonBlueprint.generate('foundation', 'foundation_compare_like_fractions_visual', 'Structured');
  console.log(result.aiPrompt);
} catch (e) {
  console.error(e);
}
