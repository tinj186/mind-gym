const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '../src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/graph-axis-scales');
const variantsDir = path.join(baseDir, 'variants');

if (!fs.existsSync(variantsDir)) {
  fs.mkdirSync(variantsDir, { recursive: true });
}

function extractBody(lines, startLine, endLine) {
  // Extract lines inside the if/else block
  // Trim outer indentation if needed, but keeping exact lines works identically
  const slice = lines.slice(startLine, endLine);
  return slice.join('\n');
}

function makeVariantModule(funcName, body) {
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
  getThreeTermAdditionAcceptedAnswers
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

// ----------------------------------------------------
// 1. Process standard.js
// ----------------------------------------------------
const stdLines = fs.readFileSync(path.join(baseDir, 'standard.js'), 'utf8').split('\n');

const stdVariants = [
  {
    name: 'standard-interpolating-halfway-marks.js',
    func: 'generateStandardInterpolatingHalfwayMarks',
    start: 108, // starts at `const subType = getRandomInt(1, 7);`
    end: 510
  },
  {
    name: 'standard-deductive-axis-labeling.js',
    func: 'generateStandardDeductiveAxisLabeling',
    start: 522, // starts at `const subType = getRandomInt(1, 6);`
    end: 796
  },
  {
    name: 'standard-comparative-differences-mixed-alignments.js',
    func: 'generateStandardComparativeDifferencesMixedAlignments',
    start: 808, // starts at `const subType = getRandomInt(1, 6);`
    end: 1230
  },
  {
    name: 'standard-total-sum-mixed-alignments.js',
    func: 'generateStandardTotalSumMixedAlignments',
    start: 1242, // starts at `const subType = getRandomInt(1, 6);`
    end: 1664
  },
  {
    name: 'standard-scale-error-correction.js',
    func: 'generateStandardScaleErrorCorrection',
    start: 1677, // starts at `const subType = getRandomInt(1, 7);`
    end: 2069
  }
];

stdVariants.forEach(v => {
  const body = extractBody(stdLines, v.start, v.end);
  const fileContent = makeVariantModule(v.func, body);
  fs.writeFileSync(path.join(variantsDir, v.name), fileContent, 'utf8');
  console.log(`Wrote ${v.name}`);
});

const newStandardContent = `import { getRandomNames } from '../../../../../utils/variable-bank.js';
import { generateStandardInterpolatingHalfwayMarks } from './variants/standard-interpolating-halfway-marks.js';
import { generateStandardDeductiveAxisLabeling } from './variants/standard-deductive-axis-labeling.js';
import { generateStandardComparativeDifferencesMixedAlignments } from './variants/standard-comparative-differences-mixed-alignments.js';
import { generateStandardTotalSumMixedAlignments } from './variants/standard-total-sum-mixed-alignments.js';
import { generateStandardScaleErrorCorrection } from './variants/standard-scale-error-correction.js';

export const generateStandard = (variant, type, getFormatInstructions) => {
  const safeType = String(type || 'short question').toLowerCase();
  const isMCQ = safeType === 'mcq';
  const isShort = safeType === 'short question';
  const isStructure = !isMCQ && !isShort;

  const studentName = getRandomNames(1)[0] || 'Mei Ling';
  const ctx = { isMCQ, isShort, isStructure, studentName };

  let result;
  switch (variant) {
    case 'standard_interpolating_halfway_marks':
      result = generateStandardInterpolatingHalfwayMarks(ctx);
      break;
    case 'standard_deductive_axis_labeling':
      result = generateStandardDeductiveAxisLabeling(ctx);
      break;
    case 'standard_comparative_differences_mixed_alignments':
      result = generateStandardComparativeDifferencesMixedAlignments(ctx);
      break;
    case 'standard_total_sum_mixed_alignments':
      result = generateStandardTotalSumMixedAlignments(ctx);
      break;
    case 'standard_scale_error_correction':
    default:
      result = generateStandardScaleErrorCorrection(ctx);
      break;
  }

  const { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt } = result;

  const aiPrompt = \`CRITICAL INSTRUCTIONS:
1. You MUST use the exact "questionText" provided below.
2. You MUST use the exact "finalAnswer" provided below.
3. Generate detailed, pedagogical "solutionSteps" explaining the reading of the bar graph and calculation.
\${mcqOptionsPrompt}

\${getFormatInstructions(visualEngineStr, inputRequirementStr, askText, finalAnswer)}\`;

  return { aiPrompt };
};
`;

fs.writeFileSync(path.join(baseDir, 'standard.js'), newStandardContent, 'utf8');
console.log('Updated standard.js');

// ----------------------------------------------------
// 2. Process advanced.js
// ----------------------------------------------------
const advLines = fs.readFileSync(path.join(baseDir, 'advanced.js'), 'utf8').split('\n');

const advVariants = [
  {
    name: 'advanced-missing-scale-value-difference-deduction.js',
    func: 'generateAdvancedMissingScaleValueDifferenceDeduction',
    start: 150,
    end: 406
  },
  {
    name: 'advanced-scale-translation-block-projection.js',
    func: 'generateAdvancedScaleTranslationBlockProjection',
    start: 408,
    end: 803
  },
  {
    name: 'advanced-blank-axis-financial-application.js',
    func: 'generateAdvancedBlankAxisFinancialApplication',
    start: 805,
    end: 1125
  },
  {
    name: 'advanced-equalizing-transfer-grid-block-shift.js',
    func: 'generateAdvancedEqualizingTransferGridBlockShift',
    start: 1127,
    end: 1426
  },
  {
    name: 'advanced-target-shortfall-bar-height-prediction.js',
    func: 'generateAdvancedTargetShortfallBarHeightPrediction',
    start: 1438,
    end: 1783
  }
];

advVariants.forEach(v => {
  const body = extractBody(advLines, v.start, v.end);
  const fileContent = makeVariantModule(v.func, body);
  fs.writeFileSync(path.join(variantsDir, v.name), fileContent, 'utf8');
  console.log(`Wrote ${v.name}`);
});

const newAdvancedContent = `import { getRandomNames } from '../../../../../utils/variable-bank.js';
import { generateAdvancedMissingScaleValueDifferenceDeduction } from './variants/advanced-missing-scale-value-difference-deduction.js';
import { generateAdvancedScaleTranslationBlockProjection } from './variants/advanced-scale-translation-block-projection.js';
import { generateAdvancedBlankAxisFinancialApplication } from './variants/advanced-blank-axis-financial-application.js';
import { generateAdvancedEqualizingTransferGridBlockShift } from './variants/advanced-equalizing-transfer-grid-block-shift.js';
import { generateAdvancedTargetShortfallBarHeightPrediction } from './variants/advanced-target-shortfall-bar-height-prediction.js';

export const generateAdvanced = (variant, type, getFormatInstructions) => {
  const safeType = String(type || 'short question').toLowerCase();
  const isMCQ = safeType === 'mcq';
  const isShort = safeType === 'short question';
  const isStructure = !isMCQ && !isShort;

  const studentName = getRandomNames(1)[0] || 'Mei Ling';
  const ctx = { isMCQ, isShort, isStructure, studentName };

  // Map legacy aliases to canonical 5 new variants
  let canonicalVariant = variant;
  if (variant === 'advanced_missing_scale_missing_bar' || variant === 'advanced_axis_deduction_stated_differences') {
    canonicalVariant = 'advanced_missing_scale_value_difference_deduction';
  } else if (variant === 'advanced_drawing_translation_blocks') {
    canonicalVariant = 'advanced_scale_translation_block_projection';
  } else if (variant === 'advanced_financial_large_scales_halfway') {
    canonicalVariant = 'advanced_blank_axis_financial_application';
  } else if (variant === 'advanced_fractional_ratio_halfway') {
    canonicalVariant = 'advanced_equalizing_transfer_grid_block_shift';
  }

  let result;
  switch (canonicalVariant) {
    case 'advanced_missing_scale_value_difference_deduction':
      result = generateAdvancedMissingScaleValueDifferenceDeduction(ctx);
      break;
    case 'advanced_scale_translation_block_projection':
      result = generateAdvancedScaleTranslationBlockProjection(ctx);
      break;
    case 'advanced_blank_axis_financial_application':
      result = generateAdvancedBlankAxisFinancialApplication(ctx);
      break;
    case 'advanced_equalizing_transfer_grid_block_shift':
      result = generateAdvancedEqualizingTransferGridBlockShift(ctx);
      break;
    case 'advanced_target_shortfall_bar_height_prediction':
    default:
      result = generateAdvancedTargetShortfallBarHeightPrediction(ctx);
      break;
  }

  const { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt } = result;

  const aiPrompt = \`CRITICAL INSTRUCTIONS:
1. You MUST use the exact "questionText" provided below.
2. You MUST use the exact "finalAnswer" provided below.
3. Generate detailed, pedagogical "solutionSteps" explaining the reading of the bar graph and calculation.
\${mcqOptionsPrompt}

\${getFormatInstructions(visualEngineStr, inputRequirementStr, askText, finalAnswer)}\`;

  return { aiPrompt };
};
`;

fs.writeFileSync(path.join(baseDir, 'advanced.js'), newAdvancedContent, 'utf8');
console.log('Updated advanced.js');

// ----------------------------------------------------
// 3. Process foundation.js
// ----------------------------------------------------
const fndLines = fs.readFileSync(path.join(baseDir, 'foundation.js'), 'utf8').split('\n');

const fndVariants = [
  {
    name: 'foundation-scale-step-identification.js',
    func: 'generateFoundationScaleStepIdentification',
    start: 168,
    end: 412
  },
  {
    name: 'foundation-large-scale-summation.js',
    func: 'generateFoundationLargeScaleSummation',
    start: 414,
    end: 664
  },
  {
    name: 'foundation-grid-block-multiplication.js',
    func: 'generateFoundationGridBlockMultiplication',
    start: 666,
    end: 888
  },
  {
    name: 'foundation-scale-verification-difference.js',
    func: 'generateFoundationScaleVerificationDifference',
    start: 890,
    end: 1323
  },
  {
    name: 'foundation-combining-multiple-bars.js',
    func: 'generateFoundationCombiningMultipleBars',
    start: 1337,
    end: 1669
  }
];

fndVariants.forEach(v => {
  const body = extractBody(fndLines, v.start, v.end);
  const fileContent = makeVariantModule(v.func, body);
  fs.writeFileSync(path.join(variantsDir, v.name), fileContent, 'utf8');
  console.log(`Wrote ${v.name}`);
});

const newFoundationContent = `import { getRandomNames } from '../../../../../utils/variable-bank.js';
import { generateFoundationScaleStepIdentification } from './variants/foundation-scale-step-identification.js';
import { generateFoundationLargeScaleSummation } from './variants/foundation-large-scale-summation.js';
import { generateFoundationGridBlockMultiplication } from './variants/foundation-grid-block-multiplication.js';
import { generateFoundationScaleVerificationDifference } from './variants/foundation-scale-verification-difference.js';
import { generateFoundationCombiningMultipleBars } from './variants/foundation-combining-multiple-bars.js';

export const generateFoundation = (variant, type, getFormatInstructions) => {
  const safeType = String(type || 'short question').toLowerCase();
  const isMCQ = safeType === 'mcq';
  const isShort = safeType === 'short question';
  const isStructure = !isMCQ && !isShort;

  const studentName = getRandomNames(1)[0] || 'Mei Ling';
  const ctx = { isMCQ, isShort, isStructure, studentName };

  let result;
  switch (variant) {
    case 'foundation_scale_step_identification':
      result = generateFoundationScaleStepIdentification(ctx);
      break;
    case 'foundation_large_scale_summation':
      result = generateFoundationLargeScaleSummation(ctx);
      break;
    case 'foundation_grid_block_multiplication':
      result = generateFoundationGridBlockMultiplication(ctx);
      break;
    case 'foundation_scale_verification_difference':
      result = generateFoundationScaleVerificationDifference(ctx);
      break;
    case 'foundation_combining_multiple_bars':
    default:
      result = generateFoundationCombiningMultipleBars(ctx);
      break;
  }

  const { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt } = result;

  const aiPrompt = \`CRITICAL INSTRUCTIONS:
1. You MUST use the exact "questionText" provided below.
2. You MUST use the exact "finalAnswer" provided below.
3. Generate detailed, pedagogical "solutionSteps" explaining the reading of the bar graph and calculation.
\${mcqOptionsPrompt}

\${getFormatInstructions(visualEngineStr, inputRequirementStr, askText, finalAnswer)}\`;

  return { aiPrompt };
};
`;

fs.writeFileSync(path.join(baseDir, 'foundation.js'), newFoundationContent, 'utf8');
console.log('Updated foundation.js');
