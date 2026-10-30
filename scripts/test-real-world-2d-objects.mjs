import { shapesBlueprint } from '../src/lib/syllabus/math/primary-1/geometry-2d-shapes/shapes.js';
import { _2dShapeIdentificationBlueprint } from '../src/lib/syllabus/math/primary-1/geometry-2d-shapes/2d-shape-identification.js';

let cheeseRuns = 0;
for (let i = 0; i < 200; i++) {
  const isMcq = i % 2 === 0;
  const result = shapesBlueprint.generate('foundation', 'foundation_match_real_object', isMcq ? 'MCQ' : 'SHORT_QUESTION');
  if (result.aiPrompt.includes('cheese wedge')) {
    cheeseRuns++;
    const match = result.aiPrompt.match(/"questionText":\s*"([^"]+)"/);
    const finalAns = result.aiPrompt.match(/"finalAnswer":\s*"([^"]+)"/);
    console.log(`Cheese Wedge Run ${cheeseRuns} (${isMcq ? 'MCQ' : 'SHORT'}):`);
    console.log(`  Question: ${match ? match[1] : 'N/A'}`);
    console.log(`  Final Answer: ${finalAns ? finalAns[1] : 'N/A'}`);
    if (!result.aiPrompt.includes('front triangular face of this cheese wedge')) {
      console.error('FAIL: cheese wedge did not specify face!');
      process.exit(1);
    }
  }
}

console.log(`\nVerified ${cheeseRuns} cheese wedge generations across 200 iterations. All explicitly specified 'front triangular face of this cheese wedge'! 🎉`);
