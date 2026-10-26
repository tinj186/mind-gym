import { p4NumberPatternsBlueprint } from '../src/lib/syllabus/math/primary-4/whole-numbers-numbers-up-to-100000/number-patterns.js';

console.log('Testing Primary 4 Number Patterns Blueprint...');

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
assert(p4NumberPatternsBlueprint.variants.foundation_count_on_back !== undefined, 'foundation_count_on_back variant exists in variants');
assert(p4NumberPatternsBlueprint.variants.foundation_add_10 === undefined, 'foundation_add_10 removed from direct variants list');
assert(Array.isArray(p4NumberPatternsBlueprint.variantVarieties.foundation_count_on_back), 'variantVarieties has foundation_count_on_back');
assert(p4NumberPatternsBlueprint.variantVarieties.foundation_count_on_back.length === 8, '8 varieties configured');

const varieties = [
  'add_10',
  'subtract_10',
  'add_100',
  'subtract_100',
  'add_1000',
  'subtract_1000',
  'add_10000',
  'subtract_10000'
];

for (const v of varieties) {
  assert(p4NumberPatternsBlueprint.variantVarieties.foundation_count_on_back.includes(v), `Variety ${v} is present`);
}

// 2. Test each variety directly using options, string syntax, and object syntax
for (const variety of varieties) {
  // Test via options
  const resOptions = p4NumberPatternsBlueprint.generate('foundation', 'foundation_count_on_back', 'mcq', { variety });
  assert(resOptions && typeof resOptions.aiPrompt === 'string', `Generated via options for variety ${variety}`);
  assert(resOptions.aiPrompt.includes('NUMBER_PATTERN'), `Visual engine NUMBER_PATTERN included for variety ${variety}`);
  assert(resOptions.aiPrompt.includes('"variant": "foundation_count_on_back"'), `Variant meta is foundation_count_on_back for ${variety}`);

  // Test via string 'variant:variety'
  const resColon = p4NumberPatternsBlueprint.generate('foundation', `foundation_count_on_back:${variety}`, 'mcq');
  assert(resColon && typeof resColon.aiPrompt === 'string', `Generated via 'variant:variety' for ${variety}`);

  // Test via object { variant, variety }
  const resObj = p4NumberPatternsBlueprint.generate('foundation', { variant: 'foundation_count_on_back', variety }, 'short question');
  assert(resObj && typeof resObj.aiPrompt === 'string', `Generated via object for ${variety}`);
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

// 4. Test math correctness and MCQ rules over multiple iterations
for (let i = 0; i < 50; i++) {
  const res = p4NumberPatternsBlueprint.generate('foundation', 'foundation_count_on_back', 'mcq');
  const prompt = res.aiPrompt;

  // Extract finalAnswer
  const finalAnswerMatch = prompt.match(/The finalAnswer must be strictly "([^"]+)"/);
  assert(finalAnswerMatch !== null, 'Found finalAnswer in prompt');
  const finalAnswer = finalAnswerMatch ? finalAnswerMatch[1] : '';

  // Extract options
  const optionsMatch = prompt.match(/Generate EXACTLY 4 options: (\[[^\]]+\])/);
  assert(optionsMatch !== null, 'Found options in prompt');
  if (optionsMatch) {
    const opts = JSON.parse(optionsMatch[1]);
    assert(opts.length === 4, `Options has exactly 4 items (got ${opts.length})`);
    assert(new Set(opts).size === 4, `All 4 options are distinct: ${JSON.stringify(opts)}`);
    assert(opts.includes(finalAnswer), `Options contains finalAnswer (${finalAnswer})`);
  }

  // Extract defectMap
  const defectMatch = prompt.match(/Set defectMap to: (\{[^\}]+\})/);
  assert(defectMatch !== null, 'Found defectMap in prompt');
  if (defectMatch) {
    const dMap = JSON.parse(defectMatch[1]);
    assert(dMap[finalAnswer] === undefined, `finalAnswer is NOT in defectMap`);
    assert(Object.keys(dMap).length >= 1, `defectMap has at least one distractor mapped`);
  }

  // Extract visualEngine items
  const visualMatch = prompt.match(/"items":\s*(\[[^\]]+\])/);
  assert(visualMatch !== null, 'Found items in visualEngine');
  if (visualMatch) {
    const items = JSON.parse(visualMatch[1]);
    assert(items.length === 5, 'Number pattern has 5 items');
    assert(items.filter(x => x === '?').length === 1, 'Exactly one missing item (?)');
  }
}

// 5. Test Standard and Advanced
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
