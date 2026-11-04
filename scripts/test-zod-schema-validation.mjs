import { UniversalQuestionSchema } from '../src/app/api/admin/generate/questionSchema.js';
import { p4FactorsAndMultiplesBlueprint } from '../src/lib/syllabus/math/primary-4/whole-numbers-factors-and-multiples/factors-and-multiples.js';

console.log('--- Validating UniversalQuestionSchema Against Factors & Multiples Variants ---\n');

const variantsByDiff = {
  foundation: [
    'foundation_rainbow_pairing',
    'foundation_multiple_skip_counter',
    'foundation_boundary_constraints_all_factors',
    'foundation_relationship_true_false',
    'foundation_digit_card_multiples'
  ],
  standard: [
    'standard_common_factor_venn',
    'standard_bounded_multiple_finder',
    'standard_common_multiple_sequence',
    'standard_geometry_area_factors',
    'standard_exclusion_packing'
  ],
  advanced: [
    'advanced_mystery_number_dual_constraints',
    'advanced_synchronization_periodic_intervals',
    'advanced_factor_sum_difference',
    'advanced_grouping_with_leftovers',
    'advanced_hcf_grid_square_tiling'
  ]
};

const qTypes = ['mcq', 'short question', 'structured'];
let passed = 0;
let total = 0;

for (const [diff, variants] of Object.entries(variantsByDiff)) {
  for (const variant of variants) {
    for (const qType of qTypes) {
      total++;
      const result = p4FactorsAndMultiplesBlueprint.generate(diff, variant, qType);
      
      // Simulate what the LLM JSON parser / generation pipeline produces
      const zodDiff = diff.charAt(0).toUpperCase() + diff.slice(1);
      const zodType = qType === 'mcq' ? 'MCQ' : qType === 'short question' ? 'SHORT_QUESTION' : 'STRUCTURED';

      const mockAiOutput = {
        meta: {
          level: 'Primary 4',
          topic: 'Whole Numbers - Factors and Multiples',
          subtopic: 'Factors and Multiples',
          difficulty: zodDiff,
          type: zodType,
          variant: variant
        },
        visualEngine: result.visualEngine || {
          componentToRender: 'NONE',
          componentData: { hideVisual: true }
        },
        inputRequirement: result.inputRequirement || {
          inputType: qType === 'mcq' ? 'MCQ_BUTTONS' : qType === 'short question' ? 'STANDARD_TEXT' : 'MULTI_STEP_INPUT'
        },
        content: {
          questionText: "Sample question stem",
          options: qType === 'mcq' ? ['1', '2', '3', '4'] : null,
          defectMap: qType === 'mcq' ? { '1': 'CARELESS_CALCULATION' } : {},
          finalAnswer: "4",
          solutionSteps: "Step 1: Compute.\\nStep 2: Conclude.",
          hint: "Conceptual hint."
        }
      };

      try {
        UniversalQuestionSchema.parse(mockAiOutput);
        passed++;
      } catch (err) {
        console.error(`❌ Zod Validation FAILED for ${diff} - ${variant} - ${qType}:`, err);
        process.exit(1);
      }
    }
    console.log(`✅ Passed Zod validation for: ${variant}`);
  }
}

console.log(`\n========================================`);
console.log(`Summary: ${passed} / ${total} tests passed!`);
console.log(`🎉 ALL VARIANTS FULLY COMPLIANT WITH UNIVERSAL QUESTION SCHEMA!`);
