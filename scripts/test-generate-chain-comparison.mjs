import { p4NumberComparisonAndOrderingBlueprint } from '../src/lib/syllabus/math/primary-4/whole-numbers-numbers-up-to-100000/number-comparison-and-ordering.js';

console.log("=== Testing Standard Chain Comparison Three Entities Structured Pipeline ===");

// 1. Verify variants map
const standardVariants = Object.keys(p4NumberComparisonAndOrderingBlueprint.variants).filter(k => k.startsWith('standard'));
console.log("Active standard variants:", standardVariants);
if (standardVariants.length !== 1 || standardVariants[0] !== 'standard_chain_comparison_three_entities') {
  console.warn("Expected only standard_chain_comparison_three_entities to be active, found:", standardVariants);
}

// 2. Generate blueprint prompt for Structured
const blueprintResult = p4NumberComparisonAndOrderingBlueprint.generate('Standard', 'standard_chain_comparison_three_entities', 'Structured');
console.log("Prompt generated successfully. Total length:", blueprintResult.aiPrompt.length);

// 3. Verify format instructions
const m = blueprintResult.aiPrompt.match(/"inputRequirement":\s*(\{[\s\S]*?\})\s*,\s*"content"/);
if (!m) {
  throw new Error("inputRequirement JSON not found in prompt!");
}

const inputRequirement = JSON.parse(m[1]);
console.log("inputType:", inputRequirement.inputType);
console.log("Number of calculation steps:", inputRequirement.steps?.length);
console.log("barBuilderConfig entities count:", inputRequirement.barBuilderConfig?.entities?.length);
console.log("barBuilderConfig correctModelType:", inputRequirement.barBuilderConfig?.correctModelType);

if (inputRequirement.inputType !== 'INTERACTIVE_BAR_BUILDER') {
  throw new Error("inputType is not INTERACTIVE_BAR_BUILDER!");
}

if (inputRequirement.barBuilderConfig?.correctModelType !== 'COMPARISON') {
  throw new Error("correctModelType is not COMPARISON!");
}

console.log("✅ All checks passed! Ready for structured question generation with the interactive bar model.");
