import { foundationLogic } from './set-comparison/foundation';
import { standardLogic } from './set-comparison/standard';
import { advancedLogic } from './set-comparison/advanced';

export const setComparisonBlueprint = {
  id: 'p1-set-comparison',
  generate: (difficulty, variant, type) => {
    if (difficulty === 'foundation') return foundationLogic.generate(variant, type);
    if (difficulty === 'standard') return standardLogic.generate(variant, type);
    if (difficulty === 'advanced') return advancedLogic.generate(variant, type);
    return foundationLogic.generate(variant, type);
  }
};
