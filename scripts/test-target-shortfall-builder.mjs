import assert from 'assert';
import { p4NumberComparisonAndOrderingBlueprint } from '../src/lib/syllabus/math/primary-4/whole-numbers-numbers-up-to-100000/number-comparison-and-ordering.js';

console.log("--- Testing standard_target_shortfall_comparison Structured Generator ---");

// Test across multiple runs to verify all randomized subtypes
const observedTargetTypes = new Set();

for (let i = 0; i < 20; i++) {
  const genResult = p4NumberComparisonAndOrderingBlueprint.generate("standard", "standard_target_shortfall_comparison", "structured");
  
  assert(genResult && genResult.aiPrompt, "aiPrompt must exist");
  assert(genResult.aiPrompt.includes('"inputType": "INTERACTIVE_BAR_BUILDER"'), "Prompt must include INTERACTIVE_BAR_BUILDER");
  assert(genResult.aiPrompt.includes('"correctModelType": "PART_WHOLE"'), "Prompt must specify PART_WHOLE model");
  assert(genResult.aiPrompt.includes('"problemType": "TARGET_SHORTFALL"'), "Prompt must have TARGET_SHORTFALL problem type");
  assert(genResult.aiPrompt.includes('"whole"'), "Prompt must contain whole object configuration");
  assert(genResult.aiPrompt.includes('"parts"'), "Prompt must contain parts configuration");
  assert(genResult.aiPrompt.includes('"isShortfall": true'), "Prompt must contain isShortfall indicator");

  if (genResult.aiPrompt.includes('"targetType": "SHORTFALL"')) observedTargetTypes.add("SHORTFALL");
  if (genResult.aiPrompt.includes('"targetType": "ENTITY_B"')) observedTargetTypes.add("ENTITY_B");
  if (genResult.aiPrompt.includes('"targetType": "ENTITY_A"')) observedTargetTypes.add("ENTITY_A");
  if (genResult.aiPrompt.includes('"targetType": "TARGET"')) observedTargetTypes.add("TARGET");
}

console.log("✅ Observed target types across subtypes:", Array.from(observedTargetTypes));
assert(observedTargetTypes.size >= 3, "Should exercise multiple target shortfall subtypes");

console.log("✅ Generator successfully produces PART_WHOLE INTERACTIVE_BAR_BUILDER schema across all subtypes.");
