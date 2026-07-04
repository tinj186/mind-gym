import { foundationLogic } from './time-duration/foundation';
import { standardLogic } from './time-duration/standard';
import { advancedLogic } from './time-duration/advanced';

export const timeDurationBlueprint = {
  id: 'p1-time-duration',
  generate: (difficulty, variant, type) => {
    if (difficulty === 'foundation') return foundationLogic.generate(variant, type);
    if (difficulty === 'standard') return standardLogic.generate(variant, type);
    if (difficulty === 'advanced') return advancedLogic.generate(variant, type);
    return foundationLogic.generate(variant, type);
  }
};
