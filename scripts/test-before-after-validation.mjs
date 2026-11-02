import assert from 'assert';
import { checkBeforeAfterParameters, checkBarModelParameters } from '../src/components/math/InteractiveBarBuilder.jsx';

console.log("=== Testing checkBeforeAfterParameters ===");

const config = {
  problemType: "EQUALIZING_TRANSFER",
  targetType: "DIFFERENCE",
  transferFrom: "Deepak",
  transferTo: "Mrs. Teo",
  transferAmount: 8000,
  differenceValue: 16000,
  largerValue: 50500,
  smallerValue: 34500,
  equalizedValue: 42500,
  correctModelType: ["BEFORE_AFTER", "COMPARISON"],
  entities: [
    { id: "B", name: "Mrs. Teo", value: "", displayValue: "", relation: "BASE" },
    { id: "A", name: "Deepak", value: "", displayValue: "", relativeTo: "Mrs. Teo", relation: "MORE", diffValue: "?", displayDiff: "?", actualDiff: 16000 }
  ],
  target: { type: "DIFFERENCE", label: "Difference" }
};

// Case 1: Valid Before & After with multi-segment difference in Before state
const validBeforeBars1 = [
  {
    id: "before-1",
    name: "Deepak",
    value: "",
    length: 65,
    hasDifference: true,
    diffType: "MORE",
    diffValue: "16000",
    diffSegments: [
      { id: "seg-1", value: "8000", length: 20 },
      { id: "seg-2", value: "8000", length: 20 }
    ]
  },
  {
    id: "before-2",
    name: "Mrs. Teo",
    value: "",
    length: 42,
    hasDifference: false
  }
];

const validAfterBars = [
  {
    id: "after-1",
    name: "Deepak",
    value: "1 unit",
    length: 50,
    hasDifference: false
  },
  {
    id: "after-2",
    name: "Mrs. Teo",
    value: "1 unit",
    length: 50,
    hasDifference: false
  }
];

const res1 = checkBeforeAfterParameters(validBeforeBars1, validAfterBars, {}, config);
assert.strictEqual(res1.isValid, true, `Case 1 must pass: ${res1.errorMsg}`);
console.log("✓ Case 1: Multi-segment diff in Before State + Equal After State passed!");

// Case 2: Valid Before State with "?" difference
const validBeforeBars2 = [
  {
    id: "before-1",
    name: "Deepak",
    value: "",
    length: 65,
    hasDifference: true,
    diffType: "MORE",
    diffValue: "?",
    diffSegments: [{ id: "seg-1", value: "?", length: 25 }]
  },
  {
    id: "before-2",
    name: "Mrs. Teo",
    value: "",
    length: 42,
    hasDifference: false
  }
];

const res2 = checkBeforeAfterParameters(validBeforeBars2, validAfterBars, config);
assert.strictEqual(res2.isValid, true, `Case 2 must pass: ${res2.errorMsg}`);
console.log("✓ Case 2: '?' diff in Before State + Equal After State passed!");

// Case 3: Conflicting difference in After State (should fail with friendly error)
const invalidAfterBars = [
  {
    id: "after-1",
    name: "Deepak",
    value: "",
    length: 70,
    hasDifference: true,
    diffType: "MORE",
    diffValue: "8000"
  },
  {
    id: "after-2",
    name: "Mrs. Teo",
    value: "",
    length: 40,
    hasDifference: false
  }
];

const res3 = checkBeforeAfterParameters(validBeforeBars1, invalidAfterBars, config);
assert.strictEqual(res3.isValid, false, "Case 3 must fail when After State is not equal");
console.log(`✓ Case 3: Rejected conflicting after diff correctly (${res3.errorMsg})`);

// Case 4: Missing entity in Before State
const missingBeforeBars = [
  {
    id: "before-1",
    name: "Deepak",
    value: "",
    length: 65,
    hasDifference: true,
    diffType: "MORE",
    diffValue: "16000"
  }
];

const res4 = checkBeforeAfterParameters(missingBeforeBars, validAfterBars, config);
assert.strictEqual(res4.isValid, false, "Case 4 must fail when Before State lacks entities");
console.log(`✓ Case 4: Rejected missing entity in Before State correctly (${res4.errorMsg})`);

// Case 5: Single comparison model directly via checkBarModelParameters
const res5 = checkBarModelParameters(validBeforeBars1, config);
assert.strictEqual(res5.isValid, true, `Case 5 Comparison model check must pass: ${res5.errorMsg}`);
console.log("✓ Case 5: Standard Comparison check passes for the exact same Before bars!");

console.log("\nAll checkBeforeAfterParameters tests passed successfully!");

