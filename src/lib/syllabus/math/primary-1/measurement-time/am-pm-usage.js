import { foundationLogic } from './am-pm-usage/foundation';
import { standardLogic } from './am-pm-usage/standard';
import { advancedLogic } from './am-pm-usage/advanced';

export const amPmUsageBlueprint = {
  id: 'p1-am-pm-usage',
  generate: (difficulty, variant, type) => {
    if (difficulty === 'foundation') return foundationLogic.generate(variant, type);
    if (difficulty === 'standard') return standardLogic.generate(variant, type);
    if (difficulty === 'advanced') return advancedLogic.generate(variant, type);
    return foundationLogic.generate(variant, type);
  }
};
