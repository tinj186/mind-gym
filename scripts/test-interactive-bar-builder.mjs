import assert from 'assert';
import { p4NumberComparisonAndOrderingBlueprint } from '../src/lib/syllabus/math/primary-4/whole-numbers-numbers-up-to-100000/number-comparison-and-ordering.js';

console.log("--- Testing standard_chain_comparison_three_entities Structured Generator ---");

// Test 1: Generate structured question
const genResult = p4NumberComparisonAndOrderingBlueprint.generate("standard", "standard_chain_comparison_three_entities", "structured");
assert(genResult && genResult.aiPrompt, "aiPrompt must exist");
assert(genResult.aiPrompt.includes('"inputType": "INTERACTIVE_BAR_BUILDER"'), "Prompt must include INTERACTIVE_BAR_BUILDER");
assert(genResult.aiPrompt.includes('"correctModelType": "COMPARISON"'), "Prompt must specify COMPARISON model");
assert(genResult.aiPrompt.includes('"problemType": "CHAIN_COMPARISON"'), "Prompt must have CHAIN_COMPARISON problem type");

console.log("✅ Generator correctly produces INTERACTIVE_BAR_BUILDER schema.");

// Test 2: CleanString & Multi-step Grading simulation
const cleanString = (str) => {
  return String(str || '').replace(/[\s,]+/g, '').toLowerCase();
};

const mockSteps = [
  { label: "Find B", expectedAnswer: "12000 + 3000 = 15000", acceptedAnswers: ["15000", "12000+3000=15000"] },
  { label: "Find C", expectedAnswer: "15000 - 2000 = 13000", acceptedAnswers: ["13000", "15000-2000=13000"] },
  { label: "Final Answer", expectedAnswer: "13000", acceptedAnswers: ["13000"] }
];

function gradeSubmission(submitted, steps) {
  let isCorrect = true;
  for (let i = 0; i < steps.length; i++) {
    const studentVal = cleanString(submitted[i]);
    const expectedVal = cleanString(steps[i].expectedAnswer);
    const acceptedVals = steps[i].acceptedAnswers ? steps[i].acceptedAnswers.map(a => cleanString(a)) : [];
    if (studentVal !== expectedVal && !acceptedVals.includes(studentVal)) {
      isCorrect = false;
      break;
    }
  }
  return isCorrect;
}

// Case A: Full equations
assert.strictEqual(gradeSubmission({
  0: "12000 + 3000 = 15000",
  1: "15000 - 2000 = 13000",
  2: "13000"
}, mockSteps), true, "Full equation matching must pass");

// Case B: Raw numbers (from acceptedAnswers)
assert.strictEqual(gradeSubmission({
  0: "15000",
  1: "13000",
  2: "13000"
}, mockSteps), true, "Accepted number answers must pass");

// Case C: Wrong answer
assert.strictEqual(gradeSubmission({
  0: "15000",
  1: "99999",
  2: "13000"
}, mockSteps), false, "Wrong step must fail");

console.log("✅ Multi-step grading logic validated successfully.");
console.log("All tests passed!");
