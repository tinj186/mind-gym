import { getRandomNames } from '../../../../../utils/variable-bank.js';
import { generateStandardHalfwayComputations } from './variants/standard-halfway-computations.js';
import { generateStandardTwoStepComparison } from './variants/standard-two-step-comparison.js';
import { generateStandardExternalMultiplier } from './variants/standard-external-multiplier.js';
import { generateStandardSubgroupPartWhole } from './variants/standard-subgroup-part-whole.js';
import { generateStandardBeforeAfterAdjustments } from './variants/standard-before-after-adjustments.js';

export const generateStandard = (variant, type, getFormatInstructions) => {
  const safeType = String(type || 'short question').toLowerCase();
  const isMCQ = safeType === 'mcq';
  const isShort = safeType === 'short question';
  const isStructure = !isMCQ && !isShort;

  const studentName = getRandomNames(1)[0] || 'Mei Ling';
  const ctx = { isMCQ, isShort, isStructure, studentName };

  let result;
  switch (variant) {
    case 'standard_halfway_computations':
      result = generateStandardHalfwayComputations(ctx);
      break;
    case 'standard_two_step_comparison':
      result = generateStandardTwoStepComparison(ctx);
      break;
    case 'standard_external_multiplier':
      result = generateStandardExternalMultiplier(ctx);
      break;
    case 'standard_subgroup_part_whole':
    case 'standard_missing_category_deduction':
      result = generateStandardSubgroupPartWhole(ctx);
      break;
    case 'standard_before_after_adjustments':
    default:
      result = generateStandardBeforeAfterAdjustments(ctx);
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
