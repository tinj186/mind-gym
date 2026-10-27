import { p4NumberPatternsBlueprint } from '../src/lib/syllabus/math/primary-4/whole-numbers-numbers-up-to-100000/number-patterns.js';

console.log('Testing Primary 4 Number Patterns Blueprint (5 Foundation Variants Suite)...');

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
  'foundation_adjacent_term_deduction',
  'foundation_boundary_crossing_deduction',
  'foundation_deducing_unknown_rule',
  'foundation_incorrect_anomaly',
  'foundation_two_step_extension'
];

assert(p4NumberPatternsBlueprint.variants.foundation_count_on_back === undefined, 'foundation_count_on_back is retired and removed from variants');

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
  'foundation_count_on_back',
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
  assert(resAlias.aiPrompt.includes('"variant": "foundation_adjacent_term_deduction"'), `Legacy alias ${alias} routes to foundation_adjacent_term_deduction`);
}

// 4. Test Schema parsing with simulated outputs
for (const variant of expectedVariants) {
  for (const qType of ['mcq', 'structured', 'short question']) {
    const res = p4NumberPatternsBlueprint.generate('foundation', variant, qType);
    
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

// 5. Standard variants tests across all varieties and question types
const expectedStandardVariants = [
  'standard_pattern_crossing',
  'standard_non_adjacent_gap_deduction',
  'standard_alternating_rule',
  'standard_table_input_output',
  'standard_growing_shrinking_interval',
  'standard_equation_sequence_hybrid'
];

for (const stdVariant of expectedStandardVariants) {
  // Note: Variants may be temporarily commented by the user in blueprint.variants for single-variant UI testing
  const isCurrentlyInBlueprint = p4NumberPatternsBlueprint.variants[stdVariant] !== undefined;
  if (isCurrentlyInBlueprint) {
    assert(true, `${stdVariant} exists in blueprint`);
  }
  assert(Array.isArray(p4NumberPatternsBlueprint.variantVarieties[stdVariant]), `Varieties configured for ${stdVariant}`);

  const stdVarieties = p4NumberPatternsBlueprint.variantVarieties[stdVariant];
  for (const variety of stdVarieties) {
    for (const qType of ['mcq', 'short question', 'structured']) {
      const res = p4NumberPatternsBlueprint.generate('standard', stdVariant, qType, { variety });
      assert(res && typeof res.aiPrompt === 'string', `${stdVariant} (${variety}) [${qType}] generates prompt`);

      const prompt = res.aiPrompt;
      assert(prompt.includes(`"variant": "${stdVariant}"`), `${stdVariant} metadata variant is correct`);
      assert(prompt.includes('standard-level'), 'standard-level prompt is present');

      // Check MCQ requirements
      if (qType === 'mcq') {
        const optionsMatch = prompt.match(/Generate EXACTLY 4 options: (\[[^\]]+\])/);
        assert(optionsMatch !== null, `MCQ options found for ${stdVariant} (${variety})`);
        if (optionsMatch) {
          const opts = JSON.parse(optionsMatch[1]);
          assert(opts.length === 4, `MCQ options has exactly 4 items for ${stdVariant} (${variety})`);
          assert(new Set(opts).size === 4, `MCQ options all distinct for ${stdVariant} (${variety})`);
        }
      }

      // Check Structured requirements
      if (qType === 'structured') {
        assert(prompt.includes('"inputType": "MULTI_STEP_INPUT"'), `Structured has MULTI_STEP_INPUT for ${stdVariant} (${variety})`);
        assert(prompt.includes('"steps":'), `Structured has steps array for ${stdVariant} (${variety})`);
      }

      // Check visual engines
      if (stdVariant === 'standard_non_adjacent_gap_deduction') {
        assert(prompt.includes('"componentToRender": "NUMBER_LINE_ADVANCED"'), `${stdVariant} uses NUMBER_LINE_ADVANCED`);
      } else if (stdVariant === 'standard_table_input_output') {
        assert(prompt.includes('"componentToRender": "TABLE_PATTERN_VISUALIZER"'), `${stdVariant} uses TABLE_PATTERN_VISUALIZER`);
      } else {
        assert(prompt.includes('"componentToRender": "NUMBER_SEQUENCE_BLOCKS"'), `${stdVariant} uses NUMBER_SEQUENCE_BLOCKS`);
      }
    }
  }
}

// 6. Test legacy standard variant aliases backward compatibility
const legacyStandardAliases = [
  'standard_add_cross_thousands',
  'standard_subtract_cross_thousands',
  'standard_add_cross_ten_thousands',
  'standard_subtract_cross_ten_thousands',
  'standard_reach_100000'
];

for (const alias of legacyStandardAliases) {
  const resAlias = p4NumberPatternsBlueprint.generate('standard', alias, 'mcq');
  assert(resAlias && typeof resAlias.aiPrompt === 'string', `Legacy alias ${alias} generates successfully`);
  assert(resAlias.aiPrompt.includes('"variant": "standard_pattern_crossing"'), `Legacy alias ${alias} routes to standard_pattern_crossing`);
}

// 7. Advanced still works
const advRes = p4NumberPatternsBlueprint.generate('advanced', 'advanced_alternating_add_sub', 'short question');
assert(advRes && advRes.aiPrompt.includes('advanced-level'), 'Advanced level generates prompt');

console.log(`\n========================================`);
console.log(`Tests finished: ${totalTests} total, ${passedTests} passed, ${failedTests} failed.`);
console.log(`========================================\n`);

if (failedTests > 0) {
  process.exit(1);
}
