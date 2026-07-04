import { foundationLogic } from './division-within-20/foundation';
import { standardLogic } from './division-within-20/standard';
import { advancedLogic } from './division-within-20/advanced';

export const divisionWithin20Blueprint = {
  id: 'p1-division-within-20',
  generate: (difficulty, variant, type) => {
    if (difficulty === 'foundation') return foundationLogic.generate(variant, type);
    if (difficulty === 'standard') return standardLogic.generate(variant, type);
    if (difficulty === 'advanced') return advancedLogic.generate(variant, type);
    return foundationLogic.generate(variant, type);
  }
};
