import { foundationLogic } from './multiplication-within-40/foundation';
import { standardLogic } from './multiplication-within-40/standard';
import { advancedLogic } from './multiplication-within-40/advanced';

export const multiplicationWithin40Blueprint = {
  id: 'p1-multiplication-within-40',
  generate: (difficulty, variant, type) => {
    if (difficulty === 'foundation') return foundationLogic.generate(variant, type);
    if (difficulty === 'standard') return standardLogic.generate(variant, type);
    if (difficulty === 'advanced') return advancedLogic.generate(variant, type);
    return foundationLogic.generate(variant, type);
  }
};
