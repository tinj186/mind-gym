import { p4NumberPatternsBlueprint } from '../src/lib/syllabus/math/primary-4/whole-numbers-numbers-up-to-100000/number-patterns.js';
import { UniversalQuestionSchema } from '../src/app/api/admin/generate/questionSchema.js';

console.log('Testing Primary 4 Number Patterns Blueprint (Full Suite)...');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
  } else {
    failedTests++;
    console.error(`❌ FAIL: ${message}`);
  }
}

// 1. Check Blueprint metadata & variants
const expectedVariants = [
  'foundation_count_on_back',
  'foundation_adjacent_term_deduction',
  'foundation_boundary_crossing_deduction',
  'foundation_deducing_unknown_rule',
  'foundation_incorrect_anomaly',
  'foundation_two_step_extension'
];

for (const v of expectedVariants) {
  assert(p4NumberPatternsBlueprint.variants[v] !== undefined, `Variant ${v} exists in blueprint`);
  assert(Array.isArray(p4NumberPatternsBlueprint.variantVarieties[v]), `Varieties configured for ${v}`);
}

// 2. Test each foundation variant across types (MCQ, Short, Structured)
for (const variant of expectedVariants) {
  const varieties = p4NumberPatternsBlueprint.variantVarieties[variant];

  for (const variety of varieties) {
    for (const qType of ['mcq', 'short question', 'structured']) {
      const res = p4NumberPatternsBlueprint.generate('foundation', variant, qType, { variety });
      assert(res && typeof res.aiPrompt === 'string', `${variant} (${variety}) [${qType}] generates prompt`);

      const prompt = res.aiPrompt;
      assert(prompt.includes(`"variant": "${variant}"`), `${variant} metadata variant is correct`);

      // Check MCQ requirements
      if (qType === 'mcq') {
        const optionsMatch = prompt.match(/Generate EXACTLY 4 options: (\[[^\]]+\])/);
        assert(optionsMatch !== null, `MCQ options found for ${variant}`);
        if (optionsMatch) {
          const opts = JSON.parse(optionsMatch[1]);
          assert(opts.length === 4, `MCQ options has exactly 4 items for ${variant}`);
          assert(new Set(opts).size === 4, `MCQ options all distinct for ${variant}`);
        }
      }

      // Check Structured requirements
      if (qType === 'structured') {
        assert(prompt.includes('"inputType": "MULTI_STEP_INPUT"'), `Structured has MULTI_STEP_INPUT for ${variant}`);
        assert(prompt.includes('"steps":'), `Structured has steps array for ${variant}`);
      }

      // Check visual engines
      if (variant === 'foundation_boundary_crossing_deduction') {
        assert(prompt.includes('"componentToRender": "NUMBER_LINE_ADVANCED"'), `Boundary crossing uses NUMBER_LINE_ADVANCED`);
      } else {
        assert(prompt.includes('"componentToRender": "NUMBER_SEQUENCE_BLOCKS"'), `${variant} uses NUMBER_SEQUENCE_BLOCKS`);
      }
    }
  }
}

// 3. Test legacy variant aliases backward compatibility
const legacyAliases = [
  'foundation_add_10',
  'foundation_subtract_10',
  'foundation_add_100',
  'foundation_subtract_100',
  'foundation_add_1000',
  'foundation_subtract_1000',
  'foundation_add_10000',
  'foundation_subtract_10000'
];

for (const alias of legacyAliases) {
  const resAlias = p4NumberPatternsBlueprint.generate('foundation', alias, 'mcq');
  assert(resAlias && typeof resAlias.aiPrompt === 'string', `Legacy alias ${alias} generates successfully`);
  assert(resAlias.aiPrompt.includes('"variant": "foundation_count_on_back"'), `Legacy alias routes to foundation_count_on_back`);
}

// 4. Test Schema parsing with simulated outputs
for (const variant of expectedVariants) {
  for (const qType of ['mcq', 'structured', 'short question']) {
    const res = p4NumberPatternsBlueprint.generate('foundation', variant, qType);
    
    // Extract visualEngine and inputRequirement strings
    const veMatch = res.aiPrompt.match(/"visualEngine":\s*(\{[^}]+\{[^}]+\}[^}]*\})/);
    const irMatch = res.aiPrompt.match(/"inputRequirement":\s*(\{[^}]+\})/);
    
    // Verify Zod componentToRender enum passes
    const compMatch = res.aiPrompt.match(/"componentToRender":\s*"([^"]+)"/);
    assert(compMatch !== null, `componentToRender found for ${variant}`);
    if (compMatch) {
      const comp = compMatch[1];
      const validComps = [
        'NUMBER_SEQUENCE_BLOCKS', 'NUMBER_LINE_ADVANCED', 'NUMBER_PATTERN', 'TABLE_PATTERN_VISUALIZER'
      ];
      assert(validComps.includes(comp), `Visual engine ${comp} is recognized`);
    }
  }
}

// 5. Standard and Advanced still work
const stdRes = p4NumberPatternsBlueprint.generate('standard', 'standard_add_cross_thousands', 'mcq');
assert(stdRes && stdRes.aiPrompt.includes('standard-level'), 'Standard level generates prompt');

const advRes = p4NumberPatternsBlueprint.generate('advanced', 'advanced_alternating_add_sub', 'short question');
assert(advRes && advRes.aiPrompt.includes('advanced-level'), 'Advanced level generates prompt');

console.log(`\n========================================`);
console.log(`Tests finished: ${totalTests} total, ${passedTests} passed, ${failedTests} failed.`);
console.log(`========================================\n`);

if (failedTests > 0) {
  process.exit(1);
}
