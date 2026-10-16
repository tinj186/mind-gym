import { p2MeasurementComparisonBlueprint } from '../src/lib/syllabus/math/primary-2/measurement-length-mass-and-volume/measurement-comparison.js';
import { processAiQuestion } from '../src/lib/intelligence/generation-utils.js';

console.log("Testing p2MeasurementComparisonBlueprint.generate...");

for (const diff of ['foundation', 'standard', 'advanced']) {
  const variants = Object.keys(p2MeasurementComparisonBlueprint.variants).filter(v => v.startsWith(diff + '_'));
  for (const variant of variants) {
    const res = p2MeasurementComparisonBlueprint.generate(diff, variant, 'Short Question');
    if (res.aiPrompt.includes('"string (Line 1)"')) {
      console.error(`FAIL: Generic placeholder found in ${diff} variant: ${variant}`);
      process.exit(1);
    }
  }
}
console.log("All variants in foundation, standard, and advanced tested: NO generic placeholders!");

console.log("\nTesting solutionSteps formatting with duplicate numbers...");
const mockAiQuestion = {
  meta: { level: 'Primary 2', topic: 'Measurement', type: 'SHORT_QUESTION', difficulty: 'Standard' },
  content: {
    questionText: ["A: pail (3 l), B: tank (3060 ml).", "How much more water does Container B hold than Container A?"],
    finalAnswer: "60 ml",
    solutionSteps: [
      "1. Convert to the same unit: 3 l = 3000 ml.",
      "2. Subtract the smaller measurement from the larger measurement.",
      "3. 3060 - 3000 = 60.",
      "4. It is 60 ml more."
    ]
  },
  visualEngine: { componentToRender: "NONE", componentData: { hideVisual: true } }
};

const processed = processAiQuestion(mockAiQuestion, {
  level: 'Primary 2',
  topic: 'Measurement',
  subtopic: 'Measurement Comparison',
  difficulty: 'Standard',
  gradeLevel: 'P2',
  type: 'Short Question'
});

console.log("Processed solution output:");
console.log(processed.solution);
const hasDoubleNumbering = /1\.\s*1\./.test(processed.solution);
console.log("Has double numbering '1. 1.' (should be false):", hasDoubleNumbering);

if (hasDoubleNumbering) {
  console.error("FAIL: Solution still has double numbering!");
  process.exit(1);
} else {
  console.log("SUCCESS: All tests passed!");
}
