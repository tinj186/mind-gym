const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '../src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/graph-axis-scales');

function testVariant(codeLines, start, end, label) {
  const slice = codeLines.slice(start, end).join('\n');
  const code = `
function testFunc({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

${slice}

  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
`;
  try {
    new Function(code);
    console.log(`✅ [${label}] slice syntax valid! (${end - start} lines)`);
    return true;
  } catch (err) {
    console.error(`❌ [${label}] syntax error: ${err.message}`);
    // Print first 5 and last 5 lines
    const sl = codeLines.slice(start, end);
    console.error('First 3 lines:', sl.slice(0, 3));
    console.error('Last 3 lines:', sl.slice(-3));
    return false;
  }
}

// 1. Standard
const stdLines = fs.readFileSync(path.join(baseDir, 'standard.js'), 'utf8').split('\n');
console.log('Testing Standard:');
testVariant(stdLines, 108, 510, 'standard-interpolating-halfway-marks');
testVariant(stdLines, 522, 796, 'standard-deductive-axis-labeling');
testVariant(stdLines, 808, 1230, 'standard-comparative-differences-mixed-alignments');
testVariant(stdLines, 1242, 1664, 'standard-total-sum-mixed-alignments');
testVariant(stdLines, 1677, 2069, 'standard-scale-error-correction');

// 2. Advanced
const advLines = fs.readFileSync(path.join(baseDir, 'advanced.js'), 'utf8').split('\n');
console.log('\nTesting Advanced:');
testVariant(advLines, 150, 406, 'advanced-missing-scale-value-difference-deduction');
testVariant(advLines, 408, 803, 'advanced-scale-translation-block-projection');
testVariant(advLines, 805, 1125, 'advanced-blank-axis-financial-application');
testVariant(advLines, 1127, 1426, 'advanced-equalizing-transfer-grid-block-shift');
testVariant(advLines, 1438, 1783, 'advanced-target-shortfall-bar-height-prediction');

// 3. Foundation
const fndLines = fs.readFileSync(path.join(baseDir, 'foundation.js'), 'utf8').split('\n');
console.log('\nTesting Foundation:');
testVariant(fndLines, 168, 412, 'foundation-scale-step-identification');
testVariant(fndLines, 414, 664, 'foundation-large-scale-summation');
testVariant(fndLines, 666, 888, 'foundation-grid-block-multiplication');
testVariant(fndLines, 890, 1323, 'foundation-scale-verification-difference');
testVariant(fndLines, 1337, 1669, 'foundation-combining-multiple-bars');
