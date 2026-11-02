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
const { checkBarModelParameters, checkBeforeAfterParameters, ModelSolutionBarModel } = ibb;

function dummyGetFormatInstructions(visualEngineStr, inputRequirementStr, variant) {
  return `FORMAT_INSTRUCTIONS:\n<<<VE_START>>>\n${visualEngineStr}\n<<<VE_END>>>\n<<<IR_START>>>\n${inputRequirementStr}\n<<<IR_END>>>\n`;
}

console.log("=== Testing advanced_shifting_difference_transfer ===");

let allPassed = true;

// 1. Test Structure Question Generation
console.log("\n1. Testing Structure Question generation:");
const resStruct = advancedLogic(
  'advanced_shifting_difference_transfer',
  'advanced',
  'structure',
  false, // isMCQ
  false, // isShort
  true,  // isStructure
  'STRUCTURED',
  'ADVANCED',
  'Primary 4',
  'Number Comparison and Ordering',
  dummyGetFormatInstructions
);

if (!resStruct || !resStruct.aiPrompt) {
  console.error("FAIL: No aiPrompt generated for structure question");
  process.exit(1);
}

const veMatch = resStruct.aiPrompt.match(/<<<VE_START>>>\n([\s\S]*?)\n<<<VE_END>>>/);
const irMatch = resStruct.aiPrompt.match(/<<<IR_START>>>\n([\s\S]*?)\n<<<IR_END>>>/);

if (!veMatch || !irMatch) {
  console.error("FAIL: Could not extract VE or IR JSON from prompt");
  process.exit(1);
}

const veJson = JSON.parse(veMatch[1]);
const irJson = JSON.parse(irMatch[1]);

console.log("VisualEngine (Structure):", veJson.componentToRender, "hideVisual:", veJson.hideVisual);
if (veJson.componentToRender !== "NONE" || !veJson.hideVisual) {
  console.error("FAIL: visualEngine for structure should be NONE with hideVisual: true");
  allPassed = false;
}

console.log("InputRequirement inputType:", irJson.inputType);
if (irJson.inputType !== "INTERACTIVE_BAR_BUILDER") {
  console.error("FAIL: inputType should be INTERACTIVE_BAR_BUILDER");
  allPassed = false;
}

const config = irJson.barBuilderConfig;
console.log("barBuilderConfig problemType:", config.problemType);
console.log("transferFrom:", config.transferFrom, "transferTo:", config.transferTo);
console.log("initialA:", config.initialA, "initialB:", config.initialB, "z:", config.transferAmount);
console.log("newA:", config.newA, "newB:", config.newB, "newDiff:", config.newDiff);

if (config.problemType !== "SHIFTING_DIFFERENCE_TRANSFER") {
  console.error("FAIL: problemType must be SHIFTING_DIFFERENCE_TRANSFER");
  allPassed = false;
}
if (!config.newA || !config.newB || !config.newDiff) {
  console.error("FAIL: missing calculated shifting values");
  allPassed = false;
}
if (config.newB <= config.newA) {
  console.error("FAIL: newB should be greater than newA after flipping inequality");
  allPassed = false;
}

console.log("Calculation steps count:", irJson.steps.length);
if (irJson.steps.length !== 4) {
  console.error("FAIL: Expected exactly 4 steps for P4 shifting difference");
  allPassed = false;
}

for (let i = 0; i < irJson.steps.length; i++) {
  const step = irJson.steps[i];
  console.log(`Step ${i + 1}: ${step.label} => Expected: ${step.expectedAnswer}`);
  if (!step.acceptedAnswers || step.acceptedAnswers.length === 0) {
    console.error(`FAIL: Step ${i + 1} has no acceptedAnswers`);
    allPassed = false;
  }
}

