const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const baseDir = path.resolve(__dirname, '../src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/bar-graph-interpretation');
const variantsDir = path.join(baseDir, 'variants');

if (!fs.existsSync(variantsDir)) {
  fs.mkdirSync(variantsDir, { recursive: true });
}

function getCleanLines(rel) {
  return execSync(`git show HEAD:${rel}`, { encoding: 'utf8' }).split('\n');
}

function makeModule(funcName, body) {
  return `import {
  getRandomBarGraphTheme,
  getRandomPackagingTheme,
  getRandomSubgroupTheme,
  getRandomBeforeAfterTheme,
  getRandomFinancialTheme,
  getRandomAlgebraicTheme,
  getRandomEqualizingTheme,
  getRandomTargetShortfallTheme,
  getRandomRepackingTheme,
  getRandomNames,
  CONTEXT_TIERS
} from '../../../../../../utils/variable-bank.js';

import {
  getRandomInt,
  capitalize,
  gcd,
  lcm,
  partitionSum,
  formatCategoryList,
  getContextQuery,
  getFourOptions,
  getMultiplicationAcceptedAnswers,
  getDivisionAcceptedAnswers,
  getAdditionAcceptedAnswers,
  getSubtractionAcceptedAnswers,
  getSumAcceptedAnswers
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
// 1. FOUNDATION
// ---------------------------------------------------------------------------
const fndLines = getCleanLines('src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/bar-graph-interpretation/foundation.js');

const fndVariants = [
  {
    name: 'foundation-direct-combination.js',
    func: 'generateFoundationDirectCombination',
    start: 68,
    end: 298
  },
  {
    name: 'foundation-finding-difference.js',
    func: 'generateFoundationFindingDifference',
    start: 299,
    end: 587
  },
  {
    name: 'foundation-threshold-filtering.js',
    func: 'generateFoundationThresholdFiltering',
    start: 588,
    end: 719
  },
  {
    name: 'foundation-reverse-category-deduction.js',
    func: 'generateFoundationReverseCategoryDeduction',
    start: 720,
    end: 1059
  },
  {
    name: 'foundation-remainder-calculation.js',
    func: 'generateFoundationRemainderCalculation',
    start: 1060,
    end: 1206
  }
];

fndVariants.forEach(v => {
  const body = fndLines.slice(v.start, v.end).join('\n');
  const code = makeModule(v.func, body);
  fs.writeFileSync(path.join(variantsDir, v.name), code, 'utf8');
  console.log(`Generated foundation variant: ${v.name}`);
});

const newFoundationContent = `import { getRandomNames } from '../../../../../utils/variable-bank.js';
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

// ---------------------------------------------------------------------------
// 2. STANDARD
// ---------------------------------------------------------------------------
const stdLines = getCleanLines('src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/bar-graph-interpretation/standard.js');

const stdVariants = [
  {
    name: 'standard-halfway-computations.js',
    func: 'generateStandardHalfwayComputations',
    start: 69,
    end: 422
  },
  {
    name: 'standard-two-step-comparison.js',
    func: 'generateStandardTwoStepComparison',
    start: 423,
    end: 806
  },
  {
    name: 'standard-external-multiplier.js',
    func: 'generateStandardExternalMultiplier',
    start: 807,
    end: 1263
  },
  {
    name: 'standard-subgroup-part-whole.js',
    func: 'generateStandardSubgroupPartWhole',
    start: 1264,
    end: 1683
  },
  {
    name: 'standard-before-after-adjustments.js',
    func: 'generateStandardBeforeAfterAdjustments',
    start: 1684,
    end: 2076,
    fixStudentName: true
  }
];

stdVariants.forEach(v => {
  let body = stdLines.slice(v.start, v.end).join('\n');
  if (v.fixStudentName) {
    body = body.replace('const studentName =', 'studentName =');
  }
  const code = makeModule(v.func, body);
  fs.writeFileSync(path.join(variantsDir, v.name), code, 'utf8');
  console.log(`Generated standard variant: ${v.name}`);
});

const newStandardContent = `import { getRandomNames } from '../../../../../utils/variable-bank.js';
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

// ---------------------------------------------------------------------------
// 3. ADVANCED
// ---------------------------------------------------------------------------
const advLines = getCleanLines('src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/bar-graph-interpretation/advanced.js');

const advVariants = [
  {
    name: 'advanced-unit-value-financial.js',
    func: 'generateAdvancedUnitValueFinancial',
    start: 104,
    end: 467
  },
  {
    name: 'advanced-algebraic-multiplier-deduction.js',
    func: 'generateAdvancedAlgebraicMultiplierDeduction',
    start: 468,
    end: 790
  },
  {
    name: 'advanced-equalizing-quantities.js',
    func: 'generateAdvancedEqualizingQuantities',
    start: 791,
    end: 1130
  },
  {
    name: 'advanced-target-shortfall-analysis.js',
    func: 'generateAdvancedTargetShortfallAnalysis',
    start: 1131,
    end: 1490
  },
  {
    name: 'advanced-repacking-grouping.js',
    func: 'generateAdvancedRepackingGrouping',
    start: 1491,
    end: 1853
  }
];

advVariants.forEach(v => {
  const body = advLines.slice(v.start, v.end).join('\n');
  const code = makeModule(v.func, body);
  fs.writeFileSync(path.join(variantsDir, v.name), code, 'utf8');
  console.log(`Generated advanced variant: ${v.name}`);
});

const newAdvancedContent = `import { getRandomNames } from '../../../../../utils/variable-bank.js';
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
console.log('ALL BAR GRAPH INTERPRETATION VARIANTS COMPLETED!');
