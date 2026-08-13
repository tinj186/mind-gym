import { p3EquivalentFractionsBlueprint } from './src/lib/syllabus/math/primary-3/fractions-equivalent-fractions/equivalent-fractions.js';

const variants = [
  'standard_simplest_form_2',
  'standard_simplest_form_3_4',
  'standard_scaling_reverse',
  'standard_true_false',
  'standard_simplest_missing_step'
];

variants.forEach(variant => {
  try {
    const res = p3EquivalentFractionsBlueprint.generate('Standard', variant, 'Structured');
    console.log(`\n\n--- ${variant} ---\n`);
    console.log(res.aiPrompt);
  } catch (err) {
    console.error(variant, err);
  }
});
