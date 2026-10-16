import { p3LineDrawingPerpendicularParallelBlueprint } from '../src/lib/syllabus/math/primary-3/geometry-perpendicular-and-parallel-lines/line-drawing-perpendicular-parallel.js';

console.log('Testing blueprint generate for Foundation MCQ...');

const variants = Object.keys(p3LineDrawingPerpendicularParallelBlueprint.variants).filter(v => v.startsWith('foundation_'));

for (const variant of variants) {
  const result = p3LineDrawingPerpendicularParallelBlueprint.generate('foundation', variant, 'mcq');
  console.log(`\n=== Variant: ${variant} ===`);
  const hasOptions = result.aiPrompt.includes('Generate EXACTLY 4 options');
  console.log('Prompt contains 4 options directive:', hasOptions);
  if (!hasOptions) {
    console.error('FAILED for variant:', variant);
    process.exit(1);
  }
}

console.log('\nTesting Standard & Advanced variants for MCQ...');
for (const diff of ['standard', 'advanced']) {
  const diffVariants = Object.keys(p3LineDrawingPerpendicularParallelBlueprint.variants).filter(v => v.startsWith(diff + '_'));
  for (const variant of diffVariants) {
    const result = p3LineDrawingPerpendicularParallelBlueprint.generate(diff, variant, 'mcq');
    const hasOptions = result.aiPrompt.includes('Generate EXACTLY 4 options');
    if (!hasOptions) {
      console.error(`FAILED for ${diff} variant:`, variant);
      process.exit(1);
    }
  }
}

console.log('\nALL 15 VARIANTS (Foundation, Standard, Advanced) produce "Generate EXACTLY 4 options"!');
