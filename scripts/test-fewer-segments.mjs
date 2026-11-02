import { checkBeforeAfterParameters, checkBarModelParameters } from './temp-builder.mjs';

const configComparison = {
  problemType: "DIFFERENCE_DEDUCTION",
  entities: [
    { id: "A", name: "Deepak", value: "30000", relation: "BASE" },
    { id: "B", name: "Farhan", value: "18000", relation: "FEWER", diffValue: "12000", actualDiff: 12000 }
  ]
};

// Test 1: Comparison model where entity B has FEWER with two shortage segments (6,000 + 6,000 = 12,000)
const barsMultiShortage = [
  { id: 'b1', name: 'Deepak', value: '30000', length: 60, hasDifference: false },
  { 
    id: 'b2', 
    name: 'Farhan', 
    value: '18000', 
    length: 36, 
    hasDifference: true, 
    diffType: 'FEWER',
    diffSegments: [
      { id: 'seg-1', value: '6000', length: 12 },
      { id: 'seg-2', value: '6000', length: 12 }
    ]
  }
];

const res1 = checkBarModelParameters(barsMultiShortage, configComparison, {});
console.log('Test 1 (Comparison with 2 shortage segments 6000 + 6000):', res1);
if (!res1.isValid) {
  throw new Error(`Test 1 Failed: ${res1.errorMsg}`);
}

// Test 2: Before & After model where Farhan has FEWER with 2 shortage segments marked '?'
const configEqualizing = {
  problemType: "EQUALIZING_TRANSFER",
  targetType: "BAR",
  transferAmount: 6000,
  differenceValue: 12000,
  entities: [
    { id: "A", name: "Muthu", value: "?", relation: "MORE", diffValue: "?", actualDiff: 12000 },
    { id: "B", name: "Farhan", value: "?", relation: "BASE" }
  ]
};

const beforeBarsMulti = [
  { id: 'bb1', name: 'Muthu', value: '', length: 65, hasDifference: false },
  {
    id: 'bb2',
    name: 'Farhan',
    value: '',
    length: 45,
    hasDifference: true,
    diffType: 'FEWER',
    diffSegments: [
      { id: 'seg-1', value: '?', length: 10 },
      { id: 'seg-2', value: '?', length: 10 }
    ]
  }
];

const afterBars = [
  { id: 'ab1', name: 'Muthu', value: '36800', length: 50 },
  { id: 'ab2', name: 'Farhan', value: '36800', length: 50 }
];

const res2 = checkBeforeAfterParameters(beforeBarsMulti, afterBars, { from: 'Muthu', to: 'Farhan', amount: '6000' }, configEqualizing);
console.log('Test 2 (Before & After with 2 shortage segments of ?):', res2);
if (!res2.isValid) {
  throw new Error(`Test 2 Failed: ${res2.errorMsg}`);
}

console.log('ALL FEWER MULTI-SEGMENT TESTS PASSED!');
