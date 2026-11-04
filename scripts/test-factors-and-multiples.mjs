import { p4FactorsAndMultiplesBlueprint } from '../src/lib/syllabus/math/primary-4/whole-numbers-factors-and-multiples/factors-and-multiples.js';

console.log('--- Testing Primary 4 Factors and Multiples (15 Variants) ---\n');

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

const questionTypes = ['mcq', 'short question', 'structured'];

let passed = 0;
let total = 0;

for (const [diff, variants] of Object.entries(variantsByDiff)) {
  for (const variant of variants) {
    for (const qType of questionTypes) {
      total++;
      try {
        const result = p4FactorsAndMultiplesBlueprint.generate(diff, variant, qType);
        
        if (!result || !result.aiPrompt) {
          throw new Error(`Missing aiPrompt for ${diff} - ${variant} - ${qType}`);
        }

        // Check if aiPrompt contains essential keywords
        if (!result.aiPrompt.includes('CRITICAL INSTRUCTIONS')) {
          throw new Error(`aiPrompt missing CRITICAL INSTRUCTIONS for ${variant}`);
        }

        if (qType === 'mcq') {
          if (!result.aiPrompt.includes('Generate EXACTLY 4 options')) {
            throw new Error(`MCQ prompt missing 4 options instruction for ${variant}`);
          }
        } else if (qType === 'structured') {
          if (!result.inputRequirement || result.inputRequirement.inputType !== 'MULTI_STEP_INPUT') {
            throw new Error(`Structured question missing MULTI_STEP_INPUT for ${variant}`);
          }
          if (!result.inputRequirement.steps || result.inputRequirement.steps.length === 0) {
            throw new Error(`Structured question missing steps for ${variant}`);
          }
        }

        passed++;
      } catch (err) {
        console.error(`❌ FAILED: ${diff} -> ${variant} (${qType}):`, err.message);
      }
    }
    console.log(`✅ Passed all question types for variant: ${variant}`);
  }
}

console.log(`\n========================================`);
console.log(`Summary: ${passed} / ${total} tests passed!`);
if (passed === total) {
  console.log('🎉 ALL 15 VARIANTS VERIFIED SUCCESSFULLY!');
} else {
  process.exit(1);
}
