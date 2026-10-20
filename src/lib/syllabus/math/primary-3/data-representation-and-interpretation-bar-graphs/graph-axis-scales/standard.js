import { getRandomNames } from '../../../../../utils/variable-bank.js';
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

  const aiPrompt = `CRITICAL INSTRUCTIONS:
1. You MUST use the exact "questionText" provided below.
2. You MUST use the exact "finalAnswer" provided below.
3. Generate detailed, pedagogical "solutionSteps" explaining the reading of the bar graph and calculation.
${mcqOptionsPrompt}

${getFormatInstructions(visualEngineStr, inputRequirementStr, askText, finalAnswer)}`;

  return { aiPrompt };
};
