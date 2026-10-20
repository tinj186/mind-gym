import { getRandomNames } from '../../../../../utils/variable-bank.js';
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

  const aiPrompt = `CRITICAL INSTRUCTIONS:
1. You MUST use the exact "questionText" provided below.
2. You MUST use the exact "finalAnswer" provided below.
3. Generate detailed, pedagogical "solutionSteps" explaining the reading of the bar graph and calculation.
${mcqOptionsPrompt}

${getFormatInstructions(visualEngineStr, inputRequirementStr, askText, finalAnswer)}`;

  return { aiPrompt };
};
