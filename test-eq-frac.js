import { p3EquivalentFractionsBlueprint } from './src/lib/syllabus/math/primary-3/fractions-equivalent-fractions/equivalent-fractions.js';

['foundation_visual_missing_numerator', 'foundation_visual_missing_denominator', 'foundation_times_2_rule', 'foundation_times_3_rule', 'foundation_identifying_match'].forEach(variant => {
  console.log(`\n--- ${variant} ---`);
  try {
    const res = p3EquivalentFractionsBlueprint.generate('Foundation', variant, 'Structured');
    console.log(res.aiPrompt);
  } catch(e) {
    console.error(e);
  }
});
