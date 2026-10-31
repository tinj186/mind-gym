import assert from 'assert';
import { p4NumberComparisonAndOrderingBlueprint } from '../src/lib/syllabus/math/primary-4/whole-numbers-numbers-up-to-100000/number-comparison-and-ordering.js';

console.log("--- Testing standard_total_difference_base Structured Generator ---");

const observedTargetTypes = new Set();
const observedProblemTypes = new Set();

for (let i = 0; i < 40; i++) {
  const genResult = p4NumberComparisonAndOrderingBlueprint.generate("standard", "standard_total_difference_base", "structured");
  
  assert(genResult && genResult.aiPrompt, "aiPrompt must exist");
  assert(genResult.aiPrompt.includes('"inputType": "INTERACTIVE_BAR_BUILDER"'), "Prompt must include INTERACTIVE_BAR_BUILDER");
  assert(genResult.aiPrompt.includes('"correctModelType": "COMPARISON"'), "Prompt must specify COMPARISON model");
  assert(genResult.aiPrompt.includes('"problemType": "TOTAL_DIFFERENCE_BASE"'), "Prompt must have TOTAL_DIFFERENCE_BASE problem type");
  assert(genResult.aiPrompt.includes('"entities"'), "Prompt must contain entities configuration");
  assert(genResult.aiPrompt.includes('"total"'), "Prompt must contain total configuration");
  assert(genResult.aiPrompt.includes('"steps"'), "Prompt must contain steps with acceptedAnswers");

  if (genResult.aiPrompt.includes('"targetType": "BAR"')) observedTargetTypes.add("BAR");
  if (genResult.aiPrompt.includes('"targetType": "TOTAL"')) observedTargetTypes.add("TOTAL");
  if (genResult.aiPrompt.includes('"targetType": "DIFFERENCE"')) observedTargetTypes.add("DIFFERENCE");
  observedProblemTypes.add("TOTAL_DIFFERENCE_BASE");
}

console.log("✅ Observed target types across subtypes:", Array.from(observedTargetTypes));
assert(observedTargetTypes.has("BAR"), "Must include BAR target (subtypes 0, 1, 2)");
assert(observedTargetTypes.has("TOTAL"), "Must include TOTAL target (subtypes 3, 4)");
assert(observedTargetTypes.has("DIFFERENCE"), "Must include DIFFERENCE target (subtypes 5, 6)");

console.log("✅ All target types (BAR, TOTAL, DIFFERENCE) verified successfully across subtypes!");