// 2. Test MCQ Generation
console.log("\n2. Testing MCQ question generation:");
const resMCQ = advancedLogic(
  'advanced_shifting_difference_transfer',
  'advanced',
  'mcq',
  true,  // isMCQ
  false, // isShort
  false, // isStructure
  'MCQ',
  'ADVANCED',
  'Primary 4',
  'Number Comparison and Ordering',
  dummyGetFormatInstructions
);

const veMcqMatch = resMCQ.aiPrompt.match(/<<<VE_START>>>\n([\s\S]*?)\n<<<VE_END>>>/);
const veMcq = JSON.parse(veMcqMatch[1]);
console.log("VisualEngine (MCQ):", veMcq.componentToRender);
if (veMcq.componentToRender !== "BAR_MODEL_COMPARISON") {
  console.error("FAIL: MCQ visualEngine should be BAR_MODEL_COMPARISON");
  allPassed = false;
}

// 3. Test checkBeforeAfterParameters for SHIFTING_DIFFERENCE_TRANSFER
console.log("\n3. Testing checkBeforeAfterParameters:");

const nameA = config.transferFrom;
const nameB = config.transferTo;
const initA = config.initialA;
const initB = config.initialB;
const initDiff = config.initialDiff;
const newA = config.newA;
const newB = config.newB;
const newDiff = config.newDiff;

// Test 3a: Ideal Before and After state
const validBefore = [
  {
    name: nameA,
    value: initB.toString(),
    length: 65,
    hasDifference: true,
    diffType: 'MORE',
    diffValue: initDiff.toString(),
    diffSegments: [{ value: initDiff.toString() }]
  },
  {
    name: nameB,
    value: initB.toString(),
    length: 42,
    hasDifference: false,
    diffType: 'MORE',
    diffValue: ''
  }
];

const validAfter = [
  {
    name: nameA,
    value: newA.toString(),
    length: 42,
    hasDifference: false
  },
  {
    name: nameB,
    value: newA.toString(),
    length: 68,
    hasDifference: true,
    diffType: 'MORE',
    diffValue: '?'
  }
];

const check1 = checkBeforeAfterParameters(validBefore, validAfter, {}, config);
console.log("Check 1 (Ideal Student Blueprint): isValid =", check1.isValid, "defect =", check1.defect);
if (!check1.isValid) {
  console.error("FAIL: Ideal blueprint should be valid! Error:", check1.errorMsg);
  allPassed = false;
}

// Test 3b: Student provides numerical difference in After state
const validAfterWithNumber = [
  {
    name: nameA,
    value: newA.toString(),
    length: 42,
    hasDifference: false
  },
  {
    name: nameB,
    value: newA.toString(),
    length: 68,
    hasDifference: true,
    diffType: 'MORE',
    diffValue: newDiff.toString()
  }
];

const check2 = checkBeforeAfterParameters(validBefore, validAfterWithNumber, {}, config);
console.log("Check 2 (After state with exact new difference): isValid =", check2.isValid);
if (!check2.isValid) {
  console.error("FAIL: After state with exact new difference should be valid! Error:", check2.errorMsg);
  allPassed = false;
}

// Test 3c: Student Before state without difference segment (just direct initial values)
const validBeforeDirectValues = [
  {
    name: nameA,
    value: initA.toString(),
    length: 65,
    hasDifference: false
  },
  {
    name: nameB,
    value: initB.toString(),
    length: 42,
    hasDifference: false
  }
];
const check3 = checkBeforeAfterParameters(validBeforeDirectValues, validAfter, {}, config);
console.log("Check 3 (Before state with direct amounts, no diff segment): isValid =", check3.isValid);
if (!check3.isValid) {
  console.error("FAIL: Direct amounts in Before state should be valid! Error:", check3.errorMsg);
  allPassed = false;
}

