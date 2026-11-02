import fs from 'fs';
import ts from 'typescript';
import { advancedLogic } from '../src/lib/syllabus/math/primary-4/whole-numbers-numbers-up-to-100000/number-comparison-and-ordering/advanced.js';

function requireJSX(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const transpiled = ts.transpileModule(code, {
    compilerOptions: { jsx: ts.JsxEmit.React, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  const mod = { exports: {} };
  const wrapper = new Function('require', 'exports', 'module', transpiled);
  const fakeRequire = (id) => {
    if (id === 'react') return { useState: () => [null, () => {}], useEffect: () => {}, useRef: () => ({ current: null }) };
    if (id === 'framer-motion') return { motion: { div: 'div', button: 'button' }, AnimatePresence: ({ children }) => children };
    if (id.includes('lucide-react')) return new Proxy({}, { get: () => 'Icon' });
    if (id.includes('InteractiveBarBuilder')) return mod.exports;
    return {};
  };
  wrapper(fakeRequire, mod.exports, mod);
  return mod.exports;
}

const ibb = requireJSX('src/components/math/InteractiveBarBuilder.jsx');
const { checkBarModelParameters } = ibb;

function dummyGetFormatInstructions(visualEngineStr, inputRequirementStr, variant) {
  return `FORMAT_INSTRUCTIONS:\n<<<VE_START>>>\n${visualEngineStr}\n<<<VE_END>>>\n<<<IR_START>>>\n${inputRequirementStr}\n<<<IR_END>>>\n`;
}

console.log("=== Testing advanced_three_entity_grand_total for all varieties ===");

const varieties = [
  'find_smallest_base',
  'find_middle_entity',
  'find_largest_entity',
  'find_combined_entities',
  'find_difference_entities',
  'multiples_divide_four',
  'multiples_divide_five',
  'equal_units_divide_two'
];

let allPassed = true;

for (const variety of varieties) {
  console.log(`\n--- Testing variety: ${variety} (Structure) ---`);
  const result = advancedLogic(
    'advanced_three_entity_grand_total',
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
    variety
  );

  if (!result || !result.aiPrompt) {
    console.error(`FAILED: No aiPrompt generated for ${variety}`);
    allPassed = false;
    continue;
  }

  // Extract visualEngine and inputRequirement JSON using precise markers
  const veMatch = result.aiPrompt.match(/<<<VE_START>>>\n([\s\S]*?)\n<<<VE_END>>>/);
  const irMatch = result.aiPrompt.match(/<<<IR_START>>>\n([\s\S]*?)\n<<<IR_END>>>/);

  if (!veMatch || !irMatch) {
    console.error(`FAILED: Could not extract visualEngineStr or inputRequirementStr for ${variety}`);
    allPassed = false;
    continue;
  }

  const veObj = JSON.parse(veMatch[1]);
  const irObj = JSON.parse(irMatch[1]);

  if (veObj.componentToRender !== "NONE" || veObj.hideVisual !== true) {
    console.error(`FAILED: Structure question visualEngine should be hidden/blank, got componentToRender: ${veObj.componentToRender}`);
    allPassed = false;
  }

  if (irObj.inputType !== "INTERACTIVE_BAR_BUILDER") {
    console.error(`FAILED: inputType should be INTERACTIVE_BAR_BUILDER, got: ${irObj.inputType}`);
    allPassed = false;
  }

  const config = irObj.barBuilderConfig;
  if (!config || config.problemType !== "THREE_ENTITY_GRAND_TOTAL") {
    console.error(`FAILED: Invalid barBuilderConfig problemType: ${config?.problemType}`);
    allPassed = false;
  }

  if (!config.entities || config.entities.length !== 3) {
    console.error(`FAILED: Expected 3 entities, got: ${config?.entities?.length}`);
    allPassed = false;
  }

  if (!config.total || !config.total.value) {
    console.error(`FAILED: Expected total in config`);
    allPassed = false;
  }

  console.log(`✓ Config verified: Entities: [${config.entities.map(e => `${e.name} (${e.relation}${e.isMultiple ? ' x' + e.multipleFactor : ''})`).join(', ')}], Total: ${config.total.displayValue}`);
  console.log(`✓ Steps count: ${config.steps.length}`);
  config.steps.forEach((s, idx) => {
    console.log(`    Step ${idx + 1}: ${s.label} -> expected: ${s.expectedAnswer}`);
  });

  // Test checkBarModelParameters with idealized student model
  const idealizedBars = config.entities.map((e, idx) => {
    const isMultiple = e.relation === 'MULTIPLE' || e.isMultiple;
    const hasDiff = e.relation === 'MORE' || e.relation === 'FEWER';
    const cleanDiff = e.diffValue ? e.diffValue.replace(/[+\-]/g, '').trim() : '';

    return {
      id: `bar-${idx + 1}`,
      name: e.name,
      length: isMultiple ? 70 : (e.diffSegments && e.diffSegments.length > 1 ? 40 : 50),
      value: e.value === '?' ? '' : (e.value || ''),
      hasDifference: hasDiff,
      diffType: e.relation === 'FEWER' ? 'FEWER' : 'MORE',
      diffLength: 20,
      diffValue: e.diffSegments && e.diffSegments.length > 1 ? '' : cleanDiff,
      diffSegments: e.diffSegments ? e.diffSegments.map(s => ({ ...s, value: s.value })) : [{ id: 'seg-1', value: cleanDiff, length: 20 }]
    };
  });

  const totalState = {
    hasCombinedTotal: true,
    combinedTotalValue: config.total.value
  };

  const validationRes = checkBarModelParameters(idealizedBars, config, totalState);
  if (!validationRes.isValid) {
    console.error(`FAILED validation for ${variety}: ${validationRes.errorMsg} (defect: ${validationRes.defect})`);
    allPassed = false;
  } else {
    console.log(`✓ Idealized bar model validation passed for ${variety}`);
  }

  // Also test edge cases:
  // Edge Case A: Base entity with unexpected difference
  const invalidBarsWithDiffOnBase = idealizedBars.map((b, idx) => idx === 0 ? { ...b, hasDifference: true, diffType: 'MORE', diffValue: '100' } : b);
  const baseDiffRes = checkBarModelParameters(invalidBarsWithDiffOnBase, config, totalState);
  if (baseDiffRes.isValid) {
    console.error(`FAILED: Base entity with difference segment should be rejected!`);
    allPassed = false;
  } else {
    console.log(`✓ Base entity with diff correctly flagged: ${baseDiffRes.errorMsg}`);
  }

  // Edge Case B: Missing combined total bracket
  const missingTotalRes = checkBarModelParameters(idealizedBars, config, { hasCombinedTotal: false });
  if (missingTotalRes.isValid) {
    console.error(`FAILED: Missing combined total bracket should be rejected!`);
    allPassed = false;
  } else {
    console.log(`✓ Missing combined total correctly flagged: ${missingTotalRes.errorMsg}`);
  }

  // Also test non-structure (MCQ) to ensure visualEngine is BAR_MODEL_COMPARISON
  const mcqResult = advancedLogic(
    'advanced_three_entity_grand_total',
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
  const mcqVeMatch = mcqResult.aiPrompt.match(/<<<VE_START>>>\n([\s\S]*?)\n<<<VE_END>>>/);
  if (mcqVeMatch) {
    const mcqVeObj = JSON.parse(mcqVeMatch[1]);
    if (mcqVeObj.componentToRender !== "BAR_MODEL_COMPARISON") {
      console.error(`FAILED: MCQ visualEngine should be BAR_MODEL_COMPARISON, got: ${mcqVeObj.componentToRender}`);
      allPassed = false;
    } else {
      console.log(`✓ MCQ visualEngine correctly set to BAR_MODEL_COMPARISON with 3 bars`);
    }
  }
}

if (allPassed) {
  console.log("\n=============================================");
  console.log(" ALL 8 VARIETIES PASSED ALL TESTS AND CHECKS!");
  console.log("=============================================\n");
} else {
  console.error("\n SOME TESTS FAILED.");
  process.exit(1);
}
