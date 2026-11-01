import { p4NumberComparisonAndOrderingBlueprint } from '../src/lib/syllabus/math/primary-4/whole-numbers-numbers-up-to-100000/number-comparison-and-ordering.js';

console.log("=== Testing advanced_equalizing_transfer Structure Mode ===");

const varieties = [
  'find_transfer_from_initial',
  'find_initial_from_equalized',
  'find_initial_from_total_and_transfer',
  'find_difference_from_transfer',
  'find_other_initial_from_one_initial'
];

for (const v of varieties) {
  console.log(`\nTesting variety: ${v}`);
  const result = p4NumberComparisonAndOrderingBlueprint.generate('advanced', 'advanced_equalizing_transfer', 'structure', {
    explicitVariety: v
  });

  if (!result || !result.aiPrompt) {
    throw new Error(`Failed to generate aiPrompt for ${v}`);
  }

  // Verify visualEngine has hideVisual: true and componentToRender: "NONE"
  if (!result.aiPrompt.includes('"componentToRender": "NONE"') || !result.aiPrompt.includes('"hideVisual": true')) {
    throw new Error(`visualEngine does not hide visual for ${v}`);
  }

  // Verify inputType: "INTERACTIVE_BAR_BUILDER"
  if (!result.aiPrompt.includes('"inputType": "INTERACTIVE_BAR_BUILDER"')) {
    throw new Error(`inputType is not INTERACTIVE_BAR_BUILDER for ${v}`);
  }

  // Verify barBuilderConfig problemType
  if (!result.aiPrompt.includes('"problemType": "EQUALIZING_TRANSFER"')) {
    throw new Error(`problemType is not EQUALIZING_TRANSFER for ${v}`);
  }

  console.log(`✓ Generated and verified prompt structure for ${v}`);
}

console.log("\nAll 5 varieties generated successfully with correct INTERACTIVE_BAR_BUILDER configurations!");
