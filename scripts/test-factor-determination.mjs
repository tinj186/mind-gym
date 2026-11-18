import assert from 'assert';
import { p4FactorDeterminationBlueprint } from '../src/lib/syllabus/math/primary-4/whole-numbers-factors-and-multiples/factor-determination.js';
import { UniversalQuestionSchema } from '../src/app/api/admin/generate/questionSchema.js';

console.log("--- Testing Factor Determination Blueprint (All 15 Variants) ---");

const variantsByTier = {
  foundation: [
    'foundation_divisibility_proof',
    'foundation_perfect_grid',
    'foundation_missing_partner',
    'foundation_outlier_factor',
    'foundation_multiple_reversal_proof'
  ],
  standard: [
    'standard_valid_container_condition',
    'standard_add_subtract_adjustment',
    'standard_area_geometry_factors',
    'standard_dual_factor_condition',
    'standard_unknown_divisor_odd_quotient'
  ],
  advanced: [
    'advanced_shortfall_adjustment',
    'advanced_common_factor_elimination',
    'advanced_digit_clue_deduction',
    'advanced_shared_remainder',
    'advanced_max_min_multiplier_boundary',
    'advanced_factor_rainbow_cutting'
  ]
};

const types = ['mcq', 'short question', 'structured'];

let totalTested = 0;

const ITERATIONS = 5;

for (let iter = 1; iter <= ITERATIONS; iter++) {
  for (const [tier, variants] of Object.entries(variantsByTier)) {
    for (const variant of variants) {
      for (const qType of types) {
        totalTested++;
        const result = p4FactorDeterminationBlueprint.generate(tier, variant, qType);

        assert(result, `Blueprint returned null for ${tier}/${variant}/${qType}`);
        assert(result.aiPrompt, `aiPrompt missing for ${tier}/${variant}/${qType}`);
        assert(typeof result.aiPrompt === 'string', `aiPrompt is not a string for ${tier}/${variant}/${qType}`);

        // Extract JSON template from prompt to validate schema compliance
        const formatIdx = result.aiPrompt.indexOf('OUTPUT FORMAT');
        const jsonStart = result.aiPrompt.indexOf('{', formatIdx !== -1 ? formatIdx : 0);
        const jsonEnd = result.aiPrompt.lastIndexOf('}');
        assert(jsonStart !== -1 && jsonEnd !== -1, `JSON template not found in aiPrompt for ${variant}`);
        
        const jsonStr = result.aiPrompt.substring(jsonStart, jsonEnd + 1);
        let parsed;
        try {
          parsed = JSON.parse(jsonStr);
        } catch (err) {
          throw new Error(`Failed to parse prompt JSON schema for ${variant}: ${err.message}\nString was:\n${jsonStr}`);
        }

        // Check Zod schema compliance
        const zodValidation = UniversalQuestionSchema.safeParse(parsed);
        if (!zodValidation.success) {
          console.error(`❌ Zod validation error for ${variant} (${qType}):`, zodValidation.error.format());
          throw new Error(`UniversalQuestionSchema validation failed for ${variant} (${qType})`);
        }

        // Check stepResult visualEngine and inputRequirement
        if (result.visualEngine) {
          assert(typeof result.visualEngine === 'object', `visualEngine must be object`);
          assert(result.visualEngine.componentToRender, `componentToRender must exist`);
        }

        if (qType === 'structured') {
          assert(result.inputRequirement, `inputRequirement must exist for structured questions in ${variant}`);
          assert.strictEqual(result.inputRequirement.inputType, 'MULTI_STEP_INPUT');
          assert(Array.isArray(result.inputRequirement.steps), `steps array required for ${variant}`);
          assert(result.inputRequirement.steps.length >= 2, `at least 2 steps required for ${variant}`);
        }
      }
    }
  }
}

for (const [tier, variants] of Object.entries(variantsByTier)) {
  for (const variant of variants) {
    console.log(`✅ Passed: [${tier}] ${variant} (${ITERATIONS} iterations across MCQ, Short Question, and Structured)`);
  }
}

console.log(`\n🎉 ALL ${totalTested} CONFIGURATIONS PASSED VALIDATION!`);
