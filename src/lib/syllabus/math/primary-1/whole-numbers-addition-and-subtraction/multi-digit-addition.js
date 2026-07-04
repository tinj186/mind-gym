import { foundationLogic } from './multi-digit-addition/foundation';
import { standardLogic } from './multi-digit-addition/standard';
import { advancedLogic } from './multi-digit-addition/advanced';

export const multiDigitAdditionBlueprint = {
  id: 'p1-multi-digit-addition',
  generate: (difficulty, variant, type) => {
    if (difficulty === 'foundation') return foundationLogic.generate(variant, type);
    if (difficulty === 'standard') return standardLogic.generate(variant, type);
    if (difficulty === 'advanced') return advancedLogic.generate(variant, type);
    return foundationLogic.generate(variant, type);
  }
};