// Test 3d: Giver is marked as having MORE in After state (wrong winner defect)
const invalidAfterWrongWinner = [
  {
    name: nameA,
    value: newA.toString(),
    length: 65,
    hasDifference: true,
    diffType: 'MORE',
    diffValue: '?'
  },
  {
    name: nameB,
    value: newA.toString(),
    length: 42,
    hasDifference: false
  }
];
const check4 = checkBeforeAfterParameters(validBefore, invalidAfterWrongWinner, {}, config);
console.log("Check 4 (Giver marked with MORE in After state): isValid =", check4.isValid, "defect =", check4.defect);
if (check4.isValid || check4.defect !== 'AFTER_STATE_WRONG_WINNER') {
  console.error("FAIL: Should detect AFTER_STATE_WRONG_WINNER defect!");
  allPassed = false;
}

// Test 3e: Wrong difference value in After state
const invalidAfterWrongDiff = [
  {
    name: nameA,
    value: newA.toString(),
    length: 42,
    hasDifference: false
  },
  {
    name: nameB,
    value: newA.toString(),
    length: 68,
    hasDifference: true,
    diffType: 'MORE',
    diffValue: (newDiff + 999).toString()
  }
];
const check5 = checkBeforeAfterParameters(validBefore, invalidAfterWrongDiff, {}, config);
console.log("Check 5 (Incorrect difference in After state): isValid =", check5.isValid, "defect =", check5.defect);
if (check5.isValid || check5.defect !== 'AFTER_STATE_INCORRECT_DIFF') {
  console.error("FAIL: Should detect AFTER_STATE_INCORRECT_DIFF defect!");
  allPassed = false;
}

// 4. Test ModelSolutionBarModel rendering
console.log("\n4. Testing ModelSolutionBarModel execution:");
try {
  const modelOutput = ModelSolutionBarModel({ config });
  console.log("ModelSolutionBarModel output type:", typeof modelOutput);
} catch (e) {
  console.error("FAIL: ModelSolutionBarModel crashed:", e);
  allPassed = false;
}

// 5. Test AutoFill produces valid Blueprint
console.log("\n5. Testing AutoFill validity for SHIFTING_DIFFERENCE_TRANSFER:");
const autoFillBefore = [
  {
    id: 'before-1',
    name: nameA,
    value: initB ? Number(initB).toLocaleString() : '',
    length: 65,
    hasDifference: true,
    diffType: 'MORE',
    diffValue: initDiff ? Number(initDiff).toLocaleString() : '?',
    diffSegments: [{ id: 'before-seg-1', value: initDiff ? Number(initDiff).toLocaleString() : '?', length: 25 }],
    isCollapsed: false
  },
  {
    id: 'before-2',
    name: nameB,
    value: initB ? Number(initB).toLocaleString() : '',
    length: 42,
    hasDifference: false,
    diffType: 'MORE',
    diffValue: '',
    diffSegments: [],
    isCollapsed: false
  }
];

const autoFillAfter = [
  {
    id: 'after-1',
    name: nameA,
    value: newA ? Number(newA).toLocaleString() : '',
    length: 42,
    hasDifference: false,
    diffType: 'MORE',
    diffValue: '',
    diffSegments: [],
    isCollapsed: false
  },
  {
    id: 'after-2',
    name: nameB,
    value: newA ? Number(newA).toLocaleString() : '',
    length: 68,
    hasDifference: true,
    diffType: 'MORE',
    diffValue: '?',
    diffSegments: [{ id: 'after-seg-1', value: '?', length: 25 }],
    isCollapsed: false
  }
];

const checkAutoFill = checkBeforeAfterParameters(autoFillBefore, autoFillAfter, {}, config);
console.log("AutoFill blueprint validation: isValid =", checkAutoFill.isValid, "defect =", checkAutoFill.defect);
if (!checkAutoFill.isValid) {
  console.error("FAIL: AutoFill blueprint should pass validation! Error:", checkAutoFill.errorMsg);
  allPassed = false;
}

if (allPassed) {
  console.log("\n>>> ALL TESTS PASSED SUCCESSFULLY! <<<");
  process.exit(0);
} else {
  console.error("\n>>> SOME TESTS FAILED <<<");
  process.exit(1);
}
