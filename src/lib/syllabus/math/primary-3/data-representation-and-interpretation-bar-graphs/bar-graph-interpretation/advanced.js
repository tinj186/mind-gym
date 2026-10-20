import { getRandomNames } from '../../../../../utils/variable-bank.js';
import { generateAdvancedUnitValueFinancial } from './variants/advanced-unit-value-financial.js';
import { generateAdvancedAlgebraicMultiplierDeduction } from './variants/advanced-algebraic-multiplier-deduction.js';
import { generateAdvancedEqualizingQuantities } from './variants/advanced-equalizing-quantities.js';
import { generateAdvancedTargetShortfallAnalysis } from './variants/advanced-target-shortfall-analysis.js';
import { generateAdvancedRepackingGrouping } from './variants/advanced-repacking-grouping.js';

export const generateAdvanced = (variant, type, getFormatInstructions) => {
  const safeType = String(type || 'short question').toLowerCase();
  const isMCQ = safeType === 'mcq';
  const isShort = safeType === 'short question';
  const isStructure = !isMCQ && !isShort;

  const studentName = getRandomNames(1)[0] || 'Mei Ling';
  const ctx = { isMCQ, isShort, isStructure, studentName };

  let result;
  switch (variant) {
    case 'advanced_unit_value_financial':
      result = generateAdvancedUnitValueFinancial(ctx);
      break;
    case 'advanced_algebraic_multiplier_deduction':
      result = generateAdvancedAlgebraicMultiplierDeduction(ctx);
      break;
    case 'advanced_equalizing_quantities':
      result = generateAdvancedEqualizingQuantities(ctx);
      break;
    case 'advanced_target_shortfall_analysis':
      result = generateAdvancedTargetShortfallAnalysis(ctx);
      break;
    case 'advanced_repacking_grouping':
    default:
      result = generateAdvancedRepackingGrouping(ctx);
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
