const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const baseDir = path.resolve(__dirname, '../src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/graph-axis-scales');
const variantsDir = path.join(baseDir, 'variants');

function getCleanSource(relativePath) {
  return execSync(`git show HEAD:${relativePath}`, { encoding: 'utf8' }).split('\n');
}

function makeModule(funcName, body) {
  return `import {
  getRandomBarGraphTheme,
  getRandomNames,
  getRandomPaletteColors,
  getRandomFinancialTheme,
  getRandomEqualizingTheme,
  getRandomTargetShortfallTheme,
  getSingularUnit
} from '../../../../../../utils/variable-bank.js';

import {
  getRandomInt,
  getFourOptions,
  getMultiplicationAcceptedAnswers,
  getDivisionAcceptedAnswers,
  getAdditionAcceptedAnswers,
  getSubtractionAcceptedAnswers,
  getThreeTermAdditionAcceptedAnswers,
  getThreeAdditionAcceptedAnswers,
  getDifferenceAcceptedAnswers,
  getSumAcceptedAnswers,
  getThreeTermSumAcceptedAnswers,
  getCombinedAddSubAcceptedAnswers,
  getSubSubAcceptedAnswers,
  getTwoPairsDiffAcceptedAnswers,
  getFourTermAdditionAcceptedAnswers,
  getTwoPairSumAcceptedAnswers
} from '../helpers.js';

export function ${funcName}({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';

${body}

  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
`;
}

// ---------------------------------------------------------------------------
// 1. STANDARD
// ---------------------------------------------------------------------------
const stdLines = getCleanSource('src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/graph-axis-scales/standard.js');

const stdVariants = [
  {
    name: 'standard-interpolating-halfway-marks.js',
    func: 'generateStandardInterpolatingHalfwayMarks',
    start: 99,
    end: 510
  },
  {
    name: 'standard-deductive-axis-labeling.js',
    func: 'generateStandardDeductiveAxisLabeling',
    start: 514,
    end: 796
  },
  {
    name: 'standard-comparative-differences-mixed-alignments.js',
    func: 'generateStandardComparativeDifferencesMixedAlignments',
    start: 800,
    end: 1230
  },
  {
    name: 'standard-total-sum-mixed-alignments.js',
    func: 'generateStandardTotalSumMixedAlignments',
    start: 1234,
    end: 1663
  },
  {
    name: 'standard-scale-error-correction.js',
    func: 'generateStandardScaleErrorCorrection',
    start: 1668,
    end: 2069
  }
];

stdVariants.forEach(v => {
  const body = stdLines.slice(v.start, v.end).join('\n');
  const full = makeModule(v.func, body);
  fs.writeFileSync(path.join(variantsDir, v.name), full, 'utf8');
  console.log(`Generated standard variant: ${v.name}`);
});

// ---------------------------------------------------------------------------
// 2. ADVANCED
// ---------------------------------------------------------------------------
const advLines = getCleanSource('src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/graph-axis-scales/advanced.js');

const advVariants = [
  {
    name: 'advanced-missing-scale-value-difference-deduction.js',
    func: 'generateAdvancedMissingScaleValueDifferenceDeduction',
    start: 149,
    end: 406
  },
  {
    name: 'advanced-scale-translation-block-projection.js',
    func: 'generateAdvancedScaleTranslationBlockProjection',
    start: 407,
    end: 803
  },
  {
    name: 'advanced-blank-axis-financial-application.js',
    func: 'generateAdvancedBlankAxisFinancialApplication',
    start: 804,
    end: 1125
  },
  {
    name: 'advanced-equalizing-transfer-grid-block-shift.js',
    func: 'generateAdvancedEqualizingTransferGridBlockShift',
    start: 1126,
    end: 1424
  },
  {
    name: 'advanced-target-shortfall-bar-height-prediction.js',
    func: 'generateAdvancedTargetShortfallBarHeightPrediction',
    start: 1429,
    end: 1783
  }
];

advVariants.forEach(v => {
  const body = advLines.slice(v.start, v.end).join('\n');
  const full = makeModule(v.func, body);
  fs.writeFileSync(path.join(variantsDir, v.name), full, 'utf8');
  console.log(`Generated advanced variant: ${v.name}`);
});

// ---------------------------------------------------------------------------
// 3. FOUNDATION
// ---------------------------------------------------------------------------
const fndLines = getCleanSource('src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/graph-axis-scales/foundation.js');

const fndVariants = [
  {
    name: 'foundation-scale-step-identification.js',
    func: 'generateFoundationScaleStepIdentification',
    start: 167,
    end: 412
  },
  {
    name: 'foundation-large-scale-summation.js',
    func: 'generateFoundationLargeScaleSummation',
    start: 413,
    end: 664
  },
  {
    name: 'foundation-grid-block-multiplication.js',
    func: 'generateFoundationGridBlockMultiplication',
    start: 665,
    end: 888
  },
  {
    name: 'foundation-scale-verification-difference.js',
    func: 'generateFoundationScaleVerificationDifference',
    start: 889,
    end: 1322
  },
  {
    name: 'foundation-combining-multiple-bars.js',
    func: 'generateFoundationCombiningMultipleBars',
    start: 1327,
    end: 1669
  }
];

fndVariants.forEach(v => {
  const body = fndLines.slice(v.start, v.end).join('\n');
  const full = makeModule(v.func, body);
  fs.writeFileSync(path.join(variantsDir, v.name), full, 'utf8');
  console.log(`Generated foundation variant: ${v.name}`);
});

console.log('ALL 15 VARIANTS GENERATED SUCCESSFULLY!');
