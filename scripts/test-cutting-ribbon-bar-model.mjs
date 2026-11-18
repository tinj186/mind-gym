import assert from 'assert';
import { p3CompoundUnitConversionBlueprint } from '../src/lib/syllabus/math/primary-3/measurement-length-mass-and-volume/compound-unit-conversion.js';

console.log("Testing Primary 3 Compound Unit Conversion Blueprint (advanced_cutting_ribbon)...");

for (let i = 0; i < 20; i++) {
  const stepResult = p3CompoundUnitConversionBlueprint.generate('advanced', 'advanced_cutting_ribbon', 'Structured');
  
  assert(stepResult.aiPrompt, "aiPrompt must exist");
  assert(stepResult.visualEngine, "visualEngine must exist on stepResult");
  assert(stepResult.inputRequirement, "inputRequirement must exist on stepResult");
  assert(Array.isArray(stepResult.acceptedAnswers), "acceptedAnswers must be an array");

  const ve = stepResult.visualEngine;
  assert.strictEqual(ve.componentToRender, "BAR_MODEL");
  assert.strictEqual(ve.componentData.type, "PART_WHOLE");
  
  // Verify whole does NOT have parentheses or dual unit leak
  const whole = ve.componentData.whole;
  assert(!whole.includes('('), `whole should NOT contain parentheses: got "${whole}"`);
  assert(!whole.includes(')'), `whole should NOT contain parentheses: got "${whole}"`);
  assert(/^[1-9]\d*\s*(km|kg|ℓ)$/.test(whole), `whole should be single unit e.g. "4 km": got "${whole}"`);

  // Verify parts values are given in stem units (small unit) and ? for unknown
  const parts = ve.componentData.parts;
  assert.strictEqual(parts.length, 3);
  assert(/^[1-9]\d*\s*(m|g|ml)$/.test(parts[0].value), `part 0 should be stem small unit: got "${parts[0].value}"`);
  assert(/^[1-9]\d*\s*(m|g|ml)$/.test(parts[1].value), `part 1 should be stem small unit: got "${parts[1].value}"`);
  assert.strictEqual(parts[2].value, "?", `part 2 must be '?'`);

  // Verify aiPrompt contains anti-leak instruction
  assert(stepResult.aiPrompt.includes("Under NO circumstances should 'visualEngine.componentData.whole' or any bar model labels contain parenthetical unit conversions"), "Prompt must include anti-leak instruction");
}

console.log("✅ All 20 iterations of advanced_cutting_ribbon passed!");

// Test other advanced variants
const advancedVariants = [
  'advanced_three_part_total',
  'advanced_threshold_check',
  'advanced_two_step_comparison',
  'advanced_hidden_base'
];

for (const variant of advancedVariants) {
  const res = p3CompoundUnitConversionBlueprint.generate('advanced', variant, 'Structured');
  assert(res.aiPrompt, `Variant ${variant} missing aiPrompt`);
  assert(res.visualEngine, `Variant ${variant} missing visualEngine`);
  if (res.visualEngine.componentData?.whole) {
    const whole = res.visualEngine.componentData.whole;
    assert(!whole.includes('('), `${variant}: whole should NOT contain '(': got "${whole}"`);
  }
}

console.log("✅ All advanced variants passed!");

// Test standard variants
const standardVariants = [
  'standard_convert_to_compare',
  'standard_add_and_convert',
  'standard_subtract_from_compound',
  'standard_missing_part',
  'standard_reaching_target'
];

for (const variant of standardVariants) {
  const res = p3CompoundUnitConversionBlueprint.generate('standard', variant, 'Structured');
  assert(res.aiPrompt, `Variant ${variant} missing aiPrompt`);
  assert(res.visualEngine, `Variant ${variant} missing visualEngine`);
  if (res.visualEngine.componentData?.whole) {
    const whole = res.visualEngine.componentData.whole;
    assert(!whole.includes('('), `${variant}: whole should NOT contain '(': got "${whole}"`);
  }
}

console.log("✅ All standard variants passed!");

// Test defensive cleanDisplayValue in BarModelRenderer
function cleanDisplayValue(val) {
  if (typeof val !== 'string') return val;
  return val.replace(/\s*\(\s*\d+\s*(?:km|m|cm|mm|kg|g|l|ℓ|ml|min|s|h|hr|hours|mins|secs)\s*\)/gi, '').trim();
}

assert.strictEqual(cleanDisplayValue("4 km (4000 m)"), "4 km");
assert.strictEqual(cleanDisplayValue("1 kg (1000 g)"), "1 kg");
assert.strictEqual(cleanDisplayValue("1 ℓ (1000 ml)"), "1 ℓ");
assert.strictEqual(cleanDisplayValue("4 KM (4000 M)"), "4 KM");
assert.strictEqual(cleanDisplayValue("TOTAL: 4 km (4000 m)"), "TOTAL: 4 km");
assert.strictEqual(cleanDisplayValue("1300 m"), "1300 m");
assert.strictEqual(cleanDisplayValue("?"), "?");
assert.strictEqual(cleanDisplayValue(4000), 4000);

console.log("✅ Defensive cleanDisplayValue tests passed!");

