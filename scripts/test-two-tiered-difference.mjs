import fs from 'fs';
import ts from 'typescript';
import assert from 'assert';
import { advancedLogic } from '../src/lib/syllabus/math/primary-4/whole-numbers-numbers-up-to-100000/number-comparison-and-ordering/advanced.js';

function requireJSX(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const transpiled = ts.transpileModule(code, {
    compilerOptions: { jsx: ts.JsxEmit.React, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  const mod = { exports: {} };
  const wrapper = new Function('require', 'exports', 'module', transpiled);
  const fakeRequire = (id) => {
    if (id === 'react') {
      const createElement = (type, props, ...children) => ({ type, props, children });
      return { createElement, default: { createElement }, useState: () => [null, () => {}], useEffect: () => {}, useRef: () => ({ current: null }) };
    }
    if (id === 'framer-motion') return { motion: { div: 'div', button: 'button' }, AnimatePresence: ({ children }) => children };
    if (id.includes('lucide-react')) return new Proxy({}, { get: () => 'Icon' });
    if (id.includes('InteractiveBarBuilder')) return mod.exports;
    return {};
  };
  wrapper(fakeRequire, mod.exports, mod);
  return mod.exports;
}

const ibb = requireJSX('src/components/math/InteractiveBarBuilder.jsx');
const { checkBarModelParameters, ModelSolutionBarModel } = ibb;

function dummyGetFormatInstructions(visualEngineStr, inputRequirementStr, variant) {
  return `FORMAT_INSTRUCTIONS:\n<<<VE_START>>>\n${visualEngineStr}\n<<<VE_END>>>\n<<<IR_START>>>\n${inputRequirementStr}\n<<<IR_END>>>\n`;
}

console.log("=== Testing advanced_two_tiered_difference ===");

const varieties = [
  'compare_a_and_c_both_more',
  'compare_a_and_c_more_and_less',
  'combined_excess_over_twice_base'
];

for (const variety of varieties) {
  console.log(`\n--- Testing variety: ${variety} (Structure) ---`);

  const res = advancedLogic(
    'advanced_two_tiered_difference',
    'advanced',
    'structure',
    false, // isMCQ
    false, // isShort
    true,  // isStructure
    'STRUCTURED',
    'ADVANCED',
    'Primary 4',
    'Number Comparison and Ordering',
    dummyGetFormatInstructions,
    variety // explicitVariety
  );

  assert(res && res.aiPrompt, "aiPrompt must exist");

  const veMatch = res.aiPrompt.match(/<<<VE_START>>>\n([\s\S]*?)\n<<<VE_END>>>/);
  const irMatch = res.aiPrompt.match(/<<<IR_START>>>\n([\s\S]*?)\n<<<IR_END>>>/);

  assert(veMatch && veMatch[1], "visualEngine must be present");
  assert(irMatch && irMatch[1], "inputRequirement must be present");

  const ve = JSON.parse(veMatch[1]);
  const ir = JSON.parse(irMatch[1]);

  console.log("✓ JSON format instructions extracted cleanly");

  // Check 1: Golden Law (Drawing Precedes Solving)
  assert.strictEqual(ve.hideVisual, true, "Structured question must hide visual in prompt");
  assert.strictEqual(ve.componentToRender, "NONE", "Structured question componentToRender must be NONE");
  assert.strictEqual(ir.inputType, "INTERACTIVE_BAR_BUILDER", "inputType must be INTERACTIVE_BAR_BUILDER");

  const config = ir.barBuilderConfig;
  assert(config, "barBuilderConfig must exist");
  assert.strictEqual(config.problemType, "TWO_TIERED_DIFFERENCE", "problemType must be TWO_TIERED_DIFFERENCE");
  assert.strictEqual(config.targetVariety, variety, "targetVariety must match explicit variety");
  assert.strictEqual(config.correctModelType, "COMPARISON", "correctModelType must be COMPARISON");

  // Check 2: Full Palette of 3 Archetypes (Zero Pruning)
  assert.strictEqual(config.modelOptions.length, 3, "Must offer all 3 archetypes");
  const modelIds = config.modelOptions.map(m => m.id);
  assert(modelIds.includes("COMPARISON"), "Must include COMPARISON archetype");
  assert(modelIds.includes("PART_WHOLE"), "Must include PART_WHOLE archetype");
  assert(modelIds.includes("BEFORE_AFTER"), "Must include BEFORE_AFTER archetype");
  console.log("✓ Full 3-archetype palette provided with zero pruning");

  // Check 3: Entities Configuration
  assert.strictEqual(config.entities.length, 3, "Must have 3 entities (A, B, C)");
  const entA = config.entities.find(e => e.id === "A");
  const entB = config.entities.find(e => e.id === "B");
  const entC = config.entities.find(e => e.id === "C");

  assert(entA && entB && entC, "Must have entities A, B, and C");

  // Baseline B checks (Golden Law: unknown baseline initialized with ? / 1 unit)
  assert.strictEqual(entB.relation, "BASE", "Entity B must be BASE relation");
  assert.strictEqual(entB.value, "?", "Entity B value must be '?' (Golden Law: drawing precedes solving)");
  assert.strictEqual(entB.displayValue, "1 unit", "Entity B displayValue must be '1 unit'");

  // Entity A checks
  assert.strictEqual(entA.relation, "MORE", "Entity A must have MORE relation");
  assert(Number(entA.diffValue) > 0, "Entity A diffValue must be positive number");

  // Entity C checks depending on variety
  if (variety === 'compare_a_and_c_more_and_less') {
    assert.strictEqual(entC.relation, "FEWER", "Entity C must have FEWER relation for more_and_less variety");
    assert.strictEqual(entC.displayValue, "?", "Entity C displayValue must be '?'");
  } else {
    assert.strictEqual(entC.relation, "MORE", "Entity C must have MORE relation for both_more / excess varieties");
  }
  assert(Number(entC.diffValue) > 0, "Entity C diffValue must be positive number");
  console.log("✓ Entities configured correctly with Golden Law baseline representation");

  // Check 4: Ideal Blueprint Validation
  const idealBars = [
    {
      id: "bar-1",
      name: entA.name,
      length: 50,
      value: "",
      hasDifference: true,
      diffType: "MORE",
      diffLength: 20,
      diffValue: entA.diffValue.toLocaleString()
    },
    {
      id: "bar-2",
      name: entB.name,
      length: 50,
      value: "1 unit",
      hasDifference: false
    },
    {
      id: "bar-3",
      name: entC.name,
      length: 50,
      value: variety === 'compare_a_and_c_more_and_less' ? "?" : "",
      hasDifference: true,
      diffType: entC.relation === "FEWER" ? "FEWER" : "MORE",
      diffLength: 20,
      diffValue: entC.diffValue.toLocaleString()
    }
  ];

  const idealCheck = checkBarModelParameters(idealBars, config, {});
  assert.strictEqual(idealCheck.isValid, true, `Ideal blueprint must be valid: ${idealCheck.errorMsg}`);
  console.log("✓ Ideal comparative blueprint validates successfully");

  // Check 5: Permissive Unitary Baseline Matching
  const validBaseLabels = ["1 unit", "1u", "u", "1unit", "1 units", "?", ""];
  for (const label of validBaseLabels) {
    const testBars = JSON.parse(JSON.stringify(idealBars));
    testBars[1].value = label;
    const baseCheck = checkBarModelParameters(testBars, config, {});
    assert.strictEqual(baseCheck.isValid, true, `Baseline label "${label}" must be accepted`);
  }

  // Invalid baseline number
  const invalidBaseBars = JSON.parse(JSON.stringify(idealBars));
  invalidBaseBars[1].value = "99999";
  const invalidBaseCheck = checkBarModelParameters(invalidBaseBars, config, {});
  assert.strictEqual(invalidBaseCheck.isValid, false, "Arbitrary number on unknown baseline must be rejected");
  assert.strictEqual(invalidBaseCheck.defect, "INCORRECT_BASE_VALUE", "Must return INCORRECT_BASE_VALUE");
  console.log("✓ Permissive unitary baseline validation passes");

  // Check 6: Segmented Difference Support
  const segBars = JSON.parse(JSON.stringify(idealBars));
  const diffAVal = Number(entA.diffValue);
  const part1 = Math.floor(diffAVal / 2);
  const part2 = diffAVal - part1;
  segBars[0].diffSegments = [
    { id: "seg-1", value: part1.toLocaleString(), length: 10 },
    { id: "seg-2", value: part2.toLocaleString(), length: 10 }
  ];
  const segCheck = checkBarModelParameters(segBars, config, {});
  assert.strictEqual(segCheck.isValid, true, "Multi-segment difference must be accepted if sum matches");
  console.log("✓ Multi-segment difference supported");

  // Check 7: Misconception & Smart Diagnostic Tests
  // 7a. Inverted relation on C
  const invBars = JSON.parse(JSON.stringify(idealBars));
  invBars[2].diffType = entC.relation === "FEWER" ? "MORE" : "FEWER";
  const invCheck = checkBarModelParameters(invBars, config, {});
  assert.strictEqual(invCheck.isValid, false, "Inverted relation on C must fail");
  if (entC.relation === "FEWER") {
    assert.strictEqual(invCheck.defect, "INVERTED_RELATION_FEWER", "Must catch INVERTED_RELATION_FEWER");
  } else {
    assert.strictEqual(invCheck.defect, "INVERTED_RELATION_MORE", "Must catch INVERTED_RELATION_MORE");
  }

  // 7b. Smart Diagnostic: Target difference used on C's difference
  const targetDiffBars = JSON.parse(JSON.stringify(idealBars));
  targetDiffBars[2].diffValue = config.target.value;
  const targetDiffCheck = checkBarModelParameters(targetDiffBars, config, {});
  assert.strictEqual(targetDiffCheck.isValid, false, "Target diff used on C must fail");
  assert.strictEqual(targetDiffCheck.defect, "TARGET_DIFF_USED_ON_BASELINE_BAR", "Must diagnose TARGET_DIFF_USED_ON_BASELINE_BAR");
  console.log(`✓ Smart Diagnostic caught target diff used on baseline: "${targetDiffCheck.errorMsg}"`);

  // 7c. Base entity has difference attached
  const baseDiffBars = JSON.parse(JSON.stringify(idealBars));
  baseDiffBars[1].hasDifference = true;
  baseDiffBars[1].diffType = "MORE";
  baseDiffBars[1].diffValue = "5000";
  const baseDiffCheck = checkBarModelParameters(baseDiffBars, config, {});
  assert.strictEqual(baseDiffCheck.isValid, false, "Difference on baseline must fail");
  assert.strictEqual(baseDiffCheck.defect, "BASE_ENTITY_HAS_DIFF", "Must return BASE_ENTITY_HAS_DIFF");

  // 7d. Unexpected Combined Total
  const totalCheck = checkBarModelParameters(idealBars, config, { hasCombinedTotal: true, combinedTotalValue: "50000" });
  assert.strictEqual(totalCheck.isValid, false, "Combined total on pure difference comparison must fail");
  assert.strictEqual(totalCheck.defect, "UNEXPECTED_COMBINED_TOTAL", "Must return UNEXPECTED_COMBINED_TOTAL");
  console.log("✓ Misconceptions and diagnostics correctly caught");

  // Check 8: Auto-Fill Emulation
  const autoFilledBars = config.entities.map((e, idx) => {
    const rawDiff = e.displayDiff || e.diffValue || '';
    const cleanDiff = `${rawDiff}`.replace(/[+\-]/g, '').trim();
    const hasDiff = e.relation === 'MORE' || e.relation === 'FEWER';
    return {
      id: `bar-${idx + 1}`,
      name: e.name,
      length: e.relation === 'FEWER' ? 38 : 50,
      value: e.displayValue || '',
      hasDifference: hasDiff,
      diffType: e.relation === 'FEWER' ? 'FEWER' : 'MORE',
      diffLength: 20,
      diffValue: cleanDiff,
      diffSegments: hasDiff ? [{ id: `bar-${idx + 1}-seg-1`, value: cleanDiff, length: e.relation === 'FEWER' ? 16 : 20 }] : [],
      bracketPosition: 'bottom',
      isTarget: false,
      isCollapsed: true
    };
  });
  const autoFillCheck = checkBarModelParameters(autoFilledBars, config, { hasCombinedTotal: false });
  assert.strictEqual(autoFillCheck.isValid, true, `Auto-filled bars must validate cleanly: ${autoFillCheck.errorMsg}`);
  console.log("✓ Auto-fill emulation passes validation cleanly");

  // Check 9: ModelSolutionBarModel Rendering
  const renderedModel = ModelSolutionBarModel({ config, activeModel: 'COMPARISON' });
  assert(renderedModel, "ModelSolutionBarModel must return a valid React element");
  console.log("✓ ModelSolutionBarModel renders reference blueprint cleanly");

  // Check 10: Stage 3 Working Equations
  assert(Array.isArray(ir.steps), "ir.steps must be an array");
  assert.strictEqual(ir.steps.length, 2, "ir.steps must have 2 steps");
  assert(ir.steps[0].acceptedAnswers.length >= 6, "Step 1 must have multiple accepted formats");
  assert(ir.steps[1].acceptedAnswers.includes(res.inputRequirement.steps[1].expectedAnswer), "Step 2 must include expected answer");
  console.log("✓ Stage 3 working equations and accepted answers verified");
}

console.log("\n=======================================================");
console.log("🎉 ALL TESTS PASSED FOR advanced_two_tiered_difference!");
console.log("=======================================================");

