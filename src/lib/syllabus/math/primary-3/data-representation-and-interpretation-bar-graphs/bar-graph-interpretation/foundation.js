import { getRandomNames } from '../../../../../utils/variable-bank.js';
import { generateFoundationDirectCombination } from './variants/foundation-direct-combination.js';
import { generateFoundationFindingDifference } from './variants/foundation-finding-difference.js';
import { generateFoundationThresholdFiltering } from './variants/foundation-threshold-filtering.js';
import { generateFoundationReverseCategoryDeduction } from './variants/foundation-reverse-category-deduction.js';
import { generateFoundationRemainderCalculation } from './variants/foundation-remainder-calculation.js';

export const generateFoundation = (variant, type, getFormatInstructions) => {
  const safeType = String(type || 'short question').toLowerCase();
  const isMCQ = safeType === 'mcq';
  const isShort = safeType === 'short question';
  const isStructure = !isMCQ && !isShort;

  const studentName = getRandomNames(1)[0] || 'Mei Ling';
  const ctx = { isMCQ, isShort, isStructure, studentName };

  let result;
  switch (variant) {
    case 'foundation_direct_combination':
      result = generateFoundationDirectCombination(ctx);
      break;
    case 'foundation_finding_difference':
      result = generateFoundationFindingDifference(ctx);
      break;
    case 'foundation_threshold_filtering':
      result = generateFoundationThresholdFiltering(ctx);
      break;
    case 'foundation_reverse_category_deduction':
      result = generateFoundationReverseCategoryDeduction(ctx);
      break;
    case 'foundation_remainder_calculation':
    default:
      result = generateFoundationRemainderCalculation(ctx);
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
