import { checkBeforeAfterParameters, checkBarModelParameters } from '../src/components/math/InteractiveBarBuilder.jsx';

const sampleConfig = {
  problemType: "EQUALIZING_TRANSFER",
  targetType: "BAR",
  targetName: "Muthu",
  transferFrom: "Muthu",
  transferTo: "Farhan",
  transferAmount: 6000,
  differenceValue: 12000,
  largerValue: 42800,
  smallerValue: 30800,
  equalizedValue: 36800,
  grandTotal: 73600,
  displayTransfer: "6,000",
  displayEqualized: "36,800",
  displayDifference: "12,000",
  itemName: "takeout boxes",
  correctModelType: ["BEFORE_AFTER", "COMPARISON"],
  entities: [
    { id: "B", name: "Farhan", value: "?", relation: "BASE", displayValue: "?" },
    { id: "A", name: "Muthu", value: "?", relation: "MORE", diffValue: "?", relativeTo: "Farhan", displayDiff: "?", displayValue: "?", actualDiff: 12000 }
  ],
  target: { type: "BAR", label: "Muthu", targetEntity: "A" }
};

// 1. Student configuration from the screenshot:
// Muthu: long bar (blank)
// Farhan: shorter bar with shortage bracket '?'
// After State: both 36800
const studentBeforeBars = [
  { id: 'b1', name: 'Muthu', value: '', length: 65, hasDifference: false },
  { id: 'b2', name: 'Farhan', value: '', length: 45, hasDifference: true, diffType: 'FEWER', diffValue: '?' }
];

const studentAfterBars = [
  { id: 'a1', name: 'Muthu', value: '36800', length: 50 },
  { id: 'a2', name: 'Farhan', value: '36800', length: 50 }
];

const res1 = checkBeforeAfterParameters(studentBeforeBars, studentAfterBars, { from: 'Muthu', to: 'Farhan', amount: '6000' }, sampleConfig);
console.log('Test 1 (Student submission with ? diff):', res1);
if (!res1.isValid) {
  throw new Error(`Test 1 Failed: ${res1.errorMsg}`);
}

// 2. Student submission with +6000 (transfer amount):
const studentBeforeBars2 = [
  { id: 'b1', name: 'Muthu', value: '', length: 65, hasDifference: true, diffType: 'MORE', diffValue: '6000' },
  { id: 'b2', name: 'Farhan', value: '', length: 45, hasDifference: false }
];
const res2 = checkBeforeAfterParameters(studentBeforeBars2, studentAfterBars, { from: 'Muthu', to: 'Farhan', amount: '6000' }, sampleConfig);
console.log('Test 2 (Student submission with transfer amount 6000):', res2);
if (!res2.isValid) {
  throw new Error(`Test 2 Failed: ${res2.errorMsg}`);
}

// 3. Student submission with +12000 (full difference):
const studentBeforeBars3 = [
  { id: 'b1', name: 'Muthu', value: '', length: 65, hasDifference: true, diffType: 'MORE', diffValue: '12000' },
  { id: 'b2', name: 'Farhan', value: '', length: 45, hasDifference: false }
];
const res3 = checkBeforeAfterParameters(studentBeforeBars3, studentAfterBars, { from: 'Muthu', to: 'Farhan', amount: '6000' }, sampleConfig);
console.log('Test 3 (Student submission with full diff 12000):', res3);
if (!res3.isValid) {
  throw new Error(`Test 3 Failed: ${res3.errorMsg}`);
}

// 4. Backward compatibility: if config still has diffValue: 12000 and Farhan: 30800
const oldConfig = {
  ...sampleConfig,
  entities: [
    { id: "B", name: "Farhan", value: 30800, relation: "BASE", displayValue: "30,800" },
    { id: "A", name: "Muthu", value: "?", relation: "MORE", diffValue: 12000, relativeTo: "Farhan", displayDiff: "+12,000", displayValue: "?" }
  ]
};
const res4 = checkBeforeAfterParameters(studentBeforeBars, studentAfterBars, { from: 'Muthu', to: 'Farhan', amount: '6000' }, oldConfig);
console.log('Test 4 (Old config with diffValue: 12000, but student enters ?):', res4);
if (!res4.isValid) {
  throw new Error(`Test 4 Failed: ${res4.errorMsg}`);
}

console.log('ALL TESTS PASSED SUCCESSFULLY!');
