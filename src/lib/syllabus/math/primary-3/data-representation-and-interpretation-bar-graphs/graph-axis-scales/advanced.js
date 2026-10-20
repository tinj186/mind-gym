import { getRandomNames } from '../../../../../utils/variable-bank.js';
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

  const aiPrompt = `CRITICAL INSTRUCTIONS:
1. You MUST use the exact "questionText" provided below.
2. You MUST use the exact "finalAnswer" provided below.
3. Generate detailed, pedagogical "solutionSteps" explaining the reading of the bar graph and calculation.
${mcqOptionsPrompt}

${getFormatInstructions(visualEngineStr, inputRequirementStr, askText, finalAnswer)}`;

  return { aiPrompt };
};
