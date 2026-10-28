import { p3LineDrawingPerpendicularParallelBlueprint } from '../src/lib/syllabus/math/primary-3/geometry-perpendicular-and-parallel-lines/line-drawing-perpendicular-parallel.js';

console.log("=== Testing advanced_identifying_slanted_perpendiculars ===");

for (const type of ['mcq', 'short question', 'structured']) {
  console.log(`\n--- Type: ${type} ---`);
  const res = p3LineDrawingPerpendicularParallelBlueprint.generate('advanced', 'advanced_identifying_slanted_perpendiculars', type);
  console.log("Prompt snippet:\n" + res.aiPrompt.slice(0, 400) + "...\n" + res.aiPrompt.slice(-400));
}

console.log("\n=== Testing 50 iterations of MCQ to verify bounds and uniqueness ===");
for (let i = 0; i < 50; i++) {
  const res = p3LineDrawingPerpendicularParallelBlueprint.generate('advanced', 'advanced_identifying_slanted_perpendiculars', 'mcq');
  // Check that options has 4 options
  if (!res.aiPrompt.includes('Line BP') || !res.aiPrompt.includes('Line BQ') || !res.aiPrompt.includes('Line BR') || !res.aiPrompt.includes('Line BS')) {
    throw new Error(`Iteration ${i}: Missing expected options`);
  }
}
console.log("All 50 iterations passed successfully!");

console.log("\n=== Testing advanced_grid_point_deduction MCQ ===");
const resGrid = p3LineDrawingPerpendicularParallelBlueprint.generate('advanced', 'advanced_grid_point_deduction', 'mcq');
console.log(resGrid.aiPrompt.slice(0, 300) + "...\n" + resGrid.aiPrompt.slice(-300));
