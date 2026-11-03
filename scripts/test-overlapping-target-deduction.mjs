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
const { checkPartWholeParameters, checkBarModelParameters, ModelSolutionBarModel } = ibb;

function dummyGetFormatInstructions(visualEngineStr, inputRequirementStr, variant) {
  return `FORMAT_INSTRUCTIONS:\n<<<VE_START>>>\n${visualEngineStr}\n<<<VE_END>>>\n<<<IR_START>>>\n${inputRequirementStr}\n<<<IR_END>>>\n`;
}

console.log("=== Testing advanced_overlapping_target_deduction ===");

const varieties = ['find_both_overlap', 'find_group_a_only', 'find_group_b_only'];

for (const variety of varieties) {
  console.log(`\n--- Testing variety: ${variety} (Structure) ---`);

  const res = advancedLogic(
    'advanced_overlapping_target_deduction',
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

  assert(veMatch, "VE JSON must be extracted");
  assert(irMatch, "IR JSON must be extracted");

  const veJson = JSON.parse(veMatch[1]);
  const irJson = JSON.parse(irMatch[1]);

  console.log("✓ VisualEngine (Structure):", veJson.componentToRender, "hideVisual:", veJson.hideVisual);
  assert.strictEqual(veJson.componentToRender, "NONE");
  assert.strictEqual(veJson.hideVisual, true);

  console.log("✓ InputRequirement inputType:", irJson.inputType);
  assert.strictEqual(irJson.inputType, "INTERACTIVE_BAR_BUILDER");

  const config = irJson.barBuilderConfig;
  console.log("✓ barBuilderConfig problemType:", config.problemType);
  assert.strictEqual(config.problemType, "OVERLAPPING_TARGET_DEDUCTION");
  assert.strictEqual(config.targetVariety, variety);

  console.log(`  Total: ${config.displayTotal}, Group A: ${config.displayGroupA}, Group B: ${config.displayGroupB}`);
  console.log(`  Overlap: ${config.displayOverlap}, A Only: ${config.displayGroupAOnly}, B Only: ${config.displayGroupBOnly}`);

  assert(config.totalValue > 0, "Total must be positive");
  assert(config.overlapValue > 0, "Overlap must be positive");
  assert(config.groupAOnlyValue > 0, "Group A only must be positive");
  assert(config.groupBOnlyValue > 0, "Group B only must be positive");
  assert.strictEqual(config.groupAOnlyValue + config.overlapValue, config.groupAValue, "A only + Overlap = Group A");
  assert.strictEqual(config.groupBOnlyValue + config.overlapValue, config.groupBValue, "B only + Overlap = Group B");
  assert.strictEqual(config.groupAOnlyValue + config.overlapValue + config.groupBOnlyValue, config.totalValue, "A only + Overlap + B only = Total");

  console.log("✓ Whole configuration:", config.whole.label, "=", config.whole.displayValue);
  assert(config.whole.value, "Whole value must exist");

  console.log("✓ Parts count:", config.parts.length);
  assert.strictEqual(config.parts.length, 3, "Expected exactly 3 parts (A only, Both, B only)");

  for (const part of config.parts) {
    console.log(`    Part: "${part.name}" (Value: "${part.displayValue}")`);
    assert(part.name, "Part must have a name");
  }

  const expectedSteps = variety === 'find_both_overlap' ? 3 : 4;
  console.log(`✓ Steps count: ${irJson.steps.length} (Expected: ${expectedSteps})`);
  assert.strictEqual(irJson.steps.length, expectedSteps);

  for (let i = 0; i < irJson.steps.length; i++) {
    const s = irJson.steps[i];
    console.log(`    Step ${i + 1}: ${s.label} => Expected: ${s.expectedAnswer}`);
    assert(s.acceptedAnswers && s.acceptedAnswers.length > 0, `Step ${i + 1} must have acceptedAnswers`);
  }

  // Test Parameter Checking with checkPartWholeParameters
  console.log("\n  Testing checkPartWholeParameters:");

  // Check 1: Ideal student parts from config
  const idealUserParts = config.parts.map(p => ({
    name: p.name,
    value: p.displayValue,
    isShortfall: false
  }));
  const chkIdeal = checkPartWholeParameters(idealUserParts, config.whole.displayValue, config);
  console.log("  Check 1 (Ideal Blueprint): isValid =", chkIdeal.isValid, "defect =", chkIdeal.defect);
  assert.strictEqual(chkIdeal.isValid, true);

  // Check 2: Student uses aliases (e.g. "Stage 1", "Both", "Stage 2")
  const aliasUserParts = [
    { name: config.groupAName, value: config.parts[0].displayValue, isShortfall: false },
    { name: "Both", value: config.parts[1].displayValue, isShortfall: false },
    { name: config.groupBName, value: config.parts[2].displayValue, isShortfall: false }
  ];
  const chkAlias = checkPartWholeParameters(aliasUserParts, config.whole.displayValue, config);
  console.log("  Check 2 (Alias Names): isValid =", chkAlias.isValid);
  assert.strictEqual(chkAlias.isValid, true);

  // Check 3: Student leaves intermediate parts with "?"
  const questionMarksParts = [
    { name: config.parts[0].name, value: "?", isShortfall: false },
    { name: config.parts[1].name, value: "?", isShortfall: false },
    { name: config.parts[2].name, value: "?", isShortfall: false }
  ];
  const chkQM = checkPartWholeParameters(questionMarksParts, config.whole.displayValue, config);
  console.log("  Check 3 (Target Unknowns marked with '?'): isValid =", chkQM.isValid);
  assert.strictEqual(chkQM.isValid, true);

  // Check 4: Missing whole value
  const chkMissingWhole = checkPartWholeParameters(idealUserParts, "", config);
  console.log("  Check 4 (Missing Whole): isValid =", chkMissingWhole.isValid, "defect =", chkMissingWhole.defect);
  assert.strictEqual(chkMissingWhole.isValid, false);
  assert.strictEqual(chkMissingWhole.defect, "MISSING_TARGET_VALUE");

  // Check 5: Incorrect whole value
  const chkWrongWhole = checkPartWholeParameters(idealUserParts, "999999", config);
  console.log("  Check 5 (Wrong Whole): isValid =", chkWrongWhole.isValid, "defect =", chkWrongWhole.defect);
  assert.strictEqual(chkWrongWhole.isValid, false);
  assert.strictEqual(chkWrongWhole.defect, "INCORRECT_TARGET_VALUE");

  // Check 6: Missing one part
  const chkMissingPart = checkPartWholeParameters([idealUserParts[0], idealUserParts[1]], config.whole.displayValue, config);
  console.log("  Check 6 (Insufficient Parts): isValid =", chkMissingPart.isValid, "defect =", chkMissingPart.defect);
  assert.strictEqual(chkMissingPart.isValid, false);
  assert.strictEqual(chkMissingPart.defect, "INSUFFICIENT_PARTS");

  // Test ModelSolutionBarModel
  console.log("\n  Testing ModelSolutionBarModel:");
  const renderedPartWhole = ModelSolutionBarModel({ config, activeModel: 'PART_WHOLE', title: 'Part-Whole Model' });
  assert(renderedPartWhole, "ModelSolutionBarModel for PART_WHOLE must render");
  console.log("  ✓ PART_WHOLE Model rendered successfully");

  const renderedComparison = ModelSolutionBarModel({ config, activeModel: 'COMPARISON', title: 'Comparison Model' });
  assert(renderedComparison, "ModelSolutionBarModel for COMPARISON must render");
  console.log("  ✓ COMPARISON Model rendered successfully");

  // Test MCQ Generation
  console.log(`\n--- Testing variety: ${variety} (MCQ) ---`);
  const resMCQ = advancedLogic(
    'advanced_overlapping_target_deduction',
    'advanced',
    'mcq',
    true,  // isMCQ
    false, // isShort
    false, // isStructure
    'MCQ',
    'ADVANCED',
    'Primary 4',
    'Number Comparison and Ordering',
    dummyGetFormatInstructions,
    variety
  );

  assert(resMCQ && resMCQ.aiPrompt, "MCQ aiPrompt must exist");
  assert(resMCQ.aiPrompt.includes("BAR_MODEL_COMPARISON"), "MCQ must specify BAR_MODEL_COMPARISON");
  console.log("  ✓ MCQ question generated successfully with visualEngine and distractors");
}

console.log("\n=============================================");
console.log(" ALL 3 OVERLAPPING SET VARIETIES PASSED ALL TESTS!");
console.log("=============================================");
