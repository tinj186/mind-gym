import { foundationLogic } from './number-notation/foundation';
import { standardLogic } from './number-notation/standard';
import { advancedLogic } from './number-notation/advanced';

export const numberNotationBlueprint = {
  id: 'p1-number-notation',
  generate: (difficulty, variant, type) => {
    if (difficulty === 'foundation') return foundationLogic.generate(variant, type);
    if (difficulty === 'standard') return standardLogic.generate(variant, type);
    if (difficulty === 'advanced') return advancedLogic.generate(variant, type);
    return foundationLogic.generate(variant, type);
  }
};
