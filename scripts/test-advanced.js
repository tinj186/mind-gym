import { p3EquivalentFractionsBlueprint } from '../src/lib/syllabus/math/primary-3/fractions-equivalent-fractions/equivalent-fractions.js';

const variants = [
  'advanced_remaining_simplify',
  'advanced_equivalence_chain',
  'advanced_who_is_correct',
  'advanced_reverse_simplest',
  'advanced_find_total_parts'
];

variants.forEach(variant => {
  console.log(`\n--- Testing ${variant} ---`);
  try {
    const result = p3EquivalentFractionsBlueprint.generate('Advanced', variant, 'Structured');
    console.log("Success!");
    console.log(result.visualEngineStr);
    console.log(result.inputRequirementStr);
  } catch(e) {
    console.error("Error generating variant:", e);
  }
});
