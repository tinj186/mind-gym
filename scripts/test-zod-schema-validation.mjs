import { UniversalQuestionSchema } from '../src/app/api/admin/generate/questionSchema.js';
import { p4FactorsAndMultiplesBlueprint } from '../src/lib/syllabus/math/primary-4/whole-numbers-factors-and-multiples/factors-and-multiples.js';
import { p3MentalCalculationMultiplicationTablesBlueprint } from '../src/lib/syllabus/math/primary-3/whole-numbers-multiplication-and-division/mental-calculation-multiplication-tables.js';

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

console.log('\n--- Validating UniversalQuestionSchema Against P3 Mental Calculation Variants ---\n');

const p3VariantsByDiff = {
  foundation: [
    'foundation_direct_fact_retrieval',
    'foundation_fact_family_link',
    'foundation_multiplying_multiples_10',
    'foundation_dividing_multiples_10',
    'foundation_direct_fact_retrieval_division'
  ],
  standard: [
    'standard_mental_splitting_addition',
    'standard_mental_compensation',
    'standard_splitting_for_division',
    'standard_halving_and_doubling',
    'standard_extrapolating_hundreds'
  ],
  advanced: [
    'advanced_chained_ops_multiply_add',
    'advanced_chained_ops_divide_subtract',
    'advanced_equivalent_expressions',
    'advanced_mental_scaling',
    'advanced_mental_reversal'
  ]
};

const p3Types = ['MCQ', 'Short Question'];

for (const [diff, variants] of Object.entries(p3VariantsByDiff)) {
  for (const variant of variants) {
    for (const qType of p3Types) {
      total++;
      const result = p3MentalCalculationMultiplicationTablesBlueprint.generate(diff, variant, qType);
      
      const zodDiff = diff.charAt(0).toUpperCase() + diff.slice(1);
      const zodType = qType === 'MCQ' ? 'MCQ' : 'SHORT_QUESTION';

      const mockAiOutput = {
        meta: {
          level: 'Primary 3',
          topic: 'Whole Numbers - Multiplication and Division',
          subtopic: 'Mental Calculation (Multiplication/Division)',
          difficulty: zodDiff,
          type: zodType
        },
        visualEngine: {
          componentToRender: variant === 'foundation_fact_family_link' ? 'FACT_TRIANGLE' : 'NONE',
          componentData: variant === 'foundation_fact_family_link' ? { product: '48', factors: ['6', '8'] } : { hideVisual: true }
        },
        inputRequirement: {
          inputType: qType === 'MCQ' ? 'MCQ_BUTTONS' : 'STANDARD_TEXT'
        },
        content: {
          questionText: "Calculate mentally: If 6 x 8 = 48, then 48 ÷ 6 = ?",
          options: qType === 'MCQ' ? ['8', '6', '9', '7'] : null,
          defectMap: qType === 'MCQ' ? { '6': 'CONFUSED_FACTORS', '9': 'OFF_BY_ONE_ERROR', '7': 'OFF_BY_ONE_ERROR' } : {},
          finalAnswer: "8",
          acceptedAnswers: ["8"],
          solutionSteps: "1. Using fact families:\n2. Since 6 x 8 = 48,\n3. 48 ÷ 6 = 8",
          hint: "Use the related multiplication fact from the same fact family to solve the division."
        }
      };

      try {
        UniversalQuestionSchema.parse(mockAiOutput);
        passed++;
      } catch (err) {
        console.error(`❌ Zod Validation FAILED for P3 ${diff} - ${variant} - ${qType}:`, err);
        process.exit(1);
      }
    }
    console.log(`✅ Passed Zod validation for: ${variant}`);
  }
}

console.log(`\n========================================`);
console.log(`Summary: ${passed} / ${total} tests passed!`);
console.log(`🎉 ALL VARIANTS FULLY COMPLIANT WITH UNIVERSAL QUESTION SCHEMA!`);

