const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function testFile(gitPath, markers) {
  console.log('Testing', gitPath);
  const content = execSync(`git show HEAD:${gitPath}`, { encoding: 'utf8' });
  const lines = content.split('\n');

  const indices = markers.map(m => lines.findIndex(l => l.includes(m)));

  for (let i = 0; i < indices.length - 1; i++) {
    let start = indices[i];
    while (!lines[start].includes('{')) start++;
    start++; // line after '{'

    let end = indices[i + 1];
    while (lines[end].trim() !== '}' && lines[end].trim() !== '} else {' && !lines[end].includes('} else if')) {
      end--;
    }

    const slice = lines.slice(start, end);
    console.log(`Variant ${i + 1} start: ${start}, end: ${end}, lines: ${slice.length}`);
    console.log(`  first line: ${slice[0].trim()}`);
    console.log(`  last line:  ${slice[slice.length - 1].trim()}`);

    const code = `
function test({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';
${slice.join('\n')}
  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
`;
    try {
      new Function(code);
      console.log('  syntax: OK');
    } catch (e) {
      console.log('  syntax ERR:', e.message);
    }
  }
}

testFile(
  'src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/graph-axis-scales/standard.js',
  [
    "variant === 'standard_interpolating_halfway_marks'",
    "variant === 'standard_deductive_axis_labeling'",
    "variant === 'standard_comparative_differences_mixed_alignments'",
    "variant === 'standard_total_sum_mixed_alignments'",
    "// Variant 10: Scale Error Correction",
    "const aiPrompt = `CRITICAL INSTRUCTIONS:"
  ]
);

testFile(
  'src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/graph-axis-scales/advanced.js',
  [
    "canonicalVariant === 'advanced_missing_scale_value_difference_deduction'",
    "canonicalVariant === 'advanced_scale_translation_block_projection'",
    "canonicalVariant === 'advanced_blank_axis_financial_application'",
    "canonicalVariant === 'advanced_equalizing_transfer_grid_block_shift'",
    "// Variant 15: Target Shortfall",
    "const aiPrompt = `CRITICAL INSTRUCTIONS:"
  ]
);

testFile(
  'src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/graph-axis-scales/foundation.js',
  [
    "variant === 'foundation_scale_step_identification'",
    "variant === 'foundation_large_scale_summation'",
    "variant === 'foundation_grid_block_multiplication'",
    "variant === 'foundation_scale_verification_difference'",
    "// Variant 5: Combining Multiple Bars on Base Scales",
    "const aiPrompt = `CRITICAL INSTRUCTIONS:"
  ]
);
