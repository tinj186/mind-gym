import { foundationLogic } from './length-comparison-cm/foundation';
import { standardLogic } from './length-comparison-cm/standard';
import { advancedLogic } from './length-comparison-cm/advanced';

export const lengthComparisonCmBlueprint = {
  id: 'p1-length-comparison-cm',
  generate: (difficulty, variant, type) => {
    if (difficulty === 'foundation') return foundationLogic.generate(variant, type);
    if (difficulty === 'standard') return standardLogic.generate(variant, type);
    if (difficulty === 'advanced') return advancedLogic.generate(variant, type);
    return foundationLogic.generate(variant, type);
  }
};
